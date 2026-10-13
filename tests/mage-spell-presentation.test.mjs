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
