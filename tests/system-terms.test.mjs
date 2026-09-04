import assert from "node:assert/strict";
import test, {after} from "node:test";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
const root=fileURLToPath(new URL("..",import.meta.url));
const vite=await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},optimizeDeps:{noDiscovery:true,include:[]}});
after(async()=>vite.close());
const {systemTerm}=await vite.ssrLoadModule("/lib/system-terms.ts");
test("termos mudam apenas na apresentação",()=>{
  for(const [pt,en] of [["Raciocínio","Wits"],["Armas Brancas","Weaponry"],["Garganta","Maw"],["Fado","Wyrd"]]){
    assert.equal(systemTerm(pt,"pt-BR"),pt);assert.equal(systemTerm(pt,"en-US"),en);
  }
  assert.equal(systemTerm("valor-personalizado","en-US"),"valor-personalizado");
});
