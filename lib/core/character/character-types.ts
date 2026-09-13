import type { MeritConfiguration } from "./merit-configuration";
import type { PersistedGameLineId } from "./game-line-ids";

/** A persisted specialty, independent of any editor implementation. */
export type Specialty = { skill: string; name: string; grantedBy?: string };

/** A persisted Merit purchase or grant. */
export type MeritSelection = {
  instanceId?: string;
  name: string;
  dots: number;
  sourceId?: string;
  source?: string;
  configuration?: MeritConfiguration;
  grantedBy?: string;
  creationDots?: number;
  experienceDots?: number;
};

/**
 * Current persisted character schema. `line_data` remains deliberately open so
 * individual game lines own their mechanics without changing this record shape.
 */
export type CharacterSheet = {
  id: string;
  schema_version: 2;
  system: "chronicles-of-darkness";
  game_line: PersistedGameLineId;
  ruleset: { id: string; version: number };
  character: { name: string; concept: string; player: string; chronicle?: string };
  attributes: Record<string, number>;
  skills: Record<string, number>;
  specializations: Specialty[];
  merits: MeritSelection[];
  line_data: Record<string, unknown>;
  derived: Record<string, number>;
  current_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
