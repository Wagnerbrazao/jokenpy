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
