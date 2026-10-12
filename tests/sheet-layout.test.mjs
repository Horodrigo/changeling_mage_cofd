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
    desktopTabs: ["main", "poderes", "entitlement", "combate", "notas", "companheiros"],
    mobileTabs: ["main", "resumo", "stats", "detalhes", "poderes", "entitlement", "combate", "companheiros", "anotacoes"],
  },
  {
    id: "mage",
    label: "Mage",
    desktopTabs: ["main", "magia", "legacy", "combate", "notes", "companheiros"],
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

test("every game line exposes portrait editing in Builder Identity and Desktop/Mobile Notes", async () => {
  const tabs = [
    { id: "mortal", desktop: "notes", mobile: "notes" },
    { id: "changeling", desktop: "notas", mobile: "anotacoes" },
    { id: "mage", desktop: "notes", mobile: "anotacoes" },
    { id: "vampire", desktop: "notes", mobile: "notes" },
    { id: "werewolf", desktop: "notes", mobile: "notes", source: "sheet.tsx" },
  ];
  const [identity, paperShell] = await Promise.all([
    read("../app/builder/common-controls.tsx"),
    read("../app/workspace/character-paper-shell.tsx"),
  ]);
  assert.match(identity, /<CharacterImageControls value=\{portrait\} onChange=\{setPortrait\} \/>/);
  assert.ok(identity.indexOf('<h2>{t("ui.identity")}</h2>') < identity.indexOf("<CharacterImageControls"));
  assert.ok(identity.indexOf("<CharacterImageControls") < identity.indexOf('className="identity-grid"'));
  for (const line of ["mortal", "changeling", "mage", "vampire", "werewolf"]) {
    const builder = await read(`../game-lines/${line}/builder.tsx`);
    assert.match(builder, /<CommonIdentityStep[^>]*portrait=\{common\.portrait\} setPortrait=\{common\.setPortrait\}/, `${line} binds the shared portrait state`);
    assert.match(builder, /portrait: common\.portrait/, `${line} saves the portrait with character identity`);
  }
  assert.match(paperShell, /export function CharacterPortraitArea/);
  assert.match(paperShell, /<CharacterImageControls value=\{character\.character\.portrait\} onChange=\{applyPortrait\} \/>/);
  assert.match(paperShell, /else delete next\.character\.portrait;/, "removing a portrait deletes the stored key");
  assert.doesNotMatch(paperShell.slice(paperShell.indexOf("export function NotesArea"), paperShell.indexOf("export function CharacterPortraitArea")), /CharacterImageControls|portrait/i);

  const image = await read("../app/character-image.tsx");
  assert.doesNotMatch(image, /download/i, "the portrait card offers no download action");
  assert.match(image, /\{value\s*\n?\s*\? <Button[^]*?removeCharacterImage[^]*?: <label className="character-image-upload">/, "Add image is replaced by Remove image once a portrait exists");
  assert.match(image, /\{!value && <small>\{t\("ui\.characterImageHelp"\)\}<\/small>\}/, "the format hint only shows without a portrait");
  assert.ok(image.indexOf("character-image-preview") < image.indexOf("characterImageHelp"), "the format hint renders below the preview");

  for (const line of tabs) {
    const [sheet, desktop, mobile] = await Promise.all([
      read(`../game-lines/${line.id}/${line.source ?? "sheet-view.tsx"}`),
      read(`../game-lines/${line.id}/sheet-layout.desktop.ts`),
      read(`../game-lines/${line.id}/sheet-layout.mobile.ts`),
    ]);
    assert.match(sheet, new RegExp(`<TabsTrigger value="${line.desktop}"`), `${line.id} exposes Desktop Notes`);
    assert.match(sheet, new RegExp(`\\{ value: "${line.mobile}", label: t\\("(?:ui\\.notes|werewolf\\.notesTab)"\\)`), `${line.id} exposes Mobile Notes`);
    assert.match(sheet, /<CharacterPortraitArea character=\{character\} updateSheet=\{updateSheet\}\/>/, `${line.id} edits the portrait from Notes`);
    assert.match(desktop, /id: "portrait", order: 1[\s\S]*id: "portrait", column: 1, order: 1/, `${line.id} places the portrait first on Desktop`);
    assert.match(mobile, new RegExp(`${line.mobile}: flow\\(\\["portrait"`), `${line.id} places the portrait first on Mobile`);
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

test("Chronicle stays a Desktop-only identity field on every game line", async () => {
  for (const line of ["mortal", "changeling", "mage", "vampire", "werewolf"]) {
    const [mobile, desktop] = await Promise.all([
      read(`../game-lines/${line}/sheet-layout.mobile.ts`),
      read(`../game-lines/${line}/sheet-layout.desktop.ts`),
    ]);
    assert.doesNotMatch(mobile, /"chronicle"/, `${line} omits Chronicle from its Mobile identity layout`);
    assert.match(desktop, /"chronicle"/, `${line} keeps Chronicle on Desktop`);
  }
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


test("Mobile identity and Attributes respect the current layout wrappers in Mortal, Changeling and Vampire", async () => {
  for (const [line, theme] of [["mortal", "cofd"], ["changeling", "ctl"], ["vampire", "vtr"]]) {
    const styles = await read(`../game-lines/${line}/styles/sheet.css`);
    const identity = styles.match(new RegExp(`\\.${theme}-sheet\\.mobile-character-sheet \\.sheet-identity-grid \\{([^}]+)\\}`))[1];
    assert.match(identity, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(identity, /grid-auto-flow: row/);
    assert.doesNotMatch(styles, /grid-auto-flow:\s*column/);
    assert.doesNotMatch(styles, /sheet-identity-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
    assert.match(styles, /sheet-identity-grid > \.sheet-layout-column/);
    assert.match(styles, /sheet-identity-grid \.official-field\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
    if (line !== "mortal") {
      const attributes = styles.match(/mobile-attribute-grid\s*\{([^}]+)\}/)[1];
      assert.match(attributes, /gap:\s*8px/);
      assert.doesNotMatch(styles, /mobile-attribute-grid \.official-trait-block:(?:first|last)-child/);
      assert.doesNotMatch(styles, /minmax\(26px, 1fr\)/);
      assert.match(styles, /mobile-attribute-grid \.official-dot-row\s*\{\s*gap:\s*2px/);
      assert.match(styles, /@media \(max-width: 420px\)\s*\{[^}]*mobile-attribute-grid \.official-trait-line\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
    }
  }
});


test("Mage and Werewolf Mobile identities stack labels and values, including affiliation actions", async () => {
  for (const [line, theme, file] of [["mage", "mta", "sheet.css"], ["werewolf", "wtf", "mobile.css"]]) {
    const styles = await read(`../game-lines/${line}/styles/${file}`);
    assert.match(styles, new RegExp(`\\.${theme}-sheet\\.mobile-character-sheet \\.sheet-identity-grid \\.official-field\\s*\\{[^}]*display: grid;[^}]*grid-template-columns: minmax\\(0, 1fr\\)`));
    assert.match(styles, /sheet-identity-grid > \.sheet-layout-column\s*\{\s*gap: 6px/);
    assert.match(styles, /official-field :is\(strong, button\)\s*\{[^}]*white-space: normal;[^}]*overflow-wrap: anywhere/);
    assert.doesNotMatch(styles, /official-field\.wtf-lodge-identity\s*\{[^}]*flex-direction: row/);
  }
});

test("all Mobile sheets wrap tabs while keeping each label on one line", async () => {
  const [shared, tabs, wolf] = await Promise.all([
    read("../app/css/globals.css"),
    read("../app/workspace/sheet-tabs.tsx"),
    read("../game-lines/werewolf/styles/mobile.css"),
  ]);
  assert.match(tabs, /className="ctl-sheet-tabs mobile-sheet-tabs"/);
  assert.doesNotMatch(tabs, /scrollIntoView|scrollTo|document\.querySelector/, "Selecting a tab must not scroll the application viewport");
  assert.match(tabs, /const select=\(next:string\)=>\{onValueChange\(next\);\}/);
  const list = shared.match(/\.cod-sheet\.mobile-character-sheet \.mobile-sheet-tabs > \.ctl-sheet-tab-list\s*\{([^}]+)\}/)[1];
  assert.match(list, /flex-wrap: wrap/);
  assert.match(list, /height: auto/);
  assert.match(list, /overflow: visible/);
  const buttons = shared.match(/\.cod-sheet\.mobile-character-sheet \.mobile-sheet-tabs > \.ctl-sheet-tab-list button\s*\{([^}]+)\}/)[1];
  assert.match(buttons, /flex: 1 1 22%/);
  assert.match(buttons, /min-height: 44px/);
  assert.match(buttons, /min-width: max-content/);
  assert.match(buttons, /white-space: nowrap/);
  assert.doesNotMatch(buttons, /font:|font-family:|color:/);
  assert.match(shared, /ctl-sheet-tab-list button:nth-child\(-n\+3\)\s*\{\s*flex-basis: 30%/);
  assert.doesNotMatch(wolf.slice(0, wolf.indexOf(".mobile-sheet-page")), /flex-wrap:|flex-basis:/, "Werewolf consumes the common tab geometry");
});
