export const CTL_SEEMING_LABELS: Record<string, string> = {
  Beast: "Fera",
  Darkling: "Trevoso",
  Elemental: "Elemental",
  Fairest: "Belíssimo",
  Ogre: "Ogro",
  Wizened: "Mirrado",
  Grimm: "Grimm",
};

export function seemingDisplayName(
  value: unknown,
  locale: "pt-BR" | "en-US" = "pt-BR",
) {
  const key = String(value ?? "");
  return locale === "en-US" ? key : CTL_SEEMING_LABELS[key] ?? key;
}
