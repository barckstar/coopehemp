import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import esData from './es.json';
import enData from './en.json';

export type Language = 'es' | 'en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Language, Record<string, any>> = { es: esData, en: enData };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('coope_lang');
    return stored === 'en' ? 'en' : 'es';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('coope_lang', newLang);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = translations[lang];
      for (const k of keys) {
        if (val && typeof val === 'object') val = val[k];
        else return key;
      }
      if (typeof val !== 'string') return key;
      if (!vars) return val;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, 'g'), v),
        val
      );
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used inside <LanguageProvider>');
  return ctx;
};
