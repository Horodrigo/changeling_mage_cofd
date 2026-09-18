"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import {
  storedCharacterId,
  type StoredCharacter,
} from "@/lib/stored-character";

function upsertStoredCharacter(
  current: StoredCharacter[],
  sheet: CharacterSheet,
): StoredCharacter[] {
  const exists = current.some((item) => storedCharacterId(item) === sheet.id);
  return exists
    ? current.map((item) => (storedCharacterId(item) === sheet.id ? sheet : item))
    : [sheet, ...current];
}

function replaceStoredCharacter(
  current: StoredCharacter[],
  sheet: CharacterSheet,
): StoredCharacter[] {
  return current.map((item) =>
    storedCharacterId(item) === sheet.id ? sheet : item,
  );
}

function removeStoredCharacter(
  current: StoredCharacter[],
  target: StoredCharacter,
): StoredCharacter[] {
  const id = storedCharacterId(target);
  return current.filter(
    (item) => item !== target && (!id || storedCharacterId(item) !== id),
  );
}

export function useCharacterRepository(userKey: string) {
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [ready, setReady] = useState(false);
  const [readFailed, setReadFailed] = useState(false);
  const storageKey = useMemo(
    () => `arquivo-das-trevas:v2:${userKey}`,
    [userKey],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const stored = await getDeviceValue<StoredCharacter[]>(storageKey);
        if (!cancelled && Array.isArray(stored)) setCharacters(stored);
      } catch {
        if (!cancelled) setReadFailed(true);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;

    stageDeviceValue(storageKey, characters);
    const timer = window.setTimeout(() => {
      void setDeviceValue(storageKey, characters);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [characters, ready, storageKey]);

  const upsertCharacter = useCallback((sheet: CharacterSheet) => {
    setCharacters((current) => upsertStoredCharacter(current, sheet));
  }, []);

  const replaceCharacter = useCallback((sheet: CharacterSheet) => {
    setCharacters((current) => replaceStoredCharacter(current, sheet));
  }, []);

  const removeCharacter = useCallback((target: StoredCharacter) => {
    setCharacters((current) => removeStoredCharacter(current, target));
  }, []);

  return {
    characters,
    ready,
    readFailed,
    upsertCharacter,
    replaceCharacter,
    removeCharacter,
  };
}
