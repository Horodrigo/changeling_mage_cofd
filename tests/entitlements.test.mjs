import assert from "node:assert/strict";
import test,{after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false}});
after(async()=>vite.close());
const {ENTITLEMENTS,normalizeEntitlementState,entitlementPrerequisitesMet}=await vite.ssrLoadModule("/lib/entitlements.ts");
const {synchronizeMeritGrants}=await vite.ssrLoadModule("/lib/merit-configurations.ts");
const {refundMeritDots}=await vite.ssrLoadModule("/lib/experience-refunds.ts");
const {refundPowerRating}=await vite.ssrLoadModule("/lib/power-progression.ts");
const {RAW_MERITS,REPEATABLE_MERITS}=await vite.ssrLoadModule("/lib/merits.ts");

const allocation=(sequence,target,blessingId)=>({id:`a${sequence}`,sequence,target,...(blessingId?{blessingId}:{})});
function sheet(){return {game_line:"CtL",attributes:{Presença:2,Manipulação:2,Compostura:2},skills:{Empatia:2,Intimidação:2,Persuasão:2,Investigação:2},specializations:[],merits:[{instanceId:"entitlement",name:"Entitlement",dots:4,configuration:{definitionId:"baron-lesser-ones"}},{name:"Hob Kin",dots:1}],line_data:{wyrd:5,entitlement:{definitionId:"baron-lesser-ones",accepted:true,touchstone:{name:"Ana",status:"active"},allocations:[allocation(0,"token"),allocation(1,"blessing","inherited-expertise"),allocation(2,"blessing","hobgoblin-allies"),allocation(3,"token"),allocation(4,"blessing","hostile-oath")],choices:{"inherited-expertise-skill":"Empatia","inherited-expertise-name":"Diplomacy","hobgoblin-allies":"Briarwolves"}}}};}

test("catálogo contém seis Entitlements oficiais, oito de Courts e treze de Seemings",()=>{
  assert.equal(ENTITLEMENTS.length,27);
  assert.equal(ENTITLEMENTS.filter((item)=>item.sourceId==="h-courts").length,8);
  assert.equal(ENTITLEMENTS.filter((item)=>item.sourceId==="h-seemings").length,13);
  assert.ok(ENTITLEMENTS.some((item)=>item.name==="Companion of the Resigned"&&item.page===31));
  const merit=RAW_MERITS.find((item)=>item.name==="Entitlement");
  assert.deepEqual(merit?.ratings,[4]);assert.equal(merit?.source,"Oak, Ash, and Thorn");assert.equal(REPEATABLE_MERITS.has("Entitlement"),false);
  assert.ok(ENTITLEMENTS.every((item)=>item.blessings.length===5&&item.token.catch&&item.token.drawback&&item.touchstone&&item.curse&&item.beat));
});

test("reduzir Fado remove a alocação mais nova",()=>{
  const current=sheet();current.line_data.creation_wyrd=1;
  current.line_data=refundPowerRating(current,"wyrd");synchronizeMeritGrants(current);
  const reduced=current.line_data.entitlement;
  assert.equal(current.line_data.wyrd,4);assert.deepEqual(reduced.allocations.map((item)=>item.sequence),[0,1,2,3]);
  assert.equal(reduced.allocations.some((item)=>item.blessingId==="hostile-oath"),false);assert.equal(reduced.token.rating,2);
});

test("benefícios alocados são derivados e desaparecem com o estado do Título",()=>{
  const current=synchronizeMeritGrants(sheet());
  assert.ok(current.specializations.some((item)=>item.grantedBy==="Entitlement:baron-lesser-ones"&&item.name==="Diplomacy"));
  assert.ok(current.merits.some((item)=>item.name==="Allies"&&item.dots===3&&item.grantedBy==="Entitlement:baron-lesser-ones"));
  refundMeritDots(current,"Entitlement",4,"entitlement");
  synchronizeMeritGrants(current);
  assert.equal(current.line_data.entitlement,undefined);
  assert.equal(current.merits.some((item)=>item.grantedBy?.startsWith("Entitlement:")),false);
  assert.equal(current.specializations.some((item)=>item.grantedBy?.startsWith("Entitlement:")),false);
});

test("um Título apenas visualizado não concede benefícios antes de Accept Entitlement",()=>{
  const current=sheet();current.line_data.entitlement.accepted=false;
  synchronizeMeritGrants(current);
  assert.equal(current.merits.some((item)=>item.grantedBy?.startsWith("Entitlement:")),false);
  assert.equal(current.specializations.some((item)=>item.grantedBy?.startsWith("Entitlement:")),false);
});

test("benefícios únicos concedem Méritos estruturados e respeitam suspensão",()=>{
  const master=sheet();master.merits=[{name:"Entitlement",dots:4,configuration:{definitionId:"master-of-keys"}}];
  master.line_data.entitlement={definitionId:"master-of-keys",accepted:true,touchstone:{name:"Jo",status:"active"},allocations:[allocation(0,"blessing","hidden-library")],choices:{"hidden-library":"Investigação"}};
  synchronizeMeritGrants(master);
  assert.ok(master.merits.some((item)=>item.name==="Safe Place"&&item.dots===1&&item.grantedBy==="Entitlement:master-of-keys"));
  assert.ok(master.merits.some((item)=>item.name==="Library"&&item.dots===2&&item.configuration.subject==="Investigação"));
  master.line_data.entitlement.suspendedBenefitIds=["hidden-library"];
  synchronizeMeritGrants(master);
  assert.equal(master.merits.some((item)=>item.grantedBy==="Entitlement:master-of-keys"),false);
});

test("estado de Entitlement sobrevive à exportação e importação JSON",()=>{
  const before=normalizeEntitlementState(sheet().line_data.entitlement,5);
  const after=normalizeEntitlementState(JSON.parse(JSON.stringify(before)),5);
  assert.deepEqual(after,before);
});

test("pré-requisitos específicos consideram título e papel",()=>{
  const current=sheet(),baron=ENTITLEMENTS[0],dauphines=ENTITLEMENTS[1];
  assert.equal(entitlementPrerequisitesMet(baron,normalizeEntitlementState(current.line_data.entitlement,5),current),true);
  current.line_data.wyrd=3;
  assert.equal(entitlementPrerequisitesMet(dauphines,normalizeEntitlementState({definitionId:dauphines.id,roleId:"sophomore"},3),current),true);
  current.attributes.Presença=1;
  assert.equal(entitlementPrerequisitesMet(dauphines,normalizeEntitlementState({definitionId:dauphines.id,roleId:"sophomore"},3),current),false);
  const master=ENTITLEMENTS[2];
  current.attributes.Presença=2;
  assert.equal(entitlementPrerequisitesMet(master,normalizeEntitlementState({definitionId:master.id},3),current),true,"o requisito narrativo de um Mérito ligado a segredos não deve ser imposto pelo aplicativo");
  const dancer=ENTITLEMENTS[3],fisher=ENTITLEMENTS[4],rider=ENTITLEMENTS[5];
  current.skills={...current.skills,Socialização:2,Atletismo:3,Expressão:2,Computação:3};current.attributes.Perseverança=3;
  assert.equal(entitlementPrerequisitesMet(dancer,normalizeEntitlementState({definitionId:dancer.id},3),current),true,"a especialidade de movimento é deliberadamente adjudicada pelo Narrador");
  assert.equal(entitlementPrerequisitesMet(fisher,normalizeEntitlementState({definitionId:fisher.id},3),current),true);
  assert.equal(entitlementPrerequisitesMet(rider,normalizeEntitlementState({definitionId:rider.id},3),current),true);
});

test("Blessings dos títulos de The Hedge concedem apenas Méritos automáticos estruturados",()=>{
  const current=sheet();current.attributes.Perseverança=3;current.skills={...current.skills,Socialização:2,Atletismo:3,Expressão:2};
  current.merits=[{name:"Entitlement",dots:4,configuration:{definitionId:"thorn-dancer"}}];
  current.line_data.entitlement={definitionId:"thorn-dancer",accepted:true,touchstone:{name:"First Song",status:"active"},allocations:[allocation(0,"blessing","hedge-native-merits")]};
  synchronizeMeritGrants(current);
  assert.ok(current.merits.some((item)=>item.name==="Arcadian Metabolism"&&item.grantedBy==="Entitlement:thorn-dancer"));
  assert.ok(current.merits.some((item)=>item.name==="Hob Kin"&&item.grantedBy==="Entitlement:thorn-dancer"));
});
