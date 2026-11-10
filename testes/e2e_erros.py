"""Caminhos de erro e recursos novos. Uso: python e2e2.py URL_HOSPEDADA"""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1]
erros, ok = [], []


def checa(cond, nome):
    (ok if cond else erros).append(nome)


def responde_certo(pg):
    it = pg.evaluate('L.fila[0]')
    if it['tipo'] == 'escolha': pg.locator(f'.opcao[data-k="{it["certa"]}"]').click()
    elif it['tipo'] == 'completar':
        for n, r in enumerate(it['respostas']): pg.locator(f'.lacuna[data-n="{n}"]').fill(r[0])
    elif it['tipo'] == 'montar':
        usados = set()
        for txt in it['certa']:
            for x in pg.locator('#banco .peca').all():
                if x.inner_text() == txt and x.get_attribute('data-id') not in usados:
                    usados.add(x.get_attribute('data-id')); x.click(); break
    elif it['tipo'] == 'codigo': pg.locator('#editor').fill(it['resposta'])
    pg.locator('#principal').click()
    if it['tipo'] == 'codigo': pg.wait_for_selector('#rodape.certo')
    pg.locator('#principal').click(); pg.wait_for_timeout(120)


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(**p.devices['Pixel 7'], accept_downloads=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: erros.append(f'pageerror: {e}'))
    pg.goto(URL); pg.wait_for_timeout(600)
    checa(pg.evaluate('LOCAL') is False, 'modo hospedado detectado')
    checa(pg.evaluate('TOQUE') is True, 'celular detectado')

    # lição 1 pulando a explicação; errar a primeira pergunta
    pg.locator('.no[data-i="0"]').click()
    pg.locator('[data-acao="exercicios"]').click()
    it = pg.evaluate('L.fila[0]')
    errada = next(k for k in range(len(it['opcoes'])) if k != it['certa'])
    pg.locator(f'.opcao[data-k="{errada}"]').click(); pg.locator('#principal').click()
    checa(pg.locator('#rodape.errado').count() == 1, 'resposta errada marcada')
    checa(pg.evaluate('L.vidas') == 4, 'perdeu uma vida')
    checa(pg.evaluate(f'prog.fracos["{it["id"]}"]') == 2, 'erro anotado para a revisão')

    # recarregar no meio e retomar
    pg.reload(); pg.wait_for_timeout(600)
    checa(pg.locator('#retomar').count() == 1, 'botão continuar após recarregar')
    pg.locator('#retomar').click()
    checa(pg.evaluate('L.vidas') == 4, 'vidas mantidas ao retomar')

    # chegar ao exercício de código, respondendo certo o resto
    while pg.evaluate('L.fila[0].tipo') != 'codigo':
        it = pg.evaluate('L.fila[0]')
        if it['tipo'] == 'escolha': pg.locator(f'.opcao[data-k="{it["certa"]}"]').click()
        elif it['tipo'] == 'completar':
            for n, r in enumerate(it['respostas']): pg.locator(f'.lacuna[data-n="{n}"]').fill(r[0])
        elif it['tipo'] == 'montar':
            usados = set()
            for txt in it['certa']:
                for x in pg.locator('#banco .peca').all():
                    if x.inner_text() == txt and x.get_attribute('data-id') not in usados:
                        usados.add(x.get_attribute('data-id')); x.click(); break
        pg.locator('#principal').click(); pg.locator('#principal').click(); pg.wait_for_timeout(100)

    # erro do Python explicado
    pg.locator('#editor').fill('print(Ola)')
    pg.locator('#principal').click(); pg.wait_for_selector('#rodape.errado')
    checa('não conhece o nome' in pg.locator('#entender').inner_text(), 'NameError explicado em português')
    pg.screenshot(path='shot-erro-m.png')
    pg.locator('#principal').click()
    pg.locator('#editor').fill('if True\n    print(1)')
    pg.locator('#executar').click(); pg.wait_for_timeout(800)
    checa('dois-pontos' in pg.locator('#entender').inner_text(), 'falta de : explicada')

    # teclas de código
    pg.locator('#editor').fill('x')
    pg.locator('.teclas [data-t="⇥"]').click()
    pg.locator('.teclas [data-t=":"]').click()
    checa(pg.locator('#editor').input_value() == 'x    :', 'teclas Tab e : inserem no editor')
    pg.locator('.teclas [data-t="⇤"]').click()
    checa(pg.locator('#editor').input_value() == 'x    :', 'recuo não apaga texto que não é indentação')

    # passar, e Enter no editor travado não muda nada
    pg.locator('#editor').fill('jogada = "pedra"\nprint(f"Você jogou {jogada}")')
    pg.locator('#principal').click(); pg.wait_for_selector('#rodape.certo')
    antes = pg.locator('#editor').input_value()
    pg.locator('#editor').focus(); pg.keyboard.press('Tab')
    checa(pg.locator('#editor').input_value() == antes, 'editor travado depois de aprovado')
    pg.locator('#principal').click(); pg.wait_for_timeout(120)
    while not pg.locator('#cont').count(): responde_certo(pg)
    pg.locator('#cont').click()

    # revisão
    checa(pg.locator('#revisar').count() == 1, 'revisão aparece na trilha')
    pg.screenshot(path='shot-home-revisao-m.png')
    pg.locator('#revisar').click()
    primeira = pg.evaluate('L.fila[0].id')
    checa(primeira == it['id'] or pg.evaluate('L.fila.map(x => x.id)').count(it['id']) == 1, 'revisão inclui a pergunta errada')
    pg.locator('#teoria').click()
    checa(pg.locator('.modal').count() == 1, 'teoria abre na revisão'); pg.keyboard.press('Escape')
    while pg.evaluate('L && L.fila.length') :
        it2 = pg.evaluate('L.fila[0]')
        if it2['tipo'] == 'escolha': pg.locator(f'.opcao[data-k="{it2["certa"]}"]').click()
        elif it2['tipo'] == 'completar':
            for n, r in enumerate(it2['respostas']): pg.locator(f'.lacuna[data-n="{n}"]').fill(r[0])
        elif it2['tipo'] == 'montar':
            usados = set()
            for txt in it2['certa']:
                for x in pg.locator('#banco .peca').all():
                    if x.inner_text() == txt and x.get_attribute('data-id') not in usados:
                        usados.add(x.get_attribute('data-id')); x.click(); break
        pg.locator('#principal').click(); pg.locator('#principal').click(); pg.wait_for_timeout(100)
    pg.wait_for_selector('#cont')
    checa('Revisão concluída' in pg.locator('h1').inner_text(), 'revisão conclui')
    checa(pg.evaluate('prog.emAndamento') is None and 'revisao' not in pg.evaluate('prog.feitas'), 'revisão não mexe nas lições')

    # tela final hospedada com download
    pg.evaluate('prog.meuJogo = "print(1)"; prog.feitas.final = true')
    pg.locator('#cont').click(); pg.locator('#ver-fim').click()
    with pg.expect_download() as d:
        pg.locator('#baixar').click()
    checa(d.value.suggested_filename == 'meu_jokenpo.py', 'download do jogo')
    pg.screenshot(path='shot-fim-m.png', full_page=True)
    b.close()

print('OK:', len(ok)); print('\n'.join('FALHOU: ' + e for e in erros) or 'SEM FALHAS')
