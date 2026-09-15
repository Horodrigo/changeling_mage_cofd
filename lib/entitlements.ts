export type EntitlementRole={id:string;name:string;prerequisites:string;privilege:string;duties:string;heraldryColor?:string;tokenBonus:string;tokenDrawback:string};
export type EntitlementBlessing={id:string;name:string;description:string;conditional?:boolean;choiceLabel?:string};
export type EntitlementDefinition={
  id:string;name:string;meritName:string;source:string;sourceCode:string;page:number;
  sourceId?:"h-courts"|"h-seemings";
  prerequisites:string;purpose:string;privileges:string;duties:string;maskAndMien:string;
  heraldry:string;token:{name:string;description:string;effect:string;catch:string;drawback:string};
  blessings:EntitlementBlessing[];roles?:EntitlementRole[];touchstone:string;curse:string;beat:string;legends:string[];
};

export const entitlementAvailable=(definition:EntitlementDefinition,activeSourceIds:ReadonlySet<string>)=>!definition.sourceId||activeSourceIds.has(definition.sourceId);

export const findEntitlement=(catalog:readonly EntitlementDefinition[],id:unknown)=>catalog.find((item)=>item.id===String(id??""));

export type EntitlementAllocation={id:string;target:"token"|"blessing";blessingId?:string;sequence:number};
export type EntitlementState={definitionId:string;roleId:string;accepted:boolean;touchstone:{name:string;status:"active"|"lost"|"suspended"};suspendedBenefitIds:string[];token:{rating:number;storedGlamour:number};allocations:EntitlementAllocation[];choices:Record<string,string>};

const record=(value:unknown):Record<string,unknown>=>value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{};
export function normalizeEntitlementState(value:unknown,wyrd:number,catalog:readonly EntitlementDefinition[]=[]):EntitlementState{
  const raw=record(value),rawTouchstone=record(raw.touchstone),rawToken=record(raw.token),definition=findEntitlement(catalog,raw.definitionId);
  const allocations=(Array.isArray(raw.allocations)?raw.allocations:[]).flatMap((value,index)=>{
    const item=record(value),target=item.target==="token"||item.target==="blessing"?item.target:null;
    if(!target)return [];
    const blessingId=String(item.blessingId??"");
    if(target==="blessing"&&!definition?.blessings.some((entry)=>entry.id===blessingId))return [];
    return [{id:String(item.id??`allocation-${index}`),target,blessingId:target==="blessing"?blessingId:undefined,sequence:Number(item.sequence??index)} as EntitlementAllocation];
  }).sort((a,b)=>a.sequence-b.sequence).slice(0,Math.max(1,Math.min(10,Math.trunc(wyrd)||1)));
  const unique:EntitlementAllocation[]=[];let tokenCount=0;const blessingIds=new Set<string>();
  for(const allocation of allocations){
    if(allocation.target==="token"){if(tokenCount>=5)continue;tokenCount+=1;unique.push(allocation);continue;}
    if(!allocation.blessingId||blessingIds.has(allocation.blessingId))continue;
    blessingIds.add(allocation.blessingId);unique.push(allocation);
  }
  const choices=Object.fromEntries(Object.entries(record(raw.choices)).map(([key,item])=>[key,String(item??"")]));
  return {definitionId:definition?.id??"",roleId:definition?.roles?.some((role)=>role.id===raw.roleId)?String(raw.roleId):"",accepted:raw.accepted===true,touchstone:{name:String(rawTouchstone.name??""),status:["active","lost","suspended"].includes(String(rawTouchstone.status))?rawTouchstone.status as EntitlementState["touchstone"]["status"]:"active"},suspendedBenefitIds:Array.isArray(raw.suspendedBenefitIds)?raw.suspendedBenefitIds.map(String):[],token:{rating:tokenCount,storedGlamour:Math.max(0,Math.min(Math.trunc(wyrd)||1,Number(rawToken.storedGlamour??0)))},allocations:unique,choices};
}

export function entitlementPrerequisitesMet(definition:EntitlementDefinition,state:EntitlementState,sheet:{attributes:Record<string,number>;skills:Record<string,number>;merits:Array<{name:string;dots?:number;configuration?:Record<string,unknown>}>;line_data:Record<string,unknown>}){
  const meritNames=new Set(sheet.merits.map((item)=>item.name));
  const attribute=(...names:string[])=>Math.max(0,...names.map((name)=>Number(sheet.attributes[name]??0)));
  const skill=(...names:string[])=>Math.max(0,...names.map((name)=>Number(sheet.skills[name]??0)));
  const wyrd=Number(sheet.line_data.wyrd??1);
  if(definition.id==="baron-lesser-ones") return Number(sheet.skills.Empathy??0)>=2&&(Number(sheet.skills.Intimidation??0)>=2||Number(sheet.skills.Persuasion??0)>=2)&&(meritNames.has("Gentrified Bearing")||meritNames.has("Hob Kin")||sheet.merits.some((item)=>item.name==="Interdisciplinary Specialty"&&JSON.stringify(item.configuration??{}).toLowerCase().includes("goblin")));
  if(definition.id==="dauphines-wayward-children"){
    const role=definition.roles?.find((item)=>item.id===state.roleId);if(!role||Number(sheet.line_data.wyrd??1)<3)return false;
    const requirements:Record<string,[string,string]>={sophomore:["Presence","Persuasion"],chaperone:["Manipulation","Empathy"],dowager:["Composure","Intimidation"]};
    const [attribute,skill]=requirements[role.id];return Number(sheet.attributes[attribute]??0)>=2&&Number(sheet.skills[skill]??0)>=2;
  }
  if(definition.id==="master-of-keys") return Number(sheet.skills.Investigation??0)>=2&&Number(sheet.skills.Empathy??0)>=2;
  if(definition.id==="thorn-dancer") return Number(sheet.skills.Socialize??0)>=2&&Number(sheet.skills.Athletics??0)>=3&&Number(sheet.skills.Expression??0)>=2;
  if(definition.id==="sibylline-fisher") return Number(sheet.skills.Computer??0)>=3&&Number(sheet.skills.Investigation??0)>=2&&Number(sheet.line_data.wyrd??1)>=3;
  if(definition.id==="spiderborn-rider") return Number(sheet.attributes.Resolve??0)>=3;
  if(definition.id==="adjudicator-wheel")return attribute("Resolve")>=3&&skill("Investigation")>=2&&meritNames.has("Trained Observer");
  if(definition.id==="blackbird-bishop")return skill("Empathy")>=2&&attribute("Wits")>=3&&attribute("Composure")>=3;
  if(definition.id==="diviners-worms")return skill("Occult")>=2&&meritNames.has("Diviner")&&meritNames.has("Trained Observer");
  if(definition.id==="duchess-truth-loss")return attribute("Wits")>=3&&skill("Investigation")>=2;
  if(definition.id==="goldspinner-guildmaster")return sheet.merits.some((item)=>item.name==="Resources"&&Number(item.dots??0)>=3);
  if(definition.id==="paragon-story-heroes")return attribute("Wits")>=3&&skill("Academics")>=2&&Math.max(skill("Persuasion"),skill("Subterfuge"))>=2;
  if(definition.id==="sacred-band-golden-standard")return attribute("Presence")>=3&&wyrd>=2&&Object.values(sheet.skills).some((value)=>Number(value)>=3);
  if(definition.id==="squire-broken-bough")return attribute("Composure")>=3&&attribute("Resolve")>=3&&skill("Weaponry")>=2;
  if(definition.id==="companion-resigned")return skill("Empathy")>=3&&skill("Expression")>=2&&skill("Stealth")>=2;
  if(definition.id==="castellan-broken-cage")return attribute("Manipulation")>=3&&Math.max(skill("Empathy"),skill("Socialize"))>=2&&wyrd>=2;
  if(definition.id==="duke-icebound-heart")return Math.max(attribute("Presence"),attribute("Manipulation"))>=3&&skill("Socialize")>=2&&skill("Empathy")>=2;
  if(definition.id==="eternal-echo")return attribute("Resolve")>=3&&skill("Academics")>=2&&skill("Expression")>=2;
  if(definition.id==="knights-knowledge-tongue")return attribute("Stamina")>=3&&skill("Crafts")>=2;
  if(definition.id==="legate-black-apple")return Object.values(sheet.skills).filter((value)=>Number(value)>=4).length>=2&&attribute("Composure")+attribute("Resolve")>=7&&wyrd>=3;
  if(definition.id==="lost-pantheon")return attribute("Presence")>=3&&skill("Occult")>=2&&wyrd>=3;
  if(definition.id==="magistrates-wax-mask")return attribute("Composure")>=3&&skill("Socialize")>=2&&skill("Subterfuge")>=3;
  if(definition.id==="magus-gilded-thorns")return attribute("Composure")>=3&&skill("Stealth")>=2&&meritNames.has("Hedge Sense")&&wyrd>=2;
  if(definition.id==="margrave-brim")return Math.max(skill("Brawl"),skill("Weaponry"))>=3&&skill("Survival")>=2&&wyrd>=2;
  if(definition.id==="noble-sages"){
    if(skill("Occult")<2)return false;
    if(state.roleId==="archivist")return attribute("Intelligence")>=3&&skill("Academics")>=2;
    if(state.roleId==="diplomat")return attribute("Wits")>=3&&skill("Persuasion")>=2;
    if(state.roleId==="bane")return attribute("Resolve")>=3&&skill("Athletics")>=2;
    return false;
  }
  if(definition.id==="scarecrow-minister")return attribute("Composure")>=3&&skill("Empathy")>=2&&skill("Intimidation")>=3;
  if(definition.id==="tolltaker-knight")return attribute("Composure")>=3&&Math.max(skill("Brawl"),skill("Weaponry"))>=2&&skill("Intimidation")>=2;
  return true;
}

export function synchronizeEntitlement<T>(sheet:T,catalog:readonly EntitlementDefinition[]=[]):T{
  const target=sheet as T&{game_line?:string;attributes?:Record<string,number>;skills?:Record<string,number>;merits?:Array<{instanceId?:string;name:string;dots:number;configuration?:Record<string,unknown>;grantedBy?:string}>;specializations?:Array<{skill:string;name:string;grantedBy?:string}>;line_data?:Record<string,unknown>};
  if(target.game_line!=="CtL"||!target.merits||!target.line_data)return sheet;
  target.merits=target.merits.filter((item)=>!item.grantedBy?.startsWith("Entitlement:"));
  target.specializations=(target.specializations??[]).filter((item)=>!item.grantedBy?.startsWith("Entitlement:"));
  const merit=target.merits.find((item)=>item.name==="Entitlement"&&!item.grantedBy);
  if(!merit){delete target.line_data.entitlement;return sheet;}
  const configuration=record(merit.configuration),saved=record(target.line_data.entitlement),configuredDefinitionId=String(configuration.definitionId??"");
  const current=configuredDefinitionId&&saved.definitionId&&configuredDefinitionId!==saved.definitionId?{}:saved;
  const definitionId=String(configuredDefinitionId||current.definitionId||""),roleId=String(configuration.roleId||current.roleId||"");
  const state=normalizeEntitlementState({...current,definitionId,roleId},Number(target.line_data.wyrd??1),catalog);
  merit.configuration={...configuration,definitionId:state.definitionId,roleId:state.roleId};target.line_data.entitlement=state;
  const definition=findEntitlement(catalog,state.definitionId);if(!definition)return sheet;
  const eligible=entitlementPrerequisitesMet(definition,state,{attributes:target.attributes??{},skills:target.skills??{},merits:target.merits,line_data:target.line_data});
  const owner=`Entitlement:${definition.id}`,active=new Set(state.accepted&&eligible&&state.touchstone.status==="active"&&Boolean(state.touchstone.name.trim())?state.allocations.filter((item)=>item.target==="blessing"&&!state.suspendedBenefitIds.includes(String(item.blessingId))).map((item)=>item.blessingId):[]);
  const grant=(name:string,dots:number,configuration:Record<string,unknown>={})=>target.merits!.push({instanceId:`grant-${owner}-${name}`,name,dots,configuration,grantedBy:owner});
  if(active.has("inherited-expertise")){const skill=state.choices["inherited-expertise-skill"],name=state.choices["inherited-expertise-name"];if(skill&&name)target.specializations!.push({skill,name,grantedBy:owner});}
  if(active.has("hobgoblin-allies"))grant("Allies",Math.ceil(Number(target.line_data.wyrd??1)/2),{groups:[state.choices["hobgoblin-allies"]??""]});
  if(active.has("inherited-token")){const rating=Math.ceil(Number(target.line_data.wyrd??1)/2),token={name:state.choices["inherited-token-name"]??"Inherited Token",rating,cost:state.choices["inherited-token-cost"]??"",effect:state.choices["inherited-token-effect"]??"",catch:state.choices["inherited-token-catch"]??"",drawback:state.choices["inherited-token-drawback"]??""};grant("Token",rating,{items:[JSON.stringify(token)]});}
  if(active.has("hidden-library")){grant("Safe Place",1);grant("Library",2,{subject:state.choices["hidden-library"]??""});}
  if(active.has("hedge-native-merits")){
    if(!target.merits.some((item)=>item.name==="Arcadian Metabolism"))grant("Arcadian Metabolism",2);
    if(!target.merits.some((item)=>item.name==="Hob Kin"))grant("Hob Kin",1);
  }
  if(active.has("indomitable-rider")&&!target.merits.some((item)=>item.name==="Indomitable"&&!item.grantedBy))grant("Indomitable",2);
  if(active.has("blackbird-flock"))grant("Retainer",Math.ceil(Number(target.line_data.wyrd??1)/2),{name:"Blackbird Flock"});
  if(active.has("former-chrysalids"))grant("Allies",Math.ceil(Number(target.line_data.wyrd??1)/2),{groups:[state.choices["former-chrysalids"]??""]});
  if(active.has("rescued-allies"))grant("Allies",Math.ceil(Number(target.line_data.wyrd??1)/2),{groups:[state.choices["rescued-allies"]??""]});
  if(active.has("hedge-interdisciplinary"))grant("Interdisciplinary Specialty",1,{subject:"Hedge"});
  if(active.has("supernatural-contacts"))grant("Contacts",Math.ceil(Number(target.line_data.wyrd??1)/2),{groups:[state.choices["supernatural-contacts"]??""]});
  if(active.has("supernatural-barfly"))grant("Barfly",2,{subject:"Non-fae supernatural gatherings"});
  return sheet;
}
