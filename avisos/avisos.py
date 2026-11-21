"""Serviço de lembretes do Jokenpy (Web Push).

Fica num container separado do app porque precisa de internet para falar com os servidores de push
(Google, Mozilla, Apple), e o container do app não tem internet de propósito: ele roda código de quem usa o curso.
Este serviço não roda código de ninguém e só envia para hosts de push conhecidos.

Guarda em DADOS (um volume):
  vapid.pem      -> chave privada VAPID, criada na primeira vez
  inscricoes.json -> uma entrada por aparelho: assinatura, horário, fuso e um resumo do progresso

Rotas (o app repassa /avisos/<rota> para cá):
  GET  /chave      -> {"chave": <chave pública VAPID em base64url>}
  POST /inscrever  -> {assinatura, hora "HH:MM", fuso, estado}
  POST /estado     -> {endpoint, hora?, estado}
  POST /cancelar   -> {endpoint}
  POST /testar     -> {endpoint}
"""
import base64
import json
import os
import random
import re
import threading
import time
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from cryptography.hazmat.primitives import serialization
from py_vapid import Vapid
from pywebpush import WebPushException, webpush

DADOS = Path(os.environ.get("DADOS", "/dados"))
CONTATO = os.environ.get("VAPID_CONTATO", "mailto:jokenpy@example.com")
MAX_INSCRICOES = 300
HORA_RESGATE = 21   # segundo aviso, só quando a ofensiva está em risco
# Só estes servidores de push recebem pedidos: o endereço vem do navegador, e sem esta lista
# alguém poderia usar este serviço para mandar requisições a qualquer lugar.
HOSTS_PUSH = ("fcm.googleapis.com", "updates.push.services.mozilla.com", "push.services.mozilla.com",
              "web.push.apple.com", ".notify.windows.com", ".push.apple.com")

trava = threading.Lock()
ARQ = DADOS / "inscricoes.json"


# ---------- chaves VAPID ----------
def carregar_vapid() -> tuple[Vapid, str]:
    pem = DADOS / "vapid.pem"
    if not pem.exists():
        v = Vapid()
        v.generate_keys()
        v.save_key(str(pem))
        os.chmod(pem, 0o600)
    v = Vapid.from_file(str(pem))
    publica = v.public_key.public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    return v, base64.urlsafe_b64encode(publica).decode().rstrip("=")


# ---------- inscrições ----------
def ler() -> dict:
    try:
        return json.loads(ARQ.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def gravar(dados: dict):
    tmp = ARQ.with_suffix(".tmp")
    tmp.write_text(json.dumps(dados, ensure_ascii=False), encoding="utf-8")
    tmp.replace(ARQ)


def endpoint_valido(url: str) -> bool:
    try:
        u = urlparse(url)
    except ValueError:
        return False
    host = (u.hostname or "").lower()
    return u.scheme == "https" and any(host == h or (h.startswith(".") and host.endswith(h)) for h in HOSTS_PUSH)


def limpar_estado(e) -> dict:
    e = e if isinstance(e, dict) else {}
    texto = lambda v, n: str(v)[:n] if isinstance(v, str) else ""
    inteiro = lambda v: int(v) if isinstance(v, (int, float)) and 0 <= v < 100000 else 0
    dia = e.get("ultimoDia") if isinstance(e.get("ultimoDia"), str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", e["ultimoDia"]) else None
    return {"ultimoDia": dia, "sequencia": inteiro(e.get("sequencia")), "xpHoje": inteiro(e.get("xpHoje")),
            "meta": inteiro(e.get("meta")) or 10, "protetores": inteiro(e.get("protetores")),
            "trilha": texto(e.get("trilha"), 60), "proxima": texto(e.get("proxima"), 80)}


def hora_valida(h) -> str | None:
    return h if isinstance(h, str) and re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", h) else None


def fuso_valido(f) -> str:
    try:
        ZoneInfo(f)
        return f
    except (ZoneInfoNotFoundError, ValueError, TypeError):
        return "America/Sao_Paulo"


# ---------- mensagens ----------
# Personalizadas com a ofensiva e a próxima lição: lembrete específico funciona melhor que genérico.
# A mesma frase não se repete em dias seguidos.
def mensagem(estado: dict, resgate: bool, ultima: int | None) -> tuple[dict, int]:
    seq, prox, trilha = estado["sequencia"], estado["proxima"], estado["trilha"]
    alvo = f"“{prox}”" if prox else "a próxima lição"
    if resgate and seq:
        opcoes = [
            (f"🔥 Sua ofensiva de {seq} {'dia' if seq == 1 else 'dias'} acaba à meia-noite", f"Uma lição rápida de {trilha or 'estudo'} salva o dia. {alvo} leva uns 5 minutos."),
            (f"⏳ Ainda dá tempo: {seq} {'dia' if seq == 1 else 'dias'} seguidos", f"Faça {alvo} agora e durma com a ofensiva em dia."),
        ]
        if estado["protetores"]:
            opcoes.append((f"🛡️ Você tem {estado['protetores']} protetor(es), mas por que gastar?", f"5 minutos com {alvo} mantêm os {seq} dias sem usar o protetor."))
    elif seq:
        opcoes = [
            (f"🔥 Dia {seq + 1} da sua ofensiva", f"Hoje: {alvo}{f' ({trilha})' if trilha else ''}. Cinco minutos bastam."),
            ("Seu horário de estudo chegou ⏰", f"Você está há {seq} {'dia' if seq == 1 else 'dias'} sem falhar. Bora de {alvo}?"),
            (f"{trilha or 'Jokenpy'}: próxima parada", f"{alvo} está esperando. Mantenha os {seq} {'dia' if seq == 1 else 'dias'} seguidos."),
            ("Pequeno e todo dia > grande e às vezes", f"Uma lição de {trilha or 'programação'} agora: {alvo}."),
        ]
    else:
        opcoes = [
            ("Hora de estudar ⏰", f"Comece uma ofensiva nova hoje com {alvo}. Leva uns 5 minutos."),
            (f"{trilha or 'Jokenpy'} te espera", f"Que tal {alvo} agora? Cinco minutos já contam."),
            ("Recomeçar é fácil", f"Uma lição hoje e a ofensiva volta a contar. Próxima: {alvo}."),
        ]
    k = random.choice([i for i in range(len(opcoes)) if i != ultima] or [0])
    titulo, corpo = opcoes[k]
    return {"titulo": titulo, "corpo": corpo, "url": "/?ir=continuar", "tag": "lembrete"}, k


def enviar(insc: dict, carga: dict) -> str:
    """Devolve 'ok', 'expirada' (apagar) ou 'falha'."""
    try:
        webpush(subscription_info=insc["assinatura"], data=json.dumps(carga, ensure_ascii=False),
                vapid_private_key=VAPID, vapid_claims={"sub": CONTATO}, ttl=6 * 3600, timeout=10,
                headers={"Urgency": "normal"})
        return "ok"
    except WebPushException as e:
        codigo = getattr(e.response, "status_code", None)
        print(f"push falhou ({codigo}): {str(e)[:160]}", flush=True)
        return "expirada" if codigo in (404, 410) else "falha"
    except Exception as e:  # rede fora, etc.
        print(f"push falhou: {e!r}"[:200], flush=True)
        return "falha"


# ---------- agendador: confere a cada 30 s quem precisa de lembrete agora ----------
def agendador():
    while True:
        try:
            rodada()
        except Exception as e:
            print(f"agendador: {e!r}", flush=True)
        time.sleep(30)


def rodada():
    with trava:
        dados = ler()
    mudou, apagar = {}, []
    for chave, insc in dados.items():
        agora = datetime.now(ZoneInfo(insc["fuso"]))
        hoje, hhmm = agora.date().isoformat(), agora.strftime("%H:%M")
        est = insc["estado"]
        if est["ultimoDia"] == hoje:
            continue   # já estudou hoje: nada de lembrete
        ontem = (agora.date() - timedelta(days=1)).isoformat()
        seq = est["sequencia"] if est["ultimoDia"] in (hoje, ontem) else 0
        est = {**est, "sequencia": seq}
        resgate = False
        if hhmm >= insc["hora"] and insc.get("enviado") != hoje:
            pass
        elif seq and agora.hour >= HORA_RESGATE and insc["hora"] < f"{HORA_RESGATE:02d}:00" and insc.get("resgate") != hoje:
            resgate = True
        else:
            continue
        carga, k = mensagem(est, resgate, insc.get("ultimaMsg"))
        r = enviar(insc, carga)
        if r == "expirada":
            apagar.append(chave)
        elif r == "ok" or insc.get("falhas", 0) >= 5:
            mudou[chave] = {("resgate" if resgate else "enviado"): hoje, "ultimaMsg": k, "falhas": 0}
        else:
            mudou[chave] = {"falhas": insc.get("falhas", 0) + 1}
    if mudou or apagar:
        with trava:
            atual = ler()
            for c, m in mudou.items():
                if c in atual:
                    atual[c].update(m)
            for c in apagar:
                atual.pop(c, None)
            gravar(atual)


# ---------- HTTP ----------
ultimo_teste: dict[str, float] = {}


def chave_de(endpoint: str) -> str:
    import hashlib
    return hashlib.sha256(endpoint.encode()).hexdigest()[:24]


class Avisos(BaseHTTPRequestHandler):
    def responder(self, codigo: int, corpo: dict):
        dados = json.dumps(corpo, ensure_ascii=False).encode()
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def log_message(self, *a):   # sem log de cada requisição (não guarda IPs)
        pass

    def do_GET(self):
        if self.path == "/chave":
            return self.responder(200, {"chave": CHAVE_PUBLICA})
        if self.path == "/saude":
            return self.responder(200, {"ok": True})
        self.responder(404, {"detail": "não encontrado"})

    def do_POST(self):
        try:
            tam = int(self.headers.get("Content-Length") or 0)
            if tam > 8000:
                return self.responder(413, {"detail": "grande demais"})
            corpo = json.loads(self.rfile.read(tam) or b"{}")
            if not isinstance(corpo, dict):
                raise ValueError
        except (ValueError, json.JSONDecodeError):
            return self.responder(400, {"detail": "JSON inválido"})
        rota = {"/inscrever": self.inscrever, "/estado": self.estado, "/cancelar": self.cancelar, "/testar": self.testar}.get(self.path)
        if not rota:
            return self.responder(404, {"detail": "não encontrado"})
        rota(corpo)

    def inscrever(self, c):
        a = c.get("assinatura") or {}
        endpoint, chaves = a.get("endpoint"), a.get("keys") or {}
        hora = hora_valida(c.get("hora"))
        if not (isinstance(endpoint, str) and endpoint_valido(endpoint) and isinstance(chaves.get("p256dh"), str) and isinstance(chaves.get("auth"), str)):
            return self.responder(400, {"detail": "assinatura inválida"})
        if not hora:
            return self.responder(400, {"detail": "horário inválido"})
        k = chave_de(endpoint)
        with trava:
            dados = ler()
            if k not in dados and len(dados) >= MAX_INSCRICOES:
                return self.responder(507, {"detail": "limite de inscrições"})
            antigo = dados.get(k, {})
            dados[k] = {"assinatura": {"endpoint": endpoint, "keys": {"p256dh": chaves["p256dh"][:200], "auth": chaves["auth"][:100]}},
                        "hora": hora, "fuso": fuso_valido(c.get("fuso")), "estado": limpar_estado(c.get("estado")),
                        "enviado": antigo.get("enviado"), "resgate": antigo.get("resgate"), "ultimaMsg": antigo.get("ultimaMsg")}
            # mudou o horário para mais tarde hoje: deixa o lembrete de hoje sair no horário novo
            if antigo and antigo.get("hora") != hora:
                dados[k]["enviado"] = None
            gravar(dados)
        self.responder(200, {"ok": True})

    def estado(self, c):
        k = chave_de(str(c.get("endpoint") or ""))
        with trava:
            dados = ler()
            if k not in dados:
                return self.responder(404, {"detail": "inscrição não encontrada"})
            dados[k]["estado"] = limpar_estado(c.get("estado"))
            if hora_valida(c.get("hora")):
                dados[k]["hora"] = c["hora"]
            gravar(dados)
        self.responder(200, {"ok": True})

    def cancelar(self, c):
        k = chave_de(str(c.get("endpoint") or ""))
        with trava:
            dados = ler()
            dados.pop(k, None)
            gravar(dados)
        self.responder(200, {"ok": True})

    def testar(self, c):
        k = chave_de(str(c.get("endpoint") or ""))
        with trava:
            insc = ler().get(k)
        if not insc:
            return self.responder(404, {"detail": "inscrição não encontrada"})
        if time.time() - ultimo_teste.get(k, 0) < 60:
            return self.responder(429, {"detail": "espere um minuto"})
        ultimo_teste[k] = time.time()
        carga, _ = mensagem(insc["estado"], False, None)
        carga["titulo"] = "✅ Lembretes funcionando"
        carga["corpo"] = f"Todo dia às {insc['hora']}, se você ainda não tiver estudado, chega um aviso assim. " + carga["corpo"]
        r = enviar(insc, carga)
        if r == "expirada":
            with trava:
                d = ler(); d.pop(k, None); gravar(d)
            return self.responder(404, {"detail": "inscrição expirada"})
        self.responder(200 if r == "ok" else 502, {"ok": r == "ok"})


if __name__ == "__main__":
    DADOS.mkdir(parents=True, exist_ok=True)
    VAPID, CHAVE_PUBLICA = carregar_vapid()
    threading.Thread(target=agendador, daemon=True).start()
    porta = int(os.environ.get("PORTA", "8090"))
    print(f"avisos ouvindo na porta {porta}", flush=True)
    ThreadingHTTPServer(("0.0.0.0", porta), Avisos).serve_forever()
