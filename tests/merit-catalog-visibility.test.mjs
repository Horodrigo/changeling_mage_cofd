import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("creation and Experience Merit catalogs share the prerequisite visibility toggle", async () => {
  const [builderPicker, experiencePicker, toggle] = await Promise.all([
    source("app/builder/merit-picker.tsx"),
    source("app/workspace/experience-shared.tsx"),
    source("app/merit-catalog-visibility-toggle.tsx"),
  ]);

  assert.match(builderPicker, /const \[showAllMerits, setShowAllMerits\] = useState\(false\)/);
  assert.match(builderPicker, /showAllMerits \|\| meritPrerequisitesMet\(item, context\)/);
  assert.match(builderPicker, /<MeritCatalogVisibilityToggle showAll=\{showAllMerits\}/);

  const experienceStart = experiencePicker.indexOf("export function ExperienceMeritPicker(");
  const experience = experiencePicker.slice(experienceStart);
  assert.ok(experienceStart >= 0);
  assert.match(experience, /const \[showAllMerits, setShowAllMerits\] = useState\(false\)/);
  assert.match(experience, /showAllMerits \|\| meritPrerequisitesMet\(item, context\)/);
  assert.match(experience, /<MeritCatalogVisibilityToggle showAll=\{showAllMerits\}/);

  assert.match(toggle, /Mostrar todos", "Show all"/);
  assert.match(toggle, /<Switch/);
});

test("both game-line builders provide the catalog required for Merit prerequisite lookup", async () => {
  const [changeling, mage] = await Promise.all([
    source("game-lines/changeling/builder.tsx"),
    source("game-lines/mage/builder.tsx"),
  ]);

  assert.match(changeling, /const meritContext:[\s\S]*?meritCatalog,[\s\S]*?powers:/);
  assert.match(mage, /const meritContext:[\s\S]*?meritCatalog,[\s\S]*?powers:/);
});
