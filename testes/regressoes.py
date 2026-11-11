"""Códigos reais de alunos que já foram reprovados por engano. Uso: python regressoes.py URL"""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1]
CASOS = [
    ('Não foi empate', 'certo', '''jogador = input("Você: ")
computador = input("Computador: ")

if jogador == computador :
    print("empate!")
else:
    print("não foi empate!")
'''),
    ('Não foi empate', 'errado', '''jogador = input("Você: ")
computador = input("Computador: ")
print("Não foi empate")
'''),
    ('Jogada aceita', 'certo', '''opcoes = ["pedra", "papel", "tesoura"]
jogada = input("Sua jogada (ou sair): ").strip().lower()
if jogada == "sair":
    print("até mais!")
elif jogada in opcoes:
    print(f"jogada aceita:{jogada}")
else:
    print("jogada inválida")
'''),
]
falhas = 0
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto(URL); pg.wait_for_timeout(800)
    for trecho, esperado, codigo in CASOS:
        pg.evaluate("""t => { const i = LICOES.findIndex(l => l.exercicios.some(e => e.tipo === 'codigo' && e.enunciado.includes(t)))
          iniciar(i, null, true); L.fila = [LICOES[i].exercicios.find(e => e.tipo === 'codigo' && e.enunciado.includes(t))]; renderItem() }""", trecho)
        pg.locator('#editor').fill(codigo); pg.locator('#principal').click()
        pg.wait_for_selector('#rodape.certo, #rodape.errado', timeout=20000)
        obtido = 'certo' if pg.locator('#rodape.certo').count() else 'errado'
        ok = obtido == esperado; falhas += not ok
        print(('OK ' if ok else 'FALHOU ') + f'{trecho} ({esperado}) -> {obtido}', '' if ok else pg.locator('#rodape').inner_text()[:200])
        pg.goto(URL); pg.wait_for_timeout(500)
    b.close()
sys.exit(1 if falhas else 0)
