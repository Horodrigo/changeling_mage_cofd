import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());

const { CONTRACTS, CONTRACT_NAME_ALIASES } = await vite.ssrLoadModule("/lib/contracts.ts");
const { CONTRACT_TEXT_EN } = await vite.ssrLoadModule("/lib/contracts-en.ts");
const { contractPresentation, contractSummary } = await vite.ssrLoadModule("/lib/contract-presentation.ts");

test("primeiro lote contém os sete Contratos oficiais de Oak, Ash, and Thorn", () => {
  assert.equal(CONTRACTS.length, 7);
  assert.equal(new Set(CONTRACTS.map((contract) => contract.id)).size, 7);
  assert.ok(CONTRACTS.every((contract) => contract.sourceId === "ctl-oak-ash-thorn"));
  assert.equal(CONTRACT_NAME_ALIASES["Ancestors' Wisdom"], "ctl-oak-ash-thorn:ancestors-wisdom");
  assert.deepEqual(CONTRACT_TEXT_EN, {});
});

test("exceções do livro preservam Dice Pool e somente Effect", () => {
  for (const name of ["Hidden Protocol", "Autonomous Payload"]) {
    const contract = CONTRACTS.find((item) => item.originalName === name);
    assert.ok(contract?.dicePool);
    assert.equal(contract?.hasRoll, false);
    assert.ok(contract?.description);
    assert.equal(contract?.success, undefined);
  }
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
