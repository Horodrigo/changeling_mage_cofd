import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";
import rule from "../eslint-rules/no-inline-catalog-data.mjs";

const linter = new Linter({ configType: "eslintrc" });
linter.defineRule("no-inline-catalog-data", rule);
const messages = (code) => linter.verify(code, {
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: { "no-inline-catalog-data": "error" },
});

test("detector rejects static editorial catalogs", () => {
  const cases = [
    `export const ITEMS = [{id:"a",name:"A",description:"A rule"},{id:"b",name:"B",description:"Another rule"}];`,
    `const LEGACY = {id:"legacy",name:"Legacy",source:"Book",page:10,description:"Rule"};`,
    `export const GROUPS = {one:{name:"One",source:"Book",effect:"Rule"},two:{name:"Two",source:"Book",effect:"Rule"}};`,
    `export const ANIMALS = [animal("bat","Bat",1,2),animal("wolf","Wolf",3,4)];`,
    `export const PATHS={A:{ruling:["Time","Fate"],inferior:"Forces"},B:{ruling:["Space","Mind"],inferior:"Matter"}};`,
  ];
  for (const code of cases) assert.equal(messages(code)[0]?.messageId, "inlineCatalog", code);
});

test("detector accepts mechanics, configuration, and runtime construction", () => {
  assert.deepEqual(messages(`export const CONFIG=[{name:"Merit",fields:["choice"]}];`), []);
  assert.deepEqual(messages(`export function item(value){return {id:value,name:value,description:value}}`), []);
});
