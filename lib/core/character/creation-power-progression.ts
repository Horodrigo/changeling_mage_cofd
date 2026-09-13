type PowerSheet = { line_data: Record<string, unknown> };

function rating(value: unknown, fallback = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(1, Math.min(10, Math.trunc(number))) : fallback;
}

/** Neutral creation/advancement split. Line modules own any historical XP interpretation. */
export function creationPowerProgression(
  sheet: PowerSheet | null | undefined,
  key: string,
  historicalRatings: readonly number[] = [],
) {
  const current = rating(sheet?.line_data[key] ?? 1);
  const explicit = sheet?.line_data[`creation_${key}`];
  let creation = explicit === undefined ? Math.min(3, current) : rating(explicit);
  if (explicit === undefined && historicalRatings.length)
    creation = Math.min(creation, ...historicalRatings.map((value) => rating(value)));
  creation = Math.min(current, creation);
  return { creation, advancement: current - creation, current };
}
