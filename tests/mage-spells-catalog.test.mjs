import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const shardNames = ["death","fate","forces","life","matter","mind","prime","space","spirit","time"];
const SPELLS = (await Promise.all(
  shardNames.map(async (name) =>
    JSON.parse(await readFile(new URL(`../public/data/mage/spells/${name}.json`, import.meta.url), "utf8")),
  ),
)).flat();

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

test("Matter summaries are fully reviewed against the offline PDFs", () => {
  const matter=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Matter");
  assert.equal(matter.length,32);
  assert.ok(matter.every((spell)=>spell.summaryReviewed===true));
  assert.ok(matter.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),matter.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(matter.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),matter.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Craftsman's Eye","Alchemist's Touch","State Change","Spell Potion","Forge Dumanium","Forge Sophis","Forge Thaumium","Ex Nihilo"]){
    const spell=matter.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  const exNihilo=matter.find((spell)=>spell.name==="Ex Nihilo");
  assert.match(exNihilo.summary,/Size set by Scale/);
  assert.match(exNihilo.summary,/Potency between.*Durability.*equipment bonus/);
});

test("Mind summaries are fully reviewed against the offline PDFs", () => {
  const mind=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Mind");
  assert.equal(mind.length,45);
  assert.ok(mind.every((spell)=>spell.summaryReviewed===true));
  assert.ok(mind.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),mind.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(mind.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),mind.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Mental Scan","Incognito Presence","Ritual Focus","Astral Grimoire","Haunted Grimoire","Goetic Evocation","Mind Wipe"]){
    const spell=mind.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.match(mind.find((spell)=>spell.name==="Mind Wipe").summary,/one continuous month.*per Potency/);
  assert.match(mind.find((spell)=>spell.name==="Goetic Evocation").summary,/Rank equal to half.*Gnosis/);
});

test("Prime summaries are fully reviewed against the offline PDFs", () => {
  const prime=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Prime");
  assert.equal(prime.length,50);
  assert.ok(prime.every((spell)=>spell.summaryReviewed===true));
  assert.ok(prime.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),prime.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(prime.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),prime.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Dispel Magic","Shared Sight","Platonic Form","Scribe Palimpsest","Steal Mana","Blasphemy","Eidolon"]){
    const spell=prime.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.equal(prime.find((spell)=>spell.name==="Transfer Soul Stone").withstand,"Resolve of soul stone's creator");
  assert.match(prime.find((spell)=>spell.name==="Blasphemy").summary,/Sleepers.*Enervated/);
  assert.match(prime.find((spell)=>spell.name==="Eidolon").summary,/does not crumble.*Mana/);
});

test("Space summaries are fully reviewed against the offline PDFs", () => {
  const space=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Space");
  assert.equal(space.length,29);
  assert.ok(space.every((spell)=>spell.summaryReviewed===true));
  assert.ok(space.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),space.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(space.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),space.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Isolation","The Outward and Inward Eye","Scrying","Forced Sympathy","Secret Room","Pocket Dimension","Quarantine"]){
    const spell=space.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.match(space.find((spell)=>spell.name==="Forced Sympathy").summary,/one Mana/);
  assert.match(space.find((spell)=>spell.name==="Pocket Dimension").summary,/no native Time or Twilight/);
  assert.match(space.find((spell)=>spell.name==="Quarantine").summary,/retains its own Time, Twilight/);
});

test("Spirit summaries are fully reviewed against the offline PDFs", () => {
  const spirit=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Spirit");
  assert.equal(spirit.length,36);
  assert.ok(spirit.every((spell)=>spell.summaryReviewed===true));
  assert.ok(spirit.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),spirit.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(spirit.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),spirit.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Coaxing the Spirits","Channel Essence","Craft Fetish","Haunted Grimoire","Shape Spirit","Annihilate Spirit","Spirit Manse"]){
    const spell=spirit.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.match(spirit.find((spell)=>spell.name==="Annihilate Spirit").summary,/instead of reducing it to hibernation/);
  assert.match(spirit.find((spell)=>spell.name==="Birth Spirit").summary,/not controlled by the mage/);
  assert.match(spirit.find((spell)=>spell.name==="Create Locus").summary,/does not generate extra Essence/);
});

test("Time summaries are fully reviewed against the offline PDFs", () => {
  const time=SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]==="Time");
  assert.equal(time.length,25);
  assert.ok(time.every((spell)=>spell.summaryReviewed===true));
  assert.ok(time.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),time.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(time.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),time.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  for(const name of ["Divination","Perfect Timing","Postcognition","Hung Spell","Veil of Moments","Shifting Sands","Temporal Summoning","Rewrite History","Corridors of Time"]){
    const spell=time.find((candidate)=>candidate.name===name);
    assert.ok(spell,`Missing ${name}`);
    assert.ok(spell.summary.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2,`${name} was reduced to a single sentence`);
  }
  assert.match(time.find((spell)=>spell.name==="Postcognition").summary,/cannot act or cast spells and loses her Defense/);
  assert.match(time.find((spell)=>spell.name==="Veil of Moments").summary,/cannot heal naturally, regain Willpower or Mana, or spend Experiences/);
  assert.match(time.find((spell)=>spell.name==="Time Limit").summary,/one week per Potency/);
});

test("every catalog spell has a coherent PDF-reviewed explicit summary", () => {
  assert.equal(SPELLS.length,360);
  assert.ok(SPELLS.every((spell)=>spell.summaryReviewed===true),SPELLS.find((spell)=>spell.summaryReviewed!==true)?.id);
  assert.ok(SPELLS.every((spell)=>typeof spell.summary==="string"&&spell.summary.trim()),SPELLS.find((spell)=>!spell.summary?.trim())?.id);
  assert.ok(SPELLS.every((spell)=>!/(?:Add [A-Za-z]+(?: or [A-Za-z]+)?\s*[•●\d]+:\s*)?\+\d+ Reach/i.test(spell.summary)),SPELLS.find((spell)=>/\+\d+ Reach/i.test(spell.summary))?.id);
  const counts=Object.fromEntries(["Death","Fate","Forces","Life","Matter","Mind","Prime","Space","Spirit","Time"].map((arcana)=>[
    arcana,
    SPELLS.filter((spell)=>Object.keys(spell.requirements)[0]===arcana).length,
  ]));
  assert.deepEqual(counts,{Death:46,Fate:30,Forces:38,Life:29,Matter:32,Mind:45,Prime:50,Space:29,Spirit:36,Time:25});
});

test("Mage Details and Powers resolve saved spell snapshots through the current summaries", async()=>{
  const {readFile}=await import("node:fs/promises");
  const sheet=await readFile(new URL("../app/workspace/character-paper.tsx",import.meta.url),"utf8");
  assert.match(sheet,/current\?\.summary \?\? item\.summary/);
  assert.match(sheet,/description:spell\.summary\?\?spell\.description/);
  assert.doesNotMatch(sheet,/tr\("Efeitos", "Effects"\).*item\.description/);
});

test("conjunctional requirements and secondary citations remain structured", () => {
  assert.equal(SPELLS.filter((spell)=>Object.keys(spell.requirements).length>1).length,24);
  const scribe=SPELLS.find((spell)=>spell.name==="Scribe Grimoire");
  assert.deepEqual(scribe.additionalSources,[{sourceId:"mta-signs-of-sorcery",source:"Signs of Sorcery",page:83}]);
  const display=SPELLS.find((spell)=>spell.name==="Display of Power");
  assert.deepEqual(display.additionalSources,[{sourceId:"core-dark-eras-2",source:"Dark Eras 2",page:379}]);
});
