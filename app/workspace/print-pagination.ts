export type PrintFlowItem = {
  id: string;
  section: string;
  sectionLabel: string;
};

export type PrintFlowGroup = {
  section: string;
  sectionLabel: string;
  continued: boolean;
  itemIds: string[];
};

export type PrintFlowColumn = { groups: PrintFlowGroup[] };

/** Packs measured, semantic blocks into fixed-height print columns. */
export function paginatePrintItems(
  items: readonly PrintFlowItem[],
  itemHeights: Readonly<Record<string, number>>,
  headingHeights: Readonly<Record<string, number>>,
  capacity: number,
): PrintFlowColumn[] {
  if (!items.length || capacity <= 0) return [];
  const columns: PrintFlowColumn[] = [];
  const seenSections = new Set<string>();
  let column: PrintFlowColumn = { groups: [] };
  let used = 0;

  const pushColumn = () => {
    if (column.groups.length) columns.push(column);
    column = { groups: [] };
    used = 0;
  };

  for (const item of items) {
    const itemHeight = Math.max(0, itemHeights[item.id] ?? 0);
    const headingHeight = Math.max(0, headingHeights[item.section] ?? 0);
    let group = column.groups.at(-1);
    let needsHeading = group?.section !== item.section;
    let required = itemHeight + (needsHeading ? headingHeight : 0);

    if (column.groups.length && used + required > capacity) {
      pushColumn();
      group = undefined;
      needsHeading = true;
      required = itemHeight + headingHeight;
    }

    if (!group || group.section !== item.section) {
      group = {
        section: item.section,
        sectionLabel: item.sectionLabel,
        continued: seenSections.has(item.section),
        itemIds: [],
      };
      column.groups.push(group);
      seenSections.add(item.section);
    }
    group.itemIds.push(item.id);
    used += required;
  }
  pushColumn();
  return columns;
}

export function pairPrintColumns(columns: readonly PrintFlowColumn[]): PrintFlowColumn[][] {
  const pages: PrintFlowColumn[][] = [];
  for (let index = 0; index < columns.length; index += 2)
    pages.push(columns.slice(index, index + 2));
  return pages;
}
