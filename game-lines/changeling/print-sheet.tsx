"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { pairPrintColumns, paginatePrintItems, type PrintFlowColumn, type PrintFlowItem } from "@/app/workspace/print-pagination";
import { PrintIntegrityTrack } from "@/app/workspace/print-sheet-primitives";
import { isBlankPrintCharacter } from "@/app/workspace/blank-print-character";
import { CompactValues, DotValue, SheetHeading, TraitBlock, signed, stringList } from "@/app/workspace/sheet-primitives";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { kithCreationChoice } from "./kith-choices";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import { ANIMALS, VEHICLES, animalPresentation, vehiclePresentation } from "@/lib/companions";
import { ARMORS, EQUIPMENT, WEAPONS, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeEntitlementState, type EntitlementDefinition } from "@/lib/entitlements";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { translate, useLanguage, type Locale, type Translator } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeClarityDamage, type ClarityDamageLevel } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { changelingAnchorDisplayName, normalizeChangelingFrailties, seemingDisplayName, CTL_SEEMINGS } from "./creation-rules";
import { derivedWithPermanentMerits } from "./experience-shared";
import { expandedConfigurationLines, meritConfigurationTitle } from "./sheet-merit-configurations";

type ChangelingReference = {
  conditions: ConditionDefinition[];
  presentation: Record<string, Partial<ConditionDefinition>>;
  courts: CourtDefinition[];
  entitlements: EntitlementDefinition[];
  kiths: Array<{ id: string; name: string; translatedName?: string; skill: string; description: string; blessing: string; source: string; page: number }>;
  kithPresentation: Record<string, { name: string; description: string; blessing: string; skill: string }>;
};

type PrintBlock = PrintFlowItem & { node: ReactNode };

const objectList = (value: unknown) => Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
const cleanList = (value: unknown) => Array.isArray(value) ? value.flatMap((item) => typeof item === "string" && item.trim() ? [item.trim()] : []) : [];
const normalized = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");

function findCourt(catalog: readonly CourtDefinition[], value: unknown) {
  const wanted = normalized(value);
  return catalog.find((item) => [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")].some((candidate) => normalized(candidate) === wanted));
}

function courtName(catalog: readonly CourtDefinition[], value: unknown, locale: Locale) {
  const raw = String(value ?? "");
  if (["sem corte", "courtless"].includes(raw.trim().toLocaleLowerCase())) return translate(locale, "ui.courtless");
  const court = findCourt(catalog, value);
  return court ? (locale === "en-US" ? court.name : court.translatedName) : raw;
}

function findKith(reference: ChangelingReference, value: unknown) {
  const wanted = normalized(value);
  return reference.kiths.find((item) => [item.id, item.name, item.translatedName].some((candidate) => candidate && normalized(candidate) === wanted));
}

function canonicalSkill(value: unknown) {
  const raw = String(value ?? "").trim();
  return Object.values(SKILLS).flat().find((skill) => skill === raw || systemTerm(skill, "en-US") === raw || systemTerm(skill, "pt-BR") === raw);
}

function kithPresentation(reference: ChangelingReference, value: unknown, locale: Locale, custom: boolean) {
  const definition = findKith(reference, value);
  if (custom || !definition) return { name: String(value ?? ""), description: "", blessing: "", skill: "", source: "", page: 0 };
  const localized = locale === "pt-BR" ? reference.kithPresentation[definition.id] : undefined;
  return { ...definition, ...(localized ?? {}), name: localized?.name ?? definition.name };
}

function PrintPage({ page, total, title, children, main = false }: { page: number; total: number; title: string; children: ReactNode; main?: boolean }) {
  const { t } = useLanguage();
  return <section className={`ctl-print-page${main ? " ctl-print-main-page" : ""}`}>
    <div className="ctl-botanical-frame ctl-print-frame" aria-hidden="true">
      <span className="ctl-frame-edge ctl-frame-edge-top"/><span className="ctl-frame-edge ctl-frame-edge-bottom"/>
      <span className="ctl-frame-edge ctl-frame-edge-left"/><span className="ctl-frame-edge ctl-frame-edge-right"/>
      <span className="ctl-frame-star ctl-frame-star-top"/><span className="ctl-frame-star ctl-frame-star-bottom"/>
      <span className="ctl-frame-star-side ctl-frame-star-side-top-left"/><span className="ctl-frame-star-side ctl-frame-star-side-top-right"/>
      <span className="ctl-frame-star-side ctl-frame-star-side-bottom-left"/><span className="ctl-frame-star-side ctl-frame-star-side-bottom-right"/>
      <span className="ctl-frame-corner ctl-frame-corner-top-left"/><span className="ctl-frame-corner ctl-frame-corner-top-right"/>
      <span className="ctl-frame-corner ctl-frame-corner-bottom-left"/><span className="ctl-frame-corner ctl-frame-corner-bottom-right"/>
    </div>
    <header className="ctl-print-brand">
      <div><span className="ctl-print-title-mark">{t("ui.changelingTitle")}</span><strong>{t("ui.theLOST")}</strong></div>
      <p>{t("ui.chroniclesOFDARKNESS")}</p>
    </header>
    {!main && <div className="ctl-print-page-heading"><strong>{title}</strong><span>{page} / {total}</span></div>}
    <div className="ctl-print-page-content">{children}</div>
    <footer><span>{title}</span><span>{page} / {total}</span></footer>
  </section>;
}

function PrintField({ label, value }: { label: string; value: unknown }) {
  return <div className="ctl-print-field"><span>{label}</span><strong>{String(value ?? "")}</strong></div>;
}

function PrintPhysicalTrack({ current, slots = 10, damage, clarityScale = false }: { current: number; slots?: number; damage?: ClarityDamageLevel[]; clarityScale?: boolean }) {
  const { t } = useLanguage();
  const maximum = Math.max(10, slots);
  const marked = Math.max(0, Math.min(maximum, current));
  return <div className={`ctl-print-physical-track${clarityScale ? " ctl-print-clarity-track" : ""}`}>
    <div className="ctl-print-circles">{Array.from({ length: maximum }, (_, index) => <i className={index < marked ? "filled" : ""} key={`circle-${index}`}/>)}</div>
    <div className="ctl-print-boxes">{Array.from({ length: maximum }, (_, index) => <i className={String(damage?.[index] ?? "empty")} key={`box-${index}`}><span/></i>)}</div>
    {clarityScale && <div className="ctl-print-clarity-numbers" aria-label={t("ui.clarityScale")}>{Array.from({ length: maximum }, (_, index) => <span key={index}>{index || "\u00a0"}</span>)}</div>}
  </div>;
}

function PrintWritableBoxes({ label, slots = 20 }: { label: string; slots?: number }) {
  return <div className="ctl-print-writable-resource"><strong>{label}</strong><div className="ctl-print-boxes">{Array.from({ length: slots }, (_, index) => <i key={index}><span/></i>)}</div></div>;
}

function PrintTextList({ values, minimum = 0 }: { values: readonly string[]; minimum?: number }) {
  const visible = values.map((value) => value.trim()).filter(Boolean);
  const rows = [...visible];
  while (rows.length < minimum) rows.push("");
  return <div className="ctl-print-lines">{rows.map((value, index) => <div className={value ? undefined : "blank"} key={`${value}-${index}`}>{value || "\u00a0"}</div>)}</div>;
}

function PrintCard({ title, meta, children, className = "" }: { title: ReactNode; meta?: string; children?: ReactNode; className?: string }) {
  return <article className={`ctl-print-card${className ? ` ${className}` : ""}`}><header><strong>{title}</strong>{meta && <small>{meta}</small>}</header>{children}</article>;
}

type ContractPrintData = { title: string; access: string; kind: string; facts: Array<[string, ReactNode]>; rows: Array<[string, ReactNode]> };

function contractPrintData(baseDefinition: ContractDefinition, character: CharacterSheet, courts: readonly CourtDefinition[], locale: Locale, t: Translator): ContractPrintData {
  const definition = contractPresentation(contractWithSupplementalBenefits(baseDefinition, []), locale);
  const summary = contractSummary(baseDefinition, locale);
  const data = character.line_data;
  const benefits = [String(data.seeming ?? ""), ...objectList(data.extra_contract_benefits).filter((item) => String(item.contractId) === definition.id).map((item) => String(item.seeming))]
    .filter((value, index, all) => value && all.indexOf(value) === index)
    .map((key) => ({ key, text: definition.seemingBenefits?.[key as keyof typeof definition.seemingBenefits] })).filter((item) => item.text);
  const court = String(data.court ?? "");
  const courtBenefit = (definition as ContractDefinition & { courtBenefits?: Record<string, string> }).courtBenefits?.[court];
  const clauseCourtIds = [findCourt(courts, court)?.id ?? court, ...objectList(data.extra_contract_clauses).filter((item) => String(item.contractId) === definition.id).map((item) => String(item.courtId))]
    .filter((value, index, all) => value && all.indexOf(value) === index);
  const clauses = clauseCourtIds.map((courtId) => ({ courtId, text: definition.courtClauses?.[courtId] })).filter((item) => item.text);
  const outcomes = contractOutcomeSections(definition, locale);
  const options = contractDisplayOptions(definition, locale);
  const rows: Array<[string, ReactNode]> = [];
  if (summary) rows.push([t("ui.summary"), summary]);
  rows.push([t("ui.actionDuration"), `${definition.action ?? "-"} · ${definition.duration ?? "-"}`]);
  outcomes.forEach((outcome) => rows.push([outcome.label, outcome.text]));
  if (options.length) rows.push([t("ui.options"), <ul key="options">{options.map((option) => <li key={option}>{option}</li>)}</ul>]);
  rows.push([t("ui.loophole"), definition.loophole ?? "-"]);
  benefits.forEach((benefit) => rows.push([`${t("ui.benefitFor")} ${seemingDisplayName(benefit.key, locale)}`, benefit.text]));
  if (courtBenefit) rows.push([t("ui.courtBenefit"), courtBenefit]);
  clauses.forEach((clause) => rows.push([`Clause · ${courtName(courts, clause.courtId, locale)}`, clause.text]));
  definition.detailTables?.forEach((table) => rows.push([table.title, <table className="ctl-print-detail-table" key={table.title}><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={`${table.title}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>]));
  if (definition.goblinDebt) rows.push([t("ui.goblinDebt"), definition.goblinDebt]);
  const name = locale === "en-US" ? definition.originalName ?? definition.name : definition.name;
  const kind = definition.goblin ? "Goblin" : definition.type === "Comum" ? t("ui.common") : t("ui.royal");
  const courtNames = definition.courtIds?.map((courtId) => courtName(courts, courtId, locale)).filter(Boolean).join(", ");
  const access = definition.categoryKind === "Corte" ? definition.courtFamily || courtNames || systemTerm(definition.regalia, locale) : systemTerm(definition.regalia, locale);
  const roll = contractHasInvocationRoll(definition) === true && definition.dicePool?.trim() ? definition.dicePool : "None";
  const facts: Array<[string, ReactNode]> = [
    [`${t("ui.cost")}:`, definition.cost?.trim() || "None"],
    [`${t("ui.roll")}:`, roll],
  ];
  return { title: name, access: access || "None", kind, facts, rows: rows.filter(([, value]) => Boolean(value)) };
}

function ContractCard({ data, rows, continued = false, detailed }: { data: ContractPrintData; rows: Array<[string, ReactNode]>; continued?: boolean; detailed: boolean }) {
  const { t } = useLanguage();
  return <PrintCard title={<>{data.title} — {data.access} <span className="ctl-print-contract-tag">{data.kind}</span>{continued && <small className="ctl-print-contract-continuation">{t("ui.continued")}</small>}</>} className={`ctl-print-contract ${detailed ? "detailed" : "compact"}`}>
    <dl className="ctl-print-contract-facts">{data.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {detailed && <dl>{rows.map(([label, value], index) => <div key={`${label}-${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
  </PrintCard>;
}

function ExpandedMeritCard({ merit, catalog, courts, detailed }: { merit: CharacterSheet["merits"][number]; catalog: readonly MeritDefinition[]; courts: readonly CourtDefinition[]; detailed: boolean }) {
  const { locale, t } = useLanguage();
  const definition = catalog.find((item) => item.name === merit.name);
  const configured = expandedConfigurationLines(merit.name, merit.dots, merit.configuration, locale, courts);
  const configuredTitle = meritConfigurationTitle(merit.configuration, locale, courts);
  const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name;
  const title = configuredTitle ? `${name}: ${configuredTitle}` : name;
  const levels = definition?.levels?.filter((level) => level.rating <= merit.dots) ?? [];
  return <PrintCard title={`${title} ${"•".repeat(merit.dots)}`} meta={definition ? `${definition.source} · p. ${definition.page || "-"}` : merit.source} className={detailed ? "detailed" : "compact"}>
    {!!configured.length && <div className="ctl-print-configured">{configured.map((line, index) => <p key={index}>{line}</p>)}</div>}
    {detailed && definition && <div className="ctl-print-merit-details">
      {definition.prerequisites && <p><b>{t("ui.prerequisites")}:</b> {definition.prerequisites}</p>}
      {levels.length ? levels.map((level) => <p key={level.rating}><b>{"•".repeat(level.rating)} {level.name}:</b> {level.description}</p>) : <p>{locale === "en-US" ? definition.descriptionEn : definition.description}</p>}
    </div>}
  </PrintCard>;
}

function FlowPages({ blocks, characterName, startPage, onReadyChange, onPageCountChange }: { blocks: PrintBlock[]; characterName: string; startPage: number; onReadyChange?: (ready: boolean) => void; onPageCountChange: (count: number) => void }) {
  const { t } = useLanguage();
  const measureRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<PrintFlowColumn[]>([]);

  useLayoutEffect(() => {
    let cancelled = false;
    onReadyChange?.(false);
    const measure = async () => {
      await document.fonts?.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (cancelled || !measureRef.current) return;
      const itemHeights: Record<string, number> = {};
      const headingHeights: Record<string, number> = {};
      const outerHeight = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        return element.getBoundingClientRect().height + Number.parseFloat(style.marginTop || "0") + Number.parseFloat(style.marginBottom || "0");
      };
      measureRef.current.querySelectorAll<HTMLElement>("[data-print-item]").forEach((element) => { itemHeights[element.dataset.printItem ?? ""] = outerHeight(element); });
      measureRef.current.querySelectorAll<HTMLElement>("[data-print-heading]").forEach((element) => { headingHeights[element.dataset.printHeading ?? ""] = outerHeight(element); });
      const capacity = measureRef.current.querySelector<HTMLElement>("[data-print-capacity]")?.getBoundingClientRect().height ?? 0;
      const nextColumns = paginatePrintItems(blocks, itemHeights, headingHeights, capacity);
      setColumns(nextColumns);
      onPageCountChange(pairPrintColumns(nextColumns).length);
      requestAnimationFrame(() => { if (!cancelled) onReadyChange?.(true); });
    };
    void measure();
    return () => { cancelled = true; };
  }, [blocks, onPageCountChange, onReadyChange]);

  const blockById = new Map(blocks.map((block) => [block.id, block]));
  const pages = pairPrintColumns(columns);
  const total = startPage - 1 + pages.length;
  return <>
    <div className="ctl-print-measure" ref={measureRef} aria-hidden="true">
      <div className="ctl-print-measure-capacity" data-print-capacity/>
      {[...new Map(blocks.map((block) => [block.section, block.sectionLabel])).entries()].map(([section, label]) => <h2 key={section} data-print-heading={section} className="ctl-print-flow-heading">{label}</h2>)}
      {blocks.map((block) => <div className="ctl-print-flow-item" data-print-item={block.id} key={block.id}>{block.node}</div>)}
    </div>
    {pages.map((pageColumns, pageIndex) => <PrintPage key={pageIndex} page={startPage + pageIndex} total={total} title={characterName || t("ui.character")}>
      <div className="ctl-print-flow-columns">{pageColumns.map((column, columnIndex) => <div className="ctl-print-flow-column" key={columnIndex}>{column.groups.map((group) => <section className="ctl-print-flow-group" key={`${group.section}-${group.itemIds[0]}`}>
        <h2 className="ctl-print-flow-heading">{group.sectionLabel}{group.continued ? ` - ${t("ui.continued")}` : ""}</h2>
        {group.itemIds.map((id) => <div className="ctl-print-flow-item" key={id}>{blockById.get(id)?.node}</div>)}
      </section>)}</div>)}</div>
    </PrintPage>)}
  </>;
}

export function ChangelingPrintSheet({ character, options, catalogs, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Changeling print sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const contractCatalog = catalogs.get<readonly ContractDefinition[]>("changeling-contracts");
  const coreMerits = catalogs.get<readonly MeritDefinition[]>("core-merits");
  const changelingMerits = catalogs.get<readonly MeritDefinition[]>("changeling-merits");
  const meritCatalog = useMemo(() => [...coreMerits, ...changelingMerits], [changelingMerits, coreMerits]);
  const coreReference = catalogs.get<{ conditions: ConditionDefinition[]; presentation: Record<string, Partial<ConditionDefinition>> }>("core-reference");
  const reference = catalogs.get<ChangelingReference>("changeling-reference");
  const conditions = useMemo(() => [...coreReference.conditions, ...reference.conditions].map((condition) => locale === "pt-BR" ? { ...condition, ...coreReference.presentation[condition.id], ...reference.presentation[condition.id] } : condition), [coreReference, locale, reference]);
  const data = character.line_data;
  const derived = derivedWithPermanentMerits(character);
  const powerRating = Math.max(1, Number(data.wyrd ?? 1));
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const baseWillpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const lostWillpower = Math.max(0, Math.min(baseWillpower - 1, Number(character.current_state?.willpower_lost_dots ?? 0)));
  const willpower = Math.max(1, baseWillpower - lostWillpower);
  const currentWillpower = Math.max(0, Math.min(willpower, Number(character.current_state?.willpower_current ?? willpower)));
  const clarity = Math.max(1, Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1));
  const clarityDamage = normalizeClarityDamage(character.current_state?.clarity_damage, clarity);
  const contracts = useMemo(() => [...objectList(data.contracts), ...objectList(data.learned_contracts)].flatMap((saved) => {
    const found = contractCatalog.find((item) => item.id === String(saved.id ?? "") || item.name === String(saved.name ?? ""));
    return found ? [found] : (saved.id && saved.name ? [saved as unknown as ContractDefinition] : []);
  }), [contractCatalog, data.contracts, data.learned_contracts]);
  const expanded = useMemo(() => character.merits.filter((merit) => !merit.grantedBy && (meritCatalog.some((item) => item.name === merit.name && item.levels?.length) || ["Contacts", "Multilingual"].includes(merit.name))), [character.merits, meritCatalog]);
  const principalMerits = character.merits.filter((merit) => !merit.grantedBy || merit.grantedBy === "Corte");
  const courtDisplay = courtName(reference.courts, data.court, locale);
  const kith = useMemo(() => kithPresentation(reference, data.kith, locale, Boolean(data.kith_custom)), [data.kith, data.kith_custom, locale, reference]);
  const kithSkillNames = useMemo(() => {
    const definition = findKith(reference, data.kith);
    const choice = kithCreationChoice(definition?.id);
    const skill = canonicalSkill(choice?.kind === "skill" ? data.kith_choice : data.kith_skill ?? definition?.skill);
    return new Set(skill ? [skill] : []);
  }, [data.kith, data.kith_choice, data.kith_skill, reference]);
  const armor = ARMORS.map((item) => combatItemPresentation(item, locale)).find((item) => item.id === String(data.combat_armor ?? ""));
  const weapons = useMemo(() => stringList(data.combat_weapons).map((id) => WEAPONS.map((item) => combatItemPresentation(item, locale)).find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)), [data.combat_weapons, locale]);
  const equipment = useMemo(() => stringList(data.combat_equipment).map((id) => EQUIPMENT.map((item) => combatItemPresentation(item, locale)).find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)), [data.combat_equipment, locale]);
  const vehicles = useMemo(() => stringList(data.companion_vehicles).map((id) => VEHICLES.map((item) => vehiclePresentation(item, locale)).find((item) => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item)), [data.companion_vehicles, locale]);
  const selectedConditions = useMemo(() => {
    const ids = [
      ...objectList(character.current_state?.conditions).map((item) => String(item.id ?? "")),
      ...stringList(character.current_state?.conditions),
      ...stringList(data.merit_granted_conditions),
    ].filter(Boolean);
    return [...new Set(ids)].map((id) => conditions.find((condition) => condition.id === id)).filter((item): item is ConditionDefinition => Boolean(item));
  }, [character.current_state?.conditions, conditions, data.merit_granted_conditions]);
  const seeming = CTL_SEEMINGS[String(data.seeming ?? "") as keyof typeof CTL_SEEMINGS];
  const identity = [
    [t("ui.name"), character.character.name], [t("ui.needle"), changelingAnchorDisplayName("needle", data.needle, locale)], [t("ui.seeming"), seemingDisplayName(data.seeming, locale)],
    [t("ui.player"), character.character.player], [t("ui.thread"), changelingAnchorDisplayName("thread", data.thread, locale)], [t("ui.kith6a78ff"), kith.name],
    [t("ui.chronicle"), character.character.chronicle], [t("ui.concept"), character.character.concept], [t("ui.court"), courtDisplay],
  ];
  const otherTraits = isBlankPrintCharacter(character)
    ? { Tamanho: "", Deslocamento: "", Defesa: "", Iniciativa: "", Armadura: "" }
    : derivedTraitsWithArmor(derived, data.combat_armor);
  const flowBlocks = useMemo(() => {
    const blocks: PrintBlock[] = [];
    const add = (section: string, sectionLabel: string, id: string, node: ReactNode) => blocks.push({ section, sectionLabel, id, node });
    if (options.powerDetails) contracts.forEach((contract, contractIndex) => {
      const card = contractPrintData(contract, character, reference.courts, locale, t);
      const chunks = Array.from({ length: Math.max(1, Math.ceil(card.rows.length / 4)) }, (_, index) => card.rows.slice(index * 4, index * 4 + 4));
      chunks.forEach((rows, chunkIndex) => add("contracts", t("ui.contracts"), `contract-${contract.id}-${contractIndex}-${chunkIndex}`, <ContractCard data={card} rows={rows} continued={chunkIndex > 0} detailed/>));
    });
    if (options.expandedMeritDetails) expanded.forEach((merit, index) => add("expanded-merits", t("ui.expandedMerits"), `merit-${merit.instanceId ?? merit.name}-${index}`, <ExpandedMeritCard merit={merit} catalog={meritCatalog} courts={reference.courts} detailed/>));
    if (armor) add("equipment", t("ui.equipment"), "armor", <PrintCard title={armor.name} meta={`${t("ui.armor")} ${armor.general}/${armor.ballistic} · ${t("ui.defense")} ${signed(armor.defense)} · ${t("ui.speed")} ${signed(armor.speed)}`}><p>{armor.coverage}</p></PrintCard>);
    weapons.forEach((weapon, index) => add("equipment", t("ui.equipment"), `weapon-${weapon.id}-${index}`, <PrintCard title={weapon.name} meta={`${weapon.kind} · ${t("ui.damage")} ${weapon.damage} · ${t("ui.initiative")} ${signed(weapon.initiative)} · ${t("ui.strength")} ${weapon.strength} · ${t("ui.size")} ${weapon.size}`}>{weapon.ranges && <p>{t("ui.range")}: {weapon.ranges} · {t("ui.capacity")}: {weapon.clip}</p>}{weapon.special && <p>{weapon.special}</p>}</PrintCard>));
    equipment.forEach((item, index) => add("equipment", t("ui.equipment"), `equipment-${item.id}-${index}`, <PrintCard title={item.name} meta={`${item.category} · ${t("ui.bonus")} ${item.bonus} · ${t("ui.durability")} ${item.durability} · ${t("ui.size")} ${item.size}`}><p>{item.effect}</p></PrintCard>));
    vehicles.forEach((vehicle, index) => add("equipment", t("ui.equipment"), `vehicle-${vehicle.id}-${index}`, <PrintCard title={vehicle.name} meta={`${t("ui.modifier")} ${signed(vehicle.diceModifier)} · ${t("ui.size")} ${vehicle.size} · ${t("ui.durability")} ${vehicle.durability} · ${t("ui.structure")} ${vehicle.structure} · ${t("ui.speed")} ${vehicle.speed}`}/>));
    selectedConditions.forEach((condition, index) => add("conditions", t("ui.conditions"), `condition-${condition.id}-${index}`, <PrintCard title={condition.name} meta={`${condition.sourceCode} · p. ${condition.page}`}>{condition.penalty && <p><b>{t("ui.penalty")}:</b> {condition.penalty}</p>}</PrintCard>));
    const entitlementState = normalizeEntitlementState(data.entitlement, powerRating, reference.entitlements);
    const entitlement = reference.entitlements.find((item) => item.id === entitlementState.definitionId);
    if (entitlement && entitlementState.accepted) {
      const activeBlessings = entitlementState.allocations.filter((item) => item.target === "blessing").map((item) => entitlement.blessings.find((blessing) => blessing.id === item.blessingId)).filter((item): item is NonNullable<typeof item> => Boolean(item));
      add("entitlement", "Entitlement", "entitlement", <PrintCard title={entitlement.name} meta={`${entitlement.meritName} · ${entitlement.sourceCode} · p. ${entitlement.page}`}><p><b>{t("ui.entitlementTouchstone")}:</b> {entitlementState.touchstone.name}</p><p><b>{t("ui.privileges")}:</b> {entitlement.privileges}</p>{activeBlessings.map((blessing) => <p key={blessing.id}><b>{blessing.name}:</b> {blessing.description}</p>)}<p><b>{t("ui.curse")}:</b> {entitlement.curse}</p></PrintCard>);
    }
    character.merits.filter((merit) => !merit.grantedBy && ["Fae Mount", "Fae Pet"].includes(merit.name)).forEach((merit, index) => {
      const configuration = normalizeMeritConfiguration(merit.configuration);
      const animal = merit.name === "Fae Pet" ? ANIMALS.find((item) => item.id === String(configuration.animalId ?? "")) : undefined;
      const presented = animal ? animalPresentation(animal, locale) : undefined;
      const name = String(configuration.name ?? "").trim() || (merit.name === "Fae Mount" ? t("ui.faeMount") : t("ui.faePet"));
      add("companions", t("ui.companions"), `fae-companion-${index}`, <PrintCard title={name} meta={`${merit.name} · ${"•".repeat(merit.dots)}`}>{presented ? <><p><b>{t("ui.attributes")}:</b> {presented.attributes}</p><p><b>{t("ui.skills")}:</b> {presented.skills}</p><p><b>{t("ui.otherTraits")}:</b> {t("ui.willpower")} {presented.willpower}, {t("ui.initiative")} {presented.initiative}, {t("ui.defense")} {presented.defense}, {t("ui.speed")} {presented.speed}, {t("ui.size")} {presented.size}, {t("ui.health")} {presented.health}</p></> : <><p><b>{t("ui.abilities")}:</b> {stringList(configuration.abilities).join(", ")}</p><p><b>{t("ui.armor")}:</b> {String(configuration.armor_general ?? 0)}/{String(configuration.armor_ballistic ?? 0)}</p></>}</PrintCard>);
    });
    objectList(character.current_state?.conditions).filter((item) => String(item.id) === "bonded").forEach((bonded, index) => {
      const animal = ANIMALS.find((item) => item.id === String(bonded.animalId ?? ""));
      if (!animal) return;
      const presented = animalPresentation(animal, locale);
      add("companions", t("ui.companions"), `bonded-${index}`, <PrintCard title={String(bonded.animalName ?? "").trim() || presented.name} meta={`Bonded · ${presented.name}`}><p><b>{t("ui.attributes")}:</b> {presented.attributes}</p><p><b>{t("ui.skills")}:</b> {presented.skills}</p><p><b>{t("ui.otherTraits")}:</b> {t("ui.willpower")} {presented.willpower}, {t("ui.initiative")} {presented.initiative}, {t("ui.defense")} {presented.defense}, {t("ui.speed")} {presented.speed}, {t("ui.size")} {presented.size}, {t("ui.health")} {presented.health}</p></PrintCard>);
    });
    const notes = String(character.current_state?.notes ?? "").trim();
    if (notes) add("notes", t("ui.notes"), "notes", <PrintCard title={t("ui.notes")}><p className="ctl-print-preserve-lines">{notes}</p></PrintCard>);
    return blocks;
  }, [armor, character, contracts, data, equipment, expanded, locale, meritCatalog, options.expandedMeritDetails, options.powerDetails, powerRating, reference, selectedConditions, t, vehicles, weapons]);

  const [flowPageCount, setFlowPageCount] = useState(0);
  const total = 2 + flowPageCount;
  const frailties = normalizeChangelingFrailties(data.frailties, powerRating);
  const touchstoneSlots = 1 + character.merits.filter((merit) => merit.name === "Touchstone" && !merit.grantedBy).reduce((sum, merit) => sum + merit.dots, 0);
  const touchstones = cleanList(data.touchstones).length ? cleanList(data.touchstones) : cleanList([data.touchstone]);
  const experienceBeats = Math.max(0, Math.min(5, Math.trunc(Number(character.current_state?.experience_beats ?? 0) || 0)));
  const meritRows = principalMerits.slice(0, 8);
  const pageTwoMerits = [...principalMerits.slice(8), ...expanded.filter((merit) => !principalMerits.includes(merit))];
  const contractRows = contracts.slice(0, 10).map((contract) => contractPrintData(contract, character, reference.courts, locale, t));
  const seemingBlessing = seeming ? (locale === "en-US" ? seeming.blessingEn : seeming.blessing) : "";
  const seemingCurse = seeming ? (locale === "en-US" ? seeming.curseEn : seeming.curse) : "";
  return <div className="game-print-document ctl-print-document">
    <PrintPage page={1} total={total} title={character.character.name} main>
      <section className="ctl-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</section>
      <SheetHeading className="ctl-print-attributes-heading">{t("ui.attributes")}</SheetHeading>
      <div className="ctl-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
      <div className="ctl-print-main-grid">
        <section><SheetHeading>{t("ui.skills")}</SheetHeading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.skills} specialties={character.specializations} highlightedNames={kithSkillNames} highlightTone="kith"/>)}</section>
        <section>
          <SheetHeading>{t("ui.merits")}</SheetHeading>
          <div className="ctl-print-merits">{meritRows.map((merit, index) => { const definition = meritCatalog.find((item) => item.name === merit.name); const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name; const detail = meritConfigurationTitle(merit.configuration, locale, reference.courts); return <div key={`${merit.name}-${index}`}><span>{name}{detail ? `: ${detail}` : ""}</span><DotValue value={merit.dots} max={Math.max(5, merit.dots)}/></div>; })}{Array.from({ length: Math.max(0, 8 - meritRows.length) }, (_, index) => <div className="blank" key={`blank-merit-${index}`}><span>&nbsp;</span><DotValue value={0} max={5}/></div>)}</div>
          <SheetHeading>{t("ui.favoredRegalia")}</SheetHeading><PrintTextList values={changelingFavoredRegalia(data).map((value) => systemTerm(value, locale))} minimum={2}/>
          <SheetHeading>{t("ui.frailties")}</SheetHeading><PrintTextList values={frailties.map((value) => value ? systemTerm(value, locale) : "")} minimum={frailties.length}/>
          <SheetHeading>{t("ui.aspirations")}</SheetHeading><PrintTextList values={cleanList(data.aspirations)} minimum={3}/>
          <SheetHeading>{t("ui.conditions")}</SheetHeading><PrintTextList values={selectedConditions.map((condition) => condition.name)} minimum={4}/>
        </section>
        <section>
          <SheetHeading>{t("ui.health")}</SheetHeading><PrintPhysicalTrack current={health} slots={health}/>
          <SheetHeading>{t("ui.willpower")}</SheetHeading><PrintPhysicalTrack current={currentWillpower}/>
          <SheetHeading>{t("ui.lineTraits")}</SheetHeading><div className="ctl-print-power"><div><strong>{t("ui.wyrd")}</strong><DotValue value={1} max={10} singleRow/></div><PrintWritableBoxes label={t("ui.glamour")}/></div>
          <SheetHeading>{t("ui.clarity")}</SheetHeading><PrintPhysicalTrack current={clarity} slots={clarity} damage={clarityDamage} clarityScale/>
          <SheetHeading>{t("ui.touchstones")}</SheetHeading><PrintTextList values={touchstones} minimum={Math.max(6, touchstoneSlots)}/>
          <SheetHeading>{t("ui.derivedStats")}</SheetHeading><CompactValues values={otherTraits}/>
          <SheetHeading>{t("ui.experience")}</SheetHeading><div className="ctl-print-experience">
            <div className="ctl-print-experience-beats"><span>{t("ui.beats")}</span><div className="ctl-print-circles">{Array.from({ length: 5 }, (_, index) => <i className={index < experienceBeats ? "filled" : ""} key={index}/>)}</div></div>
            <div><span>{t("ui.xpAvailable")}</span></div><div><span>{t("ui.totalXP")}</span></div><div><span>{t("ui.xpSpent")}</span></div>
          </div>
        </section>
      </div>
    </PrintPage>
    <PrintPage page={2} total={total} title={character.character.name} main>
      <SheetHeading>{t("ui.contracts")}</SheetHeading>
      <div className="ctl-print-contract-table">
        <header><span>{t("ui.name")}</span><span>{t("ui.cost")}</span><span>{t("ui.dicePool")}</span><span>{t("ui.actionDuration")}</span><span>{t("ui.loophole")}</span><span>{t("ui.seemingBenefit")}</span></header>
        {contractRows.map((contract, index) => <div key={`${contract.title}-${index}`}><span>{contract.title}</span><span>{contract.facts[0]?.[1]}</span><span>{contract.facts[1]?.[1]}</span><span>{contract.rows.find(([label]) => label === t("ui.actionDuration"))?.[1]}</span><span>{contract.rows.find(([label]) => label === t("ui.loophole"))?.[1]}</span><span>{contract.rows.find(([label]) => label.startsWith(t("ui.benefitFor")))?.[1]}</span></div>)}
        {Array.from({ length: Math.max(0, 10 - contractRows.length) }, (_, index) => <div key={`blank-contract-${index}`}><span/><span/><span/><span/><span/><span/></div>)}
      </div>
      <div className="ctl-print-second-grid">
        <section>
          <SheetHeading>{t("ui.otherTraits")}</SheetHeading>
          <h3>{t("ui.blessingOf", { name: seemingDisplayName(String(data.seeming ?? ""), locale) })}</h3><p className="ctl-print-lore-text">{seemingBlessing}</p>
          <h3>{t("ui.curse")}</h3><p className="ctl-print-lore-text">{seemingCurse}</p>
          <h3>{t("ui.kithBlessing")}</h3><p className="ctl-print-lore-text">{kith.blessing}</p>
          <SheetHeading>{t("ui.goblinDebt")}</SheetHeading><PrintIntegrityTrack value={Math.max(0, Math.min(10, Number(character.current_state?.goblin_debt ?? 0)))}/>
        </section>
        <section>
          <SheetHeading>{t("ui.oaths")}</SheetHeading><PrintTextList values={cleanList(data.oaths)} minimum={6}/>
          <SheetHeading>{t("ui.expandedMerits")}</SheetHeading>
          <div className="ctl-print-expanded-grid">{pageTwoMerits.slice(0, 4).map((merit, index) => <article key={`${merit.instanceId ?? merit.name}-${index}`}><strong>{merit.name} {"•".repeat(merit.dots)}</strong><PrintTextList values={expandedConfigurationLines(merit.name, merit.dots, merit.configuration, locale, reference.courts)} minimum={3}/></article>)}{Array.from({ length: Math.max(0, 4 - pageTwoMerits.length) }, (_, index) => <article key={`blank-expanded-${index}`}><strong>&nbsp;</strong><PrintTextList values={[]} minimum={3}/></article>)}</div>
          <SheetHeading>{t("ui.combat")}</SheetHeading>
          <div className="ctl-print-combat-table"><header><span>{t("combat.weapons")}</span><span>{t("ui.dicePool")}</span><span>{t("ui.damage")}</span><span>{t("ui.range")}</span><span>{t("ui.initiative")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 5 }, (_, index) => { const weapon = weapons[index]; return <div key={weapon?.id ?? index}><i/><span>{weapon?.name}</span><span/><span>{weapon?.damage}</span><span>{weapon?.ranges}</span><span>{weapon?.initiative}</span><span>{weapon?.size}</span></div>; })}</div>
          <SheetHeading>{t("ui.equipment")}</SheetHeading>
          <div className="ctl-print-equipment-table"><header><span>{t("ui.name")}</span><span>{t("ui.durability")}</span><span>{t("ui.structure")}</span><span>{t("ui.size")}</span></header>{Array.from({ length: 5 }, (_, index) => { const item = equipment[index]; return <div key={item?.id ?? index}><i/><span>{item?.name}</span><span>{item?.durability}</span><span>{item?.structure}</span><span>{item?.size}</span></div>; })}</div>
        </section>
      </div>
    </PrintPage>
    <FlowPages blocks={flowBlocks} characterName={character.character.name} startPage={3} onReadyChange={onReadyChange} onPageCountChange={setFlowPageCount}/>
  </div>;
}
