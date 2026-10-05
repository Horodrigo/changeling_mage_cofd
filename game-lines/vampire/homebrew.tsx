"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { MeritHomebrewPanel } from "@/app/merit-homebrew-panel";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, isHomebrewSource, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { MeritDefinition } from "@/lib/merits";
import { meritPresentation } from "@/lib/merit-presentation";
import { vampireBloodlinePresentation, vampireClanPresentation, vampireCovenantPresentation } from "./reference-presentation";
import { vampirePowerPresentation } from "./power-presentation";
import { vampireDisciplineDisplayName } from "./creation-rules";
import { BloodlineHomebrewEditor } from "./bloodline-homebrew-editor";
import { BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampireCondition, VampireMechanics, VampirePowers, VampireReference } from "./catalog-types";
import { SIMPLIFIED_HOLLOW_ID, vampireHomebrewSourceId } from "./homebrew-catalog";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";
import { VampireCatalogHomebrewEditor, emptyVampireCatalogHomebrew } from "./catalog-homebrew-editor";
import { saveVampireCatalogHomebrews, VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, type VampireCatalogHomebrew } from "./catalog-homebrews";
import { useVampireCatalogHomebrews } from "./use-catalog-homebrews";

type Detail = { label: string; text: string };
type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; details: Detail[]; parentId?: string; defaultDisabled?: boolean };

function VampireHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Vampire Homebrew requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences(), customBloodlines = useBloodlineHomebrews(), customCatalog = useVampireCatalogHomebrews();
  const reference = catalogs.get<VampireReference>("vampire-reference"), powers = catalogs.get<VampirePowers>("vampire-powers"), conditions = catalogs.get<readonly VampireCondition[]>("vampire-conditions");
  const coreMerits = catalogs.get<readonly MeritDefinition[]>("core-merits"), vampireMerits = catalogs.get<readonly MeritDefinition[]>("vampire-merits"), merits = [...coreMerits, ...vampireMerits];
  const bloodSorcery = t("ui.bloodSorcery"), disciplines = t("ui.disciplines");
  const categoryOrder = [t("ui.merits"), t("ui.clans"), t("ui.covenants"), t("ui.bloodlines"), disciplines, bloodSorcery, t("ui.devotions"), t("ui.conditions"), "Errata"];
  const nestedDevotions: Record<string, { kind: string; parentId: string }> = {
    "Lessons of Erebus": { kind: disciplines, parentId: "truths-of-erebus" },
    "Ortam Recipes": { kind: disciplines, parentId: "ortam" },
    "Lithopedia Rites": { kind: bloodSorcery, parentId: "lithopedia" },
  };
  const [bloodlineEditorOpen, setBloodlineEditorOpen] = useState(false), [editingBloodline, setEditingBloodline] = useState<VampireBloodlineDefinition | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<VampireCatalogHomebrew | null>(null);
  const listed: ListedHomebrew[] = [];
  const detail = (label: string, value: unknown): Detail[] => String(value ?? "").trim() ? [{ label, text: String(value).trim() }] : [];
  const add = (item: { id: string; source: string; sourceId?: string; name: string; translatedName?: string; page?: number; defaultDisabled?: boolean; errataFor?: string; errataForName?: string }, kind: string, details: Detail[], parentId?: string) => {
    const sourceId = vampireHomebrewSourceId(item);
    if (sourceId && isHomebrewSource(sourceId)) listed.push({ id: item.id, sourceId, source: item.source, kind: item.errataFor || item.defaultDisabled && item.errataForName ? "Errata" : kind, name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(t("ui.errataFor"), item.errataForName), ...details, ...detail(t("ui.pageLabel"), item.page)], parentId, defaultDisabled: item.defaultDisabled });
  };
  const mechanics = (item: VampireMechanics): Detail[] => [
    ...detail(t("ui.cost"), item.cost), ...detail(t("ui.requirement"), item.requirement), ...detail(t("ui.dicePool"), item.dicePool),
    ...detail(t("ui.action"), item.action), ...detail(t("ui.duration"), item.duration), ...detail(t("ui.targetSuccesses"), item.targetSuccesses),
    ...detail(t("ui.contestedBy"), item.contestedBy), ...detail(t("ui.resistedBy"), item.resistedBy), ...detail(t("ui.sacrament"), item.sacrament),
    ...detail(t("ui.condition"), item.condition), ...detail(t("ui.effect"), item.effect),
    ...detail(t("ui.procedure"), item.procedure), ...detail(t("ui.outcome"), item.outcome),
    ...([
      ["dramaticFailure", t("ui.dramaticFailure")], ["failure", t("ui.failure")],
      ["success", t("ui.success")], ["exceptionalSuccess", t("ui.exceptionalSuccess")],
    ] as const).flatMap(([key, label]) => detail(label, item.rollResults?.[key])),
    ...(item.suggestedModifiers ?? []).flatMap(modifier => detail(`${t("ui.suggestedModifiers")} ${modifier.modifier}`, modifier.situation)),
  ];
  merits.forEach((item) => {
    const presented = meritPresentation(item, locale);
    add({ ...item, name: presented.name, translatedName: presented.name }, t("ui.merits"), [...detail(t("ui.ratings"), item.ratings.join(", ")), ...detail(t("ui.prerequisites"), presented.prerequisites), ...detail(t("ui.effect"), presented.description), ...(presented.levels ?? []).flatMap((level) => detail(`${"•".repeat(level.rating)} ${level.name}`, level.description))]);
  });
  reference.clans.forEach((definition) => {
    const item = vampireClanPresentation(definition, locale);
    add(item, t("ui.clans"), [...detail(t("ui.favoredAttributes"), item.favoredAttributes.map(name => systemTerm(name, locale)).join(" / ")), ...detail(t("ui.disciplines"), item.disciplines.map(name => vampireDisciplineDisplayName(name, powers.disciplines, locale)).join(", ")), ...detail(item.baneName, item.baneSummary)]);
  });
  reference.covenants.forEach((definition) => {
    const item = vampireCovenantPresentation(definition, locale);
    add(item, t("ui.covenants"), [...detail(t("ui.descriptionLabel"), item.description), ...detail(t("ui.advantage"), item.advantage)]);
  });
  reference.bloodlines.forEach((definition) => {
    const item = vampireBloodlinePresentation(definition, locale);
    add(item, t("ui.bloodlines"), [...detail(t("ui.summary"), item.summary), ...detail(t("ui.parentClan"), item.parentClan), ...detail(t("ui.prerequisites"), item.requirements), ...detail(t("ui.favoredAttributes"), item.favoredAttributes.map(name => systemTerm(name, locale)).join(" / ")), ...detail(t("ui.disciplines"), item.disciplines.map(name => vampireDisciplineDisplayName(name, powers.disciplines, locale)).join(", ")), ...detail(item.giftName ?? "", item.giftSummary), ...detail(item.baneName, item.baneSummary)]);
  });
  powers.disciplines.forEach((definition) => {
    const item = vampirePowerPresentation(definition, locale);
    add(item, item.id === "lithopedia" ? bloodSorcery : disciplines, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.bloodline"), item.bloodlineId), ...mechanics(item), ...(item.levels ?? []).map((level) => vampirePowerPresentation(level, locale)).flatMap((level) => [
      ...detail(`${"•".repeat(level.rating)} ${locale === "pt-BR" ? level.translatedName : level.name}`, level.summary), ...mechanics(level),
    ])]);
  });
  powers.ritualDisciplines.forEach((definition) => {
    const item = vampirePowerPresentation(definition, locale);
    add(item, bloodSorcery, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.prerequisites"), item.statusRequirement), ...detail(t("ui.humanityCap"), item.humanityCapFormula), ...mechanics(item)]);
  });
  powers.devotions.forEach((item) => { const placement = item.category ? nestedDevotions[item.category] : undefined; add(item, placement?.kind ?? item.category ?? t("ui.devotions"), [...detail(t("ui.summary"), item.summary), ...detail(t("ui.prerequisites"), item.prerequisites), ...mechanics(item)], placement?.parentId); });
  powers.lashes.forEach((definition) => {
    const item = vampirePowerPresentation(definition, locale);
    add(item, disciplines, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.prerequisites"), item.prerequisites), ...mechanics(item)], "blood-tether");
  });
  powers.cruacRites.forEach((item) => add(item, bloodSorcery, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.level"), item.rating), ...mechanics(item)]));
  powers.thebanMiracles.forEach((item) => add(item, bloodSorcery, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.level"), item.rating), ...mechanics(item)]));
  powers.gildedInvocations.forEach((item) => add(item, bloodSorcery, [...detail(t("ui.discipline"), t("ui.gildedCage")), ...detail(t("ui.summary"), item.summary), ...detail(t("ui.level"), item.rating), ...mechanics(item)], "gilded-cage"));
  powers.detournements.forEach((item) => add(item, bloodSorcery, [...detail(t("ui.summary"), item.summary), ...detail(t("ui.prerequisites"), item.prerequisites), ...mechanics(item)]));
  conditions.forEach((item) => add(item, t("ui.conditions"), [...detail(t("ui.descriptionLabel"), item.description), ...detail(t("ui.penalty"), item.penalty), ...detail(t("ui.persistent"), item.persistent ? t("ui.yes") : ""), ...detail(t("ui.resolution"), item.resolution), ...detail(t("ui.beat"), item.beat)]));
  listed.push({ id: SIMPLIFIED_HOLLOW_ID, sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", kind: "Errata", name: t("ui.simplifiedHollow"), details: detail(t("ui.effect"), t("ui.simplifiedHollowHomebrewEffect")) });
  listed.sort((left, right) => left.name.localeCompare(right.name, locale));
  const sources = [...new Map(listed.map((item) => [item.sourceId, item.source])).entries()].sort((left, right) => left[1].localeCompare(right[1], locale));
  const toggle = (id: string, enabled: boolean, defaultDisabled = false) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled, defaultDisabled));
  const save = (definition: VampireBloodlineDefinition) => {
    saveBloodlineHomebrews(customBloodlines.some((item) => item.id === definition.id) ? customBloodlines.map((item) => item.id === definition.id ? definition : item) : [...customBloodlines, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const saveCatalog = (definition: VampireCatalogHomebrew) => {
    saveVampireCatalogHomebrews(customCatalog.some((item) => item.id === definition.id) ? customCatalog.map((item) => item.id === definition.id ? definition : item) : [...customCatalog, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const renderItem = (item: ListedHomebrew, sourceActive: boolean) => {
    const active = homebrewContentActive(preferences, item.id, item.sourceId, item.defaultDisabled);
    const children = listed.filter((entry) => entry.parentId === item.id);
    return <div key={item.id}><article className="homebrew-list-item"><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body">{item.details.map((entry, index) => <p key={`${entry.label}:${index}`}><strong>{entry.label}:</strong> {entry.text}</p>)}</div></details><label className="homebrew-toggle"><span>{active ? t("ui.activeMasculine") : t("ui.disabledMasculine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked, item.defaultDisabled)} aria-label={`${item.name}: ${active ? t("ui.activeLowercase") : t("ui.disabledLowercase")}`}/></label></article>{children.length > 0 && <div className="homebrew-item-list homebrew-subitem-list">{children.map((child) => renderItem(child, sourceActive && active))}</div>}</div>;
  };
  const playerGroups = [
    { id: "clan", label: t("ui.clans"), items: customCatalog.filter((item) => item.entryType === "clan"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("clan")) },
    { id: "bloodline", label: t("ui.bloodlines"), items: customBloodlines, create: () => { setEditingBloodline(null); setBloodlineEditorOpen(true); } },
    { id: "covenant", label: t("ui.covenants"), items: customCatalog.filter((item) => item.entryType === "covenant"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("covenant")) },
    { id: "discipline", label: t("ui.disciplines"), items: customCatalog.filter((item) => item.entryType === "discipline"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("discipline")) },
    { id: "devotion", label: t("ui.devotions"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "devotion"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "devotion")) },
    { id: "rites", label: t("ui.ritesAndMiracles"), items: customCatalog.filter((item) => item.entryType === "power" && ["cruac-rite", "theban-miracle", "kimiya-formula", "therion-sacrilege", "gilded-invocation"].includes(item.kind)), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "cruac-rite")) },
    { id: "coil", label: t("ui.coilsOfTheDragon"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "coil"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "coil")) },
    { id: "scale", label: t("ui.scalesOfTheDragon"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "scale"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "scale")) },
  ];
  const itemSummary = (item: VampireCatalogHomebrew | VampireBloodlineDefinition) => "summary" in item ? item.summary : "description" in item ? item.description : "baneSummary" in item ? item.baneSummary : "";
  return <>
    <MeritHomebrewPanel line="VtR" catalog={merits}/>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{t("ui.playerCreatedVampireContent")}</h3><p>{t("ui.playerCreatedVampireContentDescription")}</p></div></div>
      <div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{t("ui.clansAndPowers")}</span><Switch checked={!preferences.disabledIds.includes(VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{t("ui.bloodlines")}</span><Switch checked={!preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(BLOODLINE_HOMEBREW_SOURCE_ID, checked)}/></label></div>
      <Tabs defaultValue="clan" className="homebrew-kind-tabs"><TabsList variant="line" className="homebrew-kind-tabs-list">{playerGroups.map((group) => <TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{playerGroups.map((group) => <TabsContent key={group.id} value={group.id} className="homebrew-kind-panel"><div className="homebrew-source-toolbar"><strong>{group.label}</strong><Button type="button" size="sm" onClick={group.create}><Plus/> {t("ui.createAction")}</Button></div>{group.items.length === 0 ? <p>{t("ui.noPlayerCreatedItems")}</p> : <div className="homebrew-grid">{[...group.items].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
        const bloodline = "parentClan" in item, sourceId = bloodline ? BLOODLINE_HOMEBREW_SOURCE_ID : VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, sourceActive = !preferences.disabledIds.includes(sourceId), active = homebrewContentActive(preferences, item.id, sourceId);
        return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{itemSummary(item)}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? t("ui.activeMasculine") : t("ui.disabledMasculine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => bloodline ? (setEditingBloodline(item), setBloodlineEditorOpen(true)) : setEditingCatalog(item)}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteItemTitle")} description={t("ui.deleteItemDescription")} action={t("ui.deleteAction")} onConfirm={() => bloodline ? saveBloodlineHomebrews(customBloodlines.filter((entry) => entry.id !== item.id)) : saveVampireCatalogHomebrews(customCatalog.filter((entry) => entry.id !== item.id))}/></div></article>;
      })}</div>}</TabsContent>)}</Tabs>
      {bloodlineEditorOpen && <BloodlineHomebrewEditor open initial={editingBloodline} clans={reference.clans} onOpenChange={setBloodlineEditorOpen} onSave={save}/>}
      {editingCatalog && <VampireCatalogHomebrewEditor key={editingCatalog.id} initial={editingCatalog} onOpenChange={(open) => { if (!open) setEditingCatalog(null); }} onSave={saveCatalog}/>}
    </section>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{t("ui.publishedVampireHomebrew")}</h3><p>{t("ui.publishedVampireHomebrewDescription")}</p></div></div>
      <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
        const sourceItems = listed.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId), kinds = [...new Set(sourceItems.map((item) => item.kind))].sort((left, right) => categoryOrder.indexOf(left) - categoryOrder.indexOf(right));
        return <details className="panel homebrew-source" key={sourceId}><summary className="homebrew-source-summary"><div><Badge variant="outline">{t("workspace.homebrew")}</Badge><strong>{source}</strong><span>{sourceItems.length} {t("ui.implementedItems")}</span></div></summary><div className="homebrew-source-body"><Tabs defaultValue={kinds[0]} className="homebrew-kind-tabs"><div className="homebrew-source-toolbar"><TabsList variant="line" className="homebrew-kind-tabs-list" aria-label={t("ui.sourceCategories")}>{kinds.map((kind) => <TabsTrigger key={kind} value={kind}>{kind}</TabsTrigger>)}</TabsList><label className="homebrew-toggle"><span>{sourceActive ? t("ui.sourceActive") : t("ui.sourceDisabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? t("ui.activeLowercase") : t("ui.disabledLowercase")}`}/></label></div>{kinds.map((kind) => <TabsContent className="homebrew-kind-panel" value={kind} key={kind}><div className="homebrew-item-list">{sourceItems.filter((item) => item.kind === kind && !item.parentId).map((item) => renderItem(item, sourceActive))}</div></TabsContent>)}</Tabs></div></details>;
      })}</div>
    </section>
  </>;
}

export const vampireHomebrew: GameLineHomebrewModule = { Component: VampireHomebrew };
