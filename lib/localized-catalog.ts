export type AppLocale = "pt-BR" | "en-US";

export type CatalogIdentity = {
  id: string;
  name: string;
  originalName?: string;
  translatedName?: string;
};

export type EnglishCatalogEntry<Field extends string = string> =
  Partial<Record<Field, string>> & { name?: string };

export type EnglishCatalogMap<Field extends string = string> =
  Readonly<Record<string, EnglishCatalogEntry<Field>>>;

export type CatalogFallback = "pt-BR" | "empty";

export type LocalizedCatalogPresentation<Field extends string> = {
  id: string;
  name: string;
  fields: Record<Field, string>;
  /** English fields which are currently being shown in Portuguese or as empty. */
  fallbackFields: Array<"name" | Field>;
};

type PresentationOptions<Field extends string> = {
  fields: readonly Field[];
  english?: EnglishCatalogMap<Field>;
  fallback?: CatalogFallback;
};

function nonBlank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function portugueseName(item: CatalogIdentity) {
  return nonBlank(item.translatedName) ? item.translatedName : item.name;
}

/**
 * Returns the known English name without guessing from a Portuguese-only name.
 * Catalogs whose `name` is their canonical English identity signal that by also
 * carrying `translatedName` (as the Kith and Merit catalogs currently do).
 */
function knownEnglishName(item: CatalogIdentity, entry?: EnglishCatalogEntry) {
  if (nonBlank(entry?.name)) return entry.name;
  if (nonBlank(item.originalName)) return item.originalName;
  if (nonBlank(item.translatedName) && nonBlank(item.name)) return item.name;
  return undefined;
}

export function catalogDisplayName(
  item: CatalogIdentity,
  locale: AppLocale,
  english?: EnglishCatalogEntry,
  fallback: CatalogFallback = "pt-BR",
) {
  if (locale === "pt-BR") return portugueseName(item);
  return knownEnglishName(item, english) ?? (fallback === "pt-BR" ? portugueseName(item) : "");
}

/**
 * Builds an immutable presentation view. IDs and every value on the source
 * object remain untouched, so saved sheets and rule references stay stable.
 */
export function localizeCatalogItem<
  Item extends CatalogIdentity & Record<Field, unknown>,
  Field extends string,
>(
  item: Item,
  locale: AppLocale,
  options: PresentationOptions<Field>,
): LocalizedCatalogPresentation<Field> {
  const fallback = options.fallback ?? "pt-BR";
  const english = options.english?.[item.id];
  const fallbackFields: Array<"name" | Field> = [];
  let name = portugueseName(item);

  if (locale === "en-US") {
    const knownName = knownEnglishName(item, english);
    if (knownName) name = knownName;
    else {
      fallbackFields.push("name");
      name = fallback === "pt-BR" ? name : "";
    }
  }

  const fields = {} as Record<Field, string>;
  for (const field of options.fields) {
    const portuguese = nonBlank(item[field]) ? String(item[field]) : "";
    if (locale === "pt-BR") {
      fields[field] = portuguese;
      continue;
    }

    const translated = english?.[field];
    if (nonBlank(translated)) fields[field] = translated;
    else {
      fallbackFields.push(field);
      fields[field] = fallback === "pt-BR" ? portuguese : "";
    }
  }

  return { id: item.id, name, fields, fallbackFields };
}

/** Both labels remain searchable after switching language. */
export function catalogSearchLabels(
  item: CatalogIdentity,
  english?: EnglishCatalogEntry,
) {
  return [...new Set([
    portugueseName(item),
    knownEnglishName(item, english),
  ].filter(nonBlank))];
}
