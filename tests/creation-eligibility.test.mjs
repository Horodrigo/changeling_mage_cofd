import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});

after(async () => {
  await vite.close();
});

const rules = await vite.ssrLoadModule("/lib/creation-eligibility.ts");
const { CONTRACTS } = await vite.ssrLoadModule("/lib/contracts.ts");
const creationRules = await vite.ssrLoadModule("/lib/creation-rules.ts");

test("cria e remove Fragilidades conforme os níveis pares de Fado", () => {
  assert.deepEqual(creationRules.normalizeChangelingFrailties([], 1), ["Ferro Frio"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos"], 2), ["Ferro Frio", "Espelhos"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos", "Sinos"], 3), ["Ferro Frio", "Espelhos"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos", "Sinos"], 4), ["Ferro Frio", "Espelhos", "Sinos"]);
});

test("resume os benefícios de Fado para mouse, foco e toque", () => {
  assert.equal(creationRules.wyrdSummary(5), "Fado 5 (-2 Fadiga/Doenças; 13 Frutas)");
});

test("explica separadamente cada erro na distribuição inicial de Arcana", () => {
  assert.deepEqual(
    rules.arcanaCreationErrors(
      { Fate: 1, Time: 0, Death: 1 },
      { ruling: ["Fate", "Time"], inferior: "Death" },
    ),
    [
      "Distribua mais 4 ponto(s) de Arcana (atual: 2/6)",
      "Cada Arcano Regente precisa de ao menos 1 ponto: Time",
      "Os Arcanos Regentes precisam somar ao menos 3 (atual: 1)",
      "O Arcano Inferior Death deve começar com 0 pontos",
    ],
  );
});

test("aceita feitiços apenas quando todos os requisitos de Arcana são atendidos", () => {
  assert.equal(
    rules.meetsArcanaRequirements({ Fate: 2, Time: 1 }, { Fate: 2, Time: 1 }),
    true,
  );
  assert.equal(
    rules.meetsArcanaRequirements({ Fate: 2, Time: 1 }, { Fate: 3, Time: 0 }),
    false,
  );
});

test("limita Contratos Reais às Regalias favorecidas e Contratos de Corte à Corte", () => {
  const favored = ["Coroa", "Espelho"];
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Real", regalia: "Coroa" },
      favored,
      "Inverno",
    ),
    true,
  );
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Real", regalia: "Espada" },
      favored,
      "Inverno",
    ),
    false,
  );
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Comum", regalia: "Verão" },
      favored,
      "Inverno",
    ),
    false,
  );
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Real", regalia: "Inverno" },
      favored,
      "Inverno",
    ),
    true,
  );
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Comum", regalia: "Cálice" },
      favored,
      "Inverno",
    ),
    true,
  );
});

test("classifica os Contratos de Book of Seemings por Regalia real", () => {
  const seemingsContracts = CONTRACTS.filter(
    (contract) => contract.sourceId === "h-seemings",
  );
  assert.equal(
    seemingsContracts.some((contract) => contract.regalia === "Feições"),
    false,
  );
  assert.deepEqual(
    seemingsContracts
      .filter((contract) => contract.page >= 139 && contract.page <= 142)
      .map((contract) => contract.regalia),
    ["Garganta", "Garganta", "Garganta", "Garganta", "Garganta"],
  );
  assert.equal(
    seemingsContracts.find((contract) => contract.id === "h-seemings:last-hope")
      ?.regalia,
    "Coroa",
  );
  assert.equal(
    seemingsContracts.find(
      (contract) => contract.id === "h-seemings:the-troll-toll",
    )?.regalia,
    "Escudo",
  );
});
