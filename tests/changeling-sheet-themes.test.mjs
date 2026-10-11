import assert from "node:assert/strict";
import test, { after } from "node:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { changelingThemes, discoverChangelingThemes } from "../build/changeling-themes.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, plugins: [changelingThemes()], server: { middlewareMode: true, hmr: false }, resolve: { alias: { "@": root } } });
after(() => vite.close());

test("Changeling themes are discovered from theme-* directories, with partial image overrides", async () => {
  const images = await mkdtemp(join(tmpdir(), "changeling-themes-"));
  try {
    await writeFile(join(images, "title.webp"), "");
    await writeFile(join(images, "paper-texture.webp"), "");
    await mkdir(join(images, "theme-fairest"));
    await mkdir(join(images, "theme-darkling"));
    await mkdir(join(images, "unrelated"));
    await writeFile(join(images, "theme-fairest", "title.webp"), "");
    await writeFile(join(images, "theme-darkling", "paper-texture.webp"), "");
    await writeFile(join(images, "theme-darkling", "not-a-default.webp"), "");
    const themes = await discoverChangelingThemes(images);
    assert.deepEqual(themes.map(theme => theme.id), ["darkling", "fairest"]);
    assert.deepEqual(themes[0].assets, { "paper-texture": "/game-lines/changeling/images/theme-darkling/paper-texture.webp" });
    assert.equal(themes[1].name, "Fairest");
    await mkdir(join(images, "theme-default"));
    await assert.rejects(discoverChangelingThemes(images), /reserved/);
  } finally {
    await rm(images, { recursive: true, force: true });
  }
});

test("theme module resolves at build time, and all existing Fairest assets map to the in-app CSS", async () => {
  const transformed = await vite.environments.client.transformRequest("virtual:changeling-sheet-themes");
  assert.ok(transformed);
  assert.doesNotMatch(transformed.code, /import .*public.*changeling.*images/);
  const { default: themes } = await vite.ssrLoadModule("virtual:changeling-sheet-themes");
  const fairest = themes.find(theme => theme.id === "fairest");
  assert.ok(fairest);
  const { sheetThemeCss } = await vite.ssrLoadModule("/game-lines/changeling/sheet-theme.ts");
  const css = await readFile(new URL("../game-lines/changeling/styles/sheet.css", import.meta.url), "utf8");
  const [screen, print] = css.split("/* CtL print preview and A4 output are independent from the responsive sheet. */");
  for (const [name, url] of Object.entries(fairest.assets)) {
    assert.ok(screen.includes(`var(--ctl-image-${name}, url("/game-lines/changeling/images/${name}.webp"))`), name);
    assert.ok(sheetThemeCss(fairest).includes(url));
  }
  assert.match(sheetThemeCss(fairest), /^@media screen \{ \.cod-sheet\.ctl-sheet/);
  assert.equal(sheetThemeCss(), "");
  assert.doesNotMatch(print, /--ctl-image-/);
  assert.doesNotMatch(print, /theme-fairest/);
});

test("only Changeling registers the independent lazy toolbar, beside language with compact Mobile sizing", async () => {
  const { listGameLineRegistrations } = await vite.ssrLoadModule("/game-lines/registry/game-line-registry.ts");
  assert.deepEqual(listGameLineRegistrations().filter(line => line.loadSheetToolbar).map(line => line.id), ["CtL"]);
  const workspace = await readFile(new URL("../app/workspace.tsx", import.meta.url), "utf8");
  assert.match(workspace, /selected && !editing && <GameLineSheetToolbar gameLine=\{selected.game_line\} \/>/);
  assert.ok(workspace.indexOf("<GameLineSheetToolbar") < workspace.indexOf('<button className="language-trigger"'));
  const css = await readFile(new URL("../game-lines/changeling/styles/sheet-theme.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /\.sheet-theme-trigger span \{\s*display: none/);
});

test("title adjustment blocks distinguish themes and actual Desktop/Mobile surfaces, excluding print", async () => {
  const toolbar = await readFile(new URL("../game-lines/changeling/sheet-theme-toolbar.tsx", import.meta.url), "utf8");
  assert.match(toolbar, /<style data-changeling-sheet-theme=\{themeId\}>/);
  const css = await readFile(new URL("../game-lines/changeling/styles/sheet-theme.css", import.meta.url), "utf8");
  const adjustments = css.slice(css.indexOf("@media screen")).replace(/\s+/g, " ");
  assert.ok(adjustments.startsWith("@media screen {"));
  for (const theme of ["default", "fairest"]) {
    for (const surface of [":not(.mobile-character-sheet)", ".mobile-character-sheet"]) {
      for (const element of [".ctl-title-mark", "strong", "p"]) {
        assert.ok(adjustments.includes(`.app-shell:has([data-changeling-sheet-theme="${theme}"]) .ctl-sheet${surface} .cod-sheet-title ${element} {`));
      }
    }
  }
  assert.match(adjustments, /translate: 0 0/);
  assert.doesNotMatch(adjustments, /ctl-print/);
});

test("Kith highlight theme controls move and scale only the assembled decorative frame", async () => {
  const css = (await readFile(new URL("../game-lines/changeling/styles/sheet-theme.css", import.meta.url), "utf8")).replace(/\s+/g, " ");
  for (const theme of ["default", "fairest"]) {
    for (const surface of [":not(.mobile-character-sheet)", ".mobile-character-sheet"]) {
      const selector = `.app-shell:has([data-changeling-sheet-theme="${theme}"]) .ctl-sheet${surface} .skill-highlight-kith .kith-skill-frame`;
      assert.ok(css.includes(`${selector} {`), selector);
      const block = css.slice(css.indexOf(`${selector} {`) + selector.length).split("}")[0];
      assert.match(block, /translate:\s*[^;]+;/);
      assert.match(block, /scale:\s*[^;]+;/);
      assert.match(block, /transform-origin:\s*center;/);
    }
  }
  const frameControls = css.slice(css.indexOf("MOLDURA DA PERICIA DE KITH"));
  assert.match(frameControls, /@media screen/);
  assert.doesNotMatch(frameControls, /kith-skill-piece|kith-skill-name-text|ctl-print/);
});
