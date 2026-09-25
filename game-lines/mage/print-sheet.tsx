"use client";

import { useLayoutEffect } from "react";
import { PrintBoxes, PrintDots, PrintExperience, PrintField, PrintLines, PrintRatedLines, PrintSingleMarkDots } from "@/app/workspace/print-sheet-primitives";
import { isBlankPrintCharacter } from "@/app/workspace/blank-print-character";
import { TraitBlock, stringList } from "@/app/workspace/sheet-primitives";
import type { SpellDefinition } from "@/lib/catalog/catalog-types";
import { EQUIPMENT, WEAPONS, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { findLegacy, normalizeLegacyState } from "@/game-lines/mage/legacies";
import { findMageAffiliation } from "@/game-lines/mage/orders";
import type { MeritDefinition } from "@/lib/merits";
import { systemTerm } from "@/lib/system-terms";
import { MTA_ORDER_LABELS } from "./creation-rules";
import { derivedWithPermanentMerits } from "@/app/workspace/experience-shared";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";

const objectList = (value: unknown) => Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
const spellName = (item: Record<string, unknown>, locale: string) => String(locale === "en-US" ? item.originalName ?? item.name : item.name ?? item.originalName ?? "");

function MagePrintPage({ page, children }: { page: number; children: React.ReactNode }) {
  const { t } = useLanguage();
  return <section className={`mta-print-page mta-print-page-${page}`}>
    <div className="mta-print-frame" aria-hidden="true"><i/><i/><i/><i/><span/><span/></div>
    <header><div><span>{t("ui.mage")}</span><strong>{t("ui.theAWAKENING")}</strong></div><p>{t("ui.chroniclesOFDARKNESS")}</p></header>
    {children}
    <footer>{page} / 2</footer>
  </section>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mta-print-heading">{children}</h2>;
}

function Track({ label, maximum, value = maximum }: { label: string; maximum: number; value?: number }) {
  return <section className="mta-print-track"><strong>{label}</strong><PrintDots value={value} maximum={Math.max(10, maximum)}/><PrintBoxes maximum={Math.max(10, maximum)}/></section>;
}

export function MagePrintSheet({ character, catalogs, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Mage print sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  useLayoutEffect(() => { onReadyChange?.(true); return () => onReadyChange?.(false); }, [onReadyChange]);
  const data = character.line_data;
  const spellCatalog = catalogs.get<readonly SpellDefinition[]>("mage-spells");
  const customMerits = useMeritHomebrews("MtA", true);
  const meritCatalog = mergeMeritHomebrews([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("mage-merits")], customMerits);
  const conditionCatalog = [
    ...catalogs.get<{ conditions: Array<{ id: string; name: string }> }>("core-reference").conditions,
    ...catalogs.get<Array<{ id: string; name: string }>>("mage-reference"),
  ];
  const arcana = data.arcana && typeof data.arcana === "object" ? data.arcana as Record<string, number> : {};
  const derived = derivedWithPermanentMerits(character);
  const printDerived = isBlankPrintCharacter(character) ? undefined : derivedTraitsWithArmor(derived, data.combat_armor);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const willpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const currentWillpower = Math.max(0, Math.min(willpower, Number(character.current_state.willpower_current ?? willpower)));
  const conditions = objectList(character.current_state.conditions).map((item) => conditionCatalog.find((condition) => condition.id === String(item.id))?.name ?? String(item.id ?? "")).filter(Boolean);
  const rotes = [...objectList(data.rotes), ...objectList(data.learned_rotes)];
  const praxes = [...objectList(data.praxes), ...objectList(data.learned_praxes)];
  const activeSpells = stringList(character.current_state.active_spells);
  const legacyState = normalizeLegacyState(data.legacy_state);
  const legacy = legacyState.joined ? findLegacy(legacyState.definitionId) : undefined;
  const affiliation=findMageAffiliation(data.affiliation_id);
  const orderBase = !data.order ? "" : data.order === "Orderless" ? t("ui.orderless") : data.order === "Nameless" ? "Nameless" : locale === "en-US" ? String(data.order) : MTA_ORDER_LABELS[String(data.order)] ?? String(data.order);
  const order=affiliation?`${orderBase} · ${affiliation.name}`:orderBase;
  const identity = [
    [t("ui.shadowName"), data.shadow_name], [t("ui.concept"), character.character.concept], [t("ui.path"), data.path],
    [t("ui.player"), character.character.player], [t("ui.virtue"), data.virtue], [t("ui.order"), order],
    [t("ui.chronicle"), character.character.chronicle], [t("ui.vice"), data.vice], ["Legacy", legacy?.name ?? ""],
  ];
  const meritRows = character.merits.filter((merit) => !merit.grantedBy || ["Ordem", "Nameless Order"].includes(String(merit.grantedBy))).slice(0, 9).map((merit) => {
    const definition = meritCatalog.find((item) => item.name === merit.name);
    return { name: locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name, rating: merit.dots };
  });
  const arcanaRows = Object.entries(arcana).map(([name, rating]) => ({ name: systemTerm(name, locale), rating: Number(rating) }));
  const attainments = [
    ...(Object.values(arcana).some((value) => Number(value) >= 1) ? [t("ui.counterspell")] : []),
    ...(Object.values(arcana).some((value) => Number(value) >= 2) ? [t("ui.mageArmor")] : []),
    ...(Object.values(arcana).some((value) => Number(value) >= 3) ? [t("ui.targetedSummoning")] : []),
    ...(Object.values(arcana).some((value) => Number(value) >= 5) ? [t("ui.createRote")] : []),
    ...(legacy?.attainments.filter((item) => legacyState.attainmentRanks.includes(item.rank)).map((item) => item.name) ?? []),
  ];
  const enchantedItems = character.merits.filter((merit) => ["Artifact", "Enhanced Item", "Imbued Item", "Daimonomikon", "Grimoire"].includes(merit.name)).map((merit) => {
    const configuration = normalizeMeritConfiguration(merit.configuration);
    return `${String(configuration.name ?? merit.name)} (${"•".repeat(merit.dots)})`;
  });
  const familiar = character.merits.find((merit) => merit.name === "Familiar" && !merit.grantedBy);
  const familiarConfig = normalizeMeritConfiguration(familiar?.configuration);
  const familiarRows = familiar ? [
    `${t("ui.name")}: ${String(familiarConfig.name ?? "Familiar")}`,
    `${t("ui.power")}: ${String(familiarConfig.power ?? "")}; ${t("ui.finesse")}: ${String(familiarConfig.finesse ?? "")}; ${t("ui.resistance")}: ${String(familiarConfig.resistance ?? "")}`,
    `${t("ui.influence")}: ${String(familiarConfig.influence ?? "")}`,
    `${t("ui.ban")}: ${String(familiarConfig.ban ?? "")}`,
    `${t("ui.baneda2072")}: ${String(familiarConfig.bane ?? "")}`,
    `${t("ui.numina")}: ${stringList(familiarConfig.numina).join(", ")}`,
  ] : [];
  const weapons = stringList(data.combat_weapons).map((id) => WEAPONS.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  const equipment = stringList(data.combat_equipment).map((id) => EQUIPMENT.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  return <div className="game-print-document mta-print-document">
    <MagePrintPage page={1}>
      <section className="mta-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</section>
      <Heading>{t("ui.attributes")}</Heading>
      <div className="mta-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
      <div className="mta-print-main-grid">
        <section><Heading>{t("ui.skills")}</Heading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.skills} specialties={character.specializations}/>)}<Heading>{t("ui.conditions")}</Heading><PrintLines values={conditions} minimum={4}/></section>
        <section><Heading>{t("ui.arcana")}</Heading><PrintRatedLines values={arcanaRows} minimum={10}/><Heading>{t("ui.merits")}</Heading><PrintRatedLines values={meritRows} minimum={9}/><Heading>{t("ui.aspirations")}</Heading><PrintLines values={stringList(data.aspirations)} minimum={3}/><Heading>{t("ui.obsessions")}</Heading><PrintLines values={stringList(data.obsessions)} minimum={2}/></section>
        <section><Heading>{t("ui.health")}</Heading><Track label={t("ui.health")} maximum={health}/><Heading>{t("ui.willpower")}</Heading><Track label={t("ui.willpower")} maximum={willpower} value={currentWillpower}/><Heading>{t("ui.lineTraits")}</Heading><div className="mta-print-power"><section><strong>{t("ui.gnosis")}</strong><PrintDots value={1} maximum={10}/></section><section><strong>{t("ui.mana")}</strong><PrintBoxes maximum={20}/></section></div><Heading>{t("ui.wisdom")}</Heading><PrintSingleMarkDots value={1}/><Heading>{t("ui.derivedStats")}</Heading><dl className="mta-print-derived"><div><dt>{t("ui.size")}</dt><dd>{printDerived?.Tamanho}</dd></div><div><dt>{t("ui.speed")}</dt><dd>{printDerived?.Deslocamento}</dd></div><div><dt>{t("ui.defense")}</dt><dd>{printDerived?.Defesa}</dd></div><div><dt>{t("ui.initiative")}</dt><dd>{printDerived?.Iniciativa}</dd></div><div><dt>{t("ui.armor")}</dt><dd>{printDerived?.Armadura}</dd></div></dl><Heading>{t("ui.experience")}</Heading><PrintExperience beatLabels={[t("ui.beats"), t("ui.arcaneBeats")]} lineLabels={[t("ui.xpAvailable"), t("ui.totalXP"), t("ui.xpSpent"), t("ui.arcaneXPAvailable"), t("ui.arcaneXPTotal"), t("ui.arcaneXPSpent")]}/></section>
      </div>
    </MagePrintPage>
    <MagePrintPage page={2}>
      <div className="mta-print-second-grid">
        <section><Heading>{t("ui.activeSpells")}</Heading><PrintLines values={activeSpells} minimum={12}/><Heading>{t("ui.attainments")}</Heading><PrintLines values={attainments} minimum={8}/><Heading>{t("ui.dedicatedTool")}</Heading><PrintLines values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3}/><Heading>{t("ui.praxes")}</Heading><PrintLines values={praxes.map((item) => spellName(item, locale))} minimum={8}/></section>
        <section><Heading>{t("ui.rotes")}</Heading><div className="mta-print-rotes">{rotes.slice(0, 10).map((item, index) => { const saved = (spellCatalog.find((spell) => spell.id === item.id) ?? item) as unknown as Record<string, unknown>; return <div key={String(item.id ?? index)}><span>{spellName(saved, locale)}</span><span>{Object.entries((saved.requirements ?? {}) as Record<string, number>).map(([name, dots]) => `${systemTerm(name, locale)} ${dots}`).join(" + ")}</span><span>{systemTerm(String(saved.roteSkill ?? ""), locale)}</span></div>; })}</div><Heading>{t("ui.nimbusTilt")}</Heading><PrintLines values={stringList(data.nimbus_tilt)} minimum={3}/><Heading>{t("ui.enchantedItems")}</Heading><PrintLines values={enchantedItems} minimum={5}/><Heading>{t("ui.combat")}</Heading><div className="mta-print-combat"><header><i/><span>{t("combat.weapons")}</span><span>{t("ui.damage")}</span><span>{t("ui.range")}</span><span>{t("ui.initiative")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 5 }, (_, index) => { const weapon = weapons[index]; return <div key={weapon?.id ?? index}><i/><span>{weapon?.name}</span><span>{weapon?.damage}</span><span>{weapon?.ranges}</span><span>{weapon?.initiative}</span><span>{weapon?.size}</span></div>; })}</div><Heading>{t("ui.equipment")}</Heading><div className="mta-print-equipment"><header><i/><span>{t("ui.name")}</span><span>{t("ui.durability")}</span><span>{t("ui.structure")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 5 }, (_, index) => { const item = equipment[index]; return <div key={item?.id ?? index}><i/><span>{item?.name}</span><span>{item?.durability}</span><span>{item?.structure}</span><span>{item?.size}</span></div>; })}</div><Heading>{t("ui.familiars")}</Heading><PrintLines values={familiarRows} minimum={7}/></section>
      </div>
    </MagePrintPage>
  </div>;
}
