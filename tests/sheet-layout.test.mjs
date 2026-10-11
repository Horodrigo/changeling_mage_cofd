import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const lines = [
  {
    id: "mortal",
    label: "Mortal",
    desktopTabs: ["main", "combat", "notes"],
    mobileTabs: ["main", "summary", "stats", "details", "combat", "notes"],
  },
  {
    id: "changeling",
    label: "Changeling",
    desktopTabs: ["main", "poderes", "entitlement", "combate", "companheiros"],
    mobileTabs: ["main", "resumo", "stats", "detalhes", "poderes", "entitlement", "combate", "companheiros", "anotacoes"],
  },
  {
    id: "mage",
    label: "Mage",
    desktopTabs: ["main", "magia", "legacy", "combate", "companheiros"],
    mobileTabs: ["main", "resumo", "stats", "detalhes", "poderes", "legacy", "combate", "companheiros", "anotacoes"],
  },
  {
    id: "vampire",
    label: "Vampire",
    desktopTabs: ["main", "details", "powers", "bloodlines", "combat", "companions", "notes"],
    mobileTabs: ["main", "summary", "stats", "details", "powers", "bloodlines", "combat", "companions", "notes"],
  },
  {
    id: "werewolf",
    label: "Werewolf",
    desktopTabs: ["main", "forms", "details", "lodge", "combat", "notes"],
    mobileTabs: ["main", "summary", "stats", "details", "forms", "powers", "lodge", "combat", "notes"],
  },
];

test("shared layout renderer validates coordinates and stable item IDs", async () => {
  const source = await read("../app/workspace/sheet-layout.tsx");
  const mainSheet = await read("../app/workspace/main-sheet.tsx");
  assert.match(source, /definition\.columns < 1/);
  assert.match(source, /item\.column > definition\.columns/);
  assert.match(source, /positions\.has\(position\)/);
  assert.match(source, /configured\.has\(id\)/);
  assert.match(source, /orders\.has\(item\.order\)/);
  assert.match(source, /data-sheet-layout-section=\{id\}/);
  assert.match(source, /data-sheet-layout-flow=\{id\}/);
  assert.match(source, /SheetLayoutDesktopPage/);
  assert.match(source, /configuredItems\.has\(itemId\)/);
  assert.match(mainSheet, /identityItems/);
  assert.match(mainSheet, /items=\{layoutItems\}/);
});

test("Werewolf Lodge tab is membership-gated and follows Details/Powers on each platform", async () => {
  const sheet = await read("../game-lines/werewolf/sheet.tsx");
  assert.match(sheet, /const hasLodge = Boolean\(werewolfLodgeId\(data\.lodge_id\)\)/);
  assert.match(sheet, /\.\.\.\(hasLodge \? \[\{ value: "lodge"/);
  assert.match(sheet, /<TabsTrigger value="details">[\s\S]*\{hasLodge && <TabsTrigger value="lodge">/);
  assert.match(sheet, /<TabsTrigger value="lodge">[\s\S]*<TabsTrigger value="combat">/);
  assert.match(sheet, /\{ value: "powers"[\s\S]*\.\.\.\(hasLodge \? \[\{ value: "lodge"/);
});

test("each game line has separate platform configs covering every sheet tab", async () => {
  for (const line of lines) {
    const [desktop, mobile, sheet] = await Promise.all([
      read(`../game-lines/${line.id}/sheet-layout.desktop.ts`),
      read(`../game-lines/${line.id}/sheet-layout.mobile.ts`),
      read(line.id === "werewolf" ? "../game-lines/werewolf/sheet.tsx" : `../game-lines/${line.id}/sheet-view.tsx`),
    ]);
    assert.match(desktop, new RegExp(`export const ${line.id}DesktopLayout = \\{`), `${line.label} Desktop config exists`);
    assert.match(mobile, new RegExp(`export const ${line.id}MobileLayout = \\{`), `${line.label} Mobile config exists`);
    for (const tab of line.desktopTabs) {
      assert.match(desktop, new RegExp(`^\\s+${tab}:`, "m"), `${line.label} Desktop tab "${tab}" is configurable`);
    }
    for (const tab of line.mobileTabs) {
      assert.match(mobile, new RegExp(`^\\s+${tab}:`, "m"), `${line.label} Mobile tab "${tab}" is configurable`);
    }
    assert.match(sheet, /sheet-layout\.desktop/, `${line.label} imports the Desktop config separately`);
    assert.match(sheet, /sheet-layout\.mobile/, `${line.label} imports the Mobile config separately`);
    assert.match(sheet, /SheetLayoutFlow/, `${line.label} renders ordered Mobile tabs`);
    assert.match(sheet, /SheetLayoutDesktopPage/, `${line.label} renders configured Desktop tabs`);
  }
});

test("Werewolf Mobile field order is configured independently and omits the Desktop-only Chronicle field", async () => {
  const [layout, styles, sheet] = await Promise.all([
    read("../game-lines/werewolf/sheet-layout.mobile.ts"),
    read("../game-lines/werewolf/styles/sheet.css"),
    read("../game-lines/werewolf/sheet.tsx"),
  ]);
  assert.match(layout, /identity:\s*positions\(2,/);
  assert.doesNotMatch(styles, /\.sheet-identity-grid\s*>\s*:nth-child/);
  assert.doesNotMatch(layout, /\["chronicle",/);
  assert.match(sheet, /const identityFields = \{\s*\.\.\.identityMobileFields,\s*chronicle:/);
  assert.match(sheet, /definition=\{werewolfMobileLayout\.main\.identity\} items=\{identityMobileFields\}/);
});

test("line-owned main sheet column spacing targets shared layout wrappers", async () => {
  for (const line of ["changeling", "mage", "vampire"]) {
    const styles = await read(`../game-lines/${line}/styles/sheet.css`);
    assert.match(styles, /official-sheet-body\s*>\s*\.sheet-layout-column/);
    assert.match(styles, /official-sheet-body\s*>\s*\.sheet-layout-column\s*\+\s*\.sheet-layout-column/);
    assert.match(styles, /official-trait-grid\s*>\s*\.sheet-layout-column/);
    assert.match(styles, /official-trait-grid\s*>\s*\.sheet-layout-column\s*\+\s*\.sheet-layout-column/);
  }
  const mageStyles = await read("../game-lines/mage/styles/sheet.css");
  assert.match(mageStyles, /\.mta-sheet \.sheet-identity-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3[^}]*grid-auto-flow:\s*row/s);
  assert.doesNotMatch(mageStyles, /\.mta-sheet \.sheet-identity-grid\s*\{[^}]*grid-template-rows:\s*repeat/s);
  assert.match(mageStyles, /@media screen and \(max-width: 767px\)\s*\{\s*\.mta-sheet \.sheet-layout-section\.sheet-identity-grid\s*\{\s*grid-template-columns:\s*repeat\(2/s);
  const changelingStyles = await read("../game-lines/changeling/styles/sheet.css");
  assert.match(changelingStyles, /official-trait-grid\s*>\s*\.sheet-layout-column/);
  assert.match(changelingStyles, /official-trait-grid\s*>\s*\.sheet-layout-column\s*\+\s*\.sheet-layout-column/);
});

test("Mage responsive sheet keeps the last Attribute inset and Arcana names in one column", async () => {
  const styles = await read("../game-lines/mage/styles/sheet.css");
  const responsiveStart = styles.indexOf("@media (max-width:900px) {");
  const responsiveEnd = styles.indexOf("@media (max-width:760px)", responsiveStart);
  const responsive = styles.slice(responsiveStart, responsiveEnd);
  assert.match(responsive, /\.mta-sheet \.official-trait-grid\s*\{\s*padding-right:6px;/);
  assert.doesNotMatch(responsive, /\.mta-sheet \.arcana-sheet-list\s*\{/);
});

test("Mage Arcana labels and dots use paired name-over-dots layout", async () => {
  const [sheet, styles] = await Promise.all([
    read("../game-lines/mage/sheet-view.tsx"),
    read("../game-lines/mage/styles/sheet.css"),
  ]);
  assert.match(sheet, /className="mage-arcana-glyph"[\s\S]*ATLANTEAN_ARCANA_GLYPHS\[name\][\s\S]*systemTerm\(name, locale\)[\s\S]*\(\{role\}\)[\s\S]*<DotValue value=\{Number\(value\)\} \/>/);
  assert.match(sheet, /const ATLANTEAN_ARCANA_GLYPHS:[^{]+\{[\s\S]*Death:\s*"B"[\s\S]*Fate:\s*"C"[\s\S]*Forces:\s*"D"[\s\S]*Life:\s*"E"[\s\S]*Matter:\s*"F"[\s\S]*Mind:\s*"G"[\s\S]*Prime:\s*"H"[\s\S]*Space:\s*"I"[\s\S]*Spirit:\s*"J"[\s\S]*Time:\s*"K"/);
  assert.match(sheet, /const ATLANTEAN_PATH_GLYPHS:[^{]+\{[\s\S]*Acanthus:\s*"M"[\s\S]*Mastigos:\s*"N"[\s\S]*Moros:\s*"O"[\s\S]*Obrimos:\s*"P"[\s\S]*Thyrsus:\s*"Q"/);
  assert.equal((sheet.match(/path: <MagePathField label=\{t\("ui\.path"\)\} value=\{data\.path\}\/>/g) ?? []).length, 2);
  assert.match(sheet, /className="mage-arcana-glyph"[\s\S]*\{glyph\}/);
  assert.match(sheet, /const role:\s*"R" \| "I" \| undefined = legacyRuling \|\| pathRuling \? "R" : inferior \? "I" : undefined/);
  assert.match(styles, /\.mage-arcana-line\s*\{[^}]*display:grid;[^}]*justify-items:center;[^}]*text-align:center;/);
  assert.match(styles, /\.mage-arcana-line > \.official-dots\s*\{[^}]*align-items:center;/);
  assert.match(styles, /\.mage-arcana-name\s*\{[^}]*justify-content:center;/);
  assert.match(styles, /\.mage-arcana-glyph\s*\{[^}]*font-family:"Magean Symbols";/);
  assert.match(styles, /\.mta-sheet \.official-field strong \.mage-arcana-glyph\s*\{[^}]*font-family:"Magean Symbols";/);
  assert.match(styles, /\.arcana-sheet-list\s*\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\);/);
});
