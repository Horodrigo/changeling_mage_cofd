import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = (path) => readFile(join(root, path), "utf8");

async function exists(path) {
  try {
    await access(join(root, path), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function sourceFiles(path) {
  const absolute = join(root, path);
  const entries = await readdir(absolute, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const child = join(path, entry.name);
    if (entry.isDirectory()) return sourceFiles(child);
    return [".ts", ".tsx", ".mjs", ".js"].includes(extname(entry.name)) ? [child] : [];
  }));
  return nested.flat();
}

test("D1 and Drizzle are absent from active persistence infrastructure", async () => {
  for (const removed of [
    "db",
    "drizzle",
    "drizzle.config.ts",
    "app/api/characters",
    "app/api/catalog",
    "app/api/rules",
    "app/api/ingestion",
  ]) {
    assert.equal(await exists(removed), false, `${removed} should not exist in the active application`);
  }

  const packageJson = JSON.parse(await source("package.json"));
  assert.equal(packageJson.dependencies?.["drizzle-orm"], undefined);
  assert.equal(packageJson.devDependencies?.["drizzle-kit"], undefined);
  assert.equal(packageJson.scripts?.["db:generate"], undefined);

  const wrangler = await source("wrangler.jsonc");
  const hosting = JSON.parse(await source(".openai/hosting.json"));
  const worker = await source("worker/index.ts");

  assert.doesNotMatch(wrangler, /\bd1_databases\b|\bD1\b/);
  assert.equal(hosting.d1, undefined);
  assert.doesNotMatch(worker, /\bD1Database\b|\benv\.DB\b/);
});

test("Cloudflare hosting remains configured without D1", async () => {
  const wrangler = await source("wrangler.jsonc");
  const hosting = JSON.parse(await source(".openai/hosting.json"));
  const worker = await source("worker/index.ts");

  assert.match(wrangler, /"main"\s*:\s*"dist\/server\/index\.js"/);
  assert.match(wrangler, /"assets"\s*:/);
  assert.equal(typeof hosting.project_id, "string");
  assert.ok(hosting.project_id.length > 0);

  assert.match(worker, /\bASSETS:\s*Fetcher\b/);
  assert.match(worker, /\bIMAGES:\s*\{/);
  assert.match(worker, /handleImageOptimization/);
  assert.match(worker, /handler\.fetch\(request,\s*env,\s*ctx\)/);
});

test("build packaging contains no stale D1 or Drizzle migration path", async () => {
  const buildPlugin = await source("build/sites-vite-plugin.ts");
  assert.doesNotMatch(
    buildPlugin,
    /\bdrizzle\b|migrations_dir|resolve\([^)]*["']drizzle["']/i,
  );
});

test("production source tree does not import Drizzle or Cloudflare D1", async () => {
  const roots = ["app", "game-lines", "lib", "worker", "build"];
  const files = (await Promise.all(roots.map(sourceFiles))).flat();
  const violations = [];

  for (const file of files) {
    const content = await source(file);
    if (
      /from\s+["']drizzle-orm(?:\/[^"']*)?["']/.test(content) ||
      /\bD1Database\b/.test(content) ||
      /\bd1_databases\b/.test(content)
    ) {
      violations.push(file);
    }
  }

  assert.deepEqual(violations, []);
});

test("browser character persistence is local-first behind CharacterRepository", async () => {
  const [workspace, repository, storage] = await Promise.all([
    source("app/workspace.tsx"),
    source("app/workspace/character-repository.ts"),
    source("lib/device-storage.ts"),
  ]);

  assert.match(workspace, /from\s+["']\.\/workspace\/character-repository["']/);
  assert.match(workspace, /useCharacterRepository\(userKey\)/);
  assert.doesNotMatch(workspace, /\/api\/characters|fetch\([^)]*characters/i);
  assert.doesNotMatch(workspace, /@\/lib\/device-storage/);

  assert.match(repository, /from\s+["']@\/lib\/device-storage["']/);
  assert.match(repository, /getDeviceValue<StoredCharacter\[\]>/);
  assert.match(repository, /stageDeviceValue\(storageKey,\s*characters\)/);
  assert.match(repository, /setDeviceValue\(storageKey,\s*characters\)/);
  assert.doesNotMatch(repository, /\/api\/characters|fetch\([^)]*characters/i);

  assert.match(storage, /indexedDB\.open\(/);
  assert.match(storage, /pending-write/);
  assert.match(storage, /localStorage\.setItem/);
  assert.match(storage, /localStorage\.getItem/);
});
