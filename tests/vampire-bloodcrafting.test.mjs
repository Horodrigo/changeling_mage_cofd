import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const canonical = read("public/game-lines/vampire/data/merits.json").find(item => item.id === "vtr-better-feared:bloodcrafting");
const portuguese = read("public/game-lines/vampire/data/merits-pt.json");

function server(locale = "en-US") {
  return createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "bloodcrafting-transactions", enforce: "pre", transform(code, id) {
    const path = id.replaceAll("\\", "/");
    if (path.endsWith("/game-lines/vampire/experience-panel.tsx")) return ('export let testBuy, testRevert; let seed; export const testSeed = value => { seed = value; };\n' + code)
      .replace('useState<PurchaseType>("attribute")', 'useState<PurchaseType>("merit")')
      .replace('const [target, setTarget] = useState("");', 'const [target, setTarget] = useState(seed.id);')
      .replace('const [meritDots, setMeritDots] = useState(0);', 'const [meritDots, setMeritDots] = useState(seed.dots);')
      .replace('const [meritInstance, setMeritInstance] = useState(-1);', 'const [meritInstance, setMeritInstance] = useState(seed.instance ?? -1);')
      .replace('useState<MeritConfiguration>({})', 'useState<MeritConfiguration>(seed.configuration)')
      .replace('  return <', '  testBuy = buy; testRevert = revert;\n  return <');
    if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { VampireExpandedMeritList };`;
    if (path.endsWith("/app/builder/merit-picker.tsx")) return code.replace('const [catalogOpen, setCatalogOpen] = useState(false);', 'const [catalogOpen, setCatalogOpen] = useState(true);');
    if (path.endsWith("/app/workspace/experience-shared.tsx")) return code.replace('const [catalogOpen, setCatalogOpen] = useState(false);', 'const [catalogOpen, setCatalogOpen] = useState(true);');
    if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({children}) => createElement("div", null, children); export {Wrapper as Dialog, Wrapper as DialogContent, Wrapper as DialogTrigger, Wrapper as DialogClose, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription};';
    if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
  } }] });
}

test("Better Feared pp. 23–24 Bloodcrafting instances use explicit ratings, authored Crafts Specialties and enhancement budgets", async () => {
  const vite = await server();
  try {
    const { meritRatingsFor } = await vite.ssrLoadModule("/lib/merits.ts");
    const { bloodcraftingConfigurationMet } = await vite.ssrLoadModule("/game-lines/vampire/bloodcrafting.ts");
    const { vampireMeritEligible } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
    const { VampireMeritConfigurationEditor } = await vite.ssrLoadModule("/game-lines/vampire/merit-configuration-editor.tsx");
    const { VAMPIRE_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/game-lines/vampire/merit-configurations.ts");
    const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
    const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
    const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
    assert.equal(canonical.repeatable, true);
    assert.equal(canonical.unbounded, true);
    assert.deepEqual(meritRatingsFor(canonical, 7), [2, 3, 4, 5, 6, 7]);
    const specialties = [{ skill: "Crafts", name: "Authored metalwork" }];
    const configuration = { subject: specialties[0].name, enhancements: ["bane", "mechanical"] };
    assert.equal(bloodcraftingConfigurationMet(6, configuration, specialties), true);
    for (const [dots, choices, available] of [[5, configuration, specialties], [6, configuration, []], [6, { ...configuration, enhancements: ["Flagelo"] }, specialties], [6, { ...configuration, enhancements: ["mechanical", "mechanical"] }, specialties], [1, { ...configuration, enhancements: [] }, specialties]]) assert.equal(bloodcraftingConfigurationMet(dots, choices, available), false);
    const context = { gameLine: "VtR", bloodlineId: "acteius", archetypes: ["vampire", "acteius"], skills: { Crafts: 3 }, specializations: specialties, meritCatalog: [canonical] };
    assert.equal(vampireMeritEligible(canonical, context, 0), true, "Browsing does not require a configuration yet");
    assert.equal(vampireMeritEligible({ ...canonical, name: "Renamed", translatedName: "Título" }, { ...context, selectedDots: 6, configuration }, 0), true);
    assert.equal(vampireMeritEligible(canonical, { ...context, selectedDots: 6, configuration: {} }, 0), false);
    const sheet = blankPrintCharacter("VtR");
    sheet.specializations = specialties;
    sheet.merits = [{ definitionId: canonical.id, instanceId: "exact", name: "Renamed", dots: 6, creationDots: 0, experienceDots: 6, configuration }];
    const before = JSON.stringify(sheet);
    assert.equal(refundVampireAdvancement(sheet, { kind: "merit", definitionId: canonical.id, instanceId: "exact", name: canonical.name, dots: 1 }, undefined, [canonical]), false);
    assert.equal(refundVampireAdvancement(sheet, { kind: "specialty", skill: "Crafts", name: specialties[0].name }, undefined, [canonical]), false);
    assert.equal(JSON.stringify(sheet), before);
    const legacy = structuredClone(sheet);
    legacy.merits[0] = { ...legacy.merits[0], dots: 2, experienceDots: 2, configuration: {} };
    const legacyBefore = JSON.stringify(legacy);
    assert.equal(refundVampireAdvancement(legacy, { kind: "merit", definitionId: canonical.id, instanceId: "exact", name: canonical.name, dots: 1 }, undefined, [canonical]), false);
    assert.equal(JSON.stringify(legacy), legacyBefore, "Even an unconfigured old instance cannot refund to a one-dot rating");
    const unavailable = structuredClone(sheet);
    assert.equal(refundVampireAdvancement(unavailable, { kind: "specialty", skill: "Crafts", name: specialties[0].name }, undefined, []), true, "Unavailable catalog definitions do not infer official configuration behavior");
    const namesake = { ...canonical, id: "homebrew:bloodcrafting", sourceId: "homebrew:test" };
    const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(VampireMeritConfigurationEditor, { merit: { ...sheet.merits[0], definitionId: namesake.id, name: canonical.name }, catalog: [canonical, namesake], specialtyContext: context, definitions: VAMPIRE_MERIT_CONFIGURATIONS, onChange: () => { throw new Error("Render mutated configuration"); } })));
    assert.ok(!html.includes("Bloodcrafting Enhancements"));
  } finally { await vite.close(); }
});

test("Bloodcrafting Builder, XP and Desktop/Mobile render EN/PT/EN; separate purchases, upgrades and atomic refunds retain exact instances", async () => {
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await server(locale);
    try {
      const { withMeritPresentation, meritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
      const catalog = withMeritPresentation([canonical], portuguese);
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const { vampireMeritContextForSheet, vampireMeritEligible } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
      const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
      const { ExperienceMeritPicker } = await vite.ssrLoadModule("/app/workspace/experience-shared.tsx");
      const { VampireExpandedMeritList } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const panel = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
      const powers = Object.fromEntries(["disciplines", "ritualDisciplines", "devotions", "lashes", "cruacRites", "thebanMiracles", "kimiyaFormulae", "therionSacrileges", "gildedInvocations", "coils", "scales", "detournements"].map(key => [key, []]));
      const reference = Object.fromEntries(["clans", "covenants", "bloodlines", "anchors", "bloodPotency", "torpor"].map(key => [key, []]));
      const catalogs = { get: id => ({ "core-merits": [], "vampire-merits": catalog, "vampire-powers": powers, "vampire-reference": reference, "vampire-conditions": [] })[id] };
      let sheet = blankPrintCharacter("VtR");
      sheet.skills.Crafts = 3;
      sheet.specializations = [{ skill: "Crafts", name: "Authored metalwork" }, { skill: "Crafts", name: "Authored woodwork" }];
      sheet.line_data.bloodline_id = "acteius";
      sheet.current_state = { ...sheet.current_state, experience_available: 20, experience_spent: 3, experience_total: 23, vampire_experience_history: [{ id: "opaque", label: "Texto autoral", cost: 3 }] };
      const original = JSON.stringify(sheet), opaque = structuredClone(sheet.current_state.vampire_experience_history[0]);
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const context = vampireMeritContextForSheet(sheet, catalog, ["vampire", "acteius"]);
      const refuseMutation = () => { throw new Error("Render changed the character"); };
      const creation = render(MeritPicker, { merits: [], setMerits: refuseMutation, catalog, context, spent: 0, budget: 10, renderConfiguration: () => null, isInlineConfiguration: () => false, isEligible: (definition, context) => vampireMeritEligible(definition, context, 0) });
      assert.ok(creation.includes("2+"));
      const picker = render(ExperienceMeritPicker, { line: "VtR", context, meritCatalog: catalog, character: sheet, selectedId: canonical.id, targetDots: 2, onSelect: refuseMutation, isEligible: (definition, context) => vampireMeritEligible(definition, context, 0) });
      assert.match(picker, /option value="2"/);
      assert.equal(JSON.stringify(sheet), original);
      const buy = selection => {
        panel.testSeed({ id: canonical.id, ...selection });
        const before = JSON.stringify(sheet), updates = [];
        render(panel.VampireExperiencePanel, { character: sheet, updateSheet: value => updates.push(value), catalogs });
        panel.testBuy();
        assert.equal(JSON.stringify(sheet), before);
        assert.equal(updates.length, 1);
        sheet = updates[0];
        assert.deepEqual(sheet.current_state.vampire_experience_history[0], opaque);
        return sheet.current_state.vampire_experience_history.at(-1);
      };
      const first = buy({ dots: 2, configuration: { subject: "Authored metalwork", enhancements: [] } });
      const second = buy({ dots: 3, configuration: { subject: "Authored woodwork", enhancements: ["mechanical"] } });
      assert.notEqual(first.undo.instanceId, second.undo.instanceId);
      const secondBefore = structuredClone(sheet.merits[1]);
      const upgrade = buy({ dots: 6, instance: 0, configuration: { subject: "Authored metalwork", enhancements: ["bane", "mechanical"] } });
      assert.equal(upgrade.cost, 4);
      assert.equal(upgrade.undo.instanceId, first.undo.instanceId);
      assert.deepEqual(sheet.merits[1], secondBefore);
      const displayed = render(VampireExpandedMeritList, { character: sheet, updateSheet: refuseMutation, merits: sheet.merits, catalog, locale });
      for (const text of [meritPresentation(catalog[0], locale).name, "Authored metalwork", "Authored woodwork", translate(locale, "ui.bloodcraftingBane"), translate(locale, "ui.bloodcraftingMechanical")]) assert.ok(displayed.includes(text));
      const revert = (receipt, succeeds = true) => {
        const before = JSON.stringify(sheet), updates = [];
        render(panel.VampireExperiencePanel, { character: sheet, updateSheet: value => updates.push(value), catalogs });
        panel.testRevert(receipt);
        assert.equal(JSON.stringify(sheet), before);
        assert.equal(updates.length, succeeds ? 1 : 0);
        if (succeeds) sheet = updates[0];
      };
      revert(upgrade, false);
      sheet.merits[0].configuration.enhancements = [];
      revert(upgrade);
      assert.equal(sheet.merits[0].dots, 2);
      assert.deepEqual(sheet.merits[1], secondBefore);
      revert(first);
      assert.deepEqual(sheet.merits, [secondBefore]);
      revert(second);
      assert.deepEqual(sheet.merits, []);
      assert.equal(sheet.current_state.experience_available, 20);
      assert.equal(sheet.current_state.experience_spent, 3);
      assert.deepEqual(sheet.current_state.vampire_experience_history, [opaque]);
    } finally { await vite.close(); }
  }
});
