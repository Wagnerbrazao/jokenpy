MODULOS.push({
  id: 'spring-producao',
  titulo: 'Rumo à produção',
  icone: '🚀',
  aprende: 'perfis, configuração externa, Actuator, logs, Docker e virtual threads',
  porque: 'A mesma imagem precisa rodar em homologação e produção mudando só a configuração, e com saúde e métricas visíveis para quem opera.',
  gancho: {
    titulo: 'Homologação no banco errado',
    pergunta: 'O perfil <code>hml</code> está ativo, mas o container foi copiado do de produção. Em qual banco a aplicação conecta?',
    linguagem: 'yaml',
    codigo: `# application-hml.yml
spring:
  datasource:
    url: jdbc:postgresql://db-hml/atendimentos

# variável no container:
# SPRING_DATASOURCE_URL=jdbc:postgresql://db-prod/atendimentos`,
    opcoes: ['db-hml: o perfil vence', 'db-prod: a variável vence', 'Nenhum: falha por conflito'],
    certa: 1,
    revelacao: 'Variável de ambiente tem <b>precedência</b> sobre os arquivos <code>application*.yml</code>, inclusive os de perfil: <code>SPRING_DATASOURCE_URL</code> vira <code>spring.datasource.url</code>. Nesta lição você vai ver perfis, configuração externa, Actuator, logs, Docker e virtual threads.',
  },
  videos: [
    { id: 'FUHpVIeEIgQ', titulo: 'Spring Profiles na Prática: Dev, Homologação e Produção sem Dor', canal: 'TECH DEV BRAZIL',
      duracao: '23:59', idioma: 'pt',
      nota: 'Veja o <code>application.yml</code> base sobrescrito por <code>application-hml.yml</code> e <code>application-prod.yml</code> conforme o perfil ativo.' },
    { id: 'rQV76dufxz4', titulo: 'Spring Boot Environment Variables Explained (Secure Your API Keys!)', canal: 'Dan Vega',
      duracao: '16:31', idioma: 'en',
      nota: 'É o gancho: variável de ambiente vence o arquivo de propriedades, e segredo fica fora do código.' },
    { id: '4OVe0MWgZ4k', titulo: 'The #1 Spring Boot Starter you should include in every single application', canal: 'Dan Vega',
      duracao: '19:18', idioma: 'en',
      nota: 'Actuator na prática: o <code>/actuator/health</code> e como expor só o mínimo de endpoints.' },
  ],
  resumo: [
    '<code>application-prod.yml</code> sobrescreve o <code>application.yml</code> quando o perfil <code>prod</code> está ativo (<code>SPRING_PROFILES_ACTIVE=prod</code>)',
    'Variável de ambiente sobrescreve propriedade: <code>SPRING_DATASOURCE_URL</code> vira <code>spring.datasource.url</code>',
    '<code>@ConfigurationProperties</code> num record dá configuração tipada e validável',
    'Actuator expõe só <code>/actuator/health</code> por padrão via HTTP; abra o mínimo e nunca <code>env</code> ou <code>heapdump</code> em público',
    'Logue com SLF4J e placeholders <code>{}</code>, nunca dados pessoais do assistido',
    '<code>./mvnw package</code> gera um jar executável; a imagem sai de um Dockerfile multi-stage ou de <code>./mvnw spring-boot:build-image</code>',
    '<code>spring.threads.virtual.enabled=true</code> (Java 21+) atende cada requisição numa virtual thread',
  ],
  ensino: [
    { titulo: 'Perfis: uma base e as diferenças por ambiente',
      texto: `<p>O <code>application.yml</code> tem a configuração comum. Arquivos <code>application-&lt;perfil&gt;.yml</code> só trazem o que muda e <b>sobrescrevem</b> a base quando o perfil está ativo. O perfil se ativa de fora: <code>SPRING_PROFILES_ACTIVE=prod</code> ou <code>--spring.profiles.active=prod</code>.</p>
<p>Beans também podem depender de perfil com <code>@Profile("dev")</code> (ex.: um carregador de dados de exemplo que nunca deve subir em produção).</p>
<p><b>Pegadinha:</b> não coloque <code>spring.profiles.active</code> dentro de um arquivo de perfil (<code>application-prod.yml</code>): o Boot recusa e a aplicação não sobe. Também evite um perfil por servidor; perfis descrevem <b>tipos</b> de ambiente, e o que é de cada máquina vem de variável de ambiente.</p>
<p><b>No NestJS:</b> é o <code>ConfigModule.forRoot({ envFilePath: \`.env.\${process.env.NODE_ENV}\` })</code>, mas com sobreposição de propriedades em vez de arquivos separados.</p>`,
      linguagem: 'yaml',
      codigo: `# application.yml (comum)
spring:
  application:
    name: atendimentos-api
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/atendimentos}
    username: \${DB_USER:dev}
    password: \${DB_PASSWORD:dev}

# application-prod.yml (outro arquivo) (só o que muda)
spring:
  jpa:
    show-sql: false
logging:
  level:
    root: info` },
    { titulo: 'Variáveis de ambiente e @ConfigurationProperties',
      texto: `<p>O Spring junta várias fontes de configuração com precedência: argumentos de linha de comando e <b>variáveis de ambiente</b> vencem os arquivos. Pelo <b>relaxed binding</b>, <code>SPRING_DATASOURCE_PASSWORD</code> preenche <code>spring.datasource.password</code>: maiúsculas, pontos viram <code>_</code> e o hífen some. Segredos ficam assim, fora do repositório.</p>
<p>No YAML, <code>\${DB_URL:valor}</code> é um placeholder com valor padrão depois dos dois-pontos. Sem padrão e sem a variável, a aplicação não sobe (<code>Could not resolve placeholder</code>), o que é bom para segredo obrigatório.</p>
<p>Para configuração da própria aplicação, prefira <code>@ConfigurationProperties</code> num record a espalhar <code>@Value</code>: fica tipado, agrupado e pode ser validado com <code>@Validated</code>. Registre com <code>@ConfigurationPropertiesScan</code> na classe principal. No YAML se escreve em kebab-case (<code>max-por-dia</code>), no Java em camelCase.</p>
<p><b>No NestJS:</b> é o <code>registerAs('agenda', () =&gt; ({ ... }))</code> com validação por Joi ou class-validator no <code>ConfigModule</code>.</p>`,
      linguagem: 'java',
      codigo: `@Validated
@ConfigurationProperties(prefix = "defensoria.agenda")
public record AgendaProperties(
    @Min(1) int maxPorDia,           // defensoria.agenda.max-por-dia
    @NotNull Duration duracaoPadrao, // defensoria.agenda.duracao-padrao: 30m
    List<String> comarcas
) {}

@SpringBootApplication
@ConfigurationPropertiesScan
public class AtendimentosApplication { ... }

// em produção: DEFENSORIA_AGENDA_MAXPORDIA=40` },
    { titulo: 'Actuator: saúde e métricas, sem expor demais',
      texto: `<p>O <code>spring-boot-starter-actuator</code> adiciona endpoints operacionais em <code>/actuator</code>. Por padrão, via HTTP, só o <b>health</b> fica exposto. Ele agrega indicadores automáticos (banco, disco) e responde <code>{"status":"UP"}</code> ou 503 quando algo cai, o que alimenta load balancer e Kubernetes (há também <code>/actuator/health/liveness</code> e <code>/readiness</code>).</p>
<p>Métricas vêm do <b>Micrometer</b>: <code>/actuator/metrics/http.server.requests</code> mostra latência por rota. Com <code>micrometer-registry-prometheus</code>, o endpoint <code>/actuator/prometheus</code> alimenta Prometheus/Grafana.</p>
<p><b>Cuidado:</b> <code>include: "*"</code> expõe <code>env</code> (configuração), <code>heapdump</code> (memória, com senhas e dados) e <code>loggers</code> (alterável). Liste só o necessário, mostre detalhes do health apenas a quem está autorizado e, se possível, sirva o Actuator numa porta interna (<code>management.server.port</code>).</p>
<p><b>No NestJS:</b> é o <code>@nestjs/terminus</code> para health e o <code>prom-client</code> para métricas, mas aqui vem pronto.</p>`,
      linguagem: 'yaml',
      codigo: `management:
  server:
    port: 8081                  # fora da porta pública
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized` },
    { titulo: 'Logs com SLF4J',
      texto: `<p>O Boot já vem com SLF4J (a API) e Logback (a implementação). Crie o logger com <code>LoggerFactory.getLogger(Classe.class)</code> e use <b>placeholders</b> <code>{}</code>: a string só é montada se o nível estiver ativo, e a exceção vai como último argumento para sair com stack trace.</p>
<p>Nível por pacote se ajusta na configuração (<code>logging.level.br.gov.go.defensoria=debug</code>). Desde o Boot 3.4 há <b>log estruturado</b> em JSON sem dependência extra: <code>logging.structured.format.console=ecs</code> (ou <code>logstash</code>, <code>gelf</code>), pronto para Elastic/Loki.</p>
<p><b>LGPD:</b> não logue CPF, nome do assistido, conteúdo de atendimento ou token. Logue ids e o que aconteceu.</p>
<p><b>No NestJS:</b> é o <code>Logger</code> do <code>@nestjs/common</code> ou o <code>pino</code>/<code>winston</code>. A diferença prática é o placeholder <code>{}</code> no lugar de template string.</p>`,
      linguagem: 'java',
      codigo: `@Service
public class AtendimentoService {
    private static final Logger log = LoggerFactory.getLogger(AtendimentoService.class);

    public void encerrar(Long id) {
        log.info("Encerrando atendimento {}", id);
        try {
            // ...
        } catch (IntegracaoTjException e) {
            log.error("Falha ao notificar o TJ sobre o atendimento {}", id, e);  // e por último
            throw e;
        }
    }
}` },
    { titulo: 'Jar, imagem Docker e virtual threads',
      texto: `<p><code>./mvnw clean package</code> gera em <code>target/</code> um <b>jar executável</b> com Tomcat embutido e todas as dependências: roda com <code>java -jar app.jar</code>, sem servidor de aplicação.</p>
<p>Para a imagem, há dois caminhos. <b>Dockerfile multi-stage</b>: compila numa imagem com JDK e copia só o jar para uma com JRE, ficando menor e sem Maven. Ou <code>./mvnw spring-boot:build-image</code>, que usa Buildpacks (Paketo) e gera uma imagem otimizada <b>sem Dockerfile</b>, mas precisa de Docker na máquina. A JVM moderna respeita o limite de memória do container; ajuste com <code>-XX:MaxRAMPercentage</code>.</p>
<p><b>Virtual threads</b> (Java 21+): com <code>spring.threads.virtual.enabled=true</code>, cada requisição roda numa thread virtual barata. Código bloqueante (JDBC, chamadas HTTP) escala sem trocar para programação reativa. Não deixa CPU mais rápida, e o pool de conexões do banco (Hikari) continua sendo o limite real.</p>
<p><b>No NestJS:</b> o Node resolve concorrência com event loop e <code>async/await</code>. Virtual threads dão um efeito parecido mantendo o código síncrono.</p>`,
      linguagem: 'texto',
      codigo: `# Dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'O <code>application.yml</code> tem <code>server.port: 8080</code> e o <code>application-prod.yml</code> tem <code>server.port: 9000</code>. A aplicação sobe com <code>SPRING_PROFILES_ACTIVE=prod</code>. Em que porta?',
      opcoes: ['9000', '8080', 'Ambas', 'Falha por propriedade duplicada'], certa: 0,
      dicas: ['O arquivo de perfil não substitui o base inteiro.', 'Ele sobrescreve apenas as chaves que repete.'],
      explica: 'As propriedades do perfil ativo vencem as da base, chave a chave. Tudo que o <code>application-prod.yml</code> não menciona continua vindo do <code>application.yml</code>.' },
    { tipo: 'escolha', pergunta: 'Qual variável de ambiente sobrescreve <code>spring.datasource.password</code>?',
      opcoes: ['SPRING_DATASOURCE_PASSWORD', 'spring.datasource.password', 'SPRING-DATASOURCE-PASSWORD', 'DATASOURCE_PASSWORD'], certa: 0, opcoesCodigo: true,
      dicas: ['O relaxed binding converte o nome da propriedade.', 'Maiúsculas, e pontos viram underscore.'],
      explica: 'Pela regra do relaxed binding, <code>spring.datasource.password</code> vira <code>SPRING_DATASOURCE_PASSWORD</code>. Hífen não é aceito em nome de variável na maioria dos shells, e sem o prefixo <code>SPRING_</code> é outra propriedade.' },
    { tipo: 'completar', pergunta: 'Complete a URL do banco com variável de ambiente e valor padrão para desenvolvimento:',
      codigo: `spring:
  datasource:
    url: [[0]]DB_URL[[1]]jdbc:postgresql://localhost:5432/atendimentos}`,
      respostas: [['\${'], [':']],
      dicas: ['É a sintaxe de placeholder de propriedade do Spring.', 'O valor padrão vem depois de um separador.'],
      explica: '<code>\${DB_URL:padrao}</code> usa a variável <code>DB_URL</code> se existir; senão, o texto depois dos dois-pontos. Sem padrão, a falta da variável impede a subida.' },
    { tipo: 'escolha', pergunta: 'Por que <code>management.endpoints.web.exposure.include: "*"</code> é perigoso em produção?',
      opcoes: ['Expõe endpoints como env e heapdump, que vazam configuração e dados da memória', 'Deixa a aplicação mais lenta', 'Desliga o health check', 'Impede o uso do Prometheus'], certa: 0,
      dicas: ['Pense no que cada endpoint do Actuator revela.', 'Um deles baixa um retrato da memória da JVM.'],
      explica: '<code>heapdump</code> entrega a memória (com tokens, senhas e dados de assistidos), <code>env</code> mostra a configuração e <code>loggers</code> permite alterar níveis. Exponha só <code>health</code>, <code>info</code> e as métricas necessárias, de preferência numa porta interna.' },
    { tipo: 'completar', pergunta: 'Complete a configuração tipada lida de <code>defensoria.agenda.*</code>:',
      codigo: `@[[0]](prefix = "defensoria.agenda")
public record AgendaProperties(int maxPorDia, Duration duracaoPadrao) {}

@SpringBootApplication
@[[1]]
public class AtendimentosApplication { }`,
      respostas: [['ConfigurationProperties'], ['ConfigurationPropertiesScan', 'EnableConfigurationProperties(AgendaProperties.class)']],
      dicas: ['Uma anotação liga o record a um prefixo.', 'A outra faz o Spring procurar e registrar esses records.'],
      explica: '<code>@ConfigurationProperties</code> liga o prefixo ao record; <code>@ConfigurationPropertiesScan</code> (ou <code>@EnableConfigurationProperties(AgendaProperties.class)</code>) registra como bean para injeção.' },
    { tipo: 'escolha', pergunta: 'Qual linha de log está correta?',
      opcoes: ['log.warn("Prazo vencido no processo {}", processoId);', 'log.warn("Prazo vencido no processo " + processo);', 'log.warn("Prazo vencido para o CPF {}", assistido.cpf());', 'System.out.println("Prazo vencido: " + processoId);'], certa: 0, opcoesCodigo: true,
      dicas: ['Placeholder é melhor que concatenação.', 'E pense na LGPD.'],
      explica: 'Placeholder <code>{}</code> com um id é o ideal. Concatenar monta a string mesmo com o nível desligado e pode imprimir a entidade inteira; logar CPF expõe dado pessoal; <code>System.out</code> ignora níveis e formato estruturado.' },
    { tipo: 'montar', pergunta: 'Monte o comando que gera a imagem <code>atendimentos-api:1.0</code> com Buildpacks, sem Dockerfile:',
      certa: ['./mvnw', 'spring-boot:build-image', '-Dspring-boot.build-image.imageName=atendimentos-api:1.0'],
      extras: ['docker build .', 'package', 'spring-boot:run', 'jib:build'],
      dicas: ['É um goal do plugin do Spring Boot para Maven.', 'Não é o goal que roda a aplicação.'],
      explica: '<code>./mvnw spring-boot:build-image</code> compila e gera a imagem com Paketo Buildpacks; a propriedade <code>imageName</code> define nome e tag. <code>spring-boot:run</code> só executa a aplicação; <code>docker build</code> exige um Dockerfile.' },
    { tipo: 'escolha', pergunta: 'Você liga <code>spring.threads.virtual.enabled=true</code> numa API que faz consultas JDBC e chama o sistema do TJ. O que esperar?',
      opcoes: ['Mais requisições simultâneas em espera de I/O, com o pool de conexões do banco ainda como limite', 'CPU mais rápida em cálculos pesados', 'Necessidade de reescrever tudo em estilo reativo', 'Funciona em Java 17'], certa: 0,
      dicas: ['Virtual threads brilham quando a thread passa a maior parte do tempo esperando.', 'Elas não criam conexões de banco novas.'],
      explica: 'Virtual threads tornam barato ter milhares de requisições bloqueadas em I/O, mantendo o código síncrono. Não aceleram CPU, exigem Java 21+ e não aumentam o pool do Hikari: se há 10 conexões, só 10 consultas rodam ao mesmo tempo.' },
  ],
})
