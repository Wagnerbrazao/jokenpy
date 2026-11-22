"""Monta as trilhas públicas: conteudo/<id>/ -> cursos/<id>.js, valida tudo e gera cursos/indice.json.

Cada pasta conteudo/<id>/ tem:
  curso.js       -> const CURSO = { ... }   (títulos, partes, competências)
  NN-<modulo>.js -> MODULOS.push({ ... })   (um módulo por arquivo, na ordem do nome)

Uso:
    python ferramentas/gerar_cursos.py            # todas as trilhas
    python ferramentas/gerar_cursos.py java-spring   # só uma
Sai com código 1 se houver problema (e não grava a trilha com problema).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

PASTA = Path(__file__).resolve().parent.parent
CONTEUDO, SAIDA = PASTA / 'conteudo', PASTA / 'cursos'
NODE = os.path.expanduser('~/.local/node/bin/node')
if not os.path.exists(NODE):
    NODE = 'node'

TIPOS = {'escolha', 'completar', 'montar', 'entrevista'}
PERSONAGENS = {'pedra', 'papel', 'tesoura'}
# HTML permitido nos textos; qualquer outro "<" precisa virar &lt; (ex.: List&lt;String&gt;)
TAGS = {'p', 'b', 'i', 'em', 'strong', 'code', 'br', 'ul', 'ol', 'li', 'small', 'kbd', 'mark', 'span', 'pre', 'sup', 'sub'}
CAMPOS_HTML = ('texto', 'pergunta', 'explica', 'avalia', 'resposta')


def montar(trilha: Path) -> str:
    modulos = sorted(f for f in trilha.glob('[0-9][0-9]-*.js'))
    partes = [f'// Gerado por ferramentas/gerar_cursos.py a partir de conteudo/{trilha.name}/. Não edite à mão.',
              '(() => {', 'const MODULOS = []', (trilha / 'curso.js').read_text(encoding='utf-8')]
    for f in modulos:
        partes += [f'// ---- {f.name}', f.read_text(encoding='utf-8')]
    partes += ['const ordem = CURSO.partes.flatMap(p => p.ids)',
               'const LICOES = ordem.map(id => MODULOS.find(m => m.id === id)).filter(Boolean)',
               'globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}',
               f'globalThis.TRILHAS_CARREGADAS[{json.dumps(trilha.name)}] = {{ CURSO, LICOES, MODULOS }}',
               '})()', '']
    return '\n'.join(partes)


def carregar(js: str, tid: str) -> str:
    return js + f'\nprocess.stdout.write(JSON.stringify(globalThis.TRILHAS_CARREGADAS[{json.dumps(tid)}]))'


def tags_ruins(html: str):
    return sorted({t for t in re.findall(r'<\s*/?\s*([a-zA-Z][\w-]*)', html or '') if t.lower() not in TAGS})


def validar(tid: str, dados: dict) -> list[str]:
    p = []
    curso, licoes, modulos = dados['CURSO'], dados['LICOES'], dados['MODULOS']
    for campo in ('titulo', 'kicker', 'subtitulo', 'partes', 'vaga', 'arquivo'):
        if not curso.get(campo):
            p.append(f'CURSO sem {campo}')
    ids_partes = [i for pt in curso.get('partes', []) for i in pt['ids']]
    for pt in curso.get('partes', []):
        if pt.get('tipo') not in PERSONAGENS:
            p.append(f'parte {pt.get("titulo")}: tipo deve ser pedra, papel ou tesoura')
    ids_mod = [m.get('id') for m in modulos]
    for i in ids_partes:
        if i not in ids_mod:
            p.append(f'módulo {i} está nas partes mas ainda não foi escrito')
    for i in ids_mod:
        if i not in ids_partes:
            p.append(f'módulo {i} não está em nenhuma parte do CURSO')
    if len(set(ids_mod)) != len(ids_mod):
        p.append('ids de módulo repetidos')
    for r in curso.get('vaga', []):
        for m in r.get('modulos', []):
            if m not in ids_partes:
                p.append(f'competência "{r["texto"]}" cita módulo inexistente {m}')

    for l in modulos:
        lid = l.get('id', '?')
        if not re.fullmatch(r'[a-z0-9-]{2,40}', lid):
            p.append(f'{lid}: id inválido')
        for campo in ('titulo', 'icone', 'aprende', 'resumo', 'ensino', 'exercicios'):
            if not l.get(campo):
                p.append(f'{lid}: sem {campo}')
        if not (3 <= len(l.get('resumo', [])) <= 7):
            p.append(f'{lid}: resumo com {len(l.get("resumo", []))} itens (3 a 7)')
        if not (3 <= len(l.get('ensino', [])) <= 6):
            p.append(f'{lid}: {len(l.get("ensino", []))} cartões de ensino (3 a 6)')
        for k, r in enumerate(l.get('resumo', [])):
            if tags_ruins(r):
                p.append(f'{lid} resumo {k}: tags não permitidas {tags_ruins(r)} (escape < como &lt;)')
        for k, c in enumerate(l.get('ensino', [])):
            if not c.get('titulo') or not c.get('texto'):
                p.append(f'{lid} cartão {k}: sem titulo/texto')
            if tags_ruins(c.get('texto')):
                p.append(f'{lid} cartão {k}: tags não permitidas {tags_ruins(c.get("texto"))} (escape < como &lt;)')
            if c.get('codigo') and not c.get('linguagem'):
                p.append(f'{lid} cartão {k}: código sem linguagem (sem linguagem o app tenta rodar como Python)')
            if c.get('linguagem') == 'python':
                p.append(f'{lid} cartão {k}: linguagem python roda no servidor; use outra (ex.: django) para trecho só de leitura')
        g = l.get('gancho')
        if not isinstance(g, dict):
            p.append(f'{lid}: sem gancho (desafio relâmpago antes da explicação)')
        else:
            for campo in ('titulo', 'pergunta', 'opcoes', 'revelacao'):
                if not g.get(campo):
                    p.append(f'{lid} gancho: sem {campo}')
            ops = g.get('opcoes') or []
            if not (2 <= len(ops) <= 4) or not isinstance(g.get('certa'), int) or not (0 <= g['certa'] < len(ops)):
                p.append(f'{lid} gancho: 2 a 4 opções e certa válida')
            if g.get('codigo') and not g.get('linguagem'):
                p.append(f'{lid} gancho: código sem linguagem')
            for campo in ('pergunta', 'revelacao'):
                if tags_ruins(g.get(campo)):
                    p.append(f'{lid} gancho: {campo} com tags não permitidas {tags_ruins(g.get(campo))}')
        vids = l.get('videos', [])
        if not isinstance(vids, list) or len(vids) > 3:
            p.append(f'{lid}: videos deve ser uma lista com até 3 vídeos')
        for k, v in enumerate(vids if isinstance(vids, list) else []):
            if not re.fullmatch(r'[A-Za-z0-9_-]{11}', str(v.get('id', ''))):
                p.append(f'{lid} vídeo {k}: id do YouTube inválido')
            for campo in ('titulo', 'canal', 'duracao', 'nota'):
                if not v.get(campo):
                    p.append(f'{lid} vídeo {k}: sem {campo}')
            if v.get('idioma') not in ('pt', 'en'):
                p.append(f'{lid} vídeo {k}: idioma deve ser pt ou en')
            if 'inicio' in v and not (isinstance(v['inicio'], int) and v['inicio'] >= 0):
                p.append(f'{lid} vídeo {k}: inicio é um número de segundos')
            if tags_ruins(v.get('nota')):
                p.append(f'{lid} vídeo {k}: nota com tags não permitidas')
        if not l.get('porque'):
            p.append(f'{lid}: sem porque')
        exs = l.get('exercicios', [])
        if not (6 <= len(exs) <= 9):
            p.append(f'{lid}: {len(exs)} exercícios (6 a 9)')
        for k, it in enumerate(exs):
            nome = f'{lid}-{k} ({it.get("tipo")})'
            t = it.get('tipo')
            if t not in TIPOS:
                p.append(f'{nome}: tipo desconhecido (use {sorted(TIPOS)})')
                continue
            if not it.get('pergunta'):
                p.append(f'{nome}: sem pergunta')
            d = it.get('dicas')
            if not isinstance(d, list) or not (2 <= len(d) <= 3):
                p.append(f'{nome}: precisa de 2 ou 3 dicas')
            if t != 'entrevista' and not it.get('explica'):
                p.append(f'{nome}: sem explica')
            for campo in CAMPOS_HTML:
                if tags_ruins(it.get(campo)):
                    p.append(f'{nome}: {campo} com tags não permitidas {tags_ruins(it.get(campo))} (escape < como &lt;)')
            for k2, dica in enumerate(d or []):
                if tags_ruins(dica):
                    p.append(f'{nome}: dica {k2} com tags não permitidas {tags_ruins(dica)}')
            if t == 'escolha':
                ops = it.get('opcoes') or []
                if not (3 <= len(ops) <= 4):
                    p.append(f'{nome}: 3 ou 4 opções')
                if not isinstance(it.get('certa'), int) or not (0 <= it['certa'] < len(ops)):
                    p.append(f'{nome}: certa fora do intervalo')
                if len(set(ops)) != len(ops):
                    p.append(f'{nome}: opções repetidas')
            elif t == 'completar':
                cod, resp = it.get('codigo') or '', it.get('respostas') or []
                nums = sorted({int(x) for x in re.findall(r'\[\[(\d+)\]\]', cod)})
                if nums != list(range(len(resp))) or not resp:
                    p.append(f'{nome}: lacunas {nums} não batem com {len(resp)} respostas')
                if any(not isinstance(r, list) or not r or any(not str(a).strip() for a in r) for r in resp):
                    p.append(f'{nome}: cada resposta é uma lista não vazia de textos aceitos')
                if len(re.findall(r'\[\[\d+\]\]', cod)) != len(nums):
                    p.append(f'{nome}: a mesma lacuna aparece duas vezes')
            elif t == 'montar':
                certa, extras = it.get('certa') or [], it.get('extras') or []
                if len(certa) < 3 or any(not str(x).strip() for x in certa):
                    p.append(f'{nome}: certa precisa de 3+ peças não vazias')
                if set(certa) & set(extras):
                    p.append(f'{nome}: extra igual a peça certa')
                if len(certa) + len(extras) > 12:
                    p.append(f'{nome}: peças demais para o celular (máx. 12)')
            elif t == 'entrevista':
                if not it.get('resposta'):
                    p.append(f'{nome}: entrevista sem resposta-modelo')
                if not it.get('pontos'):
                    p.append(f'{nome}: entrevista sem pontos de checagem')
    return p


def processar(trilha: Path):
    js = montar(trilha)
    # pela entrada padrão: uma trilha grande passa do limite de tamanho de um argumento
    r = subprocess.run([NODE, '-'], input=carregar(js, trilha.name), capture_output=True, text=True)
    if r.returncode != 0:
        return None, [f'JavaScript inválido:\n{r.stderr.strip()[-1500:]}']
    dados = json.loads(r.stdout)
    problemas = validar(trilha.name, dados)
    return (js, dados), problemas


def main():
    pedidas = sys.argv[1:]
    SAIDA.mkdir(exist_ok=True)
    indice_arq = SAIDA / 'indice.json'
    indice = json.loads(indice_arq.read_text(encoding='utf-8')) if indice_arq.exists() else {}
    erro = False
    for trilha in sorted(d for d in CONTEUDO.iterdir() if d.is_dir() and (d / 'curso.js').exists()):
        if pedidas and trilha.name not in pedidas:
            continue
        res, problemas = processar(trilha)
        if problemas:
            erro = True
            print(f'✗ {trilha.name}: {len(problemas)} problema(s)')
            for x in problemas:
                print('   -', x)
            continue
        js, dados = res
        (SAIDA / f'{trilha.name}.js').write_text(js, encoding='utf-8')
        lic = dados['LICOES']
        n_ex = sum(len(l['exercicios']) for l in lic)
        indice[trilha.name] = {'modulos': [l['id'] for l in lic], 'exercicios': n_ex,
                              'versao': hashlib.sha1(js.encode()).hexdigest()[:10]}
        print(f'✓ {trilha.name}: {len(lic)} módulos, {n_ex} exercícios')
    indice_arq.write_text(json.dumps(indice, ensure_ascii=False, indent=1), encoding='utf-8')
    sys.exit(1 if erro else 0)


if __name__ == '__main__':
    main()
