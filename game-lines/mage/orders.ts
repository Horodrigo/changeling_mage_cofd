import affiliationCatalog from "./catalog-data/affiliations.json";
import orderCatalog from "./catalog-data/orders.json";
import { freezeCatalogData } from "@/lib/catalog/catalog-service";
import { mageMessages } from "@/lib/i18n/messages/mage";

export type MageOrderDefinition={id:string;name:string;translatedName?:string;category:string;roteSkills:string[];description:string;descriptionPt?:string;source:string;page:number;creationBenefits:boolean};
export type MageAffiliationDefinition={id:string;name:string;kind:"ministry";parentOrder:string;patronExarch:string;additionalPatronExarchs?:string[];roteSkills?:string[];description:string;descriptionPt?:string;source:string;page:number};

const exarchKeys = { Eye: "exarchEye", Father: "exarchFather", General: "exarchGeneral", Unity: "exarchUnity", Chancellor: "exarchChancellor", Raptor: "exarchRaptor", Prophet: "exarchProphet", Nemesis: "exarchNemesis", Ruin: "exarchRuin" } as const;
export function mageAffiliationPresentation(affiliation: MageAffiliationDefinition, locale: "pt-BR" | "en-US") {
  const patron = (name: string) => {
    const key = exarchKeys[name as keyof typeof exarchKeys];
    return key ? mageMessages[locale].ui.meritConfig[key] : name;
  };
  return {
    description: locale === "pt-BR" ? affiliation.descriptionPt ?? affiliation.description : affiliation.description,
    patrons: [affiliation.patronExarch, ...(affiliation.additionalPatronExarchs ?? [])].map(patron).join(" / "),
  };
}

export const MAGE_ORDERS=freezeCatalogData(orderCatalog) as unknown as readonly MageOrderDefinition[];
export const MAGE_AFFILIATIONS=freezeCatalogData(affiliationCatalog) as unknown as readonly MageAffiliationDefinition[];
export const PUBLISHED_MAGE_ORDERS=MAGE_ORDERS.map((order)=>order.name);
export const findMageOrder=(value:unknown)=>MAGE_ORDERS.find((order)=>order.name===String(value)||order.id===String(value));
export const findMageAffiliation=(value:unknown)=>MAGE_AFFILIATIONS.find((affiliation)=>affiliation.id===String(value));
export const mageAffiliationsFor=(order:unknown)=>MAGE_AFFILIATIONS.filter((affiliation)=>affiliation.parentOrder===String(order));
export const hasPublishedMageOrder=(order:unknown)=>Boolean(findMageOrder(order));
export const hasStandardCreationOrderBenefits=(order:unknown)=>Boolean(findMageOrder(order)?.creationBenefits);
