import type { ContractDefinition } from "./contracts";
import type { Locale } from "./i18n";
import { CONTRACT_TEXT_EN } from "./contracts-en";

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

export function contractDisplayName(contract:Pick<ContractDefinition,"id"|"name"|"originalName">,locale:Locale="pt-BR") {
  return locale==="en-US"?contract.originalName:contract.name;
}

export function contractDisplayOptions(contract:Pick<ContractDefinition,"id"|"options">,locale:Locale="pt-BR") {
  if (locale === "en-US") return CONTRACT_TEXT_EN[contract.id]?.options ?? contract.options ?? [];
  return contract.options ?? [];
}

export function contractOutcomeSections(contract: ContractMechanics & {id?:string},locale:Locale="pt-BR") {
  const english=locale==="en-US"&&contract.id?CONTRACT_TEXT_EN[contract.id]:undefined;
  const description=english?.description??contract.description;
  const success=english?.success??contract.success;
  const main = success?.trim() || description.trim();
  if (contractHasInvocationRoll(contract) !== true) {
    return main ? [{ label: locale==="en-US"?"Effect":"Efeito", text: main }] : [];
  }
  return [
    { label: locale==="en-US"?"Success":"Sucesso", text: main },
    { label: locale==="en-US"?"Exceptional Success":"Sucesso Excepcional", text: (english?.exceptionalSuccess??contract.exceptionalSuccess)?.trim() },
    { label: locale==="en-US"?"Failure":"Falha", text: (english?.failure??contract.failure)?.trim() },
    { label: locale==="en-US"?"Dramatic Failure":"Falha Dramática", text: (english?.dramaticFailure??contract.dramaticFailure)?.trim() },
  ].filter((section): section is { label: string; text: string } => Boolean(section.text));
}
