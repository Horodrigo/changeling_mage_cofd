import assert from "node:assert/strict";
import test,{after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
const {CONTRACT_TEXT_EN}=await vite.ssrLoadModule("/lib/contracts-en.ts");
const {contractHasInvocationRoll,contractOutcomeSections,contractPresentation,contractSummary}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
test("all 110 core Contracts have English mechanical presentation",()=>{
 const core=CONTRACTS.filter(x=>x.sourceId==="ctl-2ed");
 assert.equal(core.length,110);assert.ok(core.every(contract=>CONTRACT_TEXT_EN[contract.id]),"every core Contract has English text");
 for(const contract of core){const en=CONTRACT_TEXT_EN[contract.id];assert.ok(en.description?.trim(),contract.id);const sections=contractOutcomeSections(contract,"en-US");assert.ok(sections.length,contract.id);if(contractHasInvocationRoll(contract)===true)assert.deepEqual(sections.map(x=>x.label),["Success","Exceptional Success","Failure","Dramatic Failure"],contract.id);else assert.deepEqual(sections.map(x=>x.label),["Effect"],contract.id)}
});

test("rolled Contracts never consume Success as their English Summary",()=>{
 const portents=CONTRACTS.find(x=>x.id==="ctl-2ed:portents-and-visions");
 const shown=contractPresentation(portents,"en-US");
 const sections=contractOutcomeSections(shown,"en-US");
 assert.match(contractSummary(portents,"en-US"),/^Choose past or future/);
 assert.match(sections.find(x=>x.label==="Success").text,/^Past:/);
 assert.notEqual(contractSummary(portents,"en-US"),sections.find(x=>x.label==="Success").text);
 assert.deepEqual(sections.map(x=>x.label),["Success","Exceptional Success","Failure","Dramatic Failure"]);
 const reviewedRolled=["mask-of-superiority","paralyzing-presence","tumult","discreet-summons","pipes-of-the-beastcaller","spinning-wheel","portents-and-visions"];
 for(const slug of reviewedRolled){
  const contract=CONTRACTS.find(x=>x.id===`ctl-2ed:${slug}`);
  const summary=contractSummary(contract,"en-US");
  const success=contractOutcomeSections(contractPresentation(contract,"en-US"),"en-US").find(x=>x.label==="Success")?.text;
  assert.ok(summary,contract.id);
  assert.ok(success,contract.id);
  assert.notEqual(summary,success,contract.id);
 }
});
