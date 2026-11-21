MODULOS.push({
  id: 'java-base',
  titulo: 'Java em 15 minutos',
  icone: '☕',
  aprende: 'JVM, tipos, String, == vs equals, packages e static',
  porque: 'Todo código Spring que você vai ler na entrevista ou no trabalho assume que essas regras básicas do Java já são automáticas para você.',
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
