export type KithCreationChoice = {
  kind: "skill" | "specialty" | "text";
  labelPt: string;
  labelEn: string;
  options?: readonly string[];
  skillNames?: readonly string[];
  placeholderPt?: string;
  placeholderEn?: string;
};

const skill = (...options:string[]):KithCreationChoice => ({
  kind:"skill",labelPt:"Perícia da Bênção",labelEn:"Blessing Skill",options,
});

export const KITH_CREATION_CHOICES:Readonly<Record<string,KithCreationChoice>>={
  artist:skill("Crafts","Expression"),
  bearskin:skill("Intimidation","Weaponry"),
  bricoleur:{kind:"specialty",labelPt:"Especialização da Bênção",labelEn:"Blessing Specialty",skillNames:["Crafts","Expression"]},
  chevalier:skill("Persuasion","Intimidation"),
  draconic:skill("Brawl","Weaponry"),
  gravewight:skill("Empathy","Intimidation"),
  hunterheart:skill("Investigation","Survival"),
  moonborn:skill("Empathy","Intimidation"),
  swarmflight:{kind:"text",labelPt:"Forma do enxame",labelEn:"Swarm form",placeholderPt:"Animais, objetos ou fenômeno de Tamanho 0–1",placeholderEn:"Size 0–1 creatures, objects, or phenomenon"},
  valkyrie:skill("Persuasion","Intimidation"),
  whisperwisp:skill("Stealth","Persuasion"),
};

export function kithCreationChoice(kithId:unknown):KithCreationChoice|undefined {
  return KITH_CREATION_CHOICES[String(kithId??"")];
}
