"use client";

import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Choice } from "@/app/builder/common-controls";
import { MeritPicker } from "@/app/builder/merit-picker";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { CHANGELING_MERIT_CONFIGURATIONS, isChangelingInlineMeritConfiguration } from "./builder-merit-configurations";
import { renderChangelingStructuredMeritEditor } from "./builder-merit-editor";
import {
  CTL_NEEDLE_DEFINITIONS, CTL_SEEMINGS, CTL_THREAD_DEFINITIONS, REGALIA,
  changelingAnchorDisplayName, changelingAnchorRecovery, seemingDisplayName,
} from "./creation-rules";
import { SKILLS } from "@/lib/core/character/creation-rules";
import { canSelectInitialContract } from "./builder-eligibility";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import { courtPageCitation, type CourtDefinition } from "@/lib/changeling-courts";
import { kithSearchText, kithSkillOptions, type KithDefinition } from "@/lib/changeling-kiths";
import type { EntitlementDefinition } from "@/lib/entitlements";
import { kithCreationChoice } from "./kith-choices";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary } from "@/lib/contract-presentation";
import type { MeritSelection, Specialty } from "@/lib/core/character/character-types";
import type { MeritDefinition, MeritPrerequisiteContext } from "@/lib/merits";
import { alphabetical } from "@/lib/option-order";
import { translate, useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { SelectableCatalogCard } from "@/app/selectable-catalog-card";

export type ContractSelection = ContractDefinition;
export type CustomCourtDefinition = { name: string; emotion: string; mantleBenefits: string[] };
type BuilderCourtDefinition = CustomCourtDefinition & Partial<CourtDefinition>;
type Setter<T> = (value: T) => void;
type MissingCheck = (key: string) => boolean;
export type ChangelingBuilderViewProps = {
  seeming: string; setSeeming: Setter<string>; attributes: Record<string, number>;
  contractCatalog: ContractDefinition[]; contracts: ContractSelection[]; setContracts: Setter<ContractSelection[]>;
  favoredAttribute: string; setFavoredAttribute: Setter<string>; secondRegalia: string; setSecondRegalia: Setter<string>;
  needle: string; setNeedle: Setter<string>; thread: string; setThread: Setter<string>; touchstone: string; setTouchstone: Setter<string>;
  wyrd: number; setWyrd: Setter<number>; maximumPowerFromMerits: number; powerAdvancement: number;
  aspirations: string[]; setAspirations: Setter<string[]>; meritContext: MeritPrerequisiteContext; meritCatalog: MeritDefinition[]; merits: MeritSelection[]; setMerits: Setter<MeritSelection[]>;
  meritSpent: number; meritBudget: number; court: string; missing: MissingCheck;
  kith: string; setKith: Setter<string>; customKith: boolean; setCustomKith: Setter<boolean>;
  kithChoice: string; setKithChoice: Setter<string>; specialties: Specialty[];
  customKithSkill: string; setCustomKithSkill: Setter<string>; customKithDescription: string; setCustomKithDescription: Setter<string>;
  kithCatalog: Array<KithDefinition & { homebrew?: true }>;
  kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
  entitlementCatalog: EntitlementDefinition[];
  customCourt: CustomCourtDefinition | null; setCustomCourt: Setter<CustomCourtDefinition | null>; setCourt: Setter<string>; courtCatalog: CourtDefinition[];
};
const CHANGELING_BUILDER_MERIT_CONFIGURATIONS = [...COMMON_MERIT_CONFIGURATIONS, ...CHANGELING_MERIT_CONFIGURATIONS];

function findCourt(catalog: readonly BuilderCourtDefinition[], value: unknown) {
  const normalized = String(value ?? "").trim().toLocaleLowerCase();
  return catalog.find((item) =>
    [item.id, item.name, item.translatedName, item.name?.replace(/ Court$/, "")]
      .some((candidate) => String(candidate ?? "").toLocaleLowerCase() === normalized),
  );
}

function courtName(court: BuilderCourtDefinition, locale: string) {
  return locale === "en-US" ? court.name : (court.translatedName ?? court.name);
}

function courtId(catalog: readonly BuilderCourtDefinition[], value: unknown) {
  return findCourt(catalog, value)?.id ?? String(value ?? "").trim();
}

function courtDisplayName(catalog: readonly BuilderCourtDefinition[], value: unknown, locale: string) {
  const raw = String(value ?? "");
  if (["sem corte", "courtless"].includes(raw.trim().toLocaleLowerCase()))
    return translate(locale as "pt-BR" | "en-US", "ui.courtless");
  const definition = findCourt(catalog, value);
  return definition ? courtName(definition, locale) : raw;
}

function contractCategoryKey(contract: ContractDefinition) {
  if (contract.goblin || contract.regalia === "Goblin") return "goblin";
  if (contract.categoryKind === "Corte" || contract.regalia === "All" || contract.courtIds?.length || contract.courtClauses) return "court";
  if (contract.categoryKind === "Independente" || ["Independent", "Independente"].includes(contract.regalia)) return "independent";
  return contract.regalia;
}

export function ChangelingBuilderView(props: ChangelingBuilderViewProps) {
  const { locale, t } = useLanguage();
  const seemingData = CTL_SEEMINGS[props.seeming as keyof typeof CTL_SEEMINGS];
  const availableRegalia = [
    ...REGALIA,
    ...props.contractCatalog
      .filter(
        (item: ContractDefinition & { categoryKind?: string }) =>
          item.categoryKind === "Regalia" && !["Independent", "Independente"].includes(item.regalia),
      )
      .map((item: ContractDefinition) => item.regalia),
  ].filter((item, index, values) => values.indexOf(item) === index);
  const favored = seemingData ? favoredChoices(seemingData.favored).filter((attribute) => Number(props.attributes?.[attribute] ?? 1) < 5) : [];
  const favoredKey = favored.join("|");
  const { favoredAttribute, setFavoredAttribute } = props;
  useEffect(() => {
    if (favoredAttribute && !favoredKey.split("|").includes(favoredAttribute)) setFavoredAttribute("");
  }, [favoredAttribute, setFavoredAttribute, favoredKey]);
  const secondRegaliaRoyalCount = props.contractCatalog.filter(
    (contract) => contract.type === "Real" && contract.regalia === props.secondRegalia,
  ).length;
  return (
    <div className="builder-section">
      <span className="kicker">{t("ui.step3CHANGELING")}</span>
      <h2>{t("ui.lostTemplate")}</h2>
      <p>{t("ui.theChoicesAndLimitsBelowComeFromChangeling")}</p>
      <div className="ctl-template-grid">
        <div className="ctl-template-primary">
          <Choice
            label={t("ui.seeming")}
            value={props.seeming}
            setValue={props.setSeeming}
            options={Object.keys(CTL_SEEMINGS)}
            optionLabels={Object.fromEntries(Object.entries(CTL_SEEMINGS).map(([name,item])=>[
              name,
              t("ui.favorsRegalia", { name: seemingDisplayName(name, locale), regalia: systemTerm(item.regalia, locale) }),
            ]))}
            invalid={props.missing("seeming")}
          />
          <div className="ctl-favored-inline">
            <Choice
              label={t("ui.favoredAttribute1")}
              value={props.favoredAttribute}
              setValue={props.setFavoredAttribute}
              options={favored}
              optionLabels={Object.fromEntries(favored.map((attribute) => [attribute, systemTerm(attribute, locale)]))}
              invalid={props.missing("favoredAttribute")}
            />
          </div>
          <div className="regalia-choice-stack">
            <span className="regalia-field-label">{t("ui.secondFavoredRegalia")}</span>
            <div className="regalia-information" aria-live="polite">
              <strong>{props.secondRegalia ? systemTerm(props.secondRegalia, locale) : t("ui.secondRegalia")}</strong>
              <p>{props.secondRegalia
                ? t("ui.thisFavoredRegaliaGrantsAccessToItsRoyal", { p1: secondRegaliaRoyalCount })
                : t("ui.chooseASecondFavoredRegaliaToUnlockAnother")}</p>
            </div>
            <div className="regalia-select">
              <Choice
                label=""
                value={props.secondRegalia}
                setValue={props.setSecondRegalia}
                options={availableRegalia.filter((item) => item !== seemingData?.regalia)}
                invalid={props.missing("secondRegalia")}
              />
            </div>
          </div>
        </div>
        <div className="ctl-template-secondary">
          <div className={props.missing("kith") ? "missing-field" : ""}><KithSelector {...props} /></div>
          <ChangelingAnchorSelector kind="needle" value={props.needle} setValue={props.setNeedle} invalid={props.missing("needle")}/>
        </div>
        <div className="ctl-template-secondary">
          <div className={props.missing("court") ? "missing-field" : ""}><CourtSelector {...props} /></div>
          <ChangelingAnchorSelector kind="thread" value={props.thread} setValue={props.setThread} invalid={props.missing("thread")}/>
        </div>
      </div>
      <div className={props.missing("contracts") ? "missing-field block" : ""}>
        <ContractSelector
          contracts={props.contracts}
          setContracts={props.setContracts}
          seeming={props.seeming}
          primaryRegalia={seemingData?.regalia ?? ""}
          secondRegalia={props.secondRegalia}
          kith={props.kith}
          customKith={props.customKith}
          court={props.court}
          courtCatalog={props.courtCatalog}
          catalog={props.contractCatalog}
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
          powerLabel={t("ui.wyrdAtCreation")}
          power={props.wyrd}
          setPower={props.setWyrd}
          isInlineConfiguration={(name) => isCommonInlineMeritConfiguration(name) || isChangelingInlineMeritConfiguration(name)}
          renderConfiguration={({ merit, ownedMerits, inline, onChange }) => (
            <MeritConfigurationEditor
              merit={merit}
              ownedMerits={ownedMerits}
              inline={inline}
              onChange={onChange}
              catalog={props.meritCatalog}
              definitions={CHANGELING_BUILDER_MERIT_CONFIGURATIONS}
              renderStructured={(editorProps) => renderChangelingStructuredMeritEditor(editorProps, props.entitlementCatalog)}
              renderCustomField={(kind, field) => kind === "court" ? <Choice label={t("ui.benefitedCourt")} value={field.value} setValue={field.onChange} options={props.courtCatalog.filter((item) => courtId(props.courtCatalog, item.id ?? item.name) !== courtId(props.courtCatalog, props.court)).map((item) => item.id ?? item.name)} optionLabels={Object.fromEntries(props.courtCatalog.map((item) => [item.id ?? item.name, courtName(item, locale)]))} /> : null}
            />
          )}
        />
      </div>
    </div>
  );
}

function CourtSelector(props: Pick<ChangelingBuilderViewProps,"court"|"setCourt"|"customCourt"|"setCustomCourt"|"courtCatalog">) {
  const { locale, t } = useLanguage();
  const [courtSearch, setCourtSearch] = useState("");
  const [courtSource, setCourtSource] = useState("all");
  const select = (name: string) => {
    props.setCourt(name);
    props.setCustomCourt(null);
  };
  const officialCourt = findCourt(props.courtCatalog, props.court);
  const officialCourts: BuilderCourtDefinition[] = props.courtCatalog;
  const courtOptions = alphabetical([
    ...officialCourts.map((court) => ({
      value: court.id ?? court.name,
      label: courtName(court, locale),
      detail: `${locale === "pt-BR" ? (court.emotionPt ?? court.emotion) : court.emotion} · ${court.source ?? ""} · p. ${courtPageCitation({ page: court.page ?? 0, additionalPages: court.additionalPages })}`,
      source: court.source ?? "",
    })),
  ], (court) => court.label, locale);
  const courtSources = alphabetical([...new Set(courtOptions.map((court) => court.source))], (source) => source, locale);
  const normalizedCourtSearch = courtSearch.trim().toLocaleLowerCase(locale);
  const filteredCourts = courtOptions.filter((court) =>
    (courtSource === "all" || court.source === courtSource) &&
    (!normalizedCourtSearch || `${court.label} ${court.detail}`.toLocaleLowerCase(locale).includes(normalizedCourtSearch)),
  );
  return (
    <div className="kith-field">
      <span>{t("ui.court")}</span>
      <div className="kith-current">
        <strong>{props.court ? courtDisplayName(props.courtCatalog, props.court, locale) : t("ui.noneSelected")}</strong>
        <small>
          {!props.court
            ? t("ui.noCourtSelectedTheCharacterWillBeSaved")
            : officialCourt
              ? `${locale === "en-US" ? officialCourt.emotion : (officialCourt.emotionPt ?? officialCourt.emotion)} · ${t("ui.theCourtGrantsMantle1Automatically")}`
              : t("ui.noMantleBenefits")}
        </small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {t("ui.selectCourt")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog ctl-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.selectCourt")}</DialogTitle>
            <DialogDescription>
              {t("ui.chooseAmongTheConsolidatedCourtsFromActiveSources")}
            </DialogDescription>
          </DialogHeader>
          <div className="court-catalog-filters">
            <label className="merit-search">
              <Search aria-hidden="true" />
              <Input value={courtSearch} onChange={(event) => setCourtSearch(event.target.value)} placeholder={t("ui.searchCourt")} />
            </label>
            <Choice label={t("ui.source")} value={courtSource} setValue={setCourtSource} options={["all", ...courtSources]} optionLabels={{ all: t("ui.all") }} />
          </div>
          <div className="court-catalog">
            <button type="button" className={!props.court ? "court-option selected" : "court-option"} onClick={() => select("")}>
              <strong>{t("ui.courtless")}</strong>
              <small>{t("ui.theCharacterDoesNotBelongToACourt")}</small>
            </button>
            {filteredCourts.map((court) => (
              <button type="button" aria-pressed={courtId(props.courtCatalog, props.court) === courtId(props.courtCatalog, court.value)} className={courtId(props.courtCatalog, props.court) === courtId(props.courtCatalog, court.value) ? "court-option selected" : "court-option"} key={court.value} onClick={() => select(courtId(props.courtCatalog, props.court) === courtId(props.courtCatalog, court.value) ? "" : court.value)}>
                <strong>{court.label}</strong>
                <small>{court.detail}</small>
              </button>
            ))}
            {!filteredCourts.length && <p className="empty-state">{t("ui.noCourtsFound")}</p>}
          </div>
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

function ChangelingAnchorSelector({kind,value,setValue,invalid=false}:{kind:"needle"|"thread";value:string;setValue:(value:string)=>void;invalid?:boolean}) {
  const { locale, t }=useLanguage();
  const [search,setSearch]=useState("");
  const [sourceFilter,setSourceFilter]=useState("all");
  const definitions=kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS;
  const sources=alphabetical([...new Set(definitions.map((item)=>item.source).filter((source):source is string=>Boolean(source)))],(source)=>source,locale);
  const label=kind==="needle"?t("ui.needle"):t("ui.thread");
  const normalized=search.trim().toLocaleLowerCase(locale);
  const filtered=definitions.filter((item)=>(sourceFilter==="all"||item.source===sourceFilter)&&(!normalized||`${item.name} ${changelingAnchorRecovery(kind,item.name,locale)}`.toLocaleLowerCase(locale).includes(normalized)));
  return <div className={`kith-field anchor-field${invalid?" missing-field":""}`}>
    <span>{label}</span>
    <div className="kith-current"><strong>{value?changelingAnchorDisplayName(kind,value,locale):t("ui.noneSelected4f351e")}</strong><small>{value?changelingAnchorRecovery(kind,value,locale).replace("\n"," · "):t("ui.reviewTheWillpowerRecoveryTriggersBeforeChoosing")}</small></div>
    <Dialog>
      <DialogTrigger asChild><Button type="button" variant="outline"><Search/> {t("ui.select93d2b9", { p1: label })}</Button></DialogTrigger>
      <DialogContent className="merit-dialog anchor-dialog ctl-dialog">
        <DialogHeader><DialogTitle>{t("ui.select93d2b9", { p1: label })}</DialogTitle><DialogDescription>{t("ui.eachOptionRecoversEither1PointOrAll")}</DialogDescription></DialogHeader>
        <label className="merit-search"><Search aria-hidden="true"/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={t("ui.searchByNameOrTrigger")}/></label>
        <div className="catalog-filters anchor-filters"><label>{t("ui.source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{t("ui.allSources")}</SelectItem>{sources.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label></div>
        <div className="merit-catalog anchor-catalog">{filtered.map((item)=><SelectableCatalogCard key={item.name} selected={value===item.name} label={`${t("ui.select198f7a")} ${changelingAnchorDisplayName(kind,item.name,locale)}`} onToggle={()=>setValue(value===item.name?"":item.name)}><div><strong>{changelingAnchorDisplayName(kind,item.name,locale)}</strong>{item.source&&<small>{item.source} · p. {item.page}</small>}<p>{changelingAnchorRecovery(kind,item.name,locale).split("\n").map((line,index)=><span key={line}>{index===0?"":""}{line}</span>)}</p></div></SelectableCatalogCard>)}</div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

function KithSelector(props: Pick<ChangelingBuilderViewProps,"kith"|"setKith"|"kithChoice"|"setKithChoice"|"specialties"|"customKith"|"setCustomKith"|"customKithSkill"|"setCustomKithSkill"|"customKithDescription"|"setCustomKithDescription"|"kithCatalog"|"kithPresentation">) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [skillFilter,setSkillFilter]=useState("all");
  const [sourceFilter,setSourceFilter]=useState("all");
  const normalized = kithSearchText(search);
  const kithName = (item: KithDefinition & {homebrew?:true}) => locale === "pt-BR" ? (item.translatedName ?? item.name) : item.name;
  const kithText = (item: KithDefinition & {homebrew?:true}) => item.homebrew
    ? {name:item.name,description:item.description,blessing:item.blessing,skill:item.skill}
    : locale === "en-US"
      ? {name:item.name,description:item.description,blessing:item.blessing,skill:item.skill}
      : (props.kithPresentation[item.id] ?? {name:item.translatedName??item.name,description:item.description,blessing:item.blessing,skill:item.skill});
  const allKiths: Array<KithDefinition & {homebrew?:true}> = [...props.kithCatalog].sort((a,b)=>kithName(a).localeCompare(kithName(b),locale));
  const skillOptionSet=new Set(allKiths.flatMap(kithSkillOptions));
  const skillGroups=Object.entries(SKILLS).map(([category,skills])=>({
    category,
    skills:skills.map(skill=>systemTerm(skill,"en-US")).filter(skill=>skillOptionSet.has(skill)),
  }));
  const canonicalSkills=new Set(skillGroups.flatMap(group=>group.skills));
  const otherSkillOptions=alphabetical([...skillOptionSet].filter(skill=>!canonicalSkills.has(skill)),skill=>systemTerm(skill,locale),locale);
  const sourceOptions=alphabetical([...new Set(allKiths.map((item)=>item.source).filter(Boolean))],(value)=>value,locale);
  const selected = allKiths.find((item) => item.id === props.kith || item.name === props.kith || item.translatedName === props.kith);
  const creationChoice=selected&&!props.customKith?kithCreationChoice(selected.id):undefined;
  const creationChoiceOptions=creationChoice?.kind==="specialty"
    ? props.specialties.filter(item=>creationChoice.skillNames?.includes(systemTerm(item.skill,"en-US"))&&item.name.trim()).map(item=>`${systemTerm(item.skill,"en-US")}: ${item.name.trim()}`)
    : [...(creationChoice?.options??[])];
  const filtered = allKiths.filter(
    (item) =>
      (skillFilter==="all"||kithSkillOptions(item).includes(skillFilter))&&
      (sourceFilter==="all"||item.source===sourceFilter)&&
      (!normalized||kithSearchText(`${item.translatedName ?? ""} ${item.name} ${kithSkillOptions(item).join(" ")} ${item.skill} ${item.description} ${item.blessing} ${item.source}`).includes(normalized)),
  );
  const choose = (item: KithDefinition & {homebrew?:true}) => {
    if(item.id!==selected?.id)props.setKithChoice("");
    props.setKith(item.id === "chimera-book-of-seemings" ? item.id : item.name);
    props.setCustomKith(Boolean(item.homebrew));
    props.setCustomKithSkill(item.skill);
    props.setCustomKithDescription(item.description);
  };
  const clear = () => {
    props.setKith("");
    props.setKithChoice("");
    props.setCustomKith(false);
    props.setCustomKithSkill("");
    props.setCustomKithDescription("");
  };
  return (
    <div className="kith-field">
      <span>{t("ui.kith")}</span>
      <div className={`kith-current${creationChoice?" has-choice":""}`}>
        <div className="kith-choice-row">
          <strong>{(selected ? kithName(selected) : props.kith) || t("ui.noneSelected")}</strong>
          {creationChoice&&(creationChoice.kind==="text"?
            <Input className="kith-choice-inline" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn} value={props.kithChoice} onChange={event=>props.setKithChoice(event.target.value)} placeholder={locale==="pt-BR"?creationChoice.placeholderPt:creationChoice.placeholderEn}/>
            : <Select value={props.kithChoice} onValueChange={props.setKithChoice} disabled={!creationChoiceOptions.length}><SelectTrigger className={`kith-choice-inline${props.kithChoice?"":" missing-choice"}`} size="sm" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn}><SelectValue placeholder={creationChoice.kind==="specialty"&&!creationChoiceOptions.length?t("ui.chooseASpecialty"):(locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn)}/></SelectTrigger><SelectContent>{creationChoiceOptions.map(option=>{const [skill,...detail]=option.split(": ");return <SelectItem key={option} value={option}>{detail.length?`${systemTerm(skill,locale)}: ${detail.join(": ")}`:systemTerm(option,locale)}</SelectItem>;})}</SelectContent></Select>
          )}
        </div>
        <small>{selected?`${kithText(selected).skill} · ${selected.source} · p. ${selected.page}`:t("ui.openTheCatalogToChoose")}</small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {t("ui.selectKith")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog kith-dialog ctl-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.selectKith")}</DialogTitle>
            <DialogDescription>
              {t("ui.reviewTheDescriptionSkillAndBlessingBeforeChoosing")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("ui.searchKithSkillOrSource")}
            />
          </label>
          <div className="catalog-filters kith-filters">
            <label>{t("ui.skill")}<Select value={skillFilter} onValueChange={setSkillFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="all">{t("ui.allSkills")}</SelectItem>
              {skillGroups.map((group)=><SelectGroup key={group.category}>
                <SelectSeparator/><SelectLabel>{systemTerm(group.category,locale)}</SelectLabel>
                {group.skills.map(skill=><SelectItem key={skill} value={skill}>{systemTerm(skill,locale)}</SelectItem>)}
              </SelectGroup>)}
              {otherSkillOptions.length>0&&<SelectGroup><SelectSeparator/><SelectLabel>{t("ui.otherOptions")}</SelectLabel>{otherSkillOptions.map(option=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectGroup>}
            </SelectContent></Select></label>
            <label>{t("ui.source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{t("ui.allSources")}</SelectItem>{sourceOptions.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label>
          </div>
          <div className="merit-catalog">
            <section className="merit-category">
              <h3>
                {t("ui.kiths")} <Badge variant="outline">{filtered.length}</Badge>
              </h3>
              <div>
                {filtered.map((item) => {
                  const presentation=kithText(item);
                  const isSelected =
                    selected?.id === item.id;
                  return (
                    <SelectableCatalogCard
                      className="merit-option"
                      key={item.id}
                      selected={isSelected}
                      label={`${t("ui.select198f7a")} ${kithName(item)}`}
                      onToggle={() => isSelected ? clear() : choose(item)}
                    >
                      <div>
                        <strong>{kithName(item)}</strong>
                        {locale === "pt-BR" && item.translatedName && item.translatedName !== item.name && <small>{item.name}</small>}
                        <small>
                          {presentation.skill} · {item.source} · p. {item.page}
                        </small>
                        <p>{presentation.description}</p>
                        <p className="rule-detail">
                          <strong>{t("ui.blessingb05ee6")}:</strong> {presentation.blessing}
                        </p>
                      </div>
                    </SelectableCatalogCard>
                  );
                })}
              </div>
            </section>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContractSelector({
  contracts,
  setContracts,
  seeming,
  primaryRegalia,
  secondRegalia,
  kith,
  customKith,
  court,
  courtCatalog,
  catalog,
}: {
  contracts: ContractSelection[];
  setContracts: (value: ContractSelection[]) => void;
  seeming: string;
  primaryRegalia: string;
  secondRegalia: string;
  kith: string;
  customKith: boolean;
  court: string;
  courtCatalog: CourtDefinition[];
  catalog: ContractDefinition[];
}) {
  const { locale, t } = useLanguage();
  const contractName = (item: ContractDefinition | ContractSelection) => locale === "pt-BR" ? item.name : (item.originalName || item.name);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const commonFull = contracts.slice(0, 4).every((item) => item.name);
  const royalFull = contracts.slice(4).every((item) => item.name);
  const categoryLabel = (category: string) => category === "court"
    ? t("ui.court")
    : category === "independent"
      ? t("ui.independent")
      : category === "goblin"
        ? t("ui.goblin")
        : systemTerm(category, locale);
  const categoryOptions = alphabetical([...new Set(catalog.map(contractCategoryKey))], categoryLabel, locale);
  const availableContracts = alphabetical(catalog, contractName,locale)
    .sort((left, right) => Number(left.type === "Real") - Number(right.type === "Real"))
    .filter((contract) =>
      canSelectInitialContract(
        contract,
        changelingFavoredRegalia({primary_regalia:primaryRegalia, second_regalia:secondRegalia, kith, kith_custom:customKith}),
        court,
        courtCatalog,
      ) &&
      (typeFilter === "all" || (typeFilter === "common" ? contract.type === "Comum" : contract.type === "Real")) &&
      (categoryFilter === "all" || contractCategoryKey(contract) === categoryFilter) &&
      (!((contract.type === "Comum" ? commonFull : royalFull)) || contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName)),
    );
  const groups = alphabetical([...new Set(availableContracts.map(contractCategoryKey))], categoryLabel, locale)
    .map((category) => ({
      category,
      items: availableContracts.filter(
        (item) =>
          contractCategoryKey(item) === category &&
          (!normalizedSearch ||
            `${item.name} ${item.originalName} ${item.source} ${item.description} ${item.dicePool}`
              .toLocaleLowerCase("pt-BR")
              .includes(normalizedSearch)),
      ),
    }))
    .filter((group) => group.items.length);
  function addContract(contract: ContractDefinition) {
    if (
      contracts.some(
        (item) =>
          item.id === contract.id ||
          item.originalName === contract.originalName,
      )
    )
      return;
    const start = contract.type === "Comum" ? 0 : 4;
    const end = contract.type === "Comum" ? 4 : 6;
    const slot = contracts.findIndex(
      (item, index) => index >= start && index < end && !item.name,
    );
    if (slot < 0) return;
    const next = [...contracts];
    next[slot] = { ...contract };
    setContracts(next);
  }
  function removeContract(index: number) {
    const next = [...contracts];
    next[index] = emptyContract(index < 4 ? "Comum" : "Real");
    setContracts(next);
  }
  function toggleContract(contract: ContractDefinition) {
    const selectedIndex = contracts.findIndex(
      (item) => item.id === contract.id || item.originalName === contract.originalName,
    );
    if (selectedIndex >= 0) {
      removeContract(selectedIndex);
      return;
    }
    addContract(contract);
  }
  return (
    <>
      <Dialog>
      <div className="merit-heading">
        <div>
          <h3>{t("ui.startingContracts")}</h3>
          <p>
            {t("ui.selectFourCommonContractsIncludingGoblinContractsAnd")}
          </p>
        </div>
        <div className="merit-heading-actions"><Badge variant="outline">
          {contracts.filter((item) => item.name).length}/6 {t("ui.selected9c2338")}
        </Badge><DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="builder-add-action">{t("ui.addContract")}</Button></DialogTrigger></div>
      </div>
      <DialogContent className="merit-dialog ctl-dialog">
        <DialogHeader>
          <DialogTitle>{t("ui.addContract")}</DialogTitle>
          <DialogDescription>
            {t("ui.groupedByRegaliaCourtOrIndependentAccessWith")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("ui.searchContractRegaliaOrSource")} /></label>
          <Choice value={typeFilter} setValue={setTypeFilter} options={["all","common","royal"]} optionLabels={{all:t("ui.allTypes"),common:t("ui.common"),royal:t("ui.royal")}} />
          <Choice value={categoryFilter} setValue={setCategoryFilter} options={["all",...categoryOptions]} optionLabels={{all:t("ui.allCategories"),...Object.fromEntries(categoryOptions.map((category)=>[category,categoryLabel(category)]))}} />
        </div>
        <div className="merit-catalog">
          {groups.map(({ category, items }) => (
            <section className="merit-category" key={category}>
              <h3>{categoryLabel(category)} <Badge variant="outline">{items.length}</Badge></h3>
              <div>
                {items.map((contract) => {
                  const presented = contractPresentation(contract, locale);
                  const summary = contractSummary(contract, locale);
                  const displayOptions = contractDisplayOptions(presented, locale);
                  const outcomeSections = contractOutcomeSections(presented, locale);
                  const selected = contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName);
                  const full = contract.type === "Comum" ? commonFull : royalFull;
                  const benefit = presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
                  return <SelectableCatalogCard className="merit-option" key={contract.id} selected={selected} disabled={!selected && full} label={contractName(contract)} onToggle={() => toggleContract(contract)}><div><strong>{contractName(contract)}</strong><small>{contract.goblin ? "Goblin" : contract.type === "Comum" ? t("ui.common") : t("ui.royal")} · {contract.source} · p. {contract.page || "—"}</small>{summary && <p className="rule-detail"><strong>{t("ui.summary")}:</strong> {summary}</p>}{contractHasInvocationRoll(presented) === true && <p className="rule-detail"><strong>{t("ui.dicePool")}:</strong> {presented.dicePool ?? t("ui.notListed")}</p>}{presented.cost && <p className="rule-detail"><strong>{t("ui.cost")}:</strong> {presented.cost}</p>}{displayOptions.length > 0 && <p className="rule-detail"><strong>{t("ui.options")}:</strong> {displayOptions.join(" · ")}</p>}{outcomeSections[0]?.text && <p className="rule-detail">{outcomeSections[0].text}</p>}{benefit && <p className="rule-detail"><strong>{t("ui.benefit")}:</strong> {benefit}</p>}</div></SelectableCatalogCard>;
                })}
              </div>
            </section>
          ))}
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
      </Dialog>
      <div className="contract-power-list creation-contract-list">
        {contracts.map((item,index)=>{
          if(!item.name)return <article className="creation-contract-empty" key={index}><Badge variant={index<4?"secondary":"outline"}>{index<4?t("ui.common"):t("ui.royal")}</Badge><div><strong>{t("ui.availableSlot")}</strong><small>{t("ui.chooseFromTheCatalog")}</small></div></article>;
          const presented=contractPresentation(item,locale),summary=contractSummary(item,locale),displayOptions=contractDisplayOptions(presented,locale),outcomes=contractOutcomeSections(presented,locale);
          const benefit=presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
          return <details className="contract-power-card" key={`${item.id}-${index}`}>
            <summary className="contract-power-summary"><strong>{contractName(item)}</strong><Badge variant={item.goblin?"default":"outline"}>{item.goblin?"Goblin":index<4?t("ui.common"):t("ui.royal")}</Badge><small>{categoryLabel(contractCategoryKey(item))} · {item.source} · p. {item.page||"—"}</small></summary>
            <div className="contract-power-details"><dl>
              {summary&&<div><dt>{t("ui.summary")}</dt><dd>{summary}</dd></div>}
              {contractHasInvocationRoll(presented)===true&&<div><dt>{t("ui.dicePool")}</dt><dd>{presented.dicePool??t("ui.notListed")}</dd></div>}
              <div><dt>{t("ui.cost")}</dt><dd>{presented.cost??t("ui.asDescribed")}</dd></div>
              <div><dt>{t("ui.actionDuration")}</dt><dd>{presented.action??t("ui.instant")} · {presented.duration??t("ui.scene")}</dd></div>
              {outcomes.map(section=><div key={section.label}><dt>{section.label}</dt><dd>{section.text}</dd></div>)}
              {displayOptions.length>0&&<div className="contract-options"><dt>{t("ui.options")}</dt><dd><ul>{displayOptions.map(option=><li key={option}>{option}</li>)}</ul></dd></div>}
              {presented.detailTables?.map(table=><div className="contract-detail-table" key={table.title}><dt>{table.title}</dt><dd><table><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map(row=><tr key={row.join("::")}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd></div>)}
              <div><dt>{t("ui.loophole")}</dt><dd>{presented.loophole}</dd></div>
              {item.goblinDebt&&<div className="goblin-debt-row"><dt>{t("ui.goblinDebt")}</dt><dd>{item.goblinDebt}</dd></div>}
              {benefit&&<div><dt>{t("ui.benefitFor")} {seemingDisplayName(seeming,locale)}</dt><dd>{benefit}</dd></div>}
              </dl><Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={()=>removeContract(index)}><Trash2/>{t("ui.removeContract")}</Button></div>
          </details>;
        })}
      </div>
      <Dialog>
        <DialogContent className="merit-dialog ctl-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.selectContracts")}</DialogTitle>
            <DialogDescription>
              {t("ui.groupedByRegaliaCourtOrIndependentAccessWith")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("ui.searchContractRegaliaOrSource")}
            />
          </label>
          <div className="merit-catalog">
            {groups.map(({ category, items }) => (
              <section className="merit-category" key={category}>
                <h3>
                  {categoryLabel(category)} <Badge variant="outline">{items.length}</Badge>
                </h3>
                <div>
                  {items.map((contract) => {
                    const presented = contractPresentation(contract, locale);
                    const summary = contractSummary(contract, locale);
                    const displayOptions = contractDisplayOptions(presented, locale);
                    const outcomeSections = contractOutcomeSections(presented, locale);
                    const selected = contracts.some(
                      (item) =>
                        item.id === contract.id ||
                        item.originalName === contract.originalName,
                    );
                    const full =
                      contract.type === "Comum"
                        ? contracts.slice(0, 4).every((item) => item.name)
                        : contracts.slice(4).every((item) => item.name);
                    const benefit =
                      presented.seemingBenefits?.[
                        seeming as keyof typeof presented.seemingBenefits
                      ];
                    return (
                      <SelectableCatalogCard
                        className="merit-option"
                        key={contract.id}
                        selected={selected}
                        disabled={!selected && full}
                        label={contractName(contract)}
                        onToggle={() => toggleContract(contract)}
                      >
                        <div>
                          <strong>{contractName(contract)}</strong>
                          <small>
                            {contract.goblin ? "Goblin" : contract.type === "Comum" ? t("ui.common") : t("ui.royal")}{" "}
                            · {contract.source} · p. {contract.page || "—"}
                          </small>
                          {summary && <p className="rule-detail">
                            <strong>{t("ui.summary")}:</strong> {summary}
                          </p>}
                          {contractHasInvocationRoll(presented) === true && <p className="rule-detail">
                            <strong>{t("ui.dicePool")}:</strong>{" "}
                            {presented.dicePool ?? t("ui.notListed")}
                          </p>}
                          {presented.cost && (
                            <p className="rule-detail">
                              <strong>{t("ui.cost")}:</strong> {presented.cost}
                            </p>
                          )}
                          <p className="rule-detail">
                            <strong>{t("ui.actionDuration")}:</strong>{" "}
                            {presented.action ?? t("ui.instant")} ·{" "}
                            {presented.duration ?? t("ui.scene")}
                          </p>
                          {outcomeSections.slice(0, 1).map((section) => (
                            <p className="rule-detail" key={section.label}>
                              <strong>{section.label}:</strong> {section.text}
                            </p>
                          ))}
                          {displayOptions.length > 0 && (
                            <div className="contract-options">
                              <strong>{t("ui.options")}</strong>
                              <ul>
                                {displayOptions.map((option) => (
                                  <li key={option}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {presented.detailTables?.map((table) => (
                            <div className="contract-detail-table" key={table.title}>
                              <strong>{table.title}</strong>
                              <table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row) => <tr key={row.join("::")}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>
                            </div>
                          ))}
                          {outcomeSections.slice(1).map((section) => (
                            <p className="rule-detail" key={section.label}>
                              <strong>{section.label}:</strong> {section.text}
                            </p>
                          ))}
                          <p className="rule-detail">
                            <strong>{t("ui.loophole")}:</strong> {presented.loophole}
                          </p>
                          {contract.goblinDebt && (
                            <p className="rule-detail goblin-debt-note">
                              <strong>{t("ui.goblinDebt")}:</strong>{" "}
                              {contract.goblinDebt}
                            </p>
                          )}
                          {benefit && (
                            <p className="rule-detail">
                              <strong>
                                {t("ui.benefitFor")}{" "}
                                {seemingDisplayName(seeming,locale)}:
                              </strong>{" "}
                              {benefit}
                            </p>
                          )}
                        </div>
                      </SelectableCatalogCard>
                    );
                  })}
                </div>
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



function favoredChoices(type: string) {
  return type === "Power"
    ? ["Intelligence", "Strength", "Presence"]
    : type === "Finesse"
      ? ["Wits", "Dexterity", "Manipulation"]
      : ["Resolve", "Stamina", "Composure"];
}

function emptyContract(type: "Comum" | "Real"): ContractSelection {
  return { id: "", name: "", originalName: "", type, regalia: "", description: "", sourceId: "", source: "", page: 0 };
}
