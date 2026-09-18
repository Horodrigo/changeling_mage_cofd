import assert from "node:assert/strict";
import test from "node:test";
import { Linter } from "eslint";
import rule from "../eslint-rules/no-untranslated-ui-text.mjs";

const linter = new Linter({ configType: "eslintrc" });
linter.defineRule("no-untranslated-ui-text", rule);

function messages(code) {
  return linter.verify(code, {
    parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
    rules: { "no-untranslated-ui-text": "error" },
  });
}

test("detector rejeita textos de UI e os padrões legados", () => {
  const cases = [
    ["<div>Salvar</div>", "jsxText"],
    ["<Field label=\"Mask\" />", "attributeText"],
    ["<button aria-label=\"Close\" />", "attributeText"],
    ["<input placeholder=\"Enter name\" />", "attributeText"],
    ["tr(\"Clã\", \"Clan\")", "legacyTr"],
    ["locale === \"pt-BR\" ? \"Clã\" : \"Clan\"", "localeConditional"],
    ["locale === \"en-US\" ? `You need ${required} points` : `Você precisa de ${required} pontos`", "localeConditional"],
  ];
  for (const [code, messageId] of cases) {
    assert.ok(messages(code).some((message) => message.messageId === messageId), code);
  }
});

test("detector aceita t() e atributos técnicos", () => {
  const code = `
    <div className="character-sheet" id="character-name" data-testid="save-button" name="characterName">
      {t("sheet.clan")}
      <Field label={t("sheet.mask")} />
      <button aria-label={t("common.close")} />
      <input placeholder={t("character.namePlaceholder")} />
      {locale === "pt-BR" ? t("workspace.portuguese") : t("workspace.english")}
    </div>;
  `;
  assert.deepEqual(messages(code), []);
});
