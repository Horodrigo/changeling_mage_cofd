import { ATTRIBUTES, SKILLS } from "./creation-rules";

const collator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });
const traits = new Set<string>([...Object.values(ATTRIBUTES).flat(), ...Object.values(SKILLS).flat()]);

export const compareOptionLabels = (a: string, b: string) => collator.compare(a, b);

// Always sort a copy: catalog order and saved slot indexes are not presentation state.
export function alphabetical<T>(items: readonly T[], label: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareOptionLabels(label(a), label(b)));
}

export function orderedChoiceOptions(options: readonly string[], labels: Record<string, string> = {}) {
  const entries = options.filter(value => value && !value.startsWith("__"));
  if (entries.length && entries.every(value => traits.has(labels[value] ?? value))) return [...options];
  const placeholders = options.filter(value => !value || value.startsWith("__"));
  return [...placeholders, ...alphabetical(entries, value => labels[value] ?? value)];
}
