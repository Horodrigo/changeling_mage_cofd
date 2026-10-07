import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const powers = read("public/game-lines/vampire/data/powers.json");
const selected = powers.disciplines.filter(item => item.presentationPt);
const rituals = powers.ritualDisciplines.filter(item => item.presentationPt);
const lashes = powers.lashes.filter(item => item.presentationPt);
const formulae = powers.kimiyaFormulae.filter(item => item.presentationPt);
const sacrileges = powers.therionSacrileges.filter(item => item.presentationPt);
const invocations = powers.gildedInvocations.filter(item => item.presentationPt);
const detournements = powers.detournements.filter(item => item.presentationPt);
const coils = powers.coils.filter(item => item.presentationPt);
const scales = powers.scales.filter(item => item.presentationPt);
const rites = powers.cruacRites.filter(item => item.presentationPt);
const miracles = powers.thebanMiracles.filter(item => item.presentationPt);
const devotions = powers.devotions.filter(item => item.presentationPt);
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const fields = ["summary", "cost", "requirement", "condition", "dicePool", "action", "duration", "contestedBy", "resistedBy", "sacrament", "effect", "procedure", "outcome", "prerequisites", "statusRequirement", "humanityCapFormula"];

test("Vampire official and Homebrew power presentations cover existing fields and preserve numeric limits", () => {
  assert.deepEqual(selected.map(item => item.id).sort(), ["animalism", "auspex", "blood-tether", "cachexy", "celerity", "crochan", "dead-signal", "dominate", "interface", "lithopedia", "majesty", "nightmare", "obfuscate", "ortam", "praestantia", "protean", "resilience", "spiritus-sancti", "surge", "triadic-evolution", "truths-of-erebus", "vigor", "vitiate"]);
  assert.equal(selected.flatMap(item => item.levels).length, 110);
  assert.deepEqual(rituals.map(item => item.id).sort(), ["cruac", "gilded-cage", "kimiya", "theban", "therion"]);
  assert.deepEqual(lashes.map(item => item.id).sort(), ["devotion-iron-joy", "devotion-shared-feast"]);
  assert.deepEqual(formulae.map(item => item.id).sort(), ["kimiya-al-ajsad", "kimiya-curse-monkey-prince", "kimiya-ebony-horse", "kimiya-sayihs-khol", "kimiya-spiders-hijra"]);
  assert.deepEqual(sacrileges.map(item => item.id).sort(), ["therion-apotheosis", "therion-avatar-apollyon", "therion-curse-faithful", "therion-demons-tongue", "therion-morning-star", "therion-nine-choirs", "therion-profanity"]);
  assert.equal(invocations.length, 10);
  assert.equal(detournements.length, 5);
  assert.deepEqual(devotions.map(item => item.id).sort(), ["devotion-body-of-will", "devotion-chain-of-command", "devotion-cloak-the-gathering", "devotion-conditioning", "devotion-cross-contamination", "devotion-cult-of-personality", "devotion-enchantment", "devotion-enfeebling-aura", "devotion-force-of-nature", "devotion-foul-grave", "devotion-gargoyles-vigilance", "devotion-hint-of-fear", "devotion-juggernauts-gait", "devotion-quicken-sight", "devotion-reasons-salon", "devotion-riot", "devotion-shared-sight", "devotion-shatter-the-shroud", "devotion-stalwart-servant", "devotion-subsume-lesser-beast", "devotion-summoning-dominate", "devotion-summoning-majesty", "devotion-suns-brutal-dreamscape", "devotion-the-wish", "devotion-touch-of-deprivation", "devotion-undying-familiar", "devotion-vermin-flood", "devotion-wet-dream", "devotion-wraiths-presence", "devotion-aerial-cocoon", "devotion-bend-space", "devotion-memetic-menace", "devotion-best-served-cold", "devotion-distant-control", "devotion-wrack-mind", "devotion-between-walls", "devotion-blood-scenting", "devotion-flush-out", "devotion-vile-blood", "devotion-give-take", "devotion-look", "devotion-one-got-away", "devotion-pledge", "devotion-infectious-bite", "devotion-plague-doctors-mask", "devotion-tiny-guardian", "devotion-ghost-skin", "devotion-pierce-veil", "devotion-seance", "devotion-water-hibernation", "devotion-not-so-special", "devotion-city-attunement", "devotion-incriminating-evidence", "devotion-sea-witch-gift", "devotion-malignant-smog", "devotion-unbridled-force", "devotion-bones-mountain", "devotion-celebrity", "devotion-crush-years", "devotion-legion", "devotion-shapeshifting", "devotion-flesh-form", "devotion-sirens-sweet-visage", "devotion-preternatural-instinct", "devotion-spontaneous-ignition", "devotion-kin-maker", "devotion-dead-mans-reprieve", "devotion-nightmare-journey", "h-vtr-agony-ecstasy:devotion:aura-of-the-crone", "h-vtr-agony-ecstasy:devotion:betrayal-of-medea", "h-vtr-agony-ecstasy:devotion:dance-of-the-swarm", "h-vtr-agony-ecstasy:devotion:hekau", "h-vtr-agony-ecstasy:devotion:bitch-hammer", "h-vtr-agony-ecstasy:devotion:folly-of-theseus", "h-vtr-agony-ecstasy:devotion:grounded-sorcery", "h-vtr-agony-ecstasy:devotion:instrument-of-blood", "h-vtr-agony-ecstasy:devotion:invigorating-draft", "h-vtr-agony-ecstasy:devotion:maiden-s-innocence", "h-vtr-agony-ecstasy:devotion:mark-of-betrayal", "h-vtr-agony-ecstasy:devotion:mother-s-dance", "h-vtr-agony-ecstasy:devotion:sharing-the-familiar-s-form", "h-vtr-agony-ecstasy:devotion:soul-scab", "h-vtr-agony-ecstasy:devotion:spiritual-journey", "h-vtr-agony-ecstasy:devotion:taweret-s-protection", "h-vtr-agony-ecstasy:devotion:unshakable-advance", "h-vtr-fire-revolution:devotion:blur", "h-vtr-fire-revolution:devotion:bluster", "h-vtr-fire-revolution:devotion:guardian-vigil", "h-vtr-fire-revolution:devotion:it-s-who-you-know", "h-vtr-fire-revolution:devotion:knockout", "h-vtr-fire-revolution:devotion:last-man-standing", "h-vtr-fire-revolution:devotion:mutation", "h-vtr-fire-revolution:devotion:sawbones", "h-vtr-fire-revolution:devotion:got-my-back", "h-vtr-fire-revolution:devotion:trick-shot", "h-vtr-fire-revolution:devotion:uplift", "devotion-drain", "devotion-haymaker", "devotion-hurts-so-good", "devotion-the-hook", "devotion-hysterical-strength", "devotion-instant-superstar", "devotion-kingfisher", "devotion-ring-the-bell", "devotion-snap-punch", "devotion-subliminal-message", "devotion-whisper-campaign", "devotion-bitter-blossom", "devotion-face-lift", "devotion-cursed-fiefdom", "devotion-silence-depths", "devotion-essence-vitale-absolue", "devotion-quicksilver-grace", "devotion-shadow-s-eyes", "devotion-tiger-musk", "devotion-authority-for-lords", "devotion-fond-absence", "devotion-haunt-s-spite", "devotion-serpent-s-enticement", "devotion-bold-statement", "devotion-marble-confidence", "devotion-savage-exemplar", "devotion-induce", "devotion-beautiful-but-deadly", "devotion-battering-ram", "devotion-body-of-steel", "devotion-brood-mother", "devotion-consume", "devotion-earthen-insight", "devotion-elastic-visage", "devotion-endow-familiar", "devotion-flesh-crafting", "devotion-forced-march", "devotion-gorge", "devotion-frog-prince", "devotion-graft", "devotion-inner-rage", "devotion-it-will-not-die", "devotion-regeneration", "devotion-sheeps-clothing", "devotion-bezoar-thorns", "devotion-wisdom-of-stones", "devotion-hunter-s-true-form", "devotion-chimera", "devotion-stone-specter", "devotion-fata-morgana", "devotion-song-of-myself", "devotion-siren-s-lure", "devotion-fated-strike", "devotion-paths-of-blood", "devotion-therian-excision", "devotion-blood-eye-gaze", "devotion-vessel-of-bone-and-blood", "devotion-barn-raising", "devotion-interloper", "devotion-christine", "devotion-scavenge", "devotion-bloom", "devotion-spore", "devotion-harvest", "devotion-sprout", "devotion-know-the-road", "devotion-wisdom-of-crowds", "devotion-flesh-sculpting", "devotion-love-bomb", "devotion-one-night-stand", "devotion-picture-perfect", "devotion-as-i-do", "devotion-potence", "devotion-speak-of-the-devil", "devotion-sense-the-sin", "devotion-tearstained-vision", "devotion-the-yawning-void", "devotion-taking-the-measure", "devotion-dressed-to-kill", "devotion-purification", "devotion-incite", "devotion-night-life", "devotion-kiss-of-death", "devotion-form-of-the-trickster", "devotion-borrowed-talent", "devotion-live-wire", "devotion-surgical-spark", "devotion-bones-of-the-manor", "devotion-steel-shadows", "devotion-spotless", "devotion-written-invitation", "devotion-aegis", "devotion-beast-avatar", "devotion-blink", "devotion-doctors-orders", "devotion-dissociate", "devotion-feet-of-stone", "devotion-hive-nexus-gestalt", "devotion-hounds-of-blood", "devotion-knight-s-example", "devotion-lord-of-beasts", "devotion-memory-palace", "devotion-soul-transfer", "devotion-treasured-servant", "devotion-messenger-s-blessing", "devotion-rope-a-dope", "devotion-rumor-of-dread", "devotion-the-message", "devotion-unseen-master", "devotion-voice-in-the-blood", "devotion-what-s-mine-is-mine", "devotion-body-colony", "devotion-dance-of-the-honeybee", "devotion-honeycomb-heart", "devotion-dream-casting", "devotion-spotlight", "devotion-talent-scout", "devotion-walk-it-off", "devotion-murmur", "h-vtr-agony-ecstasy:devotion:lost-in-hindsight", "h-vtr-agony-ecstasy:devotion:raise-the-witch-s-familiar", "devotion-annals-death", "devotion-consumption", "devotion-pass-yesteryear", "devotion-hold-together", "h-vtr-fire-revolution:devotion:almost-human", "h-vtr-fire-revolution:devotion:apex-predator", "h-vtr-fire-revolution:devotion:bullet-time", "h-vtr-fire-revolution:devotion:lying-eyes", "h-vtr-fire-revolution:devotion:operant-conditioning", "h-vtr-fire-revolution:devotion:power-in-a-union", "h-vtr-fire-revolution:devotion:death-mask", "h-vtr-fire-revolution:devotion:husk", "h-vtr-fire-revolution:devotion:just-fucking-book-it", "h-vtr-fire-revolution:devotion:skulk", "h-vtr-fire-revolution:devotion:witch-hunt", "devotion-our-mothers-mind", "devotion-null-space", "devotion-drowned-abyss", "devotion-ripples-still-water", "devotion-after-hours", "devotion-lockpicker-s-wrist", "devotion-work-fast-not-hard", "devotion-bad-trip", "devotion-everlasting-blood-doll", "devotion-sugar-rush", "devotion-sweet-tooth", "devotion-thinner", "devotion-dropping-the-act", "devotion-playing-the-role", "devotion-iron-dogma", "devotion-kingdom-of-heaven", "devotion-master-of-the-maze", "devotion-abundance-of-nyx", "devotion-denial-of-the-enemy", "devotion-heart-of-darkness", "devotion-bloody-good-flick", "devotion-death-by-cliche", "devotion-timeless-classic", "devotion-watch-party", "devotion-mission-from-the-gods", "devotion-brain-dead", "devotion-friend-to-foe", "devotion-gaslight", "devotion-gaze-of-the-abyss", "devotion-hell-beast", "devotion-iron-facade", "devotion-jump-scare", "devotion-living-nightmare", "devotion-mania", "devotion-mind-killer", "devotion-loathsome-foe", "devotion-no-one-hear-you-scream", "devotion-pied-piper", "devotion-rampage", "devotion-rising-tension", "devotion-sign-of-terror", "devotion-terrible-will", "devotion-this-awful-grip", "devotion-wicked-grasp", "devotion-wretched-bite", "devotion-brick", "devotion-reach-out-and-touch-someone", "devotion-catfish", "devotion-re-search"].sort());
  assert.equal(rites.length, 76);
  assert.equal(miracles.length, 32);
  assert.deepEqual(Object.fromEntries([...new Set(miracles.map(item => item.source))].map(source => [source, miracles.filter(item => item.source === source).length])), { "Better Feared: Nosferatu": 5, "Secrets of the Covenants": 14, "Vampire: The Requiem Second Edition": 9, "Thousand Years of Night": 3, "Dark Eras 2": 1 });
  assert.deepEqual(Object.fromEntries([...new Set(rites.map(item => item.source))].map(source => [source, rites.filter(item => item.source === source).length])), { "Agony & Ecstasy: Circle of the Crone": 28, "Better Feared: Nosferatu": 6, "Vampire: The Requiem Second Edition": 10, "Changeling: The Lost Second Edition — The Hedge": 1, "Night Horrors: Spilled Blood": 3, "Secrets of the Covenants": 14, "Strange Shades: Mekhet": 6, "Thousand Years of Night": 3, "Wild Hunt: Gangrel": 5 });
  assert.deepEqual(coils.map(item => item.id).sort(), ["coil-ascendant", "coil-quintessence", "coil-voivode", "coil-wyrm", "coil-zirnitra", "coil-ziva"]);
  assert.equal(coils.flatMap(item => item.levels).length, 30);
  assert.deepEqual(scales.map(item => item.id).sort(), powers.scales.map(item => item.id).sort());
  assert.equal(scales.length, 19);
  assert.deepEqual(Object.fromEntries([...new Set(scales.map(item => item.source))].map(source => [source, scales.filter(item => item.source === source).length])), {
    "Night Horrors: Spilled Blood": 4,
    "Secrets of the Covenants": 4,
    "Thousand Years of Night": 1,
    "Vampire: The Requiem Second Edition": 10,
  });
  for (const id of ["cruac-gwydions-curse", "theban-orison-voices", "theban-sins-ancestors"]) assert.equal([...rites, ...miracles].find(item => item.id === id).rating, 4, "The printed fourth-dot rituals retain their canonical IDs");
  const gwydion = rites.find(item => item.id === "cruac-gwydions-curse");
  assert.match(gwydion.effect, /damage bonus of 1 Bashing.*Durability 2/);
  assert.match(gwydion.presentationPt.effect, /bônus de dano contundente 1.*Durabilidade 2/);
  assert.match(miracles.find(item => item.id === "theban-sins-ancestors").sacrament, /At least 1 Vitae.*2 lethal Health levels/);
  const mark = rites.find(item => item.id.endsWith("rite:mark-of-the-praecursor"));
  assert.match(mark.effect, /end of the next session/);
  assert.match(mark.presentationPt.effect, /fim da próxima sessão/);
  const barrier = rites.find(item => item.id.endsWith("rite:barrier-of-blood"));
  assert.equal(barrier.page, 100);
  assert.match(barrier.effect, /wards against supernatural entry such as intangibly.*teleportation or magical portals require a Clash/);
  const tarantula = rites.find(item => item.id.endsWith("rite:bleeding-the-tarantula"));
  assert.equal(tarantula.duration, "Special");
  assert.match(tarantula.effect, /2 or 3 levels of Potency.*victim can only try once/);
  const clotho = rites.find(item => item.id === "cruac-clothos-skein");
  assert.equal(clotho.contestedBy, undefined);
  assert.equal(clotho.resistedBy, "Resolve + Blood Potency");
  assert.match(rites.find(item => item.id === "cruac-sanguine-augur").effect, /only one of these types of effect in the same evening, never both/);
  const bloodMask = rites.find(item => item.id.endsWith("rite:blood-mask"));
  assert.match(bloodMask.effect, /may change Size and Health.*not internal features like venom/);
  assert.match(bloodMask.presentationPt.effect, /pode alterar Tamanho e Vitalidade.*não características internas como veneno/);
  assert.match(rites.find(item => item.id.endsWith("rite:brigid-s-sacrifice")).summary, /Heal a living creature/);
  assert.equal(rites.find(item => item.id.endsWith("rite:fount-of-ma-at")).resistedBy, "Resolve");
  assert.equal(rites.find(item => item.id.endsWith("rite:childe-of-dis")).targetSuccesses, 10);
  assert.equal(rites.find(item => item.id.endsWith("rite:idol-of-false-life")).page, 104);
  assert.match(rites.find(item => item.id.endsWith("rite:your-goddess-listens")).effect, /living beings with any supernatural awareness/);
  assert.equal(devotions.find(item => item.id.endsWith("devotion:lost-in-hindsight")).action, "None");
  const witchFamiliar = devotions.find(item => item.id.endsWith("devotion:raise-the-witch-s-familiar"));
  assert.equal(witchFamiliar.duration, undefined);
  assert.match(witchFamiliar.effect, /Obfuscate dots.*Danger Sense.*\+2/);
  assert.equal(devotions.find(item => item.id.endsWith("devotion:mark-of-betrayal")).action, "Contested; resistance is reflexive");
  assert.equal(devotions.find(item => item.id === "devotion-annals-death").prerequisites, "Auspex •••");
  assert.match(devotions.find(item => item.id === "devotion-annals-death").requirement, /once per scene/);
  assert.equal(devotions.find(item => item.id === "devotion-consumption").cost, "5 Vitae + 1 Willpower");
  assert.match(devotions.find(item => item.id === "devotion-consumption").requirement, /Only mortals without Supernatural Tolerance/);
  assert.equal(devotions.find(item => item.id === "devotion-pass-yesteryear").cost, "3 Vitae + 1 Willpower");
  const holdTogether = devotions.find(item => item.id === "devotion-hold-together");
  assert.equal(holdTogether.page, 61);
  assert.equal(holdTogether.cost, "1 Vitae");
  assert.equal(holdTogether.dicePool, "Dexterity + Drive + Resilience");
  assert.equal(holdTogether.duration, "Scenes equal to successes");
  assert.equal(holdTogether.effect, undefined);
  assert.deepEqual(Object.keys(holdTogether.rollResults).sort(), ["dramaticFailure", "exceptionalSuccess", "failure", "success"]);
  assert.match(holdTogether.rollResults.success, /Resilience dots.*Durability.*moderate damage/);
  assert.equal(devotions.find(item => item.id.endsWith("devotion:almost-human")).action, "Reflexive");
  assert.equal(devotions.find(item => item.id.endsWith("devotion:apex-predator")).action, "Instant");
  assert.equal(devotions.find(item => item.id.endsWith("devotion:bullet-time")).cost, "2 Vitae");
  assert.equal(devotions.find(item => item.id.endsWith("devotion:got-my-back")).page, 89);
  assert.equal(devotions.find(item => item.id === "devotion-our-mothers-mind").page, 45);
  const drowned = devotions.find(item => item.id === "devotion-drowned-abyss");
  assert.equal(drowned.action, "None");
  assert.deepEqual(drowned.requiredDevotionIds, ["devotion-silence-depths"]);
  assert.ok(!drowned.effect.includes("Sides of a Bloody Coin"));
  assert.equal(devotions.find(item => item.id === "devotion-watch-party").experienceCost, 2);
  assert.equal(devotions.find(item => item.id === "devotion-mission-from-the-gods").experienceCost, 1);
  const deathByCliche = devotions.find(item => item.id === "devotion-death-by-cliche");
  assert.match(deathByCliche.effect, /Mental actions suffer −3.*Nightmare dots.*escaping.*another victim is killed.*injury/);
  assert.match(deathByCliche.presentationPt.effect, /Mentais sofrem −3.*Pesadelo.*escapar.*outra vítima.*lesão/);
  assert.match(devotions.find(item => item.id === "devotion-timeless-classic").summary, /injury.*torpor or Final Death/);
  for (const id of ["devotion-mania", "devotion-mind-killer", "devotion-loathsome-foe"]) assert.equal(devotions.find(item => item.id === id).action, "Contested; resistance is reflexive");
  assert.equal(devotions.find(item => item.id === "devotion-no-one-hear-you-scream").requirement, "The vampire must touch the victim.");
  const piper = devotions.find(item => item.id === "devotion-pied-piper");
  assert.equal(piper.bloodlineExclusive, false);
  assert.deepEqual(piper.experienceDiscounts, [{ bloodlineId: "candymen", cost: 0 }]);
  assert.equal(piper.duration, "Scene", "Duration continues on the next printed page");
  assert.deepEqual(devotions.find(item => item.id === "devotion-sign-of-terror").experienceDiscounts, [{ bloodlineId: "keepers-of-the-dark", cost: 3 }]);
  const rampage = devotions.find(item => item.id === "devotion-rampage");
  assert.match(rampage.effect, /even on a failure.*Humanity 1 and higher/);
  assert.ok(!rampage.rollResults.dramaticFailure.includes("breaking point"));
  assert.equal(devotions.find(item => item.id === "devotion-rising-tension").action, "Contested; resistance is reflexive");
  assert.match(devotions.find(item => item.id === "devotion-terrible-will").effect, /2 Experiences.*1.*Carthian teacher/);
  assert.match(devotions.find(item => item.id === "devotion-wretched-bite").effect, /2 Experiences.*1.*member of a Necropolis/);
  assert.match(devotions.find(item => item.id === "devotion-this-awful-grip").presentationPt.effect, /Briga ou Armas Brancas/);
  for (const id of ["devotion-catfish", "devotion-re-search"]) assert.equal(devotions.find(item => item.id === id).page, 23);
  assert.equal(devotions.find(item => item.id === "devotion-re-search").presentationPt.dicePool, "Presença + Computação + Auspícios");
  assert.match(devotions.find(item => item.id === "devotion-brick").presentationPt.effect, /incita a Fera/);
  const reach = devotions.find(item => item.id === "devotion-reach-out-and-touch-someone");
  assert.match(reach.effect, /^This renders the device non-functional/);
  assert.match(reach.presentationPt.effect, /aparelho inutilizável/);
  assert.equal(reach.requirement, "The victim must first use Digital Whispers on the device.", "Keep the printed actor without silently correcting the source");
  const brainDead = devotions.find(item => item.id === "devotion-brain-dead");
  assert.match(brainDead.requirement, /Delusional.*must be able to see the victim/);
  assert.match(brainDead.presentationPt.requirement, /Delirante.*deve conseguir vê-la/);
  const maze = devotions.find(item => item.id === "devotion-master-of-the-maze");
  assert.deepEqual(maze.requiredMerits, [{ definitionId: "vtr-better-feared:labyrinth", dots: 1 }]);
  assert.match(maze.effect, /above ground.*do not function during daylight hours/);
  assert.match(maze.presentationPt.effect, /acima do solo.*não funcionam durante o dia/);
  for (const [id, rank] of [["devotion-abundance-of-nyx", 2], ["devotion-denial-of-the-enemy", 1], ["devotion-heart-of-darkness", 5]]) {
    const lesson = devotions.find(item => item.id === id);
    assert.ok(lesson.prerequisites.startsWith("Truths of Erebus " + "•".repeat(rank) + " ("));
    assert.equal(lesson.experienceCost, undefined, "The source does not declare a learning cost");
  }
  const dropping = devotions.find(item => item.id === "devotion-dropping-the-act");
  assert.equal(dropping.experienceCost, 1);
  assert.equal(dropping.page, 36);
  assert.deepEqual(dropping.requiredDevotionIds, ["devotion-playing-the-role"]);
  const badTrip = devotions.find(item => item.id === "devotion-bad-trip");
  assert.ok(!badTrip.effect.includes("Content Warning"));
  assert.match(badTrip.effect, /Halve the victim’s Defense.*Drugged.*attack an ally/);
  const sweetTooth = devotions.find(item => item.id === "devotion-sweet-tooth");
  assert.equal(sweetTooth.experienceCost, 1);
  assert.equal(sweetTooth.page, 30);
  const thinner = devotions.find(item => item.id === "devotion-thinner");
  assert.equal(thinner.page, 30);
  assert.deepEqual(Object.keys(thinner.rollResults).sort(), ["dramaticFailure", "exceptionalSuccess", "failure", "success"]);
  assert.match(thinner.rollResults.success, /heals a point of lethal damage.*next sunrise/);
  assert.match(thinner.rollResults.dramaticFailure, /regains a point of Willpower.*immune.*rest of the night/);
  assert.match(thinner.presentationPt.rollResults.success, /cura um ponto de dano letal.*próximo nascer do sol/);
  assert.equal(devotions.find(item => item.id === "devotion-after-hours").page, 24);
  assert.ok(!devotions.find(item => item.id === "devotion-after-hours").effect.includes("Alternate Constructions"));
  assert.equal(devotions.find(item => item.id === "devotion-lockpicker-s-wrist").experienceCost, 1);
  assert.equal(devotions.find(item => item.id === "devotion-our-mothers-mind").dicePool, "Intelligence + Occult + Auspex vs. Blood Potency + Resolve");
  assert.match(devotions.find(item => item.id === "devotion-city-attunement").requirement, /10,000 inhabitants/);
  assert.match(devotions.find(item => item.id === "devotion-null-space").summary, /spend Willpower.*Beaten Down/);
  assert.match(devotions.find(item => item.id === "devotion-celebrity").effect, /inflicted Enthralled.*automatically succeeds.*may still roll.*failed result/);
  assert.match(devotions.find(item => item.id === "devotion-crush-years").requirement, /Blood Potency × 2.*less than one hundred.*Roll once.*separately/);
  assert.match(devotions.find(item => item.id === "devotion-frog-prince").dicePool, /\(if unwilling\)$/);
  for (const id of ["devotion-look", "devotion-give-take", "devotion-one-got-away", "devotion-pledge"]) {
    const siphon = devotions.find(item => item.id === id);
    assert.equal(siphon.bloodlineId, "liderc");
    assert.equal(siphon.page, id === "devotion-look" ? 27 : 28);
    assert.match(siphon.effect, /do not work on vampires or negate the Daeva clan bane.*Except for The Look.*one victim at a time/);
    assert.match(siphon.presentationPt.effect, /não afetam vampiros nem anulam.*Daeva.*Exceto O Olhar.*uma vítima por vez/);
  }
  assert.match(devotions.find(item => item.id === "devotion-seance").requirement, /presence of the ghost’s Anchor/);
  assert.match(devotions.find(item => item.id === "devotion-flesh-form").requirement, /victim of all blood.*devour the body/);
  const notSoSpecial = devotions.find(item => item.id === "devotion-not-so-special");
  assert.equal(notSoSpecial.cost, "1 Vitae per Discipline dot nullified");
  assert.match(notSoSpecial.requirement, /touch the victim.*unique clan Discipline.*cannot affect Animalism, Obfuscate or physical Disciplines/);
  const donning = rites.find(item => item.id === "cruac-donning-beasts-flesh");
  assert.equal(donning.cost, "1 Vitae");
  assert.equal(donning.action, "Three turns to transform");
  assert.equal(donning.duration, undefined);
  assert.match(rites.find(item => item.id === "cruac-mantle-amorous-fire").effect, /spends a point of Willpower to rise/);
  for (const id of ["cruac-mantle-amorous-fire", "cruac-mantle-beasts-breath", "cruac-mantle-glorious-dervish", "cruac-mantle-crone", "cruac-mantle-predator-goddess"]) assert.equal(rites.find(item => item.id === id).cost, "1 Willpower to rise after the dance");
  assert.match(rites.find(item => item.id === "cruac-curse-aphrodites-favor").requirement, /three separate nights/);
  assert.match(rites.find(item => item.id === "cruac-gorgons-gaze").effect, /one limb per success.*one aggravated damage.*five lethal damage.*until they heal a single level/);
  assert.match(rites.find(item => item.id === "cruac-bounty-storm").effect, /Cash equipment with Availability five.*Humanity 2 or lower/);
  assert.equal(miracles.find(item => item.id === "theban-apple-eden").sacrament, "An apple and a drop of Vitae");
  assert.match(miracles.find(item => item.id === "theban-apparition-host").effect, /target gains Frightened and mortal bystanders gain Spooked/);
  const icon = miracles.find(item => item.id === "theban-bloody-icon");
  assert.equal(icon.duration, "Until the end of the night");
  assert.match(icon.effect, /Later that night, the statue crumbles/);
  assert.equal(icon.effect.includes("nor Vinculum"), false);
  const pledge = miracles.find(item => item.id === "theban-pledge-worthless-one");
  assert.match(pledge.effect, /cannot maintain a Touchstone.*Retainer\(Ghoul\) •••••: three total dots of the regnant's Disciplines, not three additional dots/);
  assert.match(pledge.presentationPt.effect, /Lacaio \(Ghoul\) •••••: três pontos totais das Disciplinas do regente/);
  assert.equal(miracles.find(item => item.id === "theban-guiding-star").duration, "One night, extendable with Willpower");
  assert.match(miracles.find(item => item.id === "theban-apocalypse").effect, /initial radius is half a mile, increasing by half a mile for every five successes beyond the first ten/);
  assert.equal(miracles.find(item => item.id === "theban-apocalypse").effect.includes("Clash"), false);
  for (const level of selected.find(item => item.id === "lithopedia").levels) {
    assert.match(level.effect, /half a square mile.*another half mile per Potency/);
    assert.match(level.presentationPt.effect, /meia milha quadrada.*outra meia milha por Potência/);
  }
  assert.equal(JSON.stringify(powers).includes("Potência do Sangue"), false, "Approved Blood Potency terminology remains uniform");
  assert.equal(devotions.find(item => item.id === "devotion-know-the-road").experienceCost, 1);
  const aegis = devotions.find(item => item.id === "devotion-aegis");
  assert.match(aegis.effect, /Once per scene.*single source.*save sunlight.*cannot be combined/);
  assert.match(aegis.presentationPt.effect, /Uma vez por cena.*única fonte.*exceto luz solar.*não pode ser combinada/);
  const avatar = devotions.find(item => item.id === "devotion-beast-avatar");
  assert.match(avatar.effect, /^A vampire can only have one uplifted ghoul at a time\./);
  assert.match(avatar.presentationPt.effect, /^Um vampiro só pode ter um ghoul elevado por vez\./);
  const blink = devotions.find(item => item.id === "devotion-blink");
  assert.match(blink.presentationPt.rollResults.success, /uma ou duas palavras.*sem precisar de contato visual.*uma vez por cena/);
  assert.match(blink.presentationPt.rollResults.dramaticFailure, /imune a Dominação pelo resto da cena/);
  const hive = devotions.find(item => item.id === "devotion-hive-nexus-gestalt");
  assert.equal(hive.cost, "1 Willpower per character and 1 Vitae per night");
  assert.equal(hive.dicePool, "None");
  assert.equal(hive.duration, "One night per Vitae spent at activation");
  assert.equal(hive.rollResults, undefined, "False Gods p. 107's hive mind has no Knight's Example activation results");
  assert.match(hive.effect, /collective Intelligences.*highest Skill in the group.*Willpower is pooled.*second step blood bond/);
  assert.equal(hive.effect.includes("The Knight’s Example"), false);
  assert.equal(hive.presentationPt.effect.includes("O Exemplo do Cavaleiro"), false);
  const hounds = devotions.find(item => item.id === "devotion-hounds-of-blood");
  assert.equal(hounds.page, 107);
  assert.match(hounds.effect, /store Vitae equal to its Stamina.*cannot spend this Vitae.*does not inflict damage/);
  const soul = devotions.find(item => item.id === "devotion-soul-transfer");
  const treasured = devotions.find(item => item.id === "devotion-treasured-servant");
  assert.equal(soul.cost, "1 Vitae");
  assert.equal(soul.action, "None");
  assert.equal(soul.duration, "As with Possession");
  assert.equal(soul.requirement, undefined, "Possession does not require the subject to be a ghoul");
  assert.match(soul.effect, /possessed subject’s soul to her own body.*cannot return to his body/);
  assert.equal(soul.effect.includes("damage dealt to their ghoul"), false);
  assert.equal(treasured.experienceCost, 1);
  assert.equal(treasured.prerequisites, "Resilience ••");
  assert.equal(treasured.cost, "None");
  assert.equal(treasured.action, "Reflexive");
  assert.equal(treasured.requirement, "The subject must be the vampire’s ghoul.");
  assert.match(treasured.effect, /Health boxes.*Blood Potency per scene.*any distance.*won’t know the source, amount, or type/);
  const crowds = devotions.find(item => item.id === "devotion-wisdom-of-crowds");
  assert.equal(crowds.experienceCost, 2);
  assert.equal(crowds.bloodlineId, "wickers");
  assert.equal(crowds.page, 67);
  assert.match(crowds.requirement, /form of a swarm/);
  assert.match(crowds.effect, /reflexive action.*additional free uses.*equal to her Protean dots/);
  const despond = ["devotion-bitter-blossom", "devotion-sense-the-sin", "devotion-tearstained-vision", "devotion-the-yawning-void"].map(id => devotions.find(item => item.id === id));
  assert.equal(despond[0].suggestedModifiers.length, 7);
  for (const definition of despond) assert.deepEqual(definition.suggestedModifiers, despond[0].suggestedModifiers);
  assert.equal(despond[1].rollResults.exceptionalSuccess.includes("Situation Modifier"), false);
  assert.match(despond[0].presentationPt.dicePool, /Compostura/);
  const zirnitra = coils.find(item => item.id === "coil-zirnitra");
  assert.match(zirnitra.levels[1].effect, /Drawbacks do not always occur/);
  assert.match(zirnitra.levels[2].effect, /Supernatural Merits cost one Experience less, to a minimum of one; already-owned Supernatural Merits refund one Experience each/);
  for (const [id, page] of [["gilded-crowdsourcing", 137], ["gilded-green-light", 137], ["gilded-cordon", 138], ["gilded-gerrymandering", 138]]) assert.equal(invocations.find(item => item.id === id).page, page);
  const therion = rituals.find(item => item.id === "therion");
  assert.match(therion.effect, /^If Humanity is higher than the Sacrilege rating/);
  assert.equal(therion.minimumHumanityToCast, undefined);
  assert.match(rituals.find(item => item.id === "gilded-cage").effect, /in a Convergence, ritual rolls achieve exceptional success with three successes instead of five/);
  for (const definition of [...selected, ...rituals, ...lashes, ...formulae, ...sacrileges, ...invocations, ...detournements, ...coils, ...scales, ...rites, ...miracles, ...devotions]) {
    for (const item of [definition, ...(definition.levels ?? [])]) {
      assert.ok(item.presentationPt, `${definition.id}.${item.rating ?? "summary"}`);
      for (const field of fields.filter(key => item[key])) {
        assert.ok(item.presentationPt[field]?.trim(), `${definition.id}.${item.rating ?? "summary"}.${field}`);
        assert.deepEqual(item.presentationPt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? []);
        assert.deepEqual(item.presentationPt[field].match(/•+/g) ?? [], item[field].match(/•+/g) ?? [], `${definition.id}.${field}: preserve dot ratings`);
      }
      assert.deepEqual(Object.keys(item.presentationPt.rollResults ?? {}).sort(), Object.keys(item.rollResults ?? {}).sort());
      for (const [result, text] of Object.entries(item.rollResults ?? {})) {
        assert.ok(item.presentationPt.rollResults[result]?.trim());
        assert.deepEqual(item.presentationPt.rollResults[result].match(/\d+/g) ?? [], text.match(/\d+/g) ?? []);
      }
      assert.equal(item.presentationPt.suggestedModifiers?.length ?? 0, item.suggestedModifiers?.length ?? 0);
      for (const [index, modifier] of (item.suggestedModifiers ?? []).entries()) {
        const translated = item.presentationPt.suggestedModifiers[index];
        assert.equal(translated.modifier, modifier.modifier.replaceAll(" to ", " a "));
        assert.ok(translated.situation.trim());
        assert.deepEqual(translated.situation.match(/\d+/g) ?? [], modifier.situation.match(/\d+/g) ?? []);
      }
    }
  }
  assert.equal(selected.find(item => item.id === "truths-of-erebus").translatedName, "Verdades de Erebus");
  const liveWire = devotions.find(item => item.id === "devotion-live-wire");
  assert.match(liveWire.requirement, /one full turn.*grappling.*Feed move/);
  assert.match(liveWire.presentationPt.requirement, /turno inteiro.*agarrá-la.*Alimentar/);
  assert.match(selected.find(item => item.id === "animalism").levels[0].presentationPt.dicePool, /Empatia com Animais/);
});

test("Vampire creation, XP, Desktop/Mobile cards and Homebrew render EN/PT/EN without changing purchases or canonical parser inputs", async () => {
  const dataBefore = JSON.stringify(powers);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "power-locale-test-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/app/use-homebrew.ts")) return 'let preferences = { disabledIds: [] }; export const useHomebrewPreferences = () => preferences; export const setTestHomebrewPreferences = value => { preferences = value; };';
      if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { DisciplineCards, RitualDisciplines, PurchasedPowers };`;
      if (path.endsWith("/game-lines/vampire/experience-panel.tsx")) return ("export let testBuy, testRevert;\n" + code).replace('useState<PurchaseType>("attribute")', 'useState<PurchaseType>(character.character.concept === "devotion-test" ? "devotion" : character.character.concept === "rite-test" ? "rite" : character.character.concept === "sacrilege-test" ? "sacrilege" : character.character.concept === "miracle-test" ? "miracle" : character.character.concept === "lash-test" ? "lash" : character.character.concept === "formula-test" ? "formula" : character.character.concept === "invocation-test" ? "invocation" : character.character.concept === "detournement-test" ? "detournement" : character.character.concept === "scale-test" ? "scale" : "discipline")').replace('const [target, setTarget] = useState("");', 'const [target, setTarget] = useState(character.character.concept === "therion-upgrade-test" ? "therion" : character.character.concept === "devotion-test" ? character.character.name : "");') .replace('useState<{ powerId: string; confirmationId: string } | null>(null)', 'useState<{ powerId: string; confirmationId: string } | null>(character.character.player ? { powerId: character.character.chronicle || character.character.name, confirmationId: character.character.player } : null)').replace("  return <", "  testBuy = buy; testRevert = revert;\n  return <");
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
      if (path.endsWith("/components/ui/select.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Select, Wrapper as SelectContent, Wrapper as SelectGroup, Wrapper as SelectItem, Wrapper as SelectLabel, Wrapper as SelectSeparator, Wrapper as SelectTrigger, Wrapper as SelectValue };';
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampirePowersCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/powers.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requests = [];
      const catalog = freezeCatalogData(await vampirePowersCatalogGroup.load({ getCatalog: async id => { requests.push(id); return powers; } }));
      assert.deepEqual(requests, ["vampire-powers"]);
      const { vampirePowerPresentation } = await vite.ssrLoadModule("/game-lines/vampire/power-presentation.ts");
      const { vampireHomebrewSourceId, activeVampirePowers } = await vite.ssrLoadModule("/game-lines/vampire/homebrew-catalog.ts");
      const { setTestHomebrewPreferences } = await vite.ssrLoadModule("/app/use-homebrew.ts");
      const { vampireDisciplinePrerequisitesMet, synchronizeAutomaticBloodlineDevotions, vampireDevotionAvailable, vampireDevotionExperienceCost } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
      const { vampireExperienceLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
      const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
      const experienceModule = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
      const { VampireExperiencePanel } = experienceModule;
      const { DisciplineCards, RitualDisciplines, PurchasedPowers } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { vampireBuilder } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const { normalizeVampireCatalogHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/catalog-homebrews.ts");
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, read(`public/game-lines/vampire/data/${group}.json`)]));
      const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
      const vampireMeritCatalog = withMeritPresentation(read("public/game-lines/vampire/data/merits.json").filter(item => ["vtr-kindred-status", "vtr-haven", "vtr-swarm-form", "vtr-better-feared:labyrinth"].includes(item.id)), read("public/game-lines/vampire/data/merits-pt.json"));
      const coreCultCatalog = withMeritPresentation(read("public/shared/data/merits.json").filter(item => item.id === "core-2ed:mystery-cult-initiation"), read("public/shared/data/merits-pt.json"));
      const catalogs = { get: id => ({ "vampire-powers": catalog, "vampire-reference": reference, "core-merits": coreCultCatalog, "vampire-merits": vampireMeritCatalog, "vampire-conditions": [] })[id] };
      const backgrounds = [
        ...[...new Set(selected.map(item => item.bloodlineId).filter(Boolean))].map(bloodlineId => ({ bloodlineId, clanId: reference.bloodlines.find(item => item.id === bloodlineId).parentClanIds[0] })),
        ...[...new Set(selected.flatMap(item => item.clanIds ?? []))].map(clanId => ({ clanId, bloodlineId: "" })),
        ...[...new Set(selected.flatMap(item => item.covenantIds ?? []))].map(covenantId => ({ clanId: "gangrel", bloodlineId: "", covenantIds: [covenantId] })),
      ];
      const characters = backgrounds.map(({ bloodlineId, clanId, covenantIds = [] }) => {
        const character = blankPrintCharacter("VtR");
        const ratings = Object.fromEntries(selected.filter(item => (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.clanIds || item.clanIds.includes(clanId)) && (!item.covenantIds || item.covenantIds.some(id => covenantIds.includes(id)))).map(item => [item.name, 5]));
        character.line_data = { ...character.line_data, clan_id: clanId, bloodline_id: bloodlineId, covenant_ids: covenantIds, disciplines: ratings, notes: "Authored English stays." };
        character.current_state = { ...character.current_state, experience_available: 4, experience_spent: 9, creation_draft: true, creation_draft_step: 3 };
        return character;
      });
      const charactersBefore = JSON.stringify(characters);
      const noMutation = () => { throw new Error("Render changed the saved character"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const { BloodlinePage, BloodlineJoinDialog } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
      const xiao = blankPrintCharacter("VtR");
      xiao.line_data = { ...xiao.line_data, clan_id: "daeva", bloodline_id: "xiao", blood_potency: 6, xiao_faction: "apostates" };
      const xiaoBefore = JSON.stringify(xiao);
      const xiaoReference = { ...reference, bloodlines: reference.bloodlines.filter(item => item.id === "xiao") };
      for (const html of [render(BloodlinePage, { character: xiao, updateSheet: noMutation, bloodlines: reference.bloodlines, powers: catalog, onRemoved: noMutation }), render(BloodlineJoinDialog, { character: xiao, updateSheet: noMutation, reference: xiaoReference, powers: catalog, open: true, onOpenChange: noMutation, onJoined: noMutation })]) {
        for (const key of ["xiaoFaction", "xiaoApostates", "xiaoAscended", "xiaoFactionUnknown", "xiaoFactionBenefit"]) assert.ok(html.includes(escape(translate(locale, `ui.${key}`))), `${locale}: Xiao faction control ${key}`);
      }
      assert.equal(JSON.stringify(xiao), xiaoBefore);
      const sheet = characters.map(character => render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: character.line_data.disciplines, coilRatings: {}, locale, onRaiseFamiliar: noMutation })).join("");
      const partial = characters.map(character => render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: Object.fromEntries(Object.keys(character.line_data.disciplines).map(name => [name, 3])), coilRatings: {}, locale, onRaiseFamiliar: noMutation })).join("");
      const experience = characters.map(character => render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true })).join("");
      const creation = characters.map(character => render(vampireBuilder.Component, { player: "Player", initial: character, onCancel: noMutation, onSave: noMutation, onSaveDraft: noMutation, catalogs })).join("");
      const homebrew = render(vampireHomebrew.Component, { catalogs });
      for (const definition of catalog.disciplines.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.id, definition.id);
        assert.ok(Object.isFrozen(definition.presentationPt));
        if (locale === "en-US") assert.equal(presented, definition);
        for (const field of fields.filter(key => presented[key])) {
          for (const html of [sheet, experience]) assert.ok(html.includes(escape(presented[field])), `${locale}: ${definition.id}.${field}`);
        }
        if (!definition.bloodlineId) assert.ok(creation.includes(escape(locale === "pt-BR" ? definition.translatedName : definition.name)));
        const homebrewDefinition = vampireHomebrewSourceId(definition)?.startsWith("h-");
        if (homebrewDefinition) {
          for (const field of fields.filter(key => presented[key])) assert.ok(homebrew.includes(escape(presented[field])), `${locale}: ${definition.id}.${field} Homebrew`);
        }
        for (const level of definition.levels) {
          const text = vampirePowerPresentation(level, locale);
          for (const field of fields.filter(key => text[key])) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(text[field])), `${locale}: ${definition.id}.${level.rating}.${field}`);
            if (homebrewDefinition) assert.ok(homebrew.includes(escape(text[field])), `${locale}: ${definition.id}.${level.rating}.${field} Homebrew`);
          }
          for (const result of Object.values(text.rollResults ?? {})) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(result)));
            if (homebrewDefinition) assert.ok(homebrew.includes(escape(result)));
          }
          for (const modifier of text.suggestedModifiers ?? []) {
            for (const html of [sheet, experience, ...(homebrewDefinition ? [homebrew] : [])]) {
              assert.ok(html.includes(escape(modifier.modifier)));
              assert.ok(html.includes(escape(modifier.situation)));
            }
          }
          const title = `<strong>${"•".repeat(level.rating)} ${escape(locale === "pt-BR" ? level.translatedName : level.name)}</strong>`;
          assert.ok(sheet.includes(title));
          assert.equal(partial.includes(title), level.rating <= 3);
          if (level.targetSuccesses !== undefined) {
            assert.equal(text.targetSuccesses, level.targetSuccesses);
            const label = locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes";
            const detail = sheet.slice(sheet.indexOf(title), sheet.indexOf("</details>", sheet.indexOf(title)));
            assert.ok(detail.includes(`<strong>${label}:</strong> ${level.targetSuccesses}`));
            assert.ok(experience.includes(`${label}: ${level.targetSuccesses}`));
          }
        }
        const character = characters.find(item => item.line_data.disciplines[definition.name]);
        assert.equal(vampireDisciplinePrerequisitesMet(`${definition.name} 5`, character.line_data.disciplines, catalog.disciplines.map(item => item.name)), true);
        const receipt = { id: "old-purchase", label: "Original label", rating: 5, cost: 4, undo: { kind: "discipline", name: definition.name, amount: 1 } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, [], catalog, locale), `${locale === "pt-BR" ? definition.translatedName : definition.name} 5`);
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const affiliations = { cruac: "circle-of-the-crone", theban: "lancea-et-sanctum", kimiya: "jaliniyya", therion: "tenth-choir", "gilded-cage": "architects-of-the-monolith" };
      const ritualCharacters = Object.fromEntries(rituals.map(definition => {
        const character = blankPrintCharacter("VtR");
        const ratingKey = `${definition.id.replaceAll("-", "_")}_rating`;
        character.merits = [{ definitionId: "vtr-kindred-status", instanceId: `status-${definition.id}`, name: "Kindred Status", dots: 1, creationDots: 1, configuration: { group: affiliations[definition.id] } }];
        character.line_data = { ...character.line_data, clan_id: "gangrel", covenant_ids: [affiliations[definition.id]], blood_sorcery: { [ratingKey]: 5 }, notes: "Authored ritual notes stay." };
        character.current_state = { ...character.current_state, experience_available: 4, experience_spent: 9, creation_draft: true, creation_draft_step: 3 };
        return [definition.id, character];
      }));
      const ritualCharactersBefore = JSON.stringify(ritualCharacters);
      for (const definition of catalog.ritualDisciplines.filter(item => item.presentationPt)) {
        const character = ritualCharacters[definition.id];
        const presented = vampirePowerPresentation(definition, locale);
        const ritualSheet = render(RitualDisciplines, { powers: catalog, bloodSorcery: character.line_data.blood_sorcery, locale });
        const ritualExperience = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        const surfaces = [ritualSheet, ritualExperience, ...(vampireHomebrewSourceId(definition)?.startsWith("h-") ? [homebrew] : [])];
        for (const field of fields.filter(key => presented[key])) {
          for (const html of surfaces) assert.ok(html.includes(escape(presented[field])), `${locale}: ritual ${definition.id}.${field}`);
        }
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of surfaces) assert.ok(html.includes(escape(result)));
        for (const modifier of presented.suggestedModifiers ?? []) for (const html of surfaces) {
          assert.ok(html.includes(escape(modifier.modifier)));
          assert.ok(html.includes(escape(modifier.situation)));
        }
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of surfaces) assert.ok(html.includes(escape(title)));
        const undo = ["cruac", "theban"].includes(definition.id) ? { kind: definition.id, amount: 1 } : { kind: "bloodSorcery", ratingKey: `${definition.id.replaceAll("-", "_")}_rating`, amount: 1 };
        const receipt = { id: "old-ritual-purchase", label: "Original ritual label", rating: 5, cost: 4, undo };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, vampireMeritCatalog, catalog, locale), `${title} 5`);
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      // Dark Eras 2 p. 344: Humanity triggers detachment, never a Sacrilege purchase cap.
      for (const humanity of [0, 1, 3, 7]) {
        const character = structuredClone(ritualCharacters.therion);
        character.character.concept = "sacrilege-test";
        character.line_data.humanity = humanity;
        const html = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        for (const sacrilege of catalog.therionSacrileges) assert.ok(html.includes(escape(locale === "pt-BR" ? sacrilege.translatedName : sacrilege.name)), `Therion Humanity ${humanity}: ${sacrilege.id}`);
        character.character.concept = "therion-upgrade-test";
        character.line_data.blood_sorcery.therion_rating = 4;
        const upgrade = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        for (const sacrilege of catalog.therionSacrileges) assert.ok(upgrade.includes(escape(locale === "pt-BR" ? sacrilege.translatedName : sacrilege.name)), `Therion free ritual Humanity ${humanity}: ${sacrilege.id}`);
      }
      const thebanCharacter = structuredClone(ritualCharacters.theban);
      thebanCharacter.character.concept = "miracle-test";
      thebanCharacter.line_data.humanity = 1;
      const miraclePicker = render(VampireExperiencePanel, { character: thebanCharacter, updateSheet: noMutation, catalogs, builderMode: true });
      for (const miracle of catalog.thebanMiracles.filter(item => item.source === "Vampire: The Requiem Second Edition")) assert.equal(miraclePicker.includes(escape(locale === "pt-BR" ? miracle.translatedName : miracle.name)), miracle.rating <= 1);
      assert.equal(render(RitualDisciplines, { powers: catalog, bloodSorcery: {}, locale }), "");
      assert.equal(JSON.stringify(ritualCharacters), ritualCharactersBefore);
      const lashCharacter = structuredClone(characters.find(item => item.line_data.bloodline_id === "adrestoi"));
      lashCharacter.line_data.lash_ids = lashes.map(item => item.id);
      const lashCharacterBefore = JSON.stringify(lashCharacter);
      const lashSheet = render(DisciplineCards, { character: lashCharacter, updateSheet: noMutation, powers: catalog, disciplines: lashCharacter.line_data.disciplines, coilRatings: {}, locale, onRaiseFamiliar: noMutation });
      const lashBuyer = structuredClone(lashCharacter);
      lashBuyer.character.concept = "lash-test";
      lashBuyer.line_data.lash_ids = [];
      const lashBuyerBefore = JSON.stringify(lashBuyer);
      const lashExperience = render(VampireExperiencePanel, { character: lashBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.lashes) {
        const presented = vampirePowerPresentation(definition, locale);
        for (const field of fields.filter(key => presented[key])) for (const html of [lashSheet, lashExperience, homebrew]) assert.ok(html.includes(escape(presented[field])), `${locale}: lash ${definition.id}.${field}`);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of [lashSheet, lashExperience, homebrew]) assert.ok(html.includes(escape(title)));
        assert.equal(sheet.includes(`<strong>${escape(title)}</strong>`), false, "Unowned Lash stays off the sheet");
        const receipt = { id: "old-lash-purchase", label: "Authored old label", cost: 1, undo: { kind: "lash", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, lashCharacter, [], catalog, locale), title);
        const refunded = structuredClone(lashCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.lash_ids, lashes.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(lashCharacter), lashCharacterBefore);
      assert.equal(JSON.stringify(lashBuyer), lashBuyerBefore);
      for (const [ritualId, group, purchase, idsKey] of [["theban", "thebanMiracles", "miracle", "theban_miracle_ids"], ["cruac", "cruacRites", "rite", "cruac_rite_ids"], ["kimiya", "kimiyaFormulae", "formula", "kimiya_formula_ids"], ["therion", "therionSacrileges", "sacrilege", "therion_sacrilege_ids"], ["gilded-cage", "gildedInvocations", "invocation", "gilded_invocation_ids"]]) {
        const definitions = catalog[group].filter(item => item.presentationPt && !item.errataFor);
        const ritualCharacter = structuredClone(ritualCharacters[ritualId]);
        ritualCharacter.line_data.blood_sorcery[idsKey] = definitions.map(item => item.id);
        const ritualCharacterBefore = JSON.stringify(ritualCharacter);
        const ritualSheet = render(RitualDisciplines, { powers: catalog, bloodSorcery: ritualCharacter.line_data.blood_sorcery, locale });
        const ritualBuyer = structuredClone(ritualCharacter);
        ritualBuyer.character.concept = `${purchase}-test`;
        ritualBuyer.line_data.blood_sorcery[idsKey] = [];
        const ritualBuyerBefore = JSON.stringify(ritualBuyer);
        const generalRitualExperience = render(VampireExperiencePanel, { character: ritualBuyer, updateSheet: noMutation, catalogs });
        const covenantExperiences = new Map();
        for (const covenantId of new Set(definitions.flatMap(item => item.covenantIds ?? []))) {
          const covenantBuyer = structuredClone(ritualBuyer);
          covenantBuyer.line_data.covenant_ids = [...covenantBuyer.line_data.covenant_ids, covenantId];
          const covenantBuyerBefore = JSON.stringify(covenantBuyer);
          covenantExperiences.set(covenantId, render(VampireExperiencePanel, { character: covenantBuyer, updateSheet: noMutation, catalogs }));
          assert.equal(JSON.stringify(covenantBuyer), covenantBuyerBefore);
        }
        const bloodlineExperiences = new Map();
        for (const bloodlineId of new Set(definitions.map(item => item.bloodlineId).filter(Boolean))) {
          const bloodlineBuyer = structuredClone(ritualBuyer);
          bloodlineBuyer.line_data.bloodline_id = bloodlineId;
          bloodlineBuyer.line_data.clan_id = reference.bloodlines.find(item => item.id === bloodlineId).parentClanIds[0];
          const bloodlineBuyerBefore = JSON.stringify(bloodlineBuyer);
          bloodlineExperiences.set(bloodlineId, render(VampireExperiencePanel, { character: bloodlineBuyer, updateSheet: noMutation, catalogs }));
          assert.equal(JSON.stringify(bloodlineBuyer), bloodlineBuyerBefore);
        }
        for (const definition of definitions) {
          const ritualExperience = bloodlineExperiences.get(definition.bloodlineId) ?? covenantExperiences.get(definition.covenantIds?.[0]) ?? generalRitualExperience;
          const presented = vampirePowerPresentation(definition, locale);
          const title = locale === "pt-BR" ? definition.translatedName : definition.name;
          if (definition.bloodlineId) assert.equal(generalRitualExperience.includes(`<strong>${escape(title)}</strong>`), false, "Bloodline ritual stays off an unrelated character's picker");
          if (definition.covenantIds?.length && !definition.covenantIds.some(id => ritualBuyer.line_data.covenant_ids.includes(id))) assert.equal(generalRitualExperience.includes(`<strong>${escape(title)}</strong>`), false, "Covenant ritual stays off an unrelated character's picker");
          for (const field of fields.filter(key => presented[key])) for (const html of [ritualSheet, ritualExperience, ...(vampireHomebrewSourceId(definition)?.startsWith("h-") ? [homebrew] : [])]) assert.ok(html.includes(escape(presented[field])), `${locale}: ${purchase} ${definition.id}.${field}`);
          for (const html of [ritualSheet, ritualExperience]) {
            assert.ok(html.includes(escape(title)));
          }
          const label = locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes";
          assert.ok(ritualSheet.includes(`<strong>${label}:</strong> ${definition.targetSuccesses}`));
          assert.ok(ritualExperience.includes(`<strong>${label}:</strong> ${definition.targetSuccesses}`));
          const receipt = { id: "ritual-purchase", label: "Authored ritual receipt", cost: 2, undo: { kind: "ritual", key: idsKey, id: definition.id } };
          const receiptBefore = JSON.stringify(receipt);
          assert.equal(vampireExperienceLabel(receipt, ritualCharacter, [], catalog, locale), title);
          const refunded = structuredClone(ritualCharacter);
          assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
          assert.deepEqual(refunded.line_data.blood_sorcery[idsKey], definitions.filter(item => item.id !== definition.id).map(item => item.id));
          assert.equal(JSON.stringify(receipt), receiptBefore);
        }
        assert.equal(JSON.stringify(ritualCharacter), ritualCharacterBefore);
        assert.equal(JSON.stringify(ritualBuyer), ritualBuyerBefore);
      }
      for (const errata of catalog.cruacRites.filter(item => item.errataFor && item.presentationPt)) {
        const preferences = { disabledIds: [], enabledIds: [errata.id] };
        setTestHomebrewPreferences(preferences);
        const active = activeVampirePowers(catalog, preferences);
        const original = catalog.cruacRites.find(item => item.id === errata.errataFor);
        const definition = active.cruacRites.find(item => item.id === original.id);
        assert.equal(definition.name, original.name);
        assert.equal(definition.translatedName, original.translatedName);
        assert.equal(active.cruacRites.some(item => item.id === errata.id), false);
        const character = structuredClone(ritualCharacters.cruac);
        character.line_data.blood_sorcery.cruac_rite_ids = [original.id, "unchanged-sibling"];
        const before = JSON.stringify(character);
        const html = render(RitualDisciplines, { powers: active, bloodSorcery: character.line_data.blood_sorcery, locale });
        const buyer = structuredClone(character);
        buyer.character.concept = "rite-test";
        buyer.line_data.blood_sorcery.cruac_rite_ids = [];
        const buyerBefore = JSON.stringify(buyer);
        const xp = render(VampireExperiencePanel, { character: buyer, updateSheet: noMutation, catalogs });
        const presented = vampirePowerPresentation(definition, locale);
        for (const field of fields.filter(key => presented[key])) for (const surface of [html, xp]) assert.ok(surface.includes(escape(presented[field])), `${locale}: enabled errata ${original.id}.${field}`);
        const label = locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes";
        for (const surface of [html, xp]) assert.ok(surface.includes(`<strong>${label}:</strong> ${errata.targetSuccesses}`));
        const record = vampirePowerPresentation(errata, locale);
        for (const field of fields.filter(key => record[key])) assert.ok(homebrew.includes(escape(record[field])));
        assert.ok(homebrew.includes(escape(locale === "pt-BR" ? errata.translatedName : errata.name)));
        if (errata.id === "h-vtr-agony-ecstasy:errata:mantle-amorous-fire") {
          assert.equal(presented.cost, "");
          assert.equal(html.includes(escape(locale === "pt-BR" ? original.presentationPt.cost : original.cost)), false);
        }
        const receipt = { id: "original-rite-receipt", label: "Authored receipt before errata", cost: 2, undo: { kind: "ritual", key: "cruac_rite_ids", id: original.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, [], active, locale), locale === "pt-BR" ? original.translatedName : original.name);
        const refunded = structuredClone(character);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.blood_sorcery.cruac_rite_ids, ["unchanged-sibling"]);
        assert.equal(JSON.stringify(receipt), receiptBefore);
        assert.equal(JSON.stringify(character), before);
        assert.equal(JSON.stringify(buyer), buyerBefore);
        setTestHomebrewPreferences({ disabledIds: [] });
        const disabled = activeVampirePowers(catalog, { disabledIds: [] });
        assert.equal(disabled.cruacRites.find(item => item.id === original.id), original);
      }
      const devotionCharacter = blankPrintCharacter("VtR");
      devotionCharacter.skills.Occult = 2;
      devotionCharacter.merits = [{ definitionId: "vtr-haven", instanceId: "reference-haven", name: "Haven", dots: 1, creationDots: 1, experienceDots: 0, sourceId: "vtr-2ed" }, { definitionId: "vtr-swarm-form", instanceId: "reference-swarm", name: "Swarm Form", dots: 2, creationDots: 2, experienceDots: 0, sourceId: "vtr-2ed" }];
      devotionCharacter.line_data = { ...devotionCharacter.line_data, clan_id: "gangrel", devotion_ids: devotions.map(item => item.id), disciplines: Object.fromEntries(catalog.disciplines.map(item => [item.name, 5])), notes: "Authored devotion research stays." };
      const devotionCharacterBefore = JSON.stringify(devotionCharacter);
      const devotionSheet = render(PurchasedPowers, { character: devotionCharacter, powers: catalog, locale });
      const devotionBuyer = structuredClone(devotionCharacter);
      devotionBuyer.character.concept = "devotion-test";
      devotionBuyer.line_data.devotion_ids = [];
      const devotionBuyerBefore = JSON.stringify(devotionBuyer);
      const generalDevotionExperience = render(VampireExperiencePanel, { character: devotionBuyer, updateSheet: noMutation, catalogs });
      const bloodlineDevotionExperiences = new Map();
      for (const bloodlineId of new Set(devotions.map(item => item.bloodlineId).filter(Boolean))) {
        const bloodlineBuyer = structuredClone(devotionBuyer);
        bloodlineBuyer.line_data.bloodline_id = bloodlineId;
        bloodlineBuyer.line_data.clan_id = reference.bloodlines.find(item => item.id === bloodlineId).parentClanIds[0];
        const before = JSON.stringify(bloodlineBuyer);
        bloodlineDevotionExperiences.set(bloodlineId, render(VampireExperiencePanel, { character: bloodlineBuyer, updateSheet: noMutation, catalogs }));
        assert.equal(JSON.stringify(bloodlineBuyer), before);
      }
      for (const definition of catalog.devotions.filter(item => item.presentationPt)) {
        const devotionExperience = bloodlineDevotionExperiences.get(definition.bloodlineId) ?? generalDevotionExperience;
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        if (!vampireDevotionAvailable(definition, devotionBuyer)) assert.equal(generalDevotionExperience.includes(`<strong>${escape(title)}</strong>`), false, "Exclusive Devotion stays off an unrelated character's picker");
        const quoteBuyer = structuredClone(devotionBuyer);
        quoteBuyer.line_data.bloodline_id = definition.bloodlineId;
        const quote = vampireDevotionExperienceCost(definition, quoteBuyer, catalog);
        const purchasable = Number(quote ?? 0) > 0;
        const devotionHomebrew = vampireHomebrewSourceId(definition)?.startsWith("h-");
        const surfaces = [devotionSheet, ...(purchasable ? [devotionExperience] : []), ...(devotionHomebrew ? [homebrew] : [])];
        assert.equal(vampireDisciplinePrerequisitesMet(definition.prerequisites, devotionCharacter.line_data.disciplines, catalog.disciplines.map(item => item.name)), true, `${definition.id}: eligible reference fixture`);
        for (const field of fields.filter(key => presented[key])) {
          assert.ok(devotionSheet.includes(escape(presented[field])), `${locale}: Devotion sheet ${definition.id}.${field}`);
          if (devotionHomebrew) assert.ok(homebrew.includes(escape(presented[field])), `${locale}: Devotion Homebrew ${definition.id}.${field}`);
          if (purchasable && !(field === "summary" && definition.effect) && definition[field].trim().toLowerCase() !== "none") assert.ok(devotionExperience.includes(escape(presented[field])), `${locale}: Devotion XP ${definition.id}.${field}`);
        }
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of surfaces) assert.ok(html.includes(escape(result)));
        for (const modifier of presented.suggestedModifiers ?? []) for (const html of surfaces) {
          assert.ok(html.includes(escape(modifier.situation)), `${locale}: Devotion modifier ${definition.id}`);
          assert.ok(html.includes(escape(modifier.modifier)));
        }
        for (const html of surfaces) assert.ok(html.includes(escape(title)));
        if (!purchasable) {
          assert.equal(devotionExperience.includes(`<strong>${escape(title)}</strong>`), false, "Powers without a positive learning cost are never offered as XP purchases");
          const freeBuyer = structuredClone(devotionBuyer);
          freeBuyer.line_data.bloodline_id = definition.bloodlineId;
          const before = JSON.stringify(freeBuyer);
          const granted = synchronizeAutomaticBloodlineDevotions(freeBuyer, catalog);
          assert.equal(granted.line_data.devotion_ids.includes(definition.id), quote === 0, "Only an explicit zero quote declares an automatic grant");
          assert.deepEqual(granted.current_state, freeBuyer.current_state, "Free grant preserves XP and history");
          assert.equal(JSON.stringify(freeBuyer), before);
          continue;
        }
        const receipt = { id: "old-devotion-purchase", label: "Authored devotion receipt", cost: definition.experienceCost, undo: { kind: "devotion", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, devotionCharacter, [], catalog, locale), title);
        const refunded = structuredClone(devotionCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.devotion_ids, devotions.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const limitedDevotionBuyer = structuredClone(devotionBuyer);
      limitedDevotionBuyer.line_data.disciplines = {};
      const limitedDevotionExperience = render(VampireExperiencePanel, { character: limitedDevotionBuyer, updateSheet: noMutation, catalogs });
      const locked = (html, definition) => {
        const start = html.indexOf(`<strong>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</strong>`);
        assert.ok(start >= 0, definition.id);
        return html.slice(html.lastIndexOf("<article", start), start).includes('aria-disabled="true"');
      };
      for (const definition of devotions) {
        if (!vampireDevotionAvailable(definition, limitedDevotionBuyer) || !definition.experienceCost) assert.equal(limitedDevotionExperience.includes(`<strong>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</strong>`), false);
        else assert.equal(locked(limitedDevotionExperience, definition), true, definition.id);
      }
      const aura = catalog.devotions.find(item => item.id === "h-vtr-agony-ecstasy:devotion:aura-of-the-crone");
      const trick = catalog.devotions.find(item => item.id === "h-vtr-fire-revolution:devotion:trick-shot");
      for (const definition of [aura, trick]) {
        for (const eligible of [false, true]) {
          const buyer = structuredClone(devotionBuyer);
          buyer.character.name = definition.id;
          buyer.current_state.experience_available = 10;
          buyer.current_state.experience_spent = 4;
          buyer.current_state.experience_total = 14;
          buyer.current_state.vampire_experience_history = [{ id: "authored", label: "Authored receipt", cost: 4 }];
          if (definition === aura) buyer.skills.Occult = eligible ? 2 : 1;
          else buyer.line_data.devotion_ids = eligible ? ["devotion-quicken-sight"] : [];
          const before = JSON.stringify(buyer);
          const updates = [];
          const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
          assert.equal(locked(html, definition), !eligible);
          experienceModule.testBuy();
          assert.equal(updates.length, eligible ? 1 : 0, `${locale}: purchase ${definition.id}`);
          if (eligible) {
            const purchased = updates[0];
            assert.ok(purchased.line_data.devotion_ids.includes(definition.id));
            assert.equal(purchased.current_state.experience_available, 10 - definition.experienceCost);
            assert.equal(purchased.current_state.experience_spent, 4 + definition.experienceCost);
            assert.deepEqual(purchased.current_state.vampire_experience_history[0], buyer.current_state.vampire_experience_history[0]);
            assert.deepEqual(purchased.current_state.vampire_experience_history.at(-1).undo, { kind: "devotion", id: definition.id });
            const prerequisiteReceipt = { id: "prerequisite", cost: 2, undo: definition === aura ? { kind: "trait", group: "skills", name: "Occult", amount: 1 } : { kind: "devotion", id: "devotion-quicken-sight" } };
            const refundSheet = structuredClone(purchased);
            refundSheet.current_state.vampire_experience_history.push(prerequisiteReceipt);
            const refundBefore = JSON.stringify(refundSheet);
            const refunds = [];
            render(VampireExperiencePanel, { character: refundSheet, updateSheet: value => refunds.push(value), catalogs });
            experienceModule.testRevert(prerequisiteReceipt);
            assert.equal(refunds.length, 0, `${locale}: prerequisite refund is atomic`);
            assert.equal(JSON.stringify(refundSheet), refundBefore);
            refundSheet.line_data.devotion_ids = refundSheet.line_data.devotion_ids.filter(id => id !== definition.id);
            render(VampireExperiencePanel, { character: refundSheet, updateSheet: value => refunds.push(value), catalogs });
            experienceModule.testRevert(prerequisiteReceipt);
            assert.equal(refunds.length, 1);
            assert.equal(refunds[0].current_state.experience_available, refundSheet.current_state.experience_available + 2);
            assert.equal(refunds[0].current_state.vampire_experience_history.some(item => item.id === prerequisiteReceipt.id), false);
            assert.deepEqual(refunds[0].current_state.vampire_experience_history[0], buyer.current_state.vampire_experience_history[0]);
          }
          assert.equal(JSON.stringify(buyer), before);
        }
      }
      for (const id of ["devotion-bloom", "devotion-sprout", "devotion-harvest", "devotion-flesh-sculpting", "devotion-the-yawning-void", "devotion-drowned-abyss", "devotion-dropping-the-act"]) {
        const definition = catalog.devotions.find(item => item.id === id);
        const prerequisiteId = { "devotion-flesh-sculpting": "devotion-flesh-crafting", "devotion-the-yawning-void": "devotion-bitter-blossom", "devotion-drowned-abyss": "devotion-silence-depths", "devotion-dropping-the-act": "devotion-playing-the-role" }[id] ?? "devotion-spore";
        assert.deepEqual(definition.requiredDevotionIds, [prerequisiteId]);
        for (const eligible of [false, true]) {
          const buyer = structuredClone(devotionBuyer);
          buyer.character.name = id;
          buyer.line_data.bloodline_id = definition.bloodlineId;
          buyer.line_data.devotion_ids = eligible ? [prerequisiteId] : [`homebrew:vampire:${prerequisiteId}`];
          buyer.current_state.experience_available = 10;
          buyer.current_state.experience_spent = 2;
          buyer.current_state.vampire_experience_history = [{ id: "authored", label: "Authored receipt", cost: 2 }];
          const before = JSON.stringify(buyer);
          const updates = [];
          const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
          assert.equal(locked(html, definition), !eligible);
          experienceModule.testBuy();
          assert.equal(updates.length, eligible ? 1 : 0, `${locale}: purchase with required Devotion ${id}`);
          if (eligible) {
            const purchased = updates[0];
            assert.ok(purchased.line_data.devotion_ids.includes(id));
            assert.equal(purchased.current_state.experience_available, 10 - definition.experienceCost);
            assert.deepEqual(purchased.current_state.vampire_experience_history.at(-1).undo, { kind: "devotion", id });
            assert.deepEqual(purchased.current_state.vampire_experience_history[0], buyer.current_state.vampire_experience_history[0]);
            const purchasedBefore = JSON.stringify(purchased);
            assert.equal(refundVampireAdvancement(purchased, { kind: "devotion", id: prerequisiteId }, catalog), false);
            assert.equal(JSON.stringify(purchased), purchasedBefore, "A retained paid Devotion protects its canonical prerequisite");
          }
          assert.equal(JSON.stringify(buyer), before);
        }
      }
      for (const definition of catalog.devotions.filter(item => item.requiredMerits?.length)) {
        const requirement = definition.requiredMerits[0];
        const prerequisite = vampireMeritCatalog.find(item => item.id === requirement.definitionId);
        for (const eligible of [false, true]) {
          const buyer = structuredClone(devotionBuyer);
          buyer.character.name = definition.id;
          buyer.line_data = { ...buyer.line_data, clan_id: reference.bloodlines.find(item => item.id === definition.bloodlineId).parentClanIds[0], bloodline_id: definition.bloodlineId };
          buyer.merits = [{ definitionId: eligible ? prerequisite.id : `homebrew:vampire:${prerequisite.id}`, instanceId: "paid-prerequisite", name: eligible ? "Authored label" : prerequisite.name, dots: requirement.dots, creationDots: 0, experienceDots: requirement.dots, sourceId: prerequisite.sourceId, configuration: { value: "Authored configuration" } }];
          const meritReceipt = { id: "merit-payment", label: "Original Merit receipt", cost: requirement.dots, undo: { kind: "merit", definitionId: prerequisite.id, instanceId: "paid-prerequisite", name: prerequisite.name, dots: requirement.dots } };
          buyer.current_state = { ...buyer.current_state, experience_available: 10, experience_spent: 4, experience_total: 14, vampire_experience_history: [{ id: "authored", label: "Authored receipt", cost: 4 - requirement.dots }, meritReceipt] };
          const before = JSON.stringify(buyer);
          const purchases = [];
          const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => purchases.push(value), catalogs });
          assert.equal(locked(html, definition), !eligible);
          experienceModule.testBuy();
          assert.equal(purchases.length, eligible ? 1 : 0, `${locale}: canonical Merit prerequisite ${definition.id}`);
          if (eligible) {
            const purchased = purchases[0];
            const receipt = purchased.current_state.vampire_experience_history.at(-1);
            assert.equal(receipt.cost, definition.experienceCost);
            assert.deepEqual(receipt.undo, { kind: "devotion", id: definition.id });
            assert.deepEqual(purchased.merits, buyer.merits, "Purchasing a Devotion never rewrites its configured Merit prerequisite");
            const purchasedBefore = JSON.stringify(purchased);
            const refunds = [];
            render(VampireExperiencePanel, { character: purchased, updateSheet: value => refunds.push(value), catalogs });
            experienceModule.testRevert(meritReceipt);
            assert.equal(refunds.length, 0, "Cannot credit XP or remove the exact Merit instance while a paid Devotion requires it");
            assert.equal(JSON.stringify(purchased), purchasedBefore);
            render(VampireExperiencePanel, { character: purchased, updateSheet: value => refunds.push(value), catalogs });
            experienceModule.testRevert(receipt);
            assert.equal(refunds.length, 1);
            assert.equal(refunds[0].current_state.experience_available, 10);
            assert.equal(refunds[0].current_state.experience_spent, 4);
            assert.deepEqual(refunds[0].current_state.vampire_experience_history, buyer.current_state.vampire_experience_history);
            render(VampireExperiencePanel, { character: refunds[0], updateSheet: value => refunds.push(value), catalogs });
            experienceModule.testRevert(meritReceipt);
            assert.equal(refunds.length, 2);
            assert.equal(refunds[1].current_state.experience_available, 10 + requirement.dots);
            assert.equal(refunds[1].current_state.experience_spent, 4 - requirement.dots);
            assert.deepEqual(refunds[1].merits, []);
            assert.deepEqual(refunds[1].current_state.vampire_experience_history, [buyer.current_state.vampire_experience_history[0]]);
          }
          assert.equal(JSON.stringify(buyer), before);
        }
      }
      const lord = catalog.devotions.find(item => item.id === "devotion-lord-of-beasts");
      for (const physical of [null, "Celerity", "Resilience", "Vigor"]) {
        const buyer = structuredClone(devotionBuyer);
        buyer.character.name = lord.id;
        buyer.line_data.disciplines = { Animalism: 2, Celerity: 0, Resilience: 0, Vigor: 0, ...(physical ? { [physical]: 1 } : {}) };
        buyer.current_state = { ...buyer.current_state, experience_available: 10, experience_spent: 4, experience_total: 14, vampire_experience_history: [{ id: "authored", label: "Authored receipt", cost: 4 }] };
        const before = JSON.stringify(buyer);
        const updates = [];
        const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
        assert.equal(locked(html, lord), physical === null);
        experienceModule.testBuy();
        assert.equal(updates.length, physical ? 1 : 0, `${locale}: Lord of Beasts Physical Discipline alternative ${physical}`);
        if (physical) {
          const purchased = updates[0];
          const receipt = purchased.current_state.vampire_experience_history.at(-1);
          assert.equal(receipt.cost, 1);
          assert.deepEqual(receipt.undo, { kind: "devotion", id: lord.id });
          const purchasedBefore = JSON.stringify(purchased);
          assert.equal(refundVampireAdvancement(purchased, { kind: "discipline", name: physical }, catalog), false);
          assert.equal(JSON.stringify(purchased), purchasedBefore);
          const refunds = [];
          render(VampireExperiencePanel, { character: purchased, updateSheet: value => refunds.push(value), catalogs });
          experienceModule.testRevert(receipt);
          assert.equal(refunds.length, 1);
          assert.equal(refunds[0].current_state.experience_available, 10);
          assert.deepEqual(refunds[0].current_state.vampire_experience_history, buyer.current_state.vampire_experience_history);
          assert.equal(refundVampireAdvancement(refunds[0], { kind: "discipline", name: physical }, catalog), true);
        }
        assert.equal(JSON.stringify(buyer), before);
      }
      for (const [id, condition, expectedCost, confirmation = "", confirmationPower = id] of [
        ["devotion-bad-trip", { bloodline_id: "candymen", clan_id: "nosferatu" }, 2],
        ["devotion-everlasting-blood-doll", { bloodline_id: "candymen", clan_id: "nosferatu" }, 5],
        ["devotion-sugar-rush", { bloodline_id: "candymen", clan_id: "nosferatu" }, 2],
        ["devotion-sweet-tooth", { bloodline_id: "candymen", clan_id: "nosferatu" }, 1],
        ["devotion-thinner", { bloodline_id: "candymen", clan_id: "nosferatu" }, 2],
        ["devotion-playing-the-role", { bloodline_id: "cockscomb-society", clan_id: "nosferatu" }, 2],
        ["devotion-iron-dogma", { bloodline_id: "gethsemani", clan_id: "nosferatu" }, 1],
        ["devotion-kingdom-of-heaven", { bloodline_id: "gethsemani", clan_id: "nosferatu" }, 5],
        ["devotion-bloody-good-flick", { bloodline_id: "von-schreck-family", clan_id: "nosferatu" }, 1],
        ["devotion-death-by-cliche", { bloodline_id: "von-schreck-family", clan_id: "nosferatu" }, 1],
        ["devotion-timeless-classic", { bloodline_id: "von-schreck-family", clan_id: "nosferatu" }, 2],
        ["devotion-watch-party", { bloodline_id: "von-schreck-family", clan_id: "nosferatu" }, 2],
        ["devotion-mission-from-the-gods", { bloodline_id: "yagnatia", clan_id: "nosferatu" }, 1],
        ["devotion-brain-dead", {}, 2],
        ["devotion-friend-to-foe", {}, 2],
        ["devotion-gaslight", {}, 4],
        ["devotion-gaze-of-the-abyss", {}, 2],
        ["devotion-hell-beast", {}, 3],
        ["devotion-iron-facade", {}, 1],
        ["devotion-jump-scare", {}, 2],
        ["devotion-living-nightmare", {}, 5],
        ["devotion-mania", {}, 2],
        ["devotion-mind-killer", {}, 1],
        ["devotion-loathsome-foe", {}, 2],
        ["devotion-no-one-hear-you-scream", {}, 1],
        ["devotion-pied-piper", {}, 1],
        ["devotion-rampage", {}, 7],
        ["devotion-rising-tension", {}, 1],
        ["devotion-sign-of-terror", {}, 4],
        ["devotion-sign-of-terror", { bloodline_id: "keepers-of-the-dark", clan_id: "nosferatu" }, 3],
        ["devotion-terrible-will", {}, 2],
        ["devotion-terrible-will", { covenant_ids: ["carthian-movement"] }, 2],
        ["devotion-terrible-will", {}, 1, "carthian-teacher"],
        ["devotion-terrible-will", {}, 2, "necropolis-member"],
        ["devotion-terrible-will", {}, 2, "carthian-teacher", "devotion-wretched-bite"],
        ["devotion-wretched-bite", {}, 1, "necropolis-member"],

        ["devotion-this-awful-grip", {}, 1],
        ["devotion-wicked-grasp", {}, 2],
        ["devotion-wretched-bite", {}, 2],
        ["devotion-brick", { bloodline_id: "connected", clan_id: "mekhet" }, 2],
        ["devotion-reach-out-and-touch-someone", { bloodline_id: "connected", clan_id: "mekhet" }, 3],
        ["devotion-catfish", { bloodline_id: "connected", clan_id: "mekhet" }, 2],
        ["devotion-re-search", { bloodline_id: "connected", clan_id: "mekhet" }, 2],
        ["devotion-after-hours", { bloodline_id: "acteius", clan_id: "nosferatu" }, 1],
        ["devotion-lockpicker-s-wrist", { bloodline_id: "acteius", clan_id: "nosferatu" }, 1],
        ["devotion-work-fast-not-hard", { bloodline_id: "acteius", clan_id: "nosferatu" }, 2],
        ["devotion-kiss-of-death", { bloodline_id: "moda-mortale" }, 1],
        ["devotion-form-of-the-trickster", { bloodline_id: "rotgrafen" }, 1],
        ["devotion-form-of-the-trickster", {}, 2],
        ["devotion-body-of-steel", { devotion_ids: ["devotion-battering-ram"] }, 1],
        ["devotion-body-of-steel", { devotion_ids: ["homebrew:vampire:devotion-battering-ram"] }, 2],
        ["devotion-flesh-crafting", { devotion_ids: ["devotion-elastic-visage"] }, 1],
        ["devotion-forced-march", { covenant_ids: ["carthian-movement"] }, 1],
        ["devotion-sheeps-clothing", { devotion_ids: ["devotion-elastic-visage"] }, 1],
        ["devotion-night-life", { clan_id: "daeva" }, 1],
        ["devotion-hounds-of-blood", { bloodline_id: "malocusians" }, 1],
        ["devotion-hounds-of-blood", {}, 2],
        ["devotion-hive-nexus-gestalt", { covenant_ids: ["carthian-movement"] }, 4],
        ["devotion-hive-nexus-gestalt", { bloodline_id: "adrestoi" }, 4],
        ["devotion-hive-nexus-gestalt", { bloodline_id: "melissidae" }, 4],
        ["devotion-hive-nexus-gestalt", {}, 5],
        ["devotion-soul-transfer", {}, 3],
        ["devotion-treasured-servant", {}, 1],
        ["devotion-dream-casting", { bloodline_id: "gottlings" }, 1],
        ["devotion-spotlight", { bloodline_id: "gottlings" }, 1],
        ["devotion-talent-scout", { bloodline_id: "gottlings" }, 1],
        ["devotion-chimera", { bloodline_id: "baetyl" }, 3],
        ["devotion-siren-s-lure", { bloodline_id: "cerrid" }, 1],
        ["devotion-interloper", { bloodline_id: "oberlochs" }, 2],
        ["h-vtr-fire-revolution:devotion:death-mask", {}, 1],
        ["h-vtr-fire-revolution:devotion:husk", {}, 1],
        ["h-vtr-fire-revolution:devotion:just-fucking-book-it", {}, 1],
        ["h-vtr-fire-revolution:devotion:skulk", {}, 2],
        ["h-vtr-fire-revolution:devotion:witch-hunt", {}, 1],
      ]) {
        const buyer = structuredClone(devotionBuyer);
        buyer.character.name = id;
        buyer.character.player = confirmation;
        buyer.character.chronicle = confirmationPower;
        buyer.line_data = { ...buyer.line_data, ...condition };
        buyer.current_state = { ...buyer.current_state, experience_available: 10, experience_spent: 4, experience_total: 14, vampire_experience_history: [{ id: "authored", label: "Authored receipt", cost: 4 }] };
        const before = JSON.stringify(buyer);
        const updates = [];
        const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
        const definition = catalog.devotions.find(item => item.id === id);
        const title = escape(locale === "pt-BR" ? definition.translatedName : definition.name);
        const start = html.indexOf(`<strong>${title}</strong>`);
        assert.ok(start >= 0, `${locale}: accessible ${id}`);
        const card = html.slice(start, html.indexOf("</article>", start));
        assert.ok(card.includes(`${expectedCost} ${translate(locale, "ui.xp")}`), `${locale}: quoted price ${id}`);
        for (const discount of definition.experienceDiscounts ?? []) if (discount.confirmation) {
          assert.ok(html.includes(escape(locale === "pt-BR" ? discount.confirmation.labelPt : discount.confirmation.label)));
          assert.ok(html.includes('type="checkbox"'));
        }

        experienceModule.testBuy();
        assert.equal(updates.length, 1, `${locale}: buy ${id}`);
        const purchased = updates[0];
        const receipt = purchased.current_state.vampire_experience_history.at(-1);
        assert.equal(receipt.cost, expectedCost);
        assert.deepEqual(receipt.undo, { kind: "devotion", id });
        assert.equal(purchased.current_state.experience_available, 10 - expectedCost);
        assert.equal(purchased.current_state.experience_spent, 4 + expectedCost);
        assert.deepEqual(purchased.current_state.vampire_experience_history[0], buyer.current_state.vampire_experience_history[0]);
        const refundSheet = structuredClone(purchased);
        refundSheet.line_data = { ...refundSheet.line_data, clan_id: "gangrel", bloodline_id: "", covenant_ids: [], devotion_ids: [id] };
        const receiptBefore = JSON.stringify(receipt);
        const refunds = [];
        render(VampireExperiencePanel, { character: refundSheet, updateSheet: value => refunds.push(value), catalogs });
        experienceModule.testRevert(receipt);
        assert.equal(refunds.length, 1);
        assert.equal(refunds[0].current_state.experience_available, 10, "Refund uses recorded price after discount eligibility changes");
        assert.equal(refunds[0].current_state.experience_spent, 4);
        assert.deepEqual(refunds[0].current_state.vampire_experience_history, buyer.current_state.vampire_experience_history);
        assert.equal(refunds[0].line_data.devotion_ids.includes(id), false);
        assert.equal(JSON.stringify(receipt), receiptBefore);
        assert.equal(JSON.stringify(buyer), before);
      }
      for (const [id, bloodlineId, oldCost] of [
        ["devotion-dropping-the-act", "cockscomb-society", 2],
        ["devotion-watch-party", "von-schreck-family", 1],
        ["devotion-sweet-tooth", "candymen", 2],
        ["devotion-dream-casting", "gottlings", 2],
        ["devotion-spotlight", "gottlings", 2],
        ["devotion-talent-scout", "gottlings", 2],
        ["devotion-chimera", "baetyl", 2],
        ["devotion-siren-s-lure", "cerrid", 2],
        ["devotion-interloper", "oberlochs", 3],
        ["h-vtr-fire-revolution:devotion:death-mask", "", 3],
        ["h-vtr-fire-revolution:devotion:husk", "", 2],
        ["h-vtr-fire-revolution:devotion:just-fucking-book-it", "", 2],
        ["h-vtr-fire-revolution:devotion:skulk", "", 3],
        ["h-vtr-fire-revolution:devotion:witch-hunt", "", 2],
      ]) {
        const older = structuredClone(devotionBuyer);
        older.line_data = { ...older.line_data, bloodline_id: bloodlineId, devotion_ids: [id] };
        const receipt = { id: `old-${id}`, label: "Título autoral anterior", cost: oldCost, undo: { kind: "devotion", id } };
        older.current_state = { ...older.current_state, experience_available: 10 - oldCost, experience_spent: oldCost, experience_total: 10, vampire_experience_history: [receipt] };
        const before = JSON.stringify(older), refunds = [];
        render(VampireExperiencePanel, { character: older, updateSheet: value => refunds.push(value), catalogs });
        experienceModule.testRevert(receipt);
        assert.equal(refunds.length, 1);
        assert.equal(refunds[0].current_state.experience_available, 10, "Old refunds restore the recorded cost despite a changed catalog price");
        assert.equal(refunds[0].current_state.experience_spent, 0);
        assert.deepEqual(refunds[0].current_state.vampire_experience_history, []);
        assert.equal(refunds[0].line_data.devotion_ids.includes(id), false);
        assert.equal(JSON.stringify(older), before, "Refund leaves the original sheet and authored receipt intact");
      }
      for (const condition of [{ clan_id: "gangrel" }, { clan_id: "daeva", bloodline_id: "erzsebet" }]) {
        const buyer = structuredClone(devotionBuyer);
        buyer.character.name = "devotion-night-life";
        buyer.line_data = { ...buyer.line_data, ...condition };
        const before = JSON.stringify(buyer);
        const updates = [];
        const html = render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
        assert.equal(html.includes(`<strong>${escape(locale === "pt-BR" ? "Vida Noturna" : "Night Life")}</strong>`), false);
        experienceModule.testBuy();
        assert.equal(updates.length, 0, "Inaccessible or free Devotions cannot charge XP");
        assert.equal(JSON.stringify(buyer), before);
      }
      for (const [id, clanId, bloodlineId, oldCost] of [["devotion-night-life", "daeva", "erzsebet", 1], ["devotion-murmur", "gangrel", "wickers", 2], ["devotion-ripples-still-water", "daeva", "xiao", 2], ["devotion-pied-piper", "nosferatu", "candymen", 1]]) {
        const freeBuyer = structuredClone(devotionBuyer);
        freeBuyer.character.name = id;
        freeBuyer.line_data = { ...freeBuyer.line_data, clan_id: clanId, bloodline_id: bloodlineId, ...(id === "devotion-ripples-still-water" ? { xiao_faction: "apostates" } : {}) };
        const freeBefore = JSON.stringify(freeBuyer), freeUpdates = [];
        const freeHtml = render(VampireExperiencePanel, { character: freeBuyer, updateSheet: value => freeUpdates.push(value), catalogs });
        const definition = catalog.devotions.find(item => item.id === id);
        assert.equal(freeHtml.includes(`<strong>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</strong>`), false);
        experienceModule.testBuy();
        assert.equal(freeUpdates.length, 0, "A newly free grant cannot charge XP through a stale selection");
        assert.equal(JSON.stringify(freeBuyer), freeBefore);
        const older = structuredClone(devotionBuyer);
        older.line_data = { ...older.line_data, clan_id: clanId, bloodline_id: bloodlineId, devotion_ids: [id], ...(id === "devotion-ripples-still-water" ? { xiao_faction: "apostates" } : {}) };
        const oldReceipt = { id: `old-${id}`, label: "Original paid title", cost: oldCost, undo: { kind: "devotion", id } };
        older.current_state = { ...older.current_state, experience_available: 10 - oldCost, experience_spent: oldCost, experience_total: 10, vampire_experience_history: [oldReceipt] };
        const oldRefunds = [];
        render(VampireExperiencePanel, { character: older, updateSheet: value => oldRefunds.push(value), catalogs });
        experienceModule.testRevert(oldReceipt);
        assert.equal(oldRefunds.length, 1);
        assert.equal(oldRefunds[0].current_state.experience_available, 10);
        assert.equal(oldRefunds[0].current_state.experience_spent, 0);
        assert.deepEqual(oldRefunds[0].current_state.vampire_experience_history, []);
        assert.ok(oldRefunds[0].line_data.devotion_ids.includes(id), "After refunding the old payment, the eligible new free grant remains available");
        assert.deepEqual(oldRefunds[0].line_data.automatic_devotion_ids, [id]);
      }
      assert.equal(JSON.stringify(devotionCharacter), devotionCharacterBefore);
      for (const faction of ["", "ascended", "Apostates"]) {
        const buyer = structuredClone(devotionBuyer);
        buyer.character.name = "devotion-ripples-still-water";
        buyer.line_data = { ...buyer.line_data, clan_id: "daeva", bloodline_id: "xiao", xiao_faction: faction, devotion_ids: [] };
        buyer.current_state = { ...buyer.current_state, experience_available: 10, experience_spent: 0, vampire_experience_history: [] };
        const updates = [];
        render(VampireExperiencePanel, { character: buyer, updateSheet: value => updates.push(value), catalogs });
        experienceModule.testBuy();
        assert.equal(updates.length, 1, `${locale}: unconfirmed faction retains the existing base quote`);
        assert.equal(updates[0].current_state.experience_available, 8);
        assert.equal(updates[0].current_state.vampire_experience_history.at(-1).cost, 2);
      }
      assert.equal(JSON.stringify(devotionBuyer), devotionBuyerBefore);
      const coilCharacter = blankPrintCharacter("VtR");
      coilCharacter.merits = [{ definitionId: "vtr-kindred-status", instanceId: "ordo-status", name: "Kindred Status", dots: 5, creationDots: 5, configuration: { group: "ordo-dracul" } }];
      coilCharacter.line_data = { ...coilCharacter.line_data, clan_id: "gangrel", covenant_ids: ["ordo-dracul"], ordo_dracul: { mystery_id: "zirnitra", coil_ratings: Object.fromEntries(coils.map(item => [item.id, 5])) }, notes: "Authored Coil research stays." };
      const coilCharacterBefore = JSON.stringify(coilCharacter);
      const coilSheet = render(DisciplineCards, { character: coilCharacter, updateSheet: noMutation, powers: catalog, disciplines: {}, coilRatings: coilCharacter.line_data.ordo_dracul.coil_ratings, locale, onRaiseFamiliar: noMutation });
      const coilPartial = render(DisciplineCards, { character: coilCharacter, updateSheet: noMutation, powers: catalog, disciplines: {}, coilRatings: Object.fromEntries(coils.map(item => [item.id, 3])), locale, onRaiseFamiliar: noMutation });
      const coilExperience = render(VampireExperiencePanel, { character: coilCharacter, updateSheet: noMutation, catalogs });
      for (const definition of catalog.coils) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of [coilSheet, coilExperience]) assert.ok(html.includes(escape(title)));
        for (const item of [presented, ...definition.levels.map(level => vampirePowerPresentation(level, locale))]) {
          for (const field of fields.filter(key => item[key])) for (const html of [coilSheet, coilExperience]) assert.ok(html.includes(escape(item[field])), `${locale}: Coil ${definition.id}.${item.rating ?? "summary"}.${field}`);
        }
        for (const level of definition.levels) {
          const caption = `<strong>${"•".repeat(level.rating)} ${escape(locale === "pt-BR" ? level.translatedName : level.name)}</strong>`;
          assert.equal(coilPartial.includes(caption), level.rating <= 3);
        }
        const receipt = { id: "old-coil-purchase", label: "Authored research receipt", rating: 5, cost: 4, undo: { kind: "coil", id: definition.id, amount: 1 } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, coilCharacter, [], catalog, locale), `${title} 5`);
        const refunded = structuredClone(coilCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.ordo_dracul.coil_ratings, Object.fromEntries(coils.map(item => [item.id, item.id === definition.id ? 4 : 5])));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(coilCharacter), coilCharacterBefore);
      const scaleCharacter = structuredClone(coilCharacter);
      scaleCharacter.line_data.ordo_dracul.scale_ids = scales.map(item => item.id);
      const scaleCharacterBefore = JSON.stringify(scaleCharacter);
      const scaleSheet = render(PurchasedPowers, { character: scaleCharacter, powers: catalog, locale });
      const scaleBuyer = structuredClone(scaleCharacter);
      scaleBuyer.character.concept = "scale-test";
      scaleBuyer.line_data.ordo_dracul.scale_ids = [];
      const scaleBuyerBefore = JSON.stringify(scaleBuyer);
      const scaleExperience = render(VampireExperiencePanel, { character: scaleBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.scales.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const field of fields.filter(key => presented[key])) for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(presented[field])), `${locale}: Scale ${definition.id}.${field}`);
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(result)));
        for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(title)));
        const receipt = { id: "old-scale-purchase", label: "Authored experiment receipt", cost: 1, undo: { kind: "scale", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, scaleCharacter, [], catalog, locale), title);
        const refunded = structuredClone(scaleCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.ordo_dracul.scale_ids, scales.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const limitedScaleBuyer = structuredClone(scaleBuyer);
      limitedScaleBuyer.line_data.ordo_dracul.coil_ratings = { "coil-ascendant": 1 };
      const limitedScaleExperience = render(VampireExperiencePanel, { character: limitedScaleBuyer, updateSheet: noMutation, catalogs });
      const costLabel = translate(locale, "ui.experienceCost"), xpUnit = translate(locale, "ui.xp");
      for (const [id, limitedCost] of [["scale-day-wake-conditioning", 1], ["scale-surgical-heart-removal", 2]]) {
        const definition = catalog.scales.find(item => item.id === id);
        const title = escape(locale === "pt-BR" ? definition.translatedName : definition.name);
        for (const [html, cost] of [[scaleExperience, 1], [limitedScaleExperience, limitedCost]]) {
          const start = html.indexOf(`<strong>${title}</strong>`);
          assert.ok(start >= 0);
          assert.ok(html.slice(start, html.indexOf("</article>", start)).includes(`<strong>${costLabel}:</strong> ${cost} ${xpUnit}`), `${locale}: ${id} cost ${cost}`);
        }
      }
      assert.equal(JSON.stringify(scaleCharacter), scaleCharacterBefore);
      assert.equal(JSON.stringify(scaleBuyer), scaleBuyerBefore);
      const detournementCharacter = blankPrintCharacter("VtR");
      detournementCharacter.merits = [{ definitionId: "core-2ed:mystery-cult-initiation", instanceId: "moulding-initiation", name: "Mystery Cult Initiation", dots: 1, creationDots: 1, configuration: { cult: "moulding-room" } }];
      detournementCharacter.line_data = { ...detournementCharacter.line_data, covenant_ids: ["moulding-room"], detournement_ids: detournements.map(item => item.id), notes: "Authored sacrifice notes stay." };
      const detournementCharacterBefore = JSON.stringify(detournementCharacter);
      const detournementSheet = render(PurchasedPowers, { character: detournementCharacter, powers: catalog, locale });
      const detournementBuyer = structuredClone(detournementCharacter);
      detournementBuyer.character.concept = "detournement-test";
      detournementBuyer.line_data.detournement_ids = [];
      const detournementBuyerBefore = JSON.stringify(detournementBuyer);
      const detournementExperience = render(VampireExperiencePanel, { character: detournementBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.detournements) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const field of fields.filter(key => presented[key])) for (const html of [detournementSheet, detournementExperience, homebrew]) assert.ok(html.includes(escape(presented[field])), `${locale}: detournement ${definition.id}.${field}`);
        for (const html of [detournementSheet, detournementExperience, homebrew]) assert.ok(html.includes(escape(title)));
        const receipt = { id: "old-detournement-purchase", label: "Authored sacrifice receipt", cost: 2, undo: { kind: "detournement", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, detournementCharacter, [], catalog, locale), title);
        const refunded = structuredClone(detournementCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.detournement_ids, detournements.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(detournementCharacter), detournementCharacterBefore);
      assert.equal(JSON.stringify(detournementBuyer), detournementBuyerBefore);
      const authoredFormula = normalizeVampireCatalogHomebrew({ entryType: "power", kind: "kimiya-formula", id: "homebrew:vampire:authored-formula", name: "Ebony Horse", summary: "Authored formula stays.", effect: "Authored formula effect stays." });
      assert.equal(vampirePowerPresentation(authoredFormula, locale), authoredFormula);
      const custom = normalizeVampireCatalogHomebrew({ entryType: "discipline", id: "homebrew:vampire:authored", name: "Animalism", summary: "Authored English stays.", levels: [{ rating: 1, name: "Feral Whispers", summary: "Authored level stays.", effect: "Authored effect stays." }] });
      assert.equal(vampirePowerPresentation(custom, locale), custom);
      assert.equal(vampirePowerPresentation(custom.levels[0], locale), custom.levels[0]);
      assert.equal(JSON.stringify(characters), charactersBefore);
      assert.equal(JSON.stringify(powers), dataBefore);
    } finally { await vite.close(); }
  }
});
