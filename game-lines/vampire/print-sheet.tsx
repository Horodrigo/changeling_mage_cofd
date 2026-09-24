"use client";

import { useLayoutEffect } from "react";
import { PrintBoxes, PrintDots, PrintExperience, PrintField, PrintIntegrityTrack, PrintLines, PrintRatedLines } from "@/app/workspace/print-sheet-primitives";
import { isBlankPrintCharacter } from "@/app/workspace/blank-print-character";
import { TraitBlock, stringList } from "@/app/workspace/sheet-primitives";
import { EQUIPMENT, WEAPONS, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import type { VampireCondition, VampirePowers, VampireReference } from "./catalog-types";
import { objectArray, recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantIds, vampireDerived, vampireDisciplineDisplayName } from "./creation-rules";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";

function VampirePrintPage({ page, children }: { page: number; children: React.ReactNode }) {
  const { t } = useLanguage();
  return <section className={`vtr-print-page vtr-print-page-${page}`}>
    <div className="vtr-decorative-frame vtr-print-frame" aria-hidden="true"><span className="vtr-frame-edge vtr-frame-edge-top"/><span className="vtr-frame-edge vtr-frame-edge-bottom"/><span className="vtr-frame-edge vtr-frame-edge-left"/><span className="vtr-frame-edge vtr-frame-edge-right"/><span className="vtr-frame-center vtr-frame-center-top"/><span className="vtr-frame-center vtr-frame-center-bottom"/><span className="vtr-frame-side vtr-frame-side-top-left"/><span className="vtr-frame-side vtr-frame-side-top-right"/><span className="vtr-frame-side vtr-frame-side-bottom-left"/><span className="vtr-frame-side vtr-frame-side-bottom-right"/><span className="vtr-frame-corner vtr-frame-corner-top-left"/><span className="vtr-frame-corner vtr-frame-corner-top-right"/><span className="vtr-frame-corner vtr-frame-corner-bottom-left"/><span className="vtr-frame-corner vtr-frame-corner-bottom-right"/></div>
    <header><div><span>{t("ui.vampireTitle")}</span><strong>{t("ui.vampireSubtitle")}</strong></div><p>{t("ui.chroniclesOFDARKNESS")}</p></header>
    {children}
    <footer>{page} / 2</footer>
  </section>;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="vtr-print-heading">{children}</h2>;
}

function localized(item: { name: string; translatedName: string } | undefined, locale: string) {
  return item ? locale === "pt-BR" ? item.translatedName : item.name : "";
}

export function VampirePrintSheet({ character, catalogs, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Vampire print sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  useLayoutEffect(() => { onReadyChange?.(true); return () => onReadyChange?.(false); }, [onReadyChange]);
  const data = character.line_data;
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const customMerits = useMeritHomebrews("VtR", true);
  const meritCatalog = mergeMeritHomebrews([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")], customMerits);
  const conditions = [
    ...catalogs.get<{ conditions: Array<{ id: string; name: string }> }>("core-reference").conditions,
    ...catalogs.get<readonly VampireCondition[]>("vampire-conditions"),
  ];
  const clan = reference.clans.find((item) => item.id === data.clan_id);
  const bloodline = reference.bloodlines.find((item) => item.id === data.bloodline_id);
  const covenants = reference.covenants.filter((item) => vampireCovenantIds(data).includes(item.id));
  const mask = reference.anchors.find((item) => item.id === data.mask_id);
  const dirge = reference.anchors.find((item) => item.id === data.dirge_id);
  const disciplines = recordRatings(data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const bloodSorcery = data.blood_sorcery && typeof data.blood_sorcery === "object" ? data.blood_sorcery as Record<string, unknown> : {};
  const ordo = data.ordo_dracul && typeof data.ordo_dracul === "object" ? data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" ? ordo.coil_ratings as Record<string, number> : {};
  const disciplineRows = [
    ...Object.entries(disciplines).filter(([, rating]) => Number(rating) > 0).map(([name, rating]) => ({ name: vampireDisciplineDisplayName(name, powers.disciplines, locale), rating: Number(rating) })),
    ...(powers.ritualDisciplines ?? []).flatMap((item) => { const key = item.id === "gilded-cage" ? "gilded_cage_rating" : `${item.id}_rating`; const rating = Number(bloodSorcery[key] ?? 0); return rating > 0 ? [{ name: localized(item, locale), rating }] : []; }),
    ...powers.coils.flatMap((item) => { const rating = Number(coilRatings[item.id] ?? 0); return rating > 0 ? [{ name: localized(item, locale), rating }] : []; }),
  ];
  const meritRows = character.merits.filter((merit) => !merit.grantedBy || ["Clã", "Vampire Template", "Vampire Shadow Cult"].includes(merit.grantedBy)).map((merit) => {
    const definition = meritCatalog.find((item) => item.name === merit.name);
    const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name;
    const detail = meritConfigurationTitle(merit.configuration);
    return { name: detail ? `${name}: ${detail}` : name, rating: merit.dots };
  });
  const mainDisciplines = disciplineRows.slice(0, 8);
  const mainMerits = meritRows.slice(0, 8);
  const overflowTraits = [...disciplineRows.slice(8), ...meritRows.slice(8)];
  const rites = [...powers.cruacRites.filter((item) => new Set(stringList(bloodSorcery.cruac_rite_ids)).has(item.id)), ...powers.gildedInvocations.filter((item) => new Set(stringList(bloodSorcery.gilded_invocation_ids)).has(item.id))];
  const miracles = powers.thebanMiracles.filter((item) => new Set(stringList(bloodSorcery.theban_miracle_ids)).has(item.id));
  const devotionIds = new Set(stringList(data.devotion_ids));
  const detournementIds = new Set(stringList(data.detournement_ids));
  const devotions = [...powers.devotions.filter((item) => devotionIds.has(item.id)), ...powers.detournements.filter((item) => detournementIds.has(item.id))].map((item) => localized(item, locale));
  const bloodBonds = objectArray(character.current_state.blood_bonds).map((item) => [String(item.subject ?? "").trim(), Number(item.stage) > 0 ? `${t("ui.stage")} ${Number(item.stage)}` : "", String(item.notes ?? "").trim()].filter(Boolean).join(" · "));
  const bloodPotency = Math.max(1, Math.min(10, Number(data.blood_potency ?? 1)));
  const derived = vampireDerived(character.attributes, character.skills, disciplines, bloodPotency, reference);
  const printDerived = isBlankPrintCharacter(character) ? undefined : derivedTraitsWithArmor(derived, data.combat_armor);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const willpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const currentWillpower = Math.max(0, Math.min(willpower, Number(character.current_state.willpower_current ?? willpower)));
  const selectedConditions = objectArray(character.current_state.conditions).map((item) => conditions.find((condition) => condition.id === String(item.id))?.name ?? String(item.id ?? "")).filter(Boolean);
  const touchstonesByRating = new Map(objectArray(data.touchstones).flatMap((item) => {
    const rating = Number(item.humanity_slot);
    const name = String(item.name ?? "").trim();
    return rating >= 1 && rating <= 10 && name ? [[rating, name] as const] : [];
  }));
  const banes = objectArray(data.banes).map((item) => String(item.name ?? "")).filter(Boolean);
  const identity = [
    [t("ui.name"), character.character.name], [t("sheet.mask"), localized(mask, locale)], [t("sheet.clan"), localized(clan, locale)],
    [t("ui.player"), character.character.player], [t("sheet.dirge"), localized(dirge, locale)], [t("sheet.bloodline"), localized(bloodline, locale)],
    [t("ui.chronicle"), character.character.chronicle], [t("ui.concept"), character.character.concept], [t("sheet.covenant"), covenants.map((item) => localized(item, locale)).join(" · ")],
  ];
  const weapons = stringList(data.combat_weapons).map((id) => WEAPONS.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  const equipment = stringList(data.combat_equipment).map((id) => EQUIPMENT.find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => combatItemPresentation(item, locale));
  return <div className="game-print-document vtr-print-document">
    <VampirePrintPage page={1}>
      <section className="vtr-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</section>
      <Heading>{t("ui.attributes")}</Heading>
      <div className="vtr-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
      <div className="vtr-print-main-grid">
        <section><Heading>{t("ui.skills")}</Heading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.skills} specialties={character.specializations}/>)}</section>
        <section><Heading>{t("ui.otherTraits")}</Heading><h3>{t("ui.disciplines")}</h3><PrintRatedLines values={mainDisciplines} minimum={8}/><h3>{t("ui.merits")}</h3><PrintRatedLines values={mainMerits} minimum={8}/><Heading>{t("ui.aspirations")}</Heading><PrintLines values={stringList(data.aspirations)} minimum={3}/><Heading>{t("ui.banes")}</Heading><PrintLines values={banes} minimum={3}/></section>
        <section><Heading>{t("ui.health")}</Heading><PrintDots value={health} maximum={Math.max(10, health)}/><PrintBoxes maximum={Math.max(10, health)}/><Heading>{t("ui.willpower")}</Heading><PrintDots value={currentWillpower} maximum={Math.max(10, willpower)}/><PrintBoxes maximum={Math.max(10, willpower)}/><Heading>{t("ui.lineTraits")}</Heading><div className="vtr-print-power"><section><strong>{t("ui.bloodPotency")}</strong><PrintDots value={1} maximum={10}/></section><section><strong>{t("ui.vitae")}</strong><PrintBoxes maximum={20}/></section></div><Heading>{t("ui.humanity")}</Heading><PrintIntegrityTrack value={1} notes={touchstonesByRating}/><Heading>{t("ui.derivedStats")}</Heading><dl className="vtr-print-derived"><div><dt>{t("ui.size")}</dt><dd>{printDerived?.Tamanho}</dd></div><div><dt>{t("ui.speed")}</dt><dd>{printDerived?.Deslocamento}</dd></div><div><dt>{t("ui.defense")}</dt><dd>{printDerived?.Defesa}</dd></div><div><dt>{t("ui.initiative")}</dt><dd>{printDerived?.Iniciativa}</dd></div><div><dt>{t("ui.armor")}</dt><dd>{printDerived?.Armadura}</dd></div></dl><Heading>{t("ui.experience")}</Heading><PrintExperience beatLabels={[t("ui.beats")]} lineLabels={[t("ui.xpAvailable"), t("ui.totalXP"), t("ui.xpSpent")]}/></section>
      </div>
    </VampirePrintPage>
    <VampirePrintPage page={2}>
      <div className="vtr-print-second-grid">
        <section><Heading>{t("ui.otherTraits")}</Heading><PrintRatedLines values={overflowTraits} minimum={13}/><Heading>{t("ui.rites")}</Heading><PrintLines values={rites.map((item) => `${localized(item, locale)} ${item.rating ?? ""}`)} minimum={5}/><Heading>{t("ui.miracles")}</Heading><PrintLines values={miracles.map((item) => `${localized(item, locale)} ${item.rating ?? ""}`)} minimum={5}/><Heading>{t("ui.conditions")}</Heading><PrintLines values={selectedConditions} minimum={7}/></section>
        <section><Heading>{t("ui.devotions")}</Heading><PrintLines values={devotions.slice(0, 10)} minimum={10}/><Heading>{t("ui.bloodBonds")}</Heading><PrintLines values={bloodBonds.slice(0, 5)} minimum={5}/><Heading>{t("ui.combat")}</Heading><div className="vtr-print-combat"><header><span>{t("combat.weapons")}</span><span>{t("ui.damage")}</span><span>{t("ui.range")}</span><span>{t("ui.initiative")}</span><span>{t("ui.strength")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 5 }, (_, index) => { const weapon = weapons[index]; return <div key={weapon?.id ?? index}><i/><span>{weapon?.name}</span><span>{weapon?.damage}</span><span>{weapon?.ranges}</span><span>{weapon?.initiative}</span><span>{weapon?.strength}</span><span>{weapon?.size}</span></div>; })}</div><Heading>{t("ui.equipment")}</Heading><div className="vtr-print-equipment"><header><span>{t("ui.name")}</span><span>{t("ui.durability")}</span><span>{t("ui.structure")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 10 }, (_, index) => { const item = equipment[index]; return <div key={item?.id ?? index}><i/><span>{item?.name}</span><span>{item?.durability}</span><span>{item?.structure}</span><span>{item?.size}</span></div>; })}</div></section>
      </div>
    </VampirePrintPage>
  </div>;
}
