import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const powers = JSON.parse(readFileSync(new URL('../public/game-lines/vampire/data/powers.json', import.meta.url), 'utf8'));
const vite = await createServer({ appType: 'custom', configFile: false, root, resolve: { alias: { '@': root } }, server: { middlewareMode: true, hmr: false, ws: false } });
after(() => vite.close());

test('Discipline Options enforce canonical prerequisites and refund exact independent purchases atomically', async () => {
  const { vampireDisciplineOptionPrerequisitesMet: eligible } = await vite.ssrLoadModule('/game-lines/vampire/creation-rules.ts');
  const { refundVampireAdvancement: refund } = await vite.ssrLoadModule('/game-lines/vampire/experience-refunds.ts');
  const { vampireExperienceLabel } = await vite.ssrLoadModule('/game-lines/vampire/experience-presentation.ts');
  const { vampireRules } = await vite.ssrLoadModule('/game-lines/vampire/rules.ts');
  const { blankPrintCharacter } = await vite.ssrLoadModule('/app/workspace/blank-print-character.ts');
  for (const id of ['devotion-null-space', 'devotion-kin-maker', 'devotion-dead-mans-reprieve']) assert.equal(powers.devotions.find(item => item.id === id).experienceCost, 4, 'Approved learning cost');
  const christine = powers.devotions.find(item => item.id === 'devotion-christine');
  assert.equal(christine.action, undefined);
  assert.equal(christine.duration, 'Until the next sunrise');
  assert.equal(powers.devotions.some(item => item.id === 'devotion-nightmare-journey'), false);
  assert.equal(powers.disciplineOptions.length, 7);
  assert.deepEqual(powers.disciplineOptions.map(x => x.experienceCost), [1, 1, 1, 1, 3, 2, 1]);
  for (const option of powers.disciplineOptions) {
    const sheet = blankPrintCharacter('VtR');
    sheet.line_data.disciplines = Object.fromEntries(powers.disciplines.map(x => [x.name, 5]));
    sheet.line_data.devotion_ids = powers.devotions.map(x => x.id);
    sheet.skills.Medicine = 5;
    assert.equal(eligible(option, sheet, powers), true, option.id);
    const base = option.requiredDevotionIds[0];
    sheet.line_data.devotion_ids = sheet.line_data.devotion_ids.filter(id => id !== base);
    sheet.line_data.devotion_ids.push(`homebrew:${base}`);
    assert.equal(eligible(option, sheet, powers), false, 'A namesake cannot stand in for the canonical base');
    sheet.line_data.devotion_ids.push(base);
    sheet.line_data.discipline_option_ids = [option.id];
    const before = JSON.stringify(sheet);
    assert.equal(refund(sheet, { kind: 'devotion', id: base }, powers), false);
    assert.equal(JSON.stringify(sheet), before);
    const undo = { kind: 'discipline-option', id: option.id, cost: option.experienceCost };
    const receipt = { id: 'option', label: 'Authored old receipt', cost: undo.cost, undo };
    const receiptBefore = JSON.stringify(receipt);
    for (const locale of ['en-US', 'pt-BR', 'en-US']) assert.equal(vampireExperienceLabel(receipt, sheet, [], powers, locale), locale === 'pt-BR' ? option.translatedName : option.name);
    assert.equal(JSON.stringify(receipt), receiptBefore);
    assert.equal(refund(sheet, undo, powers), true);
    assert.deepEqual(sheet.line_data.discipline_option_ids, []);
    assert.ok(sheet.line_data.devotion_ids.includes(base));
    assert.equal(refund(sheet, undo, powers), false, 'Cannot refund twice');
    sheet.line_data.discipline_option_ids = [option.id, option.id];
    const duplicateBefore = JSON.stringify(sheet);
    assert.equal(refund(sheet, undo, powers), false);
    assert.equal(JSON.stringify(sheet), duplicateBefore);
  }
  const sheet = blankPrintCharacter('VtR');
  sheet.line_data.disciplines = Object.fromEntries(powers.disciplines.map(x => [x.name, 5]));
  sheet.line_data.devotion_ids = powers.devotions.map(x => x.id);
  sheet.line_data.discipline_option_ids = ['devotion-flesh-sculpting:self'];
  sheet.line_data.devotion_ids = ['devotion-flesh-sculpting', 'devotion-flesh-crafting'];
  sheet.skills.Medicine = 5;
  sheet.line_data.disciplines.Protean = 3;
  const before = JSON.stringify(sheet);
  assert.equal(refund(sheet, { kind: 'discipline', name: 'Protean' }, powers), false);
  assert.equal(JSON.stringify(sheet), before);
  const receipt = { id: 'beast', cost: 3, label: 'Historical authored label', undo: { kind: 'devotion', id: 'devotion-nightmare-journey' } };
  sheet.line_data.devotion_ids.push('devotion-nightmare-journey');
  sheet.current_state.vampire_experience_history = [receipt];
  const normalized = vampireRules.normalizeCharacter(sheet);
  assert.ok(normalized.line_data.devotion_ids.includes('devotion-nightmare-journey'));
  assert.deepEqual(normalized.current_state.vampire_experience_history, [receipt]);
  assert.deepEqual(normalized.line_data.discipline_option_ids, sheet.line_data.discipline_option_ids);
});

test('Moirai discounts resolve canonical configured Merit instances and protect conditional message prerequisites', async () => {
  const { vampireDevotionExperienceCost: quote, vampireDisciplineOptionPrerequisitesMet: eligible } = await vite.ssrLoadModule('/game-lines/vampire/creation-rules.ts');
  const { refundVampireAdvancement: refund } = await vite.ssrLoadModule('/game-lines/vampire/experience-refunds.ts');
  const { blankPrintCharacter } = await vite.ssrLoadModule('/app/workspace/blank-print-character.ts');
  const core = JSON.parse(readFileSync(new URL('../public/shared/data/merits.json', import.meta.url), 'utf8'));
  const cult = core.find(item => item.id === 'core-2ed:mystery-cult-initiation');
  const selection = { definitionId: cult.id, instanceId: 'moirai', name: 'Título renomeado', dots: 1, creationDots: 1, sourceId: cult.sourceId, configuration: { cult: 'moirai' } };
  const sheet = blankPrintCharacter('VtR');
  sheet.merits = [selection];
  const before = JSON.stringify(sheet);
  for (const id of ['devotion-cutting-the-strings', 'devotion-timing-is-everything']) {
    const definition = powers.devotions.find(item => item.id === id);
    assert.equal(quote(definition, sheet, powers, undefined, core), 2);
    assert.equal(quote(definition, { ...sheet, merits: [{ ...selection, configuration: { cult: 'Authored title', shadowCultId: 'moirai' } }] }, powers, undefined, core), 2);
    assert.equal(quote(definition, { ...sheet, merits: [{ ...selection, configuration: { cult: 'Moirai', shadowCultId: 'missing:cult' } }] }, powers, undefined, core), 3);
    assert.equal(quote(definition, sheet, powers), 3, 'Unavailable canonical identity fails closed');
    assert.equal(quote(definition, sheet, powers, undefined, core.filter(item => item.id !== cult.id)), 3);
    for (const row of [
      { ...selection, dots: 0 },
      { ...selection, configuration: { cult: 'inconnu' } },
      { ...selection, definitionId: 'homebrew:cult-namesake', name: cult.name },
      { ...selection, definitionId: 'missing:identity', name: cult.name },
      { ...selection, definitionId: undefined, name: 'Iniciação em Culto dos Mistérios' },
      { ...selection, definitionId: undefined, name: cult.name, sourceId: 'other-source' },
    ]) assert.equal(quote(definition, { ...sheet, merits: [row] }, powers, undefined, [...core, { ...cult, id: 'homebrew:cult-namesake' }]), 3);
    const legacy = { ...selection, definitionId: undefined, name: cult.name, configuration: { cult: 'Moirai' } };
    assert.equal(quote(definition, { ...sheet, merits: [legacy] }, powers, undefined, core), 2, 'Canonical schema-2 bridge preserves existing case variants');
    const needsTwo = { ...definition, experienceDiscounts: [{ cost: 2, cultInitiation: { definitionId: cult.id, cultId: 'moirai', dots: 2 } }] };
    assert.equal(quote(needsTwo, { ...sheet, merits: [selection, { ...selection, instanceId: 'second' }] }, powers, undefined, core), 3, 'Separate instances never combine ratings');
    assert.equal(quote({ ...definition, experienceCost: undefined }, sheet, powers, undefined, core), undefined);
  }
  assert.equal(JSON.stringify(sheet), before, 'Pricing never rewrites choices or receipts');
  const option = powers.disciplineOptions.find(item => item.id === 'devotion-timing-is-everything:trigger');
  assert.equal(option.experienceCost, 1);
  assert.deepEqual(option.requiredDisciplines, { dominate: 3 });
  sheet.line_data.devotion_ids = option.requiredDevotionIds;
  sheet.line_data.discipline_option_ids = [option.id];
  sheet.line_data.disciplines = { Auspex: 4, Celerity: 2, Dominate: 3 };
  assert.equal(eligible(option, sheet, powers, core), true);
  assert.equal(eligible(option, sheet, { ...powers, disciplines: powers.disciplines.filter(item => item.id !== 'dominate') }, core), false);
  const dependencyBefore = JSON.stringify(sheet);
  assert.equal(refund(sheet, { kind: 'discipline', name: 'Dominate' }, powers, core), false);
  assert.equal(JSON.stringify(sheet), dependencyBefore);
  assert.equal(refund(sheet, { kind: 'discipline-option', id: option.id, cost: 1 }, powers, core), true);
  assert.equal(refund(sheet, { kind: 'discipline', name: 'Dominate' }, powers, core), true);
  assert.equal(eligible(option, sheet, powers, core), false);
});

test('Swarm uses the supplied rules in both locales with source activation and unchanged Core Tilts', async () => {
  const { TILTS, tiltPresentation } = await vite.ssrLoadModule('/lib/tilts.ts');
  const { activeVampirePowers } = await vite.ssrLoadModule('/game-lines/vampire/homebrew-catalog.ts');
  assert.equal(TILTS.length, 35);
  assert.ok(!TILTS.some(item => item.id === 'vtr-agony-ecstasy:swarm'));
  assert.equal(powers.tilts.length, 1);
  const swarm = powers.tilts[0];
  assert.equal(swarm.id, 'vtr-agony-ecstasy:swarm');
  assert.equal(swarm.category, 'Environmental');
  assert.match(swarm.description, /Size 1.*radius in meters/);
  assert.match(swarm.effect, /1 point of bashing damage per turn.*half of its full area.*1 additional point/);
  assert.match(swarm.effect, /8 meters.*2 bashing.*4-meter.*3 bashing.*2-meter.*4 bashing.*1-meter/);
  assert.match(swarm.effect, /full body.*half its rating.*−2 dice on all rolls.*not specifically attacked/);
  assert.match(swarm.causing, /Summon the Hunt.*Kindred and non-Kindred.*nest of bees/);
  assert.match(swarm.ending, /cannot be attacked with fists, clubs, swords, or guns.*Only area-affect.*Each point of damage.*halves.*below a 1-yard radius/);
  assert.doesNotMatch(swarm.effect, /Distracted|Strength \+ Brawl|exceptional success/);
  for (const locale of ['en-US', 'pt-BR', 'en-US']) {
    const presented = tiltPresentation(swarm, locale);
    assert.equal(presented.id, swarm.id);
    for (const field of ['description', 'effect', 'ending']) assert.deepEqual(presented[field].match(/\d+/g), swarm[field].match(/\d+/g));
    if (locale === 'pt-BR') {
      const summon = powers.disciplines.flatMap(item => item.levels).find(item => item.name === 'Summon the Hunt');
      assert.ok(presented.causing.includes(summon.translatedName));
      assert.match(presented.effect, /dano contundente.*corpo inteiro.*metade de sua pontuação.*−2 dados.*mesmo quando não são atacados/);
      assert.match(presented.ending, /não pode ser atacado.*Cada ponto de dano.*pela metade.*abaixo de 1 jarda/);
    }
  }
  assert.equal(activeVampirePowers(powers, { disabledIds: [] }).tilts.length, 1);
  assert.equal(activeVampirePowers(powers, { disabledIds: ['h-vtr-agony-ecstasy'] }).tilts.length, 0);
  assert.equal(activeVampirePowers(powers, { disabledIds: [swarm.id] }).tilts.length, 0);
  const dance = powers.devotions.find(item => item.id === 'h-vtr-agony-ecstasy:devotion:dance-of-the-swarm');
  assert.equal(JSON.stringify(dance).includes('p. XX'), false);
});
