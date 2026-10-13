import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

test("Mage Spell presentation switches EN/PT/EN without translating parser inputs or saved selections", async () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const server = await createServer({ configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { mageSpellPresentation, mageSpellSelection } = await server.ssrLoadModule("/game-lines/mage/spell-presentation.ts");
    const { mageRules } = await server.ssrLoadModule("/game-lines/mage/rules.ts");
    const spells = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/death.json", import.meta.url), "utf8"));
    const original = structuredClone(spells);
    for (const spell of spells.filter(spell => spell.presentationPt)) {
      const en = mageSpellPresentation(spell, "en-US");
      const pt = mageSpellPresentation(spell, "pt-BR");
      assert.notEqual(pt.name, en.name);
      assert.notEqual(pt.summary, en.summary);
      assert.equal(pt.practice, spell.presentationPt.practice);
      assert.deepEqual(mageSpellPresentation(spell, "en-US"), en);
      const saved = mageSpellSelection(spell);
      assert.equal(saved.presentationPt, undefined);
      assert.equal(saved.description, spell.description);
      assert.equal(saved.id, spell.id);
    }
    assert.deepEqual(spells, original);
    assert.equal(spells.filter(spell => spell.presentationPt).length, 46);
    const crafting = spells.find(spell => spell.id === "mta-signs-of-sorcery:death-4-soul-grafting");
    assert.equal(crafting.name, "Soul Crafting");
    assert.equal(mageSpellPresentation(crafting, "pt-BR").name, "Moldagem da Alma");
    assert.match(mageSpellPresentation(spells.find(spell => spell.name === "Exorcism"), "pt-BR").reach, /Adicionar Mente ou Espírito/);
    assert.match(mageSpellPresentation(spells.find(spell => spell.name === "Revenant"), "pt-BR").reach, /^Adicionar Mente ou Espírito/);
    const fate = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/fate.json", import.meta.url), "utf8"));
    assert.equal(fate.filter(spell => spell.presentationPt).length, 30);
    for (const spell of fate.filter(spell => spell.presentationPt)) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const forces = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/forces.json", import.meta.url), "utf8"));
    assert.equal(forces.filter(spell => spell.presentationPt).length, 38);
    assert.match(mageSpellPresentation(forces.find(spell => spell.name === "Turn Momentum"), "pt-BR").reach, /Adicionar Tempo •/);
    for (const spell of forces.filter(spell => spell.presentationPt)) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const life = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/life.json", import.meta.url), "utf8"));
    assert.equal(life.filter(spell => spell.presentationPt).length, 29);
    assert.match(mageSpellPresentation(life.find(spell => spell.name === "Speak With Beasts"), "pt-BR").reach, /\+1 Alcance/);
    assert.match(mageSpellPresentation(life.find(spell => spell.name === "Many Faces"), "pt-BR").reach, /Adicionar Tempo •••/);
    assert.match(mageSpellPresentation(life.find(spell => spell.name === "Shapechanging"), "pt-BR").reach, /Adicionar Matéria ••••/);
    assert.match(mageSpellPresentation(life.find(spell => spell.name === "Create Life"), "pt-BR").reach, /Adicionar Mente •••••/);
    for (const spell of life) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const matter = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/matter.json", import.meta.url), "utf8"));
    assert.equal(matter.filter(spell => spell.presentationPt).length, 32);
    assert.match(mageSpellPresentation(matter.find(spell => spell.name === "Detect Substance"), "pt-BR").reach, /Adicionar Tempo •/);
    assert.match(mageSpellPresentation(matter.find(spell => spell.name === "State Change"), "pt-BR").reach, /Adicionar Forças •••/);
    const thaumium = matter.find(spell => spell.name === "Forge Thaumium");
    assert.match(mageSpellPresentation(thaumium, "en-US").reach, /Add Any Other Arcanum ●●●/);
    assert.match(mageSpellPresentation(thaumium, "pt-BR").reach, /Adicionar qualquer outro Arcano •••/);
    for (const spell of matter) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const mind = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/mind.json", import.meta.url), "utf8"));
    assert.equal(mind.filter(spell => spell.presentationPt).length, 45);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Know Nature"), "pt-BR").reach, /\+1 Alcance/);
    assert.equal(mind.find(spell => spell.name === "Incognito Presence").withstand, "Resolve");
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Narcissus' Mirror"), "en-US").reach, /Substitute Life •••/);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Narcissus' Mirror"), "pt-BR").reach, /Substituir Vida •••/);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Goetic Summons"), "pt-BR").reach, /Adicionar Espírito •• ou Morte ••/);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Give Me That"), "pt-BR").reach, /Adicionar Espaço •••/);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Psychic Projection"), "pt-BR").reach, /Adicionar Espírito ••/);
    assert.match(mageSpellPresentation(mind.find(spell => spell.name === "Haunted Grimoire"), "pt-BR").reach, /Substituir Morte •••••/);
    assert.equal(mind.find(spell => spell.name === "Possession").page, 164);
    const prime = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/prime.json", import.meta.url), "utf8"));
    assert.equal(prime.filter(spell => spell.presentationPt).length, 50);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Sacred Geometry"), "pt-BR").reach, /Adicionar Morte • ou Espírito •/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Shared Sight"), "pt-BR").reach, /Adicionar qualquer outro Arcano •/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Words of Truth"), "pt-BR").reach, /Condição Inspirado/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Path to Jerusalem"), "pt-BR").reach, /\+1 Alcance por informação falsa/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Ephemeral Enchantment"), "en-US").reach, /bane of one specified Twilight being/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Ephemeral Enchantment"), "pt-BR").reach, /Fraqueza de uma entidade específica/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Scribe Palimpsest"), "pt-BR").reach, /\+1 Alcance e 1 Mana/);
    assert.match(mageSpellPresentation(prime.find(spell => spell.name === "Eidolon"), "pt-BR").reach, /Adicionar Mente •••••/);
    for (const spell of prime) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const space = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/space.json", import.meta.url), "utf8"));
    assert.equal(space.filter(spell => spell.presentationPt).length, 29);
    assert.match(mageSpellPresentation(space.find(spell => spell.name === "Correspondence"), "pt-BR").reach, /\+2 Alcance/);
    assert.match(mageSpellPresentation(space.find(spell => spell.name === "Scrying"), "pt-BR").reach, /Adicionar Destino ••/);
    assert.match(mageSpellPresentation(space.find(spell => spell.name === "Web-Weaver"), "pt-BR").reach, /Adicionar Tempo ••/);
    assert.match(space.find(spell => spell.name === "Optimal Container").summary, /combined total Size/);
    assert.match(mageSpellPresentation(space.find(spell => spell.name === "Teleportation"), "pt-BR").reach, /Adicionar Morte ••, Espírito ••/);
    assert.match(mageSpellPresentation(space.find(spell => spell.name === "Pocket Dimension"), "pt-BR").reach, /Adicionar Tempo ••/);
    for (const spell of space) {
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellPresentation(spell, "pt-BR").name, spell.presentationPt.name);
      assert.equal(mageSpellPresentation(spell, "en-US").name, spell.name);
      assert.equal(mageSpellSelection(spell).description, spell.description);
    }
    const spirit = JSON.parse(await readFile(new URL("../public/game-lines/mage/data/spells/spirit.json", import.meta.url), "utf8"));
    assert.equal(spirit.filter(spell => spell.presentationPt).length, 13);
    assert.match(mageSpellPresentation(spirit.find(spell => spell.name === "Exorcist's Eye"), "pt-BR").reach, /Adicionar Morte • ou Mente •/);
    assert.match(mageSpellPresentation(spirit.find(spell => spell.name === "Channel Essence"), "pt-BR").reach, /Adicionar Morte •• ou Mente ••/);
    assert.doesNotMatch(mageSpellPresentation(spirit.find(spell => spell.name === "Ephemeral Shield"), "en-US").reach, /Add Death|Add Mind/);
    assert.match(mageSpellPresentation(spells[1], "pt-BR").reach, /\+1 Alcance/);
    assert.match(spells[1].description, /\+1 Reach:/);
    const homebrew = { id: "homebrew:spell:author", name: "Minha magia", originalName: "Minha magia", summary: "Texto autoral", description: "Texto autoral" };
    assert.equal(mageSpellPresentation(homebrew, "pt-BR").name, homebrew.name);
    assert.deepEqual(mageSpellSelection(homebrew), homebrew);
    const history = [{ id: "receipt", regular: 1, arcane: 0, undo: { kind: "spell", key: "learned_praxes", id: spells[1].id } }];
    const character = { line_data: { learned_praxes: [spells[1], homebrew] }, current_state: { mage_experience_history: history } };
    const normalized = mageRules.normalizeCharacter(character);
    assert.deepEqual(normalized.line_data.learned_praxes, [mageSpellSelection(spells[1]), homebrew]);
    assert.deepEqual(normalized.current_state.mage_experience_history, history);
    assert.ok(character.line_data.learned_praxes[0].presentationPt);
    assert.match(mageSpellPresentation({ description: "Base. Add Mind ••: An additional effect." }, "en-US").reach, /^Add Mind/);
  } finally { await server.close(); }
});
