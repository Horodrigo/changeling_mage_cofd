import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {readFileSync} from "node:fs";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false}});
after(async()=>vite.close());
const {TILTS}=await vite.ssrLoadModule("/lib/tilts.ts");
const {MAGE_CONDITIONS}=await vite.ssrLoadModule("/lib/mage-conditions.ts");
const {CHANGELING_CONDITIONS}=await vite.ssrLoadModule("/lib/changeling-conditions.ts");
const findById=(catalog,id)=>catalog.find((item)=>item.id===id);
const conditionIndex=JSON.parse(readFileSync(new URL("./fixtures/official-conditions-index.json",import.meta.url),"utf8"));
const tiltIndex=JSON.parse(readFileSync(new URL("./fixtures/official-tilts-index.json",import.meta.url),"utf8"));
const citationKey=(item)=>`${item.originalName??item.name}|${item.sourceCode}|${item.page}`;

test("line catalogs match the approved offline Condition index",()=>{
  const changelingOfficial=CHANGELING_CONDITIONS.filter((item)=>item.sourceCode!=="BoC");
  assert.equal(changelingOfficial.length,65);
  assert.equal(MAGE_CONDITIONS.length,58);
  assert.ok(CHANGELING_CONDITIONS.every((item)=>item.name===item.originalName));
  assert.deepEqual(Object.fromEntries(["CofD","HL","CTL 2e","Kith","OA&T"].map((code)=>[code,changelingOfficial.filter((item)=>item.sourceCode===code).length])),{
    CofD:25,HL:9,"CTL 2e":20,Kith:9,"OA&T":2,
  });
  assert.deepEqual(Object.fromEntries(["CofD","HL","MTA 2e","NH-NA","DE","DEC"].map((code)=>[code,MAGE_CONDITIONS.filter((item)=>item.sourceCode===code).length])),{
    CofD:25,HL:9,"MTA 2e":14,"NH-NA":6,DE:3,DEC:1,
  });
});

test("official Conditions are unique, English-first, and mechanically complete",()=>{
  const catalogs=[
    CHANGELING_CONDITIONS.filter((item)=>item.sourceCode!=="BoC"),
    MAGE_CONDITIONS,
  ];
  const discardedFallbacks=[
    "Permanently remove the cause of the Condition",
    "Fulfill the circumstance that ends the described effect",
    "Gain a Beat when this Condition causes a significant complication",
  ];
  for(const catalog of catalogs){
    assert.equal(new Set(catalog.map((item)=>item.id)).size,catalog.length);
    for(const item of catalog){
      assert.equal(item.name,item.originalName,`${item.id} is not English-first`);
      assert.ok(item.description,`${item.id} has no effect description`);
      assert.ok(item.resolution,`${item.id} has no source-specific resolution`);
      assert.ok(item.source&&item.sourceCode&&item.page>0,`${item.id} has incomplete citation data`);
      assert.ok(!discardedFallbacks.some((text)=>item.resolution.includes(text)),`${item.id} still uses a generic fallback`);
      assert.ok(!("portuguese" in item),`${item.id} leaks presentation metadata into canonical data`);
    }
    assert.doesNotMatch(JSON.stringify(catalog),/\b(?:não|personagem|condição|recupere|ganhe|sofra|perseverança|compostura)\b/i);
  }
});

test("the combined catalogs exactly match every approved offline Condition citation",()=>{
  const combined=[
    ...CHANGELING_CONDITIONS.filter((item)=>item.sourceCode!=="BoC"),
    ...MAGE_CONDITIONS,
  ].filter((item,index,array)=>array.findIndex((candidate)=>citationKey(candidate)===citationKey(item))===index);
  assert.deepEqual(combined.map(citationKey).sort(),conditionIndex.map((item)=>`${item.name}|${item.sourceCode}|${item.page}`).sort());
});

test("Condition and Tilt selections survive the character JSON boundary",()=>{
  const sheet={
    schema_version:2,
    system:"chronicles-of-darkness",
    game_line:"CtL",
    current_state:{conditions:[{id:"broken",persistent:true}],health:{bashing:2}},
    line_data:{combat_tilts:["bleeding","flesh-too-solid"]},
  };
  const restored=JSON.parse(JSON.stringify(sheet));
  assert.deepEqual(restored.current_state.conditions,sheet.current_state.conditions);
  assert.deepEqual(restored.line_data.combat_tilts,sheet.line_data.combat_tilts);
  assert.ok(findById(CHANGELING_CONDITIONS,restored.current_state.conditions[0].id));
  for(const id of restored.line_data.combat_tilts) assert.ok(findById(TILTS,id));
});

test("Empty Heart e Magpie's Misfortune são Conditions persistentes de Changeling",()=>{
  const empty=findById(CHANGELING_CONDITIONS,"empty-heart"),magpie=findById(CHANGELING_CONDITIONS,"magpies-misfortune");
  assert.equal(empty?.persistent,true);
  assert.equal(magpie?.persistent,true);
  assert.match(magpie?.beat??"",/jinx/i);
});

test("official Tilt catalog reconciles every approved offline-index and PDF record",()=>{
  const official=TILTS.filter((item)=>item.sourceCode!=="BoC");
  assert.equal(official.length,33);
  assert.equal(new Set(official.map((item)=>item.id)).size,official.length);
  assert.ok(official.every((item)=>item.name&&item.description&&item.effect&&item.causing&&item.ending&&item.source&&item.page>0));
  assert.deepEqual(Object.fromEntries(["CofD","HL","CTL 2e","MTA 2e","DE"].map((code)=>[code,official.filter((item)=>item.sourceCode===code).length])),{
    CofD:22,HL:5,"CTL 2e":1,"MTA 2e":2,DE:3,
  });
  assert.deepEqual(official.map(citationKey).sort(),tiltIndex.map(citationKey).sort());
});

test("Dark Eras and Companion Conditions omitted by the old catalog are present",()=>{
  const expected={
    "The Sibyl's Tongue":["DE",78],
    "Monster":["DE",81],
    "Unclean":["DE",81],
    "Unintended Medium":["DEC",273],
  };
  for(const [name,[sourceCode,page]] of Object.entries(expected)){
    const condition=MAGE_CONDITIONS.find((item)=>item.originalName===name);
    assert.ok(condition,name);
    assert.equal(condition.sourceCode,sourceCode);
    assert.equal(condition.page,page);
    assert.ok(condition.description&&condition.resolution);
  }
});
