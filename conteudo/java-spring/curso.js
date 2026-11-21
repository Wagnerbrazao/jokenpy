const CURSO = {
  kicker: 'Java + Spring Boot',
  titulo: 'Do TypeScript ao <em>Spring Boot</em>: APIs Java com a segurança de quem já sabe NestJS.',
  subtitulo: 'Cada conceito é ligado ao que você já usa no NestJS e no TypeScript. No fim, você lê, escreve e defende uma API Spring Boot de produção.',
  rotulo: 'Módulo', rotulos: 'módulos', painel: 'vaga', arquivo: 'o-que-voce-domina.md',
  partes: [
    { titulo: 'Java para quem vem do TypeScript', tipo: 'pedra', ids: ['java-base', 'java-oo', 'java-colecoes', 'java-erros'] },
    { titulo: 'Spring Boot: a base de uma API', tipo: 'papel', ids: ['spring-projeto', 'spring-di', 'spring-rest', 'spring-validacao'] },
    { titulo: 'Dados, testes e produção', tipo: 'tesoura', ids: ['spring-jpa', 'spring-jpa-avancado', 'spring-testes', 'spring-seguranca', 'spring-producao'] },
  ],
  vaga: [
    { texto: 'Ler e escrever Java moderno (21+): tipos, records, interfaces e generics', modulos: ['java-base', 'java-oo'] },
    { texto: 'Trabalhar com coleções, Streams e Optional sem medo de NullPointerException', modulos: ['java-colecoes', 'java-erros'] },
    { texto: 'Criar e entender um projeto Spring Boot (Maven, starters, application.yml)', modulos: ['spring-projeto'] },
    { texto: 'Explicar beans e injeção de dependência comparando com os providers do NestJS', modulos: ['spring-di'] },
    { texto: 'Expor endpoints REST com DTOs, status HTTP corretos, validação e erros padronizados', modulos: ['spring-rest', 'spring-validacao'] },
    { texto: 'Persistir dados com Spring Data JPA, relacionamentos, transações e migrations', modulos: ['spring-jpa', 'spring-jpa-avancado'] },
    { texto: 'Testar a API: unidade, fatia web, repositório e integração', modulos: ['spring-testes'] },
    { texto: 'Proteger a API com Spring Security e JWT', modulos: ['spring-seguranca'] },
    { texto: 'Preparar para produção: perfis, configuração, Actuator e Docker', modulos: ['spring-producao'], diferencial: true },
  ],
}
