"use client";
import { useEffect, useState } from "react";
import { History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeChangelingFrailties, seemingDisplayName } from "@/game-lines/changeling/creation-rules";
import { meritContextForSheet, meritPrerequisitesMet, meritRatingsFor, type MeritDefinition } from "@/lib/merits";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import { contractOutcomeSections, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { availableForeignClauseCourtIds } from "@/lib/contract-clauses";
import { courtCanonicalId, courtDisplayName } from "@/lib/changeling-courts";
import type { EntitlementDefinition } from "@/lib/entitlements";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { changePermanentClarity, normalizeClarityDamage } from "@/lib/resource-rules";
import { refundChangelingPowerRating, withChangelingPowerRating } from "@/game-lines/changeling/builder-power-progression";
import { subtractDots, refundMeritDots } from "@/lib/experience-refunds";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { synchronizeChangelingBuilderMeritGrants as synchronizeMeritGrants } from "@/game-lines/changeling/builder-merit-grants";
import { RuleSelect } from "@/app/workspace/rule-select";
import { stringList } from "@/app/workspace/sheet-primitives";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { createRandomId } from "@/lib/random-id";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { homebrewCategoryKeys, homebrewContentActive } from "@/lib/homebrew";
import { useEntitlementHomebrews } from "./use-entitlement-homebrews";
import { mergeContractHomebrews } from "./contract-homebrews";
import { useContractHomebrews } from "./use-contract-homebrews";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";

const objectList=(value:unknown)=>Array.isArray(value)?value as Array<Record<string,unknown>>:[];
const boundedNumber=(value:unknown,maximum:number,fallback:number)=>Math.max(0,Math.min(maximum,Number.isFinite(Number(value))?Number(value):fallback));
import { ExperienceMeritPicker, ExperiencePowerPicker, ExperienceRatingPicker, experiencePurchaseBalances, groupedPurchaseOptions, isRepeatableDefinition } from "@/app/workspace/experience-shared";
import { ExperienceRules, contractExperienceCost, derivedWithPermanentMerits, purchasePreview, recalculateCtlDerived } from "./experience-shared";
type ExperienceUndo =
  | {
      kind: "trait";
      group: "attributes" | "skills";
      name: string;
      previous: number;
      amount?: number;
    }
  | {
      kind: "merit";
      name: string;
      previousDots: number | null;
      instanceIndex?: number;
      instanceId?: string;
    }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "contract"; id: string }
  | { kind: "benefit"; contractId: string; seeming: string }
  | { kind: "clause"; contractId: string; courtId: string }
  | { kind: "wyrd"; previous: number; amount?: number }
  | { kind: "clarityGain" }
  | { kind: "willpower"; previousLost: number; amount?: number }
  | { kind: "willpowerLoss"; previousLost: number };
type ExperienceEntry = {
  id: string;
  kind: "spend";
  description: string;
  experience: number;
  createdAt: string;
  undo?: ExperienceUndo;
};
const PURCHASE_GROUPS = [
  { group: "core", purchases: ["Atributo", "Perícia", "Especialização", "Mérito"] },
  { group: "supernatural", purchases: ["Fado", "Contrato"] },
  { group: "integrity", purchases: ["Ponto perdido de Força de Vontade"] },
  { group: "acquired", purchases: ["Benefício de Contrato"] },
] as const;
const PURCHASE_TYPES = PURCHASE_GROUPS.flatMap(({ purchases }) => [...purchases]);
const PURCHASE_TYPE_EN:Record<string,string>={
  Atributo:"Attribute", Perícia:"Skill", Mérito:"Merit", Especialização:"Specialty", Contrato:"Contract",
  "Benefício de Contrato":"Contract Benefit", Fado:"Wyrd", "Ponto perdido de Força de Vontade":"Lost Willpower dot",
};
const purchaseTypeLabel=(value:string,locale:Locale)=>locale==="en-US"?(PURCHASE_TYPE_EN[value]??systemTerm(value,locale)):value;
const groupedTraitOptions = (
  groups: Record<string, readonly string[]>,
) =>
  Object.entries(groups).flatMap(([group, values]) =>
    values.map((value) => ({ value, label: value, group })),
  );
const ATTRIBUTE_OPTIONS = groupedTraitOptions(ATTRIBUTES);
const SKILL_OPTIONS = groupedTraitOptions(SKILLS);

export function ExperiencePanel({
  character,
  updateSheet,
  catalogs,
  builderMode = false,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  catalogs: CatalogSnapshot;
  builderMode?: boolean;
}) {
  const { locale, t }=useLanguage();
  const homebrewPreferences=useHomebrewPreferences(),customEntitlements=useEntitlementHomebrews(),customContracts=useContractHomebrews(),customMerits=useMeritHomebrews("CtL",true);
  const contractCatalog = mergeContractHomebrews(catalogs.get<ContractDefinition[]>("changeling-contracts"), customContracts);
  const staticEntitlements = catalogs.get<{ entitlements: readonly EntitlementDefinition[] }>("changeling-reference").entitlements;
  const entitlementCatalog = [...staticEntitlements,...customEntitlements.filter((custom)=>!staticEntitlements.some((item)=>item.id===custom.id))];
  const contractsCatalog = contractCatalog.map(item=>contractWithSupplementalBenefits(item,homebrewPreferences.disabledIds.includes("h-seemings")?[]:["h-seemings"]));
  const findContractInCatalog = (id: string) => contractsCatalog.find((item) => item.id === id || item.name === id);
  const state = character.current_state ?? {};
  const beats = boundedNumber(state.experience_beats, 5, 0);
  const legacyTotal = Math.max(
    0,
    Math.trunc(Number(state.experience_total ?? 0) || 0),
  );
  const spentXp = Math.max(
    0,
    Math.trunc(Number(state.experience_spent ?? 0) || 0),
  );
  const available = Math.max(
    0,
    Math.trunc(
      Number(
        state.experience_available ?? Math.max(0, legacyTotal - spentXp),
      ) || 0,
    ),
  );
  const total = available + spentXp;
  const history = (
    Array.isArray(state.experience_history)
      ? (state.experience_history as ExperienceEntry[])
      : []
  ).filter((entry) => entry.kind === "spend");
  const [experienceInput, setExperienceInput] = useState(String(available));
  const [purchaseType, setPurchaseType] = useState<string>(PURCHASE_TYPES[0]);
  const [targetRating, setTargetRating] = useState(0);
  const [attribute, setAttribute] = useState<string>(
    Object.values(ATTRIBUTES).flat()[0],
  );
  const [skill, setSkill] = useState<string>(Object.values(SKILLS).flat()[0]);
  const [meritId, setMeritId] = useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [meritInstance, setMeritInstance] = useState(-1);
  const [specialtySkill, setSpecialtySkill] = useState<string>(
    Object.values(SKILLS).flat()[0],
  );
  const [specialtyName, setSpecialtyName] = useState("");
  const [contractId, setContractId] = useState("");
  const [benefitKey, setBenefitKey] = useState("");
  const [feedback, setFeedback] = useState("");
  const meritCatalog = activeMeritCatalog([
    ...catalogs.get<MeritDefinition[]>("core-merits"),
    ...catalogs.get<MeritDefinition[]>("changeling-merits"),
  ],customMerits,homebrewPreferences,character.merits.map((item)=>item.name));
  const merits = meritCatalog;
  const ownedContracts = [
    ...objectList(character.line_data.contracts),
    ...objectList(character.line_data.learned_contracts),
  ];
  const ownedContractIds = new Set(
    ownedContracts.map((item) => String(item.id ?? "")),
  );
  const contractOptions = contractsCatalog.filter(
    (item) => !ownedContractIds.has(item.id) && homebrewContentActive(homebrewPreferences,item.id,item.sourceId),
  );
  const extraBenefits = objectList(character.line_data.extra_contract_benefits);
  const extraKeys = new Set(
    extraBenefits.map(
      (item) => `${String(item.contractId)}::${String(item.seeming)}`,
    ),
  );
  const extraClauses = objectList(character.line_data.extra_contract_clauses);
  const extraClauseKeys = new Set(extraClauses.map((item) => `${String(item.contractId)}::${String(item.courtId)}`));
  const goodwill = new Map(objectList(character.line_data.court_goodwill_benefits).map((item) => [String(item.court), Number(item.dots ?? 0)]));
  const currentCourtId = courtCanonicalId(character.line_data.court);
  const benefitOptions = ownedContracts.flatMap((saved) => {
    const definition = findContractInCatalog(String(saved.id ?? saved.name ?? ""));
    if (!definition) return [];
    const seemingOptions = Object.keys(definition.seemingBenefits ?? {})
          .filter(
            (seeming) =>
              seeming !== String(character.line_data.seeming) &&
              !extraKeys.has(`${definition.id}::${seeming}`),
          )
          .map((seeming) => ({
            value: `benefit::${definition.id}::${seeming}`,
            label: `${definition.name} · ${seemingDisplayName(seeming,locale)}`,
          }));
    const clauseOptions = availableForeignClauseCourtIds(definition, currentCourtId, goodwill, extraClauseKeys)
      .map((courtId) => ({ value: `clause::${definition.id}::${courtId}`, label: `${definition.name} · Clause: ${courtDisplayName(courtId, locale)}` }));
    return [...seemingOptions, ...clauseOptions];
  });
  const selectedMerit = merits.find((item) => item.id === meritId) ?? merits[0];
  const ownedMerit =
    meritInstance >= 0 &&
    character.merits[meritInstance]?.name === selectedMerit?.name
      ? character.merits[meritInstance]
      : selectedMerit && !isRepeatableDefinition(selectedMerit)
        ? character.merits.find(
            (item) => item.name === selectedMerit.name && !item.grantedBy,
          )
        : undefined;
  const availableMeritRatings = selectedMerit
    ? meritRatingsFor(selectedMerit,(ownedMerit?.dots??0)+1).filter(
        (rating) => rating > (ownedMerit?.dots ?? 0),
      )
    : [];
  const nextMeritRating = availableMeritRatings.includes(meritDots)
    ? meritDots
    : availableMeritRatings[0];
  const selectedContract =
    contractsCatalog.find((item) => item.id === contractId) ?? contractOptions[0];
  const wyrd = Math.max(1, Number(character.line_data.wyrd ?? 1));
  const traitMaximum = Math.max(5, wyrd);
  const lostWillpower = boundedNumber(
    state.willpower_lost_dots,
    Math.max(0, Number(character.derived.ForçaDeVontade ?? 1) - 1),
    0,
  );
  const permanentWillpowerMaximum = Math.max(1, Number(character.derived.ForçaDeVontade ?? 1));
  const ratedCurrent = purchaseType === "Atributo" ? Number(character.attributes[attribute] ?? 1)
    : purchaseType === "Perícia" ? Number(character.skills[skill] ?? 0)
      : purchaseType === "Fado" ? wyrd
        : purchaseType === "Ponto perdido de Força de Vontade" ? permanentWillpowerMaximum - lostWillpower
          : 0;
  const ratedMaximum = purchaseType === "Atributo" || purchaseType === "Perícia" ? traitMaximum
    : purchaseType === "Fado" ? 10
      : purchaseType === "Ponto perdido de Força de Vontade" ? permanentWillpowerMaximum
        : 0;
  const intendedRating = ratedCurrent < ratedMaximum ? Math.max(ratedCurrent + 1, Math.min(ratedMaximum, targetRating || ratedCurrent + 1)) : ratedCurrent;
  const ratingAmount = Math.max(0, intendedRating - ratedCurrent);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setExperienceInput(String(available)), [available]);
  function setBeats(value: number) {
    const next = structuredClone(character);
    next.current_state = {
      ...next.current_state,
      experience_beats: value,
      experience_history: history,
    };
    updateSheet(next);
  }
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(
      `input[name="beats-${character.id}"]`,
    );
    const fieldset = input?.closest("fieldset");
    if (!fieldset) return;
    const click = (event: Event) => {
      const label = (event.target as HTMLElement).closest("label");
      if (!label || !fieldset.contains(label)) return;
      event.preventDefault();
      const labels = [...fieldset.querySelectorAll("label")];
      const index = labels.indexOf(label);
      const next = structuredClone(character);
      next.current_state = {
        ...next.current_state,
        experience_beats: index < beats ? index : index + 1,
        experience_history: history,
      };
      updateSheet(next);
    };
    fieldset.addEventListener("click", click);
    return () => fieldset.removeEventListener("click", click);
  }, [beats, character, history, updateSheet]);
  function commitAvailableExperience() {
    const value = Math.max(0, Math.trunc(Number(experienceInput) || 0));
    setExperienceInput(String(value));
    const next = structuredClone(character);
    next.current_state = {
      ...next.current_state,
      experience_available: value,
      experience_spent: spentXp,
      experience_total: value + spentXp,
      experience_history: history,
    };
    updateSheet(next);
    setFeedback(t("ui.availableExperienceUpdated"));
  }
  function append(entry: ExperienceEntry, nextState: Record<string, unknown>) {
    nextState.experience_history = [entry, ...history].slice(0, 100);
  }
  function markWillpowerLoss() {
    const maximum = Math.max(
      0,
      Number(character.derived.ForçaDeVontade ?? 1) - 1,
    );
    if (lostWillpower >= maximum) return;
    const next = structuredClone(character);
    const nextState = {
      ...next.current_state,
      willpower_lost_dots: lostWillpower + 1,
    };
    append(
      {
        id: createRandomId(),
        kind: "spend",
        description: t("ui.permanentLossOfOneWillpowerDot"),
        experience: 0,
        createdAt: new Date().toISOString(),
        undo: { kind: "willpowerLoss", previousLost: lostWillpower },
      },
      nextState,
    );
    next.current_state = nextState;
    updateSheet(next);
    setFeedback(
      t("ui.permanentWillpowerLossRecordedInHistory"),
    );
  }
  function gainClarity() {
    const next = structuredClone(character);
    next.current_state = changePermanentClarity(next.current_state, 1);
    append({
      id: createRandomId(),
      kind: "spend",
      description: t("ui.permanentGainOfOneClarityBox"),
      experience: 0,
      createdAt: new Date().toISOString(),
      undo: { kind: "clarityGain" },
    }, next.current_state);
    updateSheet(next);
    setFeedback(t("ui.onePermanentClarityBoxAddedAtNoExperience"));
  }
  function spend(
    cost: number,
    description: string,
    undo: ExperienceUndo,
    apply: (next: CharacterSheet) => void,
  ) {
    if (cost < 1 || (!builderMode && available < cost)) {
      setFeedback(t("ui.notEnoughAvailableExperienceForThisPurchase"));
      return;
    }
    const next = structuredClone(character);
    apply(next);
    const balance = experiencePurchaseBalances(available, spentXp, total, cost, builderMode);
    const nextState = {
      ...next.current_state,
      experience_available: balance.available,
      experience_spent: balance.spent,
      experience_total: balance.total,
    };
    append(
      {
        id: createRandomId(),
        kind: "spend",
        description,
        experience: -cost,
        createdAt: new Date().toISOString(),
        undo,
      },
      nextState,
    );
    next.current_state = nextState;
    updateSheet(synchronizeMeritGrants(next, entitlementCatalog));
    setFeedback(
      t("ui.experiencePurchase", { description, cost, plural: cost === 1 ? "" : "s" }),
    );
  }
  function revertPurchase(entry: ExperienceEntry) {
    if (!history.some(item => item.id === entry.id)) return;
    if (!entry.undo)
      return setFeedback(
        t("ui.thisOlderPurchaseDoesNotContainEnoughData"),
      );
    const next = structuredClone(character);
    const undo = entry.undo;
    if (undo.kind === "trait") next[undo.group][undo.name] = subtractDots(next[undo.group][undo.name], undo.amount ?? 1, undo.group === "attributes" ? 1 : 0);
    else if (undo.kind === "merit") {
      refundMeritDots(next, undo.name, Math.abs(entry.experience), undo.instanceId, undo.instanceIndex);
      if (undo.name === "Touchstone") {
        const maximum = 1 + next.merits
          .filter((merit) => merit.name === "Touchstone" && !merit.grantedBy)
          .reduce((sum, merit) => sum + merit.dots, 0);
        next.line_data.touchstones = stringList(next.line_data.touchstones).slice(0, maximum);
      }
    } else if (undo.kind === "specialty") {
      const index = next.specializations
        .map((item) => `${item.skill}::${item.name}`)
        .lastIndexOf(`${undo.skill}::${undo.name}`);
      if (index >= 0) next.specializations.splice(index, 1);
    } else if (undo.kind === "contract")
      next.line_data = {
        ...next.line_data,
        learned_contracts: objectList(next.line_data.learned_contracts).filter(
          (item) => String(item.id) !== undo.id,
        ),
      };
    else if (undo.kind === "benefit")
      next.line_data = {
        ...next.line_data,
        extra_contract_benefits: objectList(
          next.line_data.extra_contract_benefits,
        ).filter(
          (item) =>
            !(
              String(item.contractId) === undo.contractId &&
              String(item.seeming) === undo.seeming
            ),
        ),
      };
    else if (undo.kind === "clause")
      next.line_data = {
        ...next.line_data,
        extra_contract_clauses: objectList(next.line_data.extra_contract_clauses).filter(
          (item) => !(String(item.contractId) === undo.contractId && String(item.courtId) === undo.courtId),
        ),
      };
    else if (undo.kind === "clarityGain") {
      next.current_state = changePermanentClarity(next.current_state, -1);
      const maximum = Number(derivedWithPermanentMerits(next).LucidezMaxima ?? 1);
      next.current_state.clarity_damage = normalizeClarityDamage(next.current_state.clarity_damage, maximum);
    }
    else if (undo.kind === "wyrd") {
      for (let dot = 0; dot < (undo.amount ?? 1); dot += 1) next.line_data = refundChangelingPowerRating(next);
      next.line_data.frailties = normalizeChangelingFrailties(next.line_data.frailties, Number(next.line_data.wyrd));
    }
    else
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? undo.amount ?? 1 : -1)),
      };
    const refund = Math.abs(entry.experience);
    const nextAvailable = available + refund;
    const nextSpent = Math.max(0, spentXp - refund);
    next.current_state = {
      ...next.current_state,
      experience_available: nextAvailable,
      experience_spent: nextSpent,
      experience_total: nextAvailable + nextSpent,
      experience_history: history.filter((item) => item.id !== entry.id),
    };
    recalculateCtlDerived(next);
    updateSheet(synchronizeMeritGrants(next, entitlementCatalog));
    setFeedback(t("ui.wasRefundedExperienceRestored", { p1: entry.description, p2: refund }));
  }
  function buy() {
    if (purchaseType === "Atributo") {
      const current = Number(character.attributes[attribute] ?? 1);
      if (current >= traitMaximum)
        return setFeedback(
          t("ui.thisAttributeHasReachedTheMaximumAllowedBy"),
        );
      const target = intendedRating;
      spend(
        4 * ratingAmount,
        `${attribute} ${target}`,
        {
          kind: "trait",
          group: "attributes",
          name: attribute,
          previous: current,
          amount: ratingAmount,
        },
        (next) => {
          next.attributes[attribute] = target;
          recalculateCtlDerived(next);
        },
      );
      return;
    }
    if (purchaseType === "Perícia") {
      const current = Number(character.skills[skill] ?? 0);
      if (current >= traitMaximum)
        return setFeedback(
          t("ui.thisSkillHasReachedTheMaximumAllowedBy"),
        );
      const target = intendedRating;
      spend(
        2 * ratingAmount,
        `${skill} ${target}`,
        { kind: "trait", group: "skills", name: skill, previous: current, amount: ratingAmount },
        (next) => {
          next.skills[skill] = target;
          recalculateCtlDerived(next);
        },
      );
      return;
    }
    if (purchaseType === "Mérito") {
      if (!selectedMerit || !nextMeritRating)
        return setFeedback(t("ui.thisMeritHasNoHigherAvailableRating"));
      if(!meritPrerequisitesMet(selectedMerit,{...meritContextForSheet(character, meritCatalog, ["changeling"]),selectedDots:nextMeritRating,configuration:ownedMerit?.configuration}))return setFeedback(t("ui.prerequisitesNotMet"));
      const current = ownedMerit?.dots ?? 0;
      const cost = nextMeritRating - current;
      const instanceId = ownedMerit?.instanceId ?? createRandomId();
      const targetIndex = ownedMerit
        ? character.merits.indexOf(ownedMerit)
        : character.merits.length;
      spend(
        cost,
        `${selectedMerit.translatedName} ${nextMeritRating}`,
        {
          kind: "merit",
          name: selectedMerit.name,
          previousDots: ownedMerit?.dots ?? null,
          instanceIndex: targetIndex,
          instanceId,
        },
        (next) => {
          const found = ownedMerit ? next.merits[targetIndex] : undefined;
          if (found && found.name === selectedMerit.name) {
            found.instanceId = instanceId;
            addExperienceMeritDots(found, cost);
          } else
            next.merits.push({
              instanceId,
              name: selectedMerit.name,
              dots: nextMeritRating,
              creationDots: 0,
              experienceDots: nextMeritRating,
              sourceId: selectedMerit.sourceId,
              source: selectedMerit.source,
              configuration: {},
            });
        },
      );
      return;
    }
    if (purchaseType === "Especialização") {
      if (!specialtyName.trim())
        return setFeedback(t("ui.enterTheSpecialtyName"));
      const name = specialtyName.trim();
      spend(
        1,
        `${t("ui.specialty")} ${systemTerm(specialtySkill,locale)}: ${name}`,
        { kind: "specialty", skill: specialtySkill, name },
        (next) => next.specializations.push({ skill: specialtySkill, name }),
      );
      setSpecialtyName("");
      return;
    }
    if (purchaseType === "Contrato") {
      if (!selectedContract)
        return setFeedback(t("ui.noContractIsAvailableForThisPurchase"));
      const cost = contractExperienceCost(selectedContract, character);
      spend(
        cost,
        `${t("ui.contract")} ${selectedContract.name}`,
        { kind: "contract", id: selectedContract.id },
        (next) => {
          const learned = objectList(next.line_data.learned_contracts);
          next.line_data = {
            ...next.line_data,
            learned_contracts: [...learned, { ...selectedContract }],
          };
        },
      );
      return;
    }
    if (purchaseType === "Benefício de Contrato") {
      const value = benefitKey || benefitOptions[0]?.value;
      if (!value)
        return setFeedback(t("ui.noAdditionalBenefitOrClauseIsAvailable"));
      const [kind, chosenContract, choice] = value.split("::");
      const definition = findContractInCatalog(chosenContract);
      const isClause = kind === "clause";
      spend(
        1,
        isClause ? `${t("ui.clauseFor")} ${courtDisplayName(choice, locale)} · ${definition?.name ?? t("ui.contract")}` : `${t("ui.benefitFor")} ${seemingDisplayName(choice,locale)} · ${definition?.name ?? t("ui.contract")}`,
        isClause ? { kind: "clause", contractId: chosenContract, courtId: choice } : { kind: "benefit", contractId: chosenContract, seeming: choice },
        (next) => {
          next.line_data = {
            ...next.line_data,
            ...(isClause
              ? { extra_contract_clauses: [...objectList(next.line_data.extra_contract_clauses), { contractId: chosenContract, courtId: choice }] }
              : { extra_contract_benefits: [...objectList(next.line_data.extra_contract_benefits), { contractId: chosenContract, seeming: choice }] }),
          };
        },
      );
      return;
    }
    if (purchaseType === "Fado") {
      if (wyrd >= 10) return setFeedback(t("ui.wyrdHasAlreadyReached10"));
      spend(5 * ratingAmount, `${t("ui.wyrd")} ${intendedRating}`, { kind: "wyrd", previous: wyrd, amount: ratingAmount }, (next) => {
        next.line_data = { ...withChangelingPowerRating(next, intendedRating), frailties: normalizeChangelingFrailties(next.line_data.frailties, intendedRating) };
      });
      return;
    }
    if (!lostWillpower)
      return setFeedback(
        t("ui.theCharacterHasNoPermanentlyLostWillpowerDots"),
      );
    spend(
      ratingAmount,
      `${t("ui.willpower")} ${intendedRating}`,
      { kind: "willpower", previousLost: lostWillpower, amount: ratingAmount },
      (next) => {
        next.current_state = {
          ...next.current_state,
          willpower_lost_dots: lostWillpower - ratingAmount,
        };
      },
    );
  }
  const preview = purchasePreview({
    locale,
    purchaseType,
    character,
    attribute,
    skill,
    selectedMerit,
    nextMeritRating,
    ownedMerit,
    selectedContract,
    specialtySkill,
    specialtyName,
    benefitKey: benefitKey || benefitOptions[0]?.value,
    wyrd,
    lostWillpower,
    targetRating: intendedRating,
  });
  const historyPanel = <details className="experience-history">
    <summary><History /> {t("ui.experienceExpenses")} ({history.length})</summary>
    <div>{history.length ? history.slice(0, 12).map((entry) => <p key={entry.id}><span>{entry.description}</span><strong>{Math.abs(entry.experience)}{t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small>{entry.undo?.kind === "merit" && ["Entitlement", "Fae Mount", "Fae Pet"].includes(entry.undo.name) ? <ConfirmAction trigger={<Button type="button" size="sm" variant="ghost" disabled={!entry.undo}><RotateCcw /> {t("ui.refund")}</Button>} title={t("ui.refund20298a", { p1: entry.undo.name })} description={entry.undo.name === "Entitlement" ? t("ui.theRefundWillRemoveTheEntitlementItsRanks") : t("ui.theRefundWillRemoveTheMeritAndIts")} action={t("ui.refund1982c5")} onConfirm={() => revertPurchase(entry)}/>: <Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={() => revertPurchase(entry)}><RotateCcw /> {t("ui.refund")}</Button>}</p>) : <em>{t("ui.noExpensesRecorded")}</em>}</div>
  </details>;
  return (
    <section className="experience-panel">
      <div className="experience-title">
        <div>
          <span>{builderMode ? t("ui.creationAdvancement") : t("ui.beatsAndExperience")}</span>
          <small>{builderMode ? t("ui.creationAdvancementDescription") : t("ui.beatsAreTrackedSeparatelyFromExperience")}</small>
        </div>
      </div>
      <div className="experience-totals">
        {!builderMode && <label className="experience-input">
          <Input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={experienceInput}
            onChange={(event) => setExperienceInput(event.target.value)}
            onBlur={commitAvailableExperience}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            aria-label={t("ui.availableExperience")}
          />
          <span>{t("ui.xpAvailable")}</span>
        </label>}
        <div>
          <strong>{total}</strong>
          <span>{t("ui.totalXP")}</span>
        </div>
        <div>
          <strong>{spentXp}</strong>
          <span>{t("ui.xpSpent")}</span>
        </div>
      </div>
      {!builderMode && <fieldset className="beat-controls">
        <legend>{t("ui.beats")}</legend>
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <label key={value} title={t("ui.beatsTitle", { count: value, plural: value === 1 ? "" : "s" })}>
              <input
                type="radio"
                name={`beats-${character.id}`}
                checked={beats === value}
                onChange={() => setBeats(value)}
              />
              <span>{value}</span>
            </label>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!beats}
          onClick={() => setBeats(0)}
        >
          {t("ui.clear")}
        </Button>
      </fieldset>}
      <div className="experience-actions">
        <Dialog>
          <DialogTrigger asChild>
            <Button
  type="button"
  variant="outline"
  size="sm"
  className="catalog-selection-action ctl-purchase-trait-button"
>
  <span className="ctl-purchase-trait-icon" aria-hidden="true" />
  {t("ui.purchaseTrait")}
</Button>
          </DialogTrigger>
          <DialogContent className="experience-dialog ctl-dialog">
            <DialogHeader>
              <DialogTitle>{t("ui.spendExperience")}</DialogTitle>
              <DialogDescription>
                {t("ui.costsFromChangelingTheLostP94Each")}
              </DialogDescription>
            </DialogHeader>
            <div className="experience-purchase-form">
              <label>
                {t("ui.type")}
                <RuleSelect
                  value={purchaseType}
                  onChange={(value) => {
                    setPurchaseType(value);
                    setTargetRating(0);
                    setFeedback("");
                  }}
                  options={groupedPurchaseOptions(builderMode ? [
                    { group: "core", purchases: ["Atributo", "Perícia", "Mérito"] },
                    { group: "supernatural", purchases: ["Fado", "Contrato"] },
                  ] : PURCHASE_GROUPS, (value) => purchaseTypeLabel(value,locale), locale)}
                />
              </label>
              {purchaseType === "Atributo" && (
                <label>
                  {t("ui.attribute")}
                  <RuleSelect
                    value={attribute}
                    onChange={(value) => { setAttribute(value); setTargetRating(0); }}
                    options={ATTRIBUTE_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Perícia" && (
                <label>
                  {t("ui.skill")}
                  <RuleSelect
                    value={skill}
                    onChange={(value) => { setSkill(value); setTargetRating(0); }}
                    options={SKILL_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Mérito" && (
                <label>
                  {t("ui.merit")}
                  <ExperienceMeritPicker
                    line="CtL"
                    archetypes={["changeling"]}
                    meritCatalog={meritCatalog}
                    character={character}
                    selectedId={meritId}
                    targetDots={nextMeritRating ?? 0}
                    onSelect={(id, dots, instance) => {
                      setMeritId(id);
                      setMeritDots(dots);
                      setMeritInstance(instance);
                    }}
                  />
                </label>
              )}
              {purchaseType === "Especialização" && (
                <>
                  <label>
                    {t("ui.skill")}
                    <RuleSelect
                      value={specialtySkill}
                      onChange={setSpecialtySkill}
                      options={SKILL_OPTIONS}
                    />
                  </label>
                  <label>
                    {t("ui.specialty")}
                    <Input
                      value={specialtyName}
                      onChange={(event) => setSpecialtyName(event.target.value)}
                      maxLength={80}
                    />
                  </label>
                </>
              )}
              {purchaseType === "Contrato" && (
                <label>
                  {t("ui.contract")}
                  <ExperiencePowerPicker
                    kind="Contrato"
                    line="CtL"
                    items={contractOptions.map((item) => ({
                      id: item.id,
                      name: locale==="en-US"?item.originalName:item.name,
                      category: systemTerm(item.regalia,locale),
                      categories: homebrewCategoryKeys(systemTerm(item.regalia,locale), item.sourceId),
                      secondaryCategory: item.type==="Comum"?t("ui.common"):t("ui.royal"),
                      sortPriority: Number(item.type === "Real"),
                      description: contractOutcomeSections(item,locale).map(section=>section.text).join(" "),
                      meta: `${item.type==="Comum"?t("ui.common"):t("ui.royal")} · ${systemTerm(item.regalia,locale)} · ${item.source} · p. ${item.page || "—"}`,
                    }))}
                    selectedId={selectedContract?.id ?? ""}
                    onSelect={setContractId}
                  />
                </label>
              )}
              {purchaseType === "Benefício de Contrato" && (
                <label>
                  {t("ui.benefit")}
                  <ExperiencePowerPicker
                    kind="Benefício de Contrato"
                    line="CtL"
                    items={benefitOptions.map((option)=>{
                      const [kind,contractId,choice]=option.value.split("::"), contract=findContractInCatalog(contractId), isClause=kind==="clause";
                      return {id:option.value,name:option.label,category:isClause?"Clause":t("ui.seemingBenefit"),secondaryCategory:isClause?courtDisplayName(choice,locale):seemingDisplayName(choice,locale),description:isClause?contract?.courtClauses?.[choice]??"":contract?.seemingBenefits?.[choice as keyof typeof contract.seemingBenefits]??"",meta:`${contract?.name??t("ui.contract")} · ${contract?.source??""} · p. ${contract?.page||"—"}`};
                    })}
                    selectedId={benefitKey || benefitOptions[0]?.value || ""}
                    onSelect={setBenefitKey}
                  />
                </label>
              )}
              {ratedMaximum > ratedCurrent && <ExperienceRatingPicker current={ratedCurrent} maximum={ratedMaximum} value={intendedRating} onChange={setTargetRating} />}
            </div>
            <div className="purchase-preview">
              <strong>{preview.label}</strong>
              <span>
                {preview.cost} {t(preview.cost === 1 ? "ui.experienceSingular" : "ui.experiencePlural")}
              </span>
            </div>
            {feedback && <p className="experience-feedback">{feedback}</p>}
            <ExperienceRules />
            {historyPanel}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button>
              </DialogClose>
              <Button
                type="button"
                size="sm"
                className="catalog-selection-action"
                disabled={preview.cost < 1 || (!builderMode && available < preview.cost)}
                onClick={buy}
              >
                {t("ui.purchaseFor")} {preview.cost} {t("ui.xp")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!builderMode && <div className="permanent-resource-actions">
          <ConfirmAction trigger={<Button type="button" variant="ghost" size="sm" className="catalog-selection-action">{t("ui.gainClarity")}</Button>} title={t("ui.addAPermanentClarityBox")} description={t("ui.thisAddsOnePermanentClarityBoxAtNo")} action={t("ui.addClarity")} destructive={false} onConfirm={gainClarity}/>
          <span aria-hidden="true">|</span>
          <ConfirmAction trigger={<Button type="button" variant="ghost" size="sm" className="catalog-selection-action">{t("ui.loseWP")}</Button>} title={t("ui.permanentlyLoseOneWillpowerDot")} description={t("ui.thisReducesPermanentWillpowerByOneDotAnd")} action={t("ui.loseWP")} onConfirm={markWillpowerLoss}/>
        </div>}
      </div>
      {feedback && <p className="experience-feedback compact">{feedback}</p>}
      <details className="experience-history">
        <summary>
          <History /> {t("ui.experienceExpenses")} ({history.length})
        </summary>
        <div>
          {history.length ? (
            history.slice(0, 12).map((entry) => (
              <p key={entry.id}>
                <span>{entry.description}</span>
                <strong>{Math.abs(entry.experience)}{t("ui.xp")}</strong>
                <small>
                  {new Date(entry.createdAt).toLocaleDateString(locale)}
                </small>
                {entry.undo?.kind==="merit"&&["Entitlement","Fae Mount","Fae Pet"].includes(entry.undo.name)?<ConfirmAction trigger={<Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!entry.undo}
                >
                  <RotateCcw /> {t("ui.refund")}
                </Button>} title={t("ui.refund20298a", { p1: entry.undo.name })} description={entry.undo.name==="Entitlement"?t("ui.theRefundWillRemoveTheEntitlementItsRanks"):t("ui.theRefundWillRemoveTheMeritAndIts")} action={t("ui.refund1982c5")} onConfirm={()=>revertPurchase(entry)}/>:<Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={()=>revertPurchase(entry)}><RotateCcw /> {t("ui.refund")}</Button>}
              </p>
            ))
          ) : (
            <em>{t("ui.noExpensesRecorded")}</em>
          )}
        </div>
      </details>
    </section>
  );
}
