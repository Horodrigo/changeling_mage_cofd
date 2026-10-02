"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { AnchorDefinition, WerewolfReferenceCatalog } from "./catalogs/reference";
import "./styles/traits.css";

function AnchorRecovery({ anchor, reference }: { anchor: AnchorDefinition; reference: WerewolfReferenceCatalog }) {
  const { locale, t } = useLanguage();
  const translated = locale === "pt-BR" ? reference.presentation[anchor.id] : undefined;
  return <>
    <p className="wtf-rule-field">{translated?.description ?? anchor.description}</p>
    <p className="wtf-rule-field"><strong>{t("werewolf.regainOne")}:</strong>{" "}{translated?.recoverOne ?? anchor.recoverOne}</p>
    <p className="wtf-rule-field"><strong>{t("werewolf.regainAll")}:</strong>{" "}{translated?.recoverAll ?? anchor.recoverAll}</p>
    <small>{t("conditions.sourcePage", { source: anchor.source, page: anchor.page })}</small>
  </>;
}

export function AnchorDetails({ anchor, reference }: { anchor: AnchorDefinition; reference: WerewolfReferenceCatalog }) {
  const { locale } = useLanguage();
  return <details className="wtf-rule-disclosure"><summary>{locale === "pt-BR" ? reference.presentation[anchor.id]?.name ?? anchor.name : anchor.name}</summary>
    <AnchorRecovery anchor={anchor} reference={reference}/>
  </details>;
}

export function AnchorCatalog({ kind, value, onChange, reference }: {
  kind: "blood" | "bone"; value: string; onChange: (value: string) => void; reference: WerewolfReferenceCatalog;
}) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState(""), [source, setSource] = useState("all");
  const options = reference.anchors.filter(anchor => anchor.kind === kind);
  const text = (anchor: AnchorDefinition) => locale === "pt-BR" ? { ...anchor, ...reference.presentation[anchor.id] } : anchor;
  const visible = options.filter(anchor => (source === "all" || anchor.source === source)
    && [text(anchor).name, text(anchor).description, text(anchor).recoverOne, text(anchor).recoverAll].join(" ").toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale)))
    .sort((a, b) => text(a).name.localeCompare(text(b).name, locale));
  return <div className="wtf-selection-catalog">
    <div className="catalog-filters"><Input value={search} onChange={event => setSearch(event.target.value)} aria-label={t("werewolf.searchAnchors")} placeholder={t("werewolf.searchAnchors")}/>
      <label>{t("ui.source")}<RuleSelect value={source} onChange={setSource} options={[{ value: "all", label: t("ui.allSources"), localized: true }, ...[...new Set(options.map(anchor => anchor.source))].map(source => ({ value: source, label: source, localized: true }))]}/></label>
    </div>
    {visible.map(anchor => <article className="wtf-anchor-option" key={anchor.id}>
      <h4>{text(anchor).name}</h4><AnchorRecovery anchor={anchor} reference={reference}/>
      <Button type="button" size="sm" variant={value === anchor.id ? "default" : "outline"} onClick={() => onChange(anchor.id)}>{t("ui.select")}</Button>
    </article>)}
  </div>;
}

/** Selection persists the canonical ID; it does not grant Willpower. */
export function AnchorField({ kind, value, onChange, reference }: {
  kind: "blood" | "bone"; value: string; onChange: (value: string) => void; reference: WerewolfReferenceCatalog;
}) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const options = reference.anchors.filter(anchor => anchor.kind === kind);
  const selected = options.find(anchor => anchor.id === value);
  const name = (anchor: AnchorDefinition) => locale === "pt-BR" ? reference.presentation[anchor.id]?.name ?? anchor.name : anchor.name;
  return <div className="wtf-anchor-field">
    <strong>{selected ? name(selected) : t("ui.noneSelected")}</strong>
    <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t("werewolf.browseAnchors", { kind: t(`werewolf.${kind}`) })}</Button></DialogTrigger>
      <DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t(`werewolf.${kind}`)}</DialogTitle><DialogDescription>{t("werewolf.anchorRecoveryNote")}</DialogDescription></DialogHeader>
        <AnchorCatalog kind={kind} value={value} reference={reference} onChange={id => { onChange(id); setOpen(false); }}/>
        <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
    {!selected && <p>{t("werewolf.anchorRecoveryNote")}</p>}
    {selected && <AnchorDetails anchor={selected} reference={reference}/>}
  </div>;
}
