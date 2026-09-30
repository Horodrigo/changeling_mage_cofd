# Werewolf — auditoria para decisão antes da implementação

Status: aguardando revisão do usuário. Este documento registra decisões pendentes, não regras já implementadas. `AGENTS.md` e o código atual continuam sendo a referência arquitetural. Remover ou arquivar este documento quando as decisões tiverem sido incorporadas.

## Como revisar

Preencha os campos `Decisão` ou responda pelos identificadores abaixo. Pode aprovar as propostas de apresentação em conjunto e apontar exceções. As propostas **não** são traduções oficiais nem erratas: divergências mecânicas precisam de escolha expressa.

O levantamento abrange os sistemas dos três livros, inclusive os extras de alcateia, humanos, modelos especiais e antagonistas. Não representa uma transcrição/revisão concluída de cada entrada dos futuros catálogos. Essa revisão editorial será feita em lotes durante a implementação, com inglês canônico e português desde o início.

## Fontes e limites já definidos

| Sigla | Livro local | Páginas físicas do PDF |
| --- | --- | --- |
| WTF2 | `pdfSources/Werewolf/2ed - Werewolf the Forsaken.pdf` — Werewolf: The Forsaken Second Edition | 319 |
| PACK | `pdfSources/Werewolf/2ed - WtF - The Pack.pdf` — The Pack | 107 |
| NHSM | `pdfSources/Werewolf/2ed - WtF - Shunned by the Moon.pdf` — Night Horrors: Shunned by the Moon | 205 |

As referências abaixo usam a numeração impressa. Nos trechos numerados consultados, a página física do PDF corresponde à impressa + 1. A ficha oficial de WTF2 não tem número impresso; suas duas páginas são as páginas físicas 317 e 318. Texto extraído foi usado para localizar assuntos; tabelas e trechos mecânicos críticos foram conferidos visualmente, conforme a skill `cofd-pdf-review`.

Requisitos já determinados pelo usuário, sem necessidade de nova aprovação:

- Organização modular como Changeling: `game-lines/werewolf/**`, dados estáticos em `public/data/werewolf/**`, registro leve e carregamento independente de regras, Builder, Sheet, impressão e catálogos.
- Inglês é a identidade canônica; português é apresentação. IDs, regras, compras e histórico não mudam com o idioma. Sem pares de gênero na interface; Numina e Touchstone permanecem esses termos, conforme orientações anteriores.
- CSS normal, mobile, PDF e blank. Nenhuma arte WebP adicional nesta etapa: apenas a skull fornecida, já convertida sem perda em `public/werewolf-skull.webp`, 340 × 589, com transparência preservada.
- Lodges ficam fora desta primeira implementação. A exclusão inclui filiação, benefícios e conteúdo exclusivo dessas organizações, não apenas o menu. WTF2 pp. 51–53 e PACK pp. 73–91 contêm esse material.
- Nada de regras de Werewolf: The Apocalypse, primeira edição isolada ou importações mecânicas de Mage/Changeling/Vampire para implementar Werewolf.
- A correção anterior de `mortalOnly` continua valendo: Uratha não recebem Merits exclusivos de mortais. Exceções precisam estar explicitamente autorizadas pela regra do modelo correto.

## Cobertura do levantamento

| Livro / seção | Sistemas identificados | Decisões relacionadas |
| --- | --- | --- |
| WTF2 pp. 15–50, 57–77 | Auspícios, tribos, Ghost Wolves, habilidades, juramentos, proibições, Hisil, território | W01, W07, W19, L01 |
| WTF2 pp. 81–113 | Criação, Renome, experiência, âncoras, Impulso Primal, Essência, regeneração, sentidos, rastreamento, formas, Aspecto do Caçador, Lunacy, Kuruth, Harmonia, Merits | W01–W08, W22, M01–M04 |
| WTF2 pp. 114–150 | Dons e Facetas, conflito sobrenatural, Clash of Wills, ritos, Fetiches e Talens | W08–W10, W22, M01, M05 |
| WTF2 pp. 153–195 | Mecanismos Core reutilizáveis e entidades efêmeras: Grau, Atributos, Corpus, Essência, Influências, Manifestações, Numina, Interdição e Perdição | W16, W17 |
| WTF2 pp. 197–246 | Pure, espíritos, Hosts, humanos, Ridden, Dread Powers e Idigam | W01, W17, W18 |
| WTF2 pp. 249–276, 281–295 | Cenários, ferramentas de narrativa, forma de Father Wolf, primeira transformação, riscos e gravidez | W03, W19, W21 |
| WTF2 pp. 296–313 | Wolf-Blooded, Tells, Merits, Conditions e Tilts | W01, W13, W22 |
| PACK pp. 10–31 | Alcateia como personagem, membros, experiência, personagens secundários, Hunting Nature e Merits coletivos | W11–W14 |
| PACK pp. 34–65 | Humanos, Wolf-Blooded, lobos, espíritos, Brood, outras criaturas, táticas, benefícios e evolução de totens | W13, W15–W17 |
| PACK pp. 68–72, 94–105 | Protetorados, cenários e Conditions de alcateia | W19, W22 |
| NHSM pp. 13–65, 203 | Pure, Dons, ritos, Merits, Bale Hounds, Tyrants, Devourers, Void Reivers, Mimics e Zi’ir | W01, W08, W18, W20, M06 |
| NHSM pp. 67–105 | Espíritos e Ridden, Wounds, Maeltinet, Dark Numina, espíritos do Vazio e seus efeitos | W17, W19 |
| NHSM pp. 107–139 | Hosts, Church of the Wolf, Merits e ritos humanos, Shadow Occultists e Taboos | W13, W17, W18 |
| NHSM pp. 141–183 | Idigam, Essence Shaping, Dread Powers, Geryo, domínio, contágio e mutações | W17, W20 |
| NHSM pp. 187–203 | Organização de crônicas, Conditions e referência de criação Pure | W19, W22, M06 |

Lodges estão explicitamente excluídas da cobertura implementável. Material narrativo e fichas de antagonistas estão identificados, mas a forma de disponibilizá-los depende de W17/W19; não serão transformados silenciosamente em novos tipos de personagem jogável.

## Decisões de sistemas e apresentação

### W01 — Tipos de personagem e criação

Fontes: WTF2 pp. 81–84, 197–200, 296–305; NHSM pp. 13–22 e 203.

**Proposta:** criação Forsaken com os cinco Auspícios, cinco tribos e Ghost Wolves; criação Pure como opção avançada, sem Auspício/Dom da Lua, com regras próprias de tribo, Aspecto, prata e concessões. Wolf-Blooded devem ter apresentação própria, não uma ficha Uratha com estatísticas zeradas. Membros humanos de alcateia não recebem automaticamente o modelo Uratha.

As concessões e os limites de criação serão calculados na linha Werewolf. Não copiar para Pure a distribuição Forsaken sem conferir a referência específica; há uma lacuna de fonte em M06.

Decisão: pendente — aprovar esses tipos jogáveis ou indicar quais devem ser somente referências/companheiros.

### W02 — Cinco formas na ficha

Fontes: WTF2 pp. 96–98; ficha oficial, PDF físico 318.

**Proposta:** manter Hishu, Dalu, Gauru, Urshul e Urhan com esses nomes. Seletor da forma ativa na ficha; desktop com comparação compacta das cinco formas, mobile com valores da forma ativa e comparação expansível. Mostrar Força, Destreza, Vigor, Manipulação, Tamanho, Vitalidade, Defesa, Iniciativa, Deslocamento, percepção, ataques naturais e regras especiais quando aplicáveis.

Persistir os atributos básicos separadamente da forma ativa. Trocar de forma não reescreve os atributos comprados. A ficha impressa mostra as cinco formas, sem exigir novas imagens.

Decisão: pendente.

### W03 — Vitalidade variável e formas alteradas

Fontes: WTF2 pp. 96–98, 136–138, 287–288; NHSM pp. 62 e 157–158.

**Proposta:** preservar o dano ao mudar de forma; quando a capacidade de Vitalidade diminuir, mostrar a consequência calculada e pedir confirmação para qualquer consequência destrutiva, seguindo a regra verificada na implementação. Não apagar dano nem curar ao reduzir caixas visíveis.

Skin Thief, The Father's Form e Quicksilver Flesh devem ter escolhas/modificadores próprios. The Father's Form não é uma sexta forma liberada gratuitamente: depende da Faceta correspondente. Mimic e mutações Geryo precisam de camadas explícitas sobre as formas, sem adulterar os valores básicos nem permitir alterações arbitrárias sem origem.

Decisão: pendente — aprovar camadas configuráveis com origem e prévia das alterações.

### W04 — Cena, turnos, Gauru e Kuruth

Fontes: WTF2 pp. 97, 102–105.

**Proposta:** controles manuais de nova cena e avançar turno, com duração de Gauru, limite por cena e estados Wasu-Im/Basu-Im. Resultados de testes são informados pelo usuário; nenhum cronômetro em tempo real nem rolagem oculta. Os efeitos de Basu-Im não devem herdar indevidamente o limite normal de Gauru.

Mostrar gatilhos pessoais e gerais, tempo de controle e restrições de ação. Não interpretar uma frase livre como disparador automático de Kuruth.

Decisão: pendente.

### W05 — Essência, regeneração, prata e Impulso Primal

Fontes: WTF2 pp. 93–98, 100–102; diferenças Pure p. 198.

**Proposta:** mostrar reservas, teto e gasto por turno; ações explícitas para regeneração normal, gasto de Essência e regeneração de Gauru. Aplicar mudanças apenas em eventos confirmados, sem curar enquanto a página estiver fechada. Dano agravado/prata e exceções de Merits não entram na cura comum.

Restrições de alimentação, necessidade de caça, resistência a venenos/doenças e sentidos aparecem como regras contextualizadas. Datas de caça/alimentação podem ser registradas manualmente, sem perda automática de atributos ou recursos por calendário.

Decisão: pendente — aprovar acompanhamento por eventos manuais.

### W06 — Harmonia bidirecional e passagem entre mundos

Fontes: WTF2 pp. 100–105.

**Proposta:** escala 0–10 com centro em 5, não uma barra de moralidade equivalente a Integridade. Separar violações relativas à Carne e ao Espírito, mostrar a parada/modificadores e confirmar o resultado antes de aumentar ou diminuir Harmonia. Não oferecer compra de Harmonia por experiência.

Registrar mundo atual, circunstâncias locais da Película e proibições adquiridas. Custos/ações de transformação e passagem serão derivados da Harmonia e das exceções pertinentes. Mudanças locais/temporárias não reescrevem permanentemente Harmonia.

Decisão: pendente.

### W07 — Âncoras, Aspecto e juramentos

Fontes: WTF2 pp. 15–50, 68, 85–88 e 98–100.

**Proposta:** escolhas de Sangue e Osso com descrições, Touchstone física e espiritual, além de entradas autorais. Recuperação de Força de Vontade mediante ação confirmada, respeitando limites aplicáveis. Aspecto do Caçador e suas Conditions de presa são apresentados junto do Auspício/modelo correto.

Juramento da Lua, proibições tribais e gatilhos pessoais ficam visíveis como regras/anotações estruturadas; não detectar transgressões por texto nem impor sanções automaticamente.

Decisão: pendente.

### W08 — Dons, Facetas, Renome e concessões pendentes

Fontes: WTF2 pp. 83–85, 98–100 e 114–138; NHSM pp. 15–20 e 203.

**Proposta:** seleção por família, afinidade, Renome e requisitos, com cartões expansíveis como Contratos. Dons da Lua têm progressão ordenada; Dons da Sombra precisam de desbloqueio e incluem a primeira Faceta; Dons do Lobo não exigem esse desbloqueio. Registrar concessões gratuitas por Renome, inclusive créditos guardados quando não houver Faceta elegível, em vez de descartá-los.

Agony, Blood, Disease, Fervor e Hunger de NHSM não são exclusivos dos Pure: p. 15 permite acesso Forsaken. Afinidade e disponibilidade são critérios distintos. A compra deve separar custo do Dom e custo de Facetas posteriores.

Reembolso de Renome/Dom exige prévia das dependências: proposta de bloquear a remoção enquanto compras dependentes não forem removidas, preservando o custo exato de cada transação e os créditos gratuitos. Não cobrar experiência por uma concessão.

Decisão: pendente — aprovar esse fluxo; custos/acesso em conflito estão em M01 e M05.

### W09 — Ritos e aprendizagem contextual

Fontes: WTF2 pp. 138–146; NHSM pp. 20, 39 e 134–135.

**Proposta:** separar ritos do Lobo e de Alcateia, graduação, símbolos, efeito, custo e procedimentos. Paradas dependentes dos símbolos/circunstâncias precisam de escolha explícita: não transformar uma parada de exemplo em regra fixa.

Na criação, separar os pontos de ritos iniciais dos pontos de Merits convertidos. Na evolução, registrar professor/autorização narrativa, custo e graduação exata. Restrições de modelo seguem cada rito; não liberar ritos especializados apenas por terem sido incluídos no catálogo.

Decisão: pendente.

### W10 — Fetiches e Talens

Fontes: WTF2 pp. 106 e 146–150.

**Proposta:** inventário com entradas independentes, graduação, espírito/poder associado, ativação e efeito completos. Talens consumíveis têm quantidade e consumo confirmado. Separar aquisição por Merit, item obtido em jogo e item autoral; não presumir que o modelo agregado de Penhores de Changeling se aplica às regras de Fetiche.

Ativação por teste ou Essência deve ser uma escolha explícita quando permitida. Não consumir automaticamente um Talen ao apenas expandir sua descrição.

Decisão: pendente.

### W11 — Alcateia como entidade persistida

Fontes: WTF2 pp. 89–92; PACK pp. 20–31.

**Proposta:** registro local próprio de alcateia, com identificação, três Aspirações, Touchstones, Complications, membros, território, Merits coletivos, Natureza da Caçada e totem. Fichas vinculam-se por ID, sem copiar todo o registro para cada personagem e criar versões divergentes.

O modelo é propriedade de Werewolf. Core pode fornecer somente mecanismos neutros de armazenamento/controles. Sem servidor, colaboração online ou sincronização remota nesta etapa. Não confundir os cinco pontos iniciais de Merits da alcateia com o orçamento individual.

Decisão: pendente — registro separado recomendado; alternativa: alcateia anexada a uma ficha, sem sincronização entre fichas.

### W12 — Experiência individual e coletiva

Fontes: WTF2 p. 85; PACK p. 20 e pp. 60–64.

**Proposta:** experiências individuais por padrão, com opção explícita para o sistema de Atos coletivos acordado pela mesa. Registrar distribuição/beneficiários e sobras sem arredondar ou criar experiência. Custos exclusivos da alcateia não saem automaticamente do personagem selecionado.

Confirmar qualquer operação que altere mais de uma ficha local. A experiência coletiva não substitui silenciosamente os históricos individuais já existentes.

Decisão: pendente.

### W13 — Membros humanos, Wolf-Blooded e exceções

Fontes: WTF2 pp. 296–305; PACK pp. 23–25, 31, 37–55 e 59; NHSM pp. 134 e 138–139.

**Proposta:** ficha completa para Wolf-Blooded jogável; membros secundários podem usar o bloco simplificado de PACK e ligação opcional para uma ficha existente. Tells e Merits respeitam requisitos do modelo. Primal Instincts não transforma o membro em Uratha nem concede todos os benefícios de Impulso Primal.

Moon's Grace é restrito a alcateias humanas/Wolf-Blooded; suas exceções para táticas, ritos, Renome e Facetas só são ativadas pelas graduações corretas. Merits de Church of the Wolf e Shadow Occultists seguem suas restrições humanas específicas, que não equivalem a aceitar qualquer não-Uratha.

Transformações como a de Apocalypsis fidei devem solicitar confirmação, mostrar Merits afetados e preservar os dados originais. Nenhuma conversão automática de linha/modelo após informar uma falha dramática.

Decisão: pendente.

### W14 — Natureza da Caçada e ciclo lunar

Fontes: PACK pp. 28–29 e 104–105.

**Proposta:** trilha da alcateia, separada da Harmonia pessoal; registrar atividades relevantes e teste manual na virada do ciclo. O livro usa ciclos de 28 dias a partir do marco escolhido pela alcateia, não necessariamente a lua real ou o mês civil.

Botão de avançar ciclo com prévia de efeitos, Força de Vontade coletiva, Conditions e permissões de Táticas. Preservar exceções de duração/limites por resultado. Não realizar teste ao abrir a aplicação.

Decisão: pendente.

### W15 — Táticas de Alcateia

Fontes: PACK pp. 58–63.

**Proposta:** importar os exemplos e oferecer configuração estruturada de táticas novas: graduação, tema, participantes, parada, execução, efeito e resultados. Decisões que dependem do Narrador ficam explícitas, sem um motor de interpretação de texto.

Separar desenvolvimento/aprendizagem de ingresso em uma tática já conhecida; custos são distintos. Natureza da Caçada limita o uso e permite improvisação em casos específicos; improvisar não cria uma compra de experiência.

Decisão: pendente — aprovar editor de táticas autorais com validações dos limites impressos.

### W16 — Totem e benefícios compartilhados

Fontes: WTF2 pp. 91–92, 183–195; PACK pp. 63–65.

**Proposta:** editor próprio para entidade efêmera: Grau, Poder, Refinamento, Resistência, Corpus, Essência, Força de Vontade, Influências, Manifestações, Numina, Interdição e Perdição. Não reutilizar mecanicamente um companheiro Mage nem exigir nove Atributos humanos.

Contribuições do Merit Totem, alocação de melhorias e benefícios da alcateia são registros distintos. Mostrar origem, destinatário e limites de cada benefício. Concessões não sobrescrevem os Atributos básicos dos membros. Incorporar as opções e limites ampliados de PACK, inclusive sua proibição de o totem conceder Dons à própria alcateia.

Decisão: pendente.

### W17 — Catálogo de antagonistas versus criação jogável

Fontes: WTF2 pp. 178–246; PACK pp. 45–55 e 64–65; NHSM pp. 13–183.

**Proposta:** importar em inglês/português os blocos mecânicos e referências utilizáveis, com pesquisa e cartões completos para espíritos, Ridden, Hosts/Shartha, Idigam, Geryo e antagonistas humanos. Exemplos nomeados ficam disponíveis como referências; não gerar automaticamente novos PCs a partir desses blocos.

Os modelos são diferentes: Geryo não são espíritos, embora compartilhem parte da estrutura efêmera; Idigam precisam de Essence Shaping/Dread Powers; Hosts e Ridden mantêm suas regras próprias. Proposta inicial de edição local dos dados necessários a totem/companheiro, sem um construtor universal de todas as espécies de antagonista.

Decisão: pendente — catálogo completo de mecânicas/referências é a proposta; indicar se também exige criação e edição completas de cada tipo de NPC.

### W18 — Modelos avançados e corrupção

Fontes: NHSM pp. 33–39, 51–65 e 138–139.

**Proposta:** dados completos para Bale Hounds, Tyrants, Devourers, Void Reivers, Mimics, Zi’ir e Shadow Occultists. Inicialmente mostrar os modelos de antagonista como referências aplicáveis somente mediante autorização expressa, não no seletor comum de tribo.

Bale Hounds têm Maeljin, estágios de corrupção, poderes e ritos próprios; não classificá-los automaticamente como Lodge nem excluir seus sistemas por essa hipótese. Tyrants, Devourers, Void Reivers e Mimics têm substituições/recursos particulares; Zi’ir pode retirar capacidades fundamentais. Shadow Occultists possuem reserva própria e Taboos, não a tabela de Essência Uratha.

Decisão: pendente — quais desses modelos devem ser plenamente jogáveis/editoráveis na primeira entrega?

### W19 — Território, ambientes e ferramentas do Narrador

Fontes: WTF2 pp. 71–75 e 249–276; PACK pp. 68–72 e 94–103; NHSM pp. 83–93 e 187–199.

**Proposta:** dados/referências para locais, protetorados, ressonância, Película, Loci, Wounds, Maeltinet, Dark Numina e Vazio; campos manuais para condições do local atual e efeitos temporários. Wounds têm estágios e efeitos cumulativos; o Vazio pode mudar valores efetivos sem alterar valores permanentes do personagem.

Aplicar efeitos selecionados com origem visível e possibilidade de remoção. Não adicionar mapa, simulador de território, gerador de crônica ou integração astronômica sem requisito. Textos de ambientação/organização de histórias permanecem referências, não procedimentos automatizados.

Decisão: pendente — aprovar referências e acompanhamento manual; indicar se exige ferramenta adicional de território/crônica.

### W20 — Infecção, mutações e perda de capacidades

Fontes: NHSM pp. 63–65 e 155–158.

**Proposta:** acompanhamento explícito de exposição, estágio de infecção Geryo, testes e mutações, com histórico. Mostrar consequências antes de aceitar perda de formas, mudança de Atributos, regeneração, sentidos ou gatilhos de Kuruth. O teste de infecção usa os Atributos de Hishu/humanos quando o texto assim determina.

Domínio de um Geryo e Monstrous Servant são relações/Conditions próprias, não aquisição comum de totem. Transformação em Zi’ir e mutações não serão disparadas automaticamente por um valor de Harmonia ou dano. O livro não oferece uma cura mecânica universal; não inventar um botão de cura.

Decisão: pendente — aprovar acompanhamento manual com confirmação das mudanças estruturais.

### W21 — Sistemas opcionais de narrativa

Fontes: WTF2 pp. 287–295.

**Proposta:** referência e controles manuais opcionais para Tension Pool da primeira transformação, Putting It on the Line e Conditions relacionadas à gravidez/filhos. Nenhuma gravidez ou transformação é imposta pela aplicação. Os módulos ficam desativados até escolha da mesa, com texto completo disponível.

Decisão: pendente — aprovar módulos opcionais simples ou solicitar automação específica de algum deles.

### W22 — Conditions, Tilts, testes e poderes contextuais

Fontes: WTF2 pp. 98, 101–102, 115, 186–195 e 306–313; PACK pp. 104–105; NHSM pp. 200–202.

**Proposta:** catálogos com nomes, regras, fontes, resolução e geração de Atos em ambos os idiomas, reconciliando duplicatas somente quando a regra for a mesma. Separar destinatário individual, alcateia, local e presa. Merits com graduações descontínuas e pré-requisitos permanecem validados por IDs, nunca por tradução.

Lunacy não altera automaticamente uma ficha mortal; Aspectos não aplicam Conditions à presa sem confirmação. Mostrar paradas, resistências e Clash of Wills com escolhas contextuais, sem instanciar regras/catálogos de linhas inativas nem criar um motor universal de combate. Custos e efeitos de uso são confirmados, não executados ao consultar texto.

Decisão: pendente.

### W23 — Ficha, impressão e blank

Fontes: composição atual de Changeling; ficha oficial WTF2, PDF físico 317–318.

**Proposta:** primeira página com a geometria compartilhada existente; seções Werewolf para formas, Dons, ritos, Fetiches, totem e alcateia. PDF A4 com anexos paginados conforme conteúdo; blank com as mesmas seções e sem valores preenchidos. Mobile com navegação por abas e linhas expansíveis, evitando descrições permanentemente abertas.

Usar CSS e a skull já fornecida, sem copiar artes de Changeling. Campos de Lodge da ficha impressa oficial não serão reproduzidos. Dados de alcateia na impressão devem refletir o registro vinculado, não uma cópia desatualizada.

Decisão: pendente — aprovar organização proposta ou indicar abas/páginas específicas.

## Divergências mecânicas e lacunas de fonte

### M01 — Custo de Faceta de Dom do Lobo

WTF2 p. 84 (tabela): 1 XP; p. 85 (prosa): 2 XP; p. 115 (regra detalhada): 1 XP; NHSM p. 203: 1 XP.

**Proposta:** usar 1 XP, consistente com a regra detalhada e a referência posterior. Não apresentar a divergência como errata oficial confirmada.

Decisão: pendente.

### M02 — Iniciativa

WTF2 p. 83 usa Destreza + Raciocínio; a ficha oficial, PDF físico 317, usa Destreza + Autocontrole.

**Proposta:** Destreza + Autocontrole, como a ficha oficial e o mecanismo compartilhado atual. Modificadores de forma/ataque são adicionais, não uma troca silenciosa de fórmula.

Decisão: pendente.

### M03 — Deslocamento e Tamanho

WTF2 pp. 83–84 e NHSM p. 203 resumem Deslocamento com Tamanho + Força + Destreza. WTF2 p. 158 descreve fator de espécie, e a ficha oficial, PDF físico 317, usa Força + Destreza + 5. As formas quadrúpedes possuem diferenças próprias (WTF2 pp. 97–98).

**Proposta:** fator humano básico 5 e os modificadores de forma pertinentes, sem somar novamente a variação de Tamanho e produzir dupla contagem. Conferir também Merits que mudam Tamanho.

Decisão: pendente.

### M04 — Armadura natural de Gauru

WTF2 p. 97 não apresenta armadura básica na descrição da forma. A ficha oficial, PDF físico 318, já imprime `1/1` em Gauru.

**Questão:** usar 1/1 da ficha oficial ou não conceder armadura básica sem outra origem? Esse valor não será decidido por inferência a partir de Merits que concedem armadura.

Decisão: pendente — escolher explicitamente.

### M05 — Aprender outro Dom da Lua

WTF2 p. 85 prevê aquisição futura de outro Dom da Lua, com custo e progressão. As entradas de Dons da Lua trazem restrições ao Auspício; por exemplo, Crescent Moon's Gift p. 115 declara disponibilidade apenas para Ithaeur.

**Proposta:** o Dom do próprio Auspício é concedido normalmente; outro Dom exige autorização narrativa explícita, mantendo os custos, ordem e limites descritos na p. 85. Não liberar todos para qualquer Auspício por padrão.

Decisão: pendente — permitir essa exceção autorizada ou restringir ao Auspício sem exceção?

### M06 — Criação Pure e referência externa

NHSM p. 203 declara atualizar a criação Pure de Chronicles of Darkness: Dark Eras Companion. A tabela local informa tribos, Renomes, Perícias, Aspectos, Dons e custos, mas não explicita ali a distribuição inicial de pontos de Renome nem o orçamento inicial de ritos. WTF2 p. 198 acrescenta diferenças de Dons, Totem e prata.

**Questão:** para Pure plenamente jogáveis, autorizar consulta complementar ao trecho citado de Dark Eras Companion, caso disponível, ou fornecer a convenção de criação da mesa? Não presumir que a lista de três Renomes da tabela seja uma concessão de um ponto em cada um, nem copiar automaticamente a concessão de Auspício Forsaken.

Essa é uma lacuna da referência resumida disponível, não uma licença para importar integralmente um quarto livro. Enquanto não resolvida, é possível importar e consultar todas as regras Pure presentes nos três PDFs, mas não declarar um Builder Pure completo/verificado.

Decisão: pendente.

## L01 — Léxico português para aprovação

Preservar Hishu, Dalu, Gauru, Urshul, Urhan, Uratha, Hisil, Kuruth, Wasu-Im, Basu-Im, Siskur-Dah e os nomes próprios dos Auspícios. Títulos dos livros ficam no idioma original. Traduções de nomes de Dons, ritos, Merits e tribos serão auditadas por lotes; os termos abaixo orientam todos esses lotes.

| Inglês | Proposta pt-BR | Observação |
| --- | --- | --- |
| Werewolf | Lobisomem | Linha continua identificada por ID estável, não por esse rótulo. |
| Forsaken | Destituídos | Proposta editorial, não tradução oficial presumida. |
| Pure | Puros | |
| Ghost Wolves | Lobos Fantasmas | |
| Auspice | Auspício | |
| Tribe | Tribo | |
| Renown | Renome | |
| Cunning / Glory / Honor / Purity / Wisdom | Astúcia / Glória / Honra / Pureza / Sabedoria | |
| Primal Urge | Impulso Primal | |
| Essence / Harmony | Essência / Harmonia | |
| Blood / Bone | Sangue / Osso | |
| Hunter's Aspect | Aspecto do Caçador | Hunter não é Huntsman/Monteiro. |
| Death Rage | Fúria Assassina | Kuruth continua Kuruth. |
| Lunacy | Lunatismo | Distinguir do termo comum “loucura”. |
| Moon Gift / Shadow Gift / Wolf Gift | Dom da Lua / Dom da Sombra / Dom do Lobo | |
| Facet | Faceta | |
| Rite / Wolf Rite / Pack Rite | Rito / Rito do Lobo / Rito de Alcateia | |
| Pack | Alcateia | |
| Pack Tactic | Tática de Alcateia | |
| Hunting Nature | Natureza da Caçada | |
| Complications (Pack) | Entraves da Alcateia | Proposta para não confundir com Tilts. |
| Totem / Fetish / Talen | Totem / Fetiche / Talen | |
| Wolf-Blooded | Sangue de Lobo | Precisará de construção gramatical contextual, não de pares de gênero. |
| Tell | Sinal | Distinguir de marcas de Renome. |
| First Tongue | Primeira Língua | |
| Shadow / Gauntlet | Sombra / Película | |
| Reaching | Travessia | Distinguir de Passagem de Changeling. |
| Ban / Bane (entidades efêmeras) | Interdição / Perdição | Já usados na apresentação de entidades em Mage; não renomear Maldições de Vampire. |
| Rank / Power / Finesse / Resistance | Grau / Poder / Refinamento / Resistência | Estatísticas efêmeras, não Atributos humanos. |
| Numina / Touchstone | Numina / Touchstone | Mantidos conforme determinação do usuário. |

Decisão: pendente — aprovar ou corrigir os termos antes da tradução em escala.

## Continuação após a revisão

1. Registrar as decisões e resolver os pontos de fonte necessários, sem inventar regras ausentes.
2. Implementar registro lazy, esquema da linha, normalização e catálogo isolado; manter schema externo 2 e acrescentar o ID suportado somente na fronteira explícita.
3. Importar/auditar os catálogos em lotes EN/PT, incluindo Merits, Conditions, Tilts e mecânicas suplementares aprovadas, sem Lodges.
4. Implementar criação/edição, progressão e compras com concessões e reembolsos exatos; ficha e sistemas extras conforme as decisões acima.
5. Implementar apresentação normal/mobile/PDF/blank, com os recursos visuais existentes e a skull fornecida.
6. Verificar lint, build, TypeScript, testes, limites arquiteturais, isolamento dos catálogos, ida e volta da persistência e os dois idiomas. Verificação visual no navegador fica para o fluxo autorizado de revisão do projeto.

A meta deve permanecer pausada após a entrega deste documento até o usuário revisar e autorizar a continuação. Nenhuma escolha pendente acima será tratada como aprovada apenas pelo silêncio.
