# Plano de implementação de Legacies

## Escopo desta auditoria

Este plano se baseia nas regras gerais de *Mage: The Awakening Second Edition*, páginas impressas 197–199. A página 200 inicia **The Eleventh Question**; as páginas seguintes apresentam esse exemplo e resumos de outras Legacies. Nenhuma implementação deve começar antes da aprovação deste documento.

O primeiro incremento deve implementar a estrutura e as regras gerais de Legacy. A inclusão de cada Legacy publicada no catálogo deve ser uma etapa de conteúdo separada, auditada contra suas respectivas fontes.

## Regras confirmadas na fonte

### Pré-requisitos para entrar em uma Legacy

Uma Legacy tem:

- um **Path de origem**;
- opcionalmente, uma **Order associada**;
- um **Legacy Ruling Arcanum**;
- requisitos adicionais, normalmente dois ou mais pontos em uma Skill;
- uma iniciação narrativa ou provação própria.

O personagem normalmente precisa pertencer ao Path ou à Order da Legacy. Um personagem que não cumpra nenhum desses vínculos ainda pode se qualificar se possuir uma Praxis que reproduza o primeiro Attainment e utilizar um dos Yantras da Legacy. Algumas Legacies possuem Attainments incomuns e não permitem essa alternativa.

Antes da iniciação, o personagem precisa de:

- Gnosis 2, ou Gnosis 3 para fundar uma Legacy;
- pelo menos dois pontos no futuro Legacy Ruling Arcanum;
- todos os requisitos adicionais definidos pela Legacy.

### Métodos de iniciação

| Método | Requisito | Custo | Observações |
| --- | --- | --- | --- |
| Fundar uma Legacy | Gnosis 3 e aprovação narrativa | 1 Arcane Experience | Exige criação conjunta com o Storyteller e exploração prática do Mystery. |
| Daimonomikon | Gnosis 2 e acesso ao livro | 1 Arcane Experience | O Daimonomikon precisa ensinar a iniciação da Legacy. |
| Estudo de alma ou Soul Stone | Gnosis 2 e acesso ao objeto/alma | 1 Arcane Experience | Normalmente constitui um crime grave dentro da sociedade Awakened. |
| Tutelage | Gnosis 2; tutor com o terceiro Attainment | 1 Experience comum **ou** 1 Arcane Experience | Tutor e aluno recebem 1 Arcane Beat. |

A iniciação normalmente requer uma semana de estudo e ritual dedicados ou um período maior de esforço parcial. Esse tempo é informação narrativa e não precisa de um contador automático.

### Benefícios de pertencer a uma Legacy

- acesso aos Yantras próprios da Legacy;
- acesso às Oblations próprias da Legacy;
- um novo Ruling Arcanum;
- o primeiro Legacy Attainment gratuitamente ao concluir a iniciação;
- vínculo simpático **Strong** entre tutor e aluno;
- um Arcane Beat para tutor e aluno após uma cena de interação mística, emocional ou íntima significativa, no máximo uma vez por capítulo;
- membros, Daimonomika e Soul Stones da mesma Legacy funcionam como Yantra simpático de +2 para membros dessa Legacy.

Esses três benefícios serão apresentados apenas como referência textual. A aplicação e o registro deles ficam fora das mecânicas automáticas do aplicativo.

As Oblations de Legacy podem ser realizadas fora de um Hallow. Nessa situação, o ganho diário de Mana fica limitado aos pontos no Legacy Ruling Arcanum.

Se o Legacy Ruling Arcanum já era Ruling para o personagem, cada novo ponto comprado nesse Arcanum concede 1 Arcane Experience.

### Legacy Attainments

| Rank | Legacy Ruling Arcanum mínimo | Gnosis mínimo, orthodox | Gnosis mínimo, novel |
| --- | ---: | ---: | ---: |
| Primeiro | 1 | 2 | 3 |
| Segundo | 2 | 2 | 3 |
| Terceiro | 3 | 4 | 5 |
| Quarto | 4 | 6 | 7 |
| Quinto | 5 | 8 | 9 |

O primeiro Attainment é recebido na iniciação. Os demais custam 1 Experience cada e precisam ser adquiridos em ordem.

- Um Attainment orthodox ensinado por tutor que já o conheça pode ser comprado com Experience comum ou Arcane Experience.
- Desenvolver um Attainment sem tutor exige Arcane Experience.
- Todo Attainment novel exige Arcane Experience e usa a coluna de Gnosis novel.
- Requisitos adicionais de Skill ou Merit continuam valendo.

Attainments são poderes estruturados, não Spells conhecidos. Eles normalmente:

- ativam com ação instantânea e sem rolagem;
- usam os fatores automáticos descritos na página 198;
- recebem apenas o Reach sem Paradox permitido pelo nível do Attainment;
- não podem receber Reach adicional;
- não podem ser aprimorados por tempo de conjuração maior;
- são imunes a Countermagic e Supernal Dispellation;
- nunca constituem Act of Hubris;
- reduzem custos de Mana superiores a um para apenas 1 Mana;
- não contam como magia óbvia para Sleepers e não provocam Dissonance, Quiescence ou Breaking Points;
- podem ter efeito opcional condicionado a outro Arcanum;
- seguem a regra de **Transient Stacking** quando combinados com Spells mantidas pelo próprio personagem.

Attainments incomuns podem usar sistemas próprios, mas ainda devem exigir o nível normal do Legacy Ruling Arcanum e oferecer poder comparável aos Attainments padrão.

## Ambiguidade que precisa de decisão

Há uma divergência interna na fonte sobre o reembolso de Praxis:

- na página 197, a Praxis usada para contornar Path/Order e reproduzir o primeiro Attainment é removida, concedendo **1 Experience comum e 1 Arcane Beat**;
- na página 199, a regra geral de Praxis Refund diz que uma Praxis internalizada como Attainment é removida, concedendo **1 Arcane Experience e 1 Arcane Beat**.

Proposta: manter os dois casos separados no modelo e aplicar a redação específica da página 197 somente à entrada alternativa por Praxis. Para qualquer outro Praxis Refund, aplicar a página 199. Essa decisão deve ser confirmada antes da implementação.

## Modelo de dados proposto

Criar um catálogo `LegacyDefinition` independente de Méritos e Spells:

```ts
type LegacyDefinition = {
  id: string;
  name: string;
  sourceId: string;
  source: string;
  page: number;
  originatingPaths: string[];
  associatedOrders: string[];
  rulingArcanum: string;
  prerequisites: LegacyPrerequisite[];
  praxisEntryAllowed: boolean;
  initiation: string;
  doctrine?: string;
  organization?: string;
  yantras: LegacyYantra[];
  oblations: string[];
  attainments: LegacyAttainmentDefinition[];
};
```

Cada Attainment deve possuir identidade estável e dados mecânicos próprios:

```ts
type LegacyAttainmentDefinition = {
  id: string;
  rank: 1 | 2 | 3 | 4 | 5;
  name: string;
  kind: "orthodox" | "novel";
  rulingArcanumRequirement: number;
  gnosisRequirement: number;
  additionalPrerequisites?: LegacyPrerequisite[];
  basedOnSpellId?: string;
  action: string;
  manaCost: number;
  description: string;
  optionalEffect?: {
    arcanum: string;
    requirement: number;
    description: string;
  };
};
```

Na ficha, `line_data.legacy` deixa de ser texto livre e passa a armazenar uma seleção estruturada, preservando compatibilidade de leitura com fichas antigas:

```ts
type LegacySelection = {
  legacyId: string;
  initiationMethod: "founding" | "daimonomikon" | "soul-study" | "tutelage";
  tutor?: string;
  joinedAt?: string;
  entryPraxisId?: string;
  attainmentIds: string[];
};
```

O texto legado existente deve ser migrado somente quando corresponder inequivocamente a uma definição. Valores desconhecidos devem permanecer preservados como texto de migração até o usuário escolher uma entrada do catálogo.

## Fluxo de interface proposto

### Aba Legacy

Adicionar uma aba própria à ficha de Mage, seguindo o padrão visual de Entitlement em Changeling:

1. estado inicial informando que o personagem ainda não possui Legacy;
2. botão **Select Legacy**;
3. catálogo pesquisável com filtros por Path, Order, Ruling Arcanum e fonte;
4. cartão expandível mostrando origem, requisitos, iniciação, Yantras, Oblations e Attainments;
5. opções indisponíveis visíveis, acompanhadas da razão exata, em vez de desaparecerem silenciosamente;
6. após a iniciação, resumo da Legacy, tutor, método de entrada, benefícios e lista progressiva de Attainments.

A seleção não deve reutilizar `MeritPicker`, porque Legacy não é Merit e possui progressão, custos e efeitos próprios.

### Iniciação com Experience

Adicionar **Legacy Initiation** às compras de Mage:

- validar Gnosis, Arcana, Path/Order ou Praxis e requisitos adicionais;
- permitir selecionar um método de iniciação realmente disponível;
- cobrar o tipo correto de Experience;
- conceder o primeiro Attainment;
- aplicar o eventual Praxis Refund;
- registrar tutor e conceder o Arcane Beat inicial quando o método for Tutelage;
- registrar toda a operação como uma única entrada reversível no histórico.

O undo precisa restaurar simultaneamente Experience, Arcane Experience, Arcane Beats, Praxis removida, Ruling Arcanum anterior e estado da Legacy.

### Compra de Attainments

Adicionar **Legacy Attainment** às compras de Mage somente depois da iniciação:

- mostrar apenas o próximo rank, pois a compra é sequencial;
- oferecer a escolha entre orthodox e novel quando a definição permitir;
- exigir tutor para pagamento flexível com Experience comum ou Arcane;
- exigir Arcane Experience para desenvolvimento sem tutor e para versões novel;
- validar Gnosis, Legacy Ruling Arcanum e requisitos adicionais;
- oferecer Praxis Refund quando uma Praxis conhecida corresponder ao Attainment;
- registrar compra e reembolso em uma única transação reversível.

### Exibição dos benefícios

- destacar o Legacy Ruling Arcanum na lista de Arcana com um contorno distinto dos Path Ruling Arcana;
- explicar no tooltip as duas origens quando um Arcanum for Ruling por Path e Legacy;
- mostrar Yantras e Oblations em seções colapsáveis;
- mostrar cada Attainment como cartão colapsável, com rank, requisitos, ativação, custo, efeito principal e efeito opcional;
- exibir regras globais de Attainments uma única vez em um painel de referência, evitando repeti-las em todos os cartões.

## Regras automáticas necessárias

1. Recalcular quais Arcana são Ruling usando Path e Legacy sem sobrescrever a origem de cada benefício.
2. Ao comprar um ponto no Legacy Ruling Arcanum que já era Ruling pelo Path, creditar 1 Arcane Experience.
3. Limitar Mana diária de Oblations fora de Hallow pelo nível do Legacy Ruling Arcanum.
4. Exibir, sem automatizar, o vínculo Strong, o Arcane Beat de interação e o Yantra simpático de +2.
5. Aplicar o primeiro Attainment gratuitamente e impedir sua compra duplicada.
6. Exigir ordem sequencial nos Attainments.
7. Tratar versões orthodox e novel como caminhos mutuamente exclusivos para cada rank, salvo regra específica da Legacy.
8. Preservar Attainments se a alma for removida ou substituída; a fonte esclarece que a Legacy altera Gnosis/identidade mágica, não a alma como objeto removível.

## Validação e testes planejados

- requisitos de Path, Order e entrada alternativa por Praxis;
- Gnosis 2 para iniciação normal e Gnosis 3 para fundação;
- todos os quatro métodos e seus tipos de custo;
- tutor obrigado a possuir o terceiro Attainment para iniciar um aluno;
- primeiro Attainment gratuito;
- tabela completa de Gnosis orthodox/novel;
- compra obrigatoriamente sequencial;
- pagamento flexível com tutor e exclusivamente Arcane sem tutor/novel;
- Praxis removida e reembolso correto nos dois contextos;
- novo Ruling Arcanum e recompensa quando ele já era Ruling;
- Arcane Beat de tutoria limitado por capítulo;
- persistência, edição, migração e undo transacional;
- apresentação e filtros em desktop e smartphone;
- nenhuma regressão nos fluxos atuais de Rotes, Praxes, Arcana ou Experience.

## Ordem de implementação sugerida

1. Aplicar as decisões aprovadas abaixo.
2. Criar tipos, catálogo vazio e migração compatível.
3. Implementar o motor puro de requisitos, iniciação, progressão e custos.
4. Adicionar testes unitários das regras gerais.
5. Implementar a aba Legacy e o catálogo.
6. Integrar iniciação e Attainments à compra por Experience e ao histórico reversível.
7. Implementar efeitos automáticos sobre Arcana, Experience, Arcane Experience e Arcane Beats.
8. Inserir **The Eleventh Question** como primeiro caso completo de validação.
9. Auditar e adicionar as demais Legacies fonte por fonte.

## Pontos para aprovação antes do código

1. **Aprovado:** aplicar separadamente o refund específico da página 197 e o refund geral da página 199.
2. **Aprovado:** a primeira entrega contém somente **The Eleventh Question**.
3. **Aprovado:** implementar primeiro o funcionamento de Legacy; o criador de Legacies ficará para uma etapa posterior.
4. **Aprovado:** o sublinhado de Legacy mostra **Join** em Gnosis 2 e **Join/Create** em Gnosis 3 ou mais. O clique abre uma aba **Legacy**, situada entre **Details** e **Combat**, sem exigir campos narrativos adicionais.
