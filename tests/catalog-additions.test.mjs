import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false} });
after(async () => vite.close());
const {getMeritsForLine,RAW_MERITS,REPEATABLE_MERITS,UNBOUNDED_MERITS,meritRatingsFor,meritPrerequisitesMet} = await vite.ssrLoadModule("/lib/merits.ts");
const {findExpandedMerit} = await vite.ssrLoadModule("/lib/expanded-merits.ts");
const {KITHS,KITH_NAMES_PT,findKith,kithDisplayName,kithSearchText} = await vite.ssrLoadModule("/lib/changeling-kiths.ts");
const {findMeritConfiguration,isInlineMeritConfiguration,synchronizeMeritGrants,expandedConfigurationLines} = await vite.ssrLoadModule("/lib/merit-configurations.ts");

test("catálogo English-first contém a base auditada e os suplementos aprovados",()=>{
  assert.equal(RAW_MERITS.length,351);
  assert.equal(RAW_MERITS.filter((merit)=>merit.line==="MtA").length,58);
  assert.ok(RAW_MERITS.some((merit)=>merit.name==="Dramaturge"&&merit.source==="Kith and Kin"));
  assert.ok(RAW_MERITS.some((merit)=>merit.name==="Understudy"&&merit.source==="Kith and Kin"));
  assert.equal(RAW_MERITS.filter((merit)=>merit.source==="Book of Courts").length,39);
  assert.deepEqual([...new Set(RAW_MERITS.filter((merit)=>merit.source==="Book of Courts").map((merit)=>merit.category))],["Changeling Courts"]);
  const hedgeDuelist=RAW_MERITS.find((merit)=>merit.name==="Hedge Duelist");
  assert.deepEqual(hedgeDuelist?.ratings,[1,2,3,4,5]);
  assert.equal(hedgeDuelist?.levels?.filter((level)=>level.rating===1).length,7);
  assert.deepEqual(hedgeDuelist?.levels?.filter((level)=>level.rating>1).map((level)=>level.name),["Emerald Shield","Bite Like Thorns","Whispers Beyond the Path","Symphony of Thorns"]);
  assert.equal(hedgeDuelist?.category,"Changeling Seemings");
  assert.equal(hedgeDuelist?.additionalSources?.[0]?.page,101);
  assert.equal(findMeritConfiguration("Hedge Duelist")?.fields[0]?.options?.length,7);
  assert.ok(REPEATABLE_MERITS.has("Hedge Duelist"));
  assert.equal(findMeritConfiguration("Court Goodwill")?.fields[0]?.kind,"court");
  assert.equal(meritPrerequisitesMet({name:"Lucid Dreamer",prerequisites:"Non-changeling, Resolve •••"},{gameLine:"CtL"}),false);
  const dressed=RAW_MERITS.find((merit)=>merit.name==="Dressed to Kill");
  const socialSkills={Socialize:2};
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Spring",mantle:1,skills:socialSkills,merits:[]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Summer",mantle:2,skills:socialSkills,merits:[]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,skills:socialSkills,merits:[{name:"Court Goodwill",dots:3,configuration:{court:"spring"}}]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,skills:socialSkills,merits:[{name:"Court Goodwill",dots:4,configuration:{court:"summer"}}]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,skills:socialSkills,merits:[{name:"Court Goodwill",dots:3,configuration:{court:"summer"}}]}),false);
  for(const name of ["Fae Mount","Mentor","Retainer","Safe Place","Striking Looks","Hedgespun Item"]) assert.ok(REPEATABLE_MERITS.has(name));
  for(const name of ["Contacts","Staff","Touchstone","Token"]) assert.ok(!REPEATABLE_MERITS.has(name));
  assert.equal(meritRatingsFor(RAW_MERITS.find((merit)=>merit.name==="Token")).at(-1),50);
  assert.deepEqual(meritRatingsFor(RAW_MERITS.find((merit)=>merit.name==="Hedgespun Item")),[1,2,3,4,5]);
  for(const name of ["Contacts","Staff"]){
    assert.ok(UNBOUNDED_MERITS.has(name));
    assert.equal(meritRatingsFor(RAW_MERITS.find((merit)=>merit.name===name),21).at(-1),21);
  }
  const sheet={game_line:"CtL",line_data:{court:"spring"},merits:[{name:"Court Goodwill",dots:4,configuration:{court:"summer"}}]};
  synchronizeMeritGrants(sheet);
  assert.deepEqual(sheet.line_data.court_goodwill_benefits,[{court:"summer",dots:4,mantleDots:2}]);
  assert.equal(sheet.merits.filter((merit)=>merit.name==="Allies"||merit.name==="Mentor").length,0);
  assert.equal(sheet.merits.find((merit)=>merit.name==="Mantle")?.dots,1);
  assert.equal(expandedConfigurationLines("Court Goodwill",4,{court:"summer"},"en-US").length,4);
  assert.equal(expandedConfigurationLines("Court Goodwill",1,{court:"leafless-tree"},"en-US")[0],"Court: Court of the Leafless Tree.");
  assert.deepEqual(expandedConfigurationLines("Contacts",2,{groups:["Police","Anna"]},"en-US"),["Contact 1: Police","Contact 2: Anna"]);
  assert.ok(findExpandedMerit("Professional Training"));
  assert.equal(findMeritConfiguration("Touchstone"),undefined);
  assert.equal(findMeritConfiguration("Mentor")?.fields[0]?.key,"name");
  assert.ok(getMeritsForLine("CtL").filter((item)=>item.sourceId==="ctl-2ed"&&item.name!=="Librarian").every((item)=>item.category!=="General"));
  assert.equal(getMeritsForLine("CtL").find((item)=>item.name==="Librarian")?.category,"Social");
  assert.deepEqual(
    expandedConfigurationLines("Mystery Cult Initiation",3,{cult:"Silver Ladder",level_1_type:"specialty",level_1_specialty_skill:"Occult",level_1_specialty_name:"Rituals",level_2_type:"merit",level_2_merits:["Library|1"],level_3_type:"skill",level_3_skill:"Occult"},"en-US"),
    ["Cult: Silver Ladder","Dot 1: Specialty: Occult (Rituals)","Dot 2: Library •","Dot 3: Occult +1"],
  );
  assert.equal(getMeritsForLine("CtL").find((item)=>item.name==="Lucid Dreamer")?.prerequisites,"Non-changeling, Resolve •••");
  const locationMerits=[
    ["Stable Trod","Changeling the Lost",119,[1,2,3,4,5]],
    ["Workshop","Changeling the Lost",120,[1,2,3,4,5]],
    ["Shared Bastion","The Hedge",115,[1,2,3,4,5]],
    ["Calming Eidolons","The Hedge",118,[1,2,3]],
    ["Motley Awareness","The Hedge",119,[1,3]],
    ["Somnambulation","The Hedge",119,[3,4]],
  ];
  for(const [name,source,page,ratings] of locationMerits){const merit=RAW_MERITS.find((item)=>item.name===name);assert.equal(merit?.source,source,name);assert.equal(merit?.page,page,name);assert.deepEqual(merit?.ratings,ratings,name);assert.ok(merit?.description,name);}
  assert.ok(findMeritConfiguration("Hollow"));
  assert.ok(findMeritConfiguration("Shared Bastion"));
  assert.ok(findMeritConfiguration("Stable Trod"));
  assert.ok(findMeritConfiguration("Workshop"));
  assert.match(expandedConfigurationLines("Hollow",3,{name:"Briar House",features:["Hob Alarm|1","Hidden Entry|2"]},"en-US").join("\n"),/Hob Alarm, Hidden Entry/);
  assert.match(expandedConfigurationLines("Shared Bastion",2,{features:["Buttressed Dreaming|1","Guardian Eidolon|1"]},"en-US").join("\n"),/Buttressed Dreaming, Guardian Eidolon/);
  const tokens=[
    JSON.stringify({name:"Moon Key",rating:2,cost:"1 Glamour",effect:"Opens moonlit doors.",catch:"Sing to the lock.",drawback:"Gain Shaken."}),
    JSON.stringify({name:"Thorn Coin",rating:1,cost:"1 Glamour",effect:"Find a market.",catch:"Give it away.",drawback:"Gain Notoriety."}),
  ];
  const tokenLines=expandedConfigurationLines("Token",3,{items:tokens},"en-US");
  assert.equal(tokenLines.length,2);
  assert.match(tokenLines[0],/Moon Key \(••\).*Opens moonlit doors/);
  const specialTokenLines=expandedConfigurationLines("Token",3,{items:[
    JSON.stringify({kind:"trifle",name:"Kraken Ink",rating:1,effect:"Inflicts Blinded."}),
    JSON.stringify({kind:"bauble",name:"Lonely Key",rating:2,description:"A timeworn key.",crux:"Everyone leaves.",catch:"Abandon a companion."}),
  ]},"en-US");
  assert.match(specialTokenLines[0],/Kraken Ink \(3\).*Inflicts Blinded/);
  assert.match(specialTokenLines[1],/Lonely Key \(••\).*Crux: Everyone leaves.*Catch: Abandon a companion/);
  assert.match(expandedConfigurationLines("Hedgespun Item",3,{name:"Star Coat",description:"A coat lined with stars.",benefits:["extraordinary","alacrity","extraordinary"],extraordinary_detail:"+2 general armor"},"en-US").join("\n"),/Extraordinary Equipment ×2: \+2 general armor/);
  assert.doesNotMatch(expandedConfigurationLines("Hedgespun Item",1,{benefits:["alacrity","durability"]},"en-US").join("\n"),/Increased Durability/);
});

test("Book of Seemings contém os 62 Méritos ingleses e respeita acesso por Seeming",()=>{
  const seemings=RAW_MERITS.filter((merit)=>merit.source==="Book of Seemings"&&merit.name!=="Hedge Duelist");
  assert.equal(seemings.length,62);
  assert.deepEqual(Object.fromEntries(["Beast","Darkling","Elemental","Fairest","Ogre","Wizened"].map((name)=>[name,seemings.filter((merit)=>merit.seeming===name).length])),{Beast:11,Darkling:11,Elemental:10,Fairest:8,Ogre:10,Wizened:12});
  assert.ok(seemings.every((merit)=>merit.category==="Changeling Seemings"&&merit.description&&merit.prerequisites));
  const blood=seemings.find((merit)=>merit.name==="Blood and Bone");
  assert.equal(meritPrerequisitesMet(blood,{gameLine:"CtL",seeming:"Beast"}),true);
  assert.equal(meritPrerequisitesMet(blood,{gameLine:"CtL",seeming:"Fairest"}),false);
  const stomach=seemings.find((merit)=>merit.name==="Stomach of Steel");
  assert.equal(meritPrerequisitesMet(stomach,{gameLine:"CtL",seeming:"Fairest",attributes:{Stamina:3}}),true);
  assert.equal(meritPrerequisitesMet(stomach,{gameLine:"CtL",seeming:"Fairest",attributes:{Stamina:2}}),false);
  assert.equal(meritPrerequisitesMet(stomach,{gameLine:"CtL",seeming:"Elemental",attributes:{Stamina:1}}),true);
  const understudy=RAW_MERITS.find((merit)=>merit.name==="Understudy");
  assert.equal(meritPrerequisitesMet(understudy,{gameLine:"CtL",skills:{Expression:4},merits:[]}),false);
  assert.equal(meritPrerequisitesMet(understudy,{gameLine:"CtL",skills:{Expression:4},merits:[{name:"Dramaturge",dots:3}]}),true);
  const tooSimple=seemings.find((merit)=>merit.name==="Too Simple to Fool");
  assert.equal(meritPrerequisitesMet(tooSimple,{gameLine:"CtL",seeming:"Ogre",attributes:{Intelligence:1}}),true);
  assert.equal(meritPrerequisitesMet(tooSimple,{gameLine:"CtL",seeming:"Ogre",attributes:{Intelligence:2}}),false);
});

test("concessões de Méritos estruturados são determinísticas e reversíveis",()=>{
  const sheet={
    game_line:"CtL",skills:{Academics:2,Occult:1},specializations:[],line_data:{court:"Courtless"},
    merits:[
      {instanceId:"pt",name:"Professional Training",dots:4,configuration:{contacts:["Journalists","Police"],asset_skills:["Academics","Occult","Investigation"],specialty_1_skill:"Academics",specialty_1_name:"Research",specialty_2_skill:"Occult",specialty_2_name:"Cults",boosted_skill:"Academics"}},
      {instanceId:"cult",name:"Mystery Cult Initiation",dots:3,configuration:{level_1_type:"specialty",level_1_specialty_skill:"Occult",level_1_specialty_name:"Rituals",level_2_type:"merit",level_2_merits:["Library|1"],level_3_type:"skill",level_3_skill:"Occult"}},
    ],
  };
  synchronizeMeritGrants(sheet);
  assert.equal(sheet.merits.find((item)=>item.name==="Contacts")?.dots,2);
  assert.deepEqual(sheet.merits.find((item)=>item.name==="Contacts")?.configuration.groups,["Journalists","Police"]);
  assert.equal(sheet.merits.find((item)=>item.name==="Library")?.dots,1);
  assert.deepEqual(sheet.specializations.map((item)=>[item.skill,item.name]),[["Academics","Research"],["Occult","Cults"],["Occult","Rituals"]]);
  assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses,{Academics:1,Occult:1});
  synchronizeMeritGrants(sheet);
  assert.equal(sheet.merits.filter((item)=>item.name==="Contacts").length,1);
  sheet.merits.find((item)=>item.name==="Professional Training").dots=2;
  sheet.merits.find((item)=>item.name==="Mystery Cult Initiation").dots=1;
  synchronizeMeritGrants(sheet);
  assert.deepEqual(sheet.specializations.map((item)=>[item.skill,item.name]),[["Occult","Rituals"]]);
  assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses,{});
  assert.equal(sheet.merits.some((item)=>item.name==="Library"),false);
});

test("Greyhound e Esoteric Armory estão completos e disponíveis para Changeling",()=>{
  const merits=getMeritsForLine("CtL");
  const expected=[
    ["Greyhound",[1],48,"Athletics •••, Wits •••, Stamina •••"],
    ["Esoteric Armory",[1,2,3,4,5],139,undefined],
  ];
  for(const [name,ratings,page,prerequisites] of expected){
    const merit=merits.find(item=>item.name===name);
    assert.ok(merit,name);
    assert.equal(merit.translatedName,name);
    assert.deepEqual(merit.ratings,ratings);
    assert.equal(merit.page,page);
    assert.equal(merit.prerequisites,prerequisites);
    assert.ok(merit.description);
  }
});

test("os oito Méritos estão completos no catálogo Changeling, sem duplicatas ou vazamento para Mage", () => {
  const expected = [
    ["Hedge Sorcerer",[4],66], ["Frightful Incantation",[4],69], ["Magic Dreams",[5],69],
    ["Manymask",[3],118], ["Rigid Mask",[3],119], ["Oath: Blood Liege",[3],107],
    ["Elemental Warrior",[1,2,3,4,5],113], ["Enchanting Performance",[1,2,3],113],
  ];
  const ctl = getMeritsForLine("CtL"), mage = getMeritsForLine("MtA");
  for (const [name,ratings,page] of expected) {
    const matches = ctl.filter(x=>x.name===name);
    assert.equal(matches.length,1,name);
    const merit = matches[0];
    assert.deepEqual(merit.ratings,ratings,name);
    assert.equal(merit.page,page,name);
    assert.equal(merit.translatedName,name);
    assert.ok(merit.description && !merit.description.includes("Descrição em tradução"));
    if(name!=="Oath: Blood Liege") assert.ok(merit.prerequisites);
    assert.equal(mage.some(x=>x.name===name),false,name);
  }
  assert.equal(ctl.find(x=>x.name==="Oath: Blood Liege").source,"Dark Eras 2");
  assert.equal(ctl.find(x=>x.name==="Oath: Blood Liege").sourceId,"de2");
});

test("os estilos exibem benefícios para cada nível e Guerreiro Elemental permite escolher o elemento", () => {
  for (const [name,count] of [["Elemental Warrior",5],["Enchanting Performance",3]]) {
    const style = findExpandedMerit(name);
    assert.equal(style.levels.length,count);
    assert.deepEqual(style.levels.map(x=>x.rating),Array.from({length:count},(_,i)=>i+1));
    assert.ok(style.levels.every(x=>x.name && x.description));
  }
  assert.ok(findMeritConfiguration("Elemental Warrior").fields.some(x=>x.key==="element"));
});

test("configurações de texto livre ficam inline e escolhas estruturadas permanecem separadas", () => {
  assert.equal(isInlineMeritConfiguration("Striking Looks"), true);
  assert.equal(isInlineMeritConfiguration("Allies"), true);
  assert.equal(isInlineMeritConfiguration("Mentor"), false);
  assert.equal(isInlineMeritConfiguration("Language"), true);
  assert.equal(isInlineMeritConfiguration("Court Goodwill"), false);
  assert.equal(isInlineMeritConfiguration("Professional Training"), false);
  assert.equal(isInlineMeritConfiguration("Fae Mount"), false);
  assert.equal(isInlineMeritConfiguration("Area of Expertise"), true);
  assert.equal(isInlineMeritConfiguration("Quick Draw"), true);
  assert.equal(isInlineMeritConfiguration("Unseen Sense"), true);
  assert.equal(findMeritConfiguration("Defensive Combat")?.fields[0]?.kind,"select");
  assert.equal(findMeritConfiguration("Fighting Finesse")?.fields[0]?.kind,"select");
  assert.equal(findMeritConfiguration("Multilingual")?.fields[0]?.kind,"list");
  assert.deepEqual(getMeritsForLine("CtL").find((item)=>item.name==="Multilingual")?.ratings,[1,2,3,4,5]);
  assert.deepEqual(expandedConfigurationLines("Multilingual",2,{languages:["French","German","Japanese","Arabic"]},"en-US"),["Languages: French, German, Japanese, Arabic"]);
  assert.ok(findMeritConfiguration("Warded Dreams"));
  assert.equal(findMeritConfiguration("Blood and Bone")?.fields[0]?.options?.length,8);
  assert.equal(findMeritConfiguration("Still Waters Run Deep")?.fields[0]?.options?.length,9);
  assert.deepEqual(findMeritConfiguration("Know-It-All")?.fields[0]?.options?.map((item)=>item.value),["Academics","Occult","Politics","Science"]);
  assert.equal(isInlineMeritConfiguration("Material Affinity"),true);
  assert.equal(isInlineMeritConfiguration("Mover and Shaker"),true);
});

test("compra de Mérito identifica o nível atual da instância", async()=>{
  const {readFile}=await import("node:fs/promises");
  const workspace=await readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(workspace,/meritName\(item\).*owned\.dots.*tr\("para","to"\)/s);
  assert.doesNotMatch(workspace,/`\$\{tr\("instância","instance"\)\} \$\{instanceNumber \+ 1\}`/);
});

test("Contratos exibem Comuns antes dos Reais sem perder a ordem alfabética", async()=>{
  const {readFile}=await import("node:fs/promises");
  const builder=await readFile(new URL("../app/character-builder.tsx",import.meta.url),"utf8");
  const workspace=await readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(builder,/alphabetical\(catalog, contractName,locale\)[\s\S]*Number\(left\.type === "Real"\)/);
  assert.match(workspace,/sortPriority: Number\(item\.type === "Real"\)/);
  assert.match(workspace,/alphabetical\(items, item => item\.name,locale\)[\s\S]*left\.sortPriority/);
});

test("as 73 Frátrias oficiais e 12 de Book of Seemings possuem nome localizado preservando IDs", () => {
  assert.equal(KITHS.length,85);
  assert.equal(KITHS.filter(x=>x.sourceId==="h-seemings").length,12);
  assert.equal(new Set(KITHS.map(x=>x.id)).size,85);
  for (const item of KITHS) {
    assert.equal(item.translatedName,KITH_NAMES_PT[item.name]);
    assert.ok(item.translatedName);
    if(item.id!=="chimera-book-of-seemings")assert.equal(item.id,item.name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
    const aliases=item.id==="chimera-book-of-seemings"?[item.id]:[item.id,item.name,item.translatedName,kithSearchText(item.translatedName)];
    for (const alias of aliases) {
      assert.equal(findKith(alias)?.id,item.id,alias);
    }
    assert.equal(kithDisplayName(item.name),item.translatedName);
  }
  assert.equal(kithDisplayName("Artist"),"Artista");
  assert.equal(kithDisplayName("Artist",true),"Artist");
  assert.equal(kithDisplayName("Minha Frátria",true),"Minha Frátria");
  assert.equal(kithDisplayName("Frátria importada desconhecida"),"Frátria importada desconhecida");
});
