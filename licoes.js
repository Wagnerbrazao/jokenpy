// Conteúdo do curso. Cada lição tem um ensino (cartões curtos com exemplo que roda) e depois exercícios.
// O ensino pode ser pulado; a teoria fica disponível durante os exercícios no botão 📖 Teoria.
// Campos da lição:
//   resumo  -> 3 a 6 frases curtas (HTML): a "cola" da lição
//   ensino  -> cartões { titulo, texto (HTML), codigo?, entrada? }; todo código de cartão roda sem erro
// Tipos de exercício:
//   escolha   -> múltipla escolha (certa = índice da opção correta; a tela embaralha)
//   completar -> código com lacunas [[0]], [[1]]... (respostas = lista de aceitas por lacuna)
//   montar    -> montar a linha com peças na ordem certa (extras = peças que confundem)
//   codigo    -> escrever Python de verdade; roda no servidor com a entrada e os testes
// Todo exercício tem:
//   dicas   -> 2 ou 3 dicas progressivas (HTML): 1) relembra o conceito, 2) aponta o ponto exato, 3) quase entrega
//   explica -> mostrado depois de responder: o porquê (e, na escolha, por que a opção tentadora está errada)

const VENCE = `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}`

const RESULTADO = `def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"`

const LICOES = [
  {
    id: 'print', titulo: 'Mostrar na tela', icone: '💬', aprende: 'print, strings, variáveis e f-string',
    resumo: [
      `O programa roda <b>de cima para baixo</b>, uma linha por vez`,
      `<code>print(x)</code> mostra <code>x</code> na tela`,
      `Texto vai entre aspas: <code>"pedra"</code> é uma <b>string</b>`,
      `<code>jogada = "pedra"</code> guarda o valor no nome <code>jogada</code>`,
      `Variável se usa <b>sem aspas</b>: <code>print(jogada)</code>`,
      `<code>f"Você jogou {jogada}"</code> encaixa o valor da variável no texto`,
    ],
    ensino: [
      { titulo: 'Um programa é uma lista de ordens',
        texto: `<p>Programar é escrever instruções que o computador executa <b>na ordem</b>, de cima para baixo, uma por linha. Como uma receita: ele não pula passos nem adivinha o que você quis dizer.</p>
<p>A primeira instrução é <code>print()</code>. Ela mostra na tela o que estiver entre os parênteses. É o jeito do programa falar com quem está usando.</p>
<p>Experimente: troque as duas linhas de lugar e rode de novo. A ordem da saída muda junto.</p>`,
        codigo: `print("Olá!")
print("Vamos jogar pedra, papel e tesoura?")` },
      { titulo: 'Strings: texto entre aspas',
        texto: `<p>Todo texto em Python vai entre aspas, duplas ou simples: <code>"pedra"</code> ou <code>'pedra'</code>. Esse tipo de valor se chama <b>string</b>.</p>
<p>As aspas avisam: "isto é texto, não tente interpretar". Elas marcam onde o texto começa e termina e <b>não aparecem</b> na tela.</p>
<p><b>Erro comum:</b> esquecer as aspas. Sem elas, o Python acha que <code>pedra</code> é o nome de alguma coisa, não encontra e dá <code>NameError</code>. Apague as aspas de "pedra" no exemplo e rode para ver.</p>`,
        codigo: `print("pedra")
print('papel')` },
      { titulo: 'Variáveis: dar nome a um valor',
        texto: `<p>Uma <b>variável</b> é um nome que guarda um valor, como uma etiqueta colada numa caixa. <code>jogada = "tesoura"</code> se lê "jogada recebe tesoura".</p>
<p>O <code>=</code> aqui não é o "igual" da matemática: ele <b>guarda</b> o valor da direita no nome da esquerda. Depois, basta usar o nome.</p>
<p><b>Erro comum:</b> <code>print("jogada")</code> mostra a palavra jogada, não o valor. Nome de variável vai <b>sem aspas</b>. Compare as duas linhas do exemplo.</p>`,
        codigo: `jogada = "tesoura"
print(jogada)
print("jogada")` },
      { titulo: 'A variável pode mudar',
        texto: `<p>Guardar outro valor no mesmo nome substitui o anterior. A variável vale sempre o <b>último</b> valor guardado até aquela linha.</p>
<p>Isso vai ser útil no jogo: a mesma variável <code>jogada</code> recebe uma jogada nova a cada rodada.</p>
<p>Nomes de variável: letras minúsculas, números e <code>_</code>, sem espaços, começando com letra. Ex.: <code>jogada_computador</code>.</p>`,
        codigo: `jogada = "pedra"
print(jogada)
jogada = "papel"
print(jogada)` },
      { titulo: 'f-string: montar frases com variáveis',
        texto: `<p>Para misturar texto e variável, coloque um <code>f</code> antes das aspas e escreva o nome da variável entre <code>{ }</code>. O Python troca <code>{jogada}</code> pelo valor.</p>
<p>Cabe mais de uma variável na mesma frase.</p>
<p><b>Erro comum:</b> esquecer o <code>f</code>. Aí as chaves viram texto comum e aparece <code>{jogada}</code> literalmente na tela. Apague o <code>f</code> do exemplo e rode.</p>`,
        codigo: `jogada = "pedra"
computador = "tesoura"
print(f"Você jogou {jogada} e o computador jogou {computador}")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'O que este código mostra na tela?', codigo: `print("Pedra!")`,
        opcoes: ['Pedra!', '"Pedra!"', 'print Pedra!', 'Dá erro'], certa: 0,
        dicas: [
          `As aspas têm uma função específica numa string. Qual é?`,
          `Pense se as aspas fazem parte do texto ou só marcam onde ele começa e termina.`,
          `O <code>print</code> mostra só o <b>conteúdo</b> da string, sem as marcas em volta.`,
        ],
        explica: 'As aspas só delimitam a string e não aparecem na tela. A opção com aspas seria o caso se elas fizessem parte do texto, e não fazem.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "tesoura"
print("jogada")`,
        opcoes: ['jogada', 'tesoura', '"tesoura"', 'Dá erro'], certa: 0,
        dicas: [
          `Repare no que está dentro dos parênteses do <code>print</code>: tem aspas ou não?`,
          `Com aspas é texto literal; sem aspas é o nome de uma variável. Aqui, qual dos dois?`,
        ],
        explica: 'Entre aspas, <code>"jogada"</code> é só uma palavra, não a variável. Para mostrar "tesoura", seria <code>print(jogada)</code>, sem aspas.' },
      { tipo: 'montar', pergunta: 'Monte o código que mostra <b>Tesoura</b> na tela',
        certa: ['print(', '"Tesoura"', ')'], extras: ['input(', 'Tesoura'],
        dicas: [
          `Qual função mostra coisas na tela?`,
          `Tem duas peças com a palavra Tesoura. Uma delas o Python leria como nome de variável.`,
          `Ordem: a função com o parêntese aberto, o texto <b>com aspas</b>, e o parêntese fechando.`,
        ],
        explica: '<code>print</code> mostra; <code>input</code> pergunta. E sem aspas, o Python acharia que Tesoura é o nome de uma variável e daria erro.' },
      { tipo: 'completar', pergunta: 'Guarde "papel" na variável <code>jogada</code>',
        codigo: `jogada [[0]] "papel"`, respostas: [['=']],
        dicas: [
          `Falta o sinal que <b>guarda</b> um valor num nome.`,
          `É um único caractere, o mesmo da matemática, mas aqui significa "recebe".`,
        ],
        explica: 'Um <code>=</code> guarda um valor. Mais adiante você vai ver o <code>==</code>, que compara: são coisas diferentes.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "pedra"
jogada = "papel"
print(jogada)`,
        opcoes: ['papel', 'pedra', 'pedra papel', 'Dá erro'], certa: 0,
        dicas: [
          `O programa roda de cima para baixo. O que a variável vale quando chega no <code>print</code>?`,
          `A segunda linha guarda outro valor no mesmo nome. O valor antigo continua lá?`,
        ],
        explica: 'A variável guarda um valor por vez. A segunda linha substitui "pedra" por "papel", e é esse que o <code>print</code> encontra.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "tesoura"
print("Você jogou {jogada}")`,
        opcoes: ['Você jogou {jogada}', 'Você jogou tesoura', 'Você jogou jogada', 'Dá erro'], certa: 0,
        dicas: [
          `Para as chaves <code>{ }</code> serem trocadas pelo valor, a string precisa de uma marca especial antes das aspas.`,
          `Olhe logo antes das aspas, dentro do <code>print</code>. A marca está lá?`,
          `Sem o <code>f</code>, a string é um texto comum, e as chaves são só caracteres.`,
        ],
        explica: 'Faltou o <code>f</code> antes das aspas. Sem ele, <code>{jogada}</code> aparece do jeito que está escrito. Com <code>f"..."</code>, a saída seria "Você jogou tesoura".' },
      { tipo: 'completar', pergunta: 'Complete a f-string para mostrar <b>O computador jogou papel</b>',
        codigo: `computador = "papel"
print([[0]]"O computador jogou [[1]]")`, respostas: [['f', 'F'], ['{computador}']],
        dicas: [
          `Uma f-string precisa de duas coisas: uma letra antes das aspas e a variável num lugar especial.`,
          `Primeira lacuna: a letra que liga a troca. Segunda: o nome da variável dentro de chaves.`,
          `A primeira é <code>f</code>; a segunda é <code>{computador}</code>.`,
        ],
        explica: 'O <code>f</code> liga a troca, e <code>{computador}</code> marca onde entra o valor da variável.' },
      { tipo: 'codigo', titulo: 'Sua primeira jogada',
        enunciado: 'Crie a variável <code>jogada</code> com o valor <code>"pedra"</code> e mostre <b>Você jogou pedra</b> usando f-string.',
        inicial: `# escreva aqui
`,
        espera: 'Você jogou pedra',
        teste: `assert jogada == "pedra", 'a variável jogada deve valer "pedra"'`,
        dicas: [
          `São duas linhas: uma que <b>guarda</b> o valor na variável e outra que <b>mostra</b> a frase.`,
          `Na primeira linha, use <code>=</code> e coloque pedra entre aspas. Na segunda, use <code>print</code> com <code>f</code> antes das aspas.`,
          `A primeira linha é <code>jogada = "pedra"</code>. A segunda começa com <code>print(f"Você jogou {...}")</code>: troque os pontinhos pelo nome da variável.`,
        ],
        explica: 'A variável guarda o valor; a f-string encaixa esse valor na frase. Se você mudar a variável, a frase muda sozinha.',
        resposta: `jogada = "pedra"
print(f"Você jogou {jogada}")` },
    ],
  },

  {
    id: 'input', titulo: 'Ler a jogada', icone: '🎤', aprende: 'input(), strip(), lower() e int()',
    resumo: [
      `<code>x = input("Pergunta: ")</code> espera a pessoa digitar e guarda o texto em <code>x</code>`,
      `<code>input()</code> <b>sempre</b> devolve string: vem <code>"20"</code>, não <code>20</code>`,
      `<code>int("20")</code> vira o número 20; aí dá para fazer conta`,
      `<code>.strip()</code> tira espaços das pontas; <code>.lower()</code> deixa tudo minúsculo`,
      `Métodos não mudam a variável sozinhos: use <code>x = x.lower()</code>`,
      `Dá para encadear: <code>input().strip().lower()</code>`,
    ],
    ensino: [
      { titulo: 'input(): o programa pergunta',
        texto: `<p>Até agora o programa só falava. Com <code>input()</code> ele também <b>escuta</b>: pausa, espera a pessoa digitar e apertar Enter, e devolve o que foi digitado.</p>
<p>O texto entre parênteses é a pergunta que aparece antes do cursor. Nos exemplos do curso, o teste "digita" por você, e o valor aparece logo depois da pergunta.</p>`,
        codigo: `nome = input("Seu nome: ")
print(f"Oi, {nome}!")`, entrada: 'Ana\n' },
      { titulo: 'Guarde a resposta numa variável',
        texto: `<p>O <code>input()</code> devolve o texto digitado, mas só fica guardado se você colocar numa variável, com <code>=</code>. Pense num garçom anotando o pedido: se ele não anotar, esquece.</p>
<p><b>Erro comum:</b> escrever só <code>input("Sua jogada: ")</code> numa linha e depois tentar usar <code>jogada</code>. A variável nunca foi criada, e dá <code>NameError</code>.</p>`,
        codigo: `jogada = input("Sua jogada: ")
print(f"Você escolheu {jogada}")`, entrada: 'papel\n' },
      { titulo: 'input() sempre devolve texto',
        texto: `<p>Mesmo que a pessoa digite 20, o <code>input()</code> devolve a string <code>"20"</code>. E somar strings só <b>cola</b> uma na outra: <code>"20" + "1"</code> dá <code>"201"</code>.</p>
<p>Para fazer conta, converta com <code>int()</code>, que transforma o texto num número inteiro.</p>
<p><b>Erro comum:</b> <code>int("vinte")</code> não funciona (<code>ValueError</code>): o texto precisa ter só algarismos.</p>`,
        codigo: `idade = input("Idade: ")
print(idade + "1")
print(int(idade) + 1)`, entrada: '20\n' },
      { titulo: 'Métodos: ações que a string sabe fazer',
        texto: `<p>Strings vêm com ferramentas prontas, chamadas <b>métodos</b>. Você usa com ponto: <code>jogada.lower()</code> devolve a jogada em minúsculas; <code>.upper()</code>, em maiúsculas.</p>
<p>O método devolve uma string <b>nova</b>. A variável original não muda sozinha. Para guardar o resultado, atribua de novo: <code>jogada = jogada.lower()</code>.</p>
<p><b>Erro comum:</b> escrever <code>jogada.lower()</code> sozinho numa linha e achar que a variável mudou. Veja no exemplo.</p>`,
        codigo: `jogada = "PeDrA"
jogada.lower()
print(jogada)
jogada = jogada.lower()
print(jogada)` },
      { titulo: 'strip(): tirar os espaços das pontas',
        texto: `<p>O computador compara texto caractere por caractere: <code>" pedra"</code> com espaço não é igual a <code>"pedra"</code>. E as pessoas digitam espaços sem perceber.</p>
<p><code>.strip()</code> tira os espaços do começo e do fim (os do meio ficam). Encadeando com <code>.lower()</code>, você padroniza a jogada de uma vez. Os métodos rodam da esquerda para a direita.</p>
<p>No exemplo, os colchetes mostram onde a string começa e termina.</p>`,
        codigo: `jogada = input("Sua jogada: ")
print(f"[{jogada}]")
jogada = jogada.strip().lower()
print(f"[{jogada}]")`, entrada: '  PEDRA \n' },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'O que <code>input()</code> devolve?',
        opcoes: ['Sempre uma string (texto)', 'Um número, se a pessoa digitar um número', 'Depende do que a pessoa digita', 'Nada: só mostra a pergunta'], certa: 0,
        dicas: [
          `Lembre o exemplo da idade: o que aconteceu quando somamos o que veio do <code>input()</code> com "1"?`,
          `Se viesse um número, <code>idade + "1"</code> daria erro ou 21. Deu "201". O que isso diz sobre o tipo?`,
        ],
        explica: 'O <code>input()</code> não olha o que foi digitado: devolve sempre string. Mesmo "5" vem como <code>"5"</code>. Para virar número, use <code>int(input())</code>.' },
      { tipo: 'escolha', pergunta: 'A pessoa digita <code>5</code>. O que o último <code>print</code> mostra?', codigo: `n = input("Número: ")
print(n + n)`,
        opcoes: ['55', '10', 'n + n', 'Dá erro'], certa: 0,
        dicas: [
          `Qual é o tipo do valor que <code>input()</code> guarda em <code>n</code>?`,
          `Com strings, o <code>+</code> não soma: ele junta um texto no outro.`,
        ],
        explica: '<code>n</code> é a string <code>"5"</code>, e <code>"5" + "5"</code> cola as duas: "55". Para dar 10, seria <code>int(n) + int(n)</code>.' },
      { tipo: 'escolha', pergunta: 'Qual é o resultado?', codigo: `"  PAPEL ".strip().lower()`, opcoesCodigo: true,
        opcoes: ['"papel"', '"PAPEL"', '"  papel "', '"papel "'], certa: 0,
        dicas: [
          `Os métodos rodam da esquerda para a direita. Faça um de cada vez.`,
          `Primeiro: o que sobra de <code>"  PAPEL "</code> depois de tirar os espaços das <b>duas</b> pontas? Depois, aplique o segundo método.`,
        ],
        explica: '<code>strip()</code> tira os espaços do começo <b>e</b> do fim, e <code>lower()</code> deixa minúsculo. Só um dos dois não basta.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "PEDRA"
jogada.lower()
print(jogada)`,
        opcoes: ['PEDRA', 'pedra', 'Dá erro', 'Nada'], certa: 0,
        dicas: [
          `Um método de string muda a variável ou devolve uma string nova?`,
          `Na segunda linha, o resultado de <code>lower()</code> foi guardado em algum lugar?`,
        ],
        explica: '<code>jogada.lower()</code> cria "pedra", mas ninguém guardou. A variável continua "PEDRA". O certo seria <code>jogada = jogada.lower()</code>.' },
      { tipo: 'montar', pergunta: 'Leia a jogada e já deixe em minúsculas',
        certa: ['jogada', '=', 'input("Jogada: ")', '.lower()'], extras: ['print("Jogada: ")', '.upper()'],
        dicas: [
          `A linha tem três partes: o nome da variável, o sinal que guarda e o valor.`,
          `O valor é o que a pessoa digitou, já convertido. Qual função lê, e qual método deixa minúsculo?`,
          `Comece com <code>jogada =</code>, depois a peça do <code>input</code> e, colado nela, o método.`,
        ],
        explica: 'O <code>.lower()</code> é aplicado direto no texto que o <code>input()</code> devolveu. <code>print</code> só mostra e não lê nada; <code>.upper()</code> faria o contrário.' },
      { tipo: 'completar', pergunta: 'Converta o que foi digitado para número, para a conta funcionar',
        codigo: `vitorias = [[0]](input("Vitórias: "))
print(vitorias + 1)`, respostas: [['int']],
        dicas: [
          `O <code>input()</code> devolve texto, e texto + 1 dá erro. Falta converter.`,
          `É a função que transforma <code>"3"</code> no número 3 (número <b>inteiro</b>, em inglês).`,
        ],
        explica: '<code>int(...)</code> transforma o texto em número inteiro. Sem ele, <code>"3" + 1</code> daria <code>TypeError</code>.' },
      { tipo: 'codigo', titulo: 'Limpe a jogada',
        enunciado: 'Leia a jogada com <code>input()</code> na variável <code>jogada</code>, guarde nela mesma a versão limpa com <code>strip()</code> e <code>lower()</code> e mostre <b>Você jogou</b> seguido da jogada.',
        inicial: '',
        casos: [
          { entrada: '  PEDRA \n', espera: 'Você jogou pedra' },
          { entrada: 'Tesoura\n', espera: 'Você jogou tesoura' },
        ],
        teste: `assert jogada == jogada.strip().lower(), f'jogada ficou {jogada!r}: guarde nela o resultado de strip() e lower()'`,
        dicas: [
          `São três passos: ler, limpar e mostrar. Cada um cabe numa linha.`,
          `Para limpar, a variável precisa receber o resultado dos métodos: <code>jogada = jogada....</code>. Só chamar o método não muda nada.`,
          `A linha do meio é <code>jogada = jogada.strip().lower()</code>. Depois, um <code>print</code> com f-string.`,
        ],
        explica: 'Guardar a versão limpa na própria variável faz todo o resto do programa usar a jogada padronizada.',
        resposta: `jogada = input("Sua jogada: ")
jogada = jogada.strip().lower()
print(f"Você jogou {jogada}")` },
      { tipo: 'codigo', titulo: 'Mais uma vitória',
        enunciado: 'Leia quantas vitórias a pessoa tem, converta para número na variável <code>vitorias</code> e mostre <b>Com mais uma, serão N</b>, onde N é o número digitado mais 1.',
        inicial: `vitorias = input("Vitórias até agora: ")
`,
        casos: [
          { entrada: '3\n', espera: 'Com mais uma, serão 4' },
          { entrada: '10\n', espera: 'Com mais uma, serão 11' },
        ],
        teste: `assert isinstance(vitorias, int), 'vitorias ainda é texto: converta com int()'`,
        dicas: [
          `O que vem do <code>input()</code> é texto. Conta só funciona com número.`,
          `Envolva o <code>input(...)</code> com <code>int( )</code> na primeira linha. Depois, faça a conta dentro das chaves da f-string.`,
          `Primeira linha: <code>vitorias = int(input("Vitórias até agora: "))</code>. Na f-string, use <code>{vitorias + 1}</code>.`,
        ],
        explica: 'Sem <code>int()</code>, <code>vitorias + 1</code> daria erro, e <code>vitorias + "1"</code> daria "31". Dentro das chaves da f-string cabe uma conta inteira.',
        resposta: `vitorias = int(input("Vitórias até agora: "))
print(f"Com mais uma, serão {vitorias + 1}")` },
    ],
  },

  {
    id: 'random', titulo: 'O computador joga', icone: '🎲', aprende: 'listas, índices, in e random.choice',
    resumo: [
      `<code>opcoes = ["pedra", "papel", "tesoura"]</code> cria uma <b>lista</b>`,
      `Índices começam em 0: <code>opcoes[0]</code> é "pedra"; <code>opcoes[-1]</code> é o último`,
      `<code>len(opcoes)</code> diz quantos itens a lista tem`,
      `<code>import random</code> no topo; depois <code>random.choice(opcoes)</code> sorteia um item`,
      `<code>"papel" in opcoes</code> dá <code>True</code>; <code>not in</code> pergunta o contrário`,
      `<code>in</code> compara exato: "Pedra" com maiúscula não está na lista`,
    ],
    ensino: [
      { titulo: 'Listas: vários valores num só nome',
        texto: `<p>Uma <b>lista</b> guarda vários valores em ordem, entre <code>[ ]</code> e separados por vírgula. Pense numa fila numerada: cada item tem seu lugar.</p>
<p>No jogo, a lista <code>opcoes</code> guarda as três jogadas possíveis. <code>len()</code> diz quantos itens ela tem.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes)
print(len(opcoes))` },
      { titulo: 'Índice: a posição começa em 0',
        texto: `<p>Cada item tem uma posição, o <b>índice</b>, e você pega o item com <code>lista[índice]</code>. O primeiro é o <code>0</code>, não o 1: o índice conta quantos passos você anda a partir do começo.</p>
<p>Índices negativos contam do fim: <code>opcoes[-1]</code> é o último.</p>
<p><b>Erro comum:</b> pedir <code>opcoes[3]</code> numa lista de 3 itens. Só existem 0, 1 e 2, e dá <code>IndexError</code>. Troque o 2 por 3 no exemplo para ver.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes[0])
print(opcoes[2])
print(opcoes[-1])` },
      { titulo: 'import: trazer ferramentas prontas',
        texto: `<p>O Python vem com <b>módulos</b>: caixas de ferramentas que você liga quando precisa. <code>import random</code> liga a de sorteios. A linha do <code>import</code> fica no topo do arquivo.</p>
<p>Depois, use as ferramentas com <code>random.</code> na frente. <code>random.randint(1, 6)</code> funciona como um dado: sorteia um inteiro de 1 a 6. Rode algumas vezes.</p>
<p><b>Erro comum:</b> usar <code>random.choice</code> sem ter feito o <code>import</code>: dá <code>NameError</code>.</p>`,
        codigo: `import random

print(random.randint(1, 6))` },
      { titulo: 'random.choice: o computador escolhe',
        texto: `<p><code>random.choice(lista)</code> escolhe um item da lista ao acaso. É a jogada do computador.</p>
<p>Guarde o sorteio numa variável. Cada chamada de <code>choice</code> sorteia de novo, então se você chamar duas vezes, pode sair uma coisa diferente em cada. Com a variável, você usa o mesmo valor quantas vezes quiser.</p>`,
        codigo: `import random

opcoes = ["pedra", "papel", "tesoura"]
computador = random.choice(opcoes)
print(f"Computador jogou {computador}")
print(f"Repetindo: {computador}")` },
      { titulo: 'in: está na lista?',
        texto: `<p><code>in</code> pergunta se um valor está na lista e responde <code>True</code> (verdadeiro) ou <code>False</code> (falso). <code>not in</code> pergunta o contrário.</p>
<p>A comparação é exata: <code>"Pedra"</code> com maiúscula <b>não</b> está na lista. Por isso a jogada é limpa com <code>strip()</code> e <code>lower()</code> antes de conferir.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print("papel" in opcoes)
print("Pedra" in opcoes)
print("lagarto" not in opcoes)` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes[1])`,
        opcoes: ['papel', 'pedra', 'tesoura', 'Dá erro'], certa: 0,
        dicas: [
          `Em que número começa a contagem dos índices em Python?`,
          `Se o primeiro item é o índice 0, qual item está no índice 1?`,
        ],
        explica: 'O índice começa em 0: <code>opcoes[0]</code> é pedra e <code>opcoes[1]</code> é papel. Pedra seria a resposta se a contagem começasse em 1.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes[3])`,
        opcoes: ['Dá erro (IndexError)', 'tesoura', 'pedra', 'Nada'], certa: 0,
        dicas: [
          `Quais índices existem numa lista de 3 itens, se a contagem começa em 0?`,
          `O último item, tesoura, está em qual índice? E o 3, aponta para quê?`,
        ],
        explica: 'Com 3 itens, os índices são 0, 1 e 2. O 3 não existe, e o Python avisa com <code>IndexError</code>. Para pegar tesoura: <code>opcoes[2]</code> ou <code>opcoes[-1]</code>.' },
      { tipo: 'completar', pergunta: 'Traga o módulo de sorteio', codigo: `[[0]] random`, respostas: [['import']],
        dicas: [
          `Antes de usar um módulo, é preciso ligá-lo no topo do arquivo.`,
          `A palavra significa "importar", em inglês.`,
        ],
        explica: '<code>import random</code> dá acesso a <code>random.choice</code>, <code>random.randint</code> e outras ferramentas de sorteio.' },
      { tipo: 'completar', pergunta: 'Sorteie a jogada do computador',
        codigo: `computador = random.[[0]](opcoes)`, respostas: [['choice']],
        dicas: [
          `Qual função do <code>random</code> escolhe um item de uma lista?`,
          `O nome significa "escolha", em inglês.`,
        ],
        explica: '<code>random.choice(opcoes)</code> devolve um dos itens da lista, ao acaso.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `opcoes = ["pedra", "papel", "tesoura"]
print("Pedra" in opcoes)`,
        opcoes: ['False', 'True', 'Pedra', 'Dá erro'], certa: 0,
        dicas: [
          `O <code>in</code> responde True ou False. A questão é se a comparação liga para maiúsculas.`,
          `Compare letra por letra: <code>"Pedra"</code> é igual a algum item da lista?`,
        ],
        explica: 'O <code>in</code> compara exatamente, e "P" maiúsculo é diferente de "p". Por isso a jogada passa por <code>lower()</code> antes de ser conferida.' },
      { tipo: 'montar', pergunta: 'Monte a linha que sorteia a jogada do computador',
        certa: ['computador', '=', 'random.choice(', 'opcoes', ')'], extras: ['random(', 'input('],
        dicas: [
          `A linha guarda o sorteio numa variável: nome, sinal de guardar e o valor.`,
          `O valor vem de uma função do módulo random que recebe a lista. <code>random</code> sozinho não é função.`,
          `Comece com <code>computador =</code>, depois a função de escolha, a lista e o parêntese fechando.`,
        ],
        explica: '<code>random</code> é o módulo; a função de sortear é <code>random.choice</code>. E <code>input</code> leria a pessoa, não sortearia nada.' },
      { tipo: 'codigo', titulo: 'O sorteio',
        enunciado: 'Importe <code>random</code>, crie a lista <code>opcoes</code> com pedra, papel e tesoura (nessa ordem), sorteie a variável <code>computador</code> e mostre <b>Computador:</b> seguido do sorteado. No teste, o sorteio é fixado para sair <b>papel</b>.',
        inicial: '',
        antes: `import random as _r
_r.choice = lambda seq: seq[1]`,
        espera: 'Computador: papel',
        teste: `assert opcoes == ["pedra", "papel", "tesoura"], 'opcoes deve ser ["pedra", "papel", "tesoura"]'
assert computador == "papel", "sorteie computador com random.choice(opcoes)"`,
        dicas: [
          `São quatro linhas: o <code>import</code>, a lista, o sorteio e o <code>print</code>.`,
          `A lista vai entre <code>[ ]</code>, com cada jogada entre aspas e vírgulas no meio. O sorteio é <code>random.choice</code> recebendo a lista.`,
          `O sorteio fica <code>computador = random.choice(opcoes)</code>. Depois, <code>print(f"Computador: {computador}")</code>.`,
        ],
        explica: 'Primeiro o módulo, depois os dados, depois a ação. O sorteio vai numa variável para poder ser mostrado e usado depois.',
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
computador = random.choice(opcoes)
print(f"Computador: {computador}")` },
      { tipo: 'codigo', titulo: 'Jogada válida?',
        enunciado: 'Limpe a jogada com <code>strip()</code> e <code>lower()</code> e mostre <code>True</code> se ela estiver em <code>opcoes</code> ou <code>False</code> se não estiver.',
        inicial: `opcoes = ["pedra", "papel", "tesoura"]
jogada = input("Sua jogada: ")
`,
        casos: [
          { entrada: '  Papel\n', espera: 'True', proibido: ['False'] },
          { entrada: 'banana\n', espera: 'False', proibido: ['True'] },
          { entrada: 'TESOURA\n', espera: 'True', proibido: ['False'] },
        ],
        dicas: [
          `O <code>in</code> já devolve True ou False. Basta mostrar o resultado dele.`,
          `Antes de conferir, a jogada precisa estar limpa, senão "  Papel" não bate com "papel".`,
          `Deixe a segunda linha como <code>jogada = input("Sua jogada: ").strip().lower()</code> e mostre <code>print(jogada in opcoes)</code>.`,
        ],
        explica: 'Limpar antes de comparar é o que faz "  Papel" e "TESOURA" serem aceitos. O <code>in</code> faz o resto.',
        resposta: `opcoes = ["pedra", "papel", "tesoura"]
jogada = input("Sua jogada: ").strip().lower()
print(jogada in opcoes)` },
    ],
  },

  {
    id: 'if', titulo: 'Quem ganhou?', icone: '⚖️', aprende: 'if, elif, else, ==, and e or',
    resumo: [
      `<code>==</code> compara e dá True/False; <code>=</code> guarda; <code>!=</code> é "diferente"`,
      `<code>if condição:</code> + bloco indentado (4 espaços) roda só se for True`,
      `<code>elif</code> testa outra condição; <code>else:</code> pega o resto. Só <b>um</b> bloco roda`,
      `<code>and</code>: as duas precisam ser True; <code>or</code>: basta uma`,
      `Escreva a comparação inteira: <code>x == "a" or x == "b"</code>`,
      `Não esqueça os <b>dois-pontos</b> no fim de <code>if</code>, <code>elif</code> e <code>else</code>`,
    ],
    ensino: [
      { titulo: 'Comparar: == e !=',
        texto: `<p><code>==</code> pergunta se dois valores são iguais e responde <code>True</code> ou <code>False</code>. <code>!=</code> pergunta se são diferentes.</p>
<p><b>Erro comum:</b> confundir com <code>=</code>. Um sinal <b>guarda</b> um valor; dois sinais <b>comparam</b>. Num <code>if</code>, quase sempre você quer <code>==</code>.</p>`,
        codigo: `print("pedra" == "pedra")
print("pedra" == "papel")
print("pedra" != "papel")` },
      { titulo: 'if: fazer só quando for verdade',
        texto: `<p>"Se chover, leve o guarda-chuva." O <code>if</code> funciona assim: <code>if condição:</code> roda o bloco de baixo <b>só se</b> a condição for True. Se for False, pula.</p>
<p>A linha do <code>if</code> termina com <b>dois-pontos</b>, e o bloco vem <b>indentado</b>: 4 espaços para dentro.</p>
<p><b>Erro comum:</b> esquecer os dois-pontos (<code>SyntaxError</code>) ou a indentação (<code>IndentationError</code>).</p>`,
        codigo: `jogada = "pedra"
if jogada == "pedra":
    print("Você escolheu pedra!")` },
      { titulo: 'O bloco é a indentação',
        texto: `<p>Tudo que está indentado embaixo do <code>if</code> faz parte dele, e pode ser mais de uma linha. Quando a indentação volta, o bloco acabou.</p>
<p>No exemplo, as duas primeiras mensagens dependem da condição. O <code>print("Fim")</code> está fora, então roda sempre. Troque a jogada para "papel" e veja.</p>`,
        codigo: `jogada = "pedra"
if jogada == "pedra":
    print("Você escolheu pedra!")
    print("Pedra quebra tesoura.")
print("Fim")` },
      { titulo: 'else: o caso contrário',
        texto: `<p><code>else:</code> é o "senão": roda quando a condição do <code>if</code> deu False. Exatamente um dos dois blocos roda, nunca os dois.</p>
<p>O <code>else</code> não tem condição: ele pega tudo que sobrou.</p>`,
        codigo: `jogador = "papel"
computador = "pedra"
if jogador == computador:
    print("Empate!")
else:
    print("Alguém venceu.")` },
      { titulo: 'elif: várias possibilidades',
        texto: `<p><code>elif</code> ("senão, se") testa outra condição quando as anteriores falharam. Pode ter quantos quiser entre o <code>if</code> e o <code>else</code>.</p>
<p>O Python testa <b>de cima para baixo</b> e para no primeiro que der True. Só um bloco roda, então a ordem importa.</p>`,
        codigo: `jogador = "pedra"
computador = "tesoura"

if jogador == computador:
    print("Empate!")
elif jogador == "pedra" and computador == "tesoura":
    print("Você venceu!")
else:
    print("Outro resultado")` },
      { titulo: 'and e or',
        texto: `<p><code>and</code> junta condições que precisam ser <b>todas</b> True. <code>or</code> precisa de <b>pelo menos uma</b>.</p>
<p><b>Erro comum:</b> escrever <code>jogada == "pedra" or "papel"</code>. O Python lê como duas condições separadas, e <code>"papel"</code> sozinho conta como verdadeiro: o if passa sempre. Repita a comparação inteira dos dois lados, como no exemplo.</p>`,
        codigo: `jogador = "pedra"
computador = "tesoura"
print(jogador == "pedra" and computador == "tesoura")
print(jogador == "papel" or jogador == "pedra")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual código pergunta se <code>jogador</code> é igual a "pedra"?', opcoesCodigo: true,
        opcoes: ['jogador == "pedra"', 'jogador = "pedra"', 'jogador === "pedra"', 'jogador := "pedra"'], certa: 0,
        dicas: [
          `Uma das opções não pergunta nada: ela guarda um valor.`,
          `Comparar em Python usa um sinal duplicado. Nem um, nem três.`,
        ],
        explica: '<code>=</code> guarda um valor, <code>==</code> compara. <code>===</code> é do JavaScript e não existe em Python.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogador = "papel"
computador = "papel"

if jogador == computador:
    print("Empate!")
else:
    print("Alguém venceu")`,
        opcoes: ['Empate!', 'Alguém venceu', 'As duas frases', 'Nada'], certa: 0,
        dicas: [
          `Primeiro descubra se a condição do <code>if</code> é True ou False.`,
          `Os dois valem "papel". Lembre que só um dos blocos (if ou else) roda.`,
        ],
        explica: 'A condição é True, então roda o bloco do <code>if</code> e o <code>else</code> é pulado. Nunca rodam os dois.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "pedra"
if jogada == "papel":
    print("A")
elif jogada == "pedra":
    print("B")
else:
    print("C")
print("D")`,
        opcoes: ['B e depois D', 'Só B', 'B, C e D', 'Só D'], certa: 0,
        dicas: [
          `O Python testa de cima para baixo e para no primeiro True. Qual é?`,
          `Agora olhe a indentação do <code>print("D")</code>: ele está dentro de algum bloco?`,
        ],
        explica: 'O <code>elif</code> é o primeiro True, então mostra B e pula o <code>else</code>. O <code>print("D")</code> está fora da estrutura (sem indentação), então roda sempre.' },
      { tipo: 'completar', pergunta: 'Complete as palavras que faltam',
        codigo: `if jogador == computador:
    print("Empate!")
[[0]] jogador == "papel" [[1]] computador == "pedra":
    print("Você venceu!")
[[2]]:
    print("Computador venceu!")`,
        respostas: [['elif'], ['and'], ['else']],
        dicas: [
          `São três palavras: uma para "senão, se", uma para juntar duas condições e uma para "senão".`,
          `Na segunda lacuna, as <b>duas</b> condições precisam ser verdade ao mesmo tempo para o jogador vencer.`,
          `A primeira é <code>elif</code>. Falta a que exige as duas condições e a que pega o resto.`,
        ],
        explica: '<code>elif</code> testa outra condição, <code>and</code> exige as duas ao mesmo tempo e <code>else</code> pega o que sobrou.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "tesoura"
if jogada == "pedra" or "papel":
    print("Pedra ou papel")
else:
    print("Tesoura")`,
        opcoes: ['Pedra ou papel', 'Tesoura', 'Dá erro', 'Nada'], certa: 0,
        dicas: [
          `Este é o erro comum do último cartão. O <code>or</code> separa a linha em duas condições. Quais são elas?`,
          `A segunda condição é só <code>"papel"</code>, sem comparação. Um texto não vazio conta como True ou False?`,
        ],
        explica: 'O Python lê <code>(jogada == "pedra") or ("papel")</code>. A primeira dá False, mas <code>"papel"</code> sozinho conta como verdadeiro, então o if sempre passa. O certo é <code>jogada == "pedra" or jogada == "papel"</code>.' },
      { tipo: 'montar', pergunta: 'Monte a linha que testa se deu empate',
        certa: ['if', 'jogador', '==', 'computador', ':'], extras: ['=', 'else'],
        dicas: [
          `A linha começa com a palavra da decisão e termina com o sinal que abre o bloco.`,
          `Entre as duas variáveis vai o sinal que <b>compara</b>, não o que guarda.`,
          `<code>if</code>, as duas variáveis com <code>==</code> no meio, e os dois-pontos no fim.`,
        ],
        explica: '<code>if jogador == computador:</code> compara as duas jogadas. Com <code>=</code> seria erro de sintaxe, e <code>else</code> não leva condição.' },
      { tipo: 'codigo', titulo: 'Empate ou não?',
        enunciado: 'Se as jogadas forem iguais, mostre <b>Empate!</b>. Se não, mostre <b>Não foi empate</b>.',
        inicial: `jogador = input("Você: ")
computador = input("Computador: ")

`,
        casos: [
          { entrada: 'pedra\npedra\n', espera: 'Empate!', proibido: ['Não foi empate'] },
          { entrada: 'pedra\npapel\n', espera: 'Não foi empate', proibido: ['Empate!'] },
          { entrada: 'tesoura\ntesoura\n', espera: 'Empate!', proibido: ['Não foi empate'] },
        ],
        dicas: [
          `São dois caminhos e só um deve rodar: <code>if</code> e <code>else</code>.`,
          `A condição compara as duas variáveis com <code>==</code>. Não esqueça os dois-pontos e os 4 espaços nos prints.`,
          `Comece com <code>if jogador == computador:</code> e, na linha de baixo, indentado, o <code>print("Empate!")</code>. Depois o <code>else:</code>.`,
        ],
        explica: 'Com <code>if</code>/<code>else</code>, sempre roda exatamente um dos dois prints, nunca os dois e nunca nenhum.',
        resposta: `jogador = input("Você: ")
computador = input("Computador: ")

if jogador == computador:
    print("Empate!")
else:
    print("Não foi empate")` },
      { tipo: 'codigo', titulo: 'Sair, aceitar ou recusar',
        enunciado: 'Se a jogada for <code>sair</code>, mostre <b>Até mais!</b>. Se estiver em <code>opcoes</code>, mostre <b>Jogada aceita:</b> seguido da jogada. Em qualquer outro caso, mostre <b>Jogada inválida</b>.',
        inicial: `opcoes = ["pedra", "papel", "tesoura"]
jogada = input("Sua jogada (ou sair): ").strip().lower()

`,
        casos: [
          { entrada: 'sair\n', espera: 'Até mais!', proibido: ['Jogada aceita', 'Jogada inválida'] },
          { entrada: 'papel\n', espera: 'Jogada aceita: papel', proibido: ['Até mais', 'Jogada inválida'] },
          { entrada: ' Banana\n', espera: 'Jogada inválida', proibido: ['Até mais', 'Jogada aceita'] },
        ],
        dicas: [
          `Três caminhos pedem <code>if</code>, <code>elif</code> e <code>else</code>.`,
          `O primeiro compara com <code>"sair"</code>; o segundo usa <code>in</code> com a lista; o <code>else</code> não leva condição.`,
          `O meio fica assim: <code>elif jogada in opcoes:</code> e, indentado, <code>print(f"Jogada aceita: {jogada}")</code>.`,
        ],
        explica: 'É exatamente a triagem que o jogo vai fazer a cada rodada: primeiro ver se a pessoa quer sair, depois se a jogada vale.',
        resposta: `opcoes = ["pedra", "papel", "tesoura"]
jogada = input("Sua jogada (ou sair): ").strip().lower()

if jogada == "sair":
    print("Até mais!")
elif jogada in opcoes:
    print(f"Jogada aceita: {jogada}")
else:
    print("Jogada inválida")` },
    ],
  },

  {
    id: 'dict', titulo: 'Regras do jogo', icone: '📖', aprende: 'dicionários: chave → valor',
    resumo: [
      `<code>{"chave": "valor", ...}</code> cria um <b>dicionário</b>`,
      `<code>vence["pedra"]</code> busca o valor da chave "pedra": "tesoura"`,
      `Chave que não existe dá <code>KeyError</code>; a busca é exata (maiúscula conta)`,
      `Regra do jogo: <code>vence[jogador] == computador</code> significa que o jogador venceu`,
      `Teste o empate <b>antes</b>; o que sobrar é derrota`,
    ],
    ensino: [
      { titulo: 'O problema dos ifs gigantes',
        texto: `<p>Dá para escrever a regra do Jokenpô só com <code>if</code>, <code>and</code> e <code>or</code>: são três combinações em que o jogador vence. Funciona, mas é longo e fácil de errar um detalhe.</p>
<p>Repare que a regra é sempre do mesmo formato: "X vence Y". Dados assim cabem melhor numa <b>tabela</b> do que em ifs.</p>`,
        codigo: `jogador = "papel"
computador = "pedra"

if ((jogador == "pedra" and computador == "tesoura")
        or (jogador == "tesoura" and computador == "papel")
        or (jogador == "papel" and computador == "pedra")):
    print("Você venceu!")` },
      { titulo: 'Dicionário: chave → valor',
        texto: `<p>Um <b>dicionário</b> é uma tabela que liga uma <b>chave</b> a um <b>valor</b>. Como uma agenda: você procura pelo nome (chave) e encontra o telefone (valor).</p>
<p>Ele fica entre <code>{ }</code>, cada par no formato <code>chave: valor</code>, separados por vírgula. Para buscar, use colchetes com a chave: <code>vence["pedra"]</code>.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}
print(vence["pedra"])
print(vence["papel"])` },
      { titulo: 'Lendo a regra',
        texto: `<p>Leia cada par como uma frase: <code>"pedra": "tesoura"</code> é "pedra vence tesoura". A chave é quem joga; o valor é quem perde para ela.</p>
<p>A busca só vai em um sentido: de chave para valor. <code>vence["tesoura"]</code> diz quem a tesoura vence, não quem vence a tesoura.</p>
<p><b>Erro comum:</b> buscar uma chave que não existe, como <code>vence["Pedra"]</code> com maiúscula: dá <code>KeyError</code>. Mais um motivo para limpar a jogada com <code>lower()</code>.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}
jogada = "tesoura"
print(f"{jogada} vence {vence[jogada]}")` },
      { titulo: 'A regra em uma linha',
        texto: `<p>O jogador ganha quando quem a jogada dele vence é justamente a jogada do computador: <code>vence[jogador] == computador</code>. Um <code>if</code> no lugar de três combinações.</p>
<p>Mude as jogadas e rode para conferir os três resultados.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}
jogador = "tesoura"
computador = "papel"

if jogador == computador:
    print("Empate!")
elif vence[jogador] == computador:
    print("Você venceu!")
else:
    print("Computador venceu!")` },
      { titulo: 'Por que o empate vem primeiro',
        texto: `<p>Se não deu empate e o jogador não venceu, só sobra uma possibilidade: o computador venceu. Por isso o <code>else</code> resolve o último caso sem nenhuma condição.</p>
<p>Mas a ordem importa. Sem testar o empate antes, pedra contra pedra cai no <code>else</code>, porque <code>vence["pedra"]</code> é "tesoura", não "pedra". Rode o exemplo: ele anuncia o resultado errado.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}
jogador = "pedra"
computador = "pedra"

if vence[jogador] == computador:
    print("Você venceu!")
else:
    print("Computador venceu! (errado: era empate)")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `${VENCE}
print(vence["tesoura"])`,
        opcoes: ['papel', 'pedra', 'tesoura', 'Dá erro'], certa: 0,
        dicas: [
          `Procure no dicionário o par cuja <b>chave</b> (à esquerda dos dois-pontos) é "tesoura".`,
          `O resultado é o valor à direita dos dois-pontos desse par, não a chave.`,
        ],
        explica: 'A chave "tesoura" aponta para "papel": tesoura corta papel. Pedra é quem vence a tesoura, mas a busca só vai de chave para valor.' },
      { tipo: 'completar', pergunta: 'Papel vence quem? Complete a regra',
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": [[0]]}`, respostas: [['"pedra"']],
        dicas: [
          `O valor de cada chave é a jogada que ela vence.`,
          `No jogo, o papel embrulha qual jogada? E lembre: é uma string.`,
        ],
        explica: 'Papel embrulha pedra, então o valor é <code>"pedra"</code>, com aspas, porque é texto.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `${VENCE}
print(vence["Pedra"])`,
        opcoes: ['Dá erro (KeyError)', 'tesoura', 'pedra', 'Nada'], certa: 0,
        dicas: [
          `Compare a chave pedida com as chaves do dicionário, letra por letra.`,
          `As chaves estão em minúsculas. O que acontece quando a chave não existe?`,
        ],
        explica: 'A busca é exata: "Pedra" com P maiúsculo não é uma chave, e o Python avisa com <code>KeyError</code>. Com <code>lower()</code> antes, isso não acontece.' },
      { tipo: 'escolha', pergunta: 'Este código esqueceu o teste de empate. Qual é a saída?', codigo: `${VENCE}
jogador = "papel"
computador = "papel"

if vence[jogador] == computador:
    print("Você venceu!")
else:
    print("Computador venceu!")`,
        opcoes: ['Computador venceu!', 'Você venceu!', 'Empate!', 'Dá erro'], certa: 0,
        dicas: [
          `Calcule a condição: quanto vale <code>vence["papel"]</code>?`,
          `Compare esse valor com <code>computador</code>. Se der False, qual bloco roda? E existe algum print de empate no código?`,
        ],
        explica: '<code>vence["papel"]</code> é "pedra", diferente de "papel", então cai no <code>else</code>. "Empate!" nem existe no código: é por isso que o empate deve ser testado primeiro.' },
      { tipo: 'montar', pergunta: 'Monte o <code>if</code> que verifica se o jogador venceu',
        certa: ['if', 'vence[jogador]', '==', 'computador', ':'], extras: ['=', 'vence[computador]'],
        dicas: [
          `O jogador vence quando a jogada que <b>ele</b> vence é a do computador.`,
          `A busca no dicionário usa a jogada do jogador como chave. Depois compare com <code>==</code>.`,
          `<code>if</code>, <code>vence[jogador]</code>, o sinal de comparar, <code>computador</code> e os dois-pontos.`,
        ],
        explica: '<code>vence[jogador]</code> é quem o jogador vence. Se for a jogada do computador, ele ganhou. <code>vence[computador]</code> testaria o contrário.' },
      { tipo: 'codigo', titulo: 'Quem vence quem',
        enunciado: 'Use o dicionário <code>vence</code> para mostrar a regra da jogada digitada. Exemplo: para <code>pedra</code>, mostre <b>pedra vence tesoura</b>.',
        inicial: `${VENCE}
jogada = input("Jogada: ")

`,
        casos: [
          { entrada: 'pedra\n', espera: 'pedra vence tesoura' },
          { entrada: 'papel\n', espera: 'papel vence pedra' },
          { entrada: 'tesoura\n', espera: 'tesoura vence papel' },
        ],
        dicas: [
          `O dicionário já sabe a resposta: basta buscar com a jogada como chave.`,
          `Na f-string, cabe a busca inteira dentro das chaves: <code>{vence[...]}</code>.`,
          `<code>print(f"{jogada} vence {vence[jogada]}")</code> tem tudo que precisa. Entenda cada parte antes de usar.`,
        ],
        explica: 'A chave é a jogada digitada e o valor é quem ela vence. Uma linha resolve os três casos, sem nenhum if.',
        resposta: `${VENCE}
jogada = input("Jogada: ")

print(f"{jogada} vence {vence[jogada]}")` },
      { tipo: 'codigo', titulo: 'O juiz do jogo',
        enunciado: 'Mostre <b>Empate!</b>, <b>Você venceu!</b> ou <b>Computador venceu!</b>. Use o dicionário <code>vence</code>.',
        inicial: `${VENCE}
jogador = input("Você: ")
computador = input("Computador: ")

`,
        casos: [
          { entrada: 'pedra\npedra\n', espera: 'Empate!', proibido: ['Você venceu!', 'Computador venceu!'] },
          { entrada: 'pedra\ntesoura\n', espera: 'Você venceu!', proibido: ['Empate!', 'Computador venceu!'] },
          { entrada: 'pedra\npapel\n', espera: 'Computador venceu!', proibido: ['Empate!', 'Você venceu!'] },
          { entrada: 'tesoura\npapel\n', espera: 'Você venceu!', proibido: ['Empate!', 'Computador venceu!'] },
        ],
        dicas: [
          `Três resultados pedem <code>if</code>, <code>elif</code> e <code>else</code>. Qual testar primeiro?`,
          `Primeiro o empate (<code>jogador == computador</code>), depois a vitória com o dicionário. A derrota é o que sobra.`,
          `A condição da vitória é <code>elif vence[jogador] == computador:</code>. O <code>else</code> não precisa de condição.`,
        ],
        explica: 'Empate primeiro, vitória pelo dicionário, e o resto é derrota. São três linhas de decisão no lugar daquele if gigante.',
        resposta: `${VENCE}
jogador = input("Você: ")
computador = input("Computador: ")

if jogador == computador:
    print("Empate!")
elif vence[jogador] == computador:
    print("Você venceu!")
else:
    print("Computador venceu!")` },
    ],
  },

  {
    id: 'funcao', titulo: 'Funções', icone: '🧩', aprende: 'def, parâmetros e return',
    resumo: [
      `<code>def nome(parametro):</code> cria a função; o bloco indentado é o corpo`,
      `Definir não executa: chame com <code>nome(valor)</code>`,
      `<code>return x</code> devolve <code>x</code> para quem chamou e encerra a função`,
      `<code>print</code> só mostra; sem <code>return</code>, a função devolve <code>None</code>`,
      `<code>pass</code> é um bloco vazio: troque pelo seu código`,
    ],
    ensino: [
      { titulo: 'Funções: dar nome a um bloco',
        texto: `<p><code>def</code> cria uma <b>função</b>: um bloco de código com nome. É como uma receita escrita no caderno: escrever a receita não faz o bolo. O bloco só roda quando você <b>chama</b> a função, com o nome e parênteses.</p>
<p>Escreve uma vez, usa quantas vezes quiser.</p>
<p><b>Erro comum:</b> definir a função e esquecer de chamar. Nada aparece, e não dá erro nenhum.</p>`,
        codigo: `def saudar():
    print("Bem-vindo ao Jokenpô!")

saudar()
saudar()` },
      { titulo: 'Parâmetros: o que a função recebe',
        texto: `<p>Os nomes entre parênteses no <code>def</code> são os <b>parâmetros</b>: espaços em branco que se preenchem na chamada. Em <code>anunciar("pedra")</code>, o parâmetro <code>jogada</code> vale "pedra" durante aquela execução.</p>
<p>Com dois parâmetros, os valores entram na ordem: o primeiro valor vai no primeiro parâmetro.</p>`,
        codigo: `def anunciar(jogador, computador):
    print(f"Você: {jogador} | Computador: {computador}")

anunciar("pedra", "papel")
anunciar("tesoura", "tesoura")` },
      { titulo: 'return: a função devolve um resultado',
        texto: `<p><code>return</code> entrega um valor de volta para quem chamou. Pense numa calculadora: você digita a conta e ela <b>devolve</b> o resultado, que você pode anotar e usar depois.</p>
<p>O valor devolvido pode ir para uma variável, para um <code>print</code> ou para um <code>if</code>.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}

def perde_para(jogada):
    return vence[jogada]

alvo = perde_para("pedra")
print(f"Pedra vence {alvo}")` },
      { titulo: 'print não é return',
        texto: `<p><code>print</code> mostra na tela e pronto: o valor não volta para ninguém. Uma função sem <code>return</code> devolve <code>None</code>, que significa "nada".</p>
<p>No exemplo, a função mostra a frase, mas <code>r</code> recebe <code>None</code>.</p>
<p><b>Erro comum:</b> usar <code>print</code> dentro da função quando o exercício pede para devolver. A tela parece certa, mas o teste recebe <code>None</code>.</p>`,
        codigo: `def anunciar(jogada):
    print(f"Você jogou {jogada}")

r = anunciar("pedra")
print(r)` },
      { titulo: 'return encerra a função',
        texto: `<p>Quando o Python chega num <code>return</code>, a função acaba ali, e o resto do corpo não roda. Por isso dá para escrever vários <code>if</code> com <code>return</code> sem precisar de <code>elif</code>: se o primeiro devolveu, os outros nem são testados.</p>
<p>Nos exercícios, você vai ver <code>pass</code>: um bloco vazio que não faz nada, só segura o lugar. Troque o <code>pass</code> pelo seu código.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}

def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"

print(resultado("pedra", "tesoura"))
print(resultado("pedra", "papel"))` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual a diferença entre <code>return</code> e <code>print</code>?',
        opcoes: ['return devolve o valor para quem chamou; print só mostra na tela', 'São a mesma coisa', 'print devolve o valor; return mostra na tela', 'return encerra o programa inteiro'], certa: 0,
        dicas: [
          `Lembre o exemplo em que <code>r = anunciar("pedra")</code> ficou valendo <code>None</code>.`,
          `Qual dos dois permite guardar o resultado numa variável e usar depois?`,
        ],
        explica: 'Com <code>return</code> o valor volta e pode ser guardado. O <code>return</code> encerra só a função, não o programa.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `def saudar():
    print("Bem-vindo!")

print("Começou")`,
        opcoes: ['Só Começou', 'Bem-vindo! e depois Começou', 'Começou e depois Bem-vindo!', 'Dá erro'], certa: 0,
        dicas: [
          `O <code>def</code> executa o bloco ou só guarda a receita?`,
          `Procure no código uma linha <code>saudar()</code>. Ela existe?`,
        ],
        explica: 'O <code>def</code> só define a função. Como <code>saudar()</code> nunca é chamada, "Bem-vindo!" não aparece.' },
      { tipo: 'completar', pergunta: 'Complete a função',
        codigo: `[[0]] resultado(jogador, computador):
    if jogador == computador:
        [[1]] "empate"`,
        respostas: [['def'], ['return']],
        dicas: [
          `Uma palavra cria a função; a outra entrega o valor de volta.`,
          `A primeira é a abreviação de "definir", em inglês. A segunda significa "devolver".`,
        ],
        explica: '<code>def</code> cria a função e <code>return</code> devolve "empate" para quem chamou.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `def anunciar(jogada):
    print(f"Você jogou {jogada}")

r = anunciar("pedra")
print(r)`,
        opcoes: ['Você jogou pedra e depois None', 'Só Você jogou pedra', 'Você jogou pedra duas vezes', 'Dá erro'], certa: 0,
        dicas: [
          `São dois prints: um dentro da função e um fora. Os dois rodam.`,
          `A função tem <code>return</code>? Então o que <code>r</code> recebe?`,
        ],
        explica: 'O print de dentro mostra a frase. Como não há <code>return</code>, a função devolve <code>None</code>, e é isso que o segundo print mostra.' },
      { tipo: 'montar', pergunta: 'Monte a primeira linha da função <code>resultado</code>',
        certa: ['def', 'resultado', '(jogador, computador)', ':'], extras: ['function', 'return'],
        dicas: [
          `A linha de criar uma função tem: a palavra-chave, o nome, os parâmetros e o sinal que abre o bloco.`,
          `Em Python a palavra-chave é curta, de três letras. <code>function</code> é de outra linguagem.`,
          `<code>def</code>, o nome, os parâmetros entre parênteses e os dois-pontos.`,
        ],
        explica: '<code>def resultado(jogador, computador):</code> cria a função com dois parâmetros. <code>function</code> é do JavaScript; <code>return</code> vai dentro do corpo.' },
      { tipo: 'codigo', titulo: 'Quem perde para quem',
        enunciado: 'Troque o <code>pass</code> para <code>perde_para</code> devolver a jogada que perde para a jogada recebida. Exemplo: <code>perde_para("pedra")</code> devolve <code>"tesoura"</code>.',
        inicial: `${VENCE}


def perde_para(jogada):
    pass


print(perde_para("pedra"))
`,
        espera: 'tesoura',
        teste: `assert perde_para("pedra") == "tesoura", f'perde_para("pedra") devolveu {perde_para("pedra")!r}, e deveria ser "tesoura"'
assert perde_para("papel") == "pedra", 'perde_para("papel") deveria devolver "pedra"'
assert perde_para("tesoura") == "papel", 'perde_para("tesoura") deveria devolver "papel"'`,
        dicas: [
          `A resposta já está no dicionário <code>vence</code>. A função só precisa buscar e devolver.`,
          `Use <code>return</code>, não <code>print</code>. A chave da busca é o parâmetro <code>jogada</code>.`,
          `O corpo da função é uma linha só: <code>return vence[...]</code>.`,
        ],
        explica: 'A função embrulha a busca no dicionário com um nome que explica o que ela faz. Quem chama não precisa saber como funciona por dentro.',
        resposta: `${VENCE}


def perde_para(jogada):
    return vence[jogada]


print(perde_para("pedra"))
` },
      { tipo: 'codigo', titulo: 'A função resultado',
        enunciado: 'Troque o <code>pass</code> para a função devolver <code>"empate"</code>, <code>"vitoria"</code> ou <code>"derrota"</code> (do ponto de vista do jogador).',
        inicial: `${VENCE}

def resultado(jogador, computador):
    pass
`,
        teste: `assert resultado("pedra", "pedra") == "empate", f'resultado("pedra", "pedra") devolveu {resultado("pedra", "pedra")!r}, e deveria ser "empate"'
assert resultado("pedra", "tesoura") == "vitoria", 'resultado("pedra", "tesoura") deveria devolver "vitoria"'
assert resultado("pedra", "papel") == "derrota", 'resultado("pedra", "papel") deveria devolver "derrota"'
assert resultado("tesoura", "papel") == "vitoria", 'resultado("tesoura", "papel") deveria devolver "vitoria"'
assert resultado("papel", "tesoura") == "derrota", 'resultado("papel", "tesoura") deveria devolver "derrota"'`,
        dicas: [
          `É a mesma lógica do juiz da lição anterior, mas com <code>return</code> no lugar de <code>print</code>.`,
          `Primeiro teste o empate e devolva <code>"empate"</code>. Depois use <code>vence[jogador] == computador</code> para a vitória.`,
          `Estrutura: <code>if ...: return "empate"</code>, depois <code>if ...: return "vitoria"</code>, e por último <code>return "derrota"</code>, fora dos ifs.`,
        ],
        explica: 'Como o <code>return</code> encerra a função, o último <code>return "derrota"</code> só é alcançado quando não foi empate nem vitória.',
        resposta: `${VENCE}

${RESULTADO}
` },
    ],
  },

  {
    id: 'while', titulo: 'Jogar várias vezes', icone: '🔁', aprende: 'while, break, continue e contadores',
    resumo: [
      `<code>while condição:</code> repete o bloco enquanto a condição for True`,
      `<code>x += 1</code> é o mesmo que <code>x = x + 1</code>; <code>x -= 1</code> diminui`,
      `Números comparam com <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>`,
      `<code>while True:</code> repete até encontrar um <code>break</code>`,
      `<code>break</code> sai do laço; <code>continue</code> pula para a próxima volta`,
      `O <code>input()</code> fica <b>dentro</b> do laço, para ler uma jogada nova a cada volta`,
    ],
    ensino: [
      { titulo: 'Repetir com while',
        texto: `<p>"Enquanto houver louça na pia, lave um prato." O <code>while condição:</code> repete o bloco <b>enquanto</b> a condição for True. A cada volta, ele confere a condição de novo.</p>
<p>No exemplo, <code>rodada</code> começa em 1 e cresce a cada volta. Quando passa de 3, a condição fica False e o laço termina.</p>
<p><b>Erro comum:</b> esquecer de mudar a variável da condição. Ela nunca fica False, e o laço é infinito (aqui o curso corta depois de 3 segundos).</p>`,
        codigo: `rodada = 1
while rodada <= 3:
    print(f"Rodada {rodada}")
    rodada += 1
print("Acabou!")` },
      { titulo: 'Contadores: += e -=',
        texto: `<p>Uma variável que começa em 0 e cresce aos poucos é um <b>contador</b>. É assim que o placar vai funcionar.</p>
<p><code>pontos += 1</code> é um atalho para <code>pontos = pontos + 1</code>: pega o valor atual, soma 1 e guarda de volta. <code>-= 1</code> faz o mesmo, diminuindo.</p>
<p>Para comparar números: <code>&lt;</code> menor, <code>&lt;=</code> menor ou igual, <code>&gt;</code> maior, <code>&gt;=</code> maior ou igual.</p>`,
        codigo: `pontos = 0
pontos += 1
pontos += 1
print(pontos)
print(pontos >= 2)` },
      { titulo: 'while True e break',
        texto: `<p>No jogo, não sabemos quantas rodadas vão ser: depende da pessoa. <code>while True:</code> repete para sempre, e o <code>break</code> é a porta de saída: ele encerra o laço na hora.</p>
<p>O programa continua na primeira linha depois do laço. O exemplo digita pedra, papel e sair.</p>`,
        codigo: `while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    print(f"Você jogou {jogada}")
print("Tchau!")`, entrada: 'pedra\npapel\nsair\n' },
      { titulo: 'continue: pular para a próxima volta',
        texto: `<p><code>continue</code> abandona o resto do bloco e volta para o começo do laço. O laço não acaba, só pula aquela volta.</p>
<p>Serve para ignorar jogadas inválidas sem encerrar o jogo: avisa a pessoa e pede de novo.</p>
<p><b>Erro comum:</b> usar <code>break</code> no lugar de <code>continue</code>. Aí uma jogada errada encerra o jogo inteiro.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    if jogada not in opcoes:
        print("Jogada inválida")
        continue
    print(f"Ok: {jogada}")`, entrada: 'pedra\nbanana\nsair\n' },
      { titulo: 'A ordem dentro do laço',
        texto: `<p>A cada volta: <b>ler</b>, ver se é para <b>sair</b>, ver se é <b>válida</b>, e só então <b>usar</b> a jogada. Assim, nada inválido chega na parte que conta pontos.</p>
<p><b>Erro comum:</b> deixar o <code>input()</code> fora do laço. Ele lê uma vez só, a jogada nunca muda, e o laço não para.</p>
<p>No exemplo, só as jogadas válidas são contadas.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
validas = 0
while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    if jogada not in opcoes:
        continue
    validas += 1
print(f"Jogadas válidas: {validas}")`, entrada: 'pedra\nbanana\npapel\nsair\n' },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `n = 0
while n < 3:
    n += 1
print(n)`,
        opcoes: ['3', '2', '0, 1 e 2', 'Fica em loop infinito'], certa: 0,
        dicas: [
          `O <code>print</code> está dentro ou fora do laço? Isso diz quantas vezes ele roda.`,
          `Siga o valor de <code>n</code> volta a volta. Quando exatamente <code>n &lt; 3</code> fica False?`,
        ],
        explica: 'O print está fora do laço, então roda uma vez, no fim. O laço só para quando <code>n &lt; 3</code> fica False, ou seja, com n valendo 3, não 2.' },
      { tipo: 'escolha', pergunta: 'O que acontece?', codigo: `rodada = 1
while rodada <= 3:
    print(f"Rodada {rodada}")
print("Fim")`,
        opcoes: ['Mostra Rodada 1 sem parar (loop infinito)', 'Mostra Rodada 1, 2 e 3 e depois Fim', 'Mostra só Fim', 'Dá erro'], certa: 0,
        dicas: [
          `Para o laço parar, a condição precisa virar False em algum momento.`,
          `Alguma linha dentro do laço muda o valor de <code>rodada</code>?`,
        ],
        explica: 'Faltou o <code>rodada += 1</code>. Sem ele, <code>rodada</code> vale 1 para sempre, a condição nunca fica False e "Fim" nunca aparece.' },
      { tipo: 'completar', pergunta: 'Pare o jogo quando a pessoa digitar "sair"',
        codigo: `while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        [[0]]`,
        respostas: [['break']],
        dicas: [
          `O <code>while True</code> só termina com uma palavra específica.`,
          `É a palavra que <b>sai</b> do laço, não a que pula uma volta. Significa "quebrar".`,
        ],
        explica: '<code>break</code> encerra o laço na hora. <code>continue</code> só voltaria para o começo e pediria outra jogada.' },
      { tipo: 'escolha', pergunta: 'O que o <code>continue</code> faz dentro de um <code>while</code>?',
        opcoes: ['Pula o resto do bloco e volta para o começo do laço', 'Encerra o laço', 'Encerra o programa', 'Repete a mesma linha'], certa: 0,
        dicas: [
          `Lembre o exemplo da jogada "banana": o jogo acabou ou pediu outra jogada?`,
          `Quem encerra o laço é outra palavra. O <code>continue</code> deixa o laço seguir.`,
        ],
        explica: '<code>continue</code> pula o que falta daquela volta e começa a próxima. Quem encerra o laço é o <code>break</code>.' },
      { tipo: 'escolha', pergunta: 'O teste digita <code>pedra</code>, <code>sair</code> e <code>papel</code>, nessa ordem. O que o código mostra (fora o que foi digitado)?', codigo: `while True:
    jogada = input()
    if jogada == "sair":
        break
    print(jogada)`,
        opcoes: ['Só pedra', 'pedra e papel', 'pedra, sair e papel', 'Nada'], certa: 0,
        dicas: [
          `Siga volta a volta: o que acontece na primeira? E na segunda?`,
          `Depois do <code>break</code>, o laço volta a ler alguma coisa?`,
        ],
        explica: 'Primeira volta: mostra pedra. Segunda: lê "sair" e o <code>break</code> encerra o laço. O "papel" nunca chega a ser lido.' },
      { tipo: 'completar', pergunta: 'Some 1 ponto ao placar', codigo: `placar = 0
placar [[0]] 1`, respostas: [['+=']],
        dicas: [
          `Existe um atalho para <code>placar = placar + 1</code>.`,
          `São dois caracteres: o sinal da soma e o sinal de guardar, juntos.`,
        ],
        explica: '<code>placar += 1</code> pega o valor atual, soma 1 e guarda de volta. Só <code>=</code> trocaria o placar por 1.' },
      { tipo: 'codigo', titulo: 'Contagem regressiva',
        enunciado: 'Leia um número <code>n</code> e mostre a contagem regressiva de <code>n</code> até <b>1</b>, um número por linha, e depois <b>Já!</b>. Use <code>while</code>.',
        inicial: `n = int(input("Começar de: "))

`,
        casos: [
          { entrada: '3\n', espera: '3 2 1 Já!' },
          { entrada: '5\n', espera: '5 4 3 2 1 Já!' },
        ],
        dicas: [
          `O laço repete enquanto ainda houver número para mostrar. Qual é o último número que deve aparecer?`,
          `A condição é <code>n &gt;= 1</code>. Dentro do laço: mostre <code>n</code> e depois diminua com <code>-= 1</code>.`,
          `Laço: <code>while n &gt;= 1:</code> com <code>print(n)</code> e <code>n -= 1</code> indentados. O <code>print("Já!")</code> fica fora, sem indentação.`,
        ],
        explica: 'A variável da condição muda a cada volta, e por isso o laço termina. O "Já!" fica fora do laço para aparecer uma vez só.',
        resposta: `n = int(input("Começar de: "))

while n >= 1:
    print(n)
    n -= 1
print("Já!")` },
      { tipo: 'codigo', titulo: 'Contando jogadas',
        enunciado: 'Leia jogadas até a pessoa digitar <code>sair</code>. Ignore as inválidas com <code>continue</code>. No fim, mostre <b>Você jogou N vezes</b>, contando só as válidas.',
        inicial: `opcoes = ["pedra", "papel", "tesoura"]
jogadas = 0

`,
        casos: [
          { entrada: 'pedra\nbanana\npapel\nsair\n', espera: 'Você jogou 2 vezes' },
          { entrada: 'tesoura\nsair\n', espera: 'Você jogou 1 vezes' },
          { entrada: 'lagarto\npedra\npedra\npapel\nsair\n', espera: 'Você jogou 3 vezes' },
        ],
        dicas: [
          `Estrutura: <code>while True</code>, ler a jogada, sair com <code>break</code>, pular as inválidas com <code>continue</code>, contar.`,
          `O <code>jogadas += 1</code> vem <b>depois</b> do <code>continue</code>, assim as inválidas nunca chegam nele. O print final fica fora do laço.`,
          `Dentro do laço: <code>jogada = input("Jogada: ")</code>, depois <code>if jogada == "sair": break</code>, depois <code>if jogada not in opcoes: continue</code>, e por fim o contador.`,
        ],
        explica: 'A ordem dentro do laço é o filtro: sair, depois validar, e só então contar. O resultado só é mostrado quando o laço acaba.',
        resposta: `opcoes = ["pedra", "papel", "tesoura"]
jogadas = 0

while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    if jogada not in opcoes:
        print("Jogada inválida")
        continue
    jogadas += 1

print(f"Você jogou {jogadas} vezes")` },
    ],
  },

  {
    id: 'for', titulo: 'Histórico das jogadas', icone: '📜', aprende: 'for, append(), len() e contar itens',
    resumo: [
      `<code>for item in lista:</code> roda o bloco uma vez para cada item`,
      `<code>lista = []</code> cria uma lista vazia; <code>lista.append(x)</code> põe <code>x</code> no fim`,
      `<code>append</code> muda a própria lista: nunca escreva <code>lista = lista.append(x)</code>`,
      `<code>len(lista)</code> conta os itens; <code>lista.count(x)</code> conta quantas vezes <code>x</code> aparece`,
      `Contar com for: comece em 0 e faça <code>+= 1</code> dentro de um <code>if</code>`,
      `<code>range(1, 4)</code> gera 1, 2 e 3 (o fim fica de fora)`,
    ],
    ensino: [
      { titulo: 'for: um item de cada vez',
        texto: `<p><code>for jogada in opcoes:</code> roda o bloco uma vez para cada item da lista. A cada volta, a variável <code>jogada</code> recebe o próximo item. Como passar o dedo por uma lista de compras, item por item.</p>
<p>Diferença para o <code>while</code>: o <code>for</code> serve quando você já tem a coleção e quer percorrê-la toda. Ele para sozinho no último item, sem contador nem <code>break</code>.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
for jogada in opcoes:
    print(f"Opção: {jogada}")
print("Essas são todas.")` },
      { titulo: 'Lista que cresce: append()',
        texto: `<p>Uma lista pode começar vazia, <code>[]</code>, e ganhar itens durante o programa. <code>historico.append(x)</code> coloca <code>x</code> no fim da lista.</p>
<p>Diferente de <code>lower()</code>, o <code>append</code> <b>muda a própria lista</b> e não devolve nada.</p>
<p><b>Erro comum:</b> escrever <code>historico = historico.append(x)</code>. O <code>append</code> devolve <code>None</code>, e a lista é trocada por "nada".</p>`,
        codigo: `historico = []
historico.append("pedra")
historico.append("papel")
print(historico)
print(len(historico))` },
      { titulo: 'Contar com for e if',
        texto: `<p>Para contar quantos itens obedecem a uma regra: comece um contador em 0, percorra a lista com <code>for</code> e some 1 quando o <code>if</code> der True.</p>
<p>Esse padrão serve para muita coisa: contar vitórias, contar jogadas de pedra, contar empates.</p>
<p>Para o caso simples de contar um valor exato, a lista tem um atalho: <code>resultados.count("vitoria")</code>.</p>`,
        codigo: `resultados = ["vitoria", "derrota", "vitoria", "empate"]
vitorias = 0
for r in resultados:
    if r == "vitoria":
        vitorias += 1
print(f"Vitórias: {vitorias}")
print(resultados.count("vitoria"))` },
      { titulo: 'range(): repetir com números',
        texto: `<p><code>range(1, 4)</code> gera os números 1, 2 e 3. O primeiro entra; o último <b>fica de fora</b>. Com um número só, <code>range(3)</code> gera 0, 1 e 2.</p>
<p>Use com <code>for</code> quando quiser repetir um número certo de vezes, como 3 rodadas.</p>`,
        codigo: `for rodada in range(1, 4):
    print(f"Rodada {rodada}")` },
      { titulo: 'Numerar os itens',
        texto: `<p>Para mostrar uma lista numerada, junte o <code>for</code> com um contador: ele começa em 1 e cresce a cada item.</p>
<p>No exemplo, o histórico é mostrado como uma lista de rodadas, e o total vem de <code>len()</code>.</p>`,
        codigo: `historico = ["pedra", "tesoura", "pedra"]
n = 1
for jogada in historico:
    print(f"{n}. {jogada}")
    n += 1
print(f"Total: {len(historico)}")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `for j in ["pedra", "papel"]:
    print(j)`,
        opcoes: ['pedra e depois papel', '["pedra", "papel"]', 'Só pedra', 'j duas vezes'], certa: 0,
        dicas: [
          `Quantas voltas o <code>for</code> dá numa lista de 2 itens?`,
          `A cada volta, <code>j</code> recebe um item. O print mostra a variável, não a lista inteira.`,
        ],
        explica: 'O for dá uma volta por item, e <code>j</code> vale "pedra" na primeira e "papel" na segunda. A lista inteira só apareceria com <code>print(lista)</code>.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `historico = []
historico.append("pedra")
historico.append("papel")
print(len(historico))`,
        opcoes: ['2', '0', '1', 'Dá erro'], certa: 0,
        dicas: [
          `A lista começa vazia. Quantos itens cada <code>append</code> acrescenta?`,
          `O <code>append</code> muda a própria lista, sem precisar de <code>=</code>.`,
        ],
        explica: 'Cada <code>append</code> põe um item no fim. Começou com 0, ganhou 2. Quem acha que dá 0 está pensando que o append só devolve uma lista nova, como o <code>lower()</code>.' },
      { tipo: 'completar', pergunta: 'Guarde a jogada no fim do histórico',
        codigo: `historico = []
jogada = "tesoura"
historico.[[0]](jogada)`, respostas: [['append']],
        dicas: [
          `Falta o método de lista que acrescenta um item no fim.`,
          `O nome significa "anexar", em inglês.`,
        ],
        explica: '<code>historico.append(jogada)</code> coloca a jogada no fim da lista.' },
      { tipo: 'escolha', pergunta: 'Quais números aparecem?', codigo: `for n in range(1, 4):
    print(n)`,
        opcoes: ['1, 2 e 3', '1, 2, 3 e 4', '0, 1, 2 e 3', 'Só 4'], certa: 0,
        dicas: [
          `O <code>range</code> começa no primeiro número. E o segundo número, entra ou fica de fora?`,
          `Lembre <code>range(3)</code>: gera 0, 1 e 2, nunca o 3.`,
        ],
        explica: 'O fim do <code>range</code> fica de fora: <code>range(1, 4)</code> vai de 1 até 3. Para incluir o 4, seria <code>range(1, 5)</code>.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `historico = []
historico = historico.append("pedra")
print(historico)`,
        opcoes: ['None', '["pedra"]', 'pedra', '[]'], certa: 0,
        dicas: [
          `Este é o erro comum do cartão do <code>append</code>. O que o <code>append</code> devolve?`,
          `A segunda linha guarda em <code>historico</code> aquilo que o <code>append</code> devolveu.`,
        ],
        explica: 'O <code>append</code> muda a lista e devolve <code>None</code>. Atribuindo esse retorno, a lista se perde. O certo é só <code>historico.append("pedra")</code>.' },
      { tipo: 'completar', pergunta: 'Conte as vitórias da lista',
        codigo: `vitorias = 0
for r [[0]] resultados:
    if r [[1]] "vitoria":
        vitorias [[2]] 1`, respostas: [['in'], ['=='], ['+=']],
        dicas: [
          `Três peças: a que liga a variável à lista no <code>for</code>, a que compara e a que soma no contador.`,
          `O <code>for</code> usa a mesma palavra do "está na lista?". A comparação é dupla. O contador usa o atalho de somar.`,
          `As respostas são, em ordem: <code>in</code>, a comparação de igualdade e <code>+=</code>.`,
        ],
        explica: '<code>for r in resultados</code> percorre a lista, <code>==</code> compara cada item e <code>+= 1</code> aumenta o contador.' },
      { tipo: 'codigo', titulo: 'Contar vitórias',
        enunciado: 'Complete <code>contar_vitorias</code> para devolver quantas vezes <code>"vitoria"</code> aparece na lista recebida. Use <code>for</code>.',
        inicial: `def contar_vitorias(resultados):
    vitorias = 0
    # percorra a lista e some 1 a cada "vitoria"
    return vitorias


print(contar_vitorias(["vitoria", "derrota", "vitoria"]))
`,
        espera: '2',
        teste: `assert contar_vitorias(["vitoria", "derrota", "vitoria"]) == 2, 'contar_vitorias(["vitoria", "derrota", "vitoria"]) deveria devolver 2'
assert contar_vitorias([]) == 0, 'com a lista vazia, deveria devolver 0'
assert contar_vitorias(["empate", "derrota"]) == 0, 'contar_vitorias(["empate", "derrota"]) deveria devolver 0'
assert contar_vitorias(["vitoria"] * 5 + ["empate"]) == 5, 'com 5 vitórias e 1 empate, deveria devolver 5'`,
        dicas: [
          `O contador e o <code>return</code> já estão prontos. Falta o laço entre eles.`,
          `O <code>for</code> fica no lugar do comentário, com 4 espaços de indentação. Dentro dele, um <code>if</code> que compara o item com <code>"vitoria"</code>.`,
          `Esqueleto: <code>for r in resultados:</code>, depois <code>if r == "vitoria":</code> e, mais para dentro, o <code>+= 1</code>. O <code>return</code> continua fora do for.`,
        ],
        explica: 'Contador em 0, laço com if, soma quando bate. Se o <code>return</code> ficasse dentro do for, a função terminaria na primeira volta.',
        resposta: `def contar_vitorias(resultados):
    vitorias = 0
    for r in resultados:
        if r == "vitoria":
            vitorias += 1
    return vitorias


print(contar_vitorias(["vitoria", "derrota", "vitoria"]))
` },
      { tipo: 'codigo', titulo: 'O histórico',
        enunciado: 'Guarde cada jogada válida na lista <code>historico</code>. Quando a pessoa sair, mostre as jogadas numeradas (<b>1. pedra</b>, <b>2. papel</b>...) e depois <b>Total: N</b>.',
        inicial: `opcoes = ["pedra", "papel", "tesoura"]
historico = []

while True:
    jogada = input("Jogada (ou sair): ").strip().lower()
    if jogada == "sair":
        break
    if jogada not in opcoes:
        continue
    # guarde a jogada no historico

# mostre cada jogada numerada e depois o total
`,
        casos: [
          { entrada: 'pedra\npapel\nsair\n', espera: '1. pedra 2. papel Total: 2' },
          { entrada: 'tesoura\nbanana\nPedra\npedra\nsair\n', espera: '1. tesoura 2. pedra 3. pedra Total: 3' },
        ],
        teste: `assert isinstance(historico, list), 'historico deve continuar sendo uma lista (não use historico = historico.append(...))'
assert len(historico) > 0 and all(j in opcoes for j in historico), 'só as jogadas válidas devem entrar no historico'`,
        dicas: [
          `Duas partes: dentro do laço, guardar com <code>append</code>; depois do laço, mostrar com <code>for</code>.`,
          `O <code>append</code> vai no lugar do primeiro comentário, dentro do laço (4 espaços). Para numerar, crie <code>n = 1</code> antes do <code>for</code> e faça <code>n += 1</code> dentro dele.`,
          `Depois do laço: <code>n = 1</code>, <code>for jogada in historico:</code> com <code>print(f"{n}. {jogada}")</code> e <code>n += 1</code>. No fim, <code>print(f"Total: {len(historico)}")</code>.`,
        ],
        explica: 'O <code>while</code> coleta enquanto não se sabe quantas jogadas vêm; o <code>for</code> percorre o que foi coletado. Os dois juntos são um padrão muito comum.',
        resposta: `opcoes = ["pedra", "papel", "tesoura"]
historico = []

while True:
    jogada = input("Jogada (ou sair): ").strip().lower()
    if jogada == "sair":
        break
    if jogada not in opcoes:
        continue
    historico.append(jogada)

n = 1
for jogada in historico:
    print(f"{n}. {jogada}")
    n += 1
print(f"Total: {len(historico)}")
` },
    ],
  },

  {
    id: 'final', titulo: 'Projeto final', icone: '🏆', final: true, aprende: 'juntar tudo num jogo completo',
    resumo: [
      `Ordem do arquivo: <code>import</code>, listas e dicionário, função, placar, laço, placar final`,
      `Dentro do laço: ler, sair?, válida?, sortear, resultado, somar ponto`,
      `<code>random.choice</code> vai <b>dentro</b> do laço: um sorteio por rodada`,
      `<code>r = resultado(jogada, computador)</code> guarda o resultado para os ifs`,
      `O placar final fica <b>fora</b> do laço, sem indentação`,
    ],
    ensino: [
      { titulo: 'O plano do jogo',
        texto: `<p>Hora de juntar tudo. O jogo completo tem quatro partes:</p>
<ol>
<li>A regra <code>vence</code> e a função <code>resultado</code> (lição de funções)</li>
<li>Um <code>while True</code> que lê a jogada e limpa com <code>strip().lower()</code></li>
<li><code>sair</code> faz <code>break</code>; jogada inválida faz <code>continue</code></li>
<li>O computador sorteia, quem venceu ganha ponto e, no fim, aparece o placar</li>
</ol>
<p>Quando você passar, o seu código fica salvo em <code>meu_jokenpo.py</code> para jogar no terminal.</p>` },
      { titulo: 'O placar',
        texto: `<p>Dois contadores começam em 0, <b>antes</b> do laço, e ganham <code>+= 1</code> conforme o resultado de cada rodada. Se ficassem dentro do laço, voltariam a 0 toda rodada.</p>
<p>Guardar o resultado em <code>r</code> evita chamar a função várias vezes. Troque <code>"vitoria"</code> por <code>"derrota"</code> ou <code>"empate"</code> e rode de novo.</p>`,
        codigo: `pontos_jogador = 0
pontos_computador = 0

r = "vitoria"
if r == "vitoria":
    pontos_jogador += 1
elif r == "derrota":
    pontos_computador += 1

print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")` },
      { titulo: 'Um sorteio por rodada',
        texto: `<p>Onde fica o <code>random.choice</code> muda o jogo. Fora do laço, o sorteio acontece uma vez só, e o computador repete a mesma jogada a partida inteira.</p>
<p>Dentro do laço, cada volta sorteia de novo. No exemplo, cada rodada tem um sorteio próprio; rode algumas vezes.</p>`,
        codigo: `import random

opcoes = ["pedra", "papel", "tesoura"]
for rodada in range(1, 4):
    computador = random.choice(opcoes)
    print(f"Rodada {rodada}: computador jogou {computador}")` },
      { titulo: 'Como trabalhar no projeto',
        texto: `<p>Não escreva tudo de uma vez. Faça <b>um passo, rode, confira</b>:</p>
<ol>
<li>Primeiro a função <code>resultado</code></li>
<li>Depois o laço que para com "sair"</li>
<li>Depois a validação com <code>continue</code></li>
<li>Depois o sorteio do computador</li>
<li>Por último, o resultado e o placar</li>
</ol>
<p>Use <b>▶ Executar</b> a cada passo. Se travar, as dicas do exercício vão do mais geral ao mais específico.</p>` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual linha sorteia a jogada do computador?', opcoesCodigo: true,
        opcoes: ['random.choice(opcoes)', 'input(opcoes)', 'opcoes.random()', 'random(opcoes)'], certa: 0,
        dicas: [
          `O sorteio é uma função de dentro do módulo <code>random</code>.`,
          `O formato é <code>módulo.função(lista)</code>. Listas não têm um método de sortear.`,
        ],
        explica: '<code>random</code> é o módulo e <code>choice</code> é a função dele que sorteia. <code>input</code> lê a pessoa; <code>random(...)</code> sozinho não é função.' },
      { tipo: 'escolha', pergunta: 'Qual é a ordem certa dentro do laço?',
        opcoes: ['Ler a jogada, checar "sair", checar se é válida, sortear, ver o resultado', 'Sortear, ver o resultado, ler a jogada, checar "sair"', 'Ler a jogada, sortear, ver o resultado, checar se é válida', 'Checar se é válida, ler a jogada, checar "sair", sortear'], certa: 0,
        dicas: [
          `Dá para conferir uma jogada antes de ela ser lida?`,
          `A validação precisa acontecer <b>antes</b> de a jogada ser usada para calcular o resultado.`,
        ],
        explica: 'Primeiro ler; depois os filtros (sair e inválida); só então sortear e calcular. Calcular antes de validar quebraria com "banana" (<code>KeyError</code>).' },
      { tipo: 'completar', pergunta: 'Recuse jogadas inválidas',
        codigo: `if jogada [[0]] opcoes:
    print("Jogada inválida!")
    [[1]]`,
        respostas: [['not in'], ['continue']],
        dicas: [
          `A primeira lacuna pergunta se a jogada <b>não</b> está na lista. A segunda pula para a próxima volta.`,
          `A primeira tem duas palavras: o "não" e o "está em". A segunda não é o <code>break</code>.`,
          `A primeira é <code>not in</code>.`,
        ],
        explica: '<code>not in</code> detecta a jogada fora da lista e <code>continue</code> pede outra sem encerrar o jogo. Com <code>break</code>, uma jogada errada acabaria a partida.' },
      { tipo: 'escolha', pergunta: 'Se o sorteio ficar <b>antes</b> do <code>while</code>, o que acontece?', codigo: `computador = random.choice(opcoes)

while True:
    jogada = input("Sua jogada: ")
    ...`,
        opcoes: ['O computador joga a mesma coisa em todas as rodadas', 'Dá erro', 'O computador muda a jogada a cada rodada', 'O jogo não termina'], certa: 0,
        dicas: [
          `Quantas vezes uma linha que está fora do laço roda?`,
          `Se o sorteio roda uma vez só, a variável <code>computador</code> muda depois?`,
        ],
        explica: 'Fora do laço, o sorteio roda uma vez, e <code>computador</code> fica com o mesmo valor a partida inteira. Não dá erro: é um bug silencioso, o pior tipo.' },
      { tipo: 'montar', pergunta: 'Monte a linha que guarda o resultado da rodada',
        certa: ['r', '=', 'resultado(', 'jogada', ',', 'computador', ')'], extras: ['print(', '=='],
        dicas: [
          `A linha chama a função e guarda o que ela devolve numa variável.`,
          `A função recebe duas jogadas, na ordem dos parâmetros: primeiro a do jogador.`,
          `Comece com <code>r =</code>, depois <code>resultado(</code>, as duas jogadas separadas por vírgula e o parêntese.`,
        ],
        explica: 'Guardar em <code>r</code> permite testar o resultado nos ifs sem chamar a função de novo. A ordem importa: <code>resultado(computador, jogada)</code> inverteria quem ganhou.' },
      { tipo: 'codigo', titulo: 'Uma rodada completa',
        enunciado: 'A função <code>resultado</code> já está pronta. Sorteie <code>computador</code>, mostre <b>Computador jogou</b> seguido da jogada dele e anuncie <b>Você venceu!</b>, <b>Computador venceu!</b> ou <b>Empate!</b>. No teste, o computador <b>sempre joga tesoura</b>.',
        inicial: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


${RESULTADO}


jogada = input("Sua jogada: ").strip().lower()
# sorteie, mostre a jogada do computador e anuncie o resultado
`,
        antes: `import random as _r
_r.choice = lambda seq: "tesoura"`,
        casos: [
          { entrada: 'pedra\n', espera: 'Você venceu!', proibido: ['Computador venceu!', 'Empate!'] },
          { entrada: 'papel\n', espera: 'Computador venceu!', proibido: ['Você venceu!', 'Empate!'] },
          { entrada: 'Tesoura\n', espera: 'Empate!', proibido: ['Você venceu!', 'Computador venceu!'] },
        ],
        teste: `assert computador == "tesoura", "sorteie computador com random.choice(opcoes)"`,
        dicas: [
          `Três passos: sortear, mostrar, e decidir a mensagem pelo que <code>resultado()</code> devolve.`,
          `Guarde <code>r = resultado(jogada, computador)</code> e compare <code>r</code> com <code>"vitoria"</code> e <code>"derrota"</code> num <code>if</code>/<code>elif</code>/<code>else</code>.`,
          `As duas primeiras linhas: <code>computador = random.choice(opcoes)</code> e <code>print(f"Computador jogou {computador}")</code>. Depois, o <code>r = ...</code> e os ifs.`,
        ],
        explica: 'É o miolo de cada rodada. Falta só colocar dentro de um laço e somar pontos, que é o próximo exercício.',
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


${RESULTADO}


jogada = input("Sua jogada: ").strip().lower()
computador = random.choice(opcoes)
print(f"Computador jogou {computador}")

r = resultado(jogada, computador)
if r == "vitoria":
    print("Você venceu!")
elif r == "derrota":
    print("Computador venceu!")
else:
    print("Empate!")
` },
      { tipo: 'codigo', titulo: 'Chefão: o jogo completo', final: true,
        enunciado: 'Complete a função e os 4 passos do <code>while</code>. No teste, o computador <b>sempre joga tesoura</b>. Por exemplo, se a pessoa digita pedra, papel, banana, pedra e sair, o placar final deve ser <b>Você 2 x 1 Computador</b>.',
        inicial: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


def resultado(jogador, computador):
    pass  # copie da lição de funções


pontos_jogador = 0
pontos_computador = 0

while True:
    jogada = input("Sua jogada (pedra, papel, tesoura ou sair): ").strip().lower()
    # 1. se for "sair", pare o laço
    # 2. se não estiver em opcoes, avise e use continue
    # 3. sorteie a jogada do computador e mostre
    # 4. chame resultado() e some o ponto de quem venceu

print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")
`,
        antes: `import random as _r
_r.choice = lambda seq: "tesoura"`,
        casos: [
          { entrada: 'pedra\npapel\nbanana\npedra\nsair\n', espera: 'Você 2 x 1 Computador' },
          { entrada: 'tesoura\nsair\n', espera: 'Você 0 x 0 Computador' },
          { entrada: 'papel\n Papel\ntesoura\nSAIR\n', espera: 'Você 0 x 2 Computador' },
        ],
        teste: `assert resultado("pedra", "tesoura") == "vitoria", 'resultado("pedra", "tesoura") deveria devolver "vitoria"'
assert resultado("papel", "tesoura") == "derrota", 'resultado("papel", "tesoura") deveria devolver "derrota"'
assert resultado("papel", "papel") == "empate", 'resultado("papel", "papel") deveria devolver "empate"'
assert resultado("tesoura", "papel") == "vitoria", 'resultado("tesoura", "papel") deveria devolver "vitoria"'`,
        dicas: [
          `Comece pela função: é a mesma da lição de funções. Depois siga os comentários 1 a 4, rodando a cada passo.`,
          `Passos 1 e 2 são um <code>if</code> com <code>break</code> e outro com <code>not in</code> e <code>continue</code>. Os passos 3 e 4 são o exercício anterior, mais um <code>+= 1</code> no contador de quem venceu.`,
          `O passo 4 fica assim: <code>r = resultado(jogada, computador)</code>, depois <code>if r == "vitoria":</code> com <code>pontos_jogador += 1</code> e <code>elif r == "derrota":</code> com <code>pontos_computador += 1</code>. Tudo com 4 espaços, dentro do laço.`,
        ],
        explica: 'Você juntou entrada, validação, sorteio, regra, função, laço e placar. É um programa completo, e cada parte pode ser trocada sem mexer nas outras.',
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


${RESULTADO}


pontos_jogador = 0
pontos_computador = 0

while True:
    jogada = input("Sua jogada (pedra, papel, tesoura ou sair): ").strip().lower()
    if jogada == "sair":
        break
    if jogada not in opcoes:
        print("Jogada inválida!")
        continue

    computador = random.choice(opcoes)
    print(f"Computador jogou {computador}")

    r = resultado(jogada, computador)
    if r == "vitoria":
        pontos_jogador += 1
        print("Você venceu!")
    elif r == "derrota":
        pontos_computador += 1
        print("Computador venceu!")
    else:
        print("Empate!")

print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")
` },
    ],
  },
  {
    id: 'desafios', titulo: 'Desafios bônus', icone: '🚀', bonus: true, aprende: 'listas dentro de dicionários e laços com condição',
    resumo: [
      `Dicionário traduz qualquer valor em outro: <code>emoji["papel"]</code> dá "✋"`,
      `O valor de um dicionário pode ser uma lista: <code>{"pedra": ["tesoura", "lagarto"]}</code>`,
      `Com lista no valor, a pergunta muda de <code>==</code> para <code>in</code>`,
      `<code>while a &lt; 2 and b &lt; 2:</code> para assim que um dos lados chega a 2`,
    ],
    ensino: [
      { titulo: 'Seu jogo, do seu jeito',
        texto: `<p>Programar não termina no "funciona". A parte interessante é <b>mudar</b> o programa para fazer coisas novas, aproveitando o que já existe.</p>
<p>Aqui você vai fazer três versões do Jokenpô: com emojis, com lagarto e Spock, e uma partida de melhor de 3.</p>` },
      { titulo: 'Dicionário de emojis',
        texto: `<p>Dicionário serve para qualquer tradução de um valor para outro: de jogada para emoji, de sigla para nome do estado, de produto para preço.</p>
<p>Junte o emoji e o nome com uma f-string.</p>`,
        codigo: `emoji = {"pedra": "✊", "papel": "✋", "tesoura": "✌️"}
jogada = "papel"
print(f"{emoji[jogada]} {jogada}")` },
      { titulo: 'O valor pode ser uma lista',
        texto: `<p>No Jokenpô com lagarto e Spock, cada jogada vence <b>duas</b> outras. Então o valor de cada chave vira uma <b>lista</b>.</p>
<p>A pergunta "venceu?" muda de <code>==</code> para <code>in</code>: "a jogada do computador está na lista de quem eu venço?"</p>
<p><b>Erro comum:</b> manter o <code>==</code>. Uma string nunca é igual a uma lista, e o jogador nunca venceria.</p>`,
        codigo: `vence = {"pedra": ["tesoura", "lagarto"]}
print(vence["pedra"])
print("lagarto" in vence["pedra"])
print("papel" in vence["pedra"])` },
      { titulo: 'Laço com condição de parada',
        texto: `<p>Na melhor de 3, o jogo acaba quando alguém faz 2 pontos. Em vez de <code>while True</code> com <code>break</code>, coloque a regra direto no <code>while</code>.</p>
<p>Leia assim: "enquanto o jogador tem menos de 2 <b>e</b> o computador tem menos de 2, continue". Quando qualquer um chega a 2, o <code>and</code> fica False e o laço para.</p>`,
        codigo: `pontos_jogador = 0
pontos_computador = 0
rodada = 1
while pontos_jogador < 2 and pontos_computador < 2:
    print(f"Rodada {rodada}")
    pontos_jogador += 1
    rodada += 1
print(f"Fim: {pontos_jogador} x {pontos_computador}")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `vence = {"pedra": ["tesoura", "lagarto"]}
print("lagarto" in vence["pedra"])`,
        opcoes: ['True', 'False', 'lagarto', 'Dá erro'], certa: 0,
        dicas: [
          `Primeiro descubra o que é <code>vence["pedra"]</code>.`,
          `É uma lista. Agora pergunte: "lagarto" está nela?`,
        ],
        explica: '<code>vence["pedra"]</code> é a lista <code>["tesoura", "lagarto"]</code>, e "lagarto" está nela.' },
      { tipo: 'completar', pergunta: 'Com listas no dicionário, como saber se o jogador venceu?',
        codigo: `if computador [[0]] vence[jogador]:
    print("Você venceu!")`, respostas: [['in']],
        dicas: [
          `<code>vence[jogador]</code> agora é uma lista, não uma string.`,
          `A pergunta não é "é igual?", e sim "está dentro?".`,
        ],
        explica: 'Com uma lista, a pergunta não é "é igual?", e sim "está dentro?". Com <code>==</code>, uma string nunca seria igual a uma lista.' },
      { tipo: 'escolha', pergunta: 'Quantas vezes "Rodada" aparece?', codigo: `a = 0
b = 0
while a < 2 and b < 2:
    print("Rodada")
    a += 1`,
        opcoes: ['2', '1', '3', 'Infinitas'], certa: 0,
        dicas: [
          `Só <code>a</code> muda dentro do laço. Siga o valor dele volta a volta.`,
          `Com <code>and</code>, basta um lado ficar False para o laço parar. Quando <code>a &lt; 2</code> fica False?`,
        ],
        explica: 'Depois de duas voltas, <code>a</code> vale 2 e <code>a &lt; 2</code> fica False. Com <code>and</code>, basta um lado ser False para parar. Não é infinito porque <code>a</code> cresce.' },
      { tipo: 'montar', pergunta: 'Monte o laço da melhor de 3',
        certa: ['while', 'pontos_jogador < 2', 'and', 'pontos_computador < 2', ':'], extras: ['or', 'if'],
        dicas: [
          `O laço continua enquanto <b>ninguém</b> chegou a 2 pontos.`,
          `As duas condições precisam valer ao mesmo tempo para continuar. Qual palavra exige isso?`,
          `<code>while</code>, a condição do jogador, <code>and</code>, a do computador e os dois-pontos.`,
        ],
        explica: 'Com <code>and</code>, o laço para assim que um dos dois chega a 2. Com <code>or</code>, só pararia quando os <b>dois</b> chegassem a 2.' },
      { tipo: 'codigo', titulo: 'Desafio 1: emojis',
        enunciado: 'Troque o <code>pass</code> para a função <code>com_emoji</code> devolver o emoji, um espaço e a jogada. Exemplo: <code>com_emoji("papel")</code> devolve <code>"✋ papel"</code>.',
        inicial: `emoji = {"pedra": "✊", "papel": "✋", "tesoura": "✌️"}


def com_emoji(jogada):
    pass


print(com_emoji("pedra"))
`,
        espera: '✊ pedra',
        teste: `assert com_emoji("papel") == "✋ papel", f'com_emoji("papel") devolveu {com_emoji("papel")!r}, e deveria ser "✋ papel"'
assert com_emoji("tesoura") == "✌️ tesoura", 'com_emoji("tesoura") deveria devolver "✌️ tesoura"'`,
        dicas: [
          `A função precisa <b>devolver</b> (não mostrar) uma string montada com duas partes.`,
          `O emoji vem de <code>emoji[jogada]</code>. Junte com a jogada numa f-string, com um espaço no meio.`,
          `A linha fica <code>return f"{...} {jogada}"</code>: troque os pontinhos pela busca no dicionário.`,
        ],
        explica: 'A função busca o emoji no dicionário e monta a string com f-string. Por usar <code>return</code>, dá para reaproveitar em qualquer print do jogo.',
        resposta: `emoji = {"pedra": "✊", "papel": "✋", "tesoura": "✌️"}


def com_emoji(jogada):
    return f"{emoji[jogada]} {jogada}"


print(com_emoji("pedra"))
` },
      { titulo: 'Desafio 2: lagarto e Spock', tipo: 'codigo',
        enunciado: 'Agora cada jogada vence duas outras. Complete <code>resultado</code> para devolver <code>"empate"</code>, <code>"vitoria"</code> ou <code>"derrota"</code> usando <code>in</code>.',
        inicial: `vence = {
    "pedra": ["tesoura", "lagarto"],
    "papel": ["pedra", "spock"],
    "tesoura": ["papel", "lagarto"],
    "lagarto": ["spock", "papel"],
    "spock": ["tesoura", "pedra"],
}


def resultado(jogador, computador):
    pass
`,
        teste: `assert resultado("spock", "spock") == "empate", f'resultado("spock", "spock") devolveu {resultado("spock", "spock")!r}, e deveria ser "empate"'
assert resultado("pedra", "lagarto") == "vitoria", 'resultado("pedra", "lagarto") deveria devolver "vitoria"'
assert resultado("spock", "tesoura") == "vitoria", 'resultado("spock", "tesoura") deveria devolver "vitoria"'
assert resultado("lagarto", "pedra") == "derrota", 'resultado("lagarto", "pedra") deveria devolver "derrota"'
assert resultado("papel", "tesoura") == "derrota", 'resultado("papel", "tesoura") deveria devolver "derrota"'`,
        dicas: [
          `A estrutura é a mesma da <code>resultado</code> original. Só uma condição muda.`,
          `A condição de vitória deixa de ser <code>vence[jogador] == computador</code> e passa a usar <code>in</code>.`,
          `A vitória fica <code>if computador in vence[jogador]:</code> devolvendo <code>"vitoria"</code>. Empate antes, derrota no fim.`,
        ],
        explica: 'Trocando <code>==</code> por <code>in</code>, a mesma função passa a valer para qualquer número de jogadas: só o dicionário cresce.',
        resposta: `vence = {
    "pedra": ["tesoura", "lagarto"],
    "papel": ["pedra", "spock"],
    "tesoura": ["papel", "lagarto"],
    "lagarto": ["spock", "papel"],
    "spock": ["tesoura", "pedra"],
}


def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if computador in vence[jogador]:
        return "vitoria"
    return "derrota"
` },
      { tipo: 'codigo', titulo: 'Desafio 3: melhor de 3',
        enunciado: 'Troque o <code>while True</code> por um laço que para quando alguém fizer 2 pontos. No fim, mostre <b>Você venceu a partida!</b> ou <b>Computador venceu a partida!</b>. No teste, o computador sempre joga tesoura.',
        inicial: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


${RESULTADO}


pontos_jogador = 0
pontos_computador = 0

while True:  # troque esta condição
    jogada = input("Sua jogada: ").strip().lower()
    if jogada not in opcoes:
        print("Jogada inválida!")
        continue
    computador = random.choice(opcoes)
    r = resultado(jogada, computador)
    if r == "vitoria":
        pontos_jogador += 1
    elif r == "derrota":
        pontos_computador += 1
    print(f"Placar: {pontos_jogador} x {pontos_computador}")

# mostre quem venceu a partida
`,
        antes: `import random as _r
_r.choice = lambda seq: "tesoura"`,
        casos: [
          { entrada: 'pedra\npedra\n', espera: 'Você venceu a partida!', proibido: ['Computador venceu a partida!'] },
          { entrada: 'papel\ntesoura\npapel\n', espera: 'Computador venceu a partida!', proibido: ['Você venceu a partida!'] },
          { entrada: 'pedra\nbanana\npapel\npedra\n', espera: 'Você venceu a partida!', proibido: ['Computador venceu a partida!'] },
        ],
        dicas: [
          `Duas mudanças: a condição do <code>while</code> e um <code>if</code>/<code>else</code> depois do laço.`,
          `O laço continua enquanto os dois têm menos de 2 pontos. Depois dele, quem tiver 2 pontos venceu.`,
          `A primeira linha do laço fica <code>while pontos_jogador &lt; 2 and pontos_computador &lt; 2:</code>. Depois do laço, sem indentação: <code>if pontos_jogador == 2:</code>.`,
        ],
        explica: 'A regra de parada mora na própria condição do <code>while</code>, sem <code>break</code>. Quando o laço termina, alguém com certeza tem 2 pontos.',
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


${RESULTADO}


pontos_jogador = 0
pontos_computador = 0

while pontos_jogador < 2 and pontos_computador < 2:
    jogada = input("Sua jogada: ").strip().lower()
    if jogada not in opcoes:
        print("Jogada inválida!")
        continue
    computador = random.choice(opcoes)
    r = resultado(jogada, computador)
    if r == "vitoria":
        pontos_jogador += 1
    elif r == "derrota":
        pontos_computador += 1
    print(f"Placar: {pontos_jogador} x {pontos_computador}")

if pontos_jogador == 2:
    print("Você venceu a partida!")
else:
    print("Computador venceu a partida!")
` },
    ],
  },
]

if (typeof module !== 'undefined') module.exports = LICOES
