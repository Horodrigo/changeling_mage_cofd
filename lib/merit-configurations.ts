import type { Locale } from "./i18n";
import { HEDGE_DUELIST_VARIANTS } from "./merits-supplements-en";
import { courtCanonicalId, courtDisplayName } from "./changeling-courts";

export type MeritConfigValue = string | string[];
export type MeritConfiguration = Record<string, MeritConfigValue>;
export type MeritConfigField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "court" | "select";
  placeholder?: string;
  minDots?: number;
  options?: Array<{ value: string; label: string }>;
};
export type MeritConfigDefinition = {
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: "CtL" | "MtA";
};

const MENTOR_TRAITS = [
  "Academics","Computer","Crafts","Investigation","Medicine","Occult","Politics","Science",
  "Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry",
  "Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge","Resources",
].map((label)=>({value:label,label}));

// Official Merit-specific configuration is rebuilt only after source audit.
export const MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [{
  name: "Hedge Duelist",
  line: "CtL",
  fields: [{
    key: "firstManeuver",
    label: "First-dot maneuver",
    kind: "select",
    options: HEDGE_DUELIST_VARIANTS.map(({label,seeming})=>({value:label,label:`${label} (${seeming})`})),
  }],
},{
  name: "Court Goodwill",
  line: "CtL",
  fields: [{ key: "court", label: "Court", kind: "court" }],
},{
  name: "Contacts",
  fields: [{ key: "groups", label: "Groups or fields", kind: "list" }],
},{
  name: "Staff",
  fields: [{ key: "skills", label: "Staff Skills", kind: "list" }],
},{
  name: "Token",
  line: "CtL",
  fields: [{ key: "name", label: "Token", kind: "text", placeholder: "Token name" }],
},{
  name: "Touchstone",
  line: "CtL",
  fields: [{ key: "touchstones", label: "Additional Touchstones", kind: "list" }],
},{name:"Allies",fields:[{key:"subject",label:"Allied group",kind:"text"}]},
  {name:"Alternate Identity",fields:[{key:"identity",label:"Identity",kind:"text"}]},
  {name:"Language",fields:[{key:"language",label:"Language",kind:"text"}]},
  {name:"Library",fields:[{key:"subject",label:"Relevant Skill or subject",kind:"text"}]},
  {name:"Safe Place",fields:[{key:"place",label:"Safe Place",kind:"text"}]},
  {name:"Status",fields:[{key:"group",label:"Group",kind:"text"}]},
  {name:"Striking Looks",fields:[{key:"appearance",label:"Distinctive appearance",kind:"text"}]},
  {name:"Mentor",fields:[
    {key:"trait_1",label:"Mentor trait 1",kind:"select",options:MENTOR_TRAITS},
    {key:"trait_2",label:"Mentor trait 2",kind:"select",options:MENTOR_TRAITS},
    {key:"trait_3",label:"Mentor trait 3",kind:"select",options:MENTOR_TRAITS},
  ]},
  {name:"Retainer",fields:[
    {key:"name",label:"Retainer name",kind:"text"},
    {key:"purview",label:"Area of expertise",kind:"text"},
  ]},
  {name:"Area of Expertise",fields:[{key:"specialty",label:"Specialty",kind:"text",placeholder:"Specialty receiving the increased bonus"}]},
  {name:"Defensive Combat",fields:[{key:"skill",label:"Defense Skill",kind:"select",options:[{value:"Brawl",label:"Brawl"},{value:"Weaponry",label:"Weaponry"}]}]},
  {name:"Fighting Finesse",fields:[{key:"skill",label:"Combat Skill",kind:"select",options:[{value:"Brawl",label:"Brawl"},{value:"Weaponry",label:"Weaponry"}]}]},
  {name:"Multilingual",fields:[{key:"languages",label:"Additional languages",kind:"list"}]},
  {name:"Quick Draw",fields:[{key:"specialty",label:"Weapon Specialty",kind:"text",placeholder:"Firearms or Weaponry Specialty"}]},
  {name:"Unseen Sense",fields:[{key:"phenomenon",label:"Supernatural phenomenon",kind:"text"}]},
  {name:"Warded Dreams",line:"CtL",fields:[]},
  {name:"Professional Training",fields:[]},
  {name:"Mystery Cult Initiation",fields:[]},
];
export const findMeritConfiguration = (name: string): MeritConfigDefinition | undefined => MERIT_CONFIGURATIONS.find((item)=>item.name===name);
const INLINE_MERITS=new Set(["Allies","Alternate Identity","Area of Expertise","Language","Library","Quick Draw","Safe Place","Status","Striking Looks","Token","Unseen Sense"]);
const STRUCTURED_MERITS=new Set(["Professional Training","Mystery Cult Initiation","Warded Dreams"]);
export const isInlineMeritConfiguration = (name: string) => INLINE_MERITS.has(name);
export const isStructuredMerit = (name: string) => STRUCTURED_MERITS.has(name);
export const meritConfigurationText = (value: string | undefined, _locale: Locale) => value ?? "";

export const normalizeMeritConfiguration = (value: unknown): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key,item]) => [key,Array.isArray(item) ? item.map(String) : String(item ?? "")]))
    : {};

export function meritConfigurationTitle(value: unknown) {
  const configuration = normalizeMeritConfiguration(value);
  for (const key of ["subject","identity","language","place","group","appearance","name","court","firstManeuver","cult","profession"]) {
    const item=configuration[key];
    if (typeof item === "string" && item.trim()) return item.trim();
  }
  return "";
}

export function synchronizeMeritGrants<T>(sheet: T): T {
  const target=sheet as T&{
    game_line?:string;
    merits?:Array<{instanceId?:string;name:string;dots:number;sourceId?:string;source?:string;configuration?:MeritConfiguration;grantedBy?:string}>;
    specializations?:Array<{skill:string;name:string;grantedBy?:string}>;
    skills?:Record<string,number>;
    line_data?:Record<string,unknown>;
  };
  if(target.game_line!=="CtL"||!Array.isArray(target.merits)||!target.line_data) return sheet;
  const court=courtCanonicalId(target.line_data.court), courtless=!court||["sem corte","courtless"].includes(court.toLowerCase());
  const existing=target.merits.find((item)=>item.name==="Mantle"&&item.grantedBy==="Corte");
  target.merits=target.merits.filter((item)=>!(item.name==="Mantle"&&item.grantedBy==="Corte"));
  if(!courtless) target.merits.push({
    instanceId:existing?.instanceId??`mantle-${court}`,
    name:"Mantle",
    dots:Math.max(1,Number(existing?.dots??1)),
    sourceId:"ctl-2ed",
    source:"Changeling the Lost",
    configuration:{court},
    grantedBy:"Corte",
  });
  const benefits=target.merits.filter((item)=>item.name==="Court Goodwill"&&!item.grantedBy).map((item)=>{
    const selected=courtCanonicalId(normalizeMeritConfiguration(item.configuration).court);
    item.configuration={...normalizeMeritConfiguration(item.configuration),court:selected};
    return {court:selected,dots:item.dots,mantleDots:Math.max(0,item.dots-2)};
  }).filter((item)=>item.court);
  const generatedPrefix="Merit:";
  target.merits=target.merits.filter((item)=>!item.grantedBy?.startsWith(generatedPrefix));
  target.specializations=(target.specializations??[]).filter((item)=>!item.grantedBy?.startsWith(generatedPrefix));
  const skillBonuses:Record<string,number>={};
  const grantMerit=(owner:string,name:string,dots:number,index:number)=>{
    if(!name||dots<1) return;
    target.merits!.push({
      instanceId:`grant-${owner}-${index}`,
      name,
      dots,
      configuration:{},
      grantedBy:`${generatedPrefix}${owner}`,
    });
  };
  for(const merit of target.merits.filter((item)=>!item.grantedBy)){
    const owner=`${merit.name}:${merit.instanceId??merit.name}`;
    const configuration=normalizeMeritConfiguration(merit.configuration);
    if(merit.name==="Professional Training"){
      const contacts=Array.isArray(configuration.contacts)?configuration.contacts.filter(Boolean):[];
      if(merit.dots>=1) target.merits.push({
        instanceId:`grant-${owner}-contacts`,
        name:"Contacts",
        dots:2,
        configuration:{groups:contacts.slice(0,2)},
        grantedBy:`${generatedPrefix}${owner}`,
      });
      if(merit.dots>=3){
        for(const index of [1,2]){
          const skill=String(configuration[`specialty_${index}_skill`]??"");
          const name=String(configuration[`specialty_${index}_name`]??"");
          if(skill&&name) target.specializations!.push({skill,name,grantedBy:`${generatedPrefix}${owner}`});
        }
      }
      const boosted=String(configuration.boosted_skill??"");
      if(merit.dots>=4&&boosted) skillBonuses[boosted]=(skillBonuses[boosted]??0)+1;
    }
    if(merit.name==="Mystery Cult Initiation"){
      for(let level=1;level<=Math.min(5,merit.dots);level+=1){
        const prefix=`level_${level}`;
        const type=String(configuration[`${prefix}_type`]??"");
        if(type==="specialty"){
          const skill=String(configuration[`${prefix}_specialty_skill`]??"");
          const name=String(configuration[`${prefix}_specialty_name`]??"");
          if(skill&&name) target.specializations!.push({skill,name,grantedBy:`${generatedPrefix}${owner}`});
        }
        if(type==="skill"||type==="merit_skill"){
          const skill=String(configuration[`${prefix}_skill`]??"");
          if(skill) skillBonuses[skill]=(skillBonuses[skill]??0)+1;
        }
        if(type==="merit"||type==="merits"||type==="merit_skill"){
          const rows=Array.isArray(configuration[`${prefix}_merits`])?configuration[`${prefix}_merits`] as string[]:[];
          rows.forEach((row,index)=>{
            const [name,rawDots]=row.split("|");
            grantMerit(`${owner}:${level}`,name,Math.max(1,Number(rawDots)||1),index);
          });
        }
      }
    }
  }
  target.line_data={...target.line_data,court_goodwill_benefits:benefits,merit_granted_skill_bonuses:skillBonuses};
  return sheet;
}

export function expandedConfigurationLines(
  name: string,
  dots: number,
  value: unknown,
  locale: Locale = "pt-BR",
): string[] {
  if(name==="Court Goodwill"){
    const court=courtDisplayName(normalizeMeritConfiguration(value).court,locale)|| (locale==="en-US"?"Not selected":"Não selecionada");
    const mantle=Math.max(0,dots-2);
    return locale==="en-US"?[
      `Court: ${court}.`,
      `Allies: functions as Allies ${dots} within that Court.`,
      `Mantle equivalence: ${mantle}; Court Goodwill can satisfy only Mantle prerequisites from 1 to 3.`,
      "Mentor: functions as Mentor 1 through the Court contact.",
    ]:[
      `Corte: ${court}.`,
      `Aliados: funciona como Aliados ${dots} dentro dessa Corte.`,
      `Equivalência de Manto: ${mantle}; Benevolência da Corte só pode satisfazer pré-requisitos de Manto entre 1 e 3.`,
      "Mentor: funciona como Mentor 1 por meio do contato na Corte.",
    ];
  }
  if(name!=="Hedge Duelist") return [];
  const selected=String(normalizeMeritConfiguration(value).firstManeuver??"");
  const variant=HEDGE_DUELIST_VARIANTS.find((item)=>item.label===selected);
  return variant ? [`${variant.label} (${variant.seeming}): ${variant.description}`] : [];
}
