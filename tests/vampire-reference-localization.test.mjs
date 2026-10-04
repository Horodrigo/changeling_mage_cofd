import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const groups = ["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"];
const data = Object.fromEntries(groups.map(group => [`vampire-${group}`, read(`public/game-lines/vampire/data/${group}.json`)]));
const anchors = data["vampire-anchors"];
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("all 27 Vampire Anchors have complete presentation for both Willpower recovery triggers without replacing canonical identity", () => {
  assert.equal(anchors.length, 27);
  assert.equal(new Set(anchors.map(item => item.id)).size, 27);
  for (const item of anchors) {
    assert.deepEqual(Object.keys(item.presentationPt).sort(), ["allWillpower", "singleWillpower"]);
    for (const field of ["singleWillpower", "allWillpower"]) {
      assert.ok(item.presentationPt[field]?.trim(), `${item.id}.${field}`);
      assert.notEqual(item.presentationPt[field], item[field], `${item.id}.${field}`);
    }
    assert.equal(item.source, "Vampire: The Requiem Second Edition");
  }
  assert.match(anchors.find(item => item.id === "rebel").presentationPt.allWillpower, /Tradição dos Membros.*Coalizão/);
  const manifest = read("public/shared/data/catalog-manifest.json");
  assert.ok(manifest.catalogs["vampire-anchors"].version >= 2);
  assert.equal(manifest.catalogs["vampire-anchors"].url, "/game-lines/vampire/data/anchors.json");
});

test("Vampire reference snapshot/creation recovery/sheet tooltips render all Anchor triggers in EN/PT/EN without mutating choices", async () => {
  const selection = { mask_id: "rebel", dirge_id: "visionary", notes: "Authored English stays." };
  const before = JSON.stringify({ data, selection });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "anchor-locale-and-test-surface", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/vampire/builder.tsx")) return `${code}\nexport { AnchorChoice };`;
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampireReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/reference.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requested = [];
      const reference = freezeCatalogData(await vampireReferenceCatalogGroup.load({ getCatalog: async id => { requested.push(id); return data[id]; } }));
      assert.deepEqual(requested.sort(), groups.map(group => `vampire-${group}`).sort());
      const { vampireAnchorPresentation } = await vite.ssrLoadModule("/game-lines/vampire/reference-presentation.ts");
      const { AnchorChoice } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
      const { SheetField } = await vite.ssrLoadModule("/app/workspace/character-paper-shell.tsx");
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const refuseMutation = () => { throw new Error("Render changed a saved Anchor"); };
      for (const definition of reference.anchors) {
        const presented = vampireAnchorPresentation(definition, locale);
        assert.equal(presented.id, definition.id);
        assert.equal(presented.name, definition.name);
        if (locale === "en-US") assert.equal(presented, definition);
        assert.equal(Object.isFrozen(definition.presentationPt), true);
        const choice = render(AnchorChoice, { label: translate(locale, "ui.mask"), value: definition.id, setValue: refuseMutation, anchors: reference.anchors, locale, invalid: false });
        assert.ok(choice.includes(escape(translate(locale, "ui.recoverWillpowerSummary", { single: presented.singleWillpower, all: presented.allWillpower }))), `${locale}: ${definition.id} creation`);
        for (const [key, field] of [["ui.mask", "singleWillpower"], ["ui.dirge", "allWillpower"]]) {
          const html = render(SheetField, { label: translate(locale, key), value: locale === "pt-BR" ? definition.translatedName : definition.name, tooltip: presented[field] });
          assert.ok(html.includes(`title="${escape(presented[field])}"`), `${locale}: ${definition.id} ${key}`);
        }
      }
      const authored = { id: "unavailable:anchor", name: "Authored Anchor", singleWillpower: "Authored trigger", allWillpower: "Authored full trigger" };
      assert.equal(vampireAnchorPresentation(authored, locale), authored);
      assert.equal(JSON.stringify({ data, selection }), before);
    } finally { await vite.close(); }
  }
  const sheet = readFileSync(new URL("../game-lines/vampire/sheet-view.tsx", import.meta.url), "utf8");
  assert.match(sheet, /tooltip=\{mask && vampireAnchorPresentation\(mask, locale\)\.singleWillpower\}/);
  assert.match(sheet, /tooltip=\{dirge && vampireAnchorPresentation\(dirge, locale\)\.allWillpower\}/);
});
