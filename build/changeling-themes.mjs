import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

export async function discoverChangelingThemes(imagesDirectory) {
  const entries = await readdir(imagesDirectory, { withFileTypes: true });
  const defaults = new Set(entries.filter(entry => entry.isFile()).map(entry => entry.name));
  const themes = [];
  for (const entry of entries.filter(entry => entry.isDirectory() && entry.name.startsWith("theme-")).sort((a, b) => a.name.localeCompare(b.name))) {
    const id = entry.name.slice("theme-".length);
    if (!id) throw new Error("Changeling theme folders must have a name after theme-.");
    if (id === "default") throw new Error("Default uses the root Changeling images; theme-default is reserved.");
    const files = await readdir(join(imagesDirectory, entry.name), { withFileTypes: true });
    const assets = {};
    for (const file of files) {
      if (!file.isFile() || !defaults.has(file.name) || !file.name.endsWith(".webp")) continue;
      assets[file.name.slice(0, -5)] = `/game-lines/changeling/images/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`;
    }
    themes.push({ id, name: id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), assets });
  }
  return themes;
}

export function changelingThemes() {
  const moduleId = "virtual:changeling-sheet-themes";
  const resolvedId = `\0${moduleId}`;
  let imagesDirectory;
  return {
    name: "changeling-sheet-themes",
    configResolved(config) {
      imagesDirectory = resolve(config.root, "public", "game-lines", "changeling", "images");
    },
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      return `export default ${JSON.stringify(await discoverChangelingThemes(imagesDirectory))};`;
    },
    configureServer(server) {
      server.watcher.add(imagesDirectory);
      server.watcher.on("all", (_event, path) => {
        if (!path.startsWith(imagesDirectory)) return;
        for (const environment of Object.values(server.environments)) {
          const themeModule = environment.moduleGraph.getModuleById(resolvedId);
          if (themeModule) environment.moduleGraph.invalidateModule(themeModule);
        }
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
