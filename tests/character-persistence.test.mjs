import assert from "node:assert/strict";
import test,{after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},resolve:{alias:{"@":root}}});
after(()=>vite.close());
const {normalizeStoredSheet,validateCurrentCharacter}=await vite.ssrLoadModule("/lib/character-persistence.ts");
const {creationMerits}=await vite.ssrLoadModule("/lib/merit-progression.ts");
const {normalizeGameLineCharacter}=await vite.ssrLoadModule("/game-lines/registry/game-line-registry.ts");
const {isCurrentStoredCharacter,summarizeStoredCharacter}=await vite.ssrLoadModule("/lib/stored-character.ts");

const sheet=(game_line="MtA")=>({id:"sheet",schema_version:2,system:"chronicles-of-darkness",game_line,ruleset:{id:"current",version:1},character:{name:"Test",concept:"",player:"Player"},attributes:{Strength:2},skills:{Occult:3},specializations:[],merits:[{name:"Allies",dots:2}],line_data:{},derived:{},current_state:{},created_at:"2026-01-01",updated_at:"2026-01-01"});

test("current schema normalization preserves character data",()=>{
  const normalized=normalizeStoredSheet(sheet());
  assert.equal(normalized.character.name,"Test");assert.equal(normalized.skills.Occult,3);
});
test("validation rejects old schemas without attempting migration",()=>{
  assert.equal(validateCurrentCharacter({...sheet(),schema_version:1}),"unsupported-schema");
  assert.equal(validateCurrentCharacter({schema_version:2,system:"chronicles-of-darkness",game_line:"VtR"}),"invalid-character");
  assert.equal(validateCurrentCharacter(sheet()),"valid");
});
test("legacy local records stay opaque but retain enough metadata for deletion",()=>{
  const legacy={id:"old-sheet",schema_version:1,game_line:"MtA",character:{name:"Old mage",concept:""}};
  assert.equal(isCurrentStoredCharacter(legacy),false);
  assert.deepEqual(summarizeStoredCharacter(legacy),{
    name:"Old mage",concept:"",gameLine:"MtA",updatedAt:"",isCurrent:false,
  });
  assert.equal(summarizeStoredCharacter({id:"unknown"}).name,"Ficha sem nome");
});
test("structural persistence normalization assigns stable merit instance IDs",()=>{
  const current=sheet();delete current.merits[0].instanceId;
  assert.match(normalizeStoredSheet(current).merits[0].instanceId,/^legacy-merit-0-allies$/);
});
test("creation merits survive save normalization and remain editable",()=>{
  for(const game_line of ["CtL","MtA","VtR"]){
    const current=sheet(game_line);current.merits[0]={...current.merits[0],creationDots:2,experienceDots:0};
    const normalized=normalizeStoredSheet(current);
    assert.deepEqual([normalized.merits[0].creationDots,normalized.merits[0].experienceDots],[2,0]);
    assert.equal(creationMerits(normalized.merits).length,1);
  }
  assert.equal(creationMerits(sheet().merits).length,1,"current-schema merits saved before allocation metadata must remain recoverable");
});
test("Changeling-owned normalization preserves structural persistence boundaries",async()=>{
  const current={...sheet("CtL"),line_data:{wyrd:2,frailties:[]}};
  const normalized=await normalizeGameLineCharacter(normalizeStoredSheet(current));
  assert.ok(Array.isArray(normalized.line_data.frailties));
});
test("current sheets apply only the selected line's merit synchronization",async()=>{
  const mage=await normalizeGameLineCharacter(normalizeStoredSheet({...sheet("MtA"),line_data:{order:"Orderless"}}));
  const changeling=await normalizeGameLineCharacter(normalizeStoredSheet({...sheet("CtL"),line_data:{court:"Spring"}}));
  assert.equal(mage.merits.some((merit)=>merit.name==="Mantle"),false);
  assert.equal(changeling.merits.some((merit)=>merit.name==="Mantle"&&merit.grantedBy==="Corte"),true);
});
