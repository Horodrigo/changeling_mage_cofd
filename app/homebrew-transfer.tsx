"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localized, useLanguage } from "@/lib/i18n";

const keys = ["merits", "mageSpells", "mageLegacies", "vampireCatalog", "vampireBloodlines", "changelingCatalog", "changelingContracts", "changelingEntitlements"] as const;

async function modules() {
  const [merits, spells, legacies, vampireCatalog, bloodlines, changelingCatalog, contracts, entitlements] = await Promise.all([
    import("@/lib/merit-homebrews"), import("@/game-lines/mage/spell-homebrews"), import("@/game-lines/mage/legacy-homebrews"),
    import("@/game-lines/vampire/catalog-homebrews"), import("@/game-lines/vampire/bloodline-homebrews"), import("@/game-lines/changeling/catalog-homebrews"),
    import("@/game-lines/changeling/contract-homebrews"), import("@/game-lines/changeling/entitlement-homebrews"),
  ]);
  return { merits, spells, legacies, vampireCatalog, bloodlines, changelingCatalog, contracts, entitlements };
}

export function HomebrewTransfer() {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en), input = useRef<HTMLInputElement>(null), [feedback, setFeedback] = useState("");
  const exportAll = async () => {
    const m = await modules(), data = { schemaVersion: 1, exportedAt: new Date().toISOString(), homebrews: {
      merits: m.merits.readMeritHomebrews(), mageSpells: m.spells.readSpellHomebrews(), mageLegacies: m.legacies.readLegacyHomebrews(), vampireCatalog: m.vampireCatalog.readVampireCatalogHomebrews(), vampireBloodlines: m.bloodlines.readBloodlineHomebrews(), changelingCatalog: m.changelingCatalog.readChangelingCatalogHomebrews(), changelingContracts: m.contracts.readContractHomebrews(), changelingEntitlements: m.entitlements.readEntitlementHomebrews(),
    } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })), anchor = document.createElement("a");
    anchor.href = url; anchor.download = `arquivo-das-trevas-homebrews-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    setFeedback(h("Homebrews exportados.", "Homebrews exported."));
  };
  const importAll = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as { schemaVersion?: unknown; homebrews?: unknown }, record = parsed.homebrews && typeof parsed.homebrews === "object" && !Array.isArray(parsed.homebrews) ? parsed.homebrews as Record<string, unknown> : null;
      if (parsed.schemaVersion !== 1 || !record || !keys.every((key) => Array.isArray(record[key]))) throw new Error("invalid");
      const m = await modules();
      const normalized = {
        merits: m.merits.normalizeMeritHomebrews(record.merits), mageSpells: m.spells.normalizeSpellHomebrews(record.mageSpells), mageLegacies: m.legacies.normalizeLegacyHomebrews(record.mageLegacies), vampireCatalog: m.vampireCatalog.normalizeVampireCatalogHomebrews(record.vampireCatalog), vampireBloodlines: m.bloodlines.normalizeBloodlineHomebrews(record.vampireBloodlines), changelingCatalog: m.changelingCatalog.normalizeChangelingCatalogHomebrews(record.changelingCatalog), changelingContracts: m.contracts.normalizeContractHomebrews(record.changelingContracts), changelingEntitlements: m.entitlements.normalizeEntitlementHomebrews(record.changelingEntitlements),
      };
      if (keys.some((key) => normalized[key].length !== (record[key] as unknown[]).length)) throw new Error("invalid");
      m.merits.saveMeritHomebrews(normalized.merits); m.spells.saveSpellHomebrews(normalized.mageSpells); m.legacies.saveLegacyHomebrews(normalized.mageLegacies); m.vampireCatalog.saveVampireCatalogHomebrews(normalized.vampireCatalog); m.bloodlines.saveBloodlineHomebrews(normalized.vampireBloodlines); m.changelingCatalog.saveChangelingCatalogHomebrews(normalized.changelingCatalog); m.contracts.saveContractHomebrews(normalized.changelingContracts); m.entitlements.saveEntitlementHomebrews(normalized.changelingEntitlements);
      setFeedback(h("Todos os homebrews do jogador foram importados.", "All player-created homebrews were imported."));
    } catch { setFeedback(h("Arquivo inválido. Nenhum homebrew foi alterado.", "Invalid file. No homebrews were changed.")); }
  };
  return <section className="homebrew-panel"><div className="panel-heading"><div><h3>{h("Importar ou exportar", "Import or Export")}</h3><p>{h("O arquivo reúne todos os homebrews criados pelo jogador. A importação substitui o conjunto local após validar o arquivo inteiro.", "The file contains every player-created homebrew. Import replaces the local set after validating the entire file.")}</p></div><div className="homebrew-card-actions"><Button type="button" size="sm" variant="outline" onClick={exportAll}><Download/> {h("Exportar tudo", "Export all")}</Button><Button type="button" size="sm" onClick={() => input.current?.click()}><Upload/> {h("Importar tudo", "Import all")}</Button><input ref={input} hidden type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importAll(file); event.currentTarget.value = ""; }}/></div></div>{feedback && <p role="status">{feedback}</p>}</section>;
}
