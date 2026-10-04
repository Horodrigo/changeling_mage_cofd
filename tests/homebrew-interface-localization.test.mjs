import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const authored = "Player-authored English stays verbatim.";
const merit = { id: "homebrew:merit:authored", name: "Authored Merit", translatedName: "Authored Merit", line: "MtA", sourceId: "homebrew:mage-merits", source: "Player-created Mage Merits", ratings: [1], category: "Mental", description: authored, homebrew: true };
const spell = { id: "homebrew:spell:authored", name: "Authored Spell", summary: authored, requirements: { Death: 2 }, sourceId: "homebrew:spells", source: "Player-created Spells" };
const legacy = { id: "homebrew:legacy:authored", name: "Authored Legacy", theory: authored, sourceId: "homebrew:legacies", source: "Player-created Legacies" };
const clan = { id: "homebrew:test-clan", name: "Authored Clan", sourceId: "homebrew:test-clans", source: "Authored Clan Source", favoredAttributes: ["Strength", "Stamina"], disciplines: ["Vigor"], baneName: "Authored Bane", baneSummary: authored };
const devotion = { id: "homebrew:test-power", name: "Authored Power", sourceId: "homebrew:test-powers", source: "Authored Power Source", summary: authored, rollResults: { dramaticFailure: "Authored dramatic failure.", failure: "Authored failure.", success: "Authored success.", exceptionalSuccess: "Authored exceptional success." } };
const invocation = { id: "homebrew:test-invocation", name: "Authored Invocation", sourceId: "homebrew:test-rituals", source: "Authored Ritual Source", summary: authored, rating: 1 };
const reference = { clans: [clan], covenants: [], bloodlines: [], anchors: [], bloodPotency: [], torpor: [] };
const powers = { disciplines: [{ id: "vigor", name: "Vigor", translatedName: "Vigor Vampírico", summary: "", levels: [], source: "Vampire: The Requiem" }], ritualDisciplines: [{ id: "gilded-cage", name: "Gilded Cage", translatedName: "Gaiola Dourada", sourceId: invocation.sourceId, source: invocation.source, summary: "" }], devotions: [devotion], lashes: [], cruacRites: [], thebanMiracles: [], kimiyaFormulae: [], therionSacrileges: [], gildedInvocations: [invocation], coils: [], scales: [], detournements: [] };
const catalogs = { get: id => ({ "core-merits": [], "mage-merits": [], "vampire-merits": [], "vampire-reference": reference, "vampire-powers": powers, "vampire-conditions": [] })[id] };

test("Homebrew EN/PT/EN renders localized captions and canonical metadata while preserving author text and stored sources", async () => {
  const before = JSON.stringify({ merit, spell, legacy, reference, powers });
  const mocks = {
    "/app/use-merit-homebrews.ts": `export const useMeritHomebrews = () => ${JSON.stringify([merit])};`,
    "/game-lines/mage/use-spell-homebrews.ts": `export const useSpellHomebrews = () => ${JSON.stringify([spell])};`,
    "/game-lines/mage/use-legacy-homebrews.ts": `export const useLegacyHomebrews = () => ${JSON.stringify([legacy])};`,
  };
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "authored-homebrew-and-locale", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      for (const [suffix, replacement] of Object.entries(mocks)) if (path.endsWith(suffix)) return replacement;
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { mageHomebrew } = await vite.ssrLoadModule("/game-lines/mage/homebrew.tsx");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const render = Component => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, { catalogs })));
      const mageHtml = render(mageHomebrew.Component), vampireHtml = render(vampireHomebrew.Component);
      for (const key of ["ui.playerCreatedMerits", "ui.playerCreatedSpells", "ui.playerCreatedLegacies"])
        assert.ok(mageHtml.includes(`<strong>${translate(locale, key)}</strong>`), `${locale}: ${key}`);
      assert.ok(mageHtml.includes(locale === "pt-BR" ? "Morte 2" : "Death 2"));
      for (const name of ["Authored Merit", "Authored Spell", "Authored Legacy", authored]) assert.ok(mageHtml.includes(name));
      for (const key of ["ui.dramaticFailure", "ui.failure", "ui.success", "ui.exceptionalSuccess"])
        assert.ok(vampireHtml.includes(`<strong>${translate(locale, key)}:</strong>`), `${locale}: ${key}`);
      for (const value of Object.values(devotion.rollResults)) assert.ok(vampireHtml.includes(value));
      for (const name of [clan.name, devotion.name, invocation.name, authored, clan.source, devotion.source]) assert.ok(vampireHtml.includes(name), `${locale}: ${name}`);
      assert.ok(vampireHtml.includes(locale === "pt-BR" ? "Força / Vigor" : "Strength / Stamina"));
      assert.ok(vampireHtml.includes(locale === "pt-BR" ? "Vigor Vampírico" : "Vigor"));
      assert.ok(vampireHtml.includes(translate(locale, "ui.gildedCage")));
      assert.doesNotMatch(vampireHtml, /<strong>(?:dramaticFailure|exceptionalSuccess):/);
      if (locale === "pt-BR") assert.doesNotMatch(mageHtml, /<strong>Player-created/);
      assert.equal(JSON.stringify({ merit, spell, legacy, reference, powers }), before);
    } finally { await vite.close(); }
  }
});
