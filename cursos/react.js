// Gerado por ferramentas/gerar_cursos.py a partir de conteudo/react/. Não edite à mão.
(() => {
const MODULOS = []
const CURSO = {
  kicker: 'React',
  titulo: 'Interfaces com <em>React</em>: componentes, estado e dados de verdade.',
  subtitulo: 'Do JSX ao app que busca dados de uma API. Cada módulo termina com um pedaço de um painel de tarefas.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Pensar em componentes', tipo: 'pedra', ids: ['react-jsx', 'react-props'] },
    { titulo: 'Estado e efeitos', tipo: 'papel', ids: ['react-estado', 'react-efeitos', 'react-formularios'] },
    { titulo: 'App de verdade', tipo: 'tesoura', ids: ['react-hooks', 'react-dados'] },
  ],
  vaga: [
    { texto: 'Escrever componentes com JSX e compor a tela em partes pequenas', modulos: ['react-jsx', 'react-props'] },
    { texto: 'Controlar estado com useState sem mutar objetos e listas', modulos: ['react-estado'] },
    { texto: 'Usar useEffect na medida certa (e saber quando não usar)', modulos: ['react-efeitos'] },
    { texto: 'Construir formulários controlados com validação', modulos: ['react-formularios'] },
    { texto: 'Extrair hooks próprios e compartilhar estado com Context', modulos: ['react-hooks'] },
    { texto: 'Buscar e atualizar dados de uma API com carregamento e erro', modulos: ['react-dados'], diferencial: true },
  ],
}

// ---- 01-react-jsx.js
MODULOS.push({
  id: 'react-jsx',
  titulo: 'JSX e componentes',
  icone: '🧩',
  aprende: 'JSX, componentes como funções, expressões entre chaves, className, fragmentos e renderização condicional',
  porque: 'Toda tela React é uma árvore de componentes escritos em JSX; sem esse modelo mental, o resto não encaixa.',
  resumo: [
    `JSX é <b>açúcar sintático</b> para chamadas de função: vira <code>jsx('div', props)</code>, não HTML`,
    `Componente é uma <b>função</b> que recebe props e devolve JSX; o nome começa com <b>maiúscula</b>`,
    `Entre <code>{ }</code> cabe qualquer <b>expressão</b> JavaScript, mas não <code>if</code> nem <code>for</code>`,
    `Atributos seguem o DOM: <code>className</code>, <code>htmlFor</code>, <code>onClick</code> em camelCase`,
    `Um componente devolve <b>um</b> elemento raiz; use <code>&lt;&gt;...&lt;/&gt;</code> (fragmento) para não criar div à toa`,
    `Condicional: <code>cond ? a : b</code>, <code>cond &amp;&amp; a</code> ou <code>return null</code>; cuidado com <code>0 &amp;&amp; ...</code>`,
  ],
  ensino: [
    { titulo: 'JSX é JavaScript, não HTML',
      texto: `<p>JSX parece HTML, mas o compilador (Babel, SWC, esbuild) transforma cada tag numa <b>chamada de função</b> que cria um objeto: o "elemento React". <code>&lt;h1 className="titulo"&gt;Tarefas&lt;/h1&gt;</code> vira algo como <code>jsx('h1', { className: 'titulo', children: 'Tarefas' })</code>.</p>
<p>Consequência: JSX é um <b>valor</b>. Dá para guardar em variável, passar como argumento, devolver de função e colocar em array. Não existe "template" separado com linguagem própria; a lógica é JavaScript puro.</p>
<p><b>No NestJS/TypeScript:</b> pense num DTO literal. O componente não manipula o DOM; ele <b>descreve</b> o que deve aparecer, e o React compara a descrição nova com a anterior e aplica só a diferença.</p>`,
      linguagem: 'tsx',
      codigo: `const titulo = <h1 className="titulo">Painel de tarefas</h1>

// o compilador gera algo equivalente a:
// const titulo = jsx('h1', { className: 'titulo', children: 'Painel de tarefas' })` },
    { titulo: 'Componente é uma função',
      texto: `<p>Um componente é uma função que devolve JSX. O React a chama sempre que precisa saber o que mostrar: na primeira renderização e a cada mudança de estado ou props. Por isso ela deve ser <b>pura</b>: mesma entrada, mesma saída, sem efeitos colaterais no corpo.</p>
<p>O nome <b>precisa começar com maiúscula</b>. <code>&lt;cartao /&gt;</code> em minúscula é tratado como tag HTML desconhecida; <code>&lt;Cartao /&gt;</code> é o seu componente.</p>
<p>Não chame o componente como função comum (<code>Cartao()</code>) dentro de outro: use sempre <code>&lt;Cartao /&gt;</code>, para o React controlar o ciclo de vida e o estado dele.</p>`,
      linguagem: 'tsx',
      codigo: `function CabecalhoPainel() {
  return <h1>Quadro de atendimentos</h1>
}

export default function App() {
  return (
    <main>
      <CabecalhoPainel />
    </main>
  )
}` },
    { titulo: 'Chaves: expressões dentro do JSX',
      texto: `<p>Entre <code>{ }</code> você escreve qualquer <b>expressão</b> JavaScript: variável, chamada de função, ternário, template string. Instruções como <code>if</code>, <code>for</code> e <code>const</code> não cabem ali, porque não produzem valor.</p>
<p>Atributos usam os nomes da API do DOM em camelCase: <code>className</code> (não <code>class</code>, palavra reservada), <code>htmlFor</code>, <code>onClick</code>, <code>tabIndex</code>. O atributo <code>style</code> recebe um <b>objeto</b>, por isso as chaves duplas: <code>style={{ color: 'red' }}</code>.</p>
<p>Texto vindo de variável é <b>escapado automaticamente</b>: um título com <code>&lt;script&gt;</code> aparece como texto, não executa. Isso protege contra XSS por padrão.</p>`,
      linguagem: 'tsx',
      codigo: `function ResumoPainel() {
  const abertas = 7
  const responsavel = 'Ana'
  return (
    <p className="resumo" style={{ fontWeight: 600 }}>
      {responsavel} tem {abertas} tarefas abertas ({\`\${abertas * 10}%\`} da meta)
    </p>
  )
}` },
    { titulo: 'Fragmentos: devolver vários elementos',
      texto: `<p>Uma função devolve um único valor, então o componente devolve <b>um</b> elemento raiz. Dois irmãos soltos não compilam ("Adjacent JSX elements must be wrapped in an enclosing tag").</p>
<p>Em vez de embrulhar tudo numa <code>&lt;div&gt;</code> que só polui o DOM (e quebra layouts com flex ou grid, ou tabelas), use o <b>fragmento</b> <code>&lt;&gt;...&lt;/&gt;</code>. Ele agrupa sem gerar nada no HTML.</p>
<p>Quando precisar de <code>key</code> num fragmento (dentro de um <code>map</code>), use a forma longa <code>&lt;Fragment key={...}&gt;</code>, importada de <code>react</code>.</p>`,
      linguagem: 'tsx',
      codigo: `function LinhaTarefa() {
  return (
    <>
      <td>Corrigir login</td>
      <td>Em andamento</td>
    </>
  )
}` },
    { titulo: 'Renderização condicional',
      texto: `<p>Como <code>if</code> não cabe dentro do JSX, existem três formas comuns: <b>ternário</b> (<code>cond ? &lt;A /&gt; : &lt;B /&gt;</code>), <b>curto-circuito</b> (<code>cond &amp;&amp; &lt;A /&gt;</code>) e <b>retorno antecipado</b> com <code>if</code> antes do <code>return</code>. Devolver <code>null</code> não mostra nada.</p>
<p><b>Pegadinha clássica:</b> <code>{tarefas.length &amp;&amp; &lt;Lista /&gt;}</code>. Se a lista está vazia, <code>0 &amp;&amp; ...</code> vale <code>0</code>, e o React <b>mostra o número 0</b> na tela (ele ignora <code>false</code>, <code>null</code> e <code>undefined</code>, mas não números). Use <code>tarefas.length &gt; 0 &amp;&amp; ...</code>.</p>`,
      linguagem: 'tsx',
      codigo: `function Contador({ urgentes }: { urgentes: number }) {
  if (urgentes === 0) return <p>Nada urgente hoje 🎉</p>

  return (
    <p>
      {urgentes} urgentes
      {urgentes > 5 && <strong> (acima do limite!)</strong>}
    </p>
  )
}` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'O que o compilador faz com <code>&lt;h1&gt;Tarefas&lt;/h1&gt;</code>?',
      opcoes: [
        'Transforma numa chamada de função que cria um objeto (elemento React)',
        'Insere a string HTML direto no DOM com innerHTML',
        'Mantém como HTML e o navegador interpreta',
        'Gera um template que o React compila no navegador',
      ],
      certa: 0,
      dicas: ['JSX não é entendido pelo navegador.', 'Pense em <code>jsx(tipo, props)</code>.'],
      explica: `JSX é açúcar para <code>jsx()</code>/<code>createElement()</code>, que devolve um objeto descrevendo a UI. O React nunca usa innerHTML para isso; por isso o texto é escapado e o JSX pode ser guardado em variáveis.` },
    { tipo: 'escolha',
      pergunta: 'Por que este componente não aparece na tela?',
      codigo: `function cartaoTarefa() {
  return <div>Corrigir login</div>
}

export default function App() {
  return <cartaoTarefa />
}`,
      opcoes: [
        'Nome em minúscula: o React trata como tag HTML desconhecida',
        'Falta importar React no topo do arquivo',
        'Componentes precisam ser arrow functions',
        'Falta o fragmento em volta da div',
      ],
      certa: 0,
      dicas: ['Compare <code>&lt;div&gt;</code> com <code>&lt;Botao&gt;</code>.', 'A primeira letra decide se é HTML ou componente.'],
      explica: `Tag em minúscula vira string (<code>'cartaoTarefa'</code>), um elemento HTML inexistente. Com o JSX transform moderno (React 17+), não é preciso importar React para usar JSX.` },
    { tipo: 'completar',
      pergunta: 'Complete o JSX: classe CSS e rótulo ligado ao input.',
      codigo: `<div [[0]]="campo">
  <label [[1]]="titulo">Título</label>
  <input id="titulo" />
</div>`,
      respostas: [['className'], ['htmlFor']],
      dicas: ['JSX usa os nomes de propriedade do DOM, não do HTML.', '<code>class</code> e <code>for</code> são palavras reservadas em JavaScript.'],
      explica: `No DOM, as propriedades são <code>element.className</code> e <code>label.htmlFor</code>; o JSX segue esses nomes.` },
    { tipo: 'escolha',
      pergunta: 'Com <code>tarefas = []</code>, o que aparece na tela?',
      codigo: `<section>
  {tarefas.length && <ListaTarefas itens={tarefas} />}
</section>`,
      opcoes: ['O número 0', 'Nada', 'Uma lista vazia', 'Erro de renderização'],
      certa: 0,
      dicas: ['Quanto vale <code>0 &amp;&amp; qualquerCoisa</code>?', 'O React ignora false, null e undefined. E números?'],
      explica: `<code>0 &amp;&amp; x</code> vale <code>0</code>, e o React renderiza números. "Nada" seria a resposta com <code>tarefas.length &gt; 0 &amp;&amp; ...</code> ou um ternário.` },
    { tipo: 'montar',
      pergunta: 'Monte a linha que mostra o selo só quando a tarefa é urgente:',
      certa: ['{tarefa.urgente', '&&', '<Selo texto="Urgente" />', '}'],
      extras: ['if', '||', '?'],
      dicas: ['Dentro das chaves só cabe expressão.', 'Curto-circuito: se o lado esquerdo for falso, para ali.'],
      explica: `<code>urgente</code> é booleano, então <code>&amp;&amp;</code> é seguro aqui (false não aparece). <code>||</code> mostraria o selo quando NÃO é urgente; <code>if</code> não é expressão.` },
    { tipo: 'escolha',
      pergunta: 'Qual a melhor forma de devolver duas <code>&lt;td&gt;</code> de um componente usado dentro de <code>&lt;tr&gt;</code>?',
      opcoes: [
        'Embrulhar num fragmento <></>',
        'Embrulhar numa <div>',
        'Devolver um array sem keys',
        'Devolver as duas tags lado a lado, sem nada em volta',
      ],
      certa: 0,
      opcoesCodigo: false,
      dicas: ['Uma <code>&lt;div&gt;</code> dentro de <code>&lt;tr&gt;</code> é HTML inválido.', 'Existe um agrupador que não gera nó no DOM.'],
      explica: `O fragmento agrupa sem criar elemento. A div quebraria a tabela (e o React avisa sobre aninhamento inválido); tags lado a lado não compilam; array sem key gera aviso.` },
    { tipo: 'completar',
      pergunta: 'Complete o ternário que mostra o status:',
      codigo: `<span>{tarefa.concluida [[0]] 'Feita' [[1]] 'Pendente'}</span>`,
      respostas: [['?'], [':']],
      dicas: ['É o operador condicional do JavaScript.', '<code>cond ? a : b</code>'],
      explica: `O ternário é expressão, por isso cabe entre chaves; é a forma usual de escolher entre dois elementos ou textos.` },
    { tipo: 'escolha',
      pergunta: 'Um título de tarefa vem da API como <code>"&lt;img src=x onerror=alert(1)&gt;"</code> e é renderizado com <code>{tarefa.titulo}</code>. O que acontece?',
      opcoes: [
        'Aparece como texto; o React escapa strings',
        'O script executa: é XSS',
        'O React lança erro por HTML inválido',
      ],
      certa: 0,
      dicas: ['O React nunca interpreta strings como HTML por padrão.', 'Existe uma prop com nome assustador para forçar HTML.'],
      explica: `Strings em <code>{ }</code> viram nós de texto. Só <code>dangerouslySetInnerHTML</code> injeta HTML, e o nome existe justamente para você pensar duas vezes.` },
  ],
})

// ---- 02-react-props.js
MODULOS.push({
  id: 'react-props',
  titulo: 'Props e listas',
  icone: '📦',
  aprende: 'props, children, desestruturação, listas com map e key, composição e props tipadas com TypeScript',
  porque: 'Props são o contrato entre componentes: telas grandes só ficam manuteníveis quando cada peça recebe exatamente o que precisa.',
  resumo: [
    `Props são os <b>argumentos</b> do componente: um objeto só de leitura, passado de pai para filho`,
    `Desestruture na assinatura: <code>function Cartao({ titulo, prioridade = 'media' })</code>`,
    `<code>children</code> é o que vai entre as tags: <code>&lt;Painel&gt;...&lt;/Painel&gt;</code>`,
    `Listas: <code>itens.map(t =&gt; &lt;Item key={t.id} ... /&gt;)</code>; a key é <b>estável e única entre irmãos</b>`,
    `Índice como key quebra quando a lista é reordenada, filtrada ou recebe item no começo`,
    `React compõe, não herda: passe componentes e children em vez de estender classes`,
    `Tipe as props com um <code>type</code> ou <code>interface</code>; o TS reclama no uso errado`,
  ],
  ensino: [
    { titulo: 'Props: argumentos só de leitura',
      texto: `<p>O pai passa dados ao filho como atributos JSX. O React junta tudo num objeto, o <b>props</b>, e passa como primeiro argumento da função. Strings vão entre aspas; qualquer outro valor (número, objeto, função) vai entre chaves.</p>
<p>Props são <b>imutáveis</b> do ponto de vista do filho. Nunca faça <code>props.tarefa.titulo = ...</code>: o pai não fica sabendo e a tela fica inconsistente. Para mudar algo, o pai passa uma função de callback (veremos em estado).</p>
<p><b>No NestJS/TypeScript:</b> é como o parâmetro tipado de um método de serviço. A desestruturação com valor padrão substitui o antigo <code>defaultProps</code>.</p>`,
      linguagem: 'tsx',
      codigo: `type CartaoTarefaProps = {
  titulo: string
  responsavel?: string
  prioridade?: 'baixa' | 'media' | 'alta'
}

function CartaoTarefa({ titulo, responsavel = 'Sem responsável', prioridade = 'media' }: CartaoTarefaProps) {
  return (
    <article className={\`cartao cartao--\${prioridade}\`}>
      <h3>{titulo}</h3>
      <small>{responsavel}</small>
    </article>
  )
}

// uso: <CartaoTarefa titulo="Revisar contrato" prioridade="alta" />` },
    { titulo: 'children: o conteúdo entre as tags',
      texto: `<p>Tudo o que fica entre a tag de abertura e a de fechamento chega como a prop <code>children</code>. Isso permite componentes "moldura" (cartão, modal, coluna do quadro) que não sabem nada do conteúdo.</p>
<p>O tipo é <code>ReactNode</code>: aceita elementos, strings, números, arrays, <code>null</code>. Ele é o tipo certo para qualquer coisa "renderizável".</p>`,
      linguagem: 'tsx',
      codigo: `import type { ReactNode } from 'react'

function Coluna({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="coluna">
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

<Coluna titulo="A fazer">
  <CartaoTarefa titulo="Revisar contrato" />
  <CartaoTarefa titulo="Responder ofício" />
</Coluna>` },
    { titulo: 'Listas com map e key',
      texto: `<p>Para renderizar uma coleção, transforme dados em elementos com <code>map</code>. Cada item precisa de uma <code>key</code>: é como o React reconhece "este é o mesmo item da renderização anterior" e decide o que reaproveitar, mover ou destruir.</p>
<p>A key deve ser <b>estável</b> (não muda entre renderizações) e <b>única entre irmãos</b>. O id do banco é a escolha natural. Sem key, o React avisa no console: "Each child in a list should have a unique key prop".</p>
<p>A key não chega ao componente como prop; se o filho precisa do id, passe-o separado.</p>`,
      linguagem: 'tsx',
      codigo: `type Tarefa = { id: number; titulo: string; responsavel: string }

function ListaTarefas({ tarefas }: { tarefas: Tarefa[] }) {
  return (
    <ul>
      {tarefas.map(t => (
        <li key={t.id}>
          {t.titulo} — {t.responsavel}
        </li>
      ))}
    </ul>
  )
}` },
    { titulo: 'Por que índice como key quebra',
      texto: `<p>Com <code>key={i}</code>, a key descreve a <b>posição</b>, não o item. Se você insere uma tarefa no topo, o item que estava na posição 0 agora é outro, mas tem a mesma key. O React acha que é o mesmo componente e <b>mantém o estado interno dele</b>: o checkbox marcado, o texto digitado num input, a animação.</p>
<p>Sintoma típico: você digita num campo da linha 1, adiciona um item no começo, e o texto "pula" para a tarefa errada. Ou exclui uma linha e o checkbox marcado passa para a vizinha.</p>
<p>Índice só é aceitável em lista estática que nunca reordena, filtra nem insere. Também não gere key com <code>Math.random()</code> ou <code>crypto.randomUUID()</code> no render: muda a cada renderização e força recriar tudo.</p>`,
      linguagem: 'tsx',
      codigo: `// ❌ estado do input "gruda" na posição, não na tarefa
{tarefas.map((t, i) => <LinhaEditavel key={i} tarefa={t} />)}

// ✅ estado acompanha a tarefa
{tarefas.map(t => <LinhaEditavel key={t.id} tarefa={t} />)}` },
    { titulo: 'Composição em vez de herança',
      texto: `<p>Em React não se cria <code>CartaoUrgente extends Cartao</code>. Para especializar, você <b>compõe</b>: um componente usa outro e passa props, children ou até outros elementos como prop ("slots").</p>
<p>Isso evita hierarquias rígidas: o cabeçalho do quadro pode receber qualquer coisa como ação, sem saber se é botão, menu ou filtro.</p>
<p><b>No NestJS:</b> é o mesmo instinto de preferir injeção e composição de serviços a herança de classes base.</p>`,
      linguagem: 'tsx',
      codigo: `function Cabecalho({ titulo, acoes }: { titulo: string; acoes?: ReactNode }) {
  return (
    <header className="cabecalho">
      <h1>{titulo}</h1>
      <div className="acoes">{acoes}</div>
    </header>
  )
}

<Cabecalho
  titulo="Quadro de atendimentos"
  acoes={<button>Nova tarefa</button>}
/>` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Dentro de <code>CartaoTarefa</code>, um dev escreve <code>props.tarefa.status = "feita"</code> no clique. Qual o problema?',
      opcoes: [
        'Props são só de leitura: o pai não é avisado e a tela não re-renderiza de forma confiável',
        'Nenhum, objetos em props podem ser mutados livremente',
        'O TypeScript impede em tempo de execução',
        'Só funciona se a prop for marcada como readonly',
      ],
      certa: 0,
      dicas: ['Quem é dono do dado?', 'O React só re-renderiza quando estado muda via setter.'],
      explica: `Mutar props altera um objeto do pai às escondidas: nenhum setState é chamado, então a tela pode ou não refletir. O certo é o pai passar um callback (<code>onConcluir</code>). <code>readonly</code> do TS só avisa em compilação.` },
    { tipo: 'completar',
      pergunta: 'Complete a moldura que renderiza o conteúdo passado entre as tags:',
      codigo: `function Cartao({ [[0]] }: { [[1]]: ReactNode }) {
  return <div className="cartao">{[[2]]}</div>
}`,
      respostas: [['children'], ['children'], ['children']],
      dicas: ['O conteúdo entre as tags vira uma prop especial.', 'O nome dela é fixo.'],
      explica: `<code>children</code> recebe o que fica entre <code>&lt;Cartao&gt;</code> e <code>&lt;/Cartao&gt;</code>; <code>ReactNode</code> é o tipo de qualquer coisa renderizável.` },
    { tipo: 'escolha',
      pergunta: 'A lista usa <code>key={indice}</code>. O usuário digita uma observação no input da primeira tarefa e depois adiciona uma tarefa <b>no topo</b>. O que acontece?',
      opcoes: [
        'O texto digitado fica na primeira linha, que agora é a tarefa nova',
        'O texto acompanha a tarefa original, que desceu para a segunda linha',
        'O React perde todos os inputs',
        'O React lança erro de key duplicada',
      ],
      certa: 0,
      dicas: ['A key identifica o quê: o item ou a posição?', 'Key 0 continua existindo, só que com outro item.'],
      explica: `Com índice, a key 0 continua na primeira linha; o React reaproveita o componente (e o estado do input) para o item novo. Com <code>key={t.id}</code>, o estado acompanharia a tarefa.` },
    { tipo: 'montar',
      pergunta: 'Monte a renderização da lista de tarefas:',
      certa: ['{tarefas.map(t =>', '<CartaoTarefa', 'key={t.id}', 'titulo={t.titulo}', '/>)}'],
      extras: ['key={Math.random()}', 'tarefas.forEach(t =>', 'id={t.id}'],
      dicas: ['Precisa devolver um array de elementos.', '<code>forEach</code> devolve undefined.', 'A key precisa ser estável.'],
      explica: `<code>map</code> devolve o array de elementos; <code>forEach</code> não devolve nada. <code>Math.random()</code> muda a cada render e destrói o estado dos filhos.` },
    { tipo: 'escolha',
      pergunta: 'Dentro de <code>CartaoTarefa</code>, o que vale <code>props.key</code>?',
      codigo: `<CartaoTarefa key={t.id} titulo={t.titulo} />`,
      opcoes: ['undefined', 'O valor de t.id', 'Uma string gerada pelo React'],
      certa: 0,
      dicas: ['A key é para o React, não para o componente.', 'O React avisa se você tentar ler.'],
      explica: `<code>key</code> (assim como <code>ref</code> em versões antigas) é consumida pelo React e não vira prop. Se o filho precisa do id, passe <code>id={t.id}</code> também.` },
    { tipo: 'completar',
      pergunta: 'Complete a tipagem: prioridade opcional e restrita a três valores.',
      codigo: `type CartaoProps = {
  titulo: string
  prioridade[[0]] 'baixa' [[1]] 'media' | 'alta'
}`,
      respostas: [['?:'], ['|']],
      dicas: ['Propriedade opcional no TS tem um sinal antes dos dois-pontos.', 'União de literais.'],
      explica: `<code>?:</code> torna a prop opcional e a união de literais faz o TS recusar <code>prioridade="urgente"</code> no uso.` },
    { tipo: 'escolha',
      pergunta: 'Você precisa de um cartão "urgente" com borda vermelha e um ícone extra. Qual abordagem é idiomática em React?',
      opcoes: [
        'Um componente CartaoUrgente que renderiza <Cartao> com props e children extras',
        'Uma classe CartaoUrgente extends Cartao',
        'Copiar o código do Cartao e ajustar',
        'Mutar o elemento retornado por Cartao',
      ],
      certa: 0,
      dicas: ['React prefere compor.', 'Um componente pode simplesmente usar outro.'],
      explica: `Composição: o componente especializado usa o genérico e passa o que muda. A documentação do React desaconselha herança entre componentes; elementos JSX são imutáveis.` },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: para que serve a prop <code>key</code> e por que usar o índice do array costuma ser um bug?',
      avalia: `Se a pessoa entende a reconciliação: a key identifica o item entre renderizações e o estado do componente fica preso a ela.`,
      resposta: `<p>Quando a lista muda, o React compara os filhos novos com os antigos. A key diz qual elemento novo corresponde a qual antigo, para ele reaproveitar o componente, mover o nó do DOM e manter o estado interno.</p>
<p>Se a key é o índice, ela representa a posição. Ao inserir no topo, reordenar ou filtrar, o item na posição 0 muda mas a key não, então o React reaproveita o componente errado: inputs, checkboxes e estado local "pulam" de item. Por isso uso um id estável vindo dos dados; índice só em listas estáticas.</p>`,
      pontos: ['key identifica o item entre renderizações', 'estado local fica associado à key', 'índice = posição, quebra ao inserir/reordenar/filtrar', 'usar id estável, nunca valor aleatório'],
      evitar: ['dizer que key é só para tirar o warning', 'sugerir Math.random() como key'],
      dicas: ['Fale de reconciliação.', 'Dê um sintoma concreto (input que pula de linha).'] },
  ],
})

// ---- 03-react-estado.js
MODULOS.push({
  id: 'react-estado',
  titulo: 'Estado e eventos',
  icone: '🔁',
  aprende: 'useState, eventos, atualização funcional, imutabilidade, estado derivado e levantar estado',
  porque: 'A maioria dos bugs de React em produção é estado mutado, duplicado ou no componente errado.',
  resumo: [
    `<code>const [x, setX] = useState(inicial)</code>: chamar <code>setX</code> agenda uma <b>nova renderização</b>`,
    `O estado é um <b>retrato</b> daquela renderização: depois de <code>setX</code>, <code>x</code> ainda vale o valor antigo`,
    `Quando o novo valor depende do anterior, use <code>setX(x =&gt; x + 1)</code>`,
    `Nunca mute: crie cópias com <code>...</code>, <code>map</code>, <code>filter</code>; o React compara por <b>referência</b>`,
    `Se dá para calcular a partir de props ou estado, <b>não guarde</b>: calcule no render`,
    `Dois irmãos precisam do mesmo dado? <b>Levante o estado</b> para o pai comum e passe por props`,
  ],
  ensino: [
    { titulo: 'useState: memória do componente',
      texto: `<p>Variáveis locais somem quando a função termina, e mudá-las não avisa o React. <code>useState</code> dá ao componente uma memória que sobrevive entre renderizações e um <b>setter</b> que, ao ser chamado, agenda uma nova renderização.</p>
<p>Eventos são props em camelCase que recebem <b>uma função</b>: <code>onClick={concluir}</code>. Escrever <code>onClick={concluir()}</code> chama a função durante o render, não no clique (e se ela muda estado, gera loop: "Too many re-renders").</p>
<p>Para passar argumento, embrulhe: <code>onClick={() =&gt; concluir(t.id)}</code>.</p>`,
      linguagem: 'tsx',
      codigo: `import { useState } from 'react'

function FiltroPainel() {
  const [somenteUrgentes, setSomenteUrgentes] = useState(false)

  return (
    <button onClick={() => setSomenteUrgentes(!somenteUrgentes)}>
      {somenteUrgentes ? 'Mostrar todas' : 'Só urgentes'}
    </button>
  )
}` },
    { titulo: 'Estado é um retrato: atualização funcional',
      texto: `<p>Dentro de uma renderização, o estado é uma <b>constante</b>. <code>setContador(contador + 1)</code> não muda <code>contador</code> na hora; ele pede ao React "na próxima renderização, use este valor". Por isso um <code>console.log</code> logo depois mostra o valor antigo.</p>
<p>Três chamadas seguidas de <code>setContador(contador + 1)</code> com <code>contador = 0</code> resultam em <b>1</b>, não 3: todas leem o mesmo 0. O React agrupa (batching) as atualizações do mesmo evento.</p>
<p>A forma <b>funcional</b> <code>setContador(c =&gt; c + 1)</code> recebe o valor mais recente da fila. Use sempre que o novo valor depende do anterior, especialmente em callbacks assíncronos, timers e handlers chamados várias vezes.</p>`,
      linguagem: 'tsx',
      codigo: `const [atendidos, setAtendidos] = useState(0)

// com atendidos = 0:
function errado() {
  setAtendidos(atendidos + 1)
  setAtendidos(atendidos + 1)
  setAtendidos(atendidos + 1)   // próxima renderização: 1
}

function certo() {
  setAtendidos(a => a + 1)
  setAtendidos(a => a + 1)
  setAtendidos(a => a + 1)      // próxima renderização: 3
}` },
    { titulo: 'Imutabilidade: sempre um objeto novo',
      texto: `<p>O React decide se re-renderiza comparando o valor novo com o antigo via <code>Object.is</code>, ou seja, <b>por referência</b>. Se você faz <code>tarefas.push(nova); setTarefas(tarefas)</code>, é o mesmo array: o React pode ignorar a atualização e a tela não muda.</p>
<p>Regra: trate estado como <b>somente leitura</b> e crie cópias. Adicionar: <code>[...lista, item]</code>. Remover: <code>filter</code>. Alterar um item: <code>map</code> devolvendo um objeto novo só para o item alterado. Objetos: <code>{ ...obj, campo: valor }</code>.</p>
<p>O spread é <b>raso</b>: em objeto aninhado, copie cada nível que muda. <code>toSorted()</code> e <code>toReversed()</code> (ES2023) já devolvem cópia; <code>sort()</code> e <code>reverse()</code> mutam.</p>`,
      linguagem: 'tsx',
      codigo: `type Tarefa = { id: number; titulo: string; feita: boolean }
const [tarefas, setTarefas] = useState<Tarefa[]>([])

const adicionar = (titulo: string) =>
  setTarefas(ts => [...ts, { id: Date.now(), titulo, feita: false }])

const alternar = (id: number) =>
  setTarefas(ts => ts.map(t => (t.id === id ? { ...t, feita: !t.feita } : t)))

const remover = (id: number) =>
  setTarefas(ts => ts.filter(t => t.id !== id))` },
    { titulo: 'Estado derivado: não guarde o que dá para calcular',
      texto: `<p>Se um valor pode ser calculado a partir de props ou de outro estado, <b>calcule durante o render</b>. Guardar <code>totalPendentes</code> num <code>useState</code> separado cria duas fontes da verdade que vão se desencontrar no primeiro <code>setTarefas</code> que esquecer de atualizar o total.</p>
<p>O mesmo vale para lista filtrada: guarde o <b>filtro</b> e a <b>lista</b>; a lista filtrada é uma conta. Também evite copiar uma prop para estado (<code>useState(props.tarefa)</code>): o estado só usa o valor inicial e ignora mudanças futuras da prop.</p>
<p>Calcular a cada render é barato na imensa maioria dos casos. <code>useMemo</code> só entra se medir lentidão.</p>`,
      linguagem: 'tsx',
      codigo: `const [tarefas, setTarefas] = useState<Tarefa[]>([])
const [busca, setBusca] = useState('')

// ✅ derivados: sempre coerentes com o estado
const pendentes = tarefas.filter(t => !t.feita).length
const visiveis = tarefas.filter(t =>
  t.titulo.toLowerCase().includes(busca.toLowerCase())
)

// ❌ const [pendentes, setPendentes] = useState(0)` },
    { titulo: 'Levantar estado para o pai comum',
      texto: `<p>O fluxo de dados é <b>de cima para baixo</b>. Se a barra de busca e a lista precisam do mesmo termo, o estado não pode morar em nenhuma das duas: suba para o <b>ancestral comum mais próximo</b> e desça o valor por props, junto com uma função para alterá-lo.</p>
<p>O filho vira "controlado": recebe <code>valor</code> e <code>onMudar</code>, sem estado próprio. Mantenha o estado o mais <b>baixo</b> possível, mas alto o suficiente para todos que precisam dele.</p>`,
      linguagem: 'tsx',
      codigo: `function Painel() {
  const [busca, setBusca] = useState('')
  return (
    <>
      <BarraBusca valor={busca} onMudar={setBusca} />
      <ListaTarefas filtro={busca} />
    </>
  )
}

function BarraBusca({ valor, onMudar }: { valor: string; onMudar: (v: string) => void }) {
  return <input value={valor} onChange={e => onMudar(e.target.value)} />
}` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Com <code>contador = 0</code>, quanto vale <code>contador</code> na próxima renderização?',
      codigo: `function handleClick() {
  setContador(contador + 1)
  setContador(contador + 1)
  setContador(contador + 1)
}`,
      opcoes: ['1', '3', '0', 'Depende da velocidade do clique'],
      certa: 0,
      dicas: ['Quanto vale <code>contador</code> durante este handler?', 'As três linhas leem o mesmo retrato.'],
      explica: `As três chamadas calculam <code>0 + 1</code>, porque <code>contador</code> é constante nesta renderização. Com <code>setContador(c =&gt; c + 1)</code> três vezes, o resultado seria 3.` },
    { tipo: 'completar',
      pergunta: 'Complete a atualização funcional:',
      codigo: `setAtendidos(a => [[0]])`,
      respostas: [['a + 1', 'a+1', '1 + a']],
      dicas: ['O setter aceita uma função.', 'Ela recebe o valor anterior e devolve o novo.'],
      explica: `A função recebe o valor mais recente da fila, então funciona mesmo com várias atualizações no mesmo evento ou em callbacks assíncronos.` },
    { tipo: 'escolha',
      pergunta: 'Por que a tela não atualiza?',
      codigo: `function adicionar(titulo: string) {
  tarefas.push({ id: Date.now(), titulo, feita: false })
  setTarefas(tarefas)
}`,
      opcoes: [
        'É o mesmo array: o React compara por referência e pula a atualização',
        'push é assíncrono',
        'Falta chamar forceUpdate()',
        'setTarefas só aceita função',
      ],
      certa: 0,
      dicas: ['O que o React compara: conteúdo ou referência?', '<code>Object.is(tarefas, tarefas)</code> é true.'],
      explica: `Mutar e passar a mesma referência faz o React achar que nada mudou. O certo é <code>setTarefas(ts =&gt; [...ts, nova])</code>. Não existe forceUpdate em function components.` },
    { tipo: 'montar',
      pergunta: 'Monte a marcação de uma tarefa como feita, sem mutar:',
      certa: ['setTarefas(ts =>', 'ts.map(t =>', 't.id === id', '? { ...t, feita: true }', ': t))'],
      extras: ['ts.forEach(t =>', '? (t.feita = true)', 'ts.push('],
      dicas: ['Você quer um array novo do mesmo tamanho.', 'Só o item alterado ganha objeto novo.'],
      explica: `<code>map</code> devolve array novo; o item alvo vira um objeto novo via spread e os outros mantêm a referência (o que ajuda o <code>memo</code> dos filhos). Atribuir <code>t.feita = true</code> mutaria o objeto original.` },
    { tipo: 'completar',
      pergunta: 'Complete a remoção imutável:',
      codigo: `const remover = (id: number) =>
  setTarefas(ts => ts.[[0]](t => t.id [[1]] id))`,
      respostas: [['filter'], ['!==', '!=']],
      dicas: ['Qual método devolve um array só com alguns itens?', 'Mantenha os que NÃO têm o id.'],
      explica: `<code>filter</code> cria um array novo; <code>splice</code> mutaria o original.` },
    { tipo: 'escolha',
      pergunta: 'O componente guarda <code>tarefas</code> e também <code>totalFeitas</code> em dois <code>useState</code>. Qual o melhor ajuste?',
      opcoes: [
        'Remover totalFeitas do estado e calcular com filter no render',
        'Atualizar totalFeitas num useEffect que observa tarefas',
        'Guardar tudo num único objeto de estado',
        'Usar useRef para totalFeitas',
      ],
      certa: 0,
      dicas: ['Dá para calcular uma coisa a partir da outra?', 'Duas fontes da verdade se desencontram.'],
      explica: `Valor derivado se calcula no render. O useEffect "funciona", mas renderiza duas vezes (uma com o total desatualizado) e é o anti-padrão que a documentação chama de "você talvez não precise de um efeito".` },
    { tipo: 'escolha',
      pergunta: '<code>&lt;BarraBusca /&gt;</code> e <code>&lt;ListaTarefas /&gt;</code> são irmãos e os dois precisam do termo buscado. Onde fica o <code>useState</code>?',
      opcoes: [
        'No pai comum, passando valor e setter por props',
        'Na BarraBusca, e a ListaTarefas lê de lá',
        'Em cada um, sincronizando com useEffect',
        'Numa variável global do módulo',
      ],
      certa: 0,
      dicas: ['Dados descem; irmãos não se enxergam.', 'Ancestral comum mais próximo.'],
      explica: `Levantar estado cria uma única fonte da verdade. Irmãos não acessam o estado um do outro, e sincronizar duas cópias com efeito gera bugs e renderizações extras. Variável global não re-renderiza ninguém.` },
    { tipo: 'escolha',
      pergunta: 'O que acontece ao renderizar este botão?',
      codigo: `<button onClick={setAberto(true)}>Abrir</button>`,
      opcoes: [
        'setAberto roda no render, causa nova renderização e entra em loop (Too many re-renders)',
        'Abre o painel ao clicar, normalmente',
        'Nada acontece ao clicar',
      ],
      certa: 0,
      dicas: ['O que está entre as chaves é avaliado quando?', 'onClick espera uma função.'],
      explica: `<code>setAberto(true)</code> é executado durante o render e o retorno (undefined) vira o handler. Como muda estado no render, o React re-renderiza sem parar. O certo é <code>onClick={() =&gt; setAberto(true)}</code>.` },
  ],
})

// ---- 04-react-efeitos.js
MODULOS.push({
  id: 'react-efeitos',
  titulo: 'Efeitos',
  icone: '⚡',
  aprende: 'useEffect para sincronizar com sistemas externos, dependências, limpeza, StrictMode e fetch com AbortController',
  porque: 'useEffect mal usado é a fonte nº 1 de loops, requisições duplicadas e vazamentos em apps React.',
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

// ---- 05-react-formularios.js
MODULOS.push({
  id: 'react-formularios',
  titulo: 'Formulários',
  icone: '📝',
  aprende: 'inputs controlados, onSubmit com preventDefault, validação, erros acessíveis, select e checkbox',
  porque: 'Quase toda tela de sistema interno é um formulário, e é onde o usuário mais sente bugs e falta de acessibilidade.',
  resumo: [
    `Input <b>controlado</b>: <code>value</code> vem do estado e <code>onChange</code> atualiza o estado`,
    `Checkbox usa <code>checked</code> e <code>e.target.checked</code>, não <code>value</code>`,
    `<code>&lt;form onSubmit&gt;</code> + <code>e.preventDefault()</code>: Enter funciona e a página não recarrega`,
    `Valide no submit (e opcionalmente ao sair do campo); guarde os erros por campo`,
    `Erro acessível: <code>aria-invalid</code>, <code>aria-describedby</code> apontando para a mensagem e <code>&lt;label htmlFor&gt;</code>`,
    `<code>value</code> sem <code>onChange</code> trava o campo; <code>undefined</code> → string troca de não controlado para controlado`,
  ],
  ensino: [
    { titulo: 'Input controlado: o estado é a fonte da verdade',
      texto: `<p>Num input <b>controlado</b>, o React manda no valor: <code>value={titulo}</code> mostra o estado e <code>onChange</code> grava cada tecla no estado. O DOM nunca tem um valor que o React não conhece, então você pode validar, formatar ou desabilitar o botão a cada tecla.</p>
<p>Dois erros comuns: <code>value</code> sem <code>onChange</code> deixa o campo <b>travado</b> (o React avisa no console); e começar com <code>undefined</code> (ex.: <code>useState()</code> ou um campo opcional da API) faz o input mudar de não controlado para controlado, com outro aviso. Inicialize com <code>''</code>.</p>
<p>A alternativa é o input <b>não controlado</b> com <code>defaultValue</code> e leitura no submit via <code>FormData</code>. Funciona bem para formulários simples; bibliotecas como React Hook Form usam essa ideia por desempenho.</p>`,
      linguagem: 'tsx',
      codigo: `function CampoTitulo() {
  const [titulo, setTitulo] = useState('')

  return (
    <>
      <label htmlFor="titulo">Título</label>
      <input
        id="titulo"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />
      <small>{titulo.length}/80</small>
    </>
  )
}` },
    { titulo: 'Um estado por formulário e onSubmit',
      texto: `<p>Com vários campos, um objeto de estado e um handler genérico pelo atributo <code>name</code> evitam repetição. Lembre de copiar o objeto: <code>{ ...form, [name]: value }</code>.</p>
<p>Ponha a lógica no <code>onSubmit</code> do <code>&lt;form&gt;</code>, não no <code>onClick</code> do botão: assim Enter envia e leitores de tela entendem a estrutura. Chame <code>e.preventDefault()</code> para o navegador não recarregar a página com um GET.</p>
<p>Botões dentro de form são <code>type="submit"</code> por padrão. Um botão "Cancelar" precisa de <code>type="button"</code>, senão também envia.</p>`,
      linguagem: 'tsx',
      codigo: `type NovaTarefa = { titulo: string; responsavel: string }

function FormTarefa({ onCriar }: { onCriar: (t: NovaTarefa) => void }) {
  const [form, setForm] = useState<NovaTarefa>({ titulo: '', responsavel: '' })

  function mudar(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onCriar(form)
    setForm({ titulo: '', responsavel: '' })
  }

  return (
    <form onSubmit={enviar}>
      <input name="titulo" value={form.titulo} onChange={mudar} />
      <input name="responsavel" value={form.responsavel} onChange={mudar} />
      <button type="button" onClick={() => setForm({ titulo: '', responsavel: '' })}>Limpar</button>
      <button>Criar</button>
    </form>
  )
}` },
    { titulo: 'Select e checkbox',
      texto: `<p>No React, <code>&lt;select&gt;</code> é controlado com <code>value</code> no próprio select (não <code>selected</code> na option) e o valor chega como <b>string</b>: converta se for número.</p>
<p>Checkbox e radio usam <code>checked</code> e <code>e.target.checked</code> (booleano). Ler <code>e.target.value</code> de um checkbox devolve <code>"on"</code>, um bug silencioso clássico.</p>`,
      linguagem: 'tsx',
      codigo: `const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media')
const [urgente, setUrgente] = useState(false)

<select value={prioridade} onChange={e => setPrioridade(e.target.value as typeof prioridade)}>
  <option value="baixa">Baixa</option>
  <option value="media">Média</option>
  <option value="alta">Alta</option>
</select>

<label>
  <input type="checkbox" checked={urgente} onChange={e => setUrgente(e.target.checked)} />
  Urgente
</label>` },
    { titulo: 'Validação e erros acessíveis',
      texto: `<p>Uma validação simples é uma função pura que recebe o formulário e devolve um objeto de erros por campo. Rode no submit; se houver erro, não envie. Para não incomodar enquanto a pessoa digita, mostre o erro só depois do primeiro envio ou ao sair do campo (<code>onBlur</code>).</p>
<p>Erro só em vermelho não serve para quem usa leitor de tela ou não distingue cores. Ligue a mensagem ao campo: <code>aria-invalid="true"</code> marca o campo inválido, <code>aria-describedby</code> aponta para o <code>id</code> da mensagem (lida junto com o rótulo) e <code>role="alert"</code> anuncia a mensagem quando aparece. Todo input precisa de <code>&lt;label&gt;</code>; placeholder não substitui rótulo.</p>
<p>Validação no cliente é conveniência. <b>A API continua validando</b> (seus DTOs com class-validator no NestJS).</p>`,
      linguagem: 'tsx',
      codigo: `function validar(f: NovaTarefa) {
  const erros: Partial<Record<keyof NovaTarefa, string>> = {}
  if (!f.titulo.trim()) erros.titulo = 'Informe o título.'
  else if (f.titulo.length > 80) erros.titulo = 'Use até 80 caracteres.'
  return erros
}

<label htmlFor="titulo">Título</label>
<input
  id="titulo"
  name="titulo"
  value={form.titulo}
  onChange={mudar}
  aria-invalid={erros.titulo ? true : undefined}
  aria-describedby={erros.titulo ? 'titulo-erro' : undefined}
/>
{erros.titulo && <p id="titulo-erro" role="alert">{erros.titulo}</p>}` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'O usuário digita e nada aparece no campo. Por quê?',
      codigo: `const [titulo, setTitulo] = useState('')
<input value={titulo} />`,
      opcoes: [
        'value sem onChange: o React sempre restaura o valor do estado',
        'Falta o atributo name',
        'useState precisa de valor inicial null',
        'Inputs precisam estar dentro de um form',
      ],
      certa: 0,
      dicas: ['Quem atualiza <code>titulo</code>?', 'O React avisa: "You provided a value prop without an onChange handler".'],
      explica: `No input controlado, o valor exibido é sempre o estado. Sem <code>onChange</code>, o estado nunca muda e o campo fica travado. Para campo só de leitura, use <code>readOnly</code>; para não controlado, <code>defaultValue</code>.` },
    { tipo: 'completar',
      pergunta: 'Complete o input controlado:',
      codigo: `<input
  value={responsavel}
  [[0]]={e => setResponsavel(e.[[1]].value)}
/>`,
      respostas: [['onChange'], ['target', 'currentTarget']],
      dicas: ['Em React, o evento de digitação é o mesmo nome para todo input de texto.', 'O elemento fica numa propriedade do evento.'],
      explica: `No React, <code>onChange</code> dispara a cada tecla (como o <code>input</code> nativo), não só ao perder o foco.` },
    { tipo: 'escolha',
      pergunta: 'Ao enviar o formulário, a página recarrega e o estado some. O que falta?',
      codigo: `function enviar(e: React.FormEvent<HTMLFormElement>) {
  criarTarefa(form)
}
<form onSubmit={enviar}>...</form>`,
      opcoes: ['e.preventDefault()', 'e.stopPropagation()', 'return false', 'type="button" no botão de enviar'],
      certa: 0,
      dicas: ['O navegador tem um comportamento padrão para submit.', 'Qual método cancela o comportamento padrão?'],
      explica: `<code>preventDefault</code> cancela a navegação do submit. <code>stopPropagation</code> só impede a bolha do evento; <code>return false</code> não tem efeito em handlers React; <code>type="button"</code> faria o botão nem enviar.` },
    { tipo: 'escolha',
      pergunta: 'Este handler grava <code>"on"</code> em vez de true/false. Qual a correção?',
      codigo: `<input type="checkbox" checked={urgente}
  onChange={e => setUrgente(e.target.value)} />`,
      opcoes: ['Ler e.target.checked', 'Usar defaultChecked', 'Converter com Boolean(e.target.value)', 'Trocar onChange por onClick'],
      certa: 0,
      dicas: ['O valor de um checkbox não muda quando você marca.', 'Existe uma propriedade booleana.'],
      explica: `<code>value</code> de checkbox é fixo ("on" por padrão). <code>Boolean("on")</code> é sempre true, então desmarcar não funcionaria.` },
    { tipo: 'montar',
      pergunta: 'Monte o input ligado à sua mensagem de erro para leitores de tela:',
      certa: ['<input id="titulo"', 'aria-invalid={!!erro}', 'aria-describedby="titulo-erro"', '/>'],
      extras: ['aria-label="erro"', 'placeholder="obrigatório"', 'className="vermelho"'],
      dicas: ['Um atributo marca o campo como inválido.', 'Outro aponta para o id da mensagem.'],
      explica: `<code>aria-invalid</code> anuncia o estado e <code>aria-describedby</code> faz o leitor ler a mensagem junto com o rótulo. Cor e placeholder não são lidos como erro.` },
    { tipo: 'completar',
      pergunta: 'Complete o handler genérico, sem mutar o estado:',
      codigo: `function mudar(e: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target
  setForm(f => ({ [[0]]f, [[[1]]]: value }))
}`,
      respostas: [['...'], ['name']],
      dicas: ['Copie o objeto anterior.', 'Propriedade com nome calculado usa colchetes.'],
      explica: `Spread copia os outros campos e <code>[name]</code> é a chave computada; sem a cópia, você perderia os demais campos.` },
    { tipo: 'escolha',
      pergunta: 'No formulário de tarefa há um botão "Cancelar" sem <code>type</code>. O que acontece ao clicar?',
      opcoes: [
        'Envia o formulário, porque botão em form é submit por padrão',
        'Nada, botão sem type não faz nada',
        'Recarrega a página sempre, mesmo com preventDefault',
      ],
      certa: 0,
      dicas: ['Qual o type padrão de &lt;button&gt;?', 'É do HTML, não do React.'],
      explica: `O padrão é <code>type="submit"</code>. Botões que não enviam precisam de <code>type="button"</code>.` },
    { tipo: 'escolha',
      pergunta: 'A validação no React já impede título vazio. A API precisa validar de novo?',
      opcoes: [
        'Sim: o cliente pode ser contornado; validação no front é só experiência do usuário',
        'Não, duplicar validação é retrabalho',
        'Só se a API for pública',
      ],
      certa: 0,
      dicas: ['Qualquer um faz um curl direto na API.', 'Quem garante a integridade dos dados?'],
      explica: `O front valida para dar resposta rápida; a API valida para garantir integridade (DTO + class-validator, por exemplo). Um schema compartilhado (Zod) evita divergência entre os dois.` },
  ],
})

// ---- 06-react-hooks.js
MODULOS.push({
  id: 'react-hooks',
  titulo: 'Hooks e Context',
  icone: '🪝',
  aprende: 'hooks customizados, regras dos hooks, useContext com Provider, useMemo/useCallback e useRef',
  porque: 'Hooks próprios e Context são como você reaproveita lógica e evita passar a mesma prop por dez níveis.',
  resumo: [
    `Hook customizado é uma função <code>useAlgo</code> que chama outros hooks; compartilha <b>lógica</b>, não estado`,
    `Regras: chame hooks só no <b>topo</b> de componentes ou hooks, nunca dentro de if, laço ou callback`,
    `<code>createContext</code> + <code>&lt;Ctx value&gt;</code> + <code>useContext(Ctx)</code> evitam prop drilling para tema, usuário logado`,
    `Quando o value do Provider muda, <b>todos</b> os consumidores re-renderizam`,
    `<code>useMemo</code>/<code>useCallback</code> são otimização: use quando medir ganho ou para estabilizar dependência`,
    `<code>useRef</code> guarda valor que <b>não</b> causa render (id de timer, elemento do DOM)`,
  ],
  ensino: [
    { titulo: 'Hooks customizados: extrair lógica',
      texto: `<p>Quando dois componentes repetem a mesma combinação de <code>useState</code> + <code>useEffect</code>, extraia para uma função que começa com <code>use</code>. O prefixo não é estética: é como o React e o lint sabem que ali valem as regras dos hooks.</p>
<p>Cada componente que chama o hook ganha <b>seu próprio estado</b>. Hook customizado compartilha a <i>lógica</i>, não os dados; para compartilhar dados, use estado levantado ou Context.</p>
<p><code>useDebounce</code> é o exemplo clássico: a busca do painel só dispara depois que a pessoa para de digitar.</p>`,
      linguagem: 'tsx',
      codigo: `function useDebounce<T>(valor: T, atraso = 300): T {
  const [atrasado, setAtrasado] = useState(valor)

  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atraso)
    return () => clearTimeout(id)   // nova tecla cancela o timer anterior
  }, [valor, atraso])

  return atrasado
}

// uso
const [busca, setBusca] = useState('')
const buscaDebounced = useDebounce(busca, 400)` },
    { titulo: 'useLocalStorage: estado que sobrevive ao F5',
      texto: `<p>Outro hook útil: um <code>useState</code> que lê o valor inicial do <code>localStorage</code> e grava a cada mudança. Note o <b>inicializador preguiçoso</b> <code>useState(() =&gt; ...)</code>: a função roda só na primeira renderização, em vez de ler e fazer parse do storage em todo render.</p>
<p>Gravar no storage é sincronizar com um sistema externo, então é um efeito legítimo. O <code>try/catch</code> protege contra JSON corrompido e modo privado.</p>`,
      linguagem: 'tsx',
      codigo: `function useLocalStorage<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo !== null ? (JSON.parse(salvo) as T) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(valor)) } catch {}
  }, [chave, valor])

  return [valor, setValor] as const
}

const [colunasOcultas, setColunasOcultas] = useLocalStorage<string[]>('colunas', [])` },
    { titulo: 'Regras dos hooks',
      texto: `<p>O React identifica cada hook pela <b>ordem de chamada</b> dentro do componente: o 1º <code>useState</code> é a gaveta 1, o 2º é a gaveta 2. Se um hook fica dentro de um <code>if</code> e a condição muda, a ordem muda e o estado vai para a gaveta errada. O React acusa: "Rendered fewer hooks than expected" ou "change in the order of Hooks".</p>
<p>Por isso: chame hooks só no <b>nível superior</b> de componentes ou de outros hooks. Nada de hook em condição, laço, depois de <code>return</code> antecipado, em handler ou em função comum. A condição vai <b>dentro</b> do hook (ex.: dentro do efeito), não em volta.</p>
<p>A exceção no React 19 é <code>use()</code>, que pode ser chamado em condicional. O plugin <code>eslint-plugin-react-hooks</code> pega todas essas violações.</p>`,
      linguagem: 'tsx',
      codigo: `// ❌ hook depois de return antecipado
function Detalhe({ tarefa }: { tarefa?: Tarefa }) {
  if (!tarefa) return null
  const [aberto, setAberto] = useState(false)
  ...
}

// ✅ hooks primeiro, condição depois
function Detalhe({ tarefa }: { tarefa?: Tarefa }) {
  const [aberto, setAberto] = useState(false)
  if (!tarefa) return null
  ...
}` },
    { titulo: 'Context: tema e usuário sem prop drilling',
      texto: `<p>Passar <code>usuario</code> do App até um botão cinco níveis abaixo, por componentes que nem usam o dado, é <b>prop drilling</b>. Context resolve: crie com <code>createContext</code>, envolva a árvore com o Provider e leia com <code>useContext</code> em qualquer descendente.</p>
<p>No React 19, o próprio contexto é o Provider: <code>&lt;TemaContext value={...}&gt;</code> (o <code>.Provider</code> ainda funciona). Encapsule num hook (<code>useUsuario</code>) que lança erro se usado fora do Provider: o erro aparece na hora, não como <code>undefined</code> lá na frente.</p>
<p>Cuidado: quando o <code>value</code> muda, <b>todos</b> os consumidores re-renderizam. Context é ótimo para dado que muda pouco (tema, usuário, idioma). Para estado de servidor, use uma biblioteca de dados; para estado global de UI muito ativo, considere Zustand ou dividir contextos.</p>
<p><b>No NestJS:</b> lembra um provider injetado no módulo e disponível para todos os filhos.</p>`,
      linguagem: 'tsx',
      codigo: `type Usuario = { nome: string; perfil: 'atendente' | 'gestor' }
const UsuarioContext = createContext<Usuario | null>(null)

export function useUsuario() {
  const u = useContext(UsuarioContext)
  if (!u) throw new Error('useUsuario precisa estar dentro de <UsuarioProvider>')
  return u
}

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario] = useState<Usuario>({ nome: 'Ana', perfil: 'gestor' })
  return <UsuarioContext value={usuario}>{children}</UsuarioContext>
}

function BotaoExcluir() {
  const { perfil } = useUsuario()
  return perfil === 'gestor' ? <button>Excluir</button> : null
}` },
    { titulo: 'useMemo, useCallback e useRef',
      texto: `<p><code>useMemo(() =&gt; calculo, deps)</code> guarda o resultado; <code>useCallback(fn, deps)</code> guarda a <b>mesma referência</b> da função. Têm custo (comparar deps, memória, código mais difícil). Use quando: o cálculo é comprovadamente caro (meça no Profiler do React DevTools), ou a referência estável importa, como prop de um filho com <code>memo</code> ou dependência de efeito. O React Compiler, quando ativo, faz essa memoização sozinho.</p>
<p><code>useRef</code> devolve um objeto <code>{ current }</code> que persiste entre renders e <b>não causa renderização</b> ao mudar. Serve para referenciar elementos do DOM (foco, scroll) e guardar valores "de bastidor" (id de timer). Não leia nem escreva <code>ref.current</code> durante o render: se a tela depende do valor, ele é estado.</p>`,
      linguagem: 'tsx',
      codigo: `function NovaTarefaRapida() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input ref={inputRef} placeholder="Nova tarefa" />
      <button onClick={() => inputRef.current?.focus()}>Adicionar</button>
    </>
  )
}

// só vale a pena se a lista for grande E o Profiler mostrar lentidão
const ordenadas = useMemo(
  () => tarefas.toSorted((a, b) => a.prazo.localeCompare(b.prazo)),
  [tarefas]
)` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Dois componentes chamam <code>useLocalStorage("filtro", "")</code>. Um muda o filtro. O outro vê a mudança na hora?',
      opcoes: [
        'Não: cada chamada de hook tem seu próprio estado',
        'Sim: hooks customizados compartilham estado',
        'Sim, porque usam a mesma chave',
      ],
      certa: 0,
      dicas: ['Hook customizado compartilha lógica ou dados?', 'Cada um tem seu useState.'],
      explica: `Cada componente tem o próprio <code>useState</code> dentro do hook. Gravar no storage não avisa o outro componente (o evento <code>storage</code> só dispara em outras abas). Para dado compartilhado, levante o estado ou use Context.` },
    { tipo: 'escolha',
      pergunta: 'Que erro este código provoca quando <code>tarefa</code> passa de undefined para um objeto?',
      codigo: `function Detalhe({ tarefa }: { tarefa?: Tarefa }) {
  if (!tarefa) return <p>Selecione uma tarefa</p>
  const [editando, setEditando] = useState(false)
  return <h2>{tarefa.titulo}</h2>
}`,
      opcoes: [
        'Rendered more hooks than during the previous render',
        'Nenhum: o useState só é criado quando necessário',
        'tarefa is undefined',
        'Too many re-renders',
      ],
      certa: 0,
      dicas: ['O React identifica hooks pela ordem.', 'Na primeira renderização, quantos hooks rodaram?'],
      explica: `Na primeira renderização nenhum hook roda; na segunda, um. A ordem mudou e o React lança erro. Mova o <code>useState</code> para antes do <code>if</code>.` },
    { tipo: 'completar',
      pergunta: 'Complete o debounce: a cada nova tecla, o timer anterior é cancelado.',
      codigo: `useEffect(() => {
  const id = [[0]](() => setAtrasado(valor), atraso)
  return () => [[1]](id)
}, [valor, atraso])`,
      respostas: [['setTimeout'], ['clearTimeout']],
      dicas: ['Executar uma vez, depois de um tempo.', 'A limpeza roda antes do próximo efeito.'],
      explica: `Quando <code>valor</code> muda, a limpeza cancela o timer pendente e o novo efeito agenda outro. Só o último sobrevive.` },
    { tipo: 'montar',
      pergunta: 'Monte a leitura do contexto do usuário:',
      certa: ['const usuario', '=', 'useContext(', 'UsuarioContext', ')'],
      extras: ['UsuarioContext.Provider', 'useState(', 'createContext('],
      dicas: ['Ler o contexto é com um hook.', 'Passe o objeto criado por createContext.'],
      explica: `<code>useContext(Ctx)</code> devolve o <code>value</code> do Provider mais próximo acima; fora de qualquer Provider, devolve o valor padrão do <code>createContext</code>.` },
    { tipo: 'escolha',
      pergunta: 'O Provider do tema passa <code>value={{ tema, alternar }}</code> e a página inteira re-renderiza a cada render do App. Por quê?',
      opcoes: [
        'Um objeto novo é criado a cada render, então todos os consumidores veem um value diferente',
        'Context sempre re-renderiza a árvore inteira, não há o que fazer',
        'Faltou memo em cada consumidor',
      ],
      certa: 0,
      dicas: ['<code>{} === {}</code>?', 'O React compara o value por Object.is.'],
      explica: `O literal gera nova referência por render. Envolver em <code>useMemo</code> (e <code>alternar</code> em <code>useCallback</code>) estabiliza o value; esse é um dos casos em que memoização se justifica sem medir.` },
    { tipo: 'escolha',
      pergunta: 'Você quer guardar o id de um <code>setInterval</code> para cancelá-lo depois, sem re-renderizar. O que usar?',
      opcoes: ['useRef', 'useState', 'useMemo', 'Uma variável let no corpo do componente'],
      certa: 0,
      dicas: ['Precisa sobreviver entre renders.', 'Mudar não deve redesenhar a tela.'],
      explica: `<code>useRef</code> persiste e não dispara render. <code>let</code> no corpo é recriada a cada render e perde o valor; <code>useState</code> re-renderizaria à toa.` },
    { tipo: 'escolha',
      pergunta: 'Um colega embrulhou todo cálculo e todo handler do componente em <code>useMemo</code>/<code>useCallback</code> "por performance". Qual a melhor resposta?',
      opcoes: [
        'Memoizar tem custo; mantenha só onde o Profiler mostrou ganho ou a referência estável é necessária',
        'Está certo, memoizar tudo é boa prática',
        'Troque tudo por useRef, que é mais rápido',
      ],
      certa: 0,
      dicas: ['Memoização também custa: comparações e memória.', 'Quando a referência estável faz diferença?'],
      explica: `A documentação do React recomenda medir antes. <code>useCallback</code> só ajuda se quem recebe a função se beneficia da referência estável (filho com <code>memo</code>, dependência de efeito).` },
    { tipo: 'completar',
      pergunta: 'Complete o foco no input ao clicar:',
      codigo: `const inputRef = [[0]]<HTMLInputElement>(null)
<input [[1]]={inputRef} />
<button onClick={() => inputRef.[[2]]?.focus()}>Nova</button>`,
      respostas: [['useRef'], ['ref'], ['current']],
      dicas: ['Um hook que devolve { current }.', 'O atributo especial que liga o elemento.'],
      explica: `Após a montagem, o React coloca o elemento em <code>inputRef.current</code>; o <code>?.</code> protege enquanto ele ainda é null.` },
  ],
})

// ---- 07-react-dados.js
MODULOS.push({
  id: 'react-dados',
  titulo: 'Dados da API',
  icone: '🌐',
  aprende: 'loading, erro e vazio, TanStack Query (useQuery, useMutation, invalidateQueries), atualização otimista e onde guardar cada estado',
  porque: 'O painel só é útil com dados reais, e é aqui que cache, carregamento e erro separam um app amador de um profissional.',
  resumo: [
    `Toda tela com dados tem <b>quatro estados</b>: carregando, erro, vazio e com dados; trate todos`,
    `Estado do <b>servidor</b> (tarefas da API) é cache de algo que mora em outro lugar; estado da <b>UI</b> (filtro, modal aberto) é seu`,
    `<code>useQuery({ queryKey, queryFn })</code> busca, guarda em cache, evita duplicar e refaz quando a key muda`,
    `A <code>queryKey</code> é a identidade do dado: inclua <b>todo parâmetro</b> que muda o resultado`,
    `<code>useMutation</code> + <code>invalidateQueries</code> no <code>onSuccess</code> = atualização <b>pessimista</b> (espera o servidor)`,
    `<b>Otimista</b>: atualiza o cache antes, guarda o anterior e desfaz no erro; vale para ações rápidas e reversíveis`,
  ],
  ensino: [
    { titulo: 'Quatro estados de toda tela com dados',
      texto: `<p>Buscar dados não é só "ter os dados". Antes da resposta, a tela está <b>carregando</b>; a requisição pode <b>falhar</b>; e pode voltar <b>vazia</b>. Cada caso precisa de uma tela pensada: skeleton ou spinner, mensagem de erro com "tentar de novo", e um vazio que oriente ("Nenhuma tarefa aberta. Criar a primeira?").</p>
<p>Esquecer o vazio é o erro mais comum: a pessoa vê uma tela em branco e acha que quebrou. Esquecer o erro é pior: spinner infinito.</p>
<p>Fazer isso à mão com <code>useEffect</code> + três <code>useState</code> + AbortController em cada tela funciona, mas não dá cache, nem deduplicação, nem atualização ao voltar para a aba. Por isso o mercado usa uma biblioteca.</p>`,
      linguagem: 'tsx',
      codigo: `function Quadro() {
  const { data, isPending, isError, refetch } = useTarefas()   // um useQuery, ver adiante

  if (isPending) return <p aria-busy="true">Carregando tarefas…</p>
  if (isError)
    return (
      <p role="alert">
        Não foi possível carregar. <button onClick={() => refetch()}>Tentar de novo</button>
      </p>
    )
  if (data.length === 0) return <p>Nenhuma tarefa aberta. Que tal criar a primeira?</p>

  return <ListaTarefas tarefas={data} />
}` },
    { titulo: 'Estado do servidor não é estado da UI',
      texto: `<p>A lista de tarefas mora no banco. No front, você tem apenas uma <b>cópia em cache</b>, que pode estar desatualizada: outro atendente fechou uma tarefa, a aba ficou aberta uma hora. Esse <b>estado do servidor</b> precisa de cache, revalidação, deduplicação e invalidação.</p>
<p>Já o <b>estado da UI</b> (filtro ativo, modal aberto, texto digitado, tarefa selecionada) é do cliente e não existe em lugar nenhum além dali. Ele fica em <code>useState</code>, na URL (filtros compartilháveis) ou em Context.</p>
<p>O erro clássico é copiar dados da API para <code>useState</code> ou para um store global e tentar mantê-los em sincronia à mão. Deixe o servidor com o TanStack Query e a UI com o React.</p>` },
    { titulo: 'TanStack Query: useQuery',
      texto: `<p>Configure um <code>QueryClient</code> uma vez e envolva o app com <code>QueryClientProvider</code>. Em cada tela, <code>useQuery</code> recebe uma <code>queryKey</code> (array que identifica o dado) e uma <code>queryFn</code> (função assíncrona que busca). Ela devolve <code>data</code>, <code>isPending</code>, <code>isError</code>, <code>error</code>, <code>isFetching</code> e <code>refetch</code>.</p>
<p>Ponha na key <b>tudo o que muda o resultado</b>: <code>['tarefas', { status, responsavelId }]</code>. Quando o filtro muda, a key muda e a busca refaz sozinha. Duas telas com a mesma key compartilham <b>uma</b> requisição e o mesmo cache.</p>
<p>A <code>queryFn</code> precisa <b>lançar</b> erro em falha. Como <code>fetch</code> não rejeita em 404/500, cheque <code>res.ok</code>. A biblioteca também passa um <code>signal</code> para cancelamento.</p>`,
      linguagem: 'tsx',
      codigo: `import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()
// no main.tsx: <QueryClientProvider client={queryClient}><App /></QueryClientProvider>

async function buscarTarefas(status: string, signal: AbortSignal): Promise<Tarefa[]> {
  const res = await fetch(\`/api/tarefas?status=\${status}\`, { signal })
  if (!res.ok) throw new Error(\`Erro \${res.status} ao buscar tarefas\`)
  return res.json()
}

function ColunaStatus({ status }: { status: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['tarefas', { status }],
    queryFn: ({ signal }) => buscarTarefas(status, signal),
  })
  ...
}` },
    { titulo: 'useMutation e invalidateQueries',
      texto: `<p>Para criar, editar ou excluir, use <code>useMutation</code>. Você chama <code>mutate(dados)</code> no handler e acompanha <code>isPending</code> (desabilitar o botão) e <code>isError</code>.</p>
<p>Depois que o servidor confirma, o cache ficou velho. <code>queryClient.invalidateQueries({ queryKey: ['tarefas'] })</code> marca como desatualizadas <b>todas</b> as queries cuja key começa com <code>['tarefas']</code> (é por prefixo) e refaz as que estão na tela. Essa é a abordagem <b>pessimista</b>: a tela só muda quando o servidor confirma. É simples, sempre correta e a escolha padrão.</p>`,
      linguagem: 'tsx',
      codigo: `function BotaoConcluir({ id }: { id: number }) {
  const queryClient = useQueryClient()

  const concluir = useMutation({
    mutationFn: (id: number) =>
      fetch(\`/api/tarefas/\${id}/concluir\`, { method: 'POST' }).then(r => {
        if (!r.ok) throw new Error('Falha ao concluir')
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tarefas'] }),
  })

  return (
    <button disabled={concluir.isPending} onClick={() => concluir.mutate(id)}>
      {concluir.isPending ? 'Concluindo…' : 'Concluir'}
    </button>
  )
}` },
    { titulo: 'Otimista vs pessimista',
      texto: `<p>Na atualização <b>otimista</b>, a tela muda na hora, antes da resposta, e você desfaz se der erro. Parece instantâneo, ótimo para ações frequentes e reversíveis (marcar como feita, arrastar cartão de coluna).</p>
<p>O roteiro no TanStack Query: em <code>onMutate</code>, cancele buscas em andamento da key (para não sobrescreverem), guarde o valor anterior com <code>getQueryData</code> e escreva o novo com <code>setQueryData</code> (de forma imutável). Em <code>onError</code>, restaure o anterior. Em <code>onSettled</code>, invalide para sincronizar com a verdade do servidor.</p>
<p>Prefira <b>pessimista</b> quando errar custa caro ou a resposta muda o resultado: pagamento, exclusão definitiva, ação que o servidor pode recusar por regra de negócio.</p>`,
      linguagem: 'tsx',
      codigo: `const chave = ['tarefas', { status: 'aberta' }]

const concluir = useMutation({
  mutationFn: concluirTarefa,
  onMutate: async (id: number) => {
    await queryClient.cancelQueries({ queryKey: chave })
    const anterior = queryClient.getQueryData<Tarefa[]>(chave)
    queryClient.setQueryData<Tarefa[]>(chave, ts => ts?.filter(t => t.id !== id))
    return { anterior }
  },
  onError: (_erro, _id, contexto) => {
    queryClient.setQueryData(chave, contexto?.anterior)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['tarefas'] }),
})` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'A API devolveu <code>[]</code> e a tela ficou em branco. Qual estado não foi tratado?',
      opcoes: ['Vazio', 'Carregando', 'Erro', 'Nenhum, tela em branco é o esperado'],
      certa: 0,
      dicas: ['A requisição deu certo.', 'Sucesso sem itens também precisa de mensagem.'],
      explica: `Sucesso com lista vazia é um estado próprio. Sem mensagem, o usuário não distingue "não há tarefas" de "quebrou".` },
    { tipo: 'escolha',
      pergunta: 'O filtro de status muda, mas a lista continua mostrando as tarefas do filtro anterior. Qual o bug?',
      codigo: `const { data } = useQuery({
  queryKey: ['tarefas'],
  queryFn: () => buscarTarefas(status),
})`,
      opcoes: [
        'status não está na queryKey, então o cache acha que é o mesmo dado',
        'Falta chamar refetch() num useEffect',
        'queryFn deveria ser async',
        'useQuery não aceita variáveis na queryFn',
      ],
      certa: 0,
      dicas: ['O que identifica o dado no cache?', 'Tudo o que muda o resultado vai na key.'],
      explica: `A key é a identidade do cache. Com <code>['tarefas', { status }]</code>, cada filtro tem sua entrada e a troca dispara a busca. Um useEffect com refetch é remendo.` },
    { tipo: 'completar',
      pergunta: 'Complete a busca com TanStack Query:',
      codigo: `const { data, isPending, isError } = [[0]]({
  [[1]]: ['tarefas', { responsavelId }],
  [[2]]: () => buscarTarefas(responsavelId),
})`,
      respostas: [['useQuery'], ['queryKey'], ['queryFn']],
      dicas: ['O hook de leitura.', 'Uma opção identifica, outra busca.'],
      explica: `<code>queryKey</code> identifica e versiona o cache; <code>queryFn</code> é a função assíncrona que retorna os dados ou lança erro.` },
    { tipo: 'escolha',
      pergunta: 'A API responde 500, mas o componente nunca entra em <code>isError</code>. Por quê?',
      codigo: `queryFn: () => fetch('/api/tarefas').then(r => r.json())`,
      opcoes: [
        'fetch só rejeita em falha de rede; é preciso checar r.ok e lançar',
        'TanStack Query ignora status HTTP por padrão',
        'Faltou o onError no useQuery',
      ],
      certa: 0,
      dicas: ['O que o fetch faz com status 500?', 'A queryFn precisa rejeitar para contar como erro.'],
      explica: `Para o <code>fetch</code>, um 500 é uma resposta válida. Sem <code>if (!r.ok) throw ...</code>, o corpo de erro vira <code>data</code>. (O <code>onError</code> em useQuery foi removido na v5.) Clientes como axios já rejeitam em 4xx/5xx.` },
    { tipo: 'montar',
      pergunta: 'Monte a invalidação após criar uma tarefa:',
      certa: ['onSuccess: () =>', 'queryClient.invalidateQueries(', "{ queryKey: ['tarefas'] }", ')'],
      extras: ['onMutate: () =>', 'queryClient.setQueryData(', 'useQuery('],
      dicas: ['Depois que o servidor confirma.', 'Marcar como velho e refazer.'],
      explica: `Invalidar em <code>onSuccess</code> é o fluxo pessimista: o servidor confirma e as queries com prefixo <code>['tarefas']</code> são refeitas.` },
    { tipo: 'escolha',
      pergunta: 'Na atualização otimista, por que chamar <code>cancelQueries</code> no começo do <code>onMutate</code>?',
      opcoes: [
        'Para uma busca em andamento não chegar depois e sobrescrever a mudança otimista',
        'Para economizar banda',
        'Porque setQueryData falha se houver busca ativa',
      ],
      certa: 0,
      dicas: ['Pense em ordem de chegada.', 'Uma resposta antiga pode apagar o que você acabou de escrever no cache.'],
      explica: `Uma busca disparada antes da mutação traria o estado antigo e desfaria a mudança na tela. Cancelar evita essa corrida; o <code>onSettled</code> busca de novo depois.` },
    { tipo: 'escolha',
      pergunta: 'Qual ação é a melhor candidata a atualização <b>otimista</b>?',
      opcoes: [
        'Marcar uma tarefa como concluída no quadro',
        'Excluir definitivamente um processo',
        'Confirmar um pagamento',
        'Criar um registro cujo número de protocolo vem do servidor',
      ],
      certa: 0,
      dicas: ['Rápida, frequente, reversível.', 'Onde errar é barato?'],
      explica: `Concluir é frequente, quase sempre dá certo e é fácil de desfazer. Exclusão definitiva e pagamento pedem confirmação do servidor; o protocolo só existe depois da resposta.` },
    { tipo: 'escolha',
      pergunta: 'Onde guardar cada coisa: lista de tarefas da API e "qual tarefa está aberta no modal"?',
      opcoes: [
        'Lista no cache do TanStack Query; tarefa aberta em useState (ou na URL)',
        'As duas em useState no App',
        'As duas no cache do TanStack Query',
        'Lista em Context; tarefa aberta no localStorage',
      ],
      certa: 0,
      dicas: ['Uma mora no servidor, a outra só existe no navegador.', 'Estado de servidor precisa de revalidação.'],
      explica: `Dado da API é estado de servidor: cache, revalidação e invalidação. Modal aberto é estado de UI, local e síncrono. Copiar a lista para useState cria uma segunda fonte da verdade que envelhece.` },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: por que usar TanStack Query em vez de <code>useEffect</code> + <code>fetch</code>?',
      avalia: `Se a pessoa distingue estado de servidor de estado de UI e conhece os problemas que a biblioteca resolve.`,
      resposta: `<p>Dados da API são estado de servidor: uma cópia em cache de algo que muda fora do meu controle. Fazer isso com useEffect e fetch obriga a reimplementar em cada tela loading, erro, cancelamento e condição de corrida, e mesmo assim fico sem cache, sem deduplicação entre componentes e sem revalidação.</p>
<p>O TanStack Query resolve isso de forma declarativa: a queryKey identifica o dado, requisições iguais são compartilhadas, ele revalida ao focar a janela e repete em falha. Nas escritas, uso useMutation e invalidateQueries; e, para ações rápidas e reversíveis, atualização otimista com rollback. O estado de UI continua em useState.</p>`,
      pontos: ['estado de servidor vs estado de UI', 'cache e deduplicação pela queryKey', 'loading/erro/corrida resolvidos', 'useMutation + invalidateQueries', 'otimista quando reversível'],
      evitar: ['dizer que é só um wrapper do fetch', 'copiar data para useState'],
      dicas: ['Comece pela diferença entre os dois tipos de estado.', 'Cite pelo menos três coisas que a biblioteca faz por você.'] },
  ],
})

const ordem = CURSO.partes.flatMap(p => p.ids)
const LICOES = ordem.map(id => MODULOS.find(m => m.id === id)).filter(Boolean)
globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}
globalThis.TRILHAS_CARREGADAS["react"] = { CURSO, LICOES, MODULOS }
})()
