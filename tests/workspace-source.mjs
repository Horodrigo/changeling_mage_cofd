import { readFile, readdir } from "node:fs/promises";
import { readFileSync, readdirSync } from "node:fs";

export async function readWorkspaceSource() {
  const featureRoot = new URL("../app/workspace/", import.meta.url);
  const files = (await readdir(featureRoot)).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"));
  const lineRoots = [new URL("../game-lines/mage/", import.meta.url), new URL("../game-lines/changeling/", import.meta.url)];
  const lineFiles = (await Promise.all(lineRoots.map(async (lineRoot) =>
    (await readdir(lineRoot)).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx")).map((name) => new URL(name, lineRoot)),
  ))).flat();
  return (await Promise.all([
    readFile(new URL("../app/workspace.tsx", import.meta.url), "utf8"),
    ...files.map((name) => readFile(new URL(name, featureRoot), "utf8")),
    ...lineFiles.map((url) => readFile(url, "utf8")),
  ])).join("\n");
}

export function readWorkspaceSourceSync() {
  const featureRoot = new URL("../app/workspace/", import.meta.url);
  const files = readdirSync(featureRoot).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"));
  const lineRoots = [new URL("../game-lines/mage/", import.meta.url), new URL("../game-lines/changeling/", import.meta.url)];
  const lineFiles = lineRoots.flatMap((lineRoot) => readdirSync(lineRoot).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx")).map((name) => new URL(name, lineRoot)));
  return [readFileSync(new URL("../app/workspace.tsx", import.meta.url), "utf8"), ...files.map((name) => readFileSync(new URL(name, featureRoot), "utf8")), ...lineFiles.map((url) => readFileSync(url, "utf8"))].join("\n");
}
