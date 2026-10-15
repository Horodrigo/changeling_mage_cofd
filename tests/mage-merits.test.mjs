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
const factions=JSON.parse(readFileSync(new URL("../public/game-lines/mage/data/factions.json",import.meta.url),"utf8"));
const rawMageCatalog=[
 ...["shared/data/merits.json","game-lines/mage/data/merits.json"].flatMap(path=>JSON.parse(readFileSync(new URL(`../public/${path}`,import.meta.url),"utf8"))),
 ...JSON.parse(readFileSync(new URL("../public/game-lines/mage/data/merits-supplements.json",import.meta.url),"utf8")),
];
const mageCatalog=[...rawMageCatalog.reduce((selected,item)=>{const current=selected.get(item.name);if(!current||item.priority>current.priority)selected.set(item.name,item);return selected;},new Map()).values()];
const merit=(name)=>mageCatalog.find(item=>item.name===name);
const base={...mageMerits.MAGE_STATUS_REQUIREMENTS,gameLine:"MtA",archetypes:["awakened"],meritCatalog:mageCatalog,attributes:{},skills:{},arcana:{},gnosis:1,path:"Acanthus",order:"Nameless",merits:[]};

test("Mage Merit presentation switches EN/PT/EN without changing canonical requirements",async()=>{
 const {meritPresentation}=await vite.ssrLoadModule("/lib/merit-presentation.ts");
 for(const name of ["Adamant Hand","Artifact","Astral Adept","Astral Intruder","Awakened Status","Between the Ticks","Broad Dedication","Cabal Theme","Cognoscente","Daimonomikon","Demesne","Destiny","Dominant Soul","Dream","Echo Chamber","Egregore","Enhanced Item","Enriched Item","Epiphany Stone","Faction Member","Familiar","Fast Spells","Fire Keeper","Fluent High Speech","Grimoire","Hallow","Hidden High Speech","High Speech","Imbued Ally","Imbued Item","Imposing Nimbus","Infamous Mentor","Inheritance","Keen Periphery","Legacy Pedagogue","Lex Magica","Mana Battery","Mana Sensitivity","Masque (Style)","Masque","Mystery Cult Influence","Occultation","Order Archive","Perfected Item","Persistent Nimbus","Piercing Glance","Potent Nimbus","Potent Resonance","Potent Soul","Prelacy","Profane Tool","Profligate Dedication","Sanctum","Sea's Hunger","Second-Person High Speech","Shadow Name","Shadow Self","Sky's Whispers","Soul Dealer","Soul Stone","Spirit Warden","Stalwart Soul","Supernal Taxonomy","Supernal Watcher","Techné","Trail Walker"]){
  const entry=merit(name);
  const canonical={id:entry.id,name:entry.name,prerequisites:entry.prerequisites,descriptionEn:entry.descriptionEn};
  assert.equal(meritPresentation(entry,"en-US",mageCatalog).name,entry.nameQualifier?.["en-US"]?`${name}(${entry.nameQualifier["en-US"]})`:name);
  assert.equal(meritPresentation(entry,"pt-BR",mageCatalog).name,entry.nameQualifier?.["pt-BR"]?`${entry.presentationPt.name}(${entry.nameQualifier["pt-BR"]})`:entry.presentationPt.name);
  assert.equal(meritPresentation(entry,"pt-BR",mageCatalog).prerequisites,entry.presentationPt.prerequisites);
  assert.equal(meritPresentation(entry,"en-US",mageCatalog).name,entry.nameQualifier?.["en-US"]?`${name}(${entry.nameQualifier["en-US"]})`:name);
  assert.deepEqual({id:entry.id,name:entry.name,prerequisites:entry.prerequisites,descriptionEn:entry.descriptionEn},canonical);
 }
 assert.match(meritPresentation(merit("Adamant Hand"),"pt-BR",mageCatalog).prerequisites,/Armas Brancas/);
 assert.match(meritPresentation(merit("Cabal Theme"),"pt-BR",mageCatalog).description,/Nome das Sombras/);
 assert.match(meritPresentation(merit("Destiny"),"pt-BR",mageCatalog).description,/A cada sessão/);
 assert.match(meritPresentation(merit("Enhanced Item"),"pt-BR",mageCatalog).description,/Item Imbuído/);
 assert.equal(meritPresentation(merit("Hallow"),"pt-BR",mageCatalog).name,"Nascente de Mana");
 assert.equal(meritPresentation(merit("Awakened Status"),"pt-BR",mageCatalog).name,"Status dos Despertos");
 assert.equal(meritPresentation(merit("Daimonomikon"),"pt-BR",mageCatalog).levels[4].name,"Mestre/Holístico");
 assert.equal(meritPresentation(merit("Daimonomikon"),"en-US",mageCatalog).levels[4].name,"Master/Holistic");
 assert.match(meritPresentation(merit("Astral Intruder"),"pt-BR",mageCatalog).description,/Mesmo se falhar.*penalidade igual à Perseverança/);
 assert.match(meritPresentation(merit("Dominant Soul"),"pt-BR",mageCatalog).description,/demais requisitos do Aperfeiçoamento/);
 assert.match(meritPresentation(merit("Echo Chamber"),"pt-BR",mageCatalog).description,/três sucessos em vez de cinco.*Uma vez por história/);
 assert.match(meritPresentation(merit("Epiphany Stone"),"pt-BR",mageCatalog).description,/Gnose \+ Perseverança.*Com sucesso, o efeito termina/);
 assert.equal(merit("Fluent High Speech").prerequisites,"Awakened; Presence ••••, Expression •••");
 assert.equal(merit("Hidden High Speech").prerequisites,"Awakened; Manipulation •••, Expression •••");
 assert.match(meritPresentation(merit("Fluent High Speech"),"pt-BR",mageCatalog).description,/reduza em dois os sucessos necessários/);
 assert.match(meritPresentation(merit("Imbued Ally"),"pt-BR",mageCatalog).description,/Essência.*pelo menos 1 Mana.*Arcano do feitiço \+ Gnose/);
 assert.match(meritPresentation(merit("Imposing Nimbus"),"pt-BR",mageCatalog).description,/Nimbus Imediato.*Condição Persistente.*teste disputado/);
 assert.match(meritPresentation(merit("Infamous Mentor"),"pt-BR",mageCatalog).description,/Status.*dobro dos pontos.*não são concessões permanentes/);
 assert.match(meritPresentation(merit("Inheritance"),"pt-BR",mageCatalog).description,/\+1 dado.*\+2 dados/);
 assert.equal(meritPresentation(merit("Mystery Cult Influence"),"pt-BR",mageCatalog).levels[4].name,"Topo da Pirâmide");
 assert.match(meritPresentation(merit("Mystery Cult Influence"),"pt-BR",mageCatalog).description,/Iniciação em Culto dos Mistérios/);
 assert.match(meritPresentation(merit("Potent Resonance"),"pt-BR",mageCatalog).description,/Nimbus Imediato.*Tilt/);
 assert.match(meritPresentation(merit("Shadow Name"),"pt-BR",mageCatalog).description,/Alcance Simpático.*Simpatia Temporal/);
 assert.match(meritPresentation(merit("Techné"),"pt-BR",mageCatalog).description,/8 de novo.*áreas diferentes/);
 assert.match(meritPresentation(merit("Keen Periphery"),"pt-BR",mageCatalog).description,/Visão Mágica Periférica.*Arcano/);
 assert.match(meritPresentation(merit("Piercing Glance"),"pt-BR",mageCatalog).description,/Choque de Vontades.*−2.*não sofre penalidade/);
 assert.match(meritPresentation(merit("Second-Person High Speech"),"pt-BR",mageCatalog).description,/\+2 dados.*\+1 dado.*não se acumula/);
 assert.match(meritPresentation(merit("Supernal Taxonomy"),"pt-BR",mageCatalog).description,/Visão Mágica Ativa.*sem precisar examiná-lo de novo/);
 assert.match(meritPresentation(merit("Potent Soul"),"pt-BR",mageCatalog).description,/9 de novo.*Porta adicional/);
 assert.match(meritPresentation(merit("Soul Dealer"),"pt-BR",mageCatalog).description,/Uma vez por história.*−1.*Disponibilidade.*Notoriedade/);
 assert.match(meritPresentation(merit("Soul Dealer"),"en-US",mageCatalog).description,/Once per story.*−1.*Availability.*Notoriety/);
 assert.match(meritPresentation(merit("Soul Stone"),"pt-BR",mageCatalog).description,/\+2 ou \+3 dados.*três serviços.*Domínio/);
 assert.equal(meritPresentation(merit("Demesne"),"pt-BR",mageCatalog).name,"Domínio");
 assert.equal(meritPresentation(merit("Sanctum"),"pt-BR",mageCatalog).name,"Santuário");
 assert.match(meritPresentation(merit("Demesne"),"pt-BR",mageCatalog).description,/\+2 dados.*Adormecido.*Quiescência/);
 assert.match(meritPresentation(merit("Sanctum"),"pt-BR",mageCatalog).description,/Gnose efetiva.*feitiços excedentes.*Domínio/);
 assert.equal(meritPresentation(merit("Egregore"),"pt-BR",mageCatalog).levels[0].name,"Mysteriorum Arche");
 assert.match(meritPresentation(merit("Egregore"),"pt-BR",mageCatalog).levels[2].description,/Uma vez por sessão.*Informado/);
 assert.match(meritPresentation(merit("Faction Member"),"pt-BR",mageCatalog).description,/\+2.*−2.*cinco/);
 assert.equal(meritPresentation(merit("Faction Member"),"en-US",mageCatalog).prerequisites,"Order Status ••");
 assert.equal(meritPresentation(merit("Faction Member"),"pt-BR",mageCatalog).levels[2].name,"Perícia de Rotina da Facção");
 assert.match(meritPresentation(merit("Profane Tool"),"pt-BR",mageCatalog).description,/Cetros.*Anéis.*várias vezes/);
 assert.match(meritPresentation(merit("Stalwart Soul"),"pt-BR",mageCatalog).description,/dobro dos pontos.*Resistência/);
 assert.match(meritPresentation(merit("Sky's Whispers"),"pt-BR",mageCatalog).description,/24 horas.*\+3 dados.*Raciocínio/);
 assert.match(meritPresentation(merit("Trail Walker"),"pt-BR",mageCatalog).description,/todos que viajam com você.*dobro da velocidade/);
 assert.match(meritPresentation(merit("Spirit Warden"),"pt-BR",mageCatalog).description,/primeira vez.*em uma cena/);
 assert.match(meritPresentation(merit("Sea's Hunger"),"pt-BR",mageCatalog).description,/objeto inanimado.*taxa natural de cura dobra/);
 assert.match(meritPresentation(merit("Fire Keeper"),"pt-BR",mageCatalog).description,/ao seu alcance visual.*brasas/);
 assert.match(meritPresentation(merit("Mana Battery"),"pt-BR",mageCatalog).description,/dois pontos de Mana por ponto.*Canalizar Mana/);
 assert.match(meritPresentation(merit("Perfected Item"),"pt-BR",mageCatalog).description,/Duração permanente.*Bateria de Mana.*Item Imbuído/);
 assert.match(meritPresentation(merit("Legacy Pedagogue"),"pt-BR",mageCatalog).description,/primeiro Aperfeiçoamento.*Ato Arcano.*Simpatia Conectada/);
 assert.match(meritPresentation(merit("Persistent Nimbus"),"pt-BR",mageCatalog).description,/Nimbus de Longo Prazo.*um dia.*Nimbus Imediato.*um turno.*Nimbus de Assinatura.*uma semana/);
 assert.match(meritPresentation(merit("Shadow Self"),"pt-BR",mageCatalog).description,/−2 dados.*viagem astral.*Goetia.*Temenos/);
 assert.equal(merit("Shadow Self").prerequisites,"Awakened; Shadow Name •••; Mind •");
 assert.match(meritPresentation(merit("Order Archive"),"pt-BR",mageCatalog).description,/Arcana protegidos igual aos pontos.*Recursos do Caucus.*Membros da mesma Ordem/);
 assert.match(meritPresentation(merit("Profligate Dedication"),"pt-BR",mageCatalog).description,/três ferramentas.*duas.*nenhuma/);
 assert.match(meritPresentation(merit("Supernal Watcher"),"pt-BR",mageCatalog).description,/Posto 1.*Posto 2.*cinco sucessos.*1 Mana.*Yantra/);
});

test("Mage configuration validation dispatches canonical IDs, not display names or Homebrew homonyms",()=>{
 for(const name of ["Sanctum","Demesne","Infamous Mentor","Imbued Ally","Order Archive","Awakened Status","Adamant Hand","Cabal Theme","Faction Member","Prelacy","Profane Tool","Svikiro"]){
  const official={...merit(name),prerequisites:undefined,requirements:undefined};
  const mechanics = definition => mageMerits.mageMeritSelectionProblems(definition,{dots:3},base,[]).map(problem => [problem.key,problem.meritIds,problem.params?.minimum]);
  assert.deepEqual(mechanics({...official,name:"Displayed in another language"}),mechanics(official),name);
  assert.deepEqual(mageMerits.mageMeritSelectionProblems({...official,id:`homebrew:test:${official.id}`,homebrew:true},{dots:3},base,[]),[],name);
 }
});

test("Mage links use exact definition/instance IDs and fail closed on ambiguous schema-2 selections",()=>{
 const sanctum=merit("Sanctum"),safe=merit("Safe Place"),fake={...safe,id:"homebrew:fake-safe",sourceId:"homebrew:fake"};
 const selection={dots:3,configuration:{safePlaceId:"safe-a"}},owned={instanceId:"safe-a",definitionId:safe.id,name:"Saved label",dots:3};
 const valid={...base,meritCatalog:[...mageCatalog,fake],merits:[owned]};
 const linkedProblems=context=>mageMerits.mageMeritSelectionProblems(sanctum,selection,context,[]).filter(item=>item.key==="ui.meritSelectLinked");
 assert.deepEqual(linkedProblems(valid),[]);
 assert.equal(linkedProblems({...valid,merits:[{...owned,definitionId:fake.id,name:safe.name}]}).length,1);
 assert.equal(linkedProblems({...valid,merits:[{...owned,definitionId:"unavailable",name:safe.name}]}).length,1);
 assert.equal(linkedProblems({...valid,merits:[owned,{...owned}]}).length,1);
 assert.equal(linkedProblems({...valid,merits:[{...owned,definitionId:undefined,name:safe.name}]}).length,1);
 assert.deepEqual(linkedProblems({...valid,merits:[{...owned,definitionId:undefined,name:safe.name,sourceId:safe.sourceId}]}),[]);
 const mentor={...owned,definitionId:merit("Mentor").id};
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Infamous Mentor"),{...base,selectedDots:3,merits:[mentor]}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Infamous Mentor"),{...base,selectedDots:4,merits:[mentor]}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Infamous Mentor"),{...base,selectedDots:3,configuration:{mentorId:"missing"},merits:[mentor]}),false);
});

test("Mage linked Merit pickers filter by ID/rating and localized validation resolves those same IDs",async()=>{
 const {createElement}=await import("react");
 const {renderToStaticMarkup}=await import("react-dom/server");
 const {LanguageProvider}=await vite.ssrLoadModule("/lib/i18n.tsx");
 const {MeritConfigurationEditor}=await vite.ssrLoadModule("/app/builder/merit-configuration-editor.tsx");
 const {MAGE_MERIT_CONFIGURATIONS}=await vite.ssrLoadModule("/game-lines/mage/merit-configurations.ts");
 const {meritProblemMessage}=await vite.ssrLoadModule("/lib/merit-ui.ts");
 const safe={...merit("Safe Place"),translatedName:"Local Seguro"},fake={...safe,id:"homebrew:fake-safe",sourceId:"homebrew:fake",translatedName:"Falso Local"};
 const catalog=[...mageCatalog.filter(item=>item.id!==safe.id),safe,fake];
 const owned=[
  {instanceId:"valid-instance",definitionId:safe.id,name:"Label",dots:3},
  {instanceId:"wrong-definition",definitionId:fake.id,name:safe.name,dots:5},
  {instanceId:"too-low",definitionId:safe.id,name:safe.name,dots:2},
  {instanceId:"ambiguous-old",name:safe.name,dots:3},
  {instanceId:"duplicate",definitionId:safe.id,name:safe.name,dots:3},
  {instanceId:"duplicate",definitionId:safe.id,name:safe.name,dots:4},
 ];
 const markup=renderToStaticMarkup(createElement(LanguageProvider,null,createElement(MeritConfigurationEditor,{merit:{definitionId:merit("Sanctum").id,name:"Sanctum",dots:3},catalog,ownedMerits:owned,definitions:MAGE_MERIT_CONFIGURATIONS,onChange:()=>{}})));
 assert.match(markup,/value="valid-instance"/);
 for(const id of ["wrong-definition","too-low","ambiguous-old","duplicate"])assert.ok(!markup.includes(`value="${id}"`),id);
 const problem=mageMerits.mageMeritSelectionProblems(merit("Sanctum"),{dots:3}, {...base,meritCatalog:catalog},[]).find(item=>item.key==="ui.meritSelectLinked");
 assert.match(meritProblemMessage(problem,merit("Sanctum"),"pt-BR",catalog),/Local Seguro/);
 assert.match(meritProblemMessage(problem,merit("Sanctum"),"en-US",catalog),/Safe Place/);
 assert.match(meritProblemMessage(problem,merit("Sanctum"),"pt-BR",[]),/core-2ed:safe-place/);
 const shared=readFileSync(new URL("../lib/merits.ts",import.meta.url),"utf8").split("export function meritSelectionProblems")[1];
 assert.doesNotMatch(shared,/Infamous Mentor|Sanctum|Demesne|Awakened Status|Adamant Hand|Cabal Theme|mentorId|safePlaceId/);
});

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
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Egregore"),{...base,merits:[status("Mysterium",1)]}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Egregore"),{...base,merits:[status("Silver Ladder",5)]}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Masque (Style)"),{...base,merits:[status("Guardians of the Veil",1)]}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Masque"),{...base,merits:[{name:"Masque (Style)",dots:1}]}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Masque"),base),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Prelacy"),{...base,merits:[status("Seers of the Throne",3)]}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Prelacy"),{...base,merits:[status("Seers of the Throne",2)]}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Profane Tool"),{...base,merits:[{name:"Prelacy",dots:2}]}),true);
 const medium={...base,attributes:{Resolve:3,Composure:3}};
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Svikiro"),medium),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Svikiro"),{...medium,attributes:{Resolve:2,Composure:3}}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Svikiro Nganga"),{...base,merits:[{name:"Svikiro",dots:3}]}),true);
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
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(merit("Sanctum"),{dots:3,configuration:{safePlaceId:"safe-a"}},{...base,merits:[safePlace]},[]),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(merit("Sanctum"),{dots:4,configuration:{safePlaceId:"safe-a"}},{...base,merits:[safePlace]},[]).length>0);
 const sanctum={instanceId:"sanctum-a",name:"Sanctum",dots:1};
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(merit("Demesne"),{dots:3,configuration:{sanctumId:"sanctum-a"}},{...base,merits:[sanctum]},[]),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(merit("Demesne"),{dots:3,configuration:{sanctumId:"missing"}},{...base,merits:[sanctum]},[]).length>0);
});
test("Shadow Self applies Shadow Name 3 and Mind 1",()=>{
 const shadow=merit("Shadow Self"),context={...base,arcana:{Mind:1},merits:[{name:"Shadow Name",dots:3}]};
 assert.equal(mageMerits.mageMeritPrerequisitesMet(shadow,context),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(shadow,{...context,arcana:{Mind:0}}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(shadow,{...context,merits:[{name:"Shadow Name",dots:2}]}),false);
});
test("Mage requirements use Path and specific Status domains",()=>{
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Fire Keeper"),{...base,path:"Obrimos"}),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Fire Keeper"),{...base,path:"Moros"}),false);
 const adamant=merit("Adamant Hand"),arrow={...base,order:"Adamantine Arrow",skills:{Athletics:3},merits:[{name:"Awakened Status",dots:1,configuration:{domain:"Adamantine Arrow"}}]};
 assert.equal(mageMerits.mageMeritPrerequisitesMet(adamant,arrow),true);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(adamant,{...arrow,merits:[{name:"Awakened Status",dots:1,configuration:{domain:"Silver Ladder"}}]}),false);
});
test("Occultation and Fame exclude each other in either purchase order",()=>{
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Occultation"),{...base,merits:[{name:"Fame",dots:1}]}),false);
 assert.equal(mageMerits.mageMeritPrerequisitesMet(merit("Fame"),{...base,merits:[{name:"Occultation",dots:1}]}),false);
});
test("Infamous Mentor links a Mentor instance of equal rating",()=>{
 const infamous=merit("Infamous Mentor"),context={...base,merits:[{instanceId:"mentor-a",name:"Mentor",dots:3}]};
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(infamous,{dots:3,configuration:{mentorId:"mentor-a"}},context,[]),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(infamous,{dots:4,configuration:{mentorId:"mentor-a"}},context,[]).length>0);
 assert.ok(mageMerits.mageMeritSelectionProblems(infamous,{dots:3,configuration:{mentorId:"missing"}},context,[]).length>0);
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
 assert.ok(mageMerits.mageMeritSelectionProblems(merit("Prelacy"),{dots:3,configuration:{exarch:"General"}},context,factions,"panopticon").some(message=>message.key==="ui.meritPrelacyPatron"&&message.params?.affiliation==="Panopticon"));
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
 for(const faction of factions){
  assert.ok(faction.description,faction.name);
  assert.ok(faction.presentationPt?.toolYantra,faction.name);
  assert.ok(faction.presentationPt?.description,faction.name);
 }
 const factionMember=merit("Faction Member");
 const status=(domain,dots)=>({name:"Awakened Status",dots,configuration:{domain}});
 const context={...base,order:"Mysterium",merits:[status("Mysterium",2)]};
 assert.deepEqual(mageMerits.mageMeritSelectionProblems(factionMember,{dots:3,configuration:{factionId:"mta-tome:archivists",roteSkill:"Politics"}},context,factions),[]);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:3,configuration:{factionId:"mta-tome:archivists",roteSkill:"Crafts"}},context,factions).length>0);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:2,configuration:{factionId:"mta-tome:archivists"}},{...context,order:"Silver Ladder",merits:[status("Silver Ladder",2)]},factions).length>0);
 assert.ok(mageMerits.mageMeritSelectionProblems(factionMember,{dots:2,configuration:{factionId:"mta-tome:archivists"}},{...context,merits:[status("Mysterium",1)]},factions).length>0);
});
