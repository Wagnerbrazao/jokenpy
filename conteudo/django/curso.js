const CURSO = {
  kicker: 'Django',
  titulo: 'Back-end com <em>Django</em>: do model à API em Python.',
  subtitulo: 'Você monta, passo a passo, um app de flashcards: models, ORM, views, admin, API com Django REST Framework e testes.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Projeto e dados', tipo: 'pedra', ids: ['django-projeto', 'django-models', 'django-orm'] },
    { titulo: 'Páginas e usuários', tipo: 'papel', ids: ['django-views', 'django-forms'] },
    { titulo: 'API e qualidade', tipo: 'tesoura', ids: ['django-drf', 'django-testes'] },
  ],
  vaga: [
    { texto: 'Criar projeto e apps Django e entender o manage.py', modulos: ['django-projeto'] },
    { texto: 'Modelar dados com models, migrations e relacionamentos', modulos: ['django-models'] },
    { texto: 'Consultar com o ORM sem cair no problema N+1', modulos: ['django-orm'] },
    { texto: 'Ligar URLs, views e templates', modulos: ['django-views'] },
    { texto: 'Validar entradas com forms e usar o admin', modulos: ['django-forms'] },
    { texto: 'Expor uma API REST com Django REST Framework', modulos: ['django-drf'] },
    { texto: 'Testar models, views e API', modulos: ['django-testes'], diferencial: true },
  ],
}
