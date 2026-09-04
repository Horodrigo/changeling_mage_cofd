export type SeemingKey = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";
export interface ContractDetail { dicePool?: string | null; loophole?: string | null; seemingBenefits: Partial<Record<SeemingKey,string>>; source?: string; page?: number; missing?: string }
export const CONTRACT_DETAILS: Record<string,ContractDetail> = {
  "ctl-2ed:hostile-takeover": {
    "dicePool": "Nenhum",
    "loophole": "O changeling carrega consigo um objeto que pertence ao proprietário ou residente principal.",
    "seemingBenefits": {
      "Beast": "A Besta convence sentinelas animais a servi-la ativamente.",
      "Fairest": "O jogador da Belíssima ganha dois dados de bônus em um Conflito de Vontades com o dono de uma habitação sobrenatural.",
      "Darkling": "O Trevoso ganha +3 para todas as ações Furtividade e Furto dentro da habitação.",
      "Elemental": "Uma vez que a duração expira, o Elemental pode passar por uma abertura e sair por uma completamente diferente na moradia (um armário de salão para o frigorífico, por exemplo). Ela só pode fazer isso uma vez.",
      "Ogre": "Um Ogre pode usar este efeito em habitações controladas por personagens que também conhecem este Contrato, mas isso provoca um Confronto de Vontades.",
      "Wizened": "O Domovoi convence eletrodomésticos complexos a servi-la (faucets, fornos, vácuos, etc.), embora eles só podem realizar ações que eles são capazes de sob seu próprio poder."
    },
    "source": "Changeling the Lost",
    "page": 128
  },
  "ctl-2ed:mask-of-superiority": {
    "dicePool": "Presença + Subterfúgio + Fado",
    "loophole": "Changeling se veste vagamente para copiar o código de vestimenta da organização. Isto não tem que ser idêntico: calças brancas simples, camisa e chapéu trabalhar como um uniforme marinho",
    "seemingBenefits": {
      "Fairest": "Reduzir todas as portas de partida por um para fins de qualquer manobra social changeling inicia em caracteres afetados.",
      "Ogre": "O Bruiser aparece como segurança para a organização; seu jogador adiciona os sucessos rolados para invocar o Contrato como dados bônus para rolos Intimidação contra qualquer um que acredita no estratagema, a um máximo de +5.",
      "Beast": "A Besta pode usar este efeito nos animais.",
      "Darkling": "No final da cena, ninguém que interagesse com ela se lembrará da aparência do Trevoso em detalhes, desde que ela não fosse identificada como uma estranha.",
      "Elemental": "O Sprite ganha a qualidade de 8 novamente em Presença + Subterfúgio se ela age fora do caráter.",
      "Wizened": "O Mirrado aparece como um funcionário de custódia ou de limpeza para a organização. Todos os rolos para notar que ela se move através de lugares que ela não deve sofrer metade de seus sucessos (em torno) como uma penalidade."
    },
    "source": "Changeling the Lost",
    "page": 128
  },
  "ctl-2ed:paralyzing-presence": {
    "dicePool": "Presença + Intimidação + Fado vs. Compostura + Fado",
    "loophole": "A vítima está sozinha e changeling toca-lhe.",
    "seemingBenefits": {
      "Darkling": "O jogador do Mountebank pode usar Manipulação em vez de Presença para invocar este Contrato.",
      "Fairest": "O jogador do Unicórnio ganha um bônus de três moedas para invocar este Contrato.",
      "Beast": "A Besta pode gastar uma força de vontade para invocar o excepcional efeito de sucesso deste Contrato, mesmo que seu jogador não tenha feito um.",
      "Elemental": "O Elemental pode aplicar o benefício deste Contrato a outro personagem na linha de visão de sua vítima.",
      "Ogre": "O Ogre pode pagar um Glamour adicional ao evocar este efeito para infligir um ponto de dano letal sobre o assunto (isso não acaba com o Insensato).",
      "Wizened": "O Mirrado ganha um +2 em tiros chamados contra a vítima enquanto o Insensate dura."
    },
    "source": "Changeling the Lost",
    "page": 129
  },
  "ctl-2ed:summon-the-loyal-servant": {
    "dicePool": "Nenhum",
    "loophole": "O changeling realizou um favor significativo para o elemento ou material nesta cena, tais como limpar completamente uma fonte pública ou polir uma grande estátua de pedra.",
    "seemingBenefits": {
      "Elemental": "O Sprite pode se fundir com o servidor gastando outro ponto Glamour e um ponto Willpower. Ele substitui os atributos da criatura por seus lugares, torna-se imune a danos infligidos com seu elemento ou material, e adiciona + 1L ao modificador de armas em rolos de ataque.",
      "Fairest": "O Soberano pode gastar um ponto de força de vontade para ligar o servo ao seu Recanto (mesmo um compartilhado). Enquanto o servo permanecer dentro do Recanto, ele permanece animado. O Belíssimo só pode ter um servidor de cada vez.",
      "Beast": "O servo da Besta ganha um ponto adicional de Resistência.",
      "Darkling": "O servo do Trevoso não pode ser amarrado ou amarrado.",
      "Ogre": "O servo do Gárgula ganha um ponto adicional de Poder.",
      "Wizened": "O servo do Mirrado pode executar comandos mais complexos e tem a inteligência de uma criança."
    },
    "source": "Changeling the Lost",
    "page": 129
  },
  "ctl-2ed:tumult": {
    "dicePool": "Presença + Empatia + Fado − Perseverança",
    "loophole": "Changeling plantou um pássaro de origami na pessoa do alvo nesta cena.",
    "seemingBenefits": {
      "Fairest": "The Fairest adiciona estas condições à lista: Inspirado, Swooned, Wanton.",
      "Ogre": "O Ogre acrescenta estas Condições à lista: Bestial, Cowed, Assustado.",
      "Beast": "A Besta adiciona estas Condições à lista: Berserk, Reckless, Shaken.",
      "Darkling": "O Trevoso adiciona estas Condições à lista: Informado, Alavancado, Notoriedade.",
      "Elemental": "O Elemental adiciona estas Condições à lista: Competitivo, Confuso, Distraído.",
      "Wizened": "O Mirrado adiciona estas Condições à lista: Fatigado, Letárgico, Volátil (isso se aplica a um equipamento que o alvo está segurando)."
    },
    "source": "Changeling the Lost",
    "page": 129
  },
  "ctl-2ed:discreet-summons": {
    "dicePool": "Manipulação + Persuasão + Fado vs. Compostura + Fado",
    "loophole": "O changeling puxa um objeto de um local pertencente ou guardado por um inimigo. Ele promete ao hobgoblin algo que é (prática ou moralmente) difícil para ele conseguir e cumpre a promessa.",
    "seemingBenefits": {
      "Darkling": "Um Wisp pode puxar um objeto, ou chamar o hobgoblin, de qualquer espaço escuro suficientemente grande ou sombra.",
      "Fairest": "O hobgoblin convocado serve o changeling até o próximo sol cruzar o horizonte, mesmo que ele não preste atenção nele.",
      "Beast": "A Besta pode invocar um animal mundano como ela faria com um hob.",
      "Elemental": "O Sprite pode transformar o objeto que ele produz em um objeto diferente se puder ocultá-lo da vista dos outros por um turno.",
      "Ogre": "O Ogre pode conjurar um objeto até o Tamanho 3 em um sucesso normal e Tamanho 6 em um sucesso excepcional.",
      "Wizened": "O Chapeleiro pode gastar uma força de vontade para invocar o excepcional efeito de sucesso deste Contrato, mesmo que seu jogador não tenha rolado um."
    },
    "source": "Changeling the Lost",
    "page": 130
  },
  "ctl-2ed:masterminds-gambit": {
    "dicePool": "Nenhum",
    "loophole": "Changeling descreve a hierarquia da organização ou o índice do repositório, ou elabora o plano, em papel que tem pelo menos 50 anos.",
    "seemingBenefits": {
      "Elemental": "O Liberto pode gastar um ponto de Força de Vontade para fazer um repositório durar a história, dando-lhe mais tempo para usá-lo e expandindo seu escopo para abranger uma Especialidade de Habilidade Mental que ele possua. As informações neste repositório se moldam para se adequar à sua afinidade elemental: um fogo que soletra letras enquanto ele lê, ou livros feitos de folhas.",
      "Fairest": "O Soberano também pode usar este Contrato para criar uma organização, já que o Glamour subitamente submete os mortais certos à sua vontade. Esta organização está idealmente preparada para combater a influência do inimigo.",
      "Beast": "O Grim ganha a Condição Steadfast se obtiver sucesso excepcional no uso do repositório, além de qualquer outra Condição que ele ganharia.",
      "Darkling": "O Wisp obtém sucesso excepcionalmente com três sucessos em vez de cinco em quaisquer ações de Investigação que ele realize relacionadas às informações obtidas do repositório.",
      "Ogre": "O Ogro ganha +2 de modificador de dano por usar seu repositório se seu plano envolver violência.",
      "Wizened": "O repositório do Mirrado concede a qualidade 8 novamente além de seu bônus usual."
    },
    "source": "Changeling the Lost",
    "page": 130
  },
  "ctl-2ed:pipes-of-the-beastcaller": {
    "dicePool": "Manipulação + Conhecimento Animal + Fado vs. Perseverança + Compostura",
    "loophole": "Enquanto toca flauta, o changeling faz uma dancinha que imita os movimentos dos animais que deseja invocar.",
    "seemingBenefits": {
      "Beast": "O Grim ganha uma ligação empática com os animais que comanda, permitindo-lhe dar-lhes instruções novas ou adicionais à distância. Ele também está ciente de sua condição física geral e localização em relação à sua.",
      "Fairest": "O personagem pode pagar um ponto adicional de Glamour para invocar e comandar uma segunda espécie de animais.",
      "Darkling": "Os minions animais do Trevoso são difíceis de notar, infligindo um modificador –5 em todos os rolos para detectá-los quando agem furtivamente.",
      "Elemental": "A Torrent concede ao animal imunidade aos danos causados ​​por um determinado elemento.",
      "Ogre": "Os animais do Ogro são imunes ao medo, incluindo efeitos sobrenaturais.",
      "Wizened": "Os lacaios do Mirrado ganham +2 em todas as ações de Inteligência e/ou Raciocínio."
    },
    "source": "Changeling the Lost",
    "page": 131
  },
  "ctl-2ed:the-royal-court": {
    "dicePool": "Nenhum",
    "loophole": "O changeling se levanta e faz um discurso que dura pelo menos cinco minutos.",
    "seemingBenefits": {
      "Fairest": "A proteção da Belíssima se estende às interações sociais; os alvos não podem intimidar ou ameaçar uns aos outros, mas ainda podem se envolver em gentilezas para promover a boa vontade.",
      "Wizened": "A proteção do Chapeleiro se estende a danos mentais, incluindo ataques à Lucidez (mas não a pontos de ruptura).",
      "Beast": "A Besta pode acabar com a violência depois de iniciada, mas isso só pode afetar um número de mortais igual aos seus pontos de Fado mais um. Grupos maiores estão imunes.",
      "Darkling": "O Trevoso pode selecionar um personagem que não seja afetado por este Contrato.",
      "Elemental": "A proteção do Elemental permanece, impondo -2 em quaisquer atos de violência cometidos por aqueles reunidos após o Contrato expirar para outra cena.",
      "Ogre": "O Ogro recebe +3 em qualquer Conflito de Vontades relacionado a este Contrato."
    },
    "source": "Changeling the Lost",
    "page": 131
  },
  "ctl-2ed:spinning-wheel": {
    "dicePool": "Inteligência + Ocultismo + Fado - Perseverança",
    "loophole": "Changeling pica o alvo com uma agulha ou um pino, extraindo pelo menos uma gota de sangue. Tirar uma gota de sangue de um alvo disposto não causa danos.",
    "seemingBenefits": {
      "Fairest": "A Musa ganha três dados de bônus para invocar este Contrato ao encorajar uma experiência positiva. Ele próprio ganha a Condição Inspirada referente às ações que apoiam o evento que está acontecendo.",
      "Ogre": "O Gárgula ganha três dados de bônus para invocar este Contrato ao encorajar uma experiência negativa. Ele próprio ganha a Condição Constante referente às ações que apoiam o evento que está acontecendo.",
      "Beast": "O Mirrado ganha três dados de bônus para invocar este Contrato ao encorajar uma experiência envolvendo animais ou o mundo natural. Ele próprio ganha a Condição Constante referente às ações que apoiam o evento que está acontecendo.",
      "Darkling": "O Trevoso ganha três dados de bônus para invocar este Contrato ao encorajar uma experiência estranha. Ela mesma ganha a Condição Inspirada referente às ações que apoiam o acontecimento do evento.",
      "Elemental": "A Elemental ganha três dados de bônus para invocar este Contrato ao encorajar uma experiência envolvendo ela mesma. Ela mesma ganha a Condição Inspirada referente às ações que apoiam o acontecimento do evento.",
      "Wizened": "O Mirrado ganha três dados bônus para invocar este Contrato ao incentivar uma experiência envolvendo objetos ou máquinas inanimadas. Ela mesma ganha a Condição Steadfast relativa a ações que apoiam o evento que vem a acontecer."
    },
    "source": "Changeling the Lost",
    "page": 132
  },
  "ctl-2ed:blessing-of-perfection": {
    "dicePool": "Nenhum",
    "loophole": "O changeling aceita o pagamento para cumprir este Contrato e então enterra as moedas ou outro objeto negociado.",
    "seemingBenefits": {
      "Fairest": "A Belíssima também pode aplicar os efeitos deste Contrato aos testes de Expressão, Persuasão ou Socialização de outra pessoa.",
      "Wizened": "Um objeto abençoado retém o bônus de todos os testes feitos para usá-lo na cena.",
      "Beast": "Uma Besta também pode aplicar os efeitos deste Contrato às jogadas de Atletismo, Briga ou Sobrevivência de outro personagem.",
      "Darkling": "Um Trevoso também pode aplicar os efeitos deste Contrato aos testes de Furto, Furtividade ou Subterfúgio de outro.",
      "Elemental": "A habilidade abençoada de um Elemental mantém o bônus para todos os testes da cena.",
      "Ogre": "Um Ogro dobra seu Fado se usar este Contrato em uma Arma, até um máximo de +5."
    },
    "source": "Changeling the Lost",
    "page": 132
  },
  "ctl-2ed:changing-fortunes": {
    "dicePool": "Raciocínio + Ocultismo + Fado - Perseverança",
    "loophole": "O changeling falhou dramaticamente em uma de suas próprias ações nesta cena. Ela também pode invocar este Contrato e falhar dramaticamente em uma ação posterior na mesma cena para recuperar o Glamour que gastou nele.",
    "seemingBenefits": {
      "Ogre": "O alvo sofre a Condição Abalado sempre que usar a parada de dados amaldiçoada, até o próximo sol cruzar o horizonte. O efeito inicial ainda se aplica apenas uma vez.",
      "Wizened": "Depois de ver o lançamento do alvo impactado por este Contrato, o jogador pode instruir seu jogador ou o Narrador a rolar novamente. O segundo rolo permanece.",
      "Beast": "Uma vez por cena, a vítima sofre metade do Fado do changeling (arredondado para cima) em dano contundente sempre que ele usar a parada de dados amaldiçoada até o próximo sol cruzar o horizonte. O efeito inicial ainda se aplica apenas uma vez.",
      "Darkling": "A Besta renova um ponto de Força de Vontade se o alvo falhar dramaticamente por causa deste Contrato em sua presença.",
      "Elemental": "O Elemental pode gastar um Glamour adicional para aplicar a qualidade 9 de novo à ação ou privá-la da qualidade de 10 de novo.",
      "Fairest": "A Belíssima renova um ponto de Força de Vontade se o alvo tiver sucesso excepcionalmente devido a este Contrato em sua presença."
    },
    "source": "Changeling the Lost",
    "page": 132
  },
  "ctl-2ed:light-shy": {
    "dicePool": "Nenhum",
    "loophole": "O changeling fica imóvel, na escuridão ou em sombras profundas, por um minuto.",
    "seemingBenefits": {
      "Darkling": "O Feiticeiro temporariamente se apaga da existência, e até mesmo a tecnologia de gravação não mais a detecta.",
      "Wizened": "O Domovoi pode invocar este Contrato em um objeto. As pessoas que viram o objeto anteriormente e que esperariam que ele ainda estivesse lá inventam uma desculpa racional para explicar por que ele desapareceu. Se alguém acidentalmente mover ou derrubar o objeto, o Contrato termina.",
      "Beast": "O Grim pode conceder este efeito a um animal com um toque.",
      "Elemental": "O Elemental pode usar um efeito sobrenatural em alguém com este Contrato, mas apenas uma vez por capítulo.",
      "Fairest": "O Fairest pode aparecer como uma pessoa diferente em qualquer áudio e/ou gravações quando ela usa este efeito, mas ela deve ter falado com eles pessoalmente.",
      "Ogre": "A gárgula pode tomar uma ação agressiva contra outra pessoa ao usar este Contrato, mas apenas uma vez por capítulo."
    },
    "source": "Changeling the Lost",
    "page": 133
  },
  "ctl-2ed:murkblur": {
    "dicePool": "Manipulação + Astúcia + Fado vs. Raciocínio + Fado",
    "loophole": "O changeling come o olho de uma criatura enquanto invoca o Contrato. Ela não precisa arrancá-lo sozinha – os changelings podem comprar um olho no Mercado Goblin ou na internet.",
    "seemingBenefits": {
      "Elemental": "O Liberto pode, em vez disso, fazer o alvo acreditar que está envolvido por um elemento de escolha do changeling. Ele pode cair e rolar, acreditando que está pegando fogo, ou pensando que está se afogando na água. O Narrador escolhe quaisquer Inclinações que pareçam apropriadas para o alvo sofrer.",
      "Wizened": "O Mirrado corta tão completamente os sentidos de seu alvo que ele também sofre a Condição Desorientada.",
      "Beast": "A Besta também enche sua vítima de agonia, impondo um Leg Wrack ou um Arm Wrack.",
      "Darkling": "O Trevoso pode gastar um ponto de Glamour extra para tornar a distração tão completa que a vítima perca a próxima ação.",
      "Fairest": "A Belíssima insere visões idealizadas de si mesmo nas alucinações do alvo, impondo um modificador de –3 no próximo ataque da vítima contra ele.",
      "Ogre": "O Ogro pode aplicar o Beaten Down Tilt ao alvo se conseguir usar este Contrato."
    },
    "source": "Changeling the Lost",
    "page": 133
  },
  "ctl-2ed:trivial-reworking": {
    "dicePool": "Nenhum",
    "loophole": "A personagem tocou outro objeto semelhante ao ilusório que ela cria na mesma cena.",
    "seemingBenefits": {
      "Darkling": "Qualquer tentativa de detectar a falsificação subtrai dados iguais à manipulação do charlatão.",
      "Wizened": "O Mirrado pode afetar um objeto de qualquer tamanho.",
      "Beast": "O Grim pode usar este Contrato em um animal, embora não possa obrigá-lo a se comportar de maneira diferente do que normalmente faria.",
      "Elemental": "O Elemental ganha +3 em qualquer ação Social à qual o item possa se aplicar, mas apenas se ele fizer com que pareça algo natural (ou seja, não feito pelo homem).",
      "Fairest": "O objeto do Fairest resistirá à inspeção mesmo usando ferramentas sofisticadas, como câmeras, raios-X, etc.",
      "Ogre": "Seres normalmente imunes à Máscara devem se envolver em um Confronto de Vontades para ver através deste efeito."
    },
    "source": "Changeling the Lost",
    "page": 133
  },
  "ctl-2ed:changeling-hours": {
    "dicePool": "Nenhum",
    "loophole": "O changeling nomeia um antigo (não atual) proprietário do objeto.",
    "seemingBenefits": {
      "Elemental": "O Elemental também pode afetar instâncias de seu elemento associado a este Contrato - por exemplo, para criar uma chama sempre ardente ou restaurar o florescimento total de uma flor murcha.",
      "Wizened": "O changeling pode tornar o efeito de congelamento permanente gastando também um ponto de Força de Vontade. Poderes sobrenaturais que anulam essa permanência provocam um choque de vontades.",
      "Beast": "A Besta pode usar o efeito de congelamento para curar o dano contundente de uma pessoa, um ponto por turno, até o limite de seus pontos de Sobrevivência. Contanto que este Contrato expire após o dano ter sido curado naturalmente, isso será permanente.",
      "Darkling": "O Trevoso pode usar os efeitos de velocidade e retrocesso sem alterar a aparência do objeto. Isto não é uma ilusão.",
      "Fairest": "A Belíssima pode tornar o efeito de retrocesso permanente gastando um ponto de Força de Vontade. Poderes sobrenaturais que anulam essa permanência provocam um choque de vontades.",
      "Ogre": "O Ogro pode tornar o efeito de aceleração permanente gastando um ponto de Força de Vontade. Poderes sobrenaturais que anulam essa permanência provocam um choque de vontades."
    },
    "source": "Changeling the Lost",
    "page": 134
  },
  "ctl-2ed:dance-of-the-toys": {
    "dicePool": null,
    "loophole": "O changeling inscreve um nome no objeto e então o dá vida: \"Pegue a arma, atire!\" Ela deve dar um novo nome a cada objeto que ganha vida com este Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta imbui o dispositivo com inteligência animal, permitindo que ela dê comandos múltiplos ou mais complexos para seguir. Por exemplo, ela poderia atirar em qualquer pessoa vestindo uma jaqueta vermelha, em vez de atirar às cegas.",
      "Wizened": "O Astuto pode obrigar o dispositivo a sair de sua faixa normal de operação. Em vez de permanecer onde está, a arma pode se mover no ar para atingir os oponentes. O changeling decide onde e como o objeto se move a cada turno, com uma Velocidade igual à sua Fado, mas o Contrato termina se o objeto sair do alcance.",
      "Darkling": "O Wisp pode tornar o dispositivo invisível até interagir com algo ou alguém, mas isso provoca um Confronto de Vontades com personagens que conseguem ver através das ilusões.",
      "Elemental": "Uma vez por cena, o dispositivo pode produzir o elemento preferido do Elemental como uma ação reflexiva, o suficiente para preencher um metro quadrado.",
      "Fairest": "A Belíssima não precisa ter sucesso excepcional para pegar o dispositivo como Retentor, mas ela deve comprá-lo por no mínimo dois pontos.",
      "Ogre": "O Ogro aplica seus pontos de Força como penalidade em quaisquer testes feitos para mudar o curso de ação do dispositivo."
    },
    "source": "Changeling the Lost",
    "page": 134
  },
  "ctl-2ed:hidden-reality": {
    "dicePool": "Nenhum",
    "loophole": "O changeling faz uma demonstração de procura pelo recurso - virando uma caixa em suas mãos e pressionando partes aleatórias dela, antes de \"encontrar\" o compartimento secreto - e expressa surpresa quando o encontra. Isso faz com que a invocação demore um minuto inteiro.",
    "seemingBenefits": {
      "Fairest": "Em vez disso, o Soberano tem como alvo uma pessoa em sua vizinhança, alterando sua Virtude ou Vício (ou âncora equivalente). Isso requer um teste de Manipulação + Subterfúgio + Fado, contestado pela Perseverança + Fado do alvo.",
      "Wizened": "Um Chapeleiro pode pagar um ponto adicional de Glamour para criar objetos totalmente novos que possam ser razoavelmente encontrados na área, como um molho de chaves em uma mesa próxima ou um carro estacionado na garagem.",
      "Beast": "A Besta pode aplicar este contrato a formas de vida simples, como plantas e insetos.",
      "Darkling": "A mudança do Trevoso é assustadora, impondo a Condição Abalado a qualquer um que se deparar com ela.",
      "Elemental": "O Elemental pode fazer uma série de alterações adicionais na área igual ao seu Fado +1.",
      "Ogre": "O Ogro pode gastar um ponto de Glamour adicional para fazer a mudança durar até o próximo nascer do sol, mas apenas uma vez por capítulo."
    },
    "source": "Changeling the Lost",
    "page": 134
  },
  "ctl-2ed:stealing-the-solid-reflection": {
    "dicePool": "Força + Roubo + Fado",
    "loophole": "O changeling persuadiu o dono do original a expressar um sentimento de dívida para com ela, dentro da cena. Isso pode ser sincero, como \"Não esqueci nosso acordo e pagarei em breve\", ou alegre, como \"Café! Devo uma a você!\"",
    "seemingBenefits": {
      "Fairest": "O Unicórnio recupera o reflexo de um ser vivo. O reflexo roubado carrega uma marca do sobrenatural, como ter seis dedos ou olhos heterocromáticos. Os traços mundanos do reflexo são iguais aos do original ou ao Fado do changeling, o que for menor. Por exemplo, se o original tiver Força 3 e o changeling Fado 2, a Força do reflexo se tornará 2. Ele não possui características sobrenaturais (como Lucidez, Fado ou Contratos). A reflexão roubada é amigável e respeitosa com a Belíssima. Em uma falha dramática, a pessoa original não sofre nenhum dano, mas o reflexo que o changeling tentou roubar é uma pessoa espelho residente em Hedge que ganha uma Aspiração para punir o changeling no futuro.",
      "Wizened": "Se o Mirrado gastar um ponto de Glamour adicional, o reflexo roubado retém quaisquer propriedades místicas do original, como uma fruta goblin.",
      "Beast": "A Fera tira uma cópia mais resistente do original. Ele ganha metade de seu Vigor (arredondado para cima) como Durabilidade adicional.",
      "Darkling": "O Trevoso pode usar este Contrato em objetos que mostram até mesmo o menor reflexo.",
      "Elemental": "O Elemental pode copiar coisas insubstanciais ou menos sólidas, como água ou fogo.",
      "Ogre": "O Ogro pode danificar a cópia e causar danos ao original."
    },
    "source": "Changeling the Lost",
    "page": 135
  },
  "ctl-2ed:tatterdemalions-workshop": {
    "dicePool": "Nenhum",
    "loophole": "Changeling está usando óculos grandes e velhos e usa ferramentas arcaicas. Espelho",
    "seemingBenefits": {
      "Ogre": "O Ogre não precisa de peças que se ajustem plausivelmente para fazer o item, à medida que ela puxa e estica objetos em forma – em vez de usar fita adesiva, ela força um Band-Aid em torno de um tubo de escape.",
      "Wizened": "O júri Domovoi pode montar um objeto complexo de qualquer tamanho.",
      "Beast": "A Besta ganha um modificador de +3 na ação Construir Equipamento se usar apenas materiais naturais.",
      "Darkling": "O objeto do Trevoso não confere nenhum bônus de equipamento ou simplesmente não funciona para outros personagens se ele não quiser.",
      "Elemental": "O Elemental pode gastar um Glamour para colocar seu objeto em qualquer recipiente de Tamanho 1 ou maior até que ela precisa usá-lo ou até que o sol próximo nascer, o que vier primeiro. Ela pode fazer isso mesmo que isso não seja fisicamente possível, mas uma vez removido, ele não pode ser armazenado novamente.",
      "Fairest": "O Fairest cria um exemplo ideal do objeto, mesmo com uma marca. Confere a qualidade 9 a todas as utilizações."
    },
    "source": "Changeling the Lost",
    "page": 135
  },
  "ctl-2ed:glimpse-of-a-distant-mirror": {
    "dicePool": "Nenhum",
    "loophole": "O changeling olha para um espelho pertencente a alguém que jurou inimizade contra ele. Ele pode roubar este espelho e levá-lo consigo (ou pode já ter feito isso no passado), desde que não reivindique a propriedade sobre ele.",
    "seemingBenefits": {
      "Beast": "O Selvagem também pode ver em qualquer superfície que atualmente reflita uma pessoa que lhe tenha feito uma promessa ou juramento ou que invoque seu nome, mesmo que a superfície não o tenha refletido anteriormente.",
      "Darkling": "O Trevoso também pode ouvir sons transmitidos pela janela. Se ele desejar, as pessoas do outro lado também poderão vê-lo e ouvi-lo.",
      "Elemental": "O Elemental pode ver através do reflexo perfeitamente, mesmo que esteja opaco (gelo rachado, água lamacenta, etc.).",
      "Fairest": "A Belíssima pode gastar um ponto de Força de Vontade para usar um Contrato Comum em um personagem que ela possa ver através do espelho.",
      "Ogre": "O Ogro pode quebrar a superfície reflexiva do outro lado da janela, infligindo dados (Fado) de dano contundente a qualquer um que esteja diretamente na frente dele.",
      "Wizened": "O Mirrado também pode ver qualquer superfície que atualmente reflita uma pessoa que o enganou ou que lhe deve um favor, mesmo que a superfície não o tenha refletido anteriormente."
    },
    "source": "Changeling the Lost",
    "page": 136
  },
  "ctl-2ed:know-the-competition": {
    "dicePool": "Manipulação + Socialização + Fado vs. Compostura + Fado",
    "loophole": "O changeling incitou seu alvo a desafiá-lo para um jogo.",
    "seemingBenefits": {
      "Beast": "Uma vez, antes do próximo amanhecer, a Fera pode pensar no alvo como uma ação instantânea e saber exatamente onde está e o que está fazendo. Ele também sabe quando ela planeja deixar sua localização atual, embora os eventos ainda possam fazer com que ela saia mais tarde ou mais rapidamente — o Contrato apenas revela o que o alvo pretende naquele momento.",
      "Darkling": "O Trevoso pode invocar este Contrato para observar múltiplos oponentes ao mesmo tempo, até seu nível de Fado, em um jogo com mais de dois jogadores.",
      "Elemental": "O Elemental pode optar por perder o jogo por +2 em ações sociais com seu oponente pelo resto do capítulo, além dos benefícios usuais.",
      "Fairest": "A Musa também aprende a Habilidade Social mais elevada do sujeito e quaisquer Especialidades associadas.",
      "Ogre": "O Ogro ganha a qualidade 8 novamente em todas as ações de Intimidação realizadas contra o alvo pelo resto da cena.",
      "Wizened": "O Mirrado também aprende a maior habilidade mental do sujeito e quaisquer especialidades associadas."
    },
    "source": "Changeling the Lost",
    "page": 136
  },
  "ctl-2ed:portents-and-visions": {
    "dicePool": "Manipulação + Ocultismo + Fado vs. Compostura + Fado",
    "loophole": "O changeling rasga uma foto do alvo.",
    "seemingBenefits": {
      "Darkling": "O Enfeitiçado pode escolher ver um crime ou transgressão passado e infligir a Condição de Culpa ao seu alvo em relação a esse evento.",
      "Elemental": "A Torrente pode optar por ver o próximo evento violento que está por vir e conceder ao seu alvo um pouco de sua resistência para isso. Se o evento acontecer, o alvo ganha os efeitos da Mérito Gigante por uma cena.",
      "Beast": "O Grim ganha +3 para invocar este Contrato se o alvo puder vê-lo.",
      "Fairest": "A Belíssima pode visualizar um encontro romântico passado, concedendo a Condição Inspirada ao sujeito em relação a esse evento. Ela não pode usar esse efeito em si mesma.",
      "Ogre": "O Ogro pode optar por ver um encontro passado assustador, conferindo a Condição Assustada ao sujeito em relação a esse evento.",
      "Wizened": "O Mirrado pode usar este Contrato em objetos inanimados."
    },
    "source": "Changeling the Lost",
    "page": 137
  },
  "ctl-2ed:read-lucidity": {
    "dicePool": "Manipulação + Empatia + Fado vs. Compostura + Fado",
    "loophole": "Changeling toca o alvo, pele a pele.",
    "seemingBenefits": {
      "Beast": "Com um sucesso excepcional, o jogador da Besta pode lançar seus sucessos como dados em um ataque psíquico de Lucidez contra o alvo.",
      "Darkling": "Com um sucesso excepcional, o Trevoso pode emprestar um pouco de sua natureza escorregadia ao alvo: ele ganha Defesa igual ao seu Raciocínio contra o próximo ataque de Lucidez que sofrer. Este efeito dura até o uso ou até o final da sessão, o que ocorrer primeiro.",
      "Elemental": "Com um sucesso excepcional, o próximo ponto de ruptura do Elemental sofre uma penalidade de 1 dado, mas apenas antes do final do capítulo.",
      "Fairest": "Com um sucesso excepcional, a Belíssima pode curar um único ponto de dano leve de Lucidez no marcador de Lucidez do alvo.",
      "Ogre": "Com um sucesso excepcional, o Ogro adiciona +3 ao próximo Contrato que usar sobre o assunto.",
      "Wizened": "Com um sucesso excepcional, o Mirrado abre automaticamente uma porta na próxima vez que se envolver em manobras sociais com o alvo."
    },
    "source": "Changeling the Lost",
    "page": 137
  },
  "ctl-2ed:walls-have-ears": {
    "dicePool": "Nenhum",
    "loophole": "O changeling está em público, entre mortais que podem ouvi-lo contar seu segredo em voz alta.",
    "seemingBenefits": {
      "Darkling": "O Wisp também ganha a Condição Informada sobre o dono do objeto. Se atualmente pertencer a ele, ele ganha a Condição Informada sobre um proprietário anterior que ele pode descrever; “Matt”, “o ogro de pele escura com tapa-olho” ou “o cara que ele acabou de me mostrar” são todos alvos válidos.",
      "Wizened": "O jogador do Envelhecido pode gastar um ponto de Glamour por ponto adicional no tempo que desejar visualizar. Ele deve especificar um momento de acordo com quem estava presente e as circunstâncias gerais, ou simplesmente ver a última pessoa que manuseou o objeto antes do mais recente que ele já viu.",
      "Beast": "A Besta consegue excepcionalmente, com três sucessos, emboscar a pessoa que tocou o objeto pela última vez, se ela escolher essa opção.",
      "Elemental": "O Elemental ganha a qualidade 8 novamente em vez da qualidade 9 novamente para empunhar o item se escolher essa opção.",
      "Fairest": "A Belíssima ganha dois efeitos pelo primeiro Glamour que gasta.",
      "Ogre": "O Ogre pode reduzir a Durabilidade do objeto em três quartos, arredondando para baixo, se ela optar por aplicar essa opção."
    },
    "source": "Changeling the Lost",
    "page": 138
  },
  "ctl-2ed:props-and-scenery": {
    "dicePool": "Manipulação + Persuasão + Fado",
    "loophole": "O changeling está à vista de vários outros, mas ninguém está olhando para ele no momento em que ele invoca o Contrato.",
    "seemingBenefits": {
      "Darkling": "O Trevoso pode estender a duração do Contrato para durar até o próximo sol cruzar o horizonte.",
      "Ogre": "O Gárgula pode assumir a forma de objetos até dobrar seu tamanho por padrão.",
      "Beast": "A forma da Besta é automaticamente móvel e pode mover-se a metade da sua velocidade normal.",
      "Elemental": "O Elemental pode mudar sua forma quando as pessoas não estão olhando, mas ela não pode mudar os traços que ela aplicada por sucesso; ela também só pode ganhar a forma inicial como um permanente em um sucesso excepcional.",
      "Fairest": "O Fairest pode se transformar em uma versão ideal do objeto, e as pessoas sempre escolherão seu primeiro de um grupo de itens semelhantes.",
      "Wizened": "Se o Mirrado se transforma em um objeto funcional, ele concede um modificador de equipamentos +2 (em cima de qualquer bônus natural para tal objeto) para quem o empunha."
    },
    "source": "Changeling the Lost",
    "page": 138
  },
  "ctl-2ed:reflections-of-the-past": {
    "dicePool": "Inteligência + Ocultismo + Fado",
    "loophole": "O changeling deixa um pouco de seu sangue cair na superfície após sofrer pelo menos 1L de dano nesta cena. A superfície absorve o sangue e mostra a visão acima.",
    "seemingBenefits": {
      "Darkling": "O Mountebank pode usar seu conhecimento para detectar fenômenos sobrenaturais dentro dos eventos refletidos.",
      "Fairest": "A Belíssima pode infligir a Condição Alavancada a um dos personagens da visão.",
      "Beast": "A Besta pode ver através dos olhos de qualquer animal refletido na visão.",
      "Elemental": "O Elemental pode ver as auras de qualquer um dentro da reflexão, revelando seus estados emocionais.",
      "Ogre": "O Ogre excepcionalmente consegue usar este Contrato em três sucessos se o evento retratar um momento de violência ou medo.",
      "Wizened": "O Chapeleiro pode perceber a Saúde, Durabilidade, ou Tilts relevantes de qualquer equipamento ou pessoas na cena."
    },
    "source": "Changeling the Lost",
    "page": 138
  },
  "ctl-2ed:riddle-kith": {
    "dicePool": "Manipulação + Furto + Fado vs. Compostura + Fado",
    "loophole": "O changeling presenteou um changeling com algo do Fratria que ele deseja imitar nesta cena. Ele não deve ter recebido nada em troca, além da gratidão. Por exemplo, se ele a convidou para almoçar, constituindo um presente de comida, até mesmo a promessa de que ela “pegará o próximo” anula a Brecha.",
    "seemingBenefits": {
      "Darkling": "O alvo do Trevoso pode realmente se tornar o Fratria que ele personifica — ele perde os benefícios mecânicos de seu próprio Fratria e recebe os do falso Fratria.",
      "Elemental": "A natureza fluida do Elemental permite que ele faça seu alvo parecer diferente também, se ele quiser.",
      "Beast": "A Besta pode tornar o seu sujeito mais mortal. Ele agora pode lidar com +1 dano letal com seus ataques desarmados.",
      "Fairest": "O Fairest pode tornar o seu assunto incrivelmente bonito, concedendo um +2 para socializar rolos com personagens que podem percebê-lo.",
      "Ogre": "O Ogre pode conceder a um sujeito um mien mais intimidante, concedendo um +2 para Intimidação rolos com personagens que podem percebê-lo.",
      "Wizened": "O Mirrado pode alterar uma pessoa que não seja ela mesma indefinidamente num sucesso excepcional, mas apenas um assunto disposto. No entanto, ela só pode usar esse efeito indefinido em um personagem uma vez."
    },
    "source": "Changeling the Lost",
    "page": 139
  },
  "ctl-2ed:skinmask": {
    "dicePool": "Nenhum",
    "loophole": "O changeling segura um objeto pertencente ao personagem que ele deseja imitar quando invoca este Contrato.",
    "seemingBenefits": {
      "Darkling": "O Enfeitiçado dominou tão perfeitamente um rosto que seu jogador pode comprá-lo como Mérito de Identidade Alternativa em qualquer classificação que desejar. Se o fizer, o changeling pode mudar para ele reflexivamente na cena, gastando um ponto de Glamour. Ele só pode ter uma Identidade Alternativa por vez; se ele decidir mudá-la, basta mudar os pontos de Mérito para a nova aparência. O jogador só pode adquirir uma identidade desta forma se o personagem tiver imitado aquela pessoa pelo menos três vezes no passado.",
      "Fairest": "A Belíssima sabe instintivamente se uma ação que planeja realizar está de acordo com a personalidade do alvo que copiou; ganhe três dados de bônus para tentar imitar o comportamento do alvo.",
      "Beast": "A Besta também pode ganhar uma força de vontade para assumir uma forma com uma personalidade significativamente diferente da sua.",
      "Elemental": "O Elemental também pode ganhar uma força de vontade para assumir uma forma significativamente diferente da sua.",
      "Ogre": "A forma do Ogre dá-lhe alguma protecção contra ataques à sua clarividência. Seu próximo ponto de ruptura enquanto nesta forma é tomado em um modificador –2. Isto só pode ser aplicado uma vez por dia antes do sol cruzar o horizonte.",
      "Wizened": "O Mirrado ganha acesso a uma das habilidades mentais da pessoa copiada se for maior do que uma das suas."
    },
    "source": "Changeling the Lost",
    "page": 139
  },
  "ctl-2ed:unravel-the-tapestry": {
    "dicePool": "Raciocínio + Ocultismo + Fado",
    "loophole": "O changeling contraiu uma dívida durante esta cena, que ainda não pagou. Isso pode ser tão trivial quanto prometer uma gorjeta ao barista na próxima vez, já que ele não tem nenhum troco no momento.",
    "seemingBenefits": {
      "Darkling": "O Wisp pode realizar uma ação reflexiva para subir para sua classificação de Furtividade em jardas/metros, imediatamente após promulgar este Contrato, mas antes que o tempo comece novamente.",
      "Wizened": "Agindo com precisão e velocidade impossíveis, o Mirrado ganha um ataque surpresa contra qualquer alvo viável, se ele quiser.",
      "Beast": "A Besta pode ser morta e revivida mais de uma vez com este Contrato, desde que possa pagar o custo, mas os reavivamentos subsequentes infligem três danos leves de Lucidez.",
      "Elemental": "O Elemental excepcionalmente sucede este Contrato com três sucessos em vez de cinco.",
      "Fairest": "A Belíssima pode aplicar este efeito a outro personagem gastando um Glamour adicional. O changeling estará ciente de quaisquer mudanças que ocorram por causa disso.",
      "Ogre": "Se este contrato a reviver da morte, para o seu próximo ataque bem sucedido, o Ogre ganha um bônus de +5 armas contra aquele que a matou."
    },
    "source": "Changeling the Lost",
    "page": 139
  },
  "ctl-2ed:cloak-of-night": {
    "dicePool": "Nenhum",
    "loophole": "O changeling e seus companheiros vestem roupas pretas que os marcam como furtivos e ladinos, como máscaras ou capas.",
    "seemingBenefits": {
      "Darkling": "O Trevoso e seus companheiros retêm os benefícios deste Contrato mesmo que atraiam atenção para si.",
      "Ogre": "O Ogro se aproxima da furtividade indo lentamente – em vez de voar de sombra em sombra, ele simplesmente permanece perfeitamente imóvel e silencioso até que o risco de ser descoberto passe. Ela pode substituir Vigor por Destreza para determinar quantos companheiros ela pode proteger.",
      "Beast": "A Besta exala uma aura territorial; outros personagens não cobertos pelo Contrato evitarão inconscientemente onde quer que ela esteja.",
      "Elemental": "O Elemental pode criar uma mancha estática de escuridão onde ela fica, desde que haja uma explicação razoável, com um raio de até (Fado) metros.",
      "Fairest": "A Belíssima pode ativar este Contrato com Presença em vez de Destreza.",
      "Wizened": "O Mirrado usa as sombras com mais eficiência, garantindo a qualidade 8 novamente a qualquer teste de Furtividade."
    },
    "source": "Changeling the Lost",
    "page": 140
  },
  "ctl-2ed:fae-cunning": {
    "dicePool": "Nenhum",
    "loophole": "O personagem desafia um oponente para um duelo imediato.",
    "seemingBenefits": {
      "Elemental": "A Elemental é desumanamente persistente, adicionando também seu nível de Perseverança à sua Iniciativa e Velocidade.",
      "Ogre": "A pele do Ogro fica dura como pedra ou dura como couro; qualquer arma mundana que a atingir sofre seu nível de Vigor como pontos de dano, sujeito à Durabilidade.",
      "Beast": "A Fera adiciona metade de seus pontos de Atletismo (arredondado para cima) a qualquer dano que ela infligir por Esquiva.",
      "Darkling": "O Trevoso fica invisível por um turno completo se obtiver sucesso excepcional em Esquiva.",
      "Fairest": "The Belíssimo também inflige Swooned ao suposto atacante.",
      "Wizened": "O Mirrado é adepto de fugir de armas complexas, desfrutando de +2 na Defesa contra ataques de Armas de Fogo."
    },
    "source": "Changeling the Lost",
    "page": 140
  },
  "ctl-2ed:shared-burden": {
    "dicePool": "Nenhum",
    "loophole": "O changeling segura uma tira de pele, de dez centímetros ou mais, da criatura que infligiu o ferimento.",
    "seemingBenefits": {
      "Ogre": "A Gárgula cura três pontos de dano por ponto de dano letal infligido.",
      "Wizened": "Hábil na arte da cura, um Chapeleiro cura primeiro o dano letal e depois o contundente.",
      "Beast": "Os primeiros níveis (Fado) de dano que a Besta sofre são contusivos.",
      "Darkling": "O jogador do Trevoso pode testar Fado para evitar o dano deste Contrato, com cada dois sucessos negando um ponto.",
      "Elemental": "O Elemental pode escolher levar um único dano agravado para curar todas as feridas letais e esmagadas do sujeito.",
      "Fairest": "A Belíssima pode curar dano agravado usando este Contrato, mas ela deve gastar um ponto de Força de Vontade por ferimento agravado."
    },
    "source": "Changeling the Lost",
    "page": 140
  },
  "ctl-2ed:thorns-and-brambles": {
    "dicePool": "Nenhum",
    "loophole": "O changeling espalha um punhado de espinhos de Hedge atrás dela.",
    "seemingBenefits": {
      "Darkling": "O Fogo-fátuo ganha o Glamour drenado por Leechweed.",
      "Ogre": "Personagens que se movem através do Briarpatch sofrem uma penalidade em seus testes de Atletismo igual à Força do Ogro.",
      "Beast": "O modificador de dano do Campo de Espinhos é +2L se a Besta usar esse efeito.",
      "Elemental": "A Força do Elemental penaliza todas as ações de Destreza + Atletismo para evitar ficar preso em seu Briarpatch.",
      "Fairest": "A Belíssima pode designar um aliado para ser o centro do raio das amoreiras, e as plantas irão então corresponder aos movimentos desse personagem.",
      "Wizened": "Para cada Glamour roubado com Leechweed, o Mirrado cura um dano contundente ou letal (primeiro)."
    },
    "source": "Changeling the Lost",
    "page": 141
  },
  "ctl-2ed:trapdoor-spiders-trick": {
    "dicePool": "Nenhum",
    "loophole": "O changeling atrai primeiro um inimigo ou rival através do portal.",
    "seemingBenefits": {
      "Ogre": "O Ogro marca a ilusão com um símbolo que permite que seus aliados vejam através dela automaticamente.",
      "Wizened": "A ilusão do Domovoi abrange todos os sentidos; a percepção sobrenatural é necessária para perfurá-lo, provocando um choque de vontades.",
      "Beast": "A Besta marca a ilusão com um sinal de perigo, infligindo a Condição Abalado a qualquer um que tente investigar.",
      "Darkling": "O Trevoso não precisa se mover pela passagem para usar este efeito.",
      "Elemental": "O Elemental não precisa gastar Força de Vontade para prolongar a duração deste Contrato.",
      "Fairest": "A ilusão da Belíssima é particularmente bem feita, infligindo -3 em qualquer ação ou Confronto de Vontades destinada a revelar sua natureza."
    },
    "source": "Changeling the Lost",
    "page": 142
  },
  "ctl-2ed:fortifying-presence": {
    "dicePool": "Presença + Empatia + Fado vs. Perseverança + Fado",
    "loophole": "O changeling professa amizade com o alvo na frente de múltiplas testemunhas enquanto invoca este Contrato. Ela não precisa fazer um juramento, nem mesmo ser sincero, embora ela ainda corra o risco de que a Fado acredite em sua palavra.",
    "seemingBenefits": {
      "Fairest": "O alvo ganha Defesa igual ao nível de Presença da Musa contra o próximo ataque de Lucidez que sofrer durante a história atual.",
      "Ogre": "Em vez disso, um dos Terríveis pode causar o efeito oposto, realizando um ataque de Lucidez contra seu alvo com uma parada de dados igual à sua Empatia. Este uso do Contrato evita que o personagem o use para curar aquele alvo no futuro e pode constituir um ponto de ruptura para ele, a critério do jogador e do Narrador.",
      "Beast": "A Besta cura três danos leves de Lucidez em vez de dois.",
      "Darkling": "O Trevoso esconde a alma de seu alvo de mais traumas: ele pode ignorar o próximo dano leve de Lucidez que sofrer neste capítulo.",
      "Elemental": "O Elemental suprime uma das Condições de Lucidez do alvo pelo resto do capítulo, mas isso não a resolve.",
      "Wizened": "O Mirrado cinge a determinação de seu sujeito; seu próximo fracasso em um ponto de ruptura é dramático."
    },
    "source": "Changeling the Lost",
    "page": 142
  },
  "ctl-2ed:hedgewall": {
    "dicePool": "Inteligência + Sobrevivência + Fado",
    "loophole": "O changeling planta uma semente ou muda da Sebe imediatamente antes de usar este Contrato.",
    "seemingBenefits": {
      "Beast": "A Cerca da Fera é primitiva e inebriante, e os inimigos sofrem um modificador de -2 nas jogadas de Perseverança enquanto estiverem dentro dela.",
      "Ogre": "Hedgewall dura até o próximo sol passar no horizonte.",
      "Darkling": "O Trevoso pode usar pequenas ilusões nas paredes para manter os intrusos fora da base. Eles não podem machucar ninguém fisicamente, mas aplicam seu Fado como penalidade em escaladas e ações que exigem concentração.",
      "Elemental": "O Elemental pode gastar um ponto de Força de Vontade para invocar o sucesso excepcional deste Contrato.",
      "Fairest": "O castelo da Belíssima é transcendentalmente esplêndido, e mesmo inimigos terríveis terão dificuldade em desviar o olhar de suas delícias. Todos os intrusos sofrem -2 em Compostura.",
      "Wizened": "O Mirrado pode criar sentinelas inanimadas ao redor de seu castelo e pode passar um turno se concentrando como uma ação instantânea para olhar através de uma delas."
    },
    "source": "Changeling the Lost",
    "page": 142
  },
  "ctl-2ed:pure-clarity": {
    "dicePool": "Perseverança + Compostura + Fado",
    "loophole": "O changeling veste uma manopla de metal por um lado e uma luva de seda por outro, ao invocar este Contrato. A manopla não precisa ser autêntica – um adereço de fantasia é suficiente, desde que seja feito de metal real.",
    "seemingBenefits": {
      "Fairest": "A Belíssima supera suas circunstâncias e pode invocar este Contrato para se proteger de situações que lhe são infligidas.",
      "Ogre": "O Ogro pode invocar este Contrato para proteger um de seus companheiros.",
      "Beast": "A determinação da Fera é tão grande que inspira seus companheiros. Se ela evitar um ponto de ruptura com este efeito, seus aliados na cena ganham +3 em suas próximas ações.",
      "Darkling": "Se o Trevoso não precisar deste efeito em uma cena, ele poderá reembolsar o custo de Força de Vontade.",
      "Elemental": "O Elemental pode forçar outro changeling a atingir o ponto de ruptura que ele evitou (embora isso possa ser um ponto de ruptura em si).",
      "Wizened": "O Mirrado pode aplicar este efeito a dois pontos de ruptura para obter Força de Vontade adicional."
    },
    "source": "Changeling the Lost",
    "page": 143
  },
  "ctl-2ed:vow-of-no-compromise": {
    "dicePool": "Nenhum",
    "loophole": "O changeling destrói uma representação dos Verdadeiros Fae – um desenho ou foto, um pedaço de vestimenta feérica, etc. Matar um de seus servos também é suficiente.",
    "seemingBenefits": {
      "Ogre": "A Gárgula também ganha a Condição Inspirada no que diz respeito a punir ou cuspir quem foi responsável pelo dano que ela mitigou.",
      "Elemental": "A Sprite não precisa de tocar no alvo dela enquanto estiver cercado ou submerso no elemento associado dela.",
      "Beast": "A Besta mostra o assunto deste poder como lutar, concedendo dois pontos de habilidades físicas até o próximo nascer do sol (o que vier primeiro).",
      "Darkling": "O Trevoso diminui qualquer medo que o sujeito sentiu por causa de sua lesão, concedendo ao sujeito a Condição Steadfast, desde que ela não esteja mirando em si mesma.",
      "Fairest": "O Fairest torna seu assunto melhor do que ela, concedendo um +1 temporário a um atributo de resistência da escolha do Muse até o próximo nascer do sol (o que vier primeiro), impulsionando quaisquer traços derivados.",
      "Wizened": "O Mirrado concede proteção ao sujeito contra aquele que o prejudicou, aumentando sua defesa por 3 contra esse personagem até o próximo nascer do sol (o que vier primeiro)."
    },
    "source": "Changeling the Lost",
    "page": 143
  },
  "ctl-2ed:whispers-of-morning": {
    "dicePool": "Nenhum",
    "loophole": "O changeling não carrega armas e não usa armadura. Se ela pegar ou vestir enquanto usa esta Brecha, o Contrato termina imediatamente, a menos que ela pague o custo de Glamour. Steed Steed está sempre em movimento, atravessando o tempo e o espaço. Onde o garanhão pisa, seus cascos abrem buracos na realidade que permitem ao changeling viajar de um local para outro. Abraçando a liberdade da natureza, as Feras favorecem Steed.",
    "seemingBenefits": {
      "Ogre": "O Bruiser pode carregar uma pessoa nas costas e estender os efeitos deste Contrato a ela. Seu jogador deve testar Presença + Ocultismo + Fado, contestado pelo Vigor + Fado do alvo, se o alvo não estiver disposto.",
      "Wizened": "O Astuto pode pegar objetos Tamanho 1, que se tornam intangíveis, também. Quando ela solta um item, ela pode optar por deixá-lo intangível para a duração, ou imediatamente devolvê-lo ao mundo material.",
      "Beast": "A Fera pode gastar um ponto de Força de Vontade para interagir fisicamente com personagens em forma corpórea durante a cena, mas ela só pode causar dano contundente com ataques, independentemente de outros efeitos, e quaisquer sucessos são limitados por seu Fado ou Força, o que for menor.",
      "Darkling": "O Trevoso pode se sintonizar com fantasmas normais em Crepúsculo como uma ação reflexiva (ele também pode se “dessintonizar”). Se ela os tocar, ela poderá torná-los temporariamente tangíveis, desde que permaneça em contato.",
      "Elemental": "Elemental pode escolher interagir com seu elemento associado, escolhendo se ela conta como corpórea quanto desejar.",
      "Fairest": "O Justo pode escolher personagens que ainda podem perceber e ouvi-la durante a duração."
    },
    "source": "Changeling the Lost",
    "page": 143
  },
  "ctl-2ed:boon-of-the-scuttling-spider": {
    "dicePool": "Nenhum",
    "loophole": "O changeling engole uma aranha viva.",
    "seemingBenefits": {
      "Beast": "O Courser abrange todas as vantagens da aranha, incluindo sua teia. Ele pode usar o movimento de restrição em uma luta agarrada como se tivesse obtido um sucesso excepcional, mesmo que não o tenha feito.",
      "Darkling": "O Trevoso instintivamente permanece nas sombras, concedendo ao seu jogador um bônus de dois dados em testes de Furtividade enquanto ele corre em superfícies improváveis.",
      "Elemental": "A Elemental pode se espremer por espaços não maiores que sua cabeça enquanto usa esse efeito, movendo-se com sua Velocidade normal.",
      "Fairest": "O Mais Belo pode se mover sobre superfícies que normalmente não suportam seu peso.",
      "Ogre": "O Ogro pode atacar enquanto se move com o dobro de sua velocidade ao usar este Contrato.",
      "Wizened": "O Mirrado se move como uma máquina eficiente e bem lubrificada, multiplicando sua Velocidade por 1,5 (arredondado para cima) enquanto rasteja."
    },
    "source": "Changeling the Lost",
    "page": 144
  },
  "ctl-2ed:dreamsteps": {
    "dicePool": "Inteligência + Empatia + Fado vs. Fortificação do Bastião",
    "loophole": "O changeling segura um ursinho de pelúcia ou outro objeto de conforto infantil que pertença ao alvo, enquanto usa este Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta pode assumir a aparência de qualquer um dos pesadelos do adormecido que ele testemunhou. Uma vez durante o capítulo atual, ele pode infligir a Condição Assustada a ela enquanto interage com ela no mundo desperto.",
      "Fairest": "A Belíssima vê um vislumbre da alma do sonhador, concedendo-lhe a Condição Informada em relação a quem dorme.",
      "Darkling": "O Trevoso sabe que coisas fascinantes se escondem na mente do sonhador, ganhando a Condição Inspirada.",
      "Elemental": "O Elemental pode aparecer como qualquer pessoa que o sonhador conheça na vida real.",
      "Ogre": "O Ogro pode assumir a aparência de qualquer sonho positivo que tenha testemunhado. Uma vez durante o capítulo atual, ela pode optar por conceder ao sonhador a Condição Steadfast.",
      "Wizened": "O Chapeleiro pode criar um adereço simples baseado em um dos desejos do sonhador, adicionando um bônus de dado (Fado) aos testes de Persuasão com o sonhador."
    },
    "source": "Changeling the Lost",
    "page": 144
  },
  "ctl-2ed:nevertread": {
    "dicePool": "Nenhum",
    "loophole": "O changeling deixa um bilhete, uma impressão digital ensanguentada ou outra pista de sua morte. Ele pode esconder isso, mas deve fornecer uma pista sobre sua identidade, se for encontrado.",
    "seemingBenefits": {
      "Beast": "A Besta permite que as pessoas que viajam com ele se beneficiem deste Contrato, até o dobro de sua classificação de Furtividade em companheiros. Ele ainda precisa invocar o Contrato apenas uma vez.",
      "Wizened": "Os passos do Domovoi deixam armadilhas em seu rastro, de acordo com a Qualidade Lugar Seguro (pág. 125) com pontos efetivos iguais à sua Destreza.",
      "Darkling": "O Trevoso recebe +3 em qualquer teste de Confronto de Vontades feito contra este efeito.",
      "Elemental": "O Elemental pode criar uma trilha falsa em algum lugar próximo gastando um Glamour adicional.",
      "Fairest": "A Belíssima pode criar uma distração natural para deslumbrar qualquer perseguidor que esteja procurando especificamente por ela, como um lindo canteiro de flores. Eles devem estudá-lo por pelo menos um minuto ou gastar um ponto de Força de Vontade.",
      "Ogre": "Em vez de não deixar rastros, o Ogro pode criar um caminho definido que garanta segurança, adicionando +2 à Defesa de qualquer aliado enquanto segue seu rastro."
    },
    "source": "Changeling the Lost",
    "page": 144
  },
  "ctl-2ed:pathfinder": {
    "dicePool": "Nenhum",
    "loophole": "O changeling sofreu pelo menos 1L de dano nesta cena antes de invocar o Contrato de uma fonte que faz parte da Sebe, como um espinho ou uma faca de hobgoblin.",
    "seemingBenefits": {
      "Beast": "Os instintos aguçados do Grim também fornecem informações sobre criaturas próximas: quantas criaturas são e se têm más intenções. \"Significar mal\" não é imutável - se o changeling irritar um goblin amigável, isso pode significar mal para ele.",
      "Wizened": "O Mirrado sabe automaticamente se as frutas goblins que crescem nas proximidades são benéficas ou prejudiciais e coleta seus tipos.",
      "Darkling": "O Trevoso sabe automaticamente que tipo de mercadorias qualquer Mercado Goblin próximo a ela está vendendo e se os proprietários são (em geral) honestos ou não.",
      "Elemental": "O Elemental também pode apontar o exemplo mais próximo de seu elemento favorecido.",
      "Fairest": "Se a Belíssima se depara com mais de uma opção que se adapta ao seu destino, ela sabe instintivamente qual é a melhor escolha.",
      "Ogre": "O Ogro também conhece os caminhos mais seguros para chegar ao alvo pretendido."
    },
    "source": "Changeling the Lost",
    "page": 144
  },
  "ctl-2ed:seven-league-leap": {
    "dicePool": "Nenhum",
    "loophole": "O changeling está usando botas que roubou de um inimigo nesta cena.",
    "seemingBenefits": {
      "Beast": "O Salto de Sete Léguas aumenta a Velocidade da Besta em 10 para a cena. Se ele usou este Contrato em uma perseguição a pé (pág. 195), ele ganha a Vantagem no próximo turno.",
      "Ogre": "O Ogro pode usar seu salto como um ataque desarmado para esmagar um inimigo, adicionando dois pontos à sua Força para a jogada de ataque e infligindo a Inclinação Derrubada se acertar.",
      "Darkling": "O Trevoso pode usar esse salto para se esconder de um inimigo, o que não exige nenhum teste, desde que haja um local razoavelmente escondido para pousar.",
      "Elemental": "O Elemental pode mudar sua trajetória no ar, desafiando as leis da física. Ela pode fazer isso uma vez por uso deste Contrato.",
      "Fairest": "A Belíssima comanda o vento para levá-la ainda mais longe, movendo-se 15 metros por ponto de Fado em vez de 10.",
      "Wizened": "O Mirrado sabe exatamente onde pousar para obter a melhor vantagem, ganhando seu Fado como bônus em sua próxima ação Física."
    },
    "source": "Changeling the Lost",
    "page": 145
  },
  "ctl-2ed:chrysalis": {
    "dicePool": "Nenhum",
    "loophole": "O changeling está no habitat natural do animal escolhido e está próximo o suficiente para tocar pelo menos um deles.",
    "seemingBenefits": {
      "Beast": "O personagem pode escolher duas formas de animais adicionais quando o jogador adquirir este Contrato.",
      "Ogre": "O personagem pode escolher animais de até tamanho 15 para se transformar.",
      "Darkling": "O Enfeitiçado pode ter uma forma menor que Tamanho 0 (como um inseto), mas sempre requer um Glamour adicional para ser adquirido.",
      "Elemental": "O Elemental pode combinar suas duas formas para obter Força de Vontade, usando as características mais altas, exceto Tamanho, que ela pode escolher se houver uma diferença.",
      "Fairest": "Se a Belíssima usar uma forma mítica, ela poderá adquirir um poder sobrenatural apropriado: Escolha um Poder Terrível para acessar, sujeito à aprovação do Narrador.",
      "Wizened": "O Mirrado pode assumir a forma de máquinas animalescas, ganhando 1/1 de armadura contra todos os ataques e permitindo que ela escolha um único Atributo Físico para mudar um ponto de quando ela se transforma (ou seja, se uma forma de cão-robô tiver Vigor 3 e Força 2, ela pode mudar um ponto do primeiro para o último)."
    },
    "source": "Changeling the Lost",
    "page": 145
  },
  "ctl-2ed:flickering-hours": {
    "dicePool": "Nenhum",
    "loophole": "O changeling quebra um relógio antigo ou outro instrumento antigo de cronometragem enquanto invoca o Contrato.",
    "seemingBenefits": {
      "Beast": "O Selvagem pode estender livremente este Contrato a qualquer pessoa que encontrar em sua jornada, desde que gaste o custo de Força de Vontade para incluir outras pessoas uma vez.",
      "Elemental": "O caminho se torna quase intransponível na esteira do Elemental e sofre os efeitos mecânicos do Ice Tilt com especificidades apropriadas ao seu elemento associado.",
      "Darkling": "O Trevoso pode se esquivar completamente do tempo, congelando sua passagem por turnos (Fado) antes que o efeito normal deste Contrato se aplique. Ela só pode fazer isso uma vez por dia.",
      "Fairest": "A Belíssima não precisa gastar um ponto de Força de Vontade para estender esse efeito aos seus heterogêneos ou àqueles com quem ela tem um juramento ou uma barganha.",
      "Ogre": "Vítimas involuntárias deste efeito devem infligir dano letal ao Ogro com seu Vigor antes que possam tentar se libertar.",
      "Wizened": "Antes que a duração expire, o Envelhecido pode gastar um Glamour reflexivamente para alterar a passagem do tempo na direção oposta de quando invocou o Contrato, inclusive para aqueles que ele também foi afetado."
    },
    "source": "Changeling the Lost",
    "page": 146
  },
  "ctl-2ed:leaping-toward-nightfall": {
    "dicePool": "Inteligência + Ocultismo + Fado vs. Perseverança + Fado",
    "loophole": "O changeling destrói um pedaço do alvo, como um cabelo, uma unha ou fluido corporal; um ícone; ou algo dos sonhos do alvo.",
    "seemingBenefits": {
      "Beast": "A Besta pode permitir que a devastação do tempo atinja alvos sencientes, infligindo a Condição Desorientada. O alvo deve encontrar um aliado para resolvê-lo (os pontos de referência não ajudam) ou deixá-lo desaparecer sem resolução no final da cena em que ele chega.",
      "Darkling": "Ao chegar no futuro, o alvo não se lembra da cena em que o Mountebank invocou este Contrato. Este efeito é permanente, a menos que invertido através de meios sobrenaturais, que desencadeia um Confronto de Vontades contra changeling.",
      "Elemental": "O Elemental pode enviar o alvo para qualquer lugar dentro de (Fado × 2) quilômetros se gastar um ponto de Força de Vontade.",
      "Fairest": "A Belíssima pode usar este contrato em si mesma.",
      "Ogre": "O Ogre pode conceder a seu sujeito alguma proteção contra um futuro desconhecido, concedendo 2/2 armadura ou 3 níveis de Durabilidade para uma cena na chegada.",
      "Wizened": "O Mirrado pode definir uma duração para a viagem do sujeito ao futuro, gastando uma força de vontade. Quando a duração expira, eles retornam para o momento em que desapareceram, mas eles também ganham a Condição Abalada por serem trocados no tempo. Esta duração não pode ser superior a (Fado) horas."
    },
    "source": "Changeling the Lost",
    "page": 146
  },
  "ctl-2ed:mirror-walk": {
    "dicePool": "Raciocínio + Sobrevivência + Fado",
    "loophole": "O changeling fala o nome ou título de um personagem atualmente refletido no espelho de onde ele planeja sair. Isso pode ser uma suposição por parte do changeling, seja porque ele sabe que a pequena Mary vai para a cama às sete e escova o cabelo no espelho antes, ou porque o Sr. Witherfield fecha a porta às cinco e a porta de sua loja tem vidro. Se a pessoa não estiver presente, a Brecha não funciona e ela não invoca o Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta pode encerrar o Contrato antes de chegar ao outro lado, depositando-se deliberadamente no espaço do espelho; seu jogador ganha um bônus de dois dados em todos os testes para navegar até lá ou lidar com seus habitantes na cena.",
      "Elemental": "O Sprite fica espelhado após sair do portal, refletindo apenas o que já está na sala. Isso o torna invisível a olho nu por um número de minutos igual aos sucessos obtidos para invocar o Contrato.",
      "Darkling": "Com um sucesso excepcional, o Trevoso pode gastar um ponto de Força de Vontade para tornar o portal indefinido. No entanto, ele se estilhaça se tocar no ferro.",
      "Fairest": "Em um sucesso excepcional, a Belíssima pode pedir ao espelho para ser seletivo sobre quem ele deixa passar, restringindo a entrada a um grupo seleto ou negando uma categoria específica de pessoas.",
      "Ogre": "O Ogro pode armar uma armadilha se tiver sucesso excepcionalmente, deixando o portal do espelho aberto, mas infligindo dados (Fado) de dano letal a qualquer um que tentar segui-lo.",
      "Wizened": "O Mirrado pode deixar o portal aberto com um sucesso excepcional, mas uma vez que ele e seus aliados estejam no local pretendido, a saída do espelho de entrada é aleatória dentro de (Fado × 2) quilômetros."
    },
    "source": "Changeling the Lost",
    "page": 146
  },
  "ctl-2ed:talon-and-wing": {
    "dicePool": "Nenhum",
    "loophole": "O changeling come um pedaço de pelo, uma garra ou outra parte de um animal que deseja imitar.",
    "seemingBenefits": {
      "Beast": "O Courser não se cansa, imune a qualquer tipo de fadiga mundana. Poderes sobrenaturais que o deixam cansado desencadeiam um Confronto de Vontades.",
      "Darkling": "Um Trevoso pode adicionar presas ou garras venenosas à sua transformação para obter um ponto extra de Glamour. Fora das cenas de ação, este veneno tem Toxicidade igual ao seu Fado e causa dano uma vez por hora, por um número de horas igual a (seis - o Vigor do alvo) horas. No tempo de ação, um ataque bem-sucedido inflige o grave Poisoned Tilt em seu alvo. O veneno permanece em vigor mesmo após o término do Contrato.",
      "Elemental": "O Elemental ganha um efeito adicional para escolher: Ele pode assumir a mente de uma fera, ganhando a qualidade Ação Avançada em testes de Furtividade e Sobrevivência.",
      "Fairest": "O Soberano ganha um efeito adicional para escolher: Ele pode assumir a graça de uma fera, calculando a Defesa com o maior valor entre Destreza ou Raciocínio.",
      "Ogre": "Se o Ogro receber o benefício de “garras”, seus ataques receberão um modificador de +2.",
      "Wizened": "O Mirrado só precisa gastar 1 Glamour para dois efeitos."
    },
    "source": "Changeling the Lost",
    "page": 147
  },
  "ctl-2ed:elemental-weapon": {
    "dicePool": "Presença + Sobrevivência + Fado",
    "loophole": "O personagem realiza um truque vistoso com a versão mundana do elemento como uma ação instantânea. Isso não causa dano se ela invocar este Contrato imediatamente depois.",
    "seemingBenefits": {
      "Darkling": "O Mountebank cria uma arma das sombras, que também pode infligir o Blinded Tilt (ambos os olhos) em vez de causar danos em um sucesso.",
      "Elemental": "Se o Elemental cria uma arma que se adapta à sua própria afinidade elemental, ela se funde com sua máscara e semblante para fazê-la parecer aterrorizante - chamas arqueadas saltam das manoplas para envolvê-la, ou o gelo da espada rasteja ao longo de seu corpo para criar espinhos. O jogador pode fazer um teste de Presença + Intimidação enquanto o personagem empunha a arma, contestado pelo Vigor + Fado de um oponente. Se ela vencer, o alvo sofre a inclinação atordoada. Changelings de outras aparências com este benefício usam o elemento favorito de seu professor.",
      "Beast": "A Besta ganha um +4 em vez de +2 em All-Out Attacks ao usar esta arma.",
      "Fairest": "O Fairest pode usar os sucessos de seu jogador de forma mais eficiente, ganhando dois benefícios para cada sucesso se ela gastar um Glamour adicional ao ativar este Contrato.",
      "Ogre": "O Ogre ganha +3 Defesa enquanto empunha esta arma.",
      "Wizened": "O Mirrado pode invocar este Contrato com Ofícios."
    },
    "source": "Changeling the Lost",
    "page": 147
  },
  "ctl-2ed:might-of-the-terrible-brute": {
    "dicePool": "Nenhum",
    "loophole": "A própria personagem está lutando contra vários oponentes ao mesmo tempo.",
    "seemingBenefits": {
      "Beast": "A Besta pode roubar Destreza; ela decide qual Atributo ela rouba quando invoca o Contrato.",
      "Elemental": "O Elemental também ganha temporariamente os efeitos do Mérito Gigante.",
      "Darkling": "A transformação e a sanguessuga do Trevoso aterrorizam sua vítima, infligindo a Condição Abalado se ela roubar todo o seu Atributo.",
      "Fairest": "A Belíssima pode exceder seu limite de Atributo derivado de Fado em um com este efeito.",
      "Ogre": "O Ogro obtém excepcionalmente sucesso em ações para controlar agarramentos com três sucessos em vez de cinco.",
      "Wizened": "Em vez disso, o Mirrado pode roubar Vigor; ela decide qual Atributo ela rouba quando invoca o Contrato."
    },
    "source": "Changeling the Lost",
    "page": 148
  },
  "ctl-2ed:overpowering-dread": {
    "dicePool": "Presença + Intimidação + Fado vs. Compostura + Fado",
    "loophole": "O changeling fica nas sombras e pega o alvo de surpresa.",
    "seemingBenefits": {
      "Elemental": "A Elemental pode invocar esse poder em um alvo adicional, contestado separadamente por cada um, enquanto ela infunde pavor no próprio ar.",
      "Fairest": "A Belíssima pode optar por fazer o alvo temer o que está ao seu redor e depois confortá-lo. Ele ganha a Condição Desmaiado em relação a ela.",
      "Beast": "A Besta pode, em vez disso, provocar os instintos mais básicos da vítima, infligindo a Condição Bestial.",
      "Darkling": "O Trevoso pode fazer com que a Condição Assustada dure uma cena adicional antes de desaparecer.",
      "Ogre": "O Ogro aplica a qualidade 9 novamente no teste para invocar este Contrato.",
      "Wizened": "O Mirrado pode colocar a fonte do medo em outro personagem da cena."
    },
    "source": "Changeling the Lost",
    "page": 148
  },
  "ctl-2ed:primal-glory": {
    "dicePool": "Nenhum",
    "loophole": "O changeling consome o elemento de alguma forma. Ela pode beber um pouco de água, prender a respiração por um tempo, comer um punhado de terra ou apagar uma vela com a língua e inalar a fumaça.",
    "seemingBenefits": {
      "Elemental": "Se o Sprite escolher uma armadura feita a partir do elemento com o qual ele tem afinidade, em vez disso, ela causará dano a qualquer pessoa dentro (de sua Fado) jardas/metros dela.",
      "Ogre": "O resistente Ogro é totalmente imune a instâncias mágicas do elemento escolhido.",
      "Beast": "A armadura da Besta é tão mortal quanto ela, causando 2 de dano letal em vez de 1.",
      "Darkling": "A armadura do Trevoso lhe proporciona vivacidade, adicionando a qualidade 9 de novo às rolagens de Esquiva.",
      "Fairest": "A Belíssima ganha uma aura de majestade primordial em sua armadura, ganhando um modificador de +1 em Presença enquanto durar.",
      "Wizened": "O inteligente Mirrado ganha um ponto adicional de armadura geral ou balística (escolha do jogador)."
    },
    "source": "Changeling the Lost",
    "page": 148
  },
  "ctl-2ed:touch-of-wrath": {
    "dicePool": "Inteligência + Ofícios + Fado",
    "loophole": "O dono do objeto roubou (ou tentou roubar) algo de valor do changeling, ou o enganou (ou tentou enganar), nesta cena.",
    "seemingBenefits": {
      "Elemental": "O toque do Torrent inflige danos duplos em objetos feitos inteiramente de materiais naturais.",
      "Wizened": "O Mirrado precisa apenas olhar o item para usar este Contrato.",
      "Beast": "O toque da Besta inflige dano duplo em objetos totalmente feitos pelo homem.",
      "Darkling": "O Trevoso pode usar Furto para invocar este contrato.",
      "Fairest": "A Bela pode usar este efeito para fazer esculturas e relevos simples do objeto, desde que tenha sucesso na ativação.",
      "Ogre": "O Ogro pode usar Brawl para invocar este Contrato."
    },
    "source": "Changeling the Lost",
    "page": 148
  },
  "ctl-2ed:elemental-fury": {
    "dicePool": "Nenhum",
    "loophole": "O changeling reclama publicamente, jura vingança ou de outra forma proclama sua raiva a todos os presentes.",
    "seemingBenefits": {
      "Elemental": "Fúria Elemental causa dano contundente igual à Presença da Torrente a qualquer um pego em sua área de efeito quando ela invoca o Contrato.",
      "Fairest": "A Musa pode proteger qualquer alvo que ela possa ver dos efeitos da Inclinação.",
      "Beast": "A Besta também inflige a Condição Desorientada a qualquer um pego na área de efeito.",
      "Darkling": "O Trevoso excepcionalmente obtém sucesso em qualquer ação Furtiva com três sucessos em vez de cinco enquanto este Contrato estiver ativo.",
      "Ogre": "Se o Ogro gastar Glamour para ampliar o alcance deste Contrato, ele aumenta em 30 metros em vez dos 20 habituais.",
      "Wizened": "O Mirrado adiciona um efeito semelhante ao EMP à área, desativando qualquer tecnologia digital para turnos (Fado) após invocar este Contrato."
    },
    "source": "Changeling the Lost",
    "page": 149
  },
  "ctl-2ed:oathbreakers-punishment": {
    "dicePool": "Raciocínio + Empatia + Fado - Compostura",
    "loophole": "O alvo fez uma promessa ao changeling nesta cena, que ainda está em vigor. Essa promessa não precisa ser um juramento e pode ser feita no calor do momento, como “Eu vou derrotar você!”",
    "seemingBenefits": {
      "Wizened": "O Astuto reúne todos os detalhes do juramento quebrado. Por exemplo, ela descobre não apenas que o alvo quebrou seus votos de casamento, mas que traiu o marido com uma morena porque se sente sozinho quando sua esposa trabalha longas noites.",
      "Elemental": "O Elemental pode tornar óbvios os detalhes da promessa quebrada do alvo para qualquer um que esteja assistindo, divulgando sua vergonha e infligindo a Condição de Notoriedade sobre ele.",
      "Beast": "A Besta está mais interessada em fazer seu súdito pecar novamente. Ao gastar um ponto de Força de Vontade, ele também inflige a Condição Devassa à vítima.",
      "Darkling": "O Trevoso não se importa com o que sua vítima faz, desde que ela sofra. Ele assume a condição Assustado no final do pesadelo.",
      "Fairest": "A Belíssima garante o arrependimento de sua vítima ou pelo menos ajuda a fortalecer sua determinação. Ao gastar um ponto de Força de Vontade, ele também inflige a Condição Obsessão ao alvo em relação a fazer as pazes com a ofensa mais grave.",
      "Ogre": "As ilusões do Ogro são literalmente dolorosas de assistir, infligindo até (Fado) dados de dano contundente por pesadelo que ele criar."
    },
    "source": "Changeling the Lost",
    "page": 149
  },
  "ctl-2ed:red-revenge": {
    "dicePool": "Nenhum",
    "loophole": "O changeling usa este Contrato para se vingar de um ente querido ou amigo.",
    "seemingBenefits": {
      "Elemental": "A Torrent ganha um modificador de arma adicional de +1 em ataques de Briga e Armamento.",
      "Ogre": "Os ataques do Ogro também infligem a inclinação derrubada.",
      "Beast": "A Fera excepcionalmente consegue todos os testes de Atletismo e Briga com três sucessos em vez de cinco.",
      "Darkling": "O Trevoso também adiciona +3 à Defesa.",
      "Fairest": "A Belíssima adiciona +5 a um único Atributo (escolha do jogador) além do efeito usual.",
      "Wizened": "O Mirrado pode conceder o efeito deste Contrato a outro caráter disposto."
    },
    "source": "Changeling the Lost",
    "page": 149
  },
  "ctl-2ed:relentless-pursuit": {
    "dicePool": "Nenhum",
    "loophole": "O changeling possui um pedaço do alvo, como cabelo, unha ou fluido corporal; um ícone; ou algo dos sonhos do alvo.",
    "seemingBenefits": {
      "Beast": "O Selvagem também recebe uma breve visão do que seu alvo está fazendo no momento em que invoca o Contrato.",
      "Elemental": "O Elemental pode se esconder dos raios solares enquanto cruza o horizonte, gastando um ponto de Glamour para prolongar a Perseguição Implacável e ganhar um modificador de +1 nas jogadas que seu jogador fizer para a perseguição. Ela pode repetir isso indefinidamente, mas seu modificador de perseguição não aumenta além de +5.",
      "Darkling": "O Trevoso pode gastar um Glamour para ganhar Observador Treinado 1 enquanto durar, mas apenas quando se trata de perceber sua presa. Se ela já tiver a versão de três pontos, ela ganha a qualidade mecânica em Percepção.",
      "Fairest": "O Mais Justo ganha a qualidade 9 novamente e o alvo perde a qualidade 10 novamente em qualquer ação mundana contestada para se engajar na perseguição (por exemplo, uma Perseguição).",
      "Ogre": "O Ogro pode conceder uma bênção a um aliado desaparecido que ele está rastreando, concedendo +2 a todas as ações de Perseverança e/ou Compostura enquanto durar.",
      "Wizened": "O Mirrado sabe a distância exata de sua localização até a de seu alvo."
    },
    "source": "Changeling the Lost",
    "page": 150
  },
  "ctl-2ed:thief-of-reason": {
    "dicePool": "Presença + Subterfúgio + Fado - Perseverança",
    "loophole": "Changeling convenceu o sujeito a fazer uma declaração duvidando de sua própria sanidade, dentro desta cena. Esta declaração funciona mesmo se ela foi feita em hipérbole ou brincadeira, como \"meu chefe está me deixando louco!\"",
    "seemingBenefits": {
      "Elemental": "Os sucessos obtidos no ataque de Lucidez são adicionados ao Fado do changeling para fins de determinar a reserva de dano de Lucidez.",
      "Fairest": "A Belíssima pode pagar um ponto adicional de Glamour para adiar o efeito até que um gatilho de sua escolha ocorra. Se o gatilho não acontecer dentro de um dia, o Contrato termina.",
      "Beast": "Se a vítima sofrer dano de Lucidez, ela também ganha a Condição Acovardada.",
      "Darkling": "O Trevoso pode implantar uma memória falsa do que causou o ponto de ruptura, fazendo a vítima acreditar que foi outra fonte que não o Mountebank.",
      "Ogre": "O Ogro pode escolher limitar o dano de Lucidez que a vítima sofre, independentemente dos resultados de seu teste de Fado (até um mínimo de 1). Usar este efeito aplica –1 ao seu próprio ponto de ruptura.",
      "Wizened": "O Mirrado pode intensificar o ponto de ruptura da vítima, aplicando a qualidade 8 novamente à jogada de ataque de Lucidez."
    },
    "source": "Changeling the Lost",
    "page": 150
  },
  "ctl-2ed:cupids-arrow": {
    "dicePool": "Raciocínio + Empatia + Manto vs. Compostura + Fado",
    "loophole": "O changeling está segurando uma flor de hera viva.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 151
  },
  "ctl-2ed:dreams-of-the-earth": {
    "dicePool": "Presença + Expressão + Manto vs. Compostura + Fado",
    "loophole": "O changeling espalha areia nos olhos de seu alvo ao invocar o Contrato, o que requer um teste bem-sucedido de Destreza + Atletismo – Defesa se o alvo não estiver disposto.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 151
  },
  "ctl-2ed:gift-of-warm-breath": {
    "dicePool": "Nenhum",
    "loophole": "O changeling dá ao alvo algo para comer ou beber que ele mesmo preparou.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 151
  },
  "ctl-2ed:springs-kiss": {
    "dicePool": "Nenhum",
    "loophole": "Changeling está usando botas de chuva amarela brilhante e boné.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 151
  },
  "ctl-2ed:wyrd-faced-stranger": {
    "dicePool": "Presença + Subterfúgio + Manto vs. Compostura + Fado",
    "loophole": "O changeling tem algo de valor emocional para seu alvo em seu bolso. Esse valor pode ser simbólico, como as chaves de um apartamento querido.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 152
  },
  "ctl-2ed:blessing-of-spring": {
    "dicePool": "Inteligência + Medicina + Manto vs. Vigor + Fado (criaturas sapientes)",
    "loophole": "O changeling decora seu alvo com fitas e dança ao redor dela.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 152
  },
  "ctl-2ed:gift-of-warm-blood": {
    "dicePool": "Raciocínio + Medicina + Manto",
    "loophole": "O changeling adiciona seu próprio sangue à mistura, sofrendo um ponto de dano letal.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 152
  },
  "ctl-2ed:pandoras-gift": {
    "dicePool": "Nenhum",
    "loophole": "O alvo deu ao changeling um presente valioso ou sentimental, sem compromisso, durante esta cena. Isso ainda funciona mesmo que ele tenha persuadido o alvo a lhe dar o presente para esse propósito.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 152
  },
  "ctl-2ed:prince-of-ivy": {
    "dicePool": "Presença + Expressão + Manto",
    "loophole": "O changeling fica descalço no solo e corta a mão para espalhar sangue na terra, infligindo um ponto de dano letal.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 153
  },
  "ctl-2ed:waking-the-inner-fae": {
    "dicePool": "Manipulação + Expressão + Manto vs. Compostura + Fado",
    "loophole": "Changeling disse ao alvo um dos seus próprios desejos secretos na última cena.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 153
  },
  "ctl-2ed:baleful-sense": {
    "dicePool": "Raciocínio + Intimidação + Manto vs. Compostura + Fado",
    "loophole": "O changeling persuadiu seu alvo a gritar com ela nesta cena.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 153
  },
  "ctl-2ed:child-of-the-hearth": {
    "dicePool": "Nenhum",
    "loophole": "O personagem sopra uma brasa ou faísca desbotada.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 154
  },
  "ctl-2ed:helios-light": {
    "dicePool": "Nenhum",
    "loophole": "Changeling está na escuridão e não consegue ver.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 154
  },
  "ctl-2ed:high-summers-zeal": {
    "dicePool": "Presença + Persuasão + Manto vs. Compostura + Fado",
    "loophole": "O oponente do changeling foi aquele que arrancou primeiro sangue, incitado ou não.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 155
  },
  "ctl-2ed:vigilance-of-ares": {
    "dicePool": "Nenhum",
    "loophole": "O changeling executou um exercício marcial nesta cena.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 155
  },
  "ctl-2ed:fiery-tongue": {
    "dicePool": "Presença + Intimidação + Manto − Perseverança",
    "loophole": "O changeling afirma verbalmente o domínio sobre seu alvo. Ela pode invocar sua posição no tribunal superior, suas habilidades superiores em crochê ou sua primeira edição do romance Harper Lee, que ele não possui. O que quer que ela baseie sua afirmação deve ser verdade.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 155
  },
  "ctl-2ed:flames-of-summer": {
    "dicePool": "Vigor + Sobrevivência + Manto",
    "loophole": "Pouco antes de invocar este Contrato, a personagem comeu violentamente um pedaço de gelo, esmagando-o com os dentes, para mostrar o poder do verão.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 155
  },
  "ctl-2ed:helios-judgment": {
    "dicePool": "Destreza + Atletismo + Manto",
    "loophole": "O alvo está usando ou tocando ouro puro.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 155
  },
  "ctl-2ed:solstice-revelation": {
    "dicePool": "Nenhum",
    "loophole": "O changeling revela em voz alta um segredo que ela estava guardando intencionalmente para todos os presentes ouvirem.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 156
  },
  "ctl-2ed:sunburnt-heart": {
    "dicePool": "Manipulação + Persuasão + Manto vs. Compostura + Fado",
    "loophole": "Changeling brilha uma luz brilhante nos olhos do oponente enquanto invoca este Contrato, a menos que ele o evite com um rolo reflexivo Wits + Composure.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 156
  },
  "ctl-2ed:autumns-fury": {
    "dicePool": "Nenhum",
    "loophole": "Changeling levanta uma haste de metal para o ar, então a baixa para apontar para seus inimigos, como uma ação instantânea.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 156
  },
  "ctl-2ed:last-harvest": {
    "dicePool": null,
    "loophole": null,
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 156
  },
  "ctl-2ed:tale-of-the-baba-yaga": {
    "dicePool": "Manipulação + Subterfúgio + Manto vs. Compostura + Fado",
    "loophole": "O changeling transforma este Contrato em uma lenda urbana com a qual todos os ouvintes já estão familiarizados.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 157
  },
  "ctl-2ed:twilights-harbinger": {
    "dicePool": "Nenhum",
    "loophole": "O changeling carrega algo com uma conexão significativa com alguém vital para a circunstância ou evento escolhido. Por exemplo, pode ser uma mecha de cabelo da pessoa cuja morte ela deseja prever, ou uma carta de amor trocada entre os participantes do caso.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 157
  },
  "ctl-2ed:witches-intuition": {
    "dicePool": "Raciocínio + Astúcia + Manto vs. Compostura + Fado",
    "loophole": "O changeling come parte do alvo. Esse pedaço pode ser tão pequeno quanto uma gota de sangue derramada acidentalmente, uma unha arrancada ou um único fio de cabelo roubado.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 157
  },
  "ctl-2ed:famines-bulwark": {
    "dicePool": "Raciocínio + Ocultismo + Manto",
    "loophole": "O changeling come o fruto mais recente de uma planta que ele mesmo criou.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 157
  },
  "ctl-2ed:mien-of-the-baba-yaga": {
    "dicePool": "Presença + Intimidação + Manto vs. Compostura + Fado",
    "loophole": "O changeling sussurra o nome ou título do maior medo do alvo. Ele deve ser específico: por exemplo, “O Senhor de Todas as Coisas Achadas e Perdidas”, em vez de “seu Guardião”.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 158
  },
  "ctl-2ed:riding-the-falling-leaves": {
    "dicePool": "Destreza + Ocultismo + Manto",
    "loophole": "O personagem pega uma folha que cai naturalmente no momento da invocação do Contrato, ou qualquer outra coisa que o vento carrega naturalmente, como um pedaço de papel errante ou uma pena caída de um pássaro.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 158
  },
  "ctl-2ed:sorcerers-rebuke": {
    "dicePool": "Manipulação + Ocultismo + Manto – Perseverança",
    "loophole": "O changeling fez um grande discurso ou ameaça de pelo menos 30 segundos de duração, alertando o alvo sobre seu poder místico, no início desta cena. Ele não precisa ser específico sobre suas capacidades.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 158
  },
  "ctl-2ed:tasting-the-harvest": {
    "dicePool": "Presença + Subterfúgio + Manto",
    "loophole": "Changeling tem legítimo salto assustou um dos alvos desta cena.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 158
  },
  "ctl-2ed:the-dragon-knows": {
    "dicePool": "Raciocínio + Empatia + Manto vs. Compostura + Fado",
    "loophole": "O personagem olha nos olhos do sujeito por pelo menos alguns segundos ininterruptos.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 159
  },
  "ctl-2ed:heart-of-ice": {
    "dicePool": "Nenhum",
    "loophole": "O changeling fica descalço em algo frio (neve ou um balde de gelo, por exemplo) por (6 − Manto) turnos antes de invocar o Contrato.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 159
  },
  "ctl-2ed:ice-queens-call": {
    "dicePool": "Nenhum",
    "loophole": "O personagem vê, ou faz alguém estremecer.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 159
  },
  "ctl-2ed:slipknot-dreams": {
    "dicePool": "Manipulação + Empatia + Manto vs. Perseverança + Fado",
    "loophole": "O alvo aceitou um presente valioso ou sentimental do changeling na cena.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 159
  },
  "ctl-2ed:touch-of-winter": {
    "dicePool": "Inteligência + Ciência + Manto",
    "loophole": "O personagem derrete pelo menos um punhado de gelo completamente antes de invocar este Contrato.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 160
  },
  "ctl-2ed:ermines-winter-coat": {
    "dicePool": "Nenhum",
    "loophole": "O changeling cava um buraco, constrói um forte de travesseiros ou cria algum outro pequeno espaço e então se esconde nele enquanto ativa este Contrato.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 160
  },
  "ctl-2ed:fallow-fields": {
    "dicePool": "Manipulação + Empatia + Manto vs. Perseverança + Fado",
    "loophole": "O nome que o changeling anotou é uma das Pedras de Contato do alvo.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 161
  },
  "ctl-2ed:field-of-regret": {
    "dicePool": "Presença + Empatia + Manto − Perseverança",
    "loophole": "O changeling canta uma canção melancólica e deixa um fantasma possuí-la por pelo menos 10 segundos.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 161
  },
  "ctl-2ed:mantle-of-frost": {
    "dicePool": "Nenhum",
    "loophole": "O changeling tira dramaticamente o casaco, deixando-o cair no chão como um manto, e então o destrói.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 161
  },
  "ctl-2ed:winters-curse": {
    "dicePool": "Presença + Sobrevivência + Manto vs. Perseverança + Fado",
    "loophole": "Changeling engole um cubo de gelo inteiro logo antes de invocar este Contrato.",
    "seemingBenefits": {},
    "source": "Changeling the Lost",
    "page": 161
  },
  "ctl-kith-kin:filling-the-cup": {
    "dicePool": "Nenhum",
    "loophole": "Ao invocar o Contrato, changeling fala em voz alta a sua emoção mais forte atual e a sua causa ou a pessoa a quem é dirigido para que todos nas proximidades ouçam.",
    "seemingBenefits": {
      "Beast": "Se o Grim já tiver usado este Contrato ou outro poder relevante, como a Flecha do Cupido da Corte Primaveril (Changeling, p. 151), para identificar ou localizar as emoções de uma pessoa específica e conhecida em qualquer ponto, ele pode identificar essa pessoa novamente com este Contrato de longe pelo cheiro de seus sentimentos.",
      "Fairest": "A Musa pode identificar aqueles que estão ao seu alcance e experimentam uma emoção intensa relacionada a ele. Essa pessoa não precisa necessariamente reconhecer seus próprios sentimentos – como ter ciúmes do amante do changeling sem ter reconhecido isso nem para si mesma. Ele apenas aprende a informação, não a identidade da pessoa."
    },
    "source": "Kith and Kin",
    "page": 35
  },
  "ctl-kith-kin:sleeps-sweet-embrace": {
    "dicePool": "Manipulação + Expressão + Fado - Perseverança",
    "loophole": "O changeling prepara um sonífero, leite morno, chá calmante ou qualquer outro remédio para dormir que envolva beber líquido, e ele convence ou força o alvo a beber tudo na mesma cena em que ele invoca o Contrato.",
    "seemingBenefits": {
      "Beast": "O Gárgula coloca seu alvo em uma hibernação mais profunda, sempre adicionando dois dias adicionais à sua duração.",
      "Darkling": "O alvo do Mountebank parece recentemente morto para todas as formas mundanas de detecção quando dormem. Eles não parecem respirar ou ter pulso, sua pele parece fria, e seus membros estão duros. Maneiras mágicas de detectar se alguém está vivo ou morto levam a um confronto de vontades com o Trevoso."
    },
    "source": "Kith and Kin",
    "page": 36
  },
  "ctl-kith-kin:curses-cure": {
    "dicePool": "Inteligência + Medicina + Fado",
    "loophole": "O changeling prova um pouco da mesma toxina que aflige aquele que ele pretende curar na mesma cena; este Contrato não o protege de seus efeitos mesmo que um pequeno gostinho possa envenená-lo.",
    "seemingBenefits": {
      "Beast": "A Besta pode tornar a toxina sua e infligir a Inclinação Envenenada moderada em um oponente agarrado como uma opção única de luta que requer morder o oponente, desde que ele o faça durante o capítulo em que invocou este Contrato.",
      "Wizened": "O Chapeleiro pode usar este Contrato para reduzir a gravidade de uma doença ou para acabar com os efeitos de uma droga no sistema do alvo; As condições relacionadas a esses efeitos desaparecem sem serem resolvidas."
    },
    "source": "Kith and Kin",
    "page": 37
  },
  "ctl-kith-kin:dreamers-phalanx": {
    "dicePool": "Nenhum",
    "loophole": "Todos os sonhadores participantes fazem parte do mesmo juramento quando este Contrato é invocado. O juramento não precisa ser exclusivo deles; por exemplo, se todos estiverem no mesmo grupo heterogêneo, mas nem todos os companheiros heterogêneos participarem, isso ainda conta. Fazer um juramento especificamente para o propósito deste Contrato dentro da mesma cena também conta.",
    "seemingBenefits": {
      "Beast": "Todos os sonhadores participantes ganham +2 em qualquer ação que realizem e que seja contestada por um oneiropomp externo invadindo qualquer um de seus bastiões.",
      "Wizened": "O Astuto constrói conexões mais fortes e estáveis. Além de ganhar a qualidade 8 novamente, as ações de trabalho em equipe entre os sonhadores dentro dos Bastiões compartilhados alcançam um sucesso excepcional em três sucessos."
    },
    "source": "Kith and Kin",
    "page": 37
  },
  "ctl-kith-kin:closing-deaths-door": {
    "dicePool": "Manipulação + Empatia + Fado",
    "loophole": "O personagem que o changeling tenta reviver é um de seus Touchstones, uma pessoa prometida a ele, ou alguém com quem ele compartilha um juramento pessoal de qualquer tipo.",
    "seemingBenefits": {
      "Fairest": "O personagem revivido também ganha a Condição Desmaiado em relação ao Unicórnio.",
      "Darkling": "O Wisp também ganha uma breve visão dos últimos momentos do personagem revivido antes da morte, do ponto de vista deles, quando ele invoca este Contrato."
    },
    "source": "Kith and Kin",
    "page": 37
  },
  "ctl-kith-kin:feast-of-plenty": {
    "dicePool": "Presença + Socialização + Fado",
    "loophole": "Changeling cumprimenta todos os presentes na cena pelo nome com um gesto, como um aperto de mão ou um abraço, dentro da mesma cena; se não conhece o nome de alguém, deve aprendê-lo e utilizá-lo para invocar o Buraco.",
    "seemingBenefits": {
      "Elemental": "A cornucópia do Unbound é anormalmente atraente; qualquer um que perceber isso deve contestar o teste de invocação com Compostura + Fado ou participar, quer queira ou não.",
      "Ogre": "Aqueles que participam do banquete do Terrível ganham +1 em Defesa pelo resto do capítulo."
    },
    "source": "Kith and Kin",
    "page": 38
  },
  "ctl-kith-kin:still-waters-run-deep": {
    "dicePool": "Manipulação + Subterfúgio + Fado – Perseverança",
    "loophole": "Dentro da mesma cena, o changeling escreve pelo menos um parágrafo detalhando seu estado emocional atual, enfia o papel em uma garrafa e fecha a garrafa.",
    "seemingBenefits": {
      "Wizened": "O Chapeleiro pode escolher entre Condições emocionais ou Condições puramente mentais para suprimir, e pode misturá-las e combiná-las.",
      "Ogre": "Durante a duração do Contrato, o Terrível pode resolver uma das Condições temporárias suprimidas do alvo, atendendo aos seus critérios habituais de resolução; ele ganha a batida da resolução e não do alvo."
    },
    "source": "Kith and Kin",
    "page": 39
  },
  "ctl-kith-kin:poison-the-well": {
    "dicePool": "Manipulação + Expressão + Fado vs. Perseverança + Fado",
    "loophole": "O changeling interage com o alvo da Mérito alvo dentro da mesma cena, semeando conflito ou sabotando um recurso pessoalmente.",
    "seemingBenefits": {
      "Fairest": "A Musa ganha acesso ao Mérito que ele desperdiçou durante a vigência do Contrato, transformando as conexões em seu próprio benefício.",
      "Elemental": "A intromissão do Torrent resulta em extensos danos colaterais; assim que o Contrato termina, a Mérito do alvo retorna na proporção de um ponto por cena, em vez de tudo de uma vez."
    },
    "source": "Kith and Kin",
    "page": 39
  },
  "ctl-kith-kin:shared-cup": {
    "dicePool": "Presença + Ocultismo + Fado vs. Compostura + Fado",
    "loophole": "Changeling deve coletar sangue, um cabelo, uma unha cortada, ou alguma outra parte do corpo de cada participante durante a cena em que todos consomem a bebida ou refeição.",
    "seemingBenefits": {
      "Darkling": "O Enfeitiçado pode pagar 1 de Glamour sempre que faria ou receberia um dos efeitos do vínculo para se separar dos outros, deixando de ativar o efeito compartilhado e excluindo-o de todos os efeitos passivos por alguns segundos (um turno em cenas de ação). Outros participantes podem sentir essa omissão com um teste bem-sucedido de Raciocínio + Compostura contestado pelo Raciocínio + Fado do Trevoso.",
      "Fairest": "A beneficência do Unicórnio enche os demais participantes de gratidão; todos eles sofrem a Condição de Desmaio em relação ao changeling após a invocação do Contrato."
    },
    "source": "Kith and Kin",
    "page": 39
  },
  "ctl-kith-kin:book-of-black-and-red": {
    "dicePool": "Raciocínio + Acadêmicos + Fado vs. Perseverança + Fado",
    "loophole": "O alvo permitiu que o changeling examinasse seus registros ou contas durante a mesma cena.",
    "seemingBenefits": {
      "Darkling": "O Enfeitiçado pode escolher uma das dívidas que o alvo tem (além da Dívida Goblin ou obrigações de penhor) e tornar-se um intermediário; o alvo agora lhe deve a dívida, e ela deve a mesma ou equivalente ao credor original. A papelada e os registros mudam automaticamente para se ajustarem a esta nova realidade, mas porque a Fado se esforça para realizar esta mudança, ela observa o resultado mais de perto. Caso o changeling deixe de pagar sua nova dívida ou de outra forma quebre seu acordo, ele ganha a Condição de Quebrador de Juramento.",
      "Wizened": "O Domovoi precisa de apenas três sucessos para alcançar um sucesso excepcional ao explorar seu conhecimento das obrigações para influenciar o alvo ou saldar suas dívidas."
    },
    "source": "Kith and Kin",
    "page": 40
  },
  "ctl-kith-kin:give-and-take": {
    "dicePool": "Nenhum",
    "loophole": "O changeling e o alvo trocam permanentemente presentes físicos de igual valor ou significado que não tenham dado um ao outro antes.",
    "seemingBenefits": {
      "Ogre": "O Bruiser também pode trocar ou trocar por pontos de dano leve à Lucidez.",
      "Wizened": "A troca do Chapeleiro não precisa ser igual, mas cada parceiro ainda deve negociar pelo menos um ponto em uma categoria, e o alvo ainda deve consentir."
    },
    "source": "Kith and Kin",
    "page": 41
  },
  "ctl-kith-kin:beggar-knight": {
    "dicePool": "Manipulação + Acadêmicos + Fado – Compostura",
    "loophole": "A vítima se beneficiou diretamente do trabalho árduo de outras pessoas, e não do seu próprio, durante a cena; o changeling aciona isso realizando trabalho para o alvo e dando os benefícios gratuitamente.",
    "seemingBenefits": {
      "Elemental": "Qualquer coisa mundana que a vítima possua e não tenha feito para si mesma começa a se degradar. Suas roupas ficam em farrapos em poucos dias; sua casa começa a desabar em meses; seus tesouros mancham ou apodrecem. Essa degradação deixa de afetar qualquer coisa que ele venda ou doe permanentemente, mas se esses itens voltarem à sua propriedade, eles se desintegrarão imediatamente.",
      "Wizened": "Qualquer interação normalmente construtiva que a vítima tenha com a riqueza de outras pessoas - como contabilizar os livros de um cliente, escolher como atribuir os ativos da corporação ou até mesmo pegar alguns dólares para comprar alguns - Novos Contratos e um café - cai sob o efeito da maldição também, negando a qualquer outra pessoa o acesso a quaisquer pontos de Recursos derivados dessa riqueza até que o envolvimento da vítima cesse. Um CFO torna-se subitamente uma responsabilidade legal para a sua empresa; o lavador de dinheiro desvaloriza a fortuna do cartel; o destinatário do café perde a carteira."
    },
    "source": "Kith and Kin",
    "page": 41
  },
  "ctl-kith-kin:coin-mark": {
    "dicePool": null,
    "loophole": "O changeling esculpe ou marca permanentemente o seu nome no objeto.",
    "seemingBenefits": {
      "Beast": "O Grim pode despertar uma possessividade instintiva e mais profunda; ela pode impor a Condição Apreensiva referente ao item encantado ao seu dono, em vez da Avareza.",
      "Wizened": "O changeling pode estalar os dedos como uma ação reflexiva e fazer com que o objeto encantado retorne imediatamente para sua pessoa."
    },
    "source": "Kith and Kin",
    "page": 42
  },
  "ctl-kith-kin:grease-the-wheels": {
    "dicePool": "Presença + Persuasão + Fado",
    "loophole": "O membro da organização aceita um suborno ou presente que o changeling lhe oferece durante a mesma cena.",
    "seemingBenefits": {
      "Darkling": "As interações do Mountebank com a organização são completamente indetectáveis, exceto quando for conveniente para ela.",
      "Fairest": "A Musa ganha a Condição Conectada em relação à organização com a qual interage."
    },
    "source": "Kith and Kin",
    "page": 42
  },
  "ctl-kith-kin:blood-debt": {
    "dicePool": null,
    "loophole": "O changeling usa jóias ou outro adorno que corta ou perfura recentemente sua carne durante esta cena; piercings curados não se qualificam.",
    "seemingBenefits": {
      "Elemental": "Os infratores sofrem uma linha de base de dois pontos de dano letal, em vez de um.",
      "Ogre": "A Gárgula pode, em vez disso, estender sua proteção a seus amigos, impondo o tributo a qualquer dano causado a seus aliados na cena, em vez de a si mesma, desde que permaneça consciente."
    },
    "source": "Kith and Kin",
    "page": 43
  },
  "ctl-kith-kin:exchange-of-gilded-contracts": {
    "dicePool": null,
    "loophole": "O changeling e o alvo vestem uma máscara relativamente convincente um do outro durante a cena.",
    "seemingBenefits": {
      "Darkling": "O Wisp pode explorar a brecha no contrato negociado.",
      "Ogre": "O Terrível não perde o acesso ao Contrato emprestado até o final do capítulo, mesmo que o proprietário original o recupere mais cedo para seu próprio uso, embora ele não possa explorar sua Brecha até que o changeling alvo decida encerrar a Troca de Contratos Dourados."
    },
    "source": "Kith and Kin",
    "page": 43
  },
  "ctl-kith-kin:golden-promise": {
    "dicePool": "Presença + Socialização + Fado – Disponibilidade atual",
    "loophole": "O changeling entra em cena com uma demonstração de riqueza ostentosa, como sair de uma limusine vestido com esmero ou enfeitado com joias de diamantes e exibi-las descaradamente.",
    "seemingBenefits": {
      "Fairest": "O Unicórnio pode dividir seus sucessos entre vários serviços dentro da cena.",
      "Wizened": "O Astuto ganha um bônus de +1 no bônus de equipamento do serviço adquirido."
    },
    "source": "Kith and Kin",
    "page": 43
  },
  "ctl-kith-kin:grand-revel-of-the-harvest": {
    "dicePool": null,
    "loophole": "Changeling fornece uma festa ou banquete grande o suficiente para todos os foliões presentes, e participa de todos se deleita de forma óbvia.",
    "seemingBenefits": {
      "Beast": "Os foliões também ganham um bônus de +2 em todos os testes Físicos que envolvam competir entre si, sparring, dançar, fazer amor e outras atividades de entretenimento físico para a cena.",
      "Fairest": "As atitudes para manobras sociais melhoram em dois passos, em vez de um."
    },
    "source": "Kith and Kin",
    "page": 44
  },
  "ctl-kith-kin:thirty-pieces": {
    "dicePool": "Raciocínio + Empatia + Fado vs. Perseverança + Fado",
    "loophole": "O alvo aceitou o pagamento do metamorfo para trair seus companheiros durante a história atual, mesmo que eles não tinham intenção de realizá-lo.",
    "seemingBenefits": {
      "Darkling": "O alvo do Contrato fica isolado daqueles que traiu após cometer o ato escolhido; eles ganham a Condição de Notoriedade.",
      "Elemental": "Quaisquer salvaguardas ou defesas que possam impedir a traição do alvo falham; um ataque traiçoeiro sempre se beneficia da surpresa, por exemplo, ou uma câmera configurada para detectar intrusos convenientemente falha."
    },
    "source": "Kith and Kin",
    "page": 45
  },
  "ctl-kith-kin:burning-ambition": {
    "dicePool": "Nenhum",
    "loophole": "Na mesma cena, o changeling queima completamente um símbolo de uma obrigação que ela tem para com outra pessoa até que seja destruído.",
    "seemingBenefits": {
      "Beast": "Se o Courser consumir o objeto do desejo, seja comida, bebida ou carne, ele recuperará toda a Força de Vontade quando cumprir a Aspiração.",
      "Fairest": "Se o objeto do desejo da Musa for outro personagem, esse personagem sofre a Condição de Desmaio em relação ao changeling quando ele cumpre a Aspiração."
    },
    "source": "Kith and Kin",
    "page": 45
  },
  "ctl-kith-kin:jealous-vengeance": {
    "dicePool": "Presença + Intimidação + Fado vs. Perseverança + Fado",
    "loophole": "Você fez com que o alvo deste Contrato ganhasse a Condição Perjuro na cena atual, seja direta ou indiretamente.",
    "seemingBenefits": {
      "Elemental": "A ira da Torrente domina sua vítima, fazendo sua maldição durar; ela adiciona a Condição Mudo à lista de opções disponíveis e, se escolher Cego, será Persistente.",
      "Ogre": "O jogador do Gárgula obtém sucesso excepcional com três sucessos no teste de invocação deste Contrato."
    },
    "source": "Kith and Kin",
    "page": 45
  },
  "ctl-kith-kin:litany-of-rivals": {
    "dicePool": "Inteligência + Ocultismo + Fado",
    "loophole": "O changeling tem um acesso de raiva na frente de pelo menos uma outra pessoa que não esteja em sua mesma cena.",
    "seemingBenefits": {
      "Beast": "A Fera pode gastar um Glamour adicional ao descobrir a localização atual de um rival para rastrear sua localização pelo resto do capítulo.",
      "Ogre": "O Ogro pode testar Manipulação + Intimidação ao descobrir o nome ou rosto de um rival, ou de seu aliado mais próximo, para infligir a Condição Paranóica naquele personagem. O alvo contesta este teste com sua Perseverança + Empatia, embora ele não saiba sobre a tentativa sem que habilidades sobrenaturais revelem isso."
    },
    "source": "Kith and Kin",
    "page": 46
  },
  "ctl-kith-kin:knights-oath": {
    "dicePool": "Nenhum",
    "loophole": "O changeling unge seu cavaleiro com seu próprio sangue como a cerimônia de cavalaria exigida; ela deve derramar esse sangue infligindo pelo menos um ponto de dano letal a si mesma na mesma cena. Sangue de ferimentos que ela não causou a si mesma não conta.",
    "seemingBenefits": {
      "Darkling": "Se o cavaleiro desobedecer ou trair o Trevoso, ela saberá não apenas o que aconteceu, mas exatamente quando e onde, bem como quais emoções o cavaleiro sentiu naquele momento.",
      "Fairest": "A Belíssima pode conceder a cavalaria a uma série de alvos iguais ao seu Fado com uma invocação, desde que ela possa realizar o gesto cerimonial em cada um deles separadamente."
    },
    "source": "Kith and Kin",
    "page": 46
  },
  "ctl-kith-kin:unmask-the-dark-horse": {
    "dicePool": "Presença + Persuasão + Fado vs. Compostura + Fado",
    "loophole": "O changeling invoca o Contrato e lança seu desafio na frente de uma grande multidão de pessoas, incluindo pelo menos um dos entes queridos, amigos ou colegas do alvo.",
    "seemingBenefits": {
      "Fairest": "O desafio do Unicórnio e qualquer competição ou confronto com seu alvo que se seguir enquanto este Contrato estiver em vigor será automaticamente visível em tempo real por qualquer pessoa em um raio de oito quilômetros. Eles podem assistir a isso na televisão, ver um vídeo on-line sem dados de upload, ouvir uma peça por peça em uma frequência de rádio que não deveria estar transmitindo nada, ler uma reportagem sobre isso no jornal ou até mesmo vê-la brilhando no horizonte como uma miragem.",
      "Beast": "Sempre que o Grim vence uma competição ou luta contra seu alvo enquanto este Contrato estiver em vigor, ele inflige a Condição de Notoriedade sobre ele, condenando-o ao ostracismo de seu grupo social mais próximo, como um leão que não conseguiu encontrar uma companheira."
    },
    "source": "Kith and Kin",
    "page": 47
  },
  "ctl-kith-kin:a-benevolent-hand": {
    "dicePool": "Nenhum",
    "loophole": "Changeling desiste de algo significativo quando invoca este Contrato.",
    "seemingBenefits": {
      "Elemental": "A notícia dos feitos magnânimos do Torrent se espalha ainda mais e tem mais impacto; ela ganha dois pontos de Aliados em vez de um por cada ação Social bem-sucedida afetada por este Contrato.",
      "Wizened": "A intuição e a pesquisa da Domovoi permitem que ela identifique alvos particularmente úteis, ganhando um ponto adicional de Recursos em vez de Aliados. Isso conta como uma Qualidade de Recursos separada de 1 ponto de qualquer outra que ele já possua, e ele pode ganhar até cinco pontos de Recursos desta forma."
    },
    "source": "Kith and Kin",
    "page": 47
  },
  "ctl-kith-kin:tempters-quest": {
    "dicePool": "Presença + Persuasão + Fado vs. Compostura + Fado",
    "loophole": "Changeling fornece ao buscador uma provisão de uso e valor significativos para ajudar na busca, como uma arma, um símbolo, acesso a uma instalação privada, etc.",
    "seemingBenefits": {
      "Darkling": "Se o Trevoso falhar em fornecer a recompensa acordada a tempo depois que a missão for concluída, ele pode gastar 1 de Força de Vontade e testar Manipulação + Furto + Fado vs.",
      "Fairest": "A Belíssima pode emitir a mesma missão para um número de indivíduos até metade de seu Fado com uma invocação; no entanto, as recompensas oferecidas devem ser proporcionais às missões adicionais."
    },
    "source": "Kith and Kin",
    "page": 48
  },
  "ctl-kith-kin:curse-of-hidden-strings": {
    "dicePool": "Manipulação + Furto + Fado vs. Perseverança + Fado",
    "loophole": "O changeling quebra consciente e deliberadamente uma promessa ou acordo próprio dentro da mesma cena.",
    "seemingBenefits": {
      "Fairest": "A Musa pode ter como alvo vários personagens até seu Fado, desde que todos estejam vinculados à mesma obrigação, como um grupo inteiro ou vários funcionários da mesma empresa.",
      "Wizened": "Em vez de apagar a memória da obrigação do alvo, o Mirrado transfere-a para si mesmo na mente do alvo. Eles podem pensar que são seus companheiros heterogêneos, funcionários ou devedores, por exemplo."
    },
    "source": "Kith and Kin",
    "page": 49
  },
  "ctl-kith-kin:spare-not-the-rod": {
    "dicePool": "Nenhum",
    "loophole": "Changeling faz uma pequena representação de seu cetro de metais preciosos e pedras preciosas, que ela quebra ao meio ao invocar o Contrato.",
    "seemingBenefits": {
      "Fairest": "A Musa pode gastar 2 pontos adicionais de Glamour enquanto ataca ou intimida com o cetro para infligir a Condição Persistente Aterrorizado em vez de Desmoralizado após um teste bem-sucedido.",
      "Wizened": "Uma vez que o Mirrado cria o cetro, ele sempre pode invocá-lo diretamente para sua mão, não importa onde esteja, desde que tenha uma mão livre para segurá-lo. Novos Contratos Se alguém já o estiver segurando, ela deve arrancá-lo com sucesso com um teste de Presença + Intimidação contestado por sua Força + Vigor."
    },
    "source": "Kith and Kin",
    "page": 49
  },
  "ctl-kith-kin:pole-star": {
    "dicePool": "Nenhum",
    "loophole": "Changeling tem na mão um pedaço do seu alvo quando invoca este Contrato. Esta pode ser uma engrenagem do relógio do avô no corredor do seu alvo, ou um pedaço de tecido do casaco do inimigo.",
    "seemingBenefits": {
      "Beast": "O Grim sente o cheiro de sua presa no ar. O jogador da Besta ganha +2 dados em um Confronto de Vontades para descobrir um alvo oculto.",
      "Wizened": "O Chapeleiro já desenhou este mapa antes; ele sabe onde existem dragões e outros perigos. Seu jogador pode fazer uma pergunta ao Narrador sobre um oponente ou obstáculo que encontrará ao longo do caminho."
    },
    "source": "Kith and Kin",
    "page": 50
  },
  "ctl-kith-kin:cynosure": {
    "dicePool": "Manipulação + Empatia + Fado vs. Compostura + Fado",
    "loophole": "O changeling deixa escapar uma oportunidade de realizar uma de suas próprias Aspirações na mesma cena.",
    "seemingBenefits": {
      "Darkling": "O Mountebank manipula eventos das sombras, ganhando a Condição Informada sobre a Aspiração de seu alvo.",
      "Ogre": "O Bruiser não está interessado em ser tímido. Ele incentiva seu alvo a ser ousado, sugerindo ações que, de outra forma, seriam relutantes ou tímidos demais para realizar. Seu jogador adiciona +2 dados ao seu lançamento para convencê-lo."
    },
    "source": "Kith and Kin",
    "page": 50
  },
  "ctl-kith-kin:shooting-star": {
    "dicePool": "Nenhum",
    "loophole": "O changeling completa sua própria ação Construir Equipamento para fazer um trabalho criativo dentro da mesma cena. Em vez disso, as feras podem ter sucesso em um feito impressionante usando Atletismo.",
    "seemingBenefits": {
      "Beast": "Demonstrações de excelência física também inspiram multidões. O Courser pode, em vez disso, ter como alvo alguém que realiza proezas de excelência física, como um jogador de beisebol local, o rato da academia da vizinhança que corre todas as manhãs ou o aspirante a patinador artístico que pratica no lago próximo todo inverno.",
      "Fairest": "O jogador da Musa ganha +2 em testes para colher Glamour."
    },
    "source": "Kith and Kin",
    "page": 51
  },
  "ctl-kith-kin:retrograde": {
    "dicePool": "Presença + Expressão + Fado vs. Perseverança + Fado",
    "loophole": "O changeling gira no sentido anti-horário enquanto conta a história.",
    "seemingBenefits": {
      "Darkling": "O Mountebank nomeia uma série de questões rotineiras específicas até sua classificação de Fado para dar errado para o alvo. Se o alvo mudar sua rotina e não realizar uma ação prevista pelo Trevoso, ele não sofrerá consequências adicionais. Por exemplo, se o changeling escolher “não consegue encontrar uma vaga para estacionar no trabalho”, mas o alvo não trabalhar em casa naquele dia, a escolha será desperdiçada.",
      "Elemental": "O mau tempo frustra o alvo a cada passo. O jogador do Torrent declara uma Inclinação ambiental ou pessoal baseada no clima para afetar o alvo durante a duração do Contrato sempre que for mais inconveniente, a critério do Narrador. Por exemplo, chuvas torrenciais caem depois que o pneu fura ou uma tempestade de neve retarda o trajeto."
    },
    "source": "Kith and Kin",
    "page": 51
  },
  "ctl-kith-kin:frozen-star": {
    "dicePool": "Inteligência + (Empatia ou Persuasão) + Fado vs. Perseverança + Fado",
    "loophole": "O changeling está em contato físico com um pedaço do alvo ou com o próprio alvo quando ele rastreia o alvo nas estrelas.",
    "seemingBenefits": {
      "Darkling": "O Contrato do Mountebank inflige a Condição Assustada, enchendo o alvo com uma sensação de destruição iminente e levando-o a alcançar o alvo o mais rápido possível.",
      "Fairest": "Se o Soberano se definir como alvo, ele passa a ter direito à atenção do súdito; o alvo também ganha um ponto de Dívida Goblin para cada cena em que não estiver na presença do changeling."
    },
    "source": "Kith and Kin",
    "page": 51
  },
  "ctl-kith-kin:light-of-ancient-stars": {
    "dicePool": "Nenhum",
    "loophole": "Os Perdidos cantam os nomes das estrelas em uma constelação atualmente no céu. Star Light,",
    "seemingBenefits": {
      "Darkling": "Nada escapa à atenção do Enfeitiçado. O personagem ganha a Condição de Informado sobre o evento. Se esta Condição não for resolvida antes do final do capítulo, ela desaparece sem resolução, não concedendo Batidas.",
      "Wizened": "O Astuto recebe uma imagem nítida de um item (até Tamanho 3) presente durante o evento. Seu jogador ganha +2 em qualquer teste para criar um fac-símile daquele item. Ele só pode ver objetos simples sem partes móveis com este benefício e, independentemente das qualidades ou habilidades sobrenaturais do original, ele cria um fac-símile totalmente mundano. Ele pode reproduzir com precisão qualquer escrita ou diagrama simples presente na imagem que recebe, mas não obtém nenhum conhecimento sobre como traduzi-la ou interpretá-la."
    },
    "source": "Kith and Kin",
    "page": 52
  },
  "ctl-kith-kin:pinch-of-stardust": {
    "dicePool": "Inteligência + Ofícios + Fado vs. Perseverança + Fado",
    "loophole": "Changeling acrescenta algo de si mesmo ao hodgepodge da criatura de partes: uma mecha de cabelo, três gotas de sangue, recortes de unhas, etc. Espinho",
    "seemingBenefits": {
      "Darkling": "O Feiticeiro fez a orelha direita da criatura fora de uma lata e corda, e manteve a lata presa à outra extremidade. Quando o alvo sussurra um segredo à criatura, o Trevoso ouve-o.",
      "Wizened": "O Domovoi sabe como fazer perfeitos autômatos de relógio e manequins impecável; ao gastar um ponto adicional de Glamour, sua criação dura até o final da história."
    },
    "source": "Kith and Kin",
    "page": 53
  },
  "ctl-kith-kin:briars-herald": {
    "dicePool": "Manipulação + Furto + Fado vs. Compostura + Fado",
    "loophole": "Direta ou indiretamente, changeling causa um espinho, agulha, ou objeto pequeno semelhante, apontado para picar o alvo, desenhando pelo menos uma gota de sangue.",
    "seemingBenefits": {
      "Darkling": "Cada vez que a vítima falha em um teste, não importa a distância entre eles, o changeling pode sussurrar uma mensagem para ela com no máximo 37 palavras, e a vítima pode responder uma vez na mesma moeda. Somente esses dois ouvem as mensagens um do outro, mesmo que alguém esteja próximo deles quando sussurram.",
      "Wizened": "O changeling pode especificar uma cláusula que encerre o Contrato prematuramente. As condições podem ser simples (\"fique em casa e não trabalhe amanhã\") ou elaboradas (\"ajude-me a prender a Rainha dos Duendes que vende cocaína Arcadiana na 1st Street\"), mas devem ser expressas em uma única frase curta. A vítima não tem obrigação de cumprir, mas torna-se subconscientemente consciente dos termos e de que cumpri-los acabaria com o seu sofrimento."
    },
    "source": "Kith and Kin",
    "page": 54
  },
  "ctl-kith-kin:by-the-pricking-of-my-thumbs": {
    "dicePool": "Nenhum",
    "loophole": "Changeling prepara uma poção de hera venenosa, tritão e cardos dentro da mesma cena; ela olha para a poção, estendendo seus sentidos para a flora próxima.",
    "seemingBenefits": {
      "Beast": "Um primo selvagem, o Grim pode usar a planta que ela habita como uma arma natural. Estes ataques utilizam a Força da Besta + (Brawl ou Arma) e causam danos. Se a planta tiver espinhos ou agulhas, aumente os danos para letal. Estes ataques não levam a pena para perceber em dois lugares ao mesmo tempo, mas changeling pode ainda tomar apenas uma ação instantânea por turno.",
      "Darkling": "O Feiticeiro pode ocupar um número de plantas até ou igual a sua Perseverança simultaneamente; uma ação instantânea usada para mudar de uma planta para outra só muda uma dessas extensões simultâneas de cada vez. Assim, é preciso múltiplas ações para devolver completamente seus sentidos a si mesma, a menos que ela termine o contrato mais cedo."
    },
    "source": "Kith and Kin",
    "page": 55
  },
  "ctl-kith-kin:thistles-rebuke": {
    "dicePool": "Nenhum",
    "loophole": "O changeling bebe um copo inteiro de água antes de invocar este Contrato.",
    "seemingBenefits": {
      "Elemental": "As forças da natureza curvam-se aos caprichos da Torrente; ela pode realizar uma ação reflexiva para retrair os espinhos ou estendê-los novamente. Qualquer um que a toque quando ela os estende reflexivamente sofre dois pontos de dano letal.",
      "Fairest": "Apresentando-se como uma rosa e não como espinhos, o Unicórnio pode tornar os efeitos deste Contrato invisíveis mesmo para aqueles que conseguem ver através da Máscara."
    },
    "source": "Kith and Kin",
    "page": 55
  },
  "ctl-kith-kin:the-gouging-curse": {
    "dicePool": "Manipulação + Ocultismo + Fado vs. Compostura + Fado",
    "loophole": "O changeling faz um acordo com a vítima, permitindo-lhe especificar uma ação que ela não pode realizar. Se ele violar estes termos, ele deverá pagar imediatamente o custo de Glamour e sofrer um ponto de dano letal, ou o Contrato termina.",
    "seemingBenefits": {
      "Fairest": "A Mais Justa poderá especificar outra ação dentro dos mesmos parâmetros da proibida; a vítima pode realizar esta ação para acabar com a maldição mais cedo. Se o fizerem, sofrerão a Condição Persistente de Assombro em relação ao changeling, maravilhados com sua magnanimidade.",
      "Ogre": "Se a ação proibida pelo Terrível causar dano a um de seus aliados, a duração deste Contrato passa a ser uma história."
    },
    "source": "Kith and Kin",
    "page": 55
  },
  "ctl-kith-kin:embrace-of-nettles": {
    "dicePool": "Nenhum",
    "loophole": "O changeling deixa para trás um efeito pessoal significativo para o Hedge consumir enquanto invoca este Contrato. Ela nunca poderá recuperar pessoalmente o objeto: se ele retornar a ela por algum outro meio, ela acumula 2 pontos de Dívida Goblin.",
    "seemingBenefits": {
      "Darkling": "Quando o changeling adia, ele pode negar sucessos até seu nível de Manipulação ou metade de sua Fado.",
      "Fairest": "Quando o Unicórnio dobra, ele pode aplicar os sucessos adicionais ao próximo teste de Hedgespinning de um aliado dentro da cena, em vez de ao seu próprio."
    },
    "source": "Kith and Kin",
    "page": 56
  },
  "ctl-kith-kin:acanthas-fury": {
    "dicePool": "Presença + Sobrevivência + Fado vs. Vigor + Fado",
    "loophole": "O changeling segura em sua mão um recorte novo, com não mais de um dia de idade, de uma planta real do mesmo tipo da transformação que ela pretende infligir.",
    "seemingBenefits": {
      "Elemental": "O Liberto pode atingir vários personagens até seu Fado com uma única invocação deste Contrato. Lide com a progressão ou regressão de cada alvo separadamente, embora o changeling possa oferecer a mesma promessa a todos eles de uma vez.",
      "Wizened": "Sem pagar Glamour, o Mirrado pode selar ( Changeling, p. 210) a declaração de intenções do alvo quando ele aceitar a promessa. Aumentar a severidade do selo custa 1 Glamour em vez de 1 Força de Vontade."
    },
    "source": "Kith and Kin",
    "page": 56
  },
  "ctl-kith-kin:awaken-portal": {
    "dicePool": "Nenhum",
    "loophole": "Changeling leva pelo menos 15 minutos dentro da cena onde ela ativa o Contrato para limpar, reparar ou enfeitar a entrada e sua estrutura circundante antes de acordar o portal. Novo",
    "seemingBenefits": {
      "Beast": "O goblin do portal também se torna uma boca grande e cheia de dentes, capaz de estender reflexivamente suas muitas presas para morder intrusos antes de retraí-los posteriormente. Pode atacar qualquer pessoa que esteja passando. O ataque tem uma taxa de dano de 2L e usa uma reserva igual à Presença + Intimidação do changeling. Se o portal morder um alvo com sucesso, ele o cospe com força, empurrando-o para trás 5 jardas/metros. Se mais de um personagem tentar passar simultaneamente, o portal faz um ataque, aplicando todos os seus sucessos à Defesa de cada intruso separadamente.",
      "Elemental": "O goblin do portal possui uma influência adicional de dois pontos no elemento escolhido do Sprite."
    },
    "source": "Kith and Kin",
    "page": 57
  },
  "ctl-kith-kin:crown-of-thorns": {
    "dicePool": "Presença + Ocultismo + Fado vs. Perseverança + Fado",
    "loophole": "O changeling tece uma coroa de espinhos de videiras e galhos espinhosos e a coloca na cabeça do alvo na mesma cena.",
    "seemingBenefits": {
      "Beast": "A Besta envia pesadelos para atormentar o sono do alvo; eles perdem um ponto de Força de Vontade a cada noite em que permanecem dormindo e não podem recuperar Força de Vontade através do descanso até que a Condição resolva ou desapareça.",
      "Darkling": "Enquanto disfarçado ou despercebido, o Trevoso obtém um sucesso excepcional em três sucessos em testes para manipular o alvo para realizar a ação proibida."
    },
    "source": "Kith and Kin",
    "page": 58
  },
  "ctl-kith-kin:shrikes-larder": {
    "dicePool": "Nenhum",
    "loophole": "O changeling empala uma efígie representando o alvo em um espinho. Embora as amoreiras sejam tradicionais, qualquer pequeno objeto perfurante funciona, como arame farpado, agulhas de costura ou espinhos eretos de um porco-espinho vivo.",
    "seemingBenefits": {
      "Beast": "Os Coursers deram nome a este contrato quando imitaram pela primeira vez as técnicas de caça do picanço. Quando o changeling coleta Glamour da vítima durante a duração do Contrato, ele recupera 2 pontos de Glamour para cada sucesso que obtiver, em vez de 1.",
      "Wizened": "Em vez disso, o Chapeleiro pode mirar em um veículo, infligindo os efeitos escolhidos a qualquer um que o opere ou ande como passageiro e furando seus pneus, se houver."
    },
    "source": "Kith and Kin",
    "page": 58
  },
  "ctl-kith-kin:witchs-brambles": {
    "dicePool": "Nenhum",
    "loophole": "Changeling perfura sua própria carne com o objeto pontiagudo que ela usa ao invocar este Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta pode invocar este Contrato para aprimorar um ataque de mordida que causa dano letal ou agravado.",
      "Darkling": "Adicione um sucesso ao resultado de uma ação bem-sucedida quando o Trevoso decidir realizar apenas mudanças sutis, mas subtraia um sucesso quando ele decidir realizar uma ou mais mudanças de paradigma."
    },
    "source": "Kith and Kin",
    "page": 59
  },
  "ctl-kith-kin:coming-darkness": {
    "dicePool": "Nenhum",
    "loophole": "Changeling apaga uma chama ao invocar este Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta pode seletivamente conceder visão noturna clara sobre um número de personagens até metade de seu Fado (em volta) dentro da área quando ele invoca o Contrato.",
      "Darkling": "O Trevoso pode criar uma área de escuridão com um raio até seu Fado x 10 metros / metros."
    },
    "source": "Kith and Kin",
    "page": 59
  },
  "ctl-kith-kin:pomp-and-circumstance": {
    "dicePool": "Nenhum",
    "loophole": "O changeling espalha um anel ininterrupto de papoulas ao redor da área no início da mesma cena da invocação do Contrato.",
    "seemingBenefits": {
      "Beast": "A consciência do Grim sobre seu refúgio se estende além da fronteira marcada; ele pode detectar qualquer um que passe ou invada perto da área escondida a até (seu Fado x 20) jardas/metros de distância.",
      "Wizened": "O Chapeleiro pode aplicar quaisquer pontos que possua na Qualidade Lugar Seguro (se o local for no mundo mortal) ou na Qualidade Oca (se for na Sebe) ao local durante a reunião, mesmo que o espaço não esteja nem perto do local ao qual a Qualidade se aplica. Isso funciona mesmo que vários companheiros heterogêneos compartilhem a Qualidade em questão, mas o changeling deve ser um deles."
    },
    "source": "Kith and Kin",
    "page": 60
  },
  "ctl-kith-kin:shadow-puppet": {
    "dicePool": "Nenhum",
    "loophole": "O changeling realiza um show de marionetes de sombras para o entretenimento de um público de pelo menos três pessoas com duração de pelo menos cinco minutos na mesma cena.",
    "seemingBenefits": {
      "Beast": "Se a Besta der à marionete das sombras uma forma animal, ela também ganha +3 em testes baseados em percepção, a habilidade de voar ou um ataque desarmado com uma taxa de dano de +1L.",
      "Darkling": "A marionete das sombras do Trevoso também ganha a habilidade de gastar 1 de Glamour para desaparecer em uma sombra e sair de outra sombra que possa perceber como uma ação Instantânea; esta habilidade não funciona na escuridão total ou quando a iluminação não projeta sombras."
    },
    "source": "Kith and Kin",
    "page": 60
  },
  "ctl-kith-kin:dread-companion": {
    "dicePool": "Manipulação + Ocultismo + Fado vs. Resistência + Fado",
    "loophole": "Changeling fez com que o fantasma Hedge afirmasse seu próprio Thread dentro da mesma cena.",
    "seemingBenefits": {
      "Darkling": "Enquanto o Wisp estiver vinculado a um fantasma Hedge, ele ganha acesso ao Dematerialize Numen (Changeling, p. 250).",
      "Fairest": "A duração deste Contrato passa a ser “Até que o Unicórnio deixe a Cerca”."
    },
    "source": "Kith and Kin",
    "page": 61
  },
  "ctl-kith-kin:cracked-mirror": {
    "dicePool": "Manipulação + Furto + Fado vs. Vigor + Fado",
    "loophole": null,
    "seemingBenefits": {},
    "source": "Kith and Kin",
    "page": 61
  },
  "ctl-kith-kin:listen-with-the-winds-ears": {
    "dicePool": "Nenhum",
    "loophole": "Changeling apresentou-se pelo seu nome verdadeiro a alguém que nunca conheceu na mesma cena.",
    "seemingBenefits": {
      "Beast": "O Courser dobra sua velocidade para a cena após chegar ao local do locutor.",
      "Fairest": "A Belíssima pode arrastar aquele que falou seu nome para sua localização."
    },
    "source": "Kith and Kin",
    "page": 62
  },
  "ctl-kith-kin:momentary-respite": {
    "dicePool": "Vigor + Sobrevivência + Fado",
    "loophole": "O changeling se abraça ou se envolve em um item de conforto que representa descanso ou sono, como um cobertor, um travesseiro, uma ovelha viva ou um bichinho de pelúcia favorito.",
    "seemingBenefits": {
      "Elemental": "O Elemental adiciona a opção de ignorar os efeitos de uma Inclinação Ambiental que o afeta atualmente à lista de opções disponíveis; pode ser escolhido mais de uma vez.",
      "Ogre": "O Bruto pode invocar este Contrato para outro personagem consentido. Ele ainda paga todos os custos para invocar e prorrogar o Contrato e sofre as consequências de estendê-lo ele mesmo. Ele poderá ter apenas uma instância deste Contrato ativa por vez; se ele invocar novamente enquanto já estiver ativo em outra pessoa, a primeira instância termina imediatamente."
    },
    "source": "Kith and Kin",
    "page": 62
  },
  "ctl-kith-kin:steal-influence": {
    "dicePool": "Raciocínio + Furto + Fado vs Perseverança + Fado",
    "loophole": "O alvo causou pelo menos um ponto de dano letal ou agravado ao changeling na mesma cena.",
    "seemingBenefits": {
      "Darkling": "O Fogo-fátuo pode dividir o Glamour que gasta para invocar este Contrato em quantas Influências diferentes desejar.",
      "Elemental": "O Liberto pode transformar quantos pontos das Influências que ele rouba quiser em outro, tematicamente semelhante ao invocar o Contrato. Por exemplo, um Elemental que receba três pontos de Influência (água) pode transmutar qualquer número desses pontos em Influência (chuva), Influência (gelo) ou Influência (oceano). Se o changeling gastar Experiências para manter a Influência após o término do Contrato, todos os pontos transformados voltam ao seu tipo original. Novos Contratos"
    },
    "source": "Kith and Kin",
    "page": 63
  },
  "ctl-kith-kin:earths-gentle-movements": {
    "dicePool": "Força + Ofícios + Fado",
    "loophole": "O changeling coloca uma pedra debaixo da língua.",
    "seemingBenefits": {
      "Elemental": "O Elemental pode atingir uma área de até 2 metros por sucesso.",
      "Wizened": "O Mirrado pode ter como alvo uma área de pedra natural e sem forma. Ele pode transformá-lo em uma forma útil, como escadas, criar apoios para mãos e pés em uma parede de rocha íngreme ou criar uma escultura artística. A formação do Domovoi deve ser construtiva e não destrutiva. Mude o teste do Contrato para Destreza + Ofícios se ele invocar esta cláusula."
    },
    "source": "Kith and Kin",
    "page": 64
  },
  "ctl-kith-kin:earths-impenetrable-walls": {
    "dicePool": "Força + Ofícios + Fado",
    "loophole": "Changeling defendeu-se com sucesso de um ataque dentro da mesma cena.",
    "seemingBenefits": {
      "Fairest": "Se a Belíssima invocar este Contrato dentro da Cerca, a fortaleza também vem com uma Mérito de Cajado temporária (Changeling, p. 125) com uma pontuação de metade de sua Fado representando seguidores hobgoblins; seus tipos e habilidades devem fazer sentido no contexto de uma fortaleza, como soldados com armamento, batedores com furtividade ou médicos com medicina.",
      "Ogre": "Subtraia sucessos iguais à metade do Fado do Ogro de qualquer ação de Hedgespinning que outro personagem realize para realizar mudanças na fortaleza ou em qualquer parte de seu interior."
    },
    "source": "Kith and Kin",
    "page": 65
  },
  "ctl-oak-ash-thorn:donning-the-grand-mantle": {
    "dicePool": "Presença + Expressão + Manto",
    "loophole": "Nenhuma.",
    "seemingBenefits": {},
    "source": "Oak, Ash, and Thorn",
    "page": 23
  },
  "ctl-oak-ash-thorn:autonomous-payload": {
    "dicePool": "Manipulação + Computador + Manto vs. (Inteligência ou Computador) + Fortificação",
    "loophole": "Changeling veste um chapéu preto ou um chapéu branco e adere às implicações éticas do chapéu que ele usa para a duração do contrato. Se em algum momento ele os violar, ele deve pagar o custo Glamour, ou o Contrato termina imediatamente.",
    "seemingBenefits": {},
    "source": "Oak, Ash, and Thorn",
    "page": 25
  },
  "ctl-oak-ash-thorn:the-widening-gyre": {
    "dicePool": "Presença + Atletismo + Manto vs. Vigor + Fado",
    "loophole": "Changeling faz um autêntico chapéu de marinheiro, como um tricórnio ou dixie cop, ao invocar este Contrato.",
    "seemingBenefits": {},
    "source": "Oak, Ash, and Thorn",
    "page": 28
  },
  "ctl-oak-ash-thorn:principle": {
    "dicePool": "Presença + Política + Manto vs. Perseverança + Fado",
    "loophole": null,
    "seemingBenefits": {},
    "source": "Oak, Ash, and Thorn",
    "page": 30
  },
  "ctl-dark-eras:peacemakers-draw": {
    "missing": "heading",
    "seemingBenefits": {}
  },
  "h-beyond-hedge:crown-envoys-splendid-defense": {
    "dicePool": "Presença + Expressão + Manto",
    "loophole": "O Contrato é invocado em uma reunião formal de pelo menos uma dúzia de outros participantes.",
    "seemingBenefits": {
      "Beast": "A proteção da Besta também se estende a todos os animais normais, e os bônus sociais concedidos pelo Contrato aplicam-se tanto aos animais quanto aos humanos.",
      "Darkling": "O Trevoso ganha +2 de Defesa durante o Contrato.",
      "Elemental": "Elementais ganham imunidade a danos de seu elemento específico (ou do elemento análogo mais próximo) durante a vigência do Contrato.",
      "Fairest": "A Belíssima não pode sofrer uma Falha Dramática, tratando qualquer falha como uma Falha normal.",
      "Ogre": "O Ogro ganha 1/1 de Armadura durante o Contrato.",
      "Wizened": "O Mirrado não sofre penalidade de Defesa devido ao número de atacantes ou perigos contra os quais ele se defende em um turno."
    },
    "source": "Beyond the Hedge",
    "page": 125
  },
  "h-beyond-hedge:sweet-nothings": {
    "dicePool": "Presença + Persuasão + Fado - Compostura",
    "loophole": "Changeling sussurra um segredo próprio no ouvido de seu alvo adormecido, onde ele se aloja dentro de seus sonhos e pode potencialmente ser descoberto usando oneiromancy.",
    "seemingBenefits": {
      "Beast": "A Besta pode adicionar as seguintes Condições: Bonded ou Easy Prey.",
      "Darkling": "O Trevoso pode adicionar as seguintes Condições: Informado ou Assustado.",
      "Elemental": "O Elemental pode adicionar as seguintes Condições: Estóico ou Tenso.",
      "Fairest": "A Belíssima pode adicionar as seguintes Condições: Inspirado ou Desmaiado",
      "Ogre": "O Ogro pode adicionar as seguintes Condições: Imprudente ou Constante.",
      "Wizened": "O Mirrado pode adicionar as seguintes Condições: Cativado ou Volátil."
    },
    "source": "Beyond the Hedge",
    "page": 126
  },
  "h-beyond-hedge:the-perfect-talent": {
    "dicePool": "Raciocínio + <Habilidade> + Fado",
    "loophole": "O changeling faz uma mímica de uma ação cuja habilidade ele está tentando aumentar.",
    "seemingBenefits": {
      "Beast": "Os sentidos aguçados do Selvagem também concedem +1 de Investigação.",
      "Darkling": "A natureza clandestina do Lurker também confere +1 de Furtividade.",
      "Elemental": "A ferocidade do Torrent também confere +1 de Briga.",
      "Fairest": "O charme e a graça naturais da Belíssima também concedem +1 de Persuasão.",
      "Ogre": "A tenacidade do Bruto também confere +1 de Sobrevivência.",
      "Wizened": "As habilidades naturais do Tinker também conferem +1 de Ofícios."
    },
    "source": "Beyond the Hedge",
    "page": 127
  },
  "h-beyond-hedge:babels-tower": {
    "dicePool": "Nenhum",
    "loophole": "O personagem fala uma frase curta na lingua do Pê ou outra \"linguagem\" sem sentido, pedindo para poder entender o que está prestes a fazer.",
    "seemingBenefits": {
      "Beast": "Durante a vigência do Contrato, a Besta pode compreender qualquer animal com quem ela se comunica e eles podem entendê-la.",
      "Darkling": "Durante a vigência do Contrato, o Trevoso pode falar com as sombras de pessoas e coisas. As sombras são quietas e observadoras, testemunhando muitas coisas que a maioria das pessoas desconhece.",
      "Elemental": "Durante a vigência do Contrato, o Elemental pode falar com qualquer “elemento” em seu “idioma” nativo. Os elementos tendem a ter personalidades que correspondem às suas naturezas; Perdidos usando este contrato foram avisados.",
      "Fairest": "A Belíssima ganha um bônus de +3 em todos os testes de Expressão feitos enquanto o Contrato estiver em vigor; ser fluente em vários idiomas aumenta sua eloquência.",
      "Ogre": "O Ogro ganha um bônus de +3 em todas as jogadas de Intimidação enquanto o Contrato estiver em vigor; ser fluente em palavrões e ameaças em vários idiomas pode ser uma vantagem.",
      "Wizened": "Durante a vigência do Contrato, o Funileiro pode compreender qualquer linguagem de máquina ou código de programação e pode “falar” com computadores e outros dispositivos e receber informações."
    },
    "source": "Beyond the Hedge",
    "page": 128
  },
  "h-beyond-hedge:turings-enigma": {
    "dicePool": "Nenhum ou conflito de vontades",
    "loophole": "Changeling deve escrever uma palavra para frente e para trás, em seguida, esconder o item em que ela escreveu a palavra como ela invoca o Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta pode aplicar o Contrato em tentativas de rastreamento, lendo os sinais e rastros da passagem de animais e outras criaturas em uma área; ele detecta automaticamente todas as tentativas mundanas de esconder uma trilha (como varrer trilhas ou atravessar um riacho). A ocultação mágica inicia o teste de Confronto de Vontades, acima.",
      "Darkling": "Os Enfeitiçados ganham +3 dados no teste de Confronto de Vontades ao decifrar qualquer mensagem magicamente codificada, seja essa cifra feita usando este Contrato ou alguma outra magia.",
      "Elemental": "Os Torrents podem usar este Contrato para codificar mensagens nos próprios elementos; uma brisa murmura uma mensagem secreta ao destinatário pretendido, ou os estalos e crepitações de um fogo transmitem uma mensagem a todos aqueles que estão ao redor de seu incêndio.",
      "Fairest": "A Belíssima recebe +3 dados no teste de Confronto de Vontades quando alguém tenta decodificar sua mensagem oculta.",
      "Ogre": "Os Bruisers criam cifras tão robustas que exigem dois testes de Confronto de Vontades para decodificar; se falhar, a tentativa falha.",
      "Wizened": "Os Tinkers podem aplicar este Contrato ao código de máquina e a qualquer linguagem de computador para determinar o que um programa específico faz apenas olhando um trecho de código ou disco contendo o programa."
    },
    "source": "Beyond the Hedge",
    "page": 128
  },
  "h-beyond-hedge:bar-the-door": {
    "dicePool": "Nenhum",
    "loophole": "O changeling carrega uma chave de qualquer tipo e imita o ato de trancar uma fechadura com ela.",
    "seemingBenefits": {
      "Beast": "A Besta pode usar este Contrato em qualquer tipo de covil, como entrada de caverna, toca ou até mesmo Portão de Cerca. Neste caso, objetos naturais como pedras, arbustos, arbustos, galhos de árvores e coisas semelhantes barram a entrada com a mesma segurança que uma “porta” real.",
      "Darkling": "Se o Trevoso tiver sucesso em um teste de Destreza + Furtividade e não for observado, ele pode obscurecer o portal, exigindo essencialmente dois testes de Confronto de Vontades; um para localizá-lo e um segundo para abri-lo.",
      "Elemental": "Aqueles que conseguem superar o bloqueio e vencer o Confronto de Vontades sofrem um número de pontos de dano contundente igual ao Manto do Elemental por seu problema.",
      "Fairest": "Se o portal não tiver nenhum tipo de bloqueio, a Belíssima recebe +3 dados no teste de Confronto de Vontades.",
      "Ogre": "O Ogro adiciona sua classificação de Manto à Durabilidade do fechamento para tentativas de resistir a danos ou destruição.",
      "Wizened": "Se o portal tiver algum tipo de fechadura, o Funileiro recebe +3 dados no teste de Confronto de Vontades."
    },
    "source": "Beyond the Hedge",
    "page": 130
  },
  "h-beyond-hedge:foul-is-fair": {
    "dicePool": "Manipulação + Subterfúgio + Manto vs. Manipulação + Fado (Confronto de Vontades)",
    "loophole": "O changeling faz algum tipo de movimento físico e som apropriado, como mandar um beijo com um muah! ou jogar uma bola em direção ao alvo pretendido enquanto grita \"Aqui, pegue!\".",
    "seemingBenefits": {
      "Beast": "Para ganhar um ponto adicional de Glamour, o Melhor pode adicionar a Condição Agorafóbica ao seu alvo.",
      "Darkling": "Para obter um ponto adicional de Glamour, o Trevoso pode adicionar a Condição Assustado ao seu alvo.",
      "Elemental": "Para obter um ponto adicional de Glamour, o Elemental pode adicionar a Condição Imprudente ao seu alvo.",
      "Fairest": "Para ganhar um ponto adicional de Glamour, a Bela pode adicionar a Condição de Culpa ao seu alvo.",
      "Ogre": "Para ganhar um ponto adicional de Glamour, o Ogro pode adicionar a Condição Acovardado ao seu alvo.",
      "Wizened": "Para ganhar um ponto adicional de Glamour, o Mirrado pode adicionar a Condição Retraído ao seu alvo."
    },
    "source": "Beyond the Hedge",
    "page": 130
  },
  "h-beyond-hedge:whisperward": {
    "dicePool": "Nenhum",
    "loophole": "Changeling deve sussurrar a todos os presentes para serem cobertos pela enfermaria no momento em que é invocado.",
    "seemingBenefits": {
      "Beast": "Os sentidos aguçados da Besta podem localizar todo e qualquer dispositivo de escuta/espionagem nas imediações, bem como dizer quando os sentidos de alguém foram cooptados por outro. Aqueles obscurecidos pela magia provocam um Confronto de Vontades para localizar, ao qual a Besta adiciona +2.",
      "Darkling": "A proteção Trevoso também afeta a visão, cobrindo a área com mudanças, ocultando sombras para que os observadores não possam ver ou ouvir quem está presente ou o que estão discutindo.",
      "Elemental": "A Torrente pode enviar feedback mágico para aqueles que tentam vidência misticamente sobre ela e seus companheiros, causando um ponto de dano letal ao conjurador ofensor e provocando um Confronto de Vontades para encerrar o feitiço ofensor.",
      "Fairest": "A Belíssima ganha +3 dados em qualquer disputa de Conflito de Vontades para perfurar sua proteção.",
      "Ogre": "O poder do Bruto faz com que aqueles que falham no Confronto de Vontades sofram imediatamente a Inclinação Insensata devido à reação mágica.",
      "Wizened": "O Chapeleiro pode devolver os dispositivos eletrônicos de escuta aos seus proprietários, ouvindo qualquer coisa falada pela(s) pessoa(s) que plantou(m) os dispositivos."
    },
    "source": "Beyond the Hedge",
    "page": 131
  },
  "h-beyond-hedge:waylaid-traveler": {
    "dicePool": "Manipulação + Subterfúgio + Manto – Compostura",
    "loophole": "Changeling corre em círculos cantando uma rima boba, como \"Ho ho, hee hee, você não pode me pegar!\" ou \"Corra, corra, rápido o quanto puder! Você não pode me pegar, eu sou o Homem Gingerbread!\"",
    "seemingBenefits": {
      "Beast": "Os efeitos do Contrato se aplicam a todo e qualquer animal, mundano ou besta-sebe, que tente rastrear ou esteja sendo usado para rastrear o personagem.",
      "Darkling": "Os registros em papel do personagem, desde contratos de aluguel até recibos de cartão de crédito, são perdidos durante a vigência do Contrato, impedindo que alguém localize tais informações sobre o personagem durante a vigência do Contrato.",
      "Elemental": "Ao viajar por qualquer cenário natural, como uma floresta, deserto ou até mesmo um parque, o Elemental ganha +3 dados para ativar este Contrato, pois os elementos naturais ajudam a cobrir seus rastros e obscurecer seu rastro.",
      "Fairest": "Qualquer pessoa que a Belíssima conheça não conseguirá se lembrar de quaisquer detalhes sobre ela durante a vigência do Contrato, impedindo que os perseguidores obtenham qualquer informação de amigos, familiares e conhecidos.",
      "Ogre": "Ao viajar por qualquer ambiente urbano, o Ogro ganha +3 dados para ativar este Contrato, pois os recursos feitos pelo homem, incluindo lixo e entulhos de construção, ajudam a cobrir seus rastros e obscurecer seu rastro.",
      "Wizened": "Os efeitos do Contrato também se aplicam aos meios eletrônicos de rastreamento, vigilância e observação, incluindo câmeras, detectores de movimento e até caixas eletrônicos."
    },
    "source": "Beyond the Hedge",
    "page": 132
  },
  "h-beyond-hedge:wildwalking": {
    "dicePool": "Nenhum",
    "loophole": "O personagem pega uma lâmina de grama, pedaço de palha, galho ou material semelhante e mastiga-a enquanto ela invoca o Contrato.",
    "seemingBenefits": {
      "Beast": "A Besta ganha a cooperação de qualquer animal próximo que possa lhe fornecer informações sobre outros perigos potenciais ou sobre os movimentos de seus inimigos.",
      "Darkling": "O Trevoso ganha +3 dados em todos os testes de Furtividade e pode tentar um teste de Furtividade mesmo se estiver sendo observado; sucesso significa que o observador perde o controle do changeling.",
      "Elemental": "O Elemental aplica metade de seu Fado (arredondado para baixo) como penalidade a qualquer um que tente segui-lo ou rastreá-lo.",
      "Fairest": "A Belíssima arredonda seu valor de Fado ao determinar o número de penalidades a serem ignoradas.",
      "Ogre": "O Bruto ganha 1/1 de Armadura contra todas as armas naturais, incluindo garras e dentes de animais, porretes de madeira e pedra, etc. (mas não contra armas feitas pelo homem ou modificadas, como espadas ou balas).",
      "Wizened": "O Mirrado pode gastar 2 pontos adicionais de Glamour para aplicar os efeitos deste Contrato a um veículo não maior que um pequeno sedã de quatro portas (e, portanto, a todos dentro dele)."
    },
    "source": "Beyond the Hedge",
    "page": 133
  },
  "h-beyond-hedge:smoke-stepping": {
    "dicePool": "Nenhum",
    "loophole": "Changeling caminha através de uma fonte de fumaça, nevoeiro ou névoa como aquela de um cigarro, máquina de nevoeiro ou o spray de uma cachoeira, no máximo 10 minutos antes de ativar o contrato.",
    "seemingBenefits": {
      "Beast": "Os sentidos aguçados da Besta permitem que ele detecte qualquer pessoa em um raio de (Fado x 10) metros, apesar da fumaça obscurecedora, para que ele permaneça ciente de todos os inimigos e aliados.",
      "Darkling": "O Trevoso adiciona automaticamente o elemento de sombra a este Contrato e dobra a distância que ele pode se teletransportar através das sombras apenas para (Fado x 10) metros.",
      "Elemental": "O Torrent ganha automaticamente um segundo elemento de sua escolha para usar com este Contrato. Se o elemento escolhido estiver relacionado à sua aparência, ele dobra a distância que pode se teletransportar através daquele elemento apenas para (Fado x 10) metros.",
      "Fairest": "A Belíssima pode gastar 1 ponto de Glamour e tocar um oponente para transportá-lo através da fumaça até (Fado x 10) metros. O alvo pode fazer um Confronto de Vontades com a Belíssima adicionando +3 à sua parada de dados para evitar o efeito.",
      "Ogre": "O Bruto pode carregar uma pessoa adicional com ele pelo custo de 1 Glamour adicional ao usar este Contrato.",
      "Wizened": "O Domovoi poderá, ao custo de 2 Glamour adicionais, aplicar os efeitos deste Contrato a um veículo não maior que um sedã médio de quatro portas (e, consequentemente, a todos aqueles dentro do veículo)."
    },
    "source": "Beyond the Hedge",
    "page": 134
  },
  "h-beyond-hedge:doorway-to-desire": {
    "dicePool": "Nenhum",
    "loophole": "O changeling derramou algumas gotas de sangue em algum momento no passado, no local para onde deseja viajar.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 135
  },
  "h-beyond-hedge:faerie-feast": {
    "dicePool": "Manipulação + Empatia + Manto vs. Compostura + Fado",
    "loophole": "A personagem come ou bebe o mesmo alimento ou bebida que deseja encantar antes de invocar o Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 135
  },
  "h-beyond-hedge:in-vino-veritas": {
    "dicePool": "Presença + Persuasão + Manto vs. Vigor + Compostura",
    "loophole": "O personagem toma uma dose ou outro gole de álcool enquanto invoca o Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 136
  },
  "h-beyond-hedge:memory-of-stone": {
    "dicePool": "Nenhum",
    "loophole": "The Lost sussurra um segredo para uma pequena pedra e depois a joga atrás dela enquanto invoca o Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 136
  },
  "h-beyond-hedge:memory-of-trees": {
    "dicePool": "Nenhum",
    "loophole": "Changeling ou membro de sua família mortal (vivo ou morto) plantou a árvore em questão.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 136
  },
  "h-beyond-hedge:merry-meet": {
    "dicePool": "Presença + Socialização + Manto vs. Perseverança + Compostura",
    "loophole": "Changeling oferece algo à pessoa que ela está tentando impressionar, seja um cartão de visita ou uma bebida. A outra parte não precisa aceitar a oferta para cumprir a lacuna.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 137
  },
  "h-beyond-hedge:mantle-of-terrible-beauty": {
    "dicePool": "Presença + Intimidação + Manto vs. Compostura + Fado",
    "loophole": "O personagem está lutando um duelo ou outro combate que foi acordado com antecedência; não precisa ser uma luta individual.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 138
  },
  "h-beyond-hedge:sunflash": {
    "dicePool": "Nenhum",
    "loophole": "O changeling joga uma moeda de ouro de qualquer tipo no ar imediatamente antes de invocar este Contrato; a moeda não precisa ser feita de ouro verdadeiro.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 139
  },
  "h-beyond-hedge:my-anger-is-my-armor": {
    "dicePool": "Nenhum",
    "loophole": "O personagem se enfurece em alto e bom som, desafiando um oponente a lutar contra ele na frente de todos os presentes.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 139
  },
  "h-beyond-hedge:solstice-revelations": {
    "dicePool": "Presença + Ocultismo + Manto",
    "loophole": "O personagem está usando o poder dentro do horário preferido de sua Corte. Outono",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 140
  },
  "h-beyond-hedge:babels-curse": {
    "dicePool": "Inteligência + Expressão + Manto – Perseverança",
    "loophole": "Changeling escreve o nome do alvo ou apelido comumente usado em um pedaço de papel e rasga-lo em pequenos pedaços enquanto ela invoca o contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 140
  },
  "h-beyond-hedge:dead-mens-tales": {
    "dicePool": "Presença + Ocultismo + Fado",
    "loophole": "O changeling queima a pena de um corvo ou corvo e sopra a fumaça sobre o cadáver para ser questionado.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 141
  },
  "h-beyond-hedge:ghostly-presence": {
    "dicePool": "Nenhum",
    "loophole": "O changeling limpa um pouco de cinza nas pálpebras antes de ativar o contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 141
  },
  "h-beyond-hedge:persephones-doorway": {
    "dicePool": "Manipulação + Ocultismo + Manto",
    "loophole": "O changeling desenha o contorno aproximado de uma porta, completa com maçaneta, em uma parede com giz, segura a maçaneta e “abre” a porta enquanto invoca o Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 141
  },
  "h-beyond-hedge:banshees-wail": {
    "dicePool": "Presença + Intimidação + Manto vs. Compostura + Fado",
    "loophole": "Changeling tem pelo menos um pedaço de uma mortalha ou outra roupa que foi usada por um indivíduo falecido.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 142
  },
  "h-beyond-hedge:bauble-of-the-mind": {
    "dicePool": "Manipulação + Ocultismo + Manto vs. Perseverança + Compostura",
    "loophole": "A mudança tem uma corda amarrada em torno de pelo menos um dedo para lembrá-los de algo (o que quer que seja).",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 143
  },
  "h-beyond-hedge:elfshot": {
    "dicePool": "Destreza + Ocultismo + Manto",
    "loophole": "Changeling carrega um pequeno símbolo de algum tipo de bronze.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 143
  },
  "h-beyond-hedge:haunted-house": {
    "dicePool": "Nenhum (veja abaixo)",
    "loophole": "O changeling persuadiu um ou mais fantasmas reais (incluindo fantasmas Hedge) a entrar no local antes de invocar este Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 144
  },
  "h-beyond-hedge:wake-the-dead": {
    "dicePool": "Manipulação + Ocultismo + Manto",
    "loophole": "A luz de uma lua encerante toca o cadáver para ser animado; seja através da janela de um necrotério ou ao ar livre em um cemitério.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 144
  },
  "h-beyond-hedge:whispers-in-the-dark": {
    "dicePool": "Raciocínio + Ocultismo + Manto",
    "loophole": "O changeling executa este Contrato em seus aposentos privados, sozinho e em completa escuridão.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 146
  },
  "h-beyond-hedge:withering-glare": {
    "dicePool": "Presença + Intimidação + Manto vs. Vigor + Fado",
    "loophole": "O Perdido torce um pano, amassa um pedaço de papel, ou ação semelhante como ela invoca este Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 146
  },
  "h-beyond-hedge:mindveil": {
    "dicePool": "Nenhum",
    "loophole": "O personagem ouve “ruído branco” antes de invocar o Contrato; isso pode incluir desde fones de ouvido sintonizados para estática, uma televisão ou até mesmo uma grande concha colocada no ouvido para \"ouvir o oceano\".",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 147
  },
  "h-beyond-hedge:veil-of-tears": {
    "dicePool": "Manipulação + Empatia + Manto vs. Compostura + Fado",
    "loophole": "O changeling derrama pelo menos uma lágrima na mesma cena antes de ativar o Contrato.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 147
  },
  "h-beyond-hedge:curse-of-fading": {
    "dicePool": "Manipulação + Intimidação + Manto vs. Perseverança + Compostura",
    "loophole": "A vítima já viu um fantasma antes, seja através do fantasma usando sua própria Numina para se manifestar, uma aplicação do Contrato de Presença Fantasmagórica sendo aplicado à vítima ou poderes semelhantes antes da Maldição do Desvanecimento ser decretada.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 147
  },
  "h-beyond-hedge:my-sorrow-is-my-armor": {
    "dicePool": "Nenhum",
    "loophole": "O personagem se enfurece em alto e bom som, desafiando um oponente a lutar contra ele na frente de todos os presentes.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 148
  },
  "h-beyond-hedge:soul-rime": {
    "dicePool": "Manipulação + Persuasão + Manto vs. Compostura + Fado",
    "loophole": "Changeling detém o coração de um animal, congelado através de meios naturais ou não, e pronuncia o nome do alvo e sua intenção sobre ele.",
    "seemingBenefits": {},
    "source": "Beyond the Hedge",
    "page": 148
  },
  "h-courts:celestial-summons": {
    "dicePool": "Presença + Persuasão + Fado vs. Compostura + Fado",
    "loophole": "O changeling tem algum tipo de autoridade sobre a vítima.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 105
  },
  "h-courts:climate-change": {
    "dicePool": "Perseverança + Sobrevivência + Manto",
    "loophole": "A área foi afetada pela condição ambiental real no último mês.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 105
  },
  "h-courts:celestial-might": {
    "missing": "heading",
    "seemingBenefits": {}
  },
  "h-courts:celestial-shield": {
    "dicePool": "Nenhum",
    "loophole": "O changeling usa o escudo para proteger outra pessoa sob seus cuidados ou autoridade.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 106
  },
  "h-courts:vigil-of-silver-and-gold": {
    "dicePool": "Presença + Expressão + Fado",
    "loophole": "Changeling possui um terreno ou edifício dentro da área afetada.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 106
  },
  "h-courts:family-friendly-feud": {
    "dicePool": "Nenhum",
    "loophole": "O changeling não usou nenhum palavrão no último dia.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 108
  },
  "h-courts:frozen-in-time": {
    "dicePool": "Manipulação + Ocultismo + Manto vs. Perseverança + Fado",
    "loophole": "Há um relógio analógico visível nas proximidades do changeling.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 108
  },
  "h-courts:hearths-respite": {
    "dicePool": "Compostura + Empatia + Manto",
    "loophole": "Uma imagem visível da família mortal do metamorfo está numa parede próxima.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 108
  },
  "h-courts:protection-of-the-innocent": {
    "dicePool": "Perseverança + Medicina + Manto",
    "loophole": "O contrato nunca foi usado no mortal antes.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 109
  },
  "h-courts:shared-remembrance": {
    "dicePool": "Raciocínio + Empatia + Manto vs Perseverança + Fado",
    "loophole": "O changeling diz ao alvo uma das suas memórias importantes.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 108
  },
  "h-courts:nothing-to-see-here": {
    "dicePool": "Nenhum",
    "loophole": "O changeling passou pelo menos duas horas consecutivas acordado usando uma venda nos olhos ou cego desde o último nascer do sol.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 110
  },
  "h-courts:rain-of-terror": {
    "dicePool": "Inteligência + Ocultismo + Manto vs. Compostura + Fado (contestado separadamente por cada vítima)",
    "loophole": "O changeling simula o clima que ele está tentando conjurar espalhando amostras dele do ponto mais alto da área a ser afetada.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 111
  },
  "h-courts:storm-of-the-century": {
    "dicePool": "Presença + Sobrevivência + Manto",
    "loophole": "O changeling crava um raio em sua carne, sofrendo um ponto de dano letal.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 111
  },
  "h-courts:tempestuous-hearts": {
    "dicePool": "Nenhum",
    "loophole": "O changeling abandona toda pretensão de controle, incitando o Bedlam sem focar em uma única emoção ao invocar o Contrato, intensificando as emoções atuais de cada indivíduo.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 112
  },
  "h-courts:thunder-steed": {
    "dicePool": "Nenhum",
    "loophole": "Changeling passou uma hora exposto a uma tempestade natural desde que o sol atravessou o horizonte.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 112
  },
  "h-courts:aether-crossing": {
    "dicePool": "Nenhum",
    "loophole": "Changeling carrega um pedaço de cada elemento em sua pessoa, como um isqueiro iluminado, um ventilador correndo, uma jarra de sujeira e uma garrafa de água cheia.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 114
  },
  "h-courts:age-of-aquarius": {
    "dicePool": "Manipulação + Socialização + Manto vs. Perseverança + Fado",
    "loophole": "O sujeito expressou ao metamorfo um desejo de mudança de ritmo ou alguma outra insatisfação com sua vida atual na mesma cena.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 115
  },
  "h-courts:assuming-the-stellar-mantle": {
    "dicePool": "Manipulação + Persuasão + Manto vs. Compostura + Fado",
    "loophole": "Estamos no mês do signo do alvo",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 114
  },
  "h-courts:elemental-cycle": {
    "dicePool": "Nenhum",
    "loophole": "O changeling pretende transformar a área afetada no próximo elemento do ciclo – fogo em terra, terra em ar, ar em água ou água em fogo.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 116
  },
  "h-courts:restringing-the-loom": {
    "dicePool": "Nenhum",
    "loophole": "Changeling usa este Contrato sobre um destino imposto por si mesma ou por um membro de sua motley.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 116
  },
  "h-courts:all-roads-closed": {
    "dicePool": "Inteligência + Manha + Manto",
    "loophole": "Changeling caminha 800 passos em uma das direções cardeais longe do local que deseja defender.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 133
  },
  "h-courts:cast-out": {
    "dicePool": "Presença + Ocultismo + Manto vs. Vigor + Fado",
    "loophole": "O changeling força dois ímãs repelentes que não se tocaram antes.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 134
  },
  "h-courts:create-path": {
    "dicePool": "Presença + Sobrevivência + Manto",
    "loophole": "O changeling possui um de seus Ícones, um que ele recuperou pessoalmente dos Espinhos nas últimas 24 horas.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 134
  },
  "h-courts:escape-route": {
    "dicePool": "Nenhum",
    "loophole": "O changeling cria algum tipo de nuvem. Granadas de fumaça funcionam para os bem equipados, mas até mesmo abrir um saco de farinha serve.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 134
  },
  "h-courts:labyrinth": {
    "dicePool": "Manipulação + Subterfúgio + Manto vs. Perseverança + Fado",
    "loophole": "Changeling carrega um quebra-cabeça completo de algum tipo (por exemplo, um cubo de Rubik) que ela retorna ao seu estado pré-resolvido.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 135
  },
  "h-courts:harmony-enforced": {
    "dicePool": "Presença + Empatia + Manto vs. Maior Perseverança + Fado",
    "loophole": "O changeling espalha penas de pomba ao redor da área que deseja afetar.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 137
  },
  "h-courts:one-with-the-elements": {
    "dicePool": "Nenhum",
    "loophole": "O changeling autoinflige um ponto de dano contundente com algo relacionado ao Inclinação em questão.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 137
  },
  "h-courts:shifting-balance": {
    "dicePool": "Nenhum",
    "loophole": "O changeling equilibra uma balança com exemplos simbólicos de cada uma das cinco fases tradicionais (madeira, fogo, terra, metal e água).",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 138
  },
  "h-courts:steal-harmony": {
    "dicePool": "Presença + Empatia + Manto – Compostura",
    "loophole": "Changeling roubou algo da vítima nas últimas 24 horas. Isto não precisa ser um item físico. Roubar um dever cobiçado no freehold, o respeito de um ancião, ou até mesmo o afeto de um ente querido, é suficiente para desencadear esta brecha.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 138
  },
  "h-courts:weaponize-mob": {
    "missing": "heading",
    "seemingBenefits": {}
  },
  "h-courts:davy-jones-locker": {
    "dicePool": "Presença + Sobrevivência + Manto",
    "loophole": "Changeling assobia de memória uma favela marinha inteira.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 141
  },
  "h-courts:dredge-the-depths": {
    "dicePool": "Raciocínio + Investigação + Manto",
    "loophole": "O changeling deixa cair algo valioso no mar como uma oferenda dentro da mesma cena.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 142
  },
  "h-courts:gone-by-the-board": {
    "dicePool": "Nenhum",
    "loophole": "Changeling invoca este Contrato durante a mesma maré que o item foi perdido.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 142
  },
  "h-courts:red-sky-at-morning": {
    "missing": "heading",
    "seemingBenefits": {}
  },
  "h-courts:red-sky-at-night": {
    "dicePool": "Nenhum",
    "loophole": "Changeling oferece bebidas ou alimentos feitos por suas próprias mãos para que todos compartilhem.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 143
  },
  "h-courts:always-solvent": {
    "dicePool": "Nenhum",
    "loophole": "O changeling carrega uma variedade de moedas de pelo menos cinco países diferentes.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 146
  },
  "h-courts:cook-the-books": {
    "dicePool": "Nenhum",
    "loophole": "O changeling admite ter traído ou enganado alguém de quem se aproveitou na mesma cena.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 146
  },
  "h-courts:if-two-are-dead": {
    "dicePool": "Presença + Intimidação + Manto vs. Compostura + Fado",
    "loophole": "O changeling compartilha um segredo diferente, mas significativo, com aqueles a quem deseja infligir este Contrato.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 146
  },
  "h-courts:raise-the-band": {
    "dicePool": "Nenhum",
    "loophole": "Changeling monta os hobgoblins de antemão sem magia e dá um discurso emocionante, reunindo-os em defesa do freehold.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 147
  },
  "h-courts:supply-and-demand": {
    "dicePool": "Presença + Intimidação + Manto vs. Perseverança + Fado",
    "loophole": "Changeling está algures onde não devia estar, e o comerciante sabe disso.",
    "seemingBenefits": {},
    "source": "Book of Courts",
    "page": 147
  },
  "h-seemings:carrion-feast": {
    "dicePool": "Nenhum",
    "loophole": "A refeição é humana.",
    "seemingBenefits": {
      "Beast": "Se a refeição for uma que a própria Besta matou, ela conta como dois níveis de Tamanho maiores para todos os efeitos deste Contrato, salvo o requisito.",
      "Darkling": "Se a criatura banqueteada for sobrenatural de alguma forma, o banquete do Trevoso cura um ponto adicional de dano.",
      "Elemental": "Se o Elemental infundir a refeição com o elemento escolhido, ele curará um ponto adicional de dano, mas isso pode comprometer a refeição de outros.",
      "Fairest": "A Belíssima pode optar por restaurar a Força de Vontade de todos os participantes em vez de curar os danos.",
      "Ogre": "O Ogro requer apenas cinco minutos para consumir sua refeição e obter os benefícios, embora os hóspedes que não sejam Bruiser tenham que demorar mais.",
      "Wizened": "A frugal Mirrado não precisa pagar nenhum Glamour adicional por participantes adicionais até que ela adicione um terceiro."
    },
    "source": "Book of Seemings",
    "page": 139
  },
  "h-seemings:no-escape": {
    "dicePool": "Vigor + Atletismo + Fado vs. Vigor + Fado (role para resistir separadamente para cada vítima)",
    "loophole": "O changeling deve morder e engolir um pedaço de sua própria carne, infligindo um ponto de dano letal a si mesmo. O Narrador pode pedir um teste de Perseverança + Compostura e/ou Lucidez para prosseguir com esse ato horrível de automutilação.",
    "seemingBenefits": {
      "Beast": "Se a Besta consumir uma criatura de Tamanho 2 ou maior com seu vórtice, ela recupera um ponto de Força de Vontade gasta.",
      "Darkling": "O vórtice do Trevoso também afeta seres efêmeros, danificando suas características Corpus. Se tal ser fosse “morto”, ele se desincorporaria.",
      "Elemental": "O Elemental conta a Durabilidade dos objetos capturados na área como um a menos.",
      "Fairest": "A Belíssima pode escolher drenar a vontade daqueles que foram pegos no vórtice em vez de drenar sua carne. As vítimas perdem 1 ponto de Força de Vontade por diferença de sucessos. Se o changeling escolher este efeito, os objetos no vórtice permanecerão ilesos. Ogros: O Ogro pode devorar objetos de até seu tamanho mais um.",
      "Wizened": "Se um Chapeleiro causar dano a qualquer vítima que possua Glamour com seu vórtice, ele drenará um ponto de Glamour dela e o adicionará à sua própria reserva (o Glamour acima do seu máximo será perdido)."
    },
    "source": "Book of Seemings",
    "page": 140
  },
  "h-seemings:starvations-savagery": {
    "dicePool": "Presença + Intimidação + Fado vs. Compostura + Fado",
    "loophole": "Na mesma cena, a vítima do Contrato queixou-se anteriormente de estar com fome.",
    "seemingBenefits": {
      "Beast": "Aqueles sob os efeitos do Contrato da Besta ganham a qualidade 9 de novo em todos os ataques desarmados.",
      "Darkling": "Vítimas do Contrato do Trevoso atacam com astúcia, ganhando +2 em Iniciativa e Velocidade.",
      "Elemental": "As vítimas do Contrato do Elemental tornam-se difíceis de subjugar, ganhando um ponto de armadura geral.",
      "Fairest": "A Musa pode direcionar a fome de sua vítima para uma pessoa específica, em vez de atacar aleatoriamente.",
      "Wizened": "Vítimas do Contrato do Mirrado ganham +1 em Armamento em vez de Briga.",
      "Ogre": "Humanos e changelings sob o efeito do Contrato do Ogro ganham +0 de ataque de mordida letal."
    },
    "source": "Book of Seemings",
    "page": 140
  },
  "h-seemings:swallow-whole": {
    "dicePool": "Força + Atletismo + Fado vs. Vigor + Fado",
    "loophole": "Changeling preparou uma refeição para a vítima que então se recusou a comer.",
    "seemingBenefits": {
      "Beast": "Se a Fera for forçada a vomitar sua vítima mais cedo, ela sofrerá mais cinco pontos de dano contundente na saída.",
      "Darkling": "O Trevoso pode engolir seres efêmeros contidos, amarrados ou indefesos, mas tal vítima não sofre danos ao ser engolido.",
      "Elemental": "O Elemental deve sofrer mais dano do que seu Vigor + Fado em sua barriga para ser forçado a cuspir sua vítima.",
      "Fairest": "A barriga da Belíssima não incha com a vítima engolida e ela não sofre a penalidade de Destreza/Defesa.",
      "Wizened": "Se a vítima do Mirrado tiver uma reserva de Glamour, ela poderá gastá-la como se fosse sua enquanto permanece engolida.",
      "Ogre": "O Ogro pode engolir objetos do tamanho apropriado, mas eles ainda sofrem danos."
    },
    "source": "Book of Seemings",
    "page": 141
  },
  "h-seemings:you-are-who-you-eat": {
    "dicePool": "Nenhum",
    "loophole": "O sujeito oferece sua parte do corpo de bom grado, ou concedendo a permissão do metamorfo para comê-la depois que ela morrer ou fazendo isso enquanto ela ainda está viva.",
    "seemingBenefits": {
      "Beast": "A Besta ganha a qualidade 8 novamente em todos os testes de Percepção quando come um olho.",
      "Darkling": "Quando o Trevoso come a pele de outro changeling, ele também copia a aparência dela. Quando ele come a pele de um humano ou de outra criatura sobrenatural, poderes de detecção que não conseguem excepcionalmente registram-no como esse tipo de ser.",
      "Elemental": "A Elemental também renova um ponto de Força de Vontade quando come um coração.",
      "Fairest": "O Mais Belo ganha a qualidade 9 novamente em todos os testes de Habilidade Social quando come uma língua.",
      "Ogre": "O Ogro também ganha +3 de Velocidade quando come um pé ou +3 de Iniciativa quando come uma mão.",
      "Wizened": "O Mirrado também ganha a qualidade 9 novamente em todos os testes de Habilidade Mental enquanto ela comer o cérebro de alguém."
    },
    "source": "Book of Seemings",
    "page": 142
  },
  "h-seemings:last-hope": {
    "dicePool": "Nenhum",
    "loophole": "O desastre inflige um ponto de dano letal a si mesma usando algo destruído no desastre circundante.",
    "seemingBenefits": {},
    "source": "Book of Seemings",
    "page": 145
  },
  "h-seemings:the-troll-toll": {
    "dicePool": "Presença + Subterfúgio + Fado vs. Perseverança + Fado (o mais alto em um grupo)",
    "loophole": "O Troll escondeu uma senha perto da passagem. Qualquer pessoa que a declare é imune ao efeito deste Contrato.",
    "seemingBenefits": {},
    "source": "Book of Seemings",
    "page": 160
  }
};
