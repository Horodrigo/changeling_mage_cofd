import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false, ws: false }, resolve: { alias: { "@": root } }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const powers = JSON.parse(readFileSync(new URL("../public/game-lines/vampire/data/powers.json", import.meta.url), "utf8"));
const { ORTAM_RECIPE_IDS: ids, ortamRecipeSelections: selections } = await vite.ssrLoadModule("/game-lines/vampire/ortam-recipes.ts");
const { refundVampireAdvancement: refund } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");

test("Sin Again p. 40 Ortam grants three initial recipes including Essence, then two per dot, by canonical identity", () => {
  assert.deepEqual(new Set(ids), new Set(powers.devotions.filter(item => item.category === "Ortam Recipes").map(item => item.id)));
  const catalog = powers.devotions.map(item => ({ ...item, name: "Renamed", translatedName: "Autoral" }));
  assert.deepEqual(selections(catalog, new Set(), [], 0, 1), [ids[0], "", ""]);
  assert.deepEqual(selections(catalog, new Set(), [ids[10], ids[2], ids[3]], 0, 1), [ids[0], ids[2], ids[3]]);
  assert.deepEqual(selections(catalog, new Set(ids.slice(0, 3)), [ids[3], ids[4]], 1, 2), ids.slice(3, 5));
  assert.deepEqual(selections(catalog, new Set(), ids, 0, 5), ids);
  assert.deepEqual(selections(catalog, new Set(ids), [], 4, 5), []);
  assert.deepEqual(selections(catalog, new Set([ids[1]]), [ids[1], ids[2]], 1, 2), ["", ids[2]]);
  assert.deepEqual(selections(catalog, new Set(), [ids[1], ids[1]], 1, 2), [ids[1], ""]);
  assert.deepEqual(selections(catalog.filter(item => item.id !== ids[0]), new Set(), ids, 0, 1), ["", ids[1], ids[2]]);
  assert.deepEqual(selections(catalog, new Set(), ["homebrew:namesake", "unavailable"], 1, 2), ["", ""]);
  for (const [current, target] of [[0, 0], [-1, 1], [1, 6], [0.5, 2], [2, NaN]]) assert.equal(selections(catalog, new Set(), [], current, target), null);
});

test("Ortam receipts refund only their own recipes and reject incoherent or dependent changes atomically", () => {
  const sheet = () => ({ merits: [], line_data: { disciplines: { Ortam: 2 }, devotion_ids: [...ids.slice(0, 5), "authored-choice"] }, current_state: { experience_available: 4, vampire_experience_history: [{ id: "old", description: "Autoral" }] } });
  const undo = { kind: "discipline", name: "Ortam", amount: 1, recipes: { disciplineId: "ortam", ids: ids.slice(3, 5), rating: 2, cost: 3 } };
  const character = sheet(), state = structuredClone(character.current_state);
  assert.equal(refund(character, undo, powers), true);
  assert.equal(character.line_data.disciplines.Ortam, 1);
  assert.deepEqual(character.line_data.devotion_ids, [...ids.slice(0, 3), "authored-choice"]);
  assert.deepEqual(character.current_state, state);
  for (const patch of [{ ids: [ids[3], ids[3]] }, { ids: ["authored-choice"] }, { ids: ["missing"] }, { rating: 1 }, { cost: 4 }, { disciplineId: "homebrew:ortam" }]) {
    const candidate = sheet(), before = structuredClone(candidate);
    assert.equal(refund(candidate, { ...undo, recipes: { ...undo.recipes, ...patch } }, powers), false);
    assert.deepEqual(candidate, before);
  }
  const dependent = sheet();
  dependent.line_data.devotion_ids.push("dependent");
  const before = structuredClone(dependent);
  assert.equal(refund(dependent, undo, { ...powers, devotions: [...powers.devotions, { id: "dependent", requiredDevotionIds: [ids[3]] }] }), false);
  assert.deepEqual(dependent, before);
  const legacy = sheet();
  assert.equal(refund(legacy, { kind: "discipline", name: "Ortam", amount: 1 }, powers), true);
  assert.deepEqual(legacy.line_data.devotion_ids, sheet().line_data.devotion_ids, "Old receipts never infer which recipes were granted");
});

test("Ortam XP and creation advancement choose recipes in EN/PT/EN and retain exact receipts through refunds", async () => {
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const server = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false, ws: false }, resolve: { alias: { "@": root } }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "ortam-test", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/app/use-homebrew.ts")) return 'export const useHomebrewPreferences = () => ({ disabledIds: [] });';
      if (path.endsWith("/game-lines/vampire/experience-panel.tsx")) return ("export let testBuy, testRevert;\n" + code)
        .replace('useState<PurchaseType>("attribute")', 'useState<PurchaseType>("discipline")')
        .replace('const [target, setTarget] = useState("");', 'const [target, setTarget] = useState("Ortam");')
        .replace('useState<string[]>([])', 'useState<string[]>(character.current_state.testRecipes ?? [])')
        .replace("  return <", "  testBuy = buy; testRevert = revert;\n  return <");
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const experienceModule = await server.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await server.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, JSON.parse(readFileSync(new URL(`../public/game-lines/vampire/data/${group}.json`, import.meta.url), "utf8"))]));
      const catalogs = { get: id => ({ "vampire-powers": powers, "vampire-reference": reference, "core-merits": [], "vampire-merits": [] })[id] };
      for (const builderMode of [false, true]) {
        const sheet = blankPrintCharacter("VtR");
        sheet.line_data = { ...sheet.line_data, clan_id: "daeva", bloodline_id: "gulikan", disciplines: { Ortam: 0 }, devotion_ids: ["authored-choice"] };
        sheet.current_state = { ...sheet.current_state, experience_available: 10, experience_spent: 0, experience_total: 10 };
        const updates = [];
        const render = character => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(experienceModule.VampireExperiencePanel, { character, catalogs, builderMode, updateSheet: value => updates.push(value) })));
        const before = structuredClone(sheet);
        assert.match(render(sheet), locale === "pt-BR" ? /Receita gratuita de Ortam/ : /Free Ortam recipe/);
        experienceModule.testBuy();
        assert.equal(updates.length, 0, "Unchosen recipes prevent a charge");
        assert.deepEqual(sheet, before);
        sheet.current_state.testRecipes = ids.slice(0, 3);
        render(sheet); experienceModule.testBuy();
        assert.equal(updates.length, 1);
        const bought = updates.pop(), receipt = bought.current_state.vampire_experience_history.at(-1);
        assert.deepEqual(bought.line_data.devotion_ids, ["authored-choice", ...ids.slice(0, 3)]);
        assert.deepEqual(receipt.undo.recipes, { disciplineId: "ortam", ids: ids.slice(0, 3), rating: 1, cost: 3 });
        bought.current_state.testRecipes = ids.slice(3, 5);
        render(bought); experienceModule.testBuy();
        assert.equal(updates.length, 1);
        const upgraded = updates.pop(), laterReceipt = upgraded.current_state.vampire_experience_history.at(-1);
        assert.deepEqual(upgraded.line_data.devotion_ids, ["authored-choice", ...ids.slice(0, 5)]);
        render(upgraded); experienceModule.testRevert(receipt);
        assert.equal(updates.length, 0, "Later Ortam dots must be refunded first");
        render(upgraded); experienceModule.testRevert(laterReceipt);
        assert.deepEqual(updates.pop().line_data.devotion_ids, bought.line_data.devotion_ids);
        render(bought); experienceModule.testRevert({ ...receipt, cost: 4 });
        assert.equal(updates.length, 0, "Forged cost cannot restore XP");
        render(bought); experienceModule.testRevert(receipt);
        assert.equal(updates.length, 1);
        assert.deepEqual(updates[0].line_data.devotion_ids, ["authored-choice"]);
        assert.equal(updates[0].line_data.disciplines.Ortam, 0);
        assert.equal(updates[0].current_state.experience_available, builderMode ? bought.current_state.experience_available + 3 : 10);
      }
    } finally { await server.close(); }
  }
});
