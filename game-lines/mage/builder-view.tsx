"use client";

import { useState } from "react";
import { Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Choice, DotRow } from "@/app/builder/common-controls";
import { MeritPicker } from "@/app/builder/merit-picker";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { ARCANA, MTA_ORDERS, MTA_ORDER_DESCRIPTIONS, MTA_ORDER_LABELS, MTA_PATHS } from "./creation-rules";
import { arcanaCreationErrors, meetsArcanaRequirements } from "./builder-eligibility";
import type { SpellDefinition } from "@/lib/catalog/spell-catalog";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { hasPublishedMageOrder } from "@/lib/mage-orders";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { MAGE_MERIT_CONFIGURATIONS } from "@/lib/mage-merit-configurations";
import type { MeritDefinition, MeritPrerequisiteContext } from "@/lib/merits";
import { alphabetical } from "@/lib/option-order";
import { useLanguage } from "@/lib/i18n";
import { builderText } from "@/app/character-builder-messages";
import { SelectableCatalogCard } from "@/app/selectable-catalog-card";
import { MageStructuredMeritEditor } from "./merit-configuration-editor";

export type SpellSelection = SpellDefinition & { roteSkill?: string };
export type CustomOrderDefinition = { name: string; description: string; roteSkills: string[]; initiation?: MeritConfiguration };
type Setter<T> = (value: T) => void;
type MissingCheck = (key: string) => boolean;
type OrderSelectorProps = { order: string; setOrder: Setter<string>; customOrder: CustomOrderDefinition | null; setCustomOrder: Setter<CustomOrderDefinition | null>; orderCatalog?: CustomOrderDefinition[]; invalid?: boolean };
export type MageBuilderViewProps = {
  path: string; setPath: Setter<string>; order: string; customOrder: CustomOrderDefinition | null; setCustomOrder: Setter<CustomOrderDefinition | null>; setOrder: Setter<string>; orderCatalog?: CustomOrderDefinition[];
  gnosis: number; setGnosis: Setter<number>; maximumPowerFromMerits: number; powerAdvancement: number; virtue: string; setVirtue: Setter<string>; vice: string; setVice: Setter<string>;
  resistanceBonus: string; setResistanceBonus: Setter<string>; nimbus: string; setNimbus: Setter<string>; tool: string; setTool: Setter<string>;
  arcana: Record<string, number>; setArcana: Setter<Record<string, number>>; rotes: Array<SpellSelection | null>; setRotes: Setter<Array<SpellSelection | null>>;
  praxes: Array<SpellSelection | null>; setPraxes: Setter<Array<SpellSelection | null>>; spellCatalog: SpellDefinition[];
  aspirations: string[]; setAspirations: Setter<string[]>; meritContext: MeritPrerequisiteContext; meritCatalog: MeritDefinition[]; merits: MeritSelection[]; setMerits: Setter<MeritSelection[]>;
  meritSpent: number; meritBudget: number; missing: MissingCheck;
};
const MAGE_BUILDER_MERIT_CONFIGURATIONS = [...COMMON_MERIT_CONFIGURATIONS, ...MAGE_MERIT_CONFIGURATIONS];

function OrderSelector(props: OrderSelectorProps) {
  const { locale, t } = useLanguage();
  const saved = props.orderCatalog ?? [];
  const draft: CustomOrderDefinition = props.customOrder ?? {
    name: "",
    description: "",
    roteSkills: ["", "", ""],
    initiation: {},
  };
  const select = (name: string) => {
    const custom = name === "Nameless"
      ? (props.order === "Nameless" ? props.customOrder : null) ?? { name: "", description: "An Order without a recognized name among the great societies of the Awakened.", roteSkills: ["", "", ""], initiation: {} }
      : saved.find((item) => item.name === name) ?? null;
    props.setOrder(name);
    props.setCustomOrder(custom);
  };
  return (
    <div className={`kith-field ${props.invalid ? "missing-field" : ""}`}>
      <span>{t("ui.order")}</span>
      <div className="kith-current order-current">
        <strong>
          {(props.order === "Orderless" ? t("ui.orderless") : props.order === "Nameless" && props.customOrder?.name ? props.customOrder.name : props.order === "Nameless" ? "Nameless" : MTA_ORDER_LABELS[props.order] ?? props.order) ||
            t("ui.noneSelected")}
        </strong>
        <p>{(props.order ? MTA_ORDER_DESCRIPTIONS[props.order]?.[locale === "pt-BR" ? 0 : 1] : "") || props.customOrder?.description || t("ui.chooseAnOrderToReviewItsDescription")}</p>
        {hasPublishedMageOrder(props.order) ? <small>
          <strong>{t("ui.roteSkills")}:</strong>{" "}
          {(MTA_ORDERS[props.order as keyof typeof MTA_ORDERS] ?? []).map((skill) => builderText(locale, skill)).join(", ")}
        </small> : null}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {t("ui.selectOrder")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.selectOrder")}</DialogTitle>
            <DialogDescription>
              {t("ui.chooseAnAvailableOrderNamelessLetsYouDefine")}
            </DialogDescription>
          </DialogHeader>
          <Choice
            label={t("ui.order")}
            value={props.order || "__none"}
            setValue={(value: string) =>
              select(value === "__none" ? "Orderless" : value)
            }
            options={[
              "__none",
              "Orderless",
              ...Object.keys(MTA_ORDERS),
              ...saved.map((item) => item.name),
            ]}
            optionLabels={{
              __none: t("ui.selectAnOrder"),
              ...MTA_ORDER_LABELS,
              Nameless: "Nameless",
              Orderless: t("ui.orderless"),
            }}
          />
          {props.order === "Nameless" && (
            <div className="custom-kith-editor">
              <label>
                {t("ui.orderName")}
                <Input
                  value={draft.name}
                  maxLength={80}
                  onChange={(event) =>
                    props.setCustomOrder({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <p className="nameless-order-rule">{t("ui.aNamelessOrderGrantsHighSpeechAndMystery")}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">
                {t("ui.done")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function MageBuilderView(props: MageBuilderViewProps) {
  const { locale, t } = useLanguage();
  const pathData = MTA_PATHS[props.path as keyof typeof MTA_PATHS];
  const neededPraxes = props.gnosis;
  const hasCreationOrderBenefits = hasPublishedMageOrder(props.order) || props.order === "Nameless";
  return (
    <div className="builder-section">
      <span className="kicker">{t("ui.step3MAGE")}</span>
      <h2>{t("ui.awakenedTemplate")}</h2>
      <p>{t("ui.theChoicesAndLimitsBelowComeFromMage")}</p>
      <div className="mta-template-grid">
        <div className="mta-template-column">
          <Choice
            label={t("ui.path")}
            value={props.path}
            setValue={props.setPath}
            options={Object.keys(MTA_PATHS)}
            invalid={props.missing("path")}
          />
          <p className="path-arcana-summary">
            <span>{t("ui.rulinge76e13")}:</span>{" "}
            <strong>{pathData?.ruling.map((arcanum) => builderText(locale, arcanum)).join(t("ui.and")) ?? t("ui.selectAPath")}</strong>
            {" · "}<span>{t("ui.inferior")}:</span>{" "}
            <strong>{pathData ? builderText(locale, pathData.inferior) : "—"}</strong>
          </p>
          <div className="ctl-favored-inline">
            <Choice
              label={t("ui.resistanceAttribute1")}
              value={props.resistanceBonus}
              setValue={props.setResistanceBonus}
              options={["Resolve", "Stamina", "Composure"]}
              invalid={props.missing("resistanceBonus")}
            />
          </div>
        </div>
        <div className="mta-template-column">
          <OrderSelector {...props} invalid={props.missing("order")} />
        </div>
        <div className="mta-template-column mta-virtue-vice">
          <label className={props.missing("virtue") ? "missing-field" : ""}>
            {t("ui.virtue")}
            <Input value={props.virtue} onChange={(e) => props.setVirtue(e.target.value)} />
          </label>
          <label className={props.missing("vice") ? "missing-field" : ""}>
            {t("ui.vice")}
            <Input value={props.vice} onChange={(e) => props.setVice(e.target.value)} />
          </label>
        </div>
      </div>
      {props.powerAdvancement > 0 && <p className="rule-callout">
        <ShieldCheck /> {t("ui.currentGnosis")}: <strong>{Math.min(10, props.gnosis + props.powerAdvancement)}</strong> ({props.powerAdvancement} {t("ui.preservedFromExperiences")})
      </p>}
      {props.order && (
        <p className="rule-callout">
          <ShieldCheck />{" "}
          {!hasPublishedMageOrder(props.order)
            ? props.order === "Orderless"
              ? t("ui.orderlessReceivesNoHighSpeechFreeOccultDot")
              : t("ui.aNamelessOrderReceivesHighSpeechAndMystery")
            : t("ui.orderMemberReceivesHighSpeechFreeOccultDot")}
        </p>
      )}
      <h3>{t("ui.arcana6Dots")}</h3>
      <div
        className={`arcana-grid ${props.missing("arcana") ? "missing-field" : ""}`}
      >
        {ARCANA.map((item) => (
          <DotRow
            key={item}
            name={item}
            value={props.arcana[item] ?? 0}
            setValue={(value: number) =>
              props.setArcana({ ...props.arcana, [item]: value })
            }
            min={0}
            max={3}
            tag={
              pathData?.ruling.includes(item as never)
                ? t("ui.ruling")
                : pathData?.inferior === item
                  ? t("ui.inferior")
                  : undefined
            }
          />
        ))}
      </div>
      {arcanaCreationErrors(props.arcana, pathData, locale).length > 0 && (
        <div className="rule-callout" role="alert">
          <ShieldCheck />
          <div>
            <strong>{t("ui.reviewTheArcanaDistribution")}</strong>
            <ul>
              {arcanaCreationErrors(props.arcana, pathData, locale).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {hasCreationOrderBenefits && (
        <div className={props.missing("rotes") ? "missing-field block" : ""}>
          <SpellSelector
            title={t("ui.startingRotes")}
            count={3}
            values={props.rotes}
            setValues={props.setRotes}
            rote
            arcana={props.arcana}
            catalog={props.spellCatalog}
          />
        </div>
      )}
      <div className={props.missing("praxes") ? "missing-field block" : ""}>
        <SpellSelector
          title={`${t("ui.praxes")} · ${neededPraxes}`}
          count={neededPraxes}
          values={props.praxes}
          setValues={props.setPraxes}
          arcana={props.arcana}
          catalog={props.spellCatalog}
        />
      </div>
      <div className={props.missing("merits") ? "missing-field block" : ""}>
        <MeritPicker
          merits={props.merits}
          setMerits={props.setMerits}
          catalog={props.meritCatalog}
          context={props.meritContext}
          spent={props.meritSpent}
          budget={props.meritBudget}
          powerLabel={t("ui.gnosisAtCreation")}
          power={props.gnosis}
          setPower={props.setGnosis}
          isInlineConfiguration={(name) => isCommonInlineMeritConfiguration(name) || Boolean(MAGE_MERIT_CONFIGURATIONS.find((item) => item.name === name && item.fields.length === 1 && item.fields[0].kind === "text"))}
          renderConfiguration={({ merit, ownedMerits, inline, onChange }) => (
            <MeritConfigurationEditor merit={merit} ownedMerits={ownedMerits} inline={inline} onChange={onChange} catalog={props.meritCatalog} definitions={MAGE_BUILDER_MERIT_CONFIGURATIONS} renderStructured={(editorProps) => <MageStructuredMeritEditor {...editorProps} />} />
          )}
        />
      </div>
    </div>
  );
}

function SpellSelector({
  title,
  count,
  values,
  setValues,
  rote = false,
  arcana,
  catalog,
}: {
  title: string;
  count: number;
  values: Array<SpellSelection | null>;
  setValues: (value: Array<SpellSelection | null>) => void;
  rote?: boolean;
  arcana: Record<string, number>;
  catalog: SpellDefinition[];
}) {
  const { locale, t } = useLanguage();
  const spellName = (spell: SpellDefinition) => locale === "pt-BR" ? spell.name : (spell.originalName || spell.name);
  const [search, setSearch] = useState("");
  const [arcanaFilter, setArcanaFilter] = useState("__all");
  const [levelFilter, setLevelFilter] = useState("__all");
  const [sourceFilter, setSourceFilter] = useState("__all");
  const [practiceFilter, setPracticeFilter] = useState("__all");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const normalized = search.toLocaleLowerCase("pt-BR");
  const selectedIds = values.filter(Boolean).map((item) => item!.id);
  const filtered = alphabetical(catalog, spellName,locale).filter(
    (spell) =>
      meetsArcanaRequirements(spell.requirements, arcana) &&
      (arcanaFilter === "__all" || Object.hasOwn(spell.requirements, arcanaFilter)) &&
      (levelFilter === "__all" || Object.values(spell.requirements).includes(Number(levelFilter))) &&
      (sourceFilter === "__all" || spell.sourceId === sourceFilter) &&
      (practiceFilter === "__all" || spell.practice === practiceFilter) &&
      (!normalized ||
        `${spell.name} ${spell.originalName} ${spell.source} ${Object.keys(spell.requirements).join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized)),
  );
  const choose = (spell: SpellDefinition) => {
    const slot = values.findIndex((item, index) => index < count && !item);
    if (slot < 0) return;
    const next = [...values];
    next[slot] = { ...spell, roteSkill: rote ? "" : undefined };
    setValues(next);
  };
  const remove = (index: number) => {
    const next = [...values];
    next[index] = null;
    setValues(next);
  };
  const toggle = (spell: SpellDefinition) => {
    const selectedIndex = values.findIndex((item) => item?.id === spell.id);
    if (selectedIndex >= 0) {
      remove(selectedIndex);
      return;
    }
    choose(spell);
  };
  const arcanaLabels: Record<string, string> = {
    Death: t("ui.death"), Fate: t("ui.fate"), Forces: t("ui.forces"), Life: t("ui.life"), Matter: t("ui.matter"), Mind: t("ui.mind"), Prime: t("ui.prime"), Space: t("ui.space"), Spirit: t("ui.spirit"), Time: t("ui.time"),
  };
  const arcanaSource = (spell: SpellDefinition) =>
    `${Object.entries(spell.requirements).map(([name,dots])=>`${arcanaLabels[name]??name} ${"•".repeat(dots)}`).join(" + ")} · ${spell.source} · p. ${spell.page || "—"}`;
  const groups = new Map<string, SpellDefinition[]>();
  for (const spell of filtered) {
    const entries = Object.entries(spell.requirements).sort(
      (a, b) => b[1] - a[1],
    );
    const [arcana, level] = entries[0] ?? ["Outro", 0];
    const key = `${arcanaLabels[arcana] ?? arcana} ${level}`;
    groups.set(key, [...(groups.get(key) ?? []), spell]);
  }
  const option = (spell: SpellDefinition) => {
    const selected = selectedIds.includes(spell.id),
      full = values.slice(0, count).every(Boolean);
    return (
      <SelectableCatalogCard
        className="merit-option"
        key={spell.id}
        selected={selected}
        disabled={!selected && full}
        label={spellName(spell)}
        onToggle={() => toggle(spell)}
      >
        <div>
          <strong>{spellName(spell)}</strong>
          <small>{arcanaSource(spell)}</small>
          <p className="rule-detail"><strong>{t("ui.practice")}:</strong> {spell.practice} | <strong>{t("ui.primaryFactor")}:</strong> {spell.primaryFactor}</p>
          {spell.withstand && <p className="rule-detail"><strong>{t("ui.withstand")}:</strong> {spell.withstand}</p>}
          {rote && spell.roteSkills.length > 0 && <p className="rule-detail"><strong>{t("ui.roteSkill")}:</strong> {spell.roteSkills.join(", ")}</p>}
          <p className="rule-detail">
            <strong>{t("ui.summary")}:</strong> {spellSummary(spell)}
          </p>
          {spellReach(spell) && <p className="rule-detail"><strong>Reach:</strong> {spellReach(spell)}</p>}
        </div>
      </SelectableCatalogCard>
    );
  };
  return (
    <>
      <div className="merit-heading">
        <div>
          <h3>{title}</h3>
          <p>
            {t("ui.chooseFromTheSpellCatalogExpandAChoice")}
          </p>
        </div>
        <div className="merit-heading-actions">
          <Badge variant="outline">{values.slice(0, count).filter(Boolean).length}/{count}</Badge>
          <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>
            <Plus /> {t("ui.select198f7a")} {rote ? t("ui.rotes") : t("ui.praxes")}
          </Button>
        </div>
      </div>
      <div className="contract-power-list creation-contract-list creation-spell-list">
        {Array.from({ length: count }, (_, index) => {
          const item = values[index];
          if (!item) return <article className="creation-contract-empty" key={index}><Badge variant={rote ? "secondary" : "outline"}>{rote ? t("ui.rote") : t("ui.praxis")}</Badge><div><strong>{t("ui.availableSlot")}</strong><small>{t("ui.chooseFromTheCatalog")}</small></div></article>;
          return (
            <details className="contract-power-card" key={`${item.id}-${index}`}>
              <summary className="contract-power-summary"><strong>{spellName(item)}</strong><span className="spell-card-actions"><Badge variant={rote ? "secondary" : "outline"}>{rote ? t("ui.rote") : t("ui.praxis")}</Badge><Button type="button" variant="ghost" size="sm" onClick={(event) => { event.preventDefault(); event.stopPropagation(); remove(index); }}><Trash2 /> {t("ui.remove7d41cc")}</Button></span><small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{t("ui.practice")}:</strong> {item.practice} | <strong>{t("ui.primaryFactor")}:</strong> {item.primaryFactor}</span>{item.withstand && <span className="spell-card-rule-line"><strong>{t("ui.withstand")}:</strong> {item.withstand}</span>}{rote && item.roteSkills.length > 0 && <span className="collapsed-rote-skill" onClick={(event)=>event.stopPropagation()} onKeyDown={(event)=>event.stopPropagation()}><Choice label={t("ui.roteSkill")} value={item.roteSkill ?? item.roteSkills[0]} setValue={(value) => { const next = [...values]; next[index] = { ...item, roteSkill: value }; setValues(next); }} options={item.roteSkills}/></span>}</summary>
              <div className="contract-power-details">
                <dl>
                  <div><dt>{t("ui.summary")}</dt><dd>{spellSummary(item)}</dd></div>
                  {spellReach(item) && <div><dt>Reach</dt><dd>{spellReach(item)}</dd></div>}
                </dl>
              </div>
            </details>
          );
        })}
      </div>
      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.spellCatalog")}</DialogTitle>
            <DialogDescription>
              {t("ui.spellsGroupedByArcanumAndMasteryLevel")}
            </DialogDescription>
          </DialogHeader>
          <div className="catalog-filters spell-catalog-filters">
            <label className="merit-search"><Search /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("ui.searchSpellArcanumOrSource")}/></label>
            <Choice value={arcanaFilter} setValue={setArcanaFilter} options={["__all",...Object.keys(arcanaLabels)]} optionLabels={{__all:t("ui.allArcana"),...arcanaLabels}} />
            <Choice value={levelFilter} setValue={setLevelFilter} options={["__all","1","2","3","4","5"]} optionLabels={{__all:t("ui.allLevels"),...Object.fromEntries([1,2,3,4,5].map(level=>[String(level),`${t("ui.level")} ${level}`]))}} />
            <Choice value={sourceFilter} setValue={setSourceFilter} options={["__all",...new Set(catalog.map(spell=>spell.sourceId))]} optionLabels={{__all:t("ui.allSources729d47"),...Object.fromEntries(catalog.map(spell=>[spell.sourceId,spell.source]))}} />
            <Choice value={practiceFilter} setValue={setPracticeFilter} options={["__all",...new Set(catalog.map(spell=>spell.practice))]} optionLabels={{__all:t("ui.allPractices")}} />
          </div>
          <div className="merit-catalog spell-groups">
            {Array.from(groups.entries())
              .sort(([a], [b]) =>
                a.localeCompare(b, locale, { numeric: true }),
              )
              .map(([group, spells]) => (
                <section className="merit-category" key={group}>
                  <h3>
                    {group} <Badge variant="outline">{spells.length}</Badge>
                  </h3>
                  <div>{spells.map(option)}</div>
                </section>
              ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



function spellSummary(spell: SpellDefinition) {
  if (spell.summary?.trim()) return spell.summary.trim();
  const description = spell.description?.trim() || "Descrição não disponível.";
  return description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || description;
}

function spellReach(spell: SpellDefinition) {
  const description = spell.description?.trim() ?? "";
  const firstReach = description.search(/(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:/i);
  if (firstReach < 0) return "";
  return description.slice(firstReach).replace(/\s+(?=(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:)/gi, " · ");
}
