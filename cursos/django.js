// Gerado por ferramentas/gerar_cursos.py a partir de conteudo/django/. Não edite à mão.
(() => {
const MODULOS = []
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

// ---- 01-django-projeto.js
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

// ---- 02-django-models.js
MODULOS.push({
  id: 'django-models',
  titulo: 'Models e migrations',
  icone: '🗃️',
  aprende: 'models.Model, campos, ForeignKey, ManyToMany, migrations, __str__ e Meta',
  porque: 'O model é a fonte da verdade do banco: errar um on_delete ou um campo obrigatório vira dado perdido ou migration dolorosa em produção.',
  gancho: {
    titulo: 'Obrigatório, mas nem tanto',
    pergunta: '<code>nome</code> não tem <code>blank</code> nem <code>null</code>. O que acontece aqui?',
    linguagem: 'django',
    codigo: `class Assistido(models.Model):
    nome = models.CharField(max_length=120)
    cpf = models.CharField(max_length=11)

Assistido.objects.create()`,
    opcoes: ['IntegrityError: NOT NULL', 'ValidationError: campo obrigatório', 'Salva com nome e cpf vazios ("")', 'TypeError: faltam argumentos'],
    certa: 2,
    revelacao: 'O <code>CharField</code> tem padrão <code>""</code>, e <code>blank=False</code> só é checado por forms e <code>full_clean()</code>, nunca no <code>save()</code>: é como um DTO com class-validator que ninguém passou pelo pipe. Nesta lição você vai ver o que cada opção de campo garante de verdade e onde.',
  },
  resumo: [
    'Um model é uma classe que herda de <code>models.Model</code>: cada classe vira uma tabela, cada campo uma coluna',
    '<code>CharField</code> pede <code>max_length</code>; textos longos vão em <code>TextField</code>',
    '<code>ForeignKey</code> sempre pede <code>on_delete</code>: <code>CASCADE</code>, <code>PROTECT</code> ou <code>SET_NULL</code> (com <code>null=True</code>)',
    '<code>ManyToManyField</code> cria a tabela intermediária sozinho',
    '<code>makemigrations</code> <b>gera</b> o arquivo de migration; <code>migrate</code> <b>aplica</b> no banco',
    '<code>__str__</code> define como o objeto aparece no admin e no shell; <code>Meta.ordering</code> define a ordem padrão',
  ],
  ensino: [
    { titulo: 'Um model é uma tabela',
      texto: `<p>Um model é uma classe que herda de <code>models.Model</code> e fica no <code>models.py</code> do app. Cada atributo de campo vira uma coluna, e o Django cria sozinho a chave primária <code>id</code> (no projeto novo, um <code>BigAutoField</code>).</p>
<p>A tabela se chama <code>&lt;app&gt;_&lt;model&gt;</code>, por exemplo <code>flashcards_deck</code>.</p>
<p><b>No NestJS/TypeORM:</b> é a sua classe com <code>@Entity()</code> e <code>@Column()</code>. A diferença é que, no Django, o tipo do campo já é a configuração da coluna: não existem decorators.</p>`,
      linguagem: 'django',
      codigo: `from django.db import models


class Deck(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    publico = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)` },
    { titulo: 'Os campos que você mais vai usar',
      texto: `<ul><li><code>CharField(max_length=...)</code>: texto curto. Sem <code>max_length</code>, o <code>check</code> acusa erro (fields.E120); só o PostgreSQL dispensa, desde o Django 4.2.</li>
<li><code>TextField</code>: texto longo, sem limite.</li>
<li><code>IntegerField</code>, <code>PositiveIntegerField</code>, <code>DecimalField(max_digits, decimal_places)</code>: números. Dinheiro vai em <code>DecimalField</code>, nunca <code>FloatField</code>.</li>
<li><code>BooleanField(default=False)</code>, <code>DateField</code>, <code>DateTimeField</code>.</li>
<li><code>auto_now_add=True</code> grava a data na criação; <code>auto_now=True</code> atualiza a cada <code>save()</code>.</li></ul>
<p><b>Cuidado:</b> <code>null=True</code> é sobre o <b>banco</b> (aceita NULL); <code>blank=True</code> é sobre a <b>validação</b> de forms (aceita vazio). Para texto, a convenção é usar só <code>blank=True</code> e guardar string vazia.</p>` },
    { titulo: 'ForeignKey e on_delete',
      texto: `<p>Um card pertence a um deck: isso é uma <code>ForeignKey</code> no lado "muitos". O argumento <code>on_delete</code> é <b>obrigatório</b> e diz o que acontece com os cards quando o deck é apagado:</p>
<ul><li><code>CASCADE</code>: apaga os cards juntos.</li>
<li><code>PROTECT</code>: impede apagar o deck que tem cards (lança <code>ProtectedError</code>).</li>
<li><code>SET_NULL</code>: deixa o campo vazio; exige <code>null=True</code>.</li></ul>
<p><code>related_name="cards"</code> dá nome ao caminho inverso: <code>deck.cards.all()</code>. Sem ele, o nome seria <code>deck.card_set</code>.</p>
<p><b>No TypeORM:</b> é o <code>@ManyToOne</code> com <code>onDelete: 'CASCADE'</code>, e o <code>related_name</code> faz o papel do <code>@OneToMany</code> do outro lado, sem você precisar declarar.</p>`,
      linguagem: 'django',
      codigo: `from django.conf import settings


class Deck(models.Model):
    nome = models.CharField(max_length=100)
    dono = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )


class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name="cards")
    frente = models.CharField(max_length=200)
    verso = models.TextField()
    acertos = models.PositiveIntegerField(default=0)` },
    { titulo: 'ManyToMany',
      texto: `<p>Um deck pode ter várias tags, e uma tag aparece em vários decks. Declare <code>ManyToManyField</code> em <b>um</b> dos lados; o Django cria a tabela intermediária <code>flashcards_deck_tags</code>.</p>
<p>Para relacionar, use <code>deck.tags.add(tag)</code>, <code>.remove(tag)</code> ou <code>.set([...])</code>. O objeto precisa estar salvo antes (ter <code>id</code>).</p>
<p>Se a ligação precisar de dados próprios (ex.: data em que a tag foi aplicada), crie um model intermediário e use <code>through=</code>.</p>`,
      linguagem: 'django',
      codigo: `class Tag(models.Model):
    nome = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.nome


class Deck(models.Model):
    nome = models.CharField(max_length=100)
    tags = models.ManyToManyField(Tag, blank=True, related_name="decks")

# uso
deck = Deck.objects.create(nome="Verbos irregulares")
deck.tags.add(Tag.objects.get(nome="inglês"))` },
    { titulo: 'makemigrations vs migrate',
      texto: `<p>Mudou o model? São <b>dois</b> passos:</p>
<ol><li><code>makemigrations</code> compara os models com as migrations existentes e <b>gera</b> um arquivo em <code>migrations/</code> (ex.: <code>0002_card_acertos.py</code>). Esse arquivo vai para o Git.</li>
<li><code>migrate</code> <b>aplica</b> no banco as migrations que ainda não rodaram, registrando-as na tabela <code>django_migrations</code>.</li></ol>
<p><b>Erro comum:</b> adicionar um campo obrigatório numa tabela com dados. O <code>makemigrations</code> pergunta qual valor usar nas linhas existentes. Responda com um default ou declare <code>default=</code> no campo.</p>
<p><b>No TypeORM:</b> é <code>migration:generate</code> seguido de <code>migration:run</code>.</p>`,
      linguagem: 'bash',
      codigo: `python manage.py makemigrations flashcards
python manage.py showmigrations flashcards
python manage.py migrate
python manage.py sqlmigrate flashcards 0002   # ver o SQL gerado` },
    { titulo: '__str__ e Meta',
      texto: `<p><code>__str__</code> é o <code>toString()</code> do objeto. Sem ele, o admin e o shell mostram <code>Deck object (1)</code>, que não ajuda ninguém.</p>
<p>A classe interna <code>Meta</code> guarda opções do model que não são colunas: <code>ordering</code> (ordem padrão das consultas; <code>"-"</code> é decrescente), <code>verbose_name_plural</code>, <code>constraints</code>.</p>`,
      linguagem: 'django',
      codigo: `class Deck(models.Model):
    nome = models.CharField(max_length=100)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]
        verbose_name_plural = "decks"

    def __str__(self):
        return self.nome` },
  ],
  exercicios: [
    { tipo: 'completar',
      pergunta: 'Complete o model de card: texto curto na frente e ligação com o deck.',
      codigo: `class Card(models.[[0]]):
    frente = models.CharField([[1]]=200)
    deck = models.ForeignKey(Deck, on_delete=models.[[2]], related_name="cards")`,
      respostas: [['Model'], ['max_length'], ['CASCADE']],
      dicas: ['Todo model herda da mesma classe base.', '<code>CharField</code> tem um argumento obrigatório de tamanho; ao apagar o deck, os cards devem ir junto.'],
      explica: 'Models herdam de <code>models.Model</code>, <code>CharField</code> exige <code>max_length</code> e <code>CASCADE</code> apaga os cards junto com o deck.' },
    { tipo: 'escolha',
      pergunta: 'Você quer impedir que alguém apague um deck que ainda tem cards. Qual <code>on_delete</code> usar no <code>Card.deck</code>?',
      opcoes: ['models.PROTECT', 'models.CASCADE', 'models.SET_NULL', 'models.DO_NOTHING'],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['O objetivo é bloquear a exclusão, não reagir a ela.', 'Uma das opções lança <code>ProtectedError</code>.'],
      explica: '<code>PROTECT</code> lança <code>ProtectedError</code> e o deck não é apagado. <code>DO_NOTHING</code> parece seguro, mas deixa o Django sem ação e quem decide é o banco, que pode quebrar com erro de integridade.' },
    { tipo: 'escolha',
      pergunta: 'O que acontece ao rodar <code>makemigrations</code> com este campo?',
      codigo: `dono = models.ForeignKey(User, on_delete=models.SET_NULL)`,
      opcoes: ['Erro: SET_NULL exige null=True no campo', 'Funciona: o Django adiciona null=True sozinho', 'Funciona, mas apaga o deck quando o usuário é apagado', 'Erro: ForeignKey para User não é permitida'],
      certa: 0,
      dicas: ['Para "deixar vazio", a coluna precisa aceitar NULL.', 'O system check do Django pega essa combinação antes de gerar a migration.'],
      explica: 'O check acusa fields.E320: <code>SET_NULL</code> sem <code>null=True</code> é impossível de cumprir. O Django não completa configuração por você. (Prefira referenciar <code>settings.AUTH_USER_MODEL</code> em vez de importar <code>User</code>.)' },
    { tipo: 'escolha',
      pergunta: 'Qual a diferença entre <code>null=True</code> e <code>blank=True</code>?',
      opcoes: ['null é sobre o banco aceitar NULL; blank é sobre a validação aceitar vazio', 'São sinônimos; blank é o nome antigo', 'null vale para forms; blank vale para o banco', 'blank=True cria um índice na coluna'],
      certa: 0,
      dicas: ['Um deles nem chega ao SQL.', 'Pense no admin: qual dos dois deixa você salvar o campo vazio?'],
      explica: '<code>null</code> muda a coluna (<code>NULL</code> permitido); <code>blank</code> só muda a validação de forms e admin. A opção invertida é a confusão mais comum: lembre que "blank" é o que o usuário deixa em branco.' },
    { tipo: 'montar',
      pergunta: 'Monte a declaração das tags do deck, opcionais no formulário:',
      certa: ['tags', '=', 'models.ManyToManyField(', 'Tag,', 'blank=True', ')'],
      extras: ['models.ForeignKey(', 'on_delete=models.CASCADE,', 'null=True'],
      dicas: ['Um deck tem várias tags e cada tag tem vários decks.', 'ManyToMany não usa <code>on_delete</code>, e <code>null</code> não tem efeito nele.'],
      explica: '<code>ManyToManyField</code> não tem coluna no deck (usa tabela intermediária), por isso não pede <code>on_delete</code> e ignora <code>null</code>. <code>blank=True</code> deixa salvar sem tag.' },
    { tipo: 'escolha',
      pergunta: 'Você adicionou o campo <code>acertos</code> no <code>Card</code>, rodou <code>makemigrations</code>, e a aplicação quebra com <code>no such column: flashcards_card.acertos</code>. O que faltou?',
      opcoes: ['Rodar migrate', 'Rodar makemigrations de novo', 'Reiniciar o shell', 'Adicionar acertos em INSTALLED_APPS'],
      certa: 0,
      dicas: ['O arquivo de migration foi gerado. Ele foi aplicado?', 'Gerar e aplicar são comandos diferentes.'],
      explica: '<code>makemigrations</code> só escreve o arquivo; quem altera a tabela é o <code>migrate</code>. Rodar <code>makemigrations</code> de novo diria "No changes detected", porque o arquivo já existe.' },
    { tipo: 'completar',
      pergunta: 'Complete para os decks saírem do mais novo para o mais antigo e aparecerem pelo nome no admin:',
      codigo: `class Deck(models.Model):
    nome = models.CharField(max_length=100)
    criado_em = models.DateTimeField(auto_now_add=True)

    class [[0]]:
        ordering = ["[[1]]"]

    def [[2]](self):
        return self.nome`,
      respostas: [['Meta'], ['-criado_em'], ['__str__']],
      dicas: ['As opções do model ficam numa classe interna com nome fixo.', 'O sinal de menos inverte a ordem; o método de texto tem dois underscores de cada lado.'],
      explica: '<code>Meta.ordering = ["-criado_em"]</code> ordena decrescente por padrão e <code>__str__</code> é o que o admin mostra no lugar de "Deck object (1)".' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: como funcionam as migrations no Django e que cuidados você toma ao alterar um model que já está em produção?',
      avalia: 'Se você separa gerar de aplicar, sabe que migrations vão para o Git e conhece riscos como campo obrigatório em tabela com dados.',
      resposta: `<p>O Django compara os models com o histórico de migrations do app. O <code>makemigrations</code> gera um arquivo Python com as operações (adicionar campo, criar tabela), que eu reviso e comito. O <code>migrate</code> aplica no banco o que ainda não foi aplicado, controlado pela tabela <code>django_migrations</code>.</p>
<p>Em produção, eu evito campo obrigatório sem default em tabela grande, faço mudanças destrutivas em etapas (primeiro deixo o campo opcional, depois removo) e confiro o SQL com <code>sqlmigrate</code>. É o mesmo fluxo do <code>migration:generate</code> e <code>migration:run</code> do TypeORM.</p>`,
      pontos: ['makemigrations gera, migrate aplica', 'Migrations são versionadas no Git', 'Tabela django_migrations controla o que foi aplicado', 'Cuidado com campo obrigatório em tabela com dados', 'Revisar o SQL com sqlmigrate'],
      evitar: ['Apagar migrations antigas para "limpar"', 'Editar o banco à mão sem migration'],
      dicas: ['Comece pelos dois comandos.', 'Depois fale de um risco concreto: adicionar campo obrigatório.'] },
  ],
})

// ---- 03-django-orm.js
MODULOS.push({
  id: 'django-orm',
  titulo: 'Consultas com o ORM',
  icone: '🔎',
  aprende: 'QuerySets, filter/get, lookups, Q e F, annotate/aggregate e N+1',
  porque: 'Quase todo problema de desempenho em Django é uma consulta mal feita, e o ORM esconde o SQL até você aprender a enxergá-lo.',
  gancho: {
    titulo: 'A listagem que engasga',
    pergunta: 'A tela lista 50 processos com o nome do assistido. Quantas consultas vão ao banco?',
    linguagem: 'django',
    codigo: `processos = Processo.objects.all()[:50]
for p in processos:
    print(p.numero, p.assistido.nome)`,
    opcoes: ['1', '2', '50', '51'],
    certa: 3,
    revelacao: 'Uma consulta busca os processos e cada <code>p.assistido</code> dispara mais uma: é o N+1, o mesmo das relações lazy do TypeORM. Nesta lição você vai ver como enxergar o SQL e resolver com <code>select_related</code> numa linha.',
  },
  resumo: [
    'QuerySet é <b>preguiçoso</b>: só vai ao banco quando você itera, usa <code>len()</code>, <code>list()</code>, <code>bool()</code> ou imprime',
    '<code>filter()</code> e <code>exclude()</code> devolvem QuerySet; <code>get()</code> devolve <b>um</b> objeto ou lança <code>DoesNotExist</code>',
    'Lookups usam dois underscores: <code>nome__icontains</code>, <code>acertos__gte</code>, <code>deck__nome</code>',
    '<code>Q</code> monta OR e NOT; <code>F</code> referencia outra coluna e faz update atômico',
    '<code>annotate</code> adiciona um valor <b>por objeto</b>; <code>aggregate</code> devolve um <b>dict</b> com o total',
    '<code>select_related</code> (FK, JOIN) e <code>prefetch_related</code> (reverso e M2M, consulta extra) evitam o N+1',
  ],
  ensino: [
    { titulo: 'QuerySets são preguiçosos',
      texto: `<p><code>Deck.objects</code> é o <b>manager</b>, a porta de entrada das consultas. Cada <code>.filter()</code> devolve um <b>QuerySet novo</b>, sem tocar no banco. Você encadeia à vontade e o SQL só roda quando o resultado é necessário.</p>
<p>O que dispara a consulta: <code>for</code>, <code>list()</code>, <code>len()</code>, <code>bool()</code> / <code>if qs:</code>, fatiar com passo e o <code>repr</code> no shell. Fatiar sem passo (<code>qs[:10]</code>) continua preguiçoso e vira <code>LIMIT</code>.</p>
<p>Depois de avaliado, o QuerySet guarda o resultado em cache: iterar de novo <b>o mesmo objeto</b> não repete a consulta. Para só contar ou testar existência, use <code>.count()</code> e <code>.exists()</code>, que fazem SQL enxuto.</p>
<p><b>No TypeORM:</b> lembra o <code>QueryBuilder</code>, que só executa no <code>getMany()</code>. Aqui o "getMany" é implícito.</p>`,
      linguagem: 'django',
      codigo: `qs = Deck.objects.filter(publico=True)       # nenhuma consulta ainda
qs = qs.exclude(nome="").order_by("nome")    # ainda nenhuma
primeiros = qs[:10]                           # LIMIT 10, ainda preguiçoso

for deck in primeiros:                        # agora sim: 1 SELECT
    print(deck.nome)

print(qs.query)                               # mostra o SQL gerado` },
    { titulo: 'filter, exclude e get',
      texto: `<p><code>filter(**condições)</code> traz o que bate; <code>exclude()</code> traz o que não bate. Os dois devolvem QuerySet, mesmo vazio.</p>
<p><code>get()</code> é para buscar <b>exatamente um</b>. Se não achar, lança <code>Deck.DoesNotExist</code>; se achar mais de um, <code>Deck.MultipleObjectsReturned</code>. Use-o com campos únicos, como <code>pk</code>.</p>
<p>Quer "o primeiro ou nada"? <code>.first()</code> devolve o objeto ou <code>None</code>, sem exceção.</p>`,
      linguagem: 'django',
      codigo: `try:
    deck = Deck.objects.get(pk=deck_id)
except Deck.DoesNotExist:
    deck = None

ultimo = Card.objects.filter(deck=deck).order_by("-id").first()  # ou None` },
    { titulo: 'Lookups com __',
      texto: `<p>A condição é <code>campo__lookup=valor</code>. Sem lookup, vale <code>exact</code>. Os mais comuns:</p>
<ul><li><code>__icontains</code>: contém, sem diferenciar maiúscula (<code>ILIKE</code>/<code>LIKE</code>).</li>
<li><code>__gte</code>, <code>__lt</code>...: maior ou igual, menor que.</li>
<li><code>__in</code>: dentro de uma lista. <code>__isnull=True</code>: é NULL.</li>
<li><code>__year</code>, <code>__date</code>: partes de data.</li></ul>
<p>Os <code>__</code> também <b>atravessam relações</b>: <code>Card.objects.filter(deck__nome__icontains="inglês")</code> faz o JOIN sozinho.</p>
<p>Várias condições no mesmo <code>filter()</code> são combinadas com <b>AND</b>.</p>`,
      linguagem: 'django',
      codigo: `Card.objects.filter(frente__icontains="verbo", acertos__gte=3)
Deck.objects.filter(criado_em__year=2026, dono__isnull=False)
Card.objects.filter(deck__tags__nome__in=["inglês", "espanhol"]).distinct()` },
    { titulo: 'Q para OR, F para outra coluna',
      texto: `<p><code>Q</code> embrulha uma condição para combinar com <code>|</code> (OR), <code>&amp;</code> (AND) e <code>~</code> (NOT).</p>
<p><code>F("campo")</code> é uma referência à coluna, resolvida <b>no banco</b>. Serve para comparar duas colunas e para atualizar sem ler antes: <code>update(acertos=F("acertos") + 1)</code> vira <code>SET acertos = acertos + 1</code>, sem condição de corrida entre duas requisições.</p>
<p><b>Erro comum:</b> <code>card.acertos += 1; card.save()</code> em duas requisições simultâneas: as duas leem 5, as duas gravam 6, e um acerto se perde.</p>`,
      linguagem: 'django',
      codigo: `from django.db.models import Q, F

Deck.objects.filter(Q(nome__icontains="java") | Q(descricao__icontains="java"))
Deck.objects.filter(~Q(publico=True))

Card.objects.filter(erros__gt=F("acertos"))              # compara colunas
Card.objects.filter(pk=card_id).update(acertos=F("acertos") + 1)` },
    { titulo: 'annotate e aggregate',
      texto: `<p><code>aggregate()</code> resume o QuerySet inteiro e devolve um <b>dict</b>: <code>{"media": 4.2}</code>. É o fim da cadeia.</p>
<p><code>annotate()</code> calcula um valor <b>para cada objeto</b> (vira <code>GROUP BY</code>) e devolve um QuerySet, que você ainda pode filtrar e ordenar pelo valor novo.</p>
<p>As funções ficam em <code>django.db.models</code>: <code>Count</code>, <code>Sum</code>, <code>Avg</code>, <code>Max</code>, <code>Min</code>.</p>`,
      linguagem: 'django',
      codigo: `from django.db.models import Count, Avg

Card.objects.aggregate(media=Avg("acertos"))   # {'media': 4.2}

decks = Deck.objects.annotate(total=Count("cards")).filter(total__gte=10)
for deck in decks:
    print(deck.nome, deck.total)` },
    { titulo: 'N+1: select_related e prefetch_related',
      texto: `<p>O <b>N+1</b>: uma consulta traz 50 cards, e cada <code>card.deck.nome</code> dispara mais uma. São 51 consultas para uma lista.</p>
<ul><li><code>select_related("deck")</code>: para <b>ForeignKey e OneToOne</b> (lado "um"). Faz <b>JOIN</b> numa consulta só.</li>
<li><code>prefetch_related("cards")</code> ou <code>("tags")</code>: para o <b>lado reverso</b> e <b>ManyToMany</b>. Faz uma segunda consulta com <code>IN (...)</code> e junta em Python. Total: 2 consultas.</li></ul>
<p><b>No TypeORM:</b> é o <code>relations: ['deck']</code> ou <code>leftJoinAndSelect</code>. Para enxergar o problema, use o django-debug-toolbar ou <code>assertNumQueries</code> nos testes.</p>`,
      linguagem: 'django',
      codigo: `# N+1: 1 consulta + 1 por card
for card in Card.objects.all():
    print(card.deck.nome)

# 1 consulta com JOIN
for card in Card.objects.select_related("deck"):
    print(card.deck.nome)

# 2 consultas: decks + todos os cards deles
for deck in Deck.objects.prefetch_related("cards"):
    print(deck.nome, [c.frente for c in deck.cards.all()])` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Quantas consultas ao banco este trecho faz?',
      codigo: `qs = Card.objects.filter(acertos__gte=3)
qs = qs.exclude(frente="")
qs = qs.order_by("frente")`,
      opcoes: ['Nenhuma', 'Uma', 'Três', 'Uma por card'],
      certa: 0,
      dicas: ['Algum resultado foi usado?', 'Encadear filtros só monta o SQL.'],
      explica: 'QuerySets são preguiçosos: nada foi iterado, contado nem impresso, então nenhum SQL rodou. "Três" é o palpite de quem pensa que cada método vai ao banco.' },
    { tipo: 'escolha',
      pergunta: 'O que acontece se não existir deck com <code>pk=99</code>?',
      codigo: `deck = Deck.objects.get(pk=99)`,
      opcoes: ['Lança Deck.DoesNotExist', 'Retorna None', 'Retorna um QuerySet vazio', 'Lança Http404'],
      certa: 0,
      dicas: ['<code>get</code> promete exatamente um objeto.', 'Quem retorna <code>None</code> é o <code>.first()</code>.'],
      explica: '<code>get()</code> lança <code>DoesNotExist</code> quando não acha. <code>Http404</code> só aparece se você usar <code>get_object_or_404</code>, que é um atalho de view.' },
    { tipo: 'completar',
      pergunta: 'Complete para buscar os cards cuja frente contém "verbo" (sem diferenciar maiúscula) e com pelo menos 3 acertos:',
      codigo: `Card.objects.filter(frente__[[0]]="verbo", acertos__[[1]]=3)`,
      respostas: [['icontains'], ['gte']],
      dicas: ['"contains" com um "i" na frente ignora maiúsculas.', '"greater than or equal".'],
      explica: '<code>__icontains</code> vira um <code>LIKE</code> sem diferenciar caixa e <code>__gte</code> vira <code>&gt;=</code>. <code>__contains</code> diferencia maiúscula (em bancos que suportam).' },
    { tipo: 'montar',
      pergunta: 'Monte a busca de decks cujo nome OU descrição contém "inglês":',
      certa: ['Deck.objects.filter(', 'Q(nome__icontains="inglês")', '|', 'Q(descricao__icontains="inglês")', ')'],
      extras: ['&', 'F(nome__icontains="inglês")', 'or'],
      dicas: ['Vírgula entre condições é AND. Para OR, embrulhe cada condição.', 'O operador de OR entre objetos <code>Q</code> é <code>|</code>.'],
      explica: '<code>Q(...) | Q(...)</code> gera <code>WHERE ... OR ...</code>. O <code>or</code> do Python não funciona: ele avalia a verdade do primeiro <code>Q</code> e devolve só ele, perdendo a segunda condição sem dar erro.' },
    { tipo: 'escolha',
      pergunta: 'Duas requisições registram acerto no mesmo card ao mesmo tempo. Qual forma não perde contagem?',
      opcoes: ['Card.objects.filter(pk=pk).update(acertos=F("acertos") + 1)', 'card.acertos += 1; card.save()', 'card.acertos = card.acertos + 1; card.save(update_fields=["acertos"])', 'Card.objects.filter(pk=pk).update(acertos=card.acertos + 1)'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['O problema é ler o valor em Python e gravar depois.', 'Qual opção deixa o banco fazer a soma?'],
      explica: 'Com <code>F</code>, o SQL é <code>SET acertos = acertos + 1</code>, e o banco serializa as duas atualizações. As outras leem o valor em Python antes; <code>update_fields</code> só reduz as colunas gravadas, não resolve a corrida.' },
    { tipo: 'escolha',
      pergunta: 'O que <code>Deck.objects.aggregate(total=Count("cards"))</code> devolve?',
      opcoes: ['Um dict, como {"total": 120}', 'Um QuerySet de decks, cada um com .total', 'Um inteiro, 120', 'Uma lista de tuplas (deck, total)'],
      certa: 0,
      dicas: ['<code>aggregate</code> resume tudo num resultado só.', 'Quem devolve um valor por objeto é o <code>annotate</code>.'],
      explica: '<code>aggregate</code> encerra a cadeia e devolve um dict com as chaves que você nomeou. O QuerySet com <code>.total</code> em cada deck é o resultado de <code>annotate</code>.' },
    { tipo: 'completar',
      pergunta: 'A página lista 50 cards mostrando <code>card.deck.nome</code> e o banco recebe 51 consultas. Complete para fazer uma só:',
      codigo: `cards = Card.objects.[[0]]("[[1]]")`,
      respostas: [['select_related'], ['deck']],
      dicas: ['<code>deck</code> é uma ForeignKey: o lado "um" da relação.', 'Para FK, o Django pode fazer JOIN.'],
      explica: '<code>select_related("deck")</code> faz um JOIN e traz o deck junto de cada card. <code>prefetch_related</code> também resolveria, mas com 2 consultas; ele é a escolha para o lado reverso e M2M.' },
    { tipo: 'escolha',
      pergunta: 'Você lista decks e, para cada um, mostra as tags (<code>ManyToManyField</code>). Qual otimização usar?',
      opcoes: ['prefetch_related("tags")', 'select_related("tags")', 'annotate(Count("tags"))', 'only("tags")'],
      opcoesCodigo: true,
      certa: 0,
      dicas: ['Um deck tem muitas tags: um JOIN multiplicaria as linhas.', '<code>select_related</code> só aceita FK e OneToOne.'],
      explica: 'Para M2M e relações reversas, <code>prefetch_related</code> faz uma consulta extra com <code>IN</code> e junta em Python. <code>select_related("tags")</code> lança <code>FieldError</code> porque tags não é uma relação de valor único.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: o que é o problema N+1 e como você o encontra e corrige no Django?',
      avalia: 'Se você reconhece o padrão, sabe medir e escolhe entre select_related e prefetch_related pelo tipo de relação.',
      resposta: `<p>N+1 é quando uma consulta traz N objetos e, ao acessar uma relação de cada um, o ORM faz mais uma consulta por objeto. Uma lista de 50 cards mostrando o nome do deck vira 51 consultas.</p>
<p>Eu encontro com o django-debug-toolbar em desenvolvimento ou com <code>assertNumQueries</code> nos testes. Para corrigir: <code>select_related</code> para ForeignKey e OneToOne, que faz JOIN numa consulta; <code>prefetch_related</code> para relações reversas e ManyToMany, que faz uma consulta extra com <code>IN</code>. No TypeORM seria o <code>relations</code> ou o <code>leftJoinAndSelect</code>.</p>`,
      pontos: ['Definição: 1 consulta + 1 por objeto', 'Como medir: debug-toolbar, assertNumQueries ou log de SQL', 'select_related para FK/OneToOne (JOIN)', 'prefetch_related para reverso/M2M (consulta extra)'],
      evitar: ['Dizer que o ORM é lento e precisa de SQL cru', 'Trocar select_related e prefetch_related'],
      dicas: ['Dê um exemplo com números.', 'Diga como você mede antes de corrigir.'] },
  ],
})

// ---- 04-django-views.js
MODULOS.push({
  id: 'django-views',
  titulo: 'URLs, views e templates',
  icone: '🧭',
  aprende: 'urls.py e path, views em função e em classe, templates, get_object_or_404 e redirect',
  porque: 'É o caminho de toda requisição: saber ligar URL, view e template é o que permite entregar uma tela nova sem se perder no projeto.',
  gancho: {
    titulo: 'A rota sequestrada',
    pergunta: 'Qual view atende <code>GET /processos/novo/</code>?',
    linguagem: 'django',
    codigo: `urlpatterns = [
    path("processos/<str:numero>/", views.detalhe),
    path("processos/novo/", views.novo),
]`,
    opcoes: ['views.novo', 'views.detalhe, com numero="novo"', '404: rota ambígua', 'Erro ao subir: rotas em conflito'],
    certa: 1,
    revelacao: 'O Django testa as rotas <b>na ordem</b> e para na primeira que casa; <code>novo</code> é uma <code>str</code> válida. Nesta lição você vai ver como URL, view e template se ligam e como ordenar e nomear rotas sem surpresas.',
  },
  resumo: [
    '<code>path("decks/&lt;int:pk&gt;/", views.detalhe, name="deck-detalhe")</code> liga a URL à view e dá um nome a ela',
    'Uma view recebe <code>request</code> e devolve um <code>HttpResponse</code>; <code>render()</code> monta a resposta com um template',
    '<code>ListView</code> e <code>DetailView</code> fazem lista e detalhe com poucas linhas; use <code>.as_view()</code> no <code>path</code>',
    'No template: <code>{{ deck.nome }}</code> mostra valor (com escape), <code>{% for %}</code> e <code>{% url %}</code> são tags',
    '<code>get_object_or_404</code> troca o <code>DoesNotExist</code> por uma página 404',
    '<code>redirect("flashcards:deck-detalhe", pk=deck.pk)</code> resolve a URL pelo nome',
  ],
  ensino: [
    { titulo: 'urls.py: o roteador',
      texto: `<p>O <code>config/urls.py</code> é a raiz. Cada app tem o seu <code>urls.py</code>, plugado com <code>include()</code>. O <code>app_name</code> cria um <b>namespace</b>, então os nomes viram <code>flashcards:deck-detalhe</code>.</p>
<p>Conversores capturam partes da URL e passam para a view como argumento: <code>&lt;int:pk&gt;</code>, <code>&lt;slug:slug&gt;</code>, <code>&lt;str:nome&gt;</code>. Se o valor não bate (ex.: letras em <code>int</code>), o resultado é 404, antes de chegar na view.</p>
<p><b>No NestJS:</b> é o <code>@Controller('decks')</code> + <code>@Get(':id')</code> com <code>ParseIntPipe</code>, só que as rotas ficam num arquivo separado das funções.</p>`,
      linguagem: 'django',
      codigo: `# config/urls.py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("flashcards.urls")),
]

# flashcards/urls.py
from django.urls import path
from . import views

app_name = "flashcards"
urlpatterns = [
    path("decks/", views.lista, name="deck-lista"),
    path("decks/<int:pk>/", views.detalhe, name="deck-detalhe"),
]` },
    { titulo: 'View em função',
      texto: `<p>A view mais simples é uma função: recebe <code>request</code> (e os argumentos da URL) e devolve uma resposta. O atalho <code>render(request, template, contexto)</code> carrega o template, preenche com o dict de contexto e devolve o <code>HttpResponse</code>.</p>
<p><code>get_object_or_404(Deck, pk=pk)</code> faz o <code>get</code> e, se não achar, lança <code>Http404</code>. Sem ele, um id inexistente vira erro 500 por <code>DoesNotExist</code>.</p>
<p>O template é procurado em <code>flashcards/templates/flashcards/...</code>. A pasta repetida é proposital: evita colisão com templates de mesmo nome em outros apps.</p>`,
      linguagem: 'django',
      codigo: `from django.shortcuts import get_object_or_404, render
from .models import Deck


def lista(request):
    decks = Deck.objects.filter(publico=True)
    return render(request, "flashcards/lista.html", {"decks": decks})


def detalhe(request, pk):
    deck = get_object_or_404(Deck, pk=pk)
    cards = deck.cards.all()
    return render(request, "flashcards/detalhe.html", {"deck": deck, "cards": cards})` },
    { titulo: 'Templates e contexto',
      texto: `<p>A linguagem de template do Django é propositalmente limitada: lógica pesada fica na view.</p>
<ul><li><code>{{ deck.nome }}</code>: mostra um valor. O HTML é <b>escapado</b> automaticamente, protegendo contra XSS.</li>
<li><code>{% for card in cards %} ... {% empty %} ... {% endfor %}</code>: laço, com bloco para lista vazia.</li>
<li><code>{% url "flashcards:deck-detalhe" deck.pk %}</code>: gera o link pelo nome da rota.</li>
<li>Filtros: <code>{{ deck.criado_em|date:"d/m/Y" }}</code>, <code>{{ deck.descricao|truncatechars:80 }}</code>.</li></ul>
<p>Chamar método no template é sem parênteses: <code>{{ deck.cards.count }}</code>.</p>`,
      linguagem: 'django',
      codigo: `{% extends "base.html" %}

{% block conteudo %}
  <h1>Decks</h1>
  <ul>
    {% for deck in decks %}
      <li>
        <a href="{% url 'flashcards:deck-detalhe' deck.pk %}">{{ deck.nome }}</a>
        ({{ deck.cards.count }} cards)
      </li>
    {% empty %}
      <li>Nenhum deck ainda.</li>
    {% endfor %}
  </ul>
{% endblock %}` },
    { titulo: 'Class-based views: ListView e DetailView',
      texto: `<p>Para os padrões repetidos (listar, detalhar, criar), o Django tem views genéricas em classe. Você configura com atributos e sobrescreve métodos quando precisa.</p>
<ul><li><code>ListView</code>: põe a lista no contexto como <code>object_list</code> e <code>deck_list</code>. Template padrão: <code>flashcards/deck_list.html</code>.</li>
<li><code>DetailView</code>: busca pelo <code>pk</code> (ou <code>slug</code>) da URL, com 404 automático. Contexto: <code>object</code> e <code>deck</code>. Template padrão: <code>flashcards/deck_detail.html</code>.</li></ul>
<p>No <code>urls.py</code>, a classe entra com <code>.as_view()</code>. <b>Erro comum:</b> passar só <code>DeckListView</code>. O system check do Django acusa a rota inválida e sugere usar <code>DeckListView.as_view()</code>.</p>`,
      linguagem: 'django',
      codigo: `from django.views.generic import DetailView, ListView


class DeckListView(ListView):
    model = Deck
    paginate_by = 20
    context_object_name = "decks"

    def get_queryset(self):
        return Deck.objects.filter(publico=True).select_related("dono")


class DeckDetailView(DetailView):
    model = Deck

# urls.py
path("decks/", DeckListView.as_view(), name="deck-lista"),
path("decks/<int:pk>/", DeckDetailView.as_view(), name="deck-detalhe"),` },
    { titulo: 'redirect e reverse',
      texto: `<p>Depois de uma ação que altera dados (POST), responda com um <b>redirect</b>, não com uma página. Assim o F5 do usuário não reenvia o formulário (padrão Post/Redirect/Get).</p>
<p><code>redirect()</code> aceita o nome da rota com argumentos, uma URL ou um objeto com <code>get_absolute_url()</code>. Em código Python fora da view, <code>reverse("flashcards:deck-detalhe", args=[deck.pk])</code> devolve só a string da URL.</p>
<p>Use sempre nomes, nunca URLs escritas à mão: mudar o caminho no <code>urls.py</code> não quebra nenhum link.</p>`,
      linguagem: 'django',
      codigo: `from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_POST


@require_POST
def tornar_publico(request, pk):
    deck = get_object_or_404(Deck, pk=pk, dono=request.user)
    deck.publico = True
    deck.save(update_fields=["publico"])
    return redirect("flashcards:deck-detalhe", pk=deck.pk)` },
  ],
  exercicios: [
    { tipo: 'completar',
      pergunta: 'Complete a rota de detalhe que recebe o id numérico do deck e tem nome:',
      codigo: `urlpatterns = [
    [[0]]("decks/<[[1]]:pk>/", views.detalhe, [[2]]="deck-detalhe"),
]`,
      respostas: [['path'], ['int'], ['name']],
      dicas: ['A função de rota do Django moderno é a mesma de <code>admin/</code>.', 'O conversor de número inteiro; o argumento que permite usar <code>{% url %}</code> e <code>redirect</code>.'],
      explica: '<code>path</code> declara a rota, <code>&lt;int:pk&gt;</code> converte e passa <code>pk</code> para a view, e <code>name</code> permite gerar a URL pelo nome.' },
    { tipo: 'escolha',
      pergunta: 'Um usuário acessa <code>/decks/9999/</code> e recebe erro 500 com <code>Deck.DoesNotExist</code>. Qual a correção certa na view?',
      opcoes: ['Trocar Deck.objects.get(pk=pk) por get_object_or_404(Deck, pk=pk)', 'Trocar <int:pk> por <str:pk> na URL', 'Usar Deck.objects.filter(pk=pk) e passar o QuerySet para o template', 'Colocar DEBUG = False'],
      certa: 0,
      dicas: ['Recurso inexistente é 404, não 500.', 'Existe um atalho em <code>django.shortcuts</code> para isso.'],
      explica: '<code>get_object_or_404</code> converte o "não achei" em <code>Http404</code>. <code>DEBUG = False</code> só esconde a página de erro: continua sendo 500.' },
    { tipo: 'montar',
      pergunta: 'Monte o retorno de uma view em função que mostra a lista de decks:',
      certa: ['return', 'render(', 'request,', '"flashcards/lista.html",', '{"decks": decks}', ')'],
      extras: ['redirect(', 'HttpResponse(', 'self,'],
      dicas: ['O atalho recebe request, template e contexto, nessa ordem.', 'Views em função não têm <code>self</code>.'],
      explica: '<code>render(request, template, contexto)</code> devolve um <code>HttpResponse</code> com o HTML. <code>redirect</code> é para depois de uma ação, não para mostrar a página.' },
    { tipo: 'escolha',
      pergunta: 'Com esta view e sem <code>context_object_name</code>, que nomes o template <code>deck_list.html</code> recebe com a lista?',
      codigo: `class DeckListView(ListView):
    model = Deck`,
      opcoes: ['object_list e deck_list', 'decks', 'queryset', 'object e deck'],
      certa: 0,
      dicas: ['O nome padrão vem do nome do model, em minúsculas, com um sufixo.', '<code>object</code> e <code>deck</code> são da <code>DetailView</code>.'],
      explica: 'A <code>ListView</code> sempre põe <code>object_list</code> e também <code>&lt;model&gt;_list</code>, aqui <code>deck_list</code>. Para usar <code>decks</code>, defina <code>context_object_name = "decks"</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete o <code>urls.py</code> para usar a class-based view:',
      codigo: `path("decks/<int:pk>/", DeckDetailView.[[0]](), name="deck-detalhe"),`,
      respostas: [['as_view']],
      dicas: ['O <code>path</code> espera uma função, não uma classe.', 'Todo CBV tem um método de classe que devolve a função de view.'],
      explica: '<code>.as_view()</code> transforma a classe numa função que cria uma instância por requisição e despacha para <code>get</code>, <code>post</code> etc.' },
    { tipo: 'completar',
      pergunta: 'Complete o link para o detalhe do deck no template, usando o nome da rota:',
      codigo: `<a href="{% [[0]] 'flashcards:deck-detalhe' deck.pk %}">{{ [[1]] }}</a>`,
      respostas: [['url'], ['deck.nome']],
      dicas: ['A tag que gera URL a partir do nome.', 'Para mostrar um atributo, use chaves duplas e ponto.'],
      explica: '<code>{% url %}</code> resolve a rota pelo nome e argumentos; <code>{{ deck.nome }}</code> imprime o nome, já com escape de HTML.' },
    { tipo: 'escolha',
      pergunta: 'Depois de salvar um card novo vindo de um POST, por que responder com <code>redirect</code> em vez de <code>render</code>?',
      opcoes: ['Para o F5 do usuário não reenviar o POST e criar um card duplicado', 'Porque render não funciona com POST', 'Porque redirect é mais rápido que render', 'Para o Django validar o token CSRF'],
      certa: 0,
      dicas: ['Pense no que o navegador repete ao recarregar a página.', 'O padrão tem nome: Post/Redirect/Get.'],
      explica: 'Com o redirect, a última requisição do navegador vira um GET, e recarregar não duplica nada. <code>render</code> funciona com POST, só traz esse risco.' },
    { tipo: 'escolha',
      pergunta: 'Um deck tem <code>nome = "&lt;script&gt;alert(1)&lt;/script&gt;"</code>. O que <code>{{ deck.nome }}</code> faz no template?',
      opcoes: ['Mostra o texto com os sinais escapados, sem executar o script', 'Executa o script no navegador', 'Lança erro de template', 'Remove as tags e mostra alert(1)'],
      certa: 0,
      dicas: ['O Django liga o autoescape por padrão.', 'Para desligar, seria preciso o filtro <code>|safe</code>.'],
      explica: 'O autoescape troca <code>&lt;</code> por <code>&amp;lt;</code> e afins, então o navegador mostra o texto. Só <code>|safe</code> ou <code>mark_safe</code> desligam essa proteção, e devem ser usados com cuidado.' },
  ],
})

// ---- 05-django-forms.js
MODULOS.push({
  id: 'django-forms',
  titulo: 'Forms e admin',
  icone: '📝',
  aprende: 'Form e ModelForm, is_valid, cleaned_data, clean_campo, CSRF e o admin',
  porque: 'Toda entrada do usuário é suspeita: forms validam antes de salvar, e o admin entrega um painel de gestão de graça.',
  gancho: {
    titulo: 'Dados limpos cedo demais',
    pergunta: 'O que este código faz?',
    linguagem: 'django',
    codigo: `form = AssistidoForm(data={"nome": "Ana", "cpf": "12345678901"})
print(form.cleaned_data["nome"])`,
    opcoes: ['Imprime Ana', 'Imprime None', 'KeyError: nome', 'AttributeError: sem cleaned_data'],
    certa: 3,
    revelacao: '<code>cleaned_data</code> só passa a existir depois que <code>is_valid()</code> roda a validação; antes disso o atributo nem existe. Nesta lição você vai ver o ciclo do form, onde colocar suas regras e o admin que vem de graça.',
  },
  resumo: [
    '<code>forms.Form</code> declara campos à mão; <code>forms.ModelForm</code> gera os campos a partir do model',
    'Só depois de <code>form.is_valid()</code> existe <code>form.cleaned_data</code>, com valores limpos e convertidos',
    '<code>clean_&lt;campo&gt;()</code> valida um campo e <b>devolve</b> o valor; <code>clean()</code> valida campos juntos',
    'Todo <code>&lt;form method="post"&gt;</code> precisa de <code>{% csrf_token %}</code>, senão o Django responde 403',
    '<code>@admin.register(Deck)</code> + <code>ModelAdmin</code> com <code>list_display</code> e <code>search_fields</code> monta o painel',
  ],
  ensino: [
    { titulo: 'Form e ModelForm',
      texto: `<p>Um <b>Form</b> descreve os campos de entrada, como eles viram HTML e como são validados. Use <code>forms.Form</code> quando os dados não são um model (ex.: uma busca).</p>
<p>Quando o form cria ou edita um model, use <b>ModelForm</b>: na classe <code>Meta</code>, diga o <code>model</code> e os <code>fields</code>. Os tipos, o <code>max_length</code> e o <code>blank</code> vêm do model, e o <code>form.save()</code> grava no banco.</p>
<p><b>No NestJS:</b> o Form é o seu DTO com class-validator + <code>ValidationPipe</code>. O ModelForm seria um DTO gerado da entidade, com <code>PickType</code>.</p>
<p><b>Cuidado:</b> liste os campos em <code>fields</code>. <code>fields = "__all__"</code> deixa o usuário editar campos que você não pensou em expor, como <code>dono</code>.</p>`,
      linguagem: 'django',
      codigo: `from django import forms
from .models import Deck


class BuscaForm(forms.Form):
    termo = forms.CharField(max_length=50, required=False)
    so_publicos = forms.BooleanField(required=False)


class DeckForm(forms.ModelForm):
    class Meta:
        model = Deck
        fields = ["nome", "descricao", "publico"]` },
    { titulo: 'O ciclo na view: is_valid e cleaned_data',
      texto: `<p>O padrão é sempre o mesmo: no GET, form vazio; no POST, form preenchido com <code>request.POST</code>. Se <code>is_valid()</code> for verdadeiro, salve e redirecione. Se não, renderize de novo: o form já carrega os erros e os valores digitados.</p>
<p><code>form.cleaned_data</code> só existe <b>depois</b> de <code>is_valid()</code>, com os valores convertidos (<code>"on"</code> vira <code>True</code>, texto de data vira <code>date</code>). Tentar ler antes dá <code>AttributeError</code>.</p>
<p><code>save(commit=False)</code> devolve o objeto sem gravar, para completar campos que não vêm do usuário. Se o form tiver ManyToMany, chame <code>form.save_m2m()</code> depois.</p>`,
      linguagem: 'django',
      codigo: `from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render


@login_required
def criar_deck(request):
    if request.method == "POST":
        form = DeckForm(request.POST)
        if form.is_valid():
            deck = form.save(commit=False)
            deck.dono = request.user
            deck.save()
            return redirect("flashcards:deck-detalhe", pk=deck.pk)
    else:
        form = DeckForm()
    return render(request, "flashcards/deck_form.html", {"form": form})` },
    { titulo: 'Validação própria: clean_campo e clean',
      texto: `<p>Para uma regra de <b>um campo</b>, crie <code>clean_&lt;nome&gt;(self)</code>. Leia o valor em <code>self.cleaned_data</code>, lance <code>ValidationError</code> se for inválido e <b>devolva o valor</b> (pode ser transformado).</p>
<p>Para regras entre <b>vários campos</b>, sobrescreva <code>clean(self)</code>, chame <code>super().clean()</code> e use <code>self.add_error("campo", "mensagem")</code> para prender o erro num campo.</p>
<p><b>Erro comum:</b> esquecer o <code>return</code> no <code>clean_frente</code>. O valor do campo vira <code>None</code>; num ModelForm, o form volta inválido com "Este campo não pode ser nulo." mesmo com a frente preenchida.</p>`,
      linguagem: 'django',
      codigo: `from django.core.exceptions import ValidationError


class CardForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ["frente", "verso"]

    def clean_frente(self):
        frente = self.cleaned_data["frente"].strip()
        if len(frente) < 2:
            raise ValidationError("A frente precisa de pelo menos 2 letras.")
        return frente

    def clean(self):
        dados = super().clean()
        if dados.get("frente") and dados.get("frente") == dados.get("verso"):
            self.add_error("verso", "O verso não pode repetir a frente.")
        return dados` },
    { titulo: 'Template do form e CSRF',
      texto: `<p>No template, <code>{{ form }}</code> (ou <code>{{ form.as_p }}</code>) gera os campos, labels e mensagens de erro. Para controlar o layout, renderize campo a campo: <code>{{ form.nome }}</code> e <code>{{ form.nome.errors }}</code>.</p>
<p>O <b>CSRF</b> impede que outro site envie um POST usando a sessão do seu usuário. O <code>CsrfViewMiddleware</code> vem ligado: todo form POST precisa de <code>{% csrf_token %}</code>, que insere um campo oculto com o token.</p>
<p><b>Sintoma:</b> esqueceu a tag e a página mostra <b>403 Forbidden</b> "CSRF verification failed. Request aborted." Não desligue o middleware: coloque a tag.</p>`,
      linguagem: 'django',
      codigo: `<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Salvar deck</button>
</form>` },
    { titulo: 'O admin',
      texto: `<p>O <b>admin</b> (<code>/admin/</code>) é um painel de CRUD gerado a partir dos models, para a equipe interna. Entra com o usuário do <code>createsuperuser</code>.</p>
<p>Registre o model no <code>admin.py</code> do app. Com um <code>ModelAdmin</code>, você configura:</p>
<ul><li><code>list_display</code>: colunas da listagem.</li>
<li><code>search_fields</code>: campos da caixa de busca (aceita relações: <code>"dono__username"</code>).</li>
<li><code>list_filter</code>: filtros na lateral.</li>
<li><code>inlines</code>: editar os cards dentro da página do deck.</li></ul>
<p>Não existe equivalente pronto no NestJS: seria o AdminJS, que você instalaria à parte.</p>`,
      linguagem: 'django',
      codigo: `from django.contrib import admin
from .models import Card, Deck


class CardInline(admin.TabularInline):
    model = Card
    extra = 1


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ["nome", "dono", "publico", "criado_em"]
    list_filter = ["publico"]
    search_fields = ["nome", "dono__username"]
    inlines = [CardInline]` },
  ],
  exercicios: [
    { tipo: 'completar',
      pergunta: 'Complete o ModelForm que edita nome e descrição do deck:',
      codigo: `class DeckForm(forms.[[0]]):
    class [[1]]:
        model = Deck
        [[2]] = ["nome", "descricao"]`,
      respostas: [['ModelForm'], ['Meta'], ['fields']],
      dicas: ['É um form derivado do model.', 'A configuração fica numa classe interna, como nos models; a lista dos campos expostos tem nome fixo.'],
      explica: '<code>ModelForm</code> + <code>Meta.model</code> + <code>Meta.fields</code> geram os campos a partir do model. Listar os campos evita expor <code>dono</code> ou outros sem querer.' },
    { tipo: 'escolha',
      pergunta: 'O que acontece nesta view?',
      codigo: `form = DeckForm(request.POST)
nome = form.cleaned_data["nome"]
if form.is_valid():
    form.save()`,
      opcoes: ['AttributeError: cleaned_data só existe depois de is_valid()', 'Funciona: cleaned_data é preenchido no construtor', 'KeyError se o nome estiver vazio, senão funciona', 'O nome vem sem validação, mas o save valida de novo'],
      certa: 0,
      dicas: ['Quando a validação de fato acontece?', 'O form só limpa os dados quando alguém pede.'],
      explica: 'A validação roda em <code>is_valid()</code> (ou ao acessar <code>form.errors</code>), e é ela que cria <code>cleaned_data</code>. Antes disso o atributo não existe, por isso o erro é <code>AttributeError</code>, não <code>KeyError</code>.' },
    { tipo: 'escolha',
      pergunta: 'O usuário digita "Inglês básico". Depois de <code>is_valid()</code>, <code>form.cleaned_data["nome"]</code> vale <code>None</code>. Por quê?',
      codigo: `def clean_nome(self):
    nome = self.cleaned_data["nome"]
    if nome.lower() == "teste":
        raise ValidationError("Escolha um nome de verdade.")`,
      opcoes: ['Falta return nome: o valor devolvido substitui o do campo', 'Falta chamar super().clean_nome()', 'cleaned_data deveria ser self.data', 'ValidationError deveria ser ValueError'],
      certa: 0,
      dicas: ['O que uma função Python devolve quando não tem <code>return</code>?', 'O Django guarda o retorno do <code>clean_&lt;campo&gt;</code> em <code>cleaned_data</code>.'],
      explica: 'Sem <code>return</code>, a função devolve <code>None</code>, e esse <code>None</code> vira o valor do campo. Não existe <code>super().clean_nome()</code>: o método é seu. <code>ValueError</code> não seria tratado como erro de validação.' },
    { tipo: 'montar',
      pergunta: 'Monte o começo de um método que valida só o campo <code>verso</code>:',
      certa: ['def', 'clean_verso(self):', 'verso', '=', 'self.cleaned_data["verso"]'],
      extras: ['clean(self, verso):', 'request.POST["verso"]', 'validate_verso(self):'],
      dicas: ['O nome do método segue o padrão <code>clean_</code> + nome do campo.', 'O valor já limpo vem do dicionário do próprio form.'],
      explica: '<code>clean_verso(self)</code> é chamado automaticamente durante <code>is_valid()</code>, depois da validação do tipo do campo, e lê o valor em <code>self.cleaned_data</code>. <code>validate_verso</code> é o padrão do DRF, não dos forms do Django.' },
    { tipo: 'escolha',
      pergunta: 'Ao enviar o formulário de novo deck, a página mostra "403 Forbidden: CSRF verification failed". Qual a correção?',
      opcoes: ['Adicionar {% csrf_token %} dentro do form', 'Remover CsrfViewMiddleware do settings', 'Trocar method="post" por method="get"', 'Decorar a view com @csrf_exempt'],
      certa: 0,
      dicas: ['O middleware está fazendo o trabalho dele.', 'O form precisa mandar o token junto.'],
      explica: 'A tag insere o token oculto que o middleware confere. Desligar o middleware ou usar <code>@csrf_exempt</code> "resolve" abrindo uma falha de segurança; trocar para GET faria uma ação de escrita sem proteção e pela URL.' },
    { tipo: 'completar',
      pergunta: 'Complete a view para guardar o dono antes de gravar:',
      codigo: `if form.[[0]]():
    deck = form.save([[1]]=False)
    deck.dono = request.user
    deck.save()`,
      respostas: [['is_valid'], ['commit']],
      dicas: ['Primeiro, a validação.', 'O argumento que devolve o objeto sem gravar no banco.'],
      explica: '<code>save(commit=False)</code> monta o objeto do model sem gravar, para você completar campos que não vêm do usuário. Com ManyToMany no form, chame <code>form.save_m2m()</code> depois do <code>deck.save()</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete o admin para mostrar colunas e permitir busca por nome:',
      codigo: `@admin.[[0]](Deck)
class DeckAdmin(admin.ModelAdmin):
    [[1]] = ["nome", "dono", "publico"]
    [[2]] = ["nome"]`,
      respostas: [['register'], ['list_display'], ['search_fields']],
      dicas: ['O decorator que liga o model ao <code>ModelAdmin</code>.', 'Um atributo define as colunas; outro, os campos da busca.'],
      explica: '<code>@admin.register(Deck)</code> equivale a <code>admin.site.register(Deck, DeckAdmin)</code>. <code>list_display</code> define as colunas e <code>search_fields</code> ativa a caixa de busca.' },
    { tipo: 'escolha',
      pergunta: 'Na busca do admin de decks, você quer achar pelo nome de usuário do dono. Qual configuração funciona?',
      opcoes: ['search_fields = ["nome", "dono__username"]', 'search_fields = ["nome", "dono"]', 'list_display = ["dono__username"]', 'search_fields = ["nome", "dono.username"]'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['A busca precisa de um campo de texto, não da FK em si.', 'Relações são atravessadas como nos lookups do ORM.'],
      explica: '<code>search_fields</code> usa a mesma sintaxe dos lookups: <code>dono__username</code>. Usar só <code>"dono"</code> tenta buscar texto numa FK e gera erro; ponto não é sintaxe do ORM.' },
  ],
})

// ---- 06-django-drf.js
MODULOS.push({
  id: 'django-drf',
  titulo: 'API com DRF',
  icone: '🔌',
  aprende: 'ModelSerializer, validação, APIView, ViewSet com router, permissões e paginação',
  porque: 'A maioria das vagas Django é de API para front-end ou app, e o Django REST Framework é o padrão de mercado para isso.',
  gancho: {
    titulo: 'O JSON que falou demais',
    pergunta: 'O que aparece no JSON de <code>GET /api/usuarios/</code>?',
    linguagem: 'django',
    codigo: `from django.contrib.auth.models import User

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"`,
    opcoes: ['Só id, username e email', 'Tudo, menos a senha (o Django esconde)', 'Tudo, inclusive o hash da senha', 'Erro: password é protegido'],
    certa: 2,
    revelacao: '<code>"__all__"</code> é literal: vão <code>password</code> (o hash), <code>is_superuser</code> e o resto, sem nenhum <code>@Exclude()</code> automático como no class-transformer. Nesta lição você vai ver como declarar campos, <code>write_only</code> e permissões para a API expor só o que deve.',
  },
  resumo: [
    'O <b>serializer</b> converte model em JSON e valida o JSON que chega: é DTO e validação ao mesmo tempo',
    '<code>validate_&lt;campo&gt;(self, value)</code> valida um campo; <code>validate(self, attrs)</code> valida o conjunto',
    '<code>APIView</code> dá controle total (<code>get</code>, <code>post</code>); <code>ModelViewSet</code> + router entrega o CRUD inteiro',
    '<code>perform_create</code> com <code>serializer.save(dono=self.request.user)</code> preenche o que não vem do cliente',
    '<code>permission_classes</code> protege a view; <code>has_object_permission</code> protege cada objeto',
    'Paginação global em <code>REST_FRAMEWORK</code>: a resposta vira <code>count</code>, <code>next</code>, <code>previous</code>, <code>results</code>',
  ],
  ensino: [
    { titulo: 'ModelSerializer: o DTO do DRF',
      texto: `<p>Instale <code>djangorestframework</code> e adicione <code>"rest_framework"</code> em <code>INSTALLED_APPS</code>.</p>
<p>O <b>serializer</b> trabalha nos dois sentidos: <code>DeckSerializer(deck).data</code> vira um dict pronto para JSON, e <code>DeckSerializer(data=request.data)</code> valida a entrada e cria ou atualiza o model com <code>.save()</code>.</p>
<p>O <code>ModelSerializer</code> gera os campos e as validações a partir do model, como o ModelForm. Campos calculados ou só de leitura entram com <code>read_only=True</code> ou <code>read_only_fields</code>.</p>
<p><b>No NestJS:</b> é o DTO com class-validator na entrada + class-transformer na saída, num objeto só.</p>`,
      linguagem: 'django',
      codigo: `from rest_framework import serializers
from .models import Card, Deck


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "frente", "verso", "acertos"]
        read_only_fields = ["acertos"]


class DeckSerializer(serializers.ModelSerializer):
    dono = serializers.ReadOnlyField(source="dono.username")
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Deck
        fields = ["id", "nome", "descricao", "publico", "dono", "cards"]` },
    { titulo: 'Validação no serializer',
      texto: `<p>Igual aos forms, mas com outros nomes:</p>
<ul><li><code>validate_&lt;campo&gt;(self, value)</code>: recebe o valor do campo, lança <code>serializers.ValidationError</code> ou <b>devolve</b> o valor.</li>
<li><code>validate(self, attrs)</code>: recebe o dict com todos os campos e devolve o dict.</li></ul>
<p>Na view, <code>serializer.is_valid(raise_exception=True)</code> transforma os erros numa resposta <b>400</b> automática, no formato <code>{"nome": ["mensagem"]}</code>. Os dados válidos ficam em <code>serializer.validated_data</code>.</p>`,
      linguagem: 'django',
      codigo: `class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ["id", "nome", "descricao", "publico"]

    def validate_nome(self, value):
        if value.strip().lower() == "teste":
            raise serializers.ValidationError("Escolha um nome de verdade.")
        return value.strip()

    def validate(self, attrs):
        if attrs.get("publico") and not attrs.get("descricao"):
            raise serializers.ValidationError(
                {"descricao": "Decks públicos precisam de descrição."}
            )
        return attrs` },
    { titulo: 'APIView: controle total',
      texto: `<p><code>APIView</code> é a base: você escreve um método por verbo HTTP. O <code>request.data</code> já vem com o JSON parseado, e <code>Response</code> faz a negociação de conteúdo (JSON para o cliente, página navegável para o navegador).</p>
<p>Use para endpoints que não são CRUD, como "registrar resposta de estudo".</p>
<p><b>No NestJS:</b> é um controller com <code>@Get()</code> e <code>@Post()</code>. O <code>status.HTTP_201_CREATED</code> faz o papel do <code>@HttpCode(201)</code>.</p>`,
      linguagem: 'django',
      codigo: `from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class DeckListaAPI(APIView):
    def get(self, request):
        decks = Deck.objects.filter(dono=request.user)
        return Response(DeckSerializer(decks, many=True).data)

    def post(self, request):
        serializer = DeckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(dono=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)` },
    { titulo: 'ModelViewSet e router',
      texto: `<p>Um <code>ModelViewSet</code> junta listar, criar, detalhar, atualizar e apagar numa classe. O <b>router</b> gera as URLs:</p>
<ul><li><code>/api/decks/</code>: GET (list) e POST (create).</li>
<li><code>/api/decks/{pk}/</code>: GET (retrieve), PUT, PATCH e DELETE.</li></ul>
<p>Sobrescreva <code>get_queryset()</code> para filtrar por usuário e <code>perform_create()</code> para preencher o dono. Se a classe não tem o atributo <code>queryset</code>, o <code>register</code> precisa de <code>basename</code>.</p>
<p>Ações extras viram rotas com <code>@action</code>, por exemplo <code>POST /api/decks/{pk}/embaralhar/</code>.</p>`,
      linguagem: 'django',
      codigo: `from rest_framework import viewsets
from rest_framework.routers import DefaultRouter


class DeckViewSet(viewsets.ModelViewSet):
    serializer_class = DeckSerializer

    def get_queryset(self):
        return Deck.objects.filter(dono=self.request.user).prefetch_related("cards")

    def perform_create(self, serializer):
        serializer.save(dono=self.request.user)


# urls.py
router = DefaultRouter()
router.register("decks", DeckViewSet, basename="deck")
urlpatterns = [path("api/", include(router.urls))]` },
    { titulo: 'Permissões',
      texto: `<p><code>permission_classes</code> diz quem pode usar a view. As prontas: <code>AllowAny</code>, <code>IsAuthenticated</code>, <code>IsAuthenticatedOrReadOnly</code>, <code>IsAdminUser</code>. Sem configuração, o padrão do DRF é <code>AllowAny</code>: defina um padrão seguro em <code>DEFAULT_PERMISSION_CLASSES</code>.</p>
<p>Para regras por objeto ("só o dono edita"), herde de <code>BasePermission</code> e implemente <code>has_object_permission</code>. Ele roda no <code>get_object()</code>, ou seja, em retrieve, update e destroy, não no list.</p>
<p><b>No NestJS:</b> é o papel dos Guards (<code>@UseGuards(AuthGuard)</code>).</p>`,
      linguagem: 'django',
      codigo: `from rest_framework import permissions


class EhDonoOuSoLeitura(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.dono == request.user


class DeckViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, EhDonoOuSoLeitura]
    # ...` },
    { titulo: 'Paginação e configuração global',
      texto: `<p>Lista sem paginação é uma bomba-relógio: um dia o deck tem 10 mil cards. Configure no <code>settings.py</code> e todas as listas de ViewSets e generics passam a paginar.</p>
<p>Com <code>PageNumberPagination</code>, o cliente pede <code>?page=2</code> e recebe um envelope com <code>count</code>, <code>next</code>, <code>previous</code> e <code>results</code>. A alternativa <code>LimitOffsetPagination</code> usa <code>?limit=20&amp;offset=40</code>.</p>
<p><b>Atenção:</b> numa <code>APIView</code> pura, a paginação não é automática: você chamaria o paginador à mão.</p>`,
      linguagem: 'django',
      codigo: `REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# GET /api/decks/?page=2
# {"count": 45, "next": ".../?page=3", "previous": ".../?page=1", "results": [...]}` },
  ],
  exercicios: [
    { tipo: 'completar',
      pergunta: 'Complete o serializer do card, com <code>acertos</code> só de leitura:',
      codigo: `class CardSerializer(serializers.[[0]]):
    class Meta:
        model = Card
        fields = ["id", "frente", "verso", "acertos"]
        [[1]] = ["acertos"]`,
      respostas: [['ModelSerializer'], ['read_only_fields']],
      dicas: ['O serializer que gera campos a partir do model.', 'Uma opção do <code>Meta</code> lista os campos que o cliente não pode escrever.'],
      explica: '<code>ModelSerializer</code> gera os campos e <code>read_only_fields</code> faz <code>acertos</code> aparecer na resposta, mas ser ignorado se vier no POST.' },
    { tipo: 'escolha',
      pergunta: 'Na comparação com o NestJS, o que o serializer do DRF substitui?',
      opcoes: ['O DTO com class-validator (entrada) e a transformação da saída', 'O controller', 'O service com a regra de negócio', 'O repository do TypeORM'],
      certa: 0,
      dicas: ['Ele valida o JSON que chega.', 'E também formata o JSON que sai.'],
      explica: 'O serializer valida a entrada e formata a saída. O papel do controller é da view/ViewSet, e o do repository é do ORM (<code>Deck.objects</code>).' },
    { tipo: 'montar',
      pergunta: 'Monte a assinatura do método que valida só o campo <code>nome</code> num serializer:',
      certa: ['def', 'validate_nome(', 'self,', 'value', '):'],
      extras: ['clean_nome(', 'attrs', 'request,'],
      dicas: ['No DRF o prefixo é <code>validate_</code>, não <code>clean_</code>.', 'O método recebe o valor do campo como argumento.'],
      explica: '<code>validate_nome(self, value)</code> recebe o valor e devolve o valor (ou lança <code>ValidationError</code>). <code>clean_nome</code> é dos forms do Django e <code>attrs</code> é o argumento do <code>validate</code> geral.' },
    { tipo: 'escolha',
      pergunta: 'O cliente envia <code>{"nome": ""}</code> para uma view que chama <code>serializer.is_valid(raise_exception=True)</code>. O que ele recebe?',
      opcoes: ['400 com {"nome": ["This field may not be blank."]}', '500 com ValidationError no log', '200 com o deck criado sem nome', '422 Unprocessable Entity'],
      certa: 0,
      dicas: ['<code>raise_exception=True</code> deixa o DRF montar a resposta de erro.', 'O DRF usa 400 para erro de validação.'],
      explica: 'O DRF converte <code>ValidationError</code> em 400 com os erros por campo. 422 é a convenção de outros frameworks; no DRF o padrão é 400. (Com <code>LANGUAGE_CODE = "pt-br"</code>, a mensagem vem traduzida.)' },
    { tipo: 'completar',
      pergunta: 'Complete para o deck criado pela API pertencer ao usuário logado:',
      codigo: `class DeckViewSet(viewsets.ModelViewSet):
    serializer_class = DeckSerializer

    def [[0]](self, serializer):
        serializer.save(dono=self.[[1]].user)`,
      respostas: [['perform_create'], ['request']],
      dicas: ['Existe um gancho chamado na criação, antes de salvar.', 'O usuário vem da requisição guardada na própria view.'],
      explica: '<code>perform_create</code> é chamado pelo <code>create</code> do ViewSet depois da validação. Os kwargs de <code>save()</code> entram no <code>validated_data</code>, então o dono nunca vem do cliente.' },
    { tipo: 'escolha',
      pergunta: '<code>router.register("decks", DeckViewSet)</code> falha com "basename argument not specified". Por quê?',
      opcoes: ['A ViewSet usa get_queryset() e não tem o atributo queryset, de onde o router tira o nome', 'Falta "rest_framework" em INSTALLED_APPS', 'O prefixo precisa ser "decks/" com barra', 'DefaultRouter não aceita ModelViewSet'],
      certa: 0,
      dicas: ['O router precisa de um nome para as rotas, como <code>deck-list</code> e <code>deck-detail</code>.', 'Normalmente ele deriva esse nome do model do <code>queryset</code>.'],
      explica: 'Sem atributo <code>queryset</code>, o router não sabe o model para nomear as rotas: passe <code>basename="deck"</code>. As rotas ficam <code>deck-list</code> e <code>deck-detail</code>, úteis com <code>reverse</code> nos testes.' },
    { tipo: 'escolha',
      pergunta: 'Você quer que qualquer pessoa leia os decks, mas só usuários logados criem e editem. Qual permissão pronta usar?',
      opcoes: ['IsAuthenticatedOrReadOnly', 'IsAuthenticated', 'AllowAny', 'IsAdminUser'],
      certa: 0,
      opcoesCodigo: true,
      dicas: ['Leitura = métodos seguros (GET, HEAD, OPTIONS).', 'O nome da classe descreve as duas regras.'],
      explica: '<code>IsAuthenticatedOrReadOnly</code> libera os métodos seguros para todos e exige login para os outros. <code>IsAuthenticated</code> bloquearia a leitura anônima.' },
    { tipo: 'escolha',
      pergunta: 'Com <code>PageNumberPagination</code> configurada, qual o formato da resposta de <code>GET /api/decks/</code>?',
      opcoes: ['Um objeto com count, next, previous e results', 'Uma lista JSON pura com 20 decks', 'Uma lista com cabeçalho Link para a próxima página', 'Um objeto com page, total_pages e data'],
      certa: 0,
      dicas: ['A paginação envolve a lista num "envelope".', 'A lista em si fica na chave <code>results</code>.'],
      explica: 'A <code>PageNumberPagination</code> devolve <code>{"count", "next", "previous", "results"}</code>. Quem consome a API precisa ler <code>results</code>; esquecer disso é o bug clássico no front-end ao ligar a paginação.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: quando você usa APIView e quando usa ModelViewSet no DRF?',
      avalia: 'Se você conhece os níveis de abstração do DRF e escolhe pelo formato do endpoint, não por hábito.',
      resposta: `<p>Uso <code>ModelViewSet</code> com router quando o recurso é um CRUD de model: com o serializer, o <code>get_queryset</code> e o <code>perform_create</code>, tenho listagem paginada, detalhe, criação, edição e exclusão com pouco código, e as URLs saem do router.</p>
<p>Uso <code>APIView</code> quando o endpoint é uma ação que não mapeia para CRUD, como registrar uma sessão de estudo ou um webhook. Nesse caso escrevo os métodos <code>get</code>/<code>post</code> à mão e perco a paginação automática. No meio do caminho há as generics (<code>ListCreateAPIView</code>) e o <code>@action</code> para ações extras num ViewSet.</p>`,
      pontos: ['ModelViewSet + router para CRUD de model', 'APIView para ações que não são CRUD', 'Generics e @action como meio-termo', 'Paginação/filtros automáticos só nas genéricas e ViewSets'],
      evitar: ['Dizer que APIView é "antigo" e não deve ser usado'],
      dicas: ['Pense em quanto cada uma faz por você.', 'Dê um exemplo de endpoint que não é CRUD.'] },
  ],
})

// ---- 07-django-testes.js
MODULOS.push({
  id: 'django-testes',
  titulo: 'Testes',
  icone: '🧪',
  aprende: 'TestCase, Client, testes de model, view e API, fixtures, factories e pytest-django',
  porque: 'Teste é o que deixa você mexer em model, query ou permissão sem medo, e é o diferencial que aparece no code review e na entrevista.',
  gancho: {
    titulo: 'O banco que sumiu',
    pergunta: 'Seu banco de desenvolvimento tem 3.000 assistidos. O que acontece ao rodar os testes?',
    linguagem: 'django',
    codigo: `class AssistidoTests(TestCase):
    def test_cria(self):
        Assistido.objects.create(nome="Ana")
        self.assertEqual(Assistido.objects.count(), 1)

    def test_vazio(self):
        self.assertEqual(Assistido.objects.count(), 0)`,
    opcoes: ['Os dois passam', 'Os dois falham: há 3.000 registros', 'test_vazio falha se rodar depois de test_cria'],
    certa: 0,
    revelacao: 'O Django cria um <b>banco de teste vazio</b> e desfaz cada teste com uma transação, então a ordem não importa e seus dados de dev ficam intactos. Nesta lição você vai ver como testar model, view e API com esse isolamento.',
  },
  resumo: [
    '<code>django.test.TestCase</code> cria um banco de teste e desfaz cada teste com uma transação',
    '<code>setUpTestData</code> cria os dados <b>uma vez</b> por classe; <code>setUp</code> roda antes de <b>cada</b> teste',
    '<code>self.client</code> faz requisições sem servidor; <code>force_login</code> pula a tela de login',
    'Na API, <code>APITestCase</code> traz um <code>APIClient</code>: <code>force_authenticate</code> e <code>format="json"</code>',
    'Factories (factory_boy) criam dados válidos com uma linha; fixtures JSON envelhecem a cada migration',
    'pytest-django: funções simples, <code>@pytest.mark.django_db</code> e fixtures como <code>client</code>',
  ],
  ensino: [
    { titulo: 'TestCase e o banco de teste',
      texto: `<p><code>python manage.py test</code> procura arquivos <code>test*.py</code> nos apps, cria um <b>banco de teste</b> separado (aplicando as migrations) e o apaga no final. Seu banco de desenvolvimento não é tocado.</p>
<p>No <code>django.test.TestCase</code>, cada teste roda dentro de uma transação que é <b>desfeita</b> ao terminar: um teste nunca vê os dados de outro.</p>
<p>Crie dados compartilhados em <code>setUpTestData</code> (um <code>classmethod</code>, roda uma vez por classe, mais rápido). Use <code>setUp</code> quando cada teste precisar de um objeto novo.</p>
<p><b>No NestJS:</b> é o Jest com um <code>Test.createTestingModule</code> e um banco de teste, só que o isolamento por transação já vem pronto.</p>`,
      linguagem: 'django',
      codigo: `from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import Card, Deck


class DeckModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.ana = get_user_model().objects.create_user(username="ana", password="senha-forte-123")
        cls.deck = Deck.objects.create(nome="Inglês", dono=cls.ana)

    def test_str_mostra_o_nome(self):
        self.assertEqual(str(self.deck), "Inglês")

    def test_apagar_deck_apaga_os_cards(self):
        Card.objects.create(deck=self.deck, frente="go", verso="ir")
        self.deck.delete()
        self.assertFalse(Card.objects.exists())` },
    { titulo: 'Testando views com o Client',
      texto: `<p><code>self.client</code> simula um navegador: faz GET e POST direto na sua stack de URLs, middlewares e views, <b>sem subir servidor</b>. Gere as URLs com <code>reverse()</code> para o teste não quebrar se o caminho mudar.</p>
<p>Asserts úteis do Django:</p>
<ul><li><code>assertContains(resp, "Inglês")</code>: status 200 e o texto no HTML.</li>
<li><code>assertTemplateUsed(resp, "flashcards/lista.html")</code>.</li>
<li><code>assertRedirects(resp, url)</code>: confere o 302 e o destino.</li></ul>
<p>Para views com <code>@login_required</code>, use <code>self.client.force_login(usuario)</code>.</p>`,
      linguagem: 'django',
      codigo: `from django.urls import reverse


class CriarDeckViewTest(TestCase):
    def setUp(self):
        self.ana = get_user_model().objects.create_user(username="ana", password="x")

    def test_anonimo_vai_para_o_login(self):
        resp = self.client.get(reverse("flashcards:deck-criar"))
        self.assertEqual(resp.status_code, 302)

    def test_post_valido_cria_e_redireciona(self):
        self.client.force_login(self.ana)
        resp = self.client.post(reverse("flashcards:deck-criar"), {"nome": "Espanhol"})
        deck = Deck.objects.get(nome="Espanhol")
        self.assertEqual(deck.dono, self.ana)
        self.assertRedirects(resp, reverse("flashcards:deck-detalhe", args=[deck.pk]))` },
    { titulo: 'Testando a API',
      texto: `<p>Para o DRF, herde de <code>rest_framework.test.APITestCase</code>: o <code>self.client</code> vira um <code>APIClient</code>.</p>
<ul><li><code>force_authenticate(user=...)</code>: autentica sem token nem senha.</li>
<li><code>format="json"</code>: manda o corpo como JSON (o padrão é multipart).</li>
<li><code>resp.data</code>: a resposta já como dict/lista Python, antes de virar JSON.</li></ul>
<p>Teste também o que <b>não</b> pode acontecer: anônimo recebendo 401/403, um usuário vendo o deck de outro. E use <code>assertNumQueries</code> para travar o N+1.</p>`,
      linguagem: 'django',
      codigo: `from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class DeckAPITest(APITestCase):
    def setUp(self):
        self.ana = get_user_model().objects.create_user(username="ana", password="x")
        self.client.force_authenticate(user=self.ana)

    def test_cria_deck_do_usuario_logado(self):
        resp = self.client.post(reverse("deck-list"), {"nome": "Kanji"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Deck.objects.get().dono, self.ana)

    def test_lista_sem_n_mais_1(self):
        for nome in ["Kanji", "Verbos", "Capitais"]:
            Deck.objects.create(nome=nome, dono=self.ana)
        with self.assertNumQueries(3):  # count + decks + cards (prefetch)
            self.client.get(reverse("deck-list"))` },
    { titulo: 'Fixtures e factories',
      texto: `<p><b>Fixtures</b> são arquivos JSON com dados (gerados por <code>dumpdata</code>), carregados com <code>fixtures = ["decks.json"]</code> na classe de teste. O problema: a cada campo novo no model, o JSON precisa ser editado à mão.</p>
<p><b>Factories</b> com factory_boy geram objetos válidos em Python: você só informa o que importa para o teste. <code>SubFactory</code> cria as relações sozinho, e <code>Sequence</code> evita violar <code>unique</code>.</p>
<p><b>No NestJS:</b> é o mesmo papel de bibliotecas como fishery ou de funções <code>makeUser()</code> que você escreveria à mão.</p>`,
      linguagem: 'django',
      codigo: `import factory
from django.contrib.auth import get_user_model


class UsuarioFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.Sequence(lambda n: f"usuario{n}")


class DeckFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Deck

    nome = factory.Sequence(lambda n: f"Deck {n}")
    dono = factory.SubFactory(UsuarioFactory)


# no teste
deck = DeckFactory(publico=True)       # cria usuário e deck
decks = DeckFactory.create_batch(5)` },
    { titulo: 'pytest-django',
      texto: `<p>Muitos times preferem o <b>pytest</b>: testes são funções com <code>assert</code> simples, e as dependências chegam como <b>fixtures</b> por parâmetro (parecido com injeção de dependência).</p>
<p>Instale <code>pytest-django</code>, aponte o settings no <code>pytest.ini</code> (ou <code>pyproject.toml</code>) e rode <code>pytest</code>. Testes que usam o banco precisam de <code>@pytest.mark.django_db</code>; sem ele, o erro é "Database access not allowed".</p>
<p>Fixtures prontas: <code>client</code>, <code>admin_client</code>, <code>django_user_model</code>, <code>settings</code>. O pytest também roda os seus <code>TestCase</code> antigos, então dá para migrar aos poucos.</p>`,
      linguagem: 'django',
      codigo: `# pytest.ini
# [pytest]
# DJANGO_SETTINGS_MODULE = config.settings

import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_lista_mostra_decks_publicos(client):
    DeckFactory(nome="Inglês", publico=True)
    DeckFactory(nome="Secreto", publico=False)

    resp = client.get(reverse("flashcards:deck-lista"))

    assert resp.status_code == 200
    assert "Inglês" in resp.content.decode()
    assert "Secreto" not in resp.content.decode()` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'Um teste cria 3 decks. O teste seguinte, na mesma classe <code>TestCase</code>, conta os decks. Quantos ele encontra (sem contar os do <code>setUpTestData</code>)?',
      opcoes: ['Zero: cada teste é desfeito por uma transação', 'Três: o banco de teste é compartilhado', 'Depende da ordem alfabética dos testes', 'Erro: o banco de teste é recriado a cada teste'],
      certa: 0,
      dicas: ['O <code>TestCase</code> embrulha cada teste numa transação.', 'O que acontece com a transação no fim do teste?'],
      explica: 'O <code>TestCase</code> faz rollback ao fim de cada teste, então os testes não dependem uns dos outros. O banco não é recriado a cada teste (seria lento demais), só a transação é desfeita.' },
    { tipo: 'completar',
      pergunta: 'Complete para criar os dados uma vez só para toda a classe:',
      codigo: `class DeckTest(TestCase):
    @[[0]]
    def [[1]](cls):
        cls.deck = Deck.objects.create(nome="Inglês")`,
      respostas: [['classmethod'], ['setUpTestData']],
      dicas: ['O método recebe <code>cls</code>, não <code>self</code>.', 'O nome combina "setUp" com "TestData".'],
      explica: '<code>setUpTestData</code> é um <code>classmethod</code> que roda uma vez por classe; o <code>TestCase</code> protege os dados para cada teste começar com eles intactos. <code>setUp</code> rodaria antes de cada teste.' },
    { tipo: 'completar',
      pergunta: 'Complete o teste da página de lista:',
      codigo: `def test_lista_mostra_o_deck(self):
    resp = self.[[0]].get([[1]]("flashcards:deck-lista"))
    self.[[2]](resp, "Inglês")`,
      respostas: [['client'], ['reverse'], ['assertContains']],
      dicas: ['O navegador falso já vem pronto no <code>TestCase</code>.', 'A URL vem do nome da rota; o assert confere status 200 e texto.'],
      explica: '<code>self.client</code> faz a requisição, <code>reverse</code> resolve a URL pelo nome e <code>assertContains</code> checa o status 200 e o texto no HTML de uma vez.' },
    { tipo: 'escolha',
      pergunta: 'Num <code>APITestCase</code>, para que serve o <code>format="json"</code> em <code>self.client.post(url, dados, format="json")</code>?',
      opcoes: ['Envia o corpo como JSON, como o front-end real faz; sem ele, o APIClient manda multipart', 'Faz a resposta voltar em JSON em vez de HTML', 'Autentica a requisição com token', 'É obrigatório: sem ele o APIClient lança erro'],
      certa: 0,
      dicas: ['O argumento fala do que você envia, não do que recebe.', 'O padrão do APIClient é o mesmo de um formulário HTML com upload.'],
      explica: 'O <code>format</code> define o corpo e o <code>Content-Type</code> da <b>requisição</b>. Sem ele, vai multipart, e dados aninhados (um deck com cards dentro) não chegam como no JSON real. A resposta é lida em <code>resp.data</code> de qualquer jeito. Dá para mudar o padrão com <code>TEST_REQUEST_DEFAULT_FORMAT</code>.' },
    { tipo: 'montar',
      pergunta: 'Monte a linha que autentica o usuário no cliente de teste da API, sem token:',
      certa: ['self.client', '.force_authenticate(', 'user=self.ana', ')'],
      extras: ['.login(', '.force_login(', 'token=self.ana'],
      dicas: ['O <code>APIClient</code> tem um método que pula a autenticação.', 'O argumento nomeado é o usuário.'],
      explica: '<code>force_authenticate(user=...)</code> faz o DRF tratar a requisição como autenticada, sem senha nem token. <code>force_login</code> também existe, mas cria uma sessão e só vale para <code>SessionAuthentication</code>.' },
    { tipo: 'escolha',
      pergunta: 'Por que muitos times trocam fixtures JSON por factories?',
      opcoes: ['A fixture precisa ser editada à mão a cada campo novo; a factory só declara o que importa', 'Fixtures não funcionam com TestCase', 'Factories não usam o banco de dados', 'Fixtures só funcionam com SQLite'],
      certa: 0,
      dicas: ['Pense no que acontece com o JSON depois de várias migrations.', 'Na factory, campos novos com default não exigem mudança.'],
      explica: 'Fixtures são um retrato do banco que envelhece a cada migration. A factory gera dados válidos em código e deixa explícito, no teste, o dado que importa. Factories usam o banco sim (<code>create</code>), a menos que você use <code>build</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete o teste no estilo pytest-django:',
      codigo: `@pytest.mark.[[0]]
def test_lista_responde_200([[1]]):
    resp = client.get(reverse("flashcards:deck-lista"))
    [[2]] resp.status_code == 200`,
      respostas: [['django_db'], ['client'], ['assert']],
      dicas: ['Sem o marcador, o pytest-django bloqueia o acesso ao banco.', 'O cliente chega como fixture, pelo nome do parâmetro; no pytest, o assert é a palavra-chave do Python.'],
      explica: '<code>@pytest.mark.django_db</code> libera o banco, o parâmetro <code>client</code> recebe a fixture do <code>django.test.Client</code> e o <code>assert</code> simples substitui o <code>assertEqual</code>.' },
    { tipo: 'entrevista',
      pergunta: 'Explique em voz alta: o que você testaria numa API de decks feita com DRF?',
      avalia: 'Se você testa comportamento e regras (permissão, validação, dono) e não só o caminho feliz.',
      resposta: `<p>Eu testaria o contrato e as regras. No caminho feliz: criar deck retorna 201 e grava com o dono sendo o usuário logado, e a listagem retorna só os decks dele, paginados. Nas regras: anônimo recebe 401 ou 403, um usuário não consegue editar o deck de outro, e dados inválidos voltam 400 com o erro no campo certo.</p>
<p>Uso <code>APITestCase</code> ou pytest-django com <code>APIClient</code>, <code>force_authenticate</code> para não depender de token e factories para criar os dados. Também coloco um <code>assertNumQueries</code> na listagem para pegar N+1. No NestJS seria o equivalente aos testes e2e com supertest.</p>`,
      pontos: ['Status e corpo do caminho feliz', 'Permissões: anônimo e usuário de outro dono', 'Validação: 400 com erro no campo', 'Dados com factories e force_authenticate', 'assertNumQueries contra N+1'],
      evitar: ['Testar só que o endpoint responde 200', 'Testar detalhes internos do DRF em vez do comportamento'],
      dicas: ['Separe caminho feliz e regras de acesso.', 'Lembre do que costuma quebrar em produção: permissão e N+1.'] },
  ],
})

const ordem = CURSO.partes.flatMap(p => p.ids)
const LICOES = ordem.map(id => MODULOS.find(m => m.id === id)).filter(Boolean)
globalThis.TRILHAS_CARREGADAS = globalThis.TRILHAS_CARREGADAS || {}
globalThis.TRILHAS_CARREGADAS["django"] = { CURSO, LICOES, MODULOS }
})()
