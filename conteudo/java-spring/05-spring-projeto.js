MODULOS.push({
  id: 'spring-projeto',
  titulo: 'Anatomia de um projeto',
  icone: '🏗️',
  aprende: 'start.spring.io, Maven, starters, @SpringBootApplication e application.yml',
  porque: 'No primeiro dia num time Spring você clona um projeto e precisa saber onde estão as dependências, a configuração e o ponto de entrada.',
  gancho: {
    titulo: 'Os endpoints sumiram',
    pergunta: 'Você moveu só a classe principal de pacote. A aplicação sobe sem erro, mas <b>todo</b> endpoint passa a dar 404. Por quê?',
    linguagem: 'texto',
    codigo: `antes:  br.gov.defensoria.atendimento.AtendimentoApplication
depois: br.gov.defensoria.atendimento.app.AtendimentoApplication

controllers: br.gov.defensoria.atendimento.web.*`,
    opcoes: ['Os controllers saíram do component scan', 'Precisa rodar mvn clean', 'A porta mudou', 'Falta registrar os controllers num módulo'],
    certa: 0,
    revelacao: '<code>@SpringBootApplication</code> procura beans a partir do <b>pacote dela para baixo</b>. <code>...atendimento.web</code> não está dentro de <code>...atendimento.app</code>, então nenhum controller é registrado. Nesta lição você vai ver o pom.xml, os starters, a auto-configuração e o application.yml.',
  },
  videos: [
    { id: 'YY_hf0FOIcU', titulo: 'CURSO DE SPRING para INICIANTES | Tutorial Completo de Java Spring', canal: 'Fernanda Kipper',
      duracao: '51:25', idioma: 'pt', inicio: 66,
      nota: 'Assista do Initializr até a estrutura do projeto (cerca de 12 min): starters escolhidos, <code>pom.xml</code>, pastas e a classe com <code>@SpringBootApplication</code>.' },
    { id: 'N7AyIfUQxGc', titulo: 'Aprenda Maven do Zero com Java: Aula Prática Completa!', canal: 'Giuliana Bezerra',
      duracao: '19:28', idioma: 'pt',
      nota: 'Veja o <code>pom.xml</code> como o <code>package.json</code> do Java: coordenadas, dependências, escopos e os comandos <code>mvn</code> do ciclo de build.' },
    { id: 'bSB0o1o8PBg', titulo: 'application.yml vs application.properties in SpringBoot | Properties vs YAML | Geekific', canal: 'Geekific',
      duracao: '4:34', idioma: 'en',
      nota: 'Compare a mesma configuração nos dois formatos e repare na hierarquia do YAML, que é o formato usado no módulo.' },
  ],
  resumo: [
    '<b>start.spring.io</b> gera o projeto: escolha Maven, Java 21 e os starters',
    '<code>pom.xml</code> é o <code>package.json</code>; o parent do Spring Boot define as versões',
    '<code>./mvnw spring-boot:run</code> sobe; <code>./mvnw package</code> gera um <code>.jar</code> executável',
    '<code>@SpringBootApplication</code> = configuração + auto-configuração + <b>component scan</b> a partir do pacote dela',
    'Auto-configuração reage ao <b>classpath</b> e recua quando você declara o próprio bean',
    '<code>application.yml</code> configura; variáveis de ambiente sobrescrevem',
  ],
  ensino: [
    { titulo: 'start.spring.io e a estrutura de pastas',
      texto: `<p>O <b>start.spring.io</b> (Spring Initializr, também dentro do IntelliJ e do VS Code) gera o esqueleto: você escolhe Maven ou Gradle, Java 21, a versão do Boot, o <i>group</i> (<code>br.gov.defensoria</code>), o <i>artifact</i> (<code>atendimento</code>) e as dependências, como Spring Web, Spring Data JPA, Validation e PostgreSQL Driver.</p>
<p>A estrutura é padrão Maven: código em <code>src/main/java</code>, configuração e estáticos em <code>src/main/resources</code>, testes em <code>src/test/java</code>. O pacote raiz recebe a classe <code>main</code>.</p>
<p>Dentro do pacote raiz, organize por <b>funcionalidade</b> (<code>assistido/</code>, <code>atendimento/</code>, cada um com controller, service e repository) em vez de pastas globais <code>controllers/</code> e <code>services/</code>. É o que você já faz no NestJS com módulos.</p>
<p><b>No NestJS/TypeScript:</b> é o <code>nest new</code>. <code>src/main/java</code> é o seu <code>src/</code>, e <code>src/test/java</code> faz o papel dos <code>*.spec.ts</code>, só que em árvore separada.</p>`,
      linguagem: 'texto',
      codigo: `atendimento/
├── pom.xml
├── mvnw, mvnw.cmd, .mvn/          # Maven Wrapper: não precisa instalar Maven
└── src/
    ├── main/
    │   ├── java/br/gov/defensoria/atendimento/
    │   │   ├── AtendimentoApplication.java
    │   │   ├── assistido/   (AssistidoController, AssistidoService, ...)
    │   │   └── agenda/
    │   └── resources/
    │       └── application.yml
    └── test/java/br/gov/defensoria/atendimento/` },
    { titulo: 'Maven: pom.xml, starters e comandos',
      texto: `<p>O <code>pom.xml</code> declara coordenadas (<code>groupId</code>, <code>artifactId</code>, <code>version</code>), a versão do Java e as dependências. O <b>parent</b> <code>spring-boot-starter-parent</code> traz um BOM com as versões de centenas de bibliotecas testadas juntas, por isso as dependências do Boot vêm <b>sem</b> <code>&lt;version&gt;</code>.</p>
<p><b>Starters</b> são dependências "pacote": <code>spring-boot-starter-web</code> traz Spring MVC, Jackson e o Tomcat embutido; <code>spring-boot-starter-data-jpa</code> traz Hibernate e Spring Data. No Boot 4 o starter web ganhou o nome <code>spring-boot-starter-webmvc</code>, e o antigo continua aceito mas obsoleto. <code>&lt;scope&gt;test&lt;/scope&gt;</code> é o <code>devDependencies</code> dos testes.</p>
<p>Comandos pelo wrapper: <code>./mvnw spring-boot:run</code> sobe a app, <code>./mvnw test</code> roda testes e <code>./mvnw clean package</code> gera <code>target/atendimento-0.0.1-SNAPSHOT.jar</code>, um jar <b>executável</b> com o servidor dentro (<code>java -jar</code>). No Gradle: <code>build.gradle</code>, <code>./gradlew bootRun</code> e <code>./gradlew build</code> (saída em <code>build/libs</code>).</p>
<p><b>No NestJS/TypeScript:</b> <code>pom.xml</code> = <code>package.json</code>, <code>./mvnw</code> = <code>npm</code> com versão fixa, <code>~/.m2</code> = cache do npm. Não existe <code>node_modules</code> no projeto.</p>`,
      linguagem: 'xml',
      codigo: `<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.0</version>
</parent>

<properties>
    <java.version>21</java.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>` },
    { titulo: '@SpringBootApplication e o component scan',
      texto: `<p>A classe principal tem um <code>main</code> que chama <code>SpringApplication.run</code>. Isso cria o container, aplica a configuração e sobe o Tomcat embutido na porta 8080.</p>
<p><code>@SpringBootApplication</code> junta três anotações: <code>@SpringBootConfiguration</code> (é uma <code>@Configuration</code>), <code>@EnableAutoConfiguration</code> e <code>@ComponentScan</code>. O scan procura <code>@Component</code>, <code>@Service</code>, <code>@RestController</code> etc. <b>no pacote da classe principal e nos subpacotes</b>.</p>
<p><b>Erro comum:</b> criar <code>br.gov.defensoria.integracao.TjgoClient</code> fora de <code>br.gov.defensoria.atendimento</code>. A classe não é encontrada, e a app falha com "required a bean of type ... that could not be found". Mantenha a classe principal no pacote raiz.</p>
<p><b>No NestJS/TypeScript:</b> é o <code>main.ts</code> com <code>NestFactory.create(AppModule)</code> e <code>app.listen(3000)</code>. A grande diferença: não existe <code>AppModule</code> listando <code>imports</code>, <code>controllers</code> e <code>providers</code>. O scan acha tudo sozinho.</p>`,
      linguagem: 'java',
      codigo: `package br.gov.defensoria.atendimento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AtendimentoApplication {
    public static void main(String[] args) {
        SpringApplication.run(AtendimentoApplication.class, args);
    }
}` },
    { titulo: 'Auto-configuração: convenção que recua',
      texto: `<p>A <b>auto-configuração</b> cria beans conforme o que está no <b>classpath</b> e nas propriedades. Com o starter web, você ganha Tomcat, Jackson e Spring MVC. Com JPA e o driver do PostgreSQL, ganha <code>DataSource</code>, <code>EntityManagerFactory</code> e gerenciador de transações, configurados pelas propriedades <code>spring.datasource.*</code>.</p>
<p>Ela é <b>condicional</b>: as classes de auto-configuração usam <code>@ConditionalOnClass</code> e <code>@ConditionalOnMissingBean</code>. Se você declara o seu próprio bean do mesmo tipo, a padrão <b>recua</b>. É assim que se customiza sem brigar com o framework.</p>
<p>Para entender por que algo foi (ou não) configurado, suba com <code>--debug</code> (ou <code>debug: true</code>) e leia o <i>conditions evaluation report</i>.</p>
<p><b>Erro comum:</b> pôr o starter de JPA sem configurar banco. A app não sobe: "Failed to configure a DataSource: 'url' attribute is not specified". A auto-configuração viu o JPA e quis um banco.</p>
<p><b>No NestJS/TypeScript:</b> no Nest você chama <code>TypeOrmModule.forRoot(...)</code> explicitamente. No Boot, adicionar a dependência <b>já</b> é a configuração.</p>`,
      linguagem: 'bash',
      codigo: `./mvnw spring-boot:run -Dspring-boot.run.arguments=--debug

# Trecho do relatório:
# Positive matches:
#   DataSourceAutoConfiguration matched:
#     - @ConditionalOnClass found required classes 'javax.sql.DataSource' ...
# Negative matches:
#   MongoAutoConfiguration:
#     - @ConditionalOnClass did not find required class 'com.mongodb.client.MongoClient'` },
    { titulo: 'application.yml e properties',
      texto: `<p>A configuração fica em <code>src/main/resources/application.properties</code> ou <code>application.yml</code> (mesmas chaves, formatos diferentes). Há centenas de chaves prontas: <code>server.port</code>, <code>spring.datasource.url</code>, <code>spring.jpa.open-in-view</code>, <code>logging.level.*</code>.</p>
<p>Placeholders <code>\${VAR:padrao}</code> leem variáveis de ambiente com valor padrão. Além disso, qualquer chave pode ser sobrescrita por variável de ambiente com <i>relaxed binding</i>: <code>SPRING_DATASOURCE_URL</code> sobrescreve <code>spring.datasource.url</code>. É o que você usa no Docker e no Kubernetes.</p>
<p>Perfis (<code>application-dev.yml</code>, ativado por <code>spring.profiles.active=dev</code>) separam ambientes. O módulo de produção aprofunda.</p>
<p><b>No NestJS/TypeScript:</b> é o <code>.env</code> mais o <code>@nestjs/config</code>, só que embutido e com as chaves do framework já conhecidas pela IDE, com autocompletar.</p>`,
      linguagem: 'yaml',
      codigo: `spring:
  application:
    name: atendimento
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/atendimento}
    username: \${DB_USER:app}
    password: \${DB_PASSWORD}
server:
  port: 8080
logging:
  level:
    br.gov.defensoria: DEBUG` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Por que a dependência <code>spring-boot-starter-web</code> no <code>pom.xml</code> não tem <code>&lt;version&gt;</code>?',
      opcoes: [
        'O Maven baixa sempre a versão mais recente',
        'O parent <code>spring-boot-starter-parent</code> gerencia as versões (BOM)',
        'Esqueceram; o build vai falhar',
      ],
      certa: 1,
      dicas: ['Olhe o bloco <code>&lt;parent&gt;</code> no topo do pom.', 'O Boot testa um conjunto de versões que funcionam juntas.'],
      explica: 'O parent importa o gerenciamento de dependências do Spring Boot, que fixa versões compatíveis. O Maven não pega "a mais recente" sozinho: sem versão e sem gerenciamento, o build falha. Trocar a versão do parent atualiza tudo de uma vez.' },
    { tipo: 'escolha',
      pergunta: 'A classe principal está em <code>br.gov.defensoria.atendimento</code>. Qual <code>@Service</code> <b>não</b> será encontrado pelo component scan?',
      opcoes: [
        'br.gov.defensoria.atendimento.assistido.AssistidoService',
        'br.gov.defensoria.atendimento.AgendaService',
        'br.gov.defensoria.integracao.TjgoService',
        'br.gov.defensoria.atendimento.a.b.c.RelatorioService',
      ],
      opcoesCodigo: true,
      certa: 2,
      dicas: ['O scan começa no pacote da classe com <code>@SpringBootApplication</code>.', 'Ele desce para subpacotes, mas não sobe nem vai para os vizinhos.'],
      explica: '<code>br.gov.defensoria.integracao</code> é vizinho, não subpacote, de <code>atendimento</code>. A app falha com "required a bean of type TjgoService that could not be found". Mova o pacote para dentro ou ajuste <code>scanBasePackages</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete a classe principal:',
      codigo: `@[[0]]
public class AtendimentoApplication {
    public static void main(String[] args) {
        [[1]].run(AtendimentoApplication.class, args);
    }
}`,
      respostas: [['SpringBootApplication'], ['SpringApplication']],
      dicas: ['Uma anotação que junta configuração, auto-configuração e component scan.', 'A classe que inicia o container tem quase o mesmo nome da anotação.'],
      explica: '<code>@SpringBootApplication</code> marca a classe, e <code>SpringApplication.run</code> cria o contexto e sobe o servidor. É o par <code>AppModule</code> + <code>NestFactory.create</code> do NestJS.' },
    { tipo: 'escolha',
      pergunta: 'Você adicionou <code>spring-boot-starter-data-jpa</code> e rodou a app. Ela não sobe: "Failed to configure a DataSource: \'url\' attribute is not specified". Por quê?',
      opcoes: [
        'O starter de JPA está quebrado nessa versão',
        'A auto-configuração viu JPA no classpath e precisa de <code>spring.datasource.url</code> (ou de um banco embutido como H2)',
        'Falta anotar a classe principal com @EnableJpa',
      ],
      certa: 1,
      dicas: ['A auto-configuração reage ao que está no classpath.', 'Qual propriedade a mensagem cita?'],
      explica: 'Com JPA no classpath, o Boot tenta criar um <code>DataSource</code>. Sem URL e sem banco embutido, falha na inicialização. Configure <code>spring.datasource.url</code> ou adicione H2 para testes. <code>@EnableJpa</code> não existe (há <code>@EnableJpaRepositories</code>, que o Boot já aplica).' },
    { tipo: 'escolha',
      pergunta: 'Você declara seu próprio bean <code>DataSource</code> numa <code>@Configuration</code> (um pool com ajustes específicos). O que acontece com o <code>DataSource</code> da auto-configuração?',
      opcoes: [
        'A app falha com dois beans do mesmo tipo',
        'A auto-configuração recua por causa de @ConditionalOnMissingBean, e o seu é usado',
        'O do Boot sempre ganha; o seu é ignorado',
      ],
      certa: 1,
      dicas: ['A auto-configuração é condicional.', 'Ela só cria o bean se ele estiver faltando.'],
      explica: 'A auto-configuração do <code>DataSource</code> é condicional à ausência de um bean desse tipo: se você definiu um, o padrão não é criado e não há conflito. Customizar o Boot é, em geral, declarar o seu bean ou ajustar propriedades. Quando dá, prefira propriedades (<code>spring.datasource.hikari.*</code>), que mantêm o resto da configuração padrão.' },
    { tipo: 'montar',
      pergunta: 'Monte o comando que gera o jar executável e depois o roda:',
      certa: ['./mvnw', 'clean', 'package', '&&', 'java', '-jar', 'target/atendimento-0.0.1-SNAPSHOT.jar'],
      extras: ['npm', 'build', 'node'],
      dicas: ['O wrapper do Maven fica na raiz do projeto.', 'O jar vai para a pasta <code>target</code>.'],
      explica: '<code>./mvnw clean package</code> compila, roda os testes e gera o jar em <code>target/</code>. Esse jar já tem o Tomcat embutido, então <code>java -jar</code> basta: não há servidor de aplicação para instalar.' },
    { tipo: 'completar',
      pergunta: 'Complete o <code>application.yml</code> para ler a URL do banco de uma variável de ambiente, com padrão local:',
      codigo: `spring:
  datasource:
    url: [[0]]{DB_URL:jdbc:postgresql://localhost:5432/atendimento}
server:
  [[1]]: 8081`,
      respostas: [['$'], ['port']],
      dicas: ['O placeholder é o mesmo do shell e do template literal.', 'A chave da porta fica embaixo de <code>server</code>.'],
      explica: '<code>\${DB_URL:padrao}</code> lê a variável de ambiente e usa o padrão depois dos dois-pontos se ela não existir. <code>server.port</code> muda a porta do Tomcat embutido (padrão 8080).' },
    { tipo: 'escolha',
      pergunta: 'Em produção, o <code>application.yml</code> tem <code>spring.datasource.url</code> apontando para localhost. Qual variável de ambiente sobrescreve isso sem mudar o arquivo?',
      opcoes: ['DATASOURCE_URL', 'SPRING_DATASOURCE_URL', 'spring.datasource.url', 'APP_DB_URL'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['O Boot faz <i>relaxed binding</i> de variáveis de ambiente.', 'Troque pontos por <code>_</code> e use maiúsculas, com a chave inteira.'],
      explica: 'Variáveis de ambiente têm precedência sobre o arquivo, e <code>SPRING_DATASOURCE_URL</code> mapeia para <code>spring.datasource.url</code>. Sem o prefixo <code>SPRING_</code> é outra chave, e nomes com ponto não são válidos na maioria dos shells.' },
  ],
})
