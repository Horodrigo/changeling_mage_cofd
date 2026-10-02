# Werewolf — decisões da auditoria

Status: decisões e P01–P03 aprovados em 2026-09-30; meta retomada pelo usuário. Implementação em andamento. Este documento substitui as propostas anteriores da auditoria e registra o entendimento atual, com dúvidas remanescentes ao final. `AGENTS.md` e o código atual continuam sendo a referência arquitetural; remover ou arquivar esta auditoria quando as decisões forem incorporadas.

Prioridade atual definida pelo usuário: disponibilizar primeiro a criação/edição de Uratha. Implementar as escolhas, concessões e validações das pp. 81–83 e os catálogos necessários a esse fluxo antes de completar as demais superfícies. Isso não reduz o escopo da meta. O painel compartilhado de criação deve acompanhar a altura do conteúdo, sem o espaço artificial após Concept/Chronicle.

## Convenção de comunicação e fontes

### Critério final de qualidade visual e smoke tests

O usuário autorizou smoke tests durante esta meta em 2026-10-02. Realizá-los no navegador, com fichas sintéticas e sem alterar fichas pessoais. A meta existente passa a incluir uma etapa de acabamento visual: após completar os sistemas aprovados, comparar criação, ficha, Details/Powers, Combat e experiência com Mortal, Changeling, Vampire e Mage, em desktop/mobile e EN/PT, além de conferir PDF/blank. Ajustar CSS, espaçamento, hierarquia, controles e apresentação até Werewolf ter qualidade visual comparável às demais linhas. A implementação funcional isolada não permite concluir a meta. Registrar resultados, limitações e correções; só depois executar o merge local com main e remover werewolf. Não ampliar o escopo mecânico nem criar outras imagens não autorizadas.

Primal Urge mantém apenas resumos compactos e informativos abaixo dos dots, sem uma segunda seção Primal Urge X. Omitir valores 0/None; limites de Essence permanecem no controle de Essence, e o teto de traits acima de 5 aparece quando aplicável. Kuruth, Wasu-Im e os gatilhos pertencem a Body of the Wolf. Harmony representa uma posição, portanto somente o círculo do valor atual fica preenchido, inclusive nos extremos 0 e 10. A última orientação preserva o estilo compacto de Basu-Im para as demais informações, em vez de impor as abreviações sugeridas anteriormente.

Smoke tests deste lote (2026-10-02): navegador integrado em origem local isolada, com ficha sintética importada pelo fluxo normal de schema 2. Desktop EN/PT: cinco colunas sem rolagem horizontal, valores derivados alinhados inclusive em Urshul, imagem transparente e Details restrito às passivas próprias. Mobile 390 × 844: apenas a form ativa em Combat, sem estampa; o seletor acompanha Health. Gauru com 10 danos lethal perdeu quatro caixas ao voltar a Hishu, convertendo o excedente em três aggravated e quatro lethal; retornar a Gauru preservou os sete danos. Harmony 0, 7 e 10 apresentaram exatamente um círculo preenchido. Conferidos resumo compacto de Primal Urge, ocultação de 0/None e Kuruth localizado em Body of the Wolf. Nenhum erro de console observado. O smoke revelou e corrigiu o desalinhamento de Urshul com CSS subgrid e o overflow do cabeçalho compartilhado com flex-wrap. Evidências locais ignoradas pelo Git: `.wrangler/werewolf-forms-smoke.jpg` e `.wrangler/werewolf-mobile-combat-smoke.jpg`. Lint, build, TypeScript e 410/410 testes passaram. A comparação final com todas as outras linhas, PDF/blank e acabamento integral permanecem pendentes, junto dos sistemas ainda não implementados; estes resultados não concluem a meta.

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
- Cinco forms em cinco colunas no desktop/print, com valores derivados automaticamente; mobile Combat apresenta apenas a form ativa e compartilha o seletor de Health, sem estampa.
- Passivas expansíveis/colapsáveis, similares a Tricks of the Blood de Vampire, com regras e limites informativos.
- Harmony manual e clicável de 10 a 0; Breaking Point informativo; Blood/Bone e Touchstones com apresentação definida em W06/W07.
- Todas as Conditions dos três livros, incluindo as ligadas a sistemas fora do escopo, como conteúdo de catálogo. Tilts seguem a proposta aprovada de W22. Nenhum Beat automático.
- CSS normal, mobile, PDF e blank; skull e estampa das forms fornecidas pelo usuário. A estampa tem fundo transparente e formato WebP, conforme a solicitação posterior.
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

Apresentar as cinco forms em cinco colunas, uma por form, seguindo a segunda página da ficha oficial, no desktop/print. Conforme a revisão posterior do usuário, mobile Combat mostra apenas a form ativa, compartilhando o seletor de Health, sem imagem de fundo. Valores modificados são calculados automaticamente, sem reescrever os Attributes básicos comprados.

Mostrar somente os Attributes alterados com seus valores recalculados, sem rótulos +X ou uma segunda seção Attributes. Size, Health, Defense, Initiative, Speed, Armor e Perception ficam na comparação compacta, sem largura mínima que imponha rolagem horizontal. Details contém apenas as passivas específicas, em campos separados por nome, Dice Pool, Cost, Effect, restrições e Duration quando aplicáveis. A estampa fornecida foi reduzida, teve o fundo branco removido e foi convertida para WebP transparente.

Criar a seção Body of the Wolf expansível/colapsável, similar a Tricks of the Blood de Vampire. Durações, custos, limites e restrições ficam como informação, não como um controlador de tempo.

Fontes: WTF2 pp. 93–105; ficha oficial, PDF físico 318.

### W03 — Health e acesso às forms

**Decisão: aprovada com seletor em Health.**

Seletor discreto junto a Health com as forms às quais o personagem tem acesso, compartilhado com mobile Combat. Mudar a form recalcula automaticamente a quantidade de caixas, sem apagar dano ou curar. Conforme a revisão posterior do usuário e WTF2 p. 172, cada ferida excedente ao perder caixas agrava uma ferida menos severa restante. Excesso terminal permanece armazenado; aumentar Health não desfaz agravamentos, e somente Heal limpa todo o dano.

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

Usar o padrão de seleção e configuração de Token, mantendo as peculiaridades de Fetish: graduação, aquisição narrativa/ritual, entidade/poder associado, activation e effects. Reusar mecanismos neutros de interface; não importar a implementação mecânica de Changeling. Correção da auditoria após conferência de WTF2 pp. 146–149 e da lista Core Merits: a menção anterior a aquisição por Merit era uma suposição incorreta; este livro não contém um Fetish Merit. Não copiar o orçamento de Token nem inventar um custo de XP.

Entradas de catálogo mantêm IDs e apresentação EN/PT separados das escolhas autorais. Regras de graduação, configuração e aquisição serão verificadas na definição de Fetish, sem copiar custos ou limites de Token por semelhança visual. Talens mantêm distinção de consumível; nenhuma ativação/consumo ocorre automaticamente.

Fontes: WTF2 pp. 141 e 146–149.

Integrados os 18 exemplos Core (13 Fetishes e 5 Talens), com IDs canônicos, EN/PT completos, fontes e regras gerais. Steel Wolf mantém Road Shadow/Ironhide como variantes distintas, sem somar seus efeitos. As seis referências a Facets resolvem as regras do catálogo existente sem conceder poderes ao personagem. A ativação usual de Fetish é Resolve + Composure − rating ou 1 Essence; Talens não exigem activation roll, têm um uso, substituem Renown por rating e limitam Facets permanentes a uma cena; Influences usam Presence + Wits. A interface é inventário opcional na criação/edição e Details/Powers, com linhas expansíveis, filtros de tipo/graduação, instâncias independentes, quantidade manual de Talens, espírito/fonte e notas autorais. Itens autorais ficam na ficha, não em um catálogo global. Normalização schema 2 verifica IDs de instância, graduações e quantidades sem descartar IDs de catálogo indisponíveis. Edições não gastam XP/Essence, consomem Talens nem concedem Facets. A revisão de entradas elegíveis dos suplementos e o printable permanecem pendentes.

Smoke tests deste inventário: selecionadas duas cópias de Witch-Poppet, quantidades independentes 3/1 e notas próprias; troca PT→EN, recarga, reedição pelo Builder e salvamento preservaram as escolhas. Um item autoral manteve nome, descrição e efeito em inglês ao retornar à interface PT. Filtro Talen + rating 4 retornou somente Sky-Caller Trinket; busca mobile e diálogo ficaram dentro da largura de 390 px. Corrigido durante o smoke o cabeçalho mobile para que o botão de adicionar fique abaixo do texto e ocupe a largura disponível. Dados e controles foram conferidos em desktop/mobile e EN/PT; não foram usadas fichas pessoais. Evidências locais ignoradas: `.wrangler/werewolf-fetishes-catalog-smoke.jpg` e `.wrangler/werewolf-fetishes-inventory-smoke.jpg`. Não se trata da comparação visual final entre todas as game-lines.

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

**Decisão atual em 2026-10-01: Gauru não concede Armor inata em Second Edition.**

A confirmação trazida pelo usuário dos desenvolvedores substitui a escolha anterior de 1/1 da ficha: esse valor pertencia à First Edition e foi mantido na ficha Second Edition por erro de digitação. Conferência visual de WTF2 p. 97: não há concessão de Armor entre as regras de Gauru. Usar 0/0 na forma básica e preservar EN/PT coerentes. Fortified Form pode fornecer Armor a Gauru ou outras forms elegíveis (p. 106); não importar regras First Edition. Outras fontes de Armor seguem suas próprias regras, sem acumular bônus incompatíveis por inferência.

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

### M08 — Ties of Blood and Bone resistance

**Decisão: Stamina + Primal Urge, pelo critério físico/mental fornecido pelo usuário.** WTF2 p. 120 imprime `Stamina + Primal Urge` na oposição do Dice Pool, mas `Resolve + Primal Urge` no parágrafo sobre o packmate resistir. O usuário determinou verificar o efeito: resistência física usa Stamina; resistência mental usa Resolve. A Facet troca os dois personagens por metamorfose de carne e osso, com seus equipamentos, sem controlar pensamentos ou emoções. Portanto, adotar Stamina + Primal Urge neste caso. Preservar a divergência em nota editorial, sem apresentá-la como errata oficial nem executar testes automaticamente.

### M11 — Fortified Form e Gauru Armor

**Superada pela correção de M04 no mesmo dia.** A resposta inicial de somar os valores partia da Armor 1/1 da ficha, agora corrigida para 0/0 após a explicação dos desenvolvedores fornecida pelo usuário. Os valores atuais de Gauru com Fortified Form são: 3 → 1/0; 4 → 1/1; 5 → 2/2. Instâncias do mesmo Merit com a mesma form são inválidas; duplicatas não multiplicam o bônus na prévia. Não há autorização geral para acumular qualquer outra fonte de Armor.

### M12 — Living Weapon na mesma form

**Decisão do usuário em 2026-10-01: permitir bite e claws na mesma form.** A expressão de WTF2 p. 107 “different enhancements in different forms” não impede duas instâncias independentes, uma por ataque, na mesma form. O par form/attack identifica a escolha; duplicar esse par é inválido. Uma compra não concede um ataque inexistente na form nem substitui os requisitos de Stamina/Survival.

## Continuação autorizável

### M13 — Totem Advantage com 20 pontos

**Decisão do usuário em 2026-10-02: 15–19 → 5 Experiences; 20+ → 10 Experiences.** WTF2 p. 92 imprime faixas sobrepostas de 15–20 e 20+. Ushugudh, em The Pack p. 65, possui 20 Totem points e Resolve +1, Composure +1 e Indomitable, totalizando 10 Experiences. Adotar a segunda faixa a partir de 20; registrar como decisão explícita do projeto, não errata oficial. O Advantage pool não é o saldo de XP disponível do personagem individual.

### M14 — Totem Defense

**Decisão do usuário em 2026-10-02: Power/Finesse conforme Other Traits e o exemplo de Ushugudh.** WTF2 p. 185 contém uma contradição: Other Traits usa Power/Finesse, enquanto Combat cita Finesse/Resistance. Usar o menor entre Power e Finesse, ou o maior no Rank 1. Dormant spirits não possuem Defense; a Defense se aplica a Firearms. Ushugudh (The Pack p. 65) imprime Power 7, Finesse 7, Resistance 6 e Defense 7. Não apresentar a decisão como errata oficial.

### Referência inicial de Totem — 2026-10-02

- WTF2 pp. 91–92 e 183–186, além de The Pack pp. 63–65, conferidos visualmente: criação, Aspiration/Ban, Totem points, Advantage, Rank, Attributes simplificados, Corpus, Essence, Willpower, Defense, melhorias, vínculo e restrição de conceder Gifts à própria pack.
- Catálogo lazy EN/PT próprio com Rank 1–5, custos de melhoria (Attribute 4 / Influence 5 / Numen 4) e os três exemplos de The Pack. Builder e Details/Powers apresentam referência expansível e busca de exemplos, sem alterar ficha, Attributes, XP, recursos ou criar Pack records.
- Szigblal: Bane impressa é ausência do ninho por mais de 24 horas, não uma substância física/energia. Preservada como referência com nota editorial; não inventar uma substituição. Glabna: Resistance 9 supera metade dos 15 Totem points impressos; a descrição de Totem estabelecido não autoriza ignorar o limite de distribuição na criação de um novo Totem. Manter o exemplo impresso separado da validação de novas alocações.
- M13/M14 estão incorporadas à referência. **Editor individual, persistência das escolhas e aplicação separada dos benefícios ainda estão pendentes**; este lote não é a conclusão de W16 nem da meta. Os catálogos de poderes Core foram completados no lote abaixo.
- Smoke autorizado em fixture sintética local: referência em desktop/mobile EN/PT, busca de exemplos com/sem resultados, cinco colunas de Rank alinhadas no desktop e cards sem overflow no mobile; criação/reedição PT consultada sem salvar mudanças. Fonte/campos completos e nomes Uratha preservados, sem erros no console. A comparação visual completa e o polish final de todas as superfícies permanecem pendentes conforme a meta.

### Catálogo de poderes de Totem — 2026-10-02

- WTF2 pp. 186–193 conferidas visualmente, incluindo tabelas, ícones de Reaching, as duas colunas e continuações. Catálogos estáticos EN/PT completos dos 24 Numina, 11 Manifestation Effects e cinco níveis de Influence, com custos, resistências, prerequisites, duração e efeitos em campos separados. Não há rolagens executadas, gasto automático, timers ou geração de Beats.
- Numina com Reaching: Dement, Emotional Aura, Entropic Decay, Firestarter, Implant Mission, Pathfinder, Rapture, Seek e Telekinesis. Seek usa Finesse, não Power + Finesse; Entropic Decay é resisted, não contested. Drain pode beneficiar o alvo em vez do espírito. Regenerate cura bashing antes de lethal e não aggravated. Stalwart substitui Defense por Resistance, sem conceder Armor. Ghost Eater/Stalwart não receberam um custo inventado; a regra geral de ativação continua apresentada. Rapture preserva o termo derangement impresso, sem inventar uma Condition Madness.
- Claim exige Fetter e Possess para aquisição, além de Controlled na execução; Shadow Gateway exige Rank 3+ e Open. As regras dependentes de Possessed/Claimed/Fettered/Urged estão completas na referência do efeito pertinente, sem disponibilizar um editor de Ridden ou spirits genéricos. Isso não substitui a integração futura das Conditions ao catálogo aprovado em W22.
- **Conflito adicional da fonte:** Influence Effects (p. 187) usa Strengthen → Resonant/Open e Control → Open/Controlled. Open (p. 189) menciona Control para Resonant/Open. A referência preserva a tabela explícita e informa a divergência em EN/PT, sem alegar errata oficial nem aplicar Conditions automaticamente.
- Builder e Details/Powers têm busca por nome/regras/fonte, filtros de tipo e Reaching e disclosures com todos os campos. Os filtros usam texto apresentado; identidade e prerequisites continuam canônicos. Catálogos isolados no grupo lazy de Werewolf, snapshots imutáveis e fallback explícito ao inglês.
- **W16 continua aberto:** editor individual, persistência, orçamento de alocações/melhorias e benefícios separados dos Attributes comprados ainda precisam ser integrados. A importação destes poderes é uma etapa desse editor, não a conclusão da meta.
- Smoke autorizado em fixture sintética: desktop/mobile EN/PT, busca pelo texto apresentado e ausência de resultados, 11 Manifestations e filtros dos nove Numina com Reaching / quinze sem Reaching. Atualização versionada dos JSON confirmou substituição do conteúdo em IndexedDB sem limpar fichas. Filtros mobile empilhados evitam truncar seus valores; consulta não modifica dano, recursos, XP ou escolhas autorais.

### Editor individual inicial de Totem — 2026-10-02

- WTF2 pp. 91–92 e 183–185 / The Pack pp. 63–64 reconferidas visualmente para esta integração. Builder e Details/Powers compartilham o editor opcional próprio de Werewolf; IDs de entidade e poderes, escolhas autorais, Influence domains e contribuições externas manuais persistem em `line_data.totem`, sem Pack records ou fichas vinculadas.
- O rating canônico do Totem Merit do personagem é a contribuição pessoal, incluindo dots comprados com XP. Nenhum dot adicional é inventado: Totem 1 sozinho não define Rank 1. Configurações incompletas continuam salváveis com avisos, sem bloquear a criação de Uratha. Rank/Attribute distribution, trait caps, Twilight Form gratuito, Rank Influences/Manifestations e trocas de Numina são calculados; alocações não escolhidas ficam explicitamente pendentes.
- Numina e Manifestations são selecionados por ID com busca localizada e filtros existentes. O picker bloqueia excesso de orçamento, Shadow Gateway abaixo de Rank 3 e Claim sem Fetter/Possess. Conditions necessárias na execução não são confundidas com prerequisites de aquisição. IDs indisponíveis e texto autoral não são traduzidos nem descartados ao importar.
- Essence/Willpower/Corpus damage e dormancy manual pertencem a `current_state.werewolf_totem`, vinculado à entidade. Começam vazios, nunca recuperados por edição estrutural, e não alteram Health, recursos ou XP do Uratha. Defense segue M14, Stalwart usa Resistance e Essence zero indica dormancy/Defense zero. Corpus não recebe wound penalties; damage excedente e recursos acima de um máximo reduzido são preservados. Remover a configuração não apaga seu registro de recursos; uma nova entidade não o herda.
- **W16 permanece aberto:** melhorias com custos/origem registrados e alocações separadas dos benefícios de Advantage ainda não foram implementadas. O editor atual deixa essa limitação explícita; não representa a conclusão de W16 nem da meta.
- Smoke autorizado em fixture sintética local: configuração em Details/Powers, Rank 1 com contribuição pessoal/manual, seleção de Numina e Manifestations, bloqueios de orçamento/prerequisites, Corpus excedente preservado, recursos independentes e escolhas mantidas ao voltar ao Builder. Desktop/mobile EN/PT sem overflow horizontal ou erros de console; Health do Uratha permaneceu em 7/11, sem cura. Textos longos usam a gravação ao sair do campo estabelecida nas Notes. Quality gates: lint, build, TypeScript e diff-check aprovados, 420/420 testes.

### Melhorias individuais de Totem — 2026-10-02

- The Pack pp. 63–64 e WTF2 p. 92 reconferidos visualmente. Registros separados em `line_data.totem.improvements` acrescentam um Attribute dot, Influence dot ou Numen, pelos custos impressos de 4/5/4. Cada registro retém ID próprio, alvo canônico/instance ID, origem autoral e data; novos Influence domains também têm identidade independente.
- As alocações iniciais não são sobrescritas nem aumentadas silenciosamente. Characteristics/Rank/derived traits do Totem usam as melhorias registradas; Influence/Numina pagos não consomem suas concessões ou trocas iniciais. Limites normais de Rank e increased potential do vínculo são verificados, sem conceder automaticamente novos poderes ao aumentar Rank.
- Conforme W11/W12, não há Pack Experiences, conta coletiva, membros vinculados ou gasto/refund automático do XP individual. A origem dos recursos é declarada após resolução na mesa. A correção de um registro retira só seu benefício e não devolve saldo a uma conta inexistente; dependências são verificadas por registro exato, inclusive quando há outra inconsistência pré-existente.
- Não foi inventado um custo de compra para Manifestations: a tabela de melhorias de The Pack contém somente Attributes, Influence e Numina. As Manifestations/trocas iniciais continuam no editor já implementado. Recursos e damage, incluindo excedente de Corpus, permanecem inteiramente manuais e preservados.
- **W16 continua aberto:** alocação dos benefícios de Totem Advantage e overlays individuais separados dos Attributes básicos ainda precisam ser integrados. O registro de melhorias não conclui W16 nem a meta.

### Modelo individual de Totem Advantage — 2026-10-02

- WTF2 pp. 84, 92 e 111, além de The Pack p. 63, conferidos visualmente. Attribute/Skill concedem um dot; custos seguem o catálogo canônico (4/2, Specialty 1, Merit 1 por dot). O pool usa M13, sem saldo, transações ou refunds de XP individual/Pack.
- O Totem armazena `advantage.active` e escolhas com IDs estáveis, valores canônicos e configuration própria. A escolha compartilhada original é preservada quando um Merit já possuído exige uma substituição individual relacionada de mesmo valor; a justificativa é autoral. Specialty já possuída resolve para Area of Expertise da Specialty identificada por Skill + nome. Não se interpreta descrição traduzida ou texto do jogador para determinar identidade.
- `totem-benefits.ts` resolve um overlay puro separado de Attributes/Skills/Specialties/Merits comprados, com grants identificados por Totem + choice ID e zero creationDots/experienceDots. Valida ratings descontínuos, mortalOnly, configurações, prerequisites, duplicatas e dependências entre concessões. Choices inválidas ficam explicitamente sinalizadas e não são aplicadas pelo resolver; excesso de orçamento desativa todo o overlay, sem apagar as escolhas.
- **Decisão editorial ainda solicitada:** a concessão explícita de Area of Expertise em p. 92 dispensa Resolve 2 de p. 111? O resolver trata provisoriamente essa concessão específica como automática; nenhuma interface oferece essas novas escolhas neste lote. Ajustar conforme a resposta antes de integrar os consumidores.
- Testes focados cobrem os quatro tipos, cap +1, substituições de valor equivalente, dependências inválidas, round-trip/import/reedição, escolhas autorais e validação estrutural. **W16 continua aberto:** o editor e a aplicação deste overlay nos consumidores de Builder/Sheet/forms/prerequisites/refunds/derived state ainda não foram integrados. A UI permanece explicitamente marcada como pendente; este modelo não conclui W16 nem a meta.
- Verificação: 424 testes gerais e 43 focados aprovados; lint, build, TypeScript e diff-check aprovados. A revisão final reforçou o caso automático de Area of Expertise e a separação entre IDs arbitrários de choices e avisos globais; os 43 testes focados foram executados novamente. Não houve mudança visual nem smoke test de uma interface de Advantage neste lote.
- Verificação: 422/422 testes gerais e 41/41 testes Werewolf, lint/build/TypeScript/diff-check aprovados. Smoke sintético desktop/mobile EN/PT registrou Attribute, novo Influence domain e Numen com custos 4/5/4, preservou campos iniciais e origem autoral e confirmou placeholder explícito, modal sem overflow e Health do Uratha inalterada (7/11).

### Integração individual de Totem Advantage — 2026-10-02

- Builder e Details/Powers compartilham o editor EN/PT: quatro tipos de benefício, custo/orçamento explícito, choices com IDs, ratings exatos, configuration de Merit, regras completas e alternativas relacionadas de mesmo valor com justificativa autoral. Choices inválidas/importadas são preservadas e sinalizadas; a edição/remoção não pode criar uma nova dependência inválida em outro benefício.
- O overlay chega aos Attributes/Skills/Specialties/Merits apresentados, cinco forms, Hishu prerequisites e derived state. O loader lazy de regras vincula snapshots imutáveis exclusivamente Core/Werewolf ao pipeline canônico; não foram adicionadas mecânicas de Totem ao Core ou ao lifecycle. Traits base, creation/XP allocations e history continuam separados das concessões.
- XP quotes, compras e refunds verificam dependências exatas, incluindo compras que passam a exigir alternativa e redução do Totem Merit que perde orçamento. A concessão não é um novo saldo de XP nem uma compra gratuita persistida como própria. Patronage é manual, independente de Essence/dormancy; sem Pack records, timers ou vinculação entre jogadores.
- Suspensão/remoção/edição que perde Health aplica WTF2 p. 172 às caixas perdidas. Reativar o vínculo ou aumentar a forma não reverte upgrades do damage. Recursos, XP e damage da entidade continuam separados e nunca são recuperados por essas edições.
- **W16 ainda tem uma decisão editorial aberta:** a resposta sobre Resolve 2 para a concessão explícita de Area of Expertise ainda não chegou. O comportamento provisório continua automático, restrito a essa concessão; não se afirma que o conflito seja uma errata oficial. A integração não conclui a meta, seus catálogos suplementares, PDF/blank ou polish final.
- Smoke autorizado, exclusivamente na fixture sintética local: desktop/mobile EN/PT, busca localizada de Fleet of Foot, apresentação de regras/prerequisites, bloqueio de Save por orçamento e ausência de overflow horizontal. Em Gauru, Stamina +1 levou Health de 11 para 12; suspensão com todas as caixas ocupadas reduziu a 11, converteu uma contusão em lethal e reativação manteve o upgrade. O dano final 3 aggravated/5 lethal/3 bashing, XP 0, Willpower 4 e Essence 0 do Uratha persistiram após reload e salvar a reedição; Stamina base continuou 2 no Builder. Essence 3, Willpower 0 e três contusões do Totem permaneceram independentes. Initial allocations reconciliadas à contribuição manual da fixture; sem erros no console.
- Verificação final deste lote: **427/427 testes gerais**, incluindo 46 Werewolf; `npm run lint`, `npm run build`, `npx tsc --noEmit` e `git diff --check` aprovados. As quatro regressões temporárias da pré-validação de Merit foram corrigidas fornecendo identidade independente à instância de preview; nenhuma exceção ou teste foi removido para mascará-las. Architecture/production-manifest tests continuam protegendo catálogos e import closures isolados.

### Notas editoriais do catálogo Moon Gifts — WTF2 pp. 115–121

- `Thousand-Throat Howl`: o livro escreve `Intimidate` no Dice Pool; o catálogo usa a identidade canônica da Skill `Intimidation`, sem interpretar nomes traduzidos em tempo de execução.
- `Ties of Word and Promise`: o cabeçalho do custo cita apenas Allies/Contacts, mas o texto inclui Alternate Identity, Resources e Status e determina 1 Essence por dot do Merit escolhido. O catálogo preserva todas as opções e usa o custo descrito no corpo da regra.
- `Ties of Blood and Bone`: resistência física adotada em M08, sem apresentar a divergência como errata oficial.
- Novos nomes localizados de Conditions para uniformizar ao importar seu catálogo: Exhausted → Exausto; Paranoid → Paranoico; Open → Aberto; Demoralized → Desmoralizado; Stumbled → Tropeço; Lured → Atraído. Inspired → Inspirado e Spooked → Assombrado seguem o catálogo compartilhado existente. Esses nomes não alteram as identidades ou os efeitos das Conditions.

### Notas editoriais do catálogo Wolf Gifts — WTF2 pp. 136–138

- Os três Gifts e suas quinze Facets foram conferidos visualmente, incluindo as continuações de `The Father's Form` e `Impossible Spoor`. Não são Facets de progressão ordenada; cada Gift contém uma Facet por Renown.
- `Totem's Wrath`: o livro imprime Dice Pool e Action, mas nenhum bloco de Roll Results. Preservar o Effect e os modificadores derivados impressos (Corpus +2, Initiative +1, Speed +4), sem inventar resultados ou aplicar mudanças automaticamente ao Totem. A retirada de um dia por turno ativo permanece informação, não controle temporal.
- `Down the Prey`: o livro chama o Tilt de `Knockdown`; o catálogo usa a identidade de apresentação `Knocked Down`, correspondente ao Tilt, com requisito de Defense 0 preservado.
- `Gift of Pack`: manter as regras consultáveis e a seleção individual, sem cadastrar Pack, ligar fichas ou conceder Beats automaticamente.
- `Skin Thief`, `The Father's Form` e `Quicksilver Flesh`: os efeitos e restrições estão catalogados, mas sua configuração de forms ainda depende da implementação de W03. O catálogo não transforma essas descrições em acesso gratuito, aplicação automática ou alteração dos Attributes básicos.
- Nomes localizados a uniformizar com o futuro catálogo de Conditions: Materialized → Materializado; Moon Taint → Mácula Lunar. Termos Uratha, incluindo Siskur-Dah, Kuruth e Basu-Im, permanecem inalterados.

O usuário confirmou P01–P03 e autorizou retomar a meta e implementar o escopo acima.

### Notas editoriais do catálogo Shadow Gifts — primeiro lote, WTF2 pp. 121–123

- `Gift of Death`, `Gift of Dominance` e `Gift of the Elementals`: quinze Facets completas em EN/PT, conferidas visualmente. As demais famílias ainda não foram importadas; este lote não conclui o catálogo necessário ao Builder.
- `Bone Gnaw`: quatro opções, mas só a busca de um segredo ou conhecimento importante específico exige Presence + Empathy + Purity, com oposição de Resistance se o ghost estiver presente. Não inventar Roll Results nem exigir teste para todas as opções.
- `Breath of Air`, `Flesh of Earth`, `Tongue of Flame` e `Heart of Water`: preservar as paradas próprias de Influence e Cost variável, sem inventar Action, Duration ou Roll Results. As regras gerais de Influence pertencem à referência Werewolf/Totem; não executar poderes nem mover Attributes básicos.
- `Lay Low the Challenger`: normalizar o `Intimidate` impresso para a Skill canônica `Intimidation`, como no lote Moon Gifts.
- `Lead the Lesser Pack` e `Memento Mori`: manter elegíveis na ficha individual e informar os efeitos sem criar Pack persistence, alterar fichas externas ou transferir dano automaticamente.
- Nomes localizados de Conditions a uniformizar no catálogo: Awestruck → Deslumbrado; Essence Overload → Sobrecarga de Essência. Cowed → Acovardado segue a decisão já aprovada para Changeling; Ban → Proibição e Stumbled → Tropeço seguem os lotes anteriores.
- Revisão lexical incorporada na base: Composure → Compostura, Athletics → Atletismo e Bashing → contusivo, seguindo a apresentação compartilhada. Arm Wrack/Leg Wrack na descrição de Urshul usam Braço Lesionado/Perna Lesionada, como no catálogo Moon Gifts. As versões individuais dos catálogos PT foram incrementadas, sem alterar os valores canônicos.

### Notas editoriais do catálogo Shadow Gifts — segundo lote, WTF2 pp. 123–127

- `Gift of Evasion`, `Gift of Insight` e `Gift of Inspiration`: quinze Facets completas em EN/PT, incluindo as continuações de `Feet of Mist`, `Exit Strategy`, `Echo Dream` e `One Step Ahead`. Este lote não conclui as demais famílias necessárias ao Builder.
- `Fog of War` não imprime Exceptional Success. Preservar os três resultados existentes, a resistência de quem entrega/atira e o gasto adicional para escolher um destinatário plausível, sem inventar o quarto resultado.
- `Hit and Run` permite movimento antes do teste condicional; Failure significa nenhum efeito **adicional**, não cancelar esse movimento. `Exit Strategy` tem um efeito automático e quatro opções de teste distintas. Nenhuma dessas regras move tokens, executa perseguições ou aplica Conditions automaticamente.
- `Read the World's Loom`: sete temas, desconto de Cost no território e alcance de Glory em milhas. Manter o contexto como informação, sem criar o editor de territory excluído em W19.
- `Lunatic Inspiration` resiste somente com Composure, sem Primal Urge; o alvo é human/Wolf-Blooded, sem exigir cadastro desses modelos. `Still Small Voice` usa Resolve + Primal Urge e seus alvos não podem dispensar a resistência. Exceptional Success alcança todos os Uratha presentes que ouçam o interlocutor, não somente os alvos escolhidos.
- `Fearless Hunter`, `Pack Triumphs Together` e `Unity` continuam como poderes individuais consultáveis, sem Pack persistence, Initiative automática ou controle de cenas.
- Loucura/Inspirado/Enamorado seguem os nomes localizados existentes para Madness/Inspired/Swooning. Shadow Paranoia → Paranoia da Sombra será uniformizado ao importar o catálogo correspondente. Ridden → Possuídos, Hosts → Hospedeiros e Claimed → Tomados são propostas editoriais de apresentação, não implementação dos antagonistas excluídos em W17.

### Knowledge, Nature e Rage — terceiro lote de Shadow Gifts (WTF2 pp. 127–131)

- Catálogo EN/PT com as quinze Facets de `Gift of Knowledge`, `Nature's Gift` e `Gift of Rage`, conferidas visualmente. `This Story Is True` não imprime Exceptional Success separado; preservar os três resultados, sem inventar um quarto.
- **M09 — Lore of the Land Dice Pool:** WTF2 p. 128 apresenta Roll Results, mas omite Dice Pool. Em 2026-10-01, o usuário definiu **Intelligence + Survival + Purity**. Aplicar essa parada em inglês e português; é uma decisão explícita do projeto que preenche a lacuna, não uma errata oficial. A detecção adicional de criaturas e ameaças exige estar no território da própria alcateia e não revela seres em Twilight.
- `Know Thy Prey`: Anonymity penaliza a parada, mas não há outra resistência do alvo; Alternate Identity/Fame não dependem do limite de sucessos aplicado aos seis outros Social Merits. `Sift the Sands` exige 10 sucessos, um teste por minuto; transcrição custa mais 1 Essence e deve ocorrer dentro de uma hora.
- `Pack Kin` é referência de um poder individual, sem editor de animais ou vinculação de fichas. `Beast Ride` mantém as consequências distintas da morte do animal e da morte do corpo do Uratha, sem criar um modelo de Claimed.
- `Black Earth, Red Hunger`, `Berserker's Might` e `Slaughterer` descrevem condições de regeneração, redução de dano e Cost; não curam, aplicam dano ou gastam Essence automaticamente. `Perfected Rage` informa turnos, sem contador, conforme W04.
- Spooked → Assombrado, Stumbled → Tropeço e Lured → Atraído seguem a apresentação já utilizada. Berserk → Frenético segue a decisão anterior do usuário. Referências a Retainer/Staff e Beast Speaker reutilizam os nomes portugueses dos catálogos existentes.

### Demais Core Shadow Gifts — Shaping, Stealth, Strength, Technology, Warding e Weather (WTF2 pp. 131–136)

- Catálogo EN/PT com as trinta Facets restantes, conferidas visualmente. O Core agora contém 23 Gifts e 115 Facets: cinco Moon Gifts (25), quinze Shadow Gifts (75) e três Wolf Gifts (15). Todos os Gift IDs favorecidos por Auspice/Tribe estão disponíveis; isso não conclui os catálogos dos suplementos, Rites, Merits ou a integração do Builder com salvamento.
- `Perfection of Form` imprime `Craft`; usar a identidade canônica `Crafts`. `Shutdown` imprime `Intimidate`; usar a identidade canônica `Intimidation`. São normalizações dos nomes das Skills do próprio Core, não alterações de Dice Pool.
- `Ward the Wolf's Den` usa **Cunning Renown × 10 yards** para o raio e Glory Renown para penalidade/fechamento. Preservar essa regra como impressa, sem substituir Cunning por Glory. `Predator's Claim` não permite atacar fisicamente Rank 6+, mesmo ao elevar honorary Spirit Rank acima de 5.
- `Rending Claws` tem Duration permanente, sem Cost ou Action impressos: não inventar campos. `Unchained`, `Predator's Unmatched Pursuit` e `Primal Strength` mantêm os benefícios condicionais de Basu-Im; os textos não ativam poderes, modificam fichas ou executam Clash of Wills automaticamente.
- **Lacunas de Weather ainda sem decisão numérica:** `Cloak of Mist and Haze` e `Heavens Unleashed` não imprimem o alcance de área; `Heavens Unleashed` também não quantifica a penalidade de Exceptional Success aos Social Merits. O usuário respondeu em 2026-10-01 com os efeitos normais já impressos (Cunning para sight/hearing/ranged attacks e Glory para Speed/Initiative); essas respostas não definem as duas lacunas. Preservar avisos explícitos nos dois idiomas e não atribuir números ou alcance por inferência. Nenhuma automação depende dessas quantidades.
- `Moldywarp` → Toupeira é tradução editorial do termo inglês arcaico para o animal, não alteração de First Tongue; nomes Uratha continuam inalterados. Outros nomes de Facets deste lote podem ser auditados diretamente na apresentação PT.

### Core Rites — WTF2 pp. 139–146

- Os 23 Rites do Core (11 Wolf Rites e 12 Pack Rites) foram conferidos visualmente e catalogados em EN/PT, com Symbols, Sample Rite, sua parada de exemplo, Action, Cost/Duration quando impressos, Success, ensino exclusivo e páginas separados. Resultados gerais de p. 139 são preservados sem inventar resultados específicos.
- Attribute + Skill depende da cerimônia acordada pela mesa; a parada do Sample Rite não se torna uma exigência fixa. Aprender exige uma fonte de conhecimento e 1 Experience por dot, não necessariamente um professor.
- O seletor de criação usa IDs canônicos e soma ratings, não a quantidade de Rites: 2 dots iniciais mais até 5 convertidos de Merits, no mesmo orçamento de Primal Urge. Valida alocação completa, duplicatas, IDs ausentes e os cinco casos de ensino exclusivo por Tribe. Trocar Tribe ou reduzir o orçamento não apaga escolhas; itens inválidos permanecem removíveis.
- `Wellspring` tem um Sample Rite de Ivory Claws, mas não restringe ensino a essa Tribe; permanece disponível. Efeitos de Pack Rites são referências individuais, sem Pack persistence, fichas de humanos/Parentes vinculadas, timers ou concessão automática de recursos/Conditions.
- **M10 — Chain Rage (p. 140): pendente.** O texto imprime “achieving turns of lucidity” e explica que não precisam ser consecutivos, mas omite quantos turnos encerram Wasu-Im. EN/PT mantêm aviso expresso da omissão; não atribuir um número sem decisão do usuário ou fonte oficial. A lacuna não bloqueia a seleção, pois o aplicativo não executa esse efeito.
- `Expel` normaliza a Skill impressa `Intimidate` para a identidade canônica `Intimidation`. Shadowlash → Chicote da Sombra, Symbolic Focus → Foco Simbólico e Resonant → Ressonante são propostas editoriais para uniformização ao importar Conditions; Stumbled → Tropeço, Inspired → Inspirado, Madness → Loucura e Guilty → Culpado seguem a apresentação existente. Ban/Bane → Proibição/Fraqueza em Totemic Empowerment segue L01/P03.
- O catálogo Core Rites está integrado à criação, Sheet, persistência e compras/refunds individuais de XP. Rites dos suplementos continuam pendentes; a conclusão deste catálogo não conclui a meta inteira.

### Core Werewolf Merits — WTF2 pp. 105–110

- Os 32 Merits específicos destas páginas (24 General Werewolf Merits e 8 Werewolf Fighting Merits) foram conferidos visualmente e catalogados em EN/PT em `public/game-lines/werewolf/data/merits.json` e `merits-pt.json`. Ratings descontínuos, prerequisites, drawbacks e os níveis reais dos três Merits progressivos foram preservados. Isso não inclui ainda Merits dos suplementos nem substitui o catálogo compartilhado dos Human Merits.
- `Blood or Bone Affinity` permite somente 2 ou 5 dots. `Favored Form` tem cinco benefícios cumulativos, mas só pode favorecer uma form; `Fortified Form`, `Living Weapon` e `Moon-Kissed` são repeatable expressos e precisarão de instâncias/configurações independentes. Nenhum outro Merit recebeu repeatability por inferência.
- `Anchored` imprime apenas Harmony como prerequisite, sem threshold; não inventar um. `Blood or Bone Affinity` exige Harmony entre 3 e 8 e `Code of Honor` exige 8+. `Favored Form` exige Primal Urge pelo menos um acima do rating. Requisitos das Fighting Merits são calculados em Hishu, sem os bônus de outras forms, conforme p. 108.
- `Code of Honor` inclui a referência de Virtue em p. 158 (toda Willpower até duas vezes por chapter). `Song in Your Heart` inclui a parada e os modificadores do efeito subjacente de Inspiring em p. 111, sem depender somente de um “see p.”. Essas são referências do próprio livro, não concessões automáticas.
- `Dedicated Locus`, `Residential Area`, `Pack Dynamics` e `Totem` permanecem Merits individuais com os textos de cooperação preservados, sem criar Pack persistence, vínculos entre fichas, territórios ou reservas coletivas. A apresentação não aplica Beats, Willpower, Essence, Conditions ou maneuvers automaticamente.
- `Instinctive Defense`, `Embodiment of the Firstborn`, `Favored Form`, `Fortified Form` e `Living Weapon` exigem integração mecânica/configuração própria de Werewolf antes de disponibilizar compras; não mover seus cálculos para Core ou alterar Attributes básicos por simples troca de form. Bônus temporários de maneuvers continuam informativos.
- O ID `WtF` agora está registrado para criação/edição, persistência e ficha em tela conforme a seção de integração abaixo. O carregador lazy `werewolf-merits` lê somente os JSON EN/PT próprios e anexa apresentação por ID em snapshots imutáveis. Nenhuma outra linha passa a solicitar estes JSON.
- Shaken → Abalado segue o catálogo compartilhado existente. Nomes locais novos dos Merits e maneuvers permanecem propostas editoriais auditáveis no JSON PT. Termos Uratha, incluindo Kuruth/Wasu-Im/Basu-Im, não foram traduzidos.

### Integração dos Core Merits com escolhas e forms

- Validação Werewolf por ID de Harmony, Primal Urge, Renown e Tribe, além dos thresholds canônicos de Attribute/Skill. O contexto usa traits efetivos de Hishu; a form de combate não altera elegibilidade. Core é responsável por acesso de linha, mortalOnly e exclusões genéricas no Builder registrado.
- Editor nativo EN/PT para Anchored, Blood or Bone Affinity, Code of Honor, Dedicated Locus, Embodiment of the Firstborn, Favored Form, Fortified Form, Living Weapon e Moon-Kissed. Dedicated Locus vincula uma instância exata de Safe Place; isso não liga fichas ou cria entidades de Pack. Benefícios condicionais não ativam poderes nem concedem recursos.
- Favored Form preserva uma penalidade de Mental/Physical Attribute por dot, distribuível entre outras forms, incluindo Hishu. Apenas níveis desbloqueados afetam a prévia; reduzir dots ou alterar identidade não apaga configurações silenciosamente. A escolha de Skill pertinente continua julgamento da mesa. O exemplo explícito de p. 106 proíbe favorecer Manipulation em Gauru, sem inventar uma penalidade numérica ausente de p. 97.
- Embodiment of the Firstborn, Favored Form e Instinctive Defense recalculam os valores da tabela de forms sem regravar Attributes comprados ou dano. Fortified Form segue M04 corrigida, sem Armor inata em Gauru. Living Weapon informa somente os bônus do ataque natural escolhido, sem conceder ataques que a form não possui. A tabela compacta mostra apenas os Attributes alterados, incluindo os mentais efetivamente modificados por Favored Form; benefícios de níveis ainda não comprados não são apresentados como ativos.
- As três definições expressamente repetíveis recusam a mesma escolha em outra instância; Living Weapon distingue form e ataque conforme M12. Esses controles estão compostos no Builder registrado, na persistência e nas compras/refunds individuais de XP.

### Concessões e origem das alocações de criação — WTF2 pp. 82–83

- Conferência visual confirma **Totem 1 e Language (First Tongue)** adicionais aos dez dots de Merits. As concessões têm marcadores canônicos próprios e instance IDs persistentes; somente um dot de cada concessão é gratuito. Ratings adicionais de Totem consomem o orçamento normalmente. Outras instâncias de Language, com texto do jogador, não são reescritas ou transformadas em First Tongue.
- `creation-grants.ts` compõe seleções de criação e reutiliza a progressão compartilhada por instância exata para preservar creationDots/experienceDots. Testes cobrem reedição, Totem com alocação mista, Living Weapon bite/claws comprados com XP na mesma form e ausência de duplicação das concessões. Não há interpretação de descrições traduzidas ou alteração de saldos/histórico.
- O resultado validado de criação mantém escolhas e IDs de Renown/Facets/Rites separados do Skill dot gratuito. A retirada deste dot para reedição exige o registro explícito da concessão; não tenta adivinhar bônus ou remover um dot comprado. Os Attributes e as seleções de entrada não são alterados.
- Blood/Bone devem apontar para o tipo correto de arquétipo. Specialties não preenchidas e as duas Touchstones são opcionais na criação, conforme a decisão de produto para todas as linhas. Uma Specialty nomeada continua exigindo uma Skill treinada. Rascunhos continuam sujeitos ao salvamento separado permitido pelo shell compartilhado.
- A composição destas concessões foi integrada ao Builder registrado, normalização e ficha em tela. XP de Attributes, Skills, Specialties, Merits, Primal Urge, Renown, Gifts/Facets e Core Rites está integrado; os demais sistemas aprovados permanecem pendentes. O esquema externo continua na versão 2.

Sequência de implementação autorizada:

1. Incorporar as decisões aprovadas, inclusive P01–P03, preservando as exclusões.
2. Registro lazy, esquema e normalização Werewolf, preservando schema externo 2 e fronteiras de propriedade.
3. Catálogos EN/PT elegíveis para a ficha individual e Totem, incluindo Merits/Conditions/Tilts; sem Lodges, modelos ou catálogos rejeitados.
4. Builder, edição, experiência individual, concessões, Gifts/Facets, Rites e Fetishes conforme decisões acima.
5. Sheet normal/mobile/PDF/blank e apresentação de passivas/forms; botão compartilhado Heal; renomeação localizada de Ban/Bane nas entidades efêmeras.
6. Gates automatizados pertinentes e verificação de isolamento de catálogos, persistência, arquitetura e ambos os idiomas. Browser smoke fica para a revisão autorizada do usuário.

Nenhuma exclusão será revertida apenas porque o sistema consta nos três livros. A referência anterior a “implementação completa” significa completa **dentro deste escopo aprovado**, não implementação de todos os sistemas de Pack, NPCs ou modelos secundários.

### Integração no fluxo real — 2026-10-01

- `WtF` está disponível no registro lazy com Rules, Builder e Sheet independentes. É possível concluir criação Core Forsaken, salvar rascunhos, editar, abrir e importar/exportar fichas schema 2 pelo lifecycle compartilhado, sem ensinar campos Werewolf à persistência Core.
- O Builder usa alocações compartilhadas 5/4/3 e 11/7/4, até três Specialties opcionais e requisitos Werewolf. O Auspice Skill dot é concedido separadamente; Totem 1 e Language (First Tongue) não gastam os dez Merit dots. Primal Urge e Rites têm conversões explícitas. Moon Facets são concessões ordenadas; as Shadow/Wolf Facets escolhidas mantêm IDs canônicos.
- Reedição preserva XP-only Merits e instâncias bite/claws independentes na mesma form, compras de traits, alocações mistas de Totem, recursos, histórico e escolhas autorais. Corrigida no shell compartilhado a subtração duplicada de experienceDots de grants com creationDots explícitos.
- A ficha usa MainSheet compartilhado. Desktop/print apresentam cinco colunas iguais de forms com a estampa fornecida; mobile apresenta somente a form ativa em Combat, sem estampa, compartilhando o seletor de Health. Body of the Wolf e poderes são expansíveis, incluindo Kuruth, Wasu-Im e os gatilhos. Primal Urge mostra resumos discretos logo abaixo dos dots, omitindo valores 0/None e sem um segundo bloco Primal Urge X. Harmony é uma trilha manual 10–0 similar visualmente a Humanity, mas com apenas o círculo do valor atual preenchido; Flesh Touchstone fica na linha 10 e Spirit Touchstone na linha 0.
- Reduzir Health ao trocar de form reaplica as feridas das caixas perdidas, agravando as menos severas restantes da esquerda para a direita (WTF2 p. 172, confirmado visualmente). A transação acontece uma única vez pelos dois seletores; aumentar Health não cura nem desfaz agravamentos. Excesso terminal após preencher tudo com aggravated continua preservado, sem morte automática. Heal é manual e limpa todo o dano. Modificadores permanentes de Merits são aplicados às forms sem alterar os Attributes comprados.
- Blood/Bone têm catálogo consultável com recuperação de Willpower antes da seleção. Shadow/Wolf Facets e Rites usam busca/filtros em diálogos compactos, mantendo apenas as escolhas e concessões no template. Filtrar nunca apaga seleções nem permite ignorar requisitos; opções inválidas permanecem removíveis.
- Catálogos solicitados continuam limitados a Core e Werewolf; inglês é canônico e português é apresentação por ID. CSS normal/mobile e fallback de impressão não geram novas imagens; PDF/blank dedicados ainda não são anunciados.
- **Ainda pendentes:** conteúdo elegível de The Pack/Shunned by the Moon, incluindo Rites e Fetishes/Talens dos suplementos; Conditions/Tilts Werewolf; melhorias/benefícios separados do Totem e Pack Tactics; sistemas adicionais das forms permitidas; referências completas das Auspice abilities/Hunter's Aspects/Tribal benefits; PDF/blank dedicados e reconciliação final de Ban/Bane nas entidades efêmeras. Esses itens continuam na meta, sem Pure, Wolf-Blooded, Lodges ou Pack persistence. O editor inicial individual de Totem e o inventário com os 18 exemplos Core de Fetishes/Talens já estão integrados.

### Experiência individual — primeiro lote integrado (2026-10-01)

- Sheet e etapa opcional de criação usam as mesmas transações de Attributes (4 XP/dot), Skills (2), Specialties (1), Merits (1/dot) e Primal Urge (5/dot). Custos conferidos em WTF2 p. 84 e CofD p. 77; Harmony permanece manual e não comprável.
- Histórico semântico mantém valores canônicos, IDs e instâncias; os rótulos são apresentados em EN/PT sem reescrever compras. Merits de XP preservam experienceDots separados de creationDots, inclusive upgrades de Totem, reedição e rascunhos de avanço.
- Refund verifica custo e instância, impede duplicação de reembolso e protege pré-requisitos de Merits, Skills com Specialties e limites de traits por Primal Urge. Não cura, não altera Essence/Willpower/Harmony e não gera Beats automaticamente. Na criação, desfazer custo planejado não cria saldo fictício.
- Moon/Shadow/Wolf Gifts, concessões/créditos de Renown e Rites receberam fluxos próprios nos lotes seguintes conforme W08/W09; não foram reduzidos a compras genéricas.

### Aprendizado de Rites por XP — 2026-10-01

- Implementada a compra/refund dos 23 Core Rites pelo histórico individual, em criação avançada e Sheet. Cada compra usa o ID canônico do Rite e custa 1 XP/dot; fonte conferida visualmente em WTF2 pp. 84 e 139.
- O jogador descreve a fonte de conhecimento efetivamente encontrada (teacher, spirit, record ou redescoberta); o campo não é traduzido automaticamente e permanece consultável no histórico. A aplicação não pressupõe que ler o catálogo conceda conhecimento nem exige um teacher cadastrado.
- Wolf/Pack Rites compartilham o catálogo individual. Requisitos coletivos são informativos na execução, sem Pack persistence, outras fichas, controle de cerimônia, testes ou geração de Beats. Restrições explícitas de ensino por Tribe são enforçadas na compra.
- Origem de criação e XP permanece separada. Não é possível recomprar um Rite conhecido ou contá-lo na criação após comprá-lo com XP; o Builder mantém opções inválidas removíveis. Refund retira somente o ID aprendido e devolve o custo registrado, sem restaurar snapshots de outros aprendizados.
- O seletor expõe todos os textos mecânicos em EN/PT, busca e filtro Wolf/Pack, além dos motivos de bloqueio; nomes localizados não se tornam identidade persistida. Rites dos suplementos continuam pendentes junto de seus catálogos.
- **Entrega final solicitada em 2026-10-01:** depois de concluir a meta e verificar os gates, fazer merge local da branch `werewolf` com `main` e excluir `werewolf`. Não realizar esse merge enquanto a implementação aprovada estiver incompleta; nenhum push foi solicitado.

### Progressão de Renown e Gifts — 2026-10-01

- Regras conferidas visualmente em WTF2 pp. 84, 99 e 114–115. Cada compra de Renown custa 3 XP por dot e registra um feito digno confirmado pelo jogador, sem empréstimos de XP ou Beats automáticos. Auspice Renown concede as Moon Facets ordenadas gratuitamente, separadas dos IDs de criação e dos poderes pagos.
- Non-Auspice Renown gera um crédito da categoria correspondente. WTF2 p. 99 permite Shadow ou Wolf Facet; a regra específica de Shadow em p. 115 exige um Gift já possuído e permite guardar o crédito. Portanto, a seleção gratuita nunca desbloqueia uma família Shadow. O crédito persiste até uso posterior e pode voltar a pendente sem devolver ou cobrar XP.
- Desbloquear Shadow Gift inclui a primeira Facet por 3 XP se favorecido ou 5 caso contrário, registrando o spirit que concede o Gift. Facets adicionais custam 2 XP. Wolf Facets custam 1 XP e não exigem desbloqueio de família. Cada escolha exige pelo menos um dot no Renown correspondente.
- M05 mantém autorização explícita para outro Moon Gift. Custo de 5 XP pela primeira Facet e 2 por adicional, em ordem crescente, limitadas pelo Renown correspondente. Não libera os modelos Pure/Wolf-Blooded nem transforma leitura de catálogo em concessão de poder.
- Histórico e ledger guardam origens e IDs canônicos distintos para compras, desbloqueios e créditos gratuitos. Refund não remove criação ou outros poderes, exige devolver créditos usados e bloqueia perda de desbloqueio, ordem ou Renown necessário. Builder/rascunhos preservam essas origens; mudança de Auspice exige desfazer primeiro as compras de Renown existentes.
- Seletores EN/PT expõem as 115 Core Facets, textos mecânicos completos, busca, filtros por família/affinity e motivos de bloqueio. Catálogos dos suplementos e os demais itens pendentes acima continuam no escopo da meta.
