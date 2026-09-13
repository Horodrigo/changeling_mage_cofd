import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

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
const regaliaRules = await vite.ssrLoadModule("/lib/changeling-regalia.ts");
const courtCatalog = await vite.ssrLoadModule("/lib/changeling-courts.ts");
courtCatalog.replaceCourtCatalog(
  JSON.parse(readFileSync(new URL("../public/data/changeling/courts.json", import.meta.url), "utf8")),
);
const creationRules = await vite.ssrLoadModule("/lib/creation-rules.ts");

test("Needle and Thread reopen with canonical values and follow the active locale",()=>{
  assert.equal(creationRules.canonicalChangelingAnchorName("needle","Mestre de Xadrez"),"Chess Master");
  assert.equal(creationRules.canonicalChangelingAnchorName("thread","Aceitação"),"Acceptance");
  assert.equal(creationRules.changelingAnchorDisplayName("needle","Mestre de Xadrez","en-US"),"Chess Master");
  assert.equal(creationRules.changelingAnchorDisplayName("thread","Aceitação","en-US"),"Acceptance");
  assert.equal(creationRules.changelingAnchorDisplayName("needle","Chess Master","pt-BR"),"Mestre de Xadrez");
});

test("Shadowsoul grants Mirror for creation and Experience without spending the second Regalia", () => {
  const data = {kith:"Shadowsoul", primary_regalia:"Crown", second_regalia:"Sword"};
  const favored = regaliaRules.changelingFavoredRegalia(data);
  assert.deepEqual(favored, ["Crown", "Sword", "Mirror"]);
  assert.equal(rules.canSelectInitialContract({type:"Real",regalia:"Mirror"},favored,""),true);
  assert.equal(regaliaRules.changelingContractExperienceCost({type:"Comum",regalia:"Mirror"},data),2);
  assert.equal(regaliaRules.changelingContractExperienceCost({type:"Real",regalia:"Mirror"},data),3);
  assert.equal(regaliaRules.changelingContractExperienceCost({type:"Real",regalia:"Jewels"},data),4);
  assert.equal(data.second_regalia,"Sword");
});

test("Shadowsoul does not duplicate existing Mirror and supports saved Portuguese sheets", () => {
  for (const data of [
    {kith:"Shadowsoul",primary_regalia:"Mirror",second_regalia:"Crown"},
    {kith:"shadowsoul",primary_regalia:"Crown",second_regalia:"Mirror"},
    {kith:"Alma Sombria",primary_regalia:"Coroa",second_regalia:"Espelho"},
  ]) {
    const favored=regaliaRules.changelingFavoredRegalia(JSON.parse(JSON.stringify(data)));
    assert.equal(favored.length,2);
    assert.equal(favored.filter(item=>item==="Mirror").length,1);
  }
});

test("Changing Kith removes only its affinity; custom names grant no official blessing", () => {
  const data={kith:"Shadowsoul",primary_regalia:"Crown",second_regalia:"Sword"};
  for(const updated of [{...data,kith:"Snowskin"},{...data,kith_custom:true}]) {
    const favored=regaliaRules.changelingFavoredRegalia(updated);
    assert.deepEqual(favored,["Crown","Sword"]);
    assert.equal(rules.canSelectInitialContract({type:"Real",regalia:"Mirror"},favored,""),false);
    assert.equal(regaliaRules.changelingContractExperienceCost({type:"Comum",regalia:"Mirror"},updated),3);
    assert.equal(regaliaRules.changelingContractExperienceCost({type:"Real",regalia:"Mirror"},updated),4);
    assert.equal(regaliaRules.changelingContractExperienceCost({type:"Comum",regalia:"Mirror",goblin:true},updated),2);
  }
  assert.deepEqual(regaliaRules.changelingFavoredRegalia({...data,kith:"Snowskin",second_regalia:"Mirror"}),["Crown","Mirror"]);
});

test("Needles e Threads possuem gatilhos estruturados de recuperação de Willpower",()=>{
  assert.equal(creationRules.CTL_NEEDLE_DEFINITIONS.length,34);
  assert.equal(creationRules.CTL_THREAD_DEFINITIONS.length,30);
  assert.equal(creationRules.CTL_NEEDLE_DEFINITIONS.filter((item)=>item.sourceId==="h-courts").length,8);
  assert.equal(creationRules.CTL_NEEDLE_DEFINITIONS.filter((item)=>item.sourceId==="h-seemings").length,12);
  assert.equal(creationRules.CTL_THREAD_DEFINITIONS.filter((item)=>item.sourceId==="h-courts").length,8);
  assert.equal(creationRules.CTL_THREAD_DEFINITIONS.filter((item)=>item.sourceId==="h-seemings").length,12);
  assert.match(creationRules.changelingAnchorRecovery("needle","Bon Vivant","en-US"),/Recover 1 Willpower:/);
  assert.match(creationRules.changelingAnchorRecovery("thread","Acceptance","pt-BR"),/Recuperar toda a FV:/);
});

test("cria e remove Fragilidades conforme os níveis pares de Fado", () => {
  assert.deepEqual(creationRules.normalizeChangelingFrailties([], 1), ["Cold Iron"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos"], 2), ["Cold Iron", "Espelhos"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos", "Sinos"], 3), ["Cold Iron", "Espelhos"]);
  assert.deepEqual(creationRules.normalizeChangelingFrailties(["Ferro Frio", "Espelhos", "Sinos"], 4), ["Cold Iron", "Espelhos", "Sinos"]);
});

test("resume os benefícios de Fado para mouse, foco e toque", () => {
  const reductions = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4];
  const fruits = ["3 Frutas", "7 Frutas", "7 Frutas", "13 Frutas", "13 Frutas", "13 Frutas", "29 Frutas", "29 Frutas", "101 Frutas", "Frutas ilimitadas"];
  for (let level = 1; level <= 10; level++) {
    assert.equal(creationRules.wyrdSummary(level), `Fado ${level} (-${reductions[level - 1]} Fadiga/Doenças; ${fruits[level - 1]})`);
    assert.match(creationRules.wyrdSummary(level, "en-US"), new RegExp(`^Wyrd ${level} `));
  }
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
  assert.equal(
    rules.meetsArcanaRequirements(
      { Fate: 2, Time: 1 },
      { Destino: 2, Tempo: 1 },
    ),
    true,
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

test("Contrato Court (All) pode ser escolhido por membro de qualquer Corte", () => {
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Real", categoryKind: "Corte", regalia: "All" },
      [],
      "Crystal Web",
    ),
    true,
  );
  assert.equal(
    rules.canSelectInitialContract(
      { type: "Real", categoryKind: "Corte", regalia: "All" },
      [],
      "",
    ),
    false,
  );
});

test("Contrato compartilhado de Corte usa a Clause da Corte canônica", () => {
  const contract = { type: "Comum", categoryKind: "Corte", regalia: "Circadian", courtClauses: { sun: "A", moon: "B" } };
  assert.equal(rules.canSelectInitialContract(contract, [], "Corte do Sol"), true);
  assert.equal(rules.canSelectInitialContract(contract, [], "winter"), false);
});
