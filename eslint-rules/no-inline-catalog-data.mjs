const IDENTITY_KEYS = new Set(["id", "name", "value", "label"]);
const CONTENT_KEYS = new Set([
  "allWillpower", "allWillpowerPt", "attributes", "benefit", "blessing", "blessingEn",
  "causing", "coverage", "curse", "curseEn", "description", "effect", "ending",
  "initiation", "notes", "oblations", "organization", "page", "prerequisites",
  "roteSkills", "singleWillpower", "singleWillpowerPt", "skills", "source", "sourceId",
  "special", "theory", "toolYantra", "translatedName", "yantras",
]);

const unwrap = (node) => {
  while (["TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression"].includes(node?.type)) node = node.expression;
  return node;
};

const propertyName = (property) => {
  if (property?.type !== "Property" || property.computed) return "";
  return property.key.type === "Identifier" ? property.key.name : String(property.key.value ?? "");
};

const objectKeys = (node) => new Set(unwrap(node)?.type === "ObjectExpression"
  ? unwrap(node).properties.map(propertyName).filter(Boolean)
  : []);

const hasAny = (keys, expected) => [...keys].some((key) => expected.has(key));
const isRecord = (node, identityRequired = true) => {
  const keys = objectKeys(node);
  return (!identityRequired || hasAny(keys, IDENTITY_KEYS)) && hasAny(keys, CONTENT_KEYS);
};

const literalCount = (node) => {
  node = unwrap(node);
  if (!node) return 0;
  if (node.type === "Literal") return 1;
  if (node.type === "ArrayExpression") return node.elements.reduce((sum, item) => sum + literalCount(item), 0);
  if (node.type === "ObjectExpression") return node.properties.reduce((sum, property) => sum + (property.type === "Property" ? literalCount(property.value) : 0), 0);
  return 0;
};

const isCatalog = (node) => {
  node = unwrap(node);
  if (!node) return false;
  if (node.type === "ArrayExpression") {
    const elements = node.elements.map(unwrap).filter(Boolean);
    const records = elements.filter((item) => isRecord(item));
    if (records.length >= 2) return true;
    const calls = elements.filter((item) => item.type === "CallExpression" && item.arguments.reduce((sum, argument) => sum + literalCount(argument), 0) >= 4);
    return calls.length >= 2;
  }
  if (node.type !== "ObjectExpression") return false;
  if (isRecord(node) && ["source", "sourceId", "page"].some((key) => objectKeys(node).has(key))) return true;
  const values = node.properties
    .filter((property) => property.type === "Property")
    .map((property) => unwrap(property.value));
  return values.filter((value) => isRecord(value, false)).length >= 2;
};

export default {
  meta: {
    type: "problem",
    docs: { description: "require published static catalog data to live in JSON resources" },
    schema: [],
    messages: { inlineCatalog: "Move static catalog data to a JSON resource; keep TypeScript limited to types and mechanics." },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier" || !isCatalog(node.init)) return;
        const declaration = node.parent;
        if (declaration?.type !== "VariableDeclaration") return;
        const container = declaration.parent;
        if (container?.type !== "Program" && container?.type !== "ExportNamedDeclaration") return;
        context.report({ node, messageId: "inlineCatalog" });
      },
    };
  },
};
