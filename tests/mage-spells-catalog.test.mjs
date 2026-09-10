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

test("Death summaries are fully reviewed against the offline PDFs", () => {
  const death=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Death");
  assert.equal(death.length,46);
  assert.ok(death.every((spell)=>spell.summaryReviewed===true));
  assert.ok(death.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),death.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(death.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),death.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Quicken Corpse","Haunted Grimoire","Empty Presence"]){
    const spell=death.find((candidate)=>candidate.name===name);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  for(const stale of ["Shape and mold ectoplasm","Apply Poor Light Tilt in area","Learna","reasteablished","adds"])
    assert.ok(death.every((spell)=>!spell.description.includes(stale)),stale);
});

test("Fate summaries are fully reviewed against the offline PDFs", () => {
  const fate=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Fate");
  assert.equal(fate.length,30);
  assert.ok(fate.every((spell)=>spell.summaryReviewed===true));
  assert.ok(fate.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),fate.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(fate.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),fate.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Quantum Flux","Shifting the Odds","Sworn Oaths","Masking the False Fae","Miracle"]){
    const spell=fate.find((candidate)=>candidate.name===name);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  const atonement=fate.find((spell)=>spell.name==="Atonement");
  assert.equal(atonement.withstand,"Subject effect's Potency");
  assert.deepEqual(atonement.roteSkills,["Academics","Empathy","Survival"]);
  assert.equal(fate.find((spell)=>spell.name==="Chaos Mastery").primaryFactor,"Duration");
  assert.equal(fate.find((spell)=>spell.name==="Masking the False Fae").primaryFactor,"Duration");
});

test("Forces summaries are fully reviewed against the offline PDFs", () => {
  const forces=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Forces");
  assert.equal(forces.length,38);
  assert.ok(forces.every((spell)=>spell.summaryReviewed===true));
  assert.ok(forces.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),forces.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(forces.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),forces.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Nightvision","Control Electricity","Control Sound","Environmental Shield","Energize Object","Rend Friction","Create Energy"]){
    const spell=forces.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.deepEqual(forces.find((spell)=>spell.name==="Velocity Control").roteSkills,["Athletics","Drive","Science"]);
  assert.equal(forces.find((spell)=>spell.name==="Eradicate Energy").withstand,"Stamina");
  assert.equal(forces.find((spell)=>spell.name==="Gravitic Supremacy").practice,"Fraying or Perfecting");
});

test("Life summaries are fully reviewed against the offline PDFs", () => {
  const life=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Life");
  assert.equal(life.length,29);
  assert.ok(life.every((spell)=>spell.summaryReviewed===true));
  assert.ok(life.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),life.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(life.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),life.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Analyze Life","Body Control","Mutable Mask","Many Faces","Steal Life Force","Living Grimoire","Create Life"]){
    const spell=life.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  const shapechanging=life.find((spell)=>spell.name==="Shapechanging");
  assert.equal(shapechanging.primaryFactor,"Duration");
  assert.deepEqual(shapechanging.roteSkills,["Animal Ken","Athletics","Science"]);
});

test("conjunctional requirements and secondary citations remain structured", () => {
  assert.equal(SPELLS.filter((spell)=>Object.keys(spell.requirements).length>1).length,24);
  const scribe=SPELLS.find((spell)=>spell.name==="Scribe Grimoire");
  assert.deepEqual(scribe.additionalSources,[{sourceId:"mta-signs-of-sorcery",source:"Signs of Sorcery",page:83}]);
  const display=SPELLS.find((spell)=>spell.name==="Display of Power");
  assert.deepEqual(display.additionalSources,[{sourceId:"core-dark-eras-2",source:"Dark Eras 2",page:379}]);
});
