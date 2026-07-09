import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) return savedLang;
    return 'km'; // default to Khmer
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to Khmer
    if (translations['km'] && translations['km'][key]) {
      return translations['km'][key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
