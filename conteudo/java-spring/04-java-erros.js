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
