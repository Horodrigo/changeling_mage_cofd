import { requirementMet, textRequirementMet, type Requirement, type RequirementContext, type TextRequirementEvaluator } from "./merit-requirements";
import type { Specialty } from "./core/character/character-types";
import type { PersistedGameLineId } from "./core/character/game-line-ids";
import type { MessageKey, TranslationParams } from "./i18n";
import type { CatalogNameQualifier } from "./localized-catalog";
import { resolveMeritDefinition, resolveMeritReference } from "./merit-identity";
import { INTERDISCIPLINARY_SPECIALTY_ID, configuredSpecialty, interdisciplinarySpecialties, interdisciplinarySpecialtySelected } from "./core/character/specialty-merits";

export type GameLine = PersistedGameLineId;
export type MeritLevel = { rating: number; name: string; description: string };
export type MeritPresentation = {
  name: string;
  description: string;
  prerequisites?: string;
  alternativePrerequisites?: string;
  levels?: MeritLevel[];
};
export type MeritPresentationCatalog = Readonly<Record<string, MeritPresentation>>;
export type MeritDefinition = {
  id: string;
  name: string;
  nameQualifier?: CatalogNameQualifier;
  ratings: number[];
  line: "Core" | GameLine;
  sourceId: string;
  source: string;
  category: string;
  priority: number;
  translatedName: string;
  description: string;
  descriptionEn: string;
  presentationPt?: MeritPresentation;
  prerequisites?: string;
  page: number;
  levels?: MeritLevel[];
  additionalSources?: ReadonlyArray<{ sourceId: string; source: string; page: number }>;
  alternativePrerequisites?: string;
  requirements?: Requirement;
  excludes?: string[];
  repeatable?: boolean;
  unbounded?: boolean;
  mortalOnly?: boolean;
  homebrew?: true;
  descriptivePrerequisites?: true;
  narrativePrerequisites?: string;
  defaultDisabled?: boolean;
  errataFor?: string;
  errataForName?: string;
  catalogOnly?: boolean;
  replacementCategory?: string;
};

export const meritRatingsFor = (merit: Pick<MeritDefinition, "name" | "ratings" | "unbounded">, ceiling = Math.max(...merit.ratings)) =>
  merit.unbounded ? Array.from({length:Math.max(0,ceiling-Math.min(...merit.ratings))+1},(_,index)=>index+Math.min(...merit.ratings)) : merit.ratings;
export const meritPrerequisitesFor = (merit: Pick<MeritDefinition, "prerequisites">) => merit.prerequisites;

export type MeritPrerequisiteContext = RequirementContext & {
  gameLine: GameLine;
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  size?: number;
  merits?: Array<{ definitionId?: string; sourceId?: string; instanceId?: string; name: string; dots: number; configuration?: Record<string,string|string[]> }>;
  specializations?: readonly Specialty[];
  selectedDots?: number;
  configuration?: Record<string,string|string[]>;
  meritCatalog?: readonly MeritDefinition[];
  /** A line-owned rule may explicitly grant access to mortal-only Merits. */
  mortalMeritsAllowed?: boolean;
};

export function meritPrerequisitesMet(
  merit: Pick<MeritDefinition, "name" | "prerequisites"> & Partial<MeritDefinition>,
  context: MeritPrerequisiteContext,
  parseText = meritTextPrerequisitesMet,
) {
  if(merit.line&&merit.line!=="Core"&&merit.line!==context.gameLine) return false;
  if(merit.mortalOnly && context.gameLine !== "CofD" && !context.mortalMeritsAllowed) return false;
  if(merit.id === "core-2ed:fighting-finesse" && !context.specializations?.some(item => ["Brawl", "Weaponry"].includes(item.skill) && item.name.trim())) return false;
  if (merit.id === INTERDISCIPLINARY_SPECIALTY_ID && !(configuredSpecialty(context.configuration)
    ? interdisciplinarySpecialtySelected(context.configuration, context.specializations, context.skills)
    : interdisciplinarySpecialties(context.specializations, context.skills).length)) return false;
  if(merit.requirements&&!requirementMet(merit.requirements,context)) return false;
  const owned=context.merits??[];
  const forbidden=(definition:Partial<MeritDefinition>)=>definition.descriptivePrerequisites?[]:definition.excludes??definition.prerequisites?.match(/(?:Cannot have|No)\s+([^;,]+)/i)?.slice(1)??[];
  const catalog=context.meritCatalog??[];
  const forbiddenIds=(definition:Partial<MeritDefinition>)=>forbidden(definition).flatMap(reference=>{
    const resolved = resolveMeritReference(reference, definition.excludes ? catalog : catalog.filter(item=>!item.sourceId.startsWith("homebrew:")));
    return resolved ? [resolved.id] : [];
  });
  if(forbiddenIds(merit).some(reference=>requirementMet({merit:reference},context)))return false;
  if(owned.some(item=>{
    const definition = resolveMeritDefinition(item, catalog);
    return item.dots>0 && definition && Boolean(merit.id) && forbiddenIds(definition).includes(merit.id!);
  }))return false;
  if(!merit.descriptivePrerequisites&&!parseText(merit.prerequisites,context)) return false;
  return true;
}

const dotsIn=(value:string)=>[...value].filter((character)=>character==="•").length;
const ATTRIBUTE_NAMES=["Intelligence","Wits","Resolve","Strength","Dexterity","Stamina","Presence","Manipulation","Composure"];
const SKILL_NAMES=["Academics","Computer","Crafts","Investigation","Medicine","Occult","Politics","Science","Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry","Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge"];
function traitValue(name:string,context:MeritPrerequisiteContext){
  const traits={...(context.attributes??{}),...(context.skills??{})};
  return Number(traits[name]??0);
}
export function meritTextPrerequisitesMet(value:string|undefined,context:MeritPrerequisiteContext,evaluateClause?:TextRequirementEvaluator):boolean{
  if(!value) return true;
  // Parse ordinary comma-separated trait and Merit clauses independently.
  // Keep the legacy narrative/group helpers below for general-purpose special wording.
  if(!/one (?:Mental|Physical|Social) Attribute|any Social Skill|≤|maximum|or lower/i.test(value))
    return textRequirementMet(value,context,context.meritCatalog??[],evaluateClause);
  return meritGroupedPrerequisitesMet(value,context);
}

/** Common category/max-rating wording, also composed by line-owned text parsers. */
export function meritGroupedPrerequisitesMet(value:string,context:MeritPrerequisiteContext):boolean{
  const text=value.replace(/≤/g," maximum ");
  return text.split(/[,;]/).every((rawGroup)=>{
    const group=rawGroup.trim();
    if(!group) return true;
    const relativeMerit = group.match(/^maximum\s+(.+)$/i)?.[1];
    if (relativeMerit && ![...ATTRIBUTE_NAMES, ...SKILL_NAMES].includes(relativeMerit)) {
      const definition = resolveMeritReference(relativeMerit, (context.meritCatalog ?? []).filter(item => !item.sourceId.startsWith("homebrew:")));
      return Boolean(definition && requirementMet({ merit: definition.id, minimum: context.selectedDots ?? 1 }, context));
    }
    if(/Cannot have/i.test(group)){
      const forbidden=group.replace(/Cannot have/i,"").trim();
      return !requirementMet({merit:forbidden},context);
    }
    const requiredMerits=(context.meritCatalog??[]).filter((candidate)=>
      !candidate.sourceId.startsWith("homebrew:") && new RegExp(`\\b${candidate.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(group)
    );
    if(requiredMerits.length&&!/\bor\b/i.test(group)){
      if(!requiredMerits.every((required)=>{
        const match=group.match(new RegExp(`${required.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(•+)?`,"i"));
        const threshold=match?.[1]?.length??1;
        return requirementMet({merit:required.id,minimum:threshold},context);
      })) return false;
    }
    if(/one Social Attribute/i.test(group)) return ["Presence","Manipulation","Composure"].some((name)=>traitValue(name,context)>=dotsIn(group));
    if(/one (Mental|Physical|Social) Attribute/i.test(group)){
      const category=/Mental/i.test(group)?ATTRIBUTE_NAMES.slice(0,3):/Physical/i.test(group)?ATTRIBUTE_NAMES.slice(3,6):ATTRIBUTE_NAMES.slice(6);
      return category.some((name)=>traitValue(name,context)>=dotsIn(group));
    }
    if(/any Social Skill/i.test(group)) return ["Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge"].some((name)=>traitValue(name,context)>=dotsIn(group));
    const traitNames=[...ATTRIBUTE_NAMES,...SKILL_NAMES].filter((name)=>new RegExp(`\\b${name.replace(" ","\\s+")}\\b`,"i").test(group));
    const dotGroups=group.match(/•+/g)??[];
    if(traitNames.length){
      const threshold=dotsIn(group)||Number(group.match(/\d+/)?.[0]??0);
      if(/maximum|or lower/i.test(group)) return traitNames.some((name)=>traitValue(name,context)<=(threshold||1));
      if(/\bor\b/i.test(group)||dotGroups.length===1&&traitNames.length>1) return traitNames.some((name)=>traitValue(name,context)>=threshold);
      return traitNames.every((name)=>{
        const match=group.match(new RegExp(`${name.replace(" ","\\s+")}[^•]*(•+)`,"i"));
        return traitValue(name,context)>=(match?.[1]?.length??threshold);
      });
    }
    const extraTrait=Object.keys(context.traits??{}).find(name=>new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(group));
    if(extraTrait) return Number(context.traits?.[extraTrait]??0)>=(dotsIn(group)||Number(group.match(/\d+/)?.[0]??0));
    if(/\bSize\b/i.test(group)) return Number(context.size??5)>=(dotsIn(group)||Number(group.match(/\d+/)?.[0]??0));
    if(requiredMerits.length){
      const threshold=dotsIn(group)||1;
      return /\bor\b/i.test(group)?requiredMerits.some((merit)=>requirementMet({merit:merit.id,minimum:threshold},context)):requiredMerits.every((merit)=>requirementMet({merit:merit.id,minimum:threshold},context));
    }
    return true;
  });
}

/** Neutral outer traits only. Each line supplies its effective Skill bonuses and its own mechanics. */
export function meritContextForSheet(sheet: {game_line:GameLine;attributes:Record<string,number>;skills:Record<string,number>;merits:NonNullable<MeritPrerequisiteContext["merits"]>;specializations?:readonly Specialty[];derived?:Record<string,number>}, meritCatalog?: readonly MeritDefinition[], archetypes?: readonly string[], skillBonuses?: Readonly<Record<string,number>>):MeritPrerequisiteContext {
  const skills={...sheet.skills};
  for(const [name,value]of Object.entries(skillBonuses??{})) skills[name]=(skills[name]??0)+value;
  return {gameLine:sheet.game_line,archetypes,attributes:sheet.attributes,skills,specializations:sheet.specializations ?? [],merits:sheet.merits,meritCatalog,
    size:Number(sheet.derived?.Tamanho??5)};
}

export type MeritSelectionProblem = { key: MessageKey; params?: TranslationParams; meritIds?: readonly string[] };

export function meritSelectionProblems(merit:MeritDefinition,selection:{dots:number;configuration?:Record<string,string|string[]>},context:MeritPrerequisiteContext,isEligible:(merit:MeritDefinition,context:MeritPrerequisiteContext)=>boolean=meritPrerequisitesMet):MeritSelectionProblem[]{
  const config=selection.configuration??{}, problems:MeritSelectionProblem[]=[];
  if(!isEligible(merit,{...context,selectedDots:selection.dots,configuration:config})) problems.push({key:"ui.meritPrerequisitesNotMet",params:{prerequisites:merit.prerequisites??merit.name}});
  if (merit.id === INTERDISCIPLINARY_SPECIALTY_ID && !interdisciplinarySpecialtySelected(config, context.specializations, context.skills)) problems.push({ key: "ui.meritSelectExistingSpecialty" });
  return problems;
}
