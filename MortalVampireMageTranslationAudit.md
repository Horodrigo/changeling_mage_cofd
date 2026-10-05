# Auditoria de tradução — Mortal, Vampire e Mage

Atualização: **2026-10-04**. **Meta ativa:** prioridade 0, localização das etapas 1–2 e correções aprovadas de Méritos Core implementadas e verificadas; etapa 3 em execução; etapa 4 pendente.

## Escopo e ordem

- [x] **0 — Identidade e experiência (X01):** compras de Méritos usam definição e instância canônicas; histórico semântico é localizado na exibição. Estornos verificam identidade, custo e alocações. Falhas preservam ficha, saldo e recibo; histórico opaco não autoriza inferência por texto nem restauração de snapshots.
- [x] **0 — Homônimos e consolidação:** Conditions/Tilts recebem qualificador de linha quando há colisão; Méritos homônimos, quando os efeitos diferem. IDs e efeitos permanecem distintos. Decisões anteriores estão consolidadas aqui; relatos concluídos e anexos duplicados foram removidos a pedido do usuário.
- [x] **1 — Mortals/Core:** 34 Conditions e 35 Tilts compartilhados com apresentação completa e integração EN/PT. Os 202 Méritos Core já têm PT; uniformizações continuam permitidas.
- [x] **2 — Interface:** mensagens dinâmicas, controles, Homebrew e troca EN/PT implementados. Conteúdo editorial dos catálogos ainda pendentes pertence às etapas seguintes.
- [ ] **3 — Vampire:** concluir Bloodlines, Méritos, poderes, Conditions e presets.
- [ ] **4 — Mage:** Méritos, Spells, organizações, Legacies/Attainments e Conditions.

Desktop/Mobile. **Impressão, PDF e blank fora do escopo**, inclusive Numina do Familiar na impressão. Oficial e Homebrew são traduzidos em conjunto, preservando sua origem. Não traduzir nomes próprios, títulos de livros, IDs nem textos autorais; localizar títulos descritivos e consultar dúvidas quando necessário.

Apresentação por ID, separada do canônico usado pelas regras e parsers. Trocar idioma não reescreve personagens, concessões, XP ou recibos. Core fornece mecanismos; cada linha possui suas mecânicas. Os detalhes de identidade, bridges schema-2 e ownership implementados estão em `AGENTS.md` e nos testes, sem duplicação retrospectiva neste arquivo.

Trabalhar em lotes pequenos, verificar EN → PT → EN e gates proporcionais, registrar dúvidas e criar commits locais coerentes. Concluir a meta apenas após implementar e verificar todo o escopo. Smoke de navegador é realizado pelo usuário. `WerewolfAudit.md` permanece porque contém decisões e trabalho adiado; esta meta não reabre as decisões de Contracts Waters of Lethe, Enveloping Sands e Whisperwind.

## Backlog atual

As contagens incluem suplementos, Homebrew e errata, sem pressupor elegibilidade universal ou deduplicar regras homônimas. Inglês canônico isolado não indica ausência de apresentação PT.

| Área | Inventário | Trabalho restante |
| --- | --- | --- |
| Vampire — referências | 16 Clans, 23 Covenants, 27 Anchors, 56 Bloodlines | Clans/Covenants/Anchors completos; 56 Bloodlines com textos PT (14 oficiais, 42 Homebrew); Desventurados aprovado e aplicado |
| V04 — Méritos | 403 (154 não Homebrew, 249 Homebrew), 80 níveis; nove erratas incluídas | Apresentações completas e nove erratas ativadas verificadas; correções de fonte ainda sem resposta permanecem separadas abaixo |
| V05 — Poderes | 546 registros, 140 níveis internos | 18 Disciplinas e 75 níveis com PT verificado. Restam 528 registros e 65 níveis |
| V06 — Conditions | 66, incluindo 19 Homebrew e duas erratas | Nome, descrição, resolução e Ato, quando aplicáveis |
| V06 — Textos predefinidos | 42 Breaking Points; seis Shadow Cults | Localizar rótulos e benefícios predefinidos; preservar configurações e Specialties autorais |
| G01 — Spells | 360 | Nomes descritivos, resumos, descrições e metadados; integração separada do parser |
| G02 — Méritos | 71 (61 principais, dez suplementares), 31 níveis | Nome, requisitos, descrição e níveis |
| G03 — Organizações | 17 Orders, 44 Factions, 12 Ministries | 11 Orders sem descrição PT; Factions/Tool Yantras e Ministries/Patron Exarchs |
| G04 — Legacies | 16, 43 Attainments | Nomes, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções |
| G05 — Conditions | 24 | Nome, descrição, resolução e Ato; nomes de Húbris já vinculados ao catálogo por ID |

### Vampire — detalhes de execução

Catálogos em `public/game-lines/vampire/data/`. Bloodlines possuem uma visão de leitura própria usada na página, prévia de ingresso, Maldição da ficha e Homebrew. Ingresso, concessão e remoção continuam recebendo definições canônicas. Todos os 56 registros possuem os campos PT aplicáveis; Desventurados é a apresentação aprovada de Star-Crossed.

Méritos: `merits-vampire-pt` em `merits-pt.json` é carregado junto do catálogo canônico pelo grupo próprio de Vampire, usando o mecanismo de apresentação existente. Criação, XP, ficha e Homebrew recebem o mesmo snapshot. A ficha expandida apresenta requisitos, descrição e níveis adquiridos; nenhuma alocação é criada por essa exibição. As antigas traduções parciais oficiais e referências Brawl/Composure/Kindred/Covenant foram revistas; não deduzir elegibilidade por títulos.

| Família de poderes | Registros | Níveis internos |
| --- | ---: | ---: |
| Disciplines | 23 | 110 |
| Ritual Disciplines | 5 | — |
| Devotions | 356 | — |
| Lashes | 2 | — |
| Crúac Rites | 76 | — |
| Theban Miracles | 32 | — |
| Kimiya Formulae | 5 | — |
| Therion Sacrileges | 7 | — |
| Gilded Invocations | 10 | — |
| Detournements | 5 | — |
| Coils | 6 | 30 |
| Scales | 19 | — |

Poderes e níveis usam `presentationPt` estático e a visão de leitura própria `power-presentation.ts`; regras continuam recebendo os campos canônicos. 18 Disciplinas apresentadas: as dez básicas Animalismo, Auspícios, Dominação, Majestade, Pesadelo, Ofuscação, Metamorfose, Celeridade, Resiliência e Ímpeto (Vampire pp. 126–142), Verdades de Erebus (Better Feared pp. 52–53), Crochan (Dark Eras 2 pp. 119–120), Grilhão de Sangue e Surto Elétrico (False Gods pp. 24 e 36), Interface (Strange Shades pp. 21–23), Spiritus Sancti (Wild Hunt pp. 50–51), Caquexia (Dark Eras Companion pp. 112–113) e Sinal Morto (Night Horrors: Spilled Blood pp. 23–24), revisadas visualmente. Nomes descritivos acompanham as referências de Bloodlines já apresentadas; nomes próprios e Spiritus Sancti permanecem originais. Arrepio/Face da Fera corrigem antigas ocorrências de Besta; O Grande Delírio distingue a crença falsa de uma ilusão sensorial. Ímpeto continua distinto de Vigor; Graduação, Numina e Fraqueza de entidades efêmeras seguem o léxico vigente. Pele da Fera e Aspecto Sobrenatural reutilizam o léxico vigente; Oubliette recebe o título descritivo Masmorra do Esquecimento, conservando sua entrada canônica. Os três modificadores de Toque da Sombra aparecem também no seletor de XP; a referência Homebrew dispõe do mesmo campo.

Referências para Conditions: Sated → **Saciado**, Ecstatic → **Extático**, Confused → **Confuso**, Dominated → **Dominado**, Mesmerized → **Mesmerizado**, Enthralled → **Cativado**, Delusional → **Delirante**, Frightened → **Assustado**, Scarred → **Marcado por Cicatrizes**, Materialized → **Materializado**. Steadfast/Broken usam **Resoluto/Quebrado** do Core; False Memories conserva **Falsas Memórias**; Charmed usa **Encantado(Membro)** e Swooning/Swooned, **Enamorado**. Radio Sickness recebe a referência **Doença Radiofônica**; Shaken conserva **Abalado** do Core. Power Surge é apresentado como **Sobrecarga Elétrica** na referência de Interface; não há entrada desse Tilt nos catálogos atuais e nenhuma regra/ID foi acrescentada.

Traduzir resumo, efeito, custo, parada, ação, duração, resultados, modificadores, procedimento, Sacrament, requisitos e opções **quando existentes**; não inventar conteúdo ausente. Breaking Points estão em `game-lines/vampire/catalog-data/detachment.json` (41 entradas e `vastDynastyEmbrace`); presets em `shadow-cults.json`.

### Mage — detalhes de execução

Spells: Death 46; Fate 30; Forces 38; Life 29; Matter 32; Mind 45; Prime 50; Space 29; Spirit 36; Time 25. Dados em `public/game-lines/mage/data/spells/`.

Apresentar **Práticas, Fator Primário, Resistência, Alcance e Adicionar Arcana** quando aplicáveis. `spellReach` em `builder-view.tsx` interpreta `Reach:`/`Add Arcanum`: manter sua entrada inglesa canônica e localizar apenas a apresentação. Títulos de Práxis publicadas acompanham Spells; nomes autorais permanecem intactos.

Orders sem descrição PT: Jnanashakti, Mahanizrayani, Samashti, Vajrastra, Ajivaki, Arcadian Mysteries, Karpani, Mantra Sadhaki, Weret-Hekau, Company of the Codex e Bay City Marshals. Os cinco Paths são nomes próprios. Os 20 Utility Attainments já são bilíngues e estão no dicionário Mage.

Legacies: The Eleventh Question, Chronologue, Engineers of the System, House of Ariadne, Perfected Adepts, Nighthawks, Tyrian Archons, Shapers of the Invisible, Logophages, Reality Stalkers, Stone Scribes, Illumined Path, Intendants of the Building, Nagaraja, Keepers of the Covenant e Kitchen Alchemists. Dados em `game-lines/mage/catalog-data/legacies*.json`; não somar novamente Méritos Mage distribuídos como Core.

## Léxico vigente

Decisões atuais prevalecem sobre propostas antigas. As traduções já concluídas de itens individuais permanecem nos catálogos/dicionários; não precisam de um segundo inventário histórico aqui.

- Seeming → **Feição**; Mien → **Semblante Feérico**. Substituem as formas anteriores que confundiam os dois conceitos.
- True Fae → **Feé Verdadeiro**; Changeling e Fae permanecem no original. Nomes da língua Uratha permanecem originais em todos os idiomas.
- Motley → **Retalho**; Freehold → **Povoado**; Kith → **Frátria**; Hollow → **Vão**.
- Huntsman/Huntsmen → **Monteiro/Monteiros**, distintos de Hunter → **Caçador**.
- Needle → **Agulha**; Thread → **Linha**; Durance → **Cativeiro**; Arcadia → **Arcádia**; Bargain → **Barganha**; Bastion → **Bastião**; Wild Hunt → **Caçada Selvagem**; Keeper → **Carcereiro**.
- Contract → **Contrato**; Goblin Contract → **Contrato Goblin**; Court → **Corte**; Spring/Winter/Summer/Autumn Court → **Corte da Primavera/do Inverno/do Verão/do Outono**.
- Privateer → **Corsário**; Goblin Debt → **Débito Goblin**; Bedlam → **Desvario**; Fetch → **Duplo**; Echoes → **Ecos**; Thorns → **Espinhos**; Dream Roads → **Estradas dos Sonhos**; Wyrd → **Fado**; Hedge Ghosts → **Fantasmas da Sebe**; Faerie → **Feéria**.
- Frailty → **Fragilidade**; Goblin Fruit → **Fruta Goblin**; Glamour, Goblin e Hobgoblin permanecem no original; Icon → **Ícone**; Oath → **Juramento**; Loyalist → **Legalista**; True Loyalist → **Legalista Verdadeiro**; Lord → **Lorde**.
- Clarity → **Lucidez**; Mantle → **Manto**; Mask (Changeling) → **Mascarilha**; Mask (Vampire) → **Máscara**; Goblin Market → **Mercado Goblin**; Hedge Shaping/Hedgespinning → **Tecer a Sebe**; Oneiromancy → **Oniromancia**; Oneiropomp → **Oniropompo**; Others → **Outros**.
- Token → **Penhor**; Lost → **Perdido**; Portaling → **Passagem**; Promise → **Promessa**; Oathbreaker → **Quebrador de Juramento**; Bridge-Burner → **Queima-Pontes**; Goblin Queen/King → **Rainha/Rei dos Goblins**.
- Regalia permanece **Regalia**; Renegade → **Renunciado**; Hedge → **Sebe**; Sealing → **Selagem**; Dreamweaving → **Tecelagem de Sonhos**; Kenning → **Tino**; Title → **Título**; Fae-Touched → **Tocado por Fae**; Touchstone e trod permanecem no original.
- Darkling/Fairest/Wizened → **Trevoso/Belíssimo/Mirrado**. Não exibir pares de gênero na interface; respeitar concordância da prosa em português.
- Golden Hairnettle → **Erva de Cachinhos Dourados**; IOU → **Nota Promissória**.
- Dauphines of Wayward Children → **Delfinas das Crianças Perdidas**; Sophomore → **Noviça**; Chaperone → **Preceptora**; Dowager → **Matriarca**.
- Catch → **Gatilho**; Loophole → **Brecha**; Rules Lawyer → **Advogado de Regras**.
- Cowed → **Acovardado**; Berserk → **Frenético**; Fatigued → **Fatigado**.
- Primal Urge → **Instinto Primitivo**; Lunacy → **Lunagem**; Wolf-Blooded → **Parente**.
- Nas entidades efêmeras de todas as linhas: Ban → **Proibição**; Bane → **Fraqueza**. Não aplicar automaticamente ao Bane de Clan/Bloodline ou ao papel homônimo de Changeling. A grafia “Poribição” foi corrigida pelo usuário.
- Mystery Cult Initiation → **Iniciação em Culto dos Mistérios**, uniformização escolhida explicitamente pelo usuário em **2026-10-04** para catálogo, referências e interface. Substitui a forma singular anterior desse Mérito nos anexos; não altera sua identidade, concessões ou níveis.
- Melee e Weaponry designam a mesma Perícia, por decisão explícita de **2026-10-04**: apresentar o rótulo da ficha, **Weaponry** em EN e **Armas Brancas** em PT, quando esses termos designarem a Perícia. Não criar outro ID de Perícia.
- Numina permanece **Numina**. Nomes de Perícias seguem o dicionário atual, incluindo **Empatia com Animais**; não usar propostas antigas para substituir rótulos vigentes.
- Chapter e session são equivalentes em todos os conflitos, por decisão ampliada de 2026-10-04. Apresentar **sessão**, conservando limites, IDs e a entrada canônica dos parsers.
- Escolhas explícitas de 2026-10-04: oddments → **esquisitices**; Dread Power → **Poder Terrível**; Fighting Finesse → **Destreza em Combate**; Shiv → **Estilete**; Fast-Talking → **Engabelar**; Mastermind → **Topo da Pirâmide**. Mastermind nomeia o quinto nível dos registros de culto e não concede o Mérito Mentor por si só.

| Contexto | Inglês → apresentação PT |
| --- | --- |
| Geral | Beat → Ato; Arcane Beat → Ato Arcano; Breaking Point → Ponto de Ruptura; Core (grupo de compras) → Básico |
| Mage | Hubris → Húbris; Attainment → Aperfeiçoamento; Utility Attainments → Aperfeiçoamentos Utilitários; Inured spell → Feitiço Habituado; Nameless Order → Ordem sem Nome |
| Mage | Enlightened/Understanding/Falling/Mad → Iluminado/Consciente/Caído/Louco; Doom → Sina (distinto de Destiny → Destino); Masque → Máscara; Fettered vessel → Receptáculo vinculado |
| Mage | Raptor → Rapina; Profane Form: Robe → Manto; nomes próprios Daimonomikon, Techné e Demesne preservados |
| Vampire | Covenant → Coalizão; Covenantless → Sem Coalizão; Kindred → Membros, ou vampiro em prosa sem referência ao grupo social; Dirge → Lamento |
| Vampire | Bane de Clan/Bloodline → Maldição; Blood Potency → Potência de Sangue; Daysleep → Sono Diurno; Embrace → Abraço; Lashing Out → Incitar a Fera |
| Vampire | Pack/Pack Alpha → Matilha/Alfa da Matilha; Lashes of Blood Tether → Açoites do Grilhão de Sangue; Feeding Grounds → Campo de Caça; Coil → Espiral |
| Vampire | Predatory Aspect/Unnatural Aspect → Aspecto Predatório/Aspecto Sobrenatural; Simplified Hollow → Vazio Simplificado; Embodiments → Encarnações |
| Entidades efêmeras | Claimed/Possessed/Urged/Open/Controlled → Reivindicado/Possuído/Instigado/Aberto/Controlado; God-Machine → Deus-Máquina; Twilight → Crepúsculo |

### Méritos homônimos — decisão preservada

Os cinco pares com efeitos distintos já aprovados recebem qualificadores de linha, preservando suas identidades. A tabela registra as fontes cadastradas da comparação anterior; não alega nova revisão de PDFs.

| Nome canônico | Linhas e fontes cadastradas |
| --- | --- |
| Acute Senses | CtL — Changeling the Lost p. 111; VtR — Vampire: The Requiem Second Edition p. 109 |
| Noblesse Oblige | CtL — Changeling the Lost p. 119; VtR — Secrets of the Covenants p. 188 |
| Touchstone | CtL — Changeling the Lost p. 120; VtR — Vampire: The Requiem Second Edition p. 115 |
| Friends in Low Places | CtL Homebrew — Book of Courts p. 63; VtR — Guide to the Night p. 124 |
| Occultation | MtA — Mage the Awakening p. 103; VtR Homebrew — Strange Shades: Mekhet p. 92 |

### Referências já localizadas para os próximos catálogos

- Vampire — referências de Méritos: Máscara Inflexível segue Mask de Vampire → Máscara; Ímpeto é a Disciplina Vigor, distinta do Atributo Vigor/Stamina; Metamorfose, Pesadelo e Ofuscação reutilizam as apresentações existentes. Maldição Potente, Encantado(Membro) e Letárgico orientam as respectivas Conditions, preservando seus IDs e efeitos.

- Vampire — títulos de Méritos: Notário; Visões Oníricas; Necrópole; Guardiões das Trevas. Preservar Correio da Forca e O Conto de Shahrayad; Friends in Low Places de Vampire usa Amigos em Lugares Baixos com o qualificador Membro. Swooned no texto de Lingering Dreams foi apresentado como Enamorado, sem vincular ou alterar IDs por essa variante textual.

- Vampire Conditions: Semente de Sua Divindade e Reforço Carthiano acompanham as referências das erratas, sem criar IDs por nome. Bestial, Competitivo, Lascivo, Dependente, Mesmerizado, Falsas Memórias, Lânguido, Letárgico, Tentado, Distraído e Convite. Subserviente traduz Subservient na referência de Kerberos; Intoxicado e Assustado traduzem Intoxicated e Frightened nas referências de Kingjan, sem criar identidade por nome. Lânguido (Languid) e Letárgico (Lethargic) permanecem distintos. Jaded/Addiction/Swooning/Drained ainda devem acompanhar seus próprios registros.
- Mage Conditions: Megalomaniacal/Rampant ainda aguardam seu catálogo; Húbris resolve seus IDs. Não criar uma tabela mecânica paralela.
- Vampire referências carthianas: Regra de Um Só traduz Rule of One; Conheço uma Pessoa, Exército de Um Só, Coda contra a Feitiçaria e Experimentador de Devoções acompanham as apresentações existentes. Bloodroots, PPI e Janus permanecem no original.
- Vampire referências de Agony & Ecstasy: Poção da Bruxa traduz Witch's Brew; Guardião traduz Warden em Sombra do Mestre; Dedo Vermelho traduz Red Thumb; Abrir o Vazio traduz Opening the Void. Essas apresentações não criam identidades nem efeitos por nome.
- Vampire poderes/Méritos: Meada de Clotho; Amigos no Exterior; Fome Intensificada; Coração Sombrio; Feudo Amaldiçoado; Fama (Avançada); Escola de Etiqueta; Crúac Banshee; Ouvidos para a Fera; O Veículo; Cerne (Heartwood de Yarilo, distinto da categoria Crux de Penhores); Unção; As Delícias; Riqueza Herdada; Verdades de Erebus; Lições de Erebus; Conheça Seu Público; Grilhão de Sangue; Sangue dos Relutantes; Sem Presas; Surto Elétrico; Parentesco Insetoide; Mente de Colmeia; Semblante Perdido; Apofenia; Pareidolia; Dementação. Cirurgia Arthmoic conserva a grafia técnica cadastrada.
- Coalizões: Evolução Triádica, Juramentos do Invictus, Código do Carrasco, O Conto de Shahrayad, Fachada, Cisma, Cripta/Saída, Atendente da Sepultura, Explorador Sagrado, Tocado por Mary e Visão Arcana. Detournement, Therion, Kimiya e Manteia mantêm a forma cadastrada.
- Referências para próximos catálogos: Embrocação traduz Embrocation, distinta de Anointment → Unção; não presume identidade ou equivalência de efeitos. Bode Expiatório também nomeia o Lamento Whipping Boy. Occultation recebe Ocultação na apresentação de Vampire; Mage deve acompanhar o título com seu próprio qualificador, preservando as duas definições distintas.
- Risen Beast → **Fera Desperta** na referência de A Rendição Rubra. The Wild Hunt pp. 87 e 110 revisado visualmente: o requisito remete à Condição da Fera consciente, sem acrescentar seus efeitos ao Mérito nem criar uma identidade pelo título traduzido.
- Bloodlines: Cavaleiros sem Terra traduz Hedge Knights no contexto medieval de Bron; Purezas traduz Purities. Electrum, Udjat, Namus-Ur, Lobos de Sangre, Morrigans, Mystikos, Spiritus Sancti, Sublunario, Családtag, Lithopedia, Strix e draugr preservados.
- Numina do Familiar já apresentada: Fascínio, Rajada, Enlouquecer, Drenar, Aura Emocional, Decadência Entrópica, Incendiário, Alucinação, Implantar Missão, Chave Canhota, Mascarilha Mortal, Desbravador, Regenerar, Buscar, Velocidade, Sinal, Inabalável e Telecinese. Propostas posteriores à confirmação histórica, já aplicadas; não equivalem à aprovação de nomes homônimos em outras linhas.

## Decisões respondidas pelo usuário — 2026-10-04

Estes pontos **já receberam resposta**. As mudanças abaixo ainda precisam de aplicação e gates próprios, salvo os estados explícitos de concluído ou de conservação. Não representam perguntas abertas nem uma nova revisão de PDFs. As correções mecânicas solicitadas pelo usuário são trabalho adicional autorizado; a tradução isolada continua preservando as demais regras.

| Registro / fonte | Decisão recebida | Aplicação / verificação |
| --- | --- | --- |
| Star-Crossed | **Desventurados**. | Aplicado à Bloodline e à categoria Vampire; gates EN/PT aprovados. IDs e inglês canônico preservados. |
| Mystery Cult Influence | Fonte: **Mage: The Awakening p. 103**. | Mage 2e p. 103 revisado visualmente. Fonte e página do registro compartilhado corrigidas; o ID `core-2ed:mystery-cult-influence`, seu `sourceId` histórico, classificação, requisitos e efeitos permanecem intactos. O registro exclusivo de Mage já coincide com a fonte. 72/72 testes de identidades/concessões/Legacies/catálogos e build aprovados. |
| Nighthawks — Nameless and Accursed p. 29 | **Prime 2 e Larceny 3**. | Revisão visual confirma o segundo Aperfeiçoamento, Under Cover of Night: o catálogo já exige ambos nos requisitos estruturados. Conservado. A iniciação/primeiro Aperfeiçoamento mantém Larceny 2, conforme a mesma página; a decisão sobre o segundo não altera a entrada. A apresentação PT completa continua na etapa Mage. |
| Tyrian Archons — Nameless and Accursed p. 35 | **OK** para o comportamento auditado de Profane Tool (Scepters). | Conservar o requisito estruturado atual; nenhuma correção de configuração solicitada. |
| Vardyvle / Penumbrae | **False Memory(ies) é a mesma Condition**, VtR p. 303. | Vardyvle agora usa **False Memories / Falsas Memórias**, como Penumbrae, referindo-se à Condition existente `false-memories`. Apenas a referência textual foi uniformizada: IDs, duração e efeito preservados. Integração EN/PT/EN de todas as Bloodlines aprovada; a localização completa do catálogo Vampire de Conditions continua na etapa 3. |
| Area of Expertise — Core p. 44 | **Resolve 2**. | Requisito já coincide com o catálogo. Não acrescentar requisito de Especialização por inferência. |
| Armed Defense — Core pp. 60–61 | **OK** para os resumos auditados. | Conservar os resumos atuais; limites omitidos não se tornam tarefa de reconstrução. |
| Advanced Library — Mage p. 105 | **Safe Place igual ou maior** que Advanced Library. | Comparação implementada no requisito relativo compartilhado: uma instância canônica de Local Seguro com pontuação igual ou superior à compra; não somar instâncias. Biblioteca 3 continua obrigatória. EN/PT explicitam o limite; Mage 2e p. 105 revisado visualmente. 42/42 testes dirigidos, 36/36 de catálogos/arquitetura, lint, TypeScript e build aprovados. |
| Citywalker — Core p. 236 | **Sono remove a restrição para novas tentativas**. | Resumos EN/PT corrigidos e Core p. 236 revisado visualmente: falha impõe −3 nas tentativas seguintes naquele dia; oito horas de sono removem essa restrição. Não exigir sono antes de cada teste. Gates aprovados. |
| Cheap Shot / Choke Hold — Core p. 61 | **Adicionar −2 cumulativo apenas a Cheap Shot**, conforme confirmação posterior após revisão do PDF. Choke Hold não recebe essa penalidade. | Core p. 61 revisado visualmente. EN/PT de Golpe Baixo agora explicitam que cada uso na cena impõe −2 cumulativo aos usos seguintes. Choke Hold preservado; seus outros limites permanecem na lista sem resposta. 30/30 testes de apresentação/identidade/concessões, 36/36 de catálogos/arquitetura e build aprovados. |
| Fighting Finesse | **Apenas verificar a existência de alguma Especialização em Brawl ou Weaponry**; Melee equivale a Weaponry. | Requisito implementado por ID: exige uma Especialização preenchida em Briga ou Armas Brancas, conservando Destreza 3. Contextos da criação/ficha/XP recebem Especializações atuais e concessões Core recompostas sem alterar compras. 38/38 testes dirigidos, 34/34 de catálogos/arquitetura, lint, TypeScript e build aprovados. |
| Interdisciplinary Specialty — Core p. 45 | **Selecionar uma Especialização já cadastrada na ficha; removê-la ou alterá-la remove o Mérito junto**. | Implementado: seletor de Especializações existentes na Perícia correspondente com três pontos ou mais, vinculadas pela Perícia canônica, nome autoral e origem. Remoção/alteração explícita elimina a instância vinculada, sem crédito automático de XP nem reescrita do recibo. Criação, ficha e XP usam o mesmo contexto. Configurações e índices de concessões irmãs são preservados; culto de Mage e Título de Changeling usam seus produtores próprios. Abrir/importar não apaga escolhas antigas sem vínculo; elas precisam de seleção explícita. Core p. 45 revisado visualmente. 573/573 testes da suíte completa, lint, TypeScript e build aprovados. |
| Iron Will — Core p. 51 | **Resolve 3**, decisão do usuário. | Aplicado ao requisito canônico/PT; gates aprovados. Revisão visual de Core p. 51 nesta data mostra Resolve 4 no PDF local: conservar 3 como decisão explícita de projeto. |
| Resources / Mentor / Status | **Chapter = Session**. | Conservar sessão nos resumos; não reabrir a divergência terminológica. |
| Professional Training — Core p. 46 | **Selecionar as duas primeiras Asset Skills ao comprar o Mérito**, mesmo que o benefício só faça diferença no segundo ponto. | Editor e resumo Desktop/Mobile apresentam duas Perícias desde o primeiro ponto; resumos EN/PT corrigidos. Terceira Perícia e demais concessões mantêm seus níveis. Core p. 46 revisado visualmente; editor/resumo e preservação de configuração verificados em EN/PT; gates aprovados. |
| Like a Book / Breaking Point (estilo) | **OK** para os resumos auditados. | Conservar os resumos atuais; nenhuma reconstrução de limites solicitada. |
| Hedgespun Item | **Adicionar as desvantagens do livro**. | Changeling 2e p. 225 revisado visualmente. EN/PT incluem falha automática ao tentar passar despercebido ou desviar atenção enquanto usa o item, concedendo um Ato; seres não feéricos sofrem −1 em tarefas de concentração ou interação social. IDs, benefícios e configurações preservados. Gates de apresentação/identidade/catálogos e build aprovados. |
| Bless Amulet — Hurt Locker pp. 72–73 | **Usar o livro**: dia por sucesso; semana com dois pontos; permanente com três. | Resumos EN/PT corrigidos após revisão visual de Hurt Locker pp. 72–73: um ponto de Força de Vontade, objeto significativo, proteção por dia por sucesso, semana com dois pontos e permanente com três. Gates aprovados. |
| Ground Fighter — Hurt Locker p. 54 | **Usar o livro**. | Revisão visual de Hurt Locker p. 54 mostra Brawl 2, não 3 como constava na auditoria antiga. Catálogo já coincide com o PDF; requisito preservado e anotação antiga corrigida. |
| Vaulting Defense — Hurt Locker p. 52 | **Melee = Weaponry; usar o termo da ficha**. | Resumo EN usa Weaponry e PT usa Armas Brancas; ID, pontuação e efeito preservados. Gates aprovados. |
| Punch Drunk — Hurt Locker p. 43 | **Explicar o mínimo do livro**. | Revisão visual confirma Força de Vontade 6 ou mais. O parser de requisitos agora reconhece Força de Vontade e calcula o máximo por Perseverança + Compostura, aceitando um valor neutro explicitamente fornecido pelo contexto. O saldo atual não altera elegibilidade. EN/PT explicitam seis ou mais. Limites 5/6/7 e precedência de valores explícitos verificados em todas as linhas; 576/576 testes, lint, TypeScript e build aprovados. |
| Object Fetishism — Hurt Locker p. 42 | **Chapter = Session**. | Conservar sessão no resumo; divergência terminológica encerrada. |
| Uncaged Indulgence / Unconscious Alignment — Agony & Ecstasy pp. 72 e 74 | **Corrigir conforme o PDF local**. | Revisão visual confirma Expression 2/p. 72 e Academics 2/p. 74. Requisitos e páginas canônicos corrigidos, preservando IDs e o tratamento descritivo existente. 41/41 testes de integração EN/PT/EN, identidade, catálogos e arquitetura, lint e build aprovados; apresentação PT aplicada no lote seguinte. |

| Courtoisie — Secrets of the Covenants p. 187 | **Preservar Courtoisie do francês**. | A apresentação existente já coincide; decisão encerrada. |
| Glamour Fasting / Market Sense e demais catálogos | **Sessão e capítulo são equivalentes em todos os conflitos encontrados**. | Decisão ampliada pelo usuário; apresentações PT dos Méritos Core/Changeling/Vampire e mensagens da interface EN/PT uniformizadas para sessão, sem alterar durações nem IDs de mensagens. Os dois registros nomeados já usavam sessão. As referências de Jharana, Erzsébet e Malkovians também foram uniformizadas para sessão. Catálogos ainda pendentes adotarão a mesma decisão; inglês canônico e entrada de parsers preservados. |
| Mounted Combat — Hurt Locker p. 51 | **Preferir o valor do livro**. | Animal Ken corrigido de 3 para 2 no canônico e Empatia com Animais 2 em PT. Hurt Locker p. 51 revisado visualmente; limites verificados em criação/ficha/XP de todas as linhas; 576/576 testes, lint, TypeScript e build aprovados. |
| Bowmanship / Falconry — Hurt Locker pp. 47–49 | **Textos do livro fornecidos pelo usuário**. | Hurt Locker pp. 47–49 revisado visualmente. Resumos EN/PT incluem paradas, alcance, dano mínimo do arco, ação reflexiva, proteção vertical/Durabilidade, ave de Tamanho 2, vínculo/treinamento, ações independentes, gasto de Força de Vontade, exceções de Vigília, próxima ação do Rasante, tamanho/visão/Desarmar e Complicação Cegueira. 576/576 testes, lint, TypeScript e build aprovados. Não se criaram automações de combate. |
| Book of Courts — Get the Manager, Can't Spook a Spooker, GTFO, Shivers, Snow Cover | **Não presumir nem substituir acesso**. | Conservar as regras e alternativas cadastradas; encerrado. |
| Book of Courts — Acquired Taste | **Permite múltiplas instâncias**. | Metadado canônico já declara `repeatable: true`. Teste dirigido verifica duas compras com instâncias e configurações autorais independentes e estorno que preserva a outra compra. 576/576 testes, lint, TypeScript e build aprovados. Instâncias/configurações existentes preservadas. |
| Book of Seemings — Hidden Life | **Conservar a comparação atual**. | Encerrado; não unificar Manto, Boa Vontade e Status. |
| Book of Seemings — Meat Shield: Remember Me? | **Presence + Intimidation contra Resolve + Composure do oponente**. | Resistência completada nos resumos EN/PT; Book of Seemings p. 98 revisado visualmente. IDs e demais limites preservados; 576/576 testes, lint, TypeScript e build aprovados. |
| Book of Seemings — Material Affinity | **Ação Avançada é distinta da qualidade de Rotina**. | Conservar Ação Avançada; encerrado. |

## Pontos ainda sem resposta ou auditoria concluída

A lista abaixo exclui as decisões respondidas acima; Swarm Form, Choke Hold, Curse Effigy e Fire & Revolution receberam pedidos de esclarecimento, não aprovação de mudanças. A revisão visual atual está indicada em cada registro abaixo. Não corrigir por tradução ou por inferência.

| Registro / fonte | Trabalho ainda não respondido |
| --- | --- |
| Swarm Form — Vampire p. 114 | O registro já é um Mérito. A dúvida era somente sobre a referência cadastrada Shape of the Beast (Forma da Fera). Revisão visual de Vampire p. 114 confirma Beast's Skin e Metamorfose 3, mas o catálogo exige 4. Pergunta enviada para corrigir referência/requisito conforme o livro ou conservar o registro. |
| Choke Hold — Core p. 61 | O −2 cumulativo aplica-se apenas a Cheap Shot, conforme confirmação do usuário. Core p. 61 revisado visualmente: o resumo omite limiar maior que duas vezes Vigor e duração 6 − Vigor minutos. Pergunta enviada para completar esses limites ou conservar o resumo. |
| Curse Effigy | Parada letal sem agrupar a resistência: Intelligence + Medicine − Stamina + Supernatural Tolerance. Hurt Locker p. 73 revisado visualmente: o próprio PDF mantém essa ambiguidade. Pergunta enviada sobre conservar a fórmula ou explicitar a interpretação; nenhum agrupamento foi alterado. |
| Fire & Revolution — facções e Méritos pp. 72–76, 94–95 | Revisão visual do PDF local: páginas das oito facções são 72/73/75/75/76/76/76/76, enquanto o catálogo usa 70/70/71/71/72/72/73/73. Artefato Cultural omite Status Carthiano 2; Experimentador de Devoções (Avançado) omite três Devoções da Disciplina escolhida; Imposição omite Armas de Fogo 2 ou Armas Brancas 2; Bombista Incendiário omite Ímpeto 1. Pergunta enviada para corrigir páginas/requisitos conforme esse PDF ou conservar o catálogo. Tradução conserva os campos atuais até a resposta; não reconstrói outros limites. |

Conteúdo de origem Vampire/Mage distribuído como Core conserva a classificação e a elegibilidade cadastradas, inclusive Homebrew. Tradução não cria acesso geral a Méritos exclusivos nem presume exceções do Narrador.

## Verificação atual

- **403/403** Méritos Vampire com apresentação completa por ID: 154 oficiais, 249 Homebrew e os 80 níveis do catálogo. Todos os campos existentes e 80 níveis apresentados; Courtoisie permanece no francês, conforme escolha aprovada. As nove erratas ativadas preservam campos herdados e identidades canônicas, incluindo escolhas antigas com nome/fonte originais. O catálogo canônico conserva identidades e efeitos, salvo as correções aprovadas de Agony & Ecstasy; poderes/Conditions/presets e a etapa Mage seguem no backlog.
- **56 Bloodlines** com PT completo, incluindo Desventurados. IDs, compras, XP, recibos e textos autorais não são reescritos pela troca de idioma.
- Manifesto `catalogVersion` **88**; recursos Core de Méritos nas versões **15/16**, Changeling nas versões **6/8**, `merits-vampire` **13**, `merits-vampire-pt` **21**, `vampire-bloodlines` **14** e `vampire-powers` **34**.
- Méritos Vampire concluídos: **79/79** testes dirigidos e **577/577** da suíte completa aprovados, além de lint, TypeScript e build. Erratas preservam fontes originais e campos PT herdados; substituições autorais sem PT conservam seu texto.
- Integração de poderes: **77/77** testes dirigidos, lint, TypeScript e build aprovados ao introduzir a apresentação. Criação, XP, cards compartilhados Desktop/Mobile e Homebrew usam EN/PT/EN; níveis ainda não adquiridos permanecem ocultos na ficha.
- Último lote: Caquexia e Sinal Morto, com dez níveis e todos os campos existentes, incluindo resultados de testes, contágio, cura e reconfiguração. **37/37** testes dirigidos de poderes e **5/5** de referências, além do build, aprovados. Comparação dos 546 registros/140 níveis com o commit anterior confirma campos canônicos intactos. As dez Disciplinas básicas de Vampire estão apresentadas em PT; cinco Disciplinas exclusivas e os demais grupos continuam no backlog.
- As demais correções aprovadas têm estado de aplicação na tabela de decisões respondidas; os catálogos Vampire/Mage e os pontos sem resposta permanecem separados no backlog.
- Sem smoke de navegador. A suíte completa de encerramento será executada após concluir todo o escopo; gates proporcionais por lote.
