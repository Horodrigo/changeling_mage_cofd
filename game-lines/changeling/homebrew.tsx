"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary } from "@/lib/contract-presentation";
import { entitlementCatalogPresentation, type EntitlementDefinition } from "@/lib/entitlements";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, isHomebrewSource, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { useLanguage } from "@/lib/i18n";
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
import type { ChangelingReference } from "./catalogs/reference";

type HomebrewDetail = { label?: string; text: string };
type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; details: HomebrewDetail[]; tier?: string; tierOrder?: number; customEntitlement?: EntitlementDefinition; customContract?: ContractDefinition };

function ChangelingHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Changeling Homebrew requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences(), customEntitlements = useEntitlementHomebrews(), customContracts = useContractHomebrews(), customCatalog = useChangelingCatalogHomebrews();
  const [entitlementEditorOpen, setEntitlementEditorOpen] = useState(false), [editingEntitlement, setEditingEntitlement] = useState<EntitlementDefinition | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<ChangelingCatalogHomebrew | null>(null);
  const [contractEditor, setContractEditor] = useState<{ open: boolean; initial: ContractDefinition | null }>({ open: false, initial: null });
  const rawReference = catalogs.get<ChangelingReference>("changeling-reference");
  const reference = mergeChangelingReference(rawReference, customCatalog);
  const categoryOrder = [t("ui.merits"), t("ui.seemings"), t("ui.courts"), t("ui.kiths"), t("ui.entitlements"), t("ui.contracts"), t("ui.needles"), t("ui.threads"), t("ui.conditions"), "Errata"];
  const categoryRank = (kind: string) => { const index = categoryOrder.indexOf(kind); return index < 0 ? categoryOrder.length : index; };
  const items: ListedHomebrew[] = [];
  const add = (item: ListedHomebrew) => { if (isHomebrewSource(item.sourceId)) items.push(item); };
  const detail = (label: string | undefined, text: string | undefined): HomebrewDetail[] => text?.trim() ? [{ label, text: text.trim() }] : [];
  for (const item of catalogs.get<ContractDefinition[]>("changeling-contracts")) {
    const presented = contractPresentation(item, locale, reference.contractPresentation), outcomes = contractOutcomeSections(presented, locale), options = contractDisplayOptions(presented, locale);
    const courtBenefits = Object.entries(presented.courtClauses ?? {}).flatMap(([courtId, text]) => detail(`${t("ui.courtClause")} — ${reference.courts.find((court) => court.id === courtId)?.[locale === "pt-BR" ? "translatedName" : "name"] ?? courtId}`, text));
    const seemingBenefits = Object.entries(presented.seemingBenefits ?? {}).flatMap(([seeming, text]) => detail(`${t("ui.seemingBenefit")} — ${seemingDisplayName(seeming, locale)}`, text));
    add({
      id: item.id, sourceId: item.sourceId, source: item.source, kind: t("ui.contracts"), name: presented.name,
      details: [
        ...detail(t("ui.summary"), contractSummary(presented, locale)),
        ...(contractHasInvocationRoll(presented) === true ? detail(t("ui.dicePool"), presented.dicePool ?? t("ui.notListed")) : []),
        ...detail(t("ui.cost"), presented.cost ?? t("ui.asDescribed")),
        ...detail(t("ui.action"), presented.action ?? t("ui.instant")),
        ...detail(t("ui.duration"), presented.duration ?? t("ui.scene")),
        ...outcomes, ...detail(t("ui.options"), options.join("\n")),
        ...(presented.detailTables ?? []).flatMap((table) => detail(table.title, table.rows.map((row) => row.join(" — ")).join("\n"))),
        ...detail(t("ui.loophole"), presented.loophole), ...seemingBenefits, ...courtBenefits,
        ...detail(t("ui.goblinDebt"), presented.goblinDebt),
      ],
      tier: item.type === "Comum" ? t("ui.commonContracts") : t("ui.royalContracts"), tierOrder: item.type === "Comum" ? 0 : 1, ...(item.homebrew ? { customContract: item } : {}),
    });
  }
  for (const item of catalogs.get<MeritDefinition[]>("changeling-merits")) add({
    id: item.id, sourceId: item.sourceId, source: item.source, kind: t("ui.merits"), name: locale === "pt-BR" ? item.translatedName : item.name,
    details: [
      ...detail(t("ui.prerequisites"), item.prerequisites),
      ...detail(t("ui.alternativePrerequisites"), item.alternativePrerequisites),
      ...detail(t("ui.effect"), locale === "pt-BR" ? item.description : item.descriptionEn ?? item.description),
      ...(item.levels ?? []).flatMap((level) => detail(`${"•".repeat(level.rating)} ${level.name}`, level.description)),
    ],
  });
  for (const item of reference.conditions.filter((condition) => condition.source === "Book of Courts")) {
    const presented = locale === "pt-BR" ? { ...item, ...reference.presentation[item.id] } : item;
    add({ id: item.id, sourceId: "h-courts", source: item.source, kind: t("ui.conditions"), name: presented.name, details: [...detail(t("ui.descriptionLabel"), presented.description), ...detail(t("ui.effect"), presented.penalty), ...detail(t("ui.resolution"), presented.resolution), ...detail(t("ui.beat"), presented.beat)] });
  }
  for (const item of rawReference.courts) {
    const mantle = locale === "pt-BR" ? item.mantleBenefitsPt : item.mantleBenefits;
    add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: t("ui.courts"), name: locale === "pt-BR" ? item.translatedName : item.name, details: [...detail(t("ui.emotion"), locale === "pt-BR" ? item.emotionPt : item.emotion), ...detail(t("ui.glamourTrigger"), locale === "pt-BR" ? item.glamourTriggerPt : item.glamourTrigger), ...mantle.flatMap((text, index) => detail(`${t("ui.mantle")} ${index + 1}`, text))] });
  }
  for (const item of rawReference.kiths) if (item.sourceId) {
    const presented = locale === "pt-BR" ? rawReference.kithPresentation[item.id] ?? item : item;
    add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: t("ui.kiths"), name: presented.name, details: [...detail(t("ui.descriptionLabel"), presented.description), ...detail(t("ui.blessingLabel"), presented.blessing), ...detail(t("ui.skill"), presented.skill)] });
  }
  for (const item of entitlementCatalogPresentation(rawReference.entitlements, locale, rawReference.entitlementPresentation)) if (item.sourceId) add({
    id: item.id, sourceId: item.sourceId, source: item.source, kind: t("ui.entitlements"), name: item.name,
    details: [
      ...detail(t("ui.prerequisites"), item.prerequisites), ...detail(t("ui.purpose"), item.purpose),
      ...detail(t("ui.privileges"), item.privileges), ...detail(t("ui.duties"), item.duties), ...detail(t("ui.maskAndMien"), item.maskAndMien),
      ...detail(t("ui.heraldry"), item.heraldry), ...detail(`${t("ui.token")} — ${item.token.name}`, item.token.description),
      ...detail(t("ui.tokenEffect"), item.token.effect), ...detail(t("ui.tokenCatch"), item.token.catch), ...detail(t("ui.tokenDrawback"), item.token.drawback),
      ...(item.roles ?? []).flatMap((role) => [...detail(`${t("ui.role")} — ${role.name}`, role.prerequisites), ...detail(`${role.name} — ${t("ui.privilege")}`, role.privilege), ...detail(`${role.name} — ${t("ui.duties")}`, role.duties), ...detail(`${role.name} — ${t("ui.tokenBonus")}`, role.tokenBonus), ...detail(`${role.name} — ${t("ui.tokenDrawback")}`, role.tokenDrawback)]),
      ...item.blessings.flatMap((blessing) => detail(`${t("ui.blessingLabel")} — ${blessing.name}`, blessing.description)),
      ...detail(t("ui.touchstone"), item.touchstone), ...detail(t("ui.curse"), item.curse), ...detail(t("ui.beat"), item.beat), ...detail(t("ui.legends"), item.legends.join("\n")),
    ],
  });
  for (const [name, item] of Object.entries(CTL_SEEMINGS)) if ("sourceId" in item) add({ id: `seeming:${name}`, sourceId: item.sourceId, source: item.source, kind: t("ui.seemings"), name: seemingDisplayName(name, locale), details: [...detail(t("ui.favoredAttribute"), item.favored), ...detail(t("ui.favoredRegalia"), item.regalia), ...detail(t("ui.blessingLabel"), locale === "pt-BR" ? item.blessing : item.blessingEn), ...detail(t("ui.curse"), locale === "pt-BR" ? item.curse : item.curseEn)] });
  for (const item of CTL_NEEDLE_DEFINITIONS) if (item.sourceId) add({ id: `needle:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: t("ui.needles"), name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(t("ui.recoverOneWillpower"), locale === "pt-BR" ? item.singleWillpowerPt : item.singleWillpower), ...detail(t("ui.recoverAllWillpower"), locale === "pt-BR" ? item.allWillpowerPt : item.allWillpower)] });
  for (const item of CTL_THREAD_DEFINITIONS) if (item.sourceId) add({ id: `thread:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: t("ui.threads"), name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(t("ui.recoverOneWillpower"), locale === "pt-BR" ? item.singleWillpowerPt : item.singleWillpower), ...detail(t("ui.recoverAllWillpower"), locale === "pt-BR" ? item.allWillpowerPt : item.allWillpower)] });
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
    return <article className="homebrew-list-item" key={`${item.kind}:${item.id}`}><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body">{item.details.map((entry, index) => <p key={`${entry.label ?? "detail"}:${index}`}>{entry.label && <strong>{entry.label}:</strong>} {entry.text}</p>)}{(item.customEntitlement || item.customContract) && <div className="homebrew-list-item-actions">{item.customEntitlement && <><Button type="button" size="sm" variant="outline" onClick={() => setEditingEntitlement(item.customEntitlement ?? null)}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteEntitlementTitle")} description={t("ui.deleteEntitlementDescription")} action={t("ui.deleteAction")} onConfirm={() => removeCustomEntitlement(item.id)}/></>}{item.customContract && <><Button type="button" size="sm" variant="outline" onClick={() => setContractEditor({ open: true, initial: item.customContract ?? null })}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteContractTitle")} description={t("ui.deleteContractDescription")} action={t("ui.deleteAction")} onConfirm={() => removeCustomContract(item.id)}/></>}</div>}</div></details><label className="homebrew-toggle"><span>{active ? t("ui.activeMasculine") : t("ui.disabledMasculine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)} aria-label={`${item.name}: ${active ? t("ui.activeLowercase") : t("ui.disabledLowercase")}`}/></label></article>;
  };
  const playerGroups = [
    { id: "seeming", label: t("ui.seemings"), items: customCatalog.filter((item) => item.entryType === "seeming"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("seeming")) },
    { id: "kith", label: t("ui.kiths"), items: customCatalog.filter((item) => item.entryType === "kith"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("kith")) },
    { id: "court", label: t("ui.courts"), items: customCatalog.filter((item) => item.entryType === "court"), create: () => setEditingCatalog(emptyChangelingCatalogHomebrew("court")) },
    { id: "contract", label: t("ui.contracts"), items: customContracts, create: () => setContractEditor({ open: true, initial: null }) },
    { id: "entitlement", label: t("ui.entitlements"), items: customEntitlements, create: () => { setEditingEntitlement(null); setEntitlementEditorOpen(true); } },
  ];
  const playerSummary = (item: ChangelingCatalogHomebrew | ContractDefinition | EntitlementDefinition) => "description" in item ? item.description : "purpose" in item ? item.purpose : "emotion" in item ? item.emotion : "blessing" in item ? item.blessing : "";
  return <><MeritHomebrewPanel line="CtL" catalog={[...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("changeling-merits")]}/><section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{t("ui.playerCreatedChangelingContent")}</h3><p>{t("ui.playerCreatedChangelingContentDescription")}</p></div></div>
    <div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{t("ui.seemingsKithsAndCourts")}</span><Switch checked={!preferences.disabledIds.includes(CHANGELING_CATALOG_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{t("ui.contracts")}</span><Switch checked={!preferences.disabledIds.includes(CONTRACT_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(CONTRACT_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{t("ui.entitlements")}</span><Switch checked={!preferences.disabledIds.includes(ENTITLEMENT_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(ENTITLEMENT_HOMEBREW_SOURCE_ID, checked)}/></label></div>
    <Tabs defaultValue="seeming" className="homebrew-kind-tabs"><TabsList variant="line" className="homebrew-kind-tabs-list">{playerGroups.map((group) => <TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{playerGroups.map((group) => <TabsContent className="homebrew-kind-panel" value={group.id} key={group.id}><div className="homebrew-source-toolbar"><strong>{group.label}</strong><Button type="button" size="sm" onClick={group.create}><Plus/> {t("ui.createAction")}</Button></div>{group.items.length === 0 ? <p>{t("ui.noPlayerCreatedItems")}</p> : <div className="homebrew-grid">{[...group.items].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
      const catalogItem = "entryType" in item, contract = "originalName" in item, sourceId = catalogItem ? CHANGELING_CATALOG_HOMEBREW_SOURCE_ID : contract ? CONTRACT_HOMEBREW_SOURCE_ID : ENTITLEMENT_HOMEBREW_SOURCE_ID, sourceActive = !preferences.disabledIds.includes(sourceId), active = homebrewContentActive(preferences, item.id, sourceId);
      return <article className="homebrew-list-item" key={item.id}><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body"><p>{playerSummary(item)}</p><div className="homebrew-list-item-actions"><Button type="button" size="sm" variant="outline" onClick={() => catalogItem ? setEditingCatalog(item) : contract ? setContractEditor({ open: true, initial: item }) : (setEditingEntitlement(item), setEntitlementEditorOpen(true))}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteItemTitle")} description={t("ui.deleteItemDescription")} action={t("ui.deleteAction")} onConfirm={() => catalogItem ? saveChangelingCatalogHomebrews(customCatalog.filter((entry) => entry.id !== item.id)) : contract ? removeCustomContract(item.id) : removeCustomEntitlement(item.id)}/></div></div></details><label className="homebrew-toggle"><span>{active ? t("ui.activeMasculine") : t("ui.disabledMasculine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label></article>;
    })}</div>}</TabsContent>)}</Tabs>
    {editingCatalog && <ChangelingCatalogHomebrewEditor key={editingCatalog.id} initial={editingCatalog} onOpenChange={(open) => { if (!open) setEditingCatalog(null); }} onSave={saveCustomCatalog}/>}
    {entitlementEditorOpen && <EntitlementHomebrewEditor open onOpenChange={setEntitlementEditorOpen} initial={editingEntitlement} onSave={saveCustomEntitlement}/>}
    {contractEditor.open && <ContractHomebrewEditor open onOpenChange={(open) => setContractEditor((current) => ({ ...current, open }))} initial={contractEditor.initial} courts={reference.courts} onSave={saveCustomContract}/>}
  </section><section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{t("ui.publishedChangelingHomebrews")}</h3><p>{t("ui.publishedHomebrewDescription")}</p></div></div>
    <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
      const sourceItems = items.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId), kinds = [...new Set(sourceItems.map((item) => item.kind))].sort((left, right) => categoryRank(left) - categoryRank(right) || left.localeCompare(right, locale));
      return <details className="panel homebrew-source changeling-homebrew-source" key={sourceId}>
        <summary className="homebrew-source-summary"><div><strong>{source}</strong><span>{sourceItems.length} {t("ui.implementedItems")}</span></div></summary>
        <div className="homebrew-source-body"><Tabs defaultValue={kinds[0]} className="homebrew-kind-tabs"><div className="homebrew-source-toolbar"><TabsList variant="line" className="homebrew-kind-tabs-list" aria-label={t("ui.sourceCategories")}>{kinds.map((kind) => <TabsTrigger key={kind} value={kind}>{kind}</TabsTrigger>)}</TabsList><label className="homebrew-toggle"><span>{sourceActive ? t("ui.sourceActive") : t("ui.sourceDisabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? t("ui.activeLowercase") : t("ui.disabledLowercase")}`}/></label></div>{kinds.map((kind) => {
          const kindItems = sourceItems.filter((item) => item.kind === kind), tiers = [...new Map(kindItems.filter((item) => item.tier).map((item) => [item.tier, item.tierOrder ?? 0])).entries()].sort((left, right) => left[1] - right[1]);
          return <TabsContent className="homebrew-kind-panel" value={kind} key={kind}>{tiers.length > 1 ? tiers.map(([tier]) => <section className="homebrew-tier-list" key={tier}><h4>{tier}</h4><div className="homebrew-item-list">{kindItems.filter((item) => item.tier === tier).map((item) => renderItem(item, sourceActive))}</div></section>) : <div className="homebrew-item-list">{kindItems.map((item) => renderItem(item, sourceActive))}</div>}</TabsContent>;
        })}</Tabs></div>
      </details>;
    })}</div>
  </section></>;
}

export const changelingHomebrew: GameLineHomebrewModule = { Component: ChangelingHomebrew };
