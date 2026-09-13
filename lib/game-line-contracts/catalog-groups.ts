/** A catalog group is a declarative, surface-specific unit of catalog loading. */
export type CatalogGroupId = string;

export type CatalogSurface = "builder" | "sheet";

export type CatalogGroupsBySurface = Readonly<Record<CatalogSurface, readonly CatalogGroupId[]>>;

/** The read-only catalog API exposed to independently loaded group modules. */
export interface CatalogReader {
  getCatalog<T>(catalogId: string): Promise<T>;
}

export interface CatalogSnapshot {
  has(groupId: CatalogGroupId): boolean;
  get<T>(groupId: CatalogGroupId): T;
  entries(): IterableIterator<[CatalogGroupId, unknown]>;
}

/** A group owns its data shape and immutable snapshot transformation. */
export interface CatalogGroupModule {
  load(reader: CatalogReader): Promise<unknown>;
}

export type CatalogGroupLoader = () => Promise<CatalogGroupModule>;
