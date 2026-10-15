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

- **Order Archive:** adequar a seleção de pontuação ao tipo de arquivo em *Signs of Sorcery* p. 97 (página conferida visualmente): arquivos de Ordens sem Nome, cultos e Legados têm máximo de três pontos; repositórios antigos de ruínas ou coleções recuperadas não têm máximo e não oferecem *Caucus Assets*. O catálogo atual oferece 1–5 para todos e a configuração não registra o tipo de arquivo. Preservar compras existentes e não liberar pontuação ilimitada sem distinguir esses tipos.
- **G04 — Legacies:** localizar as **14 Legacies** e **36 Attainments** restantes em `game-lines/mage/catalog-data/legacies*.json`: títulos descritivos, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções. Preservar nomes próprios.
