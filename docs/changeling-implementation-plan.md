# Plano auditável de implementação — Changeling: The Lost 2e

Status: **plano de referência consolidado e comparado ao repositório em 14 de setembro de 2026; nenhuma alteração de implementação autorizada por este documento**
Fonte primária: *Changeling: The Lost Second Edition*, arquivo local `E:\Downloads\2ed - Changeling the Lost.pdf`
Escopo editorial: personagens changeling jogáveis criados somente com o livro básico
Escopo da comparação: estado observado em `E:\Projetos\changeling_mage`, inclusive alterações locais ainda não consolidadas em commit

> Este documento foi escrito primeiro como se Changeling ainda não existisse na aplicação. A seção 17 compara esse estado-alvo com a implementação encontrada no repositório. Os números de página citados são os números impressos no livro, não a posição da página no arquivo PDF.

## 1. Objetivo

Adicionar `CtL` como uma game line de *Characters of the Darkness*, preservando a regra arquitetural do projeto:

> Core fornece mecanismos. Cada game line fornece suas mecânicas.

A primeira entrega deve permitir:

- criar e salvar um changeling válido do livro básico;
- consultar e atualizar sua ficha em desktop e mobile;
- controlar Clarity, Glamour, Goblin Debt, Health, Willpower e Conditions;
- consultar Seeming, Kith, Court, Mantle, Contracts e demais regras do personagem;
- comprar características com Experience e desfazer exatamente uma compra;
- registrar Pledges e itens feéricos sem tentar resolver cenas automaticamente;
- imprimir uma ficha A4 pelo navegador, usando a ficha oficial apenas como referência funcional;
- carregar somente módulos e catálogos de Changeling quando `CtL` estiver ativo;
- alternar idioma sem mudar IDs, escolhas, custos ou dados persistidos.

Este plano não autoriza alterações de código. Uma implementação nova só começaria após aprovação explícita das decisões da seção 14.

## 2. Limites da primeira implementação

### Incluído

- as seis Seemings básicas;
- as doze Kiths apresentadas no livro básico, sem tornar Kith obrigatória;
- Courtless, as quatro Seasonal Courts padrão e os quinze exemplos de Courts alternativas do livro;
- Needle, Thread, Touchstones, Icons, Clarity, Wyrd e Glamour;
- os 110 Contracts do livro: 60 Arcadian, 40 Court e 10 Goblin;
- os 39 Changeling Merits do livro e os Merits mortais compatíveis do Core;
- Mantle, Court Goodwill, Hollow, Fae Mount, Token e outras configurações especiais do básico;
- Pledges: sealings, oaths e bargains, como registros estruturados editáveis;
- Goblin Debt e sua transição para `Hedge Denizen`;
- referências necessárias para Mask, mien, portaling, Bedlam, Hedge e oneiromancy;
- Conditions do Core e as Conditions de Changeling do livro básico;
- os exemplos de tokens, exceptional goblin fruits e oddments do livro;
- criação, ficha, progressão com Experience, normalização, sincronização e impressão no navegador.

### Excluído da primeira implementação

- Kiths, Contracts, Merits, Courts, Entitlements e Conditions de suplementos;
- *Book of Courts*, *Book of Seemings* e qualquer outro conteúdo classificado como homebrew;
- criação de fae-touched, fetches, hobgoblins, Huntsmen, True Fae e antagonistas;
- resolução automática de rolagens, combate, harvesting, Bedlam, Hedgespinning ou oneiromancy;
- um simulador de viagem pela Hedge ou de arquitetura de sonhos;
- gerenciamento de fontes/homebrew dentro da aplicação;
- geração de PDF no servidor;
- tradução inventada quando não houver texto em português revisado.

Os elementos excluídos não devem criar campos opcionais em Core nem impedir a adição futura de catálogos suplementares por grupos próprios.

## 3. Regras confirmadas no livro

### 3.1 Criação de personagem

Fonte principal: pp. 89–95.

1. Definir conceito e três Aspirations.
2. Priorizar Attributes e distribuir 5/4/3 pontos, além do ponto gratuito de cada Attribute.
3. Priorizar Skills e distribuir 11/7/4 pontos.
4. Escolher três Skill Specialties.
5. Escolher uma Seeming.
6. Adicionar um ponto a um Attribute da categoria favorecida pela Seeming, sem ultrapassar 5 na criação.
7. Escolher uma segunda Regalia favorecida, diferente daquela concedida pela Seeming.
8. Escolher uma Kith, se desejado. Kith é opcional.
9. Descrever Mask e fae mien.
10. Escolher uma Court, se desejado. Um membro de Court recebe Mantle 1 gratuitamente; um personagem pode ser Courtless.
11. Escolher Needle e Thread.
12. Definir o Touchstone inicial e ligá-lo à caixa de Clarity correspondente a `Composure + 1`.
13. Escolher quatro Common Contracts, dos quais ao menos dois pertencem às Regalias favorecidas.
14. Escolher dois Royal Contracts permitidos pela Court ou pelas Regalias favorecidas.
15. Começar com Wyrd 1. Cada ponto adicional até Wyrd 3 custa cinco dos dez pontos iniciais de Merit.
16. Distribuir os pontos restantes entre Merits.
17. Calcular Advantages e iniciar Glamour no máximo permitido por Wyrd.

Validações do Builder devem explicar cada erro separadamente. Nenhuma escolha inválida deve ser corrigida silenciosamente ou convertida em outro conteúdo.

### 3.2 Advantages e valores derivados

Fontes principais: pp. 89–95 e 98–107.

| Característica | Regra proposta |
| --- | --- |
| Size | 5 |
| Willpower | Resolve + Composure, descontados pontos permanentes perdidos |
| Health | Size + Stamina |
| Defense | menor entre Dexterity e Wits + Athletics |
| Initiative | Dexterity + Composure; Beast recebe o bônus determinístico de sua blessing quando aplicável |
| Speed | Size + Strength + Dexterity; Beast recebe o bônus determinístico de sua blessing quando aplicável |
| Clarity máxima inicial | Wits + Composure |
| Clarity máxima posterior | Wits + Composure + Icons recuperados |
| Wyrd inicial | 1, podendo chegar a 3 com pontos de Merit na criação |
| Glamour | máximo e gasto por turno definidos pela tabela de Wyrd |

Os valores-base permanecem persistidos como traços do personagem. Bônus derivados não sobrescrevem permanentemente os pontos de Attribute ou Skill.

### 3.3 Seemings

Fontes principais: pp. 49–51 e 89–91.

| Seeming | Categoria de Attribute | Regalia | Blessing resumida | Gatilho da curse |
| --- | --- | --- | --- | --- |
| Beast | Resistance | Steed | +3 Initiative e Speed e dano letal desarmado; medo pode exigir Glamour | agir sem pensar causa dano ou complicações significativas a outra pessoa |
| Darkling | Finesse | Mirror | gastar Willpower para tocar e integrar-se ao insubstancial por três turnos; ser observado também custa Glamour | informação importante ou segredo conhecido revela-se falso |
| Elemental | Resistance | Sword | agir através do elemento escolhido a até três jardas; com pouca Willpower, cada ação custa Glamour | ser coagido ou forçado a agir contra a vontade |
| Fairest | Power | Crown | gastar Willpower em benefício de outra pessoa; conflito com o alvo pode exigir Glamour | ação ou omissão causa diretamente infortúnio aos aliados |
| Ogre | Power | Shield | ao causar dano, pode impor `Beaten Down` por três turnos; agir em causa própria pode exigir Glamour | alguém que não é inimigo foge ou se encolhe de medo |
| Wizened | Finesse | Jewels | transformar materiais por `Build Equipment`; improvisação custa Glamour | uma surpresa desagradável o pega desprevenido |

Quando uma curse exige um teste de Clarity, a parada é metade de Wyrd, arredondada para cima. A aplicação do dano continua manual: a ficha apresenta o gatilho e permite marcar o resultado.

### 3.4 Kiths

Fontes principais: pp. 51–55.

O livro básico apresenta doze Kiths:

- Artist;
- Bright One;
- Chatelaine;
- Gristlegrinder;
- Helldiver;
- Hunterheart;
- Leechfinger;
- Mirrorskin;
- Nightsinger;
- Notary;
- Playmate;
- Snowskin.

Cada definição deve preservar ID, nome canônico, Skill relacionada, blessing completa, escolha persistível quando houver, fonte e página. O limiar de exceptional success em três sucessos é apresentado como regra contextual; a aplicação depende da rolagem feita pela mesa.

Kith não é obrigatória. A ausência deve ser representada por `null`, e não por um rótulo fictício. Conteúdo personalizado fica fora da primeira entrega.

### 3.5 Courts, Mantle e Court Goodwill

Fontes principais: pp. 55–66 e 108–112.

As quatro Courts sazonais padrão são:

| Court | Emoção |
| --- | --- |
| Spring | desire |
| Summer | wrath |
| Autumn | fear |
| Winter | sorrow |

O livro também traz quinze Courts alternativas utilizáveis: três Dragon Courts, quatro Seasonal Courts of the Lag, quatro Tide Courts e quatro Trader Courts. Portanto, o catálogo estritamente básico contém 19 definições de Court, não apenas as quatro sazonais padrão.

Regras de modelagem:

- Court é opcional;
- selecionar uma Court concede Mantle 1, identificado pela Court canônica;
- Mantle não aparece como uma compra arbitrária duplicada;
- Court Goodwill é configurado por Court canônica e não pela tradução exibida;
- benefícios de Mantle são armazenados em sua graduação impressa e mostrados somente quando desbloqueados;
- acesso a Court Contracts depende de Mantle ou Court Goodwill;
- ao mudar de Court, metade do Mantle antigo, arredondada para baixo, torna-se Goodwill na Court antiga, e metade do Goodwill da nova Court torna-se Mantle nela;
- pontos efetivamente perdidos seguem Sanctity of Merits;
- a troca deve ser uma ação explícita, confirmada e registrada, nunca efeito colateral de editar um texto.

### 3.6 Needle, Thread, Touchstones e Icons

Fontes principais: pp. 91–92 e 98–107.

O livro básico contém 14 exemplos de Needle:

- Bon Vivant, Chess Master, Commander, Composer, Counselor, Daredevil e Dynamo;
- Protector, Provider, Scholar, Storyteller, Teacher, Traditionalist e Visionary.

Ele contém dez exemplos de Thread:

- Acceptance, Anger, Family, Friendship, Hate;
- Honor, Joy, Love, Memory e Revenge.

Cada opção mantém separadamente o gatilho que recupera um ponto de Willpower e o gatilho que recupera toda a Willpower. Needle e Thread são identidades mecânicas próprias, não aliases persistidos de Virtue e Vice.

Touchstones devem ser registros estruturados, com ID, nome, caixa de Clarity ligada e notas opcionais. O Touchstone inicial ocupa `Composure + 1`. Merits podem acrescentar Touchstones sem transformar a estrutura em uma lista de strings sem ligação com a trilha.

Icons recuperados são registros explícitos. Cada Icon aumenta permanentemente a Clarity máxima em um e restaura toda a Willpower quando recuperado. Não existe uma compra genérica de “Clarity permanente” desacoplada de um Icon.

### 3.7 Clarity

Fontes principais: pp. 98–107.

Clarity é uma trilha de dano, não uma característica escalar comprada com Experience.

- Clarity máxima inicial é `Wits + Composure`;
- cada Icon recuperado acrescenta uma caixa permanente;
- dano é `mild` ou `severe` e deve ser ordenado e limitado ao tamanho da trilha;
- Clarity atual é o número de caixas sem dano;
- as três caixas mais à direita podem gerar Clarity Conditions quando sofrem dano;
- chegar a zero pode impor `Comatose`;
- Touchstones modificam dano e recuperação conforme sua ligação;
- cura, Conditions e consequências são aplicadas pela mesa, mas a ficha precisa mostrar a referência e persistir o dano exato.

A UI deve distinguir claramente máxima, atual e dano. Alterar Attributes ou recuperar Icons recalcula somente a capacidade da trilha e preserva o dano que ainda cabe nela.

### 3.8 Wyrd, Glamour e frailties

Fontes principais: pp. 93–95.

| Wyrd | Máximo de Attribute/Skill | Glamour máxima / por turno | Frailties adicionais | Redução de fadiga/doença | Frutas carregadas |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 5 | 10 / 1 | nenhuma | 1 | 3 |
| 2 | 5 | 11 / 2 | uma minor | 1 | 7 |
| 3 | 5 | 12 / 3 | uma minor | 1 | 7 |
| 4 | 5 | 13 / 4 | duas minor | 2 | 13 |
| 5 | 5 | 15 / 5 | duas minor | 2 | 13 |
| 6 | 6 | 20 / 6 | uma major e duas minor | 2 | 13 |
| 7 | 7 | 25 / 7 | uma major e duas minor | 3 | 29 |
| 8 | 8 | 30 / 8 | uma major e três minor | 3 | 29 |
| 9 | 9 | 50 / 10 | uma major e três minor | 3 | 101 |
| 10 | 10 | 75 / 15 | duas major e três minor | 4 | ilimitadas |

Cold iron é a vulnerabilidade feérica permanente e não substitui as frailties adquiridas por Wyrd. Frailties adicionais precisam persistir `severity: "minor" | "major"`; apenas contar campos de texto não permite validar a progressão da tabela.

Glamour atual pertence a `current_state`. Wyrd, suas frailties e seus limites permanentes pertencem a `line_data` ou são derivados dela.

### 3.9 Mask, mien, portaling e Bedlam

Fontes principais: pp. 92–107 e 198–208.

- Mask e fae mien recebem descrições próprias e persistentes;
- a ficha mostra quando Mask pode cair, ser fortalecida ou ser percebida, sem executar Clash of Wills;
- portaling recebe uma referência contextual às ações e custos, sem simulador de viagem;
- Bedlam aparece com gatilhos, parada e consequências relevantes, mas o usuário registra manualmente o resultado;
- liberar Bedlam involuntariamente é uma fonte de Beat de Changeling;
- kenning e outras percepções feéricas são referências, não botões de rolagem.

### 3.10 Contracts

Fontes principais: pp. 120–165.

O catálogo básico contém:

| Família | Quantidade |
| --- | ---: |
| Arcadian — seis Regalias, cinco Common e cinco Royal em cada | 60 |
| Court — quatro Courts, cinco Common e cinco Royal em cada | 40 |
| Goblin | 10 |
| **Total** | **110** |

Cada Contract deve manter, conforme sua forma impressa:

- ID estável, nome canônico, tipo, Regalia ou Court, fonte e página;
- summary, cost, dice pool, action e duration;
- `Effect` para Contracts automáticos;
- `Success`, `Exceptional Success`, `Failure` e `Dramatic Failure` somente quando existe rolagem de invocação;
- options genuínas, detail tables e exceções;
- Loophole como campo próprio;
- os dois Seeming Benefits de um Arcadian Contract;
- Goblin Debt para Goblin Contracts.

Não se deve duplicar `Effect` ou outcomes em `Options`. Custos usam `●` para Glamour e `○` para Willpower.

Na criação, são quatro Common e dois Royal; ao menos dois Common precisam ser favorecidos. Depois da criação:

- Common Contract custa 2 Experience se favorecido e 3 se não favorecido;
- Royal Contract custa 3 Experience se favorecido e 4 se não favorecido;
- Goblin Contract custa 2 Experience;
- um Seeming Benefit adicional custa 1 Experience;
- Common Court Contract exige Mantle 1 ou Court Goodwill 2;
- Royal Court Contract exige Mantle 3 ou Court Goodwill 5;
- qualquer changeling pode aprender um Common de cada Seasonal Court;
- Court Goodwill 4 permite aprender um Royal daquela Court;
- o acesso e o custo são validações separadas.

### 3.11 Goblin Debt

Fonte principal: pp. 162–165 e Conditions do livro.

- a trilha normal vai de 0 a 9;
- receber o décimo ponto transforma o personagem e concede `Hedge Denizen`;
- a UI não aceita overflow silencioso;
- a transição deve ser uma ação explícita e registrada, com a Condition e o novo estado visíveis;
- remover dívida não apaga automaticamente a Condition sem satisfazer sua resolução.

### 3.12 Pledges

Fontes principais: pp. 209–215.

O livro distingue:

- sealings;
- oaths, incluindo formas societal, personal e hostile;
- bargains.

A primeira implementação não precisa ser um motor de cláusulas. Ela deve armazenar registros manuais estruturados com tipo, participantes, termos, duração, boons, sanctions, status e notas. Um único campo `string[]` chamado `oaths` perde as diferenças mecânicas e não representa sealings ou bargains.

### 3.13 Hedge e oneiromancy

Fontes principais: pp. 198–222.

A ficha precisa oferecer somente o estado que pertence ao personagem e referências úteis:

- Gates e portaling;
- trods e Hollow quando adquiridos por Merit;
- Hedgespinning e seus usos;
- Bastion, dreamweaving e Dream Health quando algum efeito do personagem os exige;
- Conditions e Tilts relacionados.

Não haverá mapa da Hedge, iniciativa de sonho, resolução de paradigms ou execução automática de oneiromancy. Merits como Hollow, Warded Dreams e Defensive Dreamscaping mantêm suas configurações específicas no módulo Changeling.

### 3.14 Merits, itens feéricos e Conditions

Fontes principais: Merits nas pp. 111–120, itens nas pp. 220–235 e Conditions nas pp. 333–346.

- O catálogo básico contém 39 Changeling Merits.
- Merits mortais compatíveis vêm do grupo Core.
- Mantle é concedido pela Court e não duplica uma compra arbitrária.
- Court Goodwill, Hollow, Fae Mount, Hedgespun Item, Token, Touchstone e outros casos especiais recebem configuração line-owned.
- Ratings descontínuas, repetição, grants e refunds seguem as invariantes do projeto.
- Token é uma estrutura agregada: um ponto pode representar o conjunto permitido pela regra e não uma instância repetível inferida pelo nome.
- Os quinze sample tokens, seis exceptional goblin fruits e três oddments do livro recebem IDs e citações próprias.
- Itens personalizados podem ser registrados manualmente somente quando a regra exigir, sem fingir que são entradas oficiais.
- O catálogo line-owned contém as 20 Conditions de `Changeling the Lost`; as 34 Conditions comuns permanecem no catálogo Core.
- Conditions iguais às do Core são unificadas por ID canônico.

## 4. Modelo persistido proposto

O schema externo continua sendo `schema_version = 2`. Core conhece apenas o envelope neutro e não interpreta os campos abaixo.

### `line_data` de Changeling

```text
seeming_id
favored_attribute
second_regalia_id
kith: null | { definition_id, choice? }
appearance: {
  mask,
  mien
}
court_id | null
needle: { definition_id, custom? }
thread: { definition_id, custom? }
aspirations: string[3]
touchstones: [{ id, name, clarity_slot, notes? }]
icons: [{ id, name, recovered_at?, notes? }]
wyrd
frailties: [{ id, severity: "minor" | "major", description }]
starting_contract_ids
learned_contract_ids
extra_contract_benefits: [{ contract_id, seeming_id }]
pledges: [{
  id,
  kind: "sealing" | "oath" | "bargain",
  subtype?,
  parties,
  terms,
  duration?,
  boons?,
  sanctions?,
  status,
  notes?
}]
fae_items: [{
  id,
  kind: "token" | "trifle" | "bauble" | "goblin_fruit" | "oddment",
  definition_id | "custom",
  name?,
  quantity?,
  notes?
}]
```

### `current_state` de Changeling

```text
glamour_current
clarity_damage: ("mild" | "severe")[]
goblin_debt
willpower_current
willpower_lost_dots
health_damage
experience_beats
experience_available
experience_spent
experience_history
conditions
bedlam_notes?
notes
```

Princípios:

- IDs canônicos, nunca rótulos traduzidos, controlam regras.
- Catálogos são a autoridade para texto oficial; a ficha persiste identidade e escolhas, não cópias mutáveis do verbete inteiro.
- Texto do jogador é preservado e não traduzido automaticamente.
- O histórico de Experience registra o alvo exato, valor anterior, valor novo, custo, grants e dados suficientes para refund.
- Normalização limita ratings e recursos sem inventar Seeming, Kith, Court, Contract ou configuração.
- Reduzir Wyrd não apaga traits legalmente adquiridos sem uma regra explícita; apenas recalcula limites de novas compras.
- Valores armazenados de outra game line nunca são interpretados como Changeling.

## 5. Catálogos e arquivos de dados

Estrutura proposta para a primeira entrega:

```text
public/data/changeling/
  reference/
    seemings.json
    kiths.json
    courts.json
    anchors.json
    wyrd.json
    conditions.json
  contracts/
    index.json
    ctl-core.json
  merits/
    index.json
    ctl-core.json
  items/
    tokens.json
    goblin-fruits.json
    oddments.json
```

Contagens mínimas auditáveis:

| Catálogo | Livro básico |
| --- | ---: |
| Seemings | 6 |
| Kiths | 12 |
| Courts | 19 |
| Needles | 14 |
| Threads | 10 |
| Contracts | 110 |
| Changeling Merits | 39 |
| Changeling Conditions | 20 |
| Sample tokens | 15 |
| Exceptional goblin fruits | 6 |
| Oddments | 3 |

Cada registro oficial terá, conforme o tipo:

- ID estável e inglês canônico;
- nome original e apresentação portuguesa revisada opcional;
- source ID, título original do livro e página impressa;
- rating, custo, requisitos e acesso estruturados;
- texto dividido nos campos mecânicos reais;
- escolhas persistíveis identificadas explicitamente;
- tags somente para busca e apresentação.

Grupos lazy propostos:

- `changeling-reference`: Seemings, Kiths, Courts, anchors, Wyrd e referências;
- `changeling-merits`: Merits e extensões de elegibilidade/configuração;
- `changeling-contracts`: índice e shard do livro básico;
- `changeling-items`: tokens, fruits e oddments;
- Conditions comuns continuam em `core-reference`; Conditions próprias ficam em `changeling-reference` ou grupo line-owned equivalente.

Antes da integração à UI, cada lote deve ser confrontado visualmente com o PDF. Extração de duas colunas, cabeçalhos, rodapés, sidebars e quebras de página não pode ser importada sem revisão.

## 6. Arquitetura e colocação do código

### 6.1 Módulo aditivo

```text
game-lines/changeling/
  registration.ts
  rules.ts
  creation-rules.ts
  builder.tsx
  builder-view.tsx
  builder-eligibility.ts
  builder-power-progression.ts
  builder-merit-grants.ts
  builder-merit-configurations.ts
  builder-merit-editor.tsx
  sheet.tsx
  sheet-view.tsx
  sheet-merit-configurations.ts
  experience-panel.tsx
  experience-shared.tsx
  print.tsx
  print-sheet.tsx
  catalogs/
    reference.ts
    merits.ts
    contracts.ts
    items.ts
```

### 6.2 Limites de responsabilidade

- Core fornece o envelope persistido, Attributes, Skills, Specialties, dano comum, Experience genérica, Merits genéricos e shells.
- Changeling possui Seeming, Kith, Court, Mantle, Needle, Thread, Wyrd, Clarity, Contracts, Regalia, Pledges, Entitlements futuros e regras especiais de Merit.
- `rules.ts` implementa normalização, derivados e sincronização puros, sem React, navegador ou I/O de catálogo.
- A registration mantém loaders independentes para rules, Builder, Sheet, print e grupos de catálogo.
- O registry pode conhecer a registration leve, mas não importa implementações pesadas avidamente.
- Catálogos são snapshots imutáveis e específicos da superfície.
- UI específica, inclusive Entitlements futuros, fica sob `game-lines/changeling/**`, não dentro de uma área neutra de `app/workspace/**`.
- Não deve existir um arquivo compartilhado com regras concretas de Changeling e Mage.
- Wyrd não usa uma abstração mecânica universal de “power rating” apenas porque outra linha também possui uma característica de 1 a 10.

### 6.3 Alterações centrais mínimas esperadas

Se `CtL` ainda não existisse, a integração deveria exigir apenas:

- adicionar `CtL` à pequena lista de IDs persistidos;
- registrar metadata e loaders lazy;
- registrar os grupos de catálogo line-owned;
- incluir a opção na seleção de game line e seu tema visual;
- adicionar testes de isolamento, persistência e manifest.

Não se cria Builder universal, Sheet universal, engine universal de poderes ou switch mecânico espalhado pelo Core.

## 7. Fluxo do Builder

O shell comum continua responsável por identidade, Attributes, Skills, Specialties, Aspirations e mecanismo genérico de Merits. A etapa Changeling é organizada assim:

1. **Lost identity**: Seeming, Attribute favorecido e segunda Regalia.
2. **Kith and appearance**: Kith opcional, escolha interna quando houver, Mask e mien.
3. **Self**: Needle e Thread com gatilhos de recuperação visíveis.
4. **Society**: Court opcional, Mantle 1 automático e resumo dos benefícios.
5. **Clarity**: Touchstone inicial e caixa ligada a `Composure + 1`.
6. **Wyrd**: Wyrd 1–3 e impacto sobre o orçamento dos dez pontos de Merit.
7. **Contracts**: quatro Common, dois Royal, afinidades e acesso.
8. **Merits**: orçamento restante, pré-requisitos e configurações line-owned.
9. **Review**: derivados, grants e erros acionáveis.

Validações bloqueantes:

- orçamento 5/4/3 e 11/7/4 correto;
- três Specialties e três Aspirations;
- Seeming, Attribute favorecido e segunda Regalia válidos;
- Kith ausente ou válida, nunca obrigatória;
- Needle e Thread válidos;
- Touchstone inicial preenchido e ligado ao slot correto;
- Court ausente ou válida; Mantle coerente;
- Wyrd 1–3 e custo de cinco pontos de Merit por aumento;
- exatamente quatro Common e dois Royal Contracts;
- ao menos dois Common pertencentes às Regalias favorecidas;
- Royal e Court Contracts com acesso válido;
- soma de Merits e Wyrd adicional igual ao orçamento de dez pontos;
- derivados, frailties e recursos iniciais coerentes.

## 8. Organização proposta da ficha

### Summary

- nome, conceito, Seeming, Kith, Court, Needle, Thread e Wyrd;
- Aspirations e Experience;
- Health, Willpower, Glamour e Clarity resumidos;
- Conditions ativas.

### Traits

- Attributes, Skills e Specialties;
- Merits e suas configurações;
- Advantages derivadas;
- Mask e mien.

### Clarity and Wyrd

- trilha de Clarity com mild/severe damage;
- Touchstones ligados visualmente às caixas;
- Icons recuperados;
- Wyrd, Glamour máxima/atual, gasto por turno e limite de traits;
- cold iron e frailties minor/major;
- referências de Seeming curse, Bedlam e kenning.

### Contracts

- Contracts possuídos por Regalia/Court e tipo;
- custo, roll/effect, outcomes, Loophole e benefícios aplicáveis;
- Seeming Benefits adicionais comprados;
- Goblin Debt e estado `Hedge Denizen`.

### Society and pledges

- Court, Mantle e Court Goodwill;
- benefícios desbloqueados por graduação;
- sealings, oaths e bargains estruturados;
- Hollow e trods quando adquiridos.

### Fae items and companions

- Token agregado e seus itens;
- goblin fruits e oddments;
- Fae Mount e demais companions originados por Merit;
- referências relevantes de Mask/mien e uso, sem execução automática.

### Combat

- Defense, Initiative, Speed, Health e armor;
- armas, equipamentos e veículos compartilhados;
- bônus determinísticos da Beast;
- Conditions e Tilts.

### Notes

- notas gerais;
- eventos da Hedge, sonhos e promessas que não exigem estrutura própria.

No mobile, o mesmo conteúdo é distribuído em tabs tocáveis sem remover ações ou provocar overflow horizontal.

## 9. Impressão no navegador

O PDF-fonte contém a ficha oficial nas duas páginas finais de material de jogo. Ela confirma espaço funcional para:

- identity, Needle, Thread, Seeming, Kith e Court;
- Attributes, Skills, Specialties, Merits e Advantages;
- Wyrd, Glamour, Clarity, Touchstones e frailties;
- Contracts, Pledges e Goblin Debt;
- Mantle, Hollow, Token e Fae Mount.

A composição A4 da aplicação pode reorganizar esses blocos para legibilidade e paginação, sem copiar a identidade editorial. A superfície de impressão deve:

- ser carregada lazy pela registration de Changeling;
- usar snapshots de catálogo próprios de print;
- manter blocos indivisíveis quando possível e medir paginação real;
- respeitar pt-BR/en-US;
- não criar dependência de Node ou geração server-side;
- não obrigar Mage ou outra linha a implementar impressão.

## 10. Progressão com Experience

Fonte principal: p. 94.

| Compra | Custo |
| --- | ---: |
| Attribute | 4 Experience por ponto |
| Skill | 2 Experience por ponto |
| Merit | 1 Experience por ponto |
| Specialty | 1 Experience |
| Common Contract favorecido | 2 Experience |
| Common Contract não favorecido | 3 Experience |
| Royal Contract favorecido | 3 Experience |
| Royal Contract não favorecido | 4 Experience |
| Goblin Contract | 2 Experience |
| Seeming Benefit adicional | 1 Experience |
| Wyrd | 5 Experience por ponto |
| ponto perdido de Willpower | 1 Experience |

Cinco Beats convertem em uma Experience por ação explícita.

Fontes de Beat exibidas pela ficha:

- cumprir uma Aspiration;
- resolver uma Condition ou atender seu gatilho de Beat;
- aceitar uma dramatic failure;
- render-se em combate;
- sofrer dano nas caixas finais de Health;
- encerrar uma sessão;
- sofrer dano de Clarity;
- liberar Bedlam involuntariamente.

Toda compra deve validar acesso e custo separadamente, mostrar preview, confirmar valor anterior/novo e registrar um undo exato. Court Contracts, benefícios adicionais, Mantle gratuito e instâncias repetíveis exigem alvos estáveis.

## 11. Normalização, sincronização e derivados

O módulo `changeling/rules.ts` deve ser puro e separar:

- **normalize**: corrigir forma estrutural, aliases e limites sem inventar escolhas;
- **validateCreation**: relatar campos, acessos e orçamentos inválidos;
- **deriveCharacterState**: calcular Advantages, Clarity máxima, limites de Wyrd e bônus determinísticos;
- **synchronizeCharacter**: reconciliar grants, Mantle, Court Goodwill, Conditions derivadas e configurações de Merit.

Casos obrigatórios:

- Courtless não possui Mantle concedido;
- mudar de Court executa a conversão de Mantle/Goodwill e Sanctity of Merits;
- Touchstones permanecem ligados a caixas válidas quando Clarity máxima muda;
- recuperar ou remover um Icon altera Clarity máxima e preserva dano que ainda cabe;
- frailties distinguem minor e major em todos os níveis de Wyrd;
- reduzir Wyrd não apaga traits existentes, mas restringe novas compras;
- aumentar Wyrd recalcula Glamour, gasto por turno, limite de traits, frutas e frailties;
- chegar a Goblin Debt 10 não deixa o personagem num estado 10/10 sem tratar `Hedge Denizen`;
- Contracts comprados permanecem identificáveis se o idioma mudar;
- grants de Merit não apagam compras legítimas nem duplicam instâncias;
- derived persistido não diverge do valor calculado pela ficha e pela impressão.

## 12. Fases de execução e pontos de auditoria

### Fase 0 — Auditoria de regras e escopo

- aprovar as decisões da seção 14;
- confirmar livro básico como única fonte da primeira entrega;
- confirmar ausência de automação de rolagens e cenas;
- aguardar autorização explícita.

Saída auditável: revisão deste documento.

### Fase 1 — Habilitação arquitetural

- adicionar ID, registration e loaders lazy;
- criar grupos de catálogo vazios com contratos de compilação;
- proteger direção de dependências e isolamento no manifest.

Critério de aceite: ativar outra linha não carrega JavaScript ou JSON de Changeling; ativar Changeling não carrega outra linha.

### Fase 2 — Reconstrução dos catálogos

- transcrever Seemings, Kiths, Courts, Needle/Thread e tabela de Wyrd;
- transcrever Merits e Conditions;
- transcrever Contracts em lotes por Regalia/Court/Goblin;
- transcrever tokens, fruits e oddments;
- reconciliar contagem, IDs, páginas, custos, campos e exceções contra páginas renderizadas.

Critério de aceite: nenhum lote chega à UI antes de passar por auditoria editorial e testes estruturais.

### Fase 3 — Regras e persistência

- implementar tipos internos, normalização, validação, derivados e sincronização;
- cobrir Clarity, Touchstones, Icons, Wyrd, frailties, Court/Mantle/Goodwill e Goblin Debt;
- testar round-trip do schema 2.

Critério de aceite: fixtures sem React cobrem limites e transições mecânicas.

### Fase 4 — Builder

- montar a etapa Changeling no shell comum;
- implementar os nove blocos da seção 7;
- verificar Kith opcional, Touchstone obrigatório e composição de Contracts;
- testar desktop/mobile e pt-BR/en-US.

Critério de aceite: criar Courtless, cada Seeming, cada Kith opcional e exemplos das 19 Courts sem salvar estado inválido.

### Fase 5 — Ficha em uso

- implementar tracks, tabs, referências e ações explícitas;
- integrar Conditions, Pledges, itens e companions;
- manter cálculos determinísticos e consequências narrativas separadas.

Critério de aceite: todos os estados persistem entre sessões e nenhuma tab perde funcionalidade no mobile.

### Fase 6 — Experience

- implementar custos, acesso, compra, conversão de Beats e undo;
- cobrir Contract, benefício de outra Seeming, Wyrd, Merit e Willpower;
- testar Mantle gratuito e refunds exatos.

Critério de aceite: matriz automatizada cobre cada tipo de compra e bloqueio.

### Fase 7 — Impressão e QA

- criar print lazy line-owned;
- conferir paginação A4 e idiomas;
- executar os quality gates do projeto;
- auditar manifest, import closures, requests de catálogo, export/import e PWA.

Comandos:

```text
npm run lint
npm run build
node --test --test-concurrency=1 tests/*.test.mjs
npx tsc --noEmit
git diff --check
```

## 13. Critérios de conclusão da primeira implementação

- `CtL` é uma game line registrada e lazy, não um conjunto de branches em Core.
- Um personagem do livro básico pode ser criado com Kith opcional e todos os demais requisitos válidos.
- Os 110 Contracts, 39 Merits, 20 Conditions, 19 Courts, 12 Kiths e seis Seemings do escopo estão auditados.
- Clarity, Touchstones e Icons usam uma estrutura coerente e não um bônus anônimo.
- Wyrd controla corretamente recursos, limites e frailties minor/major.
- Court, Mantle, Court Goodwill e mudança de Court seguem as regras impressas.
- Pledges distinguem sealing, oath e bargain.
- Goblin Debt 10 trata `Hedge Denizen` explicitamente.
- Experience, acesso e refunds são exatos e rastreáveis.
- Export/import do schema 2 preserva escolhas, dano, itens e histórico.
- Outra game line não carrega módulos ou dados de Changeling.
- Desktop, mobile, impressão e ambos os idiomas funcionam.
- Nenhum suplemento ou homebrew aparece como conteúdo básico ativo.

## 14. Decisões propostas para auditoria

1. **Livro básico como único escopo inicial**

   Proposta: supplements e homebrew entram somente depois, por fontes identificáveis e opt-in. Eles não ficam misturados ao catálogo básico por padrão.

2. **Kith opcional**

   Proposta: respeitar o texto do livro. O Builder aceita `null` e não inventa “Kithless” como definição oficial.

3. **Todas as Courts do livro básico**

   Proposta: incluir as 19 definições impressas, mas destacar as quatro Seasonal Courts padrão. As quinze alternativas continuam oficiais do básico, não homebrew.

4. **Profundidade de automação — cancelada**

   Proposta: a aplicação apresenta regras, calcula somente derivados determinísticos e persiste resultados informados pelo usuário. Não executa rolagens, Bedlam, Hedge ou sonhos.

5. **Pledges estruturados, sem rules engine**

   Proposta: distinguir sealing, oath e bargain e persistir seus termos; validações narrativas permanecem com a mesa.

6. **Icons explícitos**

   Proposta: todo aumento permanente de Clarity por essa regra referencia um Icon. Não oferecer um botão genérico de ganho gratuito de Clarity.

7. **Goblin Debt 10**

   Proposta: exigir confirmação da transição e registrar `Hedge Denizen`, sem remover a Condition automaticamente quando a dívida diminuir.

8. **Impressão**

   Proposta: incluir impressão A4 browser-owned porque o PDF possui uma referência oficial e a superfície pode permanecer lazy e exclusiva de Changeling.

9. **Tema visual**

   Proposta: criar identidade inspirada em espinhos, ornamentos e contraste do livro, sem copiar a composição editorial.

## 15. Observação sobre a referência visual

O arquivo consultado possui 362 páginas de PDF. As páginas 360 e 361 do arquivo contêm a ficha oficial em duas páginas. Ela é uma referência adequada para cobertura funcional, mas não uma autorização para copiar arte, tipografia ou composição.

O plano usa essa ficha para confirmar a presença de Contracts, Pledges, Goblin Debt, Fae Mount, Mantle, Hollow e Token, e usa as páginas de regras como autoridade para comportamento mecânico.

## 16. Gate de autorização

Este documento não inicia implementação. Em um projeto sem Changeling, o fluxo seria:

1. revisar o plano e as decisões da seção 14;
2. registrar ajustes editoriais;
3. autorizar explicitamente a Fase 1.

No repositório atual, qualquer trabalho de alinhamento deve começar pela matriz de diferenças abaixo, não pela reimplementação indiscriminada do que já funciona.

---

## 17. Comparação com a implementação atual

### 17.1 Método e legenda

A comparação foi feita por inspeção estática dos módulos, catálogos e testes atuais. Nenhum arquivo de código ou dado foi alterado. Também foi executado:

```text
node --test --test-concurrency=1 tests/game-line-architecture.test.mjs
```

Resultado observado: **24 testes aprovados, 0 falhas**.

Legenda:

- **Alinhado**: atende ao estado-alvo do plano no aspecto examinado.
- **Parcial**: existe, mas faltam regras, estrutura ou validação.
- **Ausente**: não foi encontrada implementação funcional própria.
- **Além do escopo**: existe conteúdo ou superfície que o plano básico não incluiria.
- **Desvio**: o comportamento encontrado contradiz uma regra ou limite do plano.

Esta é uma fotografia do working tree em 14 de setembro de 2026; não afirma que todas as alterações locais estejam commitadas ou publicadas.

### 17.2 Inventário quantitativo

| Área | Alvo do livro básico | Encontrado | Avaliação |
| --- | ---: | ---: | --- |
| Seemings | 6 | 7: seis básicas + `Grimm` de *Book of Seemings* | **Além do escopo** |
| Kiths | 12 | 85: 12 do básico, 61 de suplementos oficiais e 12 de *Book of Seemings* | **Além do escopo** |
| Courts | 19 | 35: 19 do básico, 2 de *Dark Eras 2* e 14 de *Book of Courts* | **Além do escopo** |
| Needles | 14 | 34: 14 básicas + 20 homebrew | **Além do escopo** |
| Threads | 10 | 30: 10 básicas + 20 homebrew | **Além do escopo** |
| Contracts | 110 | 260: 110 básicos, 70 de suplementos oficiais e 80 homebrew | **Além do escopo** |
| Changeling Merits | 39 | 154: 39 atribuídos somente ao básico, 13 de suplementos oficiais, 101 homebrew e 1 registro híbrido/addendum | **Além do escopo** |
| Changeling Conditions | 20 | 32: 20 básicas e 12 adicionais | **Além do escopo** |
| Entitlements | 0 no básico | 27: 6 de suplementos oficiais e 21 homebrew | **Além do escopo** |
| Sample tokens catalogados | 15 | 0 em catálogo estático próprio | **Ausente** |
| Exceptional goblin fruits catalogados | 6 | 0 em catálogo estático próprio | **Ausente** |
| Oddments catalogados | 3 | 0 em catálogo estático próprio | **Ausente** |

Evidências principais:

- `public/data/changeling/contracts/index.json` e seus seis shards;
- `public/data/changeling/kiths.json`;
- `public/data/changeling/courts.json`;
- `public/data/core/merits/changeling.json`;
- `public/data/changeling/conditions.json`;
- `public/data/changeling/entitlements.json`;
- `game-lines/changeling/creation-rules.ts`.

O problema não é a existência de conteúdo adicional. O desvio é ele estar consolidado nos grupos ativos de Changeling sem uma fronteira de fonte que produza uma experiência “livro básico apenas”. `game-lines/changeling/catalogs/contracts.ts` lê todos os shards referenciados pelo índice, e `game-lines/changeling/catalogs/reference.ts` carrega Courts, Kiths e Entitlements consolidados.

### 17.3 Arquitetura e persistência

| Item | Estado atual | Avaliação e diferença |
| --- | --- | --- |
| Registration leve e lazy | `registration.ts` possui loaders independentes de rules, Builder, Sheet e print | **Alinhado** |
| Catálogos por superfície | Builder, Sheet e print declaram grupos próprios | **Alinhado** |
| Isolamento entre game lines | testes arquiteturais e loaders protegem CtL/MtA | **Alinhado** no escopo testado |
| Schema externo | `schema_version = 2` e `line_data: Record<string, unknown>` | **Alinhado** |
| Normalização line-owned | `rules.ts` normaliza somente `frailties` e sincroniza grants | **Parcial**; faltam shape completa, limites, IDs, tracks e derivados |
| Derivados | Builder e Experience recalculam subconjuntos; Sheet aplica alguns ajustes em runtime | **Parcial**; não existe uma única função line-owned usada por load, Builder, Sheet e print |
| Ownership | existem regras CtL em `lib/creation-rules.ts`, `lib/changeling-regalia.ts`, `lib/changeling-courts.ts`, `lib/changeling-kiths.ts`, `lib/entitlements.ts` e UI específica em `app/workspace/entitlement-page.tsx` | **Desvio arquitetural** em relação ao alvo line-owned |
| Duplicação | `lib/creation-rules.ts` ainda contém cópia de Seemings, anchors, frailties e Wyrd, além de regras Mage; `game-lines/changeling/creation-rules.ts` repete o bloco CtL | **Desvio**; mantém um arquivo misto que o plano excluiria |
| Import do rules module | `game-lines/changeling/rules.ts` importa `normalizeChangelingFrailties` de `@/lib/creation-rules`, não de `./creation-rules` | **Desvio** e risco de divergência entre as cópias |
| Abstração de recurso | `lib/resource-rules.ts` expõe uma tabela genérica `powerResourceLimits` usada como mecanismo comum | **Parcial**; a tabela coincide, mas semântica de Wyrd deve permanecer explícita e line-owned |
| Snapshots imutáveis | cobertos por `tests/game-line-architecture.test.mjs` | **Alinhado** |
| Print line-owned | `loadPrintSheet` carrega `print.tsx`/`print-sheet.tsx` apenas quando pedido | **Alinhado** e já além do mínimo de muitas linhas |

Observação de cobertura: os 24 testes arquiteturais passaram, mas o teste que monta a “closure” Changeling lê `game-lines/changeling/creation-rules.ts` na variável chamada `changelingRules`; ele não inspeciona o arquivo real `game-lines/changeling/rules.ts`. Por isso, o import legado de `@/lib/creation-rules` não é detectado por essa suíte.

### 17.4 Criação de personagem

| Regra | Estado atual | Avaliação e diferença |
| --- | --- | --- |
| 5/4/3 Attributes, 11/7/4 Skills, três Specialties e três Aspirations | fornecido pelo shell comum e validado | **Alinhado** |
| Seeming e +1 Attribute favorecido | selecionados e validados | **Alinhado** |
| Segunda Regalia | selecionada, diferente da primária, e validada | **Alinhado** |
| Kith opcional | `builder.tsx` adiciona erro quando `kith` está vazio | **Desvio**; a implementação torna Kith obrigatória |
| Kiths básicas | as 12 existem, com blessing e escolhas específicas | **Alinhado** para o conteúdo básico |
| Mask e mien | não existem campos próprios de criação/persistência; aparecem apenas em configurações de alguns Merits | **Ausente** |
| Court opcional | campo vazio é salvo como `Sem Corte`; Court concede Mantle 1 | **Alinhado** no fluxo básico |
| Court change | não foi encontrado fluxo transacional para converter Mantle/Goodwill e aplicar Sanctity | **Ausente** |
| Needle e Thread | catálogos com gatilhos, seleção canônica e apresentação bilíngue | **Alinhado** para os 24 exemplos básicos; conteúdo extra fica misturado |
| Touchstone inicial | há um campo no Builder, mas ele não é incluído na lista de validações obrigatórias | **Desvio**; personagem pode ser salvo sem Touchstone |
| Touchstone ligado a Clarity | persistido como string; na ficha vira lista de strings | **Parcial**; não há ID nem `clarity_slot` |
| Wyrd 1–3 por pontos de Merit | orçamento e limite são aplicados | **Alinhado** |
| Quatro Common + dois Royal | quantidade e tipos são validados | **Alinhado** |
| Dois Common favorecidos | `canSelectInitialContract` aceita qualquer Common não-Court; não há contagem mínima favorecida | **Desvio** |
| Acesso inicial a Royal/Court | Royal de Regalia precisa ser favorecido; Court Contract precisa corresponder à Court | **Alinhado** para a regra básica geral |
| Dez pontos de Merit | orçamento desconta Wyrd extra e Mantle gratuito | **Alinhado** |

Evidências principais: `game-lines/changeling/builder.tsx`, `builder-view.tsx`, `builder-eligibility.ts`, `builder-merit-grants.ts` e `app/character-builder-shell.tsx`.

### 17.5 Clarity, Touchstones e Icons

| Item | Estado atual | Avaliação e diferença |
| --- | --- | --- |
| Trilha mild/severe | `ClarityTrack` persiste e ordena `clarity_damage` | **Alinhado** |
| Clarity atual | calculada pelas caixas sem dano | **Alinhado** |
| Três caixas críticas | a UI explica que as três caixas à direita podem gerar Conditions | **Alinhado** como referência |
| Máximo Wits + Composure | Builder e recálculo de Experience usam a fórmula | **Alinhado** |
| Icons | não há coleção de Icons | **Ausente** |
| Aumento permanente | botão `Ganhar Lucidez` incrementa `current_state.clarity_bonus` gratuitamente e sem Icon | **Desvio de modelagem** |
| Touchstones estruturados | strings em `line_data.touchstone/touchstones`; quantidade vem do Merit | **Parcial** |
| Ligação Touchstone–caixa | não encontrada | **Ausente** |
| Modificadores de dano/recuperação por Touchstone | não encontrados como referência contextual própria | **Ausente** |

O track visual é uma boa base. O principal trabalho não é redesenhá-lo, e sim substituir o bônus anônimo por Icons auditáveis e estruturar a relação dos Touchstones com as caixas.

### 17.6 Wyrd, Glamour e frailties

| Item | Estado atual | Avaliação e diferença |
| --- | --- | --- |
| Glamour máxima/turno 1–10 | tabela completa em `lib/resource-rules.ts` | **Alinhado funcionalmente** |
| Limite de Attribute/Skill | compra com Experience usa `max(5, Wyrd)` | **Alinhado** |
| Redução de fadiga/doença e fruit carrying | `wyrdSummary` exibe os valores | **Alinhado** como referência |
| Frailty slots | número de linhas acompanha níveis pares e inclui Cold Iron | **Parcial** |
| Minor/major | frailties são apenas strings; não possuem severidade | **Desvio** |
| Conversão da matriz em Wyrd 6–10 | não pode ser validada sem severidade | **Ausente** |
| Normalização de Wyrd/Glamour no load | `rules.ts` não limita Wyrd nem `glamour_current` | **Parcial** |

Evidências: `game-lines/changeling/creation-rules.ts`, `rules.ts`, `experience-panel.tsx`, `sheet-view.tsx` e `lib/resource-rules.ts`.

### 17.7 Seemings, Courts e Merits

- As seis Seemings básicas têm blessing, curse, categoria favorecida e Regalia. **Alinhado**.
- `derivedWithPermanentMerits` aplica +3 Initiative e Speed à Beast. Dano letal desarmado permanece apenas no texto, coerente com a decisão de não automatizar combate. **Alinhado/Parcial**.
- `Grimm` está no mesmo objeto usado pelo Builder e amplia o union de Seeming em catálogo genérico. **Além do escopo** e sem opt-in.
- As 19 Courts do livro básico existem com cinco benefícios de Mantle. **Alinhado** no conteúdo.
- Mantle 1 é concedido e sincronizado com a Court. **Alinhado**.
- Court Goodwill usa configuração e produz benefícios derivados. **Parcial**, pois não existe fluxo de mudança de Court e a canonicalização ainda depende de helpers legados.
- Os 39 Merits do livro básico estão presentes. **Alinhado** em contagem e disponibilidade.
- Ratings descontínuas, instâncias, configurações especiais, grants e refunds possuem infraestrutura significativa. **Alinhado/Parcial**, dependendo do Merit.
- Fae Mount, Fae Pet, Hollow, Token, Hedgespun Item, Warded Dreams e Entitlement têm editores próprios. Parte disso excede o básico ou o modelo mínimo. **Além do escopo** onde a fonte não é o livro básico.
- Entitlements são carregados em todas as superfícies de Changeling apesar de nenhum dos 27 pertencer ao livro básico. **Além do escopo** e custo de catálogo desnecessário para uma modalidade core-only.

### 17.8 Contracts

Pontos fortes encontrados:

- os 110 Contracts do básico estão no shard `ctl-core.json`;
- a divisão 60 Arcadian + 40 Court + 10 Goblin está correta;
- records distinguem invocação rolada de automática;
- cost, dice pool, action, duration, outcomes, Loophole, options e Seeming Benefits são estruturados;
- testes específicos auditam cada bloco do básico e campos obrigatórios;
- a ficha apresenta detalhes e a impressão reutiliza o catálogo;
- compra de Seeming Benefit adicional custa 1 Experience;
- Goblin Contracts custam 2 Experience.

Diferenças:

- o grupo de catálogo carrega os 260 Contracts de todas as fontes, não apenas os 110 do básico;
- a criação não verifica que pelo menos dois Common são favorecidos;
- `ExperiencePanel` oferece todo Contract ainda não possuído e calcula seu custo, mas não filtra nem bloqueia acesso a Court Contracts por Mantle/Goodwill;
- a implementação oferece compra de foreign Court Clauses, uma extensão ligada ao material consolidado e fora do plano do básico;
- o personagem persiste snapshots completos de Contracts em `contracts`/`learned_contracts`, enquanto o plano prefere IDs canônicos e escolhas mínimas. Isso aumenta risco de texto oficial obsoleto permanecer no save;
- o overlay `lib/contracts-en.ts` e a direção `name`/`originalName` mantêm uma camada de compatibilidade de apresentação que merece auditoria editorial separada.

Evidências: `game-lines/changeling/catalogs/contracts.ts`, `builder-eligibility.ts`, `experience-panel.tsx`, `sheet-view.tsx`, `lib/contract-presentation.ts`, `public/data/changeling/contracts/**` e `tests/contracts-redo.test.mjs`.

### 17.9 Goblin Debt, Pledges, Hedge e sonhos

| Área | Estado atual | Avaliação e diferença |
| --- | --- | --- |
| Goblin Debt | track editável 0–10 com aviso sobre `Hedge Denizen` | **Parcial** |
| Transição no décimo ponto | não adiciona estado/Condition nem exige confirmação | **Ausente** |
| Pledges | `line_data.oaths` é uma lista livre de strings | **Parcial**; não distingue sealing, oath e bargain |
| Mask/mien e portaling | textos aparecem em Contracts/Merits, mas não há seção de personagem ou referência dedicada | **Ausente/Parcial** |
| Bedlam | aparece na tabela de Beats e em textos de catálogo | **Parcial**; não há referência/estado dedicado |
| Hedgespinning | aparece em Conditions, Contracts e Merits | **Parcial** como conteúdo de consulta; não há superfície própria |
| Oneiromancy/Dream Health | Conditions e Merits associados existem | **Parcial** como conteúdo de consulta; não há modelo do personagem |
| Pledges/sonhos automatizados | não existem | **Alinhado**, pois o plano também rejeita simuladores |

### 17.10 Itens feéricos e companions

- `Token` possui editor agregado para token, trifle e bauble personalizados. **Parcial** e conceitualmente próximo do plano.
- Não há catálogo dos quinze sample tokens, seis exceptional goblin fruits ou três oddments. **Ausente**.
- Não há inventário line-owned geral para fruit/oddment nem quantidade carregada. **Ausente**.
- Fae Mount possui configuração, derived, Health e habilidades; companions são exibidos em aba e impressão. **Alinhado** para esse Merit.
- `Fae Pet` e vários detalhes de Entitlement/companion vêm de outras fontes. **Além do escopo**.

### 17.11 Experience

Implementado e alinhado:

- custos de Attribute, Skill, Merit, Specialty, Contract, benefício de outra Seeming, Wyrd e ponto perdido de Willpower;
- Experience disponível/gasta/total;
- histórico com alvos e undo;
- refund de traits, Merit instances, Contracts, benefícios, Wyrd, Clarity bonus e Willpower;
- preservação do ponto gratuito de Mantle;
- tabela de custos e fontes de Beat específicas de Changeling.

Diferenças:

- cinco Beats não são convertidos por uma ação explícita em Experience; o usuário edita Experience disponível manualmente;
- Court Contract não é bloqueado por acesso no fluxo de compra;
- ganho permanente de Clarity é registrado como `clarity_bonus`, mas não como Icon;
- a função de recálculo não é a mesma usada por load/normalização e pode permitir divergência entre `derived` persistido e runtime;
- não existe compra/transação para mudança de Court com conversão de Mantle/Goodwill;
- o histórico fica limitado aos 100 registros mais recentes, decisão de produto que pode reduzir auditabilidade de personagens longos.

Evidências: `game-lines/changeling/experience-panel.tsx`, `experience-shared.tsx`, `builder-power-progression.ts`, `lib/experience-refunds.ts` e `tests/experience-persistence.test.mjs`.

### 17.12 Ficha, mobile, localização e impressão

- Há ficha desktop e mobile próprias de Changeling. **Alinhado**.
- A ficha cobre identity, traits, Merits, Court, Mantle, frailties, Clarity, Touchstones, Wyrd/Glamour, Contracts, Goblin Debt, oaths, Conditions, combate, companions e Experience. **Alinhado em amplitude**, com as lacunas de modelagem já descritas.
- A superfície de print é lazy, line-owned, A4 e possui paginação medida. **Alinhado**.
- Print inclui Contracts, Seeming/Kith lore, Merits, oaths, equipamentos, Conditions, Entitlement e companions. **Alinhado/Além do escopo**.
- IDs de Contract, Court e Kith são em geral estáveis, e há overlays/apresentação por locale. **Parcialmente alinhado**.
- Os 73 Kiths oficiais fora de homebrew não possuem `sourceId` no JSON, embora tenham `source` e página. **Parcial** em identidade de fonte.
- Vários textos adicionais permanecem somente em inglês; isso é aceitável como fallback, desde que a UI deixe claro que não existe tradução revisada e nunca persista o rótulo localizado como identidade.

### 17.13 Testes atuais versus testes necessários

Cobertura forte já existente:

- arquitetura lazy, snapshots e isolamento;
- contagem e identidade dos catálogos;
- blocos e estrutura de Contracts;
- Kiths, localização e escolhas persistíveis;
- Entitlements e grants;
- Experience, refunds e Mantle gratuito;
- paginação de impressão;
- schema 2 e persistência.

Lacunas de teste diretamente ligadas às diferenças:

- Kith vazia deve ser aceita na criação;
- Touchstone inicial vazio deve bloquear conclusão;
- ao menos dois Common Contracts precisam ser favorecidos;
- acesso a Court Contract por Mantle/Goodwill no fluxo de Experience;
- Court change com conversão e Sanctity of Merits;
- Icons alterando Clarity máxima e restaurando Willpower;
- Touchstones ligados a caixas de Clarity;
- matriz minor/major de frailties em Wyrd 1–10;
- Goblin Debt 10 e `Hedge Denizen`;
- sealing/oath/bargain em round-trip;
- isolamento “core book only” contra suplementos e homebrew;
- catálogo dos itens feéricos do básico;
- normalização completa no load usando o rules module real;
- teste arquitetural que leia `game-lines/changeling/rules.ts`, não apenas `creation-rules.ts`.

### 17.14 Backlog de alinhamento sugerido

Este backlog é uma recomendação de ordem, não autorização para editar código.

#### Prioridade 0 — Correção de criação

1. Tornar Kith opcional.
2. Tornar Touchstone inicial obrigatório e ligá-lo a `Composure + 1`.
3. Validar ao menos dois Common Contracts favorecidos.
4. Bloquear Court Contracts sem acesso também na compra com Experience.

Esses quatro itens impedem ou permitem personagens mecanicamente inválidos e devem preceder expansão de conteúdo.

#### Prioridade 1 — Modelo permanente de Clarity e Wyrd

1. Introduzir Touchstones estruturados e Icons.
2. Remover o conceito de ganho livre de `clarity_bonus` ou convertê-lo em evento de Icon.
3. Tipar frailties como minor/major e cobrir a matriz Wyrd 1–10.
4. Centralizar derived/normalize/synchronize em `game-lines/changeling/rules.ts`.
5. Tratar Goblin Debt 10 explicitamente.

#### Prioridade 2 — Escopo e procedência

1. Separar o shard/core snapshot do catálogo expandido.
2. Tornar suplementos e homebrew opt-in por fonte, sem misturá-los ao básico.
3. Acrescentar source IDs ausentes e revisar o registro híbrido de Merit.
4. Evitar que Entitlements sejam carregados em uma superfície core-only.
5. Preservar os 110 Contracts e 39 Merits já auditados sem retranscrição desnecessária.

#### Prioridade 3 — Pledges, aparência e itens

1. Adicionar Mask e mien como campos próprios.
2. Migrar `oaths: string[]` para registros de sealing/oath/bargain, preservando texto existente.
3. Catalogar os quinze tokens, seis fruits e três oddments.
4. Adicionar inventário line-owned e referências de portaling/Bedlam/Hedge/dreams.

#### Prioridade 4 — Limpeza arquitetural

1. Remover a duplicação CtL de `lib/creation-rules.ts`.
2. Fazer `game-lines/changeling/rules.ts` depender somente de módulos line-owned ou contratos neutros.
3. Mover UI específica de Entitlement para a game line quando essa feature suplementar estiver ativa.
4. Revisar helpers `lib/changeling-*` e manter em Core apenas mecanismos realmente neutros.
5. Tornar a tabela de Wyrd semanticamente line-owned, mesmo que compartilhe um helper numérico pequeno.
6. Corrigir a cobertura arquitetural para inspecionar o rules module real.

#### Prioridade 5 — UX e auditabilidade

1. Adicionar conversão explícita de cinco Beats em uma Experience.
2. Definir política de histórico maior que 100 entradas ou justificar a retenção limitada.
3. Mostrar fonte ativa e fallback de idioma nos catálogos.
4. Validar print e mobile com os novos modelos sem regredir a superfície atual.

### 17.15 O que deve ser preservado

Uma implementação de alinhamento não deve recomeçar Changeling do zero. Os seguintes ativos atuais são fortes e devem ser reaproveitados:

- registration e loaders lazy;
- shells comuns e superfícies CtL independentes;
- snapshots imutáveis e manifest de catálogos;
- shard `ctl-core.json` com os 110 Contracts;
- 39 Merits básicos já catalogados;
- 19 Courts e 12 Kiths básicas já transcritas;
- apresentação detalhada de Contracts;
- track visual de Clarity;
- recursos Wyrd/Glamour;
- infraestrutura de Merit configurations, grants e instances;
- Experience history e refunds;
- Conditions manager;
- ficha responsiva e impressão A4 lazy;
- testes editoriais de Contracts e testes de arquitetura/persistência.

### 17.16 Conclusão da comparação

A implementação atual já possui uma base funcional ampla e vários componentes mais maduros que uma primeira entrega: Contracts auditados, Merits configuráveis, Experience com refund, ficha mobile e impressão lazy. Portanto, o trabalho recomendado é de **alinhamento e redução de ambiguidade**, não de reconstrução total.

As diferenças mais importantes não são de quantidade de conteúdo. São de regra e modelo:

1. Kith obrigatória quando deveria ser opcional.
2. Touchstone inicial não obrigatório e sem ligação à Clarity.
3. Falta da exigência de dois Common Contracts favorecidos.
4. Court Contracts compráveis sem validação de acesso.
5. Icons ausentes e Clarity permanente representada por bônus livre.
6. Frailties sem severidade minor/major.
7. Pledges reduzidos a texto livre.
8. Conteúdo básico, suplementos e homebrew ativos no mesmo catálogo.
9. Normalização e derivados fragmentados.
10. Regras CtL duplicadas e parcialmente fora do módulo da game line.

Esses dez pontos formam o delta real entre o plano auditado do livro básico e o repositório observado.
