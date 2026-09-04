import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());
const { catalogDisplayName, catalogSearchLabels, localizeCatalogItem } = await vite.ssrLoadModule("/lib/localized-catalog.ts");

test("apresentação bilíngue não altera identidade nem o catálogo de origem", () => {
  const item = { id:"ctl:test", name:"Nome em português", originalName:"English Name", description:"Resumo em português" };
  const before = structuredClone(item);
  const view = localizeCatalogItem(item, "en-US", { fields:["description"], english:{"ctl:test":{description:"English summary"}} });
  assert.deepEqual(view, { id:"ctl:test", name:"English Name", fields:{description:"English summary"}, fallbackFields:[] });
  assert.deepEqual(item, before);
  assert.equal(view.id, item.id);
});

test("name canônico de Frátria ou Mérito é reutilizado em inglês", () => {
  const item = { id:"artist", name:"Artist", translatedName:"Artista", description:"Texto português" };
  assert.equal(catalogDisplayName(item, "pt-BR"), "Artista");
  assert.equal(catalogDisplayName(item, "en-US"), "Artist");
  assert.deepEqual(catalogSearchLabels(item), ["Artista", "Artist"]);
});

test("mapa inglês por ID pode fornecer nome e campos sem depender do valor interno", () => {
  const item = { id:"equipment:lanterna", name:"Lanterna", effect:"Reduz penalidades." };
  const english = {"equipment:lanterna":{name:"Flashlight",effect:"Reduces penalties."}};
  const view = localizeCatalogItem(item, "en-US", { fields:["effect"], english });
  assert.equal(view.name, "Flashlight");
  assert.equal(view.fields.effect, "Reduces penalties.");
  assert.deepEqual(catalogSearchLabels(item, english[item.id]), ["Lanterna", "Flashlight"]);
});

test("fallback inglês é explícito e nunca inventa tradução", () => {
  const item = { id:"spell:test", name:"Magia", description:"Efeito português", cost:"Um Mana" };
  const partial = {"spell:test":{description:"English effect"}};
  assert.deepEqual(
    localizeCatalogItem(item, "en-US", { fields:["description","cost"], english:partial }),
    { id:"spell:test", name:"Magia", fields:{description:"English effect",cost:"Um Mana"}, fallbackFields:["name","cost"] },
  );
  assert.deepEqual(
    localizeCatalogItem(item, "en-US", { fields:["description","cost"], english:partial, fallback:"empty" }),
    { id:"spell:test", name:"", fields:{description:"English effect",cost:""}, fallbackFields:["name","cost"] },
  );
});

test("pt-BR usa o catálogo atual e não registra fallback", () => {
  const item = { id:"contract:test", name:"Contrato", originalName:"Contract", description:"Efeito" };
  assert.deepEqual(
    localizeCatalogItem(item, "pt-BR", { fields:["description"], english:{} }),
    { id:"contract:test", name:"Contrato", fields:{description:"Efeito"}, fallbackFields:[] },
  );
});
