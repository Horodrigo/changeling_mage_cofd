export type SeemingKey = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";

export type ContractDefinition = {
  id: string;
  name: string;
  originalName: string;
  type: "Comum" | "Real";
  regalia: string;
  description: string;
  hasRoll?: boolean;
  dicePool?: string;
  loophole?: string;
  seemingBenefits?: Partial<Record<SeemingKey, string>>;
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
  goblinDebt?: string;
  sourceId: string;
  source: string;
  page: number;
};

// Intentionally empty while the English-first Contract catalog is rebuilt
// and checked against both the offline index and the source PDFs.
export const CONTRACTS: ContractDefinition[] = [];

export const CONTRACT_NAME_ALIASES: Record<string, string> = {};

export function findContract(name: string) {
  const id = CONTRACT_NAME_ALIASES[name];
  return CONTRACTS.find(
    (contract) =>
      contract.id === name ||
      contract.id === id ||
      contract.name === name ||
      contract.originalName === name,
  );
}
