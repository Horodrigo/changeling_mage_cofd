import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
import {readWorkspaceSource} from "./workspace-source.mjs";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false}});
after(()=>vite.close());
const {CHRONOLOGUE,ELEVENTH_QUESTION,ENGINEERS_OF_THE_SYSTEM,LEGACIES,eleventhQuestionPrerequisites,legacyEntryPrerequisites,legacyAttainmentPrerequisites,normalizeLegacyState}=await vite.ssrLoadModule("/lib/legacies.ts");
const {refundMageAdvancement}=await vite.ssrLoadModule("/lib/experience-refunds.ts");
const {discardLegacyAdvancements}=await vite.ssrLoadModule("/lib/legacy-progression.ts");
const {experienceTraitDots}=await vite.ssrLoadModule("/app/character-builder.tsx");

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

test("Chronologue supports selection, localized sheet traits, and its printed progression",()=>{
  assert.equal(CHRONOLOGUE.source,"Night Horrors: Nameless and Accursed");
  assert.deepEqual(CHRONOLOGUE.attainments.map(item=>item.name),["If-Then-Else","Possibility Matrix"]);
  const initiate=mage({path:"Acanthus",order:"Orderless",arcana:{Tempo:2,Destino:1}});
  initiate.skills={Computação:2};
  assert.equal(legacyEntryPrerequisites(initiate,CHRONOLOGUE).met,true);
  initiate.skills.Computação=3;
  assert.equal(legacyAttainmentPrerequisites(initiate,CHRONOLOGUE,2),true);
});

test("Engineers of the System is the next selectable Legacy with its printed progression",()=>{
  assert.deepEqual(LEGACIES.map(item=>item.name),["The Eleventh Question","Chronologue","Engineers of the System"]);
  assert.equal(ENGINEERS_OF_THE_SYSTEM.source,"Tome of the Pentacle");
  assert.equal(ENGINEERS_OF_THE_SYSTEM.page,157);
  assert.deepEqual(ENGINEERS_OF_THE_SYSTEM.attainments.map(item=>item.name),["See the Bones and Gears","Rebuild the Living Machine","Become the Ecosystem"]);
  const engineer=mage({path:"Thyrsus",order:"Orderless",arcana:{Espaço:2}});
  engineer.skills={Investigação:2,Intimidação:2};
  assert.equal(legacyEntryPrerequisites(engineer,ENGINEERS_OF_THE_SYSTEM).met,true);
  engineer.skills.Investigação=3;
  assert.equal(legacyAttainmentPrerequisites(engineer,ENGINEERS_OF_THE_SYSTEM,2),true);
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

test("discarding a Legacy refunds only Legacy purchases and removes their history",()=>{
  const praxis={id:"perfect-timing",name:"Perfect Timing"};
  const sheet={attributes:{},skills:{},merits:[],specializations:[],line_data:{legacy_state:{definitionId:"the-eleventh-question",joined:true,attainmentRanks:[1]},praxes:[]},current_state:{mage_experience_available:2,arcane_experience_available:1,mage_experience_spent:1,arcane_experience_spent:1,arcane_experience_beats:2,mage_experience_history:[{id:"other",regular:1,arcane:0,undo:{kind:"trait",group:"skills",name:"Occult"}},{id:"legacy",regular:1,arcane:1,undo:{kind:"legacyInitiation",previousState:undefined,removedPraxis:{key:"praxes",index:0,item:praxis},creditedRegular:0,creditedArcane:0,creditedArcaneBeats:2}}]}};
  const discarded=discardLegacyAdvancements(sheet);
  assert.equal(discarded.line_data.legacy_state,undefined);
  assert.deepEqual(discarded.line_data.praxes,[praxis]);
  assert.equal(discarded.current_state.mage_experience_available,3);
  assert.equal(discarded.current_state.arcane_experience_available,2);
  assert.equal(discarded.current_state.arcane_experience_beats,0);
  assert.deepEqual(discarded.current_state.mage_experience_history.map(item=>item.id),["other"]);
});

test("character editing separates Attribute and Skill dots bought with Experience",()=>{
  const sheet={game_line:"MtA",current_state:{mage_experience_history:[
    {undo:{kind:"trait",group:"attributes",name:"Strength"}},
    {undo:{kind:"trait",group:"attributes",name:"Strength"}},
    {undo:{kind:"trait",group:"skills",name:"Occult"}},
    {undo:{kind:"arcana",name:"Time"}},
  ]}};
  assert.deepEqual(experienceTraitDots(sheet,"attributes"),{Strength:2});
  assert.deepEqual(experienceTraitDots(sheet,"skills"),{Occult:1});
});

test("Mage sheet exposes Join/Join Create and places Legacy before Combat",async()=>{
  const {readFile}=await import("node:fs/promises");
  const workspace=await readWorkspaceSource();
  const legacy=await readFile(new URL("../app/workspace/legacy-page.tsx",import.meta.url),"utf8");
  assert.match(workspace,/gnosis >= 3 \? tr\("Join\/Create"/);
  assert.match(workspace,/<TabsTrigger value="magia"[^]*<TabsTrigger value="legacy"[^]*<TabsTrigger value="combate"/);
  assert.match(legacy,/Estas informações não são controladas automaticamente pela ficha/);
  assert.match(legacy,/tr\("Pagamento","Payment"\)[\s\S]*options=\{method==="tutelage"\?\[\{value:"regular",label:"1 Experience"\},\{value:"arcane",label:"1 Arcane Experience"\}\]:\[\{value:"arcane",label:"1 Arcane Experience"\}\]\}/);
});

test("Legacy navigation, progression, and discard follow membership state",async()=>{
  const {readFile}=await import("node:fs/promises");
  const workspace=await readWorkspaceSource();
  const legacy=await readFile(new URL("../app/workspace/legacy-page.tsx",import.meta.url),"utf8");
  assert.match(workspace,/LegacySheetField[^>]+onOpen=\{\(\)=>setSheetTab\("legacy"\)\}/);
  assert.match(workspace,/hidden:!legacyState\?\.joined/);
  assert.match(workspace,/legacyState\?\.joined&&<TabsTrigger value="legacy"/);
  assert.match(legacy,/state\.joined\?attainment\?\.prerequisites:definition\.prerequisites/);
  assert.match(legacy,/\(!state\.joined\|\|attainment\)&&<p className=/);
  assert.match(legacy,/!state\.joined&&<section><h3>\{tr\("Iniciação","Initiation"\)\}/);
  assert.match(legacy,/setDiscardOpen\(true\)/);
  assert.match(legacy,/discardLegacyAdvancements\(character\)/);
  assert.match(legacy,/<AlertDialog open=\{discardOpen\}/);
});

test("Merit hover prerequisites follow the active locale",async()=>{
  const {readFile}=await import("node:fs/promises");
  const builder=await readFile(new URL("../app/character-builder.tsx",import.meta.url),"utf8");
  assert.match(builder,/meritTooltip\(definition,locale\)/);
  assert.match(builder,/locale==="pt-BR"\?"Pré-requisitos":"Prerequisites"/);
});

test("Mage Main exposes Wisdom and Gnosis-limited Inured Spells",async()=>{
  const {readFile}=await import("node:fs/promises");
  const sheet=await readFile(new URL("../app/workspace/character-paper.tsx",import.meta.url),"utf8");
  assert.match(sheet,/inuredSpells\.length<gnosis/);
  assert.match(sheet,/meetsArcanaRequirements\(spell\.requirements,arcana\)/);
  assert.match(sheet,/base two-die Paradox risk/);
  assert.match(sheet,/compact-remove-action/);
  assert.match(sheet,/DotValue value=\{wisdom\} max=\{10\} singleRow/);
  assert.match(sheet,/Megalomaniacal/);
  assert.match(sheet,/Rampant/);
  assert.match(sheet,/arcanaPresentation\(name\)/);
});
