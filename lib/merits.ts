import { MERITS_EN } from "./merits-en.generated";
import { SUPPLEMENTAL_MERITS_EN } from "./merits-supplements-en";
import { BOOK_OF_SEEMINGS_MERITS_EN } from "./merits-book-of-seemings-en";

export type GameLine = "CtL" | "MtA";
export type MeritLevel = { rating: number; name: string; description: string };
export type MeritDefinition = {
  id: string;
  name: string;
  ratings: number[];
  line: "Core" | GameLine;
  sourceId: string;
  source: string;
  category: string;
  priority: number;
  translatedName: string;
  description: string;
  descriptionEn: string;
  prerequisites?: string;
  page: number;
  levels?: MeritLevel[];
  courtAccess?: Array<{ court: "Spring" | "Summer" | "Autumn" | "Winter"; mantle: number; courtGoodwill?: number }>;
  additionalSources?: Array<{ sourceId: string; source: string; page: number }>;
  seeming?: "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";
  alternativePrerequisites?: string;
};

export const RAW_MERITS: MeritDefinition[] = [...MERITS_EN, ...SUPPLEMENTAL_MERITS_EN, ...BOOK_OF_SEEMINGS_MERITS_EN].map((item) => ({
  ...item,
  ratings: [...item.ratings],
  levels: "levels" in item ? item.levels.map((level) => ({ ...level })) : undefined,
  prerequisites: item.prerequisites ?? undefined,
  priority: item.line === "CtL" ? 2 : 1,
  // English is canonical. Portuguese fields intentionally fall back to English
  // until the separately audited translation phase.
  translatedName: item.name,
  descriptionEn: item.description,
  description: item.description,
}));

export const REPEATABLE_MERITS = new Set([
  "Allies", "Alternate Identity", "Court Goodwill", "Fae Mount",
  "Language", "Library", "Mentor", "Retainer", "Safe Place", "Status",
  "Striking Looks", "Token",
  "Hedge Duelist", "Hollow", "Stable Trod", "Shared Bastion", "Acquired Taste",
]);
export const UNBOUNDED_MERITS = new Set(["Contacts", "Staff"]);
export const EXTENDED_DOT_MERITS = new Set(["Token"]);
export const meritRatingsFor = (merit: Pick<MeritDefinition, "name" | "ratings">, ceiling = Math.max(...merit.ratings)) =>
  UNBOUNDED_MERITS.has(merit.name) ? Array.from({length:Math.max(1,ceiling)},(_,index)=>index+1) : merit.ratings;
export const meritPrerequisitesFor = (merit: Pick<MeritDefinition, "prerequisites">) => merit.prerequisites;

export type MeritPrerequisiteContext = {
  gameLine: GameLine;
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  seeming?: string;
  wyrd?: number;
  size?: number;
  powers?: string[];
  court?: string;
  mantle?: number;
  merits?: Array<{ name: string; dots: number; configuration?: Record<string,string|string[]> }>;
};

const courtKey=(value:unknown)=>String(value??"").toLowerCase().replace(/^court[- ]/,"").replace(/[- ]court$/,"").replace(/[^a-z]/g,"");

export function meritPrerequisitesMet(
  merit: Pick<MeritDefinition, "name" | "prerequisites" | "courtAccess" | "seeming" | "alternativePrerequisites">,
  context: MeritPrerequisiteContext,
) {
  if (merit.name === "Lucid Dreamer" && context.gameLine === "CtL") return false;
  let usedSeemingAlternative=false;
  if(merit.seeming&&context.gameLine==="CtL"&&courtKey(context.seeming)!==courtKey(merit.seeming)){
    if(!merit.alternativePrerequisites||!simplePrerequisitesMet(merit.alternativePrerequisites,context)) return false;
    usedSeemingAlternative=true;
  }
  let printedPrerequisites=merit.prerequisites;
  if(merit.courtAccess?.length&&context.gameLine==="CtL"){
    const ownCourt=courtKey(context.court);
    const mantle=Math.max(0,Number(context.mantle??context.merits?.find((item)=>item.name==="Mantle")?.dots??0));
    const goodwill=new Map((context.merits??[]).filter((item)=>item.name==="Court Goodwill").map((item)=>[courtKey(item.configuration?.court),Number(item.dots??0)]));
    if(!merit.courtAccess.some((access)=>
      (ownCourt===courtKey(access.court)&&mantle>=access.mantle)||
      (access.courtGoodwill!==undefined&&(goodwill.get(courtKey(access.court))??0)>=access.courtGoodwill)
    )) return false;
    // Seasonal records prefix their generated Mantle/Goodwill access summary;
    // courtAccess above is authoritative, so only evaluate the printed remainder.
    printedPrerequisites=printedPrerequisites?.includes(";")?printedPrerequisites.split(";").slice(1).join(";").trim():undefined;
  }
  if(!usedSeemingAlternative&&!catalogPrerequisitesMet(printedPrerequisites,context)) return false;
  return true;
}

const dotsIn=(value:string)=>[...value].filter((character)=>character==="•").length;
const traitAliases:Record<string,string>={
  Intelligence:"Inteligência",Wits:"Raciocínio",Resolve:"Determinação",Strength:"Força",Dexterity:"Destreza",Stamina:"Vigor",Presence:"Presença",Manipulation:"Manipulação",Composure:"Autocontrole",
  Academics:"Erudição",Computer:"Informática",Crafts:"Ofícios",Investigation:"Investigação",Medicine:"Medicina",Occult:"Ocultismo",Politics:"Política",Science:"Ciência",Athletics:"Atletismo",Brawl:"Briga",Drive:"Condução",Firearms:"Armas de Fogo",Larceny:"Furto",Stealth:"Furtividade",Survival:"Sobrevivência",Weaponry:"Armamento",AnimalKen:"Empatia com Animais",Empathy:"Empatia",Expression:"Expressão",Intimidation:"Intimidação",Persuasion:"Persuasão",Socialize:"Socialização",Streetwise:"Manha",Subterfuge:"Lábia",
};
function simplePrerequisitesMet(value:string,context:MeritPrerequisiteContext){
  return catalogPrerequisitesMet(value,context);
}

const ATTRIBUTE_NAMES=["Intelligence","Wits","Resolve","Strength","Dexterity","Stamina","Presence","Manipulation","Composure"];
const SKILL_NAMES=["Academics","Computer","Crafts","Investigation","Medicine","Occult","Politics","Science","Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry","Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge"];
const SEEMING_NAMES=["Beast","Darkling","Elemental","Fairest","Ogre","Wizened"];
function traitValue(name:string,context:MeritPrerequisiteContext){
  const traits={...(context.attributes??{}),...(context.skills??{})};
  const alias=traitAliases[name.replace(/\s/g,"")]??traitAliases[name]??name;
  return Number(traits[name]??traits[alias]??0);
}
function catalogPrerequisitesMet(value:string|undefined,context:MeritPrerequisiteContext){
  if(!value) return true;
  const text=value.replace(/≤/g," maximum ");
  if(/Non-changeling/i.test(text)&&context.gameLine==="CtL") return false;
  return text.split(";").every((rawGroup)=>{
    const group=rawGroup.trim();
    if(!group) return true;
    const currentSeeming=SEEMING_NAMES.find((name)=>courtKey(name)===courtKey(context.seeming));
    if(currentSeeming&&new RegExp(`\\b${currentSeeming}\\b`).test(group)&&!new RegExp(`\\bor\\b`,"i").test(group)){
      const rest=group.replace(new RegExp(`\\b${currentSeeming}\\b[,]?`,"i"),"").trim();
      return rest?catalogPrerequisitesMet(rest,context):true;
    }
    if(/Cannot have/i.test(group)){
      const forbidden=group.replace(/Cannot have/i,"").trim();
      return !(context.merits??[]).some((merit)=>courtKey(merit.name)===courtKey(forbidden));
    }
    const requiredMerits=RAW_MERITS.filter((candidate)=>
      new RegExp(`\\b${candidate.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(group)
    );
    if(requiredMerits.length&&!/\bor\b/i.test(group)){
      const owned=context.merits??[];
      if(!requiredMerits.every((required)=>{
        const match=group.match(new RegExp(`${required.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*(•+)?`,"i"));
        const threshold=match?.[1]?.length??1;
        return owned.some((item)=>courtKey(item.name)===courtKey(required.name)&&item.dots>=threshold);
      })) return false;
    }
    if(/one Social Attribute/i.test(group)) return ["Presence","Manipulation","Composure"].some((name)=>traitValue(name,context)>=dotsIn(group));
    if(/one (Mental|Physical|Social) Attribute/i.test(group)){
      const category=/Mental/i.test(group)?ATTRIBUTE_NAMES.slice(0,3):/Physical/i.test(group)?ATTRIBUTE_NAMES.slice(3,6):ATTRIBUTE_NAMES.slice(6);
      return category.some((name)=>traitValue(name,context)>=dotsIn(group));
    }
    if(/any Social Skill/i.test(group)) return ["Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge"].some((name)=>traitValue(name,context)>=dotsIn(group));
    if(/^Contract of /i.test(group)) return (context.powers??[]).some((power)=>courtKey(power)===courtKey(group.replace(/^Contract of /i,"").replace(/[•]+/g,"").trim())||courtKey(power)===courtKey(group.replace(/[•]+/g,"").trim()));
    const seemingAlternatives=SEEMING_NAMES.filter((name)=>new RegExp(`\\b${name}\\b`,"i").test(group));
    if(seemingAlternatives.length&&/\bor\b/i.test(group)&&seemingAlternatives.some((name)=>courtKey(name)===courtKey(context.seeming))) return true;
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
    if(/\bWyrd\b/i.test(group)) return Number(context.wyrd??0)>=(dotsIn(group)||Number(group.match(/\d+/)?.[0]??0));
    if(/\bSize\b/i.test(group)) return Number(context.size??5)>=(dotsIn(group)||Number(group.match(/\d+/)?.[0]??0));
    const named=(context.merits??[]).filter((owned)=>new RegExp(`\\b${owned.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(group));
    if(named.length){
      const threshold=dotsIn(group)||1;
      return /\bor\b/i.test(group)?named.some((merit)=>merit.dots>=threshold):named.every((merit)=>merit.dots>=threshold);
    }
    return true;
  });
}

export function getMeritsForLine(line: GameLine) {
  const selected = new Map<string, MeritDefinition>();
  for (const merit of RAW_MERITS.filter((item) => item.line === "Core" || item.line === line)) {
    const current = selected.get(merit.name.toLocaleLowerCase("en"));
    if (!current || merit.priority > current.priority) selected.set(merit.name.toLocaleLowerCase("en"), merit);
  }
  return [...selected.values()].sort((a,b) => a.name.localeCompare(b.name,"en"));
}

export const MERIT_RULES = (["CtL", "MtA"] as const).map((line) => ({
  id: `merits-${line.toLowerCase()}-shared-v2`,
  name: `Merit catalog ${line}`,
  gameLine: line,
  sourceId: line === "CtL" ? "ctl-2ed" : "mta-2ed",
  page: 0,
  data: {
    precedence: [line,"Core"],
    merits: getMeritsForLine(line).map(({id,name,ratings,sourceId,source,category}) => ({id,name,ratings,sourceId,source,category})),
  },
}));
