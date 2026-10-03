import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { requirementMet, textRequirementMet, statusRating } = await vite.ssrLoadModule("/lib/merit-requirements.ts");
const { meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
const { changelingMeritPrerequisitesMet } = await vite.ssrLoadModule("/game-lines/changeling/merit-context.ts");
const { MAGE_STATUS_REQUIREMENTS } = await vite.ssrLoadModule("/game-lines/mage/merits.ts");
const official = { id: "core-2ed:mentor", name: "Mentor", sourceId: "core-2ed" };
const fake = { ...official, id: "homebrew:merit:mentor", sourceId: "homebrew:core-merits" };
const context = { gameLine: "CofD", meritCatalog: [official, fake], merits: [{ definitionId: official.id, name: "Mentor renomeado", dots: 3 }] };

test("structured and printed requirements use definition IDs despite renamed labels", () => {
  assert.equal(requirementMet({ merit: official.id, minimum: 3 }, context), true);
  assert.equal(textRequirementMet("Mentor •••", context, context.meritCatalog), true);
  for (const definitionId of [fake.id, "unavailable:mentor"]) {
    const changed = { ...context, merits: [{ definitionId, name: official.name, dots: 5 }] };
    assert.equal(requirementMet({ merit: official.id }, changed), false);
    assert.equal(textRequirementMet("Mentor •", changed, changed.meritCatalog), false);
  }
  assert.equal(requirementMet({ merit: "unavailable:mentor" }, context), false);
});

test("legacy requirement names and owned selections never guess between namesakes", () => {
  assert.equal(requirementMet({ merit: "Mentor" }, context), false);
  const unambiguous = { ...context, meritCatalog: [official], merits: [{ name: "Mentor", sourceId: "core-2ed", dots: 2 }] };
  assert.equal(requirementMet({ merit: "Mentor", minimum: 2 }, unambiguous), true);
  assert.equal(requirementMet({ merit: official.id }, { ...context, merits: [{ name: "Mentor", dots: 5 }] }), false);
  assert.equal(requirementMet({ merit: official.id }, { ...context, merits: [{ name: "Mentor", sourceId: "core-2ed", dots: 1 }] }), true);
  assert.equal(requirementMet({ merit: official.id }, { ...unambiguous, merits: [{ name: "Mentor renomeado", dots: 5 }] }), false);
});

test("exclusions resolve both directions by canonical ID", () => {
  const a = { ...official, id: "a:merit", name: "First", excludes: ["b:merit"] };
  const b = { ...official, id: "b:merit", name: "Second" };
  const catalog = [a, b, fake];
  assert.equal(meritPrerequisitesMet(a, { ...context, meritCatalog: catalog, merits: [{ definitionId: b.id, name: "Outro rótulo", dots: 1 }] }), false);
  assert.equal(meritPrerequisitesMet(b, { ...context, meritCatalog: catalog, merits: [{ definitionId: a.id, name: "Outro rótulo", dots: 1 }] }), false);
  assert.equal(meritPrerequisitesMet(b, { ...context, meritCatalog: catalog, merits: [{ definitionId: fake.id, name: a.name, dots: 1 }] }), true);
});

test("Status domains require line-supplied identities, not names ending in Status", () => {
  const status = { id: "mta-2ed:awakened-status", name: "Awakened Status", sourceId: "mta-2ed" };
  const ctx = { ...context, ...MAGE_STATUS_REQUIREMENTS, gameLine: "MtA", meritCatalog: [status, { ...status, id: "homebrew:merit:status", sourceId: "homebrew:mage-merits" }], merits: [{ definitionId: status.id, name: "Status do Desperto", dots: 2, configuration: { domain: "Adamantine Arrow" } }] };
  assert.equal(statusRating(ctx, "Adamantine Arrow"), 2);
  assert.equal(textRequirementMet("Arrow Status ••", ctx, ctx.meritCatalog), true);
  assert.equal(statusRating({ ...ctx, merits: [{ ...ctx.merits[0], definitionId: "homebrew:merit:status", name: "Awakened Status" }] }, "any"), 0);
  assert.equal(statusRating({ ...ctx, statusMeritIds: [] }, "any"), 0);
  assert.equal(textRequirementMet("Awakened Status ••", ctx, ctx.meritCatalog), true);
  assert.equal(textRequirementMet("Awakened Status ••", { ...ctx, archetypes: ["awakened"], merits: [{ ...ctx.merits[0], definitionId: "homebrew:merit:status" }] }, ctx.meritCatalog), false);
});

test("new Homebrew references round-trip IDs and display current EN/PT labels, not IDs", async () => {
  const { normalizeMeritHomebrew, normalizeMeritHomebrews } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const { meritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
  const reference = { ...official, translatedName: "Mentor atualizado", description: "Descrição", descriptionEn: "Description" };
  const item = normalizeMeritHomebrew({ id: "homebrew:merit:referenced", name: "Authored", line: "Core", category: "Social", ratings: [1], description: "Authored description", requirements: { all: [{ merit: official.id, name: "Old canonical label", minimum: 2 }, { trait: "Presence", minimum: 2 }] }, narrativePrerequisites: "Authored requirement" });
  const before = JSON.stringify(item);
  const restored = normalizeMeritHomebrews(JSON.parse(JSON.stringify([item])))[0];
  assert.equal(restored.requirements.all[0].merit, official.id);
  assert.equal(meritPresentation(restored, "en-US", [reference]).prerequisites, "Mentor 2; Presence 2; Authored requirement");
  assert.equal(meritPresentation(restored, "pt-BR", [reference]).prerequisites, "Mentor atualizado 2; Presença 2; Authored requirement");
  assert.equal(meritPresentation(restored, "pt-BR", []).prerequisites, "Old canonical label 2; Presença 2; Authored requirement");
  assert.equal(JSON.stringify(item), before);
  assert.equal(meritPrerequisitesMet(restored, { ...context, attributes: { Presence: 2 } }), true);
  assert.equal(meritPrerequisitesMet(restored, { ...context, attributes: { Presence: 2 }, merits: [{ definitionId: fake.id, name: "Mentor", dots: 5 }] }), false);
});

test("Court access resolves canonical catalog references and cannot use Homebrew Goodwill or Mantle", () => {
  const mantle = { id: "ctl-2ed:mantle", name: "Mantle", sourceId: "ctl-2ed" };
  const goodwill = { id: "ctl-2ed:court-goodwill", name: "Court Goodwill", sourceId: "ctl-2ed" };
  const fakeGoodwill = { ...goodwill, id: "homebrew:merit:goodwill", sourceId: "homebrew:changeling-merits" };
  const fakeMantle = { ...mantle, id: "homebrew:merit:mantle", sourceId: "homebrew:changeling-merits" };
  const required = { id: "h-courts:test", name: "Test", courtAccess: [{ court: "Autumn", mantle: 3, courtGoodwill: 5 }] };
  const ctx = { gameLine: "CtL", court: "autumn", meritCatalog: [mantle, goodwill, fakeGoodwill, fakeMantle] };
  assert.equal(changelingMeritPrerequisitesMet(required, { ...ctx, merits: [{ definitionId: goodwill.id, name: "Rótulo traduzido", dots: 5, configuration: { court: "autumn" } }] }), true);
  assert.equal(changelingMeritPrerequisitesMet(required, { ...ctx, merits: [{ definitionId: fakeGoodwill.id, name: goodwill.name, dots: 5, configuration: { court: "autumn" } }] }), false);
  assert.equal(changelingMeritPrerequisitesMet(required, { ...ctx, merits: [{ definitionId: mantle.id, name: "Rótulo traduzido", dots: 3 }] }), true);
  assert.equal(changelingMeritPrerequisitesMet(required, { ...ctx, merits: [{ definitionId: fakeMantle.id, name: mantle.name, dots: 5 }] }), false);
});
