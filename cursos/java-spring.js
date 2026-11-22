// Gerado por ferramentas/gerar_cursos.py a partir de conteudo/java-spring/. Não edite à mão.
(() => {
const MODULOS = []
const CURSO = {
  kicker: 'Java + Spring Boot',
  titulo: 'Do TypeScript ao <em>Spring Boot</em>: APIs Java com a segurança de quem já sabe NestJS.',
  subtitulo: 'Cada conceito é ligado ao que você já usa no NestJS e no TypeScript. No fim, você lê, escreve e defende uma API Spring Boot de produção.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Java para quem vem do TypeScript', tipo: 'pedra', ids: ['java-base', 'java-oo', 'java-colecoes', 'java-erros'] },
    { titulo: 'Spring Boot: a base de uma API', tipo: 'papel', ids: ['spring-projeto', 'spring-di', 'spring-rest', 'spring-validacao'] },
    { titulo: 'Dados, testes e produção', tipo: 'tesoura', ids: ['spring-jpa', 'spring-jpa-avancado', 'spring-testes', 'spring-seguranca', 'spring-producao'] },
  ],
  vaga: [
    { texto: 'Ler e escrever Java moderno (21+): tipos, records, interfaces e generics', modulos: ['java-base', 'java-oo'] },
    { texto: 'Trabalhar com coleções, Streams e Optional sem medo de NullPointerException', modulos: ['java-colecoes', 'java-erros'] },
    { texto: 'Criar e entender um projeto Spring Boot (Maven, starters, application.yml)', modulos: ['spring-projeto'] },
    { texto: 'Explicar beans e injeção de dependência comparando com os providers do NestJS', modulos: ['spring-di'] },
    { texto: 'Expor endpoints REST com DTOs, status HTTP corretos, validação e erros padronizados', modulos: ['spring-rest', 'spring-validacao'] },
    { texto: 'Persistir dados com Spring Data JPA, relacionamentos, transações e migrations', modulos: ['spring-jpa', 'spring-jpa-avancado'] },
    { texto: 'Testar a API: unidade, fatia web, repositório e integração', modulos: ['spring-testes'] },
    { texto: 'Proteger a API com Spring Security e JWT', modulos: ['spring-seguranca'] },
    { texto: 'Preparar para produção: perfis, configuração, Actuator e Docker', modulos: ['spring-producao'], diferencial: true },
  ],
}

// ---- 01-java-base.js
MODULOS.push({
  id: 'java-base',
  titulo: 'Java em 15 minutos',
  icone: '☕',
  aprende: 'JVM, tipos, String, == vs equals, packages e static',
  porque: 'Todo código Spring que você vai ler na entrevista ou no trabalho assume que essas regras básicas do Java já são automáticas para você.',
  gancho: {
    titulo: 'O 127 e o 128',
    pergunta: 'O que este código imprime?',
    linguagem: 'java',
    codigo: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);
System.out.println(c == d);`,
    opcoes: ['true e true', 'true e false', 'false e false', 'Não compila'],
    certa: 1,
    revelacao: '<code>==</code> em <code>Integer</code> compara <b>referência</b>, e por padrão a JVM reaproveita os objetos de -128 a 127. Por isso 127 "funciona" e 128 não. Nesta lição você vai ver primitivos, wrappers e por que objeto se compara com <code>equals</code>.',
  },
  videos: [
    { id: 'EQZfuIJ49hI', titulo: 'Aprenda Java: JVM, JRE e JDK | Explicação completa e prática', canal: 'Michelli Brito',
      duracao: '16:54', idioma: 'pt',
      nota: 'Do <code>javac</code> ao bytecode rodando na JVM: repare na diferença entre JDK (compila) e JRE/JVM (executa), a base da primeira lição.' },
    { id: 'AoUVdLWLFQw', titulo: '.equals() vs. == in Java - The Real Difference', canal: 'Coding with John',
      duracao: '8:48', idioma: 'en',
      nota: 'Mostra na memória por que <code>==</code> compara referência e <code>equals</code> compara conteúdo, o mesmo motivo do 127 e 128 do gancho.' },
    { id: 'C3Z9lkJSHqk', titulo: 'Como usar o modificador static do Java - Ep. 9', canal: 'Giuliana Bezerra',
      duracao: '15:50', idioma: 'pt',
      nota: 'Observe que membro <code>static</code> pertence à classe e é compartilhado por todos os objetos, como no fechamento do módulo.' },
  ],
  resumo: [
    '<code>javac</code> compila para <b>bytecode</b> (<code>.class</code>); a <b>JVM</b> executa. Os tipos continuam existindo em tempo de execução',
    'Primitivos (<code>int</code>, <code>long</code>, <code>boolean</code>) não aceitam <code>null</code>; wrappers (<code>Integer</code>, <code>Long</code>) aceitam',
    '<code>var</code> só em variável local com inicializador: o tipo é inferido e fica <b>fixo</b>',
    'Compare objetos com <code>equals</code>. <code>==</code> em objeto compara <b>referência</b>',
    'O nome do <code>package</code> segue a pasta; <code>java.lang</code> já vem importado',
    '<code>static</code> pertence à classe, não à instância',
  ],
  ensino: [
    { titulo: 'JDK, JVM e por que o Java compila de verdade',
      texto: `<p>O <b>JDK</b> traz o compilador <code>javac</code> e a <b>JVM</b>. O <code>javac</code> transforma <code>.java</code> em <b>bytecode</b> (<code>.class</code>), e a JVM executa esse bytecode em qualquer sistema operacional, otimizando o código quente com o compilador JIT enquanto roda.</p>
<p>A diferença que mais importa: os tipos <b>não somem</b>. Um cast errado vira <code>ClassCastException</code> em tempo de execução, e o compilador recusa o build se os tipos não fecham. Não existe <code>any</code> nem <code>// @ts-ignore</code>.</p>
<p>Para um teste rápido, o Java 11+ roda um arquivo único direto: <code>java Ola.java</code>. Em projeto real, quem compila é o Maven ou o Gradle.</p>
<p><b>No NestJS/TypeScript:</b> o <code>tsc</code> <i>transpila</i> e apaga os tipos; o Node executa JavaScript sem saber que eles existiram. No Java, o tipo faz parte do programa que roda.</p>`,
      linguagem: 'bash',
      codigo: `javac Ola.java      # gera Ola.class (bytecode)
java Ola            # a JVM executa o bytecode
java Ola.java       # Java 11+: compila em memória e roda (arquivo único)
java -version       # use 21 (LTS) neste curso` },
    { titulo: 'Primitivos, wrappers e o null escondido',
      texto: `<p>Java tem 8 <b>primitivos</b>: <code>int</code>, <code>long</code>, <code>double</code>, <code>boolean</code>, <code>char</code>, <code>byte</code>, <code>short</code>, <code>float</code>. Eles guardam o valor direto e <b>nunca são null</b>. Cada um tem um <b>wrapper</b> objeto: <code>Integer</code>, <code>Long</code>, <code>Boolean</code>...</p>
<p>O compilador converte sozinho entre os dois (<i>autoboxing</i>). A armadilha: <b>desembrulhar um wrapper null lança <code>NullPointerException</code></b>. Isso aparece muito com campos de entidade (<code>Long id</code>) e valores de <code>Map</code>.</p>
<p>Outras pegadinhas: <code>7 / 2</code> entre inteiros dá <code>3</code>; número grande precisa de <code>L</code> (<code>3_000_000_000L</code>); para dinheiro use <code>BigDecimal</code>, nunca <code>double</code>.</p>
<p><b>No NestJS/TypeScript:</b> existe um único <code>number</code> (double). No Java você escolhe o tipo, e coleções genéricas só aceitam wrappers: <code>List&lt;Integer&gt;</code>, nunca <code>List&lt;int&gt;</code>.</p>`,
      linguagem: 'java',
      codigo: `int prazoDias = 15;          // primitivo: nunca null
Integer prioridade = null;   // wrapper: pode ser null
int p = prioridade;          // compila, mas lança NullPointerException

long protocolo = 3_000_000_000L;
System.out.println(7 / 2);   // 3 (divisão inteira)
System.out.println(7 / 2.0); // 3.5` },
    { titulo: 'var, String e == vs equals',
      texto: `<p><code>var</code> infere o tipo de uma <b>variável local</b> a partir do inicializador. O tipo fica fixo: não é <code>any</code>. Não vale em campo, parâmetro nem retorno, e <code>var x = null;</code> não compila.</p>
<p><code>String</code> é <b>imutável</b>: <code>trim()</code>, <code>toUpperCase()</code> devolvem uma String nova. Para montar texto em laço, use <code>StringBuilder</code>. Para texto de várias linhas, Java 15+ tem <i>text blocks</i> com <code>"""</code>.</p>
<p>A pegadinha clássica: <b><code>==</code> em objetos compara referência</b> (é o mesmo objeto na memória?). Para comparar conteúdo, use <code>equals</code>. Com literais iguais o <code>==</code> às vezes "funciona" porque a JVM reaproveita a String, e é aí que o bug passa no teste e quebra em produção, com valor vindo do banco ou da requisição.</p>
<p><b>No NestJS/TypeScript:</b> <code>===</code> entre strings compara conteúdo. No Java, <code>==</code> só é seguro para primitivos e enums. Para evitar NPE quando o valor pode ser null, escreva <code>"ATIVO".equals(status)</code> ou <code>Objects.equals(a, b)</code>.</p>`,
      linguagem: 'java',
      codigo: `var nome = "Maria";              // String inferida
String lido = new String("Maria"); // simula valor vindo de fora

System.out.println(nome == lido);       // false: objetos diferentes
System.out.println(nome.equals(lido));  // true: mesmo conteúdo

Integer a = 1000, b = 1000;
System.out.println(a == b);       // false (wrapper também é objeto)
System.out.println(a.equals(b));  // true` },
    { titulo: 'main, packages e imports',
      texto: `<p>Todo código Java mora dentro de uma <b>classe</b>. O ponto de entrada é <code>public static void main(String[] args)</code>. Uma classe <code>public</code> fica num arquivo com o <b>mesmo nome</b>: <code>AtendimentoApp.java</code>.</p>
<p>O <code>package</code> é o namespace e precisa bater com a pasta: <code>package br.gov.defensoria.atendimento;</code> fica em <code>src/main/java/br/gov/defensoria/atendimento/</code>. Por convenção, o nome é o domínio invertido.</p>
<p><code>import</code> traz classes de outro pacote. <code>java.lang</code> (<code>String</code>, <code>Integer</code>, <code>Math</code>) vem automático. Classes do mesmo pacote se enxergam sem import.</p>
<p><b>No NestJS/TypeScript:</b> o import é por <b>caminho de arquivo</b> e você exporta explicitamente. No Java o import é por <b>nome qualificado</b> (<code>java.util.List</code>), e a visibilidade vem dos modificadores <code>public</code>, <code>private</code> ou nenhum (visível só no pacote).</p>`,
      linguagem: 'java',
      codigo: `package br.gov.defensoria.atendimento;

import java.time.LocalDate;
import java.util.List;

public class AtendimentoApp {
    public static void main(String[] args) {
        List<String> comarcas = List.of("Goiânia", "Anápolis");
        System.out.println(LocalDate.now() + " " + comarcas);
    }
}` },
    { titulo: 'static: da classe, não do objeto',
      texto: `<p>Um membro <code>static</code> pertence à <b>classe</b>: existe uma cópia só, e você chama sem criar instância (<code>Math.max(1, 2)</code>, <code>List.of()</code>). Um método static <b>não enxerga</b> campos de instância, porque não há <code>this</code>.</p>
<p>Constante em Java é <code>static final</code> com nome em MAIÚSCULAS. <code>final</code> numa variável impede reatribuição, mas não torna o objeto imutável (como o <code>const</code> do TS).</p>
<p><b>Erro comum:</b> "non-static method cannot be referenced from a static context". Aparece quando o <code>main</code> tenta chamar um método de instância direto. No Spring você quase não escreve static: os serviços são objetos injetados.</p>
<p><b>No NestJS/TypeScript:</b> funciona como <code>static</code> em classe TS. A diferença é que no Java não existe função solta fora de classe, então utilitários viram métodos static.</p>`,
      linguagem: 'java',
      codigo: `public class Prazos {
    public static final int PRAZO_PADRAO_DIAS = 15;

    public static int emDobro(int dias) {   // Defensoria tem prazo em dobro
        return dias * 2;
    }
}

int prazo = Prazos.emDobro(Prazos.PRAZO_PADRAO_DIAS); // 30` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'O que acontece com os tipos de um programa Java depois de compilado?',
      opcoes: [
        'Continuam no bytecode: a JVM conhece os tipos e um cast inválido lança <code>ClassCastException</code>',
        'São apagados como no TypeScript; só servem para o editor',
        'Só existem se você compilar com uma flag especial de depuração',
      ],
      certa: 0,
      dicas: ['Compare com o que o <code>tsc</code> faz com os tipos.', 'O bytecode guarda a classe de cada objeto.'],
      explica: 'O Java mantém a informação de tipo em tempo de execução, por isso existe <code>ClassCastException</code> e <code>instanceof</code> funciona com classes. A opção "apagados como no TS" é o modelo do TypeScript. (Detalhe: o parâmetro dos generics é apagado, mas a classe do objeto não.)' },
    { tipo: 'escolha',
      pergunta: 'O que esta linha faz quando <code>assistido.getIdade()</code> devolve <code>Integer</code> e o valor é <code>null</code>?',
      codigo: `int idade = assistido.getIdade();`,
      opcoes: ['Atribui 0', 'Lança NullPointerException', 'Não compila', 'Atribui null'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['<code>int</code> é primitivo: pode guardar null?', 'O compilador insere um <code>.intValue()</code> escondido.'],
      explica: 'O autounboxing chama <code>intValue()</code> no wrapper; se ele é null, vem <code>NullPointerException</code>. Compila normalmente, e nenhum valor padrão é usado: o 0 só existe para campos primitivos não inicializados.' },
    { tipo: 'escolha',
      pergunta: 'O <code>status</code> veio do corpo da requisição com o texto "ARQUIVADO". O que a condição devolve?',
      codigo: `if (status == "ARQUIVADO") { ... }`,
      opcoes: [
        'Sempre true, porque o conteúdo é igual',
        'Provavelmente false: <code>==</code> compara referência, e a String da requisição é outro objeto',
        'Erro de compilação: não dá para usar == com String',
      ],
      certa: 1,
      dicas: ['Em objetos, <code>==</code> pergunta "é o mesmo objeto?".', 'Valor criado em tempo de execução não é o literal reaproveitado pela JVM.'],
      explica: 'Compila, mas compara referências. Com dois literais iguais pode dar true por coincidência (a JVM reaproveita literais), e é isso que engana nos testes. O certo é <code>"ARQUIVADO".equals(status)</code>, que também não quebra se <code>status</code> for null.' },
    { tipo: 'escolha',
      pergunta: 'Qual uso de <code>var</code> compila?',
      opcoes: [
        'var processos = new ArrayList<String>();',
        'var protocolo = null;',
        'private var nome = "Ana"; // campo da classe',
        'public var buscar(Long id) { ... }',
      ],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['<code>var</code> precisa de um inicializador com tipo claro.', 'Ele só vale para variáveis locais.'],
      explica: '<code>var</code> é inferência de variável local: precisa de inicializador com tipo (null não tem tipo) e não vale em campo, parâmetro ou retorno. A primeira linha infere <code>ArrayList&lt;String&gt;</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete o ponto de entrada da aplicação:',
      codigo: `public class SistemaAtendimento {
    public [[0]] void [[1]](String[] args) {
        System.out.println("Subindo...");
    }
}`,
      respostas: [['static'], ['main']],
      dicas: ['O método roda sem nenhum objeto criado.', 'O nome é fixo, o mesmo do C.'],
      explica: 'A JVM procura <code>public static void main(String[] args)</code>. É <code>static</code> porque nada foi instanciado ainda. No Spring Boot esse main só chama <code>SpringApplication.run</code>.' },
    { tipo: 'completar',
      pergunta: 'Compare o conteúdo sem risco de NullPointerException quando <code>comarca</code> for null:',
      codigo: `if ("Goiânia".[[0]](comarca)) {
    distribuirParaCapital();
}`,
      respostas: [['equals']],
      dicas: ['Chame o método no lado que você sabe que não é null.', 'É o método herdado de <code>Object</code> para comparar conteúdo.'],
      explica: 'Chamar <code>equals</code> no literal nunca dá NPE: <code>"Goiânia".equals(null)</code> devolve false. Já <code>comarca.equals("Goiânia")</code> quebra se <code>comarca</code> for null. <code>Objects.equals(a, b)</code> é a alternativa quando os dois lados podem ser null.' },
    { tipo: 'montar',
      pergunta: 'Monte a constante do prazo padrão, acessível de fora e sem instância:',
      certa: ['public', 'static', 'final', 'int', 'PRAZO_DIAS', '=', '15;'],
      extras: ['const', 'readonly', 'var'],
      dicas: ['Java não tem <code>const</code> nem <code>readonly</code>.', 'Constante = da classe (<code>static</code>) + não reatribuível (<code>final</code>).'],
      explica: '<code>static final</code> com nome em maiúsculas é a constante idiomática. <code>const</code> é palavra reservada mas não usada no Java, <code>readonly</code> é do TS, e <code>var</code> não vale em campo.' },
    { tipo: 'escolha',
      pergunta: 'A classe está em <code>src/main/java/br/gov/defensoria/processo/Processo.java</code>. Qual é a primeira linha correta?',
      opcoes: [
        'package br.gov.defensoria.processo;',
        'package processo;',
        'import br.gov.defensoria.processo;',
        'module br.gov.defensoria.processo;',
      ],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['O pacote espelha a pasta a partir de <code>src/main/java</code>.', 'A palavra é <code>package</code>, com o caminho completo separado por pontos.'],
      explica: 'O pacote é o caminho completo a partir da raiz de fontes. <code>package processo;</code> não bate com a pasta, e <code>import</code> serve para trazer classes de outros pacotes, não para declarar o próprio.' },
  ],
})

// ---- 02-java-oo.js
MODULOS.push({
  id: 'java-oo',
  titulo: 'Classes, records e interfaces',
  icone: '🧱',
  aprende: 'classes, construtores, records, interfaces, enums e generics',
  porque: 'Entidade, DTO, serviço e repositório do Spring são, respectivamente, classe, record, classe e interface: é a gramática de todo projeto.',
  gancho: {
    titulo: 'Mesma forma, outro tipo',
    pergunta: 'A classe tem exatamente o método da interface. O que acontece na última linha?',
    linguagem: 'java',
    codigo: `interface Notificador { void enviar(String msg); }

class EmailService {
    public void enviar(String msg) { /* ... */ }
}

Notificador n = new EmailService();`,
    opcoes: ['Compila: a forma bate', 'Erro de compilação', 'ClassCastException ao rodar'],
    certa: 1,
    revelacao: 'No TypeScript a tipagem é estrutural; no Java ela é <b>nominal</b>: sem <code>implements Notificador</code>, o compilador recusa (<i>incompatible types</i>). Nesta lição você vai ver classes, records, interfaces, enums e generics do jeito que o Spring usa.',
  },
  videos: [
    { id: 'lmzpyCNyziI', titulo: 'Crie DTO usando Record em Java - Novas Features JDK', canal: 'Michelli Brito',
      duracao: '23:33', idioma: 'pt',
      nota: 'Compare a classe DTO verbosa com o <code>record</code>: construtor, acessores <code>nome()</code>, <code>equals</code> e <code>toString</code> saem de graça, como na lição de records.' },
    { id: 'OAk6MjD96gM', titulo: 'Crie códigos seguros e flexíveis com Generics no Java!', canal: 'Giuliana Bezerra',
      duracao: '16:32', idioma: 'pt',
      nota: 'Veja como <code>&lt;T&gt;</code> troca casts e <code>Object</code> por checagem do compilador, o mesmo papel dos generics do TypeScript.' },
    { id: 'wq9SJb8VeyM', titulo: 'Java Enums Explained in 6 Minutes', canal: 'Coding with John',
      duracao: '5:58', idioma: 'en',
      nota: 'Repare no enum com campo, construtor e método: é o enum com comportamento que o módulo usa para status e tipos.' },
  ],
  resumo: [
    'Sem modificador, o membro é visível só no <b>pacote</b>. Campos são <code>private</code> e saem por métodos',
    'Declarou um construtor? O construtor vazio padrão <b>some</b>',
    '<code>record</code> = classe imutável com construtor, acessores <code>nome()</code>, <code>equals</code>, <code>hashCode</code> e <code>toString</code>',
    'Interface é contrato <b>nominal</b>: a classe precisa declarar <code>implements</code>',
    'Enum é uma classe com instâncias fixas; pode ter campos e métodos',
    'Generics só aceitam objetos (<code>List&lt;Integer&gt;</code>) e são apagados em tempo de execução',
  ],
  ensino: [
    { titulo: 'Classe, construtor e encapsulamento',
      texto: `<p>Uma classe Java declara campos com tipo, um ou mais <b>construtores</b> (mesmo nome da classe, sem retorno) e métodos. É possível ter vários construtores com parâmetros diferentes (sobrecarga) e um chamar o outro com <code>this(...)</code>.</p>
<p>Encapsulamento por convenção: campos <code>private</code>, acesso por <code>getX()</code>/<code>setX()</code> só quando necessário. Prefira métodos com nome de regra (<code>arquivar()</code>) a um setter genérico de status.</p>
<p><b>Pegadinha:</b> sem modificador, o membro não é público: ele é <b>package-private</b>. E se você declara qualquer construtor, o construtor vazio padrão deixa de existir (o JPA, por exemplo, exige um).</p>
<p><b>No NestJS/TypeScript:</b> no TS o padrão é <code>public</code> e existe o atalho <code>constructor(private readonly x)</code>. No Java você declara o campo e atribui no construtor; o atalho equivalente é o <code>record</code> (ou Lombok, se o projeto usar).</p>`,
      linguagem: 'java',
      codigo: `public class Atendimento {
    private final Long id;
    private String status;

    public Atendimento(Long id) {
        this(id, "ABERTO");          // chama o outro construtor
    }

    public Atendimento(Long id, String status) {
        this.id = id;
        this.status = status;
    }

    public void encerrar() { this.status = "ENCERRADO"; }
    public String getStatus() { return status; }
}` },
    { titulo: 'record: o DTO em uma linha',
      texto: `<p>Desde o Java 16, <code>record</code> declara uma classe <b>imutável</b> de dados. O compilador gera campos <code>private final</code>, o construtor com todos os componentes, os acessores, <code>equals</code>, <code>hashCode</code> e <code>toString</code>.</p>
<p>O acessor tem o nome do componente: <code>dto.nome()</code>, <b>não</b> <code>getNome()</code>. Para validar ou normalizar, use o <b>construtor compacto</b> (sem lista de parâmetros). Record não pode estender classe, mas pode implementar interface.</p>
<p>Uso típico no Spring: DTOs de entrada e saída da API, que o Jackson lê e escreve sem configuração extra. Entidade JPA <b>não</b> deve ser record, porque o JPA precisa de construtor vazio e de campos mutáveis.</p>
<p><b>No NestJS/TypeScript:</b> é o seu <code>class CriarAssistidoDto</code> ou <code>type</code>, mas com igualdade por valor de graça: dois records com os mesmos dados são <code>equals</code>.</p>`,
      linguagem: 'java',
      codigo: `public record AssistidoDto(Long id, String nome, String cpf) {
    public AssistidoDto {                      // construtor compacto
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("nome é obrigatório");
        }
        nome = nome.trim();
    }
}

var dto = new AssistidoDto(1L, " Maria ", "000.000.000-00");
dto.nome();   // "Maria"` },
    { titulo: 'Interfaces: contrato nominal',
      texto: `<p>Uma <code>interface</code> declara métodos que uma classe promete ter. A classe precisa dizer <code>implements</code>: no Java a tipagem é <b>nominal</b>, não basta ter os mesmos métodos. Uma classe estende (<code>extends</code>) só uma classe, mas implementa várias interfaces.</p>
<p>Interfaces podem ter métodos <code>default</code> (com corpo) e <code>static</code>. Desde o Java 17, <code>sealed interface ... permits</code> restringe quem pode implementar.</p>
<p>No Spring, interfaces aparecem em dois lugares: repositórios do Spring Data (você só declara a interface, o framework gera a implementação) e pontos de troca, como um <code>Notificador</code> com versão por e-mail e por SMS.</p>
<p><b>No NestJS/TypeScript:</b> no TS a tipagem é <b>estrutural</b>: qualquer objeto com o formato certo serve, e a interface some no build. No Java a interface é um tipo real, existe em tempo de execução, e é por ela que o Spring injeta dependências.</p>`,
      linguagem: 'java',
      codigo: `public interface Notificador {
    void enviar(String destino, String mensagem);

    default void enviarLembrete(String destino) {
        enviar(destino, "Lembrete: você tem atendimento amanhã.");
    }
}

public class NotificadorEmail implements Notificador {
    @Override
    public void enviar(String destino, String mensagem) { /* SMTP */ }
}` },
    { titulo: 'Enums com comportamento',
      texto: `<p>Um <code>enum</code> Java é uma classe com um conjunto fixo de instâncias. Ele pode ter campos, construtor e métodos. <code>values()</code> lista todos, <code>name()</code> devolve o texto, e <code>valueOf("X")</code> converte de String, lançando <code>IllegalArgumentException</code> se o texto não existir.</p>
<p>Enums se comparam com <code>==</code> com segurança, porque cada constante é única. Combinam bem com o <code>switch</code> em forma de expressão (Java 14+), que o compilador checa: num switch de enum sem <code>default</code>, faltar um caso é erro de compilação.</p>
<p><b>No NestJS/TypeScript:</b> o <code>enum</code> do TS (ou a união <code>'ABERTO' | 'ENCERRADO'</code>) é só um valor. No Java, a constante carrega dados e regras, o que evita aquele <code>switch</code> espalhado pelo código.</p>`,
      linguagem: 'java',
      codigo: `public enum StatusProcesso {
    EM_ANDAMENTO("Em andamento"),
    SUSPENSO("Suspenso"),
    ARQUIVADO("Arquivado");

    private final String rotulo;
    StatusProcesso(String rotulo) { this.rotulo = rotulo; }
    public String rotulo() { return rotulo; }

    public boolean aceitaPeticao() {
        return switch (this) {
            case EM_ANDAMENTO, SUSPENSO -> true;
            case ARQUIVADO -> false;
        };
    }
}` },
    { titulo: 'Generics básicos',
      texto: `<p>Generics funcionam como no TS: <code>List&lt;Processo&gt;</code>, <code>Map&lt;String, Long&gt;</code>, <code>Optional&lt;Assistido&gt;</code>. O <b>diamante</b> <code>&lt;&gt;</code> deixa o compilador inferir o lado direito: <code>new ArrayList&lt;&gt;()</code>.</p>
<p>Duas diferenças importantes. Primeiro, o parâmetro precisa ser objeto: <code>List&lt;int&gt;</code> não compila, use <code>List&lt;Integer&gt;</code>. Segundo, há <b>type erasure</b>: em tempo de execução uma <code>List&lt;String&gt;</code> é só uma <code>List</code>, então <code>new T()</code> e <code>instanceof List&lt;String&gt;</code> não existem.</p>
<p>Um método genérico declara o parâmetro de tipo antes do retorno. Restrições usam <code>extends</code>: <code>&lt;T extends Comparable&lt;T&gt;&gt;</code>.</p>
<p><b>No NestJS/TypeScript:</b> é o <code>Repository&lt;Usuario&gt;</code> do TypeORM. A sintaxe do método genérico muda de lugar: TS escreve <code>function primeiro&lt;T&gt;(...)</code>; Java escreve <code>&lt;T&gt; T primeiro(...)</code>.</p>`,
      linguagem: 'java',
      codigo: `public record Pagina<T>(List<T> itens, long total) {}

public static <T> T primeiroOuPadrao(List<T> lista, T padrao) {
    return lista.isEmpty() ? padrao : lista.get(0);
}

Pagina<AssistidoDto> pagina = new Pagina<>(List.of(), 0);
List<Integer> prazos = new ArrayList<>();   // List<int> não compila` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Dado <code>record ProcessoDto(String numero, String vara)</code>, como você lê o número?',
      opcoes: ['dto.getNumero()', 'dto.numero()', 'dto.numero', 'dto.get("numero")'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['Records não seguem a convenção JavaBean.', 'O acessor tem exatamente o nome do componente.'],
      explica: 'O record gera <code>numero()</code>. <code>getNumero()</code> é o padrão JavaBean de classes comuns (e do Lombok <code>@Getter</code>), e o campo <code>numero</code> é <code>private</code>, então <code>dto.numero</code> não compila fora do record.' },
    { tipo: 'escolha',
      pergunta: 'A classe só tem o construtor abaixo. O que acontece com <code>new Assistido()</code>?',
      codigo: `public class Assistido {
    private String nome;
    public Assistido(String nome) { this.nome = nome; }
}`,
      opcoes: [
        'Cria um Assistido com nome null',
        'Não compila: o construtor padrão deixa de existir quando você declara um',
        'Compila, mas lança exceção ao executar',
      ],
      certa: 1,
      dicas: ['O compilador só gera o construtor vazio se a classe não tiver nenhum.', 'É o motivo de entidades JPA declararem um construtor vazio protegido.'],
      explica: 'O construtor vazio implícito só existe quando a classe não declara nenhum. Declarou um com parâmetro, perdeu o vazio. É erro de compilação, não de execução. Frameworks como JPA e (às vezes) Jackson precisam dele, então você o declara explicitamente.' },
    { tipo: 'completar',
      pergunta: 'Complete o DTO de resposta e a classe que cumpre o contrato:',
      codigo: `public [[0]] PedidoResumo(Long id, String status) {}

public class NotificadorSms [[1]] Notificador {
    @Override
    public void enviar(String destino, String mensagem) { }
}`,
      respostas: [['record'], ['implements']],
      dicas: ['Um DTO imutável em uma linha.', 'Classe estende classe; classe ___ interface.'],
      explica: '<code>record</code> gera construtor, acessores e <code>equals</code>. Para cumprir uma interface, a classe declara <code>implements</code>; <code>extends</code> é para herdar de classe (ou de interface para interface).' },
    { tipo: 'escolha',
      pergunta: 'Um objeto tem exatamente o método <code>enviar(String, String)</code>, mas sua classe não declara <code>implements Notificador</code>. Ele pode ser passado onde se espera <code>Notificador</code>?',
      opcoes: [
        'Sim, como no TypeScript: o formato é o mesmo',
        'Não: Java usa tipagem nominal, a classe precisa declarar a interface',
        'Sim, se você anotar a classe com @Override',
      ],
      certa: 1,
      dicas: ['Pense em "estrutural" vs "nominal".', 'No Java, o tipo de um objeto é a classe e o que ela declara implementar.'],
      explica: 'Java é nominal: só é <code>Notificador</code> quem declara <code>implements Notificador</code>. A tipagem estrutural ("se tem o formato, serve") é do TypeScript. <code>@Override</code> só pede ao compilador para conferir que o método sobrescreve algo.' },
    { tipo: 'escolha',
      pergunta: 'O front mandou o status "arquivado" (minúsculo). O que acontece?',
      codigo: `StatusProcesso s = StatusProcesso.valueOf("arquivado");`,
      opcoes: [
        'Devolve StatusProcesso.ARQUIVADO',
        'Devolve null',
        'Lança IllegalArgumentException: No enum constant ...',
      ],
      certa: 2,
      dicas: ['<code>valueOf</code> compara com o nome exato da constante.', 'Ele não devolve null para texto desconhecido.'],
      explica: '<code>valueOf</code> diferencia maiúsculas e lança <code>IllegalArgumentException</code> ("No enum constant StatusProcesso.arquivado"). Ele nunca devolve null. Normalize antes (<code>toUpperCase()</code>) ou trate a exceção; numa API, isso vira um 400.' },
    { tipo: 'montar',
      pergunta: 'Monte a assinatura de um método genérico que devolve o primeiro item de uma lista:',
      certa: ['public', 'static', '<T>', 'T', 'primeiro(List<T> lista)'],
      extras: ['function', 'primeiro<T>(List<T> lista)', ': T'],
      dicas: ['No Java, o parâmetro de tipo vem <b>antes</b> do tipo de retorno.', 'O tipo de retorno fica antes do nome, não depois com dois-pontos.'],
      explica: 'A ordem é modificadores, <code>&lt;T&gt;</code>, retorno, nome. <code>primeiro&lt;T&gt;(...)</code> e <code>: T</code> são sintaxe do TypeScript, e <code>function</code> não existe no Java.' },
    { tipo: 'escolha',
      pergunta: 'Qual linha <b>não</b> compila?',
      opcoes: [
        'List<Integer> prazos = new ArrayList<>();',
        'List<int> prazos = new ArrayList<>();',
        'Map<String, List<Long>> porVara = new HashMap<>();',
      ],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['Generics só trabalham com objetos.', 'Qual tipo da lista é primitivo?'],
      explica: 'Parâmetros de tipo não aceitam primitivos: use o wrapper <code>Integer</code>. O diamante <code>&lt;&gt;</code> e generics aninhados compilam normalmente.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: quando usar <code>record</code> e quando usar uma classe comum num projeto Spring?',
      avalia: 'Se você entende que record é para <b>dados imutáveis</b> (DTO, valor, resposta) e sabe por que entidades JPA ficam como classes.',
      resposta: `<p>Uso record para dados imutáveis sem identidade própria: DTOs de entrada e saída da API, projeções de consulta, objetos de valor e eventos. Ele gera construtor, acessores, equals, hashCode e toString, e o Jackson serializa e desserializa sem configuração. O construtor compacto é um bom lugar para validar ou normalizar.</p>
<p>Uso classe comum para entidades JPA, porque o JPA precisa de construtor sem argumentos, de campos mutáveis e de proxies por herança, e record é final e imutável. Também uso classe para serviços e componentes com dependências. Separar entidade de DTO ainda evita expor a tabela direto na API.</p>`,
      pontos: ['record é imutável e gera equals/hashCode/toString', 'ideal para DTO e projeções', 'entidade JPA precisa de construtor vazio e mutabilidade', 'separar entidade de DTO na API'],
      evitar: ['dizer que record é só para economizar getters', 'usar record como entidade JPA'],
      dicas: ['Pense no que o JPA exige de uma entidade.', 'Pense no que um DTO precisa: dados, sem regra mutável.'] },
  ],
})

// ---- 03-java-colecoes.js
MODULOS.push({
  id: 'java-colecoes',
  titulo: 'Coleções e Streams',
  icone: '🧺',
  aprende: 'List, Set, Map, Streams, Optional e method references',
  porque: 'Toda consulta ao banco e toda resposta de API volta como coleção, e Streams são o jeito idiomático de transformar isso em DTO.',
  gancho: {
    titulo: 'O map que não rodou',
    pergunta: 'O que aparece no console?',
    linguagem: 'java',
    codigo: `List<String> nomes = List.of("Ana", "Bia");
nomes.stream()
     .map(n -> {
         System.out.println(n);
         return n.toUpperCase();
     });
System.out.println("fim");`,
    opcoes: ['Ana, Bia e fim', 'ANA, BIA e fim', 'Só fim', 'Não compila'],
    certa: 2,
    revelacao: 'Stream é <b>preguiçoso</b>: sem uma operação final (<code>toList()</code>, <code>count()</code>...), o <code>map</code> nunca executa. No JS, <code>array.map</code> roda na hora. Nesta lição você vai ver List, Set, Map, Streams e as armadilhas de imutabilidade.',
  },
  videos: [
    { id: 'iovHVVwgfYo', titulo: 'Como Simplificar o Processamento de Dados no Java com Streams!', canal: 'Giuliana Bezerra',
      duracao: '14:57', idioma: 'pt',
      nota: 'Acompanhe o pipeline <code>stream()</code> → <code>filter</code>/<code>map</code> → operação final e note que sem a operação final nada executa.' },
    { id: 'jLropHUgI1A', titulo: 'CURSO de JAVA INTERMEDIÁRIO | Estruturas de dados, Stream API, Generics, Packages, Records', canal: 'Fernanda Kipper',
      duracao: '50:13', idioma: 'pt', inicio: 72,
      nota: 'Abre no trecho de estruturas de dados (cerca de 10 min): veja quando usar <code>ArrayList</code>, <code>HashSet</code> e <code>HashMap</code>, o par interface e implementação da lição.' },
    { id: 'DELCbBuCHHE', titulo: 'Java Method References - A Beginner\'s Guide', canal: 'Dan Vega',
      duracao: '12:59', idioma: 'en',
      nota: 'Mostra quando uma lambda vira <code>Classe::metodo</code>, o atalho que aparece em todo <code>map</code> que converte entidade em DTO.' },
  ],
  resumo: [
    '<code>List.of</code>, <code>Set.of</code> e <code>Map.of</code> criam coleções <b>imutáveis</b> e rejeitam <code>null</code>',
    'Lista mutável: <code>new ArrayList&lt;&gt;(...)</code>. Mapa mutável: <code>new HashMap&lt;&gt;()</code>',
    'Stream: <code>stream()</code> → <code>filter</code>/<code>map</code> → operação final (<code>toList()</code>, <code>collect</code>)',
    'Stream é <b>preguiçoso</b> e de <b>uso único</b>',
    '<code>Collectors.groupingBy</code> agrupa em <code>Map</code>; com <code>counting()</code> conta por chave',
    '<code>Assistido::nome</code> é o mesmo que <code>a -&gt; a.nome()</code>',
  ],
  ensino: [
    { titulo: 'List, Set e Map: interface e implementação',
      texto: `<p>Você declara pela <b>interface</b> (<code>List</code>, <code>Set</code>, <code>Map</code>) e escolhe a implementação: <code>ArrayList</code> para listas, <code>HashSet</code> para conjuntos, <code>HashMap</code> para mapas. <code>HashMap</code> não garante ordem; <code>LinkedHashMap</code> mantém a de inserção e <code>TreeMap</code> ordena pela chave.</p>
<p><code>Set</code> e as chaves de <code>Map</code> usam <code>equals</code> e <code>hashCode</code>. Records já trazem os dois. Numa classe comum sem eles, dois objetos iguais viram duas entradas.</p>
<p>Métodos de <code>Map</code> que evitam <code>if</code>: <code>getOrDefault</code>, <code>computeIfAbsent</code>, <code>merge</code>. <code>get</code> de chave inexistente devolve <code>null</code>, e o NPE costuma aparecer logo depois.</p>
<p><b>No NestJS/TypeScript:</b> <code>List</code> é o array, <code>Map</code> é o <code>Map</code> do JS (ou o objeto literal) e <code>Set</code> é o <code>Set</code>. A diferença: no JS o Set compara objetos por referência; no Java, por <code>equals</code>.</p>`,
      linguagem: 'java',
      codigo: `List<String> varas = new ArrayList<>();
varas.add("1ª Vara Cível");

Map<String, Integer> atendimentosPorComarca = new HashMap<>();
atendimentosPorComarca.merge("Goiânia", 1, Integer::sum);   // soma 1
int anapolis = atendimentosPorComarca.getOrDefault("Anápolis", 0);

Set<String> cpfs = new HashSet<>(List.of("111", "222", "111")); // 2 itens` },
    { titulo: 'List.of é imutável (e não aceita null)',
      texto: `<p><code>List.of(...)</code>, <code>Set.of(...)</code> e <code>Map.of(...)</code> (Java 9+) criam coleções <b>imutáveis</b>. Tentar <code>add</code> ou <code>remove</code> lança <code>UnsupportedOperationException</code>, em tempo de execução, não de compilação. Elas também <b>rejeitam null</b> com <code>NullPointerException</code>, e <code>Set.of</code> com itens repetidos lança <code>IllegalArgumentException</code>.</p>
<p><code>Arrays.asList(...)</code> é diferente: tamanho fixo (sem <code>add</code>), mas aceita <code>set</code> e null. Para uma lista que você vai alterar, copie: <code>new ArrayList&lt;&gt;(List.of(...))</code>.</p>
<p>Outra exceção comum: remover item de uma lista dentro de um for-each dá <code>ConcurrentModificationException</code>. Use <code>lista.removeIf(...)</code>.</p>
<p><b>No NestJS/TypeScript:</b> é como um <code>Object.freeze</code> que lança erro em vez de ignorar em silêncio. <code>readonly string[]</code> do TS só protege em compilação.</p>`,
      linguagem: 'java',
      codigo: `List<String> fixas = List.of("Cível", "Família");
fixas.add("Criminal");      // UnsupportedOperationException

List<String> editavel = new ArrayList<>(fixas);
editavel.add("Criminal");   // ok

editavel.removeIf(area -> area.startsWith("F"));  // remove "Família"` },
    { titulo: 'Streams: o map/filter do Java',
      texto: `<p>Um <b>Stream</b> é um pipeline: começa em <code>colecao.stream()</code>, passa por operações intermediárias (<code>filter</code>, <code>map</code>, <code>sorted</code>, <code>distinct</code>) e termina numa operação final (<code>toList()</code>, <code>collect</code>, <code>count</code>, <code>anyMatch</code>, <code>findFirst</code>).</p>
<p>Duas regras que pegam quem vem do JS. O stream é <b>preguiçoso</b>: nada roda até a operação final. E é de <b>uso único</b>: reusar dá <code>IllegalStateException: stream has already been operated upon or closed</code>.</p>
<p><code>.toList()</code> (Java 16+) devolve lista <b>imutável</b>; <code>.collect(Collectors.toList())</code>, a forma antiga, devolve uma mutável. Para somar, troque para um stream numérico: <code>mapToInt(...).sum()</code>.</p>
<p><b>No NestJS/TypeScript:</b> <code>processos.filter(...).map(...)</code> vira <code>processos.stream().filter(...).map(...).toList()</code>. O <code>reduce</code> existe, mas quase sempre há um coletor pronto.</p>`,
      linguagem: 'java',
      codigo: `List<ProcessoDto> ativos = processos.stream()
    .filter(p -> p.status() == StatusProcesso.EM_ANDAMENTO)
    .sorted(Comparator.comparing(Processo::dataDistribuicao).reversed())
    .map(p -> new ProcessoDto(p.numero(), p.vara()))
    .toList();

boolean temUrgente = processos.stream().anyMatch(Processo::urgente);
int totalDias = prazos.stream().mapToInt(Prazo::dias).sum();` },
    { titulo: 'groupingBy, Optional e method references',
      texto: `<p><code>Collectors.groupingBy(chave)</code> devolve <code>Map&lt;K, List&lt;T&gt;&gt;</code>. Com um segundo coletor você resume cada grupo: <code>counting()</code> (devolve <code>Long</code>), <code>mapping(...)</code>, <code>summingInt(...)</code>. Para virar mapa de chave única, use <code>Collectors.toMap</code>, que lança <code>IllegalStateException</code> se houver chave duplicada.</p>
<p><code>findFirst()</code>, <code>max()</code> e <code>min()</code> devolvem <code>Optional&lt;T&gt;</code>, um "talvez" explícito. Consuma com <code>orElse</code>, <code>orElseThrow</code>, <code>map</code> ou <code>ifPresent</code>. O próximo módulo aprofunda.</p>
<p><b>Method reference</b> é a lambda abreviada: <code>Atendimento::unidade</code> = <code>a -&gt; a.unidade()</code>; <code>System.out::println</code> = <code>x -&gt; System.out.println(x)</code>; <code>AssistidoDto::new</code> chama o construtor.</p>
<p><b>No NestJS/TypeScript:</b> o <code>groupingBy</code> é o <code>Object.groupBy</code> (ou o <code>groupBy</code> do lodash). O <code>Optional</code> substitui o <code>T | undefined</code> com <code>?.</code> e <code>??</code>.</p>`,
      linguagem: 'java',
      codigo: `Map<String, List<Atendimento>> porUnidade = atendimentos.stream()
    .collect(Collectors.groupingBy(Atendimento::unidade));

Map<String, Long> totalPorUnidade = atendimentos.stream()
    .collect(Collectors.groupingBy(Atendimento::unidade, Collectors.counting()));

Optional<Atendimento> proximo = atendimentos.stream()
    .filter(a -> a.data().isAfter(LocalDate.now()))
    .findFirst();
String quando = proximo.map(a -> a.data().toString()).orElse("sem agenda");` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'O que acontece ao executar este código?',
      codigo: `List<String> areas = List.of("Cível", "Família");
areas.add("Criminal");`,
      opcoes: ['Adiciona "Criminal"', 'Lança UnsupportedOperationException', 'Não compila', 'Ignora a chamada em silêncio'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['<code>List.of</code> cria uma lista imutável.', 'O tipo declarado é <code>List</code>, que tem <code>add</code>: o compilador não reclama.'],
      explica: 'Compila, porque <code>List</code> declara <code>add</code>, mas a implementação imutável lança <code>UnsupportedOperationException</code>. Não há falha silenciosa como no <code>Object.freeze</code> fora do strict mode. Para alterar, use <code>new ArrayList&lt;&gt;(List.of(...))</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete para pegar os nomes dos assistidos com renda até 3 salários:',
      codigo: `List<String> nomes = assistidos.[[0]]()
    .[[1]](a -> a.rendaEmSalarios() <= 3)
    .[[2]](Assistido::nome)
    .toList();`,
      respostas: [['stream'], ['filter'], ['map']],
      dicas: ['Coleção não tem <code>filter</code> direto: primeiro abra o pipeline.', 'Primeiro escolha os itens, depois transforme cada um.'],
      explica: 'O pipeline começa com <code>stream()</code>, <code>filter</code> mantém quem passa no predicado e <code>map</code> transforma cada item. Diferente do JS, <code>List</code> não tem <code>filter</code>/<code>map</code>; eles são do <code>Stream</code>.' },
    { tipo: 'escolha',
      pergunta: 'Qual o tipo de <code>porVara</code>?',
      codigo: `var porVara = processos.stream()
    .collect(Collectors.groupingBy(Processo::vara, Collectors.counting()));`,
      opcoes: ['Map<String, Integer>', 'Map<String, Long>', 'Map<String, List<Processo>>', 'List<Long>'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['O segundo argumento resume cada grupo.', '<code>counting()</code> conta com o maior tipo inteiro.'],
      explica: '<code>counting()</code> produz <code>Long</code>, então o resultado é <code>Map&lt;String, Long&gt;</code> (supondo <code>vara()</code> String). Sem o segundo coletor seria <code>Map&lt;String, List&lt;Processo&gt;&gt;</code>. <code>Integer</code> é o erro comum na hora de declarar o tipo.' },
    { tipo: 'escolha',
      pergunta: 'O que acontece na segunda linha?',
      codigo: `Stream<Pedido> pendentes = pedidos.stream().filter(Pedido::pendente);
long total = pendentes.count();
List<Pedido> lista = pendentes.toList();`,
      opcoes: [
        'Funciona: o stream pode ser lido duas vezes',
        'A terceira linha lança IllegalStateException: o stream já foi consumido',
        'Não compila: Stream não pode ir para variável',
      ],
      certa: 1,
      dicas: ['Stream não é coleção: é um pipeline.', '<code>count()</code> é uma operação final.'],
      explica: 'Um stream só aceita uma operação final. Depois do <code>count()</code>, o <code>toList()</code> lança <code>IllegalStateException: stream has already been operated upon or closed</code>. Guarde a lista e derive o resto dela, ou crie outro stream.' },
    { tipo: 'escolha',
      pergunta: 'Qual a diferença entre <code>.toList()</code> e <code>.collect(Collectors.toList())</code>?',
      opcoes: [
        'Nenhuma, são sinônimos',
        '<code>.toList()</code> devolve lista imutável; o coletor antigo devolve uma mutável na prática',
        '<code>.toList()</code> só existe para listas de String',
      ],
      certa: 1,
      dicas: ['<code>Stream.toList()</code> chegou no Java 16.', 'Tente dar <code>add</code> no resultado de cada um.'],
      explica: '<code>Stream.toList()</code> devolve uma lista não modificável. <code>Collectors.toList()</code> não garante o tipo, mas devolve um <code>ArrayList</code> na prática. Trocar um pelo outro pode quebrar código que fazia <code>add</code> depois.' },
    { tipo: 'montar',
      pergunta: 'Monte a expressão que transforma entidades em DTOs usando o construtor do record:',
      certa: ['assistidos.stream()', '.map(AssistidoDto::new)', '.toList()'],
      extras: ['.map(new AssistidoDto)', '.forEach(AssistidoDto::new)', '.collect()'],
      dicas: ['Para referenciar um construtor, use <code>::new</code>.', '<code>forEach</code> não devolve nada; você precisa transformar e juntar.'],
      explica: '<code>AssistidoDto::new</code> é a referência ao construtor (funciona se existir um construtor que recebe <code>Assistido</code>). <code>forEach</code> é operação final sem retorno, e <code>collect()</code> sem coletor não compila.' },
    { tipo: 'completar',
      pergunta: 'Complete para contar atendimentos por defensor sem <code>if</code>:',
      codigo: `Map<String, Integer> contagem = new HashMap<>();
for (Atendimento a : atendimentos) {
    contagem.[[0]](a.defensor(), 1, Integer::sum);
}`,
      respostas: [['merge']],
      dicas: ['Um método de <code>Map</code> que insere se não existe e combina se existe.', 'Recebe chave, valor e a função que junta o valor antigo com o novo.'],
      explica: '<code>merge(chave, 1, Integer::sum)</code> grava 1 na primeira vez e soma nas seguintes. Com <code>get</code> + <code>put</code> você precisaria tratar o <code>null</code> da primeira ocorrência. Com stream, o equivalente é <code>groupingBy(..., counting())</code>.' },
    { tipo: 'escolha',
      pergunta: 'Você guarda objetos de uma classe <code>Processo</code> (classe comum, sem <code>equals</code>/<code>hashCode</code>) num <code>HashSet</code>. Dois objetos com o mesmo número são adicionados. Quantos itens o Set tem?',
      opcoes: ['1, porque o número é igual', '2, porque sem equals/hashCode a comparação é por referência', 'Lança exceção de item duplicado'],
      certa: 1,
      dicas: ['De onde o HashSet tira a noção de "igual"?', 'O <code>equals</code> herdado de <code>Object</code> compara referência.'],
      explica: 'Sem sobrescrever <code>equals</code> e <code>hashCode</code>, vale a identidade de <code>Object</code>: dois objetos, dois itens. Um <code>record</code> resolveria, porque gera os dois métodos. Exceção de duplicado só existe em <code>Set.of</code>.' },
  ],
})

// ---- 04-java-erros.js
MODULOS.push({
  id: 'java-erros',
  titulo: 'Exceções e Optional',
  icone: '🧯',
  aprende: 'checked vs unchecked, try-with-resources, exceção de domínio e Optional',
  porque: 'Tratamento de erro bem feito é o que separa uma API que devolve 404 claro de uma que devolve 500 com stack trace.',
  gancho: {
    titulo: 'Um compila, outro não',
    pergunta: 'Qual destes métodos compila?',
    linguagem: 'java',
    codigo: `void validarPrazo() {
    throw new IllegalStateException("prazo vencido");
}

void lerPeticao() {
    throw new IOException("arquivo ilegível");
}`,
    opcoes: ['Os dois', 'Só validarPrazo', 'Só lerPeticao', 'Nenhum'],
    certa: 1,
    revelacao: '<code>IOException</code> é <b>checked</b>: o compilador exige <code>try/catch</code> ou <code>throws IOException</code> na assinatura. <code>IllegalStateException</code> é unchecked e passa livre. Nesta lição você vai ver essa divisão, como criar exceção de domínio e onde o <code>Optional</code> entra.',
  },
  videos: [
    { id: 'vYbwbyg-B8A', titulo: 'Exceções, try, catch com Java', canal: 'DevSuperior',
      duracao: '8:39', idioma: 'pt',
      nota: 'O Nelio mostra a hierarquia de exceções e o fluxo do <code>try/catch</code>; observe onde a exceção é capturada e onde só é propagada.' },
    { id: 'bCPClyGsVhc', titulo: 'Checked vs. Unchecked Exceptions in Java Tutorial - What\'s The Difference?', canal: 'Coding with John',
      duracao: '10:14', idioma: 'en',
      nota: 'Exatamente o gancho do módulo: por que o compilador obriga a tratar <code>IOException</code> e deixa passar <code>RuntimeException</code>.' },
    { id: 'vKVzRbsMnTQ', titulo: 'Optionals In Java - Simple Tutorial', canal: 'Coding with John',
      duracao: '15:53', idioma: 'en',
      nota: 'Foque em <code>orElse</code>, <code>orElseThrow</code> e <code>map</code>, e no aviso de usar <code>Optional</code> só como retorno, como na última lição.' },
  ],
  resumo: [
    '<b>Checked</b> (filhas de <code>Exception</code>) o compilador obriga a tratar ou declarar; <b>unchecked</b> (filhas de <code>RuntimeException</code>) não',
    '<code>finally</code> sempre roda; <b>try-with-resources</b> fecha o recurso sozinho',
    'Exceção de domínio: <code>extends RuntimeException</code>, mensagem clara, e repasse a <b>causa</b>',
    'Leia a mensagem do NPE: ela diz qual expressão era null',
    '<code>Optional</code> é para <b>retorno</b>; não use em campo nem parâmetro, e evite <code>get()</code>',
  ],
  ensino: [
    { titulo: 'Checked vs unchecked',
      texto: `<p>Toda exceção é um <code>Throwable</code>. <b>Checked</b> são as filhas de <code>Exception</code> que não passam por <code>RuntimeException</code> (ex.: <code>IOException</code>): o compilador <b>obriga</b> você a capturar ou declarar <code>throws</code> na assinatura. <b>Unchecked</b> são as filhas de <code>RuntimeException</code> (<code>IllegalArgumentException</code>, <code>IllegalStateException</code>, <code>NullPointerException</code>): ninguém obriga. <code>Error</code> (ex.: <code>OutOfMemoryError</code>) é problema da JVM e não se trata.</p>
<p>O código moderno, Spring incluído, prefere <b>unchecked</b>. Checked "contamina" cada assinatura no caminho e não combina com lambdas de Stream.</p>
<p>Detalhe que cai em entrevista: o <code>@Transactional</code> do Spring faz <b>rollback por padrão só em unchecked</b> (<code>RuntimeException</code> e <code>Error</code>). Uma checked lançada de dentro dele faz commit, a não ser que você configure <code>rollbackFor</code>.</p>
<p><b>No NestJS/TypeScript:</b> no TS toda exceção é "unchecked": nada na assinatura avisa que uma função lança. A checked do Java é essa informação virando regra de compilação.</p>`,
      linguagem: 'java',
      codigo: `// checked: não compila sem try/catch ou throws
public String lerModelo(Path caminho) throws IOException {
    return Files.readString(caminho);
}

// unchecked: lança sem declarar
public void validarCpf(String cpf) {
    if (cpf == null || cpf.length() != 11) {
        throw new IllegalArgumentException("CPF inválido: " + cpf);
    }
}` },
    { titulo: 'try/catch/finally e try-with-resources',
      texto: `<p><code>catch</code> pode pegar mais de um tipo com <code>|</code>. A ordem importa: o mais específico vem primeiro, senão o código nem compila. <code>finally</code> roda sempre, com ou sem exceção, até depois de um <code>return</code>.</p>
<p>Para recursos que precisam ser fechados (arquivo, conexão, stream de I/O), use <b>try-with-resources</b>: declare o recurso nos parênteses do <code>try</code> e ele é fechado automaticamente, em ordem inversa, mesmo se der erro. Funciona com qualquer <code>AutoCloseable</code>.</p>
<p><b>Erro comum:</b> engolir a exceção (<code>catch (Exception e) {}</code>) ou relançar sem a causa (<code>throw new X("falhou")</code>). Isso apaga o stack trace original. Passe <code>e</code> como causa.</p>
<p><b>No NestJS/TypeScript:</b> o try-with-resources lembra o <code>using</code> do TS 5.2. Antes dele, você fazia <code>finally { conexao.release() }</code> na mão.</p>`,
      linguagem: 'java',
      codigo: `try (BufferedReader leitor = Files.newBufferedReader(caminho)) {
    return leitor.readLine();
} catch (NoSuchFileException e) {          // mais específica primeiro
    throw new ModeloNaoEncontradoException(caminho.toString(), e);
} catch (IOException e) {
    throw new UncheckedIOException("Falha ao ler " + caminho, e);
}
// leitor.close() já foi chamado aqui, com ou sem erro` },
    { titulo: 'Exceção de domínio',
      texto: `<p>Crie exceções com nome de regra de negócio: <code>AssistidoNaoEncontradoException</code>, <code>PrazoExpiradoException</code>. Estenda <code>RuntimeException</code>, receba os dados que importam no construtor e monte a mensagem ali.</p>
<p>A vantagem aparece no Spring: um <code>@RestControllerAdvice</code> traduz cada exceção de domínio para um status HTTP (404, 409, 422) num lugar só, e o serviço fica livre de detalhes HTTP.</p>
<p>Sempre ofereça um construtor que recebe a <b>causa</b> (<code>Throwable</code>) quando a exceção embrulha outra.</p>
<p><b>No NestJS/TypeScript:</b> é o seu <code>class AssistidoNaoEncontradoError extends Error</code>, ou o <code>NotFoundException</code> do Nest. A diferença de estilo: no Spring o serviço não costuma lançar exceção HTTP. Ele lança a de domínio, e o advice traduz.</p>`,
      linguagem: 'java',
      codigo: `public class AssistidoNaoEncontradoException extends RuntimeException {
    public AssistidoNaoEncontradoException(Long id) {
        super("Assistido " + id + " não encontrado");
    }
}

public Assistido buscar(Long id) {
    return repositorio.findById(id)
        .orElseThrow(() -> new AssistidoNaoEncontradoException(id));
}` },
    { titulo: 'NullPointerException: leia a mensagem',
      texto: `<p>NPE acontece quando você chama método, lê campo ou desembrulha um wrapper em algo <code>null</code>. Desde o Java 14 (padrão no 15+), a mensagem diz <b>exatamente</b> o que era null: <code>Cannot invoke "String.trim()" because the return value of "Assistido.nome()" is null</code>.</p>
<p>Defesas, da melhor para a pior: não deixar null entrar (validação na borda, construtor compacto do record); <code>Objects.requireNonNull(x, "x é obrigatório")</code> para falhar cedo com mensagem clara; <code>Optional</code> no retorno de busca; e, por último, <code>if (x != null)</code> espalhado.</p>
<p><b>No NestJS/TypeScript:</b> é o <code>TypeError: Cannot read properties of undefined</code>. O Java não tem <code>?.</code> nem <code>??</code>, e o compilador não acompanha nulidade como o <code>strictNullChecks</code>. Por isso o hábito de nunca devolver null de busca importa mais aqui.</p>`,
      linguagem: 'java',
      codigo: `public Atendimento(Assistido assistido, LocalDate data) {
    this.assistido = Objects.requireNonNull(assistido, "assistido é obrigatório");
    this.data = Objects.requireNonNull(data, "data é obrigatória");
}

// Em vez de
// Exception: Cannot invoke "Assistido.nome()" because "this.assistido" is null
// você recebe na hora: NullPointerException: assistido é obrigatório` },
    { titulo: 'Optional bem usado (e mal usado)',
      texto: `<p><code>Optional&lt;T&gt;</code> foi feito para <b>retorno</b> de método que pode não ter resultado. É o que o <code>findById</code> do Spring Data devolve. Consuma com <code>orElseThrow(...)</code>, <code>map(...)</code>, <code>orElse(...)</code> ou <code>ifPresent(...)</code>.</p>
<p><b>Mal usado:</b> <code>opt.get()</code> sem checar (lança <code>NoSuchElementException: No value present</code>); <code>if (opt.isPresent()) opt.get()</code>, que é só um <code>if null</code> mais longo; <code>Optional</code> como campo de entidade ou parâmetro; devolver <code>null</code> num método que devolve <code>Optional</code>; <code>Optional.of(x)</code> com <code>x</code> possivelmente null (use <code>ofNullable</code>).</p>
<p>Sutileza: <code>orElse(criar())</code> executa <code>criar()</code> <b>sempre</b>, mesmo com valor presente. Se o padrão é caro ou tem efeito colateral, use <code>orElseGet(() -&gt; criar())</code>.</p>
<p><b>No NestJS/TypeScript:</b> equivale a <code>findOne</code> devolver <code>Usuario | null</code> e você usar <code>?.</code> e <code>??</code>. O <code>map</code> do Optional é o <code>?.</code>; o <code>orElse</code> é o <code>??</code>.</p>`,
      linguagem: 'java',
      codigo: `// bom
String comarca = repositorio.findById(id)
    .map(Assistido::comarca)
    .orElse("não informada");

// ruim
Optional<Assistido> opt = repositorio.findById(id);
if (opt.isPresent()) {
    return opt.get().comarca();
}
return null;` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Qual destas é uma exceção <b>checked</b>?',
      opcoes: ['IllegalArgumentException', 'NullPointerException', 'IOException', 'IllegalStateException'],
      opcoesCodigo: true,
      certa: 2,
      dicas: ['Checked é filha de <code>Exception</code> sem passar por <code>RuntimeException</code>.', 'Qual delas aparece em operações de arquivo e rede?'],
      explica: '<code>IOException</code> estende <code>Exception</code> diretamente, então o compilador obriga a tratar ou declarar. As outras três estendem <code>RuntimeException</code> e são unchecked.' },
    { tipo: 'escolha',
      pergunta: 'Um método <code>@Transactional</code> salva o atendimento e depois lança uma exceção <b>checked</b> própria (<code>extends Exception</code>). Sem configuração extra, o que acontece com o insert?',
      opcoes: [
        'Rollback: qualquer exceção desfaz a transação',
        'Commit: por padrão o rollback só acontece em RuntimeException e Error',
        'A aplicação não sobe: Spring não aceita checked em @Transactional',
      ],
      certa: 1,
      dicas: ['O Spring diferencia os dois tipos de exceção na transação.', 'Existe o atributo <code>rollbackFor</code> justamente por causa disso.'],
      explica: 'A regra padrão faz rollback só para unchecked (<code>RuntimeException</code>) e <code>Error</code>. Checked faz commit, a não ser com <code>@Transactional(rollbackFor = Exception.class)</code>. É um dos motivos para exceções de domínio estenderem <code>RuntimeException</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete a exceção de domínio para ser unchecked e guardar a mensagem:',
      codigo: `public class PrazoExpiradoException extends [[0]] {
    public PrazoExpiradoException(String processo) {
        [[1]]("Prazo expirado no processo " + processo);
    }
}`,
      respostas: [['RuntimeException'], ['super']],
      dicas: ['Unchecked = filha de qual classe?', 'A mensagem vai para o construtor da classe mãe.'],
      explica: 'Estender <code>RuntimeException</code> deixa a exceção unchecked. <code>super(mensagem)</code> repassa a mensagem, que depois aparece em <code>getMessage()</code> e no log.' },
    { tipo: 'completar',
      pergunta: 'Complete para que o arquivo seja fechado automaticamente, mesmo com erro:',
      codigo: `[[0]] (BufferedReader leitor = Files.newBufferedReader(caminho)) {
    return leitor.readLine();
}`,
      respostas: [['try']],
      dicas: ['O recurso é declarado entre parênteses logo após uma palavra-chave.', 'É a mesma palavra do bloco de tratamento de erro.'],
      explica: 'Try-with-resources: <code>try (recurso) { ... }</code> chama <code>close()</code> ao sair do bloco, inclusive em exceção. O recurso precisa implementar <code>AutoCloseable</code>. Como <code>IOException</code> é checked, o método ainda precisa de <code>throws IOException</code> ou de um <code>catch</code>.' },
    { tipo: 'escolha',
      pergunta: 'O que há de errado neste tratamento?',
      codigo: `try {
    integracaoTjgo.consultar(numero);
} catch (Exception e) {
    throw new IntegracaoException("Falha ao consultar processo");
}`,
      opcoes: [
        'Nada, está correto',
        'A causa <code>e</code> não foi repassada: o stack trace original se perde',
        'Não compila: não se pode lançar dentro de catch',
      ],
      certa: 1,
      dicas: ['Quando o erro chegar ao log, o que vai aparecer como origem?', 'Construtores de exceção costumam aceitar um segundo argumento.'],
      explica: 'Sem passar <code>e</code> (<code>new IntegracaoException("...", e)</code>), o log mostra só a nova exceção, e você perde o motivo real (timeout? 500 do tribunal?). Lançar dentro do <code>catch</code> é normal e compila.' },
    { tipo: 'escolha',
      pergunta: 'O log mostra a mensagem abaixo. O que era null?',
      codigo: `java.lang.NullPointerException: Cannot invoke "String.length()"
because the return value of "AssistidoDto.cpf()" is null`,
      opcoes: ['O objeto dto', 'O retorno de dto.cpf()', 'O método length()'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['A mensagem diz "because ... is null".', 'O que foi chamado foi <code>length()</code>, em cima de quê?'],
      explica: 'As mensagens detalhadas de NPE (Java 14+) dizem qual expressão era null: aqui, o retorno de <code>cpf()</code>. O <code>dto</code> existia, porque <code>cpf()</code> foi chamado com sucesso. Se fosse o dto, a mensagem citaria <code>Cannot invoke "AssistidoDto.cpf()"</code>.' },
    { tipo: 'escolha',
      pergunta: 'Qual é o uso <b>mais idiomático</b> de <code>Optional</code> num serviço?',
      opcoes: [
        'return repo.findById(id).orElseThrow(() -> new AssistidoNaoEncontradoException(id));',
        'return repo.findById(id).get();',
        'var o = repo.findById(id); if (o.isPresent()) return o.get(); return null;',
        'public void atualizar(Optional<String> nome) { ... }',
      ],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['Uma opção lança <code>NoSuchElementException</code> genérica; outra devolve null.', 'Optional serve para retorno, não para parâmetro.'],
      explica: '<code>orElseThrow</code> com exceção de domínio dá um erro claro, que vira 404 no advice. <code>get()</code> lança "No value present" sem contexto; <code>isPresent</code> + <code>get</code> + <code>return null</code> traz o null de volta; e <code>Optional</code> como parâmetro é um uso desaconselhado pelos próprios autores da API.' },
    { tipo: 'escolha',
      pergunta: 'Qual a diferença de comportamento entre as duas linhas quando o usuário <b>existe</b>?',
      codigo: `repo.findByEmail(email).orElse(criarUsuarioPadrao());
repo.findByEmail(email).orElseGet(() -> criarUsuarioPadrao());`,
      opcoes: [
        'Nenhuma',
        'Na primeira, criarUsuarioPadrao() roda mesmo assim; na segunda, só se estiver vazio',
        'A primeira não compila',
      ],
      certa: 1,
      dicas: ['Em Java, os argumentos são avaliados antes da chamada.', 'A segunda recebe uma função, não um valor.'],
      explica: 'O argumento de <code>orElse</code> é avaliado antes da chamada, então <code>criarUsuarioPadrao()</code> roda sempre. Se ele grava no banco, você cria lixo. <code>orElseGet</code> recebe um <code>Supplier</code> e só o executa quando o Optional está vazio.' },
  ],
})

// ---- 05-spring-projeto.js
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

// ---- 06-spring-di.js
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
    { id: 'CSsB53HCC3A', titulo: 'Aulão: Injeção de dependências - Do Java ao Spring!', canal: 'Giuliana Bezerra',
      duracao: '19:49', idioma: 'pt',
      nota: 'Do <code>new</code> manual até o container do Spring: repare como o construtor vira o ponto de injeção, a resposta certa da entrevista.' },
    { id: 'CWEQ-1vff1o', titulo: 'Spring Beans Showdown: Unraveling the Mystery of @Component vs @Bean!', canal: 'Dan Vega',
      duracao: '18:18', idioma: 'en',
      nota: 'Mostra quando o bean vem do scan (<code>@Component</code> e família) e quando vem de um método <code>@Bean</code>, como para classes de bibliotecas.' },
    { id: 'VoK6-OiSPu4', titulo: 'Spring @Configuration Annotation - What are Proxy Bean Methods?', canal: 'Dan Vega',
      duracao: '10:22', idioma: 'en',
      nota: 'Explica por que chamar um método <code>@Bean</code> dentro de <code>@Configuration</code> devolve o mesmo singleton, ligado à lição de escopo.' },
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

// ---- 07-spring-rest.js
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
  videos: [
    { id: 'wlYvA2b1BWI', titulo: 'Spring Boot 3 | Curso Completo 2023', canal: 'Michelli Brito',
      duracao: '1:49:11', idioma: 'pt', inicio: 3152,
      nota: 'Abre na criação do controller: acompanhe o DTO de entrada como <code>record</code>, o POST e os GETs, e compare o status que ela devolve com o que você viu no módulo.' },
    { id: 'YY_hf0FOIcU', titulo: 'CURSO DE SPRING para INICIANTES | Tutorial Completo de Java Spring', canal: 'Fernanda Kipper',
      duracao: '51:25', idioma: 'pt', inicio: 2531,
      nota: 'Abre no mapeamento de requisições: a diferença prática entre <code>@PathVariable</code>, <code>@RequestParam</code> e <code>@RequestBody</code>.' },
    { id: 'B5Zrn1Tzyqw', titulo: 'Spring ResponseEntity -  How to customize the response in Spring Boot', canal: 'Dan Vega',
      duracao: '11:25', idioma: 'en',
      nota: 'Foque em como escolher status e cabeçalhos com <code>ResponseEntity</code>, o que separa o 200 padrão do 201 e do 404 corretos.' },
  ],
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

// ---- 08-spring-validacao.js
MODULOS.push({
  id: 'spring-validacao',
  titulo: 'Validação e erros',
  icone: '🛡️',
  aprende: 'Bean Validation, @Valid, @RestControllerAdvice e ProblemDetail',
  porque: 'Uma API pública vive de rejeitar entrada ruim com uma resposta clara e sempre no mesmo formato.',
  gancho: {
    titulo: 'O @NotBlank que não barrou',
    pergunta: 'O starter de validação está no pom. O cliente manda <code>POST /assistidos</code> com corpo <code>{}</code>. O que acontece?',
    linguagem: 'java',
    codigo: `public record NovoAssistido(@NotBlank String nome) {}

@PostMapping("/assistidos")
public AssistidoResponse criar(@RequestBody NovoAssistido req) {
    return service.criar(req);
}`,
    opcoes: ['400 Bad Request', 'Chega ao service com nome null', '422 Unprocessable Entity', 'Não compila'],
    certa: 1,
    revelacao: 'Sem <code>@Valid</code> no parâmetro, as anotações do DTO são só metadado: ninguém valida, e o erro aparece lá no banco como <i>not-null constraint</i>. Nesta lição você vai ver como ligar a validação e devolver erros num formato único com <code>ProblemDetail</code>.',
  },
  videos: [
    { id: 'GmbK-O3v3Gg', titulo: 'COMO TRATAR EXCEÇÕES NO JAVA SPRING', canal: 'Fernanda Kipper',
      duracao: '18:32', idioma: 'pt',
      nota: 'Veja o handler global com <code>@ControllerAdvice</code> e <code>@ExceptionHandler</code> tirando o try/catch do controller, igual ao advice desta lição.' },
    { id: 'xGrnt_MjwFo', titulo: 'Novidades do Spring 6: Problem Details', canal: 'Giuliana Bezerra',
      duracao: '10:58', idioma: 'pt',
      nota: 'Repare nos campos <code>type</code>, <code>title</code>, <code>status</code> e <code>detail</code> do <code>ProblemDetail</code>: é o formato único de erro que a lição adota.' },
    { id: 'cP2x9zD9wDc', titulo: 'COMO VALIDAR SUA API REST COM JAVA E SPRING BOOT VALIDATION | PARTE 1', canal: 'Expertos Tech',
      duracao: '9:41', idioma: 'pt',
      nota: 'Foque em como <code>@Valid</code> no <code>@RequestBody</code> dispara as anotações do DTO; no Boot 3 o import é <code>jakarta.validation</code>, não <code>javax</code>.' },
  ],
  resumo: [
    'Anotações como <code>@NotBlank</code>, <code>@Size</code> e <code>@Email</code> vêm do <b>Bean Validation</b> (<code>jakarta.validation</code>) e exigem o <code>spring-boot-starter-validation</code>',
    'Sem <code>@Valid</code> no parâmetro <code>@RequestBody</code>, as anotações do DTO são <b>ignoradas</b>',
    'Corpo inválido lança <code>MethodArgumentNotValidException</code>, que vira <b>400</b>',
    '<code>@RestControllerAdvice</code> + <code>@ExceptionHandler</code> centralizam o tratamento de erros, como um exception filter global do NestJS',
    '<code>ProblemDetail</code> é o formato padrão de erro (RFC 9457): <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>',
    'Exceções de domínio (<code>AssistidoNaoEncontradoException</code>) viram 404 ou 409 no advice, não no controller',
  ],
  ensino: [
    { titulo: 'Bean Validation: regras no DTO',
      texto: `<p>O Spring não valida nada sozinho: quem valida é o <b>Bean Validation</b> (especificação <code>jakarta.validation</code>, implementada pelo Hibernate Validator). Ele entra no projeto com o <code>spring-boot-starter-validation</code>. Sem esse starter, as anotações compilam (se a API estiver no classpath) mas ninguém as executa.</p>
<p>As regras ficam no DTO de entrada, e funcionam direto nos componentes de um <b>record</b>. Escolha a anotação certa: <code>@NotBlank</code> para String (rejeita <code>null</code>, <code>""</code> e <code>"   "</code>), <code>@NotNull</code> para objetos e números, <code>@NotEmpty</code> para coleções.</p>
<p><b>Pegadinha:</b> <code>@Size</code>, <code>@Email</code> e quase todas as outras <b>aceitam null</b>. Se o campo é obrigatório, combine com <code>@NotBlank</code>/<code>@NotNull</code>.</p>
<p><b>No NestJS:</b> é o <code>class-validator</code> (<code>@IsNotEmpty()</code>, <code>@IsEmail()</code>, <code>@Length()</code>) no DTO. A diferença é que lá o DTO é classe; aqui um record imutável resolve.</p>`,
      linguagem: 'java',
      codigo: `import jakarta.validation.constraints.*;

public record NovoAssistidoRequest(
    @NotBlank @Size(max = 150) String nome,
    @NotBlank @Pattern(regexp = "\\\\d{11}", message = "CPF deve ter 11 dígitos") String cpf,
    @Email String email,              // opcional, mas se vier tem de ser válido
    @NotNull @Past LocalDate nascimento
) {}` },
    { titulo: '@Valid liga a validação',
      texto: `<p>Anotar o DTO não basta: o controller precisa pedir a validação com <code>@Valid</code> (ou <code>@Validated</code>) no parâmetro <code>@RequestBody</code>. Esquecer o <code>@Valid</code> é o bug mais comum: tudo compila, o JSON vazio passa e o erro só aparece no banco como <code>not-null constraint</code>.</p>
<p>Se o corpo for inválido, o Spring nem chama o método: lança <code>MethodArgumentNotValidException</code> e responde <b>400 Bad Request</b>.</p>
<p>Objeto aninhado também precisa de <code>@Valid</code> no campo (ex.: <code>@Valid EnderecoRequest endereco</code>), senão as regras de dentro dele não rodam (a validação não é em cascata por padrão).</p>
<p><b>No NestJS:</b> é o equivalente ao <code>ValidationPipe</code>. Lá você costuma ligá-lo global com <code>app.useGlobalPipes()</code>; aqui o gatilho é por parâmetro, com <code>@Valid</code>.</p>`,
      linguagem: 'java',
      codigo: `@RestController
@RequestMapping("/assistidos")
class AssistidoController {
    private final AssistidoService service;
    AssistidoController(AssistidoService service) { this.service = service; }

    @PostMapping
    ResponseEntity<AssistidoResponse> criar(@Valid @RequestBody NovoAssistidoRequest req) {
        AssistidoResponse criado = service.criar(req);
        return ResponseEntity.created(URI.create("/assistidos/" + criado.id())).body(criado);
    }
}` },
    { titulo: 'ProblemDetail: o formato padrão de erro',
      texto: `<p>A RFC 9457 (que substituiu a 7807) define um JSON de erro com <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code> e <code>instance</code>, servido como <code>application/problem+json</code>. O Spring 6 tem a classe <code>ProblemDetail</code> para isso, e você pode acrescentar campos com <code>setProperty</code>.</p>
<p>Com <code>spring.mvc.problemdetails.enabled=true</code>, os erros que o próprio Spring MVC gera (400 de validação, 404 de rota, 405) já saem nesse formato.</p>
<p><b>Por que importa:</b> o front e os outros sistemas tratam todos os erros com um único parser. Em entrevista, saber o nome "RFC 9457 / Problem Details" mostra maturidade de API.</p>
<p><b>No NestJS:</b> o padrão é <code>{ statusCode, message, error }</code>. Não existe formato RFC pronto; você teria de escrever um filter.</p>`,
      linguagem: 'json',
      codigo: `{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Dados inválidos",
  "instance": "/assistidos",
  "campos": { "cpf": "CPF deve ter 11 dígitos", "nome": "não deve estar em branco" }
}` },
    { titulo: '@RestControllerAdvice: um lugar para todos os erros',
      texto: `<p><code>@RestControllerAdvice</code> marca uma classe cujos métodos <code>@ExceptionHandler</code> valem para <b>todos</b> os controllers. Cada método diz qual exceção trata e devolve a resposta (pode devolver <code>ProblemDetail</code> direto).</p>
<p>Para erros de validação, percorra <code>ex.getBindingResult().getFieldErrors()</code>: cada <code>FieldError</code> tem <code>getField()</code> e <code>getDefaultMessage()</code>.</p>
<p><b>Dica:</b> estender <code>ResponseEntityExceptionHandler</code> dá handlers prontos para as exceções do MVC. Nesse caso você <b>sobrescreve</b> <code>handleMethodArgumentNotValid</code>; declarar um <code>@ExceptionHandler(MethodArgumentNotValidException.class)</code> na mesma classe dá erro de "Ambiguous @ExceptionHandler" na subida.</p>
<p><b>No NestJS:</b> é um exception filter global (<code>@Catch()</code> + <code>app.useGlobalFilters()</code>).</p>`,
      linguagem: 'java',
      codigo: `@RestControllerAdvice
class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail validacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(e -> campos.put(e.getField(), e.getDefaultMessage()));
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Dados inválidos");
        pd.setProperty("campos", campos);
        return pd;
    }
}` },
    { titulo: 'Exceções de domínio viram 404 e 409',
      texto: `<p>O service não conhece HTTP: ele lança exceções do domínio, como <code>AssistidoNaoEncontradoException</code> ou <code>CpfJaCadastradoException</code> (estendendo <code>RuntimeException</code>). O advice traduz cada uma para o status certo: <b>404</b> para recurso inexistente, <b>409 Conflict</b> para regra de unicidade ou estado inválido, <b>422</b> se o time preferir para regra de negócio.</p>
<p>Assim o controller fica sem <code>try/catch</code> e o mesmo service pode ser usado por um job ou fila sem carregar <code>HttpStatus</code>.</p>
<p>Alternativa rápida: <code>throw new ResponseStatusException(HttpStatus.NOT_FOUND, "...")</code>. Funciona, mas acopla a camada de serviço ao HTTP.</p>
<p><b>No NestJS:</b> é o <code>throw new NotFoundException()</code>, que já é uma exceção HTTP. Em Spring o padrão mais limpo é separar domínio de transporte.</p>`,
      linguagem: 'java',
      codigo: `public class AssistidoNaoEncontradoException extends RuntimeException {
    public AssistidoNaoEncontradoException(Long id) { super("Assistido " + id + " não encontrado"); }
}

// dentro do @RestControllerAdvice
@ExceptionHandler(AssistidoNaoEncontradoException.class)
ProblemDetail naoEncontrado(AssistidoNaoEncontradoException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
}

@ExceptionHandler(CpfJaCadastradoException.class)
ProblemDetail conflito(CpfJaCadastradoException ex) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    pd.setTitle("CPF já cadastrado");
    return pd;
}` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'O DTO tem <code>@NotBlank String nome</code>, mas um POST com <code>{}</code> chega ao service com <code>nome</code> nulo. Qual a causa mais provável?',
      codigo: `@PostMapping
AssistidoResponse criar(@RequestBody NovoAssistidoRequest req) { ... }`,
      opcoes: ['Falta @Valid no parâmetro', 'Records não suportam Bean Validation', '@NotBlank só funciona em campos private', 'Falta @ResponseStatus no método'],
      certa: 0,
      dicas: ['As anotações do DTO só descrevem as regras. Quem dispara a checagem?', 'O gatilho fica no parâmetro do controller.'],
      explica: 'Sem <code>@Valid</code> (ou <code>@Validated</code>) no parâmetro, o Spring desserializa o JSON e não valida nada. Records funcionam normalmente com Bean Validation: as anotações nos componentes valem.' },
    { tipo: 'escolha', pergunta: 'Qual anotação rejeita <code>null</code>, <code>""</code> e <code>"   "</code> numa String?',
      opcoes: ['@NotBlank', '@NotNull', '@NotEmpty', '@Size(min = 1)'], certa: 0, opcoesCodigo: true,
      dicas: ['Pense em qual delas olha para espaços em branco.', '"Blank" é vazio <b>ou só espaços</b>.'],
      explica: '<code>@NotBlank</code> exige ao menos um caractere que não seja espaço. <code>@NotEmpty</code> aceita <code>"   "</code>, <code>@NotNull</code> aceita <code>""</code>, e <code>@Size(min = 1)</code> aceita <code>null</code>.' },
    { tipo: 'escolha', pergunta: 'O campo é <code>@Email String email</code>. O cliente manda <code>{"email": null}</code>. O que acontece?',
      opcoes: ['Passa na validação', '400: e-mail inválido', '400: campo obrigatório', 'NullPointerException no validador'], certa: 0,
      dicas: ['Quase todas as constraints têm uma regra em comum sobre <code>null</code>.', 'Só as anotações @Not... rejeitam nulo.'],
      explica: 'Pela especificação, <code>@Email</code>, <code>@Size</code>, <code>@Pattern</code> e similares consideram <code>null</code> válido. Para tornar obrigatório, some <code>@NotBlank</code>.' },
    { tipo: 'completar', pergunta: 'Complete o handler que transforma erros de validação em <code>ProblemDetail</code>:',
      codigo: `@[[0]]
class TratadorDeErros {
    @[[1]](MethodArgumentNotValidException.class)
    ProblemDetail validacao(MethodArgumentNotValidException ex) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Dados inválidos");
        ex.getBindingResult().[[2]]()
          .forEach(e -> pd.setProperty(e.getField(), e.getDefaultMessage()));
        return pd;
    }
}`,
      respostas: [['RestControllerAdvice'], ['ExceptionHandler'], ['getFieldErrors']],
      dicas: ['A classe vale para todos os controllers e devolve JSON.', 'O método declara qual exceção trata. Os erros por campo vêm do BindingResult.', 'RestControllerAdvice, ExceptionHandler e getFieldErrors.'],
      explica: '<code>@RestControllerAdvice</code> = <code>@ControllerAdvice</code> + <code>@ResponseBody</code>. <code>@ExceptionHandler</code> liga o método à exceção, e <code>getFieldErrors()</code> lista um <code>FieldError</code> por campo inválido.' },
    { tipo: 'escolha', pergunta: 'O service lança <code>CpfJaCadastradoException</code> ao tentar criar um assistido com CPF repetido. Qual status o advice deve devolver?',
      opcoes: ['409 Conflict', '400 Bad Request', '404 Not Found', '500 Internal Server Error'], certa: 0,
      dicas: ['O JSON está bem formado e passou na validação.', 'O problema é o estado atual do recurso no servidor.'],
      explica: 'O pedido é válido, mas conflita com algo que já existe: <b>409</b>. 400 é para entrada malformada ou que falha na validação; 500 seria deixar a exceção escapar sem tratamento.' },
    { tipo: 'montar', pergunta: 'Monte o parâmetro do controller que valida o corpo da requisição:',
      certa: ['@Valid', '@RequestBody', 'NovoAtendimentoRequest', 'req'],
      extras: ['@PathVariable', '@NotNull', '@Body'],
      dicas: ['Duas anotações: uma liga a validação, outra diz de onde vem o valor.', '<code>@Body</code> é do NestJS.'],
      explica: '<code>@Valid @RequestBody NovoAtendimentoRequest req</code>: o JSON do corpo é convertido no record e validado antes de o método rodar. <code>@NotNull</code> no parâmetro não valida os campos internos.' },
    { tipo: 'escolha', pergunta: 'O record <code>NovoAssistidoRequest</code> tem <code>EnderecoRequest endereco</code>, e <code>EnderecoRequest</code> tem <code>@NotBlank String cep</code>. Um CEP vazio passa. Por quê?',
      opcoes: ['Falta @Valid no componente endereco', 'Records aninhados nunca são validados', 'Falta @NotBlank no próprio endereco', 'O CEP precisa de @Pattern para ser checado'], certa: 0,
      dicas: ['A validação não desce para objetos aninhados por padrão.', 'É a mesma anotação usada no controller, agora no campo.'],
      explica: 'Para validar em cascata, marque o campo com <code>@Valid</code>: <code>@Valid @NotNull EnderecoRequest endereco</code>. Um <code>@NotNull</code> sozinho só garante que o objeto existe, sem validar o que tem dentro.' },
    { tipo: 'entrevista', pergunta: 'Explique em voz alta: como você padroniza erros numa API Spring Boot?',
      avalia: 'Se você separa validação de entrada de regra de negócio, centraliza o tratamento e conhece um formato padrão.',
      resposta: `<p>Valido a entrada com Bean Validation nos DTOs, que são records, e ligo com <code>@Valid</code> no <code>@RequestBody</code>. Corpo inválido gera <code>MethodArgumentNotValidException</code>.</p>
<p>No service eu lanço exceções de domínio, sem saber de HTTP. Um <code>@RestControllerAdvice</code> traduz tudo: validação vira 400 com a lista de campos, recurso inexistente vira 404, conflito vira 409.</p>
<p>A resposta segue a RFC 9457 com <code>ProblemDetail</code>, então qualquer cliente trata erro do mesmo jeito. É o papel do <code>ValidationPipe</code> e dos exception filters no NestJS.</p>`,
      pontos: ['Bean Validation no DTO + @Valid', 'MethodArgumentNotValidException → 400', '@RestControllerAdvice centraliza', 'exceções de domínio sem HTTP no service', 'ProblemDetail / RFC 9457'],
      evitar: ['try/catch em cada controller', 'devolver stack trace ou 500 para erro do cliente'],
      dicas: ['Fale da entrada, do domínio e do formato de saída.', 'Cite a RFC e a classe do Spring.'] },
  ],
})

// ---- 09-spring-jpa.js
MODULOS.push({
  id: 'spring-jpa',
  titulo: 'Spring Data JPA',
  icone: '🗄️',
  aprende: '@Entity, JpaRepository, derived queries, @Query e paginação',
  porque: 'Quase toda API Spring de órgão público grava em Postgres ou Oracle via JPA, e é aí que moram os bugs de desempenho.',
  gancho: {
    titulo: 'Um erro de digitação',
    pergunta: 'A entidade tem o atributo <code>nomeAssistido</code>. Ninguém chama este método ainda. O que acontece?',
    linguagem: 'java',
    codigo: `public interface AssistidoRepository
        extends JpaRepository<Assistido, Long> {

    List<Assistido> findByNomeAssistdo(String nome);
}`,
    opcoes: ['Nada, até alguém chamar', 'Não compila', 'A aplicação nem sobe', 'Devolve lista vazia'],
    certa: 2,
    revelacao: 'O Spring Data monta a consulta a partir do <b>nome do método</b> na subida e não acha o atributo <code>nomeAssistdo</code>: a aplicação falha com <code>PropertyReferenceException</code>. Nesta lição você vai ver entidades, repositórios, derived queries, <code>@Query</code> e paginação.',
  },
  videos: [
    { id: 'WbAvRdG3JlU', titulo: 'NÃO faça mais confusão | JDBC, JPA, Hibernate e Spring Data JPA', canal: 'Matheus do Java',
      duracao: '12:48', idioma: 'pt',
      nota: 'Situa cada camada: JPA é a especificação, Hibernate a implementação e Spring Data o <code>JpaRepository</code> que você não escreve.' },
    { id: '2SV7QODVHAE', titulo: 'Spring Data JPA: Ultimate Guide to Custom Queries with @Query Annotation', canal: 'Thorben Janssen',
      duracao: '15:09', idioma: 'en',
      nota: 'Observe a diferença entre JPQL (nomes de classe e atributo) e <code>nativeQuery</code>, o ponto que mais confunde quem vem de SQL puro.' },
    { id: 'Jrhb5YJK5II', titulo: 'Aprenda a criar consultas com paginação utilizando Spring Data!', canal: 'Giuliana Bezerra',
      duracao: '13:43', idioma: 'pt',
      nota: 'Veja o <code>Pageable</code> entrando no repositório e o <code>Page</code> saindo com total e número da página (que começa em 0).' },
  ],
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

// ---- 10-spring-jpa-avancado.js
MODULOS.push({
  id: 'spring-jpa-avancado',
  titulo: 'Relações e transações',
  icone: '🔗',
  aprende: '@ManyToOne/@OneToMany, N+1, @Transactional e Flyway',
  porque: 'N+1, LazyInitializationException e transação mal colocada são as perguntas de JPA que mais aparecem em entrevista e em incidente.',
  gancho: {
    titulo: 'O rollback que não veio',
    pergunta: 'O controller chama <code>service.importar(lote)</code> com 5 atendimentos; o 3º viola uma constraint (o id é IDENTITY, então o insert sai no <code>save</code>). Quantos ficam gravados?',
    linguagem: 'java',
    codigo: `public void importar(List<Atendimento> lote) {
    gravar(lote);   // chamada interna
}

@Transactional
public void gravar(List<Atendimento> lote) {
    lote.forEach(repo::save);
}`,
    opcoes: ['Nenhum: rollback', '2', '4', 'Todos os 5'],
    certa: 1,
    revelacao: '<code>@Transactional</code> funciona por <b>proxy</b>, e a chamada interna (<code>this.gravar</code>) passa por fora dele. Sem transação, cada <code>save</code> confirma sozinho: os 2 primeiros ficam. Nesta lição você vai ver relações, N+1, <code>LazyInitializationException</code> e onde pôr a transação.',
  },
  videos: [
    { id: 'QAaTLLYdHJ0', titulo: 'JOIN FETCH with Hibernate - The end of n+1 select issues', canal: 'Thorben Janssen',
      duracao: '6:32', idioma: 'en',
      nota: 'Conte as consultas no log antes e depois do <code>join fetch</code>: é exatamente o N+1 que a lição pede para reconhecer e resolver.' },
    { id: 'gDpmbUoEpPQ', titulo: '[QUESTION] Why doesn\'t @Transactional work when called within the same class?', canal: 'Laur Spilca',
      duracao: '15:35', idioma: 'en',
      nota: 'É o caso do gancho: a chamada interna passa por fora do proxy e o <code>@Transactional</code> simplesmente não age.' },
    { id: 'LX5jaieOIAk', titulo: 'Criando Migrations com Flyway no seu projeto Java Spring & PostgreSQL', canal: 'Fernanda Kipper',
      duracao: '12:09', idioma: 'pt',
      nota: 'Repare no nome <code>V1__...sql</code> em <code>db/migration</code> e na tabela de histórico que o Flyway cria no Postgres.' },
  ],
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

// ---- 11-spring-testes.js
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

// ---- 12-spring-seguranca.js
MODULOS.push({
  id: 'spring-seguranca',
  titulo: 'Spring Security e JWT',
  icone: '🔐',
  aprende: 'SecurityFilterChain, JWT com Resource Server, @PreAuthorize, CSRF, CORS e BCrypt',
  porque: 'Sistema com dado de assistido exige autenticação e autorização corretas, e Spring Security é onde o iniciante mais copia código sem entender.',
  gancho: {
    titulo: 'Token válido, 403 em tudo',
    pergunta: 'O login no Keycloak funciona, o token é válido e o usuário tem o papel <code>defensor</code> no realm. Mesmo assim, toda rota com <code>hasRole("DEFENSOR")</code>, até GET, devolve 403. Por quê?',
    linguagem: 'json',
    codigo: `{
  "sub": "a1b2c3",
  "scope": "openid email",
  "realm_access": { "roles": ["defensor"] }
}`,
    opcoes: ['O token expirou', 'O Spring não lê realm_access sozinho', 'Faltou desligar o CSRF', 'hasRole exige minúsculas'],
    certa: 1,
    revelacao: 'Por padrão o resource server só transforma a claim <code>scope</code> em autoridades (<code>SCOPE_openid</code>...). Os papéis do Keycloak ficam invisíveis até você mapear com um <code>JwtAuthenticationConverter</code>. Nesta lição você vai ver a cadeia de filtros, JWT, 401 vs 403, CSRF e CORS.',
  },
  videos: [
    { id: 'kEJ8a1w4a2Q', titulo: 'Aulão: Spring Security 6 + JWT!', canal: 'Giuliana Bezerra',
      duracao: '32:54', idioma: 'pt',
      nota: 'Repare no <code>@Bean SecurityFilterChain</code> com lambdas e no <code>oauth2ResourceServer</code> validando o JWT, sem <code>WebSecurityConfigurerAdapter</code>.' },
    { id: 'h-9vhFeM3MY', titulo: 'Spring Security Architecture Explained', canal: 'Amigoscode',
      duracao: '14:41', idioma: 'en',
      nota: 'Mostra a cadeia de filtros por onde toda requisição passa antes do controller, a base para entender 401 vs 403.' },
    { id: '68azMcqPpyo', titulo: 'O que você deveria saber sobre Oauth 2.0 e OpenID!', canal: 'Giuliana Bezerra',
      duracao: '23:40', idioma: 'pt',
      nota: 'Contexto do Keycloak: quem emite o token, o que são escopos e claims, e por que a API só valida (resource server).' },
  ],
  resumo: [
    '<b>Autenticação</b> = quem é você (falhou: 401). <b>Autorização</b> = o que você pode (falhou: 403)',
    'Toda requisição passa por uma <b>cadeia de filtros</b> antes de chegar ao controller',
    'A configuração é um <code>@Bean SecurityFilterChain</code> com lambdas; <code>WebSecurityConfigurerAdapter</code> não existe mais',
    '<code>oauth2ResourceServer(o -&gt; o.jwt(...))</code> valida o JWT do cabeçalho <code>Authorization: Bearer</code>',
    '<code>@PreAuthorize</code> só funciona com <code>@EnableMethodSecurity</code>',
    'API stateless com token no cabeçalho pode desligar CSRF; CORS se configura na própria cadeia',
    'Senha se grava com <code>PasswordEncoder</code> (BCrypt) e se confere com <code>matches</code>',
  ],
  ensino: [
    { titulo: 'Autenticação, autorização e a cadeia de filtros',
      texto: `<p>Ao adicionar o <code>spring-boot-starter-security</code>, <b>tudo</b> passa a exigir login: o Boot cria um usuário <code>user</code> com senha gerada no log (<code>Using generated security password</code>). É seguro por padrão, e você abre o que precisar.</p>
<p>Por baixo, o Spring Security é um conjunto de <b>filtros de servlet</b> que roda antes do <code>DispatcherServlet</code>. O <code>FilterChainProxy</code> escolhe a <code>SecurityFilterChain</code> que casa com a URL, e cada filtro faz uma coisa: CORS, CSRF, ler o token, autorizar. Quem autentica guarda o resultado (<code>Authentication</code>) no <code>SecurityContextHolder</code>, que fica preso à thread da requisição.</p>
<p>Os dois erros têm status diferentes: sem credencial ou token inválido, <b>401</b>; autenticado mas sem permissão, <b>403</b>.</p>
<p><b>No NestJS:</b> os Guards (<code>CanActivate</code>) fazem o papel da autorização, e o Passport (<code>JwtStrategy</code>) o da autenticação, preenchendo <code>request.user</code>. Aqui o equivalente do <code>request.user</code> é o <code>SecurityContext</code>.</p>`,
      linguagem: 'texto',
      codigo: `Requisição
  -> CorsFilter
  -> CsrfFilter
  -> BearerTokenAuthenticationFilter   (lê e valida o JWT -> SecurityContext)
  -> ExceptionTranslationFilter        (converte falhas em 401/403)
  -> AuthorizationFilter               (regras de authorizeHttpRequests)
  -> DispatcherServlet -> @RestController` },
    { titulo: 'SecurityFilterChain como @Bean',
      texto: `<p>Desde o Spring Security 6 (Boot 3), a configuração é um método <code>@Bean</code> que recebe <code>HttpSecurity</code> e devolve <code>http.build()</code>. O antigo <code>WebSecurityConfigurerAdapter</code> foi <b>removido</b>, assim como <code>antMatchers</code> e o encadeamento com <code>.and()</code>. Tutorial que usa isso está desatualizado.</p>
<p>As regras de <code>authorizeHttpRequests</code> são avaliadas <b>na ordem</b>: a primeira que casa decide. Coloque as específicas primeiro e <code>anyRequest()</code> por último (depois dele, nenhuma regra é aceita e a aplicação não sobe).</p>
<p><code>hasRole("ADMIN")</code> procura a autoridade <code>ROLE_ADMIN</code>; <code>hasAuthority("SCOPE_processos:escrita")</code> procura o texto exato.</p>
<p><b>No NestJS:</b> é como registrar um guard global e marcar rotas públicas com um decorator <code>@Public()</code>, só que aqui tudo fica num lugar só, por URL.</p>`,
      linguagem: 'java',
      codigo: `@Configuration
@EnableMethodSecurity
public class SegurancaConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/processos/**").hasRole("ADMIN")
                .requestMatchers("/processos/**").authenticated()
                .anyRequest().denyAll())
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));
        return http.build();
    }
}` },
    { titulo: 'JWT com OAuth2 Resource Server',
      texto: `<p>Na maioria dos órgãos o token vem de um provedor de identidade (Keycloak, Azure AD, gov.br). A API só <b>valida</b>: é um <b>resource server</b>. Com o <code>spring-boot-starter-oauth2-resource-server</code> e o <code>issuer-uri</code>, o Spring baixa as chaves públicas (JWKS), confere assinatura, expiração e emissor de cada <code>Authorization: Bearer ...</code>.</p>
<p>Por padrão, a claim <code>scope</code> (ou <code>scp</code>) vira autoridades <code>SCOPE_...</code>. <b>Pegadinha:</b> papéis do Keycloak ficam em <code>realm_access.roles</code> e <b>não</b> são lidos sozinhos: <code>hasRole</code> nega tudo até você registrar um <code>JwtAuthenticationConverter</code> que mapeie essa claim.</p>
<p>No controller, <code>@AuthenticationPrincipal Jwt jwt</code> dá acesso às claims (ex.: <code>jwt.getSubject()</code>, <code>jwt.getClaimAsString("email")</code>).</p>
<p><b>No NestJS:</b> é a <code>JwtStrategy</code> do <code>passport-jwt</code> com <code>secretOrKeyProvider</code> apontando para o JWKS, mais o <code>validate()</code> que monta o usuário.</p>`,
      linguagem: 'yaml',
      codigo: `spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://sso.exemplo.gov.br/realms/defensoria` },
    { titulo: '@PreAuthorize: regra no método',
      texto: `<p>Regras por URL ficam grosseiras quando a decisão depende do papel <b>e</b> do caso. Com <code>@EnableMethodSecurity</code> numa classe de configuração, você anota métodos com <code>@PreAuthorize</code> e uma expressão SpEL: <code>hasRole('DEFENSOR')</code>, <code>hasAuthority('SCOPE_atendimentos:escrita')</code>, ou até checar parâmetros com <code>#id</code>.</p>
<p><b>Pegadinha:</b> sem <code>@EnableMethodSecurity</code>, o <code>@PreAuthorize</code> é ignorado em silêncio: o endpoint fica aberto e nenhum erro aparece. Como o <code>@Transactional</code>, ele funciona por proxy, então chamada interna via <code>this</code> também não é checada.</p>
<p>Negado, lança <code>AccessDeniedException</code>, que vira 403. Se o seu <code>@RestControllerAdvice</code> tiver um <code>@ExceptionHandler(Exception.class)</code> genérico, ele pode engolir essa exceção e devolver 500: trate-a explicitamente.</p>
<p><b>No NestJS:</b> é o par <code>@Roles('defensor')</code> + <code>RolesGuard</code> com <code>Reflector</code>, que você escreve à mão.</p>`,
      linguagem: 'java',
      codigo: `@Service
public class ProcessoService {

    @PreAuthorize("hasRole('DEFENSOR')")
    public void arquivar(Long id) { ... }

    @PreAuthorize("hasRole('ADMIN') or #defensorId == authentication.name")
    public List<ProcessoResponse> daCarteira(String defensorId) { ... }
}` },
    { titulo: 'CSRF, CORS e senhas',
      texto: `<p><b>CSRF</b> explora o navegador mandar cookies automaticamente. API stateless que recebe o token no cabeçalho <code>Authorization</code> não é vulnerável a isso, então desligar é correto. Se a sessão ou o token estiver em <b>cookie</b>, mantenha o CSRF ligado.</p>
<p><b>CORS</b> é regra do navegador, não autenticação. Com <code>.cors(Customizer.withDefaults())</code> a cadeia usa o bean <code>CorsConfigurationSource</code>; isso garante que o preflight <code>OPTIONS</code> seja respondido antes de exigir token (sintoma do erro: o front vê falha de CORS num 401).</p>
<p><b>Senhas</b> próprias se gravam com <code>PasswordEncoder</code>. <code>BCryptPasswordEncoder</code> gera um salt novo a cada <code>encode</code>, então o mesmo texto dá hashes diferentes: compare com <code>matches(senhaDigitada, hashGravado)</code>, nunca com <code>equals</code>.</p>
<p><b>No NestJS:</b> é o <code>app.enableCors()</code>, o <code>csurf</code> e o <code>bcrypt.hash</code>/<code>bcrypt.compare</code>.</p>`,
      linguagem: 'java',
      codigo: `@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration c = new CorsConfiguration();
    c.setAllowedOrigins(List.of("https://app.exemplo.gov.br"));
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    UrlBasedCorsConfigurationSource fonte = new UrlBasedCorsConfigurationSource();
    fonte.registerCorsConfiguration("/**", c);
    return fonte;
}

@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// uso: encoder.matches(senhaDigitada, usuario.getSenhaHash())` },
  ],
  exercicios: [
    { tipo: 'escolha', pergunta: 'Um defensor autenticado tenta excluir um processo e a regra exige <code>ROLE_ADMIN</code>. Qual status a API deve devolver?',
      opcoes: ['403 Forbidden', '401 Unauthorized', '404 Not Found', '400 Bad Request'], certa: 0,
      dicas: ['Ele já provou quem é.', 'Falta permissão, não identidade.'],
      explica: '401 é para quem não está autenticado (sem token ou token inválido). Aqui a identidade é conhecida e falta autorização: 403.' },
    { tipo: 'escolha', pergunta: 'Você encontra este código num tutorial. Qual o problema num projeto Spring Boot 3?',
      codigo: `@Configuration
public class Seguranca extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/publico").permitAll();
    }
}`,
      opcoes: ['WebSecurityConfigurerAdapter foi removido; use um @Bean SecurityFilterChain', 'Falta @EnableWebSecurity', 'antMatchers precisa de barra no final', 'configure deveria ser public'], certa: 0,
      dicas: ['Esse estilo é da era Spring Boot 2.', 'No Spring Security 6 a configuração virou um bean.'],
      explica: 'O Spring Security 6 removeu <code>WebSecurityConfigurerAdapter</code> e <code>antMatchers</code>. O jeito atual é um método <code>@Bean</code> que recebe <code>HttpSecurity</code>, usa <code>authorizeHttpRequests</code> e <code>requestMatchers</code>, e devolve <code>http.build()</code>.' },
    { tipo: 'completar', pergunta: 'Complete a cadeia de uma API stateless que valida JWT:',
      codigo: `@Bean
[[0]] api(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/actuator/health").[[1]]()
            .anyRequest().authenticated())
        .[[2]](o -> o.jwt(Customizer.withDefaults()));
    return http.build();
}`,
      respostas: [['SecurityFilterChain'], ['permitAll'], ['oauth2ResourceServer']],
      dicas: ['O tipo de retorno é a própria cadeia de filtros.', 'Health fica aberto; o JWT é configurado pelo recurso "resource server".'],
      explica: 'O bean é uma <code>SecurityFilterChain</code>; <code>permitAll()</code> libera o health; <code>oauth2ResourceServer(o -&gt; o.jwt(...))</code> liga o filtro que valida o Bearer token.' },
    { tipo: 'escolha', pergunta: 'O que acontece com esta configuração?',
      codigo: `.authorizeHttpRequests(auth -> auth
    .anyRequest().authenticated()
    .requestMatchers("/actuator/health").permitAll())`,
      opcoes: ['A aplicação não sobe: não se pode configurar requestMatchers depois de anyRequest', 'O health fica aberto normalmente', 'O health exige autenticação, sem erro', 'Todas as rotas ficam abertas'], certa: 0,
      dicas: ['As regras são avaliadas em ordem.', 'O Spring Security protege você de uma regra que nunca seria alcançada.'],
      explica: 'Depois de <code>anyRequest()</code>, qualquer regra seria inalcançável, e o Spring Security lança <code>IllegalStateException</code> na subida. Coloque as regras específicas primeiro e <code>anyRequest()</code> por último.' },
    { tipo: 'escolha', pergunta: 'O método tem <code>@PreAuthorize("hasRole(\'ADMIN\')")</code>, mas qualquer usuário consegue chamá-lo e nada aparece no log. Causa mais provável?',
      opcoes: ['Falta @EnableMethodSecurity', 'Falta o prefixo ROLE_ na expressão', 'O método precisa ser static', 'Falta csrf().disable()'], certa: 0,
      dicas: ['A segurança em método precisa ser ligada.', 'Sem ela, a anotação é só metadado.'],
      explica: 'Sem <code>@EnableMethodSecurity</code> em alguma <code>@Configuration</code>, o <code>@PreAuthorize</code> é ignorado em silêncio. <code>hasRole(\'ADMIN\')</code> já acrescenta o <code>ROLE_</code> sozinho.' },
    { tipo: 'escolha', pergunta: 'O token do Keycloak tem <code>"realm_access": {"roles": ["defensor"]}</code>, mas <code>hasRole("DEFENSOR")</code> sempre nega. Por quê?',
      opcoes: ['O conversor padrão só lê a claim scope/scp; é preciso um JwtAuthenticationConverter para mapear os papéis', 'O Keycloak não suporta papéis', 'hasRole só funciona com sessão', 'Falta permitAll na rota'], certa: 0,
      dicas: ['De onde o Spring tira as autoridades do JWT por padrão?', 'Ele cria autoridades com o prefixo SCOPE_.'],
      explica: 'O padrão transforma <code>scope</code>/<code>scp</code> em <code>SCOPE_...</code>. Papéis em claims próprias do provedor exigem um <code>JwtAuthenticationConverter</code> que gere <code>ROLE_DEFENSOR</code>. Repare também em maiúsculas: <code>defensor</code> e <code>DEFENSOR</code> são autoridades diferentes.' },
    { tipo: 'escolha', pergunta: 'Por que é aceitável desligar CSRF nesta API?',
      opcoes: ['Ela é stateless e recebe o token no cabeçalho Authorization, que o navegador não envia sozinho', 'Porque CORS já protege contra CSRF', 'Porque toda API REST é imune a CSRF', 'Porque o JWT é criptografado'], certa: 0,
      dicas: ['CSRF depende de o navegador anexar a credencial automaticamente.', 'Cookies são anexados sozinhos; cabeçalhos customizados, não.'],
      explica: 'O ataque usa credenciais que o navegador envia por conta própria (cookies). Com Bearer token no cabeçalho, não há o que forjar. Se você guarda o token em cookie, o CSRF volta a ser necessário. CORS não é proteção contra CSRF.' },
    { tipo: 'montar', pergunta: 'Monte a conferência da senha digitada no login:',
      certa: ['passwordEncoder', '.matches(', 'senhaDigitada', ',', 'usuario.getSenhaHash()', ')'],
      extras: ['.encode(', '.equals(', 'Objects.equals('],
      dicas: ['Não se compara hash com hash: o BCrypt usa salt aleatório.', 'O método recebe a senha em texto puro primeiro, depois o hash gravado.'],
      explica: '<code>passwordEncoder.matches(senhaDigitada, hashGravado)</code> refaz o hash com o salt guardado no próprio hash. <code>encode</code> gera um hash novo, diferente a cada chamada, e a comparação com <code>equals</code> falharia sempre.' },
    { tipo: 'entrevista', pergunta: 'Explique em voz alta: como você protege uma API Spring Boot que recebe JWT de um Keycloak?',
      avalia: 'Se você sabe o papel de resource server, a configuração atual por bean e a diferença entre regra por URL e por método.',
      resposta: `<p>A API é um resource server: não emite token, só valida. Uso o starter de OAuth2 Resource Server com o <code>issuer-uri</code> do realm, e o Spring confere assinatura pelas chaves públicas, expiração e emissor.</p>
<p>Configuro um <code>@Bean SecurityFilterChain</code>: stateless, CSRF desligado porque o token vem no cabeçalho, CORS restrito ao front, health público e o resto autenticado. Como os papéis do Keycloak ficam em <code>realm_access.roles</code>, registro um <code>JwtAuthenticationConverter</code> que os transforma em <code>ROLE_...</code>.</p>
<p>Regras finas ficam no service com <code>@PreAuthorize</code> e <code>@EnableMethodSecurity</code>. Falta de token dá 401, falta de permissão dá 403. É o que Passport e Guards fazem no NestJS.</p>`,
      pontos: ['resource server valida, não emite', 'issuer-uri / JWKS', 'SecurityFilterChain como bean, stateless', 'CSRF desligado com justificativa', 'mapeamento de papéis do Keycloak', '@PreAuthorize + @EnableMethodSecurity', '401 vs 403'],
      evitar: ['WebSecurityConfigurerAdapter', 'validar JWT na mão com segredo copiado no código'],
      dicas: ['Comece pelo papel da API no fluxo OAuth2.', 'Fale de URL, método e status.'] },
  ],
})

// ---- 13-spring-producao.js
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

const ordem = CURSO.partes.flatMap(p => p.ids)
const LICOES = ordem.map(id => MODULOS.find(m => m.id === id)).filter(Boolean)
globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}
globalThis.TRILHAS_CARREGADAS["java-spring"] = { CURSO, LICOES, MODULOS }
})()
