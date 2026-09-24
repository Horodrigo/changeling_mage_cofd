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

test("migrated line-owned modules stay out of lib and inside their owning game line", async () => {
  const moved = [
    ["lib/seeming-presentation.ts", "game-lines/changeling/seeming-presentation.ts"],
    ["lib/changeling-kith-choices.ts", "game-lines/changeling/kith-choices.ts"],
    ["lib/hedge-duelist-variants.ts", "game-lines/changeling/hedge-duelist-variants.ts"],
    ["lib/mage-nimbus.ts", "game-lines/mage/nimbus.ts"],
    ["lib/mage-orders.ts", "game-lines/mage/orders.ts"],
    ["lib/mage-merit-configurations.ts", "game-lines/mage/merit-configurations.ts"],
  ];

  for (const [legacyPath, ownedPath] of moved) {
    await assertMissing(legacyPath);
    await access(join(root, ownedPath));
  }

  await Promise.all([
    assertMissing("lib/changeling-conditions.ts"),
    assertMissing("lib/mage-conditions.ts"),
  ]);

  const lineSources = (
    await Promise.all([
      sourceFiles("game-lines/changeling"),
      sourceFiles("game-lines/mage"),
    ])
  ).flat();
  const content = (await Promise.all(lineSources.map(source))).join("\n");

  assert.doesNotMatch(
    content,
    /@\/lib\/(?:seeming-presentation|changeling-kith-choices|hedge-duelist-variants|mage-nimbus|mage-orders|mage-merit-configurations|changeling-conditions|mage-conditions)/,
    "a migrated game-line dependency still reaches back into lib/",
  );
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

test("obsolete mixed surfaces and legacy Homebrew modules stay removed", async () => {
  await Promise.all([
    assertMissing("app/character-builder.tsx"),
    assertMissing("app/workspace/character-paper.tsx"),
    assertMissing("app/use-homebrews.ts"),
    assertMissing("lib/homebrews.ts"),
    assertMissing("lib/google-drive-sync.ts"),
    assertMissing("lib/merit-configurations.ts"),
    assertMissing("lib/expanded-merits.ts"),
  ]);
  await access(join(root, "app/homebrews.tsx"));
  await access(join(root, "lib/homebrew.ts"));
});

test("Homebrew shell dispatches line-owned editors lazily", async () => {
  const [shell, contract, changeling] = await Promise.all([
    source("app/homebrews.tsx"),
    source("lib/game-line-contracts/game-line-registration.ts"),
    source("game-lines/changeling/registration.ts"),
  ]);
  assert.doesNotMatch(shell, /game-lines\/(?:mage|changeling|vampire)/);
  assert.match(contract, /loadHomebrew\?/);
  assert.match(changeling, /loadHomebrew\s*:\s*\(\)\s*=>\s*import\(/);
});

test("workspace routes builder and sheet surfaces through the registry shells", async () => {
  const workspace = await source("app/workspace.tsx");

  assert.match(workspace, /import\("\.\/game-line-builder"\)/);
  assert.match(workspace, /import\("\.\/workspace\/game-line-sheet"\)/);
  assert.doesNotMatch(workspace, /import\(["'][^"']*game-lines\/(?:mage|changeling|vampire)/);
});

test("workspace print capability is driven entirely by registration", async () => {
  const [workspace, contract, changeling, mage, vampire] = await Promise.all([
    source("app/workspace.tsx"),
    source("lib/game-line-contracts/game-line-registration.ts"),
    source("game-lines/changeling/registration.ts"),
    source("game-lines/mage/registration.ts"),
    source("game-lines/vampire/registration.ts"),
  ]);

  assert.match(contract, /loadPrintSheet\?/);
  assert.match(changeling, /loadPrintSheet\s*:/);
  assert.match(mage, /loadPrintSheet\s*:/);
  assert.match(vampire, /loadPrintSheet\s*:/);

  assert.match(
    workspace,
    /selectedRegistration\?\.loadPrintSheet\s*&&/,
    "top-level print action must depend on the selected registration capability",
  );
  assert.match(
    workspace,
    /registration\.loadPrintSheet\s*&&\s*printOpen/,
    "print dialog must depend on the active registration capability",
  );
  assert.doesNotMatch(
    workspace,
    /(?:selected|character)\.game_line\s*===\s*["'](?:CtL|MtA|VtR)["']/,
    "workspace must not hard-code a concrete line to decide print support",
  );
});

test("line print surfaces retain their web skins and line-specific tracks", async () => {
  const [changelingPrint, magePrint, vampirePrint, mageCss, vampireCss, paperShell, mainSheet] = await Promise.all([
    source("game-lines/changeling/print-sheet.tsx"),
    source("game-lines/mage/print-sheet.tsx"),
    source("game-lines/vampire/print-sheet.tsx"),
    source("app/css/mage-sheet.css"),
    source("app/css/vampire-sheet.css"),
    source("app/workspace/character-paper-shell.tsx"),
    source("app/workspace/main-sheet.tsx"),
  ]);

  assert.match(changelingPrint, /DotValue value=\{1\} max=\{10\} singleRow/);
  assert.match(changelingPrint, /PrintIntegrityTrack value=\{Math\.max\(0, Math\.min\(10,/);
  assert.match(changelingPrint, /ctl-print-equipment-table/);
  assert.match(magePrint, /PrintDots value=\{1\} maximum=\{10\}/);
  assert.match(magePrint, /PrintBoxes maximum=\{20\}/);
  assert.match(magePrint, /PrintSingleMarkDots value=\{1\}/);
  assert.match(magePrint, /ui\.arcaneBeats/);
  assert.match(magePrint, /arcaneXPAvailable/);
  assert.match(vampirePrint, /PrintDots value=\{1\} maximum=\{10\}/);
  assert.match(vampirePrint, /PrintBoxes maximum=\{20\}/);
  assert.match(vampirePrint, /PrintIntegrityTrack value=\{1\}/);
  assert.match(vampirePrint, /item\.humanity_slot/);
  assert.match(vampirePrint, /ui\.devotions/);
  assert.match(vampirePrint, /ui\.bloodBonds/);
  assert.match(vampirePrint, /ui\.rites/);
  assert.match(vampirePrint, /ui\.miracles/);
  assert.match(vampirePrint, /Array\.from\(\{ length: 10 \}.*const item = equipment/);
  assert.doesNotMatch(vampirePrint, /touchstonesAndBanes/);
  assert.doesNotMatch(vampirePrint, /acquiredPowers/);
  assert.match(mageCss, /mage\/style\/background-mage\.webp/);
  assert.match(mageCss, /mta-print-frame/);
  assert.match(mageCss, /--mta-print-frame-center-clearance:12mm/);
  assert.match(mageCss, /background-position:center top/);
  assert.match(mageCss, /mta-print-heading:has\(\+ \.mta-print-attributes\)/);
  assert.match(mageCss, /right center\/auto 28mm no-repeat/);
  assert.match(mageCss, /\.mta-print-page \.cod-print-experience::before/);
  assert.match(vampireCss, /vtr-print-frame/);
  assert.match(vampireCss, /official-dots i\.on/);
  assert.match(paperShell, /DotValue value=\{rating\} max=\{10\} singleRow/);
  assert.match(paperShell, /displayMinimum=\{20\}/);
  assert.match(mainSheet, /DotValue value=\{value\} max=\{10\} singleRow/);
});

test("production build manifest keeps builder, sheet, and print closures line-isolated", async () => {
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

  for (const surface of ["builder", "sheet", "print"]) {
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

  const homebrewKey = "game-lines/changeling/homebrew.tsx";
  assert.ok(manifest[homebrewKey], `missing manifest entry: ${homebrewKey}`);
  assert.ok(
    closure(homebrewKey).every((entry) => !entry.includes("game-lines/mage/") && !entry.includes("game-lines/vampire/")),
    `${homebrewKey} closure contains another game line`,
  );
});
