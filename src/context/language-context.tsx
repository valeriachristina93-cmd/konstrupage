
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { translations, TranslationKey } from '@/lib/translations';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('language') as Language;
      if (storedLang && ['pt', 'en', 'es'].includes(storedLang)) {
        setLanguageState(storedLang);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
       console.error("Failed to access localStorage:", error);
    }
    setLanguageState(lang);
  };

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations['pt'][key];
  }, [language]);

  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
