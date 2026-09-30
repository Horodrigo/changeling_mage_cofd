import type { MessageKey } from "@/lib/i18n";

export type KithCreationChoice = {
  kind: "skill" | "specialty" | "text";
  labelKey: MessageKey;
  options?: readonly string[];
  skillNames?: readonly string[];
  placeholderKey?: MessageKey;
};

const skill = (...options:string[]):KithCreationChoice => ({
  kind:"skill",labelKey:"ui.kithChoiceSkill",options,
});

export const KITH_CREATION_CHOICES:Readonly<Record<string,KithCreationChoice>>={
  artist:skill("Crafts","Expression"),
  bearskin:skill("Intimidation","Weaponry"),
  bricoleur:{kind:"specialty",labelKey:"ui.kithChoiceSpecialty",skillNames:["Crafts","Expression"]},
  chevalier:skill("Persuasion","Intimidation"),
  draconic:skill("Brawl","Weaponry"),
  gravewight:skill("Empathy","Intimidation"),
  hunterheart:skill("Investigation","Survival"),
  moonborn:skill("Empathy","Intimidation"),
  swarmflight:{kind:"text",labelKey:"ui.kithChoiceSwarmForm",placeholderKey:"ui.kithChoiceSwarmPlaceholder"},
  valkyrie:skill("Persuasion","Intimidation"),
  whisperwisp:skill("Stealth","Persuasion"),
};

export function kithCreationChoice(kithId:unknown):KithCreationChoice|undefined {
  return KITH_CREATION_CHOICES[String(kithId??"")];
}
