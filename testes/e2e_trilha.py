"""Trilha privada: senha errada, senha certa, percorrer todos os módulos e voltar à trilha de Python.
Uso: python e2e_trilha.py URL SENHA [m]"""
import sys
from playwright.sync_api import sync_playwright

URL, SENHA = sys.argv[1], sys.argv[2]
MOBILE = len(sys.argv) > 3
erros, ok = [], []


def checa(c, nome): (ok if c else erros).append(nome)


def responder(pg, it):
    t = it['tipo']
    if t == 'entrevista':
        pg.locator('#principal').click(); pg.wait_for_selector('#modelo:not([hidden])'); pg.locator('#principal').click(); return
    if t == 'escolha': pg.locator(f'.opcao[data-k="{it["certa"]}"]').click()
    elif t == 'completar':
        for n, r in enumerate(it['respostas']): pg.locator(f'.lacuna[data-n="{n}"]').fill(r[0])
    elif t == 'montar':
        usados = set()
        for txt in it['certa']:
            for b in pg.locator('#banco .peca').all():
                if b.inner_text() == txt and b.get_attribute('data-id') not in usados:
                    usados.add(b.get_attribute('data-id')); b.click(); break
    elif t == 'codigo': pg.locator('#editor').fill(it['resposta'])
    pg.locator('#principal').click()
    if t == 'codigo': pg.wait_for_selector('#rodape.certo, #rodape.errado', timeout=20000)
    if not pg.locator('#rodape.certo').count(): erros.append(f'resposta certa recusada: {it["id"]}')
    pg.locator('#principal').click()


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(**(p.devices['Pixel 7'] if MOBILE else {'viewport': {'width': 1280, 'height': 820}}))
    pg = ctx.new_page(); pg.on('pageerror', lambda e: erros.append(f'pageerror: {e}'))
    pg.goto(URL); pg.wait_for_timeout(800)
    checa(pg.evaluate('CURSO.id') == 'python', 'abre na trilha de Python')
    pg.locator('[data-trilha="entrevista"]').click()
    pg.locator('#senha-trilha').fill('errada'); pg.locator('#senha-ok').click(); pg.wait_for_timeout(800)
    checa('incorreta' in pg.locator('#senha-erro').inner_text(), 'senha errada recusada')
    pg.locator('#senha-trilha').fill(SENHA); pg.locator('#senha-ok').click(); pg.wait_for_timeout(800)
    checa(pg.evaluate('CURSO.id') == 'entrevista', 'senha certa abre a trilha')
    checa(pg.locator('.arquivo-topo span').inner_text() == 'vaga-radix.md', 'painel da vaga')
    licoes = pg.evaluate('LISTA')
    for i, l in enumerate(licoes):
        pg.locator(f'.no[data-i="{i}"]').click(); pg.locator('.cartao-licao [data-acao="comecar"]').click()
        for c in l['ensino']:
            if c.get('codigo') and (c.get('linguagem') or 'python') == 'python':
                pg.locator('#ex-rodar').click(); pg.wait_for_selector('#ex-saida:not([hidden])')
                pg.wait_for_function("!document.querySelector('#ex-rodar').disabled")
                if pg.locator('#ex-saida .err').count(): erros.append(f'exemplo com erro: {l["id"]}')
            pg.locator('#principal').click()
        n = 0
        while not pg.locator('#cont').count() and n < 60:
            n += 1; it = pg.evaluate('L && L.fila[0]')
            if it: responder(pg, it); pg.wait_for_timeout(100)
        pg.wait_for_selector('#cont'); pg.locator('#cont').click()
    checa(len(pg.evaluate('prog.feitas')) == len(licoes), f'todos os {len(licoes)} módulos concluídos')
    pg.reload(); pg.wait_for_timeout(1200)
    checa(pg.evaluate('CURSO.id') == 'entrevista', 'recarregar mantém a trilha (senha lembrada)')
    pg.locator('[data-trilha="python"]').click(); pg.wait_for_timeout(300)
    checa(pg.evaluate('CURSO.id') == 'python' and pg.locator('.arquivo-topo span').inner_text() == 'jokenpo.py', 'volta para Python')
    checa(len(pg.evaluate('prog.feitas')) == 0, 'progresso separado por trilha')
    b.close()
print('OK:', len(ok)); print('\n'.join('FALHOU: ' + e for e in erros) or 'SEM FALHAS')
