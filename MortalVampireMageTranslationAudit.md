# Auditoria de tradução — Mortal, Vampire e Mage

Atualização: **2026-10-04**. **Meta ativa:** prioridade 0 e etapas 1–2 implementadas e verificadas; etapa 3 em execução; etapa 4 pendente.

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
| Vampire — referências | 16 Clans, 23 Covenants, 27 Anchors, 56 Bloodlines | Clans/Covenants/Anchors completos; 48 Bloodlines com textos PT (14 oficiais, 34 Homebrew), oito restantes; caption Star-Crossed em consulta |
| V04 — Méritos | 403 (154 não Homebrew, 249 Homebrew), 80 níveis; nove erratas incluídas | 353 descrições EN; revisar também os demais campos das 50 descrições já PT |
| V05 — Poderes | 546 registros, 140 níveis internos | Traduzir campos existentes e integrar criação/XP/ficha/Homebrew |
| V06 — Conditions | 66, incluindo 19 Homebrew e duas erratas | Nome, descrição, resolução e Ato, quando aplicáveis |
| V06 — Textos predefinidos | 42 Breaking Points; seis Shadow Cults | Localizar rótulos e benefícios predefinidos; preservar configurações e Specialties autorais |
| G01 — Spells | 360 | Nomes descritivos, resumos, descrições e metadados; integração separada do parser |
| G02 — Méritos | 71 (61 principais, dez suplementares), 31 níveis | Nome, requisitos, descrição e níveis |
| G03 — Organizações | 17 Orders, 44 Factions, 12 Ministries | 11 Orders sem descrição PT; Factions/Tool Yantras e Ministries/Patron Exarchs |
| G04 — Legacies | 16, 43 Attainments | Nomes, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções |
| G05 — Conditions | 24 | Nome, descrição, resolução e Ato; nomes de Húbris já vinculados ao catálogo por ID |

### Vampire — detalhes de execução

Catálogos em `public/game-lines/vampire/data/`. Bloodlines possuem uma visão de leitura própria usada na página, prévia de ingresso, Maldição da ficha e Homebrew. Ingresso, concessão e remoção continuam recebendo definições canônicas. Os oito registros sem `presentationPt` são o próximo lote.

Méritos: revisar requisitos canônicos ainda exibidos como Brawl/Composure e referências antigas a Kindred/Covenant nas traduções parciais; não deduzir elegibilidade por títulos.

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
- Numina permanece **Numina**. Nomes de Perícias seguem o dicionário atual, incluindo **Empatia com Animais**; não usar propostas antigas para substituir rótulos vigentes.
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

### Referências já localizadas para os próximos catálogos

- Vampire Conditions: Bestial, Competitivo, Lascivo, Dependente, Mesmerizado, Falsas Memórias, Lânguido, Letárgico, Tentado, Distraído e Convite. Lânguido (Languid) e Letárgico (Lethargic) permanecem distintos. Jaded/Addiction/Swooning/Drained ainda devem acompanhar seus próprios registros.
- Mage Conditions: Megalomaniacal/Rampant ainda aguardam seu catálogo; Húbris resolve seus IDs. Não criar uma tabela mecânica paralela.
- Vampire poderes/Méritos: Meada de Clotho; Amigos no Exterior; Fome Intensificada; Coração Sombrio; Feudo Amaldiçoado; Fama (Avançada); Escola de Etiqueta; Crúac Banshee; Ouvidos para a Fera; O Veículo; Cerne (Heartwood de Yarilo, distinto da categoria Crux de Penhores); Unção; As Delícias; Riqueza Herdada; Verdades de Erebus; Lições de Erebus; Conheça Seu Público; Grilhão de Sangue; Sangue dos Relutantes; Sem Presas.
- Coalizões: Evolução Triádica, Juramentos do Invictus, Código do Carrasco, O Conto de Shahrayad, Fachada, Cisma, Cripta/Saída, Atendente da Sepultura, Explorador Sagrado, Tocado por Mary e Visão Arcana. Detournement, Therion, Kimiya e Manteia mantêm a forma cadastrada.
- Bloodlines: Cavaleiros sem Terra traduz Hedge Knights no contexto medieval de Bron; Purezas traduz Purities. Electrum, Udjat, Namus-Ur, Lobos de Sangre, Morrigans, Mystikos, Spiritus Sancti, Sublunario, Családtag, Lithopedia, Strix e draugr preservados.
- Numina do Familiar já apresentada: Fascínio, Rajada, Enlouquecer, Drenar, Aura Emocional, Decadência Entrópica, Incendiário, Alucinação, Implantar Missão, Chave Canhota, Mascarilha Mortal, Desbravador, Regenerar, Buscar, Velocidade, Sinal, Inabalável e Telecinese. Propostas posteriores à confirmação histórica, já aplicadas; não equivalem à aprovação de nomes homônimos em outras linhas.

## Dúvidas abertas

| Data | Dúvida | Estado |
| --- | --- | --- |
| 2026-10-04 | Star-Crossed: título idiomático de destino adverso | Em consulta: Desventurados / Marcados por um Destino Adverso. Caption canônica preservada enquanto se aguarda preferência. |

## Divergências mecânicas ainda registradas

Pendências de uma auditoria de regras separada. **Não corrigir por tradução.** As referências abaixo foram inspecionadas em lotes anteriores; este documento registra os achados, sem alegar nova revisão de PDFs.

| Registro / fonte | Divergência ou limite ainda relevante |
| --- | --- |
| Mystery Cult Influence — Core p. 51 | As pp. 51–53 apresentam Initiation, sem esse Mérito separado. Origem exata requer auditoria; ID, fonte cadastrada e benefícios preservados. Core/Mage conservam a apresentação sem qualificador pelo efeito equivalente cadastrado. |
| Nighthawks — Nameless and Accursed p. 29 | Catálogo inclui Prime 2 no segundo Attainment; lista impressa de pré-requisitos cita Larceny 3. |
| Tyrian Archons — Nameless and Accursed p. 35 | Profane Tool (Scepters) aparece no texto; requisito estruturado verifica Mérito/ponto, sem a restrição de configuração. |
| Vardyvle / Penumbrae | Referências canônicas False Memory (singular) / False Memories (plural) preservadas; não inferir IDs ou fundir efeitos. |
| Area of Expertise — Core p. 44 | Especialização exigida no livro, ausente no requisito cadastrado Resolve 2. |
| Armed Defense — Core pp. 60–61 | Resumos omitem limites de Weak Spot, sucessos extras/declaração de Aggressive Defense e detalhes de Dodge/Press the Advantage. |
| Advanced Library — Mage p. 105 | Livro exige Local Seguro de pontuação igual; catálogo usa ≤ Safe Place. |
| Citywalker — Core p. 236 | Catálogo coloca oito horas de sono antes de cada teste; livro usa sono para remover restrição de novas tentativas após falha. |
| Cheap Shot / Choke Hold — Core p. 61 | Resumos omitem −2 cumulativo na cena / limiar maior que duas vezes Vigor e duração 6 − Vigor minutos. |
| Fighting Finesse / Interdisciplinary Specialty | Especializações apropriadas exigidas nos livros não constam nos requisitos resumidos. |
| Iron Will — Core p. 51 | Resolve 4 no catálogo, Resolve 3 no livro. |
| Resources / Mentor / Status | Catálogo usa sessão; livro usa capítulo. |
| Professional Training — Core p. 46 | Continuing Education coloca escolha de Perícias de Ativo no segundo nível; livro coloca ao adquirir o Mérito. |
| Like a Book / Breaking Point (estilo) | Resumos omitem arredondamento para baixo de metade de Briga / proporção de Estrutura sacrificada. |
| Glamour Fasting / Market Sense | Catálogo usa sessão; livro usa capítulo. |
| Hedgespun Item | Resumo não contém as desvantagens do livro. |
| Bless Amulet — Hurt Locker pp. 72–73 | Livro: dia por sucesso, semana com dois pontos, permanente com três; catálogo: dia com dois, semana com três. |
| Ground Fighter — Hurt Locker p. 54 | Brawl 2 no catálogo, Brawl 3 no livro. |
| Punch Drunk — Hurt Locker p. 43 | Catálogo registra seis pontos de Willpower sem explicitar o mínimo do livro. |
| Object Fetishism — Hurt Locker p. 42 | Catálogo usa sessão; livro usa capítulo. |
| Curse Effigy | Parada letal sem agrupar a resistência: Intelligence + Medicine − Stamina + Supernatural Tolerance. Agrupamento/elegibilidade requerem auditoria. |
| Vaulting Defense — Hurt Locker p. 52 | Melee não é uma Perícia Core; PT Combate Corpo a Corpo preserva o texto, sem convertê-lo mecanicamente em Weaponry. |
| Mounted Combat — Hurt Locker p. 51 | Animal Ken 3 no catálogo, Animal Ken 2 no livro. |
| Bowmanship / Falconry e demais resumos Hurt Locker | Limiares, durações, modificadores e desvantagens ausentes não foram reconstruídos. |
| Book of Courts — Get the Manager, Can't Spook a Spooker, GTFO, Shivers, Snow Cover | Manto é repetido após alternativa de Boa Vontade; não presumir dispensa nem substituir acesso por limiares de Contratos de Corte. |
| Book of Courts — Acquired Taste | Aquisição separada por tipo sobrenatural; tradução não redefine instâncias/configuração. |
| Book of Seemings — Hidden Life | Comparação de custo entre Manto, Boa Vontade e Status preservada, sem unificar mecânicas. |
| Book of Seemings — Meat Shield: Remember Me? | Resumo omite parada de resistência do atacante. |
| Book of Seemings — Material Affinity | Ação Avançada preservada; não substituída por qualidade de rotina. |

Conteúdo de origem Vampire/Mage distribuído como Core conserva a classificação e a elegibilidade cadastradas, inclusive Homebrew. Tradução não cria acesso geral a Méritos exclusivos nem presume exceções do Narrador.

## Verificação atual

- Último lote: 12 apresentações Bloodline Homebrew — Mnemosyne, Norvegi, Qedeshah, Acteius, Doceiros, Sociedade da Crista de Galo, Gethsemani, Guardiões das Trevas, Lygos, Família Von Schreck, Yagnatia e Adrestoi. **48/56** registros com PT, oito restantes e a caption Star-Crossed em consulta.
- Integração EN → PT → EN, Homebrew e identidade/XP: 44 testes aprovados na execução dirigida; a expectativa antiga de 36 registros falhou e foi atualizada para 48, passando na reexecução do teste de completude/limites. Nenhuma falha permanece neste lote.
- Lint, TypeScript, build e 34/34 testes de catálogos/arquitetura aprovados. Comparação conserva os 56 registros canônicos e as 36 apresentações anteriores.
- Escolhas explícitas do usuário e limpeza documental: implementadas no commit `24105b4`, com 73/73 testes dirigidos, 34/34 de catálogos/arquitetura, lint, TypeScript e build aprovados. Relatos históricos concluídos não foram mantidos.
- Sem smoke de navegador. Nova suíte completa de encerramento ainda deverá ser executada após concluir o escopo; os gates destes lotes são dirigidos.
