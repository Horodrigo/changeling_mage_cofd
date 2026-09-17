import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtimeRoot = process.env.SITES_RUNTIME_ROOT ?? resolve(projectRoot, ".sites-runtime");
for (const directory of ["home", "npm-cache", "xdg-config", "tmp", "wrangler/logs"]) {
  mkdirSync(resolve(runtimeRoot, directory), { recursive: true });
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("usage: node scripts/sites-env.mjs command [args...]");
  process.exit(64);
}

const env = {
  ...process.env,
  SITES_ENV_READY: "1",
  SITES_PROJECT_ROOT: projectRoot,
  HOME: resolve(runtimeRoot, "home"),
  XDG_CONFIG_HOME: resolve(runtimeRoot, "xdg-config"),
  TMPDIR: resolve(runtimeRoot, "tmp"),
  WRANGLER_WRITE_LOGS: "false",
  WRANGLER_LOG_PATH: resolve(runtimeRoot, "wrangler/logs"),
  MINIFLARE_REGISTRY_PATH: resolve(runtimeRoot, "wrangler/registry"),
  npm_config_cache: resolve(runtimeRoot, "npm-cache"),
  npm_config_audit: "false",
  npm_config_fund: "false",
  npm_config_update_notifier: "false",
};
delete env.NPM_CONFIG_CACHE;
delete env.npm_config_proxy;
delete env.npm_config_http_proxy;
delete env.npm_config_https_proxy;

const child = spawn(command, args, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("error", (error) => { console.error(error.message); process.exit(69); });
child.on("exit", (code, signal) => process.exitCode = code ?? (signal ? 1 : 0));
