import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const canonical = read("public/game-lines/vampire/data/merits.json");
const portuguese = read("public/game-lines/vampire/data/merits-pt.json");
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

test("Vampire Portuguese Merits cover applicable fields, level identities and numeric limits in both official and Homebrew records", () => {
  assert.equal(canonical.length, 403);
  assert.equal(Object.keys(portuguese).length, 196);
  for (const [id, presented] of Object.entries(portuguese)) {
    const definition = canonical.find(item => item.id === id);
    assert.ok(definition, id);
    const fields = ["name", "description", ...["prerequisites", "alternativePrerequisites", "levels"].filter(key => definition[key])];
    assert.deepEqual(Object.keys(presented).sort(), fields.sort(), id);
    for (const key of fields.filter(key => key !== "levels")) {
      assert.ok(presented[key].trim(), `${id}.${key}`);
      assert.deepEqual(presented[key].match(/\d+|•+/g) ?? [], (key === "description" ? definition.descriptionEn : definition[key]).match(/\d+|•+/g) ?? [], `${id}.${key}`);
    }
    assert.deepEqual(presented.levels?.map(level => level.rating), definition.levels?.map(level => level.rating), id);
    for (const [index, level] of (presented.levels ?? []).entries()) {
      assert.ok(level.name.trim() && level.description.trim(), id);
      assert.deepEqual(level.description.match(/\d+/g) ?? [], definition.levels[index].description.match(/\d+/g) ?? [], id);
    }
  }
  const localized = canonical.filter(item => portuguese[item.id]);
  assert.equal(localized.filter(item => item.homebrew).length, 98);
  assert.equal(localized.filter(item => !item.homebrew).length, 98);
});

test("Vampire Merit snapshots and Builder/XP/Sheet/Homebrew render EN/PT/EN without rewriting identities, history or authored text", async () => {
  const before = JSON.stringify({ canonical, portuguese });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "vampire-merit-localization-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { MeritList, VampireExpandedMeritList };`;
      if (path.endsWith("/app/builder/merit-picker.tsx")) return code.replace("const [catalogOpen, setCatalogOpen] = useState(false);", "const [catalogOpen, setCatalogOpen] = useState(true);").replace("const [showAllMerits, setShowAllMerits] = useState(false);", "const [showAllMerits, setShowAllMerits] = useState(true);");
      if (path.endsWith("/app/workspace/experience-shared.tsx")) return code.replace("const [showAllMerits, setShowAllMerits] = useState(false);", "const [showAllMerits, setShowAllMerits] = useState(true);");
      // Expose dialog bodies to SSR while preserving the actual picker logic.
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampireMeritsCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/merits.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requests = [];
      const catalog = freezeCatalogData(await vampireMeritsCatalogGroup.load({ getCatalog: async id => { requests.push(id); assert.ok(["merits-vampire", "merits-vampire-pt"].includes(id), id); return id === "merits-vampire" ? canonical : portuguese; } }));
      assert.deepEqual(requests, ["merits-vampire", "merits-vampire-pt"]);
      for (const [index, definition] of catalog.entries()) {
        const original = canonical[index];
        assert.deepEqual(Object.fromEntries(Object.entries(definition).filter(([key]) => !["presentationPt", "translatedName"].includes(key))), Object.fromEntries(Object.entries(original).filter(([key]) => key !== "translatedName")), definition.id);
        assert.ok(Object.isFrozen(definition));
        if (definition.presentationPt) assert.ok(Object.isFrozen(definition.presentationPt));
      }
      const { LanguageProvider, messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { meritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
      const { meritCategoryLabel } = await vite.ssrLoadModule("/lib/merit-ui.ts");
      const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
      const { ExperienceMeritPicker } = await vite.ssrLoadModule("/app/workspace/experience-shared.tsx");
      const { MeritList, VampireExpandedMeritList } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { vampireExperienceLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const { normalizeMeritHomebrew, mergeMeritHomebrews } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const noMutation = () => { throw new Error("Rendering mutated a purchase"); };
      const selected = catalog.filter(item => item.presentationPt);
      const character = { ...blankPrintCharacter("VtR"), merits: selected.map((definition, index) => ({ definitionId: definition.id, instanceId: `purchased-${index}`, name: "Authored saved label", sourceId: definition.sourceId, source: definition.source, dots: definition.id === "vtr-sotc:mobilize-outrage" ? 2 : definition.ratings[0], configuration: {} })) };
      const characterBefore = JSON.stringify(character);
      const context = { gameLine: "VtR", meritCatalog: catalog, merits: [] };
      const creation = render(MeritPicker, { merits: [], setMerits: noMutation, catalog: selected, context, spent: 0, budget: 10, renderConfiguration: () => null, isInlineConfiguration: () => false });
      const experience = render(ExperienceMeritPicker, { line: "VtR", context, meritCatalog: selected, character: { ...character, merits: [] }, selectedId: selected[0].id, targetDots: 1, onSelect: noMutation });
      const summary = render(MeritList, { character, catalog, locale });
      const expanded = render(VampireExpandedMeritList, { character, updateSheet: noMutation, merits: character.merits, catalog, locale });
      const emptyPowers = Object.fromEntries(["disciplines", "ritualDisciplines", "devotions", "lashes", "cruacRites", "thebanMiracles", "gildedInvocations", "detournements"].map(key => [key, []]));
      const reference = { clans: [], covenants: [], bloodlines: [], anchors: [], bloodPotency: [], torpor: [] };
      const catalogs = { get: id => ({ "core-merits": [], "vampire-merits": selected, "vampire-reference": reference, "vampire-powers": emptyPowers, "vampire-conditions": [] })[id] };
      const homebrew = render(vampireHomebrew.Component, { catalogs });
      for (const definition of selected) {
        const presented = meritPresentation(definition, locale);
        const owned = character.merits.find(item => item.definitionId === definition.id);
        for (const html of [creation, experience, summary, expanded]) {
          assert.ok(html.includes(escape(presented.name)), `${locale}: ${definition.id} name`);
          assert.ok(html.includes(escape(presented.description)), `${locale}: ${definition.id} description`);
          if (presented.prerequisites) assert.ok(html.includes(escape(presented.prerequisites)), `${locale}: ${definition.id} prerequisites`);
        }
        if (definition.homebrew) assert.ok(homebrew.includes(escape(presented.description)), `${locale}: ${definition.id} Homebrew`);
        for (const level of presented.levels ?? []) {
          for (const html of [creation, experience]) assert.ok(html.includes(escape(level.description)), `${locale}: ${definition.id} level ${level.rating}`);
          assert.equal(expanded.includes(escape(level.description)), level.rating <= owned.dots);
        }
        const entry = { id: `receipt-${owned.instanceId}`, cost: 1, createdAt: "2026-10-04", rating: owned.dots, label: "Original receipt label", undo: { kind: "merit", definitionId: owned.definitionId, instanceId: owned.instanceId, name: definition.name, dots: 1 } };
        const entryBefore = JSON.stringify(entry);
        assert.equal(vampireExperienceLabel(entry, character, catalog, emptyPowers, locale), `${presented.name} ${owned.dots}`);
        assert.equal(JSON.stringify(entry), entryBefore);
      }
      for (const category of new Set(canonical.map(item => item.category))) assert.equal(meritCategoryLabel(category, locale), messages[locale].meritCategories[category]);
      assert.equal(meritCategoryLabel("Authored category", locale), "Authored category");
      const custom = normalizeMeritHomebrew({ id: "homebrew:merit:namesake", name: "Mobilize Outrage", line: "VtR", category: "Authored category", ratings: [1], description: "Authored English stays.", prerequisites: "Authored prerequisite" });
      const customCatalog = mergeMeritHomebrews(catalog, [custom]);
      const customPresented = meritPresentation(customCatalog.find(item => item.id === custom.id), locale);
      assert.equal(customPresented.description, custom.description);
      assert.equal(customPresented.prerequisites, custom.prerequisites);
      assert.equal(customPresented.name, custom.name);
      assert.equal(JSON.stringify(character), characterBefore);
      assert.equal(JSON.stringify({ canonical, portuguese }), before);
    } finally { await vite.close(); }
  }
});
