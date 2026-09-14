"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { pairPrintColumns, paginatePrintItems, type PrintFlowColumn, type PrintFlowItem } from "@/app/workspace/print-pagination";
import { CompactValues, DotValue, SheetHeading, TraitBlock, signed, stringList } from "@/app/workspace/sheet-primitives";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { ChangelingCondition } from "@/lib/changeling-conditions";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import { ANIMALS, VEHICLES, animalPresentation, vehiclePresentation } from "@/lib/companions";
import { ARMORS, EQUIPMENT, WEAPONS, combatItemPresentation } from "@/lib/combat-equipment";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeEntitlementState, type EntitlementDefinition } from "@/lib/entitlements";
import type { GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage, type Locale } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeClarityDamage, type ClarityDamageLevel } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { changelingAnchorDisplayName, normalizeChangelingFrailties, seemingDisplayName, CTL_SEEMINGS } from "./creation-rules";
import { derivedWithPermanentMerits } from "./experience-shared";
import { expandedConfigurationLines, meritConfigurationTitle } from "./sheet-merit-configurations";

type ChangelingReference = {
  conditions: ChangelingCondition[];
  presentation: Record<string, Partial<ChangelingCondition>>;
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
  if (["sem corte", "courtless"].includes(raw.trim().toLocaleLowerCase())) return locale === "en-US" ? "Courtless" : "Sem Corte";
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
      <div><span className="ctl-print-title-mark">CHANGELING</span><strong>THE LOST</strong></div>
      <p>CHRONICLES OF DARKNESS</p>
    </header>
    {!main && <div className="ctl-print-page-heading"><strong>{title}</strong><span>{page} / {total}</span></div>}
    <div className="ctl-print-page-content">{children}</div>
    <footer><span>{title}</span><span>{page} / {total}</span></footer>
  </section>;
}

function PrintField({ label, value }: { label: string; value: unknown }) {
  return <div className="ctl-print-field"><span>{label}</span><strong>{String(value ?? "")}</strong></div>;
}

function PrintResourceTrack({ label, current, maximum, numbered = false }: { label: string; current: number; maximum: number; numbered?: boolean }) {
  return <div className="ctl-print-track"><strong>{label}</strong><div className="ctl-print-circles">{Array.from({ length: maximum }, (_, index) => <i className={index < current ? "filled" : ""} key={index}/>)}</div>{numbered && <div className="ctl-print-resource-numbers" aria-label={`${label} scale`}>{Array.from({ length: maximum }, (_, index) => <span key={index}>{index + 1}</span>)}</div>}</div>;
}

function PrintPhysicalTrack({ current, slots = 10, damage, clarityScale = false }: { current: number; slots?: number; damage?: ClarityDamageLevel[]; clarityScale?: boolean }) {
  const maximum = Math.max(10, slots);
  const marked = Math.max(0, Math.min(maximum, current));
  return <div className={`ctl-print-physical-track${clarityScale ? " ctl-print-clarity-track" : ""}`}>
    <div className="ctl-print-circles">{Array.from({ length: maximum }, (_, index) => <i className={index < marked ? "filled" : ""} key={`circle-${index}`}/>)}</div>
    <div className="ctl-print-boxes">{Array.from({ length: maximum }, (_, index) => <i className={String(damage?.[index] ?? "empty")} key={`box-${index}`}><span/></i>)}</div>
    {clarityScale && <div className="ctl-print-clarity-numbers" aria-label="Clarity scale">{Array.from({ length: maximum }, (_, index) => <span key={index}>{index || "\u00a0"}</span>)}</div>}
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

function contractPrintData(baseDefinition: ContractDefinition, character: CharacterSheet, courts: readonly CourtDefinition[], locale: Locale, tr: (pt: string, en: string) => string): ContractPrintData {
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
  if (summary) rows.push([tr("Resumo", "Summary"), summary]);
  rows.push([tr("Ação / Duração", "Action / Duration"), `${definition.action ?? "-"} · ${definition.duration ?? "-"}`]);
  outcomes.forEach((outcome) => rows.push([outcome.label, outcome.text]));
  if (options.length) rows.push([tr("Opções", "Options"), <ul key="options">{options.map((option) => <li key={option}>{option}</li>)}</ul>]);
  rows.push([tr("Brecha", "Loophole"), definition.loophole ?? "-"]);
  benefits.forEach((benefit) => rows.push([`${tr("Benefício de", "Benefit for")} ${seemingDisplayName(benefit.key, locale)}`, benefit.text]));
  if (courtBenefit) rows.push([tr("Benefício da Corte", "Court Benefit"), courtBenefit]);
  clauses.forEach((clause) => rows.push([`Clause · ${courtName(courts, clause.courtId, locale)}`, clause.text]));
  definition.detailTables?.forEach((table) => rows.push([table.title, <table className="ctl-print-detail-table" key={table.title}><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={`${table.title}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>]));
  if (definition.goblinDebt) rows.push([tr("Débito Goblin", "Goblin Debt"), definition.goblinDebt]);
  const name = locale === "en-US" ? definition.originalName ?? definition.name : definition.name;
  const kind = definition.goblin ? "Goblin" : definition.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal");
  const courtNames = definition.courtIds?.map((courtId) => courtName(courts, courtId, locale)).filter(Boolean).join(", ");
  const access = definition.categoryKind === "Corte" ? definition.courtFamily || courtNames || systemTerm(definition.regalia, locale) : systemTerm(definition.regalia, locale);
  const roll = contractHasInvocationRoll(definition) === true && definition.dicePool?.trim() ? definition.dicePool : "None";
  const facts: Array<[string, ReactNode]> = [
    [`${tr("Custo", "Cost")}:`, definition.cost?.trim() || "None"],
    [`${tr("Jogada", "Roll")}:`, roll],
  ];
  return { title: name, access: access || "None", kind, facts, rows: rows.filter(([, value]) => Boolean(value)) };
}

function ContractCard({ data, rows, continued = false, detailed }: { data: ContractPrintData; rows: Array<[string, ReactNode]>; continued?: boolean; detailed: boolean }) {
  const { tr } = useLanguage();
  return <PrintCard title={<>{data.title} — {data.access} <span className="ctl-print-contract-tag">{data.kind}</span>{continued && <small className="ctl-print-contract-continuation">{tr("continuação", "continued")}</small>}</>} className={`ctl-print-contract ${detailed ? "detailed" : "compact"}`}>
    <dl className="ctl-print-contract-facts">{data.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {detailed && <dl>{rows.map(([label, value], index) => <div key={`${label}-${index}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
  </PrintCard>;
}

function ExpandedMeritCard({ merit, catalog, courts, detailed }: { merit: CharacterSheet["merits"][number]; catalog: readonly MeritDefinition[]; courts: readonly CourtDefinition[]; detailed: boolean }) {
  const { locale, tr } = useLanguage();
  const definition = catalog.find((item) => item.name === merit.name);
  const configured = expandedConfigurationLines(merit.name, merit.dots, merit.configuration, locale, courts);
  const configuredTitle = meritConfigurationTitle(merit.configuration, locale, courts);
  const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name;
  const title = configuredTitle ? `${name}: ${configuredTitle}` : name;
  const levels = definition?.levels?.filter((level) => level.rating <= merit.dots) ?? [];
  return <PrintCard title={`${title} ${"•".repeat(merit.dots)}`} meta={definition ? `${definition.source} · p. ${definition.page || "-"}` : merit.source} className={detailed ? "detailed" : "compact"}>
    {!!configured.length && <div className="ctl-print-configured">{configured.map((line, index) => <p key={index}>{line}</p>)}</div>}
    {detailed && definition && <div className="ctl-print-merit-details">
      {definition.prerequisites && <p><b>{tr("Pré-requisitos", "Prerequisites")}:</b> {definition.prerequisites}</p>}
      {levels.length ? levels.map((level) => <p key={level.rating}><b>{"•".repeat(level.rating)} {level.name}:</b> {level.description}</p>) : <p>{locale === "en-US" ? definition.descriptionEn : definition.description}</p>}
    </div>}
  </PrintCard>;
}

function FlowPages({ blocks, characterName, startPage, onReadyChange, onPageCountChange }: { blocks: PrintBlock[]; characterName: string; startPage: number; onReadyChange?: (ready: boolean) => void; onPageCountChange: (count: number) => void }) {
  const { tr } = useLanguage();
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
    {pages.map((pageColumns, pageIndex) => <PrintPage key={pageIndex} page={startPage + pageIndex} total={total} title={characterName || tr("Personagem", "Character")}>
      <div className="ctl-print-flow-columns">{pageColumns.map((column, columnIndex) => <div className="ctl-print-flow-column" key={columnIndex}>{column.groups.map((group) => <section className="ctl-print-flow-group" key={`${group.section}-${group.itemIds[0]}`}>
        <h2 className="ctl-print-flow-heading">{group.sectionLabel}{group.continued ? ` - ${tr("continuação", "continued")}` : ""}</h2>
        {group.itemIds.map((id) => <div className="ctl-print-flow-item" key={id}>{blockById.get(id)?.node}</div>)}
      </section>)}</div>)}</div>
    </PrintPage>)}
  </>;
}

export function ChangelingPrintSheet({ character, options, catalogs, onReadyChange }: GameLinePrintSheetProps) {
  if (!catalogs) throw new Error("Changeling print sheet requires its catalog snapshot.");
  const { locale, tr } = useLanguage();
  const contractCatalog = catalogs.get<readonly ContractDefinition[]>("changeling-contracts");
  const coreMerits = catalogs.get<readonly MeritDefinition[]>("core-merits");
  const changelingMerits = catalogs.get<readonly MeritDefinition[]>("changeling-merits");
  const meritCatalog = useMemo(() => [...coreMerits, ...changelingMerits], [changelingMerits, coreMerits]);
  const coreReference = catalogs.get<{ conditions: ChangelingCondition[]; presentation: Record<string, Partial<ChangelingCondition>> }>("core-reference");
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
  const court = findCourt(reference.courts, data.court);
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
    return [...new Set(ids)].map((id) => conditions.find((condition) => condition.id === id)).filter((item): item is ChangelingCondition => Boolean(item));
  }, [character.current_state?.conditions, conditions, data.merit_granted_conditions]);
  const identity = [
    [tr("Nome", "Name"), character.character.name], [tr("Agulha", "Needle"), changelingAnchorDisplayName("needle", data.needle, locale)], [tr("Feição", "Seeming"), seemingDisplayName(data.seeming, locale)],
    [tr("Jogador", "Player"), character.character.player], [tr("Fio", "Thread"), changelingAnchorDisplayName("thread", data.thread, locale)], [tr("Frátria", "Kith"), kith.name],
    [tr("Crônica", "Chronicle"), character.character.chronicle], [tr("Conceito", "Concept"), character.character.concept], [tr("Corte", "Court"), courtDisplay],
  ];
  const otherTraits = {
    Defesa: Number(derived.Defesa ?? 0) + (armor?.defense ?? 0),
    Iniciativa: Number(derived.Iniciativa ?? 0),
    Deslocamento: Number(derived.Deslocamento ?? 0) + (armor?.speed ?? 0),
    Tamanho: Number(derived.Tamanho ?? 5),
    "Armadura geral": armor?.general ?? 0,
    "Armadura balística": armor?.ballistic ?? 0,
  };
  const flowBlocks = useMemo(() => {
    const blocks: PrintBlock[] = [];
    const add = (section: string, sectionLabel: string, id: string, node: ReactNode) => blocks.push({ section, sectionLabel, id, node });
    const seeming = CTL_SEEMINGS[String(data.seeming ?? "") as keyof typeof CTL_SEEMINGS];
    contracts.forEach((contract, contractIndex) => {
      const card = contractPrintData(contract, character, reference.courts, locale, tr);
      const chunks = options.powerDetails ? Array.from({ length: Math.max(1, Math.ceil(card.rows.length / 4)) }, (_, index) => card.rows.slice(index * 4, index * 4 + 4)) : [[]];
      chunks.forEach((rows, chunkIndex) => add("contracts", tr("Contratos", "Contracts"), `contract-${contract.id}-${contractIndex}-${chunkIndex}`, <ContractCard data={card} rows={rows} continued={chunkIndex > 0} detailed={options.powerDetails}/>));
    });
    if (!contracts.length) add("contracts", tr("Contratos", "Contracts"), "contracts-blank", <PrintCard title={tr("Contratos", "Contracts")}><PrintTextList values={[]} minimum={5}/></PrintCard>);
    if (seeming) add("line-lore", tr("Feição e Frátria", "Seeming and Kith"), "seeming", <PrintCard title={tr(`Bênção de ${seeming.translated}`, `${String(data.seeming)} Blessing`)} meta="Changeling: The Lost"><p>{locale === "en-US" ? seeming.blessingEn : seeming.blessing}</p><p><b>{tr("Maldição", "Curse")}:</b> {locale === "en-US" ? seeming.curseEn : seeming.curse}</p></PrintCard>);
    else add("line-lore", tr("Feição e Frátria", "Seeming and Kith"), "seeming-blank", <PrintCard title={tr("Feição", "Seeming")}><PrintTextList values={[]} minimum={3}/></PrintCard>);
    if (kith.name) add("line-lore", tr("Feição e Frátria", "Seeming and Kith"), "kith", <PrintCard title={tr(`Bênção de ${kith.name}`, `${kith.name} Blessing`)} meta={kith.source ? `${kith.source}${kith.page ? ` · p. ${kith.page}` : ""}` : undefined}>{kith.description && kith.description !== kith.blessing && <p>{kith.description}</p>}<p>{kith.blessing}</p></PrintCard>);
    else add("line-lore", tr("Feição e Frátria", "Seeming and Kith"), "kith-blank", <PrintCard title={tr("Frátria", "Kith")}><PrintTextList values={[]} minimum={3}/></PrintCard>);
    expanded.forEach((merit, index) => add("expanded-merits", tr("Méritos Expandidos", "Expanded Merits"), `merit-${merit.instanceId ?? merit.name}-${index}`, <ExpandedMeritCard merit={merit} catalog={meritCatalog} courts={reference.courts} detailed={options.expandedMeritDetails}/>));
    if (!expanded.length) add("expanded-merits", tr("Méritos Expandidos", "Expanded Merits"), "expanded-merits-blank", <PrintCard title={tr("Méritos Expandidos", "Expanded Merits")}><PrintTextList values={[]} minimum={4}/></PrintCard>);
    add("oaths", tr("Juramentos", "Oaths"), "oaths", <PrintCard title={tr("Juramentos", "Oaths")}><PrintTextList values={cleanList(data.oaths)} minimum={5}/></PrintCard>);
    if (armor) add("equipment", tr("Equipamento", "Equipment"), "armor", <PrintCard title={armor.name} meta={`${tr("Armadura", "Armor")} ${armor.general}/${armor.ballistic} · ${tr("Defesa", "Defense")} ${signed(armor.defense)} · ${tr("Deslocamento", "Speed")} ${signed(armor.speed)}`}><p>{armor.coverage}</p></PrintCard>);
    weapons.forEach((weapon, index) => add("equipment", tr("Equipamento", "Equipment"), `weapon-${weapon.id}-${index}`, <PrintCard title={weapon.name} meta={`${weapon.kind} · ${tr("Dano", "Damage")} ${weapon.damage} · ${tr("Iniciativa", "Initiative")} ${signed(weapon.initiative)} · ${tr("Força", "Strength")} ${weapon.strength} · ${tr("Tamanho", "Size")} ${weapon.size}`}>{weapon.ranges && <p>{tr("Alcance", "Range")}: {weapon.ranges} · {tr("Carga", "Capacity")}: {weapon.clip}</p>}{weapon.special && <p>{weapon.special}</p>}</PrintCard>));
    equipment.forEach((item, index) => add("equipment", tr("Equipamento", "Equipment"), `equipment-${item.id}-${index}`, <PrintCard title={item.name} meta={`${item.category} · ${tr("Bônus", "Bonus")} ${item.bonus} · ${tr("Durabilidade", "Durability")} ${item.durability} · ${tr("Tamanho", "Size")} ${item.size}`}><p>{item.effect}</p></PrintCard>));
    vehicles.forEach((vehicle, index) => add("equipment", tr("Equipamento", "Equipment"), `vehicle-${vehicle.id}-${index}`, <PrintCard title={vehicle.name} meta={`${tr("Modificador", "Modifier")} ${signed(vehicle.diceModifier)} · ${tr("Tamanho", "Size")} ${vehicle.size} · ${tr("Durabilidade", "Durability")} ${vehicle.durability} · ${tr("Estrutura", "Structure")} ${vehicle.structure} · ${tr("Deslocamento", "Speed")} ${vehicle.speed}`}/>));
    if (!armor && !weapons.length && !equipment.length && !vehicles.length) add("equipment", tr("Equipamento", "Equipment"), "equipment-blank", <PrintCard title={tr("Equipamento", "Equipment")}><PrintTextList values={[]} minimum={6}/></PrintCard>);
    selectedConditions.forEach((condition, index) => add("conditions", tr("Condições", "Conditions"), `condition-${condition.id}-${index}`, <PrintCard title={condition.name} meta={`${condition.sourceCode} · p. ${condition.page}`}>{condition.penalty && <p><b>{tr("Penalidade", "Penalty")}:</b> {condition.penalty}</p>}</PrintCard>));
    const entitlementState = normalizeEntitlementState(data.entitlement, powerRating, reference.entitlements);
    const entitlement = reference.entitlements.find((item) => item.id === entitlementState.definitionId);
    if (entitlement && entitlementState.accepted) {
      const activeBlessings = entitlementState.allocations.filter((item) => item.target === "blessing").map((item) => entitlement.blessings.find((blessing) => blessing.id === item.blessingId)).filter((item): item is NonNullable<typeof item> => Boolean(item));
      add("entitlement", "Entitlement", "entitlement", <PrintCard title={entitlement.name} meta={`${entitlement.meritName} · ${entitlement.sourceCode} · p. ${entitlement.page}`}><p><b>Entitlement Touchstone:</b> {entitlementState.touchstone.name}</p><p><b>{tr("Privilégios", "Privileges")}:</b> {entitlement.privileges}</p>{activeBlessings.map((blessing) => <p key={blessing.id}><b>{blessing.name}:</b> {blessing.description}</p>)}<p><b>Curse:</b> {entitlement.curse}</p></PrintCard>);
    }
    character.merits.filter((merit) => !merit.grantedBy && ["Fae Mount", "Fae Pet"].includes(merit.name)).forEach((merit, index) => {
      const configuration = normalizeMeritConfiguration(merit.configuration);
      const animal = merit.name === "Fae Pet" ? ANIMALS.find((item) => item.id === String(configuration.animalId ?? "")) : undefined;
      const presented = animal ? animalPresentation(animal, locale) : undefined;
      const name = String(configuration.name ?? "").trim() || (merit.name === "Fae Mount" ? tr("Montaria Feérica", "Fae Mount") : tr("Mascote Feérico", "Fae Pet"));
      add("companions", tr("Companheiros", "Companions"), `fae-companion-${index}`, <PrintCard title={name} meta={`${merit.name} · ${"•".repeat(merit.dots)}`}>{presented ? <><p><b>{tr("Atributos", "Attributes")}:</b> {presented.attributes}</p><p><b>{tr("Perícias", "Skills")}:</b> {presented.skills}</p><p><b>{tr("Outras Características", "Other Traits")}:</b> {tr("Força de Vontade", "Willpower")} {presented.willpower}, {tr("Iniciativa", "Initiative")} {presented.initiative}, {tr("Defesa", "Defense")} {presented.defense}, {tr("Deslocamento", "Speed")} {presented.speed}, {tr("Tamanho", "Size")} {presented.size}, {tr("Vitalidade", "Health")} {presented.health}</p></> : <><p><b>{tr("Habilidades", "Abilities")}:</b> {stringList(configuration.abilities).join(", ")}</p><p><b>{tr("Armadura", "Armor")}:</b> {String(configuration.armor_general ?? 0)}/{String(configuration.armor_ballistic ?? 0)}</p></>}</PrintCard>);
    });
    objectList(character.current_state?.conditions).filter((item) => String(item.id) === "bonded").forEach((bonded, index) => {
      const animal = ANIMALS.find((item) => item.id === String(bonded.animalId ?? ""));
      if (!animal) return;
      const presented = animalPresentation(animal, locale);
      add("companions", tr("Companheiros", "Companions"), `bonded-${index}`, <PrintCard title={String(bonded.animalName ?? "").trim() || presented.name} meta={`Bonded · ${presented.name}`}><p><b>{tr("Atributos", "Attributes")}:</b> {presented.attributes}</p><p><b>{tr("Perícias", "Skills")}:</b> {presented.skills}</p><p><b>{tr("Outras Características", "Other Traits")}:</b> {tr("Força de Vontade", "Willpower")} {presented.willpower}, {tr("Iniciativa", "Initiative")} {presented.initiative}, {tr("Defesa", "Defense")} {presented.defense}, {tr("Deslocamento", "Speed")} {presented.speed}, {tr("Tamanho", "Size")} {presented.size}, {tr("Vitalidade", "Health")} {presented.health}</p></PrintCard>);
    });
    const notes = String(character.current_state?.notes ?? "").trim();
    add("notes", tr("Anotações", "Notes"), "notes", <PrintCard title={tr("Anotações", "Notes")}>{notes ? <p className="ctl-print-preserve-lines">{notes}</p> : <PrintTextList values={[]} minimum={8}/>}</PrintCard>);
    return blocks;
  }, [armor, character, contracts, data, equipment, expanded, kith, locale, meritCatalog, options.expandedMeritDetails, options.powerDetails, powerRating, reference, selectedConditions, tr, vehicles, weapons]);

  const [flowPageCount, setFlowPageCount] = useState(0);
  const total = 1 + flowPageCount;
  const frailties = normalizeChangelingFrailties(data.frailties, powerRating);
  const touchstoneSlots = 1 + character.merits.filter((merit) => merit.name === "Touchstone" && !merit.grantedBy).reduce((sum, merit) => sum + merit.dots, 0);
  const touchstones = cleanList(data.touchstones).length ? cleanList(data.touchstones) : cleanList([data.touchstone]);
  const experienceBeats = Math.max(0, Math.min(5, Math.trunc(Number(character.current_state?.experience_beats ?? 0) || 0)));
  return <div className="ctl-print-document">
    <PrintPage page={1} total={total} title={character.character.name} main>
      <section className="ctl-print-identity">{identity.map(([label, value]) => <PrintField key={String(label)} label={String(label)} value={value}/>)}</section>
      <SheetHeading className="ctl-print-attributes-heading">{tr("Atributos", "Attributes")}</SheetHeading>
      <div className="ctl-print-attributes">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div>
      <div className="ctl-print-main-grid">
        <section><SheetHeading>{tr("Perícias", "Skills")}</SheetHeading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.skills} specialties={character.specializations} highlightedNames={kithSkillNames} highlightTone="kith"/>)}</section>
        <section>
          <SheetHeading>{tr("Méritos", "Merits")}</SheetHeading>
          <div className="ctl-print-merits">{principalMerits.map((merit, index) => { const definition = meritCatalog.find((item) => item.name === merit.name); const name = locale === "en-US" ? definition?.name ?? merit.name : definition?.translatedName ?? merit.name; const detail = meritConfigurationTitle(merit.configuration, locale, reference.courts); return <div key={`${merit.name}-${index}`}><span>{name}{detail ? `: ${detail}` : ""}</span><DotValue value={merit.dots} max={Math.max(5, merit.dots)}/></div>; })}{Array.from({ length: Math.max(0, 6 - principalMerits.length) }, (_, index) => <div className="blank" key={`blank-merit-${index}`}><span>&nbsp;</span><DotValue value={0} max={5}/></div>)}</div>
          <SheetHeading>{tr("Corte", "Court")}</SheetHeading><div className="ctl-print-court"><strong>{courtDisplay || "\u00a0"}</strong>{court && (locale === "en-US" ? court.emotion : court.emotionPt) && <span>{locale === "en-US" ? court.emotion : court.emotionPt}</span>}</div>
          <SheetHeading>{tr("Regalias Favorecidas", "Favored Regalia")}</SheetHeading><PrintTextList values={changelingFavoredRegalia(data).map((value) => systemTerm(value, locale))} minimum={2}/>
          <SheetHeading>{tr("Fragilidades", "Frailties")}</SheetHeading><PrintTextList values={frailties.map((value) => value ? systemTerm(value, locale) : "")} minimum={frailties.length}/>
          <SheetHeading>{tr("Pedras de Contato", "Touchstones")}</SheetHeading><PrintTextList values={touchstones} minimum={Math.max(6, touchstoneSlots)}/>
        </section>
        <section>
          <SheetHeading>{tr("Vitalidade", "Health")}</SheetHeading><PrintPhysicalTrack current={health} slots={health}/>
          <SheetHeading>{tr("Força de Vontade", "Willpower")}</SheetHeading><PrintPhysicalTrack current={currentWillpower}/>
          <SheetHeading>{tr("Características da Linha", "Line Traits")}</SheetHeading><div className="ctl-print-power"><div><strong>{tr("Fado", "Wyrd")}</strong><DotValue value={powerRating} max={10}/></div><PrintWritableBoxes label="Glamour"/></div>
          <SheetHeading>{tr("Lucidez", "Clarity")}</SheetHeading><PrintPhysicalTrack current={clarity} slots={clarity} damage={clarityDamage} clarityScale/>
          <SheetHeading>{tr("Débito Goblin", "Goblin Debt")}</SheetHeading><PrintResourceTrack label={tr("Débito Goblin", "Goblin Debt")} current={Math.max(0, Math.min(10, Number(character.current_state?.goblin_debt ?? 0)))} maximum={10} numbered/>
        </section>
      </div>
      <div className="ctl-print-bottom-grid">
        <div className="ctl-print-bottom-stack">
          <section><SheetHeading>{tr("Aspirações", "Aspirations")}</SheetHeading><PrintTextList values={cleanList(data.aspirations)} minimum={3}/></section>
          <section><SheetHeading>{tr("Condições", "Conditions")}</SheetHeading><PrintTextList values={selectedConditions.map((condition) => condition.name)} minimum={3}/></section>
        </div>
        <section><SheetHeading>{tr("Experiência", "Experience")}</SheetHeading><div className="ctl-print-experience">
          <div className="ctl-print-experience-beats"><span>Beats</span><div className="ctl-print-circles">{Array.from({ length: 5 }, (_, index) => <i className={index < experienceBeats ? "filled" : ""} key={index}/>)}</div></div>
          <div><span>{tr("EXP disponível", "XP available")}</span></div>
          <div><span>{tr("EXP total", "Total XP")}</span></div>
          <div><span>{tr("EXP gasta", "XP spent")}</span></div>
        </div><SheetHeading>{tr("Outras Características", "Other Traits")}</SheetHeading><CompactValues values={otherTraits}/></section>
      </div>
    </PrintPage>
    <FlowPages blocks={flowBlocks} characterName={character.character.name} startPage={2} onReadyChange={onReadyChange} onPageCountChange={setFlowPageCount}/>
  </div>;
}
