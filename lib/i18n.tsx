"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "pt-BR" | "en-US";
const STORAGE_KEY = "arquivo-das-trevas:locale:v1";

const messages = {
  "pt-BR": { home:"Início", characters:"Personagens", homebrews:"Homebrews", mainNavigation:"Navegação principal", language:"Idioma", portuguese:"Português", english:"Inglês", sheetActions:"Ações da ficha", manageSheets:"Gerenciar fichas", createSheet:"Criar ficha", importJson:"Importar JSON", saveJson:"Salvar JSON", deleteSheet:"Deletar ficha", closeNotice:"Fechar aviso" },
  "en-US": { home:"Home", characters:"Characters", homebrews:"Homebrews", mainNavigation:"Main navigation", language:"Language", portuguese:"Portuguese", english:"English", sheetActions:"Character actions", manageSheets:"Manage characters", createSheet:"Create character", importJson:"Import JSON", saveJson:"Save JSON", deleteSheet:"Delete character", closeNotice:"Close notice" },
} as const;
type MessageKey = keyof typeof messages["pt-BR"];

const LanguageContext = createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:(key:MessageKey)=>string;tr:(portuguese:string,english:string)=>string}|null>(null);

export function LanguageProvider({children}:{children:ReactNode}) {
  const [locale,setLocaleState]=useState<Locale>("pt-BR");
  const setLocale=(next:Locale)=>{setLocaleState(next);window.localStorage.setItem(STORAGE_KEY,next)};
  useEffect(()=>{
    const stored=window.localStorage.getItem(STORAGE_KEY);
    if(stored==="en-US")setLocaleState("en-US");
  },[]);
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
