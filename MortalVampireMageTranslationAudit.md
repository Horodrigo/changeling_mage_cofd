# Auditoria de tradução — trabalho pendente

## X01 — JSON canônico em inglês

- Concluir o inventário dos valores de catálogo e configuração ainda salvos em português nas linhas e nos Homebrews importados. Migrar somente aliases exatos e identificáveis pela linha proprietária; não inferir identidade de um nome homônimo nem alterar texto autoral. Verificar criação, edição, importação, exportação e reabertura.
- Revisar `line_data.learned_contracts` em Changeling: ainda armazena cópias de definições. Decidir quais campos são seleções canônicas e quais são texto autoral; atualizar produtores e leitores junto da normalização, sem apagar escolhas antigas.
- Revisar rótulos históricos cuja origem não é explícita, inclusive nomes antigos de `undead_companions` que podem ser tanto o nome PT automático do animal quanto texto digitado pelo jogador. Manter snapshots opacos e recibos pagos intactos; quando houver identidade semântica inequívoca, apresentar no idioma atual sem reescrever o histórico.
- Reexecutar testes de ida e volta EN/PT, identidade de Merits e estornos para as cinco linhas após os lotes restantes. Um JSON salvo/exportado deve conter chaves e escolhas canônicas em inglês, exceto texto explicitamente escrito pelo usuário.

## Vampire

- **Lithopedia — escolhas gratuitas:** conferir Strange Shades p. 28; avisar o usuário antes de implementar as escolhas como subsistema. Conceder o rito gratuito no primeiro ponto e os ritos posteriores condicionados a Status na Bloodline. Integrar criação, Experience, ficha e estorno sem inferir concessões antigas por preço ou reescrever recibos.
- **Hidden Devotions — fonte original:** conferir os textos do autor para Rapidity / Slow and Steady (faixas de preço e adequação do alvo, sobretudo procedimentos ou falas complexas em Rapidity). A reprodução pública e o índice local não substituem essa conferência. Compras antigas sem alvo continuam sem migração ou reprecificação.
- **BFFs, Violent Coercion e Manic Depression:** conferir na fonte original a resistência contra alvos sobrenaturais de outras linhas. O índice local diz Composure + Tolerance; os registros atuais usam Composure + Blood Potency. Não alterar a mecânica apenas com base no índice.
- **Conditions ausentes de Hidden Devotions:** obter e conferir os textos completos de Coerced, Quelled, Manic e Melancholic antes de cadastrar efeito, resolução, Ato e identidade próprios. Coerced/Coagido (Membro) deve permanecer distinto de Leveraged/Coagido Core; não substituir por Conditions homônimas. Verificar também as referências a Addiction e Swooning em seus próprios registros.
- **Referências sem entrada:** Materialized → Materializado e Power Surge → Sobrecarga Elétrica são apenas nomes de apresentação até que a fonte forneça regras completas. Não criar IDs ou efeitos por inferência.

## Mage

| Área | Trabalho pendente |
| --- | --- |
| G02 — Merits | Traduzir nome, requisitos, descrição e níveis aplicáveis dos **42/71 Merits** restantes em `public/game-lines/mage/data/merits*.json`. Manter requisitos e identidades canônicos para parsers e compras. |
| G03 — organizações | Localizar descrições e Tool Yantras das **37/44 Factions** restantes na criação e nas fichas Desktop/Mobile. |
| G04 — Legacies | Localizar as **16 Legacies** e **43 Attainments** em `game-lines/mage/catalog-data/legacies*.json`: nomes descritivos, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções. Preservar nomes próprios. |
| G05 — Conditions | Traduzir as **24/25 Conditions** ainda sem apresentação PT: nome, descrição, resolução e Ato. Conferir Megalomaniacal e Rampant com suas próprias entradas. |

- **Haunted Grimoire — elegibilidade:** Signs of Sorcery p. 86 imprime Spirit 4 + Prime 1, com Death 5 como substituição. Conferir e corrigir as variantes históricas Death 4 e Mind 4 no índice de Spells sem apagar IDs, escolhas ou recibos já salvos.
