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
const META_DIARIA = 20

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

// ---------- progresso ----------
// Fica salvo no navegador (localStorage) e no servidor (jokenpo/progresso.json).
// Assim você não perde nada se fechar a aba, trocar de navegador ou limpar os dados do site.
const CHAVE = 'jokenpy-progresso'
const novoProgresso = () => ({
  feitas: {}, xp: 0, sequencia: 0, ultimoDia: null, som: true,
  xpHoje: { dia: null, xp: 0 },
  emAndamento: null,   // lição aberta: onde parou, vidas, erros
  rascunhos: {},       // código que você estava escrevendo, por exercício
  atualizado: 0,
})
let prog = carregarLocal()
if (!prog.atualizado && (prog.xp || Object.keys(prog.feitas).length)) prog.atualizado = 1  // progresso antigo

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
    if ((remoto.atualizado || 0) > (prog.atualizado || 0)) { prog = { ...novoProgresso(), ...remoto }; gravarLocal(); return true }
    if ((prog.atualizado || 0) > (remoto.atualizado || 0)) enviarProgresso()
  } catch {}
  return false
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && envioPendente) enviarProgresso() })

const dia = d => { const x = new Date(); x.setDate(x.getDate() + d); return x.toLocaleDateString('sv') }
const sequencia = () => prog.ultimoDia === dia(0) || prog.ultimoDia === dia(-1) ? prog.sequencia : 0
const xpDeHoje = () => prog.xpHoje?.dia === dia(0) ? prog.xpHoje.xp : 0
const liberada = i => i === 0 || !!prog.feitas[LICOES[i - 1].id]
function marcarDia() {
  if (prog.ultimoDia === dia(0)) return
  prog.sequencia = prog.ultimoDia === dia(-1) ? prog.sequencia + 1 : 1
  prog.ultimoDia = dia(0)
}
function ganharXP(n) {
  if (prog.xpHoje?.dia !== dia(0)) prog.xpHoje = { dia: dia(0), xp: 0 }
  prog.xpHoje.xp += n
  prog.xp += n
}
function limparRascunhos(licao) { licao.exercicios.forEach(it => delete prog.rascunhos[it.id]) }

// ---------- servidor ----------
function marcarServidor(ok) {
  let aviso = $('#aviso')
  if (ok) { aviso?.remove(); return }
  if (aviso) return
  aviso = document.createElement('div')
  aviso.id = 'aviso'; aviso.className = 'aviso'; aviso.setAttribute('role', 'status')
  aviso.innerHTML = '⚠️ Servidor desligado: o código não roda e o progresso fica só neste navegador. Na pasta <code>jokenpo</code>, rode <code>python -m uvicorn server:app --port 8080</code>'
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

// ---------- tela inicial ----------
function topo() {
  return `<header class="topo"><div class="topo-in">
    <div class="marca">✊ Jokenpy</div>
    <div class="stats">
      <span class="fogo" title="Dias seguidos estudando">🔥 ${sequencia()}</span>
      <span class="raio" title="XP total">⚡ ${prog.xp}</span>
      <button class="som" id="som" title="Ligar ou desligar o som" aria-label="Som">${prog.som ? '🔊' : '🔇'}</button>
    </div></div></header>`
}
function ligarSom() {
  $('#som').onclick = () => { prog.som = !prog.som; salvarProgresso(); $('#som').textContent = prog.som ? '🔊' : '🔇' }
}

const X = [0, 58, 86, 58, 0, -58, -86, -58]

function renderHome() {
  L = null
  const feitas = LICOES.filter(l => prog.feitas[l.id]).length
  const andamento = prog.emAndamento && LICOES[prog.emAndamento.i] ? prog.emAndamento : null
  const proxima = LICOES.findIndex((l, i) => liberada(i) && !prog.feitas[l.id])
  const destaque = andamento ? andamento.i : proxima
  const hoje = xpDeHoje()
  app.innerHTML = `${topo()}
  <main class="home">
    <section class="unidade">
      <div>
        <small>Unidade 1 · ${feitas} de ${LICOES.length} lições</small>
        <h1>Construa um Jokenpô em Python</h1>
        <p>Cada lição ensina uma peça do jogo. No fim, ele roda no seu terminal.</p>
      </div>
      <div class="unidade-ico">✊</div>
    </section>
    ${andamento ? htmlRetomar(andamento) : ''}
    <section class="painel meta">
      <div class="meta-topo"><b>🎯 Meta do dia</b><span>${Math.min(hoje, META_DIARIA)}/${META_DIARIA} XP</span></div>
      <div class="barra fina ouro"><div style="width:${Math.min(100, 100 * hoje / META_DIARIA)}%"></div></div>
      <small>${hoje >= META_DIARIA ? 'Meta batida! Volte amanhã para manter a sequência 🔥' : 'Uma lição nova vale 10 XP (15 se for perfeita).'}</small>
    </section>
    <div class="trilha">
      ${LICOES.map((l, i) => {
        const st = prog.feitas[l.id] ? 'feito' : liberada(i) ? 'livre' : 'bloqueado'
        return `<div class="no-linha" style="--x:${X[i % X.length]}px">
          ${i === destaque ? `<div class="balao">${andamento ? 'Continuar' : 'Começar'}</div>` : ''}
          <button class="no ${st} ${i === destaque ? 'atual' : ''} ${l.final ? 'final' : ''}" data-i="${i}" aria-label="${esc(l.titulo)}">${l.icone}</button>
          <div class="no-rotulo">${esc(l.titulo)}</div>
          ${st === 'feito' ? '<div class="no-sub">✓ Concluída</div>' : ''}
        </div>`
      }).join('')}
    </div>
    ${feitas === LICOES.length ? '<button class="btn largo" id="ver-fim" style="margin-top:36px">🏆 Ver meu jogo</button>' : ''}
    <button class="link" id="zerar">Recomeçar do zero</button>
  </main>`
  ligarSom()
  $$('.no').forEach(b => b.onclick = () => alternarCartao(+b.dataset.i, b.parentElement))
  const r = $('#retomar'); if (r) r.onclick = retomar
  $('#zerar').onclick = () => {
    if (!confirm('Apagar todo o progresso (XP, lições e rascunhos)?')) return
    const som = prog.som; prog = novoProgresso(); prog.som = som; salvarProgresso(); renderHome()
  }
  const vf = $('#ver-fim'); if (vf) vf.onclick = renderFim
}

function htmlRetomar(a) {
  const l = LICOES[a.i]
  return `<section class="painel retomar">
    <div><small>Lição em andamento</small><b>${l.icone} ${esc(l.titulo)}</b>
    <span>${a.feitos} de ${l.exercicios.length} exercícios · ❤️ ${a.vidas}</span></div>
    <button class="btn" id="retomar">Continuar</button>
  </section>`
}

// cartão que abre ao clicar numa lição da trilha
function fecharCartao() { $('.cartao-licao')?.remove(); $$('.no-linha.aberta').forEach(n => n.classList.remove('aberta')) }
function alternarCartao(i, linha) {
  const aberto = linha.classList.contains('aberta')
  fecharCartao()
  if (aberto) return
  const l = LICOES[i], feita = !!prog.feitas[l.id], livre = liberada(i)
  const and = prog.emAndamento?.i === i ? prog.emAndamento : null
  let corpo
  if (!livre) corpo = `<p>🔒 Termine "${esc(LICOES[i - 1].titulo)}" para liberar esta lição.</p>`
  else if (and) corpo = `<p>Você parou em ${and.feitos} de ${l.exercicios.length} exercícios.</p>
    <button class="btn largo" data-acao="continuar">Continuar</button>
    <button class="btn branco largo" data-acao="comecar">Começar do início</button>`
  else corpo = `<p>Você vai aprender: ${esc(l.aprende)}.</p>
    <button class="btn largo" data-acao="comecar">${feita ? '↻ Fazer de novo · +5 XP' : `Começar · +${l.final ? 30 : 10} XP`}</button>
    <button class="btn branco largo" data-acao="exercicios">Pular explicação e ir aos exercícios</button>`
  const c = document.createElement('div')
  c.className = `cartao-licao ${!livre ? 'bloq' : feita ? 'ouro' : ''}`
  c.innerHTML = `<small>Lição ${i + 1} de ${LICOES.length}${feita ? ' · concluída ✓' : ''}</small><h3>${esc(l.titulo)}</h3>${corpo}`
  c.onclick = e => {
    const acao = e.target.closest('[data-acao]')?.dataset.acao
    if (acao === 'continuar') retomar()
    else if (acao === 'comecar') iniciar(i)
    else if (acao === 'exercicios') iniciar(i, null, true)
  }
  linha.classList.add('aberta'); linha.append(c)
  c.querySelector('.btn')?.focus({ preventScroll: true })
  c.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}
document.addEventListener('click', e => { if (!e.target.closest('.cartao-licao, .no')) fecharCartao() })

// ---------- lição ----------
// A lição tem duas fases: "ensino" (cartões de explicação, pode pular) e "exercicios".
function iniciar(i, salvo = null, pularEnsino = false) {
  fecharCartao()
  const licao = LICOES[i]
  const fila = salvo
    ? salvo.fila.filter(k => typeof k === 'number' && k >= 0).map(k => licao.exercicios[k]).filter(Boolean)
    : [...licao.exercicios]
  if (!salvo) limparRascunhos(licao)
  const passo = salvo ? salvo.passo ?? null : pularEnsino ? null : 0
  L = {
    i, licao, fila, total: licao.exercicios.length,
    fase: passo == null ? 'exercicios' : 'ensino', passo: passo ?? 0,
    feitos: salvo?.feitos || 0, erros: salvo?.erros || 0, vidas: salvo?.vidas ?? 5, dicas: salvo?.dicas || 0,
    inicio: Date.now() - (salvo?.decorrido || 0), codigoFinal: salvo?.codigoFinal || null, estado: 'responder',
  }
  app.innerHTML = `<div class="licao">
    <header class="licao-topo">
      <button class="fechar" id="fechar" aria-label="Sair (o progresso fica salvo)" title="Sair (o progresso fica salvo)">✕</button>
      <div class="barra" role="progressbar" aria-label="Progresso da lição"><div id="barra"></div></div>
      <button class="topo-btn" id="teoria" title="Rever a teoria desta lição">📖 <span>Teoria</span></button>
      <div class="vidas" id="vidas" title="Vidas">❤️ ${L.vidas}</div>
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

function retomar() { const s = prog.emAndamento; if (s && LICOES[s.i]) iniciar(s.i, s) }
function sairDaLicao() { salvarAndamento(); toast('Progresso salvo. Continue quando quiser.'); renderHome() }

// guarda onde você está na lição (chamado a cada passo)
function salvarAndamento() {
  if (!L) return
  if (L.vidas <= 0) { prog.emAndamento = null; return salvarProgresso() }
  let fila = L.fila
  if (L.estado === 'feedback' && L.ultimoCerto === true) fila = fila.slice(1)
  else if (L.estado === 'feedback' && L.ultimoCerto === false && fila[0].tipo !== 'codigo') fila = [...fila.slice(1), fila[0]]
  prog.emAndamento = {
    i: L.i, passo: L.fase === 'ensino' ? L.passo : null, fila: fila.map(it => it.k), feitos: L.feitos, erros: L.erros,
    vidas: L.vidas, dicas: L.dicas, decorrido: Date.now() - L.inicio, codigoFinal: L.codigoFinal,
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
  $('#corpo').innerHTML = `<div class="corpo-in entrar">
    <div class="ensino-topo">
      <span class="etiqueta">📘 Aprenda · ${n + 1} de ${cartoes.length}</span>
      <div class="pontos" aria-hidden="true">${cartoes.map((_, k) => `<i class="${k < n ? 'visto' : k === n ? 'agora' : ''}"></i>`).join('')}</div>
    </div>
    <div class="dica">
      <div class="mascote">🐍</div>
      <div class="bolha">
        <h2>${esc(c.titulo)}</h2>
        ${c.texto}
        ${c.codigo ? htmlExemplo(c) : ''}
      </div>
    </div>
  </div>`
  $('#corpo').scrollTop = 0
  const r = $('#rodape'); r.className = 'rodape'
  r.innerHTML = rodapeIn(`<div class="rodape-esq">
      <button class="btn branco" id="pular-ensino" title="Ir direto para os exercícios">Pular explicação ⏭</button>
    </div>
    <div class="rodape-dir">
      ${n > 0 ? '<button class="btn branco" id="voltar-ensino" aria-label="Cartão anterior">← Voltar</button>' : ''}
      <button class="btn" id="principal">${ultimo ? 'Começar exercícios' : 'Continuar'}</button>
    </div>`)
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
  return `<div class="rotulo">Exemplo · mude e rode à vontade</div>
  ${digita ? `<div class="chips"><span class="chip">⌨️ O exemplo digita: ${digita}</span></div>` : ''}
  <div class="editor mini">
    <div class="editor-topo"><span>exemplo.py</span><button class="recomecar" id="ex-original" title="Voltar ao exemplo original">↺ Original</button></div>
    <textarea id="ex-editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Código do exemplo" rows="${c.codigo.split('\n').length + 1}">${esc(c.codigo)}</textarea>
  </div>
  <button class="btn azul mini" id="ex-rodar">▶ Rodar exemplo</button>
  <div class="saida" id="ex-saida" hidden><div class="saida-topo">Saída</div><pre id="ex-saida-texto"></pre></div>`
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
    b.disabled = false; b.textContent = '▶ Rodar de novo'
  }
}

function renderItem() {
  const it = L.fila[0]
  Object.assign(L, { estado: 'responder', resp: null, falhas: 0, viuResposta: false, sugestao: null, ultimaExec: null, ultimoCerto: null })
  let html = ''
  if (it.tipo === 'escolha') { L.ordem = embaralhar(it.opcoes.map((_, k) => k)); html = htmlEscolha(it) }
  else if (it.tipo === 'completar') html = htmlCompletar(it)
  else if (it.tipo === 'montar') { L.pecas = embaralhar([...it.certa, ...(it.extras || [])]).map((txt, id) => ({ txt, id })); L.montado = []; html = htmlMontar(it) }
  else if (it.tipo === 'codigo') html = htmlCodigo(it)
  const corpo = $('#corpo')
  corpo.innerHTML = `<div class="corpo-in entrar">${html}</div>`
  corpo.scrollTop = 0
  rodapeResponder(it)
  ligarItem(it)
  salvarAndamento()
}

// a teoria inteira da lição (todos os cartões do ensino), para consultar durante os exercícios
function htmlTeoria(l) {
  return `<small class="etiqueta">📖 Teoria · ${esc(l.titulo)}</small>
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
  <div class="saida" id="saida" hidden><div class="saida-topo" id="saida-topo">Saída</div><pre id="saida-texto"></pre></div>`
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
    $('#btn-dica').onclick = () => IA_ATIVA ? pedirDica(it) : abrirTeoria()
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
  ta.addEventListener('keydown', e => {
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
    <button class="modal-fechar" aria-label="Fechar">✕</button>${htmlTeoria(L.licao)}
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
const rodapeIn = html => `<div class="rodape-in">${html}</div>`

function rodapeResponder(it) {
  const r = $('#rodape'); r.className = 'rodape'; L.estado = 'responder'
  const pular = '<button class="btn branco" id="pular" title="Deixar para depois: o exercício volta no fim da lição">Pular ⏭</button>'
  if (it.tipo === 'codigo') r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="executar">▶ Executar</button></div>
    <button class="btn" id="principal">Verificar</button>`)
  else r.innerHTML = rodapeIn(`<div class="rodape-esq">${pular}<button class="btn branco" id="btn-dica-q" title="${IA_ATIVA ? 'A Py dá uma pista sem entregar a resposta' : 'Rever a teoria da lição'}">💡 Dica</button></div>
    <button class="btn" id="principal" disabled>Verificar</button>`)
  $('#principal').onclick = verificar
  $('#pular').onclick = pularExercicio
  const ex = $('#executar'); if (ex) ex.onclick = () => executarLivre(it)
  const dq = $('#btn-dica-q'); if (dq) dq.onclick = () => IA_ATIVA ? dicaQuestao(it) : abrirTeoria()
}

// pular não custa vida: o exercício só vai para o fim da fila
function pularExercicio() {
  if (L.fila.length === 1) { toast('É o último exercício. Tente, ou peça uma 💡 dica.'); return }
  L.fila.push(L.fila.shift())
  toast('Exercício pulado. Ele volta no fim da lição.')
  proximo()
}

function rodapeFeedback(certo, titulo, detalhe, extras = '', rotulo = 'Continuar') {
  const r = $('#rodape'); r.className = 'rodape ' + (certo ? 'certo' : 'errado')
  r.innerHTML = rodapeIn(`<div class="fb"><div class="fb-ico">${certo ? '✓' : '✕'}</div>
    <div><h3>${titulo}</h3>${detalhe ? `<p>${detalhe}</p>` : ''}</div></div>
    <div class="fb-acoes">${extras}<button class="btn ${certo ? '' : 'vermelho'}" id="principal">${rotulo}</button></div>`)
  $('#principal').focus({ preventScroll: true })
}

const ELOGIOS = ['Mandou bem!', 'Isso aí!', 'Perfeito!', 'Correto!', 'Boa!']
const elogio = () => ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]
function atualizarBarra() { const b = $('#barra'); if (b) b.style.width = (100 * L.feitos / L.total) + '%' }

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
  if (certo) {
    somCerto(); L.feitos++; atualizarBarra()
    rodapeFeedback(true, elogio(), it.explica || '')
    $('#principal').onclick = () => { L.fila.shift(); proximo() }
  } else {
    somErro(); L.erros++; L.vidas--
    const v = $('#vidas'); v.textContent = '❤️ ' + L.vidas; v.classList.remove('tremer'); void v.offsetWidth; v.classList.add('tremer')
    const semVidas = L.vidas <= 0
    rodapeFeedback(false, 'Resposta certa:', correta + (it.explica ? `<br>${it.explica}` : ''),
      (IA_ATIVA ? '<button class="btn branco" id="explicar">💬 Explicar</button>' : '') +
      (semVidas ? '' : '<button class="btn branco" id="refazer" title="Fazer este exercício de novo agora">↻ Tentar de novo</button>'))
    const ex = $('#explicar'); if (ex) ex.onclick = () => explicarErro(it)
    const rf = $('#refazer'); if (rf) rf.onclick = () => renderItem()   // mesmo exercício, peças/opções embaralhadas de novo
    $('#principal').onclick = () => { L.fila.push(L.fila.shift()); semVidas ? renderSemVidas() : proximo() }
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
    return { ok: false, saida: '', erro: 'Não consegui falar com o servidor. Ele está rodando? (python -m uvicorn server:app --port 8080)' }
  }
}

function mostrarSaida(r, rotulo) {
  $('#saida').hidden = false
  $('#saida-topo').textContent = rotulo || 'Saída'
  let html = esc(r.saida || '')
  if (r.erro) html += `<span class="err">${r.saida && !r.saida.endsWith('\n') ? '\n' : ''}${esc(r.erro)}</span>`
  $('#saida-texto').innerHTML = html || '<span class="vazio">(nada foi mostrado na tela)</span>'
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
    else if (c.espera && !saida.includes(padrao(c.espera))) falha = `A saída deveria mostrar "${c.espera}"${quando}.`
    else { const p = (c.proibido || []).find(p => saida.includes(padrao(p))); if (p) falha = `Não deveria aparecer "${p}"${quando}.` }
    if (falha) break
  }

  L.estado = 'feedback'; L.ultimoCerto = !falha
  if (!falha) {
    somCerto(); L.feitos++; atualizarBarra()
    $('#editor').readOnly = true
    if (it.final) L.codigoFinal = codigo
    descartarSugestao()
    rodapeFeedback(true, L.viuResposta ? 'Passou!' : elogio(),
      L.viuResposta ? 'Agora leia a solução linha por linha e tente refazer sozinho depois.' : 'Seu código passou em todos os testes.',
      IA_ATIVA ? '<button class="btn branco" id="melhorar">🧠 Como melhorar?</button>' : '')
    const m = $('#melhorar'); if (m) m.onclick = () => pedirRevisao(it)
    $('#principal').onclick = () => { L.fila.shift(); proximo() }
  } else {
    somErro(); L.falhas++
    const ajuda = L.falhas === 1 ? '<br>Corrija e tente de novo. Aqui você não perde vida.' : '<br>Travou? Peça uma 💡 dica ou use 👀 Ver resposta.'
    rodapeFeedback(false, 'Ainda não', esc(falha) + ajuda, '<button class="btn branco" id="dica-falha">💡 Dica</button>', 'Tentar de novo')
    $('#principal').onclick = () => { rodapeResponder(it); $('#editor').focus() }
    $('#dica-falha').onclick = () => IA_ATIVA ? pedirDica(it) : abrirTeoria()
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
function renderSemVidas() {
  const i = L.i
  prog.emAndamento = null; limparRascunhos(L.licao); salvarProgresso()
  app.innerHTML = `<main class="resultado">
    <div class="trofeu">💔</div>
    <h1 style="color:var(--vermelho-esc)">Acabaram as vidas</h1>
    <p>Errar faz parte. Releia a teoria com calma e tente de novo.</p>
    <p></p>
    <button class="btn largo" id="denovo">Tentar de novo</button>
    <button class="link" id="voltar">Voltar para a trilha</button>
  </main>`
  $('#denovo').onclick = () => iniciar(i)
  $('#voltar').onclick = renderHome
  $('#denovo').focus()
}

async function concluir() {
  const l = L.licao
  const jaFeita = !!prog.feitas[l.id]
  const xp = jaFeita ? 5 : (l.final ? 30 : 10) + (L.erros === 0 ? 5 : 0)
  ganharXP(xp); prog.feitas[l.id] = true; marcarDia()
  prog.emAndamento = null; limparRascunhos(l); salvarProgresso()
  let arquivo = null
  if (L.codigoFinal) {
    try {
      const r = await fetch('/salvar', { method: 'POST', headers: HEADERS, body: JSON.stringify({ codigo: L.codigoFinal }) })
      arquivo = (await r.json()).arquivo
    } catch {}
  }
  const seg = Math.round((Date.now() - L.inicio) / 1000)
  const tempo = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`
  const precisao = Math.round(100 * L.total / (L.total + L.erros))
  const hoje = xpDeHoje()
  somFim()
  app.innerHTML = `${confete()}
  <main class="resultado">
    <div class="trofeu">${l.final ? '🏆' : '🎉'}</div>
    <h1>${l.final ? 'Você construiu um Jokenpô!' : 'Lição concluída!'}</h1>
    <p>${L.erros === 0 ? 'Lição perfeita, sem perder nenhuma vida! +5 XP de bônus.' : `Você aprendeu: ${esc(l.aprende)}.`}</p>
    <div class="cartoes">
      <div class="cartao" style="--c:var(--ouro)"><small>XP ganho</small><b>⚡ ${xp}</b></div>
      <div class="cartao" style="--c:var(--verde)"><small>Precisão</small><b>🎯 ${precisao}%</b></div>
      <div class="cartao" style="--c:var(--azul)"><small>Tempo</small><b>⏱ ${tempo}</b></div>
    </div>
    <p class="resumo-meta">🎯 Meta do dia: ${Math.min(hoje, META_DIARIA)}/${META_DIARIA} XP${hoje >= META_DIARIA ? ' ✓' : ''} · 🔥 ${sequencia()} ${sequencia() === 1 ? 'dia seguido' : 'dias seguidos'}${L.dicas ? ` · 💡 ${L.dicas} ${L.dicas === 1 ? 'dica' : 'dicas'}` : ''}</p>
    ${l.final ? htmlJogar(arquivo) : ''}
    <button class="btn largo" id="cont">Continuar</button>
    <button class="btn branco largo" id="denovo">↻ Fazer de novo</button>
  </main>`
  const i = L.i
  $('#cont').onclick = renderHome
  $('#denovo').onclick = () => iniciar(i)
  $('#cont').focus()
}

function htmlJogar(arquivo) {
  return `<div class="caixa-fim">
    <h3>🎮 Jogue o seu jogo no terminal</h3>
    <p>${arquivo ? `Seu código foi salvo em <code>${esc(arquivo)}</code>.` : 'Quando você passa no projeto final, seu código é salvo em <code>jokenpo/meu_jokenpo.py</code>.'} Abra um terminal e rode:</p>
    <pre class="cod">cd jokenpo
python meu_jokenpo.py</pre>
    <p>A versão de referência está em <code>jokenpo/jokenpo.py</code>. Compare as duas.</p>
  </div>`
}

function renderFim() {
  app.innerHTML = `${topo()}
  <main class="resultado">
    <div class="trofeu">🏆</div>
    <h1>Jokenpô completo!</h1>
    <p>Tudo isso você já usa em Python:</p>
    <div class="aprendeu">${LICOES.map(l => `<span>${l.icone} ${esc(l.aprende)}</span>`).join('')}</div>
    ${htmlJogar(null)}
    <div class="caixa-fim">
      <h3>🚀 Próximos desafios</h3>
      <ol>
        <li>Melhor de 3: o jogo acaba quando alguém fizer 2 pontos.</li>
        <li>Mostre emojis: ✊ pedra, ✋ papel, ✌️ tesoura (dica: outro dicionário).</li>
        <li>Adicione lagarto e Spock. Dica: em <code>vence</code>, o valor vira uma lista e você usa <code>in</code>.</li>
      </ol>
    </div>
    <button class="btn largo" id="voltar">Voltar para a trilha</button>
  </main>`
  ligarSom()
  $('#voltar').onclick = renderHome
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
