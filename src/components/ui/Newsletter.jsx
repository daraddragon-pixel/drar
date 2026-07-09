import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Newsletter = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-20 bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          {t('newsletterTitle')}
        </h2>
        <p className="text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto text-lg">
          {t('newsletterDesc')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-4">
          <input 
            type="email" 
            placeholder={t('emailPlaceholder')}
            className="px-6 py-4 rounded-full w-full text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all text-lg border border-transparent dark:border-slate-700"
          />
          <button className="bg-gray-900 dark:bg-slate-950 hover:bg-black dark:hover:bg-black text-white px-8 py-4 rounded-full font-bold transition-colors whitespace-nowrap shadow-md text-lg">
            {t('subscribe')}
          </button>
        </div>
      </div>
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 dark:bg-blue-600 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-700 dark:bg-blue-800 opacity-50 blur-3xl"></div>
    </div>
  );
};

export default Newsletter;
