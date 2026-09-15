import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import { hasPublishedMageOrder } from "@/lib/mage-orders";

export function synchronizeMageBuilderMeritGrants(sheet: CharacterSheet) {
  const order = String(sheet.line_data.order ?? "Orderless");
  const automatic = sheet.merits.filter((item) =>
    (item.grantedBy === "Ordem" && ["Awakened Status", "High Speech"].includes(item.name)) ||
    (item.grantedBy === "Nameless Order" && ["Mystery Cult Initiation", "High Speech"].includes(item.name)),
  );
  sheet.merits = sheet.merits.filter((item) => !automatic.includes(item));
  if (hasPublishedMageOrder(order)) {
    const status = automatic.find((item) => item.name === "Awakened Status");
    sheet.merits.push({ ...status, instanceId: status?.instanceId ?? `order-status-${order}`, name: "Awakened Status", dots: Math.max(1, Number(status?.dots ?? 1)), creationDots: Math.max(1, Number(status?.creationDots ?? (Number(status?.dots ?? 1) - Number(status?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(status?.experienceDots ?? 0)), sourceId: "mta-2ed", source: "Mage the Awakening", configuration: { domain: order, name: order }, grantedBy: "Ordem" });
    const speech = automatic.find((item) => item.name === "High Speech");
    sheet.merits.push({ ...speech, instanceId: speech?.instanceId ?? `high-speech-${order}`, name: "High Speech", dots: 1, creationDots: 1, experienceDots: 0, sourceId: "mta-2ed", source: "Mage the Awakening", configuration: {}, grantedBy: "Ordem" });
  } else if (order === "Nameless") {
    const initiation = automatic.find((item) => item.name === "Mystery Cult Initiation");
    const custom = sheet.line_data.custom_order && typeof sheet.line_data.custom_order === "object" ? sheet.line_data.custom_order as Record<string, unknown> : {};
    const existing = normalizeMeritConfiguration(initiation?.configuration);
    const legacyRoteSkills = Array.isArray(custom.roteSkills) ? custom.roteSkills.map(String).filter(Boolean).slice(0, 3) : [];
    const configuration = { ...existing, cult: String(custom.name ?? ""), level_1_type: "merit", level_1_merits: ["High Speech|1"], level_2_type: "rote_skills", level_2_rote_skills: Array.isArray(existing.level_2_rote_skills) ? existing.level_2_rote_skills : legacyRoteSkills, level_3_type: "skill", level_3_skill: "Occult" };
    sheet.merits.push({ ...initiation, instanceId: initiation?.instanceId ?? "nameless-order-initiation", name: "Mystery Cult Initiation", dots: Math.max(1, Number(initiation?.dots ?? 1)), creationDots: Math.max(1, Number(initiation?.creationDots ?? (Number(initiation?.dots ?? 1) - Number(initiation?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(initiation?.experienceDots ?? 0)), sourceId: "core-2ed", source: "Chronicles of Darkness", configuration, grantedBy: "Nameless Order" });
  }
  const skillBonuses = synchronizeCommonMeritGrants(sheet, (source) => source === "Nameless Order");
  const nameless = order === "Nameless" ? sheet.merits.find((item) => item.name === "Mystery Cult Initiation" && item.grantedBy === "Nameless Order") : undefined;
  if (nameless) {
    const configuration = normalizeMeritConfiguration(nameless.configuration);
    configuration.level_1_type = "merit"; configuration.level_1_merits = ["High Speech|1"]; configuration.level_2_type = "rote_skills"; configuration.level_3_type = "skill"; configuration.level_3_skill = "Occult";
    nameless.configuration = configuration;
    sheet.line_data.rote_skills = nameless.dots >= 2 && Array.isArray(configuration.level_2_rote_skills) ? configuration.level_2_rote_skills.map(String).filter(Boolean).slice(0, 3) : [];
    sheet.line_data.order_occult_bonus = 0;
  }
  sheet.line_data.merit_granted_skill_bonuses = skillBonuses;
  return sheet;
}
