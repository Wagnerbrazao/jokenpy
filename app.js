'use strict'
// Jokenpy: a lógica da tela. O conteúdo das lições está em licoes.js e o servidor em server.py.

// ---------- utilidades ----------
const $ = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]
const app = $('#app')
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const embaralhar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const norm = s => s.replace(/'/g, '"').replace(/\s+/g, '')
const textoDe = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent }
const semLacunas = c => (c || '').replace(/\[\[\d+\]\]/g, '____')
// compara a saída sem ligar para maiúsculas/minúsculas, acentos e espaços extras: "você jogou  Pedra" = "Você jogou pedra"
const padrao = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ')
const HEADERS = { 'Content-Type': 'application/json', 'X-Jokenpy': '1' }
// rodando no seu computador (localhost) ou hospedado na internet para qualquer pessoa
const LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname)
const TOQUE = matchMedia('(pointer: coarse)').matches   // celular/tablet: sem tecla Tab

let L = null              // estado da lição aberta (null = tela inicial)
let IA_ATIVA = false

// cada exercício ganha um id estável ("print-0", "print-1"...) para salvar progresso e rascunhos
LICOES.forEach(l => l.exercicios.forEach((it, k) => { it.id = `${l.id}-${k}`; it.k = k }))

// ---------- realce de sintaxe Python (só para mostrar) ----------
const RE_PY = /(#[^\n]*)|(f?"(?:[^"\\\n]|\\.)*"|f?'(?:[^'\\\n]|\\.)*')|\b(def|return|if|elif|else|while|for|in|not|and|or|import|from|break|continue|pass|True|False|None)\b|\b(\d+)\b|\b(print|input|int|str|len|range)\b(?=\()/g
function realcar(txt) {
  let out = '', ultimo = 0, m
  RE_PY.lastIndex = 0
  while ((m = RE_PY.exec(txt))) {
    out += esc(txt.slice(ultimo, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'n' : 'f'
    out += `<span class="t-${cls}">${esc(m[0])}</span>`
    ultimo = RE_PY.lastIndex
  }
  return out + esc(txt.slice(ultimo))
}

// ---------- erros do Python explicados em português ----------
// A mensagem original continua aparecendo: aprender a ler erro em inglês faz parte de programar.
const ERROS = [
  [/NameError: name '(\w+)' is not defined/, m => `O Python não conhece o nome <code>${m[1]}</code>. Se era um texto, faltaram as aspas: <code>"${m[1]}"</code>. Se é uma variável, confira se ela foi criada antes desta linha e se o nome está escrito igual (maiúscula conta).`],
  [/expected ':'/, () => 'Faltaram os dois-pontos <code>:</code> no fim da linha. Toda linha de <code>if</code>, <code>elif</code>, <code>else</code>, <code>while</code> e <code>def</code> termina com <code>:</code>.'],
  [/expected an indented block/, () => 'Depois de uma linha que termina com <code>:</code>, o bloco de baixo precisa estar indentado (4 espaços para dentro). Se ainda não sabe o que pôr, use <code>pass</code>.'],
  [/unexpected indent/, () => 'Esta linha tem espaços a mais no começo. Só indente o que está dentro de um bloco (<code>if</code>, <code>while</code>, <code>def</code>...).'],
  [/unindent does not match|inconsistent use of tabs/, () => 'A indentação desta linha não bate com as de cima. Use sempre múltiplos de 4 espaços.'],
  [/unterminated (triple-quoted )?string|EOL while scanning/, () => 'Uma string abriu aspas e não fechou. Confira se cada <code>"</code> tem o seu par na mesma linha.'],
  [/'(.)' was never closed/, m => `Um <code>${m[1]}</code> abriu e não fechou. Conte: cada abertura precisa do seu fechamento.`],
  [/unmatched '(.)'/, m => `Tem um <code>${m[1]}</code> sobrando, sem a abertura correspondente.`],
  [/Maybe you meant '==' or ':=' instead of '='|cannot assign to/, () => 'Para <b>comparar</b> use <code>==</code>. Um <code>=</code> sozinho <b>guarda</b> um valor e não pode ficar dentro do <code>if</code>.'],
  [/Did you mean '(.+?)'\?/, m => `O Python sugere: <code>${m[1]}</code>. Confira se o nome está escrito certo.`],
  [/can only concatenate str|unsupported operand type/, () => 'Você misturou texto e número numa conta. <code>int(texto)</code> vira número, <code>str(numero)</code> vira texto. Para mostrar os dois juntos, use f-string.'],
  [/KeyError: (.+)/, m => `A chave <code>${esc(m[1])}</code> não existe no dicionário. Confira se escreveu igual às chaves (sem espaços extras e em minúsculas).`],
  [/IndexError/, () => 'Você pediu uma posição que não existe na lista. A primeira é <code>0</code> e a última é <code>len(lista) - 1</code>.'],
  [/invalid literal for int/, () => '<code>int()</code> só converte textos que são números, como <code>"20"</code>.'],
  [/ZeroDivisionError/, () => 'Não existe divisão por zero. Confira o valor que está embaixo da divisão.'],
  [/'NoneType'/, () => 'Algo virou <code>None</code> (nada). Uma função sem <code>return</code> devolve <code>None</code>: confira se ela tem <code>return</code> em todos os caminhos.'],
  [/AttributeError: '(\w+)' object has no attribute '(\w+)'/, m => `Um valor do tipo <code>${m[1]}</code> não tem <code>.${m[2]}</code>. Confira o nome (ex.: <code>lower</code>, <code>strip</code>) e se a variável tem o tipo que você imagina.`],
  [/TypeError: (\w+)\(\) (takes|missing)/, m => `A função <code>${m[1]}</code> foi chamada com a quantidade errada de valores. Compare os parâmetros do <code>def</code> com a chamada.`],
  [/Tempo esgotado/, () => 'O programa não terminou. Num <code>while</code>, confira se existe um <code>break</code> ou se a variável da condição muda a cada volta.'],
  [/Teste: não encontrei '(\w+)'/, m => `O teste procura algo chamado <code>${m[1]}</code>. Use exatamente esse nome no seu código.`],
]
function entenderErro(erro) {
  for (const [re, f] of ERROS) { const m = (erro || '').match(re); if (m) return f(m) }
  return ''
}
const htmlEntender = erro => { const e = entenderErro(erro); return e ? `<div class="entender"><b>🔎 O que isso quer dizer</b>${e}</div>` : '' }

// ---------- progresso ----------
// Fica salvo no navegador (localStorage) e no servidor (jokenpo/progresso.json).
// Assim você não perde nada se fechar a aba, trocar de navegador ou limpar os dados do site.
const CHAVE = 'jokenpy-progresso'
const novoProgresso = () => ({
  feitas: {}, sequencia: 0, ultimoDia: null, som: true,
  xpHoje: { dia: null, xp: 0 },
  emAndamento: null,   // lição aberta: onde parou e quantos erros
  rascunhos: {},       // código que você estava escrevendo, por exercício
  atualizado: 0,
})
let prog = carregarLocal()
if (!prog.atualizado && (prog.xp || Object.keys(prog.feitas).length)) prog.atualizado = 1  // progresso antigo
migrarProgresso()

// O conteúdo foi reescrito (versão 2): exercícios mudaram de posição, então a lição em andamento,
// os rascunhos e a lista de erros antigos não valem mais. As lições concluídas continuam.
function migrarProgresso() {
  if ((prog.versao || 1) >= 2) return
  prog.emAndamento = null; prog.rascunhos = {}; prog.fracos = {}; prog.versao = 2
  gravarLocal()
}
// a lição em andamento é guardada pelo id; a posição muda quando entram lições novas
const indiceAndamento = () => {
  const a = prog.emAndamento
  if (!a) return -1
  const i = LICOES.findIndex(l => l.id === a.id)
  return i >= 0 ? i : -1
}

function carregarLocal() {
  try { return { ...novoProgresso(), ...JSON.parse(localStorage.getItem(CHAVE)) } } catch { return novoProgresso() }
}
function gravarLocal() { try { localStorage.setItem(CHAVE, JSON.stringify(prog)) } catch {} }

let envioPendente = false, timerEnvio
function salvarProgresso() {
  prog.atualizado = Date.now()
  gravarLocal()
  envioPendente = true
  clearTimeout(timerEnvio)
  timerEnvio = setTimeout(enviarProgresso, 700)
}
function enviarProgresso() {
  clearTimeout(timerEnvio)
  envioPendente = false
  fetch('/progresso', { method: 'PUT', headers: HEADERS, body: JSON.stringify(prog), keepalive: true })
    .then(r => marcarServidor(r.ok)).catch(() => marcarServidor(false))
}
async function sincronizar() {
  try {
    const remoto = await (await fetch('/progresso')).json()
    if ((remoto.atualizado || 0) > (prog.atualizado || 0)) { prog = { ...novoProgresso(), ...remoto }; migrarProgresso(); gravarLocal(); return true }
    if ((prog.atualizado || 0) > (remoto.atualizado || 0)) enviarProgresso()
  } catch {}
  return false
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && envioPendente) enviarProgresso() })

const dia = d => { const x = new Date(); x.setDate(x.getDate() + d); return x.toLocaleDateString('sv') }
const sequencia = () => prog.ultimoDia === dia(0) || prog.ultimoDia === dia(-1) ? prog.sequencia : 0
function marcarDia() {
  if (prog.ultimoDia === dia(0)) return
  prog.sequencia = prog.ultimoDia === dia(-1) ? prog.sequencia + 1 : 1
  prog.ultimoDia = dia(0)
}
function limparRascunhos(licao) { licao.exercicios.forEach(it => delete prog.rascunhos[it.id]) }

// ---------- servidor ----------
function marcarServidor(ok) {
  let aviso = $('#aviso')
  if (ok) { aviso?.remove(); return }
  if (aviso) return
  aviso = document.createElement('div')
  aviso.id = 'aviso'; aviso.className = 'aviso'; aviso.setAttribute('role', 'status')
  aviso.innerHTML = LOCAL
    ? '⚠️ Servidor desligado: o código não roda e o progresso fica só neste navegador. Na pasta <code>jokenpo</code>, rode <code>python -m uvicorn server:app --port 8080</code>'
    : '⚠️ Sem conexão com o servidor: o código não roda agora. Confira a internet e tente de novo em instantes.'
  document.body.append(aviso)
}

// ---------- sons e avisos ----------
let audio
function tocar(notas, dur = 0.11, tipo = 'sine') {
  if (!prog.som) return
  try {
    audio = audio || new AudioContext()
    notas.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * dur
      o.type = tipo; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dur + 0.02)
    })
  } catch {}
}
const somCerto = () => tocar([660, 990])
const somErro = () => tocar([240, 180], 0.16, 'triangle')
const somFim = () => tocar([523, 659, 784, 1047], 0.12)

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg
  document.body.append(t); setTimeout(() => t.remove(), 2400)
}

// ---------- personagens: Pedra, Papel e Tesoura ----------
// Desenhados em SVG, cada um com sua cor. Dão a cor de cada lição e reagem às respostas.
const TIPOS_P = ['pedra', 'papel', 'tesoura']
const NOMES_P = { pedra: 'Pedra', papel: 'Papel', tesoura: 'Tesoura' }
// a lição usa a cor do personagem da parte do curso em que ela está
const tipoDaLicao = i => ATOS.find(a => a.ids.includes(LICOES[i]?.id))?.tipo || TIPOS_P[((i % 3) + 3) % 3]
function rosto(cx, cy, humor, d = 11) {
  const olho = (x, y) => humor === 'feliz'
    ? `<path d="M${x - 4.5} ${y + 1.5} Q${x} ${y - 4.5} ${x + 4.5} ${y + 1.5}" stroke="#2B2440" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${x}" cy="${y}" r="4.6" fill="#2B2440"/><circle cx="${x + 1.5}" cy="${y - 1.6}" r="1.5" fill="#fff"/>`
  const boca = humor === 'feliz' ? `<path d="M${cx - 8} ${cy + 9} Q${cx} ${cy + 18} ${cx + 8} ${cy + 9}" fill="#2B2440"/>`
    : humor === 'pensando' ? `<path d="M${cx - 6} ${cy + 13} Q${cx} ${cy + 10} ${cx + 6} ${cy + 13}" stroke="#2B2440" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M${cx - 7} ${cy + 10} Q${cx} ${cy + 16} ${cx + 7} ${cy + 10}" stroke="#2B2440" stroke-width="3" fill="none" stroke-linecap="round"/>`
  const sobrancelha = humor === 'pensando' ? `<path d="M${cx - d - 5} ${cy - 9} L${cx - d + 4} ${cy - 11}" stroke="#2B2440" stroke-width="2.6" stroke-linecap="round"/><path d="M${cx + d - 4} ${cy - 12} L${cx + d + 5} ${cy - 9}" stroke="#2B2440" stroke-width="2.6" stroke-linecap="round"/>` : ''
  return `${olho(cx - d, cy)}${olho(cx + d, cy)}${sobrancelha}
    <ellipse cx="${cx - d - 6}" cy="${cy + 8}" rx="5" ry="3" fill="#FF8FA3" opacity=".55"/>
    <ellipse cx="${cx + d + 6}" cy="${cy + 8}" rx="5" ry="3" fill="#FF8FA3" opacity=".55"/>${boca}`
}
function personagem(tipo, humor = 'normal', tam = 64, classe = '') {
  const corpo = {
    pedra: `<path d="M50 13C73 11 89 27 88 51C87 75 71 89 49 88C26 87 11 73 12 50C13 28 28 14 50 13Z" fill="#FF8A65"/>
      <path d="M30 28C36 22 44 20 52 21" stroke="#FFC2AD" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M70 70C66 75 60 78 54 79" stroke="#E86A45" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    papel: `<path d="M24 10H64L82 28V82C82 87 78 91 73 91H27C22 91 18 87 18 82V16C18 13 21 10 24 10Z" fill="#6C9BFF"/>
      <path d="M64 10V24C64 26 66 28 68 28H82Z" fill="#B9CFFF"/>
      <path d="M30 74H58M30 81H48" stroke="#A9C3FF" stroke-width="3.5" stroke-linecap="round"/>`,
    tesoura: `<circle cx="33" cy="24" r="13" fill="none" stroke="#2FC79E" stroke-width="8"/>
      <circle cx="67" cy="24" r="13" fill="none" stroke="#2FC79E" stroke-width="8"/>
      <path d="M26 42C26 38 29 36 33 36H67C71 36 74 38 74 42L62 86C60 91 56 93 50 93C44 93 40 91 38 86Z" fill="#2FC79E"/>
      <path d="M50 38V50" stroke="#9BEBD3" stroke-width="3" stroke-linecap="round"/>`,
  }[tipo]
  const face = { pedra: [50, 50], papel: [50, 46, 10], tesoura: [50, 60, 9] }[tipo]
  return `<svg class="pers pers-${tipo} ${classe}" viewBox="0 0 100 100" width="${tam}" height="${tam}" role="img" aria-label="${NOMES_P[tipo]}">${corpo}${rosto(face[0], face[1], humor, face[2])}</svg>`
}
const trio = (humor = 'feliz', tam = 56) => TIPOS_P.map(t => personagem(t, humor, tam)).join('')

// ---------- tela inicial ----------
function topo() {
  const feitas = LICOES.filter(l => prog.feitas[l.id]).length
  return `<header class="topo"><div class="topo-in">
    <div class="marca"><span class="marca-trio" aria-hidden="true">${trio('normal', 26)}</span>Jokenpy</div>
    <div class="stats">
      <span class="stat" title="Lições concluídas">✓ ${feitas}/${LICOES.length}</span>
      ${sequencia() ? `<span class="stat dias" title="Dias seguidos estudando">☀️ ${sequencia()} ${sequencia() === 1 ? 'dia' : 'dias'}</span>` : ''}
      <button class="som" id="som" title="Ligar ou desligar o som" aria-label="Som">${prog.som ? '🔊' : '🔇'}</button>
    </div></div></header>`
}
function ligarSom() {
  $('#som').onclick = () => { prog.som = !prog.som; salvarProgresso(); $('#som').textContent = prog.som ? '🔊' : '🔇' }
}

// As lições agrupadas em três atos, do mais simples ao jogo completo
const ATOS = [
  { titulo: 'Conversar com quem joga', tipo: 'pedra', ids: ['print', 'input'] },
  { titulo: 'Decidir quem vence', tipo: 'papel', ids: ['random', 'if', 'dict', 'funcao'] },
  { titulo: 'O jogo completo', tipo: 'tesoura', ids: ['while', 'for', 'final', 'desafios'] },
]
function atosDoCurso() {
  const usados = new Set(ATOS.flatMap(a => a.ids))
  const atos = ATOS.map(a => ({ ...a, licoes: a.ids.map(id => LICOES.findIndex(l => l.id === id)).filter(i => i >= 0) }))
  const resto = LICOES.map((l, i) => i).filter(i => !usados.has(LICOES[i].id))
  if (resto.length) atos[atos.length - 1].licoes.push(...resto)
  return atos
}

// O jogo que você está construindo: cada trecho acende quando a lição dele é concluída.
const JOGO = [
  ['random', 'import random'],
  ['', ''],
  ['random', 'opcoes = ["pedra", "papel", "tesoura"]'],
  ['dict', 'vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}'],
  ['', ''],
  ['funcao', 'def resultado(jogador, computador):'],
  ['if', '    if jogador == computador:'],
  ['if', '        return "empate"'],
  ['dict', '    if vence[jogador] == computador:'],
  ['funcao', '        return "vitoria"'],
  ['funcao', '    return "derrota"'],
  ['', ''],
  ['while', 'pontos_jogador = 0'],
  ['while', 'pontos_computador = 0'],
  ['while', 'while True:'],
  ['input', '    jogada = input("Sua jogada: ").strip().lower()'],
  ['while', '    if jogada == "sair":'],
  ['while', '        break'],
  ['while', '    if jogada not in opcoes:'],
  ['while', '        continue'],
  ['random', '    computador = random.choice(opcoes)'],
  ['print', '    print(f"Computador jogou {computador}")'],
  ['funcao', '    r = resultado(jogada, computador)'],
  ['if', '    if r == "vitoria":'],
  ['while', '        pontos_jogador += 1'],
  ['if', '    elif r == "derrota":'],
  ['while', '        pontos_computador += 1'],
  ['', ''],
  ['print', 'print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")'],
]
function htmlArquivo() {
  const tem = id => !LICOES.some(l => l.id === id) || prog.feitas[id]
  const linhas = JOGO
  const prontas = linhas.filter(([id, t]) => t && tem(id)).length, total = linhas.filter(([, t]) => t).length
  const pct = Math.round(100 * prontas / total)
  return `<section class="seu-jogo">
    <div class="seu-jogo-topo">
      <div class="anel" style="--p:${pct}"><span>${pct}%</span></div>
      <div class="seu-jogo-txt"><b>O seu <code>jokenpo.py</code></b><span>Cada lição concluída escreve uma parte do jogo.</span></div>
      <button class="btn branco mini" id="ver-codigo" aria-expanded="false">Ver código</button>
    </div>
    <div class="arquivo" id="arquivo" hidden>
      <pre>${blocosArquivo(linhas, tem)}</pre>
    </div>
  </section>`
}

// linhas que faltam viram um comentário só por bloco: "# … 4 linhas: Funções, Quem ganhou?"
function blocosArquivo(linhas, tem) {
  const out = []
  let grupo = null
  for (const [id, t] of linhas) {
    if (t && !tem(id)) {
      const titulo = LICOES.find(l => l.id === id).titulo
      if (!grupo) { grupo = { ind: t.match(/^ */)[0], n: 0, licoes: [] }; out.push(grupo) }
      grupo.n++; if (!grupo.licoes.includes(titulo)) grupo.licoes.push(titulo)
      continue
    }
    grupo = null
    out.push(t ? `<span class="ln">${realcar(t)}</span>` : '<span class="ln"> </span>')
  }
  return out.map(x => typeof x === 'string' ? x
    : `<span class="ln falta">${x.ind}# … ${x.n} ${x.n === 1 ? 'linha' : 'linhas'} · ${esc(x.licoes.join(', '))}</span>`).join('')
}

function renderHome() {
  L = null
  const iAnd = indiceAndamento()
  const andamento = iAnd >= 0 ? { ...prog.emAndamento, i: iAnd } : null
  const sugerida = LICOES.findIndex(l => !prog.feitas[l.id] && !l.bonus)
  const alvo = andamento ? andamento.i : sugerida
  const feitas = LICOES.filter(l => prog.feitas[l.id]).length
  app.innerHTML = `${topo()}
  <main class="home">
    <section class="hero">
      <div class="hero-txt">
        <span class="kicker">Curso de Python para iniciantes · grátis</span>
        <h1>Aprenda Python jogando <span class="p1">pedra</span>, <span class="p2">papel</span> e <span class="p3">tesoura</span>.</h1>
        <p class="sub">Explicações curtas, exercícios corrigidos na hora e dicas quando você travar. No fim, o jogo que você escreveu roda no seu computador.</p>
        <div class="hero-acoes">
          ${alvo >= 0
            ? `<button class="btn grande" id="seguir">${andamento ? 'Continuar de onde parei' : feitas ? 'Próxima lição' : 'Começar agora'}</button>`
            : '<button class="btn grande" id="ver-fim">Ver o meu jogo</button>'}
          ${feitas ? '<button class="btn branco grande" id="revisar-topo">🧠 Revisar</button>' : ''}
        </div>
        ${alvo >= 0 ? `<p class="continuar-info">${andamento
          ? `${LICOES[alvo].icone} <b>${esc(LICOES[alvo].titulo)}</b> · ${andamento.feitos} de ${LICOES[alvo].exercicios.length} exercícios`
          : `${feitas ? 'Próxima' : 'Primeira'}: ${LICOES[alvo].icone} <b>${esc(LICOES[alvo].titulo)}</b> · ou escolha qualquer lição abaixo`}</p>` : ''}
      </div>
      <div class="hero-arte" aria-hidden="true">
        <div class="bolha-fala">print("Bora jogar?")</div>
        ${personagem('pedra', 'feliz', 132, 'flutua f1')}${personagem('papel', 'normal', 132, 'flutua f2')}${personagem('tesoura', 'feliz', 132, 'flutua f3')}
      </div>
    </section>

    ${htmlArquivo()}

    ${atosDoCurso().map((ato, n) => `<section class="ato ato-${ato.tipo}">
      <div class="ato-topo">
        ${personagem(ato.tipo, ato.licoes.every(i => prog.feitas[LICOES[i].id]) ? 'feliz' : 'normal', 46)}
        <div><span class="kicker">Parte ${n + 1}</span><h2>${esc(ato.titulo)}</h2></div>
        <span class="ato-cont">${ato.licoes.filter(i => prog.feitas[LICOES[i].id]).length}/${ato.licoes.length}</span>
      </div>
      <ol class="lista">
        ${ato.licoes.map(i => {
          const l = LICOES[i], feita = !!prog.feitas[l.id], and = andamento?.i === i
          const estado = and ? `<span class="tag and">${andamento.feitos}/${l.exercicios.length}</span>`
            : feita ? '<span class="check" title="Concluída">✓</span>'
            : i === sugerida ? '<span class="tag sug">próxima</span>'
            : l.bonus ? '<span class="tag">bônus</span>' : '<span class="seta">›</span>'
          return `<li class="item">
            <button class="no cor-${tipoDaLicao(i)} ${feita ? 'feito' : ''} ${i === alvo ? 'sugerida' : ''}" data-i="${i}">
              <span class="ico" aria-hidden="true">${l.icone}</span>
              <span class="txt"><small>Lição ${i + 1}</small><b>${esc(l.titulo)}</b><em>${esc(l.aprende)}</em></span>
              ${estado}
            </button>
          </li>`
        }).join('')}
      </ol>
    </section>`).join('')}

    ${feitas ? `<section class="painel revisao">${personagem('papel', 'normal', 54)}<div><b>Revisão rápida</b>
      <span>${TAM_REVISAO} perguntas do que você já estudou, começando pelo que você mais errou.</span></div>
      <button class="btn" id="revisar">Revisar</button></section>` : ''}
    ${prog.feitas.final && alvo >= 0 ? '<button class="btn branco largo" id="ver-fim" style="margin-top:22px">🏆 Ver o meu jogo</button>' : ''}
    <button class="link" id="zerar">Apagar meu progresso</button>
  </main>`
  ligarSom()
  $$('.no').forEach(b => b.onclick = () => alternarCartao(+b.dataset.i, b.parentElement))
  const sg = $('#seguir'); if (sg) sg.onclick = () => andamento ? retomar() : iniciar(alvo)
  for (const id of ['#revisar', '#revisar-topo']) { const b = $(id); if (b) b.onclick = iniciarRevisao }
  $('#ver-codigo').onclick = e => {
    const a = $('#arquivo'); a.hidden = !a.hidden
    e.currentTarget.textContent = a.hidden ? 'Ver código' : 'Esconder'; e.currentTarget.setAttribute('aria-expanded', !a.hidden)
  }
  $('#zerar').onclick = () => {
    if (!confirm('Apagar todo o progresso (lições, rascunhos e revisão)?')) return
    const som = prog.som; prog = novoProgresso(); prog.som = som; salvarProgresso(); renderHome()
  }
  const vf = $('#ver-fim'); if (vf) vf.onclick = renderFim
}

// detalhes que abrem ao clicar numa lição do sumário
function fecharCartao() { $('.cartao-licao')?.remove(); $$('.item.aberta').forEach(n => n.classList.remove('aberta')) }
function alternarCartao(i, item) {
  const aberto = item.classList.contains('aberta')
  fecharCartao()
  if (aberto) return
  const l = LICOES[i], feita = !!prog.feitas[l.id]
  const and = indiceAndamento() === i ? prog.emAndamento : null
  const c = document.createElement('div')
  c.className = `cartao-licao cor-${tipoDaLicao(i)}`
  c.innerHTML = `<p>${and ? `Você parou em ${and.feitos} de ${l.exercicios.length} exercícios.` : `${l.ensino.length} explicações curtas e ${l.exercicios.length} exercícios. Você vai ver: ${esc(l.aprende)}.`}</p>
    <div class="acoes">
      ${and ? '<button class="btn" data-acao="continuar">Continuar</button>' : ''}
      <button class="btn ${and ? 'branco' : ''}" data-acao="comecar">${and ? 'Começar do início' : feita ? 'Fazer de novo' : 'Começar'}</button>
      ${and ? '' : '<button class="btn branco" data-acao="exercicios">Ir direto aos exercícios</button>'}
    </div>`
  c.onclick = e => {
    const acao = e.target.closest('[data-acao]')?.dataset.acao
    if (acao === 'continuar') retomar()
    else if (acao === 'comecar') iniciar(i)
    else if (acao === 'exercicios') iniciar(i, null, true)
  }
  item.classList.add('aberta'); item.append(c)
  c.querySelector('.btn')?.focus({ preventScroll: true })
  c.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}
document.addEventListener('click', e => { if (!e.target.closest('.cartao-licao, .no')) fecharCartao() })

// ---------- lição ----------
// A lição tem duas fases: "ensino" (cartões de explicação, pode pular) e "exercicios".
function iniciar(i, salvo = null, pularEnsino = false, licao = LICOES[i]) {
  fecharCartao()
  const fila = salvo
    ? salvo.fila.filter(k => typeof k === 'number' && k >= 0).map(k => licao.exercicios[k]).filter(Boolean)
    : [...licao.exercicios]
  if (!salvo) limparRascunhos(licao)
  const passo = salvo ? salvo.passo ?? null : pularEnsino ? null : 0
  L = {
    i, licao, fila, total: licao.exercicios.length,
    fase: passo == null ? 'exercicios' : 'ensino', passo: passo ?? 0,
    feitos: salvo?.feitos || 0, erros: salvo?.erros || 0, dicas: salvo?.dicas || 0,
    inicio: Date.now() - (salvo?.decorrido || 0), codigoFinal: salvo?.codigoFinal || null, estado: 'responder',
  }
  L.tipo = licao.revisao ? 'papel' : tipoDaLicao(i)
  app.innerHTML = `<div class="licao cor-${L.tipo}">
    <header class="licao-topo">
      <div class="licao-topo-in">
        <button class="fechar" id="fechar" aria-label="Voltar ao início (o progresso fica salvo)" title="Voltar ao início (o progresso fica salvo)">✕</button>
        <div class="licao-meio">
          <div class="licao-nome"><small>${licao.revisao ? 'Revisão' : `Lição ${i + 1}`}</small><b>${esc(licao.titulo)}</b><span class="contador" id="contador"></span></div>
          <div class="barra" role="progressbar" aria-label="Progresso da lição"><div id="barra"></div></div>
        </div>
        <button class="topo-btn" id="teoria" title="Resumo e explicações desta lição">📖 <span>Resumo</span></button>
      </div>
    </header>
    <section class="corpo" id="corpo"></section>
    <footer class="rodape" id="rodape" aria-live="polite"></footer>
  </div>`
  atualizarBarra()
  $('#fechar').onclick = sairDaLicao
  $('#teoria').onclick = abrirTeoria
  if (salvo) toast('Continuando de onde você parou')
  proximo()
}

const TAM_REVISAO = 6
const licaoDe = it => LICOES.find(l => l.exercicios.includes(it))
function iniciarRevisao() {
  const fracos = prog.fracos || {}
  const banco = LICOES.filter(l => prog.feitas[l.id]).flatMap(l => l.exercicios.filter(it => it.tipo !== 'codigo'))
  const escolhidos = banco.map(it => ({ it, peso: (fracos[it.id] || 0) + Math.random() }))
    .sort((a, b) => b.peso - a.peso).slice(0, TAM_REVISAO).map(x => x.it)
  iniciar(-1, null, true, { id: 'revisao', titulo: 'Revisão', icone: '🧠', aprende: 'revisar o que já viu', revisao: true, ensino: [], exercicios: embaralhar(escolhidos) })
}

function retomar() { const i = indiceAndamento(); if (i >= 0) iniciar(i, prog.emAndamento) }
function sairDaLicao() { salvarAndamento(); toast(L.licao.revisao ? 'Revisão encerrada.' : 'Progresso salvo. Continue quando quiser.'); renderHome() }

// guarda onde você está na lição (chamado a cada passo)
function salvarAndamento() {
  if (!L || L.licao.revisao) return
  let fila = L.fila
  if (L.estado === 'feedback' && L.ultimoCerto === true) fila = fila.slice(1)
  else if (L.estado === 'feedback' && L.ultimoCerto === false && fila[0].tipo !== 'codigo') fila = [...fila.slice(1), fila[0]]
  prog.emAndamento = {
    i: L.i, id: L.licao.id, passo: L.fase === 'ensino' ? L.passo : null, fila: fila.map(it => it.k), feitos: L.feitos, erros: L.erros,
    dicas: L.dicas, decorrido: Date.now() - L.inicio, codigoFinal: L.codigoFinal,
  }
  salvarProgresso()
}

const casosDe = it => it.casos || [{ entrada: it.entrada || '', espera: it.espera, proibido: it.proibido }]
function proximo() {
  if (L.fase === 'ensino') return renderEnsino()
  L.fila.length ? renderItem() : concluir()
}

// ---------- ensino: explicação antes dos exercícios ----------
function renderEnsino() {
  const cartoes = L.licao.ensino, n = L.passo, c = cartoes[n], ultimo = n === cartoes.length - 1
  Object.assign(L, { estado: 'ensino', sugestao: null })
  $('#barra').parentElement.classList.add('azul')
  $('#barra').style.width = (100 * (n + 1) / cartoes.length) + '%'
  $('#contador').textContent = `explicação ${n + 1}/${cartoes.length}`
  $('#corpo').innerHTML = `<div class="corpo-in entrar">
    <div class="ensino-topo">
      <span class="kicker">Conceito ${n + 1} de ${cartoes.length}</span>
      <div class="pontos" aria-hidden="true">${cartoes.map((_, k) => `<i class="${k < n ? 'visto' : k === n ? 'agora' : ''}"></i>`).join('')}</div>
    </div>
    <article class="pagina">
      <div class="pagina-topo">${personagem(L.tipo, n === cartoes.length - 1 ? 'feliz' : 'normal', 52)}<h2>${esc(c.titulo)}</h2></div>
      ${c.texto}
      ${c.codigo ? htmlExemplo(c) : ''}
    </article>
  </div>`
  $('#corpo').scrollTop = 0
  const r = $('#rodape'); r.className = 'rodape'
  r.innerHTML = rodapeIn(`<div class="rodape-esq">
      <button class="btn branco" id="pular-ensino" title="Pular a explicação e ir direto para os exercícios">Pular</button>
    </div>
    <div class="rodape-dir">
      ${n > 0 ? '<button class="btn branco" id="voltar-ensino" aria-label="Explicação anterior">←</button>' : ''}
      <button class="btn" id="principal">${ultimo ? 'Exercícios →' : 'Próximo →'}</button>
    </div>`, 'uma-linha')
  $('#principal').onclick = () => ultimo ? irParaExercicios() : (L.passo++, proximo())
  $('#pular-ensino').onclick = irParaExercicios
  const v = $('#voltar-ensino'); if (v) v.onclick = () => { L.passo--; proximo() }
  if (c.codigo) ligarExemplo(c)
  $('#principal').focus({ preventScroll: true })
  salvarAndamento()
}

function irParaExercicios() {
  L.fase = 'exercicios'
  $('#barra').parentElement.classList.remove('azul')
  atualizarBarra()
  proximo()
}

// exemplo do ensino: dá para editar e rodar quantas vezes quiser
function htmlExemplo(c) {
  const digita = c.entrada ? c.entrada.replace(/\n$/, '').split('\n').map(v => `"${esc(v)}"`).join(' ⏎ ') : ''
  return `<div class="rotulo">Experimente · mude o código e rode</div>
  ${digita ? `<div class="chips"><span class="chip">⌨️ O exemplo digita: ${digita}</span></div>` : ''}
  <div class="editor mini">
    <div class="editor-topo"><span>exemplo.py</span><button class="recomecar" id="ex-original" title="Voltar ao exemplo original">↺ Original</button></div>
    <textarea id="ex-editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Código do exemplo" rows="${c.codigo.split('\n').length + 1}">${esc(c.codigo)}</textarea>
  </div>
  <button class="btn azul mini" id="ex-rodar">▶ Rodar</button>
  <div class="saida" id="ex-saida" hidden><div class="saida-topo">Saída</div><pre id="ex-saida-texto"></pre><div id="ex-entender"></div></div>`
}

function ligarExemplo(c) {
  const ta = $('#ex-editor')
  ligarEditor(ta)
  $('#ex-original').onclick = () => { ta.value = c.codigo; $('#ex-saida').hidden = true }
  $('#ex-rodar').onclick = async () => {
    const b = $('#ex-rodar'); b.disabled = true; b.textContent = 'Rodando…'
    const r = await rodar({ codigo: ta.value, entrada: c.entrada || '', antes: '', teste: '' })
    if (!b.isConnected) return
    $('#ex-saida').hidden = false
    let html = esc(r.saida || '')
    if (r.erro) html += `<span class="err">${r.saida && !r.saida.endsWith('\n') ? '\n' : ''}${esc(r.erro)}</span>`
    $('#ex-saida-texto').innerHTML = html || '<span class="vazio">(nada foi mostrado na tela)</span>'
    $('#ex-entender').innerHTML = htmlEntender(r.erro)
    b.disabled = false; b.textContent = '▶ Rodar de novo'
  }
}

function renderItem() {
  const it = L.fila[0]
  Object.assign(L, { estado: 'responder', resp: null, falhas: 0, viuResposta: false, sugestao: null, ultimaExec: null, ultimoCerto: null, dicasVistas: 0 })
  let html = ''
  if (it.tipo === 'escolha') { L.ordem = embaralhar(it.opcoes.map((_, k) => k)); html = htmlEscolha(it) }
  else if (it.tipo === 'completar') html = htmlCompletar(it)
  else if (it.tipo === 'montar') { L.pecas = embaralhar([...it.certa, ...(it.extras || [])]).map((txt, id) => ({ txt, id })); L.montado = []; html = htmlMontar(it) }
  else if (it.tipo === 'codigo') html = htmlCodigo(it)
  const TIPOS = { escolha: 'Escolha a resposta', completar: 'Complete o código', montar: 'Monte a linha', codigo: 'Escreva o código' }
  $('#contador').textContent = `${L.feitos}/${L.total}`
  const corpo = $('#corpo')
  corpo.innerHTML = `<div class="corpo-in entrar"><span class="kicker">${TIPOS[it.tipo]}</span>${html}
    <div class="dicas" id="dicas" hidden></div></div>`
  corpo.scrollTop = 0
  rodapeResponder(it)
  ligarItem(it)
  salvarAndamento()
}

const htmlResumo = l => l.resumo?.length ? `<div class="resumo"><h3>Para guardar</h3><ul>${l.resumo.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''

// dicas do exercício: cada clique revela a próxima, da mais geral à mais específica
function mostrarDica(it) {
  const dicas = it.dicas || []
  if (!dicas.length) { if (IA_ATIVA && it.tipo === 'codigo') pedirDica(it); else abrirTeoria(); return }
  if (L.dicasVistas < dicas.length) { L.dicasVistas++; L.dicas++; salvarAndamento() }
  const box = $('#dicas'); box.hidden = false
  const n = L.dicasVistas, acabou = n >= dicas.length
  box.innerHTML = `<ol>${dicas.slice(0, n).map((d, k) => `<li class="${k === n - 1 ? 'nova' : ''}"><small>Dica ${k + 1} de ${dicas.length}</small>${d}</li>`).join('')}</ol>
    <div class="dicas-acoes">
      ${acabou ? '' : '<button class="btn branco mini" id="mais-dica">Mais uma dica</button>'}
      ${acabou ? '<button class="btn branco mini" id="dica-resumo">📖 Rever a explicação</button>' : ''}
      ${IA_ATIVA && it.tipo === 'codigo' ? '<button class="btn branco mini" id="dica-ia">Perguntar à IA sobre o meu código</button>' : ''}
    </div>`
  const md = $('#mais-dica'); if (md) md.onclick = () => mostrarDica(it)
  const dr = $('#dica-resumo'); if (dr) dr.onclick = abrirTeoria
  const di = $('#dica-ia'); if (di) di.onclick = () => pedirDica(it)
  for (const id of ['#btn-dica', '#btn-dica-q']) { const b = $(id); if (b) b.textContent = acabou ? '💡 Dicas' : `💡 Dica (${n}/${dicas.length})` }
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

// a teoria inteira da lição (todos os cartões do ensino), para consultar durante os exercícios
function htmlTeoria(l) {
  return `<span class="kicker">Resumo · ${esc(l.titulo)}</span>
  ${htmlResumo(l)}
  ${l.ensino.map((c, k) => `<section class="teoria-cartao">
    <h3>${k + 1}. ${esc(c.titulo)}</h3>
    ${c.texto}
    ${c.codigo ? `<pre class="cod">${realcar(c.codigo)}</pre>` : ''}
  </section>`).join('')}`
}

function htmlEscolha(it) {
  return `<h2>${it.pergunta}</h2>
  ${it.codigo ? `<pre class="cod">${realcar(it.codigo)}</pre>` : ''}
  <div class="opcoes">${L.ordem.map((k, n) => `<button class="opcao" data-k="${k}"><span class="num">${n + 1}</span>${it.opcoesCodigo ? `<code>${esc(it.opcoes[k])}</code>` : esc(it.opcoes[k])}</button>`).join('')}</div>`
}

function htmlCompletar(it) {
  const codigo = it.codigo.split(/\[\[(\d+)\]\]/).map((p, k) => k % 2
    ? `<input class="lacuna" data-n="${p}" aria-label="Lacuna ${+p + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:${Math.max(...it.respostas[p].map(a => a.length)) + 2}ch">`
    : realcar(p)).join('')
  return `<h2>${it.pergunta}</h2><pre class="cod">${codigo}</pre>`
}

function htmlMontar(it) {
  return `<h2>${it.pergunta}</h2>
  <div class="montagem" id="montagem" aria-label="Sua resposta"></div>
  <div class="banco" id="banco" aria-label="Peças"></div>
  <p class="ajuda-montar">Toque nas peças para montar. Toque de novo para tirar.</p>`
}

function desenharMontar() {
  $('#montagem').innerHTML = L.montado.length
    ? L.montado.map(id => `<button class="peca" data-id="${id}">${esc(L.pecas[id].txt)}</button>`).join('')
    : '<span class="montagem-vazia">Sua linha de código aparece aqui</span>'
  $('#banco').innerHTML = L.pecas.map(p => `<button class="peca ${L.montado.includes(p.id) ? 'usada' : ''}" data-id="${p.id}" ${L.montado.includes(p.id) ? 'tabindex="-1" aria-hidden="true"' : ''}>${esc(p.txt)}</button>`).join('')
  podeVerificar(L.montado.length > 0)
}

function htmlCodigo(it) {
  const casos = casosDe(it)
  const digita = casos[0].entrada ? casos[0].entrada.replace(/\n$/, '').split('\n').map(v => `"${esc(v)}"`).join(' ⏎ ') : ''
  const codigo = prog.rascunhos[it.id] ?? it.inicial ?? ''
  return `<h2>${esc(it.titulo)}</h2>
  <p class="enunciado">${it.enunciado}</p>
  <div class="chips">
    ${digita ? `<span class="chip">⌨️ O teste digita: ${digita}</span>` : ''}
    ${casos.length > 1 ? `<span class="chip">🧪 ${casos.length} testes com entradas diferentes</span>` : ''}
    ${prog.rascunhos[it.id] != null ? '<span class="chip verde">💾 Rascunho recuperado</span>' : ''}
  </div>
  <div class="editor">
    <div class="editor-topo"><span>seu_codigo.py</span><span class="atalhos">Tab indenta${IA_ATIVA ? ' · Ctrl+Espaço completa' : ''} · Ctrl+Enter verifica</span><button class="recomecar" id="recomecar" title="Voltar ao código inicial">↺ Recomeçar</button></div>
    <textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Editor de código">${esc(codigo)}</textarea>
  </div>
  <div class="ferramentas">
    <button class="ferr" id="btn-dica">💡 Dica</button>
    ${IA_ATIVA ? '<button class="ferr" id="btn-completar" title="Ou aperte Ctrl+Espaço no editor">✨ Completar</button>' : ''}
    <button class="ferr" id="btn-previa">👀 Ver resposta</button>
  </div>
  <div class="sugestao" id="sugestao" hidden></div>
  <div class="ia" id="ia" hidden></div>
  <div class="previa" id="previa" hidden></div>
  <div class="saida" id="saida" hidden><div class="saida-topo" id="saida-topo">Saída</div><pre id="saida-texto"></pre><div id="entender"></div></div>`
}

function ligarItem(it) {
  if (it.tipo === 'escolha') {
    $$('.opcao').forEach(b => b.onclick = () => {
      $$('.opcao').forEach(x => x.classList.remove('sel'))
      b.classList.add('sel'); L.resp = +b.dataset.k; podeVerificar(true)
    })
  } else if (it.tipo === 'completar') {
    const ls = $$('.lacuna')
    ls.forEach(l => l.oninput = () => podeVerificar(ls.every(x => x.value.trim())))
    ls[0].focus()
  } else if (it.tipo === 'montar') {
    $('#banco').onclick = e => { const p = e.target.closest('.peca'); if (p) { L.montado.push(+p.dataset.id); desenharMontar() } }
    $('#montagem').onclick = e => { const p = e.target.closest('.peca'); if (p) { L.montado = L.montado.filter(id => id !== +p.dataset.id); desenharMontar() } }
    desenharMontar()
  } else if (it.tipo === 'codigo') {
    const ta = $('#editor'); ligarEditor(ta, it); ta.focus()
    ta.setSelectionRange(ta.value.length, ta.value.length)
    $('#recomecar').onclick = () => {
      if (ta.readOnly) return
      if (ta.value !== (it.inicial || '') && !confirm('Apagar o seu código e voltar ao início do exercício?')) return
      definirCodigo(it, it.inicial || ''); delete prog.rascunhos[it.id]; salvarProgresso()
      $('#saida').hidden = true; ta.focus()
    }
    $('#btn-dica').onclick = () => mostrarDica(it)
    const bc = $('#btn-completar'); if (bc) bc.onclick = () => pedirCompletar(it)
    $('#btn-previa').onclick = () => alternarPrevia(it)
  }
}

function definirCodigo(it, valor) {
  const ta = $('#editor'); if (!ta) return
  ta.value = valor; descartarSugestao()
  prog.rascunhos[it.id] = valor; salvarProgresso()
}

// editor: Tab = 4 espaços, Enter mantém a indentação (e soma 4 depois de ":").
// Com um exercício (it), também salva o rascunho a cada tecla e aceita o autocomplete.
function ligarEditor(ta, it = null) {
  const inserir = txt => { if (!document.execCommand('insertText', false, txt)) ta.setRangeText(txt, ta.selectionStart, ta.selectionEnd, 'end') }
  if (it) ta.addEventListener('input', () => {
    if (L.sugestao && !L.aceitando) descartarSugestao()
    prog.rascunhos[it.id] = ta.value; salvarProgresso()
  })
  if (TOQUE) ta.closest('.editor').insertAdjacentHTML('afterend', `<div class="teclas" aria-label="Teclas de código">
    ${['⇥', '⇤', ':', '(', ')', '"', '=', '[', ']', '{', '}', '_', '.', ','].map(t => `<button type="button" data-t="${esc(t)}">${t === '⇥' ? '⇥ Tab' : t === '⇤' ? '⇤' : esc(t)}</button>`).join('')}</div>`)
  const teclas = ta.closest('.editor').nextElementSibling
  if (TOQUE) {
    teclas.onpointerdown = e => e.preventDefault()   // o teclado do celular continua aberto
    teclas.onclick = e => {
      const t = e.target.closest('[data-t]')?.dataset.t
      if (!t || ta.readOnly) return
      ta.focus()
      if (t === '⇤') {
        const ini = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1
        const n = ta.value.slice(ini).match(/^ {1,4}/)?.[0].length || 0
        if (n) { const c = ta.selectionStart; ta.setSelectionRange(ini, ini + n); document.execCommand('delete'); ta.setSelectionRange(Math.max(ini, c - n), Math.max(ini, c - n)) }
      } else inserir(t === '⇥' ? '    ' : t)
      ta.dispatchEvent(new Event('input'))
    }
  }
  ta.addEventListener('keydown', e => {
    if (ta.readOnly) return
    if (it && e.key === ' ' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); pedirCompletar(it); return }
    if (L.sugestao && e.key === 'Tab') { e.preventDefault(); aceitarSugestao(); return }
    if (L.sugestao && e.key === 'Escape') { e.preventDefault(); descartarSugestao(); return }
    if (e.key === 'Tab') { e.preventDefault(); inserir('    ') }
    else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const antes = ta.value.slice(0, ta.selectionStart)
      const linha = antes.slice(antes.lastIndexOf('\n') + 1)
      let ind = linha.match(/^ */)[0]
      if (/:\s*$/.test(linha)) ind += '    '
      inserir('\n' + ind)
    } else if (e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) {
      const ini = ta.selectionStart
      const linha = ta.value.slice(ta.value.lastIndexOf('\n', ini - 1) + 1, ini)
      if (linha.length >= 4 && /^ +$/.test(linha) && linha.length % 4 === 0) {
        e.preventDefault(); ta.setSelectionRange(ini - 4, ini); document.execCommand('delete')
      }
    }
  })
}

// teoria da lição numa janela, a qualquer momento
function abrirTeoria() {
  if (!L || $('.modal-fundo')) return
  const volta = document.activeElement
  const m = document.createElement('div'); m.className = 'modal-fundo'
  m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Teoria da lição">
    <button class="modal-fechar" aria-label="Fechar">✕</button>${htmlTeoria(L.licao.revisao ? licaoDe(L.fila[0]) : L.licao)}
    <button class="btn largo" id="modal-ok">Entendi</button></div>`
  document.body.append(m)
  const fechar = () => { m.remove(); document.removeEventListener('keydown', teclas); volta?.focus?.() }
  const teclas = e => { if (e.key === 'Escape') { e.preventDefault(); fechar() } }
  m.onclick = e => { if (e.target === m || e.target.closest('.modal-fechar, #modal-ok')) fechar() }
  document.addEventListener('keydown', teclas)
  $('#modal-ok').focus()
}

// ---------- rodapé: verificar, feedback ----------
function podeVerificar(sim) { const b = $('#principal'); if (b && L.estado === 'responder') b.disabled = !sim }
const rodapeIn = (html, classe = '') => `<div class="rodape-in ${classe}">${html}</div>`

function rodapeResponder(it) {
  const r = $('#rodape'); r.className = 'rodape'; L.estado = 'responder'
  const pular = '<button class="btn branco" id="pular" title="Deixar para depois: o exercício volta no fim da lição">Pular</button>'
  if (it.tipo === 'codigo') r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="executar">▶ Executar</button></div>
    <button class="btn" id="principal">Verificar</button>`)
  else r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="btn-dica-q" title="Uma pista de cada vez, sem entregar a resposta">💡 Dica</button></div>
    <button class="btn" id="principal" disabled>Verificar</button>`)
  $('#principal').onclick = verificar
  $('#pular').onclick = pularExercicio
  const ex = $('#executar'); if (ex) ex.onclick = () => executarLivre(it)
  const dq = $('#btn-dica-q'); if (dq) dq.onclick = () => (it.dicas?.length || !IA_ATIVA) ? mostrarDica(it) : dicaQuestao(it)
  const n = it.dicas?.length; if (n && L.dicasVistas) for (const id of ['#btn-dica', '#btn-dica-q']) { const b = $(id); if (b) b.textContent = L.dicasVistas >= n ? '💡 Dicas' : `💡 Dica (${L.dicasVistas}/${n})` }
}

// pular não custa vida: o exercício só vai para o fim da fila
function pularExercicio() {
  if (L.fila.length === 1) { toast('É o último exercício. Tente, ou abra uma 💡 dica.'); return }
  L.fila.push(L.fila.shift())
  toast('Exercício pulado. Ele volta no fim da lição.')
  proximo()
}

function rodapeFeedback(certo, titulo, detalhe, extras = '', rotulo = 'Continuar') {
  const r = $('#rodape'); r.className = 'rodape ' + (certo ? 'certo' : 'errado')
  r.innerHTML = rodapeIn(`<div class="fb"><div class="fb-ico">${personagem(L.tipo || 'pedra', certo ? 'feliz' : 'pensando', 54, certo ? 'pula' : 'balanca')}</div>
    <div><h3>${titulo}</h3>${detalhe ? `<p>${detalhe}</p>` : ''}</div></div>
    <div class="fb-acoes">${extras}<button class="btn ${certo ? '' : 'vermelho'}" id="principal">${rotulo}</button></div>`)
  $('#principal').focus({ preventScroll: true })
}

const ELOGIOS = ['Correto.', 'Isso mesmo.', 'Certo!', 'Exato.']
const elogio = () => ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]
function atualizarBarra() {
  const b = $('#barra'); if (b) b.style.width = (100 * L.feitos / L.total) + '%'
  const c = $('#contador'); if (c && L.fase === 'exercicios') c.textContent = `${L.feitos}/${L.total}`
}

function respostaAtual(it) {
  if (it.tipo === 'escolha') return L.resp == null ? '' : it.opcoes[L.resp]
  if (it.tipo === 'completar') return $$('.lacuna').map(l => l.value.trim() || '____').join(' | ')
  if (it.tipo === 'montar') return L.montado.map(id => L.pecas[id].txt).join(' ')
  return ''
}
function respostaCerta(it) {
  if (it.tipo === 'escolha') return it.opcoes[it.certa]
  if (it.tipo === 'completar') return it.respostas.map(a => a[0]).join(' | ')
  if (it.tipo === 'montar') return it.certa.join(' ')
  return ''
}

function verificar() {
  const it = L.fila[0]
  if (it.tipo === 'codigo') return verificarCodigo(it)

  let certo, correta
  if (it.tipo === 'escolha') {
    certo = L.resp === it.certa
    correta = it.opcoesCodigo ? `<code>${esc(it.opcoes[it.certa])}</code>` : esc(it.opcoes[it.certa])
    $$('.opcao').forEach(b => {
      const k = +b.dataset.k
      if (k === it.certa) b.classList.add('ok')
      else if (k === L.resp) b.classList.add('ruim')
      b.classList.remove('sel')
    })
    $('.opcoes').classList.add('travado')
  } else if (it.tipo === 'completar') {
    const ls = $$('.lacuna')
    const oks = ls.map(l => it.respostas[l.dataset.n].some(a => norm(a) === norm(l.value)))
    ls.forEach((l, k) => { l.classList.add(oks[k] ? 'ok' : 'ruim'); l.readOnly = true })
    certo = oks.every(Boolean)
    correta = it.respostas.map(a => `<code>${esc(a[0])}</code>`).join(' · ')
  } else if (it.tipo === 'montar') {
    certo = L.montado.map(id => L.pecas[id].txt).join('\u0001') === it.certa.join('\u0001')
    correta = `<code>${esc(it.certa.join(' '))}</code>`
    $('#banco').classList.add('travado'); $('#montagem').classList.add('travado')
  }

  L.estado = 'feedback'; L.ultimoCerto = certo
  prog.fracos = prog.fracos || {}
  prog.fracos[it.id] = Math.max(0, (prog.fracos[it.id] || 0) + (certo ? -1 : 2))
  if (!prog.fracos[it.id]) delete prog.fracos[it.id]
  if (certo) {
    somCerto(); L.feitos++; atualizarBarra()
    rodapeFeedback(true, elogio(), it.explica || '')
    $('#principal').onclick = () => { L.fila.shift(); proximo() }
  } else {
    somErro(); L.erros++
    rodapeFeedback(false, 'Não foi dessa vez', `A resposta é ${correta}.` + (it.explica ? `<br>${it.explica}` : '') + '<br><small>Ele volta no fim da lição para você tentar de novo.</small>',
      (IA_ATIVA ? '<button class="btn branco" id="explicar">💬 Explicar</button>' : '') +
      '<button class="btn branco" id="refazer" title="Fazer este exercício de novo agora">↻ Refazer agora</button>')
    const ex = $('#explicar'); if (ex) ex.onclick = () => explicarErro(it)
    $('#refazer').onclick = () => renderItem()   // mesmo exercício, peças/opções embaralhadas de novo
    $('#principal').onclick = () => { L.fila.push(L.fila.shift()); proximo() }
  }
  salvarAndamento()
}

// ---------- rodar código ----------
async function rodar(dados) {
  try {
    const res = await fetch('/executar', { method: 'POST', headers: HEADERS, body: JSON.stringify(dados) })
    if (!res.ok) throw new Error()
    marcarServidor(true)
    return await res.json()
  } catch {
    marcarServidor(false)
    return { ok: false, saida: '', erro: LOCAL
      ? 'Não consegui falar com o servidor. Ele está rodando? (python -m uvicorn server:app --port 8080)'
      : 'Não consegui falar com o servidor. Confira a internet e tente de novo.' }
  }
}

function mostrarSaida(r, rotulo) {
  $('#saida').hidden = false
  $('#saida-topo').textContent = rotulo || 'Saída'
  let html = esc(r.saida || '')
  if (r.erro) html += `<span class="err">${r.saida && !r.saida.endsWith('\n') ? '\n' : ''}${esc(r.erro)}</span>`
  $('#saida-texto').innerHTML = html || '<span class="vazio">(nada foi mostrado na tela)</span>'
  $('#entender').innerHTML = htmlEntender(r.erro)
}

async function executarLivre(it) {
  const b = $('#executar'); b.disabled = true; b.textContent = 'Rodando…'
  const r = await rodar({ codigo: $('#editor').value, entrada: casosDe(it)[0].entrada || '', antes: it.antes || '', teste: '' })
  if (!$('#saida')) return
  L.ultimaExec = r
  mostrarSaida(r)
  if (b.isConnected) { b.disabled = false; b.textContent = '▶ Executar' }
}

async function verificarCodigo(it) {
  const codigo = $('#editor').value
  const btn = $('#principal'); btn.disabled = true; btn.textContent = 'Testando…'
  const ex = $('#executar'); if (ex) ex.disabled = true
  const casos = casosDe(it)
  let falha = null
  for (const [n, c] of casos.entries()) {
    const r = await rodar({ codigo, entrada: c.entrada || '', antes: it.antes || '', teste: it.teste || '' })
    L.ultimaExec = r
    mostrarSaida(r, casos.length > 1 ? `Saída · teste ${n + 1} de ${casos.length}` : 'Saída')
    const quando = casos.length > 1 ? ` quando digitam ${c.entrada.replace(/\n$/, '').split('\n').map(v => `"${v}"`).join(' e ')}` : ''
    const saida = padrao(r.saida)
    if (!r.ok) falha = r.erro
    else if (c.espera && !saida.includes(padrao(c.espera))) falha = `A saída deveria mostrar "${c.espera}"${quando}. Compare com a sua saída acima: o texto precisa ser igual (maiúsculas e acentos não importam).`
    else { const p = (c.proibido || []).find(p => saida.includes(padrao(p))); if (p) falha = `Não deveria aparecer "${p}"${quando}.` }
    if (falha) break
  }

  L.estado = 'feedback'; L.ultimoCerto = !falha
  if (!falha) {
    somCerto(); L.feitos++; atualizarBarra()
    $('#editor').readOnly = true
    if (it.final) { L.codigoFinal = codigo; prog.meuJogo = codigo }
    descartarSugestao()
    rodapeFeedback(true, L.viuResposta ? 'Passou.' : 'Passou em todos os testes!',
      L.viuResposta ? 'Agora leia a solução linha por linha e tente refazer sozinho depois.' : 'O seu código faz o que foi pedido.',
      IA_ATIVA ? '<button class="btn branco" id="melhorar">🧠 Como melhorar?</button>' : '')
    const m = $('#melhorar'); if (m) m.onclick = () => pedirRevisao(it)
    $('#principal').onclick = () => { L.fila.shift(); proximo() }
  } else {
    somErro(); L.falhas++
    const ajuda = L.falhas === 1 ? '<br>Corrija e verifique de novo: no código você pode tentar quantas vezes quiser.' : '<br>Travou? Abra uma 💡 dica ou use 👀 Ver resposta.'
    const explicado = entenderErro(falha)
    rodapeFeedback(false, 'Ainda não passou', (explicado ? `${explicado}<br><small>O erro original está na Saída, acima.</small>` : esc(falha)) + ajuda, '<button class="btn branco" id="dica-falha">💡 Dica</button>', 'Tentar de novo')
    $('#saida').scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    $('#principal').onclick = () => { rodapeResponder(it); $('#editor').focus() }
    $('#dica-falha').onclick = () => { rodapeResponder(it); mostrarDica(it) }
  }
  salvarAndamento()
}

// ---------- IA (Gemini). O navegador fala com o nosso servidor; a chave fica lá. ----------
async function pedirIA(dados) {
  try {
    const res = await fetch('/ia', { method: 'POST', headers: HEADERS, body: JSON.stringify(dados) })
    const d = await res.json()
    return res.ok ? d : { erro: d.detail || 'A IA não respondeu.' }
  } catch { return { erro: 'Não consegui falar com o servidor.' } }
}

// texto da IA -> HTML seguro (blocos ``` viram código colorido, `x` vira <code>)
function formatarIA(t) {
  return t.trim().split(/```(?:\w+)?\n?([\s\S]*?)```/).map((p, k) => k % 2
    ? `<pre class="cod">${realcar(p.replace(/\n$/, ''))}</pre>`
    : esc(p).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')).join('')
}

function caixaIA() {
  let box = $('#ia')
  if (!box) { box = document.createElement('div'); box.className = 'ia'; box.id = 'ia'; $('.corpo-in').append(box) }
  return box
}

async function iaNoPainel(alvo, titulo, dados) {
  const mostrar = html => { alvo.hidden = false; alvo.innerHTML = `<div class="ia-ico">🐍</div><div class="ia-texto"><small>${titulo}</small>${html}</div>` }
  mostrar('<span class="pensando">Pensando</span>')
  alvo.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  const r = await pedirIA(dados)
  if (!alvo.isConnected) return
  mostrar(r.erro ? `<span class="ia-erro">${esc(r.erro)}</span>` : formatarIA(r.texto || 'Sem sugestões desta vez.'))
  alvo.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

const dadosCodigo = (it, acao) => ({
  acao, enunciado: `${it.titulo}: ${textoDe(it.enunciado)}`, codigo: $('#editor').value,
  saida: L.ultimaExec?.saida || '', erro: L.ultimaExec?.erro || '', resposta: it.resposta,
})
function pedirDica(it) { L.dicas++; salvarAndamento(); iaNoPainel($('#ia'), '💡 Dica da Py', dadosCodigo(it, 'dica')) }
const pedirRevisao = it => iaNoPainel($('#ia'), '🧠 Como melhorar', dadosCodigo(it, 'revisar'))

function dicaQuestao(it) {
  L.dicas++; salvarAndamento()
  const opcoes = it.tipo === 'escolha' ? it.opcoes.join(' | ') : it.tipo === 'montar' ? L.pecas.map(p => p.txt).join(' | ') : ''
  iaNoPainel(caixaIA(), '💡 Dica da Py', {
    acao: 'dica_questao', tipo: it.tipo, enunciado: textoDe(it.pergunta), codigo: semLacunas(it.codigo),
    opcoes, escolhida: respostaAtual(it), resposta: respostaCerta(it),
  })
}

function explicarErro(it) {
  iaNoPainel(caixaIA(), '💬 Explicação da Py', {
    acao: 'explicar', enunciado: textoDe(it.pergunta), codigo: semLacunas(it.codigo),
    escolhida: respostaAtual(it), resposta: respostaCerta(it),
  })
}

// autocomplete: sugere a continuação a partir do cursor; Tab aceita, Esc descarta
async function pedirCompletar(it) {
  const ta = $('#editor'), box = $('#sugestao')
  if (!IA_ATIVA || !ta || ta.readOnly) return
  const cursor = ta.selectionStart, codigo = ta.value
  L.sugestao = null
  box.hidden = false
  box.innerHTML = '<small>✨ Sugestão</small><span class="pensando">Pensando</span>'
  const r = await pedirIA({ ...dadosCodigo(it, 'completar'), cursor })
  if (!box.isConnected) return
  if (ta.value !== codigo) { box.hidden = true; return }  // você continuou digitando
  if (r.erro || !r.texto) {
    box.innerHTML = `<small>✨ Sugestão</small><span class="ia-erro">${esc(r.erro || 'Nada para completar aqui.')}</span>`
    setTimeout(() => { if (!L?.sugestao && box.isConnected) box.hidden = true }, 2500)
    return
  }
  L.sugestao = { texto: r.texto, cursor }
  box.innerHTML = `<small>✨ Sugestão</small><pre class="cod">${realcar(r.texto)}</pre>
    <div class="sugestao-acoes"><button class="btn mini" id="aceitar">Aceitar (Tab)</button><button class="btn branco mini" id="descartar">Descartar (Esc)</button></div>`
  $('#aceitar').onclick = aceitarSugestao
  $('#descartar').onclick = descartarSugestao
  ta.focus(); ta.setSelectionRange(cursor, cursor)
}

function aceitarSugestao() {
  const ta = $('#editor'), s = L.sugestao
  if (!s || !ta) return
  L.sugestao = null; $('#sugestao').hidden = true
  ta.focus(); ta.setSelectionRange(s.cursor, s.cursor)
  L.aceitando = true
  if (!document.execCommand('insertText', false, s.texto)) ta.setRangeText(s.texto, s.cursor, s.cursor, 'end')
  L.aceitando = false
  prog.rascunhos[L.fila[0].id] = ta.value; salvarProgresso()
}

function descartarSugestao() {
  if (!L) return
  L.sugestao = null
  const b = $('#sugestao'); if (b) b.hidden = true
}

// prévia da resposta: abre e fecha a qualquer momento, sem apagar o seu código
function alternarPrevia(it) {
  const p = $('#previa'), b = $('#btn-previa')
  if (!p.hidden) { p.hidden = true; b.classList.remove('ativo'); b.textContent = '👀 Ver resposta'; return }
  L.viuResposta = true
  p.hidden = false; b.classList.add('ativo'); b.textContent = '🙈 Esconder resposta'
  p.innerHTML = `<div class="previa-topo"><small>👀 Resposta de referência</small><button class="btn branco mini" id="usar-resposta">Usar no editor</button></div>
    <pre class="cod">${realcar(it.resposta)}</pre>`
  $('#usar-resposta').onclick = () => {
    const ta = $('#editor')
    if (ta.readOnly) return
    if (ta.value.trim() && ta.value !== (it.inicial || '') && !confirm('Trocar o seu código pela resposta?')) return
    definirCodigo(it, it.resposta); ta.focus()
  }
  p.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

// ---------- fim da lição ----------
async function concluir() {
  const l = L.licao
  const jaFeita = !!prog.feitas[l.id]
  marcarDia()
  if (!l.revisao) { prog.feitas[l.id] = true; prog.emAndamento = null; limparRascunhos(l) }
  salvarProgresso()
  let arquivo = null
  if (L.codigoFinal) {
    try {
      const r = await fetch('/salvar', { method: 'POST', headers: HEADERS, body: JSON.stringify({ codigo: L.codigoFinal }) })
      arquivo = (await r.json()).arquivo
    } catch {}
  }
  const seg = Math.round((Date.now() - L.inicio) / 1000)
  const tempo = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`
  const primeira = Math.round(100 * L.total / (L.total + L.erros))
  const i = L.i, revisao = l.revisao
  const seguinte = revisao ? -1 : LICOES.findIndex((x, k) => k > i && !prog.feitas[x.id])
  somFim()
  app.innerHTML = `${confete()}
  <main class="resultado">
    <div class="resultado-topo">
      <div class="trofeu">${l.final ? trio('feliz', 84) : personagem(L.tipo, 'feliz', 110)}</div>
      <span class="kicker">${revisao ? 'Revisão' : `Lição ${i + 1}`} concluída</span>
      <h1>${l.final ? 'Você construiu um Jokenpô!' : revisao ? 'Revisão feita' : esc(l.titulo)}</h1>
      <p>${revisao ? (L.erros ? 'O que você errou volta com mais frequência nas próximas revisões.' : 'Tudo certo. Revisar é o que faz o conteúdo ficar na memória.')
        : L.erros === 0 ? 'Tudo certo de primeira.' : 'Os exercícios que você errou foram refeitos até sair.'}</p>
    </div>
    <div class="cartoes">
      <div class="cartao"><small>De primeira</small><b>${primeira}%</b></div>
      <div class="cartao"><small>Tempo</small><b>${tempo}</b></div>
      <div class="cartao"><small>Dicas</small><b>${L.dicas}</b></div>
    </div>
    ${revisao ? '' : htmlResumo(l)}
    ${l.final ? htmlJogar(arquivo) : ''}
    ${!revisao && !l.final && !jaFeita ? '<p class="continuar-info" style="text-align:center">Mais uma parte do seu <code>jokenpo.py</code> foi liberada no início.</p>' : ''}
    <div class="resultado-acoes">
      ${seguinte >= 0 ? `<button class="btn largo" id="seguinte">Próxima: ${esc(LICOES[seguinte].titulo)} →</button>` : ''}
      <button class="btn ${seguinte >= 0 ? 'branco' : ''} largo" id="cont">Voltar ao início</button>
      <button class="btn branco largo" id="denovo">↻ Fazer de novo</button>
    </div>
  </main>`
  $('#cont').onclick = renderHome
  $('#denovo').onclick = () => revisao ? iniciarRevisao() : iniciar(i)
  const sg = $('#seguinte'); if (sg) sg.onclick = () => iniciar(seguinte)
  const bx = $('#baixar'); if (bx) bx.onclick = baixarJogo
  ;($('#seguinte') || $('#cont')).focus()
}

function baixarJogo() {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([prog.meuJogo || ''], { type: 'text/x-python' }))
  a.download = 'meu_jokenpo.py'; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
function htmlJogar(arquivo) {
  if (!LOCAL) return `<div class="caixa-fim">
    <h3>Jogue o seu jogo no computador</h3>
    ${prog.meuJogo ? '<button class="btn azul largo" id="baixar">⬇ Baixar meu_jokenpo.py</button>' : '<p>Passe no projeto final para baixar o seu código.</p>'}
    <ol>
      <li>Instale o Python em <code>python.org/downloads</code> (no Windows, marque <b>Add Python to PATH</b>).</li>
      <li>Abra o terminal na pasta onde o arquivo foi baixado.</li>
      <li>Rode o comando abaixo e jogue!</li>
    </ol>
    <pre class="cod">python meu_jokenpo.py</pre>
    <p>No celular, cole o código num app como o <b>Pydroid 3</b> (Android) ou no site <code>online-python.com</code>.</p>
  </div>`
  return `<div class="caixa-fim">
    <h3>Jogue o seu jogo no terminal</h3>
    <p>${arquivo ? `Seu código foi salvo em <code>${esc(arquivo)}</code>.` : 'Quando você passa no projeto final, seu código é salvo em <code>jokenpo/meu_jokenpo.py</code>.'} Abra um terminal e rode:</p>
    <pre class="cod">cd jokenpo
python meu_jokenpo.py</pre>
    <p>A versão de referência está em <code>jokenpo/jokenpo.py</code>. Compare as duas.</p>
  </div>`
}

function renderFim() {
  app.innerHTML = `${topo()}
  <main class="resultado">
    <div class="resultado-topo">
      <div class="trofeu">${trio('feliz', 84)}</div>
      <span class="kicker">Projeto concluído</span>
      <h1>O seu Jokenpô está pronto</h1>
      <p>Tudo isso você já usa em Python:</p>
    </div>
    <div class="aprendeu">${LICOES.map(l => `<span>${l.icone} ${esc(l.aprende)}</span>`).join('')}</div>
    ${htmlJogar(null)}
    <div class="caixa-fim">
      <h3>Próximos passos</h3>
      <ol>
        <li>Faça os <b>Desafios bônus</b>: emojis, lagarto e Spock e melhor de 3.</li>
        <li>Use a <b>Revisão</b> de vez em quando: ela repete o que você mais errou.</li>
        <li>Invente uma regra sua (ex.: guardar o histórico das jogadas numa lista) e teste no seu computador.</li>
      </ol>
    </div>
    <button class="btn largo" id="voltar">Voltar ao início</button>
  </main>`
  ligarSom()
  $('#voltar').onclick = renderHome
  const bx = $('#baixar'); if (bx) bx.onclick = baixarJogo
}

function confete() {
  const emojis = ['✊', '✋', '✌️', '⭐', '🐍']
  return `<div class="confete" aria-hidden="true">${Array.from({ length: 28 }, () =>
    `<span style="left:${Math.random() * 100}%;animation-delay:${(Math.random() * 0.8).toFixed(2)}s">${emojis[Math.floor(Math.random() * emojis.length)]}</span>`).join('')}</div>`
}

// ---------- teclado ----------
document.addEventListener('keydown', e => {
  if ($('.modal-fundo')) return
  if (!L) { if (e.key === 'Escape') fecharCartao(); return }
  const t = e.target, btn = $('#principal')
  if (e.key === 'Enter') {
    if (t.tagName === 'BUTTON') return
    if (t.tagName === 'TEXTAREA') {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      if (t.id === 'ex-editor') $('#ex-rodar')?.click()        // no ensino, Ctrl+Enter roda o exemplo
      else if (btn && !btn.disabled) btn.click()
      return
    }
    if (btn && !btn.disabled) { e.preventDefault(); btn.click() }
  } else if (/^[1-4]$/.test(e.key) && L.estado === 'responder' && L.fila[0]?.tipo === 'escolha') {
    const op = $$('.opcao')[+e.key - 1]; if (op) op.click()
  }
})

// ---------- início ----------
async function iniciarApp() {
  renderHome()
  try {
    const d = await (await fetch('/ia/status')).json()
    IA_ATIVA = !!d.ativa; marcarServidor(true)
  } catch { marcarServidor(false) }
  if (await sincronizar() && !L) renderHome()
}
iniciarApp()
