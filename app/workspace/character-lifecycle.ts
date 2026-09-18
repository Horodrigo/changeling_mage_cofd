import type { CharacterSheet } from "@/lib/core/character/character-types";
import {
  getGameLineRegistration,
  normalizeGameLineCharacter,
} from "@/game-lines/registry/game-line-registry";

export type CharacterLifecycleErrorCode =
  | "unsupported-schema"
  | "invalid-character"
  | "invalid-json";

export class CharacterLifecycleError extends Error {
  constructor(readonly code: CharacterLifecycleErrorCode) {
    super(code);
    this.name = "CharacterLifecycleError";
  }
}

async function hydrateCharacterCatalogs(gameLine: CharacterSheet["game_line"]) {
  const { loadCatalogGroups } = await import("@/game-lines/registry/catalog-group-registry");
  await loadCatalogGroups(getGameLineRegistration(gameLine).catalogGroups.sheet);
}

async function normalizeCharacter(
  sheet: CharacterSheet,
  hydrateCatalogs: boolean,
): Promise<CharacterSheet> {
  if (hydrateCatalogs) await hydrateCharacterCatalogs(sheet.game_line);
  const { normalizeStoredSheet } = await import("@/lib/character-persistence");
  return normalizeGameLineCharacter(normalizeStoredSheet(sheet));
}

export function prepareCharacterForOpen(sheet: CharacterSheet) {
  return normalizeCharacter(sheet, true);
}

export function prepareCharacterForSave(sheet: CharacterSheet) {
  return normalizeCharacter(sheet, false);
}

export function prepareCharacterForUpdate(sheet: CharacterSheet) {
  return normalizeCharacter(
    {
      ...sheet,
      updated_at: new Date().toISOString(),
    },
    false,
  );
}

export function updateCharacterState(
  character: CharacterSheet,
  currentState: Record<string, unknown>,
): CharacterSheet {
  return {
    ...character,
    current_state: structuredClone(currentState),
    updated_at: new Date().toISOString(),
  };
}

export async function importCharacterFile(file: File): Promise<CharacterSheet> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new CharacterLifecycleError("invalid-json");
  }

  const { validateCurrentCharacter } = await import("@/lib/character-persistence");
  const validation = validateCurrentCharacter(parsed);
  if (validation === "unsupported-schema")
    throw new CharacterLifecycleError("unsupported-schema");
  if (validation !== "valid")
    throw new CharacterLifecycleError("invalid-character");

  return prepareCharacterForOpen(parsed as CharacterSheet);
}
