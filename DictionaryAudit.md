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

Os nomes de Condições citados nesses blocos (`Swooning`, `Drained` e outros) devem acompanhar o catálogo de Condições que está sendo traduzido, sem uma segunda tabela paralela.

### Dívida técnica de i18n

Resolvida: os editores e inventários de Homebrew de Core, Changeling, Mage e Vampire usam chaves semânticas. A regra `no-untranslated-ui-text` rejeita o padrão local `h(português, inglês)` e os testes protegem essa restrição.

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
