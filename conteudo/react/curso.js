const CURSO = {
  kicker: 'React',
  titulo: 'Interfaces com <em>React</em>: componentes, estado e dados de verdade.',
  subtitulo: 'Do JSX ao app que busca dados de uma API. Cada módulo termina com um pedaço de um painel de tarefas.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Pensar em componentes', tipo: 'pedra', ids: ['react-jsx', 'react-props'] },
    { titulo: 'Estado e efeitos', tipo: 'papel', ids: ['react-estado', 'react-efeitos', 'react-formularios'] },
    { titulo: 'App de verdade', tipo: 'tesoura', ids: ['react-hooks', 'react-dados'] },
  ],
  vaga: [
    { texto: 'Escrever componentes com JSX e compor a tela em partes pequenas', modulos: ['react-jsx', 'react-props'] },
    { texto: 'Controlar estado com useState sem mutar objetos e listas', modulos: ['react-estado'] },
    { texto: 'Usar useEffect na medida certa (e saber quando não usar)', modulos: ['react-efeitos'] },
    { texto: 'Construir formulários controlados com validação', modulos: ['react-formularios'] },
    { texto: 'Extrair hooks próprios e compartilhar estado com Context', modulos: ['react-hooks'] },
    { texto: 'Buscar e atualizar dados de uma API com carregamento e erro', modulos: ['react-dados'], diferencial: true },
  ],
}
