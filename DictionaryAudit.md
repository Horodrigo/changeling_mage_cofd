# Auditoria editorial do dicionário pt-BR

As formas abaixo foram aplicadas provisoriamente à interface. Revise-as e substitua a proposta quando preferir outra redação.

## Termos gerais

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Beat | Ato | Usado também em *Arcane Beat* → **Ato Arcano**. |
| Breaking Point | Ponto de Ruptura | Aplicado em Mortal e Vampire. |
| Catch | Brecha | Refere-se à condição especial de ativação de Penhores. |
| Bonded | Vinculado | Nome da Condição; aguarda a tradução integral do catálogo de Condições. |

## Mage

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Hubris | Húbris | |
| Attainment | Conquista | |
| Inured spell | Feitiço Habituado | |
| Enlightened / Understanding / Falling | Iluminação / Compreensão / Queda | Patamares do teste de Húbris. |
| Nameless Order | Ordem sem Nome | |
| Mystery Cult Initiation | Iniciação em Culto de Mistério | |

**Pendente de outro catálogo:** `Megalomaniacal` e `Rampant` foram mantidos nos resultados de Húbris porque são nomes de Condições e devem acompanhar a tradução integral desse catálogo.

## Vampire

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Covenant | Coalizão | |
| Kindred | Membros | Em prosa corrente, usa-se **vampiro** quando a referência não é ao grupo social. |
| Dirge | Lamento | |
| Pack / Pack Alpha | Matilha / Alfa da Matilha | |
| Lashes of Blood Tether | Açoites do Laço de Sangue | |
| Predatory Aspect / Unnatural Aspect | Aspecto Predatório / Aspecto Sobrenatural | |
| Simplified Hollow | Vazio Simplificado | Regra alternativa de *Strange Shades*. |

**Pendente de outro catálogo:** `Bestial`, `Jaded`, `Addiction` e `Deprived` foram mantidos onde nomeiam Condições; devem ser uniformizados com a tradução integral desse catálogo.

## Changeling

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Crux | Cerne | Categoria de Penhor. |
| Clause | Cláusula | |

## Títulos de Changeling

| Inglês | Forma aplicada | Observação |
| --- | --- | --- |
| Baron of the Lesser Ones | Barão dos Seres Menores | Primeiro Título do lote; o sentido de *Lesser Ones* pode admitir uma forma mais idiomática. |
| Master of Keys | Mestre das Chaves | |
| Thorn Dancer | Dançarino dos Espinhos | Foi adotado o masculino fixo, sem exibir pares de gênero. |
| Sibylline Fisher | Pescador Sibilino | |
| Spiderborn Rider | Cavaleiro Nascido da Aranha | |
| BriarNet | BriarNet | Mantido como nome próprio; a opção **Rede de Silvados** não foi aplicada. |
| Cracking Software | Software de Invasão | Nome mecânico citado pelo Programa Pítia; deve acompanhar a futura auditoria dos Méritos. |
| Adjudicator of the Wheel | Adjudicador da Roda | |
| The Blackbird Bishop | Bispo Melro | |
| Diviners of Worms | Adivinhos dos Vermes | |
| Duchess of Truth and Loss | Duquesa da Verdade e da Perda | |
| Guildmaster of Goldspinners | Mestre da Guilda dos Fiandeiros de Ouro | **Goldspinners** foi interpretado literalmente como fiandeiros de ouro. |
| Paragon of Story Heroes | Paragão dos Heróis das Histórias | **Paragão** existe em português, mas é pouco corrente. |
| Sacred Band of the Golden Standard | Bando Sagrado do Estandarte Dourado | |
| Golden Bands | Faixas Douradas | Pode se referir tanto a faixas quanto a braçadeiras; o texto mecânico não especifica a forma. |
| Squire of the Broken Bough | Escudeiro do Ramo Partido | |
| Companion of the Resigned | Companheiro do Resignado | |
| Infinite Popup Book | Livro Pop-up Infinito | **Pop-up** foi mantido por ser a forma corrente para livros com estruturas tridimensionais. |
| Castellan of the Broken Cage | Castelão da Jaula Quebrada | |
| Chrysalid | crisálida | Usado como substantivo comum no texto do Castelão. |
| Knights of the Knowledge of the Tongue | Cavaleiros do Saber da Língua | **Tongue** foi interpretado literalmente; o contexto culinário também admite uma adaptação ligada ao paladar. |
| Legate of the Black Apple | Legado da Maçã Negra | **Legado** é o título diplomático, não o substantivo no sentido de herança; a forma é correta, mas pouco corrente. |
| Sprite | Fagulha | Ser feérico citado em **Elemento Divino**; convém uniformizar quando esse catálogo for localizado. |
| Margrave of the Brim | Margrave da Orla | **Margrave** foi mantido como título nobiliárquico; **Brim** foi interpretado como a orla da Sebe. |
| Bane | Flagelo | Nome do papel marcial dos Nobres Sábios dos Confins Desconhecidos. |
| Bugbear Mask | Máscara de Bicho-papão | **Bugbear** foi interpretado como a criatura do folclore, não como urso. |
| The Tolltaker Knight | O Cavaleiro Cobrador | **Tolltaker** foi adaptado para a função de cobrar o preço prometido. |

Títulos de livros permanecem no idioma original conforme a política do projeto.

## Textos dinâmicos fora dos dicionários

Estes textos já foram localizados no código, mas não devem ser consolidados no dicionário sem a revisão editorial indicada abaixo.

### Configuração de Méritos

Os rótulos de configuração ainda são definidos em inglês junto às regras dos Méritos em `app/builder/common-merit-configurations.ts`, `game-lines/changeling/builder-merit-configurations.ts`, `game-lines/mage/merit-configurations.ts` e `game-lines/vampire/merit-configurations.ts`. Eles devem ser migrados para chaves de i18n durante a tradução dos Méritos, preservando `key`, valores e opções canônicas armazenadas.

| Grupo | Rótulos que exigem decisão editorial |
| --- | --- |
| Comum | `Staff`, `Retainer`, `Safe Place`, `Striking Looks`, `Area of Expertise`, `Defensive Combat`, `Fighting Finesse`, `Quick Draw`, `Unseen Sense` e `Professional Training`. |
| Changeling | `Hedge Duelist`, `Blood and Bone`, `Eerie Eyes`, `Know-It-All`, `Material Affinity`, `Mover and Shaker`, `Running with the Wolves`, `Still Waters Run Deep`, `Elemental Warrior`, `Fae Pet`, `A Taste of Honey`, `Rageaholic`, `Acquired Taste`, `Favored Phobia`, `Grief Connoisseur` e `Strange Favor`. |
| Mage | `Artifact`, `Astral Adept`, `Awakened Status`, `Broad Dedication`, `Cabal Theme`, `Daimonomikon`, `Demesne`, `Destiny`, `Enhanced Item`, `Enriched Item`, `Familiar`, `Grimoire`, `Hallow`, `Imbued Ally`, `Imbued Item`, `Infamous Mentor`, `Inheritance`, `Mana Battery`, `Masque`, `Order Archive`, `Perfected Item`, `Prelacy`, `Profane Tool`, `Shadow Name`, `Shadow Self`, `Sanctum`, `Soul Stone`, `Supernal Watcher` e `Techné`. |
| Vampire | `Kindred Status`, `Haven`, `Herd`, `Retainer (Ghoul)`, `Practiced Puppeteer`, `Friends in Low Places`, `Hiding Place`, `Contract with the Uncanny` e `The Three Heads of Kerberos`. |

### Regras vampíricas exibidas dinamicamente

`game-lines/vampire/sheet-view.tsx` ainda contém blocos mecânicos bilíngues embutidos. A interface portuguesa funciona, mas mistura termos canônicos ingleses. Formas propostas para a revisão:

| Inglês ainda exibido | Forma proposta | Observação |
| --- | --- | --- |
| Strength / Dexterity / Stamina | Força / Destreza / Vigor | Atributos. |
| Blood Potency | Potência do Sangue | |
| Willpower | Força de Vontade | |
| Health | Vitalidade | Nome usado atualmente pela ficha. |
| Daysleep / Embrace | Sono Diurno / Abraço | |
| Lashing Out | Investida Predatória | Nome da ação; requer confirmação. |
| Fight / Flight | Lutar / Fugir | Opções de reação à Aura Predatória. |
| Power Attribute | Atributo de Poder | |
| Brawl / grapple / Feed | Briga / agarrão / Alimentar-se | |
| Feeding Grounds | Território de Caça | |
| Starting Vitae | Vitae Inicial | |
| Coil | Espiral | |
| Kindred senses | Sentidos Vampíricos | Evita a forma pouco natural **Sentidos dos Membros**. |

Os nomes de Condições citados nesses blocos (`Swooning`, `Drained` e outros) devem acompanhar o catálogo de Condições que está sendo traduzido, sem uma segunda tabela paralela.

### Dívida técnica de i18n

Os editores de Homebrew ainda usam uma função local `h(português, inglês)` em vez de chaves semânticas do dicionário. Os textos estão apresentados nos dois idiomas, mas essa forma contorna a proteção do ESLint. A migração deve abranger os editores e inventários de Homebrew de Core, Changeling, Mage e Vampire; depois disso, a regra `no-untranslated-ui-text` deve rejeitar também esse padrão local.
