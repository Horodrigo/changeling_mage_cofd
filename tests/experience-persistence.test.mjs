import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
const power = await vite.ssrLoadModule("/lib/power-progression.ts");
const merits = await vite.ssrLoadModule("/lib/merit-progression.ts");
const changelingMeritConfigurations = await vite.ssrLoadModule("/game-lines/changeling/sheet-merit-configurations.ts");
const mageMeritConfigurations = await vite.ssrLoadModule("/game-lines/mage/sheet-merit-configurations.ts");
const refunds = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const resources = await vite.ssrLoadModule("/lib/resource-rules.ts");
const storage = await vite.ssrLoadModule("/lib/device-storage.ts");

function sheet(key = "wyrd", creation = 1) {
  return { game_line: key === "wyrd" ? "CtL" : "MtA", attributes: { Força: 1 }, skills: { Atletismo: 0 },
    merits: [{ name: "Resources", dots: 10, creationDots: 10, experienceDots: 0 }], specializations: [], derived: { LucidezMaxima: 4 },
    line_data: { [key]: creation, arcana: { Fate: 0 }, wisdom: 7 },
    current_state: { experience_available: 20, clarity_damage: ["severe", "mild"] } };
}
const permutations = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];

for (const key of ["wyrd", "gnosis"]) for (const creation of [1,2,3]) {
  test(`${key}: mantém avanços além da criação ${creation} ao salvar/reabrir`, () => {
    let current = sheet(key, creation);
    for (let i = 0; i < 3; i++) current.line_data = power.withPowerRating(current, key, current.line_data[key] + 1);
    current = JSON.parse(JSON.stringify(current));
    const progression = power.powerProgression(current, key);
    assert.equal(progression.creation + progression.advancement, creation + 3);
    for (const order of permutations) {
      const copy = structuredClone(current);
      for (const _ of order) copy.line_data = power.refundPowerRating(copy, key);
      assert.equal(copy.line_data[key], creation);
    }
  });
}

test("reconhece os avanços antigos pelo histórico, sem cobrar Méritos outra vez", () => {
  const ctl = sheet(); ctl.line_data.wyrd = 3;
  ctl.current_state.experience_history = [{undo:{kind:"wyrd",previous:2}},{undo:{kind:"wyrd",previous:1}}];
  assert.deepEqual(power.powerProgression(ctl, "wyrd"), {creation:1,advancement:2,current:3});
  const mage = sheet("gnosis"); mage.line_data.gnosis = 3;
  mage.current_state.mage_experience_history = [
    {description:"Gnose 3",before:{line_data:{gnosis:2}}},
    {description:"Gnose 2",before:{line_data:{gnosis:1}}}];
  assert.deepEqual(power.powerProgression(mage, "gnosis"), {creation:1,advancement:2,current:3});
});

test("reembolsa pontos em qualquer ordem sem restaurar snapshots de outras compras", () => {
  const undos = [
    {kind:"trait",group:"attributes",name:"Força"},
    {kind:"trait",group:"skills",name:"Atletismo"},
    {kind:"arcana",name:"Fate"}, {kind:"wisdom"},
  ];
  for (const undo of undos) for (const order of permutations) {
    const current = sheet("gnosis");
    current.attributes.Força = 4; current.skills.Atletismo = 3;
    current.line_data.arcana.Fate = 3; current.line_data.wisdom = 10;
    current.line_data.gnosis = 5;
    for (const _ of order) refunds.refundMageAdvancement(current, undo);
    assert.equal(current.line_data.gnosis, 5);
    if (undo.kind === "trait") assert.equal(current[undo.group][undo.name], undo.group === "attributes" ? 1 : 0);
    if (undo.kind === "arcana") assert.equal(current.line_data.arcana.Fate, 0);
    if (undo.kind === "wisdom") assert.equal(current.line_data.wisdom, 7);
  }
});

test("Méritos reembolsam apenas pontos pagos e preservam instâncias repetidas", () => {
  for (const order of permutations) {
    const current = sheet(); current.merits = [
      {name:"Allies",instanceId:"first",dots:4,creationDots:0,experienceDots:4}, {name:"Allies",instanceId:"second",dots:2,creationDots:2,experienceDots:0}];
    for (const index of order) refunds.refundMeritDots(current, "Allies", [2,1,1][index], "first");
    assert.deepEqual(current.merits, [{name:"Allies",instanceId:"second",dots:2,creationDots:2,experienceDots:0}]);
  }
});

test("Mantle gratuito mantém o ponto inicial ao comprar, sincronizar e reembolsar Experiência", () => {
  const current = sheet();
  current.line_data.court = "Autumn";
  current.merits = [{name:"Mantle",instanceId:"mantle-autumn",dots:1,grantedBy:"Corte",configuration:{court:"Autumn"}}];
  merits.addExperienceMeritDots(current.merits[0], 3);
  changelingMeritConfigurations.synchronizeMeritGrants(current);
  assert.deepEqual(
    {dots:current.merits[0].dots,creation:current.merits[0].creationDots,experience:current.merits[0].experienceDots},
    {dots:4,creation:1,experience:3},
  );
  merits.addExperienceMeritDots(current.merits[0], 1);
  changelingMeritConfigurations.synchronizeMeritGrants(current);
  assert.equal(current.merits[0].dots, 5);
  refunds.refundMeritDots(current, "Mantle", 4, "mantle-autumn");
  changelingMeritConfigurations.synchronizeMeritGrants(current);
  assert.deepEqual(
    {dots:current.merits[0].dots,creation:current.merits[0].creationDots,experience:current.merits[0].experienceDots},
    {dots:1,creation:1,experience:0},
  );
});

test("outros Méritos gratuitos preservam o ponto inicial durante avanços", () => {
  for (const [name, grantedBy] of [["Awakened Status","Ordem"],["Mystery Cult Initiation","Nameless Order"]]) {
    const merit = {name,dots:1,grantedBy};
    merits.addExperienceMeritDots(merit, 3);
    assert.deepEqual(
      {dots:merit.dots,creation:merit.creationDots,experience:merit.experienceDots},
      {dots:4,creation:1,experience:3},
    );
    merits.removeExperienceMeritDots(merit, 3);
    assert.equal(merit.dots, 1);
  }
});

test("Nameless Order applies its fixed Mystery Cult progression at the correct dots", () => {
  const sheet = {
    game_line:"MtA",
    line_data:{order:"Nameless",custom_order:{name:"The Unnamed"}},
    merits:[{
      name:"Mystery Cult Initiation",
      dots:1,
      grantedBy:"Nameless Order",
      configuration:{cult:"The Unnamed",level_1_type:"merit",level_1_merits:["High Speech|1"]},
    }],
    specializations:[],
  };
  mageMeritConfigurations.synchronizeMeritGrants(sheet);
  const speech = sheet.merits.find((item)=>item.name==="High Speech");
  assert.equal(speech?.dots,1);
  assert.match(String(speech?.grantedBy),/^Merit:Mystery Cult Initiation:/);
  assert.deepEqual(sheet.line_data.rote_skills,[]);
  assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses,{});

  const initiation=sheet.merits.find((item)=>item.name==="Mystery Cult Initiation");
  initiation.dots=2;
  initiation.configuration.level_2_rote_skills=["Academics","Occult","Science"];
  mageMeritConfigurations.synchronizeMeritGrants(sheet);
  assert.deepEqual(sheet.line_data.rote_skills,["Academics","Occult","Science"]);
  assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses,{});

  const advancedInitiation=sheet.merits.find((item)=>item.name==="Mystery Cult Initiation");
  advancedInitiation.dots=3;
  mageMeritConfigurations.synchronizeMeritGrants(sheet);
  assert.equal(sheet.line_data.merit_granted_skill_bonuses.Ocultismo,1);
  assert.deepEqual(
    mageMeritConfigurations.expandedConfigurationLines("Mystery Cult Initiation",3,advancedInitiation.configuration,"en-US"),
    ["Cult: The Unnamed","Dot 1: High Speech •","Dot 2: Rote Skills: Academics, Occult, Science","Dot 3: Occult +1"],
  );
});

test("edição preserva Méritos de Experiência e substitui apenas a base de criação", () => {
  const existing = [
    {name:"Allies",instanceId:"creation",dots:4,creationDots:2,experienceDots:2,configuration:{group:"Police"}},
    {name:"Contacts",instanceId:"xp",dots:2,creationDots:0,experienceDots:2},
  ];
  const edited = [{name:"Allies",instanceId:"creation",dots:1,configuration:{group:"Media"}}];
  assert.deepEqual(merits.mergeCreationMerits(existing,edited),[
    {name:"Contacts",instanceId:"xp",dots:2,creationDots:0,experienceDots:2},
    {name:"Allies",instanceId:"creation",dots:3,creationDots:1,experienceDots:2,configuration:{group:"Media"}},
  ]);
});

test("Lucidez permanente é gratuita, persistente e remove a última caixa em qualquer ordem", () => {
  for (const order of permutations) {
    const current = sheet();
    for (let i=0;i<3;i++) current.current_state = resources.changePermanentClarity(current.current_state, 1);
    current.current_state = JSON.parse(JSON.stringify(current.current_state));
    current.current_state.clarity_damage = ["severe","severe","mild","mild","mild","mild","mild"];
    for (const _ of order) {
      current.current_state = resources.changePermanentClarity(current.current_state, -1);
      current.current_state.clarity_damage = resources.normalizeClarityDamage(current.current_state.clarity_damage, 4 + resources.permanentClarityBonus(current.current_state));
    }
    assert.equal(current.current_state.clarity_bonus, 0);
    assert.equal(current.current_state.experience_available, 20);
    assert.deepEqual(current.current_state.clarity_damage, ["severe","severe","mild","mild"]);
  }
});

test("salvamento aguarda commit, mantém ordem e recupera gravação interrompida", async () => {
  const values = new Map(); const disk = new Map(); const transactions = [];
  globalThis.localStorage = { getItem:k=>values.get(k)??null, setItem:(k,v)=>values.set(k,v), removeItem:k=>values.delete(k) };
  globalThis.indexedDB = { open() {
    const request = {};
    queueMicrotask(() => {
      request.result = { close() {}, transaction(_store,mode) {
        const tx = { objectStore() { return {
          put(value,key) { const req={result:key}; transactions.push(()=>{disk.set(key,structuredClone(value)); tx.oncomplete();}); return req; },
          get(key) { const req={result:disk.get(key)}; queueMicrotask(()=>tx.oncomplete()); return req; }
        }; }};
        return tx;
      }};
      request.onsuccess();
    });
    return request;
  }};
  const tick = () => new Promise(resolve => setImmediate(resolve));
  try {
    let completed = false;
    const first = storage.setDeviceValue("sheet", {wyrd:2}).then(()=>{completed=true;});
    const second = storage.setDeviceValue("sheet", {wyrd:3});
    await tick(); assert.equal(completed,false); assert.equal(transactions.length,1);
    transactions.shift()(); await tick(); assert.equal(completed,true);
    transactions.shift()(); await Promise.all([first,second]);
    assert.deepEqual(await storage.getDeviceValue("sheet"), {wyrd:3});
    values.set("sheet:pending-write", JSON.stringify({wyrd:4}));
    const recovered = storage.getDeviceValue("sheet"); await tick(); transactions.shift()();
    assert.deepEqual(await recovered, {wyrd:4});
    assert.deepEqual(disk.get("sheet"), {wyrd:4});
  } finally { delete globalThis.localStorage; delete globalThis.indexedDB; }
});
