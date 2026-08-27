export type GameLine = "CtL" | "MtA";

export type MeritDefinition = {
  id: string;
  name: string;
  ratings: number[];
  line: "Core" | GameLine;
  sourceId: string;
  source: string;
  category: string;
  priority: number;
};

const range = (min: number, max: number) => Array.from({ length: max - min + 1 }, (_, index) => min + index);
const fixed = (...values: number[]) => values;
const slug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const m = (name: string, ratings: number[], line: "Core" | GameLine, sourceId: string, source: string, category: string, priority = 1): MeritDefinition => ({
  id: `${sourceId}:${slug(name)}`, name, ratings, line, sourceId, source, category, priority,
});

const CORE = [
  ...[
    ["Area of Expertise", fixed(1)], ["Common Sense", fixed(3)], ["Danger Sense", fixed(2)], ["Direction Sense", fixed(1)],
    ["Eidetic Memory", fixed(2)], ["Encyclopedic Knowledge", fixed(2)], ["Eye for the Strange", fixed(2)], ["Fast Reflexes", range(1,3)],
    ["Good Time Management", fixed(1)], ["Holistic Awareness", fixed(1)], ["Indomitable", fixed(2)], ["Investigative Aide", fixed(1)],
    ["Investigative Prodigy", range(1,5)], ["Interdisciplinary Specialty", fixed(1)], ["Language", fixed(1)], ["Library", range(1,3)],
    ["Meditative Mind", fixed(1,2,4)], ["Multilingual", fixed(1)], ["Patient", fixed(1)], ["Professional Training", range(1,5)],
    ["Tolerance for Biology", fixed(2)], ["Trained Observer", fixed(1,3)], ["Vice-Ridden", fixed(2)], ["Virtuous", fixed(2)],
  ].map(([name, ratings]) => m(name as string, ratings as number[], "Core", "core-2ed", "Chronicles of Darkness", "Mental")),
  ...[
    ["Ambidextrous", fixed(3)], ["Automotive Genius", fixed(1)], ["Crack Driver", fixed(2,3)], ["Demolisher", range(1,3)],
    ["Double Jointed", fixed(2)], ["Fleet of Foot", range(1,3)], ["Giant", fixed(3)], ["Hardy", range(1,3)],
    ["Iron Stamina", range(1,3)], ["Parkour", range(1,5)], ["Quick Draw", fixed(1)], ["Relentless", fixed(1)],
    ["Seizing the Edge", fixed(2)], ["Sleight of Hand", fixed(2)], ["Small-Framed", fixed(2)], ["Stunt Driver", range(1,4)],
  ].map(([name, ratings]) => m(name as string, ratings as number[], "Core", "core-2ed", "Chronicles of Darkness", "Physical")),
  ...[
    ["Allies", range(1,5)], ["Alternate Identity", range(1,3)], ["Anonymity", range(1,5)], ["Barfly", fixed(2)],
    ["Closed Book", range(1,5)], ["Contacts", range(1,5)], ["Fame", range(1,3)], ["Fast-Talking", range(1,5)],
    ["Fixer", fixed(2)], ["Hobbyist Clique", fixed(2)], ["Inspiring", fixed(3)], ["Iron Will", fixed(2)],
    ["Mentor", range(1,5)], ["Pusher", fixed(1)], ["Resources", range(1,5)], ["Retainer", range(1,5)],
    ["Safe Place", range(1,5)], ["Small Unit Tactics", fixed(2)], ["Spin Doctor", fixed(1)], ["Staff", range(1,5)],
    ["Status", range(1,5)], ["Striking Looks", fixed(1,2)], ["Sympathetic", fixed(2)], ["Table Turner", fixed(1)],
    ["Takes One to Know One", fixed(1)], ["Taste", fixed(1)], ["True Friend", fixed(3)], ["Untouchable", fixed(1)],
  ].map(([name, ratings]) => m(name as string, ratings as number[], "Core", "core-2ed", "Chronicles of Darkness", "Social")),
  ...[
    ["Aura Reading", fixed(3)], ["Automatic Writing", fixed(2)], ["Biokinesis", range(1,5)], ["Clairvoyance", fixed(3)],
    ["Cursed", fixed(2)], ["Laying on Hands", fixed(3)], ["Medium", fixed(3)], ["Mind of a Madman", fixed(2)],
    ["Numbing Touch", range(1,5)], ["Omen Sensitivity", fixed(3)], ["Psychokinesis", fixed(3,5)], ["Psychometry", fixed(3)],
    ["Telekinesis", range(1,5)], ["Telepathy", fixed(3,5)], ["Thief of Fate", fixed(3)], ["Unseen Sense", fixed(2)],
  ].map(([name, ratings]) => m(name as string, ratings as number[], "Core", "core-2ed", "Chronicles of Darkness", "Supernatural")),
  ...[
    ["Armed Defense", range(1,5)], ["Cheap Shot", fixed(2)], ["Choke Hold", fixed(2)], ["Defensive Combat", fixed(1)],
    ["Fighting Finesse", fixed(2)], ["Firefight", range(1,3)], ["Grappling", range(1,5)], ["Heavy Weapons", range(1,5)],
    ["In Harm's Way", fixed(2)], ["Iron Skin", fixed(2,4)], ["Light Weapons", range(1,5)], ["Marksmanship", range(1,3)],
    ["Martial Arts", range(1,5)], ["Shiv", fixed(1,2)], ["Street Fighting", range(1,5)],
  ].map(([name, ratings]) => m(name as string, ratings as number[], "Core", "core-2ed", "Chronicles of Darkness", "Fighting Style")),
];

const CORE_CATEGORY_BY_NAME = new Map(CORE.map((merit) => [merit.name.toLocaleLowerCase("en"), merit.category]));
const generalCategory = (name: string, fallback = "Mental") => CORE_CATEGORY_BY_NAME.get(name.toLocaleLowerCase("en")) ?? fallback;

const CTL_PRIMARY = [
  ["Acute Senses", fixed(1)], ["Arcadian Metabolism", fixed(2)], ["Brownie's Boon", fixed(1)], ["Cloak of Leaves", range(1,3)],
  ["Cold Hearted", fixed(3)], ["Court Goodwill", range(1,5)], ["Defensive Dreamscaping", fixed(2)], ["Diviner", range(1,5)],
  ["Dream Warrior", fixed(1)], ["Dreamweaver", fixed(3)], ["Dull Beacon", range(1,5)], ["Fae Mount", range(1,5)],
  ["Faerie Favor", fixed(3)], ["Fair Harvest", fixed(1,2)], ["Firebrand", fixed(2)], ["Glamour Fasting", fixed(1)],
  ["Goblin Bounty", range(1,5)], ["Gentrified Bearing", fixed(2)], ["Grounded", fixed(3)], ["Hedge Brawler", fixed(2)],
  ["Hedge Duelist", range(1,3)], ["Hedge Sense", fixed(1)], ["Hob Kin", fixed(1)], ["Hollow", range(1,5)],
  ["Lethal Mien", fixed(2)], ["Mantle", range(1,5)], ["Market Sense", fixed(1)], ["Noblesse Oblige", range(1,3)],
  ["Pandemoniacal", range(1,3)], ["Parallel Lives", fixed(3)], ["Stable Trod", range(1,5)], ["Token", range(1,5)],
  ["Touchstone", range(1,5)], ["Warded Dreams", range(1,3)], ["Workshop", range(1,5)],
].map(([name, ratings]) => m(name as string, ratings as number[], "CtL", "ctl-2ed", "Changeling the Lost", "Changeling", 3));

const CTL_LOCAL_OVERRIDES = [
  ["Allies", range(1,5)], ["Alternate Identity", range(1,3)], ["Anonymity", range(1,5)], ["Common Sense", fixed(3)],
  ["Contacts", fixed(1)], ["Danger Sense", fixed(2)], ["Demolisher", range(1,3)], ["Direction Sense", fixed(1)],
  ["Eidetic Memory", fixed(2)], ["Encyclopedic Knowledge", fixed(2)], ["Fame", range(1,3)], ["Fast Reflexes", range(1,3)],
  ["Fast-Talking", range(1,5)], ["Fighting Finesse", fixed(2)], ["Fixer", fixed(2)], ["Fleet of Foot", range(1,3)],
  ["Giant", fixed(3)], ["Inspiring", fixed(3)], ["Interdisciplinary Specialty", fixed(1)], ["Iron Stamina", range(1,3)],
  ["Language", fixed(1)], ["Library", range(1,3)], ["Lucid Dreamer", fixed(2)], ["Mentor", range(1,5)],
  ["Parkour", range(1,5)], ["Pusher", fixed(1)], ["Resources", range(1,5)], ["Retainer", range(1,5)],
  ["Safe Place", range(1,5)], ["Small-Framed", fixed(2)], ["Staff", range(1,5)], ["Status", range(1,5)],
  ["Striking Looks", fixed(1,2)], ["Sympathetic", fixed(2)], ["Trained Observer", fixed(1,3)], ["True Friend", fixed(3)],
].map(([name, ratings]) => m(name as string, ratings as number[], "CtL", "ctl-2ed", "Changeling the Lost", generalCategory(name as string), 4));

const CTL_SUPPLEMENTS = [
  ...[["Regalia Manifestation", range(1,5)], ["Dramaturge", fixed(3)], ["Understudy", fixed(3)]].map(([n,r]) => m(n as string,r as number[],"CtL","ctl-kith-kin","Kith and Kin","Changeling",2)),
  ...[["Baron of the Lesser Ones", fixed(4)], ["Dauphines of Wayward Children", fixed(4)], ["Master of Keys", fixed(4)]].map(([n,r]) => m(n as string,r as number[],"CtL","ctl-oak-ash-thorn","Oak, Ash, and Thorn","Entitlement",2)),
  ...[["Holding", range(1,5)], ["Thistle Guardian", fixed(3)], ["Dream-Tripper", fixed(3)], ["Dream Ghost", fixed(2)], ["Twice Shy", fixed(3)]].map(([n,r]) => m(n as string,r as number[],"CtL","ctl-hedge","The Hedge","Changeling",2)),
  ...[["Hedgewise", fixed(2)], ["Librarian", fixed(3)], ["Gunslinger", range(1,5)]].map(([n,r]) => m(n as string,r as number[],"CtL","ctl-dark-eras","Dark Eras Changeling","Historical",2)),
  ...[
    ["Bedside Manner",fixed(3)],["Dressed to Kill",fixed(2)],["Friends in Low Places",range(1,3)],["Spring-Loaded",fixed(1)],["I Meant to Do That",fixed(1)],["Host with the Most",fixed(3)],
    ["Beware of Dog",fixed(2)],["No Rest for the Wicked",fixed(3)],["Challenge Accepted",fixed(1)],["Street Pharmacist",fixed(1)],["Don't Mess with Jim",fixed(1)],["Sucker Born Every Minute",fixed(1)],
    ["A Taste of Honey",fixed(2)],["Eyes on the Prize",fixed(3)],["You Have Only Made Me Stronger",fixed(4)],["Payback Time",fixed(5)],["Get the Manager",fixed(1)],["Quiet Rage",fixed(1)],
    ["Hey, Watch This",fixed(1)],["Rageaholic",fixed(2)],["Seen Some Shit",fixed(2)],["Dialed In",fixed(1)],["Acquired Taste",fixed(1)],["I Love a Good Scare",fixed(3)],
    ["Can't Spook a Spooker",fixed(2)],["Improvised Ritual",range(1,3)],["Favored Phobia",fixed(2)],["Hedgewalker",fixed(3)],["Intuitive Artificer",fixed(1)],["Inured to Terror",fixed(3)],
    ["GTFO",range(1,4)],["Strange Favor",range(1,3)],["Justifiable Paranoia",fixed(1)],["Dead Sprint",fixed(3)],["Ice-Water Veins",fixed(2)],["Grief Connoisseur",fixed(1)],
    ["Misery Loves Company",fixed(1)],["Shoulder to Cry On",fixed(2)],["Shivers",fixed(2)],["Snow Cover",fixed(2)],
  ].map(([n,r]) => m(n as string,r as number[],"CtL","h-courts","Book of Courts","Court",2)),
  ...[
    ["Blood and Bone",fixed(2)],["Debaucher",fixed(2)],["Fae Pet",fixed(1)],["Green Grocer",range(1,3)],["Hot Pursuit",fixed(2)],["Just Try Me",fixed(2)],["Total Abandon",range(1,3)],
    ["From the Shadows",fixed(2)],["Mad, Bad, and Dangerous",fixed(1)],["Hidden Life",fixed(2)],["Malignant Mien",fixed(2)],["Running with the Wolves",fixed(2)],["Screw It",fixed(2)],["Lucidity in Lunacy",fixed(3)],
    ["Puzzler",fixed(2)],["Mirror Me",fixed(2)],["Riddle Me This",fixed(1)],["Secret Seer",fixed(2)],["Perfect Stillness",fixed(1)],["Wrapped in an Enigma",fixed(1)],["Poor Little Paranoid",fixed(2)],
    ["Conjuror's Call",fixed(2)],["Unbroken Branches",fixed(2)],["Foiled Forensics",fixed(1)],["Stone-Hearted",fixed(2)],["Resting Birch Face",fixed(1)],["Eerie Eyes",fixed(1)],["Smelling Like a Rose",fixed(1)],
    ["Still Waters Run Deep",fixed(3)],["Stomach of Steel",fixed(1)],["Fire-Forged Friends",fixed(2)],["Multimask",fixed(2)],["Not Just a Pretty Face",fixed(1)],["Confessional Countenance",fixed(1)],["Throne",range(1,3)],
    ["Just Your Type",fixed(1)],["Mover and Shaker",range(1,3)],["Sanguine Sacrifice",fixed(2)],["Living Large",fixed(2)],["Soothing Presence",fixed(2)],["Looming Large",fixed(1)],["Meat Shield",range(1,5)],
    ["Cast-Iron Stomach",fixed(2)],["Think Twice",fixed(1)],["Get Behind Me",fixed(2)],["Englishman",fixed(2)],["I Can Take It",fixed(4)],["Gnarled",fixed(2)],["Buy Time",fixed(5)],
    ["Thick-Headed",fixed(1)],["Iron Toes",fixed(2)],["Thick-Skinned",fixed(3)],["Tickets to the Gun Show",fixed(2)],["Know-It-All",fixed(2)],["Material Affinity",fixed(1,3)],["Too Simple to Fool",fixed(1)],
    ["Percussive Maintenance",fixed(1)],["Perfectionist",fixed(4)],["Pinchpenny",fixed(2)],["Razor Tongue",fixed(2)],["Spiteful Competence",fixed(2)],["Once Bitten, Twice Shy",fixed(1)],["Shadowplay",fixed(1)],
    ["Tinkerer",fixed(1)],["Treacherous Ground",fixed(1)],["Token Crucible",fixed(3)],["Unblemished Poise",fixed(1)],["The Crashing Oak",fixed(1)],
  ].map(([n,r]) => m(n as string,r as number[],"CtL","h-seemings","Book of Seemings","Seeming",2)),
];

const MTA_PRIMARY = [
  ["Adamant Hand", fixed(2)], ["Artifact", range(3,10)], ["Astral Adept", fixed(3)], ["Between the Ticks", fixed(2)],
  ["Cabal Theme", fixed(1)], ["Consilium Status", range(1,5)], ["Destiny", range(1,5)], ["Dream", range(1,5)],
  ["Egregore", range(1,5)], ["Enhanced Item", range(1,10)], ["Familiar", fixed(2,4)], ["Fast Spells", fixed(2)],
  ["Grimoire", range(1,5)], ["Hallow", range(1,5)], ["High Speech", fixed(1)], ["Imbued Item", range(1,10)],
  ["Infamous Mentor", range(1,5)], ["Lex Magica", fixed(2)], ["Mana Sensitivity", fixed(1)], ["Masque", range(1,5)],
  ["Occultation", range(1,3)], ["Order Status", range(1,5)], ["Potent Nimbus", fixed(1,2)], ["Potent Resonance", fixed(2)],
  ["Prelacy", range(1,4)], ["Sanctum", range(1,5)], ["Shadow Name", range(1,3)], ["Techne", fixed(2)],
].map(([name, ratings]) => m(name as string, ratings as number[], "MtA", "mta-2ed", "Mage the Awakening", "Awakened", 3));

const MTA_LOCAL_OVERRIDES = [
  ["Allies",range(1,5)],["Alternate Identity",range(1,3)],["Contacts",fixed(1)],["Defensive Combat",fixed(1)],["Fame",range(1,3)],["Language",fixed(1)],
  ["Library",range(1,3)],["Library, Advanced",range(1,5)],["Mentor",range(1,5)],["Professional Training",range(1,5)],["Resources",range(1,5)],["Retainer",range(1,5)],
  ["Safe Place",range(1,5)],["Status",range(1,5)],["Striking Looks",fixed(1,2)],["Trained Observer",fixed(1,3)],["True Friend",fixed(3)],
].map(([name, ratings]) => m(name as string, ratings as number[], "MtA", "mta-2ed", "Mage the Awakening", generalCategory(name as string), 4));

const MTA_SUPPLEMENTS = [
  ...[["Broad Dedication",fixed(1)],["Inheritance",fixed(2)],["Profligate Dedication",fixed(2)],["Cognoscente",fixed(2)],["Daimonomikon",range(1,5)],["Legacy Pedagogue",fixed(1)]].map(([n,r]) => m(n as string,r as number[],"MtA","mta-signs","Signs of Sorcery","Awakened",2)),
  ...[["Exoteric Arete",range(2,3)],["Perfecti",range(1,5)],["Seasoned Duelist",fixed(3)],["Faction Member",range(1,3)]].map(([n,r]) => m(n as string,r as number[],"MtA","mta-pentacle","Tome of the Pentacle","Order",2)),
  ...[["Hand of Destiny",range(1,5)]].map(([n,r]) => m(n as string,r as number[],"MtA","nh-nameless","Nameless and Accursed","Mystery Cult",2)),
];

export const RAW_MERITS = [...CORE, ...CTL_PRIMARY, ...CTL_LOCAL_OVERRIDES, ...CTL_SUPPLEMENTS, ...MTA_PRIMARY, ...MTA_LOCAL_OVERRIDES, ...MTA_SUPPLEMENTS];

export function getMeritsForLine(line: GameLine) {
  const applicable = RAW_MERITS.filter((merit) => merit.line === "Core" || merit.line === line);
  const selected = new Map<string, MeritDefinition>();
  for (const merit of applicable) {
    const key = merit.name.toLocaleLowerCase("en");
    const current = selected.get(key);
    if (!current || merit.priority > current.priority) selected.set(key, merit);
  }
  return [...selected.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export const MERIT_RULES = (["CtL", "MtA"] as const).map((line) => ({
  id: `merits-${line.toLowerCase()}-shared-v1`,
  name: `Catálogo de Méritos ${line}`,
  gameLine: line,
  sourceId: line === "CtL" ? "ctl-2ed" : "mta-2ed",
  page: line === "CtL" ? 111 : 99,
  data: {
    precedence: [line, "Core"],
    merits: getMeritsForLine(line).map(({ id, name, ratings, sourceId, source, category }) => ({ id, name, ratings, sourceId, source, category })),
  },
}));
