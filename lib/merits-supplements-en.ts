// English-first records transcribed from approved supplemental PDFs.
// Keep this separate from the offline-index import so book-only additions and
// source-specific amendments remain auditable.
const KITH_AND_KIN_MERITS_EN = [
  {
    id: "ctl-kith-kin:dramaturge",
    name: "Dramaturge",
    ratings: [3],
    line: "CtL",
    sourceId: "ctl-kith-kin",
    source: "Kith and Kin",
    category: "Changeling",
    prerequisites: "Wits •••, Expression •••, Subterfuge •••",
    description: "When the changeling fulfills a Contract's Loophole while holding an object with strong dramaturgy appropriate to that Contract, she may either apply one additional Seeming benefit she does not possess or make the invocation reflexive without paying additional Glamour. An ordinary object supports three Common uses or one Royal use before its connection is exhausted. An Icon grants both benefits at once and is then destroyed. The changeling also gains 9-again on rolls to perform a galoshin.",
    page: 69,
  },
  {
    id: "ctl-kith-kin:understudy",
    name: "Understudy",
    ratings: [3],
    line: "CtL",
    sourceId: "ctl-kith-kin",
    source: "Kith and Kin",
    category: "Changeling",
    prerequisites: "Dramaturge, Expression ••••",
    description: "As an instant action, the changeling dons or brandishes an item dramaturgically representative of another changeling present in the scene, or one whose Icon she possesses. For the scene, whenever either character satisfies a Contract's Loophole, the other does too. When her counterpart invokes a Contract through its Loophole, the dramaturge may copy onto herself any effects that target only the Contract's user. Choosing a new counterpart ends the prior link.",
    page: 69,
  },
] as const;

type SeasonalCourt = "Spring" | "Summer" | "Autumn" | "Winter";
type SupplementalLevel = { rating: number; name: string; description: string };
type CourtAccess = { court: SeasonalCourt; mantle: number; courtGoodwill?: number };

function courtMerit(
  court: SeasonalCourt,
  page: number,
  name: string,
  ratings: number[],
  prerequisites: string | null,
  description: string,
  levels?: SupplementalLevel[],
  accessOverrides?: CourtAccess[],
) {
  const mantleMatch = prerequisites?.match(new RegExp(`${court} Mantle ([•]+)`));
  const mantle = mantleMatch?.[1]?.length ?? 1;
  const courtAccess = accessOverrides ?? [{ court, mantle, ...(mantle<=3?{courtGoodwill:mantle+2}:{}) }];
  const access = courtAccess.flatMap((item)=>[
    `${item.court} Mantle ${"•".repeat(item.mantle)}`,
    ...(item.courtGoodwill?[`${item.court} Court Goodwill ${"•".repeat(item.courtGoodwill)}`]:[]),
  ]).join(" or ");
  return {
    id: `h-courts:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name,
    ratings,
    line: "CtL" as const,
    sourceId: "h-courts",
    source: "Book of Courts",
    category: "Changeling Courts",
    prerequisites: prerequisites ? `${access}; ${prerequisites}` : access,
    description,
    page,
    courtAccess,
    ...(levels ? { levels } : {}),
  };
}

const COURT_MERITS_EN = [
  courtMerit("Spring",63,"Bedside Manner",[3],"Medicine ••","After successfully treating another character's wounds and spending at least a scene on additional care, halve that character's healing time for all current lethal and bashing damage."),
  courtMerit("Spring",63,"Dressed to Kill",[2],"Socialize ••","Once per outfit per chapter, take an instant action to turn part of an outfit the character chose into a Durability 2 improvised weapon.",undefined,[{court:"Spring",mantle:1,courtGoodwill:3},{court:"Summer",mantle:2,courtGoodwill:4}]),
  courtMerit("Spring",63,"Florence Nightingale Effect",[2],"Empathy •••","For one month after caring for someone, double bonuses from Social Merits when interacting with that former patient, and Social actions with them exceptionally succeed on three successes."),
  courtMerit("Spring",63,"Friends in Low Places",[1,2,3],"Barfly","Among a particular group of lowlifes, temporarily distribute Merit dots among Status, Allies, and Contacts. These may stack with existing dots but cannot raise a Merit above five; they last for the chapter."),
  courtMerit("Spring",64,"Spring-Loaded",[1],"Stamina •••","Suffer no negative Tilts from consensual intoxication and gain 9-again on Socialize while intoxicated. Rolls to avoid or resist addiction suffer −1."),
  courtMerit("Spring",64,"Host with the Most",[3],null,"Gain 9-again on actions directly preparing an organized event for at least six people. During the event, apply rote action to three Mental or Social rolls made to keep it running as intended."),
  courtMerit("Spring",64,"Meant to Do That",[1],"Presence •••","Once per scene, reroll a failed Expression, Persuasion, or Socialize action. On success the original task still fails, but observers interpret the mistake favorably."),
  courtMerit("Spring",64,"Look! A Distraction!",[2],"Presence or Manipulation •••","Once per chapter after succeeding on an appropriate Social roll, let allies up to the higher of Presence or Manipulation apply those successes to their own Stealth or Subterfuge rolls. The character suffers −3 Stealth for the scene."),
  courtMerit("Spring",65,"No Rest for the Wicked",[3],"Stamina or Resolve •••","For days equal to the higher of Stamina or Resolve, regain Willpower through physical or mental activity rather than sleep. The next Clarity attack gains dice for nights without sleep, and Clarity damage cannot heal until the character sleeps."),
  courtMerit("Spring",65,"Street Pharmacist",[1],"Medicine or Streetwise ••","Immediately recognize when someone is intoxicated and gain +3 to identify the specific substance."),
  courtMerit("Spring",65,"Sucker Born Every Minute",[1],"Manipulation •••","Gain 9-again on Mental or Social rolls involving hustles, scams, or grifts, whether detecting or conducting them."),
  courtMerit("Spring",65,"A Taste of Honey",[2],null,"Choose a specific form of desire. Successfully harvesting Glamour from humans experiencing it grants two additional Glamour rather than the usual one for the Court's favored emotion."),

  courtMerit("Summer",65,"Beware of Dog",[2],"Retainer •","Gain 9-again on Intimidation while accompanied by a frightening animal Retainer. Once per chapter, use it for +2 Defense for turns equal to Retainer dots; the animal gains no defensive benefit."),
  courtMerit("Summer",65,"Challenge Accepted",[1],null,"The first action each scene taken in direct response to a dare or challenge exceptionally succeeds on three successes."),
  courtMerit("Summer",65,"Don't Mess with Jim",[1],"Intimidation ••","Gain 9-again on Social rolls that leverage the character's violent reputation against someone aware of it, but lose 10-again when trying to make a good impression on such people."),
  courtMerit("Summer",65,"Don't Tell Me to Calm Down",[1],"Composure •• or lower","Once per chapter, declare an intention and immediately act on it. Attempts to dissuade the character suffer −2 for the chapter, including attempts by allies."),
  courtMerit("Summer",66,"Firebrand",[2],"Presence •••","Open the first Door for free when a Social maneuver argues for one of the character's convictions. With an audience of at least ten, the first action also exceptionally succeeds on three successes."),
  courtMerit("Summer",66,"Get the Manager",[1],"Intimidation ••, Summer Mantle ••","Against mortals without authority, gain the equivalent of Status •• in the relevant area when making requests that are not blatantly illegal."),
  courtMerit("Summer",66,"Hey, Watch This",[1],"Presence •••","Gain +2 Athletics before an audience, increased to +3 when the feat is both risky and unnecessary.",undefined,[{court:"Summer",mantle:1,courtGoodwill:3},{court:"Spring",mantle:2,courtGoodwill:4}]),
  courtMerit("Summer",66,"Locked on Target",[1,2,3,4,5],"Resolve •••, Stamina •••, Brawl or Weaponry ••","A combat Style that turns focused anger into persistence against a chosen opponent.",[
    {rating:1,name:"Dialed In",description:"Ignore distraction penalties in action scenes up to Summer Mantle."},
    {rating:2,name:"Now I'm Angry",description:"After first taking damage in an action scene, gain +1 Brawl or Weaponry attacks against the attacker."},
    {rating:3,name:"Eyes on the Prize",description:"Add Merit dots to resist effects that would divert focus from the chosen opponent."},
    {rating:4,name:"You Have Only Made Me Stronger",description:"Against an opponent who previously defeated the character, add Summer Mantle to Initiative and to an All-Out Attack, stacking with its usual +2."},
    {rating:5,name:"Payback Time",description:"After suffering damage, add the same number of dice to the next attack against its source, up to Resolve times per chapter."},
  ]),
  courtMerit("Summer",66,"Quiet Rage",[1],"Composure •••","Once per chapter, substitute Composure for Presence or Strength on an Intimidation action; gain 8-again against people who know the character's quiet reputation. This cannot produce rote action against anyone intimidated this way within the last month."),
  courtMerit("Summer",66,"Rageaholic",[2],"Empathy ••","Choose a particular form of wrath. Successfully harvesting Glamour from humans experiencing it grants two additional Glamour rather than the usual one for the Court's favored emotion."),
  courtMerit("Summer",66,"Seen Some Shit",[2],"Wyrd •• or Composure ••••","Become immune to mundane sources of the Shaken Condition and add half Wyrd, rounded up, to rolls to remain unfazed by horrific or gruesome sights."),

  courtMerit("Autumn",67,"Acquired Taste",[1],"Occult ••","Choose a sapient supernatural kind that experiences emotion. Gain 9-again when harvesting Glamour from those beings. May be purchased separately for different kinds."),
  courtMerit("Autumn",67,"Can't Spook a Spooker",[2],"Autumn Mantle ••","Mundane attempts to intimidate or instill fear suffer a penalty equal to Autumn Mantle."),
  courtMerit("Autumn",67,"Favored Phobia",[2],"Intimidation ••","Choose a specific fear. Successfully harvesting Glamour from humans experiencing it grants two additional Glamour rather than the usual one for the Court's favored emotion."),
  courtMerit("Autumn",67,"Hedgewalker",[3],"Hedge Sense, Wyrd •••","Off the path in the Hedge, suffer one self-inflicted lethal damage and spend Willpower to emerge from a portal somewhere in the character's freehold. Wyrd entities gain a cumulative tracking bonus when it is used repeatedly in one story."),
  courtMerit("Autumn",67,"I Love a Good Scare",[3],"Cannot have Inured to Terror","Regain one spent Willpower upon receiving Frightened, Shaken, Spooked, or another supernatural fear effect."),
  courtMerit("Autumn",67,"Improvised Ritual",[1,2,3],"Occult •••","On a non-Contract Occult ritual, spell, or ceremony, substitute scavenged tools or components without penalty a number of times equal to Merit dots. A failed roll becomes a dramatic failure."),
  courtMerit("Autumn",67,"Intuitive Artificer",[1],"Occult ••","After examining a supernatural object for one minute, reflexively roll Intelligence + Occult. Success reveals its purpose or activation method; exceptional success reveals both."),
  courtMerit("Autumn",67,"Inured to Terror",[3],"Cannot have I Love a Good Scare","Once per scene, spend Willpower to end Frightened, Shaken, or Spooked without resolving it, or suppress another supernatural fear effect for Composure turns. Suffer −2 to harvest Glamour from fear for 12 hours afterward."),
  courtMerit("Autumn",68,"Strange Favor",[1,2,3],null,"Define a supernatural entity that owes the character a significant favor. After calling it in, lose this Merit and gain the same number of dots in appropriate Merits. The relationship also creates future complications."),

  courtMerit("Winter",68,"Grief Connoisseur",[1],"Empathy ••","Choose a specific kind of sorrow. Successfully harvesting Glamour from humans experiencing it grants two additional Glamour rather than the usual one for the Court's favored emotion."),
  courtMerit("Winter",68,"GTFO",[1,2,3,4],"Danger Sense, Wits ••, Stealth ••, Winter Mantle ••","A defensive Style for anticipating danger and escaping before capture.",[
    {rating:1,name:"Justifiable Paranoia",description:"Once per chapter, accept Shaken or Spooked to double Danger Sense until the character next sleeps."},
    {rating:2,name:"Know Your Exits",description:"Study the surroundings as an instant action to identify every obvious, unconcealed exit and gain +3 to locate hidden exits."},
    {rating:3,name:"Dead Sprint",description:"When Dodging to escape, also move up to twice Speed; while pursued in a Chase, always have the Edge."},
    {rating:4,name:"Not Today, Death!",description:"After failing a surprise roll, spend Willpower to retain Defense and act in the first turn, provided the action is used to escape danger."},
  ]),
  courtMerit("Winter",68,"Ice-Water Veins",[2],"Composure •••","Mundane attempts to manipulate the character's emotions suffer a penalty equal to Composure. Spend Willpower to extend the penalty to supernatural attempts for a scene; the same disconnection impedes emotional harvesting."),
  courtMerit("Winter",69,"Misery Loves Company",[1],"Manipulation •••","Gain 9-again on Empathy, Socialize, and Subterfuge rolls against someone trying to comfort the character, whether the displayed grief is genuine or not."),
  courtMerit("Winter",69,"Shoulder to Cry On",[2],"Empathy ••","Gain 8-again on Empathy and Socialize with grieving people. Once per scene, successfully comforting one restores a spent Willpower; a grieving Touchstone instead restores all spent Willpower."),
  courtMerit("Winter",69,"Shivers",[2],"Winter Mantle ••, Wits •••","When directly observed without knowing it, the Storyteller may secretly roll Wits + Composure; success alerts the character even against supernatural or otherworldly observation, but not an unwatched recording device."),
  courtMerit("Winter",69,"Snow Cover",[2],"Winter Mantle ••","Spend Willpower to extend the penalty enemies suffer to notice the spying character to Winter Mantle allies within arm's reach. If one member is noticed, the entire group is discovered."),
] as const;

export const HEDGE_DUELIST_VARIANTS = [
  { value: "thousand-falling-leaves", label: "Thousand Falling Leaves", seeming: "Any", description: "Before one attack, inflict −1 Defense on the opponent; a successful attack deals only half its normal damage." },
  { value: "once-bitten-twice-shy", label: "Once Bitten, Twice Shy", seeming: "Beast", description: "After damaging an opponent with an attack this turn, reduce their Initiative on the next turn by the character's Hedge Duelist dots." },
  { value: "shadowplay", label: "Shadowplay", seeming: "Darkling", description: "Gain +2 Defense while in darkness or deep shadow." },
  { value: "treacherous-ground", label: "Treacherous Ground", seeming: "Elemental", description: "Reduce an opponent's Speed by Hedge Duelist dots while that opponent touches the ground." },
  { value: "unblemished-poise", label: "Unblemished Poise", seeming: "Fairest", description: "While no damage is marked on the character's Health track, add Hedge Duelist dots to Initiative." },
  { value: "the-crashing-oak", label: "The Crashing Oak", seeming: "Ogre", description: "Gain +3 from an All-Out Attack instead of +2." },
  { value: "spite-is-strength", label: "Spite is Strength", seeming: "Wizened", description: "Gain +1 to attack rolls this turn if the opponent damaged the character during the previous turn." },
] as const;

const HEDGE_DUELIST_EN = {
  id: "ctl-2ed:hedge-duelist",
  name: "Hedge Duelist",
  ratings: [1,2,3,4,5],
  line: "CtL" as const,
  sourceId: "ctl-2ed",
  source: "Changeling the Lost; Book of Seemings addendum",
  category: "Changeling Seemings",
  prerequisites: "Presence or Manipulation ••, Brawl or Weaponry ••, any Social Skill ••",
  description: "A fae dueling Style whose maneuvers work only in the Hedge. Choose Thousand Falling Leaves or one of the six Seeming-themed alternative first-dot maneuvers. Additional first-dot variants may be purchased as separate instances for one Experience each.",
  page: 115,
  additionalSources: [{ sourceId: "h-seemings", source: "Book of Seemings", page: 101 }],
  levels: [
    ...HEDGE_DUELIST_VARIANTS.map((variant)=>({rating:1,name:`${variant.label} (${variant.seeming})`,description:variant.description})),
    {rating:2,name:"Emerald Shield",description:"Gain Armor 2/0 in the Hedge. It stacks with worn armor, but not armor granted by Hedgespinning or Contracts."},
    {rating:3,name:"Bite Like Thorns",description:"Add dice to attacks equal to the wound penalty currently suffered by the opponent."},
    {rating:4,name:"Whispers Beyond the Path",description:"Instead of a physical attack, roll Presence + Intimidation or Manipulation + Subterfuge, contested by Resolve + Composure. On success, roll the difference in successes and inflict that much minor Clarity damage; the character also suffers one minor Clarity damage."},
    {rating:5,name:"Symphony of Thorns",description:"During a Hedge Duel, attack rolls suffer no penalty for generating shaping successes through Hedgespinning."},
  ],
} as const;

export const SUPPLEMENTAL_MERITS_EN = [
  ...KITH_AND_KIN_MERITS_EN,
  ...COURT_MERITS_EN,
  HEDGE_DUELIST_EN,
] as const;
