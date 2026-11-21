# Conteúdo das trilhas públicas

Cada pasta é uma trilha. `curso.js` define títulos, partes e competências. Cada módulo fica num arquivo
`NN-<id>.js` (ex.: `03-java-colecoes.js`) que chama `MODULOS.push({ ... })`.

Depois de escrever, rode e corrija até sair ✓:

    python3 ferramentas/gerar_cursos.py <id-da-trilha>

O gerador junta os arquivos em `cursos/<id>.js`, roda no Node e valida a estrutura.

## Formato de um módulo

```js
MODULOS.push({
  id: 'java-colecoes',              // igual ao id em curso.js; só a-z, 0-9 e -
  titulo: 'Coleções e Streams',     // curto (cabe no celular)
  icone: '🧺',                      // um emoji
  aprende: 'List, Map, Set, Streams e Optional',   // completa "Você vai ver: ..."
  porque: 'Toda resposta de API e toda consulta ao banco volta como coleção.',  // 1 frase: por que isso importa no trabalho real
  resumo: [                         // 3 a 7 frases curtas (HTML): a "cola" do módulo
    '<code>List.of(1, 2)</code> cria uma lista <b>imutável</b>',
  ],
  ensino: [                         // 3 a 6 cartões, cada um com UMA ideia
    { titulo: 'List é o array do Java',
      texto: `<p>Explicação curta (2 a 4 parágrafos), com <b>negrito</b> no essencial.</p>
<p><b>No NestJS/TypeScript:</b> a comparação com o que a pessoa já conhece.</p>`,
      linguagem: 'java',            // OBRIGATÓRIO quando há código: java, xml, yaml, properties, bash, sql, jsx, tsx, ts, js, django, json, http, texto
      codigo: `List<String> nomes = List.of("Ana", "Bia");
nomes.forEach(System.out::println);` },
  ],
  exercicios: [ /* 6 a 9 exercícios, ver abaixo */ ],
})
```

## Tipos de exercício

Todo exercício tem `pergunta` (HTML), `dicas` (2 ou 3, da mais geral à quase-resposta) e `explica`
(o porquê, mostrado depois de responder; na escolha, diga por que a opção tentadora está errada).

```js
{ tipo: 'escolha', pergunta: 'O que <code>List.of(1, 2).add(3)</code> faz?',
  codigo: `opcional: trecho mostrado acima das opções`,
  opcoes: ['Adiciona 3', 'Lança UnsupportedOperationException', 'Não compila'],   // 3 ou 4
  certa: 1,                         // índice da opção certa (a tela embaralha)
  opcoesCodigo: false,              // true se as opções são código
  dicas: ['...', '...'], explica: '...' },

{ tipo: 'completar', pergunta: 'Complete para filtrar os ativos:',
  codigo: `usuarios.stream()
    .[[0]](u -> u.ativo())
    .[[1]]();`,                     // lacunas [[0]], [[1]]... cada uma aparece UMA vez
  respostas: [['filter'], ['toList']],   // por lacuna: lista de respostas aceitas
  dicas: [...], explica: '...' },

{ tipo: 'montar', pergunta: 'Monte a declaração do repositório:',
  certa: ['public', 'interface', 'UsuarioRepository', 'extends', 'JpaRepository<Usuario, Long>'],  // 3+ peças, na ordem
  extras: ['class', 'implements'],  // peças que confundem (total de peças ≤ 12)
  dicas: [...], explica: '...' },

{ tipo: 'entrevista', pergunta: 'Explique em voz alta: por que preferir injeção pelo construtor?',
  avalia: 'O que um entrevistador quer ouvir (HTML)',
  resposta: `<p>Resposta-modelo de 30 a 60 segundos.</p>`,
  pontos: ['tópico que deveria aparecer', '...'],   // checklist
  evitar: ['erro comum'],           // opcional
  dicas: [...] },                   // no máximo 1 entrevista por módulo
```

## Regras que o validador cobra

- Em campos HTML (`texto`, `pergunta`, `explica`, `resumo`, `dicas`, `resposta`, `avalia`) só valem as tags
  `p b i em strong code br ul ol li small kbd mark span pre`. **Generics e JSX em texto precisam de escape:**
  `List&lt;String&gt;`, `&lt;Botao /&gt;`. Nos campos `codigo`, `opcoes`, `certa`, `extras` e `respostas`
  escreva normal (`List<String>`): o app escapa sozinho.
- Os textos são template strings: `${...}` dentro de código (ex.: `${server.port}` no Spring, template string
  no JSX) precisa virar `\${...}`. Crase dentro de código vira `` \` ``.
- `linguagem: 'python'` é proibido (roda no servidor); para Django use `'django'`.
- Sem `tipo: 'codigo'`: essas trilhas não executam código.

## Estilo

- Português do Brasil, frases curtas, voz ativa, "você". Termos técnicos em inglês ficam em inglês.
- Exemplos com cara de sistema real (pedidos, usuários, processos), nada de `foo`/`bar`.
- Cada exercício testa **uma** ideia, com distratores plausíveis (erros que alguém comete de verdade).
- Mostre o erro comum e como reconhecê-lo (mensagem de exceção, sintoma).
- Precisão acima de tudo: na dúvida sobre uma API, use a forma mais estável e conhecida.

## Desafio relâmpago (`gancho`): obrigatório em todo módulo

É a primeira tela do módulo, **antes** da explicação: um quebra-cabeça curto em que a pessoa dá um palpite.
Errar faz parte e não tira ponto. Tentar responder antes de aprender (efeito do pré-teste) deixa a pessoa
curiosa e faz o conteúdo grudar. Um bom gancho:

- mostra algo **surpreendente ou contraintuitivo** que o módulo explica (um `==` que dá false, um join que duplica linhas,
  um efeito que roda duas vezes, um N+1 escondido);
- ou um **problema real de trabalho** que o módulo resolve ("o endpoint de assistidos ficou 40x mais lento depois de um campo novo. Por quê?");
- dá para responder em 20 segundos no celular (código de no máximo ~8 linhas, opções curtas);
- tem opções plausíveis: a "óbvia" costuma ser a errada;
- na `revelacao`, explica a resposta em 1–2 frases e termina com a promessa do módulo ("Nesta lição você vai ver por que… e como evitar.").

```js
  gancho: {
    titulo: 'O mistério do ==',                 // 2 a 5 palavras
    pergunta: 'O que este código imprime?',     // HTML curto
    linguagem: 'java',                          // obrigatório se houver código
    codigo: `String a = new String("oi");
String b = new String("oi");
System.out.println(a == b);`,
    opcoes: ['true', 'false', 'Não compila'],   // 2 a 4
    certa: 1,
    opcoesCodigo: true,                          // opcional
    revelacao: '<code>==</code> compara se são o <b>mesmo objeto</b>, não o texto. Nesta lição você vai ver quando usar <code>equals</code> e por que isso derruba muita gente que vem do TypeScript.',
  },
```

Todo módulo também precisa de `porque`: uma frase dizendo por que aquilo importa no trabalho real.
