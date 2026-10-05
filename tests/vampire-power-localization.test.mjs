import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const powers = read("public/game-lines/vampire/data/powers.json");
const selected = powers.disciplines.filter(item => item.presentationPt);
const rituals = powers.ritualDisciplines.filter(item => item.presentationPt);
const lashes = powers.lashes.filter(item => item.presentationPt);
const formulae = powers.kimiyaFormulae.filter(item => item.presentationPt);
const sacrileges = powers.therionSacrileges.filter(item => item.presentationPt);
const invocations = powers.gildedInvocations.filter(item => item.presentationPt);
const detournements = powers.detournements.filter(item => item.presentationPt);
const coils = powers.coils.filter(item => item.presentationPt);
const scales = powers.scales.filter(item => item.presentationPt);
const rites = powers.cruacRites.filter(item => item.presentationPt);
const miracles = powers.thebanMiracles.filter(item => item.presentationPt);
const devotions = powers.devotions.filter(item => item.presentationPt);
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const fields = ["summary", "cost", "requirement", "condition", "dicePool", "action", "duration", "contestedBy", "resistedBy", "sacrament", "effect", "procedure", "outcome", "prerequisites", "statusRequirement", "humanityCapFormula"];

test("Vampire official and Homebrew power presentations cover existing fields and preserve numeric limits", () => {
  assert.deepEqual(selected.map(item => item.id).sort(), ["animalism", "auspex", "blood-tether", "cachexy", "celerity", "crochan", "dead-signal", "dominate", "interface", "lithopedia", "majesty", "nightmare", "obfuscate", "ortam", "praestantia", "protean", "resilience", "spiritus-sancti", "surge", "triadic-evolution", "truths-of-erebus", "vigor", "vitiate"]);
  assert.equal(selected.flatMap(item => item.levels).length, 110);
  assert.deepEqual(rituals.map(item => item.id).sort(), ["cruac", "gilded-cage", "kimiya", "theban", "therion"]);
  assert.deepEqual(lashes.map(item => item.id).sort(), ["devotion-iron-joy", "devotion-shared-feast"]);
  assert.deepEqual(formulae.map(item => item.id).sort(), ["kimiya-al-ajsad", "kimiya-curse-monkey-prince", "kimiya-ebony-horse", "kimiya-sayihs-khol", "kimiya-spiders-hijra"]);
  assert.deepEqual(sacrileges.map(item => item.id).sort(), ["therion-apotheosis", "therion-avatar-apollyon", "therion-curse-faithful", "therion-demons-tongue", "therion-morning-star", "therion-nine-choirs", "therion-profanity"]);
  assert.equal(invocations.length, 10);
  assert.equal(detournements.length, 5);
  assert.deepEqual(devotions.map(item => item.id).sort(), ["devotion-body-of-will", "devotion-chain-of-command", "devotion-cloak-the-gathering", "devotion-conditioning", "devotion-cross-contamination", "devotion-cult-of-personality", "devotion-enchantment", "devotion-enfeebling-aura", "devotion-force-of-nature", "devotion-foul-grave", "devotion-gargoyles-vigilance", "devotion-hint-of-fear", "devotion-juggernauts-gait", "devotion-quicken-sight", "devotion-reasons-salon", "devotion-riot", "devotion-shared-sight", "devotion-shatter-the-shroud", "devotion-stalwart-servant", "devotion-subsume-lesser-beast", "devotion-summoning-dominate", "devotion-summoning-majesty", "devotion-suns-brutal-dreamscape", "devotion-the-wish", "devotion-touch-of-deprivation", "devotion-undying-familiar", "devotion-vermin-flood", "devotion-wet-dream", "devotion-wraiths-presence"]);
  assert.equal(rites.length, 26);
  assert.equal(miracles.length, 29);
  assert.deepEqual(Object.fromEntries([...new Set(miracles.map(item => item.source))].map(source => [source, miracles.filter(item => item.source === source).length])), { "Better Feared: Nosferatu": 5, "Secrets of the Covenants": 14, "Vampire: The Requiem Second Edition": 9, "Thousand Years of Night": 1 });
  assert.deepEqual(Object.fromEntries([...new Set(rites.map(item => item.source))].map(source => [source, rites.filter(item => item.source === source).length])), { "Vampire: The Requiem Second Edition": 10, "Secrets of the Covenants": 14, "Thousand Years of Night": 2 });
  assert.deepEqual(coils.map(item => item.id).sort(), ["coil-ascendant", "coil-quintessence", "coil-voivode", "coil-wyrm", "coil-zirnitra", "coil-ziva"]);
  assert.equal(coils.flatMap(item => item.levels).length, 30);
  assert.deepEqual(scales.map(item => item.id).sort(), powers.scales.map(item => item.id).sort());
  assert.equal(scales.length, 19);
  assert.deepEqual(Object.fromEntries([...new Set(scales.map(item => item.source))].map(source => [source, scales.filter(item => item.source === source).length])), {
    "Night Horrors: Spilled Blood": 4,
    "Secrets of the Covenants": 4,
    "Thousand Years of Night": 1,
    "Vampire: The Requiem Second Edition": 10,
  });
  const donning = rites.find(item => item.id === "cruac-donning-beasts-flesh");
  assert.equal(donning.cost, "1 Vitae");
  assert.equal(donning.action, "Three turns to transform");
  assert.equal(donning.duration, undefined);
  assert.match(rites.find(item => item.id === "cruac-mantle-amorous-fire").effect, /spends a point of Willpower to rise/);
  for (const id of ["cruac-mantle-amorous-fire", "cruac-mantle-beasts-breath", "cruac-mantle-glorious-dervish", "cruac-mantle-crone", "cruac-mantle-predator-goddess"]) assert.equal(rites.find(item => item.id === id).cost, "1 Willpower to rise after the dance");
  assert.match(rites.find(item => item.id === "cruac-curse-aphrodites-favor").requirement, /three separate nights/);
  assert.match(rites.find(item => item.id === "cruac-gorgons-gaze").effect, /one limb per success.*one aggravated damage.*five lethal damage.*until they heal a single level/);
  assert.match(rites.find(item => item.id === "cruac-bounty-storm").effect, /Cash equipment with Availability five.*Humanity 2 or lower/);
  assert.equal(miracles.find(item => item.id === "theban-apple-eden").sacrament, "An apple and a drop of Vitae");
  assert.match(miracles.find(item => item.id === "theban-apparition-host").effect, /target gains Frightened and mortal bystanders gain Spooked/);
  const icon = miracles.find(item => item.id === "theban-bloody-icon");
  assert.equal(icon.duration, "Until the end of the night");
  assert.match(icon.effect, /Later that night, the statue crumbles/);
  assert.equal(icon.effect.includes("nor Vinculum"), false);
  const pledge = miracles.find(item => item.id === "theban-pledge-worthless-one");
  assert.match(pledge.effect, /cannot maintain a Touchstone.*Retainer\(Ghoul\) •••••: three total dots of the regnant's Disciplines, not three additional dots/);
  assert.match(pledge.presentationPt.effect, /Lacaio \(Ghoul\) •••••: três pontos totais das Disciplinas do regente/);
  assert.equal(miracles.find(item => item.id === "theban-guiding-star").duration, "One night, extendable with Willpower");
  assert.match(miracles.find(item => item.id === "theban-apocalypse").effect, /initial radius is half a mile, increasing by half a mile for every five successes beyond the first ten/);
  assert.equal(miracles.find(item => item.id === "theban-apocalypse").effect.includes("Clash"), false);
  for (const level of selected.find(item => item.id === "lithopedia").levels) {
    assert.match(level.effect, /half a square mile.*another half mile per Potency/);
    assert.match(level.presentationPt.effect, /meia milha quadrada.*outra meia milha por Potência/);
  }
  assert.equal(JSON.stringify(powers).includes("Potência do Sangue"), false, "Approved Blood Potency terminology remains uniform");
  const zirnitra = coils.find(item => item.id === "coil-zirnitra");
  assert.match(zirnitra.levels[1].effect, /Drawbacks do not always occur/);
  assert.match(zirnitra.levels[2].effect, /Supernatural Merits cost one Experience less, to a minimum of one; already-owned Supernatural Merits refund one Experience each/);
  for (const [id, page] of [["gilded-crowdsourcing", 137], ["gilded-green-light", 137], ["gilded-cordon", 138], ["gilded-gerrymandering", 138]]) assert.equal(invocations.find(item => item.id === id).page, page);
  const therion = rituals.find(item => item.id === "therion");
  assert.match(therion.effect, /^If Humanity is higher than the Sacrilege rating/);
  assert.equal(therion.minimumHumanityToCast, undefined);
  assert.match(rituals.find(item => item.id === "gilded-cage").effect, /in a Convergence, ritual rolls achieve exceptional success with three successes instead of five/);
  for (const definition of [...selected, ...rituals, ...lashes, ...formulae, ...sacrileges, ...invocations, ...detournements, ...coils, ...scales, ...rites, ...miracles, ...devotions]) {
    for (const item of [definition, ...(definition.levels ?? [])]) {
      assert.ok(item.presentationPt, `${definition.id}.${item.rating ?? "summary"}`);
      for (const field of fields.filter(key => item[key])) {
        assert.ok(item.presentationPt[field]?.trim(), `${definition.id}.${item.rating ?? "summary"}.${field}`);
        assert.deepEqual(item.presentationPt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? []);
      }
      assert.deepEqual(Object.keys(item.presentationPt.rollResults ?? {}).sort(), Object.keys(item.rollResults ?? {}).sort());
      for (const [result, text] of Object.entries(item.rollResults ?? {})) {
        assert.ok(item.presentationPt.rollResults[result]?.trim());
        assert.deepEqual(item.presentationPt.rollResults[result].match(/\d+/g) ?? [], text.match(/\d+/g) ?? []);
      }
      assert.equal(item.presentationPt.suggestedModifiers?.length ?? 0, item.suggestedModifiers?.length ?? 0);
      for (const [index, modifier] of (item.suggestedModifiers ?? []).entries()) {
        const translated = item.presentationPt.suggestedModifiers[index];
        assert.equal(translated.modifier, modifier.modifier.replaceAll(" to ", " a "));
        assert.ok(translated.situation.trim());
        assert.deepEqual(translated.situation.match(/\d+/g) ?? [], modifier.situation.match(/\d+/g) ?? []);
      }
    }
  }
  assert.equal(selected.find(item => item.id === "truths-of-erebus").translatedName, "Verdades de Erebus");
  assert.match(selected.find(item => item.id === "animalism").levels[0].presentationPt.dicePool, /Empatia com Animais/);
});

test("Vampire creation, XP, Desktop/Mobile cards and Homebrew render EN/PT/EN without changing purchases or canonical parser inputs", async () => {
  const dataBefore = JSON.stringify(powers);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "power-locale-test-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/vampire/sheet-view.tsx")) return `${code}\nexport { DisciplineCards, RitualDisciplines, PurchasedPowers };`;
      if (path.endsWith("/game-lines/vampire/experience-panel.tsx")) return code.replace('useState<PurchaseType>("attribute")', 'useState<PurchaseType>(character.character.concept === "devotion-test" ? "devotion" : character.character.concept === "rite-test" ? "rite" : character.character.concept === "sacrilege-test" ? "sacrilege" : character.character.concept === "miracle-test" ? "miracle" : character.character.concept === "lash-test" ? "lash" : character.character.concept === "formula-test" ? "formula" : character.character.concept === "invocation-test" ? "invocation" : character.character.concept === "detournement-test" ? "detournement" : character.character.concept === "scale-test" ? "scale" : "discipline")').replace('const [target, setTarget] = useState("");', 'const [target, setTarget] = useState(character.character.concept === "therion-upgrade-test" ? "therion" : "");');
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
      if (path.endsWith("/components/ui/select.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Select, Wrapper as SelectContent, Wrapper as SelectGroup, Wrapper as SelectItem, Wrapper as SelectLabel, Wrapper as SelectSeparator, Wrapper as SelectTrigger, Wrapper as SelectValue };';
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampirePowersCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/powers.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requests = [];
      const catalog = freezeCatalogData(await vampirePowersCatalogGroup.load({ getCatalog: async id => { requests.push(id); return powers; } }));
      assert.deepEqual(requests, ["vampire-powers"]);
      const { vampirePowerPresentation } = await vite.ssrLoadModule("/game-lines/vampire/power-presentation.ts");
      const { vampireHomebrewSourceId } = await vite.ssrLoadModule("/game-lines/vampire/homebrew-catalog.ts");
      const { vampireDisciplinePrerequisitesMet } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
      const { vampireExperienceLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
      const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
      const { VampireExperiencePanel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
      const { DisciplineCards, RitualDisciplines, PurchasedPowers } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { vampireBuilder } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const { normalizeVampireCatalogHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/catalog-homebrews.ts");
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, read(`public/game-lines/vampire/data/${group}.json`)]));
      const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
      const statusCatalog = withMeritPresentation(read("public/game-lines/vampire/data/merits.json").filter(item => item.id === "vtr-kindred-status"), read("public/game-lines/vampire/data/merits-pt.json"));
      const coreCultCatalog = withMeritPresentation(read("public/shared/data/merits.json").filter(item => item.id === "core-2ed:mystery-cult-initiation"), read("public/shared/data/merits-pt.json"));
      const catalogs = { get: id => ({ "vampire-powers": catalog, "vampire-reference": reference, "core-merits": coreCultCatalog, "vampire-merits": statusCatalog, "vampire-conditions": [] })[id] };
      const backgrounds = [
        ...[...new Set(selected.map(item => item.bloodlineId).filter(Boolean))].map(bloodlineId => ({ bloodlineId, clanId: reference.bloodlines.find(item => item.id === bloodlineId).parentClanIds[0] })),
        ...[...new Set(selected.flatMap(item => item.clanIds ?? []))].map(clanId => ({ clanId, bloodlineId: "" })),
        ...[...new Set(selected.flatMap(item => item.covenantIds ?? []))].map(covenantId => ({ clanId: "gangrel", bloodlineId: "", covenantIds: [covenantId] })),
      ];
      const characters = backgrounds.map(({ bloodlineId, clanId, covenantIds = [] }) => {
        const character = blankPrintCharacter("VtR");
        const ratings = Object.fromEntries(selected.filter(item => (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.clanIds || item.clanIds.includes(clanId)) && (!item.covenantIds || item.covenantIds.some(id => covenantIds.includes(id)))).map(item => [item.name, 5]));
        character.line_data = { ...character.line_data, clan_id: clanId, bloodline_id: bloodlineId, covenant_ids: covenantIds, disciplines: ratings, notes: "Authored English stays." };
        character.current_state = { ...character.current_state, experience_available: 4, experience_spent: 9, creation_draft: true, creation_draft_step: 3 };
        return character;
      });
      const charactersBefore = JSON.stringify(characters);
      const noMutation = () => { throw new Error("Render changed the saved character"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const sheet = characters.map(character => render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: character.line_data.disciplines, coilRatings: {}, locale, onRaiseFamiliar: noMutation })).join("");
      const partial = characters.map(character => render(DisciplineCards, { character, updateSheet: noMutation, powers: catalog, disciplines: Object.fromEntries(Object.keys(character.line_data.disciplines).map(name => [name, 3])), coilRatings: {}, locale, onRaiseFamiliar: noMutation })).join("");
      const experience = characters.map(character => render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true })).join("");
      const creation = characters.map(character => render(vampireBuilder.Component, { player: "Player", initial: character, onCancel: noMutation, onSave: noMutation, onSaveDraft: noMutation, catalogs })).join("");
      const homebrew = render(vampireHomebrew.Component, { catalogs });
      for (const definition of catalog.disciplines.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        assert.equal(presented.name, definition.name);
        assert.equal(presented.id, definition.id);
        assert.ok(Object.isFrozen(definition.presentationPt));
        if (locale === "en-US") assert.equal(presented, definition);
        for (const field of fields.filter(key => presented[key])) {
          for (const html of [sheet, experience]) assert.ok(html.includes(escape(presented[field])), `${locale}: ${definition.id}.${field}`);
        }
        if (!definition.bloodlineId) assert.ok(creation.includes(escape(locale === "pt-BR" ? definition.translatedName : definition.name)));
        const homebrewDefinition = vampireHomebrewSourceId(definition)?.startsWith("h-");
        if (homebrewDefinition) {
          for (const field of fields.filter(key => presented[key])) assert.ok(homebrew.includes(escape(presented[field])), `${locale}: ${definition.id}.${field} Homebrew`);
        }
        for (const level of definition.levels) {
          const text = vampirePowerPresentation(level, locale);
          for (const field of fields.filter(key => text[key])) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(text[field])), `${locale}: ${definition.id}.${level.rating}.${field}`);
            if (homebrewDefinition) assert.ok(homebrew.includes(escape(text[field])), `${locale}: ${definition.id}.${level.rating}.${field} Homebrew`);
          }
          for (const result of Object.values(text.rollResults ?? {})) {
            for (const html of [sheet, experience]) assert.ok(html.includes(escape(result)));
            if (homebrewDefinition) assert.ok(homebrew.includes(escape(result)));
          }
          for (const modifier of text.suggestedModifiers ?? []) {
            for (const html of [sheet, experience, ...(homebrewDefinition ? [homebrew] : [])]) {
              assert.ok(html.includes(escape(modifier.modifier)));
              assert.ok(html.includes(escape(modifier.situation)));
            }
          }
          const title = `<strong>${"•".repeat(level.rating)} ${escape(locale === "pt-BR" ? level.translatedName : level.name)}</strong>`;
          assert.ok(sheet.includes(title));
          assert.equal(partial.includes(title), level.rating <= 3);
          if (level.targetSuccesses !== undefined) {
            assert.equal(text.targetSuccesses, level.targetSuccesses);
            const label = locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes";
            const detail = sheet.slice(sheet.indexOf(title), sheet.indexOf("</details>", sheet.indexOf(title)));
            assert.ok(detail.includes(`<strong>${label}:</strong> ${level.targetSuccesses}`));
            assert.ok(experience.includes(`${label}: ${level.targetSuccesses}`));
          }
        }
        const character = characters.find(item => item.line_data.disciplines[definition.name]);
        assert.equal(vampireDisciplinePrerequisitesMet(`${definition.name} 5`, character.line_data.disciplines, catalog.disciplines.map(item => item.name)), true);
        const receipt = { id: "old-purchase", label: "Original label", rating: 5, cost: 4, undo: { kind: "discipline", name: definition.name, amount: 1 } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, [], catalog, locale), `${locale === "pt-BR" ? definition.translatedName : definition.name} 5`);
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const affiliations = { cruac: "circle-of-the-crone", theban: "lancea-et-sanctum", kimiya: "jaliniyya", therion: "tenth-choir", "gilded-cage": "architects-of-the-monolith" };
      const ritualCharacters = Object.fromEntries(rituals.map(definition => {
        const character = blankPrintCharacter("VtR");
        const ratingKey = `${definition.id.replaceAll("-", "_")}_rating`;
        character.merits = [{ definitionId: "vtr-kindred-status", instanceId: `status-${definition.id}`, name: "Kindred Status", dots: 1, creationDots: 1, configuration: { group: affiliations[definition.id] } }];
        character.line_data = { ...character.line_data, clan_id: "gangrel", covenant_ids: [affiliations[definition.id]], blood_sorcery: { [ratingKey]: 5 }, notes: "Authored ritual notes stay." };
        character.current_state = { ...character.current_state, experience_available: 4, experience_spent: 9, creation_draft: true, creation_draft_step: 3 };
        return [definition.id, character];
      }));
      const ritualCharactersBefore = JSON.stringify(ritualCharacters);
      for (const definition of catalog.ritualDisciplines.filter(item => item.presentationPt)) {
        const character = ritualCharacters[definition.id];
        const presented = vampirePowerPresentation(definition, locale);
        const ritualSheet = render(RitualDisciplines, { powers: catalog, bloodSorcery: character.line_data.blood_sorcery, locale });
        const ritualExperience = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        const surfaces = [ritualSheet, ritualExperience, ...(vampireHomebrewSourceId(definition)?.startsWith("h-") ? [homebrew] : [])];
        for (const field of fields.filter(key => presented[key])) {
          for (const html of surfaces) assert.ok(html.includes(escape(presented[field])), `${locale}: ritual ${definition.id}.${field}`);
        }
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of surfaces) assert.ok(html.includes(escape(result)));
        for (const modifier of presented.suggestedModifiers ?? []) for (const html of surfaces) {
          assert.ok(html.includes(escape(modifier.modifier)));
          assert.ok(html.includes(escape(modifier.situation)));
        }
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of surfaces) assert.ok(html.includes(escape(title)));
        const undo = ["cruac", "theban"].includes(definition.id) ? { kind: definition.id, amount: 1 } : { kind: "bloodSorcery", ratingKey: `${definition.id.replaceAll("-", "_")}_rating`, amount: 1 };
        const receipt = { id: "old-ritual-purchase", label: "Original ritual label", rating: 5, cost: 4, undo };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, character, statusCatalog, catalog, locale), `${title} 5`);
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      // Dark Eras 2 p. 344: Humanity triggers detachment, never a Sacrilege purchase cap.
      for (const humanity of [0, 1, 3, 7]) {
        const character = structuredClone(ritualCharacters.therion);
        character.character.concept = "sacrilege-test";
        character.line_data.humanity = humanity;
        const html = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        for (const sacrilege of catalog.therionSacrileges) assert.ok(html.includes(escape(locale === "pt-BR" ? sacrilege.translatedName : sacrilege.name)), `Therion Humanity ${humanity}: ${sacrilege.id}`);
        character.character.concept = "therion-upgrade-test";
        character.line_data.blood_sorcery.therion_rating = 4;
        const upgrade = render(VampireExperiencePanel, { character, updateSheet: noMutation, catalogs, builderMode: true });
        for (const sacrilege of catalog.therionSacrileges) assert.ok(upgrade.includes(escape(locale === "pt-BR" ? sacrilege.translatedName : sacrilege.name)), `Therion free ritual Humanity ${humanity}: ${sacrilege.id}`);
      }
      const thebanCharacter = structuredClone(ritualCharacters.theban);
      thebanCharacter.character.concept = "miracle-test";
      thebanCharacter.line_data.humanity = 1;
      const miraclePicker = render(VampireExperiencePanel, { character: thebanCharacter, updateSheet: noMutation, catalogs, builderMode: true });
      for (const miracle of catalog.thebanMiracles.filter(item => item.source === "Vampire: The Requiem Second Edition")) assert.equal(miraclePicker.includes(escape(locale === "pt-BR" ? miracle.translatedName : miracle.name)), miracle.rating <= 1);
      assert.equal(render(RitualDisciplines, { powers: catalog, bloodSorcery: {}, locale }), "");
      assert.equal(JSON.stringify(ritualCharacters), ritualCharactersBefore);
      const lashCharacter = structuredClone(characters.find(item => item.line_data.bloodline_id === "adrestoi"));
      lashCharacter.line_data.lash_ids = lashes.map(item => item.id);
      const lashCharacterBefore = JSON.stringify(lashCharacter);
      const lashSheet = render(DisciplineCards, { character: lashCharacter, updateSheet: noMutation, powers: catalog, disciplines: lashCharacter.line_data.disciplines, coilRatings: {}, locale, onRaiseFamiliar: noMutation });
      const lashBuyer = structuredClone(lashCharacter);
      lashBuyer.character.concept = "lash-test";
      lashBuyer.line_data.lash_ids = [];
      const lashBuyerBefore = JSON.stringify(lashBuyer);
      const lashExperience = render(VampireExperiencePanel, { character: lashBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.lashes) {
        const presented = vampirePowerPresentation(definition, locale);
        for (const field of fields.filter(key => presented[key])) for (const html of [lashSheet, lashExperience, homebrew]) assert.ok(html.includes(escape(presented[field])), `${locale}: lash ${definition.id}.${field}`);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of [lashSheet, lashExperience, homebrew]) assert.ok(html.includes(escape(title)));
        assert.equal(sheet.includes(`<strong>${escape(title)}</strong>`), false, "Unowned Lash stays off the sheet");
        const receipt = { id: "old-lash-purchase", label: "Authored old label", cost: 1, undo: { kind: "lash", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, lashCharacter, [], catalog, locale), title);
        const refunded = structuredClone(lashCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.lash_ids, lashes.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(lashCharacter), lashCharacterBefore);
      assert.equal(JSON.stringify(lashBuyer), lashBuyerBefore);
      for (const [ritualId, group, purchase, idsKey] of [["theban", "thebanMiracles", "miracle", "theban_miracle_ids"], ["cruac", "cruacRites", "rite", "cruac_rite_ids"], ["kimiya", "kimiyaFormulae", "formula", "kimiya_formula_ids"], ["therion", "therionSacrileges", "sacrilege", "therion_sacrilege_ids"], ["gilded-cage", "gildedInvocations", "invocation", "gilded_invocation_ids"]]) {
        const definitions = catalog[group].filter(item => item.presentationPt);
        const ritualCharacter = structuredClone(ritualCharacters[ritualId]);
        ritualCharacter.line_data.blood_sorcery[idsKey] = definitions.map(item => item.id);
        const ritualCharacterBefore = JSON.stringify(ritualCharacter);
        const ritualSheet = render(RitualDisciplines, { powers: catalog, bloodSorcery: ritualCharacter.line_data.blood_sorcery, locale });
        const ritualBuyer = structuredClone(ritualCharacter);
        ritualBuyer.character.concept = `${purchase}-test`;
        ritualBuyer.line_data.blood_sorcery[idsKey] = [];
        const ritualBuyerBefore = JSON.stringify(ritualBuyer);
        const generalRitualExperience = render(VampireExperiencePanel, { character: ritualBuyer, updateSheet: noMutation, catalogs });
        const bloodlineExperiences = new Map();
        for (const bloodlineId of new Set(definitions.map(item => item.bloodlineId).filter(Boolean))) {
          const bloodlineBuyer = structuredClone(ritualBuyer);
          bloodlineBuyer.line_data.bloodline_id = bloodlineId;
          bloodlineBuyer.line_data.clan_id = reference.bloodlines.find(item => item.id === bloodlineId).parentClanIds[0];
          const bloodlineBuyerBefore = JSON.stringify(bloodlineBuyer);
          bloodlineExperiences.set(bloodlineId, render(VampireExperiencePanel, { character: bloodlineBuyer, updateSheet: noMutation, catalogs }));
          assert.equal(JSON.stringify(bloodlineBuyer), bloodlineBuyerBefore);
        }
        for (const definition of definitions) {
          const ritualExperience = bloodlineExperiences.get(definition.bloodlineId) ?? generalRitualExperience;
          const presented = vampirePowerPresentation(definition, locale);
          const title = locale === "pt-BR" ? definition.translatedName : definition.name;
          if (definition.bloodlineId) assert.equal(generalRitualExperience.includes(`<strong>${escape(title)}</strong>`), false, "Bloodline ritual stays off an unrelated character's picker");
          for (const field of fields.filter(key => presented[key])) for (const html of [ritualSheet, ritualExperience, ...(vampireHomebrewSourceId(definition)?.startsWith("h-") ? [homebrew] : [])]) assert.ok(html.includes(escape(presented[field])), `${locale}: ${purchase} ${definition.id}.${field}`);
          for (const html of [ritualSheet, ritualExperience]) {
            assert.ok(html.includes(escape(title)));
          }
          const label = locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes";
          assert.ok(ritualSheet.includes(`<strong>${label}:</strong> ${definition.targetSuccesses}`));
          assert.ok(ritualExperience.includes(`<strong>${label}:</strong> ${definition.targetSuccesses}`));
          const receipt = { id: "ritual-purchase", label: "Authored ritual receipt", cost: 2, undo: { kind: "ritual", key: idsKey, id: definition.id } };
          const receiptBefore = JSON.stringify(receipt);
          assert.equal(vampireExperienceLabel(receipt, ritualCharacter, [], catalog, locale), title);
          const refunded = structuredClone(ritualCharacter);
          assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
          assert.deepEqual(refunded.line_data.blood_sorcery[idsKey], definitions.filter(item => item.id !== definition.id).map(item => item.id));
          assert.equal(JSON.stringify(receipt), receiptBefore);
        }
        assert.equal(JSON.stringify(ritualCharacter), ritualCharacterBefore);
        assert.equal(JSON.stringify(ritualBuyer), ritualBuyerBefore);
      }
      const devotionCharacter = blankPrintCharacter("VtR");
      devotionCharacter.line_data = { ...devotionCharacter.line_data, clan_id: "gangrel", devotion_ids: devotions.map(item => item.id), disciplines: Object.fromEntries(catalog.disciplines.filter(item => item.source === "Vampire: The Requiem Second Edition").map(item => [item.name, 5])), notes: "Authored devotion research stays." };
      const devotionCharacterBefore = JSON.stringify(devotionCharacter);
      const devotionSheet = render(PurchasedPowers, { character: devotionCharacter, powers: catalog, locale });
      const devotionBuyer = structuredClone(devotionCharacter);
      devotionBuyer.character.concept = "devotion-test";
      devotionBuyer.line_data.devotion_ids = [];
      const devotionBuyerBefore = JSON.stringify(devotionBuyer);
      const devotionExperience = render(VampireExperiencePanel, { character: devotionBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.devotions.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        assert.equal(vampireDisciplinePrerequisitesMet(definition.prerequisites, devotionCharacter.line_data.disciplines, catalog.disciplines.map(item => item.name)), true);
        for (const field of fields.filter(key => presented[key])) {
          assert.ok(devotionSheet.includes(escape(presented[field])), `${locale}: Devotion sheet ${definition.id}.${field}`);
          if (!(field === "summary" && definition.effect) && definition[field].trim().toLowerCase() !== "none") assert.ok(devotionExperience.includes(escape(presented[field])), `${locale}: Devotion XP ${definition.id}.${field}`);
        }
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of [devotionSheet, devotionExperience]) assert.ok(html.includes(escape(result)));
        for (const modifier of presented.suggestedModifiers ?? []) for (const html of [devotionSheet, devotionExperience]) {
          assert.ok(html.includes(escape(modifier.situation)), `${locale}: Devotion modifier ${definition.id}`);
          assert.ok(html.includes(escape(modifier.modifier)));
        }
        for (const html of [devotionSheet, devotionExperience]) assert.ok(html.includes(escape(title)));
        const receipt = { id: "old-devotion-purchase", label: "Authored devotion receipt", cost: definition.experienceCost, undo: { kind: "devotion", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, devotionCharacter, [], catalog, locale), title);
        const refunded = structuredClone(devotionCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.devotion_ids, devotions.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const limitedDevotionBuyer = structuredClone(devotionBuyer);
      limitedDevotionBuyer.line_data.disciplines = {};
      const limitedDevotionExperience = render(VampireExperiencePanel, { character: limitedDevotionBuyer, updateSheet: noMutation, catalogs });
      for (const definition of devotions) assert.equal(limitedDevotionExperience.includes(`<strong>${escape(locale === "pt-BR" ? definition.translatedName : definition.name)}</strong>`), false);
      assert.equal(JSON.stringify(devotionCharacter), devotionCharacterBefore);
      assert.equal(JSON.stringify(devotionBuyer), devotionBuyerBefore);
      const coilCharacter = blankPrintCharacter("VtR");
      coilCharacter.merits = [{ definitionId: "vtr-kindred-status", instanceId: "ordo-status", name: "Kindred Status", dots: 5, creationDots: 5, configuration: { group: "ordo-dracul" } }];
      coilCharacter.line_data = { ...coilCharacter.line_data, clan_id: "gangrel", covenant_ids: ["ordo-dracul"], ordo_dracul: { mystery_id: "zirnitra", coil_ratings: Object.fromEntries(coils.map(item => [item.id, 5])) }, notes: "Authored Coil research stays." };
      const coilCharacterBefore = JSON.stringify(coilCharacter);
      const coilSheet = render(DisciplineCards, { character: coilCharacter, updateSheet: noMutation, powers: catalog, disciplines: {}, coilRatings: coilCharacter.line_data.ordo_dracul.coil_ratings, locale, onRaiseFamiliar: noMutation });
      const coilPartial = render(DisciplineCards, { character: coilCharacter, updateSheet: noMutation, powers: catalog, disciplines: {}, coilRatings: Object.fromEntries(coils.map(item => [item.id, 3])), locale, onRaiseFamiliar: noMutation });
      const coilExperience = render(VampireExperiencePanel, { character: coilCharacter, updateSheet: noMutation, catalogs });
      for (const definition of catalog.coils) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const html of [coilSheet, coilExperience]) assert.ok(html.includes(escape(title)));
        for (const item of [presented, ...definition.levels.map(level => vampirePowerPresentation(level, locale))]) {
          for (const field of fields.filter(key => item[key])) for (const html of [coilSheet, coilExperience]) assert.ok(html.includes(escape(item[field])), `${locale}: Coil ${definition.id}.${item.rating ?? "summary"}.${field}`);
        }
        for (const level of definition.levels) {
          const caption = `<strong>${"•".repeat(level.rating)} ${escape(locale === "pt-BR" ? level.translatedName : level.name)}</strong>`;
          assert.equal(coilPartial.includes(caption), level.rating <= 3);
        }
        const receipt = { id: "old-coil-purchase", label: "Authored research receipt", rating: 5, cost: 4, undo: { kind: "coil", id: definition.id, amount: 1 } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, coilCharacter, [], catalog, locale), `${title} 5`);
        const refunded = structuredClone(coilCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.ordo_dracul.coil_ratings, Object.fromEntries(coils.map(item => [item.id, item.id === definition.id ? 4 : 5])));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(coilCharacter), coilCharacterBefore);
      const scaleCharacter = structuredClone(coilCharacter);
      scaleCharacter.line_data.ordo_dracul.scale_ids = scales.map(item => item.id);
      const scaleCharacterBefore = JSON.stringify(scaleCharacter);
      const scaleSheet = render(PurchasedPowers, { character: scaleCharacter, powers: catalog, locale });
      const scaleBuyer = structuredClone(scaleCharacter);
      scaleBuyer.character.concept = "scale-test";
      scaleBuyer.line_data.ordo_dracul.scale_ids = [];
      const scaleBuyerBefore = JSON.stringify(scaleBuyer);
      const scaleExperience = render(VampireExperiencePanel, { character: scaleBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.scales.filter(item => item.presentationPt)) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const field of fields.filter(key => presented[key])) for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(presented[field])), `${locale}: Scale ${definition.id}.${field}`);
        for (const result of Object.values(presented.rollResults ?? {})) for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(result)));
        for (const html of [scaleSheet, scaleExperience]) assert.ok(html.includes(escape(title)));
        const receipt = { id: "old-scale-purchase", label: "Authored experiment receipt", cost: 1, undo: { kind: "scale", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, scaleCharacter, [], catalog, locale), title);
        const refunded = structuredClone(scaleCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.ordo_dracul.scale_ids, scales.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      const limitedScaleBuyer = structuredClone(scaleBuyer);
      limitedScaleBuyer.line_data.ordo_dracul.coil_ratings = { "coil-ascendant": 1 };
      const limitedScaleExperience = render(VampireExperiencePanel, { character: limitedScaleBuyer, updateSheet: noMutation, catalogs });
      const costLabel = translate(locale, "ui.experienceCost"), xpUnit = translate(locale, "ui.xp");
      for (const [id, limitedCost] of [["scale-day-wake-conditioning", 1], ["scale-surgical-heart-removal", 2]]) {
        const definition = catalog.scales.find(item => item.id === id);
        const title = escape(locale === "pt-BR" ? definition.translatedName : definition.name);
        for (const [html, cost] of [[scaleExperience, 1], [limitedScaleExperience, limitedCost]]) {
          const start = html.indexOf(`<strong>${title}</strong>`);
          assert.ok(start >= 0);
          assert.ok(html.slice(start, html.indexOf("</article>", start)).includes(`<strong>${costLabel}:</strong> ${cost} ${xpUnit}`), `${locale}: ${id} cost ${cost}`);
        }
      }
      assert.equal(JSON.stringify(scaleCharacter), scaleCharacterBefore);
      assert.equal(JSON.stringify(scaleBuyer), scaleBuyerBefore);
      const detournementCharacter = blankPrintCharacter("VtR");
      detournementCharacter.merits = [{ definitionId: "core-2ed:mystery-cult-initiation", instanceId: "moulding-initiation", name: "Mystery Cult Initiation", dots: 1, creationDots: 1, configuration: { cult: "moulding-room" } }];
      detournementCharacter.line_data = { ...detournementCharacter.line_data, covenant_ids: ["moulding-room"], detournement_ids: detournements.map(item => item.id), notes: "Authored sacrifice notes stay." };
      const detournementCharacterBefore = JSON.stringify(detournementCharacter);
      const detournementSheet = render(PurchasedPowers, { character: detournementCharacter, powers: catalog, locale });
      const detournementBuyer = structuredClone(detournementCharacter);
      detournementBuyer.character.concept = "detournement-test";
      detournementBuyer.line_data.detournement_ids = [];
      const detournementBuyerBefore = JSON.stringify(detournementBuyer);
      const detournementExperience = render(VampireExperiencePanel, { character: detournementBuyer, updateSheet: noMutation, catalogs });
      for (const definition of catalog.detournements) {
        const presented = vampirePowerPresentation(definition, locale);
        const title = locale === "pt-BR" ? definition.translatedName : definition.name;
        for (const field of fields.filter(key => presented[key])) for (const html of [detournementSheet, detournementExperience, homebrew]) assert.ok(html.includes(escape(presented[field])), `${locale}: detournement ${definition.id}.${field}`);
        for (const html of [detournementSheet, detournementExperience, homebrew]) assert.ok(html.includes(escape(title)));
        const receipt = { id: "old-detournement-purchase", label: "Authored sacrifice receipt", cost: 2, undo: { kind: "detournement", id: definition.id } };
        const receiptBefore = JSON.stringify(receipt);
        assert.equal(vampireExperienceLabel(receipt, detournementCharacter, [], catalog, locale), title);
        const refunded = structuredClone(detournementCharacter);
        assert.equal(refundVampireAdvancement(refunded, receipt.undo), true);
        assert.deepEqual(refunded.line_data.detournement_ids, detournements.filter(item => item.id !== definition.id).map(item => item.id));
        assert.equal(JSON.stringify(receipt), receiptBefore);
      }
      assert.equal(JSON.stringify(detournementCharacter), detournementCharacterBefore);
      assert.equal(JSON.stringify(detournementBuyer), detournementBuyerBefore);
      const authoredFormula = normalizeVampireCatalogHomebrew({ entryType: "power", kind: "kimiya-formula", id: "homebrew:vampire:authored-formula", name: "Ebony Horse", summary: "Authored formula stays.", effect: "Authored formula effect stays." });
      assert.equal(vampirePowerPresentation(authoredFormula, locale), authoredFormula);
      const custom = normalizeVampireCatalogHomebrew({ entryType: "discipline", id: "homebrew:vampire:authored", name: "Animalism", summary: "Authored English stays.", levels: [{ rating: 1, name: "Feral Whispers", summary: "Authored level stays.", effect: "Authored effect stays." }] });
      assert.equal(vampirePowerPresentation(custom, locale), custom);
      assert.equal(vampirePowerPresentation(custom.levels[0], locale), custom.levels[0]);
      assert.equal(JSON.stringify(characters), charactersBefore);
      assert.equal(JSON.stringify(powers), dataBefore);
    } finally { await vite.close(); }
  }
});
