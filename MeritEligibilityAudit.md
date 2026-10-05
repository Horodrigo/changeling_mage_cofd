# Auditoria de elegibilidade dos Merits de Vampire

Implementação concluída em 05/10/2026 para os **264 registros existentes dos sete suplementos homebrew de Vampire**, incluindo as erratas distribuídas. Este documento registra regras e cobertura; AGENTS.md e o código são a referência arquitetural vigente.

As **239 flags `descriptivePrerequisites`** foram removidas dos catálogos estáticos Core/Vampire. A lista anterior completa permanece em [MeritTextPrerequisitesInventory.md](MeritTextPrerequisitesInventory.md), como registro histórico solicitado pelo usuário. Homebrews pessoais continuam usando requisitos estruturados e texto narrativo descritivo.

## Regras aplicadas

- Criação e XP usam a mesma elegibilidade de Vampire, com traits atuais, ratings pretendidos, escolhas de configuração e referências canônicas por ID. Merits incompatíveis podem continuar visíveis no catálogo para explicar a restrição, mas não são elegíveis para compra.
- Traits, Disciplinas, Blood Sorcery, Blood Potency, Humanity máxima, Status no domínio correto, Specialties, requisitos de outros Merits, Devotions conhecidas, Touchstone, Conditions, ausência de bloodline, exclusões e acesso na criação são verificados automaticamente.
- Os Human Merits de Agony & Ecstasy e Fire & Revolution permanecem compartilhados conforme os livros. Carousing exige Presence 3 e Socialize 2; Electioneer exige Politics 2 e Resources 1. Experimental Mindset e Flexible Loyalties não têm prerequisites impressos.
- As restrições de seção Acolyte/Firebrand e Gangrel são aplicadas, respeitando exceções impressas, como Chorister. Permissões excepcionais do Storyteller e condições narrativas permanecem para a mesa; não foi criado um campo de confirmação narrativa.
- Crúac Styles são mutuamente exclusivos e incompatíveis com Mythologist (Advanced). Void Familiar é um complemento de Opening the Void. Unmasked Devil verifica as Disciplinas de cada nível comprado. Sophocrat aplica sua substituição de Status apenas aos Merits carthianos elegíveis.
- Mortals-only ficam bloqueados para templates sobrenaturais; Vampire fornece a exceção de Coil of Zirnitra e seu limite de Merits, resolvendo definições canônicas. As seis cirurgias Typhos foram movidas para Core, preservando IDs, e são mortal-only, com a exceção Zirnitra autorizada pelo usuário. Traits do médico não são tratados como traits do paciente.
- Requisitos de carniçal permanecem indisponíveis ao template Vampire atual. A aplicação não tem um template de carniçal. Não houve conversão automática de personagens ou remoção de compras/recibos existentes.

## Fontes e decisões

PDFs locais de `pdfSources/Vampire/` foram usados como autoridade para estes homebrews; o texto extraído serviu de índice e as páginas pertinentes foram renderizadas e conferidas visualmente. Entre as referências verificadas: Agony & Ecstasy pp. 67, 70, 72, 74, 90–99, 105–107; Fire & Revolution pp. 72–77, 93–103, 114–115; Sin Again pp. 34–35, 46, 50–51, 56, 61, 99–102; Wild Hunt pp. 38, 44, 55, 61, 66–68, 71, 107–111; Strange Shades pp. 34, 51, 58, 73, 76, 90–92; Better Feared pp. 23–25, 46–47, 78–79, 101–104; False Gods pp. 48, 54, 59–60, 64–65, 111–115, 139.

As condições narrativas não registradas são adjudicadas pela mesa por instrução do usuário. Quantity Over Quality mantém a exclusão recíproca com Quality Over Quantity, corrigindo o aparente requisito autorreferente impresso com autorização do usuário. Cirurgias Typhos permitem Mortals/Vampires com Zirnitra por autorização explícita do usuário.

Escopo: elegibilidade dos Merits já catalogados. Não reconstrói efeitos completos, não importa outros poderes/Merits ausentes dos catálogos e não implementa sistemas narrativos adicionais.

## Cobertura automatizada

`tests/vampire-merit-prerequisites.test.mjs` verifica a remoção das flags em todos os 264 registros, limiares numéricos simples de cada registro e referências estruturadas, além de cenários de OR/máximos, templates, nomes alterados, IDs indisponíveis/Homebrew, Status, estilos, escolhas, Devotions, errata, cirurgias e Zirnitra. As suítes existentes verificam os demais fluxos e a arquitetura. Browser smoke fica a cargo do usuário, conforme a skill do projeto.

Validação final: lint, TypeScript, build e `git diff --check` passaram. A execução completa teve 588 testes: 581 passaram e sete falharam por expectativas antigas de contagem/campos de contexto, atualizadas nesta alteração. A reexecução dos arquivos afetados passou (78 testes), seguida pelas regressões finais de prerequisites, reedição, catálogos, criação e arquitetura (45 testes), também sem falhas. A reedição verifica traits recompostos com bônus de clã, XP e benefícios de Merits, preservando a ficha original.

## Inventário auditado

Os pré-requisitos abaixo são os textos canônicos atuais. Regras de seção, exclusões, requisitos estruturados e controles especiais também são aplicados, mesmo quando a coluna contém “Nenhum”. A numeração do catálogo pode refletir referências históricas; as regras alteradas foram verificadas nas páginas impressas acima.

### Agony & Ecstasy: Circle of the Crone (45)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Mythologist · `h-vtr-agony-ecstasy:mythologist` | Occult •• with two mythological Specialties | Duas Specialties em Occult verificadas; pertinência a mitologias/religiões/tradições folclóricas: mesa. |
| Carousing · `h-vtr-agony-ecstasy:carousing` | Presence •••; Socialize •• |  |
| Poisoner's Garden · `h-vtr-agony-ecstasy:poisoner-s-garden` | Science or Survival •••; Safe Place • |  |
| Roughing It · `h-vtr-agony-ecstasy:roughing-it` | Stamina •••; Survival •• with an outdoor Specialty | Specialty em Survival verificada; pertinência ao ambiente escolhido: mesa. |
| Spell Swallowing · `h-vtr-agony-ecstasy:spell-swallowing` | Circle of the Crone Status ••; Occult •• |  |
| Neidan Gu · `h-vtr-agony-ecstasy:neidan-gu` | Circle of the Crone Status ••; Crafts •• |  |
| Uncaged Indulgence · `h-vtr-agony-ecstasy:uncaged-indulgence` | Circle of the Crone Status ••; Expression •• |  |
| Unconscious Alignment · `h-vtr-agony-ecstasy:unconscious-alignment` | Circle of the Crone Status ••; Academics •• |  |
| Annis Bite · `h-vtr-agony-ecstasy:annis-bite` | Nenhum |  |
| Apothecary · `h-vtr-agony-ecstasy:apothecary` | Witch's Brew; Crafts or Science ••• |  |
| Athame · `h-vtr-agony-ecstasy:athame` | Nenhum |  |
| Banshee · `h-vtr-agony-ecstasy:banshee` | Occult •••; Crúac •• |  |
| Blood Cult · `h-vtr-agony-ecstasy:blood-cult` | Circle of the Crone Status •• |  |
| Closer Family · `h-vtr-agony-ecstasy:closer-family` | Close Family; Crúac •• |  |
| Conflict of Faith · `h-vtr-agony-ecstasy:conflict-of-faith` | Nenhum |  |
| Hag Blood · `h-vtr-agony-ecstasy:hag-blood` | Ghoul |  |
| Hunting Party · `h-vtr-agony-ecstasy:hunting-party` | Circle of the Crone Status •• |  |
| Infectious Aura · `h-vtr-agony-ecstasy:infectious-aura` | Occult •••; Humanity 6 or lower |  |
| Master's Shadow · `h-vtr-agony-ecstasy:master-s-shadow` | Warden or Animal Ken ••• | A alternativa narrativa Warden é adjudicada pela mesa; Animal Ken é automático. |
| Mythologist (Advanced) · `h-vtr-agony-ecstasy:mythologist-advanced` | Mythologist; Crúac •; cannot have a Crúac Style Merit |  |
| Older Than I Look · `h-vtr-agony-ecstasy:older-than-i-look` | Intimidation ••; Embraced as a child or teenager | Template Vampire automático; idade ao Abraço: mesa. |
| Sacrificial Inurement · `h-vtr-agony-ecstasy:sacrificial-inurement` | Resolve •••; Humanity 6 or lower |  |
| Sustaining the Pack · `h-vtr-agony-ecstasy:sustaining-the-pack` | Animal Ken ••• |  |
| Temple · `h-vtr-agony-ecstasy:temple` | Altar; Circle of the Crone Status ••; Safe Place • |  |
| Red Vein of Fate · `h-vtr-agony-ecstasy:red-vein-of-fate` | Crúac •• |  |
| Reviled · `h-vtr-agony-ecstasy:reviled` | Cannot have Kindred Status in the chosen covenant |  |
| Underground Matron · `h-vtr-agony-ecstasy:underground-matron` | Circle of the Crone Status •••; Streetwise or Survival •• |  |
| Witch's Brew · `h-vtr-agony-ecstasy:witch-s-brew` | Resources •; Occult •••; Crúac • |  |
| Unmasked Devil · `h-vtr-agony-ecstasy:unmasked-devil` | Intimidation •••; Humanity 6 or lower |  |
| Opening the Void · `h-vtr-agony-ecstasy:opening-the-void` | Nenhum |  |
| Omen Plague · `h-vtr-agony-ecstasy:omen-plague` | Nenhum |  |
| Primal Creation · `h-vtr-agony-ecstasy:primal-creation` | Nenhum |  |
| Shadow Calling · `h-vtr-agony-ecstasy:shadow-calling` | Nenhum |  |
| Sating the Crone · `h-vtr-agony-ecstasy:sating-the-crone` | Nenhum |  |
| Storm Herald · `h-vtr-agony-ecstasy:storm-herald` | Nenhum |  |
| Void Familiar · `h-vtr-agony-ecstasy:void-familiar` | Opening the Void |  |
| Unbridled Chaos · `h-vtr-agony-ecstasy:unbridled-chaos` | Nenhum |  |
| Mandragora Garden · `h-vtr-agony-ecstasy:mandragora-garden` | Kindred; Safe Place • |  |
| Sorcerer's Harvest · `h-vtr-agony-ecstasy:sorcerer-s-harvest` | Mandragora Garden •; Crúac • |  |
| Red Thumb · `h-vtr-agony-ecstasy:red-thumb` | Mandragora Garden •; Occult •• |  |
| Witch's Garden · `h-vtr-agony-ecstasy:witch-s-garden` | Red Thumb; Blood Potency 2 |  |
| What You've Done for Her Lately · `h-vtr-agony-ecstasy:what-you-ve-done-for-her-lately` | Nenhum |  |
| Chorister — Errata · `h-vtr-agony-ecstasy:chorister-errata` | Not a member of the Circle of the Crone |  |
| Temple Guardian — Errata · `h-vtr-agony-ecstasy:temple-guardian-errata` | Nenhum |  |
| Viral Mythology — Errata · `h-vtr-agony-ecstasy:viral-mythology-errata` | Nenhum |  |

### Fire & Revolution: Carthians (66)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Experimental Mindset · `h-vtr-fire-revolution:experimental-mindset` | Nenhum |  |
| The Fix Is In · `h-vtr-fire-revolution:the-fix-is-in` | Subterfuge ••; Larceny ••; Electioneer • |  |
| Electioneer · `h-vtr-fire-revolution:electioneer` | Politics ••; Resources • |  |
| Flexible Loyalties · `h-vtr-fire-revolution:flexible-loyalties` | Nenhum |  |
| Objection! · `h-vtr-fire-revolution:objection` | Expression •• |  |
| Poll Watcher · `h-vtr-fire-revolution:poll-watcher` | Wits •••; Politics •• |  |
| Rabblerouser · `h-vtr-fire-revolution:rabblerouser` | Inspiring; Expression •• |  |
| Turnabout · `h-vtr-fire-revolution:turnabout` | Nenhum |  |
| Ratfucker · `h-vtr-fire-revolution:ratfucker` | Nenhum |  |
| You'll Be First Against the Wall · `h-vtr-fire-revolution:you-ll-be-first-against-the-wall` | Nenhum |  |
| Rules Lawyer · `h-vtr-fire-revolution:rules-lawyer` | Resolve •••; Academics •• |  |
| Bloodroots Associate · `h-vtr-fire-revolution:bloodroots-associate` | Carthian Movement Status •• |  |
| Cultist of Self · `h-vtr-fire-revolution:cultist-of-self` | Carthian Movement Status •• |  |
| Digital Upriser · `h-vtr-fire-revolution:digital-upriser` | Carthian Movement Status •• |  |
| Carthian Atheist · `h-vtr-fire-revolution:carthian-atheist` | Carthian Movement Status •• |  |
| Oppositionist · `h-vtr-fire-revolution:oppositionist` | Carthian Movement Status •• |  |
| Sabotage Artist · `h-vtr-fire-revolution:sabotage-artist` | Carthian Movement Status •• |  |
| Sophocrat · `h-vtr-fire-revolution:sophocrat` | Carthian Movement Status •• |  |
| PPI Cadreman · `h-vtr-fire-revolution:ppi-cadreman` | Carthian Movement Status •• |  |
| Antagonizing Aura · `h-vtr-fire-revolution:antagonizing-aura` | Presence ••• |  |
| Beast Gestalt · `h-vtr-fire-revolution:beast-gestalt` | Member of a colony | Pertencimento à colônia: mesa. |
| Agent Provocateur · `h-vtr-fire-revolution:agent-provocateur` | Expression •••; Subterfuge ••• |  |
| Carthian Lawyer · `h-vtr-fire-revolution:carthian-lawyer` | Carthian Movement Status ••; Academics ••• |  |
| Constituent · `h-vtr-fire-revolution:constituent` | Politics •••; Ghoul with a Carthian regnant |  |
| Devotion Experimenter (Advanced) · `h-vtr-fire-revolution:devotion-experimenter-advanced` | Devotion Experimenter; at least three Devotions using the signature Discipline of the chosen clan | Três Devotions conhecidas do catálogo com a Discipline assinatura do clã escolhido; IDs das Devotions e escolha do clã são verificados. |
| Cultural Artifact · `h-vtr-fire-revolution:cultural-artifact` | Carthian Movement Status •• |  |
| Enforcement · `h-vtr-fire-revolution:enforcement` | Carthian Movement Status •; Resolve ••; Brawl or Firearms or Weaponry •• |  |
| Firebomber · `h-vtr-fire-revolution:firebomber` | Athletics ••; Resolve •••; Vigor • |  |
| Fire-Branded · `h-vtr-fire-revolution:fire-branded` | Composure •••; Resilience •• |  |
| I Know a Guy (Advanced) · `h-vtr-fire-revolution:i-know-a-guy-advanced` | Contacts ••; I Know a Guy |  |
| Janus · `h-vtr-fire-revolution:janus` | Subterfuge •• |  |
| Grassroots · `h-vtr-fire-revolution:grassroots` | Carthian Movement Status ••; Contacts •• or Allies •• |  |
| Laissez-Faire Predator · `h-vtr-fire-revolution:laissez-faire-predator` | Streetwise •• or Survival •• |  |
| Poser · `h-vtr-fire-revolution:poser` | Cannot have Punk Rock |  |
| Hobbyist Clique (Advanced) · `h-vtr-fire-revolution:hobbyist-clique-advanced` | Hobbyist Clique; chosen Skill ••• |  |
| Punk Rock · `h-vtr-fire-revolution:punk-rock` | Cannot have Poser |  |
| Strange Laws · `h-vtr-fire-revolution:strange-laws` | Two dots in a Social Merit | Mérito Social com dois pontos automático; relação positiva com outra comunidade sobrenatural: mesa. |
| Rule of One · `h-vtr-fire-revolution:rule-of-one` | Resolve ••• |  |
| Share and Share Alike · `h-vtr-fire-revolution:share-and-share-alike` | Occult ••; one Carthian Law |  |
| True Believer · `h-vtr-fire-revolution:true-believer` | Nenhum |  |
| Show the Belly · `h-vtr-fire-revolution:show-the-belly` | Composure ••• |  |
| Unflinching Eye · `h-vtr-fire-revolution:unflinching-eye` | Acute Senses; Resolve ••• |  |
| Beast of Law · `h-vtr-fire-revolution:beast-of-law` | Nenhum |  |
| Breaking Bread · `h-vtr-fire-revolution:breaking-bread` | Nenhum |  |
| Birth Control · `h-vtr-fire-revolution:birth-control` | Carthian Movement Status •••; Blood Potency •• |  |
| Enforce Elysium · `h-vtr-fire-revolution:enforce-elysium` | Carthian Movement Status •• |  |
| I Do Not Recognize Your Authority · `h-vtr-fire-revolution:i-do-not-recognize-your-authority` | Nenhum |  |
| The Judas Gambit · `h-vtr-fire-revolution:the-judas-gambit` | Nenhum |  |
| Full Transparency · `h-vtr-fire-revolution:full-transparency` | Carthian Movement Status ••• |  |
| Private Property · `h-vtr-fire-revolution:private-property` | Haven • |  |
| Retroactive Continuity · `h-vtr-fire-revolution:retroactive-continuity` | Carthian Movement Status ••••• |  |
| Legal Guardian · `h-vtr-fire-revolution:legal-guardian` | Blood Potency •• |  |
| Parlay · `h-vtr-fire-revolution:parlay` | Carthian Movement Status •• |  |
| Rules of Engagement · `h-vtr-fire-revolution:rules-of-engagement` | Carthian Movement Status •• |  |
| Special Reserve · `h-vtr-fire-revolution:special-reserve` | Lex Terrae; Herd • |  |
| Stake Your Claim · `h-vtr-fire-revolution:stake-your-claim` | Nenhum |  |
| Working to Rule · `h-vtr-fire-revolution:working-to-rule` | Carthian Movement Status ••• |  |
| Those Responsible · `h-vtr-fire-revolution:those-responsible` | Nenhum |  |
| Army of One — Errata · `h-vtr-fire-revolution:army-of-one-errata` | Nenhum |  |
| All Roads Lead to Rome — Errata · `h-vtr-fire-revolution:all-roads-lead-to-rome-errata` | Nenhum |  |
| Balancing Act — Errata · `h-vtr-fire-revolution:balancing-act-errata` | Nenhum |  |
| Smooth Criminal — Errata · `h-vtr-fire-revolution:smooth-criminal-errata` | Nenhum |  |
| Court Jester — Errata · `h-vtr-fire-revolution:court-jester-errata` | Nenhum |  |
| Jack-Booted Thug — Errata · `h-vtr-fire-revolution:jack-booted-thug-errata` | Nenhum |  |
| Coda Against Sorcery — Errata · `h-vtr-fire-revolution:coda-against-sorcery-errata` | Nenhum |  |
| Mobilize Outrage — Errata · `h-vtr-fire-revolution:mobilize-outrage-errata` | Nenhum |  |

### Sin Again: Daeva (32)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Family Fortune · `vtr-sin-again:family-fortune` | Dynasty Membership (Erzsébet) • |  |
| Guise · `vtr-sin-again:guise` | Daeva; attached Touchstone | Daeva e presença de Touchstone; categoria Erzsébet não impõe bloodline. |
| Stitching the Ditch · `vtr-sin-again:stitching-the-ditch` | Moda Mortale Status ••• |  |
| The Medium Is the Message · `vtr-sin-again:the-medium-is-the-message` | Moda Mortale Status • |  |
| Fame, Advanced · `vtr-sin-again:fame-advanced` | Kindred; Fame of equal or higher rating | Fame deve ter pelo menos o rating comprado; categoria Nelapsi não impõe bloodline. |
| Quickened Hunger · `vtr-sin-again:quickened-hunger` | Nelapsi; Vigor • |  |
| Shadow Heart · `vtr-sin-again:shadow-heart` | Nelapsi; Resilience • |  |
| Carmine Paint · `vtr-sin-again:carmine-paint` | Star-Crossed |  |
| Halcyon Days · `vtr-sin-again:halcyon-days` | Star-Crossed |  |
| Time's Ambrosia · `vtr-sin-again:times-ambrosia` | Star-Crossed |  |
| When Inspiration Strikes · `vtr-sin-again:when-inspiration-strikes` | Star-Crossed |  |
| Kingjan · `vtr-sin-again:kingjan` | Xiao; Mystery Cult Initiation (The Sect) •; Majesty or Nightmare •• |  |
| Braggart · `vtr-sin-again:braggart` | Manipulation •••; Persuasion •• |  |
| Can't Bullshit a Bullshitter · `vtr-sin-again:can-t-bullshit-a-bullshitter` | Majesty ••; Manipulation ••• |  |
| Dead Sexy · `vtr-sin-again:dead-sexy` | Striking Looks ••; Humanity 5 or lower |  |
| Enticing, Advanced · `vtr-sin-again:enticing-advanced` | Enticing |  |
| Fake It till You Make It · `vtr-sin-again:fake-it-till-you-make-it` | Braggart •; Subterfuge •• |  |
| Friends Abroad · `vtr-sin-again:friends-abroad` | Cacophony Savvy • |  |
| Good in Bed · `vtr-sin-again:good-in-bed` | Empathy •• |  |
| Kissing Cousins · `vtr-sin-again:kissing-cousins` | Daeva |  |
| Perfect Wingman · `vtr-sin-again:perfect-wingman` | Socialize •• |  |
| Quality Over Quantity · `vtr-sin-again:quality-over-quantity` | Daeva; cannot possess Quantity Over Quality |  |
| Quantity Over Quality · `vtr-sin-again:quantity-over-quality` | Daeva; cannot possess Quality Over Quantity | Exclusão recíproca com Quality Over Quantity confirmada pelo usuário em 05/10/2026. |
| Resting Bitch Face · `vtr-sin-again:resting-bitch-face` | Nenhum |  |
| Single Strike Individual · `vtr-sin-again:single-strike-individual` | Brawl or Firearms or Weaponry ••• |  |
| Social Butterfly · `vtr-sin-again:social-butterfly` | Fame •; Socialize ••; no Status Merit over •• |  |
| Social Chameleon · `vtr-sin-again:social-chameleon` | Barfly; Empathy •• |  |
| Sunglasses at Night · `vtr-sin-again:sunglasses-at-night` | Daeva; Resolve •••; Humanity 6 or lower |  |
| These Guns · `vtr-sin-again:these-guns` | Majesty •; Strength ••• or Stamina ••• |  |
| Total Badass · `vtr-sin-again:total-badass` | Brawl or Weaponry ••; Celerity •; Majesty •; Vigor • |  |
| True Love's Kiss · `vtr-sin-again:true-love-s-kiss` | Kiss of the Succubus |  |
| Voyeur · `vtr-sin-again:voyeur` | Daeva |  |

### Wild Hunt: Gangrel (33)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Therian Psychoanalysis · `vtr-wild-hunt:therian-psychoanalysis` | Daimonion; Manipulation •••; Composure •••; Animalism • or Auspex • |  |
| Sublunario · `vtr-wild-hunt:sublunario` | Dead Wolf |  |
| Bloody Talent · `vtr-wild-hunt:bloody-talent` | Oberloch |  |
| Turn the Eye · `vtr-wild-hunt:turn-the-eye` | Verlice |  |
| Breaking Up the Flock · `vtr-wild-hunt:breaking-up-the-flock` | Wicker; Swarm Form |  |
| Mystery Cult Initiation (Council of Talons) · `vtr-wild-hunt:mystery-cult-initiation-council-of-talons` | Kindred | Qualquer Kindred; não exige ser Wicker. |
| Wisdom of Crowds · `vtr-wild-hunt:wisdom-of-crowds` | Wicker |  |
| Heartwood · `vtr-wild-hunt:heartwood` | Yarilo; Protean • |  |
| Alien Limbs · `vtr-wild-hunt:alien-limbs` | Gangrel; Protean ••; Athletics ••; Brawl ••; Survival •• |  |
| Aspect of the Predator · `vtr-wild-hunt:aspect-predator` | Gangrel |  |
| Atrocious, Advanced · `vtr-wild-hunt:atrocious-advanced` | Atrocious |  |
| Beast Meld · `vtr-wild-hunt:beast-meld` | Gangrel; Protean • |  |
| Feral Combatant · `vtr-wild-hunt:feral-combatant` | Gangrel; Athletics ••; Brawl ••; Protean ••• |  |
| Flesh Focus · `vtr-wild-hunt:flesh-focus` | Gangrel |  |
| Hart's Blood · `vtr-wild-hunt:harts-blood` | Gangrel; Animalism •; Blood Potency 5 or less |  |
| Head of a Pin · `vtr-wild-hunt:head-pin` | Gangrel; Protean • |  |
| Inhuman Resistance · `vtr-wild-hunt:inhuman-resistance` | Gangrel; Blood Potency •• |  |
| Iron Heart · `vtr-wild-hunt:iron-heart` | Gangrel; Resilience • |  |
| Mutable Psyche · `vtr-wild-hunt:mutable-psyche` | Gangrel; Protean ••; Resolve ••• |  |
| Of Rose and Thorn · `vtr-wild-hunt:rose-thorn` | Gangrel |  |
| Pack Blooded · `vtr-wild-hunt:pack-blooded` | Gangrel |  |
| Pack Bond · `vtr-wild-hunt:pack-bond` | Gangrel; Kindred Status • |  |
| Prey's Trail · `vtr-wild-hunt:preys-trail` | Gangrel; Survival •• |  |
| Roughin' It · `vtr-wild-hunt:roughin-it` | Gangrel; Crafts ••; Survival •• |  |
| Savage Kenning · `vtr-wild-hunt:savage-kenning` | Gangrel; Animal Ken ••• |  |
| Taste of Prey · `vtr-wild-hunt:taste-prey` | Gangrel; Survival •• |  |
| The Red Surrender · `vtr-wild-hunt:the-red-surrender` | Gangrel; Beast is not Risen | Gangrel automático; Beast não Risen: mesa, pois esse sistema não é registrado na ficha. |
| Tireless Pursuit · `vtr-wild-hunt:tireless-pursuit` | Gangrel; Stamina ••; Athletics •• |  |
| Top Dog · `vtr-wild-hunt:top-dog` | Gangrel; Empathy •• or Intimidation •• |  |
| Unbound Form · `vtr-wild-hunt:unbound-form` | Gangrel; Protean ••••• |  |
| Unstoppable · `vtr-wild-hunt:unstoppable` | Gangrel; Athletics ••; Brawl ••• or Weaponry •••; Stamina •••; Protean •; Resilience • |  |
| Urban Hunter · `vtr-wild-hunt:urban-hunter` | Gangrel; Streetwise •• |  |
| Veil of Invulnerability · `vtr-wild-hunt:veil-invulnerability` | Gangrel; Resilience • |  |

### Strange Shades: Mekhet (18)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Shihai · `vtr-strange-shades:shihai` | Kuufukuji; Composure •••; Resolve ••• |  |
| Whipping Boy · `vtr-strange-shades:whipping-boy` | Norvegi |  |
| Mother's Little Helper · `vtr-strange-shades:mother-s-little-helper` | Qedeshah |  |
| Façade · `vtr-strange-shades:facade` | Kindred; Inconnu Initiation • |  |
| Manteia · `vtr-strange-shades:manteia` | Dream Visions; Moirai Initiation • |  |
| All-Seeing · `vtr-strange-shades:all-seeing` | Mekhet; Wits ••• |  |
| Aporia · `vtr-strange-shades:aporia` | Fast Talking ••• |  |
| Cocoon · `vtr-strange-shades:cocoon` | Mekhet; Animal Ken •; Safe Place • |  |
| Conspiracy Savant · `vtr-strange-shades:conspiracy-savant` | Wits •• |  |
| Doll Face · `vtr-strange-shades:doll-face` | Mekhet |  |
| Haven Occultation · `vtr-strange-shades:haven-occultation` | Mekhet or Shadow Cult; Safe Place • | Mekhet ou associação a Shadow Cult canônica; Safe Place automático. |
| Holistic Detective · `vtr-strange-shades:holistic-detective` | Investigation •••; a Mental Skill Specialty |  |
| Hypnosis · `vtr-strange-shades:hypnosis` | Manipulation •••; Medicine •• or Occult •• |  |
| Masquer · `vtr-strange-shades:masquer` | Mekhet; Subterfuge •••• |  |
| Occultation · `vtr-strange-shades:occultation` | Mekhet; Stealth • |  |
| Speed of Thought · `vtr-strange-shades:speed-of-thought` | Mekhet; Intelligence ••• |  |
| Twisted Shadow · `vtr-strange-shades:twisted-shadow` | Mekhet; not part of a bloodline | Mekhet, ausência de bloodline e disponibilidade apenas na criação automáticos. |
| Unobtrusive · `vtr-strange-shades:unobtrusive` | Mekhet |  |

### Better Feared: Nosferatu (27)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Bloodcrafting · `vtr-better-feared:bloodcrafting` | Acteius; Crafts •••; Crafts Specialty |  |
| Darksight · `vtr-better-feared:darksight` | Keeper of the Dark; Acute Senses |  |
| Labyrinth · `vtr-better-feared:labyrinth` | Keeper of the Dark; Safe Place • |  |
| A Nose for Secrets · `vtr-better-feared:a-nose-for-secrets` | Keeper of the Dark |  |
| Library, Advanced · `vtr-better-feared:library-advanced` | Keeper of the Dark; Library •••; Safe Place equal to rating |  |
| Ritual Buster · `vtr-better-feared:ritual-buster` | Keeper of the Dark; Occult •••; Rituals Specialty in Academics or Occult |  |
| The Sealed Door · `vtr-better-feared:the-sealed-door` | Keeper of the Dark; Labyrinth • |  |
| Bleak Annals · `vtr-better-feared:bleak-annals` | Nenhum |  |
| Corrupting Influence · `vtr-better-feared:corrupting-influence` | Nenhum |  |
| Dark Hub · `vtr-better-feared:dark-hub` | Nenhum |  |
| Home Turf · `vtr-better-feared:home-turf` | Nenhum |  |
| Honeycomb · `vtr-better-feared:honeycomb` | Nenhum |  |
| Lost & Found · `vtr-better-feared:lost-found` | Nenhum |  |
| Necropolis Arsenal · `vtr-better-feared:necropolis-arsenal` | Nenhum |  |
| Bottom Feeder · `vtr-better-feared:bottom-feeder` | Nosferatu; Blood Potency •• or less |  |
| Dirty Fighting · `vtr-better-feared:dirty-fighting` | Wits •••; Brawl ••; Subterfuge ••; Obfuscate •; Vigor • |  |
| Ease the Curse · `vtr-better-feared:ease-the-curse` | Nosferatu; Blood Potency 5 or less; no Potent Curse |  |
| Hidden Rest · `vtr-better-feared:hidden-rest` | Stealth ••; Obfuscate • |  |
| Living Down to Expectations · `vtr-better-feared:living-expectations` | Nosferatu |  |
| Master of Fright · `vtr-better-feared:master-fright` | Empathy ••; Intimidation ••• |  |
| Shield of Self-Loathing · `vtr-better-feared:shield-self-loathing` | Nosferatu; Resolve •••• |  |
| True Worm · `vtr-better-feared:true-worm` | Nosferatu; Survival • |  |
| Unliving Anchor · `vtr-better-feared:unliving-anchor` | Nosferatu; Occult •• |  |
| Unyielding Mask · `vtr-better-feared:unyielding-mask` | Nosferatu; Nightmare • |  |
| Urban Legend · `vtr-better-feared:urban-legend` | Nosferatu |  |
| Verminous Fellowship · `vtr-better-feared:verminous-fellowship` | Nosferatu or Animalism • |  |
| War Dog · `vtr-better-feared:war-dog` | Nosferatu or Resilience • |  |

### False Gods: Ventrue (43)

| Merit / ID | Pré-requisitos | Observação |
|---|---|---|
| Mass Expansion · `vtr-false-gods:mass-expansion` | Mortal only; Human patient; Typhos doctor with Surgeon | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Musculature Limiter Removal · `vtr-false-gods:musculature-limiter-removal` | Mortal only; Human patient; Typhos doctor with Surgeon | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Necrobiological Transplant · `vtr-false-gods:necrobiological-transplant` | Mortal only; Human patient; Typhos doctor with Surgeon | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Parasensory Awakening · `vtr-false-gods:parasensory-awakening` | Mortal only; Human patient; Typhos doctor with Surgeon; Doctor's Auspex • | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Predatory Pheromone · `vtr-false-gods:predatory-pheromone` | Mortal only; Human patient; Typhos doctor with Surgeon | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Sanguine Sensory Enhancement · `vtr-false-gods:sanguine-sensory-enhancement` | Mortal only; Human patient; Typhos doctor with Surgeon | Core mortal-only; médico e condições da cirurgia: mesa; acesso Vampire somente com Zirnitra. |
| Insect Envoy · `vtr-false-gods:insect-envoy` | Melissidae; Hivemind ••; Animalism • |  |
| Hivemind · `vtr-false-gods:hivemind` | Melissidae |  |
| Firefighter · `vtr-false-gods:firefighter` | Rotgrafen; Resolve •••; Weaponry •••; Resilience • |  |
| Rime Salt · `vtr-false-gods:rime-salt` | Rotgrafen; Protean •• |  |
| Sea Legs · `vtr-false-gods:sea-legs` | Sailing Specialty in Athletics |  |
| Surgeon · `vtr-false-gods:surgeon` | Typhos Status •; Medicine ••; Medicine Specialty (Surgery) |  |
| Aggressive Path · `vtr-false-gods:aggressive-path` | Warumono; Vigor • |  |
| Dutiful Path · `vtr-false-gods:dutiful-path` | Warumono; Resilience • |  |
| Harmonious Path · `vtr-false-gods:harmonious-path` | Warumono; Celerity • |  |
| Bad Breeding · `vtr-false-gods:bad-breeding` | No dots in Good Breeding |  |
| Best Fiend · `vtr-false-gods:best-fiend` | Nenhum |  |
| Born Leader · `vtr-false-gods:born-leader` | Ventrue or Dominate •; Persuasion ••• |  |
| Cutthroat, Advanced · `vtr-false-gods:cutthroat-advanced` | Cutthroat |  |
| Designer Suit · `vtr-false-gods:designer-suit` | Resilience •• |  |
| Don't Flinch · `vtr-false-gods:don-t-flinch` | Ventrue |  |
| Ephor · `vtr-false-gods:ephor` | Ventrue; Clan Status •• |  |
| Eternal Predator · `vtr-false-gods:eternal-predator` | Ventrue or Animalism • |  |
| Favored Servant · `vtr-false-gods:favored-servant` | Ghoul; Ventrue regnant with Status ••• or higher |  |
| First Rat off the Ship · `vtr-false-gods:first-rat-off-the-ship` | Nenhum |  |
| Good Breeding · `vtr-false-gods:good-breeding` | Nenhum |  |
| Inherited Resistance · `vtr-false-gods:inherited-resistance` | Ventrue; Indomitable |  |
| Invisible Hand · `vtr-false-gods:invisible-hand` | Manipulation ••; Subterfuge •••; no more than Status • in the organization |  |
| Kennel Master · `vtr-false-gods:kennel-master` | Ventrue or Animalism •; Animal Ken ••• |  |
| Lingering Motivation · `vtr-false-gods:lingering-motivation` | Nenhum |  |
| Lordly Palate · `vtr-false-gods:lordly-palate` | Distinguished Palate |  |
| Money Talks · `vtr-false-gods:money-talks` | Kindred; Resources ••• |  |
| Old Money · `vtr-false-gods:old-money` | Money Talks |  |
| Pain Is Power · `vtr-false-gods:pain-is-power` | Dominate • |  |
| Proclamation · `vtr-false-gods:proclamation` | Presence •••; Expression ••; Intimidation ••; Dominate • |  |
| Ruthless Bastard · `vtr-false-gods:ruthless-bastard` | Composure ••• |  |
| Saving Face · `vtr-false-gods:saving-face` | Composure ••• |  |
| Silver Spoon · `vtr-false-gods:silver-spoon` | Mentor ••• |  |
| Sommelier · `vtr-false-gods:sommelier` | Ventrue; Bloodhound |  |
| Survivor · `vtr-false-gods:survivor` | Resilience •• |  |
| Wine Cellar · `vtr-false-gods:wine-cellar` | Safe Place • |  |
| Comrade Card Index · `vtr-false-gods:comrade-card-index` | Architects of the Monolith; City Status • |  |
| Dowser · `vtr-false-gods:dowser` | Architects of the Monolith Status • |  |
