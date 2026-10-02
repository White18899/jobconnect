import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import te from '../i18n/te.json';
import hi from '../i18n/hi.json';

export type Language = 'en' | 'te' | 'hi';

const dictionaries: Record<Language, any> = { en, te, hi };

export const LANGUAGE_LABELS: Record<Language, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('jobconnect_lang') as Language;
    return saved && ['en', 'te', 'hi'].includes(saved) ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jobconnect_lang', lang);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let curr = dictionaries[language];
    for (const key of keys) {
      if (curr && curr[key] !== undefined) {
        curr = curr[key];
      } else {
        // Fallback to English if translation missing
        let enCurr = dictionaries.en;
        for (const enKey of keys) {
          if (enCurr && enCurr[enKey] !== undefined) {
            enCurr = enCurr[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurr === 'string' ? enCurr : fallback || path;
      }
    }
    return typeof curr === 'string' ? curr : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
