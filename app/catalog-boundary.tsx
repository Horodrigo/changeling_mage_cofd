"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

type CatalogResource =
  | "mage-spells"
  | "changeling-contracts"
  | "merits-changeling"
  | "merits-mage"
  | "merits-all"
  | "changeling-reference"
  | "core-reference";

async function hydrateResource(resource: CatalogResource) {
  const { catalogService } = await import("@/lib/catalog/catalog-service");
  if (resource === "mage-spells") return catalogService.hydrateSpells();
  if (resource === "changeling-contracts") return catalogService.hydrateContracts();
  if (resource === "merits-changeling") return catalogService.hydrateMerits("CtL");
  if (resource === "merits-mage") return catalogService.hydrateMerits("MtA");
  if (resource === "merits-all") return catalogService.hydrateMerits("all");
  if (resource === "changeling-reference") return catalogService.hydrateChangelingReference();
  return catalogService.hydrateCoreReference();
}

export function CatalogBoundary({
  resources,
  children,
}: {
  resources: CatalogResource[];
  children: ReactNode;
}) {
  const { tr } = useLanguage();
  const resourceKey = resources.join("|");
  const [result, setResult] = useState<{
    key: string;
    state: "loading" | "ready" | "error";
  }>({ key: resourceKey, state: resources.length ? "loading" : "ready" });

  useEffect(() => {
    let cancelled = false;
    const requestedResources = resourceKey
      ? (resourceKey.split("|") as CatalogResource[])
      : [];
    Promise.all(requestedResources.map(hydrateResource)).then(
      () => { if (!cancelled) setResult({ key: resourceKey, state: "ready" }); },
      () => { if (!cancelled) setResult({ key: resourceKey, state: "error" }); },
    );
    return () => { cancelled = true; };
  }, [resourceKey]);

  const state = result.key === resourceKey ? result.state : "loading";

  if (state === "loading")
    return <div className="loading-card">{tr("Carregando catálogo…", "Loading catalog…")}</div>;
  if (state === "error")
    return (
      <div className="notice" role="alert">
        {tr(
          "O catálogo não está disponível neste dispositivo. Conecte-se e tente novamente.",
          "The catalog is not available on this device. Connect and try again.",
        )}
      </div>
    );
  return children;
}
