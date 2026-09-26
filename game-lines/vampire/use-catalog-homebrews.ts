"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateVampireCatalogHomebrews, readVampireCatalogHomebrews } from "./catalog-homebrews";

export function useVampireCatalogHomebrews() {
  const [items, setItems] = useState(readVampireCatalogHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readVampireCatalogHomebrews());
    void hydrateVampireCatalogHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh); window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(HOMEBREW_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return items;
}
