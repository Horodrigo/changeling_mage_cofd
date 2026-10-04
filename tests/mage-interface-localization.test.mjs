import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const spell = { id: "homebrew:spell:empty", name: "Authored spell", originalName: "Authored spell", requirements: { Death: 1 }, practice: "Unveiling", primaryFactor: "Potency", withstand: "None", roteSkills: ["Occult"], summary: "", description: "", source: "Authored source", page: 1 };
const reached = { ...spell, id: "homebrew:spell:reach", name: "Authored reach", originalName: "Authored reach", description: "Author text. +1 Reach: Author effect. Add Fate 2: +2 Reach: Author addition." };
const character = { id: "test-mage", skills: { Investigation: 2, Academics: 2 }, merits: [], specializations: [], line_data: { gnosis: 2, path: "Moros", order: "Orderless", arcana: { Time: 2 }, legacy_state: { definitionId: "chronologue", joined: false, attainmentRanks: [], initiationMethod: "" } }, current_state: { mage_experience_available: 3, arcane_experience_available: 3 } };

test("Mage creation/sheet description fallbacks and Legacy controls follow EN/PT/EN without changing parser input or saved data", async () => {
  const before = JSON.stringify({ spell, reached, character });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "mage-interface-test-surface", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/mage/builder-view.tsx")) return `${code}\nexport { SpellSelector, spellReach };`;
      if (path.endsWith("/game-lines/mage/sheet-view.tsx")) return `${code}\nexport { SpellColumn, spellItemReach, MageAttainmentList };`;
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { SpellSelector, spellReach } = await vite.ssrLoadModule("/game-lines/mage/builder-view.tsx");
      const { SpellColumn, spellItemReach, MageAttainmentList } = await vite.ssrLoadModule("/game-lines/mage/sheet-view.tsx");
      const { mageMessages } = await vite.ssrLoadModule("/lib/i18n/messages/mage.ts");
      const { LegacyPage } = await vite.ssrLoadModule("/game-lines/mage/legacy-page.tsx");
      const refuseMutation = () => { throw new Error("Rendering mutated data"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const builder = render(SpellSelector, { title: "Rotes", count: 2, values: [spell, reached], setValues: refuseMutation, rote: true, arcana: { Death: 2 }, catalog: [spell, reached] });
      const sheet = render(SpellColumn, { items: [spell, reached], catalog: [spell, reached] });
      const fallback = translate(locale, "ui.spellDescriptionUnavailable");
      for (const html of [builder, sheet]) {
        assert.ok(html.includes(fallback), locale);
        assert.ok(html.includes("Author text."));
        assert.ok(html.includes("+1 Reach: Author effect. · Add Fate 2: · +2 Reach: Author addition."));
        if (locale === "en-US") assert.doesNotMatch(html, /Descrição não disponível/);
      }
      assert.equal(spellReach(reached), "+1 Reach: Author effect. · Add Fate 2: · +2 Reach: Author addition.");
      assert.equal(spellItemReach(reached, [reached]), spellReach(reached));
      const legacy = render(LegacyPage, { character, meritCatalog: [], updateSheet: refuseMutation, onDiscard: refuseMutation });
      assert.ok(legacy.includes(translate(locale, "ui.legacyTutelage")), locale);
      assert.ok(legacy.includes(translate(locale, "ui.oneExperience")), locale);
      assert.ok(legacy.includes(locale === "pt-BR" ? "Gnose 2" : "Gnosis 2"));
      assert.ok(legacy.includes(locale === "pt-BR" ? "Tempo 2" : "Time 2"));
      assert.equal(translate(locale, "ui.legacySoulStudy"), locale === "pt-BR" ? "Estudo de uma Alma ou Pedra da Alma" : "Soul or Soul Stone Study");
      const utility = mageMessages[locale].ui.utilityAttainments;
      const escape = value => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;");
      for (let dots = 0; dots <= 5; dots++) {
        const arcana = Object.fromEntries(Object.keys(utility.lesser).map(name => [name, dots]));
        const original = JSON.stringify(arcana);
        const html = render(MageAttainmentList, { arcana });
        for (const [kind, minimum] of [["lesser", 2], ["greater", 4]])
          for (const item of Object.values(utility[kind])) {
            assert.equal(html.includes(escape(item.name)), dots >= minimum, `${locale} ${dots}: ${item.name}`);
            assert.equal(html.includes(escape(item.description)), dots >= minimum, `${locale} ${dots}: ${item.description}`);
          }
        assert.equal(JSON.stringify(arcana), original);
      }
      assert.equal(JSON.stringify({ spell, reached, character }), before);
    } finally { await vite.close(); }
  }
});
