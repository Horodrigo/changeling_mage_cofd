declare module "virtual:changeling-sheet-themes" {
  const themes: readonly {
    id: string;
    name: string;
    assets: Readonly<Record<string, string>>;
  }[];
  export default themes;
}
