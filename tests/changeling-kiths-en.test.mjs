import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const {KITHS,kithPresentation,kithSkillOptions}=await vite.ssrLoadModule("/lib/changeling-kiths.ts");
const {KITH_TEXT_EN}=await vite.ssrLoadModule("/lib/changeling-kiths-en.ts");
test("all 73 official and 12 Book of Seemings Kith IDs have complete English presentation summaries",()=>{
 assert.equal(KITHS.length,85); assert.equal(KITHS.filter(x=>x.sourceId==="h-seemings").length,12); assert.deepEqual(Object.keys(KITH_TEXT_EN).sort(),KITHS.map(x=>x.id).sort());
 for(const kith of KITHS){const text=KITH_TEXT_EN[kith.id]; for(const field of ["description","blessing","skill"]) assert.ok(text[field]?.trim(),`${kith.id}.${field}`);}
});
test("documented source ambiguities remain explicit",()=>{
 assert.match(KITH_TEXT_EN.lethipomp.blessing,/does not specify the resistance pool/i);
 assert.match(KITH_TEXT_EN.whisperwisp.blessing,/choose Stealth or Persuasion/i);
 assert.match(KITH_TEXT_EN.sandharrowed.blessing,/grants the victim cover/i);
});
test("presentation switches languages without changing catalog identity",()=>{
 const source=KITHS[0],before=structuredClone(source);
 assert.equal(kithPresentation(source.id,"en-US").name,source.name);
 assert.equal(kithPresentation(source.id,"pt-BR").name,source.translatedName);
 assert.notEqual(kithPresentation(source.id,"en-US").blessing,source.blessing);
 assert.deepEqual(source,before);
});
test("skill filters use individual canonical English Skills",()=>{
 const byId=Object.fromEntries(KITHS.map(kith=>[kith.id,kith]));
 assert.deepEqual(kithSkillOptions(byId.bloodbrute),["Athletics","Intimidation"]);
 assert.deepEqual(kithSkillOptions(byId.fireheart),["Crafts","Survival"]);
 assert.deepEqual(kithSkillOptions(byId.moonborn),["Empathy","Intimidation"]);
 assert.ok(!kithSkillOptions(byId.bloodbrute).includes("Atletismo ou Intimidação"));
});
