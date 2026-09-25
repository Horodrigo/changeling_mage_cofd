import data from "./catalog-data/companions.json";

export type Vehicle={id:string;name:string;diceModifier:number;size:number;durability:number;structure:number;speed:number;acceleration?:"Alta"|"Lenta"|"High"|"Slow"};
export type AnimalAttack={name:string;damage:string;pool:number;note?:string};
export type Animal={id:string;name:string;attributes:string;skills:string;willpower:number;initiative:number;defense:number;speed:string;size:number;health:number;attacks:AnimalAttack[];special?:string};
type LocalizedVehicle = Vehicle & { nameEn?: string; accelerationEn?: Vehicle["acceleration"] };
type LocalizedAnimal = Animal & { nameEn?: string; attributesEn?: string; skillsEn?: string; speedEn?: string; attacksEn?: AnimalAttack[]; specialEn?: string };

export const VEHICLES = data.vehicles as LocalizedVehicle[];
export const ANIMALS = data.animals as LocalizedAnimal[];

export function vehiclePresentation(item:Vehicle,locale:"pt-BR"|"en-US"):Vehicle {
  if(locale==="pt-BR") return item;
  const localized=item as LocalizedVehicle;
  return {...item,name:localized.nameEn??item.name,acceleration:localized.accelerationEn??item.acceleration};
}

export function animalPresentation(item:Animal,locale:"pt-BR"|"en-US"):Animal {
  if(locale==="pt-BR") return item;
  const localized=item as LocalizedAnimal;
  return {...item,name:localized.nameEn??item.name,attributes:localized.attributesEn??item.attributes,skills:localized.skillsEn??item.skills,speed:localized.speedEn??item.speed,attacks:localized.attacksEn??item.attacks,special:localized.specialEn??item.special};
}
