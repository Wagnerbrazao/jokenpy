MODULOS.push({
  id: 'spring-validacao',
  titulo: 'Validação e erros',
  icone: '🛡️',
  aprende: 'Bean Validation, @Valid, @RestControllerAdvice e ProblemDetail',
  porque: 'Uma API pública vive de rejeitar entrada ruim com uma resposta clara e sempre no mesmo formato.',
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
