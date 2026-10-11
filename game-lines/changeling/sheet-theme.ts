export type ChangelingSheetTheme = {
  id: string;
  name: string;
  assets: Readonly<Record<string, string>>;
};

export const CHANGELING_THEME_STORAGE_KEY = "characters-of-darkness:changeling-sheet-theme";

export function sheetThemeCss(theme?: ChangelingSheetTheme): string {
  if (!theme) return "";
  const declarations = Object.entries(theme.assets)
    .filter(([name]) => /^[a-z0-9-]+$/.test(name))
    .map(([name, url]) => `--ctl-image-${name}:url(${JSON.stringify(url)});`)
    .join("");
  return `@media screen { .cod-sheet.ctl-sheet { ${declarations} } }`;
}
