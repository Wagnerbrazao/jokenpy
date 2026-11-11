"""Valida licoes.js: estrutura, exemplos do ensino e exercícios de código no executor real."""
import json, os, subprocess, sys, tempfile, unicodedata, re

PASTA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXEC = os.path.join(PASTA, '_executor.py')
env = dict(os.environ, PATH=os.path.expanduser('~/.local/node/bin') + ':' + os.environ['PATH'])
LICOES = json.loads(subprocess.run(['node', '-e', f"process.stdout.write(JSON.stringify(require('{PASTA}/licoes.js')))"],
                                   capture_output=True, text=True, env=env, check=True).stdout)


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
        if not ok: return False, f"erro: {erro[:150]}"
        if c.get('espera') and padrao(c['espera']) not in s: return False, f"faltou {c['espera']!r} em {saida[-200:]!r}"
        p = tem_proibido(s, c.get('espera'), c.get('proibido'))
        if p: return False, f"proibido {p!r}"
    return True, ''


problemas = []
n_ex = n_cod = n_cards = n_cards_cod = 0
ids = [l['id'] for l in LICOES]
for l in LICOES:
    lid = l['id']
    if not (3 <= len(l.get('resumo', [])) <= 6): problemas.append(f'{lid}: resumo com {len(l.get("resumo", []))} itens')
    for k, c in enumerate(l['ensino']):
        n_cards += 1
        if c.get('codigo'):
            n_cards_cod += 1
            ok, saida, erro = rodar(c['codigo'], c.get('entrada') or '')
            if not ok: problemas.append(f'{lid} cartão {k} ({c["titulo"]}): {erro}')
    for k, it in enumerate(l['exercicios']):
        n_ex += 1
        nome = f'{lid}-{k} ({it["tipo"]})'
        d = it.get('dicas')
        if not isinstance(d, list) or not (2 <= len(d) <= 3): problemas.append(f'{nome}: dicas inválidas')
        if not it.get('explica'): problemas.append(f'{nome}: sem explica')
        t = it['tipo']
        if t == 'escolha':
            if not (0 <= it['certa'] < len(it['opcoes'])): problemas.append(f'{nome}: certa fora do intervalo')
            if len(set(it['opcoes'])) != len(it['opcoes']): problemas.append(f'{nome}: opções repetidas')
        elif t == 'completar':
            nums = sorted(set(int(x) for x in re.findall(r'\[\[(\d+)\]\]', it['codigo'])))
            if nums != list(range(len(it['respostas']))): problemas.append(f'{nome}: lacunas {nums} x respostas {len(it["respostas"])}')
            if any(not r for r in it['respostas']): problemas.append(f'{nome}: lacuna sem resposta')
        elif t == 'montar':
            if not it['certa'] or any(not p.strip() for p in it['certa']): problemas.append(f'{nome}: peça vazia')
            if set(it['certa']) & set(it.get('extras', [])): problemas.append(f'{nome}: extra igual a peça certa')
        elif t == 'codigo':
            n_cod += 1
            ok, msg = passa(it, it['resposta'])
            if not ok: problemas.append(f'{nome}: RESPOSTA FALHA: {msg}')
            ok, _ = passa(it, it.get('inicial') or '')
            if ok: problemas.append(f'{nome}: inicial PASSA (não deveria)')
            esp = casos(it)[0].get('espera') or ''
            ok, _ = passa(it, f'print({json.dumps(esp, ensure_ascii=False)})')
            if ok: problemas.append(f'{nome}: trapaça (print da espera) PASSA')
        else:
            problemas.append(f'{nome}: tipo desconhecido')
    if not (6 <= len(l['exercicios']) <= 9): problemas.append(f'{lid}: {len(l["exercicios"])} exercícios')

print(f'lições: {len(LICOES)} {ids}')
print(f'cartões: {n_cards} ({n_cards_cod} com código) | exercícios: {n_ex} | código: {n_cod}')
for l in LICOES:
    from collections import Counter
    print(' ', l['id'], dict(Counter(it['tipo'] for it in l['exercicios'])))
print('\n'.join('PROBLEMA: ' + p for p in problemas) or 'TUDO OK')
