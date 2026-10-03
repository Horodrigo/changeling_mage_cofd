import { messages, translate, type Locale } from "./i18n";
import { meritPresentation } from "./merit-presentation";
import type { MeritDefinition, MeritSelectionProblem } from "./merits";

/** Validation uses canonical rules; its prerequisite text uses the same catalog view as the UI. */
export function meritProblemMessage(problem: MeritSelectionProblem, definition: MeritDefinition, locale: Locale, catalog: readonly MeritDefinition[] = []): string {
  const presented = meritPresentation(definition, locale);
  const params = {...problem.params};
  if (params.prerequisites !== undefined) params.prerequisites = presented.prerequisites ?? presented.name;
  if (problem.meritIds) params.merits = problem.meritIds.map(id => {
    const linked = catalog.find(item => item.id === id);
    return linked ? meritPresentation(linked, locale).name : id;
  }).join(", ");
  return translate(locale, problem.key, params);
}

/** Category keys remain canonical; unknown player-authored categories stay verbatim. */
export function meritCategoryLabel(category: string, locale: Locale): string {
  const labels = messages[locale].meritCategories;
  return labels && typeof labels === "object" && typeof labels[category] === "string"
    ? translate(locale, `meritCategories.${category}`)
    : category;
}
