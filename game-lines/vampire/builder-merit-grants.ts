import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import shadowCultCatalog from "./catalog-data/shadow-cults.json";

const TEMPLATE_SOURCE = "Vampire Template";
export const SHADOW_CULT_SOURCE = "Vampire Shadow Cult";
export const SHADOW_CULT_IDS = ["followers-of-seth", "inconnu", "moirai", "moulding-room", "children-of-the-thorns", "faithful-of-propylaia"] as const;

const SHADOW_CULTS = shadowCultCatalog as Record<(typeof SHADOW_CULT_IDS)[number], { name: string; sourceId: string; source: string; configuration: MeritConfiguration }>;

export function isShadowCultId(id: string): id is (typeof SHADOW_CULT_IDS)[number] {
  return SHADOW_CULT_IDS.includes(id as (typeof SHADOW_CULT_IDS)[number]);
}

export function synchronizeVampireBuilderMeritGrants(sheet: CharacterSheet) {
  const primaryCovenant = String(sheet.line_data.covenant_id ?? "covenantless");
  const group = String(sheet.line_data.kindred_status_group ?? "").trim();
  const automatic = sheet.merits.filter((item) =>
    (item.name === "Kindred Status" && item.grantedBy === TEMPLATE_SOURCE) ||
    (item.name === "Mystery Cult Initiation" && item.grantedBy === SHADOW_CULT_SOURCE),
  );
  sheet.merits = sheet.merits.filter((item) => !automatic.includes(item));

  if (isShadowCultId(primaryCovenant)) {
    const cult = SHADOW_CULTS[primaryCovenant];
    const existing = automatic.find((item) => item.name === "Mystery Cult Initiation");
    const experienceDots = Math.max(0, Number(existing?.experienceDots ?? 0));
    const creationDots = Math.max(1, Number(existing?.creationDots ?? existing?.dots ?? 1) - experienceDots);
    sheet.merits.push({ ...existing, instanceId: existing?.instanceId ?? `shadow-cult-${primaryCovenant}`, name: "Mystery Cult Initiation", dots: creationDots + experienceDots, creationDots, experienceDots, sourceId: cult.sourceId, source: cult.source, configuration: { ...normalizeMeritConfiguration(existing?.configuration), cult: cult.name, ...cult.configuration }, grantedBy: SHADOW_CULT_SOURCE });
  } else if (group) {
    const existing = automatic.find((item) => item.name === "Kindred Status");
    const experienceDots = Math.max(0, Number(existing?.experienceDots ?? 0));
    const creationDots = Math.max(1, Number(existing?.creationDots ?? existing?.dots ?? 1) - experienceDots);
    sheet.merits.push({ ...existing, instanceId: existing?.instanceId ?? "vampire-template-kindred-status", name: "Kindred Status", dots: creationDots + experienceDots, creationDots, experienceDots, sourceId: "vtr-2ed", source: "Vampire: The Requiem Second Edition", configuration: { group }, grantedBy: TEMPLATE_SOURCE });
  }
  sheet.line_data.merit_granted_skill_bonuses = synchronizeCommonMeritGrants(sheet, (source) => source === SHADOW_CULT_SOURCE);
  return sheet;
}
