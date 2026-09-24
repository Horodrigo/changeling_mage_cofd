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
const vampireRefunds = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
const mortalExperience = await vite.ssrLoadModule("/game-lines/mortal/experience-rules.ts");
const experienceShared = await vite.ssrLoadModule("/app/workspace/experience-shared.tsx");
const builderShared = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
const mageBuilder = await vite.ssrLoadModule("/game-lines/mage/builder.tsx");
const hubris = await vite.ssrLoadModule("/game-lines/mage/hubris.ts");
const mageCreation = await vite.ssrLoadModule("/game-lines/mage/creation-rules.ts");
const i18n = await vite.ssrLoadModule("/lib/i18n.tsx");
const resources = await vite.ssrLoadModule("/lib/resource-rules.ts");
const storage = await vite.ssrLoadModule("/lib/device-storage.ts");

test("organiza compras de Experiência nos quatro grupos sem alterar os tipos", () => {
  const groups = [
    { group: "core", purchases: ["Attribute", "Merit"] },
    { group: "supernatural", purchases: ["Gnosis"] },
    { group: "integrity", purchases: ["Wisdom"] },
    { group: "acquired", purchases: ["Rote"] },
  ];
  assert.deepEqual(experienceShared.groupedPurchaseOptions(groups, (value) => value, "pt-BR"), [
    { value: "Attribute", label: "Attribute", group: "Core" },
    { value: "Merit", label: "Merit", group: "Core" },
    { value: "Gnosis", label: "Gnosis", group: "Sobrenatural" },
    { value: "Wisdom", label: "Wisdom", group: "Integridade e Recuperação" },
    { value: "Rote", label: "Rote", group: "Poderes Adquiridos" },
  ]);
});

test("avanços da criação viram Experiência gasta sem exigir saldo prévio", () => {
  assert.deepEqual(experienceShared.experiencePurchaseBalances(0, 0, 0, 12, true), { available: 0, spent: 12, total: 12 });
  assert.deepEqual(experienceShared.experiencePurchaseBalances(3, 7, 10, 2, false), { available: 1, spent: 9, total: 10 });
  assert.deepEqual(experienceShared.experiencePurchaseBalances(0, 12, 12, 3, true), { available: 0, spent: 15, total: 15 });
});

test("o quinto Beat converte automaticamente em uma Experiência", () => {
  assert.deepEqual(experienceShared.convertFifthBeat(4, 2, 7), { beats: 4, available: 2, total: 7 });
  assert.deepEqual(experienceShared.convertFifthBeat(5, 2, 7), { beats: 0, available: 3, total: 8 });
});

test("o Builder preserva compras de vários pontos feitas em uma única transação", () => {
  const advanced = { current_state: {
    mage_experience_history: [
      { undo: { kind: "trait", group: "attributes", name: "Strength", amount: 3 } },
      { undo: { kind: "arcana", name: "Fate", amount: 2 } },
    ],
  } };
  assert.deepEqual(builderShared.experienceTraitDots(advanced, "attributes", "mage_experience_history"), { Strength: 3 });
  assert.deepEqual(mageBuilder.experienceArcanaDots(advanced), { Fate: 2 });
});

function sheet(key = "wyrd", creation = 1) {
  return { game_line: key === "wyrd" ? "CtL" : "MtA", attributes: { Strength: 1 }, skills: { Athletics: 0 },
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
      for (let remaining = order.length; remaining > 0; remaining--) copy.line_data = power.refundPowerRating(copy, key);
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
    {kind:"trait",group:"attributes",name:"Strength"},
    {kind:"trait",group:"skills",name:"Athletics"},
    {kind:"arcana",name:"Fate"}, {kind:"wisdom"},
  ];
  for (const undo of undos) for (const order of permutations) {
    const current = sheet("gnosis");
    current.attributes.Strength = 4; current.skills.Athletics = 3;
    current.line_data.arcana.Fate = 3; current.line_data.wisdom = 10;
    current.line_data.gnosis = 5;
    for (let remaining = order.length; remaining > 0; remaining--) refunds.refundMageAdvancement(current, undo);
    assert.equal(current.line_data.gnosis, 5);
    if (undo.kind === "trait") assert.equal(current[undo.group][undo.name], undo.group === "attributes" ? 1 : 0);
    if (undo.kind === "arcana") assert.equal(current.line_data.arcana.Fate, 0);
    if (undo.kind === "wisdom") assert.equal(current.line_data.wisdom, 7);
  }
});

test("Vampiro reembolsa compras fora de ordem sem apagar avanços posteriores", () => {
  const undos = [
    {kind:"trait",group:"attributes",name:"Strength"},
    {kind:"trait",group:"skills",name:"Athletics"},
    {kind:"specialty",skill:"Athletics",name:"Corrida"},
    {kind:"merit",name:"Resources",dots:2,index:0},
    {kind:"discipline",name:"Vigor"},
    {kind:"bloodPotency"}, {kind:"humanity"}, {kind:"willpower"},
    {kind:"devotion",id:"devotion-1"},
    {kind:"cruac",id:"rite-1",humanityLost:0},
    {kind:"theban",id:"miracle-1"},
    {kind:"ritual",key:"cruac_rite_ids",id:"rite-2"},
    {kind:"coil",id:"coil-1"}, {kind:"scale",id:"scale-1"},
  ];
  for (const order of [undos, [...undos].reverse()]) {
    const current = {
      attributes:{Strength:2}, skills:{Athletics:1}, specializations:[{skill:"Athletics",name:"Corrida"}],
      merits:[{name:"Resources",dots:3,creationDots:1,experienceDots:2}],
      line_data:{disciplines:{Vigor:1},blood_potency:2,humanity:8,devotion_ids:["devotion-1"],blood_sorcery:{cruac_rating:1,cruac_rite_ids:["rite-1","rite-2"],theban_rating:1,theban_miracle_ids:["miracle-1"]},ordo_dracul:{coil_ratings:{"coil-1":1},scale_ids:["scale-1"]}},
      current_state:{willpower_lost_dots:0},
    };
    for (const undo of order) vampireRefunds.refundVampireAdvancement(current, undo);
    assert.deepEqual([current.attributes.Strength,current.skills.Athletics,current.specializations.length,current.merits[0].dots],[1,0,0,1]);
    assert.deepEqual([current.line_data.disciplines.Vigor,current.line_data.blood_potency,current.line_data.humanity,current.current_state.willpower_lost_dots],[0,1,7,1]);
    assert.deepEqual([current.line_data.devotion_ids,current.line_data.blood_sorcery.cruac_rite_ids,current.line_data.blood_sorcery.theban_miracle_ids,current.line_data.ordo_dracul.scale_ids],[[],[],[],[]]);
    assert.deepEqual([current.line_data.blood_sorcery.cruac_rating,current.line_data.blood_sorcery.theban_rating,current.line_data.ordo_dracul.coil_ratings["coil-1"]],[0,0,0]);
  }
  const humanity = {attributes:{},skills:{},specializations:[],merits:[],line_data:{humanity:9,blood_sorcery:{cruac_rating:1,cruac_rite_ids:["rite"]}},current_state:{}};
  vampireRefunds.refundVampireAdvancement(humanity,{kind:"cruac",id:"rite",humanityLost:1});
  assert.equal(humanity.line_data.humanity,10);
});

test("Mortal reembolsa somente o delta de cada compra", () => {
  const current = {
    attributes: { Strength: 4 }, skills: { Athletics: 3 },
    specializations: [{ skill: "Athletics", name: "Corrida" }],
    merits: [{ name: "Resources", instanceId: "resources", dots: 4, creationDots: 2, experienceDots: 2 }],
    line_data: { integrity: 9 }, current_state: {},
  };
  for (const undo of [
    { kind: "integrity", amount: 2 },
    { kind: "merit", name: "Resources", dots: 2, instanceId: "resources" },
    { kind: "specialty", skill: "Athletics", name: "Corrida" },
    { kind: "trait", group: "skills", name: "Athletics", amount: 3 },
    { kind: "trait", group: "attributes", name: "Strength", amount: 3 },
  ]) mortalExperience.refundMortalAdvancement(current, undo);
  assert.deepEqual([current.attributes.Strength, current.skills.Athletics, current.specializations.length, current.merits[0].dots, current.line_data.integrity], [1, 0, 0, 2, 7]);
});

test("compras X→Y somam custos por ponto e reembolsam o delta completo", () => {
  assert.equal(experienceShared.ratingPurchaseCost(2, 5, 4), 12);
  assert.equal(experienceShared.ratingPurchaseCost(3, 6, (rating) => rating <= 4 ? 4 : 5), 14);

  const mage = sheet("gnosis");
  mage.attributes.Strength = 5;
  mage.line_data.arcana.Fate = 4;
  refunds.refundMageAdvancement(mage, {kind:"trait",group:"attributes",name:"Strength",amount:3});
  refunds.refundMageAdvancement(mage, {kind:"arcana",name:"Fate",amount:3});
  assert.deepEqual([mage.attributes.Strength,mage.line_data.arcana.Fate],[2,1]);

  const vampire = {attributes:{Strength:5},skills:{},specializations:[],merits:[],line_data:{humanity:6,blood_sorcery:{cruac_rating:4,cruac_rite_ids:["one","two","three"]}},current_state:{}};
  vampireRefunds.refundVampireAdvancement(vampire,{kind:"trait",group:"attributes",name:"Strength",amount:3});
  vampireRefunds.refundVampireAdvancement(vampire,{kind:"cruac",ids:["two","three"],amount:2,humanityLost:1});
  assert.deepEqual([vampire.attributes.Strength,vampire.line_data.blood_sorcery.cruac_rating,vampire.line_data.blood_sorcery.cruac_rite_ids,vampire.line_data.humanity],[2,2,["one"],7]);

  vampireRefunds.refundVampireAdvancement(vampire,{kind:"humanityLoss",amount:1});
  assert.equal(vampire.line_data.humanity,8);
});

test("Acts of Hubris usa o tier do ato e aplica os três modificadores cumulativos", () => {
  assert.deepEqual(hubris.availableHubrisTiers(7).map((tier) => tier.id), ["understanding","falling"]);
  assert.deepEqual([10, 7, 3, 0].map(hubris.wisdomState), ["Enlightened", "Understanding", "Falling", "Mad"]);
  const falling = hubris.HUBRIS_TIERS.find((tier) => tier.id === "falling");
  assert.equal(hubris.hubrisPool(falling,{obsession:true,virtue:true,vice:true}),0);
  assert.equal(hubris.hubrisPool(falling,{obsession:false,virtue:true,vice:false}),2);
});

test("resumo de Gnosis informa os valores oficiais de conjuração", () => {
  const t = (locale) => (key, params) => i18n.translate(locale, key, params);
  assert.equal(mageCreation.mageGnosisSummary(1, t("en-US")), "Ritual interval: 3 hours · Combined spells: 1 · Paradox per over-Reach: 1 die");
  assert.equal(mageCreation.mageGnosisSummary(9, t("pt-BR")), "Intervalo ritual: 1 minuto (20 turnos) · Magias combinadas: 4 · Paradoxo por Reach excedente: 5 dados");
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
  assert.equal(sheet.line_data.merit_granted_skill_bonuses.Occult,1);
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

test("edição preserva XP de Méritos automáticos quando o grant inicial é recriado", () => {
  const existing = [{name:"Kindred Status",instanceId:"old",dots:3,creationDots:1,experienceDots:2,configuration:{group:"Circle of the Crone"},grantedBy:"Vampire Template"}];
  const edited = [{name:"Kindred Status",instanceId:"new",dots:1,configuration:{group:"Daeva"},grantedBy:"Vampire Template"}];
  assert.deepEqual(merits.mergeCreationMerits(existing,edited),[
    {name:"Kindred Status",instanceId:"new",dots:3,creationDots:1,experienceDots:2,configuration:{group:"Daeva"},grantedBy:"Vampire Template"},
  ]);
});

test("Lucidez permanente é gratuita, persistente e remove a última caixa em qualquer ordem", () => {
  for (const order of permutations) {
    const current = sheet();
    for (let i=0;i<3;i++) current.current_state = resources.changePermanentClarity(current.current_state, 1);
    current.current_state = JSON.parse(JSON.stringify(current.current_state));
    current.current_state.clarity_damage = ["severe","severe","mild","mild","mild","mild","mild"];
    for (let remaining = order.length; remaining > 0; remaining--) {
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
      request.result = { close() {}, transaction() {
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
