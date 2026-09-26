"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateSpellHomebrews, readSpellHomebrews } from "./spell-homebrews";

export function useSpellHomebrews() {
  const [items, setItems] = useState(readSpellHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readSpellHomebrews());
    void hydrateSpellHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(HOMEBREW_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return items;
}
