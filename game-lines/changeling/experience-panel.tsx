"use client";
import { useEffect, useState } from "react";
import { History, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const objectList=(value:unknown)=>Array.isArray(value)?value as Array<Record<string,unknown>>:[];
const boundedNumber=(value:unknown,maximum:number,fallback:number)=>Math.max(0,Math.min(maximum,Number.isFinite(Number(value))?Number(value):fallback));
import { ExperienceMeritPicker, ExperiencePowerPicker, isRepeatableDefinition } from "@/app/workspace/experience-shared";
import { ExperienceRules, contractExperienceCost, derivedWithPermanentMerits, purchasePreview, recalculateCtlDerived } from "./experience-shared";
type ExperienceUndo =
  | {
      kind: "trait";
      group: "attributes" | "skills";
      name: string;
      previous: number;
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
  | { kind: "wyrd"; previous: number }
  | { kind: "clarityGain" }
  | { kind: "willpower"; previousLost: number }
  | { kind: "willpowerLoss"; previousLost: number };
type ExperienceEntry = {
  id: string;
  kind: "spend";
  description: string;
  experience: number;
  createdAt: string;
  undo?: ExperienceUndo;
};
const PURCHASE_TYPES = [
  "Atributo",
  "Perícia",
  "Mérito",
  "Especialização",
  "Contrato",
  "Benefício de Contrato",
  "Fado",
  "Ponto perdido de Força de Vontade",
];
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
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  catalogs: CatalogSnapshot;
}) {
  const {locale,tr}=useLanguage();
  const contractCatalog = catalogs.get<ContractDefinition[]>("changeling-contracts");
  const entitlementCatalog = catalogs.get<{ entitlements: readonly EntitlementDefinition[] }>("changeling-reference").entitlements;
  const contractsCatalog = contractCatalog.map(item=>contractWithSupplementalBenefits(item,[]));
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
  const [purchaseType, setPurchaseType] = useState(PURCHASE_TYPES[0]);
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
  const meritCatalog = [
    ...catalogs.get<MeritDefinition[]>("core-merits"),
    ...catalogs.get<MeritDefinition[]>("changeling-merits"),
  ];
  const merits = meritCatalog;
  const ownedContracts = [
    ...objectList(character.line_data.contracts),
    ...objectList(character.line_data.learned_contracts),
  ];
  const ownedContractIds = new Set(
    ownedContracts.map((item) => String(item.id ?? "")),
  );
  const contractOptions = contractsCatalog.filter(
    (item) => !ownedContractIds.has(item.id),
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
    setFeedback(tr("Experiência disponível atualizada.", "Available Experience updated."));
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
        id: crypto.randomUUID(),
        kind: "spend",
        description: tr("Perda permanente de um ponto de Força de Vontade", "Permanent loss of one Willpower dot"),
        experience: 0,
        createdAt: new Date().toISOString(),
        undo: { kind: "willpowerLoss", previousLost: lostWillpower },
      },
      nextState,
    );
    next.current_state = nextState;
    updateSheet(next);
    setFeedback(
      tr("Perda permanente de Força de Vontade registrada no histórico.", "Permanent Willpower loss recorded in history."),
    );
  }
  function gainClarity() {
    const next = structuredClone(character);
    next.current_state = changePermanentClarity(next.current_state, 1);
    append({
      id: crypto.randomUUID(),
      kind: "spend",
      description: tr("Ganho permanente de uma caixa de Lucidez", "Permanent gain of one Clarity box"),
      experience: 0,
      createdAt: new Date().toISOString(),
      undo: { kind: "clarityGain" },
    }, next.current_state);
    updateSheet(next);
    setFeedback(tr("Uma caixa permanente de Lucidez adicionada, sem custo de EXP.", "One permanent Clarity box added at no Experience cost."));
  }
  function spend(
    cost: number,
    description: string,
    undo: ExperienceUndo,
    apply: (next: CharacterSheet) => void,
  ) {
    if (cost < 1 || available < cost) {
      setFeedback(tr("Experiência disponível insuficiente para esta compra.", "Not enough available Experience for this purchase."));
      return;
    }
    const next = structuredClone(character);
    apply(next);
    const nextAvailable = available - cost;
    const nextSpent = spentXp + cost;
    const nextState = {
      ...next.current_state,
      experience_available: nextAvailable,
      experience_spent: nextSpent,
      experience_total: nextAvailable + nextSpent,
    };
    append(
      {
        id: crypto.randomUUID(),
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
      tr(`${description} adquirido por ${cost} Experiência${cost === 1 ? "" : "s"}.`, `${description} purchased for ${cost} Experience.`),
    );
  }
  function revertPurchase(entry: ExperienceEntry) {
    if (!history.some(item => item.id === entry.id)) return;
    if (!entry.undo)
      return setFeedback(
        tr("Esta compra antiga não contém dados suficientes para ser revertida.", "This older purchase does not contain enough data to be refunded."),
      );
    const next = structuredClone(character);
    const undo = entry.undo;
    if (undo.kind === "trait") next[undo.group][undo.name] = subtractDots(next[undo.group][undo.name], 1, undo.group === "attributes" ? 1 : 0);
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
      next.line_data = refundChangelingPowerRating(next);
      next.line_data.frailties = normalizeChangelingFrailties(next.line_data.frailties, Number(next.line_data.wyrd));
    }
    else
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? 1 : -1)),
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
    setFeedback(tr(`${entry.description} foi revertido; ${refund} EXP devolvida.`, `${entry.description} was refunded; ${refund} Experience restored.`));
  }
  function buy() {
    if (purchaseType === "Atributo") {
      const current = Number(character.attributes[attribute] ?? 1);
      if (current >= traitMaximum)
        return setFeedback(
          tr("Este Atributo já atingiu o máximo permitido pelo Fado.", "This Attribute has reached the maximum allowed by Wyrd."),
        );
      const target = current + 1;
      spend(
        4,
        `${attribute} ${target}`,
        {
          kind: "trait",
          group: "attributes",
          name: attribute,
          previous: current,
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
          tr("Esta Perícia já atingiu o máximo permitido pelo Fado.", "This Skill has reached the maximum allowed by Wyrd."),
        );
      const target = current + 1;
      spend(
        2,
        `${skill} ${target}`,
        { kind: "trait", group: "skills", name: skill, previous: current },
        (next) => {
          next.skills[skill] = target;
          recalculateCtlDerived(next);
        },
      );
      return;
    }
    if (purchaseType === "Mérito") {
      if (!selectedMerit || !nextMeritRating)
        return setFeedback(tr("Este Mérito não possui outro nível disponível.", "This Merit has no higher available rating."));
      if(!meritPrerequisitesMet(selectedMerit,{...meritContextForSheet(character, meritCatalog, ["changeling"]),selectedDots:nextMeritRating,configuration:ownedMerit?.configuration}))return setFeedback(tr("Pré-requisitos não atendidos.","Prerequisites not met."));
      const current = ownedMerit?.dots ?? 0;
      const cost = nextMeritRating - current;
      const instanceId = ownedMerit?.instanceId ?? crypto.randomUUID();
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
        return setFeedback(tr("Informe o nome da Especialização.", "Enter the Specialty name."));
      const name = specialtyName.trim();
      spend(
        1,
        `${tr("Especialização", "Specialty")} ${systemTerm(specialtySkill,locale)}: ${name}`,
        { kind: "specialty", skill: specialtySkill, name },
        (next) => next.specializations.push({ skill: specialtySkill, name }),
      );
      setSpecialtyName("");
      return;
    }
    if (purchaseType === "Contrato") {
      if (!selectedContract)
        return setFeedback(tr("Não há Contrato disponível para esta compra.", "No Contract is available for this purchase."));
      const cost = contractExperienceCost(selectedContract, character);
      spend(
        cost,
        `${tr("Contrato", "Contract")} ${selectedContract.name}`,
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
        return setFeedback(tr("Não há Benefício ou Clause adicional disponível.", "No additional Benefit or Clause is available."));
      const [kind, chosenContract, choice] = value.split("::");
      const definition = findContractInCatalog(chosenContract);
      const isClause = kind === "clause";
      spend(
        1,
        isClause ? `${tr("Clause de", "Clause for")} ${courtDisplayName(choice, locale)} · ${definition?.name ?? tr("Contrato", "Contract")}` : `${tr("Benefício de", "Benefit for")} ${seemingDisplayName(choice,locale)} · ${definition?.name ?? tr("Contrato", "Contract")}`,
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
      if (wyrd >= 10) return setFeedback(tr("Fado já atingiu 10.", "Wyrd has already reached 10."));
      spend(5, `${tr("Fado", "Wyrd")} ${wyrd + 1}`, { kind: "wyrd", previous: wyrd }, (next) => {
        next.line_data = { ...withChangelingPowerRating(next, wyrd + 1), frailties: normalizeChangelingFrailties(next.line_data.frailties, wyrd + 1) };
      });
      return;
    }
    if (!lostWillpower)
      return setFeedback(
        tr("O personagem não possui pontos permanentes de Força de Vontade perdidos.", "The character has no permanently lost Willpower dots."),
      );
    spend(
      1,
      tr("Recuperação de um ponto perdido de Força de Vontade", "Recovery of one lost Willpower dot"),
      { kind: "willpower", previousLost: lostWillpower },
      (next) => {
        next.current_state = {
          ...next.current_state,
          willpower_lost_dots: lostWillpower - 1,
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
  });
  return (
    <section className="experience-panel">
      <div className="experience-title">
        <div>
          <span>{tr("Beats e Experiência","Beats and Experience")}</span>
          <small>{tr("Beats são marcados separadamente da Experiência","Beats are tracked separately from Experience")}</small>
        </div>
        <Badge variant="outline">{available} {tr("EXP disponível","XP available")}</Badge>
      </div>
      <div className="experience-totals">
        <label className="experience-input">
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
            aria-label={tr("Experiência disponível","Available Experience")}
          />
          <span>{tr("EXP disponível","XP available")}</span>
        </label>
        <div>
          <strong>{total}</strong>
          <span>{tr("EXP total","Total XP")}</span>
        </div>
        <div>
          <strong>{spentXp}</strong>
          <span>{tr("EXP gasta","XP spent")}</span>
        </div>
      </div>
      <fieldset className="beat-controls">
        <legend>Beats</legend>
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <label key={value} title={`${value} Beat${value === 1 ? "" : "s"}`}>
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
          {tr("Limpar","Clear")}
        </Button>
      </fieldset>
      <div className="experience-actions">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="catalog-selection-action">
              <Sparkles /> {tr("Comprar característica","Purchase trait")}
            </Button>
          </DialogTrigger>
          <DialogContent className="experience-dialog">
            <DialogHeader>
              <DialogTitle>{tr("Gastar Experiência","Spend Experience")}</DialogTitle>
              <DialogDescription>
                {tr("Custos de Changeling the Lost, p. 94. Cada compra registra automaticamente a despesa e atualiza a ficha.","Costs from Changeling: The Lost, p. 94. Each purchase records the expense and updates the character sheet.")}
              </DialogDescription>
            </DialogHeader>
            <div className="experience-purchase-form">
              <label>
                {tr("Tipo","Type")}
                <RuleSelect
                  value={purchaseType}
                  onChange={(value) => {
                    setPurchaseType(value);
                    setFeedback("");
                  }}
                  options={PURCHASE_TYPES.map((value) => ({
                    value,
                    label: purchaseTypeLabel(value,locale),
                  }))}
                />
              </label>
              {purchaseType === "Atributo" && (
                <label>
                  {tr("Atributo","Attribute")}
                  <RuleSelect
                    value={attribute}
                    onChange={setAttribute}
                    options={ATTRIBUTE_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Perícia" && (
                <label>
                  {tr("Perícia","Skill")}
                  <RuleSelect
                    value={skill}
                    onChange={setSkill}
                    options={SKILL_OPTIONS}
                  />
                </label>
              )}
              {purchaseType === "Mérito" && (
                <label>
                  {tr("Mérito","Merit")}
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
                    {tr("Perícia","Skill")}
                    <RuleSelect
                      value={specialtySkill}
                      onChange={setSpecialtySkill}
                      options={SKILL_OPTIONS}
                    />
                  </label>
                  <label>
                    {tr("Especialização","Specialty")}
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
                  {tr("Contrato","Contract")}
                  <ExperiencePowerPicker
                    kind="Contrato"
                    items={contractOptions.map((item) => ({
                      id: item.id,
                      name: locale==="en-US"?item.originalName:item.name,
                      category: systemTerm(item.regalia,locale),
                      secondaryCategory: item.type==="Comum"?tr("Comum","Common"):tr("Real","Royal"),
                      sortPriority: Number(item.type === "Real"),
                      description: contractOutcomeSections(item,locale).map(section=>section.text).join(" "),
                      meta: `${item.type==="Comum"?tr("Comum","Common"):tr("Real","Royal")} · ${systemTerm(item.regalia,locale)} · ${item.source} · p. ${item.page || "—"}`,
                    }))}
                    selectedId={selectedContract?.id ?? ""}
                    onSelect={setContractId}
                  />
                </label>
              )}
              {purchaseType === "Benefício de Contrato" && (
                <label>
                  {tr("Benefício","Benefit")}
                  <ExperiencePowerPicker
                    kind="Benefício de Contrato"
                    items={benefitOptions.map((option)=>{
                      const [kind,contractId,choice]=option.value.split("::"), contract=findContractInCatalog(contractId), isClause=kind==="clause";
                      return {id:option.value,name:option.label,category:isClause?"Clause":tr("Benefício de Feição","Seeming Benefit"),secondaryCategory:isClause?courtDisplayName(choice,locale):seemingDisplayName(choice,locale),description:isClause?contract?.courtClauses?.[choice]??"":contract?.seemingBenefits?.[choice as keyof typeof contract.seemingBenefits]??"",meta:`${contract?.name??tr("Contrato","Contract")} · ${contract?.source??""} · p. ${contract?.page||"—"}`};
                    })}
                    selectedId={benefitKey || benefitOptions[0]?.value || ""}
                    onSelect={setBenefitKey}
                  />
                </label>
              )}
            </div>
            <div className="purchase-preview">
              <strong>{preview.label}</strong>
              <span>
                {preview.cost} {tr(preview.cost===1?"Experiência":"Experiências","Experience")}
              </span>
            </div>
            {feedback && <p className="experience-feedback">{feedback}</p>}
            <ExperienceRules />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{tr("Fechar","Close")}</Button>
              </DialogClose>
              <Button
                type="button"
                size="sm"
                className="catalog-selection-action"
                disabled={preview.cost < 1 || available < preview.cost}
                onClick={buy}
              >
                {tr("Comprar por","Purchase for")} {preview.cost} {tr("EXP","XP")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="permanent-resource-actions">
          <ConfirmAction trigger={<Button type="button" variant="ghost" size="sm" className="catalog-selection-action">{tr("Ganhar Lucidez","Gain Clarity")}</Button>} title={tr("Adicionar uma caixa permanente de Lucidez?","Add a permanent Clarity box?")} description={tr("Isso adicionará uma caixa permanente de Lucidez sem custo de Experiência e registrará uma entrada reversível no histórico.","This adds one permanent Clarity box at no Experience cost and records a reversible history entry.")} action={tr("Adicionar Lucidez","Add Clarity")} destructive={false} onConfirm={gainClarity}/>
          <span aria-hidden="true">|</span>
          <ConfirmAction trigger={<Button type="button" variant="ghost" size="sm" className="catalog-selection-action">{tr("Perder FV","Lose WP")}</Button>} title={tr("Perder permanentemente um ponto de Força de Vontade?","Permanently lose one Willpower dot?")} description={tr("Isso reduzirá a Força de Vontade permanente em um ponto e registrará uma entrada reversível no histórico.","This reduces permanent Willpower by one dot and records a reversible history entry.")} action={tr("Perder FV","Lose WP")} onConfirm={markWillpowerLoss}/>
        </div>
      </div>
      {feedback && <p className="experience-feedback compact">{feedback}</p>}
      <details className="experience-history">
        <summary>
          <History /> {tr("Gastos de Experiência","Experience Expenses")} ({history.length})
        </summary>
        <div>
          {history.length ? (
            history.slice(0, 12).map((entry) => (
              <p key={entry.id}>
                <span>{entry.description}</span>
                <strong>{Math.abs(entry.experience)} EXP</strong>
                <small>
                  {new Date(entry.createdAt).toLocaleDateString(locale)}
                </small>
                {entry.undo?.kind==="merit"&&["Entitlement","Fae Mount","Fae Pet"].includes(entry.undo.name)?<ConfirmAction trigger={<Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!entry.undo}
                >
                  <RotateCcw /> {tr("Reverter","Refund")}
                </Button>} title={tr(`Reembolsar ${entry.undo.name}?`,`Refund ${entry.undo.name}?`)} description={entry.undo.name==="Entitlement"?tr("O reembolso removerá o Título, suas graduações, Blessings, Heráldica e todos os benefícios concedidos.","The refund will remove the Entitlement, its ranks, Blessings, Heraldry, and all granted benefits."):tr("O reembolso removerá o Mérito e seu Companion vinculado.","The refund will remove the Merit and its linked Companion.")} action={tr("Reembolsar","Refund")} onConfirm={()=>revertPurchase(entry)}/>:<Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={()=>revertPurchase(entry)}><RotateCcw /> {tr("Reverter","Refund")}</Button>}
              </p>
            ))
          ) : (
            <em>{tr("Nenhum gasto registrado.","No expenses recorded.")}</em>
          )}
        </div>
      </details>
    </section>
  );
}
