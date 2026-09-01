import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});
after(async () => vite.close());

const homebrews = await vite.ssrLoadModule("/lib/homebrews.ts");
const merits = await vite.ssrLoadModule("/lib/merits.ts");
const expanded = await vite.ssrLoadModule("/lib/expanded-merits.ts");

test("interpreta benefícios e requisitos nomeados linha a linha", () => {
  assert.deepEqual(homebrews.parseNamedText("Beast: dentes\nOgre: força"), {
    Beast: "dentes",
    Ogre: "força",
  });
});

test("filtra Méritos homebrew por linha e preserva os Core", () => {
  const catalog = {
    contracts: [],
    spells: [],
    merits: [
      { id: "core", line: "Core" },
      { id: "ctl", line: "CtL" },
      { id: "mta", line: "MtA" },
    ],
  };
  assert.deepEqual(
    homebrews.meritsForLine(catalog, "CtL").map((item) => item.id),
    ["core", "ctl"],
  );
});

test("combina toggle geral e individual sem perder preferências", () => {
  const catalog = { ...homebrews.EMPTY_HOMEBREWS, disabledIds: ["h-courts", "custom"] };
  assert.equal(homebrews.isHomebrewActive(catalog, "h-courts"), false);
  assert.equal(homebrews.isHomebrewActive(catalog, "outro"), true);
  assert.equal(homebrews.isHomebrewActive({ ...catalog, enabled: false }, "outro"), false);
  assert.equal(homebrews.isBuiltinHomebrew("h-seemings"), true);
  assert.equal(homebrews.isBuiltinHomebrew("ctl-2ed"), false);
});

test("Gunslinger é um Estilo de Combate Core completo para ambas as linhas", () => {
  for (const line of ["CtL", "MtA"]) {
    const gunslinger = merits
      .getMeritsForLine(line)
      .find((item) => item.name === "Gunslinger");
    assert.equal(gunslinger?.line, "Core");
    assert.equal(gunslinger?.category, "Fighting Style");
    assert.deepEqual(gunslinger?.ratings, [1, 3, 5]);
  }
  assert.deepEqual(
    expanded.findExpandedMerit("Gunslinger").levels.map((item) => item.rating),
    [1, 3, 5],
  );
});
