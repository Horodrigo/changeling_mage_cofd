"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage, type MessageKey } from "@/lib/i18n";
import type { FacetDefinition, GiftDefinition, WerewolfGiftCatalog } from "./catalogs/gifts";
import type { AuspiceDefinition, RenownId, TribeDefinition } from "./catalogs/reference";
import { creationGiftSelection, type WerewolfCreationChoices } from "./creation-rules";
import "./styles/traits.css";
import "./styles/builder.css";

const RULE_FIELDS = [
  ["cost", "ui.cost"], ["dicePool", "ui.dicePool"], ["action", "ui.action"], ["duration", "ui.duration"],
  ["activationRequirement", "werewolf.activationRequirement"], ["effect", "ui.effect"], ["options", "werewolf.options"],
  ["dramaticFailure", "ui.dramaticFailure"], ["failure", "ui.failure"], ["success", "ui.success"], ["exceptionalSuccess", "ui.exceptionalSuccess"],
] as const satisfies ReadonlyArray<readonly [keyof FacetDefinition, MessageKey]>;

/** Only presentation changes with locale; there are no activation or resource-changing actions. */
export function FacetRules({ facet, gifts }: { facet: FacetDefinition; gifts: WerewolfGiftCatalog }) {
  const { locale, t } = useLanguage();
  const translated = locale === "pt-BR" ? gifts.presentation[facet.id] : undefined;
  return <>
    <p className="wtf-rule-field">{translated?.description ?? facet.description}</p>
    {RULE_FIELDS.map(([field, label]) => facet[field] ? <p className="wtf-rule-field" key={field}>
      <strong>{t(label)}:</strong>{" "}{translated?.[field] ?? facet[field]}
    </p> : null)}
    <small>{t("conditions.sourcePage", { source: facet.source, page: facet.additionalPages?.length ? `${facet.page}–${facet.additionalPages.at(-1)}` : facet.page })}</small>
  </>;
}

export function CreationGifts({ value, onChange, auspice, tribe, gifts }: {
  value: WerewolfCreationChoices; onChange: (value: WerewolfCreationChoices) => void;
  auspice: AuspiceDefinition; tribe: TribeDefinition; gifts: WerewolfGiftCatalog;
}) {
  const { locale, t } = useLanguage();
  const controlId = useId();
  const grants = creationGiftSelection(auspice, tribe, value.renown_choice as RenownId, gifts.gifts, value);
  const name = (item: GiftDefinition | FacetDefinition) => locale === "pt-BR" ? gifts.presentation[item.id]?.name ?? item.name : item.name;
  const toggle = (key: "shadow_facets" | "wolf_facets", id: string) => onChange({
    ...value, [key]: value[key].includes(id) ? value[key].filter(item => item !== id) : [...value[key], id],
  });
  return <div className="wtf-creation-gifts">
    <h3>{t("werewolf.moonGift")}</h3>
    <p>{t("werewolf.automaticMoonFacets")}</p>
    {grants.moonFacetIds.map(id => {
      const facet = gifts.gifts.find(gift => gift.id === grants.moonGiftId)!.facets.find(item => item.id === id)!;
      return <details className="wtf-rule-disclosure" key={id}><summary>{name(facet)} · {facet.level}</summary><FacetRules facet={facet} gifts={gifts}/></details>;
    })}
    {(["shadow", "wolf"] as const).map(kind => {
      const key = kind === "shadow" ? "shadow_facets" : "wolf_facets";
      const selected = value[key];
      const required = kind === "shadow" ? grants.shadowFacetCount : grants.wolfFacetCount;
      const parents = gifts.gifts.filter(gift => gift.kind === kind && (kind === "wolf" || grants.shadowGiftIds.includes(gift.id) || gift.facets.some(facet => selected.includes(facet.id))));
      return <section key={kind}>
        <h3>{t(kind === "shadow" ? "werewolf.shadowGift" : "werewolf.wolfGift")}</h3>
        <p>{t("werewolf.selectedFacets", { selected: selected.length, required })}</p>
        {[...parents].sort((a, b) => name(a).localeCompare(name(b), locale)).map(gift => <div className="wtf-gift-choices" key={gift.id}>
          <h4>{name(gift)}</h4>
          {[...gift.facets].sort((a, b) => name(a).localeCompare(name(b), locale)).map(facet => {
            const checked = selected.includes(facet.id);
            const renown = t(`werewolf.renownNames.${facet.renown}`);
            const reason = grants.renown[facet.renown] < 1 ? t("werewolf.needsRenown", { renown })
              : kind === "shadow" && !grants.shadowGiftIds.includes(gift.id) ? t("werewolf.unfavoredCreationGift")
              : kind === "shadow" && gift.facets.some(other => other.id !== facet.id && selected.includes(other.id)) ? t("werewolf.duplicateCreationGift")
              : selected.length >= required && !checked ? t("werewolf.creationFacetLimit") : "";
            return <div className="wtf-facet-choice" key={facet.id}>
              <details className="wtf-rule-disclosure"><summary>{name(facet)} · {renown}</summary><FacetRules facet={facet} gifts={gifts}/></details>
              <label className="wtf-facet-toggle"><Checkbox aria-label={t("werewolf.selectFacet", { name: name(facet) })} aria-describedby={reason ? `${controlId}-${facet.id}` : undefined}
                checked={checked} disabled={!checked && Boolean(reason)} onCheckedChange={() => toggle(key, facet.id)}/></label>
              {reason && <small id={`${controlId}-${facet.id}`} className="wtf-facet-reason">{reason}</small>}
            </div>;
          })}
        </div>)}
        {selected.filter(id => !parents.some(gift => gift.facets.some(facet => facet.id === id))).map((id, index) => <div className="wtf-missing-facet" key={`${id}-${index}`}>
          <p>{t("werewolf.missingSelectedFacet", { id })}</p><Button variant="outline" size="sm" onClick={() => toggle(key, id)}>{t("common.remove")}</Button>
        </div>)}
      </section>;
    })}
  </div>;
}
