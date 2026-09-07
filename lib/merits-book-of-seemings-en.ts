import type { MeritLevel } from "./merits";

type Seeming = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";
type SeemingMerit = {
  id:string; name:string; ratings:number[]; line:"CtL"; sourceId:"h-seemings";
  source:"Book of Seemings"; category:"Changeling Seemings"; prerequisites:string;
  description:string; page:number; seeming:Seeming; alternativePrerequisites?:string;
  levels?:MeritLevel[];
};
const dots=(...ratings:number[])=>ratings;
const merit=(seeming:Seeming,page:number,name:string,ratings:number[],prerequisites:string,description:string,extra:Partial<SeemingMerit>={}):SeemingMerit=>({
  id:`h-seemings:${name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}`,
  name,ratings,line:"CtL",sourceId:"h-seemings",source:"Book of Seemings",category:"Changeling Seemings",
  prerequisites,description,page,seeming,...extra,
});

export const BOOK_OF_SEEMINGS_MERITS_EN:SeemingMerit[]=[
  merit("Beast",92,"Blood and Bone",dots(2),"Beast","Choose two Skills, at least one Physical; both gain 9-again. Gain +2 to empathize or relate to the animal reflected by the fae mien. Strengthening the Mask costs 1 Willpower the first time each chapter."),
  merit("Beast",93,"Debaucher",dots(2),"Beast","Gain a Vice and fulfill it as a mortal does. After regaining Willpower from it once in a chapter, each further fulfillment causes one die of minor Clarity damage."),
  merit("Beast",93,"Fae Pet",dots(1),"Beast or Animal Ken •••; Retainer ••","A Retainer animal gains one Dread Power, portaling powered by Willpower, and a Mask and fae mien. It may scour but not strengthen its Mask and cannot be killed for plot purposes without permission.",{alternativePrerequisites:"Animal Ken •••; Retainer ••"}),
  merit("Beast",93,"Green Grocer",dots(1,2,3),"Beast, Survival ••","Maintain two additional goblin fruits outside the Hedge per Merit dot."),
  merit("Beast",93,"Hot Pursuit",dots(2),"Beast, Fleet of Foot •","Once per scene, while within Speed meters of a quarry, spend 1 Glamour to move within arm's reach and gain the Edge in a chase."),
  merit("Beast",94,"Just Try Me",dots(2),"Beast, Intimidation ••","Once per scene, after a verbal assault or insult, reflexively spend 1 Glamour to inflict Shaken; this cannot counter supernatural powers. Lose 10-again on Socialize with people who know the character only by reputation."),
  merit("Beast",94,"Mad, Bad, and Dangerous",dots(1),"Beast, Striking Looks •","When Striking Looks benefits a first impression, three successes count as exceptional."),
  merit("Beast",94,"Malignant Mien",dots(2),"Beast or Lethal Mien","Once per scene, spend 1 Glamour so the next successful attack with natural weapons from the Beast blessing or Lethal Mien deals aggravated damage. Related Clarity damage rolls gain 9-again.",{alternativePrerequisites:"Lethal Mien"}),
  merit("Beast",94,"Running with the Wolves",dots(2),"Beast, Animal Ken •••","Gain a particular animal group as Allies •••. Spend 1 Glamour to send them a short telepathic message within Wyrd × 2 kilometers; Wits + Animal Ken may be needed to understand complex replies."),
  merit("Beast",94,"Screw It",dots(2),"Beast; Composure or Resolve •••","Once per Social maneuver, regain 1 Willpower after a failed roll, but not a dramatic failure."),
  merit("Beast",94,"Total Abandon",dots(1,2,3),"Beast, Athletics ••, Brawl ••","When making a Brawl All-Out Attack, spend 1 Glamour to add the Merit dots as weapon damage; Defense suffers an additional -2 on the next turn."),

  merit("Darkling",94,"From the Shadows",dots(2),"Darkling, Athletics ••, Stealth ••","After rolling a surprise attack, spend 1 Glamour to give the action 8-again."),
  merit("Darkling",94,"Hidden Life",dots(2),"Darkling, Subterfuge ••, Anonymity •","Anonymity dots penalize supernatural attempts to locate the character, and concealment actions gain 9-again. The fifth dot of any Status, including Mantle and Court Goodwill, costs 1 additional Experience."),
  merit("Darkling",94,"Look Over There!",dots(1),"Darkling","Spend 1 additional Glamour when portaling to create a distraction and gain one turn to flee unnoticed, provided the character only runs and does not invade another's immediate space."),
  merit("Darkling",94,"Lucidity in Lunacy",dots(3),"Darkling","When more than half the Clarity boxes are damaged, roll Wyrd + current Clarity damage. On success, the Storyteller reveals a concealed truth in a strange, indirect form."),
  merit("Darkling",95,"Mirror Me",dots(2),"Darkling","Once per chapter at Storyteller discretion, an unobserved reflection can move or pickpocket a reflected Size 1 or smaller object and place it on the character. The reflection may act selfishly."),
  merit("Darkling",95,"Perfect Stillness",dots(1),"Darkling or Wits •••; Stealth ••","While perfectly still, attempts to find the character suffer -3, increased to -5 for searchers associated with the former Keeper.",{alternativePrerequisites:"Wits •••; Stealth ••"}),
  merit("Darkling",95,"Poor Little Paranoid",dots(2),"Darkling, Danger Sense","Track all unconcealed people and objects already perceived without an action and notice any scene change. Danger Sense becomes +3. Suffer -2 to Socialize and Expression with unfamiliar humans unless Willpower suppresses this Merit for the scene."),
  merit("Darkling",95,"Puzzler",dots(2),"Darkling; Intelligence or Wits •••","Gain 8-again on instant or extended Academics or Investigation actions to solve an intended puzzle."),
  merit("Darkling",95,"Riddle Me This",dots(1),"Darkling, Expression ••, Subterfuge ••","An exceptional Expression or Subterfuge success used to baffle someone with wordplay inflicts Confused."),
  merit("Darkling",95,"Secret Seer",dots(2),"Darkling","Once per day on first meeting someone, roll Wits + Wyrd; success reveals two truths and a lie. Failure inflicts Paranoid, and each person can trigger the attempt only once."),
  merit("Darkling",95,"Wrapped in an Enigma",dots(1),"Darkling, Subterfuge •••","Once per chapter, add half Wyrd, rounded up, as bonus dice or successes to Subterfuge concerning facts about the character."),

  merit("Elemental",95,"Conjuror's Call",dots(2),"Elemental","Spend 1 Willpower to create a small, task-sized amount of the character's associated element from nothing."),
  merit("Elemental",96,"Foiled Forensics",dots(1),"Elemental","Biological traces left behind revert to the associated element after half of (10 - Wyrd) hours, rounded up; clothing and damage evidence remain."),
  merit("Elemental",96,"Resting Birch Face",dots(1),"Elemental, Intimidation ••","Before the character speaks in a scene, another's first Social action against him is penalized by his Presence. Friendly or gentle approaches suffer -1 unless enhanced with Willpower."),
  merit("Elemental",96,"Smelling Like a Rose",dots(1),"Elemental","Social rolls aided by the pleasant scent of the associated element exceptionally succeed on three successes, but the scent may make the character memorable."),
  merit("Elemental",96,"Stomach of Steel",dots(1),"Elemental or Stamina •••","The character can digest any safely swallowed substance and never suffers hunger or thirst while able to fill his stomach.",{alternativePrerequisites:"Stamina •••"}),
  merit("Elemental",96,"Unbroken Branches",dots(2),"Elemental, Wyrd •••","A recovered severed limb or body part can be reattached without loss of function and heals normally."),
  merit("Elemental",96,"Stone-Hearted",dots(2),"Elemental; Composure or Resolve •••","Willpower spent to resist Mental or Social influence adds +3 rather than +2, and the character has one additional Door in Social maneuvering."),
  merit("Elemental",96,"Eerie Eyes",dots(1),"Elemental","Define an unusual sensory organ; unless it is covered or attacked, physical obstruction cannot blind the character."),
  merit("Elemental",96,"Still Waters Run Deep",dots(3),"Elemental","Choose an Attribute. Surrounded by the associated element, treat it as one dot higher, gain 9-again on its rolls, and ignore the element's Environmental Tilt. More than a day without contact inflicts Deprived until one hour of immersion."),
  merit("Elemental",97,"Fire-Forged Friends",dots(2),"Elemental or Occult •••; Empathy ••; Contract of Primal Glory","Primal Glory may be bestowed on up to Wyrd allies per scene by touch and an instant action each; spending 1 Glamour also shares accessible Seeming-specific blessings.",{alternativePrerequisites:"Occult •••; Empathy ••; Contract of Primal Glory"}),

  merit("Fairest",97,"Confessional Countenance",dots(1),"Fairest, Empathy •••","Gain +2 on Social rolls with someone revealing sensitive information, or +3 if they have Embarrassing Secret; strangers may volunteer useful information without a roll."),
  merit("Fairest",97,"Just Your Type",dots(1),"Fairest, Barfly","While using Barfly, count as having Striking Looks ••; if already possessed, double its bonuses."),
  merit("Fairest",97,"Mover and Shaker",dots(1,2,3),"Fairest","Choose a mortal subculture. Spend 1 Glamour to add Merit dots to Social actions with its members and exceptionally succeed on three successes; once per story, also use the dots as Allies."),
  merit("Fairest",97,"Multimask",dots(2),"Fairest or Subterfuge •••; Manymask","Manymask changes two features per Glamour, and can change the entire appearance at Wyrd 3 rather than 5.",{alternativePrerequisites:"Subterfuge •••; Manymask"}),
  merit("Fairest",97,"Not Just a Pretty Face",dots(1),"Fairest, Striking Looks •","Gain +2 on Social rolls when playing into an attractive stereotype to be underestimated; lose 10-again when trying to appear competent to those who have not witnessed that competence."),
  merit("Fairest",97,"Power Behind the Throne",dots(1,2,3),"Fairest, Manipulation •••","For a scene, grant an ally temporary dots in one of the character's Social Skills up to the Merit rating and owned Skill rating. The character suffers an equal penalty if using that Skill in the same scene."),
  merit("Fairest",98,"Sanguine Sacrifice",dots(2),"Fairest","Self-inflict lethal damage and anoint another changeling with the blood to restore 2 Glamour per damage. Mitigation cannot reduce the sacrifice, and healing it in the same scene removes the Glamour."),
  merit("Fairest",98,"Soothing Presence",dots(2),"Fairest, Presence •••","While present, reduce a Clarity attack against a Motley Oathmate by one die; afterward, Clarity attacks against the character gain +1 for the scene."),

  merit("Ogre",98,"Cast-Iron Stomach",dots(2),"Ogre, Stamina ••","Consume spoiled, raw, or otherwise unsafe food without harm and add Wyrd to resist ingested toxins and diseases."),
  merit("Ogre",98,"I Smell the Blood of an Englishman",dots(2),"Ogre","Automatically detect blood within Wyrd × 10 meters. After tasting a creature's blood, add Wyrd to track it and to detect hidden people or details through blood traces."),
  merit("Ogre",98,"Large and in Charge",dots(2),"Ogre, Size 6+","Once per scene on a Social action to command attention or direct others, substitute Size for Presence; if Presence is not lower, gain rote instead."),
  merit("Ogre",98,"Living Large",dots(2),"Ogre, Resources •, Size 6+","Once per chapter, acquire goods through intimidation or petty crime instead of Resources, up to Availability equal to half Size, rounded up; consequences still apply."),
  merit("Ogre",98,"Looming Large",dots(1),"Ogre, Size 6+","Gain +2 to Intimidation-based rolls against smaller characters."),
  merit("Ogre",98,"Meat Shield",dots(1,2,3,4,5),"Ogre, Stamina •••, Intimidation •••","A progressive protection style.",{levels:[
    {rating:1,name:"Think Twice",description:"Add Intimidation to Initiative in the first turn of a violent encounter."},
    {rating:2,name:"Get Behind Me",description:"Provide substantial ranged concealment to characters behind you, or total concealment if they are smaller."},
    {rating:3,name:"Remember Me?",description:"Once per turn, contest Presence + Intimidation against an attacker targeting a nearby ally; on success they attack you instead, against half Defense."},
    {rating:4,name:"I Can Take It",description:"Spend 1 Willpower when Remember Me? redirects a successful attack to halve its damage, rounded down, minimum 1."},
    {rating:5,name:"Buy Time",description:"When one of the last three Health boxes is filled and an ally is threatened, spend 1 Willpower and an instant action to gain Stamina armor until the next turn."},
  ]}),
  merit("Ogre",99,"Thick-Headed",dots(1),"Ogre; Stamina or Strength •••","Successful physical attacks against the head deal one less damage; successful attacks made with the head deal +1 damage."),
  merit("Ogre",99,"Thick-Skinned",dots(3),"Ogre, Stamina •••","Ignore a physical attack or hazard that would inflict exactly one bashing damage."),
  merit("Ogre",99,"Tickets to the Gun Show",dots(2),"Ogre or Strength •••; Athletics ••","When visibly displaying physical prowess to distract or attract, Social actions gain 8-again. Each use after the first in a scene takes a cumulative -1.",{alternativePrerequisites:"Strength •••; Athletics ••"}),
  merit("Ogre",99,"Too Simple to Fool",dots(1),"Ogre, Intelligence • maximum","Gain +2 to resist verbal trickery. If Intelligence permanently rises above 1, the Merit is lost under Sanctity of Merits."),

  merit("Wizened",99,"Gnarled",dots(2),"Wizened, Wyrd ••","The character has no natural lifespan. Taking one extra interval on an extended action grants 9-again, while remaining limited by the dice pool; physical aging continues to apparent late sixties."),
  merit("Wizened",99,"Iron Toes",dots(2),"Wizened","Gain Armor 1 against self-inflicted physical damage caused by mistakes or mishaps."),
  merit("Wizened",99,"Know-It-All",dots(2),"Wizened, Intelligence •••, chosen Skill ••","Choose Academics, Occult, Politics, or Science. Rolls with it gain 9-again, and Willpower adds +4 instead of +3."),
  merit("Wizened",99,"Material Affinity",dots(1,3),"Wizened; Crafts or Expression ••","Choose a specific material at one dot or a broad category at three. Non-Crafts actions substantially involving it exceptionally succeed on three successes; Crafts and Expression directly working it gain Advanced Action. Iron is forbidden and an upgrade must retain the same category."),
  merit("Wizened",100,"Percussive Maintenance",dots(1),"Wizened","Instead of a Crafts roll for a simple repair, deal 1 Structure damage as an instant action to make the device function for the scene. Each use adds one required success to a permanent repair."),
  merit("Wizened",100,"Perfectionist",dots(4),"Wizened; Wits ••; Crafts, Expression, or Occult •••","After a successful Build Equipment action, spend 1 Glamour and up to 3 Willpower; each Willpower adds one to Durability, Structure, or Equipment bonus, each at most once and never above +5. Teamwork requires every participant to possess this Merit."),
  merit("Wizened",100,"Pinchpenny",dots(2),"Wizened, Wits •••","Gain rote on rolls to negotiate prices or exchanges of service."),
  merit("Wizened",101,"Razor Tongue",dots(2),"Wizened, Expression ••","An exceptional Social success to belittle, mock, or humiliate causes the subject to lose 1 Willpower."),
  merit("Wizened",101,"Spiteful Competence",dots(2),"Wizened","Once per scene, Willpower adds +5 instead of +3 when retrying an action previously failed publicly before witnesses."),
  merit("Wizened",101,"Tinkerer",dots(1),"Wizened, Crafts ••","Ignore penalties to Crafts for improvised tools."),
  merit("Wizened",101,"Token Crucible",dots(3),"Workshop •, Workshop Specialty (Token Crafting)","A dedicated Hollow facility reduces Hedge-forged token creation by one chapter, minimum one, and remains protected by the Hollow. It consumes a new load of exotic fuel each operating chapter."),
  merit("Wizened",101,"Told You So",dots(2),"Wizened","Once per scene, regain 1 Willpower when the character or a present ally dramatically fails an action whose chances the character previously disparaged."),
];
