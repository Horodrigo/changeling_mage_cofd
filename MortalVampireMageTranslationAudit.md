# Auditoria de tradução — trabalho pendente

## X01 — persistência e histórico

- Inventariar e normalizar os valores de catálogo e configuração ainda salvos em português, inclusive em Homebrews importados. Migrar apenas aliases exatos identificados pela linha proprietária, preservando texto autoral, IDs, compras e estornos.
- Decidir quais campos de `line_data.learned_contracts` precisam continuar como snapshot de contingência e como tratar textos PT históricos que não coincidam com a apresentação atual.
- Decidir como apresentar rótulos históricos de origem ambígua, inclusive nomes antigos de `undead_companions` que podem ser automáticos ou escritos pelo jogador, sem reescrever snapshots e recibos.
- Ao concluir os lotes restantes, verificar criação, edição, importação, exportação, reabertura e ida e volta EN/PT nas cinco linhas. O JSON deve salvar chaves e escolhas canônicas em inglês, exceto texto escrito pelo usuário.

## Vampire

- **Lithopedia — escolhas gratuitas:** implementar o rito gratuito no primeiro ponto e os ritos posteriores condicionados a Status na Bloodline, conforme Strange Shades p. 28. Avisar o usuário antes de acrescentar esse subsistema; integrar criação, Experience, ficha e estorno sem inferir concessões antigas.
- **Lithopedia — alcance:** corrigir os cinco resumos EN/PT que ainda dizem meia milha adicional por Potência; a decisão aprovada é uma milha por Potência, conforme Strange Shades p. 28.
- **Hidden Devotions — fonte original:** conferir os textos do autor para Rapidity / Slow and Steady, sobretudo faixas de preço e adequação do alvo a procedimentos ou falas complexas. Não usar a reprodução pública ou o índice local como confirmação da fonte.
- **BFFs, Violent Coercion e Manic Depression:** conferir na fonte original a resistência contra alvos sobrenaturais de outras linhas. O índice local diz Composure + Tolerance; os registros atuais usam Composure + Blood Potency. Não alterar a mecânica apenas com base no índice.
- **Conditions de Hidden Devotions:** obter os textos completos de Coerced, Quelled, Manic e Melancholic; então cadastrar efeitos, resoluções, Atos e identidades próprios. Distinguir Coerced de Leveraged/Coagido Core e conferir as referências a Addiction e Swooning.
- **Materialized e Power Surge:** localizar regras completas na fonte antes de cadastrar essas Conditions; atualmente há apenas nomes traduzidos em referências.

## Mage

| Área | Trabalho pendente |
| --- | --- |
| G02 — Merits | Traduzir nome, requisitos, descrição e níveis aplicáveis dos **42/71 Merits** restantes em `public/game-lines/mage/data/merits*.json`. Manter requisitos e identidades canônicos para parsers e compras. |
| G03 — organizações | Localizar descrições e Tool Yantras das **23/44 Factions** restantes na criação e nas fichas Desktop/Mobile. |
| G04 — Legacies | Localizar as **16 Legacies** e **43 Attainments** em `game-lines/mage/catalog-data/legacies*.json`: nomes descritivos, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções. Preservar nomes próprios. |
| G05 — Conditions | Traduzir as **24/25 Conditions** ainda sem apresentação PT: nome, descrição, resolução e Ato. Conferir Megalomaniacal e Rampant com suas próprias entradas. |

- **Haunted Grimoire — elegibilidade:** corrigir no índice de Spells as variantes históricas Death 4 e Mind 4 conforme Signs of Sorcery p. 86 (Spirit 4 + Prime 1; Death 5 como substituição), preservando IDs, escolhas e recibos.
