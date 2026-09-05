import type { ContractDefinition } from "./contracts";

const base = {
  categoryKind: "Regalia" as const,
  regalia: "Chalice",
  sourceId: "ctl-kith-and-kin",
  source: "Kith and Kin",
};

export const KITH_AND_KIN_CONTRACTS: ContractDefinition[] = [
  {
    ...base, id:"ctl-kith-and-kin:filling-the-cup", name:"Filling the Cup", originalName:"Filling the Cup", type:"Comum", page:34,
    description:"The changeling identifies people experiencing powerful emotions within Wyrd x 40 yards or meters, learning their direction, general distance, and whether each emotion is positive or negative. He also automatically notices Bedlam incited within range.",
    hasRoll:false, dicePool:"None", cost:"●", action:"Instant", duration:"One scene or until the changeling regains Glamour, whichever comes first",
    loophole:"The changeling publicly states his strongest current emotion and its cause or subject when invoking the Contract.",
    seemingBenefits:{
      Beast:"After previously identifying a known person's emotions with this or another relevant power, the Beast can recognize that person again at range by the scent of their feelings.",
      Fairest:"The Fairest can distinguish people in range experiencing an intense emotion related to him, though he learns the emotion rather than the person's identity.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:frail-as-the-dying-word", name:"Frail as the Dying Word", originalName:"Frail as the Dying Word", type:"Comum", page:35,
    description:"By touching the target, the changeling tricks the Wyrd into applying one of his own frailties to them.",
    hasRoll:true, dicePool:"Manipulation + Occult + Wyrd vs. Composure + Tolerance", cost:"●", action:"Contested", duration:"One scene",
    success:"The target gains one of the changeling's minor frailties. If already possessed, it becomes major for the duration; a target already suffering its major version is unaffected. The changeling retains the frailty.",
    exceptionalSuccess:"The changeling may instead inflict one major frailty or two minor frailties. Iron counts as major.", failure:"The Contract fails.",
    dramaticFailure:"The Wyrd inflicts a new major frailty on the changeling for the scene.",
    loophole:"The changeling has suffered from the chosen frailty during the same scene.",
    seemingBenefits:{
      Fairest:"The Fairest may inflict a frailty belonging to any fae being present rather than one of his own.",
      Darkling:"For +●, the Darkling transfers the frailty instead of sharing it, losing it for the duration. This cannot transfer his iron bane.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:sleeps-sweet-embrace", name:"Sleep's Sweet Embrace", originalName:"Sleep's Sweet Embrace", type:"Comum", page:35,
    description:"The changeling touches the target and replaces their dreams with restorative, dreamless sleep. The invocation is resisted only if the target is unwilling.",
    hasRoll:true, dicePool:"Manipulation + Expression + Wyrd - Resolve", cost:"●●○", action:"Instant or resisted", duration:"A number of days equal to successes",
    success:"Whenever the target sleeps during the duration, they heal 1 lethal damage per hour but regain no Willpower from rest. They have no Bastion and cannot be affected by oneiromancy or dream magic. More than two days causes Dissociation until they regain full Willpower after the Contract ends.",
    exceptionalSuccess:"The target suffers Dissociation only if the effect lasts more than three days.", failure:"The Contract fails.",
    dramaticFailure:"The next time the changeling sleeps, he cannot meditate, enter the Gate of Ivory, or dream. He suffers the Contract's drawbacks for one night without its healing.",
    loophole:"During the same scene, the changeling persuades or forces the target to completely consume a prepared drink used as a sleep aid.",
    seemingBenefits:{
      Beast:"The Beast adds two days to the Contract's duration.",
      Darkling:"While asleep, the Darkling's target appears recently dead to mundane examination; supernatural detection prompts a Clash of Wills.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:curses-cure", name:"Curse's Cure", originalName:"Curse's Cure", type:"Comum", page:36,
    description:"The changeling mixes the target's blood, Hedge herbs, his spit, and wine into one full dose of antidote for a single poisoned victim.",
    hasRoll:true, dicePool:"Intelligence + Medicine + Wyrd", cost:"●", action:"Instant", duration:"Instant",
    success:"Drinking the full dose halves a poison's recovery time or makes a lethal poison survivable. Related Conditions fade without resolution. Supernatural poison requires a Clash of Wills.",
    exceptionalSuccess:"The poison is completely and immediately cured.", failure:"The Contract fails.",
    dramaticFailure:"The changeling poisons himself, gaining Fatigued, which becomes the moderate Poisoned Tilt in action scenes.",
    loophole:"The changeling tastes the same toxin during the scene; the Contract does not protect him from that exposure.",
    seemingBenefits:{
      Beast:"During the chapter, the Beast may bite a grappled opponent as a unique grapple action to inflict moderate Poisoned.",
      Wizened:"The Wizened may instead reduce a disease's severity or end a drug's effects; related Conditions fade without resolution.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:dreamers-phalanx", name:"Dreamer's Phalanx", originalName:"Dreamer's Phalanx", type:"Comum", page:36,
    description:"Willing sleepers in physical contact enter a shared dream whose distinct Bastions count as one for oneiromancy. Each gains +1 Fortification per participant, maximum +5, against outsiders; teamwork within the linked Bastions gains 8-again, and location shifts may move subjects between Bastions. Forced magical awakening destroys every linked Bastion.",
    hasRoll:false, dicePool:"None", cost:"● + ●/subject beyond 2nd", action:"Instant", duration:"One chapter or until all participants wake",
    loophole:"All participants belong to the same sworn oath, including one sworn for this purpose during the same scene.",
    seemingBenefits:{
      Beast:"All participants gain +2 to actions contested by an outside oneiropomp intruding on any linked Bastion.",
      Wizened:"Teamwork between participants also achieves exceptional success on three successes.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:closing-deaths-door", name:"Closing Death's Door", originalName:"Closing Death's Door", type:"Real", page:36,
    description:"With an intimate gesture, the changeling attempts to return a recently dead character to life.",
    hasRoll:true, dicePool:"Manipulation + Empathy + Wyrd", cost:"●●●○", action:"Instant", duration:"Instant",
    success:"A character dead for no more than one chapter returns with every Health box filled with aggravated damage except the undamaged rightmost box. The changeling gains Goblin Debt equal to hours dead, minimum 1 and subject to the usual maximum.",
    exceptionalSuccess:"The Contract can revive someone who died at any point in the current story; otherwise a target dead longer than one chapter cannot be revived.", failure:"The Contract fails.",
    dramaticFailure:"The corpse becomes a mindless marionette with one Health box, no Willpower, and all dice pools equal to the changeling's Wyrd.",
    loophole:"The deceased is the changeling's Touchstone, a fae-touched promised to him, or someone bound to him by a personal oath.",
    seemingBenefits:{
      Fairest:"The revived character gains Swooned regarding the Fairest.",
      Darkling:"The Darkling briefly experiences the deceased's final moments from their point of view.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:feast-of-plenty", name:"Feast of Plenty", originalName:"Feast of Plenty", type:"Real", page:37,
    description:"The changeling publicly offers freely given food, drink, medicine, or similar comforts to everyone present.",
    hasRoll:true, dicePool:"Presence + Socialize + Wyrd", cost:"●●", action:"Instant", duration:"Instant",
    success:"The Contract creates enough suitable nourishment or medicine for everyone present. A willing participant removes one physical non-Persistent Condition or one physical Personal Tilt and regains Willpower equal to half the successes, rounded up, but gains Indebted to the changeling. The changeling cannot benefit from his own feast.",
    exceptionalSuccess:"Indebted becomes Persistent.", failure:"The Contract fails.", dramaticFailure:"The changeling gains Notoriety.",
    loophole:"During the scene, the changeling greets everyone present by name with a gesture, learning and using any unknown names before invocation.",
    seemingBenefits:{
      Elemental:"Everyone perceiving the feast contests with Composure + Wyrd or is compelled to partake.",
      Ogre:"Participants gain +1 Defense for the rest of the chapter.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:still-waters-run-deep", name:"Still Waters Run Deep", originalName:"Still Waters Run Deep", type:"Real", page:38,
    description:"The target watches the changeling's serene breathing as he suppresses their emotional turmoil and joy.",
    hasRoll:true, dicePool:"Manipulation + Subterfuge + Wyrd - Resolve", cost:"●●", action:"Instant", duration:"One scene",
    success:"Suppress emotional Conditions equal to successes, including Clarity and Bedlam Conditions. Their effects, resolutions, and Beats are suspended, and the target cannot gain new emotional Conditions, Hedgespin, dreamweave, incite Bedlam, or harvest Glamour from living beings during the scene.",
    exceptionalSuccess:"Additional successes only increase the number of suppressed Conditions.", failure:"The Contract fails.",
    dramaticFailure:"The changeling gains either one suppressed detrimental Condition from the target or Demoralized, chosen by the Storyteller, and must resolve it normally.",
    loophole:"During the scene, the changeling writes at least one paragraph about his current emotional state and seals it in a bottle.",
    seemingBenefits:{
      Wizened:"The Wizened may suppress purely mental Conditions as well as emotional ones.",
      Ogre:"The Ogre may resolve one suppressed temporary Condition during the effect and receives its resolution Beat instead of the target.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:poison-the-well", name:"Poison the Well", originalName:"Poison the Well", type:"Real", page:38,
    description:"The changeling poisons the target's relationship with the subject of one Social Merit.",
    hasRoll:true, dicePool:"Manipulation + Expression + Wyrd vs. Resolve + Tolerance", cost:"●", action:"Contested", duration:"One chapter",
    success:"A mundane Social Merit becomes inaccessible and its subject actively hinders the target. In the Hedge, an eligible changeling-specific connection Merit may instead remain usable but inflict Goblin Debt equal to its rating per use; this counts as Hedgespinning without its usual invocation penalty.",
    exceptionalSuccess:"The target also gains Notoriety.", failure:"The Contract fails.",
    dramaticFailure:"The changeling poisons his own most important connections, detaching one Touchstone from his Clarity track for the chapter.",
    loophole:"During the scene, the changeling personally interacts with the Merit's subject to sow conflict or sabotage the resource.",
    seemingBenefits:{
      Fairest:"The Fairest gains access to the poisoned Merit for the Contract's duration.",
      Elemental:"When the Contract ends, the target's Merit returns at one dot per scene rather than immediately.",
    },
  },
  {
    ...base, id:"ctl-kith-and-kin:shared-cup", name:"Shared Cup", originalName:"Shared Cup", type:"Real", page:39,
    description:"The changeling equally shares a drink or meal with a group, creating a supernatural emotional bond among willing or unwitting participants.",
    hasRoll:true, dicePool:"Presence + Occult + Wyrd vs. Composure + Tolerance", cost:"● + ●/subject beyond 2nd", action:"Instant or contested", duration:"One chapter",
    success:"Bind participants up to successes, including the changeling. Their Social impressions improve one step and they suffer -3 to contest each other's Social actions. Emotional Conditions, Personal Tilts, recovered Willpower, and recovered Glamour propagate to the group; non-Wyrd participants gain Inspired instead of Glamour. Hedgespinning and Bedlam achieve exceptional success on three successes.",
    exceptionalSuccess:"Additional successes increase the maximum participants.", failure:"The Contract fails.",
    dramaticFailure:"The changeling involuntarily incites Bedlam in every participant without a roll.",
    loophole:"During the shared meal's scene, the changeling collects blood, hair, nail clippings, or another body part from every participant.",
    seemingBenefits:{
      Darkling:"By paying ● when a shared effect would occur, the Darkling can briefly exclude himself from that effect and all passive effects; others may notice with Wits + Composure contested by his Wits + Wyrd.",
      Fairest:"Every other participant gains Swooned regarding the Fairest upon invocation.",
    },
  },
];
