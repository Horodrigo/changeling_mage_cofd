"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { downloadJson, TransferAction } from "./data-transfer-shared";

const legacyKeys = ["merits", "mageSpells", "mageLegacies", "vampireCatalog", "vampireBloodlines", "changelingCatalog", "changelingContracts", "changelingEntitlements"] as const;
const keys = [...legacyKeys, "werewolfLodges"] as const;

async function modules() {
  const [merits, spells, legacies, vampireCatalog, bloodlines, changelingCatalog, contracts, entitlements, preferences, werewolfLodges] = await Promise.all([
    import("@/lib/merit-homebrews"), import("@/game-lines/mage/spell-homebrews"), import("@/game-lines/mage/legacy-homebrews"),
    import("@/game-lines/vampire/catalog-homebrews"), import("@/game-lines/vampire/bloodline-homebrews"), import("@/game-lines/changeling/catalog-homebrews"),
    import("@/game-lines/changeling/contract-homebrews"), import("@/game-lines/changeling/entitlement-homebrews"), import("@/lib/homebrew"),
    import("@/game-lines/werewolf/lodge-homebrews"),
  ]);
  return { merits, spells, legacies, vampireCatalog, bloodlines, changelingCatalog, contracts, entitlements, preferences, werewolfLodges };
}

export function parseHomebrewTransferEnvelope(value: unknown) {
  const parsed = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  const sourceHomebrews = parsed?.homebrews && typeof parsed.homebrews === "object" && !Array.isArray(parsed.homebrews) ? parsed.homebrews as Record<string, unknown> : null;
  if (!parsed || (parsed.schemaVersion !== 1 && parsed.schemaVersion !== 2 && parsed.schemaVersion !== 3) || !sourceHomebrews || !legacyKeys.every((key) => Array.isArray(sourceHomebrews[key]))) return null;
  const homebrews = { ...sourceHomebrews };
  if (parsed.schemaVersion === 3 && !Array.isArray(homebrews.werewolfLodges)) return null;
  if (parsed.schemaVersion < 3) homebrews.werewolfLodges = [];
  if (parsed.schemaVersion === 2 || parsed.schemaVersion === 3) {
    const preferences = parsed.preferences && typeof parsed.preferences === "object" && !Array.isArray(parsed.preferences) ? parsed.preferences as Record<string, unknown> : null;
    if (!preferences || !Array.isArray(preferences.disabledIds) || !preferences.disabledIds.every((id) => typeof id === "string") || (preferences.enabledIds !== undefined && (!Array.isArray(preferences.enabledIds) || !preferences.enabledIds.every((id) => typeof id === "string")))) return null;
  }
  return { schemaVersion: parsed.schemaVersion, homebrews, preferences: parsed.preferences };
}

export function HomebrewTransfer() {
  const { t } = useLanguage(), input = useRef<HTMLInputElement>(null), [feedback, setFeedback] = useState("");
  const exportAll = async () => {
    const m = await modules(), data = { schemaVersion: 3, exportedAt: new Date().toISOString(), preferences: m.preferences.readHomebrewPreferences(), homebrews: {
      merits: m.merits.readMeritHomebrews(), mageSpells: m.spells.readSpellHomebrews(), mageLegacies: m.legacies.readLegacyHomebrews(), vampireCatalog: m.vampireCatalog.readVampireCatalogHomebrews(), vampireBloodlines: m.bloodlines.readBloodlineHomebrews(), changelingCatalog: m.changelingCatalog.readChangelingCatalogHomebrews(), changelingContracts: m.contracts.readContractHomebrews(), changelingEntitlements: m.entitlements.readEntitlementHomebrews(),
      werewolfLodges: m.werewolfLodges.readWerewolfLodgeHomebrews(),
    } };
    downloadJson(data, `arquivo-das-trevas-homebrews-${new Date().toISOString().slice(0, 10)}.json`);
    setFeedback(t("workspace.homebrewsExported"));
  };
  const importAll = async (file: File) => {
    try {
      const envelope = parseHomebrewTransferEnvelope(JSON.parse(await file.text()));
      if (!envelope) throw new Error("invalid");
      const record = envelope.homebrews;
      const m = await modules();
      const normalized = {
        merits: m.merits.normalizeMeritHomebrews(record.merits), mageSpells: m.spells.normalizeSpellHomebrews(record.mageSpells), mageLegacies: m.legacies.normalizeLegacyHomebrews(record.mageLegacies), vampireCatalog: m.vampireCatalog.normalizeVampireCatalogHomebrews(record.vampireCatalog), vampireBloodlines: m.bloodlines.normalizeBloodlineHomebrews(record.vampireBloodlines), changelingCatalog: m.changelingCatalog.normalizeChangelingCatalogHomebrews(record.changelingCatalog), changelingContracts: m.contracts.normalizeContractHomebrews(record.changelingContracts), changelingEntitlements: m.entitlements.normalizeEntitlementHomebrews(record.changelingEntitlements), werewolfLodges: m.werewolfLodges.normalizeWerewolfLodgeHomebrews(record.werewolfLodges),
      };
      if (envelope.schemaVersion < 3) normalized.werewolfLodges = m.werewolfLodges.readWerewolfLodgeHomebrews();
      if (keys.some((key) => !(key === "werewolfLodges" && envelope.schemaVersion < 3) && normalized[key].length !== (record[key] as unknown[]).length)) throw new Error("invalid");
      const preferences = envelope.schemaVersion === 1 ? null : m.preferences.normalizeHomebrewPreferences(envelope.preferences);
      m.merits.saveMeritHomebrews(normalized.merits); m.spells.saveSpellHomebrews(normalized.mageSpells); m.legacies.saveLegacyHomebrews(normalized.mageLegacies); m.vampireCatalog.saveVampireCatalogHomebrews(normalized.vampireCatalog); m.bloodlines.saveBloodlineHomebrews(normalized.vampireBloodlines); m.changelingCatalog.saveChangelingCatalogHomebrews(normalized.changelingCatalog); m.contracts.saveContractHomebrews(normalized.changelingContracts); m.entitlements.saveEntitlementHomebrews(normalized.changelingEntitlements); m.werewolfLodges.saveWerewolfLodgeHomebrews(normalized.werewolfLodges);
      if (preferences) m.preferences.saveHomebrewPreferences(preferences);
      setFeedback(t("workspace.homebrewsImported"));
    } catch { setFeedback(t("workspace.invalidHomebrewFile")); }
  };
  return <><div className="data-transfer-actions"><TransferAction icon={<Upload aria-hidden="true"/>} title={t("workspace.homebrewImportTitle")} description={t("workspace.homebrewImportDescription")}><Button type="button" size="sm" onClick={() => input.current?.click()}><Upload/> {t("workspace.homebrewImportAction")}</Button><input ref={input} hidden type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importAll(file); event.currentTarget.value = ""; }}/></TransferAction><TransferAction icon={<Download aria-hidden="true"/>} title={t("workspace.homebrewExportTitle")} description={t("workspace.homebrewExportDescription")}><Button type="button" size="sm" variant="outline" onClick={exportAll}><Download/> {t("workspace.homebrewExportAction")}</Button></TransferAction></div>{feedback && <p className="data-transfer-feedback" role="status">{feedback}</p>}</>;
}
