import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(async () => vite.close());
const canonical = JSON.parse(await read("public/game-lines/changeling/data/tokens.json"));
const portuguese = JSON.parse(await read("public/game-lines/changeling/data/tokens-pt.json"));
const { withTokenPresentation, tokenPresentation, configuredTokenPresentation } = await vite.ssrLoadModule("/game-lines/changeling/token-presentation.ts");
const catalog = withTokenPresentation(canonical, portuguese);
const fields = ["name", "effect", "description", "crux", "catch", "drawback"];
const selection = (definition, locale = "en-US", linked = true) => ({
  ...tokenPresentation(definition, locale), id: "instance-1", ...(linked ? { catalogId: definition.id } : {}),
  kind: definition.kind, rating: definition.rating, cost: "1 Glamour",
});

test("Changeling Regalia display localizes both mobile and desktop without changing affinities", async () => {
  const { changelingFavoredRegalia } = await vite.ssrLoadModule("/lib/changeling-regalia.ts");
  const { systemTerm } = await vite.ssrLoadModule("/lib/system-terms.ts");
  const data = { primary_regalia: "Crown", second_regalia: "Sword", kith: "Shadowsoul" };
  const before = structuredClone(data);
  const favored = changelingFavoredRegalia(data);
  assert.deepEqual(favored, ["Crown", "Sword", "Mirror"]);
  assert.deepEqual(favored.map((value) => systemTerm(value, "pt-BR")), ["Coroa", "Espada", "Espelho"]);
  assert.deepEqual(favored.map((value) => systemTerm(value, "en-US")), favored);
  assert.deepEqual(data, before);
  const sheet = await read("game-lines/changeling/sheet-view.tsx");
  assert.equal(sheet.match(/LineList items=\{changelingFavoredRegalia\(data\)\.map\(\(value\) => systemTerm\(value, locale\)\)\}/g)?.length, 2);
});

test("mobile Changeling Oaths precede Notes and no longer occupy Powers", async () => {
  const sheet = await read("game-lines/changeling/sheet-view.tsx");
  const mobile = sheet.slice(sheet.indexOf("if (isMobile)"), sheet.indexOf('return (<CharacterPaperShell line="CtL" title='));
  const powers = mobile.slice(mobile.indexOf("poderes:"), mobile.indexOf("entitlement:"));
  const notes = mobile.slice(mobile.indexOf("anotacoes:"));
  assert.doesNotMatch(powers, /ui\.oaths|writeAnOath/);
  assert.ok(notes.indexOf('t("ui.oaths")') < notes.indexOf('t("ui.notes")'));
  assert.match(notes, /updateLineData\(updateSheet, character, "oaths", value\)/);
  assert.match(notes, /NotesArea value=\{notes\}/);
});

test("catalog Tokens switch all text fields across locales, including exact ID-less stored copies", () => {
  const before = structuredClone(canonical);
  for (const definition of catalog) {
    for (const storedLocale of ["pt-BR", "en-US"]) {
      for (const linked of [true, false]) {
        const stored = selection(definition, storedLocale, linked);
        const original = structuredClone(stored);
        for (const locale of ["pt-BR", "en-US"]) {
          const presented = configuredTokenPresentation(stored, catalog, locale);
          const expected = tokenPresentation(definition, locale);
          for (const field of fields) assert.equal(presented[field], expected[field], `${definition.id}.${field}.${locale}`);
          assert.equal(presented.catalogId, definition.id);
          for (const field of ["id", "kind", "rating", "cost"]) assert.equal(presented[field], stored[field]);
        }
        assert.deepEqual(stored, original);
      }
    }
  }
  assert.deepEqual(canonical, before);
  assert.equal(tokenPresentation({ ...canonical[0], presentationPt: undefined }, "pt-BR").effect, canonical[0].effect);
});

test("custom Token fields remain authored and unknown identities never trigger invented translation", async () => {
  const definition = catalog.find((item) => item.kind === "token");
  const linked = { ...selection(definition, "pt-BR"), name: "Meu Penhor", effect: "Cost: um texto meu; Effect: não interpretar rótulos." };
  for (const locale of ["pt-BR", "en-US"]) {
    const shown = configuredTokenPresentation(linked, catalog, locale);
    assert.equal(shown.name, linked.name);
    assert.equal(shown.effect, linked.effect);
    assert.equal(shown.catch, tokenPresentation(definition, locale).catch);
    const unlinked = { ...linked, catalogId: undefined };
    assert.deepEqual(configuredTokenPresentation(unlinked, catalog, locale), unlinked);
    const missing = { ...linked, catalogId: "homebrew:unknown-token" };
    assert.deepEqual(configuredTokenPresentation(missing, catalog, locale), missing);
  }
  const { expandedConfigurationLines } = await vite.ssrLoadModule("/game-lines/changeling/sheet-merit-configurations.ts");
  const config = { items: [JSON.stringify(selection(definition, "pt-BR"))] };
  const english = expandedConfigurationLines("ctl-2ed:token", 5, config, "en-US", [], catalog).join("\n");
  assert.ok(english.includes(definition.name) && english.includes(definition.effect));
  assert.ok(!english.includes(tokenPresentation(definition, "pt-BR").name));
  assert.match(await read("game-lines/changeling/builder-merit-editor.tsx"), /catalogId:selected\.id/);
  assert.match(await read("game-lines/changeling/registration.ts"), /print: \[[^\n]*"changeling-tokens"/);
});

test("Token cards are collapsed by default and separate named fields in both locales", async () => {
  const { ConfiguredTokenList } = await vite.ssrLoadModule("/game-lines/changeling/token-cards.tsx");
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const definitions = ["token", "trifle", "bauble"].map((kind) => catalog.find((item) => item.kind === kind));
  const items = definitions.map((item, index) => ({ ...selection(item, "pt-BR"), id: `instance-${index}` }));
  for (const locale of ["pt-BR", "en-US"]) {
    const markup = renderToStaticMarkup(createElement(ConfiguredTokenList, { items, catalog, dots: 10, locale, renderTrifleUses: () => createElement("span", null, "uses-track") }));
    assert.equal(markup.match(/<details /g)?.length, 3);
    assert.doesNotMatch(markup, /<details[^>]*\bopen(?:=|\s|>)/);
    assert.equal(markup.match(/<dt>/g)?.length, 8);
    for (const key of ["cost", "effect", "catch", "drawback", "description", "crux"]) assert.ok(markup.includes(`<dt>${translate(locale, `ui.${key}`)}</dt>`), key);
    assert.ok(markup.includes(tokenPresentation(definitions[0], locale).name));
    assert.match(markup, /uses-track/);
    assert.match(markup, /configured-token-allocation/);
    assert.doesNotMatch(markup, /missing translation|undefined/);
  }
  const css = await read("game-lines/changeling/styles/sheet.css");
  assert.match(css, /\.configured-token-list\s*\{\s*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.configured-token-card dl\s*\{\s*line-height: 1\.45/);
});
