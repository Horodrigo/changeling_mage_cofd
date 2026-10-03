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
const { encodeMeritGrantChoice, decodeMeritGrantChoice } = await vite.ssrLoadModule("/lib/core/character/merit-configuration.ts");
const { synchronizeCommonMeritGrants } = await vite.ssrLoadModule("/lib/core/character/synchronize-merit-grants.ts");
const { commonExpandedConfigurationLines } = await vite.ssrLoadModule("/app/workspace/merit-configuration-presentation.ts");
const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const { resolveMeritDefinition } = await vite.ssrLoadModule("/lib/merit-identity.ts");
const { normalizeStoredSheet, validateCurrentCharacter } = await vite.ssrLoadModule("/lib/character-persistence.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const { MeritConfigurationEditor } = await vite.ssrLoadModule("/app/builder/merit-configuration-editor.tsx");
const { COMMON_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/app/builder/common-merit-configurations.ts");
const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
const catalog = withMeritPresentation(read("shared/data/merits.json"), read("shared/data/merits-pt.json"));
const resources = catalog.find(item => item.id === "core-2ed:resources");
const namesake = { ...resources, id: "homebrew:test:resources", sourceId: "homebrew:test", source: "Player source", translatedName: "Outro recurso", presentationPt: { name: "Outro recurso", description: "Outro efeito" } };
const catalogs = [namesake, ...catalog];

test("Cult choices persist canonical definition/source IDs and preserve exact Homonym choices", () => {
  for (const definition of [resources, namesake]) {
    const row = encodeMeritGrantChoice(definition, 2);
    const choice = decodeMeritGrantChoice(row);
    assert.deepEqual(choice, { definitionId: definition.id, name: definition.name, dots: 2, sourceId: definition.sourceId, source: definition.source });
    assert.equal(resolveMeritDefinition(choice, catalogs), definition);
    assert.equal(resolveMeritDefinition({ ...choice, name: "Altered display", sourceId: "Altered source" }, catalogs), definition);
  }
  const legacy = decodeMeritGrantChoice("Resources|2");
  assert.deepEqual(legacy, { name: "Resources", dots: 2 });
  assert.equal(resolveMeritDefinition(legacy, catalogs), undefined);
  assert.equal(decodeMeritGrantChoice(encodeMeritGrantChoice({ ...resources, id: "unavailable:id" }, 1)).definitionId, "unavailable:id");
});

test("Cult grants preserve ID, stable instance, purchase allocations and schema-2 rows across repeated synchronization", () => {
  const sheet = blankPrintCharacter("CofD");
  const configuration = { cult: "Authored name", level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(namesake, 1)], level_3_type: "merits", level_3_merits: ["Resources|2"] };
  sheet.merits = [{ definitionId: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", instanceId: "cult-instance", dots: 3, creationDots: 1, experienceDots: 2, configuration }];
  sheet.current_state.experience_available = 7;
  sheet.current_state.experience_spent = 2;
  sheet.current_state.experience_history = [{ id: "purchase", kind: "spend", experience: -2, description: "Existing history", createdAt: "2026-10-03T00:00:00Z" }];
  const before = JSON.stringify({ owner: sheet.merits[0], state: sheet.current_state });
  synchronizeCommonMeritGrants(sheet);
  const granted = sheet.merits.filter(item => item.grantedBy);
  assert.equal(granted.length, 2);
  assert.equal(granted[0].definitionId, namesake.id);
  assert.equal(granted[0].sourceId, namesake.sourceId);
  assert.equal(granted[0].dots, 1);
  assert.equal(granted[1].definitionId, undefined);
  assert.equal(granted[1].name, "Resources");
  assert.equal(JSON.stringify({ owner: sheet.merits[0], state: sheet.current_state }), before);
  const first = JSON.stringify(sheet);
  synchronizeCommonMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), first);
  const imported = normalizeStoredSheet(JSON.parse(first));
  assert.equal(validateCurrentCharacter(imported), "valid");
  assert.deepEqual(JSON.parse(JSON.stringify(imported.merits)), sheet.merits);
  assert.deepEqual(imported.current_state.experience_history, sheet.current_state.experience_history);
});

test("Cult summaries localize the exact chosen definition without changing rows or substituting an unknown ID", () => {
  const configuration = { cult: "Authored name", level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(namesake, 1)], level_3_type: "merits", level_3_merits: [encodeMeritGrantChoice(resources, 2)] };
  const before = JSON.stringify(configuration);
  assert.deepEqual(commonExpandedConfigurationLines("Mystery Cult Initiation", 3, configuration, "en-US", catalogs), ["Cult: Authored name", "Dot 1: Resources •", "Dot 3: Resources ••"]);
  assert.deepEqual(commonExpandedConfigurationLines("Mystery Cult Initiation", 3, configuration, "pt-BR", catalogs), [`${translate("pt-BR", "ui.cult")}: Authored name`, `${translate("pt-BR", "ui.dot")} 1: Outro recurso •`, `${translate("pt-BR", "ui.dot")} 3: Recursos ••`]);
  const unavailable = { ...configuration, level_1_merits: [encodeMeritGrantChoice({ ...resources, id: "unavailable:id", name: "Stored canonical fallback" }, 1)] };
  assert.ok(commonExpandedConfigurationLines("Mystery Cult Initiation", 1, unavailable, "pt-BR", catalogs).includes(`${translate("pt-BR", "ui.dot")} 1: Stored canonical fallback •`));
  assert.equal(JSON.stringify(configuration), before);
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MeritConfigurationEditor, { merit: { definitionId: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", dots: 3, configuration }, catalog: catalogs, definitions: COMMON_MERIT_CONFIGURATIONS, onChange: () => {} })));
  assert.match(markup, /Resources ••/);
  assert.doesNotMatch(markup, /definitionId|core-2ed:resources/);
});

test("malformed grants fail without being interpreted as a canonical name or manufacturing ratings", () => {
  for (const row of [null, [], {}, "Resources", "Resources|", "Resources|0", "Resources|-1", "Resources|1.5", "Resources|Infinity", "Resources|1|2", "{broken", '{"name":"Resources","dots":1}', '{"definitionId":"id","name":"Resources","dots":"1"}', '{"definitionId":"id","name":"Resources","dots":1,"sourceId":[]}', '{"definitionId":"","name":"Resources","dots":1}']) assert.equal(decodeMeritGrantChoice(row), undefined, String(row));
});
