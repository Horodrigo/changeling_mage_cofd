# Auditoria prévia: méritos de Mage

Data: 09/09/2026. Branch: `mages-redo`.

## Decisões aprovadas e estado atual

Esta auditoria foi escrita antes da implementação e permanece como registro do diagnóstico. A implementação da primeira fase agora está presente nesta branch com **58 méritos de Mage**: os 60 registros da tabela principal menos **Masque** e **Profane Tool**. **Egregore, Masque e Prelacy**, da tabela de Style Merits, também continuam adiados.

As decisões posteriores que substituem as pendências descritas abaixo são:

- a definição específica de `Mystery Cult Influence` em Mage prevalece sobre a definição geral de Core;
- `Shadow Self` exige `Shadow Name •••` e `Mind •`, conforme a errata indicada;
- `Infamous Mentor` exige vínculo com uma instância de `Mentor` de pontuação igual ou maior;
- `Occultation` e `Fame` são incompatíveis nos dois sentidos;
- `Awakened Status` identifica o domínio, e requisitos de Ordem consultam o status daquele domínio;
- os cinco méritos históricos ficam disponíveis aos Paths modernos correspondentes, com aviso no texto;
- `Cabal Theme` registra somente nome e descrição;
- apenas Ordens publicadas concedem High Speech, +1 Occult e três Rotes iniciais; esses benefícios continuam disponíveis normalmente por Experience quando aplicável;
- requisitos sobrenaturais usam o contexto do splat, incluindo Gnosis, Arcana, Path, Wyrd, Seeming e Kith.

## Proposta para revisão

Importar os **60 méritos da tabela “Merits, Mage (2nd Edition)”** da página offline. Adiar os três registros da tabela “Style Merits”: **Egregore, Masque e Prelacy**. Reutilizar o catálogo, os controles, a persistência e a progressão da ficha de Changeling, acrescentando o contexto e as configurações próprios de Mage.

Não basta acrescentar 60 objetos ao catálogo: faltam validações de Gnosis, Arcana, Ordem/status, limites relacionados a outros méritos e alguns controles de configuração. O trabalho deve incluir criação, ficha salva, aquisição e reembolso por Experience.

O escopo é a tabela específica de Mage. Não inclui reimportar todos os méritos universais da página Complete, implementar os efeitos de todas as magias, nem reconstruir os demais subsistemas de Mage.

## Evidências e limites

- Índice: `E:/Downloads/codexofdarkness.com.zip`, entrada `codexofdarkness.com/wiki/Mage%3A_the_Awakening_(Complete).html`. A tabela foi extraída até o início de `Style_Merits`: 60 linhas com nome, pontos, pré-requisito, descrição e fonte.
- Referência online correspondente: [Mage: the Awakening (Complete)](https://codexofdarkness.com/wiki/Mage:_the_Awakening_%28Complete%29). Foi usada a cópia offline.
- Convenções consultadas: [specific-merit-rules.md](specific-merit-rules.md). Inglês canônico; PDF como autoridade para regras; edição inline para escolha textual única; configuração estruturada somente quando há escolhas exigidas pelas regras; benefícios por ponto não equivalem automaticamente a um estilo.
- Análise da exibição por leitura dos componentes React. **Não foi realizada inspeção visual em navegador nesta etapa.**
- **Os PDFs ainda não foram conferidos regra a regra nesta auditoria.** Pontos e pré-requisitos no inventário final reproduzem o índice, inclusive suas inconsistências. A conferência dos livros integra o primeiro passo da implementação proposta; não se deve tratar as anotações abaixo como decisões definitivas de regras.

## Base já existente e o que aproveitar

| Área | Evidência no código | Consequência |
| --- | --- | --- |
| Catálogo compartilhado | `lib/merits.ts`: `MeritDefinition`, `RAW_MERITS`, `getMeritsForLine` | Já suporta `Core`, `CtL` e `MtA`, fonte/página, pré-requisito, pontos e benefícios por nível. Criar módulo de dados de Mage separado e integrá-lo aqui. |
| Estado do catálogo | `lib/merits-en.generated.ts`, `lib/merits-supplements-en.ts`, `lib/merits-book-of-seemings-en.ts` | Não identifiquei registros específicos `MtA` nesses conjuntos. Existe conteúdo compartilhado proveniente de Mage, como Advanced Library, e Mystery Cult Influence em Core. Não dizer que absolutamente nada foi implementado. |
| Criação | `app/character-builder.tsx`: `Merits`, `MeritConfigurationEditor` | Changeling e Mage usam o mesmo seletor: busca, categorias, fonte/página, pontos, remoção, UUID da instância e edição de configuração. |
| Ficha | `app/workspace.tsx`: `principalMerits`, `MeritConfigurationPanel`, `ExpandedMeritList` | Reutilizar linha principal, escolhas e detalhes expandidos. Uma única escolha não deve gerar um painel redundante. |
| Benefícios por nível | `lib/expanded-merits.ts` e `ExpandedMeritList` | A expansão depende de níveis/configurações. Mérito comum com níveis pode usar essa infraestrutura sem ser classificado como Style. |
| Dados das escolhas | `lib/merit-configurations.ts` | `configuration` aceita strings e listas de strings, normaliza dados e fornece título da instância. Novos campos precisam respeitar esse contrato ou ter serialização explícita. |
| Progressão | `lib/merit-progression.ts` | Preserva `instanceId`, `creationDots` e `experienceDots`; reabrir criação não deve apagar compras por XP. |
| Dados de Mage | `app/character-builder.tsx`, construção de `line_data` | Já existem `path`, `order`, `gnosis`, `arcana`, `shadow_name`, `nimbus` e `dedicated_tool`. Evitar uma segunda cópia divergente desses dados nas escolhas de méritos. |

## Lacunas concretas

1. **Pré-requisitos de Mage não têm contexto.** `MeritPrerequisiteContext` não possui Gnosis, Arcana, Path ou Ordem. Tanto o builder quanto o seletor de XP em `app/workspace.tsx` passam contexto centrado em Changeling. O parser termina aceitando trechos desconhecidos; isso não comprova elegibilidade.
2. **Expressões compostas precisam de estrutura.** Adamant Hand exige status E uma entre três Skills; Epiphany Stone exige (Dream OU Astral Adept) E Mind 2. O parser textual atual não é uma base segura para essas combinações. Proponho requisitos tipados para Mage, mantendo o texto original para apresentação e preservando a compatibilidade com o catálogo existente.
3. **Estado reativo incompleto na criação.** O `useMemo` do catálogo usa atributos/Skills, mas suas dependências são apenas `court`, `homebrews`, `line`, `merits`. Ao incorporar Mage, incluir todas as dependências efetivamente consultadas e usar os valores atuais do formulário. Separar resolução da definição de elegibilidade para não perder descrição/configuração de um mérito já selecionado que ficou inelegível.
4. **Precedência por linha é assimétrica.** `RAW_MERITS` atribui prioridade 2 somente a `CtL`, e 1 aos demais. Um futuro registro `MtA` homônimo de Core pode não substituir a versão compartilhada. Ajustar a seleção por linha ou conciliar explicitamente os homônimos, com teste de regressão para Changeling.
5. **Pontos abertos e descontínuos.** `UNBOUNDED_MERITS` contempla Contacts/Staff; não contempla Artifact, Enhanced Item, Imbued Ally, Imbued Item e Mana Battery. Artifact começa em 3, não em 1. `•• ou ••••` deve permitir apenas 2 e 4; não oferecer 3. Confirmar os limites reais nos PDFs antes de definir intervalos.
6. **Concessões automáticas são específicas de Changeling.** `synchronizeMeritGrants` retorna sem atuar quando a linha não é `CtL`. Não basta usar o editor existente e presumir que concessões de Mage funcionam. Separar o que é compartilhado do que depende da linha, sem conceder Mantle a magos.
7. **Repetibilidade não é inferível pelo nome.** As listas atuais não contêm as instâncias de Mage. Confirmar no PDF quais podem coexistir e quais agregam objetos/pessoas numa única compra. Toda compra e devolução deve identificar a instância certa.

## Casos que precisam de decisão explícita

| Caso | Proposta / pendência |
| --- | --- |
| Masque comum, 2 pontos | Manter a entrada no inventário dos 60, mas adiar sua configuração/benefícios dependentes do Style. Identificá-la como dependência pendente; não entregar como plenamente funcional nem inserir níveis do estilo nesta fase. Se a implementação só permitir méritos completos, adiar a aquisição dessa entrada junto com o estilo. |
| Profane Tool | Está entre os 60, mas exige Prelacy 2. Importar sua definição, sem remover o requisito para torná-lo comprável. Sem Prelacy válido, aquisição indisponível; uma eventual ficha antiga com esse mérito deve continuar legível. |
| Mystery Cult Influence | Já existe como Core, categoria `Social Styles`, em `lib/merits-supplements-en.ts`, com editor estruturado. Comparar com Mage p. 103; manter uma opção efetiva por linha e dados antigos. Não excluir só porque sua categoria atual contém “Styles”: os três adiados são os três da tabela de Mage. Auditar concessões, pois a sincronização atual não atua em MtA. |
| Shadow Self | O índice exige `Shadow Name •••••?`, enquanto o próprio índice limita Shadow Name a 3. Conferir Signs of Sorcery p. 95 antes de codificar. Não escolher um número por suposição. |
| Infamous Mentor | `≤ Mentor` é limite sobre a pontuação escolhida, não apenas exigência de possuir Mentor. Vincular à instância pertinente se houver vários Mentors; confirmar o texto do livro. |
| Occultation | `No Fame` precisa de proibição explícita. O parser atual reconhece `Cannot have`, e o reconhecimento de nomes de méritos pode interpretar Fame como requisito positivo. Verificar também a operação inversa: comprar Fame depois. |
| Awakened Status e méritos de Ordem | Distinguir pertencer à Ordem de possuir seus pontos de status. Mapear Arrow/Ladder/Guardian/Councillor Status ao domínio correto, sem considerar qualquer Status suficiente. Consilium também exige identificação. |
| Cinco méritos antigos | Fire Keeper, Sea’s Hunger, Sky’s Whispers, Spirit Warden e Trail Walker permanecem no catálogo. “Ancient” não é só escolher o Path moderno correspondente; falta representar/validar esse contexto histórico. Proposta: requisito histórico explícito, sem liberar por Path sozinho. |
| Cabal Theme | Requisito de toda a cabala é externo à ficha individual. Mostrar necessidade de confirmação de mesa, sem afirmar validação automática de outros personagens. |
| High Speech | Conferir aquisição/concessão na criação e relação com Ordem no básico antes de cobrar pontos ou conceder automaticamente. Não transpor a regra de Mantle para Mage. |

## Proposta de apresentação e configurações

O catálogo de Mage deve usar inicialmente uma categoria **Mage**, fonte/página individual e nomes/regras em inglês, conforme a base auditada. A ficha continua mostrando nome, pontos, pré-requisito, descrição e fonte. Disponibilidade de compra e existência no catálogo são conceitos separados.

Estas são hipóteses de modelagem a confirmar nos PDFs, não uma lista de campos já autorizados pelas regras:

- **Escolha única inline:** candidatos como Shadow Name, Inheritance, Broad Dedication e Techné. Reutilizar `shadow_name`/`dedicated_tool` quando representarem exatamente o mesmo dado; não presumir equivalência só pelo nome.
- **Vínculos e escolhas múltiplas:** Awakened Status, Destiny, Grimoire, Daimonomikon, Infamous Mentor e Order Archive. Persistir apenas informação necessária à regra e à identificação da instância.
- **Objetos mágicos:** Artifact, Enhanced Item, Enriched Item, Imbued Item, Perfected Item, Mana Battery e Soul Stone podem exigir detalhes diferentes. Não copiar o modelo de Token com Glamour/Catch/Drawback para objetos de Mage. Verificar se o livro exige seleção de magias, capacidade ou características antes de criar controles.
- **Aliados/entidades:** Familiar, Imbued Ally e Supernal Watcher exigem auditoria de representação. A ficha de Fae Mount é uma referência de integração, não uma regra reutilizável. Não prometer um subsistema completo de entidades apenas com a importação do mérito.
- **Efeitos situacionais:** exibir resumo preciso, custos e condições de uso; automatizar somente efeitos determinísticos cujo contexto exista. Não aplicar um bônus de Nimbus, Yantra ou Clash of Wills globalmente a toda rolagem.

## Sequência de implementação proposta

1. Conferir as páginas dos quatro livros que abastecem esta tabela: Mage básico, Signs of Sorcery, Dark Eras e Dark Eras 2. Resolver inconsistências, repetibilidade, pontos, concessões e campos obrigatórios. Registrar decisões de fonte.
2. Criar módulo de méritos de Mage em inglês com IDs estáveis, integrar fontes e catálogo; conciliar Mystery Cult Influence e respeitar a exclusão dos três estilos.
3. Acrescentar requisitos de Mage e contexto atual aos fluxos de criação e XP; tratar dependências externas/históricas sem silenciosamente aceitá-las.
4. Integrar configurações e apresentação com os componentes existentes; preservar informações de fichas antigas e evitar duplicação de campos.
5. Implementar apenas as concessões/efeitos determinados pela auditoria, com remoção/reembolso consistente. Os demais efeitos ficam descritos e operados em mesa, claramente identificados.
6. Verificar criação, compra, alteração, reembolso e recarga da ficha; inspecionar visualmente Mage e Changeling em desktop e tela estreita.

## Critérios de aceite e testes futuros

- Cobertura das 60 entradas reconciliada com este inventário; três Styles ausentes como novas compras. Masque comum e Profane Tool com estado de dependência explícito.
- Mage recebe méritos próprios + Core; Changeling não recebe inadvertidamente os méritos sobrenaturais de Mage.
- Casos positivos e negativos para Gnosis, Arcana, status de Ordem, requisitos AND/OR, incompatibilidade Fame/Occultation e limite de Infamous Mentor.
- Valores descontínuos e abertos corretos, orçamento compartilhado com Gnosis preservado, status recalculado ao editar atributos e Arcana.
- Compras/reembolsos atingem a instância certa; salvar/recarregar conserva configuração e origem dos pontos. Concessões não duplicam ao sincronizar repetidamente.
- Regressão dirigida de Mantle/Court Goodwill, configurações e progressão de Changeling. Seguir o padrão dos testes existentes em `tests/creation-eligibility.test.mjs` e `tests/experience-persistence.test.mjs`.
- Exibição sem editor duplicado, referência bibliográfica visível e detalhes por nível limitados aos pontos adquiridos.

Não foram executados testes/build: esta entrega altera somente documentação. A implementação fica aguardando a revisão do raciocínio solicitada pelo usuário.

## Inventário literal do índice offline

Os requisitos abaixo ainda precisam da conferência nos PDFs. `—` indica célula vazia ou traço no índice, não confirmação de ausência de restrições no livro.

| Mérito | Pontos no índice | Pré-requisito no índice | Fonte/página |
| --- | --- | --- | --- |
| Adamant Hand | •• | Arrow Status •, Athletics or Brawl or Weaponry ••• | MTA 2e 99 |
| Artifact | •••+ | — | MTA 2e 99 |
| Astral Adept | ••• | — | MTA 2e 100 |
| Astral Intruder | ••• | Astral Adept, Resolve ••• | SoS 91 |
| Awakened Status | • to ••••• | — | MTA 2e 100 |
| Between the Ticks | •• | Wits •••, Time • | MTA 2e 100 |
| Broad Dedication | • | Prime • | SoS 57 |
| Cabal Theme | • | Must be taken by entire cabal | MTA 2e 100 |
| Cognoscente | •• | Prime •••, Academics or Occult •• | SoS 87 |
| Daimonomikon | • to ••••• | — | SoS 87 |
| Destiny | • to ••••• | — | MTA 2e 100 |
| Dominant Soul | • to ••••• | Composure ••• | SoS 91 |
| Dream | • to ••••• | Wits •••, Composure ••• | MTA 2e 101 |
| Echo Chamber | •••• | Empathy •• | SoS 91 |
| Enhanced Item | •+ | — | MTA 2e 101 |
| Enriched Item | •• or •••• | — | SoS 76 |
| Epiphany Stone | •••• | Dream or Astral Adept, Mind •• | SoS 91 |
| Familiar | •• or •••• | — | MTA 2e 101 |
| Fast Spells | •• | Firearms ••, Time • | MTA 2e 101 |
| Fire Keeper | • | Ancient Obrimos | DE 50 |
| Fluent High Speech | ••• | Awakened, Presence ••••, Expression••• | SoS 26 |
| Grimoire | • to ••••• | — | MTA 2e 101 |
| Hidden High Speech | • | Awakened, Manipulation •••, Expression ••• | SoS 26 |
| High Speech | • | — | MTA 2e 102 |
| Imbued Ally | •+ | — | SoS 76 |
| Imbued Item | •+ | — | MTA 2e 102 |
| Imposing Nimbus | ••• | — | SoS 95 |
| Infamous Mentor | • to ••••• | ≤ Mentor | MTA 2e 102 |
| Inheritance | •• | Fame • | SoS 57 |
| Keen Periphery | •• | Wits ••• | SoS 26 |
| Legacy Pedagogue | • | Prime •••, Gnosis ••• | SoS 87 |
| Lex Magica | •• | Ladder Status • | MTA 2e 102 |
| Mana Battery | •+ | — | SoS 77 |
| Mana Sensitivity | • | Wits •••, Prime • | MTA 2e 102 |
| Masque | •• | Guardian Status • | MTA 2e 102 |
| Mystery Cult Influence | ••• to ••••• | — | MTA 2e 103 |
| Occultation | • to ••• | No Fame | MTA 2e 103 |
| Order Archive | • to ••••• | Consilium/Order Status • | SoS 97 |
| Perfected Item | •• | — | SoS 77 |
| Persistent Nimbus | • | — | SoS 95 |
| Piercing Glance | •• or •••• | Gnosis •• | SoS 26 |
| Plunder Mana | •• | Prime •, Resolve •• | DE2 300 |
| Potent Nimbus | • or •• | — | MTA 2e 103 |
| Potent Soul | ••• | Awakened, Presence ••• | SoS 91 |
| Potent Resonance | •• | Gnosis ••• | MTA 2e 103 |
| Profane Tool | • | Prelacy •• | SoS 125 |
| Profligate Dedication | •• | — | SoS 57 |
| Sea's Hunger | • | Ancient Moros | DE 49 |
| Second-Person High Speech | ••• | Awakened, Presence •••, Expression •••, High Speech | SoS 26 |
| Shadow Name | • to ••• | — | MTA 2e 104 |
| Shadow Self | •• | Shadow Name •••••?, Mind • | SoS 95 |
| Sky's Whispers | • | Ancient Acanthus | DE 48 |
| Soul Dealer | • to ••••• | Streetwise ••• | SoS 91 |
| Soul Stone | • or •• | — | SoS 92 |
| Spirit Warden | •• | Ancient Thyrsus | DE 50 |
| Stalwart Soul | • or •• | Composure ••• | SoS 92 |
| Supernal Taxonomy | •• | Intelligence ••, Occult ••• | SoS 27 |
| Supernal Watcher | •• or •••• | — | SoS 43 |
| Techné | •• | Councillor Status • | MTA 2e 104 |
| Trail Walker | •• | Ancient Mastigos | DE 49 |
