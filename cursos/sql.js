// Gerado por ferramentas/gerar_cursos.py a partir de conteudo/sql/. Não edite à mão.
(() => {
const MODULOS = []
const CURSO = {
  kicker: 'SQL',
  titulo: 'Pergunte qualquer coisa ao banco com <em>SQL</em>.',
  subtitulo: 'Consultas sobre uma loja fictícia (clientes, pedidos e produtos), no dialeto do PostgreSQL. Do SELECT às window functions e índices.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Ler os dados', tipo: 'pedra', ids: ['sql-select', 'sql-filtros'] },
    { titulo: 'Juntar e resumir', tipo: 'papel', ids: ['sql-agregacao', 'sql-joins'] },
    { titulo: 'Consultas de gente grande', tipo: 'tesoura', ids: ['sql-avancado', 'sql-modelagem'] },
  ],
  vaga: [
    { texto: 'Selecionar, filtrar e ordenar dados com precisão (inclusive NULL)', modulos: ['sql-select', 'sql-filtros'] },
    { texto: 'Resumir com GROUP BY, HAVING e funções de agregação', modulos: ['sql-agregacao'] },
    { texto: 'Combinar tabelas com INNER e LEFT JOIN sem duplicar linhas', modulos: ['sql-joins'] },
    { texto: 'Usar CTEs, subconsultas e window functions', modulos: ['sql-avancado'] },
    { texto: 'Criar tabelas com chaves, índices e transações', modulos: ['sql-modelagem'], diferencial: true },
  ],
}

// ---- 01-sql-select.js
MODULOS.push({
  id: 'sql-select',
  titulo: 'SELECT e ordenação',
  icone: '🔎',
  aprende: 'SELECT, aliases, DISTINCT, ORDER BY, LIMIT/OFFSET e a ordem em que o banco executa a consulta',
  porque: 'Todo find() do seu ORM vira um SELECT, e saber ler e escrever um na mão é o que separa adivinhar de entender a query lenta.',
  resumo: [
    'A loja: <code>clientes</code>, <code>produtos</code>, <code>pedidos</code> e <code>itens_pedido</code>',
    '<code>SELECT nome AS cliente</code> renomeia a coluna no resultado',
    '<code>DISTINCT</code> remove linhas repetidas considerando <b>todas</b> as colunas selecionadas',
    'Sem <code>ORDER BY</code>, a ordem das linhas <b>não é garantida</b>',
    '<code>LIMIT 10 OFFSET 20</code> pula 20 e traz 10; sem <code>ORDER BY</code> a paginação é instável',
    'Ordem lógica: <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code>',
  ],
  ensino: [
    { titulo: 'A loja que vamos consultar',
      texto: `<p>A trilha inteira usa o banco de uma loja fictícia com quatro tabelas. Vale guardar o desenho:</p>
<ul>
<li><code>clientes(id, nome, cidade, criado_em)</code></li>
<li><code>produtos(id, nome, categoria, preco)</code></li>
<li><code>pedidos(id, cliente_id, criado_em, status)</code>: cada pedido é de um cliente</li>
<li><code>itens_pedido(pedido_id, produto_id, quantidade, preco_unitario)</code>: as linhas de cada pedido</li>
</ul>
<p>O <code>preco_unitario</code> fica no item porque o preço do produto muda com o tempo: o pedido guarda o preço <b>da época</b>.</p>
<p><b>No TypeORM/Prisma:</b> são as suas entidades <code>Cliente</code>, <code>Pedido</code> etc., com <code>@ManyToOne</code> de <code>Pedido</code> para <code>Cliente</code>.</p>`,
      linguagem: 'sql',
      codigo: `SELECT id, nome, cidade
FROM clientes;

SELECT * FROM produtos;  -- todas as colunas` },
    { titulo: 'Colunas, expressões e aliases',
      texto: `<p>No <code>SELECT</code> cabe qualquer expressão, não só nomes de coluna. Com <code>AS</code> você dá um nome à coluna do resultado.</p>
<p>Use <code>SELECT *</code> só para explorar. Em código de produção, liste as colunas: o resultado não muda quando alguém adiciona uma coluna à tabela e o banco trafega menos dados.</p>
<p><b>Aspas:</b> no PostgreSQL, <code>'texto'</code> (simples) é um valor; <code>"Nome"</code> (duplas) é um identificador. Nomes sem aspas viram minúsculos: <code>SELECT Nome</code> procura a coluna <code>nome</code>.</p>`,
      linguagem: 'sql',
      codigo: `SELECT nome AS produto,
       preco,
       preco * 0.9 AS preco_com_desconto,
       'R$ ' || preco AS preco_formatado
FROM produtos;` },
    { titulo: 'DISTINCT olha a linha inteira',
      texto: `<p><code>DISTINCT</code> remove linhas <b>repetidas do resultado</b>. Ele compara todas as colunas selecionadas juntas, não só a primeira.</p>
<p><code>SELECT DISTINCT cidade, nome</code> devolve cada par (cidade, nome) uma vez. Se os nomes são diferentes, a cidade aparece repetida.</p>
<p><b>Sinal de alerta:</b> um <code>DISTINCT</code> colocado para "sumir com duplicatas" muitas vezes esconde um JOIN errado. Vamos ver isso no módulo de joins.</p>`,
      linguagem: 'sql',
      codigo: `-- cidades onde há clientes, cada uma uma vez
SELECT DISTINCT cidade
FROM clientes;

-- PostgreSQL: uma linha por cidade (a primeira pela ordenação)
SELECT DISTINCT ON (cidade) cidade, nome, criado_em
FROM clientes
ORDER BY cidade, criado_em;` },
    { titulo: 'ORDER BY, LIMIT e OFFSET',
      texto: `<p>Uma tabela não tem ordem. Sem <code>ORDER BY</code>, o banco devolve as linhas como achar mais barato, e isso pode mudar entre execuções.</p>
<p><code>ORDER BY preco DESC, nome</code> ordena pelo preço decrescente e desempata pelo nome. No PostgreSQL, <code>NULL</code> vem <b>por último</b> em <code>ASC</code> e primeiro em <code>DESC</code>; troque com <code>NULLS FIRST</code>/<code>NULLS LAST</code>.</p>
<p><code>LIMIT</code> corta o resultado e <code>OFFSET</code> pula linhas. Para paginar, a ordenação precisa ser <b>única</b> (inclua o <code>id</code> no fim), senão um registro pode aparecer em duas páginas ou em nenhuma.</p>
<p><b>No ORM:</b> <code>take</code>/<code>skip</code> do TypeORM e Prisma viram exatamente <code>LIMIT</code>/<code>OFFSET</code>.</p>`,
      linguagem: 'sql',
      codigo: `-- página 3, com 20 produtos por página
SELECT id, nome, preco
FROM produtos
ORDER BY preco DESC, id
LIMIT 20 OFFSET 40;` },
    { titulo: 'A ordem em que o banco pensa',
      texto: `<p>Você escreve <code>SELECT</code> primeiro, mas o banco avalia a consulta em outra ordem lógica:</p>
<p><code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code></p>
<p>Isso explica dois erros clássicos. Um alias criado no <code>SELECT</code> <b>não existe</b> ainda no <code>WHERE</code>: <code>WHERE preco_com_desconto &gt; 50</code> dá <code>column "preco_com_desconto" does not exist</code>. Já no <code>ORDER BY</code> o alias funciona, porque ele roda depois do <code>SELECT</code>.</p>
<p>É uma ordem <b>lógica</b>: o otimizador pode executar fisicamente de outro jeito, mas o resultado é sempre o desta ordem.</p>`,
      linguagem: 'sql',
      codigo: `-- ERRO: o alias ainda não existe no WHERE
SELECT preco * 0.9 AS com_desconto FROM produtos
WHERE com_desconto > 50;

-- OK: repita a expressão no WHERE
SELECT preco * 0.9 AS com_desconto FROM produtos
WHERE preco * 0.9 > 50
ORDER BY com_desconto;  -- aqui o alias vale` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Quantas linhas esta consulta devolve se há 3 clientes em Goiânia (Ana, Bia, Caio) e 2 em Anápolis (Ana, Davi)?',
      codigo: `SELECT DISTINCT cidade, nome FROM clientes;`,
      opcoes: ['2', '4', '5', '3'],
      certa: 2,
      dicas: ['DISTINCT compara todas as colunas selecionadas juntas.', 'Os pares (cidade, nome) são todos diferentes entre si?', '(Goiânia, Ana) e (Anápolis, Ana) são pares diferentes.'],
      explica: 'DISTINCT remove pares repetidos de (cidade, nome). Os 5 pares são distintos, então voltam 5 linhas. A resposta 2 seria de <code>SELECT DISTINCT cidade</code>, e 4 confunde com "nomes distintos".' },
    { tipo: 'escolha',
      pergunta: 'Esta consulta falha. Por quê?',
      codigo: `SELECT preco_unitario * quantidade AS total
FROM itens_pedido
WHERE total > 100;`,
      opcoes: ['O alias total ainda não existe quando o WHERE é avaliado', 'Falta GROUP BY', 'AS não pode ser usado com expressões', 'Precisa escrever "total" entre aspas duplas'],
      certa: 0,
      dicas: ['Pense na ordem lógica de execução.', 'O WHERE roda antes ou depois do SELECT?', 'WHERE vem antes do SELECT, onde o alias nasce.'],
      explica: 'O WHERE é avaliado antes do SELECT, então o alias <code>total</code> ainda não existe: o erro é <code>column "total" does not exist</code>. Repita a expressão no WHERE. Aspas duplas não resolvem, só tornam o nome sensível a maiúsculas.' },
    { tipo: 'completar',
      pergunta: 'Complete para listar os 5 produtos mais caros, desempatando pelo nome:',
      linguagem: 'sql',
      codigo: `SELECT nome, preco
FROM produtos
[[0]] preco [[1]], nome
[[2]] 5;`,
      respostas: [['ORDER BY', 'order by'], ['DESC', 'desc'], ['LIMIT', 'limit']],
      dicas: ['Primeiro ordene, depois corte.', 'Do mais caro para o mais barato é ordem decrescente.', 'ORDER BY ... DESC e LIMIT.'],
      explica: '<code>ORDER BY preco DESC, nome</code> ordena do mais caro para o mais barato e desempata pelo nome. <code>LIMIT 5</code> corta depois da ordenação.' },
    { tipo: 'escolha',
      pergunta: 'Sua API pagina pedidos com a query abaixo e usuários relatam o mesmo pedido em duas páginas. Qual a correção?',
      codigo: `SELECT id, status, criado_em FROM pedidos
ORDER BY status
LIMIT 20 OFFSET 20;`,
      opcoes: ['Ordenar por algo único, como ORDER BY status, id', 'Trocar OFFSET por DISTINCT', 'Remover o ORDER BY', 'Aumentar o LIMIT'],
      certa: 0,
      dicas: ['Muitos pedidos têm o mesmo status.', 'Entre linhas empatadas, a ordem não é garantida.', 'Inclua uma coluna única no ORDER BY.'],
      explica: 'Com muitos empates em <code>status</code>, o banco pode ordenar os empatados de forma diferente a cada execução. Acrescentar <code>id</code> torna a ordem total e a paginação estável. Remover o ORDER BY piora: aí nenhuma ordem é garantida.' },
    { tipo: 'montar',
      pergunta: 'Monte a consulta que lista as cidades dos clientes, cada uma uma vez, em ordem alfabética:',
      certa: ['SELECT', 'DISTINCT', 'cidade', 'FROM', 'clientes', 'ORDER BY', 'cidade'],
      extras: ['GROUP', 'UNIQUE', 'WHERE'],
      dicas: ['Remover repetidas é DISTINCT, logo depois do SELECT.', 'A ordenação vem no fim.', 'SELECT DISTINCT cidade FROM clientes ORDER BY cidade.'],
      explica: '<code>DISTINCT</code> vem logo após <code>SELECT</code> e vale para a linha inteira. <code>UNIQUE</code> é uma restrição de tabela, não uma palavra de consulta.' },
    { tipo: 'escolha',
      pergunta: 'Em <code>ORDER BY criado_em DESC</code> no PostgreSQL, onde ficam os clientes com <code>criado_em</code> nulo?',
      opcoes: ['No começo', 'No fim', 'São excluídos do resultado', 'Em posição aleatória'],
      certa: 0,
      dicas: ['O PostgreSQL trata NULL como maior que qualquer valor na ordenação.', 'Em ASC, NULL vai para o fim. E em DESC?', 'DESC inverte: NULL vai para o começo.'],
      explica: 'No PostgreSQL, NULL ordena como "maior que tudo": fica no fim em ASC e no <b>começo</b> em DESC. Para jogá-los no fim, use <code>ORDER BY criado_em DESC NULLS LAST</code>. ORDER BY nunca exclui linhas.' },
    { tipo: 'montar',
      pergunta: 'Coloque as cláusulas na ordem <b>lógica</b> em que o banco as avalia:',
      certa: ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'],
      extras: [],
      dicas: ['Primeiro o banco precisa saber de onde vêm as linhas.', 'Filtrar linhas vem antes de agrupar; filtrar grupos vem depois.', 'O SELECT só roda depois do HAVING; ORDER BY e LIMIT fecham.'],
      explica: 'FROM monta as linhas, WHERE filtra linhas, GROUP BY agrupa, HAVING filtra grupos, SELECT calcula as colunas, ORDER BY ordena e LIMIT corta. Por isso alias do SELECT não vale no WHERE, mas vale no ORDER BY.' },
    { tipo: 'completar',
      pergunta: 'Complete para mostrar o nome do produto com o rótulo <code>produto</code> e o preço com 10% de aumento como <code>novo_preco</code>:',
      linguagem: 'sql',
      codigo: `SELECT nome [[0]] produto,
       preco * [[1]] AS novo_preco
FROM produtos;`,
      respostas: [['AS', 'as'], ['1.1', '1.10']],
      dicas: ['Alias de coluna usa uma palavra-chave curta.', '10% de aumento é multiplicar por quanto?', 'AS e 1.1.'],
      explica: '<code>AS</code> dá nome à coluna do resultado (ele é opcional, mas deixa claro). Aumentar 10% é multiplicar por <code>1.1</code>.' },
  ],
})

// ---- 02-sql-filtros.js
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

// ---- 03-sql-agregacao.js
MODULOS.push({
  id: 'sql-agregacao',
  titulo: 'Agregação',
  icone: '🧮',
  aprende: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING e FILTER',
  porque: 'Dashboards, relatórios e métricas são agregações, e calcular no banco é muito mais barato do que trazer tudo para o Node.',
  resumo: [
    '<code>COUNT(*)</code> conta linhas; <code>COUNT(coluna)</code> conta valores <b>não nulos</b>',
    '<code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code> ignoram nulos; <code>SUM</code> de nada é <code>NULL</code>',
    'Com <code>GROUP BY</code>, toda coluna do SELECT está no GROUP BY ou dentro de uma agregação',
    '<code>WHERE</code> filtra linhas <b>antes</b> de agrupar; <code>HAVING</code> filtra grupos <b>depois</b>',
    '<code>COUNT(*) FILTER (WHERE status = \'pago\')</code> conta só parte das linhas do grupo',
  ],
  ensino: [
    { titulo: 'COUNT(*) vs COUNT(coluna)',
      texto: `<p>Funções de agregação transformam várias linhas em um valor. <code>COUNT(*)</code> conta <b>linhas</b>. <code>COUNT(cidade)</code> conta só as linhas em que <code>cidade</code> <b>não é nula</b>. <code>COUNT(DISTINCT cidade)</code> conta valores diferentes, sem nulos.</p>
<p><code>SUM</code>, <code>AVG</code>, <code>MIN</code> e <code>MAX</code> também ignoram nulos. Atenção: <code>AVG</code> divide só pelos não nulos, e <code>SUM</code> sobre zero linhas devolve <code>NULL</code>, não 0. Use <code>COALESCE(SUM(...), 0)</code> quando a API espera número.</p>`,
      linguagem: 'sql',
      codigo: `SELECT COUNT(*)               AS clientes,
       COUNT(cidade)          AS com_cidade,
       COUNT(DISTINCT cidade) AS cidades
FROM clientes;

SELECT MIN(preco), MAX(preco), AVG(preco)
FROM produtos;` },
    { titulo: 'GROUP BY: uma linha por grupo',
      texto: `<p><code>GROUP BY</code> junta as linhas com o mesmo valor e devolve <b>uma linha por grupo</b>. As agregações passam a ser calculadas dentro de cada grupo.</p>
<p>Regra: toda coluna do <code>SELECT</code> deve estar no <code>GROUP BY</code> ou dentro de uma agregação. Senão o PostgreSQL reclama: <code>column "produtos.nome" must appear in the GROUP BY clause or be used in an aggregate function</code>. Faz sentido: o grupo "games" tem vários nomes; qual mostrar?</p>
<p>Exceção do PostgreSQL: se você agrupa pela chave primária, pode selecionar as outras colunas da mesma tabela.</p>`,
      linguagem: 'sql',
      codigo: `SELECT categoria,
       COUNT(*)   AS produtos,
       AVG(preco) AS preco_medio
FROM produtos
GROUP BY categoria
ORDER BY produtos DESC;` },
    { titulo: 'WHERE vs HAVING',
      texto: `<p>Lembre a ordem: <code>FROM → WHERE → GROUP BY → HAVING → SELECT</code>.</p>
<p><code>WHERE</code> filtra <b>linhas</b> antes de agrupar e não pode usar agregação: <code>WHERE COUNT(*) &gt; 5</code> dá <code>aggregate functions are not allowed in WHERE</code>. <code>HAVING</code> filtra <b>grupos</b> depois de agrupar e é onde a agregação entra.</p>
<p>Filtro que não depende de agregação vai no <code>WHERE</code>: ele descarta linhas cedo e o agrupamento fica menor.</p>`,
      linguagem: 'sql',
      codigo: `-- clientes com mais de 5 pedidos pagos
SELECT cliente_id, COUNT(*) AS pedidos_pagos
FROM pedidos
WHERE status = 'pago'      -- linhas
GROUP BY cliente_id
HAVING COUNT(*) > 5;       -- grupos` },
    { titulo: 'FILTER: várias contagens numa passada',
      texto: `<p>Quer, por cliente, o total de pedidos e quantos foram cancelados? Um <code>WHERE</code> cortaria as outras linhas. No PostgreSQL, <code>FILTER (WHERE ...)</code> restringe só aquela agregação.</p>
<p>Em outros bancos o equivalente é <code>SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END)</code>. O <code>FILTER</code> é mais legível e faz o mesmo.</p>`,
      linguagem: 'sql',
      codigo: `SELECT cliente_id,
       COUNT(*)                                       AS total,
       COUNT(*) FILTER (WHERE status = 'cancelado')   AS cancelados,
       COUNT(*) FILTER (WHERE status = 'pago')        AS pagos
FROM pedidos
GROUP BY cliente_id;` },
    { titulo: 'Somando valores de pedidos',
      texto: `<p>O valor de um pedido não é coluna: é a soma de <code>quantidade * preco_unitario</code> dos itens. A agregação aceita qualquer expressão.</p>
<p><b>No ORM:</b> o <code>groupBy</code> do Prisma e o <code>QueryBuilder</code> do TypeORM geram exatamente este SQL. Quando o relatório fica complexo, escrever a query na mão costuma ser mais claro.</p>`,
      linguagem: 'sql',
      codigo: `SELECT pedido_id,
       SUM(quantidade * preco_unitario) AS valor_total,
       SUM(quantidade)                  AS unidades
FROM itens_pedido
GROUP BY pedido_id
HAVING SUM(quantidade * preco_unitario) >= 500;` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'A tabela <code>clientes</code> tem 100 linhas, e 20 delas têm <code>cidade</code> nula. O que esta consulta devolve?',
      codigo: `SELECT COUNT(*), COUNT(cidade) FROM clientes;`,
      opcoes: ['100 e 80', '100 e 100', '80 e 80', '100 e 20'],
      certa: 0,
      dicas: ['COUNT(*) conta linhas.', 'COUNT(coluna) pula alguma coisa.', 'Ele pula os nulos.'],
      explica: '<code>COUNT(*)</code> conta todas as 100 linhas; <code>COUNT(cidade)</code> conta só os 80 valores não nulos. Confundir os dois é uma fonte clássica de métrica errada.' },
    { tipo: 'escolha',
      pergunta: 'Por que esta consulta falha?',
      codigo: `SELECT categoria, nome, COUNT(*)
FROM produtos
GROUP BY categoria;`,
      opcoes: ['nome não está no GROUP BY nem em uma agregação', 'COUNT(*) não pode ser usado com GROUP BY', 'Falta HAVING', 'Falta ORDER BY'],
      certa: 0,
      dicas: ['Cada grupo vira uma linha.', 'O grupo "games" tem vários nomes. Qual mostrar?', 'Toda coluna não agregada precisa estar no GROUP BY.'],
      explica: 'O PostgreSQL responde <code>column "produtos.nome" must appear in the GROUP BY clause or be used in an aggregate function</code>. Ou você agrupa também por nome, ou agrega (ex.: <code>MAX(nome)</code>, <code>STRING_AGG(nome, \', \')</code>). HAVING é opcional.' },
    { tipo: 'escolha',
      pergunta: 'Você quer as categorias com mais de 10 produtos. Onde vai <code>COUNT(*) &gt; 10</code>?',
      opcoes: ['No HAVING', 'No WHERE', 'No GROUP BY', 'No ORDER BY'],
      certa: 0,
      dicas: ['A condição depende de uma agregação.', 'O WHERE roda antes de agrupar.', 'Filtro sobre grupos é HAVING.'],
      explica: 'A contagem só existe depois do agrupamento, então o filtro vai no <code>HAVING</code>. No WHERE o PostgreSQL dá <code>aggregate functions are not allowed in WHERE</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete para listar clientes que fizeram 3 ou mais pedidos em 2026:',
      linguagem: 'sql',
      codigo: `SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
[[0]] criado_em >= '2026-01-01'
[[1]] cliente_id
[[2]] COUNT(*) >= 3;`,
      respostas: [['WHERE', 'where'], ['GROUP BY', 'group by'], ['HAVING', 'having']],
      dicas: ['O filtro de data é sobre linhas; o de contagem é sobre grupos.', 'Linhas: WHERE. Agrupar: GROUP BY.', 'WHERE, GROUP BY, HAVING.'],
      explica: 'A data filtra linhas antes de agrupar (<code>WHERE</code>), o <code>GROUP BY</code> forma um grupo por cliente e o <code>HAVING</code> filtra os grupos pela contagem.' },
    { tipo: 'escolha',
      pergunta: 'O cliente 42 não tem nenhum pedido pago. O que esta consulta devolve?',
      codigo: `SELECT SUM(i.quantidade * i.preco_unitario)
FROM pedidos p JOIN itens_pedido i ON i.pedido_id = p.id
WHERE p.cliente_id = 42 AND p.status = 'pago';`,
      opcoes: ['NULL', '0', 'Nenhuma linha', 'Erro: divisão por zero'],
      certa: 0,
      dicas: ['Sem GROUP BY, a agregação sempre devolve uma linha.', 'Quanto é a soma de um conjunto vazio no SQL?', 'SUM de zero linhas não é zero.'],
      explica: 'Uma agregação sem GROUP BY sempre devolve uma linha, e <code>SUM</code> de conjunto vazio é <code>NULL</code>. Use <code>COALESCE(SUM(...), 0)</code> se a API espera 0. Já <code>COUNT</code> de vazio é 0.' },
    { tipo: 'completar',
      pergunta: 'Complete para contar, por cliente, o total de pedidos e quantos foram cancelados, numa consulta só (PostgreSQL):',
      linguagem: 'sql',
      codigo: `SELECT cliente_id,
       COUNT(*) AS total,
       COUNT(*) [[0]] ([[1]] status = 'cancelado') AS cancelados
FROM pedidos
GROUP BY cliente_id;`,
      respostas: [['FILTER', 'filter'], ['WHERE', 'where']],
      dicas: ['Um WHERE normal cortaria as linhas do total.', 'O PostgreSQL tem uma cláusula que se aplica a uma agregação só.', 'FILTER (WHERE ...).'],
      explica: '<code>FILTER (WHERE ...)</code> restringe só aquela agregação; o <code>COUNT(*)</code> do total continua vendo todas as linhas do grupo.' },
    { tipo: 'montar',
      pergunta: 'Monte a consulta do preço médio por categoria:',
      certa: ['SELECT', 'categoria,', 'AVG(preco)', 'FROM', 'produtos', 'GROUP BY', 'categoria'],
      extras: ['HAVING', 'COUNT(preco)', 'WHERE'],
      dicas: ['Uma linha por categoria pede GROUP BY.', 'Média é AVG.', 'SELECT categoria, AVG(preco) FROM produtos GROUP BY categoria.'],
      explica: '<code>GROUP BY categoria</code> forma os grupos e <code>AVG(preco)</code> calcula a média de cada um. Não há filtro, então nem WHERE nem HAVING.' },
    { tipo: 'escolha',
      pergunta: 'A coluna <code>nota</code> tem valores 10, 8 e NULL em três linhas. Quanto dá <code>AVG(nota)</code>?',
      opcoes: ['9', '6', 'NULL', 'Erro'],
      certa: 0,
      dicas: ['Agregações ignoram nulos.', 'A divisão é por quantas linhas?', '(10 + 8) / 2.'],
      explica: 'AVG ignora o NULL: soma 18 e divide por 2, dando 9. Se o nulo devesse contar como zero, seria <code>AVG(COALESCE(nota, 0))</code> = 6.' },
  ],
})

// ---- 04-sql-joins.js
MODULOS.push({
  id: 'sql-joins',
  titulo: 'JOINs',
  icone: '🔗',
  aprende: 'INNER e LEFT JOIN, filtro no ON vs WHERE, anti-join, auto-join e duplicação em 1:N',
  porque: 'Quase toda tela junta tabelas, e um JOIN errado infla totais ou some com registros sem dar erro nenhum.',
  resumo: [
    '<code>INNER JOIN</code> só mantém pares que casam; <code>LEFT JOIN</code> mantém todas as linhas da esquerda',
    'No LEFT JOIN, sem par, as colunas da direita vêm <code>NULL</code>',
    'Filtro da tabela da direita no <code>WHERE</code> transforma o LEFT em INNER; coloque-o no <code>ON</code>',
    'Anti-join: <code>LEFT JOIN ... WHERE direita.id IS NULL</code> ou <code>NOT EXISTS</code>',
    'Juntar com uma tabela 1:N <b>multiplica</b> as linhas: cuidado ao somar depois',
    'Auto-join: a mesma tabela duas vezes, com aliases diferentes',
  ],
  ensino: [
    { titulo: 'INNER JOIN: só o que casa',
      texto: `<p><code>JOIN</code> (ou <code>INNER JOIN</code>) combina cada linha da esquerda com as linhas da direita que satisfazem o <code>ON</code>. Linha sem par some dos dois lados.</p>
<p>Use aliases curtos (<code>c</code>, <code>p</code>) e prefixe as colunas: <code>id</code> e <code>criado_em</code> existem nas duas tabelas, e sem prefixo o PostgreSQL dá <code>column reference "id" is ambiguous</code>.</p>
<p><b>No TypeORM:</b> <code>innerJoinAndSelect('p.cliente', 'c')</code> gera este SQL. <code>relations: ['cliente']</code> no <code>find</code> gera um LEFT JOIN.</p>`,
      linguagem: 'sql',
      codigo: `SELECT p.id AS pedido, c.nome, p.status
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;` },
    { titulo: 'LEFT JOIN e o filtro no lugar errado',
      texto: `<p><code>LEFT JOIN</code> mantém <b>todas</b> as linhas da tabela da esquerda. Sem par, as colunas da direita vêm <code>NULL</code>.</p>
<p>A armadilha: colocar um filtro da tabela da direita no <code>WHERE</code>. As linhas sem par têm <code>p.status</code> nulo, <code>NULL = 'pago'</code> não é verdadeiro e o <code>WHERE</code> as descarta: o LEFT virou INNER sem você perceber.</p>
<p>Para "todos os clientes, com seus pedidos pagos, se houver", o filtro vai no <code>ON</code>: ele decide <b>quais linhas casam</b>, não quais sobrevivem.</p>`,
      linguagem: 'sql',
      codigo: `-- ERRADO: some quem não tem pedido pago
SELECT c.nome, p.id
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status = 'pago';

-- CERTO: todos os clientes; p.id nulo se não houver pedido pago
SELECT c.nome, p.id
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.status = 'pago';` },
    { titulo: 'Anti-join: quem não tem',
      texto: `<p>"Clientes que nunca compraram" é um <b>anti-join</b>. Duas formas seguras:</p>
<ul>
<li><code>LEFT JOIN</code> e manter só quem ficou sem par: <code>WHERE p.id IS NULL</code> (teste uma coluna que nunca é nula quando há par, como a chave primária)</li>
<li><code>NOT EXISTS</code> com subconsulta correlacionada</li>
</ul>
<p>O PostgreSQL costuma executar as duas com o mesmo plano. Evite <code>NOT IN (subconsulta)</code>: um único <code>NULL</code> na subconsulta zera o resultado.</p>`,
      linguagem: 'sql',
      codigo: `SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;

SELECT c.id, c.nome
FROM clientes c
WHERE NOT EXISTS (
  SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id
);` },
    { titulo: 'O JOIN que multiplica linhas',
      texto: `<p>Um pedido tem vários itens (1:N). Ao juntar <code>pedidos</code> com <code>itens_pedido</code>, cada pedido aparece <b>uma vez por item</b>. Isso é correto, mas qualquer coluna do pedido somada depois fica multiplicada.</p>
<p>Pior: juntar duas tabelas 1:N ao mesmo tempo (ex.: itens e pagamentos) gera o produto das duas, e os dois totais saem inflados.</p>
<p><b>Como reconhecer:</b> o total do relatório está maior que o real, ou alguém colocou <code>DISTINCT</code> "para resolver". A correção é agregar <b>antes</b> de juntar (subconsulta ou CTE) ou contar com <code>COUNT(DISTINCT ...)</code>.</p>`,
      linguagem: 'sql',
      codigo: `-- cliente com 2 pedidos de 3 itens cada: COUNT(*) dá 6, não 2
SELECT c.nome, COUNT(*) AS pedidos  -- errado
FROM clientes c
JOIN pedidos p      ON p.cliente_id = c.id
JOIN itens_pedido i ON i.pedido_id = p.id
GROUP BY c.id, c.nome;

-- contar pedidos de verdade
SELECT c.nome, COUNT(DISTINCT p.id) AS pedidos
FROM clientes c
JOIN pedidos p      ON p.cliente_id = c.id
JOIN itens_pedido i ON i.pedido_id = p.id
GROUP BY c.id, c.nome;` },
    { titulo: 'Auto-join: a tabela com ela mesma',
      texto: `<p>Às vezes a comparação é entre linhas da <b>mesma</b> tabela: produtos da mesma categoria, funcionário e gerente, pedidos do mesmo cliente. Basta usar a tabela duas vezes com aliases diferentes.</p>
<p>Use <code>a.id &lt; b.id</code> em vez de <code>&lt;&gt;</code> para não gerar cada par duas vezes (A,B e B,A).</p>`,
      linguagem: 'sql',
      codigo: `-- pares de clientes da mesma cidade
SELECT a.nome, b.nome, a.cidade
FROM clientes a
JOIN clientes b ON b.cidade = a.cidade
               AND a.id < b.id;` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Você queria todos os clientes, com seus pedidos pagos quando houver. Mas os clientes sem pedido pago sumiram. Por quê?',
      codigo: `SELECT c.nome, p.id
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status = 'pago';`,
      opcoes: ["O filtro p.status = 'pago' no WHERE descarta as linhas em que p é NULL", 'LEFT JOIN não funciona com WHERE', 'Faltou trocar para RIGHT JOIN', 'Faltou GROUP BY c.nome'],
      certa: 0,
      dicas: ['O que aparece em p.status para um cliente sem par?', "NULL = 'pago' é verdadeiro?", 'Mova a condição para o ON.'],
      explica: "Sem par, <code>p.status</code> é NULL, a comparação não é verdadeira e o WHERE descarta a linha. Na prática virou um INNER JOIN. Com <code>AND p.status = 'pago'</code> no ON, o cliente fica com <code>p.id</code> nulo." },
    { tipo: 'completar',
      pergunta: 'Complete o anti-join para listar produtos que nunca foram vendidos:',
      linguagem: 'sql',
      codigo: `SELECT pr.id, pr.nome
FROM produtos pr
[[0]] JOIN itens_pedido i ON i.produto_id = pr.id
WHERE i.produto_id [[1]];`,
      respostas: [['LEFT', 'left'], ['IS NULL', 'is null']],
      dicas: ['Os produtos sem venda precisam continuar no resultado.', 'Depois, mantenha só os que ficaram sem par.', 'LEFT JOIN ... IS NULL.'],
      explica: 'O LEFT JOIN mantém todos os produtos; os que não casaram com nenhum item ficam com as colunas de <code>i</code> nulas, e <code>IS NULL</code> filtra só esses.' },
    { tipo: 'escolha',
      pergunta: 'A cliente Ana tem 2 pedidos, um com 3 itens e outro com 1 item. Quanto dá a contagem dela?',
      codigo: `SELECT c.nome, COUNT(*) AS pedidos
FROM clientes c
JOIN pedidos p      ON p.cliente_id = c.id
JOIN itens_pedido i ON i.pedido_id = p.id
GROUP BY c.id, c.nome;`,
      opcoes: ['4', '2', '6', '3'],
      certa: 0,
      dicas: ['Depois do segundo JOIN, quantas linhas cada pedido gera?', 'Um pedido aparece uma vez por item.', '3 + 1.'],
      explica: 'O JOIN com itens gera uma linha por item: 3 + 1 = 4 linhas para a Ana, e <code>COUNT(*)</code> conta linhas. Para contar pedidos use <code>COUNT(DISTINCT p.id)</code>, que dá 2.' },
    { tipo: 'escolha',
      pergunta: 'Qual consulta lista <b>todos</b> os clientes e o total de pedidos de cada um, mostrando 0 para quem nunca comprou?',
      opcoes: [
        'SELECT c.nome, COUNT(p.id) FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id GROUP BY c.id, c.nome',
        'SELECT c.nome, COUNT(*) FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id GROUP BY c.id, c.nome',
        'SELECT c.nome, COUNT(p.id) FROM clientes c JOIN pedidos p ON p.cliente_id = c.id GROUP BY c.id, c.nome',
      ],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['Quem nunca comprou precisa sobreviver ao JOIN.', 'Com LEFT JOIN, o cliente sem pedido ainda gera uma linha.', 'COUNT(*) conta essa linha; COUNT(p.id) não conta o NULL.'],
      explica: 'O LEFT JOIN mantém os clientes sem pedido, numa linha com <code>p.id</code> nulo. <code>COUNT(p.id)</code> ignora o nulo e dá 0; <code>COUNT(*)</code> contaria essa linha e daria 1. O INNER JOIN some com esses clientes.' },
    { tipo: 'montar',
      pergunta: 'Monte o join que traz o nome do cliente de cada pedido:',
      certa: ['FROM', 'pedidos p', 'JOIN', 'clientes c', 'ON', 'c.id = p.cliente_id'],
      extras: ['WHERE', 'c.id = p.id', 'USING'],
      dicas: ['A condição liga a chave estrangeira à chave primária.', 'pedidos.cliente_id aponta para clientes.id.', 'FROM pedidos p JOIN clientes c ON c.id = p.cliente_id.'],
      explica: 'A chave estrangeira <code>p.cliente_id</code> casa com a chave primária <code>c.id</code>. Ligar <code>c.id = p.id</code> compara ids de entidades diferentes e casa pedidos com clientes aleatórios.' },
    { tipo: 'completar',
      pergunta: 'Complete para listar clientes que nunca fizeram pedido, sem usar JOIN:',
      linguagem: 'sql',
      codigo: `SELECT c.nome
FROM clientes c
WHERE [[0]] (
  SELECT 1 FROM pedidos p WHERE p.cliente_id = [[1]]
);`,
      respostas: [['NOT EXISTS', 'not exists'], ['c.id']],
      dicas: ['Uma subconsulta que só verifica se existe alguma linha.', 'A subconsulta precisa se referir ao cliente da linha de fora.', 'NOT EXISTS e c.id.'],
      explica: '<code>NOT EXISTS</code> é verdadeiro quando a subconsulta correlacionada não acha nenhum pedido daquele cliente. Diferente de <code>NOT IN</code>, não sofre com NULL.' },
    { tipo: 'escolha',
      pergunta: 'Para listar pares de produtos da mesma categoria sem repetir (A,B e B,A), qual condição de junção usar?',
      codigo: `SELECT a.nome, b.nome
FROM produtos a
JOIN produtos b ON b.categoria = a.categoria AND ???;`,
      opcoes: ['a.id < b.id', 'a.id <> b.id', 'a.id = b.id', 'a.nome <> b.nome'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['O produto não pode formar par consigo mesmo.', 'Com &lt;&gt;, cada par aparece em duas ordens.', 'Exija uma ordem entre os ids.'],
      explica: '<code>a.id &lt; b.id</code> exclui o par do produto consigo mesmo e mantém só uma das ordens. Com <code>&lt;&gt;</code>, (A,B) e (B,A) aparecem os dois. Comparar nomes falha se houver nomes iguais.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: seu relatório de faturamento por cliente está com valores maiores que o real. Como você investigaria?',
      avalia: 'Se você reconhece a duplicação de linhas por JOIN 1:N e sabe corrigir sem recorrer a DISTINCT às cegas.',
      resposta: `<p>Primeiro suspeito de um JOIN 1:N multiplicando linhas. Se a query junta pedidos com itens e também com outra tabela 1:N, como pagamentos, cada item é repetido por pagamento e a soma infla.</p>
<p>Para confirmar, rodo a query sem o GROUP BY para um cliente conhecido e conto as linhas por pedido, ou comparo <code>COUNT(*)</code> com <code>COUNT(DISTINCT p.id)</code>. A correção é agregar cada tabela filha antes de juntar, numa subconsulta ou CTE, e juntar os totais já resumidos. Não uso DISTINCT para mascarar, porque ele pode remover valores legítimos iguais.</p>`,
      pontos: ['JOIN 1:N duplica linhas', 'Duas tabelas filhas geram produto cartesiano', 'Verificar contando linhas por chave', 'Agregar antes de juntar (subconsulta/CTE)', 'DISTINCT não é correção'],
      evitar: ['Resolver com DISTINCT no SELECT sem entender', 'Culpar o banco ou o ORM sem olhar o SQL gerado'],
      dicas: ['Pense no que acontece com um pedido de 3 itens após o JOIN.', 'Como você provaria a duplicação?'] },
  ],
})

// ---- 05-sql-avancado.js
MODULOS.push({
  id: 'sql-avancado',
  titulo: 'Subconsultas, CTEs e janelas',
  icone: '🪟',
  aprende: 'subconsultas, EXISTS, CTE com WITH, window functions (ROW_NUMBER, RANK, SUM OVER) e EXPLAIN',
  porque: 'Ranking, top-N por grupo e totais acumulados viram uma query só, em vez de loops no Node e N consultas ao banco.',
  resumo: [
    'Subconsulta escalar devolve <b>um</b> valor; em <code>FROM</code>, vira uma tabela temporária',
    '<code>EXISTS</code> para no primeiro resultado e não sofre com NULL',
    '<code>WITH nome AS (...)</code> dá nome a um passo da consulta',
    'Window function calcula por linha <b>sem</b> colapsar as linhas: <code>OVER (PARTITION BY ... ORDER BY ...)</code>',
    '<code>ROW_NUMBER</code> 1,2,3,4; <code>RANK</code> 1,1,3,4; <code>DENSE_RANK</code> 1,1,2,3',
    'Window function não vale no <code>WHERE</code>: filtre numa CTE ou subconsulta por fora',
    '<code>EXPLAIN</code> mostra o plano; <code>EXPLAIN ANALYZE</code> <b>executa</b> a consulta',
  ],
  ensino: [
    { titulo: 'Subconsultas e EXISTS',
      texto: `<p>Uma subconsulta é um <code>SELECT</code> dentro de outro. Ela aparece em três lugares comuns:</p>
<ul>
<li><b>Escalar</b>, devolvendo um valor: <code>WHERE preco &gt; (SELECT AVG(preco) FROM produtos)</code>. Se devolver mais de uma linha, dá <code>more than one row returned by a subquery used as an expression</code>.</li>
<li><b>Lista</b>, com <code>IN</code>.</li>
<li><b>No FROM</b>, como tabela derivada (precisa de alias).</li>
</ul>
<p><code>EXISTS (subconsulta)</code> é verdadeiro se a subconsulta devolve ao menos uma linha. As colunas não importam, por isso o costume de <code>SELECT 1</code>. Quando ela usa colunas da consulta de fora, é <b>correlacionada</b>.</p>`,
      linguagem: 'sql',
      codigo: `-- produtos acima da média
SELECT nome, preco FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);

-- clientes com pelo menos um pedido cancelado
SELECT c.nome FROM clientes c
WHERE EXISTS (
  SELECT 1 FROM pedidos p
  WHERE p.cliente_id = c.id AND p.status = 'cancelado'
);` },
    { titulo: 'CTE: WITH dá nome aos passos',
      texto: `<p>Uma CTE (<i>common table expression</i>) é uma subconsulta com nome, declarada antes da consulta principal com <code>WITH</code>. Ela lê de cima para baixo, como variáveis numa função.</p>
<p>É o jeito limpo de <b>agregar antes de juntar</b> e evitar a duplicação do módulo anterior. Dá para encadear várias CTEs separadas por vírgula.</p>
<p>Desde o PostgreSQL 12, CTEs simples são incorporadas à consulta pelo otimizador, então não custam mais que a subconsulta equivalente. <code>WITH RECURSIVE</code> existe para hierarquias, mas fica fora daqui.</p>`,
      linguagem: 'sql',
      codigo: `WITH totais AS (
  SELECT pedido_id, SUM(quantidade * preco_unitario) AS valor
  FROM itens_pedido
  GROUP BY pedido_id
)
SELECT p.cliente_id, SUM(t.valor) AS faturamento
FROM pedidos p
JOIN totais t ON t.pedido_id = p.id
WHERE p.status = 'pago'
GROUP BY p.cliente_id;` },
    { titulo: 'Window functions: agregar sem colapsar',
      texto: `<p><code>GROUP BY</code> transforma muitas linhas em uma. Uma <b>window function</b> calcula sobre um conjunto de linhas, mas <b>mantém cada linha</b> no resultado.</p>
<p><code>OVER (PARTITION BY cliente_id)</code> define a "janela": as linhas do mesmo cliente. Com <code>ORDER BY</code> dentro do <code>OVER</code>, o <code>SUM</code> vira <b>acumulado</b> até a linha atual.</p>
<p>A janela roda depois do <code>GROUP BY</code>, então dá até para acumular uma agregação, como no segundo exemplo.</p>
<p>Detalhe: o quadro padrão com <code>ORDER BY</code> é <code>RANGE</code>, então linhas empatadas na ordenação entram juntas no acumulado. Ordene por algo único (ex.: <code>criado_em, id</code>) para um acumulado linha a linha.</p>`,
      linguagem: 'sql',
      codigo: `SELECT id, cliente_id, criado_em,
       COUNT(*) OVER (PARTITION BY cliente_id) AS pedidos_do_cliente,
       ROW_NUMBER() OVER (PARTITION BY cliente_id
                          ORDER BY criado_em, id) AS n_do_pedido
FROM pedidos;

-- pedidos por dia e total acumulado
SELECT criado_em::date AS dia,
       COUNT(*) AS pedidos,
       SUM(COUNT(*)) OVER (ORDER BY criado_em::date) AS acumulado
FROM pedidos
GROUP BY criado_em::date;` },
    { titulo: 'ROW_NUMBER, RANK e top-N por grupo',
      texto: `<p>Com preços 100, 100, 80, 50 em ordem decrescente:</p>
<ul>
<li><code>ROW_NUMBER()</code>: 1, 2, 3, 4 (empate desempatado arbitrariamente)</li>
<li><code>RANK()</code>: 1, 1, 3, 4 (pula posições)</li>
<li><code>DENSE_RANK()</code>: 1, 1, 2, 3 (não pula)</li>
</ul>
<p>Window functions são calculadas na fase do <code>SELECT</code>, depois do <code>WHERE</code>. Por isso <code>WHERE ROW_NUMBER() OVER (...) &lt;= 3</code> dá <code>window functions are not allowed in WHERE</code>. Calcule numa CTE e filtre por fora.</p>`,
      linguagem: 'sql',
      codigo: `-- os 3 produtos mais caros de cada categoria
WITH ranqueados AS (
  SELECT categoria, nome, preco,
         ROW_NUMBER() OVER (PARTITION BY categoria
                            ORDER BY preco DESC, id) AS pos
  FROM produtos
)
SELECT categoria, nome, preco
FROM ranqueados
WHERE pos <= 3;` },
    { titulo: 'EXPLAIN: como o banco vai executar',
      texto: `<p><code>EXPLAIN</code> mostra o plano sem executar: <code>Seq Scan</code> (lê a tabela toda), <code>Index Scan</code> (usa índice), tipo de junção (<code>Nested Loop</code>, <code>Hash Join</code>) e custos <b>estimados</b>.</p>
<p><code>EXPLAIN ANALYZE</code> <b>executa de verdade</b> e mostra tempos e linhas reais. Compare <code>rows</code> estimado com o real: diferença grande indica estatísticas desatualizadas (<code>ANALYZE tabela</code>). Cuidado: em <code>UPDATE</code>/<code>DELETE</code>, rode dentro de <code>BEGIN ... ROLLBACK</code>.</p>
<p>Seq Scan nem sempre é ruim: em tabela pequena, ou quando a consulta traz boa parte das linhas, ler tudo é mais barato que ir pelo índice.</p>`,
      linguagem: 'sql',
      codigo: `EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 42;

-- Index Scan using idx_pedidos_cliente on pedidos
--   (cost=0.29..8.31 rows=5 width=40)
--   (actual time=0.020..0.025 rows=4 loops=1)` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Produtos com preços 100, 100, 80, 50 ordenados do mais caro. Qual coluna fica com os valores 1, 1, 3, 4?',
      opcoes: ['RANK() OVER (ORDER BY preco DESC)', 'ROW_NUMBER() OVER (ORDER BY preco DESC)', 'DENSE_RANK() OVER (ORDER BY preco DESC)', 'COUNT(*) OVER (ORDER BY preco DESC)'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['Empatados recebem a mesma posição.', 'Depois do empate, a numeração pula.', 'É como pódio olímpico: dois primeiros, nenhum segundo.'],
      explica: 'RANK dá a mesma posição aos empatados e pula as seguintes (1, 1, 3, 4). DENSE_RANK não pula (1, 1, 2, 3) e ROW_NUMBER nunca repete (1, 2, 3, 4).' },
    { tipo: 'escolha',
      pergunta: 'Por que esta consulta falha?',
      codigo: `SELECT categoria, nome,
       ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC) AS pos
FROM produtos
WHERE pos <= 3;`,
      opcoes: ['A window function é calculada depois do WHERE, então pos não existe ali', 'ROW_NUMBER exige GROUP BY', 'PARTITION BY não aceita texto', 'Falta HAVING pos <= 3'],
      certa: 0,
      dicas: ['Lembre a ordem lógica de execução.', 'Em que fase as window functions são calculadas?', 'Calcule numa CTE e filtre por fora.'],
      explica: 'Window functions são avaliadas na fase do SELECT, depois do WHERE e do HAVING. O caminho é calcular <code>pos</code> numa CTE ou subconsulta e filtrar <code>WHERE pos &lt;= 3</code> na consulta de fora. HAVING também roda antes das janelas.' },
    { tipo: 'completar',
      pergunta: 'Complete para pegar o pedido mais recente de cada cliente:',
      linguagem: 'sql',
      codigo: `WITH ordenados AS (
  SELECT id, cliente_id, criado_em,
         ROW_NUMBER() OVER ([[0]] cliente_id
                            ORDER BY criado_em [[1]]) AS n
  FROM pedidos
)
SELECT id, cliente_id, criado_em
FROM ordenados
WHERE n = [[2]];`,
      respostas: [['PARTITION BY', 'partition by'], ['DESC', 'desc'], ['1']],
      dicas: ['A numeração recomeça a cada cliente.', 'O mais recente precisa ser o número 1.', 'PARTITION BY, DESC e 1.'],
      explica: '<code>PARTITION BY cliente_id</code> reinicia a numeração por cliente, <code>ORDER BY criado_em DESC</code> põe o mais recente em primeiro e <code>n = 1</code> pega só ele. (No PostgreSQL, <code>DISTINCT ON</code> também resolve.)' },
    { tipo: 'escolha',
      pergunta: 'Quantas linhas esta consulta devolve se <code>pedidos</code> tem 500 linhas de 80 clientes?',
      codigo: `SELECT id, cliente_id,
       COUNT(*) OVER (PARTITION BY cliente_id) AS total_cliente
FROM pedidos;`,
      opcoes: ['500', '80', '1', 'Erro: falta GROUP BY'],
      certa: 0,
      dicas: ['Window function colapsa linhas?', 'Diferente do GROUP BY, ela mantém cada linha.', 'Uma linha por pedido.'],
      explica: 'A window function calcula a contagem por cliente mas mantém todas as 500 linhas; cada uma ganha o total do seu cliente. Com <code>GROUP BY cliente_id</code> seriam 80.' },
    { tipo: 'montar',
      pergunta: 'Uma CTE tem as colunas <code>dia</code> e <code>valor</code> (faturamento do dia). Monte a coluna de faturamento acumulado:',
      certa: ['SUM(valor)', 'OVER', '(', 'ORDER BY', 'dia', ')'],
      extras: ['GROUP BY', 'PARTITION', 'HAVING'],
      dicas: ['É uma agregação usada como window function.', 'O acumulado precisa de uma ordem dentro da janela.', 'SUM(valor) OVER (ORDER BY dia).'],
      explica: 'Com <code>ORDER BY</code> dentro do <code>OVER</code>, o quadro vai do início até a linha atual e o <code>SUM</code> vira total acumulado. Sem o ORDER BY, todas as linhas mostrariam o total geral.' },
    { tipo: 'escolha',
      pergunta: 'Você quer ver o plano e o tempo real de um <code>DELETE</code> pesado sem apagar nada. O que fazer?',
      opcoes: ['BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;', 'EXPLAIN ANALYZE DELETE ... direto, pois EXPLAIN nunca executa', 'EXPLAIN DELETE ... mostra o tempo real', 'Não é possível analisar um DELETE'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['EXPLAIN sozinho não mostra tempo real.', 'ANALYZE executa o comando de verdade.', 'Envolva numa transação que você desfaz.'],
      explica: '<code>EXPLAIN ANALYZE</code> executa o comando para medir, então o DELETE apagaria as linhas. Dentro de uma transação com ROLLBACK, você mede e desfaz. <code>EXPLAIN</code> sozinho só estima.' },
    { tipo: 'completar',
      pergunta: 'Complete para listar produtos mais caros que a média da própria tabela:',
      linguagem: 'sql',
      codigo: `SELECT nome, preco
FROM produtos
WHERE preco > ([[0]] [[1]](preco) FROM produtos);`,
      respostas: [['SELECT', 'select'], ['AVG', 'avg']],
      dicas: ['A média precisa ser calculada antes da comparação.', 'Use uma subconsulta escalar.', 'SELECT AVG(preco).'],
      explica: 'A subconsulta escalar <code>(SELECT AVG(preco) FROM produtos)</code> devolve um único valor que o WHERE usa. <code>WHERE preco &gt; AVG(preco)</code> direto daria erro: agregação não é permitida no WHERE.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: qual a diferença entre GROUP BY e window function, e quando usar cada uma?',
      avalia: 'Se você entende que a janela mantém as linhas e sabe aplicar em casos reais como ranking e top-N por grupo.',
      resposta: `<p>GROUP BY colapsa as linhas: cada grupo vira uma linha e só sobram as colunas agrupadas e as agregações. Uma window function calcula sobre um conjunto de linhas definido no OVER, mas devolve um valor para cada linha, sem colapsar.</p>
<p>Uso GROUP BY para relatórios de totais. Uso janela quando preciso do detalhe junto com o contexto: percentual de cada pedido no total do cliente, total acumulado, ranking com ROW_NUMBER ou RANK, e top-N por grupo. Como janelas são calculadas depois do WHERE, para filtrar pelo ranking eu calculo numa CTE e filtro por fora.</p>`,
      pontos: ['GROUP BY colapsa, janela mantém linhas', 'OVER com PARTITION BY e ORDER BY', 'Exemplo: ranking ou acumulado', 'Top-N por grupo com CTE', 'Não dá para filtrar janela no WHERE'],
      evitar: ['Dizer que window function é só um GROUP BY mais rápido'],
      dicas: ['Compare o número de linhas do resultado nos dois casos.', 'Dê um exemplo de negócio.'] },
  ],
})

// ---- 06-sql-modelagem.js
MODULOS.push({
  id: 'sql-modelagem',
  titulo: 'Tabelas, índices e transações',
  icone: '🏗️',
  aprende: 'CREATE TABLE, tipos, chaves, restrições, índices (inclusive compostos) e transações',
  porque: 'Restrições no banco seguram dados ruins que escapam da validação da API, e o índice certo transforma segundos em milissegundos.',
  resumo: [
    'Dinheiro é <code>numeric(10,2)</code>, nunca <code>float</code>; data e hora é <code>timestamptz</code>',
    '<code>PRIMARY KEY</code> = único + não nulo; <code>FOREIGN KEY</code> garante que a referência existe',
    'O PostgreSQL <b>não</b> cria índice na coluna da chave estrangeira sozinho',
    'Índice composto <code>(a, b)</code> serve para filtros em <code>a</code> ou em <code>a</code> e <code>b</code>, mas não só em <code>b</code>',
    '<code>BEGIN</code> ... <code>COMMIT</code> aplica tudo; <code>ROLLBACK</code> desfaz tudo',
    'Normalizar: cada fato guardado em <b>um</b> lugar só',
  ],
  ensino: [
    { titulo: 'CREATE TABLE e tipos',
      texto: `<p>Escolher o tipo certo evita bugs que nenhum teste pega:</p>
<ul>
<li><code>bigint GENERATED ALWAYS AS IDENTITY</code>: id autoincremento (forma padrão moderna do antigo <code>serial</code>)</li>
<li><code>text</code> ou <code>varchar(n)</code>: no PostgreSQL têm o mesmo desempenho; <code>varchar(n)</code> só acrescenta o limite</li>
<li><code>numeric(10,2)</code>: valores exatos, para dinheiro. <code>float</code>/<code>real</code> arredondam (0.1 + 0.2 não dá 0.3)</li>
<li><code>timestamptz</code>: instante absoluto, guardado em UTC. <code>timestamp</code> sem fuso costuma dar dor de cabeça com horário de verão e servidores em fusos diferentes</li>
</ul>
<p><b>No TypeORM/Prisma:</b> as migrations geram este DDL. Vale ler o SQL gerado antes de rodar em produção.</p>`,
      linguagem: 'sql',
      codigo: `CREATE TABLE clientes (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      text NOT NULL,
  cidade    text,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE produtos (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      text NOT NULL,
  categoria text NOT NULL,
  preco     numeric(10,2) NOT NULL CHECK (preco >= 0)
);` },
    { titulo: 'Chaves e restrições',
      texto: `<p><code>PRIMARY KEY</code> identifica a linha: é única e não nula. Pode ser composta, como <code>(pedido_id, produto_id)</code> em <code>itens_pedido</code>.</p>
<p><code>FOREIGN KEY ... REFERENCES</code> impede um pedido de apontar para cliente inexistente. <code>ON DELETE</code> decide o que acontece ao apagar o pai: o padrão bloqueia, <code>CASCADE</code> apaga os filhos junto.</p>
<p><code>NOT NULL</code>, <code>UNIQUE</code> e <code>CHECK</code> completam o time. Atenção: <code>UNIQUE</code> aceita <b>vários NULL</b>, porque NULL não é igual a NULL (no PostgreSQL 15+, <code>UNIQUE NULLS NOT DISTINCT</code> muda isso).</p>`,
      linguagem: 'sql',
      codigo: `CREATE TABLE pedidos (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id bigint NOT NULL REFERENCES clientes (id),
  criado_em  timestamptz NOT NULL DEFAULT now(),
  status     text NOT NULL
    CHECK (status IN ('pendente', 'pago', 'enviado', 'cancelado'))
);

CREATE TABLE itens_pedido (
  pedido_id      bigint REFERENCES pedidos (id) ON DELETE CASCADE,
  produto_id     bigint REFERENCES produtos (id),
  quantidade     integer NOT NULL CHECK (quantidade > 0),
  preco_unitario numeric(10,2) NOT NULL,
  PRIMARY KEY (pedido_id, produto_id)
);` },
    { titulo: 'Índices: quando ajudam',
      texto: `<p>Um índice B-tree é um sumário ordenado que deixa o banco achar linhas sem ler a tabela toda. Ajuda em <code>WHERE</code>, <code>JOIN</code> e <code>ORDER BY</code> em colunas <b>seletivas</b> (que filtram poucas linhas).</p>
<p>Custa espaço e deixa <code>INSERT</code>/<code>UPDATE</code> mais lentos, porque todo índice é atualizado junto. Não indexe tudo.</p>
<p><b>Pegadinha:</b> o PostgreSQL cria índice para <code>PRIMARY KEY</code> e <code>UNIQUE</code>, mas <b>não</b> para a coluna da chave estrangeira. <code>pedidos.cliente_id</code> sem índice deixa lento todo "pedidos do cliente X" e todo <code>DELETE</code> em <code>clientes</code>.</p>
<p>Índice comum também não ajuda <code>LIKE '%termo'</code> nem funções sobre a coluna, como <code>lower(nome)</code>, a menos que você crie um índice sobre a expressão.</p>`,
      linguagem: 'sql',
      codigo: `CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);

-- índice de expressão para busca sem maiúsculas
CREATE INDEX idx_clientes_nome_lower ON clientes (lower(nome));
SELECT * FROM clientes WHERE lower(nome) = 'ana souza';` },
    { titulo: 'Índice composto: a ordem importa',
      texto: `<p>Um índice em <code>(cliente_id, criado_em)</code> é ordenado primeiro por cliente e, dentro de cada cliente, por data. Como uma lista telefônica por sobrenome e depois nome.</p>
<p>Ele atende bem <code>WHERE cliente_id = 42</code> e <code>WHERE cliente_id = 42 AND criado_em &gt;= '2026-01-01'</code>, e ainda entrega os pedidos já ordenados por data. Para <code>WHERE criado_em &gt;= ...</code> sozinho ele quase não serve, assim como a lista telefônica não ajuda a achar todo mundo chamado "Ana".</p>
<p>Regra prática: colunas de <b>igualdade</b> primeiro, depois a de <b>intervalo</b> ou ordenação. E um índice <code>(cliente_id, criado_em)</code> já cobre o que um índice só em <code>cliente_id</code> faria.</p>`,
      linguagem: 'sql',
      codigo: `CREATE INDEX idx_pedidos_cliente_data
  ON pedidos (cliente_id, criado_em);

-- usa bem o índice (igualdade + intervalo + ordem)
SELECT id, criado_em FROM pedidos
WHERE cliente_id = 42 AND criado_em >= '2026-01-01'
ORDER BY criado_em DESC;` },
    { titulo: 'Transações e normalização',
      texto: `<p>Uma transação agrupa comandos que devem acontecer <b>juntos ou nada</b>. Criar o pedido e seus itens é o exemplo clássico: sem transação, uma falha no meio deixa um pedido sem itens.</p>
<p><code>BEGIN</code> abre, <code>COMMIT</code> confirma, <code>ROLLBACK</code> desfaz tudo. No PostgreSQL, depois de um erro dentro da transação, todo comando seguinte falha com <code>current transaction is aborted</code> até o <code>ROLLBACK</code>.</p>
<p><b>No NestJS:</b> é o <code>dataSource.transaction(async (manager) =&gt; ...)</code> do TypeORM ou o <code>prisma.$transaction</code>. Todas as queries precisam usar o <code>manager</code>/cliente da transação.</p>
<p><b>Normalização em uma frase:</b> cada fato fica guardado em um lugar só (o nome do cliente mora em <code>clientes</code>, não repetido em cada pedido), e você desnormaliza só com motivo, como o <code>preco_unitario</code> que congela o preço da venda.</p>`,
      linguagem: 'sql',
      codigo: `BEGIN;

INSERT INTO pedidos (cliente_id, status)
VALUES (42, 'pendente')
RETURNING id;   -- suponha que devolveu 1001

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (1001, 7, 2, 59.90),
       (1001, 9, 1, 120.00);

COMMIT;  -- ou ROLLBACK; para desfazer tudo` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Qual o melhor tipo para a coluna <code>preco</code>?',
      opcoes: ['numeric(10,2)', 'real', 'double precision', 'text'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['Dinheiro precisa de valor exato.', 'Ponto flutuante binário não representa 0.1 exatamente.', 'O tipo decimal exato do PostgreSQL.'],
      explica: '<code>numeric</code> guarda valores decimais exatos. <code>real</code> e <code>double precision</code> são ponto flutuante: somas acumulam erros de centavo. <code>text</code> impede contas e ordenação numérica.' },
    { tipo: 'escolha',
      pergunta: 'Existe um índice em <code>pedidos (cliente_id, criado_em)</code>. Qual consulta <b>menos</b> se beneficia dele?',
      opcoes: ["WHERE criado_em >= '2026-01-01'", 'WHERE cliente_id = 42', "WHERE cliente_id = 42 AND criado_em >= '2026-01-01'", 'WHERE cliente_id = 42 ORDER BY criado_em'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['O índice é ordenado primeiro por qual coluna?', 'Pense na lista telefônica ordenada por sobrenome.', 'Filtrar só pela segunda coluna não aproveita a ordem.'],
      explica: 'O índice composto é ordenado por <code>cliente_id</code> e depois por <code>criado_em</code>. Sem filtrar a primeira coluna, as datas estão espalhadas por todo o índice. As outras três usam o prefixo, e a última ainda aproveita a ordem.' },
    { tipo: 'escolha',
      pergunta: 'Você criou <code>pedidos.cliente_id</code> com <code>REFERENCES clientes (id)</code>. O PostgreSQL criou um índice em <code>pedidos.cliente_id</code>?',
      opcoes: ['Não; índice automático só para PRIMARY KEY e UNIQUE', 'Sim, toda FOREIGN KEY ganha índice', 'Sim, mas só se a tabela tiver mais de mil linhas', 'Só se a coluna for NOT NULL'],
      certa: 0,
      dicas: ['O MySQL (InnoDB) cria. E o PostgreSQL?', 'O PostgreSQL indexa o lado referenciado, não o que referencia.', 'Crie você mesmo.'],
      explica: 'O PostgreSQL exige índice único no lado referenciado (<code>clientes.id</code>, que já é PK), mas não indexa a coluna que referencia. Sem <code>CREATE INDEX ON pedidos (cliente_id)</code>, consultas por cliente e deletes em clientes fazem Seq Scan.' },
    { tipo: 'completar',
      pergunta: 'Complete a tabela de itens com chave estrangeira para pedidos e chave primária composta:',
      linguagem: 'sql',
      codigo: `CREATE TABLE itens_pedido (
  pedido_id      bigint [[0]] pedidos (id),
  produto_id     bigint REFERENCES produtos (id),
  quantidade     integer NOT NULL [[1]] (quantidade > 0),
  preco_unitario numeric(10,2) NOT NULL,
  [[2]] (pedido_id, produto_id)
);`,
      respostas: [['REFERENCES', 'references'], ['CHECK', 'check'], ['PRIMARY KEY', 'primary key']],
      dicas: ['Uma palavra liga a coluna à outra tabela.', 'Uma restrição valida uma condição booleana.', 'REFERENCES, CHECK, PRIMARY KEY.'],
      explica: '<code>REFERENCES</code> cria a chave estrangeira, <code>CHECK</code> rejeita quantidade zero ou negativa e <code>PRIMARY KEY (pedido_id, produto_id)</code> impede o mesmo produto duas vezes no pedido.' },
    { tipo: 'montar',
      pergunta: 'Monte o índice composto para "pedidos do cliente X a partir de uma data":',
      certa: ['CREATE INDEX', 'idx_pedidos_cliente_data', 'ON', 'pedidos', '(cliente_id, criado_em)'],
      extras: ['(criado_em, cliente_id)', 'TABLE', 'UNIQUE'],
      dicas: ['Igualdade primeiro, intervalo depois.', 'O filtro por cliente é igualdade; o de data é intervalo.', 'CREATE INDEX nome ON pedidos (cliente_id, criado_em).'],
      explica: 'Com <code>cliente_id</code> primeiro, o banco vai direto ao trecho do cliente e lê as datas já ordenadas. Na ordem inversa, teria que percorrer todo o intervalo de datas de todos os clientes. <code>UNIQUE</code> estaria errado: um cliente pode ter dois pedidos no mesmo instante.' },
    { tipo: 'escolha',
      pergunta: 'Dentro de um <code>BEGIN</code>, o segundo <code>INSERT</code> falhou por violar um CHECK. O que acontece se você rodar outro comando em seguida?',
      opcoes: ['Falha com "current transaction is aborted" até você dar ROLLBACK', 'Roda normalmente; só o INSERT com erro foi descartado', 'O PostgreSQL faz COMMIT do que deu certo', 'A conexão é encerrada'],
      certa: 0,
      dicas: ['No PostgreSQL, um erro "contamina" a transação.', 'Nenhum comando é aceito depois do erro, exceto encerrar a transação.', 'É preciso ROLLBACK (ou SAVEPOINT).'],
      explica: 'No PostgreSQL, um erro deixa a transação abortada: todo comando falha com <code>current transaction is aborted, commands ignored until end of transaction block</code>. Só <code>ROLLBACK</code> (ou voltar a um <code>SAVEPOINT</code>) libera. Nada é confirmado parcialmente.' },
    { tipo: 'completar',
      pergunta: 'Complete para transferir estoque entre dois depósitos de forma atômica:',
      linguagem: 'sql',
      codigo: `[[0]];
UPDATE estoque SET qtd = qtd - 5 WHERE deposito_id = 1 AND produto_id = 7;
UPDATE estoque SET qtd = qtd + 5 WHERE deposito_id = 2 AND produto_id = 7;
[[1]];`,
      respostas: [['BEGIN', 'begin', 'START TRANSACTION', 'start transaction'], ['COMMIT', 'commit']],
      dicas: ['Os dois UPDATE precisam acontecer juntos ou nenhum.', 'Abra uma transação e confirme no fim.', 'BEGIN e COMMIT.'],
      explica: 'Entre <code>BEGIN</code> e <code>COMMIT</code>, ou os dois UPDATE são aplicados ou nenhum é. Sem transação, uma queda entre eles faria 5 unidades sumirem.' },
    { tipo: 'escolha',
      pergunta: 'A coluna <code>clientes.email</code> é <code>UNIQUE</code> mas aceita nulo. Quantos clientes podem ficar sem e-mail (PostgreSQL, padrão)?',
      opcoes: ['Quantos quiser', 'Só um', 'Nenhum: UNIQUE implica NOT NULL', 'Só se a tabela não tiver PRIMARY KEY'],
      certa: 0,
      dicas: ['UNIQUE compara valores com igualdade.', 'NULL = NULL é verdadeiro?', 'Nulos não são considerados iguais entre si.'],
      explica: 'Como NULL não é igual a NULL, a restrição UNIQUE não vê dois nulos como duplicata: vários clientes podem ficar sem e-mail. Para permitir um só, use <code>UNIQUE NULLS NOT DISTINCT</code> (PostgreSQL 15+). Se o e-mail é obrigatório, acrescente <code>NOT NULL</code>.' },
  ],
})

const ordem = CURSO.partes.flatMap(p => p.ids)
const LICOES = ordem.map(id => MODULOS.find(m => m.id === id)).filter(Boolean)
globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}
globalThis.TRILHAS_CARREGADAS["sql"] = { CURSO, LICOES, MODULOS }
})()
