"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type Locale = "pt-BR" | "en-US";
const STORAGE_KEY = "arquivo-das-trevas:locale:v1";

const messages = {
  "pt-BR": { home:"Início", characters:"Personagens", homebrews:"Homebrews", mainNavigation:"Navegação principal", language:"Idioma", portuguese:"Português", english:"Inglês", sheetActions:"Importar/Exportar", manageSheets:"Gerenciar fichas", createSheet:"Criar ficha", importJson:"Importar JSON", saveJson:"Exportar JSON", deleteSheet:"Deletar ficha", closeNotice:"Fechar aviso" },
  "en-US": { home:"Home", characters:"Characters", homebrews:"Homebrews", mainNavigation:"Main navigation", language:"Language", portuguese:"Portuguese", english:"English", sheetActions:"Import/Export", manageSheets:"Manage characters", createSheet:"Create character", importJson:"Import JSON", saveJson:"Export JSON", deleteSheet:"Delete character", closeNotice:"Close notice" },
} as const;
type MessageKey = keyof typeof messages["pt-BR"];

const LanguageContext = createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:(key:MessageKey)=>string;tr:(portuguese:string,english:string)=>string}|null>(null);

const LANGUAGE_CHANGE_EVENT = "characters-of-the-darkness:language-change";
// English is the canonical catalog language and the first-run application
// language. Portuguese is an opt-in presentation preference only.
const serverLocale = ():Locale => "en-US";
const browserLocale = ():Locale =>
  window.localStorage.getItem(STORAGE_KEY) === "pt-BR" ? "pt-BR" : "en-US";
const subscribeToLocale = (notify:()=>void) => {
  const onStorage = (event:StorageEvent) => {
    if (event.key === STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, notify);
  };
};

export function LanguageProvider({children}:{children:ReactNode}) {
  const locale=useSyncExternalStore(subscribeToLocale,browserLocale,serverLocale);
  const setLocale=(next:Locale)=>{
    window.localStorage.setItem(STORAGE_KEY,next);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };
  useEffect(()=>{document.documentElement.lang=locale},[locale]);
  const tr=(portuguese:string,english:string)=>locale==="pt-BR"?portuguese:english;
  return <LanguageContext.Provider value={{locale,setLocale,t:key=>messages[locale][key],tr}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error("useLanguage must be used inside LanguageProvider");return context}
export const localeFlag=(locale:Locale)=>locale==="pt-BR"?"🇧🇷":"🇺🇸";
export const languageStorageKey=STORAGE_KEY;
export const localized = (locale: Locale, portuguese: string, english: string) =>
  locale === "pt-BR" ? portuguese : english;

export function localizedCount(
  locale: Locale,
  count: number,
  portugueseSingular: string,
  portuguesePlural: string,
  englishSingular: string,
  englishPlural: string,
) {
  const label = locale === "pt-BR"
    ? count === 1 ? portugueseSingular : portuguesePlural
    : count === 1 ? englishSingular : englishPlural;
  return `${count} ${label}`;
}
