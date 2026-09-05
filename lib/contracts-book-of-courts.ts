import type { ContractDefinition } from "./contracts";

const source = { categoryKind: "Corte" as const, sourceId: "h-courts", source: "Book of Courts" };
const circadian = { ...source, regalia: "Circadian", courtFamily: "circadian", courtIds: ["sun", "moon"] };
const undercourt = { ...source, regalia: "Undercourt", courtFamily: "undercourt", courtIds: ["undercourt"] };

export const BOOK_OF_COURTS_CONTRACTS: ContractDefinition[] = [
  {
    ...circadian, id: "h-courts:circadian:frost-fire-glance", name: "Frost-Fire Glance", originalName: "Frost-Fire Glance", type: "Comum", page: 103,
    summary: "Make a small visible object dangerously hot or cold.", description: "Make a small visible object dangerously hot or cold.", hasRoll: false, dicePool: "None", cost: "●/●●", action: "Instant", duration: "Mantle turns",
    effect: "Choose a visible object of Size 3 or less. Anyone holding it must succeed at Resolve + Stamina or drop it; retaining it inflicts 1 bashing damage each turn. Spending 2 Glamour makes this lethal damage instead.",
    courtClauses: {
      sun: "The object catches fire and thereafter burns and suffers damage normally until extinguished.",
      moon: "The object becomes tempting to touch; the Storyteller may offer Willpower to a character willing to grasp it, including someone who dropped it and tries again.",
    }, loophole: "The object belongs to the changeling.",
  },
  {
    ...circadian, id: "h-courts:circadian:horizon-step", name: "Horizon Step", originalName: "Horizon Step", type: "Comum", page: 103,
    summary: "Create a simple bridge or ladder from sunlight or moonlight.", description: "Create a simple bridge or ladder from sunlight or moonlight.", hasRoll: false, dicePool: "None", cost: "●", action: "Instant", duration: "One scene",
    effect: "Draw a simple bridge or ladder into existence where the changeling stands. It may be up to Mantle × 2 meters long, is only centimeters thick and nearly weightless, yet supports any person and resists mundane destruction.",
    courtClauses: { sun: "Add a safety feature such as railings or platform steps.", moon: "Spend 1 additional Glamour to make the structure invisible." }, loophole: "The changeling is wearing suspenders.",
  },
  {
    ...circadian, id: "h-courts:circadian:secrets-and-lies", name: "Secrets and Lies", originalName: "Secrets and Lies", type: "Comum", page: 103,
    summary: "Discover a secret or deception guarded by the target.", description: "Discover a secret or deception guarded by the target.", hasRoll: true, dicePool: "Wits + Investigation + Mantle vs. Resolve + Wyrd", cost: "●", action: "Contested", duration: "Instant",
    success: "Learn the secret or deception foremost in the target's mind. To seek a specific secret, maneuver the target into thinking about it.", exceptionalSuccess: "Narrow the desired secret to a category, such as political or romantic.", failure: "The Contract fails.", dramaticFailure: "The target realizes that someone tried to delve into their mind.",
    courtClauses: { sun: "Learn the identity of one additional person involved.", moon: "Spend 1 additional Glamour to witness up to one turn of circumstances surrounding the secret or deception from the target's perspective." }, loophole: "The changeling committed a crime within the last 24 hours.",
  },
  {
    ...circadian, id: "h-courts:circadian:shimmering-mirage", name: "Shimmering Mirage", originalName: "Shimmering Mirage", type: "Comum", page: 104,
    summary: "Surround someone with dazzling light or a moonlit echo that makes attacks difficult.", description: "Surround someone with dazzling light or a moonlit echo that makes attacks difficult.", hasRoll: false, dicePool: "None", cost: "●", action: "Instant", duration: "Mantle turns",
    effect: "Choose the changeling or another character in the scene. Attacks against the subject begin with a penalty equal to Mantle, reduced by one each turn until it vanishes. The Contract cannot end early or be invoked again before its full duration passes.",
    courtClauses: { sun: "A successful attacker must succeed at Resolve + Composure or suffer Blinded.", moon: "A successful attacker must succeed at Resolve + Composure or gain Confused." }, loophole: "The changeling looks directly at the sun or moon while invoking the Contract.",
  },
  {
    ...circadian, id: "h-courts:circadian:twin-beacons", name: "Twin Beacons", originalName: "Twin Beacons", type: "Comum", page: 104,
    summary: "Illuminate the way ahead while obscuring the trail behind.", description: "Illuminate the way ahead while obscuring the trail behind.", hasRoll: false, dicePool: "None", cost: "●", action: "Instant", duration: "One scene",
    effect: "Add Mantle to Investigation and perception rolls while exploring or traveling. Trackers pursuing the changeling subtract Mantle.",
    courtClauses: { sun: "The changeling cannot be surprised.", moon: "The changeling automatically knows whether anyone is pursuing him and how many pursuers there are." }, loophole: "The changeling carries a lantern.",
  },
  {
    ...circadian, id: "h-courts:circadian:celestial-summons", name: "Celestial Summons", originalName: "Celestial Summons", type: "Real", page: 104,
    summary: "Compel a target in the same freehold or city to make their way to the changeling.", description: "Compel a target in the same freehold or city to make their way to the changeling.", hasRoll: true, dicePool: "Presence + Persuasion + Wyrd vs. Composure + Wyrd", cost: "●●", action: "Instant", duration: "Until the end of the chapter or the target arrives",
    success: "The target knows the changeling wants her presence and travels to him as soon as reasonably possible, without risking serious harm. She must be in the same freehold or city and have some feasible means of reaching him.", exceptionalSuccess: "The Contract works beyond the freehold, including in the Hedge. The changeling may delay its onset until she relocates before the next sunrise or sunset.", failure: "The Contract fails.", dramaticFailure: "The target learns of the failed attempt.",
    courtClauses: { sun: "If the summoned target is an ally, she regains 1 Willpower.", moon: "Obscure the changeling's identity, so the target knows only that she must reach a particular place." }, loophole: "The changeling has some form of authority over the target.",
  },
  {
    ...circadian, id: "h-courts:circadian:climate-change", name: "Climate Change", originalName: "Climate Change", type: "Real", page: 105,
    summary: "Bring extreme heat or cold to a wide surrounding area.", description: "Bring extreme heat or cold to a wide surrounding area.", hasRoll: true, dicePool: "Resolve + Survival + Mantle", cost: "●●○", action: "Instant", duration: "One scene",
    success: "Inflict Extreme Heat for Sun or Extreme Cold for Moon over an area up to two kilometers around the changeling. The changeling is immune to this Tilt.", exceptionalSuccess: "Double the maximum affected area.", failure: "The Contract fails.", dramaticFailure: "The changeling cannot use Contracts for the rest of the scene.",
    courtClauses: { sun: "Inflict Sick from sunstroke on one person caught in the Tilt.", moon: "Create an intense snowstorm and inflict Lost on one person caught in the Tilt." }, loophole: "The real environmental condition affected the area within the last month.",
  },
  {
    ...circadian, id: "h-courts:circadian:celestial-might", name: "Celestial Might", originalName: "Celestial Might", type: "Real", page: 105,
    summary: "Channel sunlight or moonlight into a weapon so it can inflict aggravated damage.", description: "Channel sunlight or moonlight into a weapon so it can inflict aggravated damage.", hasRoll: true, dicePool: "Dexterity + Occult + Mantle", cost: "●○", action: "Instant", duration: "Mantle turns",
    success: "Outdoors at the Court's appropriate time, make a weapon's damage bonus aggravated (minimum one); rolled successes still inflict its normal damage type.", exceptionalSuccess: "Invocation is reflexive instead.", failure: "The Contract fails.", dramaticFailure: "The weapon reflects the light and inflicts 1 aggravated damage on the changeling.",
    courtClauses: { sun: "Add two dice to perception rolls for the rest of the scene.", moon: "Dim the area within ten meters and add two dice to Stealth rolls for the rest of the scene." }, loophole: "The weapon bears a permanent image of the appropriate sun or moon.",
  },
  {
    ...circadian, id: "h-courts:circadian:celestial-shield", name: "Celestial Shield", originalName: "Celestial Shield", type: "Real", page: 105,
    summary: "Shape sunlight or moonlight into a handheld shield or immobile barricade.", description: "Shape sunlight or moonlight into a handheld shield or immobile barricade.", hasRoll: false, dicePool: "None", cost: "●●", action: "Instant", duration: "One scene",
    effect: "Create a handheld shield or a Size 6 barricade sheltering up to three people. The shield reduces all damage except cold iron by two. The barricade provides Substantial Concealment, Tough Cover, Durability equal to Mantle, and the same damage reduction.",
    courtClauses: { sun: "The handheld shield imposes no Initiative penalty.", moon: "The barricade may become opaque and conceal those behind it." }, loophole: "The changeling uses the shield to protect another person under her care or authority.",
  },
  {
    ...circadian, id: "h-courts:circadian:vigil-of-silver-and-gold", name: "Vigil of Silver and Gold", originalName: "Vigil of Silver and Gold", type: "Real", page: 105,
    summary: "Ward an owned or responsible area and sense everyone crossing its boundary.", description: "Ward an owned or responsible area and sense everyone crossing its boundary.", hasRoll: false, dicePool: "None", cost: "●●", action: "Instant", duration: "Until the next sunset or sunrise",
    effect: "Trace a sun or moon in four corners of an area up to 300 square meters. Sense everyone who enters or leaves, recognizing acquaintances and receiving a broad description of strangers or supernatural beings. Supernatural concealment triggers a Clash of Wills.",
    courtClauses: { sun: "Add Mantle to Socialize rolls involving anyone detected by the Contract.", moon: "Add Mantle to Investigation rolls involving anyone detected by the Contract." }, loophole: "The changeling owns land or a building within the protected area.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:goodnight-moon", name:"Goodnight Moon", originalName:"Goodnight Moon", type:"Comum", page:106,
    summary:"Tell a beloved childhood story to grant a companion restorative sleep.", description:"Tell a beloved childhood story to grant a companion restorative sleep.", hasRoll:true, dicePool:"Presence + Expression + Wyrd", cost:"●●", action:"Instant", duration:"Instant",
    success:"Grant another character peaceful sleep. While sleeping, the target halves healing time for current physical damage; a changeling also heals one severe Clarity damage or all mild Clarity damage.", exceptionalSuccess:"The target also heals Conditions associated with Clarity loss.", failure:"The Contract fails.", dramaticFailure:"The sleep provides no benefit and the target wakes with one additional mild Clarity damage.", loophole:"Both changeling and target are wearing pajamas.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:pep-talk", name:"Pep Talk", originalName:"Pep Talk", type:"Comum", page:106,
    summary:"Encourage someone to bring their best to a chosen Skill.", description:"Encourage someone to bring their best to a chosen Skill.", hasRoll:false, dicePool:"None", cost:"●", action:"Instant", duration:"Instant", effect:"After a brief encouraging conversation, the target gains Inspired regarding a Skill they choose.", loophole:"The changeling has no dots in that Skill.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:nothing-to-see-here", name:"Nothing to See Here", originalName:"Nothing to See Here", type:"Comum", page:106,
    summary:"Reduce the emotional impact of a recent traumatic or supernatural event and support recovery.", description:"Reduce the emotional impact of a recent traumatic or supernatural event and support recovery.", hasRoll:true, dicePool:"Manipulation + Empathy + Wyrd vs. Composure + Wyrd", cost:"●", action:"Contested", duration:"Instant",
    success:"Discuss an event from the last day. The target retains the memory but its emotional impact diminishes and their mind supplies a mundane explanation if needed. Add Mantle to later actions involving its trauma, including breaking points and insomnia.", exceptionalSuccess:"Clear Conditions caused by the event.", failure:"The Contract fails.", dramaticFailure:"The target remembers the conversation negatively, as though the changeling denied the experience.", loophole:"The changeling experienced the event with the target.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:rooted-in-the-past", name:"Rooted in the Past", originalName:"Rooted in the Past", type:"Comum", page:106,
    summary:"Use nostalgia to ward the changeling's emotions against influence.", description:"Use nostalgia to ward the changeling's emotions against influence.", hasRoll:false, dicePool:"None", cost:"●●", action:"Reflexive", duration:"One scene",
    effect:"Focus on a beloved person or event to become immune to emotional Conditions, including suppressing a known current Condition. Supernatural emotional influence suffers a penalty equal to Undercourt Mantle.", loophole:"The changeling eats a favorite childhood food.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:safeguarded-supplies", name:"Safeguarded Supplies", originalName:"Safeguarded Supplies", type:"Comum", page:107,
    summary:"Protect a complex item so it continues functioning in the Hedge.", description:"Protect a complex item so it continues functioning in the Hedge.", hasRoll:true, dicePool:"Intelligence + Crafts + Mantle", cost:"●", action:"Instant", duration:"One chapter",
    success:"A chosen complex item functions normally in the Hedge, although unavailable infrastructure such as the Internet remains unavailable.", exceptionalSuccess:"Grant the item either +1 Equipment or +1 Durability.", failure:"The Contract fails.", dramaticFailure:"The item appears functional but malfunctions at an inopportune moment.", loophole:"The changeling slept with the item under their pillow the previous night.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:family-friendly-feud", name:"Family-Friendly Feud", originalName:"Family-Friendly Feud", type:"Real", page:107,
    summary:"Make violence in the vicinity less lethal.", description:"Make violence in the vicinity less lethal.", hasRoll:false, dicePool:"None", cost:"●●", action:"Instant", duration:"One scene",
    effect:"Downgrade all violent damage nearby one step: aggravated becomes lethal, lethal becomes bashing, and bashing is halved, rounded up. This affects everyone present, including the changeling.", loophole:"The changeling has used no curse words within the last day.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:frozen-in-time", name:"Frozen in Time", originalName:"Frozen in Time", type:"Real", page:107,
    summary:"Trap a listening target in a spoken memory loop.", description:"Trap a listening target in a spoken memory loop.", hasRoll:true, dicePool:"Manipulation + Occult + Mantle vs. Resolve + Wyrd", cost:"●●", action:"Contested", duration:"Wyrd turns",
    success:"The target fixates on a spoken phrase and suffers Stunned. The target must hear the words but need not understand them; suffering lethal damage ends the effect early.", exceptionalSuccess:"The target also gains Shaken.", failure:"The Contract fails.", dramaticFailure:"The changeling suffers Stunned for one turn.", loophole:"An analog clock is visible nearby.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:hearths-respite", name:"Hearth's Respite", originalName:"Hearth's Respite", type:"Real", page:107,
    summary:"Turn the changeling's home or establishment into a sanctuary of calm and recovery.", description:"Turn the changeling's home or establishment into a sanctuary of calm and recovery.", hasRoll:true, dicePool:"Composure + Empathy + Mantle", cost:"●○", action:"Instant", duration:"One week",
    success:"After cleaning or redecorating an owned or inhabited place, welcomed changelings heal one mild Clarity damage per hour inside. Anyone who eats or drinks there gains either -2 to their next Clarity attack or +2 to their first Integrity breaking point during the next week. Aggressive or violent rolls inside lose 10-again.", exceptionalSuccess:"A character who heals Clarity also heals their oldest Clarity Condition.", failure:"The Contract fails.", dramaticFailure:"The Contract cannot be attempted again for one week.", loophole:"A visible picture of the changeling's mortal family hangs nearby.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:protection-of-the-innocent", name:"Protection of the Innocent", originalName:"Protection of the Innocent", type:"Real", page:108,
    summary:"Place a mortal under strong protection against supernatural harm.", description:"Place a mortal under strong protection against supernatural harm.", hasRoll:true, dicePool:"Resolve + Medicine + Mantle", cost:"●●●○", action:"Instant", duration:"One lunar month",
    success:"Supernatural powers targeting the mortal subtract Mantle from activation; powers without rolls fail. The mortal gains general armor equal to Mantle against supernatural damage, and mundane attacks by supernatural beings lose 10-again.", exceptionalSuccess:"The mortal also gains 1 general armor against mundane harm.", failure:"The Contract fails.", dramaticFailure:"The changeling gains Obsession concerning the mortal's safety.", loophole:"The Contract has never before been used on this mortal.",
  },
  {
    ...undercourt, id:"h-courts:undercourt:shared-remembrance", name:"Shared Remembrance", originalName:"Shared Remembrance", type:"Real", page:108,
    summary:"Experience one of the target's memories through their senses.", description:"Experience one of the target's memories through their senses.", hasRoll:true, dicePool:"Wits + Empathy + Mantle vs. Resolve + Wyrd", cost:"●●", action:"Contested", duration:"Up to one hour or the memory's length",
    success:"View a known memory identified by time, date, or content, or the target's most recent emotionally intense memory. Gain 8-again on Empathy rolls involving the target for the rest of the chapter.", exceptionalSuccess:"View up to three hours of memory.", failure:"The Contract fails.", dramaticFailure:"Flashes of memory intrude on reality, imposing -2 on perception rolls for the scene.", loophole:"The changeling tells the target one of his own important memories.",
  },
];
