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
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const fields = ["summary", "cost", "requirement", "condition", "dicePool", "action", "duration", "contestedBy", "resistedBy", "sacrament", "effect", "procedure", "outcome"];

test("Vampire official and Homebrew power presentations cover existing fields and preserve numeric limits", () => {
  assert.deepEqual(selected.map(item => item.id).sort(), ["animalism", "truths-of-erebus"]);
  assert.equal(selected.flatMap(item => item.levels).length, 10);
  for (const definition of selected) {
    for (const item of [definition, ...definition.levels]) {
      assert.ok(item.presentationPt, `${definition.id}.${item.rating ?? "summary"}`);
      for (const field of fields.filter(key => item[key])) {
        assert.ok(item.presentationPt[field]?.trim(), `${definition.id}.${item.rating ?? "summary"}.${field}`);
        assert.deepEqual(item.presentationPt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? []);
      }
      assert.deepEqual(Object.keys(item.presentationPt.rollResults ?? {}).sort(), Object.keys(item.rollResults ?? {}).sort());
      for (const [result, text] of Object.entries(item.rollResults ?? {})) {
        assert.ok(item.presentationPt.rollResults[result]?.trim());
        assert.deepEqual(item.presentationPt.rollResults[result].match(/\d+/g) ?? [], text.match(/\d+/g) ?? []);
      }
    }
  }
  assert.equal(selected.find(item => item.id === "truths-of-erebus").translatedName, "Verdades de Erebus");
  assert.match(selected.find(item => item.id === "animalism").levels[0].presentationPt.dicePool, /Empatia com Animais/);
});

test("Vampire creation, XP, Desktop/Mobile cards and Homebrew render EN/PT/EN without changing purchases or canonical parser inputs", async () => {
  const dataBefore = JSON.stringify(powers);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "power-locale-test-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { DisciplineCards };`;
      if (path.endsWith("/game-lines/vampire/experience-panel.tsx")) return code.replace('useState<PurchaseType>("attribute")', 'useState<PurchaseType>("discipline")');
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
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
      const { vampireDisciplinePrerequisitesMet } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
      const { vampireExperienceLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
      const { VampireExperiencePanel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
      const { DisciplineCards } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { vampireBuilder } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const { normalizeVampireCatalogHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/catalog-homebrews.ts");
      const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, read(`public/game-lines/vampire/data/${group}.json`)]));
      const catalogs = { get: id => ({ "vampire-powers": catalog, "vampire-reference": reference, "core-merits": [], "vampire-merits": [], "vampire-conditions": [] })[id] };
      const character = blankPrintCharacter("VtR");
      const ratings = { Animalism: 5, "Truths of Erebus": 5 };
      character.line_data = { ...character.line_data, clan_id: "nosferatu", bloodline_id: "lygos", disciplines: ratings, notes: "Authored English stays." };
      character.current_state = { ...character.current_state, experience_available: 4, experience_spent: 9, creation_draft: true, creation_draft_step: 3 };
      const characterBefore = JSON.stringify(character);
      const noMutation = () => { throw new Error("Render changed the saved character"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const sheet = render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: ratings, coilRatings: {}, locale, onRaiseFamiliar: noMutation });
      const partial = render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: { Animalism: 3, "Truths of Erebus": 3 }, coilRatings: {}, locale, onRaiseFamiliar: noMutation });
      const experience = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
      const creation = render(vampireBuilder.Component, { player: "Player", initial: character, onCancel: noMutation, onSave: noMutation, onSaveDraft: noMutation, catalogs });
      const homebrew = render(vampireHomebrew.Component, { catalogs });
      for (const definition of catalog.disciplines.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.id, definition.id);
        assert.ok(Object.isFrozen(definition.presentationPt));
        if (locale === "en-US") assert.equal(presented, definition);
        for (const html of [sheet, experience]) assert.ok(html.includes(escape(presented.summary)), `${locale}: ${definition.id} summary`);
        if (definition.id === "animalism") assert.ok(creation.includes(escape(locale === "pt-BR" ? definition.translatedName : definition.name)));
        if (definition.id === "truths-of-erebus") assert.ok(homebrew.includes(escape(presented.summary)));
        for (const level of definition.levels) {
          const text = vampirePowerPresentation(level, locale);
          for (const field of fields.filter(key => text[key])) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(text[field])), `${locale}: ${definition.id}.${level.rating}.${field}`);
            if (definition.id === "truths-of-erebus") assert.ok(homebrew.includes(escape(text[field])));
          }
          for (const result of Object.values(text.rollResults ?? {})) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(result)));
          }
          assert.equal(partial.includes(escape(text.summary)), level.rating <= 3);
        }
        assert.equal(vampireDisciplinePrerequisitesMet(`${definition.name} 5`, ratings, catalog.disciplines.map(item => item.name)), true);
        const receipt = { id: "old-purchase", label: "Original label", rating: 5, cost: 4, undo: { kind: "discipline", name: definition.name, amount: 1 } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, [], catalog, locale), `${locale === "pt-BR" ? definition.translatedName : definition.name} 5`);
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const custom = normalizeVampireCatalogHomebrew({ entryType: "discipline", id: "homebrew:vampire:authored", name: "Animalism", summary: "Authored English stays.", levels: [{ rating: 1, name: "Feral Whispers", summary: "Authored level stays.", effect: "Authored effect stays." }] });
      assert.equal(vampirePowerPresentation(custom, locale), custom);
      assert.equal(vampirePowerPresentation(custom.levels[0], locale), custom.levels[0]);
      assert.equal(JSON.stringify(character), characterBefore);
      assert.equal(JSON.stringify(powers), dataBefore);
    } finally { await vite.close(); }
  }
});
