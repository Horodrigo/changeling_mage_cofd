import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { translate, type Locale } from "@/lib/i18n";
import type { TokenDefinition } from "./catalogs/tokens";
import { configuredTokenPresentation, type TokenConfigurationItem } from "./token-presentation";

export function ConfiguredTokenList({ items, catalog, dots, locale, renderTrifleUses }: {
  items: readonly TokenConfigurationItem[];
  catalog: readonly TokenDefinition[];
  dots: number;
  locale: Locale;
  renderTrifleUses: (item: TokenConfigurationItem, index: number) => ReactNode;
}) {
  const t = (key: string) => translate(locale, key);
  const allocated = items.reduce((sum, item) => sum + item.rating, 0);
  return <div className="contract-power-list configured-token-list">
    {items.map((stored, index) => {
      const item = configuredTokenPresentation(stored, catalog, locale);
      const kind = item.kind === "trifle" ? t("ui.trifleBatch") : item.kind === "bauble" ? t("ui.bauble") : t("ui.token");
      const rows = item.kind === "trifle" ? [[t("ui.effect"), item.effect]]
        : item.kind === "bauble" ? [[t("ui.description"), item.description], [t("ui.crux"), item.crux], [t("ui.catch"), item.catch]]
        : [[t("ui.cost"), item.cost], [t("ui.effect"), item.effect], [t("ui.catch"), item.catch], [t("ui.drawback"), item.drawback]];
      return <details key={item.id || index} className="contract-power-card configured-token-card">
        <summary className="contract-power-summary"><strong>{item.name.trim() || `${kind} ${index + 1}`}</strong><Badge variant="outline">{item.kind === "trifle" ? t("ui.batchOf3") : "•".repeat(Math.max(1, item.rating))}</Badge><small>{kind}</small></summary>
        <div className="contract-power-details"><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>{item.kind === "trifle" && renderTrifleUses(stored, index)}</div>
      </details>;
    })}
    {allocated !== dots && <p className="configured-token-allocation"><strong>{t("ui.unallocatedDots")}:</strong> {Math.max(0, dots - allocated)}</p>}
  </div>;
}
