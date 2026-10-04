import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const groups = ["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"];
const data = Object.fromEntries(groups.map(group => [`vampire-${group}`, read(`public/game-lines/vampire/data/${group}.json`)]));
const anchors = data["vampire-anchors"];
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("all 27 Vampire Anchors have complete presentation for both Willpower recovery triggers without replacing canonical identity", () => {
  assert.equal(anchors.length, 27);
  assert.equal(new Set(anchors.map(item => item.id)).size, 27);
  for (const item of anchors) {
    assert.deepEqual(Object.keys(item.presentationPt).sort(), ["allWillpower", "singleWillpower"]);
    for (const field of ["singleWillpower", "allWillpower"]) {
      assert.ok(item.presentationPt[field]?.trim(), `${item.id}.${field}`);
      assert.notEqual(item.presentationPt[field], item[field], `${item.id}.${field}`);
    }
    assert.equal(item.source, "Vampire: The Requiem Second Edition");
  }
  assert.match(anchors.find(item => item.id === "rebel").presentationPt.allWillpower, /Tradição dos Membros.*Coalizão/);
  const manifest = read("public/shared/data/catalog-manifest.json");
  assert.ok(manifest.catalogs["vampire-anchors"].version >= 2);
  assert.equal(manifest.catalogs["vampire-anchors"].url, "/game-lines/vampire/data/anchors.json");
});

test("all 16 Vampire Clans have Portuguese Bane titles/summaries with preserved numeric limits and proper names", () => {
  const clans = data["vampire-clans"];
  assert.equal(clans.length, 16);
  for (const item of clans) {
    assert.deepEqual(Object.keys(item.presentationPt).sort(), ["baneName", "baneSummary"]);
    for (const field of ["baneName", "baneSummary"]) {
      assert.ok(item.presentationPt[field]?.trim(), `${item.id}.${field}`);
      assert.notEqual(item.presentationPt[field], item[field], `${item.id}.${field}`);
    }
    assert.deepEqual(item.presentationPt.baneSummary.match(/\d+/g) ?? [], item.baneSummary.match(/\d+/g) ?? [], item.id);
    if (!["hollow-mekhet", "twice-cursed"].includes(item.id)) assert.equal(item.translatedName, item.name, item.id);
  }
  assert.equal(clans.find(item => item.id === "hollow-mekhet").translatedName, "Mekhet Vazios");
  assert.equal(clans.find(item => item.id === "twice-cursed").translatedName, "Duplamente Amaldiçoados");
  assert.match(clans.find(item => item.id === "gangrel").presentationPt.baneSummary, /Cavalgar a Onda/);
  assert.match(clans.find(item => item.id === "jiang-shi").presentationPt.baneSummary, /Enamorado.*Marcado por Cicatrizes/);
  assert.ok(read("public/shared/data/catalog-manifest.json").catalogs["vampire-clans"].version >= 5);
});

test("all 23 Vampire Covenants localize descriptions and advantages while retaining proper names and Homebrew exclusions", () => {
  const covenants = data["vampire-covenants"];
  assert.equal(covenants.length, 23);
  assert.equal(new Set(covenants.map(item => item.id)).size, 23);
  for (const item of covenants) {
    assert.deepEqual(Object.keys(item.presentationPt).sort(), ["advantage", "description"]);
    assert.ok(item.presentationPt.advantage.trim(), item.id);
    assert.ok(item.presentationPt.description.trim(), item.id);
    assert.notEqual(item.presentationPt.description, item.description, item.id);
  }
  for (const id of ["invictus", "lancea-et-sanctum", "ordo-dracul", "weihan-cynn", "ahl-al-mumit", "al-amin", "firawn", "jaliniyya", "inconnu", "moirai"]) {
    const item = covenants.find(item => item.id === id);
    assert.equal(item.translatedName, item.name, id);
  }
  assert.equal(covenants.find(item => item.id === "covenantless").translatedName, "Sem Coalizão");
  const thorns = covenants.find(item => item.id === "children-of-the-thorns");
  assert.match(thorns.presentationPt.advantage, /Cisma.*Cripta\/Saída.*Atendente da Sepultura.*Explorador Sagrado.*Tocado por Mary.*excluídos/);
  const propylaia = covenants.find(item => item.id === "faithful-of-propylaia");
  for (const item of [thorns, propylaia]) assert.equal(item.sourceId, "h-vtr-agony-ecstasy");
  assert.match(propylaia.presentationPt.advantage, /Ofícios \(Açougue\) ou Ocultismo \(Oferendas\).*Socialização ou Subterfúgio.*cinco pontos.*Visão Arcana/);
  assert.ok(propylaia.presentationPt.advantage.startsWith(read("public/shared/data/merits-pt.json")["core-2ed:mystery-cult-initiation"].name));
  assert.ok(read("public/shared/data/catalog-manifest.json").catalogs["vampire-covenants"].version >= 6);
});

test("all 48 localized official/Homebrew Bloodlines have complete Portuguese reference fields without changing numeric limits", () => {
  const bloodlines = data["vampire-bloodlines"].filter(item => item.presentationPt);
  assert.equal(bloodlines.length, 48);
  for (const definition of bloodlines) {
    const fields = ["parentClan", "nicknames", "summary", "baneName", "baneSummary", ...["requirements", "giftName", "giftSummary"].filter(key => definition[key])];
    assert.deepEqual(Object.keys(definition.presentationPt).sort(), fields.sort(), definition.id);
    assert.equal(definition.presentationPt.nicknames.length, definition.nicknames.length, definition.id);
    for (const key of fields.filter(key => key !== "nicknames")) {
      assert.ok(definition.presentationPt[key].trim(), `${definition.id}.${key}`);
      assert.deepEqual(definition.presentationPt[key].match(/\d+/g) ?? [], definition[key].match(/\d+/g) ?? [], `${definition.id}.${key}`);
    }
  }
  assert.equal(bloodlines.filter(item => item.sourceId.startsWith("h-vtr-")).length, 34);
  assert.ok(bloodlines.find(item => item.id === "vardyvle").presentationPt.nicknames.includes("Tiresias"));
  assert.equal(bloodlines.find(item => item.id === "icelus").presentationPt.parentClan, "Mekhet ou Ventrue");
  assert.equal(bloodlines.find(item => item.id === "children-of-judas").translatedName, "Filhos de Judas");
  for (const properName of ["Moretti", "Rózsa", "Syska"]) assert.ok(bloodlines.find(item => item.id === "erzsebet").presentationPt.nicknames.includes(properName));
  const coreConditions = read("public/shared/data/conditions-pt.json");
  assert.ok(bloodlines.find(item => item.id === "moda-mortale").presentationPt.baneSummary.includes(coreConditions.broken.name));
  assert.match(bloodlines.find(item => item.id === "khaibit").presentationPt.baneSummary, /Tilt Cego.*Udjat/);
});

test("Vampire references render Anchors, Clans, Covenants and Bloodlines in EN/PT/EN without mutating choices", async () => {
  const selection = { mask_id: "rebel", dirge_id: "visionary", notes: "Authored English stays." };
  const before = JSON.stringify({ data, selection });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "anchor-locale-and-test-surface", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/vampire/builder.tsx")) return `${code}\nexport { AnchorChoice, CovenantSelector };`;
      if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { BaneEditor };`;
      // SSR normally mounts only the active tab; exercise every published Homebrew category.
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampireReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/reference.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requested = [];
      const reference = freezeCatalogData(await vampireReferenceCatalogGroup.load({ getCatalog: async id => { requested.push(id); return data[id]; } }));
      assert.deepEqual(requested.sort(), groups.map(group => `vampire-${group}`).sort());
      const { vampireAnchorPresentation, vampireBloodlinePresentation, vampireClanPresentation, vampireCovenantPresentation } = await vite.ssrLoadModule("/game-lines/vampire/reference-presentation.ts");
      const { AnchorChoice, CovenantSelector } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
      const { BaneEditor } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { SheetField } = await vite.ssrLoadModule("/app/workspace/character-paper-shell.tsx");
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const refuseMutation = () => { throw new Error("Render changed a saved Anchor"); };
      for (const definition of reference.anchors) {
        const presented = vampireAnchorPresentation(definition, locale);
        assert.equal(presented.id, definition.id);
        assert.equal(presented.name, definition.name);
        if (locale === "en-US") assert.equal(presented, definition);
        assert.equal(Object.isFrozen(definition.presentationPt), true);
        const choice = render(AnchorChoice, { label: translate(locale, "ui.mask"), value: definition.id, setValue: refuseMutation, anchors: reference.anchors, locale, invalid: false });
        assert.ok(choice.includes(escape(translate(locale, "ui.recoverWillpowerSummary", { single: presented.singleWillpower, all: presented.allWillpower }))), `${locale}: ${definition.id} creation`);
        for (const [key, field] of [["ui.mask", "singleWillpower"], ["ui.dirge", "allWillpower"]]) {
          const html = render(SheetField, { label: translate(locale, key), value: locale === "pt-BR" ? definition.translatedName : definition.name, tooltip: presented[field] });
          assert.ok(html.includes(`title="${escape(presented[field])}"`), `${locale}: ${definition.id} ${key}`);
        }
      }
      const authored = { id: "unavailable:anchor", name: "Authored Anchor", singleWillpower: "Authored trigger", allWillpower: "Authored full trigger" };
      assert.equal(vampireAnchorPresentation(authored, locale), authored);
      const character = { id: "test-clan", line_data: { banes: [{ id: "authored-bane", name: "Authored personal Bane" }] }, current_state: {} };
      const characterBefore = JSON.stringify(character);
      for (const definition of reference.clans) {
        const presented = vampireClanPresentation(definition, locale);
        assert.equal(presented.id, definition.id);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.favoredAttributes, definition.favoredAttributes);
        assert.equal(presented.disciplines, definition.disciplines);
        if (locale === "en-US") assert.equal(presented, definition);
        assert.equal(Object.isFrozen(definition.presentationPt), true);
        const html = render(BaneEditor, { character, updateSheet: refuseMutation, clanBaneName: presented.baneName, clanBaneSummary: presented.baneSummary, vastDynasty: false, clanBaneActive: true });
        assert.ok(html.includes(escape(presented.baneName)), `${locale}: ${definition.id} name`);
        assert.ok(html.includes(escape(presented.baneSummary)), `${locale}: ${definition.id} summary`);
        assert.ok(html.includes('value="Authored personal Bane"'));
      }
      assert.equal(JSON.stringify(character), characterBefore);
      const customClan = { id: "homebrew:clan", name: "Authored Clan", baneName: "Authored Bane", baneSummary: "Authored English stays." };
      assert.equal(vampireClanPresentation(customClan, locale), customClan);
      for (const definition of reference.covenants) {
        const presented = vampireCovenantPresentation(definition, locale);
        assert.equal(presented.id, definition.id);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.source, definition.source);
        assert.equal(presented.sourceId, definition.sourceId);
        if (locale === "en-US") assert.equal(presented, definition);
        assert.equal(Object.isFrozen(definition.presentationPt), true);
        const html = render(CovenantSelector, { items: reference.covenants, values: [definition.id], primary: definition.id, onToggle: refuseMutation, onPrimary: refuseMutation, locale, invalid: false });
        assert.ok(html.includes(`<strong>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</strong>`), `${locale}: ${definition.id} name`);
        assert.ok(html.includes(escape(presented.description)), `${locale}: ${definition.id} description`);
        assert.ok(html.includes(escape(presented.advantage)), `${locale}: ${definition.id} advantage`);
        if (locale === "pt-BR") assert.ok(!html.includes(escape(definition.description)), definition.id);
      }
      const customCovenant = { id: "homebrew:covenant", name: "Invictus", translatedName: "Invictus", group: "uncommon", description: "Authored Covenant stays.", advantage: "Authored benefit stays." };
      assert.equal(vampireCovenantPresentation(customCovenant, locale), customCovenant);
      const customChoice = render(CovenantSelector, { items: [customCovenant], values: [customCovenant.id], primary: customCovenant.id, onToggle: refuseMutation, onPrimary: refuseMutation, locale, invalid: false });
      assert.ok(customChoice.includes(customCovenant.description));
      assert.ok(customChoice.includes(customCovenant.advantage));
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const emptyPowers = Object.fromEntries(["disciplines", "ritualDisciplines", "devotions", "lashes", "cruacRites", "thebanMiracles", "gildedInvocations", "detournements"].map(key => [key, []]));
      const catalogs = { get: id => ({ "vampire-reference": reference, "vampire-powers": emptyPowers, "vampire-conditions": [], "core-merits": [], "vampire-merits": [] })[id] };
      const homebrewHtml = render(vampireHomebrew.Component, { catalogs });
      for (const id of ["children-of-the-thorns", "faithful-of-propylaia"]) {
        const definition = reference.covenants.find(item => item.id === id);
        const presented = vampireCovenantPresentation(definition, locale);
        assert.ok(homebrewHtml.includes(escape(presented.description)), `${locale}: ${id} Homebrew description`);
        assert.ok(homebrewHtml.includes(escape(presented.advantage)), `${locale}: ${id} Homebrew advantage`);
        assert.ok(homebrewHtml.includes(escape(definition.source)));
      }
      const { BloodlinePage } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-page.tsx");
      const bloodlineCharacter = { line_data: {}, current_state: {} };
      for (const definition of reference.bloodlines.filter(item => item.presentationPt)) {
        const presented = vampireBloodlinePresentation(definition, locale);
        assert.equal(presented.id, definition.id);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.disciplines, definition.disciplines);
        assert.equal(presented.parentClanIds, definition.parentClanIds);
        if (locale === "en-US") assert.equal(presented, definition);
        const saved = { ...bloodlineCharacter, line_data: { bloodline_id: definition.id, bloodline_favored_attribute: definition.favoredAttributes[0], notes: "Authored notes remain." } };
        const savedBefore = JSON.stringify(saved);
        const html = render(BloodlinePage, { character: saved, updateSheet: refuseMutation, bloodlines: reference.bloodlines, powers: emptyPowers, onRemoved: refuseMutation });
        assert.ok(html.includes(`<h2>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</h2>`), `${locale}: ${definition.id} name`);
        for (const key of ["summary", "parentClan", "baneName", "baneSummary", ...["requirements", "giftName", "giftSummary"].filter(key => definition[key])]) {
          assert.ok(html.includes(escape(presented[key])), `${locale}: ${definition.id}.${key}`);
        }
        for (const nickname of presented.nicknames) assert.ok(html.includes(escape(nickname)), `${locale}: ${definition.id} ${nickname}`);
        assert.equal(JSON.stringify(saved), savedBefore);
        assert.equal(Object.isFrozen(definition.presentationPt.nicknames), true);
        if (definition.sourceId.startsWith("h-vtr-")) for (const key of ["summary", "giftName", "giftSummary", "baneName", "baneSummary"].filter(key => definition[key])) assert.ok(homebrewHtml.includes(escape(presented[key])), `${locale}: ${definition.id} Homebrew ${key}`);
      }
      const customBloodline = { ...reference.bloodlines[0], id: "homebrew:bloodline:test", name: "Ankou", translatedName: "Ankou", summary: "Authored Bloodline text stays.", nicknames: ["Authored nickname"], baneName: "Authored Bane", baneSummary: "Authored Bloodline Bane stays.", presentationPt: undefined };
      assert.equal(vampireBloodlinePresentation(customBloodline, locale), customBloodline);
      const customBloodlineHtml = render(BloodlinePage, { character: { line_data: { bloodline_id: customBloodline.id }, current_state: {} }, updateSheet: refuseMutation, bloodlines: [customBloodline], powers: emptyPowers, onRemoved: refuseMutation });
      for (const key of ["summary", "baneName", "baneSummary"]) assert.ok(customBloodlineHtml.includes(customBloodline[key]));
      assert.equal(JSON.stringify({ data, selection }), before);
    } finally { await vite.close(); }
  }
  const sheet = readFileSync(new URL("../game-lines/vampire/sheet-view.tsx", import.meta.url), "utf8");
  assert.match(sheet, /tooltip=\{mask && vampireAnchorPresentation\(mask, locale\)\.singleWillpower\}/);
  assert.match(sheet, /tooltip=\{dirge && vampireAnchorPresentation\(dirge, locale\)\.allWillpower\}/);
  assert.match(sheet, /clanBaneName=\{presentedClan\?\.baneName/);
  assert.match(sheet, /clanBaneSummary=\{presentedClan\?\.baneSummary/);
  assert.match(sheet, /name: presentedBloodline\.baneName, summary: presentedBloodline\.baneSummary/);
});
