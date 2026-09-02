import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
const power = await vite.ssrLoadModule("/lib/power-progression.ts");
const refunds = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const resources = await vite.ssrLoadModule("/lib/resource-rules.ts");
const storage = await vite.ssrLoadModule("/lib/device-storage.ts");

function sheet(key = "wyrd", creation = 1) {
  return { game_line: key === "wyrd" ? "CtL" : "MtA", attributes: { Força: 1 }, skills: { Atletismo: 0 },
    merits: [{ name: "Resources", dots: 10 }], specializations: [], derived: { LucidezMaxima: 4 },
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
    const allowance = power.creationMeritAllowance(current, key);
    const cap = Math.min(3, 1 + Math.floor((allowance - 10) / 5));
    assert.equal(Math.min(progression.creation, cap) + progression.advancement, creation + 3);
    assert.equal(allowance - (progression.creation - 1) * 5, 10);
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
      {name:"Allies",instanceId:"first",dots:4}, {name:"Allies",instanceId:"second",dots:2}];
    for (const index of order) refunds.refundMeritDots(current, "Allies", [2,1,1][index], "first");
    assert.deepEqual(current.merits, [{name:"Allies",instanceId:"second",dots:2}]);
  }
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
