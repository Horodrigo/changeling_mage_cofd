"use client";

import { useEffect, useState } from "react";
import {
  EMPTY_HOMEBREWS,
  HOMEBREW_EVENT,
  readHomebrews,
  type HomebrewCatalog,
} from "@/lib/homebrews";

export function useHomebrews() {
  const [catalog, setCatalog] = useState<HomebrewCatalog>(EMPTY_HOMEBREWS);
  useEffect(() => {
    const refresh = () => setCatalog(readHomebrews());
    refresh();
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return catalog;
}
