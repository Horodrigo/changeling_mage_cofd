import type { MessageKey } from "@/lib/i18n";

export type HubrisTierId = "enlightened" | "understanding" | "falling";

export type HubrisAct = {
  id: string;
  labelKey: MessageKey;
};

export type HubrisTier = {
  id: HubrisTierId;
  minimumWisdom: number;
  dice: number;
  labelKey: MessageKey;
  acts: readonly HubrisAct[];
};

export const HUBRIS_TIERS: readonly HubrisTier[] = [
  {
    id: "enlightened", minimumWisdom: 8, dice: 5, labelKey: "ui.hubrisEnlightened",
    acts: [
      { id: "mundane-with-magic", labelKey: "ui.hubrisMundaneWithMagic" },
      { id: "innocent-bystanders", labelKey: "ui.hubrisInnocentBystanders" },
      { id: "other-enlightened", labelKey: "ui.hubrisOtherEnlightened" },
    ],
  },
  {
    id: "understanding", minimumWisdom: 4, dice: 3, labelKey: "ui.hubrisUnderstanding",
    acts: [
      { id: "sleeper-witness", labelKey: "ui.hubrisSleeperWitness" },
      { id: "self-mutilation", labelKey: "ui.hubrisSelfMutilation" },
      { id: "uncontained-paradox", labelKey: "ui.hubrisUncontainedParadox" },
      { id: "coerce-sapient", labelKey: "ui.hubrisCoerceSapient" },
      { id: "premeditated-violence", labelKey: "ui.hubrisPremeditatedViolence" },
      { id: "other-understanding", labelKey: "ui.hubrisOtherUnderstanding" },
    ],
  },
  {
    id: "falling", minimumWisdom: 1, dice: 1, labelKey: "ui.hubrisFalling",
    acts: [
      { id: "rage-killing", labelKey: "ui.hubrisRageKilling" },
      { id: "destroy-awakened-soul", labelKey: "ui.hubrisDestroyAwakenedSoul" },
      { id: "lose-supernal-being", labelKey: "ui.hubrisLoseSupernalBeing" },
      { id: "deal-with-abyss", labelKey: "ui.hubrisDealWithAbyss" },
      { id: "other-falling", labelKey: "ui.hubrisOtherFalling" },
    ],
  },
];

export function availableHubrisTiers(wisdom: number) {
  return HUBRIS_TIERS.filter((tier) => wisdom >= tier.minimumWisdom);
}

export function wisdomState(wisdom: number) {
  const tier = HUBRIS_TIERS.find((candidate) => wisdom >= candidate.minimumWisdom)?.id;
  return tier ? tier[0].toUpperCase() + tier.slice(1) : "Mad";
}

export function hubrisPool(tier: HubrisTier, modifiers: { obsession: boolean; virtue: boolean; vice: boolean }) {
  return tier.dice - Number(modifiers.obsession) + Number(modifiers.virtue) - Number(modifiers.vice);
}
