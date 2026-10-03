"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import { translate, useLanguage, type Locale } from "@/lib/i18n";
import { meritPrerequisitesMet, meritRatingsFor, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { alphabetical, compareOptionLabels } from "@/lib/option-order";
import { RuleSelect } from "./rule-select";
import { systemTerm } from "@/lib/system-terms";
import { MeritCatalogVisibilityToggle } from "../merit-catalog-visibility-toggle";
import { homebrewCategoryKeys } from "@/lib/homebrew";
import { SelectableCatalogCard } from "../selectable-catalog-card";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import { meritPresentation } from "@/lib/merit-presentation";
import { meritCategoryLabel } from "@/lib/merit-ui";
import { meritMatchesDefinition } from "@/lib/merit-identity";

export type ExperiencePurchaseGroup<T extends string> = {
  group: "core" | "supernatural" | "integrity" | "acquired";
  purchases: readonly T[];
};

const EXPERIENCE_GROUP_LABELS = {
  core: "ui.experienceGroupCore",
  supernatural: "ui.experienceGroupSupernatural",
  integrity: "ui.experienceGroupIntegrity",
  acquired: "ui.experienceGroupAcquired",
} as const;

export function groupedPurchaseOptions<T extends string>(groups: readonly ExperiencePurchaseGroup<T>[], label: (value: T) => string, locale: Locale) {
  return groups.flatMap(({ group, purchases }) => purchases.map((value) => ({ value, label: label(value), group: translate(locale, EXPERIENCE_GROUP_LABELS[group]) })));
}

export function experiencePurchaseBalances(available: number, spent: number, total: number, cost: number, builderMode = false) {
  const nextAvailable = builderMode ? available : available - cost;
  const nextSpent = spent + cost;
  return { available: nextAvailable, spent: nextSpent, total: builderMode ? Math.max(total, available + spent) + cost : Math.max(total, nextAvailable + nextSpent) };
}

export function convertFifthBeat(value: number, available: number, total: number) {
  const gained = value === 5 ? 1 : 0;
  return { beats: gained ? 0 : value, available: available + gained, total: total + gained };
}

export function BeatTrack({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="beat-resource">
      <span>{label}</span>
      <div
        className="resource-track"
        role="group"
        aria-label={t("ui.of5", { p1: label, p2: value })}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={t("ui.setTo", { p1: label, p2: index < value ? index : index + 1 })}
          />
        ))}
      </div>
    </div>
  );
}

export function ratingPurchaseCost(current: number, target: number, costForDot: number | ((rating: number) => number)) {
  let total = 0;
  for (let rating = current + 1; rating <= target; rating += 1)
    total += typeof costForDot === "number" ? costForDot : costForDot(rating);
  return total;
}

export function ExperienceRatingPicker({ current, maximum, value, onChange }: { current: number; maximum: number; value: number; onChange: (value: number) => void }) {
  const { t } = useLanguage();
  const options = Array.from({ length: Math.max(0, maximum - current) }, (_, index) => current + index + 1);
  return <div className="experience-rating-picker">
    <span><b>{t("ui.current")}:</b> {current}</span>
    <label><span>{t("ui.intended")}</span><RuleSelect value={String(value)} onChange={(next) => onChange(Number(next))} options={options.map((rating) => ({ value: String(rating), label: String(rating) }))} /></label>
  </div>;
}
type ExperienceCatalogItem = {
  id: string;
  name: string;
  category: string;
  categories?: string[];
  secondaryCategory?: string;
  sortPriority?: number;
  description: string;
  meta: string;
  disabled?: boolean;
  details?: Array<{ label: string; value: string; warning?: boolean }>;
  footerDetails?: Array<{ label: string; value: string; warning?: boolean }>;
  descriptionAfterDetails?: boolean;
  levels?: Array<{ label: string; value: string }>;
};

export function ExperiencePowerPicker({
  kind,
  items,
  selectedId,
  onSelect,
  compact = false,
  line,
  triggerLabel,
  dialogTitle,
  dialogDescription,
  categoryOptions,
}: {
  kind: "Contrato" | "Rota" | "Práxis" | "Feitiço" | "Benefício de Contrato" | "Disciplina" | "Devoção" | "Lash";
  items: ExperienceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
  line?: PersistedGameLineId;
  triggerLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  categoryOptions?: string[];
}) {
  const { locale, t }=useLanguage();
  const kindLabel=kind==="Práxis"?t("ui.praxis"):systemTerm(kind,locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [secondary, setSecondary] = useState("Todos");
  const normalized = search.trim().toLocaleLowerCase("pt-BR");
  const selected = items.find((item) => item.id === selectedId);
  const categories = ["Todas", ...new Set(categoryOptions ?? items.flatMap((item) => item.categories ?? [item.category]))];
  const secondaryCategories = [
    "Todos",
    ...new Set(items.map((item) => item.secondaryCategory).filter(Boolean)),
  ] as string[];
  const visible = alphabetical(items, item => item.name,locale)
    .sort((left, right) => (left.sortPriority ?? 0) - (right.sortPriority ?? 0))
    .filter(
    (item) =>
      (category === "Todas" || (item.categories ?? [item.category]).includes(category)) &&
      (secondary === "Todos" || item.secondaryCategory === secondary) &&
      (!normalized ||
        `${item.name} ${(item.categories ?? [item.category]).join(" ")} ${item.secondaryCategory ?? ""} ${item.description} ${item.meta} ${[...(item.details ?? []), ...(item.footerDetails ?? [])].map(({ label, value }) => `${label} ${value}`).join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized)),
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={compact ? "builder-add-action catalog-selection-action" : "experience-merit-trigger catalog-selection-action"}>
          <span>{selected?.name ?? triggerLabel ?? `${t("ui.select198f7a")} ${kindLabel}`}</span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className={`merit-dialog experience-merit-dialog${line === "CtL" ? " ctl-dialog" : ""}`}>
        <DialogHeader>
          <DialogTitle>{dialogTitle ?? `${t("ui.purchase")} ${kindLabel}`}</DialogTitle>
          <DialogDescription>
            {dialogDescription ?? t("ui.theCatalogOnlyShowsOptionsAvailableToThis")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`${t("ui.search")} ${kindLabel.toLocaleLowerCase(locale)}, ${t("ui.sourceOrDescription")}`}
            />
          </label>
          {categories.length > 2 && (
            <RuleSelect
              value={category}
              onChange={setCategory}
              options={categories.map((value) => ({ value, label: value }))}
            />
          )}
          {secondaryCategories.length > 2 && (
            <RuleSelect
              value={secondary}
              onChange={setSecondary}
              options={secondaryCategories.map((value) => ({ value, label: value }))}
            />
          )}
        </div>
        <div className="experience-merit-catalog">
          {visible.map((item) => (
            <SelectableCatalogCard
              key={item.id}
              selected={selectedId === item.id}
              disabled={item.disabled}
              className={item.disabled ? "merit-option-locked" : ""}
              label={`${t("ui.select198f7a")} ${item.name}`}
              onToggle={() => onSelect(selectedId === item.id ? "" : item.id)}
            >
              <div>
                <strong>{item.name}</strong>
                <small>{item.meta}</small>
                {!item.descriptionAfterDetails && <p>{item.description}</p>}
                {item.details?.map(({ label, value, warning }) => <p className={warning ? "merit-prerequisites-missing" : undefined} key={`${label}-${value}`}><strong>{label}:</strong> {value}</p>)}
                {item.descriptionAfterDetails && <p>{item.description}</p>}
                {item.footerDetails?.map(({ label, value, warning }) => <p className={warning ? "merit-prerequisites-missing" : undefined} key={`${label}-${value}`}><strong>{label}:</strong> {value}</p>)}
                {item.levels?.map(({ label, value }) => <details key={label} onClick={(event) => event.stopPropagation()}><summary><strong>{label}</strong></summary><p>{value}</p></details>)}
              </div>
            </SelectableCatalogCard>
          ))}
          {!visible.length && <em>{t("ui.noOptionsMatchTheFilters")}</em>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ExperienceMeritPicker({
  line,
  context,
  meritCatalog,
  character,
  selectedId,
  targetDots,
  onSelect,
  isEligible = meritPrerequisitesMet,
  canAdvanceGrant = () => false,
  categoryFor = (definition) => definition.category,
}: {
  line: PersistedGameLineId;
  context: MeritPrerequisiteContext;
  meritCatalog: readonly MeritDefinition[];
  character: CharacterSheet;
  selectedId: string;
  targetDots: number;
  onSelect: (id: string, dots: number, instanceIndex: number) => void;
  isEligible?: (definition: MeritDefinition, context: MeritPrerequisiteContext) => boolean;
  canAdvanceGrant?: (merit: CharacterSheet["merits"][number]) => boolean;
  categoryFor?: (definition: MeritDefinition) => string;
}) {
  const { locale, t }=useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showAllMerits, setShowAllMerits] = useState(false);
  const [meritDrafts, setMeritDrafts] = useState<Record<string,{newInstance:boolean;instanceIndex:number;dots:number}>>({});
  const meritName=(item:MeritDefinition)=>meritPresentation(item,locale).name;
  const categoryName=(value:string)=>meritCategoryLabel(value,locale);
  const categoryKeys=(item:MeritDefinition)=>homebrewCategoryKeys(categoryFor(item),item.sourceId);
  const catalog = alphabetical([...meritCatalog], meritName,locale),
    selected = catalog.find((item) => item.id === selectedId),
    normalized = search.toLocaleLowerCase(locale),
    categories = ["all", ...[...new Set(catalog.flatMap(categoryKeys))].sort((left,right)=>compareOptionLabels(categoryName(left),categoryName(right),locale))];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="experience-merit-trigger catalog-selection-action"
        >
          <span>
            {selected
              ? `${meritName(selected)} ${targetDots}`
              : t("ui.selectMeritAndDots")}
          </span>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className={`merit-dialog experience-merit-dialog${line === "CtL" ? " ctl-dialog" : ""}`}>
        <DialogHeader>
          <DialogTitle>{t("ui.purchaseMerit")}</DialogTitle>
          <DialogDescription>
            {t("ui.chooseTheMeritAndNumberOfDotsFor")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("ui.searchByNameDescriptionPrerequisiteOrSource")}
            />
          </label>
          <RuleSelect
            value={category}
            onChange={setCategory}
            options={categories.map((value) => ({ value, label: value === "all" ? t("ui.allCategories") : categoryName(value) }))}
          />
          <MeritCatalogVisibilityToggle showAll={showAllMerits} setShowAll={setShowAllMerits} />
        </div>
        <div className="experience-merit-catalog">
          {catalog
            .filter(
              (item) =>
                (showAllMerits || isEligible(item, context)) &&
                (category === "all" || categoryKeys(item).includes(category)) &&
                `${meritName(item)} ${item.name} ${meritPresentation(item, locale, meritCatalog).description} ${meritPresentation(item, locale, meritCatalog).prerequisites ?? ""} ${item.source} ${categoryKeys(item).join(" ")}`
                  .toLocaleLowerCase(locale)
                  .includes(normalized),
            )
            .map((item) => {
              const presented = meritPresentation(item, locale, meritCatalog);
              const instances = character.merits
                  .map((owned, index) => ({ owned, index }))
                  .filter(
                    ({ owned }) =>
                      meritMatchesDefinition(owned, item, meritCatalog) &&
                      (!owned.grantedBy || canAdvanceGrant(owned)),
                  ),
                repeatable = isRepeatableDefinition(item),
                ratings = item.unbounded
                ? meritRatingsFor(
                    item,
                    Math.max(1, ...instances.map(({ owned }) => owned.dots + 1)),
                  )
                : meritRatingsFor(item),
                draft = meritDrafts[item.id] ?? {newInstance:repeatable&&!instances.length,instanceIndex:instances[0]?.index??-1,dots:instances[0]?.owned.dots??ratings[0]??1},
                activeInstance = instances.find(({index})=>index===draft.instanceIndex) ?? instances[0],
                buyingNew = repeatable && draft.newInstance,
                allowedRatings = ratings.filter((dot)=>
                  (buyingNew || !activeInstance || dot > activeInstance.owned.dots) &&
                  isEligible(item,{...context,selectedDots:dot,configuration:buyingNew?undefined:activeInstance?.owned.configuration}),
                ),
                intendedDots = allowedRatings.includes(draft.dots) ? draft.dots : allowedRatings[0],
                prerequisitesMet = isEligible(item,context);
              if(!repeatable&&character.merits.some(owned=>meritMatchesDefinition(owned,item,meritCatalog)&&owned.grantedBy&&!canAdvanceGrant(owned)))return null;
              if (
                !repeatable &&
                instances.length &&
                ratings.every((dot) => dot <= instances[0].owned.dots)
              )
                return null;
              return (
                <article
                  key={item.id}
                  className={`${selectedId === item.id ? "selected" : ""}${prerequisitesMet ? "" : " merit-option-locked"}`.trim()}
                >
                  <div>
                    <strong>{meritName(item)}</strong>
                    <small>
                      {item.source} · p. {item.page || "—"}
                      {repeatable ? t("ui.mayBePurchasedMultipleTimes") : ""}
                    </small>
                    {presented.prerequisites && (
                      <p className={prerequisitesMet ? "" : "merit-prerequisites-missing"}>
                        <b>{t("ui.prerequisites")}:</b> {presented.prerequisites}
                      </p>
                    )}
                    <p>{presented.description}</p>
                    {presented.levels?.map((level, index) => <p key={`${level.rating}-${index}`}><strong>{"•".repeat(level.rating)} {level.name}:</strong> {level.description}</p>)}
                  </div>
                  <div className="experience-merit-choice">
                    {repeatable && <label className="merit-instance-toggle"><input type="checkbox" checked={buyingNew} onChange={(event)=>setMeritDrafts(current=>({...current,[item.id]:{...draft,newInstance:event.target.checked,instanceIndex:event.target.checked?-1:(instances[0]?.index??-1),dots:event.target.checked?(ratings[0]??1):(instances[0]?.owned.dots??1)}}))}/><span>{t("ui.newInstance431cdc")}</span></label>}
                    {!buyingNew && instances.length > 1 && <label><span>{t("ui.instance")}</span><select value={activeInstance?.index??instances[0].index} onChange={(event)=>{const instanceIndex=Number(event.target.value), owned=instances.find(entry=>entry.index===instanceIndex)?.owned;setMeritDrafts(current=>({...current,[item.id]:{...draft,newInstance:false,instanceIndex,dots:owned?.dots??1}}));}}>{instances.map(({owned,index})=><option key={index} value={index}>{meritConfigurationTitle(owned.configuration)||`${meritName(item)} ${index+1}`}</option>)}</select></label>}
                    <span className="merit-current-rating"><b>{t("ui.current")}:</b> {buyingNew?0:(activeInstance?.owned.dots??0)}</span>
                    <label><span>{t("ui.intended")}</span><select value={intendedDots??""} disabled={!allowedRatings.length} onChange={(event)=>setMeritDrafts(current=>({...current,[item.id]:{...draft,dots:Number(event.target.value)}}))}>{allowedRatings.map(dot=><option key={dot} value={dot}>{dot}</option>)}</select></label>
                    <DialogClose asChild><Button type="button" size="sm" className="catalog-selection-action" disabled={!intendedDots} variant={selectedId===item.id&&targetDots===intendedDots?"default":"outline"} onClick={()=>intendedDots&&onSelect(item.id,intendedDots,buyingNew?-1:(activeInstance?.index??-1))}>{t("ui.select198f7a")}</Button></DialogClose>
                  </div>
                </article>
              );
            })}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">
              {t("ui.cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function isRepeatableDefinition(definition: MeritDefinition) {
  return (
    Boolean(definition.repeatable)
  );
}
export function recalculateCoreDerived(sheet: CharacterSheet) {
  const a = sheet.attributes,
    s = sheet.skills;
  sheet.derived = {
    ...sheet.derived,
    Tamanho: 5,
    Vitalidade: 5 + Number(a.Stamina ?? 1),
    Deslocamento: 5 + Number(a.Strength ?? 1) + Number(a.Dexterity ?? 1),
    ForçaDeVontade: Number(a.Resolve ?? 1) + Number(a.Composure ?? 1),
    Iniciativa: Number(a.Dexterity ?? 1) + Number(a.Composure ?? 1),
    Defesa:
      Math.min(Number(a.Dexterity ?? 1), Number(a.Wits ?? 1)) +
      Number(s.Athletics ?? 0),
  };
}
export { derivedWithPermanentMerits } from "@/lib/core/character/derived-traits";
