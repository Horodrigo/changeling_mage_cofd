"use client";

import { useLayoutEffect } from "react";
import { derivedWithPermanentMerits } from "@/app/workspace/experience-shared";
import { isBlankPrintCharacter } from "@/app/workspace/blank-print-character";
import { PrintBoxes, PrintDots, PrintExperience, PrintField, PrintIntegrityTrack, PrintLines, PrintRatedLines } from "@/app/workspace/print-sheet-primitives";
import { TraitBlock, stringList } from "@/app/workspace/sheet-primitives";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { EQUIPMENT, WEAPONS, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { VEHICLES, vehiclePresentation } from "@/lib/companions";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";
import type { MeritDefinition } from "@/lib/merits";
import { findTilt } from "@/lib/tilts";
import { boundedIntegrity } from "./creation-rules";

type CoreReference = {
  conditions: Array<{ id: string; name: string }>;
  presentation: Record<string, { name?: string }>;
};

function MortalPrintPage({ page, children }: { page: number; children: React.ReactNode }) {
  const { t } = useLanguage();
  return <section className={`cofd-print-page cofd-print-page-${page}`}>
    <div className="cofd-print-frame" aria-hidden="true"><i/><i/><i/><i/><span/><span/></div>
    <header><div><b>{t("ui.chroniclesTitle")}</b><em>{t("ui.ofTitle")}</em><strong>{t("ui.darknessTitle")}</strong></div><p>{t("ui.mortalTemplate")}</p></header>
    {children}
    <footer>{page} / 2</footer>
  </section>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="cofd-print-heading">{children}</h2>;
}

const objectList = (value: unknown) => Array.isArray(value) ? value as Array<Record<string, unknown>> : [];

export function MortalPrintSheet({ character, catalogs, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Mortal print sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  useLayoutEffect(() => { onReadyChange?.(true); return () => onReadyChange?.(false); }, [onReadyChange]);
  const data = character.line_data;
  const customMerits = useMeritHomebrews("CofD", true);
  const meritCatalog = mergeMeritHomebrews(catalogs.get<readonly MeritDefinition[]>("core-merits"), customMerits);
  const reference = catalogs.get<CoreReference>("core-reference");
  const conditions = reference.conditions.map((item) => locale === "pt-BR" ? { ...item, ...(reference.presentation[item.id] ?? {}) } : item);
  const meritRows = character.merits.map((merit) => {
    const definition = meritCatalog.find((item) => item.name === merit.name);
    const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name;
    const detail = meritConfigurationTitle(merit.configuration);
    return { name: detail ? `${name}: ${detail}` : name, rating: merit.dots };
  });
  const selectedConditions = objectList(character.current_state.conditions).map((item) => conditions.find((condition) => condition.id === String(item.id))?.name ?? String(item.id ?? "")).filter(Boolean);
  const derived = derivedWithPermanentMerits(character);
  const printDerived = isBlankPrintCharacter(character) ? undefined : derivedTraitsWithArmor(derived, data.combat_armor);
  const health = Math.max(1, Number(derived.Vitalidade ?? 6));
  const willpower = Math.max(1, Number(derived.ForçaDeVontade ?? 2));
  const currentWillpower = Math.max(0, Math.min(willpower, Number(character.current_state.willpower_current ?? willpower)));
  const integrity = boundedIntegrity(data.integrity);
  const identity = [
    [t("ui.characterName"), character.character.name], [t("ui.virtue"), data.virtue], [t("ui.chronicle"), character.character.chronicle],
    [t("ui.age"), data.age], [t("ui.vice"), data.vice], [t("ui.faction"), data.faction],
    [t("ui.player"), character.character.player], [t("ui.concept"), character.character.concept], [t("ui.groupName"), data.group_name],
  ];
  const weapons = stringList(data.combat_weapons).map((id) => WEAPONS.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  const equipment = stringList(data.combat_equipment).map((id) => EQUIPMENT.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  const vehicles = stringList(data.companion_vehicles).map((id) => VEHICLES.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => vehiclePresentation(item, locale));
  const tilts = stringList(data.combat_tilts).map(findTilt).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => locale === "en-US" ? item.name : item.translatedName);
  const notes = String(character.current_state.notes ?? "").split(/\r?\n/).filter(Boolean);

  return <div className="game-print-document cofd-print-document">
    <MortalPrintPage page={1}>
      <section className="cofd-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</section>
      <Heading>{t("ui.attributes")}</Heading>
      <div className="cofd-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
      <div className="cofd-print-main-grid">
        <section><Heading>{t("ui.skills")}</Heading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.skills} specialties={character.specializations}/>)}</section>
        <section><Heading>{t("ui.merits")}</Heading><PrintRatedLines values={meritRows.slice(0, 12)} minimum={12}/><Heading>{t("ui.aspirations")}</Heading><PrintLines values={stringList(data.aspirations)} minimum={3}/><Heading>{t("ui.conditions")}</Heading><PrintLines values={selectedConditions.slice(0, 5)} minimum={5}/></section>
        <section><Heading>{t("ui.health")}</Heading><div className="cofd-print-track"><PrintDots value={health} maximum={Math.max(10, health)}/><PrintBoxes maximum={Math.max(10, health)}/></div><Heading>{t("ui.willpower")}</Heading><div className="cofd-print-track"><PrintDots value={currentWillpower} maximum={Math.max(10, willpower)}/><PrintBoxes maximum={Math.max(10, willpower)}/></div><Heading>{t("ui.integrity")}</Heading><PrintIntegrityTrack value={integrity}/><Heading>{t("ui.derivedStats")}</Heading><dl className="cofd-print-derived"><div><dt>{t("ui.size")}</dt><dd>{printDerived?.Tamanho}</dd></div><div><dt>{t("ui.speed")}</dt><dd>{printDerived?.Deslocamento}</dd></div><div><dt>{t("ui.defense")}</dt><dd>{printDerived?.Defesa}</dd></div><div><dt>{t("ui.initiative")}</dt><dd>{printDerived?.Iniciativa}</dd></div><div><dt>{t("ui.armor")}</dt><dd>{printDerived?.Armadura}</dd></div></dl><Heading>{t("ui.experience")}</Heading><PrintExperience beatLabels={[t("ui.beats")]} lineLabels={[t("ui.xpAvailable"), t("ui.totalXP"), t("ui.xpSpent")]}/></section>
      </div>
    </MortalPrintPage>
    <MortalPrintPage page={2}>
      <div className="cofd-print-second-grid">
        <section><Heading>{t("ui.breakingPoints")}</Heading><PrintLines values={stringList(data.breaking_points)} minimum={5}/><Heading>{t("ui.conditions")}</Heading><PrintLines values={selectedConditions.slice(5)} minimum={5}/><Heading>{t("combat.tilts")}</Heading><PrintLines values={tilts} minimum={5}/><Heading>{t("combat.vehicles")}</Heading><PrintLines values={vehicles.map((item) => item.name)} minimum={5}/></section>
        <section><Heading>{t("combat.weapons")}</Heading><div className="cofd-print-combat"><header><span>{t("ui.name")}</span><span>{t("ui.damage")}</span><span>{t("ui.range")}</span><span>{t("ui.initiative")}</span><span>{t("ui.strength")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 7 }, (_, index) => { const item = weapons[index]; return <div key={item?.id ?? index}><span>{item?.name}</span><span>{item?.damage}</span><span>{item?.ranges}</span><span>{item?.initiative}</span><span>{item?.strength}</span><span>{item?.size}</span></div>; })}</div><Heading>{t("ui.equipment")}</Heading><div className="cofd-print-equipment"><header><span>{t("ui.name")}</span><span>{t("ui.bonus")}</span><span>{t("ui.durability")}</span><span>{t("ui.structure")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 8 }, (_, index) => { const item = equipment[index]; return <div key={item?.id ?? index}><span>{item?.name}</span><span>{item?.bonus}</span><span>{item?.durability}</span><span>{item?.structure}</span><span>{item?.size}</span></div>; })}</div></section>
      </div>
      <Heading>{t("ui.notes")}</Heading><PrintLines values={notes} minimum={12}/>
    </MortalPrintPage>
  </div>;
}
