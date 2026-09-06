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
  assert.equal(RAW_MERITS.length,219);
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
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Spring",mantle:1,merits:[]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Summer",mantle:2,merits:[]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,merits:[{name:"Court Goodwill",dots:3,configuration:{court:"spring"}}]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,merits:[{name:"Court Goodwill",dots:4,configuration:{court:"summer"}}]}),true);
  assert.equal(meritPrerequisitesMet(dressed,{gameLine:"CtL",court:"Courtless",mantle:0,merits:[{name:"Court Goodwill",dots:3,configuration:{court:"summer"}}]}),false);
  for(const name of ["Fae Mount","Mentor","Retainer","Safe Place","Striking Looks","Token"]) assert.ok(REPEATABLE_MERITS.has(name));
  for(const name of ["Contacts","Staff","Touchstone"]) assert.ok(!REPEATABLE_MERITS.has(name));
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
  assert.ok(findExpandedMerit("Professional Training"));
  assert.equal(getMeritsForLine("CtL").find((item)=>item.name==="Lucid Dreamer")?.prerequisites,"Non-changeling, Resolve •••");
});

test.skip("Greyhound e Esoteric Armory estão completos e disponíveis para Changeling",()=>{
  const merits=getMeritsForLine("CtL");
  const expected=[
    ["Greyhound","Galgo",[1],48,"Atletismo •••, Raciocínio •••, Vigor •••"],
    ["Esoteric Armory","Arsenal Esotérico",[1,2,3,4,5],139,undefined],
  ];
  for(const [name,translatedName,ratings,page,prerequisites] of expected){
    const merit=merits.find(item=>item.name===name);
    assert.ok(merit,name);
    assert.equal(merit.translatedName,translatedName);
    assert.deepEqual(merit.ratings,ratings);
    assert.equal(merit.page,page);
    assert.equal(merit.prerequisites,prerequisites);
    assert.ok(merit.description);
  }
});

test.skip("os oito Méritos estão completos no catálogo Changeling, sem duplicatas ou vazamento para Mage", () => {
  const expected = [
    ["Hedge Sorcerer",[4],66], ["Frightful Incantation",[4],69], ["Magic Dreams",[5],69],
    ["Manymask",[3],118], ["Rigid Mask",[3],119], ["Oath: Blood Liege",[3],91],
    ["Elemental Warrior",[1,2,3,4,5],113], ["Enchanting Performance",[1,2,3],113],
  ];
  const ctl = getMeritsForLine("CtL"), mage = getMeritsForLine("MtA");
  for (const [name,ratings,page] of expected) {
    const matches = ctl.filter(x=>x.name===name);
    assert.equal(matches.length,1,name);
    const merit = matches[0];
    assert.deepEqual(merit.ratings,ratings,name);
    assert.equal(merit.page,page,name);
    assert.notEqual(merit.translatedName,name);
    assert.ok(merit.description && !merit.description.includes("Descrição em tradução"));
    assert.ok(merit.prerequisites);
    assert.equal(mage.some(x=>x.name===name),false,name);
  }
  assert.equal(ctl.find(x=>x.name==="Oath: Blood Liege").source,"DE:CtL");
  assert.equal(ctl.find(x=>x.name==="Oath: Blood Liege").sourceId,"ctl-dark-eras");
  assert.ok(ctl.filter(x=>x.sourceId==="ctl-dark-eras").every(x=>x.source==="DE:CtL"));
});

test.skip("os estilos exibem benefícios para cada nível e Guerreiro Elemental permite escolher o elemento", () => {
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

test("as 73 Frátrias possuem nome localizado preservando IDs e nomes salvos", () => {
  assert.equal(KITHS.length,73);
  assert.equal(new Set(KITHS.map(x=>x.translatedName)).size,73);
  for (const item of KITHS) {
    assert.equal(item.translatedName,KITH_NAMES_PT[item.name]);
    assert.ok(item.translatedName);
    assert.equal(item.id,item.name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
    for (const alias of [item.id,item.name,item.translatedName,kithSearchText(item.translatedName)]) {
      assert.equal(findKith(alias)?.id,item.id,alias);
    }
    assert.equal(kithDisplayName(item.name),item.translatedName);
  }
  assert.equal(kithDisplayName("Artist"),"Artista");
  assert.equal(kithDisplayName("Artist",true),"Artist");
  assert.equal(kithDisplayName("Minha Frátria",true),"Minha Frátria");
  assert.equal(kithDisplayName("Frátria importada desconhecida"),"Frátria importada desconhecida");
});
