# Auditoria de tradução — pendências

## X01 — persistência

- Identificar valores de catálogo e configuração ainda persistidos em português, inclusive em Homebrews importados. Converter somente aliases exatos da linha proprietária; preservar texto autoral, IDs, compras e estornos.
- Após os lotes restantes, verificar criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. O JSON deve manter identidades canônicas em inglês, exceto texto escrito pelo usuário.

## Vampire

- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (Strange Shades p. 28), em criação, Experience, ficha e estorno. Avisar o usuário antes de acrescentar esse subsistema; não inferir concessões em compras antigas.
- **Hidden Devotions:** conferir na fonte original Rapidity e Slow and Steady, especialmente preço e adequação de alvos com procedimentos ou falas complexas.
- **BFFs, Violent Coercion e Manic Depression:** conferir na fonte original a resistência de alvos sobrenaturais de outras linhas; o índice local e o catálogo divergem entre Composure + Tolerance e Composure + Blood Potency.
- **Coerced, Quelled, Manic e Melancholic:** obter os textos completos de Hidden Devotions e cadastrar efeitos, resolução, Ato e identidades próprios. Distinguir Coerced de Leveraged/Coagido Core; conferir as referências a Addiction e Swooning.
- **Materialized e Power Surge:** localizar as regras completas e cadastrar as Conditions; por enquanto só há nomes localizados nas referências.

## Mage

- **G02 — Merits:** localizar nome, requisitos, descrição e níveis dos **38/71 Merits** restantes em `public/game-lines/mage/data/merits*.json`, sem alterar requisitos canônicos, IDs ou compras.
- **G04 — Legacies:** localizar as **16 Legacies** e **43 Attainments** em `game-lines/mage/catalog-data/legacies*.json`: títulos descritivos, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções. Preservar nomes próprios.
