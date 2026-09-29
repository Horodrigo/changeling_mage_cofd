import type { ContractDefinition } from "./catalog/contract-catalog";
import type { Locale } from "./i18n";

export type ContractPresentation = Pick<ContractDefinition, "name" | "description"> & Partial<Pick<ContractDefinition,
  "summary" | "effect" | "dicePool" | "loophole" | "seemingBenefits" | "courtClauses" |
  "supplementalSeemingBenefits" | "cost" | "action" | "duration" | "success" |
  "exceptionalSuccess" | "failure" | "dramaticFailure" | "options" | "detailTables" | "goblinDebt"
>>;
export type ContractPresentationCatalog = Record<string, ContractPresentation>;

export type ContractMechanics = Pick<ContractDefinition,
  "description" | "effect" | "dicePool" | "hasRoll" | "success" | "exceptionalSuccess" | "failure" | "dramaticFailure"
>;

// An effect may call for a later attack/skill roll without an invocation roll.
// Only the invocation's dice pool determines which headings are displayed.
export function contractHasInvocationRoll(contract: Pick<ContractDefinition, "dicePool" | "hasRoll">) {
  if (typeof contract.hasRoll === "boolean") return contract.hasRoll;
  const pool = contract.dicePool?.trim().toLocaleLowerCase("pt-BR");
  if (!pool || ["não informada", "não informado"].includes(pool)) return undefined;
  return !/^(nenhum[a]?|none|sem (?:teste|jogada)|n\/?a|[-—])\.?$/.test(pool);
}

export function contractDisplayOptions(contract:Pick<ContractDefinition,"id"|"options">,locale:Locale="en-US") {
  void locale;
  return contract.options ?? [];
}

export function contractPresentation(contract:ContractDefinition,locale:Locale="en-US",catalog:ContractPresentationCatalog={}):ContractDefinition {
  const localized=locale==="pt-BR"?catalog[contract.id]:undefined;
  if(!localized)return contract;
  const localizedBenefits={...localized.seemingBenefits,...Object.assign({},...Object.values(localized.supplementalSeemingBenefits??{}))};
  const seemingBenefits=Object.fromEntries(Object.entries(contract.seemingBenefits??{}).map(([key,text])=>[key,localizedBenefits[key as keyof typeof localizedBenefits]??text]));
  return { ...contract, ...localized, seemingBenefits };
}

export function contractSummary(contract:ContractDefinition,locale:Locale="en-US") {
  void locale;
  if (contract.summary?.trim()) return contract.summary.trim();
  if (contractHasInvocationRoll(contract) !== true) return "";
  return contract.description.trim();
}

export function contractWithSupplementalBenefits(contract:ContractDefinition,activeSourceIds:readonly string[]) {
  const supplements=contract.supplementalSeemingBenefits ?? {};
  return {
    ...contract,
    seemingBenefits: activeSourceIds.reduce((benefits,sourceId) => ({...benefits,...supplements[sourceId]}),{...contract.seemingBenefits}),
  };
}

export function contractOutcomeSections(contract: ContractMechanics & {id?:string},locale:Locale="en-US") {
  const main = contract.effect?.trim() || contract.success?.trim() || contract.description.trim();
  if (contractHasInvocationRoll(contract) !== true) {
    return main ? [{ label: locale==="en-US"?"Effect":"Efeito", text: main }] : [];
  }
  return [
    { label: locale==="en-US"?"Success":"Sucesso", text: main },
    { label: locale==="en-US"?"Exceptional Success":"Sucesso Excepcional", text: contract.exceptionalSuccess?.trim() },
    { label: locale==="en-US"?"Failure":"Falha", text: contract.failure?.trim() },
    { label: locale==="en-US"?"Dramatic Failure":"Falha Dramática", text: contract.dramaticFailure?.trim() },
  ].filter((section): section is { label: string; text: string } => Boolean(section.text));
}
