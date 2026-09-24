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

test("Vampire core-book catalogs expose all five Clans and line-owned content", async () => {
  const clans = JSON.parse(await readFile(`${root}/public/data/vampire/clans.json`, "utf8"));
  const merits = JSON.parse(await readFile(`${root}/public/data/vampire/merits.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  assert.deepEqual(clans.map((item) => item.id), ["daeva", "gangrel", "mekhet", "nosferatu", "ventrue"]);
  assert.ok(merits.length >= 45);
  assert.equal(powers.disciplines.length, 11);
  assert.equal(powers.devotions.length, 29);
  assert.equal(powers.cruacRites.length, 24);
  assert.equal(powers.thebanMiracles.length, 23);
  assert.equal(powers.coils.length, 5);
  assert.equal(powers.scales.length, 14);
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

test("Spilled Blood exposes the ten audited Bloodlines and gates Dead Signal to Jharana", async () => {
  const bloodlines = JSON.parse(await readFile(`${root}/public/data/vampire/bloodlines.json`, "utf8"));
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const { vampireRules } = await vite.ssrLoadModule("/game-lines/vampire/rules.ts");
  assert.deepEqual(bloodlines.map((item) => item.id), ["ankou", "icelus", "jharana", "liderc", "nosoi", "parliamentarians", "penumbrae", "scions-of-the-first-city", "vardyvle", "vilseduire"]);
  assert.equal(powers.disciplines.find((item) => item.name === "Dead Signal")?.levels.length, 5);
  const base = {
    id: "bloodline", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Signal", concept: "", player: "", chronicle: "" }, attributes: {}, skills: {}, specializations: [], merits: [],
    line_data: { blood_potency: 1, humanity: 7, disciplines: { "Dead Signal": 3 } }, current_state: {}, derived: {}, created_at: "", updated_at: "",
  };
  assert.equal(vampireRules.normalizeCharacter(base).line_data.disciplines["Dead Signal"], 0);
  assert.equal(vampireRules.normalizeCharacter({ ...base, line_data: { ...base.line_data, bloodline_id: "jharana" } }).line_data.disciplines["Dead Signal"], 3);
});

test("removing a Bloodline clears and refunds its exclusive Discipline", async () => {
  const { removeVampireBloodline } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
  const character = {
    id: "refund", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR", ruleset: { id: "vtr-2ed-embedded", version: 1 },
    character: { name: "Signal", concept: "", player: "", chronicle: "" }, attributes: {}, skills: {}, specializations: [], merits: [], derived: {}, created_at: "", updated_at: "",
    line_data: { bloodline_id: "jharana", disciplines: { "Dead Signal": 2 } },
    current_state: { experience_available: 1, experience_spent: 6, vampire_experience_history: [{ id: "paid", cost: 6, undo: { kind: "discipline", name: "Dead Signal", amount: 2 } }, { id: "other", cost: 1, undo: { kind: "skill", name: "Occult", amount: 1 } }] },
  };
  const removed = removeVampireBloodline(character);
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

test("Half-Damned and Thousand Years of Night Conditions remain source-scoped", async () => {
  const conditions = JSON.parse(await readFile(`${root}/public/data/vampire/conditions.json`, "utf8"));
  const halfDamned = conditions.filter((item) => item.sourceCode === "HD");
  const elders = conditions.filter((item) => item.sourceCode === "TY");

  assert.deepEqual(halfDamned.map((item) => item.name), ["Blood Siblings"]);
  assert.equal(elders.length, 16);
  assert.equal(elders.filter((item) => item.persistent).length, 12);
  assert.equal(elders.find((item) => item.name === "Leveraged")?.id, "elder-leveraged");
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

test("Vampire sheet presents owned Coils and keeps Rites and Miracles under their Discipline", async () => {
  const { ownedVampireCoils, ownedVampireRituals } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const [coil] = powers.coils;
  const [rite] = powers.cruacRites;
  const [miracle] = powers.thebanMiracles;
  assert.deepEqual(ownedVampireCoils(powers, { [coil.id]: 2 }), [coil]);
  assert.deepEqual(ownedVampireRituals(powers, "cruac", [rite.id, miracle.id]), [rite]);
  assert.deepEqual(ownedVampireRituals(powers, "theban", [rite.id, miracle.id]), [miracle]);
});

test("Vampire creation and editing persist the selected Covenant Discipline without losing XP advances", async () => {
  const { reconcileCreationCovenantPower } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
  const powers = JSON.parse(await readFile(`${root}/public/data/vampire/powers.json`, "utf8"));
  const [rite] = powers.cruacRites;
  const [miracle] = powers.thebanMiracles;
  const [coil] = powers.coils;
  const created = reconcileCreationCovenantPower(powers, "", rite.id, {}, {});
  assert.deepEqual(created.bloodSorcery, { cruac_rating: 1, cruac_rite_ids: [rite.id] });
  const edited = reconcileCreationCovenantPower(powers, rite.id, miracle.id, { cruac_rating: 3, cruac_rite_ids: [rite.id, "paid-rite"], theban_rating: 0 }, { [coil.id]: 2 });
  assert.deepEqual(edited.bloodSorcery, { cruac_rating: 2, cruac_rite_ids: ["paid-rite"], theban_rating: 1, theban_miracle_ids: [miracle.id] });
  assert.deepEqual(edited.coilRatings, { [coil.id]: 2 });
  const changedCoil = reconcileCreationCovenantPower(powers, coil.id, powers.coils[1].id, {}, { [coil.id]: 3 });
  assert.deepEqual(changedCoil.coilRatings, { [coil.id]: 2, [powers.coils[1].id]: 1 });
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

test("Vampire exposes its print surface lazily", async () => {
  const registration = await readFile(`${root}/game-lines/vampire/registration.ts`, "utf8");
  assert.match(registration, /id:\s*"VtR"/);
  assert.match(registration, /loadBuilder:\s*\(\)\s*=>\s*import\("\.\/builder"\)/);
  assert.match(registration, /loadSheet:\s*\(\)\s*=>\s*import\("\.\/sheet"\)/);
  assert.match(registration, /loadPrintSheet:\s*\(\)\s*=>\s*import\("\.\/print"\)/);
  assert.match(registration, /print:\s*\[/);
});
