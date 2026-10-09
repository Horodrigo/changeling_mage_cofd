import assert from "node:assert/strict";
import test,{after} from "node:test";
import {fileURLToPath} from "node:url";
import {readFile} from "node:fs/promises";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},resolve:{alias:{"@":root}}});
after(()=>vite.close());
const {normalizeStoredSheet,validateCurrentCharacter}=await vite.ssrLoadModule("/lib/character-persistence.ts");
const {creationMerits}=await vite.ssrLoadModule("/lib/merit-progression.ts");
const {normalizeGameLineCharacter}=await vite.ssrLoadModule("/game-lines/registry/game-line-registry.ts");
const {isCurrentStoredCharacter,summarizeStoredCharacter}=await vite.ssrLoadModule("/lib/stored-character.ts");
const {mortalBreakingPointPool,mortalIntegrityModifier}=await vite.ssrLoadModule("/game-lines/mortal/creation-rules.ts");
const {clarityAttackPool}=await vite.ssrLoadModule("/game-lines/changeling/clarity.ts");

const sheet=(game_line="MtA")=>({id:"sheet",schema_version:2,system:"chronicles-of-darkness",game_line,ruleset:{id:"current",version:1},character:{name:"Test",concept:"",player:"Player"},attributes:{Strength:2},skills:{Occult:3},specializations:[],merits:[{name:"Allies",dots:2}],line_data:{},derived:{},current_state:{},created_at:"2026-01-01",updated_at:"2026-01-01"});

test("current schema normalization preserves character data",()=>{
  const normalized=normalizeStoredSheet(sheet());
  assert.equal(normalized.character.name,"Test");assert.equal(normalized.skills.Occult,3);
});

test("schema-2 PT Attribute and Skill aliases normalize to English, with existing English values authoritative", async t => {
  t.mock.method(globalThis, "fetch", async path => {
    assert.match(String(path), /^\/(shared|game-lines)\//);
    return new Response(await readFile(new URL(`../public${path}`, import.meta.url), "utf8"));
  });
  const attributes = { Inteligência: 2, Raciocínio: 2, Perseverança: 2, Força: 2, Destreza: 3, Vigor: 3, Presença: 2, Manipulação: 2, Compostura: 3,
    Intelligence: 1, Wits: 2, Resolve: 3, Strength: 3, Dexterity: 2, Stamina: 3, Presence: 3, Manipulation: 3, Composure: 2 };
  const expected = { Intelligence: 1, Wits: 2, Resolve: 3, Strength: 3, Dexterity: 2, Stamina: 3, Presence: 3, Manipulation: 3, Composure: 2 };
  const keys = { CofD: "mortal_experience_history", MtA: "mage_experience_history", CtL: "experience_history", VtR: "vampire_experience_history", WtF: "werewolf_experience_history" };
  for (const [line, key] of Object.entries(keys)) {
    const current = sheet(line);
    current.attributes = { ...attributes };
    current.skills = { Política: 4, Politics: 2, Melee: 3, "Armas Brancas": 2, Weaponry: 1, "Empatia com Animais": 2 };
    current.specializations = [{ skill: "Armas Brancas", name: "Inteligência", grantedBy: "Autoral" }];
    current.character.name = "Força";
    current.merits = [{ definitionId: "homebrew:authored", instanceId: "authored", name: "Força", dots: 1, configuration: { notes: "Não traduzir" } }];
    current.current_state = { experience_available: 8, experience_spent: 4, experience_total: 12, [key]: [
      { id: "paid", cost: 4, label: "Texto histórico", undo: { kind: "trait", group: "attributes", name: "Força", amount: 1 }, purchase: { kind: "trait", group: "attributes", name: "Força", target: 3 } },
      { id: "specialty", cost: 1, undo: { kind: "specialty", skill: "Armas Brancas", name: "Inteligência" } },
      { id: "opaque", description: "Força", before: { attributes: { Força: 2 } } },
    ] };
    const before = structuredClone(current);
    const normalized = await normalizeGameLineCharacter(normalizeStoredSheet(current));
    assert.deepEqual(normalized.attributes, expected, line);
    assert.deepEqual(normalized.skills, { Politics: 2, Weaponry: 1, "Animal Ken": 2 }, line);
    assert.equal(normalized.character.name, "Força");
    assert.equal(normalized.merits.find(item => item.instanceId === "authored").name, "Força");
    assert.deepEqual(normalized.specializations[0], { skill: "Weaponry", name: "Inteligência", grantedBy: "Autoral" });
    const history = normalized.current_state[key];
    assert.deepEqual(history[0], { ...before.current_state[key][0], undo: { ...before.current_state[key][0].undo, name: "Strength" }, purchase: { ...before.current_state[key][0].purchase, name: "Strength" } });
    assert.equal(history[1].undo.skill, "Weaponry");
    assert.equal(history[1].undo.name, "Inteligência");
    assert.deepEqual(history[2], before.current_state[key][2], "Opaque historical snapshots are never replayed or rewritten");
    for (const balance of ["experience_available", "experience_spent", "experience_total"]) assert.equal(normalized.current_state[balance], before.current_state[balance]);
    const reopened = await normalizeGameLineCharacter(normalizeStoredSheet(JSON.parse(JSON.stringify(normalized))));
    assert.deepEqual(reopened.attributes, normalized.attributes);
    assert.deepEqual(reopened.current_state[key], history);
    const { experienceTraitDots } = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
    assert.deepEqual(experienceTraitDots(reopened, "attributes", key), { Strength: 1 }, "Reediting subtracts the canonical paid dot only once");
    if (["CofD", "MtA", "VtR"].includes(line)) {
      const [path, name] = { CofD: ["mortal/experience-rules", "refundMortalAdvancement"], MtA: ["mage/experience-refunds", "refundMageAdvancement"], VtR: ["vampire/experience-refunds", "refundVampireAdvancement"] }[line];
      const refund = (await vite.ssrLoadModule(`/game-lines/${path}.ts`))[name];
      const refunded = structuredClone(reopened);
      assert.equal(refund(refunded, history[0].undo), true);
      assert.equal(refunded.attributes.Strength, 2);
      assert.equal(Object.hasOwn(refunded.attributes, "Força"), false);
      assert.deepEqual(refunded.current_state[key], history, "Refund helpers do not rewrite receipts");
    }
    assert.deepEqual(current, before, "Normalization never mutates its source");
  }
  const onlyPortuguese = sheet();
  onlyPortuguese.attributes = { Força: 4, Vigor: 0 };
  onlyPortuguese.skills = { Ocultismo: 3 };
  const normalized = normalizeStoredSheet(onlyPortuguese);
  assert.deepEqual(normalized.attributes, { Strength: 4, Stamina: 0 }, "Missing English keys inherit the stored value, never a default");
  assert.deepEqual(normalized.skills, { Occult: 3 });
});

test("canonical Skill reconciliation does not count as an authored Specialty edit or remove its linked Merit", async () => {
  const { reconcileSpecialtyMerits } = await vite.ssrLoadModule("/lib/core/character/specialty-merits.ts");
  const merit = { definitionId: "core-2ed:interdisciplinary-specialty", name: "Interdisciplinary Specialty", sourceId: "core-2ed", instanceId: "paid-link", dots: 1, experienceDots: 1, configuration: { specialty_skill: "Armas Brancas", specialty_name: "Nome autoral" } };
  const old = [{ skill: "Armas Brancas", name: "Nome autoral" }];
  const canonical = [{ skill: "Weaponry", name: "Nome autoral" }];
  const result = reconcileSpecialtyMerits([merit], old, [merit], canonical);
  assert.deepEqual(result.removed, []);
  assert.deepEqual(result.merits, [merit]);
  assert.equal(reconcileSpecialtyMerits([merit], old, [merit], [{ ...canonical[0], name: "Alterado" }]).removed.length, 1, "An actual authored edit still removes the linked instance");
});
test("validation rejects old schemas without attempting migration",()=>{
  assert.equal(validateCurrentCharacter({...sheet(),schema_version:1}),"unsupported-schema");
  assert.equal(validateCurrentCharacter({schema_version:2,system:"chronicles-of-darkness",game_line:"VtR"}),"invalid-character");
  assert.equal(validateCurrentCharacter(sheet()),"valid");
});
test("legacy local records stay opaque but retain enough metadata for deletion",()=>{
  const legacy={id:"old-sheet",schema_version:1,game_line:"MtA",character:{name:"Old mage",concept:""}};
  assert.equal(isCurrentStoredCharacter(legacy),false);
  assert.deepEqual(summarizeStoredCharacter(legacy),{
    name:"Old mage",concept:"",gameLine:"MtA",updatedAt:"",isCurrent:false,
  });
  assert.equal(summarizeStoredCharacter({id:"unknown"}).name,"Ficha sem nome");
});
test("structural persistence normalization assigns stable merit instance IDs",()=>{
  const current=sheet();delete current.merits[0].instanceId;
  assert.match(normalizeStoredSheet(current).merits[0].instanceId,/^legacy-merit-0-allies$/);
});

test("structural persistence preserves authored Merit labels in every line, even Throne", () => {
  for (const line of ["CofD", "CtL", "MtA", "VtR", "WtF"]) {
    const current = sheet(line);
    current.merits = [{ definitionId: "homebrew:merit:throne", instanceId: "my-throne", name: "Throne", sourceId: "homebrew:core-merits", dots: 3, creationDots: 1, experienceDots: 2, configuration: { notes: "Autoral" } }];
    const before = structuredClone(current);
    const normalized = normalizeStoredSheet(current);
    assert.equal(normalized.merits[0].name, "Throne");
    assert.deepEqual([normalized.merits[0].definitionId, normalized.merits[0].instanceId, normalized.merits[0].experienceDots, normalized.merits[0].configuration], ["homebrew:merit:throne", "my-throne", 2, { notes: "Autoral" }]);
    assert.deepEqual(current, before);
  }
});

test("Changeling alone recovers the exact ID-less distributed Throne identity without renaming or touching allocations/history", async () => {
  const current = sheet("CtL");
  const legacy = { name: "Throne", sourceId: "h-seemings", instanceId: "legacy-throne", dots: 3, creationDots: 1, experienceDots: 2, configuration: { notes: "Autoral" } };
  current.current_state.experience_history = [{ id: "opaque", description: "Throne", experience: -2 }];
  current.merits = [legacy, { ...legacy, instanceId: "explicit", definitionId: "unavailable:throne" }, { ...legacy, instanceId: "homebrew", sourceId: "homebrew:changeling-merits" }, { ...legacy, instanceId: "missing-source", sourceId: undefined }];
  const before = structuredClone(current);
  const normalized = await normalizeGameLineCharacter(normalizeStoredSheet(current));
  assert.equal(normalized.merits[0].definitionId, "h-seemings:power-behind-the-throne");
  const catalog = JSON.parse(await readFile(new URL("../public/game-lines/changeling/data/merits.json", import.meta.url), "utf8"));
  assert.deepEqual(catalog.filter(item => item.id === normalized.merits[0].definitionId).map(item => [item.name, item.sourceId]), [["Power Behind the Throne", "h-seemings"]]);
  assert.equal(normalized.merits[0].name, "Throne");
  assert.deepEqual([normalized.merits[0].creationDots, normalized.merits[0].experienceDots, normalized.merits[0].instanceId], [1, 2, legacy.instanceId]);
  assert.equal(normalized.merits[1].definitionId, "unavailable:throne");
  assert.equal(normalized.merits[2].definitionId, undefined);
  assert.equal(normalized.merits[3].definitionId, undefined);
  assert.deepEqual(normalized.current_state, current.current_state);
  assert.deepEqual(current, before);
  for (const line of ["CofD", "MtA", "VtR"]) {
    const other = await normalizeGameLineCharacter(normalizeStoredSheet({ ...sheet(line), merits: [legacy] }));
    assert.equal(other.merits[0].definitionId, undefined, line);
    assert.equal(other.merits[0].name, "Throne", line);
  }
});
test("creation merits survive save normalization and remain editable",()=>{
  for(const game_line of ["CofD","CtL","MtA","VtR"]){
    const current=sheet(game_line);current.merits[0]={...current.merits[0],creationDots:2,experienceDots:0};
    const normalized=normalizeStoredSheet(current);
    assert.deepEqual([normalized.merits[0].creationDots,normalized.merits[0].experienceDots],[2,0]);
    assert.equal(creationMerits(normalized.merits).length,1);
  }
  assert.equal(creationMerits(sheet().merits).length,1,"current-schema merits saved before allocation metadata must remain recoverable");
});
test("Changeling-owned normalization preserves structural persistence boundaries",async()=>{
  const current={...sheet("CtL"),line_data:{wyrd:2,frailties:[]}};
  const normalized=await normalizeGameLineCharacter(normalizeStoredSheet(current));
  assert.ok(Array.isArray(normalized.line_data.frailties));
});
test("Mortal normalization owns Integrity, Breaking Points, and derived traits",async()=>{
  const current={...sheet("CofD"),attributes:{Strength:2,Dexterity:3,Stamina:4,Wits:2,Resolve:3,Composure:2},skills:{Athletics:2},line_data:{integrity:0,breaking_points:["one"]}};
  const normalized=await normalizeGameLineCharacter(normalizeStoredSheet(current));
  assert.equal(normalized.line_data.integrity,0);
  assert.equal(normalized.line_data.breaking_points.length,5);
  assert.equal(normalized.line_data.aspirations.length,3);
  assert.deepEqual(
    [normalized.derived.Vitalidade,normalized.derived.Deslocamento,normalized.derived.ForçaDeVontade,normalized.derived.Iniciativa,normalized.derived.Defesa,normalized.derived.Integridade],
    [9,10,5,5,4,0],
  );
});
test("Mortal Breaking Point pools apply Integrity bands and cap circumstances",()=>{
  assert.deepEqual([10,8,7,6,5,4,3,2,1,0].map(mortalIntegrityModifier),[2,2,1,1,0,0,-1,-1,-2,-2]);
  assert.equal(mortalBreakingPointPool(3,2,7,99,true),12);
  assert.equal(mortalBreakingPointPool(1,1,1,-99,false),-5);
});
test("Changeling Clarity attacks add cumulative modifiers without rolling",()=>{
  assert.equal(clarityAttackPool(3,[3,-1,-2]),3);
  assert.equal(clarityAttackPool(99,[]),5);
});
test("current sheets apply only the selected line's merit synchronization",async()=>{
  const mage=await normalizeGameLineCharacter(normalizeStoredSheet({...sheet("MtA"),line_data:{order:"Orderless"}}));
  const changeling=await normalizeGameLineCharacter(normalizeStoredSheet({...sheet("CtL"),line_data:{court:"Spring"}}));
  assert.equal(mage.merits.some((merit)=>merit.name==="Mantle"),false);
  assert.equal(changeling.merits.some((merit)=>merit.name==="Mantle"&&merit.grantedBy==="Corte"),true);
});
