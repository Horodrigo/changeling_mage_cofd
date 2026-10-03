# Auditoria de tradução — Mortal, Vampire e Mage

Data: 2026-10-02. Estado: **auditoria respondida; meta ativa, começando pelas prioridades abaixo**.

## Escopo e método

Levantamento dos catálogos, dicionários e componentes que apresentam seu conteúdo. A etapa de levantamento não alterou traduções, regras, persistência ou interface, nem revisou PDFs ou executou teste visual. Este arquivo agora centraliza as decisões de localização anteriores, antes registradas em `DictionaryAudit.md` e `MeritsBR.md`, e o plano aprovado para execução.

As contagens representam os registros atualmente distribuídos no repositório, incluindo suplementos, conteúdo Homebrew e registros de errata. Não significam que todos estejam habilitados ou disponíveis para qualquer personagem. Registros relacionados em linhas diferentes não foram deduplicados: o mesmo nome pode ter regras distintas.

Um campo canônico em inglês não é, por si só, uma pendência: foram examinadas também as apresentações PT e seus consumidores. Nomes próprios, títulos de livros, IDs, termos preservados por decisão anterior e textos escritos pelo jogador não devem ser traduzidos automaticamente. Traduções/localizações descritivas estão autorizadas; dúvidas novas serão registradas aqui e consultadas com o usuário quando necessário.

## Meta e ordem de execução aprovadas

- [ ] **0 — Prioridades da auditoria:** corrigir primeiro X01 e a identidade de compras de Merits: definition/catalog ID estável, instance ID para compras repetíveis e histórico semântico localizado na exibição. Não depender de nomes de exibição para comprar, localizar, atualizar ou estornar. Preservar compras existentes, saldos e alocações; verificar os caminhos de criação/edição, compra, importação/exportação e estorno. Documentar qualquer recuperação estritamente necessária sem suporte genérico a schemas antigos.
- [x] **0 — Consolidação documental:** incorporar o histórico editorial dos documentos anteriores neste arquivo, incluindo pendências mecânicas, sem aplicar correções de regras incidentalmente. Remover auditorias concluídas após preservar suas informações. `WerewolfAudit.md` permanece porque contém trabalho adiado e decisões mecânicas ainda necessárias; sua terminologia relevante é consolidada abaixo.
- [ ] **0 — Homônimos:** identificar Conditions/Tilts de linhas diferentes com o mesmo nome e distinguir sua apresentação por qualificador de linha, incluindo EN/PT. Exemplos aprovados: `Charmed(Kindred)` e `Charmed(Awakened)`. Localizar o nome e o qualificador conforme o idioma e o léxico aprovado, mantendo IDs, origem e efeitos distintos. Não acrescentar sufixo indiscriminadamente a itens sem colisão e não fundir registros por nome.
- [ ] **0 — Merits homônimos:** aplicar o qualificador de linha também aos Merits com o mesmo nome **quando seus efeitos mecânicos forem diferentes**. Comparar requisitos, benefícios, níveis, custos, limites e exceções, não apenas a igualdade das descrições. Redação ligeiramente diferente com o mesmo efeito não justifica distinguir a apresentação. Preservar cada identidade de catálogo e instância; sem fusão ou alteração mecânica incidental. Registrar dúvida quando a equivalência não puder ser determinada com segurança.
- [ ] **1 — Mortals/Core:** completar primeiro Conditions Core e Tilts compartilhados, inclusive resolução, Beat, categorias e referências terminológicas. Não retraduzir os Merits Core já cobertos, exceto uniformizações necessárias.
- [ ] **2 — Interface:** corrigir mensagens, rótulos e textos dinâmicos remanescentes nas superfícies Desktop/Mobile; preservar texto autoral e verificar alternância EN/PT.
- [ ] **3 — Vampire:** referências, Merits, poderes, Conditions e textos dinâmicos. Conteúdo oficial e Homebrew no mesmo trabalho, preservando a identificação de origem.
- [ ] **4 — Mage:** Merits, Spells, Orders/Factions/Ministries, Legacies/Attainments, Conditions e integração de apresentação. Conteúdo oficial e Homebrew no mesmo trabalho, preservando a identificação de origem.

Impressão/PDF/blank fica **fora desta meta**, inclusive a inconsistência de Numina do Familiar identificada no levantamento. As superfícies existentes não devem sofrer regressões. Trabalhar em lotes verificáveis, com commits coerentes e testes de identidade, EN/PT e regras; concluir apenas após completar o escopo e os quality gates. As contagens abaixo são o inventário inicial, não uma declaração de trabalho concluído.

## Resumo

| Área | Inventário | Pendência de apresentação PT |
| --- | --- | --- |
| Interface | Common: 672 chaves; Mortal: 34; Vampire: 370; Mage: 388 | Nenhuma chave sem correspondente PT nesses dicionários; há textos dinâmicos e rótulos fora deles, listados abaixo |
| Merits Core | 202 | Todos têm entrada PT; não precisam de uma nova tradução integral |
| Conditions Core | 34 | Resolução das 34; textos de Beat das 16 que os possuem; categorias inconsistentes |
| Tilts compartilhados | 35 | Descrição, efeito, causa e encerramento em inglês; alguns nomes também precisam de revisão |
| Vampire — referências | 16 Clans, 23 Covenants, 27 Anchors, 56 Bloodlines | Textos mecânicos; nomes parcialmente traduzidos ou próprios |
| Vampire — Merits | 403 | 353 descrições em inglês; 50 descrições PT existentes precisam de revisão dos demais campos |
| Vampire — poderes | 546 registros, mais 140 entradas de níveis internas | Textos mecânicos em inglês; nomes parcialmente traduzidos |
| Vampire — Conditions | 66 | Sem apresentação PT dedicada |
| Mage — Merits | 71 | Sem apresentação PT dedicada; incluem 31 entradas de níveis |
| Mage — Spells | 360 | Nomes e textos, incluindo Practice, fatores, Withstand e cláusulas |
| Mage — Legacies | 16, com 43 Attainments cadastrados | Apresentação completa |
| Mage — organizações | 44 Factions, 17 Orders, 12 Ministries | Factions e Ministries; 11 Orders ainda sem descrição PT |
| Mage — Conditions | 24 | Sem apresentação PT dedicada |

## M — Mortal e conteúdo compartilhado

### M01 — Conditions Core: tradução parcial

Arquivos: `public/shared/data/conditions.json` e `conditions-pt.json`.

- As 34 Conditions já possuem nome e descrição PT.
- Nenhuma das 34 resoluções possui campo PT no arquivo de apresentação.
- Os 16 textos não vazios de Beat também não possuem campo PT.
- Apenas 11 das 34 apresentações fornecem categoria; as outras 23 herdam a categoria canônica. O filtro mostra a categoria diretamente, permitindo mistura de idiomas.
- `Shaken` e `Steadfast` ainda usam a palavra `Condition` em suas descrições PT.
- `Bonded` usa “Trato com Animais” no efeito, enquanto a apresentação compartilhada de `Animal Ken` usa “Empatia com Animais”: uniformizar sem mudar a regra.

Impacto confirmado: o catálogo e as Conditions selecionadas exibem resolução e Beat diretamente em `app/workspace/condition-manager.tsx`. Mortal combina o catálogo canônico com a apresentação PT em sua ficha e impressão.

### M02 — Tilts compartilhados

Arquivo: `lib/catalog-data/tilts.json`. Consumidor: `app/workspace/combat-page.tsx`.

Os 35 registros mantêm em inglês `description`, `effect`, `causing` e `ending`, exibidos diretamente mesmo em PT. Esta pendência afeta também Vampire e Mage.

24 registros têm nome PT diferente do inglês. Os 11 restantes merecem decisão editorial, sem presumir que todos devam mudar:

`Bleeding`, `Burning`, `Came Prepared`, `Pierced Armor`, `Pinned`, `Flesh Too Solid`, `Nimbus`, `Poor Light`, `Shattered Time`, `Urban Collapse`, `Riot`.

### M03 — O que não precisa de nova tradução integral

- Os 202 Merits Core têm apresentação PT por ID, incluindo os requisitos e níveis aplicáveis. Seus arquivos canônicos e o índice de descoberta devem continuar em inglês.
- Equipamentos compartilhados: 27 Weapons, 7 Armors e 36 Equipment já possuem campos bilíngues.
- Companions compartilhados: 9 Vehicles e 21 Animals já possuem campos bilíngues.
- As mensagens próprias de Mortal e as mensagens comuns de criação, Virtue, Vice, Integrity e experiência já têm correspondentes PT nos dicionários.

Isso confirma cobertura, não uma nova auditoria editorial de cada efeito ou uma verificação contra PDFs.

## V — Vampire

### V01 — Clans e Covenants

Arquivos: `public/game-lines/vampire/data/clans.json` e `covenants.json`. O carregador `game-lines/vampire/catalogs/reference.ts` não agrega uma apresentação PT equivalente à dos Merits Core.

- **16 Clans:** textos de `baneName` e `baneSummary` em inglês. Separar nomes próprios, como `Daeva`, de títulos descritivos, como `Hollow Mekhet` e `Twice-Cursed`, antes de decidir quais nomes traduzir.
- **23 Covenants:** descrições e vantagens em inglês. Só três registros têm nome PT diferente do inglês: `Covenantless`, `Carthian Movement` e `Circle of the Crone`.
- A apresentação atual `Sem Covenant` contradiz a decisão já aprovada de usar “Coalizão”.
- Há organizações históricas e conteúdo Homebrew distribuído junto do catálogo: não tratar todo o inventário como conteúdo oficial do livro básico.

Exemplos de campos pendentes: `The Wanton Curse`, `Carthian Law Merits`, `Coils and Scales of the Dragon`, `Invictus Oaths`.

### V02 — Mask e Dirge

Arquivo: `public/game-lines/vampire/data/anchors.json`.

São **27 definições compartilhadas por Mask e Dirge**, não 54 Anchors diferentes. Os nomes já têm apresentação PT, exceto `Monster`, cuja grafia igual não caracteriza necessariamente uma lacuna.

Os **54 textos de recuperação de Willpower** — dois por definição — permanecem em inglês. Aparecem na explicação da criação e nas informações da ficha, embora os rótulos ao redor estejam traduzidos.

### V03 — Bloodlines

Arquivo: `public/game-lines/vampire/data/bloodlines.json`.

**56 registros: 14 não marcados como Homebrew e 42 marcados como Homebrew.** Os campos textuais presentes de resumo, apelidos, requisitos, Gift e Bane continuam em inglês. Os nomes das Bloodlines são iguais nos dois idiomas; nomes próprios devem ser avaliados individualmente, não renomeados em bloco.

A página de Bloodline apresenta esses campos diretamente. A tradução deve preservar Clan, disciplinas, pré-requisitos e identidades canônicas.

### V04 — Merits

Arquivo: `public/game-lines/vampire/data/merits.json`.

**403 registros:** 249 marcados como Homebrew e 154 restantes. Nove registros de errata já estão incluídos nesse total. Há **80 entradas de níveis**, que também precisam de apresentação quando aplicáveis.

- **353** descrições são iguais à descrição inglesa.
- **50** descrições já são diferentes e estão em PT; isso não comprova tradução completa de requisitos, níveis e demais campos.
- **48** nomes têm apresentação diferente da canônica. Os demais incluem nomes próprios e nomes ainda não traduzidos.
- Exemplos de resíduos nas traduções parciais: `Kindred Status` está como “Status entre os Kindred” e menciona `Clã, Covenant ou domínio`; `Kindred Dueling` usa “Duelo entre Kindred” e requisitos `Brawl`/`Composure`.

Aplicar as decisões existentes sobre `Kindred` e `Covenant`, sem retraduzir os Merits Core compartilhados nem deduzir elegibilidade pela tradução. O lote precisa distinguir material oficial, Homebrew e errata.

### V05 — Poderes

Arquivo: `public/game-lines/vampire/data/powers.json`.

| Família | Registros | Situação |
| --- | ---: | --- |
| Disciplines | 23 | Nomes parcialmente PT; 110 entradas de níveis com textos mecânicos em inglês |
| Ritual Disciplines | 5 | Apresentação predominantemente inglesa |
| Devotions | 356 | Nomes parcialmente PT; textos mecânicos em inglês |
| Lashes | 2 | Apresentação inglesa |
| Crúac Rites | 76 | Nomes parcialmente PT; textos mecânicos em inglês |
| Theban Miracles | 32 | Nomes parcialmente PT; textos mecânicos em inglês |
| Kimiya Formulae | 5 | Apresentação inglesa |
| Therion Sacrileges | 7 | Apresentação inglesa |
| Gilded Invocations | 10 | Apresentação inglesa |
| Detournements | 5 | Apresentação inglesa |
| Coils | 6 | Nomes parcialmente PT; 30 entradas de níveis com textos mecânicos em inglês |
| Scales | 19 | Nomes parcialmente PT; textos mecânicos em inglês |

Total: **546 registros de primeiro nível**. As **140 entradas internas de níveis** não são outros 140 poderes independentes.

Traduzir os campos efetivamente existentes: resumo, efeito, custo, Dice Pool, ação, duração, resultados, modificadores, procedimento, Sacrament, requisitos e opções. Não criar resultados ou requisitos ausentes. A ficha, a compra por experiência e a apresentação de Homebrew exibem esses textos canônicos diretamente.

Alguns nomes já traduzidos, por exemplo em `Animalism` ou `Coil of the Ascendant`, não indicam que seus efeitos estejam traduzidos.

### V06 — Conditions e textos dinâmicos

- **66 Conditions** em `public/game-lines/vampire/data/conditions.json`, incluindo 19 marcadas como Homebrew e dois registros de errata: nomes e textos sem apresentação PT dedicada.
- **42 rótulos de Breaking Points** em `game-lines/vampire/catalog-data/detachment.json`: 41 na lista e um caso adicional `vastDynastyEmbrace`. A ficha mostra os rótulos em inglês.
- **Seis presets de Shadow Cults** em `game-lines/vampire/catalog-data/shadow-cults.json`: revisar benefícios textuais predefinidos e nomes de Specialties, como `Spirits`, `Kindred`, `Prophecy` e `Surveillance`. Não traduzir a configuração livre escrita pelo usuário.

## G — Mage

### G01 — Spells

Arquivos: `public/game-lines/mage/data/spells/index.json` e seus shards. O carregador `game-lines/mage/catalogs/spells.ts` não agrega apresentação PT.

**360 Spells:** Death 46; Fate 30; Forces 38; Life 29; Matter 32; Mind 45; Prime 50; Space 29; Spirit 36; Time 25.

Pendentes: nomes, resumos, descrições, Practice, Primary Factor, Withstand e textos de Reach/Add Arcanum. Esses valores chegam diretamente à criação e à ficha.

**Cuidado de implementação futura:** `spellReach` em `builder-view.tsx` interpreta padrões ingleses como `Reach:` e `Add Arcanum`. Não substituir texto canônico por PT na entrada desse parser. A apresentação localizada deve permanecer separada da interpretação mecânica.

Há também um fallback literal `Descrição não disponível.` fora do dicionário, tanto no Builder quanto na ficha: pode aparecer em EN quando faltar uma descrição.

### G02 — Merits

Arquivos: `public/game-lines/mage/data/merits.json` e `merits-supplements.json`.

**71 Merits únicos:** 61 no catálogo principal e 10 no suplementar, com **31 entradas de níveis**. Nomes, descrições, requisitos e benefícios de níveis não possuem apresentação PT dedicada.

Não somar novamente os Merits de origem Mage que já pertencem ao catálogo compartilhado Core e possuem apresentação PT.

### G03 — Orders, Factions e Ministries

- **17 Orders** em `game-lines/mage/catalog-data/orders.json`. Seis têm `descriptionPt`; **11 ainda não têm**: `Jnanashakti`, `Mahanizrayani`, `Samashti`, `Vajrastra`, `Ajivaki`, `Arcadian Mysteries`, `Karpani`, `Mantra Sadhaki`, `Weret-Hekau`, `Company of the Codex`, `Bay City Marshals`. Avaliar nomes descritivos separadamente dos nomes próprios.
- **44 Factions** em `public/game-lines/mage/data/factions.json`: nomes e Tool Yantras sem apresentação PT.
- **12 Ministries** em `game-lines/mage/catalog-data/affiliations.json`: nomes e descrições em inglês. Os títulos de Patron Exarchs precisam de decisão editorial individual.

Os cinco nomes de Paths são nomes próprios e suas associações mecânicas usam apresentações compartilhadas. Não há cinco descrições longas de Paths esperando tradução nesse catálogo atual.

### G04 — Legacies

Arquivos: `game-lines/mage/catalog-data/legacies.json` e `legacies-supplement.json`.

**16 Legacies e 43 Attainments cadastrados.** Pendentes: nomes, requisitos, iniciação, organização, teoria, Yantras, Oblations, Attainments e efeitos opcionais.

Inventário: `The Eleventh Question`, `Chronologue`, `Engineers of the System`, `House of Ariadne`, `Perfected Adepts`, `Nighthawks`, `Tyrian Archons`, `Shapers of the Invisible`, `Logophages`, `Reality Stalkers`, `Stone Scribes`, `Illumined Path`, `Intendants of the Building`, `Nagaraja`, `Keepers of the Covenant`, `Kitchen Alchemists`.

Além do catálogo:

- `game-lines/mage/legacy-page.tsx` apresenta literalmente `Tutelage`, `Daimonomikon`, `Soul or Soul Stone Study`, `1 Experience` e `1 Arcane Experience` nas opções (movido da antiga superfície compartilhada).
- `game-lines/mage/legacies.ts` gera rótulos de requisitos em inglês, incluindo nomes de traits e `Qualifying Skill`.
- As identidades, os valores necessários e as opções mecânicas devem permanecer canônicos; apenas a apresentação precisa ser localizada.

### G05 — Conditions e interface remanescente

- **24 Conditions** em `public/game-lines/mage/data/conditions.json`: nomes, descrição, resolução e Beat sem apresentação PT.
- A ficha usa literalmente `Megalomaniacal` e `Rampant` nas opções de resultados de Hubris.
- As abas mobile `Stats` e `Legacy`, em `game-lines/mage/sheet-view.tsx`, não usam os dicionários. Há também um fallback literal `Legacy` no nome da seção.
- A impressão do Familiar mostra os nomes canônicos de Numina diretamente em `game-lines/mage/print-sheet.tsx`, enquanto a página do Companion já possui apresentação localizada para os 18 nomes. É inconsistência de consumo, não um novo catálogo inteiro por traduzir. O termo **Numina permanece Numina**, conforme decisão anterior.

Os Lesser/Greater Utility Attainments já possuem textos bilíngues locais na ficha. Não entram como tradução integral pendente, embora futuramente sua organização de apresentação possa ser uniformizada.

## X — Consistência entre idiomas

### X01 — Histórico de experiência

Nas três linhas há transações cujo texto é montado no idioma da compra e depois exibido diretamente. Alternar EN/PT não relocaliza esse histórico:

- Mortal: `game-lines/mortal/experience-panel.tsx`, campo `entry.label`.
- Vampire: `game-lines/vampire/experience-panel.tsx`, campo `entry.label`.
- Mage: `game-lines/mage/experience-panel.tsx`, campo `entry.description`.

É dívida de apresentação dinâmica, não falta de uma frase no dicionário. Uma correção futura deve renderizar a identidade semântica da transação sem alterar XP, compras ou histórico persistido. Mage também tem tratamento de estorno que interpreta descrições antigas: traduzir ou sobrescrever o histórico indiscriminadamente pode afetá-lo.

### X02 — Catálogos e conteúdo do jogador

- Usar apresentação por ID, preservando inglês canônico para regras, filtros mecânicos e escolhas persistidas.
- Resolver nomes localizados nos consumidores de criação, experiência, ficha e Homebrew, evitando uma superfície PT e outra EN. Impressão está adiada por A08.
- Manter títulos de livros no original.
- Não traduzir nomes, notas, benefícios customizados, Specialties ou outros textos livres escritos pelo jogador.
- Conditions com nomes iguais em Core, Vampire e Mage precisam de terminologia coerente, mas não devem compartilhar efeitos diferentes só por terem o mesmo nome.

### X03 — Ownership dos Contracts e estilos especializados

Inspeção motivada pelos exemplos do usuário em Core e `app/css/globals.css`:

- `lib/core/` não contém mecânicas de Contracts. O ID suportado `CtL` em `game-line-ids.ts` é parte do roteamento neutro.
- `lib/game-line-contracts/` define contratos de programação (interfaces de registro, regras, UI e catálogos), não poderes de Changeling; permanece compartilhado.
- **Dívida real:** `lib/contract-presentation.ts`, `lib/contract-clauses.ts`, o tipo `ContractDefinition` em `lib/catalog/catalog-types.ts` e sua reexportação em `lib/catalog/contract-catalog.ts` são especializados de Changeling. Devem passar para a linha sem duplicação ou adapters permanentes.
- **Dívida real em mecanismo compartilhado:** `lib/merits.ts` lê `line_data.contracts`/`learned_contracts`, Court, Seeming, Wyrd e outros campos de linhas na montagem de contexto, e interpreta requisitos específicos de Contracts. A migração precisa preservar a elegibilidade por hooks/contexto da linha, não apenas deslocar ou renomear arquivos.
- Os seletores exclusivos `.changeling-homebrew-source`, `.entitlement-homebrew-editor .homebrew-form` e `.contract-homebrew-editor .homebrew-form` foram movidos de `app/css/globals.css` para `game-lines/changeling/styles/sheet.css`, sem mudança de valores.
- Classes visuais reutilizadas por Changeling/Mage/Vampire foram neutralizadas: `rule-power-*`, `creation-power-*`, `template-choice-*`, `custom-template-editor` e `affiliation-*`. O marcador compartilhado de recurso armazenado usa `stored-resource-dot`. Seletores exclusivos de Kith, Court, Regalia, Token, Entitlement, Clarity e Goblin Debt passaram para o CSS de Changeling, preservando declarações e media queries; regras sem consumidores foram removidas. Testes protegem os novos nomes e a localização. Não há transferência automática de ownership mecânico pela reutilização visual. A superfície de Entitlements ainda em `app/workspace/entitlement-page.tsx` também deve passar para Changeling.
- Homebrew não constitui uma exceção: o shell/controles realmente comuns são compartilhados; editores e mecânicas específicos pertencem à linha.

## Decisões da auditoria — aprovadas em 2026-10-02

| ID | Decisão necessária | Sua decisão |
| --- | --- | --- |
| A01 | Conteúdo oficial e Homebrew | Traduzir em conjunto, sem apresentar Homebrew como oficial. |
| A02 | Nomes | Não traduzir nomes próprios; traduzir o restante. Localizar expressões cuja tradução literal não funcione ou consultar o usuário. |
| A03 | Conditions Core e Tilts compartilhados | Prioridade confirmada antes dos catálogos exclusivos. |
| A04 | Conditions/Tilts homônimos entre linhas | Qualificar todos os homônimos pela linha na apresentação; exemplos Charmed(Kindred) e Charmed(Awakened). Não mudar identidades ou efeitos. Complemento do usuário: Merits homônimos também recebem qualificador quando os efeitos forem diferentes, não quando apenas a redação variar. |
| A05 | Histórico editorial | Consolidar as decisões anteriores neste arquivo e remover os documentos de auditoria cujas tarefas já foram concluídas. |
| A06 | Metadados de Spells | Practice → Práticas; Primary Factor → Fator Primário; Withstand → Resistência; Reach → Alcance; Add Arcanum → Adicionar Arcana. Mostrar sempre que aplicável, mantendo canônicos os dados dos parsers. |
| A07 | X01 e identidade de Merits | Corrigir como primeira prioridade, independentemente da tradução. Compras vinculadas por Merit ID estável e instância exata, nunca pelo nome de exibição; histórico localizado semanticamente. |
| A08 | Superfícies | Desktop/Mobile; impressão fica para o futuro. |

## Léxico consolidado — precedência das decisões atuais

As decisões mais recentes do usuário prevalecem sobre as propostas históricas copiadas nos anexos. A cópia preserva o histórico, não transforma propostas antigas em novas aprovações nem reabre escolhas já decididas.

- Seeming → **Feição**; Mien → **Semblante Feérico**. Substituem as formas anteriores que confundiam os dois conceitos.
- True Fae → **Feé Verdadeiro**; Changeling e Fae permanecem no original. Nomes da língua Uratha permanecem originais em todos os idiomas.
- Motley → **Retalho**; Freehold → **Povoado**; Kith → **Frátria**; Hollow → **Vão**.
- Huntsman/Huntsmen → **Monteiro/Monteiros**, distintos de Hunter → **Caçador**.
- Needle → **Agulha**; Thread → **Linha**; Durance → **Cativeiro**; Arcadia → **Arcádia**; Bargain → **Barganha**; Bastion → **Bastião**; Wild Hunt → **Caçada Selvagem**; Keeper → **Carcereiro**.
- Contract → **Contrato**; Goblin Contract → **Contrato Goblin**; Court → **Corte**; Spring/Winter/Summer/Autumn Court → **Corte da Primavera/do Inverno/do Verão/do Outono**.
- Privateer → **Corsário**; Goblin Debt → **Débito Goblin**; Bedlam → **Desvario**; Fetch → **Duplo**; Echoes → **Ecos**; Thorns → **Espinhos**; Dream Roads → **Estradas dos Sonhos**; Wyrd → **Fado**; Hedge Ghosts → **Fantasmas da Sebe**; Faerie → **Feéria**.
- Frailty → **Fragilidade**; Goblin Fruit → **Fruta Goblin**; Glamour, Goblin e Hobgoblin permanecem no original; Icon → **Ícone**; Oath → **Juramento**; Loyalist → **Legalista**; True Loyalist → **Legalista Verdadeiro**; Lord → **Lorde**.
- Clarity → **Lucidez**; Mantle → **Manto**; Mask → **Mascarilha**; Goblin Market → **Mercado Goblin**; Hedge Shaping/Hedgespinning → **Tecer a Sebe**; Oneiromancy → **Oniromancia**; Oneiropomp → **Oniropompo**; Others → **Outros**.
- Token → **Penhor**; Lost → **Perdido**; Portaling → **Passagem**; Promise → **Promessa**; Oathbreaker → **Quebrador de Juramento**; Bridge-Burner → **Queima-Pontes**; Goblin Queen/King → **Rainha/Rei dos Goblins**.
- Regalia permanece **Regalia**; Renegade → **Renunciado**; Hedge → **Sebe**; Sealing → **Selagem**; Dreamweaving → **Tecelagem de Sonhos**; Kenning → **Tino**; Title → **Título**; Fae-Touched → **Tocado por Fae**; Touchstone e trod permanecem no original.
- Darkling/Fairest/Wizened → **Trevoso/Belíssimo/Mirrado**. Não exibir pares de gênero na interface; respeitar concordância da prosa em português.
- Golden Hairnettle → **Erva de Cachinhos Dourados**; IOU → **Nota Promissória**.
- Dauphines of Wayward Children → **Delfinas das Crianças Perdidas**; Sophomore → **Noviça**; Chaperone → **Preceptora**; Dowager → **Matriarca**.
- Catch → **Gatilho**; Loophole → **Brecha**; Rules Lawyer → **Advogado de Regras**.
- Cowed → **Acovardado**; Berserk → **Frenético**; Fatigued → **Fatigado**.
- Primal Urge → **Instinto Primitivo**; Lunacy → **Lunagem**; Wolf-Blooded → **Parente**.
- Nas entidades efêmeras de todas as linhas: Ban → **Proibição**; Bane → **Fraqueza**. Não aplicar automaticamente ao Bane de Clan/Bloodline ou ao papel homônimo de Changeling. A grafia “Poribição” foi corrigida pelo usuário.
- Numina permanece **Numina**. Demais decisões e contextos constam integralmente nos anexos abaixo; divergências históricas como Fighting Finesse, Animal Ken, Rank, Dread Power e nomes de cultos precisam ser conciliadas com a apresentação atual e o contexto, não substituídas por busca textual indiscriminada.

As decisões mecânicas anteriores de Contracts — Waters of Lethe, Enveloping Sands e Whisperwind — permanecem adotadas; esta meta não reabre essa reconstrução. `WerewolfAudit.md` conserva as decisões mecânicas e as pendências adiadas de Werewolf, fora do escopo desta meta.

## Dúvidas novas durante a execução

Nenhuma nova dúvida registrada nesta etapa de criação da meta. Preservar abaixo o contexto e a decisão necessária quando uma dúvida surgir.

## Progresso — prioridade 0, primeiro lote

- O modelo compartilhado passou a preservar `merits[].definitionId`, separado de `instanceId`, na normalização estrutural schema-2. O picker de criação grava o ID; os pickers compartilhados resolvem instâncias pela definição, não pelo nome.
- `lib/merit-identity.ts` mantém o ID explícito como autoridade. Para seleções schema-2 existentes sem ID, só resolve nome canônico/origem quando há uma única definição; não usa traduções nem escolhe arbitrariamente entre homônimos. Definições indisponíveis permanecem preservadas.
- Mortal: criação/edição e ficha resolvem pela identidade; compras de XP gravam definition/instance ID e um descritor semântico. O histórico muda de idioma na exibição, sem reescrever transações antigas: entradas anteriores mostram o delta identificado pelo undo em vez de interpretar o rótulo localizado. Specialties autorais não são traduzidas.
- Estornos novos de Merits em Mortal verificam a instância, a definição e os pontos de XP disponíveis; falhas não concedem XP nem removem histórico. O helper compartilhado recusa um histórico antigo sem identidade quando múltiplas instâncias homônimas impedem uma resolução segura.
- **Prioridade 0 ainda não concluída:** migrar compras/histórico/estornos de Vampire e Mage, completar os consumidores por ID e a integração das concessões/configurações; implementar qualificadores dos homônimos após comparar sua mecânica. Nenhuma nova tradução de catálogo foi iniciada neste lote.
- Verificação deste lote: `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados; suíte completa com **442/442 testes aprovados**. Sem smoke de navegador neste lote.

## Progresso — prioridade 0, segundo lote

- Vampire e Mage: compras e upgrades de Merits passam a registrar `definitionId` e `instanceId`, com estorno dirigido à instância exata. A criação/edição e os nomes/níveis apresentados na ficha resolvem pelo ID explícito; o fallback restrito do primeiro lote continua apenas para seleções existentes sem ID.
- Seus painéis de XP passam a persistir undo canônico e rating final, sem novos labels traduzidos. A apresentação EN/PT resolve Merits, traits, Disciplines, blood sorcery e poderes de Vampire, Arcana e Spells de Mage. A descrição autoral de Specialty e de Acts of Hubris permanece intacta. Detachment guarda o resultado semântico. Históricos antigos são apresentados por seus deltas quando identificáveis, sem alterar o registro, o saldo ou as compras.
- O painel de XP de Mage não reconstrói mais estornos a partir de descrições traduzidas. Vampire não restaura uma ficha inteira de um snapshot antigo para estornar. Entradas opacas ficam preservadas/visíveis e sem estorno; compras de Merits com custo incoerente ou instância ausente não concedem XP. Entradas antigas de Wisdom com custo zero e classificação ambígua também não são estornadas por adivinhação.
- **Prioridade 0 ainda aberta:** compras de Legacy e sua apresentação semântica; detecção histórica de Gnosis em `builder-power-progression.ts`/`lib/power-progression.ts`; consumidores de identidade por nome em configuração, concessões automáticas, elegibilidade e conservação de catálogos desativados; integração restante em Changeling/Werewolf; qualificadores de Conditions/Tilts e de Merits mecanicamente distintos. A suíte dirigida cobre os históricos em EN/PT, a renderização dos painéis, isolamento de catálogos, import/export e estornos. Nenhuma nova tradução de catálogo neste lote.
- Verificação: suíte completa **446/446**; após as últimas guardas contra undo desconhecido e estorno acima dos pontos pagos, suíte dirigida de identidade/persistência **41/41**. `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados no estado final. Sem smoke de navegador neste lote.


## Progresso — prioridade 0, terceiro lote

- Mage: estornos, progressão de Legacy e sua superfície foram movidos para `game-lines/mage/`, sem duplicar os caminhos antigos. `lib/experience-refunds.ts` ficou restrito aos mecanismos neutros de pontos/Merits. O antigo helper misto `lib/power-progression.ts` foi removido; os consumidores utilizam os helpers já existentes das linhas.
- Gnosis: removida a interpretação de compras pelo texto `Gnose N`; a criação/edição reconhece apenas undo semântico de Gnosis, com rating ou valor anterior e quantidade válida. `creation_gnosis` explícito continua autoritativo. Texto histórico opaco permanece preservado e não é convertido em compra por adivinhação.
- Changeling: os seletores especializados dos editores/inventário Homebrew citados em X03 passaram para seu CSS. Estilos compartilhados reutilizados com nomes especializados ainda precisam de neutralização coordenada.
- A fixture de estorno de Entitlement agora registra explicitamente os quatro pontos pagos por XP; um registro sem `experienceDots` não autoriza o estorno de pontos de criação. Os testes de persistência importam estornos neutros e estornos de Mage de suas respectivas fronteiras.
- **Prioridade 0 ainda aberta:** identidade/presentação das compras de Legacy; concessões/configurações e elegibilidade por nomes; integração restante em Changeling/Werewolf; qualificadores de homônimos e ownership descrito em X03. Nenhuma tradução nova de catálogo neste lote.
- Verificação: suíte completa **448/448**; `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. Sem smoke de navegador neste lote; os valores CSS foram preservados, e testes de arquitetura protegem a localização dos seletores exclusivos.

## Progresso — prioridade 0, quarto lote

- Mage: compras de Legacy gravam `definitionId`; Attainments gravam também o rank. Foram removidas as novas descrições persistidas e as cópias integrais da ficha. O undo conserva apenas o estado anterior necessário, a Praxis convertida e os créditos, em cópia independente.
- O histórico apresenta a iniciação no idioma atual e resolve o Legacy/Attainment pelo ID/rank, inclusive Homebrew. Definição indisponível mostra seu ID; não é substituída pelo Legacy atualmente selecionado nem por um homônimo. Os nomes e efeitos dos catálogos de Legacy ainda aguardam a etapa Mage da tradução.
- Um bridge documentado para recibos schema-2 existentes lê somente o ID explicitamente registrado na seleção anterior à iniciação ou no estado anterior ao Attainment, verificando o estado de progressão. Não usa a descrição da compra, não migra o histórico e não inventa identidade para registros opacos.
- Estorno/discard de Legacy usam a mesma função para validar o recibo exato, custo, saldo/recursos creditados e delta. Recusam outro Legacy, Attainments posteriores, restituição duplicada de Praxis e custos/identidades incoerentes. Créditos já gastos/convertidos não são perdoados por clamp: se não estiverem disponíveis, o estorno é recusado. Discard falho é atômico; históricos de outros Legacies e compras não relacionadas são preservados.
- Merits: `activeMeritCatalog` preserva definições desativadas de Homebrew pelos IDs das seleções, não por um conjunto de nomes. O fallback schema-2 permanece restrito a nome canônico/origem inequívocos. Um ID indisponível ou um nome traduzido não ativa um homônimo. Errata continuam vinculadas ao ID canônico original.
- Todos os Builders/painéis de XP foram atualizados para essa fronteira. Changeling/Mage incluem também os Merits existentes comprados só com XP, antes excluídos pelo uso exclusivo das escolhas de criação nessa preservação.
- **Prioridade 0 ainda aberta:** identidade em concessões/configurações e elegibilidade por nomes; integração restante em Changeling/Werewolf; qualificadores de Conditions/Tilts e de Merits mecanicamente distintos; ownership descrito em X03. Nenhuma tradução nova de catálogo neste lote.
- Verificação: suíte dirigida **48/48** e suíte completa **455/455**, incluindo EN/PT, recibos opacos, dependências, falhas atômicas, homônimos desativados e errata. `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. Sem smoke de navegador neste lote.

## Progresso — prioridade 0, organização dos estilos

- Os estilos exclusivos de Changeling saíram do CSS global, inclusive os editores Homebrew, Kith/Court, Regalia, Tokens/Trifles, Entitlement, Clarity, Goblin Debt e os destaques dinâmicos de Kith/seleção de linha.
- As estruturas reutilizadas por Mage/Vampire/Changeling usam nomes neutros em todos os consumidores e overrides, sem copiar estilos nem alterar textos, regras ou dados persistidos. Seletores antigos sem consumidores foram removidos.
- A comparação automatizada com o estado anterior confirmou as mesmas declarações em **2.786 combinações de seletor/media query** preservadas. Novos testes de arquitetura impedem a volta de seletores especializados ao CSS global. A fronteira foi documentada em `AGENTS.md`.
- Esta etapa resolve a parte CSS de X03; a migração dos helpers/tipos de Contracts, do contexto de Merits e da superfície de Entitlement continua pendente. A meta de tradução não está concluída.
- Verificação: suíte dirigida **20/20**, suíte completa **456/456**, `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. Sem smoke de navegador neste lote.

## Progresso — prioridade 0, validações e vínculos de Mage

- As validações especializadas de Sanctum, Demesne, Infamous Mentor, Imbued Ally, Order Archive, Awakened Status, Adamant Hand e Cabal Theme saíram do mecanismo compartilhado e passaram para `game-lines/mage/merits.ts`. Estas e as validações existentes de Faction Member, Prelacy, Profane Tool e Svikiro disparam por ID canônico, não pelo nome.
- Vínculos de Sanctum/Demesne/Infamous Mentor/Imbued Ally/Order Archive verificam IDs de definição e de instância, rejeitando instâncias duplicadas, definições indisponíveis, Homebrew homônimo e pontos insuficientes. O fallback já existente para seleções schema-2 sem ID permanece restrito a nome canônico/origem inequívocos, sem alterar os registros.
- Os seletores de instâncias usam os mesmos IDs e mínimos. O mecanismo compartilhado recebe `meritIds` e `minimumDots`; não contém mais uma exceção por nome para Infamous Mentor. O seletor de Safe Place de Sanctum agora respeita o mínimo já exigido pela validação, em vez de oferecer escolhas que seriam recusadas.
- A elegibilidade de Infamous Mentor foi transferida para Mage e ligada aos seletores de criação/XP e à validação da compra. Faction Member identifica o Awakened Status pertinente pelo ID. Custos, configurações salvas, XP, história e efeitos de catálogo não foram reescritos.
- Mensagens de vínculos transportam IDs e resolvem a apresentação EN/PT no catálogo ativo. Um ID indisponível é exibido como ID, sem procurar um homônimo. A cobertura inclui renderização do seletor e ausência de mutações nos problemas semânticos durante a tradução.
- **Prioridade 0 ainda aberta:** metadados/despacho dos editores e concessões ainda dependentes de nomes, contexto/requisitos específicos em helpers compartilhados, integração restante em Changeling/Werewolf, qualificadores de homônimos e a parte mecânica de X03. Nenhuma tradução nova de catálogo neste lote; a meta permanece ativa.
- Verificação: suíte dirigida Mage **13/13**, suíte completa **459/459**, `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. Sem smoke de navegador neste lote.

## Progresso — prioridade 0, identidade dos editores de configuração

- Metadados de configuração de Core, Changeling, Mage e Vampire ganharam IDs explícitos conciliados com os respectivos catálogos. O editor compartilhado resolve a definição canônica antes de abrir os campos ou invocar o editor da linha. Um ID indisponível não é substituído por nome; seleções antigas sem ID continuam usando somente o fallback inequívoco já documentado.
- Editores estruturados de Professional Training/Cults Core, Tokens/Hedgespun Item/Entitlement/Hollow/Shared Bastion/Stable Trod/Workshop/Warded Dreams de Changeling e Faction Member/Nameless Order/Mystery Cult Influence de Mage disparam por ID. O formulário genérico do Cult é reutilizado por Mage através de sua própria composição, sem incluir IDs de Mage no mecanismo Core.
- O callback de apresentação inline recebe o ID, não o nome; os conjuntos paralelos de nomes foram substituídos pela consulta dos metadados existentes. O comportamento de Multilingual continua com duas linhas por ponto, expresso no metadado `rowsPerDot`, sem exceção por nome no renderizador.
- A supressão do editor de Familiar na criação saiu do picker compartilhado e foi para a composição Mage. A consulta dos pontos de Masque (Style) em criação/XP/ficha é única e usa os IDs de Masque e Style; homônimos ou estilos ambíguos não concedem campos adicionais.
- O despacho especializado de Mage retorna `null` antes de criar um elemento React quando o Merit não lhe pertence. Isso permite que os formulários genéricos e Core continuem aparecendo; anteriormente o elemento do componente especializado interceptava a renderização mesmo quando esse componente não mostrava nada.
- Painéis de XP de Mage/Vampire/Werewolf e escolhas de Totem passam `definitionId` para o editor em seleções novas. As configurações salvas, textos autorais, XP e histórico permanecem inalterados; o ID resolvido de uma seleção antiga é enriquecido somente na cópia usada na renderização.
- **Prioridade 0 ainda aberta:** concessões e valores de benefícios de Cult por nomes, requisitos/contextos específicos nos helpers compartilhados, seleção/apresentação de detalhes de Merits nas fichas, integração restante em Changeling/Werewolf, qualificadores de homônimos e a parte mecânica de X03. Não houve tradução nova de catálogo neste lote; a meta permanece ativa.
- Verificação: testes novos de identidade **5/5**, suíte dirigida **63/63**, suíte completa **464/464**, `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. Sem smoke de navegador neste lote.

## Anexo D — Histórico integral de DictionaryAudit.md

Documento anterior consolidado abaixo; suas tarefas de interface foram concluídas. Pendências de catálogo e propostas com status próprio continuam identificadas no texto histórico.

# Auditoria editorial do dicionário pt-BR

As decisões auditadas foram incorporadas à interface e aos Títulos. Em 30/09/2026, o usuário confirmou que as sugestões então existentes e não alteradas também estão aprovadas. Este arquivo registra as decisões editoriais aceitas; novas propostas posteriores à confirmação ficam separadas na seção final. Nomes de Méritos permanecem como referência para a tradução de seus catálogos, e as pendências de Condições são explicitadas abaixo.

## Termos gerais

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Beat | Ato | Usado também em *Arcane Beat* → **Ato Arcano**. |
| Breaking Point | Ponto de Ruptura | Aplicado em Mortal e Vampire. |
| Catch | Gatilho | Ativa o Penhor mesmo para quem normalmente não teria poder para fazê-lo; distinto de *Loophole* → **Brecha**. |
| Bonded | Vinculado | Nome da Condição; aguarda a tradução integral do catálogo de Condições. |

## Mage

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Hubris | Húbris | |
| Attainment | Aperfeiçoamento | |
| Numina | Numina | Mantido também em português por decisão explícita do usuário. |
| Inured spell | Feitiço Habituado | |
| Enlightened / Understanding / Falling | Iluminado / Consciente / Caído | Patamares do teste de Húbris. |
| Nameless Order | Ordem sem Nome | |
| Mystery Cult Initiation | Iniciação em Culto dos Mistérios | |

**Pendente de outro catálogo:** `Megalomaniacal` e `Rampant` foram mantidos nos resultados de Húbris porque são nomes de Condições e devem acompanhar a tradução integral desse catálogo.

## Vampire

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Covenant | Coalizão | |
| Kindred | Membros | Em prosa corrente, usa-se **vampiro** quando a referência não é ao grupo social. |
| Dirge | Lamento | |
| Pack / Pack Alpha | Matilha / Alfa da Matilha | |
| Lashes of Blood Tether | Açoites do Grilhão de Sangue | |
| Predatory Aspect / Unnatural Aspect | Aspecto Predatório / Aspecto Sobrenatural | |
| Simplified Hollow | Vazio Simplificado | Regra alternativa de *Strange Shades*. |

**Pendente de outro catálogo:** `Bestial`, `Jaded` e `Addiction` foram mantidos onde nomeiam Condições; devem ser uniformizados com a tradução integral desse catálogo. `Deprived` usa **Privado**, conforme a apresentação existente no catálogo Core.

## Changeling

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Crux | Cerne | Categoria de Penhor. |
| Clause | Cláusula | |

## Títulos de Changeling

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Baron of the Lesser Ones | Barão dos Subalternos | |
| Master of Keys | Mestre das Chaves | |
| Thorn Dancer | Dançarino dos Espinhos | Foi adotado o masculino fixo, sem exibir pares de gênero. |
| Sibylline Fisher | Pescador Sibilino | |
| Spiderborn Rider | Cavaleiro da Aranha | |
| BriarNet | BriarNet | Mantido como nome próprio. |
| Cracking Software | Software de Invasão | Nome mecânico citado pelo Programa Pítia; deve acompanhar a futura auditoria dos Méritos. |
| Adjudicator of the Wheel | Árbitros da Roda | |
| The Blackbird Bishop | Bispo Negro | |
| Diviners of Worms | Adivinhos dos Vermes | |
| Duchess of Truth and Loss | Duquesa da Verdade e da Perda | |
| Guildmaster of Goldspinners | Mestre da Guilda dos Fiandeiros de Ouro | **Goldspinners** foi interpretado literalmente como fiandeiros de ouro. |
| Paragon of Story Heroes | Paragão dos Heróis das Histórias | |
| Sacred Band of the Golden Standard | Bando Sagrado do Estandarte Dourado | |
| Golden Bands | Faixas Douradas | Pode se referir tanto a faixas quanto a braçadeiras; o texto mecânico não especifica a forma. |
| Squire of the Broken Bough | Escudeiro do Ramo Partido | |
| Companion of the Resigned | Companheiro dos Resignados | |
| Infinite Popup Book | Livro Pop-up Infinito | |
| Castellan of the Broken Cage | Castelão da Jaula Quebrada | |
| Chrysalid | Crisálida | |
| Knights of the Knowledge of the Tongue | Cavaleiros do Conhecimento do Paladar | |
| Legate of the Black Apple | O Legado da Maçã Negra | |
| Sprite | Fagulha | Ser feérico citado em **Elemento Divino**; convém uniformizar quando esse catálogo for localizado. |
| Margrave of the Brim | Margrave da Orla | |
| Bane | Flagelo | Nome do papel marcial dos Nobres Sábios dos Confins Desconhecidos. |
| Bugbear Mask | Máscara de Bicho-papão | |
| The Tolltaker Knight | O Cavaleiro Cobrador | |

Títulos de livros permanecem no idioma original conforme a política do projeto.

## Textos dinâmicos fora dos dicionários

Os textos de interface e os resumos mecânicos abaixo usam chaves semânticas nos dicionários. As decisões auditadas foram preservadas.

### Configuração de Méritos

Os rótulos de configuração de Core, Changeling, Mage e Vampire foram migrados para `ui.meritConfig.*`, preservando `key`, valores e opções canônicas armazenadas. Opções de Perícias e Atributos são localizadas somente na apresentação; textos livres do jogador não são traduzidos. As formas dos nomes de Méritos abaixo orientam a tradução separada dos catálogos.

| Grupo | Rótulos e traduções |
| --- | --- |
| Comum | `Staff` → Funcionários · `Retainer` → Lacaio · `Safe Place` → Local Seguro · `Striking Looks` → Aparência Impressionante · `Area of Expertise` → Área de Especialização · `Defensive Combat` → Combate Defensivo · `Fighting Finesse` → Finesse de Combate · `Quick Draw` → Saque Rápido · `Unseen Sense` → Sentido Sobrenatural · `Professional Training` → Treinamento Profissional |
| Changeling | `Hedge Duelist` → Duelista da Sebe · `Blood and Bone` → Sangue e Osso · `Eerie Eyes` → Olhos Inquietantes · `Know-It-All` → Sabe-Tudo · `Material Affinity` → Afinidade Material · `Mover and Shaker` → Influente · `Running with the Wolves` → Correndo com os Lobos · `Still Waters Run Deep` → Águas Calmas São Profundas · `Elemental Warrior` → Guerreiro Elemental · `Fae Pet` → Mascote Feérico · `A Taste of Honey` → Um Gosto de Mel · `Rageaholic` → Viciado em Fúria · `Acquired Taste` → Gosto Adquirido · `Favored Phobia` → Fobia Favorita · `Grief Connoisseur` → Conhecedor do Luto · `Strange Favor` → Favor Estranho |
| Mage | `Artifact` → Artefato · `Astral Adept` → Adepto Astral · `Awakened Status` → Status dos Despertos · `Broad Dedication` → Dedicação Ampla · `Cabal Theme` → Tema de Cabala · `Daimonomikon` → Daimonomikon · `Demesne` → Demesne · `Destiny` → Destino · `Enhanced Item` → Item Aprimorado · `Enriched Item` → Item Enriquecido · `Familiar` → Familiar · `Grimoire` → Grimório · `Hallow` → Santuário · `Imbued Ally` → Aliado Imbuído · `Imbued Item` → Item Imbuído · `Infamous Mentor` → Mentor Infame · `Inheritance` → Herança · `Mana Battery` → Bateria de Mana · `Masque` → Máscara · `Order Archive` → Arquivo da Ordem · `Perfected Item` → Item Aperfeiçoado · `Prelacy` → Prelado · `Profane Tool` → Ferramenta Profana · `Shadow Name` → Nome das Sombras · `Shadow Self` → Eu das Sombras · `Sanctum` → Santuário · `Soul Stone` → Pedra da Alma · `Supernal Watcher` → Vigia Superno · `Techné` → Techné |
| Vampire | `Kindred Status` → Status dos Membros · `Haven` → Refúgio · `Herd` → Rebanho · `Retainer (Ghoul)` → Lacaio (Ghoul) · `Practiced Puppeteer` → Titereiro Experiente · `Friends in Low Places` → Amigos em Lugares Baixos · `Hiding Place` → Esconderijo · `Contract with the Uncanny` → Pacto com o Estranho · `The Three Heads of Kerberos` → As Três Cabeças de Cérbero |

### Regras vampíricas exibidas dinamicamente

Os blocos mecânicos de `game-lines/vampire/sheet-view.tsx` foram migrados para chaves com parâmetros. Formas auditadas e aplicadas:

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Strength / Dexterity / Stamina | Força / Destreza / Vigor | Atributos. |
| Blood Potency | Potência de Sangue | |
| Willpower | Força de Vontade | |
| Health | Vitalidade | Nome usado atualmente pela ficha. |
| Daysleep / Embrace | Sono Diurno / Abraço | |
| Lashing Out | Incitar a Fera | |
| Fight / Flight | Lutar / Fugir | Opções de reação à Aura Predatória. |
| Power Attribute | Atributo de Poder | |
| Brawl / grapple / Feed | Briga / agarrão / Alimentar-se | |
| Feeding Grounds | Campo de Caça | |
| Starting Vitae | Vitae Inicial | |
| Coil | Espiral | |
| Kindred senses | Sentidos Vampíricos | Evita a forma pouco natural **Sentidos dos Membros**. |

Os nomes de Condições citados nesses blocos (`Swooning`, `Drained` e outros) devem acompanhar a tradução futura do catálogo de Condições, sem uma segunda tabela paralela.

### Dívida técnica de i18n

Resolvida: os editores e inventários de Homebrew de Core, Changeling, Mage e Vampire usam chaves semânticas. A regra `no-untranslated-ui-text` rejeita o padrão local `h(português, inglês)` e os testes protegem essa restrição.

Os avisos de validação de Méritos também retornam chaves e parâmetros, apresentados pela interface com `t()`. Regras, escolhas e pré-requisitos canônicos não dependem do idioma; textos de pré-requisitos do catálogo seguem o fallback inglês enquanto sua tradução estiver adiada.

As traduções integrais de Méritos e de conteúdo específico de outras linhas ficam para uma etapa posterior, conforme o escopo confirmado pelo usuário. `Numina` permanece `Numina` também em português.

## Decisões complementares aprovadas

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Core (grupo de compras) | Básico | Rótulo de apresentação; o identificador do grupo permanece `core`. |
| Gilded Cage | Gaiola Dourada | Tipo de compra; segue Invocação Dourada. |
| Doom | Sina | Campo de configuração de Destiny; distingue a sina da vantagem Destino. |
| Fettered vessel | Receptáculo vinculado | Campo do Familiar; descreve onde a entidade está vinculada. |
| Utility Attainments | Aperfeiçoamentos Utilitários | Segue a decisão Attainment → Aperfeiçoamento. |
| Raptor | Rapina | Nome do Exarca; pode ser revisto como título próprio. |
| Profane Form: Robe | Manto | Forma da Ferramenta Profana, não o Mérito Manto de Changeling. |
| Dread Power | Poder Sobrenatural | Rótulo do Mascote Feérico; deve acompanhar o catálogo de Poderes Sobrenaturais. |
| Thousand Falling Leaves | Mil Folhas Caindo | Manobra de Duelista da Sebe. |
| Once Bitten, Twice Shy | Gato Escaldado | Adaptação do provérbio, sem restringir a manobra a felinos. |
| Shadowplay | Jogo de Sombras | Manobra de Duelista da Sebe. |
| Treacherous Ground | Solo Traiçoeiro | Manobra de Duelista da Sebe. |
| Unblemished Poise | Compostura Imaculada | Nome da manobra; não corresponde ao Atributo Compostura. |
| The Crashing Oak | A Queda do Carvalho | Nome da manobra que melhora o Ataque Total. |
| Spite is Strength | Despeito é Força | Manobra de Duelista da Sebe. |
| Hob Alarm | Alarme Hob | Melhoria de Vão; segue Parentesco Hob para Hob Kin. |
| Luxury Goods | Artigos de Luxo | Melhoria de Vão. |
| Shadow Garden | Jardim de Sombras | Melhoria de Vão. |
| Phantom Phone Booth | Cabine Telefônica Fantasma | Melhoria de Vão. |
| Route Zero | Rota Zero | Nome próprio da melhoria; trod permanece trod. |
| Size Matters | Tamanho Importa | Melhorias de Vão de um e dois pontos. |
| Escape Route | Rota de Fuga | Melhorias de Vão de um e dois pontos. |
| Hidden Entry / Easy Access / Home Turf | Entrada Oculta / Acesso Fácil / Território Próprio | Melhorias de Vão. |
| Buttressed Dreaming | Sonhar Fortificado | Melhoria de Bastião Compartilhado. |
| Fixed Doorway | Passagem Fixa | Melhoria de Bastião Compartilhado. |
| Gate of Horn | Portal de Chifre | Portal entre Vão e Bastião. |
| Guardian Eidolon | Eidolon Guardião | Melhoria de Bastião Compartilhado. |
| Illusory Armory / Permanent Armory | Arsenal Ilusório / Arsenal Permanente | Melhorias de Bastião Compartilhado. |
| Raised Defenses / Subtle Speech | Defesas Reforçadas / Fala Sutil | Melhorias de Bastião Compartilhado. |
| Prop | Adereço | Objeto da cena de sonho; há distinção entre importante e não importante. |
| Manyleague | Muitas Léguas | Habilidade de Montaria Feérica. |
| Chatterbox / Actormask | Tagarela / Mascarilhado | Habilidades de Montaria Feérica. |
| Armorshell / Burdenback | Blindagem / Carregador | Habilidades de Montaria Feérica. |
| Dreamspun / Thornbeast / Hedgefoot | Onírico / Fera dos Espinhos / Pé-de-Sebe | Habilidades de Montaria Feérica. |

## Novas propostas posteriores à auditoria — Numina do Familiar

Os nomes abaixo localizam os seletores da interface de Mage. As escolhas armazenadas continuam em inglês e os efeitos não foram alterados. São propostas novas, não abrangidas pela confirmação anterior.

| Inglês | Proposta aplicada | Observação |
| --- | --- | --- |
| Awe | Fascínio | Evoca fascínio e reverência; nome de um Numen, não uma nova tradução de Disciplina. |
| Blast | Rajada |  |
| Dement | Enlouquecer |  |
| Drain | Drenar |  |
| Emotional Aura | Aura Emocional |  |
| Entropic Decay | Decadência Entrópica |  |
| Firestarter | Incendiário |  |
| Hallucination | Alucinação |  |
| Implant Mission | Implantar Missão |  |
| Left-Handed Spanner | Chave Canhota | Proposta literal para o nome; pode ser revista editorialmente. |
| Mortal Mask | Mascarilha Mortal | Segue Mask → Mascarilha do léxico. |
| Pathfinder | Desbravador |  |
| Regenerate | Regenerar |  |
| Seek | Buscar |  |
| Speed | Velocidade | Nome de um Numen; distingue-se do traço Speed → Deslocamento. |
| Sign | Sinal |  |
| Stalwart | Inabalável |  |
| Telekinesis | Telecinese |  |

## Anexo R — Histórico integral de MeritsBR.md

Recuperado da versão rastreada para preservar as decisões antes de aceitar a remoção já feita pelo usuário. A cobertura Core/Changeling está concluída; observações mecânicas são registros para trabalho separado, não autorização para mudar regras durante esta tradução.

# Auditoria da tradução de Méritos

Lote inicial: 18 Méritos de Chronicles of Darkness, nove de Changeling the Lost, Biblioteca Avançada de Mage the Awakening e 15 Méritos compartilhados dos suplementos homebrew Agony & Ecstasy e Fire & Revolution. Os títulos dos livros, IDs, pontuações, requisitos canônicos e regras não foram alterados. As traduções apresentam o texto existente no catálogo; não são uma reconstrução dos livros.

## Decisões editoriais aprovadas

O usuário aprovou os demais itens deste lote e corrigiu Rules Lawyer para **Advogado de Regras**. As observações mecânicas abaixo permanecem registradas para trabalho separado; a aprovação editorial não altera as regras.

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Barfly | Habitué | Preserva a ideia de frequentador que consegue circular em ambientes sociais. |
| Area of Expertise | Área de Especialização | Designa a área da Especialização que recebe o bônus aumentado. |
| Brownie's Boon | Dádiva do Brownie | Brownie foi mantido como nome da criatura folclórica. |
| Defensive Dreamscaping | Moldagem Onírica Defensiva | Diferenciado de Dreamweaving/Tecelagem de Sonhos. |
| Carousing | Farra | Estilo Social voltado a festas. |
| Roughing It | Vida ao Relento | Vivência em condições precárias ao ar livre. |
| The Fix Is In | Jogo Marcado | Manipulação antecipada do resultado de uma eleição. |
| Electioneer | Cabalista Eleitoral | “Cabalista” no sentido de angariador de votos, não de praticante de magia. |
| Turnabout | Virada de Mesa | Reversão de vantagem retórica. |
| Ratfucker | Sabotador Político | Preserva o sentido político; não reproduz a vulgaridade do nome inglês. |
| You'll Be First Against the Wall | Você Será o Primeiro no Paredão | Mantém a ameaça revolucionária. Não usa pares de gênero na interface. |
| Rules Lawyer | Advogado de Regras | Exploração da redação literal e de procedimentos. |

## Observações do catálogo, sem mudança mecânica neste lote

- Core, p. 44: `Area of Expertise` também exige uma Especialização no livro; o requisito canônico do catálogo contém somente Resolve ••. A tradução preserva esse requisito existente, sem corrigir a regra incidentalmente.
- Core, pp. 60–61: os resumos das manobras de `Armed Defense` omitem detalhes presentes no livro, especialmente os limites de Weak Spot, o dano por sucessos extras e a declaração no início do turno de Aggressive Defense, a aplicação do bônus em Dodge e a redução a zero dos sucessos de ataque para Press the Advantage. A tradução preserva os resumos; uma reconstrução mecânica é um trabalho separado.
- Mage, p. 105: `Advanced Library` exige Local Seguro com pontuação igual no texto do livro; o catálogo usa “≤ Safe Place”. A tradução preserva a desigualdade canônica existente, sem ampliar ou restringir a elegibilidade.
- Os 15 Méritos de origem Vampire aqui traduzidos estão classificados como Core e homebrew no catálogo. Seus efeitos e requisitos descritivos foram traduzidos como cadastrados; não foram apresentados como regras oficiais nem acrescidos de manobras ausentes.

## Continuação

Cobertura atual: 202/202 registros Core e 154/154 Changeling. Todos os Méritos Core, todos os 53 Méritos de fontes oficiais de Changeling, os 39 de Book of Courts e os 62 de Book of Seemings estão traduzidos. Todas as manobras e os benefícios por nível cadastrados foram incluídos. Os 16 registros de origem Mage/Vampire classificados como compartilhados no catálogo atual já possuem apresentação pt-BR. Méritos exclusivos de Mage ou Vampire não receberam acesso a Changelings por causa da tradução.

## Novas escolhas para auditoria — livro básico Changeling

As escolhas abaixo ainda não fazem parte da aprovação do lote inicial. Nomes de manobras e benefícios já existentes na interface foram reaproveitados quando disponíveis; não foram criados pares de gênero.

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Dreamweaver | Tecelão de Sonhos | Derivado de Tecelagem de Sonhos. |
| Dull Beacon | Farol Apagado | A atração causada pela revelação do Semblante Feérico é reduzida, não eliminada. |
| Fair Harvest | Colheita Seletiva | Privilegia a seleção de um sabor emocional de Glamour. |
| Firebrand | Incendiário | Incitador de confrontos, não necessariamente alguém que provoca incêndios. |
| Gentrified Bearing | Porte Aristocrático | Aparência de pertencer aos Feés Verdadeiros. |
| Goblin Bounty | Abundância Goblin | Reserva recorrente de Frutas Goblin e objetos peculiares. |
| oddments | objetos goblin peculiares | Distinguidos das Frutas Goblin e dos Penhores. |
| Grounded | Centrado | Proteção da Lucidez, não imobilização física. |
| Manymask | Múltiplas Mascarilhas | Mudanças sucessivas da Mascarilha. |
| Noblesse Oblige | Nobreza Obriga | Preserva o sentido de obrigação decorrente da liderança. |
| Limerick | Limerique | Forma poética; não equivale a qualquer poema de cinco versos. |
| Antaean Endurance | Resistência de Anteu | Mantém a referência mitológica. |
| Stable Trod | trod Estável | Mantém trod em minúsculas conforme o léxico. |

Fontes deste lote inspecionadas visualmente: Changeling the Lost pp. 113–120 e 225. As seis manobras alternativas de primeiro ponto de Duelista da Sebe reaproveitam as traduções já auditadas na interface.

Observações mecânicas adicionais, sem correção incidental:

- `Glamour Fasting` e `Market Sense`: os resumos canônicos usam “session”, enquanto as passagens do livro usam “chapter”. As traduções mantêm “sessão”, para não alterar a periodicidade cadastrada.
- `Hedgespun Item`: o registro canônico resume os benefícios e não contém as desvantagens descritas no livro. A tradução mantém o registro atual; não reconstrói conteúdo mecânico ausente.

## Novas escolhas para auditoria — suplementos oficiais Changeling

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Frightful Incantation | Encantamento Aterrador | A magia se alimenta do medo associado ao Manto. |
| Hedge Sorcerer / Hedge Sorcery | Feiticeiro da Sebe / Feitiçaria da Sebe | Distingue a prática ritual de simplesmente Tecer a Sebe. |
| hecatombs | hecatombes | Sacrifícios rituais: podem ser componentes físicos ou ações, não apenas mortes. |
| Hedgewise | Conhecedor da Sebe | Afinidade com a detecção de passagens e com Tecer a Sebe. |
| Oath: Blood Liege | Juramento: Suserano de Sangue | Serviço a um vampiro específico. |
| Understudy | Substituto de Cena | Papel teatral de quem assume o lugar de outro intérprete. |
| Calming Eidolons | Eidolons Calmantes | Mantém eidolon como nome da entidade onírica. |
| Motley Awareness | Percepção do Retalho | Percepção dos demais membros, não consciência coletiva literal. |

Fontes inspecionadas visualmente: The Hedge pp. 66–69, 115 e 118–119; Oak, Ash, and Thorn p. 33; Kith and Kin p. 69; Dark Eras 2 pp. 75–76 e 107. Os resumos cadastrados foram preservados, sem incluir regras ausentes.

## Novas escolhas para auditoria — segundo lote Core

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Citywalker | Andarilho Urbano | Deslocamento entre cidades por correspondências ocultas. |
| Crack Driver | Motorista Exímio | Distingue-se do Estilo Stunt Driver. |
| Double Jointed | Hiperflexibilidade | Característica de mobilidade articular, não articulações adicionais. |
| Fighting Finesse | Refinamento de Combate | Uso de Destreza no lugar de Força. |
| Fixer | Facilitador | Intermediário de serviços. |
| Fleet of Foot | Pés Ligeiros | Deslocamento e fuga a pé. |
| Greyhound | Galgo | Mantém a metáfora de um perseguidor veloz. |
| Hobbyist Clique | Grupo de Entusiastas | Comunidade dedicada a um passatempo. |
| bane / Rank | Flagelo / Posto | Terminologia de entidades efêmeras em Arsenal Esotérico; conferir na futura tradução das regras dessas entidades. |

Fontes inspecionadas visualmente neste lote: Chronicles of Darkness pp. 45, 48, 51, 56–57, 61, 139 e 236; pp. 44 e 47 já haviam sido inspecionadas no lote inicial. Os requisitos “Somente mortais” foram preservados; traduzir um Mérito Core não o torna acessível a Changelings.

Observações mecânicas adicionais, sem correção incidental:

- `Citywalker`, p. 236: o resumo canônico coloca oito horas de sono antes do teste. No livro, dormir oito horas remove a restrição a novas tentativas após uma falha; não é uma exigência para cada uso. A tradução mantém o resumo cadastrado.
- `Cheap Shot`, p. 61: o resumo não contém a penalidade cumulativa de −2 para novos usos na mesma cena. Não foi acrescentada na tradução.
- `Choke Hold`, p. 61: o resumo omite o limiar de sucessos maior que o dobro do Vigor e a duração de (6 − Vigor) minutos. Não foram acrescentados na tradução.
- `Fighting Finesse` e `Interdisciplinary Specialty`: os livros exigem Especializações apropriadas; os requisitos canônicos resumidos não as incluem. A tradução mantém os requisitos existentes.

## Novas escolhas para auditoria — conclusão do livro básico Core

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Investigative Aide | Talento Investigativo | Aptidão própria do personagem, não um ajudante externo. |
| Mind of a Madman | Mente de um Louco | Mantém o nome do livro; diz respeito a adotar a perspectiva de um criminoso. |
| Pusher / soft leverage | Tentador / influência branda | Tentação e suborno usados em Manobras Sociais. |
| Seizing the Edge / Edge | Tomando a Dianteira / Vantagem | Vantagem mecânica em perseguições. |
| Shiv | Estoque | Arma pequena e ocultável, não estoque de mercadorias. |
| Spin Doctor | Manipulador de Narrativas | Reinterpretação de evidências e histórias. |
| Tainted Clues / Incomplete Clues | Pistas Corrompidas / Pistas Incompletas | Categorias mecânicas de pistas. |
| Sympathetic | Empático | Facilita criar vínculos, não apenas ser agradável. |
| Table Turner | Virando o Jogo | Distingue-se de Virada de Mesa, de Fire & Revolution. |
| Takes One to Know One | Um Reconhece o Outro | Reconhecimento de um Vício compartilhado. |
| Taste | Gosto Refinado | Apreciação de obras; não se restringe ao paladar. |
| Close Quarters Combat | Combate em Espaços Restritos | Usa o ambiente e a curta distância. |
| Fast-Talking | Lábia | Persuasão enganosa por conversa. |
| Mystery Cult Influence / Initiation | Influência em Culto de Mistério / Iniciação em Culto de Mistério | Mantém registros separados e seus respectivos benefícios. |
| Mastermind | Mentor Intelectual | Nome do quinto nível dos registros de culto; não concede o Mérito Mentor por si só. |
| Traceur | Traceur | Termo específico do praticante de Parkour mantido em Traceur Experiente. |
| Stunt Driver | Motorista de Manobras | Distingue-se de Motorista Exímio. |

Fontes inspecionadas visualmente neste lote: Chronicles of Darkness pp. 46, 49–50, 52–55, 58–60 e 62–66. As pp. 45, 48, 51, 56–57 e 61 já haviam sido inspecionadas nos lotes anteriores. A apresentação de Treinamento Profissional reutiliza **Perícia de Ativo**, já adotado na interface.

Observações mecânicas adicionais, sem correção incidental:

- `Mystery Cult Influence`: o catálogo atribui o registro ao Core p. 51, mas as pp. 51–53 inspecionadas apresentam `Mystery Cult Initiation`, não um Mérito separado com esse nome. A origem exata do registro requer auditoria; sua identidade, referência e benefícios existentes não foram alterados.
- `Iron Will`: o requisito canônico é Resolve ••••; o livro p. 51 apresenta Resolve •••. A tradução mantém Perseverança ••••.
- `Resources`, `Mentor` e `Status`: os resumos usam “session”, enquanto os trechos correspondentes do livro usam “chapter”. A apresentação mantém “sessão”.
- `Professional Training`: o resumo de Continuing Education coloca a escolha das duas Perícias de Ativo no segundo nível; no livro p. 46, elas são escolhidas ao adquirir o Mérito. A tradução mantém a estrutura cadastrada.
- Os estilos de combate mantêm os resumos existentes, inclusive seus limites de detalhamento. Por exemplo, `Like a Book` não explicita no resumo que metade de Briga é arredondada para baixo, e `Breaking Point` não explicita a proporção de Estrutura sacrificada. Esses detalhes não foram acrescentados incidentalmente.

## Novas escolhas para auditoria — suplementos Core

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Disabling Tactics | Táticas Incapacitantes | Captura e incapacitação; não se limita a causar dano. |
| Animal Ken | Trato com Animais | Reutiliza a forma extensa já presente nas Condições traduzidas. |
| Apportation | Aportação | Teleporte de objetos e, com cinco pontos, seres vivos; revisar o termo pouco usual. |
| Assertive Implement | Instrumento Assertivo | Arma com objetivos e vontade próprios. |
| Boot Party | Festival de Chutes | Ataques contra alguém caído. |
| Camera Obscura | Câmara Escura | Nome traduzido; o efeito pode usar câmeras modernas. |
| Doppelganger | Sósia | Diferenciado de Fetch/Duplo. |
| Hardened Exorcist | Exorcista Experiente | Resistência adquirida contra ameaças de entidades efêmeras. |
| Loaded for Bear | Armado até os Dentes | Expressão idiomática associada a munição de reserva. |
| Object Fetishism | Fetichismo por Objetos | Obsessão por uma posse, não criação de um objeto mágico. |
| Punch Drunk | Grogue | Mantém a metáfora de resistir apesar dos golpes; não concede Atordoado. |
| Scarred | Marcado por Cicatrizes | Marca persistente de um trauma. |
| Sojourner | Peregrino | Viagem por Aportação, sem pressupor religião. |
| Claimed / Possessed / Urged / Open / Controlled | Reivindicado / Possuído / Instigado / Aberto / Controlado | Condições relacionadas a entidades efêmeras; uniformizar na futura tradução integral desse grupo. |
| God-Machine / Twilight | Deus-Máquina / Crepúsculo | Terminologia geral sobrenatural adotada neste lote. |

Fontes inspecionadas visualmente: Dark Eras pp. 247–248; Dark Eras 2 p. 377; Changeling the Lost p. 123; Hurt Locker pp. 41–43, 53–55, 72–78 e 143. Pistoleiro mantém os níveis descontínuos 1, 3 e 5. Sonhador Lúcido mantém o requisito de não ser changeling.

Observações mecânicas adicionais, sem correção incidental:

- `Bless Amulet`, Hurt Locker pp. 72–73: o livro descreve um dia por sucesso, uma semana com dois pontos e proteção permanente com três. O resumo canônico usa um dia com dois pontos e uma semana com três; a tradução preserva o resumo.
- `Ground Fighter`, Hurt Locker p. 54: o livro exige Brawl •••; o catálogo exige Brawl ••. A tradução mantém Briga ••.
- `Punch Drunk`, Hurt Locker p. 43: o livro exige Willpower •••••• ou mais; o resumo canônico tem somente seis pontos, sem o sinal de mínimo. A tradução preserva o requisito cadastrado.
- `Object Fetishism`: o resumo usa “session”, enquanto o livro p. 42 usa “chapter”. A tradução mantém “sessão”.
- `Curse Effigy`: o catálogo apresenta a parada letal como Intelligence + Medicine − Stamina + Supernatural Tolerance, sem agrupar a resistência. A tradução mantém essa forma; o agrupamento e a elegibilidade requerem auditoria mecânica separada.
- Os resumos gerais e sobrenaturais de Hurt Locker omitem vários limiares, durações, limites e desvantagens presentes no livro. Foi traduzido todo o conteúdo cadastrado, sem reconstruir campos mecânicos ausentes.

## Novas escolhas para auditoria — estilos de Hurt Locker

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Avoidance | Evasão | Evitar confronto ou transferir a atenção dos atacantes. |
| Berserker | Guerreiro Furioso | Distingue o Estilo da Condição Berserk/Frenético e da Complicação Insano. |
| Bowmanship / Combat Archery | Tiro com Arco / Tiro com Arco em Combate | Mantém os dois Estilos distintos. |
| Fated Ferocity | Ferocidade Predestinada | Oposição à sina associada ao Mérito Amaldiçoado. |
| K-9 | K-9 | Mantém a designação de trabalho com cães. |
| Kino Mutai / Systema | Kino Mutai / Systema | Nomes próprios das artes marciais mantidos. |
| Powered Projectile | Projétil Propulsionado | Abrange armas não movidas por pólvora, incluindo bestas e zarabatanas. |
| Staff Fighting | Combate com Bastão | Distingue o nome da arma de Funcionários, outro sentido de staff. |
| Strength Performance | Demonstração de Força | Feitos e exibições de força. |
| Handling | Manobrabilidade | Característica de veículos. |
| Impaled | Empalado | Complicação citada em Armas de Arremesso; ainda não possui registro próprio no catálogo atual de Complicações. |

Fontes inspecionadas visualmente para os estilos: Hurt Locker pp. 46–56, 73–74 e 76–77. Todos os 76 registros Core atribuídos a Hurt Locker foram traduzidos, sem inventar manobras adicionais.

Observações mecânicas adicionais, sem correção incidental:

- `Vaulting Defense`, Hurt Locker p. 52: tanto o resumo quanto o trecho impresso usam “Melee”, que não corresponde ao nome de uma Perícia Core de CofD. A tradução usa “Combate Corpo a Corpo”; não foi substituído mecanicamente por Armas Brancas sem uma correção explícita de regra.
- `Mounted Combat`, Hurt Locker p. 51: o livro apresenta Animal Ken ••, enquanto o catálogo exige Animal Ken •••. A tradução mantém Trato com Animais •••.
- `Bowmanship` e `Falconry` continuam sem detalhes que não estejam nos resumos canônicos, como certos limiares, limites e modificadores. Não foram reconstruídos por meio da tradução.

O recorte considera o acesso padrão do catálogo, sem autorizações especiais do Narrador: Mage the Awakening p. 99 exige Desperto por padrão e permite exceções específicas por decisão do Narrador; Vampire the Requiem p. 109 apresenta os Méritos de Membros separadamente dos Méritos para mortais e carniçais. Essas exceções não foram presumidas nem transformadas em elegibilidade geral.

Fontes oficiais inspecionadas visualmente neste lote: Chronicles of Darkness pp. 44, 47, 49–50 e 60–61; Changeling the Lost pp. 111–112; Mage the Awakening pp. 99 e 105; Vampire the Requiem p. 109. Para os suplementos homebrew, foi preservado o catálogo aprovado do projeto.

## Novas escolhas para auditoria — Book of Courts (homebrew)

Foram traduzidos os 39 registros e as nove manobras cadastradas, a partir do texto inglês existente no projeto. Este lote não reconstrói regras de PDFs nem apresenta o suplemento como fonte oficial.

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Bedside Manner | Cuidado com o Paciente | Acolhimento e cuidado que aceleram a recuperação. |
| Friends in Low Places | Amigos da Baixa Sociedade | Mantém a referência a grupos de má reputação. |
| Spring-Loaded | Primavera a Todo Vapor | Adaptação do trocadilho entre primavera e mola; o efeito diz respeito à intoxicação. |
| Host with the Most | Anfitrião de Primeira | Expressão idiomática para um anfitrião excepcional. |
| Seen Some Shit | Já Vi de Tudo | Adapta a experiência com cenas horríveis, sem reproduzir o palavrão. |
| Can't Spook a Spooker | Não se Assusta Quem Assusta | Mantém a inversão de quem provoca medo. |
| GTFO | Dê o Fora | Adapta a ordem de fugir, sem reproduzir o palavrão do acrônimo. |
| Grief Connoisseur | Conhecedor do Luto | Especialista em uma forma de tristeza, sem restringir o efeito a mortes. |
| Misery Loves Company | A Desgraça Quer Companhia | Mantém o sentido proverbial. |
| Frightened | Amedrontado | Condição citada sem apresentação portuguesa própria no catálogo atual; uniformizar quando esse grupo for traduzido. |

Observações mecânicas para uma auditoria separada:

- `Get the Manager`, `Can't Spook a Spooker`, `GTFO`, `Shivers` e `Snow Cover` repetem um requisito de Manto depois da alternativa de Boa Vontade da Corte. A tradução preserva a redação cadastrada, sem presumir que Boa Vontade dispensa esse segundo requisito.
- As alternativas de acesso a estes Méritos homebrew não foram substituídas pelos limiares de acesso a Contratos de Corte; são requisitos de itens diferentes.
- `Acquired Taste` mantém a aquisição separada por tipo sobrenatural no texto. A tradução não altera o modelo de instâncias nem acrescenta configuração mecânica.

## Novas escolhas para auditoria — Book of Seemings (homebrew)

Foram traduzidos os 62 registros, seus requisitos alternativos e as cinco manobras de Meat Shield a partir do texto inglês cadastrado. O conteúdo homebrew continua distinto das regras oficiais e do texto criado pelo jogador.

| Termo | Tradução adotada | Observação |
| --- | --- | --- |
| Debaucher / Total Abandon | Devasso / Entrega Total | Entrega aos vícios e abandono de cautela, respectivamente. |
| Green Grocer | Quitandeiro | Frutas Goblin conservadas fora da Sebe. |
| Mirror Me | Meu Reflexo | O reflexo age por conta própria. |
| Puzzler / Riddle Me This | Decifrador / Decifre Esta | Mantém distintos o Mérito de resolver enigmas e o de confundir por jogos de palavras. |
| Resting Birch Face | Cara Fechada de Bétula | Adaptação do trocadilho com uma expressão facial intimidadora e a árvore. |
| Confessional Countenance | Rosto Confessional | A aparência convida outras pessoas a revelarem informações. |
| Multimask | Mascarilhas Ampliadas | Nome distinto de Manymask/Múltiplas Mascarilhas, que este Mérito aprimora. |
| Tickets to the Gun Show | Ingresso para o Show de Músculos | Gun refere-se metaforicamente aos músculos, não a armas de fogo. |
| Gnarled | Nodoso | Mantém a imagem de madeira retorcida e idade avançada. |
| Iron Toes | Dedos de Ferro | Dedos dos pés; o nome não concede contato inofensivo com ferro. |
| Token Crucible | Cadinho de Penhores | Instalação de criação no Vão. |
| Scour the Mask | Desgastar a Mascarilha | Processo citado no resumo de Mascote Fae; termo para uniformização futura. |
| Dread Power | Poder Temível | Forma já presente no dicionário Changeling e uniformizada também no editor de Mascote Fae. |
| Paranoid / Confused | Paranoico / Confuso | Condições citadas; Confuso já aparece nas Frátrias, e Paranoico requer uniformização quando tiver apresentação própria. |

Observações mecânicas para uma auditoria separada:

- `Hidden Life` apresenta Manto e Boa Vontade da Corte junto de Status no seu efeito de custo; a tradução preserva essa comparação do homebrew, sem unificar mecanicamente esses Méritos.
- `Meat Shield: Remember Me?` não explicita a parada de resistência do atacante no resumo cadastrado. Ela não foi inventada na tradução.
- `Material Affinity` mantém Ação Avançada, termo já usado nas Frátrias e nos Contratos; não foi substituído por qualidade de rotina.
- Os requisitos alternativos de Feição foram traduzidos nos dois campos existentes. Não houve mudança no cálculo de elegibilidade nem na quantidade de instâncias.

## Integração da apresentação

Criação/edição, compra por Experiência, ficha e impressão Changeling usam os textos de apresentação por ID. As categorias dos Méritos Core e Changeling foram movidas para os dicionários e compartilhadas pelas duas telas de compra e pelo editor homebrew, sem alterar as categorias armazenadas. Graduações no catálogo de criação são exibidas como pontos gráficos, preservando valores descontínuos. O editor homebrew usa rótulos traduzidos para referências a Méritos, mas continua salvando seus nomes canônicos e preservando o conteúdo escrito pelo jogador.

As regras sem níveis agora também exibem a descrição e os requisitos ao expandir a ficha. Na impressão detalhada, a descrição geral de um Estilo não é mais omitida quando suas manobras aparecem.
