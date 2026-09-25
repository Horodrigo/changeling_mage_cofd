import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false }, resolve: { alias: { "@": root } } });
after(() => vite.close());

test("Vampire derived traits include physical Disciplines and audited Blood Potency limits", async () => {
  const { vampireDerived } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const derived = vampireDerived(
    { Stamina: 3, Strength: 2, Dexterity: 3, Resolve: 2, Composure: 3, Wits: 2 },
    { Athletics: 2 },
    { Resilience: 2, Vigor: 3, Celerity: 1 },
    6,
  );
  assert.equal(derived.Vitalidade, 10);
  assert.equal(derived.Deslocamento, 13);
  assert.equal(derived.Iniciativa, 6);
  assert.equal(derived.Defesa, 5);
  assert.equal(derived.VitaeMaxima, 20);
  assert.equal(derived.VitaePorTurno, 6);
  assert.equal(derived.LimiteDeCaracteristica, 6);
});

test("Vampire normalization owns its line_data, clamps ratings, and drops retired state", async () => {
  const { vampireRules } = await vite.ssrLoadModule("/game-lines/vampire/rules.ts");
  const character = {
    id: "v1", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Mara", concept: "", player: "", chronicle: "" },
    attributes: { Stamina: 2, Strength: 2, Dexterity: 2, Resolve: 2, Composure: 2, Wits: 2 }, skills: { Athletics: 1 }, specializations: [], merits: [],
    line_data: { clan_id: "mekhet", blood_potency: 99, humanity: -4, disciplines: { Vigor: 12 }, discipline_choices: { protean_aspects: ["claws", 3] }, blood_sorcery: { cruac_rating: 9, cruac_rite_ids: ["rite", 2] }, ordo_dracul: { mystery_id: "wyrm", coil_ratings: { "coil-wyrm": 8 }, scale_ids: ["scale"] }, aspirations: [], undead_companions: [{ animal_id: "cat", health_damage: ["lethal", "invalid"], undying: 1 }] }, derived: {},
    current_state: {
      vitae_current: -3,
      blood_bonds: [{ subject: "Mara", stage: 2 }],
      blush_of_life_active: true,
      blush_of_life_extra_vitae: 2,
      frenzy_situational_modifier: -3,
      frenzy_held_willpower: 2,
      torpor: { active: 1, notes: 4 },
      vitae_addictions: [{ subject: "Legacy" }],
    },
    created_at: "", updated_at: "",
  };
  const normalized = vampireRules.normalizeCharacter(character);
  assert.equal(normalized.line_data.blood_potency, 10);
  assert.equal(normalized.line_data.humanity, 0);
  assert.equal(normalized.line_data.disciplines.Vigor, 10);
  assert.equal(normalized.current_state.vitae_current, 0);
  assert.deepEqual(normalized.line_data.aspirations, []);
  assert.deepEqual(normalized.line_data.discipline_choices.protean_aspects, ["claws", "3"]);
  assert.equal(normalized.line_data.blood_sorcery.cruac_rating, 5);
  assert.deepEqual(normalized.line_data.blood_sorcery.cruac_rite_ids, ["rite", "2"]);
  assert.equal(normalized.line_data.ordo_dracul.coil_ratings["coil-wyrm"], 5);
  assert.deepEqual(normalized.current_state.blood_bonds, [{ subject: "Mara", stage: 2 }]);
  assert.deepEqual(normalized.line_data.banes, [{ id: "mekhet-clan-bane", name: "", breaking_point_id: "", breaking_point_level: 0, required_by: "mekhet" }]);
  assert.deepEqual(normalized.line_data.undead_companions[0].health_damage, ["lethal"]);
  assert.equal(normalized.line_data.clan_bane_active, true);
  assert.equal("blush_of_life_active" in normalized.current_state, false);
  assert.equal("blush_of_life_extra_vitae" in normalized.current_state, false);
  assert.equal("frenzy_situational_modifier" in normalized.current_state, false);
  assert.equal("frenzy_held_willpower" in normalized.current_state, false);
  assert.equal("torpor" in normalized.current_state, false);
  assert.equal("vitae_addictions" in normalized.current_state, false);
  const creationIssues = vampireRules.validateCreation({ ...normalized, line_data: { ...normalized.line_data, mask_id: "mask", dirge_id: "dirge", disciplines: { Vigor: 2 }, creation_covenant_power_id: "coil-wyrm" } });
  assert.equal(creationIssues.some((issue) => issue.field === "touchstones" || issue.field === "disciplines"), false);
});

test("Vampire catalogs group core, historical, and uncommon Clans", async () => {
  const clans = JSON.parse(await readFile(`${root}/public/data/vampire/clans.json`, "utf8"));
  const covenants = JSON.parse(await readFile(`${root}/public/data/vampire/covenants.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  assert.deepEqual(Object.fromEntries(["core", "historical", "uncommon"].map((group) => [group, clans.filter((item) => item.group === group).length])), { core: 5, historical: 5, uncommon: 6 });
  assert.ok(clans.some((item) => item.id === "jiang-shi" && item.group === "uncommon"));
  assert.ok(clans.some((item) => item.id === "twice-cursed" && item.favoredAttributeMode === "both"));
  assert.deepEqual(Object.fromEntries(["core", "historical", "uncommon", "shadow-cult"].map((group) => [group, covenants.filter((item) => item.group === group).length])), { core: 6, historical: 8, uncommon: 3, "shadow-cult": 6 });
  assert.ok(merits.some((item) => item.id === "vtr-etiquette" && item.levels.length === 5));
  assert.ok(merits.some((item) => item.id === "vtr-hototogisu-status" && item.levels.length === 5));
  assert.ok(merits.length >= 45);
  assert.equal(powers.disciplines.length, 23);
  assert.equal(powers.ritualDisciplines.length, 5);
  assert.equal(powers.devotions.length, 357);
  assert.equal(powers.cruacRites.length, 76);
  assert.equal(powers.thebanMiracles.length, 33);
  assert.equal(powers.kimiyaFormulae.length, 5);
  assert.equal(powers.therionSacrileges.length, 7);
  assert.equal(powers.gildedInvocations.length, 10);
  assert.equal(powers.detournements.length, 5);
  assert.equal(powers.coils.length, 6);
  assert.equal(powers.scales.length, 19);
  assert.ok(powers.coils.every((item) => item.levels.length === 5));
  assert.ok(powers.disciplines.every((item) => item.source && item.page));
});

test("Vampire core p. 101 exposes Retainer(Ghoul) without changing Core Retainer", async () => {
  const vampireMerits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const coreMerits = JSON.parse(await readFile(`${root}/public/data/core/merits/core.json`, "utf8"));
  const { VAMPIRE_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/game-lines/vampire/merit-configurations.ts");
  const merit = vampireMerits.find((item) => item.id === "vtr-retainer-ghoul");
  const configuration = VAMPIRE_MERIT_CONFIGURATIONS.find((item) => item.name === "Retainer(Ghoul)");

  assert.deepEqual(merit.ratings, [1, 2, 3, 4, 5]);
  assert.equal(merit.category, "Kindred");
  assert.equal(merit.page, 101);
  assert.equal(merit.repeatable, true);
  assert.deepEqual(configuration.fields.filter((field) => field.key.startsWith("discipline_")).map((field) => field.minDots), [1, 3, 5]);
  assert.equal(coreMerits.filter((item) => item.name === "Retainer").length, 1);
});

test("supplement catalogs expose the audited Bloodlines and gate Dead Signal to Jharana", async () => {
  const bloodlines = JSON.parse(await readFile(`${root}/public/data/vampire/bloodlines.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const { vampireRules } = await vite.ssrLoadModule("/game-lines/vampire/rules.ts");
  assert.equal(bloodlines.length, 56);
  assert.deepEqual(
    ["ankou", "icelus", "jharana", "liderc", "nosoi", "parliamentarians", "penumbrae", "scions-of-the-first-city", "vardyvle", "vilseduire", "morbus", "bron", "khaibit", "kerberos", "star-crossed", "xiao", "typhos", "gulikan", "mystikoi", "connected", "lygos", "adrestoi"].filter((id) => !bloodlines.some((item) => item.id === id)),
    [],
  );
  assert.equal(powers.disciplines.find((item) => item.name === "Dead Signal")?.levels.length, 5);
  const base = {
    id: "bloodline", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Signal", concept: "", player: "", chronicle: "" }, attributes: {}, skills: {}, specializations: [], merits: [],
    line_data: { blood_potency: 1, humanity: 7, disciplines: { "Dead Signal": 3 } }, current_state: {}, derived: {}, created_at: "", updated_at: "",
  };
  assert.equal(vampireRules.normalizeCharacter(base).line_data.disciplines["Dead Signal"], 0);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "jharana" } }).line_data.disciplines["Dead Signal"], 3);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "morbus", disciplines: { Cachexy: 3 } } }).line_data.disciplines.Cachexy, 3);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "bron", disciplines: { Crochan: 2 } } }).line_data.disciplines.Crochan, 2);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "gulikan", disciplines: { Ortam: 2 } } }).line_data.disciplines.Ortam, 2);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "ventrue", disciplines: { Ortam: 2 } } }).line_data.disciplines.Ortam, 0);
});

test("supplement catalogs exclude Lingua Bellum, chronicle, coterie, Ghoul, Dhampyr, Strix, and Revenant options", async () => {
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const forbidden = ["Lingua Bellum", "Group Touchstone", "Common Enmity", "Goal", "History", "Risen Beast", "Dialog", "Society of Accord"];
  assert.deepEqual(forbidden.filter((name) => merits.some((item) => item.name === name)), []);
  assert.deepEqual(["Whip-Sharp Tongue", "Cybernetic Mimic", "Parliament's Apostle", "Codependency"].filter((name) => [...powers.devotions, ...powers.scales, ...powers.detournements].some((item) => item.name === name)), []);
  assert.equal(merits.some((item) => ["Double Vision", "Featherweight"].includes(item.name)), false);
  assert.ok(merits.some((item) => item.name === "The Three Heads of Kerberos"));
  assert.ok(merits.some((item) => item.name === "Contract with the Uncanny"));
  assert.ok(merits.some((item) => item.name === "Mandragora Garden"));
  assert.ok(powers.devotions.some((item) => item.name === "Undying Familiar"));
  assert.ok(powers.scales.some((item) => item.name === "Fealty's Reward"));
});

test("new Clan and Covenant Disciplines are available only to their owning identities", async () => {
  const { vampireDisciplineAvailable } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  assert.equal(vampireDisciplineAvailable("Praestantia", "", "akhud"), true);
  assert.equal(vampireDisciplineAvailable("Praestantia", "", "mekhet"), false);
  assert.equal(vampireDisciplineAvailable("Vitiate", "", "bekaak"), true);
  assert.equal(vampireDisciplineAvailable("Triadic Evolution", "", "gangrel", "belials-brood"), true);
  assert.equal(vampireDisciplineAvailable("Triadic Evolution", "", "gangrel", "invictus"), false);
});

test("Khaibit and Kerberos automatic Devotions are removed with their Bloodline", async () => {
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/data/vampire/bloodlines.json`, "utf8"));
  const character = { line_data: { bloodline_id: "khaibit", devotion_ids: ["devotion-udjat", "devotion-ba"], disciplines: {} }, current_state: {} };
  const removed = removeVampireBloodline(character, bloodlines.find((item) => item.id === "khaibit"), powers);
  assert.deepEqual(removed.line_data.devotion_ids, ["devotion-ba"]);
});

test("removing a Bloodline clears and refunds its exclusive Discipline", async () => {
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/data/vampire/bloodlines.json`, "utf8"));
  const character = {
    id: "refund", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Signal", concept: "", player: "", chronicle: "" }, attributes: {}, skills: {}, specializations: [], merits: [], derived: {}, created_at: "", updated_at: "",
    line_data: { bloodline_id: "jharana", disciplines: { "Dead Signal": 2 } },
    current_state: { experience_available: 1, experience_spent: 6, vampire_experience_history: [{ id: "paid", cost: 6, undo: { kind: "discipline", name: "Dead Signal", amount: 2 } }, { id: "other", cost: 1, undo: { kind: "skill", name: "Occult", amount: 1 } }] },
  };
  const removed = removeVampireBloodline(character, bloodlines.find((item) => item.id === "jharana"), powers);
  assert.equal(removed.line_data.bloodline_id, "");
  assert.equal(removed.line_data.disciplines["Dead Signal"], 0);
  assert.equal(removed.current_state.experience_available, 7);
  assert.equal(removed.current_state.experience_spent, 0);
  assert.deepEqual(removed.current_state.vampire_experience_history.map((item) => item.id), ["other"]);
});

test("Secrets of the Covenants exposes every printed Merit, Law, Oath, and Wyrm's Nest Merit", async () => {
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/data/core/merits/core.json`, "utf8"));
  const supplement = merits.filter((item) => item.sourceId === "vtr-sotc");
  const count = (category) => supplement.filter((item) => item.category === category).length;

  assert.equal(supplement.length, 60);
  assert.equal(count("Carthian Movement"), 11);
  assert.equal(count("Carthian Law"), 6);
  assert.equal(count("Circle of the Crone"), 8);
  assert.equal(count("Invictus"), 10);
  assert.equal(count("Invictus Oaths"), 10);
  assert.equal(count("Lancea et Sanctum"), 7);
  assert.equal(count("Ordo Dracul"), 4);
  assert.equal(count("Wyrm's Nest"), 4);
  assert.deepEqual(
    core.filter((item) => item.additionalSources?.some((entry) => entry.sourceId === "vtr-sotc")).map((item) => item.name).sort(),
    ["Automatic Writing", "Laying on Hands", "Numbing Touch"],
  );
});

test("Secrets of the Covenants exposes every Crúac rite, Theban miracle, Coil level, and Scale", async () => {
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const fromSupplement = (items) => items.filter((item) => item.source === "Secrets of the Covenants");
  const coils = fromSupplement(powers.coils);

  assert.equal(fromSupplement(powers.cruacRites).length, 14);
  assert.equal(fromSupplement(powers.thebanMiracles).length, 14);
  assert.equal(coils.length, 2);
  assert.equal(coils.flatMap((item) => item.levels).length, 10);
  assert.equal(fromSupplement(powers.scales).length, 4);
  assert.deepEqual(coils.map((item) => item.name), ["Coil of Zirnitra", "Coil of Ziva"]);
});

test("Coil of Zirnitra unlocks one mortal Supernatural Merit per dot and removes the limit at five", async () => {
  const { vampireMeritEligible, zirnitraMortalMeritCount, zirnitraMortalMeritLimit } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
  const catalog = JSON.parse(await readFile(`${root}/public/data/core/merits/core.json`, "utf8"));
  const automaticWriting = catalog.find((item) => item.id === "core-2ed:automatic-writing");
  const layingOnHands = catalog.find((item) => item.id === "core-2ed:laying-on-hands");
  const numbingTouch = catalog.find((item) => item.id === "core-2ed:numbing-touch");
  const supernaturalResistance = catalog.find((item) => item.id === "hurt-locker:supernatural-resistance");
  const context = { gameLine: "VtR", archetypes: ["vampire"], meritCatalog: catalog, merits: [] };
  const mortalSupernatural = catalog.filter((item) => item.mortalOnly);

  assert.equal(mortalSupernatural.length, 48);
  assert.equal(mortalSupernatural.filter((item) => item.sourceId === "core-2ed").length, 17);
  assert.equal(mortalSupernatural.filter((item) => item.sourceId === "hurt-locker").length, 30);
  assert.equal(mortalSupernatural.filter((item) => item.sourceId === "dark-eras").length, 1);
  assert.equal(mortalSupernatural.filter((item) => item.category === "Supernatural Styles").length, 3);
  assert.deepEqual(["Accursed Harbinger", "Astral Adept", "Phantom Limb", "Stigmata"].filter((name) => catalog.some((item) => item.name === name)), []);
  assert.equal(catalog.find((item) => item.id === "core-2ed:esoteric-armory").mortalOnly, undefined);
  assert.deepEqual(catalog.find((item) => item.id === "hurt-locker:psychic-onslaught").ratings, [5]);
  assert.equal(automaticWriting.mortalOnly, true);
  assert.equal(layingOnHands.mortalOnly, true);
  assert.equal(numbingTouch.mortalOnly, true);
  assert.equal(vampireMeritEligible(automaticWriting, context, 0), false);
  assert.equal(vampireMeritEligible(automaticWriting, context, 1), true);
  assert.equal(vampireMeritEligible(supernaturalResistance, context, 5), false);

  const oneOwned = { ...context, merits: [{ name: automaticWriting.name, dots: 2 }] };
  assert.equal(zirnitraMortalMeritCount(oneOwned), 1);
  assert.equal(vampireMeritEligible(automaticWriting, oneOwned, 1), true);
  assert.equal(vampireMeritEligible(layingOnHands, oneOwned, 1), false);
  assert.equal(vampireMeritEligible(layingOnHands, oneOwned, 2), true);
  assert.equal(vampireMeritEligible(supernaturalResistance, oneOwned, 2), true);

  const threeOwned = { ...context, merits: [automaticWriting, layingOnHands, numbingTouch].map((item) => ({ name: item.name, dots: item.ratings[0] })) };
  assert.equal(vampireMeritEligible(layingOnHands, threeOwned, 2), false);
  assert.equal(vampireMeritEligible(layingOnHands, threeOwned, 5), true);
  assert.equal(zirnitraMortalMeritLimit(5), Number.POSITIVE_INFINITY);
});

test("Secrets of the Covenants exposes its two printed Conditions", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  assert.deepEqual(
    conditions.filter((item) => item.source === "Secrets of the Covenants").map((item) => item.name).sort(),
    ["Oathbreaker", "Primeval Truths"],
  );
});

test("Vampire exposes every line-owned core-book Condition and reuses Core Swooned", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/data/core/conditions.json`, "utf8"));
  const mage = JSON.parse(await readFile(`${root}/public/data/mage/conditions.json`, "utf8"));
  const coreBook = conditions.filter((item) => item.source === "Vampire: The Requiem Second Edition");
  const added = [
    "Addicted", "Charmed", "Confused", "Delusional", "Distracted", "Dominated", "Drained", "Ecstatic", "Enervated", "Enslaved",
    "False Memories", "Frightened", "Humbled", "Intoxicated", "Mesmerized", "Raptured", "Sated", "Scarred", "Stumbled",
    "Subservient", "Tainted", "Tasked", "Thrall",
  ];

  assert.equal(coreBook.length, 32);
  assert.deepEqual(added.filter((name) => !coreBook.some((item) => item.name === name)), []);
  assert.ok(core.some((item) => item.id === "swooned" && item.name === "Swooned"));
  assert.equal(conditions.some((item) => item.name === "Swooning"), false);
  assert.equal(new Set([...core, ...conditions].map((item) => item.id)).size, core.length + conditions.length);
  for (const name of ["Addicted", "Charmed", "Humbled", "Thrall"]) {
    const vampireVersion = conditions.find((item) => item.name === name);
    const mageVersion = mage.find((item) => item.name === name);
    assert.ok(vampireVersion && mageVersion, name);
    assert.notEqual(vampireVersion.description, mageVersion.description, `${name} must remain line-specific`);
  }
});

test("known Vampire power and Bloodline Condition references resolve", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const available = new Set(conditions.map((item) => item.id));
  for (const id of ["charmed", "dominated", "ecstatic", "enslaved", "false-memories", "humbled", "mesmerized", "raptured", "sated", "subservient", "tainted"]) {
    assert.ok(available.has(id), id);
  }
});

test("excluded Ghoul, Dhampyr, and Revenant Conditions are absent", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const halfDamned = conditions.filter((item) => item.sourceCode === "HD");
  const elders = conditions.filter((item) => item.sourceCode === "TY");

  assert.deepEqual(halfDamned, []);
  assert.equal(elders.length, 12);
  assert.equal(elders.filter((item) => item.persistent).length, 8);
  assert.deepEqual(["Blood Siblings", "Children of the Blood", "Curated", "Leveraged", "Weak Vitae"].filter((name) => conditions.some((item) => item.name === name)), []);
  assert.ok(elders.every((item) => item.category === "Elder" && item.source === "Thousand Years of Night"));
});

test("Secrets of the Covenants catalog totals the 107 audited primary mechanics", async () => {
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/data/core/merits/core.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const source = (items) => items.filter((item) => item.source === "Secrets of the Covenants");
  const records = [
    ...source(merits),
    ...core.filter((item) => item.additionalSources?.some((entry) => entry.sourceId === "vtr-sotc")),
    ...source(powers.cruacRites),
    ...source(powers.thebanMiracles),
    ...source(powers.coils).flatMap((item) => item.levels),
    ...source(powers.scales),
    ...source(conditions),
  ];

  assert.equal(records.length, 107);
});

test("Vampire Discipline presentation never applies Attribute translations", async () => {
  const { vampireDisciplineDisplayName } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  assert.equal(vampireDisciplineDisplayName("Vigor", powers.disciplines, "en-US"), "Vigor");
  assert.equal(vampireDisciplineDisplayName("Vigor", powers.disciplines, "pt-BR"), "Ímpeto");
  assert.equal(vampireDisciplineDisplayName("Auspex", powers.disciplines, "en-US"), "Auspex");
  assert.equal(vampireDisciplineDisplayName("Auspex", powers.disciplines, "pt-BR"), "Auspícios");
});

test("Vampire sheet presents owned Coils and keeps all rituals under their Discipline", async () => {
  const { ownedVampireCoils, ownedVampireRituals } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const [coil] = powers.coils;
  const [rite] = powers.cruacRites;
  const [miracle] = powers.thebanMiracles;
  const [formula] = powers.kimiyaFormulae;
  const [invocation] = powers.gildedInvocations;
  assert.deepEqual(ownedVampireCoils(powers, { [coil.id]: 2 }), [coil]);
  assert.deepEqual(ownedVampireRituals(powers, "cruac", [rite.id, miracle.id]), [rite]);
  assert.deepEqual(ownedVampireRituals(powers, "theban", [rite.id, miracle.id]), [miracle]);
  assert.deepEqual(ownedVampireRituals(powers, "kimiya", [formula.id, miracle.id]), [formula]);
  assert.deepEqual(ownedVampireRituals(powers, "gilded-cage", [invocation.id, miracle.id]), [invocation]);
});

test("Vampire creation and editing persist the selected Covenant Discipline without losing XP advances", async () => {
  const { reconcileCreationCovenantPower } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const [rite] = powers.cruacRites;
  const [miracle] = powers.thebanMiracles;
  const [coil] = powers.coils;
  const [formula] = powers.kimiyaFormulae;
  const [invocation] = powers.gildedInvocations;
  const created = reconcileCreationCovenantPower(powers, "", rite.id, {}, {});
  assert.deepEqual(created.bloodSorcery, { cruac_rating: 1, cruac_rite_ids: [rite.id] });
  const edited = reconcileCreationCovenantPower(powers, rite.id, miracle.id, { cruac_rating: 3, cruac_rite_ids: [rite.id, "paid-rite"], theban_rating: 0 }, { [coil.id]: 2 });
  assert.deepEqual(edited.bloodSorcery, { cruac_rating: 2, cruac_rite_ids: ["paid-rite"], theban_rating: 1, theban_miracle_ids: [miracle.id] });
  assert.deepEqual(edited.coilRatings, { [coil.id]: 2 });
  const changedCoil = reconcileCreationCovenantPower(powers, coil.id, powers.coils[1].id, {}, { [coil.id]: 3 });
  assert.deepEqual(changedCoil.coilRatings, { [coil.id]: 2, [powers.coils[1].id]: 1 });
  const kimiya = reconcileCreationCovenantPower(powers, "", formula.id, {}, {});
  assert.deepEqual(kimiya.bloodSorcery, { kimiya_rating: 1, kimiya_formula_ids: [formula.id] });
  const gilded = reconcileCreationCovenantPower(powers, "", invocation.id, {}, {});
  assert.deepEqual(gilded.bloodSorcery, { gilded_cage_rating: 1, gilded_invocation_ids: [invocation.id] });
});

test("Vampire Experience separates Rites from Miracles and orders free rituals by the gained dot", async () => {
  const { freeBloodSorcerySelections, purchaseLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
  const catalog = [
    { id: "level-2", name: "Level Two", rating: 2 },
    { id: "level-1", name: "Level One", rating: 1 },
  ];
  assert.equal(purchaseLabel("rite", "en-US"), "Crúac Rite");
  assert.equal(purchaseLabel("miracle", "en-US"), "Theban Miracle");
  assert.deepEqual(freeBloodSorcerySelections(catalog, new Set(), [], 0, 2), ["level-1", "level-2"]);
});

test("Vampire Experience refunds Kimiya and Therion without discarding later blood sorcery", async () => {
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const sheet = { line_data: { blood_sorcery: { kimiya_rating: 3, kimiya_formula_ids: ["one", "two", "three"], therion_rating: 2, therion_sacrilege_ids: ["left", "right"] } }, current_state: {}, attributes: {}, skills: {}, specializations: [], merits: [] };
  refundVampireAdvancement(sheet, { kind: "bloodSorcery", ratingKey: "kimiya_rating", idsKey: "kimiya_formula_ids", ids: ["three"], amount: 1 });
  refundVampireAdvancement(sheet, { kind: "ritual", key: "therion_sacrilege_ids", id: "left" });
  assert.deepEqual(sheet.line_data.blood_sorcery, { kimiya_rating: 2, kimiya_formula_ids: ["one", "two"], therion_rating: 2, therion_sacrilege_ids: ["right"] });
});

test("Vampire Status and English trait prerequisites resolve against neutral stored fields", async () => {
  const { textRequirementMet } = await vite.ssrLoadModule("/lib/merit-requirements.ts");
  const { vampireCovenantStatus } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const context = {
    gameLine: "VtR",
    attributes: { Resolve: 3, Composure: 3 },
    skills: { Brawl: 2 },
    merits: [{ name: "Kindred Status", dots: 2, configuration: { group: "Circle of the Crone" } }],
  };
  assert.equal(textRequirementMet("Resolve •••; Composure •••", context, ["Kindred Status"]), true);
  assert.equal(textRequirementMet("Circle of the Crone Status •", context, ["Kindred Status"]), true);
  assert.equal(textRequirementMet("Lancea et Sanctum Status •", context, ["Kindred Status"]), false);
  assert.equal(vampireCovenantStatus({ merits: context.merits }, "circle-of-the-crone", "Circle of the Crone"), 2);
});

test("Hollow Mekhet keeps the official Clan and offers only the Simplified Hollow homebrew toggle", async () => {
  const clans = JSON.parse(await readFile(`${root}/public/data/vampire/clans.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const { hollowKaLimits, hollowKaRank, simplifiedHollowKaPool } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  assert.equal(clans.find((item) => item.id === "hollow-mekhet")?.source, "Thousand Years of Night");
  assert.equal(merits.some((item) => item.category === "Hollow Mekhet"), false);
  assert.equal([...powers.devotions, ...powers.detournements].some((item) => item.name === "Snatch"), false);
  assert.equal(hollowKaRank(7), 2);
  assert.deepEqual(hollowKaLimits(2), { traitMaximum: 7, attributeMinimum: 9, attributeMaximum: 14, essenceMaximum: 15, numinaMinimum: 3, numinaMaximum: 5 });
  assert.equal(simplifiedHollowKaPool(7), 3);
});

test("every published Vampire homebrew item is inventoried and can be disabled by source or item", async () => {
  const manifest = JSON.parse(await readFile(`${root}/public/data/manifest.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/data/vampire/bloodlines.json`, "utf8"));
  const covenants = JSON.parse(await readFile(`${root}/public/data/vampire/covenants.json`, "utf8"));
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const coreMerits = JSON.parse(await readFile(`${root}/public/data/core/merits/core.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const { homebrewContentActive } = await vite.ssrLoadModule("/lib/homebrew.ts");
  const { activeVampireItems, activeVampirePowers, SIMPLIFIED_HOLLOW_ID, vampireHomebrewSourceId } = await vite.ssrLoadModule("/game-lines/vampire/homebrew-catalog.ts");
  const items = [
    ...bloodlines, ...covenants, ...conditions, ...coreMerits, ...merits, ...powers.disciplines, ...powers.ritualDisciplines, ...powers.devotions,
    ...powers.cruacRites, ...powers.thebanMiracles, ...powers.gildedInvocations, ...powers.detournements,
  ].filter((item) => vampireHomebrewSourceId(item)?.startsWith("h-vtr-"));
  const counts = Object.fromEntries(Object.entries(Object.groupBy(items, vampireHomebrewSourceId)).map(([sourceId, entries]) => [sourceId, entries.length]));
  assert.deepEqual(counts, {
    "h-vtr-sin-again": 91,
    "h-vtr-wild-hunt": 92,
    "h-vtr-false-gods": 106,
    "h-vtr-strange-shades": 89,
    "h-vtr-better-feared": 92,
    "h-vtr-agony-ecstasy": 95,
    "h-vtr-fire-revolution": 90,
  });
  assert.deepEqual(
    Object.fromEntries(["vampire-bloodlines", "merits-vampire", "vampire-powers", "vampire-conditions"].map((id) => [id, manifest.catalogs[id].version])),
    { "vampire-bloodlines": 5, "merits-vampire": 10, "vampire-powers": 10, "vampire-conditions": 6 },
  );
  const bloodlineNames = Object.fromEntries(Object.entries(Object.groupBy(bloodlines.filter((item) => item.sourceId?.startsWith("h-vtr-")), (item) => item.sourceId)).map(([sourceId, entries]) => [sourceId, entries.map((item) => item.name).sort()]));
  assert.deepEqual(bloodlineNames, {
    "h-vtr-sin-again": ["Children of Judas", "Duchagne", "Erzsébet", "Gulikan", "Moda Mortale", "Nelapsi", "Star-Crossed", "Xiao"],
    "h-vtr-wild-hunt": ["Baetyl", "Cerrid", "Childer of the Morrigan", "Daimonion", "Dead Wolves", "Mystikoi", "Oberlochs", "Verlice", "Wickers", "Yarilo"],
    "h-vtr-strange-shades": ["Connected", "Család", "Kuufukuji", "Leandros", "Mnemosyne", "Norvegi", "Qedeshah"],
    "h-vtr-better-feared": ["Acteius", "Candymen", "Gethsemani", "Keepers of the Dark", "Lygos", "The Cockscomb Society", "Von Schreck Family", "Yagnatia"],
    "h-vtr-false-gods": ["Adrestoi", "Gottlings", "Keravnos", "Malkovians", "Malocusians", "Melissidae", "Rotgrafen", "Typhos", "Warumono"],
  });
  assert.equal(items.some((item) => ["Risen Beast", "Disciple of Dis", "Igor", "Pack Omega", "Predator-Marked", "Treasured Servant", "Beast King", "Show Breed", "Crashes"].includes(item.name)), false);
  assert.ok(["Hag Blood", "Constituent", "I Know a Guy (Advanced)", "Raise the Witch's Familiar", "Sharing the Familiar's Form", "Uplift", "Childe of Dis"].every((name) => items.some((item) => item.name === name)));
  assert.equal(items.some((item) => ["Ghoulish Caucus", "Forensic Psychometry"].includes(item.name)), false);
  assert.deepEqual(coreMerits.filter((item) => item.sourceId === "h-vtr-agony-ecstasy").map((item) => item.name).sort(), ["Carousing", "Mythologist", "Poisoner's Garden", "Roughing It"]);
  assert.equal(coreMerits.filter((item) => item.sourceId === "h-vtr-fire-revolution").length, 11);
  assert.ok(coreMerits.filter((item) => ["h-vtr-agony-ecstasy", "h-vtr-fire-revolution"].includes(item.sourceId)).every((item) => item.line === "Core"));
  const { meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
  assert.equal(meritPrerequisitesMet(coreMerits.find((item) => item.name === "Experimental Mindset"), { gameLine: "CofD", merits: [], meritCatalog: coreMerits }), true);
  assert.match(await readFile(`${root}/game-lines/mortal/builder.tsx`, "utf8"), /activeMeritCatalog\(catalogs\.get<readonly MeritDefinition\[]>\("core-merits"\)/);
  assert.deepEqual(covenants.filter((item) => ["children-of-the-thorns", "faithful-of-propylaia"].includes(item.id)).map((item) => item.group), ["shadow-cult", "shadow-cult"]);
  assert.ok(merits.filter((item) => item.sourceId === "h-vtr-fire-revolution" && item.category === "Faction").length === 8);
  assert.ok(merits.filter((item) => item.sourceId === "h-vtr-agony-ecstasy" && item.category === "Tradition").length === 4);
  assert.ok(merits.filter((item) => ["h-vtr-agony-ecstasy", "h-vtr-fire-revolution"].includes(item.sourceId) && item.defaultDisabled).every((item) => item.errataFor || item.catalogOnly));
  assert.deepEqual(
    merits.filter((item) => item.category === "Necropolis").map((item) => item.name).sort(),
    ["Bleak Annals", "Corrupting Influence", "Dark Hub", "Home Turf", "Honeycomb", "Lost & Found", "Necropolis Arsenal"],
  );
  assert.equal(powers.devotions.find((item) => item.name === "Crowdsourcing"), undefined);
  assert.equal(powers.gildedInvocations.some((item) => item.name === "Crowdsourcing"), true);
  assert.equal(homebrewContentActive({ disabledIds: ["h-vtr-false-gods"] }, "gilded-crowdsourcing", "h-vtr-false-gods"), false);
  assert.equal(homebrewContentActive({ disabledIds: [SIMPLIFIED_HOLLOW_ID] }, SIMPLIFIED_HOLLOW_ID, "h-vtr-strange-shades"), false);
  const amorousErrata = powers.cruacRites.find((item) => item.errataFor === "cruac-mantle-amorous-fire");
  assert.equal(activeVampirePowers(powers, { disabledIds: [] }).cruacRites.find((item) => item.id === "cruac-mantle-amorous-fire").targetSuccesses, 5);
  assert.equal(activeVampirePowers(powers, { disabledIds: [], enabledIds: [amorousErrata.id] }).cruacRites.find((item) => item.id === "cruac-mantle-amorous-fire").targetSuccesses, 4);
  const seedErrata = conditions.find((item) => item.errataFor === "vtr-sotc:seed-of-her-divinity");
  assert.equal(activeVampireItems(conditions, { disabledIds: [] }).some((item) => item.id === "vtr-sotc:seed-of-her-divinity"), false);
  assert.equal(activeVampireItems(conditions, { disabledIds: [], enabledIds: [seedErrata.id] }).some((item) => item.id === "vtr-sotc:seed-of-her-divinity"), true);
  const registration = await readFile(`${root}/game-lines/vampire/registration.ts`, "utf8");
  assert.match(registration, /homebrew:\s*\[[^\]]*"vampire-powers"[^\]]*"vampire-conditions"/);
  const homebrew = await readFile(`${root}/game-lines/vampire/homebrew.tsx`, "utf8");
  assert.match(homebrew, /const coreMerits = catalogs\.get/);
  assert.match(homebrew, /gildedInvocations[\s\S]*"gilded-cage"/);
  assert.match(homebrew, /"Lessons of Erebus": \{ kind: disciplines, parentId: "truths-of-erebus" \}/);
  assert.match(homebrew, /"Blood Tether Lashes": \{ kind: disciplines, parentId: "blood-tether" \}/);
  assert.match(homebrew, /"Ortam Recipes": \{ kind: disciplines, parentId: "ortam" \}/);
  assert.match(homebrew, /"Lithopedia Rites": \{ kind: bloodSorcery, parentId: "lithopedia" \}/);
  assert.match(homebrew, /item\.id === "lithopedia" \? bloodSorcery : disciplines/);
  for (const collection of ["cruacRites", "thebanMiracles", "detournements"])
    assert.match(homebrew, new RegExp(`powers\\.${collection}\\.forEach\\(\\(item\\) => add\\(item, bloodSorcery`));
  assert.match(homebrew, /const categoryOrder = \[h\("Méritos", "Merits"\), "Clans", "Covenants", "Bloodlines", disciplines, bloodSorcery, h\("Devoções", "Devotions"\), h\("Condições", "Conditions"\), "Errata"\]/);
  assert.match(homebrew, /reference\.clans\.forEach/);
  assert.match(homebrew, /kind: "Errata", name: "Simplified Hollow"/);
  assert.match(homebrew, /kinds = \[\.\.\.new Set\([^;]+\.sort\(\(left, right\) => categoryOrder\.indexOf\(left\) - categoryOrder\.indexOf\(right\)\)/);
  assert.match(homebrew, /homebrew-subitem-list/);
});

test("Vampire supports multiple Covenants and grants Shadow Cult Initiation instead of Kindred Status", async () => {
  const covenants = JSON.parse(await readFile(`${root}/public/data/vampire/covenants.json`, "utf8"));
  const { synchronizeVampireBuilderMeritGrants } = await vite.ssrLoadModule("/game-lines/vampire/builder-merit-grants.ts");
  const { vampireCovenantAffiliationDots } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const sheet = {
    merits: [{ name: "Kindred Status", dots: 4, configuration: { group: "Invictus" } }], specializations: [],
    line_data: { covenant_id: "followers-of-seth", covenant_ids: ["invictus", "followers-of-seth"], kindred_status_group: "Followers of Seth" },
  };
  synchronizeVampireBuilderMeritGrants(sheet);
  assert.deepEqual(sheet.line_data.covenant_ids, ["invictus", "followers-of-seth"]);
  assert.equal(sheet.merits.some((item) => item.name === "Kindred Status" && item.grantedBy === "Vampire Template"), false);
  assert.equal(sheet.merits.find((item) => item.name === "Mystery Cult Initiation")?.configuration.cult, "Followers of Seth");
  assert.equal(sheet.specializations.some((item) => item.skill === "Occult" && item.name === "Spirits"), true);
  assert.equal(vampireCovenantAffiliationDots(sheet, covenants), 5);

  const faithful = { merits: [], specializations: [], line_data: { covenant_id: "faithful-of-propylaia", covenant_ids: ["faithful-of-propylaia"], kindred_status_group: "Faithful of Propylaia" } };
  synchronizeVampireBuilderMeritGrants(faithful);
  assert.equal(faithful.merits.find((item) => item.name === "Mystery Cult Initiation")?.configuration.cult, "Faithful of Propylaia");
  assert.equal(faithful.merits.some((item) => item.name === "Tolerance for Biology"), true);
  assert.equal(faithful.merits.find((item) => item.name === "Mystery Cult Initiation")?.sourceId, "h-vtr-agony-ecstasy");
});

test("Vampire normalization preserves the Ka mode and all Covenant memberships", async () => {
  const { vampireRules } = await vite.ssrLoadModule("/game-lines/vampire/rules.ts");
  const character = {
    id: "hollow", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Echo", concept: "", player: "", chronicle: "" }, attributes: {}, skills: {}, specializations: [], merits: [], derived: {}, created_at: "", updated_at: "",
    line_data: { clan_id: "hollow-mekhet", covenant_id: "inconnu", covenant_ids: ["invictus", "inconnu"], blood_potency: 1, humanity: 7, hollow_ka: { name: "Ka", concept: "Reflection", simplified: true } }, current_state: {},
  };
  const normalized = vampireRules.normalizeCharacter(character);
  assert.deepEqual(normalized.line_data.covenant_ids, ["invictus", "inconnu"]);
  assert.equal(normalized.line_data.covenant_id, "inconnu");
  assert.equal(normalized.line_data.hollow_ka.simplified, true);
  assert.equal(normalized.line_data.hollow_ka.rank, 2);
});

test("Vampire Experience refunds Gilded Cage and Detournement independently", async () => {
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const sheet = { line_data: { blood_sorcery: { gilded_cage_rating: 2, gilded_invocation_ids: ["one", "two"] }, detournement_ids: ["eye", "face"] }, current_state: {}, attributes: {}, skills: {}, specializations: [], merits: [] };
  refundVampireAdvancement(sheet, { kind: "bloodSorcery", ratingKey: "gilded_cage_rating", idsKey: "gilded_invocation_ids", ids: ["two"], amount: 1 });
  refundVampireAdvancement(sheet, { kind: "detournement", id: "eye" });
  assert.deepEqual(sheet.line_data.blood_sorcery, { gilded_cage_rating: 1, gilded_invocation_ids: ["one"] });
  assert.deepEqual(sheet.line_data.detournement_ids, ["face"]);
});

test("Vampire exposes its print surface lazily", async () => {
  const registration = await readFile(`${root}/game-lines/vampire/registration.ts`, "utf8");
  assert.match(registration, /id:\s*"VtR"/);
  assert.match(registration, /loadBuilder:\s*\(\)\s*=>\s*import\("\.\/builder"\)/);
  assert.match(registration, /loadSheet:\s*\(\)\s*=>\s*import\("\.\/sheet"\)/);
  assert.match(registration, /loadPrintSheet:\s*\(\)\s*=>\s*import\("\.\/print"\)/);
  assert.match(registration, /print:\s*\[/);
});
