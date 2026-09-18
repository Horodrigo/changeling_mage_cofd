"use client";

import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n";

export function MeritCatalogVisibilityToggle({
  showAll,
  setShowAll,
}: {
  showAll: boolean;
  setShowAll: (value: boolean) => void;
}) {
  const { t } = useLanguage();
  const label = t("ui.showAll");

  return (
    <label className="merit-catalog-visibility-toggle">
      <Switch
        size="sm"
        checked={showAll}
        onCheckedChange={setShowAll}
        aria-label={label}
      />
      <span>{label}</span>
    </label>
  );
}
