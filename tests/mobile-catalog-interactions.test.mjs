import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("filtered non-Merit catalogs use the whole card as the selection target", async () => {
  const [card, changeling, mage, experience, loadout] = await Promise.all([
    source("app/selectable-catalog-card.tsx"),
    source("game-lines/changeling/builder-view.tsx"),
    source("game-lines/mage/builder-view.tsx"),
    source("app/workspace/experience-shared.tsx"),
    source("app/workspace/loadout-catalog.tsx"),
  ]);

  assert.match(card, /role="button"/);
  assert.match(card, /aria-pressed=\{selected\}/);
  assert.match(card, /event\.key !== "Enter" && event\.key !== " "/);
  assert.match(changeling, /<SelectableCatalogCard className="merit-option"[\s\S]*?onToggle=\{\(\) => toggleContract\(contract\)\}/);
  assert.match(changeling, /anchor-catalog[\s\S]*?<SelectableCatalogCard[\s\S]*?setValue\(value===item\.name\?"":item\.name\)/);
  assert.match(changeling, /onToggle=\{\(\) => isSelected \? clear\(\) : choose\(item\)\}/);
  assert.match(changeling, /aria-pressed=\{courtId\(props\.courtCatalog, props\.court\)/);
  assert.match(mage, /<SelectableCatalogCard[\s\S]*?onToggle=\{\(\) => toggle\(spell\)\}/);
  assert.match(experience, /onToggle=\{\(\) => onSelect\(selectedId === item\.id \? "" : item\.id\)\}/);
  assert.match(loadout, /<SelectableCatalogCard[\s\S]*?selected\.filter\(\(id\) => id !== item\.id\)/);

  for (const catalog of [changeling, mage, experience, loadout]) {
    assert.doesNotMatch(catalog, /catalog-selection-checkbox/);
  }
});

test("Changeling mobile Summary owns Aspirations and compact Attributes fit their dots", async () => {
  const [sheet, css] = await Promise.all([
    source("game-lines/changeling/sheet-view.tsx"),
    source("app/globals.css"),
  ]);
  const mobileStart = sheet.indexOf("if (isMobile)");
  const desktopStart = sheet.indexOf("return (<>", mobileStart);
  const mobile = sheet.slice(mobileStart, desktopStart);
  const summaryStart = mobile.indexOf("resumo:");
  const detailsStart = mobile.indexOf("detalhes:");
  const powersStart = mobile.indexOf("poderes:");

  assert.ok(summaryStart >= 0 && detailsStart > summaryStart && powersStart > detailsStart);
  assert.match(mobile.slice(summaryStart, detailsStart), /<SheetHeading>Aspirações<\/SheetHeading>/);
  assert.doesNotMatch(mobile.slice(detailsStart, powersStart), /<SheetHeading>Aspirações<\/SheetHeading>/);
  assert.match(css, /\.mobile-attribute-grid \.official-trait-line > \.official-trait-label \{[^}]*font-size:11px/);
  assert.match(css, /\.welcome-actions \{ width:100%; flex-direction:column/);
});
