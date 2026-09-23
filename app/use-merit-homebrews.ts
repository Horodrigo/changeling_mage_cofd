"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateMeritHomebrews, readMeritHomebrews, type MeritHomebrewLine } from "@/lib/merit-homebrews";

export function useMeritHomebrews(line?: MeritHomebrewLine, includeCore = false) {
  const [items, setItems] = useState(readMeritHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readMeritHomebrews());
    void hydrateMeritHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return line ? items.filter((item) => item.line === line || (includeCore && item.line === "Core")) : items;
}
