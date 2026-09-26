"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { CourtDefinition } from "@/lib/changeling-courts";
import type { KithDefinition } from "@/lib/changeling-kiths";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary } from "@/lib/contract-presentation";
import type { EntitlementDefinition } from "@/lib/entitlements";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, isHomebrewSource, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { EntitlementHomebrewEditor } from "./entitlement-homebrew-editor";
import { ENTITLEMENT_HOMEBREW_SOURCE_ID, saveEntitlementHomebrews } from "./entitlement-homebrews";
import { useEntitlementHomebrews } from "./use-entitlement-homebrews";
import { CTL_NEEDLE_DEFINITIONS, CTL_SEEMINGS, CTL_THREAD_DEFINITIONS, seemingDisplayName } from "./creation-rules";
import { ContractHomebrewEditor } from "./contract-homebrew-editor";
import { CONTRACT_HOMEBREW_SOURCE_ID, saveContractHomebrews } from "./contract-homebrews";
import { useContractHomebrews } from "./use-contract-homebrews";
import { MeritHomebrewPanel } from "@/app/merit-homebrew-panel";
import { ChangelingCatalogHomebrewEditor, emptyChangelingCatalogHomebrew } from "./catalog-homebrew-editor";
import { CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, mergeChangelingReference, saveChangelingCatalogHomebrews, type ChangelingCatalogHomebrew } from "./catalog-homebrews";
import { useChangelingCatalogHomebrews } from "./use-catalog-homebrews";

type HomebrewDetail = { label?: string; text: string };
type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; details: HomebrewDetail[]; tier?: string; tierOrder?: number; customEntitlement?: EntitlementDefinition; customContract?: ContractDefinition };

function ChangelingHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Changeling Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), customEntitlements = useEntitlementHomebrews(), customContracts = useContractHomebrews(), customCatalog = useChangelingCatalogHomebrews();
  const [entitlementEditorOpen, setEntitlementEditorOpen] = useState(false), [editingEntitlement, setEditingEntitlement] = useState<EntitlementDefinition | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<ChangelingCatalogHomebrew | null>(null);
  const [contractEditor, setContractEditor] = useState<{ open: boolean; initial: ContractDefinition | null }>({ open: false, initial: null });
  const rawReference = catalogs.get<{ conditions: ConditionDefinition[]; presentation: Record<string, Partial<ConditionDefinition>>; courts: CourtDefinition[]; entitlements: EntitlementDefinition[]; kiths: KithDefinition[] }>("changeling-reference");
  const reference = mergeChangelingReference(rawReference, customCatalog);
  const categoryOrder = [h("Méritos", "Merits"), "Seemings", h("Cortes", "Courts"), h("Frátrias", "Kiths"), "Entitlements", h("Contratos", "Contracts"), "Needles", "Threads", h("Condições", "Conditions"), "Errata"];
  const categoryRank = (kind: string) => { const index = categoryOrder.indexOf(kind); return index < 0 ? categoryOrder.length : index; };
  const items: ListedHomebrew[] = [];
  const add = (item: ListedHomebrew) => { if (isHomebrewSource(item.sourceId)) items.push(item); };
  const detail = (label: string | undefined, text: string | undefined): HomebrewDetail[] => text?.trim() ? [{ label, text: text.trim() }] : [];
  for (const item of catalogs.get<ContractDefinition[]>("changeling-contracts")) {
    const presented = contractPresentation(item, locale), outcomes = contractOutcomeSections(presented, locale), options = contractDisplayOptions(presented, locale);
    const courtBenefits = Object.entries(presented.courtClauses ?? {}).flatMap(([courtId, text]) => detail(`${h("Cláusula de Corte", "Court Clause")} — ${reference.courts.find((court) => court.id === courtId)?.[locale === "pt-BR" ? "translatedName" : "name"] ?? courtId}`, text));
    const seemingBenefits = Object.entries(presented.seemingBenefits ?? {}).flatMap(([seeming, text]) => detail(`${h("Benefício de Aparência", "Seeming Benefit")} — ${seemingDisplayName(seeming, locale)}`, text));
    add({
      id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Contratos", "Contracts"), name: locale === "pt-BR" ? item.name : item.originalName,
      details: [
        ...detail(h("Resumo", "Summary"), contractSummary(presented, locale)),
        ...(contractHasInvocationRoll(presented) === true ? detail(h("Parada de dados", "Dice Pool"), presented.dicePool ?? h("Não informada", "Not listed")) : []),
        ...detail(h("Custo", "Cost"), presented.cost ?? h("Conforme descrito", "As described")),
        ...detail(h("Ação", "Action"), presented.action ?? h("Instantânea", "Instant")),
        ...detail(h("Duração", "Duration"), presented.duration ?? h("Cena", "Scene")),
        ...outcomes, ...detail(h("Opções", "Options"), options.join("\n")),
        ...(presented.detailTables ?? []).flatMap((table) => detail(table.title, table.rows.map((row) => row.join(" — ")).join("\n"))),
        ...detail(h("Brecha", "Loophole"), presented.loophole), ...seemingBenefits, ...courtBenefits,
        ...detail(h("Dívida Goblin", "Goblin Debt"), presented.goblinDebt),
      ],
      tier: item.type === "Comum" ? h("Comuns", "Common") : h("Reais", "Royal"), tierOrder: item.type === "Comum" ? 0 : 1, ...(item.homebrew ? { customContract: item } : {}),
    });
  }
  for (const item of catalogs.get<MeritDefinition[]>("changeling-merits")) add({
    id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Méritos", "Merits"), name: locale === "pt-BR" ? item.translatedName : item.name,
    details: [
      ...detail(h("Pré-requisitos", "Prerequisites"), item.prerequisites),
      ...detail(h("Pré-requisitos alternativos", "Alternative prerequisites"), item.alternativePrerequisites),
      ...detail(h("Efeito", "Effect"), locale === "pt-BR" ? item.description : item.descriptionEn ?? item.description),
      ...(item.levels ?? []).flatMap((level) => detail(`${"•".repeat(level.rating)} ${level.name}`, level.description)),
    ],
  });
  for (const item of reference.conditions.filter((condition) => condition.source === "Book of Courts")) {
    const presented = locale === "pt-BR" ? { ...item, ...reference.presentation[item.id] } : item;
    add({ id: item.id, sourceId: "h-courts", source: item.source, kind: h("Condições", "Conditions"), name: presented.name, details: [...detail(h("Descrição", "Description"), presented.description), ...detail(h("Efeito", "Effect"), presented.penalty), ...detail(h("Resolução", "Resolution"), presented.resolution), ...detail("Beat", presented.beat)] });
  }
  for (const item of rawReference.courts) {
    const mantle = locale === "pt-BR" ? item.mantleBenefitsPt : item.mantleBenefits;
    add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Cortes", "Courts"), name: locale === "pt-BR" ? item.translatedName : item.name, details: [...detail(h("Emoção", "Emotion"), locale === "pt-BR" ? item.emotionPt : item.emotion), ...detail(h("Gatilho de Glamour", "Glamour Trigger"), locale === "pt-BR" ? item.glamourTriggerPt : item.glamourTrigger), ...mantle.flatMap((text, index) => detail(`Mantle ${index + 1}`, text))] });
  }
  for (const item of rawReference.kiths) if (item.sourceId) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Frátrias", "Kiths"), name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(h("Descrição", "Description"), item.description), ...detail(h("Bênção", "Blessing"), item.blessing), ...detail(h("Habilidade", "Skill"), item.skill)] });
  for (const item of rawReference.entitlements) if (item.sourceId) add({
    id: item.id, sourceId: item.sourceId, source: item.source, kind: "Entitlements", name: item.name,
    details: [
      ...detail(h("Pré-requisitos", "Prerequisites"), item.prerequisites), ...detail(h("Propósito", "Purpose"), item.purpose),
      ...detail(h("Privilégios", "Privileges"), item.privileges), ...detail(h("Deveres", "Duties"), item.duties), ...detail(h("Máscara e Mien", "Mask and Mien"), item.maskAndMien),
      ...detail(h("Heráldica", "Heraldry"), item.heraldry), ...detail(`${h("Token", "Token")} — ${item.token.name}`, item.token.description),
      ...detail(h("Efeito do Token", "Token Effect"), item.token.effect), ...detail(h("Captura do Token", "Token Catch"), item.token.catch), ...detail(h("Desvantagem do Token", "Token Drawback"), item.token.drawback),
      ...(item.roles ?? []).flatMap((role) => [...detail(`${h("Papel", "Role")} — ${role.name}`, role.prerequisites), ...detail(`${role.name} — ${h("privilégio", "privilege")}`, role.privilege), ...detail(`${role.name} — ${h("deveres", "duties")}`, role.duties), ...detail(`${role.name} — ${h("bônus do Token", "Token bonus")}`, role.tokenBonus), ...detail(`${role.name} — ${h("desvantagem do Token", "Token drawback")}`, role.tokenDrawback)]),
      ...item.blessings.flatMap((blessing) => detail(`${h("Bênção", "Blessing")} — ${blessing.name}`, blessing.description)),
      ...detail(h("Touchstone", "Touchstone"), item.touchstone), ...detail(h("Maldição", "Curse"), item.curse), ...detail("Beat", item.beat), ...detail(h("Lendas", "Legends"), item.legends.join("\n")),
    ],
  });
  for (const [name, item] of Object.entries(CTL_SEEMINGS)) if ("sourceId" in item) add({ id: `seeming:${name}`, sourceId: item.sourceId, source: item.source, kind: "Seemings", name: seemingDisplayName(name, locale), details: [...detail(h("Atributo favorecido", "Favored Attribute"), item.favored), ...detail(h("Regalia favorecida", "Favored Regalia"), item.regalia), ...detail(h("Bênção", "Blessing"), locale === "pt-BR" ? item.blessing : item.blessingEn), ...detail(h("Maldição", "Curse"), locale === "pt-BR" ? item.curse : item.curseEn)] });
  for (const item of CTL_NEEDLE_DEFINITIONS) if (item.sourceId) add({ id: `needle:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: "Needles", name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(h("Recuperar 1 de Força de Vontade", "Recover 1 Willpower"), locale === "pt-BR" ? item.singleWillpowerPt : item.singleWillpower), ...detail(h("Recuperar toda a Força de Vontade", "Recover all Willpower"), locale === "pt-BR" ? item.allWillpowerPt : item.allWillpower)] });
  for (const item of CTL_THREAD_DEFINITIONS) if (item.sourceId) add({ id: `thread:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: "Threads", name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(h("Recuperar 1 de Força de Vontade", "Recover 1 Willpower"), locale === "pt-BR" ? item.singleWillpowerPt : item.singleWillpower), ...detail(h("Recuperar toda a Força de Vontade", "Recover all Willpower"), locale === "pt-BR" ? item.allWillpowerPt : item.allWillpower)] });
  items.sort((left, right) => (left.tierOrder ?? 0) - (right.tierOrder ?? 0) || left.name.localeCompare(right.name, locale));
  const sources = [...new Map(items.map((item) => [item.sourceId, item.source])).entries()].sort((left, right) => left[1].localeCompare(right[1], locale));
  const toggle = (id: string, enabled: boolean) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled));
  const saveCustomEntitlement = (definition: EntitlementDefinition) => {
    saveEntitlementHomebrews(customEntitlements.some((item) => item.id === definition.id) ? customEntitlements.map((item) => item.id === definition.id ? definition : item) : [...customEntitlements, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, ENTITLEMENT_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const saveCustomContract = (definition: ContractDefinition) => {
    saveContractHomebrews(customContracts.some((item) => item.id === definition.id) ? customContracts.map((item) => item.id === definition.id ? definition : item) : [...customContracts, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, CONTRACT_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const saveCustomCatalog = (definition: ChangelingCatalogHomebrew) => {
    saveChangelingCatalogHomebrews(customCatalog.some((item) => item.id === definition.id) ? customCatalog.map((item) => item.id === definition.id ? definition : item) : [...customCatalog, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const removeCustomEntitlement = (id: string) => saveEntitlementHomebrews(customEntitlements.filter((item) => item.id !== id));
  const removeCustomContract = (id: string) => saveContractHomebrews(customContracts.filter((item) => item.id !== id));
  const renderItem = (item: ListedHomebrew, sourceActive: boolean) => {
    const active = homebrewContentActive(preferences, item.id, item.sourceId);
    return <article className="homebrew-list-item" key={`${item.kind}:${item.id}`}><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body">{item.details.map((entry, index) => <p key={`${entry.label ?? "detail"}:${index}`}>{entry.label && <strong>{entry.label}:</strong>} {entry.text}</p>)}{(item.customEntitlement || item.customContract) && <div className="homebrew-list-item-actions">{item.customEntitlement && <><Button type="button" size="sm" variant="outline" onClick={() => setEditingEntitlement(item.customEntitlement ?? null)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Entitlement?", "Delete Entitlement?")} description={h("Ele deixará de aparecer nas escolhas. Fichas que dependem dele podem perder a apresentação das regras.", "It will disappear from choices. Sheets that depend on it may lose their rules presentation.")} action={h("Excluir", "Delete")} onConfirm={() => removeCustomEntitlement(item.id)}/></>}{item.customContract && <><Button type="button" size="sm" variant="outline" onClick={() => setContractEditor({ open: true, initial: item.customContract ?? null })}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Contrato?", "Delete Contract?")} description={h("Ele deixará de aparecer nas novas escolhas. Fichas existentes conservam os textos já salvos.", "It will disappear from new choices. Existing sheets retain their saved text.")} action={h("Excluir", "Delete")} onConfirm={() => removeCustomContract(item.id)}/></>}</div>}</div></details><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)} aria-label={`${item.name}: ${active ? h("ativo", "active") : h("desativado", "disabled")}`}/></label></article>;
  };
  const playerGroups = [
    { id: "seeming", label: "Seemings", items: customCatalog.filter((item) => item.entryType === "seeming"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("seeming")) },
    { id: "kith", label: h("Frátrias", "Kiths"), items: customCatalog.filter((item) => item.entryType === "kith"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("kith")) },
    { id: "court", label: h("Cortes", "Courts"), items: customCatalog.filter((item) => item.entryType === "court"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("court")) },
    { id: "contract", label: h("Contratos", "Contracts"), items: customContracts, create: () => setContractEditor({ open: true, initial: null }) },
    { id: "entitlement", label: "Entitlements", items: customEntitlements, create: () => { setEditingEntitlement(null); setEntitlementEditorOpen(true); } },
  ];
  const playerSummary = (item: ChangelingCatalogHomebrew | ContractDefinition | EntitlementDefinition) => "description" in item ? item.description : "purpose" in item ? item.purpose : "emotion" in item ? item.emotion : "blessing" in item ? item.blessing : "";
  return <><MeritHomebrewPanel line="CtL" catalog={[...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("changeling-merits")]}/><section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{h("Conteúdo criado para Changeling", "Player-created Changeling Content")}</h3><p>{h("Crie, ative e edite opções específicas da linha.", "Create, enable, and edit line-specific options.")}</p></div></div>
    <div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{h("Seemings, Kiths e Cortes", "Seemings, Kiths, and Courts")}</span><Switch checked={!preferences.disabledIds.includes(CHANGELING_CATALOG_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{h("Contratos", "Contracts")}</span><Switch checked={!preferences.disabledIds.includes(CONTRACT_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(CONTRACT_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{h("Entitlements", "Entitlements")}</span><Switch checked={!preferences.disabledIds.includes(ENTITLEMENT_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(ENTITLEMENT_HOMEBREW_SOURCE_ID, checked)}/></label></div>
    <Tabs defaultValue="seeming" className="homebrew-kind-tabs"><TabsList variant="line" className="homebrew-kind-tabs-list">{playerGroups.map((group) => <TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{playerGroups.map((group) => <TabsContent className="homebrew-kind-panel" value={group.id} key={group.id}><div className="homebrew-source-toolbar"><strong>{group.label}</strong><Button type="button" size="sm" onClick={group.create}><Plus/> {h("Criar", "Create")}</Button></div>{group.items.length === 0 ? <p>{h("Nenhum item criado pelo jogador.", "No player-created items yet.")}</p> : <div className="homebrew-grid">{[...group.items].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
      const catalogItem = "entryType" in item, contract = "originalName" in item, sourceId = catalogItem ? CHANGELING_CATALOG_HOMEBREW_SOURCE_ID : contract ? CONTRACT_HOMEBREW_SOURCE_ID : ENTITLEMENT_HOMEBREW_SOURCE_ID, sourceActive = !preferences.disabledIds.includes(sourceId), active = homebrewContentActive(preferences, item.id, sourceId);
      return <article className="homebrew-list-item" key={item.id}><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body"><p>{playerSummary(item)}</p><div className="homebrew-list-item-actions"><Button type="button" size="sm" variant="outline" onClick={() => catalogItem ? setEditingCatalog(item) : contract ? setContractEditor({ open: true, initial: item }) : (setEditingEntitlement(item), setEntitlementEditorOpen(true))}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir item?", "Delete item?")} description={h("Ele deixará de aparecer em novas escolhas.", "It will disappear from new choices.")} action={h("Excluir", "Delete")} onConfirm={() => catalogItem ? saveChangelingCatalogHomebrews(customCatalog.filter((entry) => entry.id !== item.id)) : contract ? removeCustomContract(item.id) : removeCustomEntitlement(item.id)}/></div></div></details><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label></article>;
    })}</div>}</TabsContent>)}</Tabs>
    {editingCatalog && <ChangelingCatalogHomebrewEditor key={editingCatalog.id} initial={editingCatalog} onOpenChange={(open) => { if (!open) setEditingCatalog(null); }} onSave={saveCustomCatalog}/>}
    {entitlementEditorOpen && <EntitlementHomebrewEditor open onOpenChange={setEntitlementEditorOpen} initial={editingEntitlement} onSave={saveCustomEntitlement}/>}
    {contractEditor.open && <ContractHomebrewEditor open onOpenChange={(open) => setContractEditor((current) => ({ ...current, open }))} initial={contractEditor.initial} courts={reference.courts} onSave={saveCustomContract}/>}
  </section><section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{h("Homebrews publicados de Changeling", "Published Changeling Homebrews")}</h3><p>{h("A ativação controla novas escolhas; fichas existentes conservam os dados que já possuem.", "Activation controls new choices; existing sheets retain data they already own.")}</p></div></div>
    <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
      const sourceItems = items.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId), kinds = [...new Set(sourceItems.map((item) => item.kind))].sort((left, right) => categoryRank(left) - categoryRank(right) || left.localeCompare(right, locale));
      return <details className="panel homebrew-source changeling-homebrew-source" key={sourceId}>
        <summary className="homebrew-source-summary"><div><strong>{source}</strong><span>{sourceItems.length} {h("itens implementados", "implemented items")}</span></div></summary>
        <div className="homebrew-source-body"><Tabs defaultValue={kinds[0]} className="homebrew-kind-tabs"><div className="homebrew-source-toolbar"><TabsList variant="line" className="homebrew-kind-tabs-list" aria-label={h("Categorias da fonte", "Source categories")}>{kinds.map((kind) => <TabsTrigger key={kind} value={kind}>{kind}</TabsTrigger>)}</TabsList><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? h("ativa", "active") : h("desativada", "disabled")}`}/></label></div>{kinds.map((kind) => {
          const kindItems = sourceItems.filter((item) => item.kind === kind), tiers = [...new Map(kindItems.filter((item) => item.tier).map((item) => [item.tier, item.tierOrder ?? 0])).entries()].sort((left, right) => left[1] - right[1]);
          return <TabsContent className="homebrew-kind-panel" value={kind} key={kind}>{tiers.length > 1 ? tiers.map(([tier]) => <section className="homebrew-tier-list" key={tier}><h4>{tier}</h4><div className="homebrew-item-list">{kindItems.filter((item) => item.tier === tier).map((item) => renderItem(item, sourceActive))}</div></section>) : <div className="homebrew-item-list">{kindItems.map((item) => renderItem(item, sourceActive))}</div>}</TabsContent>;
        })}</Tabs></div>
      </details>;
    })}</div>
  </section></>;
}

export const changelingHomebrew: GameLineHomebrewModule = { Component: ChangelingHomebrew };
