export type ChangelingCondition = {
  id: string;
  name: string;
  originalName: string;
  category: "Mental" | "Física" | "Physical" | "Social" | "Sobrenatural" | "Supernatural" | "Changeling";
  description: string;
  penalty?: string;
  resolution?: string;
  beat?: string;
  persistent?: boolean;
  source: string;
  sourceCode: string;
  page: number;
};

export const CHANGELING_CONDITIONS: ChangelingCondition[] = [
  {id:"contemptuous",name:"Contemptuous",originalName:"Contemptuous",category:"Social",description:"You cannot stand a specified rival and enjoy opportunities to work against them.",penalty:"Gain +2 on rolls that adversely affect the specified character. Their Social maneuvering treats their impression one level lower, to Hostile. Multiple instances may name different rivals.",resolution:"Harm the rival in a way that puts you or your allies in danger.",source:"Book of Courts",sourceCode:"BoC",page:112},
  {id:"amnesia",name:"Amnésia",originalName:"Amnesia",category:"Mental",description:"Uma parte importante da memória desapareceu, trazendo dificuldades quando pessoas, inimigos ou obrigações esquecidas retornam.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"broken",name:"Quebrado",originalName:"Broken",category:"Mental",description:"O personagem perdeu a capacidade de enfrentar pressão emocional e recua diante de confrontos.",penalty:"−2 em testes Sociais e com Perseverança; −5 em Intimidação.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"deprived",name:"Privado",originalName:"Deprived",category:"Mental",description:"A abstinência de um vício impede o personagem de se concentrar e se controlar.",penalty:"−1 dado em paradas de Vigor, Perseverança e Compostura.",source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"dissociation",name:"Dissociação",originalName:"Dissociation",category:"Mental",description:"A realidade parece distante e o changeling observa as próprias ações como um passageiro em seu corpo.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:336},
  {id:"fixated",name:"Fixado",originalName:"Fixated",category:"Mental",description:"Um único pensamento ou comando domina a atenção até ser cumprido.",penalty:"−2 em todas as ações até cumprir o comando ou a cena terminar.",source:"Hurt Locker",sourceCode:"HL",page:150},
  {id:"fugue",name:"Fuga",originalName:"Fugue",category:"Mental",description:"Trauma provoca apagões; situações semelhantes podem entregar o controle do personagem ao Narrador por uma cena.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"guilty",name:"Culpado",originalName:"Guilty",category:"Mental",description:"Remorso profundo torna o personagem emocionalmente vulnerável.",penalty:"−2 para defender-se com Perseverança ou Compostura contra Subterfúgio, Empatia ou Intimidação.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"informed",name:"Informado",originalName:"Informed",category:"Mental",description:"Pesquisa fornece informação decisiva sobre um assunto; ao resolver, uma falha vira sucesso e um sucesso vira sucesso excepcional.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"inspired",name:"Inspirado",originalName:"Inspired",category:"Mental",description:"Uma inspiração guia a ação; ao resolver, três sucessos bastam para um sucesso excepcional e o personagem recupera Força de Vontade.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"lost",name:"Perdido",originalName:"Lost",category:"Mental",description:"O personagem não sabe onde está nem como alcançar seu destino e precisa se orientar antes de progredir.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"madness",name:"Loucura",originalName:"Madness",category:"Mental",description:"Horrores sobrenaturais romperam sua compreensão da realidade; o Narrador pode impor um modificador negativo uma vez por capítulo.",penalty:"Até −(10 − Lucidez atual) em um teste Mental ou Social, uma vez por capítulo.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"oblivious",name:"Alheio",originalName:"Oblivious",category:"Mental",description:"O personagem está ausente e deixa de perceber o que acontece ao redor.",penalty:"−2 em testes de Percepção.",source:"Hurt Locker",sourceCode:"HL",page:150},
  {id:"obsession",name:"Obsessão",originalName:"Obsession",category:"Mental",description:"Uma obsessão domina a atenção e favorece apenas ações diretamente relacionadas a ela.",penalty:"9-novamente ao perseguir a obsessão; perde 10-novamente em ações não relacionadas.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:290},
  {id:"reckless",name:"Imprudente",originalName:"Reckless",category:"Mental",description:"O personagem ignora consequências e procura riscos pelo prazer da ação.",penalty:"−2 em Percepção e outros testes de Compostura para notar algo.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:344},
  {id:"shaken",name:"Abalado",originalName:"Shaken",category:"Mental",description:"Um medo severo interfere nas ações; o jogador pode optar por falhar numa ação prejudicada pelo medo para resolver a Condition.",source:"Chronicles of Darkness",sourceCode:"CofD",page:290},
  {id:"sleepwalking",name:"Sonambulismo",originalName:"Sleepwalking",category:"Mental",description:"Sonho e vigília se confundem, causando tempo perdido, falsas lembranças de tarefas e obrigações não cumpridas.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:344},
  {id:"spooked",name:"Assombrado",originalName:"Spooked",category:"Mental",description:"O contato com o sobrenatural fascina e assusta até o personagem complicar a situação por causa disso.",source:"Chronicles of Darkness",sourceCode:"CofD",page:291},
  {id:"steadfast",name:"Resoluto",originalName:"Steadfast",category:"Mental",description:"A determinação permite resolver a Condition após uma falha para transformar o resultado em um sucesso simples.",source:"Chronicles of Darkness",sourceCode:"CofD",page:291},
  {id:"stoic",name:"Estoico",originalName:"Stoic",category:"Mental",description:"O personagem fecha-se emocionalmente, ocultando traumas mas bloqueando cura de Lucidez e expressão sincera.",penalty:"+2 em Subterfúgio para ocultar emoções; −2 em Hedgespinning; não cura Lucidez enquanto persistir.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:345},
  {id:"swooned",name:"Enamorado",originalName:"Swooned",category:"Mental",description:"A atração por uma pessoa torna o personagem vulnerável à influência e relutante em prejudicá-la.",penalty:"−2 em ações que prejudiquem a pessoa; ela recebe +2 em testes Sociais contra o personagem.",source:"Chronicles of Darkness",sourceCode:"CofD",page:291},
  {id:"withdrawn",name:"Retraído",originalName:"Withdrawn",category:"Mental",description:"Dúvida e insegurança levam o personagem a buscar isolamento e segurança.",penalty:"−2 em todos os testes que exijam interação com outras pessoas.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:346},
  {id:"arm-disability",name:"Deficiência no Braço",originalName:"Arm Disability",category:"Física",description:"Um ou ambos os braços não funcionam sem tratamento ou tecnologia assistiva apropriada.",penalty:"Um braço: penalidade de mão inábil; ambos: dado de sorte em destreza manual e −3 em outras ações Físicas.",persistent:true,source:"Hurt Locker",sourceCode:"HL",page:57},
  {id:"blind",name:"Cego",originalName:"Blind",category:"Física",description:"O personagem perdeu a visão e precisa substituir esse sentido ou lidar com a escuridão total.",penalty:"Dado de sorte em ações que exigem visão; −3 quando outro sentido puder substituí-la.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"chronic-agony",name:"Agonia Crônica",originalName:"Chronic Agony",category:"Física",description:"Dores incapacitantes retornam após estresse ou esforço físico e impõem os efeitos de Atordoado.",penalty:"Atordoado: perde a próxima ação e a Defesa até voltar a agir.",persistent:true,source:"Hurt Locker",sourceCode:"HL",page:57},
  {id:"chronic-sickness",name:"Doença Crônica",originalName:"Chronic Sickness",category:"Física",description:"Doença ou toxina persiste e piora durante esforço e estresse.",penalty:"−1 em todas as ações, aumentando em −1 a cada dois turnos, até −5.",persistent:true,source:"Hurt Locker",sourceCode:"HL",page:57},
  {id:"deaf",name:"Surdo",originalName:"Deaf",category:"Física",description:"A audição de um ou ambos os ouvidos está severamente comprometida.",penalty:"Um ouvido: −3 em Percepção; ambos: dado de sorte em Percepção e −2 em combate.",persistent:true,source:"Hurt Locker",sourceCode:"HL",page:58},
  {id:"disabled",name:"Incapacitado",originalName:"Disabled",category:"Física",description:"O personagem não consegue caminhar de modo eficaz sem cadeira de rodas ou outro auxílio.",penalty:"Deslocamento efetivo 1; cadeira manual usa Força, cadeira elétrica possui Deslocamento 3.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"fragile",name:"Frágil",originalName:"Fragile",category:"Física",description:"Equipamento improvisado ou danificado perde resistência e pode se desfazer durante o uso.",source:"Chronicles of Darkness",sourceCode:"CofD",page:102},
  {id:"leg-disability",name:"Deficiência na Perna",originalName:"Leg Disability",category:"Física",description:"Uma perna não funciona adequadamente sem tratamento ou prótese apropriada.",penalty:"Metade do Deslocamento e −2 em ações Físicas relacionadas a movimento.",persistent:true,source:"Hurt Locker",sourceCode:"HL",page:58},
  {id:"lethargic",name:"Letárgico",originalName:"Lethargic",category:"Física",description:"Exaustão extrema pesa sobre o personagem até que ele durma uma noite inteira.",penalty:"Não pode gastar Força de Vontade; −1 cumulativo em todas as ações a cada seis horas sem dormir.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:342},
  {id:"mute",name:"Mudo",originalName:"Mute",category:"Física",description:"O personagem não consegue falar e precisa se comunicar por escrita, gestos ou sinais.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:290},
  {id:"numb",name:"Entorpecido",originalName:"Numb",category:"Física",description:"Trauma deixa o corpo dormente e torna ações mundanas imprecisas, enquanto a magia parece aliviar os sintomas.",penalty:"−2 em todas as ações físicas mundanas.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:343},
  {id:"volatile",name:"Volátil",originalName:"Volatile",category:"Física",description:"Equipamento ou plano está prestes a falhar de modo catastrófico.",penalty:"Qualquer falha ao usar o equipamento torna-se falha dramática.",source:"Chronicles of Darkness",sourceCode:"CofD",page:102},
  {id:"bonded",name:"Vinculado",originalName:"Bonded",category:"Social",description:"Um vínculo profundo com um animal fortalece influência, confiança e resistência ao medo.",penalty:"+2 para influenciar o animal; ele pode usar Trato com Animais do personagem contra medo ou coerção.",source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"connected",name:"Conectado",originalName:"Connected",category:"Social",description:"O personagem estabeleceu relações úteis dentro de um grupo específico.",penalty:"+2 em testes relacionados ao grupo; pode resolver para obter um sucesso excepcional automático ao influenciá-lo.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:288},
  {id:"embarrassing-secret",name:"Segredo Constrangedor",originalName:"Embarrassing Secret",category:"Social",description:"Um segredo pode provocar ostracismo, chantagem ou consequências legais caso se torne público.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"hunted",name:"Caçado",originalName:"Hunted",category:"Social",description:"Um inimigo sério persegue o personagem para feri-lo ou atormentá-lo.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:342},
  {id:"leveraged",name:"Coagido",originalName:"Leveraged",category:"Social",description:"Alguém possui influência, chantagem ou vantagem suficiente para exigir um favor sem resistência.",source:"Chronicles of Darkness",sourceCode:"CofD",page:289},
  {id:"notoriety",name:"Notoriedade",originalName:"Notoriety",category:"Social",description:"Má fama provoca repulsa e ostracismo entre aqueles que a conhecem.",penalty:"−2 em testes Sociais com quem conhece a fama; uma Porta adicional em Manobra Social.",source:"Chronicles of Darkness",sourceCode:"CofD",page:290},
  {id:"reluctant-aggressor",name:"Agressor Relutante",originalName:"Reluctant Aggressor",category:"Social",description:"O personagem foi levado a ferir alguém contra sua vontade e hesita diante da vítima.",penalty:"−2 em ataques contra a vítima designada.",source:"Hurt Locker",sourceCode:"HL",page:150},
  {id:"surveilled",name:"Vigiado",originalName:"Surveilled",category:"Social",description:"Uma pessoa ou organização acompanha os movimentos do personagem e reúne informações sobre ele.",source:"Hurt Locker",sourceCode:"HL",page:150},
  {id:"goblin-queen",name:"Rainha Goblin",originalName:"Goblin Queen",category:"Sobrenatural",description:"A natureza goblin fragmentada prende o personagem na Sebe e atrai seguidores hobgoblins.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:339},
  {id:"hedge-denizen",name:"Habitante da Sebe",originalName:"Hedge Denizen",category:"Sobrenatural",description:"Dívidas e pactos transformaram o personagem em goblin, mudando Contratos, Corte e sua relação com a Sebe.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:340},
  {id:"soulless",name:"Sem Alma",originalName:"Soulless",category:"Sobrenatural",description:"A perda da alma corrói lentamente a vontade, a identidade e a capacidade de resistir à degeneração.",persistent:true,source:"Chronicles of Darkness",sourceCode:"CofD",page:290},
  {id:"ravaged",name:"Devastado",originalName:"Ravaged",category:"Sobrenatural",description:"Predação feérica destruiu sonhos ou emoções, deixando o personagem vazio e incapaz de descansar.",penalty:"−2 em todos os testes; não recupera Força de Vontade dormindo.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:344},
  {id:"behind-your-eyes",name:"Atrás de Seus Olhos",originalName:"Behind Your Eyes",category:"Changeling",description:"Um fantasma da Sebe, hobgoblin ou Fae Verdadeiro compartilha os sentidos do changeling e pode descobrir seus segredos.",source:"Kith and Kin",sourceCode:"Kith",page:140},
  {id:"comatose",name:"Comatose",originalName:"Comatose",category:"Changeling",description:"Com Lucidez zero, o changeling recua para um sonho contínuo que acredita ser realidade.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:334},
  {id:"cursed",name:"Amaldiçoado",originalName:"Cursed",category:"Changeling",description:"Uma maldição imposta por outro changeling persiste enquanto ele mantiver a rotina ou exigência definida.",persistent:true,source:"Kith and Kin",sourceCode:"Kith",page:140},
  {id:"deep-kenning",name:"Kenning Profundo",originalName:"Deep Kenning",category:"Changeling",description:"Lucidez restaurada concede um lampejo de conhecimento sobre fenômenos sobrenaturais próximos.",source:"Kith and Kin",sourceCode:"Kith",page:140},
  {id:"dream-assailant",name:"Agressor dos Sonhos",originalName:"Dream Assailant",category:"Changeling",description:"Mudanças excessivas tornaram os eidolons hostis e resistentes a novas alterações do sonho.",penalty:"−5 para interação pacífica ou agir despercebido; mudanças de paradigma custam +2 sucessos.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:336},
  {id:"dream-infiltrator",name:"Infiltrador dos Sonhos",originalName:"Dream Infiltrator",category:"Changeling",description:"Uma mudança significativa tornou os eidolons desconfiados do personagem.",penalty:"−2 para interação pacífica; −3 para agir despercebido; mudanças sutis custam +1 sucesso.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:337},
  {id:"dream-intruder",name:"Intruso dos Sonhos",originalName:"Dream Intruder",category:"Changeling",description:"Múltiplas alterações deixaram o sonho e seus eidolons desconfortáveis com a presença do personagem.",penalty:"−3 para interação pacífica e −4 para agir despercebido.",source:"Changeling the Lost",sourceCode:"CTL 2e",page:338},
  {id:"egomaniac",name:"Egomaníaco",originalName:"Egomaniac",category:"Changeling",description:"Sem Lucidez, o changeling imita o ego ilimitado dos Fae Verdadeiros e ignora as necessidades alheias.",penalty:"Falhas em testes Sociais tornam-se falhas dramáticas sem conceder Beat.",source:"Kith and Kin",sourceCode:"Kith",page:141},
  {id:"enchanted-obligation",name:"Obrigação Encantada",originalName:"Enchanted Obligation",category:"Changeling",description:"Uma barganha encantada protege o changeling enquanto concede ao mortal visão através da Máscara e acesso a sua ajuda feérica.",source:"Kith and Kin",sourceCode:"Kith",page:141},
  {id:"glamour-addicted",name:"Viciado em Glamour",originalName:"Glamour Addicted",category:"Changeling",description:"O corpo definha quando o personagem não se alimenta regularmente de Glamour suficiente.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:339},
  {id:"hexed",name:"Enfeitiçado",originalName:"Hexed",category:"Changeling",description:"Um changeling impôs um inconveniente temporário que termina apenas quando a ação ou missão especificada é cumprida.",source:"Kith and Kin",sourceCode:"Kith",page:141},
  {id:"icon-shard",name:"Fragmento de Ícone",originalName:"Icon Shard",category:"Changeling",description:"Um juramento rompido deu vida maliciosa a um fragmento do Ícone, que passa a atormentar o changeling.",persistent:true,source:"Kith and Kin",sourceCode:"Kith",page:141},
  {id:"indebted",name:"Endividado",originalName:"Indebted",category:"Changeling",description:"O personagem deve um serviço a um ser feérico e pode pagar aceitando dano, uma Condition prejudicial ou uma Inclinação pessoal.",persistent:true,source:"Kith and Kin",sourceCode:"Kith",page:142},
  {id:"kithseeker",name:"Buscador de Fratria",originalName:"Kithseeker",category:"Changeling",description:"O changeling enfrenta cinco provações na Sebe para encontrar uma Fratria que corresponda ao chamado de sua alma.",persistent:true,source:"Kith and Kin",sourceCode:"Kith",page:142},
  {id:"oathbreaker",name:"Quebrador de Juramento",originalName:"Oathbreaker",category:"Changeling",description:"O Wyrd marca quem violou um juramento e desperta desconfiança entre os changelings.",penalty:"−1 em ações Sociais com changelings; não pode selar declarações com Glamour.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:343},
  {id:"obliged",name:"Obrigado",originalName:"Obliged",category:"Changeling",description:"Uma barganha de serviço com um mortal protege o changeling contra Caçadores e perseguidores vinculados ao Wyrd.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:343},
  {id:"hedge-addiction",name:"Vício na Sebe",originalName:"Hedge Addiction",category:"Changeling",description:"A Sebe chama e tenta o personagem, tornando difícil permanecer longe de seus caminhos e perigos.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:340},
  {id:"arcadian-dreams",name:"Sonhos Arcadianos",originalName:"Arcadian Dreams",category:"Changeling",description:"Visões do protegido preso em Arcádia distraem o personagem, mas também indicam sua direção dentro da Sebe.",penalty:"+1 para navegar pela Sebe em direção ao protegido; o jogador pode escolher falhar para representar as visões.",persistent:true,source:"Changeling the Lost",sourceCode:"CTL 2e",page:333},
];

export function findChangelingCondition(id: string) {
  return CHANGELING_CONDITIONS.find((condition) => condition.id === id);
}

type ConditionEnglishText = { description: string; penalty?: string; resolution?: string; beat?: string };
const CONDITION_TEXT_EN: Record<string, ConditionEnglishText> = {
  amnesia:{description:"An important part of the character's memory is missing, creating complications when forgotten people, enemies, or obligations return."},
  broken:{description:"The character has lost the ability to withstand emotional pressure and retreats from confrontation.",penalty:"−2 to Social and Resolve rolls; −5 to Intimidation."},
  deprived:{description:"Withdrawal from an addiction prevents the character from concentrating or controlling themself.",penalty:"−1 die to Stamina, Resolve, and Composure pools."},
  dissociation:{description:"Reality feels distant, and the changeling experiences their own actions as a passenger in their body."},
  fixated:{description:"A single thought or command dominates the character's attention until it is fulfilled.",penalty:"−2 to all actions until the command is fulfilled or the scene ends."},
  fugue:{description:"Trauma causes blackouts; similar situations may give the Storyteller control of the character for a scene."},
  guilty:{description:"Profound remorse leaves the character emotionally vulnerable.",penalty:"−2 to Resolve or Composure when defending against Subterfuge, Empathy, or Intimidation."},
  informed:{description:"Research provides decisive information about a subject. Resolve this Condition to turn a failure into a success, or a success into an exceptional success."},
  inspired:{description:"Inspiration guides the character's action. Resolve this Condition to achieve an exceptional success with three successes and recover Willpower."},
  lost:{description:"The character does not know where they are or how to reach their destination and must reorient before making progress."},
  madness:{description:"Supernatural horrors have fractured the character's grasp on reality; once per chapter, the Storyteller may impose a negative modifier.",penalty:"Up to −(10 − current Clarity) on one Mental or Social roll, once per chapter."},
  oblivious:{description:"The character is distracted and fails to notice what is happening around them.",penalty:"−2 to Perception rolls."},
  obsession:{description:"An obsession dominates the character's attention and favors only actions directly related to it.",penalty:"9-again while pursuing the obsession; lose 10-again on unrelated actions."},
  reckless:{description:"The character ignores consequences and seeks danger for the thrill of acting.",penalty:"−2 to Perception and other Composure rolls made to notice something."},
  shaken:{description:"Severe fear interferes with the character's actions. The player may choose to fail an action impaired by that fear to resolve the Condition."},
  sleepwalking:{description:"Dream and waking blur together, causing lost time, false memories of completed tasks, and neglected obligations."},
  spooked:{description:"Contact with the supernatural fascinates and frightens the character until they complicate the situation because of it."},
  steadfast:{description:"Resolve this Condition after failing an action to convert that result into a single success."},
  stoic:{description:"The character shuts down emotionally, concealing trauma while blocking Clarity healing and sincere expression.",penalty:"+2 to Subterfuge rolls to conceal emotions; −2 to Hedgespinning; cannot heal Clarity while this Condition persists."},
  swooned:{description:"Attraction to a specified person makes the character vulnerable to influence and reluctant to harm them.",penalty:"−2 to actions that would harm the person; that person gains +2 to Social rolls against the character."},
  withdrawn:{description:"Doubt and insecurity drive the character to seek isolation and safety.",penalty:"−2 to all rolls that require interacting with other people."},
  "arm-disability":{description:"One or both arms do not function without appropriate treatment or assistive technology.",penalty:"One arm: off-hand penalty; both arms: chance die for manual dexterity and −3 to other Physical actions."},
  blind:{description:"The character cannot see and must replace that sense or contend with total darkness.",penalty:"Chance die on actions that require sight; −3 when another sense can substitute."},
  "chronic-agony":{description:"Disabling pain returns after stress or physical exertion and inflicts the Stunned Tilt.",penalty:"Stunned: lose the next action and Defense until the character can act again."},
  "chronic-sickness":{description:"A disease or toxin persists and worsens during exertion and stress.",penalty:"−1 to all actions, increasing by −1 every two turns to a maximum of −5."},
  deaf:{description:"Hearing in one or both ears is severely impaired.",penalty:"One ear: −3 to Perception; both ears: chance die for auditory Perception and −2 in combat."},
  disabled:{description:"The character cannot walk effectively without a wheelchair or another mobility aid.",penalty:"Effective Speed 1; a manual wheelchair uses Strength, while a powered chair has Speed 3."},
  fragile:{description:"Improvised or damaged equipment has lost integrity and may fall apart during use."},
  "leg-disability":{description:"One leg does not function properly without appropriate treatment or a prosthesis.",penalty:"Half Speed and −2 to Physical actions involving movement."},
  lethargic:{description:"Extreme exhaustion weighs on the character until they get a full night's sleep.",penalty:"Cannot spend Willpower; cumulative −1 to all actions for every six hours without sleep."},
  mute:{description:"The character cannot speak and must communicate through writing, gestures, or sign language."},
  numb:{description:"Trauma leaves the body numb and mundane actions imprecise, while magic seems to ease the symptoms.",penalty:"−2 to all mundane Physical actions."},
  volatile:{description:"A piece of equipment or a plan is on the verge of catastrophic failure.",penalty:"Any failure while using the equipment becomes a dramatic failure."},
  bonded:{description:"A deep bond with an animal strengthens influence, trust, and resistance to fear.",penalty:"+2 to influence the animal; it may use the character's Animal Ken against fear or coercion."},
  connected:{description:"The character has established useful relationships within a specified group.",penalty:"+2 to rolls involving the group; resolve to gain an automatic exceptional success when influencing it."},
  "embarrassing-secret":{description:"A secret could cause ostracism, blackmail, or legal consequences if revealed."},
  hunted:{description:"A serious enemy pursues the character to harm or torment them."},
  leveraged:{description:"Someone holds enough leverage, blackmail material, or influence to demand a favor without resistance."},
  notoriety:{description:"A bad reputation causes revulsion and ostracism among those who know it.",penalty:"−2 to Social rolls with anyone who knows the reputation; add one Door in Social maneuvering."},
  "reluctant-aggressor":{description:"The character was compelled to harm someone against their will and hesitates before the designated victim.",penalty:"−2 to attacks against the designated victim."},
  surveilled:{description:"A person or organization monitors the character's movements and gathers information about them."},
  "goblin-queen":{description:"A fragmented goblin nature binds the character to the Hedge and attracts hobgoblin followers."},
  "hedge-denizen":{description:"Debts and bargains have transformed the character into a goblin, changing their Contracts, Court, and relationship with the Hedge."},
  soulless:{description:"The loss of the soul slowly erodes will, identity, and the ability to resist degeneration."},
  ravaged:{description:"Faerie predation has destroyed dreams or emotions, leaving the character empty and unable to rest.",penalty:"−2 to all rolls; cannot recover Willpower through sleep."},
  "behind-your-eyes":{description:"A Hedge ghost, hobgoblin, or True Fae shares the changeling's senses and may uncover their secrets."},
  comatose:{description:"At Clarity zero, the changeling retreats into a continuous dream they believe is reality."},
  cursed:{description:"A curse imposed by another changeling persists while the victim maintains its specified routine or requirement."},
  "deep-kenning":{description:"Restored Clarity grants a flash of insight into nearby supernatural phenomena."},
  "dream-assailant":{description:"Excessive alterations have made the dream's eidolons hostile and resistant to further changes.",penalty:"−5 to peaceful interaction or remaining unnoticed; paradigm shifts cost +2 successes."},
  "dream-infiltrator":{description:"A significant alteration has made the dream's eidolons suspicious of the character.",penalty:"−2 to peaceful interaction; −3 to remain unnoticed; subtle shifts cost +1 success."},
  "dream-intruder":{description:"Multiple alterations have made the dream and its eidolons uncomfortable with the character's presence.",penalty:"−3 to peaceful interaction and −4 to remain unnoticed."},
  egomaniac:{description:"Without Clarity, the changeling imitates the boundless ego of the True Fae and ignores other people's needs.",penalty:"Failures on Social rolls become dramatic failures without granting a Beat."},
  "enchanted-obligation":{description:"An enchanted bargain protects the changeling while granting a mortal sight through the Mask and access to fae assistance."},
  "glamour-addicted":{description:"The character's body deteriorates when they do not regularly consume enough Glamour."},
  hexed:{description:"A changeling has imposed a temporary inconvenience that ends only when the specified action or mission is completed."},
  "icon-shard":{description:"A broken oath has given malicious life to a fragment of the Icon, which now torments the changeling."},
  indebted:{description:"The character owes a service to a fae being and may repay it by accepting damage, a detrimental Condition, or a Personal Tilt."},
  kithseeker:{description:"The changeling must face five trials in the Hedge to find a Kith matching the call of their soul."},
  oathbreaker:{description:"The Wyrd marks an oathbreaker and inspires distrust among changelings.",penalty:"−1 to Social actions with changelings; cannot seal statements with Glamour."},
  obliged:{description:"A service bargain with a mortal protects the changeling from Huntsmen and Wyrd-bound pursuers."},
  "hedge-addiction":{description:"The Hedge calls to and tempts the character, making it difficult to remain away from its paths and dangers."},
  "arcadian-dreams":{description:"Visions of a ward trapped in Arcadia distract the character but also reveal the ward's direction within the Hedge.",penalty:"+1 to navigate the Hedge toward the ward; the player may choose to fail to represent the visions."},
};

export function changelingConditionPresentation(condition: ChangelingCondition, locale: "pt-BR" | "en-US"): ChangelingCondition {
  if (locale === "pt-BR") return condition;
  const english = CONDITION_TEXT_EN[condition.id];
  return {
    ...condition,
    name: condition.originalName,
    category: condition.category === "Física" ? "Physical" : condition.category === "Sobrenatural" ? "Supernatural" : condition.category,
    description: english?.description ?? condition.description,
    penalty: english ? english.penalty : condition.penalty,
    resolution: english?.resolution ?? (!english && condition.resolution ? condition.resolution : condition.persistent
      ? "Permanently remove the cause of the Condition or fulfill the recovery method established by the Storyteller and the listed source."
      : "Fulfill the circumstance that ends the described effect or remove its cause during the story."),
    beat: condition.persistent ? english?.beat ?? (!english && condition.beat ? condition.beat : "Gain a Beat when this Condition causes a significant complication or limitation, at most once per chapter.") : undefined,
  };
}

// As edições de CofD sempre apresentam uma Resolução e, nas Conditions
// persistentes, um gatilho de Beat. Os textos abaixo também servem como
// migração segura para registros importados antes de esses campos existirem.
for (const condition of CHANGELING_CONDITIONS) {
  condition.resolution ??= condition.persistent
    ? "Remova de modo duradouro a causa da Condition ou cumpra a forma de recuperação estabelecida pelo Narrador e pela fonte indicada."
    : "Cumpra a circunstância que encerra o efeito descrito ou elimine sua causa durante a história.";
  condition.beat ??= condition.persistent
    ? "Receba um Beat quando esta Condition causar uma complicação ou limitação significativa (no máximo uma vez por capítulo)."
    : undefined;
}
