import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");
const lines = ["mortal", "changeling", "mage", "vampire", "werewolf"];

test("public resources have one owner and only PWA entry points remain at the root", async () => {
  const entries = await readdir(new URL("public/", root), { withFileTypes: true });
  assert.deepEqual(entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort(), ["game-lines", "shared"]);
  const allowed = new Set(["app-icon-192.png", "app-icon-512.png", "favicon.svg", "manifest.webmanifest", "sw.js", "sw.template.js", "version.json"]);
  for (const entry of entries.filter(entry => entry.isFile())) assert.ok(allowed.has(entry.name), entry.name);
  assert.deepEqual((await readdir(new URL("app/css/", root))).sort(), ["globals.css"]);
  for (const line of lines) {
    const categories = await readdir(new URL(`public/game-lines/${line}/`, root));
    for (const category of categories) assert.ok(["data", "images", "fonts"].includes(category), `${line}/${category}`);
    assert.ok((await stat(new URL(`public/game-lines/${line}/images/icon.webp`, root))).size > 0);
    assert.ok((await stat(new URL(`game-lines/${line}/styles/`, root))).isDirectory());
  }
});

test("sheet URLs, registration icons and service-worker resources resolve to real public files", async () => {
  const paths = ["app/workspace.tsx", ...lines.flatMap(line => [
    `game-lines/${line}/registration.ts`, `game-lines/${line}/styles/sheet.css`,
  ])];
  const sources = (await Promise.all(paths.map(read))).join("\n");
  const urls = new Set([...sources.matchAll(/(?:url\(["']?|(?:src|iconSrc)\s*[:=]\s*["'])(\/[^"')\s]+\.(?:webp|woff2|png|svg))/g)].map(match => match[1]));
  const template = await read("public/sw.template.js");
  const shell = template.slice(template.indexOf("const SHELL = ["), template.indexOf("];"));
  for (const match of shell.matchAll(/"(\/[^"\n]+)"/g)) urls.add(match[1]);
  urls.delete("/");
  assert.ok(urls.size > 40, "asset references must actually be checked");
  for (const url of urls) assert.ok((await stat(new URL(`public${url}`, root))).size > 0, url);
});

test("catalog URLs follow data ownership rather than the line that can buy an item", async () => {
  const manifest = JSON.parse(await read("public/shared/data/catalog-manifest.json"));
  for (const [id, resource] of Object.entries(manifest.catalogs)) {
    const owner = lines.find(line => id.includes(line));
    const prefix = owner ? `/game-lines/${owner}/data/` : "/shared/data/";
    assert.ok(resource.url.startsWith(prefix), `${id}: ${resource.url}`);
  }
  assert.equal(manifest.catalogs["merits-changeling"].url, "/game-lines/changeling/data/merits.json");
  assert.equal(manifest.catalogs["merits-mage"].url, "/game-lines/mage/data/merits.json");
  assert.equal(manifest.catalogs["merits-core-pt"].url, "/shared/data/merits-pt.json");
});

test("Werewolf skull displays black before lazy surfaces load, preserving its original asset and proportions", async () => {
  assert.match(await read("app/layout.tsx"), /import "\.\.\/game-lines\/werewolf\/styles\/icon\.css"/);
  const css = await read("game-lines/werewolf/styles/icon.css");
  assert.match(css, /img\[src="\/game-lines\/werewolf\/images\/icon\.webp"\]\s*\{\s*filter:\s*brightness\(0\);\s*\}/);
  assert.doesNotMatch(css, /\b(?:width|height|scale|transform|object-fit)\s*:/);
  assert.match(await read("game-lines/werewolf/registration.ts"), /iconSrc: "\/game-lines\/werewolf\/images\/icon\.webp"/);
});
