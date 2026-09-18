"use client";

import { AnimalCard } from "@/app/workspace/companion-page";
import { RuleSelect } from "@/app/workspace/rule-select";
import { ArmorDotPicker, CompactValues, HealthTrack, SheetHeading, TraitBlock, stringList } from "@/app/workspace/sheet-primitives";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { ANIMALS, animalPresentation } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { ATTRIBUTES } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import type { DamageLevel } from "@/lib/resource-rules";

const FAE_MOUNT_ABILITIES = [
  ["manyleague", "Manyleague", "Dobra o Deslocamento; soma os pontos do Mérito à Iniciativa da montaria sozinha ou do dono montado.", "Double Speed; add Merit dots to the mount's Initiative, whether alone or carrying its owner."],
  ["chatterbox", "Chatterbox", "Fala e entende claramente o dono e transmite mensagens simples no idioma dele.", "Speaks with and clearly understands its owner and conveys simple messages in the owner's language."],
  ["actormask", "Actormask", "Pode deixar a Sebe; por 1 Glamour por cena mantém uma Máscara no mundo mundano.", "May leave the Hedge; for 1 Glamour per scene it maintains a Mask in the mundane world."],
  ["armorshell", "Armorshell", "Armadura 3/2 e ocultação parcial para o cavaleiro.", "Gain Armor 3/2 and provide partial concealment to the rider."],
  ["burdenback", "Burdenback", "Carrega pessoas adicionais iguais aos pontos do Mérito e recebe +2 Vigor.", "Carry additional people equal to Merit dots and gain +2 Stamina."],
  ["dreamspun", "Dreamspun", "Ressurge após uma noite completa de sono do dono e recebe Furtividade igual aos pontos do Mérito.", "Return after the owner completes a full night's sleep and gain Stealth equal to Merit dots."],
  ["thornbeast", "Thornbeast", "+2 dados nos ataques e modificador de arma +2.", "Gain +2 attack dice and +2 weapon damage."],
  ["hedgefoot", "Hedgefoot", "Escolha correr sobre água, escalar ou voar.", "Choose to run across water, climb, or fly."],
] as const;

export function CompanionPage({ character, updateSheet }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void }) {
  const { t } = useLanguage();
  const faeCompanions = character.merits
    .map((merit, index) => ({ merit, index }))
    .filter(({ merit }) => !merit.grantedBy && ["Fae Mount", "Fae Pet"].includes(merit.name));
  return <section className="changeling-companions">
    {!!faeCompanions.length && <>
      <SheetHeading>{t("ui.faeCompanions")}</SheetHeading>
      {faeCompanions.map(({ merit, index }) => <FaeCompanionCard key={`${merit.name}-${index}`} merit={merit} meritIndex={index} character={character} updateSheet={updateSheet}/>)}
    </>}
  </section>;
}

function FaeCompanionCard({ merit, meritIndex, character, updateSheet }: {
  merit: CharacterSheet["merits"][number];
  meritIndex: number;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, t } = useLanguage();
  const isMobile = useIsMobile();
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const name = String(configuration.name ?? (merit.name === "Fae Mount" ? t("ui.faeMount") : t("ui.faePet")));
  const save = (patch: Record<string, string | string[]>) => {
    const next = structuredClone(character);
    const target = next.merits[meritIndex];
    if (target?.name === merit.name) target.configuration = { ...normalizeMeritConfiguration(target.configuration), ...patch };
    updateSheet(next);
  };

  if (merit.name === "Fae Pet") {
    const animalId = String(configuration.animalId ?? ANIMALS[0]?.id ?? "");
    const animal = ANIMALS.find(item => item.id === animalId);
    return <article className="companion-card merit-companion companion-config">
      <header><div><strong>{name}</strong><small>Fae Pet · {merit.dots} {t("ui.dots33098e")}</small></div></header>
      <div className="companion-form-grid">
        <label>{t("ui.name")}<Input value={name} onChange={event => save({ name: event.target.value })}/></label>
        <label>{t("ui.animal")}<RuleSelect value={animalId} onChange={value => save({ animalId: value })} options={ANIMALS.map(item => animalPresentation(item, locale)).map(item => ({ value: item.id, label: item.name }))}/></label>
        <label>{t("ui.dreadPower")}<Input value={String(configuration.dread_power ?? "")} onChange={event => save({ dread_power: event.target.value })}/></label>
      </div>
      {animal && <AnimalCard animal={animalPresentation(animal, locale)} name={name} onRemove={() => {}} removable={false}/>} 
    </article>;
  }

  const abilities = stringList(configuration.abilities).slice(0, merit.dots);
  const hedgefoot = String(configuration.hedgefoot ?? "water");
  const burden = abilities.includes("burdenback");
  const many = abilities.includes("manyleague");
  const thorn = abilities.includes("thornbeast");
  const dreamspun = abilities.includes("dreamspun");
  const armorshell = abilities.includes("armorshell");
  const ownGeneral = Math.max(0, Math.min(5, Number(configuration.armor_general ?? 0)));
  const ownBallistic = Math.max(0, Math.min(5, Number(configuration.armor_ballistic ?? 0)));
  const health = 12 + (burden ? 2 : 0);
  const mountDamage = stringList(configuration.health_damage).filter((value): value is DamageLevel => ["bashing", "lethal", "aggravated"].includes(value)).slice(0, health);
  const mountAttributes = { Intelligence: 1, Wits: 3, Resolve: 3, Strength: 5, Dexterity: 3, Stamina: 5 + (burden ? 2 : 0), Presence: 3, Manipulation: 1, Composure: 2 };
  const special = [
    t("ui.canLiftFourTimesAsMuchAsA"),
    burden ? t("ui.canCarryRiders", { p1: 1 + merit.dots }) : t("ui.canCarryOneRider"),
    abilities.includes("chatterbox") ? t("ui.speaksWithItsOwnerAndConveysSimpleMessages") : "",
    abilities.includes("actormask") ? t("ui.canLeaveTheHedgeAndMaintainAMask") : "",
    dreamspun ? t("ui.returnsToLifeAfterItsOwnerCompletesA") : "",
    armorshell ? t("ui.providesPartialConcealmentToTheRider") : "",
    abilities.includes("hedgefoot") ? (hedgefoot === "water" ? t("ui.movesAcrossWater") : hedgefoot === "climb" ? t("ui.climbsAtThreeTimesSpeed") : t("ui.canFlyOncePerScene")) : "",
  ].filter(Boolean).join(" ");

  return <article className="companion-card merit-companion companion-config">
    <header><div><strong>{name}</strong><small>{t("ui.faeMount")} · {merit.dots} {t("ui.dots33098e")} · {t("ui.choose")} {merit.dots} {t("ui.abilitiesf766fc")}</small></div></header>
    <Input value={name} onChange={event => save({ name: event.target.value })} placeholder={t("ui.mountName")}/>
    <div className="mount-attribute-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={mountAttributes} compactNames={isMobile}/>)}</div>
    <p><b>{t("ui.skills")}:</b> {t("ui.athletics4Brawl1KickingSurvival2")}{dreamspun ? `, ${t("ui.stealth")} ${merit.dots}` : ""}</p>
    <div className="mount-combat-block"><CompactValues values={{ "Força de Vontade": 5, Iniciativa: 5 + (many ? merit.dots : 0), Defesa: 7, Deslocamento: many ? 38 : 19, Tamanho: 7, "Armadura geral": Math.max(ownGeneral, armorshell ? 3 : 0), "Armadura balística": Math.max(ownBallistic, armorshell ? 2 : 0) }}/><div className="mount-armor-editors"><ArmorDotPicker label={t("ui.generalArmor")} value={ownGeneral} onChange={value => save({ armor_general: String(value) })}/><ArmorDotPicker label={t("ui.ballisticArmor")} value={ownBallistic} onChange={value => save({ armor_ballistic: String(value) })}/></div>{armorshell && <small>{t("ui.armorshellProvidesArmor32OnlyTheHigher")}</small>}<strong>{t("ui.health")}</strong><HealthTrack health={health} damage={mountDamage} onChange={value => save({ health_damage: value })}/></div>
    <p><b>{t("ui.attacks")}:</b> {t("ui.bite")} {thorn ? "+2L" : "+0L"} ({5 + (thorn ? 2 : 0)} {t("ui.dice")}); {t("ui.kickOrClaw")} {thorn ? "+4L" : "+2L"} ({6 + (thorn ? 2 : 0)} {t("ui.dice")}, {t("ui.knockedDown")}).</p>
    <p><b>{t("ui.special")}:</b> {special}</p>
    <div className="companion-options">{alphabetical(FAE_MOUNT_ABILITIES, item => item[1]).filter(([id]) => abilities.length < merit.dots || abilities.includes(id)).map(([id, label, description, descriptionEn]) => {
      const active = abilities.includes(id);
      return <label key={id} className={active ? "selected" : ""}><input type="checkbox" checked={active} disabled={!active && abilities.length >= merit.dots} onChange={() => save({ abilities: active ? abilities.filter(value => value !== id) : [...abilities, id] })}/><span><strong>{label}</strong><small>{locale === "en-US" ? descriptionEn : description}</small></span></label>;
    })}</div>
    {abilities.includes("hedgefoot") && <label className="companion-field">{t("ui.hedgefootMode")}<RuleSelect value={hedgefoot} onChange={value => save({ hedgefoot: value })} options={[{ value: "water", label: t("ui.runAcrossWaterAtNormalSpeed") }, { value: "climb", label: t("ui.climbAtThreeTimesSpeed") }, { value: "fly", label: t("ui.flyOncePerScene") }]}/></label>}
  </article>;
}
