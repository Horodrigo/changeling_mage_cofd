import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";

const TEMPLATE_SOURCE = "Vampire Template";
export const SHADOW_CULT_SOURCE = "Vampire Shadow Cult";
export const SHADOW_CULT_IDS = ["followers-of-seth", "inconnu", "moirai", "moulding-room", "children-of-the-thorns", "faithful-of-propylaia"] as const;

const SHADOW_CULTS: Record<(typeof SHADOW_CULT_IDS)[number], { name: string; sourceId: string; source: string; configuration: MeritConfiguration }> = {
  "followers-of-seth": { name: "Followers of Seth", sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", configuration: { level_1_type: "specialty", level_1_specialty_skill: "Occult", level_1_specialty_name: "Spirits", level_2_type: "merit", level_2_merits: ["Demolisher|1"], level_3_type: "skill", level_3_skill: "Weaponry", level_4_type: "merit", level_4_merits: ["Medium|3"], level_5_type: "custom", level_5_custom: "Spend Willpower to make the vampire's blood a bane to spirits for the scene." } },
  inconnu: { name: "Inconnu", sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", configuration: { level_1_type: "specialty", level_1_specialty_skill: "Investigation", level_1_specialty_name: "Kindred", level_2_type: "merit", level_2_merits: ["Alternate Identity|1"], level_3_type: "skill", level_3_skill: "Stealth", level_4_type: "merit", level_4_merits: ["Resources|3"], level_5_type: "custom", level_5_custom: "See past the Lost Visage according to Humanity." } },
  moirai: { name: "Moirai", sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", configuration: { level_1_type: "specialty", level_1_specialty_skill: "Occult", level_1_specialty_name: "Prophecy", level_2_type: "merit", level_2_merits: ["Fast Reflexes|1"], level_3_type: "skill", level_3_skill: "Occult", level_4_type: "merit", level_4_merits: ["Anonymity|3"], level_5_type: "custom", level_5_custom: "Spend Willpower to act normally when surprised or take an instant action immediately before the foretold event." } },
  "moulding-room": { name: "The Moulding Room", sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", configuration: { level_1_type: "specialty", level_1_specialty_skill: "Investigation", level_1_specialty_name: "Surveillance", level_2_type: "merit", level_2_merits: ["Trained Observer|1"], level_3_type: "skill", level_3_skill: "Expression", level_4_type: "merits", level_4_merits: ["Cacophony Savvy|3"], level_5_type: "merit", level_5_merits: ["Fame|3"] } },
  "children-of-the-thorns": { name: "Children of the Thorns", sourceId: "h-vtr-agony-ecstasy", source: "Agony & Ecstasy: Circle of the Crone", configuration: {} },
  "faithful-of-propylaia": { name: "Faithful of Propylaia", sourceId: "h-vtr-agony-ecstasy", source: "Agony & Ecstasy: Circle of the Crone", configuration: { level_1_type: "merit", level_1_merits: ["Tolerance for Biology|1"], level_2_type: "custom", level_2_custom: "Choose Crafts (Butchery) or Occult (Offerings) as a Specialty.", level_3_type: "custom", level_3_custom: "Gain one dot in Socialize or Subterfuge.", level_4_type: "custom", level_4_custom: "Gain the printed Iron Will benefit against doubt.", level_5_type: "custom", level_5_custom: "Mortals hear the dead in Twilight; vampires gain Arcane Sight regardless of Auspex." } },
};

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
