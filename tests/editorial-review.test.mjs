import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());
const { CONTRACTS, CONTRACT_NAME_ALIASES, findContract } = await vite.ssrLoadModule("/lib/contracts.ts");
const { KITHS } = await vite.ssrLoadModule("/lib/changeling-kiths.ts");
const { contractHasInvocationRoll, contractOutcomeSections } = await vite.ssrLoadModule("/lib/contract-presentation.ts");
const { contractDisplayOptions } = await vite.ssrLoadModule("/lib/contract-presentation.ts");
const { alphabetical, orderedChoiceOptions } = await vite.ssrLoadModule("/lib/option-order.ts");
const { ATTRIBUTES, SKILLS } = await vite.ssrLoadModule("/lib/creation-rules.ts");

test("opções usam rótulos portugueses, acentos e ordem numérica sem alterar a origem", () => {
  const source = ["z", "a", "b"];
  assert.deepEqual(orderedChoiceOptions(source, { z:"Árvore", a:"Éter", b:"Bênção" }), ["z", "b", "a"]);
  assert.deepEqual(source, ["z", "a", "b"]);
  assert.deepEqual(orderedChoiceOptions(["10", "2", "1"]), ["1", "2", "10"]);
  assert.deepEqual(alphabetical([{name:"Zelo"},{name:"Aliança"}], x=>x.name).map(x=>x.name), ["Aliança","Zelo"]);
});

test("Atributos, Perícias e marcadores de seleção mantêm suas funções", () => {
  for (const values of [Object.values(ATTRIBUTES).flat(), Object.values(SKILLS).flat()]) {
    assert.deepEqual(orderedChoiceOptions(["__none", ...values]), ["__none", ...values]);
  }
  assert.deepEqual(orderedChoiceOptions(["Zelo", "__none", "Aliança"]), ["__none", "Aliança", "Zelo"]);
});

test("catálogos preservam as 261 identidades de Contratos e 73 Frátrias", () => {
  assert.equal(CONTRACTS.length,261);
  assert.equal(new Set(CONTRACTS.map(x=>x.id)).size,261);
  assert.equal(KITHS.length,73);
  assert.equal(new Set(KITHS.map(x=>x.id)).size,73);
  for (const [name,id] of Object.entries(CONTRACT_NAME_ALIASES)) {
    assert.equal(findContract(name)?.id,id);
    assert.equal(findContract(id)?.id,id);
    assert.equal(findContract(findContract(id).originalName)?.id,id);
  }
});

test("Contratos do livro básico têm quatro resultados ou apenas Efeito", () => {
  const core = CONTRACTS.filter(x=>x.sourceId==="ctl-2ed");
  assert.equal(core.length,110);
  for (const contract of core) {
    assert.notEqual(contractHasInvocationRoll(contract),undefined,contract.id);
    const labels = contractOutcomeSections(contract).map(x=>x.label);
    assert.deepEqual(labels, contractHasInvocationRoll(contract)
      ? ["Sucesso","Sucesso Excepcional","Falha","Falha Dramática"] : ["Efeito"],contract.id);
  }
  assert.match(findContract("ctl-2ed:hedgewall").failure,/Sebe.*dramática/);
  assert.match(findContract("ctl-2ed:slipknot-dreams").exceptionalSuccess,/permanente/);
});

test("homebrews antigos e novos exibem somente a mecânica pertinente, sem duplicação", () => {
  assert.deepEqual(contractOutcomeSections({description:"Resumo repetido",success:"Mecânica",dicePool:"Nenhum",exceptionalSuccess:"Não deve aparecer",failure:"Não deve aparecer"}),[{label:"Efeito",text:"Mecânica"}]);
  assert.deepEqual(contractOutcomeSections({description:"Mecânica",hasRoll:false,dicePool:"Presença + Fado"}),[{label:"Efeito",text:"Mecânica"}]);
  assert.deepEqual(contractOutcomeSections({description:"Mecânica",dicePool:"Nenhuma"}),[{label:"Efeito",text:"Mecânica"}]);
  assert.equal(contractHasInvocationRoll({dicePool:"Não informada"}),undefined);
  const rolled={description:"Resumo",hasRoll:true,success:"S",exceptionalSuccess:"SE",failure:"F",dramaticFailure:"FD"};
  assert.deepEqual(contractOutcomeSections(rolled).map(x=>x.text),["S","SE","F","FD"]);
});

test("resumos preservam custos permanentes, escolhas e limites das bênçãos", () => {
  const blessing=name=>KITHS.find(x=>x.name===name).blessing;
  assert.match(blessing("Reborn"),/ponto permanente de Força de Vontade/);
  assert.match(blessing("Bridgeguard"),/some os sucessos à Defesa/);
  assert.match(blessing("Whisperwisp"),/Perícia escolhida/);
  assert.match(blessing("Levinquick"),/3 Glamour/);
  assert.match(blessing("Chimera"),/cada capítulo/);
  assert.match(blessing("Sandharrowed"),/cobertura à própria vítima/);
  assert.match(blessing("Nymph"),/1 Glamour e Vigor/);
  assert.ok(KITHS.every(x=>!/(Click here|Mass Trauma|p\. XX|=== PDF)/.test(x.blessing)));
  assert.ok(KITHS.filter(x=>["Antiquarian","Chimera","Cleverquick","Dryad","Muse","Nymph"].includes(x.name)).every(x=>x.source==="DE:CtL"));
});

test("fichas oficiais usam o catálogo atualizado e Frátrias personalizadas preservam o texto", () => {
  const ui=readFileSync(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(ui,/data\.kith_custom \? undefined : findKith\(data\.kith\)/);
  assert.match(ui,/definition\?\.blessing \?\? data\.kith_blessing/);
  assert.match(ui,/definition\?\.description \?\? data\.kith_description/);
});

test("Opções de Contratos aparecem após Ação/Duração e antes dos resultados", () => {
  const builder=readFileSync(new URL("../app/character-builder.tsx",import.meta.url),"utf8");
  const start=builder.indexOf("function ContractSelector");
  const slice=builder.slice(start,builder.indexOf("function SpellSelector",start));
  assert.ok(slice.indexOf('tr("Ação / Duração"') < slice.indexOf('tr("Opções"'));
  assert.ok(slice.indexOf('tr("Opções"') < slice.indexOf("contractOutcomeSections"));
  const workspace=readFileSync(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  const power=workspace.slice(workspace.indexOf("function ContractPowerList"),workspace.indexOf("function SeemingLore"));
  assert.ok(power.indexOf('tr("Ação / Duração"') < power.indexOf('tr("Opções"'));
  assert.ok(power.indexOf('tr("Opções"') < power.indexOf("contractOutcomeSections"));
});

test("Options só repetem escolhas que não estejam incorporadas ao Efeito ou Sucesso", () => {
  const portents=findContract("ctl-2ed:portents-and-visions");
  assert.deepEqual(contractDisplayOptions(portents,"pt-BR"),[]);
  assert.deepEqual(contractDisplayOptions(portents,"en-US"),[]);
  const walls=findContract("ctl-2ed:walls-have-ears");
  assert.equal(contractDisplayOptions(walls,"pt-BR").length,3);
  assert.equal(contractDisplayOptions(walls,"en-US").length,3);
  assert.match(contractDisplayOptions(walls,"en-US")[0],/Durability/);
});
