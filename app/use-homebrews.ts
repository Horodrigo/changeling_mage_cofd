"use client";

import { useEffect, useState } from "react";
import {
  EMPTY_HOMEBREWS,
  HOMEBREW_EVENT,
  readHomebrews,
  type HomebrewCatalog,
} from "@/lib/homebrews";
import { getDeviceValue } from "@/lib/device-storage";

export function useHomebrews() {
  const [catalog, setCatalog] = useState<HomebrewCatalog>(EMPTY_HOMEBREWS);
  useEffect(() => {
    const refresh = () => setCatalog(readHomebrews());
    void getDeviceValue<HomebrewCatalog>("arquivo-das-trevas:homebrews:v1").then((stored)=>{
      if (stored) { localStorage.setItem("arquivo-das-trevas:homebrews:v1",JSON.stringify(stored)); setCatalog(stored); }
      else refresh();
    });
    window.addEventListener(HOMEBREW_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(HOMEBREW_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return catalog;
}
