import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("Homebrew activation honors both source and individual switches", async () => {
  const { homebrewCategoryKeys, homebrewContentActive, setHomebrewEnabled } = await vite.ssrLoadModule("/lib/homebrew.ts");
  const sourceOff = setHomebrewEnabled({ disabledIds: [] }, "h-courts", false);
  assert.equal(homebrewContentActive(sourceOff, "some-item", "h-courts"), false);
  const itemOff = setHomebrewEnabled({ disabledIds: [] }, "some-item", false);
  assert.equal(homebrewContentActive(itemOff, "some-item", "h-courts"), false);
  assert.equal(homebrewContentActive(itemOff, "official-item", "ctl-2ed"), true);
  assert.equal(homebrewContentActive({ disabledIds: [] }, "errata", "h-vtr-test", true), false);
  const errataOn = setHomebrewEnabled({ disabledIds: [] }, "errata", true, true);
  assert.equal(homebrewContentActive(errataOn, "errata", "h-vtr-test", true), true);
  assert.equal(homebrewContentActive(setHomebrewEnabled(errataOn, "errata", false, true), "errata", "h-vtr-test", true), false);
  assert.deepEqual(homebrewCategoryKeys("Court", "h-courts"), ["Court", "Homebrew"]);
  assert.deepEqual(homebrewCategoryKeys("Court", "ctl-2ed"), ["Court"]);
});

test("player-created Merits preserve exact ratings and enforce only structured prerequisites", async () => {
  const { activeMeritCatalog, normalizeMeritHomebrew, normalizeMeritHomebrews } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const { meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
  const item = normalizeMeritHomebrew({
    id: "homebrew:merit:test", name: "Impossible Grace", line: "CtL", category: "Social", ratings: [1, 3, 5],
    levels: [{ rating: 1, name: "Poise", description: "First benefit." }, { rating: 3, name: "Bearing", description: "Second benefit." }, { rating: 5, name: "Majesty", description: "Third benefit." }],
    requirements: { all: [{ trait: "Presence", minimum: 2 }, { merit: "Striking Looks", minimum: 1 }] },
    narrativePrerequisites: "Must have danced with the moon.", unbounded: false,
  });
  assert.deepEqual(item.ratings, [1, 3, 5]);
  assert.deepEqual(normalizeMeritHomebrews(JSON.parse(JSON.stringify([item])))[0].levels.map((level) => level.rating), [1, 3, 5]);
  assert.equal(meritPrerequisitesMet(item, { gameLine: "CtL", attributes: { Presence: 2 }, merits: [{ name: "Striking Looks", dots: 1 }], meritCatalog: [item] }), true);
  assert.equal(meritPrerequisitesMet(item, { gameLine: "CtL", attributes: { Presence: 1 }, merits: [{ name: "Striking Looks", dots: 1 }], meritCatalog: [item] }), false);
  assert.equal(activeMeritCatalog([], [item], { disabledIds: [item.id] }).length, 0);
  assert.equal(activeMeritCatalog([], [item], { disabledIds: [item.id] }, [item.name]).length, 1);

  const base = { ...item, id: "official", name: "Official", translatedName: "Official", sourceId: "official", source: "Official" };
  const errata = { ...item, id: "homebrew:merit:errata", name: "Official — Errata", translatedName: "Official — Errata", sourceId: "h-vtr-test", source: "Test", defaultDisabled: true, errataFor: "official", description: "Revised.", descriptionEn: "Revised." };
  assert.equal(activeMeritCatalog([base, errata], [], { disabledIds: [] }).find((entry) => entry.id === "official").description, base.description);
  assert.equal(activeMeritCatalog([base, errata], [], { disabledIds: [], enabledIds: [errata.id] }).find((entry) => entry.id === "official").description, "Revised.");
});

test("player-created Changeling Contracts are normalized at storage boundary", async () => {
  const { mergeContractHomebrews, normalizeContractHomebrew } = await vite.ssrLoadModule("/game-lines/changeling/contract-homebrews.ts");
  const item = normalizeContractHomebrew({
    id: "homebrew:contract:test", name: "Borrowed Moon", type: "Real", categoryKind: "Corte", regalia: "Moon Court", courtIds: ["moon"],
    description: "Borrow the moonlight.", hasRoll: true, dicePool: "Presence + Occult + Mantle", cost: "●●", action: "Instant", duration: "One scene", loophole: "Sing to the moon.",
    success: "The moon answers.", exceptionalSuccess: "It answers completely.", failure: "Nothing happens.", dramaticFailure: "The moon takes offense.",
    seemingBenefits: { Darkling: "Hide in the borrowed light.", Beast: "" },
  });
  assert.equal(item.sourceId, "homebrew:changeling-contracts");
  assert.equal(item.homebrew, true);
  assert.deepEqual(item.courtIds, ["moon"]);
  assert.deepEqual(item.seemingBenefits, { Darkling: "Hide in the borrowed light." });
  assert.equal(mergeContractHomebrews([{ ...item, id: "official" }], [item]).length, 2);

  const goblin = normalizeContractHomebrew({ ...item, id: "homebrew:contract:goblin", type: "Real", categoryKind: "Independente", regalia: "Goblin", goblin: true, courtIds: [] });
  assert.equal(goblin.type, "Comum");
  assert.equal(normalizeContractHomebrew({ id: "homebrew:contract:bad", name: "Bad" }), null);
});

test("player-created Changeling Entitlements are normalized at storage boundary", async () => {
  const { normalizeEntitlementHomebrew } = await vite.ssrLoadModule("/game-lines/changeling/entitlement-homebrews.ts");
  const item = normalizeEntitlementHomebrew({
    id: "homebrew:entitlement:test", name: "Test Title", meritName: "Test Bond", purpose: "Purpose", privileges: "Privilege", duties: "Duty",
    touchstone: "A mortal", curse: "A curse", beat: "A trigger", token: { name: "Seal", effect: "Effect" }, blessings: [{ id: "gift", name: "Gift", description: "Effect" }],
  });
  assert.equal(item.sourceId, "homebrew:changeling-entitlements");
  assert.equal(item.homebrew, true);
  assert.equal(item.blessings.length, 1);
  assert.equal(normalizeEntitlementHomebrew({ id: "bad", name: "Bad", meritName: "Bad", blessings: [] }), null);
});

test("player-created Vampire Bloodlines are normalized at storage boundary", async () => {
  const { normalizeBloodlineHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-homebrews.ts");
  const item = normalizeBloodlineHomebrew({
    id: "homebrew:bloodline:test", name: "Test Line", parentClan: "Mekhet", nicknames: ["Owls"],
    favoredAttributes: ["Intelligence", "Wits"], disciplines: ["Auspex", "Celerity", "Obfuscate", "Test Gift"], exclusiveDiscipline: "Test Gift",
    summary: "A hidden lineage.", baneName: "Moonblind", baneSummary: "The moon reveals their shadow.",
  });
  assert.equal(item.sourceId, "homebrew:vampire-bloodlines");
  assert.equal(item.homebrew, true);
  assert.equal(item.exclusiveDiscipline, "Test Gift");
  assert.equal(normalizeBloodlineHomebrew({ id: "homebrew:bloodline:bad", name: "Bad" }), null);
});

test("player-created Mage Legacies preserve the complete fixed Attainment progression", async () => {
  const { normalizeLegacyHomebrew } = await vite.ssrLoadModule("/game-lines/mage/legacy-homebrews.ts");
  const item = normalizeLegacyHomebrew({
    id: "homebrew:legacy:test", name: "Test Legacy", founderCharacterId: "mage-1", rulingArcanum: "Prime",
    parentage: { paths: ["Obrimos"], orders: ["Mysterium"] }, additionalPrerequisites: "Occult 2",
    initiation: "Decode a Supernal theorem.", organization: "A loose academy.", theory: "Truth is a living symbol.",
    yantras: ["Annotated theorem"], oblations: ["Solve a paradox"],
    attainments: Array.from({ length: 5 }, (_, index) => ({ rank: index + 1, name: `Theorem ${index + 1}`, description: `Effect ${index + 1}` })),
  });
  assert.equal(item.sourceId, "homebrew:mage-legacies");
  assert.equal(item.homebrew, true);
  assert.equal(item.attainments.length, 5);
  assert.deepEqual(item.attainments.map((entry) => [entry.rulingArcanum, entry.orthodoxGnosis, entry.novelGnosis]), [[1, 2, 3], [2, 2, 3], [3, 4, 5], [4, 6, 7], [5, 8, 9]]);
  assert.equal(normalizeLegacyHomebrew({ id: "homebrew:legacy:bad", name: "Bad" }), null);
});

test("player-created Mage Spells are normalized and filtered by activation", async () => {
  const { activeSpellCatalog, normalizeSpellHomebrew } = await vite.ssrLoadModule("/game-lines/mage/spell-homebrews.ts");
  const item = normalizeSpellHomebrew({ id: "homebrew:spell:test", name: "Borrowed Name", requirements: { Prime: 2 }, practice: "Ruling", primaryFactor: "Potency", withstand: "Resolve", roteSkills: ["Occult", "Persuasion"], summary: "Rewrite a symbolic name." });
  assert.equal(item.homebrew, true);
  assert.deepEqual(item.requirements, { Prime: 2 });
  assert.equal(activeSpellCatalog([], [item], { disabledIds: [item.id] }).length, 0);
  assert.equal(normalizeSpellHomebrew({ id: "homebrew:spell:bad", name: "Bad" }), null);
});

test("player-created Vampire catalog entries merge into their owning catalogs", async () => {
  const { mergeVampirePowers, mergeVampireReference, normalizeVampireCatalogHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/catalog-homebrews.ts");
  const clan = normalizeVampireCatalogHomebrew({ entryType: "clan", id: "homebrew:vampire:clan:test", name: "Nocturne", favoredAttributes: ["Intelligence", "Composure"], disciplines: ["Auspex", "Obfuscate", "Vigor"], baneName: "Silent Blood", baneSummary: "Speech costs Vitae." });
  const devotion = normalizeVampireCatalogHomebrew({ entryType: "power", id: "homebrew:vampire:power:test", kind: "devotion", name: "Night Bridge", summary: "Cross one shadow.", rating: 2, experienceCost: 2 });
  assert.equal(mergeVampireReference({ clans: [], covenants: [], anchors: [], bloodPotency: [], torpor: [], bloodlines: [] }, [clan]).clans[0].name, "Nocturne");
  assert.equal(mergeVampirePowers({ disciplines: [], ritualDisciplines: [], devotions: [], cruacRites: [], thebanMiracles: [], kimiyaFormulae: [], therionSacrileges: [], gildedInvocations: [], coils: [], scales: [], detournements: [] }, [devotion]).devotions[0].name, "Night Bridge");
  assert.equal(normalizeVampireCatalogHomebrew({ entryType: "clan", id: "bad", name: "Bad" }), null);
});

test("player-created Changeling Seemings, Kiths, and Courts merge without mutating static catalogs", async () => {
  const { mergeChangelingReference, mergeChangelingSeemings, normalizeChangelingCatalogHomebrew } = await vite.ssrLoadModule("/game-lines/changeling/catalog-homebrews.ts");
  const seeming = normalizeChangelingCatalogHomebrew({ entryType: "seeming", id: "homebrew:changeling:seeming:test", name: "Moonborn", translatedName: "Nascido da Lua", favored: "Finesse", regalia: "Mirror", blessing: "Bênção.", blessingEn: "Blessing.", curse: "Maldição.", curseEn: "Curse." });
  const kith = normalizeChangelingCatalogHomebrew({ entryType: "kith", id: "homebrew:changeling:kith:test", name: "Lanternheart", skill: "Occult", description: "Carries a living light.", blessing: "The light reveals paths." });
  const court = normalizeChangelingCatalogHomebrew({ entryType: "court", id: "homebrew:changeling:court:test", name: "Moon Court", emotion: "Wonder", emotionPt: "Assombro", mantleBenefits: ["1", "2", "3", "4", "5"], mantleBenefitsPt: ["1", "2", "3", "4", "5"] });
  const reference = { courts: [], kiths: [] };
  const merged = mergeChangelingReference(reference, [kith, court]);
  assert.equal(merged.kiths[0].name, "Lanternheart");
  assert.equal(merged.courts[0].name, "Moon Court");
  assert.equal(mergeChangelingSeemings([seeming]).Moonborn.regalia, "Mirror");
  assert.deepEqual(reference, { courts: [], kiths: [] });
});
