import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false} });
after(() => vite.close());
const { SPELLS } = await vite.ssrLoadModule("/lib/spells.ts");

const arcana = new Set(["Death","Fate","Forces","Life","Matter","Mind","Prime","Space","Spirit","Time"]);
const skills = new Set(["Academics","Computer","Crafts","Investigation","Medicine","Occult","Politics","Science","Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry","Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge"]);

test("offline Mage spell catalog has all 360 rows and stable unique IDs", () => {
  assert.equal(SPELLS.length,360);
  assert.equal(new Set(SPELLS.map((spell)=>spell.id)).size,360);
  assert.deepEqual(
    Object.fromEntries(Object.entries(Object.groupBy(SPELLS,(spell)=>spell.source)).map(([book,records])=>[book,records.length])),
    {"Mage the Awakening":296,"Signs of Sorcery":61,"Dark Eras 2":3},
  );
});

test("spell records are complete and English-first", () => {
  for (const spell of SPELLS) {
    assert.equal(spell.name,spell.originalName,spell.id);
    assert.ok(spell.description.trim(),spell.id);
    assert.ok(spell.practice.trim(),spell.id);
    assert.ok(spell.primaryFactor.trim(),spell.id);
    assert.ok(spell.page>0,spell.id);
    assert.ok(spell.roteSkills.length>0,spell.id);
    assert.ok(Object.keys(spell.requirements).every((name)=>arcana.has(name)),spell.id);
    assert.ok(Object.values(spell.requirements).every((dots)=>dots>=1&&dots<=5),spell.id);
    assert.ok(spell.roteSkills.every((name)=>skills.has(name)||name==="Leadership"),`${spell.id}: ${spell.roteSkills.join(", ")}`);
    assert.doesNotMatch(spell.name,/^(Initiate|Apprentice|Disciple|Adept|Master) of /,spell.id);
    assert.doesNotMatch(spell.name,/^New Spells |CRAFTER'S TRADE/,spell.id);
  }
});

test("PDF-verified Codex typos use their printed English names", () => {
  for (const name of ["Craftsman's Eye","Goetic Evocation","Shared Sight","Fracture Grimoire"])
    assert.ok(SPELLS.some((spell)=>spell.name===name),name);
  assert.ok(SPELLS.some((spell)=>spell.name==="Goetic Evocation (Death Substitute)"&&spell.requirements.Death===4));
});

test("conjunctional requirements and secondary citations remain structured", () => {
  assert.equal(SPELLS.filter((spell)=>Object.keys(spell.requirements).length>1).length,24);
  const scribe=SPELLS.find((spell)=>spell.name==="Scribe Grimoire");
  assert.deepEqual(scribe.additionalSources,[{sourceId:"mta-signs-of-sorcery",source:"Signs of Sorcery",page:83}]);
  const display=SPELLS.find((spell)=>spell.name==="Display of Power");
  assert.deepEqual(display.additionalSources,[{sourceId:"core-dark-eras-2",source:"Dark Eras 2",page:379}]);
});
