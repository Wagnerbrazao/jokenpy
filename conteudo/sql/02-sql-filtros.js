MODULOS.push({
  id: 'sql-filtros',
  titulo: 'Filtros e NULL',
  icone: '🧹',
  aprende: 'WHERE, AND/OR, IN, BETWEEN, LIKE/ILIKE, NULL, COALESCE e CASE',
  porque: 'Filtro errado não dá erro: devolve dados errados em silêncio, e NULL é o culpado mais comum.',
  resumo: [
    '<code>AND</code> tem precedência sobre <code>OR</code>: use <b>parênteses</b> sempre que misturar',
    '<code>BETWEEN a AND b</code> inclui as duas pontas',
    '<code>LIKE</code> diferencia maiúsculas; <code>ILIKE</code> (PostgreSQL) não',
    '<code>= NULL</code> nunca é verdadeiro: use <code>IS NULL</code> / <code>IS NOT NULL</code>',
    '<code>NOT IN</code> com um <code>NULL</code> na lista não devolve <b>nada</b>',
    '<code>COALESCE(a, b)</code> devolve o primeiro valor não nulo',
    '<code>CASE WHEN ... THEN ... ELSE ... END</code> é o if/else do SQL',
  ],
  ensino: [
    { titulo: 'WHERE, AND, OR e parênteses',
      texto: `<p><code>WHERE</code> mantém só as linhas em que a condição é <b>verdadeira</b>. Comparações: <code>=</code>, <code>&lt;&gt;</code> (ou <code>!=</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p>
<p><code>AND</code> é avaliado antes de <code>OR</code>, como multiplicação antes de soma. <code>status = 'pago' OR status = 'enviado' AND criado_em &gt;= '2026-01-01'</code> aplica a data <b>só</b> aos enviados.</p>
<p>Regra prática: misturou <code>AND</code> e <code>OR</code>, coloque parênteses. Ou troque a lista de <code>OR</code> por <code>IN</code>.</p>`,
      linguagem: 'sql',
      codigo: `-- pedidos pagos OU enviados, todos de 2026
SELECT id, status, criado_em
FROM pedidos
WHERE (status = 'pago' OR status = 'enviado')
  AND criado_em >= '2026-01-01';

-- mesmo filtro com IN
SELECT id FROM pedidos
WHERE status IN ('pago', 'enviado')
  AND criado_em >= '2026-01-01';` },
    { titulo: 'BETWEEN e LIKE',
      texto: `<p><code>BETWEEN 50 AND 100</code> equivale a <code>preco &gt;= 50 AND preco &lt;= 100</code>: as duas pontas entram.</p>
<p><b>Pegadinha com datas:</b> se <code>criado_em</code> é <code>timestamp</code>, <code>BETWEEN '2026-01-01' AND '2026-01-31'</code> para em 31/01 à meia-noite e perde o resto do dia. Prefira um intervalo meio aberto: <code>&gt;= '2026-01-01' AND &lt; '2026-02-01'</code>.</p>
<p><code>LIKE</code> casa padrões: <code>%</code> é qualquer sequência, <code>_</code> é um caractere. <code>LIKE</code> diferencia maiúsculas; no PostgreSQL, <code>ILIKE</code> não. Um padrão que começa com <code>%</code> não aproveita índice B-tree comum.</p>`,
      linguagem: 'sql',
      codigo: `SELECT nome, preco FROM produtos
WHERE preco BETWEEN 50 AND 100;

-- pedidos de janeiro inteiro (criado_em é timestamp)
SELECT id FROM pedidos
WHERE criado_em >= '2026-01-01' AND criado_em < '2026-02-01';

SELECT nome FROM clientes WHERE nome ILIKE 'ana%';` },
    { titulo: 'NULL não é valor, é "desconhecido"',
      texto: `<p><code>NULL</code> significa "sem valor / desconhecido". Qualquer comparação com ele dá <code>NULL</code>, não <code>true</code> nem <code>false</code>. Até <code>NULL = NULL</code> dá <code>NULL</code>.</p>
<p>Como o <code>WHERE</code> só mantém o que é <b>verdadeiro</b>, <code>WHERE cidade = NULL</code> não devolve nenhuma linha, sem erro nenhum. O certo é <code>IS NULL</code> / <code>IS NOT NULL</code>.</p>
<p>Outra armadilha: <code>WHERE cidade &lt;&gt; 'Goiânia'</code> <b>também exclui</b> quem tem cidade nula. Se quiser incluí-los, use <code>cidade IS DISTINCT FROM 'Goiânia'</code>.</p>
<p><b>No ORM:</b> o TypeORM tem <code>IsNull()</code> e o Prisma <code>{ cidade: null }</code> justamente porque o SQL não aceita <code>= NULL</code>.</p>`,
      linguagem: 'sql',
      codigo: `SELECT nome FROM clientes WHERE cidade = NULL;   -- 0 linhas, sempre
SELECT nome FROM clientes WHERE cidade IS NULL;  -- o certo

-- inclui quem tem cidade nula
SELECT nome FROM clientes
WHERE cidade IS DISTINCT FROM 'Goiânia';` },
    { titulo: 'NOT IN e NULL: a armadilha',
      texto: `<p><code>x NOT IN (1, 2, NULL)</code> vira <code>x &lt;&gt; 1 AND x &lt;&gt; 2 AND x &lt;&gt; NULL</code>. O último termo é <code>NULL</code>, então a expressão inteira nunca é verdadeira: a consulta devolve <b>zero linhas</b>.</p>
<p>Isso morde quando a lista vem de uma subconsulta em coluna que aceita nulo. Prefira <code>NOT EXISTS</code> (próximos módulos) ou filtre os nulos na subconsulta.</p>`,
      linguagem: 'sql',
      codigo: `-- se algum pedido tiver cliente_id NULL, volta vazio!
SELECT nome FROM clientes
WHERE id NOT IN (SELECT cliente_id FROM pedidos);

-- seguro
SELECT nome FROM clientes c
WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);` },
    { titulo: 'COALESCE e CASE',
      texto: `<p><code>COALESCE(a, b, c)</code> devolve o primeiro argumento não nulo. Ótimo para valor padrão: <code>COALESCE(cidade, 'Não informada')</code>.</p>
<p><code>CASE</code> é o if/else do SQL e pode aparecer no <code>SELECT</code>, no <code>WHERE</code> e no <code>ORDER BY</code>. Avalia os <code>WHEN</code> em ordem e para no primeiro verdadeiro. Sem <code>ELSE</code>, o resultado é <code>NULL</code>.</p>`,
      linguagem: 'sql',
      codigo: `SELECT nome,
       COALESCE(cidade, 'Não informada') AS cidade,
       CASE
         WHEN preco >= 1000 THEN 'premium'
         WHEN preco >= 100  THEN 'médio'
         ELSE 'básico'
       END AS faixa
FROM produtos;` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Quantas linhas esta consulta devolve se 12 clientes não têm cidade cadastrada?',
      codigo: `SELECT nome FROM clientes WHERE cidade = NULL;`,
      opcoes: ['12', '0', 'Dá erro de sintaxe', 'Todas as linhas da tabela'],
      certa: 1,
      dicas: ['Qual o resultado de comparar qualquer coisa com NULL?', 'O WHERE só mantém linhas em que a condição é verdadeira.', 'cidade = NULL dá NULL, nunca true.'],
      explica: '<code>cidade = NULL</code> resulta em NULL para toda linha, e o WHERE descarta o que não é verdadeiro. Não há erro, só zero linhas. Use <code>WHERE cidade IS NULL</code> para achar os 12.' },
    { tipo: 'escolha',
      pergunta: 'O que esta consulta realmente filtra?',
      codigo: `SELECT id FROM pedidos
WHERE status = 'pago' OR status = 'enviado'
  AND criado_em >= '2026-01-01';`,
      opcoes: ['Pedidos pagos de qualquer data, mais pedidos enviados de 2026', 'Pedidos pagos ou enviados, todos de 2026', 'Só pedidos enviados de 2026', 'Dá erro por faltar parênteses'],
      certa: 0,
      dicas: ['AND e OR têm a mesma precedência?', 'AND é avaliado antes, como multiplicação antes de soma.', 'Fica: pago OR (enviado AND data).'],
      explica: 'AND tem precedência sobre OR, então o filtro de data se prende só a <code>status = \'enviado\'</code>. Os pagos entram de qualquer data. A intenção comum (opção 2) exige parênteses em volta do OR.' },
    { tipo: 'completar',
      pergunta: 'Complete para listar clientes sem cidade cadastrada, mostrando "Não informada" no lugar:',
      linguagem: 'sql',
      codigo: `SELECT nome, [[0]](cidade, 'Não informada') AS cidade
FROM clientes
WHERE cidade [[1]];`,
      respostas: [['COALESCE', 'coalesce'], ['IS NULL', 'is null']],
      dicas: ['Uma função devolve o primeiro valor não nulo.', 'Para testar nulo não se usa =.', 'COALESCE e IS NULL.'],
      explica: '<code>COALESCE</code> troca o nulo por um valor padrão, e <code>IS NULL</code> é o único teste que funciona para nulo.' },
    { tipo: 'escolha',
      pergunta: 'Esta consulta devolve zero clientes, embora existam clientes sem pedidos. Qual a causa mais provável?',
      codigo: `SELECT nome FROM clientes
WHERE id NOT IN (SELECT cliente_id FROM pedidos);`,
      opcoes: ['Existe pelo menos um pedido com cliente_id NULL', 'NOT IN não aceita subconsulta', 'Falta DISTINCT na subconsulta', 'Falta um JOIN entre as tabelas'],
      certa: 0,
      dicas: ['Pense em como NOT IN se expande.', 'id &lt;&gt; NULL dá o quê?', 'Um único NULL na lista torna o NOT IN sempre não verdadeiro.'],
      explica: 'NOT IN vira uma cadeia de <code>&lt;&gt;</code> ligados por AND. Se a lista tem um NULL, um dos termos é NULL e a expressão nunca é verdadeira. Duplicatas na subconsulta não alteram o resultado. Use <code>NOT EXISTS</code>.' },
    { tipo: 'escolha',
      pergunta: '<code>criado_em</code> é <code>timestamp</code>. Qual filtro pega <b>todos</b> os pedidos de janeiro de 2026?',
      opcoes: ["criado_em >= '2026-01-01' AND criado_em < '2026-02-01'", "criado_em BETWEEN '2026-01-01' AND '2026-01-31'", "criado_em LIKE '2026-01%'", "criado_em = '2026-01'"],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['BETWEEN inclui as pontas, mas qual é a ponta final exatamente?', "'2026-01-31' vira 31/01 às 00:00:00.", 'Use intervalo meio aberto: maior ou igual ao início e menor que o mês seguinte.'],
      explica: "Com timestamp, <code>'2026-01-31'</code> significa meia-noite do dia 31, então BETWEEN perde quase o dia inteiro. O intervalo meio aberto pega tudo e ainda usa índice. LIKE em timestamp nem funciona sem conversão." },
    { tipo: 'montar',
      pergunta: 'Monte o filtro de produtos de eletrônicos <b>ou</b> games que custam menos de 200:',
      certa: ['WHERE', 'categoria', 'IN', "('eletronicos', 'games')", 'AND', 'preco', '<', '200'],
      extras: ['OR', '=', 'LIKE'],
      dicas: ['Duas categorias possíveis cabem numa lista.', 'A lista evita o problema de precedência entre AND e OR.', "WHERE categoria IN (...) AND preco &lt; 200."],
      explica: "<code>IN</code> substitui <code>categoria = 'eletronicos' OR categoria = 'games'</code> e dispensa parênteses ao combinar com AND." },
    { tipo: 'completar',
      pergunta: 'Complete para classificar pedidos: "aberto" se o status for pendente, "fechado" nos demais:',
      linguagem: 'sql',
      codigo: `SELECT id,
       [[0]] WHEN status = 'pendente' THEN 'aberto'
            [[1]] 'fechado'
       [[2]] AS situacao
FROM pedidos;`,
      respostas: [['CASE', 'case'], ['ELSE', 'else'], ['END', 'end']],
      dicas: ['É a expressão condicional do SQL.', 'Precisa de um caso padrão e de um fechamento.', 'CASE ... ELSE ... END.'],
      explica: '<code>CASE WHEN ... THEN ... ELSE ... END</code>. Sem o <code>ELSE</code>, os pedidos não pendentes ficariam com <code>NULL</code>.' },
    { tipo: 'escolha',
      pergunta: 'Qual filtro acha clientes cujo nome contém "silva", com qualquer combinação de maiúsculas, no PostgreSQL?',
      opcoes: ["nome ILIKE '%silva%'", "nome LIKE '%silva%'", "nome = '%silva%'", "nome ILIKE 'silva'"],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['Precisa de curinga dos dois lados.', 'LIKE diferencia maiúsculas.', 'ILIKE com % antes e depois.'],
      explica: "<code>ILIKE</code> ignora maiúsculas e os <code>%</code> aceitam qualquer coisa antes e depois. <code>LIKE '%silva%'</code> não acha \"Silva\". Com <code>=</code>, o % é um caractere literal." },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: por que <code>WHERE coluna = NULL</code> não funciona e como o NULL afeta outros filtros?',
      avalia: 'Se você entende a lógica de três valores (true, false, unknown) e conhece as armadilhas práticas, não só a regra decorada.',
      resposta: `<p>NULL representa um valor desconhecido, então o SQL usa lógica de três valores: comparar qualquer coisa com NULL dá <i>unknown</i>, inclusive NULL = NULL. O WHERE só mantém linhas verdadeiras, por isso <code>= NULL</code> devolve zero linhas sem erro. O certo é IS NULL.</p>
<p>Isso aparece em outros lugares: <code>coluna &lt;&gt; 'x'</code> também exclui os nulos, <code>NOT IN</code> com um NULL na lista não devolve nada, e agregações como COUNT(coluna) e AVG ignoram nulos. Para tratar, uso IS DISTINCT FROM, COALESCE ou NOT EXISTS.</p>`,
      pontos: ['Lógica de três valores / unknown', 'WHERE descarta unknown', 'IS NULL / IS NOT NULL', 'Armadilha do NOT IN ou do &lt;&gt;', 'COALESCE ou IS DISTINCT FROM como solução'],
      evitar: ['Dizer que dá erro de sintaxe', 'Tratar NULL como string vazia ou zero'],
      dicas: ['Comece pelo que NULL significa.', 'Mencione um caso além do = NULL.'] },
  ],
})
