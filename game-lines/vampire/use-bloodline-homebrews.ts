"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateBloodlineHomebrews, readBloodlineHomebrews } from "./bloodline-homebrews";

export function useBloodlineHomebrews() {
  const [items, setItems] = useState(readBloodlineHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readBloodlineHomebrews());
    void hydrateBloodlineHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
