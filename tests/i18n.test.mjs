import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(async () => vite.close());

test("language preference is global and translation lookup is deterministic", async () => {
  const { languageStorageKey, localeFlag, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");

  assert.equal(languageStorageKey, "arquivo-das-trevas:locale:v1");
  assert.equal(localeFlag("pt-BR"), "🇧🇷");
  assert.equal(localeFlag("en-US"), "🇺🇸");
  assert.equal(
    translate("pt-BR", "builder.eligibility.requiredPoints", { required: 5 }),
    "Distribua 5 pontos.",
  );
  assert.equal(
    translate("en-US", "builder.eligibility.requiredPoints", { required: 5 }),
    "Allocate 5 points.",
  );
  assert.equal(translate("en-US", "sheet.clna"), "[missing translation: sheet.clna]");
});

test("all locales expose exactly the same message keys", async () => {
  const { messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const keys = (value, prefix = "") => Object.entries(value).flatMap(([key, child]) =>
    typeof child === "string" ? [`${prefix}${key}`] : keys(child, `${prefix}${key}.`),
  ).sort();

  assert.deepEqual(keys(messages["pt-BR"]), keys(messages["en-US"]));
});

test("translations are split between common and game-line dictionaries", () => {
  const infrastructure = readFileSync(new URL("../lib/i18n.tsx", import.meta.url), "utf8");
  for (const line of ["mortal", "changeling", "mage", "vampire"]) {
    assert.match(infrastructure, new RegExp(`i18n/messages/${line}`));
    const dictionary = readFileSync(new URL(`../lib/i18n/messages/${line}.ts`, import.meta.url), "utf8");
    assert.match(dictionary, new RegExp(`export const ${line}Messages`));
  }
  assert.ok(infrastructure.split("\n").length < 150);
});

test("English is the server/default locale and catalog fallback is explicit", async () => {
  const infrastructure = readFileSync(new URL("../lib/i18n.tsx", import.meta.url), "utf8");
  const catalogs = readFileSync(new URL("../lib/localized-catalog.ts", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(infrastructure, /const serverLocale = \(\):Locale => "en-US"/);
  assert.match(layout, /<html lang="en-US">/);
  assert.match(catalogs, /fallback: CatalogFallback = "empty"/);
});

test("Mage Order labels follow the active locale", async () => {
  const { mageOrderLabel } = await vite.ssrLoadModule("/game-lines/mage/creation-rules.ts");

  assert.equal(mageOrderLabel("Adamantine Arrow", "en-US"), "Adamantine Arrow");
  assert.equal(mageOrderLabel("Adamantine Arrow", "pt-BR"), "Seta Adamantina");
});

test("legacy tr() UI translation helper is not reintroduced in active app surfaces", async () => {
  const candidates = [
    "../app/workspace.tsx",
    "../app/game-line-builder.tsx",
    "../app/workspace/game-line-sheet.tsx",
    "../game-lines/mage/builder-view.tsx",
    "../game-lines/mage/sheet-view.tsx",
    "../game-lines/changeling/builder-view.tsx",
    "../game-lines/changeling/sheet-view.tsx",
    "../game-lines/vampire/builder.tsx",
    "../game-lines/vampire/sheet-view.tsx",
    "../game-lines/mortal/builder.tsx",
    "../game-lines/mortal/sheet-view.tsx",
  ];

  const violations = [];
  for (const candidate of candidates) {
    const content = readFileSync(new URL(candidate, import.meta.url), "utf8");
    if (/\btr\s*\(/.test(content)) violations.push(candidate);
  }

  assert.deepEqual(violations, []);
});
