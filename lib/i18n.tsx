"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { commonMessages } from "./i18n/messages/common";
import { mortalMessages } from "./i18n/messages/mortal";
import { changelingMessages } from "./i18n/messages/changeling";
import { mageMessages } from "./i18n/messages/mage";
import { vampireMessages } from "./i18n/messages/vampire";

export type Locale = "pt-BR" | "en-US";
const STORAGE_KEY = "arquivo-das-trevas:locale:v1";

type MessageTree = { readonly [key: string]: string | MessageTree };

function mergeMessageTrees(...parts: readonly MessageTree[]): MessageTree {
  const result: Record<string, string | MessageTree> = {};
  for (const part of parts) {
    for (const [key, value] of Object.entries(part)) {
      const current = result[key];
      result[key] = typeof value === "string"
        ? value
        : mergeMessageTrees(typeof current === "object" ? current : {}, value);
    }
  }
  return result;
}

export const messages = {
  "pt-BR": mergeMessageTrees(commonMessages["pt-BR"], mortalMessages["pt-BR"], changelingMessages["pt-BR"], mageMessages["pt-BR"], vampireMessages["pt-BR"]),
  "en-US": mergeMessageTrees(commonMessages["en-US"], mortalMessages["en-US"], changelingMessages["en-US"], mageMessages["en-US"], vampireMessages["en-US"]),
} as const;

type MessageLeafPaths<Value, Prefix extends string = ""> = Value extends string
  ? Prefix
  : { [Key in keyof Value & string]: MessageLeafPaths<Value[Key], `${Prefix}${Prefix extends "" ? "" : "."}${Key}`> }[keyof Value & string];

export type MessageKey =
  | MessageLeafPaths<typeof commonMessages["pt-BR"]>
  | MessageLeafPaths<typeof mortalMessages["pt-BR"]>
  | MessageLeafPaths<typeof changelingMessages["pt-BR"]>
  | MessageLeafPaths<typeof mageMessages["pt-BR"]>
  | MessageLeafPaths<typeof vampireMessages["pt-BR"]>;

export type TranslationParams = Readonly<Record<string, string | number>>;
export type Translator = <Key extends MessageKey>(key: Key, params?: TranslationParams) => string;

function messageAt(locale: Locale, key: string): string | undefined {
  return key.split(".").reduce<unknown>((current, segment) =>
    current && typeof current === "object" ? (current as Record<string, unknown>)[segment] : undefined,
  messages[locale]) as string | undefined;
}

export function translate(locale: Locale, key: string, params: TranslationParams = {}): string {
  const template = messageAt(locale, key);
  if (typeof template !== "string") return `[missing translation: ${key}]`;
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (token, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : token,
  );
}

const LanguageContext = createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:Translator}|null>(null);

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
  const t: Translator = (key,params={})=>translate(locale,key,params);
  return <LanguageContext.Provider value={{locale,setLocale,t}}>{children}</LanguageContext.Provider>;
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
