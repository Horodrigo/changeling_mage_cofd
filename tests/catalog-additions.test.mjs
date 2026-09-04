import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false} });
after(async () => vite.close());
const {getMeritsForLine} = await vite.ssrLoadModule("/lib/merits.ts");
const {findExpandedMerit} = await vite.ssrLoadModule("/lib/expanded-merits.ts");
const {KITHS,KITH_NAMES_PT,findKith,kithDisplayName,kithSearchText} = await vite.ssrLoadModule("/lib/changeling-kiths.ts");
const {findMeritConfiguration} = await vite.ssrLoadModule("/lib/merit-configurations.ts");

test("Greyhound e Esoteric Armory estão completos e disponíveis para Changeling",()=>{
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

test("os oito Méritos estão completos no catálogo Changeling, sem duplicatas ou vazamento para Mage", () => {
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

test("os estilos exibem benefícios para cada nível e Guerreiro Elemental permite escolher o elemento", () => {
  for (const [name,count] of [["Elemental Warrior",5],["Enchanting Performance",3]]) {
    const style = findExpandedMerit(name);
    assert.equal(style.levels.length,count);
    assert.deepEqual(style.levels.map(x=>x.rating),Array.from({length:count},(_,i)=>i+1));
    assert.ok(style.levels.every(x=>x.name && x.description));
  }
  assert.ok(findMeritConfiguration("Elemental Warrior").fields.some(x=>x.key==="element"));
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
