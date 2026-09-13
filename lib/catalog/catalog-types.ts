export interface CatalogManifestEntry {
  version: number;
  url: string;
}

export interface CatalogManifest {
  schemaVersion: number;
  catalogVersion: number;
  catalogs: Record<string, CatalogManifestEntry>;
}

export interface SpellDefinition {
  id: string;
  name: string;
  originalName: string;
  requirements: Record<string, number>;
  practice: string;
  primaryFactor: string;
  withstand: string;
  roteSkills: string[];
  description?: string;
  summary?: string;
  summaryReviewed?: boolean;
  sourceId: string;
  source: string;
  page: number;
  additionalSources?: Array<{ sourceId: string; source: string; page: number }>;
}

export type SpellIndexEntry = Pick<
  SpellDefinition,
  "id" | "name" | "originalName" | "requirements" | "sourceId" | "source" | "page"
> & { shard: string };

export type SeemingKey = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Grimm" | "Ogre" | "Wizened";

export interface ContractDefinition {
  id: string;
  name: string;
  originalName: string;
  type: "Comum" | "Real";
  categoryKind?: "Corte" | "Independente" | "Regalia";
  regalia: string;
  description: string;
  summary?: string;
  effect?: string;
  hasRoll?: boolean;
  dicePool?: string;
  loophole?: string;
  seemingBenefits?: Partial<Record<SeemingKey, string>>;
  courtClauses?: Record<string, string>;
  courtFamily?: string;
  courtIds?: string[];
  supplementalSeemingBenefits?: Record<string, Partial<Record<SeemingKey, string>>>;
  goblin?: boolean;
  cost?: string;
  action?: string;
  duration?: string;
  success?: string;
  exceptionalSuccess?: string;
  failure?: string;
  dramaticFailure?: string;
  options?: string[];
  detailTables?: Array<{ title: string; columns: string[]; rows: string[][] }>;
  goblinDebt?: string;
  sourceId: string;
  source: string;
  page: number;
}

export type ContractIndexEntry = Pick<
  ContractDefinition,
  "id" | "name" | "originalName" | "type" | "categoryKind" | "regalia" | "sourceId" | "source" | "page"
> & { shard: string };
