import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
const root = fileURLToPath(new URL("..", import.meta.url));

test("second Regalia follows locale, excludes Seeming then Shadowsoul affinities, and clears duplicates in edited/draft output", async () => {
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const server = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "regalia-test", enforce: "pre", transform(code, id) {
      code = code.replaceAll("\r\n", "\n");
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/changeling/builder.tsx")) return ("export let captured;\n" + code).replace('  return <CharacterBuilderShell', '  captured = { secondRegalia, kith, seeming, buildCharacter };\n  return <CharacterBuilderShell');
      if (path.endsWith("/game-lines/changeling/builder-view.tsx")) return ("export let regaliaChoices;\n" + code).replace('  const favored = seemingData', '  regaliaChoices = { groups: regaliaGroups, options: availableRegalia, labels: Object.fromEntries(availableRegalia.map(item => [item, systemTerm(item, locale)])) };\n  const favored = seemingData');
      if (path.endsWith("/app/character-builder-shell.tsx")) return code.replace('export function CharacterBuilderShell(', 'function UnusedCharacterBuilderShell(') + '\nexport function CharacterBuilderShell(props) { return props.lineTemplate; }';
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const builder = await server.ssrLoadModule("/game-lines/changeling/builder.tsx");
      const view = await server.ssrLoadModule("/game-lines/changeling/builder-view.tsx");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await server.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = { courts: [], kiths: [], entitlements: [], entitlementPresentation: {}, contractPresentation: {}, tokenPresentation: [], kithPresentation: {} };
      const catalogs = { get: id => id === "changeling-reference" ? reference : [] };
      const render = initial => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(builder.changelingBuilder.Component, { initial, catalogs, onSave() {}, onSaveDraft() {}, onCancel() {} })));
      render(undefined);
      assert.ok(view.regaliaChoices.options.includes("Mirror"));
      assert.deepEqual(view.regaliaChoices.groups.map(group => group.label), ["Core", locale === "pt-BR" ? "Suplementos" : "Supplements"]);
      assert.deepEqual(view.regaliaChoices.groups[0].options, ["Crown", "Jewels", "Mirror", "Shield", "Steed", "Sword"]);
      assert.deepEqual(view.regaliaChoices.groups[1].options, ["Chalice", "Coin", "Scepter", "Stars", "Thorn"]);
      for (const [seeming, kith, selected, expected, custom = false] of [
        ["", "", "Mirror", "Mirror"], ["Darkling", "", "Mirror", ""],
        ["Fairest", "Shadowsoul", "Mirror", ""], ["Darkling", "Shadowsoul", "Mirror", ""],
        ["Darkling", "Shadowsoul", "Sword", "Sword"], ["Fairest", "", "Crown", ""],
        ["Fairest", "Shadowsoul", "Espelho", ""], ["Fairest", "Shadowsoul", "Mirror", "Mirror", true],
      ]) {
        const sheet = blankPrintCharacter("CtL");
        sheet.line_data = { ...sheet.line_data, seeming, kith, kith_custom: custom, second_regalia: selected };
        const original = structuredClone(sheet);
        render(sheet);
        assert.equal(builder.captured.secondRegalia, expected, `${seeming}/${kith}/${selected}`);
        assert.equal(builder.captured.kith, kith);
        assert.equal(builder.captured.seeming, seeming);
        assert.equal(builder.captured.buildCharacter(sheet, true).line_data.second_regalia, expected);
        assert.equal(view.regaliaChoices.options.includes("Mirror"), seeming !== "Darkling" && (kith !== "Shadowsoul" || custom));
        assert.equal(view.regaliaChoices.labels.Sword, locale === "pt-BR" ? "Espada" : "Sword");
        assert.deepEqual(sheet, original);
      }
    } finally { await server.close(); }
  }
});
