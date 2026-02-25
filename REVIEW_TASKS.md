# Revisão rápida da base e tarefas sugeridas

## 1) Corrigir erro de digitação (texto para usuário)
**Problema encontrado**: a frase do Hero usa “Código” no singular, enquanto o restante da comunicação do site usa linguagem mais ampla de desenvolvimento. Além disso, há inconsistência de capitalização em alguns textos de CTA.

**Tarefa sugerida**:
- Revisar os textos visíveis da home (`index.html`) e padronizar microcopy (capitalização, pontuação e tom).
- Ajustar o CTA “Veja Meus Projetos” para seguir o padrão escolhido (ex.: sentence case).

**Critério de aceite**:
- Todos os títulos/CTAs seguem o mesmo padrão editorial definido para o site.

## 2) Corrigir bug de marcação HTML
**Problema encontrado**: há tags de fechamento extras na seção de contato, o que pode quebrar a árvore DOM e afetar renderização/acessibilidade.

**Tarefa sugerida**:
- Remover as tags `</a>` e `</div>` excedentes ao final da seção de contato em `index.html`.
- Validar o HTML com um validador (W3C ou html-validate) após a correção.

**Critério de aceite**:
- O documento não apresenta erro de nesting/closing tags no validador.
- A seção de contato mantém o layout esperado em desktop e mobile.

## 3) Ajustar comentário de código / discrepância de documentação interna
**Problema encontrado**: em `script.js`, o comentário diz “Filtrar apenas repositórios públicos e que não sejam forks”, mas a implementação filtra apenas `!repo.fork`. Isso cria discrepância entre comentário e código.

**Tarefa sugerida**:
- Escolher uma abordagem e alinhar comentário + implementação:
  - (a) manter filtro só de forks e corrigir comentário; ou
  - (b) aplicar filtro explícito também para visibilidade pública (`repo.visibility === 'public'`), se necessário.
- Documentar a decisão em comentário curto próximo ao filtro.

**Critério de aceite**:
- Comentário e comportamento real do filtro estão consistentes.

## 4) Melhorar testes (cobertura de comportamento crítico)
**Problema encontrado**: não há testes automatizados para o carregamento de repositórios nem para o toggle do menu mobile.

**Tarefa sugerida**:
- Adicionar testes de front-end (ex.: Vitest + jsdom) para:
  - toggle da classe `active` no clique do botão `.menu-toggle`;
  - renderização de cards a partir de payload mockado da API;
  - comportamento quando `fetch` falha (mensagem de erro/fallback de UI).

**Critério de aceite**:
- Suíte de testes executa em CI/local com casos de sucesso e falha para fetch.
- Cobertura inclui ao menos os fluxos de menu mobile e listagem de repositórios.
