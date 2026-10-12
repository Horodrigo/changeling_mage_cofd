import data from "./catalog-data/combat-equipment.json";

export type Weapon={id:string;name:string;translatedName:string;kind:"Ranged"|"Melee"|"Grenades";damage:number|string;initiative:number;strength:number;strengthText?:string;strengthTextPt?:string;size:number;sizeText?:string;sizeTextPt?:string;availability:number;source:string;ranges?:string;clip?:string;special?:string;specialPt?:string;blastArea?:number;force?:number|string};
export type Armor={id:string;name:string;translatedName:string;era:"Modern"|"Historical";general:number;ballistic:number;strength:number;defense:number;speed:number;availability:number;coverage:string;coveragePt:string;source:string;special?:string;specialPt?:string};
export type Equipment={id:string;name:string;category:"Mental"|"Físico"|"Physical";bonus:string;durability:string;size:string;structure:string;availability:string;effect:string};
type LocalizedEquipment = Equipment & { nameEn?:string; categoryEn?:Equipment["category"]; effectEn?:string };

export const WEAPONS=data.weapons as Weapon[];
export const ARMORS=data.armors as Armor[];
export const EQUIPMENT=data.equipment as LocalizedEquipment[];
export const SHIELDS=WEAPONS.filter(item=>item.id==="escudo-pequeno"||item.id==="escudo-grande");

export function armorCoverage(armor:Armor|undefined,helmet:boolean,locale:"pt-BR"|"en-US"){
 if(!armor)return "";
 const coverage=locale==="pt-BR"?armor.coveragePt:armor.coverage;
 return helmet&&!armor.coverage.includes("head")?`${coverage}, ${locale==="pt-BR"?"cabeça":"head"}`:coverage;
}

export function derivedTraitsWithArmor(derived:Record<string,unknown>,armorId:unknown,shieldId?:unknown,helmet?:unknown){
 const armor=ARMORS.find((item)=>item.id===String(armorId??""));
 const shield=SHIELDS.find((item)=>item.id===String(shieldId??""));
 return {
  Size:Number(derived.Size??5),
  Speed:Number(derived.Speed??0)+(armor?.speed??0),
  Defense:Math.max(0,Number(derived.Defense??0)+(armor?.defense??0)+(shield?.size??0)-(armor&&helmet===true&&!armor.coverage.includes("head")?1:0)),
  Initiative:Number(derived.Initiative??0)+(shield?.initiative??0),
  Armor:typeof derived.Armor==="string"?derived.Armor:`${armor?.general??0}/${armor?.ballistic??0}`,
 };
}

export function combatItemPresentation<T extends Weapon|Armor|Equipment>(item:T,locale:"pt-BR"|"en-US"):T {
 if("translatedName" in item){
  if(locale==="en-US")return item;
  return {...item,name:item.translatedName,...("coverage" in item?{coverage:item.coveragePt}:{}),...(item.specialPt?{special:item.specialPt}:{}),...("kind" in item?{kind:{Melee:"Corpo a corpo",Ranged:"Distância",Grenades:"Granadas"}[item.kind],damage:item.damage==="Strength"?"Força":item.damage,ranges:item.ranges?.replace("Thrown","Arremesso"),strengthText:item.strengthTextPt,sizeText:item.sizeTextPt}:{} )} as T;
 }
 if(locale==="pt-BR")return item;
 const localized=item as LocalizedEquipment;
 return {...item,name:localized.nameEn??item.name,category:localized.categoryEn??item.category,effect:localized.effectEn??item.effect} as T;
}
