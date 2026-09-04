import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());

test("idioma usa uma preferência global separada dos dados das fichas",async()=>{
  const {languageStorageKey,localeFlag}=await vite.ssrLoadModule("/lib/i18n.tsx");
  assert.equal(languageStorageKey,"arquivo-das-trevas:locale:v1");
  assert.equal(localeFlag("pt-BR"),"🇧🇷");
  assert.equal(localeFlag("en-US"),"🇺🇸");
});

test("seletor fica após Homebrews e mantém rótulo acessível",()=>{
  const source=readFileSync(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  const infrastructure=readFileSync(new URL("../lib/i18n.tsx",import.meta.url),"utf8");
  assert.ok(source.indexOf("nav.map")<source.indexOf("language-trigger"));
  assert.match(source,/aria-label=\{`\$\{t\("language"\)\}/);
  assert.match(infrastructure,/document\.documentElement\.lang/);
});
