"use client";

import { useCatalogSnapshot } from "./catalog-boundary";
import { MeritHomebrewPanel } from "./merit-homebrew-panel";
import type { MeritDefinition } from "@/lib/merits";

export default function CoreHomebrew() {
  const catalogs = useCatalogSnapshot();
  return <MeritHomebrewPanel line="Core" catalog={catalogs.get<readonly MeritDefinition[]>("core-merits")}/>;
}
