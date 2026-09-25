import affiliationCatalog from "./catalog-data/affiliations.json";
import orderCatalog from "./catalog-data/orders.json";
import { freezeCatalogData } from "@/lib/catalog/catalog-service";

export type MageOrderDefinition={id:string;name:string;translatedName?:string;category:string;roteSkills:string[];description:string;descriptionPt?:string;source:string;page:number;creationBenefits:boolean};
export type MageAffiliationDefinition={id:string;name:string;kind:"ministry";parentOrder:string;patronExarch:string;additionalPatronExarchs?:string[];roteSkills?:string[];description:string;source:string;page:number};

export const MAGE_ORDERS=freezeCatalogData(orderCatalog) as unknown as readonly MageOrderDefinition[];
export const MAGE_AFFILIATIONS=freezeCatalogData(affiliationCatalog) as unknown as readonly MageAffiliationDefinition[];
export const PUBLISHED_MAGE_ORDERS=MAGE_ORDERS.map((order)=>order.name);
export const findMageOrder=(value:unknown)=>MAGE_ORDERS.find((order)=>order.name===String(value)||order.id===String(value));
export const findMageAffiliation=(value:unknown)=>MAGE_AFFILIATIONS.find((affiliation)=>affiliation.id===String(value));
export const mageAffiliationsFor=(order:unknown)=>MAGE_AFFILIATIONS.filter((affiliation)=>affiliation.parentOrder===String(order));
export const hasPublishedMageOrder=(order:unknown)=>Boolean(findMageOrder(order));
export const hasStandardCreationOrderBenefits=(order:unknown)=>Boolean(findMageOrder(order)?.creationBenefits);
