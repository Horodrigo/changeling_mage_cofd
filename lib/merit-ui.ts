import { messages, translate, type Locale } from "./i18n";
import { meritPresentation } from "./merit-presentation";
import type { MeritDefinition, MeritSelectionProblem } from "./merits";

/** Validation uses canonical rules; its prerequisite text uses the same catalog view as the UI. */
export function meritProblemMessage(problem: MeritSelectionProblem, definition: MeritDefinition, locale: Locale): string {
  const presented = meritPresentation(definition, locale);
  return translate(locale, problem.key, problem.params?.prerequisites === undefined ? problem.params : {
    ...problem.params, prerequisites: presented.prerequisites ?? presented.name,
  });
}

/** Category keys remain canonical; unknown player-authored categories stay verbatim. */
export function meritCategoryLabel(category: string, locale: Locale): string {
  const labels = messages[locale].meritCategories;
  return labels && typeof labels === "object" && typeof labels[category] === "string"
    ? translate(locale, `meritCategories.${category}`)
    : category;
}
