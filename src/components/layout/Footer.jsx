import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 pt-16 pb-8 border-t-4 border-blue-600 dark:border-blue-500 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-extrabold text-blue-500 tracking-tight">ANR</span>
              <span className="text-3xl font-extrabold text-white tracking-tight ml-1">NEWS</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 leading-relaxed text-sm">
              {t('aboutUsText')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white dark:text-slate-100 text-lg font-bold mb-6 tracking-wide">{t('categories')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('nationalNews')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('internationalNews')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('sports')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('tech')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('economy')}</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white dark:text-slate-100 text-lg font-bold mb-6 tracking-wide">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('aboutUs')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('contactUs')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('advertise')}</a></li>
              <li><a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">{t('privacyPolicy')}</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white dark:text-slate-100 text-lg font-bold mb-6 tracking-wide">{t('contactUs')}</h3>
            <ul className="space-y-3 text-sm text-slate-400 dark:text-slate-500">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>contact@anrnews.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 dark:border-slate-900 text-sm flex flex-col md:flex-row justify-between items-center text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} ANR News. {t('allRightsReserved')}.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-blue-600 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-blue-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center hover:bg-red-600 transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
