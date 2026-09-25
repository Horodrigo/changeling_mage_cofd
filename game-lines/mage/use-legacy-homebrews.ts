"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateLegacyHomebrews, readLegacyHomebrews } from "./legacy-homebrews";

export function useLegacyHomebrews() {
  const [items, setItems] = useState(readLegacyHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readLegacyHomebrews());
    void hydrateLegacyHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
