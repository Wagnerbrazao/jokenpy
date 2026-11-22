MODULOS.push({
  id: 'react-jsx',
  titulo: 'JSX e componentes',
  icone: '🧩',
  aprende: 'JSX, componentes como funções, expressões entre chaves, className, fragmentos e renderização condicional',
  porque: 'Toda tela React é uma árvore de componentes escritos em JSX; sem esse modelo mental, o resto não encaixa.',
  gancho: {
    titulo: 'O zero intruso',
    pergunta: 'Não há nenhuma pendência. O que aparece na tela?',
    linguagem: 'tsx',
    codigo: `const pendentes = 0

return (
  <p>{pendentes && <b>Há pendências!</b>}</p>
)`,
    opcoes: ['Nada', '0', 'false', 'Há pendências!'],
    certa: 1,
    revelacao: '<code>0 &amp;&amp; x</code> devolve <code>0</code>, e o React desenha números (só ignora <code>false</code>, <code>null</code> e <code>undefined</code>). Nesta lição você vai ver que JSX é JavaScript puro, com as regras de expressão do JS, e como escrever condicionais sem esse susto.',
  },
  videos: [
    { id: '9iKNxnFJY_Q', titulo: 'Curso React: Entendendo o JSX - #03', canal: 'Matheus Battisti - Hora de Codar',
      duracao: '13:04', idioma: 'pt',
      nota: 'Mostra que o JSX vira JavaScript e como usar chaves para expressões; repare no <code>className</code> e no elemento raiz único.' },
  ],
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
