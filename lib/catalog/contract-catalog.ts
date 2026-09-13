import type { ContractDefinition } from "./catalog-types";

export const CONTRACTS: ContractDefinition[] = [];
export const CONTRACT_NAME_ALIASES: Record<string, string> = {};

export function replaceContractCatalog(contracts: ContractDefinition[]) {
  CONTRACTS.splice(0, CONTRACTS.length, ...contracts);
  for (const key of Object.keys(CONTRACT_NAME_ALIASES)) delete CONTRACT_NAME_ALIASES[key];
  for (const contract of contracts) {
    CONTRACT_NAME_ALIASES[contract.name] = contract.id;
    CONTRACT_NAME_ALIASES[contract.originalName] = contract.id;
  }
}

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

export type { ContractDefinition, SeemingKey } from "./catalog-types";
