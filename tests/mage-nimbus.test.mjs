import test from "node:test";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";

const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
const nimbus=await vite.ssrLoadModule("/lib/mage-nimbus.ts");
test.after(()=>vite.close());

test("Long-Term Nimbus range follows Wisdom tiers",()=>{
  assert.equal(nimbus.mageNimbusConnection(10),"Strong");
  assert.equal(nimbus.mageNimbusConnection(8),"Strong");
  assert.equal(nimbus.mageNimbusConnection(7),"Medium");
  assert.equal(nimbus.mageNimbusConnection(4),"Medium");
  assert.equal(nimbus.mageNimbusConnection(3),"Weak");
});

test("Immediate Nimbus allocation is half Gnosis rounded up",()=>{
  assert.equal(nimbus.mageNimbusTiltBudget(1),1);
  assert.equal(nimbus.mageNimbusTiltBudget(7),4);
  assert.equal(nimbus.mageNimbusTiltBudget(10),5);
});

test("Immediate Nimbus effects cannot exceed its budget or repeat a trait",()=>{
  assert.deepEqual(nimbus.normalizeNimbusTiltEffects([
    {trait:"Presence",modifier:2},
    {trait:"Presence",modifier:-1},
    {trait:"Autocontrole",modifier:-3},
  ],7),[
    {trait:"Presence",modifier:2},
    {trait:"Autocontrole",modifier:-2},
  ]);
});
