MODULOS.push({
  id: 'react-dados',
  titulo: 'Dados da API',
  icone: '🌐',
  aprende: 'loading, erro e vazio, TanStack Query (useQuery, useMutation, invalidateQueries), atualização otimista e onde guardar cada estado',
  porque: 'O painel só é útil com dados reais, e é aqui que cache, carregamento e erro separam um app amador de um profissional.',
  gancho: {
    titulo: 'O filtro ignorado',
    pergunta: 'A pessoa troca o filtro de "abertas" para "concluídas". O que a lista mostra?',
    linguagem: 'tsx',
    codigo: `const [status, setStatus] = useState('abertas')

const { data } = useQuery({
  queryKey: ['tarefas'],
  queryFn: () => buscarTarefas(status),
})`,
    opcoes: ['As concluídas, buscadas de novo', 'Continua mostrando as abertas', 'Entra em loop de requisições'],
    certa: 1,
    revelacao: 'O TanStack Query identifica o dado pela <code>queryKey</code>; como ela não mudou, ele entrega o cache das abertas e não busca de novo. Nesta lição você vai ver como montar a key com todos os parâmetros e tratar carregando, erro, vazio e mutações.',
  },
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
