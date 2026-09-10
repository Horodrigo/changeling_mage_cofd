import type { CharacterSheet } from "../app/character-builder";
import { ATTRIBUTES, SKILLS, normalizeChangelingFrailties } from "./creation-rules";
import { normalizeMeritConfiguration, synchronizeMeritGrants } from "./merit-configurations";

export function asRecord(value:unknown):Record<string,unknown>{return value!==null&&typeof value==="object"?value as Record<string,unknown>:{};}
export function safeJson(value:string){try{return JSON.parse(value||"{}");}catch{return {};}}

export function normalizeStoredSheet(value:CharacterSheet):CharacterSheet{
  const next=structuredClone(value),storedSpecializations:unknown[]=Array.isArray(next.specializations)?next.specializations:[];
  next.specializations=storedSpecializations.map(item=>{const record=asRecord(item);return typeof item==="string"?{skill:"",name:item}:{skill:String(record.skill??""),name:String(record.name??""),grantedBy:record.grantedBy?String(record.grantedBy):undefined};});
  const storedMerits:unknown[]=Array.isArray(next.merits)?next.merits:[];
  next.merits=storedMerits.map((value,index)=>{const item=asRecord(value);return {name:String(item.name==="Throne"?"Power Behind the Throne":item.name??""),dots:Number(item.dots??1),instanceId:item.instanceId?String(item.instanceId):`legacy-merit-${index}-${String(item.name??"merit").toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,sourceId:item.sourceId?String(item.sourceId):undefined,source:item.source?String(item.source):undefined,configuration:normalizeMeritConfiguration(item.configuration),grantedBy:item.grantedBy?String(item.grantedBy):undefined};});
  next.line_data=next.line_data&&typeof next.line_data==="object"?next.line_data:{};
  if(next.game_line==="CtL"){const wyrd=Number(next.line_data.wyrd??1);next.line_data={...next.line_data,frailties:normalizeChangelingFrailties(next.line_data.frailties,wyrd)};}
  return synchronizeMeritGrants(next);
}

export function migrateLegacy(value:unknown,player:string):CharacterSheet{
  const item=asRecord(value),attributes=Object.values(ATTRIBUTES).flat().reduce<Record<string,number>>((acc,name)=>({...acc,[name]:1}),{}),skills=Object.values(SKILLS).flat().reduce<Record<string,number>>((acc,name)=>({...acc,[name]:0}),{}),now=new Date().toISOString();
  return {id:String(item.id??crypto.randomUUID()),schema_version:2,system:"chronicles-of-darkness",game_line:item.gameLine==="MtA"?"MtA":"CtL",ruleset:{id:String(item.rulesetId??"legacy"),version:Number(item.rulesetVersion??1)},character:{name:String(item.name??"Sem nome"),concept:String(item.concept??""),player},attributes,skills,specializations:[],merits:[],line_data:safeJson(String(item.characterData??"")),derived:{},current_state:{legacy:true},created_at:String(item.createdAt??now),updated_at:now};
}

export function migrateJsonV1(input:unknown,player:string):CharacterSheet{
  const value=asRecord(input),character=asRecord(value.character),now=new Date().toISOString();
  const specializations=Array.isArray(value.specializations)?value.specializations.map(item=>{const record=asRecord(item);return typeof item==="string"?{skill:"",name:item}:{skill:String(record.skill??""),name:String(record.name??"")};}):[];
  const merits=Array.isArray(value.merits)?value.merits.map(entry=>{const raw=asRecord(entry);return {name:String(raw.name==="Throne"?"Power Behind the Throne":raw.name??""),dots:Number(raw.dots??1),sourceId:raw.sourceId?String(raw.sourceId):undefined,source:raw.source?String(raw.source):undefined,configuration:normalizeMeritConfiguration(raw.configuration),grantedBy:raw.grantedBy?String(raw.grantedBy):undefined};}):[];
  return synchronizeMeritGrants({id:crypto.randomUUID(),schema_version:2,system:"chronicles-of-darkness",game_line:value.game_line==="MtA"?"MtA":"CtL",ruleset:value.ruleset&&typeof value.ruleset==="object"?value.ruleset as CharacterSheet["ruleset"]:{id:"imported-v1",version:1},character:{name:String(character.name??"Sem nome"),concept:String(character.concept??""),player},attributes:asRecord(value.attributes) as Record<string,number>,skills:asRecord(value.skills) as Record<string,number>,specializations,merits,line_data:asRecord(value.line_data),derived:{},current_state:asRecord(value.current_state),created_at:now,updated_at:now});
}
