# Auditoria de tradução — pendências

## Prioridade 1 — concluir as traduções

- **Mage G04 — Legacies:** localizar as **12 Legacies** e **32 Attainments** restantes em `game-lines/mage/catalog-data/legacies*.json`: títulos descritivos, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções. Preservar nomes próprios e identidades canônicas.
- **House of Ariadne:** antes de localizar, alinhar `legacies-supplement.json` a *Tome of the Pentacle* pp. 153–154. O texto atual resume indevidamente iniciação e efeitos; o segundo Attainment exige apenas Tempo 2 no livro, o terceiro exige dois Contacts ligados à cidade e o quinto exige três Contacts e Status 2 em organização Adormecida da cidade. Conferir também Alcance, Potência e limitações urbanas de cada efeito ao traduzir.
- **Vampire — Conditions:** obter os textos completos de Hidden Devotions para **Coerced, Quelled, Manic e Melancholic** e localizar **Materialized e Power Surge**. Cadastrar a apresentação e o conteúdo de cada Condition sem confundir Coerced com Leveraged/Coagido Core. (Ficará assim: Coerced → Coagido e Leveraged → Pressionado)
- Conferir a apresentação EN/PT das traduções concluídas em criação, Experience e fichas Desktop/Mobile antes de passar às mudanças de regras.

## Prioridade 2 — escolhas e regras faltantes

- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (*Strange Shades* p. 28), em criação, Experience, ficha e estorno. Avisar o usuário antes de acrescentar esse subsistema; não inferir concessões em compras antigas.
- **Order Archive:** adequar a seleção de pontuação ao tipo de arquivo em *Signs of Sorcery* p. 97 (página conferida visualmente): arquivos de Ordens sem Nome, cultos e Legados têm máximo de três pontos; repositórios antigos de ruínas ou coleções recuperadas não têm máximo e não oferecem *Caucus Assets*. O catálogo atual oferece 1–5 para todos e a configuração não registra o tipo de arquivo. (Pesquise na web a respeito e me informe melhor)
- **Hidden Devotions:** conferir na fonte original Rapidity e Slow and Steady, especialmente preço e adequação de alvos com procedimentos ou falas complexas.
- **BFFs, Violent Coercion e Manic Depression:** conferir na fonte original a resistência de alvos sobrenaturais de outras linhas; o índice local e o catálogo divergem entre Composure + Tolerance e Composure + Blood Potency.
- **Conditions de Vampire:** após localizar os textos, conferir efeitos, resolução, Ato e identidades próprios de Coerced, Quelled, Manic, Melancholic, Materialized e Power Surge, inclusive as referências a Addiction e Swooning.

## Verificação final

- Testar criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. Novos JSONs devem usar identidades canônicas em inglês; texto escrito pelo usuário permanece como foi escrito. Preservar IDs, compras, Experience e estornos nas mudanças desta auditoria.
- Não criar migração nem testes de regressão para fichas antigas com valores de catálogo em português: ainda não há usuários da aplicação.
