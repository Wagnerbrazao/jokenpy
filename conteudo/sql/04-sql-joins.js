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
