import assert from "node:assert/strict";
import test,{after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},resolve:{alias:{"@":root}}});
after(()=>vite.close());
const {migrateJsonV1,normalizeStoredSheet,safeJson}=await vite.ssrLoadModule("/lib/character-persistence.ts");
const {changelingRules}=await vite.ssrLoadModule("/game-lines/changeling/rules.ts");

test("invalid legacy JSON becomes an empty object",()=>assert.deepEqual(safeJson("{"),{}));
test("v1 migration preserves traits and canonicalizes Throne",()=>{
  const sheet=migrateJsonV1({game_line:"MtA",character:{name:"Test"},attributes:{Força:2},skills:{Ocultismo:3},merits:[{name:"Throne",dots:2}]},"Player");
  assert.equal(sheet.character.name,"Test");assert.equal(sheet.merits[0].name,"Power Behind the Throne");assert.equal(sheet.skills.Ocultismo,3);
});
test("stored sheets receive stable merit instance IDs",()=>{
  const sheet=migrateJsonV1({character:{},merits:[{name:"Allies",dots:2}]},"Player");delete sheet.merits[0].instanceId;
  assert.match(normalizeStoredSheet(sheet).merits[0].instanceId,/^legacy-merit-0-allies$/);
});
test("Changeling-owned normalization preserves structural persistence boundaries",()=>{
  const sheet=migrateJsonV1({game_line:"CtL",character:{},line_data:{wyrd:2,frailties:[]}},"Player");
  const normalized=changelingRules.normalizeCharacter(normalizeStoredSheet(sheet));
  assert.ok(Array.isArray(normalized.line_data.frailties));
});
