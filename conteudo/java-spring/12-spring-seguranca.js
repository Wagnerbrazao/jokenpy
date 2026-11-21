MODULOS.push({
  id: 'spring-seguranca',
  titulo: 'Spring Security e JWT',
  icone: '🔐',
  aprende: 'SecurityFilterChain, JWT com Resource Server, @PreAuthorize, CSRF, CORS e BCrypt',
  porque: 'Sistema com dado de assistido exige autenticação e autorização corretas, e Spring Security é onde o iniciante mais copia código sem entender.',
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
