import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { readWorkspaceSource } from "./workspace-source.mjs";

test("declara uma PWA standalone com ícones Android", async () => {
  const manifest=JSON.parse(await readFile(new URL("../public/manifest.webmanifest",import.meta.url),"utf8"));
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.name,"Characters of the Darkness");
  assert.equal(manifest.short_name,"Characters of the Darkness");
  assert.equal(manifest.background_color,"#1b111f");
  assert.equal(manifest.start_url,"/");
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="192x192"));
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="512x512"));
});

test("apresenta uma abertura de aplicativo alinhada à nova marca", async () => {
  const [layout,css]=await Promise.all([
    readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/css/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(layout,/Characters of the Darkness/);
  assert.match(layout,/app-launch-splash/);
  assert.match(layout,/navigator\.serviceWorker\.getRegistrations/);
  assert.match(css,/display-mode:standalone/);
  assert.match(css,/radial-gradient/);
});

test("mantém a ficha móvel compacta e os contratos expansíveis sem botões em todas as telas", async () => {
  const [workspace,css]=await Promise.all([
    readWorkspaceSource(),
    readFile(new URL("../app/css/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(workspace,/value: "stats", label: "Stats"/);
  assert.match(workspace,/mobile-attribute-grid/);
  assert.match(workspace,/values=\{mountAttributes\} compactNames=\{isMobile\}/);
  assert.match(workspace,/<details className="contract-power-card"/);
  assert.match(workspace,/<summary className="contract-power-summary">/);
  assert.match(workspace,/systemTerm\(definition\.regalia,\s*locale\).*definition\.source/);
  assert.doesNotMatch(workspace,/if \(!isMobile\).*contract-power/);
  assert.match(css,/\.contract-power-card \{/);
  assert.match(css,/\.contract-power-list \{[^}]*align-items:start/);
});

test("oferece impressão CtL A4 em uma árvore estática separada", async () => {
  const [workspace,globalCss,changelingCss]=await Promise.all([
    readWorkspaceSource(),
    readFile(new URL("../app/css/globals.css",import.meta.url),"utf8"),
    readFile(new URL("../app/css/changeling-sheet.css",import.meta.url),"utf8"),
  ]);
  const css=`${globalCss}\n${changelingCss}`;
  assert.match(workspace,/className="top-sheet-print"/);
  assert.match(workspace,/window\.print\(\)/);
  assert.match(workspace,/className = "character-print-surface"/);
  assert.match(workspace,/printSurface\.append\(printable\.cloneNode\(true\)\)/);
  assert.match(workspace,/className="ctl-print-document"/);
  assert.match(workspace,/powerDetails/);
  assert.match(workspace,/expandedMeritDetails/);
  assert.match(workspace,/minimum=\{Math\.max\(6, touchstoneSlots\)\}/);
  assert.match(workspace,/className="ctl-print-contract-tag"/);
  assert.match(workspace,/definition\.dicePool : "None"/);
  assert.match(workspace,/className="ctl-print-experience-beats"/);
  assert.match(workspace,/function PrintWritableBoxes/);
  assert.match(workspace,/boundedNumber\(character\.current_state\?\.goblin_debt, 10, 0\)/);
  assert.doesNotMatch(workspace,/game-lines\/mage\/print/);
  assert.match(css,/@page\s*\{\s*size:A4 portrait/);
  assert.match(css,/body\.character-printing > \.character-print-surface/);
  assert.match(css,/\.ctl-print-main-grid\s*\{[^}]*grid-template-columns:1\.08fr \.96fr \.96fr/);
  assert.match(css,/changeling\/style\/changeling-title\.webp/);
  assert.match(css,/changeling\/style\/botanical-corner\.webp/);
  assert.match(css,/\.ctl-print-card \{[^}]*background:transparent/);
});

test("service worker preserva shell offline e exige confirmação para atualizar", async () => {
  const worker=await readFile(new URL("../public/sw.js",import.meta.url),"utf8");
  assert.match(worker,/caches\.open\(CACHE\)/);
  assert.match(worker,/SKIP_WAITING/);
  assert.match(worker,/request\.mode === "navigate"/);
  assert.doesNotMatch(worker,/addEventListener\("install"[^;]+skipWaiting/);
});

test("a criação apresenta Contratos selecionados como cartões expansíveis", async () => {
  const builder=(await Promise.all([
    readFile(new URL("../game-lines/changeling/builder-view.tsx",import.meta.url),"utf8"),
    readFile(new URL("../game-lines/changeling/builder.tsx",import.meta.url),"utf8"),
  ])).join("\n");
  assert.match(builder,/className="contract-power-list creation-contract-list"/);
  assert.match(builder,/<details className="contract-power-card"/);
  assert.doesNotMatch(builder,/title=\{contractTooltip/);
  assert.match(builder,/kith_choice: customKith \? "" : kithChoice/);
});

test("a ficha de Mage localiza seus campos e mantém o divisor de Experiência compacto", async () => {
  const [workspace,css]=await Promise.all([
    readWorkspaceSource(),
    readFile(new URL("../app/css/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(workspace,/<LegacySheetField value=\{legacyDisplay\} enabled=\{hasLegacyAccess\}/);
  for (const label of ["Nome das Sombras", "Virtude", "Caminho", "Jogador", "Vício", "Ordem", "Crônica", "Conceito"])
    assert.match(workspace, new RegExp(`<CommonSheetField label="${label}"`));
  assert.doesNotMatch(workspace,/placeholder="Escreva uma (?:Aspiração|Obsessão)"/);
  assert.match(workspace,/tr\("Experiência","Experience"\)/);
  assert.match(workspace,/className="experience-actions mage-experience-actions"/);
  assert.match(workspace,/tr\("Perder FV","Lose WP"\)/);
  assert.match(workspace,/tr\("EXP Arcana","Arcane XP"\)/);
  assert.match(css,/\.mage-experience-split \{[^}]*justify-content:flex-start/);
  assert.match(css,/\.mage-experience-split label \{ width:116px/);
  assert.match(css,/\.experience-dialog \{ width:min\(620px/);
  assert.match(workspace,/className="experience-rule-menus"/);
  assert.match(workspace,/mageSpecialtySkill/);
  assert.match(workspace,/mageSpecialtyName\.trim\(\)/);
  assert.match(workspace,/minimum=\{obsessionSlots\} maximum=\{obsessionSlots\}/);
  assert.match(workspace,/minimum=\{gnosis\} maximum=\{gnosis\}/);
  assert.match(workspace,/<SpellColumn items=\{praxes\}[^>]*minimumRows=\{gnosis\}/);
  assert.doesNotMatch(workspace,/<SheetHeading>Itens Encantados<\/SheetHeading>/);
  assert.match(workspace,/item\.name === "Familiar"/);
  assert.match(workspace,/\["Fae Mount", "Fae Pet"\]\.includes\(item\.name\)/);
  assert.match(workspace,/tr\("Tipo de entidade", "Entity type"\)/);
});

test("aviso offline pode ser fechado durante toda a sessão", async () => {
  const manager=await readFile(new URL("../app/pwa-manager.tsx",import.meta.url),"utf8");
  const template=await readFile(new URL("../public/sw.template.js",import.meta.url),"utf8");
  assert.match(manager,/sessionStorage\.setItem\(DISMISSED_KEY,"1"\)/);
  assert.match(manager,/type="button" className="pwa-dismiss"/);
  assert.match(manager,/process\.env\.NODE_ENV === "production"/);
  assert.match(template,/isDevelopmentModule/);
  assert.match(template,/url\.searchParams\.has\("t"\)/);
});
