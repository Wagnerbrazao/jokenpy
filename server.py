"""Jokenpy: servidor do curso de Python.

Rode dentro da pasta jokenpo:
    python -m uvicorn server:app --port 8080
e abra http://localhost:8080
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

from fastapi import Body, FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

PASTA = Path(__file__).parent
app = FastAPI(title="Jokenpy")


# ---------- configuração da IA (a chave fica só aqui no servidor, nunca vai para o navegador) ----------
def ler_env():
    arquivo = PASTA / ".env"
    if arquivo.exists():
        for linha in arquivo.read_text(encoding="utf-8").splitlines():
            if "=" in linha and not linha.lstrip().startswith("#"):
                nome, valor = linha.split("=", 1)
                os.environ.setdefault(nome.strip(), valor.strip())


ler_env()
CHAVE_GEMINI = os.environ.get("GEMINI_API_KEY", "")
MODELO = os.environ.get("GEMINI_MODEL", "gemini-flash-lite-latest")
# Hospedado para várias pessoas: o progresso fica só no navegador de cada uma.
PUBLICO = os.environ.get("JOKENPY_PUBLICO") == "1"


class Execucao(BaseModel):
    codigo: str
    entrada: str = ""  # o que o "usuário" digita nos input()
    antes: str = ""    # roda antes do seu código (ex.: fixar o sorteio)
    teste: str = ""    # asserts que rodam depois do seu código


class Salvar(BaseModel):
    codigo: str


def checar_origem(x_jokenpy: str | None):
    # Um header próprio obriga o navegador a pedir permissão (preflight),
    # então outro site aberto no navegador não consegue chamar esta API.
    if x_jokenpy != "1":
        raise HTTPException(403, "Requisição não permitida")


@app.get("/")
def pagina():
    return FileResponse(PASTA / "index.html")


@app.get("/licoes.js")
def licoes():
    return FileResponse(PASTA / "licoes.js", media_type="text/javascript")


@app.get("/app.js")
def app_js():
    return FileResponse(PASTA / "app.js", media_type="text/javascript")


# ---------- progresso: cópia de segurança em arquivo (o navegador também guarda) ----------
ARQUIVO_PROGRESSO = Path(os.environ.get("JOKENPY_PROGRESSO", PASTA / "progresso.json"))


@app.get("/progresso")
def ler_progresso():
    if PUBLICO:
        return {}
    if ARQUIVO_PROGRESSO.exists():
        try:
            return json.loads(ARQUIVO_PROGRESSO.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


@app.put("/progresso")
def gravar_progresso(dados: dict = Body(...), x_jokenpy: str | None = Header(default=None)):
    checar_origem(x_jokenpy)
    texto = json.dumps(dados, ensure_ascii=False)
    if len(texto) > 500_000:
        raise HTTPException(413, "Progresso grande demais")
    if PUBLICO:
        return {"ok": True}
    temporario = ARQUIVO_PROGRESSO.with_suffix(".tmp")
    temporario.write_text(texto, encoding="utf-8")
    temporario.replace(ARQUIVO_PROGRESSO)  # troca de uma vez: nunca fica um arquivo pela metade
    return {"ok": True}


MARCA_INPUT = re.compile("\x01.*?\x02", re.S)


def separar_saida(texto: str):
    """Devolve (saída para mostrar, saída só com o que o programa imprimiu)."""
    limpa = MARCA_INPUT.sub("", texto)
    limpa = re.sub("\x01.*", "", limpa, flags=re.S)  # input() que não terminou (EOF ou tempo esgotado)
    return texto.replace("\x01", "").replace("\x02", ""), limpa


@app.post("/executar")
def executar(dados: Execucao, x_jokenpy: str | None = Header(default=None)):
    checar_origem(x_jokenpy)
    with tempfile.TemporaryDirectory() as pasta:
        arquivo = Path(pasta) / "dados.json"
        arquivo.write_text(json.dumps(dados.model_dump()), encoding="utf-8")
        comando = [sys.executable, "-X", "utf8", str(PASTA / "_executor.py"), str(arquivo)]
        try:
            r = subprocess.run(
                comando, input=dados.entrada, capture_output=True,
                text=True, encoding="utf-8", timeout=3, cwd=pasta,
            )
        except subprocess.TimeoutExpired as e:
            bruto = e.stdout or b""
            saida, limpa = separar_saida(bruto.decode("utf-8", "replace") if isinstance(bruto, bytes) else bruto)
            return {"ok": False, "saida": saida[-3000:], "saida_limpa": limpa[-3000:],
                    "erro": "Tempo esgotado (3 s). Seu código entrou num loop infinito?"}
    saida, limpa = separar_saida(r.stdout)
    return {"ok": r.returncode == 0, "saida": saida[-10000:], "saida_limpa": limpa[-10000:], "erro": r.stderr.strip()}


class PedidoIA(BaseModel):
    acao: str              # dica | dica_questao | completar | revisar | explicar
    tipo: str = ""         # escolha | completar | montar (para dica_questao)
    opcoes: str = ""       # opções ou peças disponíveis
    enunciado: str = ""
    codigo: str = ""
    cursor: int | None = None
    saida: str = ""
    erro: str = ""
    resposta: str = ""     # solução de referência (ou a resposta certa)
    escolhida: str = ""    # o que o aluno respondeu (para explicar)


TUTOR = (
    "Você é a Py, tutora de Python paciente para iniciantes, num curso que ensina Python "
    "construindo um jogo de pedra, papel e tesoura. Responda em português do Brasil, "
    "curto, direto e encorajador. Fale com o aluno usando 'você'."
)


def montar_prompt(p: PedidoIA) -> str:
    execucao = ""
    if p.saida or p.erro:
        execucao = f"\nÚltima execução do código do aluno:\nSaída:\n{p.saida[-1500:]}\nErro: {p.erro or '(nenhum)'}\n"

    if p.acao == "dica":
        return f"""{TUTOR}

Exercício: {p.enunciado}

Código atual do aluno:
```python
{p.codigo}
```
{execucao}
Solução de referência (NÃO mostre ao aluno; use só para saber aonde ele precisa chegar):
```python
{p.resposta}
```

Dê UMA dica para o próximo passo, em no máximo 3 frases curtas.
Se houver erro, explique em palavras simples o que causou e em que linha.
Não escreva a solução. No máximo cite um trecho de uma linha entre crases."""

    if p.acao == "completar":
        cursor = len(p.codigo) if p.cursor is None else max(0, min(p.cursor, len(p.codigo)))
        marcado = p.codigo[:cursor] + "<CURSOR>" + p.codigo[cursor:]
        return f"""Você completa código Python para um iniciante, como um autocomplete.

Exercício: {p.enunciado}

Solução de referência (use como guia do que vem a seguir):
```python
{p.resposta}
```

Código do aluno, com a posição do cursor marcada como <CURSOR>:
```python
{marcado}
```

Responda SOMENTE com o texto que deve ser inserido exatamente no lugar de <CURSOR>:
no máximo 3 linhas, indentação de 4 espaços, sem repetir o que já existe antes ou depois do cursor,
sem markdown e sem explicação. Se não houver nada útil para completar, responda vazio."""

    if p.acao == "revisar":
        return f"""{TUTOR}

Exercício: {p.enunciado}

O código do aluno PASSOU nos testes:
```python
{p.codigo}
```

Comece com um elogio específico de uma frase. Depois dê até 3 sugestões curtas e práticas
para deixar o código melhor (nomes, simplificação, boas práticas), adequadas para iniciante,
em lista com "- ". Não reescreva o programa inteiro."""

    if p.acao == "dica_questao":
        tipos = {"escolha": "múltipla escolha", "completar": "completar as lacunas ____ do código",
                 "montar": "montar a linha de código com peças na ordem certa"}
        codigo = f"\nCódigo do exercício:\n```python\n{p.codigo}\n```\n" if p.codigo else ""
        opcoes = f"\nOpções/peças disponíveis: {p.opcoes}\n" if p.opcoes else ""
        return f"""{TUTOR}

Exercício ({tipos.get(p.tipo, p.tipo)}): {p.enunciado}
{codigo}{opcoes}
Resposta do aluno até agora: {p.escolhida or "(ainda nada)"}
Resposta certa (NÃO revele): {p.resposta}

Dê UMA dica curta (no máximo 2 frases) que faça o aluno pensar e descobrir sozinho.
NÃO diga a resposta, NÃO diga qual opção é a certa e NÃO mostre a ordem completa das peças.
Pode lembrar o conceito de Python envolvido."""

    if p.acao == "explicar":
        codigo = f"\nCódigo mostrado na pergunta:\n```python\n{p.codigo}\n```\n" if p.codigo else ""
        return f"""{TUTOR}

Pergunta do exercício: {p.enunciado}
{codigo}
O aluno respondeu: {p.escolhida}
Resposta certa: {p.resposta}

Em no máximo 3 frases, explique por que a resposta certa está certa
e qual foi o provável erro de raciocínio do aluno."""

    raise HTTPException(400, "Ação desconhecida")


def chamar_gemini(prompt: str) -> str:
    corpo = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 400,
                             "thinkingConfig": {"thinkingLevel": "low"}},
    }
    pedido = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent",
        data=json.dumps(corpo).encode(),
        headers={"x-goog-api-key": CHAVE_GEMINI, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(pedido, timeout=30) as r:
            dados = json.load(r)
    except urllib.error.HTTPError as e:
        if e.code in (429, 503):
            raise HTTPException(503, "A IA está ocupada agora. Tente de novo em alguns segundos.")
        raise HTTPException(502, f"A IA respondeu com erro {e.code}.")
    except (urllib.error.URLError, TimeoutError):
        raise HTTPException(504, "Não consegui falar com a IA. Verifique a internet.")
    partes = dados.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    return "".join(p.get("text", "") for p in partes).strip()


def limpar_sugestao(texto: str, codigo: str, cursor: int) -> str:
    texto = re.sub(r"^```\w*\n?|\n?```$", "", texto.strip("\n")).rstrip()
    texto = texto.replace("<CURSOR>", "")
    linha_atual = codigo[:cursor].rsplit("\n", 1)[-1]
    if linha_atual.strip() and texto.lstrip().startswith(linha_atual.strip()):
        texto = texto.lstrip()[len(linha_atual.strip()):]   # a IA repetiu o começo da linha
    elif not linha_atual.strip():
        texto = texto.lstrip(" ")                          # o cursor já está indentado
    return texto


@app.get("/ia/status")
def ia_status():
    return {"ativa": bool(CHAVE_GEMINI), "modelo": MODELO, "publico": PUBLICO}


@app.post("/ia")
def ia(p: PedidoIA, x_jokenpy: str | None = Header(default=None)):
    checar_origem(x_jokenpy)
    if not CHAVE_GEMINI:
        raise HTTPException(503, "IA desligada: coloque GEMINI_API_KEY no arquivo jokenpo/.env")
    texto = chamar_gemini(montar_prompt(p))
    if p.acao == "completar":
        cursor = len(p.codigo) if p.cursor is None else p.cursor
        texto = limpar_sugestao(texto, p.codigo, cursor)
    return {"texto": texto}


@app.post("/salvar")
def salvar(dados: Salvar, x_jokenpy: str | None = Header(default=None)):
    checar_origem(x_jokenpy)
    if PUBLICO:
        return {"arquivo": None}
    destino = PASTA / "meu_jokenpo.py"
    destino.write_text(dados.codigo, encoding="utf-8")
    return {"arquivo": str(destino)}
