import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import { findMageAffiliation, hasStandardCreationOrderBenefits } from "./orders";
import { MTA_ORDERS } from "./creation-rules";
import type { MeritDefinition } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { createRandomId } from "@/lib/random-id";

export const NAMELESS_HIGH_SPEECH_BENEFIT = JSON.stringify({ definitionId: "mta-2ed:high-speech", name: "High Speech", dots: 1, sourceId: "mta-2ed", source: "Mage the Awakening" });

/**
 * Mage's pure synchronization hook has no UI catalog. This production bridge recognizes only
 * its old schema-2 automatic grants by producer marker, exact canonical name and canonical source.
 * Explicit IDs are always authoritative. Delete the name branch when ID-less template grants end.
 */
function templateMeritId(merit: MeritSelection) {
  if (merit.definitionId) return merit.definitionId;
  if (!["Ordem", "Nameless Order"].includes(String(merit.grantedBy))) return undefined;
  if (merit.name === "High Speech" && (!merit.sourceId || merit.sourceId === "mta-2ed")) return "mta-2ed:high-speech";
  if (merit.name === "Awakened Status" && merit.grantedBy === "Ordem" && (!merit.sourceId || merit.sourceId === "mta-2ed")) return "mta-2ed:awakened-status";
  if (merit.name === "Mystery Cult Initiation" && merit.grantedBy === "Nameless Order" && (!merit.sourceId || merit.sourceId === "core-2ed")) return "core-2ed:mystery-cult-initiation";
  return undefined;
}

function withoutFreeTemplateDot(merit: MeritSelection, definitionId: string | undefined) {
  const experienceDots = Math.max(0, Number(merit.experienceDots ?? 0));
  const creationDots = Math.max(0, Number(merit.creationDots ?? (merit.dots - experienceDots)) - 1);
  const retained = { ...merit, definitionId, dots: creationDots + experienceDots, creationDots, experienceDots };
  delete retained.grantedBy;
  return retained.dots ? retained : undefined;
}

/** Builder rows contain creation dots only; XP is recomposed from the saved source by mergeCreationMerits. */
export function reconcileMageCreationMeritGrants(current: readonly MeritSelection[], wanted: readonly MeritSelection[], catalog: readonly MeritDefinition[]) {
  const id = (merit: MeritSelection) => merit.definitionId || resolveMeritDefinition(merit, catalog)?.id;
  const automatic = (merit: MeritSelection) => ["Ordem", "Nameless Order"].includes(String(merit.grantedBy)) &&
    ["mta-2ed:awakened-status", "mta-2ed:high-speech", "core-2ed:mystery-cult-initiation"].includes(id(merit) ?? "");
  const wantedIds = new Set(wanted.map(id).filter(Boolean));
  const paidWithExperience = (definitionId: string | undefined) => definitionId && current.some(merit => id(merit) === definitionId && !merit.grantedBy && Number(merit.experienceDots ?? 0) > 0);
  const retained = current.flatMap(merit => {
    const definitionId = id(merit);
    if (automatic(merit)) {
      if (wantedIds.has(definitionId)) return [];
      // Remove only its free dot: all independently allocated creation/XP dots retain their instance.
      const retained = withoutFreeTemplateDot({ ...merit, creationDots: merit.dots }, definitionId);
      return retained?.creationDots ? [{ ...retained, dots: retained.creationDots }] : [];
    }
    return definitionId && wantedIds.has(definitionId) && !Number(merit.experienceDots ?? 0) ? [] : [merit];
  });
  return [...retained, ...wanted.filter(grant => !paidWithExperience(id(grant))).map(grant => {
    const definitionId = id(grant);
    const existing = definitionId ? current.find(merit => id(merit) === definitionId && (merit.grantedBy === grant.grantedBy || (!merit.grantedBy && !Number(merit.experienceDots ?? 0)))) : undefined;
    return { ...existing, instanceId: existing?.instanceId ?? createRandomId(), ...grant, dots: Math.max(1, Number(existing?.dots ?? 1)), configuration: { ...normalizeMeritConfiguration(existing?.configuration), ...grant.configuration } };
  })];
}

export function synchronizeMageBuilderMeritGrants(sheet: CharacterSheet) {
  const order = String(sheet.line_data.order ?? "Orderless");
  const selectedAffiliation=findMageAffiliation(sheet.line_data.affiliation_id);
  const affiliation=selectedAffiliation?.parentOrder===order?selectedAffiliation:undefined;
  if(selectedAffiliation&&!affiliation)sheet.line_data.affiliation_id="";
  const automatic = sheet.merits.filter((item) =>
    (item.grantedBy === "Ordem" && ["mta-2ed:awakened-status", "mta-2ed:high-speech"].includes(templateMeritId(item) ?? "")) ||
    (item.grantedBy === "Nameless Order" && ["core-2ed:mystery-cult-initiation", "mta-2ed:high-speech"].includes(templateMeritId(item) ?? "")),
  );
  const wantedIds = hasStandardCreationOrderBenefits(order) ? ["mta-2ed:awakened-status", "mta-2ed:high-speech"] : order === "Nameless" ? ["core-2ed:mystery-cult-initiation"] : [];
  sheet.merits = sheet.merits.flatMap(item => {
    if (!automatic.includes(item)) return [item];
    if (wantedIds.includes(templateMeritId(item) ?? "")) return [];
    const retained = withoutFreeTemplateDot(item, templateMeritId(item));
    return retained ? [retained] : [];
  });
  if (hasStandardCreationOrderBenefits(order)) {
    const status = automatic.find((item) => templateMeritId(item) === "mta-2ed:awakened-status");
    sheet.merits.push({ ...status, definitionId: "mta-2ed:awakened-status", instanceId: status?.instanceId ?? `order-status-${order}`, name: "Awakened Status", dots: Math.max(1, Number(status?.dots ?? 1)), creationDots: Math.max(1, Number(status?.creationDots ?? (Number(status?.dots ?? 1) - Number(status?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(status?.experienceDots ?? 0)), sourceId: "mta-2ed", source: "Mage the Awakening", configuration: { domain: order, name: order }, grantedBy: "Ordem" });
    const speech = automatic.find((item) => templateMeritId(item) === "mta-2ed:high-speech");
    sheet.merits.push({ ...speech, definitionId: "mta-2ed:high-speech", instanceId: speech?.instanceId ?? `high-speech-${order}`, name: "High Speech", dots: 1, creationDots: 1, experienceDots: 0, sourceId: "mta-2ed", source: "Mage the Awakening", configuration: {}, grantedBy: "Ordem" });
  } else if (order === "Nameless") {
    const initiation = automatic.find((item) => templateMeritId(item) === "core-2ed:mystery-cult-initiation");
    const custom = sheet.line_data.custom_order && typeof sheet.line_data.custom_order === "object" ? sheet.line_data.custom_order as Record<string, unknown> : {};
    const existing = normalizeMeritConfiguration(initiation?.configuration);
    const legacyRoteSkills = Array.isArray(custom.roteSkills) ? custom.roteSkills.map(String).filter(Boolean).slice(0, 3) : [];
    const configuration = { ...existing, cult: String(custom.name ?? ""), level_1_type: "merit", level_1_merits: [NAMELESS_HIGH_SPEECH_BENEFIT], level_2_type: "rote_skills", level_2_rote_skills: Array.isArray(existing.level_2_rote_skills) ? existing.level_2_rote_skills : legacyRoteSkills, level_3_type: "skill", level_3_skill: "Occult" };
    sheet.merits.push({ ...initiation, definitionId: "core-2ed:mystery-cult-initiation", instanceId: initiation?.instanceId ?? "nameless-order-initiation", name: "Mystery Cult Initiation", dots: Math.max(1, Number(initiation?.dots ?? 1)), creationDots: Math.max(1, Number(initiation?.creationDots ?? (Number(initiation?.dots ?? 1) - Number(initiation?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(initiation?.experienceDots ?? 0)), sourceId: "core-2ed", source: "Chronicles of Darkness", configuration, grantedBy: "Nameless Order" });
  }
  const skillBonuses = synchronizeCommonMeritGrants(sheet, (source) => source === "Nameless Order");
  const nameless = order === "Nameless" ? sheet.merits.find((item) => templateMeritId(item) === "core-2ed:mystery-cult-initiation" && item.grantedBy === "Nameless Order") : undefined;
  if (nameless) {
    const configuration = normalizeMeritConfiguration(nameless.configuration);
    configuration.level_1_type = "merit"; configuration.level_1_merits = [NAMELESS_HIGH_SPEECH_BENEFIT]; configuration.level_2_type = "rote_skills"; configuration.level_3_type = "skill"; configuration.level_3_skill = "Occult";
    nameless.configuration = configuration;
    sheet.line_data.rote_skills = nameless.dots >= 2 && Array.isArray(configuration.level_2_rote_skills) ? configuration.level_2_rote_skills.map(String).filter(Boolean).slice(0, 3) : [];
    sheet.line_data.order_occult_bonus = 0;
  }
  const baseRoteSkills = order === "Nameless"
    ? (Array.isArray(sheet.line_data.rote_skills) ? sheet.line_data.rote_skills.map(String) : [])
    : hasStandardCreationOrderBenefits(order)
      ? [...(affiliation?.roteSkills?.length?affiliation.roteSkills:(MTA_ORDERS[order]??[]))]
      : [];
  const factionRoteSkills = sheet.merits
    .filter((item) => item.name === "Faction Member" && item.dots >= 3)
    .map((item) => String(normalizeMeritConfiguration(item.configuration).roteSkill ?? ""))
    .filter(Boolean);
  sheet.line_data.rote_skills = [...new Set([...baseRoteSkills, ...factionRoteSkills])];
  sheet.line_data.merit_granted_skill_bonuses = skillBonuses;
  return sheet;
}
