"""Roda soluções alternativas (legítimas e trapaças) contra os exercícios de código do licoes.js.
Legítimas devem passar; trapaças devem falhar. Usa a mesma lógica de correção do app.js (padrao/temProibido)."""
import json, os, re, subprocess, sys, tempfile, unicodedata

PASTA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXEC = os.path.join(PASTA, '_executor.py')
env = dict(os.environ, PATH=os.path.expanduser('~/.local/node/bin') + ':' + os.environ['PATH'])
LICOES = json.loads(subprocess.run(['node', '-e', f"process.stdout.write(JSON.stringify(require('{PASTA}/licoes.js')))"],
                                   capture_output=True, text=True, env=env, check=True).stdout)
EX = {f"{l['id']}-{k}": it for l in LICOES for k, it in enumerate(l['exercicios'])}


def padrao(s):
    s = unicodedata.normalize('NFD', s or '')
    s = re.sub('[\u0300-\u036f]', '', s)
    s = re.sub(r'[!?.¡¿]', '', s.lower())
    s = re.sub(r'[,:;]', ' ', s)
    return re.sub(r'\s+', ' ', s)


def tem_proibido(s, espera, proibido):
    # igual ao app.js: só recorta o esperado quando o proibido está dentro dele
    e = padrao(espera or '')
    for p in (proibido or []):
        q = padrao(p)
        if q in (' | '.join(s.split(e)) if e and q in e else s):
            return p
    return None


def rodar(codigo, entrada='', antes='', teste=''):
    with tempfile.TemporaryDirectory() as d:
        f = os.path.join(d, 'dados.json')
        with open(f, 'w', encoding='utf-8') as h:
            json.dump({'codigo': codigo, 'entrada': entrada, 'antes': antes, 'teste': teste}, h)
        try:
            r = subprocess.run([sys.executable, '-X', 'utf8', EXEC, f], input=entrada, capture_output=True,
                               text=True, encoding='utf-8', timeout=3, cwd=d)
        except subprocess.TimeoutExpired:
            return False, '', 'timeout'
        limpa = re.sub('\x01.*', '', re.sub('\x01.*?\x02', '', r.stdout, flags=re.S), flags=re.S)
        return r.returncode == 0, limpa, r.stderr.strip()


def casos(it):
    return it.get('casos') or [{'entrada': it.get('entrada', ''), 'espera': it.get('espera'), 'proibido': it.get('proibido')}]


def passa(it, codigo):
    for c in casos(it):
        ok, saida, erro = rodar(codigo, c.get('entrada') or '', it.get('antes') or '', it.get('teste') or '')
        s = padrao(saida)
        if not ok: return False, f"erro: {erro[:150]} | entrada {c.get('entrada')!r}"
        if c.get('espera') and padrao(c['espera']) not in s: return False, f"faltou {c['espera']!r} em {saida[-160:]!r}"
        p = tem_proibido(s, c.get('espera'), c.get('proibido'))
        if p: return False, f"proibido {p!r} em {saida[-160:]!r}"
    return True, ''


V = {}  # id -> (legitimas, trapacas)
def L(i, *cods): V.setdefault(i, ([], []))[0].extend(cods)
def T(i, *cods): V.setdefault(i, ([], []))[1].extend(cods)

VENCE = 'vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}\n'
OPC = 'opcoes = ["pedra", "papel", "tesoura"]\n'
RES = '''def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"
'''

# ---------- print-7
L('print-7',
  'jogada = "pedra"\nprint(f"Você jogou {jogada}")',
  "jogada = 'pedra'\nprint(f'você jogou {jogada}!')",
  'jogada = "pedra"\nprint("Você jogou", jogada)',
  'jogada = "pedra"\nprint("Voce jogou " + jogada + ".")',
  'jogada = "pedra"\nprint(f"VOCÊ JOGOU {jogada.upper()}")',
  'print("Olá!")\njogada = "pedra"\nprint(f"Você jogou {jogada}")',
)
T('print-7', 'jogada = "papel"\nprint(f"Você jogou {jogada}")', 'print("Você jogou pedra")')

# ---------- input-6
L('input-6',
  'jogada = input("Sua jogada: ")\njogada = jogada.strip().lower()\nprint(f"Você jogou {jogada}")',
  'jogada = input()\njogada = jogada.lower().strip()\nprint("Você jogou", jogada)',
  'jogada = input("Digite pedra, papel ou tesoura: ").strip().lower()\nprint("Você jogou " + jogada + "!")',
  'jogada = input("Jogada? ")\njogada = jogada.strip()\njogada = jogada.lower()\nprint(f"você jogou {jogada}.")',
)
T('input-6', 'jogada = input()\nprint(f"Você jogou {jogada}")',
  'jogada = input().lower()\nprint(f"Você jogou {jogada}")',
  'jogada = input()\njogada.strip().lower()\nprint(f"Você jogou {jogada}")')

# ---------- input-7
L('input-7',
  'vitorias = int(input("Vitórias até agora: "))\nprint(f"Com mais uma, serão {vitorias + 1}")',
  'vitorias = input("Vitórias: ")\nvitorias = int(vitorias)\nprint("Com mais uma, serão", vitorias + 1)',
  'vitorias = int(input())\nprint(f"Com mais uma serão {vitorias + 1}!")',
  'vitorias = int(input("Quantas vitórias? "))\ntotal = vitorias + 1\nprint("Com mais uma, serao " + str(total) + ".")',
  'vitorias = int(input())\nvitorias = vitorias + 1\nprint(f"Com mais uma, serão {vitorias}")',
)
T('input-7', 'vitorias = int(input())\nprint(f"Com mais uma, serão {vitorias}")',
  'vitorias = input()\nprint(f"Com mais uma, serão {vitorias}1")',
  'vitorias = int(input())\nprint("Com mais uma, serão 4")')

# ---------- random-6
L('random-6',
  'import random\n\nopcoes = ["pedra", "papel", "tesoura"]\ncomputador = random.choice(opcoes)\nprint(f"Computador: {computador}")',
  'import random\nopcoes = ["pedra", "papel", "tesoura"]\ncomputador = random.choice(opcoes)\nprint("Computador:", computador)',
  'from random import choice\nopcoes = ["pedra", "papel", "tesoura"]\ncomputador = choice(opcoes)\nprint("computador: " + computador + "!")',
  "import random\nopcoes = ['pedra', 'papel', 'tesoura']\nprint('Sorteando...')\ncomputador = random.choice(opcoes)\nprint(f'Computador: {computador}')",
)
T('random-6', 'opcoes = ["pedra", "papel", "tesoura"]\ncomputador = "papel"\nprint(f"Computador: {computador}")',
  'import random\nopcoes = ["pedra", "papel", "tesoura"]\ncomputador = opcoes[1]\nprint(f"Computador: {computador}")')

# ---------- random-7
L('random-7',
  OPC + 'jogada = input("Sua jogada: ").strip().lower()\nprint(jogada in opcoes)',
  OPC + 'jogada = input("Sua jogada: ")\njogada = jogada.strip().lower()\nif jogada in opcoes:\n    print(True)\nelse:\n    print(False)',
  OPC + 'jogada = input()\njogada = jogada.lower().strip()\nvalida = jogada in opcoes\nprint("Jogada válida?", valida)',
  OPC + 'jogada = input("Sua jogada: ")\nprint(jogada.strip().lower() in opcoes)',
)
T('random-7', OPC + 'jogada = input()\nprint(jogada.lower() in opcoes)',
  OPC + 'jogada = input()\nprint(jogada.strip() in opcoes)', OPC + 'input()\nprint(True)', OPC + 'input()\nprint(True, False)')

# ---------- if-6
IN6 = 'jogador = input("Você: ")\ncomputador = input("Computador: ")\n'
L('if-6',
  IN6 + 'if jogador == computador:\n    print("Empate!")\nelse:\n    print("Não foi empate")',
  IN6 + 'if jogador == computador:\n    print("empate")\nelse:\n    print("não foi empate!")',
  IN6 + 'if jogador != computador:\n    print("Não foi empate.")\nelse:\n    print("Empate!")',
  IN6 + 'if jogador == computador:\n    print("Empate!")\nif jogador != computador:\n    print("Nao foi empate")',
  'jogador = input()\ncomputador = input()\nprint(f"{jogador} x {computador}")\nif jogador == computador:\n    print("É empate!")\nelse:\n    print("Não foi empate, alguém venceu")',
)
T('if-6', IN6 + 'print("Empate!")\nprint("Não foi empate")', IN6 + 'print("Não foi empate")',
  IN6 + 'if jogador == computador:\n    print("Empate!")\nprint("Não foi empate")')

# ---------- if-7
IN7 = OPC + 'jogada = input("Sua jogada (ou sair): ").strip().lower()\n'
L('if-7',
  IN7 + 'if jogada == "sair":\n    print("Até mais!")\nelif jogada in opcoes:\n    print(f"Jogada aceita: {jogada}")\nelse:\n    print("Jogada inválida")',
  IN7 + 'if jogada in opcoes:\n    print("Jogada aceita:", jogada)\nelif jogada == "sair":\n    print("até mais")\nelse:\n    print("Jogada invalida!")',
  IN7 + 'if jogada == "sair":\n    print("Até mais!")\nelse:\n    if jogada in opcoes:\n        print("Jogada aceita: " + jogada)\n    else:\n        print("Jogada inválida!")',
  OPC + 'jogada = input("Digite pedra, papel, tesoura ou sair: ").strip().lower()\nif jogada == "sair":\n    print("Até mais!")\nelif jogada in opcoes:\n    print(f"Jogada aceita: {jogada}!")\nelse:\n    print("Jogada inválida.")',
)
T('if-7', IN7 + 'print("Até mais!")\nprint(f"Jogada aceita: {jogada}")\nprint("Jogada inválida")',
  IN7 + 'if jogada == "sair":\n    print("Até mais!")\nprint(f"Jogada aceita: {jogada}")')

# ---------- dict-5
IN5 = VENCE + 'jogada = input("Jogada: ")\n'
L('dict-5',
  IN5 + 'print(f"{jogada} vence {vence[jogada]}")',
  IN5 + 'print(jogada, "vence", vence[jogada])',
  IN5 + 'perdedor = vence[jogada]\nprint(jogada + " vence " + perdedor + "!")',
  VENCE + 'jogada = input("Digite pedra, papel ou tesoura: ")\nprint(f"{jogada.capitalize()} vence {vence[jogada]}.")',
  VENCE + 'jogada = input()\nprint(f"A regra é: {jogada} vence {vence[jogada]}")',
)
T('dict-5', IN5 + 'print("pedra vence tesoura")\nprint("papel vence pedra")\nprint("tesoura vence papel")',
  IN5 + 'for k in vence:\n    print(k, "vence", vence[k])')

# ---------- dict-6
IN66 = VENCE + 'jogador = input("Você: ")\ncomputador = input("Computador: ")\n'
L('dict-6',
  IN66 + 'if jogador == computador:\n    print("Empate!")\nelif vence[jogador] == computador:\n    print("Você venceu!")\nelse:\n    print("Computador venceu!")',
  IN66 + 'if jogador == computador:\n    print("empate")\nelif vence[computador] == jogador:\n    print("Computador venceu")\nelse:\n    print("Voce venceu")',
  IN66 + 'if jogador == computador:\n    print("Empate!")\nelse:\n    if vence[jogador] == computador:\n        print("Você venceu!")\n    else:\n        print("Computador venceu!")',
  IN66 + 'print(f"Você jogou {jogador} e o computador jogou {computador}")\nif computador == vence[jogador]:\n    print("Você venceu!")\nelif jogador == computador:\n    print("Empate!")\nelse:\n    print("Computador venceu!")',
)
T('dict-6', IN66 + 'if jogador == computador:\n    print("Empate!")\nelif vence[computador] == jogador:\n    print("Você venceu!")\nelse:\n    print("Computador venceu!")',
  IN66 + 'print("Empate!")\nprint("Você venceu!")\nprint("Computador venceu!")')

# ---------- funcao-5
L('funcao-5',
  VENCE + '\ndef perde_para(jogada):\n    return vence[jogada]\n\nprint(perde_para("pedra"))',
  VENCE + '\ndef perde_para(jogada):\n    perdedor = vence[jogada]\n    return perdedor\n\nprint(perde_para("pedra"))',
  VENCE + '\ndef perde_para(jogada):\n    if jogada == "pedra":\n        return "tesoura"\n    elif jogada == "papel":\n        return "pedra"\n    else:\n        return "papel"\n\nprint(perde_para("pedra"))',
)
T('funcao-5', VENCE + '\ndef perde_para(jogada):\n    print(vence[jogada])\n\nprint(perde_para("pedra"))',
  VENCE + '\ndef perde_para(jogada):\n    return "tesoura"\n\nprint(perde_para("pedra"))')

# ---------- funcao-6
L('funcao-6', VENCE + '\n' + RES,
  VENCE + '\ndef resultado(jogador, computador):\n    if jogador == computador:\n        return "empate"\n    elif vence[jogador] == computador:\n        return "vitoria"\n    else:\n        return "derrota"\n\nprint(resultado("pedra", "tesoura"))',
  VENCE + '\ndef resultado(jogador, computador):\n    if vence[computador] == jogador:\n        return "derrota"\n    if computador == jogador:\n        return "empate"\n    return "vitoria"',
)
T('funcao-6', VENCE + '\ndef resultado(jogador, computador):\n    if jogador == computador:\n        print("empate")\n    elif vence[jogador] == computador:\n        print("vitoria")\n    else:\n        print("derrota")',
  VENCE + '\ndef resultado(jogador, computador):\n    if vence[jogador] == computador:\n        return "vitoria"\n    return "derrota"')

# ---------- while-6
IW = 'n = int(input("Começar de: "))\n'
L('while-6',
  IW + '\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("Já!")',
  IW + 'while n > 0:\n    print(n)\n    n = n - 1\nprint("Já")',
  IW + 'while True:\n    print(n)\n    n -= 1\n    if n == 0:\n        break\nprint("já!")',
  IW + 'while n >= 1:\n    print(f"{n}...")\n    n -= 1\nprint("Já!")',
  'n = int(input())\nprint("Contagem:")\nwhile n != 0:\n    print(n)\n    n -= 1\nprint("JÁ!")',
  'n = int(input("Começar de: "))\ncontador = n\nwhile contador >= 1:\n    print(contador)\n    contador -= 1\nprint("Já!")',
)
T('while-6', IW + 'while n >= 0:\n    print(n)\n    n -= 1\nprint("Já!")',
  IW + 'while n > 1:\n    print(n)\n    n -= 1\nprint("Já!")',
  IW + 'print("3 2 1 Já!")',
  IW + 'while n > 1:\n    n -= 1\n    print(n)\nprint("Já!")')

# ---------- while-7
L('while-7',
  OPC + 'jogadas = 0\n\nwhile True:\n    jogada = input("Jogada: ")\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        print("Jogada inválida")\n        continue\n    jogadas += 1\n\nprint(f"Você jogou {jogadas} vezes")',
  OPC + 'jogadas = 0\nwhile True:\n    jogada = input().strip().lower()\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        continue\n    jogadas = jogadas + 1\n    print("Jogadas até agora:", jogadas)\nprint("Você jogou", jogadas, "vezes!")',
  OPC + 'jogadas = 0\njogada = input("Jogada: ")\nwhile jogada != "sair":\n    if jogada not in opcoes:\n        jogada = input("Jogada: ")\n        continue\n    jogadas += 1\n    jogada = input("Jogada: ")\nprint(f"Você jogou {jogadas} vezes.")',
  OPC + 'jogadas = 0\nwhile True:\n    jogada = input("Sua jogada (ou sair): ")\n    if jogada == "sair":\n        print("Saindo...")\n        break\n    if not jogada in opcoes:\n        print("Inválida, tente de novo")\n        continue\n    print(f"Você jogou {jogada}")\n    jogadas += 1\nprint(f"Você jogou {jogadas} vezes")',
)
T('while-7', OPC + 'jogadas = 0\nwhile True:\n    jogada = input()\n    if jogada == "sair":\n        break\n    jogadas += 1\nprint(f"Você jogou {jogadas} vezes")',
  OPC + 'jogadas = 0\nwhile True:\n    jogada = input()\n    jogadas += 1\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        continue\nprint(f"Você jogou {jogadas} vezes")')

# ---------- for-6
F6 = '\n\nprint(contar_vitorias(["vitoria", "derrota", "vitoria"]))'
L('for-6',
  'def contar_vitorias(resultados):\n    vitorias = 0\n    for r in resultados:\n        if r == "vitoria":\n            vitorias += 1\n    return vitorias' + F6,
  'def contar_vitorias(resultados):\n    vitorias = 0\n    for resultado in resultados:\n        if resultado == "vitoria":\n            vitorias = vitorias + 1\n    return vitorias' + F6,
  'def contar_vitorias(resultados):\n    vitorias = 0\n    for i in range(len(resultados)):\n        if resultados[i] == "vitoria":\n            vitorias += 1\n    return vitorias' + F6,
)
T('for-6', 'def contar_vitorias(resultados):\n    vitorias = 0\n    for r in resultados:\n        if r == "vitoria":\n            vitorias += 1\n        return vitorias' + F6,
  'def contar_vitorias(resultados):\n    return 2' + F6)

# ---------- for-7
F7 = OPC + 'historico = []\n\nwhile True:\n    jogada = input("Jogada (ou sair): ").strip().lower()\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        continue\n    historico.append(jogada)\n\n'
L('for-7',
  F7 + 'n = 1\nfor jogada in historico:\n    print(f"{n}. {jogada}")\n    n += 1\nprint(f"Total: {len(historico)}")',
  F7 + 'for i in range(len(historico)):\n    print(f"{i + 1}. {historico[i]}")\nprint("Total:", len(historico))',
  F7 + 'for n, j in enumerate(historico, 1):\n    print(n, ".", j)\nprint("Total: " + str(len(historico)))',
  F7 + 'print("Histórico:")\ncont = 0\nfor j in historico:\n    cont += 1\n    print(str(cont) + ". " + j)\nprint(f"Total: {cont}.")',
)
T('for-7', F7 + 'for j in historico:\n    print(j)\nprint(f"Total: {len(historico)}")',
  F7.replace('historico.append(jogada)', 'pass') + 'print("Total: 0")')

# ---------- final-5
F5 = 'import random\n\n' + OPC + VENCE + '\n\n' + RES + '\n\njogada = input("Sua jogada: ").strip().lower()\n'
L('final-5',
  F5 + 'computador = random.choice(opcoes)\nprint(f"Computador jogou {computador}")\n\nr = resultado(jogada, computador)\nif r == "vitoria":\n    print("Você venceu!")\nelif r == "derrota":\n    print("Computador venceu!")\nelse:\n    print("Empate!")',
  F5 + 'computador = random.choice(opcoes)\nprint("Computador jogou", computador)\nif resultado(jogada, computador) == "empate":\n    print("Empate!")\nelif resultado(jogada, computador) == "vitoria":\n    print("Você venceu!")\nelse:\n    print("Computador venceu!")',
  F5 + 'computador = random.choice(opcoes)\nprint(f"O computador jogou {computador}!")\nr = resultado(jogada, computador)\nprint("Resultado:", r)\nif r == "vitoria":\n    print("Você venceu!")\nif r == "derrota":\n    print("Computador venceu!")\nif r == "empate":\n    print("Empate!")',
)
T('final-5', F5 + 'computador = "tesoura"\nprint(f"Computador jogou {computador}")\nr = resultado(jogada, computador)\nif r == "vitoria":\n    print("Você venceu!")\nelif r == "derrota":\n    print("Computador venceu!")\nelse:\n    print("Empate!")',
  F5 + 'computador = random.choice(opcoes)\nr = resultado(jogada, computador)\nif r == "vitoria":\n    print("Você venceu!")\nelif r == "derrota":\n    print("Computador venceu!")\nelse:\n    print("Empate!")',
  F5 + 'computador = random.choice(opcoes)\nprint(f"Computador jogou {computador}")\nr = resultado(computador, jogada)\nif r == "vitoria":\n    print("Você venceu!")\nelif r == "derrota":\n    print("Computador venceu!")\nelse:\n    print("Empate!")')

# ---------- final-6
F6H = 'import random\n\n' + OPC + VENCE + '\n\n' + RES + '\n\npontos_jogador = 0\npontos_computador = 0\n\n'
F6T = '\nprint(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")'
L('final-6',
  EX['final-6']['resposta'],
  F6H + 'while True:\n    jogada = input("Sua jogada (pedra, papel, tesoura ou sair): ").strip().lower()\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        print("Jogada inválida")\n        continue\n    computador = random.choice(opcoes)\n    print("Computador:", computador)\n    r = resultado(jogada, computador)\n    if r == "vitoria":\n        pontos_jogador += 1\n    elif r == "derrota":\n        pontos_computador += 1\n    print(f"Parcial: {pontos_jogador} x {pontos_computador}")\n' + F6T,
  F6H + 'while True:\n    jogada = input().strip().lower()\n    if jogada == "sair":\n        break\n    elif jogada not in opcoes:\n        print("Inválida!")\n        continue\n    computador = random.choice(opcoes)\n    print(f"O computador jogou {computador}")\n    if resultado(jogada, computador) == "vitoria":\n        print("Você ganhou a rodada")\n        pontos_jogador = pontos_jogador + 1\n    if resultado(jogada, computador) == "derrota":\n        print("Você perdeu a rodada")\n        pontos_computador = pontos_computador + 1\n' + F6T,
)
T('final-6', F6H + 'while True:\n    jogada = input().strip().lower()\n    if jogada == "sair":\n        break\n    if jogada not in opcoes:\n        continue\n    computador = random.choice(opcoes)\n    r = resultado(computador, jogada)\n    if r == "vitoria":\n        pontos_jogador += 1\n    elif r == "derrota":\n        pontos_computador += 1\n' + F6T,
  F6H + 'while True:\n    jogada = input().strip().lower()\n    if jogada == "sair":\n        break\n    computador = random.choice(opcoes)\n    r = resultado(jogada, computador)\n    if r == "vitoria":\n        pontos_jogador += 1\n    elif r == "derrota":\n        pontos_computador += 1\n' + F6T)

# ---------- desafios-4
EM = 'emoji = {"pedra": "✊", "papel": "✋", "tesoura": "✌️"}\n\n\n'
L('desafios-4',
  EM + 'def com_emoji(jogada):\n    return f"{emoji[jogada]} {jogada}"\n\n\nprint(com_emoji("pedra"))',
  EM + 'def com_emoji(jogada):\n    return emoji[jogada] + " " + jogada\n\n\nprint(com_emoji("pedra"))',
  EM + 'def com_emoji(jogada):\n    texto = emoji[jogada] + " " + jogada\n    return texto\n\n\nprint(com_emoji("pedra"))',
)
T('desafios-4', EM + 'def com_emoji(jogada):\n    print(emoji[jogada], jogada)\n\n\nprint(com_emoji("pedra"))',
  EM + 'def com_emoji(jogada):\n    return emoji[jogada] + jogada\n\n\nprint(com_emoji("pedra"))')

# ---------- desafios-5
VL = EX['desafios-5']['inicial'].split('def resultado')[0]
L('desafios-5', EX['desafios-5']['resposta'],
  VL + 'def resultado(jogador, computador):\n    if jogador == computador:\n        return "empate"\n    elif jogador in vence[computador]:\n        return "derrota"\n    else:\n        return "vitoria"',
  VL + 'def resultado(jogador, computador):\n    if computador in vence[jogador]:\n        return "vitoria"\n    if jogador in vence[computador]:\n        return "derrota"\n    return "empate"',
)
T('desafios-5', VL + 'def resultado(jogador, computador):\n    if jogador == computador:\n        return "empate"\n    if vence[jogador] == computador:\n        return "vitoria"\n    return "derrota"')

# ---------- desafios-6
D6 = EX['desafios-6']['inicial']
D6_LOOP_OK = D6.replace('while True:  # troque esta condição', 'while pontos_jogador < 2 and pontos_computador < 2:')
L('desafios-6', EX['desafios-6']['resposta'],
  D6_LOOP_OK.replace('# mostre quem venceu a partida', 'if pontos_jogador > pontos_computador:\n    print("Você venceu a partida!")\nelse:\n    print("Computador venceu a partida!")'),
  D6.replace('while True:  # troque esta condição', 'while not (pontos_jogador == 2 or pontos_computador == 2):').replace('# mostre quem venceu a partida', 'if pontos_computador == 2:\n    print("computador venceu a partida")\nelse:\n    print("Você venceu a partida.")'),
  D6.replace('while True:  # troque esta condição', 'while max(pontos_jogador, pontos_computador) < 2:').replace('# mostre quem venceu a partida', 'print("Fim de jogo!")\nif pontos_jogador == 2:\n    print("Você venceu a partida!")\nelse:\n    print("Computador venceu a partida!")'),
)
T('desafios-6', D6.replace('while True:  # troque esta condição', 'while pontos_jogador < 2 or pontos_computador < 2:').replace('# mostre quem venceu a partida', 'if pontos_jogador == 2:\n    print("Você venceu a partida!")\nelse:\n    print("Computador venceu a partida!")'),
  D6_LOOP_OK.replace('# mostre quem venceu a partida', 'print("Você venceu a partida!")'),
  D6_LOOP_OK.replace('# mostre quem venceu a partida', 'print("Você venceu a partida!")\nprint("Computador venceu a partida!")'))

# limitação conhecida (prompt faz parte da saída): input("Empate? ...") reprova no caso "Não foi empate".
T('final-6', EX['final-6']['resposta'].replace('computador = random.choice(opcoes)', 'computador = "tesoura"'))
T('desafios-6', EX['desafios-6']['resposta'].replace('computador = random.choice(opcoes)', 'computador = "tesoura"'))
L('dict-5', VENCE + 'jogada = input("Digite pedra, papel ou tesoura: ")\nprint(jogada, "vence", vence[jogada])')
L('final-5', F5 + 'computador = random.choice(opcoes)\nprint("Computador jogou:", computador)\nr = resultado(jogada, computador)\nif r == "vitoria":\n    print("Você venceu!")\nelif r == "derrota":\n    print("Computador venceu!")\nelse:\n    print("Empate!")')

if __name__ == '__main__':
    so = sys.argv[1:]
    faltam = [i for i, it in EX.items() if it['tipo'] == 'codigo' and i not in V]
    nl = okl = nt = okt = 0
    for i, (legs, traps) in V.items():
        if so and i not in so: continue
        it = EX[i]
        for k, c in enumerate(legs):
            nl += 1; ok, msg = passa(it, c)
            if ok: okl += 1
            else: print(f'FALSO NEGATIVO {i} legítima #{k}: {msg}')
        for k, c in enumerate(traps):
            nt += 1; ok, msg = passa(it, c)
            if not ok: okt += 1
            else: print(f'FALSO POSITIVO {i} trapaça #{k} passou')
    print(f'legítimas: {okl}/{nl} passaram | trapaças: {okt}/{nt} reprovadas | sem variantes: {faltam}')
