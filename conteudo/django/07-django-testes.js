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
