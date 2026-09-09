import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false}});
after(()=>vite.close());
const {ELEVENTH_QUESTION,eleventhQuestionPrerequisites,normalizeLegacyState}=await vite.ssrLoadModule("/lib/legacies.ts");
const {refundMageAdvancement}=await vite.ssrLoadModule("/lib/experience-refunds.ts");

const mage=(overrides={})=>({
  skills:{Investigação:2,Erudição:2},
  line_data:{gnosis:2,path:"Moros",order:"Orderless",arcana:{Tempo:2},praxes:[],...overrides},
});

test("The Eleventh Question contains the complete five-rank progression",()=>{
  assert.equal(ELEVENTH_QUESTION.rulingArcanum,"Time");
  assert.deepEqual(ELEVENTH_QUESTION.attainments.map(item=>[item.rank,item.orthodoxGnosis,item.novelGnosis]),[[1,2,3],[2,2,3],[3,4,5],[4,6,7],[5,8,9]]);
  assert.equal(ELEVENTH_QUESTION.yantras.length,4);
  assert.equal(ELEVENTH_QUESTION.oblations.length,4);
});

test("Legacy entry accepts parentage or the Perfect Timing Praxis",()=>{
  assert.equal(eleventhQuestionPrerequisites(mage()).met,true);
  assert.equal(eleventhQuestionPrerequisites(mage({path:"Acanthus",order:"Silver Ladder"})).met,false);
  assert.equal(eleventhQuestionPrerequisites(mage({path:"Acanthus",order:"Silver Ladder",praxes:[{name:"Perfect Timing"}]})).met,true);
});

test("Legacy prerequisites read the canonical Portuguese trait keys stored by the sheet",()=>{
  const checks=eleventhQuestionPrerequisites(mage());
  assert.deepEqual({time:checks.time,investigation:checks.investigation,qualifying:checks.qualifying,met:checks.met},{time:true,investigation:true,qualifying:true,met:true});
});

test("Legacy state normalization preserves only valid ranks",()=>{
  assert.deepEqual(normalizeLegacyState({definitionId:"the-eleventh-question",joined:true,attainmentRanks:[3,1,3,9],initiationMethod:"tutelage"}),{definitionId:"the-eleventh-question",joined:true,attainmentRanks:[1,3],initiationMethod:"tutelage"});
});

test("Legacy refunds restore removed Praxes and only their transaction delta",()=>{
  const sheet={attributes:{},skills:{},merits:[],specializations:[],line_data:{legacy_state:{definitionId:"the-eleventh-question",joined:true,attainmentRanks:[1,2]},praxes:[]},current_state:{}};
  const praxis={id:"postcognition",name:"Postcognition"};
  refundMageAdvancement(sheet,{kind:"legacyAttainment",rank:2,removedPraxis:{key:"praxes",index:0,item:praxis},creditedRegular:0,creditedArcane:1,creditedArcaneBeats:1});
  assert.deepEqual(sheet.line_data.legacy_state.attainmentRanks,[1]);
  assert.deepEqual(sheet.line_data.praxes,[praxis]);
});

test("Mage sheet exposes Join/Join Create and places Legacy before Combat",async()=>{
  const {readFile}=await import("node:fs/promises");
  const workspace=await readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(workspace,/gnosis >= 3 \? tr\("Join\/Create"/);
  assert.match(workspace,/<TabsTrigger value="magia"[^]*<TabsTrigger value="legacy"[^]*<TabsTrigger value="combate"/);
  assert.match(workspace,/Estas informações não são controladas automaticamente pela ficha/);
  assert.match(workspace,/tr\("Pagamento","Payment"\)[\s\S]*options=\{method==="tutelage"\?\[\{value:"regular",label:"1 Experience"\},\{value:"arcane",label:"1 Arcane Experience"\}\]:\[\{value:"arcane",label:"1 Arcane Experience"\}\]\}/);
});

test("Legacy navigation, progression, and discard follow membership state",async()=>{
  const {readFile}=await import("node:fs/promises");
  const workspace=await readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(workspace,/LegacySheetField[^>]+onOpen=\{\(\)=>setSheetTab\("legacy"\)\}/);
  assert.match(workspace,/hidden:!legacyState\?\.joined/);
  assert.match(workspace,/legacyState\?\.joined&&<TabsTrigger value="legacy"/);
  assert.match(workspace,/state\.joined\?attainment\?\.prerequisites:definition\.prerequisites/);
  assert.match(workspace,/\(!state\.joined\|\|attainment\)&&<p className=/);
  assert.match(workspace,/!state\.joined&&<section><h3>\{tr\("Iniciação","Initiation"\)\}/);
  assert.match(workspace,/setDiscardOpen\(true\)/);
  assert.match(workspace,/delete next\.line_data\.legacy_state/);
  assert.match(workspace,/<AlertDialog open=\{discardOpen\}/);
});

test("Merit hover prerequisites follow the active locale",async()=>{
  const {readFile}=await import("node:fs/promises");
  const builder=await readFile(new URL("../app/character-builder.tsx",import.meta.url),"utf8");
  assert.match(builder,/meritTooltip\(definition,locale\)/);
  assert.match(builder,/locale==="pt-BR"\?"Pré-requisitos":"Prerequisites"/);
});
