import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});
after(async () => vite.close());

const combat = await vite.ssrLoadModule("/lib/combat-equipment.ts");
const companions = await vite.ssrLoadModule("/lib/companions.ts");

const portuguese = /\b(?:Armadura|Armas|Ataque|Atordoar|Automotiv|Braços|Briga|Compostura|Corpo|Dados|Destreza|Equipamento|Força|Furtividade|Inteligência|Mordida|Perseverança|Presença|Raciocínio|Sobrevivência|Tronco|Vigor|Voo)\b/i;

test("o catálogo de combate possui apresentação inglesa completa", () => {
  const all = [...combat.WEAPONS, ...combat.ARMORS, ...combat.EQUIPMENT];
  assert.equal(all.length, 70);
  assert.equal(combat.WEAPONS.filter((item) => item.kind === "Distância").length, 10);
  assert.equal(combat.WEAPONS.filter((item) => item.kind === "Corpo a corpo").length, 17);
  assert.equal(combat.ARMORS.length, 7);
  assert.equal(combat.EQUIPMENT.length, 36);
  for (const source of all) {
    const item = combat.combatItemPresentation(source, "en-US");
    const visible = [item.name, item.kind, item.category, item.effect, item.special, item.coverage]
      .filter(Boolean)
      .join(" ");
    assert.doesNotMatch(visible, portuguese, source.id);
  }
  assert.equal(combat.combatItemPresentation(combat.WEAPONS.find((item) => item.id === "besta"), "en-US").name, "Crossbow");
  assert.match(combat.combatItemPresentation(combat.WEAPONS.find((item) => item.id === "besta"), "en-US").special, /stake through the heart.*−3.*5 damage/);
  assert.equal(combat.combatItemPresentation(combat.ARMORS.find((item) => item.id === "armadura-placas"), "en-US").coverage, "Torso, arms, legs");
  assert.equal(combat.combatItemPresentation(combat.EQUIPMENT.find((item) => item.id === "software-de-invasao"), "en-US").name, "Cracking Software");
});

test("os 9 veículos e 21 animais possuem apresentação inglesa completa", () => {
  assert.equal(companions.VEHICLES.length, 9);
  assert.equal(companions.ANIMALS.length, 21);
  for (const source of companions.VEHICLES) {
    const item = companions.vehiclePresentation(source, "en-US");
    assert.doesNotMatch(`${item.name} ${item.acceleration ?? ""}`, portuguese, source.id);
  }
  for (const source of companions.ANIMALS) {
    const item = companions.animalPresentation(source, "en-US");
    const visible = [item.name, item.attributes, item.skills, item.speed, item.special,
      ...item.attacks.flatMap((attack) => [attack.name, attack.note])]
      .filter(Boolean)
      .join(" ");
    assert.doesNotMatch(visible, portuguese, source.id);
  }
});
