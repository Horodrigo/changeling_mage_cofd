export type NimbusTiltEffect={trait:string;modifier:number};

export function mageNimbusConnection(wisdom:unknown):"Strong"|"Medium"|"Weak"{
  const rating=Math.max(0,Math.min(10,Math.trunc(Number(wisdom)||0)));
  return rating>=8?"Strong":rating>=4?"Medium":"Weak";
}

export function mageNimbusTiltBudget(gnosis:unknown):number{
  return Math.max(1,Math.ceil(Math.max(1,Math.min(10,Math.trunc(Number(gnosis)||1)))/2));
}

export function normalizeNimbusTiltEffects(value:unknown,gnosis:unknown):NimbusTiltEffect[]{
  if(!Array.isArray(value))return[];
  const budget=mageNimbusTiltBudget(gnosis),seen=new Set<string>();let remaining=budget;
  return value.flatMap(item=>{
    if(!item||typeof item!=="object"||remaining<1)return[];
    const trait=String((item as Record<string,unknown>).trait??"").trim();
    if(!trait||seen.has(trait))return[];
    const raw=Math.trunc(Number((item as Record<string,unknown>).modifier??0));
    if(!raw)return[];
    const modifier=Math.sign(raw)*Math.min(Math.abs(raw),remaining);
    seen.add(trait);remaining-=Math.abs(modifier);
    return[{trait,modifier}];
  });
}
