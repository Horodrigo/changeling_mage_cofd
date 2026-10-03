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

test("Entitlement mechanics and types belong only to Changeling, without a shared legacy reexport", async () => {
  await assertMissing("lib/entitlements.ts");
  assert.match(await source("game-lines/changeling/entitlements.ts"), /synchronizeEntitlement/);
  for (const directory of ["lib", "app", "game-lines"]) {
    for (const file of await sourceFiles(directory)) {
      assert.doesNotMatch(await source(file), /["']@\/lib\/entitlements["']/, file);
    }
  }
});

test("shared Merit context and XP picker do not interpret persisted line mechanics", async () => {
  const merits = await source("lib/merits.ts");
  const context = merits.slice(merits.indexOf("export function meritContextForSheet"), merits.indexOf("export type MeritSelectionProblem"));
  assert.doesNotMatch(context, /line_data|contracts|gnosis|arcana|seeming|kith|court|wyrd|mantle/);
  const picker = (await source("app/workspace/experience-shared.tsx")).split("export function ExperienceMeritPicker")[1];
  assert.doesNotMatch(picker, /meritContextForSheet|line_data/);
  assert.match(picker, /context: MeritPrerequisiteContext/);
  assert.doesNotMatch(await source("app/workspace/experience-shared.tsx"), /canAdvanceGrantedMerit|Mantle|Awakened Status|Nameless Order|Mystery Cult Initiation/);
  for (const line of ["mortal", "mage", "changeling", "vampire", "werewolf"]) {
    const panel = await source(`game-lines/${line}/experience-panel.tsx`);
    assert.match(panel, /context=\{/);
    assert.doesNotMatch(panel, /archetypes=\{/);
  }
});

test("Changeling owns Court/Seeming/Kith Merit access while shared validation accepts its predicate", async () => {
  const merits = await source("lib/merits.ts");
  const eligibility = merits.slice(merits.indexOf("export function meritPrerequisitesMet"), merits.indexOf("const dotsIn="));
  assert.doesNotMatch(eligibility, /ctl-2ed|courtAccess|Mantle|Goodwill|\.seeming|\.kith|\.court|\.mantle/);
  assert.match(await source("game-lines/changeling/builder-view.tsx"), /isEligible=\{changelingMeritPrerequisitesMet\}/);
  assert.match(await source("game-lines/changeling/builder.tsx"), /meritSelectionProblems\(definition, merit, meritContext, changelingMeritPrerequisitesMet\)/);
  assert.match(await source("game-lines/changeling/merit-context.ts"), /&& changelingMeritPrerequisitesMet\(definition, context\)/);
});

test("specialized Merit prerequisite types and text interpretation belong to their lines", async () => {
  for (const path of ["lib/merits.ts", "lib/merit-requirements.ts"]) {
    const content = await source(path);
    assert.doesNotMatch(content, /\b(?:Gnosis|Gnose|Wyrd|Fado|Arcana|Acanthus|Moros|Wizened|Beast|Sleepwalker)\b|Contract of|courtAccess|context\.(?:gnosis|arcana|path|order|seeming|kith|court|mantle|wyrd|powers)\b/, path);
  }
  assert.match(await source("game-lines/mage/merits.ts"), /mageTextPrerequisitesMet/);
  assert.match(await source("game-lines/changeling/merit-context.ts"), /changelingTextPrerequisitesMet/);
});

test("neutral game-line contracts do not know concrete game lines", async () => {
  const files = [
    "lib/game-line-contracts/game-line-registration.ts",
    "lib/game-line-contracts/game-line-rules.ts",
    "lib/game-line-contracts/game-line-ui.ts",
    "lib/game-line-contracts/catalog-groups.ts",
    "lib/catalog/catalog-service.ts",
  ];
  const content = (await Promise.all(files.map(source))).join("\n");

  assert.doesNotMatch(content, /game-lines\/(?:mortal|mage|changeling|vampire|werewolf)/);
  assert.doesNotMatch(content, /\b(?:CofD|MtA|CtL|VtR|WtF)\b/);
});

test("registrations are metadata plus lazy surface loaders", async () => {
  for (const line of ["mortal", "mage", "changeling", "vampire", "werewolf"]) {
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

test("portaled dialogs and confirmation actions inherit the active game-line theme", async () => {
  const styles = {
    cofd: await source("game-lines/mortal/styles/sheet.css"),
    ctl: await source("game-lines/changeling/styles/sheet.css"),
    mta: await source("game-lines/mage/styles/sheet.css"),
    vtr: `${await source("game-lines/vampire/styles/sheet.css")}\n${await source("game-lines/vampire/styles/interactions.css")}`,
    wtf: await source("game-lines/werewolf/styles/sheet.css"),
  };
  for (const [line, css] of Object.entries(styles)) {
    assert.match(css, new RegExp(`body:has\\(\\.line-theme-${line}\\)`));
    assert.match(css, /data-slot="dialog-content"/);
    assert.match(css, /data-slot="alert-dialog-content"/);
  }
  assert.match(await source("app/css/globals.css"), /:is\(\[data-slot="dialog-footer"\],\s*\[data-slot="alert-dialog-footer"\]\)\s+button[^}]*height:\s*32px/);
});

test("catalog groups stay lazy and line-scoped", async () => {
  const registry = await source("game-lines/registry/catalog-group-registry.ts");

  for (const line of ["mage", "changeling", "vampire", "werewolf"]) {
    assert.match(registry, new RegExp(`import\\("\\.\\./${line}/catalogs/`));
  }
  const mortal = await source("game-lines/mortal/registration.ts");
  assert.match(mortal, /iconSrc:\s*"\/game-lines\/mortal\/images\/icon\.webp"/);
  assert.match(mortal, /builder:\s*\["core-merits"\]/);
  assert.match(mortal, /sheet:\s*\["core-merits",\s*"core-reference"\]/);
  assert.doesNotMatch(registry, /mortal\/catalogs/);

  assert.doesNotMatch(
    registry,
    /import\s+(?!type\b)[^;]+\s+from\s+["']\.\.\/(?:mage|changeling|vampire|werewolf)\/catalogs\//,
  );
});

test("game-line registrations do not statically depend on another game line", async () => {
  const lines = ["mortal", "mage", "changeling", "vampire", "werewolf"];

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
    {
      path: "game-lines/mortal/rules.ts",
      forbidden: /@\/lib\/(?:creation-rules|mortal-)/,
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
    ["lib/contract-presentation.ts", "game-lines/changeling/contract-presentation.ts"],
    ["lib/contract-clauses.ts", "game-lines/changeling/contract-clauses.ts"],
    ["lib/catalog/contract-catalog.ts", "game-lines/changeling/contract-types.ts"],
    ["app/workspace/entitlement-page.tsx", "game-lines/changeling/entitlement-page.tsx"],
    ["lib/mage-nimbus.ts", "game-lines/mage/nimbus.ts"],
    ["lib/mage-orders.ts", "game-lines/mage/orders.ts"],
    ["lib/mage-merit-configurations.ts", "game-lines/mage/merit-configurations.ts"],
    ["lib/legacy-progression.ts", "game-lines/mage/legacy-progression.ts"],
    ["app/workspace/legacy-page.tsx", "game-lines/mage/legacy-page.tsx"],
  ];

  for (const [legacyPath, ownedPath] of moved) {
    await assertMissing(legacyPath);
    await access(join(root, ownedPath));
  }
  assert.doesNotMatch(await source("lib/catalog/catalog-types.ts"), /\b(?:ContractDefinition|SeemingKey)\b/);

  await Promise.all([
    assertMissing("lib/changeling-conditions.ts"),
    assertMissing("lib/mage-conditions.ts"),
    assertMissing("lib/power-progression.ts"),
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
    /@\/lib\/(?:seeming-presentation|changeling-kith-choices|hedge-duelist-variants|contract-presentation|contract-clauses|catalog\/contract-catalog|mage-nimbus|mage-orders|mage-merit-configurations|changeling-conditions|mage-conditions)|@\/app\/workspace\/entitlement-page/,
    "a migrated game-line dependency still reaches back into lib/",
  );
});

test("shared Experience refunds contain no Mage mechanics", async () => {
  const shared = await source("lib/experience-refunds.ts");
  assert.doesNotMatch(shared, /Mage|mage|gnosis|arcana|legacy_state|refundPowerRating/);
  await access(join(root, "game-lines/mage/experience-refunds.ts"));
});

test("Changeling-specific selectors belong to its stylesheet, including Homebrew", async () => {
  const shared = await source("app/css/globals.css");
  const owned = await source("game-lines/changeling/styles/sheet.css");
  for (const selector of [
    ".changeling-homebrew-source", ".entitlement-homebrew-editor", ".contract-homebrew-editor",
    ".entitlement-touchstone", ".entitlement-allocations", ".entitlement-token-fields",
    ".kith-dialog", ".kith-filters", ".kith-choice-row", ".contract-options",
    ".token-allocation-header", ".trifle-use-track", ".regalia-information",
    ".court-option", ".goblin-debt-track", ".clarity-box",
    ".changeling-line-choice", ".skill-highlight-kith",
  ]) {
    assert.ok(!shared.includes(selector), `${selector} leaked into shared CSS`);
    assert.ok(owned.includes(selector), `${selector} missing from Changeling CSS`);
  }
});

test("shared presentation patterns use neutral names across game lines", async () => {
  const shared = await source("app/css/globals.css");
  assert.doesNotMatch(shared, /\.mage-creation-xp-totals/);
  const mage = await source("game-lines/mage/styles/sheet.css");
  assert.match(mage, /\.experience-totals\.mage-creation-xp-totals\s*\{\s*grid-template-columns:\s*repeat\(4, 1fr\);/);
  assert.match(mage, /@media \(max-width: 767px\)\s*\{\s*\.experience-totals\.mage-creation-xp-totals\s*\{\s*grid-template-columns:\s*repeat\(2, 1fr\);/);
  assert.doesNotMatch(shared, /\.(?:contract-|creation-contract-|kith-|custom-kith-|entitlement-|regalia-|court-|trifle-|token-|goblin-debt-|clarity-|stored-glamour)/);
  for (const selector of [".rule-power-card", ".template-choice-current", ".affiliation-page", ".stored-resource-dot"]) {
    assert.ok(shared.includes(selector), `${selector} missing from shared CSS`);
  }
  for (const line of ["changeling", "mage", "vampire"]) {
    const files = await sourceFiles(`game-lines/${line}`);
    const content = (await Promise.all(files.map(source))).join("\n");
    assert.doesNotMatch(content, /\b(?:contract-power-(?:list|card|summary|details)|creation-contract-(?:list|empty)|kith-(?:current|field)|custom-kith-editor|entitlement-(?:title|select|overview|prerequisites|blessings))\b/);
    assert.match(content, /rule-power-card/);
    assert.match(content, /template-choice-current/);
  }
  for (const path of ["game-lines/changeling/entitlement-page.tsx", "game-lines/mage/legacy-page.tsx", "game-lines/vampire/bloodline-page.tsx"]) {
    assert.match(await source(path), /className="affiliation-page/);
  }
});

test("current game-line source trees do not statically import one another", async () => {
  const lines = ["mortal", "mage", "changeling", "vampire", "werewolf"];

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
  assert.doesNotMatch(shell, /game-lines\/(?:mortal|mage|changeling|vampire|werewolf)/);
  assert.match(contract, /loadHomebrew\?/);
  assert.match(changeling, /loadHomebrew\s*:\s*\(\)\s*=>\s*import\(/);
});

test("Changeling Homebrew uses category tabs and compact disclosure rows", async () => {
  const [homebrew, sheet, css] = await Promise.all([
    source("game-lines/changeling/homebrew.tsx"),
    source("game-lines/changeling/sheet-view.tsx"),
    source("app/css/globals.css"),
  ]);

  assert.match(homebrew, /homebrew-kind-tabs-list/);
  assert.match(homebrew, /homebrew-list-item/);
  assert.match(homebrew, /contractOutcomeSections/);
  assert.match(homebrew, /presented\.resolution/);
  assert.match(homebrew, /item\.token\.effect/);
  assert.match(homebrew, /item\.singleWillpower/);
  assert.match(homebrew, /const categoryOrder = \[t\("ui\.merits"\), t\("ui\.seemings"\), t\("ui\.courts"\), t\("ui\.kiths"\), t\("ui\.entitlements"\), t\("ui\.contracts"\), t\("ui\.needles"\), t\("ui\.threads"\), t\("ui\.conditions"\), "Errata"\]/);
  assert.match(homebrew, /categoryRank\(left\) - categoryRank\(right\)/);
  assert.match(sheet, /changelingMeritId\(item\) !== "oak-ash-thorn:entitlement" && isExpanded/);
  assert.match(css, /\.panel\.homebrew-source\s*\{\s*padding:\s*0;\s*\}/);
  assert.match(css, /\.homebrew-list-item-body p\s*>\s*strong:first-child\s*\{\s*color:/);
  assert.match(css, /\.rule-power-list dt\s*\{\s*display:\s*inline;/);
  assert.doesNotMatch(homebrew, /className="homebrew-card"/);
});

test("workspace routes builder and sheet surfaces through the registry shells", async () => {
  const workspace = await source("app/workspace.tsx");

  assert.match(workspace, /import\("\.\/game-line-builder"\)/);
  assert.match(workspace, /import\("\.\/workspace\/game-line-sheet"\)/);
  assert.doesNotMatch(workspace, /import\(["'][^"']*game-lines\/(?:mortal|mage|changeling|vampire|werewolf)/);
});

test("workspace print capability is driven entirely by registration", async () => {
  const [workspace, contract, mortal, changeling, mage, vampire] = await Promise.all([
    source("app/workspace.tsx"),
    source("lib/game-line-contracts/game-line-registration.ts"),
    source("game-lines/mortal/registration.ts"),
    source("game-lines/changeling/registration.ts"),
    source("game-lines/mage/registration.ts"),
    source("game-lines/vampire/registration.ts"),
  ]);

  assert.match(contract, /loadPrintSheet\?/);
  assert.match(mortal, /label:\s*"Chronicles of Darkness"/);
  assert.match(mortal, /loadPrintSheet\s*:/);
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
    /(?:selected|character)\.game_line\s*===\s*["'](?:CofD|CtL|MtA|VtR|WtF)["']/,
    "workspace must not hard-code a concrete line to decide print support",
  );
});

test("line print surfaces retain their web skins and line-specific tracks", async () => {
  const [mortalPrint, changelingPrint, magePrint, vampirePrint, mortalCss, mageCss, vampireCss, paperShell, mainSheet] = await Promise.all([
    source("game-lines/mortal/print-sheet.tsx"),
    source("game-lines/changeling/print-sheet.tsx"),
    source("game-lines/mage/print-sheet.tsx"),
    source("game-lines/vampire/print-sheet.tsx"),
    source("game-lines/mortal/styles/sheet.css"),
    source("game-lines/mage/styles/sheet.css"),
    source("game-lines/vampire/styles/sheet.css"),
    source("app/workspace/character-paper-shell.tsx"),
    source("app/workspace/main-sheet.tsx"),
  ]);

  assert.match(mortalPrint, /PrintIntegrityTrack value=\{integrity\}/);
  assert.match(mortalPrint, /ui\.breakingPoints/);
  assert.match(mortalPrint, /cofd-print-combat/);
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
  assert.match(mortalCss, /cofd-print-frame/);
  assert.match(mortalCss, /game-lines\/mortal\/images\/background-mortal\.webp/);
  assert.match(mageCss, /game-lines\/mage\/images\/background-mage\.webp/);
  assert.match(mageCss, /mta-print-frame/);
  assert.match(mageCss, /--mta-print-frame-center-clearance:8mm/);
  assert.match(mageCss, /\.mta-print-frame span \{[^}]*background:url\("\/game-lines\/mage\/images\/frame-prism-center\.webp"\) center\/contain no-repeat/);
  assert.match(mageCss, /\.mta-print-page > :not\(header\):not\(footer\):not\(\.mta-print-frame\)/);
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

  for (const surface of ["builder", "sheet"]) {
    for (const line of ["mortal", "mage", "changeling", "vampire", "werewolf"]) {
      const key = `game-lines/${line}/${surface}.tsx`;
      assert.ok(manifest[key], `missing manifest entry: ${key}`);
      const keys = closure(key);
      const others = ["mortal", "mage", "changeling", "vampire", "werewolf"].filter((candidate) => candidate !== line);
      assert.ok(keys.length > 1, `${key} has no analyzable closure`);
      assert.ok(
        keys.every((entry) => others.every((other) => !entry.includes(`game-lines/${other}/`))),
        `${key} closure contains another game line`,
      );
    }
  }

  for (const line of ["mortal", "mage", "changeling", "vampire"]) {
    const key = `game-lines/${line}/print.tsx`;
    assert.ok(manifest[key], `missing manifest entry: ${key}`);
    const others = ["mortal", "mage", "changeling", "vampire", "werewolf"].filter((candidate) => candidate !== line);
    assert.ok(
      closure(key).every((entry) => others.every((other) => !entry.includes(`game-lines/${other}/`))),
      `${key} closure contains another game line`,
    );
  }

  const homebrewKey = "game-lines/changeling/homebrew.tsx";
  assert.ok(manifest[homebrewKey], `missing manifest entry: ${homebrewKey}`);
  assert.ok(
    closure(homebrewKey).every((entry) => !entry.includes("game-lines/mage/") && !entry.includes("game-lines/vampire/")),
    `${homebrewKey} closure contains another game line`,
  );
});
