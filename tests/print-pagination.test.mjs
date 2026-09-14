import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, server:{ middlewareMode:true, hmr:false }, resolve:{ alias:{ "@":root } } });
after(() => vite.close());
const { paginatePrintItems, pairPrintColumns } = await vite.ssrLoadModule("/app/workspace/print-pagination.ts");

test("pagina blocos medidos sem ultrapassar a capacidade da coluna", () => {
  const items = [
    { id:"a", section:"contracts", sectionLabel:"Contratos" },
    { id:"b", section:"contracts", sectionLabel:"Contratos" },
    { id:"c", section:"contracts", sectionLabel:"Contratos" },
  ];
  const columns = paginatePrintItems(items, { a:45, b:45, c:45 }, { contracts:10 }, 100);
  assert.deepEqual(columns.map((column) => column.groups.flatMap((group) => group.itemIds)), [["a", "b"], ["c"]]);
  assert.equal(columns[1].groups[0].continued, true);
});

test("mantém cabeçalhos de seções diferentes no cálculo", () => {
  const items = [
    { id:"a", section:"contracts", sectionLabel:"Contratos" },
    { id:"b", section:"merits", sectionLabel:"Méritos" },
  ];
  const columns = paginatePrintItems(items, { a:55, b:35 }, { contracts:10, merits:10 }, 100);
  assert.deepEqual(columns.map((column) => column.groups.map((group) => group.section)), [["contracts"], ["merits"]]);
});

test("agrupa duas colunas por página A4", () => {
  const columns = Array.from({ length:5 }, () => ({ groups:[] }));
  assert.deepEqual(pairPrintColumns(columns).map((page) => page.length), [2, 2, 1]);
});
