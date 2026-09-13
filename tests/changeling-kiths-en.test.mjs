import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
import {readFileSync} from "node:fs";
const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const kithModule=await vite.ssrLoadModule("/lib/changeling-kiths.ts");
kithModule.replaceKithCatalog(JSON.parse(readFileSync(new URL("../public/data/changeling/kiths.json",import.meta.url),"utf8")),JSON.parse(readFileSync(new URL("../public/data/changeling/kiths-pt.json",import.meta.url),"utf8")));
const {KITHS,kithPresentation,kithSkillOptions}=kithModule;
const KITH_TEXT_EN=Object.fromEntries(KITHS.map(({id,description,blessing,skill})=>[id,{description,blessing,skill}]));
const {KITH_CREATION_CHOICES}=await vite.ssrLoadModule("/lib/changeling-kith-choices.ts");
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
 assert.equal(kithPresentation(source.id,"en-US").blessing,source.blessing);
 assert.notEqual(kithPresentation(source.id,"pt-BR").blessing,source.blessing);
 assert.deepEqual(source,before);
});
test("skill filters use individual canonical English Skills",()=>{
 const byId=Object.fromEntries(KITHS.map(kith=>[kith.id,kith]));
 assert.deepEqual(kithSkillOptions(byId.bloodbrute),["Athletics","Intimidation"]);
 assert.deepEqual(kithSkillOptions(byId.fireheart),["Crafts","Survival"]);
 assert.deepEqual(kithSkillOptions(byId.moonborn),["Empathy","Intimidation"]);
 assert.deepEqual(kithSkillOptions(byId.enkrateia),["Empathy","Persuasion","Subterfuge"]);
 assert.ok(!KITHS.flatMap(kithSkillOptions).includes("or Subterfuge"));
 assert.ok(!kithSkillOptions(byId.bloodbrute).includes("Atletismo ou Intimidação"));
});
test("creation choices cover every persistent choice stated by a Kith blessing",()=>{
 assert.deepEqual(Object.keys(KITH_CREATION_CHOICES).sort(),["artist","bearskin","bricoleur","chevalier","draconic","gravewight","hunterheart","moonborn","swarmflight","valkyrie","whisperwisp"]);
 assert.equal(KITH_CREATION_CHOICES.bricoleur.kind,"specialty");
 assert.equal(KITH_CREATION_CHOICES.swarmflight.kind,"text");
 assert.deepEqual(KITH_CREATION_CHOICES.whisperwisp.options,["Stealth","Persuasion"]);
});
