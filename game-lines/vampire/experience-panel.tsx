"use client";

import { useEffect, useMemo, useState } from "react";
import { History, RotateCcw, ShoppingBag } from "lucide-react";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { BeatTrack, ExperienceMeritPicker } from "@/app/workspace/experience-shared";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { useLanguage } from "@/lib/i18n";
import { meritContextForSheet, meritPrerequisitesMet, type MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { VampirePowers, VampireReference, VampirePurchasablePower } from "./catalog-types";
import { recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived } from "./creation-rules";
import { VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "discipline" | "blood-potency" | "humanity" | "willpower" | "devotion" | "cruac" | "theban" | "ritual" | "coil" | "scale";
type HistoryEntry = { id: string; label: string; cost: number; createdAt: string; before: CharacterSheet; undo?: Record<string, unknown> };

const PURCHASES: PurchaseType[] = ["attribute", "skill", "specialty", "merit", "discipline", "blood-potency", "humanity", "willpower", "devotion", "cruac", "theban", "ritual", "coil", "scale"];

function purchaseLabel(type: PurchaseType, locale: string) {
  const labels: Record<PurchaseType, [string, string]> = {
    attribute: ["Atributo", "Attribute"], skill: ["Perícia", "Skill"], specialty: ["Especialização", "Specialty"], merit: ["Mérito", "Merit"],
    discipline: ["Disciplina", "Discipline"], "blood-potency": ["Potência de Sangue", "Blood Potency"], humanity: ["Humanidade", "Humanity"], willpower: ["Ponto perdido de Força de Vontade", "Lost Willpower dot"],
    devotion: ["Devoção", "Devotion"], cruac: ["Crúac", "Crúac"], theban: ["Feitiçaria Tebana", "Theban Sorcery"], ritual: ["Ritual ou Milagre", "Ritual or Miracle"], coil: ["Espiral do Dragão", "Coil of the Dragon"], scale: ["Escala do Dragão", "Scale of the Dragon"],
  };
  return labels[type][locale === "pt-BR" ? 0 : 1];
}

function powerName(item: VampirePurchasablePower, locale: string) { return locale === "pt-BR" ? item.translatedName : item.name; }

function disciplinePrerequisitesMet(prerequisites: string | undefined, disciplines: Record<string, number>) {
  if (!prerequisites) return true;
  return prerequisites.split(",").every((clause) => {
    const name = VAMPIRE_DISCIPLINES.find((discipline) => clause.toLocaleLowerCase().includes(discipline.toLocaleLowerCase()));
    if (!name) return true;
    const required = [...clause].filter((character) => character === "•").length;
    return Number(disciplines[name] ?? 0) >= required;
  });
}

function coilPrerequisiteMet(prerequisites: string | undefined, ratings: Record<string, number>) {
  const match = prerequisites?.match(/(coil-[a-z-]+)\s+(\d+)/i);
  return !match || Number(ratings[match[1]] ?? 0) >= Number(match[2]);
}

export function VampireExperiencePanel({ character, updateSheet, catalogs }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; catalogs: CatalogSnapshot }) {
  const { locale, tr } = useLanguage();
  const state = character.current_state;
  const available = Math.max(0, Math.trunc(Number(state.experience_available ?? 0)));
  const spent = Math.max(0, Math.trunc(Number(state.experience_spent ?? 0)));
  const total = Math.max(available + spent, Math.max(0, Math.trunc(Number(state.experience_total ?? 0))));
  const beats = Math.max(0, Math.min(5, Math.trunc(Number(state.beats ?? 0))));
  const history = Array.isArray(state.vampire_experience_history) ? state.vampire_experience_history as HistoryEntry[] : [];
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const meritCatalog = useMemo(() => [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")], [catalogs]);
  const [amount, setAmount] = useState(String(available));
  const [purchase, setPurchase] = useState<PurchaseType>("attribute");
  const [target, setTarget] = useState("");
  const [specialtyName, setSpecialtyName] = useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [meritInstance, setMeritInstance] = useState(-1);
  const [meritConfiguration, setMeritConfiguration] = useState<MeritConfiguration>({});
  const [teacherConfirmed, setTeacherConfirmed] = useState(false);
  const [feedback, setFeedback] = useState("");
  useEffect(() => setAmount(String(available)), [available]);
  const clan = reference.clans.find((item) => item.id === character.line_data.clan_id);
  const covenant = String(character.line_data.covenant_id ?? "covenantless");
  const covenantDefinition = reference.covenants.find((item) => item.id === covenant);
  const covenantStatus = covenantDefinition ? vampireCovenantStatus(character, covenant, covenantDefinition.name, covenantDefinition.translatedName) : 0;
  const disciplines = recordRatings(character.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const bloodSorcery = character.line_data.blood_sorcery && typeof character.line_data.blood_sorcery === "object" ? character.line_data.blood_sorcery as Record<string, unknown> : {};
  const ordo = character.line_data.ordo_dracul && typeof character.line_data.ordo_dracul === "object" ? character.line_data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" ? ordo.coil_ratings as Record<string, number> : {};
  const meritContext = meritContextForSheet(character, meritCatalog, ["vampire", String(character.line_data.clan_id ?? ""), covenant]);
  const knownDevotions = new Set(Array.isArray(character.line_data.devotion_ids) ? character.line_data.devotion_ids.map(String) : []);
  const knownRites = new Set([...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), ...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : [])].map(String));
  const knownScales = new Set(Array.isArray(ordo.scale_ids) ? ordo.scale_ids.map(String) : []);
  const covenantPowers = covenant === "circle-of-the-crone" ? powers.cruacRites : covenant === "lancea-et-sanctum" ? powers.thebanMiracles : [];
  const options = (() => {
    if (purchase === "attribute") return Object.values(ATTRIBUTES).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "skill" || purchase === "specialty") return Object.values(SKILLS).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "merit") return target ? [{ value: target, label: meritCatalog.find((item) => item.id === target)?.name ?? target }] : [];
    if (purchase === "discipline") return VAMPIRE_DISCIPLINES.map((name) => ({ value: name, label: name }));
    if (purchase === "devotion") return powers.devotions.filter((item) => !knownDevotions.has(item.id) && disciplinePrerequisitesMet(item.prerequisites, disciplines)).map((item) => ({ value: item.id, label: powerName(item, locale) }));
    if (purchase === "cruac") { const next = Number(bloodSorcery.cruac_rating ?? 0) + 1; return powers.cruacRites.filter((item) => !knownRites.has(item.id) && Number(item.rating ?? 0) <= next).map((item) => ({ value: item.id, label: `${powerName(item, locale)} (${tr("rito gratuito", "free rite")})` })); }
    if (purchase === "theban") { const next = Number(bloodSorcery.theban_rating ?? 0) + 1; return powers.thebanMiracles.filter((item) => !knownRites.has(item.id) && Number(item.rating ?? 0) <= next && Number(character.line_data.humanity ?? 7) >= Number(item.rating ?? 0)).map((item) => ({ value: item.id, label: `${powerName(item, locale)} (${tr("milagre gratuito", "free miracle")})` })); }
    if (purchase === "ritual") return covenantPowers.filter((item) => !knownRites.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) }));
    if (purchase === "coil") return powers.coils.map((item) => ({ value: item.id, label: powerName(item, locale) }));
    if (purchase === "scale") return powers.scales.filter((item) => !knownScales.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) }));
    return [{ value: purchase, label: purchaseLabel(purchase, locale) }];
  })();
  const chosen = purchase === "merit" ? target : options.some((item) => item.value === target) ? target : options[0]?.value ?? "";
  const selectedMerit = meritCatalog.find((item) => item.id === chosen);
  const ownedMerit = meritInstance >= 0 ? character.merits[meritInstance] : undefined;
  const nextMeritRating = selectedMerit ? meritDots : undefined;
  const selectedPower = [...powers.devotions, ...covenantPowers, ...powers.coils, ...powers.scales].find((item) => item.id === chosen);
  const currentDiscipline = Number(disciplines[chosen] ?? 0);
  const humanityMaximum = Math.max(0, 10 - Number(bloodSorcery.cruac_rating ?? 0));
  const mysteryId = String(ordo.mystery_id ?? "");
  const coilInMystery = Boolean(mysteryId) && chosen === `coil-${mysteryId}`;
  const cost = purchase === "attribute" ? 4 : purchase === "skill" ? 2 : purchase === "specialty" ? 1 : purchase === "merit" ? Math.max(0, Number(nextMeritRating ?? 0) - Number(ownedMerit?.dots ?? 0)) : purchase === "discipline" ? (clan?.disciplines.includes(chosen) ? 3 : 4) : purchase === "blood-potency" ? 5 : purchase === "humanity" ? 2 : purchase === "willpower" ? 1 : purchase === "devotion" ? Number(selectedPower?.experienceCost ?? 0) : purchase === "cruac" || purchase === "theban" ? 4 : purchase === "ritual" ? 2 : purchase === "coil" ? (coilInMystery ? 3 : 4) : purchase === "scale" ? (coilPrerequisiteMet(selectedPower?.prerequisites, coilRatings) ? 1 : 2) : 0;
  const limit = Math.max(5, Number(character.derived.LimiteDeCaracteristica ?? 5));
  const teacherRequired = purchase === "discipline" && !clan?.disciplines.includes(chosen) && ["Auspex", "Dominate", "Majesty", "Nightmare", "Protean"].includes(chosen);
  const meritUnavailable = purchase === "merit" && (!selectedMerit || !nextMeritRating || (selectedMerit.name === "Kindred Status" && !String(meritConfiguration.group ?? "").trim()) || !meritPrerequisitesMet(selectedMerit, { ...meritContext, selectedDots: nextMeritRating, configuration: meritConfiguration }));
  const unavailable = !chosen || cost < 1 || meritUnavailable || (purchase === "attribute" && Number(character.attributes[chosen] ?? 1) >= limit) || (purchase === "skill" && Number(character.skills[chosen] ?? 0) >= limit) || (purchase === "discipline" && (currentDiscipline >= limit || (teacherRequired && !teacherConfirmed))) || (purchase === "blood-potency" && Number(character.line_data.blood_potency ?? 1) >= 10) || (purchase === "humanity" && Number(character.line_data.humanity ?? 7) >= humanityMaximum) || (purchase === "willpower" && Number(state.willpower_lost_dots ?? 0) < 1) || (purchase === "specialty" && !specialtyName.trim()) || (purchase === "cruac" && (covenant !== "circle-of-the-crone" || covenantStatus < 1 || Number(bloodSorcery.cruac_rating ?? 0) >= 5)) || (purchase === "theban" && (covenant !== "lancea-et-sanctum" || covenantStatus < 1 || Number(bloodSorcery.theban_rating ?? 0) >= 5)) || ((purchase === "coil" || purchase === "scale") && (covenant !== "ordo-dracul" || covenantStatus < 1)) || (purchase === "coil" && (Number(coilRatings[chosen] ?? 0) >= 5 || (!coilInMystery && Number(coilRatings[chosen] ?? 0) >= covenantStatus))) || (purchase === "ritual" && (covenantStatus < 1 || Number(selectedPower?.rating ?? 0) > Number(covenant === "circle-of-the-crone" ? bloodSorcery.cruac_rating ?? 0 : bloodSorcery.theban_rating ?? 0)));
  const saveState = (patch: Record<string, unknown>) => { const next = structuredClone(character); next.current_state = { ...next.current_state, ...patch }; updateSheet(next); };
  const buy = () => {
    if (unavailable || available < cost) return setFeedback(tr("Compra indisponível ou Experiência insuficiente.", "Purchase unavailable or insufficient Experience."));
    const before = structuredClone(character);
    before.current_state = { ...before.current_state, vampire_experience_history: [] };
    const next = structuredClone(character);
    let label = options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale);
    if (purchase === "attribute") next.attributes[chosen] = Number(next.attributes[chosen] ?? 1) + 1;
    else if (purchase === "skill") next.skills[chosen] = Number(next.skills[chosen] ?? 0) + 1;
    else if (purchase === "specialty") { next.specializations.push({ skill: chosen, name: specialtyName.trim() }); label = `${systemTerm(chosen, locale)}: ${specialtyName.trim()}`; }
    else if (purchase === "merit" && selectedMerit && nextMeritRating) {
      if (meritInstance >= 0 && next.merits[meritInstance]?.name === selectedMerit.name) next.merits[meritInstance] = { ...next.merits[meritInstance], dots: nextMeritRating, experienceDots: Number(next.merits[meritInstance].experienceDots ?? 0) + cost, configuration: normalizeMeritConfiguration(meritConfiguration) };
      else next.merits.push({ instanceId: createRandomId(), name: selectedMerit.name, dots: nextMeritRating, creationDots: 0, experienceDots: nextMeritRating, sourceId: selectedMerit.sourceId, source: selectedMerit.source, configuration: normalizeMeritConfiguration(meritConfiguration) });
    } else if (purchase === "discipline") next.line_data.disciplines = { ...disciplines, [chosen]: currentDiscipline + 1 };
    else if (purchase === "blood-potency") next.line_data.blood_potency = Number(next.line_data.blood_potency ?? 1) + 1;
    else if (purchase === "humanity") next.line_data.humanity = Number(next.line_data.humanity ?? 7) + 1;
    else if (purchase === "willpower") next.current_state.willpower_lost_dots = Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) - 1);
    else if (purchase === "devotion") next.line_data.devotion_ids = [...knownDevotions, chosen];
    else if (purchase === "cruac") { const rating = Number(bloodSorcery.cruac_rating ?? 0) + 1; next.line_data.blood_sorcery = { ...bloodSorcery, cruac_rating: rating, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), chosen] }; next.line_data.humanity = Math.min(Number(next.line_data.humanity ?? 7), 10 - rating); }
    else if (purchase === "theban") next.line_data.blood_sorcery = { ...bloodSorcery, theban_rating: Number(bloodSorcery.theban_rating ?? 0) + 1, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), chosen] };
    else if (purchase === "ritual") next.line_data.blood_sorcery = covenant === "circle-of-the-crone" ? { ...bloodSorcery, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), chosen] } : { ...bloodSorcery, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), chosen] };
    else if (purchase === "coil") next.line_data.ordo_dracul = { ...ordo, coil_ratings: { ...coilRatings, [chosen]: Number(coilRatings[chosen] ?? 0) + 1 } };
    else if (purchase === "scale") next.line_data.ordo_dracul = { ...ordo, scale_ids: [...knownScales, chosen] };
    const nextDisciplines = recordRatings(next.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
    next.derived = vampireDerived(next.attributes, next.skills, nextDisciplines, Number(next.line_data.blood_potency ?? 1), reference);
    const undo = purchase === "attribute" ? { kind: "trait", group: "attributes", name: chosen }
      : purchase === "skill" ? { kind: "trait", group: "skills", name: chosen }
      : purchase === "specialty" ? { kind: "specialty", skill: chosen, name: specialtyName.trim() }
      : undefined;
    const entry: HistoryEntry = { id: createRandomId(), label, cost, createdAt: new Date().toISOString(), before, undo };
    next.current_state = { ...next.current_state, experience_available: available - cost, experience_spent: spent + cost, experience_total: total, vampire_experience_history: [...history, entry] };
    updateSheet(next); setFeedback(tr("Compra registrada.", "Purchase recorded.")); setSpecialtyName(""); setTeacherConfirmed(false);
  };
  const undo = () => {
    const last = history.at(-1);
    if (!last?.before) return;
    const restored = structuredClone(last.before);
    restored.current_state = { ...restored.current_state, experience_available: available + last.cost, experience_spent: Math.max(0, spent - last.cost), experience_total: total, vampire_experience_history: history.slice(0, -1) };
    updateSheet(restored);
  };
  const commitAvailableExperience = () => {
    const nextAvailable = Math.max(0, Math.trunc(Number(amount) || 0));
    setAmount(String(nextAvailable));
    saveState({ experience_available: nextAvailable, experience_spent: spent, experience_total: nextAvailable + spent });
  };
  return <section className="experience-panel vampire-experience-panel">
    <div className="experience-title"><div><span>{tr("Beats e Experiência", "Beats and Experience")}</span><small>{tr("Beats são marcados separadamente da Experiência", "Beats are tracked separately from Experience")}</small></div></div>
    <div className="experience-totals">
      <label className="experience-input"><Input type="number" min={0} step={1} inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} onBlur={commitAvailableExperience} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} aria-label={tr("Experiência disponível", "Available Experience")} /><span>{tr("EXP disponível", "XP available")}</span></label>
      <div><strong>{total}</strong><span>{tr("EXP total", "Total XP")}</span></div>
      <div><strong>{spent}</strong><span>{tr("EXP gasta", "XP spent")}</span></div>
    </div>
    <BeatTrack label="Beats" value={beats} onChange={(value) => saveState(value === 5 ? { beats: 0, experience_available: available + 1, experience_spent: spent, experience_total: total + 1 } : { beats: value })} />
    <div className="experience-actions">
      <Dialog>
        <DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="catalog-selection-action"><ShoppingBag /> {tr("Gastar Experiência", "Spend Experience")}</Button></DialogTrigger>
        <DialogContent className="experience-dialog">
          <DialogHeader><DialogTitle>{tr("Gastar Experiência de Vampiro", "Spend Vampire Experience")}</DialogTitle><DialogDescription>{tr("Escolha uma característica e a ficha registrará o gasto e atualizará os valores automaticamente.", "Choose a trait and the sheet will record the expense and update the values automatically.")}</DialogDescription></DialogHeader>
          <div className="experience-purchase-form">
            <label>{tr("Tipo", "Type")}<RuleSelect value={purchase} onChange={(value) => { setPurchase(value as PurchaseType); setTarget(""); setMeritDots(0); setMeritInstance(-1); setMeritConfiguration({}); setFeedback(""); setTeacherConfirmed(false); }} options={PURCHASES.map((value) => ({ value, label: purchaseLabel(value, locale) }))} /></label>
            {purchase === "merit" ? <label>{tr("Mérito", "Merit")}<ExperienceMeritPicker line="VtR" archetypes={["vampire", String(character.line_data.clan_id ?? ""), covenant]} meritCatalog={meritCatalog} character={character} selectedId={selectedMerit?.id ?? ""} targetDots={nextMeritRating ?? 0} onSelect={(id, dots, instance) => { setTarget(id); setMeritDots(dots); setMeritInstance(instance); setMeritConfiguration(normalizeMeritConfiguration(character.merits[instance]?.configuration)); }} /></label> : options.length > 1 || options[0]?.value !== purchase ? <label>{tr("Característica", "Trait")}<RuleSelect value={chosen} onChange={(value) => { setTarget(value); setTeacherConfirmed(false); }} options={options} /></label> : null}
            {purchase === "merit" && selectedMerit && Number(nextMeritRating) > 0 && <MeritConfigurationEditor merit={{ name: selectedMerit.name, dots: Number(nextMeritRating), configuration: meritConfiguration }} onChange={setMeritConfiguration} catalog={[...meritCatalog]} ownedMerits={character.merits} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />}
            {purchase === "specialty" && <label>{tr("Especialização", "Specialty")}<Input value={specialtyName} placeholder={tr("Nome da Especialização", "Specialty name")} onChange={(event) => setSpecialtyName(event.target.value)} maxLength={80} /></label>}
            {teacherRequired && <label className="vampire-teacher-confirmation"><Checkbox checked={teacherConfirmed} onCheckedChange={(checked) => setTeacherConfirmed(checked === true)} /><span>{tr("Confirmo professor e sangue de alguém que possui esta Disciplina.", "I confirm a teacher and blood from someone who possesses this Discipline.")}</span></label>}
          </div>
          <div className="purchase-preview"><strong>{options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)}</strong><span>{cost} {tr("EXP", "XP")}</span></div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{tr("Fechar", "Close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={unavailable || available < cost} onClick={buy}>{tr("Comprar por", "Purchase for")} {cost} {tr("EXP", "XP")}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}
    <details className="experience-history"><summary><History /> {tr("Gastos de Experiência", "Experience Expenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map((entry, index) => <p key={entry.id}><span>{entry.label}</span><strong>{entry.cost} EXP</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small>{index === 0 && <Button type="button" size="sm" variant="ghost" onClick={undo}><RotateCcw /> {tr("Reverter", "Refund")}</Button>}</p>) : <em>{tr("Nenhum gasto registrado.", "No expenses recorded.")}</em>}</div></details>
  </section>;
}
