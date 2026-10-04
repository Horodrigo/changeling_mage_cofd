import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const read = path => JSON.parse(readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8"));
const catalog = ["shared/data/merits.json", "game-lines/changeling/data/merits.json", "game-lines/mage/data/merits.json", "game-lines/mage/data/merits-supplements.json", "game-lines/vampire/data/merits.json"].flatMap(read);
const common = await vite.ssrLoadModule("/app/builder/common-merit-configurations.ts");
const changeling = await vite.ssrLoadModule("/game-lines/changeling/builder-merit-configurations.ts");
const mage = await vite.ssrLoadModule("/game-lines/mage/merit-configurations.ts");
const vampire = await vite.ssrLoadModule("/game-lines/vampire/merit-configurations.ts");
const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { MeritConfigurationEditor } = await vite.ssrLoadModule("/app/builder/merit-configuration-editor.tsx");
const { renderMageStructuredMeritEditor } = await vite.ssrLoadModule("/game-lines/mage/merit-configuration-editor.tsx");
const { renderChangelingStructuredMeritEditor } = await vite.ssrLoadModule("/game-lines/changeling/builder-merit-editor.tsx");
const allConfigurations = [...common.COMMON_MERIT_CONFIGURATIONS, ...changeling.CHANGELING_MERIT_CONFIGURATIONS, ...mage.MAGE_MERIT_CONFIGURATIONS, ...vampire.VAMPIRE_MERIT_CONFIGURATIONS.filter(item => item.line === "VtR")];
const render = (merit, options = {}) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MeritConfigurationEditor, { merit, catalog, definitions: allConfigurations, onChange: () => {}, ...options })));

test("every existing Core/line configuration has a unique ID reconciled with its canonical catalog", () => {
  assert.equal(new Set(allConfigurations.map(item => item.id)).size, allConfigurations.length);
  for (const item of allConfigurations) {
    const matches = catalog.filter(definition => definition.id === item.id);
    assert.equal(matches.length, 1, item.id);
    assert.equal(matches[0].name, item.name, item.id);
    assert.equal(matches[0].line, item.line ?? (item.id.startsWith("ctl-") || item.id.startsWith("h-") || item.id.startsWith("oak-") ? "CtL" : "Core"));
    for (const field of item.fields) for (const locale of ["en-US", "pt-BR"]) {
      if (field.label.startsWith("ui.")) assert.notEqual(translate(locale, field.label), field.label);
    }
  }
  assert.notEqual(changeling.CHANGELING_MERIT_CONFIGURATIONS.find(item => item.name === "Friends in Low Places").id, vampire.VAMPIRE_MERIT_CONFIGURATIONS.find(item => item.name === "Friends in Low Places").id);
});

test("configuration identity ignores saved display labels and never falls back from an unknown or ambiguous ID", () => {
  const official = catalog.find(item => item.id === "core-2ed:language");
  const fake = { ...official, id: "homebrew:test:language", sourceId: "homebrew:test" };
  const original = { definitionId: official.id, name: "Another label", dots: 1, configuration: { language: "Player-authored text" } };
  const before = JSON.stringify(original);
  assert.match(render(original), /Player-authored text/);
  assert.equal(render({ ...original, definitionId: "unknown", name: official.name }), "");
  assert.equal(render({ ...original, definitionId: fake.id, name: official.name }, { catalog: [...catalog, fake] }), "");
  assert.equal(render({ name: official.name, dots: 1 }, { catalog: [...catalog, fake] }), "");
  assert.match(render({ name: official.name, sourceId: official.sourceId, dots: 1 }, { catalog: [...catalog, fake] }), /Configure choices/);
  assert.equal(JSON.stringify(original), before);
  const multilingual = render({ definitionId: "core-2ed:multilingual", name: "Label", dots: 2 });
  assert.equal((multilingual.match(/data-slot="input"/g) ?? []).length, 4);
});

test("Core and injected line editors dispatch IDs instead of granting official behavior to Homebrew homonyms", () => {
  for (const id of ["core-2ed:professional-training", "core-2ed:mystery-cult-initiation", "core-2ed:mystery-cult-influence"]) {
    const official = catalog.find(item => item.id === id), fake = { ...official, id: `homebrew:test:${id}`, sourceId: "homebrew:test" };
    assert.match(render({ definitionId: id, name: "Label", dots: 1 }), /merit-configuration structured/);
    assert.equal(render({ definitionId: fake.id, name: official.name, dots: 1 }, { catalog: [...catalog, fake] }), "");
  }
  const structuredMage = props => renderMageStructuredMeritEditor({ ...props, catalog, factions: [] });
  assert.ok(render({ definitionId: "mta-tome:faction-member", name: "Label", dots: 1 }, { renderStructured: structuredMage }).includes(translate("en-US", "ui.configureFactionMembership")));
  assert.match(render({ definitionId: "mta-2ed:mystery-cult-influence", name: "Label", dots: 1 }, { renderStructured: structuredMage }), /merit-configuration structured/);
  assert.ok(render({ name: "Mystery Cult Initiation", sourceId: "core-2ed", dots: 2, grantedBy: "Nameless Order" }, { renderStructured: structuredMage }).includes(translate("en-US", "ui.configureNamelessOrderBenefits")));
  assert.match(render({ definitionId: "mta-2ed:artifact", name: "Label", dots: 3 }, { renderStructured: structuredMage }), /data-slot="input"/);
  assert.match(render({ definitionId: "core-2ed:professional-training", name: "Label", dots: 1 }, { renderStructured: structuredMage }), /merit-configuration structured/);
  const props = { merit: { definitionId: "ctl-2ed:token", name: "Other label", dots: 1 }, configuration: {}, onChange: () => {}, compact: false };
  assert.ok(renderChangelingStructuredMeritEditor(props, [], []));
  assert.equal(renderChangelingStructuredMeritEditor({ ...props, merit: { ...props.merit, definitionId: "homebrew:test:token", name: "Token" } }, [], []), null);
});

test("inline configuration decisions use IDs and preserve the existing single-field treatments", () => {
  assert.equal(common.isCommonInlineMeritConfiguration("core-2ed:allies"), true);
  assert.equal(common.isCommonInlineMeritConfiguration("Allies"), false);
  assert.equal(common.isCommonInlineMeritConfiguration("core-2ed:mentor"), false);
  assert.equal(changeling.isChangelingInlineMeritConfiguration("h-seemings:eerie-eyes"), true);
  assert.equal(changeling.isChangelingInlineMeritConfiguration("Eerie Eyes"), false);
  assert.equal(vampire.isVampireInlineMeritConfiguration("vtr-onyx-path:three-heads-kerberos"), true);
  assert.equal(vampire.isVampireInlineMeritConfiguration("vtr-retainer-ghoul"), false);
  const picker = readFileSync(new URL("../app/builder/merit-picker.tsx", import.meta.url), "utf8");
  assert.match(picker, /isInlineConfiguration\(definition\.id\)/);
  assert.doesNotMatch(picker, /selection\.name !== "Familiar"/);
});

test("Mage Masque configuration levels identify the style by ID and reject unrelated or ambiguous styles", () => {
  const selection = { name: "Label", definitionId: "mta-2ed:masque" };
  const style = { name: "Label", definitionId: "mta-2ed:masque-style", dots: 4 };
  assert.equal(mage.masqueConfigurationDots(selection, [style], catalog), 4);
  assert.equal(mage.masqueConfigurationDots({ ...selection, definitionId: "homebrew:test:masque", name: "Masque" }, [style], catalog), undefined);
  assert.equal(mage.masqueConfigurationDots(selection, [{ ...style, name: "Masque (Style)", definitionId: "unknown" }], catalog), undefined);
  assert.equal(mage.masqueConfigurationDots(selection, [style, style], catalog), undefined);
});


test("Professional Training selects two Asset Skills at one dot and keeps the third Skill and later grants locked until their own levels", async () => {
  const { commonExpandedConfigurationLines } = await vite.ssrLoadModule("/app/workspace/merit-configuration-presentation.ts");
  const configuration = { profession: "Authored profession", contacts: ["Authored contact"], asset_skills: ["Medicine", "Occult", "Science"], specialty_1_skill: "Medicine", specialty_1_name: "Authored specialty", boosted_skill: "Medicine" };
  const selection = { definitionId: "core-2ed:professional-training", instanceId: "paid-profession", name: "Renamed saved label", dots: 1, experienceDots: 1, configuration };
  const before = JSON.stringify(selection);
  for (const [dots, count] of [[1, 2], [2, 2], [3, 5]]) {
    const html = render({ ...selection, dots });
    assert.equal((html.match(/role="combobox"/g) ?? []).length, count);
    assert.ok(html.includes("Asset Skill 1") && html.includes("Asset Skill 2"));
    assert.equal(html.includes("Asset Skill 3"), dots >= 3);
    for (const locale of ["en-US", "pt-BR", "en-US"]) {
      const lines = commonExpandedConfigurationLines(selection.definitionId, dots, configuration, locale, catalog);
      const asset = lines.find(line => line.startsWith(translate(locale, "ui.assetSkills")));
      assert.ok(asset, locale);
      assert.ok(asset.includes(locale === "pt-BR" ? "Medicina" : "Medicine"));
      assert.equal(asset.includes(locale === "pt-BR" ? "Ciência" : "Science"), dots >= 3);
      assert.equal(lines.some(line => line.includes("Authored specialty")), dots >= 3);
      assert.ok(!lines.some(line => line.includes("+1")));
    }
  }
  assert.equal(JSON.stringify(selection), before);
});
