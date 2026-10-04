import { resolveMeritDefinition, resolveMeritReference, type DefinitionIdentity } from "./merit-identity";

/** Structured requirements reference catalog identities, never localized display labels. */
export type Requirement =
  | { all: Requirement[] } | { any: Requirement[] } | { not: Requirement }
  | { trait: string; minimum: number }
  // `name` is a display fallback only; it never replaces the referenced ID.
  | { merit: string; minimum?: number; name?: string }
  | { line: string }
  | { status: string; minimum: number };

export type RequirementContext = {
  gameLine: string; attributes?: Record<string, number>; skills?: Record<string, number>;
  archetypes?: readonly string[];
  size?: number;
  /** Explicit numeric traits supplied by the owning line; Core never interprets line_data. */
  traits?: Readonly<Record<string, number>>;
  merits?: Array<{ definitionId?: string; sourceId?: string; instanceId?: string; name: string; dots: number; configuration?: Record<string,string|string[]> }>;
  meritCatalog?: readonly DefinitionIdentity[];
  /** The owning line supplies additional Status identities and its domain aliases. */
  statusMeritIds?: readonly string[];
  statusDomainAliases?: Readonly<Record<string, string>>;
};
export const canonicalTrait = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const aliases: Record<string,string> = {
  willpower:"Willpower",
  intelligence:"Intelligence", wits:"Wits", resolve:"Resolve", strength:"Strength", dexterity:"Dexterity", stamina:"Stamina", presence:"Presence", manipulation:"Manipulation", composure:"Composure",
  academics:"Academics", computer:"Computer", crafts:"Crafts", investigation:"Investigation", medicine:"Medicine", occult:"Occult", politics:"Politics", science:"Science", athletics:"Athletics", brawl:"Brawl", drive:"Drive", firearms:"Firearms", larceny:"Larceny", stealth:"Stealth", survival:"Survival", weaponry:"Weaponry", animalken:"Animal Ken", empathy:"Empathy", expression:"Expression", intimidation:"Intimidation", persuasion:"Persuasion", socialize:"Socialize", streetwise:"Streetwise", subterfuge:"Subterfuge",
};
export function requirementTrait(name:string, context:RequirementContext):number {
  const key=canonicalTrait(name);
  if(key==="size") return Number(context.size??5);
  const keys=[key,canonicalTrait(aliases[key])];
  const values={...context.attributes,...context.skills,...context.traits};
  if(key==="willpower"&&!Object.keys(values).some(name=>canonicalTrait(name)===key))
    return requirementTrait("Resolve",context)+requirementTrait("Composure",context);
  return Math.max(0,...Object.entries(values).filter(([name])=>keys.includes(canonicalTrait(name))).map(([,value])=>Number(value)||0));
}
/**
 * Resolve a Status domain from any line without teaching Core which factions exist.
 * Status Merits declare their domain in either `domain` or `group` configuration;
 * line modules supply the canonical identity and domain aliases.
 */
export function statusRating(context:RequirementContext,domain:string):number {
  const expected=canonicalTrait(domain);
  const ids = ["core-2ed:status", ...(context.statusMeritIds ?? [])];
  return Math.max(0,...(context.merits??[]).filter(item=>ids.includes(resolveMeritDefinition(item, context.meritCatalog ?? [])?.id ?? "")&&(
    domain==="any"||[item.configuration?.domain,item.configuration?.group]
      .some(value=>canonicalTrait(value)===expected)
  )).map(item=>item.dots));
}
export function requirementMet(requirement:Requirement,context:RequirementContext):boolean {
  if("all" in requirement) return requirement.all.every(item=>requirementMet(item,context));
  if("any" in requirement) return requirement.any.some(item=>requirementMet(item,context));
  if("not" in requirement) return !requirementMet(requirement.not,context);
  if("line" in requirement) return context.gameLine===requirement.line;
  if("trait" in requirement) return requirementTrait(requirement.trait,context)>=requirement.minimum;
  if("merit" in requirement) {
    const definition = resolveMeritReference(requirement.merit, context.meritCatalog ?? []);
    return Boolean(definition && (context.merits??[]).some(item=>resolveMeritDefinition(item, context.meritCatalog ?? [])?.id === definition.id && item.dots >= (requirement.minimum ?? 1)));
  }
  if("status" in requirement) return statusRating(context,requirement.status)>=requirement.minimum;
  return false;
}

export type TextRequirementEvaluator = (clause: string) => boolean | undefined;

/** Spell out AND/OR grouping in catalog text; a shared trailing rating applies to every OR branch. */
export function textRequirementMet(text:string,context:RequirementContext,meritCatalog:readonly DefinitionIdentity[],evaluateClause?:TextRequirementEvaluator):boolean {
  const value=text.trim().replace(/^[,(\s]+|[,)\s]+$/g,"");
  if(!value||value==="-"||/^none$/i.test(value)) return true;
  const and=value.split(/\s*[,;]\s*|\s+and\s+/i);
  if(and.length>1) return and.every(part=>textRequirementMet(part,context,meritCatalog,evaluateClause));
  if(/^(?:Cannot have|No)\s+/i.test(value)) return !textRequirementMet(value.replace(/^(?:Cannot have|No)\s+/i,""),context,meritCatalog,evaluateClause);
  const or=value.split(/\s+or\s+/i);
  if(or.length>1){
    const trailing=value.match(/(•+|\d+\+?)\s*$/)?.[1];
    return or.some(part=>textRequirementMet(trailing&&!/[•\d]/.test(part)?`${part} ${trailing}`:part,context,meritCatalog,evaluateClause));
  }
  const rating=value.match(/•+|\d+/), minimum=rating?(rating[0].startsWith("•")?rating[0].length:Number(rating[0])):1;
  const name=value.replace(/\s*(?:•+|\d+\+?).*$/,"").trim();
  const key=canonicalTrait(name);
  // Bind canonical printed names before interpreting domain phrases such as "Arrow Status".
  // Player-created namesakes cannot satisfy a distributed definition's requirement.
  const matches=meritCatalog.filter(item=>!item.sourceId.startsWith("homebrew:") && canonicalTrait(item.name)===canonicalTrait(name.replace(/\s*\([^)]*\)$/, "")));
  if(matches.length) return matches.length === 1 && requirementMet({merit:matches[0].id,minimum},context);
  if(/Status$/i.test(name)){
    const domain=name.replace(/\s*Status$/i,"");
    if(domain) return statusRating(context,context.statusDomainAliases?.[domain]??domain)>=minimum;
  }
  const lineResult=evaluateClause?.(value);
  if(lineResult!==undefined) return lineResult;
  if(aliases[key]||key==="size"||Object.keys(context.traits??{}).some(trait=>canonicalTrait(trait)===key)) return requirementTrait(name,context)>=minimum;
  // Narrative prerequisites remain table adjudication, never fabricated trait values.
  return true;
}
