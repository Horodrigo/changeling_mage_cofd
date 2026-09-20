"use client";
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { ARMORS, EQUIPMENT, WEAPONS, combatItemPresentation, derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { VEHICLES, vehiclePresentation } from "@/lib/companions";
import { TILTS, findTilt } from "@/lib/tilts";
import { RuleSelect } from "./rule-select";
import { CompactValues, SheetHeading, signed, stringList } from "./sheet-primitives";
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
  const { locale, t } = useLanguage();
  const weaponIds = stringList(character.line_data.combat_weapons),
    equipmentIds = stringList(character.line_data.combat_equipment),
    vehicleIds = stringList(character.line_data.companion_vehicles),
    tiltIds = stringList(character.line_data.combat_tilts),
    armorId = String(character.line_data.combat_armor ?? "");
  const presentedArmors=ARMORS.map((item)=>combatItemPresentation(item,locale));
  const presentedWeapons=WEAPONS.map((item)=>combatItemPresentation(item,locale));
  const presentedEquipment=EQUIPMENT.map((item)=>combatItemPresentation(item,locale));
  const presentedVehicles=VEHICLES.map((item)=>vehiclePresentation(item,locale));
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
  const weaponDetails = (item: (typeof presentedWeapons)[number]) => {
    const params = { kind: item.kind, damage: item.damage, initiative: signed(item.initiative), strength: item.strength, size: item.size, range: item.ranges ?? "", capacity: item.clip ?? "" };
    return item.ranges && item.clip ? t("combat.weaponDetailsRangeCapacity", params) : item.ranges ? t("combat.weaponDetailsRange", params) : item.clip ? t("combat.weaponDetailsCapacity", params) : t("combat.weaponDetails", params);
  };
  const equipmentDetails = (item: (typeof presentedEquipment)[number]) => t("combat.equipmentDetails", { category: item.category, bonus: item.bonus, durability: item.durability, size: item.size, structure: item.structure, availability: item.availability });
  const vehicleDetails = (item: (typeof presentedVehicles)[number]) => t("combat.vehicleDetails", { modifier: signed(item.diceModifier), size: item.size, durability: item.durability, structure: item.structure, speed: item.speed });
  const combatValues = derivedTraitsWithArmor(derived, armorId);
  return (
    <div className="combat-page">
      <section>
        <SheetHeading>{t("ui.derivedStats")}</SheetHeading>
        <CompactValues values={combatValues} />
        <p className="combat-note">{t("combat.defenseSpeedNote")}</p>
        <SheetHeading>{t("combat.combatSummary")}</SheetHeading>
        <div className="combat-rules">
          <article>
            <strong>{t("combat.attacks")}</strong>
            <p>{t("combat.attacksDescription")}</p>
          </article>
          <article>
            <strong>{t("combat.damageDefense")}</strong>
            <p>{t("combat.damageDefenseDescription")}</p>
          </article>
          <article>
            <strong>{t("combat.initiativeDodge")}</strong>
            <p>{t("combat.initiativeDodgeDescription")}</p>
          </article>
          <article>
            <strong>{t("combat.armor")}</strong>
            <p>{t("combat.armorDescription")}</p>
          </article>
        </div>
        <SheetHeading>{t("combat.tilts")}</SheetHeading>
        <TiltManager selected={tiltIds} onChange={(value) => setData("combat_tilts", value)} />
      </section>
      <section className="loadout-section">
        <SheetHeading>{t("combat.armor")}</SheetHeading>
        <RuleSelect
          value={armorId || "none"}
          onChange={(value) =>
            setData("combat_armor", value === "none" ? "" : value)
          }
          options={[
            { value: "none", label: t("combat.noArmor") },
            ...presentedArmors.map((item) => ({
              value: item.id,
              label: `${item.name} · ${item.general}/${item.ballistic}`,
            })),
          ]}
        />
        {armor && (
          <div className="armor-summary">
            <strong>{armor.name}</strong>
            <span>{t("combat.armorSummary", { general: armor.general, ballistic: armor.ballistic, defense: signed(armor.defense), speed: signed(armor.speed), coverage: armor.coverage })}</span>
          </div>
        )}
        <SheetHeading>{t("combat.weapons")}</SheetHeading>
        <LoadoutCatalog
          title={t("combat.selectWeapons")}
          items={presentedWeapons}
          selected={weaponIds}
          describe={weaponDetails}
          details={(item) => item.special ?? t("combat.noSpecialProperty")}
          onChange={(value) => setData("combat_weapons", value)}
        />
        <div className="loadout-list">
          {weapons.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>{weaponDetails(item)}</small>
                {item.special && <p>{item.special}</p>}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t("combat.removeNamed", { name: item.name })}
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
        <SheetHeading>{t("combat.equipment")}</SheetHeading>
        <LoadoutCatalog
          title={t("combat.selectEquipment")}
          items={presentedEquipment}
          selected={equipmentIds}
          describe={equipmentDetails}
          details={(item) => item.effect}
          onChange={(value) => setData("combat_equipment", value)}
        />
        <div className="loadout-list">
          {equipment.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <small>{equipmentDetails(item)}</small>
                <p>{item.effect}</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t("combat.removeNamed", { name: item.name })}
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
        <SheetHeading>{t("combat.vehicles")}</SheetHeading>
        <p className="combat-note">{t("combat.vehicleModifierNote")}</p>
        <LoadoutCatalog title={t("combat.selectVehicles")} items={presentedVehicles} selected={vehicleIds} describe={vehicleDetails} details={(item)=>item.acceleration?t("combat.accelerationDetails", { acceleration: item.acceleration.toLocaleLowerCase(locale) }):t("combat.normalAcceleration")} onChange={(value)=>setData("companion_vehicles",value)}/>
        <div className="loadout-list">{vehicleIds.map(id=>presentedVehicles.find(item=>item.id===id)).filter((item):item is NonNullable<typeof item>=>Boolean(item)).map(item=><article key={item.id}><div><strong>{item.name}</strong><small>{vehicleDetails(item)}</small></div><Button type="button" size="icon" variant="ghost" onClick={()=>setData("companion_vehicles",vehicleIds.filter(id=>id!==item.id))} aria-label={t("combat.removeNamed", { name: item.name })}><X/></Button></article>)}</div>
      </section>
      <small className="combat-source">
        {t("combat.combatSource")}
      </small>
    </div>
  );
}

function TiltManager({selected,onChange}:{selected:string[];onChange:(value:string[])=>void}) {
  const {locale,t}=useLanguage();
  const [search,setSearch]=useState(""), [category,setCategory]=useState("All");
  const name=(tilt:(typeof TILTS)[number])=>locale==="en-US"?tilt.name:tilt.translatedName;
  const filtered=alphabetical(TILTS,name,locale).filter((tilt)=>(category==="All"||tilt.category===category)&&`${tilt.name} ${tilt.translatedName} ${tilt.description} ${tilt.effect}`.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale)));
  const categoryLabel=(category:string)=>category === "Personal" ? t("combat.personal") : t("combat.environmental");
  const metadata=(tilt:(typeof TILTS)[number])=>t("combat.tiltMetadata", { category: categoryLabel(tilt.category), source: tilt.sourceCode, page: tilt.page });
  return <div className="tilt-manager">
    <div className="selected-tilts">
      {selected.map(findTilt).filter((tilt):tilt is NonNullable<typeof tilt>=>Boolean(tilt)).map((tilt)=><article key={tilt.id} className="selected-tilt"><div><strong>{name(tilt)}</strong><small>{metadata(tilt)}</small><p>{tilt.effect}</p></div><Button type="button" size="icon" variant="ghost" onClick={()=>onChange(selected.filter((id)=>id!==tilt.id))} aria-label={t("combat.removeNamed", { name: name(tilt) })}><X /></Button></article>)}
      {!selected.length&&<em>{t("combat.noTilts")}</em>}
    </div>
    <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline"><Plus />{t("combat.addTilt")}</Button></DialogTrigger><DialogContent className="tilt-dialog"><DialogHeader><DialogTitle>{t("combat.combatTilts")}</DialogTitle><DialogDescription>{t("combat.tiltDescription")}</DialogDescription></DialogHeader>
      <div className="tilt-filters"><label className="catalog-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={t("combat.searchTilts")}/></label><RuleSelect value={category} onChange={setCategory} options={[{value:"All",label:t("combat.all")},{value:"Personal",label:t("combat.personal")},{value:"Environmental",label:t("combat.environmental")}]}/></div>
      <div className="tilt-catalog">{filtered.map((tilt)=>{const active=selected.includes(tilt.id);return <article key={tilt.id} className={active?"selected":""}><header><div><strong>{name(tilt)}</strong><small>{metadata(tilt)}</small></div><Button type="button" size="sm" variant={active?"ghost":"outline"} onClick={()=>onChange(active?selected.filter((id)=>id!==tilt.id):[...selected,tilt.id])}>{active?t("combat.remove"):t("combat.add")}</Button></header><p>{tilt.description}</p><p><b>{t("combat.effectLabel")}</b> {tilt.effect}</p><p><b>{t("combat.causingTiltLabel")}</b> {tilt.causing}</p><p><b>{t("combat.endingTiltLabel")}</b> {tilt.ending}</p></article>})}</div>
      <DialogFooter><DialogClose asChild><Button type="button" size="sm" className="catalog-dialog-done">{t("combat.done")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </div>;
}
