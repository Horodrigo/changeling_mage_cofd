export function meetsArcanaRequirements(
  requirements: Record<string, number>,
  arcana: Record<string, number>,
) {
  const translatedArcana: Record<string, string> = {
    Death: "Morte", Fate: "Destino", Forces: "Forças", Life: "Vida", Matter: "Matéria",
    Mind: "Mente", Prime: "Primórdio", Space: "Espaço", Spirit: "Espírito", Time: "Tempo",
  };
  return Object.entries(requirements).every(
    ([arcanum, dots]) => Number(arcana[arcanum] ?? arcana[translatedArcana[arcanum]] ?? 0) >= dots,
  );
}

export function arcanaCreationErrors(
  arcana: Record<string, number>,
  path?: { ruling: readonly string[]; inferior?: string },
) {
  const errors: string[] = [];
  const total = Object.values(arcana).reduce((sum, value) => sum + Number(value), 0);
  if (total !== 6)
    errors.push(total < 6
      ? `Distribua mais ${6 - total} ponto(s) de Arcana (atual: ${total}/6)`
      : `Remova ${total - 6} ponto(s) de Arcana (atual: ${total}/6)`);
  if (Object.values(arcana).filter((value) => Number(value) === 3).length > 1)
    errors.push("Somente um Arcano pode começar com 3 pontos");
  if (!path) return errors;
  const missingRuling = path.ruling.filter((arcanum) => Number(arcana[arcanum] ?? 0) < 1);
  if (missingRuling.length)
    errors.push(`Cada Arcano Regente precisa de ao menos 1 ponto: ${missingRuling.join(" e ")}`);
  const rulingTotal = path.ruling.reduce((sum, arcanum) => sum + Number(arcana[arcanum] ?? 0), 0);
  if (rulingTotal < 3) errors.push(`Os Arcanos Regentes precisam somar ao menos 3 (atual: ${rulingTotal})`);
  if (rulingTotal > 5) errors.push(`Os Arcanos Regentes podem somar no máximo 5 (atual: ${rulingTotal})`);
  if (path.inferior && Number(arcana[path.inferior] ?? 0) !== 0)
    errors.push(`O Arcano Inferior ${path.inferior} deve começar com 0 pontos`);
  return errors;
}
