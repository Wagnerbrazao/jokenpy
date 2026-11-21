MODULOS.push({
  id: 'sql-modelagem',
  titulo: 'Tabelas, índices e transações',
  icone: '🏗️',
  aprende: 'CREATE TABLE, tipos, chaves, restrições, índices (inclusive compostos) e transações',
  porque: 'Restrições no banco seguram dados ruins que escapam da validação da API, e o índice certo transforma segundos em milissegundos.',
  gancho: {
    titulo: 'O DELETE de 30 segundos',
    pergunta: '<code>pedidos</code> tem 5 milhões de linhas. Apagar <b>um</b> cliente leva 30 s. Qual a causa mais provável?',
    linguagem: 'sql',
    codigo: `CREATE TABLE pedidos (
  id         bigint PRIMARY KEY,
  cliente_id bigint REFERENCES clientes (id)
);

DELETE FROM clientes WHERE id = 42;  -- 30 s`,
    opcoes: ['Falta índice em clientes.id', 'Falta índice em pedidos.cliente_id', 'A FK deveria ser ON DELETE CASCADE'],
    certa: 1,
    revelacao: 'Para checar a FK, o banco procura pedidos com <code>cliente_id = 42</code>, e o PostgreSQL <b>não</b> cria índice nessa coluna sozinho: vira Seq Scan em 5 milhões de linhas (<code>clientes.id</code> já tem índice pela PK). Nesta lição você vai ver tipos, chaves, índices (inclusive compostos) e transações.',
  },
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
