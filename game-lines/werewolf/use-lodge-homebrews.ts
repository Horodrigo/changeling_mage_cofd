"use client";

import { useEffect, useState } from "react";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { hydrateWerewolfLodgeHomebrews, readWerewolfLodgeHomebrews } from "./lodge-homebrews";

export function useWerewolfLodgeHomebrews() {
  const [items, setItems] = useState(readWerewolfLodgeHomebrews);
  useEffect(() => {
    const refresh = () => setItems(readWerewolfLodgeHomebrews());
    void hydrateWerewolfLodgeHomebrews().then(setItems);
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return items;
}
