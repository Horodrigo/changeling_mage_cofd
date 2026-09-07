/** Extract Condition or Tilt rows from a saved Codex of Darkness HTML page. */
import fs from "node:fs";

const [, , path, ...approvedCodes] = process.argv;
if (!path || !approvedCodes.length) {
  throw new Error("usage: node scripts/audit-offline-rules-index.mjs PAGE CODE [CODE ...]");
}

const html = fs.readFileSync(path, "utf8");
const text = (value) => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&ndash;|&#x2013;/g, "–")
  .replace(/&mdash;|&#x2014;/g, "—")
  .replace(/&nbsp;|&#160;/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
  .map(([, row]) => [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(([, cell]) => text(cell)))
  .filter((cells) => cells.length >= 3)
  .map((cells) => {
    const citation = cells.at(-1);
    const match = approvedCodes
      .sort((a, b) => b.length - a.length)
      .map((code) => ({ code, match: citation.match(new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+(\\d+)$`)) }))
      .find(({ match }) => match);
    return match ? { name: cells[0], sourceCode: match.code, page: Number(match.match[1]) } : null;
  })
  .filter(Boolean);

process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
