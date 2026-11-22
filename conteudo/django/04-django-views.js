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
  videos: [
    { id: 'fGtx3MHxxIw', titulo: 'Class Based Views VS Function Based Views | Django', canal: 'pythonando',
      duracao: '21:14', idioma: 'pt',
      nota: 'Compare a mesma tela feita com view em função e com classe, e note como a rota em <code>urls.py</code> aponta para cada uma.' },
    { id: 'DDIP-icVpA8', titulo: 'Django - Generic & Class-Based Views! (an alternative to functions)', canal: 'BugBytes',
      duracao: '13:48', idioma: 'en',
      nota: 'Veja <code>ListView</code> e <code>DetailView</code> trocando dezenas de linhas por poucas e quais nomes de template e contexto elas esperam.' },
  ],
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
