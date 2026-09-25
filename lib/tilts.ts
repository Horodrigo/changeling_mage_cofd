import data from "./catalog-data/tilts.json";

export type TiltDefinition = {
  id: string; name: string; translatedName: string; category: "Personal" | "Environmental";
  description: string; effect: string; causing: string; ending: string;
  source: string; sourceCode: string; page: number;
};

export const TILTS = data as TiltDefinition[];
export const findTilt = (id:string) => TILTS.find((tilt) => tilt.id === id);
