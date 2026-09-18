"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLinePrintOptions, GameLinePrintSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { useCatalogSnapshot } from "../catalog-boundary";

export function CharacterPrintDialog({
  character,
  open,
  onOpenChange,
}: {
  character: CharacterSheet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();
  const catalogs = useCatalogSnapshot();
  const previewRef = useRef<HTMLDivElement>(null);
  const [PrintSheet, setPrintSheet] = useState<ComponentType<GameLinePrintSheetProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [options, setOptions] = useState<GameLinePrintOptions>({
    expandedMeritDetails: false,
    powerDetails: false,
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const loader = getGameLineRegistration(character.game_line).loadPrintSheet;
    if (!loader) return;
    void loader().then(({ Component }) => {
      if (!cancelled) setPrintSheet(() => Component);
    });
    return () => { cancelled = true; };
  }, [character.game_line, open]);

  async function print() {
    if (!ready) return;
    const preview = previewRef.current;
    const printable = preview?.querySelector<HTMLElement>(".ctl-print-document");
    if (!preview || !printable) return;

    const previousTitle = document.title;
    const safeName = character.character.name.trim() || t("ui.character");
    const printSurface = document.createElement("div");
    printSurface.className = "character-print-surface";
    printSurface.append(printable.cloneNode(true));
    document.body.append(printSurface);
    document.title = `${safeName} - Changeling the Lost`;
    document.body.classList.add("character-printing");
    try {
      await document.fonts?.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      window.print();
    } finally {
      printSurface.remove();
      document.body.classList.remove("character-printing");
      document.title = previousTitle;
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="character-print-dialog" showCloseButton>
      <div className="character-print-controls">
        <DialogHeader>
          <DialogTitle>{t("ui.printCtLCharacterSheet")}</DialogTitle>
          <DialogDescription>{t("ui.thePreviewUsesA4PagesAndExcludesApplication")}</DialogDescription>
        </DialogHeader>
        <div className="character-print-options">
          <label>
            <Checkbox checked={options.powerDetails} onCheckedChange={(checked) => setOptions((current) => ({ ...current, powerDetails: checked === true }))}/>
            <span>{t("ui.printFullContractDetails")}</span>
          </label>
          <label>
            <Checkbox checked={options.expandedMeritDetails} onCheckedChange={(checked) => setOptions((current) => ({ ...current, expandedMeritDetails: checked === true }))}/>
            <span>{t("ui.printExpandedMeritDetails")}</span>
          </label>
        </div>
      </div>
      <div ref={previewRef} className="character-print-preview" aria-busy={!ready}>
        {PrintSheet
          ? <PrintSheet character={character} options={options} catalogs={catalogs} onReadyChange={setReady}/>
          : <div className="loading-card">{t("ui.preparingPrint")}</div>}
      </div>
      <DialogFooter className="character-print-footer">
        <DialogClose asChild><Button type="button" size="sm" variant="outline">{t("ui.cancel")}</Button></DialogClose>
        <Button type="button" size="sm" disabled={!ready} onClick={() => void print()}><Printer />{t("ui.printSavePDF")}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
