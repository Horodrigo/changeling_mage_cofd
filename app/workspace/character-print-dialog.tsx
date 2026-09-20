"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
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
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [PrintSheet, setPrintSheet] = useState<ComponentType<GameLinePrintSheetProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0, scale: 1 });
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

  useLayoutEffect(() => {
    if (!open) return;
    const preview = previewRef.current;
    const printable = previewContentRef.current?.querySelector<HTMLElement>(".game-print-document");
    if (!preview || !printable) return;
    const resize = () => {
      const width = printable.scrollWidth;
      const height = printable.scrollHeight;
      const scale = Math.min(1, Math.max(0.1, (preview.clientWidth - 16) / width));
      setPreviewSize({ width: width * scale, height: height * scale, scale });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(preview);
    observer.observe(printable);
    resize();
    return () => observer.disconnect();
  }, [open, PrintSheet, ready, options]);

  async function print() {
    if (!ready) return;
    const preview = previewRef.current;
    const printable = preview?.querySelector<HTMLElement>(".game-print-document");
    if (!preview || !printable) return;

    const previousTitle = document.title;
    const safeName = character.character.name.trim() || t("ui.character");
    const printSurface = document.createElement("div");
    printSurface.className = "character-print-surface";
    printSurface.appendChild(printable.cloneNode(true));
    document.body.appendChild(printSurface);
    document.title = `${safeName} - ${getGameLineRegistration(character.game_line).label}`;
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
          <DialogTitle>{t("ui.printCharacterSheet")}</DialogTitle>
          <DialogDescription>{t("ui.thePreviewUsesA4PagesAndExcludesApplication")}</DialogDescription>
        </DialogHeader>
        {character.game_line === "CtL" && <div className="character-print-options">
          <label>
            <Checkbox checked={options.powerDetails} onCheckedChange={(checked) => setOptions((current) => ({ ...current, powerDetails: checked === true }))}/>
            <span>{t("ui.printFullPowerDetails")}</span>
          </label>
          <label>
            <Checkbox checked={options.expandedMeritDetails} onCheckedChange={(checked) => setOptions((current) => ({ ...current, expandedMeritDetails: checked === true }))}/>
            <span>{t("ui.printExpandedMeritDetails")}</span>
          </label>
        </div>}
      </div>
      <div ref={previewRef} className="character-print-preview" aria-busy={!ready}>
        <div
          ref={previewContentRef}
          className="character-print-preview-content"
          style={{
            "--print-preview-scale": previewSize.scale,
            width: previewSize.width || undefined,
            height: previewSize.height || undefined,
          } as CSSProperties}
        >
          {PrintSheet
            ? <PrintSheet character={character} options={options} catalogs={catalogs} onReadyChange={setReady}/>
            : <div className="loading-card">{t("ui.preparingPrint")}</div>}
        </div>
      </div>
      <DialogFooter className="character-print-footer">
        <DialogClose asChild><Button type="button" size="sm" variant="outline">{t("ui.cancel")}</Button></DialogClose>
        <Button type="button" size="sm" disabled={!ready} onClick={() => void print()}><Printer />{t("ui.printSavePDF")}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
