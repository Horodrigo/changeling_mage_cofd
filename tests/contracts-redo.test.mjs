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

test("catálogo contém os primeiros onze Contratos oficiais auditados", () => {
  assert.equal(CONTRACTS.length, 11);
  assert.equal(new Set(CONTRACTS.map((contract) => contract.id)).size, 11);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-oak-ash-thorn").length, 7);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-the-hedge").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-dark-eras").length, 2);
  assert.equal(CONTRACT_NAME_ALIASES["Ancestors' Wisdom"], "ctl-oak-ash-thorn:ancestors-wisdom");
  assert.deepEqual(CONTRACT_TEXT_EN, {});
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
