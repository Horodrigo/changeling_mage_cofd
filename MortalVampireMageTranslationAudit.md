# Auditoria de tradução — pendências

## Escolhas e regras faltantes

- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (*Strange Shades: Mekhet* p. 28), em criação, Experience, ficha e estorno; exibir as escolhas na ficha. Para o alcance, prevalece a redação do livro: meia milha quadrada básica, mais meia milha por Potência, dentro do território. Não inferir concessões em compras antigas. O usuário foi avisado sobre o subsistema.
- **Order Archive:** seguir a configuração aprovada pelo usuário para o Merit de *Signs of Sorcery* p. 97: graduação 1–5, contribuição de pontos compartilhados como Safe Place, vínculo obrigatório de cada instância a uma instância canônica de Awakened Status, uma escolha de Arcana protegida por ponto efetivo e um tipo de Caucus Asset por ponto efetivo. Exibir Arcana e Assets escolhidos em Expanded Merits, com apresentação EN/PT e identidades canônicas no JSON. Remover da descrição a remissão “see above” e a nota anterior da auditoria sobre variantes de arquivos; esta configuração não depende do tipo de arquivo.
- **Rapidity:** há uma única versão, já cadastrada sob o ID `devotion-rapidity`; o usuário confirmou que não é Homebrew nem há uma segunda Errata. Ela vincula uma Devotion instantânea, exige Celerity igual ao preço normal dela, custa 1/2/3 Experiences para requisito 1–2/3–4/5 e exclui mais de uma palavra ou procedimentos físicos complicados. Preservar o ID, compras e estornos. Falta restringir os alvos comprovadamente incompatíveis; casos ambíguos ficam com o Storyteller.

## Verificação final

- Fazer a conferência manual de criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. Novos JSONs devem usar identidades canônicas em inglês; texto escrito pelo usuário permanece como foi escrito. Preservar IDs, compras, Experience e estornos nas mudanças desta auditoria. Os 50 testes automatizados de persistência e Experience passaram em 15/10/2026; eles não substituem essa conferência das telas.
- Não criar migração nem testes de regressão para fichas antigas com valores de catálogo em português: ainda não há usuários da aplicação.
