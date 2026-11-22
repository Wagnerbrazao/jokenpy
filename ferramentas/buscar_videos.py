"""Busca vídeos no YouTube para escolher os de um módulo, e confere se dá para incorporar no app.

    python3 ferramentas/buscar_videos.py "spring boot injeção de dependência"   # lista candidatos
    python3 ferramentas/buscar_videos.py --conferir ID1 ID2 ...                  # confere IDs (oEmbed)

A lista mostra: id, duração, canal, visualizações, há quanto tempo foi publicado e se incorpora (✓/✗).
Só use vídeo com ✓: os outros abrem com erro dentro do app.
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

CABECALHO = {"Accept-Language": "pt-BR,pt;q=0.9", "User-Agent": "Mozilla/5.0"}


def pegar(url: str, timeout=15) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=CABECALHO), timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def incorpora(vid: str) -> dict | None:
    """Título e canal se o vídeo existe e permite ser incorporado; None caso contrário."""
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(f"https://www.youtube.com/watch?v={vid}")
    try:
        return json.loads(pegar(url, 10))
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return None


def buscar(termo: str, n=12) -> list[dict]:
    html = pegar("https://www.youtube.com/results?search_query=" + urllib.parse.quote(termo))
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        return []
    achados = []

    def andar(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                achados.append({
                    "id": v["videoId"],
                    "titulo": "".join(r["text"] for r in v["title"]["runs"]),
                    "duracao": v.get("lengthText", {}).get("simpleText", "?"),
                    "canal": v.get("ownerText", {}).get("runs", [{}])[0].get("text", "?"),
                    "views": v.get("viewCountText", {}).get("simpleText", ""),
                    "quando": v.get("publishedTimeText", {}).get("simpleText", ""),
                })
            for x in o.values():
                andar(x)
        elif isinstance(o, list):
            for x in o:
                andar(x)

    andar(json.loads(m.group(1)))
    return achados[:n]


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    if args[0] == "--conferir":
        ruins = 0
        for vid in args[1:]:
            info = incorpora(vid)
            ruins += info is None
            print(f"{'✓' if info else '✗'} {vid}  {info['title'] + ' · ' + info['author_name'] if info else 'não existe ou não permite incorporar'}")
        sys.exit(1 if ruins else 0)
    for v in buscar(" ".join(args)):
        ok = "✓" if incorpora(v["id"]) else "✗"
        print(f"{ok} {v['id']}  {v['duracao']:>8}  {v['canal'][:28]:<28} {v['views'][:22]:<22} {v['quando']:<16} {v['titulo'][:90]}")
