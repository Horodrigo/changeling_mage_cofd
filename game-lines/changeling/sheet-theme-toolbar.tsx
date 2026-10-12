"use client";

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getDeviceValue, setDeviceValue } from "@/lib/device-storage";
import { useLanguage } from "@/lib/i18n";
import themes from "virtual:changeling-sheet-themes";
import { CHANGELING_THEME_STORAGE_KEY, sheetThemeCss } from "./sheet-theme";
import "./styles/sheet-theme-base.css";
import "./styles/sheet-theme-fairest.css";
import "./styles/sheet-theme-elemental.css";
import "./styles/sheet-theme-ogre.css";
import "./styles/sheet-theme-beast.css";
import "./styles/sheet-theme-darkling.css";
import "./styles/sheet-theme-wizened.css";
import "./styles/sheet-theme-grimm.css";

export default function ChangelingSheetThemeToolbar() {
  const { t } = useLanguage();
  const [themeId, setThemeId] = useState("default");
  const [error, setError] = useState(false);
  const changed = useRef(false);
  useEffect(() => {
    let cancelled = false;
    void getDeviceValue<string>(CHANGELING_THEME_STORAGE_KEY).then(value => {
      const savedTheme = themes.find(theme => theme.id === value);
      if (!cancelled && !changed.current && savedTheme) setThemeId(savedTheme.id);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);
  const theme = themes.find(option => option.id === themeId);
  const name = theme?.name ?? t("ui.changelingDefaultTheme");
  function selectTheme(id: string) {
    changed.current = true;
    setThemeId(id);
    setError(false);
    void setDeviceValue(CHANGELING_THEME_STORAGE_KEY, id).catch(() => setError(true));
  }
  return <>
    <style data-changeling-sheet-theme={themeId}>{sheetThemeCss(theme)}</style>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="sheet-theme-trigger" title={t("ui.changelingSheetTheme")} aria-label={t("ui.changelingSheetThemeCurrent", { theme: name })}>
          <Palette aria-hidden="true" /><span>{name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="line-theme-ctl">
        <DropdownMenuRadioGroup value={themeId} onValueChange={selectTheme}>
          <DropdownMenuRadioItem value="default">{t("ui.changelingDefaultTheme")}</DropdownMenuRadioItem>
          {themes.map(option => <DropdownMenuRadioItem key={option.id} value={option.id}>{option.name}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    {error && <span role="alert" className="sheet-theme-error">{t("ui.changelingThemeStorageFailed")}</span>}
  </>;
}
