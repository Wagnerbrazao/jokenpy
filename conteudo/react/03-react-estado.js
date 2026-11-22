MODULOS.push({
  id: 'react-estado',
  titulo: 'Estado e eventos',
  icone: '🔁',
  aprende: 'useState, eventos, atualização funcional, imutabilidade, estado derivado e levantar estado',
  porque: 'A maioria dos bugs de React em produção é estado mutado, duplicado ou no componente errado.',
  gancho: {
    titulo: 'Três cliques em um',
    pergunta: 'Começando em 0, quanto vale <code>atendidos</code> depois de um clique?',
    linguagem: 'tsx',
    codigo: `const [atendidos, setAtendidos] = useState(0)

function registrarTres() {
  setAtendidos(atendidos + 1)
  setAtendidos(atendidos + 1)
  setAtendidos(atendidos + 1)
}`,
    opcoes: ['3', '1', '0'],
    certa: 1,
    opcoesCodigo: true,
    revelacao: 'Naquela renderização <code>atendidos</code> vale 0 nas três linhas, então as três pedem "mude para 1". Nesta lição você vai ver por que o estado é um retrato de cada render, quando usar <code>setAtendidos(a =&gt; a + 1)</code> e por que nunca mutar o estado.',
  },
  videos: [
    { id: 'mY9MLdifqe0', titulo: 'Explorando useState no React (conceito e importância)', canal: 'Rocketseat',
      duracao: '5:11', idioma: 'pt',
      nota: 'Por que uma variável comum não re-renderiza e o <code>useState</code> sim; base para entender o estado como retrato.' },
  ],
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
