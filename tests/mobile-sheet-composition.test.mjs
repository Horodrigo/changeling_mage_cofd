import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("mobile sheets keep summaries, details, powers, and resource tracks separated", async () => {
  const [mortal, mortalBuilder, mage, vampire, bloodline, legacy, globals, mortalCss, mageCss, vampireCss] = await Promise.all([
    read("../game-lines/mortal/sheet-view.tsx"),
    read("../game-lines/mortal/builder.tsx"),
    read("../game-lines/mage/sheet-view.tsx"),
    read("../game-lines/vampire/sheet-view.tsx"),
    read("../game-lines/vampire/bloodline-page.tsx"),
    read("../app/workspace/legacy-page.tsx"),
    read("../app/css/globals.css"),
    read("../app/css/mortal-sheet.css"),
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
  assert.match(mage, /legacyState\?\.joined \? setSheetTab\("legacy"\) : setLegacyJoinOpen\(true\)/);
  assert.match(mage, /<Dialog open=\{legacyJoinOpen\}[^]*<LegacyPage[^]*onJoined=/);
  assert.doesNotMatch(mage, /joinCreate|Join\/Create/);
  assert.match(legacy, /alphabetical\(LEGACIES,item=>item\.name\)/);
  assert.match(legacy, /<SelectValue placeholder=\{t\("ui\.selectLegacy"\)\}/);
  assert.doesNotMatch(legacy, /value="__select"/);

  const vampireSummary = vampire.slice(vampire.indexOf("const summary ="), vampire.indexOf("const powersPage ="));
  assert.ok(vampireSummary.indexOf('t("ui.aspirations")') < vampireSummary.indexOf('t("ui.experience")'));
  assert.doesNotMatch(vampireSummary, /humanitySection|banesSection|ui\.conditions/);
  assert.match(vampire, /value: "powers", label: t\("ui\.powers"\)/);
  assert.match(vampire, /resourceName="Vitae"/);
  assert.match(bloodline, /const available = alphabetical\(bloodlines\.filter/);
  assert.match(mortal, /value: "summary", label: t\("ui\.summary"\)/);
  assert.match(mortal, /value: "details", label: t\("ui\.details"\)/);
  assert.match(mortal, /minimum=\{5\}/);
  assert.match(mortal, /mobile-attribute-grid/);
  assert.match(mortal, /mobile-trait-stack/);
  assert.match(mortal, /integrity-track[^]*DotValue value=\{integrity\} max=\{10\} singleRow/);
  assert.match(mortal, /MortalExperiencePanel/);
  assert.match(mortalCss, /@media \(max-width:767px\)[^]*\.cofd-sheet \.mobile-attribute-grid/);
  assert.doesNotMatch(mortalBuilder, /meritSpent\s*!==\s*7|threeCompleteSpecialties|threeAspirations|answerFiveBreakingPointQuestions/);
  assert.match(mortalBuilder, /meritSpent\s*>\s*7/);
  assert.match(globals, /mobile-character-sheet \.power-resource \.resource-track::before \{ grid-column:1\/-1; \}/);
  assert.match(mageCss, /8px center,[\s\S]*12px center/);
  assert.match(mageCss, /--mta-frame-center-clearance:\d+px/);
  assert.match(mageCss, /left var\(--mta-frame-rail-edge\) top 25px,[\s\S]*right var\(--mta-frame-rail-edge\) top 25px/);
  assert.match(mageCss, /background-image:url\("\/mage\/style\/attributes-divider\.webp"\)/);
  assert.doesNotMatch(mageCss, /visual corrections v3/);
  assert.match(mageCss, /\.legacy-sheet-field button \{[^}]*padding:0 0 0 2px/);
  assert.match(mageCss, /\.mage-legacy-join-dialog \.entitlement-select \[data-slot="select-trigger"\]/);
  assert.doesNotMatch(mageCss, /\.mta-sheet \.nimbus-editor article,[^}]*box-closed\.webp/);
  assert.match(mageCss, /\.mta-sheet > \.ctl-sheet-tabs::before/);
  assert.match(mageCss, /border:2px solid rgba\(36,82,113,\.34\)/);
  assert.match(vampireCss, /--vtr-frame-rail-y: 12px/);
  assert.match(vampireCss, /--vtr-frame-side-x: 8px/);
  assert.match(vampireCss, /--vtr-frame-corner-depth: 96px/);
});
