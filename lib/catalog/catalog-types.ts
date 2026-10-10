import type { CatalogNameQualifier } from "@/lib/localized-catalog";

export interface CatalogManifestEntry {
  version: number;
  url: string;
  hash?: string;
}

export interface CatalogManifest {
  schemaVersion: number;
  catalogVersion: number;
  catalogs: Record<string, CatalogManifestEntry>;
}

/** Shared catalog record shape; individual lines may add their own categories. */
export interface ConditionDefinition {
  id: string;
  name: string;
  originalName: string;
  nameQualifier?: CatalogNameQualifier;
  category: string;
  description: string;
  penalty?: string;
  resolution?: string;
  beat?: string;
  persistent?: boolean;
  source: string;
  sourceCode: string;
  page: number;
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
