"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getGameLineRegistration, listGameLineRegistrations } from "@/game-lines/registry/game-line-registry";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { CatalogBoundary } from "./catalog-boundary";
import { GameLineBuilder } from "./game-line-builder";
import { useLanguage } from "@/lib/i18n";
import { BuilderExitDialog, useBuilderExitGuard } from "./character-builder-shell";

/** Common creation shell: choose a line, then load only that line's builder. */
export function NewCharacterBuilder({ player, onCancel, onSave, onSaveDraft }: {
  player: string;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
  onSaveDraft: (sheet: CharacterSheet) => void;
}) {
  const { t } = useLanguage();
  const [gameLine, setGameLine] = useState<CharacterSheet["game_line"] | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const requestExit = useCallback(() => setExitOpen(true), []);
  const leave = useBuilderExitGuard(!gameLine, requestExit);
  if (gameLine) {
    const registration = getGameLineRegistration(gameLine);
    return (
      <CatalogBoundary groups={registration.catalogGroups.builder}>
        <GameLineBuilder gameLine={gameLine} player={player} initial={null} onCancel={onCancel} onSave={onSave} onSaveDraft={onSaveDraft} />
      </CatalogBoundary>
    );
  }
  return (
    <section className="sheet-editor">
      <div className="sheet-toolbar"><Button variant="ghost" onClick={requestExit}>{t("ui.backArrow")}</Button></div>
      <div className="builder-section">
        <span className="kicker">{t("ui.gameLineStep")}</span><h2>{t("ui.chooseGameLine")}</h2>
        <div className="line-choice">
          {listGameLineRegistrations().map((registration) => (
            <button className={`${registration.slug}-line-choice`} key={registration.id} onClick={() => setGameLine(registration.id)}>
              <Image src={registration.iconSrc} alt="" aria-hidden="true" width={64} height={64} unoptimized />
              <strong>{registration.label}</strong>
            </button>
          ))}
        </div>
      </div>
      <BuilderExitDialog open={exitOpen} onOpenChange={setExitOpen} draft onDiscard={() => leave(() => { onCancel(); return true; })} />
    </section>
  );
}
