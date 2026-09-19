import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { parse } from "@typescript-eslint/parser";
import { ESLint } from "eslint";

const root = process.cwd();
const write = process.argv.includes("--write");
const report = await new ESLint({ cwd: root }).lintFiles(["."]);
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
const { messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
await vite.close();

const flatten = (value, prefix = "") => Object.entries(value).flatMap(([key, child]) =>
  typeof child === "string" ? [[`${prefix}${key}`, child]] : flatten(child, `${prefix}${key}.`),
);
const pt = new Map(flatten(messages["pt-BR"]));
const en = new Map(flatten(messages["en-US"]));
const pairs = [...pt].map(([key, value]) => ({ key, pt: value, en: en.get(key) }));
const byValue = new Map();
for (const pair of pairs) {
  for (const value of new Set([pair.pt, pair.en])) {
    if (typeof value === "string") byValue.set(value, [...(byValue.get(value) ?? []), pair]);
  }
}
const preferred = (items) => [...new Map(items.map((item) => [item.key, item])).values()]
  .sort((a, b) => a.key.length - b.key.length || a.key.localeCompare(b.key))[0];
const directPair = (value) => preferred(byValue.get(value) ?? []);
const pairedTranslation = (first, second) => preferred(pairs.filter((pair) =>
  pair.pt === first && pair.en === second || pair.pt === second && pair.en === first,
));
const hasWords = (value) => /\p{L}/u.test(value);
const sourceFor = (source, node) => source.slice(node.range[0], node.range[1]);
const templateFor = (source, node) => {
  if (node?.type === "Literal" && typeof node.value === "string") return { value: node.value, params: [] };
  if (node?.type !== "TemplateLiteral") return undefined;
  const params = node.expressions.map((expression) => sourceFor(source, expression));
  const value = node.quasis.map((quasi, index) => `${quasi.value.cooked ?? quasi.value.raw}${index < params.length ? `{p${index + 1}}` : ""}`).join("");
  return { value, params };
};
const translatedCall = (pair, params) => `t(${JSON.stringify(pair.key)}${params.length ? `, { ${params.map((value, index) => `p${index + 1}: ${value}`).join(", ")} }` : ""})`;

let changedFiles = 0;
let replacements = 0;
const skipped = new Map();
for (const file of report) {
  const relevant = file.messages.filter((message) => message.ruleId === "i18n/no-untranslated-ui-text");
  if (!relevant.length) continue;
  const source = await readFile(file.filePath, "utf8");
  if (!/\{[^}]*\bt\b[^}]*\}\s*=\s*useLanguage\(/.test(source)) {
    skipped.set(path.relative(root, file.filePath), relevant.length);
    continue;
  }
  const ast = parse(source, { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true }, loc: true, range: true });
  const wanted = new Set(relevant.map((message) => `${message.nodeType}:${message.line}:${message.column}`));
  const edits = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    const id = node.loc ? `${node.type}:${node.loc.start.line}:${node.loc.start.column + 1}` : "";
    if (wanted.has(id)) {
      let replacement;
      if (node.type === "JSXText") {
        const value = node.value.trim();
        const pair = hasWords(value) && directPair(value);
        if (pair) replacement = `{${translatedCall(pair, [])}}`;
      } else if (node.type === "JSXAttribute") {
        const expression = node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;
        const template = templateFor(source, expression);
        const pair = template && directPair(template.value);
        if (pair) replacement = `${sourceFor(source, node.name)}={${translatedCall(pair, template.params)}}`;
      } else if (node.type === "ConditionalExpression") {
        const consequent = templateFor(source, node.consequent);
        const alternate = templateFor(source, node.alternate);
        if (consequent && alternate && consequent.params.join("\0") === alternate.params.join("\0")) {
          const pair = pairedTranslation(consequent.value, alternate.value);
          if (pair) replacement = translatedCall(pair, consequent.params);
        }
      }
      if (replacement) edits.push({ start: node.range[0], end: node.range[1], replacement });
    }
    for (const [key, child] of Object.entries(node)) {
      if (["parent", "loc", "range", "tokens", "comments"].includes(key)) continue;
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === "object" && typeof child.type === "string") visit(child);
    }
  };
  visit(ast);
  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  let next = source;
  let lastStart = source.length + 1;
  for (const edit of edits) {
    if (edit.end > lastStart) continue;
    next = next.slice(0, edit.start) + edit.replacement + next.slice(edit.end);
    lastStart = edit.start;
    replacements += 1;
  }
  changedFiles += 1;
  if (write) await writeFile(file.filePath, next);
}

console.log(JSON.stringify({ write, changedFiles, replacements, skipped: Object.fromEntries(skipped) }, null, 2));
