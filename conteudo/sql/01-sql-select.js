MODULOS.push({
  id: 'sql-select',
  titulo: 'SELECT e ordenação',
  icone: '🔎',
  aprende: 'SELECT, aliases, DISTINCT, ORDER BY, LIMIT/OFFSET e a ordem em que o banco executa a consulta',
  porque: 'Todo find() do seu ORM vira um SELECT, e saber ler e escrever um na mão é o que separa adivinhar de entender a query lenta.',
  gancho: {
    titulo: 'O alias que sumiu',
    pergunta: 'O que esta consulta devolve?',
    linguagem: 'sql',
    codigo: `SELECT nome, preco * 0.9 AS com_desconto
FROM produtos
WHERE com_desconto > 100;`,
    opcoes: ['Os produtos com desconto acima de 100', 'Erro: column "com_desconto" does not exist', 'Zero linhas, sem erro'],
    certa: 1,
    revelacao: 'O banco avalia o <code>WHERE</code> <b>antes</b> do <code>SELECT</code>, então o alias ainda não existe ali (no <code>ORDER BY</code>, que vem depois, ele funciona). Nesta lição você vai ver a ordem em que o banco pensa a consulta, além de DISTINCT, ordenação e paginação estável.',
  },
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
