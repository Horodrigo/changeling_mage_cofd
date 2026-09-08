/** Extract primary Contract rows from the saved Codex of Darkness index. */
import fs from "node:fs";

const path = process.argv[2];
if (!path) throw new Error("usage: node scripts/extract-offline-contract-index.mjs PAGE");
const html = fs.readFileSync(path, "utf8");
const clean = (value) => value
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ").trim();

const entries = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
  .map(([, row]) => [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(([, cell]) => clean(cell)))
  .filter((cells) => cells.length === 6 && /\b\d+$/.test(cells[5]))
  .map(([name, cost_index, dice_pool_index, , , citation]) => ({name, cost_index, dice_pool_index, citation}));

process.stdout.write(`${JSON.stringify(entries, null, 2)}\n`);
