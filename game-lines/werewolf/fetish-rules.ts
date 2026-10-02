import { asRecord } from "@/lib/core/character/current-character-validation";
import { createRandomId } from "@/lib/random-id";
import type { FetishDefinition, FetishKind, FetishText, WerewolfFetishCatalog } from "./catalogs/fetishes";

export type FetishSelection = {
  instanceId: string; catalogId?: string; variantId?: string; quantity: number; spirit: string; notes: string;
  custom?: FetishText & { kind: FetishKind; dots: number };
};

/** Current-schema inventory only. Unknown catalog IDs survive; authored text is never translated. */
export function fetishSelections(value: unknown): FetishSelection[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error("Invalid Werewolf fetish inventory.");
  const ids = new Set<string>();
  return value.map(item => {
    const record = asRecord(item);
    if (typeof record.instanceId !== "string" || !record.instanceId || ids.has(record.instanceId)) throw new Error("Invalid Werewolf fetish instance ID.");
    ids.add(record.instanceId);
    const quantity = record.quantity ?? 1;
    if (!Number.isSafeInteger(quantity) || (quantity as number) < 0) throw new Error("Invalid Werewolf fetish quantity.");
    for (const key of ["spirit", "notes", "variantId"])
      if (record[key] != null && typeof record[key] !== "string") throw new Error("Invalid Werewolf fetish text.");
    if (record.custom != null) {
      const custom = asRecord(record.custom);
      if (record.catalogId != null || (custom.kind !== "fetish" && custom.kind !== "talen") || !Number.isInteger(custom.dots) || Number(custom.dots) < 1 || Number(custom.dots) > 5
        || ["name", "description", "effect"].some(key => typeof custom[key] !== "string")) throw new Error("Invalid custom Werewolf fetish.");
    } else if (typeof record.catalogId !== "string" || !record.catalogId) throw new Error("Missing Werewolf fetish catalog identity.");
    return { ...record, quantity, spirit: record.spirit ?? "", notes: record.notes ?? "" } as FetishSelection;
  });
}

export function catalogFetishSelection(definition: FetishDefinition): FetishSelection {
  return { instanceId: createRandomId(), catalogId: definition.id, quantity: 1, spirit: "", notes: "" };
}

export function customFetishSelection(): FetishSelection {
  return { instanceId: createRandomId(), quantity: 1, spirit: "", notes: "", custom: { kind: "fetish", dots: 1, name: "", description: "", effect: "" } };
}

export function fetishPresentation(item: FetishDefinition, catalog: WerewolfFetishCatalog, locale: "pt-BR" | "en-US"): FetishDefinition {
  const text = locale === "pt-BR" ? catalog.presentation.items[item.id] : undefined;
  return { ...item, name: text?.name ?? item.name, description: text?.description ?? item.description, effect: text?.effect ?? item.effect,
    variants: item.variants?.map(variant => ({ ...variant, name: text?.variants?.[variant.id]?.name ?? variant.name, effect: text?.variants?.[variant.id]?.effect ?? variant.effect })) };
}
