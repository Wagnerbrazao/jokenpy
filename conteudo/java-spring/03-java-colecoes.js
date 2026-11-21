MODULOS.push({
  id: 'java-colecoes',
  titulo: 'Coleções e Streams',
  icone: '🧺',
  aprende: 'List, Set, Map, Streams, Optional e method references',
  porque: 'Toda consulta ao banco e toda resposta de API volta como coleção, e Streams são o jeito idiomático de transformar isso em DTO.',
  resumo: [
    '<code>List.of</code>, <code>Set.of</code> e <code>Map.of</code> criam coleções <b>imutáveis</b> e rejeitam <code>null</code>',
    'Lista mutável: <code>new ArrayList&lt;&gt;(...)</code>. Mapa mutável: <code>new HashMap&lt;&gt;()</code>',
    'Stream: <code>stream()</code> → <code>filter</code>/<code>map</code> → operação final (<code>toList()</code>, <code>collect</code>)',
    'Stream é <b>preguiçoso</b> e de <b>uso único</b>',
    '<code>Collectors.groupingBy</code> agrupa em <code>Map</code>; com <code>counting()</code> conta por chave',
    '<code>Assistido::nome</code> é o mesmo que <code>a -&gt; a.nome()</code>',
  ],
  ensino: [
    { titulo: 'List, Set e Map: interface e implementação',
      texto: `<p>Você declara pela <b>interface</b> (<code>List</code>, <code>Set</code>, <code>Map</code>) e escolhe a implementação: <code>ArrayList</code> para listas, <code>HashSet</code> para conjuntos, <code>HashMap</code> para mapas. <code>HashMap</code> não garante ordem; <code>LinkedHashMap</code> mantém a de inserção e <code>TreeMap</code> ordena pela chave.</p>
<p><code>Set</code> e as chaves de <code>Map</code> usam <code>equals</code> e <code>hashCode</code>. Records já trazem os dois. Numa classe comum sem eles, dois objetos iguais viram duas entradas.</p>
<p>Métodos de <code>Map</code> que evitam <code>if</code>: <code>getOrDefault</code>, <code>computeIfAbsent</code>, <code>merge</code>. <code>get</code> de chave inexistente devolve <code>null</code>, e o NPE costuma aparecer logo depois.</p>
<p><b>No NestJS/TypeScript:</b> <code>List</code> é o array, <code>Map</code> é o <code>Map</code> do JS (ou o objeto literal) e <code>Set</code> é o <code>Set</code>. A diferença: no JS o Set compara objetos por referência; no Java, por <code>equals</code>.</p>`,
      linguagem: 'java',
      codigo: `List<String> varas = new ArrayList<>();
varas.add("1ª Vara Cível");

Map<String, Integer> atendimentosPorComarca = new HashMap<>();
atendimentosPorComarca.merge("Goiânia", 1, Integer::sum);   // soma 1
int anapolis = atendimentosPorComarca.getOrDefault("Anápolis", 0);

Set<String> cpfs = new HashSet<>(List.of("111", "222", "111")); // 2 itens` },
    { titulo: 'List.of é imutável (e não aceita null)',
      texto: `<p><code>List.of(...)</code>, <code>Set.of(...)</code> e <code>Map.of(...)</code> (Java 9+) criam coleções <b>imutáveis</b>. Tentar <code>add</code> ou <code>remove</code> lança <code>UnsupportedOperationException</code>, em tempo de execução, não de compilação. Elas também <b>rejeitam null</b> com <code>NullPointerException</code>, e <code>Set.of</code> com itens repetidos lança <code>IllegalArgumentException</code>.</p>
<p><code>Arrays.asList(...)</code> é diferente: tamanho fixo (sem <code>add</code>), mas aceita <code>set</code> e null. Para uma lista que você vai alterar, copie: <code>new ArrayList&lt;&gt;(List.of(...))</code>.</p>
<p>Outra exceção comum: remover item de uma lista dentro de um for-each dá <code>ConcurrentModificationException</code>. Use <code>lista.removeIf(...)</code>.</p>
<p><b>No NestJS/TypeScript:</b> é como um <code>Object.freeze</code> que lança erro em vez de ignorar em silêncio. <code>readonly string[]</code> do TS só protege em compilação.</p>`,
      linguagem: 'java',
      codigo: `List<String> fixas = List.of("Cível", "Família");
fixas.add("Criminal");      // UnsupportedOperationException

List<String> editavel = new ArrayList<>(fixas);
editavel.add("Criminal");   // ok

editavel.removeIf(area -> area.startsWith("F"));  // remove "Família"` },
    { titulo: 'Streams: o map/filter do Java',
      texto: `<p>Um <b>Stream</b> é um pipeline: começa em <code>colecao.stream()</code>, passa por operações intermediárias (<code>filter</code>, <code>map</code>, <code>sorted</code>, <code>distinct</code>) e termina numa operação final (<code>toList()</code>, <code>collect</code>, <code>count</code>, <code>anyMatch</code>, <code>findFirst</code>).</p>
<p>Duas regras que pegam quem vem do JS. O stream é <b>preguiçoso</b>: nada roda até a operação final. E é de <b>uso único</b>: reusar dá <code>IllegalStateException: stream has already been operated upon or closed</code>.</p>
<p><code>.toList()</code> (Java 16+) devolve lista <b>imutável</b>; <code>.collect(Collectors.toList())</code>, a forma antiga, devolve uma mutável. Para somar, troque para um stream numérico: <code>mapToInt(...).sum()</code>.</p>
<p><b>No NestJS/TypeScript:</b> <code>processos.filter(...).map(...)</code> vira <code>processos.stream().filter(...).map(...).toList()</code>. O <code>reduce</code> existe, mas quase sempre há um coletor pronto.</p>`,
      linguagem: 'java',
      codigo: `List<ProcessoDto> ativos = processos.stream()
    .filter(p -> p.status() == StatusProcesso.EM_ANDAMENTO)
    .sorted(Comparator.comparing(Processo::dataDistribuicao).reversed())
    .map(p -> new ProcessoDto(p.numero(), p.vara()))
    .toList();

boolean temUrgente = processos.stream().anyMatch(Processo::urgente);
int totalDias = prazos.stream().mapToInt(Prazo::dias).sum();` },
    { titulo: 'groupingBy, Optional e method references',
      texto: `<p><code>Collectors.groupingBy(chave)</code> devolve <code>Map&lt;K, List&lt;T&gt;&gt;</code>. Com um segundo coletor você resume cada grupo: <code>counting()</code> (devolve <code>Long</code>), <code>mapping(...)</code>, <code>summingInt(...)</code>. Para virar mapa de chave única, use <code>Collectors.toMap</code>, que lança <code>IllegalStateException</code> se houver chave duplicada.</p>
<p><code>findFirst()</code>, <code>max()</code> e <code>min()</code> devolvem <code>Optional&lt;T&gt;</code>, um "talvez" explícito. Consuma com <code>orElse</code>, <code>orElseThrow</code>, <code>map</code> ou <code>ifPresent</code>. O próximo módulo aprofunda.</p>
<p><b>Method reference</b> é a lambda abreviada: <code>Atendimento::unidade</code> = <code>a -&gt; a.unidade()</code>; <code>System.out::println</code> = <code>x -&gt; System.out.println(x)</code>; <code>AssistidoDto::new</code> chama o construtor.</p>
<p><b>No NestJS/TypeScript:</b> o <code>groupingBy</code> é o <code>Object.groupBy</code> (ou o <code>groupBy</code> do lodash). O <code>Optional</code> substitui o <code>T | undefined</code> com <code>?.</code> e <code>??</code>.</p>`,
      linguagem: 'java',
      codigo: `Map<String, List<Atendimento>> porUnidade = atendimentos.stream()
    .collect(Collectors.groupingBy(Atendimento::unidade));

Map<String, Long> totalPorUnidade = atendimentos.stream()
    .collect(Collectors.groupingBy(Atendimento::unidade, Collectors.counting()));

Optional<Atendimento> proximo = atendimentos.stream()
    .filter(a -> a.data().isAfter(LocalDate.now()))
    .findFirst();
String quando = proximo.map(a -> a.data().toString()).orElse("sem agenda");` },
  ],
  exercicios: [
    { tipo: 'escolha',
      pergunta: 'O que acontece ao executar este código?',
      codigo: `List<String> areas = List.of("Cível", "Família");
areas.add("Criminal");`,
      opcoes: ['Adiciona "Criminal"', 'Lança UnsupportedOperationException', 'Não compila', 'Ignora a chamada em silêncio'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['<code>List.of</code> cria uma lista imutável.', 'O tipo declarado é <code>List</code>, que tem <code>add</code>: o compilador não reclama.'],
      explica: 'Compila, porque <code>List</code> declara <code>add</code>, mas a implementação imutável lança <code>UnsupportedOperationException</code>. Não há falha silenciosa como no <code>Object.freeze</code> fora do strict mode. Para alterar, use <code>new ArrayList&lt;&gt;(List.of(...))</code>.' },
    { tipo: 'completar',
      pergunta: 'Complete para pegar os nomes dos assistidos com renda até 3 salários:',
      codigo: `List<String> nomes = assistidos.[[0]]()
    .[[1]](a -> a.rendaEmSalarios() <= 3)
    .[[2]](Assistido::nome)
    .toList();`,
      respostas: [['stream'], ['filter'], ['map']],
      dicas: ['Coleção não tem <code>filter</code> direto: primeiro abra o pipeline.', 'Primeiro escolha os itens, depois transforme cada um.'],
      explica: 'O pipeline começa com <code>stream()</code>, <code>filter</code> mantém quem passa no predicado e <code>map</code> transforma cada item. Diferente do JS, <code>List</code> não tem <code>filter</code>/<code>map</code>; eles são do <code>Stream</code>.' },
    { tipo: 'escolha',
      pergunta: 'Qual o tipo de <code>porVara</code>?',
      codigo: `var porVara = processos.stream()
    .collect(Collectors.groupingBy(Processo::vara, Collectors.counting()));`,
      opcoes: ['Map<String, Integer>', 'Map<String, Long>', 'Map<String, List<Processo>>', 'List<Long>'],
      opcoesCodigo: true,
      certa: 1,
      dicas: ['O segundo argumento resume cada grupo.', '<code>counting()</code> conta com o maior tipo inteiro.'],
      explica: '<code>counting()</code> produz <code>Long</code>, então o resultado é <code>Map&lt;String, Long&gt;</code> (supondo <code>vara()</code> String). Sem o segundo coletor seria <code>Map&lt;String, List&lt;Processo&gt;&gt;</code>. <code>Integer</code> é o erro comum na hora de declarar o tipo.' },
    { tipo: 'escolha',
      pergunta: 'O que acontece na segunda linha?',
      codigo: `Stream<Pedido> pendentes = pedidos.stream().filter(Pedido::pendente);
long total = pendentes.count();
List<Pedido> lista = pendentes.toList();`,
      opcoes: [
        'Funciona: o stream pode ser lido duas vezes',
        'A terceira linha lança IllegalStateException: o stream já foi consumido',
        'Não compila: Stream não pode ir para variável',
      ],
      certa: 1,
      dicas: ['Stream não é coleção: é um pipeline.', '<code>count()</code> é uma operação final.'],
      explica: 'Um stream só aceita uma operação final. Depois do <code>count()</code>, o <code>toList()</code> lança <code>IllegalStateException: stream has already been operated upon or closed</code>. Guarde a lista e derive o resto dela, ou crie outro stream.' },
    { tipo: 'escolha',
      pergunta: 'Qual a diferença entre <code>.toList()</code> e <code>.collect(Collectors.toList())</code>?',
      opcoes: [
        'Nenhuma, são sinônimos',
        '<code>.toList()</code> devolve lista imutável; o coletor antigo devolve uma mutável na prática',
        '<code>.toList()</code> só existe para listas de String',
      ],
      certa: 1,
      dicas: ['<code>Stream.toList()</code> chegou no Java 16.', 'Tente dar <code>add</code> no resultado de cada um.'],
      explica: '<code>Stream.toList()</code> devolve uma lista não modificável. <code>Collectors.toList()</code> não garante o tipo, mas devolve um <code>ArrayList</code> na prática. Trocar um pelo outro pode quebrar código que fazia <code>add</code> depois.' },
    { tipo: 'montar',
      pergunta: 'Monte a expressão que transforma entidades em DTOs usando o construtor do record:',
      certa: ['assistidos.stream()', '.map(AssistidoDto::new)', '.toList()'],
      extras: ['.map(new AssistidoDto)', '.forEach(AssistidoDto::new)', '.collect()'],
      dicas: ['Para referenciar um construtor, use <code>::new</code>.', '<code>forEach</code> não devolve nada; você precisa transformar e juntar.'],
      explica: '<code>AssistidoDto::new</code> é a referência ao construtor (funciona se existir um construtor que recebe <code>Assistido</code>). <code>forEach</code> é operação final sem retorno, e <code>collect()</code> sem coletor não compila.' },
    { tipo: 'completar',
      pergunta: 'Complete para contar atendimentos por defensor sem <code>if</code>:',
      codigo: `Map<String, Integer> contagem = new HashMap<>();
for (Atendimento a : atendimentos) {
    contagem.[[0]](a.defensor(), 1, Integer::sum);
}`,
      respostas: [['merge']],
      dicas: ['Um método de <code>Map</code> que insere se não existe e combina se existe.', 'Recebe chave, valor e a função que junta o valor antigo com o novo.'],
      explica: '<code>merge(chave, 1, Integer::sum)</code> grava 1 na primeira vez e soma nas seguintes. Com <code>get</code> + <code>put</code> você precisaria tratar o <code>null</code> da primeira ocorrência. Com stream, o equivalente é <code>groupingBy(..., counting())</code>.' },
    { tipo: 'escolha',
      pergunta: 'Você guarda objetos de uma classe <code>Processo</code> (classe comum, sem <code>equals</code>/<code>hashCode</code>) num <code>HashSet</code>. Dois objetos com o mesmo número são adicionados. Quantos itens o Set tem?',
      opcoes: ['1, porque o número é igual', '2, porque sem equals/hashCode a comparação é por referência', 'Lança exceção de item duplicado'],
      certa: 1,
      dicas: ['De onde o HashSet tira a noção de "igual"?', 'O <code>equals</code> herdado de <code>Object</code> compara referência.'],
      explica: 'Sem sobrescrever <code>equals</code> e <code>hashCode</code>, vale a identidade de <code>Object</code>: dois objetos, dois itens. Um <code>record</code> resolveria, porque gera os dois métodos. Exceção de duplicado só existe em <code>Set.of</code>.' },
  ],
})
