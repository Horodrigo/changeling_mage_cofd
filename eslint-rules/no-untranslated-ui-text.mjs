const UI_ATTRIBUTES = new Set(["label", "aria-label", "placeholder", "title"]);
const hasWords = (value) => {
  const text = value.trim();
  return /\p{L}/u.test(text)
    && !["p.", "· p."].includes(text)
    && !/^\[[A-Z]+\]$/.test(text)
    && !/^·\s*[^·]+,\s*pp?\.\s*\d/u.test(text);
};

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
  return node?.type === "Literal" && typeof node.value === "string" && hasWords(node.value)
    || node?.type === "TemplateLiteral" && node.quasis.some((quasi) => hasWords(quasi.value.raw));
}

/**
 * Flags UI copy that bypasses the typed `t(key, params?)` API. Technical JSX
 * attributes are intentionally not inspected; this rule only considers nodes
 * that render copy or the legacy translation constructs themselves.
 */
const noUntranslatedUiText = {
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
        if (hasWords(node.value)) context.report({ node, messageId: "jsxText" });
      },
      JSXAttribute(node) {
        const name = node.name?.name;
        if (!UI_ATTRIBUTES.has(name) || !node.value) return;
        if (node.value.type === "Literal" && typeof node.value.value === "string" && hasWords(node.value.value)) {
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
        if (node.parent?.type === "MemberExpression" && node.parent.computed) return;
        if (hasLocaleReference(node.test) && (isTextLiteral(node.consequent) || isTextLiteral(node.alternate))) {
          context.report({ node, messageId: "localeConditional" });
        }
      },
    };
  },
};

export default noUntranslatedUiText;
