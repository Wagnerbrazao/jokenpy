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
