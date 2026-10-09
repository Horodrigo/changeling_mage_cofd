import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
test("Changeling purchases persist semantic receipts while EN/PT/EN history preserves authored text and refunds", async () => {
  let saved;
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const server = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false, ws: false }, resolve: { alias: { "@": root } }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "history-test", enforce: "pre", transform(code, id) {
      code = code.replaceAll("\r\n", "\n");
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/game-lines/changeling/experience-panel.tsx")) return ("export let actions;\n" + code).replace('useState<ChangelingPurchaseType>(PURCHASE_TYPES[0])', 'useState<ChangelingPurchaseType>(character.current_state.testPurchase ?? PURCHASE_TYPES[0])').replace('useState("");\n  const [contractId', 'useState("Nome autoral");\n  const [contractId').replace('  return (\n    <', '  actions = { buy, revertPurchase, markWillpowerLoss, gainClarity, historyLabel };\n  return (\n    <');
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const experienceModule = await server.ssrLoadModule("/game-lines/changeling/experience-panel.tsx");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      const { blankPrintCharacter } = await server.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const reference = { courts: [], entitlements: [], entitlementPresentation: {}, contractPresentation: {} };
      const catalogs = { get: () => [] };
      const updates = [];
      const render = character => renderToStaticMarkup(createElement(LanguageProvider, null, createElement(experienceModule.ExperiencePanel, { character, catalogs, reference, updateSheet: value => updates.push(value) })));
      const character = blankPrintCharacter("CtL");
      character.attributes.Intelligence = 1;
      character.derived.Willpower = 4;
      character.current_state = { experience_available: 20, experience_total: 20, experience_spent: 0, notes: "Minhas notas", experience_history: [{ id: "opaque", kind: "spend", experience: -1, createdAt: "2026-10-09", description: "Texto antigo autoral" }] };
      render(character);
      const labeled = [
        [{ kind: "wyrd", previous: 2, amount: 2 }, locale === "pt-BR" ? "Fado 4" : "Wyrd 4"],
        [{ kind: "willpower", previousLost: 2, amount: 1, targetRating: 3 }, locale === "pt-BR" ? "Força de Vontade 3" : "Willpower 3"],
        [{ kind: "contract", id: "unavailable-contract" }, locale === "pt-BR" ? "Contrato unavailable-contract" : "Contract unavailable-contract"],
        [{ kind: "clause", contractId: "missing", courtId: "autumn" }, /missing/],
        [{ kind: "benefit", contractId: "missing", seeming: "Beast" }, /missing/],
      ];
      for (const [undo, expected] of labeled) {
        const entry = { undo, description: "Unchanged historical text" }, copy = structuredClone(entry);
        const label = experienceModule.actions.historyLabel(entry);
        if (typeof expected === "string") assert.equal(label, expected); else assert.match(label, expected);
        assert.deepEqual(entry, copy);
      }
      assert.equal(experienceModule.actions.historyLabel({ description: "Autoral" }), "Autoral");
      const before = structuredClone(character);
      render(character); experienceModule.actions.buy();
      const bought = updates.pop(), receipt = bought.current_state.experience_history[0];
      assert.equal(receipt.description, undefined);
      assert.deepEqual(receipt.undo, { kind: "trait", group: "attributes", name: "Intelligence", previous: 1, amount: 1 });
      assert.equal(bought.current_state.experience_available, 16);
      assert.deepEqual(character, before);
      saved ??= bought;
      const original = structuredClone(saved);
      assert.match(render(saved), locale === "pt-BR" ? /Inteligência 2/ : /Intelligence 2/);
      assert.deepEqual(saved, original);
      experienceModule.actions.revertPurchase(saved.current_state.experience_history[0]);
      const refunded = updates.pop();
      assert.equal(refunded.attributes.Intelligence, 1);
      assert.equal(refunded.current_state.experience_available, 20);
      assert.equal(refunded.current_state.experience_history[0].description, "Texto antigo autoral");
      for (const action of ["markWillpowerLoss", "gainClarity"]) {
        render(character); experienceModule.actions[action]();
        const changed = updates.pop();
        assert.equal(changed.current_state.experience_history[0].description, undefined);
        assert.ok(render(changed));
      }
      character.current_state.testPurchase = "specialty";
      render(character); experienceModule.actions.buy();
      const specialized = updates.pop();
      assert.equal(specialized.current_state.experience_history[0].description, undefined);
      assert.equal(specialized.specializations.at(-1).name, "Nome autoral");
      assert.match(render(specialized), /Nome autoral/);
    } finally { await server.close(); }
  }
});
