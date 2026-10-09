import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

const keys = ["merits", "mageSpells", "mageLegacies", "vampireCatalog", "vampireBloodlines", "changelingCatalog", "changelingContracts", "changelingEntitlements"];
const homebrews = Object.fromEntries(keys.map((key) => [key, []]));

test("homebrew transfer accepts current and previous complete envelopes only", async () => {
  const { parseHomebrewTransferEnvelope } = await vite.ssrLoadModule("/app/homebrew-transfer.tsx");

  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 1, homebrews })?.schemaVersion, 1);
  assert.deepEqual(
    parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews, preferences: { disabledIds: [], enabledIds: [] } })?.preferences,
    { disabledIds: [], enabledIds: [] },
  );
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews }), null);
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews, preferences: { disabledIds: [{}] } }), null);
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews: { ...homebrews, merits: {} }, preferences: { disabledIds: [] } }), null);
});

test("character export normalizes an unopened stored sheet and never downloads raw data after a failure", async t => {
  let failed = false;
  t.mock.method(globalThis, "fetch", async path => {
    if (failed) throw new Error("Unavailable catalog");
    assert.match(String(path), /^\/(shared|game-lines)\//);
    return new Response(await readFile(new URL(`../public${path}`, import.meta.url), "utf8"));
  });
  const server = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "export-event-test", enforce: "pre", transform(code, id) {
    const path = id.replaceAll("\\", "/");
    if (path.endsWith("/app/data-transfer-panel.tsx")) return ("export let testExport;\n" + code).replace("  return (", "  testExport = exportCharacter;\n  return (");
    if (path.endsWith("/app/data-transfer-shared.tsx")) return 'export const downloads = []; export function downloadJson(value, filename) { downloads.push({ value, filename }); } export const TransferAction = () => null;';
  } }] });
  try {
    const panel = await server.ssrLoadModule("/app/data-transfer-panel.tsx");
    const { downloads } = await server.ssrLoadModule("/app/data-transfer-shared.tsx");
    const { blankPrintCharacter } = await server.ssrLoadModule("/app/workspace/blank-print-character.ts");
    const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
    const stored = blankPrintCharacter("CofD");
    stored.character.name = "Nome autoral";
    stored.attributes.Força = 5;
    stored.attributes.Strength = 2;
    stored.specializations = [{ skill: "Armas Brancas", name: "Nome autoral" }];
    const before = structuredClone(stored);
    const render = character => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(panel.DataTransferPanel, { open: false, onOpenChange() {}, characters: [character], selected: null, importCharacter() {} })));
    render(stored);
    await panel.testExport();
    assert.equal(downloads.length, 1);
    assert.equal(downloads[0].value.attributes.Strength, 2);
    assert.equal(Object.hasOwn(downloads[0].value.attributes, "Força"), false);
    assert.equal(downloads[0].value.specializations[0].name, "Nome autoral");
    assert.equal(downloads[0].value.specializations[0].skill, "Weaponry");
    assert.deepEqual(stored, before, "Export never changes the stored collection");
    failed = true;
    render({ ...stored, game_line: "WtF" });
    await panel.testExport();
    assert.equal(downloads.length, 1, "A failed preparation cannot silently export an unnormalized sheet");
  } finally { await server.close(); }
});
