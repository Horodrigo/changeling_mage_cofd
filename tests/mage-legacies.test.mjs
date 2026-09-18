import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

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
} = await vite.ssrLoadModule("/lib/legacies.ts");

const { refundMageAdvancement } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { discardLegacyAdvancements } = await vite.ssrLoadModule("/lib/legacy-progression.ts");

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
  assert.deepEqual(LEGACIES.map((item) => item.name), [
    "The Eleventh Question",
    "Chronologue",
    "Engineers of the System",
  ]);
  assert.equal(ENGINEERS_OF_THE_SYSTEM.source, "Tome of the Pentacle");
  assert.equal(ENGINEERS_OF_THE_SYSTEM.page, 157);
  assert.deepEqual(ENGINEERS_OF_THE_SYSTEM.attainments.map((item) => item.name), [
    "See the Bones and Gears",
    "Rebuild the Living Machine",
    "Become the Ecosystem",
  ]);
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
      mage_experience_spent: 1,
      arcane_experience_spent: 1,
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
          arcane: 1,
          undo: {
            kind: "legacyInitiation",
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
  assert.equal(discarded.current_state.arcane_experience_available, 2);
  assert.equal(discarded.current_state.arcane_experience_beats, 0);
  assert.deepEqual(
    discarded.current_state.mage_experience_history.map((item) => item.id),
    ["other"],
  );
});
