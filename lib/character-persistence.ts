import type { CharacterSheet } from "./core/character/character-types";
import { PERSISTED_GAME_LINE_IDS } from "./core/character/game-line-ids";
import { normalizeMeritConfiguration, synchronizeMeritGrants } from "./merit-configurations";

export function asRecord(value:unknown):Record<string,unknown>{return value!==null&&typeof value==="object"?value as Record<string,unknown>:{};}

/**
 * Validation is intentionally separate from current-schema normalization.
 * It rejects obsolete or malformed imports without attempting a partial load.
 */
export type CurrentCharacterValidation = "valid" | "unsupported-schema" | "invalid-character";

export function validateCurrentCharacter(value: unknown): CurrentCharacterValidation {
  const record = asRecord(value);
  if (record.schema_version !== 2) return "unsupported-schema";
  if (
    record.system !== "chronicles-of-darkness" ||
    !PERSISTED_GAME_LINE_IDS.includes(record.game_line as CharacterSheet["game_line"])
  ) return "invalid-character";
  if (
    !record.character || typeof record.character !== "object" ||
    !record.attributes || typeof record.attributes !== "object" ||
    !record.skills || typeof record.skills !== "object" ||
    !Array.isArray(record.specializations) || !Array.isArray(record.merits) ||
    !record.line_data || typeof record.line_data !== "object" ||
    !record.derived || typeof record.derived !== "object" ||
    !record.current_state || typeof record.current_state !== "object"
  ) return "invalid-character";
  return "valid";
}

export function normalizeStoredSheet(value:CharacterSheet):CharacterSheet{
  const next=structuredClone(value),storedSpecializations:unknown[]=Array.isArray(next.specializations)?next.specializations:[];
  next.specializations=storedSpecializations.map(item=>{const record=asRecord(item);return typeof item==="string"?{skill:"",name:item}:{skill:String(record.skill??""),name:String(record.name??""),grantedBy:record.grantedBy?String(record.grantedBy):undefined};});
  const storedMerits:unknown[]=Array.isArray(next.merits)?next.merits:[];
  next.merits=storedMerits.map((value,index)=>{const item=asRecord(value);return {name:String(item.name==="Throne"?"Power Behind the Throne":item.name??""),dots:Number(item.dots??1),instanceId:item.instanceId?String(item.instanceId):`legacy-merit-${index}-${String(item.name??"merit").toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,sourceId:item.sourceId?String(item.sourceId):undefined,source:item.source?String(item.source):undefined,configuration:normalizeMeritConfiguration(item.configuration),grantedBy:item.grantedBy?String(item.grantedBy):undefined};});
  next.line_data=next.line_data&&typeof next.line_data==="object"?next.line_data:{};
  return synchronizeMeritGrants(next);
}
