MODULOS.push({
  id: 'react-formularios',
  titulo: 'Formulários',
  icone: '📝',
  aprende: 'inputs controlados, onSubmit com preventDefault, validação, erros acessíveis, select e checkbox',
  porque: 'Quase toda tela de sistema interno é um formulário, e é onde o usuário mais sente bugs e falta de acessibilidade.',
  gancho: {
    titulo: 'O campo que não digita',
    pergunta: 'A pessoa clica no campo e digita "Maria". O que acontece?',
    linguagem: 'tsx',
    codigo: `function BuscaAssistido() {
  const [nome, setNome] = useState('')
  return <input value={nome} />
}`,
    opcoes: ['Aparece "Maria" normalmente', 'Nada aparece: o campo fica travado', 'A tela quebra com erro'],
    certa: 1,
    revelacao: 'Com <code>value</code> vindo do estado, o React redesenha sempre o valor do estado, e sem <code>onChange</code> o estado nunca muda (o console só avisa). Nesta lição você vai ver inputs controlados, submit sem recarregar a página e erros de validação acessíveis.',
  },
  videos: [
    { id: 'NtYO03Jq3EE', titulo: 'Como manipular dados de formulários no React JS', canal: 'Fabio Bergmann',
      duracao: '9:11', idioma: 'pt',
      nota: 'Inputs controlados com <code>value</code> + <code>onChange</code> e um estado por formulário; repare no <code>preventDefault</code> no submit.' },
  ],
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
