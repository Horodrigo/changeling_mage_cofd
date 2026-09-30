import { messages, translate, type Locale } from "./i18n";

/** Category keys remain canonical; unknown player-authored categories stay verbatim. */
export function meritCategoryLabel(category: string, locale: Locale): string {
  const labels = messages[locale].meritCategories;
  return labels && typeof labels === "object" && typeof labels[category] === "string"
    ? translate(locale, `meritCategories.${category}`)
    : category;
}
