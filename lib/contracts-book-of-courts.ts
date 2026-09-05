import type { ContractDefinition } from "./contracts";

const source = { categoryKind: "Corte" as const, sourceId: "h-courts", source: "Book of Courts" };
const circadian = { ...source, regalia: "Circadian", courtFamily: "circadian" };

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
];
