import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const conditions = read("public/game-lines/vampire/data/conditions.json");
const localized = conditions.filter(item => item.presentationPt);
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("VtR visually verified official and Homebrew Conditions retain their complete rules and IDs", () => {
  assert.deepEqual(localized.map(item => item.id), ["vtr-better-feared:overwhelming-hunger", "vtr-better-feared:despondent", "vtr-better-feared:frantic", "vtr-better-feared:potent-curse", "vtr-false-gods:subsumed", "vtr-false-gods:chronic-malkavia", "vtr-false-gods:terminal-malkavia", "vtr-false-gods:pareidolia", "vtr-false-gods:directive", "radio-sickness", "primeval-truths", "oathbreaker-invictus", "vtr-sin-again:depressed", "vtr-sin-again:self-loathing", "vtr-sin-again:inflamed", "vtr-sin-again:fired-up", "vtr-strange-shades:scorned", "vtr-strange-shades:soulmate"]);
  for (const item of localized) {
    for (const field of ["name", "description", "resolution", ...(item.penalty ? ["penalty"] : []), ...(item.beat ? ["beat"] : [])]) {
      assert.ok(item.presentationPt[field]?.trim(), `${item.id}.${field}`);
      assert.deepEqual(item.presentationPt[field].match(/\d+/g) ?? [], item[field].match(/\d+/g) ?? []);
    }
    assert.equal(item.name, item.originalName);
    assert.equal(Boolean(item.presentationPt.beat), Boolean(item.beat));
  }
  const [hunger, despondent, frantic, curse, subsumed, chronic, terminal, pareidolia, directive, radio, primeval, oathbreaker, depressed, loathing, inflamed, firedUp, scorned, soulmate] = localized;
  assert.equal(hunger.page, 31);
  assert.equal(hunger.persistent, undefined);
  assert.equal(hunger.beat, undefined);
  assert.match(hunger.description, /scene ends.*Size 2.*Deprived/);
  assert.equal(despondent.page, 101);
  assert.equal(despondent.persistent, true);
  assert.match(despondent.description, /−3.*3 successes instead of 5.*only to vampires with Nightmare.*bite heals/);
  assert.match(despondent.resolution, /Integrity or Humanity.*consent/);
  assert.match(despondent.beat, /Dramatically fail/);
  assert.equal(frantic.page, 98);
  assert.equal(frantic.persistent, true);
  assert.match(frantic.description, /extended action.*1 Willpower.*does not grant \+3.*same Skill suffer −2.*ends without resolving.*hours.*exceptional success.*nights/);
  assert.match(frantic.resolution, /depressant drugs.*alcohol.*frenzy/);
  assert.equal(curse.page, 107);
  assert.equal(curse.persistent, true);
  assert.match(curse.description, /Choose 2 Skills.*unskilled penalties.*±1 at Humanity 6, ±2 at 5.*Humanity 1.*9-again.*loses 10-again.*only to mundane actions.*do not affect derived/);
  assert.match(curse.resolution, /not your Touchstone.*Humanity 7/);
  assert.doesNotMatch(curse.description, /Ease the Curse/);
  assert.equal(subsumed.page, 26);
  assert.equal(subsumed.persistent, undefined);
  assert.equal(subsumed.beat, undefined);
  assert.match(subsumed.description, /Pilot.*half your Covenant Status, rounded up.*lose the usual bonus.*ends without resolving/);
  assert.doesNotMatch(subsumed.description, /Adrestoi|Blood Tether/);
  assert.match(subsumed.resolution, /Anchor.*all Willpower.*breaking point.*directive exactly/);
  assert.equal(chronic.page, 81);
  assert.equal(chronic.persistent, true);
  assert.match(chronic.description, /Once per session.*progression.*chance die.*−2.*always a dramatic failure/);
  assert.match(chronic.description, /Except for the first use.*remaining temporary Willpower.*levels 1 or 2.*level 3 has −1.*level 4 has −2.*level 5 has −3/);
  assert.match(chronic.description, /dramatic failure counts as 2 failures.*exceptional success removes.*exceeds permanent Willpower.*Terminal Malkavia.*Beat.*Aspiration/);
  assert.equal(chronic.resolution, "The cure?");
  assert.equal(terminal.page, 81);
  assert.equal(terminal.persistent, true);
  assert.match(terminal.description, /once per scene.*Resolve \+ Composure.*cumulative −1.*maximum of −5.*night ends.*succeed or fail/);
  assert.match(terminal.description, /no longer costs Willpower.*aggravated damage.*equal to its successes.*frenzy.*cannot end early.*progression resets.*breaking points suffer −2/);
  assert.match(terminal.beat, /witnesses cannot rationalize/);
  assert.equal(pareidolia.page, 98);
  assert.equal(pareidolia.persistent, true);
  assert.match(pareidolia.description, /Once per night.*\+5.*Investigation.*Social actions.*−3/);
  assert.equal(pareidolia.resolution, "Find the answer to your question.");
  assert.equal(directive.page, 113);
  assert.equal(directive.persistent, true);
  assert.match(directive.description, /Once per session.*9-again.*Breaking points.*−1.*cannot be resolved.*Lingering Motivation/);
  assert.doesNotMatch(directive.description, /chapter/);
  assert.equal(radio.page, 23);
  assert.match(radio.description, /Mental rolls, Stealth rolls.*combat suffer −1.*each week.*maximum of −5.*fatal/);
  assert.equal(primeval.page, 184);
  assert.equal(primeval.persistent, undefined);
  assert.equal(primeval.beat, undefined);
  assert.match(primeval.description, /cannot regain Willpower.*1 additional Vitae.*each night/);
  assert.match(primeval.resolution, /Humanity detachment.*significant action.*void/);
  assert.equal(oathbreaker.page, 189);
  assert.equal(oathbreaker.persistent, true);
  assert.match(oathbreaker.penalty, /2 dots of Invictus Status.*1 dot each of Resources, Allies, Contacts, Herd, and Mentor.*if you have.*dramatic failures/);
  assert.match(oathbreaker.resolution, /Final Death for an Invictus member.*member or the Invictus at large/);
  assert.deepEqual(oathbreaker.nameQualifier, { "en-US": "Kindred", "pt-BR": "Membro" });
  assert.equal(depressed.page, 24);
  assert.equal(depressed.persistent, true);
  assert.match(depressed.description, /10-again.*instant Mental and Social.*Nightmare dots.*Manipulation.*ends without resolving.*hours.*exceptional success.*nights/);
  assert.match(depressed.resolution, /short-term Aspiration.*restitution/);
  assert.equal(loathing.page, 25);
  assert.equal(loathing.persistent, true);
  assert.match(loathing.description, /cannot spend or regain Willpower.*extended actions automatically fail.*ends without resolving.*nights.*Blood Potency/);
  assert.match(loathing.beat, /Tell the vampire.*dangerous for anyone/);
  assert.equal(inflamed.page, 30);
  assert.equal(inflamed.persistent, undefined);
  assert.equal(inflamed.beat, undefined);
  assert.match(inflamed.description, /Celerity dots.*all Composure- and Stamina-based.*Induce.*Vigor is higher.*ends without resolving.*scene.*exceptional success.*night/);
  assert.match(inflamed.resolution, /greater than your Stamina.*mortal affected by Inure.*Stamina \+ Resilience/);
  assert.equal(firedUp.page, 41);
  assert.equal(firedUp.persistent, undefined);
  assert.equal(firedUp.beat, undefined);
  assert.match(firedUp.description, /\+3.*Physical and Social.*−2.*physical violence or destruction.*3 successes instead of 5.*ends without resolving.*night/);
  assert.match(firedUp.resolution, /5 bashing or 2 lethal or aggravated damage to another person/);
  assert.match(scorned.description, /Blood Potency 1.*Integrity for Humanity.*do not cause breaking points.*that vampire/);
  assert.match(scorned.resolution, /Kill.*Touchstones.*reputation/);
  assert.match(soulmate.description, /existing and new blood bonds.*Majesty.*Once per night.*greater than their Stamina.*more than their Size/);
  assert.match(soulmate.penalty, /Each month/);
  assert.match(soulmate.beat, /Either partner.*The mortal.*The vampire/);
});

test("Vampire Desktop/Mobile and Homebrew render localized Conditions in EN/PT/EN without changing saved instances", async () => {
  const before = JSON.stringify(conditions);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    let mobile = false;
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "condition-surfaces", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/hooks/use-mobile.ts")) return "export let mobile = false; export const setTestMobile = value => { mobile = value; }; export const useIsMobile = () => mobile;";
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { vampireConditionPresentation: present } = await vite.ssrLoadModule("/game-lines/vampire/condition-presentation.ts");
      const { vampireConditionsCatalogGroup } = await vite.ssrLoadModule("/game-lines/vampire/catalogs/conditions.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const requests = [];
      const catalog = freezeCatalogData(await vampireConditionsCatalogGroup.load({ getCatalog: async id => { requests.push(id); return conditions; } }));
      assert.deepEqual(requests, ["vampire-conditions"]);
      const { activeVampireItems } = await vite.ssrLoadModule("/game-lines/vampire/homebrew-catalog.ts");
      assert.equal(activeVampireItems(catalog, { disabledIds: ["h-vtr-strange-shades"] }).some(item => item.id === "vtr-strange-shades:scorned"), false);
      const base = localized[0], errata = { ...base, id: "homebrew:errata", errataFor: base.id, description: "Authored replacement stays.", presentationPt: undefined };
      const replacement = activeVampireItems([base, errata], { disabledIds: [] })[0];
      assert.equal(present(replacement, locale).description, errata.description, "An untranslated replacement never inherits obsolete PT");
      const authored = { ...base, id: "homebrew:authored", name: "Authored name", description: "Authored effect", presentationPt: undefined };
      assert.equal(present(authored, locale), authored);
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const { VampireCharacterPaper } = await vite.ssrLoadModule("/game-lines/vampire/sheet-view.tsx");
      const { vampireHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/homebrew.tsx");
      const { setTestMobile } = await vite.ssrLoadModule("/hooks/use-mobile.ts");
      const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const reference = Object.fromEntries(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(group => [group === "blood-potency" ? "bloodPotency" : group, read(`public/game-lines/vampire/data/${group}.json`)]));
      const catalogs = { get: id => ({ "vampire-powers": read("public/game-lines/vampire/data/powers.json"), "vampire-reference": reference, "core-merits": [], "vampire-merits": [], "core-reference": { conditions: [], presentation: {} }, "vampire-conditions": catalog })[id] };
      const character = blankPrintCharacter("VtR");
      character.line_data.clan_id = "daeva";
      character.current_state.conditions = localized.map(item => ({ id: item.id, instanceId: `saved:${item.id}`, persistent: Boolean(item.persistent), notes: "Authored note" }));
      const saved = JSON.stringify(character);
      const noMutation = () => { throw new Error("Render mutated the saved character"); };
      const render = (Component, props) => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, props)));
      const homebrew = render(vampireHomebrew.Component, { catalogs });
      for (mobile of [false, true]) {
        setTestMobile(mobile);
        const sheet = render(VampireCharacterPaper, { character, updateState: noMutation, updateSheet: noMutation, catalogs });
        for (const item of localized.map(item => present(item, locale))) {
          assert.equal(item.id, conditions.find(canonical => canonical.id === item.id).id);
          for (const field of ["name", "description", "resolution", ...(item.penalty ? ["penalty"] : []), ...(item.beat ? ["beat"] : [])])
            for (const html of item.homebrew ? [sheet, homebrew] : [sheet]) assert.ok(html.includes(escape(item[field])), `${locale}/${mobile ? "mobile" : "desktop"}: ${item.id}.${field}`);
          if (item.nameQualifier?.[locale]) assert.ok(sheet.includes(escape(`${item.name}(${item.nameQualifier[locale]})`)), "Homonymous Conditions retain their presentation-only line qualifier");
        }
      }
      assert.equal(JSON.stringify(character), saved);
      assert.equal(JSON.stringify(conditions), before);
      assert.equal(Object.isFrozen(catalog[0].presentationPt), true);
    } finally { await vite.close(); }
  }
});
