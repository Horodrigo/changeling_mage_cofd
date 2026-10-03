import { resolveMeritDefinition, resolveMeritReference, type DefinitionIdentity } from "./merit-identity";

/** Structured requirements reference catalog identities, never localized display labels. */
export type Requirement =
  | { all: Requirement[] } | { any: Requirement[] } | { not: Requirement }
  | { trait: string; minimum: number }
  // `name` is a display fallback only; it never replaces the referenced ID.
  | { merit: string; minimum?: number; name?: string }
  | { line: string } | { path: string } | { kith: string } | { seeming: string }
  | { status: string; minimum: number };

export type RequirementContext = {
  gameLine: string; attributes?: Record<string, number>; skills?: Record<string, number>;
  archetypes?: readonly string[];
  gnosis?: number; wyrd?: number; size?: number; arcana?: Record<string, number>;
  path?: string; order?: string; kith?: string; seeming?: string;
  merits?: Array<{ definitionId?: string; sourceId?: string; instanceId?: string; name: string; dots: number; configuration?: Record<string,string|string[]> }>;
  meritCatalog?: readonly DefinitionIdentity[];
  /** The owning line supplies additional Status identities and its domain aliases. */
  statusMeritIds?: readonly string[];
  statusDomainAliases?: Readonly<Record<string, string>>;
};
export const canonicalTrait = (value: unknown) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const aliases: Record<string,string> = {
  intelligence:"Intelligence", wits:"Wits", resolve:"Resolve", strength:"Strength", dexterity:"Dexterity", stamina:"Stamina", presence:"Presence", manipulation:"Manipulation", composure:"Composure",
  academics:"Academics", computer:"Computer", crafts:"Crafts", investigation:"Investigation", medicine:"Medicine", occult:"Occult", politics:"Politics", science:"Science", athletics:"Athletics", brawl:"Brawl", drive:"Drive", firearms:"Firearms", larceny:"Larceny", stealth:"Stealth", survival:"Survival", weaponry:"Weaponry", animalken:"Animal Ken", empathy:"Empathy", expression:"Expression", intimidation:"Intimidation", persuasion:"Persuasion", socialize:"Socialize", streetwise:"Streetwise", subterfuge:"Subterfuge",
  death:"Death", fate:"Fate", forces:"Forces", life:"Life", matter:"Matter", mind:"Mind", prime:"Prime", space:"Space", spirit:"Spirit", time:"Time",
};
export function requirementTrait(name:string, context:RequirementContext):number {
  const key=canonicalTrait(name);
  if(key==="gnosis"||key==="gnose") return Number(context.gnosis??0);
  if(key==="wyrd"||key==="fado") return Number(context.wyrd??0);
  if(key==="size") return Number(context.size??5);
  const keys=[key,canonicalTrait(aliases[key])];
  const values={...context.attributes,...context.skills,...context.arcana};
  return Math.max(0,...Object.entries(values).filter(([name])=>keys.includes(canonicalTrait(name))).map(([,value])=>Number(value)||0));
}
/**
 * Resolve a Status domain from any line without teaching Core which factions exist.
 * Status Merits declare their domain in either `domain` (Mage) or `group` (generic
 * Status/Kindred Status configuration); line modules supply the canonical label.
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
  if("path" in requirement) return canonicalTrait(context.path)===canonicalTrait(requirement.path);
  if("kith" in requirement) return canonicalTrait(context.kith)===canonicalTrait(requirement.kith);
  return canonicalTrait(context.seeming)===canonicalTrait(requirement.seeming);
}

/** Spell out AND/OR grouping in catalog text; a shared trailing rating applies to every OR branch. */
export function textRequirementMet(text:string,context:RequirementContext,meritCatalog:readonly DefinitionIdentity[]):boolean {
  const value=text.trim().replace(/^[,(\s]+|[,)\s]+$/g,"");
  if(!value||value==="-"||/^none$/i.test(value)) return true;
  const and=value.split(/\s*[,;]\s*|\s+and\s+/i);
  if(and.length>1) return and.every(part=>textRequirementMet(part,context,meritCatalog));
  if(/^(?:Cannot have|No)\s+/i.test(value)) return !textRequirementMet(value.replace(/^(?:Cannot have|No)\s+/i,""),context,meritCatalog);
  const or=value.split(/\s+or\s+/i);
  if(or.length>1){
    const trailing=value.match(/(•+|\d+\+?)\s*$/)?.[1];
    return or.some(part=>textRequirementMet(trailing&&!/[•\d]/.test(part)?`${part} ${trailing}`:part,context,meritCatalog));
  }
  const hasArchetype=(archetype:string)=>(context.archetypes??[]).includes(archetype);
  if(/^non[- ]?(?:Awakened|mage)$/i.test(value)) return !hasArchetype("awakened");
  if(/^non[- ]?changeling$/i.test(value)) return !hasArchetype("changeling");
  if(/^(?:Awakened|Mage)$/i.test(value)) return hasArchetype("awakened");
  if(/^Changeling$/i.test(value)) return hasArchetype("changeling");
  if(/^Sleepwalker$/i.test(value)) return false;
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
  if(aliases[key]||["gnosis","gnose","wyrd","fado","size"].includes(key)) return requirementTrait(name,context)>=minimum;
  if(/\bkith\b/i.test(name)) return requirementMet({kith:name.replace(/\bkith\b/ig,"").trim()},context);
  if(["Beast","Darkling","Elemental","Fairest","Ogre","Wizened"].some(item=>canonicalTrait(item)===key)) return requirementMet({seeming:name},context);
  if(["Acanthus","Mastigos","Moros","Obrimos","Thyrsus"].some(item=>canonicalTrait(item)===key)) return requirementMet({path:name},context);
  // Narrative prerequisites remain table adjudication, never fabricated trait values.
  return true;
}
