import legacyCatalog from "@/game-lines/mage/catalog-data/legacies.json";
import supplementCatalog from "@/game-lines/mage/catalog-data/legacies-supplement.json";

type LegacyCharacter = {line_data:Record<string,unknown>;skills:Record<string,number>;merits?:Array<{name:string;dots:number}>;specializations?:Array<{skill?:string;name?:string}>};

type LegacyRequirements={arcana?:Record<string,number>;skills?:Record<string,number>;anySkills?:{names:string[];rating:number;count?:number};specializations?:Array<{skill:string;includes?:string}>;merits?:Array<{name:string;dots:number}>;anyMerits?:Array<{names:string[];dots:number}>};

export type LegacyAttainment = {
  rank: 1|2|3|4|5;
  name: string;
  prerequisites: string;
  rulingArcanum: number;
  orthodoxGnosis: number;
  novelGnosis: number;
  description: string;
  optional?: string;
  praxisName?: string;
  requirements?: LegacyRequirements;
};

export type LegacyDefinition = {
  id: string;
  name: string;
  source: string;
  page: number;
  additionalSources?: Array<{source:string;page:number}>;
  parentage: {paths:string[];orders:string[]};
  rulingArcanum: string;
  prerequisites: string;
  initiation: string;
  organization: string;
  theory: string;
  yantras: string[];
  oblations: string[];
  attainments: LegacyAttainment[];
  entryPraxis?: string;
  entryRequirements?: LegacyRequirements;
};

export type LegacyState = {
  definitionId: string;
  joined: boolean;
  attainmentRanks: number[];
  initiationMethod: ""|"tutelage"|"daimonomikon"|"soul-study";
};

export const LEGACIES=[...legacyCatalog,...supplementCatalog] as unknown as readonly LegacyDefinition[];
export const ELEVENTH_QUESTION=LEGACIES.find((item)=>item.id==="the-eleventh-question")!;
export const CHRONOLOGUE=LEGACIES.find((item)=>item.id==="chronologue")!;
export const ENGINEERS_OF_THE_SYSTEM=LEGACIES.find((item)=>item.id==="engineers-of-the-system")!;
export const findLegacy=(id:unknown)=>LEGACIES.find(item=>item.id===String(id));

export function legacySkillRating(skills:Record<string,number>,name:string){
  return Number(skills[name]??0);
}

export function legacyArcanumRating(arcana:Record<string,number>,name:string){
  return Number(arcana[name]??0);
}

function legacyRequirementsMet(character:LegacyCharacter,requirements:LegacyRequirements|undefined){
  if(!requirements)return true;
  const arcana=(character.line_data.arcana??{}) as Record<string,number>;
  if(Object.entries(requirements.arcana??{}).some(([name,rating])=>legacyArcanumRating(arcana,name)<rating))return false;
  if(Object.entries(requirements.skills??{}).some(([name,rating])=>legacySkillRating(character.skills,name)<rating))return false;
  if(requirements.anySkills){const {names,rating,count=1}=requirements.anySkills;if(names.filter(name=>legacySkillRating(character.skills,name)>=rating).length<count)return false;}
  if(requirements.specializations?.some(required=>!(character.specializations??[]).some(item=>legacySkillRating({[String(item.skill??"")]:1},required.skill)>0&&new RegExp(required.includes??".","i").test(String(item.name??"")))))return false;
  if(requirements.merits?.some(required=>(character.merits??[]).filter(item=>item.name===required.name||required.name==="Status"&&/Status/.test(item.name)).reduce((sum,item)=>sum+Number(item.dots||0),0)<required.dots))return false;
  if(requirements.anyMerits?.some(required=>!required.names.some(name=>(character.merits??[]).filter(item=>item.name===name||name==="Status"&&/Status/.test(item.name)).reduce((sum,item)=>sum+Number(item.dots||0),0)>=required.dots)))return false;
  return true;
}

function requirementItems(character:LegacyCharacter,requirements:LegacyRequirements|undefined){
  if(!requirements)return [];
  const arcana=(character.line_data.arcana??{}) as Record<string,number>;
  const items=[...Object.entries(requirements.arcana??{}).map(([name,rating])=>({label:`${name} ${rating}`,met:legacyArcanumRating(arcana,name)>=rating})),...Object.entries(requirements.skills??{}).map(([name,rating])=>({label:`${name} ${rating}`,met:legacySkillRating(character.skills,name)>=rating}))];
  if(requirements.anySkills){const {names,rating,count=1}=requirements.anySkills;items.push({label:`${count>1?`${count} of `:""}${names.join(" /  ")} ${rating}`,met:names.filter(name=>legacySkillRating(character.skills,name)>=rating).length>=count});}
  return items;
}

export function normalizeLegacyState(value:unknown):LegacyState {
  if(!value||typeof value!=="object")return {definitionId:"",joined:false,attainmentRanks:[],initiationMethod:""};
  const state=value as Record<string,unknown>;
  const method=["tutelage","daimonomikon","soul-study"].includes(String(state.initiationMethod))?String(state.initiationMethod) as LegacyState["initiationMethod"]:"";
  return {definitionId:String(state.definitionId??""),joined:Boolean(state.joined),attainmentRanks:Array.isArray(state.attainmentRanks)?[...new Set(state.attainmentRanks.map(Number).filter(rank=>rank>=1&&rank<=5))].sort():[],initiationMethod:method};
}

export function eleventhQuestionPrerequisites(character:LegacyCharacter){
  const data=character.line_data,gnosis=Number(data.gnosis??1),arcana=(data.arcana??{}) as Record<string,number>;
  const parentage=String(data.path)==="Moros"||["Guardians of the Veil","Mysterium"].includes(String(data.order));
  const praxis=[...(Array.isArray(data.praxes)?data.praxes:[]),...(Array.isArray(data.learned_praxes)?data.learned_praxes:[])].some((item)=>item&&typeof item==="object"&&String((item as Record<string,unknown>).originalName??(item as Record<string,unknown>).name)==="Perfect Timing");
  const time=legacyArcanumRating(arcana,"Time")>=2;
  const investigation=legacySkillRating(character.skills,"Investigation")>=2;
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].some(skill=>legacySkillRating(character.skills,skill)>=2);
  return {gnosis:gnosis>=2,time,investigation,qualifying,parentage,praxis,met:gnosis>=2&&time&&investigation&&qualifying&&(parentage||praxis)};
}

export function legacyEntryPrerequisites(character:LegacyCharacter,definition:LegacyDefinition){
  if(definition.id==="the-eleventh-question"){
    const result=eleventhQuestionPrerequisites(character);
    return {...result,items:[{label:"Gnosis 2",met:result.gnosis},{label:"Time 2",met:result.time},{label:"Investigation 2",met:result.investigation},{label:"Qualifying Skill 2",met:result.qualifying},{label:"Moros, Guardian/Mysterium, or Perfect Timing Praxis",met:result.parentage||result.praxis}]};
  }
  const data=character.line_data,gnosis=Number(data.gnosis??1);
  const parentage=definition.parentage.paths.includes(String(data.path))||definition.parentage.orders.includes(String(data.order));
  const praxis=[...(Array.isArray(data.praxes)?data.praxes:[]),...(Array.isArray(data.learned_praxes)?data.learned_praxes:[])].some(item=>item&&typeof item==="object"&&String((item as Record<string,unknown>).originalName??(item as Record<string,unknown>).name)===definition.entryPraxis);
  const gnosisMet=gnosis>=2,mechanical=legacyRequirementsMet(character,definition.entryRequirements);
  return {gnosis:gnosisMet,parentage,praxis,met:gnosisMet&&mechanical&&(parentage||praxis),items:[{label:"Gnosis 2",met:gnosisMet},...requirementItems(character,definition.entryRequirements),{label:[...definition.parentage.paths,...definition.parentage.orders,definition.entryPraxis&&`${definition.entryPraxis} Praxis`].filter(Boolean).join(", "),met:parentage||praxis}]};
}

export function legacyAttainmentPrerequisites(character:LegacyCharacter,definition:LegacyDefinition,rank:number){
  const attainment=definition.attainments.find(item=>item.rank===rank);
  if(!attainment)return false;
  const gnosis=Number(character.line_data.gnosis??1),arcana=(character.line_data.arcana??{}) as Record<string,number>;
  if(gnosis<attainment.orthodoxGnosis||legacyArcanumRating(arcana,definition.rulingArcanum)<attainment.rulingArcanum||!legacyRequirementsMet(character,attainment.requirements))return false;
  if(definition.id!=="the-eleventh-question")return true;
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].map(skill=>legacySkillRating(character.skills,skill)).sort((a,b)=>b-a);
  const investigation=legacySkillRating(character.skills,"Investigation")>=(rank>=4?4:rank>=2?3:2);
  const additional=rank<3?true:rank<5?(qualifying[0]>=3||qualifying[1]>=2):(qualifying[0]>=4||qualifying[1]>=3||qualifying[2]>=2);
  return investigation&&additional;
}
