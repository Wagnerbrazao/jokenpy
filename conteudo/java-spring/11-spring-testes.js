MODULOS.push({
  id: 'spring-testes',
  titulo: 'Testes',
  icone: '🧪',
  aprende: 'JUnit 5, AssertJ, Mockito, @WebMvcTest, @DataJpaTest e Testcontainers',
  porque: 'Em Spring, escolher a fatia certa de teste é o que separa uma suíte de 30 segundos de uma de 10 minutos.',
  gancho: {
    titulo: 'Falhou antes de testar',
    pergunta: 'O controller recebe <code>AssistidoService</code> no construtor. Este teste falha ao carregar o contexto, antes de qualquer requisição. Por quê?',
    linguagem: 'java',
    codigo: `@WebMvcTest(AssistidoController.class)
class AssistidoControllerTest {
    @Autowired MockMvc mvc;

    @Test void lista() throws Exception {
        mvc.perform(get("/assistidos")).andExpect(status().isOk());
    }
}`,
    opcoes: ['Falta o banco de teste', 'O @WebMvcTest não carrega o service', 'MockMvc precisa de servidor real', 'Falta @SpringBootTest junto'],
    certa: 1,
    revelacao: '<code>@WebMvcTest</code> sobe só a camada web (controllers, advices, conversores): <code>@Service</code> fica de fora e o construtor do controller não é satisfeito. A saída é um <code>@MockitoBean AssistidoService</code>. Nesta lição você vai ver cada fatia de teste e quando usar cada uma.',
  },
  videos: [
    { id: 'N1UkkK4jIHM', titulo: 'Aulão: Introdução aos testes automatizados com Spring Boot', canal: 'Giuliana Bezerra',
      duracao: '32:01', idioma: 'pt',
      nota: 'Panorama das fatias de teste do Spring Boot; onde aparecer <code>@MockBean</code>, use <code>@MockitoBean</code> (Boot 3.4+).' },
    { id: 'e6NeKpATWAU', titulo: 'Testes de Unidade com Spring Boot e Mockito - Ep. 05', canal: 'Giuliana Bezerra',
      duracao: '23:51', idioma: 'pt',
      nota: 'Foque em <code>@Mock</code> + <code>@InjectMocks</code>, <code>when(...).thenReturn(...)</code> e <code>verify</code> testando o service sem subir o Spring.' },
    { id: 'erp-7MCK5BU', titulo: 'Spring Boot Testcontainers - Integration Testing made easy!', canal: 'Dan Vega',
      duracao: '33:31', idioma: 'en',
      nota: 'Veja o Postgres de verdade subindo num container para o <code>@SpringBootTest</code>, no lugar do H2.' },
  ],
  resumo: [
    'JUnit 5 (<code>org.junit.jupiter</code>): <code>@Test</code>, <code>@BeforeEach</code>, <code>assertThrows</code>',
    'AssertJ deixa a asserção legível: <code>assertThat(x).isEqualTo(y)</code>, <code>assertThatThrownBy(...)</code>',
    'Mockito: <code>@Mock</code> + <code>@InjectMocks</code>, <code>when(...).thenReturn(...)</code>, <code>verify(...)</code>',
    '<code>@WebMvcTest</code> sobe só a camada web; o service entra como <code>@MockitoBean</code> (o <code>@MockBean</code> está deprecado desde o Boot 3.4)',
    '<code>@DataJpaTest</code> sobe só JPA, com rollback ao fim de cada teste',
    '<code>@SpringBootTest</code> sobe tudo; com Testcontainers, o banco é um Postgres de verdade',
  ],
  ensino: [
    { titulo: 'JUnit 5 e AssertJ',
      texto: `<p>O <code>spring-boot-starter-test</code> já traz JUnit 5 (Jupiter), AssertJ, Mockito e o suporte de teste do Spring. Testes ficam em <code>src/test/java</code>, no mesmo pacote da classe testada, e rodam com <code>./mvnw test</code>.</p>
<p>Um teste é um método com <code>@Test</code> (de <code>org.junit.jupiter.api</code>, não do JUnit 4). <code>@BeforeEach</code> roda antes de cada um, <code>@DisplayName</code> dá um nome legível e <code>@ParameterizedTest</code> roda o mesmo teste com várias entradas.</p>
<p>Prefira <b>AssertJ</b> às asserções do JUnit: a leitura é fluente, o autocomplete guia e as mensagens de falha são melhores. Atenção à ordem no JUnit: <code>assertEquals(esperado, atual)</code>.</p>
<p><b>No NestJS:</b> é o <code>describe/it</code> + <code>expect(x).toBe(y)</code> do Jest. <code>assertThatThrownBy</code> equivale a <code>expect(() =&gt; ...).toThrow()</code>.</p>`,
      linguagem: 'java',
      codigo: `class PrazoTest {

    @Test
    void defensoriaTemPrazoEmDobro() {
        assertThat(Prazo.paraDefensoria(15)).isEqualTo(30);
    }

    @Test
    void rejeitaPrazoNegativo() {
        assertThatThrownBy(() -> Prazo.paraDefensoria(-1))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("negativo");
    }
}` },
    { titulo: 'Mockito: teste de unidade do service',
      texto: `<p>Para testar o service sem Spring e sem banco, use Mockito: <code>@ExtendWith(MockitoExtension.class)</code> na classe, <code>@Mock</code> nas dependências e <code>@InjectMocks</code> na classe testada (ele usa o construtor). Isso roda em milissegundos.</p>
<p><code>when(repo.findById(1L)).thenReturn(Optional.of(...))</code> programa a resposta; <code>verify(repo).save(any())</code> confere que a chamada aconteceu; <code>verify(repo, never()).save(any())</code>, que não aconteceu.</p>
<p><b>Pegadinha:</b> o <code>MockitoExtension</code> é estrito. Um <code>when</code> que o teste nunca usa gera <code>UnnecessaryStubbingException</code>. É um aviso útil: o teste provavelmente não testa o que você pensa. E mock não programado devolve o "vazio" do tipo: <code>null</code>, <code>0</code>, <code>false</code>, <code>Optional.empty()</code> ou lista vazia.</p>
<p><b>No NestJS:</b> é o <code>jest.fn().mockResolvedValue(...)</code> e o <code>expect(repo.save).toHaveBeenCalled()</code>, sem precisar do <code>Test.createTestingModule</code>.</p>`,
      linguagem: 'java',
      codigo: `@ExtendWith(MockitoExtension.class)
class AssistidoServiceTest {

    @Mock AssistidoRepository repo;
    @InjectMocks AssistidoService service;

    @Test
    void naoCadastraCpfRepetido() {
        when(repo.existsByCpf("12345678901")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(new NovoAssistidoRequest("Maria", "12345678901", null, LocalDate.of(1980, 1, 1))))
            .isInstanceOf(CpfJaCadastradoException.class);

        verify(repo, never()).save(any());
    }
}` },
    { titulo: '@WebMvcTest e MockMvc: só a camada web',
      texto: `<p><code>@WebMvcTest(AssistidoController.class)</code> sobe uma <b>fatia</b> do contexto: controllers, advices, conversores JSON, validação e filtros de segurança. Services e repositórios <b>não</b> sobem. Por isso o service entra como mock.</p>
<p>O mock vem do <code>@MockitoBean</code> (Spring Framework 6.2, Boot 3.4+), que substitui o <code>@MockBean</code>: este ficou deprecado no 3.4 e saiu no Boot 4. O <code>MockMvc</code> faz requisições sem servidor HTTP real e permite checar status, cabeçalhos e JSON com <code>jsonPath</code>.</p>
<p>É aqui que você testa o contrato: status certo, validação virando 400, <code>ProblemDetail</code> com os campos, 404 de exceção de domínio.</p>
<p><b>No NestJS:</b> é o <code>Test.createTestingModule</code> com <code>overrideProvider(Service).useValue(mock)</code> mais o <code>supertest</code> (<code>request(app.getHttpServer()).post(...).expect(400)</code>).</p>`,
      linguagem: 'java',
      codigo: `@WebMvcTest(AssistidoController.class)
class AssistidoControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean AssistidoService service;

    @Test
    void buscaPorId() throws Exception {
        when(service.buscar(7L)).thenReturn(new AssistidoResponse(7L, "Maria"));

        mvc.perform(get("/assistidos/7"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.nome").value("Maria"));
    }

    @Test
    void rejeitaNomeEmBranco() throws Exception {
        mvc.perform(post("/assistidos").contentType(MediaType.APPLICATION_JSON)
               .content("""
                   {"nome": "", "cpf": "12345678901", "nascimento": "1980-01-01"}
                   """))
           .andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }
}` },
    { titulo: '@DataJpaTest: o repositório contra um banco',
      texto: `<p><code>@DataJpaTest</code> sobe só entidades, repositórios, o <code>EntityManager</code> e as migrations do Flyway. Cada teste roda numa transação que sofre <b>rollback</b> no fim, então um teste não suja o outro.</p>
<p>Por padrão ele troca seu <code>DataSource</code> por um banco em memória (H2) se houver um no classpath. Isso esconde diferenças reais: <code>ILIKE</code>, <code>jsonb</code>, sequences, SQL nativo do Postgres. Para testar contra o banco real, use <code>@AutoConfigureTestDatabase(replace = Replace.NONE)</code> com Testcontainers.</p>
<p>Vale a pena testar consultas com <code>@Query</code>, derived queries com regras não óbvias e restrições do banco (unique, FK). Não perca tempo testando o <code>save</code> do Spring Data.</p>
<p><b>No NestJS:</b> equivale a testar o repositório do TypeORM/Prisma contra um banco de teste, mas com rollback automático de graça.</p>`,
      linguagem: 'java',
      codigo: `@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProcessoRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired ProcessoRepository repo;

    @Test
    void buscaPorNomeSemDiferenciarMaiusculas() {
        repo.save(new Processo("0001234-56.2025.8.09.0051", "Maria da Silva"));
        assertThat(repo.findByNomeAssistidoContainingIgnoreCase("SILVA")).hasSize(1);
    }
}` },
    { titulo: '@SpringBootTest e Testcontainers',
      texto: `<p><code>@SpringBootTest</code> sobe o contexto <b>inteiro</b>: é o teste de integração. Combine com <code>@AutoConfigureMockMvc</code> para chamar a API ou com <code>webEnvironment = RANDOM_PORT</code> para um servidor real numa porta livre. É o mais lento; use para os fluxos principais, não para cada regra.</p>
<p><b>Testcontainers</b> sobe um container Docker (Postgres, Kafka, Redis) para o teste. Com <code>@ServiceConnection</code> (Boot 3.1+), o Spring lê a URL, o usuário e a senha do container sozinho, sem <code>@DynamicPropertySource</code>. Requer Docker na máquina e no CI.</p>
<p><b>Dica de desempenho:</b> o Spring guarda em cache o contexto entre classes com a mesma configuração. Cada combinação diferente de <code>@MockitoBean</code> cria um contexto novo, e a suíte fica lenta.</p>
<p><b>No NestJS:</b> é o teste e2e com <code>AppModule</code> completo e <code>supertest</code>, com o banco num <code>docker compose</code> ou também Testcontainers (que existe para Node).</p>`,
      linguagem: 'java',
      codigo: `@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class AtendimentoFluxoIT {

    @Container @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired MockMvc mvc;

    @Test
    void agendaEEncerraAtendimento() throws Exception {
        mvc.perform(post("/atendimentos").contentType(MediaType.APPLICATION_JSON)
               .content("""
                   {"assistidoId": 1, "data": "2025-05-10"}
                   """))
           .andExpect(status().isCreated())
           .andExpect(header().exists("Location"));
    }
}
// No Testcontainers 2.x (usado pelo Boot 4) a classe fica em org.testcontainers.postgresql
// e não tem genérico: new PostgreSQLContainer("postgres:16-alpine").` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'Você quer testar se o <code>POST /assistidos</code> responde 400 com nome em branco. Qual a anotação mais adequada para a classe de teste?',
      opcoes: ['@WebMvcTest(AssistidoController.class)', '@DataJpaTest', '@SpringBootTest com Testcontainers', '@ExtendWith(MockitoExtension.class)'], certa: 0, opcoesCodigo: true,
      dicas: ['O que está em teste é o contrato HTTP, não o banco.', 'Escolha a menor fatia que inclui controller, validação e advice.'],
      explica: '<code>@WebMvcTest</code> sobe controller, validação e advice, rápido e sem banco. <code>@SpringBootTest</code> também funcionaria, mas é muito mais lento para testar uma regra de entrada.' },
    { tipo: 'completar', pergunta: 'Complete o teste de unidade com Mockito:',
      codigo: `@ExtendWith(MockitoExtension.class)
class ProcessoServiceTest {
    @[[0]] ProcessoRepository repo;
    @[[1]] ProcessoService service;

    @Test
    void arquiva() {
        var p = new Processo("0001234-56.2025.8.09.0051", "Maria");
        [[2]](repo.findById(1L)).thenReturn(Optional.of(p));
        service.arquivar(1L);
        assertThat(p.getStatus()).isEqualTo(StatusProcesso.ARQUIVADO);
    }
}`,
      respostas: [['Mock'], ['InjectMocks'], ['when', 'Mockito.when']],
      dicas: ['Uma anotação cria o dublê, a outra monta a classe testada com ele.', 'O método que programa a resposta do mock.'],
      explica: '<code>@Mock</code> cria o dublê, <code>@InjectMocks</code> instancia o service injetando os mocks pelo construtor e <code>when(...).thenReturn(...)</code> programa a resposta.' },
    { tipo: 'escolha', pergunta: 'Num projeto Spring Boot 3.4+, qual anotação coloca um mock do <code>AssistidoService</code> no contexto de um <code>@WebMvcTest</code>?',
      opcoes: ['@MockitoBean', '@MockBean', '@Mock', '@InjectMocks'], certa: 0, opcoesCodigo: true,
      dicas: ['Precisa ser um bean do contexto do Spring, não só um campo mockado.', 'A anotação antiga foi deprecada no Boot 3.4.'],
      explica: '<code>@MockitoBean</code> (pacote <code>org.springframework.test.context.bean.override.mockito</code>) registra o mock como bean. <code>@MockBean</code> ainda compila no 3.4 e 3.5, mas está deprecado e foi removido no Boot 4. <code>@Mock</code> sozinho não entra no contexto.' },
    { tipo: 'escolha', pergunta: 'O teste falha com <code>UnnecessaryStubbingException</code>. O que isso indica?',
      opcoes: ['Há um when(...) que o teste nunca chegou a usar', 'O mock foi chamado mais vezes que o esperado', 'Falta @InjectMocks', 'O Mockito não consegue mockar interfaces'], certa: 0,
      dicas: ['O <code>MockitoExtension</code> é estrito com stubs.', 'Pense em um <code>when</code> que sobrou.'],
      explica: 'O modo estrito acusa stubs não usados: ou o código seguiu outro caminho (e o teste não testa o que parece), ou o <code>when</code> é lixo. Remova-o ou corrija o cenário.' },
    { tipo: 'completar', pergunta: 'Complete a checagem com MockMvc:',
      codigo: `mvc.perform([[0]]("/processos/99"))
   .andExpect([[1]]().isNotFound())
   .andExpect(jsonPath("$.status").value(404));`,
      respostas: [['get', 'MockMvcRequestBuilders.get'], ['status', 'MockMvcResultMatchers.status']],
      dicas: ['Os métodos estáticos vêm de MockMvcRequestBuilders e MockMvcResultMatchers.', 'Um monta a requisição GET, o outro confere o código HTTP.'],
      explica: '<code>get(...)</code> monta a requisição, <code>status().isNotFound()</code> confere o 404 e <code>jsonPath</code> lê o corpo, aqui o campo <code>status</code> do <code>ProblemDetail</code>.' },
    { tipo: 'escolha', pergunta: 'Um <code>@DataJpaTest</code> com H2 passa, mas a mesma consulta nativa com <code>ILIKE</code> quebra em produção no Postgres. Qual a melhor correção?',
      opcoes: ['Rodar o teste contra Postgres via Testcontainers e Replace.NONE', 'Trocar ILIKE por LIKE em produção', 'Usar @SpringBootTest com H2', 'Desligar o teste'], certa: 0,
      dicas: ['O problema é o banco do teste ser diferente do de produção.', 'Existe uma forma de usar o mesmo banco no teste.'],
      explica: 'H2 não é Postgres. Com <code>@AutoConfigureTestDatabase(replace = Replace.NONE)</code> e um <code>PostgreSQLContainer</code> com <code>@ServiceConnection</code>, o teste roda no mesmo banco de produção. Trocar para <code>@SpringBootTest</code> mantendo H2 não resolve nada.' },
    { tipo: 'montar', pergunta: 'Monte a asserção AssertJ que confere a quantidade de itens da lista:',
      certa: ['assertThat(', 'atendimentos', ')', '.hasSize(3)'],
      extras: ['assertEquals(', '.toBe(3)', '.length(3)'],
      dicas: ['Em AssertJ tudo começa com o mesmo método estático.', '<code>toBe</code> é do Jest.'],
      explica: '<code>assertThat(atendimentos).hasSize(3)</code>. Em caso de falha, o AssertJ mostra o conteúdo da lista, bem mais útil que <code>assertEquals(3, atendimentos.size())</code>.' },
    { tipo: 'escolha', pergunta: 'Em que um <code>@DataJpaTest</code> difere de um <code>@SpringBootTest</code> quanto aos dados?',
      opcoes: ['Cada teste faz rollback no fim por padrão', 'Ele nunca acessa banco', 'Ele grava e mantém os dados entre testes', 'Ele exige H2 obrigatoriamente'], certa: 0,
      dicas: ['O <code>@DataJpaTest</code> já vem anotado com algo que envolve cada teste.', 'Pense em transações.'],
      explica: '<code>@DataJpaTest</code> é <code>@Transactional</code>: cada teste faz rollback, e os dados não vazam para o próximo. O <code>@SpringBootTest</code> não faz isso sozinho. H2 é só o padrão se estiver no classpath, não uma exigência.' },
  ],
})
