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
  locale: "pt-BR" | "en-US" = "pt-BR",
) {
  const errors: string[] = [];
  const dots = (value: unknown) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  const total = Object.values(arcana).reduce((sum, value) => sum + dots(value), 0);
  if (total !== 6)
    errors.push(locale === "en-US"
      ? total < 6 ? `Add ${6 - total} Arcana dot(s) (current: ${total}/6)` : `Remove ${total - 6} Arcana dot(s) (current: ${total}/6)`
      : total < 6 ? `Distribua mais ${6 - total} ponto(s) de Arcana (atual: ${total}/6)` : `Remova ${total - 6} ponto(s) de Arcana (atual: ${total}/6)`);
  if (Object.values(arcana).filter((value) => dots(value) === 3).length > 1)
    errors.push(locale === "en-US" ? "Only one Arcanum may start with 3 dots" : "Somente um Arcano pode começar com 3 pontos");
  if (!path) return errors;
  const missingRuling = path.ruling.filter((arcanum) => dots(arcana[arcanum]) < 1);
  if (missingRuling.length)
    errors.push(locale === "en-US" ? `Each Ruling Arcanum needs at least 1 dot: ${missingRuling.join(" and ")}` : `Cada Arcano Regente precisa de ao menos 1 ponto: ${missingRuling.join(" e ")}`);
  const rulingTotal = path.ruling.reduce((sum, arcanum) => sum + dots(arcana[arcanum]), 0);
  if (rulingTotal < 3) errors.push(locale === "en-US" ? `Ruling Arcana must total at least 3 (current: ${rulingTotal})` : `Os Arcanos Regentes precisam somar ao menos 3 (atual: ${rulingTotal})`);
  if (rulingTotal > 5) errors.push(locale === "en-US" ? `Ruling Arcana may total no more than 5 (current: ${rulingTotal})` : `Os Arcanos Regentes podem somar no máximo 5 (atual: ${rulingTotal})`);
  if (path.inferior && dots(arcana[path.inferior]) !== 0)
    errors.push(locale === "en-US" ? `Inferior Arcanum ${path.inferior} must start at 0 dots` : `O Arcano Inferior ${path.inferior} deve começar com 0 pontos`);
  return errors;
}
