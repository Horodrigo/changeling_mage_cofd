# Auditoria de tradução — pendências

## Escolhas e regras faltantes

- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (*Strange Shades: Mekhet* p. 28), em criação, Experience, ficha e estorno; exibir as escolhas na ficha. Para o alcance, prevalece a redação do livro: meia milha quadrada básica, mais meia milha por Potência, dentro do território. Não inferir concessões em compras antigas. O usuário foi avisado sobre o subsistema.
- **Order Archive:** seguir a configuração aprovada pelo usuário para o Merit de *Signs of Sorcery* p. 97: graduação 1–5, contribuição de pontos compartilhados como Safe Place, vínculo obrigatório de cada instância a uma instância canônica de Awakened Status, uma escolha de Arcana protegida por ponto efetivo e um tipo de Caucus Asset por ponto efetivo. Exibir Arcana e Assets escolhidos em Expanded Merits, com apresentação EN/PT e identidades canônicas no JSON. Remover da descrição a remissão “see above” e a nota anterior da auditoria sobre variantes de arquivos; esta configuração não depende do tipo de arquivo.
- **Rapidity:** preservar a opção oficial e acrescentar separadamente **Rapidity (Errata)** como opção de Homebrew/errata, sem trocar a identidade da opção oficial. A versão do suplemento *Secrets of the Covenants: Supplemental Devotions* exige uma Devotion de ação instantânea, Celerity igual ao custo normal de aprendizado da Devotion alvo, preço de 1/2/3 Experiences para requisito 1–2/3–4/5 e exclui efeitos que requerem mais de uma palavra ou procedimentos físicos complicados; o Storyteller avalia os casos ambíguos. Conferir a origem e a mecânica da opção oficial antes de separá-las, preservando compras e estornos por ID.

## Verificação final

- Fazer a conferência manual de criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. Novos JSONs devem usar identidades canônicas em inglês; texto escrito pelo usuário permanece como foi escrito. Preservar IDs, compras, Experience e estornos nas mudanças desta auditoria. Os 50 testes automatizados de persistência e Experience passaram em 15/10/2026; eles não substituem essa conferência das telas.
- Não criar migração nem testes de regressão para fichas antigas com valores de catálogo em português: ainda não há usuários da aplicação.
