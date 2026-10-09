import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const cults = read("game-lines/vampire/catalog-data/shadow-cults.json");
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("Shadow Cult presentation renders EN/PT/EN creation and Desktop/Mobile without saving translations or changing authored fields", async () => {
  const before = JSON.stringify(cults);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "shadow-cult-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/hooks/use-mobile.ts")) return "export let mobile = false; export const setTestMobile = value => { mobile = value; }; export const useIsMobile = () => mobile;";
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { coreMeritsCatalogGroup } = await vite.ssrLoadModule("/game-lines/core/catalogs/merits.ts");
      const { vampireMeritsCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/merits.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const resources = { "merits-core": read("public/shared/data/merits.json"), "merits-core-pt": read("public/shared/data/merits-pt.json"), "merits-vampire": read("public/game-lines/vampire/data/merits.json"), "merits-vampire-pt": read("public/game-lines/vampire/data/merits-pt.json") };
      const reader = { getCatalog: async id => resources[id] };
      const core = freezeCatalogData(await coreMeritsCatalogGroup.load(reader)), vampire = freezeCatalogData(await vampireMeritsCatalogGroup.load(reader));
      const catalog = [...core, ...vampire];
      const { vampireShadowCultPresentation: present, vampireShadowCultConfigurationChange: change, vampireShadowCultSpecialty: specialty, vampireShadowCultNotes: notes } = await vite.ssrLoadModule("/game-lines/vampire/shadow-cult-presentation.ts");
      const { synchronizeVampireBuilderMeritGrants } = await vite.ssrLoadModule("/game-lines/vampire/builder-merit-grants.ts");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const { VampireCharacterPaper } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { VampireMeritConfigurationEditor } = await vite.ssrLoadModule("/game-lines/vampire/merit-configuration-editor.tsx");
      const { VAMPIRE_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/game-lines/vampire/merit-configurations.ts");
      const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
      const { meritConfigurationTitle } = await vite.ssrLoadModule("/lib/core/character/merit-configuration.ts");
      const { setTestMobile } = await vite.ssrLoadModule("/hooks/use-mobile.ts");
      const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, read(`public/game-lines/vampire/data/${group}.json`)]));
      const catalogs = { get: id => ({ "core-merits": core, "vampire-merits": vampire, "vampire-reference": reference, "vampire-powers": read("public/game-lines/vampire/data/powers.json"), "vampire-conditions": read("public/game-lines/vampire/data/conditions.json"), "core-reference": { conditions: read("public/shared/data/conditions.json"), presentation: read("public/shared/data/conditions-pt.json") } })[id] };
      const noMutation = () => { throw new Error("Rendering changed a saved choice"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      for (const [cultId, cult] of Object.entries(cults)) {
        const character = blankPrintCharacter("VtR");
        character.line_data.clan_id = "mekhet";
        character.line_data.covenant_id = cultId;
        synchronizeVampireBuilderMeritGrants(character);
        character.merits.find(item => item.definitionId === "core-2ed:mystery-cult-initiation").dots = 5;
        character.merits.find(item => item.definitionId === "core-2ed:mystery-cult-initiation").experienceDots = 4;
        synchronizeVampireBuilderMeritGrants(character);
        const merit = character.merits.find(item => item.definitionId === "core-2ed:mystery-cult-initiation");
        const saved = JSON.stringify(character);
        const shown = present(merit, cultId, locale, catalog);
        assert.deepEqual(change(merit.configuration, shown.configuration, shown.configuration), merit.configuration);
        const authored = { ...merit, configuration: { ...merit.configuration, cult: "Authored cult", level_1_specialty_name: "Authored Specialty", level_5_custom: "Authored effect" } };
        const authoredView = present(authored, cultId, locale, catalog);
        for (const key of ["cult", "level_1_specialty_name", "level_5_custom"]) assert.equal(authoredView.configuration[key], authored.configuration[key]);
        for (const definitionId of ["unavailable:merit", "homebrew:namesake"]) {
          const unavailable = { ...merit, definitionId };
          assert.equal(present(unavailable, cultId, locale, catalog), unavailable);
        }
        const manual = { ...merit, grantedBy: undefined };
        assert.equal(present(manual, cultId, locale, catalog), manual);
        const draft = { ...merit, configuration: { cult: cult.name } }, draftView = present(draft, cultId, locale, catalog);
        assert.deepEqual(change(draft.configuration, draftView.configuration, draftView.configuration), draft.configuration, "Render-only creation defaults never become saved choices");
        assert.deepEqual(change(draft.configuration, draftView.configuration, { ...draftView.configuration, level_5_custom: "Player edit" }), { cult: cult.name, level_5_custom: "Player edit" });
        const creation = render(MeritPicker, { merits: [merit], setMerits: noMutation, catalog, context: { gameLine: "VtR", meritCatalog: catalog, merits: character.merits }, spent: 4, budget: 10, configurationTitle: selection => meritConfigurationTitle(present(selection, cultId, locale, catalog).configuration), isInlineConfiguration: () => false, renderConfiguration: ({ merit, onChange }) => createElement(VampireMeritConfigurationEditor, { merit, onChange, catalog, shadowCultId: cultId, definitions: VAMPIRE_MERIT_CONFIGURATIONS }) });
        const content = [creation];
        for (const mobile of [false, true]) {
          setTestMobile(mobile);
          content.push(render(VampireCharacterPaper, { character, catalogs, updateState: noMutation, updateSheet: noMutation }));
        }
        const fields = locale === "pt-BR" ? cult.presentationPt : cult.presentationEn ?? {};
        for (const html of content) {
          for (const [key, value] of Object.entries(fields)) assert.ok(html.includes(escape(value)), `${locale}: ${cultId}.${key}`);
          for (const note of notes(merit, cultId, locale, catalog)) assert.ok(html.includes(escape(note.text)), `${locale}: ${cultId} note ${note.level}`);
        }
        for (const item of character.specializations) {
          const shownSpecialty = specialty(item, character.merits, cultId, locale, catalog);
          for (const html of content.slice(1)) assert.ok(html.includes(escape(shownSpecialty.name)));
          assert.equal(specialty({ ...item, grantedBy: undefined }, character.merits, cultId, locale, catalog).name, item.name);
          assert.equal(specialty(item, [merit, merit], cultId, locale, catalog), item, "Ambiguous producers do not translate an authored Specialty");
        }
        assert.equal(JSON.stringify(character), saved);
      }
      assert.equal(JSON.stringify(cults), before);
    } finally { await vite.close(); }
  }
});
