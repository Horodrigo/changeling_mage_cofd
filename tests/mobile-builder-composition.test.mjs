import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("each non-mortal line has a mobile template composition and stylesheet", async () => {
  for (const line of ["changeling", "mage", "vampire", "werewolf"]) {
    const template = await read(`game-lines/${line}/mobile-builder-template.tsx`);
    const css = await read(`game-lines/${line}/styles/builder-mobile.css`);
    assert.match(template, /Mobile[A-Za-z]+BuilderTemplate/);
    assert.match(css, /@media\s*\(max-width:/);
  }
});

test("mobile builder compositions are wired into all non-mortal builders", async () => {
  for (const line of ["changeling", "mage", "vampire", "werewolf"]) {
    const builder = await read(`game-lines/${line}/builder.tsx`);
    assert.match(builder, /Mobile[A-Za-z]+BuilderTemplate/);
  }
});

test("Changeling mobile template keeps the requested field order", async () => {
  const css = await read("game-lines/changeling/styles/builder-mobile.css");
  for (const order of [1, 2, 3, 4, 5, 6, 7]) assert.match(css, new RegExp(`order:\\s*${order};`));
});

test("every non-mortal mobile stylesheet exposes explicit ordering hooks", async () => {
  for (const line of ["changeling", "mage", "vampire", "werewolf"]) {
    const css = await read(`game-lines/${line}/styles/builder-mobile.css`);
    assert.match(css, /order\s*:/);
  }
});
