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
  videos: [
    { id: 'jrqd_zNMhFk', titulo: 'Criando Filtros poderosos no Django | Segredos do ORM | Queryset - Dica #25.1', canal: 'Regis do Python',
      duracao: '14:31', idioma: 'pt',
      nota: 'Repare nos lookups com <code>__</code> e na combinação de filtros com <code>Q</code>, o núcleo das consultas deste módulo.' },
    { id: 'FNn_qwH1Yi0', titulo: 'Melhorar o desempenho de queries no Django com select_related e prefetch_related', canal: 'Samuel Gonçalves',
      duracao: '23:15', idioma: 'pt',
      nota: 'Conte as queries antes e depois: é o N+1 da listagem que engasga do gancho sendo resolvido com <code>select_related</code> e <code>prefetch_related</code>.' },
  ],
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
