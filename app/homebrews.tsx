"use client";

import { lazy, Suspense, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import { localized, useLanguage } from "@/lib/i18n";
import { CatalogBoundary } from "./catalog-boundary";
import { GameLineHomebrew } from "./game-line-homebrew";
import { HomebrewTransfer } from "./homebrew-transfer";

type Splat = "Core" | PersistedGameLineId;
const CoreHomebrew = lazy(() => import("./core-homebrew"));
const SPLATS: Array<{ id: Splat; label: string }> = [
  { id: "Core", label: "Core" }, { id: "VtR", label: "Vampire" }, { id: "CtL", label: "Changeling" }, { id: "MtA", label: "Mage" },
];

export default function Homebrews() {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [splat, setSplat] = useState<Splat>("Core");
  const registration = splat === "Core" ? null : getGameLineRegistration(splat);
  return <section className="homebrew-page">
    <div className="homebrew-hero"><div><Badge>{h("HOMEBREW", "HOMEBREW")}</Badge><h2>{h("Biblioteca Homebrew", "Homebrew Library")}</h2><p>{h("Consulte o conteúdo implementado e controle fontes ou itens individualmente.", "Browse implemented content and control entire sources or individual items.")}</p></div><Sparkles aria-hidden="true"/></div>
    <HomebrewTransfer/>
    <Tabs value={splat} onValueChange={(value) => setSplat(value as Splat)}><TabsList className="homebrew-tabs-list">{SPLATS.map((item) => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList></Tabs>
    {splat === "Core" ? <CatalogBoundary groups={["core-merits"]}><Suspense fallback={<div className="loading-card">{h("Carregando", "Loading")}</div>}><CoreHomebrew/></Suspense></CatalogBoundary> : registration?.loadHomebrew ? <CatalogBoundary groups={registration.catalogGroups.homebrew ?? []}><GameLineHomebrew key={registration.id} gameLine={registration.id}/></CatalogBoundary> : <section className="panel empty-state"><Sparkles/><h3>{h("Nenhum Homebrew implementado", "No implemented Homebrew")}</h3><p>{h("Esta linha ainda não possui conteúdo Homebrew gerenciável.", "This line does not yet have manageable Homebrew content.")}</p></section>}
  </section>;
}
