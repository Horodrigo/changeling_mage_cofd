"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { CharacterCollectionStore } from "@/lib/character-collection-store";
import {
  storedCharacterId,
  type StoredCharacter,
} from "@/lib/stored-character";

const NO_CHARACTERS: StoredCharacter[] = [];

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

/**
 * Browser-local character collection. Persistence is per character through
 * CharacterCollectionStore: updates are diffed by reference, coalesced and
 * debounced, so an edit writes only the changed character (and its portrait
 * only when the portrait itself changed). pagehide/hidden/unmount write a
 * synchronous checkpoint of uncommitted characters only, then start an
 * IndexedDB flush that the browser may not let finish.
 */
export function useCharacterRepository(userKey: string) {
  // State is keyed by storage key so a user switch never exposes or writes
  // the previous user's collection, without resetting state inside an effect.
  const [collection, setCollection] = useState<{ key: string | null; items: StoredCharacter[] }>({ key: null, items: [] });
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [saveFailedKey, setSaveFailedKey] = useState<string | null>(null);
  const storeRef = useRef<CharacterCollectionStore | null>(null);
  const storageKey = useMemo(
    () => `arquivo-das-trevas:v2:${userKey}`,
    [userKey],
  );
  const ready = collection.key === storageKey;
  const characters = ready ? collection.items : NO_CHARACTERS;
  const readFailed = failedKey === storageKey;
  const saveFailed = saveFailedKey === storageKey;

  useEffect(() => {
    let cancelled = false;
    const store = new CharacterCollectionStore(storageKey, {
      onError: () => { if (!cancelled) setSaveFailedKey(storageKey); },
      onSaved: () => { if (!cancelled) setSaveFailedKey((key) => (key === storageKey ? null : key)); },
    });

    async function load() {
      let stored: StoredCharacter[] = [];
      try {
        stored = await store.load();
        if (!cancelled) storeRef.current = store;
      } catch {
        if (!cancelled) setFailedKey(storageKey);
      } finally {
        if (!cancelled) setCollection({ key: storageKey, items: stored });
      }
    }

    const checkpoint = () => store.checkpoint();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") checkpoint();
    };
    window.addEventListener("pagehide", checkpoint);
    document.addEventListener("visibilitychange", onVisibility);
    void load();
    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", checkpoint);
      document.removeEventListener("visibilitychange", onVisibility);
      if (storeRef.current === store) storeRef.current = null;
      // Synchronous checkpoint first; the async flush is best effort only.
      store.close().catch(() => {});
    };
  }, [storageKey]);

  useEffect(() => {
    if (ready && storeRef.current?.storageKey === collection.key)
      storeRef.current.update(collection.items);
  }, [collection, ready]);

  const mutate = useCallback(
    (change: (current: StoredCharacter[]) => StoredCharacter[]) =>
      setCollection((current) => (current.key === null ? current : { key: current.key, items: change(current.items) })),
    [],
  );

  const upsertCharacter = useCallback((sheet: CharacterSheet) => {
    mutate((current) => upsertStoredCharacter(current, sheet));
  }, [mutate]);

  const replaceCharacter = useCallback((sheet: CharacterSheet) => {
    mutate((current) => replaceStoredCharacter(current, sheet));
  }, [mutate]);

  const removeCharacter = useCallback((target: StoredCharacter) => {
    mutate((current) => removeStoredCharacter(current, target));
  }, [mutate]);

  /** Commits pending changes now; rejects with the storage error. */
  const flushCharacters = useCallback(async () => {
    await storeRef.current?.flush();
  }, []);

  return {
    characters,
    ready,
    readFailed,
    saveFailed,
    upsertCharacter,
    replaceCharacter,
    removeCharacter,
    flushCharacters,
  };
}
