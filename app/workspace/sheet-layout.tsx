import type { ReactNode } from "react";

export type SheetLayoutItemPosition = {
  id: string;
  column: number;
  order: number;
};

export type SheetLayoutSectionDefinition = {
  columns: number;
  items: readonly SheetLayoutItemPosition[];
  columnClassNames?: readonly string[];
  sectionClassName?: string;
};

export type SheetLayoutFlowDefinition = {
  items: readonly { id: string; order: number }[];
};

export type SheetLayoutDesktopDefinition = {
  sections: readonly {
    id: string;
    order: number;
    definition: SheetLayoutSectionDefinition;
  }[];
};

export type SheetDesktopTabLayout = {
  sections: SheetLayoutDesktopDefinition["sections"];
};

export type GameLineSheetLayout = {
  desktop: Readonly<Record<string, SheetDesktopTabLayout>>;
  mobile: Readonly<Record<string, SheetLayoutFlowDefinition>>;
};

export type MainSheetDesktopLayout = {
  desktopSections: readonly {
    id: string;
    order: number;
    definition: SheetLayoutSectionDefinition;
  }[];
  desktopSectionOrder?: {
    identity: number;
    attributes: number;
    sheet: number;
  };
  identity: SheetLayoutSectionDefinition;
  attributes: SheetLayoutSectionDefinition;
  skills: SheetLayoutSectionDefinition;
  body: SheetLayoutSectionDefinition;
};

export type MainSheetDesktopLayoutInput = Omit<MainSheetDesktopLayout, "desktopSections"> & {
  desktopSections?: MainSheetDesktopLayout["desktopSections"];
};

export type MainSheetMobileLayout = {
  identity: SheetLayoutSectionDefinition;
  attributes: SheetLayoutSectionDefinition;
  skills: SheetLayoutSectionDefinition;
};

export function createMainSheetLayout(
  layout: MainSheetDesktopLayoutInput,
): MainSheetDesktopLayout {
  return {
    ...layout,
    desktopSections: layout.desktopSections ?? [
      {
        id: "identity",
        order: layout.desktopSectionOrder?.identity ?? 1,
        definition: {
          ...layout.identity,
          sectionClassName: "cod-main-identity sheet-identity-grid",
        },
      },
      {
        id: "attributes",
        order: layout.desktopSectionOrder?.attributes ?? 2,
        definition: {
          columns: 1,
          items: [{ id: "attributes", column: 1, order: 1 }],
          sectionClassName: "cod-main-attributes",
        },
      },
      {
        id: "sheet",
        order: layout.desktopSectionOrder?.sheet ?? 3,
        definition: {
          ...layout.body,
          sectionClassName: "cod-main-columns official-sheet-body",
        },
      },
    ],
  };
}

export function createSingleColumnDesktopLayout(
  ids: readonly string[],
): SheetLayoutDesktopDefinition {
  return {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: ids.map((id, index) => ({ id, column: 1, order: index + 1 })),
      },
    }],
  };
}

export function SheetCategoryLayout({
  id,
  definition,
  render,
  className = "",
}: {
  id: string;
  definition: SheetLayoutSectionDefinition;
  render: (category: string) => ReactNode;
  className?: string;
}) {
  const items = Object.fromEntries(
    definition.items.map((item) => [item.id, render(item.id)]),
  );
  return <SheetLayoutSection id={id} definition={definition} items={items} className={className} />;
}

export function SheetLayoutDesktopPage({
  id,
  definition,
  items,
  className = "",
}: {
  id: string;
  definition: SheetLayoutDesktopDefinition;
  items: Readonly<Record<string, ReactNode>>;
  className?: string;
}) {
  const sectionIds = new Set<string>();
  const sectionOrders = new Set<number>();
  const configuredItems = new Set<string>();
  for (const section of definition.sections) {
    if (!section.id || sectionIds.has(section.id)) {
      throw new Error(`Sheet layout page "${id}" has a missing or duplicate section ID.`);
    }
    if (!Number.isInteger(section.order) || section.order < 1 || sectionOrders.has(section.order)) {
      throw new Error(`Sheet layout page "${id}" has an invalid or duplicate section order.`);
    }
    sectionIds.add(section.id);
    sectionOrders.add(section.order);
    for (const item of section.definition.items) {
      if (configuredItems.has(item.id)) {
        throw new Error(`Sheet layout page "${id}" repeats item "${item.id}".`);
      }
      configuredItems.add(item.id);
    }
  }
  for (const itemId of Object.keys(items)) {
    if (!configuredItems.has(itemId)) {
      throw new Error(`Sheet layout page "${id}" has no position for item "${itemId}".`);
    }
  }

  return (
    <div className={`sheet-layout-desktop-page ${className}`.trim()} data-sheet-layout-page={id}>
      {[...definition.sections]
        .sort((left, right) => left.order - right.order)
        .map(({ id: sectionId, definition: sectionDefinition }) => {
          const sectionItems = Object.fromEntries(
            sectionDefinition.items
              .filter((item) => Object.hasOwn(items, item.id))
              .map((item) => [item.id, items[item.id]]),
          );
          return (
            <SheetLayoutSection
              key={sectionId}
              id={`${id}-${sectionId}`}
              definition={sectionDefinition}
              items={sectionItems}
            />
          );
        })}
    </div>
  );
}

function validateSection(
  sectionId: string,
  definition: SheetLayoutSectionDefinition,
  items: Readonly<Record<string, ReactNode>>,
) {
  if (!Number.isInteger(definition.columns) || definition.columns < 1) {
    throw new Error(`Sheet layout section "${sectionId}" must have at least one column.`);
  }

  const configured = new Set<string>();
  const positions = new Set<string>();
  for (const item of definition.items) {
    if (!item.id || configured.has(item.id)) {
      throw new Error(`Sheet layout section "${sectionId}" has a missing or duplicate item ID.`);
    }
    if (!Number.isInteger(item.column) || item.column < 1 || item.column > definition.columns) {
      throw new Error(`Sheet layout item "${item.id}" has an invalid column in section "${sectionId}".`);
    }
    if (!Number.isInteger(item.order) || item.order < 1) {
      throw new Error(`Sheet layout item "${item.id}" has an invalid order in section "${sectionId}".`);
    }
    const position = `${item.column}:${item.order}`;
    if (positions.has(position)) {
      throw new Error(`Sheet layout section "${sectionId}" repeats position ${position}.`);
    }
    configured.add(item.id);
    positions.add(position);
  }
  for (const id of Object.keys(items)) {
    if (!configured.has(id)) {
      throw new Error(`Sheet layout section "${sectionId}" has no position for item "${id}".`);
    }
  }
}

export function SheetLayoutSection({
  id,
  definition,
  items,
  className = "",
}: {
  id: string;
  definition: SheetLayoutSectionDefinition;
  items: Readonly<Record<string, ReactNode>>;
  className?: string;
}) {
  validateSection(id, definition, items);
  const columns = Array.from({ length: definition.columns }, (_, index) =>
    definition.items
      .filter((item) => item.column === index + 1)
      .sort((left, right) => left.order - right.order)
      .filter((item) => items[item.id] !== undefined && items[item.id] !== null),
  );

  return (
    <div
      className={`sheet-layout-section ${definition.sectionClassName ?? ""} ${className}`.trim()}
      data-sheet-layout-section={id}
      data-columns={definition.columns}
    >
      {columns.map((column, index) => (
        <div className={`sheet-layout-column ${definition.columnClassNames?.[index] ?? ""}`.trim()} key={index}>
          {column.map((item) => (
            <div className="sheet-layout-item" data-sheet-layout-item={item.id} key={item.id}>
              {items[item.id]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SheetLayoutFlow({
  id,
  definition,
  items,
  className = "",
}: {
  id: string;
  definition: SheetLayoutFlowDefinition;
  items: Readonly<Record<string, ReactNode>>;
  className?: string;
}) {
  const configured = new Set<string>();
  const orders = new Set<number>();
  for (const item of definition.items) {
    if (!item.id || configured.has(item.id)) {
      throw new Error(`Sheet layout flow "${id}" has a missing or duplicate item ID.`);
    }
    if (!Number.isInteger(item.order) || item.order < 1 || orders.has(item.order)) {
      throw new Error(`Sheet layout flow "${id}" has an invalid or duplicate order.`);
    }
    configured.add(item.id);
    orders.add(item.order);
  }
  for (const itemId of Object.keys(items)) {
    if (!configured.has(itemId)) {
      throw new Error(`Sheet layout flow "${id}" has no order for item "${itemId}".`);
    }
  }

  const orderedItems = [...definition.items].sort((left, right) => left.order - right.order);
  return (
    <div className={`sheet-layout-flow ${className}`.trim()} data-sheet-layout-flow={id}>
      {orderedItems
        .filter((item) => items[item.id] !== undefined && items[item.id] !== null)
        .map((item) => (
          <div className="sheet-layout-item" data-sheet-layout-item={item.id} key={item.id}>
            {items[item.id]}
          </div>
        ))}
    </div>
  );
}
