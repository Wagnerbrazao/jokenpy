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
  videos: [
    { id: 'jogkxIkCzI8', titulo: 'Dica #04 - Django Admin personalizado', canal: 'Regis do Python',
      duracao: '9:50', idioma: 'pt',
      nota: 'Veja como <code>list_display</code>, filtros e busca transformam o admin padrão numa tela útil com poucas linhas.' },
  ],
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
