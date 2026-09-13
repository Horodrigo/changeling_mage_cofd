/** A catalog group is a declarative, surface-specific unit of catalog loading. */
export type CatalogGroupId = string;

export type CatalogSurface = "builder" | "sheet" | "homebrew";

export type CatalogGroupsBySurface = Readonly<Record<CatalogSurface, readonly CatalogGroupId[]>>;
