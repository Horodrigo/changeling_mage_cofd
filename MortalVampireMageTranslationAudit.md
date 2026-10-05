# Auditoria de tradução — Mortal, Vampire e Mage

Atualização: **2026-10-05**. **Meta ativa:** prioridade 0, localização das etapas 1–2 e correções aprovadas de Méritos Core implementadas e verificadas; etapa 3 em execução; etapa 4 pendente.

## Escopo e ordem

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
| V04 — Méritos | 397 (154 não Homebrew, 243 Homebrew), 80 níveis; nove erratas incluídas | Apresentações completas, nove erratas ativadas e correções de fonte aprovadas verificadas |
| V05 — Poderes | 546 registros, 140 níveis internos | 23/23 Disciplinas, seus 110 níveis, 5/5 Disciplinas Rituais, 2/2 Açoites, 5/5 fórmulas de Kimiya, 7/7 Sacrilégios de Therion, 10/10 Invocações de Gaiola Dourada, 5/5 Detournements, 6/6 Espirais com 30 níveis e 19/19 Escamas e 24/76 ritos de Crúac e 23/32 milagres Tebanos e 29/356 Devoções com PT. Restam 388 registros |
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

Poderes e níveis usam `presentationPt` estático e a visão de leitura própria `power-presentation.ts`; regras continuam recebendo os campos canônicos. Todas as 23 Disciplinas e os 110 níveis têm apresentação PT, com revisão visual dos PDFs locais e fontes/páginas mantidas em seus registros. Evolução Triádica inclui suas 15 Manifestações (Spilled Blood pp. 59–61) e Sucessos Alvo na ficha e no seletor de XP. Nomes descritivos acompanham as referências de Bloodlines já apresentadas; nomes próprios e Spiritus Sancti permanecem originais. Arrepio/Face da Fera corrigem antigas ocorrências de Besta; O Grande Delírio distingue a crença falsa de uma ilusão sensorial. Ímpeto continua distinto de Vigor; Graduação, Numina e Fraqueza de entidades efêmeras seguem o léxico vigente. Pele da Fera e Aspecto Sobrenatural reutilizam o léxico vigente; Oubliette recebe o título descritivo Masmorra do Esquecimento, conservando sua entrada canônica. Vitiate recebe o título descritivo Debilitação; Praestantia permanece original. Armas Brancas corresponde a Weaponry/Melee da ficha; Braço Lesionado, Cego, Surdo, Perna Lesionada e Mudo seguem o Core. Os três modificadores de Toque da Sombra aparecem também no seletor de XP; a referência Homebrew dispõe do mesmo campo.

Referências para Conditions: Sated → **Saciado**, Ecstatic → **Extático**, Confused → **Confuso**, Dominated → **Dominado**, Mesmerized → **Mesmerizado**, Enthralled → **Cativado**, Delusional → **Delirante**, Frightened → **Assustado**, Scarred → **Marcado por Cicatrizes**, Materialized → **Materializado**. Steadfast/Broken usam **Resoluto/Quebrado** do Core; False Memories conserva **Falsas Memórias**; Charmed usa **Encantado(Membro)** e Swooning/Swooned, **Enamorado**. Radio Sickness recebe a referência **Doença Radiofônica**; Shaken conserva **Abalado** do Core. Power Surge é apresentado como **Sobrecarga Elétrica** na referência de Interface; não há entrada desse Tilt nos catálogos atuais e nenhuma regra/ID foi acrescentada.

As cinco Disciplinas Rituais usam a mesma apresentação nos cards Desktop/Mobile, seletor de XP e referência Homebrew. Status exigido e Humanidade Máxima de Crúac aparecem nos detalhes. Fontes revisadas visualmente: Vampire 2e pp. 150–152, Dark Eras 2 pp. 143 e 344–345, e False Gods: Ventrue pp. 136–137. Gaiola Dourada conserva sua origem Homebrew; Meios e Recursos traduz Ways and Means. Referências de Conditions: Jaded → **Calejado**, Humbled → **Humilhado(Membro)**, Stumbled → **Vacilante**, Raptured → **Arrebatado**; Inspired conserva **Inspirado** do Core. Convergência é um local, não uma Condition recebida. O catálogo de Conditions permanece no seu próprio backlog.

Os dois Açoites de Grilhão de Sangue têm apresentação PT de título, resumo, requisito, procedimento e resultado na ficha, XP e Homebrew: **Júbilo de Ferro** e **Banquete Compartilhado**. False Gods: Ventrue pp. 24–25 revisado visualmente; referências reutilizam Extremos da Matilha e Euforia Coletiva. IDs históricos `devotion-iron-joy` e `devotion-shared-feast` preservados, sem reclassificar compras. As Escamas de Voivode reutilizadas como Açoites continuam no lote de Escamas.

As cinco fórmulas de Kimiya têm os campos existentes apresentados em PT nos cards de rituais e no seletor de XP, incluindo Sucessos Alvo. Dark Eras 2 pp. 143–145 revisado visualmente. Al-Ajsad permanece original; Khol de Sayih preserva o nome próprio; Hijra da Aranha, Maldição do Príncipe Macaco e Cavalo de Ébano localizam títulos descritivos. Imobilizado reutiliza a Complicação Core. O seletor de rituais reutiliza o catálogo visual compartilhado, mantendo os IDs e as opções de compra da linha; os outros grupos de rituais receberão seus próprios textos nos lotes seguintes.

Os sete Sacrilégios de Therion têm apresentação PT dos campos existentes na ficha e no seletor de XP. Dark Eras 2 pp. 345–346 revisado visualmente; Avatar de Apollyon preserva o nome próprio. As referências reutilizam Culpado, Derrotado, Lascivo e Materializado; Poder, Refinamento e Resistência seguem os Atributos efêmeros. Alcance de 30 metros, Sucessos Alvo, paradas e durações permanecem canônicos.

As dez Invocações de Gaiola Dourada têm apresentação PT na ficha, XP e Homebrew, incluindo Meios e Recursos e Sucessos Alvo. False Gods: Ventrue pp. 137–139 revisado visualmente. Referências de página corrigidas: Crowdsourcing/Green Light → 137; Cordon/Gerrymandering → 138. Apenas apresentação e citações alteradas; regras e IDs preservados. Mobilização Coletiva, Sinal Verde, Sinal Vermelho, Isolamento, Manipulação de Distritos, Semiótica, Trânsito Rápido, Rezoneamento, Sinóptico e Renovação localizam títulos descritivos. Ação Avançada permanece distinta de Rotina; Stampede recebe Debandada apenas como referência textual, sem criar ID ou efeito.

Os cinco Detournements têm títulos descritivos, resumos, requisitos, procedimentos e resultados PT na ficha, XP e Homebrew. Strange Shades: Mekhet pp. 78–79 revisado visualmente. Requisitos opcionais reutilizam os títulos dos poderes de Auspex; Sem Alma e Memória Eidética seguem Core. O seletor de XP reaproveita o catálogo visual de rituais sem alterar o acesso pela Iniciação na Sala de Moldagem. Os cards de outros poderes também resolvem a apresentação por definição e localizam o rótulo de tipo; compras e textos autorais permanecem canônicos.

As seis Espirais e seus 30 níveis têm os campos existentes apresentados em PT na ficha e no seletor de XP. Vampire 2e pp. 155–158, Secrets of the Covenants pp. 200–201 e Thousand Years of Night pp. 81–82 revisados visualmente; todos são fontes 2e no índice local. Zirnitra e Ziva preservam nomes próprios; Quintessência localiza o título descritivo. Fera, Rubor da Vida, Cavalgar a Onda, Local Seguro, Refúgio, Privado, Culpado, Coagido e Notoriedade seguem o léxico vigente. Apenas os resumos autorizados de Zirnitra 2/3 alteram o inglês canônico; demais regras e ruleEffects preservados.

As dez Escamas de Vampire 2e pp. 156–159 têm apresentação PT de título, resumo, pré-requisito, procedimento, resultado e demais campos existentes na ficha e no XP; páginas revisadas visualmente. Requisitos exibem os nomes das Espirais, preservando IDs/valores canônicos para o parser. O seletor reutiliza o catálogo visual e apresenta o custo calculado pelo fluxo existente, uma ou duas Experiências; essa exibição não altera regras de acesso. Escama/Escamas corrige a antiga forma Escala/Escalas na interface. As nove Escamas suplementares também têm apresentação PT: Spilled Blood p. 101, Secrets of the Covenants pp. 200–202 e Thousand Years of Night pp. 82–83 revisados visualmente. Referências reutilizam Ninho do Dragão, Vínculo Espiritual, as Espirais e as Disciplinas localizadas, sem alterar requisitos canônicos.

Os dez ritos de Crúac de Vampire 2e pp. 152–153 têm apresentação PT dos títulos e de todos os campos existentes na ficha Desktop/Mobile e no XP; páginas revisadas visualmente. Os nomes Cheval e Rigor Mortis permanecem. O inventário Homebrew também usa a apresentação localizada quando disponível, conservando os textos autorais. Sucessos Alvo, números, IDs e conteúdo canônico intactos. Restam 52 ritos suplementares/publicados.

Os 14 ritos de Secrets of the Covenants pp. 184–186 também têm apresentação PT; páginas revisadas visualmente. Por decisão do usuário em 2026-10-05, Donning the Beast’s Flesh custa um Vitae e três turnos para transformar; Mantle of Amorous Fire gasta Força de Vontade para levantar; Curse of Aphrodite’s Favor exige três noites separadas; Gorgon’s Gaze distingue petrificação parcial agravada de transformação completa letal para Membros; Bounty of the Storm fornece equipamento Dinheiro com Disponibilidade cinco e arrisca Desapego em Humanidade 2 ou menos. Os cinco Mantos explicitam um ponto de Força de Vontade para levantar após a dança. Outras regras, IDs, compras e XP preservados.

Os nove milagres de Feitiçaria Tebana de Vampire 2e pp. 153–154 têm apresentação PT dos títulos e de todos os campos existentes na ficha Desktop/Mobile e no XP; páginas revisadas visualmente. O seletor de XP agora também exibe o sacramento, antes omitido pelo helper de detalhes. O inventário Homebrew usa a mesma apresentação quando disponível. Teto de Humanidade, paradas, Sucessos Alvo, custos e IDs canônicos preservados. Restam nove milagres suplementares/publicados.

Os 14 milagres de Secrets of the Covenants pp. 194–197 também têm apresentação PT; páginas revisadas visualmente. Por decisão do usuário em 2026-10-05, Maçã do Eden usa uma gota de Vitae; Aparição da Hoste distingue a vítima Assustada dos espectadores mortais Assombrados; Ícone Sangrento dura até o fim da noite e não presume imunidade ao Vinculum; A Estrela Guia oferece uma noite de refúgio, prorrogável com Força de Vontade; Apocalipse começa em meia milha de raio e aumenta meia milha a cada cinco sucessos além dos dez iniciais, sem acrescentar Confronto de Vontades. Juramento ao Indigno dá benefícios ao vampiro e um familiar demoníaco em forma animal, com visão e fala através dele. Por decisão adicional do usuário, o familiar usa Lacaio (Ghoul) 5: os três pontos totais das Disciplinas do regente já integram esse Lacaio. O vampiro não pode manter Touchstone. IDs, compras, XP e recibos preservados.

Todas as 29 Devoções do livro básico Vampire 2e pp. 142–149 têm apresentação PT dos títulos, requisitos, resumos, efeitos e resultados existentes na ficha Desktop/Mobile e no XP; páginas revisadas visualmente. O seletor de XP e o inventário Homebrew aplicam a apresentação localizada, mantendo o parser nos pré-requisitos canônicos. Referências conservam Mesmerizado, Cativado, Subserviente, Escravizado e os nomes dos poderes já localizados; 10-novamente segue Core. A referência de Mérito a Escalas foi uniformizada para Escamas. Dilúvio de Pragas conserva gatos, aves e insetos, sem restringir o título a vermes. Toque da Privação mantém Auspícios na parada, conforme impresso, embora não seja pré-requisito da Devoção. Restam 327 Devoções suplementares/publicadas.

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
- Numina do Familiar já apresentada: Fascínio, Rajada, Enlouquecer, Drenar, Aura Emocional, Decadência Entrópica, Incendiário, Alucinação, Implantar Missão, Chave Canhota, Mascara Mortal, Desbravador, Regenerar, Buscar, Velocidade, Sinal, Inabalável e Telecinese. Propostas posteriores à confirmação histórica, já aplicadas; não equivalem à aprovação de nomes homônimos em outras linhas.

## Decisões respondidas pelo usuário — 2026-10-04 e 2026-10-05

Estes pontos **já receberam resposta; aplicação, conservação ou trabalho autorizado constam na última coluna**. Permanecem aqui como decisões para os próximos catálogos, não como perguntas abertas. As correções mecânicas solicitadas pelo usuário são trabalho adicional autorizado; a tradução isolada continua preservando as demais regras.

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
| Cheap Shot / Choke Hold — Core p. 61 | **Adicionar −2 cumulativo apenas a Cheap Shot**, conforme confirmação posterior após revisão do PDF. Choke Hold não recebe essa penalidade. | Core p. 61 revisado visualmente. EN/PT de Golpe Baixo explicitam que cada uso na cena impõe −2 cumulativo aos usos seguintes. Os limites de Choke Hold também estão aplicados, conforme sua decisão específica abaixo. |
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
| Choke Hold — Core p. 61 | **Completar o resumo conforme o livro**; o −2 cumulativo continua exclusivo de Cheap Shot. | EN/PT agora explicitam sucessos maiores que duas vezes o Vigor da vítima, duração 6 − Vigor minutos, Segurar prévio e soma em turnos posteriores. |
| Curse Effigy — Hurt Locker p. 73 | **Sucessos de criação formam uma reserva**, conforme interpretação detalhada pelo usuário. | EN/PT explicitam amostra pessoal, noite inteira, gasto por turno de Complicação sem dano, um sucesso reservado por ataque letal ou dado de sorte Social, dano igual aos sucessos do ataque e descarte da reserva. A fórmula conserva − Vigor da vítima + Tolerância Sobrenatural da vítima. O título PT **Éfige Amaldiçoada** foi editado e confirmado pelo usuário; 24/24 testes dirigidos aprovados após a inclusão. |
| Swarm Form — Vampire p. 114 | **Usar os valores do livro**. | Requisito corrigido para Metamorfose 3; o resumo EN/PT referencia Beast's Skin/Pele da Fera. Nome, ID e demais valores preservados. |
| Fire & Revolution — facções e Méritos pp. 72–76, 94–95 | **Usar os valores do livro**. | Oito páginas corrigidas para 72/73/75/75/76/76/76/76. Artefato Cultural exige Status Carthiano 2; Experimentador de Devoções (Avançado) exige três Devoções que usem a Disciplina característica do Clan escolhido; Imposição exige Armas de Fogo 2 ou Armas Brancas 2; Bombista Incendiário exige Ímpeto 1. Requisitos e apresentação EN/PT alinhados; nenhuma compra ou escolha persistida é reescrita. |
| Therion — Dark Eras 2 p. 344 | **Corrigir conforme o PDF**, confirmado em 2026-10-05. | EN/PT agora causam Ponto de Ruptura quando a Humanidade é maior que a pontuação do Sacrilégio. Removidos o falso requisito mínimo e o limite de Humanidade nas escolhas de Sacrilégios pagos/gratuitos; pontuação de Therion, acesso e escolhas existentes preservados. |
| Gilded Cage — False Gods: Ventrue pp. 136–137 | **Corrigir conforme o PDF**, confirmado em 2026-10-05. | EN/PT descrevem Convergências como locais onde os testes do ritual obtêm sucesso excepcional com três sucessos em vez de cinco. Não se recebe uma Condition Convergência. |
| Spider's Hijra — Dark Eras 2 p. 143 | **Manter 10 metros do catálogo**, confirmado em 2026-10-05. | Raio de Potência × 10 metros conservado em EN/PT por decisão do usuário; o PDF usa Potência × 10 jardas. Não aplicar a diferença de unidades aos outros poderes. |
| Espiral de Zirnitra — Secrets of the Covenants p. 200 | **Alinhar os resumos ao livro**, confirmado em 2026-10-05; sem alterar automaticamente compras ou XP existentes. | Decisão recebida: nível 2 deve explicitar que as desvantagens não ocorrem sempre; nível 3 descreve uma Experiência de desconto por Mérito e reembolso retroativo por Mérito já possuído. Aplicado em EN/PT após revisão visual: nível 2 conserva falhas dramáticas e distingue as desvantagens; nível 3 descreve aumento das paradas com Vitae, desconto e reembolso por Mérito. Nenhum estorno automático nem alteração de compras existentes foi implementado. |
| Crúac — Secrets of the Covenants pp. 184–186 | **Usar as mecânicas do livro**, confirmado em 2026-10-05. | Quatorze ritos localizados; cinco divergências corrigidas e custo de Força de Vontade dos cinco Mantos explicitado conforme o PDF. Sem reescrever compras, XP ou recibos. |
| Milagres — Secrets of the Covenants pp. 194–197 | **Usar as mecânicas do livro**, confirmado em 2026-10-05. | Quatorze milagres localizados e seis divergências corrigidas. Pledge p. 196 dá benefícios ao vampiro e um familiar demoníaco em forma animal. Por decisão posterior do usuário, o familiar usa Lacaio (Ghoul) 5: três pontos totais das Disciplinas do regente, sem duplicá-los. O livro impede manter Touchstone e permite ver/falar pelo familiar; resumos EN/PT explicitam essas regras. |
| Lithopedia — Strange Shades p. 28 | **Usar as mecânicas do livro**, confirmado novamente em 2026-10-05 após corrigir a premissa da primeira pergunta. | Revisão visual confirma meia milha quadrada inicial e meia milha adicional por Potência, limitada ao território. Os cinco níveis EN/PT já coincidem; conservados sem alterar IDs ou alcance. |

Conteúdo de origem Vampire/Mage distribuído como Core conserva a classificação e a elegibilidade cadastradas, inclusive Homebrew. Tradução não cria acesso geral a Méritos exclusivos nem presume exceções do Narrador.

## Verificação atual

- **397/397 Méritos Vampire**, incluindo os 80 níveis, e **56 Bloodlines** com apresentação PT completa. As nove erratas ativadas conservam identidades e campos herdados; conteúdo autoral não é traduzido automaticamente.
- **23/23 Disciplinas Vampire, 110 níveis, 5/5 Disciplinas Rituais, 2/2 Açoites, 5/5 fórmulas de Kimiya, 7/7 Sacrilégios de Therion, 10/10 Invocações de Gaiola Dourada, 5/5 Detournements, 6/6 Espirais com 30 níveis e 19/19 Escamas e 24/76 ritos de Crúac e 23/32 milagres Tebanos e 29/356 Devoções** apresentados em PT. Restam os 388 registros dos demais grupos; Conditions, Breaking Points, presets e Mage permanecem no backlog inicial.
- As quatro decisões finais estão aplicadas: Choke Hold e Curse Effigy em EN/PT; Swarm Form com Metamorfose 3/Pele da Fera; Fire & Revolution com oito páginas e quatro requisitos corrigidos conforme o PDF. Apenas os campos autorizados foram alterados; IDs, compras, XP, estornos e textos autorais permanecem preservados.
- Manifesto `catalogVersion` **114**; recursos Core de Méritos **17/19**, Changeling **6/8**, `merits-vampire` **15**, `merits-vampire-pt` **25**, `vampire-bloodlines` **14**, `vampire-powers` **56**.
- **589/589 testes da suíte completa serial aprovados** após compor os lotes de localização e o trabalho de elegibilidade `036923b`. A contagem de Zirnitra foi atualizada e passou; os resultados antigos de contagem e avisos transitórios foram substituídos por esta verificação.
- Integração EN/PT/EN cobre criação, XP, cards Desktop/Mobile e Homebrew dos grupos traduzidos, incluindo acesso por Clan/Bloodline/Coalizão, campos mecânicos existentes, Sucessos Alvo, modificadores e níveis adquiridos. Compras, recibos, estornos por ID e textos autorais preservados. O seletor de XP inclui o sacramento dos milagres.
- Últimos gates de lint, TypeScript, build e comparação canônica aprovados. Corrigidos somente os campos de regras/fonte autorizados nas decisões acima; os demais lotes alteram apresentação.
- As seis cirurgias Typhos passaram para Core no trabalho paralelo, com IDs e PT preservados: 208 Méritos Core e 397 Vampire, sem registros PT órfãos.
- Devoções Core até a p. 147: **76/76 testes dirigidos**, lint, TypeScript e build aprovados; **15/15 testes de integração e catálogos** reexecutados após uniformizar Feitiçaria de Sangue. EN/PT/EN cobre 22 definições na ficha e no XP, inclusive os cinco modificadores das duas versões de Convocação. Requisitos canônicos, histórico e estorno por ID preservados. A comparação canônica dos lotes confirma somente a remoção anterior do rodapé extraído indevidamente em Quicken Sight; este lote conserva todas as regras, números e IDs.
- Devoções Core pp. 148–149: **15/15 testes de integração e catálogos**, lint, TypeScript e build aprovados. EN/PT/EN cobre todas as 29 Devoções do livro básico na ficha e no XP. Comparação canônica confirma regras, IDs, paradas, limites e efeitos intactos; compras e recibos não são reescritos.
- Crúac Secrets pp. 184–186: **76/76 testes dirigidos**, lint, TypeScript e build aprovados. EN/PT/EN cobre 24 ritos na ficha e no XP; regressões verificam custos, transformação, noites separadas, petrificação e equipamento Dinheiro. Comparação canônica restrita às correções autorizadas e custos explícitos dos Mantos; IDs, compras, XP e recibos intactos.
- Milagres Secrets pp. 194–197 e esclarecimento de Lithopedia: **76/76 testes dirigidos**, lint, TypeScript e build aprovados. EN/PT/EN cobre 23 milagres na ficha e no XP. Regressões verificam sacramento, espectadores, duração, raio, familiar Lacaio (Ghoul) 5 com três pontos totais e os cinco alcances de Lithopedia. Comparação canônica restrita aos seis milagres autorizados; outras regras, IDs, compras, XP e recibos intactos.
- Léxico Vampire: **Potência de Sangue** uniformizada em 20 campos de apresentação de poderes e dois requisitos PT de Méritos, conforme a interface e o léxico vigente. **18/18 testes de integração e catálogos**, lint, TypeScript e build aprovados. Apenas apresentação PT alterada; dados canônicos, IDs, compras, XP e recibos preservados.
- Alterações autorais dos commits `a6a28a1` e `7268e69` preservadas. Meta retomada pelo usuário em 2026-10-05; continuar pelo backlog inicial. Sem smoke de navegador; a meta integral ainda não está concluída.
