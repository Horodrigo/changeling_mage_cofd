# Plano auditável de implementação - Vampire: The Requiem 2e

Status: **implementação autorizada em 14/09/2026 e em andamento na branch `vampire-splat`**
Fonte primária: *Vampire: The Requiem Second Edition*, livro básico anexado
Escopo do conteúdo: personagens vampiros jogáveis criados apenas com o livro básico

## 1. Objetivo

Adicionar `VtR` como terceira game line de *Characters of the Darkness*, preservando a regra arquitetural do projeto:

> Core fornece mecanismos. Cada game line fornece suas mecânicas.

A primeira entrega deve permitir:

- criar e salvar um vampiro válido;
- consultar e atualizar sua ficha em desktop e mobile;
- controlar recursos e estados que pertencem ao personagem;
- comprar características com Experiência conforme os custos de VtR;
- carregar apenas os módulos e catálogos de Vampire quando `VtR` estiver ativo;
- alternar idioma sem alterar IDs, regras ou dados persistidos.

Este documento não autoriza alterações de código. A implementação só começa depois da aprovação explícita do plano e das decisões abertas na seção 13.

## 2. Limites da primeira implementação

### Incluído

- cinco Clans básicos: Daeva, Gangrel, Mekhet, Nosferatu e Ventrue;
- personagem sem Covenant e os cinco Covenants básicos;
- Mask, Dirge, Touchstones, Humanity, Blood Potency e Vitae;
- dez Disciplines básicas;
- Devotions do livro básico;
- Crúac, Theban Sorcery, Coils e Scales do livro básico;
- Merits mortais válidos e Merits Kindred do livro básico;
- Conditions do núcleo e as Conditions de Vampire;
- criação, ficha, progressão com EXP e normalização dos dados;
- regras derivadas necessárias à ficha, como limites de Vitae e efeitos permanentes de Disciplines físicas.

### Excluído da primeira implementação

- Bloodlines, pois o livro apresenta a estrutura geral, mas não um catálogo completo de Bloodlines de jogador;
- criação de ghouls, revenants, Strix e antagonistas;
- resolução automática de cenas, combate, alimentação, frenesi ou Blood Sorcery;
- passagem automática de décadas para aumentar ou reduzir Blood Potency;
- material de suplementos;
- impressão/PDF de Vampire;
- tradução inventada de conteúdo que não possua versão portuguesa auditada.

Os elementos excluídos não devem gerar campos opcionais em Core nem impedir sua inclusão futura por módulos próprios.

## 3. Regras confirmadas no livro

As páginas abaixo são as páginas impressas do livro, não o índice numérico do arquivo PDF.

### 3.1 Criação de personagem

Fonte principal: pp. 79-83.

1. Definir conceito e três Aspirations. Uma ou duas devem se relacionar à condição Kindred e ao menos uma deve se relacionar ao mundo mortal.
2. Priorizar Attributes e distribuir 5/4/3 pontos, além do ponto gratuito de cada Attribute.
3. Priorizar Skills e distribuir 11/7/4 pontos, sem pontos gratuitos.
4. Escolher três Skill Specialties.
5. Escolher Clan, Covenant opcional, Mask, Dirge, Touchstone, Blood Potency e Disciplines.
6. Escolher dez pontos de Merits. Blood Potency adicional consome cinco pontos de Merit por ponto, com no máximo dois pontos adicionais na criação.
7. Calcular Advantages.

Regras adicionais da etapa Kindred:

- Clan concede +1 em um dos dois Attributes favorecidos e não pode elevar esse Attribute acima de 5 na criação.
- O personagem recebe três pontos de Disciplines; ao menos dois precisam ser in-clan e o terceiro pode ser qualquer Discipline.
- Circle of the Crone, Lancea et Sanctum e Ordo Dracul podem converter um dos três pontos iniciais, quando já possuem Covenant Status, respectivamente em Crúac, Theban Sorcery ou no Coil do Mystery escolhido.
- Blood Potency começa em 1.
- Humanity começa em 7.
- O primeiro Touchstone é ligado ao ponto 6 de Humanity, exceto para Ventrue, cujo primeiro Touchstone é ligado ao ponto 7.
- Covenant é opcional e pode mudar durante a crônica; Clan não muda normalmente após a criação.

### 3.2 Advantages e valores derivados

Fonte: pp. 81-83, 89-90 e 125-142.

| Característica | Regra proposta |
| --- | --- |
| Size | 5 |
| Willpower | Resolve + Composure |
| Health | Size + Stamina efetiva; Resilience aumenta Stamina e, portanto, Health |
| Defense | menor entre Dexterity e Wits + Athletics; Celerity aplica seu efeito persistente |
| Initiative | Dexterity + Composure; Celerity aplica seu efeito persistente |
| Speed | Size + Strength efetiva + Dexterity; Vigor aumenta Strength e, portanto, Speed |
| Humanity inicial | 7 |
| Blood Potency inicial | 1, podendo chegar a 3 pela compra com pontos de Merit |

O livro tem uma divergência textual sobre Speed: o texto da p. 81 omite Vigor, enquanto a referência rápida da p. 82 o inclui. A proposta usa o valor efetivo de Strength, já alterado pelo efeito persistente de Vigor, porque isso coincide com a referência rápida e com a descrição da Discipline. A decisão continua aberta para auditoria.

### 3.3 Clans e Banes

Fontes: perfis nas pp. 13-27 e regras mecânicas na p. 103.

| Clan | Attribute favorecido | Disciplines in-clan | Bane |
| --- | --- | --- | --- |
| Daeva | Dexterity ou Manipulation | Celerity, Majesty, Vigor | Wanton Curse |
| Gangrel | Composure ou Stamina | Animalism, Protean, Resilience | Feral Curse |
| Mekhet | Intelligence ou Wits | Auspex, Celerity, Obfuscate | Tenebrous Curse |
| Nosferatu | Composure ou Strength | Nightmare, Obfuscate, Vigor | Lonely Curse |
| Ventrue | Presence ou Resolve | Animalism, Dominate, Resilience | Aloof Curse |

Os Banes de Clan só passam a afetar o personagem quando ele alcança Humanity 6 e continuam ativos mesmo se Humanity voltar a 7.

- Daeva: a partir da segunda alimentação no mesmo mortal, testa Humanity; falha causa a Persistent Condition `Dependent` em relação ao mortal até a morte dele.
- Gangrel: testes para resistir a frenzy ficam limitados por Humanity; isso não limita os testes para riding the wave.
- Mekhet: ao alcançar Humanity 6 escolhe um Bane pessoal não ligado a breaking point; ele ocupa um dos três espaços e Humanity conta como um ponto menor para Banes baseados em Humanity, incluindo sol e torpor.
- Nosferatu: Humanity conta como dois pontos menor para penalidades Sociais com humanos; falhas de Presence ou Manipulation contam como dramatic failures. Não se aplica contra Touchstones ou Kindred.
- Ventrue: o primeiro Touchstone ocupa Humanity 7 e se desprende na primeira perda de Humanity; Touchstones adicionais ocupam 6 a 2.

A ficha mostra o Bane e seu texto mecânico para consulta. O usuário calcula os modificadores, realiza a rolagem e altera manualmente Conditions ou outras consequências, como já ocorre nas demais game lines.

### 3.4 Covenants

Fontes: pp. 14-52 e 80.

| Covenant | Acesso mecânico |
| --- | --- |
| Carthian Movement | Carthian Law Merits |
| Circle of the Crone | Crúac e rites |
| Invictus | Oaths |
| Lancea et Sanctum | Theban Sorcery e miracles |
| Ordo Dracul | Mystery, Coils e Scales |

- O personagem pode ser covenantless.
- As vantagens exigem ao menos um ponto do Covenant Status correspondente.
- Clan Status e Covenant Status são domínios distintos.
- VII e grupos antagonistas não entram como Covenants selecionáveis no escopo inicial.

### 3.5 Mask, Dirge e Willpower

Fontes: pp. 80-87.

- Mask substitui Virtue como a persona pública do vampiro.
- Dirge substitui Vice como sua verdade íntima e comportamento entre Kindred.
- Cada arquétipo possui um gatilho para recuperar um ponto de Willpower e outro para recuperar todo o Willpower.
- O catálogo inicial será reconstruído a partir de todos os arquétipos do livro, com opção `Custom` que persiste nome e os dois gatilhos escritos pelo usuário.

Não se deve reutilizar `Virtue`/`Vice` como nomes persistidos: Mask e Dirge são conceitos mecânicos próprios de Vampire.

### 3.6 Humanity, Touchstones e Banes adquiridos

Fontes: pp. 87-88 e 107-109.

- Um Touchstone ligado concede +2 no teste de detachment; múltiplos concedem +3; nenhum impõe -2.
- Um Touchstone está ligado somente enquanto o personagem possui o ponto de Humanity ao qual ele foi associado.
- Defender a ligação recupera um Willpower; sofrer dano grave nessa defesa recupera todo o Willpower.
- Perder o último Touchstone exige perder Humanity e substituí-lo em um mês, ou receber `Languid` imediatamente.
- Touchstones adicionais são adquiridos pelo Merit Touchstone e ocupam pontos inferiores da trilha.
- Humanity 0 transforma o personagem em draugr e encerra sua condição de personagem jogável.
- Todo risco de detachment concede um Beat, independentemente do resultado.
- Ao perder Humanity, o jogador pode aceitar um Bane e um Beat para tornar aquele breaking point específico imune no futuro. Cada Bane impõe -1 em testes futuros de detachment e o limite normal é três.

A ficha terá uma trilha de Humanity com Touchstones visualmente ligados aos pontos correspondentes, mais uma lista estruturada de Banes. Os modificadores de detachment serão apresentados como referência; o usuário calcula o pool, realiza o teste e registra manualmente qualquer consequência.

### 3.7 Blood Potency e Vitae

Fonte: pp. 89-90.

| Blood Potency | Máximo de Attribute/Skill | Vitae máxima / por turno | Fonte normal de alimento |
| ---: | ---: | ---: | --- |
| 0 | 5 | Stamina / 1 | Animals |
| 1 | 5 | 10 / 1 | Animals |
| 2 | 5 | 11 / 2 | Animals |
| 3 | 5 | 12 / 3 | Humans |
| 4 | 5 | 13 / 4 | Humans |
| 5 | 5 | 15 / 5 | Humans |
| 6 | 6 | 20 / 6 | Kindred |
| 7 | 7 | 25 / 7 | Kindred |
| 8 | 8 | 30 / 8 | Kindred |
| 9 | 9 | 50 / 10 | Kindred |
| 10 | 10 | 75 / 15 | Kindred |

- Alimentar-se abaixo da restrição custa um Willpower por Vitae obtida.
- Cinquenta anos ativos aumentam Blood Potency em um; vinte e cinco anos em torpor reduzem em um.
- A passagem de tempo não será automática. A ficha oferecerá apenas ações explícitas e registradas para alterar Blood Potency.
- O valor atual de Vitae fica em `current_state`; Blood Potency e seus limites permanentes ficam em `line_data`/derivados.

### 3.8 Corpo vampírico e estados de uso

Fontes principais: pp. 90-108.

Campos e referências previstos na ficha:

- Vitae atual e limite de gasto por turno;
- Blush of Life;
- Physical Intensity: 1 Vitae para +2 em rolagens do Attribute físico escolhido naquele turno;
- cura: 1 Vitae para dois bashing ou um lethal; aggravated exige cinco Vitae e um dia;
- custo de despertar e conservação de ferimentos no daysleep;
- Predatory Aura, com aspectos Monstrous, Seductive e Competitive;
- lembretes de frenzy, riding the wave, fogo, sol, staking, torpor e Final Death;
- estado de torpor e data/duração narrativa opcional;
- anotações estruturadas de Vinculum e Vitae addiction quando forem relevantes.

Não haverá simulador, cálculo de pools, rolagem ou aplicação automática de consequências. A ficha apresenta as regras e mantém somente os valores e estados editados pelo usuário.

A tabela visual da p. 105 confirma a duração-base de torpor:

| Humanity | Duração-base |
| ---: | --- |
| 9-10 | uma noite |
| 8 | duas noites |
| 6-7 | uma semana |
| 5 | um mês |
| 4 | um ano |
| 3 | cinco anos |
| 2 | dez anos |
| 1 | cinquenta anos |
| 0 | cem anos |

A duração-base é multiplicada por Blood Potency e permanece uma estimativa narrativa, como o próprio livro determina.

### 3.9 Disciplines e Devotions

Fontes: pp. 125-149.

Disciplines básicas:

- Animalism;
- Auspex;
- Celerity;
- Dominate;
- Majesty;
- Nightmare;
- Obfuscate;
- Protean;
- Resilience;
- Vigor.

Regras de modelagem:

- A rating da Discipline é persistida uma vez; poderes de nível são derivados da rating, não comprados como cópias independentes.
- Cada poder mantém ID estável, nome canônico, nível, custo, requisito, pool, action, duration, resistência/contestação, efeitos, resultados, escolhas e fonte/página.
- Celerity, Resilience e Vigor terão efeitos persistentes incorporados ao cálculo derivado e ações de gasto separadas.
- Protean precisa persistir as adaptações de `Predatory Aspect`, formas de `Beast's Skin` e escolhas de `Unnatural Aspect`.
- Devotions são compras independentes, com pré-requisitos e custo explícito no catálogo. O custo não será inferido cegamente, pois o livro admite ajustes particulares.
- Clash of Wills usa Blood Potency + Discipline e deve aparecer nas referências contextuais.

Compra fora do Clan:

- Disciplines in-clan não exigem professor.
- Animalism, Celerity, Obfuscate, Resilience e Vigor podem ser desenvolvidas independentemente por qualquer Kindred.
- Auspex, Dominate, Majesty, Nightmare e Protean fora do Clan exigem professor e sangue de alguém que possua a Discipline.

O fluxo de EXP exigirá que o jogador confirme esses requisitos narrativos antes de concluir uma compra aplicável.

### 3.10 Blood Sorcery

Fontes: pp. 150-154.

Crúac:

- exige Circle of the Crone Status 1 para aprender novos pontos e rites;
- cada ponto reduz o máximo de Humanity para `10 - Crúac`;
- aprender um ponto causa breaking point para Humanity 4+;
- cada ponto concede um rite gratuito, desde que o Status seja válido;
- rites adicionais custam 2 EXP;
- o custo ritual normal é Vitae igual à rating do rite.

Theban Sorcery:

- exige Lancea et Sanctum Status 1 para aprender novos pontos e miracles;
- o personagem precisa ter Humanity ao menos igual à rating do miracle;
- cada ponto concede um miracle gratuito, desde que o Status seja válido;
- miracles adicionais custam 2 EXP;
- o custo normal é 1 Willpower e o sacrament descrito.

Os dois catálogos manterão rating, custo, target successes, pool, resistência/contestação, sacrament quando aplicável, range, duration, efeito, resultados, fonte e página. A execução ritual continuará pertencendo à mesa; a ficha apenas apresenta as regras e mantém os recursos informados pelo usuário.

### 3.11 Ordo Dracul

Fontes: pp. 154-159.

- Ao entrar na Ordo, o vampiro escolhe um Mystery: Ascendant, Wyrm ou Voivode.
- O Coil do Mystery escolhido custa 3 EXP por ponto.
- Coils fora do Mystery custam 4 EXP por ponto, não podem ser aprendidos na criação e sua rating é limitada por Ordo Dracul Status.
- Um ponto inicial de Discipline pode ser convertido no primeiro ponto do Coil escolhido, se o personagem preencher os requisitos.
- Scales são procedimentos ligados a um Coil pré-requisito e não devem ser modeladas como simples efeitos ativos.

Há divergência interna sobre o custo de Scales: a referência rápida da p. 83 diz 2 EXP; a regra detalhada da p. 155 diz 1 EXP se o Coil pré-requisito for atendido e 2 EXP caso não seja. A proposta é adotar a regra detalhada 1/2, sujeita à auditoria.

### 3.12 Merits e Conditions

Fontes: Merits nas pp. 109-124; Conditions nas pp. 301-307.

- Catálogo inglês-canônico com fallback explícito para inglês quando não houver tradução revisada.
- Merits mortais válidos vêm do catálogo Core; Merits Kindred pertencem ao módulo Vampire.
- `Vice-Ridden`, `Virtuous` e Supernatural Merits incompatíveis ficam inelegíveis.
- Carthian Law, Invictus Oaths e demais vantagens de Covenant aplicam pré-requisitos no módulo Vampire.
- Ratings descontínuas, configuração, repetição e reembolso seguem as invariantes atuais de Merits.
- Touchstone é uma estrutura agregada ligada à trilha de Humanity, não uma coleção de instâncias sem relação com a trilha.
- Status precisa distinguir Clan e cada Covenant por ID canônico.
- O toggle compartilhado `prerequisites disponíveis / todos` será usado tanto na criação quanto na compra com EXP.
- Conditions iguais às já existentes no Core serão unificadas por ID canônico. Conditions próprias como `Bestial`, `Competitive`, `Wanton`, `Dependent`, `Languid`, `Tempted` e `Jaded` ficam no catálogo Vampire.

## 4. Modelo persistido proposto

O schema externo continua sendo `schema_version = 2`. Core não conhecerá os campos internos abaixo.

### `line_data` de Vampire

```text
clan_id
favored_attribute
covenant_id | null
mask: { archetype_id | "custom", custom_name?, single_willpower?, all_willpower? }
dirge: { archetype_id | "custom", custom_name?, single_willpower?, all_willpower? }
aspirations: string[3]
humanity
touchstones: [{ id, name, humanity_slot, notes? }]
blood_potency
disciplines: { [discipline_id]: rating }
discipline_choices: {
  protean_aspects,
  protean_forms,
  protean_unnatural_aspect,
  other_power_choices
}
devotion_ids
blood_sorcery: {
  cruac_rating,
  cruac_rite_ids,
  theban_rating,
  theban_miracle_ids
}
ordo_dracul: {
  mystery_id | null,
  coil_ratings,
  scale_ids,
  scale_configurations
}
banes: [{ id, definition_id | "custom", name, breaking_point_id?, notes? }]
```

### `current_state` de Vampire

```text
vitae_current
willpower_current
willpower_lost_dots
health_damage
beats
experience_available
experience_spent
vampire_experience_history
conditions
blush_of_life_active
torpor: { active, started_at?, expected_end?, notes? }
blood_bonds: [{ id, subject, stage, last_fed_at?, notes? }]
vitae_addictions: [{ id, subject, notes? }]
notes
```

Princípios:

- IDs canônicos, nunca rótulos traduzidos, controlam regras.
- O histórico de EXP registra snapshots suficientes para desfazer exatamente uma compra válida.
- Normalização limita ratings, remove referências inexistentes e preserva texto autoral.
- Sincronização de grants não apaga escolhas legítimas quando Status muda; ela distingue `granted`, `purchased` e `currently inaccessible`.
- Valores legados ou de outra game line nunca são interpretados como Vampire.

## 5. Catálogos e arquivos de dados

Estrutura proposta:

```text
public/data/vampire/
  clans.json
  covenants.json
  masks-dirges.json
  conditions.json
  merits/
    index.json
    vtr-core.json
  disciplines/
    index.json
    animalism.json
    auspex.json
    celerity.json
    dominate.json
    majesty.json
    nightmare.json
    obfuscate.json
    protean.json
    resilience.json
    vigor.json
  devotions.json
  blood-sorcery/
    cruac.json
    theban-sorcery.json
  ordo-dracul/
    coils.json
    scales.json
```

Cada registro oficial terá, conforme o tipo:

- `id` estável e inglês canônico;
- nome original e tradução revisada opcional;
- source ID, título do livro e página impressa;
- rating/custo e pré-requisitos estruturados;
- texto dividido em campos mecânicos reais, sem duplicar efeito em options;
- escolhas persistíveis identificadas explicitamente;
- tags apenas para busca e apresentação, nunca como regra primária.

Grupos lazy propostos:

- `vampire-reference`: Clans, Covenants, Mask/Dirge, Humanity, Blood Potency e referências rápidas;
- `vampire-merits`: Merits e extensões de elegibilidade/configuração;
- `vampire-powers`: Disciplines, Devotions, Blood Sorcery, Coils e Scales;
- `vampire-conditions`: Conditions exclusivas e merge canônico com Core.

Antes de integrar os catálogos à UI, uma auditoria editorial deve confirmar contagens, IDs, fontes, páginas, ratings, pré-requisitos e campos obrigatórios. Extração do PDF é apenas ponto de partida; texto em duas colunas será conferido visualmente.

## 6. Arquitetura e colocação do código

### 6.1 Módulo aditivo

```text
game-lines/vampire/
  registration.ts
  rules.ts
  creation-rules.ts
  builder.tsx
  builder-view.tsx
  builder-eligibility.ts
  builder-power-progression.ts
  builder-merit-grants.ts
  merit-configuration-editor.tsx
  sheet.tsx
  sheet-view.tsx
  experience-panel.tsx
  experience-shared.tsx
  catalogs/
    reference.ts
    merits.ts
    powers.ts
    conditions.ts
```

### 6.2 Pequenas alterações centrais autorizáveis

- adicionar `VtR` a `PERSISTED_GAME_LINE_IDS`;
- registrar metadata e loaders lazy em `game-line-registry.ts`;
- registrar apenas os quatro grupos lazy de Vampire;
- permitir `PersistedGameLineId` nos shells que ainda declaram o union literal `"CtL" | "MtA"`;
- neutralizar o `CharacterPaperShell`, que hoje escolhe visual entre apenas CtL e MtA, recebendo classe/decoração da registration ou do wrapper da linha;
- incluir a opção Vampire na Home/seleção e sua contagem/ícone;
- substituir branches binários restantes em catalog route, stored character e configuração de Merit por dispatch explícito ou hook da registration;
- adicionar variáveis visuais de tema Vampire sem importar regras Vampire no Core;
- atualizar testes arquiteturais para exigir que Core, Mage e Changeling não importem Vampire.

Não será criado um novo Builder universal, Sheet universal ou engine única de poderes sobrenaturais. Semântica de Blood Potency, Humanity, Disciplines e Covenant fica em `game-lines/vampire/**`.

## 7. Fluxo do Builder

O shell comum continua responsável por identidade, Attributes, Skills, Specialties, Aspirations e mecanismo genérico de Merits. A etapa Vampire será organizada em blocos progressivos dentro do passo da game line:

1. **Kindred identity**: Clan, Attribute favorecido e apresentação do Bane.
2. **Society and self**: Covenant opcional, Mask e Dirge.
3. **Humanity**: Touchstone inicial e visualização do slot ligado.
4. **Blood**: Blood Potency inicial e efeito sobre o orçamento de dez pontos de Merit.
5. **Disciplines**: três pontos, validação de dois in-clan e escolhas internas de Protean.
6. **Covenant powers**: somente quando Covenant Status e regras iniciais permitirem.
7. **Merits**: orçamento restante, toggle de elegibilidade e configurações line-owned.
8. **Review**: resumo de grants, limites, valores derivados permanentes e erros acionáveis.

Validações bloqueantes:

- orçamento 5/4/3 e 11/7/4 correto;
- três Specialties e três Aspirations;
- Clan e Attribute favorecido válidos;
- Mask, Dirge e Touchstone inicial preenchidos;
- Blood Potency 1-3 na criação e custo descontado dos Merits;
- exatamente três pontos iniciais de Disciplines, dois ou mais in-clan;
- Covenant powers somente com Covenant/Status compatíveis;
- dez pontos totais entre Merits e Blood Potency extra;
- Humanity 7 e derivados coerentes.

## 8. Organização proposta da ficha

### Summary

- nome, conceito, Clan, Covenant, Mask, Dirge e Blood Potency;
- Aspirations e Experience;
- Willpower, Health, Vitae e Humanity resumidos;
- Conditions ativas.

### Traits

- Attributes, Skills e Specialties;
- Merits e configurações;
- Advantages derivadas.

### Humanity

- trilha Humanity 10-0;
- Touchstones ligados aos pontos;
- Banes de Clan e adquiridos;
- referência de detachment com seus modificadores, sem cálculo de pool;
- tabelas contextuais de sol e torpor.

### Disciplines

- ratings e poderes desbloqueados;
- escolhas configuráveis;
- Devotions;
- custos em Vitae como referência, com edição manual da trilha.

### Covenant

- Status e benefício do Covenant;
- Carthian Laws ou Invictus Oaths nos Merits;
- Crúac/rites, Theban/miracles ou Ordo Mystery/Coils/Scales quando aplicável;
- estado vazio explicativo para covenantless.

### Combat

- Defense, Initiative, Speed, Health e armor;
- armas/equipamentos já compartilhados;
- Physical Intensity, healing e referências de dano vampírico;
- frenzy/riding the wave e Predatory Aura como referências compactas, sem execução automática.

### Notes

- notas gerais;
- Blood Bonds e Vitae addictions;
- torpor e eventos narrativos relevantes.

Em mobile, as mesmas informações serão distribuídas por tabs e cards tocáveis, sem reduzir funcionalidades ou provocar overflow horizontal.

## 9. Progressão com Experiência

Fonte principal: p. 83.

| Compra | Custo |
| --- | ---: |
| Attribute | 4 EXP por ponto |
| Skill | 2 EXP por ponto |
| Merit | 1 EXP por ponto |
| Specialty | 1 EXP |
| Discipline in-clan | 3 EXP por ponto |
| Discipline out-of-clan | 4 EXP por ponto |
| Coil do Mystery escolhido | 3 EXP por ponto |
| Coil fora do Mystery | 4 EXP por ponto |
| Crúac | 4 EXP por ponto |
| Theban Sorcery | 4 EXP por ponto |
| Blood Sorcery ritual | 2 EXP |
| Humanity | 2 EXP por ponto |
| Blood Potency | 5 EXP por ponto |
| ponto perdido de Willpower | 1 EXP |
| Devotion | custo explícito auditado por Devotion |
| Scale | proposta 1 EXP com Coil pré-requisito; 2 EXP sem ele |

Cinco Beats convertem em uma Experience.

Fontes de Beat exibidas pela ficha:

- cumprir uma Aspiration;
- resolver uma Condition ou atender um gatilho próprio dela;
- converter uma falha em dramatic failure;
- sofrer lethal em uma das caixas finais de Health; bashing não concede esse Beat a vampiros;
- final da sessão;
- arriscar detachment.

Toda compra terá preview de custo, requisitos, valor anterior/novo, origem do gasto e confirmação. O undo usa o snapshot do histórico, inclusive para grants, mudanças de limites e configurações dependentes.

## 10. Normalização, sincronização e derivados

O módulo `vampire/rules.ts` será puro e terá responsabilidades separadas:

- **normalize**: corrigir forma estrutural e limites sem inventar escolhas;
- **validateCreation**: relatar campos e orçamentos inválidos;
- **deriveCharacterState**: calcular Health, Speed, Defense, Initiative, Vitae máxima/gasto, limites de traits e modificadores determinísticos;
- **synchronizeCharacter**: reconciliar grants e acesso, preservando compras e histórico.

Casos obrigatórios:

- mudança de Covenant não apaga powers comprados; marca-os inacessíveis quando a regra exigir;
- perda de Covenant Status impede novas compras, mas respeita a regra específica sobre desenvolvimento do que já foi aprendido;
- alteração de Blood Potency recalcula limites sem truncar automaticamente Attributes/Skills antigos quando a própria regra preserva ratings após redução;
- Resilience e Vigor alteram valores efetivos sem sobrescrever os pontos-base do Attribute;
- Humanity menor separa Touchstones ligados dos cadastrados;
- Mekhet e Nosferatu usam Humanity efetiva somente nos contextos descritos por seus Banes;
- Humanity 0 marca o personagem como não jogável, sem deletá-lo.

## 11. Fases de execução e pontos de auditoria

### Fase 0 - Auditoria de regras e escopo (concluída)

- decisões da seção 13 registradas pelo usuário;
- automação de rolagens, pools e consequências descartada;
- impressão confirmada fora desta entrega;
- autorização explícita recebida; implementação iniciada na branch dedicada `vampire-splat`.

Saída auditável: revisão deste documento.

### Fase 1 - Habilitação arquitetural

- adicionar ID/registration `VtR` e neutralizar unions/binários;
- criar loaders lazy vazios com contratos de compilação;
- adicionar testes de isolamento e manifest.

Critério de aceite: selecionar CtL ou MtA continua sem carregar chunks/JSON de Vampire; selecionar VtR não carrega CtL/MtA.

### Fase 2 - Reconstrução dos catálogos

- transcrever em lotes pequenos Clans/Covenants/Mask-Dirge;
- depois Merits/Conditions;
- depois Disciplines/Devotions;
- por fim Blood Sorcery/Coils/Scales;
- validar cada lote contra as páginas renderizadas do PDF.

Critério de aceite: relatório de contagem, IDs, páginas, requisitos, custos, campos ausentes e exceções conhecidas. A UI não começa a consumir um lote antes dessa auditoria.

### Fase 3 - Regras e persistência

- implementar tipos internos, normalização, validação, derivados e sincronização;
- testar round-trip do schema 2 e valores-limite de Humanity/Blood Potency;
- testar Banes, Touchstones, Status e grants.

Critério de aceite: fixtures independentes de React cobrem toda a matriz de criação e progressão.

### Fase 4 - Builder

- montar a etapa Vampire no shell compartilhado;
- implementar validações e configurações de powers/Merits;
- verificar pt-BR/en-US e desktop/mobile.

Critério de aceite: criar um exemplar válido de cada Clan, covenantless e cada Covenant; nenhum personagem inválido é salvo silenciosamente.

### Fase 5 - Ficha em uso

- implementar tabs, tracks, referências contextuais e ações explícitas de recurso;
- integrar Conditions, dano, equipamentos e responsive layout;
- aplicar tema Vampire fora e dentro da ficha pela registration.

Critério de aceite: todos os estados persistem entre sessões e nenhuma tab vaza horizontalmente em mobile.

### Fase 6 - Experiência

- implementar custos, requisitos, teacher/blood confirmation, grants e undo exato;
- incluir Beats e tabelas de custo específicas.

Critério de aceite: matriz automatizada testa cada tipo de compra, custo, bloqueio, avanço, refund e efeito derivado.

### Fase 7 - QA e publicação

Executar:

```text
npm run lint
npm run build
node --test --test-concurrency=1 tests/*.test.mjs
npx tsc --noEmit
git diff --check
```

Além disso:

- auditar manifest/chunks e requisições de catálogo por game line;
- testar criação, reload, export/import e exclusão segura;
- testar troca de idioma sem alteração mecânica;
- testar breakpoints de mobile e zoom desktop;
- comparar valores derivados e compras com fixtures extraídas do livro;
- executar smoke test das três game lines antes de commit/publicação.

## 12. Critérios de conclusão da primeira implementação

- `VtR` é uma game line registrada e lazy, não um branch mecânico no Core.
- Um personagem do livro básico pode ser criado sem campos obrigatórios ausentes.
- Clans, Covenants, Disciplines, Devotions, Blood Sorcery, Coils, Scales, Merits e Conditions do escopo estão auditados por fonte/página.
- Humanity, Touchstones, Banes, Blood Potency e Vitae seguem as regras descritas.
- Valores derivados reagem corretamente a Celerity, Resilience e Vigor.
- Progressão e refund de EXP são exatos e rastreáveis.
- Export/import do schema 2 preserva todas as escolhas.
- CtL e MtA não sofrem regressão nem carregam conteúdo Vampire.
- Desktop e mobile funcionam nos dois idiomas suportados.
- Não existe implementação de impressão Vampire escondida nesta entrega.

## 13. Decisões auditadas

1. **Speed e Vigor**

   Decisão: adotar a referência rápida e o efeito persistente. Speed usa Strength efetiva, incluindo Vigor.

2. **Custo de Scales**

   Decisão: adotar a regra detalhada da p. 155: 1 EXP com o Coil pré-requisito e 2 EXP sem ele.

3. **Profundidade de automação - cancelada**

   Decisão: descartar este recurso. Assim como nas demais game lines, o usuário lê as regras, calcula pools/modificadores, realiza as rolagens e registra manualmente os resultados. Não há fase futura de automação prevista neste plano.

4. **Blood Bonds e Vitae addiction**

   Decisão: incluir registros estruturados e editáveis na primeira ficha, sem automação narrativa.

5. **Tema visual**

   Decisão: criar identidade própria inspirada na paleta e nos ornamentos do livro, sem copiar a composição editorial.

6. **Impressão**

   Decisão: adiar para uma fase separada, após ficha e layout Mage/impressão Mage.

## 14. Observação sobre a referência visual

O arquivo anexado possui 321 páginas de PDF e termina com índice e contracapa. Embora o texto do livro mencione uma character sheet, a ficha oficial não está presente neste arquivo. Portanto:

- as regras mecânicas podem ser implementadas e auditadas integralmente com esta fonte;
- o tema pode usar a linguagem visual geral do livro;
- a composição de uma futura ficha impressa não deve ser apresentada como reprodução oficial sem uma referência adicional.

## 15. Autorização e limite vigente

O usuário auditou as decisões da seção 13, autorizou explicitamente a implementação e determinou que o commit seja produzido na branch `vampire-splat`. A impressão de Vampire continua fora desta entrega; sua implementação só poderá começar em uma fase posterior, depois do layout e da impressão de Mage.
