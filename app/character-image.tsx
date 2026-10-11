"use client";

import { ImagePlus, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import type { CharacterPortrait } from "@/lib/core/character/character-types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function CharacterImageControls({
  value,
  onChange,
}: {
  value?: CharacterPortrait;
  onChange: (value: CharacterPortrait | undefined) => void;
}) {
  const { t } = useLanguage();

  const selectImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      window.alert(t("ui.characterImageInvalid"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => window.alert(t("ui.characterImageReadFailed"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        window.alert(t("ui.characterImageReadFailed"));
        return;
      }
      onChange({ dataUrl: reader.result, fileName: file.name || "character-image", mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  return <section className="character-image-controls" aria-label={t("ui.characterImagePreview")}>
    <div className="character-image-card">
      <span className="character-image-status" title={value?.fileName}>{value?.fileName || t("ui.noCharacterImage")}</span>
      <div className="character-image-preview">
        {value
          ? <img src={value.dataUrl} alt={t("ui.characterImagePreview")} />
          : <UserRound aria-hidden="true" />}
      </div>
      <div className="character-image-actions">
        {value
          ? <Button type="button" size="sm" variant="outline" onClick={() => onChange(undefined)}><Trash2 /> {t("ui.removeCharacterImage")}</Button>
          : <label className="character-image-upload">
              <Button type="button" size="sm" variant="outline" asChild><span><ImagePlus /> {t("ui.uploadCharacterImage")}</span></Button>
              <Input type="file" accept="image/*" onChange={event => selectImage(event.target.files?.[0])} />
            </label>}
      </div>
      {!value && <small>{t("ui.characterImageHelp")}</small>}
    </div>
  </section>;
}
