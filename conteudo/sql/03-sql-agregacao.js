MODULOS.push({
  id: 'sql-agregacao',
  titulo: 'Agregação',
  icone: '🧮',
  aprende: 'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING e FILTER',
  porque: 'Dashboards, relatórios e métricas são agregações, e calcular no banco é muito mais barato do que trazer tudo para o Node.',
  gancho: {
    titulo: 'Dois COUNTs diferentes',
    pergunta: 'A tabela tem 10 clientes; 4 estão com <code>cidade</code> nula. O que volta?',
    linguagem: 'sql',
    codigo: `SELECT COUNT(*), COUNT(cidade)
FROM clientes;`,
    opcoes: ['10 e 10', '10 e 6', '6 e 6'],
    certa: 1,
    revelacao: '<code>COUNT(*)</code> conta linhas; <code>COUNT(cidade)</code> conta só os valores não nulos, e <code>SUM</code>/<code>AVG</code> também ignoram nulos. Nesta lição você vai ver como agregar, agrupar, filtrar grupos com <code>HAVING</code> e contar várias coisas numa passada com <code>FILTER</code>.',
  },
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
