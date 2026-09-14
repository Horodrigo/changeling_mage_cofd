import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, server:{middlewareMode:true,hmr:false} });
after(async()=>vite.close());

const zoom = await vite.ssrLoadModule("/app/workspace/sheet-zoom.ts");

test("zoom da ficha respeita a largura-base e o limite do cabeçalho externo",()=>{
  assert.equal(zoom.maximumSheetZoom(800),1);
  assert.equal(zoom.maximumSheetZoom(900),1);
  assert.equal(zoom.maximumSheetZoom(1050),1050/900);
  assert.equal(zoom.maximumSheetZoom(1400),1200/900);
  assert.equal(zoom.stepSheetZoom(1,"in",1200/900),1.1);
  assert.equal(zoom.stepSheetZoom(1.3,"in",1200/900),1200/900);
  assert.equal(zoom.stepSheetZoom(1200/900,"out",1200/900),1.3);
  assert.equal(zoom.stepSheetZoom(1,"out",1200/900),1);
});

test("zoom é exclusivo do desktop e o workspace recebe o tema da linha ativa",async()=>{
  const [workspace,builder,css,changelingCss]=await Promise.all([
    readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/character-builder-shell.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
    readFile(new URL("../app/changeling-sheet.css",import.meta.url),"utf8"),
  ]);
  assert.match(workspace,/className="top-sheet-tools"/);
  assert.match(workspace,/className="sheet-zoom-control"/);
  assert.match(workspace,/className="top-sheet-edit"/);
  assert.doesNotMatch(workspace,/Changes to tracks are saved automatically|Alterações nos marcadores são salvas automaticamente/);
  assert.match(workspace,/!selected && <div className="view-heading"/);
  assert.match(workspace,/line-theme-\$\{selected\.game_line\.toLowerCase\(\)\}/);
  assert.match(builder,/line-theme-\$\{line\.toLowerCase\(\)\}/);
  assert.match(css,/\.line-theme-ctl \{/);
  assert.match(css,/\.line-theme-mta \{/);
  assert.match(css,/@media \(max-width:900px\) \{\s*\.sheet-zoom-control \{ display:none; \}/);
  assert.match(css,/\.top-sheet-edit,\.sheet-actions-trigger \{ height:32px;/);
  assert.match(css,/@media \(max-width:767px\)[\s\S]*?\.top-sheet-edit,\.sheet-actions-trigger \{ width:32px!important;/);
  assert.match(css,/@media \(max-width:767px\)[\s\S]*?\.cod-sheet \{ min-width:0; overflow:hidden; \}/);
  assert.match(changelingCss,/@media \(max-width: 767px\)[\s\S]*?\.ctl-sheet \.cod-sheet-title > div \{\s*display: grid;/);
});
