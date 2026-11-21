MODULOS.push({
  id: 'django-models',
  titulo: 'Models e migrations',
  icone: '🗃️',
  aprende: 'models.Model, campos, ForeignKey, ManyToMany, migrations, __str__ e Meta',
  porque: 'O model é a fonte da verdade do banco: errar um on_delete ou um campo obrigatório vira dado perdido ou migration dolorosa em produção.',
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
