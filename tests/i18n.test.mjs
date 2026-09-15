import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { readWorkspaceSourceSync } from "./workspace-source.mjs";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());

test("idioma usa uma preferência global separada dos dados das fichas",async()=>{
  const {languageStorageKey,localeFlag}=await vite.ssrLoadModule("/lib/i18n.tsx");
  assert.equal(languageStorageKey,"arquivo-das-trevas:locale:v1");
  assert.equal(localeFlag("pt-BR"),"🇧🇷");
  assert.equal(localeFlag("en-US"),"🇺🇸");
});

test("inglês é o idioma inicial e catálogos não recorrem silenciosamente ao português",()=>{
  const infrastructure=readFileSync(new URL("../lib/i18n.tsx",import.meta.url),"utf8");
  const catalogs=readFileSync(new URL("../lib/localized-catalog.ts",import.meta.url),"utf8");
  const layout=readFileSync(new URL("../app/layout.tsx",import.meta.url),"utf8");
  assert.match(infrastructure,/const serverLocale = \(\):Locale => "en-US"/);
  assert.match(infrastructure,/=== "pt-BR" \? "pt-BR" : "en-US"/);
  assert.match(layout,/<html lang="en-US">/);
  assert.match(catalogs,/fallback: CatalogFallback = "empty"/);
});

test("seletor fica após Homebrews e mantém rótulo acessível",()=>{
  const source=readFileSync(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  const infrastructure=readFileSync(new URL("../lib/i18n.tsx",import.meta.url),"utf8");
  assert.ok(source.indexOf("nav.map")<source.indexOf("language-trigger"));
  assert.match(source,/aria-label=\{`\$\{t\("language"\)\}/);
  assert.match(infrastructure,/document\.documentElement\.lang/);
});

test("a ficha localiza Kith, Courtless, compras e linhas editáveis",async()=>{
  const source=readWorkspaceSourceSync();
  const {courtDisplayName}=await vite.ssrLoadModule("/lib/changeling-courts.ts");
  assert.equal(courtDisplayName("Sem Corte","en-US"),"Courtless");
  assert.match(source,/label=\{tr\("Frátria", "Kith"\)\}/);
  assert.match(source,/purchaseTypeLabel\(value,locale\)/);
  assert.match(source,/tr\("Adicionar linha", "Add row"\)/);
  assert.match(source,/tr\("Escreva um Juramento", "Write an Oath"\)/);
});

test("Conditions de Changeling apresentam mecânicas sem português no modo inglês",async()=>{
  const conditionModule=await vite.ssrLoadModule("/lib/changeling-conditions.ts");
  conditionModule.replaceChangelingConditionCatalog([
    ...JSON.parse(readFileSync(new URL("../public/data/core/conditions.json",import.meta.url),"utf8")),
    ...JSON.parse(readFileSync(new URL("../public/data/changeling/conditions.json",import.meta.url),"utf8")),
  ],{
    ...JSON.parse(readFileSync(new URL("../public/data/core/conditions-pt.json",import.meta.url),"utf8")),
    ...JSON.parse(readFileSync(new URL("../public/data/changeling/conditions-pt.json",import.meta.url),"utf8")),
  });
  const {CHANGELING_CONDITIONS,changelingConditionPresentation}=conditionModule;
  const presented=CHANGELING_CONDITIONS.map((item)=>changelingConditionPresentation(item,"en-US"));
  assert.equal(presented.length,CHANGELING_CONDITIONS.length);
  assert.ok(presented.every((item)=>item.name===item.originalName));
  assert.ok(presented.every((item)=>item.description && item.resolution));
  assert.equal(presented.find((item)=>item.id==="broken").penalty,"−2 to Social and Resolve rolls; −5 to Intimidation.");
  assert.equal(presented.find((item)=>item.id==="blind").category,"Physical");
  assert.match(presented.find((item)=>item.id==="contemptuous").penalty,/Gain \+2/);
});

test("equipamentos e companheiros não exibem conteúdo português no modo inglês",async()=>{
  const combat=await vite.ssrLoadModule("/lib/combat-equipment.ts");
  const companions=await vite.ssrLoadModule("/lib/companions.ts");
  const portuguese=/\b(?:Armadura|Armas|Atletismo|Briga|Compostura|Destreza|Força|Furtividade|Inteligência|Manipulação|Perseverança|Presença|Raciocínio|Sobrevivência|Vigor|Mordida|Garra|Chifres|Presa|Bico|Tronco|braços|pernas|Permite|Auxilia|Causa|Reduz|Protege|voo)\b/i;
  const withoutId=item=>JSON.stringify(Object.fromEntries(Object.entries(item).filter(([key])=>key!=="id")));
  const combatText=[...combat.WEAPONS,...combat.ARMORS,...combat.EQUIPMENT].map(item=>withoutId(combat.combatItemPresentation(item,"en-US")));
  const companionText=[...companions.VEHICLES.map(item=>withoutId(companions.vehiclePresentation(item,"en-US"))),...companions.ANIMALS.map(item=>withoutId(companions.animalPresentation(item,"en-US")))];
  assert.deepEqual(combatText.filter(text=>portuguese.test(text)),[]);
  assert.deepEqual(companionText.filter(text=>portuguese.test(text)),[]);
});
