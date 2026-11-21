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
