import { createHash } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vinext = resolve(projectRoot, "node_modules/vinext/dist/cli.js");
try { readFileSync(vinext); } catch { throw new Error("vinext is unavailable. Run npm run install:ci before building."); }

function updateCatalogManifest() {
  const manifestPath = resolve(projectRoot, "public/shared/data/catalog-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  let changed = false;
  for (const entry of Object.values(manifest.catalogs ?? {})) {
    if (!entry || typeof entry.url !== "string") continue;
    const relativePath = entry.url.replace(/^\/+/, "");
    const catalogPath = resolve(projectRoot, "public", relativePath);
    if (!catalogPath.startsWith(resolve(projectRoot, "public")) || !existsSync(catalogPath)) {
      throw new Error(`Catalog manifest points to a missing or unsafe file: ${entry.url}`);
    }
    const hash = createHash("sha256").update(readFileSync(catalogPath)).digest("hex");
    if (entry.hash === undefined) {
      entry.hash = hash;
      changed = true;
      continue;
    }
    if (entry.hash !== hash) {
      entry.version = Number(entry.version) + 1;
      entry.hash = hash;
      manifest.catalogVersion = Number(manifest.catalogVersion) + 1;
      changed = true;
      console.log(`Catalog changed: ${entry.url} → version ${entry.version}`);
    }
  }
  if (changed) writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

updateCatalogManifest();

const timestamp = new Date().toISOString().replace(/T.*$/, "").replaceAll("-", ".");
let suffix = new Date().toISOString().slice(11, 19).replaceAll(":", "");
try { suffix = execFileSync("git", ["-C", projectRoot, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(); } catch { /* no Git metadata */ }
const version = `${timestamp}-${suffix}`;
console.log(`Building PWA version: ${version}`);
mkdirSync(resolve(projectRoot, ".sites-runtime/tmp"), { recursive: true });
writeFileSync(resolve(projectRoot, "public/version.json"), `${JSON.stringify({ version }, null, 2)}\n`);
writeFileSync(resolve(projectRoot, "lib/app-version.ts"), `// Generated automatically by scripts/build-verified.mjs.\n// Do not edit manually.\nexport const APP_VERSION = "${version}";\n`);
writeFileSync(resolve(projectRoot, "public/sw.js"), readFileSync(resolve(projectRoot, "public/sw.template.js"), "utf8").replaceAll("__BUILD_VERSION__", version));

const timeoutMs = Number.parseInt(process.env.SITES_BUILD_TIMEOUT_MS ?? "180000", 10);
console.log("Running bounded vinext build...");
const child = spawn(process.execPath, [vinext, "build"], { cwd: projectRoot, stdio: "inherit", env: process.env });
const timeout = setTimeout(() => {
  console.error(`Build exceeded ${timeoutMs}ms and will be terminated.`);
  child.kill("SIGTERM");
}, timeoutMs);
child.on("error", (error) => { clearTimeout(timeout); console.error(error.message); process.exit(69); });
child.on("exit", (code, signal) => { clearTimeout(timeout); process.exitCode = code ?? (signal ? 1 : 0); });
