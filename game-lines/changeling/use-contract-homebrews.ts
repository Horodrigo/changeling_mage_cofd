"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateContractHomebrews, readContractHomebrews } from "./contract-homebrews";

export function useContractHomebrews() {
  const [items, setItems] = useState(readContractHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readContractHomebrews());
    void hydrateContractHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
