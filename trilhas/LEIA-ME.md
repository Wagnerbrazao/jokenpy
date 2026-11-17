# Trilhas extras

Arquivos `<id>.js` desta pasta são trilhas carregadas sob demanda pelo app (rota `/trilhas/<id>.js`).
Eles não vão para o repositório (`.gitignore`): podem ter conteúdo pessoal.
Com a variável `SENHA_<ID>` definida no servidor, o arquivo só é entregue com essa senha.

O arquivo registra a trilha assim: `globalThis.TRILHAS_CARREGADAS.<id> = { CURSO, LICOES }`.
