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
after(async () => vite.close());

const homebrews = await vite.ssrLoadModule("/lib/homebrews.ts");
const merits = await vite.ssrLoadModule("/lib/merits.ts");
merits.replaceMeritCatalog(["core","changeling","mage"].flatMap((name) =>
  JSON.parse(readFileSync(new URL(`../public/data/core/merits/${name}.json`, import.meta.url), "utf8")),
));
const expanded = await vite.ssrLoadModule("/lib/expanded-merits.ts");
const meritConfigurations = await vite.ssrLoadModule("/lib/merit-configurations.ts");
const courts = await vite.ssrLoadModule("/lib/changeling-courts.ts");
courts.replaceCourtCatalog(JSON.parse(readFileSync(new URL("../public/data/changeling/courts.json", import.meta.url), "utf8")));
const creationRules = await vite.ssrLoadModule("/lib/creation-rules.ts");
const eligibility = await vite.ssrLoadModule("/lib/creation-eligibility.ts");
const terms = await vite.ssrLoadModule("/lib/system-terms.ts");
const entitlements = await vite.ssrLoadModule("/lib/entitlements.ts");
entitlements.replaceEntitlementCatalog(JSON.parse(readFileSync(new URL("../public/data/changeling/entitlements.json", import.meta.url), "utf8")));
const kiths = await vite.ssrLoadModule("/lib/changeling-kiths.ts");
kiths.replaceKithCatalog(JSON.parse(readFileSync(new URL("../public/data/changeling/kiths.json", import.meta.url), "utf8")),JSON.parse(readFileSync(new URL("../public/data/changeling/kiths-pt.json", import.meta.url), "utf8")));
const contracts = {
  CONTRACTS: ["h-courts","ctl-oak-ash-thorn","ctl-the-hedge","ctl-dark-eras","ctl-kith-and-kin","ctl-core"].flatMap((name) =>
    JSON.parse(readFileSync(new URL(`../public/data/changeling/contracts/${name}.json`, import.meta.url), "utf8")),
  ),
};

test("interpreta benefícios e requisitos nomeados linha a linha", () => {
  assert.deepEqual(homebrews.parseNamedText("Beast: dentes\nOgre: força"), {
    Beast: "dentes",
    Ogre: "força",
  });
});

test("filtra Méritos homebrew por linha e preserva os Core", () => {
  const catalog = {
    contracts: [],
    spells: [],
    merits: [
      { id: "core", line: "Core" },
      { id: "ctl", line: "CtL" },
      { id: "mta", line: "MtA" },
    ],
  };
  assert.deepEqual(
    homebrews.meritsForLine(catalog, "CtL").map((item) => item.id),
    ["core", "ctl"],
  );
});

test("combina toggle geral e individual sem perder preferências", () => {
  const catalog = { ...homebrews.EMPTY_HOMEBREWS, disabledIds: ["h-courts", "custom"] };
  assert.equal(homebrews.isHomebrewActive(catalog, "h-courts"), false);
  assert.equal(homebrews.isHomebrewActive(catalog, "outro"), true);
  assert.equal(homebrews.isHomebrewActive({ ...catalog, enabled: false }, "outro"), false);
  assert.equal(homebrews.isBuiltinHomebrew("h-seemings"), true);
  assert.equal(homebrews.isBuiltinHomebrew("ctl-2ed"), false);
});

test("Beyond the Hedge foi removido e escolhas de Court Goodwill usam Cortes canônicas", () => {
  assert.deepEqual(homebrews.BUILTIN_HOMEBREW_SOURCES.map((source) => source.id), ["h-courts", "h-seemings"]);
  assert.equal(meritConfigurations.findMeritConfiguration("Court Goodwill")?.fields[0]?.kind, "court");
  assert.equal(courts.courtCanonicalId("Primavera"), "spring");
  assert.equal(courts.courtCanonicalId("Spring Court"), "spring");
  assert.ok(courts.CTL_COURT_DEFINITIONS.some((court) => court.sourceId === "h-courts"));
});

test("Book of Seemings e Book of Courts expõem todo o conteúdo novo pelo toggle da fonte",()=>{
  assert.equal(kiths.KITHS.filter((item)=>item.sourceId==="h-seemings").length,12);
  assert.equal(entitlements.ENTITLEMENTS.filter((item)=>item.sourceId==="h-courts").length,8);
  assert.equal(entitlements.ENTITLEMENTS.filter((item)=>item.sourceId==="h-seemings").length,13);
  assert.equal(creationRules.CTL_SEEMINGS.Grimm.sourceId,"h-seemings");
  const coreContracts=contracts.CONTRACTS.filter((item)=>item.supplementalSeemingBenefits?.["h-seemings"]);
  assert.equal(coreContracts.length,60);
});

test("Cortes regionais oficiais preservam emoções e citações do índice offline", () => {
  const expected = {
    "society-morning": "Passion", "society-day": "Restraint", "society-night": "Satisfaction",
    "spring-lag": "Desire", "summer-lag": "Wrath", "autumn-lag": "Fear", "winter-lag": "Sorrow",
    "high-tide": "Dominance", "ebb-tide": "Mercy", "low-tide": "Vulnerability", "flood-tide": "Acceptance",
    coins: "Selfishness", barter: "Fairness", favors: "Honesty", "shady-deals": "Regret",
  };
  for (const [id, emotion] of Object.entries(expected)) {
    const court = courts.CTL_COURT_DEFINITIONS.find((entry) => entry.id === id);
    assert.equal(court?.emotion, emotion);
    assert.equal(court?.sourceId, "ctl-2ed");
    assert.equal(court?.source, "CTL 2e");
    assert.ok(court?.glamourTrigger);
  }
  assert.equal(courts.courtPageCitation(courts.CTL_COURT_DEFINITIONS.find((court) => court.id === "society-night")), "279, 280");
  assert.equal(courts.courtPageCitation(courts.CTL_COURT_DEFINITIONS.find((court) => court.id === "low-tide")), "287, 288");
  assert.equal(courts.courtPageCitation(courts.CTL_COURT_DEFINITIONS.find((court) => court.id === "barter")), "291, 292");
});

test("Regalias de Seeming são canônicas e liberam Contratos Reais", () => {
  assert.equal(creationRules.CTL_SEEMINGS.Fairest.regalia, "Crown");
  assert.equal(creationRules.CTL_SEEMINGS.Beast.regalia, "Steed");
  assert.equal(terms.systemTerm("Crown", "pt-BR"), "Coroa");
  assert.equal(terms.systemTerm("Coroa", "en-US"), "Crown");
  assert.equal(eligibility.canSelectInitialContract({type:"Real",regalia:"Crown"}, [creationRules.CTL_SEEMINGS.Fairest.regalia], ""), true);
});

test("distribuição de criação bloqueia pontos acima do orçamento ou máximo", () => {
  assert.equal(creationRules.canIncreaseCreationDots(4, 5, 4), true);
  assert.equal(creationRules.canIncreaseCreationDots(5, 5, 4), false);
  assert.equal(creationRules.canIncreaseCreationDots(4, 5, 5), false);
  assert.equal(creationRules.canIncreaseCreationDots(0, undefined, 1), false);
});

test("Gunslinger é um Estilo de Combate Core completo para ambas as linhas", () => {
  for (const line of ["CtL", "MtA"]) {
    const gunslinger = merits
      .getMeritsForLine(line)
      .find((item) => item.name === "Gunslinger");
    assert.equal(gunslinger?.line, "Core");
    assert.equal(gunslinger?.category, "Fighting");
    assert.deepEqual(gunslinger?.ratings, [1, 3, 5]);
  }
  assert.deepEqual(
    expanded.findExpandedMerit("Gunslinger").levels.map((item) => item.rating),
    [1, 3, 5],
  );
});
