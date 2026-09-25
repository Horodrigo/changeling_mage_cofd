import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
import {readFileSync} from "node:fs";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,resolve:{alias:{"@":root}},server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const merits=await vite.ssrLoadModule("/lib/merits.ts");
const mageMerits=await vite.ssrLoadModule("/game-lines/mage/merits.ts");
const orders=await vite.ssrLoadModule("/game-lines/mage/orders.ts");
const factions=JSON.parse(readFileSync(new URL("../public/data/mage/factions.json",import.meta.url),"utf8"));
const rawMageCatalog=[
 ...["core","mage"].flatMap((name)=>JSON.parse(readFileSync(new URL(`../public/data/core/merits/${name}.json`,import.meta.url),"utf8"))),
 ...JSON.parse(readFileSync(new URL("../public/data/mage/merits-supplements.json",import.meta.url),"utf8")),
];
const mageCatalog=[...rawMageCatalog.reduce((selected,item)=>{const current=selected.get(item.name);if(!current||item.priority>current.priority)selected.set(item.name,item);return selected;},new Map()).values()];
const merit=(name)=>mageCatalog.find(item=>item.name===name);
const base={gameLine:"MtA",archetypes:["awakened"],meritCatalog:mageCatalog,attributes:{},skills:{},arcana:{},gnosis:1,path:"Acanthus",order:"Nameless",merits:[]};

test("Mage catalog includes the nine audited supplemental Merits",()=>{
 assert.equal(mageCatalog.filter(item=>item.line==="MtA").length,71);
 assert.equal(merit("Mystery Cult Influence").sourceId,"mta-2ed");
 for(const name of ["Egregore","Masque","Prelacy","Profane Tool","Faction Member","Svikiro","Svikiro Channel","Svikiro Ridden","Svikiro Nganga"])
  assert.ok(merit(name),name);
 assert.equal(merit("Protective Name"),undefined);
 assert.deepEqual(merit("Svikiro Channel").ratings,[1,3]);
 assert.deepEqual(merit("Svikiro Ridden").ratings,[1,3]);
 assert.equal(merit("Egregore").levels.length,5);
 assert.deepEqual(merit("Masque").ratings,[2]);
 assert.equal(merit("Masque").repeatable,true);
 assert.equal(merit("Masque (Style)").levels.length,5);
 assert.equal(merit("Masque (Style)").repeatable,undefined);
 assert.equal(merit("Prelacy").levels.length,4);
});
test("Mage Order Style and Svikiro prerequisites use canonical stored traits",()=>{
 const status=(domain,dots)=>({name:"Awakened Status",dots,configuration:{domain}});
 assert.equal(merits.meritPrerequisitesMet(merit("Egregore"),{...base,merits:[status("Mysterium",1)]}),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Egregore"),{...base,merits:[status("Silver Ladder",5)]}),false);
 assert.equal(merits.meritPrerequisitesMet(merit("Masque (Style)"),{...base,merits:[status("Guardians of the Veil",1)]}),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Masque"),{...base,merits:[{name:"Masque (Style)",dots:1}]}),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Masque"),base),false);
 assert.equal(merits.meritPrerequisitesMet(merit("Prelacy"),{...base,merits:[status("Seers of the Throne",3)]}),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Prelacy"),{...base,merits:[status("Seers of the Throne",2)]}),false);
 assert.equal(merits.meritPrerequisitesMet(merit("Profane Tool"),{...base,merits:[{name:"Prelacy",dots:2}]}),true);
 const medium={...base,attributes:{Resolve:3,Composure:3}};
 assert.equal(merits.meritPrerequisitesMet(merit("Svikiro"),medium),true);
 assert.equal(merits.meritPrerequisitesMet(merit("Svikiro"),{...medium,attributes:{Resolve:2,Composure:3}}),false);
 assert.equal(merits.meritPrerequisitesMet(merit("Svikiro Nganga"),{...base,merits:[{name:"Svikiro",dots:3}]}),true);
});
test("Mage location merits preserve sources, ratings, and linked locations",()=>{
 const locations=[
  ["Demesne",[3],104],
  ["Hallow",[1,2,3,4,5],101],
  ["Sanctum",[1,2,3,4,5],104],
 ];
 for(const [name,ratings,page] of locations){
  const item=merit(name);
  assert.equal(item.source,"Mage the Awakening",name);
  assert.equal(item.category,"Mage Locations",name);
  assert.deepEqual(item.ratings,ratings,name);
  assert.equal(item.page,page,name);
 }
 const safePlace={instanceId:"safe-a",name:"Safe Place",dots:3};
 assert.deepEqual(merits.meritSelectionProblems(merit("Sanctum"),{dots:3,configuration:{safePlaceId:"safe-a"}},{...base,merits:[safePlace]}),[]);
 assert.ok(merits.meritSelectionProblems(merit("Sanctum"),{dots:4,configuration:{safePlaceId:"safe-a"}},{...base,merits:[safePlace]}).length>0);
 const sanctum={instanceId:"sanctum-a",name:"Sanctum",dots:1};
 assert.deepEqual(merits.meritSelectionProblems(merit("Demesne"),{dots:3,configuration:{sanctumId:"sanctum-a"}},{...base,merits:[sanctum]}),[]);
 assert.ok(merits.meritSelectionProblems(merit("Demesne"),{dots:3,configuration:{sanctumId:"missing"}},{...base,merits:[sanctum]}).length>0);
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
 assert.equal(orders.MAGE_ORDERS.length,17);
 assert.equal(orders.MAGE_ORDERS.filter(item=>item.creationBenefits).length,6);
 assert.equal(orders.hasStandardCreationOrderBenefits("Company of the Codex"),false);
 assert.equal(orders.hasPublishedMageOrder("Tremere"),false);
 assert.equal(orders.hasPublishedMageOrder("Nameless"),false);
 assert.equal(orders.hasPublishedMageOrder("My Custom Order"),false);
 assert.equal(orders.MAGE_AFFILIATIONS.length,12);
 assert.equal(Object.isFrozen(orders.MAGE_ORDERS[0].roteSkills),true);
 assert.equal(Object.isFrozen(orders.MAGE_AFFILIATIONS),true);
 assert.equal(orders.mageAffiliationsFor("Silver Ladder").length,0);
 assert.equal(orders.mageAffiliationsFor("Seers of the Throne").length,12);
 assert.deepEqual(orders.findMageAffiliation("hegemony").roteSkills,["Politics","Persuasion","Empathy"]);
 assert.deepEqual(orders.findMageAffiliation("geryon").roteSkills,["Larceny","Socialize","Subterfuge"]);
 assert.deepEqual(new Set(orders.MAGE_AFFILIATIONS.flatMap(item=>[item.patronExarch,...(item.additionalPatronExarchs??[])])),new Set(["Eye","Father","General","Unity","Chancellor","Raptor","Prophet","Nemesis","Ruin"]));
 assert.deepEqual(merits.meritRatingsFor(merit("Artifact"),7),[3,4,5,6,7]);
});
test("Prelacy follows the selected Ministry patron",()=>{
 const context={...base,order:"Seers of the Throne",merits:[{name:"Awakened Status",dots:3,configuration:{domain:"Seers of the Throne"}}]};
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(merit("Prelacy"),{dots:3,configuration:{exarch:"Eye"}},context,factions,"panopticon"),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(merit("Prelacy"),{dots:3,configuration:{exarch:"General"}},context,factions,"panopticon").some(message=>message.includes("Panopticon")));
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(merit("Prelacy"),{dots:3,configuration:{exarch:"Ruin"}},context,factions,"kyrian"),[]);
});
test("Tome factions are complete and Faction Member validates Order-specific choices",()=>{
 assert.equal(factions.length,44);
 assert.equal(new Set(factions.map(item=>item.id)).size,44);
 assert.deepEqual(Object.fromEntries(["Adamantine Arrow","Guardians of the Veil","Mysterium","Silver Ladder","Free Council"].map(order=>[order,factions.filter(item=>item.orders.length===1&&item.orders[0]===order).length])),{
  "Adamantine Arrow":7,"Guardians of the Veil":7,Mysterium:7,"Silver Ladder":7,"Free Council":8,
 });
 assert.equal(factions.filter(item=>item.orders.length>1).length,8);
 for(const faction of factions){
  assert.ok(faction.toolYantra,faction.name);
  assert.ok(faction.roteSkills.length>=1,faction.name);
  assert.equal(faction.source,"Tome of the Pentacle",faction.name);
 }
 const factionMember=merit("Faction Member");
 const status=(domain,dots)=>({name:"Awakened Status",dots,configuration:{domain}});
 const context={...base,order:"Mysterium",merits:[status("Mysterium",2)]};
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(factionMember,{dots:3,configuration:{factionId:"mta-tome:archivists",roteSkill:"Politics"}},context,factions),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:3,configuration:{factionId:"mta-tome:archivists",roteSkill:"Crafts"}},context,factions).length>0);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:2,configuration:{factionId:"mta-tome:archivists"}},{...context,order:"Silver Ladder",merits:[status("Silver Ladder",2)]},factions).length>0);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:2,configuration:{factionId:"mta-tome:archivists"}},{...context,merits:[status("Mysterium",1)]},factions).length>0);
});
