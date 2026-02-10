import React, { createContext, useContext, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('geoMantle_lang') || 'ko';
  });

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('geoMantle_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] ?? translations['ko']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
