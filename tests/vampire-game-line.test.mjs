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
  const clans = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/clans.json`, "utf8"));
  const covenants = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/covenants.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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
  assert.equal(powers.lashes.length, 2);
  assert.equal(powers.cruacRites.length, 76);
  assert.equal(powers.thebanMiracles.length, 32);
  assert.equal(powers.kimiyaFormulae.length, 5);
  assert.equal(powers.therionSacrileges.length, 7);
  assert.equal(powers.gildedInvocations.length, 10);
  assert.equal(powers.detournements.length, 5);
  assert.equal(powers.coils.length, 6);
  assert.equal(powers.scales.length, 19);
  assert.ok(powers.coils.every((item) => item.levels.length === 5));
  assert.ok(powers.disciplines.every((item) => item.source && item.page));
});

test("audited Vampire sourcebooks include their published rules text", async () => {
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const entries = [
    ...powers.disciplines.flatMap((item) => item.levels.map((level) => ({ ...level, source: item.source }))),
    ...Object.entries(powers)
      .filter(([key, value]) => key !== "disciplines" && Array.isArray(value))
      .flatMap(([, value]) => value.flatMap((item) => item.levels?.map((level) => ({ ...level, source: item.source })) ?? [item])),
  ];
  for (const source of ["Better Feared: Nosferatu", "False Gods: Ventrue", "Sin Again: Daeva", "Strange Shades: Mekhet", "Wild Hunt: Gangrel", "Thousand Years of Night", "Night Horrors: Spilled Blood", "Dark Eras 2", "Dark Eras Companion", "Agony & Ecstasy: Circle of the Crone", "Changeling: The Lost Second Edition — The Hedge"]) {
    const sourceEntries = entries.filter((item) => item.source === source);
    assert.ok(sourceEntries.length > 0, source);
    assert.deepEqual(sourceEntries.filter((item) => !["effect", "procedure", "outcome", "rollResults"].some((field) => item[field])).map((item) => item.name), [], source);
  }
  assert.equal(powers.devotions.some((item) => item.name === "Kingdom of Heaven"), true);
  assert.equal(powers.thebanMiracles.some((item) => item.name === "The Kingdom of Heaven"), false);
});

test("Vampire Devotions keep published roll results out of Effect", async () => {
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const embeddedResult = /Roll Results|(?:^|\s)(?:Success|Exceptional Success|Failure|Dramatic Failure):/;
  assert.deepEqual(powers.devotions.filter((item) => embeddedResult.test(item.effect ?? "")).map((item) => item.name), []);
  assert.equal(powers.devotions.find((item) => item.name === "It's Who You Know").rollResults.success.startsWith("For each success"), true);
  assert.deepEqual(Object.keys(powers.devotions.find((item) => item.name === "Re: Search").rollResults), ["success", "exceptionalSuccess", "failure", "dramaticFailure"]);
  assert.equal(powers.devotions.find((item) => item.name === "Tordenvaer").effect, undefined);
  assert.equal(powers.devotions.find((item) => item.name === "Summoning (Dominate)").suggestedModifiers.length, 5);
});

test("Vampire core p. 101 exposes Retainer(Ghoul) without changing Core Retainer", async () => {
  const vampireMerits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const coreMerits = JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8"));
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
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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

test("Vampire Bloodlines filter by stable Clan and Covenant Status identities", async () => {
  const { vampireBloodlineAvailable } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const clans = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/clans.json`, "utf8"));
  const covenants = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/covenants.json`, "utf8"));
  const reference = { clans, covenants };
  for (const bloodline of bloodlines) {
    const expected = clans.filter((clan) => bloodline.parentClan.split(/\s+or\s+/i).includes(clan.name)).map((clan) => clan.id);
    assert.deepEqual(bloodline.parentClanIds, expected, `${bloodline.name} has stable Parent Clan IDs`);
  }
  const character = { line_data: { clan_id: "daeva", covenant_id: "carthian-movement", covenant_ids: ["carthian-movement"] }, merits: [] };
  assert.equal(vampireBloodlineAvailable(bloodlines.find((item) => item.id === "jharana"), character, reference), true);
  assert.equal(vampireBloodlineAvailable(bloodlines.find((item) => item.id === "ankou"), character, reference), false);
  assert.equal(vampireBloodlineAvailable(bloodlines.find((item) => item.id === "parliamentarians"), character, reference), false);
  character.merits.push({ name: "Kindred Status", dots: 1, configuration: { group: "carthian-movement" } });
  assert.equal(vampireBloodlineAvailable(bloodlines.find((item) => item.id === "parliamentarians"), character, reference), true);
  assert.deepEqual(bloodlines.find((item) => item.id === "parliamentarians").covenantIds, ["carthian-movement"]);
});

test("joining a Vampire Bloodline replaces and later restores the creation Attribute bonus", async () => {
  const { joinVampireBloodline, removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const { vampireEditableCreationAttributes } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const clans = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/clans.json`, "utf8"));
  const creation = { Intelligence: 3, Wits: 3, Resolve: 2, Strength: 3, Dexterity: 3, Stamina: 1, Presence: 2, Manipulation: 3, Composure: 1 };
  const character = { attributes: { ...creation, Dexterity: 4 }, line_data: { clan_id: "daeva", favored_attribute: "Dexterity", favored_attributes: ["Dexterity"], disciplines: {}, devotion_ids: [] }, current_state: {}, derived: { LimiteDeCaracteristica: 5 } };
  const definition = bloodlines.find((item) => item.id === "jharana");
  const joined = joinVampireBloodline(character, definition, "Manipulation", powers, clans.find((item) => item.id === "daeva"));
  assert.deepEqual(joined.attributes, { ...creation, Manipulation: 4 });
  assert.equal(joined.line_data.favored_attribute, "Dexterity");
  assert.equal(joined.line_data.bloodline_favored_attribute, "Manipulation");
  assert.deepEqual(vampireEditableCreationAttributes(joined.attributes, joined.line_data, clans.find((item) => item.id === "daeva")), creation);
  assert.deepEqual(vampireEditableCreationAttributes({ ...joined.attributes, Dexterity: 4 }, joined.line_data, clans.find((item) => item.id === "daeva")), creation);
  const removed = removeVampireBloodline(joined, definition, powers);
  assert.deepEqual(removed.attributes, character.attributes);
  assert.equal(removed.line_data.favored_attribute, "Dexterity");
  assert.equal(removed.line_data.bloodline_favored_attribute, "");
});

test("Vampire Devotion prerequisites support alternatives and automatic Bloodline grants", async () => {
  const { synchronizeAutomaticBloodlineDevotions, vampireDisciplinePrerequisitesMet } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const names = ["Celerity", "Resilience", "Vigor"];
  assert.equal(vampireDisciplinePrerequisitesMet("Celerity ••• or Vigor •••", { Celerity: 1, Vigor: 3 }, names), true);
  assert.equal(vampireDisciplinePrerequisitesMet("Four dots divided among Celerity, Resilience, and Vigor", { Celerity: 1, Resilience: 1, Vigor: 2 }, names), true);
  assert.equal(vampireDisciplinePrerequisitesMet("Celerity ••; Resilience •", { Celerity: 2, Resilience: 0 }, names), false);
  const powers = { disciplines: names.map((name) => ({ name })), devotions: [{ id: "free", bloodlineId: "test", experienceCost: 0, prerequisites: "Vigor ••" }] };
  const character = { line_data: { bloodline_id: "test", disciplines: { Vigor: 1 }, devotion_ids: [] } };
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions(character, powers).line_data.devotion_ids, []);
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions({ ...character, line_data: { ...character.line_data, disciplines: { Vigor: 2 } } }, powers).line_data.devotion_ids, ["free"]);
});

test("Khaibit and Kerberos automatic Devotions are removed with their Bloodline", async () => {
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const character = { line_data: { bloodline_id: "khaibit", devotion_ids: ["devotion-udjat", "devotion-ba"], disciplines: {} }, current_state: {} };
  const removed = removeVampireBloodline(character, bloodlines.find((item) => item.id === "khaibit"), powers);
  assert.deepEqual(removed.line_data.devotion_ids, ["devotion-ba"]);
});

test("removing a Bloodline clears and refunds its exclusive Discipline", async () => {
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
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
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8"));
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

test("Vampire Merit filters group affiliations and style variants without changing catalog categories", async () => {
  const { vampireMeritFilterCategory } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
  const merits = [
    ...JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8")),
    ...JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8")),
  ];
  const categories = [...new Set(merits.map(vampireMeritFilterCategory))].sort();

  assert.deepEqual(categories, [
    "Bloodline", "Carthian Law", "Clan", "Covenant", "Elder", "Errata", "Fighting", "Fighting Styles", "Invictus Oaths", "Kindred", "Locations", "Mental", "Mental Styles", "Physical", "Physical Styles", "Restricted", "Social", "Social Styles", "Supernatural", "Supernatural Styles",
  ]);
  assert.equal(merits.filter((item) => vampireMeritFilterCategory(item) === "Covenant").length, 125);
  assert.equal(vampireMeritFilterCategory({ category: "Erzsébet" }), "Bloodline");
  assert.equal(vampireMeritFilterCategory({ category: "Invictus" }), "Covenant");
  assert.equal(vampireMeritFilterCategory({ category: "Mandragora" }), "Covenant");
  assert.equal(vampireMeritFilterCategory({ category: "Tradition" }), "Covenant");
  assert.equal(vampireMeritFilterCategory({ category: "Faction" }), "Covenant");
});

test("Secrets of the Covenants exposes every Crúac rite, Theban miracle, Coil level, and Scale", async () => {
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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
  const catalog = JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8"));
  const automaticWriting = catalog.find((item) => item.id === "core-2ed:automatic-writing");
  const layingOnHands = catalog.find((item) => item.id === "core-2ed:laying-on-hands");
  const numbingTouch = catalog.find((item) => item.id === "core-2ed:numbing-touch");
  const supernaturalResistance = catalog.find((item) => item.id === "hurt-locker:supernatural-resistance");
  const context = { gameLine: "VtR", archetypes: ["vampire"], meritCatalog: catalog, merits: [] };
  const mortalSupernatural = catalog.filter((item) => item.mortalOnly);

  assert.equal(mortalSupernatural.length, 54);
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
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
  assert.deepEqual(
    conditions.filter((item) => item.source === "Secrets of the Covenants").map((item) => item.name).sort(),
    ["Oathbreaker", "Primeval Truths"],
  );
});

test("Vampire exposes every line-owned core-book Condition and reuses Core Swooned", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/shared/data/conditions.json`, "utf8"));
  const mage = JSON.parse(await readFile(`${root}/public/game-lines/mage/data/conditions.json`, "utf8"));
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
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
  const available = new Set(conditions.map((item) => item.id));
  for (const id of ["charmed", "dominated", "ecstatic", "enslaved", "false-memories", "humbled", "mesmerized", "raptured", "sated", "subservient", "tainted"]) {
    assert.ok(available.has(id), id);
  }
});

test("excluded Ghoul, Dhampyr, and Revenant Conditions are absent", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
  const halfDamned = conditions.filter((item) => item.sourceCode === "HD");
  const elders = conditions.filter((item) => item.sourceCode === "TY");

  assert.deepEqual(halfDamned, []);
  assert.equal(elders.length, 12);
  assert.equal(elders.filter((item) => item.persistent).length, 8);
  assert.deepEqual(["Blood Siblings", "Children of the Blood", "Curated", "Leveraged", "Weak Vitae"].filter((name) => conditions.some((item) => item.name === name)), []);
  assert.ok(elders.every((item) => item.category === "Elder" && item.source === "Thousand Years of Night"));
});

test("Secrets of the Covenants catalog totals the 107 audited primary mechanics", async () => {
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const core = JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
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
  const { ruleSelectOptionLabel } = await vite.ssrLoadModule("/app/workspace/rule-select.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  assert.equal(vampireDisciplineDisplayName("Vigor", powers.disciplines, "en-US"), "Vigor");
  assert.equal(vampireDisciplineDisplayName("Vigor", powers.disciplines, "pt-BR"), "Ímpeto");
  assert.equal(ruleSelectOptionLabel({ value: "Vigor", label: "Vigor", localized: true }, "en-US"), "Vigor");
  assert.equal(ruleSelectOptionLabel({ value: "Stamina", label: "Vigor" }, "en-US"), "Stamina");
  assert.equal(vampireDisciplineDisplayName("Auspex", powers.disciplines, "en-US"), "Auspex");
  assert.equal(vampireDisciplineDisplayName("Auspex", powers.disciplines, "pt-BR"), "Auspícios");
});

test("Vampire sheet presents owned Coils and keeps all rituals under their Discipline", async () => {
  const { ownedVampireCoils, ownedVampireRituals } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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
  assert.equal(powers.coils.find((item) => item.id === "coil-quintessence").name, "Coil of Quintessence");
  const mine = powers.devotions.find((item) => item.id === "devotion-what-s-mine-is-mine");
  assert.equal(mine.prerequisites, "Dominate •, Resilience •");
  assert.match(mine.effect, /twice her Blood Potency/);
  assert.equal(powers.devotions.filter((item) => !item.bloodlineId && !item.prerequisites).length, 0);
  assert.equal(powers.devotions.filter((item) => !item.bloodlineId && !["effect", "procedure", "outcome", "rollResults"].some((field) => item[field])).length, 0);
  assert.ok(powers.devotions.find((item) => item.id === "devotion-aegis-defiance").effect.length > 300);
});

test("Adrestoi Blood Tether exposes Lashes and grants Gangrel-only Pack Alpha through Pack creation", async () => {
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const { BLOOD_TETHER_PACK_GRANT, createBloodTetherPack, leaveBloodTetherPack, synchronizeBloodTetherPack, vampireBloodTetherLashes } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { vampireMeritEligible } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
  const packAlpha = merits.find((item) => item.id === "vtr-pack-alpha");
  const lashes = vampireBloodTetherLashes(powers);
  assert.equal(packAlpha.category, "Gangrel");
  assert.equal(vampireMeritEligible(packAlpha, { gameLine: "VtR", archetypes: ["vampire", "ventrue"], meritCatalog: merits, merits: [] }, 0), false);
  assert.equal(vampireMeritEligible(packAlpha, { gameLine: "VtR", archetypes: ["vampire", "gangrel"], meritCatalog: merits, merits: [] }, 0), true);
  assert.deepEqual(lashes.map((item) => item.name), ["Blood Cleansing Ritual", "Iron Joy", "Sanguinary Invigoration", "Shared Feast", "Fealty's Reward", "Mass Embrace"]);
  assert.match(lashes.find((item) => item.name === "Iron Joy").outcome, /normal success as an exceptional success/);
  assert.equal(powers.devotions.some((item) => ["Iron Joy", "Shared Feast"].includes(item.name)), false);

  const character = {
    merits: [], line_data: { clan_id: "ventrue", bloodline_id: "adrestoi", disciplines: { "Blood Tether": 5 } },
    current_state: { willpower_current: 5, willpower_lost_dots: 0 }, derived: { ForçaDeVontade: 5 },
  };
  const created = createBloodTetherPack(character);
  assert.equal(created.line_data.blood_tether_pack_active, true);
  assert.equal(created.current_state.willpower_lost_dots, 1);
  assert.equal(created.merits.find((item) => item.name === "Pack Alpha")?.grantedBy, BLOOD_TETHER_PACK_GRANT);
  assert.equal(synchronizeBloodTetherPack(created), created);
  const left = leaveBloodTetherPack(created);
  assert.equal(left.current_state.willpower_lost_dots, 0);
  assert.equal(left.merits.some((item) => item.name === "Pack Alpha"), false);
});

test("Vampire creation and editing persist the selected Covenant Discipline without losing XP advances", async () => {
  const { reconcileCreationCovenantPower } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
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
  const source = await readFile(`${root}/game-lines/vampire/experience-panel.tsx`, "utf8");
  assert.match(source, /supernatural", purchases: \["blood-potency", "discipline"\]/);
  assert.match(source, /powers\.ritualDisciplines\.filter[\s\S]*powers\.coils\.filter/);
  assert.match(source, /value === "rite" && cruacRating >= 1[\s\S]*value === "scale" && Math\.max/);
  assert.match(source, /levels: mechanicsDetails|details: mechanicsDetails\(definition\), levels/);
  assert.match(source, /add\(t\("ui\.prerequisites"\), item\.prerequisites/);
  assert.match(source, /vampireDevotionPrerequisitesMet\(definition, character, powers, meritCatalog\)/);
  assert.match(source, /category: item\.bloodlineId \? t\("sheet\.bloodline"\) : t\("ui\.generalDevotions"\)/);
  assert.match(source, /categoryOptions=\{\[t\("ui\.generalDevotions"\), t\("sheet\.bloodline"\)\]\}/);
  assert.match(source, /description: item\.effect \?\? item\.summary, descriptionAfterDetails: true/);
  const shared = await readFile(`${root}/app/workspace/experience-shared.tsx`, "utf8");
  assert.match(shared, /categoryOptions \?\? items\.flatMap/);
  const sheet = await readFile(`${root}/game-lines/vampire/sheet-view.tsx`, "utf8");
  assert.match(sheet, /return\s*\(?\s*<details\s+className="rule-power-card vampire-discipline-card"\s+key=\{item\.id\}\s*>/);
  const css = await readFile(`${root}/app/css/globals.css`, "utf8");
  assert.match(css, /\.experience-merit-catalog article > div > strong/);
  assert.doesNotMatch(css, /\.experience-merit-catalog strong,/);
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
    statusMeritIds: ["vtr-kindred-status"],
    meritCatalog: [{ id: "vtr-kindred-status", name: "Kindred Status", sourceId: "vtr-2ed" }],
    merits: [{ name: "Kindred Status", dots: 2, configuration: { group: "Circle of the Crone" } }],
  };
  assert.equal(textRequirementMet("Resolve •••; Composure •••", context, context.meritCatalog), true);
  assert.equal(textRequirementMet("Circle of the Crone Status •", context, context.meritCatalog), true);
  assert.equal(textRequirementMet("Lancea et Sanctum Status •", context, context.meritCatalog), false);
  assert.equal(vampireCovenantStatus({ merits: context.merits }, "circle-of-the-crone", "Circle of the Crone"), 2);
});

test("Hollow Mekhet keeps the official Clan and offers only the Simplified Hollow homebrew toggle", async () => {
  const clans = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/clans.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const { hollowKaLimits, hollowKaRank, simplifiedHollowKaPool } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  assert.equal(clans.find((item) => item.id === "hollow-mekhet")?.source, "Thousand Years of Night");
  assert.equal(merits.some((item) => item.category === "Hollow Mekhet"), false);
  assert.equal([...powers.devotions, ...powers.detournements].some((item) => item.name === "Snatch"), false);
  assert.equal(hollowKaRank(7), 2);
  assert.deepEqual(hollowKaLimits(2), { traitMaximum: 7, attributeMinimum: 9, attributeMaximum: 14, essenceMaximum: 15, numinaMinimum: 3, numinaMaximum: 5 });
  assert.equal(simplifiedHollowKaPool(7), 3);
});

test("every published Vampire homebrew item is inventoried and can be disabled by source or item", async () => {
  const manifest = JSON.parse(await readFile(`${root}/public/shared/data/catalog-manifest.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const covenants = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/covenants.json`, "utf8"));
  const conditions = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/conditions.json`, "utf8"));
  const coreMerits = JSON.parse(await readFile(`${root}/public/shared/data/merits.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const { homebrewContentActive } = await vite.ssrLoadModule("/lib/homebrew.ts");
  const { activeVampireItems, activeVampirePowers, SIMPLIFIED_HOLLOW_ID, vampireHomebrewSourceId, vampireHomebrewContentActive } = await vite.ssrLoadModule("/game-lines/vampire/homebrew-catalog.ts");
  const items = [
    ...bloodlines, ...covenants, ...conditions, ...coreMerits, ...merits, ...powers.disciplines, ...powers.ritualDisciplines, ...powers.devotions, ...powers.lashes,
    ...powers.cruacRites, ...powers.thebanMiracles, ...powers.gildedInvocations, ...powers.detournements,
  ].filter((item) => vampireHomebrewSourceId(item)?.startsWith("h-vtr-"));
  const counts = Object.fromEntries(Object.entries(Object.groupBy(items, vampireHomebrewSourceId)).map(([sourceId, entries]) => [sourceId, entries.length]));
  assert.deepEqual(counts, {
    "h-vtr-sin-again": 91,
    "h-vtr-wild-hunt": 93,
    "h-vtr-false-gods": 106,
    "h-vtr-strange-shades": 89,
    "h-vtr-better-feared": 92,
    "h-vtr-agony-ecstasy": 95,
    "h-vtr-fire-revolution": 90,
  });
  for (const [id, minimum] of Object.entries({ "vampire-bloodlines": 13, "merits-vampire": 12, "vampire-powers": 26, "vampire-conditions": 7 }))
    assert.ok(manifest.catalogs[id].version >= minimum, id);
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
  const originalAmorous = powers.cruacRites.find(item => item.id === amorousErrata.errataFor);
  const activeAmorous = activeVampirePowers(powers, { disabledIds: [], enabledIds: [amorousErrata.id] }).cruacRites.find(item => item.id === originalAmorous.id);
  assert.equal(activeAmorous.cost, "", "Agony & Ecstasy p. 107 removes this Willpower cost");
  assert.equal(vampireHomebrewContentActive({ disabledIds: [], enabledIds: [amorousErrata.id] }, activeAmorous), true, "Active errata keeps the original identity available on downstream pickers");
  assert.equal(activeAmorous.presentationPt.duration, originalAmorous.presentationPt.duration);
  const original = { id: "test-rite", name: "Canonical rite", source: "Test", effect: "Original effect", duration: "Night", presentationPt: { effect: "Efeito original", duration: "Noite" } };
  const correction = { id: "test-errata", source: "Test", errataFor: original.id, effect: "Changed effect" };
  assert.equal(activeVampireItems([original, correction], { disabledIds: [] })[0].presentationPt, undefined, "Untranslated replacement cannot reuse the original translation");
  const translatedCorrection = { ...correction, presentationPt: { summary: "Resumo corrigido" } };
  assert.deepEqual(activeVampireItems([original, translatedCorrection], { disabledIds: [] })[0].presentationPt, { duration: "Noite", summary: "Resumo corrigido" }, "Only unchanged fields inherit localized presentation");
  assert.equal(original.presentationPt.effect, "Efeito original");
  const seedErrata = conditions.find((item) => item.errataFor === "vtr-sotc:seed-of-her-divinity");
  assert.equal(activeVampireItems(conditions, { disabledIds: [] }).some((item) => item.id === "vtr-sotc:seed-of-her-divinity"), false);
  assert.equal(activeVampireItems(conditions, { disabledIds: [], enabledIds: [seedErrata.id] }).some((item) => item.id === "vtr-sotc:seed-of-her-divinity"), true);
  const registration = await readFile(`${root}/game-lines/vampire/registration.ts`, "utf8");
  assert.match(registration, /homebrew:\s*\[[^\]]*"vampire-powers"[^\]]*"vampire-conditions"/);
  const homebrew = await readFile(`${root}/game-lines/vampire/homebrew.tsx`, "utf8");
  assert.match(homebrew, /const coreMerits = catalogs\.get/);
  assert.match(homebrew, /gildedInvocations[\s\S]*"gilded-cage"/);
  assert.match(homebrew, /"Lessons of Erebus": \{ kind: disciplines, parentId: "truths-of-erebus" \}/);
  assert.match(homebrew, /powers\.lashes\.forEach\([\s\S]*?add\(item, disciplines,[^\n]*"blood-tether"\)/);
  assert.match(homebrew, /"Ortam Recipes": \{ kind: disciplines, parentId: "ortam" \}/);
  assert.match(homebrew, /"Lithopedia Rites": \{ kind: bloodSorcery, parentId: "lithopedia" \}/);
  assert.match(homebrew, /item\.id === "lithopedia" \? bloodSorcery : disciplines/);
  for (const collection of ["cruacRites", "thebanMiracles", "detournements"])
    assert.match(homebrew, new RegExp(`powers\\.${collection}\\.forEach\\([\\s\\S]*?add\\(item, bloodSorcery`));
  assert.match(homebrew, /const categoryOrder = \[t\("ui\.merits"\), t\("ui\.clans"\), t\("ui\.covenants"\), t\("ui\.bloodlines"\), disciplines, bloodSorcery, t\("ui\.devotions"\), t\("ui\.conditions"\), "Errata"\]/);
  assert.match(homebrew, /reference\.clans\.forEach/);
  assert.match(homebrew, /kind: "Errata", name: t\("ui\.simplifiedHollow"\)/);
  assert.match(homebrew, /kinds = \[\.\.\.new Set\([^;]+\.sort\(\(left, right\) => categoryOrder\.indexOf\(left\) - categoryOrder\.indexOf\(right\)\)/);
  assert.match(homebrew, /homebrew-subitem-list/);
});

test("Vampire supports multiple Covenants and grants Shadow Cult Initiation instead of Kindred Status", async () => {
  const covenants = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/covenants.json`, "utf8"));
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


test("canonical additional Devotion prerequisites and refunds preserve paid dependencies atomically", async () => {
  const { vampireDevotionPrerequisitesMet, synchronizeAutomaticBloodlineDevotions } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const aura = powers.devotions.find(item => item.id === "h-vtr-agony-ecstasy:devotion:aura-of-the-crone");
  const trick = powers.devotions.find(item => item.id === "h-vtr-fire-revolution:devotion:trick-shot");
  assert.deepEqual(aura.requiredSkills, { Occult: 2 });
  assert.deepEqual(trick.requiredDevotionIds, ["devotion-quicken-sight"]);
  const sheet = blankPrintCharacter("VtR");
  sheet.skills.Occult = 2;
  sheet.skills.Academics = 1;
  sheet.line_data.disciplines = { Majesty: 3, Celerity: 3, Auspex: 1 };
  sheet.line_data.devotion_ids = [aura.id, trick.id, "devotion-quicken-sight"];
  sheet.current_state.vampire_experience_history = [{ id: "authored", label: "Authored receipt", cost: 2 }];
  sheet.current_state.experience_available = 7;
  sheet.current_state.experience_spent = 2;
  const before = JSON.stringify(sheet);
  assert.equal(vampireDevotionPrerequisitesMet(aura, sheet, powers), true);
  assert.equal(vampireDevotionPrerequisitesMet(trick, sheet, powers), true);
  assert.equal(vampireDevotionPrerequisitesMet(undefined, sheet, powers), false);
  const renamed = { ...powers, devotions: powers.devotions.map(item => ({ ...item, name: "Authored display name", translatedName: "Título alterado" })) };
  assert.equal(vampireDevotionPrerequisitesMet(trick, sheet, renamed), true);
  const unavailable = { ...powers, devotions: powers.devotions.filter(item => item.id !== "devotion-quicken-sight") };
  assert.equal(vampireDevotionPrerequisitesMet(trick, sheet, unavailable), false);
  const namesake = structuredClone(sheet);
  namesake.line_data.devotion_ids = ["homebrew:vampire:quicken-sight"];
  assert.equal(vampireDevotionPrerequisitesMet(trick, namesake, powers), false);
  const lowSkill = structuredClone(sheet);
  lowSkill.skills.Occult = 1;
  assert.equal(vampireDevotionPrerequisitesMet(aura, lowSkill, powers), false);
  for (const undo of [{ kind: "trait", group: "skills", name: "Occult" }, { kind: "discipline", name: "Majesty" }, { kind: "devotion", id: "devotion-quicken-sight" }]) {
    assert.equal(refundVampireAdvancement(sheet, undo, powers), false);
    assert.equal(JSON.stringify(sheet), before, "Failed refund leaves purchases, resources and receipts untouched");
  }
  assert.equal(refundVampireAdvancement(lowSkill, { kind: "trait", group: "skills", name: "Academics" }, powers), true, "An existing invalid Devotion does not block unrelated refunds");
  assert.equal(refundVampireAdvancement(sheet, { kind: "devotion", id: trick.id }, powers), true);
  assert.equal(refundVampireAdvancement(sheet, { kind: "devotion", id: "devotion-quicken-sight" }, powers), true);
  assert.equal(refundVampireAdvancement(sheet, { kind: "devotion", id: aura.id }, powers), true);
  assert.equal(refundVampireAdvancement(sheet, { kind: "trait", group: "skills", name: "Occult" }, powers), true);
  assert.deepEqual(sheet.current_state, JSON.parse(before).current_state, "Only the Experience transaction credits XP and removes history");
  const free = { ...aura, id: "free", bloodlineId: "test", experienceCost: 0 };
  const freePowers = { ...powers, devotions: [free] };
  const freeSheet = structuredClone(sheet);
  freeSheet.skills.Occult = 2;
  freeSheet.line_data.bloodline_id = "test";
  freeSheet.line_data.devotion_ids = ["free"];
  assert.equal(refundVampireAdvancement(freeSheet, { kind: "trait", group: "skills", name: "Occult" }, freePowers), true);
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions(freeSheet, freePowers).line_data.devotion_ids, [], "Free Bloodline grants can be recomposed after a refund");
});


test("Sin Again Ortam recipes with no learning cost are not automatic free Devotions or removed with Gulikan", async () => {
  const { synchronizeAutomaticBloodlineDevotions } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const recipes = powers.devotions.filter(item => item.category === "Ortam Recipes");
  assert.equal(recipes.length, 11);
  assert.ok(recipes.every(item => item.experienceCost === undefined));
  const character = blankPrintCharacter("VtR");
  character.line_data = { ...character.line_data, clan_id: "daeva", bloodline_id: "gulikan", disciplines: { Ortam: 5 }, devotion_ids: [] };
  character.current_state = { ...character.current_state, experience_available: 10, experience_spent: 4, experience_total: 14, vampire_experience_history: [{ id: "authored", label: "Authored recipe history", cost: 4 }] };
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions(character, powers).line_data.devotion_ids, [], "Entering Gulikan does not grant all eleven recipes");
  character.line_data.devotion_ids = [recipes[0].id, recipes[3].id, "authored-choice"];
  const before = JSON.stringify(character);
  const synchronized = synchronizeAutomaticBloodlineDevotions(character, powers);
  const removed = removeVampireBloodline(character, bloodlines.find(item => item.id === "gulikan"), powers);
  for (const result of [synchronized, removed]) {
    assert.deepEqual(result.line_data.devotion_ids, character.line_data.devotion_ids, "Unknown learning cost never authorizes deleting an owned choice");
    for (const key of ["experience_available", "experience_spent", "experience_total", "vampire_experience_history"]) assert.deepEqual(result.current_state[key], character.current_state[key]);
  }
  assert.equal(JSON.stringify(character), before);
});

test("Devotion access and learning discounts use canonical affiliations and known power IDs", async () => {
  const { vampireDevotionAvailable, vampireDevotionExperienceCost } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const sheet = { line_data: { clan_id: "gangrel", bloodline_id: "", covenant_ids: [], devotion_ids: [] } };
  for (const [id, condition, cost] of [
    ["devotion-night-life", { clan_id: "daeva", bloodline_id: "erzsebet" }, 0],
    ["devotion-kiss-of-death", { bloodline_id: "moda-mortale" }, 1],
    ["devotion-form-of-the-trickster", { bloodline_id: "rotgrafen" }, 1],
    ["devotion-body-of-steel", { devotion_ids: ["devotion-battering-ram"] }, 1],
    ["devotion-flesh-crafting", { devotion_ids: ["devotion-elastic-visage"] }, 1],
    ["devotion-forced-march", { covenant_ids: ["carthian-movement"] }, 1],
    ["devotion-sheeps-clothing", { devotion_ids: ["devotion-elastic-visage"] }, 1],
  ]) {
    const definition = powers.devotions.find(item => item.id === id);
    const buyer = { line_data: { ...sheet.line_data, ...condition } };
    assert.equal(vampireDevotionExperienceCost(definition, sheet, powers), definition.experienceCost);
    assert.equal(vampireDevotionExperienceCost(definition, buyer, powers), cost);
    const renamed = { ...powers, devotions: powers.devotions.map(item => ({ ...item, name: "Edited name", translatedName: "Título alterado" })) };
    assert.equal(vampireDevotionExperienceCost(renamed.devotions.find(item => item.id === id), buyer, renamed), cost);
    if (condition.devotion_ids) {
      const missing = { ...powers, devotions: powers.devotions.filter(item => !condition.devotion_ids.includes(item.id)) };
      assert.equal(vampireDevotionExperienceCost(definition, buyer, missing), definition.experienceCost);
      buyer.line_data.devotion_ids = condition.devotion_ids.map(id => `homebrew:vampire:${id}`);
      assert.equal(vampireDevotionExperienceCost(definition, buyer, powers), definition.experienceCost);
    }
  }
  const night = powers.devotions.find(item => item.id === "devotion-night-life");
  const trickster = powers.devotions.find(item => item.id === "devotion-form-of-the-trickster");
  assert.equal(vampireDevotionAvailable(night, sheet), false);
  assert.equal(vampireDevotionAvailable(night, { line_data: { ...sheet.line_data, clan_id: "daeva" } }), true);
  assert.equal(vampireDevotionAvailable(trickster, sheet), true);
  assert.equal(vampireDevotionExperienceCost(undefined, sheet, powers), undefined);
  assert.equal(vampireDevotionExperienceCost({ id: "unknown" }, sheet, powers), undefined);
});

test("conditional free Devotions track only new grants and preserve paid or opaque older choices", async () => {
  const { synchronizeAutomaticBloodlineDevotions } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const bloodlines = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/bloodlines.json`, "utf8"));
  const id = "devotion-night-life";
  const buyer = blankPrintCharacter("VtR");
  buyer.line_data = { ...buyer.line_data, clan_id: "daeva", bloodline_id: "erzsebet", disciplines: { Majesty: 1, Vigor: 1 }, devotion_ids: ["authored-choice"] };
  buyer.current_state = { ...buyer.current_state, experience_available: 10, experience_spent: 4, experience_total: 14, vampire_experience_history: [{ id: "authored", label: "Authored receipt", cost: 4 }] };
  const before = JSON.stringify(buyer);
  const granted = synchronizeAutomaticBloodlineDevotions(buyer, powers);
  assert.deepEqual(granted.line_data.devotion_ids, ["authored-choice", id]);
  assert.deepEqual(granted.line_data.automatic_devotion_ids, [id]);
  assert.equal(synchronizeAutomaticBloodlineDevotions(granted, powers), granted);
  assert.deepEqual(granted.current_state, buyer.current_state);
  assert.equal(JSON.stringify(buyer), before);
  const removed = removeVampireBloodline(granted, bloodlines.find(item => item.id === "erzsebet"), powers);
  assert.deepEqual(removed.line_data.devotion_ids, ["authored-choice"]);
  assert.deepEqual(removed.line_data.automatic_devotion_ids, []);
  assert.deepEqual(removed.current_state, buyer.current_state);
  const freeRefund = structuredClone(granted);
  assert.equal(refundVampireAdvancement(freeRefund, { kind: "discipline", name: "Majesty" }, powers), true);
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions(freeRefund, powers).line_data.devotion_ids, ["authored-choice"]);
  const unavailable = { ...powers, devotions: powers.devotions.filter(item => item.id !== id) };
  assert.equal(synchronizeAutomaticBloodlineDevotions(granted, unavailable), granted, "An unavailable definition never authorizes deleting its saved choice");
  for (const paid of [false, true]) {
    const legacy = structuredClone(buyer);
    legacy.line_data.devotion_ids.push(id);
    if (paid) {
      legacy.line_data.automatic_devotion_ids = [id]; // A stale marker cannot turn a recorded purchase into a free grant.
      legacy.current_state.vampire_experience_history.push({ id: "old-paid", label: "Original title", cost: 1, undo: { kind: "devotion", id } });
    }
    const legacyBefore = JSON.stringify(legacy);
    assert.equal(refundVampireAdvancement(legacy, { kind: "discipline", name: "Majesty" }, powers), false);
    assert.equal(JSON.stringify(legacy), legacyBefore);
    const left = removeVampireBloodline(legacy, bloodlines.find(item => item.id === "erzsebet"), powers);
    assert.deepEqual(left.line_data.devotion_ids, legacy.line_data.devotion_ids);
    assert.deepEqual(left.current_state, legacy.current_state);
  }
});

test("Malocusian Devotions require a canonical Haven instance and preserve paid dependencies on refunds", async () => {
  const { vampireDevotionPrerequisitesMet, synchronizeAutomaticBloodlineDevotions } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const haven = merits.find(item => item.id === "vtr-haven");
  const namesake = { ...haven, id: "homebrew:vampire:haven", sourceId: "homebrew:vampire", name: "Haven" };
  const catalog = [haven, namesake];
  const definitions = powers.devotions.filter(item => item.bloodlineId === "malocusians");
  assert.equal(definitions.length, 4);
  const sheet = blankPrintCharacter("VtR");
  sheet.line_data = { ...sheet.line_data, clan_id: "ventrue", bloodline_id: "malocusians", disciplines: { Resilience: 5, Obfuscate: 5, Animalism: 5, Dominate: 5 }, devotion_ids: [] };
  const owned = { definitionId: haven.id, instanceId: "paid-haven", name: "Authored Haven label", dots: 1, creationDots: 0, experienceDots: 1, sourceId: haven.sourceId, configuration: { value: "Authored home" } };
  for (const definition of definitions) {
    assert.deepEqual(definition.requiredMerits, [{ definitionId: haven.id, dots: 1 }]);
    assert.equal(vampireDevotionPrerequisitesMet(definition, sheet, powers, catalog), false);
    for (const selection of [owned, { name: "Haven", sourceId: haven.sourceId, dots: 1 }]) {
      sheet.merits = [selection];
      const before = JSON.stringify(sheet);
      assert.equal(vampireDevotionPrerequisitesMet(definition, sheet, powers, catalog), true);
      assert.equal(JSON.stringify(sheet), before, "Eligibility never rewrites legacy identity or authored configuration");
    }
    for (const selection of [{ ...owned, definitionId: namesake.id, name: "Haven" }, { ...owned, definitionId: "unavailable", name: "Haven" }, { name: "Refúgio", dots: 1 }, { ...owned, dots: 0 }]) {
      sheet.merits = [selection];
      assert.equal(vampireDevotionPrerequisitesMet(definition, sheet, powers, catalog), false);
    }
    sheet.merits = [owned];
    assert.equal(vampireDevotionPrerequisitesMet(definition, sheet, powers), false, "Missing active catalog fails closed");
    assert.equal(vampireDevotionPrerequisitesMet(definition, sheet, powers, [{ ...namesake, name: haven.id }]), false, "A player-authored title equal to an unavailable ID is not that definition");
    sheet.line_data.devotion_ids = [definition.id];
    sheet.current_state = { experience_available: 7, experience_spent: 1 + definition.experienceCost, vampire_experience_history: [{ id: "devotion", label: "Original title", cost: definition.experienceCost, undo: { kind: "devotion", id: definition.id } }] };
    const before = JSON.stringify(sheet);
    const undo = { kind: "merit", definitionId: haven.id, instanceId: owned.instanceId, name: "Haven", dots: 1 };
    assert.equal(refundVampireAdvancement(sheet, undo, powers, catalog), false);
    assert.equal(JSON.stringify(sheet), before, "A newly invalid paid Devotion rejects the whole refund");
    sheet.merits.push({ ...owned, instanceId: "other-haven", name: "Another authored home" });
    assert.equal(refundVampireAdvancement(sheet, undo, powers, catalog), true, "Another eligible instance can satisfy the requirement");
    assert.deepEqual(sheet.merits.map(item => item.instanceId), ["other-haven"]);
    sheet.line_data.devotion_ids = [];
    sheet.merits = [];
  }
  const stronger = { ...definitions[0], requiredMerits: [{ definitionId: haven.id, dots: 2 }] };
  sheet.merits = [owned, { ...owned, instanceId: "second" }];
  assert.equal(vampireDevotionPrerequisitesMet(stronger, sheet, powers, catalog), false, "Separate instances never combine ratings");
  sheet.merits[0] = { ...owned, dots: 2, experienceDots: 2 };
  assert.equal(vampireDevotionPrerequisitesMet(stronger, sheet, powers, catalog), true);
  const free = { ...definitions[0], id: "free-haven-test", experienceCost: 0 };
  const freePowers = { ...powers, devotions: [free] };
  assert.deepEqual(synchronizeAutomaticBloodlineDevotions(sheet, freePowers).line_data.devotion_ids, []);
  const granted = synchronizeAutomaticBloodlineDevotions(sheet, freePowers, catalog);
  assert.deepEqual(granted.line_data.devotion_ids, [free.id]);
  assert.deepEqual(granted.current_state, sheet.current_state);
});

test("Core Gargoyle activation access differs from Spilled Blood Tiny Guardian's canonical Swarm Form prerequisite", async () => {
  const { vampireDevotionPrerequisitesMet } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const powers = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/powers.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/game-lines/vampire/data/merits.json`, "utf8"));
  const gargoyle = powers.devotions.find(item => item.id === "devotion-gargoyles-vigilance");
  const tiny = powers.devotions.find(item => item.id === "devotion-tiny-guardian");
  const swarm = merits.find(item => item.id === "vtr-swarm-form");
  const namesake = { ...swarm, id: "homebrew:vampire:swarm", sourceId: "homebrew:vampire" };
  const catalog = [swarm, namesake];
  const sheet = blankPrintCharacter("VtR");
  sheet.line_data = { ...sheet.line_data, clan_id: "gangrel", bloodline_id: "nosoi", disciplines: { Auspex: 1, Resilience: 2, Protean: 3 }, devotion_ids: [] };
  sheet.merits = [];
  assert.equal(vampireDevotionPrerequisitesMet(gargoyle, sheet, powers), true, "Core p. 144 requires access to a location, not personal ownership of Safe Place");
  assert.equal(gargoyle.prerequisites, "Auspex •, Resilience ••");
  assert.equal(gargoyle.presentationPt.prerequisites, "Auspícios •, Resiliência ••");
  assert.match(gargoyle.requirement, /stationary for at least ten minutes in a Safe Place/);
  assert.match(gargoyle.presentationPt.requirement, /imóvel por pelo menos dez minutos em um Local Seguro/);
  assert.match(gargoyle.effect, /location reflected by the Safe Place Merit/);
  assert.deepEqual(swarm.ratings, [2], "Core p. 114 fixes Swarm Form at two dots");
  assert.deepEqual(tiny.requiredMerits, [{ definitionId: swarm.id, dots: 2 }]);
  const owned = { definitionId: swarm.id, instanceId: "paid-swarm", name: "Authored label", sourceId: swarm.sourceId, dots: 2, creationDots: 0, experienceDots: 2 };
  for (const selection of [owned, { name: swarm.name, sourceId: swarm.sourceId, dots: 2 }]) {
    sheet.merits = [selection];
    const before = JSON.stringify(sheet);
    assert.equal(vampireDevotionPrerequisitesMet(tiny, sheet, powers, catalog), true);
    assert.equal(JSON.stringify(sheet), before, "Reading eligibility preserves schema-2 identity and authored labels");
  }
  for (const selections of [[], [{ ...owned, dots: 1 }], [{ ...owned, definitionId: namesake.id, name: swarm.name }], [{ ...owned, definitionId: "unavailable", name: swarm.name }], [{ name: "Forma de Enxame", dots: 2 }]]) {
    sheet.merits = selections;
    assert.equal(vampireDevotionPrerequisitesMet(tiny, sheet, powers, catalog), false);
  }
  sheet.merits = [owned];
  assert.equal(vampireDevotionPrerequisitesMet(tiny, sheet, powers), false);
  sheet.line_data.devotion_ids = [tiny.id];
  sheet.current_state = { experience_available: 7, experience_spent: 2, vampire_experience_history: [{ id: "tiny", cost: 1, undo: { kind: "devotion", id: tiny.id } }] };
  const before = JSON.stringify(sheet);
  const undo = { kind: "merit", definitionId: swarm.id, instanceId: owned.instanceId, name: swarm.name, dots: 2 };
  assert.equal(refundVampireAdvancement(sheet, undo, powers, catalog), false);
  assert.equal(JSON.stringify(sheet), before, "A retained paid Tiny Guardian protects the exact prerequisite instance atomically");
  assert.equal(refundVampireAdvancement(sheet, { kind: "devotion", id: tiny.id }, powers, catalog), true);
  assert.equal(refundVampireAdvancement(sheet, undo, powers, catalog), true);
  assert.deepEqual(sheet.merits, []);
  assert.deepEqual(sheet.current_state, JSON.parse(before).current_state, "Only the transaction UI credits XP and removes receipts");
});
