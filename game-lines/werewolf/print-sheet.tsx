"use client";

import Image from "next/image";
import { useLayoutEffect, type ReactNode } from "react";
import { isBlankPrintCharacter } from "@/app/workspace/blank-print-character";
import { PrintCompanionSheets } from "@/app/workspace/print-companion-sheets";
import { PrintBoxes, PrintDots, PrintExperience, PrintField, PrintLines, PrintRatedLines, PrintSingleMarkDots } from "@/app/workspace/print-sheet-primitives";
import { TraitBlock, stringList } from "@/app/workspace/sheet-primitives";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { effectiveMeritDots } from "@/lib/shared-merit-dots";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";
import type { MeritDefinition } from "@/lib/merits";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { WEAPONS, EQUIPMENT, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import type { WerewolfFetishCatalog } from "./catalogs/fetishes";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import type { WerewolfLodgeCatalog } from "./catalogs/lodges";
import { boundedHarmony, boundedPrimalUrge, primalUrgeLevel } from "./creation-rules";
import { fetishSelections, fetishPresentation } from "./fetish-rules";
import { renownRatings, werewolfFormTraits, werewolfIds, werewolfMemberTraits } from "./rules";
import { totemSelection } from "./totem-rules";
import "./styles/print.css";

function Page({ number, total, children }: { number: number; total: number; children: ReactNode }) {
  const { t } = useLanguage();
  return <section className="wtf-print-page"><header><strong>{t("werewolf.title")}</strong><span>{t("werewolf.forsaken")}</span></header>{children}<footer>{number} / {total}</footer></section>;
}
function Heading({ children }: { children: ReactNode }) { return <h2 className="wtf-print-heading">{children}</h2>; }
const chunks = <T,>(items: readonly T[], size: number) => Array.from({ length: Math.max(1, Math.ceil(items.length / size)) }, (_, index) => items.slice(index * size, (index + 1) * size));

export function WerewolfPrintSheet({ character, catalogs, options, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Werewolf print sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  useLayoutEffect(() => { onReadyChange?.(true); return () => onReadyChange?.(false); }, [onReadyChange]);
  const reference = catalogs.get<WerewolfReferenceCatalog>("werewolf-reference");
  const gifts = catalogs.get<WerewolfGiftCatalog>("werewolf-gifts");
  const rites = catalogs.get<WerewolfRiteCatalog>("werewolf-rites");
  const fetishes = catalogs.get<WerewolfFetishCatalog>("werewolf-fetishes");
  const totemCatalog = catalogs.get<WerewolfTotemCatalog>("werewolf-totem");
  const lodges = catalogs.get<WerewolfLodgeCatalog>("werewolf-lodges");
  const officialMerits = [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("werewolf-merits")];
  const customMerits = useMeritHomebrews().filter(item => item.line === "Core" || item.line === "WtF");
  const meritCatalog = mergeMeritHomebrews(officialMerits, customMerits);
  const data = character.line_data, state = character.current_state;
  const member = werewolfMemberTraits(character, { reference, gifts, totem: totemCatalog, merits: officialMerits });
  const hishu = werewolfFormTraits(character, "hishu", { reference, gifts, totem: totemCatalog, merits: officialMerits });
  const printDerived = derivedTraitsWithArmor({Size:hishu.size,Speed:hishu.speed,Defense:hishu.defense,Initiative:hishu.initiative},data.combat_armor,data.combat_shield,data.combat_helmet);
  const limits = primalUrgeLevel(reference, boundedPrimalUrge(data.primal_urge));
  const name = (id: unknown, list: readonly { id: string; name: string }[]) => {
    const item = list.find(item => item.id === id);
    return item ? locale === "pt-BR" ? reference.presentation[item.id]?.name ?? item.name : item.name : String(id ?? "");
  };
  const identity = [
    [t("ui.characterName"), character.character.name], [t("werewolf.blood"), name(data.blood, reference.anchors)], [t("werewolf.auspice"), name(data.auspice_id, reference.auspices)],
    [t("ui.player"), character.character.player], [t("werewolf.bone"), name(data.bone, reference.anchors)], [t("werewolf.tribe"), name(data.tribe_id, reference.tribes)],
    [t("ui.chronicle"), character.character.chronicle], [t("ui.concept"), character.character.concept], [t("werewolf.lodgeTab"), lodges.lodges.find(item => item.id === data.lodge_id)?.name ?? String(data.lodge_id ?? "")],
  ];
  const meritRows = member.merits.map(merit => {
    const definition = resolveMeritDefinition(merit, meritCatalog);
    return { name: locale === "pt-BR" ? definition?.translatedName ?? merit.name : definition?.name ?? merit.name, rating: effectiveMeritDots({ ...merit, definitionId: definition?.id }) };
  });
  const selectedConditions = Array.isArray(state.conditions) ? state.conditions.flatMap(item => item && typeof item === "object" && "id" in item ? [String(item.id)] : []) : [];
  const facets = [...new Set([...werewolfIds(data.creation_facets), ...werewolfIds(data.learned_facets)])];
  const knownRites = [...new Set([...werewolfIds(data.creation_rites), ...werewolfIds(data.learned_rites)])];
  const powerRows = [
    ...facets.map(id => { const parent = gifts.gifts.find(gift => gift.facets.some(facet => facet.id === id)); const facet = parent?.facets.find(facet => facet.id === id); return facet ? { kind: t("werewolf.gifts"), name: locale === "pt-BR" ? gifts.presentation[id]?.name ?? facet.name : facet.name, detail: parent?.name ?? "" } : { kind: t("werewolf.gifts"), name: id, detail: "" }; }),
    ...knownRites.map(id => { const rite = rites.rites.find(rite => rite.id === id); return { kind: t("werewolf.rites"), name: rite ? locale === "pt-BR" ? rites.presentation.rites[id]?.name ?? rite.name : rite.name : id, detail: rite ? "●".repeat(rite.dots) : "" }; }),
    ...fetishSelections(data.fetishes).map(item => { const definition = fetishes.items.find(entry => entry.id === item.catalogId); const presented = definition ? fetishPresentation(definition, fetishes, locale) : undefined; return { kind: t("werewolf.fetishesAndTalens"), name: item.custom?.name ?? presented?.name ?? String(item.catalogId ?? ""), detail: item.spirit }; }),
  ];
  const powerPages = [powerRows.slice(0, 16), ...chunks(powerRows.slice(16), 32).filter(page => page.length)];
  const total = 2 + powerPages.length;
  const renown = renownRatings(data.renown);
  const forms = reference.forms.map(form => ({ definition: form, traits: werewolfFormTraits(character, form.id, { reference, gifts, totem: totemCatalog, merits: officialMerits }) }));
  const totem = totemSelection(data.totem);
  const weapons = stringList(data.combat_weapons).map(id => WEAPONS.find(item => item.id === id)).filter(item => item != null).map(item => combatItemPresentation(item, locale));
  const equipment = stringList(data.combat_equipment).map(id => EQUIPMENT.find(item => item.id === id)).filter(item => item != null).map(item => combatItemPresentation(item, locale));
  const notes = String(state.notes ?? "").split(/\r?\n/).filter(Boolean);
  return <div className="game-print-document wtf-print-document">
    <Page number={1} total={total}>
      <div className="wtf-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</div>
      <Heading>{t("ui.attributes")}</Heading>
      <div className="wtf-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={hishu.attributes}/>)}</div>
      <div className="wtf-print-columns">
        <section><Heading>{t("ui.skills")}</Heading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={member.skills} specialties={member.specializations}/>)}</section>
        <section><Heading>{t("ui.merits")}</Heading><PrintRatedLines values={meritRows} minimum={10}/><Heading>{t("werewolf.renown")}</Heading><PrintRatedLines values={Object.entries(renown).map(([id, rating]) => ({ name: t(`werewolf.renownNames.${id as keyof typeof renown}`), rating }))}/><Heading>{t("ui.aspirations")}</Heading><PrintLines values={stringList(data.aspirations)} minimum={3}/></section>
        <section><Heading>{t("ui.health")}</Heading><PrintDots value={isBlankPrintCharacter(character) ? 0 : hishu.health} maximum={Math.max(10, hishu.health)}/><PrintBoxes maximum={Math.max(10, hishu.health)}/><Heading>{t("ui.willpower")}</Heading><PrintDots value={isBlankPrintCharacter(character) ? 0 : hishu.willpower} maximum={10}/><Heading>{t("werewolf.essence")}</Heading><PrintBoxes value={Number(state.essence_current ?? 0)} maximum={Math.max(10, limits.essenceMaximum)}/><Heading>{t("werewolf.primalUrge")}</Heading><PrintDots value={isBlankPrintCharacter(character) ? 0 : boundedPrimalUrge(data.primal_urge)} maximum={10}/><Heading>{t("werewolf.harmony")}</Heading><PrintSingleMarkDots value={isBlankPrintCharacter(character) ? -1 : boundedHarmony(data.harmony)} maximum={10}/><Heading>{t("werewolf.physicalTouchstone")}</Heading><PrintLines values={[String(data.physical_touchstone ?? "")]} minimum={1}/><Heading>{t("werewolf.spiritualTouchstone")}</Heading><PrintLines values={[String(data.spiritual_touchstone ?? "")]} minimum={1}/><Heading>{t("ui.conditions")}</Heading><PrintLines values={selectedConditions} minimum={4}/></section>
      </div>
      <Heading>{t("ui.derivedStats")}</Heading><div className="wtf-print-stats">{Object.entries(printDerived).map(([label, value]) => <PrintField key={label} label={label} value={isBlankPrintCharacter(character) ? "" : value}/>)}</div>
      <Heading>{t("ui.experience")}</Heading><PrintExperience beatLabels={[t("ui.beats")]} lineLabels={[t("ui.xpAvailable"), t("ui.totalXP"), t("ui.xpSpent")]}/>
    </Page>
    {powerPages.map((rows, index) => <Page key={index} number={index + 2} total={total}>
      {index === 0 && <><Heading>{t("werewolf.forms")}</Heading><div className="wtf-print-forms"><div><b>{t("ui.name")}</b><b>{t("ui.size")}</b><b>{t("ui.speed")}</b><b>{t("ui.defense")}</b><b>{t("ui.initiative")}</b><b>{t("ui.health")}</b></div>{forms.map(({ definition, traits }) => <div key={definition.id}><span>{name(definition.id, reference.forms)}</span><span>{traits.size}</span><span>{traits.speed}</span><span>{traits.defense}</span><span>{traits.initiative}</span><span>{traits.health}</span></div>)}</div><Heading>{t("werewolf.anchors")}</Heading><PrintLines values={[name(data.blood, reference.anchors), name(data.bone, reference.anchors)]} minimum={2}/></>}
      <Heading>{t("ui.powers")}</Heading><div className="wtf-print-powers">{rows.map((row, rowIndex) => <div key={rowIndex}><span>{row.kind}</span><strong>{row.name}</strong><span>{row.detail}</span></div>)}{!rows.length && <PrintLines values={[]} minimum={12}/>}</div>
      {index === 0 && totem && <><Heading>{t("werewolf.totem")}</Heading><PrintLines values={[totem.name, totem.concept, totem.aspiration, totem.ban, totem.bane]} minimum={5}/></>}
    </Page>)}
    <Page number={total} total={total}>
      <Heading>{t("ui.combat")}</Heading><div className="wtf-print-combat"><section><Heading>{t("combat.weapons")}</Heading><PrintLines values={weapons.map(item => item.name)} minimum={8}/></section><section><Heading>{t("ui.equipment")}</Heading><PrintLines values={equipment.map(item => item.name)} minimum={8}/></section></div>
      <Heading>{t("ui.notes")}</Heading><div className="wtf-print-notes"><PrintLines values={notes} minimum={20}/>{character.character.portrait && <Image src={character.character.portrait.dataUrl} alt={character.character.name} width={180} height={240} unoptimized loading="eager"/>}</div>
    </Page>
    {options.companionSheets && <PrintCompanionSheets character={character} renderPage={(content, index, count) => <Page number={total + index + 1} total={total + count}>{content}</Page>}/>}
  </div>;
}
