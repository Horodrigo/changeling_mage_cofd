"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getGameLineRegistration, listGameLineRegistrations } from "@/game-lines/registry/game-line-registry";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { CatalogBoundary } from "./catalog-boundary";
import { GameLineBuilder } from "./game-line-builder";

/** Common creation shell: choose a line, then load only that line's builder. */
export function NewCharacterBuilder({ player, onCancel, onSave }: {
  player: string;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
}) {
  const [gameLine, setGameLine] = useState<CharacterSheet["game_line"] | null>(null);
  if (gameLine) {
    const registration = getGameLineRegistration(gameLine);
    return (
      <CatalogBoundary groups={registration.catalogGroups.builder}>
        <GameLineBuilder gameLine={gameLine} player={player} initial={null} onCancel={onCancel} onSave={onSave} />
      </CatalogBoundary>
    );
  }
  return (
    <section className="sheet-editor">
      <div className="sheet-toolbar"><Button variant="ghost" onClick={onCancel}>← Voltar</Button></div>
      <div className="builder-section">
        <span className="kicker">STEP 1</span><h2>Choose a game line</h2>
        <div className="line-choice">
          {listGameLineRegistrations().map((registration) => (
            <button className={`${registration.slug}-line-choice`} key={registration.id} onClick={() => setGameLine(registration.id)}>
              <img src={registration.iconSrc} alt="" aria-hidden="true" />
              <strong>{registration.label}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
