"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateChangelingCatalogHomebrews, readChangelingCatalogHomebrews } from "./catalog-homebrews";

export function useChangelingCatalogHomebrews() {
  const [items, setItems] = useState(readChangelingCatalogHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readChangelingCatalogHomebrews());
    void hydrateChangelingCatalogHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh); window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(HOMEBREW_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return items;
}
