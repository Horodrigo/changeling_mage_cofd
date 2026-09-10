import { readFile, readdir } from "node:fs/promises";
import { readFileSync, readdirSync } from "node:fs";

export async function readWorkspaceSource() {
  const featureRoot = new URL("../app/workspace/", import.meta.url);
  const files = (await readdir(featureRoot)).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"));
  return (await Promise.all([
    readFile(new URL("../app/workspace.tsx", import.meta.url), "utf8"),
    ...files.map((name) => readFile(new URL(name, featureRoot), "utf8")),
  ])).join("\n");
}

export function readWorkspaceSourceSync() {
  const featureRoot = new URL("../app/workspace/", import.meta.url);
  const files = readdirSync(featureRoot).filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"));
  return [readFileSync(new URL("../app/workspace.tsx", import.meta.url), "utf8"), ...files.map((name) => readFileSync(new URL(name, featureRoot), "utf8"))].join("\n");
}

