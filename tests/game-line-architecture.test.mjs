import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = (path) => readFile(join(root, path), "utf8");

async function sourceFiles(path) {
  const absolute = join(root, path);
  const entries = await readdir(absolute, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const child = join(path, entry.name);
    if (entry.isDirectory()) return sourceFiles(child);
    return [".ts", ".tsx"].includes(extname(entry.name)) ? [child] : [];
  }));
  return nested.flat();
}

async function assertMissing(path) {
  await assert.rejects(access(join(root, path)));
}

test("neutral game-line contracts do not know concrete game lines", async () => {
  const files = [
    "lib/game-line-contracts/game-line-registration.ts",
    "lib/game-line-contracts/game-line-rules.ts",
    "lib/game-line-contracts/game-line-ui.ts",
    "lib/game-line-contracts/catalog-groups.ts",
    "lib/catalog/catalog-service.ts",
  ];
  const content = (await Promise.all(files.map(source))).join("\n");

  assert.doesNotMatch(content, /game-lines\/(?:mage|changeling|vampire)/);
  assert.doesNotMatch(content, /\b(?:MtA|CtL|VtR)\b/);
});

test("registrations are metadata plus lazy surface loaders", async () => {
  for (const line of ["mage", "changeling", "vampire"]) {
    const registration = await source(`game-lines/${line}/registration.ts`);

    assert.match(registration, /loadRules\s*:\s*\(\)\s*=>\s*import\(/, `${line}: rules must be lazy`);
    assert.match(registration, /loadBuilder\s*:\s*\(\)\s*=>\s*import\(/, `${line}: builder must be lazy`);
    assert.match(registration, /loadSheet\s*:\s*\(\)\s*=>\s*import\(/, `${line}: sheet must be lazy`);

    assert.doesNotMatch(
      registration,
      /import\s+(?!type\b)[^;]+\s+from\s+["']\.\/(?:builder|sheet|rules|print)["']/,
      `${line}: implementation surface was imported eagerly`,
    );
  }
});

test("catalog groups stay lazy and line-scoped", async () => {
  const registry = await source("game-lines/registry/catalog-group-registry.ts");

  for (const line of ["mage", "changeling", "vampire"]) {
    assert.match(registry, new RegExp(`import\\("\\.\\./${line}/catalogs/`));
  }

  assert.doesNotMatch(
    registry,
    /import\s+(?!type\b)[^;]+\s+from\s+["']\.\.\/(?:mage|changeling|vampire)\/catalogs\//,
  );
});

test("game-line registrations do not statically depend on another game line", async () => {
  const lines = ["mage", "changeling", "vampire"];

  for (const line of lines) {
    const content = await source(`game-lines/${line}/registration.ts`);
    const others = lines.filter((candidate) => candidate !== line).join("|");
    assert.doesNotMatch(
      content,
      new RegExp(`game-lines/(?:${others})|\\.\\./(?:${others})/`),
      `${line} registration depends on another line`,
    );
  }
});

test("line-owned rule modules do not reach back into legacy line-specific lib modules", async () => {
  const expectations = [
    {
      path: "game-lines/changeling/rules.ts",
      forbidden: /@\/lib\/(?:creation-rules|changeling-|entitlements)/,
    },
    {
      path: "game-lines/mage/rules.ts",
      forbidden: /@\/lib\/(?:creation-rules|mage-|legacies)/,
    },
    {
      path: "game-lines/vampire/rules.ts",
      forbidden: /@\/lib\/(?:creation-rules|vampire-)/,
    },
  ];

  for (const { path, forbidden } of expectations) {
    const content = await source(path);
    assert.doesNotMatch(
      content,
      forbidden,
      `${path} still delegates line-owned mechanics to legacy lib modules`,
    );
  }
});

test("current game-line source trees do not statically import one another", async () => {
  const lines = ["mage", "changeling", "vampire"];

  for (const line of lines) {
    const files = await sourceFiles(`game-lines/${line}`);
    const others = lines.filter((candidate) => candidate !== line);
    const violations = [];

    for (const file of files) {
      const content = await source(file);
      if (others.some((other) =>
        new RegExp(`(?:@/game-lines/${other}|\\.\\./${other}/)`).test(content)
      )) {
        violations.push(file);
      }
    }

    assert.deepEqual(violations, [], `${line} source tree imports another game line`);
  }
});

test("obsolete mixed surfaces and deferred Homebrew modules stay removed", async () => {
  await Promise.all([
    assertMissing("app/character-builder.tsx"),
    assertMissing("app/workspace/character-paper.tsx"),
    assertMissing("app/homebrews.tsx"),
    assertMissing("app/use-homebrews.ts"),
    assertMissing("lib/homebrews.ts"),
    assertMissing("lib/google-drive-sync.ts"),
    assertMissing("lib/merit-configurations.ts"),
    assertMissing("lib/expanded-merits.ts"),
  ]);
});

test("workspace routes builder and sheet surfaces through the registry shells", async () => {
  const workspace = await source("app/workspace.tsx");

  assert.match(workspace, /import\("\.\/game-line-builder"\)/);
  assert.match(workspace, /import\("\.\/workspace\/game-line-sheet"\)/);
  assert.doesNotMatch(workspace, /import\(["'][^"']*game-lines\/(?:mage|changeling|vampire)/);
});

test("workspace print capability is driven by registration instead of a concrete line ID", async () => {
  const [workspace, contract] = await Promise.all([
    source("app/workspace.tsx"),
    source("lib/game-line-contracts/game-line-registration.ts"),
  ]);

  assert.match(contract, /loadPrintSheet\?/);
  assert.doesNotMatch(
    workspace,
    /character\.game_line\s*===\s*["']CtL["']/,
    "the shell still hard-codes Changeling printing instead of using registration capability",
  );
});

test("production build manifest keeps builder and sheet closures line-isolated", async () => {
  const manifest = JSON.parse(await source("dist/client/.vite/manifest.json"));

  const closure = (rootKey) => {
    const keys = new Set();
    const visit = (key) => {
      if (keys.has(key) || !manifest[key]) return;
      keys.add(key);
      for (const imported of manifest[key].imports ?? []) visit(imported);
    };
    visit(rootKey);
    return [...keys];
  };

  for (const surface of ["builder", "sheet"]) {
    for (const line of ["mage", "changeling", "vampire"]) {
      const key = `game-lines/${line}/${surface}.tsx`;
      assert.ok(manifest[key], `missing manifest entry: ${key}`);
      const keys = closure(key);
      const others = ["mage", "changeling", "vampire"].filter((candidate) => candidate !== line);
      assert.ok(keys.length > 1, `${key} has no analyzable closure`);
      assert.ok(
        keys.every((entry) => others.every((other) => !entry.includes(`game-lines/${other}/`))),
        `${key} closure contains another game line`,
      );
    }
  }
});
