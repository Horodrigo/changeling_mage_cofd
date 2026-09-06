import type { Locale } from "./i18n";

export type MeritConfigValue = string | string[];
export type MeritConfiguration = Record<string, MeritConfigValue>;
export type MeritConfigField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "court";
  placeholder?: string;
  minDots?: number;
};
export type MeritConfigDefinition = {
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: "CtL" | "MtA";
};

// Official Merit-specific configuration is rebuilt only after source audit.
export const MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [];
export const findMeritConfiguration = (_name: string): MeritConfigDefinition | undefined => undefined;
export const isInlineMeritConfiguration = (_name: string) => false;
export const isStructuredMerit = (_name: string) => false;
export const meritConfigurationText = (value: string | undefined, _locale: Locale) => value ?? "";

export const normalizeMeritConfiguration = (value: unknown): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key,item]) => [key,Array.isArray(item) ? item.map(String) : String(item ?? "")]))
    : {};

export function meritConfigurationTitle(value: unknown) {
  const configuration = normalizeMeritConfiguration(value);
  for (const item of Object.values(configuration)) {
    if (Array.isArray(item) && item[0]?.trim()) return item[0].trim();
    if (typeof item === "string" && item.trim()) return item.trim();
  }
  return "";
}

export function synchronizeMeritGrants<T>(sheet: T): T {
  return sheet;
}

export function expandedConfigurationLines(
  _name: string,
  _dots: number,
  _value: unknown,
  _locale: Locale = "pt-BR",
): string[] {
  return [];
}
