import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());

test("all six official Seemings and Grimm provide complete Portuguese and English mechanics",async()=>{
  const {CTL_SEEMINGS}=await vite.ssrLoadModule("/lib/creation-rules.ts");
  assert.deepEqual(Object.keys(CTL_SEEMINGS),["Beast","Darkling","Elemental","Fairest","Ogre","Wizened","Grimm"]);
  assert.equal(CTL_SEEMINGS.Grimm.sourceId,"h-seemings");
  for(const [name,seeming] of Object.entries(CTL_SEEMINGS)){
    assert.ok(seeming.translated,`${name}: Portuguese name`);
    assert.ok(seeming.blessing,`${name}: Portuguese blessing`);
    assert.ok(seeming.curse,`${name}: Portuguese curse`);
    assert.ok(seeming.blessingEn,`${name}: English blessing`);
    assert.ok(seeming.curseEn,`${name}: English curse`);
    assert.ok(seeming.regalia,`${name}: Regalia`);
    assert.ok(seeming.favored,`${name}: favored Attribute category`);
  }
});

test("Seeming labels follow the active language without changing stored values",async()=>{
  const {seemingDisplayName}=await vite.ssrLoadModule("/lib/creation-rules.ts");
  assert.equal(seemingDisplayName("Beast","pt-BR"),"Fera");
  assert.equal(seemingDisplayName("Beast","en-US"),"Beast");
  assert.equal(seemingDisplayName("Wizened","pt-BR"),"Mirrado");
  assert.equal(seemingDisplayName("Wizened","en-US"),"Wizened");
});
