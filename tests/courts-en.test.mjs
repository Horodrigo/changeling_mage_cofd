import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());

test("all 21 Courts from the supplied Changeling sources have bilingual Mantle rules",async()=>{
  const {CTL_COURT_DEFINITIONS,courtPresentation}=await vite.ssrLoadModule("/lib/changeling-courts.ts");
  assert.equal(CTL_COURT_DEFINITIONS.length,21);
  assert.equal(new Set(CTL_COURT_DEFINITIONS.map(item=>item.id)).size,21);
  for(const item of CTL_COURT_DEFINITIONS){
    assert.ok(item.name && item.translatedName && item.emotion && item.emotionPt,item.id);
    assert.equal(item.mantleBenefits.length,5,item.id);
    assert.equal(item.mantleBenefitsPt.length,5,item.id);
    assert.ok(item.mantleBenefits.every(Boolean),`${item.id}: English Mantle`);
    assert.ok(item.mantleBenefitsPt.every(Boolean),`${item.id}: Portuguese Mantle`);
  }
  assert.equal(courtPresentation("Primavera","en-US").name,"Spring Court");
  assert.equal(courtPresentation("Corte da Árvore Desfolhada","pt-BR").page,238);
});

test("Court selector catalog includes the supplied sources and remains stable in stored Portuguese values",async()=>{
  const {CTL_COURTS}=await vite.ssrLoadModule("/lib/creation-rules.ts");
  assert.equal(CTL_COURTS.length,22); // Courtless plus 21 Courts.
  assert.ok(CTL_COURTS.includes("Corte da Árvore Desfolhada"));
});
