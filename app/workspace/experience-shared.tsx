"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import { useLanguage } from "@/lib/i18n";
import { meritContextForSheet, meritPrerequisitesMet, meritRatingsFor, UNBOUNDED_MERITS, REPEATABLE_MERITS, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { alphabetical } from "@/lib/option-order";
import { RuleSelect } from "./rule-select";
import { systemTerm } from "@/lib/system-terms";
import { MeritCatalogVisibilityToggle } from "../merit-catalog-visibility-toggle";
import { SelectableCatalogCard } from "../selectable-catalog-card";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";

export type ExperiencePurchaseGroup<T extends string> = {
  group: "core" | "supernatural" | "integrity" | "acquired";
  purchases: readonly T[];
};

const EXPERIENCE_GROUP_LABELS = {
  core: ["Core", "Core"],
  supernatural: ["Sobrenatural", "Supernatural"],
  integrity: ["Integridade e Recuperação", "Integrity & Recovery"],
  acquired: ["Poderes Adquiridos", "Acquired Powers"],
} as const;

export function groupedPurchaseOptions<T extends string>(groups: readonly ExperiencePurchaseGroup<T>[], label: (value: T) => string, locale: string) {
  const language = locale === "pt-BR" ? 0 : 1;
  return groups.flatMap(({ group, purchases }) => purchases.map((value) => ({ value, label: label(value), group: EXPERIENCE_GROUP_LABELS[group][language] })));
}

export function experiencePurchaseBalances(available: number, spent: number, total: number, cost: number, builderMode = false) {
  const nextAvailable = builderMode ? available : available - cost;
  const nextSpent = spent + cost;
  return { available: nextAvailable, spent: nextSpent, total: builderMode ? Math.max(total, available + spent) + cost : Math.max(total, nextAvailable + nextSpent) };
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
}: {
  kind: "Contrato" | "Rota" | "Práxis" | "Feitiço" | "Benefício de Contrato";
  items: ExperienceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
  line?: PersistedGameLineId;
  triggerLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}) {
  const { locale, t }=useLanguage();
  const kindLabel=kind==="Práxis"?t("ui.praxis"):systemTerm(kind,locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [secondary, setSecondary] = useState("Todos");
  const normalized = search.trim().toLocaleLowerCase("pt-BR");
  const selected = items.find((item) => item.id === selectedId);
  const categories = ["Todas", ...new Set(items.flatMap((item) => item.categories ?? [item.category]))];
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
        `${item.name} ${(item.categories ?? [item.category]).join(" ")} ${item.secondaryCategory ?? ""} ${item.description} ${item.meta}`
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
              label={`${t("ui.select198f7a")} ${item.name}`}
              onToggle={() => onSelect(selectedId === item.id ? "" : item.id)}
            >
              <div>
                <strong>{item.name}</strong>
                <small>{item.meta}</small>
                <p>{item.description}</p>
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

export function canAdvanceGrantedMerit(
  line: PersistedGameLineId,
  merit: CharacterSheet["merits"][number],
) {
  return (
    (line === "CtL" && merit.name === "Mantle" && merit.grantedBy === "Corte") ||
    (line === "MtA" && merit.name === "Awakened Status" && merit.grantedBy === "Ordem") ||
    (line === "MtA" && merit.name === "Mystery Cult Initiation" && merit.grantedBy === "Nameless Order")
  );
}

export function ExperienceMeritPicker({
  line,
  archetypes,
  meritCatalog,
  character,
  selectedId,
  targetDots,
  onSelect,
  isEligible = meritPrerequisitesMet,
}: {
  line: PersistedGameLineId;
  archetypes: readonly string[];
  meritCatalog: readonly MeritDefinition[];
  character: CharacterSheet;
  selectedId: string;
  targetDots: number;
  onSelect: (id: string, dots: number, instanceIndex: number) => void;
  isEligible?: (definition: MeritDefinition, context: MeritPrerequisiteContext) => boolean;
}) {
  const { locale, t }=useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [showAllMerits, setShowAllMerits] = useState(false);
  const [meritDrafts, setMeritDrafts] = useState<Record<string,{newInstance:boolean;instanceIndex:number;dots:number}>>({});
  const meritName=(item:MeritDefinition)=>locale==="en-US"?item.name:item.translatedName;
  const context=meritContextForSheet(character, meritCatalog, archetypes);
  const catalog = alphabetical([...meritCatalog], meritName,locale),
    selected = catalog.find((item) => item.id === selectedId),
    normalized = search.toLocaleLowerCase("pt-BR"),
    categories = ["Todas", ...new Set(catalog.map((item) => item.category))];
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
            options={categories.map((value) => ({ value, label: value }))}
          />
          <MeritCatalogVisibilityToggle showAll={showAllMerits} setShowAll={setShowAllMerits} />
        </div>
        <div className="experience-merit-catalog">
          {catalog
            .filter(
              (item) =>
                (showAllMerits || isEligible(item, context)) &&
                (category === "Todas" || item.category === category) &&
                `${item.translatedName} ${item.name} ${item.description} ${item.prerequisites ?? ""} ${item.source}`
                  .toLocaleLowerCase("pt-BR")
                  .includes(normalized),
            )
            .map((item) => {
              const instances = character.merits
                  .map((owned, index) => ({ owned, index }))
                  .filter(
                    ({ owned }) =>
                      owned.name === item.name &&
                      (!owned.grantedBy || canAdvanceGrantedMerit(line, owned)),
                  ),
                repeatable = isRepeatableDefinition(item),
                ratings = UNBOUNDED_MERITS.has(item.name)
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
              if (item.name === "Mantle" && !instances.length) return null;
              if(!repeatable&&character.merits.some(owned=>owned.name===item.name&&owned.grantedBy&&!canAdvanceGrantedMerit(line,owned)))return null;
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
                    {item.prerequisites && (
                      <p className={prerequisitesMet ? "" : "merit-prerequisites-missing"}>
                        <b>{t("ui.prerequisites")}:</b> {item.prerequisites}
                      </p>
                    )}
                    <p>{item.description}</p>
                  </div>
                  <div className="experience-merit-choice">
                    {repeatable && item.name !== "Mantle" && <label className="merit-instance-toggle"><input type="checkbox" checked={buyingNew} onChange={(event)=>setMeritDrafts(current=>({...current,[item.id]:{...draft,newInstance:event.target.checked,instanceIndex:event.target.checked?-1:(instances[0]?.index??-1),dots:event.target.checked?(ratings[0]??1):(instances[0]?.owned.dots??1)}}))}/><span>{t("ui.newInstance431cdc")}</span></label>}
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
    REPEATABLE_MERITS.has(definition.name) ||
    Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable)
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
export function derivedWithPermanentMerits(character: CharacterSheet) {
  const derived = { ...character.derived };
  const grantedSkills = (
    character.line_data.merit_granted_skill_bonuses &&
    typeof character.line_data.merit_granted_skill_bonuses === "object"
      ? character.line_data.merit_granted_skill_bonuses
      : {}
  ) as Record<string, number>;
  derived.Defesa =
    Number(derived.Defesa ?? 0) + (Number(grantedSkills.Athletics) || 0);
  const merit = (name: string) =>
    character.merits.find((item) => item.name === name);
  const fastReflexes = merit("Fast Reflexes");
  const fleetOfFoot = merit("Fleet of Foot");
  if (fastReflexes)
    derived.Iniciativa = Number(derived.Iniciativa ?? 0) + fastReflexes.dots;
  if (fleetOfFoot)
    derived.Deslocamento = Number(derived.Deslocamento ?? 0) + fleetOfFoot.dots;
  const currentSize = Number(derived.Tamanho ?? 5);
  const targetSize = merit("Giant")
    ? 6
    : merit("Small-Framed")
      ? 4
      : currentSize;
  if (targetSize !== currentSize) {
    derived.Tamanho = targetSize;
    derived.Vitalidade = Math.max(
      1,
      Number(derived.Vitalidade ?? currentSize) + targetSize - currentSize,
    );
  }
  return derived;
}
