import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import shadowCultCatalog from "./catalog-data/shadow-cults.json";
import { createRandomId } from "@/lib/random-id";

const TEMPLATE_SOURCE = "Vampire Template";
export const SHADOW_CULT_SOURCE = "Vampire Shadow Cult";
export const SHADOW_CULT_IDS = ["followers-of-seth", "inconnu", "moirai", "moulding-room", "children-of-the-thorns", "faithful-of-propylaia"] as const;

const SHADOW_CULTS = shadowCultCatalog as Record<(typeof SHADOW_CULT_IDS)[number], { name: string; sourceId: string; source: string; configuration: MeritConfiguration }>;

export function isShadowCultId(id: string): id is (typeof SHADOW_CULT_IDS)[number] {
  return SHADOW_CULT_IDS.includes(id as (typeof SHADOW_CULT_IDS)[number]);
}

export function shadowCultMeritGrant(cultId: (typeof SHADOW_CULT_IDS)[number]): MeritSelection {
  const cult = SHADOW_CULTS[cultId];
  return { definitionId: "core-2ed:mystery-cult-initiation", instanceId: `shadow-cult-${cultId}`, name: "Mystery Cult Initiation", dots: 1, sourceId: cult.sourceId, source: cult.source, configuration: { ...cult.configuration, cult: cult.name, shadowCultId: cultId }, grantedBy: SHADOW_CULT_SOURCE };
}

/** Schema-2 grants used a deterministic instance or exact canonical cult name; remove when unsupported. */
export function shadowCultGrantId(merit: MeritSelection) {
  const configuration = normalizeMeritConfiguration(merit.configuration);
  if (Object.hasOwn(configuration, "shadowCultId")) return String(configuration.shadowCultId);
  return SHADOW_CULT_IDS.find(id => merit.grantedBy === SHADOW_CULT_SOURCE && merit.instanceId === `shadow-cult-${id}`) ??
    SHADOW_CULT_IDS.find(id => configuration.cult === SHADOW_CULTS[id].name);
}

/**
 * Builder and pure synchronization consume this schema-2 production bridge for old template grants.
 * Only exact canonical names with the owning producer marker and source qualify; explicit IDs win.
 * Delete the name branch once ID-less Vampire automatic grants are no longer supported.
 */
function templateMeritId(merit: MeritSelection) {
  if (merit.definitionId) return merit.definitionId;
  if (merit.grantedBy === TEMPLATE_SOURCE && merit.name === "Kindred Status" && (!merit.sourceId || merit.sourceId === "vtr-2ed")) return "vtr-kindred-status";
  if (merit.grantedBy === SHADOW_CULT_SOURCE && merit.name === "Mystery Cult Initiation" && (!merit.sourceId || merit.sourceId === "core-2ed" || Object.values(SHADOW_CULTS).some(cult => cult.sourceId === merit.sourceId))) return "core-2ed:mystery-cult-initiation";
  return undefined;
}

export function reconcileVampireTemplateMerits(current: readonly MeritSelection[], grant?: MeritSelection) {
  const automatic = current.filter(merit => (merit.grantedBy === TEMPLATE_SOURCE && templateMeritId(merit) === "vtr-kindred-status") || (merit.grantedBy === SHADOW_CULT_SOURCE && templateMeritId(merit) === "core-2ed:mystery-cult-initiation"));
  const matches = automatic.filter(merit => templateMeritId(merit) === grant?.definitionId &&
    (grant?.grantedBy !== SHADOW_CULT_SOURCE || shadowCultGrantId(merit) !== undefined && shadowCultGrantId(merit) === shadowCultGrantId(grant)));
  // Ambiguous producers must not merge paid instances or copy their configuration.
  const previous = matches.length === 1 ? matches[0] : undefined;
  const retained = current.flatMap(merit => {
    if (!automatic.includes(merit)) return [merit];
    if (merit === previous) return [];
    const experienceDots = Math.max(0, Number(merit.experienceDots ?? 0));
    const creationDots = Math.max(0, Number(merit.creationDots ?? (merit.dots - experienceDots)) - 1);
    const retained = { ...merit, definitionId: templateMeritId(merit), dots: creationDots + experienceDots, creationDots, experienceDots };
    delete retained.grantedBy;
    return retained.dots ? [retained] : [];
  });
  if (!grant) return retained;
  const experienceDots = Math.max(0, Number(previous?.experienceDots ?? 0));
  const creationDots = Math.max(1, Number(previous?.creationDots ?? (Number(previous?.dots ?? 1) - experienceDots)));
  const instanceId = previous?.instanceId ?? (current.some(merit => merit.instanceId === grant.instanceId) ? createRandomId() : grant.instanceId);
  const configuration = grant.grantedBy === SHADOW_CULT_SOURCE
    ? { ...grant.configuration, ...normalizeMeritConfiguration(previous?.configuration), shadowCultId: String(grant.configuration?.shadowCultId ?? shadowCultGrantId(grant) ?? "") }
    : { ...normalizeMeritConfiguration(previous?.configuration), ...grant.configuration };
  return [...retained, { ...previous, ...grant, instanceId, dots: creationDots + experienceDots, creationDots, experienceDots, configuration }];
}

/** Builder dots are creation allocations, not total ratings; never put XP back into that budget. */
export function reconcileVampireCreationMeritGrants(current: readonly MeritSelection[], grant?: MeritSelection) {
  const totals = current.map(merit => ({ ...merit, creationDots: merit.dots, dots: merit.dots + Number(merit.experienceDots ?? 0) }));
  return reconcileVampireTemplateMerits(totals, grant).map(merit => ({ ...merit, dots: Number(merit.creationDots ?? merit.dots) })).filter(merit => merit.dots > 0);
}

export function synchronizeVampireBuilderMeritGrants(sheet: CharacterSheet) {
  const primaryCovenant = String(sheet.line_data.covenant_id ?? "covenantless");
  const group = String(sheet.line_data.kindred_status_group ?? "").trim();
  let grant: MeritSelection | undefined;
  if (isShadowCultId(primaryCovenant)) {
    grant = shadowCultMeritGrant(primaryCovenant);
  } else if (group) {
    grant = { definitionId: "vtr-kindred-status", instanceId: "vampire-template-kindred-status", name: "Kindred Status", dots: 1, sourceId: "vtr-2ed", source: "Vampire: The Requiem Second Edition", configuration: { group }, grantedBy: TEMPLATE_SOURCE };
  }
  sheet.merits = reconcileVampireTemplateMerits(sheet.merits, grant);
  sheet.line_data.merit_granted_skill_bonuses = synchronizeCommonMeritGrants(sheet, (source) => source === SHADOW_CULT_SOURCE);
  return sheet;
}
