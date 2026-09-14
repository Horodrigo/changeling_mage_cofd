import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const workspaceUrl = new URL("../app/workspace.tsx", import.meta.url);
const translationsUrl = new URL("../lib/i18n.tsx", import.meta.url);

test("workspace exposes creation from Home and Characters", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");

  assert.match(workspace, /Ver personagens","See Characters"/);
  assert.match(workspace, /Novo personagem","New Character"/);
  assert.match(workspace, /Criar personagem","Create Character"/);
  assert.match(workspace, /createCharacter=\{\(\) => setEditing\("new"\)\}/);
});

test("Home only renders nonempty game-line counts with their icons", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");

  assert.match(workspace, /lineCounts\.filter\(\(\{ count \}\) => count > 0\)/);
  assert.match(workspace, /<img src=\{registration\.iconSrc\}/);
  assert.doesNotMatch(workspace, /<strong>\{characters\.length\}<\/strong>/);
});

test("global character menu is dedicated to import and export", async () => {
  const [workspace, translations] = await Promise.all([
    readFile(workspaceUrl, "utf8"),
    readFile(translationsUrl, "utf8"),
  ]);

  const menuStart = workspace.indexOf('<DropdownMenuContent align="end" className={`sheet-actions-menu');
  const menuEnd = workspace.indexOf("</DropdownMenuContent>", menuStart);
  const menu = workspace.slice(menuStart, menuEnd);

  assert.ok(menuStart >= 0 && menuEnd > menuStart);
  assert.match(menu, /t\("importJson"\)/);
  assert.match(menu, /t\("saveJson"\)/);
  assert.doesNotMatch(menu, /createSheet|deleteSheet|DropdownMenuLabel|DropdownMenuSeparator/);
  assert.match(workspace, /<ArrowDownUp \/>/);
  assert.match(translations, /sheetActions:"Import\/Export"/);
  assert.match(translations, /saveJson:"Export JSON"/);
});
