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
  videos: [
    { id: 'BMym71Dwox0', titulo: 'Django REST Framework - Serializers & Response objects | Browsable API', canal: 'BugBytes',
      duracao: '24:54', idioma: 'en',
      nota: 'Observe o <code>ModelSerializer</code> escolhendo os campos expostos, que é o que evita o JSON que falou demais do gancho.' },
    { id: '4MrB4IvW6Ow', titulo: 'Viewsets & Routers in Django REST Framework', canal: 'BugBytes',
      duracao: '14:44', idioma: 'en',
      nota: 'Repare como um <code>ModelViewSet</code> com router gera todas as rotas do CRUD e onde entram as permissões.' },
  ],
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
