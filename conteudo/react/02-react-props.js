MODULOS.push({
  id: 'react-props',
  titulo: 'Props e listas',
  icone: '📦',
  aprende: 'props, children, desestruturação, listas com map e key, composição e props tipadas com TypeScript',
  porque: 'Props são o contrato entre componentes: telas grandes só ficam manuteníveis quando cada peça recebe exatamente o que precisa.',
  gancho: {
    titulo: 'A anotação que pulou',
    pergunta: 'Você digita "urgente" no campo da <b>primeira</b> tarefa e depois a exclui da lista. O que acontece?',
    linguagem: 'tsx',
    codigo: `<ul>
  {tarefas.map((t, i) => (
    <li key={i}>
      {t.titulo} <input placeholder="nota" />
    </li>
  ))}
</ul>`,
    opcoes: ['O campo some junto com a tarefa', '"urgente" aparece na tarefa que era a segunda', 'O React avisa no console e recria a lista'],
    certa: 1,
    revelacao: 'Com <code>key={i}</code>, a nova primeira tarefa herda a key <code>0</code>, e o React reaproveita o <code>&lt;li&gt;</code> e o input que já existiam ali, com o texto digitado. Nesta lição você vai ver como props e keys identificam cada item e por que o índice quebra listas que mudam.',
  },
  videos: [
    { id: '00nfvN2UTZc', titulo: 'Simplificando o conceito de componentes e propriedades no React', canal: 'Rocketseat',
      duracao: '8:49', idioma: 'pt',
      nota: 'Props como argumentos só de leitura que o pai passa ao filho, a base do contrato entre componentes deste módulo.' },
  ],
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
