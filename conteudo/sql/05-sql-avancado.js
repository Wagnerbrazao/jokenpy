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
