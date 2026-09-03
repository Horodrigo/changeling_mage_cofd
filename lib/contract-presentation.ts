import type { ContractDefinition } from "./contracts";

export type ContractMechanics = Pick<ContractDefinition,
  "description" | "dicePool" | "hasRoll" | "success" | "exceptionalSuccess" | "failure" | "dramaticFailure"
>;

// An effect may call for a later attack/skill roll without an invocation roll.
// Only the invocation's dice pool determines which headings are displayed.
export function contractHasInvocationRoll(contract: Pick<ContractDefinition, "dicePool" | "hasRoll">) {
  if (typeof contract.hasRoll === "boolean") return contract.hasRoll;
  const pool = contract.dicePool?.trim().toLocaleLowerCase("pt-BR");
  if (!pool || ["não informada", "não informado"].includes(pool)) return undefined;
  return !/^(nenhum[a]?|none|sem (?:teste|jogada)|n\/?a|[-—])\.?$/.test(pool);
}

export function contractOutcomeSections(contract: ContractMechanics) {
  const main = contract.success?.trim() || contract.description.trim();
  if (contractHasInvocationRoll(contract) !== true) {
    return main ? [{ label: "Efeito", text: main }] : [];
  }
  return [
    { label: "Sucesso", text: main },
    { label: "Sucesso Excepcional", text: contract.exceptionalSuccess?.trim() },
    { label: "Falha", text: contract.failure?.trim() },
    { label: "Falha Dramática", text: contract.dramaticFailure?.trim() },
  ].filter((section): section is { label: string; text: string } => Boolean(section.text));
}
