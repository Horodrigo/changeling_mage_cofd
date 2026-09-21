"use client";

import { useEffect, useState } from "react";
import { getDeviceValue } from "@/lib/device-storage";
import {
  EMPTY_HOMEBREW_PREFERENCES,
  HOMEBREW_EVENT,
  HOMEBREW_PREFERENCES_KEY,
  normalizeHomebrewPreferences,
  readHomebrewPreferences,
  type HomebrewPreferences,
} from "@/lib/homebrew";

export function useHomebrewPreferences() {
  const [preferences, setPreferences] = useState<HomebrewPreferences>(EMPTY_HOMEBREW_PREFERENCES);
  useEffect(() => {
    const refresh = () => setPreferences(readHomebrewPreferences());
    refresh();
    void getDeviceValue<HomebrewPreferences>(HOMEBREW_PREFERENCES_KEY).then((stored) => {
      if (!stored) return;
      localStorage.setItem(HOMEBREW_PREFERENCES_KEY, JSON.stringify(normalizeHomebrewPreferences(stored)));
      refresh();
    });
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return preferences;
}
