import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("mobile sheets keep summaries, details, powers, and resource tracks separated", async () => {
  const [mage, vampire, globals, mageCss, vampireCss] = await Promise.all([
    read("../game-lines/mage/sheet-view.tsx"),
    read("../game-lines/vampire/sheet-view.tsx"),
    read("../app/css/globals.css"),
    read("../app/css/mage-sheet.css"),
    read("../app/css/vampire-sheet.css"),
  ]);
  const mageMobile = mage.slice(mage.indexOf("if (isMobile)"), mage.indexOf('return (<CharacterPaperShell line="MtA" title='));
  const mageSummary = mageMobile.slice(mageMobile.indexOf("resumo:"), mageMobile.indexOf("stats:"));
  const mageDetails = mageMobile.slice(mageMobile.indexOf("detalhes:"), mageMobile.indexOf("poderes:"));
  assert.ok(mageSummary.indexOf('t("ui.aspirations")') < mageSummary.indexOf('t("ui.experience")'));
  assert.doesNotMatch(mageSummary, /expandedMerits|ui\.conditions/);
  assert.match(mageDetails, /expandedMerits/);
  assert.match(mageDetails, /ui\.conditions/);
  assert.match(mage, /characterId: character\.id, value: "resumo"/);

  const vampireSummary = vampire.slice(vampire.indexOf("const summary ="), vampire.indexOf("const powersPage ="));
  assert.ok(vampireSummary.indexOf('t("ui.aspirations")') < vampireSummary.indexOf('t("ui.experience")'));
  assert.doesNotMatch(vampireSummary, /humanitySection|banesSection|ui\.conditions/);
  assert.match(vampire, /value: "powers", label: t\("ui\.powers"\)/);
  assert.match(vampire, /resourceName="Vitae"/);
  assert.match(globals, /mobile-character-sheet \.power-resource \.resource-track::before \{ grid-column:1\/-1; \}/);
  assert.match(mageCss, /8px center,[\s\S]*12px center/);
  assert.match(vampireCss, /--vtr-frame-side-x: 8px/);
});
