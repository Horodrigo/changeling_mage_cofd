import type { CharacterSheet } from "@/lib/core/character/character-types";

const GRANT_SOURCE = "Vampire Template";

export function synchronizeVampireBuilderMeritGrants(sheet: CharacterSheet) {
  const group = String(sheet.line_data.kindred_status_group ?? "").trim();
  const existing = sheet.merits.find((item) => item.name === "Kindred Status" && item.grantedBy === GRANT_SOURCE);
  sheet.merits = sheet.merits.filter((item) => !(item.name === "Kindred Status" && item.grantedBy === GRANT_SOURCE));

  if (group) {
    const experienceDots = Math.max(0, Number(existing?.experienceDots ?? 0));
    const creationDots = Math.max(1, Number(existing?.creationDots ?? existing?.dots ?? 1) - experienceDots);
    sheet.merits.push({
      ...existing,
      instanceId: existing?.instanceId ?? "vampire-template-kindred-status",
      name: "Kindred Status",
      dots: creationDots + experienceDots,
      creationDots,
      experienceDots,
      sourceId: "vtr-2ed",
      source: "Vampire: The Requiem Second Edition",
      configuration: { group },
      grantedBy: GRANT_SOURCE,
    });
  }
  return sheet;
}
