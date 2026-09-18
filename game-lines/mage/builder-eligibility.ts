import { translate, type Locale } from "@/lib/i18n";

export function meetsArcanaRequirements(
  requirements: Record<string, number>,
  arcana: Record<string, number>,
) {
  return Object.entries(requirements).every(
    ([arcanum, dots]) => Number(arcana[arcanum] ?? 0) >= dots,
  );
}

export function arcanaCreationErrors(
  arcana: Record<string, number>,
  path?: { ruling: readonly string[]; inferior?: string },
  locale: Locale = "pt-BR",
) {
  const errors: string[] = [];
  const dots = (value: unknown) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  const total = Object.values(arcana).reduce((sum, value) => sum + dots(value), 0);
  if (total !== 6) {
    const key = total < 6 ? "builder.eligibility.addArcana" : "builder.eligibility.removeArcana";
    errors.push(translate(locale, key, { count: Math.abs(6 - total), total }));
  }
  if (Object.values(arcana).filter((value) => dots(value) === 3).length > 1)
    errors.push(translate(locale, "builder.eligibility.onlyOneAtThree"));
  if (!path) return errors;
  const missingRuling = path.ruling.filter((arcanum) => dots(arcana[arcanum]) < 1);
  if (missingRuling.length)
    errors.push(translate(locale, "builder.eligibility.missingRuling", {
      arcana: missingRuling.join(translate(locale, "builder.eligibility.rulingSeparator")),
    }));
  const rulingTotal = path.ruling.reduce((sum, arcanum) => sum + dots(arcana[arcanum]), 0);
  if (rulingTotal < 3)
    errors.push(translate(locale, "builder.eligibility.rulingMin", { total: rulingTotal }));
  if (rulingTotal > 5)
    errors.push(translate(locale, "builder.eligibility.rulingMax", { total: rulingTotal }));
  if (path.inferior && dots(arcana[path.inferior]) !== 0)
    errors.push(translate(locale, "builder.eligibility.inferiorZero", { arcanum: path.inferior }));
  return errors;
}
