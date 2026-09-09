import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const merits=await vite.ssrLoadModule("/lib/merits.ts");
const orders=await vite.ssrLoadModule("/lib/mage-orders.ts");
const mageCatalog=merits.getMeritsForLine("MtA");
const merit=(name)=>mageCatalog.find(item=>item.name===name);
const base={gameLine:"MtA",attributes:{},skills:{},arcana:{},gnosis:1,path:"Acanthus",order:"Nameless",merits:[]};

test("Mage catalog uses splat-specific records and leaves deferred merits out",()=>{
 assert.equal(mageCatalog.filter(item=>item.line==="MtA").length,58);
 assert.equal(merit("Mystery Cult Influence").sourceId,"mta-2ed");
 for(const name of ["Masque","Profane Tool","Egregore","Prelacy","Protective Name"]) assert.equal(merit(name),undefined,name);
});
test("Shadow Self applies Shadow Name 3 and Mind 1",()=>{
 const shadow=merit("Shadow Self"),context={...base,arcana:{Mind:1},merits:[{name:"Shadow Name",dots:3}]};
 assert.equal(merits.meritPrerequisitesMet(shadow,context),true);
 assert.equal(merits.meritPrerequisitesMet(shadow,{...context,arcana:{Mind:0}}),false);
 assert.equal(merits.meritPrerequisitesMet(shadow,{...context,merits:[{name:"Shadow Name",dots:2}]}),false);
});
test("Mage requirements use Path and specific Status domains",()=>{
 assert.equal(merits.meritPrerequisitesMet(merit("Fire Keeper"),{...base,path:"Obrimos"}),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Fire Keeper"),{...base,path:"Moros"}),false);
 const adamant=merit("Adamant Hand"),arrow={...base,order:"Adamantine Arrow",skills:{Athletics:3},merits:[{name:"Awakened Status",dots:1,configuration:{domain:"Adamantine Arrow"}}]};
 assert.equal(merits.meritPrerequisitesMet(adamant,arrow),true);
 assert.equal(merits.meritPrerequisitesMet(adamant,{...arrow,merits:[{name:"Awakened Status",dots:1,configuration:{domain:"Silver Ladder"}}]}),false);
});
test("Occultation and Fame exclude each other in either purchase order",()=>{
 assert.equal(merits.meritPrerequisitesMet(merit("Occultation"),{...base,merits:[{name:"Fame",dots:1}]}),false);
 assert.equal(merits.meritPrerequisitesMet(merit("Fame"),{...base,merits:[{name:"Occultation",dots:1}]}),false);
});
test("Infamous Mentor links a Mentor instance of equal rating",()=>{
 const infamous=merit("Infamous Mentor"),context={...base,merits:[{instanceId:"mentor-a",name:"Mentor",dots:3}]};
 assert.deepEqual(merits.meritSelectionProblems(infamous,{dots:3,configuration:{mentorId:"mentor-a"}},context),[]);
 assert.ok(merits.meritSelectionProblems(infamous,{dots:4,configuration:{mentorId:"mentor-a"}},context).length>0);
 assert.ok(merits.meritSelectionProblems(infamous,{dots:3,configuration:{mentorId:"missing"}},context).length>0);
});
test("published Orders and unbounded Mage ratings are represented",()=>{
 assert.equal(orders.hasPublishedMageOrder("Silver Ladder"),true);
 assert.equal(orders.hasPublishedMageOrder("Nameless"),false);
 assert.equal(orders.hasPublishedMageOrder("My Custom Order"),false);
 assert.deepEqual(merits.meritRatingsFor(merit("Artifact"),7),[3,4,5,6,7]);
});
