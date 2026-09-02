type PowerKey = "wyrd" | "gnosis";
type PowerSheet = {
  line_data: Record<string, unknown>;
  current_state?: Record<string, unknown>;
};

function rating(value: unknown, fallback = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(1, Math.min(10, Math.trunc(number))) : fallback;
}

/** Creation dots spend merits; later dots spend XP and must never be clamped by the builder. */
export function powerProgression(sheet: PowerSheet | null | undefined, key: PowerKey) {
  const current = rating(sheet?.line_data[key] ?? 1);
  const explicit = sheet?.line_data[`creation_${key}`];
  let creation = explicit === undefined ? Math.min(3, current) : rating(explicit);
  if (explicit === undefined && sheet) {
    const history = sheet.current_state?.[key === "wyrd" ? "experience_history" : "mage_experience_history"];
    const previous: number[] = [];
    if (Array.isArray(history)) for (const entry of history) {
      if (key === "wyrd" && entry?.undo?.kind === "wyrd") previous.push(rating(entry.undo.previous));
      if (key === "gnosis" && /^Gnose \d+$/.test(entry?.description ?? "") && entry?.before?.line_data?.gnosis !== undefined)
        previous.push(rating(entry.before.line_data.gnosis));
    }
    if (previous.length) creation = Math.min(creation, ...previous);
  }
  creation = Math.min(current, creation);
  return { creation, advancement: current - creation, current };
}

export function withPowerRating(sheet: PowerSheet, key: PowerKey, next: number) {
  return {
    ...sheet.line_data,
    [`creation_${key}`]: powerProgression(sheet, key).creation,
    [key]: rating(next),
  };
}

export function refundPowerRating(sheet: PowerSheet, key: PowerKey) {
  const { creation, current } = powerProgression(sheet, key);
  return withPowerRating(sheet, key, Math.max(creation, current - 1));
}

export function creationMeritAllowance(sheet: (PowerSheet & { merits: Array<{ dots: number; grantedBy?: string }> }) | null | undefined, key: PowerKey) {
  if (!sheet) return 10;
  // Existing XP merits are already paid: editing must not charge them again.
  const spent = sheet.merits.filter(item => !item.grantedBy).reduce((sum, item) => sum + item.dots, 0);
  return Math.max(10, spent + (powerProgression(sheet, key).creation - 1) * 5);
}
