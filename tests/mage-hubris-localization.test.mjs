import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const conditions = [
  { id: "homebrew:namesake", name: "Megalomaniacal", originalName: "Megalomaniacal", category: "Authored", description: "Authored text" },
  { id: "megalomaniacal", name: "Megalomaníaco apresentado", originalName: "Megalomaniacal", category: "Supernatural", description: "Canonical effect" },
  { id: "rampant", name: "Desenfreado apresentado", originalName: "Rampant", category: "Supernatural", description: "Other canonical effect" },
];

test("Wisdom/Hubris EN/PT/EN resolves the exact Condition IDs for choices and outcomes and preserves catalog data", async () => {
  const before = JSON.stringify(conditions);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "hubris-ssr-dialog", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/components/ui/dialog.tsx")) return 'import { createElement } from "react"; const Wrapper = ({ children }) => createElement("div", null, children); export { Wrapper as Dialog, Wrapper as DialogTrigger, Wrapper as DialogPortal, Wrapper as DialogClose, Wrapper as DialogOverlay, Wrapper as DialogContent, Wrapper as DialogHeader, Wrapper as DialogFooter, Wrapper as DialogTitle, Wrapper as DialogDescription };';
      if (path.endsWith("/game-lines/mage/sheet-view.tsx")) return `${code.replace('>("success"),', '>("failure"),')}\nexport { MageWisdomSection };`;
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const { MageWisdomSection } = await vite.ssrLoadModule("/game-lines/mage/sheet-view.tsx");
      const refuseMutation = () => { throw new Error("Rendering wrote character state"); };
      for (const [wisdom, state] of [[10, "Enlightened"], [8, "Enlightened"], [7, "Understanding"], [4, "Understanding"], [3, "Falling"], [1, "Falling"], [0, "Mad"]]) {
        const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MageWisdomSection, { wisdom, gnosis: 2, inuredSpells: [], conditions, available: [], locale, onAdd: refuseMutation, onRemove: refuseMutation, onHubris: refuseMutation })));
        assert.ok(html.includes(`${wisdom} · ${translate(locale, `ui.wisdomStates.${state}`)}`), `${locale} ${wisdom}`);
        const names = locale === "pt-BR" ? { megalomaniacal: "Megalomaníaco apresentado", rampant: "Desenfreado apresentado" } : { megalomaniacal: "Megalomaniacal", rampant: "Rampant" };
        assert.ok(html.includes(translate(locale, "ui.hubrisFailure", names)), `${locale} outcome`);
        assert.ok(html.includes(names.megalomaniacal), `${locale} choice`);
        if (locale === "pt-BR") assert.doesNotMatch(html, /Megalomaniacal|Rampant/);
        assert.doesNotMatch(html, /\{(?:megalomaniacal|rampant)\}|missing translation/);
      }
      assert.equal(JSON.stringify(conditions), before);
    } finally { await vite.close(); }
  }
});
