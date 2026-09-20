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
  assert.equal(powers.disciplines.length, 10);
  assert.equal(powers.devotions.length, 29);
  assert.equal(powers.cruacRites.length, 10);
  assert.equal(powers.thebanMiracles.length, 9);
  assert.equal(powers.coils.length, 3);
  assert.equal(powers.scales.length, 10);
  assert.ok(powers.coils.every((item) => item.levels.length === 5));
  assert.ok(powers.disciplines.every((item) => item.source && item.page));
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

test("Vampire remains a lazy registered line without a print surface", async () => {
  const registration = await readFile(`${root}/game-lines/vampire/registration.ts`, "utf8");
  assert.match(registration, /id:\s*"VtR"/);
  assert.match(registration, /loadBuilder:\s*\(\)\s*=>\s*import\("\.\/builder"\)/);
  assert.match(registration, /loadSheet:\s*\(\)\s*=>\s*import\("\.\/sheet"\)/);
  assert.doesNotMatch(registration, /loadPrintSheet|print:/);
});
