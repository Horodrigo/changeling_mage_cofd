import type { Locale } from "./i18n";

export type CourtDefinition = {
  id: string;
  name: string;
  translatedName: string;
  emotion: string;
  emotionPt: string;
  mantleBenefits: string[];
  mantleBenefitsPt: string[];
  sourceId: "ctl-2ed" | "ctl-dark-eras" | "h-courts";
  source: string;
  page: number;
};

const court = (
  id: string, name: string, translatedName: string, emotion: string, emotionPt: string,
  page: number, mantleBenefits: string[], mantleBenefitsPt: string[],
  sourceId: CourtDefinition["sourceId"] = "ctl-2ed",
): CourtDefinition => {
  const resolvedSourceId = sourceId === "ctl-2ed" && page >= 279 ? "h-courts" : sourceId;
  return {
    id, name, translatedName, emotion, emotionPt, mantleBenefits, mantleBenefitsPt,
    sourceId: resolvedSourceId,
    source: resolvedSourceId === "ctl-2ed" ? "Changeling: The Lost" : resolvedSourceId === "h-courts" ? "Book of Courts" : "Dark Eras Changeling (DE:CtL)",
    page,
  };
};

export const CTL_COURT_DEFINITIONS: CourtDefinition[] = [
  court("spring", "Spring Court", "Primavera", "Desire", "Desejo", 35, [
    "Apply Mantle as a bonus to seduce or attract.", "Apply Mantle as a bonus to goad overindulgence.", "Apply Mantle as a bonus when helping others through teamwork.", "Recover one additional Willpower when your Needle restores Willpower.", "Once per session, heal Clarity and turn a Condition caused by Clarity damage into a positive Condition.",
  ], [
    "Some o Manto às ações para seduzir ou atrair.", "Some o Manto às ações para incitar alguém ao excesso.", "Some o Manto às ações de trabalho em equipe para ajudar outra pessoa.", "Recupere um ponto adicional de Força de Vontade quando sua Agulha restaurá-la.", "Uma vez por sessão, cure Lucidez e transforme uma Condição causada por dano de Lucidez em uma Condição positiva.",
  ]),
  court("summer", "Summer Court", "Verão", "Wrath", "Ira", 39, [
    "Apply Mantle as a bonus to intimidate or cow.", "Apply Mantle as a bonus in combat while defending your freehold from the Fae.", "Gain general and ballistic armor equal to Mantle while standing or fighting on another's behalf.", "Automatically overcome mundane obstacles when striking them down or pushing them aside.", "Deal aggravated damage while defending a member of your freehold.",
  ], [
    "Some o Manto às ações para intimidar ou subjugar.", "Some o Manto às ações de combate ao defender sua comunidade feérica contra as Fadas.", "Receba armadura geral e balística igual ao Manto ao proteger ou lutar por outra pessoa.", "Supere automaticamente obstáculos mundanos ao derrubá-los ou afastá-los.", "Cause dano agravado ao defender um membro de sua comunidade feérica.",
  ]),
  court("autumn", "Autumn Court", "Outono", "Fear", "Medo", 43, [
    "Apply Mantle as a bonus to study or investigate Faerie.", "Apply Mantle as a bonus to frighten someone.", "Spend one less Glamour to activate Contracts against a threat from Faerie.", "Once per story, pay Goblin Debt equal to Mantle without suffering its usual effects.", "Spend 2 Glamour to reproduce and retarget a magical effect used on you earlier in the scene.",
  ], [
    "Some o Manto às ações para estudar ou investigar as Fadas.", "Some o Manto às ações para amedrontar alguém.", "Gaste um Glamour a menos ao ativar Contratos contra uma ameaça das Fadas.", "Uma vez por história, quite Dívida Goblin igual ao Manto sem sofrer seus efeitos habituais.", "Gaste 2 Glamour para reproduzir e redirecionar um efeito mágico usado contra você anteriormente na cena.",
  ]),
  court("winter", "Winter Court", "Inverno", "Sorrow", "Tristeza", 47, [
    "Apply Mantle as a penalty to attempts to notice you while you spy.", "Apply Mantle as a bonus to obscure the truth.", "Apply Mantle as a bonus to Social actions after surrendering in a fight.", "Spend Glamour to make a combatant Beaten Down unless they spend 2 Willpower.", "Ignore wound penalties and add lethal or aggravated damage suffered as bonus dice to Physical actions.",
  ], [
    "Imponha o Manto como penalidade às tentativas de percebê-lo enquanto espiona.", "Some o Manto às ações para ocultar a verdade.", "Some o Manto às ações Sociais depois de se render em uma luta.", "Gaste Glamour para impor Derrotado a um combatente, a menos que ele gaste 2 Força de Vontade.", "Ignore penalidades de ferimento e some o dano letal ou agravado sofrido como dados de bônus às ações Físicas.",
  ]),
  court("sun", "Sun Court", "Corte do Sol", "Duty", "Dever", 78, [
    "Add Mantle to mundane rolls to find flaws, mistakes, or exploitable gaps.",
    "Enemies subtract Mantle from rolls to deceive or manipulate you.",
    "During an action scene, reduce Speed to 0 to add Mantle to Defense while acting out of duty.",
    "Ignore exhaustion, fatigue, and wound penalties while performing a personal or Sun Court duty.",
    "Once during daylight, spend Willpower instead of rolling a non-contested, non-resisted instant action to achieve one success.",
  ], [
    "Some o Manto a testes mundanos para encontrar falhas, erros ou brechas exploráveis.",
    "Inimigos subtraem seu Manto de testes para enganá-lo ou manipulá-lo.",
    "Durante uma cena de ação, reduza o Deslocamento a 0 para somar o Manto à Defesa enquanto age por dever.",
    "Ignore penalidades de exaustão, fadiga e ferimentos ao cumprir um dever pessoal ou da Corte do Sol.",
    "Uma vez durante o dia, gaste Força de Vontade em vez de testar uma ação instantânea não disputada nem resistida para obter um sucesso.",
  ], "h-courts"),
  court("moon", "Moon Court", "Corte da Lua", "Curiosity", "Curiosidade", 81, [
    "Add Mantle to mundane rolls to investigate something you have never seen before.",
    "Enemies subtract Mantle from rolls to deceive or manipulate you.",
    "Once per scene, add Mantle to a Contract roll that learns a specific piece of information.",
    "Once per chapter, halve physical harm or Clarity damage suffered directly through your curiosity; halve a resulting Condition's duration instead when applicable.",
    "During an evening, ignore exhaustion or Environmental Tilts for one scene a number of times equal to Mantle.",
  ], [
    "Some o Manto a testes mundanos para investigar algo que nunca viu antes.",
    "Inimigos subtraem seu Manto de testes para enganá-lo ou manipulá-lo.",
    "Uma vez por cena, some o Manto a um teste de Contrato que descubra uma informação específica.",
    "Uma vez por capítulo, reduza à metade o dano físico ou de Lucidez sofrido diretamente por sua curiosidade; quando aplicável, reduza à metade a duração da Condição resultante.",
    "Durante uma noite, ignore exaustão ou Inclinações Ambientais por uma cena um número de vezes igual ao Manto.",
  ], "h-courts"),
  court("undercourt", "Undercourt", "Subcorte", "Comfort", "Conforto", 86, [
    "Add Mantle to mundane rolls to convince someone that an event has a mundane explanation.",
    "Subtract Mantle from damage rolls caused by successful Clarity attacks suffered in your own home.",
    "Gain one dot of the ruling Court's Mantle solely to determine bonus dice in Social interactions.",
    "When sleeping overnight in your own home, regain 2 spent Willpower instead of 1.",
    "Reduce all Clarity attacks not caused by your own actions by two dice.",
  ], [
    "Some o Manto a testes mundanos para convencer alguém de que um acontecimento possui explicação mundana.",
    "Subtraia o Manto dos testes de dano causados por ataques de Lucidez bem-sucedidos sofridos em sua própria casa.",
    "Receba um ponto do Manto da Corte governante apenas para determinar dados de bônus em interações Sociais.",
    "Ao dormir uma noite inteira em sua própria casa, recupere 2 pontos de Força de Vontade gastos em vez de 1.",
    "Reduza em dois dados todos os ataques de Lucidez que não sejam causados por suas próprias ações.",
  ], "h-courts"),
  court("calm", "Calm Court", "Corte da Calmaria", "Relief", "Alívio", 87, [
    "Add Mantle to mundane rolls to ease a human or changeling's suffering.", "Add Mantle to mundane rolls to resist or help others resist intimidation and threats.", "Incite Bedlam to end a chosen emotion and accompanying Condition instead of inflicting one; supernatural emotions cause a Clash of Wills.", "Once per chapter, regain 1 Willpower after suffering a failure or dramatic failure.", "Spend 1 Glamour to create a three-meter bubble protecting you from Environmental Tilts for the scene.",
  ], [
    "Some o Manto a testes mundanos para aliviar o sofrimento de um humano ou changeling.", "Some o Manto a testes mundanos para resistir ou ajudar outros a resistir a intimidação e ameaças.", "Incite Bedlam para encerrar uma emoção escolhida e sua Condição em vez de impô-la; emoções sobrenaturais provocam Choque de Vontades.", "Uma vez por capítulo, recupere 1 Força de Vontade após sofrer uma falha ou falha dramática.", "Gaste 1 Glamour para criar uma bolha de três metros que o protege de Inclinações Ambientais pela cena.",
  ], "h-courts"),
  court("storm", "Storm Court", "Corte da Tempestade", "Courage", "Coragem", 90, [
    "Add Mantle to mundane rolls encouraging others to push through fear.", "Mundane attempts to frighten you subtract Mantle.", "When weather would impede the senses, add Mantle to perception instead.", "Your unarmed attacks use Mantle as weapon damage while lightning crackles around your limbs.", "Spend 1 Glamour to turn action penalties from Environmental Tilts into bonuses for the scene; this does not prevent injury.",
  ], [
    "Some o Manto a testes mundanos para encorajar outros a superar seus medos.", "Tentativas mundanas de amedrontá-lo subtraem seu Manto.", "Quando o clima prejudicaria os sentidos, some o Manto à percepção em vez disso.", "Seus ataques desarmados usam o Manto como dano de arma enquanto relâmpagos percorrem seus membros.", "Gaste 1 Glamour para transformar penalidades de Inclinações Ambientais em bônus pela cena; isso não impede ferimentos.",
  ], "h-courts"),
  court("fire", "Fire Court", "Corte do Fogo", "Confidence", "Confiança", 93, ["Add Mantle to mundane rolls to project authority.","Add Mantle to mundane rolls in formal challenges.","Once per chapter, spend Willpower for temporary Allies and/or Status dots totaling Mantle for a scene, to a maximum of five.","Spend 1 Glamour to use Presence instead of a Resistance Attribute against a hostile action.","Never suffer Beaten Down."],["Some o Manto a testes mundanos para projetar autoridade.","Some o Manto a testes mundanos em desafios formais.","Uma vez por capítulo, gaste Força de Vontade para receber Aliados e/ou Status temporários somando o Manto por uma cena, até cinco.","Gaste 1 Glamour para usar Presença no lugar de um Atributo de Resistência contra uma ação hostil.","Nunca sofra Derrotado."],"h-courts"),
  court("earth", "Earth Court", "Corte da Terra", "Determination", "Determinação", 96, ["Add Mantle to mundane rolls to hide or moderate emotions.","Add Mantle to mundane rolls to make money or acquire material resources.","Once per chapter, spend 1 Glamour to gain Steadfast.","Add half Mantle, rounded up, to maximum Willpower, even above 10.","Add Mantle to effective Resolve when contesting attempts to dissuade you from the current goal."],["Some o Manto a testes mundanos para ocultar ou moderar emoções.","Some o Manto a testes mundanos para ganhar dinheiro ou recursos materiais.","Uma vez por capítulo, gaste 1 Glamour para receber Resoluto.","Some metade do Manto, arredondada para cima, à Força de Vontade máxima, mesmo acima de 10.","Some o Manto à Perseverança efetiva contra tentativas de dissuadi-lo do objetivo atual."],"h-courts"),
  court("air", "Air Court", "Corte do Ar", "Inspiration", "Inspiração", 99, ["Add Mantle to mundane rolls to solve a puzzle or make a Plan.","Add Mantle to mundane rolls to inspire others, including Inspiring.","Once per chapter, waive either a sealing's Glamour cost or its strengthening Willpower cost.","When spending Inspired, add dice as though Willpower were also spent.","Dream Glamour harvesting requires only a subtle shift rather than a paradigm shift."],["Some o Manto a testes mundanos para solucionar um enigma ou criar um Plano.","Some o Manto a testes mundanos para inspirar outros, incluindo Inspirador.","Uma vez por capítulo, dispense o custo de Glamour de selar ou o custo de Força de Vontade de fortalecer.","Ao gastar Inspirado, some dados como se também gastasse Força de Vontade.","Colher Glamour de sonhos exige apenas uma mudança sutil em vez de mudança de paradigma."],"h-courts"),
  court("water", "Water Court", "Corte da Água", "Pity", "Piedade", 102, ["Add Mantle to mundane rolls to understand or uncover true feelings or pain.","Add Mantle to mundane attacks to disarm or hobble an opponent deserving pity.","Fetch Echoes used in your presence cost 1 additional Glamour; using the fetch's last Glamour this way inflicts 1 lethal damage.","Once per chapter when healing Clarity damage, heal one additional level.","Double natural healing speed; this stacks with Arcadian Metabolism."],["Some o Manto a testes mundanos para compreender ou revelar sentimentos verdadeiros ou dor.","Some o Manto a ataques mundanos para desarmar ou incapacitar alguém digno de piedade.","Ecos de simulacros usados em sua presença custam +1 Glamour; gastar assim o último Glamour causa 1 dano letal.","Uma vez por capítulo ao curar dano de Lucidez, cure um nível adicional.","Dobre a velocidade de cura natural; acumula com Metabolismo Arcadiano."],"h-courts"),
  court("north", "North Court", "Corte do Norte", "Suffering", "Sofrimento", 129, ["Add Mantle to mundane rolls to resist fatigue, deprivation, or passing out.","Add Mantle to mundane rolls to resist torture and pain.","Gain two Beats instead of one when taking damage in the last three Health boxes.","Spend 1 Glamour to ignore a Personal Tilt for one turn.","Once per chapter, ignore all damage from one attack that does not involve cold iron."],["Some o Manto a testes mundanos para resistir a fadiga, privação ou desmaio.","Some o Manto a testes mundanos para resistir a tortura e dor.","Receba duas Batidas em vez de uma ao sofrer dano nas três últimas caixas de Vitalidade.","Gaste 1 Glamour para ignorar uma Inclinação Pessoal por um turno.","Uma vez por capítulo, ignore todo o dano de um ataque que não envolva ferro frio."],"h-courts"),
  court("east", "East Court", "Corte do Leste", "Envy", "Inveja", 129, ["Add Mantle to mundane rolls to investigate someone currently doing business with you.","Add Mantle to mundane rolls to negotiate a deal.","Reduce Contract Glamour cost by one when swindling someone out of possessions.","While negotiating, spend 1 Glamour to inflict Wanton for the scene, once per target per story.","Physical actions gain 8-again while defending your property or possessions."],["Some o Manto a testes mundanos para investigar alguém que esteja negociando com você.","Some o Manto a testes mundanos para negociar um acordo.","Reduza em um o custo de Glamour de Contratos usados para lesar alguém e tomar suas posses.","Durante uma negociação, gaste 1 Glamour para impor Desejoso pela cena, uma vez por alvo por história.","Ações Físicas recebem 8-novamente ao defender sua propriedade ou suas posses."],"h-courts"),
  court("south", "South Court", "Corte do Sul", "Rebellion", "Rebelião", 129, ["Add Mantle to mundane rolls to avoid or sneak past characters of higher social status.","Add Mantle to mundane rolls to undermine a law or rule.","Once per scene, regain 1 Willpower when physically or verbally attacking someone who treated you or your motley unjustly.","Once per chapter, apply the rote quality to an attempt to harvest the Court emotion.","Once per story, automatically complete a truthful one-scene Social maneuver persuading a non-hostile Storyteller character to join your cause."],["Some o Manto a testes mundanos para evitar ou passar furtivamente por personagens de status social superior.","Some o Manto a testes mundanos para enfraquecer uma lei ou regra.","Uma vez por cena, recupere 1 Força de Vontade ao atacar física ou verbalmente alguém que tratou você ou seu motley injustamente.","Uma vez por capítulo, aplique a qualidade de rota a uma tentativa de colher a emoção da Corte.","Uma vez por história, conclua automaticamente uma manobra Social verdadeira de uma cena para convencer um personagem não hostil do Narrador a aderir à sua causa."],"h-courts"),
  court("west", "West Court", "Corte do Oeste", "Honor", "Honra", 130, ["Add Mantle to mundane rolls using one chosen weapon type.","Add Mantle to mundane rolls to strategize or employ combat tactics.","Add Mantle to Defense.","Once per chapter, apply the rote quality to an attack roll or Dodge action.","Ignore armor worn by Hedge creatures or agents of the Fae; supernatural armor triggers a Clash of Wills."],["Some o Manto a testes mundanos usando um tipo de arma escolhido.","Some o Manto a testes mundanos para elaborar estratégias ou empregar táticas de combate.","Some o Manto à Defesa.","Uma vez por capítulo, aplique a qualidade de rota a um ataque ou ação de Esquiva.","Ignore a armadura de criaturas da Sebe ou agentes das Fadas; armadura sobrenatural provoca Choque de Vontades."],"h-courts"),
  court("center", "Center Court", "Corte do Centro", "Reflection", "Reflexão", 130, ["Add Mantle to mundane rolls to console another person.","Add Mantle to mundane rolls to discern another person's true motives or emotions.","Gain Mantle dots divided among Allies, Contacts, and Striking Looks.","While you have not lied in the scene, automatically succeed at mundane actions to appear impartial and trustworthy on one matter; later lies about it automatically fail.","Once per chapter, touch another to heal up to Mantle bashing or lethal damage, or one aggravated damage, as an instant action."],["Some o Manto a testes mundanos para consolar outra pessoa.","Some o Manto a testes mundanos para discernir as verdadeiras motivações ou emoções de alguém.","Receba pontos iguais ao Manto divididos entre Aliados, Contatos e Aparência Marcante.","Enquanto não tiver mentido na cena, obtenha sucesso automático em ações mundanas para parecer imparcial e confiável em um assunto; mentiras posteriores sobre ele falham automaticamente.","Uma vez por capítulo, toque outra pessoa para curar até Manto de dano contundente ou letal, ou um dano agravado, como ação instantânea."],"h-courts"),
  court("society-morning", "Society of Morning", "Sociedade da Manhã", "Discovery through reckless pursuit", "Descoberta por busca imprudente", 279, [
    "Apply Mantle as a bonus to gather information on a new subject.", "Apply Mantle as a bonus to rolls involving instability or impermanence.", "Regain Willpower when a truth implicates a friend or ally.", "Automatically persuade a changeling to share information relevant to freehold safety; supernatural resistance triggers a Clash of Wills.", "Once per session, reveal an unknown truth to shift your negative Clarity Condition to another changeling.",
  ], [
    "Some o Manto ao reunir informações sobre um assunto novo.", "Some o Manto aos testes ligados à instabilidade ou impermanência.", "Recupere Força de Vontade quando uma verdade implicar um amigo ou aliado.", "Convença automaticamente outro changeling a revelar informação importante para a segurança da comunidade; resistência sobrenatural provoca Choque de Vontades.", "Uma vez por sessão, revele uma verdade desconhecida para transferir sua Condição negativa de Lucidez a outro changeling.",
  ]),
  court("society-day", "Society of Day", "Sociedade do Dia", "Resolving conflict", "Resolução de conflitos", 279, [
    "Apply Mantle as a bonus when continuing another person's project.", "Apply Mantle as a bonus to repair something nearly discarded.", "Apply Mantle as a bonus when mediating between hostile parties.", "Spend one less Glamour on Contracts used to improve or extend a public work.", "Once per session, find the mundane tools needed for the task at hand.",
  ], [
    "Some o Manto ao continuar o projeto de outra pessoa.", "Some o Manto ao reparar algo que estava prestes a ser descartado.", "Some o Manto ao mediar partes hostis.", "Gaste um Glamour a menos em Contratos usados para melhorar ou ampliar uma obra pública.", "Uma vez por sessão, encontre as ferramentas mundanas necessárias para a tarefa atual.",
  ]),
  court("society-night", "Society of Night", "Sociedade da Noite", "Following a hunt to its conclusion", "Levar uma caçada até o fim", 279, [
    "Apply Mantle as a bonus to research a problem the freehold has faced before.", "Apply Mantle as a bonus to shadow or investigate a new informant.", "Regain Willpower when deliberately choosing an action that inflicts a Condition.", "Apply Mantle as a bonus to conceal a fact about yourself or the freehold.", "Deal aggravated damage to a target you planned to attack.",
  ], [
    "Some o Manto ao pesquisar um problema que a comunidade já enfrentou.", "Some o Manto ao seguir ou investigar um novo informante.", "Recupere Força de Vontade ao escolher deliberadamente uma ação que imponha uma Condição.", "Some o Manto ao ocultar um fato sobre você ou sua comunidade.", "Cause dano agravado contra um alvo cujo ataque você planejou.",
  ]),
  court("spring-lag", "Spring Lag", "Lag da Primavera", "Abandoning established plans", "Abandono de planos estabelecidos", 283, [
    "Gain the Direction Sense Merit.", "Apply Mantle as a bonus to research something new with modern technology.", "Apply Mantle as a bonus to persuade people to abandon an old tradition.", "Regain Willpower when resolving Fragile or Volatile through Build Equipment.", "Speak and read every mundane language.",
  ], [
    "Receba o Mérito Senso de Direção.", "Some o Manto ao pesquisar algo novo com tecnologia moderna.", "Some o Manto ao convencer pessoas a abandonar uma tradição antiga.", "Recupere Força de Vontade ao resolver Frágil ou Volátil com Construir Equipamento.", "Fale e leia todos os idiomas mundanos.",
  ]),
  court("summer-lag", "Summer Lag", "Lag do Verão", "Risk taken to fulfill an obligation", "Risco para cumprir uma obrigação", 283, [
    "Apply Mantle as a bonus to uphold a law or rule.", "Apply Mantle as a bonus to hide fae magic from mortals.", "Spend Willpower to gain temporary Allies or Status dots equal to Mantle, to a maximum of five.", "Treat Resolve as one higher when resisting persuasion.", "Once per session, redistribute the motley's remaining Willpower among willing members.",
  ], [
    "Some o Manto ao fazer cumprir uma lei ou regra.", "Some o Manto ao esconder magia feérica dos mortais.", "Gaste Força de Vontade para receber Aliados ou Status temporário igual ao Manto, até cinco pontos.", "Considere Perseverança um ponto maior ao resistir a persuasão.", "Uma vez por sessão, redistribua a Força de Vontade restante do grupo entre os membros dispostos.",
  ]),
  court("autumn-lag", "Autumn Lag", "Lag do Outono", "Unnecessarily risky success", "Sucesso desnecessariamente arriscado", 284, [
    "Apply Mantle as a bonus to research a past event relevant to the present.", "Apply Mantle as a bonus to convince someone to reveal reluctant true feelings.", "Once per session, reroll Initiative and keep either result.", "Once per scene, regain Willpower after suffering a dramatic failure.", "While wounded, increase your wound penalty by one to grant another character an Initiative bonus equal to Mantle.",
  ], [
    "Some o Manto ao pesquisar um evento passado relevante para o presente.", "Some o Manto ao convencer alguém a revelar sentimentos verdadeiros que reluta em compartilhar.", "Uma vez por sessão, refaça a Iniciativa e escolha um dos resultados.", "Uma vez por cena, recupere Força de Vontade após sofrer uma falha dramática.", "Enquanto ferido, aumente sua penalidade de ferimento em um para conceder a outro personagem Iniciativa igual ao Manto.",
  ]),
  court("winter-lag", "Winter Lag", "Lag do Inverno", "Decisive victory in a significant fight", "Vitória decisiva em uma luta importante", 284, [
    "Apply Mantle as a bonus to navigate the Hedge.", "Apply Mantle as a bonus to survive extreme environments or deprivation, and reduce their penalties by one.", "Your physical attacks deal 1L when you start a one-on-one fight.", "Treat Composure as one higher when resisting attempts to change your emotional state.", "Never suffer the Beaten Down Tilt.",
  ], [
    "Some o Manto ao navegar pela Sebe.", "Some o Manto ao sobreviver a ambientes extremos ou privações e reduza suas penalidades em um.", "Seus ataques físicos causam 1L quando você inicia uma luta individual.", "Considere Compostura um ponto maior ao resistir a tentativas de alterar seu estado emocional.", "Nunca sofra a Inclinação Derrotado.",
  ]),
  court("high-tide", "Court of High Tide", "Corte da Maré Alta", "Opening the last Door", "Abrir a última Porta", 287, [
    "Apply Mantle as a bonus to inflict Tilts.", "Apply Mantle as a bonus to undermine someone's authority or standing.", "Once per session, reroll a Power Attribute roll and keep either result.", "Automatically break through mundane barriers and impediments.", "Enemies with lower Wyrd suffer Mantle as a penalty to hit you.",
  ], [
    "Some o Manto ao impor Inclinações.", "Some o Manto ao minar a autoridade ou reputação de alguém.", "Uma vez por sessão, refaça um teste de Atributo de Poder e escolha um dos resultados.", "Rompa automaticamente barreiras e impedimentos mundanos.", "Inimigos com Fado menor sofrem o Manto como penalidade para acertá-lo.",
  ]),
  court("ebb-tide", "Court of Ebb Tide", "Corte da Maré Vazante", "Talking someone down from a fight", "Dissuadir alguém de lutar", 287, [
    "Apply Mantle as a bonus to persuade through shared past experiences.", "Apply Mantle as a bonus to defuse a tense group situation.", "Once per session, reroll a negotiation involving a deal or pledge and keep either result.", "Treat Composure as one higher when resisting attempts to enrage you.", "Enemies suffer a penalty to Initiative equal to Mantle.",
  ], [
    "Some o Manto ao persuadir com experiências passadas compartilhadas.", "Some o Manto ao apaziguar uma situação tensa em grupo.", "Uma vez por sessão, refaça uma negociação de acordo ou juramento e escolha um dos resultados.", "Considere Compostura um ponto maior ao resistir a tentativas de enfurecê-lo.", "Inimigos sofrem penalidade de Iniciativa igual ao Manto.",
  ]),
  court("low-tide", "Court of Low Tide", "Corte da Maré Baixa", "Using secrets to foil a plan", "Usar segredos para frustrar um plano", 287, [
    "Apply Mantle as a bonus to investigate someone's dirty secrets.", "Apply Mantle as a bonus to blackmail with information you uncovered.", "Regain Willpower when profiting as an intermediary.", "Clues you find during an investigation contain one additional element.", "Leveraged requires two fulfilled demands to resolve when you inflict it.",
  ], [
    "Some o Manto ao investigar os segredos comprometores de alguém.", "Some o Manto ao chantagear com informações que descobriu.", "Recupere Força de Vontade ao lucrar como intermediário.", "Pistas que você encontra em uma investigação contêm um elemento adicional.", "Alavancado exige duas demandas cumpridas para ser resolvido quando você o impõe.",
  ]),
  court("flood-tide", "Court of Flood Tide", "Corte da Maré Enchente", "A flawless plan", "Um plano executado sem falhas", 288, [
    "Apply Mantle as a bonus to find a safehouse or shelter.", "Apply Mantle as a bonus to make new friends in a new place.", "Once per session, spend Willpower to gain temporary Etiquette dots equal to Mantle, to a maximum of five.", "Once per session, reroll a Finesse Attribute roll and keep either result.", "Once per session, spend Willpower instead of Glamour to open a portal.",
  ], [
    "Some o Manto ao encontrar um esconderijo ou abrigo.", "Some o Manto ao fazer novos amigos em um lugar novo.", "Uma vez por sessão, gaste Força de Vontade para receber Etiqueta temporária igual ao Manto, até cinco pontos.", "Uma vez por sessão, refaça um teste de Atributo de Refinamento e escolha um dos resultados.", "Uma vez por sessão, gaste Força de Vontade em vez de Glamour para abrir um portal.",
  ]),
  court("coins", "Court of Coins", "Corte das Moedas", "Obtaining something owed", "Obter algo devido", 291, [
    "Apply Mantle as a bonus to persuade someone to swear an oath.", "Apply Mantle as a bonus to determine whether you are being cheated.", "Once per session, spend Willpower to gain temporary Resources dots equal to Mantle, to a maximum of five.", "Once per story, reduce Goblin Debt by Mantle.", "Once per scene, spend Willpower to learn a present character's heart's desire.",
  ], [
    "Some o Manto ao persuadir alguém a prestar um juramento.", "Some o Manto ao descobrir se está sendo enganado.", "Uma vez por sessão, gaste Força de Vontade para receber Recursos temporários iguais ao Manto, até cinco pontos.", "Uma vez por história, reduza a Dívida Goblin pelo Manto.", "Uma vez por cena, gaste Força de Vontade para descobrir o desejo íntimo de um personagem presente.",
  ]),
  court("barter", "Court of Barter", "Corte do Escambo", "Interceding in an unfair deal", "Interceder em um acordo injusto", 291, [
    "Apply Mantle as a bonus to read someone's situation from their behavior.", "Apply Mantle as a bonus to make deals in Tumbledown.", "Regain Willpower when you resolve Oathbreaker or help someone else resolve it.", "Once per session, replace a Condition imposed by Goblin Debt with another of the same type.", "Once per session, ask whether a deal contains a loophole or catch that disadvantages you.",
  ], [
    "Some o Manto ao interpretar a situação de alguém por seu comportamento.", "Some o Manto ao fechar acordos em Tumbledown.", "Recupere Força de Vontade ao resolver Quebrador de Juramento ou ajudar alguém a resolvê-la.", "Uma vez por sessão, substitua uma Condição imposta pela Dívida Goblin por outra do mesmo tipo.", "Uma vez por sessão, pergunte se um acordo contém uma brecha ou armadilha desvantajosa para você.",
  ]),
  court("favors", "Court of Favors", "Corte dos Favores", "Fulfilling a significant promise", "Cumprir uma promessa importante", 292, [
    "Apply Mantle as a bonus to convince someone to make a bargain.", "Gain the Fixer Merit.", "Those who swindle or lie about a deal or promise suffer a penalty equal to Mantle.", "Once per session, take one Goblin Debt to transfer an obligation from a bargain to another character.", "Once per session, reroll an action that repays a favor you owe and keep either result.",
  ], [
    "Some o Manto ao convencer alguém a fazer uma barganha.", "Receba o Mérito Faz-Tudo.", "Quem tentar trapacear ou mentir sobre um acordo ou promessa sofre penalidade igual ao Manto.", "Uma vez por sessão, receba um ponto de Dívida Goblin para transferir a outro personagem uma obrigação de uma barganha.", "Uma vez por sessão, refaça uma ação que quite um favor devido e escolha um dos resultados.",
  ]),
  court("shady-deals", "Court of Shady Deals", "Corte dos Negócios Escusos", "Hiding evidence of a dirty deed", "Ocultar provas de um trabalho sujo", 292, [
    "Apply Mantle as a bonus to pick a lock or break into a forbidden place.", "Apply Mantle as a bonus to escape a bad situation unnoticed.", "Use Goblin Contracts without taking Goblin Debt a number of times equal to Mantle.", "Spend Willpower to ignore Oathbreaker for one turn.", "Once per session, reroll a surprise attack and keep either result.",
  ], [
    "Some o Manto ao arrombar uma fechadura ou invadir um lugar proibido.", "Some o Manto ao escapar despercebido de uma situação ruim.", "Use Contratos Goblin sem receber Dívida Goblin um número de vezes igual ao Manto.", "Gaste Força de Vontade para ignorar Quebrador de Juramento por um turno.", "Uma vez por sessão, refaça um ataque surpresa e escolha um dos resultados.",
  ]),
  court("dream-builders", "Dream Builders", "Construtores de Sonhos", "Wonder and creation", "Maravilha e criação", 81, [
    "Apply Mantle as a bonus to mundane rolls to measure something.", "Apply Mantle as a bonus to mundane coercion and encouragement.", "Gain Mantle as bonus dice when navigating the shortest trod to a named Gate of Ivory or Dreaming Road.", "Gain one automatic success when dreamweaving.", "Spend Glamour to inflict Beaten Down or suppress a Mental Condition for a scene.",
  ], [
    "Some o Manto aos testes mundanos para medir algo.", "Some o Manto às tentativas mundanas de coerção ou encorajamento.", "Some o Manto ao navegar pela trilha mais curta até um Portal de Marfim ou Caminho dos Sonhos nomeado.", "Receba um sucesso automático ao tecer sonhos.", "Gaste Glamour para impor Derrotado ou suprimir uma Condição Mental por uma cena.",
  ], "ctl-dark-eras"),
  court("leafless-tree", "Court of the Leafless Tree", "Corte da Árvore Desfolhada", "Punishing someone genuinely believed guilty", "Punir alguém que acredita ser culpado", 238, [
    "Apply Mantle as a bonus to Initiative in one-on-one duels.", "Apply Mantle as a bonus to mundane rolls to track someone down.", "Apply Mantle as a bonus to Speed while you are the pursuer in a chase.", "When the Marshal, a motleymate, or an innocent takes damage, gain 8-again on physical attacks against the responsible enemy for the scene.", "Once per scene, spend Willpower to gain the rote quality on a roll that advances or resolves an Aspiration to deliver a punishment you believe is deserved.",
  ], [
    "Some o Manto à Iniciativa em duelos individuais.", "Some o Manto aos testes mundanos para rastrear alguém.", "Some o Manto ao Deslocamento enquanto for o perseguidor em uma caçada.", "Quando o Marechal, um companheiro de grupo ou um inocente sofrer dano, receba 8-novamente nos ataques físicos contra o inimigo responsável pelo restante da cena.", "Uma vez por cena, gaste Força de Vontade para receber a qualidade de rotina em um teste que avance ou resolva uma Aspiração de aplicar uma punição que você julga merecida.",
  ], "ctl-dark-eras"),
];

export function courtPresentation(value: unknown, locale: Locale = "pt-BR") {
  const raw = String(value ?? "");
  const normalized = raw.toLocaleLowerCase();
  const definition = CTL_COURT_DEFINITIONS.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")].some((candidate) => candidate.toLocaleLowerCase() === normalized),
  );
  if (!definition) return undefined;
  return {
    ...definition,
    name: locale === "en-US" ? definition.name : definition.translatedName,
    emotion: locale === "en-US" ? definition.emotion : definition.emotionPt,
    mantleBenefits: locale === "en-US" ? definition.mantleBenefits : definition.mantleBenefitsPt,
  };
}

export function courtDisplayName(value: unknown, locale: Locale = "pt-BR") {
  const raw=String(value ?? "");
  if (["sem corte","courtless"].includes(raw.trim().toLocaleLowerCase()))
    return locale === "en-US" ? "Courtless" : "Sem Corte";
  return courtPresentation(value, locale)?.name ?? raw;
}

export function courtCanonicalId(value: unknown) {
  return courtPresentation(value, "en-US")?.id ?? String(value ?? "").trim();
}
