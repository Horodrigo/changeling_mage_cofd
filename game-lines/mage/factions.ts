export type MageFactionDefinition = {
  id: string;
  name: string;
  orders: string[];
  heretical: boolean;
  toolYantra: string;
  roteSkills: string[];
  sourceId: string;
  source: string;
  page: number;
};

export const mageFactionAvailable = (faction: MageFactionDefinition, order: unknown) =>
  faction.orders.includes(String(order ?? ""));

export const findMageFaction = (catalog: readonly MageFactionDefinition[], id: unknown) =>
  catalog.find((faction) => faction.id === String(id ?? ""));
