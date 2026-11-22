MODULOS.push({
  id: 'django-projeto',
  titulo: 'Projeto e apps',
  icone: '🏗️',
  aprende: 'venv/uv, startproject, startapp, manage.py e settings.py',
  porque: 'Todo projeto Django começa igual, e entender essa estrutura é o que permite achar qualquer coisa num código que você não escreveu.',
  gancho: {
    titulo: 'Migration que não vem',
    pergunta: 'Você criou o app com <code>startapp assistidos</code>, escreveu o model e rodou o comando. Por que nada aconteceu?',
    linguagem: 'bash',
    codigo: `$ python manage.py startapp assistidos
# ...escreve class Assistido(models.Model) em assistidos/models.py
$ python manage.py makemigrations
No changes detected`,
    opcoes: ['Faltou rodar migrate antes', 'O app não está em INSTALLED_APPS', 'O model precisa de class Meta', 'O runserver precisa reiniciar'],
    certa: 1,
    revelacao: 'O Django só enxerga apps listados em <code>INSTALLED_APPS</code>, como um módulo do NestJS que ninguém colocou nos <code>imports</code> do <code>AppModule</code>. Nesta lição você vai ver como projeto e apps se encaixam e onde o Django procura cada coisa.',
  },
  videos: [
    { id: '4u0aI-90KnU', titulo: 'Estrutura Básica de um Projeto em Django', canal: 'Hashtag Programação',
      duracao: '17:28', idioma: 'pt',
      nota: 'Acompanhe a criação do projeto e do app e repare no passo de registrar o app em <code>INSTALLED_APPS</code>, exatamente o que faltou no gancho.' },
    { id: 'Q0J9gJgd7Ow', titulo: 'Django explicado em 8 minutos', canal: 'pythonando',
      duracao: '8:16', idioma: 'pt',
      nota: 'Visão geral rápida de como projeto, apps, <code>settings.py</code> e <code>manage.py</code> se conectam, bom para fixar o mapa antes dos detalhes.' },
  ],
  resumo: [
    'Cada projeto tem seu <b>ambiente virtual</b> (<code>.venv</code>), criado com <code>uv venv</code> ou <code>python -m venv</code>',
    '<code>django-admin startproject config .</code> cria o <b>projeto</b>: settings, urls e o <code>manage.py</code>',
    '<code>python manage.py startapp flashcards</code> cria um <b>app</b>, que só funciona depois de entrar em <code>INSTALLED_APPS</code>',
    '<code>runserver</code> sobe o servidor de desenvolvimento, <code>migrate</code> cria as tabelas, <code>createsuperuser</code> cria o login do admin',
    '<code>DEBUG = True</code> só em desenvolvimento: em produção ele vaza detalhes do erro',
    'Projeto ≈ <code>AppModule</code> + configuração; app ≈ um módulo de funcionalidade do NestJS',
  ],
  ensino: [
    { titulo: 'Um ambiente virtual por projeto',
      texto: `<p>No Node, cada projeto tem seu <code>node_modules</code>. No Python, o equivalente é o <b>ambiente virtual</b>: uma pasta (geralmente <code>.venv</code>) com um Python e as bibliotecas só daquele projeto.</p>
<p>O <b>uv</b> é a ferramenta moderna e rápida para isso (pense nele como o <code>pnpm</code> do Python). O caminho clássico, <code>python -m venv</code> + <code>pip</code>, continua funcionando em qualquer máquina.</p>
<p><b>Erro comum:</b> esquecer de ativar o ambiente. O sintoma é <code>django-admin: command not found</code> ou <code>ModuleNotFoundError: No module named 'django'</code>. Ative com <code>source .venv/bin/activate</code> (no Windows, <code>.venv\\Scripts\\activate</code>).</p>`,
      linguagem: 'bash',
      codigo: `# com uv
uv venv
source .venv/bin/activate
uv pip install "django>=5.1,<6"

# sem uv (funciona em qualquer lugar)
python -m venv .venv
source .venv/bin/activate
pip install "django>=5.1,<6"
pip freeze > requirements.txt` },
    { titulo: 'startproject e startapp',
      texto: `<p><code>django-admin startproject config .</code> cria o <b>projeto</b>. O ponto final diz "crie aqui", evitando a pasta duplicada <code>config/config/</code>. Muita gente chama o pacote de configuração de <code>config</code> para não confundir com os apps.</p>
<p>Depois, <code>python manage.py startapp flashcards</code> cria um <b>app</b>: uma pasta com <code>models.py</code>, <code>views.py</code>, <code>admin.py</code>, <code>tests.py</code> e <code>migrations/</code>.</p>
<p><b>No NestJS:</b> é parecido com <code>nest new</code> seguido de <code>nest g module decks</code>. A diferença é que o Django não registra o app sozinho: você precisa colocá-lo em <code>INSTALLED_APPS</code>.</p>`,
      linguagem: 'texto',
      codigo: `meu-projeto/
├── manage.py            # porta de entrada dos comandos
├── config/              # o PROJETO
│   ├── settings.py
│   ├── urls.py          # rotas raiz
│   ├── asgi.py / wsgi.py
└── flashcards/          # um APP
    ├── models.py
    ├── views.py
    ├── admin.py
    ├── apps.py
    ├── tests.py
    └── migrations/` },
    { titulo: 'Projeto vs app',
      texto: `<p>O <b>projeto</b> é o site inteiro: configuração, banco, rotas raiz, apps instalados. Um projeto tem <b>vários apps</b>.</p>
<p>O <b>app</b> é um pedaço com uma responsabilidade: <code>flashcards</code>, <code>contas</code>, <code>pagamentos</code>. Um app bem feito pode até ser reaproveitado em outro projeto: o próprio admin (<code>django.contrib.admin</code>) é um app.</p>
<p><b>No NestJS:</b> o projeto lembra o <code>AppModule</code> + <code>main.ts</code> + config; o app lembra um feature module (<code>DecksModule</code>), só que ele junta entidades, controllers e templates na mesma pasta.</p>` },
    { titulo: 'settings.py: o que olhar primeiro',
      texto: `<p><code>settings.py</code> é um módulo Python comum. Três configurações aparecem em toda conversa:</p>
<ul><li><code>INSTALLED_APPS</code>: lista de apps ativos. App fora dela não tem models nem migrations reconhecidos.</li>
<li><code>DATABASES</code>: conexão com o banco. O padrão é SQLite num arquivo, ótimo para aprender.</li>
<li><code>DEBUG</code>: com <code>True</code>, o erro aparece com stack trace na página. Em produção, <code>False</code>, e aí <code>ALLOWED_HOSTS</code> precisa listar o domínio.</li></ul>
<p><b>No NestJS:</b> é o papel do <code>ConfigModule</code> + <code>.env</code>. Segredos (como <code>SECRET_KEY</code>) também devem vir de variável de ambiente, nunca do Git.</p>`,
      linguagem: 'django',
      codigo: `import os

DEBUG = os.environ.get("DJANGO_DEBUG") == "1"
ALLOWED_HOSTS = ["localhost", "flashcards.exemplo.com"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "flashcards",  # o seu app
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}` },
    { titulo: 'manage.py: o CLI do projeto',
      texto: `<p><code>manage.py</code> é o <code>nest</code> CLI + scripts do <code>package.json</code> num lugar só. Ele já sabe qual settings usar.</p>
<ul><li><code>runserver</code>: servidor de desenvolvimento em <code>127.0.0.1:8000</code>, recarrega ao salvar. Não use em produção (lá vai gunicorn/uvicorn).</li>
<li><code>migrate</code>: aplica as migrations, criando as tabelas. No projeto novo, cria as tabelas de usuários, sessões e admin.</li>
<li><code>createsuperuser</code>: cria um usuário com acesso ao <code>/admin/</code>.</li>
<li><code>shell</code>: um console Python com o Django carregado, para testar consultas.</li></ul>
<p><b>Sintoma clássico:</b> ao rodar <code>runserver</code> num projeto novo aparece "You have 18 unapplied migration(s)". Basta rodar <code>migrate</code>.</p>`,
      linguagem: 'bash',
      codigo: `python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# em outro terminal:
python manage.py shell
>>> from flashcards.models import Deck
>>> Deck.objects.count()` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Você rodou <code>django-admin startproject</code> e aparece <code>django-admin: command not found</code>. O Django foi instalado ontem. Qual a causa mais provável?',
      opcoes: ['O ambiente virtual não está ativado neste terminal', 'Falta rodar python manage.py migrate', 'O app não está em INSTALLED_APPS', 'O DEBUG está False'],
      certa: 0,
      dicas: ['Onde o Django foi instalado: no sistema ou numa pasta do projeto?', 'Cada terminal novo precisa reativar o <code>.venv</code>.'],
      explica: 'O Django foi instalado dentro do <code>.venv</code>; sem <code>source .venv/bin/activate</code>, o terminal não enxerga o comando. <code>migrate</code> e <code>INSTALLED_APPS</code> só fazem sentido depois que o projeto existe.' },
    { tipo: 'montar',
      pergunta: 'Monte o comando que cria o projeto <code>config</code> na pasta atual, sem a pasta duplicada:',
      certa: ['django-admin', 'startproject', 'config', '.'],
      extras: ['startapp', 'manage.py', 'new'],
      dicas: ['O comando que cria projetos é o <code>django-admin</code>, não o <code>manage.py</code> (que ainda não existe).', 'O último argumento é o diretório de destino.'],
      explica: '<code>django-admin startproject config .</code> cria <code>manage.py</code> e a pasta <code>config/</code> no diretório atual. Sem o ponto, ele cria <code>config/config/</code>.' },
    { tipo: 'escolha',
      pergunta: 'Você criou o app <code>flashcards</code>, escreveu o model <code>Deck</code>, mas <code>makemigrations</code> responde "No changes detected". O que falta?',
      opcoes: ['Adicionar "flashcards" em INSTALLED_APPS', 'Rodar createsuperuser', 'Reiniciar o runserver', 'Trocar o banco de SQLite para PostgreSQL'],
      certa: 0,
      dicas: ['O Django só olha os models de apps que ele conhece.', 'A lista de apps conhecidos fica no <code>settings.py</code>.'],
      explica: 'App fora de <code>INSTALLED_APPS</code> é invisível para migrations, admin e templates. Reiniciar o servidor não muda nada, porque <code>makemigrations</code> nem usa o servidor.' },
    { tipo: 'completar',
      pergunta: 'Complete a sequência de comandos de um projeto recém-criado: criar as tabelas, criar o login do admin e subir o servidor.',
      codigo: `python manage.py [[0]]
python manage.py [[1]]
python manage.py [[2]]`,
      respostas: [['migrate'], ['createsuperuser'], ['runserver']],
      dicas: ['Primeiro o banco precisa ter as tabelas de usuário.', 'Depois você cria um usuário e, por fim, sobe o servidor.'],
      explica: '<code>migrate</code> cria as tabelas (inclusive a de usuários), <code>createsuperuser</code> grava um usuário nela e <code>runserver</code> sobe o site em <code>127.0.0.1:8000</code>. Inverter os dois primeiros dá erro de tabela inexistente.' },
    { tipo: 'escolha',
      pergunta: 'Qual comparação com o NestJS é a mais correta?',
      opcoes: ['Projeto Django ≈ AppModule + configuração; app Django ≈ um feature module', 'Projeto Django ≈ um controller; app Django ≈ um service', 'App Django ≈ um pacote npm que precisa ser publicado', 'Não existe equivalente: um projeto Django tem um app só'],
      certa: 0,
      dicas: ['Um projeto contém vários apps.', 'Cada app agrupa uma funcionalidade: models, views, admin.'],
      explica: 'O projeto junta configuração e apps, como o <code>AppModule</code> importa módulos. Um projeto costuma ter vários apps; ele não é um controller, que é só a camada HTTP.' },
    { tipo: 'completar',
      pergunta: 'Complete o <code>settings.py</code> de desenvolvimento para ativar a página de erro detalhada e o app novo:',
      codigo: `[[0]] = True

INSTALLED_APPS = [
    "django.contrib.admin",
    # ...
    "[[1]]",
]`,
      respostas: [['DEBUG'], ['flashcards', 'flashcards.apps.FlashcardsConfig']],
      dicas: ['A configuração que mostra stack trace no navegador.', 'O nome do app é o nome da pasta criada pelo <code>startapp</code>.'],
      explica: '<code>DEBUG = True</code> mostra a página amarela de erro. O app entra pelo nome do pacote (<code>"flashcards"</code>) ou pela classe de config (<code>"flashcards.apps.FlashcardsConfig"</code>); as duas formas funcionam.' },
    { tipo: 'escolha',
      pergunta: 'Você colocou o site no ar com <code>DEBUG = False</code> e toda requisição retorna <b>400 Bad Request</b>. O que conferir primeiro?',
      opcoes: ['ALLOWED_HOSTS com o domínio do site', 'INSTALLED_APPS com o app flashcards', 'Se o createsuperuser foi rodado', 'Se o runserver está na porta 8000'],
      certa: 0,
      dicas: ['Com <code>DEBUG</code> desligado, o Django passa a validar o cabeçalho <code>Host</code>.', 'Que configuração lista os domínios aceitos?'],
      explica: 'Com <code>DEBUG = False</code>, um <code>Host</code> fora de <code>ALLOWED_HOSTS</code> gera 400. App faltando daria outro erro (404 ou ImportError), não 400 em tudo.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: qual a diferença entre projeto e app no Django, e como você organizaria um sistema de flashcards com login?',
      avalia: 'Se você entende que o projeto é a configuração e o conjunto de apps, e se sabe dividir responsabilidades em apps coesos.',
      resposta: `<p>O projeto é o site inteiro: o <code>settings.py</code>, as URLs raiz e a lista de apps instalados. O app é uma unidade com uma responsabilidade, com seus próprios models, views, admin e migrations.</p>
<p>Num sistema de flashcards eu criaria um projeto <code>config</code> e, por exemplo, um app <code>flashcards</code> com decks e cards e um app <code>contas</code> para perfil e cadastro, usando o <code>django.contrib.auth</code> para o login. Cada app entra em <code>INSTALLED_APPS</code>. É parecido com feature modules no NestJS: o projeto importa os módulos, e cada um cuida do seu domínio.</p>`,
      pontos: ['Projeto = configuração + conjunto de apps', 'App = responsabilidade única, com models/views/migrations próprios', 'Registrar em INSTALLED_APPS', 'Reaproveitar apps prontos como django.contrib.auth'],
      evitar: ['Dizer que projeto e app são a mesma coisa', 'Colocar tudo num app só sem justificar'],
      dicas: ['Comece pelo que cada um contém.', 'Use o NestJS como ponte: AppModule e feature modules.'] },
  ],
})
