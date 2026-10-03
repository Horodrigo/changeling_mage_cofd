import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});
after(async () => vite.close());

const {
  CHRONOLOGUE,
  ELEVENTH_QUESTION,
  ENGINEERS_OF_THE_SYSTEM,
  LEGACIES,
  eleventhQuestionPrerequisites,
  legacyEntryPrerequisites,
  legacyAttainmentPrerequisites,
  normalizeLegacyState,
} = await vite.ssrLoadModule("/game-lines/mage/legacies.ts");

const { refundMageAdvancement, legacyUndoForEntry } = await vite.ssrLoadModule("/game-lines/mage/experience-refunds.ts");
const { discardLegacyAdvancements, refundLegacyExperiencePurchase } = await vite.ssrLoadModule("/game-lines/mage/legacy-progression.ts");
const { mageExperienceLabel } = await vite.ssrLoadModule("/game-lines/mage/experience-presentation.ts");

const mage = (overrides = {}) => ({
  skills: { Investigation: 2, Academics: 2 },
  line_data: {
    gnosis: 2,
    path: "Moros",
    order: "Orderless",
    arcana: { Time: 2 },
    praxes: [],
    ...overrides,
  },
});

const meritCatalog = (await Promise.all([
  "public/shared/data/merits.json", "public/game-lines/mage/data/merits.json", "public/game-lines/mage/data/merits-supplements.json",
].map(path => readFile(new URL(`../${path}`, import.meta.url), "utf8").then(JSON.parse)))).flat();

test("Legacy Merit references reconcile with canonical Core/Mage catalog identities", () => {
  for (const legacy of LEGACIES) {
    for (const requirements of [legacy.entryRequirements, ...legacy.attainments.map(item => item.requirements)].filter(Boolean)) {
      for (const id of [...(requirements.merits ?? []).map(item => item.definitionId), ...(requirements.anyMerits ?? []).flatMap(item => item.definitionIds)]) {
        assert.equal(meritCatalog.filter(item => item.id === id).length, 1, `${legacy.id}: ${id}`);
      }
    }
  }
});

test("Nighthawks entry and first Attainment use Awakened Status ID and Mysterium domain", () => {
  const definition = LEGACIES.find(item => item.id === "nighthawks");
  const character = { ...mage({ order: "Mysterium", arcana: { Matter: 1, Prime: 2 } }), skills: { Larceny: 2, Academics: 1 }, merits: [{ definitionId: "mta-2ed:awakened-status", instanceId: "order-status", name: "Rótulo autoral", dots: 1, configuration: { domain: "Mysterium" } }] };
  const before = structuredClone(character);
  const check = (sheet, catalog = meritCatalog) => [legacyEntryPrerequisites(sheet, definition, catalog).met, legacyAttainmentPrerequisites(sheet, definition, 1, catalog)];
  assert.deepEqual(check(character), [true, true]);
  assert.deepEqual(check(character, []), [false, false]);
  for (const definitionId of ["core-2ed:status", "homebrew:merit:status", "unavailable:status"]) {
    assert.deepEqual(check({ ...character, merits: [{ ...character.merits[0], definitionId, name: "Order Status (Mysterium)", dots: 5 }] }), [false, false]);
  }
  assert.deepEqual(check({ ...character, merits: [{ ...character.merits[0], configuration: { domain: "Silver Ladder" } }] }), [false, false]);
  const oldSelection = { name: "Awakened Status", sourceId: "mta-2ed", dots: 1, configuration: { domain: "Mysterium" } };
  assert.deepEqual(check({ ...character, merits: [oldSelection] }), [true, true]);
  assert.deepEqual(check({ ...character, merits: [{ ...oldSelection, name: "Status do Desperto" }] }), [false, false]);
  assert.deepEqual(character, before);
});

test("Legacy Status alternatives resolve IDs without pooling independent instances or matching Homebrew namesakes", () => {
  const definition = LEGACIES.find(item => item.id === "tyrian-archons");
  const character = { ...mage({ path: "Obrimos", arcana: { Prime: 2 } }), skills: { Expression: 2 }, merits: [{ definitionId: "mta-signs:profane-tool", instanceId: "tool", name: "Ferramenta autoral", dots: 1 }] };
  const status = { definitionId: "mta-2ed:awakened-status", instanceId: "order", name: "Status renomeado", dots: 3 };
  const check = selections => legacyEntryPrerequisites({ ...character, merits: [...character.merits, ...selections] }, definition, meritCatalog).met;
  for (const definitionId of definition.entryRequirements.anyMerits[0].definitionIds) assert.equal(check([{ ...status, definitionId }]), true, definitionId);
  for (const definitionId of ["homebrew:merit:status", "unavailable:status"]) assert.equal(check([{ ...status, definitionId, name: "Awakened Status" }]), false);
  assert.equal(check([{ ...status, dots: 2 }, { ...status, instanceId: "other-order", dots: 1 }]), false);
  assert.equal(check([{ name: "Mystery Cult Influence", dots: 3 }]), false);
  assert.equal(check([{ name: "Mystery Cult Influence", sourceId: "mta-2ed", dots: 3 }]), true);
  assert.equal(check([{ name: "Not Really Status", dots: 5 }]), false);
});

test("House of Ariadne Contacts and Sleeper Status requirements keep identities after JSON round-trip", () => {
  const definition = LEGACIES.find(item => item.id === "house-of-ariadne");
  const character = { ...mage({ gnosis: 8, arcana: { Time: 5 } }), skills: { Streetwise: 4 }, merits: [{ definitionId: "core-2ed:contacts", instanceId: "contacts", name: "Contatos autorais", dots: 3 }, { definitionId: "core-2ed:status", instanceId: "status", name: "Organização local", dots: 2 }] };
  assert.equal(legacyAttainmentPrerequisites(JSON.parse(JSON.stringify(character)), definition, 5, meritCatalog), true);
  for (const definitionId of ["mta-2ed:awakened-status", "homebrew:merit:status", "unavailable:status"]) {
    assert.equal(legacyAttainmentPrerequisites({ ...character, merits: [character.merits[0], { ...character.merits[1], definitionId, name: "Status" }] }, definition, 5, meritCatalog), false);
  }
  assert.equal(legacyAttainmentPrerequisites({ ...character, merits: [{ ...character.merits[0], definitionId: "homebrew:merit:contacts", name: "Contacts" }, character.merits[1]] }, definition, 3, meritCatalog), false);
});

test("The Eleventh Question contains the complete five-rank progression", () => {
  assert.equal(ELEVENTH_QUESTION.rulingArcanum, "Time");
  assert.deepEqual(
    ELEVENTH_QUESTION.attainments.map((item) => [item.rank, item.orthodoxGnosis, item.novelGnosis]),
    [[1, 2, 3], [2, 2, 3], [3, 4, 5], [4, 6, 7], [5, 8, 9]],
  );
  assert.equal(ELEVENTH_QUESTION.yantras.length, 4);
  assert.equal(ELEVENTH_QUESTION.oblations.length, 4);
});

test("Legacy entry accepts parentage or the Perfect Timing Praxis", () => {
  assert.equal(eleventhQuestionPrerequisites(mage()).met, true);
  assert.equal(
    eleventhQuestionPrerequisites(mage({ path: "Acanthus", order: "Silver Ladder" })).met,
    false,
  );
  assert.equal(
    eleventhQuestionPrerequisites(
      mage({ path: "Acanthus", order: "Silver Ladder", praxes: [{ name: "Perfect Timing" }] }),
    ).met,
    true,
  );
});

test("Chronologue prerequisites and progression are enforced by domain functions", () => {
  assert.equal(CHRONOLOGUE.source, "Night Horrors: Nameless and Accursed");
  assert.deepEqual(CHRONOLOGUE.attainments.map((item) => item.name), [
    "If-Then-Else",
    "Possibility Matrix",
  ]);

  const initiate = mage({ path: "Acanthus", order: "Orderless", arcana: { Time: 2, Fate: 1 } });
  initiate.skills = { Computer: 2 };
  assert.equal(legacyEntryPrerequisites(initiate, CHRONOLOGUE).met, true);

  initiate.skills.Computer = 3;
  assert.equal(legacyAttainmentPrerequisites(initiate, CHRONOLOGUE, 2), true);
});

test("Engineers of the System is present with its canonical progression", () => {
  assert.equal(LEGACIES.length, 16);
  assert.equal(ENGINEERS_OF_THE_SYSTEM.source, "Tome of the Pentacle");
  assert.equal(ENGINEERS_OF_THE_SYSTEM.page, 157);
  assert.deepEqual(ENGINEERS_OF_THE_SYSTEM.attainments.map((item) => item.name), [
    "See the Bones and Gears",
    "Rebuild the Living Machine",
    "Become the Ecosystem",
  ]);
});

test("the audited regular Legacy catalog includes all 13 additions and excludes deferred variants", () => {
  const expected = new Map([
    ["house-of-ariadne", 5], ["perfected-adepts", 1], ["nighthawks", 2],
    ["tyrian-archons", 3], ["shapers-of-the-invisible", 3], ["logophages", 2],
    ["reality-stalkers", 1], ["stone-scribes", 2], ["illumined-path", 1],
    ["intendants-of-the-building", 3], ["nagaraja", 5],
    ["keepers-of-the-covenant", 2], ["kitchen-alchemists", 3],
  ]);
  assert.equal(new Set(LEGACIES.map((item) => item.id)).size, 16);
  for (const [id, ranks] of expected) {
    const legacy = LEGACIES.find((item) => item.id === id);
    assert.ok(legacy, id);
    assert.equal(legacy.attainments.length, ranks, id);
  }
  assert.deepEqual(
    LEGACIES.filter((item) => /Hand of Destiny|Keepers of the Chrysalis|Tremere|House Nagaraja/i.test(item.name)),
    [],
  );
});

test("Legacy prerequisites consume canonical English stored trait keys", () => {
  const checks = eleventhQuestionPrerequisites(mage());
  assert.deepEqual(
    {
      time: checks.time,
      investigation: checks.investigation,
      qualifying: checks.qualifying,
      met: checks.met,
    },
    { time: true, investigation: true, qualifying: true, met: true },
  );
});

test("a player-created Legacy requires its founder to have Gnosis 3 and Ruling Arcanum 2", () => {
  const definition = { ...ELEVENTH_QUESTION, id: "homebrew:legacy:test", homebrew: true, founderCharacterId: "founder", rulingArcanum: "Time" };
  assert.equal(legacyEntryPrerequisites({ id: "founder", ...mage({ gnosis: 3 }) }, definition).met, true);
  assert.equal(legacyEntryPrerequisites({ id: "founder", ...mage({ gnosis: 2 }) }, definition).met, false);
  assert.equal(legacyEntryPrerequisites({ id: "founder", ...mage({ gnosis: 3, arcana: { Time: 1 } }) }, definition).met, false);
});

test("Legacy state normalization keeps only valid unique ranks", () => {
  assert.deepEqual(
    normalizeLegacyState({
      definitionId: "the-eleventh-question",
      joined: true,
      attainmentRanks: [3, 1, 3, 9],
      initiationMethod: "tutelage",
    }),
    {
      definitionId: "the-eleventh-question",
      joined: true,
      attainmentRanks: [1, 3],
      initiationMethod: "tutelage",
    },
  );
});

test("Legacy refund restores removed Praxis and only its transaction delta", () => {
  const sheet = {
    attributes: {},
    skills: {},
    merits: [],
    specializations: [],
    line_data: {
      legacy_state: {
        definitionId: "the-eleventh-question",
        joined: true,
        attainmentRanks: [1, 2],
      },
      praxes: [],
    },
    current_state: {},
  };
  const praxis = { id: "postcognition", name: "Postcognition" };

  refundMageAdvancement(sheet, {
    kind: "legacyAttainment",
    definitionId: "the-eleventh-question",
    rank: 2,
    removedPraxis: { key: "praxes", index: 0, item: praxis },
    creditedRegular: 0,
    creditedArcane: 1,
    creditedArcaneBeats: 1,
  });

  assert.deepEqual(sheet.line_data.legacy_state.attainmentRanks, [1]);
  assert.deepEqual(sheet.line_data.praxes, [praxis]);
});

test("discarding a Legacy refunds only Legacy purchases and preserves unrelated history", () => {
  const praxis = { id: "perfect-timing", name: "Perfect Timing" };
  const sheet = {
    attributes: {},
    skills: {},
    merits: [],
    specializations: [],
    line_data: {
      legacy_state: {
        definitionId: "the-eleventh-question",
        joined: true,
        attainmentRanks: [1],
      },
      praxes: [],
    },
    current_state: {
      mage_experience_available: 2,
      arcane_experience_available: 1,
      mage_experience_spent: 2,
      arcane_experience_spent: 0,
      arcane_experience_beats: 2,
      mage_experience_history: [
        {
          id: "other",
          regular: 1,
          arcane: 0,
          undo: { kind: "trait", group: "skills", name: "Occult" },
        },
        {
          id: "legacy",
          regular: 1,
          arcane: 0,
          undo: {
            kind: "legacyInitiation",
            definitionId: "the-eleventh-question",
            previousState: undefined,
            removedPraxis: { key: "praxes", index: 0, item: praxis },
            creditedRegular: 0,
            creditedArcane: 0,
            creditedArcaneBeats: 2,
          },
        },
      ],
    },
  };

  const discarded = discardLegacyAdvancements(sheet);

  assert.equal(discarded.line_data.legacy_state, undefined);
  assert.deepEqual(discarded.line_data.praxes, [praxis]);
  assert.equal(discarded.current_state.mage_experience_available, 3);
  assert.equal(discarded.current_state.arcane_experience_available, 1);
  assert.equal(discarded.current_state.mage_experience_spent, 1);
  assert.equal(discarded.current_state.arcane_experience_beats, 0);
  assert.deepEqual(
    discarded.current_state.mage_experience_history.map((item) => item.id),
    ["other"],
  );
});

const legacyId = "the-eleventh-question";
const legacySelection = { definitionId: legacyId, joined: false, attainmentRanks: [], initiationMethod: "" };
const legacyReceipt = (kind = "legacyInitiation", overrides = {}) => ({
  id: kind, regular: 1, arcane: 0, createdAt: "2026-10-02T00:00:00Z",
  undo: { kind, definitionId: legacyId, ...(kind === "legacyInitiation" ? { previousState: legacySelection } : { rank: 2 }), creditedRegular: 0, creditedArcane: 0, creditedArcaneBeats: 0 },
  ...overrides,
});
const purchasedLegacy = (ranks = [1]) => ({
  attributes: {}, skills: {}, merits: [], specializations: [],
  line_data: { legacy_state: { ...legacySelection, joined: true, attainmentRanks: ranks }, praxes: [] },
  current_state: { mage_experience_available: 2, arcane_experience_available: 2, mage_experience_spent: 2, arcane_experience_spent: 2, arcane_experience_beats: 2, mage_experience_history: [legacyReceipt()] },
});

test("Legacy receipts display their definition ID and Attainment rank in both locales, never the selected namesake", () => {
  const sheet = purchasedLegacy();
  const namesake = { ...ELEVENTH_QUESTION, id: "other:legacy", name: ELEVENTH_QUESTION.name, attainments: [{ rank: 2, name: "Authored Attainment" }] };
  const catalog = [ELEVENTH_QUESTION, namesake];
  for (const [locale, initiation] of [["en-US", "Initiation"], ["pt-BR", "Iniciação"]]) {
    const entry = legacyReceipt();
    const before = structuredClone(entry);
    assert.equal(mageExperienceLabel(entry, sheet, [], [], locale, catalog), `${ELEVENTH_QUESTION.name} · ${initiation}`);
    assert.deepEqual(entry, before);
    const attainment = legacyReceipt("legacyAttainment"); attainment.undo.definitionId = namesake.id;
    assert.equal(mageExperienceLabel(attainment, sheet, [], [], locale, catalog), `${namesake.name} · 2. Authored Attainment`);
    const unavailable = legacyReceipt(); unavailable.undo.definitionId = "unavailable:legacy";
    assert.equal(mageExperienceLabel(unavailable, sheet, [], [], locale, catalog), `unavailable:legacy · ${initiation}`);
    const opaque = { description: "Texto autoral preservado", regular: 1, arcane: 0, undo: { kind: "legacyAttainment", rank: 2 } };
    assert.equal(mageExperienceLabel(opaque, sheet, [], [], locale, catalog), opaque.description);
  }
});

test("schema-2 Legacy receipts recover identity only from verified pre-purchase selection, without rewriting them", () => {
  const initiation = legacyReceipt(); delete initiation.undo.definitionId;
  const attainment = legacyReceipt("legacyAttainment", { before: { line_data: { legacy_state: { ...legacySelection, joined: true, attainmentRanks: [1] } } } });
  delete attainment.undo.definitionId;
  for (const entry of [initiation, attainment]) {
    const before = structuredClone(entry);
    assert.equal(legacyUndoForEntry(entry).definitionId, legacyId);
    assert.deepEqual(entry, before);
  }
  const opaque = { description: `${ELEVENTH_QUESTION.name} · Initiation`, undo: { kind: "legacyInitiation", previousState: undefined } };
  assert.equal(legacyUndoForEntry(opaque), undefined);
  const invalidExplicit = { ...initiation, undo: { ...initiation.undo, definitionId: "" } };
  assert.equal(legacyUndoForEntry(invalidExplicit), undefined);
  for (const state of [undefined, { ...legacySelection, joined: true }, { ...legacySelection, joined: true, attainmentRanks: [2] }, { ...legacySelection, joined: true, attainmentRanks: [1, 3] }]) {
    assert.equal(legacyUndoForEntry({ ...attainment, before: { line_data: { legacy_state: state } } }), undefined);
  }
});

test("Legacy refunds validate exact receipt, cost, later Attainments, and credited resources atomically", () => {
  for (const invalidate of [
    sheet => { sheet.current_state.mage_experience_history[0].undo.definitionId = "other:legacy"; },
    sheet => { sheet.line_data.legacy_state.attainmentRanks = [1, 2]; },
    sheet => { sheet.current_state.mage_experience_history[0].regular = 2; },
    sheet => { sheet.current_state.mage_experience_history[0].arcane = -1; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.previousState = { ...legacySelection, definitionId: "other:legacy" }; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.creditedArcane = 1; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.creditedArcaneBeats = 3; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.creditedArcaneBeats = 2; sheet.current_state.arcane_experience_beats = 1; },
    sheet => { sheet.current_state.mage_experience_spent = 0; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.removedPraxis = { key: "wrong", index: 0, item: { id: "converted" } }; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.removedPraxis = { key: "praxes", index: -1, item: { id: "converted" } }; },
    sheet => { sheet.current_state.mage_experience_history[0].undo.removedPraxis = { key: "praxes", index: 0, item: null }; },
    sheet => { sheet.current_state.mage_experience_history.push(structuredClone(sheet.current_state.mage_experience_history[0])); },
    sheet => { const praxis = { id: "converted" }; sheet.current_state.mage_experience_history[0].undo.removedPraxis = { key: "praxes", index: 0, item: praxis }; sheet.line_data.praxes = [praxis]; },
  ]) {
    const sheet = purchasedLegacy(); invalidate(sheet);
    const before = structuredClone(sheet);
    assert.equal(refundLegacyExperiencePurchase(sheet, "legacyInitiation"), false);
    assert.deepEqual(sheet, before);
  }
  const sheet = purchasedLegacy();
  const encoded = JSON.parse(JSON.stringify(sheet));
  assert.equal(refundLegacyExperiencePurchase(encoded, "legacyInitiation"), true);
  assert.deepEqual(encoded.line_data.legacy_state, legacySelection);
  assert.equal(encoded.current_state.mage_experience_available, 3);
  assert.equal(encoded.current_state.mage_experience_spent, 1);
  const once = structuredClone(encoded);
  assert.equal(refundLegacyExperiencePurchase(encoded, "legacyInitiation"), false);
  assert.deepEqual(encoded, once);
});

test("discard reverses the selected Legacy chain only, preserving unrelated receipts and failing atomically", () => {
  const sheet = purchasedLegacy([1, 2]);
  const praxis = { id: "converted", name: "Authored spell" };
  const initiation = legacyReceipt(); initiation.undo.removedPraxis = { key: "praxes", index: 0, item: praxis }; initiation.undo.creditedArcane = 1; initiation.undo.creditedArcaneBeats = 2;
  const other = legacyReceipt("legacyAttainment", { id: "other" }); other.undo.definitionId = "other:legacy";
  sheet.current_state.mage_experience_history = [legacyReceipt("legacyAttainment", { regular: 0, arcane: 1 }), initiation, other];
  const before = structuredClone(sheet);
  const discarded = discardLegacyAdvancements(sheet);
  assert.deepEqual(sheet, before);
  assert.equal(discarded.line_data.legacy_state, undefined);
  assert.deepEqual(discarded.line_data.praxes, [praxis]);
  assert.deepEqual(discarded.current_state.mage_experience_history, [other]);
  assert.deepEqual([discarded.current_state.mage_experience_available, discarded.current_state.arcane_experience_available, discarded.current_state.mage_experience_spent, discarded.current_state.arcane_experience_spent, discarded.current_state.arcane_experience_beats], [3, 2, 1, 1, 0]);
  const invalid = structuredClone(sheet); invalid.current_state.arcane_experience_beats = 0;
  const invalidBefore = structuredClone(invalid);
  assert.equal(discardLegacyAdvancements(invalid), null);
  assert.deepEqual(invalid, invalidBefore);
  const opaque = structuredClone(sheet); delete opaque.current_state.mage_experience_history[0].undo.definitionId;
  assert.equal(discardLegacyAdvancements(opaque), null);
});

test("Legacy UI stores semantic identities and deltas, not translated descriptions or whole-sheet snapshots", async () => {
  const source = await readFile(new URL("../game-lines/mage/legacy-page.tsx", import.meta.url), "utf8");
  assert.match(source, /kind:"legacyInitiation",definitionId:definition\.id/);
  assert.match(source, /kind:"legacyAttainment",definitionId:definition\.id,rank:attainment\.rank/);
  assert.match(source, /undo:structuredClone\(finalUndo\)/);
  assert.match(source, /legacyEntryPrerequisites\(character,definition,meritCatalog\)/);
  assert.match(source, /legacyAttainmentPrerequisites\(character,definition,attainment.rank,meritCatalog\)/);
  const sheetSource = await readFile(new URL("../game-lines/mage/sheet-view.tsx", import.meta.url), "utf8");
  assert.equal((sheetSource.match(/<LegacyPage\s+meritCatalog=\{meritCatalog\}/g) ?? []).length, 3);
  assert.doesNotMatch(source, /description:string|before:\{|savePurchase\(next,`/);
});
