"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Search, Trash2 } from "lucide-react";
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
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary } from "@/lib/contract-presentation";
import type { MeritSelection, Specialty } from "@/lib/core/character/character-types";
import type { MeritDefinition, MeritPrerequisiteContext } from "@/lib/merits";
import { alphabetical } from "@/lib/option-order";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { builderText } from "@/app/character-builder-messages";

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
    return locale === "en-US" ? "Courtless" : "Sem Corte";
  const definition = findCourt(catalog, value);
  return definition ? courtName(definition, locale) : raw;
}

export function ChangelingBuilderView(props: ChangelingBuilderViewProps) {
  const { locale, tr } = useLanguage();
  const seemingData = CTL_SEEMINGS[props.seeming as keyof typeof CTL_SEEMINGS];
  const availableRegalia = [
    ...REGALIA,
    ...props.contractCatalog
      .filter(
        (item: ContractDefinition & { categoryKind?: string }) =>
          item.categoryKind === "Regalia",
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
      <span className="kicker">{tr("PASSO 3 · CHANGELING", "STEP 3 · CHANGELING")}</span>
      <h2>{tr("Modelo dos Perdidos", "Lost Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Changeling the Lost.", "The choices and limits below come from Changeling the Lost.")}</p>
      <div className="ctl-template-grid">
        <div className="ctl-template-primary">
          <Choice
            label={tr("Feição", "Seeming")}
            value={props.seeming}
            setValue={props.setSeeming}
            options={Object.keys(CTL_SEEMINGS)}
            optionLabels={Object.fromEntries(Object.entries(CTL_SEEMINGS).map(([name,item])=>[
              name,
              locale === "pt-BR"
                ? `${seemingDisplayName(name, locale)} - favorece a ${systemTerm(item.regalia, locale)}`
                : `${name} - favors the ${item.regalia}`,
            ]))}
            invalid={props.missing("seeming")}
          />
          <Choice
            label={tr("Atributo favorecido (+1)", "Favored Attribute (+1)")}
            value={props.favoredAttribute}
            setValue={props.setFavoredAttribute}
            options={favored}
            invalid={props.missing("favoredAttribute")}
          />
          <div className="regalia-choice-stack">
            <span className="regalia-field-label">{tr("Segunda Regalia favorecida", "Second favored Regalia")}</span>
            <div className="regalia-information" aria-live="polite">
              <strong>{props.secondRegalia ? systemTerm(props.secondRegalia, locale) : tr("Segunda Regalia", "Second Regalia")}</strong>
              <p>{props.secondRegalia
                ? tr(
                    `Esta Regalia favorecida libera seus Contratos Reais (${secondRegaliaRoyalCount} disponíveis nas fontes ativas). Ela não altera a bênção da Feição.`,
                    `This favored Regalia grants access to its Royal Contracts (${secondRegaliaRoyalCount} available from active sources). It does not change the Seeming blessing.`,
                  )
                : tr("Escolha uma segunda Regalia favorecida para liberar outra categoria de Contratos Reais.", "Choose a second favored Regalia to unlock another category of Royal Contracts.")}</p>
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
          powerLabel={tr("Fado inicial", "Wyrd at creation")}
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
              renderCustomField={(kind, field) => kind === "court" ? <Choice label={tr("Corte beneficiada", "Benefited Court")} value={field.value} setValue={field.onChange} options={props.courtCatalog.filter((item) => courtId(props.courtCatalog, item.id ?? item.name) !== courtId(props.courtCatalog, props.court)).map((item) => item.id ?? item.name)} optionLabels={Object.fromEntries(props.courtCatalog.map((item) => [item.id ?? item.name, courtName(item, locale)]))} /> : null}
            />
          )}
        />
      </div>
    </div>
  );
}

function CourtSelector(props: Pick<ChangelingBuilderViewProps,"court"|"setCourt"|"customCourt"|"setCustomCourt"|"courtCatalog">) {
  const { locale, tr } = useLanguage();
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
      <span>{tr("Corte", "Court")}</span>
      <div className="kith-current">
        <strong>{props.court ? courtDisplayName(props.courtCatalog, props.court, locale) : tr("Nenhuma selecionada", "None selected")}</strong>
        <small>
          {!props.court
            ? tr("Nenhuma Corte selecionada: o personagem será salvo como Sem Corte.", "No Court selected: the character will be saved as Courtless.")
            : officialCourt
              ? `${locale === "en-US" ? officialCourt.emotion : (officialCourt.emotionPt ?? officialCourt.emotion)} · ${tr("A Corte concede Manto 1 automaticamente", "The Court grants Mantle 1 automatically")}`
              : tr("Sem benefícios de Manto.", "No Mantle benefits.")}
        </small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Corte", "Select Court")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Corte", "Select Court")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha entre as Cortes consolidadas das fontes ativas.", "Choose among the consolidated Courts from active sources.")}
            </DialogDescription>
          </DialogHeader>
          <div className="court-catalog-filters">
            <label className="merit-search">
              <Search aria-hidden="true" />
              <Input value={courtSearch} onChange={(event) => setCourtSearch(event.target.value)} placeholder={tr("Buscar Corte…", "Search Court…")} />
            </label>
            <Choice label={tr("Fonte", "Source")} value={courtSource} setValue={setCourtSource} options={["all", ...courtSources]} optionLabels={{ all: tr("Todas", "All") }} />
          </div>
          <div className="court-catalog">
            <button type="button" className={!props.court ? "court-option selected" : "court-option"} onClick={() => select("")}>
              <strong>{tr("Sem Corte", "Courtless")}</strong>
              <small>{tr("O personagem não pertence a uma Corte.", "The character does not belong to a Court.")}</small>
            </button>
            {filteredCourts.map((court) => (
              <button type="button" className={courtId(props.courtCatalog, props.court) === courtId(props.courtCatalog, court.value) ? "court-option selected" : "court-option"} key={court.value} onClick={() => select(court.value)}>
                <strong>{court.label}</strong>
                <small>{court.detail}</small>
              </button>
            ))}
            {!filteredCourts.length && <p className="empty-state">{tr("Nenhuma Corte encontrada.", "No Courts found.")}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {tr("Concluir", "Done")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChangelingAnchorSelector({kind,value,setValue,invalid=false}:{kind:"needle"|"thread";value:string;setValue:(value:string)=>void;invalid?:boolean}) {
  const {locale,tr}=useLanguage();
  const [search,setSearch]=useState("");
  const [sourceFilter,setSourceFilter]=useState("all");
  const definitions=kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS;
  const sources=alphabetical([...new Set(definitions.map((item)=>item.source).filter((source):source is string=>Boolean(source)))],(source)=>source,locale);
  const label=kind==="needle"?tr("Agulha","Needle"):tr("Fio","Thread");
  const normalized=search.trim().toLocaleLowerCase(locale);
  const filtered=definitions.filter((item)=>(sourceFilter==="all"||item.source===sourceFilter)&&(!normalized||`${item.name} ${changelingAnchorRecovery(kind,item.name,locale)}`.toLocaleLowerCase(locale).includes(normalized)));
  return <div className={`kith-field anchor-field${invalid?" missing-field":""}`}>
    <span>{label}</span>
    <div className="kith-current"><strong>{value?changelingAnchorDisplayName(kind,value,locale):tr("Nenhuma seleção","None selected")}</strong><small>{value?changelingAnchorRecovery(kind,value,locale).replace("\n"," · "):tr("Consulte os gatilhos de recuperação de Força de Vontade antes de escolher.","Review the Willpower recovery triggers before choosing.")}</small></div>
    <Dialog>
      <DialogTrigger asChild><Button type="button" variant="outline"><Search/> {tr(`Selecionar ${label}`,`Select ${label}`)}</Button></DialogTrigger>
      <DialogContent className="merit-dialog anchor-dialog">
        <DialogHeader><DialogTitle>{tr(`Selecionar ${label}`,`Select ${label}`)}</DialogTitle><DialogDescription>{tr("Cada opção recupera 1 ponto ou toda a Força de Vontade em circunstâncias diferentes.","Each option recovers either 1 point or all Willpower under different circumstances.")}</DialogDescription></DialogHeader>
        <label className="merit-search"><Search aria-hidden="true"/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={tr("Buscar por nome ou gatilho…","Search by name or trigger…")}/></label>
        <div className="catalog-filters anchor-filters"><label>{tr("Fonte","Source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{tr("Todas as Fontes","All Sources")}</SelectItem>{sources.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label></div>
        <div className="merit-catalog anchor-catalog">{filtered.map((item)=><article key={item.name} className={value===item.name?"selected":""}><div><strong>{changelingAnchorDisplayName(kind,item.name,locale)}</strong>{item.source&&<small>{item.source} · p. {item.page}</small>}<p>{changelingAnchorRecovery(kind,item.name,locale).split("\n").map((line,index)=><span key={line}>{index===0?"":""}{line}</span>)}</p></div><DialogClose asChild><Button type="button" size="sm" variant={value===item.name?"secondary":"outline"} onClick={()=>setValue(item.name)}>{value===item.name?tr("Selecionado","Selected"):tr("Selecionar","Select")}</Button></DialogClose></article>)}</div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{tr("Concluir","Done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

function KithSelector(props: Pick<ChangelingBuilderViewProps,"kith"|"setKith"|"kithChoice"|"setKithChoice"|"specialties"|"customKith"|"setCustomKith"|"customKithSkill"|"setCustomKithSkill"|"customKithDescription"|"setCustomKithDescription"|"kithCatalog"|"kithPresentation">) {
  const { locale, tr } = useLanguage();
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
  return (
    <div className="kith-field">
      <span>{tr("Fratria", "Kith")}</span>
      <div className={`kith-current${creationChoice?" has-choice":""}`}>
        <div className="kith-choice-row">
          <strong>{(selected ? kithName(selected) : props.kith) || tr("Nenhuma selecionada", "None selected")}</strong>
          {creationChoice&&(creationChoice.kind==="text"?
            <Input className="kith-choice-inline" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn} value={props.kithChoice} onChange={event=>props.setKithChoice(event.target.value)} placeholder={locale==="pt-BR"?creationChoice.placeholderPt:creationChoice.placeholderEn}/>
            : <Select value={props.kithChoice} onValueChange={props.setKithChoice} disabled={!creationChoiceOptions.length}><SelectTrigger className={`kith-choice-inline${props.kithChoice?"":" missing-choice"}`} size="sm" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn}><SelectValue placeholder={creationChoice.kind==="specialty"&&!creationChoiceOptions.length?tr("Escolha uma Especialização","Choose a Specialty"):(locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn)}/></SelectTrigger><SelectContent>{creationChoiceOptions.map(option=>{const [skill,...detail]=option.split(": ");return <SelectItem key={option} value={option}>{detail.length?`${systemTerm(skill,locale)}: ${detail.join(": ")}`:systemTerm(option,locale)}</SelectItem>;})}</SelectContent></Select>
          )}
        </div>
        <small>{selected?`${kithText(selected).skill} · ${selected.source} · p. ${selected.page}`:tr("Abra o catálogo para escolher","Open the catalog to choose")}</small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Fratria", "Select Kith")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog kith-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Fratria", "Select Kith")}</DialogTitle>
            <DialogDescription>
              {tr("Consulte descrição, Perícia e Bênção antes de escolher.", "Review the description, Skill, and Blessing before choosing.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar Fratria, Perícia ou fonte…", "Search Kith, Skill, or source…")}
            />
          </label>
          <div className="catalog-filters kith-filters">
            <label>{tr("Perícia","Skill")}<Select value={skillFilter} onValueChange={setSkillFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="all">{tr("Todas as Perícias","All Skills")}</SelectItem>
              {skillGroups.map((group)=><SelectGroup key={group.category}>
                <SelectSeparator/><SelectLabel>{systemTerm(group.category,locale)}</SelectLabel>
                {group.skills.map(skill=><SelectItem key={skill} value={skill}>{systemTerm(skill,locale)}</SelectItem>)}
              </SelectGroup>)}
              {otherSkillOptions.length>0&&<SelectGroup><SelectSeparator/><SelectLabel>{tr("Outras opções","Other options")}</SelectLabel>{otherSkillOptions.map(option=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectGroup>}
            </SelectContent></Select></label>
            <label>{tr("Fonte","Source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{tr("Todas as Fontes","All Sources")}</SelectItem>{sourceOptions.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label>
          </div>
          <div className="merit-catalog">
            <section className="merit-category">
              <h3>
                {tr("Fratrias", "Kiths")} <Badge variant="outline">{filtered.length}</Badge>
              </h3>
              <div>
                {filtered.map((item) => {
                  const presentation=kithText(item);
                  const isSelected =
                    selected?.id === item.id;
                  return (
                    <article
                      className={
                        isSelected ? "merit-option selected" : "merit-option"
                      }
                      key={item.id}
                    >
                      <div>
                        <strong>{kithName(item)}</strong>
                        {locale === "pt-BR" && item.translatedName && item.translatedName !== item.name && <small>{item.name}</small>}
                        <small>
                          {presentation.skill} · {item.source} · p. {item.page}
                        </small>
                        <p>{presentation.description}</p>
                        <p className="rule-detail">
                          <strong>{tr("Bênção", "Blessing")}:</strong> {presentation.blessing}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "secondary" : "outline"}
                        disabled={isSelected}
                        onClick={() => choose(item)}
                      >
                        {isSelected ? (
                          <>
                            <Check />
                            {tr("Selecionada", "Selected")}
                          </>
                        ) : (
                          <>
                            <Plus />
                            {tr("Escolher", "Choose")}
                          </>
                        )}
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
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
  const { locale, tr } = useLanguage();
  const contractName = (item: ContractDefinition | ContractSelection) => locale === "pt-BR" ? item.name : (item.originalName || item.name);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [regaliaFilter, setRegaliaFilter] = useState("all");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const commonFull = contracts.slice(0, 4).every((item) => item.name);
  const royalFull = contracts.slice(4).every((item) => item.name);
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
      (regaliaFilter === "all" || contract.regalia === regaliaFilter) &&
      (!((contract.type === "Comum" ? commonFull : royalFull)) || contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName)),
    );
  const contractGroups = [
    ...REGALIA,
    ...availableContracts.map((item) => item.regalia).filter(
      (item) => !REGALIA.includes(item),
    ),
  ];
  const groups = alphabetical([...new Set(contractGroups)], value => builderText(locale,value),locale)
    .map((regalia) => ({
      regalia,
      items: availableContracts.filter(
        (item) =>
          item.regalia === regalia &&
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
  return (
    <>
      <Dialog>
      <div className="merit-heading">
        <div>
          <h3>{tr("Contratos iniciais", "Starting Contracts")}</h3>
          <p>
            {tr("Selecione quatro Contratos Comuns — incluindo Contratos Goblin — e dois Reais. Expanda uma escolha para rever todos os detalhes.", "Select four Common Contracts — including Goblin Contracts — and two Royal Contracts. Expand a choice to review all details.")}
          </p>
        </div>
        <div className="merit-heading-actions"><Badge variant="outline">
          {contracts.filter((item) => item.name).length}/6 {tr("selecionados", "selected")}
        </Badge><DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="builder-add-action">{tr("Adicionar Contrato", "Add Contract")}</Button></DialogTrigger></div>
      </div>
      <DialogContent className="merit-dialog">
        <DialogHeader>
          <DialogTitle>{tr("Adicionar Contrato", "Add Contract")}</DialogTitle>
          <DialogDescription>
            {tr("Separados por Regalia, com efeito, brecha, parada de dados e o benefício da Feição atual. Contratos Goblin ocupam vagas de Contrato Comum e geram Débito Goblin quando invocados com sucesso. Contratos Reais respeitam suas Regalias favorecidas; Contratos de Corte respeitam a Corte selecionada.", "Grouped by Regalia, with effect, loophole, dice pool, and the current Seeming benefit. Goblin Contracts fill Common Contract slots and generate Goblin Debt when successfully invoked. Royal Contracts follow favored Regalia; Court Contracts follow the selected Court.")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("Buscar contrato, Regalia ou fonte…", "Search Contract, Regalia, or source…")} /></label>
          <Choice value={typeFilter} setValue={setTypeFilter} options={["all","common","royal"]} optionLabels={{all:tr("Todos os tipos","All types"),common:tr("Comum","Common"),royal:tr("Real","Royal")}} />
          <Choice value={regaliaFilter} setValue={setRegaliaFilter} options={["all",...alphabetical([...new Set(catalog.map((item)=>item.regalia))],(item)=>systemTerm(item,locale),locale)]} optionLabels={{all:tr("Todas as categorias","All categories"),...Object.fromEntries(catalog.map((item)=>[item.regalia,systemTerm(item.regalia,locale)]))}} />
        </div>
        <div className="merit-catalog">
          {groups.map(({ regalia, items }) => (
            <section className="merit-category" key={regalia}>
              <h3>{systemTerm(regalia,locale)} <Badge variant="outline">{items.length}</Badge></h3>
              <div>
                {items.map((contract) => {
                  const presented = contractPresentation(contract, locale);
                  const summary = contractSummary(contract, locale);
                  const displayOptions = contractDisplayOptions(presented, locale);
                  const outcomeSections = contractOutcomeSections(presented, locale);
                  const selected = contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName);
                  const full = contract.type === "Comum" ? commonFull : royalFull;
                  const benefit = presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
                  return <article className={selected ? "merit-option selected" : "merit-option"} key={contract.id}><div><strong>{contractName(contract)}</strong><small>{contract.goblin ? "Goblin" : contract.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")} · {contract.source} · p. {contract.page || "—"}</small>{summary && <p className="rule-detail"><strong>{tr("Resumo", "Summary")}:</strong> {summary}</p>}{contractHasInvocationRoll(presented) === true && <p className="rule-detail"><strong>{tr("Parada de dados", "Dice Pool")}:</strong> {presented.dicePool ?? tr("Não informada", "Not listed")}</p>}{presented.cost && <p className="rule-detail"><strong>{tr("Custo", "Cost")}:</strong> {presented.cost}</p>}{displayOptions.length > 0 && <p className="rule-detail"><strong>{tr("Opções", "Options")}:</strong> {displayOptions.join(" · ")}</p>}{outcomeSections[0]?.text && <p className="rule-detail">{outcomeSections[0].text}</p>}{benefit && <p className="rule-detail"><strong>{tr("Benefício", "Benefit")}:</strong> {benefit}</p>}</div><Button type="button" size="sm" variant={selected ? "secondary" : "outline"} disabled={selected || full} onClick={() => addContract(contract)}>{selected ? tr("Selecionado", "Selected") : tr("Adicionar", "Add")}</Button></article>;
                })}
              </div>
            </section>
          ))}
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{tr("Concluir", "Done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
      </Dialog>
      <div className="contract-power-list creation-contract-list">
        {contracts.map((item,index)=>{
          if(!item.name)return <article className="creation-contract-empty" key={index}><Badge variant={index<4?"secondary":"outline"}>{index<4?tr("Comum","Common"):tr("Real","Royal")}</Badge><div><strong>{tr("Vaga disponível","Available slot")}</strong><small>{tr("Escolha no catálogo","Choose from the catalog")}</small></div></article>;
          const presented=contractPresentation(item,locale),summary=contractSummary(item,locale),displayOptions=contractDisplayOptions(presented,locale),outcomes=contractOutcomeSections(presented,locale);
          const benefit=presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
          return <details className="contract-power-card" key={`${item.id}-${index}`}>
            <summary className="contract-power-summary"><strong>{contractName(item)}</strong><Badge variant={item.goblin?"default":"outline"}>{item.goblin?"Goblin":index<4?tr("Comum","Common"):tr("Real","Royal")}</Badge><small>{systemTerm(item.regalia,locale)} · {item.source} · p. {item.page||"—"}</small></summary>
            <div className="contract-power-details"><dl>
              {summary&&<div><dt>{tr("Resumo","Summary")}</dt><dd>{summary}</dd></div>}
              {contractHasInvocationRoll(presented)===true&&<div><dt>{tr("Parada de dados","Dice Pool")}</dt><dd>{presented.dicePool??tr("Não informada","Not listed")}</dd></div>}
              <div><dt>{tr("Custo","Cost")}</dt><dd>{presented.cost??tr("Conforme descrição","As described")}</dd></div>
              <div><dt>{tr("Ação / Duração","Action / Duration")}</dt><dd>{presented.action??tr("Instantânea","Instant")} · {presented.duration??tr("Cena","Scene")}</dd></div>
              {outcomes.map(section=><div key={section.label}><dt>{section.label}</dt><dd>{section.text}</dd></div>)}
              {displayOptions.length>0&&<div className="contract-options"><dt>{tr("Opções","Options")}</dt><dd><ul>{displayOptions.map(option=><li key={option}>{option}</li>)}</ul></dd></div>}
              {presented.detailTables?.map(table=><div className="contract-detail-table" key={table.title}><dt>{table.title}</dt><dd><table><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map(row=><tr key={row.join("::")}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd></div>)}
              <div><dt>{tr("Brecha","Loophole")}</dt><dd>{presented.loophole}</dd></div>
              {item.goblinDebt&&<div className="goblin-debt-row"><dt>{tr("Débito Goblin","Goblin Debt")}</dt><dd>{item.goblinDebt}</dd></div>}
              {benefit&&<div><dt>{tr("Benefício de","Benefit for")} {seemingDisplayName(seeming,locale)}</dt><dd>{benefit}</dd></div>}
            </dl><Button type="button" variant="outline" size="sm" onClick={()=>removeContract(index)}><Trash2/>{tr("Remover Contrato","Remove Contract")}</Button></div>
          </details>;
        })}
      </div>
      <Dialog>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar contratos", "Select Contracts")}</DialogTitle>
            <DialogDescription>
              {tr("Separados por Regalia, com efeito, brecha, parada de dados e o benefício da Feição atual. Contratos Goblin ocupam vagas de Contrato Comum e geram Débito Goblin quando invocados com sucesso. Contratos Reais respeitam suas Regalias favorecidas; Contratos de Corte respeitam a Corte selecionada.", "Grouped by Regalia, with effect, loophole, dice pool, and the current Seeming benefit. Goblin Contracts fill Common Contract slots and generate Goblin Debt when successfully invoked. Royal Contracts follow favored Regalia; Court Contracts follow the selected Court.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar contrato, Regalia ou fonte…", "Search Contract, Regalia, or source…")}
            />
          </label>
          <div className="merit-catalog">
            {groups.map(({ regalia, items }) => (
              <section className="merit-category" key={regalia}>
                <h3>
                  {systemTerm(regalia,locale)} <Badge variant="outline">{items.length}</Badge>
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
                      <article
                        className={
                          selected ? "merit-option selected" : "merit-option"
                        }
                        key={contract.id}
                      >
                        <div>
                          <strong>{contractName(contract)}</strong>
                          <small>
                            {contract.goblin ? "Goblin" : contract.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")}{" "}
                            · {contract.source} · p. {contract.page || "—"}
                          </small>
                          {summary && <p className="rule-detail">
                            <strong>{tr("Resumo", "Summary")}:</strong> {summary}
                          </p>}
                          {contractHasInvocationRoll(presented) === true && <p className="rule-detail">
                            <strong>{tr("Parada de dados", "Dice Pool")}:</strong>{" "}
                            {presented.dicePool ?? tr("Não informada", "Not listed")}
                          </p>}
                          {presented.cost && (
                            <p className="rule-detail">
                              <strong>{tr("Custo", "Cost")}:</strong> {presented.cost}
                            </p>
                          )}
                          <p className="rule-detail">
                            <strong>{tr("Ação / Duração", "Action / Duration")}:</strong>{" "}
                            {presented.action ?? tr("Instantânea", "Instant")} ·{" "}
                            {presented.duration ?? tr("Cena", "Scene")}
                          </p>
                          {outcomeSections.slice(0, 1).map((section) => (
                            <p className="rule-detail" key={section.label}>
                              <strong>{section.label}:</strong> {section.text}
                            </p>
                          ))}
                          {displayOptions.length > 0 && (
                            <div className="contract-options">
                              <strong>{tr("Opções", "Options")}</strong>
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
                            <strong>{tr("Brecha", "Loophole")}:</strong> {presented.loophole}
                          </p>
                          {contract.goblinDebt && (
                            <p className="rule-detail goblin-debt-note">
                              <strong>{tr("Débito Goblin", "Goblin Debt")}:</strong>{" "}
                              {contract.goblinDebt}
                            </p>
                          )}
                          {benefit && (
                            <p className="rule-detail">
                              <strong>
                                {tr("Benefício de", "Benefit for")}{" "}
                                {seemingDisplayName(seeming,locale)}:
                              </strong>{" "}
                              {benefit}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={selected ? "secondary" : "outline"}
                          disabled={selected || full}
                          onClick={() => addContract(contract)}
                        >
                          {selected ? (
                            <>
                              <Check />
                              {tr("Selecionado", "Selected")}
                            </>
                          ) : full ? (
                            tr("Vagas preenchidas", "Slots filled")
                          ) : (
                            <>
                              <Plus />
                              {tr("Adicionar", "Add")}
                            </>
                          )}
                        </Button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



function favoredChoices(type: string) {
  return type === "Power"
    ? ["Inteligência", "Força", "Presença"]
    : type === "Finesse"
      ? ["Raciocínio", "Destreza", "Manipulação"]
      : ["Perseverança", "Vigor", "Compostura"];
}

function emptyContract(type: "Comum" | "Real"): ContractSelection {
  return { id: "", name: "", originalName: "", type, regalia: "", description: "", sourceId: "", source: "", page: 0 };
}
