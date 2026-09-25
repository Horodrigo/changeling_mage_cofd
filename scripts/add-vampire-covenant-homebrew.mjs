import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const writeCompact = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value));
const writeRows = (file, value) => fs.writeFileSync(path.join(root, file), `[\n${value.map((item) => `  ${JSON.stringify(item)}`).join(",\n")}\n]\n`);
const writeManifest = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2).replace(/\{\n\s+"version": (\d+),\n\s+"url": "([^"]+)"\n\s+\}/g, '{ "version": $1, "url": "$2" }')}\n`);
const upsert = (catalog, items) => [...catalog.filter((entry) => !items.some((item) => item.id === entry.id)), ...items];
const dots = (from, to = from) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const slug = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AE = { sourceId: "h-vtr-agony-ecstasy", source: "Agony & Ecstasy: Circle of the Crone" };
const FR = { sourceId: "h-vtr-fire-revolution", source: "Fire & Revolution: Carthians" };
const merit = (book, name, ratings, page, description, extra = {}) => ({
  id: `${book.sourceId}:${slug(name)}`, name, ratings, line: "VtR", ...book, category: "Vampire", priority: 10,
  translatedName: name, description, descriptionEn: description, page, homebrew: true, descriptivePrerequisites: true, ...extra,
});
const humanMerit = (book, name, ratings, page, description, category, prerequisites) => merit(book, name, ratings, page, description, { line: "Core", category, ...(prerequisites ? { prerequisites } : {}) });
const devotion = (book, name, page, prerequisites, experienceCost, summary, extra = {}) => ({
  id: `${book.sourceId}:devotion:${slug(name)}`, kind: "devotion", name, translatedName: name, prerequisites, experienceCost,
  summary, ...book, page, sourceId: book.sourceId, homebrew: true, manualOnly: true, ...extra,
});
const rite = (name, rating, page, targetSuccesses, summary, extra = {}) => ({
  id: `${AE.sourceId}:rite:${slug(name)}`, kind: "cruac-rite", name, translatedName: name, rating, experienceCost: 2,
  targetSuccesses, summary, ...AE, page, sourceId: AE.sourceId, homebrew: true, manualOnly: true, ...extra,
});
const errataMerit = (book, name, page, errataFor, errataForName, description, extra = {}) => merit(book, `${name} — Errata`, extra.ratings ?? [1], page, description, {
  category: "Errata", defaultDisabled: true, errataFor, errataForName, ...extra,
});

const vampireMerits = [
  merit(AE, "Spell Swallowing", dots(1, 5), 67, "A Clíodhna Crúac Style that fast-casts and consumes rites, absorbs hostile ritual magic, and ultimately devours other supernatural sorcery.", { category: "Tradition", prerequisites: "Circle of the Crone Status ••; Occult ••" }),
  merit(AE, "Neidan Gu", dots(1, 5), 70, "A Jiju Crúac Style that replaces outward ceremony with inner alchemy, poisons victims through rites, and makes the ritualist's Vitae toxic.", { category: "Tradition", prerequisites: "Circle of the Crone Status ••; Crafts ••" }),
  merit(AE, "Uncaged Indulgence", dots(1, 5), 73, "A Maenad Crúac Style that turns communal excess, hunger, and frenzy into ritual power while leaving the caster Tempted.", { category: "Tradition", prerequisites: "Circle of the Crone Status ••; Socialize ••" }),
  merit(AE, "Unconscious Alignment", dots(1, 5), 75, "A Syzygist Crúac Style that aligns rites with dreams and celestial omens to alter timing, targeting, and prophetic insight.", { category: "Tradition", prerequisites: "Circle of the Crone Status ••; Occult ••" }),

  merit(AE, "Annis Bite", [2, 3], 90, "Turns the Acolyte's bite into a more fearsome predatory and ritual instrument.", { category: "Circle of the Crone" }),
  merit(AE, "Apothecary", dots(1, 5), 90, "A Style for distilling Crúac rites into potions, improving their storage, sharing, potency, and sympathetic reach.", { category: "Circle of the Crone", prerequisites: "Witch's Brew; Crafts or Science •••" }),
  merit(AE, "Athame", [3], 91, "Consecrates a ritual blade that assists blood sorcery and retains the significance of its sacrifices.", { category: "Circle of the Crone" }),
  merit(AE, "Banshee", [3], 91, "Allows dangerous fast casting of Crúac with a keening ritual cry.", { category: "Circle of the Crone", prerequisites: "Occult •••; Crúac ••" }),
  merit(AE, "Blood Cult", [1], 92, "Represents a mortal cult that supplies combined Retainer and Staff dots equal to twice the vampire's Herd.", { category: "Circle of the Crone", prerequisites: "Circle of the Crone Status ••" }),
  merit(AE, "Closer Family", [2], 92, "Deepens the supernatural connection created by Close Family through Crúac.", { category: "Circle of the Crone", prerequisites: "Close Family; Crúac ••" }),
  merit(AE, "Conflict of Faith", [2], 92, "Lets an Acolyte uphold a second religious vow when facing relevant breaking points.", { category: "Circle of the Crone" }),
  merit(AE, "Hag Blood", [2], 92, "Lets a ghoul spill lethal blood in place of Vitae for Crúac rites, although a leading ritualist must still supply the first Vitae normally.", { category: "Circle of the Crone", prerequisites: "Ghoul" }),
  merit(AE, "Hunting Party", [2], 92, "Coordinates group feeding so participating vampires hunt more effectively and share the resulting benefits.", { category: "Circle of the Crone", prerequisites: "Circle of the Crone Status ••" }),
  merit(AE, "Infectious Aura", [2, 3], 92, "Makes the vampire's predatory aura contagious, leaving a supernatural emotional link to affected victims.", { category: "Circle of the Crone", prerequisites: "Occult •••; Humanity 6 or lower" }),
  merit(AE, "Master's Shadow", [1], 92, "Strengthens a Warden's supernatural bond with a chosen beast or charge.", { category: "Circle of the Crone", prerequisites: "Warden or Animal Ken •••" }),
  merit(AE, "Mythologist (Advanced)", [2], 92, "Extends Mythologist so practical knowledge of myth improves Crúac work.", { category: "Circle of the Crone", prerequisites: "Mythologist; Crúac •" }),
  merit(AE, "Older Than I Look", [2], 93, "An Embraced child or teenager leverages the unsettling contrast between apparent and actual age.", { category: "Circle of the Crone", prerequisites: "Intimidation ••; Embraced as a child or teenager" }),
  merit(AE, "Sacrificial Inurement", [3], 93, "Reduces the emotional and mechanical burden of repeated ritual sacrifice.", { category: "Circle of the Crone", prerequisites: "Resolve •••; Humanity 6 or lower" }),
  merit(AE, "Sustaining the Pack", [2], 93, "Supports a coordinated pack through shared hunting and blood.", { category: "Circle of the Crone", prerequisites: "Animal Ken •••" }),
  merit(AE, "Temple", dots(1, 5), 93, "Establishes a shared Acolyte temple whose rating supports covenant rites and contributors.", { category: "Circle of the Crone", prerequisites: "Altar; Circle of the Crone Status ••; Safe Place •" }),
  merit(AE, "Red Vein of Fate", [3], 93, "Reads the occult course of blood and fate through Crúac.", { category: "Circle of the Crone", prerequisites: "Crúac ••" }),
  merit(AE, "Reviled", dots(1, 5), 93, "Turns a chosen group's hatred into notoriety and leverage, but forbids Status with that group.", { category: "Circle of the Crone", prerequisites: "Cannot have Kindred Status in the chosen group", repeatable: true }),
  merit(AE, "Underground Matron", [1, 2], 94, "Builds a hidden network that helps Acolytes move and operate between domains.", { category: "Circle of the Crone", prerequisites: "Circle of the Crone Status •••; Streetwise" }),
  merit(AE, "Witch's Brew", [2], 94, "Stores a successfully cast Crúac rite in a prepared potion for later use.", { category: "Circle of the Crone", prerequisites: "Resources •; Occult •••; Crúac •" }),
  merit(AE, "Unmasked Devil", dots(1, 3), 94, "A Style for openly embodying the Beast and gaining progressively stronger predatory benefits.", { category: "Circle of the Crone", prerequisites: "Intimidation •••; Humanity 6 or lower" }),

  ...[
    ["Opening the Void", "Opens Crúac to the emptiness beyond the world, escalating from void-touched casting to a shadow familiar."],
    ["Omen Plague", "Makes Crúac omens contagious and increasingly dangerous to those caught in them."],
    ["Primal Creation", "Channels sacrifice into fecund, monstrous creation and permanent transformations."],
    ["Shadow Calling", "Calls and bargains with ephemeral beings through Crúac."],
    ["Sating the Crone", "Draws greater power from increasingly costly and significant sacrifices."],
    ["Storm Herald", "Adds weather, movement, and storm effects to Crúac rites."],
    ["Void Familiar", "Develops the familiar created through Opening the Void."],
    ["Unbridled Chaos", "Injects escalating supernatural instability into rites and their subjects."],
  ].map(([name, description], index) => merit(AE, name, dots(1, 5), 95 + Math.floor(index / 2), description, { category: "Crúac Style", ...(name === "Void Familiar" ? { prerequisites: "Opening the Void" } : {}) })),

  merit(AE, "Mandragora Garden", dots(1, 5), 105, "Maintains a blood-fed garden of ghoul plants that yields Vitae each month and can dispose of helpless prey.", { category: "Mandragora", prerequisites: "Kindred; Safe Place •" }),
  merit(AE, "Sorcerer's Harvest", [3], 106, "Uses a personally cultivated Mandragora Garden as an extension of the ritualist's body and prolongs rites cast within it.", { category: "Mandragora", prerequisites: "Mandragora Garden •; Crúac •" }),
  merit(AE, "Red Thumb", dots(1, 4), 106, "Makes mandragora hardier and cheaper to cultivate, even allowing delicate plants to survive the transformation.", { category: "Mandragora", prerequisites: "Mandragora Garden •; Occult ••" }),
  merit(AE, "Witch's Garden", [2, 4], 107, "Enhances newly created mandragora with a clan Discipline or scene-long mobility; at four dots they gain both.", { category: "Mandragora", prerequisites: "Red Thumb; Blood Potency 2" }),
  merit(AE, "What You've Done for Her Lately", [1], 107, "Extends its witnessed Acolyte ritual benefit from a scene to a night.", { category: "Mandragora" }),

  ...[
    ["Bloodroots Associate", "Connects the character to the Bloodroots faction and grants its political and grassroots benefits."],
    ["Cultist of Self", "Grants 9-again to agenda-related Streetwise and Survival and limited access to Rule of One, while capping Carthian Status at three."],
    ["Digital Upriser", "Grants 9-again to agenda-related Computer and Subterfuge and lets I Know a Guy call on Resources."],
    ["Carthian Atheist", "Grants 9-again to agenda-related Academics and Occult and improves the first purchase of Coda Against Sorcery."],
    ["Oppositionist", "Grants 9-again to agenda-related Athletics and Survival and calls on Army of One through faction solidarity."],
    ["Sabotage Artist", "Grants 9-again to agenda-related Larceny and Stealth and expands I Know a Guy while undermining another covenant."],
    ["Sophocrat", "Grants 9-again to agenda-related Academics and Science and substitutes knowledge for Status on low-dot nonphysical Carthian Merits."],
    ["PPI Cadreman", "Grants 9-again to agenda-related Occult and Politics and supplies supernatural Contacts and a related Politics Specialty."],
  ].map(([name, description], index) => merit(FR, name, [2], 70 + Math.floor(index / 2), description, { category: "Faction", prerequisites: "Carthian Movement Status ••" })),

  ...[
    ["Antagonizing Aura", [1], 93, "Provokes Kindred into following or confronting the character in social scenes.", "Presence •••"],
    ["Beast Gestalt", dots(1, 5), 93, "Coordinates a colony's Beasts through progressively stronger communal benefits.", "Member of a colony"],
    ["Agent Provocateur", [2], 93, "Uses performance and deception to provoke political action.", "Expression •••; Subterfuge •••"],
    ["Carthian Lawyer", [2], 94, "Applies legal expertise to Carthian disputes and Law.", "Carthian Movement Status ••; Academics •••"],
    ["Constituent", dots(1, 3), 94, "Grants a Carthian regnant's ghoul effective Carthian Status and access to Carthian Laws up to the Merit rating.", "Politics •••; Ghoul with a Carthian regnant"],
    ["Devotion Experimenter (Advanced)", [3], 94, "Expands Devotion Experimenter with more reliable and productive experimentation.", "Devotion Experimenter"],
    ["Cultural Artifact", [2], 94, "Owns an object of cultural significance that lends authority and leverage.", ""],
    ["Enforcement", dots(1, 5), 94, "A progressive Style for enforcing Movement decisions through escalating physical pressure.", "Carthian Movement Status •; Resolve ••; Brawl ••"],
    ["Firebomber", [2], 95, "Uses fire as a revolutionary weapon while controlling panic and collateral risk.", "Athletics ••; Resolve •••"],
    ["Fire-Branded", [3], 96, "Endures and weaponizes the symbolism and terror of fire.", "Composure •••; Resilience ••"],
    ["I Know a Guy (Advanced)", [2], 96, "Once per chapter, rolls Intelligence + Manipulation + Contacts to obtain an available item or service through someone who owes a favor.", "Contacts ••; I Know a Guy"],
    ["Janus", [3], 96, "Maintains opposed political faces and loyalties without easily revealing the contradiction.", "Subterfuge ••"],
    ["Grassroots", dots(1, 3), 96, "Builds a mutual-aid network that supplies favors, resistance to coercion, and practical credit.", "Carthian Movement Status ••; Contacts •• or Allies ••"],
    ["Laissez-Faire Predator", [1], 96, "Feeds opportunistically from accessible vessels and rejects territorial ownership.", "Streetwise •• or Survival ••"],
    ["Poser", [1], 96, "Turns a shallow performance of rebellion into social advantage, but cannot coexist with Punk Rock.", "Cannot have Punk Rock"],
    ["Hobbyist Clique (Advanced)", [2], 96, "Strengthens a Hobbyist Clique through exceptional expertise in its chosen Skill.", "Hobbyist Clique; chosen Skill •••"],
    ["Punk Rock", [1], 97, "Rewards genuine rejection of authority, but cannot coexist with Poser.", "Cannot have Poser"],
    ["Strange Laws", [3], 97, "Adapts Carthian Law to unusual communities and supernatural social structures.", "Two dots in a Social Merit"],
    ["Rule of One", [3], 97, "Lets a self-reliant Firebrand stand alone against group pressure at a cost.", "Resolve •••"],
    ["Share and Share Alike", [4], 97, "Shares a Carthian Law's benefits with others while accepting part of their burden.", "Occult ••; one Carthian Law"],
    ["True Believer", [2], 97, "Makes ideological commitment a source of resolve and influence.", ""],
    ["Show the Belly", [2, 3], 97, "Uses deliberate submission to control the terms of a predatory confrontation.", "Composure •••"],
    ["Unflinching Eye", [1], 97, "Maintains focused observation under supernatural or political pressure.", "Acute Senses; Resolve •••"],
  ].map(([name, ratings, page, description, prerequisites]) => merit(FR, name, ratings, page, description, { category: "Carthian Movement", ...(prerequisites ? { prerequisites } : {}) })),

  ...[
    ["Beast of Law", 2, 99, "The character's Beast recognizes and responds to Carthian Law."],
    ["Breaking Bread", 3, 100, "A shared meal establishes supernatural hospitality and its consequences."],
    ["Birth Control", 3, 100, "Regulates the creation of new vampires within the Movement's jurisdiction."],
    ["Enforce Elysium", 3, 101, "Makes the peace of Elysium carry the supernatural force of Law."],
    ["I Do Not Recognize Your Authority", 2, 101, "Rejects an outside claimant's supernatural authority."],
    ["The Judas Gambit", 1, 101, "Turns a willing sacrifice or betrayal into legal leverage."],
    ["Full Transparency", 3, 101, "Compels disclosure and punishes concealed dealings under Carthian authority."],
    ["Private Property", 3, 102, "Makes a Haven and its boundaries legally and supernaturally protected."],
    ["Retroactive Continuity", 5, 102, "Rewrites the legal continuity of a prior event with permanent consequences."],
    ["Legal Guardian", 1, 102, "Places another vampire under the character's legal protection."],
    ["Parlay", 3, 102, "Creates protected space for negotiation under Carthian Law."],
    ["Rules of Engagement", 3, 103, "Defines and enforces lawful limits on violence."],
    ["Special Reserve", 1, 103, "Protects a designated feeding reserve through Lex Terrae."],
    ["Stake Your Claim", 1, 103, "Alerts the character when another vampire intrudes on claimed territory."],
    ["Working to Rule", 2, 103, "Turns strict compliance into organized resistance."],
    ["Those Responsible", 1, 103, "Makes leaders answer for the conduct of the institutions they control."],
  ].map(([name, rating, page, description]) => merit(FR, name, [rating], page, description, { category: "Carthian Law" })),

  errataMerit(AE, "Chorister", 107, "vtr-sotc:chorister", "Chorister", "Removes automatic access to Crúac and Circle Merits; Acolytes may still teach Crúac at their own risk.", { ratings: [2], prerequisites: "Not a member of the Circle of the Crone" }),
  errataMerit(AE, "Temple Guardian", 107, "vtr-sotc:temple-guardian", "Temple Guardian", "Enyo's Defense applies once per turn; Eris's Glory grants Inspired once per chapter and its Crúac bonuses last until sunrise.", { ratings: dots(1, 3) }),
  errataMerit(AE, "Viral Mythology", 107, "vtr-sotc:viral-mythology", "Viral Mythology", "Uses the revised Seed of Her Divinity Condition supplied by this source.", { ratings: [3] }),
  errataMerit(FR, "Army of One", 114, "vtr-sotc:army-of-one", "Army of One", "The rating measures one backup group's quality; it assists teamwork and creates the Carthian Backup Tilt in violence.", { ratings: dots(1, 5) }),
  errataMerit(FR, "All Roads Lead to Rome", 114, undefined, "Origin of Carthian Law", "Optional historical interpretation: Carthian Law may reconstruct powers of the Camarilla from Ancient Roman texts.", { catalogOnly: true }),
  errataMerit(FR, "Balancing Act", 114, undefined, "Optional Carthian Law framework", "Documents optional strengthening and limiting adjustments for the excluded improvised-Law framework.", { catalogOnly: true }),
  errataMerit(FR, "Smooth Criminal", 115, "vtr-sotc:smooth-criminal", "Smooth Criminal", "Applies in prepared debate or any setting where the character has a right to make a case; the Storyteller may continue the scene by granting full Willpower and an Experience.", { ratings: [2] }),
  errataMerit(FR, "Court Jester", 115, "vtr-sotc:court-jester", "Court Jester", "Treat Court Jester as a Carthian Law.", { ratings: [2], replacementCategory: "Carthian Law" }),
  errataMerit(FR, "Jack-Booted Thug", 115, "vtr-sotc:jack-booted-thug", "Jack-Booted Thug", "Only affects invested citizens in good standing, not outsiders or outlaws outside the domain's political structure.", { ratings: [2] }),
  errataMerit(FR, "Coda Against Sorcery", 115, "vtr-sotc:coda-against-sorcery", "Coda Against Sorcery", "For vampires, applies only to blood sorcery and associated rituals, not ordinary clan or bloodline Disciplines unless they are Ritual Disciplines.", { ratings: dots(1, 5) }),
  errataMerit(FR, "Mobilize Outrage", 115, "vtr-sotc:mobilize-outrage", "Mobilize Outrage", "Unbreakable must be declared before the combat turn and commits the next instant action to physical violence against the aggressor.", { ratings: dots(1, 3) }),
];

const coreMerits = [
  humanMerit(AE, "Mythologist", [2], 99, "Studies multiple mythic traditions deeply enough to identify patterns, symbols, and ritual correspondences.", "Mental", "Occult •• with two mythological Specialties"),
  humanMerit(AE, "Carousing", dots(1, 5), 99, "A progressive Social Style for starting, sustaining, and exploiting a party.", "Social Styles", "Presence •••; Socialize ••"),
  humanMerit(AE, "Poisoner's Garden", dots(1, 5), 99, "Cultivates increasingly dangerous toxic plants in a Safe Place.", "Mental", "Science or Survival •••; Safe Place •"),
  humanMerit(AE, "Roughing It", [2], 99, "Endures extended exposure and deprivation through practiced outdoor living.", "Physical", "Stamina •••; Survival •• with an outdoor Specialty"),
  humanMerit(FR, "Experimental Mindset", [1], 98, "Approaches uncertain problems through controlled experiments and learns from failed attempts.", "Mental"),
  humanMerit(FR, "The Fix Is In", [2], 98, "Uses advance preparation, influence, and resources to manipulate an election.", "Social", "Subterfuge ••; Larceny ••; Electioneer •"),
  humanMerit(FR, "Electioneer", dots(1, 5), 98, "A progressive Social Style for canvassing, advertising, negative campaigning, fundraising, and demanding a recount.", "Social Styles", "Politics ••; Resources •"),
  humanMerit(FR, "Flexible Loyalties", [3], 98, "Changes sides without surrendering all standing or credibility.", "Social"),
  humanMerit(FR, "Objection!", [2], 98, "Interrupts and redirects an argument through practiced rhetorical procedure.", "Social", "Expression ••"),
  humanMerit(FR, "Poll Watcher", [1], 99, "Spots irregularities, manipulation, and procedural problems in an election.", "Mental", "Wits •••; Politics ••"),
  humanMerit(FR, "Rabblerouser", [1], 99, "Mobilizes a crowd through provocative public speech.", "Social", "Inspiring; Expression ••"),
  humanMerit(FR, "Turnabout", [2], 99, "Reverses an opponent's rhetorical advantage during debate.", "Social"),
  humanMerit(FR, "Ratfucker", [1], 99, "Uses dirty tricks to disrupt a political opponent or campaign.", "Social"),
  humanMerit(FR, "You'll Be First Against the Wall", [1], 99, "Uses revolutionary menace to intimidate mundane targets more decisively.", "Social"),
  humanMerit(FR, "Rules Lawyer", dots(1, 5), 99, "A progressive Mental Style for exploiting literal wording, technical arguments, procedural delay, and repeated review.", "Mental Styles", "Resolve •••; Academics ••"),
];

const devotions = [
  devotion(AE, "Aura of the Crone", 86, "Majesty •••; Occult ••", 2, "Lets nearby blood sorcerers use the vampire's Majesty as ritual Potency, or increase equal Potency by one.", { cost: "2 Vitae", action: "Instant", duration: "Scene" }),
  devotion(AE, "Betrayal of Medea", 86, "Nightmare •; Obfuscate •••", 2, "While hidden, makes a touched scapegoat appear responsible for the vampire's suspicious actions.", { cost: "1 Vitae", action: "Reflexive", duration: "Scene" }),
  devotion(AE, "Bitch-Hammer", 86, "Vigor ••••", 2, "A bare-handed blow that exceeds the victim's Stamina prevents most Willpower expenditure.", { cost: "1 Willpower", action: "Reflexive", duration: "Hours equal to Blood Potency" }),
  devotion(AE, "Dance of the Swarm", 86, "Animalism •••", 1, "Questions a local insect swarm to map a neighborhood and improve navigation, searching, and danger detection.", { cost: "1 Vitae", dicePool: "Manipulation + Animal Ken + Animalism", action: "Instant" }),
  devotion(AE, "Folly of Theseus", 87, "Majesty ••• or Nightmare •••", 1, "Calls mortals within range toward the vampire with an irresistible sense of destiny.", { cost: "2 Vitae", dicePool: "Manipulation + Intimidation + Majesty or Nightmare", action: "Instant", duration: "Scene" }),
  devotion(AE, "Grounded Sorcery", 87, "Obfuscate •••; Resilience ••••", 3, "Contests an incoming Ritual Discipline and corrupts its effect even when it succeeds.", { cost: "1 Willpower", action: "Reflexive" }),
  devotion(AE, "Hekau", 87, "Auspex ••••", 2, "Reads the collective thoughts of a crowd to answer a scene-specific yes/no/maybe question.", { cost: "1 Willpower", dicePool: "Wits + Occult + Auspex", action: "Instant" }),
  devotion(AE, "Instrument of Blood", 87, "Obfuscate ••; Protean ••", 2, "Replaces a Predatory Aspect adaptation with a small flesh-and-bone tool of limited Availability.", { cost: "1 Vitae" }),
  devotion(AE, "Invigorating Draft", 88, "Celerity •; Resilience •; Vigor •", 2, "While feeding from a living victim, converts filled Health boxes into healing even when the blood provides no Vitae."),
  devotion(AE, "Lost in Hindsight", 88, "Auspex ••; Obfuscate •••", 3, "Warns of an unseen hostile observer and reflexively enables a known Obfuscate power.", { cost: "None or 1 Vitae", action: "Reflexive" }),
  devotion(AE, "Maiden's Innocence", 88, "Celerity •••••; Dominate ••", 3, "Rewrites the preceding scene so the vampire physically chose another plausible course, without undoing spent traits or Conditions.", { cost: "3 Vitae and 1 Willpower", dicePool: "Wits + Occult + Celerity", action: "Reflexive", duration: "Scene" }),
  devotion(AE, "Mark of Betrayal", 88, "Nightmare •••; Obfuscate ••", 2, "Marks a touched victim so others perceive a fearful or disgusting false narrative about him.", { cost: "1 Vitae", dicePool: "Manipulation + Subterfuge + Nightmare vs. Composure + Blood Potency", action: "Contested", duration: "Night" }),
  devotion(AE, "Mother's Dance", 89, "Celerity ••••", 2, "A defensive Celerity interruption used to Dodge or move no longer consumes the vampire's instant action.", { cost: "1 Willpower", action: "Reflexive" }),
  devotion(AE, "Raise the Witch's Familiar", 89, "Animalism ••; Obfuscate ••••", 3, "Enhances a corpse animated with Raise the Familiar, granting access to the vampire's Obfuscate and supernatural danger sense.", { cost: "2 Vitae", action: "Instant" }),
  devotion(AE, "Sharing the Familiar's Form", 89, "Animalism •; Protean •••", 2, "Memorizes an animal ghoul's shape without killing it and expands the forms available to Beast's Skin.", { duration: "Permanent" }),
  devotion(AE, "Soul Scab", 89, "Nightmare •••; Resilience •", 2, "Sacrifices part of the vampire's emotional self to resist the Crone's consuming influence.", { cost: "1 Willpower" }),
  devotion(AE, "Spiritual Journey", 89, "Auspex •••••; Dominate •••••", 5, "Projects a vampire subject's consciousness beyond the limits of the body.", { cost: "2 Vitae" }),
  devotion(AE, "Taweret's Protection", 90, "Dominate •••; Resilience ••", 2, "Protects a chosen subject with a ward carried in the Blood.", { cost: "1+ Vitae; optional 1 Willpower", action: "Instant", duration: "One week per Blood Potency dot", manualOnly: true }),
  devotion(AE, "Unshakable Advance", 90, "Resilience •••••", 3, "Keeps a war-Witch advancing through injury and supernatural opposition.", { cost: "1 Willpower" }),

  devotion(FR, "Blur", 88, "Obfuscate ••", 1, "Conceals a blood-bound human operative with the vampire's Obfuscate.", { cost: "2 Vitae", action: "Instant", duration: "Night" }),
  devotion(FR, "Almost Human", 88, "Obfuscate •; Protean ••", 2, "Extends the blush of life, appears human to supernatural senses, and offsets Social penalties with humans.", { action: "Instant", duration: "Night" }),
  devotion(FR, "Bluster", 88, "Obfuscate •••; Resilience ••", 3, "Prevents supernatural powers from uncovering the vampire's weaknesses.", { cost: "2 Vitae", action: "Instant", duration: "Scene" }),
  devotion(FR, "Apex Predator", 88, "Nightmare •• or Obfuscate ••; Vigor •", 1, "Draws predatory attention and blood-sympathy responses toward the vampire.", { action: "Reflexive", duration: "Night" }),
  devotion(FR, "Bullet Time", 89, "Celerity ••", 2, "Adds Celerity to Firearms attacks for the scene.", { cost: "1 Vitae", action: "Instant", duration: "Scene" }),
  devotion(FR, "Guardian Vigil", 89, "Auspex •; Celerity •", 1, "Makes ambush detection a rote action and rewards a failed ambush with a free Celerity effect.", { cost: "1 Vitae", action: "Instant", duration: "Scene" }),
  devotion(FR, "Death Mask", 89, "Protean ••; Resilience •", 3, "Feigns Final Death to natural and supernatural senses for a week.", { cost: "2 Vitae and 1 Willpower", action: "Reflexive", duration: "Week" }),
  devotion(FR, "Husk", 89, "Celerity •; Vigor •", 2, "Accelerates feeding dramatically, at the risk of leaving a conspicuous and potentially lethal wound."),
  devotion(FR, "Got My Back", 90, "Animalism •", 1, "Calls allied predators through the Beast when the vampire is threatened."),
  devotion(FR, "It's Who You Know", 90, "Auspex ••", 2, "Reads a subject's aliases, Contacts, Allies, and potentially damaging social connections."),
  devotion(FR, "Just Fucking Book It", 90, "Celerity •; Resilience • or Vigor •", 2, "Combines speed and endurance to escape a losing confrontation."),
  devotion(FR, "Knockout", 90, "Vigor ••", 1, "Drops a witness without leaving a corpse."),
  devotion(FR, "Last Man Standing", 91, "Celerity ••••; Resilience ••••", 4, "Removes cumulative Defense loss and permits one reflexive Dodge per turn while cornered.", { cost: "3 Vitae and 1 Willpower", action: "Instant", duration: "Scene" }),
  devotion(FR, "Mutation", 91, "Celerity ••; Resilience ••; Vigor ••", 4, "Redistributes dots among the three physical Disciplines for the scene.", { cost: "3 Vitae and 1 Willpower", action: "Instant", duration: "Scene" }),
  devotion(FR, "Lying Eyes", 91, "Majesty •; Obfuscate ••", 1, "Makes a sincerely believed statement supernaturally convincing and can impose Contrary on a doubter.", { cost: "1 Vitae" }),
  devotion(FR, "Operant Conditioning", 91, "Nightmare •••", 2, "Conditions a subject to react violently to a chosen trigger."),
  devotion(FR, "Power in a Union", 92, "Majesty •; Vigor ••", 2, "Strengthens physical teamwork and leaves the group coordinated for the rest of the night."),
  devotion(FR, "Trick Shot", 92, "Celerity •••; Quicken Sight", 2, "Executes an extraordinary Firearms maneuver before a target can retaliate.", { cost: "1 Vitae", action: "Reflexive", duration: "Turn" }),
  devotion(FR, "Uplift", 92, "Animalism ••; Dominate ••••", 4, "Feeds a revenant five Vitae to preserve Vitae through daysleep and temporarily grant further Kindred-like benefits.", { cost: "5 Vitae", action: "Instant", duration: "Nights equal to Blood Potency" }),
  devotion(FR, "Sawbones", 92, "Resilience •••••", 3, "Uses supernatural endurance to survive and repair otherwise catastrophic bodily harm.", { cost: "3 Vitae and 1 Willpower" }),
  devotion(FR, "Skulk", 92, "Obfuscate •••; Resilience ••", 3, "Bypasses passive supernatural effects that would alert their users to the vampire's intrusion."),
  devotion(FR, "Witch Hunt", 92, "Auspex ••", 2, "Examines an unknown supernatural being as a potential enemy and reveals useful weaknesses."),
];

const rites = [
  rite("Twisting the Id", 1, 100, 5, "Carves an unwanted mundane emotional or mental Condition into a subject for the night at the cost of lethal damage.", { duration: "Night" }),
  rite("Fires of Inspiration", 1, 100, 4, "Adds Potency to one later Crafts action before dawn.", { duration: "Night" }),
  rite("Witch's Locus", 1, 100, 9, "Enlivens a small home's spirit, producing occult signs and empowering the ritualist's senses within it.", { duration: "Night" }),
  rite("Mantle of the Predator's Eye", 1, 100, 4, "Grants Acute Senses and adds Crúac to Blood Potency for relevant predatory perception.", { duration: "Night" }),
  rite("Mark of the Praecursor", 1, 100, 10, "Wards a manor-sized area and marks those who spy into it.", { duration: "Month" }),
  rite("Barrier of Blood", 2, 101, 7, "Seals marked doors and windows as durable solid barriers; target successes are 7 + Potency.", { duration: "Month" }),
  rite("Painted Fears", 2, 101, 7, "Creates art that inflicts Spooked toward its depicted subject.", { duration: "Month" }),
  rite("Path of Thorns", 2, 101, 5, "Surrounds the ritualist with invisible brambles that inflict lethal damage when triggered.", { duration: "Night" }),
  rite("Rivers Run Dry", 2, 101, 11, "Curses a large house-sized area so water escapes, evaporates, or refuses storage.", { duration: "Month" }),
  rite("Succulent Buboes", 2, 101, 7, "Temporarily increases a subject's Vitae capacity, with grotesque physical signs.", { duration: "Month" }),
  rite("Bleeding the Tarantula", 3, 101, 6, "Grows a protective spider homunculus from the sleeping ritualist's flesh."),
  rite("Mantle of the Mother's Army", 3, 101, 6, "Synchronizes a ritual war party so participants can reflexively assist each other's actions; add one target success per participant.", { duration: "Night" }),
  rite("Soul Wisdom", 3, 102, 9, "Stores Willpower in a work of art and grants the ritualist future insight through it.", { duration: "Indefinite" }),
  rite("Spirit's Gambol", 3, 102, 10, "Invites an ephemeral being into the ritualist so it can aid the Beast during frenzy.", { duration: "Month" }),
  rite("Suborn the Outer Realms", 3, 102, 12, "Creates a lasting protective charm that binds aid from an ephemeral realm.", { duration: "Indefinite" }),
  rite("Blood Mask", 4, 102, 8, "Transforms the ritualist into the likeness of a bitten victim for several nights.", { duration: "One night per Crúac dot" }),
  rite("Brigid's Sacrifice", 4, 102, 9, "Drains Skills from a fed-upon victim in place of Vitae and lends them to the ritualist.", { duration: "Chapter" }),
  rite("Fount of Ma'at", 4, 103, 9, "Creates a source of divinatory truth and judgment through consecrated blood."),
  rite("Childe of Dis", 4, 103, 9, "Prepares the eyes of a crow or rat so its shadow serves as a Potency 1 Strix with Owl Eyes while the ritualist carries them.", { duration: "Month" }),
  rite("Idol of False Life", 4, 103, 10, "Builds a grisly false life that can act as a supernatural servant."),
  rite("Bounty of the False God", 5, 104, 10, "Calls down a false god's bounty with powerful benefits and dangerous consequences."),
  rite("Gift of Guabancex", 5, 104, 6, "Survives a storm-god's lightning strike to gain a separate pool of ritual Vitae.", { duration: "Indefinite" }),
  rite("Curse of the Circle", 5, 104, 15, "Lets multiple Acolytes combine disparate powers into a lasting curse on a sympathetic victim.", { contestedBy: "Composure + Blood Potency", duration: "Indefinite" }),
  rite("Walk the Depths", 5, 105, 13, "Carries the ritualist and companions instantly between two untouched, dark places.", { duration: "Night" }),
  rite("Your Goddess Listens", 5, 105, 17, "Marks a city with the ritualist's divine name, allowing her to hear prayers and answer one remotely with a Discipline.", { duration: "A year and a day" }),
];

const powerErrata = [
  { ...rite("Mantle of Amorous Fire — Errata", 1, 107, 4, "Grants the temporary Vice Amorous instead of a Presence bonus and removes the Willpower cost."), id: `${AE.sourceId}:errata:mantle-amorous-fire`, errataFor: "cruac-mantle-amorous-fire", errataForName: "Mantle of Amorous Fire", defaultDisabled: true },
  { ...rite("Pangs of Proserpina — Errata", 1, 107, 8, "May be prepared and applied to the victim later that night; the effect lasts one scene."), id: `${AE.sourceId}:errata:pangs-proserpina`, errataFor: "cruac-pangs-proserpina", errataForName: "Pangs of Proserpina", defaultDisabled: true, duration: "Scene" },
  { ...rite("Pool of Forbidden Truths — Errata", 1, 107, 4, "Potency sets the number of questions; the Storyteller defines the vision's subject and questions must address it."), id: `${AE.sourceId}:errata:pool-forbidden-truths`, errataFor: "cruac-pool-forbidden-truths", errataForName: "Pool of Forbidden Truths", defaultDisabled: true },
];

const conditions = [
  { id: `${FR.sourceId}:contrary`, name: "Contrary", originalName: "Contrary", category: "Vampire", description: "A false belief imposed through the Blood drives the character to contradict evidence and act on it.", persistent: true, resolution: "Find evidence that the supposed lie is true after all.", beat: "Cause disruption because of the false belief.", ...FR, sourceCode: FR.sourceId, page: 91, homebrew: true },
  { id: `${AE.sourceId}:errata:seed-of-her-divinity`, name: "Seed of Her Divinity — Errata", originalName: "Seed of Her Divinity", category: "Errata", description: "The vampire exceptionally succeeds on three successes instead of five on Social actions with the subject. The Condition fades after nights equal to Presence.", resolution: "Successfully share and spread the Acolyte's myth using Presence + Expression.", ...AE, sourceCode: AE.sourceId, page: 107, sourceId: AE.sourceId, homebrew: true, defaultDisabled: true, errataFor: "vtr-sotc:seed-of-her-divinity", errataForName: "Seed of Her Divinity" },
  { id: `${FR.sourceId}:errata:carthian-backup`, name: "Carthian Backup — Errata", originalName: "Carthian Backup", category: "Environmental Tilt", description: "A squad called by Army of One deals the Merit rating in lethal damage to the opposing side each turn; Willpower adds two. Its abstract Health is five plus the Merit rating and damage degrades or disperses it.", resolution: "The backup flees, is incapacitated, or is destroyed.", ...FR, sourceCode: FR.sourceId, page: 114, sourceId: FR.sourceId, homebrew: true, defaultDisabled: true, errataFor: "vtr-core:carthian-backup", errataForName: "Army of One backup rules" },
];

const covenants = [
  { id: "children-of-the-thorns", name: "Children of the Thorns", translatedName: "Children of the Thorns", advantage: "Treated as a Mystery Cult only; the Schism, Crypt/Egress system, Grave Attendant, Sacred Explorer, and Touched by Mary are excluded.", description: "A funerary Acolyte cult devoted to the mysteries beneath the earth.", group: "shadow-cult", ...AE, page: 113 },
  { id: "faithful-of-propylaia", name: "Faithful of Propylaia", translatedName: "Faithful of Propylaia", advantage: "Mystery Cult Initiation grants Tolerance for Biology; a Crafts (Butchery) or Occult (Offerings) Specialty; a Socialize or Subterfuge dot; Iron Will against doubt; and, at five dots, perception of the dead or free Arcane Sight for vampires.", description: "A Shadow Cult venerating the dead through sacrifice, thresholds, and the rites of Propylaia.", group: "shadow-cult", ...AE, page: 127 },
];

const files = {
  core: "public/data/core/merits/core.json",
  index: "public/data/core/merits/index.json",
  merits: "public/data/vampire/merits.json",
  powers: "public/data/vampire/powers.json",
  conditions: "public/data/vampire/conditions.json",
  covenants: "public/data/vampire/covenants.json",
  manifest: "public/data/manifest.json",
};

writeCompact(files.core, upsert(read(files.core), coreMerits));
const indexRows = coreMerits.map((item) => ({
  id: item.id, name: item.name, ratings: item.ratings, line: item.line, sourceId: item.sourceId, source: item.source,
  category: item.category, priority: item.priority, translatedName: item.translatedName, page: item.page, shard: "core",
}));
writeCompact(files.index, upsert(read(files.index), indexRows));
write(files.merits, upsert(read(files.merits), vampireMerits));
const powers = read(files.powers);
powers.devotions = upsert(powers.devotions, devotions);
powers.cruacRites = upsert(powers.cruacRites, [...rites, ...powerErrata]);
write(files.powers, powers);
write(files.conditions, upsert(read(files.conditions), conditions));
writeRows(files.covenants, upsert(read(files.covenants), covenants));

const manifest = read(files.manifest);
manifest.catalogVersion = Math.max(8, Number(manifest.catalogVersion));
for (const [id, version] of Object.entries({ "merits-core": 5, "merits-index": 5, "merits-vampire": 10, "vampire-powers": 10, "vampire-conditions": 6, "vampire-covenants": 5 })) {
  if (manifest.catalogs?.[id]) manifest.catalogs[id].version = Math.max(version, Number(manifest.catalogs[id].version));
}
writeManifest(files.manifest, manifest);
