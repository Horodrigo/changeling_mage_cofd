"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateEntitlementHomebrews, readEntitlementHomebrews } from "./entitlement-homebrews";

export function useEntitlementHomebrews() {
  const [items, setItems] = useState(readEntitlementHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readEntitlementHomebrews());
    void hydrateEntitlementHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
