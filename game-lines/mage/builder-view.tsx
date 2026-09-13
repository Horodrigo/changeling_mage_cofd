"use client";

import { useState } from "react";
import { Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Choice, DotRow } from "@/app/builder/common-controls";
import { MeritPicker } from "@/app/builder/merit-picker";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { SKILLS } from "@/lib/core/character/creation-rules";
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
  const { locale, tr } = useLanguage();
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
      <span>{tr("Ordem", "Order")}</span>
      <div className="kith-current order-current">
        <strong>
          {(props.order === "Orderless" ? tr("Sem Ordem", "Orderless") : props.order === "Nameless" && props.customOrder?.name ? props.customOrder.name : props.order === "Nameless" ? "Nameless" : MTA_ORDER_LABELS[props.order] ?? props.order) ||
            tr("Nenhuma selecionada", "None selected")}
        </strong>
        <p>{(props.order ? MTA_ORDER_DESCRIPTIONS[props.order]?.[locale === "pt-BR" ? 0 : 1] : "") || props.customOrder?.description || tr("Escolha uma Ordem para consultar sua descrição.", "Choose an Order to review its description.")}</p>
        {hasPublishedMageOrder(props.order) ? <small>
          <strong>{tr("Perícias de Rota", "Rote Skills")}:</strong>{" "}
          {(MTA_ORDERS[props.order as keyof typeof MTA_ORDERS] ?? []).map((skill) => builderText(locale, skill)).join(", ")}
        </small> : null}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Ordem", "Select Order")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Ordem", "Select Order")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha uma das Ordens disponíveis. Nameless permite definir uma Ordem sem nome entre as seis principais.", "Choose an available Order. Nameless lets you define an Order outside the six main Orders.")}
            </DialogDescription>
          </DialogHeader>
          <Choice
            label={tr("Ordem", "Order")}
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
              __none: tr("Selecione uma Ordem", "Select an Order"),
              ...MTA_ORDER_LABELS,
              Nameless: "Nameless",
              Orderless: tr("Sem Ordem", "Orderless"),
            }}
          />
          {props.order === "Nameless" && (
            <div className="custom-kith-editor">
              <label>
                {tr("Nome da Ordem", "Order name")}
                <Input
                  value={draft.name}
                  maxLength={80}
                  onChange={(event) =>
                    props.setCustomOrder({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <p className="nameless-order-rule">{tr("Uma Nameless Order concede High Speech e Mystery Cult Initiation • no lugar de Awakened Status •. Configure os benefícios na seção de Méritos, conforme Mage: The Awakening, p. 106.", "A Nameless Order grants High Speech and Mystery Cult Initiation • instead of Awakened Status •. Configure its benefits in the Merits section, following Mage: The Awakening, p. 106.")}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">
                {tr("Concluir", "Done")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function MageBuilderView(props: MageBuilderViewProps) {
  const { locale, tr } = useLanguage();
  const pathData = MTA_PATHS[props.path as keyof typeof MTA_PATHS];
  const neededPraxes = props.gnosis;
  const hasCreationOrderBenefits = hasPublishedMageOrder(props.order) || props.order === "Nameless";
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 3 · MAGO", "STEP 3 · MAGE")}</span>
      <h2>{tr("Modelo dos Despertos", "Awakened Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Mage the Awakening.", "The choices and limits below come from Mage the Awakening.")}</p>
      <div className="mta-template-grid">
        <div className="mta-template-column">
          <Choice
            label={tr("Caminho", "Path")}
            value={props.path}
            setValue={props.setPath}
            options={Object.keys(MTA_PATHS)}
            invalid={props.missing("path")}
          />
          <p className="path-arcana-summary">
            <span>{tr("Regentes", "Ruling")}:</span>{" "}
            <strong>{pathData?.ruling.map((arcanum) => builderText(locale, arcanum)).join(tr(" e ", " and ")) ?? tr("selecione o Caminho", "select a Path")}</strong>
            {" · "}<span>{tr("Inferior", "Inferior")}:</span>{" "}
            <strong>{pathData ? builderText(locale, pathData.inferior) : "—"}</strong>
          </p>
          <div className="ctl-favored-inline">
            <Choice
              label={tr("Atributo de Resistência (+1)", "Resistance Attribute (+1)")}
              value={props.resistanceBonus}
              setValue={props.setResistanceBonus}
              options={["Perseverança", "Vigor", "Compostura"]}
              invalid={props.missing("resistanceBonus")}
            />
          </div>
        </div>
        <div className="mta-template-column">
          <OrderSelector {...props} invalid={props.missing("order")} />
        </div>
        <div className="mta-template-column mta-virtue-vice">
          <label className={props.missing("virtue") ? "missing-field" : ""}>
            {tr("Virtude", "Virtue")}
            <Input value={props.virtue} onChange={(e) => props.setVirtue(e.target.value)} />
          </label>
          <label className={props.missing("vice") ? "missing-field" : ""}>
            {tr("Vício", "Vice")}
            <Input value={props.vice} onChange={(e) => props.setVice(e.target.value)} />
          </label>
        </div>
      </div>
      {props.powerAdvancement > 0 && <p className="rule-callout">
        <ShieldCheck /> {tr("Gnose atual", "Current Gnosis")}: <strong>{Math.min(10, props.gnosis + props.powerAdvancement)}</strong> ({props.powerAdvancement} {tr("por experiência preservados", "preserved from Experiences")})
      </p>}
      {props.order && (
        <p className="rule-callout">
          <ShieldCheck />{" "}
          {!hasPublishedMageOrder(props.order)
            ? props.order === "Orderless"
              ? tr("Sem Ordem: não recebe Alta Fala, ponto gratuito de Ocultismo ou Rotas iniciais.", "Orderless: receives no High Speech, free Occult dot, or starting Rotes.")
              : tr("A Nameless Order recebe Alta Fala e Mystery Cult Initiation • no lugar de Status de Ordem •.", "A Nameless Order receives High Speech and Mystery Cult Initiation • instead of Order Status •.")
            : tr("Membro de Ordem: recebe Alta Fala, +1 em Ocultismo (máximo 5) e três Rotas iniciais.", "Order member: receives High Speech, free Occult dot, and three starting Rotes.")}
        </p>
      )}
      <h3>{tr("Arcanos · 6 pontos", "Arcana · 6 dots")}</h3>
      <div
        className={`arcana-grid ${props.missing("arcana") ? "missing-field" : ""}`}
      >
        {ARCANA.map((item) => (
          <DotRow
            key={item}
            name={item}
            value={props.arcana[item]}
            setValue={(value: number) =>
              props.setArcana({ ...props.arcana, [item]: value })
            }
            min={0}
            max={3}
            tag={
              pathData?.ruling.includes(item as never)
                ? tr("Regente", "Ruling")
                : pathData?.inferior === item
                  ? tr("Inferior", "Inferior")
                  : undefined
            }
          />
        ))}
      </div>
      {arcanaCreationErrors(props.arcana, pathData).length > 0 && (
        <div className="rule-callout" role="alert">
          <ShieldCheck />
          <div>
            <strong>{tr("Revise a distribuição de Arcana:", "Review the Arcana distribution:")}</strong>
            <ul>
              {arcanaCreationErrors(props.arcana, pathData).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {hasCreationOrderBenefits && (
        <div className={props.missing("rotes") ? "missing-field block" : ""}>
          <SpellSelector
            title={tr("Rotas iniciais", "Starting Rotes")}
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
          title={`${tr("Práxis", "Praxes")} · ${neededPraxes}`}
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
          powerLabel={tr("Gnose inicial", "Gnosis at creation")}
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
  const { locale, tr } = useLanguage();
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
    Death: tr("Morte", "Death"), Fate: tr("Destino", "Fate"), Forces: tr("Forças", "Forces"), Life: tr("Vida", "Life"), Matter: tr("Matéria", "Matter"), Mind: tr("Mente", "Mind"), Prime: tr("Primórdio", "Prime"), Space: tr("Espaço", "Space"), Spirit: tr("Espírito", "Spirit"), Time: tr("Tempo", "Time"),
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
      <article
        className={selected ? "merit-option selected" : "merit-option"}
        key={spell.id}
      >
        <div>
          <strong>{spellName(spell)}</strong>
          <small>{arcanaSource(spell)}</small>
          <p className="rule-detail"><strong>{tr("Prática","Practice")}:</strong> {spell.practice} | <strong>{tr("Fator Primário","Primary Factor")}:</strong> {spell.primaryFactor}</p>
          {spell.withstand && <p className="rule-detail"><strong>{tr("Resistência", "Withstand")}:</strong> {spell.withstand}</p>}
          {rote && spell.roteSkills.length > 0 && <p className="rule-detail"><strong>{tr("Perícia de Rota", "Rote Skill")}:</strong> {spell.roteSkills.join(", ")}</p>}
          <p className="rule-detail">
            <strong>{tr("Resumo", "Summary")}:</strong> {spellSummary(spell)}
          </p>
          {spellReach(spell) && <p className="rule-detail"><strong>Reach:</strong> {spellReach(spell)}</p>}
        </div>
        <Checkbox className="catalog-selection-checkbox" checked={selected} disabled={!selected && full} aria-label={spellName(spell)} onCheckedChange={() => toggle(spell)} />
      </article>
    );
  };
  return (
    <>
      <div className="merit-heading">
        <div>
          <h3>{title}</h3>
          <p>
            {tr("Escolha no catálogo de feitiços. Expanda uma escolha para consultar os detalhes.", "Choose from the spell catalog. Expand a choice to inspect its details.")}
          </p>
        </div>
        <div className="merit-heading-actions">
          <Badge variant="outline">{values.slice(0, count).filter(Boolean).length}/{count}</Badge>
          <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>
            <Plus /> {tr("Selecionar", "Select")} {rote ? tr("Rotas", "Rotes") : tr("Práxis", "Praxes")}
          </Button>
        </div>
      </div>
      <div className="contract-power-list creation-contract-list creation-spell-list">
        {Array.from({ length: count }, (_, index) => {
          const item = values[index];
          if (!item) return <article className="creation-contract-empty" key={index}><Badge variant={rote ? "secondary" : "outline"}>{rote ? tr("Rota", "Rote") : tr("Práxis", "Praxis")}</Badge><div><strong>{tr("Vaga disponível", "Available slot")}</strong><small>{tr("Escolha no catálogo", "Choose from the catalog")}</small></div></article>;
          return (
            <details className="contract-power-card" key={`${item.id}-${index}`}>
              <summary className="contract-power-summary"><strong>{spellName(item)}</strong><span className="spell-card-actions"><Badge variant={rote ? "secondary" : "outline"}>{rote ? tr("Rota", "Rote") : tr("Práxis", "Praxis")}</Badge><Button type="button" variant="ghost" size="sm" onClick={(event) => { event.preventDefault(); event.stopPropagation(); remove(index); }}><Trash2 /> {tr("Remover", "Remove")}</Button></span><small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{tr("Prática","Practice")}:</strong> {item.practice} | <strong>{tr("Fator Primário","Primary Factor")}:</strong> {item.primaryFactor}</span>{item.withstand && <span className="spell-card-rule-line"><strong>{tr("Resistência", "Withstand")}:</strong> {item.withstand}</span>}{rote && item.roteSkills.length > 0 && <span className="collapsed-rote-skill" onClick={(event)=>event.stopPropagation()} onKeyDown={(event)=>event.stopPropagation()}><Choice label={tr("Perícia de Rota", "Rote Skill")} value={item.roteSkill ?? item.roteSkills[0]} setValue={(value) => { const next = [...values]; next[index] = { ...item, roteSkill: value }; setValues(next); }} options={item.roteSkills}/></span>}</summary>
              <div className="contract-power-details">
                <dl>
                  <div><dt>{tr("Resumo", "Summary")}</dt><dd>{spellSummary(item)}</dd></div>
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
            <DialogTitle>{tr("Catálogo de feitiços", "Spell catalog")}</DialogTitle>
            <DialogDescription>
              {tr("Feitiços organizados por Arcano e nível de maestria.", "Spells grouped by Arcanum and mastery level.")}
            </DialogDescription>
          </DialogHeader>
          <div className="catalog-filters spell-catalog-filters">
            <label className="merit-search"><Search /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr("Buscar feitiço, Arcano ou fonte…", "Search spell, Arcanum, or source…")}/></label>
            <Choice value={arcanaFilter} setValue={setArcanaFilter} options={["__all",...Object.keys(arcanaLabels)]} optionLabels={{__all:tr("Todos os Arcanos","All Arcana"),...arcanaLabels}} />
            <Choice value={levelFilter} setValue={setLevelFilter} options={["__all","1","2","3","4","5"]} optionLabels={{__all:tr("Todos os níveis","All levels"),...Object.fromEntries([1,2,3,4,5].map(level=>[String(level),`${tr("Nível","Level")} ${level}`]))}} />
            <Choice value={sourceFilter} setValue={setSourceFilter} options={["__all",...new Set(catalog.map(spell=>spell.sourceId))]} optionLabels={{__all:tr("Todas as fontes","All sources"),...Object.fromEntries(catalog.map(spell=>[spell.sourceId,spell.source]))}} />
            <Choice value={practiceFilter} setValue={setPracticeFilter} options={["__all",...new Set(catalog.map(spell=>spell.practice))]} optionLabels={{__all:tr("Todas as Práticas","All Practices")}} />
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
              <Button type="button" size="sm" className="catalog-dialog-done">{tr("Concluir", "Done")}</Button>
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
