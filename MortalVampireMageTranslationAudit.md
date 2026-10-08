# Auditoria de tradução — Mortal, Vampire e Mage

Atualização: **2026-10-07**. **Meta ativa:** prioridade 0, localização das etapas 1–2 e correções aprovadas de Méritos Core implementadas e verificadas; etapa 3 em execução; etapa 4 pendente.

## Escopo e ordem

- [ ] **3 — Vampire:** concluir Bloodlines, Méritos, poderes, Conditions e presets.
- [ ] **4 — Mage:** Méritos, Spells, organizações, Legacies/Attainments e Conditions.

Desktop/Mobile. **Impressão, PDF e blank fora do escopo**, inclusive Numina do Familiar na impressão. Oficial e Homebrew são traduzidos em conjunto, preservando sua origem. Não traduzir nomes próprios, títulos de livros, IDs nem textos autorais; localizar títulos descritivos e consultar dúvidas quando necessário.

Apresentação por ID, separada do canônico usado pelas regras e parsers. Trocar idioma não reescreve personagens, concessões, XP ou recibos. Core fornece mecanismos; cada linha possui suas mecânicas. Os detalhes de identidade, bridges schema-2 e ownership implementados estão em `AGENTS.md` e nos testes, sem duplicação retrospectiva neste arquivo.

Trabalhar em lotes pequenos, verificar EN → PT → EN e gates proporcionais, registrar dúvidas e criar commits locais coerentes. Concluir a meta apenas após implementar e verificar todo o escopo. Smoke de navegador é realizado pelo usuário. `WerewolfAudit.md` permanece porque contém decisões e trabalho adiado; esta meta não reabre as decisões de Contracts Waters of Lethe, Enveloping Sands e Whisperwind.

Decisão de escopo em 2026-10-07: descontos de Devoções conforme a fonte, configuração de Bloodcrafting e vínculos de Rapidity/Slow and Steady aprovados. **Avisar o usuário antes de acrescentar qualquer novo subsistema**, inclusive os fluxos de escolhas de Ortam e Lithopedia; a presença no backlog não dispensa esse aviso.

## Backlog atual

As contagens incluem suplementos, Homebrew e errata, sem pressupor elegibilidade universal ou deduplicar regras homônimas. Inglês canônico isolado não indica ausência de apresentação PT.

| Área | Inventário | Trabalho restante |
| --- | --- | --- |
| Vampire — referências | 16 Clans, 23 Covenants, 27 Anchors, 56 Bloodlines | Clans/Covenants/Anchors completos; 56 Bloodlines com textos PT (14 oficiais, 42 Homebrew); Desventurados aprovado e aplicado |
| V04 — Méritos | 399 (154 não Homebrew, 245 Homebrew), 80 níveis; nove erratas incluídas | Apresentações existentes completas, nove erratas ativadas e correções de fonte aprovadas verificadas; Beast King recuperado e Best Fiend alinhado a False Gods p. 111; Servo de Dis recuperado conforme Agony p. 103 |
| V05 — Poderes | 555 poderes, 140 níveis internos; 1 Tilt da linha | 23/23 Disciplinas, seus 110 níveis, 5/5 Disciplinas Rituais, 2/2 Açoites, 5/5 fórmulas de Kimiya, 7/7 Sacrilégios de Therion, 10/10 Invocações de Gaiola Dourada, 5/5 Detournements, 6/6 Espirais com 30 níveis e 19/19 Escamas e 76/76 ritos de Crúac e 32/32 milagres Tebanos e 357/358 Devoções com PT. Resta 1 Devoção |
| V06 — Conditions | 68, incluindo 19 Homebrew e duas erratas | 44/68 com PT completa e regras conferidas, incluindo Agonizado e Prometido antes ausentes; completar nome, descrição, resolução e Ato, quando aplicáveis |
| V06 — Textos predefinidos | 42 Breaking Points; seis Shadow Cults | Localizar rótulos e benefícios predefinidos; preservar configurações e Specialties autorais |
| G01 — Spells | 360 | Nomes descritivos, resumos, descrições e metadados; integração separada do parser |
| G02 — Méritos | 71 (61 principais, dez suplementares), 31 níveis | Nome, requisitos, descrição e níveis |
| G03 — Organizações | 17 Orders, 44 Factions, 12 Ministries | 11 Orders sem descrição PT; Factions/Tool Yantras e Ministries/Patron Exarchs |
| G04 — Legacies | 16, 43 Attainments | Nomes, requisitos, iniciação, organização, teoria, Yantras, Oblations, efeitos e opções |
| G05 — Conditions | 24 | Nome, descrição, resolução e Ato; nomes de Húbris já vinculados ao catálogo por ID |

### Vampire — execução pendente

Dados em `public/game-lines/vampire/data/`. Traduzir os campos existentes: resumo, efeito, custo, parada, ação, duração, resultados, modificadores, procedimento, sacramento, requisitos e opções. Não inventar campos ausentes nem interpretar a apresentação PT como regra.

- **1 Devoção:** Aura of Cursive Seduction (David Hill/Pastebin). Strange Shades, os blogs Onyx Path e demais famílias de poderes do inventário V05 já possuem PT; sete Discipline Options e Enxame estão implementados.
- **Ortam:** Sin Again p. 40 concede três receitas no primeiro ponto, incluindo Essence Vitale Absolue, e mais duas por ponto posterior. Auditar/implementar o fluxo de escolhas. As onze receitas não são concedidas em bloco; custo ausente não significa gratuito, e sair de Gulikan não apaga receitas já selecionadas.
- **Lithopedia — escolhas gratuitas:** Strange Shades p. 28 concede um rito ao primeiro ponto e exige Status na Bloodline para ritos gratuitos nos pontos posteriores. Auditar/implementar esse fluxo de escolhas na criação/XP, sem inferir concessões por preço ausente ou reescrever escolhas existentes.
- **Requisitos adicionais:** os dez ritos de Lithopedia agora exigem a Disciplina por ID e pontuação; Prince’s Wrath corrigido de quatro para três pontos conforme Strange Shades pp. 29–30. Os dez ritos possuem PT completa (Strange Shades pp. 29–30), incluindo referências entre eles. Restam os demais requisitos de Sea Witch’s Gift e Siren’s Sweet Visage; seu acesso por Bloodline já existe, mas não prova os outros requisitos.
- **Rapidity / Slow and Steady — fonte:** configuração por ID, preços e requisitos por alvo implementados. O índice local confirma faixa de 1–3 Experiências; a reprodução pública de Hidden Devotions explicita 1 XP para requisito 1–2, 2 XP para 3–4 e 3 XP para 5. A publicação original do autor continua indisponível. Adequação do alvo é avaliada pelo Narrador, especialmente a exclusão de procedimentos/falas complexas em Rapidity; não inferir isso dos nomes. Compras schema-2 sem alvo permanecem sem alvo, sem migração automática ou reprecificação de recibos.
- **BFFs / Violent Coercion / Manic Depression — resistência:** o índice local de Devoções usa Composure + Tolerance, enquanto os registros EN usam Composure + Blood Potency. A conferência também deve abranger Manic Depression, cujo índice usa Tolerance. Conferir o texto do autor para alvos sobrenaturais de outras linhas; até essa verificação, as traduções preservam os registros existentes, sem inferir uma correção de mecânica a partir do índice. Coerced não tem entrada cadastrada: referência PT **Coagido(Membro)**, distinta de Leveraged/Coagido Core; auditar a fonte antes de cadastrar efeito, resolução e Atos completos. A [reprodução pública de Hidden Devotions](https://www.scribd.com/document/657937460/Vampire-the-Requiem-2e-Secrets-of-the-Covenants-Hidden-Devotions), lida em 2026-10-07, usa Blood Potency nos dois testes e contém Coerced com Beat N/A; corrobora o catálogo, mas não é a publicação original do autor verificada.
- **Aura of Cursive Seduction / Quelled:** título PT aguardando escolha entre Aura de Sedução Sinuosa, Aura de Sedução Cursiva ou o original. Quelled é uma Condition própria ainda ausente; não substituir por outra Condition. A reprodução pública descreve persistência, +5 para resistir ao frenesi, proibição de Ride the Wave, perda da Potência de Sangue na resistência a poderes, resolução vinculada a Enthralled e Ato por revés relevante; verificar a publicação original do autor antes de cadastrar esses efeitos.
- **V06 — Manic / Melancholic:** referências PT Maníaco / Melancólico em Depressão Maníaca, sem entradas cadastradas. Conferir o texto completo de Hidden Devotions antes de criar efeitos, resolução e Atos; manter os resumos canônicos e não substituir por Conditions homônimas de outras fontes.
- **Consistência de características:** a ficha apresenta Athletics como **Atletismo** e Composure como **Compostura**. Revisar apresentações anteriores que ainda dizem Esportes (incluindo Preso no catálogo Core) ou Autocontrole em lugar desses rótulos, sem alterar IDs ou efeitos.
- **Presets:** `game-lines/vampire/catalog-data/detachment.json` contém 41 entradas e `vastDynastyEmbrace`; `shadow-cults.json` contém os seis cultos. Preservar escolhas e Especializações autorais.

Referências de Conditions ainda necessárias: Scarred → Marcado por Cicatrizes; Materialized → Materializado; Stumbled → Vacilante; Tasked → Incumbido. Power Surge → Sobrecarga Elétrica é apenas referência textual: não há entrada cadastrada e isso não autoriza inventar regras/IDs.

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
- Courtoisie preserva o francês; Star-Crossed → **Desventurados**.

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

### Referências para os catálogos pendentes

- Vampire — referências de Méritos: Máscara Inflexível segue Mask de Vampire → Máscara; Ímpeto é a Disciplina Vigor, distinta do Atributo Vigor/Stamina; Metamorfose, Pesadelo e Ofuscação reutilizam as apresentações existentes. Maldição Potente, Encantado(Membro) e Letárgico orientam as respectivas Conditions, preservando seus IDs e efeitos.

- Vampire — títulos de Méritos: Notário; Visões Oníricas; Necrópole; Guardiões das Trevas. Preservar Correio da Forca e O Conto de Shahrayad; Friends in Low Places de Vampire usa Amigos em Lugares Baixos com o qualificador Membro. Swooned no texto de Lingering Dreams foi apresentado como Enamorado, sem vincular ou alterar IDs por essa variante textual.

- Vampire Conditions: Semente de Sua Divindade e Reforço Carthiano acompanham as referências das erratas, sem criar IDs por nome. Bestial, Competitivo, Lascivo, Dependente, Mesmerizado, Falsas Memórias, Lânguido, Letárgico, Tentado, Distraído e Convite. Subserviente traduz Subservient na referência de Kerberos; Intoxicado e Assustado traduzem Intoxicated e Frightened nas referências de Kingjan, sem criar identidade por nome. Lânguido (Languid) e Letárgico (Lethargic) permanecem distintos. Addiction/Swooning ainda devem acompanhar seus próprios registros.
- Mage Conditions: Megalomaniacal/Rampant ainda aguardam seu catálogo; Húbris resolve seus IDs. Não criar uma tabela mecânica paralela.
- Vampire referências carthianas: Regra de Um Só traduz Rule of One; Conheço uma Pessoa, Exército de Um Só, Coda contra a Feitiçaria e Experimentador de Devoções acompanham as apresentações existentes. Bloodroots, PPI e Janus permanecem no original.
- Vampire referências de Agony & Ecstasy: Poção da Bruxa traduz Witch's Brew; Guardião traduz Warden em Sombra do Mestre; Dedo Vermelho traduz Red Thumb; Abrir o Vazio traduz Opening the Void. Essas apresentações não criam identidades nem efeitos por nome.
- Vampire poderes/Méritos: Meada de Clotho; Amigos no Exterior; Fome Intensificada; Coração Sombrio; Feudo Amaldiçoado; Fama (Avançada); Escola de Etiqueta; Crúac Banshee; Ouvidos para a Fera; O Veículo; Cerne (Heartwood de Yarilo, distinto da categoria Crux de Penhores); Unção; As Delícias; Riqueza Herdada; Verdades de Erebus; Lições de Erebus; Conheça Seu Público; Grilhão de Sangue; Sangue dos Relutantes; Sem Presas; Surto Elétrico; Parentesco Insetoide; Mente de Colmeia; Semblante Perdido; Apofenia; Pareidolia; Dementação. Cirurgia Arthmoic conserva a grafia técnica cadastrada.
- Coalizões: Evolução Triádica, Juramentos do Invictus, Código do Carrasco, O Conto de Shahrayad, Fachada, Cisma, Cripta/Saída, Atendente da Sepultura, Explorador Sagrado, Tocado por Mary e Visão Arcana. Detournement, Therion, Kimiya e Manteia mantêm a forma cadastrada.
- Referências para próximos catálogos: Embrocação traduz Embrocation, distinta de Anointment → Unção; não presume identidade ou equivalência de efeitos. Bode Expiatório também nomeia o Lamento Whipping Boy. Occultation recebe Ocultação na apresentação de Vampire; Mage deve acompanhar o título com seu próprio qualificador, preservando as duas definições distintas.
- Risen Beast → **Fera Desperta** na referência de A Rendição Rubra. The Wild Hunt pp. 87 e 110 revisado visualmente: o requisito remete à Condição da Fera consciente, sem acrescentar seus efeitos ao Mérito nem criar uma identidade pelo título traduzido.
- Bloodlines: Cavaleiros sem Terra traduz Hedge Knights no contexto medieval de Bron; Purezas traduz Purities. Electrum, Udjat, Namus-Ur, Lobos de Sangre, Morrigans, Mystikos, Spiritus Sancti, Sublunario, Családtag, Lithopedia, Strix e draugr preservados.
- Numina do Familiar já apresentada: Fascínio, Rajada, Enlouquecer, Drenar, Aura Emocional, Decadência Entrópica, Incendiário, Alucinação, Implantar Missão, Chave Canhota, Mascara Mortal, Desbravador, Regenerar, Buscar, Velocidade, Sinal, Inabalável e Telecinese. Propostas posteriores à confirmação histórica, já aplicadas; não equivalem à aprovação de nomes homônimos em outras linhas.

Bitch-Hammer recebe **Puta duma Martelada**, conforme escolha do usuário em 2026-10-05.

## Decisões aprovadas — conservar, não reabrir

Em toda divergência comprovada entre livro e catálogo, **preferir o livro**, inclusive preços, preservando identidades, compras, XP e valores registrados para estornos. Exceções explícitas do usuário prevalecem. Oficial e Homebrew conservam sua origem; localização não concede acesso universal.

Correções concluídas permanecem nos catálogos e testes. Esta tabela conserva as escolhas e exceções úteis para os lotes seguintes, sem repetir o diário de implementação.

| Registro / fonte | Decisão vigente |
| --- | --- |
| Mystery Cult Influence | Fonte: **Mage: The Awakening p. 103**. Fonte compartilhada corrigida; preservar o ID histórico `core-2ed:mystery-cult-influence` e equivalência com Mage, sem qualificador. |
| Nighthawks — Nameless and Accursed p. 29 | **Prime 2 e Larceny 3**. Segundo Aperfeiçoamento: Prime 2 e Larceny 3; iniciação/primeiro mantém Larceny 2. PT completa pendente em G04. |
| Tyrian Archons — Nameless and Accursed p. 35 | **OK** para o comportamento auditado de Profane Tool (Scepters). |
| Vardyvle / Penumbrae | **False Memory(ies) é a mesma Condition**, VtR p. 303. |
| Area of Expertise — Core p. 44 | **Resolve 2**. |
| Armed Defense — Core pp. 60–61 | **OK** para os resumos auditados. |
| Advanced Library — Mage p. 105 | **Safe Place igual ou maior** que Advanced Library. Uma instância canônica de Local Seguro, sem somar instâncias; Biblioteca 3 continua obrigatória. |
| Citywalker — Core p. 236 | **Sono remove a restrição para novas tentativas**. Falha impõe −3 nas tentativas seguintes naquele dia; oito horas de sono removem a restrição. |
| Cheap Shot / Choke Hold — Core p. 61 | **Adicionar −2 cumulativo apenas a Cheap Shot**, conforme confirmação posterior após revisão do PDF. Choke Hold não recebe essa penalidade. |
| Fighting Finesse | **Apenas verificar a existência de alguma Especialização em Brawl ou Weaponry**; Melee equivale a Weaponry. Conservar Destreza 3; verificar Especialização preenchida, não seu título ou tema. |
| Interdisciplinary Specialty — Core p. 45 | **Selecionar uma Especialização já cadastrada na ficha; removê-la ou alterá-la remove o Mérito junto**. Perícia com três pontos ou mais. Remoção/alteração explícita elimina a instância vinculada sem crédito de XP; abrir/importar não apaga vínculos antigos não resolvidos. |
| Iron Will — Core p. 51 | **Resolve 3**, decisão do usuário. Exceção explícita do projeto: Resolve 3 prevalece sobre Resolve 4 do PDF local. |
| Professional Training — Core p. 46 | **Selecionar as duas primeiras Asset Skills ao comprar o Mérito**, mesmo que o benefício só faça diferença no segundo ponto. |
| Like a Book / Breaking Point (estilo) | **OK** para os resumos auditados. |
| Hedgespun Item | **Adicionar as desvantagens do livro**. Falha automática ao passar despercebido/desviar atenção usando o item, concedendo Ato; não feéricos sofrem −1 em concentração/interação social (CtL 2e p. 225). |
| Bless Amulet — Hurt Locker pp. 72–73 | **Usar o livro**: dia por sucesso; semana com dois pontos; permanente com três. |
| Ground Fighter — Hurt Locker p. 54 | **Usar o livro**. Brawl 2 confirmado; anotação antiga de Brawl 3 removida. |
| Punch Drunk — Hurt Locker p. 43 | **Explicar o mínimo do livro**. Força de Vontade máxima 6 ou mais = Resolve + Composure; saldo atual não afeta o requisito. |
| Uncaged Indulgence / Unconscious Alignment — Agony & Ecstasy pp. 72 e 74 | **Corrigir conforme o PDF local**. Expression 2/p. 72 e Academics 2/p. 74. |
| Mounted Combat — Hurt Locker p. 51 | **Preferir o valor do livro**. Animal Ken 2, não 3. |
| Bowmanship / Falconry — Hurt Locker pp. 47–49 | **Textos do livro fornecidos pelo usuário**. Resumos completos aplicados conforme os textos fornecidos e PDF; nenhuma automação de combate criada. |
| Book of Courts — Get the Manager, Can't Spook a Spooker, GTFO, Shivers, Snow Cover | **Não presumir nem substituir acesso**. |
| Book of Courts — Acquired Taste | **Permite múltiplas instâncias**. |
| Book of Seemings — Hidden Life | **Conservar a comparação atual**. |
| Book of Seemings — Meat Shield: Remember Me? | **Presence + Intimidation contra Resolve + Composure do oponente**. |
| Book of Seemings — Material Affinity | **Ação Avançada é distinta da qualidade de Rotina**. |
| Choke Hold — Core p. 61 | **Completar o resumo conforme o livro**; o −2 cumulativo continua exclusivo de Cheap Shot. Segurar prévio; sucessos maiores que duas vezes o Vigor da vítima, somáveis em turnos posteriores; inconsciência por 6 − Vigor minutos. |
| Curse Effigy — Hurt Locker p. 73 | **Sucessos de criação formam uma reserva**, conforme interpretação detalhada pelo usuário. Amostra pessoal e noite inteira. Cada sucesso reservado gasto em Tilt dura um turno, sem dano; um sucesso reservado permite ataque Int + Medicine − Stamina + Tolerância Sobrenatural da vítima, cujo dano letal são os sucessos; um permite reduzir a próxima ação Social a dado de sorte. Título autoral confirmado: Éfige Amaldiçoada. |
| Swarm Form — Vampire p. 114 | **Usar os valores do livro**. Metamorfose 3; referência a Beast’s Skin/Pele da Fera. |
| Fire & Revolution — facções e Méritos pp. 72–76, 94–95 | **Usar os valores do livro**. Artefato Cultural: Status Carthiano 2; Experimentador de Devoções (Avançado): três Devoções da Disciplina característica do Clan escolhido; Imposição: Firearms 2 ou Weaponry 2; Bombista Incendiário: Vigor 1 (Disciplina/Ímpeto). |
| Therion — Dark Eras 2 p. 344 | **Corrigir conforme o PDF**, confirmado em 2026-10-05. Ponto de Ruptura quando Humanidade é maior que a pontuação do Sacrilégio; sem falso requisito mínimo ou teto de Humanidade para escolher Sacrilégios. |
| Gilded Cage — False Gods: Ventrue pp. 136–137 | **Corrigir conforme o PDF**, confirmado em 2026-10-05. Convergências são locais com sucesso excepcional em três sucessos; não concedem uma Condition. |
| Spider's Hijra — Dark Eras 2 p. 143 | **Manter 10 metros do catálogo**, confirmado em 2026-10-05. Exceção explícita: Potência × 10 metros, embora o PDF use jardas. |
| Espiral de Zirnitra — Secrets of the Covenants p. 200 | **Alinhar os resumos ao livro**, confirmado em 2026-10-05; sem alterar automaticamente compras ou XP existentes. Nível 2: desvantagens não ocorrem sempre; nível 3: desconto e reembolso por Mérito, não por ponto. Resumos alinhados sem reembolso automático de compras existentes. |
| Crúac — Secrets of the Covenants pp. 184–186 | **Usar as mecânicas do livro**, confirmado em 2026-10-05. Resumos alinhados, incluindo Força de Vontade para levantar os cinco Mantos; compras e recibos preservados. |
| Milagres — Secrets of the Covenants pp. 194–197 | **Usar as mecânicas do livro**, confirmado em 2026-10-05. Pledge p. 196 beneficia o vampiro e concede familiar animal demoníaco. Por decisão específica, familiar usa Lacaio (Ghoul) 5, já incluindo três pontos totais das Disciplinas do regente; não duplicá-los. Vampiro não mantém Touchstone e pode ver/falar pelo familiar. |
| Lithopedia — Strange Shades p. 28 | **Usar as mecânicas do livro**, confirmado novamente em 2026-10-05 após corrigir a premissa da primeira pergunta. Decisão final: usar o livro. Revisão visual corrigiu a premissa da pergunta anterior: meia milha quadrada inicial e meia milha adicional por Potência, limitada ao território; cinco resumos coincidem. |
| Leandros — Strange Shades pp. 39–40 | Foot in the Door / Heart Thief usam p. 39; Mr. Perfect / Only You / Shared Experience usam p. 40. Heart Thief custa três Experiências e exige tocar a vítima com Soulmate; resumo alinhado ao roubo da luz do amante. Recibos antigos continuam devolvendo as duas Experiências registradas. Shared Experience cria falsa memória de intimidade, sem presumir compartilhamento sensorial real. Correções seguem a preferência geral pelo livro; as cinco Devoções possuem PT e preços 2/3/3/2/3, respectivamente. |
| Mnemosyne — Strange Shades pp. 45–47 | Memoria Sanguinis começa na p. 45; Esuritio Lethes e Sanguis Veritatis na p. 46. Esuritio custa quatro Experiências; recibos antigos conservam uma. A condição de Força de Vontade da duração de Memoria foi restaurada ao campo correto; Sanguis recupera os quatro resultados e limites impressos. Os quatro nomes latinos permanecem originais. Hard Leverage → Alavancagem Dura acompanha Alavancagem Suave já usada no projeto. |
| Norvegi — Strange Shades pp. 51–53 | Blodtrell começa na p. 51 e Tordenvaer na p. 52; Frakka custa três Experiências e Tyvshand duas. Recibos antigos conservam os cinco pontos efetivamente pagos. Os quatro títulos noruegueses permanecem originais; referências a Preso usam a Complicação Core existente, sem duplicá-la. |
| Qedeshah — Strange Shades pp. 58–59 | But I Wanted You to Be a Doctor, ausente, recuperado por uma Experiência e ID próprio: Aspiração temporária, exceções à penalidade e quatro resultados. Taharah começa na p. 59, com três benefícios e limite de um santuário; Lebonah conserva dano, intervalo de um minuto, Drogado e bônus contra frenesi. Os nomes hebraicos permanecem originais. |
| Devoções gerais — Strange Shades pp. 86–87, primeiro lote | Visão Arcana, Gancho do Açougueiro, Pata de Gato e Imitador possuem PT completa. Butcher’s Hook e Cat’s Paw recuperam preço de duas Experiências; Cat’s Paw recupera requisito de toque e grafia canônica singular, mantendo ID. Copycat começa na p. 87 e copia aparência, não técnicas. Essas Devoções permitem outros Clans; um professor Mekhet pode ser exigido pelo Narrador, sem bloqueio inventado de Clan. |
| Encode Vitae / Familiar’s Eyes — Strange Shades p. 87 | Codificar Vitae recupera preparação do frasco e desconto de duas Experiências para Mnemosyne (três para os demais). Os seis modificadores saem da falha dramática para campos próprios EN/PT. Olhos do Familiar conserva escolha dos sentidos e +2 contra frenesi. O seletor de Devoções XP passa a exibir procedimento, resultado, sacramento e sucessos-alvo existentes, junto das demais regras. Recibos pagos por três permanecem por três. |
| Devoções gerais — Strange Shades pp. 88–89, segundo lote | Kuroko conserva seu título japonês e oculta a autoria do ataque, sem concessão inventada a outra pessoa. Longe dos Olhos, Longe da Mente separa seus quatro modificadores da falha dramática e referencia Falsas Memórias pelo título vigente. Sombra na Terra recupera preço de quatro para Család (cinco para os demais), com estornos antigos por cinco. Exterminador começa na p. 88, conserva alcance a pé e regras de Perseguição. |
| Twist of Fate / Wolf’s Clothing — Strange Shades pp. 89–90 | Reviravolta do Destino conserva uso de uma vez por noite, exclusão de ações resistidas/disputadas e a referência Resoluto. A falha dramática usa sessão em EN/PT conforme a equivalência aprovada. Pele de Lobo começa na p. 89, custa três Experiências e conserva disfarce, Confronto de Vontades, 9-novamente e limites de resistência; dados antigos e recibos não são reescritos. |
| Cutting the Strings / Timing Is Everything — Strange Shades pp. 87 e 89 | Cortando os Fios e O Momento é Tudo completam as Devoções da fonte. Ambas custam duas Experiências com uma instância canônica de Iniciação em Culto dos Mistérios 1 configurada como Moirai (três para os demais). Identidades ausentes/homônimos não concedem desconto; recibos antigos continuam estornando o valor pago. O Momento é Tudo recupera contato na última semana, alcance em milhas ou na cidade por laço de sangue e cinco modificadores; a melhoria de +1 Experiência sai da falha dramática para sua própria opção. |
| Cães do Inferno / Tyet / Iteru — Onyx Path | Artigos [Kerberos](https://theonyxpath.com/the-jaws-of-the-beast/) e [Khaibit](https://theonyxpath.com/the-shadow-and-the-asp/) conferidos em 2026-10-07; fontes marcadas como versão 2 no índice local. Gratuidade de Cães do Inferno, duas Experiências e requisitos de Tyet/Iteru preservados; Tyet explicita raio em jardas ou metros, ambas as unidades aceitas pela fonte. Nomes próprios egípcios permanecem originais. |
| Ba / Pseshkf / Udjat — The Shadow and the Asp | Ba não é descrito como ser no Crepúsculo nem converte o dano extra em letal; conserva movimento, imunidade à abjuração e interação com Pseshkf. Pseshkf acrescenta dano letal, sem inventar pontuação de arma; manipulação por Tyet é sinergia opcional, não requisito. Udjat conserva gratuidade, visão de seres imateriais e proteção contra possessão por Strix. Nomes, IDs e preços preservados. |
| .22 Sólido / Égide da Rebeldia / Sangue Preservado / Hekireki — David Hill | Quatro apresentações PT completas, requisitos e preços 1/2/2/2 preservados. Hekireki recupera gasto em Celeridade nos turnos posteriores sem acrescentá-lo ao ataque, confirmado pela [resposta do autor](https://forum.theonyxpath.com/forum/main-category/main-forum/the-new-world-of-darkness/vampire-the-requiem/1016390-secrets-of-the-covenants-hidden-devotions/page4); o nome japonês permanece. .22 conserva acumulação das reduções de Resiliência, também confirmada pelo autor. Os textos EN de Égide/Sangue são preservados; o acesso direto ao Pastebin permanece indisponível nesta revisão. |
| Rapidez / Devagar e Sempre — Hidden Devotions | PT completa e vínculo canônico em `devotion_targets`: Devoção por ID ou Disciplina por ID/nível. Requisito baseado no preço habitual/nível do alvo; preço 1/2/3 XP. Seleção obrigatória em novas compras; sem alvo não há cobrança. Ficha e histórico resolvem a escolha no idioma atual; recibos novos guardam alvo/custo. Estorno bloqueia a remoção de poderes/características dos quais a escolha ainda depende. Abrir/importar conserva as compras antigas sem inventar escolha. Fonte e adjudicação pendentes estão no backlog. |

## Decisões respondidas em 2026-10-07

Decisões aplicadas; nenhuma destas questões aguarda resposta.

| Registro / fonte | Decisão e aplicação |
| --- | --- |
| Christine — Wild Hunt: Gangrel p. 61 | Duração até o próximo nascer do sol conforme decisão de 2026-10-07; removida “Night” do campo Ação e alinhado o encerramento EN/PT. A fonte imprime Action: Night e next sunset; a interpretação específica aprovada prevalece. |
| Ripples in Still Water — Sin Again p. 61, custo fora da exceção | Revisão visual repetida da p. 61 confirma apenas gratuidade dos Apóstatas elegíveis. Não há preço impresso fora da exceção; preservadas duas Experiências sem atribuir esse valor ao livro. |
| Referências dos descontos — Wild Hunt: Gangrel pp. 105–106 | Resposta recebida: livros e efeitos diferentes são poderes diferentes. Não associar Face of the Trickster a Form of the Trickster nem inventar um ID para Awaken the Horrid Form. Descontos identificados continuam por ID; alternativas indisponíveis não concedem desconto. |
| Beautiful but Deadly — Sin Again: Daeva pp. 94–95 | Revisão visual das pp. 94–95 confirma ausência de preço de aprendizado. Mantidas duas Experiências conforme indicação do usuário e catálogo; corrigida Compostura na apresentação da parada. |
| Inure — Sin Again: Daeva p. 30 | Alvo vampiro ou mortal recuperado no resumo/efeito, com apresentação PT completa. Limite de trauma que resolve Inflamado usa Vigor efetivo = Vigor + Resiliência, conforme interpretação aprovada. |
| Ghost Skin / Pierce the Veil — Spilled Blood p. 85 | Esclarecimento recebido: Vitae ativa a etapa de Pele Espectral e a Força de Vontade permite outras Disciplinas em Perfurar o Véu. Campos EN/PT preservados; removida a falsa divergência. |
| Null Space — Spilled Blood p. 89 | Quatro Experiências confirmadas pelo usuário e preservadas. A edição local revisada visualmente na p. 89 não traz a frase de preço citada; registrar como decisão explícita, sem alegar confirmação visual inexistente. |
| Kin Maker / Dead Man’s Reprieve — Thousand Years of Night pp. 120 e 128 | Ambos custam quatro Experiências por decisão explícita; Dead Man’s Reprieve atualizado de uma para quatro sem reprecificar recibos. Falha dramática EN/PT recupera um quinto das plantas, morte de um participante, −2 na tentativa em até uma semana e Fuga. Parada/intervalo cadastrados permanecem, pois o PDF local não imprime alternativas. |
| Nightmare Journey — Dark Eras 2 p. 143 | Omitido do JSON ativo; entrada integral comentada em game-lines/vampire/deferred-beast-powers.ts para retomada com Beast. IDs e recibos existentes não são removidos nem reescritos. |
| Sharing the Familiar’s Form — Agony & Ecstasy p. 89 | Resumo EN/PT recupera aprendizado de uma Experiência para ghoul com Taste of the Wild e Força de Vontade de memorização humana adicional ao custo habitual de criação. Formas humanas possuem compra opcional em Discipline Options; ficha de ghoul fora desta meta. |


## Conditions Vampire — apresentação em execução

`condition-presentation.ts` aplica apenas os campos PT existentes na ficha Desktop/Mobile e em Homebrew; nomes canônicos, IDs, instâncias, persistência salva e textos autorais são preservados. A apresentação é aplicada depois da composição de errata; uma substituição sem tradução não herda o texto obsoleto.

Conditions já conferidas visualmente e localizadas:

| Fonte | Entradas / correções de catálogo |
| --- | --- |
| Better Feared pp. 31, 98, 101, 107 | Fome Avassaladora, Frenético, Desolado, Maldição Potente. Páginas, persistência, expiração, resoluções e Atos alinhados; restrições inventadas removidas. |
| Strange Shades p. 40 | Desprezado e Alma Gêmea. Dano solar, imunidades, alimentação, exigência mensal, resoluções e Atos recuperados. |
| False Gods pp. 26, 81, 98, 113 | Suplantado, Malkavia Crônica, Malkavia Terminal, Pareidolia, Diretiva. Suplantado pertence ao Piloto dos Hundred Faces; progressão de Malkavia, resistência, dano agravado e frenesi recuperados. Chapter = Session em EN/PT. A fonte só indica “The cure?” para a resolução da Crônica; nenhum método inventado. |
| Spilled Blood pp. 23, 28; Guide to the Night p. 135; Secrets of the Covenants pp. 184, 189 | Doença Radiofônica, Prometido, Agonizado, Verdades Primevas, Quebrador de Juramento(Membro). Agonizado e Prometido cadastrados com textos completos e IDs novos, sem modificar referências existentes. Quebrador de Juramento marca dois pontos de Status e um ponto de cada Mérito listado, quando possuído; resolução exige arriscar a Morte Final por um Invictus com reconhecimento. Qualificador de linha preservado. |
| Sin Again pp. 24–25, 30, 41 | Deprimido, Autodesprezo, Inflamado, Exaltado! Durações e expiração sem resolução, bônus de Pesadelo em Manipulação, alternativa de Ímpeto para Induzir e sucesso excepcional com três sucessos para Exaltado recuperados. Limite de trauma de Inflamado com Insensibilizar mantém Vigor + Resiliência conforme decisão aprovada. |
| Vampire pp. 301–302 | Viciado(Membro), Bestial, Encantado(Membro), Competitivo, Confuso, Delirante, Dependente, Distraído. Bestial/Competitivo recuperam penalidades, duração e proteção após resolver; Encantado distingue testes comuns e sobrenaturais. Delirante racionaliza uma exceção, sem suprimir a crença; Dependente é obsessão por mortal com Laço de Sangue de segundo estágio. Distraído não concede Ato ao resolver. Viciado mantém Integridade e vários vícios distintos no texto, sem novo fluxo de configuração. |
| Vampire pp. 302–303 | Dominado, Drenado, Extático, Enfraquecido. Dominado recupera cumprimento da ordem como resolução; Drenado explicita os tipos de esforço e a ausência de sua penalidade no teste de Vigor; Extático preserva alimentação e resistência; Enfraquecido recupera efeitos de Sem Alma e reposição até o novo máximo de Força de Vontade após a perda permanente. |
| Vampire pp. 303–304 | Escravizado, Cativado, Falsas Memórias, Assustado. Escravizado dispensa Perseverança apenas em Comando Sepultado/Possessão e exige ouvir a voz, sem contato visual. Cativado recupera persistência, duração, oposição com Força de Vontade/Ponto de Ruptura e Ato. Provas de Falsas Memórias causam Ponto de Ruptura; Assustado permite suprimir todos os efeitos por um turno e distingue a rota de fuga bloqueada. |
| Vampire pp. 304–305 | Humilhado(Membro), Intoxicado, Calejado, Lânguido. Calejado limita resistência ao frenesi pela Humanidade e proíbe Força de Vontade para contê-lo, mas permite Cavalgar a Onda; Lânguido aplica penalidade cumulativa a cada noite, exige Vitae por Potência de Sangue para despertar e resolve em torpor. Ambos não são persistentes nem concedem Ato; resumos anteriores corrigidos. Humilhado conserva Máscara/Réquiem; Intoxicado conserva penalidades e Portas. |
| Vampire p. 305 | Letárgico(Membro), Mesmerizado, Arrebatado, Saciado. Letárgico explicita proibição de Força de Vontade, penalidade/teste a cada seis horas e sono até o pôr do sol; resolução exige um dia inteiro. Mesmerizado preserva término sem resolução e bônus após resolver, sem limitá-lo ao mesmo vampiro. Arrebatado exige três sucessos para Cavalgar a Onda, sem confundir com sucesso excepcional. Saciado preserva o limiar de provocação. |

Textos de catálogo completos nos dados e regras específicas verificadas nos testes. IDs e instâncias existentes preservados; os lotes de Conditions não automatizam escolhas, modificadores, progressão, dano, concessões ou aquisição opcional.

## Compras adicionais e Enxame — concluídos

As sete **Discipline Options** possuem IDs independentes, dependências do poder-base e apresentação EN/PT Desktop/Mobile. Preço adicional das versões avançadas = total impresso menos preço canônico básico; recibos existentes não são reprecificados. Desativar uma fonte esconde novas escolhas, preservando histórico e dependências. Os detalhes de persistência e estorno estão em `AGENTS.md` e nos testes.

| Opção / fonte | Requisitos e custo adicional |
| --- | --- |
| Escultura da Carne: Uso Próprio — Wild Hunt p. 105 | Poder-base e Metamorfose 3; +1 XP. Não subtrai Vigor da própria parada nem exige Mesmerizado em si. |
| Fera Infernal: Rosto na Multidão — Better Feared p. 97 | Poder-base e Ofuscação 3; +1 XP. Familiar ignorado pelos mortais até atacar. |
| Compartilhando a Forma do Familiar: Ghouls Humanos — Agony & Ecstasy p. 89 | Poder-base e Pele de Cordeiro por IDs; +1 XP. Força de Vontade de memorização adicional ao custo habitual de criar ghoul. |
| Insensatez de Theseus: Avançada — Agony & Ecstasy p. 87 | Poder-base e Majestade ou Pesadelo 5; +1 XP, total 2. Permite alvos vampiros e resistência disputada por Compostura + Potência de Sangue. |
| Vigilância da Gárgula: Avançada — Vampire p. 144 | Poder-base e Metamorfose 5; +3 XP, total 4. Estátua imune a fogo/luz solar enquanto imóvel. |
| Máscara Mortuária: Avançada — Fire & Revolution p. 89 | Poder-base e Auspícios 3; +2 XP, total 3. Falsifica investigação sobrenatural com a parada impressa. |
| O Momento é Tudo: Mensagem por Gatilho — Strange Shades p. 89 | Devoção-base e Dominação 3 por IDs; +1 XP, independente do desconto Moirai no poder-base. Permite um evento como gatilho em vez de um horário. |


Maçã do Éden (benefícios ao destinatário humano) e Espiral de Zirnitra (preço de Méritos) não pertencem a essa categoria. A ressalva de fonte original para Rapidity/Slow and Steady está no backlog V05.

**Enxame:** Tilt ambiental `vtr-agony-ecstasy:swarm` atualizado pelo texto completo fornecido pelo usuário em 2026-10-07, substituindo a extrapolação anterior de Forma de Enxame. Dano contundente por turno aumenta com a concentração (exemplo: raios 8/4/2/1 metros causam 1/2/3/4); −2 em todas as jogadas dentro do raio; armadura integral fornece metade da pontuação. Apenas ataques de área o afetam; cada ponto de dano reduz seu tamanho pela metade, dispersando-o abaixo de uma jarda de raio. Conservar as unidades e o exemplo do texto recebido. Summon the Hunt → Convocar a Caçada acompanha o título já cadastrado do poder de Animalismo. Fonte impressa do bloco não informada; Agony & Ecstasy pp. 86–87 é a referência de uso em Dança do Enxame. Catálogo permanece em Vampire com ativação Homebrew e as 35 Complicações compartilhadas intactas.

## Evidência atual

- Última suíte completa: **603/603 testes seriais aprovados em 2026-10-07**, sem falhas, omissões ou cancelamentos; lint, TypeScript e build normal aprovados. Log: `work/ritual-localization-20261005/final-verified-full-suite.log`.
- Último lote V06 — Vampire p. 305, quarenta e quatro Conditions PT no total: **73/73 testes dirigidos aprovados** (`work/ritual-localization-20261005/vampire-conditions-core-sleep-gate.log`). Incluem catálogo congelado, composição de errata, fontes desativadas, texto autoral, qualificadores de linha e renderização das fichas completas Desktop/Mobile em EN/PT/EN sem alterar instâncias; as entradas Homebrew são verificadas também na respectiva superfície. Lote restrito a dados e verificações; lint, TypeScript e build normal do mecanismo de apresentação aprovados no lote inicial (`vampire-conditions-first-lint.log`, `vampire-conditions-first-types.log`, `vampire-conditions-first-build.log`). A suíte completa acima antecede esses lotes.
- Integração automatizada EN → PT → EN cobre criação, XP, cards Desktop/Mobile e Homebrew dos grupos já traduzidos, incluindo compras, estornos, identidades indisponíveis, fontes desativadas e preservação de textos autorais. Smoke de navegador permanece a cargo do usuário.
- Inventário e versões são mantidos nos catálogos e em `public/shared/data/catalog-manifest.json`; não duplicar carimbos ou históricos de gates nesta auditoria.
- **Meta integral ainda pendente:** concluir V05, V06 e Mage conforme o backlog. As auditorias com trabalho aberto permanecem; decisões já implementadas não voltam a ser perguntas.
