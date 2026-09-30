"use client";

import { lazy, Suspense, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import { useLanguage } from "@/lib/i18n";
import { CatalogBoundary } from "./catalog-boundary";
import { GameLineHomebrew } from "./game-line-homebrew";

type Splat = "Core" | PersistedGameLineId;
const CoreHomebrew = lazy(() => import("./core-homebrew"));
const SPLATS: Array<{ id: Splat; label: string }> = [
  { id: "Core", label: "Core" }, { id: "VtR", label: "Vampire" }, { id: "CtL", label: "Changeling" }, { id: "MtA", label: "Mage" },
];

export default function Homebrews() {
  const { t } = useLanguage();
  const [splat, setSplat] = useState<Splat>("Core");
  const registration = splat === "Core" ? null : getGameLineRegistration(splat);
  return <section className="homebrew-page">
    <div className="homebrew-hero"><div><Badge>{t("workspace.homebrewBadge")}</Badge><h2>{t("workspace.homebrewLibrary")}</h2><p>{t("workspace.homebrewLibraryDescription")}</p></div><Sparkles aria-hidden="true"/></div>
    <Tabs value={splat} onValueChange={(value) => setSplat(value as Splat)}><TabsList className="homebrew-tabs-list">{SPLATS.map((item) => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList></Tabs>
    {splat === "Core" ? <CatalogBoundary groups={["core-merits"]}><Suspense fallback={<div className="loading-card">{t("workspace.loading")}</div>}><CoreHomebrew/></Suspense></CatalogBoundary> : registration?.loadHomebrew ? <CatalogBoundary groups={registration.catalogGroups.homebrew ?? []}><GameLineHomebrew key={registration.id} gameLine={registration.id}/></CatalogBoundary> : <section className="panel empty-state"><Sparkles/><h3>{t("workspace.noImplementedHomebrew")}</h3><p>{t("workspace.noImplementedHomebrewDescription")}</p></section>}
  </section>;
}
