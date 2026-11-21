MODULOS.push({
  id: 'react-efeitos',
  titulo: 'Efeitos',
  icone: '⚡',
  aprende: 'useEffect para sincronizar com sistemas externos, dependências, limpeza, StrictMode e fetch com AbortController',
  porque: 'useEffect mal usado é a fonte nº 1 de loops, requisições duplicadas e vazamentos em apps React.',
  gancho: {
    titulo: 'A requisição em dobro',
    pergunta: 'App em dev com <code>&lt;StrictMode&gt;</code>. Quantas vezes o log aparece ao abrir a tela?',
    linguagem: 'tsx',
    codigo: `useEffect(() => {
  console.log('buscando assistidos')
  fetch('/api/assistidos')
}, [])`,
    opcoes: ['1: o array vazio garante', '2', 'Uma por render, sem parar'],
    certa: 1,
    revelacao: 'Em desenvolvimento, o StrictMode monta, desmonta e monta de novo o componente de propósito, para expor efeitos sem limpeza; em produção roda uma vez. Nesta lição você vai ver o que é um efeito de verdade, como escrever a limpeza (com <code>AbortController</code> no fetch) e quando você nem precisa de efeito.',
  },
  resumo: [
    `<code>useEffect</code> roda <b>depois</b> que a tela é pintada, para <b>sincronizar</b> com algo fora do React`,
    `O array de dependências diz quando ressincronizar: <code>[]</code> só ao montar; <code>[id]</code> quando <code>id</code> muda; sem array, a cada render`,
    `Devolva uma função de <b>limpeza</b>: ela roda antes do próximo efeito e ao desmontar`,
    `Em dev, o <b>StrictMode</b> monta, desmonta e monta de novo: o efeito roda 2x para revelar limpeza faltando`,
    `Cálculo a partir de estado ou reação a um clique <b>não</b> é efeito: faça no render ou no handler`,
    `Em fetch, use <code>AbortController</code> na limpeza para cancelar respostas que chegam fora de ordem`,
  ],
  ensino: [
    { titulo: 'Efeito = sincronizar com algo externo',
      texto: `<p>O render deve ser puro. Mas às vezes o componente precisa conversar com o mundo de fora: título da aba, WebSocket, timer, widget de terceiros, requisição. <code>useEffect</code> roda esse código <b>depois</b> que o React atualizou a tela.</p>
<p>Pense em "sincronizar", não em "ciclo de vida". A pergunta não é "o que fazer ao montar?", e sim "com que sistema externo este componente precisa ficar em sincronia, dado o estado atual?".</p>
<p><b>No NestJS:</b> é parecido com <code>onModuleInit</code>/<code>onModuleDestroy</code>, só que reexecutado sempre que os dados de que ele depende mudam.</p>`,
      linguagem: 'tsx',
      codigo: `import { useEffect } from 'react'

function TituloAba({ pendentes }: { pendentes: number }) {
  useEffect(() => {
    document.title = pendentes > 0 ? \`(\${pendentes}) Painel\` : 'Painel'
  }, [pendentes])

  return null
}` },
    { titulo: 'Dependências e limpeza',
      texto: `<p>O segundo argumento lista <b>todos os valores reativos</b> (props, estado, valores calculados a partir deles) que o efeito lê. O React compara cada um com <code>Object.is</code> e só reexecuta se algo mudou. Sem array, roda a cada render; com <code>[]</code>, só na montagem.</p>
<p>Não "minta" nas dependências para evitar execuções: o efeito passa a usar valores antigos (stale closure). Instale o lint <code>eslint-plugin-react-hooks</code>; a regra <code>exhaustive-deps</code> aponta o que falta.</p>
<p>A função devolvida é a <b>limpeza</b>. Ela roda antes de cada nova execução e quando o componente sai da tela. Todo <code>subscribe</code>, <code>setInterval</code> e <code>addEventListener</code> precisa do seu par.</p>`,
      linguagem: 'tsx',
      codigo: `function FilaAoVivo({ filaId }: { filaId: string }) {
  const [ultimo, setUltimo] = useState<string | null>(null)

  useEffect(() => {
    const ws = new WebSocket(\`wss://api.exemplo.gov.br/filas/\${filaId}\`)
    ws.onmessage = e => setUltimo(e.data)

    return () => ws.close()   // troca de fila ou saída da tela: fecha a conexão
  }, [filaId])

  return <p>Último evento: {ultimo ?? '—'}</p>
}` },
    { titulo: 'StrictMode: por que roda duas vezes',
      texto: `<p>Em desenvolvimento, com <code>&lt;StrictMode&gt;</code>, o React monta o componente, <b>desmonta e monta de novo</b> logo em seguida. Você vê o efeito rodar 2x e duas requisições na aba Network. Em produção isso não acontece.</p>
<p>É proposital: simula o usuário saindo e voltando para a tela. Se o efeito tem limpeza correta, a sequência <b>efeito → limpeza → efeito</b> deixa tudo igual a uma execução só. Se aparecem dois intervals, duas conexões ou um contador dobrado, o bug é a <b>limpeza faltando</b>.</p>
<p>A correção nunca é "desligar o StrictMode" nem usar um <code>useRef</code> para "rodar só uma vez".</p>`,
      linguagem: 'tsx',
      codigo: `useEffect(() => {
  const id = setInterval(() => setSegundos(s => s + 1), 1000)
  return () => clearInterval(id)   // sem isto, o StrictMode deixa 2 intervals vivos
}, [])` },
    { titulo: 'Você talvez não precise de um efeito',
      texto: `<p>Se não há sistema externo envolvido, provavelmente não é efeito. Casos clássicos que <b>não</b> precisam:</p>
<ul><li><b>Transformar dados para exibir</b> (filtrar, somar, formatar): calcule no render.</li>
<li><b>Reagir a uma ação do usuário</b> (enviar formulário, mostrar toast após salvar): faça no handler do evento. O efeito não sabe <i>por que</i> o estado mudou.</li>
<li><b>Resetar estado quando uma prop muda</b>: passe <code>key</code> ao componente, que o React recria do zero.</li></ul>
<p>Efeito que só chama <code>setX</code> a partir de outro estado é sinal de alerta: gera uma renderização extra com dado desatualizado e cascatas difíceis de depurar.</p>`,
      linguagem: 'tsx',
      codigo: `// ❌ efeito para derivar estado
const [visiveis, setVisiveis] = useState<Tarefa[]>([])
useEffect(() => {
  setVisiveis(tarefas.filter(t => t.status === filtro))
}, [tarefas, filtro])

// ✅ cálculo no render
const visiveis = tarefas.filter(t => t.status === filtro)

// ✅ resetar o formulário ao trocar de tarefa
<EditorTarefa key={tarefaId} tarefaId={tarefaId} />` },
    { titulo: 'fetch com AbortController',
      texto: `<p>Buscar dados num efeito tem uma armadilha: <b>condição de corrida</b>. O usuário troca da tarefa 1 para a 2; a resposta da 1 chega depois da 2 e sobrescreve a tela com o dado errado.</p>
<p>A limpeza resolve: crie um <code>AbortController</code>, passe o <code>signal</code> ao <code>fetch</code> e aborte na limpeza. O fetch cancelado rejeita com <code>AbortError</code>, que você ignora. Isso também cancela a requisição duplicada do StrictMode.</p>
<p>Lembre que <code>fetch</code> só rejeita em falha de rede: status 404 ou 500 precisa de <code>if (!res.ok)</code>. Em app real, prefira uma biblioteca como TanStack Query (módulo de dados), que já trata cache, corrida e repetição.</p>`,
      linguagem: 'tsx',
      codigo: `useEffect(() => {
  const controller = new AbortController()

  fetch(\`/api/tarefas/\${tarefaId}\`, { signal: controller.signal })
    .then(res => {
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      return res.json()
    })
    .then(setTarefa)
    .catch(err => {
      if (err.name !== 'AbortError') setErro(err)
    })

  return () => controller.abort()
}, [tarefaId])` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Quando roda um efeito com array de dependências <code>[]</code>?',
      opcoes: [
        'Depois da primeira renderização (montagem), e a limpeza ao desmontar',
        'Antes da primeira renderização',
        'A cada renderização',
        'Nunca, array vazio desativa o efeito',
      ],
      certa: 0,
      dicas: ['Nenhuma dependência para mudar.', 'Efeitos rodam depois da pintura.'],
      explica: `Sem dependências, não há o que mudar: o efeito roda uma vez após montar (em dev com StrictMode, monta-desmonta-monta). Sem o array é que rodaria a cada render.` },
    { tipo: 'escolha',
      pergunta: 'Em desenvolvimento, o log aparece duas vezes e há duas requisições na aba Network. O que está acontecendo?',
      codigo: `useEffect(() => {
  console.log('buscando fila')
  fetch('/api/fila')
}, [])`,
      opcoes: [
        'StrictMode monta, desmonta e monta de novo para expor limpeza faltando',
        'Bug do React 19 que será corrigido',
        'O array vazio faz rodar duas vezes',
        'O componente está duplicado na árvore',
      ],
      certa: 0,
      dicas: ['Só acontece em dev.', 'Pense em &lt;StrictMode&gt; no main.tsx.'],
      explica: `É comportamento intencional do StrictMode em desenvolvimento. A resposta certa é ter limpeza (abortar o fetch), não suprimir a segunda execução.` },
    { tipo: 'completar',
      pergunta: 'Complete a limpeza do intervalo:',
      codigo: `useEffect(() => {
  const id = setInterval(atualizarRelogio, 1000)
  [[0]] () => [[1]](id)
}, [])`,
      respostas: [['return'], ['clearInterval']],
      dicas: ['A limpeza é o valor devolvido pelo efeito.', 'Qual função cancela um setInterval?'],
      explica: `O efeito devolve a função de limpeza; o React a chama ao desmontar (e no ciclo extra do StrictMode).` },
    { tipo: 'escolha',
      pergunta: 'Qual o problema deste efeito?',
      codigo: `useEffect(() => {
  carregarTarefas(responsavelId)
}, [])`,
      opcoes: [
        'Falta responsavelId nas dependências: ao trocar de responsável, nada recarrega',
        'Efeitos não podem chamar funções',
        'Deveria ser useLayoutEffect',
        'Nenhum, [] é o recomendado para fetch',
      ],
      certa: 0,
      dicas: ['O efeito lê algum valor reativo?', 'O lint exhaustive-deps reclamaria.'],
      explica: `Todo valor reativo lido no efeito entra nas dependências. Com <code>[]</code>, o efeito fica preso ao <code>responsavelId</code> da primeira renderização.` },
    { tipo: 'escolha',
      pergunta: 'Depois de salvar uma tarefa, você quer mostrar um toast "Salvo!". Onde colocar a chamada?',
      opcoes: [
        'No handler do submit, logo após o salvamento dar certo',
        'Num useEffect que observa a lista de tarefas',
        'Num useEffect com array vazio',
        'No corpo do componente, durante o render',
      ],
      certa: 0,
      dicas: ['O que causou o toast: um dado mudar ou uma ação do usuário?', 'O efeito não sabe por que o estado mudou.'],
      explica: `Lógica disparada por evento vai no handler. Um efeito observando a lista também dispararia o toast quando a lista muda por outros motivos (carga inicial, outro usuário).` },
    { tipo: 'montar',
      pergunta: 'Monte o fetch cancelável:',
      certa: ['const controller = new AbortController()', "fetch(url, { signal: controller.signal })", 'return () => controller.abort()'],
      extras: ['controller.abort()', 'return controller.signal', "fetch(url, { abort: true })"],
      dicas: ['Crie, passe o sinal, aborte na limpeza.', 'A limpeza é uma função devolvida.'],
      explica: `O <code>signal</code> liga o fetch ao controller; abortar na limpeza cancela a requisição antiga quando a dependência muda ou o componente sai da tela.` },
    { tipo: 'escolha',
      pergunta: 'O usuário clica rápido na tarefa 1 e depois na 2. A resposta da 1 chega por último. Sem limpeza, o que aparece?',
      opcoes: [
        'Os dados da tarefa 1, embora a 2 esteja selecionada',
        'Os dados da tarefa 2',
        'Um erro de AbortError',
      ],
      certa: 0,
      dicas: ['Quem chama setTarefa por último vence.', 'Nada impede a resposta velha de gravar.'],
      explica: `É a condição de corrida: o último <code>setTarefa</code> é da requisição antiga. Abortar (ou marcar como ignorada) na limpeza resolve.` },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: quando você usa <code>useEffect</code> e quando evita?',
      avalia: `Se a pessoa vê efeito como sincronização com sistema externo, e não como "ciclo de vida" ou "observador de estado".`,
      resposta: `<p>Uso efeito para sincronizar o componente com algo fora do React: assinar WebSocket, timer, API do navegador, widget de terceiros, e às vezes buscar dados. Listo todas as dependências reativas e sempre escrevo a limpeza, que o StrictMode testa em dev rodando o ciclo duas vezes.</p>
<p>Evito para derivar dados (calculo no render), para reagir a ações do usuário (faço no handler) e para resetar estado quando uma prop muda (uso key). E, para dados de servidor, prefiro uma biblioteca como TanStack Query a fetch manual no efeito.</p>`,
      pontos: ['sincronizar com sistema externo', 'dependências completas', 'limpeza e StrictMode', 'derivado no render, evento no handler', 'biblioteca para dados de servidor'],
      evitar: ['tratar useEffect como componentDidMount', 'omitir dependências para rodar menos'],
      dicas: ['Comece pela definição: sincronizar.', 'Dê dois exemplos de quando não usar.'] },
  ],
})
