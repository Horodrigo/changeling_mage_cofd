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

test("léxico pt-BR de Changeling é aplicado aos termos canônicos",()=>{
  const glossary={
    Needle:"Agulha",Thread:"Linha",Durance:"Cativeiro",Arcadia:"Arcádia",Motley:"Retalho",Bargain:"Barganha",Bastion:"Bastião",
    "Wild Hunt":"Caçada Selvagem",Huntsman:"Monteiro",Huntsmen:"Monteiros",Keeper:"Carcereiro",Contract:"Contrato","Goblin Contract":"Contrato Goblin",Court:"Corte",
    "Spring Court":"Corte da Primavera","Winter Court":"Corte do Inverno","Summer Court":"Corte do Verão","Autumn Court":"Corte do Outono",Privateer:"Corsário",
    "Goblin Debt":"Débito Goblin",Bedlam:"Desvario",Fetch:"Duplo",Echoes:"Ecos",Thorns:"Espinhos","Dream Roads":"Estradas dos Sonhos",Wyrd:"Fado",
    "Hedge Ghosts":"Fantasmas da Sebe",Fae:"Fae","True Fae":"Fae Verdadeiro",Faerie:"Feéria",Seeming:"Semblante",Freehold:"Povoado",Frailty:"Fragilidade",Kith:"Frátria",
    "Goblin Fruit":"Fruta Goblin",Glamour:"Glamour",Goblin:"Goblin",Hobgoblin:"Hobgoblin",Icon:"Ícone",Oath:"Juramento",Loyalist:"Legalista","True Loyalist":"Legalista Verdadeiro",
    Lord:"Lorde",Clarity:"Lucidez",Mantle:"Manto",Mask:"Mascarilha","Goblin Market":"Mercado Goblin","Hedge Shaping":"Tecer a Sebe",Hedgespinning:"Tecer a Sebe",
    Oneiromancy:"Oniromancia",Oneiropomp:"Onirompo",Others:"Outros",Token:"Penhor",Lost:"Perdido",Portaling:"Passagem",Promise:"Promessa",Oathbreaker:"Quebrador de Juramento",
    "Bridge-Burner":"Queima-Pontes","Goblin Queen":"Rainha dos Goblins","Goblin King":"Rei dos Goblins",Regalia:"Regalia",Renegade:"Renunciado",Hedge:"Sebe",Sealing:"Selagem",
    Mien:"Semblante Fae",Dreamweaving:"Tecelagem de Sonhos",Kenning:"Tino",Title:"Título","Fae-Touched":"Tocado por Fae",Touchstone:"Touchstone",trod:"trod",Hollow:"Vão",
  };
  for(const [en,pt] of Object.entries(glossary)) assert.equal(systemTerm(en,"pt-BR"),pt,en);
});
