export const CTL_SEEMINGS = {
  Beast: {
    translated: "Fera", favored: "Resistance", regalia: "Steed",
    blessing: "Enquanto não estiver amedrontado — ou ao gastar um ponto de Glamour por três turnos — causa dano letal com ataques desarmados e recebe +3 em Iniciativa e Deslocamento.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando decisões apressadas ou descuidadas prejudicam outras pessoas.",
    blessingEn: "Gain one additional dot in a Resistance Attribute at character creation. Gain +3 Initiative and Speed and deal lethal damage with unarmed attacks. If affected by Shaken, Spooked, or another fear Condition, spend 1 Glamour per three consecutive turns to retain these benefits.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever acting without thinking causes significant harm or complications for someone else.",
  },
  Darkling: {
    translated: "Trevoso", favored: "Finesse", regalia: "Mirror",
    blessing: "Ao gastar Força de Vontade — e também Glamour, se houver testemunhas — pode tocar o imaterial e tornar-se imaterial por três turnos.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando um segredo que conhece se revela falso.",
    blessingEn: "Gain one additional dot in a Finesse Attribute at character creation. Spend 1 Willpower to touch something insubstantial and become part of it for three consecutive turns, taking a fitting ephemeral form. Also spend 1 Glamour if anyone is looking directly at you when you do so.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever a secret or important piece of information you know turns out to be false.",
  },
  Elemental: {
    translated: "Elemental", favored: "Resistance", regalia: "Sword",
    blessing: "Quando cercado por seu elemento e com ao menos metade da Força de Vontade — ou ao gastar Glamour — pode agir através dele a até três metros de distância.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando é intimidado ou coagido a seguir um curso de ação.",
    blessingEn: "Gain one additional dot in a Resistance Attribute at character creation. While touching or surrounded by your element, perform mundane actions through it up to three yards away using your usual traits, including unarmed attacks but not weapon attacks. Spend 1 Glamour per action if fewer than half your maximum Willpower points remain.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever someone browbeats, coerces, or forces you to act against your will.",
  },
  Fairest: {
    translated: "Belíssimo", favored: "Power", regalia: "Crown",
    blessing: "Enquanto estiver em harmonia com seus aliados — ou ao gastar Glamour — pode gastar Força de Vontade em benefício de outro personagem.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando suas ações são responsáveis por ferir seus aliados.",
    blessingEn: "Gain one additional dot in a Power Attribute at character creation. Spend Willpower on another character's behalf for the usual three-die bonus or +2 to a Resistance trait, still limited to one Willpower point per action. Spend 1 Glamour if a Condition causing contention or mistrust is in play between you.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever your action or inaction leads directly to misfortune for your allies.",
  },
  Ogre: {
    translated: "Ogro", favored: "Power", regalia: "Shield",
    blessing: "Quando ataca em defesa de outra pessoa — ou ao gastar Glamour — impõe a Condição Derrotado por três turnos.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando alguém que não é seu inimigo se encolhe de medo diante dele.",
    blessingEn: "Gain one additional dot in a Power Attribute at character creation. Whenever you deal damage to another character, you may impose the Beaten Down Tilt for three turns. Spend 1 Glamour if the attack is on your own behalf rather than someone else's.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever someone you do not consider an enemy flees or cowers from you.",
  },
  Wizened: {
    translated: "Mirrado", favored: "Finesse", regalia: "Jewels",
    blessing: "Com as ferramentas adequadas — ou ao gastar Glamour — pode usar a ação Construir Equipamento para transformar um material em outro.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando é pego desprevenido por uma surpresa desagradável.",
    blessingEn: "Gain one additional dot in a Finesse Attribute at character creation. With appropriate tools, use Build Equipment to transform one material into another and count as having a five-die equipment bonus when determining required successes. Spend 1 Glamour per action when jury-rigging, which also allows improvised tools.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever an unpleasant surprise catches you off guard.",
  },
  Grimm: {
    translated: "Grimm", favored: "Finesse", regalia: "Mirror", sourceId: "h-seemings", source: "Book of Seemings", page: 30,
    blessing: "Receba um ponto adicional em um Atributo de Refinamento na criação. Uma vez por dia, assuma a aparência de um arquétipo humanoide; ações Sociais para sustentar o papel recebem 9-novamente. A forma dura enquanto o papel for mantido, mas custa 1 Glamour por cena se alguém questionar suas motivações ou zombar dela.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado ao agir em benefício próprio sem acrescentar nada ao papel que está interpretando.",
    blessingEn: "Gain one additional dot in a Finesse Attribute at character creation. Once per day, take any humanoid appearance suited to an archetypal role, provided it does not resemble a real known person or significantly alter Size. Social actions that maintain the role gain 9-again. The costume lasts while the role is upheld, but costs 1 Glamour per scene if anyone questions the character's motives or mocks the persona.",
    curseEn: "Risk Clarity damage with a dice pool equal to half Wyrd, rounded up, whenever taking an action that benefits yourself but adds nothing to the role you embody.",
  },
} as const;
export { CTL_SEEMING_LABELS, seemingDisplayName } from "../../lib/seeming-presentation";

export type ChangelingAnchorDefinition = {
  name: string;
  translatedName?: string;
  sourceId?: "ctl-2ed" | "h-courts" | "h-seemings";
  source?: string;
  page?: number;
  singleWillpower: string;
  allWillpower: string;
  singleWillpowerPt: string;
  allWillpowerPt: string;
};

export const CTL_NEEDLE_DEFINITIONS: ChangelingAnchorDefinition[] = [
  {name:"Bon Vivant",singleWillpower:"Allow a personal problem to go unfixed in favor of enjoying the moment.",allWillpower:"Abandon an important relationship in pursuit of pleasure.",singleWillpowerPt:"Deixe um problema pessoal sem solução para aproveitar o momento.",allWillpowerPt:"Abandone uma relação importante em busca de prazer."},
  {name:"Chess Master",singleWillpower:"Manipulate someone into doing what you want.",allWillpower:"Bring harm or misfortune to others while manipulating them into enacting your plans.",singleWillpowerPt:"Manipule alguém para fazer o que você quer.",allWillpowerPt:"Cause dano ou infortúnio a outros ao manipulá-los para executar seus planos."},
  {name:"Commander",singleWillpower:"Convince someone to ignore their goals in favor of yours.",allWillpower:"Put the good of the many above the good of the few, working against people you care about.",singleWillpowerPt:"Convença alguém a ignorar os próprios objetivos em favor dos seus.",allWillpowerPt:"Coloque o bem de muitos acima do bem de poucos, agindo contra pessoas importantes para você."},
  {name:"Composer",singleWillpower:"Eschew traditional standards of beauty despite the drawbacks.",allWillpower:"Embrace something vile in an attempt to espouse its beauty.",singleWillpowerPt:"Rejeite padrões tradicionais de beleza apesar das desvantagens.",allWillpowerPt:"Abrace algo vil na tentativa de defender sua beleza."},
  {name:"Counselor",singleWillpower:"Put your own goals on hold to help someone else achieve theirs.",allWillpower:"Take full responsibility for another's dangerous mistake.",singleWillpowerPt:"Adie seus objetivos para ajudar outra pessoa a alcançar os dela.",allWillpowerPt:"Assuma toda a responsabilidade pelo erro perigoso de outra pessoa."},
  {name:"Daredevil",singleWillpower:"Take a risk that puts others in danger.",allWillpower:"Take a risk that puts someone you love in danger.",singleWillpowerPt:"Assuma um risco que coloque outras pessoas em perigo.",allWillpowerPt:"Assuma um risco que coloque alguém que você ama em perigo."},
  {name:"Dynamo",singleWillpower:"Attempt to solve a problem before you have all the information.",allWillpower:"Hastily jump to conclusions, putting yourself or someone else in danger.",singleWillpowerPt:"Tente resolver um problema antes de ter todas as informações.",allWillpowerPt:"Tire conclusões precipitadas, colocando você ou outra pessoa em perigo."},
  {name:"Protector",singleWillpower:"Ignore your own needs while acting to protect someone else.",allWillpower:"Miss the last opportunity to achieve an important goal to protect someone else.",singleWillpowerPt:"Ignore suas necessidades ao agir para proteger outra pessoa.",allWillpowerPt:"Perca a última oportunidade de alcançar um objetivo importante para proteger outra pessoa."},
  {name:"Provider",singleWillpower:"Give up something you care about because someone asks you to.",allWillpower:"Put yourself or someone you love at risk to provide for someone else.",singleWillpowerPt:"Abra mão de algo importante porque alguém lhe pediu.",allWillpowerPt:"Coloque você ou alguém que ama em risco para prover para outra pessoa."},
  {name:"Scholar",singleWillpower:"Interact with and handle the unknown.",allWillpower:"Traverse the Hedge or another unearthly realm to categorize an unknown element.",singleWillpowerPt:"Interaja com o desconhecido e lide com ele.",allWillpowerPt:"Atravesse a Sebe ou outro reino sobrenatural para catalogar um elemento desconhecido."},
  {name:"Storyteller",singleWillpower:"Tell a story that makes someone look bad.",allWillpower:"Tell a compromising story about an important person who then takes offense or suffers consequences.",singleWillpowerPt:"Conte uma história que faça alguém parecer mal.",allWillpowerPt:"Conte uma história comprometedora sobre alguém importante, que se ofenda ou sofra consequências."},
  {name:"Teacher",singleWillpower:"Give advice that someone uses to succeed.",allWillpower:"Risk yourself to teach someone else a lesson.",singleWillpowerPt:"Dê um conselho que alguém use para obter sucesso.",allWillpowerPt:"Coloque-se em risco para ensinar uma lição a outra pessoa."},
  {name:"Traditionalist",singleWillpower:"Refuse to incorporate new ideas into a plan of action.",allWillpower:"Refuse help while dealing with a dangerous situation.",singleWillpowerPt:"Recuse-se a incorporar novas ideias a um plano de ação.",allWillpowerPt:"Recuse ajuda ao lidar com uma situação perigosa."},
  {name:"Visionary",singleWillpower:"Refuse to use the same method twice.",allWillpower:"Put yourself in danger attempting a new method.",singleWillpowerPt:"Recuse-se a usar o mesmo método duas vezes.",allWillpowerPt:"Coloque-se em perigo ao tentar um método novo."},
  {name:"Agitator",translatedName:"Agitador",sourceId:"h-courts",source:"Book of Courts",page:61,singleWillpower:"Spur someone else into reckless action or goals.",allWillpower:"Inspire your enemies to finally shut you up. Permanently.",singleWillpowerPt:"Incite outra pessoa a ações ou objetivos imprudentes.",allWillpowerPt:"Inspire seus inimigos a silenciá-lo de forma permanente."},
  {name:"Artist",translatedName:"Artista",sourceId:"h-courts",source:"Book of Courts",page:61,singleWillpower:"Expose another to art when they initially expressed disinterest.",allWillpower:"Share your art where serious repercussions, such as imprisonment or death, are real threats.",singleWillpowerPt:"Exponha à arte alguém que inicialmente demonstrou desinteresse.",allWillpowerPt:"Compartilhe sua arte onde consequências graves, como prisão ou morte, sejam ameaças reais."},
  {name:"Assassin",translatedName:"Assassino",sourceId:"h-courts",source:"Book of Courts",page:61,singleWillpower:"Deal with an issue through the most direct method, regardless of morality.",allWillpower:"Solve a problem involving a person with potentially serious consequences for you and your allies.",singleWillpowerPt:"Resolva uma questão pelo método mais direto, independentemente da moralidade.",allWillpowerPt:"Resolva um problema envolvendo uma pessoa, mesmo com consequências potencialmente graves para você e seus aliados."},
  {name:"Paramour",translatedName:"Amante",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Help a friend achieve a goal instead of focusing on your own desires.",allWillpower:"Put your health or life on the line to help someone you love.",singleWillpowerPt:"Ajude um amigo a alcançar um objetivo em vez de cuidar dos próprios desejos.",allWillpowerPt:"Arrisque sua saúde ou vida para ajudar alguém que ama."},
  {name:"Recluse",translatedName:"Recluso",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Successfully complete alone a task your allies spent time arguing over.",allWillpower:"Perform a task alone even though you risk injury or worse.",singleWillpowerPt:"Conclua sozinho uma tarefa sobre a qual seus aliados perderam tempo discutindo.",allWillpowerPt:"Execute sozinho uma tarefa mesmo correndo risco de ferimentos ou algo pior."},
  {name:"Soldier",translatedName:"Soldado",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Perform your duties in lieu of personal goals.",allWillpower:"Follow an order that may lead to serious harm or death.",singleWillpowerPt:"Cumpra seus deveres em vez de perseguir objetivos pessoais.",allWillpowerPt:"Siga uma ordem que possa causar ferimentos graves ou morte."},
  {name:"Sorcerer",translatedName:"Feiticeiro",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Attempt an occult solution without considering more practical means.",allWillpower:"Search for ever more wisdom and power even as it does terrible things to your mind.",singleWillpowerPt:"Tente uma solução ocultista sem considerar meios mais práticos.",allWillpowerPt:"Busque cada vez mais sabedoria e poder mesmo que isso destrua sua mente."},
  {name:"Undertaker",translatedName:"Agente Funerário",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Conduct yourself with grace and dignity in a morbid situation.",allWillpower:"Ignore the possibility of death if it deters you from an important goal.",singleWillpowerPt:"Comporte-se com graça e dignidade em uma situação mórbida.",allWillpowerPt:"Ignore a possibilidade de morte quando ela o afasta de um objetivo importante."},
  {name:"Bulwark",translatedName:"Baluarte",sourceId:"h-seemings",source:"Book of Seemings",page:89,singleWillpower:"Refuse to let pain deter your plans.",allWillpower:"Risk serious harm so someone else does not have to suffer.",singleWillpowerPt:"Recuse-se a deixar que a dor atrapalhe seus planos.",allWillpowerPt:"Arrisque ferimentos graves para impedir o sofrimento de outra pessoa."},
  {name:"Ecologist",translatedName:"Ecologista",sourceId:"h-seemings",source:"Book of Seemings",page:89,singleWillpower:"Help someone by explaining how forces beyond their control influence them.",allWillpower:"Oppose powerful people whose actions and interests indirectly hurt others.",singleWillpowerPt:"Ajude alguém explicando como forças fora de seu controle o influenciam.",allWillpowerPt:"Enfrente poderosos cujas ações e interesses prejudicam outros indiretamente."},
  {name:"Enforcer",translatedName:"Executor",sourceId:"h-seemings",source:"Book of Seemings",page:89,singleWillpower:"Ignore your own desires when fulfilling an order.",allWillpower:"Take the fall for your superior's actions when you are not at fault.",singleWillpowerPt:"Ignore os próprios desejos ao cumprir uma ordem.",allWillpowerPt:"Assuma a culpa pelas ações de um superior quando não for responsável."},
  {name:"Gardener",translatedName:"Jardineiro",sourceId:"h-seemings",source:"Book of Seemings",page:89,singleWillpower:"Take time to encourage something to grow despite other pressing matters.",allWillpower:"Risk yourself to defend what you invested time in helping grow.",singleWillpowerPt:"Dedique tempo a estimular algo a crescer apesar de outros assuntos urgentes.",allWillpowerPt:"Arrisque-se para defender aquilo que ajudou a crescer."},
  {name:"Gumshoe",translatedName:"Detetive",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Help someone else explore the unknown or uncover a secret.",allWillpower:"Put yourself or someone you love in danger to learn a secret.",singleWillpowerPt:"Ajude alguém a explorar o desconhecido ou revelar um segredo.",allWillpowerPt:"Coloque você ou alguém que ama em perigo para descobrir um segredo."},
  {name:"Hunter",translatedName:"Caçador",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Ignore personal needs to pursue a new lead on your quarry.",allWillpower:"Put yourself or someone you love in danger to capture your quarry.",singleWillpowerPt:"Ignore necessidades pessoais para seguir uma nova pista sobre sua presa.",allWillpowerPt:"Coloque você ou alguém que ama em perigo para capturar sua presa."},
  {name:"Ideal",translatedName:"Ideal",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Help someone improve their life while leading by example.",allWillpower:"Put yourself in danger to embody a higher calling.",singleWillpowerPt:"Ajude alguém a melhorar de vida dando o exemplo.",allWillpowerPt:"Coloque-se em perigo para personificar um chamado superior."},
  {name:"Overlord",translatedName:"Suserano",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Threaten someone to make them do what you want.",allWillpower:"Make an example of those who refuse your orders with harsh punishments.",singleWillpowerPt:"Ameace alguém para obrigá-lo a fazer o que você quer.",allWillpowerPt:"Faça dos que recusam suas ordens um exemplo por meio de punições severas."},
  {name:"Prey",translatedName:"Presa",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Waste time checking for danger in mundane situations.",allWillpower:"Put your goals at risk by fleeing at the first sign of danger.",singleWillpowerPt:"Perca tempo procurando perigo em situações mundanas.",allWillpowerPt:"Arrisque seus objetivos fugindo ao primeiro sinal de perigo."},
  {name:"Tinker",translatedName:"Funileiro",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Help someone repair or improve something that is not working properly.",allWillpower:"Put yourself in a dangerous situation to repair something.",singleWillpowerPt:"Ajude alguém a consertar ou melhorar algo que não funciona direito.",allWillpowerPt:"Coloque-se em uma situação perigosa para consertar alguma coisa."},
  {name:"Transmuter",translatedName:"Transmutador",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Reuse an object in a way that was not its intended purpose.",allWillpower:"Help someone make a major life change despite its potential consequences for you.",singleWillpowerPt:"Reutilize um objeto para uma finalidade diferente da original.",allWillpowerPt:"Ajude alguém a realizar uma grande mudança de vida apesar das possíveis consequências para você."},
  {name:"Voyeur",translatedName:"Voyeur",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Casually eavesdrop or spy on people without being noticed.",allWillpower:"Keep someone under observation against their wishes when being caught has significant consequences.",singleWillpowerPt:"Espione ou escute casualmente sem ser notado.",allWillpowerPt:"Mantenha alguém sob observação contra a vontade dessa pessoa quando ser descoberto trouxer consequências graves."},
];

export const CTL_THREAD_DEFINITIONS: ChangelingAnchorDefinition[] = [
  {name:"Acceptance",singleWillpower:"Ignore personal problems to gain someone's favor.",allWillpower:"Put yourself at risk to defend someone who needs you.",singleWillpowerPt:"Ignore problemas pessoais para conquistar o favor de alguém.",allWillpowerPt:"Coloque-se em risco para defender alguém que precisa de você."},
  {name:"Anger",singleWillpower:"Start a fight with someone.",allWillpower:"Start a fight with someone clearly superior to you.",singleWillpowerPt:"Comece uma briga com alguém.",allWillpowerPt:"Comece uma briga com alguém claramente superior a você."},
  {name:"Family",singleWillpower:"Take a family member's burden upon yourself without expecting recompense.",allWillpower:"Put yourself at risk to provide for your family.",singleWillpowerPt:"Assuma o fardo de um familiar sem esperar recompensa.",allWillpowerPt:"Coloque-se em risco para prover para sua família."},
  {name:"Friendship",singleWillpower:"Follow a friend into a situation clearly disadvantageous to you.",allWillpower:"Follow a friend into a deadly or dangerous situation.",singleWillpowerPt:"Siga um amigo até uma situação claramente desvantajosa para você.",allWillpowerPt:"Siga um amigo até uma situação mortal ou perigosa."},
  {name:"Hate",singleWillpower:"Distance yourself from others in pursuit of your hatred.",allWillpower:"Abandon a group, organization, or city in pursuit of your hatred.",singleWillpowerPt:"Afaste-se dos outros em busca de seu ódio.",allWillpowerPt:"Abandone um grupo, organização ou cidade em busca de seu ódio."},
  {name:"Honor",singleWillpower:"Refuse an action that would besmirch your honor.",allWillpower:"Take the more dangerous path for fear of abandoning your code.",singleWillpowerPt:"Recuse uma ação que manche sua honra.",allWillpowerPt:"Escolha o caminho mais perigoso por medo de abandonar seu código."},
  {name:"Joy",singleWillpower:"Ignore another's plight to maintain your happiness.",allWillpower:"Make others suffer so you do not have to.",singleWillpowerPt:"Ignore o sofrimento de outra pessoa para preservar sua felicidade.",allWillpowerPt:"Faça outros sofrerem para que você não precise sofrer."},
  {name:"Love",singleWillpower:"Put yourself out for the pleasure of someone you love.",allWillpower:"Put yourself in a deadly situation to protect your love.",singleWillpowerPt:"Sacrifique seu conforto pelo prazer de alguém que ama.",allWillpowerPt:"Coloque-se em uma situação mortal para proteger seu amor."},
  {name:"Memory",singleWillpower:"Ignore a dangerous situation in favor of recreating your memory.",allWillpower:"Deny reality to immerse yourself in your memory.",singleWillpowerPt:"Ignore uma situação perigosa para recriar sua memória.",allWillpowerPt:"Negue a realidade para mergulhar em sua memória."},
  {name:"Revenge",singleWillpower:"Seek retaliation over moderation.",allWillpower:"Abandon reason and logic to exact revenge.",singleWillpowerPt:"Busque retaliação em vez de moderação.",allWillpowerPt:"Abandone a razão e a lógica para executar sua vingança."},
  {name:"Detail",translatedName:"Detalhe",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Neglect tasks or relationships because you are focused on your current project.",allWillpower:"Stay in the Hedge long enough to cause harm because of your hyperfocus.",singleWillpowerPt:"Negligencie tarefas ou relacionamentos por estar concentrado no projeto atual.",allWillpowerPt:"Permaneça na Sebe tempo suficiente para que seu hiperfoco cause dano."},
  {name:"Enthusiasm",translatedName:"Entusiasmo",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Brighten the day of someone who is clearly suffering.",allWillpower:"Risk injury just to prove the goodness of the world.",singleWillpowerPt:"Alegre o dia de alguém que está claramente sofrendo.",allWillpowerPt:"Arrisque ferimentos apenas para provar a bondade do mundo."},
  {name:"Grief",translatedName:"Luto",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Attend to your grief at the expense of current relationships or events.",allWillpower:"Let grief consume you rather than attend to what is currently most important.",singleWillpowerPt:"Dedique-se ao luto em detrimento das relações ou acontecimentos atuais.",allWillpowerPt:"Deixe o luto consumi-lo em vez de cuidar do que é mais importante agora."},
  {name:"Mystery",translatedName:"Mistério",sourceId:"h-courts",source:"Book of Courts",page:62,singleWillpower:"Reply to a question with riddles when a straight answer would be best.",allWillpower:"Remain cryptic even when clarity would solve everything.",singleWillpowerPt:"Responda com enigmas quando uma resposta direta seria melhor.",allWillpowerPt:"Permaneça enigmático mesmo quando a clareza resolveria tudo."},
  {name:"Rebellion",translatedName:"Rebelião",sourceId:"h-courts",source:"Book of Courts",page:63,singleWillpower:"Refuse to follow an order when you know better.",allWillpower:"Suffer grave hardship rather than submit to another.",singleWillpowerPt:"Recuse-se a seguir uma ordem por acreditar que sabe mais.",allWillpowerPt:"Sofra grandes dificuldades em vez de se submeter a outra pessoa."},
  {name:"Renewal",translatedName:"Renovação",sourceId:"h-courts",source:"Book of Courts",page:63,singleWillpower:"Prioritize working for the future over present commitments.",allWillpower:"Work to restore something despite significant, well-founded objections.",singleWillpowerPt:"Priorize o trabalho pelo futuro em detrimento dos compromissos presentes.",allWillpowerPt:"Trabalhe para restaurar algo apesar de objeções importantes e fundamentadas."},
  {name:"Ritual",translatedName:"Ritual",sourceId:"h-courts",source:"Book of Courts",page:63,singleWillpower:"Insist on proper ritual when ignoring it would be more efficient.",allWillpower:"Obsess over the letter of the law when its spirit is obvious.",singleWillpowerPt:"Insista no ritual adequado quando ignorá-lo seria mais eficiente.",allWillpowerPt:"Obceque-se pela letra da lei quando seu espírito é evidente."},
  {name:"Terror",translatedName:"Terror",sourceId:"h-courts",source:"Book of Courts",page:63,singleWillpower:"Frighten someone for no reason other than causing fear.",allWillpower:"Incite fear on a large scale, heedless of the consequences.",singleWillpowerPt:"Assuste alguém sem outro motivo além de causar medo.",allWillpowerPt:"Incite medo em grande escala sem se importar com as consequências."},
  {name:"Accountability",translatedName:"Responsabilidade",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Accept criticism with grace about how you could have handled a situation better.",allWillpower:"Put yourself or someone you love at risk to make amends for a wrong they committed.",singleWillpowerPt:"Aceite com elegância críticas sobre como poderia ter lidado melhor com uma situação.",allWillpowerPt:"Coloque você ou alguém que ama em risco para reparar um erro cometido."},
  {name:"Contempt",translatedName:"Desprezo",sourceId:"h-seemings",source:"Book of Seemings",page:90,singleWillpower:"Say exactly what you mean even if it alienates those you address.",allWillpower:"Drive away someone you care about by being overly blunt.",singleWillpowerPt:"Diga exatamente o que pensa mesmo que isso afaste seus interlocutores.",allWillpowerPt:"Afaste alguém importante por ser franco demais."},
  {name:"Defiance",translatedName:"Desafio",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Deliberately do something forbidden solely to get under someone's skin.",allWillpower:"Risk harm or social censure by violating an important social norm.",singleWillpowerPt:"Faça deliberadamente algo proibido apenas para irritar alguém.",allWillpowerPt:"Arrisque ferimentos ou censura ao violar uma norma social importante."},
  {name:"Handiwork",translatedName:"Obra Manual",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Demonstrate your craft's superiority at someone else's expense.",allWillpower:"Put yourself or someone you love at risk to prove your creations are the best.",singleWillpowerPt:"Demonstre a superioridade de seu ofício às custas de outra pessoa.",allWillpowerPt:"Coloque você ou alguém que ama em risco para provar que suas criações são as melhores."},
  {name:"Industrious",translatedName:"Laborioso",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Keep yourself busy by doing additional labor.",allWillpower:"Work for so long that you alienate an ally.",singleWillpowerPt:"Mantenha-se ocupado assumindo trabalho adicional.",allWillpowerPt:"Trabalhe por tanto tempo que acabe afastando um aliado."},
  {name:"Majesty",translatedName:"Majestade",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Inconvenience yourself to make a good first impression.",allWillpower:"Ignore close friends' or family's needs while making yourself appear grandiose.",singleWillpowerPt:"Sacrifique sua conveniência para causar uma boa primeira impressão.",allWillpowerPt:"Ignore as necessidades de amigos próximos ou familiares para parecer grandioso."},
  {name:"Mercurial",translatedName:"Mercurial",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Suddenly change your approach and mood while negotiating or working with someone.",allWillpower:"Alienate those close to you by suddenly changing your plans.",singleWillpowerPt:"Mude subitamente de abordagem e humor ao negociar ou trabalhar com alguém.",allWillpowerPt:"Afaste pessoas próximas ao mudar repentinamente seus planos."},
  {name:"Relentlessness",translatedName:"Implacabilidade",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Put yourself in danger by refusing to let up.",allWillpower:"Alienate someone you care about with your excessive intensity.",singleWillpowerPt:"Coloque-se em perigo por se recusar a aliviar a pressão.",allWillpowerPt:"Afaste alguém importante com sua intensidade excessiva."},
  {name:"Ruthlessness",translatedName:"Crueldade",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Perform a necessary task everyone else finds distasteful.",allWillpower:"Do something personally harmful that must nevertheless be done.",singleWillpowerPt:"Execute uma tarefa necessária que todos os outros consideram repulsiva.",allWillpowerPt:"Faça algo que o prejudique pessoalmente, mas que precisa ser feito."},
  {name:"Unassuming",translatedName:"Despretensioso",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Refuse to solve a problem you could fix to avoid drawing attention.",allWillpower:"Complicate your life by backing down from a challenge to hide your strength.",singleWillpowerPt:"Recuse-se a resolver um problema que poderia corrigir para não chamar atenção.",allWillpowerPt:"Complicate sua vida fugindo de um desafio para esconder sua força."},
  {name:"Unwavering",translatedName:"Inabalável",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Refuse to let negative emotions prevent you from doing your duty.",allWillpower:"Put yourself in harm's way when retreat would be safer.",singleWillpowerPt:"Recuse-se a deixar emoções negativas impedi-lo de cumprir seu dever.",allWillpowerPt:"Coloque-se em perigo quando recuar seria mais seguro."},
  {name:"Wanderlust",translatedName:"Desejo de Viajar",sourceId:"h-seemings",source:"Book of Seemings",page:91,singleWillpower:"Ignore personal problems to explore a place you have never visited.",allWillpower:"Travel far away when remaining would benefit you more.",singleWillpowerPt:"Ignore problemas pessoais para explorar um lugar desconhecido.",allWillpowerPt:"Viaje para longe quando permanecer seria mais benéfico."},
];

export const CTL_NEEDLES = CTL_NEEDLE_DEFINITIONS.map((item)=>item.name);
export const CTL_THREADS = CTL_THREAD_DEFINITIONS.map((item)=>item.name);
const LEGACY_NEEDLE_NAMES:Record<string,string>={"Mestre de Xadrez":"Chess Master",Comandante:"Commander",Compositor:"Composer",Conselheiro:"Counselor",Audacioso:"Daredevil","Dínamo":"Dynamo",Protetor:"Protector",Provedor:"Provider",Erudito:"Scholar","Contador de Histórias":"Storyteller",Professor:"Teacher",Tradicionalista:"Traditionalist",Visionário:"Visionary"};
const LEGACY_THREAD_NAMES:Record<string,string>={Aceitação:"Acceptance",Raiva:"Anger",Família:"Family",Amizade:"Friendship",Ódio:"Hate",Honra:"Honor",Alegria:"Joy",Amor:"Love",Memória:"Memory",Vingança:"Revenge"};
const anchorAliases=(kind:"needle"|"thread")=>kind==="needle"?LEGACY_NEEDLE_NAMES:LEGACY_THREAD_NAMES;
export function canonicalChangelingAnchorName(kind:"needle"|"thread",name:unknown) {
  const value=String(name??"");
  const definitions=kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS;
  return definitions.find(item=>item.name===value||item.translatedName===value)?.name??anchorAliases(kind)[value]??value;
}
export function changelingAnchorRecovery(kind:"needle"|"thread",name:unknown,locale:"pt-BR"|"en-US"="en-US") {
  const item=(kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS).find((entry)=>entry.name===canonicalChangelingAnchorName(kind,name));
  if(!item)return "";
  const single=locale==="pt-BR"?item.singleWillpowerPt:item.singleWillpower;
  const all=locale==="pt-BR"?item.allWillpowerPt:item.allWillpower;
  return locale==="pt-BR"?`Recuperar 1 FV: ${single}\nRecuperar toda a FV: ${all}`:`Recover 1 Willpower: ${single}\nRecover all Willpower: ${all}`;
}
export function changelingAnchorDisplayName(kind:"needle"|"thread",name:unknown,locale:"pt-BR"|"en-US"="en-US") {
  const item=(kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS).find((entry)=>entry.name===canonicalChangelingAnchorName(kind,name));
  return locale==="pt-BR"?(item?.translatedName??Object.entries(anchorAliases(kind)).find(([,canonical])=>canonical===item?.name)?.[0]??item?.name??String(name??"")):(item?.name??String(name??""));
}
export const REGALIA = ["Crown", "Jewels", "Mirror", "Shield", "Steed", "Sword", "Chalice", "Coin", "Scepter", "Stars", "Thorn"];
export function changelingFrailtySlots(wyrd: number) {
  return 1 + Math.floor(Math.max(1, Math.min(10, Math.trunc(wyrd))) / 2);
}

export function normalizeChangelingFrailties(value: unknown, wyrd: number) {
  const slots = changelingFrailtySlots(wyrd);
  const current = Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
  const custom = current.filter((item) => item.trim() && !["ferro frio", "cold iron"].includes(item.toLocaleLowerCase("pt-BR")));
  return ["Cold Iron", ...custom.slice(0, slots - 1)]
    .concat(Array(Math.max(0, slots - 1 - custom.length)).fill(""))
    .slice(0, slots);
}

export function wyrdSummary(wyrd: number, locale:"pt-BR"|"en-US"="pt-BR") {
  const rating = Math.max(1, Math.min(10, Math.trunc(wyrd)));
  const penaltyReduction = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4][rating - 1];
  const fruits = [3, 7, 7, 13, 13, 13, 29, 29, 101, "Unlimited"][rating - 1];
  if(locale==="en-US") return `Wyrd ${rating} (-${penaltyReduction} Fatigue/Disease; ${typeof fruits === "number" ? `${fruits} Goblin Fruits` : `${fruits} Goblin Fruits`})`;
  return `Fado ${rating} (-${penaltyReduction} Fadiga/Doenças; ${typeof fruits === "number" ? `${fruits} Frutas` : "Frutas ilimitadas"})`;
}

