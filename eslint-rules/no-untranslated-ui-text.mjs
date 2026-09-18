const UI_ATTRIBUTES = new Set(["label", "aria-label", "placeholder", "title"]);

function hasLocaleReference(node) {
  if (!node || typeof node !== "object") return false;
  if (node.type === "Identifier" && node.name === "locale") return true;
  return Object.entries(node).some(([key, value]) =>
    key !== "parent" && (Array.isArray(value)
      ? value.some(hasLocaleReference)
      : hasLocaleReference(value)),
  );
}

function isTextLiteral(node) {
  return node?.type === "Literal" && typeof node.value === "string" && node.value.trim().length > 0
    || node?.type === "TemplateLiteral" && node.quasis.some((quasi) => quasi.value.raw.trim().length > 0);
}

function hasTextLiteral(node) {
  if (!node || typeof node !== "object") return false;
  if (isTextLiteral(node)) return true;
  // A translation key is itself a string literal, but it is not rendered as
  // copy when passed to `t()`.
  if (node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "t") return false;
  return Object.entries(node).some(([key, value]) =>
    key !== "parent" && (Array.isArray(value)
      ? value.some(hasTextLiteral)
      : hasTextLiteral(value)),
  );
}

/**
 * Flags UI copy that bypasses the typed `t(key, params?)` API. Technical JSX
 * attributes are intentionally not inspected; this rule only considers nodes
 * that render copy or the legacy translation constructs themselves.
 */
export default {
  meta: {
    type: "problem",
    docs: { description: "disallow UI text outside the central i18n API" },
    schema: [],
    messages: {
      jsxText: "UI text must use t(\"semantic.key\") instead of a JSX literal.",
      attributeText: "{{attribute}} must use t(\"semantic.key\") instead of a literal.",
      legacyTr: "The legacy tr(portuguese, english) API is not allowed; use t(\"semantic.key\").",
      localeConditional: "Do not select UI copy with a locale conditional; use t(\"semantic.key\", params?).",
    },
  },
  create(context) {
    return {
      JSXText(node) {
        if (node.value.trim()) context.report({ node, messageId: "jsxText" });
      },
      JSXAttribute(node) {
        const name = node.name?.name;
        if (!UI_ATTRIBUTES.has(name) || !node.value) return;
        if (node.value.type === "Literal" && typeof node.value.value === "string" && node.value.value.trim()) {
          context.report({ node, messageId: "attributeText", data: { attribute: name } });
          return;
        }
        const expression = node.value.type === "JSXExpressionContainer" ? node.value.expression : undefined;
        if (isTextLiteral(expression)) context.report({ node, messageId: "attributeText", data: { attribute: name } });
      },
      CallExpression(node) {
        if (node.callee.type === "Identifier" && node.callee.name === "tr") {
          context.report({ node, messageId: "legacyTr" });
        }
      },
      ConditionalExpression(node) {
        if (hasLocaleReference(node.test) && (hasTextLiteral(node.consequent) || hasTextLiteral(node.alternate))) {
          context.report({ node, messageId: "localeConditional" });
        }
      },
    };
  },
};
