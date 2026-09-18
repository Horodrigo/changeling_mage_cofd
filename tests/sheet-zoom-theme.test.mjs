import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
after(async () => vite.close());

const zoom = await vite.ssrLoadModule("/app/workspace/sheet-zoom.ts");

test("sheet zoom respects base width, desktop cap, stepping and persisted-value bounds", () => {
  assert.equal(zoom.maximumSheetZoom(800), 1);
  assert.equal(zoom.maximumSheetZoom(900), 1);
  assert.equal(zoom.maximumSheetZoom(1050), 1050 / 900);
  assert.equal(zoom.maximumSheetZoom(1400), 1200 / 900);

  assert.equal(zoom.stepSheetZoom(1, "in", 1200 / 900), 1.1);
  assert.equal(zoom.stepSheetZoom(1.3, "in", 1200 / 900), 1200 / 900);
  assert.equal(zoom.stepSheetZoom(1200 / 900, "out", 1200 / 900), 1.3);
  assert.equal(zoom.stepSheetZoom(1, "out", 1200 / 900), 1);

  assert.equal(zoom.parseStoredSheetZoom("1.2"), 1.2);
  assert.equal(zoom.parseStoredSheetZoom("5"), 1200 / 900);
  assert.equal(zoom.parseStoredSheetZoom("invalid"), 1);
});
