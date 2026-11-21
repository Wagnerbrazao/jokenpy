MODULOS.push({
  id: 'spring-jpa',
  titulo: 'Spring Data JPA',
  icone: '🗄️',
  aprende: '@Entity, JpaRepository, derived queries, @Query e paginação',
  porque: 'Quase toda API Spring de órgão público grava em Postgres ou Oracle via JPA, e é aí que moram os bugs de desempenho.',
  resumo: [
    '<code>@Entity</code> mapeia uma classe para uma tabela; precisa de <code>@Id</code> e de um construtor sem argumentos',
    '<code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code> usa a coluna identity/serial do Postgres',
    '<code>interface ProcessoRepository extends JpaRepository&lt;Processo, Long&gt;</code> já traz <code>save</code>, <code>findById</code>, <code>findAll</code>, <code>delete</code>',
    'O Spring gera a consulta a partir do nome: <code>findByNomeContainingIgnoreCase</code>; nome errado derruba a aplicação na subida',
    '<code>@Query</code> usa <b>JPQL</b>: nomes de classe e atributo, não de tabela e coluna',
    '<code>Pageable</code> entra, <code>Page&lt;T&gt;</code> sai; páginas começam em <b>0</b>',
    'Entidade não sai pela API: converta para DTO (record)',
  ],
  ensino: [
    { titulo: '@Entity: a classe que vira tabela',
      texto: `<p>JPA é a especificação (<code>jakarta.persistence</code>), Hibernate é a implementação, e Spring Data JPA é a camada que gera repositórios. Uma entidade é uma classe comum com <code>@Entity</code> e um <code>@Id</code>.</p>
<p>Regras que pegam quem vem do TypeScript: a entidade precisa de um <b>construtor sem argumentos</b> (pode ser <code>protected</code>), não pode ser <code>final</code> e, por isso, <b>não pode ser record</b>. O Hibernate cria proxies e preenche os campos por reflexão.</p>
<p><b>Pegadinha:</b> enum sem <code>@Enumerated(EnumType.STRING)</code> é gravado como número (ordinal). Inserir um valor novo no meio do enum embaralha os dados antigos.</p>
<p><b>No NestJS:</b> é o <code>@Entity()</code> + <code>@PrimaryGeneratedColumn()</code> + <code>@Column()</code> do TypeORM. No Prisma, o equivalente é o <code>model</code> do <code>schema.prisma</code>.</p>`,
      linguagem: 'java',
      codigo: `@Entity
@Table(name = "processos")
public class Processo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 25)
    private String numero;               // 0001234-56.2025.8.09.0051

    @Column(name = "nome_assistido", nullable = false)
    private String nomeAssistido;

    @Enumerated(EnumType.STRING)
    private StatusProcesso status;

    protected Processo() {}              // exigido pelo JPA

    public Processo(String numero, String nomeAssistido) {
        this.numero = numero;
        this.nomeAssistido = nomeAssistido;
        this.status = StatusProcesso.ATIVO;
    }
    // getters...
}` },
    { titulo: 'JpaRepository: o repositório que você não escreve',
      texto: `<p>Você declara uma <b>interface</b> que estende <code>JpaRepository&lt;Entidade, TipoDoId&gt;</code>, e o Spring cria a implementação em tempo de execução e a registra como bean. Não há classe para escrever nem <code>@Repository</code> obrigatório.</p>
<p>Métodos que você ganha: <code>save</code> (insere ou atualiza), <code>findById</code> (devolve <code>Optional</code>), <code>findAll</code>, <code>existsById</code>, <code>deleteById</code>, <code>count</code>.</p>
<p><b>Por que <code>Optional</code>:</b> obriga você a decidir o que fazer quando não existe. O padrão é <code>orElseThrow(() -&gt; new ProcessoNaoEncontradoException(id))</code>, que o advice transforma em 404.</p>
<p><b>No NestJS:</b> lembra o <code>Repository&lt;Processo&gt;</code> injetado com <code>@InjectRepository</code> no TypeORM, mas aqui a interface é sua e pode ganhar métodos novos só pelo nome.</p>`,
      linguagem: 'java',
      codigo: `public interface ProcessoRepository extends JpaRepository<Processo, Long> {
}

@Service
class ProcessoService {
    private final ProcessoRepository repo;
    ProcessoService(ProcessoRepository repo) { this.repo = repo; }

    Processo buscar(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ProcessoNaoEncontradoException(id));
    }
}` },
    { titulo: 'Derived queries e @Query',
      texto: `<p>O Spring Data lê o nome do método e gera a consulta: <code>findBy</code> + atributo + operador. <code>Containing</code> vira <code>LIKE %x%</code>, <code>IgnoreCase</code> aplica <code>upper()</code>, <code>And</code>/<code>Or</code> combinam, <code>OrderBy...Desc</code> ordena. Também existem <code>existsBy</code>, <code>countBy</code> e <code>findFirstBy</code>.</p>
<p>O nome usa o <b>atributo Java</b> (<code>nomeAssistido</code>), não a coluna (<code>nome_assistido</code>). Errou o nome? A aplicação <b>não sobe</b>, com <code>PropertyReferenceException: No property 'nome' found for type 'Processo'</code>. É bom: o erro aparece no deploy, não em produção às 3h.</p>
<p>Quando o nome fica gigante, use <code>@Query</code> com <b>JPQL</b>: a consulta fala de <code>Processo p</code> e <code>p.status</code>, não da tabela. Para SQL puro, <code>nativeQuery = true</code>.</p>
<p><b>No NestJS:</b> é o <code>find({ where: { nome: ILike('%x%') } })</code> do TypeORM ou o <code>findMany</code> do Prisma, só que declarado pelo nome do método.</p>`,
      linguagem: 'java',
      codigo: `public interface ProcessoRepository extends JpaRepository<Processo, Long> {

    List<Processo> findByNomeAssistidoContainingIgnoreCase(String nome);

    boolean existsByNumero(String numero);

    long countByStatus(StatusProcesso status);

    @Query("select p from Processo p where p.status = :status and p.comarca = :comarca")
    List<Processo> ativosDaComarca(@Param("status") StatusProcesso status,
                                   @Param("comarca") String comarca);
}` },
    { titulo: 'Paginação com Pageable e Page',
      texto: `<p>Qualquer método do repositório aceita um <code>Pageable</code> no fim e devolve <code>Page&lt;T&gt;</code>, que traz o conteúdo e os totais (<code>getContent()</code>, <code>getTotalElements()</code>, <code>getTotalPages()</code>). Para isso o Spring roda também um <code>count</code>.</p>
<p>No controller, declare <code>Pageable</code> como parâmetro e o Spring monta a partir de <code>?page=0&amp;size=20&amp;sort=nomeAssistido,asc</code>. A primeira página é <b>0</b>, não 1.</p>
<p><b>Cuidado ao devolver:</b> serializar o <code>PageImpl</code> direto gera um JSON instável (o Spring Data 3.3+ avisa no log). Prefira mapear com <code>page.map(...)</code> e devolver um DTO de página seu, ou o <code>PagedModel</code> do Spring Data.</p>
<p><b>No NestJS:</b> você faria <code>skip</code>/<code>take</code> no TypeORM e montaria o <code>{ data, total }</code> à mão.</p>`,
      linguagem: 'java',
      codigo: `public record PaginaResponse<T>(List<T> itens, long total, int pagina, int totalPaginas) {
    static <T> PaginaResponse<T> de(Page<T> p) {
        return new PaginaResponse<>(p.getContent(), p.getTotalElements(), p.getNumber(), p.getTotalPages());
    }
}

@GetMapping
PaginaResponse<ProcessoResponse> listar(@RequestParam(defaultValue = "") String nome, Pageable pageable) {
    Page<ProcessoResponse> pagina = repo
        .findByNomeAssistidoContainingIgnoreCase(nome, pageable)   // assinatura com Pageable no repo
        .map(ProcessoResponse::de);
    return PaginaResponse.de(pagina);
}

// em código: PageRequest.of(0, 20, Sort.by("criadoEm").descending())` },
    { titulo: 'Entidade fica dentro, DTO sai pela API',
      texto: `<p>Devolver a entidade no controller parece prático, mas traz problemas reais: expõe colunas internas, gera ciclo infinito de JSON em relacionamentos bidirecionais, dispara consultas lazy durante a serialização e acopla o contrato da API ao esquema do banco.</p>
<p>Na entrada, aceitar a entidade permite <b>mass assignment</b>: o cliente manda <code>"status": "ARQUIVADO"</code> e o campo é gravado.</p>
<p>O padrão é: record de entrada (validado), record de saída com um método de fábrica <code>de(entidade)</code>, e o service fazendo a conversão. Para leitura pesada, o Spring Data também aceita <b>projeções</b>: o método do repositório pode devolver o record direto.</p>
<p><b>No NestJS:</b> é a separação entre entity do TypeORM e DTO de resposta, ou o <code>select</code> do Prisma para não vazar campos.</p>`,
      linguagem: 'java',
      codigo: `public record ProcessoResponse(Long id, String numero, String nomeAssistido, StatusProcesso status) {
    public static ProcessoResponse de(Processo p) {
        return new ProcessoResponse(p.getId(), p.getNumero(), p.getNomeAssistido(), p.getStatus());
    }
}` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'Por que esta entidade não funciona?',
      codigo: `@Entity
public record Assistido(@Id Long id, String nome, String cpf) {}`,
      opcoes: ['Records são finais e não têm construtor sem argumentos', 'Falta @Table', 'Falta @Column em cada campo', 'O id precisa ser int'], certa: 0,
      dicas: ['Pense em como o Hibernate cria e preenche instâncias.', 'Ele precisa instanciar vazio e, às vezes, criar uma subclasse (proxy).'],
      explica: 'O JPA exige construtor sem argumentos e classe não final para proxies. Records são finais e imutáveis, então não servem como entidade. <code>@Table</code> e <code>@Column</code> são opcionais: sem eles o nome é derivado da classe e do atributo.' },
    { tipo: 'completar', pergunta: 'Complete o mapeamento do id gerado pela coluna identity do Postgres:',
      codigo: `@[[0]]
@[[1]](strategy = GenerationType.[[2]])
private Long id;`,
      respostas: [['Id'], ['GeneratedValue'], ['IDENTITY']],
      dicas: ['Uma anotação marca a chave primária, outra diz que o valor é gerado.', 'A estratégia que usa a coluna auto-incremento do banco.'],
      explica: '<code>@Id</code> marca a chave, <code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code> deixa o banco gerar. A alternativa <code>SEQUENCE</code> usa uma sequence do Postgres e permite inserções em lote mais eficientes.' },
    { tipo: 'montar', pergunta: 'Monte a declaração do repositório de atendimentos (id <code>Long</code>):',
      certa: ['public', 'interface', 'AtendimentoRepository', 'extends', 'JpaRepository<Atendimento, Long>'],
      extras: ['class', 'implements', 'JpaRepository<Long, Atendimento>', '@Entity'],
      dicas: ['Você não escreve a implementação.', 'A ordem dos genéricos é: entidade, depois tipo do id.'],
      explica: 'É uma <b>interface</b> que <b>estende</b> <code>JpaRepository&lt;Atendimento, Long&gt;</code>. O Spring gera a implementação. Inverter os genéricos compila mal ou falha na subida.' },
    { tipo: 'escolha', pergunta: 'A entidade tem o atributo <code>nomeAssistido</code> (coluna <code>nome_assistido</code>). Você declara <code>findByNomeContainingIgnoreCase(String nome)</code>. O que acontece?',
      opcoes: ['A aplicação falha na subida com PropertyReferenceException', 'Compila e devolve lista vazia', 'O Spring busca na coluna nome_assistido', 'Só falha quando o método é chamado'], certa: 0,
      dicas: ['O nome do método é lido quando o repositório é criado.', 'Ele procura um atributo <code>nome</code> na entidade.'],
      explica: 'As derived queries são validadas na criação do bean. Não existe atributo <code>nome</code>, então a aplicação não sobe: <code>No property \'nome\' found for type \'Processo\'</code>. O nome certo seria <code>findByNomeAssistidoContainingIgnoreCase</code>.' },
    { tipo: 'escolha', pergunta: 'Qual <code>@Query</code> está correta em JPQL para a entidade <code>Processo</code> mapeada na tabela <code>processos</code>?',
      opcoes: ['select p from Processo p where p.status = :status', 'select * from processos where status = :status', 'select p from processos p where p.status = :status', 'select p.* from Processo p where status = ?status'], certa: 0, opcoesCodigo: true,
      dicas: ['JPQL fala de objetos, não de tabelas.', 'Use o nome da classe e um alias.'],
      explica: 'JPQL usa o nome da <b>entidade</b> e de seus atributos e seleciona o alias. <code>select * from processos</code> é SQL nativo: só funciona com <code>nativeQuery = true</code>.' },
    { tipo: 'completar', pergunta: 'Complete o método paginado do repositório:',
      codigo: `[[0]]<Processo> findByStatus(StatusProcesso status, [[1]] pageable);`,
      respostas: [['Page'], ['Pageable']],
      dicas: ['Um tipo entra com página e tamanho; outro sai com conteúdo e totais.', 'Os dois começam com "Page".'],
      explica: '<code>Pageable</code> descreve página, tamanho e ordenação; <code>Page&lt;Processo&gt;</code> traz o conteúdo e o total (o Spring roda um <code>count</code> extra). Se não precisar do total, <code>Slice</code> evita esse count.' },
    { tipo: 'escolha', pergunta: 'O front chama <code>GET /processos?page=1&amp;size=20</code> esperando os 20 primeiros registros. O que ele recebe?',
      opcoes: ['Os registros 21 a 40', 'Os registros 1 a 20', 'Erro 400', 'Todos os registros'], certa: 0,
      dicas: ['Em que número começa a paginação do Spring Data?', 'A primeira página é a de índice zero.'],
      explica: 'O <code>Pageable</code> é base zero: <code>page=0</code> é a primeira página. <code>page=1</code> pula os 20 primeiros. Dá para mudar com <code>spring.data.web.pageable.one-indexed-parameters=true</code>, mas combine isso com o front.' },
    { tipo: 'escolha', pergunta: 'Por que não declarar <code>@PostMapping Processo criar(@RequestBody Processo p)</code>?',
      opcoes: ['O cliente pode gravar campos que não deveria (mass assignment) e o contrato fica preso ao banco', 'O Spring não consegue desserializar entidades', 'Entidades não podem ter @RequestBody', 'Porque o id ficaria sempre nulo'], certa: 0,
      dicas: ['Pense no que o cliente consegue mandar no JSON.', 'E no que acontece com a API se você renomear uma coluna.'],
      explica: 'Funciona tecnicamente, e esse é o perigo: o cliente pode setar <code>status</code> ou <code>id</code>, e qualquer mudança no esquema muda a API. Use um record de entrada validado e um record de saída.' },
  ],
})
