'use strict'
// Jokenpy: a lógica da tela. O conteúdo da trilha de Python está em licoes.js; outras trilhas carregam de /trilhas/<id>.js.

// ---------- utilidades ----------
const $ = s => document.querySelector(s)
const $$ = s => [...document.querySelectorAll(s)]
const app = $('#app')
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
// texto de opção: escapa tudo, mas deixa <code>, <b> e <i> funcionarem (o conteúdo usa nas alternativas)
const escOpcao = s => esc(s).replace(/&lt;(\/?)(code|b|i|em)&gt;/g, '<$1$2>')
const embaralhar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const norm = s => s.replace(/'/g, '"').replace(/\s+/g, '')
const textoDe = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent }
const semLacunas = c => (c || '').replace(/\[\[\d+\]\]/g, '____')
// compara a saída sem ligar para maiúsculas/minúsculas, acentos, pontuação e espaços extras:
// "você jogou  Pedra!" = "Você jogou pedra" e "aceita:pedra" = "Aceita, pedra" = "aceita pedra"
const padrao = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[!?.¡¿]/g, '')
  .replace(/[,:;]/g, ' ').replace(/\s+/g, ' ')
// a linha da saída mais parecida com o texto esperado, para mostrar a diferença ao aluno
function linhaParecida(saida, espera) {
  const alvo = new Set(padrao(espera).split(/[\s:]+/).filter(Boolean))
  let melhor = '', nota = 0
  for (const linha of (saida || '').split('\n')) {
    const n = padrao(linha).split(/[\s:]+/).filter(p => alvo.has(p)).length
    if (n > nota) { nota = n; melhor = linha.trim() }
  }
  return nota ? melhor : ''
}
// texto proibido dentro do texto esperado só conta fora dele: "Não foi empate!" contém "empate!",
// mas não é um "Empate!". Se o proibido não cabe no esperado, procura na saída inteira.
const temProibido = (saida, espera, proibido) => {
  const e = padrao(espera || '')
  return (proibido || []).find(p => {
    const q = padrao(p)
    return (e && e.includes(q) ? saida.split(e).join(' | ') : saida).includes(q)
  })
}
const HEADERS = { 'Content-Type': 'application/json', 'X-Jokenpy': '1' }
// rodando no seu computador (localhost) ou hospedado na internet para qualquer pessoa
const LOCAL = ['localhost', '127.0.0.1', ''].includes(location.hostname)
const TOQUE = matchMedia('(pointer: coarse)').matches   // celular/tablet: sem tecla Tab

// ---------- trilhas ----------
// A trilha de Python (licoes.js) é pública. Outras trilhas ficam em /trilhas/<id>.js no servidor;
// a privada só é entregue com senha (verificada no servidor) e não vai para o repositório.
const CURSO_PYTHON = {
  id: 'python', marca: 'joken<b>py</b>', kicker: 'Curso prático de Python',
  titulo: 'Aprenda Python construindo um <em>Jokenpô</em> de verdade.',
  subtitulo: 'Cada lição explica um conceito, você pratica com exercícios corrigidos na hora e o arquivo ao lado ganha mais uma parte do jogo.',
  rotulo: 'Lição', rotulos: 'lições', painel: 'jogo', chave: 'jokenpy-progresso',
  passos: ['<b>Entenda</b> o conceito com exemplos que você mesmo roda.', '<b>Pratique</b> com exercícios corrigidos na hora e dicas passo a passo.', '<b>Construa</b>: cada lição escreve uma parte do <code>jokenpo.py</code>.'],
  partes: [
    { titulo: 'Conversar com quem joga', tipo: 'pedra', ids: ['print', 'input'] },
    { titulo: 'Decidir quem vence', tipo: 'papel', ids: ['random', 'if', 'dict', 'funcao'] },
    { titulo: 'O jogo completo', tipo: 'tesoura', ids: ['while', 'for', 'final', 'desafios'] },
  ],
}
// Catálogo: aparece no início mesmo antes de a trilha ser baixada. As públicas vêm de /cursos/<id>.js
// (geradas de conteudo/<id>/); a lista de quais existem neste servidor está em /cursos/indice.json.
const TRILHAS = [
  { id: 'python', titulo: 'Python', sub: 'Aprenda construindo um Jokenpô', icone: '🐍', cor: '#5B5BF0', nivel: 'Do zero', publica: true },
  { id: 'java-spring', titulo: 'Java + Spring Boot', sub: 'APIs Java para quem já sabe NestJS', icone: '☕', cor: '#E8590C', nivel: 'Intermediário', arquivo: '/cursos/java-spring.js' },
  { id: 'react', titulo: 'React', sub: 'Componentes, estado e dados de uma API', icone: '⚛️', cor: '#0891B2', nivel: 'Intermediário', arquivo: '/cursos/react.js' },
  { id: 'django', titulo: 'Django', sub: 'Back-end e API em Python', icone: '🌿', cor: '#0E9F6E', nivel: 'Depois do Python', arquivo: '/cursos/django.js' },
  { id: 'sql', titulo: 'SQL', sub: 'Consultas de verdade no PostgreSQL', icone: '🗄️', cor: '#C026D3', nivel: 'Todos os níveis', arquivo: '/cursos/sql.js' },
]
let INDICE = {}   // /cursos/indice.json: { id: { modulos: [...], exercicios } }
const trilhaDe = id => TRILHAS.find(t => t.id === id)
const disponivel = t => t.id === 'python' || t.privada || !!INDICE[t.id]
globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}
let CURSO = CURSO_PYTHON
let LISTA = LICOES

let L = null              // estado da lição aberta (null = tela inicial)
let IA_ATIVA = false

// cada exercício ganha um id estável ("print-0", "print-1"...) para salvar progresso e rascunhos
const prepararIds = lista => lista.forEach(l => l.exercicios.forEach((it, k) => { it.id = `${l.id}-${k}`; it.k = k }))
prepararIds(LISTA)

// ---------- realce de sintaxe Python (só para mostrar) ----------
const RE_PY = /(#[^\n]*|\/\/[^\n]*|--[^\n]*)|(f?"(?:[^"\\\n]|\\.)*"|f?'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(@[A-Za-z][\w.]*)|\b(def|return|if|elif|else|while|for|in|of|not|and|or|import|from|export|default|break|continue|pass|True|False|None|true|false|null|undefined|const|let|var|function|async|await|class|interface|type|extends|implements|new|this|try|catch|except|finally|raise|throw|with|as|lambda|yield|public|private|protected|static|final|void|package|record|throws|super|switch|case|default|readonly|enum|query|mutation|subscription|SELECT|FROM|WHERE|JOIN|LEFT|INNER|ON|GROUP|BY|ORDER|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|PRIMARY|KEY|REFERENCES|FOREIGN|AND|OR|NOT|NULL|LIMIT|BEGIN|COMMIT|ROLLBACK)\b|\b(\d+)\b|\b(print|input|int|str|len|range|useState|useEffect|useMemo|useCallback|useContext|fetch|console\.log)\b(?=\()/g
function realcar(txt) {
  let out = '', ultimo = 0, m
  RE_PY.lastIndex = 0
  while ((m = RE_PY.exec(txt))) {
    out += esc(txt.slice(ultimo, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'a' : m[4] ? 'k' : m[5] ? 'n' : 'f'
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
  [/Tempo esgotado/, () => 'O programa passou de 3 segundos. Ou há um laço que nunca termina (confira o <code>break</code> e a condição do <code>while</code>), ou a solução é lenta demais para a entrada do teste: dois laços aninhados sobre uma lista grande são O(n²). Pense em dicionário ou conjunto para chegar a O(n).'],
  [/Teste: não encontrei '(\w+)'/, m => `O teste procura algo chamado <code>${m[1]}</code>. Use exatamente esse nome no seu código.`],
]
function entenderErro(erro) {
  for (const [re, f] of ERROS) { const m = (erro || '').match(re); if (m) return f(m) }
  return ''
}
const htmlEntender = erro => { const e = entenderErro(erro); return e ? `<div class="entender"><b>🔎 O que isso quer dizer</b>${e}</div>` : '' }

// ---------- progresso ----------
// Fica salvo no navegador (localStorage), um registro por trilha. A trilha de Python também guarda uma cópia no servidor local.
// Assim você não perde nada se fechar a aba, trocar de navegador ou limpar os dados do site.
let CHAVE = CURSO.chave
const novoProgresso = () => ({
  xp: 0, xpHoje: { dia: null, xp: 0 }, estrelas: {},
  feitas: {}, sequencia: 0, ultimoDia: null, som: true,
  emAndamento: null,   // lição aberta: onde parou e quantos erros
  rascunhos: {},       // código que você estava escrevendo, por exercício
  atualizado: 0,
})
let prog = carregarLocal()
if (!prog.atualizado && (prog.xp || Object.keys(prog.feitas).length)) prog.atualizado = 1  // progresso antigo
migrarProgresso()

// ---------- hábito: ofensiva, meta do dia e protetor valem para todas as trilhas ----------
// Meta pequena por padrão (1 lição): metas intensas fazem a pessoa perder a ofensiva mais vezes.
// O protetor cobre um dia perdido: um pouco de folga motiva mais do que uma regra rígida.
const CHAVE_HAB = 'jokenpy-habito'
const METAS = [{ xp: 10, nome: 'Leve', desc: '1 lição · ~5 min' }, { xp: 20, nome: 'Firme', desc: '2 lições · ~10 min' }, { xp: 40, nome: 'Intensa', desc: '4 lições · ~20 min' }]
function carregarHabito() {
  let h = null
  try { h = JSON.parse(localStorage.getItem(CHAVE_HAB)) } catch {}
  if (h) return { protetores: 1, dias: {}, meta: 10, som: true, tema: 'auto', ...h }
  // primeira vez com a versão nova: herda ofensiva e XP da trilha de Python
  let py = {}
  try { py = JSON.parse(localStorage.getItem('jokenpy-progresso')) || {} } catch {}
  return { xp: py.xp || 0, sequencia: py.sequencia || 0, ultimoDia: py.ultimoDia || null, xpHoje: py.xpHoje || { dia: null, xp: 0 },
    meta: 10, protetores: 1, protegidos: [], dias: {}, som: py.som !== false, tema: 'auto', lembrete: null }
}
let HAB = carregarHabito()
function salvarHabito() { try { localStorage.setItem(CHAVE_HAB, JSON.stringify(HAB)) } catch {} avisarEstado() }

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
  const i = LISTA.findIndex(l => l.id === a.id)
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
  if (CURSO.id !== 'python') return
  fetch('/progresso', { method: 'PUT', headers: HEADERS, body: JSON.stringify(prog), keepalive: true })
    .then(r => marcarServidor(r.ok)).catch(() => marcarServidor(false))
}
async function sincronizar() {
  if (CURSO.id !== 'python') return false
  try {
    const remoto = await (await fetch('/progresso')).json()
    if ((remoto.atualizado || 0) > (prog.atualizado || 0)) { prog = { ...novoProgresso(), ...remoto }; migrarProgresso(); gravarLocal(); return true }
    if ((prog.atualizado || 0) > (remoto.atualizado || 0)) enviarProgresso()
  } catch {}
  return false
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && envioPendente) enviarProgresso() })

const dia = d => { const x = new Date(); x.setDate(x.getDate() + d); return x.toLocaleDateString('sv') }
const sequencia = () => HAB.ultimoDia === dia(0) || HAB.ultimoDia === dia(-1) ? HAB.sequencia || 0 : 0
const estudouHoje = () => HAB.ultimoDia === dia(0)
function marcarDia() {
  if (HAB.ultimoDia === dia(0)) return
  HAB.sequencia = HAB.ultimoDia === dia(-1) ? (HAB.sequencia || 0) + 1 : 1
  HAB.ultimoDia = dia(0)
  // a cada 7 dias seguidos ganha um protetor (guarda no máximo 2)
  if (HAB.sequencia % 7 === 0 && (HAB.protetores || 0) < 2) { HAB.protetores = (HAB.protetores || 0) + 1; HAB.ganhouProtetor = true }
}
// Ao abrir o app: se faltou um dia (ou dois) e há protetor, ele cobre a falta e a ofensiva continua.
function aplicarProtetor() {
  if (!HAB.ultimoDia || !HAB.sequencia || HAB.ultimoDia >= dia(-1)) return null
  const perdidos = Math.round((new Date(dia(-1)) - new Date(HAB.ultimoDia)) / 864e5)
  if (perdidos < 1 || perdidos > (HAB.protetores || 0)) return null
  HAB.protetores -= perdidos
  for (let k = perdidos; k >= 1; k--) (HAB.protegidos ||= []).push(dia(-k))
  HAB.protegidos = HAB.protegidos.slice(-20)
  HAB.ultimoDia = dia(-1)
  salvarHabito()
  return perdidos
}
const xpDeHoje = () => HAB.xpHoje?.dia === dia(0) ? HAB.xpHoje.xp : 0
const metaDiaria = () => HAB.meta || 10
function ganharXP(n) {
  if (HAB.xpHoje?.dia !== dia(0)) HAB.xpHoje = { dia: dia(0), xp: 0 }
  HAB.xpHoje.xp += n
  HAB.xp = (HAB.xp || 0) + n
  HAB.dias = HAB.dias || {}
  HAB.dias[dia(0)] = (HAB.dias[dia(0)] || 0) + n
  const antigos = Object.keys(HAB.dias).sort().slice(0, -140)   // guarda ~20 semanas
  antigos.forEach(d => delete HAB.dias[d])
  prog.xp = (prog.xp || 0) + n
}
// 3 estrelas sem erro, 2 com até 2 erros, 1 para quem concluiu
const estrelasPor = erros => erros === 0 ? 3 : erros <= 2 ? 2 : 1
const htmlEstrelas = n => `<span class="estrelas" aria-label="${n} de 3 estrelas">${[1, 2, 3].map(k => `<i class="${k <= n ? 'acesa' : ''}">★</i>`).join('')}</span>`
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
  if (HAB.som === false) return
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
// vibração curta só nos momentos que importam (acerto, erro, fim): se tudo vibra, nada significa
const vibrar = p => { if (HAB.vibrar !== false) try { navigator.vibrate?.(p) } catch {} }
const somCerto = () => tocar([660, 990])
const somErro = () => tocar([240, 180], 0.16, 'triangle')
const somFim = () => tocar([523, 659, 784, 1047], 0.12)

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg
  document.body.append(t); setTimeout(() => t.remove(), 2400)
}

// ---------- personagens: Pedra, Papel e Tesoura ----------
// Rabiscos de tinta, como os desenhos na margem de um caderno: contorno grosso, cor chapada e
// sombra dura. Cada um dá a cor de uma parte do curso e reage às respostas.
const TIPOS_P = ['pedra', 'papel', 'tesoura']
const NOMES_P = { pedra: 'Pedra', papel: 'Papel', tesoura: 'Tesoura' }
// a lição usa a cor do personagem da parte do curso em que ela está
const tipoDaLicao = i => CURSO.partes.find(a => a.ids.includes(LISTA[i]?.id))?.tipo || TIPOS_P[((i % 3) + 3) % 3]
const TINTA = '#1E1B2E'
function rosto(cx, cy, humor, d = 10) {
  const olho = x => humor === 'feliz'
    ? `<path d="M${x - 4} ${cy + 1} Q${x} ${cy - 5} ${x + 4} ${cy + 1}" stroke="${TINTA}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
    : `<rect x="${x - 2.6}" y="${cy - 4.5}" width="5.2" height="9" rx="2.6" fill="${TINTA}"/>`
  const boca = humor === 'feliz' ? `<path d="M${cx - 8} ${cy + 9} Q${cx} ${cy + 17} ${cx + 8} ${cy + 9}" stroke="${TINTA}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
    : humor === 'pensando' ? `<path d="M${cx - 8} ${cy + 13} q4 -4 8 0 t8 0" stroke="${TINTA}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
    : `<path d="M${cx - 6} ${cy + 12} H${cx + 6}" stroke="${TINTA}" stroke-width="3.4" stroke-linecap="round"/>`
  const sobr = humor === 'pensando' ? `<path d="M${cx - d - 5} ${cy - 10} L${cx - d + 4} ${cy - 7}" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/><path d="M${cx + d - 4} ${cy - 7} L${cx + d + 5} ${cy - 10}" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/>` : ''
  return `${olho(cx - d)}${olho(cx + d)}${sobr}${boca}`
}
function personagem(tipo, humor = 'normal', tam = 64, classe = '') {
  const formas = {
    pedra: `<path d="M48 14C70 10 88 26 87 50C86 74 70 88 47 86C25 85 11 70 13 48C15 27 29 17 48 14Z"/>`,
    papel: `<path d="M22 11H63L81 29V84C81 87 79 89 76 89H22C19 89 17 87 17 84V16C17 13 19 11 22 11Z"/>`,
    tesoura: `<path d="M27 44H73L61 86C59 90 55 92 50 92C45 92 41 90 39 86Z"/>`,
  }
  const cor = { pedra: '#FF6B5B', papel: '#4A9DFF', tesoura: '#1FC58F' }[tipo]
  const sombra = `<g transform="translate(0 5)" fill="${TINTA}">${formas[tipo]}</g>`
  const extras = {
    pedra: `<path d="M30 30C35 25 41 23 47 23" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>`,
    papel: `<path d="M63 11V25C63 27 65 29 67 29H81" fill="#C4E3FF" stroke="${TINTA}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M29 72H58M29 79H47" stroke="${TINTA}" stroke-width="3" stroke-linecap="round" opacity=".35"/>`,
    tesoura: '',
  }[tipo]
  const alcas = tipo === 'tesoura'
    ? `<g fill="none" stroke-linecap="round"><circle cx="34" cy="26" r="13" stroke="${TINTA}" stroke-width="12" transform="translate(0 5)"/><circle cx="66" cy="26" r="13" stroke="${TINTA}" stroke-width="12" transform="translate(0 5)"/>
        <circle cx="34" cy="26" r="13" stroke="${TINTA}" stroke-width="12"/><circle cx="66" cy="26" r="13" stroke="${TINTA}" stroke-width="12"/>
        <circle cx="34" cy="26" r="13" stroke="${cor}" stroke-width="5.5"/><circle cx="66" cy="26" r="13" stroke="${cor}" stroke-width="5.5"/></g>` : ''
  const face = { pedra: [50, 50], papel: [49, 47], tesoura: [50, 61, 9] }[tipo]
  return `<svg class="pers pers-${tipo} ${classe}" viewBox="0 0 100 100" width="${tam}" height="${tam}" role="img" aria-label="${NOMES_P[tipo]}">
    ${alcas}${sombra}<g fill="${cor}" stroke="${TINTA}" stroke-width="3.5" stroke-linejoin="round">${formas[tipo]}</g>${extras}${rosto(face[0], face[1], humor, face[2])}</svg>`
}
const trio = (humor = 'feliz', tam = 56) => TIPOS_P.map(t => personagem(t, humor, tam)).join('')

// ---------- ícones (traço fino, herdam a cor do texto) ----------
const svg = (d, extra = '') => `<svg class="ic" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`
const ICONE = {
  casa: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>'),
  mapa: svg('<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>'),
  pessoa: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  fogo: svg('<path d="M12 2.5c.8 3.6 4.8 5.6 4.8 10.6a4.8 4.8 0 0 1-9.6 0c0-2.2 1-3.8 2.2-4.9.3 2 1.3 3.1 2.6 3.3-.8-3-.4-6.1 0-9Z" fill="currentColor" stroke="none"/>'),
  raio: svg('<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none"/>'),
  escudo: svg('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.9 7.5 9.5 4.3-1.6 7.5-4.9 7.5-9.5V6z"/>'),
  sino: svg('<path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15.5 6 9"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  relogio: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>'),
  seta: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  voltar: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
  revisar: svg('<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5.5 10A8 8 0 0 1 19 7.5M18.5 14A8 8 0 0 1 5 16.5"/>'),
  baixar: svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  celular: svg('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  alvo: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
}

// ---------- trilhas: troca, download e progresso de cada uma ----------
const DEFAULTS_TRILHA = { rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga' }
const chaveDe = id => id === 'python' ? CURSO_PYTHON.chave : `jokenpy-trilha-${id}`
function lerProgresso(id) {
  if (id === CURSO.id) return prog
  try { return { ...novoProgresso(), ...JSON.parse(localStorage.getItem(chaveDe(id))) } } catch { return novoProgresso() }
}
// ids dos módulos na ordem, sem precisar baixar a trilha (o índice do servidor já diz)
const modulosDe = id => id === 'python' ? LICOES.map(l => l.id)
  : TRILHAS_CARREGADAS[id]?.LICOES.map(l => l.id) || INDICE[id]?.modulos || []
function resumoTrilha(id) {
  const ids = modulosDe(id), p = lerProgresso(id)
  const feitos = ids.filter(m => p.feitas[m]).length
  return { total: ids.length, feitos, pct: ids.length ? Math.round(100 * feitos / ids.length) : 0, mexeu: feitos > 0 || !!p.emAndamento }
}
function aplicarCor(t) { document.documentElement.style.setProperty('--acao', t?.cor || '#5B5BF0') }

async function abrirTrilha(id, tela = 'trilha') {
  const t = trilhaDe(id)
  if (!t) return
  if (id !== 'python' && !TRILHAS_CARREGADAS[id]) {
    if (t.privada) return pedirSenha(t, tela)
    try { await carregarPublica(t) } catch (e) { toast(e.message); return }
  }
  ativarTrilha(id)
  irPara(tela)
}
function ativarTrilha(id) {
  if (id === 'python') { CURSO = CURSO_PYTHON; LISTA = LICOES }
  else {
    const dados = TRILHAS_CARREGADAS[id]
    CURSO = { ...DEFAULTS_TRILHA, marca: CURSO_PYTHON.marca, ...dados.CURSO, id, chave: chaveDe(id) }
    LISTA = dados.LICOES
    if (!LISTA[0]?.exercicios[0]?.id) prepararIds(LISTA)
  }
  CHAVE = CURSO.chave
  prog = carregarLocal(); migrarProgresso()
  aplicarCor(trilhaDe(id))
  try { localStorage.setItem('jokenpy-trilha', id) } catch {}
}
async function carregarPublica(t) {
  let res
  try { res = await fetch(`${t.arquivo}?v=${INDICE[t.id]?.versao || ''}`) } catch { res = null }
  if (!res?.ok) throw new Error('Não consegui baixar esta trilha. Confira a internet e tente de novo.')
  new Function(await res.text())()   // o arquivo registra a trilha em TRILHAS_CARREGADAS
  if (!TRILHAS_CARREGADAS[t.id]) throw new Error('O arquivo da trilha veio incompleto.')
}

// trilha privada: o servidor só entrega o arquivo com a senha certa
async function carregarTrilha(t, senha) {
  const res = await fetch(t.arquivo, { headers: { Authorization: 'Basic ' + btoa('aluno:' + senha) }, cache: 'no-store' })
  if (res.status === 401) throw new Error('Senha incorreta.')
  if (!res.ok) throw new Error('Esta trilha não está disponível neste servidor.')
  new Function(await res.text())()
  if (!TRILHAS_CARREGADAS[t.id]) throw new Error('O arquivo da trilha veio incompleto.')
  try { localStorage.setItem(`jokenpy-senha-${t.id}`, senha) } catch {}
}
function pedirSenha(t, tela = 'trilha') {
  if ($('.modal-fundo')) return
  const m = document.createElement('div'); m.className = 'modal-fundo'
  m.innerHTML = `<form class="modal senha" role="dialog" aria-modal="true" aria-label="Senha da trilha">
    <button type="button" class="modal-fechar" aria-label="Fechar">✕</button>
    <span class="kicker">Trilha privada</span><h3>${t.icone} ${esc(t.titulo)}</h3>
    <p>Esta trilha tem conteúdo pessoal. Digite a senha para abrir.</p>
    <input type="password" id="senha-trilha" autocomplete="current-password" aria-label="Senha" required>
    <p class="senha-erro" id="senha-erro" hidden></p>
    <button class="btn largo" id="senha-ok">Abrir trilha</button></form>`
  document.body.append(m)
  const fechar = () => m.remove()
  m.onclick = e => { if (e.target === m || e.target.closest('.modal-fechar')) fechar() }
  m.querySelector('form').onsubmit = async e => {
    e.preventDefault()
    const b = $('#senha-ok'); b.disabled = true; b.textContent = 'Abrindo…'
    try { await carregarTrilha(t, $('#senha-trilha').value); fechar(); abrirTrilha(t.id, tela) }
    catch (err) { const x = $('#senha-erro'); x.hidden = false; x.textContent = err.message; b.disabled = false; b.textContent = 'Abrir trilha' }
  }
  $('#senha-trilha').focus()
}

// ---------- casca do app: topo, abas e navegação ----------
let TELA = 'hoje'
function irPara(tela) { TELA = tela; renderHome(); scrollTo(0, 0) }
function renderHome() {
  L = null
  fecharCartao()
  aplicarCor(trilhaDe(CURSO.id))
  if (TELA === 'trilhas') renderTrilhas()
  else if (TELA === 'perfil') renderPerfil()
  else if (TELA === 'trilha') renderTrilha()
  else renderHoje()
  ligarCasca()
}
function topo() {
  const seq = sequencia()
  return `<header class="topo"><div class="topo-in">
    <button class="marca" data-ir="hoje" aria-label="Jokenpy: ir para Hoje"><span class="marca-trio" aria-hidden="true">${trio('normal', 24)}</span><span class="marca-nome">joken<b>py</b></span></button>
    ${abas('topo')}
    <div class="stats">
      <span class="stat fogo ${estudouHoje() ? 'aceso' : seq ? 'risco' : ''}" title="${seq} ${seq === 1 ? 'dia seguido' : 'dias seguidos'}${seq && !estudouHoje() ? ': estude hoje para manter' : ''}">${ICONE.fogo}<b>${seq}</b></span>
      <span class="stat raio" title="XP total">${ICONE.raio}<b>${HAB.xp || 0}</b></span>
    </div></div></header>`
}
const ABAS = [['hoje', 'Hoje', 'casa'], ['trilhas', 'Trilhas', 'mapa'], ['perfil', 'Você', 'pessoa']]
function abas(onde) {
  const atual = TELA === 'trilha' ? 'trilhas' : TELA
  return `<nav class="abas abas-${onde}" aria-label="Navegação principal">${ABAS.map(([id, nome, ic]) =>
    `<button class="aba ${atual === id ? 'ativa' : ''}" data-ir="${id}" ${atual === id ? 'aria-current="page"' : ''}>${ICONE[ic]}<span>${nome}</span></button>`).join('')}</nav>`
}
const casca = (classe, html) => `${topo()}<main class="tela ${classe}">${html}</main>${abas('baixo')}`
function ligarCasca() {
  $$('[data-ir]').forEach(b => b.onclick = () => { const t = b.dataset.ir; t === TELA ? scrollTo({ top: 0, behavior: 'smooth' }) : irPara(t) })
  $$('[data-trilha]').forEach(b => b.onclick = () => abrirTrilha(b.dataset.trilha))
}

// a próxima lição da trilha atual: a que está em andamento ou a primeira não concluída
function proximaLicao() {
  const iAnd = indiceAndamento()
  if (iAnd >= 0) return { i: iAnd, andamento: true }
  let i = LISTA.findIndex(l => !prog.feitas[l.id] && !l.bonus)
  if (i < 0) i = LISTA.findIndex(l => !prog.feitas[l.id])
  return i >= 0 ? { i, andamento: false } : null
}
const minutos = l => Math.max(3, Math.round((l.ensino?.length || 0) * 1 + l.exercicios.length * 0.8))
function saudacao() {
  const h = new Date().getHours()
  const data = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return `${h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'} · ${data}`
}
// dias da ofensiva atual, mesmo os de antes do registro diário existir
function estudouNoDia(d) {
  if ((HAB.dias?.[d] || 0) > 0) return true
  const seq = sequencia()
  if (!seq || !HAB.ultimoDia || d > HAB.ultimoDia || HAB.protegidos?.includes(d)) return false
  const ini = new Date(HAB.ultimoDia); ini.setDate(ini.getDate() - (seq - 1))
  return d >= ini.toLocaleDateString('sv')
}
function semana() {
  const letras = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  return `<ol class="semana" aria-label="Últimos 7 dias">${[-6, -5, -4, -3, -2, -1, 0].map(k => {
    const x = new Date(); x.setDate(x.getDate() + k)
    const d = x.toLocaleDateString('sv'), fez = estudouNoDia(d), prot = HAB.protegidos?.includes(d)
    const nome = x.toLocaleDateString('pt-BR', { weekday: 'long' })
    return `<li class="${fez ? 'fez' : prot ? 'prot' : ''} ${k === 0 ? 'hoje' : ''}" aria-label="${nome}: ${fez ? 'estudou' : prot ? 'protegido' : k === 0 ? 'ainda não' : 'não estudou'}">
      <span>${letras[x.getDay()]}</span><i>${fez ? ICONE.check : prot ? ICONE.escudo : ''}</i></li>`
  }).join('')}</ol>`
}
const contarFracos = () => LISTA.filter(l => prog.feitas[l.id]).flatMap(l => l.exercicios).filter(it => (prog.fracos || {})[it.id]).length

// ---------- tela Hoje: uma coisa para fazer agora, e o seu dia ----------
function anelSvg(pct, tam, traco, classe = '') {
  const r = (tam - traco) / 2, c = 2 * Math.PI * r
  return `<svg class="anel-svg ${classe}" viewBox="0 0 ${tam} ${tam}" width="${tam}" height="${tam}" aria-hidden="true">
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke-width="${traco}" class="anel-fundo"/>
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke-width="${traco}" class="anel-cheio" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${c}" style="--alvo:${c * (1 - Math.min(100, pct) / 100)}" transform="rotate(-90 ${tam / 2} ${tam / 2})"/></svg>`
}
function renderHoje() {
  const t = trilhaDe(CURSO.id), alvo = proximaLicao()
  const seq = sequencia(), hoje = xpDeHoje(), meta = metaDiaria(), pct = Math.min(100, Math.round(100 * hoje / meta)), bateu = hoje >= meta
  const r = resumoTrilha(CURSO.id)
  const feitas = LISTA.filter(l => prog.feitas[l.id]).length, nDevidos = devidos().length
  const outras = TRILHAS.filter(x => x.id !== CURSO.id && disponivel(x) && resumoTrilha(x.id).mexeu)
  const java = trilhaDe('java-spring')
  const sugerirJava = CURSO.id !== 'java-spring' && disponivel(java) && !resumoTrilha('java-spring').mexeu
  const frase = bateu ? 'Meta de hoje batida. 🎉'
    : estudouHoje() ? `Faltam ${meta - hoje} XP para a meta.`
    : seq ? `${seq} ${seq === 1 ? 'dia' : 'dias'} seguidos. Não quebre hoje.`
    : 'Cinco minutos já contam.'
  app.innerHTML = casca('hoje', `
    <section class="saudacao">
      <span class="kicker">${saudacao()}</span>
      <h1>${frase}</h1>
    </section>
    ${alvo ? htmlFoco(t, alvo, r) : `<section class="foco"><span class="foco-trilha">${t.icone} ${esc(t.titulo)}</span>
      <h2>Trilha concluída 🏆</h2><p>Revise de vez em quando para não esquecer, ou comece outra trilha.</p>
      <button class="btn largo" data-ir="trilhas">Escolher outra trilha ${ICONE.seta}</button></section>`}
    <section class="dia ${bateu ? 'bateu' : ''}">
      <div class="dia-meta" role="img" aria-label="Meta do dia: ${Math.min(hoje, meta)} de ${meta} XP">${anelSvg(pct, 64, 7, 'sol')}<span><b>${Math.min(hoje, meta)}</b><small>/${meta}</small></span></div>
      <div class="dia-semana">
        <div class="dia-linha"><b class="fogo-txt ${estudouHoje() ? 'aceso' : ''}">${ICONE.fogo}${seq} ${seq === 1 ? 'dia' : 'dias'}</b>
          <span class="protetor" title="Protetores: cada um cobre um dia sem estudo. Ganhe um a cada 7 dias seguidos.">${ICONE.escudo}${HAB.protetores || 0}</span></div>
        ${semana()}
      </div>
    </section>
    <div class="linhas">
      ${feitas ? `<button class="linha" id="revisar">
        <span class="li-ico azul">${ICONE.revisar}</span>
        <span class="li-txt"><b>${nDevidos ? 'Revisão do dia' : 'Treino extra'}</b><small>${nDevidos ? `${Math.min(nDevidos, 8)} ${nDevidos === 1 ? 'pergunta pronta' : 'perguntas prontas'} para lembrar · ~2 min` : 'Nada vencendo hoje. Treine o que você mais errou.'}</small></span>
        ${nDevidos ? `<span class="selo">${Math.min(nDevidos, 8)}</span>` : ICONE.seta}</button>` : ''}
      ${htmlConviteLembrete()}
      ${sugerirJava ? `<button class="linha" data-trilha="java-spring">
        <span class="li-ico" style="background:color-mix(in srgb,${java.cor} 14%,var(--card))">${java.icone}</span>
        <span class="li-txt"><b>${java.titulo}</b><small>Nova trilha: cada conceito comparado com o NestJS</small></span>${ICONE.seta}</button>` : ''}
      ${htmlConviteInstalar()}
    </div>
    ${outras.length ? `<section class="bloco"><h3 class="titulo-bloco">Outras trilhas</h3><div class="mini-trilhas">${outras.map(x => {
      const rx = resumoTrilha(x.id)
      return `<button class="mini-trilha" data-trilha="${x.id}" style="--cor-t:${x.cor}"><span class="mt-ico">${x.icone}</span><span class="mt-txt"><b>${esc(x.titulo)}</b>
        <span class="barra-fina"><i style="width:${rx.pct}%"></i></span></span><small>${rx.pct}%</small></button>`
    }).join('')}</div></section>` : ''}
  `)
  const sg = $('#seguir'); if (sg) sg.onclick = () => alvo.andamento ? retomar() : iniciar(alvo.i)
  const rv = $('#revisar'); if (rv) rv.onclick = iniciarRevisao
  ligarConvites()
  atualizarSelo(nDevidos)
}
// número no ícone do app instalado: quantas revisões estão esperando
function atualizarSelo(n) { try { n ? navigator.setAppBadge?.(n).catch(() => {}) : navigator.clearAppBadge?.().catch(() => {}) } catch {} }

function htmlFoco(t, alvo, r) {
  const l = LISTA[alvo.i], a = prog.emAndamento
  return `<section class="foco" style="--cor-t:${t.cor}">
    <div class="foco-topo"><button class="foco-trilha" data-ir="trilha">${t.icone} ${esc(t.titulo)}</button><span class="foco-tempo">${ICONE.relogio}${minutos(l)} min</span></div>
    <div class="foco-meio">
      <div class="foco-anel">${anelSvg(r.pct, 92, 6, 'trilha')}<span class="foco-ico">${l.icone}</span></div>
      <div class="foco-txt">
        <small>${alvo.andamento ? `Parou em ${a.feitos} de ${l.exercicios.length}` : `${CURSO.rotulo} ${alvo.i + 1} de ${LISTA.length}`}</small>
        <h2>${esc(l.titulo)}</h2>
      </div>
    </div>
    <p class="foco-porque">${esc(l.porque || `Você vai ver: ${l.aprende}.`)}</p>
    ${!alvo.andamento && l.gancho ? `<p class="foco-gancho">${ICONE.raio}<span>Começa com um desafio: <b>${esc(l.gancho.titulo)}</b></span></p>` : ''}
    <button class="btn grande largo" id="seguir">${alvo.andamento ? 'Continuar' : 'Começar'} ${ICONE.seta}</button>
  </section>`
}

// ---------- tela Trilhas ----------
function renderTrilhas() {
  app.innerHTML = casca('trilhas-tela', `
    <section class="saudacao">
      <span class="kicker">Trilhas</span>
      <h1>O que você quer dominar?</h1>
    </section>
    <div class="lista-trilhas">${TRILHAS.filter(disponivel).map(t => {
      const r = resumoTrilha(t.id), atual = t.id === CURSO.id
      return `<button class="card-trilha ${atual ? 'atual' : ''}" data-trilha="${t.id}" style="--cor-t:${t.cor}">
        <span class="ct-ico" aria-hidden="true">${t.icone}</span>
        <span class="ct-txt"><b>${esc(t.titulo)}</b><span>${esc(t.sub)}</span>
          <span class="ct-prog"><span class="barra-fina"><i style="width:${r.pct}%"></i></span><small>${r.pct ? `${r.feitos}/${r.total}` : `${r.total} ${t.id === 'python' ? 'lições' : 'módulos'}`}</small></span></span>
        ${atual ? '<span class="ct-atual">Atual</span>' : ''}
      </button>`
    }).join('')}</div>
    <p class="nota centro">Cada trilha guarda o próprio progresso. A ofensiva e a meta valem para todas.</p>`)
}

// ---------- uma trilha: linha do tempo das lições ----------
function renderTrilha() {
  const t = trilhaDe(CURSO.id), alvoP = proximaLicao()
  const andamento = alvoP?.andamento ? { ...prog.emAndamento, i: alvoP.i } : null
  const alvo = alvoP ? alvoP.i : -1
  const r = resumoTrilha(CURSO.id), feitas = r.feitos
  app.innerHTML = casca('trilha-tela', `<div class="home">
    <div class="caminho-col">
      <button class="voltar-trilhas" data-ir="trilhas">${ICONE.voltar} Trilhas</button>
      <section class="trilha-cabeca" style="--cor-t:${t.cor}">
        <span class="ct-ico grande" aria-hidden="true">${t.icone}</span>
        <span class="kicker">${esc(CURSO.kicker)}</span>
        <h1>${CURSO.titulo}</h1>
        <p>${CURSO.subtitulo}</p>
        <div class="ct-prog"><span class="barra-fina"><i style="width:${r.pct}%"></i></span><small>${r.feitos} de ${r.total}</small></div>
      </section>
      ${atosDoCurso().map((ato, m) => `<section class="parte cor-${ato.tipo}">
        <div class="parte-cab">
          ${personagem(ato.tipo, ato.licoes.every(i => prog.feitas[LISTA[i].id]) ? 'feliz' : 'normal', 40)}
          <div><small>Parte ${m + 1} · ${ato.licoes.filter(i => prog.feitas[LISTA[i].id]).length}/${ato.licoes.length}</small><h2>${esc(ato.titulo)}</h2></div>
        </div>
        <ol class="linha-tempo">
          ${ato.licoes.map(i => {
            const l = LISTA[i], feita = !!prog.feitas[l.id], atual = i === alvo
            return `<li class="etapa ${feita ? 'feita' : ''} ${atual ? 'atual' : ''}">
              <button class="etapa-btn" data-i="${i}" aria-label="${esc(l.titulo)}${feita ? ' (concluída)' : ''}">
                <span class="etapa-no" aria-hidden="true">${feita ? ICONE.check : l.icone}</span>
                <span class="etapa-txt"><b>${esc(l.titulo)}</b><small>${CURSO.rotulo} ${i + 1} · ${minutos(l)} min${l.bonus ? ' · bônus' : ''}</small></span>
                ${feita ? htmlEstrelas(prog.estrelas?.[l.id] || 1) : ''}
              </button>
              ${atual ? `<div class="etapa-foco">
                <p>${esc(l.porque || `Você vai ver: ${l.aprende}.`)}</p>
                <button class="btn largo" id="seguir">${andamento ? `Continuar (${andamento.feitos}/${l.exercicios.length})` : 'Começar'} ${ICONE.seta}</button>
              </div>` : ''}
            </li>`
          }).join('')}
        </ol>
      </section>`).join('')}
      <button class="link" id="zerar">Apagar o progresso desta trilha</button>
    </div>
    <aside class="lateral">
      ${alvo < 0 ? `<section class="cartao-lado"><b>Tudo concluído! 🏆</b>
        ${CURSO.painel === 'jogo' ? '<button class="btn largo" id="ver-fim">Ver o meu jogo</button>' : '<button class="btn largo" id="revisar-fim">Treinar de novo</button>'}</section>` : ''}
      ${feitas ? `<section class="cartao-lado revisao"><div><b>Revisão</b>
        <span>${devidos().length ? `${Math.min(devidos().length, 8)} perguntas prontas para revisar.` : 'Treine o que você mais errou.'}</span></div>
        <button class="btn branco" id="revisar">${ICONE.revisar} Revisar</button></section>` : ''}
      ${htmlArquivo()}
      ${prog.feitas.final && alvo >= 0 ? '<button class="btn branco largo" id="ver-fim">🏆 Ver o meu jogo</button>' : ''}
    </aside>
  </div>`)
  $$('.etapa-btn').forEach(b => b.onclick = () => +b.dataset.i === alvo ? null : alternarCartao(+b.dataset.i, b.parentElement))
  const sg = $('#seguir'); if (sg) sg.onclick = () => andamento ? retomar() : iniciar(alvo)
  const rv = $('#revisar'); if (rv) rv.onclick = iniciarRevisao
  $('#zerar').onclick = () => {
    if (!confirm(`Apagar o progresso da trilha ${t.titulo} (lições, estrelas, rascunhos e revisão)? A ofensiva e o XP total continuam.`)) return
    prog = novoProgresso(); salvarProgresso(); renderHome()
  }
  const vf = $('#ver-fim'); if (vf) vf.onclick = renderFim
  const rf = $('#revisar-fim'); if (rf) rf.onclick = iniciarRevisao
  $('.etapa.atual')?.scrollIntoView({ block: 'center' })
}

// ---------- tela Você: constância, lembrete, meta e ajustes ----------
function renderPerfil() {
  const seq = sequencia(), recorde = Math.max(HAB.recorde || 0, seq)
  const diasEstudo = Object.values(HAB.dias || {}).filter(x => x > 0).length
  const concluidos = TRILHAS.filter(disponivel).reduce((s, t) => s + resumoTrilha(t.id).feitos, 0)
  app.innerHTML = casca('perfil', `
    <section class="saudacao"><span class="kicker">Você</span><h1>Constância é o que faz aprender.</h1></section>
    <div class="numeros">
      <div><b>${ICONE.fogo}${seq}</b><small>dias seguidos</small></div>
      <div><b>${recorde}</b><small>maior ofensiva</small></div>
      <div><b>${ICONE.raio}${HAB.xp || 0}</b><small>XP total</small></div>
      <div><b>${concluidos}</b><small>lições concluídas</small></div>
    </div>
    <section class="bloco cartao-bloco">
      <h3>Últimas 12 semanas</h3>
      ${htmlConstancia()}
      <p class="nota">${diasEstudo ? `${diasEstudo} ${diasEstudo === 1 ? 'dia' : 'dias'} com estudo registrados.` : 'Cada dia de estudo acende um quadradinho.'} ${ICONE.escudo} Você tem ${HAB.protetores || 0} ${HAB.protetores === 1 ? 'protetor' : 'protetores'}: cada um cobre um dia sem estudo. Ganhe outro a cada 7 dias seguidos (máximo 2).</p>
    </section>
    <section class="bloco cartao-bloco" id="bloco-lembrete">${htmlLembrete()}</section>
    <section class="bloco cartao-bloco">
      <h3>Meta diária</h3>
      <div class="metas" role="radiogroup" aria-label="Meta diária">${METAS.map(m => `<button class="meta-op ${metaDiaria() === m.xp ? 'sel' : ''}" role="radio" aria-checked="${metaDiaria() === m.xp}" data-meta="${m.xp}">
        <b>${m.nome}</b><span>${m.xp} XP</span><small>${m.desc}</small></button>`).join('')}</div>
      <p class="nota">Metas pequenas são mais fáceis de manter todo dia. Dá para fazer mais sempre que quiser.</p>
    </section>
    <section class="bloco cartao-bloco">
      <h3>Aparência e som</h3>
      <div class="linha-ajuste"><span>Tema</span><div class="segmento" role="radiogroup" aria-label="Tema">${[['auto', 'Automático'], ['claro', 'Claro'], ['escuro', 'Escuro']].map(([v, n]) =>
        `<button role="radio" aria-checked="${(HAB.tema || 'auto') === v}" class="${(HAB.tema || 'auto') === v ? 'sel' : ''}" data-tema="${v}">${n}</button>`).join('')}</div></div>
      <div class="linha-ajuste"><span>Sons de acerto e erro</span><button class="chave ${HAB.som !== false ? 'ligada' : ''}" id="som" role="switch" aria-checked="${HAB.som !== false}" aria-label="Sons"><i></i></button></div>
    </section>
    <section class="bloco cartao-bloco">
      <h3>App no celular</h3>
      ${INSTALADO ? '<p class="nota">✅ Você está usando o app instalado.</p>' : `<p class="nota">Instale para abrir pelo ícone, em tela cheia e sem a barra do navegador. Os exercícios de escolha, lacuna e montagem funcionam até sem internet.</p>
        <button class="btn largo" id="instalar">${ICONE.celular} Instalar o Jokenpy</button>`}
      <h3 class="sub">Cópia de segurança</h3>
      <p class="nota">Seu progresso fica neste aparelho. Baixe uma cópia para levar a outro celular ou não perder nada se limpar os dados do navegador.</p>
      <div class="dupla"><button class="btn branco" id="backup">${ICONE.baixar} Baixar cópia</button>
        <label class="btn branco arquivo-btn">Restaurar<input type="file" id="restaurar" accept="application/json,.json" hidden></label></div>
    </section>
  `)
  ligarLembrete()
  $$('[data-meta]').forEach(b => b.onclick = () => { HAB.meta = +b.dataset.meta; salvarHabito(); renderHome() })
  $$('[data-tema]').forEach(b => b.onclick = () => { HAB.tema = b.dataset.tema; salvarHabito(); aplicarTema(); renderHome() })
  $('#som').onclick = () => { HAB.som = HAB.som === false; salvarHabito(); renderHome() }
  const ins = $('#instalar'); if (ins) ins.onclick = instalar
  $('#backup').onclick = baixarBackup
  $('#restaurar').onchange = e => restaurarBackup(e.target.files[0])
}

function htmlConstancia() {
  const hoje = new Date(), semanas = 12
  const fim = new Date(hoje); fim.setDate(fim.getDate() + (6 - hoje.getDay()))   // sábado desta semana
  const max = Math.max(10, ...Object.values(HAB.dias || {}))
  let html = ''
  for (let s = semanas - 1; s >= 0; s--) {
    html += '<div class="col">'
    for (let d = 6; d >= 0; d--) {
      const x = new Date(fim); x.setDate(fim.getDate() - s * 7 - d)
      const k = x.toLocaleDateString('sv'), futuro = x > hoje
      const xp = HAB.dias?.[k] || (estudouNoDia(k) ? 10 : 0), prot = HAB.protegidos?.includes(k)
      const nivel = futuro ? 'fut' : xp ? `n${Math.min(4, Math.ceil(4 * xp / max))}` : prot ? 'prot' : ''
      html += `<i class="${nivel}" title="${x.toLocaleDateString('pt-BR')}${xp ? `: ${xp} XP` : prot ? ': protegido' : ''}"></i>`
    }
    html += '</div>'
  }
  return `<div class="constancia" role="img" aria-label="Dias com estudo nas últimas 12 semanas">${html}</div>`
}

// ---------- tema ----------
function aplicarTema() {
  const t = HAB.tema || 'auto'
  if (t === 'auto') delete document.documentElement.dataset.tema
  else document.documentElement.dataset.tema = t
  const escuro = t === 'escuro' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches)
  $('meta[name=theme-color]')?.setAttribute('content', escuro ? '#14121F' : '#FFFFFF')
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', aplicarTema)

// ---------- instalar (PWA) ----------
const IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const INSTALADO = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
let pedidoInstalar = null
addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedidoInstalar = e })
addEventListener('appinstalled', () => { pedidoInstalar = null; toast('Jokenpy instalado. Abra pelo ícone na tela inicial.') })
async function instalar() {
  if (pedidoInstalar) {
    pedidoInstalar.prompt()
    await pedidoInstalar.userChoice.catch(() => {})
    pedidoInstalar = null
    return
  }
  const m = document.createElement('div'); m.className = 'modal-fundo'
  m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Como instalar">
    <button class="modal-fechar" aria-label="Fechar">✕</button>
    <span class="kicker">Instalar no celular</span><h3>Jokenpy na tela inicial</h3>
    ${IOS ? `<ol class="passos"><li>Abra este endereço no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> (o quadrado com a seta para cima).</li>
      <li>Escolha <b>Adicionar à Tela de Início</b> e confirme.</li><li>Abra o Jokenpy pelo ícone novo e ative os lembretes em <b>Você</b>.</li></ol>
      <p class="nota">No iPhone, as notificações só funcionam com o app aberto pelo ícone da tela inicial.</p>`
    : `<ol class="passos"><li>No Chrome, toque no menu <b>⋮</b> (canto de cima).</li><li>Escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li>
      <li>Abra o Jokenpy pelo ícone novo.</li></ol>`}
    <button class="btn largo" id="modal-ok">Entendi</button></div>`
  document.body.append(m)
  m.onclick = e => { if (e.target === m || e.target.closest('.modal-fechar, #modal-ok')) m.remove() }
}
function htmlConviteInstalar() {
  if (INSTALADO || HAB.dispensouInstalar) return ''
  return `<div class="linha" id="convite-instalar" role="group" aria-label="Instalar o app">
    <span class="li-ico verde">${ICONE.celular}</span>
    <span class="li-txt"><b>Instale no celular</b><small>Abre pelo ícone e funciona offline</small></span>
    <span class="li-botoes"><button class="btn mini" id="instalar-agora">Instalar</button><button class="dispensar" id="dispensar-instalar" aria-label="Agora não">✕</button></span></div>`
}
function ligarConvites() {
  const i = $('#instalar-agora'); if (i) i.onclick = instalar
  const d = $('#dispensar-instalar'); if (d) d.onclick = () => { HAB.dispensouInstalar = true; salvarHabito(); $('#convite-instalar').remove() }
  const l = $('#convite-lembrete'); if (l) l.onclick = () => { irPara('perfil'); $('#bloco-lembrete')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }
}

// ---------- lembretes diários (Web Push) ----------
// O servidor de avisos guarda a inscrição, o horário e um resumo do progresso (ofensiva, próxima lição)
// para mandar uma mensagem personalizada só nos dias em que você ainda não estudou.
const SUPORTA_PUSH = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
let AVISOS = null   // { chave } do servidor de avisos; null = indisponível
async function carregarAvisos() {
  try { const r = await fetch('/avisos/chave'); AVISOS = r.ok ? await r.json() : null } catch { AVISOS = null }
}
const b64ParaBytes = b64 => {
  const s = atob((b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(s, c => c.charCodeAt(0))
}
function estadoAviso() {
  const p = proximaLicao()
  return { ultimoDia: HAB.ultimoDia, sequencia: sequencia(), xpHoje: xpDeHoje(), meta: metaDiaria(), protetores: HAB.protetores || 0,
    trilha: trilhaDe(CURSO.id)?.titulo || '', proxima: p ? LISTA[p.i].titulo : '' }
}
let timerAviso
function avisarEstado() {
  if (!HAB.lembrete?.ativo) return
  clearTimeout(timerAviso)
  timerAviso = setTimeout(() => fetch('/avisos/estado', { method: 'POST', headers: HEADERS, keepalive: true,
    body: JSON.stringify({ endpoint: HAB.lembrete.endpoint, hora: HAB.lembrete.hora, estado: estadoAviso() }) })
    .then(r => { if (r.status === 404) { HAB.lembrete.ativo = false; try { localStorage.setItem(CHAVE_HAB, JSON.stringify(HAB)) } catch {} } }).catch(() => {}), 600)
}
async function ativarLembrete(hora) {
  if (IOS && !INSTALADO) throw new Error('No iPhone, instale o app primeiro (Compartilhar → Adicionar à Tela de Início), abra pelo ícone e ative aqui.')
  if (!SUPORTA_PUSH) throw new Error('Este navegador não aceita notificações. No Android, use o Chrome.')
  if (!AVISOS?.chave) await carregarAvisos()
  if (!AVISOS?.chave) throw new Error('O serviço de lembretes não está disponível neste servidor agora.')
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') throw new Error('As notificações estão bloqueadas. Libere nas configurações do site (cadeado ao lado do endereço) e tente de novo.')
  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ParaBytes(AVISOS.chave) })
  const fuso = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo'
  const r = await fetch('/avisos/inscrever', { method: 'POST', headers: HEADERS, body: JSON.stringify({ assinatura: sub.toJSON(), hora, fuso, estado: estadoAviso() }) })
  if (!r.ok) throw new Error('Não consegui registrar o lembrete no servidor. Tente de novo em instantes.')
  HAB.lembrete = { ativo: true, hora, endpoint: sub.endpoint }
  salvarHabito()
}
async function desativarLembrete() {
  const endpoint = HAB.lembrete?.endpoint
  HAB.lembrete = { ...HAB.lembrete, ativo: false }
  salvarHabito()
  try { const reg = await navigator.serviceWorker.ready; await (await reg.pushManager.getSubscription())?.unsubscribe() } catch {}
  if (endpoint) fetch('/avisos/cancelar', { method: 'POST', headers: HEADERS, body: JSON.stringify({ endpoint }) }).catch(() => {})
}
function htmlConviteLembrete() {
  if (HAB.lembrete?.ativo) return ''
  return `<button class="linha" id="convite-lembrete">
    <span class="li-ico sol">${ICONE.sino}</span>
    <span class="li-txt"><b>Escolha a hora de estudar</b><small>Com horário fixo você estuda mais. A gente lembra.</small></span>${ICONE.seta}</button>`
}
function htmlLembrete() {
  const l = HAB.lembrete, ativo = !!l?.ativo
  return `<h3>${ICONE.sino} Lembrete diário</h3>
    <p class="nota">Escolha <b>quando</b> você vai estudar, por exemplo no ônibus ou depois do almoço. Se você ainda não tiver estudado nesse horário, chega uma notificação com a sua ofensiva e a próxima lição. Se a ofensiva estiver em risco, vem mais um aviso às 21h.</p>
    <div class="linha-ajuste"><label for="hora-lembrete">Horário</label><input type="time" id="hora-lembrete" value="${esc(l?.hora || '19:00')}" step="300"></div>
    <p class="lembrete-msg" id="lembrete-msg" role="status" hidden></p>
    <div class="dupla">${ativo
      ? `<button class="btn" id="salvar-lembrete">Salvar horário</button><button class="btn branco" id="testar-lembrete">Testar agora</button>`
      : `<button class="btn largo" id="ativar-lembrete">${ICONE.sino} Ativar lembretes</button>`}</div>
    ${ativo ? '<button class="link" id="desativar-lembrete">Desligar lembretes</button>' : ''}`
}
function ligarLembrete() {
  const msg = (t, erro) => { const m = $('#lembrete-msg'); if (!m) return; m.hidden = false; m.textContent = t; m.classList.toggle('erro', !!erro) }
  const hora = () => $('#hora-lembrete').value || '19:00'
  const bloco = () => { $('#bloco-lembrete').innerHTML = htmlLembrete(); ligarLembrete() }
  const at = $('#ativar-lembrete'), sv = $('#salvar-lembrete'), ts = $('#testar-lembrete'), ds = $('#desativar-lembrete')
  if (at) at.onclick = async () => {
    at.disabled = true; at.textContent = 'Ativando…'
    try { await ativarLembrete(hora()); bloco(); msg(`Pronto! Todo dia às ${hora()} você recebe um lembrete, se ainda não tiver estudado.`) }
    catch (e) { at.disabled = false; at.innerHTML = `${ICONE.sino} Ativar lembretes`; msg(e.message, true) }
  }
  if (sv) sv.onclick = async () => {
    try { await ativarLembrete(hora()); msg(`Horário salvo: ${hora()}.`) } catch (e) { msg(e.message, true) }
  }
  if (ts) ts.onclick = async () => {
    try {
      const r = await fetch('/avisos/testar', { method: 'POST', headers: HEADERS, body: JSON.stringify({ endpoint: HAB.lembrete.endpoint }) })
      msg(r.ok ? 'Enviado. A notificação deve chegar em alguns segundos.' : r.status === 429 ? 'Espere um minuto para testar de novo.' : 'Não consegui enviar o teste. Ative de novo.', !r.ok)
    } catch { msg('Sem conexão com o servidor.', true) }
  }
  if (ds) ds.onclick = async () => { await desativarLembrete(); bloco(); msg('Lembretes desligados.') }
}

// ---------- cópia de segurança do progresso ----------
function baixarBackup() {
  const dados = {}
  for (let k = 0; k < localStorage.length; k++) {
    const chave = localStorage.key(k)
    if (chave.startsWith('jokenpy') && !chave.startsWith('jokenpy-senha')) dados[chave] = localStorage.getItem(chave)
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ jokenpy: 1, data: new Date().toISOString(), dados })], { type: 'application/json' }))
  a.download = `jokenpy-progresso-${dia(0)}.json`; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
async function restaurarBackup(arquivo) {
  if (!arquivo) return
  try {
    const b = JSON.parse(await arquivo.text())
    if (b.jokenpy !== 1 || typeof b.dados !== 'object') throw new Error()
    if (!confirm(`Restaurar a cópia de ${new Date(b.data).toLocaleDateString('pt-BR')}? O progresso atual deste aparelho será substituído.`)) return
    for (const [k, v] of Object.entries(b.dados)) if (k.startsWith('jokenpy') && typeof v === 'string') localStorage.setItem(k, v)
    location.reload()
  } catch { toast('Este arquivo não é uma cópia do Jokenpy.') }
}

// detalhes que abrem ao clicar numa lição do mapa
function fecharCartao() { $('.cartao-licao')?.remove(); $$('.aberta').forEach(n => n.classList.remove('aberta')) }
function alternarCartao(i, item) {
  const aberto = item.classList.contains('aberta')
  fecharCartao()
  if (aberto) return
  const l = LISTA[i], feita = !!prog.feitas[l.id]
  const and = indiceAndamento() === i ? prog.emAndamento : null
  const c = document.createElement('div')
  c.className = `cartao-licao cor-${tipoDaLicao(i)}`
  c.innerHTML = `<h3>${esc(l.titulo)}</h3>${l.porque ? `<p class="porque">${esc(l.porque)}</p>` : ''}<p>${and ? `Você parou em ${and.feitos} de ${l.exercicios.length} exercícios.` : `~${minutos(l)} min · ${l.ensino.length} explicações curtas e ${l.exercicios.length} exercícios. Você vai ver: ${esc(l.aprende)}.`}</p>
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
document.addEventListener('click', e => { if (!e.target.closest('.cartao-licao, .etapa-btn')) fecharCartao() })

// As lições agrupadas em mundos; cada mundo tem um personagem-guia e uma cor
function atosDoCurso() {
  const usados = new Set(CURSO.partes.flatMap(a => a.ids))
  const atos = CURSO.partes.map(a => ({ ...a, licoes: a.ids.map(id => LISTA.findIndex(l => l.id === id)).filter(i => i >= 0) }))
  const resto = LISTA.map((l, i) => i).filter(i => !usados.has(LISTA[i].id))
  if (resto.length) atos[atos.length - 1].licoes.push(...resto)
  return atos
}

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
function htmlJogo() {
  const tem = id => !LISTA.some(l => l.id === id) || prog.feitas[id]
  const linhas = JOGO
  const prontas = linhas.filter(([id, t]) => t && tem(id)).length, total = linhas.filter(([, t]) => t).length
  const pct = Math.round(100 * prontas / total)
  return `<aside class="arquivo" aria-label="O seu jogo, montado conforme você conclui as lições">
    <div class="arquivo-topo">${trio(pct === 100 ? 'feliz' : 'normal', 22)}<span>jokenpo.py</span><b>${pct}% escrito</b></div>
    <pre>${blocosArquivo(linhas, tem)}</pre>
    <div class="arquivo-barra"><div style="width:${pct}%"></div></div>
  </aside>`
}

// linhas que faltam viram um comentário só por bloco: "# … 4 linhas: Funções, Quem ganhou?"
function blocosArquivo(linhas, tem) {
  const out = []
  let grupo = null
  for (const [id, t] of linhas) {
    if (t && !tem(id)) {
      const titulo = LISTA.find(l => l.id === id).titulo
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

// Painel da vaga: cada requisito acende quando o módulo que o cobre é concluído.
const htmlArquivo = () => CURSO.painel === 'vaga' ? htmlVaga() : htmlJogo()
function htmlVaga() {
  const feito = id => !!prog.feitas[id]
  const reqs = CURSO.vaga
  const prontos = reqs.filter(r => r.modulos.every(feito)).length
  const pct = Math.round(100 * prontos / reqs.length)
  return `<aside class="arquivo" aria-label="Requisitos da vaga e o seu preparo">
    <div class="arquivo-topo">${trio(pct === 100 ? 'feliz' : 'normal', 22)}<span>${esc(CURSO.arquivo)}</span><b>${pct}% preparado</b></div>
    <pre>${reqs.map(r => {
      const ok = r.modulos.every(feito), parte = r.modulos.some(feito)
      return `<span class="ln req ${ok ? 'ok' : parte ? 'parte' : 'falta'}">${ok ? '[x]' : parte ? '[~]' : '[ ]'} ${esc(r.texto)}${r.diferencial ? ' <i>(diferencial)</i>' : ''}</span>`
    }).join('')}</pre>
    <div class="arquivo-barra"><div style="width:${pct}%"></div></div>
  </aside>`
}



// ---------- lição ----------
// A lição tem duas fases: "ensino" (cartões de explicação, pode pular) e "exercicios".
function iniciar(i, salvo = null, pularEnsino = false, licao = LISTA[i]) {
  fecharCartao()
  const fila = salvo
    ? salvo.fila.filter(k => typeof k === 'number' && k >= 0).map(k => licao.exercicios[k]).filter(Boolean)
    : [...licao.exercicios]
  if (!salvo) limparRascunhos(licao)
  const passo = salvo ? salvo.passo ?? null : pularEnsino ? null : 0
  L = {
    i, licao, fila, total: licao.exercicios.length,
    fase: passo == null ? 'exercicios' : !salvo && licao.gancho ? 'gancho' : 'ensino', passo: passo ?? 0,
    combo: 0, primeiras: new Set(),
    feitos: salvo?.feitos || 0, erros: salvo?.erros || 0, dicas: salvo?.dicas || 0,
    inicio: Date.now() - (salvo?.decorrido || 0), codigoFinal: salvo?.codigoFinal || null, estado: 'responder',
  }
  L.tipo = licao.revisao ? 'papel' : tipoDaLicao(i)
  app.innerHTML = `<div class="licao cor-${L.tipo}">
    <header class="licao-topo">
      <div class="licao-topo-in">
        <button class="fechar" id="fechar" aria-label="Voltar ao início (o progresso fica salvo)" title="Voltar ao início (o progresso fica salvo)">✕</button>
        <div class="licao-meio">
          <div class="licao-nome"><small>${licao.revisao ? 'Revisão' : `${CURSO.rotulo} ${i + 1}`}</small><b>${esc(licao.titulo)}</b><span class="combo" id="combo" hidden title="Acertos seguidos"></span><span class="contador" id="contador"></span></div>
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
const licaoDe = it => LISTA.find(l => l.exercicios.includes(it))
// ---------- revisão espaçada ----------
// Cada exercício respondido entra numa caixa (1 a 5). Acertou na revisão: sobe de caixa e volta mais tarde;
// errou: volta para a caixa 1 (amanhã). Revisar no dia certo, de memória e misturando módulos é o que fixa.
const INTERVALOS = [1, 3, 7, 16, 35]
const revisavel = it => !['codigo', 'entrevista'].includes(it.tipo)
function agendar(it, certo, naRevisao) {
  if (!revisavel(it)) return
  const srs = prog.srs ||= {}
  const atual = srs[it.id]
  if (!naRevisao && atual && atual.c > 1 && certo) return      // refazer a lição não rebaixa o que já está firme
  const c = naRevisao ? (certo ? Math.min(5, (atual?.c || 1) + 1) : 1) : (certo ? 2 : 1)
  srs[it.id] = { c, d: dia(INTERVALOS[c - 1]) }
}
const devidos = () => LISTA.filter(l => prog.feitas[l.id]).flatMap(l => l.exercicios)
  .filter(it => revisavel(it) && prog.srs?.[it.id] && prog.srs[it.id].d <= dia(0))
function iniciarRevisao() {
  const fracos = prog.fracos || {}
  const banco = LISTA.filter(l => prog.feitas[l.id]).flatMap(l => l.exercicios.filter(revisavel))
  if (!banco.length) { toast('Conclua um módulo para liberar a revisão.'); return }
  let escolhidos = devidos().map(it => ({ it, peso: (5 - prog.srs[it.id].c) + Math.random() }))
    .sort((a, b) => b.peso - a.peso).slice(0, 8).map(x => x.it)
  const espacada = escolhidos.length > 0
  if (!espacada) escolhidos = banco.map(it => ({ it, peso: (fracos[it.id] || 0) + Math.random() }))
    .sort((a, b) => b.peso - a.peso).slice(0, TAM_REVISAO).map(x => x.it)
  iniciar(-1, null, true, { id: 'revisao', titulo: espacada ? 'Revisão do dia' : 'Treino extra', icone: '🧠', aprende: 'revisar o que já viu', revisao: true, ensino: [], exercicios: embaralhar(escolhidos) })
}

function retomar() { const i = indiceAndamento(); if (i >= 0) iniciar(i, prog.emAndamento) }
function sairDaLicao() { salvarAndamento(); toast(L.licao.revisao ? 'Revisão encerrada.' : 'Progresso salvo. Continue quando quiser.'); renderHome() }

// guarda onde você está na lição (chamado a cada passo)
function salvarAndamento() {
  if (!L || L.licao.revisao) return
  let fila = L.fila
  if (L.estado === 'feedback' && L.ultimoCerto === true) fila = fila.slice(1)
  else if (L.estado === 'feedback' && L.ultimoCerto === false && !['codigo', 'entrevista'].includes(fila[0].tipo)) fila = [...fila.slice(1), fila[0]]
  prog.emAndamento = {
    i: L.i, id: L.licao.id, passo: L.fase === 'exercicios' ? null : L.passo, fila: fila.map(it => it.k), feitos: L.feitos, erros: L.erros,
    dicas: L.dicas, decorrido: Date.now() - L.inicio, codigoFinal: L.codigoFinal,
  }
  salvarProgresso()
}

const casosDe = it => it.casos || [{ entrada: it.entrada || '', espera: it.espera, proibido: it.proibido }]
function proximo() {
  if (L.fase === 'gancho') return renderGancho()
  if (L.fase === 'ensino') return renderEnsino()
  L.fila.length ? renderItem() : concluir()
}

// ---------- desafio relâmpago: um palpite antes da explicação ----------
// Tentar responder antes de aprender (efeito do pré-teste) deixa curioso e faz a explicação grudar. Não vale ponto.
function renderGancho() {
  const g = L.licao.gancho
  L.estado = 'gancho'
  $('#barra').parentElement.classList.add('azul')
  $('#barra').style.width = '4%'
  $('#contador').textContent = 'palpite'
  const ordem = embaralhar(g.opcoes.map((_, k) => k))
  $('#corpo').innerHTML = `<div class="corpo-in entrar gancho">
    <div class="gancho-selo"><span class="raio-ico">${ICONE.raio}</span><span><b>Desafio relâmpago</b><small>Dê um palpite antes da explicação. Não vale ponto.</small></span></div>
    <h2 class="gancho-titulo">${esc(g.titulo)}</h2>
    <p class="gancho-pergunta">${g.pergunta}</p>
    ${g.codigo ? `<pre class="cod">${realcar(g.codigo)}</pre>` : ''}
    <div class="opcoes">${ordem.map((k, n) => `<button class="opcao" data-k="${k}"><span class="num">${n + 1}</span><span class="op-txt">${g.opcoesCodigo ? `<code>${esc(g.opcoes[k])}</code>` : escOpcao(g.opcoes[k])}</span></button>`).join('')}</div>
    <div class="revelacao" id="revelacao" hidden></div>
  </div>`
  $('#corpo').scrollTop = 0
  const r = $('#rodape'); r.className = 'rodape'
  r.innerHTML = rodapeIn(`<div class="rodape-esq"><button class="btn branco" id="pular-gancho">Pular</button></div>
    <div class="rodape-dir"><span class="dica-rodape">Toque numa opção</span></div>`, 'uma-linha')
  const seguir = () => { L.fase = 'ensino'; L.passo = 0; proximo() }
  $('#pular-gancho').onclick = seguir
  $$('.gancho .opcao').forEach(b => b.onclick = () => {
    const k = +b.dataset.k, certo = k === g.certa
    $$('.gancho .opcao').forEach(x => { const kk = +x.dataset.k; if (kk === g.certa) x.classList.add('ok'); else if (kk === k) x.classList.add('ruim') })
    $('.gancho .opcoes').classList.add('travado')
    certo ? (somCerto(), vibrar(12)) : vibrar(8)
    prog.palpites = prog.palpites || {}; prog.palpites[L.licao.id] = certo
    const rv = $('#revelacao'); rv.hidden = false
    rv.innerHTML = `<b>${certo ? 'Na mosca! Agora entenda o porquê.' : 'Quase todo mundo erra esta. 😉'}</b><p>${g.revelacao}</p>`
    rv.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    r.innerHTML = rodapeIn(`<div class="rodape-dir"><button class="btn" id="principal">Entender agora ${ICONE.seta}</button></div>`, 'uma-linha')
    $('#principal').onclick = seguir; $('#principal').focus({ preventScroll: true })
  })
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
      ${marcarAjustes(c.texto)}
      ${c.codigo ? (roda(c) ? htmlExemplo(c) : htmlTrecho(c)) : ''}
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
  if (c.codigo && roda(c)) ligarExemplo(c)
  $('#principal').focus({ preventScroll: true })
  salvarAndamento()
}

function irParaExercicios() {
  L.fase = 'exercicios'
  $('#barra').parentElement.classList.remove('azul')
  atualizarBarra()
  proximo()
}

// só Python roda no servidor; Java, TypeScript, React, SQL, Django e YAML aparecem como trecho de leitura
const roda = c => !c.linguagem || c.linguagem === 'python'
const NOME_LING = { ts: 'TypeScript', tsx: 'React (TSX)', js: 'JavaScript', jsx: 'React (JSX)', sql: 'SQL', graphql: 'GraphQL', yaml: 'YAML', bash: 'Terminal', json: 'JSON', css: 'CSS', html: 'HTML', python: 'Python', texto: 'Texto', java: 'Java', xml: 'XML', properties: 'Properties', django: 'Django (Python)', http: 'HTTP', kotlin: 'Kotlin' }
const htmlTrecho = c => `<div class="rotulo">${esc(NOME_LING[c.linguagem] || c.linguagem)} · para ler</div><pre class="cod">${realcar(c.codigo)}</pre>`

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
  else if (it.tipo === 'entrevista') html = htmlEntrevista(it)
  const TIPOS = { escolha: 'Escolha a resposta', completar: 'Complete o código', montar: 'Monte a linha', codigo: 'Escreva o código', entrevista: 'Pergunta de entrevista' }
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

function rotularDica(vistas, total) {
  const txt = vistas >= total ? ' Dicas' : ` Dica (${vistas}/${total})`
  const b = $('#btn-dica'); if (b) b.textContent = '💡' + txt
  const q = $('#btn-dica-q'); if (q) q.innerHTML = `💡<span class="rotulo-btn">${txt}</span>`
}
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
  rotularDica(n, dicas.length)
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
  <div class="opcoes">${L.ordem.map((k, n) => `<button class="opcao" data-k="${k}"><span class="num">${n + 1}</span><span class="op-txt">${it.opcoesCodigo ? `<code>${esc(it.opcoes[k])}</code>` : escOpcao(it.opcoes[k])}</span></button>`).join('')}</div>`
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
  if (it.tipo === 'entrevista') return ligarEntrevista(it)
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

function htmlEntrevista(it) {
  const rascunho = prog.rascunhos[it.id] ?? ''
  return `<h2>${it.pergunta}</h2>
  ${it.avalia ? `<p class="enunciado"><b>O que avaliam:</b> ${it.avalia}</p>` : ''}
  <div class="ensaio">
    <div class="ensaio-topo"><span>Responda em voz alta ou anote os tópicos</span><span class="cronometro" id="cronometro">0:00</span></div>
    <textarea id="ensaio" rows="5" placeholder="Ex.: contexto → o que eu fiz → resultado → o que aprendi" aria-label="Seus tópicos">${esc(rascunho)}</textarea>
  </div>
  <div class="modelo" id="modelo" hidden></div>`
}
function ligarEntrevista(it) {
  const ta = $('#ensaio'), ini = Date.now()
  ta.oninput = () => { prog.rascunhos[it.id] = ta.value; salvarProgresso() }
  clearInterval(L.relogio)
  L.relogio = setInterval(() => {
    const c = $('#cronometro'); if (!c) return clearInterval(L.relogio)
    const s = Math.round((Date.now() - ini) / 1000)
    c.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    c.classList.toggle('longo', s > (it.tempo || 120))
  }, 1000)
}
// trechos "[ajuste: …]" são lembretes para o dono completar com a própria história
const marcarAjustes = html => (html || '').replace(/\[ajuste:\s*([^\]]*)\]/g, '<mark class="ajuste" title="Complete com a sua história real">✏️ $1</mark>')

// lê a resposta-modelo em voz alta (bom para estudar no celular, andando ou no ônibus)
function ouvir(texto, botao) {
  const fala = window.speechSynthesis
  if (fala.speaking) { fala.cancel(); botao.textContent = '🔊 Ouvir'; return }
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = 'pt-BR'; u.rate = 1.05
  const voz = fala.getVoices().find(v => v.lang?.toLowerCase().startsWith('pt'))
  if (voz) u.voice = voz
  u.onend = u.onerror = () => { if (botao.isConnected) botao.textContent = '🔊 Ouvir' }
  botao.textContent = '⏹ Parar'
  fala.speak(u)
}

function mostrarModelo(it) {
  clearInterval(L.relogio)
  const m = $('#modelo'); m.hidden = false
  m.innerHTML = `<div class="modelo-bloco"><div class="modelo-topo"><span class="kicker">Resposta-modelo</span>${'speechSynthesis' in window ? '<button class="btn branco mini" id="ouvir">🔊 Ouvir</button>' : ''}</div>${marcarAjustes(it.resposta)}</div>
    ${it.pontos?.length ? `<div class="modelo-bloco"><span class="kicker">Confira: você falou de…</span>
      <ul class="checklist">${it.pontos.map((p, k) => `<li><label><input type="checkbox" data-k="${k}"> <span>${p}</span></label></li>`).join('')}</ul></div>` : ''}
    ${it.evitar?.length ? `<div class="modelo-bloco evitar"><span class="kicker">Evite</span><ul>${it.evitar.map(e => `<li>${e}</li>`).join('')}</ul></div>` : ''}
    ${it.seguimento?.length ? `<div class="modelo-bloco"><span class="kicker">Perguntas que costumam vir depois</span><ul>${it.seguimento.map(e => `<li>${e}</li>`).join('')}</ul></div>` : ''}`
  m.scrollIntoView({ block: 'start', behavior: 'smooth' })
  const ou = $('#ouvir'); if (ou) ou.onclick = () => ouvir(textoDe(it.resposta.replace(/\[ajuste:[^\]]*\]/g, '')), ou)
  L.estado = 'feedback'
  const r = $('#rodape'); r.className = 'rodape'
  r.innerHTML = rodapeIn(`<div class="rodape-esq"><button class="btn branco" id="treinar" title="Esta pergunta volta para você treinar de novo">↻ Treinar</button></div>
    <div class="rodape-dir"><button class="btn verde" id="principal">✓ Mandei bem</button></div>`, 'uma-linha')
  const marcar = certo => {
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    prog.fracos = prog.fracos || {}
    prog.fracos[it.id] = Math.max(0, (prog.fracos[it.id] || 0) + (certo ? -1 : 2))
    if (!prog.fracos[it.id]) delete prog.fracos[it.id]
    L.ultimoCerto = certo
    if (certo) { somCerto(); L.feitos++; atualizarBarra(); L.fila.shift() }
    else { L.erros++; L.fila.push(L.fila.shift()) }
    salvarProgresso(); proximo()
  }
  $('#principal').onclick = () => marcar(true)
  $('#treinar').onclick = () => marcar(false)
  $('#principal').focus({ preventScroll: true })
}

function rodapeResponder(it) {
  const r = $('#rodape'); r.className = 'rodape'; L.estado = 'responder'
  if (it.tipo === 'entrevista') {
    r.innerHTML = rodapeIn(`<div class="rodape-esq"><button class="btn branco" id="pular" title="Pular" aria-label="Pular">⏭<span class="rotulo-btn"> Pular</span></button><button class="btn branco" id="btn-dica-q" title="Dica" aria-label="Dica">💡<span class="rotulo-btn"> Dica</span></button></div>
      <div class="rodape-dir"><button class="btn" id="principal">Ver resposta</button></div>`, 'uma-linha')
    $('#principal').onclick = () => mostrarModelo(it)
    $('#pular').onclick = pularExercicio
    $('#btn-dica-q').onclick = () => mostrarDica(it)
    return
  }
  const pular = '<button class="btn branco" id="pular" title="Deixar para depois: o exercício volta no fim da lição" aria-label="Pular">⏭<span class="rotulo-btn"> Pular</span></button>'
  if (it.tipo === 'codigo') r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="executar" title="Executar" aria-label="Executar">▶<span class="rotulo-btn"> Executar</span></button></div>
    <div class="rodape-dir"><button class="btn" id="principal">Verificar</button></div>`, 'uma-linha')
  else r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="btn-dica-q" title="Uma pista de cada vez, sem entregar a resposta" aria-label="Dica">💡<span class="rotulo-btn"> Dica</span></button></div>
    <div class="rodape-dir"><button class="btn" id="principal" disabled>Verificar</button></div>`, 'uma-linha')
  $('#principal').onclick = verificar
  $('#pular').onclick = pularExercicio
  const ex = $('#executar'); if (ex) ex.onclick = () => executarLivre(it)
  const dq = $('#btn-dica-q'); if (dq) dq.onclick = () => (it.dicas?.length || !IA_ATIVA) ? mostrarDica(it) : dicaQuestao(it)
  const n = it.dicas?.length; if (n && L.dicasVistas) rotularDica(L.dicasVistas, n)
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

const ELOGIOS = ['Mandou bem!', 'Isso aí!', 'Na mosca!', 'Perfeito!', 'Boa jogada!']
const elogio = () => ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]
function atualizarBarra() {
  const b = $('#barra'); if (b) b.style.width = (100 * L.feitos / L.total) + '%'
  const cb = $('#combo')
  if (cb) { cb.hidden = L.combo < 3; cb.textContent = `🔥 ${L.combo}`; if (L.combo >= 3) { cb.classList.remove('pop'); void cb.offsetWidth; cb.classList.add('pop') } }
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
    correta = it.opcoesCodigo ? `<code>${esc(it.opcoes[it.certa])}</code>` : escOpcao(it.opcoes[it.certa])
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
  if (!L.primeiras.has(it.id)) { L.primeiras.add(it.id); agendar(it, certo, !!L.licao.revisao) }
  if (certo) {
    somCerto(); vibrar(12); L.feitos++; L.combo++; atualizarBarra()
    rodapeFeedback(true, L.combo >= 3 ? `${L.combo} seguidas!` : elogio(), it.explica || '')
    $('#principal').onclick = () => { L.fila.shift(); proximo() }
  } else {
    somErro(); vibrar([18, 50, 18]); L.erros++; L.combo = 0; atualizarBarra()
    rodapeFeedback(false, 'Não foi dessa vez', `A resposta é ${correta}.` + (it.explica ? `<br>${it.explica}` : '') + '<br><small>Ele volta no fim da lição para você tentar de novo.</small>',
      (IA_ATIVA ? '<button class="btn branco" id="explicar">💬 Explicar</button>' : '') +
      '<button class="btn branco" id="refazer" title="Fazer este exercício de novo agora">↻ Refazer</button>')
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
    // corrige só o que o programa imprimiu: a pergunta do input() e o valor digitado ficam de fora
    const saida = padrao(r.saida_limpa ?? r.saida)
    if (!r.ok) falha = r.erro
    else if (c.espera && !saida.includes(padrao(c.espera))) {
      const parecida = linhaParecida(r.saida_limpa ?? r.saida, c.espera)
      falha = parecida
        ? `A saída deveria mostrar "${c.espera}"${quando}, mas o seu programa mostrou "${parecida}". Compare letra por letra, incluindo os espaços (maiúsculas, acentos e pontuação não importam).`
        : `A saída deveria mostrar "${c.espera}"${quando}. Compare com a sua saída acima (maiúsculas, acentos e pontuação não importam).`
    }
    else { const p = temProibido(saida, c.espera, c.proibido); if (p) falha = `Não deveria aparecer "${p}"${quando}.` }
    if (falha) break
  }

  L.estado = 'feedback'; L.ultimoCerto = !falha
  if (!falha) {
    somCerto(); vibrar(12); L.feitos++; atualizarBarra()
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
  const xp = l.revisao || jaFeita ? 5 : (l.final ? 30 : 10) + (L.erros === 0 ? 5 : 0)
  const estrelas = estrelasPor(L.erros)
  const metaAntes = xpDeHoje() >= metaDiaria(), seqAntes = sequencia()
  ganharXP(xp); marcarDia()
  HAB.recorde = Math.max(HAB.recorde || 0, HAB.sequencia || 0)
  const bateuMeta = !metaAntes && xpDeHoje() >= metaDiaria(), novoDia = sequencia() > seqAntes
  const ganhouProtetor = HAB.ganhouProtetor; delete HAB.ganhouProtetor
  if (!l.revisao) { prog.estrelas = prog.estrelas || {}; prog.estrelas[l.id] = Math.max(prog.estrelas[l.id] || 0, estrelas) }
  if (!l.revisao) { prog.feitas[l.id] = true; prog.emAndamento = null; limparRascunhos(l) }
  salvarProgresso(); salvarHabito()
  navigator.clearAppBadge?.().catch(() => {})
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
  const seguinte = revisao ? -1 : LISTA.findIndex((x, k) => k > i && !prog.feitas[x.id])
  somFim(); vibrar([12, 40, 12, 40, 24])
  app.innerHTML = `${confete()}
  <main class="resultado">
    <div class="resultado-topo">
      <div class="trofeu">${l.final ? trio('feliz', 84) : personagem(L.tipo, 'feliz', 110)}</div>
      <span class="kicker">${revisao ? 'Revisão concluída' : `${CURSO.rotulo} ${i + 1} concluíd${CURSO.rotulo === 'Lição' ? 'a' : 'o'}`}</span>
      <h1>${l.final ? 'Você construiu um Jokenpô!' : revisao ? 'Revisão feita' : esc(l.titulo)}</h1>
      <p>${revisao ? (L.erros ? 'O que você errou volta com mais frequência nas próximas revisões.' : 'Tudo certo. Revisar é o que faz o conteúdo ficar na memória.')
        : L.erros === 0 ? 'Tudo certo de primeira.' : 'Os exercícios que você errou foram refeitos até sair.'}</p>
    </div>
    ${revisao ? '' : `<div class="estrelas-grandes">${htmlEstrelas(estrelas)}</div>`}
    <div class="cartoes">
      <div class="cartao c-xp"><small>XP</small><b>⚡ +<span class="contar" data-n="${xp}">0</span></b></div>
      <div class="cartao c-acerto"><small>De primeira</small><b>🎯 ${primeira}%</b></div>
      <div class="cartao c-tempo"><small>Tempo</small><b>⏱ ${tempo}</b></div>
    </div>
    ${novoDia || bateuMeta || ganhouProtetor ? `<div class="conquistas">
      ${novoDia ? `<div class="conquista fogo-c">${ICONE.fogo}<span><b>${sequencia()} ${sequencia() === 1 ? 'dia' : 'dias'} de ofensiva</b><small>${sequencia() === 1 ? 'O primeiro dia é o mais difícil. Volte amanhã.' : 'Mais um dia na conta. Volte amanhã.'}</small></span></div>` : ''}
      ${bateuMeta ? `<div class="conquista meta-c">${ICONE.alvo}<span><b>Meta do dia batida</b><small>${metaDiaria()} XP hoje. O resto é bônus.</small></span></div>` : ''}
      ${ganhouProtetor ? `<div class="conquista prot-c">${ICONE.escudo}<span><b>Você ganhou um protetor</b><small>Ele cobre um dia sem estudo, sem perder a ofensiva.</small></span></div>` : ''}
    </div>` : ''}
    <p class="continuar-info" style="text-align:center">Meta do dia: ${Math.min(xpDeHoje(), metaDiaria())}/${metaDiaria()} XP · ${sequencia()} ${sequencia() === 1 ? 'dia seguido' : 'dias seguidos'}${L.dicas ? ` · ${L.dicas} ${L.dicas === 1 ? 'dica usada' : 'dicas usadas'}` : ''}</p>
    ${revisao ? '' : htmlResumo(l)}
    ${l.final ? htmlJogar(arquivo) : ''}
    ${!revisao && !l.final && !jaFeita ? `<p class="continuar-info" style="text-align:center">${CURSO.painel === 'jogo' ? 'Mais uma parte do seu <code>jokenpo.py</code> foi liberada no mapa da trilha.' : 'Suas competências no mapa da trilha foram atualizadas.'}</p>` : ''}
    <div class="resultado-acoes">
      ${seguinte >= 0 ? `<button class="btn largo" id="seguinte">Próxima: ${esc(LISTA[seguinte].titulo)} →</button>` : ''}
      <button class="btn ${seguinte >= 0 ? 'branco' : ''} largo" id="cont">Voltar ao início</button>
      <button class="btn branco largo" id="denovo">↻ Fazer de novo</button>
    </div>
  </main>`
  // o XP sobe contando, como um placar
  $$('.contar').forEach(el => { const n = +el.dataset.n, t0 = performance.now()
    const passo = t => { const k = Math.min(1, (t - t0) / 700); el.textContent = Math.round(n * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(passo) }
    requestAnimationFrame(passo) })
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
    <div class="aprendeu">${LISTA.map(l => `<span>${l.icone} ${esc(l.aprende)}</span>`).join('')}</div>
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
  ligarCasca()
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
  aplicarTema()
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
  try { INDICE = await (await fetch('/cursos/indice.json', { cache: 'no-cache' })).json() } catch {}
  let ultima = 'python'
  try { ultima = localStorage.getItem('jokenpy-trilha') || 'python' } catch {}
  const t = trilhaDe(ultima)
  try {
    if (t?.privada) {
      let senha = null
      try { senha = localStorage.getItem(`jokenpy-senha-${t.id}`) } catch {}
      if (senha) await carregarTrilha(t, senha)
    } else if (t && t.id !== 'python' && disponivel(t)) await carregarPublica(t)
  } catch {}
  if (t && t.id !== 'python' && TRILHAS_CARREGADAS[t.id]) ativarTrilha(t.id)
  const salvo = aplicarProtetor()
  const ir = new URLSearchParams(location.search).get('ir')
  if (ir) history.replaceState(null, '', '/')
  renderHome()
  if (salvo) toast(`🛡️ Seu protetor cobriu ${salvo === 1 ? 'o dia de ontem' : `${salvo} dias`}. A ofensiva continua!`)
  if (ir === 'continuar') { const p = proximaLicao(); if (p) p.andamento ? retomar() : iniciar(p.i) }
  else if (ir === 'revisao') iniciarRevisao()
  navigator.clearAppBadge?.().catch(() => {})
  try {
    const d = await (await fetch('/ia/status')).json()
    IA_ATIVA = !!d.ativa; marcarServidor(true)
  } catch { marcarServidor(false) }
  await carregarAvisos()
  avisarEstado()
  if (await sincronizar() && !L) renderHome()
}
// voltou ao app num dia novo: atualiza a tela (ofensiva, meta, protetor)
let diaAberto = dia(0)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || diaAberto === dia(0)) return
  diaAberto = dia(0)
  const salvo = aplicarProtetor()
  if (!L && !$('.modal-fundo')) renderHome()
  if (salvo) toast('🛡️ Seu protetor cobriu o dia de ontem. A ofensiva continua!')
})
iniciarApp()
