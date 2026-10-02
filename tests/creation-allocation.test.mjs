import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { ATTRIBUTES, SKILLS, ATTRIBUTE_BUDGETS, SKILL_BUDGETS, creationAllocationFits: fits } = await vite.ssrLoadModule("/lib/core/character/creation-rules.ts");
const { commonCreationIssues, useCommonBuilderState, CharacterBuilderShell } = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
const { TraitsStep } = await vite.ssrLoadModule("/app/builder/common-controls.tsx");
const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
const render = element => renderToStaticMarkup(createElement(LanguageProvider, null, element));
const labels = locale => ({ attributeAllocation: translate(locale, "ui.attributeAllocation"), skillAllocation: translate(locale, "ui.skillAllocation") });
const permutations = ([a, b, c]) => [[a,b,c], [a,c,b], [b,a,c], [b,c,a], [c,a,b], [c,b,a]];
const allocation = (groups, base, spending) => Object.fromEntries(Object.values(groups).flatMap((names, index) => {
  let remaining = spending[index];
  return names.map(name => { const dots = Math.min(5 - base, remaining); remaining -= dots; return [name, base + dots]; });
}));
const complete = () => ({ attributes: allocation(ATTRIBUTES, 1, ATTRIBUTE_BUDGETS), skills: allocation(SKILLS, 0, SKILL_BUDGETS) });

test("CofD 2e automatic allocation fits any budget permutation, not a locked priority", () => {
  for (const budgets of [ATTRIBUTE_BUDGETS, SKILL_BUDGETS]) {
    for (let a = 0; a <= budgets[0] + 1; a++) for (let b = 0; b <= budgets[0] + 1; b++) for (let c = 0; c <= budgets[0] + 1; c++) {
      const spent = [a,b,c];
      assert.equal(fits(spent, budgets), permutations(budgets).some(order => spent.every((dots, i) => dots <= order[i])), `${spent}/${budgets}`);
      assert.equal(fits(spent, budgets, true), permutations(budgets).some(order => spent.every((dots, i) => dots === order[i])));
    }
  }
  assert.equal(fits([5,3,3], ATTRIBUTE_BUDGETS), true);
  assert.equal(fits([5,4,4], ATTRIBUTE_BUDGETS), false);
  assert.equal(fits([4,4,3], ATTRIBUTE_BUDGETS), true, "a tied category can become primary");
  assert.equal(fits([4,5,3], ATTRIBUTE_BUDGETS), true, "removing dots from the old primary reopens another");
  assert.equal(fits([11,7,5], SKILL_BUDGETS), false);
  assert.equal(fits([10,7,4], SKILL_BUDGETS), true);
  assert.equal(fits([10,8,4], SKILL_BUDGETS), false);
  assert.equal(fits([7,8,4], SKILL_BUDGETS), true);
  for (const spent of [[NaN,4,3], [Infinity,4,3], [-1,4,3], [4.5,4,3], [5,4], [5,4,3,0]]) assert.equal(fits(spent, ATTRIBUTE_BUDGETS), false);
});

test("incomplete, overspent and invalid individual traits are creation errors in EN/PT; Specialties stay optional", () => {
  for (const locale of ["en-US", "pt-BR"]) {
    for (const spending of permutations(ATTRIBUTE_BUDGETS)) {
      assert.deepEqual(commonCreationIssues({ ...complete(), attributes: allocation(ATTRIBUTES, 1, spending) }, labels(locale)), []);
    }
    for (const spending of permutations(SKILL_BUDGETS)) {
      assert.deepEqual(commonCreationIssues({ ...complete(), skills: allocation(SKILLS, 0, spending) }, labels(locale)), []);
    }
    const empty = { attributes: {}, skills: {}, specialties: [] };
    assert.deepEqual(commonCreationIssues(empty, labels(locale)), [
      { step: 2, key: "attribute-allocation", label: labels(locale).attributeAllocation },
      { step: 2, key: "skill-allocation", label: labels(locale).skillAllocation },
    ]);
    for (const spending of [[4,4,3], [5,4,4]]) assert.equal(commonCreationIssues({ ...complete(), attributes: allocation(ATTRIBUTES, 1, spending) }, labels(locale))[0].key, "attribute-allocation");
    for (const value of [0, 6, 2.5, NaN, "3"]) {
      const state = complete(); state.attributes.Intelligence = value;
      assert.equal(commonCreationIssues(state, labels(locale))[0].key, "attribute-allocation");
    }
    assert.doesNotMatch(Object.values(labels(locale)).join(" "), /missing translation|priorit/i);
    assert.equal(translate(locale, "ui.incompleteAllocation"), locale === "pt-BR" ? "Distribuição incompleta ou inválida." : "Incomplete or invalid allocation.");
  }
});

test("shared Traits UI has no priority dropdowns and recalculates available increments after removal", () => {
  const props = (spending, skillSpending) => {
    const values = { attributes: allocation(ATTRIBUTES, 1, spending), skills: allocation(SKILLS, 0, skillSpending) };
    const issues = commonCreationIssues(values, labels("en-US"));
    return { ...values, setAttributes() {}, setSkills() {}, specialties: [], setSpecialties() {}, missing: key => issues.some(issue => issue.key === key) };
  };
  const markup = render(createElement(TraitsStep, props([5,4,3], [11,7,4])));
  assert.doesNotMatch(markup, /combobox|priority-row|role="alert"|Primary|Secondary|Tertiary/);
  assert.match(markup, /5 dots/);
  const increments = (spending, skillSpending) => {
    const html = render(createElement(TraitsStep, props(spending, skillSpending)));
    return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].filter(match => match[2].includes("lucide-plus")).map(match => !/\sdisabled=""/.test(match[1]));
  };
  assert.equal(increments([5,4,3], [11,7,4]).some(Boolean), false);
  // Each Attribute category contains three increment buttons.
  assert.deepEqual(increments([4,4,3], [11,7,4]).slice(3,6), [false,true,true], "the per-Trait cap still applies");
  const incomplete = render(createElement(TraitsStep, props([3,3,3], [4,4,4])));
  assert.equal((incomplete.match(/role="alert"/g) ?? []).length, 2);
  assert.match(incomplete, /Incomplete or invalid allocation/);
});

test("Continue cannot advance from incomplete Traits, and advances after exact allocation", () => {
  for (const values of [{ attributes: {}, skills: {} }, { ...complete(), skills: {} }, complete()]) {
    let shell, nextStep, error;
    function Probe() {
      const state = { ...useCommonBuilderState(null, "Test", { experienceHistoryKey: "experience_history" }), ...values,
        step: 2, setStep: value => { nextStep = value; }, setError: value => { error = value; } };
      shell = CharacterBuilderShell({ line: "CofD", templateLabel: "Template", state, issues: commonCreationIssues(state, labels("en-US")),
        identity: null, traits: null, lineTemplate: null, draft: true, onCancel() {}, onFinish() {} });
      return shell;
    }
    render(createElement(Probe));
    const actions = shell.props.children.find(child => child?.props?.className === "builder-actions");
    actions.props.children.at(-1).props.onClick();
    if (commonCreationIssues(values, labels("en-US")).length) { assert.equal(nextStep, undefined); assert.match(error, /Still required/); }
    else { assert.equal(nextStep, 3); assert.equal(error, ""); }
  }
});

test("all five registered Builders use automatic allocation when resuming drafts, without changing stored traits", async () => {
  const { listGameLineRegistrations } = await vite.ssrLoadModule("/game-lines/registry/game-line-registry.ts");
  const { loadCatalogGroups } = await vite.ssrLoadModule("/game-lines/registry/catalog-group-registry.ts");
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async url => new Response(readFileSync(new URL(`../public${url}`, import.meta.url), "utf8"));
    for (const registration of listGameLineRegistrations()) {
      const catalogs = await loadCatalogGroups(registration.catalogGroups.builder);
      const { Component } = await registration.loadBuilder();
      const initial = { id: "allocation-test", schema_version: 2, game_line: registration.id, system: "chronicles-of-darkness",
        ruleset: { id: "test", version: 1 }, character: { name: "Test", player: "Test", concept: "", chronicle: "" }, ...complete(),
        specializations: [], merits: [], line_data: {}, derived: {}, current_state: { creation_draft: true, creation_draft_step: 2 }, created_at: "", updated_at: "" };
      const before = structuredClone(initial);
      const markup = render(createElement(Component, { initial, catalogs, player: "Test", onCancel() {}, onSave() {}, onSaveDraft() {} }));
      assert.match(markup, /class="allocation-block"/, registration.id);
      assert.doesNotMatch(markup, /priority-row|Attribute priorities|Skill priorities|role="alert"/, registration.id);
      assert.deepEqual(initial, before);

      const advanced = structuredClone(initial);
      const historyKeys = { CofD: "mortal_experience_history", CtL: "experience_history", MtA: "mage_experience_history", VtR: "vampire_experience_history", WtF: "werewolf_experience_history" };
      advanced.attributes.Wits += 1;
      advanced.skills.Brawl += 1;
      advanced.current_state[historyKeys[registration.id]] = [
        { undo: { kind: "trait", group: "attributes", name: "Wits", amount: 1 } },
        { undo: { kind: "trait", group: "skills", name: "Brawl", amount: 1 } },
      ];
      if (registration.id === "CtL") { advanced.line_data.favored_attribute = "Presence"; advanced.attributes.Presence += 1; }
      if (registration.id === "MtA") {
        advanced.line_data.resistance_bonus = "Resolve"; advanced.attributes.Resolve += 1;
        advanced.line_data.order_occult_bonus = 1; advanced.skills.Occult += 1;
      }
      if (registration.id === "VtR") { Object.assign(advanced.line_data, { clan_id: "daeva", favored_attribute: "Dexterity" }); advanced.attributes.Dexterity += 1; }
      if (registration.id === "WtF") { advanced.line_data.auspice_skill_grant = { skill: "Brawl", dots: 1 }; advanced.skills.Brawl += 1; }
      const advancedBefore = structuredClone(advanced);
      const edited = render(createElement(Component, { initial: advanced, catalogs, player: "Test", onCancel() {}, onSave() {}, onSaveDraft() {} }));
      assert.doesNotMatch(edited, /role="alert"/, `${registration.id} excludes XP and free grants`);
      assert.deepEqual(advanced, advancedBefore);

      const partial = { ...initial, attributes: {}, skills: {} };
      const incomplete = render(createElement(Component, { initial: partial, catalogs, player: "Test", onCancel() {}, onSave() {}, onSaveDraft() {} }));
      assert.equal((incomplete.match(/role="alert"/g) ?? []).length, 2, `${registration.id} flags both incomplete groups`);
    }
  } finally { globalThis.fetch = originalFetch; }
});
