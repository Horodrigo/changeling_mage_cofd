import data from "./catalog-data/combat-equipment.json";

export type Weapon={id:string;name:string;kind:"Distância"|"Corpo a corpo"|"Ranged"|"Melee";damage:number;initiative:number;strength:number;size:number;availability:number;ranges?:string;clip?:string;special?:string};
export type Armor={id:string;name:string;general:number;ballistic:number;strength:number;defense:number;speed:number;availability:number;coverage:string};
export type Equipment={id:string;name:string;category:"Mental"|"Físico"|"Physical";bonus:string;durability:string;size:string;structure:string;availability:string;effect:string};
type LocalizedItem<T> = T & { nameEn?:string; kindEn?:Weapon["kind"]; specialEn?:string; coverageEn?:string; categoryEn?:Equipment["category"]; effectEn?:string };

export const WEAPONS=data.weapons as LocalizedItem<Weapon>[];
export const ARMORS=data.armors as LocalizedItem<Armor>[];
export const EQUIPMENT=data.equipment as LocalizedItem<Equipment>[];

export function derivedTraitsWithArmor(derived:Record<string,unknown>,armorId:unknown){
 const armor=ARMORS.find((item)=>item.id===String(armorId??""));
 return {
  Tamanho:Number(derived.Tamanho??5),
  Deslocamento:Number(derived.Deslocamento??0)+(armor?.speed??0),
  Defesa:Number(derived.Defesa??0)+(armor?.defense??0),
  Iniciativa:Number(derived.Iniciativa??0),
  Armadura:`${armor?.general??0}/${armor?.ballistic??0}`,
 };
}

export function combatItemPresentation<T extends Weapon|Armor|Equipment>(item:T,locale:"pt-BR"|"en-US"):T {
 if(locale==="pt-BR")return item;
 const localized=item as LocalizedItem<T>;
 return {...item,name:localized.nameEn??item.name,...("effect" in item?{category:localized.categoryEn??item.category,effect:localized.effectEn??item.effect}:{}),...("coverage" in item?{coverage:localized.coverageEn??item.coverage}:{}),...("kind" in item?{kind:localized.kindEn??item.kind,special:localized.specialEn??item.special}:{})} as T;
}
