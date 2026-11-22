MODULOS.push({
  id: 'spring-di',
  titulo: 'Beans e injeção',
  icone: '🔌',
  aprende: 'container IoC, estereótipos, injeção por construtor, @Bean e @Qualifier',
  porque: 'Injeção de dependência é a pergunta número um em entrevista de Spring, e é onde a sua experiência com providers do NestJS vira vantagem.',
  gancho: {
    titulo: 'O teste que deu NPE',
    pergunta: 'Na aplicação o serviço funciona. O que acontece neste teste de unidade, sem Spring?',
    linguagem: 'java',
    codigo: `@Service
public class PrazoService {
    @Autowired private FeriadoRepository feriados;
    public int feriadosNoMes(int mes) { return feriados.contarNoMes(mes); }
}

// no teste:
new PrazoService().feriadosNoMes(12);`,
    opcoes: ['Funciona: o @Autowired injeta', 'NullPointerException', 'Não compila', 'Lança NoSuchBeanDefinitionException'],
    certa: 1,
    revelacao: 'Quem preenche o campo é o <b>container</b> do Spring; com <code>new</code>, ninguém injeta e <code>feriados</code> fica <code>null</code>. Pior: não há como passar um mock. Nesta lição você vai ver beans, injeção pelo construtor e por que ela é a resposta certa na entrevista.',
  },
  videos: [
    { id: 'O07XFebgw-g', titulo: 'Injeção de dependência e inversão de controle', canal: 'DevSuperior', duracao: '4:50', idioma: 'pt',
      nota: 'Em 5 minutos: quem cria o objeto deixa de ser a sua classe e passa a ser o container. É a mesma ideia dos providers do NestJS.' },
  ],
  resumo: [
    'O <b>ApplicationContext</b> cria e liga os <b>beans</b>; você só declara dependências',
    '<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@RestController</code> marcam beans achados pelo scan',
    'Injete pelo <b>construtor</b> com campos <code>final</code>; com um único construtor, <code>@Autowired</code> é dispensável',
    '<code>@Configuration</code> + <code>@Bean</code> registra objetos que você não pode anotar (bibliotecas)',
    'Escopo padrão é <b>singleton</b>: não guarde estado de requisição em campo',
    'Duas implementações da mesma interface? <code>@Primary</code> ou <code>@Qualifier</code>',
  ],
  ensino: [
    { titulo: 'Container IoC e beans',
      texto: `<p>No Spring você não dá <code>new</code> nos serviços. O <b>container IoC</b> (o <code>ApplicationContext</code>) instancia cada classe registrada, descobre o que ela pede no construtor e entrega as dependências prontas. Cada objeto gerenciado é um <b>bean</b>.</p>
<p>Na inicialização, o Spring monta o grafo inteiro. Se faltar algum bean, a app <b>não sobe</b>: "Parameter 0 of constructor in AtendimentoService required a bean of type 'NotificadorSms' that could not be found." É bom: o erro aparece no deploy, não na primeira requisição.</p>
<p>Por ser gerenciado, o bean pode ganhar comportamento extra por <b>proxy</b>: <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Async</code>. Isso só vale para beans. Um objeto criado com <code>new</code> não tem nada disso.</p>
<p><b>No NestJS/TypeScript:</b> é exatamente o injector do Nest, e bean = provider. A diferença estrutural: no Nest cada módulo declara <code>providers</code> e <code>exports</code>, e um provider não exportado é invisível fora do módulo. No Spring, todo bean encontrado pelo scan fica disponível para qualquer outro: <b>não há encapsulamento por módulo</b>.</p>`,
      linguagem: 'java',
      codigo: `@Service
public class AtendimentoService {
    private final AtendimentoRepository repositorio;
    private final Notificador notificador;

    public AtendimentoService(AtendimentoRepository repositorio, Notificador notificador) {
        this.repositorio = repositorio;   // o container entrega as instâncias
        this.notificador = notificador;
    }
}` },
    { titulo: 'Os estereótipos: @Component e família',
      texto: `<p><code>@Component</code> diz "registre esta classe como bean". As outras são especializações com significado: <code>@Service</code> para regra de negócio, <code>@Repository</code> para acesso a dados (e ativa a tradução de exceções de persistência para <code>DataAccessException</code>), e <code>@Controller</code>/<code>@RestController</code> para a camada web.</p>
<p>Para o container, <code>@Service</code> e <code>@Component</code> se comportam igual. A escolha documenta a camada e permite filtrar por anotação (aspectos, testes de fatia como <code>@WebMvcTest</code>).</p>
<p>Interfaces do Spring Data (<code>extends JpaRepository</code>) <b>não</b> precisam de <code>@Repository</code>: o Spring Data gera a implementação e registra o bean sozinho.</p>
<p><b>No NestJS/TypeScript:</b> todos esses equivalem ao <code>@Injectable()</code>, com a diferença de que no Nest você <b>também</b> precisa listar a classe em <code>providers</code> de um módulo. No Spring a anotação basta, desde que a classe esteja dentro do pacote escaneado.</p>`,
      linguagem: 'java',
      codigo: `@Component
public class GeradorProtocolo { ... }

@Service
public class AgendaService { ... }

@RestController
public class AgendaController { ... }

// Spring Data: sem anotação, o bean é gerado
public interface AssistidoRepository extends JpaRepository<Assistido, Long> { }` },
    { titulo: 'Injeção pelo construtor (e por que não @Autowired em campo)',
      texto: `<p>Desde o Spring 4.3, se a classe tem <b>um único construtor</b>, o Spring o usa para injetar, sem <code>@Autowired</code>. É a forma recomendada pela própria documentação.</p>
<p>Por que não <code>@Autowired</code> no campo: o campo não pode ser <code>final</code>; a dependência fica escondida (não aparece na assinatura); você não consegue criar a classe num teste de unidade sem Spring ou reflexão; e uma classe com 9 dependências injetadas em campo não incomoda ninguém, enquanto um construtor com 9 parâmetros grita "esta classe faz coisa demais".</p>
<p>Ciclo de dependências (A precisa de B, B precisa de A) com injeção por construtor <b>falha na inicialização</b>, e o Boot 2.6+ proíbe ciclos por padrão. Trate como problema de design. Se o projeto usa Lombok, <code>@RequiredArgsConstructor</code> gera esse construtor para os campos <code>final</code>.</p>
<p><b>No NestJS/TypeScript:</b> é o mesmo <code>constructor(private readonly repo: AssistidoRepository)</code> que você já usa. A injeção por propriedade do Nest (<code>@Inject()</code> num campo) tem os mesmos problemas da injeção em campo do Spring.</p>`,
      linguagem: 'java',
      codigo: `// Evite
@Service
public class PrazoService {
    @Autowired
    private FeriadoRepository feriados;   // não pode ser final; teste precisa de Spring
}

// Prefira
@Service
public class PrazoService {
    private final FeriadoRepository feriados;

    public PrazoService(FeriadoRepository feriados) {
        this.feriados = feriados;
    }
}

// teste de unidade sem Spring:
var service = new PrazoService(new FeriadoRepositoryFake());` },
    { titulo: '@Configuration + @Bean e o escopo singleton',
      texto: `<p>Quando a classe não é sua (cliente HTTP, <code>Clock</code>, SDK de um órgão), você não pode anotá-la. Crie um método <code>@Bean</code> numa classe <code>@Configuration</code>: o retorno vira bean, o nome do método vira o nome do bean, e os parâmetros do método são injetados.</p>
<p>O escopo padrão é <b>singleton</b>: <b>uma instância por container</b>, compartilhada por todas as requisições. Como o Tomcat atende cada requisição numa thread, o bean é usado por várias threads ao mesmo tempo. <b>Nunca guarde estado de requisição em campo</b> de bean (usuário atual, resultado parcial). Outros escopos: <code>prototype</code> (nova instância a cada injeção) e <code>request</code> (uma por requisição HTTP).</p>
<p><b>No NestJS/TypeScript:</b> <code>@Bean</code> é o custom provider com <code>useFactory</code> (ou <code>useValue</code>). O singleton é o padrão do Nest também; <code>prototype</code> lembra o <code>Scope.TRANSIENT</code>, e <code>request</code>, o <code>Scope.REQUEST</code>. No Node o estado em campo também é compartilhado, mas lá o event loop roda numa thread só; aqui, a condição de corrida é real.</p>`,
      linguagem: 'java',
      codigo: `@Configuration
public class InfraConfig {

    @Bean
    public Clock clock() {
        return Clock.system(ZoneId.of("America/Sao_Paulo"));
    }

    @Bean
    public RestClient tjgoClient(RestClient.Builder builder) {
        return builder.baseUrl("https://api.tjgo.example").build();
    }
}` },
    { titulo: 'Duas implementações: @Primary e @Qualifier',
      texto: `<p>Se dois beans implementam <code>Notificador</code> e um serviço pede <code>Notificador</code>, o Spring não escolhe: a app não sobe com <code>NoUniqueBeanDefinitionException</code> ("expected single matching bean but found 2: notificadorEmail,notificadorSms").</p>
<p>Soluções: <code>@Primary</code> marca a implementação padrão; <code>@Qualifier("notificadorSms")</code> no parâmetro escolhe uma pelo nome. O nome padrão de um bean de <code>@Component</code> é o nome da classe com a primeira letra minúscula. E se você precisa de <b>todas</b>, injete <code>List&lt;Notificador&gt;</code> e percorra.</p>
<p><b>No NestJS/TypeScript:</b> no Nest a interface não existe em tempo de execução, então você cria um token (<code>@Inject('NOTIFICADOR')</code>) e registra <code>{ provide: 'NOTIFICADOR', useClass: NotificadorSms }</code>. No Spring o próprio tipo da interface é o token, e o <code>@Qualifier</code> desempata.</p>`,
      linguagem: 'java',
      codigo: `@Component
@Primary
public class NotificadorEmail implements Notificador { ... }

@Component
public class NotificadorSms implements Notificador { ... }

@Service
public class LembreteService {
    public LembreteService(Notificador padrao,                         // e-mail (@Primary)
                           @Qualifier("notificadorSms") Notificador sms,
                           List<Notificador> todos) { ... }            // os dois
}` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'No NestJS você registra o serviço em <code>providers: [AgendaService]</code> do módulo. No Spring Boot, o que é preciso para <code>AgendaService</code> virar bean?',
      opcoes: [
        'Anotar com <code>@Service</code> e deixá-la dentro do pacote escaneado',
        'Listar a classe num <code>@Module(providers = ...)</code>',
        'Anotar com <code>@Injectable</code>',
        'Criar a instância com <code>new</code> no <code>main</code>',
      ],
      certa: 0,
      dicas: ['O Spring descobre os beans sozinho, por varredura.', '<code>@Module</code> e <code>@Injectable</code> são do Nest.'],
      explica: 'O component scan encontra classes anotadas (<code>@Service</code>, <code>@Component</code>...) no pacote da aplicação e subpacotes. Não há lista de providers. <code>@Injectable</code> e <code>@Module</code> não existem no Spring, e uma instância com <code>new</code> não é gerenciada pelo container.' },
    { tipo: 'completar',
      pergunta: 'Complete a injeção pelo construtor no estilo recomendado:',
      codigo: `@Service
public class ProcessoService {
    private [[0]] ProcessoRepository repositorio;

    public [[1]](ProcessoRepository repositorio) {
        this.repositorio = repositorio;
    }
}`,
      respostas: [['final'], ['ProcessoService']],
      dicas: ['O campo é atribuído uma vez e nunca mais muda.', 'O construtor tem o nome da classe.'],
      explica: 'Campo <code>final</code> atribuído no construtor: imutável e explícito. Com um só construtor, o Spring injeta sem <code>@Autowired</code>. Num teste você faz <code>new ProcessoService(fake)</code>, sem subir contexto.' },
    { tipo: 'escolha',
      pergunta: 'Qual é o argumento <b>mais forte</b> contra <code>@Autowired</code> em campo?',
      opcoes: [
        'É mais lento em tempo de execução',
        'O campo não pode ser final e a classe não pode ser criada num teste sem Spring ou reflexão',
        'Foi removido no Spring Boot 3',
      ],
      certa: 1,
      dicas: ['Pense no teste de unidade dessa classe.', 'Continua funcionando, então o problema não é suporte.'],
      explica: 'Injeção em campo ainda funciona, e o custo de desempenho é irrelevante. O problema é de design: dependências escondidas, sem <code>final</code> e difíceis de substituir num teste puro. Pelo construtor, a dependência fica obrigatória e visível.' },
    { tipo: 'escolha',
      pergunta: 'A app não sobe com esta mensagem. Qual é a correção mais direta?',
      codigo: `Parameter 1 of constructor in LembreteService required a single bean,
but 2 were found:
  - notificadorEmail
  - notificadorSms`,
      opcoes: [
        'Trocar a injeção pelo construtor por @Autowired em campo',
        'Marcar uma implementação com @Primary ou usar @Qualifier no parâmetro',
        'Anotar LembreteService com @Configuration',
      ],
      certa: 1,
      dicas: ['O Spring não sabe qual das duas entregar.', 'Você precisa de um desempate: uma padrão, ou uma escolhida pelo nome.'],
      explica: 'Com duas implementações do mesmo tipo, a injeção é ambígua. <code>@Primary</code> define a padrão; <code>@Qualifier("notificadorSms")</code> escolhe pelo nome. Mudar para injeção em campo não resolve a ambiguidade, só muda onde ela explode.' },
    { tipo: 'montar',
      pergunta: 'Monte o parâmetro do construtor que pede especificamente o bean <code>notificadorSms</code>:',
      certa: ['@Qualifier("notificadorSms")', 'Notificador', 'sms'],
      extras: ['@Inject("notificadorSms")', '@Named', 'NotificadorSms.class'],
      dicas: ['Em Spring, a anotação de desempate pelo nome é...', 'O tipo continua sendo a interface.'],
      explica: '<code>@Qualifier</code> no parâmetro escolhe o bean pelo nome; o tipo declarado continua sendo a interface. <code>@Inject("token")</code> é o jeito do Nest. (O Spring até aceita <code>@Named</code> do Jakarta Inject, se a dependência estiver presente, mas o idiomático é <code>@Qualifier</code>.)' },
    { tipo: 'completar',
      pergunta: 'Registre um <code>Clock</code> no fuso de Goiânia como bean:',
      codigo: `@[[0]]
public class TempoConfig {
    @[[1]]
    public Clock clock() {
        return Clock.system(ZoneId.of("America/Sao_Paulo"));
    }
}`,
      respostas: [['Configuration'], ['Bean']],
      dicas: ['A classe é uma fonte de definições de beans.', 'O método cujo retorno vira bean recebe outra anotação.'],
      explica: '<code>@Configuration</code> marca a classe de definições e <code>@Bean</code>, o método fábrica. É o <code>useFactory</code> do Nest. Injetar <code>Clock</code> em vez de chamar <code>LocalDate.now()</code> direto deixa a regra de prazo testável com um relógio fixo.' },
    { tipo: 'escolha',
      pergunta: 'Qual é o problema deste serviço?',
      codigo: `@Service
public class RelatorioService {
    private List<Atendimento> parciais = new ArrayList<>();

    public Relatorio gerar(Long unidadeId) {
        parciais.clear();
        parciais.addAll(repo.buscarPorUnidade(unidadeId));
        return montar(parciais);
    }
}`,
      opcoes: [
        'Nenhum: cada requisição recebe sua própria instância',
        'O bean é singleton e compartilhado entre threads: duas requisições simultâneas misturam os dados',
        'Não compila: beans não podem ter campos',
      ],
      certa: 1,
      dicas: ['Qual é o escopo padrão de um <code>@Service</code>?', 'O Tomcat atende requisições em paralelo, em threads diferentes.'],
      explica: 'Singleton é uma instância só para a aplicação inteira, usada por várias threads ao mesmo tempo. O campo <code>parciais</code> vira estado compartilhado, e uma requisição limpa a lista da outra. Use variável local. "Uma instância por requisição" seria o escopo <code>request</code>, que não é o padrão.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: o que é injeção de dependência no Spring e como você compara com o NestJS?',
      avalia: 'Se você explica IoC (o container cria e liga os objetos), conhece as formas de registrar beans, defende injeção por construtor e mostra que entende a diferença de módulos entre os dois frameworks.',
      resposta: `<p>Injeção de dependência é a classe declarar do que precisa e alguém de fora entregar, em vez de ela criar as dependências. No Spring, quem entrega é o ApplicationContext: na inicialização ele encontra os beans pelo component scan (<code>@Service</code>, <code>@Repository</code>, <code>@RestController</code>) ou pelos métodos <code>@Bean</code> de classes <code>@Configuration</code>, monta o grafo e falha logo se faltar algo ou se houver ambiguidade.</p>
<p>Prefiro injeção pelo construtor com campos <code>final</code>: a dependência fica explícita, o objeto nasce completo e testo com <code>new</code> e mocks, sem subir o Spring. Os beans são singleton por padrão, então não guardo estado de requisição neles. Para várias implementações, uso <code>@Primary</code> ou <code>@Qualifier</code>.</p>
<p>No NestJS a ideia é a mesma, com <code>@Injectable</code> e providers. A diferença é que o Nest exige registrar cada provider num módulo e exportá-lo, o que dá encapsulamento; o Spring descobre tudo pelo scan e todos os beans ficam visíveis no mesmo contexto. E, como a interface existe em tempo de execução no Java, ela própria serve de token, sem string de injeção.</p>`,
      pontos: ['container IoC cria e liga os beans', 'component scan e @Configuration/@Bean', 'injeção por construtor e por quê', 'escopo singleton e cuidado com estado', '@Primary/@Qualifier', 'comparação com providers e módulos do Nest'],
      evitar: ['dizer que @Autowired em campo é a forma recomendada', 'confundir bean singleton com o padrão de projeto Singleton com construtor privado'],
      dicas: ['Comece pelo "quem cria os objetos".', 'Feche com a diferença de módulos entre Nest e Spring.'] },
  ],
})
