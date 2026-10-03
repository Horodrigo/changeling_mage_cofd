"use client";
import { meritProblemMessage } from "@/lib/merit-ui";
import { useState } from "react";
import { History, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { MTA_PATHS } from "@/game-lines/mage/creation-rules";
import { meritRatingsFor, type MeritDefinition } from "@/lib/merits";
import type { SpellDefinition } from "@/lib/catalog/spell-catalog";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { meetsArcanaRequirements } from "@/game-lines/mage/builder-eligibility";
import { withMagePowerRating } from "@/game-lines/mage/builder-power-progression";
import { refundMageAdvancement, type MageAdvancementUndo } from "./experience-refunds";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { MAGE_SHEET_MERIT_CONFIGURATIONS, normalizeMeritConfiguration, synchronizeMeritGrants } from "@/game-lines/mage/sheet-merit-configurations";
import { renderMageStructuredMeritEditor } from "@/game-lines/mage/merit-configuration-editor";
import { masqueConfigurationDots } from "./merit-configurations";
import { findLegacy, LEGACIES, normalizeLegacyState } from "@/game-lines/mage/legacies";
import { mergeLegacyHomebrews } from "./legacy-homebrews";
import { refundLegacyExperiencePurchase } from "./legacy-progression";
import { RuleSelect } from "@/app/workspace/rule-select";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { createRandomId } from "@/lib/random-id";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { meritMatchesDefinition, meritInstanceIsUnique } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import { mageExperienceLabel, type MageExperienceEntry } from "./experience-presentation";
import { activeSpellCatalog } from "./spell-homebrews";
import { useSpellHomebrews } from "./use-spell-homebrews";
import type { MageFactionDefinition } from "./factions";
import { canAdvanceMageGrant, mageMeritContextForSheet, mageMeritPrerequisitesMet, mageMeritSelectionProblems } from "./merits";
import { useLegacyHomebrews } from "./use-legacy-homebrews";

const objectList=(value:unknown)=>Array.isArray(value)?value as Array<Record<string,unknown>>:[];
const boundedNumber=(value:unknown,maximum:number,fallback:number)=>Math.max(0,Math.min(maximum,Number.isFinite(Number(value))?Number(value):fallback));
import { BeatTrack, ExperienceMeritPicker, ExperiencePowerPicker, ExperienceRatingPicker, convertFifthBeat, experiencePurchaseBalances, groupedPurchaseOptions, isRepeatableDefinition, ratingPurchaseCost, recalculateCoreDerived, type ExperiencePurchaseGroup } from "@/app/workspace/experience-shared";
import { formatSpellRequirements, MageExperienceRules } from "./experience-shared";

type MagePurchaseType = "attribute" | "skill" | "specialty" | "merit" | "arcanum" | "gnosis" | "rote" | "praxis" | "wisdom" | "willpower";
const PURCHASE_LABEL_KEYS = {
  attribute: "ui.attribute", skill: "ui.skill", specialty: "ui.specialty", merit: "ui.merit", arcanum: "ui.arcanum",
  gnosis: "ui.gnosis", rote: "ui.rote", praxis: "ui.praxis", wisdom: "ui.wisdom", willpower: "ui.lostWillpowerDot",
} as const;
const groupedTraitOptions=(groups:Record<string,readonly string[]>)=>Object.entries(groups).flatMap(([group,values])=>values.map(value=>({value,label:value,group})));
const ATTRIBUTE_OPTIONS=groupedTraitOptions(ATTRIBUTES);
const SKILL_OPTIONS=groupedTraitOptions(SKILLS);
type MageXpEntry = MageExperienceEntry;
const MAGE_PURCHASE_GROUPS = [
  { group: "core", purchases: ["attribute", "skill", "specialty", "merit"] },
  { group: "supernatural", purchases: ["gnosis", "arcanum"] },
  { group: "integrity", purchases: ["wisdom", "willpower"] },
  { group: "acquired", purchases: ["rote", "praxis"] },
] as const satisfies readonly ExperiencePurchaseGroup<MagePurchaseType>[];
const MAGE_PURCHASES = MAGE_PURCHASE_GROUPS.flatMap(({ purchases }) => [...purchases]);
export function MageExperiencePanel({
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
  const state = character.current_state ?? {};
  const regular = Math.max(
    0,
    Math.trunc(Number(state.mage_experience_available ?? 0) || 0),
  );
  const arcane = Math.max(
    0,
    Math.trunc(Number(state.arcane_experience_available ?? 0) || 0),
  );
  const spentRegular = Math.max(
    0,
    Math.trunc(Number(state.mage_experience_spent ?? 0) || 0),
  );
  const spentArcane = Math.max(
    0,
    Math.trunc(Number(state.arcane_experience_spent ?? 0) || 0),
  );
  const beats = boundedNumber(state.mage_experience_beats, 5, 0),
    arcaneBeats = boundedNumber(state.arcane_experience_beats, 5, 0);
  const maximumLostWillpower = Math.max(
    0,
    Number(character.derived.ForçaDeVontade ?? 1) - 1,
  );
  const lostWillpower = boundedNumber(
    state.willpower_lost_dots,
    maximumLostWillpower,
    0,
  );
  const history = Array.isArray(state.mage_experience_history)
    ? (state.mage_experience_history as MageXpEntry[])
    : [];
  const [regularInput, setRegularInput] = useState<string | null>(null),
    [arcaneInput, setArcaneInput] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<MagePurchaseType>(MAGE_PURCHASES[0]),
    [target, setTarget] = useState<string>(Object.values(ATTRIBUTES).flat()[0]);
  const [targetRating, setTargetRating] = useState(0);
  const [mageSpecialtySkill,setMageSpecialtySkill]=useState<string>(Object.values(SKILLS).flat()[0]);
  const [mageSpecialtyName,setMageSpecialtyName]=useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [mageMeritInstance, setMageMeritInstance] = useState(-1);
  const [mageMeritConfiguration,setMageMeritConfiguration] = useState<Record<string,string|string[]>>({});
  const [regularSplit, setRegularSplit] = useState(0),
    [feedback, setFeedback] = useState("");
  const customMerits=useMeritHomebrews("MtA",true),customSpells=useSpellHomebrews(),customLegacies=useLegacyHomebrews(),homebrewPreferences=useHomebrewPreferences();
  const legacyCatalog=mergeLegacyHomebrews(LEGACIES,customLegacies);
  const meritCatalog = activeMeritCatalog([
      ...catalogs.get<MeritDefinition[]>("core-merits"),
      ...catalogs.get<MeritDefinition[]>("mage-merits"),
    ],customMerits,homebrewPreferences,character.merits),
    meritContext = mageMeritContextForSheet(character, meritCatalog),
    merits = meritCatalog.filter(item=>mageMeritPrerequisitesMet(item,meritContext)),
    spells = activeSpellCatalog(catalogs.get<SpellDefinition[]>("mage-spells"),customSpells,homebrewPreferences),
    factionCatalog = catalogs.get<MageFactionDefinition[]>("mage-factions");
  const arcana = (
    character.line_data.arcana && typeof character.line_data.arcana === "object"
      ? character.line_data.arcana
      : {}
  ) as Record<string, number>;
  const path =
    MTA_PATHS[String(character.line_data.path) as keyof typeof MTA_PATHS];
  const activeLegacy=normalizeLegacyState(character.line_data.legacy_state);
  const activeLegacyDefinition=findLegacy(activeLegacy.definitionId,customLegacies);
  const knownSpellIds = new Set(
    [
      ...objectList(character.line_data.rotes),
      ...objectList(character.line_data.praxes),
      ...objectList(character.line_data.learned_rotes),
      ...objectList(character.line_data.learned_praxes),
    ].map((item) => String(item.id ?? "")),
  );
  const availableSpells = spells.filter(
    (spell) =>
      !knownSpellIds.has(spell.id) &&
      meetsArcanaRequirements(spell.requirements, arcana),
  );
  const options =
    purchase === "attribute"
      ? Object.values(ATTRIBUTES).flat()
      : purchase === "skill" || purchase === "specialty"
        ? Object.values(SKILLS).flat()
        : purchase === "merit"
          ? merits.map((item) => item.id)
          : purchase === "arcanum"
            ? Object.keys(arcana)
            : purchase === "rote" || purchase === "praxis"
              ? availableSpells.map((item) => item.id)
              : [purchase];
  const chosenTarget=target||options[0]||"";
  const selectedMerit = merits.find((item) => item.id === target),
    ownedMerit = mageMeritInstance >= 0
        ? selectedMerit && character.merits[mageMeritInstance] && meritMatchesDefinition(character.merits[mageMeritInstance], selectedMerit, meritCatalog) && meritInstanceIsUnique(character.merits[mageMeritInstance], character.merits) ? character.merits[mageMeritInstance] : undefined
        : undefined,
    meritRatings = selectedMerit
      ? meritRatingsFor(selectedMerit,(ownedMerit?.dots??0)+1).filter(
          (dot) => dot > (ownedMerit?.dots ?? 0),
        )
      : [],
    nextMerit = meritRatings.includes(meritDots) ? meritDots : meritRatings[0];
  const selectedSpell =
    availableSpells.find((item) => item.id === target) ?? availableSpells[0];
  const traitMaximum = Math.max(5, Number(character.line_data.gnosis ?? 1));
  const permanentWillpowerMaximum = Math.max(1, Number(character.derived.ForçaDeVontade ?? 1));
  const ratedCurrent = purchase === "attribute" ? Number(character.attributes[chosenTarget] ?? 1)
    : purchase === "skill" ? Number(character.skills[chosenTarget] ?? 0)
      : purchase === "arcanum" ? Number(arcana[chosenTarget] ?? 0)
        : purchase === "gnosis" ? Number(character.line_data.gnosis ?? 1)
          : purchase === "wisdom" ? Number(character.line_data.wisdom ?? 7)
            : purchase === "willpower" ? permanentWillpowerMaximum - lostWillpower
              : 0;
  const ratedMaximum = purchase === "attribute" || purchase === "skill" ? traitMaximum
    : ["arcanum", "gnosis", "wisdom"].includes(purchase) ? 10
      : purchase === "willpower" ? permanentWillpowerMaximum
        : 0;
  const intendedRating = ratedCurrent < ratedMaximum ? Math.max(ratedCurrent + 1, Math.min(ratedMaximum, targetRating || ratedCurrent + 1)) : ratedCurrent;
  const ratingAmount = Math.max(0, intendedRating - ratedCurrent);
  let cost = 1,
    label: string = systemTerm(chosenTarget,locale),
    mode: "regular" | "arcane" | "either" = "regular",
    minimumRegular = 0;
  if (purchase === "attribute") { cost = 4 * ratingAmount; label = `${systemTerm(chosenTarget, locale)} ${intendedRating}`; }
  else if (purchase === "skill") { cost = 2 * ratingAmount; label = `${systemTerm(chosenTarget, locale)} ${intendedRating}`; }
  else if (purchase === "specialty") {
    cost = 1;
    label = `${t("ui.specialty")} ${systemTerm(mageSpecialtySkill,locale)}: ${mageSpecialtyName.trim()||t("ui.newSpecialty")}`;
  }
  else if (purchase === "merit") {
    cost = nextMerit ? nextMerit - (ownedMerit?.dots ?? 0) : 0;
    label = selectedMerit ? meritPresentation(selectedMerit, locale).name : t("ui.merit");
  } else if (purchase === "arcanum") {
    const current = Number(arcana[chosenTarget] ?? 0);
    const ruling = path?.ruling.includes(chosenTarget as never)||activeLegacy.joined&&activeLegacyDefinition?.rulingArcanum===systemTerm(chosenTarget,"en-US");
    const inferior = path?.inferior === chosenTarget;
    const limit = ruling ? 5 : inferior ? 2 : 4;
    cost = ratingPurchaseCost(current, intendedRating, (rating) => rating <= limit ? 4 : 5);
    minimumRegular = ratingPurchaseCost(Math.max(current, limit), intendedRating, 5);
    mode = minimumRegular < cost ? "either" : "regular";
    label = `${systemTerm(chosenTarget,locale)} ${intendedRating}`;
  } else if (purchase === "gnosis") {
    cost = 5 * ratingAmount;
    mode = "either";
    label = `${t("ui.gnosis")} ${intendedRating}`;
  } else if (purchase === "rote") {
    cost = 1;
    label = (locale==="en-US"?selectedSpell?.originalName:selectedSpell?.name) ?? t("ui.rote");
  } else if (purchase === "praxis") {
    cost = 1;
    mode = "arcane";
    label = (locale==="en-US"?selectedSpell?.originalName:selectedSpell?.name) ?? t("ui.praxis");
  } else if (purchase === "wisdom") {
    cost = 2 * ratingAmount;
    mode = "arcane";
    label = `${t("ui.wisdom")} ${intendedRating}`;
  } else if (purchase === "willpower") {
    cost = lostWillpower ? ratingAmount : 0;
    label = lostWillpower
      ? `${t("ui.willpower")} ${intendedRating}`
      : t("ui.noLostDots");
  }
  const splitRegular = builderMode
      ? mode === "arcane" ? 0 : cost
      : mode === "regular"
        ? cost
        : mode === "arcane"
          ? 0
          : Math.max(minimumRegular, Math.min(cost, regularSplit)),
    splitArcane = builderMode
      ? mode === "arcane" ? cost : 0
      : mode === "arcane" ? cost : mode === "regular" ? 0 : cost - splitRegular;
  const saveBalances = (patch: Record<string, unknown>) => {
    const next = structuredClone(character);
    next.current_state = { ...next.current_state, ...patch };
    updateSheet(next);
  };
  function commitBalances() {
    const r = Math.max(0, Math.trunc(Number(regularInput ?? regular) || 0)),
      a = Math.max(0, Math.trunc(Number(arcaneInput ?? arcane) || 0));
    setRegularInput(null);
    setArcaneInput(null);
    saveBalances({
      mage_experience_available: r,
      arcane_experience_available: a,
      mage_experience_total: r + spentRegular,
      arcane_experience_total: a + spentArcane,
    });
  }
  function buy() {
    if(purchase==="merit"){
      if(!selectedMerit||!nextMerit)return setFeedback(t("ui.selectAnAvailableMerit"));
      if (mageMeritInstance >= 0 && (!ownedMerit || (ownedMerit.grantedBy && !canAdvanceMageGrant(ownedMerit, meritCatalog)))) return setFeedback(t("ui.selectAnAvailableMerit"));
      if (mageMeritInstance < 0 && !isRepeatableDefinition(selectedMerit) && character.merits.some(item => meritMatchesDefinition(item, selectedMerit, meritCatalog))) return setFeedback(t("ui.selectAnAvailableMerit"));
      if(!isRepeatableDefinition(selectedMerit)&&character.merits.some(item=>meritMatchesDefinition(item,selectedMerit,meritCatalog)&&item.grantedBy&&!canAdvanceMageGrant(item,meritCatalog)))return setFeedback(t("ui.thisMeritIsAlreadyGranted"));
      const problems=mageMeritSelectionProblems(selectedMerit,{dots:nextMerit,configuration:mageMeritConfiguration},meritContext,factionCatalog,character.line_data.affiliation_id);
      if(problems.length)return setFeedback(problems.map(problem=>meritProblemMessage(problem,selectedMerit,locale,meritCatalog)).join(" "));
    }
    if(purchase==="specialty"&&!mageSpecialtyName.trim())return setFeedback(t("ui.enterTheSpecialtyName"));
    if (cost < 1 || (!builderMode && (regular < splitRegular || arcane < splitArcane))) {
      setFeedback(t("ui.insufficientExperienceOrUnavailablePurchase"));
      return;
    }
    if ((purchase === "gnosis" && Number(character.line_data.gnosis ?? 1) >= 10) ||
        (purchase === "wisdom" && Number(character.line_data.wisdom ?? 7) >= 10) ||
        (purchase === "arcanum" && Number(arcana[chosenTarget] ?? 0) >= 10) ||
        (purchase === "attribute" && Number(character.attributes[chosenTarget] ?? 1) >= traitMaximum) ||
        (purchase === "skill" && Number(character.skills[chosenTarget] ?? 0) >= traitMaximum))
      return setFeedback(t("ui.thisTraitHasReachedItsDotLimit"));
    if (
      (purchase === "rote" || purchase === "praxis") &&
      (!selectedSpell ||
        !meetsArcanaRequirements(selectedSpell.requirements, arcana))
    ) {
      setFeedback(t("ui.noAvailableSpellMeetsTheCurrentArcanaRatings"));
      return;
    }
    const next = structuredClone(character);
    let purchasedMeritIndex = -1;
    if (purchase === "attribute")
      next.attributes[chosenTarget] = intendedRating;
    else if (purchase === "skill")
      next.skills[chosenTarget] = intendedRating;
    else if (purchase === "merit" && selectedMerit && nextMerit) {
      purchasedMeritIndex = mageMeritInstance >= 0 ? mageMeritInstance : ownedMerit ? character.merits.indexOf(ownedMerit) : -1;
      const found = next.merits[purchasedMeritIndex];
      if (found && meritMatchesDefinition(found, selectedMerit, meritCatalog)) {addExperienceMeritDots(found, nextMerit-found.dots);found.configuration=normalizeMeritConfiguration(mageMeritConfiguration);}
      else {
        next.merits.push({
          definitionId: selectedMerit.id,
          name: selectedMerit.name,
          dots: nextMerit,
          creationDots: 0,
          experienceDots: nextMerit,
          sourceId: selectedMerit.sourceId,
          source: selectedMerit.source,
          configuration: normalizeMeritConfiguration(mageMeritConfiguration),
          instanceId:createRandomId(),
        });
        purchasedMeritIndex = next.merits.length - 1;
      }
      next.merits[purchasedMeritIndex].definitionId = selectedMerit.id;
      next.merits[purchasedMeritIndex].instanceId ??= createRandomId();
    } else if (purchase === "specialty")
      next.specializations.push({ skill: mageSpecialtySkill, name: mageSpecialtyName.trim() });
    else if (purchase === "arcanum")
      next.line_data = {
        ...next.line_data,
        arcana: { ...arcana, [chosenTarget]: intendedRating },
      };
    else if (purchase === "gnosis")
      next.line_data = withMagePowerRating(next, intendedRating);
    else if (purchase === "rote" && selectedSpell)
      next.line_data = {
        ...next.line_data,
        learned_rotes: [
          ...objectList(next.line_data.learned_rotes),
          { ...selectedSpell, roteSkill: selectedSpell.roteSkills[0] },
        ],
      };
    else if (purchase === "praxis" && selectedSpell)
      next.line_data = {
        ...next.line_data,
        learned_praxes: [
          ...objectList(next.line_data.learned_praxes),
          selectedSpell,
        ],
      };
    else if (purchase === "wisdom")
      next.line_data = {
        ...next.line_data,
        wisdom: intendedRating,
      };
    else if (purchase === "willpower")
      next.current_state = {
        ...next.current_state,
        willpower_lost_dots: Math.max(
          0,
          Number(next.current_state.willpower_lost_dots ?? 0) - ratingAmount,
        ),
      };
    recalculateCoreDerived(next);
    let undo: MageAdvancementUndo;
    if (purchase === "attribute" || purchase === "skill")
      undo = { kind: "trait", group: purchase === "attribute" ? "attributes" : "skills", name: chosenTarget, amount: ratingAmount };
    else if (purchase === "arcanum") undo = { kind: "arcana", name: chosenTarget, amount: ratingAmount, creditedArcane:activeLegacy.joined&&activeLegacyDefinition&&path?.ruling.some(item=>systemTerm(String(item),"en-US")===activeLegacyDefinition.rulingArcanum)&&systemTerm(chosenTarget,"en-US")===activeLegacyDefinition.rulingArcanum?ratingAmount:0 };
    else if (purchase === "gnosis") undo = { kind: "gnosis", amount: ratingAmount };
    else if (purchase === "wisdom") undo = { kind: "wisdom", amount: ratingAmount };
    else if (purchase === "merit") {
      const index = purchasedMeritIndex;
      if (index < 0 || !selectedMerit) return setFeedback(t("ui.thePurchasedMeritCouldNotBeIdentified"));
      const instanceId = next.merits[index].instanceId ?? createRandomId();
      next.merits[index].instanceId = instanceId;
      undo = { kind: "merit", definitionId: selectedMerit.id, name: selectedMerit.name, dots: cost, instanceId };
    } else if (purchase === "specialty") undo = { kind: "specialty", skill: mageSpecialtySkill, name: mageSpecialtyName.trim() };
    else if (purchase === "rote" || purchase === "praxis")
      undo = { kind: "spell", key: purchase === "rote" ? "learned_rotes" : "learned_praxes", id: selectedSpell.id };
    else undo = { kind: "willpower", amount: ratingAmount };
    const entry: MageXpEntry = {
      undo,
      id: createRandomId(),
      ...(ratedMaximum ? { rating: intendedRating } : purchase === "merit" ? { rating: nextMerit } : {}),
      regular: splitRegular,
      arcane: splitArcane,
      createdAt: new Date().toISOString(),
    };
    const regularBalance = experiencePurchaseBalances(regular, spentRegular, Number(next.current_state.mage_experience_total ?? 0), splitRegular, builderMode);
    const arcaneBalance = experiencePurchaseBalances(arcane, spentArcane, Number(next.current_state.arcane_experience_total ?? 0), splitArcane, builderMode);
    next.current_state = {
      ...next.current_state,
      mage_experience_available: regularBalance.available,
      arcane_experience_available: arcaneBalance.available + (builderMode ? 0 : undo.kind==="arcana" ? undo.creditedArcane ?? 0 : 0),
      mage_experience_spent: regularBalance.spent,
      arcane_experience_spent: arcaneBalance.spent,
      mage_experience_total: regularBalance.total,
      arcane_experience_total: arcaneBalance.total,
      mage_experience_history: [entry, ...history].slice(0, 100),
    };
    updateSheet(synchronizeMeritGrants(next));
    setFeedback(t("ui.purchased", { p1: label }));
    if(purchase==="specialty")setMageSpecialtyName("");
  }
  function markWillpowerLoss() {
    if (lostWillpower >= maximumLostWillpower) {
      setFeedback(t("ui.noAdditionalPermanentWillpowerDotCanBeLost"));
      return;
    }
    const next = structuredClone(character);
    const entry: MageXpEntry = {
      id: createRandomId(),
      undo: { kind: "willpowerLoss" },
      regular: 0,
      arcane: 0,
      createdAt: new Date().toISOString(),
      previousLostWillpower: lostWillpower,
    };
    next.current_state = {
      ...next.current_state,
      willpower_lost_dots: lostWillpower + 1,
      mage_experience_history: [entry, ...history].slice(0, 100),
    };
    updateSheet(next);
    setFeedback(t("ui.permanentWillpowerLossRecordedInHistory"));
  }
  function revert(entry: MageXpEntry) {
    if (!history.some(item => item.id === entry.id)) return;
    const undo = entry.undo;
    if (undo?.kind === "legacyInitiation" || undo?.kind === "legacyAttainment") {
      const next = structuredClone(character);
      if (!refundLegacyExperiencePurchase(next, entry.id)) return setFeedback(t("ui.legacyRefundUnavailable"));
      recalculateCoreDerived(next);
      updateSheet(synchronizeMeritGrants(next));
      return;
    }
    if (!undo || !Number.isInteger(entry.regular) || entry.regular < 0 || !Number.isInteger(entry.arcane) || entry.arcane < 0 || (undo.kind === "merit" && entry.regular + entry.arcane !== undo.dots) || (undo.kind === "wisdom" && entry.regular + entry.arcane === 0)) return setFeedback(t("ui.thisOlderPurchaseDoesNotIdentifyTheAdvancement"));
    const next = structuredClone(character);
    if (!refundMageAdvancement(next, undo)) return setFeedback(t("ui.thisOlderPurchaseDoesNotIdentifyTheAdvancement"));
    const creditedArcane = undo.kind==="arcana"?undo.creditedArcane??0:0;
    const refundedRegular = Number(entry.regular) || 0;
    const refundedArcane = Number(entry.arcane) || 0;
    const currentRegular = Number(next.current_state.mage_experience_available) || 0;
    const currentArcane = Number(next.current_state.arcane_experience_available) || 0;
    const currentSpentRegular = Number(next.current_state.mage_experience_spent) || 0;
    const currentSpentArcane = Number(next.current_state.arcane_experience_spent) || 0;
    next.current_state = {
      ...next.current_state,
      mage_experience_available: currentRegular + refundedRegular,
      arcane_experience_available: currentArcane + refundedArcane - Number(creditedArcane),
      mage_experience_spent: Math.max(0, currentSpentRegular - refundedRegular),
      arcane_experience_spent: Math.max(0, currentSpentArcane - refundedArcane),
      mage_experience_history: history.filter((item) => item.id !== entry.id),
    };
    recalculateCoreDerived(next);
    updateSheet(synchronizeMeritGrants(next));
  }
  const historyPanel = <details className="experience-history">
    <summary><History /> {t("ui.experienceExpenses")} ({history.length})</summary>
    <div>{history.length ? history.map((entry) => <p key={entry.id}><span>{mageExperienceLabel(entry, character, meritCatalog, spells, locale, legacyCatalog)}</span><strong>{entry.regular} {t("ui.xp")} + {entry.arcane} {t("ui.arcaneXP")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small><Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={() => revert(entry)}><RotateCcw /> {t("ui.refund")}</Button></p>) : <em>{t("ui.noExpensesRecorded")}</em>}</div>
  </details>;
  return (
    <section className="experience-panel mage-experience">
      <div className="experience-title">
        <div>
          <span>{builderMode ? t("ui.creationAdvancement") : t("ui.experience")}</span>
          <small>{builderMode ? t("ui.creationAdvancementDescription") : t("ui.regularAndArcaneExperienceUseSeparatePools")}</small>
        </div>
      </div>
      {!builderMode && <div className="mage-xp-balances">
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            value={regularInput ?? String(regular)}
            onChange={(e) => setRegularInput(e.target.value)}
            onBlur={commitBalances}
          />
          <span>{t("ui.xpAvailable")}</span>
        </label>
        <label className="experience-input">
          <Input
            type="number"
            min={0}
            value={arcaneInput ?? String(arcane)}
            onChange={(e) => setArcaneInput(e.target.value)}
            onBlur={commitBalances}
          />
          <span>{t("ui.arcaneXPAvailable")}</span>
        </label>
      </div>}
      {builderMode && <div className="experience-totals mage-creation-xp-totals">
        <div><strong>{regular + spentRegular}</strong><span>{t("ui.totalXP")}</span></div>
        <div><strong>{spentRegular}</strong><span>{t("ui.xpSpent")}</span></div>
        <div><strong>{arcane + spentArcane}</strong><span>{t("ui.arcaneXPTotal")}</span></div>
        <div><strong>{spentArcane}</strong><span>{t("ui.arcaneXPSpent")}</span></div>
      </div>}
      {!builderMode && <><BeatTrack
        label={t("ui.beats")}
        value={beats}
        onChange={(value) => { const change = convertFifthBeat(value, regular, Math.max(regular + spentRegular, Number(state.mage_experience_total ?? 0))); saveBalances({ mage_experience_beats: change.beats, mage_experience_available: change.available, mage_experience_total: change.total }); }}
      />
      <BeatTrack
        label={t("ui.arcaneBeats")}
        value={arcaneBeats}
        onChange={(value) => { const change = convertFifthBeat(value, arcane, Math.max(arcane + spentArcane, Number(state.arcane_experience_total ?? 0))); saveBalances({ arcane_experience_beats: change.beats, arcane_experience_available: change.available, arcane_experience_total: change.total }); }}
      /></>}
      <div className="experience-actions mage-experience-actions">
        <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="catalog-selection-action">
            <Sparkles /> {t("ui.purchaseTrait")}
          </Button>
        </DialogTrigger>
        <DialogContent className="experience-dialog">
          <DialogHeader>
            <DialogTitle>{t("ui.spendMageExperience")}</DialogTitle>
            <DialogDescription>
              {t("ui.costsFromMageTheAwakeningPp8385")}
            </DialogDescription>
          </DialogHeader>
          <div className="experience-purchase-form">
            <label>
              {t("ui.type")}
              <RuleSelect
                value={purchase}
                onChange={(value) => {
                  setPurchase(value as MagePurchaseType);
                  setTarget("");
                  setTargetRating(0);
                  setRegularSplit(0);
                }}
                options={groupedPurchaseOptions<MagePurchaseType>(builderMode ? [
                  { group: "core", purchases: ["attribute", "skill", "merit"] },
                  { group: "supernatural", purchases: ["gnosis", "arcanum"] },
                  { group: "acquired", purchases: ["rote", "praxis"] },
                ] : MAGE_PURCHASE_GROUPS, (value) => t(PURCHASE_LABEL_KEYS[value]), locale)}
              />
            </label>
            {purchase === "merit" && (
              <label>
                {t("ui.merit")}
                <ExperienceMeritPicker
                  line="MtA"
                  isEligible={mageMeritPrerequisitesMet}
                  context={meritContext}
                  canAdvanceGrant={merit => canAdvanceMageGrant(merit, meritCatalog)}
                  meritCatalog={meritCatalog}
                  character={character}
                  selectedId={selectedMerit?.id ?? ""}
                  targetDots={nextMerit ?? 0}
                  onSelect={(id, dots, instance) => {
                    setTarget(id);
                    setMeritDots(dots);
                    setMageMeritInstance(instance);
                    setMageMeritConfiguration(normalizeMeritConfiguration(character.merits[instance]?.configuration));
                  }}
                />
              </label>
            )}
            {purchase==="merit"&&selectedMerit&&nextMerit&&<MeritConfigurationEditor merit={{definitionId:selectedMerit.id,name:selectedMerit.name,dots:nextMerit,configuration:mageMeritConfiguration}} ownedMerits={character.merits} configurationDots={masqueConfigurationDots({definitionId:selectedMerit.id,name:selectedMerit.name}, character.merits, meritCatalog)} catalog={meritCatalog} definitions={MAGE_SHEET_MERIT_CONFIGURATIONS} renderStructured={(props)=>renderMageStructuredMeritEditor({...props,catalog:meritCatalog,factions:factionCatalog,order:String(character.line_data.order??"")})} onChange={setMageMeritConfiguration}/>}
            {purchase === "specialty" && <>
              <label>{t("ui.skill")}<RuleSelect value={mageSpecialtySkill} onChange={setMageSpecialtySkill} options={SKILL_OPTIONS}/></label>
              <label>{t("ui.specialty")}<Input value={mageSpecialtyName} onChange={(event)=>setMageSpecialtyName(event.target.value)} maxLength={80}/></label>
            </>}
            {purchase !== "merit" && purchase !== "specialty" &&
              ((purchase === "rote" || purchase === "praxis") ||
                options.length > 1) && (
              <label>
                {t("ui.trait")}
                {purchase === "rote" || purchase === "praxis" ? (
                  <ExperiencePowerPicker
                    kind={purchase === "rote" ? "Rota" : "Práxis"}
                    items={availableSpells.map((spell) => {
                      const requirements = Object.entries(spell.requirements).sort(
                        (a, b) => b[1] - a[1],
                      );
                      const [mainArcanum, level] = requirements[0] ?? ["Outro", 0];
                      return {
                        id: spell.id,
                        name: locale==="en-US"?(spell.originalName||spell.name):spell.name,
                        category: systemTerm(mainArcanum,locale),
                        secondaryCategory: `${t("ui.level")} ${level}`,
                        description: spell.description ?? "",
                        meta: `${formatSpellRequirements(spell.requirements, locale)} · ${spell.source} · p. ${spell.page || "—"}`,
                      };
                    })}
                    selectedId={selectedSpell?.id ?? ""}
                    onSelect={setTarget}
                  />
                ) : (
                  <RuleSelect
                    value={chosenTarget}
                    onChange={(value) => { setTarget(value); setTargetRating(0); }}
                    options={
                      purchase === "attribute"
                        ? ATTRIBUTE_OPTIONS
                        : purchase === "skill"
                          ? SKILL_OPTIONS
                          : options.map((value) => ({ value, label: value }))
                    }
                  />
                )}
              </label>
            )}
            {ratedMaximum > ratedCurrent && <ExperienceRatingPicker current={ratedCurrent} maximum={ratedMaximum} value={intendedRating} onChange={setTargetRating} />}
            {mode === "either" && (
              <div className="mage-experience-split">
                <label>
                  {t("ui.experience")}
                  <Input
                    type="number"
                    min={minimumRegular}
                    max={cost}
                    value={splitRegular}
                    onChange={(e) =>
                      setRegularSplit(
                        Math.max(
                          minimumRegular,
                          Math.min(cost, Number(e.target.value) || 0),
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  {t("ui.arcaneExperience")}
                  <Input
                    type="number"
                    value={splitArcane}
                    readOnly
                  />
                </label>
              </div>
            )}
          </div>
          <div className="purchase-preview">
            <strong>{label}</strong>
            <span>
              {splitRegular} {t("ui.xp")} + {splitArcane} {t("ui.arcaneXP")}
            </span>
          </div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          <MageExperienceRules />
          {historyPanel}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              className="catalog-selection-action"
              disabled={
                cost < 1 || (!builderMode && (regular < splitRegular || arcane < splitArcane))
              }
              onClick={buy}
            >
              {t("ui.purchase")}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
        {!builderMode && <ConfirmAction trigger={<Button type="button" variant="ghost" size="sm" className="catalog-selection-action">{t("ui.loseWP")}</Button>} title={t("ui.permanentlyLoseOneWillpowerDot")} description={t("ui.thisReducesPermanentWillpowerByOneDotAnd")} action={t("ui.loseWP")} onConfirm={markWillpowerLoss}/>}
      </div>
      {builderMode && historyPanel}
    </section>
  );
}
