export interface ContractResultDetail {
  action?: string;
  duration?: string;
  success?: string;
  exceptionalSuccess?: string;
  page?: number;
}
export const CONTRACT_RESULTS: Record<string, ContractResultDetail> = {
  "ctl-2ed:hostile-takeover": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling declara o seu direito de estar nas instalações, persuadindo a casa que ela pertence lá. Ela pode então contornar qualquer sistema de segurança mundano — por exemplo, não aparece nas câmeras — e suas portas se abrem automaticamente para ela. Animais e sentinelas de hobgoblin ficam fora do caminho dela. O changeling pode estender os benefícios deste Contrato a uma série de companheiros iguais a sua Presença, desde que permaneçam na sua linha de visão. O alvo de um Hollow, ou outra habitação sobrenatural, desencadeia um Confronto de Vontades com o proprietário ou residente principal. Este contrato não funciona se o proprietário ou o residente principal do edifício também conhecer a aquisição hostil, uma vez que ele é outro beneficiário do mesmo.",
    exceptionalSuccess: "",
    page: 128,
  },
  "ctl-2ed:mask-of-superiority": {
    action: "Instantânea",
    duration: "",
    success:
      "As pessoas que vêem o personagem acreditam que ele é um membro respeitado de uma organização a que pertencem, como se ele tivesse pontos em seu Status Mérito igual a sua Presença. Se o changeling afeta várias pessoas, todos eles acreditam que ele é um membro da mesma organização; o jogador escolhe um alvo como seu principal para deter a minha organização. Se ele age fora do caráter para um membro ou não sabe algo que um membro faria, seu jogador rola Presença + Subterfúgio contestado pelos outros personagens» Raciocínio + Empatia para impedi-los de perceber que ele é uma fraude.",
    exceptionalSuccess:
      "O changeling, em vez disso, convence as pessoas que ele é um aliado confiável vir para uma turnê, como se ele também tinha o Mérito Aliados igual a sua Presença. Ele recebe os mesmos benefícios que um membro, mas é dado um passe se ele não conhece todo o funcionamento interno da organização, eo jogador só tem que rolar para o changeling para ficar no personagem se ele faz algo realmente absurdo.",
    page: 128,
  },
  "ctl-2ed:paralyzing-presence": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling cresce, mais bonito e terrível, na mente do alvo e oprime-a: Ela sofre o Insensate Tilt.",
    exceptionalSuccess: "A vítima também sofre da Condição de Cowed.",
    page: 129,
  },
  "ctl-2ed:summon-the-loyal-servant": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling corta-lhe a mão e deixa cair uma gota de sangue sobre a substância da sua escolha: O fogo de uma vela acesa, as sombras escondidas no canto, e uma pilha de folhas e galhos são alvos válidos. A substância anima em um servo pequeno, que é tão inteligente como um cão e pode executar ordens simples. Também é perceptivo o suficiente para notar ameaças ao changeling ou a si mesmo. O servidor tem Poder 1, Finesse 3, e Resistência 1, com traços derivados como se fosse um fantasma de Sebe (p. 247), mas possui apenas ferro como fragilidade e não ganha nenhuma Influência ou Numina. O changeling escolhe sua forma, e um Tamanho entre 1 e 7. O servidor tem vantagens naturais concedidas pela sua maquilhagem; por exemplo, um servidor de incêndio não pode ser queimado. Continua animado para uma cena, ou até ser destruído.",
    exceptionalSuccess: "",
    page: 129,
  },
  "ctl-2ed:tumult": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "A primeira vez revela se o alvo sofre de alguma das seguintes Condições: Desorientado, Culpado, Perdido, Paranóide, Obsessão, Assustado, Estóico ou Retirado. Como o changeling continua dobrando, ele pode infligir um desses efeitos sobre o alvo por sucesso rolou: • Infligir uma das Condições temporárias acima no alvo. • Atrasar o efeito deste Contrato até que ocorra um gatilho especificado; vários sucessos podem especificar os gatilhos separados de ponta múltipla. Devoção do aluno Um changeling pode aprender um contrato arcadiano mais facilmente por procurar um professor. O professor deve conhecer o contrato que deseja aprender, e tê-lo como parte de sua Regalia favorita. Depois de fazer um juramento pessoal (p. 213) para sua professora, o personagem pode aprender o Contrato a custo favorecido, mesmo que não seja parte de sua própria Regalia favorecida. As indicações deste juramento são únicas para cada penhor, e o personagem deve fazer um juramento separado para cada contrato que deseja aprender. Personagens também podem aprender os aparentes benefícios de um Contrato desta forma de um professor da aparência certa.",
    exceptionalSuccess: "",
    page: 129,
  },
  "ctl-2ed:discreet-summons": {
    action: "Instantânea (object) or Disputada (hobgoblin)",
    duration: "",
    success:
      "O personagem atinge um pequeno recipiente, como uma bolsa ou gaveta, sem olhar, e puxa um item de Tamanho 1. Este item pode ser qualquer coisa que o personagem já tenha visto ou manipulado antes. O item é o tipo mais básico do seu tipo, mas totalmente funcional e pronto para usar: Uma câmera tira fotos, um smartphone pode fazer chamadas e acessar uma conexão sem fio, e uma arma dispara balas de sua revista totalmente carregada. Os objetos não têm qualificadores especiais, nem Disponibilidade superior a 3. Alternativamente, o changeling pode abrir qualquer porta e anunciar alto “Eu tenho um convidado!” para encontrar um hobgoblin parado lá. A criatura é um espécime normal do seu tipo (p. 252) com um Fado não superior a 3, e executa uma tarefa para o personagem para o melhor de sua capacidade. O changeling pode elaborar em seu mantra que abre a porta para persuadir a criatura a vir de bom grado, como “Eu tenho um convidado, que é hábil como advogado e que eu pagarei com unhas!” O contador de histórias decide se o changeling de fato seduz o hobgoblin desta maneira, caso em que o rolo do contrato não é contestado como a criatura vem voluntariamente. O objeto ou hobgoblin desaparece no final da cena, quando deixa as mãos do personagem (para um objeto), ou quando o personagem pára de prestar atenção a ele, que sempre vem em primeiro lugar.",
    exceptionalSuccess:
      "O item pode ser do tamanho 5 ou menor, e pode ter até Disponibilidade 5. O hobgoblin gosta do personagem e vai muito longe para cumprir o espírito de sua designação, em vez da carta, e por formas quaisquer tarefas de acompanhamento que garantam maior sucesso. Por exemplo, se ele foi carregado para roubar algo e discotecas o objeto é amaldiçoado, ele diz ao changeling.",
    page: 130,
  },
  "ctl-2ed:mastermind-s-gambit": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling fala em voz alta para si mesmo, revelando seus mais sombrios medos e desejos ao ar. Ele tece um objetivo concreto em seu monólogo, como “em barrass o Duque de Barrington em frente à Corte”, ou “invadir a biblioteca da Rainha”, e suas palavras se transformam em ideias e pergaminho. Esta ação instantânea leva pelo menos cinco minutos para ser concluída. No momento em que ele pára de falar, o changeling criou um plano ou reposi tory (p. 196) pertinente para o seu objectivo que conta como equipamento que concede um bónus +5. Dura até ao fim do capítulo ou até que o plano tenha êxito ou falhe definitivamente, o que vier primeiro.",
    exceptionalSuccess: "",
    page: 130,
  },
  "ctl-2ed:pipes-of-the-beastcaller": {
    action: "Instantânea (willing) or Disputada (hostile)",
    duration: "",
    success:
      "O personagem envia uma chamada para todos os ani males de uma espécie, que ele nomeia ao invocar o contrato, dentro de um raio igual ao seu animal Ken pontos em milhas. Todos os que estão ao seu redor se reúnem e ele pode dar-lhes ordens simples, que obedecem ao melhor de suas habilidades. O personagem deve dar suas instruções verbalmente (o Contrato garante que as criaturas, independentemente do intelecto, o entendam), embora a primeira onda de chegadas passe suas instruções para os animais mais longe. Uma vez que os animais completaram sua tarefa, ou enfrentam um problema insuperável, eles retornam para informar o changeling. Os animais hostis podem contestar o presente contrato.",
    exceptionalSuccess:
      "O personagem controla os animais por um dia e uma noite, e pode dar-lhes novos comandos sempre que ele fala com eles. Se ele os tratar mal, ou fizer exigências impossíveis, os ani mals ganham um novo rolo Perseverança + Autocontrole para contestar o Contrato.",
    page: 131,
  },
  "ctl-2ed:the-royal-court": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling pode impedir que a violência se desmorone. Não importa quão desajeitadas ou hostis sejam as negociações — mesmo que esse assassino tenha vindo aqui com a intenção de matá -, nenhuma das pessoas reunidas pode causar danos corporais a outra pessoa. Se alguém presente está sob uma coerção natural para cometer violência, o changeling e a força por trás da coerção se envolvem em um confronto de vontades. Este Contrato não para a violência se já estiver pronto para começar.",
    exceptionalSuccess: "",
    page: 131,
  },
  "ctl-2ed:blessing-of-perfection": {
    action: "Instantânea",
    duration: "One action",
    success:
      "O changeling carinhosamente acaricia e fala com um objeto. Sua atenção concede uma bênção sobre o objeto, que lhe retribui substituindo seu bônus de equipamento com sua classificação de Fado. O changeling pode, em vez disso, visar outra pessoa Artesanato, Medicina, ou Computer ação por falar palavras de encorajamento enquanto ele trabalha, substituir sua classificação de habilidades com seu Fado.",
    exceptionalSuccess: "",
    page: 132,
  },
  "ctl-2ed:changing-fortunes": {
    action: "Instantânea",
    duration: "One action",
    success:
      "O changeling sussurra uma história ao vento, de uma estranha reviravolta de acontecimentos que a sobreveio em Ar cadia. Ela pode então adicionar ou subtrair dois dados do próximo rolo do jogador do seu alvo, ou menor ou aumentar o seu limiar de sucesso excepcional por um sucesso, por sucesso rolado. Os limiares de sucesso excepcionais não podem ser inferiores a um sucesso, nem o alvo pode jamais alcançar um sucesso excepcional em uma chance de morrer. O changeling pode ser alvo. Exemplo: Com dois sucessos rolados, um jogador pode adicionar ou subtrair quatro dados do pool de dados de seu alvo, ou menor ou aumentar seu limiar de sucesso excepcional por dois es de sucesso, ou adicionar ou subtrair dois dados, enquanto também baixar ou subir o seu limiar excepcional por um. Mudar Fortunas pode afetar um determinado alvo apenas uma vez por capítulo. Tentar usar este Contrato no mesmo alvo novamente resulta em o changeling xingando-se, como fracasso dramático.",
    exceptionalSuccess:
      "Em vez de afetar o próximo rolo do alvo, o changeling pode especificar um gatilho para o efeito, como “se ele tentar atirar em mim”. Se o gatilho não acontecer antes do fim da cena, o Contrato simplesmente termina.",
    page: 132,
  },
  "ctl-2ed:light-shy": {
    action: "Instantânea Roll Results",
    duration: "",
    success:
      "O changeling torna-se invisível à mente, afetando todos os sentidos, embora a tecnologia de gravação ainda a detecte. O Contrato termina se ela tomar qualquer ação agressiva, como um ataque ou gritar com alguém, ou infligir qualquer tipo de dano ou efeito sobrenatural em qualquer pessoa.",
    exceptionalSuccess: "",
    page: 133,
  },
  "ctl-2ed:murkblur": {
    action: "Disputada",
    duration: "One Turno",
    success:
      "O alvo vê a beleza impossível de Arcadia, não destinada a seres menores para contemplar, e sofre a inclinação cega (ambos os olhos).",
    exceptionalSuccess:
      "Como sucesso, e o alvo sufers o Sured Tilt (ambos os ouvidos).",
    page: 133,
  },
  "ctl-2ed:trivial-reworking": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling lembra como seu Guardião moldou itens para se adequar a seus caprichos, e imita um pouco do que ele fez. Ela esconde um item mundano até o tamanho 3 em sua máscara, e muda seus aspectos visuais. A forma básica do objeto permanece a mesma, e todas as regras que regem Máscara se aplicam. Este efeito é puramente psicológico: Uma folha seca disfarçada de uma nota de 100 dólares parece e parece exatamente uma nota de 100 dólares para qualquer mortal, mas",
    exceptionalSuccess: "",
    page: 133,
  },
  "ctl-2ed:changeling-hours": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling move seus braços para “desenhe” um relógio no ar entre ela e o objeto. Em seguida, ela imita virar as mãos do relógio para trás, para a frente, ou detê-los. Este Contrato pode criar três efeitos diferentes. O changeling escolhe qual usar quando invoca o Contrato. Rebobinar o relógio: O item torna-se como novo. O contrato repara um ponto de dano por turno e re coloca peças em falta, restabelecendo até sua classificação de Artesanato em Estrutura. Acelerar o relógio: O item corrói, sofrendo um ponto de dano por turno que ignora Durabilidade, até sua classificação Crafts em danos. Congele o relógio. O item congela no tempo e no lugar, tornando impossível se mover e imune a danos ou mudanças.",
    exceptionalSuccess: "",
    page: 134,
  },
  "ctl-2ed:dance-of-the-toys": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling faz um dispositivo mecânico dançar aos seus caprichos. Ela o atinge para inspirar obediência através do terror, ou acariciá - lo para engendrar lealdade nascida do amor. De qualquer forma, o dispositivo ganha vida para seguir um comando simples. Uma porta fecha e permanece fechada, um carro vai embora, ou uma arma dispara até que fique sem balas. Quem tentar mudar sua ação deve rolar Força + Perseverançar e alcançar mais sucessos do que o changeling fez para invocar o Contrato. Os dispositivos não podem sair do seu alcance normal de movimento. Se o movimento natural de um dispositivo infligir danos, como um carro atropelar alguém, ele usa os sucessos rolou neste Contrato como um pool de dados para esse ataque. O changeling pode controlar qualquer dispositivo que possa ver dentro de 10 metros de Fado.",
    exceptionalSuccess:
      "O jogador pode comprar o dispositivo como um retentor de um ponto, caso em que permanece permanentemente animado. Caso contrário, o encantamento expira após um capítulo.",
    page: 134,
  },
  "ctl-2ed:hidden-reality": {
    action: "Instantânea",
    duration: "",
    success:
      "O personagem imagina o mundo não como ele é, mas como ele pode ser, e escolhe uma das diferenças para se tornar realidade. Ela pode alterar uma característica de seus arredores, desde que sempre poderia ter sido assim. Por exemplo, ela pode criar uma trava escondida em uma caixa, ou uma porta em uma parede, desde que ninguém mais tenha visto que não estava lá",
    exceptionalSuccess: "",
    page: 134,
  },
  "ctl-2ed:stealing-the-solid-reflection": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling atinge uma superfície reflexiva, para o mundo espelho além, e puxa o objeto desejado para fora dele. A superfície deve ser suficientemente clara para mostrar algum detalhe, e o objeto deve caber através dele. O reflexo roubado é espelhado: um carro com o volante no lado errado, ou um livro escrito em texto ao contrário. O objeto roubado não tem propriedades sobrenaturais. Nem o objeto roubado nem o original tem uma reflexão enquanto este Contrato dura.",
    exceptionalSuccess:
      "A reflexão roubada permanece sólida até que o sol passe o horizonte.",
    page: 135,
  },
  "ctl-2ed:tatterdemalion-s-workshop": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling toma uma ação de equipamento de construção do júri (p. 197) como normal, mas nenhum equipamento mundano até o tamanho 5 é sempre muito complexo para construir em um único turno, e ela ignora a necessidade de componentes adequados ou ferramentas. Reduzir a penalidade habitual para bônus de equipamento ou benefícios por metade do Fado do personagem, arredondado. O processo de crafting deve parecer vagamente possível para o leigo: Ela pode criar um lançador de foguetes a partir de um sinalizador e um recipiente de gás comprimido, ou uma máquina Xerox portátil de suprimentos de banheiro aleatórios e uma caneta fonte. O dispositivo funciona assim como sua versão normal faria.",
    exceptionalSuccess: "",
    page: 135,
  },
  "ctl-2ed:glimpse-of-a-distant-mirror": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling olha para qualquer superfície reflexiva, que se torna uma janela que olha através de outra tal superfície que já refletiu seu rosto antes. Qualquer um que olha para esta janela pode ver o que está do outro lado. A vista é tão clara quanto as superfícies permitem — uma piscina lamacenta cria uma vista lamacenta. Depois que o Contrato termina, o changeling vê-se errado na superfície para o resto da cena, brilhando indícios das pessoas espelho do outro lado.",
    exceptionalSuccess: "",
    page: 136,
  },
  "ctl-2ed:know-the-competition": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling observa seu oponente em um jogo contra ele, prevendo seus movimentos e como ela usa seus recursos. Ele ganha, e aprende sua virtude e vice (ou âncoras equivalentes) e uma de suas aspirações.",
    exceptionalSuccess: "",
    page: 136,
  },
  "ctl-2ed:read-lucidity": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O contador de histórias diz ao jogador os níveis de claridade máximo e atual do alvo, embora o ator de char interprete isso em termos relativos (“ela é mais estável do que eu” ou “ela está muito confusa”). O changeling também sabe quais são as Condições de Lucidez que seu alvo sofre, se houver.",
    exceptionalSuccess:
      "O changeling também descobre as circunstâncias dos mais recentes danos causados pela Clarity.",
    page: 137,
  },
  "ctl-2ed:walls-have-ears": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling segura um item até sua boca, e conta um segredo de seu tempo em Arcadia. O objeto lhe conta um segredo em troca. O changeling pode invocar qualquer um desses efeitos, a um custo de um ponto de Glamour cada: • Ele sabe como o objeto é construído e todos os seus pontos fracos. Metade da Durabilidade do objeto (em volta) para qualquer ataque que ele fizer contra ele, e adicione sua classificação de inteligência como dados bônus para reparar ou modificar o objeto. • Ele sabe como usar o objeto para o seu melhor efeito, e seu jogador ganha a qualidade 9 novamente em rolos de dados para empunhar ou usá-lo. • Ele vê uma visão da pessoa que lidou ou tocou o objeto pela última vez, bem como as circunstâncias da cena. A visão mostra qualquer pessoa dentro de três metros do objeto naquele momento.",
    exceptionalSuccess: "",
    page: 138,
  },
  "ctl-2ed:props-and-scenery": {
    action: "Instantânea",
    duration: "",
    success:
      "Glamour forma o changeling no objeto inanimado desejado, com traços padrão para o seu tipo, de um Tamanho até o seu próprio por padrão. O jogador escolhe um benefício adicional por sucesso enrolado para invocar este Contrato, tais como: • + 1 Durabilidade; pode aplicar várias vezes • mobilidade limitada (ele se enrola como uma rocha, ou usa pernas de cadeira para andar) • +/−1 Tamanho; pode aplicar várias vezes • Outros efeitos com aprovação do contador de histórias",
    exceptionalSuccess:
      "O changeling pode comprar o formulário permanentemente para 3 Experiências. Se o fizer, ele pode adotá-lo reflexivamente para um único ponto de Glamour (mas ainda deve rolar), mas não pode beneficiar deste Contrato Loophole dessa forma. Ele muda como se tivesse conseguido um sucesso. Ele também pode assumir o mesmo formulário usando este Contrato normalmente.",
    page: 138,
  },
  "ctl-2ed:reflections-of-the-past": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling olha para uma superfície reflexiva, e afirma um tempo ou evento específico. O reflexo então rebobina em velocidade impossível, comprimindo dias ou anos em um único momento até chegar ao momento em que ele afirma. O changeling pode então ver o evento como aconteceu, embora apenas a partir do ângulo em que foi originalmente refletido na superfície. Mais alguém a ver vê a mesma visão. A visão pode mostrar o valor de eventos de uma cena. O changeling pode ver momentos mais distantes no passado gastando mais Glamour; um para voltar para uma semana, dois para um mês, três para uma temporada, quatro para um ano, e cinco para uma década. Ele deve especificar a hora em pelo menos data (quer fixa ou relativa ao presente), e se era dia ou noite; ou ele pode especificar um evento, desde que ele saiba alguns dos detalhes, como “quando o Ogre bateu Jack.”",
    exceptionalSuccess: "",
    page: 138,
  },
  "ctl-2ed:riddle-kith": {
    action: "Instantânea or Disputada; see below",
    duration: "",
    success:
      "Deixando a máscara e puxando apenas o Glamour sob a pele do alvo, o changeling altera a fae mien exterior do alvo para emular as armadilhas de um kith diferente, mas não suas bênçãos. As características gerais do alvo permanecem: se ele era um Chatelaine rotundo, ele agora é um Snowskin rotundo. Nada sobre as aparentes mudanças do alvo, então um Darkling Leechfinger agora parece um Darkling Helldiver, por exemplo. Forçando a aparência de um novo kith em cima de um assunto relutante concede-lhe um rolo para contestá-lo e constitui um ponto de ruptura com um pool de três dados, como o changeling repete o cru elly do Gentry. Este Contrato não pode copiar o mien de um changeling específico.",
    exceptionalSuccess:
      "O changeling pode gastar um ponto de força de vontade para prolongar definitivamente a duração do Contrato, mas somente quando ele mesmo é o alvo.",
    page: 139,
  },
  "ctl-2ed:skinmask": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling recita três coisas que ele sabe sobre seu alvo, que pode ser um mortal ou qualquer criatura com uma máscara: Ela é alta, toma açúcar no café e usa um casaco vermelho. Ele, então, assume que ela exterior aparecer ance. Se o alvo dele é um changeling, ele copia tanto Máscara como Mien. Mimificar o comportamento do alvo ainda requer rolos sociais bem sucedidos. Embora o changeling pudesse copiar a Máscara de qualquer um que tenha encontrado fisicamente, ele muitas vezes copia pessoas que se parecem com ele — ou melhor, pessoas que ele se pareceria se não fossem levadas. Mais velho, sem a maldição da juventude imposta por seu Guardião, com menos cicatrizes e olhos que conhecem a paz. Antes de cuidar, ele é como eles alivia a coceira sob sua pele; se ele fizer isso, recupere um ponto de força de vontade.",
    exceptionalSuccess: "",
    page: 139,
  },
  "ctl-2ed:cloak-of-night": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling deve invocar este Contrato enquanto ela e seus aliados estão em condições escuras ou sombrias; enquanto eles tomam uma penalidade para rolos de percepção visual, é escuro o suficiente. Ela esconde a escuridão em torno de uma série de companheiros dispostos iguais à sua classificação de Dexterity. Rolos Stealth do jogador, para o qual ela adiciona metade de seu personagem Fado (em torno) em dados bônus, esconder todo o grupo, desde que ninguém faz nada para atrair atenção indevida, como atacar ou fazer barulhos altos. O changeling e seus companheiros também tomam ações baseadas em Stealth como ações reflexivas, uma vez por vez em tempo de ação.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:fae-cunning": {
    action: "Reflexiva",
    duration: "",
    success:
      "O changeling se move com a graça de relâmpagos ou comandos lâminas para passar por ela, ou talvez seu corpo sombrio simplesmente se divide em dois para permanecer ileso. Ela pode aplicar sua defesa aos ataques de armas de fogo e nunca perde sua defesa, mesmo que ela esteja surpresa ou distraída. Poderes sobrenaturais que negariam a sua defesa provocam um confronto de vontades. Se ela com sucesso Dodges, ela pode redirecionar o ataque para outro alvo válido, que automaticamente atinge com sucessos iguais à classificação de Presença do changeling.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:shared-burden": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling permite que seu sangue flua para o corpo do alvo, à medida que seu Glamour tricota suas feridas fechadas. Para cada ponto de dano letal que ela inflige sobre si mesma, o Contrato cura dois pontos de dano para seu alvo. Ela cura primeiro os danos causados por golpes, seguidos de letais; este tratado de Con não pode curar danos agravados. Nenhuma magia pode aliviar o dano que um changeling infligiu a si mesma por usar o Shared Burden — nem mesmo o de outra pessoa.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:thorns-and-brambles": {
    action: "Instantânea",
    duration: "",
    success:
      "Brambles crescem em torno do changeling com um raio de metros iguais à sua classificação Fado, e segui-la enquanto ela se move. Eles podem produzir três efeitos diferentes, listados abaixo. O changeling escolhe um quando invoca este Contrato. Se ela o usa na Sede, os brambles não seguem seus movimentos, e ela deve con tender com a ameaça deles também. Leechweed: Os brambles picam qualquer um que se move através deles mais rapidamente do que Speed 2, drenando-o de um ponto de Glamour por turno, até a classificação Fado do changeling por vítima. Briarpatch : Os brambles emaranham os inimigos do changeling, infligindo o Immobilized Tilt (p. 330) em qualquer um que falha um reflexive Dexterity + rolo de atletismo; eles devem fazer um cada vez que eles se movem dentro da área. Os brambles têm uma Durabilidade igual à classificação Fado do changeling. Campo de Espinhos: Os brambles atacar qualquer um que tenta quebrar através usando a classificação Fado do changeling como um pool de dados. São armas perfurantes com um modificador de +0L. Os brambles atacam qualquer personagem apenas uma vez por turno. O changeling pode fazer com que o Campo de Espinhos permaneça no lugar quando ela se move.",
    exceptionalSuccess: "",
    page: 141,
  },
  "ctl-2ed:trapdoor-spider-s-trick": {
    action: "Instantânea",
    duration: "One Cena, or until the sun next crosses the horizon; see below.",
    success:
      "O changeling passa por uma abertura (seja uma porta, uma janela, ou um buraco na parede) e a camufla com Glamour para fazê-la parecer intransitável, ou nem mesmo lá. A ilusão é visual apenas, e percepção sobrenatural pode perfurá-lo visualmente com um sucesso Confronto de Vontades. O jogador pode pagar um ponto adicional de Will power ao promulgar este Contrato para estender o efeito até o próximo amanhecer ou crepúsculo, o que vier primeiro.",
    exceptionalSuccess: "",
    page: 142,
  },
  "ctl-2ed:fortifying-presence": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "A presença do changeling cura dois pontos do leve dano à clareza do alvo, ou um ponto de gravidade. Isso não tem efeito nas Condições de Lucidez do alvo.",
    exceptionalSuccess:
      "O changeling também atua como uma Pedra de Toque temporária para o alvo, até depois do próximo ataque da Clarity ele sofre.",
    page: 142,
  },
  "ctl-2ed:hedgewall": {
    action:
      "Prolongada (Five successes necessary; each roll represents one Turno)",
    duration: "",
    success:
      "Sebewalls formam um castelo em torno do changeling, espalhando-se para um diâmetro de 10 metros / metros por ponto de Fado que ele possui; restrições de espaço e os desejos da mudança de Ling pode torná-lo menor no mundo real, mas na Sebe ele simplesmente arado sobre obstáculos para fora de seu tamanho completo. O castelo concede um disfarce substancial contra os ataques de fora (p. 186). As paredes impedem que qualquer um passe sem primeiro clareá-los, e cada parede tem Durabilidade 3 e Tamanho 8. Os personagens podem escalar as paredes, mas fazê-lo sem proteção contra os brambles inflige um ponto de dano letal por turno. O changeling determina o layout da construção, mas suas passagens devem ser largas o suficiente para que um caractere Tamanho 4 passe facilmente.",
    exceptionalSuccess:
      "O changeling escolhe um efeito de Thorns e Brambles (p. 141) para adicionar ao castelo de graça.",
    page: 142,
  },
  "ctl-2ed:pure-clarity": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling pode tomar qualquer ação durante esta cena que normalmente levaria a um ponto de ruptura para ela, sem sofrer. O contrato termina uma vez que ela faz, ou no final da cena, o que vier primeiro. Ela só pode usá-lo uma vez por cena. O changeling pode invocar este Contrato retroativamente para ações de sua parte (por exemplo, se ela acci dentalmente mata alguém) desde que o faça dentro da mesma cena.",
    exceptionalSuccess:
      "O changeling ganha uma classificação ar mor de 2 contra o próximo ataque de Clarity que ela sofre. Essa benção permanece até ser ativada, mesmo que o contrato termine primeiro.",
    page: 143,
  },
  "ctl-2ed:vow-of-no-compromise": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Com um toque e uma promessa falada, o changeling downgrades um nível de seu alvo aggra vated dano para letal. Em troca, ela ganha a Condição Estórica (p. 345). Ela pode ser alvo.",
    exceptionalSuccess: "",
    page: 143,
  },
  "ctl-2ed:whispers-of-morning": {
    action: "Instantânea",
    duration: "",
    success:
      "O mundo, e deveras as leis da física, esquecem o changeling — preso entre ser e não ser, seu corpo e tudo em sua pessoa tornam - se intangíveis. Ela é sem peso, não pode ser tocada ou atacada (ou tocar ou atacar outros) salvo por meios mágicos, e pode passar por todas as barreiras físicas à vontade.. Ela pode ver e interagir com outras criaturas faes incorpóreas e objetos, como outros metamorfos usando Whispers de Morn Ing e Sebe fantasmas. No entanto, ela existe em uma frequência diferente das criaturas em Twilight, como espíritos e fantasmas regulares. Os Helldivers que usam sua bênção de mergulho existem em uma tangência entre os dois: O Helldiver escolhe se o changeling pode vê-lo ou não.",
    exceptionalSuccess: "",
    page: 143,
  },
  "ctl-2ed:boon-of-the-scuttling-spider": {
    action: "Instantânea",
    duration: "",
    success:
      "O mundo achata no olho da personagem, até que todas as superfícies sejam igualmente horizontais e igualmente de cabeça para baixo. Ele pode se mover ao longo de paredes, tetos, ou superfícies escorregadias normalmente traiçoeiras demais para atravessar, desde que sejam fortes o suficiente para carregar seu peso. Ele pode se mover em sua velocidade normal, e age sem obstáculos enquanto se move desta forma.",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:dreamsteps": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling entra na Base do sonhador através do Portão do Marfim (p. 215), em vez de entrar na sua própria.",
    exceptionalSuccess:
      "O bastião do sonhador sofre uma −1 de fortificação até que ela acorde.",
    page: 144,
  },
  "ctl-2ed:nevertread": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling pára para encobrir uma das suas pegadas. Ele pode soltar folhas sobre ela, apagá-la e deixar uma pedra em seu lugar, ou esculpir a terra até que se pareça com uma trilha de casco. Ele então continua em seu caminho, e o Contrato muda todas as suas pegadas de acordo com a duração. Isso o torna impossível de rastrear salvo por meios sobrenaturais, desencadeando um Confronto de Vontades, e faixas alteradas permanecem assim mesmo após o contrato terminar.",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:pathfinder": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling mistura parte de seu cuspe ou sangue com a terra da Sede, e usa a mistura para desenhar uma bússola em sua mão. Ele instintivamente sabe a distância e a direção da característica geral mais próxima de Sebe de sua escolha — o mercado mais próximo de Goblin ou Hol baixo, um pedaço de fruta goblin, ou uma entrada para o Portão de",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:seven-league-leap": {
    action: "Reflexiva",
    duration: "One Turno",
    success:
      "O changeling salta para cima e para baixo, regalando o ar com histórias de sua proeza atlética. O jogador então faz um salto (Força + Atletismo), e o personagem pode limpar uma trajetória de salto de 10 metros por ponto de Fado que ele possui.",
    exceptionalSuccess: "",
    page: 145,
  },
  "ctl-2ed:chrysalis": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling escolhe dois animais quando o jogador compra esse poder, e pode se transformar em qualquer um invocando-o. Ele deve ter visto o animal antes (uma representação precisa funciona), e não pode ser menor do que Tamanho 1 ou maior do que Tamanho 7. Ele pode escolher uma besta mítica, embora não ganhe nenhum de seus poderes supernais — apenas o",
    exceptionalSuccess: "",
    page: 145,
  },
  "ctl-2ed:flickering-hours": {
    action: "Instantânea",
    duration: "Until the changeling exits the Hedge",
    success:
      "O changeling pode estender este Contrato a qualquer pessoa que viaje com ele no momento em que ele o invoca; perseguidores hostis, se eles estão perto de seu calcanhar, inclusive. Ele pode diminuir o tempo pela metade, ou acelerá-lo para passar duas vezes mais rapidamente, para qualquer um dos alvos individualmente. Até que o sol cruze o horizonte, qualquer um que se acelere também ganha a Frota do Mérito do Pé, com pontos efetivos iguais ao Fado do changeling até três, e sempre tem a Borda em uma perseguição. Alvos involuntários podem se libertar do efeito, sucedendo em um rolo Perseverança + Fado contestado pelo changeling Raciocínio + Occult + Fado.",
    exceptionalSuccess: "",
    page: 146,
  },
  "ctl-2ed:leaping-toward-nightfall": {
    action: "Instantânea or Disputada; see below",
    duration: "Special",
    success:
      "O changeling pode enviar um objeto até o Tamanho 10 ou um caractere para frente a tempo. O alvo desaparece instantaneamente e reaparece na hora predeterminada no mesmo local, conservando o momento se estivesse se movendo. Se algo mais ocupa esse lugar, o alvo aparece ao lado dele. Não passa tempo para o alvo. Seres sencientes podem contestar este Contrato. O changeling determina até que ponto no futuro ele envia o alvo, para um máximo de dias iguais aos sucessos rolados para invocar Salto em direção ao anoitecer. O changeling não pode terminar este contrato prematuramente.",
    exceptionalSuccess:
      "O changeling também pode enviar o alvo para um novo local ocupado por alguém a quem ele deve uma dívida. Ele não pode escolher o local em si, apenas o personagem que vai receber o alvo chegando quando ele chega no futuro.",
    page: 146,
  },
  "ctl-2ed:mirror-walk": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling toca uma superfície reflexiva. Uma vez que o caminho está aberto, o changeling pode passar, trazendo todos os companheiros que ele gosta em uma cadeia de mãos ligadas, ou simplesmente alcançar sua mão através de para agarrar um objeto do outro lado. O changeling deve ter tocado o espelho de saída antes, e tanto a entrada quanto a saída devem ser grandes o suficiente para que ele passe fisicamente seu corpo ou mão através.",
    exceptionalSuccess:
      "Os espelhos permanecem portais para a cena, e qualquer um pode passar livremente com a permissão do changeling em qualquer direção, sem a necessidade de ligar as mãos.",
    page: 146,
  },
  "ctl-2ed:talon-and-wing": {
    action: "Instantânea",
    duration: "",
    success:
      "Este contrato pode conceder três efeitos diferentes, que um personagem pode empilhar a um custo de um ponto de Glamour cada. • O personagem ganha o modo de transporte de uma besta, aumentando sua velocidade em 10. • O personagem ganha os sentidos de uma besta, dando ao seu jogador um bônus de três-moedas para rolos de percepção e eliminando penalidades em iluminação fraca ou escuridão. • O personagem ganha as garras de uma besta, dando a sua Brawl desarmado ataca um modificador de arma de +0L. Se seus ataques desarmados já causam danos letais, suas garras se tornam preternaturalmente afiadas e, em vez disso, danos agravados.",
    exceptionalSuccess: "",
    page: 147,
  },
  "ctl-2ed:elemental-weapon": {
    action: "Instantânea",
    duration: "",
    success:
      "O personagem agarra um elemento próximo — como água de um lago, chamas de uma lareira, uma rosa de seu arbusto, ou eletricidade de um soquete de parede — e moldá-lo em qualquer arma arcaica de sua escolha; por exemplo, luvas de fogo que realçam seus ataques de briga, uma espada congelada para empunhar em mime, ou dardos lançados de relâmpago. A arma tem características normais para o seu tipo (p. 323) , para o qual o jogador pode adicionar qualquer um dos fol baixando: + 1 modificador de arma por sucesso gasto, ou diminuir a penalidade Iniciativa por um por sucesso gasto, ou + 20/40/80 faixa por sucesso gasto, para um máximo de três sucessos por opção. Ela pode misturar e combinar suc cesses entre estas opções.",
    exceptionalSuccess: "A arma ganha bônus adicionais, como acima.",
    page: 147,
  },
  "ctl-2ed:might-of-the-terrible-brute": {
    action: "Reflexiva",
    duration: "",
    success:
      "A personagem deixa sair um terrível rugido de fúria e desafio, chamando as proezas que uma vez serviram seu Guardião e agora só serve a si mesma. Sempre que o jogador ganha um rolo de grapple contestado, o changeling ganha uma nova opção para um movimento para promulgar: Ela pode reduzir a força de seu oponente por um e adicioná-lo a seu próprio. Os oponentes reduzidos a Força 0 desta forma ganham o Immobilized Tilt, incapaz de realizar efetivamente quaisquer ações físicas. Ela pode não aumentar sua força em mais de +5, mas pode exceder seu limite derivado de Fado.",
    exceptionalSuccess: "",
    page: 148,
  },
  "ctl-2ed:overpowering-dread": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Canalizando sua destruição silenciosa em seu alvo, ela o amaldiçoa com a condição de medo (p. 339).",
    exceptionalSuccess:
      "Da próxima vez que o changeling vir o alvo após o contrato terminar, invocá-lo contra ele novamente não custa nenhum Glamour.",
    page: 148,
  },
  "ctl-2ed:primal-glory": {
    action: "Instantânea",
    duration: "",
    success:
      "O personagem sobreviveu aos ardentes desertos e planícies de gelo de Arcadia; meros elementos mortais não podem prejudicá-la. Ela toca em um elemento e ele vacas antes dela: Ela ganha imunidade aos danos de instâncias mundanas do elemento, e sofre apenas metade dos danos (retornados) de fontes mágicas. Ele também se enrola em torno dela em uma armadura protetora, como um cão ansioso para agradar seu mestre, concedendo-lhe uma classificação de armadura de 1/1. A armadura magoa quem se aproxima, dando um ponto de dano letal por volta de quem se envolve em melee contra ela.",
    exceptionalSuccess: "",
    page: 148,
  },
  "ctl-2ed:touch-of-wrath": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling toca um objeto e, sussurrando doces ameaças a ele, afunda suas unhas em pedra, ou rasga profundos cortes em metal. Ela dá um ponto de dano ao objeto para cada sucesso rolado.",
    exceptionalSuccess: "O toque do changeling ig nores Durabilidade.",
    page: 148,
  },
  "ctl-2ed:elemental-fury": {
    action: "Instantânea",
    duration: "",
    success:
      "A personagem canaliza sua fúria para fora, gritando para o céu, e infligindo um Environmen tal Tilt de sua escolha por ponto de Glamour ela gasta. A área estende-se a 20 metros em torno da personagem, embora ela mesma seja imune aos seus efeitos. Ela também pode gastar pontos adicionais de Glamour para estender o Tilt 20 metros mais por ponto gasto.",
    exceptionalSuccess: "",
    page: 149,
  },
  "ctl-2ed:oathbreaker-s-punishment": {
    action: "Instantânea",
    duration: "A fortnight, or until used",
    success:
      "O changeling sente a promessa mais séria que o alvo quebrou para a qual ele ainda não expiou, quer quebrou um juramento real ou simplesmente não foi para a escola quando disse a seus pais que iria. Expiação significa uma confissão completa a partes injustiçadas, bem como re parear qualquer dano. O changeling pode esculpir um pesadelo wak ng para cada sucesso rolado, para visitar o alvo dentro da próxima quinzena. Este pesadelo deve envolver a promessa quebrada de alguma forma: um cônjuge traidor pode ter uma imagem súbita de seu marido assassinando-o durante o jantar, enquanto o garoto brincando de hooky pode ver seu professor (uma vez que ele retorna à escola) como um monstro. Estes pesadelos são alvos válidos para a oneiromancia enquanto acontecem e cada um dura uma cena, cria um Bastion ao longo de uma Estrada de Sonhos, mesmo que o alvo não esteja dormindo.",
    exceptionalSuccess:
      "O changeling sente todos os votos quebrados para o qual seu alvo ainda não expiou e pode esculpir seus pesadelos em torno de qualquer (ou uma combinação) deles.",
    page: 149,
  },
  "ctl-2ed:red-revenge": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling levanta as mãos para o céu, chamando todo o ódio e miséria que existe neste mundo miserável. Sua pele se abre enquanto a ira flui nela, e uma aura vermelha de sangue a cerca. Ela ganha +3 para sua Iniciativa, Intimidação e Atributos Físicos",
    exceptionalSuccess: "",
    page: 149,
  },
  "ctl-2ed:relentless-pursuit": {
    action: "Instantânea",
    duration: "Until the sun next passes the horizon",
    success:
      "O changeling cheira o ar, falando o nome do alvo ou uma descrição dele, para seguir o rastro de seus pesadelos. Ela conhece instintivamente a direcção e a distância aproximada do seu alvo. Se ele está noutro reino, ela sabe qual. Se o alvo está usando meios super naturais para evitar perseguidores, este Contrato desencadeia um Confronto de Vontades.",
    exceptionalSuccess: "",
    page: 150,
  },
  "ctl-2ed:thief-of-reason": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Rolar os sucessos alcançados no jogo de invocação como um pool de dados para atacar a Clarity do alvo. Se o alvo sofre danos de Clarity como resultado, ele também perde um ponto de força de vontade do choque psíquico súbito. Se este Contrato visar um não-mutável, o “danos” para o traço equivalente do alvo é temporário e desaparece no final da cena. Lidar com sucesso com os danos da Clarity com o Ladrão da Razão é um ponto de ruptura com um pool de quatro dados.",
    exceptionalSuccess: "O ataque da Clarity ganha mais dados, como acima.",
    page: 150,
  },
  "ctl-2ed:cupid-s-arrow": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling aprende o desejo mais ardente do sujeito, e quaisquer Condições ou Inclinações ligadas a ele. Este desejo pode até mesmo ser um alvo que o alvo desconhece. Ele pode substituir esse desejo por um de sua escolha. A paixão do alvo pelo desejo original, junto com quaisquer Condições ou Inclinações que gerou, volta-se para o novo para a cena.",
    exceptionalSuccess:
      "O changeling conhece instintivamente quaisquer obstáculos entre seu alvo e seu desejo.",
    page: 151,
  },
  "ctl-2ed:dreams-of-the-earth": {
    action: "Disputada",
    duration: "Minutes equal to successes rolled",
    success:
      "Uma brisa suave leva a canção ao alvo do changeling, que deve estar dentro de sua linha de visão. O alvo cai no sono mágico; nada menos que danos letais podem acordá-la. Quando o contrato termina, o alvo continua dormindo normalmente.",
    exceptionalSuccess: "O sono mágico dura toda a cena.",
    page: 151,
  },
  "ctl-2ed:gift-of-warm-breath": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling toca no alvo, que deve estar disposto. Suas mãos emitem um brilho suave, que se espalha para sua pele como seu Manto de Primavera suavemente a atrai em um abraço. O alvo instantaneamente lança todas as penalidades de fadiga, Tilts relacionadas com fadiga e doenças temporárias (como Envenenados ou Envenenados), e golpeando feridas.",
    exceptionalSuccess: "",
    page: 151,
  },
  "ctl-2ed:spring-s-kiss": {
    action: "Instantânea",
    duration: "",
    success:
      "Chuva cai como o changeling deseja dentro (Manto) milhas, qualquer coisa de um chuvisco para um aguaceiro. Isto pode infligir a inclinação da chuva pesada por padrão, e a inclinação inundada por um ponto extra de Glamour.",
    exceptionalSuccess: "",
    page: 151,
  },
  "ctl-2ed:wyrd-faced-stranger": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling fecha os olhos e deixa que os sonhos do alvo o envolvam. Quando abre os olhos, parece-se com quem o alvo mais quiser ver. Ele pode usar este Contrato em um grupo e escolher uma pessoa como o alvo, mas a maior Compostura entre eles op coloca seu rolo. Todos os observadores o vêem como a mesma pessoa. Ele também pode aparecer como alguém que o alvo não conhece, mas deseja ver, como um estranho arrojado. Interação convincente pode exigir um rolo social bem sucedido se o changeling age fora do caráter para a pessoa que ele parece ser. Ele ganha (Manto) dados bônus em tais rolos.",
    exceptionalSuccess: "O engano dura até ao próximo amanhecer.",
    page: 152,
  },
  "ctl-2ed:blessing-of-spring": {
    action: "Instantânea or Disputada; see above",
    duration: "",
    success:
      "O alvo que bebe o cordial amadurece, crescendo meses em meros momentos e olhando como ela faria no auge da primavera. Plantas, incluindo árvores de goblim-fruto, estão em flor, e produzir frutos primavera imediatamente. O Contrato cura pessoas e animais de todas as feridas, e cura quaisquer doenças ou venenos que cessem com o tempo. Alvos metamorfos também derramam uma condição temporária de claridade, curando um ponto de dano de claridade, mas sem ganhar Beats. Estas mudanças duram para a cena, depois que todos os danos e Condições retornam, e frutos de duende não utilizados desaparecem. O alvo torna-se voraz e deve consumir três dias de sustento imediatamente após o término do contrato. Nenhum alvo pode renunciar ao rolo de contestação; magia fae deve superar a realidade teimosa.",
    exceptionalSuccess:
      "O alvo amadurece um ano inteiro. As plantas produzem mais frutos e sementes à medida que aceleram as estações. O contrato regride quaisquer membros perdidos em um animal ou pessoa, e meta meta metamorfos derramam uma tenda de Persis Clarity Condição, curando dois pontos de Clarity danos, mas não ganhando Beats. O Contrato acelera a gravidez de animais e alvos humanos dispostos em 12 meses — o patrono da Primavera recusa-se a promulgar este Contrato em seres humanos grávidas não dispostos. Qualquer descendência, sejam elas sementes ou criaturas, não são afetadas uma vez que se separam do alvo. Como com o sucesso, essas mudanças duram para a cena, embora se um alvo deu à luz dentro da cena, essa mudança é permanente.",
    page: 152,
  },
  "ctl-2ed:gift-of-warm-blood": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Cada sucesso na invocação baixa as notas de uma das feridas do alvo: de agravada para le thal, letal para bater, ou bater para completamente curado.",
    exceptionalSuccess:
      "Todos os pontos remanescentes de danos de bash ng também são curados.",
    page: 152,
  },
  "ctl-2ed:pandora-s-gift": {
    action: "Instantânea",
    duration: "Until the sun next crosses the horizon",
    success:
      "Quando o changeling paga o custo do contrato, o alvo deve tocar uma ferramenta ou material que a mudança de ling usará no crafting, embora possa ser qualquer coisa desde um pincel incidental a um ataque. Se ele usa um poder que nega a necessidade de ferramentas, o alvo deve tocá-lo em seu lugar. Ele então molda os desejos de seu alvo em um objeto usando as regras de Equipamento de Construção (p. 196), começando dentro de uma hora do toque. O changeling talvez não saiba o que está fazendo, mas suas mãos se movem pelo próprio cordão de ar. O item pode ser qualquer coisa da chave para o apartamento de um amante para uma arma capaz de matar um caçador, e permanece até que o sol cruza o horizonte seguinte. Metade do tempo habitual para construir o objecto. Se o changeling usa o item como um suborno ou moeda de troca, ele ganha três dados bônus no rolo social; se bem sucedido, ele recupera um ponto do Glamour gasto neste Contrato.",
    exceptionalSuccess: "",
    page: 152,
  },
  "ctl-2ed:prince-of-ivy": {
    action: "Instantânea",
    duration: "",
    success:
      "Vines disparam para fora do chão onde o changeling cuspiu, e todas as plantas próximas crescem emaranhados semelhantes em uma taxa impossível, para enlaçar seus inimigos. Para a duração do contrato, o caráter pode fazer uma nova tentativa de carga por turno em qualquer alvo dentro de três jardas/metros de uma planta em vez de se mover, além de sua ação instantânea. Ele pode sacrificar sua ação para fazer uma segunda nova tentativa de combate, e sua defesa até sua próxima vez para um terceiro. Seus rolos de grapple contestados para grapples em curso são reflexivos. As plantas usam um pool de dados de 3 + sucessos rolados para invocar este Contrato. O efeito segue o changeling enquanto ele se move.",
    exceptionalSuccess:
      "Cada vez que uma nova curva começa no topo da ordem Iniciativa, as plantas automaticamente infligir um ponto de bater danos em todos os alvos travados.",
    page: 153,
  },
  "ctl-2ed:waking-the-inner-fae": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling apresenta a coroa de flores como um presente para seu alvo, que aceita e a coloca. Ele desaparece imediatamente da vista, mas o alvo ganha a Condição de Wanton. Uma vez por cena para o resto da história atual, sempre que o changeling tenta o alvo a fazer algo, ele recupera um ponto de força de vontade. Ele pode ter apenas um alvo designado de quem ganhar força de vontade de cada vez.",
    exceptionalSuccess:
      "O alvo também ganha a Condição de Obsessão Per sistent em relação ao seu grande desejo atual.",
    page: 153,
  },
  "ctl-2ed:baleful-sense": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling conhece instintivamente a maior ira do alcatrão, e quaisquer Condições ou Inclinações ligadas a ele. O alvo pode estar em negação sobre sua raiva, mas o",
    exceptionalSuccess: "",
    page: 153,
  },
  "ctl-2ed:child-of-the-hearth": {
    action: "Instantânea",
    duration: "",
    success:
      "A pedido do changeling, o calor do sol preenche ou retira-se da área, infligindo o calor ambiental extremo ou extremo frio na área do tamanho de uma grande sala; o changeling é imune aos efeitos de qualquer um deles. Ao mesmo tempo, os raios do sol trazem a própria temperatura do changeling para cima ou para baixo, removendo o calor pessoal extremo ou extremo frio, caso o changeling sofra. Este contrato ainda funciona dentro de casa, à noite, ou em outras circunstâncias quando o sol não é visível — o calor do sol ainda permanece, afinal, e até mesmo essas faíscas desbotadas vêm em auxílio do changeling.",
    exceptionalSuccess: "",
    page: 154,
  },
  "ctl-2ed:helios-light": {
    action: "Instantânea",
    duration: "",
    success:
      "O personagem se declara filho do sol — onde anda, assim vai o corpo celestial. Com isso, uma luz se espalha de seu esterno para envolver seu corpo até que ela seja dolorosa para olhar. A luz ilumina uma área em torno dela com um diâmetro de até (Manto x 20) metros, e qualquer um olhando diretamente para ela ganha o Blinded Tilt (ambos os olhos). A luz é verdadeira luz solar, mas canalizá-la através de um corpo de carne diminui parte do seu poder: as criaturas lesadas pela luz solar levam metade do dano que normalmente fariam, arredondadas.",
    exceptionalSuccess: "",
    page: 154,
  },
  "ctl-2ed:high-summer-s-zeal": {
    action: "Reflexiva and Disputada",
    duration: "",
    success:
      "Sempre que um inimigo tenta fugir de um conflito violento uma vez que já começou, o changeling pode invocar este Contrato para forçar esse inimigo a gastar uma força de vontade primeiro; outro sábio, o alvo deve continuar a se opor a ela até que se torne impossível. Ele ainda pode recuar para fazer ataques variados ou similares, mas não pode tomar quaisquer ações que não suportam tentar ganhar. Ele não pode sofrer o Vencido Down Tilt para a duração.",
    exceptionalSuccess:
      "O alvo não pode recuar mesmo para fazer ataques variados, e deve permanecer a menos de cinco metros do changeling.",
    page: 155,
  },
  "ctl-2ed:vigilance-of-ares": {
    action: "Reflexiva",
    duration: "",
    success:
      "O changeling jurou a Sum Mer, e a sua batalha implacável contra o Gentry. Ela espera violência em cada turno, detectando emboscadas, armadilhas escondidas e ataques surpresa. Ela ganha um bônus para Iniciativa igual à sua classificação Manto.",
    exceptionalSuccess: "",
    page: 155,
  },
  "ctl-2ed:fiery-tongue": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O poder da repreensão do changeling inflige seus sucessos rolados como pontos de golpear danos, ou letais contra seres faes. Também remove duas Portas em Manobras Sociais, mas piora a impressão do alvo do personagem para hostilizar imediatamente.",
    exceptionalSuccess:
      "Em vez disso, a repreensão do changeling causa danos letais, ou agravados aos seres fae.",
    page: 155,
  },
  "ctl-2ed:flames-of-summer": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling parece crescer em estatura e ira, e acrescenta dois dados bônus a todos os rolos físicos para a duração. Ela também ignora as penalidades da ferida, e não precisa rolar Stamina para permanecer consciente se sua última caixa de saúde enche de danos.",
    exceptionalSuccess:
      "Chamas cercam a mudança, dando-lhe ataques desarmados um modificador de armas + 1L adicional.",
    page: 155,
  },
  "ctl-2ed:helios-judgment": {
    action: "Instantânea",
    duration: "",
    success:
      "O feixe de sol funciona como uma arma lançada com as seguintes características: Danos (Manto)L, Gamas 10/30/50 jardas/metros, Pena Iniciativa -2, Força mínima 2, Tamanho 4. Se o jogador também gasta um ponto de força de vontade, o dano é agravado. O feixe retorna para sua mão no início de cada turno para a duração do Contrato, e é verdadeira luz do sol em todos os sentidos.",
    exceptionalSuccess:
      "O feixe também inflige o Knocked Down Tilt em um sucesso.",
    page: 155,
  },
  "ctl-2ed:solstice-revelation": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling inunda uma área à sua volta com um raio de 30 metros com luz. Qualquer operador de char atualmente escondido ou disfarçado através de meios mundanos deve ter sucesso em uma manipulação + Fado rolar com uma penalidade de dados igual ao Manto do changeling, ou perder sua ofuscação. Novas tentativas de esconder são possíveis sob a luz brilhante. Criaturas usando poderes super naturais para esconder um confronto de vontades com o changeling. Mesmo a Máscara enfraquece, e qualquer um pode fazer um rolo de percepção com Raciocínio + Autocontrole para ver através dele.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:sunburnt-heart": {
    action: "Disputada",
    duration: "",
    success:
      "Influencie a Condição de Berserk sobre o inimigo, e ganhe (o Manto do changeling) dados bônus para qualquer tentativa de direcionar sua fúria para um alvo diferente do changeling.",
    exceptionalSuccess:
      "O changeling também pode afetar um segundo alvo; cada alvo contesta o rolo de invocação separadamente.",
    page: 156,
  },
  "ctl-2ed:autumn-s-fury": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling expira, e expira, até que uma tempestade se forma a partir de sua respiração que inflige a Chuva Pesada e Vento Pesado Tilts, para 2 Glamour. Para um ponto extra de Glamour, a tempestade também atinge inimigos com relâmpagos; o jogador do changeling reflexivamente rola Presença + Oculto - Defesa como um ataque contra qualquer pessoa (além do próprio changeling) capturado na área no início de cada uma de suas voltas. Estes ataques têm um modificador de armas de 1L. O changeling pode afetar uma área de até (Manto x 20) jardas/metros. Parado no olho da tempestade, ele mesmo não sofre efeitos nocivos, e ela se move como ele.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:last-harvest": {
    action: "Instantânea",
    duration: "One harvesting attempt",
    success:
      "O personagem sussurra para um alvo suavemente, contando-lhe segredos que ouviu do vento de outono. Ele ganha a 9-nova qualidade em seu próximo rolo para har colete Glamour desse alvo, ou 8-de novo se ele ressoa com sua corte. Ele só pode usar este Contrato uma vez por capítulo.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:tale-of-the-baba-yaga": {
    action: "Disputada",
    duration: "",
    success:
      "Fazendo contato visual com seu público, o changeling inflige a condição abalada em um, alguns, ou todos, à sua escolha.",
    exceptionalSuccess:
      "Qualquer pessoa afetada por este tratado Con também deve gastar um ponto de força de vontade para agir contra o changeling durante a duração.",
    page: 157,
  },
  "ctl-2ed:twilight-s-harbinger": {
    action: "Instantânea",
    duration:
      "Until the lunar month ends, or the ending comes to pass, whichever comes first",
    success:
      "O personagem escolhe uma circunstância ou evento atualmente existente quando invoca o Contrato, como outro poder sobrenatural, um encontro, um caso, ou até mesmo uma vida. 13 minutos antes que a circunstância ou evento escolhido termina, ou três voltas em uma cena de ação, uma criatura de presságios visita o changeling não importa onde ela está no momento para avisá-la. Pode ser um gato preto ou um cão de caça, um morcego, um corvo, uma coruja, ou qualquer outro animal que a cultura do changeling considere sinistro.",
    exceptionalSuccess: "",
    page: 157,
  },
  "ctl-2ed:witches-intuition": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling aprende o grande est medo do sujeito, e quaisquer condições ou inclinações ligadas a ele. Este medo pode até ser subconsciente. O changeling pode optar por substituir esse medo por um de sua escolha. O medo do alvo do assunto original, junto com quaisquer Condições ou Inclinações que engendrava, volta-se para o novo para a cena.",
    exceptionalSuccess:
      "O contrato revela as provas que causaram o medo, e o que o agravaria ou diminuiria.",
    page: 157,
  },
  "ctl-2ed:famine-s-bulwark": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Para cada sucesso no rolo de invocação, o jogador pode fazer ao contador de histórias uma pergunta sim-ou-não sobre a situação atual e receber respostas verdadeiras para todos, exceto um deles – uma resposta é sempre falsa, a menos que ele só role um sucesso.",
    exceptionalSuccess:
      "Todas as respostas são verdadeiras. Além disso, o changeling também capta o caminho para o fenômeno ou ser sobrenatural não-fae mais próximo. Ele não sabe sua localização, mas seus instintos o levam até lá, desde que ele faça a viagem dentro da mesma cena que ele invocou o Contrato.",
    page: 157,
  },
  "ctl-2ed:mien-of-the-baba-yaga": {
    action: "Disputada",
    duration: "",
    success:
      "Quando o changeling entra na linha de visão do alvo, ela o vê como seu maior medo. Ela instantaneamente ganha a Condição Assustada, e deve gastar um ponto de força de vontade para tomar qualquer ação que exija dados para a duração. Os alvos metamorfos podem sofrer um ataque à sua clareza, à discrição dos seus jogadores (ou do contador de histórias), dependendo do medo evocado. O changeling talvez deixe que os observadores também o vejam como o maior medo do alvo, e eles reagem de acordo.",
    exceptionalSuccess:
      "O alvo também ganha o Immobilized Tilt para uma série de voltas iguais ao Manto do changeling.",
    page: 158,
  },
  "ctl-2ed:riding-the-falling-leaves": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling se transforma em um spray de folhas de outono em todas as cores da terra e do fogo. Ele é uma única entidade, e resistente à dispersão. Ele pode Dodge reflexivamente uma vez por turno, exceto contra ataques que poderiam razoavelmente prejudicar uma pilha de folhas, tais como chamas ou ventos sobrenaturais. Se ele com sucesso Dodges um ataque desta forma, ele pode gastar outro ponto de Glamour para infligir a Condição Assustada em seu oponente. Ele pode voar em sua velocidade habitual −3, e pode achatar seu corpo para escapar através de pequenas aberturas. Ele não pode manipular objetos ou atacar fisicamente.",
    exceptionalSuccess:
      "O personagem pode voar em sua velocidade total. Ele também pode “pegar” e levar através do ar uma série de objetos iguais ao seu Manto, cada um não maior do que Tamanho 1.",
    page: 158,
  },
  "ctl-2ed:sorcerer-s-rebuke": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O alvo perde pontos de Glamour ou outra fonte de energia sobrenatural igual a sucessos rolados para invocar este Contrato.",
    exceptionalSuccess:
      "O changeling também inflige a Condição de Cowed ao alvo em relação a si mesmo.",
    page: 158,
  },
  "ctl-2ed:tasting-the-harvest": {
    action: "Instantânea",
    duration: "",
    success:
      "Os alvos tornam-se imunes ao medo natural, e ganhar a classificação Manto do changeling em dados bônus para contestar efeitos de medo sobrenatural. Ele pode dirigir sua nova coragem contra uma coisa que os assustaria, e conceder-lhes um bônus morrer em ações contra esse alvo.",
    exceptionalSuccess:
      "As metas alcançam um sucesso excepcional em três sucessos em vez de cinco quando contestam os efeitos sobrenaturais do medo. Seus ataques, como dirigido pelo changeling, aumentam seus modificadores de armas habituais em um.",
    page: 158,
  },
  "ctl-2ed:the-dragon-knows": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling pode saborear a tristeza do alvo e aprende o seu mais profundo arrependimento, e quaisquer Condições ou Inclinações ligadas a ele. Este arrependimento pode até ser subconsciente ou esquecido. O changeling pode substituir o assunto do arrependimento por um de sua escolha. A tristeza do alvo pela perda original, junto com quaisquer Condições ou Inclinações que engendrou, volta-se para o novo assunto para a cena.",
    exceptionalSuccess:
      "Ganhe um bônus de dois-die para qualquer rolo social que você faz para quebrar as esperanças do alvo para a duração do contrato.",
    page: 159,
  },
  "ctl-2ed:heart-of-ice": {
    action: "Reflexiva",
    duration: "",
    success:
      "A pele do changeling assume uma cor azul pálida, irradiando do peito até parecer congelada. Ela se torna imune a todos os efeitos e expressões de frio, todas as Tilts ambientais, exceto aqueles baseados no calor, e danos que consiste apenas de gelo ou frio, sem outro componente físico. Este contrato afeta tanto o frio mundano e sobrenatural. O coração do changeling é literalmente congelado durante a duração, tornando - a imune a ataques que visam especificamente o coração (p. 184) também. Ela não pode ganhar quaisquer condições emocionais, tais como medo, inspiração, Steadfast, ou Swooned.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:ice-queen-s-call": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling chama fantasmas de Sebe de inverno, fragmentos de frio e almas congeladas em invernos eternos, e cospe no chão. Sua saliva imediatamente congela, estar chegando o centro de um ponto frio que cresce em tamanho até que uma área para (Manto x 20) metros sofre o Bliz zard Tilt. O changeling é imune aos efeitos. Sussurros murmúrios e indecifráveis soam através do ar enquanto este Contrato está em vigor.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:slipknot-dreams": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling acalma os arrependimentos de seu alvo, embora não a memória de sua fonte. O alvo ainda sabe que o casamento falhou, mas agora acredita que foi para melhor. O alvo ganha a Condição Swooned com respeito ao changeling.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:touch-of-winter": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling toca a superfície de um corpo de água com a mão. A geada se espalha das pontas dos dedos, congelando uma área com um diâmetro de cinco metros/metros irradiando do changeling. O efeito continua se espalhando, adicionando mais cinco jardas/metros de diâmetro para a área congelada em cada turno, desde que a mudança mantenha contato. A superfície congelada pode suportar um número de pessoas iguais ao Manto do changeling enquanto cruzam. O gelo começa a derreter naturalmente quando o contrato termina.",
    exceptionalSuccess:
      "O personagem pode devolver o líquido congelado à sua forma original a qualquer momento, ou impor o Ice Tilt a qualquer momento, o que não a afeta.",
    page: 160,
  },
  "ctl-2ed:ermine-s-winter-coat": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling se mistura com o que está perto, tornando - se difícil de ver claramente. Ela ganha +3 para rolos Stealth e inflige um -3 em ataques contra ela. Enquanto ela está na companhia de pelo menos alguns seres não-fae, ela metade de sua classificação Fado (rounded down) para fins do bônus outros seres fae ganhar para localizá-la ou encontrá-la, e ganha +3 para Clashes",
    exceptionalSuccess: "",
    page: 160,
  },
  "ctl-2ed:fallow-fields": {
    action: "Disputada",
    duration: "Days equal to the changeling’s Mantle",
    success:
      "O alvo subitamente não consegue lembrar como é o amor. Ele se torna incapaz de recuperar a força de vontade através de sua virtude ou vício (ou traços equivalentes), e ganha a condição quebrada.",
    exceptionalSuccess:
      "O alvo sente a perda novamente em um momento da escolha do changeling, dentro da mesma história, recuperar a condição quebrada em uma palavra falada dela.",
    page: 161,
  },
  "ctl-2ed:field-of-regret": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling direciona os fantasmas para qualquer alvo que possa ver. Os mortos atacam os vivos passando por eles, infectando-os com solidão insuportável e infligindo os sucessos do rolo de invocação como pontos de dano letal. Cada alvo também perde um ponto de força de vontade.",
    exceptionalSuccess: "Em vez disso, os alvos perdem dois pontos.",
    page: 161,
  },
  "ctl-2ed:mantle-of-frost": {
    action: "Instantânea Roll Results",
    duration: "",
    success:
      "Os lábios do changeling ficam azuis à medida que a geada se forma em seu cabelo. Seu corpo irradia frio, sugando todo o calor do ar e infligindo uma área com um diâmetro de 20 metros, centrada em torno dela, com uma versão flash-congelante do Extreme Cold Tilt. As pessoas dentro da área recebem uma penalidade imediata −1 morrer para todos os rolos, que aumenta em um acumulado −1 cada turno subsequente. Uma vez que um alvo sofre um −5 pen alty, ele começa a tomar um ponto de dano letal cada volta. A penalidade desaparece quando uma pessoa sai da aura, mas retorna com toda a força atual se ele retornar. O efeito se move com o changeling, e ela mesma é imune a ele. Quem sofrer mais danos deste contrato do que a sua resistência ganha o Tilt imobilizado, envolto em gelo.",
    exceptionalSuccess: "",
    page: 161,
  },
  "ctl-2ed:winter-s-curse": {
    action: "Disputada",
    duration: "",
    success:
      "O coração do alvo está congelado. Ele não pode participar em ações de trabalho em equipe, gastar força de vontade, ganhar poder de vontade através de seu Thread ou Virtude (ou âncora equivalente), ou sofrer pontos de ruptura. Ele não se importa com seus aliados ou suas Aspirações, abandonando-os imediatamente. Todas as impressões são médias para fins de manobra social contra ele, e não pode ser mudado; poderes sobrenaturais que fariam isso levar a um confronto de vontades. A exceção é a própria metamorfoia, que pode melhorar sua impressão das maneiras habituais e ganha dados bônus iguais ao seu Manto em rolos sociais contra ele. Se o alvo sofresse um ponto de ruptura durante a duração do Contrato, isso o alcançaria depois.",
    exceptionalSuccess:
      "O changeling também pode escolher um outro personagem presente na cena, mudando sua impressão com o alvo para Hostil e infligindo uma penalidade igual à sua classificação Manto em rolos sociais desse personagem contra o alvo.",
    page: 161,
  },
  "ctl-kith-kin:filling-the-cup": {
    action: "Instantânea",
    duration:
      "One Cena or until the changeling regains any Glamour, whichever comes first",
    success:
      "O changeling pode identificar as pessoas experimentando emoções poderosas dentro de um raio de (seu Fado x 40) metros. Ele sabe a direção e a distância geral da emoção no momento do uso do Contrato, mas essas pessoas podem se mover quando ele chegar lá. Ele ganha um sentido vago para se qualquer emoção que ele detecta é positiva ou negativa, mas de outra forma não pode identificá-lo sem procurar essas pessoas para fora ou usando magia adicional. Se alguém incita Bedlam dentro do alcance enquanto este trato Con está em vigor, o changeling pode identificá-lo automaticamente como tal, embora sem detalhes adicionais.",
    exceptionalSuccess: "",
    page: 35,
  },
  "ctl-kith-kin:sleep-s-sweet-embrace": {
    action: "Instantânea or resisted (see below)",
    duration: "Varies (see below)",
    success:
      "Uma vez que o changeling invoca este Contrato, sempre que o alvo dorme por um número de dias igual a sucessos no rolo de invocação, eles não sonham. Em vez disso, eles curam um dano letal por hora que eles estão dormindo, mas eles não podem recuperar a força de vontade do descanso para a duração do contrato. Sem sonhos, não têm bastião e não podem ser alvo de oneiromancia ou de outra magia que trabalha com sonhos ou sonhadores. Se este Contrato durar mais de dois dias, o alvo sofre a Condição de dissociação (Changeling, p. 336), que não pode resolver até que recuperem a Vontade plena após o término do Contrato. Este contrato só é resistido se o alvo não estiver disposto. O changeling pode atingir a si mesmo, mas se o fizer, não pode acabar com os efeitos cedo.",
    exceptionalSuccess:
      "Além da duração mais longa, o alvo sofre dissociação se os efeitos durarem mais de três dias em vez de dois.",
    page: 36,
  },
  "ctl-kith-kin:curse-s-cure": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Qualquer um que beber um copo cheio da corrente de água da mudança ou cura de um veneno em metade do tempo normal, ou, se o veneno foi mortal, o personagem vai agora sobreviver. As condições resultantes do veneno desaparecem sem re-solução. Tentar curar um veneno sobrenatural leva a um Confronto de Vontades. Cada invocação deste Contrato produz um tidote suficiente para uma única vítima envenenada, independentemente da quantidade de líquido no copo.",
    exceptionalSuccess: "O veneno é totalmente e instantaneamente curado.",
    page: 37,
  },
  "ctl-kith-kin:dreamer-s-phalanx": {
    action: "Instantânea",
    duration: "One Capítulo or until all dreamers wake, whichever comes first",
    success:
      "O changeling conecta as bases de todos os sonhadores participantes, atraindo-os todos para um sonho compartilhado. Ele mesmo deve ser participante, e todos os sonhadores devem estar dispostos. Cada sonhador conserva o seu próprio Bastion distinto com uma entrada e saída separadas, mas os sonhadores tratam-nos como um único Bastion para fins de oneiromancia e navegação do sonho lúcido partilhado. Aumentar a fortificação de cada bastião em 1 por sonhador, até um máximo de +5, contra qualquer oneiropomp fora do grupo ligado. Sempre que um sonhador toma uma ação que se beneficia do trabalho em equipe com pelo menos um dos outros como um oneiropomp em qualquer um de seus Bastions, essa ação ganha a qualidade de 8 novamente. Mudanças que causam mudanças de localização podem transportar qualquer um afetado de um Bastion para outro, além de mudar sua localização física. Este Contrato conta como um convite de cada sonhador um ao outro para entrar seus Bastions de fora. Se algum dos sonhadores sofre a condição de Comatose ou perdeu a capacidade de sonhar lúcidamente, mudanças de paradigma podem infligir condições de mudança em qualquer um de seus Bastions, mesmo que o oneiropomp desse Bastion ainda seja sonho lúcido. Se algum participante acorda naturalmente, seu Bastion simplesmente deixa de existir sem nenhum impacto sobre os outros além de reduzir o número de sonhadores conectados (e, portanto, potencialmente seus bônus de Fortificação). No entanto, se um sonhador é forçado e magicamente despertado, seja por um oneiropomp com a condição de formiga do sonho Assail ou por algum outro poder, todas as suas bases compartilhadas são destruídas, forçando aqueles que ainda dormem a enfrentar o fim de seu Bastion segundo as regras de p. 222 do Changeling.",
    exceptionalSuccess: "",
    page: 37,
  },
  "ctl-kith-kin:closing-death-s-door": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Este contrato visa o cadáver de qualquer personagem anteriormente vivo que tenha morrido dentro de um capítulo da cena em que o changeling o invoca. Esse personagem volta à vida com todas as caixas de saúde cheias de danos agravados, excepto a mais direita, que está intacta. Em troca deste milagre fae, o changeling ganha um número de pontos de dívida Goblin igual ao número de horas que o personagem revivido foi morto. Ele ganha um mínimo de 1 ponto e não pode ganhar mais do que o seu máximo habitual; ele pode transformar-se em um Sebe Denizen se sua dívida total deste Contrato é maior do que 9 pontos.",
    exceptionalSuccess:
      "O Contrato pode reviver alguém que morreu a qualquer momento dentro da história atual em vez de capítulo; isso significa que se o changeling invoca-lo e não alcançar um sucesso excepcional, o Contrato falha.",
    page: 37,
  },
  "ctl-kith-kin:feast-of-plenty": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling convoca algo nour ishing ou medicinal fora do ar: alimento garantido para ser alguém no favorito da cena, água doce, vinho para aliviar os problemas, aspirina para tirar uma dor de cabeça, salvas curativas para aliviar a dor de um ferimento, ou qualquer outra coisa apropriada para quaisquer doenças que possam ter perto. A quantidade convocada é sempre suficiente para todos os presentes quando o Contrato produz efeito. Qualquer um que optar por participar nestes confortos pode remover uma condição física, não persistente que eles sofrem atualmente, que desaparece sem resolução, ou remover um Tilt físico, pessoal. Eles também recuperar força de vontade igual a metade dos sucessos invocação rolou, arredondar. O próprio changeling não ganha benefícios de participar em sua festa. Todo aquele que beneficia deste Contrato também sofre a Condição Indebted (acima) em relação ao changeling. Forçando-os a ingerir a festa falha automaticamente.",
    exceptionalSuccess: "A Condição Endividida torna-se Persistente.",
    page: 38,
  },
  "ctl-kith-kin:still-waters-run-deep": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O alvo suprime uma série de Condições emocionais que os afetam atualmente iguais aos sucessos rolados no rolo de invocação deste Contrato; o changeling pode se direcionar se ele puder ver seu próprio rosto, como em um espelho. Condições elegíveis incluem Condições de clareza e condições resultantes de Bedlam. O Contrato anula os efeitos das Condições suprimidas para a cena; o alvo não pode resolver ou ganhar Bates deles. Eles não podem assumir quaisquer novas condições emocionais para a duração; poderes que infligem ou lhes concedem simplesmente falham. Enquanto este Contrato está em vigor, o alvo não pode realizar Sebespinning ou sonhoweaving, incitar Bedlam, ou colher Glamour de seres vivos (mas eles podem colhe-lo).",
    exceptionalSuccess: "Sucessos adicionais são sua própria recompensa.",
    page: 39,
  },
  "ctl-kith-kin:poison-the-well": {
    action: "Disputada",
    duration: "One Capítulo",
    success:
      "O changeling corrompe as conecções do seu alvo com um dos seus mundanos Méritos Sociais, retirando-lhe o acesso durante a vigência do contrato. O assunto do Mérito, como os Aliados, Contatos ou Mentor do alvo, volta-se contra ela, tentando impedi-la ativamente. Essas conexões talvez acreditem que ela os traiu, se envolveu em algo desagradável, ou os insultou gravemente — ou talvez simplesmente decidiram não gostar do corte de seu zíb. Se o changeling estiver na Sede, ele também pode visar qualquer Mérito específico para changeling que represente conexões com um ser fae, locais de Sede ou outros recursos. Se o fizer, o uso deste Contrato conta como uma ação de Sebespinning, mas não sofre as penalidades habituais para o rolo de invocação. Ex amplos merits elegíveis incluem Fae Mount, Goblin Bounty, Hob Kin, Hollow, e Stable Trod; outros podem qualificar-se a critério do contador de histórias. Esses Méritos são afetados de forma diferente dos mundanos: o alvo ainda pode usá-los, mas ela acumula pontos de dívida Goblin iguais à classificação de pontos do Mérito por uso.",
    exceptionalSuccess:
      "Além dos efeitos habituais, o alvo sofre a Condição de Notoriedade.",
    page: 39,
  },
  "ctl-kith-kin:shared-cup": {
    action: "Instantânea or Disputada; see below",
    duration: "One Capítulo",
    success:
      "O changeling liga todos os participantes até um máximo de sucessos no rolo de invocação; o próprio changeling deve participar. Os participantes involuntários ainda devem participar na bebida ou refeição compartilhadas, mas não precisam necessariamente saber sobre as consequências e podem con teste o rolo de invocação como acima. Este Contrato aumenta os estados emocionais dos participantes e os une. Suas impressões uns dos outros para fins de manobra social melhoram por um passo, e cada participante sofre um -3 para rolar para contestar ações sociais tomadas contra eles por outros participantes. Cada participante capaz de Sebespinning e incitar Bedlam atinge sucesso ex-cepcional em três sucessos para essas ações. Enquanto ligados, todos os participantes sentem os estados emocionais uns dos outros, e reagem a estímulos emocionais como se todos os experimentassem simultaneamente. Se um participante ganha uma Condição emocional ou pessoal Tilt, todos ganham; cada participante deve resolver essas Condições separadamente. Se um recupera a força de vontade, todos eles recuperam a mesma quantidade; se um recupera Glamour, todos os participantes com um traço Fado recuperar a quantidade completa. Os participantes sem Fado ganham a Dição Inspirada em vez de Glamour; esta Condição não é compartilhada.",
    exceptionalSuccess:
      "Sucessos adicionais aumentam o número máximo de participantes.",
    page: 39,
  },
  "ctl-kith-kin:book-of-black-and-red": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling aprende as cinco dívidas mais significativas e obrigações juramentadas de um alvo que pode ver. Estes títulos podem ser mundanos ou mágicos; ela pode saber dos empréstimos pesados do lojista do banco, ou o juramento motley que um dos Lost jurou. Ela também aprende quantos pontos de dívida Goblin o alvo tem, se houver. O que conta como significativo depende um pouco do alvo. Um homem que é sobrecarregado por $50 do banco, mas sabe que ele pode pagá-lo rapidamente não o considera significativo. Se, por outro lado, ele deve que $50 a Big Jim, notori oous para ficar muito chateado por até relativamente pequenas somas de dívida não paga e propenso a receber o pagamento de tipos relutantes na forma de suas rótulas quebradas, é provavelmente um assunto bastante urgente para ele, mesmo que não é muito dinheiro no grande esquema de coisas. Quanto maior o montante e/ou o valor mais pessoal que a mercadoria paga tem, maior a probabilidade de ser contabilizada como significativa, mesmo que o objectivo tenha um controlo sobre o reembolso; este Contrato dete a maioria das hipotecas, por exemplo. Dívidas de tipo fae são sempre significativas. Se o changeling explora o conhecimento dessas dívidas ou obrigações para influenciar o alvo ou liquidar essas dívidas durante o mesmo capítulo, ela ganha +2 para o seu pool de dados e o alvo ganha a Condição Leveraged em relação ao changeling.",
    exceptionalSuccess:
      "O changeling também capta os detalhes de dívidas significativas, como a quem elas são devidas, por que o alvo as assumiu em primeiro lugar, e o que impede o reembolso.",
    page: 40,
  },
  "ctl-kith-kin:give-and-take": {
    action: "Instantânea",
    duration: "Instantânea, or one Cena for Merits",
    success:
      "O jogador do changeling escolhe uma série de pontos até metade do Fado do changeling de uma categoria de Glamour, Willpower, moeda social (ver p. XX), ou pontos em um Mérito específico, em escala pessoal, e oferece para trocá-los com um alvo para uma quantidade igual de outra categoria que possuem. Por exemplo, o changeling pode trocar três pontos de seu próprio Glamour por três pontos da Vontade do alvo ou seu Mérito de Sentido Comum de três pontos. Se o destinatário estiver disposto, a troca ocorre imediatamente. Os Méritos Trocados duram até o final da cena, durante o qual o proprietário original não pode acessar seus benefícios; o destinatário deve atender todos os pré-requisitos para o Mérito. Este Contrato não tem efeito se o alvo não consentir com a transação, embora um pouco de regatear para chegar lá seja bom. Nenhuma das partes pode trocar Merits que afetem o mundo inteiro além deles; o changeling não pode trocar por Recursos ou Aliados, por exemplo, mas ela poderia trocar por Reflexos Rápidos. Uma vez que o Contrato não permite uma troca dentro da mesma categoria, ela também não pode trocar um Mérito por outro.",
    exceptionalSuccess: "",
    page: 41,
  },
  "ctl-kith-kin:beggar-knight": {
    action: "Instantânea",
    duration: "One Capítulo per success",
    success:
      "O changeling amaldiçoa uma vítima que consegue ouvir e compreender as suas palavras. A vítima sofre vários efeitos: • Ele não ganha nenhum bônus de equipamento, bônus de dano, ou rating ar mor de qualquer peça de equipamento físico que ele mesmo não fez, e falhas com tais itens automaticamente se tornam falhas dramáticas sem premiar uma Beats. • Ele perde o acesso a quaisquer pontos de Recursos que não criou literalmente — um troço de moedas que ele mesmo cunhava, por exemplo. Ele descobre suas contas bancárias suspensas e cartões de crédito esgotados. As pessoas se recusam a aceitar seus cheques, temendo falsificação, ou o Fado de outra forma conspira para tornar sua riqueza inútil. Os recursos voltam assim que a maldição acaba. • Seus pools de dados não podem se beneficiar do trabalho em equipe dos outros (embora ele ainda possa emprestar trabalho em equipe a outro ator primário).",
    exceptionalSuccess:
      "O jogador do changeling também pode rolar seus sucessos no rolo de invocação deste Contrato como um ataque imediato Clarity contra a vítima. Se ele não tem Clarity, seu jogador lança um ponto de ruptura com uma penalidade de dados igual ao sucesso da invocação em vez disso.",
    page: 41,
  },
  "ctl-kith-kin:coin-mark": {
    action: "Instantânea",
    duration: "One story",
    success:
      "O changeling encanta o alvo. Em seguida, ela conhece a sua localização e seus próprios sentidos sempre que a sua propriedade muda de mãos, voluntariamente ou não; ela aprende a identidade do novo proprietário e que preço a transação envolvida (se houver). Se ela interagir com o proprietário atual do objeto em uma cena – não necessariamente pessoalmente; uma chamada telefônica ou um bate-papo online farão – ela pode gastar um ponto adicional de Glamour para agitar o poder materialista da cadeia de transação e infligir a Condição de Avarice sobre eles.",
    exceptionalSuccess: "",
    page: 42,
  },
  "ctl-kith-kin:blood-debt": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Sempre que outro caráter inflige um ou mais pontos de dano letal ou agravado na mudança de lei, ou um ou mais pontos de idade leve ou grave da barragem de Clarity, o infrator sofre um único ponto de dano letal em resposta. Este dano não interage com a armadura; simplesmente aparece sobre a vítima. Rasgos abertos em sua carne, sangue escorre de seus orifícios, ou convulsões espasmos através deles. A quantidade de danos letais infligidos aumenta em um ponto para cada um dos seguintes: • O ataque também fez o changeling perder (não gastar) um ou mais pontos de força de vontade. • O ataque também fez o changeling perder (não gastar) um ou mais pontos de Glamour. • O ataque também infligiu uma condição ou inclinação no changeling.",
    exceptionalSuccess: "",
    page: 43,
  },
  "ctl-kith-kin:exchange-of-gilded-contracts": {
    action: "Instantânea",
    duration: "Up to one Capítulo",
    success:
      "O changeling concorda com uma troca com outro dos Perdidos, onde ela toma emprestado um dos contratos comuns que eles conhecem. Se o alvo consentir, o changeling ganha acesso ao Contrato como se ela mesmo o tivesse aprendido, embora ela apenas ganhe qualquer bônus aparente a que naturalmente tenha acesso e não ganhe nenhum adicional que o alvo tenha aprendido com a Devoção da Pupila. Ela também não pode acessar o Loophole do contrato; Loopholes trabalham convencendo brevemente o Fado o changeling inerentemente tem o direito de exercer esse poder, mas tal disfarce é impossível de arrancar com apenas acesso em terceira mão ao contrato. Entretanto, o alvo perde o acesso ao contrato trocado. A troca de Contratos Gilded passa para o alvo, embora não possam usá-lo para criar uma nova troca de Contratos. Em vez disso, o alvo escolhe quando terminar a troca, esta ação reflexiva imediatamente retorna seu Contrato original para eles e passa a capacidade de usar Troca de Contratos Gilded de volta para o changeling original por sua vez.",
    exceptionalSuccess: "",
    page: 43,
  },
  "ctl-kith-kin:golden-promise": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling reduz a disponibilidade de um único serviço que ela deseja obter através de sucessos de ativação. O serviço ainda deve estar disponível na situação atual e ela não precisa fornecer qualquer recompensa além da disponibilidade reduzida para a transação. O Fado cerca-a com uma aura de riqueza, os vendedores sentem-se compensados por apenas estar de pé",
    exceptionalSuccess: "",
    page: 43,
  },
  "ctl-kith-kin:grand-revel-of-the-harvest": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "A presença do changeling aumenta todos os prazeres e sensações mundiais na cena. O alimento mais brando parece maduro com sabores intrigantes; canto e companhia enchem o coração; pagamento ou presentes sentem-se ainda mais gratificantes; a intensidade do toque e da textura emocionam os nervos e a mente. Para o resto da cena, qualquer pessoa que não seja o changeling que deliberadamente se engaje em festa ou celebração de qualquer tipo que este Contrato afetaria requer apenas três sucessos em rolos sociais para alcançar um sucesso excepcional, e sua atitude melhora por um passo para fins de manobra social. Personagens afetados recebem maiores recompensas de seus ganhos e prosperidade até o fim do Contrato. Sempre que eles iriam recuperar a força de vontade, eles ganham um ponto adicional, ao seu máximo habitual. Sempre que curavam a saúde ou os danos à clareza, curavam um ponto adicional do mesmo tipo de dano. Se eles ganharem um ganho de dinheiro ou riqueza, eles ganham um bônus +1 para o seu equipamento bônus para adquiri-lo.",
    exceptionalSuccess: "",
    page: 44,
  },
  "ctl-kith-kin:thirty-pieces": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      'O changeling planta uma semente de traição dentro da mente de um único alvo que consegue ver. Ela escolhe uma única ação que constitui uma traição aos aliados, amigos ou causa do alvo, como revelar informações condenatórias ou atacá-los diretamente. Isso pode acontecer imediatamente ou confiar em um gatilho específico que ocorre antes do fim da história atual (como "tiro meu aliado quando eles pegarem esta caixa"). O alvo toma a ação especificada quando apropriado, ganhando a Condição Culpada posteriormente. Esse poder não pode compelir atos não-traiçoeiros, nem pode causar o alvo a se prejudicar diretamente. Um caractere só pode estar sob os efeitos de uma invocação de Trinta Peças de cada vez; usando o Contrato em um alvo que ainda tem que atender ao gatilho de uma instância existente substitui-lo.',
    exceptionalSuccess:
      "O alvo também ganha a Condição de Fuga após cometer a traição.",
    page: 45,
  },
  "ctl-kith-kin:burning-ambition": {
    action: "Instantânea",
    duration: "Until fulfillment of the Aspiration",
    success:
      "O changeling ganha uma aspiração adicional que age como desejo de um Fae Verdadeiro (Changeling, p. 269). Deve refletir tudo o que — ou quem quer que — o changeling mais deseja não já coberto por uma de suas Aspirações atuais. Quando ela cumpre o desejo, ela reabastece pontos de força de vontade igual a metade de seu Fado, bem como uma Beats, mas ganha a Condição Competitiva.",
    exceptionalSuccess: "",
    page: 45,
  },
  "ctl-kith-kin:jealous-vengeance": {
    action: "Disputada",
    duration: "One Capítulo",
    success:
      "O changeling apresenta-lhe uma escolha: afastar-se definitivamente de qualquer posição ou situação que os coloque no caminho do changeling, tais como abandonar um emprego ou romper com um parceiro, ou sofrer as consequências. Se o alvo não faz tudo ao seu alcance para obedecer no próximo capítulo, eles sofrem uma das seguintes Condições da escolha do changeling: Cego (temporário),",
    exceptionalSuccess: "",
    page: 45,
  },
  "ctl-kith-kin:litany-of-rivals": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling nomeia uma das suas próprias rações Aspi enquanto invoca este Contrato. Cada sucesso no rolo de invocação concede ao changeling uma das seguintes informações sobre a pessoa mais imediata ou ameaçadora que poderia, pretende, ou já está em seu caminho para cumprir essa aspiração que ela já não tem assim: • Seu nome • Uma imagem do seu rosto • A sua localização actual • Uma das suas fragilidades ou outras fraquezas, quer sejam físicas, mentais, sociais ou circunstanciais • O nome ou rosto de um dos seus aliados mais próximos O jogador do changeling pode fazer cada pergunta uma de cada vez para que ela possa decidir se deve pedir informações adicionais sobre essa pessoa ou fazer uma pergunta sobre uma pessoa diferente.",
    exceptionalSuccess: "Sucessos adicionais são sua própria recompensa.",
    page: 46,
  },
  "ctl-kith-kin:knight-s-oath": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling escolhe um personagem não changeling a quem conceder o título de cavaleiro. Esse personagem ganha um bônus para sua Iniciativa e Defesa igual a metade de seu Fado, desde que eles possam percebê-la, e o mesmo bônus para todas as ações sociais que eles realizam em seu nome. Se eles desobedecerem ou traí-la, eles sofrem a condição Cowed, e o changeling imediatamente sabe o que aconteceu, al embora não que circunstâncias levaram ao evento ou qualquer de caudas. O próprio Fado julga o que conta como desobediência ou traição, aderindo ao espírito da doação. O alvo deve estar disposto para que este Contrato funcione, mas eles não precisam entender completamente os parâmetros ou consequências, e o changeling pode coagir ou enganá-los.",
    exceptionalSuccess: "",
    page: 46,
  },
  "ctl-kith-kin:unmask-the-dark-horse": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling chama alguém para fora, aprendendo uma de suas aspirações de curto prazo e infligindo a condição com petitive sobre eles. Eles não podem resolver a condição até que eles ganhem um rolo contestado, lutar, ou outra competição contra o changeling. Ao gastar um ponto Glamour adicional, a mudança pode mudar imediatamente uma de suas próprias Aspirações para uma diretamente oposta ao alvo.",
    exceptionalSuccess:
      "O changeling aprende todo o seu alcatrão obter aspirações.",
    page: 47,
  },
  "ctl-kith-kin:a-benevolent-hand": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling faz sua proclamação, que se torna automaticamente alto o suficiente para que todos dentro de 10 metros / metros para ouvir. No processo, ela pode",
    exceptionalSuccess: "",
    page: 47,
  },
  "ctl-kith-kin:tempter-s-quest": {
    action: "Disputada",
    duration: "One story",
    success:
      "O changeling descreve uma única tarefa, tão complexa ou simples como ela quer. O sujeito faz dessa tarefa sua busca e deve realizá-la. A busca deve ter um objetivo final claro, tanto de perto e razoavelmente possível para que a pessoa a realizar dentro de uma história; “segurou um tratado com o Tin Gang Motley” funciona, mas “proteger o Freehold of Laden Sorrows” não. Ela também aprende a Aspiração mais importante que seu sujeito possui, escolhida pelo jogador do assunto. Ela deve descrever um prêmio que é capaz de fornecer que claramente leva ao cumprimento dessa aspiração e promete conceder esta recompensa. O sujeito ganha a Condição de Obsessão Persistente sobre o cumprimento dos desejos do changeling e substitui uma de suas Aspirações por completar a busca. Além disso, se o assunto não tomar uma ação significativa para completar a busca pelo menos uma vez por capítulo, eles não podem reabastecer a força de vontade através de seus Anjos novamente até que eles o façam. Se o assunto completar a busca antes de este Contrato terminar e o changeling não cumprir sua parte do acordo antes que a história termine, ela ganha a Condição Leveraged, e quaisquer poderes relevantes lêem-na como um quebra-juros até que a Leveraged resolva.",
    exceptionalSuccess:
      "Se o sujeito não fizer avanços em direção ao seu objetivo pelo menos uma vez por sessão, ele também sofre da condição letárgica.",
    page: 48,
  },
  "ctl-kith-kin:curse-of-hidden-strings": {
    action: "Disputada",
    duration: "One Cena",
    success:
      "O changeling escolhe uma promessa, dívida, acordo ou outra obrigação do alvo que ela já conhece. Algumas provas ou provas de sua existência devem existir, seja um contrato, e-mail, IOU, ou uma promessa que o Fado impõe; um simples acordo verbal não é suficiente. A vítima perde toda a memória de seu envolvimento na obrigação – acredita que está desempregada, esquece que precisa pagar um empréstimo, ou esquece que faz parte de um motley. Ela lembra que as outras partes existem, mas assume que ela não tem nenhuma obrigação para com eles, mesmo se mostrou prova física. Isso não os liberta da obrigação, e o fracasso em cumpri-la só porque ela se esquece que existe tem as mesmas consequências que normalmente faria. O changeling deve escolher uma ação viável que o alvo possa tomar que os beneficie e esteja de alguma forma relacionado com a obrigação esquecida, que lhes permitirá quebrar a maldição precocemente. Se o fizerem, o Contrato termina, e ambos se lembram imediatamente da obrigação e sabem quem causou a perda de memória. O alvo deve realizar algo concreto ao tomar a ação, como resolver uma condição, ganhar uma nova pedra de toque ou recuperar a força de vontade de um existente, defender ou quebrar um compromisso (incluindo o esquecido), ou sofrer um ponto de ruptura. Para o exame ple, uma maldição que quebra através do beijo do amor verdadeiro pode levantar-se quando o alvo ganha uma nova Pedra de Toque, beijando o assunto da Pedra de Toque; uma maldição que quebra através de desafiar alguém com poder sobre eles pode levantar-se quando eles se levantam para o valentão atormentando-os e resolver a Condição Cowed. O contador de histórias pode governar uma ação suficientemente dramática para quebrar a maldição sem qualquer mecânica concreta. Se o Contrato termina por conta própria, em vez de quebrar como acima, o alvo permanece nenhum mais sábio sobre quem causou sua perda de memória.",
    exceptionalSuccess: "A duração torna-se um chap ter.",
    page: 49,
  },
  "ctl-kith-kin:spare-not-the-rod": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling faz um cetro literal ou bastão de Glamour puro. Conta como uma arma com uma classificação de danos de 0B e nenhuma penalidade Iniciativa. Ele também pode ser uma arma variada ao custo de 1 Glamour por ataque, com uma classificação de danos de 0L, um alcance de 30 jardas / metros sem capacidade para atacar a médio ou longo alcance, e nenhuma penalidade Iniciativa. Ela pode dar-lhe qualquer tamanho ou aparência que ela gosta, e pode independentemente do seu tamanho sempre empunhar uma mão sem requisitos mínimos de força. Ela pode usar o cetro para atacar fisicamente um alvo ou tomar uma ação Intimidate contra eles. Se qualquer ação é bem sucedida, se o alvo realmente sofre dano, ela também inflige a Condição Desmoralizada sobre eles. O cetro é um objeto sólido, e se o changeling estiver desarmado ou desarmar o cetro, permanece para a duração do contrato. Qualquer outro que pegar o cetro pode usá-lo como descrito, embora aqueles que não têm classificação Fado não pode usar seu ataque variado.",
    exceptionalSuccess: "",
    page: 49,
  },
  "ctl-kith-kin:pole-star": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling declara em voz alta a pessoa ou lugar para onde quer viajar. Seu corpo age como um passe de comunicação, virando-o na direção de seu alvo. Ele pode usar isso para orientar-se em um lugar desconhecido, encontrar o norte verdadeiro no meio de uma floresta ou saber a direção de um marco reconhecível enquanto em uma parte desconhecida da cidade. Em alternativa, este Contrato pode indicar-lhe um item específico ou pessoa de paradeiro atualmente desconhecido. Ele não sabe o local exato ou a distância para o seu destino, apenas a direção em que ele está. Se a pessoa ou objeto estiver escondido por meios sobrenaturais, este Contrato suscita um Clash de Vontade. Este Contrato só funciona no reino mundano.",
    exceptionalSuccess: "",
    page: 50,
  },
  "ctl-kith-kin:cynosure": {
    action: "Disputada",
    duration: "One Cena",
    success:
      "O changeling entende uma das aspirações do alvo e aprende de um evento ou oportunidade que irá",
    exceptionalSuccess: "",
    page: 50,
  },
  "ctl-kith-kin:shooting-star": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O meta meta meta alguém que traz trabalhos criativos à fruição, independentemente da qualidade de seu trabalho. Eles ganham 1 ponto do Mérito da Fama (Changeling, p. 122) para a duração do Contrato; se isso aumentar sua fama além de 3 pontos, eles simplesmente ganham +1 morrer para o bônus social do Mérito. Todos os metamorfos que colhem Glamour daqueles afetados pela Fama do alvo ganham +1 para o rolo har colete.",
    exceptionalSuccess: "",
    page: 51,
  },
  "ctl-kith-kin:retrograde": {
    action: "Disputada",
    duration: "One Capítulo",
    success:
      "Assuntos de rotina que normalmente vão sem problemas para o alvo dar errado; uma questão de rotina é qualquer ação que o alvo toma que não requer um rolo. Por exemplo, o seu sinal corta sempre que tentam fazer uma chamada telefónica, ou não conseguem encontrar um lugar de estacionamento no seu destino. Embora a maioria das vezes afete assuntos de comunicação, finanças e viagens, os efeitos do Contrato atingem essas arenas.",
    exceptionalSuccess:
      "Além de suas desgraças menores, o alvo deve rolar cada rolo duas vezes e ter o pior resultado.",
    page: 51,
  },
  "ctl-kith-kin:frozen-star": {
    action: "Disputada",
    duration: "Until the next sunrise or subject touches target",
    success:
      "O sujeito nomeado imediatamente deixa cair o que eles estão fazendo e viaja em direção ao alvo traçado. Quando o contrato expirar ou entrarem em contato físico com o alvo, aconteça o que acontecer primeiro, o efeito termina. O sujeito sofre a condição abalada, uma vez que não têm qualquer reconhecimento do motivo por que perseguiram o alvo traçado.",
    exceptionalSuccess:
      "O Contrato não termina quando o sujeito toca o alvo; o efeito persiste após esse primeiro toque, viciando o sujeito à presença do alvo e infligindo a Condição Viciante Persistente. O sujeito pode resolver a Condição normalmente, mas de outra forma desaparece sem resolver no próximo nascer do sol, não concedendo Beats.",
    page: 51,
  },
  "ctl-kith-kin:light-of-ancient-stars": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Se o changeling tem uma conexão pessoal com um evento passado, ela pode fazer perguntas sobre isso igual à sua classificação Fado; o contador de histórias deve responder com sinceridade. O Fado define conexão pessoal como conhecer alguém envolvido mais de perto do que como um conhecido: seu Guardião, um irmão, ou um membro de seu motley. Alternativamente, ela pode perguntar sobre um evento conhecido que ocorreu em um local que ela visitou fisicamente anteriormente (uma corte de Fae Verdadeiro, a taverna onde se formou a primeira corte de seu freehold.)",
    exceptionalSuccess: "",
    page: 52,
  },
  "ctl-kith-kin:pinch-of-stardust": {
    action: "Instantânea (willing) or Disputada (hostile)",
    duration: "One Capítulo or when Delusional resolves",
    success:
      "A criatura age como uma busca, ganhando Ecos (Changeling, p. 236) igual à classificação Fado do changeling. Anexar a criatura como uma das Touchstones do alvo. Se o alvo não é um changeling, mas pode ter Touchstones, siga as regras habituais para o seu tipo sobrenatural. Para um alvo que não tem acesso a Touchstones, a criatura se torna mentora, amiga íntima ou outra parte importante da vida do alvo. O alvo sofre a Condição Delirante Persistente em relação à entidade; a Condição desvanece sem resolução ou concede Beats se não for resolvida antes do final do chap ter. O changeling pode ter como alvo este Contrato, mas por sua duração não se lembra de invocá-lo, acreditando no simulacro real. Invocar este Contrato constitui um ponto de ruptura com três dados, ou quatro se mirar um changeling (incluindo ele próprio).",
    exceptionalSuccess:
      "A criatura excepcionalmente bem construída torna-se difícil para amigos suspeitos e bem intencionados se lembrarem como não reais. Torna-se embutido nas memórias dos verdadeiros amigos e entes queridos mais próximos do alvo, embora não se tornem ilusórios e a evidência da falsidade da criatura os torna suspeitos.",
    page: 53,
  },
  "ctl-kith-kin:briar-s-herald": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "Sempre que o alvo entra na presença da mudança de Ling, nada dá certo para eles, e eles sabem de alguma forma que é ela fazendo mesmo sem nenhuma evidência razoável. Se o changeling está dentro de 100 jardas/metros de seu alvo, o alvo perde a qualidade de 10 novamente em qualquer rolo que seu jogador faz, e cada falha torna-se dramática sem conceder Beats. O changeling sabe cada vez que o alvo falha um rolo, independentemente de o alvo estar atualmente dentro do intervalo de efeitos do Contrato, embora ela não saiba automaticamente os detalhes.",
    exceptionalSuccess:
      "Sempre que o jogador da vítima falha um rolo enquanto na escala dos efeitos do contrato, a vítima sofre um ponto de dano letal, além das consequências dramáticas do fracasso.",
    page: 54,
  },
  "ctl-kith-kin:by-the-pricking-of-my-thumbs": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling estende seus sentidos de audição, visão, cheiro e toque em qualquer planta viva que possa perceber. Ela só pode ocupar uma planta de cada vez. Ela pode mudar seus sentidos de uma planta para outra, de uma planta de volta para ela mesma, ou de si mesma de volta para uma planta novamente como uma ação instantânea. O changeling ainda percebe o ambiente de seu corpo e pode tomar ações enquanto estende seus sentidos, mas fazê-lo é confuso; seu jogador sofre um –3 a todas as ações que ela não faz para perceber através da planta enquanto seus sentidos montam um, bem como a sua defesa e iniciativa.",
    exceptionalSuccess: "",
    page: 55,
  },
  "ctl-kith-kin:thistle-s-rebuke": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Os espinhos crescem a partir da roupa ou armadura do changeling, aumentando sua classificação geral de armadura em dois. Também rasgam a carne de quem se aproxima demais do changeling, infligindo um ponto de dano letal a quem a toca ou a envolve em melee. Se travado, seu oponente leva dois pontos de dano letal por turno para a duração do garra, além de qualquer outro dano feito por manobras dentro do garra. Além disso, o changeling pode disparar os espinhos de sua armadura em um inimigo dentro de 50 metros / metros, embora fazendo isso nega outros bônus do contrato para a volta como os espinhos crescem de volta. São armas com uma classificação de danos de 2L.",
    exceptionalSuccess: "",
    page: 55,
  },
  "ctl-kith-kin:the-gouging-curse": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling escolhe uma acção que quer proibir que o alvo tome. Deve ser específico e algo que eles poderiam fazer dentro de uma ação instantânea, como visitar um determinado local, usar um objeto específico, ou tocar uma certa canção sobre o rádio de varejo da loja. Se o alvo executa o ato antes do fim do capítulo, eles se tornam amaldiçoados com uma das seguintes inclinações da escolha do changeling: Braço Wrack (um braço), Cego (um olho), Surado (uma orelha), ou Perna Wrack (uma perna). Barbas e lascas perfuram o membro ou órgão escolhido até que o contrato termine e o Tilt desvaneça; mesmo que os aflitos os removam a todos, mais tomar o seu lugar.",
    exceptionalSuccess:
      "Disparar a maldição também inflige a Condição Culpada à vítima.",
    page: 55,
  },
  "ctl-kith-kin:embrace-of-nettles": {
    action: "Reflexiva",
    duration: "Instantânea",
    success:
      "O changeling invoca este Contrato enquanto no Sebe’s Thorns em resposta à Sebe deslocando-se. Escolha um dos seguintes: • Se o changeling se desviar, ela muda o alvo de um único deslocamento de Sebespinning que ela observa. Isto permite - lhe roubar um efeito benéfico ou desviar um efeito prejudicial para outra pessoa. Ela só ganha uma Beats de uma mudança de paradigma adversa se ela realmente sofre o efeito adverso. • Se o changeling adiar, ela nega até metade de seu Fado, arredondado para baixo, dos sucessos de turno da Sebe. Estes sucessos não desaparecem; em vez disso, adicioná-los ao próximo rolo Sebe bem sucedido Sebespinning, que se torna imune a este Contrato. Se o ryteller Sto rolou um sucesso excepcional, o turno da Sebe continua a ser um sucesso excepcional se mesmo um sucesso permanece após o adiamento. • Se o changeling escolher duplo-down , ela acrescenta sucessos Sebespinning para o rolo da Sebe, até metade de seu Fado arredondado para baixo. Em troca, ela ganha o mesmo número de sucessos adicionais em seu próximo sucesso Sebespinning roll dentro da cena. Os sucessos adicionais não contam ao determinar se ela consegue um sucesso excepcional. Não importa qual opção ela escolha, o changeling não pode escolher novamente dentro da mesma cena até que ela também tenha usado as duas outras opções.",
    exceptionalSuccess: "",
    page: 56,
  },
  "ctl-kith-kin:acantha-s-fury": {
    action: "Disputada",
    duration: "One Cena",
    success:
      "Com um grito sem palavras de raiva, o changeling aponta para seu alvo, que começa a se transformar em uma planta espinhosa ou espinhosa da escolha do changeling entre o Tamanho 4 e 12. A metamorfose ocorre em etapas ao longo de sev eral minutos uma vez que ela invoca o Contrato. O alvo progride por etapas transformadoras a uma taxa de um por minuto por um total de oito minutos após a invocação. Como cada etapa ocorre, o changeling deve oferecer",
    exceptionalSuccess: "",
    page: 56,
  },
  "ctl-kith-kin:awaken-portal": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O portal ganha sapiência temporária. Embora não possa se mover ou tomar ações físicas ou aquelas que requerem fala, percebe o seu entorno como o changeling faria; o bloqueio da entrada inibe sua visão, e um selo completo também inibe sua audição. O portal hobgoblin pode comunicar mentalmente com ela a qualquer distância, tantos metamorfos usam este Contrato para reunir informações e chantagem. O changeling pode usar seu kenning (Changeling, p. 107) do ponto de vista do portal em vez de seu próprio, mas ela perde a capacidade de ver seu próprio ambiente enquanto ela faz isso.",
    exceptionalSuccess: "",
    page: 57,
  },
  "ctl-kith-kin:crown-of-thorns": {
    action: "Disputada",
    duration: "One story",
    success:
      "O changeling escolhe uma acção imediata específica — como falar ou atacar uma determinada pessoa, entrar num determinado edifício ou dar uma dentada no almoço do changeling actualmente no frigorífico da sala de estar dos empregados — que pretende oferecer ao seu alvo. Se o alvo realiza o ato antes do fim da história atual, eles sofrem a condição de Comatose e um ponto de dano letal de espinhos invisíveis. Alvos não metamorfos não podem resolver a Condição a menos que alguém entre em seus sonhos para convencê-los de que estão sonhando, ou outro poder sobrenatural os acorda depois de vencer um confronto de vontades com o changeling. Vítimas que normalmente podem sonhar lúcidamente podem levar uma −2 penalidade para qualquer rolo que eles fazem para resistir a serem convencidos de que estão em um sonho. Se o alvo permanecer Comatose no final da história, este Contrato termina e eles acordam por conta própria; a Condição desaparece sem resolver, não concedendo Beats.",
    exceptionalSuccess:
      "A Condição deve resolver corretamente e não desaparecer no final da história.",
    page: 58,
  },
  "ctl-kith-kin:shrike-s-larder": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Este Contrato concede três efeitos diferentes que um personagem pode empilhar sobre um único alvo para um ponto de Glamour cada. • Os espinhos fazem a vítima tropeçar nos piores momentos possíveis. Enquanto em uma perseguição, eles sofrem uma penalidade –2 para todos os rolos relacionados ao movimento e não podem possuir o Edge. Eles podem gastar 1 força de vontade para poder através da dor e ignorar esses efeitos por um turno.",
    exceptionalSuccess: "",
    page: 58,
  },
  "ctl-kith-kin:witch-s-brambles": {
    action: "Reflexiva",
    duration: "Instantânea",
    success:
      "Ao gastar 2 Glamour, o changeling pode realizar manipulações limitadas do mundo mundano, como se fosse Sebespinning, desde que ela invoque o medo e fascínio dos Thorns. Ela invoca este Contrato enquanto realiza qualquer ação mundana utilizando um tamanho 1 ou objeto menor capaz de perfurar a carne de forma precisa. Um punhal, sua lâmina larga e indiscriminada, não pode suscitar o estranho fascínio de olhar para um dedo picado e ver surgir a menor gota de sangue, mas um alfinete de segurança, pequeno cacto, ou uma presas de gato (ou vampiro) funcionaria. A ação que o changeling realiza sofre uma –3 penalidade como o mundo mortal resiste a tal mudança desenfreada. O jogador pode gastar qualquer excesso de sucesso em turnos sutis, seguindo as regras de Sebespinning (Changeling, p. 204). Nenhum dos outros efeitos habituais ou consequências da Sebespinning ocorre. Se o changeling alcançar um sucesso excepcional na ação que este Contrato aumenta, ela pode pagar um Glamour adicional para promulgar uma mudança de paradigma. Usar este Contrato na Sede ou em qualquer outro domínio mundano não tem efeito.",
    exceptionalSuccess: "",
    page: 59,
  },
  "ctl-kith-kin:coming-darkness": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling cria uma área de completa escuridão centrada em si mesmo com um raio igual a (seu Fado x 5) jardas/metros. A escuridão cai tão abruptamente, que todos na área sofrem o Tunned Tilt, a menos que façam um rolo Raciocínio + Autocontrole bem sucedido ou possam ver claramente no escuro. Caracteres dentro da escuridão ou quem entra nele durante a duração do contrato sofrer o Blinded Tilt (ambos os olhos) até que eles deixam a área ou o contrato termina, o que vier primeiro. O changeling não é afetado pela sua própria escuridão. Fontes de luz Mundanas na área não são extintas, mas simplesmente obscurecidas; ligar luzes mundanas adicionais dentro da área afetada não penetra na escuridão. Tentativas de criar luz através de qualquer meio mágico provocar um Confronto de Vontades. O changeling não tem sombra para a duração do tratado Con. Se ele deixar a área ou o contrato terminar prematuramente, sua sombra permanece desaparecida. Os observadores podem notar que falta isto rolando Raciocínio + Autocontrole, contestado pela manipulação do changeling + Stealth. Se ele permanece sem sombra e fora da escuridão quando o Contrato termina, ele deve caçar sua sombra rebelde, levá-lo para a Sede, e recolocá-lo através de uma subtil mudança Sebespinning exigindo quatro sucessos. A sombra não tem traços e não toma nenhuma ação rolada, mas pode causar travessura simplesmente por existir de forma independente e visível.",
    exceptionalSuccess: "",
    page: 59,
  },
  "ctl-kith-kin:pomp-and-circumstance": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Para 1 Glamour, o changeling escolhe uma área com um raio de até (seu Fado x 10) metros/metros. Deve ter demarcações físicas visíveis, claras de algum tipo: por haps paredes existentes ou cerca, ou talvez giz ou uma linha de pedras ou sal criado pelo changeling. Os hóspedes não convidados não podem entrar na área, embora qualquer pessoa dentro da área definida possa permitir o acesso de alguém convidando-a para entrar. Tentativas de espionagem mundana na área ou rastreamento de quaisquer personagens dentro falhar automaticamente. Tentativas sobrenaturais de circunjetar qualquer um desses efeitos provocam um Confronto de Vontades. Se o changeling gasta uma força de vontade também, nenhum Caçador ou Verdadeiro Fae pode encontrar a área, mesmo se eles rastrearem alguém diretamente para o local. Simplesmente não existe aos seus sentidos, seja mundano ou mágico. O changeling e todos dentro da área devem manter um conjunto de orientações individuais, específicas, numerando até seu Fado. Ele especifica claramente essas regras ao invocar o Contrato. A partir daí, quem entra na área compreende automaticamente as orientações se as ouviu explicar. As diretrizes muitas vezes descrevem a etiqueta do encontro, como abster - se de violência, insultar outros deliberadamente ou comer; podem também exigir comportamentos específicos, como falar apenas em sussurros codificados ou manter os olhos fechados. Se alguém quebra as diretrizes, o Contrato termina imediatamente e todos na área sofre a condição desmoralizada como o Fado pune tudo pelas transgressões de um.",
    exceptionalSuccess: "",
    page: 60,
  },
  "ctl-kith-kin:shadow-puppet": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O boneco sombra que o changeling cria toma forma substancial, aparecendo como uma versão totalmente realizada de qualquer forma que o fantoche toma, mas feito de sombra. Por exemplo, se o changeling faz a cabeça de um veado com seus dedos, este Contrato cria um veado real colorido inteiramente em tons de cinza e preto, fuzzing nas bordas. Se ele usa todo o seu corpo para criar a sombra, o fantoche torna-se um gémeo de sombra idêntico. Este fantoche funciona como um Retentor ( Changeling, p. 125) com uma classificação de ponto igual a metade do Fado do changeling e uma inteligência básica. Ela segue as intruções do changeling e pode atuar em cena de ação, tomando a vez do personagem e agindo em sua Iniciativa. Para fins do Mérito do Guardião, o changeling escolhe uma especialidade que possui como área de especialização da sombra. O jogador atribui um Goblin Dread Power (Changeling, p. 253) ao fantoche. O ser sombra possui Fado 1, uma piscina de Glamour máximo de 6 e tem uma caixa de Saúde; ele morre imediatamente se essa caixa preenche com danos letais ou agravados. Um fantoche de sombra destruído leva consigo a sua parte da sombra do changeling; a cabeça de veado representa uma pequena fracção da sua sombra, mas um duplo total leva tudo. Um changeling sem sombra deve ir para a Sebe para recolocá-lo como uma subtil mudança de Sebespinning que requer quatro sucessos.",
    exceptionalSuccess: "",
    page: 60,
  },
  "ctl-kith-kin:dread-companion": {
    action: "Disputada",
    duration: "One Capítulo",
    success:
      "O changeling torna-se um Thread adicional para o fantasma Sebe. Quando lhe pede que lhe faça uma acção, faz-o como se afirmasse o seu Thread. O changeling pode pedir ao fantasma Sebe para usar qualquer um de seus poderes, Numina, ou Influências em seu nome, embora possa pagar 1 Glamour para recusar. As duas entidades permanecem vinculadas à duração do contrato, incapazes de se desviarem mais do que (os metros Fado x 10 do changeling) um do outro. O fantasma Sebe pode tirar Glamour do personagem sem tocá-lo para abastecer poderes que ele usa em seu nome. Da mesma forma, ele pode usar a piscina Glamour do fantasma Sebe como seu próprio em ações beneficiando ambos. No mundo mundano, o fantasma Sebe não sofre efeitos deletérios enquanto amarrado, e o changeling pode estender sua máscara para seu companheiro etéreo e fazê-lo parecer humano.",
    exceptionalSuccess:
      "O fantasma da Sede não pode recusar os pedidos do changeling, a menos que isso o coloque em perigo.",
    page: 61,
  },
  "ctl-kith-kin:cracked-mirror": {
    action: "Disputada",
    duration: "One Cena or until the changeling enacts a switch",
    success:
      "Por 1 Glamour, o changeling atunes o espelho para espionar em sua busca como se ele estivesse a poucos metros deles e os seguisse ao redor. Para o resto da cena, ele pode ver o ambiente deles claramente e ouvir qualquer som que eles possam ouvir, mas a busca automaticamente sabe que sua contraparte changeling tentou vê-los e bisbilhotar mesmo se o changeling falhar seu rolo. Ao pagar um adicional 1 Willpower, o changeling pode trocar de lugar com sua busca, enganando o espelho para confundir uma identidade para a outra. Ela os atrai brevemente para o espaço espelho antes de cuspi-los de volta em locais opostos. Se o changeling o fizer, o Contrato termina imediatamente; se ele quiser voltar pelo caminho que veio, deve invocá-lo novamente. Uma busca voluntária que coopera com o changeling não precisa contestar o rolo de invocação.",
    exceptionalSuccess:
      "O processo desorienta a busca, infligindo a Condição Confusa.",
    page: 61,
  },
  "ctl-kith-kin:listen-with-the-wind-s-ears": {
    action: "Instantânea",
    duration: "One Cena, or until used to teleport Roll Results",
    success:
      "Para 1 Glamour, se o nome do changeling é falado dentro de um raio de (suas milhas Fado x 2), ele imediatamente sente e pode escutar a conversa de uma distância para uma única volta com um sucesso Raciocínio + Investigação + Fado Roll contestado pela Autocontrole + Fado do orador. Enquanto ele escuta essa conversa, ele fica surdo para toda a fala em sua vizinhança (mas não outros sons). Se um poder (como Pomp e Circunstância, p. XX) protege qualquer um dos alto-falantes de rabiscar ou bisbilhotar, provoca um Confronto de Vontades. O Contrato só se ativa quando o vento ouve o verdadeiro nome do changeling, não um apelido, nome morto ou apelido de qualquer tipo. Se o changeling alcançar um sucesso excepcional no rolo contestado, ele pode ouvir a conversa para turnos iguais aos excessos de sucesso rolou em vez disso. Enquanto o changeling escuta com sucesso em uma con versation, ele pode pagar 1 Glamour adicional e 1 Willpower para teletransportar para esse local como uma ação instantânea. Ele não portal, simplesmente passos de um local para o outro como o Fado usa o som de seu nome para chamá-lo. Ele não sabe onde vai chegar até chegar lá, nem sabe quem falou seu nome a menos que ele mesmo reconheça a voz. Uma vez ativo, este Contrato dura para a cena ou até que ele usa-lo para teletransportar em algum lugar, o que vem em primeiro lugar.",
    exceptionalSuccess: "",
    page: 62,
  },
  "ctl-kith-kin:momentary-respite": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Para 1 Glamour, o personagem pode escolher uma opção por sucesso: • Terminar um Tilt pessoal que o afeta atualmente (pode ser escolhido mais de uma vez) • Ignorar todas as penalidades da ferida sem curar a idade da barragem",
    exceptionalSuccess: "",
    page: 62,
  },
  "ctl-kith-kin:steal-influence": {
    action: "Disputada",
    duration: "One Cena",
    success:
      "O changeling toca uma criatura que possui uma influência e, durante a duração do contrato, rouba um ponto dela por Glamour gasto. Se o alvo possui múltiplos Em fluências, o changeling rouba um de sua escolha; ele não pode dividir o Glamour gasto para roubar alguns pontos de uma Influência e alguns de outro. A vítima não pode usar o roubado. Os pontos de influência enquanto o changeling os possui, e o changeling pode ativar a influência na classificação de ponto que ele pagou gastando a quantidade adequada de Glamour, mesmo que normalmente exigiria outro recurso para usar.",
    exceptionalSuccess:
      "O changeling pode comprar a influência roubada para 2 experiências por ponto, até o número de pontos que ele tomou. Se o fizer, mantém o uso dos pontos comprados mesmo depois de retornarem à vítima. Os metamorfos podem possuir no máximo metade do Fado em pontos de uma única influência, tal como os fantasmas Sebe.",
    page: 63,
  },
  "ctl-kith-kin:earth-s-gentle-movements": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling reformula uma área de terra aberta centrada em si mesmo com um raio de 1 metro quadrado por sucesso rolado. Ele pode não afetar qualquer área sobre a qual as estruturas, pavimentação, ou outras construções artificiais se situam, mas pode criar um buraco, construir terra plana para criar uma parede de terra ou pequena colina, ou enviar um pilar de terra atingindo o ar, enquanto a área total permanece a mesma. Pode até mesmo remodelá - lo em formas mais específicas, tais como um pilar em forma de si mesmo ou uma expansão plana com rotinas que formam palavras quando vistas de cima e podem mudar a consistência da terra. Por exemplo, solo solto poderia tornar - se terra, areia ou lama, mas nunca pedra. Ele pode ejetar quaisquer materiais adicionais na terra, se quiser, tais como minerais adicionados ao solo para plantar ou ossos e carcaças de insetos. Qualquer um na área da formação quando acontece deve ter sucesso em um rolo Dexterity + Esportes ou sofrer o Knocked Down Tilt. Uma vez que o changeling invoca o Contrato, suas mudanças são permanentes, impedindo qualquer reformulação posterior. Exceção Sucesso: O jogador do changeling pode dividir os sucessos no rolo de invocação para o changeling criar dois efeitos diferentes dentro da área designada.",
    exceptionalSuccess: "",
    page: 64,
  },
  "ctl-kith-kin:earth-s-impenetrable-walls": {
    action: "Instantânea",
    duration: "One Capítulo",
    success:
      "O changeling escolhe uma área de terra aberta centrada em si mesmo não contendo estruturas, pavimentação ou outras construções artificiais. Com uma ação instantânea dando cinco voltas para completar (ou 30 segundos fora das cenas de ação), os canais metamorfos sua vontade de construir uma fortaleza de pedra centrada em torno dele com um Tamanho de (seu Fado x 10). Durante este tempo, o Contrato inflige o Terremoto Ambiental Inclinação na área; o próprio changeling é imune aos seus efeitos. O projeto desta fortaleza depende dele; ele pode criar um simples bunker quadrado com battlements, uma única torre alta, uma pirâmide, etc. e pode incluir tantos ou poucos quartos como ele gosta dentro da área permitida. A fortaleza conta como um lugar seguro (Changeling, p. 125) com uma classificação de ponto de metade do Fado do changeling, arredondado para baixo, e suas paredes têm Durabilidade 2. O jogador escolhe um benefício adicional por sucesso além do primeiro rolado para invocar este Contrato; os benefícios disponíveis incluem: • +1 Durabilidade; pode aplicar várias vezes • +10 Tamanho; pode aplicar várias vezes • Imunidade para todas as inclinações ambientais naturais para paredes e interiores; sobrenatural provoca um Clash de Wills • Armado com provisões suficientes para fornecer sustento adequado para todos dentro • Se invocado na Sede, a estrutura criada por este Contrato também conta como um Hollow (Changeling, p. 116) com classificação de ponto de meio changeling’s Fado, arredondado para baixo",
    exceptionalSuccess: "Sucessos adicionais são sua própria recompensa.",
    page: 65,
  },
  "ctl-dark-eras:peacemaker-s-dra-w": {
    action: "Reflexiva and Disputada",
    duration: "Instantânea",
    success:
      "O changeling atinge um item na mão do alvo (incluindo uma arma) ou em sua pessoa, enviando-o voando sem causar qualquer dano. Recuperar um item caído requer uma ação instantânea. Alternativamente, o changeling pode impor uma inclinação pessoal adequada ao alvo. Uma flecha ou faca através de uma manga pode prender o braço da vítima, impondo Arm Wrack; um cinto quebrado pode deslizar as calças do alvo até os tornozelos enquanto ele corre para se proteger, impondo Knocked Down. Em todos os casos, o alvo pode acabar com o Tilt com uma ação instantânea para repará-lo — esfregando a poeira de seus olhos, puxando suas calças, puxando a manga livre, etc. O contador de histórias é o árbitro final do qual Tilts são apropriados. O alvo também ganha a condição de alavanca (Changeling, p. 342) em relação a qualquer testemunha dos efeitos deste Contrato que não seja o changeling, como sua reputação toma um mergulho.",
    exceptionalSuccess:
      "O changeling escolhe onde os objetos caídos pousam, o que poderia estar em suas próprias mãos. Os Tilts que ela impõe por último para a cena, como estranha má fortuna conspira contra o alvo.",
    page: 241,
  },
  "ctl-oak-ash-thorn:donning-the-grand-mantle": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling ganha imediatamente Manto 5 para a duração do contrato. Para cada ponto do Manto que já possui, ela recupera 1 Glamour gasto e desfruta + 1 em rolos alinhados com os temas do Manto, incluindo rolos para invocar seus Contratos de “Corte”.",
    exceptionalSuccess:
      "O uso atual do Contrato não conta para o limite seguro uma vez por andar.",
    page: 23,
  },
  "ctl-oak-ash-thorn:autonomous-payload": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling está em um piso dentro da BriarNet e abre uma Sebeway digital ( Changeling, p. 198); ele não precisa de um portal fechado. Passar por ele transforma ele e qualquer um que segue em dados, permitindo que a BriarNet entre temporariamente em um computador mundano ou outro repositório digital. Viajar pela paisagem digital é exatamente como viajar pela BriarNet, usando as regras de viagem de Sebe; no entanto, cada repositório age como um Bastion (Changeling, p. 221), possuindo uma classificação de fortificação baseada na segurança geral dos dados. Um laptop pessoal de um estudante universitário médio teria Fortificação 1, uma rede de escritório relativamente segura Fortificação 3, e um banco de dados do governo classificado Fortificação 5; se um repositório é protegido sobrenaturalmente, adicione metade do traço de tolerância sobrenatural do seu usuário (em torno) para sua Fortificação. Se um changeling estiver dentro de seu próprio computador, ou outro repositório ele sabe a senha para acessar, ele pode aumentar sua fortificação como se estivesse dentro de seu próprio Bastion. Changelings pode ler a Fortificação de um repositório digital como normal, com o Computador em vez de Empatia. A partir daqui, o changeling pode Sebespin para contornar a segurança e obter acesso a informações; fazer chang es para arquivos, programas, configurações e outros componentes digitais do repositório; implantar um vírus de computador fae; e muito mais. Quando o Contrato terminar, o changeling pode invocá-lo imediatamente novamente para permanecer em forma de dados. Se ele não pode ou não pode, ele e qualquer um com ele emerge da máquina, servidor ou outro dispositivo que mantém o repositório no mundo mundano em forma física. Enquanto o Contrato estiver ativo, o changeling pode navegar para uma representação BriarNet de um sinal ou",
    exceptionalSuccess: "",
    page: 25,
  },
  "ctl-oak-ash-thorn:the-widening-gyre": {
    action: "Disputada",
    duration: "",
    success:
      "O alvo automaticamente move sua velocidade total para o changeling como seu movimento alocado cada turno, a menos que eles gastem uma força de vontade para um chor eles mesmos que giram; eles podem usar sua ação instantânea para mover sua velocidade uma segunda vez em qualquer direção, como normal. Qualquer um que entra dentro de sua escala melee e não foi excluído dos efeitos do Contrato sofre o Knocked Down Tilt ( Changeling, p. 330). O vórtice segue o changeling como ela se move, e quem entra no vórtice após a invocação inicial deve contestá-lo como normal, a menos que ela gasta um outro Glamour para excluí-los.",
    exceptionalSuccess: "",
    page: 28,
  },
  "ctl-oak-ash-thorn:principle": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O changeling inflige uma versão temporária da Condição de Destruidor de Juramentos (Changeling, p. 343) que não requer o perdão adicional do Fado para resolver. Ao passo que esta Condição dura, ela afeta de forma perceptível o mien do alvo de uma forma que reflete seus crimes e se encaixa na natureza de seu mien.",
    exceptionalSuccess:
      "O alvo também não pode dizer nada que eles não acreditam é verdade até o final do capítulo.",
    page: 30,
  },
  "h-beyond-hedge:crown-envoy-s-splendid-defense": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "A personagem aparece em sua verdadeira forma; os espectadores estão impressionados, mas não assustados. O personagem ganha o equivalente da versão de quatro pontos do Striking Looks Merit. Este bônus acrescenta a qualquer outro, como se o personagem já tivesse o Mérito de Pareces Striking. Além disso, enquanto o changeling não brandir uma arma ou tentar prejudicar ninguém, os humanos comuns não podem atacá-la. Podem bloquear-lhe o caminho, mas não a podem magoar a não ser por acidente. Seres sobrenaturais podem atacar o changeling fazendo um Reflexive Perseverança + Autocontrole rolar antes de cada ataque. Se o personagem ataca alguém ou brande uma arma ameaçadoramente, o Contrato termina instantaneamente. Durante o tempo em que o Contrato é ativo, câmeras e outros dispositivos eletrônicos não mostrarão ou registrarão a verdadeira forma do personagem. Depois, testemunhas humanas ainda consideram o personagem impressionante e impressionante, mas ou se lembram de sua aparência como um cosplay fantástico ou esquecem que ela olhou para todos os desumanos. No entanto, os sobrenaturais se lembram plenamente da aparência do personagem. O Contrato afeta qualquer um que testemunhe o caráter enquanto estiver ativo, não apenas aqueles presentes no momento em que foi invocado.",
    exceptionalSuccess:
      "O efeito dura até o sol nascer ou se pôr, o que vier primeiro.",
    page: 125,
  },
  "h-beyond-hedge:sweet-nothings": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O alvo responde a uma pergunta por sucesso, como eles entendem. Não podem saber algo que não sabem, e se não sabem a resposta, indicam tanto.",
    exceptionalSuccess:
      "Além de obter as respostas que deseja, o changeling pode implantar uma das seguintes Condições na mente do alvo em relação a si mesma ou a um alvo apropriado de sua escolha: Amnésia (no que diz respeito a si mesma nas memórias do alvo), Confusa, Acoplada, Desorientada ou Distraída.",
    page: 126,
  },
  "h-beyond-hedge:jewels-the-perfect-talent": {
    action: "Instantânea",
    duration: "",
    success:
      "Os Perdidos e o alvo devem possuir pelo menos um ponto da habilidade para ser impulsionado (você não pode levantar o que você não possui). Para cada dois sucessos, arredondados para baixo, o Lost concede um ponto da Habilidade escolhida, a um máximo permitido (geralmente 5 para mortais, mas potencialmente maior para alvos sobrenaturais). O impulso permanece para uma cena e afeta todos os conjuntos de dados com base nessa habilidade.",
    exceptionalSuccess:
      "Com um sucesso excepcional, o Lost recebe um bônus +1 para sua pontuação de habilidade também, que pode levar a pontuação acima de seu máximo normal.",
    page: 127,
  },
  "h-beyond-hedge:mirror-babel-s-tower": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling pode falar, ler e escrever qualquer língua a que esteja exposta, quer por assistir a um programa de televisão, ler um tratado medieval sobre alquimia escrita em latim, quer pela maldição do faraó escrita numa antiga parede de túmulos em hieróglifos.",
    exceptionalSuccess: "",
    page: 128,
  },
  "h-beyond-hedge:turing-s-enigma": {
    action: "Instantânea or Disputada",
    duration: "",
    success:
      "Se codificar uma mensagem, o gasto de Glamour é suficiente para disfarçar a mensagem como algo diferente da escolha do changeling. O rolo para quebrar esta cifra é um rolo de Confronto de Vontades. O destinatário pretendido da mensagem pode gastar 1 Glamour para ler a mensagem codificada normalmente. Ao decodificar uma mensagem, as cifras mundanas de qualquer tipo não requerem nenhum rolo para quebrar. Se a criptografia é mágica na natureza, então um rolo de Confronto de Vontades é feito com sucesso decifrando o material. Decifrando mágico",
    exceptionalSuccess: "",
    page: 128,
  },
  "h-beyond-hedge:shield-bar-the-door": {
    action: "Instantânea (Clash of Wills to attempt to force the door open)",
    duration: "",
    success:
      "O changeling pode magicamente trancar qualquer tipo de portal desde que tenha um meio mundano de fechar (como uma porta, janela, tronco de vapor, cofre, etc). Qualquer pessoa que tente forçar a porta aberta deve fazer um Confronto de Vontades rolar vs. Manipulação do changeling + Larceny + Fado ou ser incapaz de abrir o portal até que a magia passe. A fechadura permanece para uma cena; com o gasto de um ponto de força de vontade, a fechadura permanece por 24 horas.",
    exceptionalSuccess: "",
    page: 130,
  },
  "h-beyond-hedge:foul-is-fair": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling pode remover instantaneamente os efeitos de uma Condição não persistente de si mesma ou de outra e “jogar” essa Condição em qualquer alvo válido, incluindo a fonte original da Condição. A Confronto de Vontades roll é feito, com o Lost adicionando sua classificação Dissimulação para o jogo de dados, e se bem sucedido, ela tira a condição de seu alvo e lança-lo em um alvo de sua escolha. A condição permanece até ser resolvida normalmente.",
    exceptionalSuccess:
      "Com um sucesso excepcional, o personagem pode infligir a Condição em um segundo alvo viável também, se aplicável.",
    page: 130,
  },
  "h-beyond-hedge:whisperward": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O Lost cria uma zona de proteção aproximadamente igual a um quarto 10x10 por ponto de Fado que ela possui. Qualquer um dentro dessa área pode falar sem medo de ser ouvido por meios mundanos, mágicos ou eletrônicos. Por exemplo, qualquer pessoa do lado de fora da porta para uma sala tão protegida só ouviria murmurações sem sentido enquanto os aparelhos de escuta colocados dentro da sala transmitiam mensagens gobbledygook para aqueles que tentavam ouvir. Qualquer um que tente usar magia para escutar aqueles dentro da área protegida provoca um Confronto de Vontades com o changeling invocando este contrato; isso inclui poderes e habilidades que permitem a partilha de sentidos.",
    exceptionalSuccess: "",
    page: 131,
  },
  "h-beyond-hedge:steed-waylaid-traveler": {
    action: "Instantânea",
    duration: "",
    success:
      "Se o changeling marcar pelo menos um sucesso, subtraindo a maior Compostura se for perseguida por um grupo, então os perseguidores vaguearão em círculos, incapazes de segui-la, seja na Sebe ou no mundo real, por um número de horas igual a ela (Manto x 2). Os alvos não se põem em perigo por andarem de penhascos ou telhados, por exemplo, mas estão sujeitos a perigos naturais, tais como o tempo, os animais selvagens e os estranhos e selvagens habitantes da Sede. Este poder também pode atingir qualquer pessoa dentro da linha de visão para simplesmente torná-los incapazes de chegar à sua localização desejada até que o contrato passe. Mischievous Os perdidos são conhecidos por pregar peças em mortais infelizes desta forma, ou testar a sua determinação na busca de segredos.",
    exceptionalSuccess:
      "Se o changeling marcar um sucesso excepcional, o alvo esquece completamente o que estava fazendo em busca do changeling e vagueia para outro assunto mais urgente. Não vai retomar a caça durante 24 horas.",
    page: 132,
  },
  "h-beyond-hedge:wildwalking": {
    action: "Reflexiva",
    duration: "One Cena",
    success:
      "O Lost pode cancelar uma série de penalidades causadas por condições ambientais ou o mundo natural igual a metade de sua pontuação Fado, arredondado para baixo. Tais condições incluem penalidades para a percepção devido à névoa, fumaça ou vento, bem como penalidades para o movimento devido a ramos grossos, gelo, chuva ou ventos fortes. Os efeitos permanecem para uma cena e não pode resultar em um bônus para o personagem caso seu Fado exceder o número de penalidades. Particularmente severas penalidades só podem ser parcialmente diminuídas por este poder.",
    exceptionalSuccess: "",
    page: 133,
  },
  "h-beyond-hedge:name-smoke-stepping": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "Uma vez ativado, o personagem pode tomar sua ação de movimento para mover instantaneamente para qualquer local que esteja dentro do nevoeiro/fumaça e dentro de um número de metros de sua localização atual igual a (Fado x 5). Ele pode aparecer diante de qualquer direção e pode surpreender qualquer oponente que não possuem um Mérito ou sentidos aumentados para detectar emboscadas (como Sentido de Perigo ou Auspex).",
    exceptionalSuccess: "",
    page: 134,
  },
  "h-beyond-hedge:spring-doorway-to-desire": {
    action: "Instantânea",
    duration: "Varies Loophole:",
    success: "",
    exceptionalSuccess: "",
    page: 135,
  },
  "h-beyond-hedge:faerie-feast": {
    action: "Disputada",
    duration: "",
    success:
      "O alvo que consumiu o alimento ou bebida encantado sofre a Condição Swooned em relação ao caráter que invocou o Contrato.",
    exceptionalSuccess:
      "O alvo também sofre a Condição de Wanton em relação ao personagem.",
    page: 135,
  },
  "h-beyond-hedge:name-in-vino-veritas": {
    action: "Instantânea and Disputada (See below)",
    duration: "",
    success:
      "O changeling gasta um ponto de Glamour e uma única bebida alcoólica é encantada com a veracidade. O próximo indivíduo que consome até mesmo uma porção da bebida deve fazer o rolo contestado; se eles falharem, o indivíduo é compelido a falar a verdade até que o sol se levante ou se ponha, o que vier primeiro. O changeling, ou mesmo qualquer um, pode fazer qualquer pergunta que goste do indivíduo afetado e esperar a verdade... às vezes aprendendo muito mais do que eles precisavam ou queriam saber.",
    exceptionalSuccess:
      "Se o alvo não resistir, eles sofrem a Confusão durante a duração.",
    page: 136,
  },
  "h-beyond-hedge:memory-of-stone": {
    action: "Reflexiva",
    duration: "",
    success:
      "Os Perdidos ganham o Mérito da Memória Eidética para a cena. Com a despesa de um ponto de força de vontade, ela mantém os efeitos do Mérito por 24 horas.",
    exceptionalSuccess: "",
    page: 136,
  },
  "h-beyond-hedge:memory-of-trees": {
    action: "Instantânea and Prolongada",
    duration: "",
    success:
      "O personagem pode aprender qualquer coisa que tenha acontecido nas proximidades da árvore (cerca de 100’ raio por 10’ de altura). Quanto mais velha a árvore, mais atrás sua memória se estende, e um personagem pode mergulhar mais fundo no passado cada vez que ela mantém contato com a árvore. Essa informação vem como imagens mentais de eventos que ocorreram ao redor da árvore. O personagem pode ver para trás no tempo 1 dia por turno. Não é incomum que Lost com afinidades de plantas permaneça em contato com uma determinada árvore por dias para experimentar a totalidade de suas vidas antigas. As imagens são tocadas como um filme mudo que o changeling pode mover para frente ou para trás como ela gosta. As memórias continuam até que o changeling as pare ou ela rompe o contato com a árvore. Não é recomendado tentar este Contrato com árvores de Sede, pois os resultados têm resultados totalmente imprevisíveis e ocasionalmente horríveis.",
    exceptionalSuccess: "",
    page: 136,
  },
  "h-beyond-hedge:merry-meet": {
    action: "Instantânea and Disputada (See below)",
    duration: "",
    success:
      "Se o changeling marcar mais sucessos do que seu alvo, ela ganha 3 dados extras para todos os rolinhos sociais contra o alvo para o restante da cena.",
    exceptionalSuccess:
      "Em um sucesso excepcional, o alvo também sofre a Condição Swooned para o changeling até que seja resolvido.",
    page: 137,
  },
  "h-beyond-hedge:name-mantle-of-terrible-beauty": {
    action: "Disputada",
    duration: "One Cena",
    success:
      "Este Contrato afeta todos dentro de três metros por ponto do Fado do changeling. Um rolo contestado pode ser feito para uma multidão de mortais, mas os sobrenaturais devem fazer seus próprios rolos. Se o Lost rolar algum sucesso, ele enche os espectadores com uma mistura de terror e temor. Se ele conseguir mais sucessos do que o rolo de resistência do alvo, a vítima foge da presença do changeling em total terror. Aqueles que falham, mas são impedidos de escapar por alguma razão sofrem -2 dados para todas as ações. Para aqueles que rolam igual ou mais sucessos contra o changeling não tem que fugir, mas ainda são espantados e intimidados pelo Manto de Beleza Terrível, sofrendo -2 a todos os rolos de ataque contra o changeling. O Lost também ganha um +2 para todos os rolos para intimidar ainda mais os espectadores restantes. O Manto persiste até que o changeling termine ou a cena termine, o que vier primeiro. Qualquer pessoa que entre na área enquanto o Manto estiver em vigor está sujeita aos seus efeitos. O Manto afeta todos os presentes, amigos ou inimigos, com exceção de qualquer changeling ligado ao personagem através de uma promessa motley, e só pode ser usado em um único indivíduo uma vez por cena.",
    exceptionalSuccess:
      "Todas as vítimas que não resistem sofrem a Condição Assustada para o resto da cena; todas as que pontuam um número igual de sucessos para resistir sofrem a Condição Cowed para o resto da cena.",
    page: 138,
  },
  "h-beyond-hedge:summer-sunflash": {
    action: "Reflexiva",
    duration: "",
    success:
      "Um clarão de luz aparece em torno do changeling por apenas um momento, mas o suficiente para cegar qualquer um olhando para ela naquele instante. As vítimas sofrem a condição de cegos para este turno e o depois, e então a sua visão se dissipa. O changeling ganha um bônus para sua iniciativa igual à sua classificação Manto para o turno seguinte. Se ela optar por esconder ou invocar um Contrato que só pode ser feito sem ser observado, Sunflash explicitamente permite isso; caso contrário, ela provavelmente ganha a vantagem em sua próxima ação de combate. Como uma nota lateral, este Contrato não gera luz solar real, mas provavelmente dará aos vampiros um susto e manterá o, cauteloso do changeling.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-beyond-hedge:my-anger-is-my-armor": {
    action: "Reflexiva",
    duration: "One Cena",
    success:
      "O personagem aceita a Condição Berserk para a cena, e em troca, recebe uma classificação de armadura igual à sua classificação Manto. Esta armadura mágica não empilha com armadura mundana, é eficaz contra todos os tipos de danos, e pode aparecer em qualquer forma que o personagem deseja, desde vestes sedosas fluindo, até chapa de bronze em chamas. A armadura desaparece no final da cena e a Condição se resolve ao mesmo tempo. Se o desejo perdido de acabar com os efeitos cedo, ele deve gastar um ponto de força de vontade para resolver a Condição e remover a armadura. Se a Condição for removida por outra fonte antes de expirar, a armadura também será dissipada. Este Contrato não pode ser combinado com a liberação de um efeito similar, conferindo assim uma condição “duplo-Berserk”.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-beyond-hedge:name-solstice-revelations": {
    action: "Instantânea",
    duration: "One Turno per success",
    success:
      "A luz inunda a área até um raio de 30 metros. Em qualquer lugar a luz brilha a capacidade de se esconder ou se disfarçar é reduzida a um rolo casual, e qualquer personagem anteriormente escondido ou disfarçado deve fazer um rolo casual ou ser revelado. Quem emprega poderes sobrenaturais para se disfarçar ou se esconder deve fazer um rolo Stealth + Fado (substituindo a potência do sangue, Urge Primal ou Traits semelhantes, se possuído) em uma penalidade -5 ou perder a proteção desses poderes também. Até a Máscara pisca e enfraquece nesta luz; qualquer um que pudesse ver através da Máscara pode fazer um rolo de percepção padrão para ver os miens de qualquer changeling ou tokens que olhar. Uma vez que a luz tenha desaparecido, qualquer pessoa pode tentar esconder-se ou disfarçar-se sem pena.",
    exceptionalSuccess:
      "A luz reveladora persiste por duas voltas por sucesso e o personagem pode acabar com ela mais cedo.",
    page: 140,
  },
  "h-beyond-hedge:autumn-babel-s-curse": {
    action: "Instantânea",
    duration: "",
    success:
      "O indivíduo visado é incapaz de se comunicar de qualquer forma para uma série de voltas iguais aos sucessos do changeling (com um ponto de força de vontade a duração pode se tornar uma cena). Isto inclui meios verbais, escritos, físicos ou sobrenaturais. Não se trata simplesmente de perder a voz ou de esquecer como se escreve; a base compartilhada para comunicar ideias se quebra para o alvo, deixando-os capazes de falar palavras, escrever cartas ou usar gestos, mas não de tal forma que eles tenham qualquer significado para os que os rodeiam. O mais fundamental das comunicações: um grito de alarme, um grito de dor ou um riso alegre pode ser comunicado; qualquer coisa mais complexa é mexida até que seu significado se perca completamente.",
    exceptionalSuccess:
      "Como com um sucesso comum, no entanto, durante a duração do Contrato, o indivíduo alvo também sofre a condição de Sinestesia.",
    page: 140,
  },
  "h-beyond-hedge:dead-men-s-tales": {
    action: "Prolongada",
    duration: "One Cena",
    success:
      "A sombra aparece e irá responder a uma pergunta por sucesso com precisão e honestidade, mas não fornecerá qualquer informação adicional além do que é solicitado.",
    exceptionalSuccess:
      "A sombra fornecerá qualquer informação adicional importante que o changeling poderia não ter conhecido para pedir, ou sabia que ela precisava.",
    page: 141,
  },
  "h-beyond-hedge:ghostly-presence": {
    action: "Instantânea",
    duration: "One Cena",
    success:
      "O changeling interage com, vê, ouve e pode falar com fantasmas e outros em Twilight na área como se estivessem vivendo, inclusive sendo capaz de atacá-los fisicamente. Os fantasmas também podem interagir com o changeling durante este tempo, para o bem ou para o mal. Helldivers usando sua bênção kith pode optar por interagir com o usuário deste Contrato em sua opção expressa.",
    exceptionalSuccess: "",
    page: 141,
  },
  "h-beyond-hedge:persephone-s-doorway": {
    action: "Instantânea",
    duration: "One night per success",
    success:
      "O changeling cria um portal bidirecional entre o mundo vivo e o mundo dos mortos, que pode ser passado de qualquer direção para a duração da existência do portal. Uma vez o contrato",
    exceptionalSuccess: "",
    page: 141,
  },
  "h-beyond-hedge:banshee-s-wail": {
    action: "Disputada",
    duration: "",
    success:
      "Todos aqueles dentro de um número de jardas iguais a (Manto x 10), amigo ou inimigo, devem fazer a resistência reflexiva rolar. Aqueles que falham sofrem os seguintes efeitos: • Tome uma série de níveis de danos de bater igual ao Manto do personagem. • Sofrer as seguintes Condições para o resto da cena: Surdo, Assustado. Aqueles que sucedem seus rolos de resistência ainda sofrem a condição surda para voltas (Manto).",
    exceptionalSuccess:
      "Como sucesso, mas alvos que não resistem também sofrem a condição amaldiçoada por uma semana depois.",
    page: 142,
  },
  "h-beyond-hedge:bauble-of-the-mind": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling remove a memória (declarada em termos gerais como “dia do seu casamento” ou “seu aniversário de dezesseis anos” ou “você não se lembra de me ver”) da vítima e armazena-a dentro do item; a vítima mantém apenas uma lembrança nebulosa do evento como se fosse um sonho e não consegue lembrar detalhes. A memória é breve e finita, um evento de algumas horas; este Contrato não pode remover faixas inteiras das memórias de uma vítima.",
    exceptionalSuccess:
      "A memória é tão rica que o changeling invocando o Contrato recupera o ponto de força de vontade gasta.",
    page: 143,
  },
  "h-beyond-hedge:elfshot": {
    action: "Instantânea",
    duration: "",
    success:
      "Este Contrato cria um “dardo” nas mãos do changeling, que pode então ser jogado em um alvo para infligir danos. As características das armas são as seguintes: Danos (Manto)L, Intervalos 10/20/40 jardas/metros, Pena de iniciativa 0, Tamanho 1. Se o jogador também gasta um ponto de força de vontade, o dano é agravado. O dardo retorna para sua mão no início de cada turno para a duração do contrato. As vítimas mortas pelo dardo exibirão sinais de morte mundana, tais como derrame, ataque cardíaco, aneurisma ou condições similares quando examinadas por meios médicos.",
    exceptionalSuccess: "O dardo também inflige o Stunned Tilt em um sucesso.",
    page: 143,
  },
  "h-beyond-hedge:name-haunted-house": {
    action: "Instantânea",
    duration: "1 week or 1 month",
    success:
      "Com o gasto de 2 Glamour, o changeling pode fazer com que o Fado manifeste vários efeitos audiovisuais tipicamente associados a casas assombradas: pisos, passos, gritos, gritos e sussurros, pontos frios, sombras e objetos em movimento e muitos outros efeitos semelhantes. O personagem pode adaptar os efeitos a específicos, se ela deseja, ou apenas permitir que o Fado para fazer o seu trabalho; o Fado tem uma incrível capacidade de explorar os sonhos de invasores e trazer seus medos para a vida. Estes efeitos só se manifestam quando qualquer outro que não o changeling que invocou o Contrato entra no local (que não pode ser maior do que uma casa grande; ao ar livre a área é igual a 10 metros quadrados por ponto de Fado). Qualquer outra pessoa que os Perdidos não designem especificamente deve fazer um rolo Resolva + Autocontrole contra a Presença dos metamorfos + Intimidação + Fado ou sofrer imediatamente a Condição Assustada. Se o personagem aflito sair imediatamente, a Condição se resolve no final da cena. Para cada minuto que permanecem dentro da casa assombrada, eles devem fazer outro rolo, como acima; se falharem um segundo rolo, eles ganham a Condição Abalada. Se continuarem, e falharem uma terceira vez, ganham a Condição Assustada e fogem completamente da casa. Se o indivíduo tiver sucesso em três rolos contestados, são imunes a outros efeitos da casa assombrada e podem continuar a explorar o local normalmente. Para cada ponto de Glamour gasto além do inicial 2, o changeling pode impor uma penalidade -1 para rolos contestados para intrusos até um máximo de -5. Cumprindo o Loophole neste Contrato apenas remove o Glamour inicial 2. Os efeitos persistem por uma semana no mundo mortal, ou um mês se o changeling usar este Contrato para proteger sua Hollow ou outro local dentro da Sebe.",
    exceptionalSuccess: "",
    page: 144,
  },
  "h-beyond-hedge:wake-the-dead": {
    action: "Instantânea",
    duration: "",
    success:
      "O cadáver deve ser bastante fresco ou ter sido preservado, como os encontrados em uma funerária antes de ser enterrado ou cremado; cadáveres enterrados por mais de um mês são demasiado decompostos para ser de uso para o changeling. Em um sucesso, ele sobe como um zumbi sob o controle do changeling e permanece ativo por três dias antes de desmoronar em pó e pedaços de osso. As estatísticas básicas para um zumbi estão abaixo.",
    exceptionalSuccess:
      "Em um sucesso excepcional, o zumbi ganha +1 para Força, resistência e inteligência, tornando-o capaz de executar outras tarefas simples, além de atacar inimigos.",
    page: 144,
  },
  "h-beyond-hedge:name-whispers-in-the-dark": {
    action: "Prolongada",
    duration: "One Cena",
    success:
      "Cada rolo representa uma volta de “ouvir”, em que o changeling está em uma pena de 2 morrer para todas as outras ações. Um número de sucessos (determinados pelo contador de histórias com base na obscuridade das informações solicitadas) é necessário para recuperar as informações desejadas. Uma vez atingido esse número, o changeling aprende as informações específicas, mesmo na medida em que ouve os comentários sussurrados originais.",
    exceptionalSuccess:
      "A conexão com o que quer que esteja fornecendo o insight também concede um dos seguintes Méritos para as próximas 24 horas, escolhidos aleatoriamente (ou pelo Contador de História): Sentido de Perigo, Memória Eidética, Conhecimento Enciclopédico, Olho para o Estranho, Indomável, Médio, Mente de um Madman, Sensibilidade de Omen, Lore sobrenatural (um tipo de sobrenatural não-fae) ou Tolerância para Biologia.",
    page: 146,
  },
  "h-beyond-hedge:withering-glare": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling deve conseguir ver o alvo dela. Um sucesso neste Contrato faz com que o alvo sofra tanto o Arm Wrack Tilt quanto o Leg Wrack Tilt, à opção do changeling. Esta inclinação permanece para a cena antes de se resolver.",
    exceptionalSuccess: "O alvo também sofre o Immobilized Tilt para a cena.",
    page: 146,
  },
  "h-beyond-hedge:winter-mindveil": {
    action: "Reflexiva",
    duration: "One Cena",
    success:
      "O Lost adiciona sua classificação em Manto a todos os rolos de resistência contra poderes que tentam ler ou controlar sua mente. Se ela resistir com sucesso, os leitores da mente só vêem escuridão e ouvem apenas o uivo do vento através de uma geleira. O changeling pode seletivamente permitir o uso da telepatia em si mesma como desejado, para permitir que os aliados comuniquem sem palavras, se necessário.",
    exceptionalSuccess: "",
    page: 147,
  },
  "h-beyond-hedge:veil-of-tears": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling vai antes de seu alvo no turno seguinte, independentemente de quais foram suas ordens de iniciativa originais.",
    exceptionalSuccess:
      "Como um sucesso, mas o alvo também sofre a condição letárgica.",
    page: 147,
  },
  "h-beyond-hedge:curse-of-fading": {
    action: "Instantânea and Disputada (See below)",
    duration: "",
    success:
      "Se o changeling marcar mais sucessos do que a vítima, a vítima desaparece lentamente ao longo do próximo round, tornando-se efetivamente preso em um estado semelhante a, mas diferente de, Twilight. Enquanto neste estado de não-existência, eles não podem ser vistos, ouvidos ou sentidos por ninguém no mundo real ou na Sebe sem o uso de meios mágicos (como Auspex, o Contrato de Presença Fantasma ou por aqueles que empregam Sussurros da Manhã). A vítima pode ver e ouvir no mundo real, mas é impotente para afetá-lo de qualquer forma. A vítima permanece neste estado por um número de dias igual à classificação de Manto do changeling; depois desse tempo, eles lentamente desaparecem de volta ao mundo real ao longo de uma rodada. (Nota: Este Contrato é essencialmente o mesmo que Sussurros da Manhã, exceto que só pode ser usado em outro alvo, não o changeling ela mesma.)",
    exceptionalSuccess:
      "Quando a vítima regressa ao mundo real, sofre a condição de Fuga até que possa ser resolvida.",
    page: 147,
  },
  "h-beyond-hedge:my-sorrow-is-my-armor": {
    action: "Reflexiva",
    duration: "One Cena",
    success:
      "O personagem aceita a condição de numb para a cena, e em troca, ignora uma série de penalidades de ferimento igual à sua classificação Manto. O personagem continua a agir mesmo que trazido abaixo incapacitado enquanto este Contrato estiver em vigor; uma vez que termina, suas feridas fazem pleno efeito. Caso o desejo perdido de acabar com os efeitos cedo, ele deve gastar um ponto de força de vontade para resolver a condição e remover a proteção. Se a condição for removida por outra fonte antes de expirar, a proteção é igualmente dissipada. Este Contrato não pode ser combinado com a liberação de um efeito similar, conferindo assim uma condição “duplo-Numb”.",
    exceptionalSuccess: "",
    page: 148,
  },
  "h-beyond-hedge:soul-rime": {
    action: "Disputada",
    duration: "",
    success:
      "O alvo que deixa de resistir descobre que seu pesar se duplica em seus corações e nas estradas da vida sempre levam ladeira abaixo às trevas. As vítimas sofrem a condição quebrada até serem resolvidas.",
    exceptionalSuccess:
      "Como acima, e a vítima também sofre a Loucura Persistente Condição focada no desespero até resolvido. Vítimas fracas normalmente terminam suas próprias vidas, não vendo como escapar da escuridão em seus corações.",
    page: 148,
  },
  "h-courts:celestial-summons": {
    action: "Instantânea",
    duration: "Special",
    success:
      "O sujeito sabe que o changeling deseja sua presença e é compelido a chegar até ele. Ela não vai arriscar danos físicos ou outras consequências graves; por exemplo, ela não iria sair de seu trabalho à vista da construção, mas ela poderia contactar o chefe deles e dizer que há uma emergência. No entanto, assim que puder razoavelmente fazê - lo, ela chegará lá. O sujeito deve estar dentro do mesmo espaço livre ou cidade que o changeling, e ela deve ter um meio viável (se não for razoável) de alcançá-lo. A compulsão dura até o final do capítulo ou até que o personagem atinja o changeling, o que vier primeiro.",
    exceptionalSuccess:
      "O contrato funciona mesmo fora do freehold, inclusive no Sebe. Se o changeling conseguir excepcionalmente, ela pode adiar este efeito até que se mude, se desejar, mas ela deve fazê-lo antes do próximo nascer do sol.",
    page: 105,
  },
  "h-courts:climate-change": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-courts:celestial-m-ight": {
    action: "Instantânea",
    duration: "Turns equal to Mantle",
    success:
      "O changeling coleciona luz solar ou luar em uma arma, fazendo-o brilhar embotado. Ele vai lidar com seu bônus de dano arma como dano agravado (ou um mínimo de um ponto, se isso é normalmente zero) para a duração, embora sucessos rolados apenas infligir o tipo de dano normal. Este poder só pode ser usado no momento apropriado para o tribunal da mudança de Ling (dia para o Sun Court, noite para o Moon Court), e ela deve estar ao ar livre.",
    exceptionalSuccess: "A ação é reflexiva.",
    page: 106,
  },
  "h-courts:celestial-shield": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling forma o luar ou a luz solar num tampão animado e transparente. Ela pode transformá-lo em um pequeno escudo que pode ser mantido em uma mão, ou ela pode moldá-lo em uma barricada imóvel (Tamanho 6), que até três pessoas podem caber atrás. Como um objeto portátil, ele funciona como um escudo normal, mas também reduz qualquer dano ao empunhador em dois, independentemente da fonte (exceto para ferro frio). Como barreira, o objeto concede àqueles que estão por trás dos efeitos do Concealment Substancial e Dure Cover ( Changeling, p. 186), com Durabilidade igual ao Manto do changeling, além do efeito de redução da idade da barragem. Sun: Se o changeling está usando a versão portátil, ela não sofre penalidade por usar um escudo. Lua: Se o changeling está usando a versão barricada, ela pode torná-lo opaco, escondendo-se e quaisquer aliados.",
    exceptionalSuccess: "",
    page: 106,
  },
  "h-courts:vigil-of-silver-and-gold": {
    action: "Instantânea",
    duration: "Until the next sunset/sunrise",
    success:
      "O changeling traça um sol ou lua em quatro cantos de uma área de até trezentos metros quadrados. Durante a duração, o changeling pode sentir todos os que saem ou saem da área. Se ela os conhece pessoalmente, vai sentir quem é. Se não, ela tem um senso geral, como “um Ogre” ou “um motorista de caminhão”. Isto inclui iden tiffing outras criaturas sobrenaturais, embora nem sempre claramente. “Um cadáver errante” pode ser um vam pire esboçado ou um zumbi sem mente, por exemplo. Pessoas ou criaturas supernaturalmente escondidas cruzando o limiar pro voke um Confronto de Vontades.",
    exceptionalSuccess: "",
    page: 106,
  },
  "h-courts:family-friendly-feud": {
    action: "Instantânea",
    duration: "",
    success:
      "Durante a duração, todos os danos causados pela violência nas proximidades do changeling são degradados por um nível de letalidade: Os danos agravados tornam-se danos letais, os danos letais tornam-se golpes, e os danos de esmagamento são reduzidos para metade. Isto aplica-se a todos os presentes, incluindo o changeling.",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-courts:frozen-in-time": {
    action: "Disputada",
    duration: "Turns equal to Wyrd",
    success:
      "O changeling fala com a vítima sobre qualquer assunto. O cérebro do sujeito se concentra em uma frase falada em particular e fica preso num loop de memória. Durante todo o tempo, ele sofre do Tunned Tilt, mas vai acabar cedo se ele sofrer algum dano letal. A vítima deve ser capaz de ouvir o changeling o suficiente para entender suas palavras, mas não precisa entendê-las.",
    exceptionalSuccess:
      "A experiência é tão desorientadora que o sujeito sofre também a condição abalada.",
    page: 108,
  },
  "h-courts:hearth-s-respite": {
    action: "Instantânea",
    duration: "Week",
    success:
      "O changeling gasta algum tempo limpando ou redecorando um lugar onde ela possui ou vive. Para a duração, o edifício confere uma sensação de estabilidade e calma que relaxa até mesmo as mentes mais caóticas. Qualquer bem-aventurança que venha cá dentro cura um nível de danos leves por cada hora que passam lá. Além disso, qualquer um que participe em comida ou bebida aplica uma penalidade de 2-die para o próximo ataque Clarity que eles suf fer ou um bônus de 2-die na primeira quebra Integrity na próxima semana. Finalmente, é difícil até imaginar perturbar a paz em tal ambiente; todos os rolos para ser agressivo ou violento perder a qualidade 10 novamente.",
    exceptionalSuccess:
      "Qualquer um que cura um ponto de claridade danos desta forma também cura a sua condição de claridade mais antiga.",
    page: 108,
  },
  "h-courts:book-of-courts-protection-of-the-innocent": {
    action: "Instantânea",
    duration: "One lunar month",
    success:
      "Qualquer habilidade sobrenatural que visa o mortal sofre uma penalidade na ativação igual ao Manto do changeling. Se não tem rolo, simplesmente falha. Além disso, o mortal ganha armadura geral igual ao Manto do changeling contra danos de fontes sobrenaturais, e qualquer ação mundana tomada por uma criatura sobrenatural que infligiria dano físico ao mortal perde a qualidade 10 novamente.",
    exceptionalSuccess:
      "O mortal também recebe um nível de armadura geral contra dano mundano.",
    page: 109,
  },
  "h-courts:shared-remem-brance": {
    action: "Disputada",
    duration:
      "Up to one hour or the length of the mem ory, whichever is shorter.",
    success:
      "A visão do changeling se desvanece, e ele vê uma memória através dos olhos do sujeito. Ele pode escolher qualquer memória que esteja ciente, seja por hora e data, como “o décimo oitavo aniversário de Maria às 18h”, ou conteúdo, como “expulsão da faculdade”. Alternativamente, a mudança pode ver a mais recente memória emocionalmente intensa do assunto. Ele ganha a qualidade de 8 novamente em rolos de Empatia envolvendo esse assunto para o resto do capítulo.",
    exceptionalSuccess: "O changeling pode ver até três horas de memória.",
    page: 109,
  },
  "h-courts:nothing-to-see-here": {
    action: "Instantânea",
    duration: "",
    success:
      "Nevoeiro rola dentro, camuflando uma área exterior de (Manto × 2) quilômetros, embora uma janela aberta ou outro portal fará com que o nevoeiro para rastejar dentro de casa também. O nevoeiro inflige uma penalidade à Percepção igual ao Manto do changeling e proporciona um bônus proporcional às ações mundanas Stealth. O changeling e até (Manto) outros indivíduos que ela especifica são imunes à pena de percepção. Contratos e outros efeitos sobrenaturais destinados a esconder ou disfarçar beneficiar do efeito 9-de novo dentro da névoa, e mortais com resolução inferior ao Manto da mudança racionalizar quaisquer encontros sobrenaturais dentro dele como truques da mente.",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-courts:rain-of-terror": {
    action:
      "Disputada and Prolongada (every 5 successes extends the storm for a Cena, and each roll represents two turns, with a maximum number of rolls equal to Mantle)",
    duration: "",
    success:
      "O changeling convoca uma tempestade exibindo fenômenos bizarros de sua escolha, estendendo-se para (Manto × 2) quilômetros, centrado em si mesmo. Embora isso não cause dano físico, é desconcertante. Qualquer um que opere na tempestade não natural, para além do changeling, sofre a condição de distração. Os mortais não podem contestar os efeitos deste Contrato, e mesmo aqueles que o assistem de segurança sofrem a condição de medo, medo ou tremor. Os que estão directamente expostos ao tempo que não conseguiram provar o contrato também sofrem a condição de loucura. Uma vez que a tempestade termina, todas as condições associadas terminam sem resolver.",
    exceptionalSuccess:
      "Aqueles que ganham a condição de loucura da tempestade também sofrem a condição de ilusão ou Fuga, se o changeling desejar. Todos os afetados recebem a mesma condição.",
    page: 111,
  },
  "h-courts:storm-of-the-century": {
    action:
      "Prolongada (target is 5 successes; each roll rep resents two turns, with a maximum number of rolls equal to Mantle)",
    duration: "Hours equal to Mantle",
    success:
      "O changeling, que deve estar ao ar livre, soma mons padrões climáticos violentos, estendendo-se para (Manto × 2) quilômetros, centrado em si mesma. Exceto para o changeling, a tempestade afeta todos indiscriminadamente, a menos que eles são protegidos de alguma forma (ver abaixo). A tempestade não pode acabar cedo. O changeling escolhe um efeito para cada sucesso: • Aumente o nível de Extreme Environment em 1, até um total de (Manto – 1). • Imponha uma inclinação ambiental apropriada, como Blizzard, Extreme Cold, Extreme Heat, Inundado, Chuva pesada, Ventos pesados (de até o manto da muda), ou Gelo. • Infligir trovões e relâmpagos. Para um sucesso, estes podem infligir temporariamente a inclinação cega ou surda em personagens com uma resistência inferior ao manto do changeling. Para dois sucessos, o relâmpago atinge um alvo aleatório a cada (6 – Manto) voltas. Para três sucessos, o changeling pode usar sua ação para escolher um alvo. Relâmpagos infligem (Manto + Fado) golpeando danos. • Faça uma pessoa ou objeto imune à tempestade. • Prolongar a duração da tempestade por (Manto) horas.",
    exceptionalSuccess: "O dobro da duração da tempestade.",
    page: 111,
  },
  "h-courts:tempestuous-hearts": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling pode incitar Bedlam usando seu sistema usual (o custo está incluído na atividade do contrato), canalizando seu Glamour em uma tempestade, nevasca, nevoeiro, ou outra condição meteorológica notável. Os que testemunham o clima infundido em Glamour são afetados por Bedlam como se pudessem sentir o changeling. Calma. O changeling pode canalizar este Contrato através de condições climáticas calmas, até uma distância de (Manto × 2) quilômetros. Tempestade: O changeling adiciona seu Manto ao rolo ao incitar Bedlam com este Contrato.",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-courts:thunder-steed": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling deve estar fora e exposto a uma tempestade ou céu completamente nublado, natural ou não. Ela desaparece como um raio atinge o ponto onde está. Ela pode então rapidamente viajar para qualquer ponto fora sob a mesma tempestade dentro (Manto × 2) quilômetros, chegando com outro raio. Qualquer um além do changeling atingido pelo parafuso sofre danos (Manto + Fado) batendo. Calma. O changeling pode trazer outras pessoas tocando-a quando ela viaja, protegendo-os dos danos do relâmpago também. Tempestade: A partida e chegada do changeling causa ondas de choque violentas até (Manto × 3) metros, infligindo o Knocked Down Tilt em qualquer um que não conseguir obter mais sucesso em um reflexivo Dexterity + Esportes rolo do que o changeling Manto.",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-courts:aether-crossing": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Para usar este Contrato, o changeling deve ser capaz de tocar uma representação de um dos quatro elementos grandes o suficiente para contê-lo (e idealmente, ainda maior que isso). Este pode ser um pequeno lago, uma brisa leve, ou um inferno que se estende através de uma sala. Avançando, o changeling desaparece no elemento e reaparece do outro lado ou em outro lugar ao longo de seu comprimento, desde que não esteja mais longe do que seu Manto em metros. Este efeito pode contornar barreiras enquanto o elemento pelo qual o changeling salta tiver acesso ininterrupto ao lado oposto, mesmo que ele não tenha conhecimento do que está além. O que conta como ininterrupta é um pouco ambíguo. A fumaça de um fogo florestal é considerada uma parte da chama, mas um bunker de concreto não é o mesmo que o solo e pedra em torno dele. Em caso de dúvida, o contador de histórias tem a palavra final. Fogo: Depois de sair de um inferno ou outro tipo de fogo de trapo, o changeling pode levar consigo alguma da chama. Para as próximas três voltas, tudo o que ele toca é colocado em chamas, se possível. Estas chamas não lhe fazem mal até que ele siga em frente. Terra: O changeling pode fundir-se com minerais e metais feitos pelo homem, como concreto e aço, e trata-os como contíguos com terra natural e pedra. Ar: Ao se fundir com uma rajada de vento, a muda pode permitir-se ser transportada ao longo da brisa por um número de minutos igual à sua classificação Manto antes de ser depositado com segurança no chão. Água: Ao fundir-se com um corpo de água, o changeling pode sair em qualquer lugar dentro de um número de quilometros iguais ao dobro do seu Manto, que estende a duração do contrato ao resto da cena.",
    exceptionalSuccess: "",
    page: 114,
  },
  "h-courts:book-of-courts-age-of-aquarius": {
    action: "Disputada",
    duration: "One week or Capítulo, whichever is shorter",
    success:
      "O changeling nomeia uma categoria geral de pessoa, como um “músico”, “avó” ou “criminoso”, e outros percebem o sujeito como membro desse grupo durante todo o tempo. Isso na verdade não muda sua aparência ance, mas a associação é tão forte mesmo amigos próximos têm dificuldade em reconhecê-la, e seus jogadores devem ter sucesso em um rolo Raciocínio + Autocontrole com uma penalidade igual ao Manto da mudança para fazê-lo. Se falharem, a vítima pode sofrer um ponto de ruptura, dependendo de sua relação. Mesmo o mundo esquece o real dela, concedendo ao sujeito uma série de pontos temporários iguais ao dobro do Manto do changeling para distribuir entre Merits appro price para a nova persona. No entanto, a vítima também perde o acesso a todos os Méritos inadequados para esta identidade (mas pode temporariamente reatribuí-los de acordo com a santidade de Méritos, se o seu jogador quiser). O changeling e a sua influência não são afectados por este contrato e conhecem a vítima pelo que ela realmente é.",
    exceptionalSuccess:
      "A identidade redefinida do sujeito persiste por uma história ou uma semana, o que for mais longo. Raramente, isso pode trazer permanentemente peças do destino alternativo para a realidade (se o jogador de uma vítima gastar Experiências para adquirir permanentemente qualquer um dos Méritos concedidos por este Contrato ou a critério do contador de histórias).",
    page: 115,
  },
  "h-courts:assuming-the-stellar-m-antle": {
    action: "Instantânea",
    duration: "Week",
    success:
      "Os efeitos deste Contrato dependem do signo solar do sujeito: Os sinais de fogo tornam-se mais apaixonados e aventureiros, os sinais de ar mais conversacionais e introspectivos, os sinais de terra mais retirados e pragmáticos, e os sinais de água mais sensíveis às pessoas ao seu redor. O subjecto ganha três Especialidades temporárias de Habilidade que reflectem o seu sinal (ver barra lateral para exemplos). Sempre que tomam uma acção que beneficia de uma destas especialidades, são excepcionalmente bem sucedidos em três casos, para além do bónus habitual. Alcançar um sucesso excepcional desta forma restaura um ponto de força de vontade, além de quaisquer outros efeitos (os sujeitos metamorfos podem optar por recuperar um ponto de Glamour em vez disso).",
    exceptionalSuccess:
      "O contrato dura até que o zodíaco se mova para o próximo sinal, ou o sinal depois disso, se isso mudar em menos de uma semana.",
    page: 115,
  },
  "h-courts:elemental-cycle": {
    action: "Instantânea",
    duration: "Permanent",
    success:
      "Com um movimento de varredura de sua mão, o changeling afeta uma área até seu Manto em Tamanho, trans formando-o em um dos outros três elementos. Se isso faria com que algo caísse sobre alguém, como trans formando o ar acima deles em água, isso infligiria dano igual ao seu Manto, a menos que a vítima conseguisse um rolo de Dexteridade + Atletismo. A área afetada deve ser predominantemente composta de algo geralmente aceito como um dos quatro elementos (o contador de histórias é o árbitro final), e transforma-se em um exemplo não notável do novo material. O changeling não pode transformar água em ouro, mas ela pode transformá-la em sujeira. Fogo: Se o changeling criar fogo com este Contrato, ele queimará para o resto da cena, independentemente do combustível disponível ou tentativas de apagá-lo sem magia. Não se espalhará, embora possa iniciar incêndios por satélite tão susceptíveis de serem utilizados como qualquer incêndio regular. Terra: Se o changeling cria terra com este Contrato, pode ser qualquer mineral natural, não processado ou metal (exceto ferro, naturalmente) uma vez por história. Ar: Se o changeling cria ar com este Contrato, ela pode desencadeá-lo como um vento uivante, infligindo o Knocked Down Tilt em qualquer um pego na explosão. Água: Se o changeling cria água com este Contrato, triplica a área que pode transformar.",
    exceptionalSuccess: "",
    page: 116,
  },
  "h-courts:restringing-the-loom": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O changeling corta um fio de destino, destino ou condenação imposto a seu sujeito, libertando-os de sua influência. Isto não pode sunder destinos inerentes ao assunto, apenas aqueles impostos sobre eles por magia exterior, como o Girando Roda e Horóscopo Contratos, ou habilidades estranhas, como bruxaria mago ou feitiços fantasmagóricos. Este tipi cally provoca um Confronto de Vontades, que o changeling adiciona seus pontos Manto. Fogo: Opondo-se ao Confronto de Vontades não se beneficia de truques de dados (por exemplo, a qualidade 10 novamente). Terra: O changeling pode usar um dos seus Atributos de Resistência para calcular o seu Confronto de Wills em vez de um Atributos Finesse. Ar: O confronto de Wills do changeling se beneficia da qualidade 8 novamente. Água: Opondo-se ao Confronto de Vontades não adiciona nenhum bônus de duração ao rolo.",
    exceptionalSuccess: "",
    page: 116,
  },
  "h-courts:all-roads-closed": {
    action:
      "Prolongada (target is 10 successes; each roll rep resents one minute)",
    duration: "Capítulo",
    success:
      "Como o changeling acumula sucessos, Glamour sufoca a área, um ponto para cada uma das direções dinal carro. Espalha-se em um raio de quilômetros igual a Manto × 2, causando estragos em qualquer estrada, trilha, trilha, ou outro caminho que leva ao local que a mudança quer defender. No entanto, ele deve ter visitado este local pelo menos uma vez antes. Como o Contrato toma posse, perigos e outras obsta cles aparecem em qualquer caminho para o local defendido. Os semáforos podem ficar vermelhos, levando ao engarrafamento; as árvores podem cair em trilhas arborizadas; a raiva da estrada pode causar confrontos e carros estacionados bloqueando ruas. Névoas e nevoeiro sobem do chão. Qualquer viajante que tente lidar ou contornar esses obstáculos deve gastar uma força de vontade para até mesmo tentar superá-los; mais ainda, eles sofrem uma penalidade em quaisquer rolos relevantes iguais aos pontos Manto do changeling. Quando a duração expira, os mortais afetados esquecem e racionalizam os detalhes, ficando confusos quanto ao que estava acontecendo. Dentro da Sede, trate isso como uma mudança de paradigma, onde a própria Sede se curva aos desejos do changeling. Isso permite que ela promulgue mudanças sem gastar suc cesses, até o número de sucessos rolados para ativar este Contrato.",
    exceptionalSuccess:
      "O changeling torna-se consciente de qualquer pessoa tentando encontrar ou atacar o local que ele está defendendo dentro da área de efeito. Ele sabe sua localização e progresso através dos obstáculos, mas não suas identidades.",
    page: 133,
  },
  "h-courts:cast-out": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling força a Sebeway mais próxima dentro da área aberta. Seu oponente é forçado através, saindo ou entrando na Sebe, conforme apropriado. O Sebeway fecha imediatamente e não vai responder aos apelos da vítima ou Glamour. Ele permanece fechado durante a duração, encadernando-os no outro reino. Se houver várias Sebeways na área, o changeling escolhe qual abre.",
    exceptionalSuccess:
      "A expulsão é particularmente forte; a vítima sofre danos iguais ao Manto do changeling (se ela optar por infligi-lo).",
    page: 134,
  },
  "h-courts:create-path": {
    action:
      "Prolongada (10 successes required; each roll represents one Turno of Hedgespinning)",
    duration: "Special",
    success:
      "A poderosa magia deste Contrato torce a Sebe para os desejos do changeling, criando um novo passo. A classificação do pisado é igual ao Manto do personagem e dura até que ele finalmente termine sua jornada. O ponto final do trod é determinado pelo changeling quando ele atua este Contrato. Note que este efeito não esconde as criaturas pisadas ou pré - ventiladas de viajar nele. Além disso, o changeling deve estar na Sede para invocar este poder.",
    exceptionalSuccess:
      "O changeling pode definir quaisquer marcos ao longo do caminho, garantindo algum grau de segurança.",
    page: 134,
  },
  "h-courts:escape-route": {
    action: "Instantânea",
    duration: "",
    success:
      "Ao abrir um portão para dentro (ou para fora) da Sebe através de portais, o portão simplesmente abre sem um pedido. Assim que o changeling passar, o portal fecha-se, antes da ventilação. Durante a duração, a Chave do portal deve ser usada para abri-la; Glamour sozinho não é suficiente. Ao gastar um ponto de força de vontade, o changeling também pode ditar onde o portal abre neste caso, embora não possa ser um local seguro onde eles não são bem-vindos.",
    exceptionalSuccess: "",
    page: 134,
  },
  "h-courts:labyrinth": {
    action: "Disputada",
    duration: "Turns equal to Mantle",
    success:
      "As percepções da vítima se transformam em um labirinto ilusório, temporariamente preso dentro de sua própria mente. Eles não podem realizar quaisquer ações físicas e não se beneficiam da Defesa. No entanto, se sofrem algum dano, imediatamente se libertam de sua prisão mental. A vítima pode tentar se libertar em cada turno subsequente, contestando Resolva + Fado novamente contra os sucessos do changeling no rolo de ativação. No entanto, mesmo que a vítima se liberte por conta própria, eles sofrem o Stunned Tilt. Uma vez livre, a vítima (se um changeling) sofre um ataque de clareza com dados iguais ao Manto do atacante. Posteriormente, o Direcional Courtier sofre seu próprio ataque Clarity com 3 dados.",
    exceptionalSuccess:
      "A vítima permanece presa no labirinto para a cena do crime e não pode sair mais cedo. Os danos sofridos libertam o sujeito da armadilha como nem mal, no entanto.",
    page: 135,
  },
  "h-courts:harmony-enforced": {
    action: "Disputada",
    duration: "",
    success:
      "Todo mundo dentro (Fado × 10) do changeling ganha o Beaten Down Tilt para a duração; narrativamente, os personagens são meramente menos hostis em vez de ter a luta nocauteada deles. Note que isso não resolve nenhum argumento ou conflito se estiver em andamento — simplesmente impede a violência física. Se o changeling que causou este Tilt promulgar a violência, acaba por ser derrotado.",
    exceptionalSuccess:
      "Os participantes também são mais passíveis de resolver as coisas. O changeling ganha um +2 em rolos sociais para suavizar as coisas.",
    page: 137,
  },
  "h-courts:one-with-the-elements": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 137,
  },
  "h-courts:shifting-balance": {
    action: "Instantânea",
    duration: "",
    success:
      "Para cada ponto Manto que ela possui mais um, o changeling pode mudar um ponto da defesa de um personagem disposto, Iniciativa, ou Velocidade para outro desses traços, incluindo seu próprio. Por exemplo, com Manto 3, ela tem quatro pontos para mudar, usando-os para tirar dois de Iniciativa e Velocidade para aumentar a Defesa. No entanto, um traço não pode ser reduzido a zero. O changeling não pode usar esse efeito em um personagem mais de uma vez por cena. Este Contrato apenas afeta as classificações naturais do sujeito; não pode mudar pontos concedidos por outros meios, como drogas ou poderes sobrenaturais. Sociedade da Manhã: Ao usar este contrato para outro, o cortesão ganha insight sobre essa pessoa, aprender a sua agulha e fio (ou equivalente). Sociedade do Dia: O changeling também pode mudar os pontos de habilidade da mesma forma, mas apenas dentro da mesma categoria (ou seja, mental, física ou social). Sociedade da Noite: O changeling também pode gastar pontos em armadura geral, mas isso custa dois pontos por nível.",
    exceptionalSuccess: "",
    page: 138,
  },
  "h-courts:steal-harmony": {
    action: "Resisted",
    duration: "Equal to successes",
    success:
      "O changeling seleciona uma das categorias de habilidades de sua vítima (Mental, Físico ou Social). Durante a duração, o sujeito leva usando qualquer habilidade nessa categoria sofrer uma penalidade igual ao Manto do changeling. Por exemplo, se um changeling com Manto 4 e dois sucessos usa isso em um oponente e declara Físico como a categoria, as duas próximas ações que o alvo leva usando qualquer uma dessas oito Habilidades sofrem uma pena de 4-die.",
    exceptionalSuccess:
      "O changeling pode selecionar uma segunda categoria de habilidade esta potência afeta.",
    page: 138,
  },
  "h-courts:weaponize-m-ob": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling dá um discurso ou grito de protesto, vilizando uma pessoa ou organização na área imediata, infligindo o Riot Tilt; a vítima não precisa ser a fonte original da raiva da multidão. O alvo da ira da turba sofre danos conforme a descrição do Tilt; todos os outros sofrem",
    exceptionalSuccess: "",
    page: 138,
  },
  "h-courts:davy-jones-locker": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling faz do ambiente uma tempestade poderosa, com ventos fortes e ondas agitadas. Isso põe em perigo todos os outros que não o changeling (e qualquer recipiente que ela está atualmente a bordo) dentro do corpo de água ou um raio de 100 metros, multiplicado por seu Manto, que sempre é menor. Por padrão, este efeito inflige o Heavy Rains Tilt, mas o changeling pode gastar um Glamour adicional para infligir o Tilt Inundado em qualquer recipiente ou estrutura. A água convocada por este poder está com fome e entorpecimento, parecendo forçar seu caminho para os pulmões dos afetados. Qualquer pessoa que se torna completamente imerso em água neste nível começa a sofrer o Afogamento Tilt (ver abaixo). Finalmente, o changeling pode gastar outro Glamour para ter a tempestade pelt todos aqueles dentro dele com detritos, infligindo seus pontos Manto em bater danos a todos expostos ao tempo a cada outra volta. Armadura e Durabilidade reduzem este dano, mas a defesa normal é ineficaz.",
    exceptionalSuccess:
      "A tempestade é ainda mais forte, infligindo um ambiente extremo a uma classificação igual a metade do Manto do changeling (em volta).",
    page: 141,
  },
  "h-courts:dredge-the-depths": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "A magia do changeling se lava sobre a área, até 100 metros multiplicado por Manto. Ele define o que é “valorizável” neste caso — suprimentos médicos durante uma emergência, alimentos, ou simplesmente itens de valor monetário — e aprende de um tesouro tão mundano por sucesso, limitado pela sua classificação Manto. Esses valores são prontamente evidentes para o changeling, e ele pode facilmente recuperá - los. Se quaisquer valores forem garantidos, a magia deste Contrato derrota automaticamente a segurança mundana, mas inicia um Confronto de Vontades contra a segurança mágica ou a ocultação.",
    exceptionalSuccess:
      "O changeling ganha tesouros adicionais iguais a metade do seu Manto, reunidos.",
    page: 142,
  },
  "h-courts:gone-by-the-board": {
    action: "Instantânea",
    duration: "Special",
    success:
      "Um único item perdido, nomeado pelo changeling quando ela ativa este Contrato, faz seu caminho de volta ao seu proprietário. O caminho pode ser complicado e estranho — um livro é passado de pessoa para pessoa, depois deixado numa biblioteca, depois transferido para a biblioteca onde o dono trabalha — mas eventualmente voltará para casa. No máximo, o item retorna ao seu proprietário dentro de uma semana. Alta Maré: O c hangleling pode, em vez disso, tornar mais difícil para alguém encontrar seu item perdido, infligindo seu Manto como dados de penalidade para todos os rolos feitos para localizá-lo até a próxima maré alta.",
    exceptionalSuccess: "",
    page: 142,
  },
  "h-courts:red-sky-at-m-orning": {
    action: "Instantânea",
    duration: "Until the next sunrise",
    success:
      "Este contrato está adormecido até que a mudança se depare com uma ameaça iminente. Quando o faz, pinta o céu (ou teto) um vermelho vívido para todos que podem ver através da máscara. Este efeito pode alertar o changeling alguns minutos antes da ameaça igual a seus pontos Manto, mas não fornece qualquer contexto para a forma que esse perigo toma. Depois que o aviso aparece, o changeling e companheiro perdido até seus pontos Manto não pode ser surpreendido por qualquer meio. Além disso, eles ganham um +3 em Iniciativa e Defesa. Alta Maré: O changeling pode fornecer os bônus de Iniciativa e Defesa acima para metamorfos adicionais iguais aos seus pontos Manto, desde que todos eles sejam Alta Maré Courtiers em boa posição. Ebb Tide: O changeling pode permitir que personagens que não conseguem ver através da Máscara vejam o aviso e beneficiem dos seus efeitos. Low Tide: O changeling pode gastar um Glamour para aprender a natureza da ameaça. Inundação Tide: O changeling é avisado da ameaça de uma cena completa antes do tempo.",
    exceptionalSuccess: "",
    page: 143,
  },
  "h-courts:red-sky-at-night": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling fornece algum tipo de entretenimento, quer com seus próprios talentos — música, poesia, atuação — quer por fornecer entretenimento: Qualquer coisa, desde bilhetes para uma noite de cinema na cave. Vários participantes, até o dobro do Manto do changeling, recuperam um ponto de força de vontade gasta e a condição inspirada. Alta Maré: Até que a Condição Inspirada seja resolvida, o Alta Maré Courtier também ganha um +2 em todos os rolos para har colete Glamour de um assunto. Ebb Tide: O changeling reabastece dois dos sujeitos da força de vontade gasta. Maré Baixa: O changeling aprende a Virtude/Título (ou equivalente) de cada participante. Inundação Tide: O changeling pode conceder a condição Steadfast em vez de Inspirado; ele pode variar o efeito entre os sujeitos.",
    exceptionalSuccess: "",
    page: 143,
  },
  "h-courts:always-solvent": {
    action: "Instantânea",
    duration: "Special",
    success:
      "O changeling atinge um bolso, bolsa, ou outro recipiente que ela tem em sua pessoa e puxa para fora a moeda apropriada. Em áreas mundanas, isto quase sempre significa o dinheiro local. Em economias de troca, isso significa que ela puxa para fora algo que a maioria dos personagens na área estará disposta a trocar. Dentro de um mercado de duendes, o changeling retira seu Lien (The Sebe, p. 88). Se este for Glamour ou algo mais efêmero (favores ou penhores), os itens retirados do saco são representantes simbólicos do verdadeiro Lien: Quebrar ou rasgar o item libera o Lien, que deve ser usado como parte de uma transação e não pode ser mantido pelo changeling. Em qualquer dos casos, o contrato produz moeda suficiente para uma única compra significativa. Se forem necessários números específicos, o changeling pode adquirir algo com uma classificação de Disponibilidade igual a (Manto + 1, a um limite de 5) para transações mundanas. Nos Mercados de Duende, o changeling tem tantas instâncias distintas dos Lien. Todas as moedas não gastas, mundanas ou não, que este Contrato cria dissolve-se em folhas e escória quando o changeling deixa a área. Moeda: O changeling só precisa gastar um Glamour para ativar este Contrato em áreas onde o dinheiro é preferido. Barter: O changeling só precisa gastar um Glamour para ativar este Contrato em áreas onde a troca é preferida. Favores: O changeling reduz a Disponibilidade ou o Lien por um (a um mínimo de um) na primeira transação que ela faz com a moeda. Acordos sombrios: Após a primeira transação em que o changeling participa, ela pode optar por ter essa moeda “fazer seu caminho” de volta para ela, permitindo que ela seja usada novamente. No entanto, isso não impede que a vítima enganada perceba.",
    exceptionalSuccess: "",
    page: 146,
  },
  "h-courts:cook-the-books": {
    action: "Reflexiva",
    duration: "",
    success:
      "O changeling só pode invocar este Contrato quando a sua Dívida Duende é chamada. Isto permite-lhe negar a dívida sem ganhar um ponto adicional, e o contador de histórias não pode gastar a dívida contra o personagem novamente durante a duração. Se o changeling invocar este Contrato mais de uma vez por capítulo, role um valor cumulativo para cada uso subsequente após gastar o custo. Um resultado de 1 ou 10 em um dado faz com que o Contrato falhe, com qualquer Glamour gasto perdido. Moedas: O changeling também pode reduzir um ponto da dívida do Duende, mas ela não pode usar este Contrato novamente na próxima vez que o contador de histórias gasta dívida contra ela. Barter: O changeling pode optar por aceitar sua dívida, mas reabastecer um ponto de força de vontade. Favores: O changeling pode invocar este Contrato em nome de outra pessoa. Shady Deals: Uma vez por história, o changeling pode, em vez disso, redirecionar o efeito de sua dívida em outro personagem na cena, embora isso não reduza seu próprio total.",
    exceptionalSuccess: "",
    page: 146,
  },
  "h-courts:if-two-are-dead": {
    action: "Disputada",
    duration: "Story",
    success:
      "Os assuntos não podem mais compartilhar detalhes do acordo com uma parte não envolvida. Até mesmo meios exóticos de comunicação, como a telepatia, falham. Este efeito não pode ser terminado cedo.",
    exceptionalSuccess: "",
    page: 146,
  },
  "h-courts:raise-the-band": {
    action: "Instantânea",
    duration: "Until the next sunrise or sundown, which ever comes first",
    success:
      "O changeling grita um poderoso grito de rali, e a magia o carrega por toda a Sede local. Ela assume o Duende Dívida igual a (10 – Manto), sofrendo quaisquer consequências como normal, e aplica o Hobgoblin Band Tilt (abaixo) para uma área para a duração. Os hobs chegam em poucos turnos, capazes de subir de vários Sebegates nas proximidades. O changeling deve ter em mente um objetivo que envolva a violência em defesa do freehold. Caso contrário, este Contrato não tem efeito. Moedas: Para um ponto adicional de Glamour, o changeling pode aumentar os danos da banda em dois. Barter: O changeling pode trocar um serviço para o gob lins como por uma vedação forte em vez de assumir a dívida. O contador de histórias decide os parâmetros e as consequências. Favores: Para um ponto adicional de Glamour, o changeling pode aumentar a quantidade de danos que as placas podem levar por três. Shady Deals: O changeling só leva (7 – Manto) em dívida Goblin.",
    exceptionalSuccess: "",
    page: 147,
  },
  "h-courts:supply-and-demand": {
    action: "Disputada",
    duration: "",
    success:
      "O comerciante aceitará algo do changeling como pagamento por bens vendáveis. Isso não significa que o comerciante não vai preço gouge, menosprezar os bens desleixados, ou de outra forma colocá-lo para o personagem, eo que eles estão dispostos a tomar pode não ser algo a mudança",
    exceptionalSuccess: "",
    page: 147,
  },
  "h-seemings:discreet-summons": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:m-astermind-s-gambit": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:pipes-of-the-beastcaller": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:the-royal-court": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 104,
  },
  "h-seemings:spinning-wheel": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 104,
  },
  "h-seemings:changeling-hours": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:dance-of-the-toys": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:hidden-reality": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:stealing-the-solid-reflection": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:tatterdemalion-s-workshop": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:book-of-seemings-props-and-scenery": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:reflections-of-the-past": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:riddle-kith": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:skinmask": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:unravel-the-tapestry": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:fortifying-presence": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:hedgewall": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:pure-clarity": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:vow-of-no-compromise": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:whispers-of-m-orning": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:chrysalis": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:flickering-hours": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:leaping-toward-nightfall": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:m-irror-walk": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:talon-and-wing": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:elemental-fury": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:oathbreaker-s-punishment": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:red-revenge": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:relentless-pursuit": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-seemings:thief-of-reason": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-seemings:carrion-feast": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-seemings:no-escape": {
    action: "Disputada",
    duration: "Turno",
    success:
      "O changeling torna-se o epicentro de um vórtice destrutivo que destrói tudo à sua frente, até uma distância máxima igual ao seu Fado em metros. Objetos não seguros de Tamanho 1 ou 2 neste raio são atraídos para o vórtice e destruídos. Se os sucessos do changeling excederam a Durabilidade de objetos maiores na área, estes também são rasgados e sugados para o vórtice, até o Tamanho 5. Tamanho 6 e objetos maiores que têm sua Durabilidade excedida sofrer danos diretamente à sua Estrutura, igual a metade dos sucessos do changeling (em torno). Criaturas que não resistem sofrem danos letais iguais à diferença entre seus sucessos e os da muda, à medida que o vazio tira a carne de seus ossos. Se este dano é igual ou superior ao tamanho da criatura, eles são atraídos para o vórtice. Isto mata humanos e animais normais, mas os Lost têm um último método para evitar uma morte horrível: Um changeling pode gastar um ponto de teletransporte de Glamour para a Sebe, como se tivessem aberto um portão. Naturalmente, ser gravemente ferido e, em seguida, cair em uma parte aleatória da Sebe é sua própria crise. Qualquer um que o changeling mata com este Contrato conta como tendo sido comido para fins de outros Contratos Maw, e refresca Glamour se o changeling é esquecido.",
    exceptionalSuccess:
      "O changeling também refresca a força de vontade da enormidade de sua refeição.",
    page: 140,
  },
  "h-seemings:starvation-s-savagery": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 140,
  },
  "h-seemings:swallow-whole": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling engole a vítima inteira, independentemente de ser fisicamente possível. O processo de deglutição lida com 5 pontos de dano à vítima quando está contorcido e esmagado na barriga do changeling. A vítima não sofre mais nenhum dano físico enquanto engolido, mas ele é surdo e cego para o mundo lá fora e totalmente contido. Ao carregar uma vítima engolida, o estômago do changeling parece inchado, embora o tamanho da protuberância não corresponda ao tamanho real da vítima. O changeling sofre um –1 em Dexterity e Defesa enquanto carrega uma vítima engolida. O changeling pode vomitar a sua vítima sempre que quiser, infligindo-lhe o Tunned Tilt. Ela só pode carregar uma vítima de cada vez e deve regurgitar a primeira a engolir outra. Se o changeling sofre mais danos do que a sua resistência ao seu meio de secção enquanto carrega uma vítima, ela regur cite-o, e ambos sofrem o Stunned Tilt. Uma vítima perdida deste contrato pode usar o portal para escapar cedo, assumindo que eles têm o Glamour para gastar. Neste caso, nem o changeling nem a vítima recebem o Stunned Tilt.",
    exceptionalSuccess:
      "Se o changeling desejar, o dano que a vítima sofre ao ser engolido passa a ser letal.",
    page: 141,
  },
  "h-seemings:you-are-who-you-eat": {
    action: "Instantânea",
    duration: "Week",
    success:
      "Os benefícios obtidos com este Contrato dependem tanto das habilidades do sujeito como de que parte deles o changeling come. As vítimas podem estar vivas ou mortas, mas devorar algumas das partes da lista abaixo, mas garante a morte de um sujeito. Os indivíduos mortos ainda devem ter carne reconhecível nos seus ossos para serem úteis, e todos os subjects devem ser de tamanho 4 ou maior. Olho: O changeling ganha um ponto do maior atributo mental do sujeito. Mão ou Pé: O changeling ganha um ponto do maior Atributo Físico do sujeito. Língua: O changeling ganha um ponto do maior atributo social do sujeito. Pele: A máscara do changeling imita perfeitamente a aparência e a voz do sujeito. O changeling deve comer pelo menos uma boca cheia de pele. Cérebro: O changeling ganha acesso às memórias do sujeito, e durante o tempo, ela ganha o Mérito da Memória Eidética em relação a essas memórias. Coração: O changeling ganha um ponto de Fado. Se a vítima também estiver perdida, ela ganha acesso a um Contrato Real que a vítima possuiu, conforme escolhido pelo contador de histórias. Se a vítima é outra criatura sobrenatural, o changeling ganha um mérito sobrenatural apropriado (Crónicas das Trevas , p. 56), conforme escolhido pelo contador de histórias. Todos os Méritos adquiridos com este Contrato não estão sujeitos à Santividade dos Méritos. Você é quem você come pode ser invocado várias vezes usando partes do mesmo assunto ou assuntos diferentes, mas cada benefício só pode ser ganho uma vez para a duração. Se a mesma parte do corpo for usada para ativar este Contrato antes que a duração esteja acima, o novo uso substitui o anterior. Exemplo: Karol o Imp come o olho de um sujeito, concedendo-lhe um ponto adicional de Raciocínio, e a mão de outro, concedendo-lhe um ponto de Dexterity. Antes da semana acabar, ela devora o olho de um terceiro sujeito, ganhando um ponto de inteligência, mas ela perde o ponto de Raciocínio.",
    exceptionalSuccess: "",
    page: 142,
  },
  "h-seemings:last-hope": {
    action:
      "Instantânea The Disaster creates a pocket of safety up to (Wyrd) square meters in diameter within a disaster zone. The effects of any surrounding Environmental Tilts or extreme environments are suppressed within this pocket, both on the surrounding area and any people who happen to be inside, though cries for help are drowned out by the chaos without, and the churning elements obscure attempts to see in or out. Entering or leaving the pocket without the Disaster’s permission requires a successful Stamina + Athletics action vs. the Disaster’s Strength + Wyrd. Each attempt to leave or enter, success or failure, deals a lethal damage. Loophole: The Disaster inflicts a point of lethal damage on herself by using something destroyed in the sur rounding disaster. Story Seeds • The downpour in the freehold hasn’t let up for three weeks. As human misery rises, Glamour sours, and the courts start looking for someone to blame. The news reports a child has gone missing from a locked house; the only clues are a smashed window and a carpet soaked through. Two more kids go missing the following night. Now, the birds have gone silent, and the wind’s started sounding like a creole lullaby. The rain is only getting worse. • So close, and yet home’s nowhere in sight. The motley’s stuck on this damned boat as the worst storm in memory slams the gunwales. Lightning slices through the clouds in a precise countdown. First thirty strikes, then twenty-nine, twenty-eight… dread mounts. The Captain’s called the Coast Guard, but he’s received no reply. The First Mate says lightning is calling for some debt to be paid. She says if someone doesn’t sacrifice to the storm, everyone will drown. Only three more strikes to go. • It’s a category 5, and it’s coming for the freehold. The Winter Queen has offered her storm shelters for those with favor or something valuable to trade, and the motley has managed to get by scraping together the little they have. The Queen has divided people up between two bolt-holes, with those who didn’t have enough cachet for the deluxe arrangements sent to an old bomb shelter. Around midnight, frantic knocking wakes everyone up in the “economy” wing, like someone’s caught in the storm. If asked who it is, no reply is forthcoming. Soon, it stops, and the night passes uneasily. Once the news says it’s safe, the bolts slide back. But the neighboring storm shelter is already wide open, soaked with rain and debris. No sign of the others, including the Queen. Whatever was knocking, they let it in…",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 145,
  },
  "h-seemings:the-troll-toll": {
    action: "Instantânea",
    duration: "Indefinite",
    success:
      "Se um viajante ou grupo de viajantes se aproximar do caminho de um Troll e quiser atravessá-lo, o Troll pode usar este Contrato para barrar seu caminho. Doravante, não importa para onde a vítima ou as vítimas vão, elas não podem chegar ao seu destino declarado até derrotarem ou superarem o Troll de alguma forma e cruzarem o seu caminho. Um viajante pode matar o Troll, passar furtivamente por ele, fazer um acordo com ele, ou ser mais esperto, mas eles não podem simplesmente ir embora e esperar chegar onde estão indo. Eles podem escolher ir para outro lugar, mas se eles alguma vez procurarem o seu destino específico novamente, o Fado vai garantir que o viajante está reunido com o seu Troll e caminho. Se um viajante utiliza um contrato ou um poder sobrenatural (incluindo portais) na tentativa de alcançar o seu destino, provoca um confronto de vontades, com o concurso Troll com a Força + Fado. Se o viajante falhar, ele não pode tentar usar esse poder novamente para chegar a esse destino específico por um mês. A duração deste Contrato é indeterminada, mas o Troll pode rescindi-lo a qualquer momento. Quando recupera as suas memórias, muitas vezes recupera. Trolls não podem barrar o caminho de um caçador. Caçadores têm gosto de ar vazio para um Troll, e suas belas panóplias não fornecem alimento. Trolls podem impedir o caminho de um Fae Verdadeiro, mas apenas os mais tolos ou famintos tentariam.",
    exceptionalSuccess:
      "As vítimas estão tão presas que não podem deixar a travessia do Troll sem gastar uma força de vontade; cada membro de um grupo deve pagar individualmente.",
    page: 160,
  },
};
