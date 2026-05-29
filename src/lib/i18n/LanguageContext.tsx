"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./dictionaries/en";
import { ur } from "./dictionaries/ur";

type Locale = "en" | "ur";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { en, ur };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("zentaro-locale") as Locale;
    if (saved === "en" || saved === "ur") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("zentaro-locale", newLocale);
  };

  const dir = locale === "ur" ? "rtl" : "ltr";

  // Dynamic nested key lookup (e.g. t('common.brandName'))
  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = dictionaries[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English key path if not found in Urdu
        let enCurrent: any = dictionaries.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === "object" && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return keyPath;
          }
        }
        return typeof enCurrent === "string" ? enCurrent : keyPath;
      }
    }

    return typeof current === "string" ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir} className={locale === "ur" ? "font-urdu" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
