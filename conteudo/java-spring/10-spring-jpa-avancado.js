MODULOS.push({
  id: 'spring-jpa-avancado',
  titulo: 'Relações e transações',
  icone: '🔗',
  aprende: '@ManyToOne/@OneToMany, N+1, @Transactional e Flyway',
  porque: 'N+1, LazyInitializationException e transação mal colocada são as perguntas de JPA que mais aparecem em entrevista e em incidente.',
  resumo: [
    'O lado <code>@ManyToOne</code> é o <b>dono</b> da relação (tem a FK); o <code>@OneToMany(mappedBy = "...")</code> só espelha',
    '<code>@ManyToOne</code> é <b>EAGER</b> por padrão: declare <code>fetch = FetchType.LAZY</code>',
    'N+1: uma consulta para a lista e mais uma por item; resolva com <code>join fetch</code> ou <code>@EntityGraph</code>',
    '<code>@Transactional</code> vai no <b>service</b>, em método público; rollback automático só para <code>RuntimeException</code> e <code>Error</code>',
    '<code>LazyInitializationException</code> = acessou relação lazy fora da transação',
    'Flyway roda <code>db/migration/V1__criar_tabela.sql</code> na subida; migration aplicada não se edita',
  ],
  ensino: [
    { titulo: '@ManyToOne, @OneToMany e quem manda na FK',
      texto: `<p>Muitos atendimentos pertencem a um assistido. Em JPA, a FK fica no lado <code>@ManyToOne</code> (<code>Atendimento.assistido</code>, com <code>@JoinColumn(name = "assistido_id")</code>). Esse é o <b>lado dono</b>: é ele que o Hibernate lê para gravar a coluna.</p>
<p>O lado <code>@OneToMany(mappedBy = "assistido")</code> é opcional e só espelha. <code>mappedBy</code> aponta para o <b>nome do atributo</b> do outro lado. Sem <code>mappedBy</code>, o Hibernate acha que são duas relações e cria uma tabela de junção extra.</p>
<p><b>Pegadinha:</b> adicionar na lista <code>assistido.getAtendimentos().add(a)</code> sem setar <code>a.setAssistido(assistido)</code> não grava a FK. Por isso se escreve um método que sincroniza os dois lados.</p>
<p><b>No NestJS:</b> é o par <code>@ManyToOne(() =&gt; Assistido)</code> / <code>@OneToMany(() =&gt; Atendimento, a =&gt; a.assistido)</code> do TypeORM, ou o <code>@relation</code> do Prisma.</p>`,
      linguagem: 'java',
      codigo: `@Entity
public class Atendimento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assistido_id")
    private Assistido assistido;
}

@Entity
public class Assistido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "assistido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Atendimento> atendimentos = new ArrayList<>();

    public void registrar(Atendimento a) {   // mantém os dois lados coerentes
        atendimentos.add(a);
        a.setAssistido(this);
    }
}` },
    { titulo: 'LAZY, EAGER e o problema N+1',
      texto: `<p>Os padrões do JPA são traiçoeiros: <code>@ManyToOne</code> e <code>@OneToOne</code> são <b>EAGER</b>; <code>@OneToMany</code> e <code>@ManyToMany</code> são <b>LAZY</b>. A recomendação geral é deixar <b>tudo LAZY</b> e buscar junto só quando a tela precisa.</p>
<p>O <b>N+1</b>: você lista 50 atendimentos (1 consulta) e, ao montar o DTO, chama <code>a.getAssistido().getNome()</code> em cada um (mais 50 consultas). EAGER não resolve: no <code>findAll</code> ele também dispara uma consulta por assistido.</p>
<p>Correções: <code>join fetch</code> em JPQL, ou <code>@EntityGraph(attributePaths = "assistido")</code> no método do repositório. Para ver o problema, ligue <code>logging.level.org.hibernate.SQL=debug</code> e conte os <code>select</code>.</p>
<p><b>Cuidado:</b> <code>join fetch</code> de <b>coleção</b> com paginação faz o Hibernate paginar em memória (aviso HHH90003004). Para coleções paginadas, busque os ids paginados e depois os filhos.</p>
<p><b>No NestJS:</b> é o mesmo problema do TypeORM com <code>lazy</code>, resolvido com <code>relations</code> ou <code>leftJoinAndSelect</code>; no Prisma, com <code>include</code>.</p>`,
      linguagem: 'java',
      codigo: `public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    @Query("select a from Atendimento a join fetch a.assistido where a.data = :data")
    List<Atendimento> doDiaComAssistido(@Param("data") LocalDate data);

    @EntityGraph(attributePaths = "assistido")
    List<Atendimento> findByDefensorId(Long defensorId);
}` },
    { titulo: '@Transactional: onde e como',
      texto: `<p><code>@Transactional</code> (de <code>org.springframework.transaction.annotation</code>) abre uma transação no início do método e faz commit no fim. Coloque no <b>service</b>, que é onde mora a unidade de trabalho; não no controller nem no repositório (os métodos do <code>JpaRepository</code> já são transacionais individualmente).</p>
<p>Ele funciona por <b>proxy</b>. Consequências: só vale em chamadas que vêm de <b>fora</b> do bean (chamar <code>this.outroMetodo()</code> ignora a anotação) e só em métodos que o proxy enxerga (use público).</p>
<p><b>Rollback:</b> por padrão só em <code>RuntimeException</code> e <code>Error</code>. Exceção checada (<code>IOException</code>) faz <b>commit</b>! Use <code>rollbackFor = Exception.class</code> se precisar.</p>
<p><code>readOnly = true</code> em consultas avisa o Hibernate que não precisa checar mudanças (menos trabalho) e pode rotear para réplica. E dentro da transação a entidade é <b>gerenciada</b>: alterar um campo já gera o <code>UPDATE</code> no commit (dirty checking), sem chamar <code>save</code>.</p>
<p><b>No NestJS:</b> lembra o <code>dataSource.transaction(async manager =&gt; ...)</code> do TypeORM ou o <code>prisma.$transaction</code>, só que declarativo.</p>`,
      linguagem: 'java',
      codigo: `@Service
public class AtendimentoService {
    private final AtendimentoRepository atendimentos;
    private final AssistidoRepository assistidos;
    // construtor...

    @Transactional
    public void encerrar(Long id, String parecer) {
        Atendimento a = atendimentos.findById(id).orElseThrow(() -> new AtendimentoNaoEncontradoException(id));
        a.encerrar(parecer);        // sem save(): dirty checking grava no commit
        if (parecer.isBlank()) {
            throw new ParecerObrigatorioException();   // RuntimeException -> rollback
        }
    }

    @Transactional(readOnly = true)
    public List<AtendimentoResponse> doDia(LocalDate data) {
        return atendimentos.doDiaComAssistido(data).stream().map(AtendimentoResponse::de).toList();
    }
}` },
    { titulo: 'LazyInitializationException',
      texto: `<p>A mensagem é <code>could not initialize proxy [Assistido#42] - no Session</code>. Significa: você acessou uma relação LAZY depois que a transação (e a sessão do Hibernate) fechou. Acontece muito ao montar o DTO no controller ou ao serializar a entidade.</p>
<p>O Spring Boot liga por padrão o <code>spring.jpa.open-in-view</code>, que mantém a sessão aberta até o fim da requisição e "esconde" o erro, e por isso loga um aviso na subida. O custo: consultas lazy durante a serialização, conexão presa por mais tempo e N+1 escondido. Muitos times desligam (<code>false</code>).</p>
<p><b>Correção certa:</b> buscar o que precisa dentro do service transacional (<code>join fetch</code>/<code>@EntityGraph</code>) e devolver DTO. <b>Gambiarra:</b> trocar para EAGER ou ligar <code>hibernate.enable_lazy_load_no_trans</code>.</p>
<p><b>No NestJS:</b> não há equivalente direto: no TypeORM a relação não carregada simplesmente vem <code>undefined</code>.</p>`,
      linguagem: 'yaml',
      codigo: `spring:
  jpa:
    open-in-view: false          # força buscar tudo no service
    hibernate:
      ddl-auto: validate         # o esquema vem das migrations, não do Hibernate
logging:
  level:
    org.hibernate.SQL: debug     # mostra cada select no log` },
    { titulo: 'Migrations com Flyway',
      texto: `<p>Em produção o esquema não deve vir do <code>ddl-auto=update</code>. Com a dependência do Flyway no projeto (para Postgres: <code>flyway-core</code> e <code>flyway-database-postgresql</code>), o Spring Boot roda as migrations na subida, antes de o JPA validar.</p>
<p>Os arquivos ficam em <code>src/main/resources/db/migration</code> e seguem o nome <code>V&lt;versão&gt;__&lt;descrição&gt;.sql</code>, com <b>dois</b> underscores: <code>V1__criar_tabela_assistidos.sql</code>. O histórico fica na tabela <code>flyway_schema_history</code>.</p>
<p><b>Regra de ouro:</b> migration aplicada é imutável. Se você editar a V1, a próxima subida falha com <code>Migration checksum mismatch</code>. Corrija com uma V2 nova.</p>
<p><b>No NestJS:</b> é o <code>migration:run</code> do TypeORM ou o <code>prisma migrate deploy</code>, mas em SQL puro e executado pela própria aplicação.</p>`,
      linguagem: 'sql',
      codigo: `-- V1__criar_tabela_assistidos.sql
create table assistidos (
    id    bigint generated always as identity primary key,
    nome  varchar(150) not null,
    cpf   char(11) not null unique
);

-- V2__criar_tabela_atendimentos.sql
create table atendimentos (
    id           bigint generated always as identity primary key,
    assistido_id bigint not null references assistidos(id),
    data         date not null
);
create index idx_atendimentos_assistido on atendimentos(assistido_id);` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'Em <code>@OneToMany(mappedBy = "assistido")</code>, o que é <code>"assistido"</code>?',
      opcoes: ['O nome do atributo na entidade Atendimento', 'O nome da coluna FK no banco', 'O nome da tabela assistidos', 'O nome do repositório'], certa: 0,
      dicas: ['<code>mappedBy</code> fala de objetos, não de tabelas.', 'Ele aponta para o lado dono da relação.'],
      explica: '<code>mappedBy</code> referencia o <b>atributo Java</b> do lado <code>@ManyToOne</code>. A coluna (<code>assistido_id</code>) é definida lá, com <code>@JoinColumn</code>.' },
    { tipo: 'escolha', pergunta: 'Qual é o fetch padrão de <code>@ManyToOne</code> quando você não informa nada?',
      opcoes: ['EAGER', 'LAZY', 'Depende do banco', 'Nenhum: é obrigatório informar'], certa: 0,
      dicas: ['O padrão do JPA para relações "para um" é diferente das relações "para muitos".', 'É justamente o padrão que se recomenda trocar.'],
      explica: 'Relações <code>...ToOne</code> são EAGER por padrão; <code>...ToMany</code> são LAZY. Por isso se escreve <code>@ManyToOne(fetch = FetchType.LAZY)</code> explicitamente.' },
    { tipo: 'escolha', pergunta: 'Este código lista 100 atendimentos. Quantas consultas ele faz, com <code>assistido</code> LAZY?',
      codigo: `atendimentoRepository.findAll().stream()
    .map(a -> a.getAssistido().getNome())
    .toList();`,
      opcoes: ['Até 101: uma para a lista e uma por assistido', '1', '2', '100'], certa: 0,
      dicas: ['A primeira consulta traz só os atendimentos.', 'Cada <code>getNome()</code> em um proxy ainda não carregado vai ao banco.'],
      explica: 'É o N+1 clássico: 1 consulta da lista + 1 por assistido distinto. Resolva com <code>join fetch a.assistido</code> ou <code>@EntityGraph(attributePaths = "assistido")</code>, que trazem tudo numa consulta.' },
    { tipo: 'completar', pergunta: 'Complete para buscar os atendimentos já com o assistido, sem N+1:',
      codigo: `@[[0]](attributePaths = "assistido")
List<Atendimento> findByData(LocalDate data);

@Query("select a from Atendimento a [[1]] a.assistido where a.defensorId = :id")
List<Atendimento> doDefensor(@Param("id") Long id);`,
      respostas: [['EntityGraph'], ['join fetch', 'JOIN FETCH', 'left join fetch', 'LEFT JOIN FETCH']],
      dicas: ['Uma anotação no método do repositório e uma cláusula JPQL.', 'Na JPQL não basta <code>join</code>: o join comum não carrega a relação.'],
      explica: '<code>@EntityGraph</code> pede ao Spring Data para carregar os atributos listados; <code>join fetch</code> faz o mesmo em JPQL. Um <code>join</code> sem <code>fetch</code> só filtra e não popula a relação.' },
    { tipo: 'escolha', pergunta: 'O método é <code>@Transactional</code> e lança <code>IOException</code> (checada) depois de gravar. O que acontece com a gravação?',
      opcoes: ['É confirmada (commit)', 'É desfeita (rollback)', 'Fica pendente até o próximo request', 'O Spring não deixa compilar'], certa: 0,
      dicas: ['O rollback automático tem uma regra sobre o tipo da exceção.', 'Só exceções não checadas disparam rollback por padrão.'],
      explica: 'Por padrão, só <code>RuntimeException</code> e <code>Error</code> causam rollback; exceção checada faz commit. Use <code>@Transactional(rollbackFor = Exception.class)</code> ou lance uma exceção não checada.' },
    { tipo: 'escolha', pergunta: 'Por que o <code>@Transactional</code> de <code>gravarItens</code> é ignorado aqui?',
      codigo: `@Service
public class PedidoService {
    public void processar(Pedido p) {
        this.gravarItens(p);
    }

    @Transactional
    public void gravarItens(Pedido p) { ... }
}`,
      opcoes: ['A chamada interna via this não passa pelo proxy', 'Métodos transacionais precisam ser private', 'Falta @EnableTransactionManagement', 'Só o repositório pode ser transacional'], certa: 0,
      dicas: ['Como o Spring implementa o @Transactional?', 'O proxy envolve o bean; quem chama de dentro chama o objeto real.'],
      explica: 'O <code>@Transactional</code> é aplicado por um proxy em volta do bean. <code>this.gravarItens()</code> chama o objeto real, sem passar pelo proxy. Anote o método de entrada (<code>processar</code>) ou mova o outro para outro bean. O Spring Boot já habilita o gerenciamento de transações.' },
    { tipo: 'escolha', pergunta: 'Com <code>spring.jpa.open-in-view=false</code>, o controller faz <code>atendimento.getAssistido().getNome()</code> e recebe <code>LazyInitializationException: could not initialize proxy - no Session</code>. Qual a correção mais adequada?',
      opcoes: ['Buscar o assistido junto no service (join fetch/@EntityGraph) e devolver um DTO', 'Trocar a relação para EAGER', 'Ligar open-in-view de novo', 'Colocar @Transactional no controller'], certa: 0,
      dicas: ['O erro diz que a sessão já fechou quando a relação foi lida.', 'A solução certa carrega os dados enquanto a transação ainda está aberta.'],
      explica: 'Carregar o necessário no service transacional e devolver DTO resolve sem efeitos colaterais. EAGER e open-in-view apenas escondem o problema e costumam piorar o desempenho (N+1, conexões presas).' },
    { tipo: 'montar', pergunta: 'Monte o nome do arquivo da segunda migration do Flyway:',
      certa: ['V2', '__', 'criar_tabela_atendimentos', '.sql'],
      extras: ['_', 'v2', '.yml', '-'],
      dicas: ['O prefixo de migration versionada é V maiúsculo.', 'Versão e descrição se separam por <b>dois</b> underscores.'],
      explica: '<code>V2__criar_tabela_atendimentos.sql</code> em <code>db/migration</code>. Um underscore só faz o Flyway não reconhecer o arquivo como migration válida.' },
    { tipo: 'entrevista', pergunta: 'Explique em voz alta: o que é o problema N+1 e como você resolve no Spring Data JPA?',
      avalia: 'Se você reconhece o sintoma, sabe por que acontece e conhece mais de uma solução com seus limites.',
      resposta: `<p>N+1 é quando faço uma consulta para trazer uma lista e depois uma consulta extra para cada item, ao acessar uma relação lazy. Com 200 atendimentos, viram 201 selects. Descubro ligando o log do SQL ou olhando métricas do banco.</p>
<p>Deixo as relações LAZY e, onde a tela precisa da relação, busco junto: <code>join fetch</code> na JPQL ou <code>@EntityGraph</code> no repositório. Também uso projeção direto em DTO quando só preciso de alguns campos.</p>
<p>Trocar para EAGER não resolve, só muda quando as consultas acontecem. E cuidado com <code>join fetch</code> de coleção com paginação, porque o Hibernate pagina em memória.</p>`,
      pontos: ['1 consulta da lista + 1 por item', 'relação LAZY acessada em loop', 'join fetch / @EntityGraph', 'projeção em DTO', 'EAGER não é solução'],
      evitar: ['dizer que basta trocar para EAGER'],
      dicas: ['Comece pelo sintoma em número de consultas.', 'Dê duas soluções e uma limitação.'] },
  ],
})
