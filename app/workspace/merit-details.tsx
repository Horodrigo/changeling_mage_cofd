"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import type { MeritDefinition } from "@/lib/merits";
import { useLanguage } from "@/lib/i18n";
import "./merit-details.css";

export function MeritDetails({ merit, catalog, children }: { merit: MeritSelection; catalog: readonly MeritDefinition[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { locale, t } = useLanguage();
  const definition = resolveMeritDefinition(merit, catalog);
  const presented = definition && meritPresentation(definition, locale, catalog);
  const name = presented?.name ?? merit.name;
  const original = locale === "pt-BR" && definition && name !== definition.name ? definition.name : undefined;
  const source = definition ? `${definition.source}${definition.page ? ` · p. ${definition.page}` : ""}` : merit.source;

  return <>
    <button type="button" className="sheet-merit-details-trigger" aria-haspopup="dialog" onClick={event => { event.preventDefault(); event.stopPropagation(); setOpen(true); }}>{children}</button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sheet-merit-details-dialog" showCloseButton>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{original && <span>{original}</span>}{source && <span>{t("ui.source")}: {source}</span>}</DialogDescription>
        </DialogHeader>
        <div className="sheet-merit-details-body">
          <p><strong>{t("ui.prerequisites")}:</strong> {presented?.prerequisites || t("ui.none")}</p>
          {presented?.alternativePrerequisites && <p>{presented.alternativePrerequisites}</p>}
          {presented?.description && <p>{presented.description}</p>}
          {presented?.levels?.map((level, index) => <section key={`${level.rating}-${index}`}><h3>{"•".repeat(level.rating)} {level.name}</h3><p>{level.description}</p></section>)}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
