import type { CharacterSheet } from "./core/character/character-types";
import { normalizeMeritConfiguration } from "./core/character/merit-configuration";
import {
  asRecord,
  validateCurrentCharacter,
  type CurrentCharacterValidation,
} from "./core/character/current-character-validation";

export { asRecord, validateCurrentCharacter, type CurrentCharacterValidation };

export function normalizeStoredSheet(value:CharacterSheet):CharacterSheet{
  const next=structuredClone(value),storedSpecializations:unknown[]=Array.isArray(next.specializations)?next.specializations:[];
  next.specializations=storedSpecializations.map(item=>{const record=asRecord(item);return typeof item==="string"?{skill:"",name:item}:{skill:String(record.skill??""),name:String(record.name??""),grantedBy:record.grantedBy?String(record.grantedBy):undefined};});
  const storedMerits:unknown[]=Array.isArray(next.merits)?next.merits:[];
  next.merits=storedMerits.map((value,index)=>{const item=asRecord(value);return {name:String(item.name==="Throne"?"Power Behind the Throne":item.name??""),dots:Number(item.dots??1),instanceId:item.instanceId?String(item.instanceId):`legacy-merit-${index}-${String(item.name??"merit").toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,sourceId:item.sourceId?String(item.sourceId):undefined,source:item.source?String(item.source):undefined,configuration:normalizeMeritConfiguration(item.configuration),grantedBy:item.grantedBy?String(item.grantedBy):undefined};});
  next.line_data=next.line_data&&typeof next.line_data==="object"?next.line_data:{};
  // Structural persistence normalization deliberately stops here. Line-owned
  // merit grants and derived state run through the selected lazy rules module
  // after this common shape has been made safe to consume.
  return next;
}
