import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());

test("the seven missing source Contracts are now catalogued",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {CONTRACT_TEXT_EN}=await vite.ssrLoadModule("/lib/contracts-en.ts");
  const names=[
    "Frail as the Dying Word","Fake It ‘Til You Make It","Straight On ‘Til Morning",
    "Star Light, Star Bright","Draw Likeness","Distill the Hidden","Wyrd Debt",
  ];
  for(const name of names){
    const contract=CONTRACTS.find(item=>item.originalName===name);
    assert.ok(contract,name);
    assert.ok(contract.description,`${name}: Portuguese mechanics`);
    assert.ok(contract.loophole,`${name}: Loophole`);
    assert.ok(CONTRACT_TEXT_EN[contract.id]?.description,`${name}: English mechanics`);
  }
});

test("automatic Contracts remain effects even when other mechanics mention rolls",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  for(const name of ["Straight On ‘Til Morning","Star Light, Star Bright","Distill the Hidden","Exchange of Gilded Contracts","Grand Revel of the Harvest"]){
    const contract=CONTRACTS.find(item=>item.originalName===name);
    assert.equal(contractHasInvocationRoll(contract),false,name);
  }
  const wyrdDebt=CONTRACTS.find(item=>item.originalName==="Wyrd Debt");
  assert.ok(wyrdDebt.dicePool && wyrdDebt.dicePool!=="Nenhuma");
  assert.equal(contractHasInvocationRoll(wyrdDebt),false,"Wyrd Debt is the source's explicit Effect-only exception");
  const fakeIt=CONTRACTS.find(item=>item.originalName==="Fake It ‘Til You Make It");
  assert.equal(contractHasInvocationRoll(fakeIt),true,"Fake It ‘Til You Make It has an invocation roll");
});

test("the first Kith & Kin rolled block has all four outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const names=[
    "Sleep’s Sweet Embrace","Curse’s Cure","Closing Death’s Door","Feast of Plenty",
    "Still Waters Run Deep","Poison the Well","Shared Cup","Book of Black and Red",
    "Beggar Knight","Grease the Wheels","Golden Promise",
    "Thirty Pieces","Jealous Vengeance","Litany of Rivals","Unmask the Dark Horse",
    "Tempter’s Quest","Curse of Hidden Strings","Cynosure","Retrograde","Frozen Star",
  ];
  for(const name of names){
    const contract=CONTRACTS.find(item=>item.originalName===name);
    assert.ok(contract?.success,name);
    assert.ok(contract?.exceptionalSuccess,name);
    assert.ok(contract?.failure,name);
    assert.ok(contract?.dramaticFailure,name);
  }
});

test("all rolled Kith & Kin Contracts and Peacemaker’s Draw have four outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const targets=CONTRACTS.filter(item=>
    (item.sourceId==="ctl-kith-kin" || item.originalName==="Peacemaker’s Draw") &&
    contractHasInvocationRoll(item)===true
  );
  for(const contract of targets){
    assert.ok(contract.success,`${contract.originalName}: Success`);
    assert.ok(contract.exceptionalSuccess,`${contract.originalName}: Exceptional Success`);
    assert.ok(contract.failure,`${contract.originalName}: Failure`);
    assert.ok(contract.dramaticFailure,`${contract.originalName}: Dramatic Failure`);
  }
});

test("Oak, Ash, and Thorn preserves its Effects-only exception and completes rolled outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const payload=CONTRACTS.find(item=>item.originalName==="Autonomous Payload");
  assert.equal(contractHasInvocationRoll(payload),false);
  for(const name of ["Donning the Grand Mantle","The Widening Gyre","Upholding the Principle"]){
    const contract=CONTRACTS.find(item=>item.originalName===name);
    assert.equal(contractHasInvocationRoll(contract),true,name);
    assert.ok(contract.success,name);
    assert.ok(contract.exceptionalSuccess,name);
    assert.ok(contract.failure,name);
    assert.ok(contract.dramaticFailure,name);
  }
});

test("Book of Seemings rolled Contracts have all four outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const targets=CONTRACTS.filter(item=>item.sourceId==="h-seemings" && contractHasInvocationRoll(item)===true);
  for(const contract of targets){
    assert.ok(contract.success,`${contract.originalName}: Success`);
    assert.ok(contract.exceptionalSuccess,`${contract.originalName}: Exceptional Success`);
    assert.ok(contract.failure,`${contract.originalName}: Failure`);
    assert.ok(contract.dramaticFailure,`${contract.originalName}: Dramatic Failure`);
  }
});

test("Beyond the Hedge separates Haunted House resistance and completes rolled outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const haunted=CONTRACTS.find(item=>item.originalName==="Haunted House");
  assert.equal(contractHasInvocationRoll(haunted),false);
  const targets=CONTRACTS.filter(item=>item.sourceId==="h-beyond-hedge" && contractHasInvocationRoll(item)===true);
  for(const contract of targets){
    assert.ok(contract.success,`${contract.originalName}: Success`);
    assert.ok(contract.exceptionalSuccess,`${contract.originalName}: Exceptional Success`);
    assert.ok(contract.failure,`${contract.originalName}: Failure`);
    assert.ok(contract.dramaticFailure,`${contract.originalName}: Dramatic Failure`);
  }
});

test("every supplemental Contract with an invocation roll has all four outcomes",async()=>{
  const {CONTRACTS}=await vite.ssrLoadModule("/lib/contracts.ts");
  const {contractHasInvocationRoll}=await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const targets=CONTRACTS.filter(item=>item.sourceId!=="ctl-2ed" && contractHasInvocationRoll(item)===true);
  for(const contract of targets){
    assert.ok(contract.success,`${contract.originalName}: Success`);
    assert.ok(contract.exceptionalSuccess,`${contract.originalName}: Exceptional Success`);
    assert.ok(contract.failure,`${contract.originalName}: Failure`);
    assert.ok(contract.dramaticFailure,`${contract.originalName}: Dramatic Failure`);
  }
});
