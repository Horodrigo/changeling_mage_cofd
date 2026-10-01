# Werewolf — decisões da auditoria

Status: decisões e P01–P03 aprovados em 2026-09-30; meta retomada pelo usuário. Implementação em andamento. Este documento substitui as propostas anteriores da auditoria e registra o entendimento atual, com dúvidas remanescentes ao final. `AGENTS.md` e o código atual continuam sendo a referência arquitetural; remover ou arquivar esta auditoria quando as decisões forem incorporadas.

## Convenção de comunicação e fontes

Nas sugestões, dúvidas e explicações escritas ao usuário, usar os termos originais em inglês. Isso não elimina a localização pt-BR do aplicativo: a apresentação continua bilíngue, com as traduções aprovadas. Termos da língua Uratha permanecem originais em todos os idiomas.

| Sigla | Fonte local |
| --- | --- |
| WTF2 | `pdfSources/Werewolf/2ed - Werewolf the Forsaken.pdf` — Werewolf: The Forsaken Second Edition |
| PACK | `pdfSources/Werewolf/2ed - WtF - The Pack.pdf` — The Pack |
| NHSM | `pdfSources/Werewolf/2ed - WtF - Shunned by the Moon.pdf` — Night Horrors: Shunned by the Moon |

Referências numéricas usam páginas impressas. Nos trechos consultados, a página física do PDF é a impressa + 1. A ficha oficial não possui número impresso: primeira página física 317, segunda página física 318. A segunda contém a comparação das cinco forms; a primeira contém Harmony. Isso corresponde às referências do usuário à page 317/316 conforme a contagem sem a capa. Nenhuma diferença de numeração altera a apresentação solicitada.

A auditoria cobre o inventário de sistemas dos três livros, mas não representa revisão editorial concluída de cada entrada de catálogo. O conteúdo incluído será verificado em lotes, com inglês canônico e português desde o início. A skill `cofd-pdf-review` orienta a conferência visual de regras e tabelas; `cofd-rules` mantém a separação entre regra oficial, decisão de produto e escolha da mesa.

## Escopo consolidado

Incluído:

- Werewolf/Forsaken: cinco Auspices, cinco Tribes e Ghost Wolves, criação/edição, progressão, experiência individual, Merits elegíveis, Gifts/Facets, Rites, Fetishes/Talens, Totem e ficha.
- Cinco forms em cinco colunas na seção Details/Powers do mobile, com valores derivados automaticamente. Health usa um seletor discreto da form acessível.
- Passivas expansíveis/colapsáveis, similares a Tricks of the Blood de Vampire, com regras e limites informativos.
- Harmony manual e clicável de 10 a 0; Breaking Point informativo; Blood/Bone e Touchstones com apresentação definida em W06/W07.
- Todas as Conditions dos três livros, incluindo as ligadas a sistemas fora do escopo, como conteúdo de catálogo. Tilts seguem a proposta aprovada de W22. Nenhum Beat automático.
- CSS normal, mobile, PDF e blank; apenas a skull já fornecida como nova imagem.
- Botão discreto Heal/Curar em Health para todas as linhas, removendo todo o dano quando acionado.
- Renomear a apresentação de Ban/Bane nas entidades efêmeras de todas as linhas, conforme L01 e confirmação ortográfica P03.

Fora desta entrega:

- Criação de Pure e Wolf-Blooded. Wolf-Blooded, Ghouls, Fae-Touched, Proximi e similares ficam para futura opção de Mortal.
- Lodges e conteúdo exclusivo dessas organizações.
- Registro de Pack, membros humanos/Wolf-Blooded, vínculos entre fichas, dados compartilhados, Pack Experiences e Hunting Nature.
- Catálogo/editor de antagonistas, modelos avançados, ferramentas de território/crônica, infecção/mutações Geryo e módulos narrativos opcionais.
- Controle de cena/turno/tempo, inclusive manual, para qualquer linha.
- Regeneração, uso de poderes, testes, recuperação de Willpower, aplicação de Conditions, Beats e progressão narrativa automatizados.

A exclusão de um sistema não exclui um Gift, Rite ou Merit elegível para Forsaken apenas por mencionar esse sistema. Preservar a regra como informação, sem implementar o sistema dependente. Por exemplo, Gift of Pack e Pack Rites não exigem que o aplicativo mantenha um registro de Pack. Gifts de NHSM que não sejam exclusivos de Pure continuam disponíveis mediante seus requisitos.

## Decisões W01–W23

### W01 — Character creation

**Decisão: aprovada com redução de escopo.**

Implementar Forsaken com cinco Auspices, cinco Tribes e Ghost Wolves. Adiar criação de Pure e Wolf-Blooded. Não criar fichas secundárias de humanos, Wolf-Blooded ou outros modelos vinculadas a Werewolf.

Concessões, limites, elegibilidade e `line_data` permanecem propriedade de Werewolf. Merits exclusivos de mortais não ficam disponíveis para Uratha.

Fontes: WTF2 pp. 81–84, 197–200 e 296–305; NHSM p. 203. A criação Pure não bloqueia esta entrega.

### W02 — Forms e passives

**Decisão: aprovada com apresentação definida pelo usuário.**

Preservar os nomes originais da língua Uratha em todos os idiomas, incluindo Hishu, Dalu, Gauru, Urshul, Urhan, Auspice names e demais termos dessa língua.

Apresentar as cinco forms em cinco colunas, uma por form, seguindo a segunda página da ficha oficial. No mobile, essa tabela fica em Details/Powers; não substituir por uma única form com comparação opcional. Valores modificados são calculados e apresentados automaticamente, mantendo os atributos básicos comprados separados dos modificadores.

Mostrar os valores e regras próprios de cada form, incluindo Attributes, Size, Health, Defense, Initiative, Speed, Armor, perception e natural weapons conforme aplicável. Adaptar a tabela à tela estreita preservando as cinco colunas.

Criar uma seção de Werewolf passives expansível/colapsável, similar a Tricks of the Blood de Vampire. Durações, custos, limites e restrições ficam como informação, não como um controlador de tempo.

Fontes: WTF2 pp. 93–105; ficha oficial, PDF físico 318.

### W03 — Health e acesso às forms

**Decisão: aprovada com seletor em Health.**

Seletor discreto junto a Health com as forms às quais o personagem tem acesso. Mudar a form recalcula automaticamente a quantidade de caixas, sem apagar dano ou curar ao reduzir a capacidade. Dano além da capacidade visível deve continuar preservado; sua representação será conferida na implementação, sem inventar conversão de dano.

Skin Thief, The Father's Form e Quicksilver Flesh mantêm escolhas/modificadores próprios, com origem e prévia, sem reescrever Attributes básicos. The Father's Form depende da Facet correspondente, não é uma form gratuita. Mimic e Geryo não são implementados, conforme W18/W20.

Se essas Facets criarem outra complicação de acesso, derivação ou apresentação, mostrar a dúvida ao usuário antes de decidir.

Fontes: WTF2 pp. 96–98, 136–138 e 287–288.

### W04 — Scene e turn controls

**Decisão: proposta de controles rejeitada.**

Não criar controles de nova cena, avançar turno, contagem regressiva, Gauru duration ou Kuruth progression. A restrição vale para todas as linhas, não apenas Werewolf.

As regras de Gauru, Wasu-Im, Basu-Im, gatilhos e limites continuam disponíveis nas forms/passives. O jogador acompanha os tempos fora da aplicação.

Fontes: WTF2 pp. 97 e 102–105.

### W05 — Primal Urge, Essence e Heal

**Decisão: automação de recursos/regen rejeitada; ação compartilhada Heal aprovada.**

Informar limites e efeitos de acordo com Primal Urge, como nas demais linhas. Não calcular por conta do jogador gastos, regeneração, alimentação, intervalos de caça, eventos de cena ou efeitos de prata. Não implementar agenda ou perdas por calendário.

Adicionar botão discreto Heal/Curar em Health **para todas as linhas**. A ação remove todo o dano registrado, inclusive aggravated e eventual dano preservado além das caixas visíveis. Isso é uma edição manual da ficha solicitada pelo usuário, não uma declaração de que qualquer personagem pode regenerar instantaneamente todo dano pelas regras.

O botão não gasta Essence/Willpower, não avança tempo e não altera Attributes ou Health maximum. Seu mecanismo é genuinamente compartilhado; passivas e limites de Werewolf continuam na linha.

Fontes: WTF2 pp. 93–98 e 100–102. Heal é uma decisão de interface, não uma regra nova de regeneração.

### W06 — Harmony

**Decisão: aprovada com controle manual simplificado.**

Tabela de Harmony de 10 a 0, com valor livremente alterável por clique, em apresentação similar a Humanity. Não oferecer compra por experiência, rolar testes, confirmar resultados de um simulador ou mover o valor automaticamente.

Um botão de Breaking Point abre informações sobre os casos que aumentam ou diminuem Harmony, incluindo os modificadores relevantes. O jogador escolhe e altera o valor manualmente.

Não implementar registro de realm, Gauntlet rating ou transgressões detectadas automaticamente. Esses assuntos aparecem apenas como regras relevantes nas passivas, forms e poderes.

Fontes: WTF2 pp. 100–105; ficha oficial, PDF físico 317.

### W07 — Anchors e Touchstones

**Decisão: aprovada com informação, sem ações de recuperação.**

Mostrar a lista de Blood/Bone e como recuperam Willpower, em padrão semelhante às demais anchors. Não recuperar Willpower automaticamente nem criar uma ação de recuperação associada à consulta.

Touchstones física e espiritual são anotadas na tabela de Harmony, em apresentação similar à usada para Humanity. As capacidades ligadas a Auspice, Hunter's Aspect e Oath of the Moon permanecem informações da ficha, sem aplicação automática à presa ou detecção de violação.

Fontes: WTF2 pp. 15–50, 68, 85–88 e 98–100.

### W08 — Gifts, Facets e Renown

**Decisão: aprovada; M01 e M05 são compatíveis com esta organização.**

Manter seleção por família, affinity, Renown e requisitos, com cartões expansíveis semelhantes a Contracts. Moon Gifts seguem a progressão ordenada; Shadow Gifts têm desbloqueio incluindo a primeira Facet; Wolf Gifts não precisam desse desbloqueio.

Registrar concessões gratuitas de Renown e créditos pendentes previstos pela regra, sem cobrar experiência por concessões. Compra e reembolso preservam custos exatos e dependências. Manter a proposta de prévia/bloqueio de remoção enquanto existirem compras dependentes.

M01 define Wolf Gift Facet em 1 XP. M05 permite outro Moon Gift mediante autorização explícita; não remove a ordem das Facets, limites de Renown ou demais requisitos. A autorização não transforma todos os Moon Gifts em escolhas livres por padrão.

Agony, Blood, Disease, Fervor e Hunger de NHSM não são exclusivos de Pure; importar conteúdo elegível para Forsaken. Não implementar aplicação automática dos efeitos ou consumo de recursos ao abrir descrições.

Fontes: WTF2 pp. 83–85, 98–100 e 114–138; NHSM pp. 15–20.

### W09 — Rites

**Decisão: aprovada desde que corresponda ao livro. Conferência: WTF2 p. 139.**

Separar Wolf Rites e Pack Rites; preservar rating, symbols, sample rite, effect, cost, action e procedimentos. Attribute + Skill depende da execução simbólica acordada com o Storyteller: a parada de sample rite não é a única parada obrigatória.

A regra exige uma fonte de conhecimento para aprender e custo de 1 XP por dot. Essa fonte pode ser um teacher ou outro meio descrito no livro; não restringir a compra exclusivamente a um professor presencial. Na criação, separar pontos iniciais de Rites e pontos de Merits convertidos, conforme os limites oficiais.

A ficha individual pode selecionar/conhecer Pack Rites sem cadastrar Pack ou participantes. Requisitos narrativos são informados/confirmados pelo jogador, não verificados por vínculos entre fichas. Excluir Rites exclusivos de modelos fora do escopo.

Fontes: WTF2 pp. 138–146; suplementos apenas quando o conteúdo for elegível para o personagem.

### W10 — Fetishes e Talens

**Decisão: aprovada com padrão visual/configurável similar a Token de Changeling.**

Usar o padrão de seleção e configuração de Token, mantendo as peculiaridades de Fetish: graduação, aquisição pelo Merit, entidade/poder associado, activation e effects. Reusar mecanismos neutros de interface; não importar a implementação mecânica de Changeling.

Entradas de catálogo mantêm IDs e apresentação EN/PT separados das escolhas autorais. Regras de graduação, configuração e aquisição serão verificadas na definição de Fetish, sem copiar custos ou limites de Token por semelhança visual. Talens mantêm distinção de consumível; nenhuma ativação/consumo ocorre automaticamente.

Fontes: WTF2 pp. 106 e 146–150.

### W11 — Pack persistence

**Decisão: rejeitada.**

Sem registro de Pack, cadastro de membros, vínculos entre personagens, compartilhamento ou sincronização de fichas. Persistir somente a configuração de Totem necessária à ficha individual Werewolf.

Mesmo um vínculo local entre fichas não foi autorizado. Não adicionar a alternativa de Pack embutido em uma ficha. O personagem não recebe orçamento inicial de Pack Merits.

### W12 — Experiences

**Decisão: somente individual.**

Manter saldo e histórico de compras da ficha selecionada. Sem Pack Beats, Pack Experiences, divisão de recursos ou alteração de outras fichas.

Custos coletivos de Pack Tactics não serão convertidos silenciosamente em custos individuais; ver W15/P01.

### W13 — Moon's Grace e modelos secundários

**Decisão: sem cadastro de Wolf-Blooded/humans; Moon's Grace somente se elegível para Werewolf.**

Conferência visual de PACK p. 31: Moon's Grace é um **Pack Merit**, reservado a Packs humanos/Wolf-Blooded **sem Uratha**. Portanto, a condição solicitada pelo usuário não é atendida: não habilitar seleção/compra em ficha Uratha.

Isso não cria uma exceção nova nem demanda implementar modelos secundários. Preservar a separação entre catálogo e elegibilidade se uma definição inelegível for apresentada em inventário de referência; não colocar um Pack Merit no orçamento individual.

Tells, Primal Instincts, conversões de modelos e Merits exclusivos desses modelos ficam fora desta entrega.

### W14 — Hunting Nature e lunar cycle

**Decisão: não implementar.**

Sem trilha de Hunting Nature, virada de ciclo, teste mensal, reserva coletiva ou atualização temporal. Rules text pode mencionar essas regras, mas a ficha não calcula nem persiste o sistema.

### W15 — Pack Tactics

**Decisão: proposta aprovada, sujeita à compatibilização com W11/W12/W14.**

Preservar exemplos e configuração estruturada de novas Pack Tactics: rating, themes, dice pool, effects e roll results. Sem controlador de execução coletiva, cadastro de participantes, Hunting Nature persistida ou aplicação automática de Conditions.

A regra de PACK p. 61 cobra 2 XP por dot para desenvolver, podendo usar Pack Experiences ou contribuições individuais; todos os membros conhecem a tactic. Ingresso posterior custa 1 XP por dois dots, arredondado para cima. Esses são eventos diferentes, não uma compra individual indistinta.

**Decisão P01 aprovada:** manter na ficha somente referências/configurações locais das Pack Tactics conhecidas, com requisitos coletivos informativos e sem registro de Pack. Para eventual contribuição individual, registrar apenas o valor informado pelo jogador, sem distribuir custos nem conceder conhecimento a outras fichas. A aprovação do editor não autoriza inventar uma regra alternativa de custo.

Fontes: PACK pp. 58–63.

### W16 — Totem

**Decisão: aprovada dentro da ficha individual, sem W11.**

Persistir opções de Totem na ficha Werewolf. Editor de entidade efêmera com Rank, Power, Finesse, Resistance, Corpus, Essence, Willpower, Influences, Manifestations, Numina, Ban e Bane, além dos benefícios pertinentes.

Mostrar contribuição do personagem via Totem Merit e escolhas relevantes; valores dependentes de outras contribuições precisam ser informados manualmente, sem ler ou vincular outras fichas. Benefícios e melhorias seguem WTF2/PACK, com origem e limites explícitos, sem sobrescrever Attributes básicos.

Não transformar esse editor em catálogo/editor universal de entidades. Seguir a proibição de o Totem conceder Gifts à própria Pack; isso é informação de regra, não motivo para criar uma entidade Pack.

Fontes: WTF2 pp. 91–92 e 183–195; PACK pp. 63–65.

### W17 — Antagonists

**Decisão: não implementar; apenas Werewolf e Totem.**

Sem catálogo/editor de spirits genéricos, Ridden, Hosts, Idigam, Geryo ou antagonistas humanos. As mecânicas necessárias ao Totem continuam incluídas. Conditions desses sistemas continuam no catálogo aprovado em W22.

### W18 — Advanced templates

**Decisão: não implementar.**

Sem Bale Hounds, Tyrants, Devourers, Void Reivers, Mimics, Zi'ir ou Shadow Occultists, inclusive como templates avançados jogáveis. Não importar seus recursos específicos como opções genéricas de Werewolf.

### W19 — Territory e Storyteller tools

**Decisão: não implementar; apenas a ficha Werewolf.**

Sem editor de territory, protectorate, cenário, Wounds, Void ou ambiente; sem catálogo geral de locais ou gerador de crônica. Regras contextuais necessárias a poderes/passivas continuam no texto, não em sistemas auxiliares.

### W20 — Infection e mutations

**Decisão: não implementar.**

Sem acompanhamento de contágio, infecção Geryo, mutações, domínio de Geryo ou conversão em Zi'ir. Conditions relacionadas podem ser consultadas como conteúdo, sem automação dessas consequências.

### W21 — Optional narrative systems

**Decisão: não implementar.**

Sem Tension Pool, Putting It on the Line, módulos de gravidez ou primeira transformação. W22 mantém o conteúdo de Conditions, mas não implementa os módulos de origem.

### W22 — Conditions, Tilts e Beats

**Decisão: aprovada com proibição de conceder Beats automaticamente.**

Importar todas as Conditions dos três livros e os Tilts correspondentes à proposta aprovada, com fonte, regras, resolution e Beat text EN/PT. Condições de sistemas adiados não justificam criar tais sistemas.

Nenhuma resolução, falha, dano ou seleção de Condition gera Beats automaticamente. Ajustes de Beats/Experiences continuam manuais. Não aplicar Conditions a outras fichas, converter mortais ou executar poderes ao consultar seus textos.

Duplicatas só serão reconciliadas quando representarem a mesma regra. Preservar requisitos e ratings descontínuos dos Merits por IDs canônicos.

Fontes: WTF2 pp. 306–313; PACK pp. 104–105; NHSM pp. 200–202.

### W23 — Sheet, PDF e blank

**Decisão: aprovada, retirando Pack conforme W11.**

Primeira página com a geometria compartilhada existente; seções individuais de forms, Gifts, Rites, Fetishes e Totem. PDF A4 com paginação conforme conteúdo e blank com as mesmas seções sem valores preenchidos.

Mobile com abas, cinco colunas de forms em Details/Powers e passivas expansíveis conforme W02. Sem seções/registro de Pack ou Lodge. Usar CSS e a skull fornecida, sem novas artes.

## Decisões M01–M06

### M01 — Wolf Gift Facet cost

**Decisão: 1 XP.**

Divergência preservada como referência: WTF2 p. 84 e p. 115 indicam 1 XP, p. 85 indica 2 XP, NHSM p. 203 indica 1 XP. O produto seguirá a decisão do usuário, sem apresentá-la como errata oficial.

### M02 — Initiative

**Decisão: Dexterity + Composure.**

Aplicar modificadores próprios das forms/benefícios quando pertinentes. Divergência original: WTF2 p. 83 usa Dexterity + Wits; ficha oficial, PDF físico 317, usa Dexterity + Composure.

### M03 — Speed

**Decisão de apresentação:** incluir cálculo e valores de Speed na comparação das cinco forms.

Isso não determina explicitamente qual das fórmulas em conflito deve ser adotada. **Decisão P02 aprovada:** Strength + Dexterity + species factor, com fator humano básico 5 e modificadores das forms, sem somar novamente variação de Size.

Fontes em conflito: resumos WTF2 pp. 83–84/NHSM p. 203 usam Size; WTF2 p. 158 descreve species factor e a ficha oficial usa +5.

### M04 — Gauru Armor

**Decisão: 1/1 em Gauru.**

Adotar o valor da ficha oficial, PDF físico 318. Outras fontes de Armor seguem suas regras, sem somar automaticamente bônus incompatíveis.

### M05 — Additional Moon Gift

**Decisão: permitir exceção autorizada.**

Outro Moon Gift requer autorização narrativa explícita. Manter custo, progressão ordenada e limites de Renown da WTF2 p. 85. O Moon Gift do próprio Auspice continua sendo concedido normalmente.

Compatível com W08; não interpretar a autorização como concessão gratuita nem remoção de todos os requisitos.

### M06 — Pure creation

**Decisão: adiada.**

Não implementar Pure nesta entrega. A lacuna da referência resumida de NHSM p. 203 não bloqueia Forsaken e não exige consultar/importar Dark Eras Companion agora.

## L01 — Localização e termos

Decisões expressas do usuário:

| Termo original | pt-BR solicitado | Alcance |
| --- | --- | --- |
| Primal Urge | Instinto Primitivo | Aplicativo, catálogo e mensagens Werewolf |
| Lunacy | Lunagem | Aplicativo e textos localizados |
| Wolf-Blooded | Parente | Léxico registrado; modelo jogável adiado |
| Ban | Proibição | P03 confirmado; todas as entidades efêmeras de todas as linhas |
| Bane | Fraqueza | Todas as entidades efêmeras de todas as linhas |

Ban/Bane: renomear a **apresentação** em todas as entidades efêmeras de todas as linhas, não IDs, campos canônicos ou regras. A mudança não renomeia automaticamente Vampire Clan/Bloodline Bane nem outros conceitos não efêmeros.

Primal Urge, Lunacy e Wolf-Blooded substituem as propostas anteriores. Nenhum termo Uratha é traduzido. Numina e Touchstone permanecem inalterados.

Demais propostas do léxico original, mantidas como referência editorial, sem confundir proposta com decisão expressa:

| Termo original | Referência pt-BR |
| --- | --- |
| Werewolf / Forsaken / Pure / Ghost Wolves | Lobisomem / Destituídos / Puros / Lobos Fantasmas |
| Auspice / Tribe / Renown | Auspício / Tribo / Renome |
| Cunning / Glory / Honor / Purity / Wisdom | Astúcia / Glória / Honra / Pureza / Sabedoria |
| Essence / Harmony / Blood / Bone | Essência / Harmonia / Sangue / Osso |
| Hunter's Aspect / Death Rage | Aspecto do Caçador / Fúria Assassina |
| Moon Gift / Shadow Gift / Wolf Gift / Facet | Dom da Lua / Dom da Sombra / Dom do Lobo / Faceta |
| Rite / Wolf Rite / Pack Rite | Rito / Rito do Lobo / Rito de Alcateia |
| Pack / Pack Tactic / Hunting Nature | Alcateia / Tática de Alcateia / Natureza da Caçada |
| Complications (Pack) | Entraves da Alcateia |
| Totem / Fetish / Talen / Tell | Totem / Fetiche / Talen / Sinal |
| First Tongue / Shadow / Gauntlet / Reaching | Primeira Língua / Sombra / Película / Travessia |
| Rank / Power / Finesse / Resistance | Grau / Poder / Refinamento / Resistência |

A comunicação de sugestões utiliza os termos da coluna original, não essas traduções. O léxico pt-BR existe para a interface localizada. Hunter continua distinto de Huntsman/Monteiro.

## Dúvidas remanescentes

- **P01 aprovado:** Pack Tactics como referências/configurações individuais; contribuições de XP registradas somente pelo valor informado, sem Pack persistence, Hunting Nature ou distribuição coletiva.
- **P02 aprovado:** Speed = Strength + Dexterity + species factor, base humana 5 e modificadores de form.
- **P03 aprovado:** Ban → Proibição; Bane → Fraqueza.
- Novas dúvidas de acesso/derivação das forms especiais de W03 serão mostradas ao usuário quando surgirem, não resolvidas silenciosamente.

### M07 — Urshul Manipulation

WTF2 p. 97 informa Manipulation −1; a segunda página da ficha oficial (PDF físico 318) imprime −3. O usuário confirmou **−1, conforme o texto da regra**. Usar −1 nos cálculos e na apresentação, sem tratar a diferença como errata oficial.

## Continuação autorizável

O usuário confirmou P01–P03 e autorizou retomar a meta e implementar o escopo acima.

Sequência de implementação autorizada:

1. Incorporar as decisões aprovadas, inclusive P01–P03, preservando as exclusões.
2. Registro lazy, esquema e normalização Werewolf, preservando schema externo 2 e fronteiras de propriedade.
3. Catálogos EN/PT elegíveis para a ficha individual e Totem, incluindo Merits/Conditions/Tilts; sem Lodges, modelos ou catálogos rejeitados.
4. Builder, edição, experiência individual, concessões, Gifts/Facets, Rites e Fetishes conforme decisões acima.
5. Sheet normal/mobile/PDF/blank e apresentação de passivas/forms; botão compartilhado Heal; renomeação localizada de Ban/Bane nas entidades efêmeras.
6. Gates automatizados pertinentes e verificação de isolamento de catálogos, persistência, arquitetura e ambos os idiomas. Browser smoke fica para a revisão autorizada do usuário.

Nenhuma exclusão será revertida apenas porque o sistema consta nos três livros. A referência anterior a “implementação completa” significa completa **dentro deste escopo aprovado**, não implementação de todos os sistemas de Pack, NPCs ou modelos secundários.
