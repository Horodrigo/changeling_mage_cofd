"use client";

import type { MeritSelection } from "@/lib/core/character/character-types";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { MeritDefinition } from "@/lib/merits";
import { SHARED_DOT_MERIT_IDS, sharedMeritDots } from "@/lib/shared-merit-dots";
import { useLanguage } from "@/lib/i18n";
import { Choice } from "./common-controls";

export function SharedMeritDotsControl({ merit, definition, onChange }: {
  merit: MeritSelection;
  definition: Pick<MeritDefinition, "id" | "ratings"> | undefined;
  onChange: (configuration: MeritConfiguration) => void;
}) {
  const { t } = useLanguage();
  if (!definition || !SHARED_DOT_MERIT_IDS.has(definition.id)) return null;
  const maximum = Math.max(...definition.ratings);
  const current = sharedMeritDots({ ...merit, definitionId: definition.id });
  const available = Math.max(0, maximum - merit.dots);
  const configuration = merit.configuration ?? {};
  return <Choice label={t("ui.sharedDots")} value={String(Math.min(current, available))} setValue={sharedDots => onChange({ ...configuration, sharedDots })} options={Array.from({ length: available + 1 }, (_, dots) => String(dots))} />;
}
