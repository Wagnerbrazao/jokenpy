// Conteúdo do curso. Cada lição tem um ensino (cartões curtos com exemplo que roda) e depois exercícios.
// O ensino pode ser pulado; a teoria fica disponível durante os exercícios no botão 📖 Teoria.
// Tipos de exercício:
//   escolha   -> múltipla escolha (certa = índice da opção correta; a tela embaralha)
//   completar -> código com lacunas [[0]], [[1]]... (respostas = lista de aceitas por lacuna)
//   montar    -> montar a linha com peças na ordem certa (extras = peças que confundem)
//   codigo    -> escrever Python de verdade; roda no servidor com a entrada e os testes

const VENCE = `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}`

const LICOES = [
  {
    id: 'print', titulo: 'Mostrar na tela', icone: '💬', aprende: 'print, strings, variáveis e f-string',
    ensino: [
      { titulo: 'O que é programar?',
        texto: `<p>Programar é escrever instruções que o computador segue <b>de cima para baixo</b>, uma linha por vez.</p>
<p>A primeira instrução que você vai usar é <code>print()</code>: ela mostra na tela o que estiver entre os parênteses.</p>`,
        codigo: `print("Olá!")
print("Vamos jogar pedra, papel e tesoura?")` },
      { titulo: 'Strings: texto entre aspas',
        texto: `<p>Todo texto em Python fica entre aspas: <code>"pedra"</code> ou <code>'pedra'</code>. Isso se chama <b>string</b>.</p>
<p>Sem aspas, o Python acha que a palavra é o nome de alguma coisa e dá erro. Tire as aspas do exemplo e rode para ver.</p>`,
        codigo: `print("pedra")
print('papel')` },
      { titulo: 'Variáveis guardam valores',
        texto: `<p>Uma <b>variável</b> é uma caixinha com nome. O <code>=</code> guarda o valor da direita no nome da esquerda.</p>
<p>Depois é só usar o nome, <b>sem aspas</b>, para pegar o valor.</p>`,
        codigo: `jogada = "tesoura"
print(jogada)` },
      { titulo: 'f-string: texto com variável',
        texto: `<p>Coloque um <code>f</code> antes das aspas e escreva a variável entre <code>{ }</code>. O Python troca pelo valor.</p>
<p>Troque <code>"pedra"</code> por outra jogada e rode de novo.</p>`,
        codigo: `jogada = "pedra"
print(f"Você jogou {jogada}")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'O que este código mostra na tela?', codigo: `print("Pedra!")`,
        opcoes: ['Pedra!', '"Pedra!"', 'print Pedra!', 'Dá erro'], certa: 0,
        explica: 'As aspas só marcam onde a string começa e termina. Elas não aparecem na tela.' },
      { tipo: 'montar', pergunta: 'Monte o código que mostra <b>Tesoura</b> na tela',
        certa: ['print(', '"Tesoura"', ')'], extras: ['input(', 'Tesoura'],
        explica: 'Sem aspas, o Python acha que Tesoura é o nome de uma variável e dá erro.' },
      { tipo: 'completar', pergunta: 'Guarde "papel" na variável <code>jogada</code>',
        codigo: `jogada [[0]] "papel"`, respostas: [['=']],
        explica: 'Um <code>=</code> guarda um valor. Dois <code>==</code> comparam (lição 4).' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogada = "tesoura"
print(f"Você jogou {jogada}")`,
        opcoes: ['Você jogou tesoura', 'Você jogou {jogada}', 'Você jogou jogada', 'f"Você jogou tesoura"'], certa: 0,
        explica: 'O <code>f</code> antes das aspas troca <code>{jogada}</code> pelo valor da variável.' },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Crie a variável <code>jogada</code> com o valor <code>"pedra"</code> e mostre <b>Você jogou pedra</b> usando f-string.',
        inicial: `# escreva aqui
`,
        espera: 'Você jogou pedra',
        teste: `assert jogada == "pedra", 'a variável jogada deve valer "pedra"'`,
        resposta: `jogada = "pedra"
print(f"Você jogou {jogada}")` },
    ],
  },

  {
    id: 'input', titulo: 'Ler a jogada', icone: '🎤', aprende: 'input(), strip() e lower()',
    ensino: [
      { titulo: 'Conversando com quem joga',
        texto: `<p><code>input()</code> pausa o programa, espera a pessoa digitar e apertar Enter, e <b>devolve</b> o que ela digitou.</p>
<p>O texto entre parênteses é a pergunta que aparece. Aqui o exemplo digita "Ana" por você.</p>`,
        codigo: `nome = input("Seu nome: ")
print(f"Oi, {nome}!")`, entrada: 'Ana\n' },
      { titulo: 'input() sempre devolve texto',
        texto: `<p>Mesmo que a pessoa digite 20, vem a string <code>"20"</code>. Somar strings só cola uma na outra.</p>
<p>Para fazer conta, converta com <code>int()</code>.</p>`,
        codigo: `idade = input("Idade: ")
print(idade + "1")
print(int(idade) + 1)`, entrada: '20\n' },
      { titulo: 'Limpando o que foi digitado',
        texto: `<p>As pessoas digitam <code>" PEDRA "</code>, <code>"Pedra"</code>... Para comparar, padronize:</p>
<p><code>.strip()</code> tira os espaços das pontas e <code>.lower()</code> deixa tudo minúsculo. Dá para encadear um depois do outro.</p>`,
        codigo: `jogada = input("Sua jogada: ")
print(jogada.strip().lower())`, entrada: '  PEDRA \n' },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'O que <code>input()</code> devolve?',
        opcoes: ['Sempre uma string', 'Sempre um número', 'Depende do que a pessoa digita', 'Nada'], certa: 0,
        explica: 'Mesmo se a pessoa digitar 5, vem <code>"5"</code>. Para virar número: <code>int(input())</code>.' },
      { tipo: 'completar', pergunta: 'Complete para ler a jogada da pessoa',
        codigo: `jogada = [[0]]("Sua jogada: ")`, respostas: [['input']] },
      { tipo: 'escolha', pergunta: 'Qual é o resultado?', codigo: `"  PAPEL ".strip().lower()`, opcoesCodigo: true,
        opcoes: ['"papel"', '"PAPEL"', '"  papel "', '"papel "'], certa: 0,
        explica: '<code>strip()</code> tira os espaços e <code>lower()</code> deixa minúsculo. Os métodos rodam da esquerda para a direita.' },
      { tipo: 'montar', pergunta: 'Leia a jogada e já deixe em minúsculas',
        certa: ['jogada', '=', 'input("Jogada: ")', '.lower()'], extras: ['print("Jogada: ")', '.upper()'] },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Leia a jogada com <code>input()</code>, limpe com <code>strip()</code> e <code>lower()</code> e mostre <b>Você jogou</b> seguido da jogada.',
        inicial: '',
        entrada: '  PEDRA \n',
        espera: 'Você jogou pedra',
        resposta: `jogada = input("Sua jogada: ")
jogada = jogada.strip().lower()
print(f"Você jogou {jogada}")` },
    ],
  },

  {
    id: 'random', titulo: 'O computador joga', icone: '🎲', aprende: 'listas, índices, in e random.choice',
    ensino: [
      { titulo: 'Listas guardam vários valores',
        texto: `<p>Uma <b>lista</b> guarda valores em ordem, entre <code>[ ]</code> e separados por vírgula.</p>
<p><code>len()</code> diz quantos itens ela tem.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes)
print(len(opcoes))` },
      { titulo: 'A contagem começa em 0',
        texto: `<p>Cada item tem uma posição, o <b>índice</b>. O primeiro é o <code>0</code>, não o 1.</p>
<p>Tente <code>opcoes[3]</code> e veja o erro: só existem as posições 0, 1 e 2.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes[0])
print(opcoes[2])` },
      { titulo: 'O computador sorteia',
        texto: `<p><code>import random</code> traz um módulo pronto do Python para sortear.</p>
<p><code>random.choice(lista)</code> escolhe um item ao acaso. Rode várias vezes: o resultado muda.</p>`,
        codigo: `import random

opcoes = ["pedra", "papel", "tesoura"]
print(random.choice(opcoes))` },
      { titulo: 'Está na lista?',
        texto: `<p><code>in</code> pergunta se um valor está na lista e devolve <code>True</code> (verdadeiro) ou <code>False</code> (falso).</p>
<p><code>not in</code> pergunta o contrário. É assim que vamos recusar jogadas inválidas.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
print("papel" in opcoes)
print("lagarto" in opcoes)
print("lagarto" not in opcoes)` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `opcoes = ["pedra", "papel", "tesoura"]
print(opcoes[1])`,
        opcoes: ['papel', 'pedra', 'tesoura', 'Dá erro'], certa: 0,
        explica: 'O índice começa em 0: <code>opcoes[0]</code> é pedra, <code>opcoes[1]</code> é papel.' },
      { tipo: 'completar', pergunta: 'Traga o módulo de sorteio', codigo: `[[0]] random`, respostas: [['import']] },
      { tipo: 'completar', pergunta: 'Sorteie a jogada do computador',
        codigo: `computador = random.[[0]](opcoes)`, respostas: [['choice']] },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `opcoes = ["pedra", "papel", "tesoura"]
print("banana" in opcoes)`,
        opcoes: ['False', 'True', 'banana', 'Dá erro'], certa: 0,
        explica: '<code>in</code> devolve True ou False. Vamos usar isso para recusar jogadas inválidas.' },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Importe <code>random</code>, crie a lista <code>opcoes</code> com pedra, papel e tesoura, sorteie <code>computador</code> e mostre <b>Computador:</b> seguido do sorteado.',
        inicial: '',
        espera: 'Computador: ',
        teste: `assert opcoes == ["pedra", "papel", "tesoura"], 'opcoes deve ser ["pedra", "papel", "tesoura"]'
assert computador in opcoes, "computador deve ser um item de opcoes"`,
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
computador = random.choice(opcoes)
print(f"Computador: {computador}")` },
    ],
  },

  {
    id: 'if', titulo: 'Quem ganhou?', icone: '⚖️', aprende: 'if, elif, else, ==, and e or',
    ensino: [
      { titulo: 'Comparar: == e !=',
        texto: `<p><code>==</code> pergunta se dois valores são iguais e devolve True ou False. <code>!=</code> pergunta se são diferentes.</p>
<p>Cuidado: <code>=</code> <b>guarda</b> um valor, <code>==</code> <b>compara</b>.</p>`,
        codigo: `print("pedra" == "pedra")
print("pedra" == "papel")
print("pedra" != "papel")` },
      { titulo: 'if: tomar decisões',
        texto: `<p><code>if condição:</code> roda o bloco de baixo <b>só se</b> a condição for True.</p>
<p>O bloco é tudo que está <b>indentado</b> (4 espaços para dentro). O <code>print("Fim")</code> está fora, então sempre roda. Troque a jogada e veja.</p>`,
        codigo: `jogada = "pedra"
if jogada == "pedra":
    print("Você escolheu pedra!")
print("Fim")` },
      { titulo: 'elif e else',
        texto: `<p><code>elif</code> testa outra condição se as anteriores falharam. <code>else</code> pega todo o resto.</p>
<p>O Python testa de cima para baixo e roda <b>só um</b> dos blocos.</p>`,
        codigo: `jogador = "pedra"
computador = "tesoura"

if jogador == computador:
    print("Empate!")
elif jogador == "pedra" and computador == "tesoura":
    print("Você venceu!")
else:
    print("Computador venceu!")` },
      { titulo: 'and e or',
        texto: `<p><code>and</code>: as duas condições precisam ser True.</p>
<p><code>or</code>: basta uma ser True.</p>`,
        codigo: `jogador = "pedra"
computador = "tesoura"
print(jogador == "pedra" and computador == "tesoura")
print(jogador == "papel" or computador == "tesoura")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual código pergunta se <code>jogador</code> é igual a "pedra"?', opcoesCodigo: true,
        opcoes: ['jogador == "pedra"', 'jogador = "pedra"', 'jogador === "pedra"', 'jogador := "pedra"'], certa: 0,
        explica: '<code>=</code> guarda um valor, <code>==</code> compara. <code>===</code> é do JavaScript, não existe em Python.' },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogador = "papel"
computador = "papel"

if jogador == computador:
    print("Empate!")
else:
    print("Alguém venceu")`,
        opcoes: ['Empate!', 'Alguém venceu', 'As duas frases', 'Nada'], certa: 0,
        explica: 'Só um bloco roda: o primeiro cuja condição é verdadeira.' },
      { tipo: 'completar', pergunta: 'Complete as palavras que faltam',
        codigo: `if jogador == computador:
    print("Empate!")
[[0]] jogador == "papel" [[1]] computador == "pedra":
    print("Você venceu!")
[[2]]:
    print("Computador venceu!")`,
        respostas: [['elif'], ['and'], ['else']] },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `jogador = "tesoura"
computador = "pedra"

if jogador == "tesoura" or computador == "tesoura":
    print("Tem tesoura")
else:
    print("Sem tesoura")`,
        opcoes: ['Tem tesoura', 'Sem tesoura', 'Dá erro', 'Nada'], certa: 0,
        explica: 'Com <code>or</code>, basta uma das condições ser verdadeira.' },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Se as jogadas forem iguais, mostre <b>Empate!</b>. Se não, mostre <b>Não foi empate</b>.',
        inicial: `jogador = input("Você: ")
computador = input("Computador: ")

`,
        casos: [
          { entrada: 'pedra\npedra\n', espera: 'Empate!', proibido: ['Não foi empate'] },
          { entrada: 'pedra\npapel\n', espera: 'Não foi empate', proibido: ['Empate!'] },
        ],
        resposta: `jogador = input("Você: ")
computador = input("Computador: ")

if jogador == computador:
    print("Empate!")
else:
    print("Não foi empate")` },
    ],
  },

  {
    id: 'dict', titulo: 'Regras do jogo', icone: '📖', aprende: 'dicionários: chave → valor',
    ensino: [
      { titulo: 'O problema dos ifs gigantes',
        texto: `<p>Escrever a regra do jogo só com <code>if</code> fica longo: três combinações com <code>and</code> e <code>or</code>.</p>
<p>Funciona, mas é fácil errar. Dá para fazer melhor guardando a regra como <b>dado</b>.</p>`,
        codigo: `jogador = "papel"
computador = "pedra"

if ((jogador == "pedra" and computador == "tesoura")
        or (jogador == "tesoura" and computador == "papel")
        or (jogador == "papel" and computador == "pedra")):
    print("Você venceu!")` },
      { titulo: 'Dicionário: chave → valor',
        texto: `<p>Um <b>dicionário</b> liga uma chave a um valor, entre <code>{ }</code>. Pegue o valor com <code>dicionario[chave]</code>.</p>
<p>Leia assim: "pedra vence tesoura", "tesoura vence papel"...</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}
print(vence["pedra"])
print(vence["papel"])` },
      { titulo: 'A regra em uma linha',
        texto: `<p>O jogador ganha quando <code>vence[jogador] == computador</code>. Um <code>if</code> no lugar de três!</p>
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
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `${VENCE}
print(vence["tesoura"])`,
        opcoes: ['papel', 'pedra', 'tesoura', 'Dá erro'], certa: 0,
        explica: 'A chave "tesoura" aponta para "papel": tesoura corta papel.' },
      { tipo: 'completar', pergunta: 'Papel vence quem? Complete a regra',
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": [[0]]}`, respostas: [['"pedra"']],
        explica: 'Papel embrulha pedra. E não esqueça as aspas: é uma string.' },
      { tipo: 'escolha', pergunta: 'Com <code>jogador = "papel"</code> e <code>computador = "tesoura"</code>, quanto vale <code>vence[jogador] == computador</code>?',
        opcoes: ['False: o jogador não venceu', 'True: o jogador venceu', 'Dá erro', 'Empate'], certa: 0,
        explica: '<code>vence["papel"]</code> é "pedra", diferente de "tesoura". Quem venceu foi o computador.' },
      { tipo: 'montar', pergunta: 'Monte o <code>if</code> que verifica se o jogador venceu',
        certa: ['if', 'vence[jogador]', '==', 'computador', ':'], extras: ['=', 'vence[computador]'] },
      { tipo: 'codigo', titulo: 'Sua vez',
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
    ensino: [
      { titulo: 'Funções: blocos com nome',
        texto: `<p><code>def</code> cria uma <b>função</b>: um bloco de código com nome, que roda quando você o <b>chama</b> com <code>nome()</code>.</p>
<p>Escreve uma vez, usa quantas vezes quiser.</p>`,
        codigo: `def saudar():
    print("Bem-vindo ao Jokenpô!")

saudar()
saudar()` },
      { titulo: 'Parâmetros: a função recebe valores',
        texto: `<p>Os nomes entre parênteses no <code>def</code> são os <b>parâmetros</b>. Cada chamada passa um valor diferente.</p>`,
        codigo: `def anunciar(jogada):
    print(f"Você jogou {jogada}")

anunciar("pedra")
anunciar("papel")` },
      { titulo: 'return: a função devolve um resultado',
        texto: `<p><code>return</code> entrega um valor para quem chamou. Dá para guardar numa variável e usar depois. (<code>print</code> só mostra na tela.)</p>
<p><code>pass</code> é um lugar reservado que não faz nada: nos exercícios, você troca o <code>pass</code> pelo seu código.</p>`,
        codigo: `vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}

def quem_perde(jogada):
    return vence[jogada]

alvo = quem_perde("pedra")
print(f"Pedra vence {alvo}")` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual a diferença entre <code>return</code> e <code>print</code>?',
        opcoes: ['return devolve o valor para quem chamou; print só mostra na tela', 'São a mesma coisa', 'print devolve o valor; return mostra na tela', 'return encerra o programa inteiro'], certa: 0,
        explica: 'Com <code>return</code> o valor pode ser guardado numa variável e usado depois.' },
      { tipo: 'completar', pergunta: 'Complete a função',
        codigo: `[[0]] resultado(jogador, computador):
    if jogador == computador:
        [[1]] "empate"`,
        respostas: [['def'], ['return']] },
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `def saudacao(nome):
    return f"Oi, {nome}!"

print(saudacao("Ana"))`,
        opcoes: ['Oi, Ana!', 'Oi, {nome}!', 'saudacao', 'Nada'], certa: 0 },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Troque o <code>pass</code> para a função devolver <code>"empate"</code>, <code>"vitoria"</code> ou <code>"derrota"</code> (do ponto de vista do jogador).',
        inicial: `${VENCE}

def resultado(jogador, computador):
    pass
`,
        teste: `assert resultado("pedra", "pedra") == "empate", 'resultado("pedra", "pedra") deveria devolver "empate"'
assert resultado("pedra", "tesoura") == "vitoria", 'resultado("pedra", "tesoura") deveria devolver "vitoria"'
assert resultado("pedra", "papel") == "derrota", 'resultado("pedra", "papel") deveria devolver "derrota"'
assert resultado("tesoura", "papel") == "vitoria", 'resultado("tesoura", "papel") deveria devolver "vitoria"'`,
        resposta: `${VENCE}

def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"
` },
    ],
  },

  {
    id: 'while', titulo: 'Jogar várias vezes', icone: '🔁', aprende: 'while, break, continue e +=',
    ensino: [
      { titulo: 'Repetir com while',
        texto: `<p><code>while condição:</code> repete o bloco <b>enquanto</b> a condição for True.</p>
<p><code>rodada += 1</code> é o mesmo que <code>rodada = rodada + 1</code>. Sem ele, o laço nunca acabaria.</p>`,
        codigo: `rodada = 1
while rodada <= 3:
    print(f"Rodada {rodada}")
    rodada += 1
print("Acabou!")` },
      { titulo: 'while True e break',
        texto: `<p><code>while True:</code> repete para sempre, até encontrar um <code>break</code>, que sai do laço.</p>
<p>É o jeito de jogar até a pessoa digitar "sair". O exemplo digita pedra, papel e sair.</p>`,
        codigo: `while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    print(f"Você jogou {jogada}")
print("Tchau!")`, entrada: 'pedra\npapel\nsair\n' },
      { titulo: 'continue: pular uma volta',
        texto: `<p><code>continue</code> pula o resto do bloco e volta para o começo do laço.</p>
<p>Use para ignorar jogadas inválidas sem encerrar o jogo.</p>`,
        codigo: `opcoes = ["pedra", "papel", "tesoura"]
while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        break
    if jogada not in opcoes:
        print("Jogada inválida")
        continue
    print(f"Ok: {jogada}")`, entrada: 'pedra\nbanana\nsair\n' },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual é a saída?', codigo: `n = 0
while n < 3:
    n += 1
print(n)`,
        opcoes: ['3', '2', '0, 1 e 2', 'Fica em loop infinito'], certa: 0,
        explica: 'O laço para quando <code>n < 3</code> fica falso, ou seja, quando n chega a 3.' },
      { tipo: 'completar', pergunta: 'Pare o jogo quando a pessoa digitar "sair"',
        codigo: `while True:
    jogada = input("Jogada: ")
    if jogada == "sair":
        [[0]]`,
        respostas: [['break']] },
      { tipo: 'escolha', pergunta: 'O que o <code>continue</code> faz dentro de um <code>while</code>?',
        opcoes: ['Pula o resto do bloco e volta para o começo do laço', 'Encerra o laço', 'Encerra o programa', 'Repete a mesma linha'], certa: 0 },
      { tipo: 'completar', pergunta: 'Some 1 ponto ao placar', codigo: `placar = 0
placar [[0]] 1`, respostas: [['+=']] },
      { tipo: 'codigo', titulo: 'Sua vez',
        enunciado: 'Leia jogadas até a pessoa digitar <code>sair</code>. Ignore as inválidas com <code>continue</code>. No fim, mostre <b>Você jogou N vezes</b>, contando só as válidas.',
        inicial: `opcoes = ["pedra", "papel", "tesoura"]
jogadas = 0

`,
        entrada: 'pedra\nbanana\npapel\nsair\n',
        espera: 'Você jogou 2 vezes',
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
    id: 'final', titulo: 'Projeto final', icone: '🏆', final: true, aprende: 'juntar tudo num jogo completo',
    ensino: [
      { titulo: 'O plano do jogo',
        texto: `<p>Hora de juntar tudo! O jogo completo tem 4 partes:</p>
<ol>
<li>A regra <code>vence</code> e a função <code>resultado</code> (lição 6)</li>
<li>Um <code>while True</code> que lê a jogada</li>
<li><code>sair</code> faz <code>break</code>; jogada inválida faz <code>continue</code></li>
<li>O computador sorteia, quem venceu ganha ponto, e no fim aparece o placar</li>
</ol>
<p>Quando você passar, o seu código é salvo em <code>meu_jokenpo.py</code> para jogar no terminal.</p>` },
      { titulo: 'O placar',
        texto: `<p>Duas variáveis começam em 0 e ganham <code>+= 1</code> conforme o resultado da rodada.</p>
<p>Troque <code>r</code> por <code>"derrota"</code> ou <code>"empate"</code> e rode de novo.</p>`,
        codigo: `pontos_jogador = 0
pontos_computador = 0

r = "vitoria"
if r == "vitoria":
    pontos_jogador += 1
elif r == "derrota":
    pontos_computador += 1

print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")` },
      { titulo: 'Dica de profissional',
        texto: `<p>Não escreva tudo de uma vez. Faça <b>um passo, rode, confira</b>:</p>
<ol>
<li>Primeiro o laço que para com "sair"</li>
<li>Depois a validação com <code>continue</code></li>
<li>Depois o sorteio do computador</li>
<li>Por último o resultado e o placar</li>
</ol>
<p>Use <b>▶ Executar</b> a cada passo. Travou? Peça uma 💡 dica.</p>` },
    ],
    exercicios: [
      { tipo: 'escolha', pergunta: 'Qual linha sorteia a jogada do computador?', opcoesCodigo: true,
        opcoes: ['random.choice(opcoes)', 'input(opcoes)', 'opcoes.random()', 'random(opcoes)'], certa: 0 },
      { tipo: 'completar', pergunta: 'Recuse jogadas inválidas',
        codigo: `if jogada [[0]] opcoes:
    print("Jogada inválida!")
    [[1]]`,
        respostas: [['not in'], ['continue']] },
      { tipo: 'montar', pergunta: 'Some um ponto para o jogador',
        certa: ['pontos_jogador', '+=', '1'], extras: ['==', '-='] },
      { tipo: 'codigo', titulo: 'Chefão: o jogo completo', final: true,
        enunciado: 'Complete a função e os 4 passos do <code>while</code>. No teste, o computador <b>sempre joga tesoura</b> e a pessoa digita pedra, papel, banana, pedra e sair. O placar final deve ser <b>Você 2 x 1 Computador</b>.',
        inicial: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


def resultado(jogador, computador):
    pass  # copie da lição 6


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
        entrada: 'pedra\npapel\nbanana\npedra\nsair\n',
        espera: 'Você 2 x 1 Computador',
        teste: `assert resultado("pedra", "tesoura") == "vitoria", 'resultado("pedra", "tesoura") deveria devolver "vitoria"'
assert resultado("papel", "tesoura") == "derrota", 'resultado("papel", "tesoura") deveria devolver "derrota"'
assert resultado("papel", "papel") == "empate", 'resultado("papel", "papel") deveria devolver "empate"'`,
        resposta: `import random

opcoes = ["pedra", "papel", "tesoura"]
${VENCE}


def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"


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
]

if (typeof module !== 'undefined') module.exports = LICOES
