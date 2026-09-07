import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false}});
after(async()=>vite.close());
const {TILTS}=await vite.ssrLoadModule("/lib/tilts.ts");
const {MAGE_CONDITIONS}=await vite.ssrLoadModule("/lib/mage-conditions.ts");
const {CHANGELING_CONDITIONS}=await vite.ssrLoadModule("/lib/changeling-conditions.ts");

test("line catalogs match the approved offline Condition index",()=>{
  assert.equal(CHANGELING_CONDITIONS.filter((item)=>item.sourceCode!=="BoC").length,63);
  assert.equal(MAGE_CONDITIONS.length,58);
  assert.ok(CHANGELING_CONDITIONS.every((item)=>item.name===item.originalName));
});

test("official Tilt catalog reconciles every approved offline-index and PDF record",()=>{
  const official=TILTS.filter((item)=>item.sourceCode!=="BoC");
  assert.equal(official.length,32);
  assert.equal(new Set(official.map((item)=>item.id)).size,official.length);
  assert.ok(official.every((item)=>item.name&&item.description&&item.effect&&item.causing&&item.ending&&item.source&&item.page>0));
  assert.deepEqual(Object.fromEntries(["CofD","HL","CTL 2e","MTA 2e","DE"].map((code)=>[code,official.filter((item)=>item.sourceCode===code).length])),{
    CofD:21,HL:5,"CTL 2e":1,"MTA 2e":2,DE:3,
  });
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
