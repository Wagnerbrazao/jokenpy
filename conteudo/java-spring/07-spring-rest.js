MODULOS.push({
  id: 'spring-rest',
  titulo: 'Endpoints REST',
  icone: '🌐',
  aprende: '@RestController, mapeamentos, parâmetros, DTOs, ResponseEntity e Jackson',
  porque: 'O controller é a cara da sua API: status errado ou contrato mal definido quebra o front e o sistema do órgão parceiro que consome você.',
  gancho: {
    titulo: 'Criou, mas 201?',
    pergunta: 'No NestJS, <code>@Post()</code> responde 201. Que status este endpoint devolve ao criar um atendimento?',
    linguagem: 'java',
    codigo: `@PostMapping("/atendimentos")
public AtendimentoResponse criar(@RequestBody NovoAtendimento req) {
    return service.criar(req);
}`,
    opcoes: ['201 Created', '200 OK', '204 No Content'],
    certa: 1,
    revelacao: 'No Spring, todo método com retorno responde <b>200</b> por padrão, inclusive o POST. Para 201 com <code>Location</code>, você devolve <code>ResponseEntity.created(uri)</code>. Nesta lição você vai ver mapeamentos, parâmetros, DTOs e os status certos.',
  },
  resumo: [
    '<code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>: o retorno vira JSON',
    '<code>@GetMapping("/{id}")</code> + <code>@PathVariable</code>; filtros com <code>@RequestParam</code>; JSON com <code>@RequestBody</code>',
    'No Spring, POST devolve <b>200</b> por padrão. Para 201, use <code>ResponseEntity.created(uri)</code>',
    '<code>ResponseEntity.noContent()</code> = 204; <code>notFound()</code> = 404; <code>ResponseEntity.of(optional)</code> = 200 ou 404',
    'Records entram e saem como JSON pelo <b>Jackson</b>, sem configuração',
  ],
  ensino: [
    { titulo: '@RestController e os mapeamentos',
      texto: `<p><code>@RestController</code> marca a classe como bean web e diz que o retorno dos métodos é o <b>corpo</b> da resposta, serializado em JSON pelo Jackson. <code>@RequestMapping("/api/assistidos")</code> na classe define o prefixo, e cada método usa <code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@PatchMapping</code> ou <code>@DeleteMapping</code>.</p>
<p>Variáveis de caminho usam <b>chaves</b>: <code>"/{id}"</code>. O controller fica fino: recebe, converte o DTO e delega para o service, que é injetado pelo construtor como qualquer bean.</p>
<p><b>Erro comum:</b> usar <code>@Controller</code> sem <code>@ResponseBody</code>. O Spring MVC entende o retorno String como <b>nome de view</b> e responde 404/500 procurando um template.</p>
<p><b>No NestJS/TypeScript:</b> <code>@Controller('assistidos')</code> vira <code>@RestController</code> + <code>@RequestMapping("/api/assistidos")</code>, <code>@Get(':id')</code> vira <code>@GetMapping("/{id}")</code>. Note o <code>:id</code> do Express virando <code>{id}</code>.</p>`,
      linguagem: 'java',
      codigo: `@RestController
@RequestMapping("/api/assistidos")
public class AssistidoController {
    private final AssistidoService service;

    public AssistidoController(AssistidoService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public AssistidoResposta buscar(@PathVariable Long id) {
        return service.buscar(id);
    }
}` },
    { titulo: '@PathVariable, @RequestParam e @RequestBody',
      texto: `<p><code>@PathVariable</code> lê um trecho da URL e converte para o tipo do parâmetro: <code>/api/processos/abc</code> num <code>Long id</code> devolve <b>400</b> sozinho. <code>@RequestParam</code> lê a query string (<code>?comarca=Goiânia&amp;pagina=2</code>). Ele é <b>obrigatório</b> por padrão (sem ele, 400); use <code>required = false</code> ou <code>defaultValue</code>.</p>
<p><code>@RequestBody</code> desserializa o JSON do corpo para um objeto, normalmente um record. Content-Type diferente de JSON resulta em <b>415</b>; JSON malformado, em <b>400</b>.</p>
<p><b>Pegadinha:</b> esquecer <code>@RequestBody</code> não dá erro. O Spring trata o parâmetro como <i>model attribute</i>, preenche a partir de query e formulário, e o seu DTO chega com <b>todos os campos null</b>.</p>
<p><b>No NestJS/TypeScript:</b> <code>@Param('id', ParseIntPipe)</code> vira <code>@PathVariable Long id</code> (a conversão vem do tipo), <code>@Query('comarca')</code> vira <code>@RequestParam String comarca</code> e <code>@Body() dto</code> vira <code>@RequestBody CriarAssistidoRequest dto</code>.</p>`,
      linguagem: 'java',
      codigo: `@GetMapping
public List<ProcessoResumo> listar(
        @RequestParam(required = false) String comarca,
        @RequestParam(defaultValue = "0") int pagina) {
    return service.listar(comarca, pagina);
}

@PutMapping("/{id}/status")
public ProcessoResumo mudarStatus(@PathVariable Long id,
                                  @RequestBody MudarStatusRequest corpo) {
    return service.mudarStatus(id, corpo.status());
}` },
    { titulo: 'DTOs com records e o Jackson',
      texto: `<p>Use records separados para <b>entrada</b> (<code>CriarAtendimentoRequest</code>) e <b>saída</b> (<code>AtendimentoResposta</code>). Assim você não expõe a entidade JPA (nem campos internos, nem relacionamentos preguiçosos) e o contrato da API não muda quando a tabela muda.</p>
<p>O Jackson serializa os componentes do record (ou os getters de uma classe) com os mesmos nomes. Datas <code>LocalDate</code> saem no formato ISO (<code>"2026-11-21"</code>) com a configuração do Boot. Para ajustes, use as anotações: <code>@JsonProperty("nome_social")</code> renomeia, <code>@JsonIgnore</code> esconde, <code>@JsonFormat</code> formata.</p>
<p><b>No NestJS/TypeScript:</b> é o seu par de DTOs com <code>class-transformer</code> (<code>@Expose</code>, <code>@Exclude</code>). No Spring a serialização acontece sozinha na saída do controller, sem interceptor.</p>`,
      linguagem: 'java',
      codigo: `public record CriarAtendimentoRequest(Long assistidoId, String area, LocalDate data) {}

public record AtendimentoResposta(
        Long id,
        String area,
        LocalDate data,
        @JsonProperty("nome_assistido") String nomeAssistido) {}

// Saída:
// {"id":42,"area":"Família","data":"2026-11-21","nome_assistido":"Maria"}` },
    { titulo: 'ResponseEntity e os status certos',
      texto: `<p>Por padrão, todo método responde <b>200</b>, inclusive POST e métodos <code>void</code> (200 com corpo vazio). Para controlar status e cabeçalhos, devolva <code>ResponseEntity&lt;T&gt;</code>, ou anote o método com <code>@ResponseStatus(HttpStatus.NO_CONTENT)</code> quando o status for sempre o mesmo.</p>
<p>Os casos clássicos: criação → <b>201</b> com cabeçalho <code>Location</code> apontando o recurso novo (<code>ResponseEntity.created(uri).body(dto)</code>); remoção → <b>204</b> (<code>noContent().build()</code>); não encontrado → <b>404</b> (<code>notFound().build()</code>, ou <code>ResponseEntity.of(optional)</code>, que devolve 200 com o valor ou 404).</p>
<p>Em projeto grande, o 404 costuma vir de uma exceção de domínio traduzida num <code>@RestControllerAdvice</code>. Isso fica para o próximo módulo.</p>
<p><b>No NestJS/TypeScript:</b> no Nest, POST já devolve <b>201</b> e você usa <code>@HttpCode(204)</code> para mudar. No Spring, POST devolve 200, e quem vem do Nest esquece do 201.</p>`,
      linguagem: 'java',
      codigo: `@PostMapping
public ResponseEntity<AtendimentoResposta> criar(@RequestBody CriarAtendimentoRequest req) {
    AtendimentoResposta criado = service.criar(req);
    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}").buildAndExpand(criado.id()).toUri();
    return ResponseEntity.created(location).body(criado);   // 201 + Location
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> cancelar(@PathVariable Long id) {
    service.cancelar(id);
    return ResponseEntity.noContent().build();              // 204
}

@GetMapping("/{id}")
public ResponseEntity<AtendimentoResposta> buscar(@PathVariable Long id) {
    return ResponseEntity.of(service.buscarOpcional(id));   // 200 ou 404
}` },
  ],
  exercicios: [
    { tipo: 'completar',
      pergunta: 'Traduza do NestJS para Spring: <code>@Get(\':id\') buscar(@Param(\'id\') id)</code>.',
      codigo: `@[[0]]("/{id}")
public ProcessoResumo buscar(@[[1]] Long id) {
    return service.buscar(id);
}`,
      respostas: [['GetMapping'], ['PathVariable']],
      dicas: ['Cada verbo HTTP tem sua anotação <code>@XxxMapping</code>.', 'O valor vem do caminho (path), não da query.'],
      explica: '<code>@GetMapping("/{id}")</code> mapeia o GET, e <code>@PathVariable</code> liga <code>{id}</code> ao parâmetro pelo nome. A conversão para <code>Long</code> é automática, e um valor não numérico vira 400.' },
    { tipo: 'escolha',
      pergunta: 'O método abaixo recebe um POST com JSON <code>{"nome":"Maria","cpf":"123"}</code>. O que chega em <code>req</code>?',
      codigo: `@PostMapping
public AssistidoResposta criar(CriarAssistidoRequest req) { ... }`,
      opcoes: [
        'Os dados do JSON normalmente',
        'Um objeto com nome e cpf null, sem erro',
        'Erro 415 Unsupported Media Type',
      ],
      certa: 1,
      dicas: ['Falta uma anotação no parâmetro.', 'Sem ela, o Spring preenche o objeto a partir de query e formulário.'],
      explica: 'Sem <code>@RequestBody</code>, o parâmetro é tratado como <i>model attribute</i> e preenchido com parâmetros da requisição, não com o corpo JSON. O resultado são campos null, sem nenhum erro. É um bug silencioso clássico.' },
    { tipo: 'escolha',
      pergunta: 'Este endpoint cria um atendimento. Que status ele devolve?',
      codigo: `@PostMapping
public AtendimentoResposta criar(@RequestBody CriarAtendimentoRequest req) {
    return service.criar(req);
}`,
      opcoes: ['201 Created', '200 OK', '204 No Content', '202 Accepted'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['O Spring não deduz o status pelo verbo.', 'Quem dá 201 automático no POST é o NestJS.'],
      explica: 'No Spring MVC o padrão é 200 para qualquer verbo. Para 201, devolva <code>ResponseEntity.created(location).body(...)</code> ou use <code>@ResponseStatus(HttpStatus.CREATED)</code>. O 201 automático do POST é comportamento do NestJS.' },
    { tipo: 'completar',
      pergunta: 'Complete para devolver 201 com o cabeçalho <code>Location</code>:',
      codigo: `URI location = ServletUriComponentsBuilder.fromCurrentRequest()
    .path("/{id}").buildAndExpand(criado.id()).toUri();
return ResponseEntity.[[0]](location).body(criado);`,
      respostas: [['created']],
      dicas: ['O nome do método é o nome do status em inglês.', 'Ele recebe a URI e já define o cabeçalho.'],
      explica: '<code>ResponseEntity.created(uri)</code> define o status 201 e o cabeçalho <code>Location</code>. O <code>ServletUriComponentsBuilder</code> parte da URL atual (<code>/api/atendimentos</code>) e acrescenta o id, gerando algo como <code>http://host/api/atendimentos/42</code>.' },
    { tipo: 'escolha',
      pergunta: 'Um <code>@DeleteMapping</code> com retorno <code>void</code> e sem outras anotações responde com qual status?',
      opcoes: ['204 No Content', '200 OK com corpo vazio', '202 Accepted'],
      certa: 1,
      dicas: ['O Spring não deduz o status pelo retorno void.', 'Existe <code>@ResponseStatus</code> justamente para isso.'],
      explica: '<code>void</code> responde 200 com corpo vazio. Para o 204 semântico, anote com <code>@ResponseStatus(HttpStatus.NO_CONTENT)</code> ou devolva <code>ResponseEntity.noContent().build()</code>.' },
    { tipo: 'montar',
      pergunta: 'Monte o parâmetro opcional de filtro por comarca na query string:',
      certa: ['@RequestParam(required = false)', 'String', 'comarca'],
      extras: ['@PathVariable', '@Query("comarca")', '@RequestBody'],
      dicas: ['Query string é ___ param.', 'Por padrão ele é obrigatório; você precisa desligar isso.'],
      explica: '<code>@RequestParam</code> lê <code>?comarca=...</code>, e <code>required = false</code> deixa o valor null quando ausente (sem isso, falta do parâmetro vira 400). <code>@Query</code> é do Nest (e, no Spring Data, é outra coisa: consulta JPQL), e <code>@PathVariable</code> lê o caminho.' },
    { tipo: 'escolha',
      pergunta: 'Qual forma devolve 200 com o corpo quando o Optional tem valor e 404 quando está vazio?',
      opcoes: [
        'return ResponseEntity.of(service.buscarOpcional(id));',
        'return ResponseEntity.ok(service.buscarOpcional(id));',
        'return service.buscarOpcional(id).get();',
      ],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['Uma das opções serializa o próprio Optional.', 'Outra lança <code>NoSuchElementException</code>, que vira 500.'],
      explica: '<code>ResponseEntity.of(optional)</code> faz exatamente isso. <code>ok(optional)</code> responde 200 sempre (vazio vira <code>null</code> no corpo), e <code>.get()</code> num vazio lança <code>NoSuchElementException</code>, que sem tratamento vira 500. Uma alternativa equivalente: <code>.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build())</code>.' },
    { tipo: 'escolha',
      pergunta: 'O front espera o campo <code>nome_social</code>, mas o componente do record se chama <code>nomeSocial</code>. Como ajustar só esse campo?',
      opcoes: [
        'Renomear o componente para <code>nome_social</code>, contra a convenção Java',
        'Anotar o componente com <code>@JsonProperty("nome_social")</code>',
        'Anotar o record com <code>@Column(name = "nome_social")</code>',
      ],
      certa: 1,
      dicas: ['Quem converte para JSON é o Jackson.', '<code>@Column</code> é de JPA, ou seja, do banco.'],
      explica: '<code>@JsonProperty</code> muda o nome no JSON, nos dois sentidos, sem quebrar a convenção camelCase do Java. <code>@Column</code> mapeia coluna de banco e não afeta o JSON. Para a API inteira em snake_case, existe a propriedade <code>spring.jackson.property-naming-strategy</code>.' },
  ],
})
