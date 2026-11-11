"""Percorre o curso inteiro no navegador respondendo certo, e registra erros de JS e de exemplos.
Uso: python e2e.py URL [mobile]"""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1]
MOBILE = len(sys.argv) > 2
erros = []


def principal(pg):
    pg.locator('#principal').click()


def responder(pg, it):
    t = it['tipo']
    if t == 'escolha':
        pg.locator(f'.opcao[data-k="{it["certa"]}"]').click()
    elif t == 'completar':
        for n, r in enumerate(it['respostas']):
            pg.locator(f'.lacuna[data-n="{n}"]').fill(r[0])
    elif t == 'montar':
        usados = set()
        for txt in it['certa']:
            for b in pg.locator('#banco .peca').all():
                if b.inner_text() == txt and b.get_attribute('data-id') not in usados:
                    usados.add(b.get_attribute('data-id')); b.click(); break
    elif t == 'codigo':
        pg.locator('#editor').fill(it['resposta'])
    principal(pg)
    if t == 'codigo':
        pg.wait_for_selector('#rodape.certo, #rodape.errado', timeout=15000)
    if not pg.locator('#rodape.certo').count():
        erros.append(f'resposta certa recusada: {it["id"]}: {pg.locator("#rodape").inner_text()[:200]}')


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(**(p.devices['iPhone 13'] if MOBILE else {'viewport': {'width': 1280, 'height': 800}}))
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: erros.append(f'pageerror: {e}'))
    pg.on('console', lambda m: m.type == 'error' and erros.append(f'console: {m.text}'))
    pg.goto(URL); pg.wait_for_timeout(800)
    licoes = pg.evaluate('LICOES')
    for i, l in enumerate(licoes):
        pg.locator(f'.no[data-i="{i}"]').click()
        pg.locator('.cartao-licao [data-acao="comecar"]').click()
        for k, c in enumerate(l['ensino']):
            if c.get('codigo'):
                pg.locator('#ex-rodar').click()
                pg.wait_for_selector('#ex-saida:not([hidden])')
                pg.wait_for_function("!document.querySelector('#ex-rodar').disabled")
                if pg.locator('#ex-saida .err').count():
                    erros.append(f'exemplo com erro: {l["id"]} cartão {k}: {pg.locator("#ex-saida").inner_text()[:200]}')
            if MOBILE and i == 0 and k == 0:
                pg.screenshot(path=f'shot-ensino-m.png')
            principal(pg)
        n = 0
        while pg.locator('#rodape').count() and n < 40:
            n += 1
            it = pg.evaluate('L && L.fila[0]')
            if not it:
                break
            if MOBILE and it['tipo'] == 'codigo' and i == 4:
                pg.screenshot(path='shot-codigo-m.png')
            responder(pg, it)
            principal(pg)
            pg.wait_for_timeout(150)
        pg.wait_for_selector('#cont', timeout=10000)
        if l.get('final'):
            pg.screenshot(path=f'shot-final{"-m" if MOBILE else ""}.png', full_page=True)
        pg.locator('#cont').click()
    pg.screenshot(path=f'shot-home{"-m" if MOBILE else ""}.png', full_page=True)
    print('lições feitas', len(pg.evaluate('prog.feitas')))
    b.close()

print('\n'.join(erros) or 'SEM ERROS')
