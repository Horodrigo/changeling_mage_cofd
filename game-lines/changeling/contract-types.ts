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
  homebrew?: true;
}
