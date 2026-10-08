import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const options = { appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } };
const vite = await createServer(options);
after(() => vite.close());
const { TILTS, findTilt, tiltPresentation } = await vite.ssrLoadModule("/lib/tilts.ts");
const { catalogDisplayName } = await vite.ssrLoadModule("/lib/localized-catalog.ts");
const core = TILTS.filter(item => ["CofD", "HL"].includes(item.sourceCode));
const fields = ["description", "effect", "causing", "ending"];
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("the 27 Core/Hurt Locker Tilts have complete PT presentation with canonical numbers, units and identities", () => {
  assert.equal(core.length, 27);
  for (const item of core) {
    const before = JSON.stringify(item);
    const pt = tiltPresentation(item, "pt-BR");
    assert.deepEqual(Object.keys(item.presentationPt).sort(), fields.toSorted());
    for (const field of fields) {
      assert.ok(pt[field].trim(), `${item.id}.${field}`);
      assert.notEqual(pt[field], item[field]);
      assert.deepEqual(pt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? [], `${item.id}.${field}: numeric limits`);
    }
    for (const field of ["id", "name", "translatedName", "category", "page", "source", "sourceCode"])
      assert.equal(pt[field], item[field]);
    assert.equal(tiltPresentation(item, "en-US"), item);
    assert.equal(findTilt(item.id), item);
    assert.equal(JSON.stringify(item), before);
  }
  assert.match(tiltPresentation(findTilt("blizzard"), "pt-BR").effect, /10 jardas.*quatro polegadas/);
  assert.match(tiltPresentation(findTilt("flooded"), "pt-BR").effect, /Cada pé de líquido/);
  assert.match(tiltPresentation(findTilt("deafened"), "pt-BR").ending, /10 − Vigor \+ Perseverança turnos/);
  assert.doesNotMatch(JSON.stringify(core.map(item => item.presentationPt)), /\b(?:Beats?|Conditions?|Stamina|Resolve|Composure|Strength|Athletics|Wits|Willpower|Knocked Down|Drugged|Sick|Blinded)\b/);
  assert.deepEqual(core.filter(item => item.sourceCode === "HL").map(item => catalogDisplayName(item, "pt-BR")), ["Sangrando", "Em Chamas", "Chegou Preparado", "Armadura Perfurada", "Preso"]);
});

test("all 35 shared Tilts have complete PT text and keep approved titles and power references", () => {
  assert.doesNotMatch(JSON.stringify(TILTS.map(item => item.presentationPt)), /\b(?:Esportes|Autocontrole)\b/);
  for (const item of TILTS) {
    const pt = tiltPresentation(item, "pt-BR");
    assert.deepEqual(Object.keys(item.presentationPt).sort(), fields.toSorted());
    for (const field of fields) {
      assert.ok(pt[field].trim(), `${item.id}.${field}`);
      assert.notEqual(pt[field], item[field]);
      assert.deepEqual(pt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? [], `${item.id}.${field}: numeric limits`);
    }
  }
  const contracts = JSON.parse(readFileSync(new URL("../public/game-lines/changeling/data/contracts/h-courts-pt.json", import.meta.url), "utf8"));
  for (const [tiltId, contractId] of [["riot", "h-courts:dragon:weaponize-mob"], ["drowning", "h-courts:tide:davy-jones-locker"], ["hobgoblin-band", "h-courts:traders:raise-the-band"]])
    assert.ok(tiltPresentation(findTilt(tiltId), "pt-BR").causing.includes(contracts[contractId].name));
  assert.equal(catalogDisplayName(findTilt("flesh-too-solid"), "pt-BR"), "Carne Muito Sólida");
  assert.equal(catalogDisplayName(findTilt("nimbus"), "pt-BR"), "Nimbus");
  assert.match(tiltPresentation(findTilt("nimbus"), "pt-BR").effect, /Alcance do feitiço.*sucessos de Gnose/);
  assert.doesNotMatch(JSON.stringify(TILTS.map(item => item.presentationPt)), /\b(?:Tilts?|Beats?|Conditions?|Gnosis|Mantle|Reach|Contracts?|Willpower|Clash of Wills|Dream Health)\b/);
});

test("combat renders selected Core Tilt effects in EN/PT/EN while preserving stored IDs and authored data", async () => {
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const sheet = blankPrintCharacter("CofD");
  sheet.line_data.combat_tilts = [...TILTS.map(item => item.id), "unavailable:authored"];
  sheet.line_data.authored_notes = "My combat notes";
  const before = JSON.stringify({ sheet, TILTS });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const server = locale === "en-US" ? vite : await createServer({ ...options, plugins: [{ name: "tilt-locale", enforce: "pre", transform(code, id) {
      if (id.replaceAll("\\", "/").endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { CombatPage } = await server.ssrLoadModule("/app/workspace/combat-page.tsx");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(CombatPage, { character: sheet, derived: sheet.derived, updateSheet: () => { throw new Error("Render changed the sheet"); } })));
      for (const item of TILTS) {
        assert.ok(html.includes(escape(catalogDisplayName(item, locale))), `${locale}: ${item.id}.name`);
        assert.ok(html.includes(escape(tiltPresentation(item, locale).effect)), `${locale}: ${item.id}.effect`);
      }
      assert.equal(JSON.stringify({ sheet, TILTS }), before);
    } finally { if (server !== vite) await server.close(); }
  }
});
