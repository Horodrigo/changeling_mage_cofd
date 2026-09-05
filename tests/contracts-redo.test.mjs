import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());

const { CONTRACTS, CONTRACT_NAME_ALIASES } = await vite.ssrLoadModule("/lib/contracts.ts");
const { CONTRACT_TEXT_EN } = await vite.ssrLoadModule("/lib/contracts-en.ts");
const { contractPresentation, contractSummary } = await vite.ssrLoadModule("/lib/contract-presentation.ts");

test("catálogo contém os primeiros 159 Contratos oficiais auditados", () => {
  assert.equal(CONTRACTS.length, 159);
  assert.equal(new Set(CONTRACTS.map((contract) => contract.id)).size, 159);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-oak-ash-thorn").length, 7);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-the-hedge").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-dark-eras").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-kith-and-kin").length, 59);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-core").length, 89);
  assert.equal(CONTRACT_NAME_ALIASES["Ancestors' Wisdom"], "ctl-oak-ash-thorn:ancestors-wisdom");
  assert.deepEqual(CONTRACT_TEXT_EN, {});
});

test("bloco Scepter está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-kith-and-kin"&&item.regalia==="Scepter");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[44,44,45,45,46,46,46,47,48,48]);
  assert.equal(items.find((item)=>item.originalName==="Fake It ‘Til You Make It")?.dicePool,"Presence + Persuasion + Wyrd - Resolve");
});

test("bloco Stars está completo e não herda o resumo contaminado do índice", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-kith-and-kin"&&item.regalia==="Stars");
  assert.equal(items.length,9);
  assert.deepEqual(items.map((item)=>item.page),[49,49,49,50,50,51,51,51,52]);
  const wish=items.find((item)=>item.originalName==="Star Light, Star Bright");
  assert.equal(wish?.hasRoll,false);
  assert.equal(wish?.cost,"●/●●");
  assert.doesNotMatch(wish?.description??"",/Enchanted Bargain|teleport|regains? Willpower|Beat/i);
  assert.match(wish?.description??"",/Oathbreaker/);
});

test("bloco Thorn está completo e preserva a correção de Witch's Brambles", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-kith-and-kin"&&item.regalia==="Thorn");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[53,54,54,54,55,55,56,57,57,58]);
  const witch=items.find((item)=>item.originalName==="Witch's Brambles");
  assert.equal(witch?.hasRoll,false);
  assert.equal(witch?.dicePool,"None");
  assert.equal(witch?.cost,"●●○/●●●○");
  assert.equal(witch?.action,"Reflexive");
});

test("bloco Independent de Kith and Kin está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-kith-and-kin"&&item.regalia==="Independent");
  assert.equal(items.length,10);
  assert.equal(items.find((item)=>item.originalName==="Listen With Wind's Ears")?.hasRoll,false);
  assert.equal(items.find((item)=>item.originalName==="Cracked Mirror")?.dicePool,"Manipulation + Larceny + Wyrd vs. Stamina + Wyrd");
  assert.equal(items.find((item)=>item.originalName==="Momentary Respite")?.cost,"●; ○ per additional scene");
});

test("bloco Crown do livro básico está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Crown");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[128,128,129,129,129,130,130,131,131,132]);
});

test("bloco Jewels do livro básico está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Jewels");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[132,132,133,133,133,134,134,134,135,135]);
});

test("bloco Mirror do livro básico está completo sem Options duplicadas", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Mirror");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[136,136,137,137,138,138,138,139,139,139]);
  assert.equal(items.find((item)=>item.originalName==="Portents and Visions")?.options,undefined);
  assert.equal(items.find((item)=>item.originalName==="Walls Have Ears")?.options?.length,3);
});

test("bloco Shield do livro básico está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Shield");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[140,140,140,141,142,142,142,143,143,143]);
  assert.equal(items.find((item)=>item.originalName==="Thorns and Brambles")?.options?.length,3);
});

test("bloco Steed aguarda somente Flickering Hours", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Steed");
  assert.equal(items.length,9);
  assert.ok(!items.some((item)=>item.originalName==="Flickering Hours"));
  assert.equal(items.find((item)=>item.originalName==="Talon and Wing")?.options?.length,3);
});

test("bloco Sword do livro básico está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Sword");
  assert.equal(items.length,10);
  assert.deepEqual(items.map((item)=>item.page),[147,148,148,148,148,149,149,149,150,150]);
  assert.equal(items.find((item)=>item.originalName==="Elemental Weapon")?.options?.length,3);
});

test("bloco Spring do livro básico está completo como Contratos de Corte", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Spring");
  assert.equal(items.length,10);
  assert.ok(items.every((item)=>item.categoryKind==="Corte"));
  assert.deepEqual(items.map((item)=>item.page),[151,151,151,151,152,152,152,152,153,153]);
});

test("bloco Summer do livro básico está completo como Contratos de Corte", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Summer");
  assert.equal(items.length,10);
  assert.ok(items.every((item)=>item.categoryKind==="Corte"));
  assert.deepEqual(items.map((item)=>item.page),[153,154,154,155,155,155,155,155,156,156]);
});

test("bloco Autumn do livro básico está completo como Contratos de Corte", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Autumn");
  assert.equal(items.length,10);
  assert.ok(items.every((item)=>item.categoryKind==="Corte"));
  assert.deepEqual(items.map((item)=>item.page),[156,156,157,157,157,157,158,158,158,158]);
});

test("lote Chalice preserva metadados canônicos do índice offline", () => {
  const chalice = CONTRACTS.filter((contract) => contract.sourceId === "ctl-kith-and-kin" && contract.regalia === "Chalice");
  assert.ok(chalice.every((contract) => contract.regalia === "Chalice"));
  assert.deepEqual(chalice.map((contract) => contract.page), [34,35,35,36,36,36,37,38,38,39]);
  assert.equal(chalice.find((contract) => contract.originalName === "Sleep's Sweet Embrace")?.cost, "●●○");
  assert.equal(chalice.find((contract) => contract.originalName === "Frail as the Dying Word")?.dicePool, "Manipulation + Occult + Wyrd vs. Composure + Tolerance");
});

test("todo Contrato Kith and Kin importado tem mecânica, brecha e benefícios", () => {
  for (const contract of CONTRACTS.filter((item) => item.sourceId === "ctl-kith-and-kin")) {
    assert.ok(contract.description, contract.id);
    assert.ok(contract.loophole, contract.id);
    assert.equal(Object.keys(contract.seemingBenefits ?? {}).length, 2, contract.id);
    if (contract.hasRoll) {
      assert.ok(contract.success, contract.id);
      assert.ok(contract.exceptionalSuccess, contract.id);
      assert.ok(contract.failure, contract.id);
      assert.ok(contract.dramaticFailure, contract.id);
    }
  }
});

test("exceções dos livros preservam Dice Pool e somente Effect", () => {
  for (const name of ["Hidden Protocol", "Autonomous Payload", "Wyrd Debt"]) {
    const contract = CONTRACTS.find((item) => item.originalName === name);
    assert.ok(contract?.dicePool);
    assert.equal(contract?.hasRoll, false);
    assert.ok(contract?.description);
    assert.equal(contract?.success, undefined);
  }
});

test("referências corrigidas usam as páginas impressas e DE:CtL", () => {
  assert.equal(CONTRACTS.find((item) => item.originalName === "Distill the Hidden")?.page, 81);
  assert.equal(CONTRACTS.find((item) => item.originalName === "Wyrd Debt")?.page, 81);
  for (const contract of CONTRACTS.filter((item) => item.sourceId === "ctl-dark-eras")) {
    assert.equal(contract.source, "DE:CtL");
    assert.equal(contract.page, 241);
  }
});

test("interface apresenta Goblin como classificação própria", () => {
  const builder = readFileSync(new URL("../app/character-builder.tsx", import.meta.url), "utf8");
  const workspace = readFileSync(new URL("../app/workspace.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(builder, /Goblin ·.*Comum/);
  assert.doesNotMatch(workspace, /Goblin · Comum/);
});

test("Contratos rolados possuem os quatro resultados e Loophole definido", () => {
  for (const contract of CONTRACTS.filter((item) => item.hasRoll)) {
    assert.ok(contract.success, contract.id);
    assert.ok(contract.exceptionalSuccess, contract.id);
    assert.ok(contract.failure, contract.id);
    assert.ok(contract.dramaticFailure, contract.id);
    assert.ok(contract.loophole, contract.id);
  }
});

test("catálogo English-first não depende de overlay para exibir resumos", () => {
  const contract = CONTRACTS.find((item) => item.originalName === "The Widening Gyre");
  assert.ok(contractSummary(contract, "en-US"));
  assert.equal(contractPresentation(contract, "en-US").description, contract.description);
});
