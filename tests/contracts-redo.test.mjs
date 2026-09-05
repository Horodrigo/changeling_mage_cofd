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

test("catálogo contém os primeiros 68 Contratos oficiais auditados", () => {
  assert.equal(CONTRACTS.length, 68);
  assert.equal(new Set(CONTRACTS.map((contract) => contract.id)).size, 68);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-oak-ash-thorn").length, 7);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-the-hedge").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-dark-eras").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-kith-and-kin").length, 57);
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

test("bloco Independent contém os oito registros sem divergência pendente", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-kith-and-kin"&&item.regalia==="Independent");
  assert.equal(items.length,8);
  assert.deepEqual(new Set(items.map((item)=>item.originalName)),new Set([
    "Coming Darkness","Pomp and Circumstance","Shadow Puppet","Dread Companion",
    "Listen With Wind's Ears","Steal Influence","Earth's Gentle Movements","Earth's Impenetrable Walls",
  ]));
  assert.equal(items.find((item)=>item.originalName==="Listen With Wind's Ears")?.hasRoll,false);
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
