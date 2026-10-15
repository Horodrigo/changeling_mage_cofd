"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
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
import "./character-print-dialog.css";

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
  const printSurfaceRef = useRef<HTMLDivElement>(null);
  const previousTitleRef = useRef<string | null>(null);
  const printCleanupRef = useRef<number | null>(null);
  const [PrintSheet, setPrintSheet] = useState<ComponentType<GameLinePrintSheetProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [removePaperTexture, setRemovePaperTexture] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0, scale: 1 });
  const [options, setOptions] = useState<GameLinePrintOptions>({
    expandedMeritDetails: false,
    powerDetails: false,
    companionSheets: false,
  });
  const cleanupPrint = useCallback(() => {
    if (printCleanupRef.current !== null) window.clearTimeout(printCleanupRef.current);
    printCleanupRef.current = null;
    if (previousTitleRef.current !== null) document.title = previousTitleRef.current;
    previousTitleRef.current = null;
    document.body.classList.remove("character-printing-active");
  }, []);

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
    const surface = document.createElement("div");
    surface.className = "character-print-surface";
    document.body.appendChild(surface);
    document.body.classList.add("character-printing");
    printSurfaceRef.current = surface;
    const preparePrint = () => {
      document.body.classList.add("character-printing-active");
      void surface.offsetHeight;
    };
    const afterPrint = () => {
      if (printCleanupRef.current !== null) window.clearTimeout(printCleanupRef.current);
      // Samsung Internet may capture the page after firing afterprint.
      printCleanupRef.current = window.setTimeout(cleanupPrint, /Android/i.test(navigator.userAgent) ? 5000 : 0);
    };
    window.addEventListener("beforeprint", preparePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      cleanupPrint();
      window.removeEventListener("beforeprint", preparePrint);
      window.removeEventListener("afterprint", afterPrint);
      printSurfaceRef.current = null;
      surface.remove();
      document.body.classList.remove("character-printing");
    };
  }, [open, cleanupPrint]);

  useLayoutEffect(() => {
    if (!open) return;
    const preview = previewRef.current;
    const printable = previewContentRef.current?.querySelector<HTMLElement>(".game-print-document");
    if (!preview || !printable) return;
    printable.classList.toggle("print-without-paper-texture", removePaperTexture);
    printSurfaceRef.current?.replaceChildren(printable.cloneNode(true));
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
  }, [open, PrintSheet, ready, options, removePaperTexture, character]);

  function print() {
    if (!printSurfaceRef.current?.querySelector(".game-print-document")) return;

    previousTitleRef.current ??= document.title;
    const safeName = character.character.name.trim() || t("ui.character");
    document.title = `${safeName} - ${getGameLineRegistration(character.game_line).label}`;
    document.body.classList.add("character-printing-active");
    // Some Android browsers capture screen styles rather than applying @media print.
    void printSurfaceRef.current.offsetHeight;
    if (printCleanupRef.current !== null) window.clearTimeout(printCleanupRef.current);
    printCleanupRef.current = window.setTimeout(cleanupPrint, 60000);
    try { window.print(); }
    catch (error) { cleanupPrint(); throw error; }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="character-print-dialog" showCloseButton>
      <div className="character-print-controls">
        <DialogHeader>
          <DialogTitle>{t("ui.printCharacterSheet")}</DialogTitle>
          <DialogDescription>{t("ui.thePreviewUsesA4PagesAndExcludesApplication")}</DialogDescription>
        </DialogHeader>
        <div className="character-print-options"><label>
          <Checkbox checked={removePaperTexture} onCheckedChange={(checked) => setRemovePaperTexture(checked === true)}/>
          <span>{t("ui.printRemovePaperTexture")}</span>
        </label><label>
          <Checkbox checked={options.companionSheets} onCheckedChange={(checked) => setOptions((current) => ({ ...current, companionSheets: checked === true }))}/>
          <span>{t("ui.printCompanionSheets")}</span>
        </label></div>
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
        <Button type="button" size="sm" disabled={!ready} onClick={print}><Printer />{t("ui.printSavePDF")}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
