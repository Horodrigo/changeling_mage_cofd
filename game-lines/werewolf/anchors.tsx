"use client";

import { useLanguage } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnchorDefinition, WerewolfReferenceCatalog } from "./catalogs/reference";
import "./styles/traits.css";

export function AnchorDetails({ anchor, reference }: { anchor: AnchorDefinition; reference: WerewolfReferenceCatalog }) {
  const { locale, t } = useLanguage();
  const translated = locale === "pt-BR" ? reference.presentation[anchor.id] : undefined;
  return <details className="wtf-rule-disclosure"><summary>{translated?.name ?? anchor.name}</summary>
    <p className="wtf-rule-field">{translated?.description ?? anchor.description}</p>
    <p className="wtf-rule-field"><strong>{t("werewolf.regainOne")}:</strong>{" "}{translated?.recoverOne ?? anchor.recoverOne}</p>
    <p className="wtf-rule-field"><strong>{t("werewolf.regainAll")}:</strong>{" "}{translated?.recoverAll ?? anchor.recoverAll}</p>
    <small>{t("conditions.sourcePage", { source: anchor.source, page: anchor.page })}</small>
  </details>;
}

/** Selection persists the canonical ID; it does not grant Willpower. */
export function AnchorField({ kind, value, onChange, reference }: {
  kind: "blood" | "bone"; value: string; onChange: (value: string) => void; reference: WerewolfReferenceCatalog;
}) {
  const { locale, t } = useLanguage();
  const options = reference.anchors.filter(anchor => anchor.kind === kind);
  const selected = options.find(anchor => anchor.id === value);
  const name = (anchor: AnchorDefinition) => locale === "pt-BR" ? reference.presentation[anchor.id]?.name ?? anchor.name : anchor.name;
  return <div className="wtf-anchor-field">
    <Select value={selected?.id ?? ""} onValueChange={onChange}>
      <SelectTrigger aria-label={t(kind === "blood" ? "werewolf.blood" : "werewolf.bone")}><SelectValue placeholder={t(kind === "blood" ? "werewolf.blood" : "werewolf.bone")}/></SelectTrigger>
      <SelectContent>{[...options].sort((a, b) => name(a).localeCompare(name(b), locale)).map(anchor => <SelectItem key={anchor.id} value={anchor.id}>{name(anchor)}</SelectItem>)}</SelectContent>
    </Select>
    {selected && <AnchorDetails anchor={selected} reference={reference}/>}
  </div>;
}
