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
const OFFLINE_INDEX = JSON.parse(readFileSync(new URL("../tmp/contracts-redo/contracts-index.json", import.meta.url), "utf8"));

test("catálogo contém os 180 Contratos oficiais auditados", () => {
  const official = CONTRACTS.filter((contract) => !contract.sourceId.startsWith("h-"));
  assert.equal(official.length, 180);
  assert.equal(new Set(CONTRACTS.map((contract) => contract.id)).size, CONTRACTS.length);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-oak-ash-thorn").length, 7);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-the-hedge").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-dark-eras").length, 2);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-kith-and-kin").length, 59);
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "ctl-core").length, 110);
  assert.equal(CONTRACT_NAME_ALIASES["Ancestors' Wisdom"], "ctl-oak-ash-thorn:ancestors-wisdom");
  assert.deepEqual(CONTRACT_TEXT_EN, {});
});

test("Book of Courts inicia com a família Circadian compartilhada e Clauses canônicas", () => {
  const items = CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.courtFamily === "circadian");
  assert.equal(items.length, 10);
  assert.deepEqual(new Set(items.flatMap((contract) => Object.keys(contract.courtClauses ?? {}))), new Set(["sun", "moon"]));
  assert.ok(items.every((contract) => contract.summary && contract.loophole));
  assert.equal(items.find((contract) => contract.originalName === "Frost-Fire Glance")?.hasRoll, false);
});

test("família Undercourt possui dez Contratos e usa o identificador canônico da Corte", () => {
  const items = CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.courtFamily === "undercourt");
  assert.equal(items.length, 10);
  assert.ok(items.every((contract) => contract.courtIds?.includes("undercourt")));
  assert.equal(items.find((contract) => contract.originalName === "Family-Friendly Feud")?.hasRoll, false);
});

test("família Weather possui dez Contratos, duas Clauses e dois Nothing to See Here distintos", () => {
  const items = CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.courtFamily === "weather");
  assert.equal(items.length, 10);
  assert.ok(items.every((contract) => new Set(Object.keys(contract.courtClauses ?? {})).size === 2));
  assert.equal(CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.originalName === "Nothing to See Here").length, 2);
});

test("família Zodiac inclui dez Contratos, quatro Clauses, Contemptuous e a tabela estelar", async () => {
  const items = CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.courtFamily === "zodiac");
  assert.equal(items.length, 10);
  assert.ok(items.every((contract) => Object.keys(contract.courtClauses ?? {}).length === 4));
  assert.equal(items.find((contract) => contract.originalName === "Assuming the Stellar Mantle")?.detailTables?.[0]?.rows.length, 12);
  const { CHANGELING_CONDITIONS } = await vite.ssrLoadModule("/lib/changeling-conditions.ts");
  assert.ok(CHANGELING_CONDITIONS.some((condition) => condition.originalName === "Contemptuous" && condition.source === "Book of Courts"));
});

test("família Directional possui dez Contratos e cinco Clauses canônicas", () => {
  const items = CONTRACTS.filter((contract) => contract.sourceId === "h-courts" && contract.courtFamily === "directional");
  assert.equal(items.length, 10);
  assert.ok(items.every((contract) => Object.keys(contract.courtClauses ?? {}).length === 5));
  assert.equal(items.find((contract) => contract.originalName === "Escape Route")?.hasRoll, false);
});

test("catálogo cobre integralmente os 173 registros do índice offline", () => {
  const normalize = (value) => value.normalize("NFKC").replace(/[‘’]/g, "'");
  const importedNames = new Set(CONTRACTS.map((contract) => normalize(contract.originalName)));
  const missing = OFFLINE_INDEX.filter((entry) => !importedNames.has(normalize(entry.name))).map((entry) => entry.name);
  assert.deepEqual(missing, []);
  assert.equal(OFFLINE_INDEX.length, 173);
});

test("custos e Dice Pools permanecem conciliados com o índice offline", () => {
  const normalizeName = (value) => value.normalize("NFKC").replace(/[‘’]/g, "'");
  const normalizeMechanic = (value) => String(value ?? "").toLowerCase().replace(/−/g, "-").replace(/vs\./g, "vs").replace(/\s+/g, "").replace(/\+/g, "");
  const byName = new Map(CONTRACTS.map((contract) => [normalizeName(contract.originalName), contract]));
  const acceptedCostExceptions = new Set([
    "Flickering Hours", "Momentary Respite", "Witch's Brambles",
    "Changeling Hours", "Walls Have Ears", "Trapdoor Spider's Trick", "Talon and Wing",
    "Elemental Fury", "Steal Influence", "Spring's Kiss", "Blessing of Spring",
    "Helios' Judgment", "Autumn's Fury", "Tasting the Harvest", "Field of Regret", "Wayward Guide",
  ]);
  const acceptedPoolExceptions = new Set(["Cracked Mirror", "Witch's Brambles", "Flickering Hours"]);
  const costMismatches = [];
  const poolMismatches = [];
  for (const entry of OFFLINE_INDEX) {
    const contract = byName.get(normalizeName(entry.name));
    if (!acceptedCostExceptions.has(entry.name) && normalizeMechanic(contract?.cost) !== normalizeMechanic(entry.cost_index)) costMismatches.push({name:entry.name,index:entry.cost_index,actual:contract?.cost});
    if (!acceptedPoolExceptions.has(entry.name) && normalizeMechanic(contract?.dicePool) !== normalizeMechanic(entry.dice_pool_index)) poolMismatches.push({name:entry.name,index:entry.dice_pool_index,actual:contract?.dicePool});
  }
  assert.deepEqual(costMismatches, []);
  assert.deepEqual(poolMismatches, []);
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

test("bloco Steed está completo e preserva a exceção de Flickering Hours", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Steed");
  assert.equal(items.length,10);
  const flickering=items.find((item)=>item.originalName==="Flickering Hours");
  assert.equal(flickering?.hasRoll,false);
  assert.equal(flickering?.dicePool,"None");
  assert.equal(flickering?.cost,"●/●○");
  assert.match(flickering?.description??"",/Resolve \+ Wyrd contested by the changeling's Wits \+ Occult \+ Wyrd/);
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

test("bloco Winter do livro básico está completo como Contratos de Corte", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.regalia==="Winter");
  assert.equal(items.length,10);
  assert.ok(items.every((item)=>item.categoryKind==="Corte"));
  assert.deepEqual(items.map((item)=>item.page),[159,159,159,159,160,160,161,161,161,161]);
  assert.equal(items.filter((item)=>item.hasRoll).length,6);
});

test("bloco Goblin do livro básico está completo", () => {
  const items=CONTRACTS.filter((item)=>item.sourceId==="ctl-core"&&item.goblin);
  assert.equal(items.length,10);
  assert.ok(items.every((item)=>item.regalia==="Goblin"&&item.categoryKind==="Independente"));
  assert.deepEqual(items.map((item)=>item.page),[162,162,163,163,163,163,164,164,164,164]);
  assert.equal(items.filter((item)=>item.hasRoll).length,2);
  assert.equal(items.find((item)=>item.originalName==="Goblin's Eye")?.options?.length,7);
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

test("todos os 180 Contratos possuem os campos estruturais obrigatórios", () => {
  for (const contract of CONTRACTS) {
    assert.ok(contract.id, "missing id");
    assert.ok(contract.name, contract.id);
    assert.ok(contract.originalName, contract.id);
    assert.ok(contract.description, contract.id);
    assert.ok(contract.cost, contract.id);
    assert.ok(contract.action, contract.id);
    assert.ok(contract.duration, contract.id);
    assert.ok(contract.loophole, contract.id);
    assert.ok(contract.sourceId, contract.id);
    assert.ok(contract.source, contract.id);
    assert.ok(Number.isInteger(contract.page) && contract.page > 0, contract.id);
    assert.ok(contract.dicePool, contract.id);
  }
});

test("catálogo English-first não depende de overlay para exibir resumos", () => {
  const contract = CONTRACTS.find((item) => item.originalName === "The Widening Gyre");
  assert.ok(contractSummary(contract, "en-US"));
  assert.equal(contractPresentation(contract, "en-US").description, contract.description);
});
