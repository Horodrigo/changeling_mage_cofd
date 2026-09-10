"use client";
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "../character-builder";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { ARMORS, EQUIPMENT, WEAPONS, combatItemPresentation } from "@/lib/combat-equipment";
import { TILTS, findTilt } from "@/lib/tilts";
import { RuleSelect } from "./rule-select";
import { CompactValues, SheetHeading, signed, stringList } from "./sheet-primitives";
import { workspaceTerm } from "./workspace-i18n";
import { LoadoutCatalog } from "./loadout-catalog";
export function CombatPage({
  character,
  derived,
  updateSheet,
}: {
  character: CharacterSheet;
  derived: Record<string, number>;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const weaponIds = stringList(character.line_data.combat_weapons),
    equipmentIds = stringList(character.line_data.combat_equipment),
    tiltIds = stringList(character.line_data.combat_tilts),
    armorId = String(character.line_data.combat_armor ?? "");
  const presentedArmors=ARMORS.map((item)=>combatItemPresentation(item,locale));
  const presentedWeapons=WEAPONS.map((item)=>combatItemPresentation(item,locale));
  const presentedEquipment=EQUIPMENT.map((item)=>combatItemPresentation(item,locale));
  const armor = presentedArmors.find((item) => item.id === armorId),
    weapons = weaponIds
      .map((id) => presentedWeapons.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    equipment = equipmentIds
      .map((id) => presentedEquipment.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const setData = (key: string, value: unknown) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, [key]: value };
    updateSheet(next);
  };
  const combatValues = {
    Defesa: Number(derived.Defesa ?? 0) + (armor?.defense ?? 0),
    Iniciativa: Number(derived.Iniciativa ?? 0),
    Deslocamento: Number(derived.Deslocamento ?? 0) + (armor?.speed ?? 0),
    Tamanho: Number(derived.Tamanho ?? 5),
    Vitalidade: Number(derived.Vitalidade ?? 5),
    "Armadura geral": armor?.general ?? 0,
    "Armadura balística": armor?.ballistic ?? 0,
  };
  return (
    <div className="combat-page">
      <section>
        <SheetHeading>Outras Características</SheetHeading>
        <CompactValues values={combatValues} />
        <p className="combat-note">{tr("Os valores de Defesa e Deslocamento já incluem a armadura vestida. A penalidade de Iniciativa aparece em cada arma equipada.", "Defense and Speed already include worn armor. Each equipped weapon shows its Initiative penalty.")}</p>
        <SheetHeading>Resumo de Combate</SheetHeading>
        <div className="combat-rules">
          <article>
            <strong>{tr("Ataques", "Attacks")}</strong>
            <p>{tr("Desarmado: Força + Briga − Defesa. Corpo a corpo: Força + Armas Brancas − Defesa. Distância: Destreza + Armas de Fogo. Arremesso: Destreza + Atletismo − Defesa.", "Unarmed: Strength + Brawl − Defense. Melee: Strength + Weaponry − Defense. Ranged: Dexterity + Firearms. Thrown: Dexterity + Athletics − Defense.")}</p>
          </article>
          <article>
            <strong>{tr("Dano e Defesa", "Damage and Defense")}</strong>
            <p>{tr("Some os sucessos ao dano da arma. Defesa diminui após cada ataque próximo recebido no turno; armas de fogo normalmente ignoram Defesa.", "Add successes to the weapon's damage. Defense decreases after each close attack received in the turn; firearms normally ignore Defense.")}</p>
          </article>
          <article>
            <strong>{tr("Iniciativa e Esquiva", "Initiative and Dodge")}</strong>
            <p>{tr("Iniciativa é 1d10 + modificador, reduzida pela arma empunhada. Esquivar usa o dobro da Defesa como parada disputada.", "Initiative is 1d10 + modifier, reduced by the wielded weapon. Dodge uses twice Defense as a contested pool.")}</p>
          </article>
          <article>
            <strong>{tr("Armadura", "Armor")}</strong>
            <p>{tr("Proteção geral reduz ataques comuns; proteção balística reduz armas de fogo. Penalidades da armadura já aparecem nos valores acima.", "General armor reduces ordinary attacks; ballistic armor reduces firearm attacks. Armor penalties are already included above.")}</p>
          </article>
        </div>
        <SheetHeading>{tr("Inclinações", "Tilts")}</SheetHeading>
        <TiltManager selected={tiltIds} onChange={(value) => setData("combat_tilts", value)} />
      </section>
      <section className="loadout-section">
        <SheetHeading>Armadura</SheetHeading>
        <RuleSelect
          value={armorId || "none"}
          onChange={(value) =>
            setData("combat_armor", value === "none" ? "" : value)
          }
          options={[
            { value: "none", label: tr("Sem armadura", "No armor") },
            ...presentedArmors.map((item) => ({
              value: item.id,
              label: `${item.name} · ${item.general}/${item.ballistic}`,
            })),
          ]}
        />
        {armor && (
          <div className="armor-summary">
            <strong>{armor.name}</strong>
            <span>
              {tr("Armadura", "Armor")} {armor.general}/{armor.ballistic} · {tr("Defesa", "Defense")}{" "}
              {signed(armor.defense)} · {tr("Deslocamento", "Speed")} {signed(armor.speed)} ·{" "}
              {armor.coverage}
            </span>
          </div>
        )}
        <SheetHeading>Armas</SheetHeading>
        <LoadoutCatalog
          title={tr("Selecionar Armas", "Select Weapons")}
          items={presentedWeapons}
          selected={weaponIds}
          describe={(item) =>
            `${item.kind} · ${tr("Dano", "Damage")} ${item.damage} · ${tr("Iniciativa", "Initiative")} ${signed(item.initiative)} · ${tr("Força", "Strength")} ${item.strength} · ${tr("Tamanho", "Size")} ${item.size}${item.ranges ? ` · ${tr("Alcance", "Range")} ${item.ranges}` : ""}${item.clip ? ` · ${tr("Carga", "Capacity")} ${item.clip}` : ""}`
          }
          details={(item) => item.special ?? tr("Sem propriedade especial.", "No special property.")}
          onChange={(value) => setData("combat_weapons", value)}
        />
        <div className="loadout-list">
          {weapons.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.kind} · {tr("dano", "damage")} {item.damage} · {tr("Iniciativa", "Initiative")}{" "}
                  {signed(item.initiative)} · {tr("Força", "Strength")} {item.strength} · {tr("Tamanho", "Size")}{" "}
                  {item.size}
                  {item.ranges ? ` · ${tr("alcance", "range")} ${item.ranges}` : ""}
                  {item.clip ? ` · ${tr("carga", "capacity")} ${item.clip}` : ""}
                </small>
                {item.special && <p>{item.special}</p>}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={tr(`Remover ${item.name}`, `Remove ${item.name}`)}
                onClick={() =>
                  setData(
                    "combat_weapons",
                    weaponIds.filter((id) => id !== item.id),
                  )
                }
              >
                <X />
              </Button>
            </article>
          ))}
        </div>
        <SheetHeading>Equipamentos</SheetHeading>
        <LoadoutCatalog
          title={tr("Selecionar Equipamentos", "Select Equipment")}
          items={presentedEquipment}
          selected={equipmentIds}
          describe={(item) =>
            `${item.category} · ${tr("Bônus", "Bonus")} ${item.bonus} · ${tr("Durabilidade", "Durability")} ${item.durability} · ${tr("Tamanho", "Size")} ${item.size} · ${tr("Estrutura", "Structure")} ${item.structure} · ${tr("Disponibilidade", "Availability")} ${item.availability}`
          }
          details={(item) => item.effect}
          onChange={(value) => setData("combat_equipment", value)}
        />
        <div className="loadout-list">
          {equipment.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.category} · {tr("bônus", "bonus")} {item.bonus} · {tr("Durabilidade", "Durability")}{" "}
                  {item.durability} · {tr("Tamanho", "Size")} {item.size} · {tr("Estrutura", "Structure")}{" "}
                  {item.structure} · {tr("Disponibilidade", "Availability")} {item.availability}
                </small>
                <p>{item.effect}</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={tr(`Remover ${item.name}`, `Remove ${item.name}`)}
                onClick={() =>
                  setData(
                    "combat_equipment",
                    equipmentIds.filter((id) => id !== item.id),
                  )
                }
              >
                <X />
              </Button>
            </article>
          ))}
        </div>
      </section>
      <small className="combat-source">
        {tr("Regras e equipamentos: Chronicles of Darkness · pp. 86–103 e 268–276.", "Rules and equipment: Chronicles of Darkness · pp. 86–103 and 268–276.")}
      </small>
    </div>
  );
}

function TiltManager({selected,onChange}:{selected:string[];onChange:(value:string[])=>void}) {
  const {locale,tr}=useLanguage();
  const [search,setSearch]=useState(""), [category,setCategory]=useState("All");
  const name=(tilt:(typeof TILTS)[number])=>locale==="en-US"?tilt.name:tilt.translatedName;
  const filtered=alphabetical(TILTS,name,locale).filter((tilt)=>(category==="All"||tilt.category===category)&&`${tilt.name} ${tilt.translatedName} ${tilt.description} ${tilt.effect}`.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale)));
  return <div className="tilt-manager">
    <div className="selected-tilts">
      {selected.map(findTilt).filter((tilt):tilt is NonNullable<typeof tilt>=>Boolean(tilt)).map((tilt)=><article key={tilt.id} className="selected-tilt"><div><strong>{name(tilt)}</strong><small>{tr(tilt.category==="Personal"?"Pessoal":"Ambiental",tilt.category)} · {tilt.sourceCode} · p. {tilt.page}</small><p>{tilt.effect}</p></div><Button type="button" size="icon" variant="ghost" onClick={()=>onChange(selected.filter((id)=>id!==tilt.id))} aria-label={`${tr("Remover","Remove")} ${name(tilt)}`}><X /></Button></article>)}
      {!selected.length&&<em>{tr("Nenhuma Inclinação selecionada.","No Tilts selected.")}</em>}
    </div>
    <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline"><Plus />{tr("Adicionar Inclinação","Add Tilt")}</Button></DialogTrigger><DialogContent className="tilt-dialog"><DialogHeader><DialogTitle>{tr("Inclinações de Combate","Combat Tilts")}</DialogTitle><DialogDescription>{tr("Selecione efeitos pessoais ou ambientais ativos na cena.","Select Personal or Environmental effects active in the scene.")}</DialogDescription></DialogHeader>
      <div className="tilt-filters"><label className="catalog-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={tr("Buscar Inclinação","Search Tilts")}/></label><RuleSelect value={category} onChange={setCategory} options={[{value:"All",label:tr("Todas","All")},{value:"Personal",label:tr("Pessoais","Personal")},{value:"Environmental",label:tr("Ambientais","Environmental")}]} /></div>
      <div className="tilt-catalog">{filtered.map((tilt)=>{const active=selected.includes(tilt.id);return <article key={tilt.id} className={active?"selected":""}><header><div><strong>{name(tilt)}</strong><small>{tr(tilt.category==="Personal"?"Pessoal":"Ambiental",tilt.category)} · {tilt.sourceCode} · p. {tilt.page}</small></div><Button type="button" size="sm" variant={active?"ghost":"outline"} onClick={()=>onChange(active?selected.filter((id)=>id!==tilt.id):[...selected,tilt.id])}>{active?tr("Remover","Remove"):tr("Adicionar","Add")}</Button></header><p>{tilt.description}</p><p><b>{tr("Efeito","Effect")}:</b> {tilt.effect}</p><p><b>{tr("Causando a Inclinação","Causing the Tilt")}:</b> {tilt.causing}</p><p><b>{tr("Encerrando a Inclinação","Ending the Tilt")}:</b> {tilt.ending}</p></article>})}</div>
      <DialogFooter><DialogClose asChild><Button type="button">{tr("Concluir","Done")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </div>;
}

