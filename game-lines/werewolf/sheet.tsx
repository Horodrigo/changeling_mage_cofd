"use client";

import { useState } from "react";
import { CharacterPaperShell, EditableList, NotesArea, ResourceTrack, SheetField } from "@/app/workspace/character-paper-shell";
import { MainSheet, MainPowerStat } from "@/app/workspace/main-sheet";
import { HealthTrack, SheetHeading, TraitBlock, DotValue } from "@/app/workspace/sheet-primitives";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { CombatPage } from "@/app/workspace/combat-page";
import { ConditionManager, type ConditionDefinition, type SelectedCondition } from "@/app/workspace/condition-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RuleSelect } from "@/app/workspace/rule-select";
import { useIsMobile } from "@/hooks/use-mobile";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import type { GameLineSheetModule, GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { meritPresentation } from "@/lib/merit-presentation";
import { normalizeDamage } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { derivedTraitsWithArmor } from "@/lib/combat-equipment";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import type { WerewolfFetishCatalog } from "./catalogs/fetishes";
import { FetishInventory } from "./fetishes";
import { fetishSelections } from "./fetish-rules";
import { TotemEditor } from "./totem";
import { personalTotemPoints, totemSelection, totemState } from "./totem-rules";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { boundedHarmony, boundedPrimalUrge, primalUrgeLevel } from "./creation-rules";
import { resolveWerewolfMerits, werewolfMeritDefinition } from "./creation-grants";
import { renownRatings, werewolfFormId, werewolfFormTraits, werewolfIds, werewolfMemberTraits } from "./rules";
import { FormsTable, FormSelector, MobileForm } from "./forms-table";
import { HarmonyTrack } from "./harmony";
import { AnchorDetails } from "./anchors";
import { PrimalUrgeLimits, WerewolfPassives } from "./passives";
import { FacetRules } from "./creation-gifts";
import { RiteRules } from "./creation-rites";
import { RENOWN_IDS } from "./mechanics";
import { favoredFormPenalties, WEREWOLF_MERIT_CONFIGURATION_IDS } from "./merit-rules";
import { WerewolfExperiencePanel } from "./experience-panel";
import { knownWerewolfFacets } from "./gift-progression";
import { changeWerewolfForm, changeWerewolfTotem } from "./form-state";
import { TotemAdvantageEditor } from "./totem-advantage";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS } from "@/app/builder/common-merit-configurations";
import { INTERDISCIPLINARY_SPECIALTY_ID } from "@/lib/core/character/specialty-merits";
import { commonExpandedConfigurationLines } from "@/app/workspace/merit-configuration-presentation";
import "./styles/sheet.css";
import "./styles/mobile.css";

export function WerewolfCharacterPaper({ character, updateState, updateSheet, catalogs }: GameLineSheetProps) {
  const { locale, t } = useLanguage();
  const mobile = useIsMobile();
  const [tabs, setTabs] = useState({ characterId: character.id, mobile: "summary", desktop: "main" });
  const [powerSearch, setPowerSearch] = useState(""), [powerKind, setPowerKind] = useState("all");
  if (character.game_line !== "WtF") throw new Error("Werewolf sheet received another game line.");
  if (!catalogs) throw new Error("Werewolf sheet requires its catalog snapshot.");
  const reference = catalogs.get<WerewolfReferenceCatalog>("werewolf-reference");
  const gifts = catalogs.get<WerewolfGiftCatalog>("werewolf-gifts");
  const rites = catalogs.get<WerewolfRiteCatalog>("werewolf-rites");
  const fetishes = catalogs.get<WerewolfFetishCatalog>("werewolf-fetishes");
  const totem = catalogs.get<WerewolfTotemCatalog>("werewolf-totem");
  const merits = [...catalogs.get<MeritDefinition[]>("core-merits"), ...catalogs.get<MeritDefinition[]>("werewolf-merits")];
  const core = catalogs.get<{ conditions: ConditionDefinition[]; presentation: Record<string, Partial<ConditionDefinition>> }>("core-reference");
  const data = character.line_data, state = character.current_state;
  const selectedTotem = totemSelection(data.totem);
  const setState = (key: string, value: unknown) => updateState({ ...state, [key]: value });
  const setLine = (key: string, value: unknown) => updateSheet({ ...character, line_data: { ...data, [key]: value } });
  const benefitCatalogs = { reference, gifts, merits, totem };
  const member = werewolfMemberTraits(character, benefitCatalogs);
  const setForm = (value: string) => updateState(changeWerewolfForm(character, value, benefitCatalogs));
  const currentForm = werewolfFormId(state.form);
  const hishu = werewolfFormTraits(character, "hishu", benefitCatalogs), activeForm = werewolfFormTraits(character, currentForm, benefitCatalogs);
  const damage = normalizeDamage(state.health_damage, Math.max(activeForm.health, Array.isArray(state.health_damage) ? state.health_damage.length : 0));
  const primalUrge = boundedPrimalUrge(data.primal_urge), limits = primalUrgeLevel(reference, primalUrge);
  const derived = { ...character.derived, Size: activeForm.size, Health: activeForm.health, Defense: activeForm.defense, Initiative: activeForm.initiative, Speed: activeForm.speed };
  const armor = derivedTraitsWithArmor(derived, data.combat_armor).Armor;
  const displayedDerived = { ...derived, Armor: activeForm.armorGeneral || activeForm.armorBallistic
    ? t("werewolf.naturalAndEquipmentArmor", { natural: `${activeForm.armorGeneral}/${activeForm.armorBallistic}`, equipment: armor }) : armor };
  const ownMerits = resolveWerewolfMerits(member.merits, merits);
  const conditions: SelectedCondition[] = Array.isArray(state.conditions) ? state.conditions.flatMap(item => item && typeof item === "object" && typeof item.id === "string"
    ? [{ ...item, id: item.id, persistent: Boolean(item.persistent), instanceId: typeof item.instanceId === "string" ? item.instanceId : undefined }] : []) : [];
  const conditionCatalog = core.conditions.map(item => locale === "pt-BR" ? { ...item, ...core.presentation[item.id] } : item);
  const name = (id: unknown, records: readonly { id: string; name: string }[]) => {
    const definition = records.find(item => item.id === id);
    return definition ? locale === "pt-BR" ? reference.presentation[definition.id]?.name ?? definition.name : definition.name : String(id ?? "");
  };
  const identity = <section className="sheet-identity-grid">
    <SheetField label={t("ui.characterName")} value={character.character.name}/><SheetField label={t("werewolf.auspice")} value={name(data.auspice_id, reference.auspices)}/><SheetField label={t("ui.chronicle")} value={character.character.chronicle}/>
    <SheetField label={t("ui.player")} value={character.character.player}/><SheetField label={t("werewolf.tribe")} value={name(data.tribe_id, reference.tribes)}/><SheetField label={t("ui.concept")} value={character.character.concept}/>
    <SheetField label={t("werewolf.blood")} value={name(data.blood, reference.anchors)}/><SheetField label={t("werewolf.bone")} value={name(data.bone, reference.anchors)}/>
  </section>;
  const attributes = <><SheetHeading>{t("ui.attributes")}</SheetHeading><p className="wtf-trait-note">{t("werewolf.hishuTraits")}</p><div className={mobile ? "mobile-attribute-grid" : "official-trait-grid"}>{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={hishu.attributes} compactNames={mobile}/>)}</div></>;
  const skills = <><SheetHeading>{t("ui.skills")}</SheetHeading><div className="wtf-skill-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={member.skills} specialties={member.specializations} subtitle={category === "Mental" ? t("ui.message3IfUntrained") : t("ui.message1IfUntrained")}/>)}</div></>;
  const health = <><div className="panel-heading wtf-health-heading"><SheetHeading>{t("ui.health")}</SheetHeading><FormSelector value={currentForm} onChange={setForm} reference={reference}/></div>
    <HealthTrack health={activeForm.health} damage={damage} onChange={value => setState("health_damage", value)}/>
    {damage.length > activeForm.health && <p>{t("werewolf.preservedDamage", { amount: damage.length - activeForm.health })}</p>}</>;
  const willpower = <><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} maximum={hishu.willpower} current={Math.max(0, Math.min(hishu.willpower, Number(state.willpower_current ?? hishu.willpower)))} onChange={value => setState("willpower_current", value)}/></>;
  const essence = <><SheetHeading>{t("werewolf.essence")}</SheetHeading><ResourceTrack label={t("werewolf.essence")} maximum={limits.essenceMaximum} perTurn={limits.essencePerTurn} current={Math.max(0, Math.min(limits.essenceMaximum, Number(state.essence_current ?? 0)))} onChange={value => setState("essence_current", value)} displayMinimum={20}/></>;
  const harmony = <HarmonyTrack value={boundedHarmony(data.harmony)} onChange={value => setLine("harmony", value)} touchstones={{ physical: String(data.physical_touchstone ?? ""), spiritual: String(data.spiritual_touchstone ?? "") }}
    onTouchstoneChange={(kind, value) => setLine(kind === "physical" ? "physical_touchstone" : "spiritual_touchstone", value)} reference={reference}/>;
  const powerStat = <><MainPowerStat label={t("werewolf.primalUrge")} value={primalUrge}/><PrimalUrgeLimits reference={reference} rating={primalUrge} harmony={boundedHarmony(data.harmony)}/></>;
  const renown = renownRatings(data.renown);
  const renownBlock = <div className="wtf-renown">{RENOWN_IDS.map(id => <div className="sheet-merit-main" key={id}><span>{t(`werewolf.renownNames.${id}`)}</span><DotValue value={renown[id]}/></div>)}</div>;
  const meritList = <div className="sheet-merits single-column">{member.merits.map((selection, index) => {
    const definition = werewolfMeritDefinition(selection, merits), text = definition ? meritPresentation(definition, locale) : null;
    const configured = selection.grantedBy === "werewolf:totem-advantage" && typeof selection.configuration?.skill === "string"
      ? [systemTerm(selection.configuration.skill, locale), selection.configuration.specialty].filter(Boolean).join(": ") : meritConfigurationTitle(selection.configuration);
    const fieldLabels = { attribute: "attribute", secondAttribute: "secondAttribute", physicalSkill: "physicalSkill", advancedSkill: "advancedSkill", skill: "moonSkill", penaltySkill: "penaltySkill", virtue: "virtue", touchstone: "touchstone", anchor: "anchor", safePlaceId: "safePlace", giftId: "gift" } as const;
    const choiceText = (key: keyof typeof fieldLabels, value: string) => {
      if (key === "touchstone") return value === "physical" ? t("werewolf.physicalTouchstone") : value === "spiritual" ? t("werewolf.spiritualTouchstone") : value;
      if (key === "anchor") return value === "blood" ? t("werewolf.blood") : value === "bone" ? t("werewolf.bone") : value;
      if (key === "giftId") { const gift = gifts.gifts.find(item => item.id === value); return gift ? locale === "pt-BR" ? gifts.presentation[value]?.name ?? gift.name : gift.name : value; }
      if (key === "safePlaceId") { const place = character.merits.find(item => item.instanceId === value); return place ? meritConfigurationTitle(place.configuration) || value : value; }
      return key === "virtue" ? value : systemTerm(value, locale);
    };
    return <details className="wtf-rule-disclosure" key={selection.instanceId ?? index}><summary><span>{text?.name ?? selection.name}{configured ? `: ${configured}` : ""}</span><DotValue value={selection.dots}/></summary>
      {selection.grantedBy === "werewolf:totem-advantage" && <p className="wtf-rule-field"><strong>{t("ui.source")}:</strong>{" "}{t("werewolf.totemAdvantage")}</p>}
      {text?.prerequisites && <p className="wtf-rule-field"><strong>{t("ui.prerequisites")}:</strong>{" "}{text.prerequisites}</p>}
      {text && <p className="wtf-rule-field">{text.description}</p>}
      {text?.levels?.filter(level => level.rating <= selection.dots).map((level, levelIndex) => <p className="wtf-rule-field" key={levelIndex}><strong>{level.rating} · {level.name}:</strong>{" "}{level.description}</p>)}
      {selection.configuration?.form && <p className="wtf-rule-field"><strong>{t("werewolf.meritChoice.form")}:</strong>{" "}{name(selection.configuration.form, reference.forms)}</p>}
      {selection.configuration?.attack && <p className="wtf-rule-field"><strong>{t("werewolf.meritChoice.attack")}:</strong>{" "}{selection.configuration.attack === "bite" ? t("werewolf.meritChoice.bite") : t("werewolf.meritChoice.claws")}</p>}
      {definition && WEREWOLF_MERIT_CONFIGURATION_IDS.has(definition.id) && <>
        {(Object.keys(fieldLabels) as Array<keyof typeof fieldLabels>).map(key => { const value = selection.configuration?.[key]; return typeof value === "string" && value
          ? <p className="wtf-rule-field" key={key}><strong>{t(`werewolf.meritChoice.${fieldLabels[key]}`)}:</strong>{" "}{choiceText(key, value)}</p> : null; })}
        {favoredFormPenalties(selection.configuration).map((penalty, row) => <p className="wtf-rule-field" key={row}><strong>{t("werewolf.meritChoice.penalty", { dot: row + 1 })}:</strong>{" "}{name(penalty.formId, reference.forms)} · {systemTerm(penalty.attribute, locale)} −1</p>)}
      </>}
      {definition?.id === INTERDISCIPLINARY_SPECIALTY_ID && <>
        {commonExpandedConfigurationLines(definition.id, selection.dots, selection.configuration, locale, merits)?.map(line => <p key={line}>{line}</p>)}
        <MeritConfigurationEditor merit={selection} catalog={merits} definitions={COMMON_MERIT_CONFIGURATIONS} specialtyContext={{ specializations: member.specializations, skills: member.skills }} onChange={configuration => {
          const next = structuredClone(character); const candidates = next.merits.filter(item => selection.instanceId ? item.instanceId === selection.instanceId :
            !item.instanceId && werewolfMeritDefinition(item, merits)?.id === INTERDISCIPLINARY_SPECIALTY_ID);
          const target = candidates.length === 1 ? candidates[0] : undefined;
          if (target) { target.configuration = configuration; updateSheet(next); }
        }} />
      </>}
      {definition && <small>{t("conditions.sourcePage", { source: definition.source, page: definition.page })}</small>}
    </details>;
  })}</div>;
  const aspirationList = <EditableList values={werewolfIds(data.aspirations)} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={value => setLine("aspirations", value)}/>;
  const conditionList = <ConditionManager selected={conditions} catalog={conditionCatalog} onChange={value => setState("conditions", value)}/>;
  const experience = <WerewolfExperiencePanel character={character} catalogs={catalogs} updateSheet={updateSheet} updateState={updateState}/>;
  const anchors = <>
    <SheetHeading>{t("werewolf.anchors")}</SheetHeading>
    {reference.anchors.filter(anchor => anchor.id === data.blood || anchor.id === data.bone).map(anchor => <AnchorDetails key={anchor.id} anchor={anchor} reference={reference}/>)}
  </>;
  const forms = <>
    {mobile ? <MobileForm character={member} reference={reference} merits={ownMerits} value={currentForm} onChange={setForm}/>
      : <FormsTable character={member} reference={reference} merits={ownMerits}/>}
    <WerewolfPassives reference={reference} harmony={boundedHarmony(data.harmony)}/>
  </>;
  const powers = <>
    <div className="catalog-filters wtf-power-filters"><Input value={powerSearch} onChange={event => setPowerSearch(event.target.value)} aria-label={t("werewolf.searchPowers")} placeholder={t("werewolf.searchPowers")}/>
      <label>{t("ui.type")}<RuleSelect value={powerKind} onChange={setPowerKind} options={[
        { value: "all", label: t("ui.all"), localized: true }, { value: "moon", label: t("werewolf.moonGift"), localized: true },
        { value: "shadow", label: t("werewolf.shadowGift"), localized: true }, { value: "wolf", label: t("werewolf.wolfGift"), localized: true },
        { value: "wolf-rite", label: t("werewolf.wolfRites"), localized: true }, { value: "pack-rite", label: t("werewolf.packRites"), localized: true },
      ]}/></label>
    </div>
    <SheetHeading>{t("werewolf.gifts")}</SheetHeading>
    {[...new Set(knownWerewolfFacets(character))].map(id => {
      const parent = gifts.gifts.find(gift => gift.facets.some(facet => facet.id === id)), facet = parent?.facets.find(item => item.id === id);
      const facetName = facet ? locale === "pt-BR" ? gifts.presentation[id]?.name ?? facet.name : facet.name : id;
      const giftName = parent ? locale === "pt-BR" ? gifts.presentation[parent.id]?.name ?? parent.name : parent.name : "";
      if (facet && parent && ((powerKind !== "all" && powerKind !== parent.kind) || !`${facetName} ${giftName} ${facet.source}`.toLocaleLowerCase(locale).includes(powerSearch.trim().toLocaleLowerCase(locale)))) return null;
      return facet ? <details className="wtf-rule-disclosure" key={id}><summary>{facetName} · {giftName} · {t(`werewolf.renownNames.${facet.renown}`)}</summary><FacetRules facet={facet} gifts={gifts}/></details> : <p key={id}>{t("werewolf.missingSelectedFacet", { id })}</p>;
    })}
    <SheetHeading>{t("werewolf.rites")}</SheetHeading>
    {[...new Set([...werewolfIds(data.creation_rites), ...werewolfIds(data.learned_rites)])].map(id => {
      const rite = rites.rites.find(item => item.id === id);
      const riteName = rite ? locale === "pt-BR" ? rites.presentation.rites[id]?.name ?? rite.name : rite.name : id;
      if (rite && ((powerKind !== "all" && powerKind !== `${rite.kind}-rite`) || !`${riteName} ${rite.source}`.toLocaleLowerCase(locale).includes(powerSearch.trim().toLocaleLowerCase(locale)))) return null;
      return rite ? <details className="wtf-rule-disclosure" key={id}><summary>{locale === "pt-BR" ? rites.presentation.rites[id]?.name ?? rite.name : rite.name} · {rite.dots}</summary><RiteRules rite={rite} catalog={rites}/></details> : <p key={id}>{t("werewolf.missingSelectedRite", { id })}</p>;
    })}
    <FetishInventory value={fetishSelections(data.fetishes)} onChange={value => setLine("fetishes", value)} catalog={fetishes} gifts={gifts}/>
    <TotemEditor value={selectedTotem} onChange={value => updateSheet(changeWerewolfTotem(character, value, benefitCatalogs))} personalPoints={personalTotemPoints(character.merits, merits)} catalog={totem}
      state={selectedTotem ? totemState(state.werewolf_totem, selectedTotem.instanceId) : undefined} onStateChange={value => setState("werewolf_totem", value)}>
      {selectedTotem && <TotemAdvantageEditor character={character} value={selectedTotem} onChange={value => updateSheet(changeWerewolfTotem(character, value, benefitCatalogs))} catalogs={benefitCatalogs}/>}
    </TotemEditor>
  </>;
  const notes = <><SheetHeading>{t("ui.notes")}</SheetHeading><NotesArea value={String(state.notes ?? "")} onChange={value => setState("notes", value)}/></>;
  const activeTab = tabs.characterId === character.id ? mobile ? tabs.mobile : tabs.desktop : mobile ? "summary" : "main";
  const setTab = (value: string) => setTabs(previous => ({ ...previous, characterId: character.id, [mobile ? "mobile" : "desktop"]: value }));
  const frame = <div className="wtf-frame" aria-hidden="true">
    <span className="wtf-frame-corner" /><span className="wtf-frame-corner" /><span className="wtf-frame-corner" /><span className="wtf-frame-corner" />
    <span className="wtf-frame-rail wtf-frame-rail-top" /><span className="wtf-frame-rail wtf-frame-rail-bottom" />
    <span className="wtf-frame-rail wtf-frame-rail-left" /><span className="wtf-frame-rail wtf-frame-rail-right" />
  </div>;
  if (mobile) return <CharacterPaperShell line="WtF" mobile title={t("werewolf.title")} subtitle={t("werewolf.forsaken")}>
    {frame}
    <SwipeableSheetTabs value={activeTab} onValueChange={setTab} tabs={[
      { value: "summary", label: t("ui.summary") }, { value: "stats", label: t("werewolf.traitsTab") },
      { value: "details", label: t("ui.details") }, { value: "forms", label: t("werewolf.forms") },
      { value: "powers", label: t("ui.powers") }, { value: "combat", label: t("ui.combat") }, { value: "notes", label: t("werewolf.notesTab") },
    ]}>{{
      summary: <>{identity}{experience}<SheetHeading>{t("ui.aspirations")}</SheetHeading>{aspirationList}</>,
      stats: <>{attributes}{skills}</>,
      details: <><SheetHeading>{t("werewolf.renown")}</SheetHeading>{renownBlock}<SheetHeading>{t("ui.merits")}</SheetHeading>{meritList}{anchors}{harmony}<SheetHeading>{t("ui.conditions")}</SheetHeading>{conditionList}</>,
      forms,
      powers: <>{powerStat}{essence}{powers}</>,
      combat: <>{health}{willpower}<CombatPage character={character} derived={derived} updateSheet={updateSheet}/></>,
      notes,
    }}</SwipeableSheetTabs>
  </CharacterPaperShell>;
  return <CharacterPaperShell line="WtF" title={t("werewolf.title")} subtitle={t("werewolf.forsaken")}>
    {frame}
    <Tabs value={activeTab} onValueChange={setTab}><TabsList className="ctl-sheet-tab-list" aria-label={t("ui.characterPages")}>
      <TabsTrigger value="main">{t("ui.main")}</TabsTrigger><TabsTrigger value="forms">{t("werewolf.forms")}</TabsTrigger><TabsTrigger value="details">{t("ui.details")}</TabsTrigger><TabsTrigger value="combat">{t("ui.combat")}</TabsTrigger><TabsTrigger value="notes">{t("ui.notes")}</TabsTrigger>
    </TabsList><TabsContent value="main" className="ctl-sheet-page"><MainSheet className="wtf-main-body" identity={identity} attributes={attributes} skills={skills} specificPowers={renownBlock} specificPowersTitle={t("werewolf.renown")} merits={meritList} aspirations={aspirationList} aspirationsAfterExperience lineSections={harmony} conditions={conditionList}
      health={health} willpower={willpower} powerStat={powerStat} fuel={essence} stability={null} derived={displayedDerived} armorId={data.combat_armor} experience={experience}/></TabsContent>
      <TabsContent value="forms" className="ctl-sheet-page wtf-forms-page">{forms}</TabsContent>
      <TabsContent value="details" className="ctl-sheet-page powers-page">{anchors}{powers}</TabsContent>
      <TabsContent value="combat" className="ctl-sheet-page powers-page"><CombatPage character={character} derived={derived} updateSheet={updateSheet}/></TabsContent>
      <TabsContent value="notes" className="ctl-sheet-page powers-page">{notes}</TabsContent>
    </Tabs>
  </CharacterPaperShell>;
}

export const werewolfSheet: GameLineSheetModule = { Component: WerewolfCharacterPaper };
