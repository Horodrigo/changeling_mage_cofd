"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CharacterSheet } from "../character-builder";
import { useLanguage } from "@/lib/i18n";
import { ANIMALS, animalPresentation, type Animal } from "@/lib/companions";
import { normalizeMeritConfiguration } from "@/lib/merit-configurations";
import { ATTRIBUTES } from "@/lib/creation-rules";
import { alphabetical } from "@/lib/option-order";
import type { DamageLevel } from "@/lib/resource-rules";
import { ArmorDotPicker, CompactValues, HealthTrack, SheetHeading, TraitBlock, stringList } from "./sheet-primitives";
import { RuleSelect } from "./rule-select";

const objectList=(value:unknown)=>Array.isArray(value)?value as Array<Record<string,unknown>>:[];
export function CompanionPage({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const presentedAnimals=ANIMALS.map((item)=>animalPresentation(item,locale));
  const bonded=objectList(character.current_state?.conditions).filter((item)=>String(item.id)==="bonded"&&String(item.animalId??""));
  const configuredCompanions = character.merits
    .map((merit, index) => ({ merit, index }))
    .filter(
      ({ merit }) =>
        !merit.grantedBy && ["Fae Mount", "Fae Pet", "Familiar"].includes(merit.name),
    );
  return (
    <div className="companions-page">
      <section>
        <SheetHeading>Companheiros</SheetHeading>
        {configuredCompanions.map(({ merit, index }) => (
          <MeritCompanionCard
            key={`${merit.name}-${index}`}
            merit={merit}
            meritIndex={index}
            character={character}
            updateSheet={updateSheet}
          />
        ))}
        <div className="companion-grid">
          {bonded.map((saved, index) => {
            const animal = presentedAnimals.find((item) => item.id === String(saved.animalId));
            return animal ? (
              <AnimalCard
                key={String(saved.instanceId??`${saved.animalId}-${index}`)}
                animal={animal}
                name={String(saved.animalName??"")}
                onRemove={()=>{}}
                removable={false}
              />
            ) : null;
          })}
        </div>
      </section>
      <small className="combat-source">{tr("Animais: blocos de estatísticas de animais de World of Darkness.","Animals: World of Darkness animal stat blocks.")}</small>
    </div>
  );
}
const FAE_MOUNT_ABILITIES = [
  [
    "manyleague",
    "Manyleague",
    "Dobra o Deslocamento; soma os pontos do Mérito à Iniciativa da montaria sozinha ou do dono montado.",
    "Double Speed; add Merit dots to the mount's Initiative, whether alone or carrying its owner.",
  ],
  [
    "chatterbox",
    "Chatterbox",
    "Fala e entende claramente o dono e transmite mensagens simples no idioma dele.",
    "Speaks with and clearly understands its owner and conveys simple messages in the owner's language.",
  ],
  [
    "actormask",
    "Actormask",
    "Pode deixar a Sebe; por 1 Glamour por cena mantém uma Máscara no mundo mundano.",
    "May leave the Hedge; for 1 Glamour per scene it maintains a Mask in the mundane world.",
  ],
  [
    "armorshell",
    "Armorshell",
    "Armadura 3/2 e ocultação parcial para o cavaleiro.",
    "Gain Armor 3/2 and provide partial concealment to the rider.",
  ],
  [
    "burdenback",
    "Burdenback",
    "Carrega pessoas adicionais iguais aos pontos do Mérito e recebe +2 Vigor.",
    "Carry additional people equal to Merit dots and gain +2 Stamina.",
  ],
  [
    "dreamspun",
    "Dreamspun",
    "Ressurge após uma noite completa de sono do dono e recebe Furtividade igual aos pontos do Mérito.",
    "Return after the owner completes a full night's sleep and gain Stealth equal to Merit dots.",
  ],
  [
    "thornbeast",
    "Thornbeast",
    "+2 dados nos ataques e modificador de arma +2.",
    "Gain +2 attack dice and +2 weapon damage.",
  ],
  ["hedgefoot", "Hedgefoot", "Escolha correr sobre água, escalar ou voar.", "Choose to run across water, climb, or fly."],
] as const;
const FAMILIAR_NUMINA = [
  "Awe",
  "Blast",
  "Dement",
  "Drain",
  "Emotional Aura",
  "Entropic Decay",
  "Firestarter",
  "Hallucination",
  "Implant Mission",
  "Left-Handed Spanner",
  "Mortal Mask",
  "Pathfinder",
  "Regenerate",
  "Seek",
  "Speed",
  "Sign",
  "Stalwart",
  "Telekinesis",
];
function MeritCompanionCard({
  merit,
  meritIndex,
  character,
  updateSheet,
}: {
  merit: CharacterSheet["merits"][number];
  meritIndex: number;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const isMobile=useIsMobile();
  const configuration = normalizeMeritConfiguration(merit.configuration),
    name = String(
      configuration.name ??
        (merit.name === "Fae Mount" ? tr("Montaria Feérica", "Fae Mount") : merit.name === "Fae Pet" ? tr("Mascote Feérico", "Fae Pet") : "Familiar"),
    );
  const save = (patch: Record<string, string | string[]>) => {
    const next = structuredClone(character);
    const target = next.merits[meritIndex];
    if (target?.name === merit.name)
      target.configuration = {
        ...normalizeMeritConfiguration(target.configuration),
        ...patch,
      };
    updateSheet(next);
  };
  if (merit.name === "Fae Pet") {
    const animalId=String(configuration.animalId??ANIMALS[0]?.id??""), animal=ANIMALS.find(item=>item.id===animalId);
    return <article className="companion-card merit-companion companion-config">
      <header><div><strong>{name||tr("Mascote Feérico","Fae Pet")}</strong><small>Fae Pet · {merit.dots} {tr("pontos","dots")}</small></div></header>
      <div className="companion-form-grid">
        <label>{tr("Nome","Name")}<Input value={name} onChange={(event)=>save({name:event.target.value})}/></label>
        <label>{tr("Animal","Animal")}<RuleSelect value={animalId} onChange={(value)=>save({animalId:value})} options={ANIMALS.map(item=>animalPresentation(item,locale)).map(item=>({value:item.id,label:item.name}))}/></label>
        <label>{tr("Poder Temível","Dread Power")}<Input value={String(configuration.dread_power??"")} onChange={(event)=>save({dread_power:event.target.value})}/></label>
      </div>
      {animal&&<AnimalCard animal={animalPresentation(animal,locale)} name={name} onRemove={()=>{}} removable={false}/>}
    </article>;
  }
  if (merit.name === "Fae Mount") {
    const abilities = stringList(configuration.abilities).slice(0, merit.dots),
      hedgefoot = String(configuration.hedgefoot ?? "water"),
      burden = abilities.includes("burdenback"),
      many = abilities.includes("manyleague"),
      thorn = abilities.includes("thornbeast"),
      dreamspun = abilities.includes("dreamspun"),
      armorshell=abilities.includes("armorshell"),
      ownGeneral=Math.max(0,Math.min(5,Number(configuration.armor_general??0))),
      ownBallistic=Math.max(0,Math.min(5,Number(configuration.armor_ballistic??0))),
      generalArmor=Math.max(ownGeneral,armorshell?3:0),
      ballisticArmor=Math.max(ownBallistic,armorshell?2:0),
      health = 12 + (burden ? 2 : 0),
      mountDamage=stringList(configuration.health_damage).filter((value):value is DamageLevel=>["bashing","lethal","aggravated"].includes(value)).slice(0,health),
      mountAttributes={Inteligência:1,Raciocínio:3,Perseverança:3,Força:5,Destreza:3,Vigor:5+(burden?2:0),Presença:3,Manipulação:1,Compostura:2},
      special=[
        tr("Pode erguer quatro vezes o peso de um humano com Força e Atletismo equivalentes.","Can lift four times as much as a human with comparable Strength and Athletics."),
        burden?tr(`Pode carregar ${1+merit.dots} cavaleiros.`,`Can carry ${1+merit.dots} riders.`):tr("Pode carregar um cavaleiro.","Can carry one rider."),
        abilities.includes("chatterbox")?tr("Fala com o dono e transmite mensagens simples.","Speaks with its owner and conveys simple messages."):"",
        abilities.includes("actormask")?tr("Pode sair da Sebe e manter uma Máscara por 1 Glamour por cena.","Can leave the Hedge and maintain a Mask for 1 Glamour per scene."):"",
        abilities.includes("dreamspun")?tr("Volta à vida após uma noite completa de sono do dono.","Returns to life after its owner completes a full night's sleep."):"",
        armorshell?tr("Concede ocultação parcial ao cavaleiro.","Provides partial concealment to the rider."):"",
        abilities.includes("hedgefoot")?(hedgefoot==="water"?tr("Move-se sobre a água.","Moves across water."):hedgefoot==="climb"?tr("Escala a três vezes o Deslocamento.","Climbs at three times Speed."):tr("Pode voar uma vez por cena.","Can fly once per scene.")):"",
      ].filter(Boolean).join(" ");
    return (
      <article className="companion-card merit-companion companion-config">
        <header>
          <div>
            <strong>{name}</strong>
            <small>
              {tr("Montaria Feérica","Fae Mount")} · {merit.dots} {tr("pontos","dots")} · {tr("escolha","choose")} {merit.dots} {tr("habilidades","abilities")}
            </small>
          </div>
        </header>
        <Input
          value={name}
          onChange={(event) => save({ name: event.target.value })}
          placeholder={tr("Nome da montaria","Mount name")}
        />
        <div className="mount-attribute-grid">{Object.entries(ATTRIBUTES).map(([category,names])=><TraitBlock key={category} title={category} names={names} values={mountAttributes} compactNames={isMobile}/>)}</div>
        <p><b>{tr("Perícias", "Skills")}:</b> {tr("Atletismo 4, Briga 1 (Coice), Sobrevivência 2", "Athletics 4, Brawl 1 (Kicking), Survival 2")}{dreamspun?`, ${tr("Furtividade", "Stealth")} ${merit.dots}`:""}</p>
        <div className="mount-combat-block"><CompactValues values={{"Força de Vontade":5,Iniciativa:5+(many?merit.dots:0),Defesa:7,Deslocamento:many?38:19,Tamanho:7,"Armadura geral":generalArmor,"Armadura balística":ballisticArmor}}/><div className="mount-armor-editors"><ArmorDotPicker label={tr("Armadura geral","General Armor")} value={ownGeneral} onChange={(value)=>save({armor_general:String(value)})}/><ArmorDotPicker label={tr("Armadura balística","Ballistic Armor")} value={ownBallistic} onChange={(value)=>save({armor_ballistic:String(value)})}/></div>{armorshell&&<small>{tr("Armorshell fornece Armadura 3/2; somente o maior valor entre ela e a armadura própria é aplicado.","Armorshell provides Armor 3/2; only the higher of it and the mount's own armor applies.")}</small>}<strong>{tr("Vitalidade","Health")}</strong><HealthTrack health={health} damage={mountDamage} onChange={(value)=>save({health_damage:value})}/></div>
        <p>
          <b>{tr("Ataques", "Attacks")}:</b> {tr("Mordida", "Bite")} {thorn ? "+2L" : "+0L"} ({5 + (thorn ? 2 : 0)} {tr("dados", "dice")}); {tr("coice ou garra", "kick or claw")} {thorn ? "+4L" : "+2L"} ({6 + (thorn ? 2 : 0)} {tr("dados", "dice")}, {tr("Derrubado", "Knocked Down")}).
        </p>
        <p><b>{tr("Especial", "Special")}:</b> {special}</p>
        <div className="companion-options">
          {alphabetical(FAE_MOUNT_ABILITIES, item => item[1]).filter(([id])=>abilities.length<merit.dots||abilities.includes(id)).map(([id, label, description, descriptionEn]) => {
            const active = abilities.includes(id);
            return (
              <label key={id} className={active ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={active}
                  disabled={!active && abilities.length >= merit.dots}
                  onChange={() =>
                    save({
                      abilities: active
                        ? abilities.filter((value) => value !== id)
                        : [...abilities, id],
                    })
                  }
                />
                <span>
                  <strong>{label}</strong>
                  <small>{locale==="en-US"?descriptionEn:description}</small>
                </span>
              </label>
            );
          })}
        </div>
        {abilities.includes("hedgefoot") && (
          <label className="companion-field">
            {tr("Modo de Hedgefoot", "Hedgefoot mode")}
            <RuleSelect
              value={hedgefoot}
              onChange={(value) => save({ hedgefoot: value })}
              options={[
                {
                  value: "water",
                  label: tr("Correr sobre água no Deslocamento normal", "Run across water at normal Speed"),
                },
                {
                  value: "climb",
                  label: tr("Escalar a três vezes o Deslocamento", "Climb at three times Speed"),
                },
                { value: "fly", label: tr("Voar uma vez por cena", "Fly once per scene") },
              ]}
            />
          </label>
        )}
      </article>
    );
  }
  const form = String(configuration.form ?? "animal"),
    entity = String(configuration.entity ?? "Spirit"),
    rank = merit.dots >= 4 ? 2 : 1,
    animalId = String(configuration.animalId ?? ANIMALS[0]?.id ?? ""),
    animal = ANIMALS.find((item) => item.id === animalId),
    presentedAnimal = animal ? animalPresentation(animal,locale) : undefined,
    numina = stringList(configuration.numina),
    numinaLimit = rank === 1 ? 3 : 5;
  return (
    <article className="companion-card merit-companion companion-config">
      <header>
        <div>
          <strong>{name}</strong>
          <small>{tr(`Familiar · entidade efêmera de Rank ${rank}`, `Familiar · Rank ${rank} ephemeral entity`)}</small>
        </div>
      </header>
      <div className="companion-form-grid">
        <label>
          {tr("Nome", "Name")}
          <Input
            value={name}
            onChange={(event) => save({ name: event.target.value })}
          />
        </label>
        <label>
          {tr("Forma", "Form")}
          <RuleSelect
            value={form}
            onChange={(value) => save({ form: value })}
            options={[
              { value: "animal", label: tr("Animal", "Animal") },
              { value: "object", label: tr("Objeto", "Object") },
            ]}
          />
        </label>
        <label>
          {tr("Tipo de entidade", "Entity type")}
          <RuleSelect
            value={entity}
            onChange={(value) => save({ entity: value })}
            options={["Ghost","Spirit","Goetia"].map((value)=>({value,label:value}))}
          />
        </label>
        {form === "animal" ? (
          <label>
            {tr("Animal", "Animal")}
            <RuleSelect
              value={animalId}
              onChange={(value) => save({ animalId: value })}
              options={ANIMALS.map((item) => animalPresentation(item,locale)).map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </label>
        ) : (
          <label>
            {tr("Objeto", "Object")}
            <Input
              value={String(configuration.object ?? "")}
              onChange={(event) => save({ object: event.target.value })}
              placeholder={tr("Descrição do fetiche", "Fetish description")}
            />
          </label>
        )}
        <label>
          {tr("Poder", "Power")}
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.power ?? rank + 2)}
            onChange={(event) => save({ power: event.target.value })}
          />
        </label>
        <label>
          {tr("Refinamento", "Finesse")}
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.finesse ?? rank + 2)}
            onChange={(event) => save({ finesse: event.target.value })}
          />
        </label>
        <label>
          {tr("Resistência", "Resistance")}
          <Input
            type="number"
            min={1}
            max={rank === 1 ? 5 : 7}
            value={String(configuration.resistance ?? rank + 2)}
            onChange={(event) => save({ resistance: event.target.value })}
          />
        </label>
        <label>
          {tr("Influência", "Influence")}
          <Input
            value={String(configuration.influence ?? "")}
            onChange={(event) => save({ influence: event.target.value })}
            placeholder={tr(`Nome · ${rank} ponto(s)`, `Name · ${rank} dot${rank === 1 ? "" : "s"}`)}
          />
        </label>
        <label>
          {tr("Interdição", "Ban")}
          <Input
            value={String(configuration.ban ?? "")}
            onChange={(event) => save({ ban: event.target.value })}
          />
        </label>
        <label>
          {tr("Perdição", "Bane")}
          <Input
            value={String(configuration.bane ?? "")}
            onChange={(event) => save({ bane: event.target.value })}
          />
        </label>
      </div>
      {form === "animal" && presentedAnimal && (
        <AnimalCard
          animal={presentedAnimal}
          name={name}
          onRemove={() => save({ form: "object", animalId: "" })}
        />
      )}
      <strong>
        Numina ({numina.length}/{numinaLimit})
      </strong>
      <div className="companion-options numina-options">
        {alphabetical(FAMILIAR_NUMINA, item => item).filter((item)=>numina.length<numinaLimit||numina.includes(item)).map((item) => {
          const active = numina.includes(item);
          return (
            <label key={item} className={active ? "selected" : ""}>
              <input
                type="checkbox"
                checked={active}
                disabled={!active && numina.length >= numinaLimit}
                onChange={() =>
                  save({
                    numina: active
                      ? numina.filter((value) => value !== item)
                      : [...numina, item],
                  })
                }
              />
              <span>
                <strong>{item}</strong>
              </span>
            </label>
          );
        })}
      </div>
      <p className="combat-note">
        {tr(
          `Rank ${rank}: máximo de Atributo ${rank === 1 ? 5 : 7}, Influência ${rank} e até ${numinaLimit} Numina. Complete Interdição e Perdição conforme a natureza da entidade.`,
          `Rank ${rank}: maximum Attribute ${rank === 1 ? 5 : 7}, Influence ${rank}, and up to ${numinaLimit} Numina. Complete Ban and Bane according to the entity's nature.`,
        )}
      </p>
    </article>
  );
}
function AnimalCard({
  animal,
  name,
  onRemove,
  removable=true,
}: {
  animal: Animal;
  name?: string;
  onRemove: () => void;
  removable?: boolean;
}) {
  const { tr }=useLanguage();
  return (
    <article className="companion-card">
      <header>
        <div>
          <strong>{name || animal.name}</strong>
          <small>{name ? animal.name : tr("Companheiro animal","Animal companion")}</small>
        </div>
          {removable&&<Button type="button" size="icon" variant="ghost" onClick={onRemove} aria-label={tr(`Remover ${name || animal.name}`, `Remove ${name || animal.name}`)}>
          <X />
        </Button>}
      </header>
      <p>
        <b>{tr("Atributos","Attributes")}:</b> {animal.attributes}
      </p>
      <p>
        <b>{tr("Perícias","Skills")}:</b> {animal.skills}
      </p>
      <CompactValues
        values={{
          "Força de Vontade": animal.willpower,
          Iniciativa: animal.initiative,
          Defesa: animal.defense,
          Tamanho: animal.size,
          Vitalidade: animal.health,
        }}
      />
      <p>
        <b>{tr("Deslocamento", "Speed")}:</b> {animal.speed}
      </p>
      <p>
        <b>{tr("Ataques", "Attacks")}:</b>{" "}
        {animal.attacks.length
          ? animal.attacks
              .map(
                (item) =>
                  `${item.name} ${item.damage} (${item.pool} ${tr("dados", "dice")})${item.note ? ` — ${item.note}` : ""}`,
              )
              .join("; ")
          : tr("Nenhum", "None")}
      </p>
      {animal.special && (
        <p>
          <b>{tr("Especial", "Special")}:</b> {animal.special}
        </p>
      )}
    </article>
  );
}
