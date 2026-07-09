import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const { menuItems, adsSettings } = useSettings();

  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getKhmerDay = (dayNum) => {
    const days = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    return days[dayNum];
  };

  const getKhmerMonth = (monthNum) => {
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    return months[monthNum];
  };

  const toKhmerDigits = (num) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(num).split('').map(char => khmerDigits[parseInt(char)] || char).join('');
  };

  const formatLiveDateTime = () => {
    if (language === 'km') {
      const day = getKhmerDay(liveTime.getDay());
      const dateNum = toKhmerDigits(liveTime.getDate());
      const month = getKhmerMonth(liveTime.getMonth());
      const year = toKhmerDigits(liveTime.getFullYear());
      const hours = toKhmerDigits(String(liveTime.getHours()).padStart(2, '0'));
      const minutes = toKhmerDigits(String(liveTime.getMinutes()).padStart(2, '0'));
      const seconds = toKhmerDigits(String(liveTime.getSeconds()).padStart(2, '0'));
      return `ថ្ងៃ${day}, ទី${dateNum} ខែ${month} ឆ្នាំ${year} - ${hours}:${minutes}:${seconds}`;
    } else {
      return liveTime.toLocaleString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      });
    }
  };

  // Structured menu query logic
  const visibleItems = menuItems.filter((item) => item.visible !== false);
  const topLevelMenus = visibleItems.filter((item) => !item.parentId);
  const getChildren = (parentId) => visibleItems.filter((item) => item.parentId === parentId);

  const headerBanners = adsSettings.enabled
    ? adsSettings.banners.filter((b) => b.placement === 'header')
    : [];

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
      
      {/* Live Date Time Banner Bar */}
      <div className="bg-gray-50 dark:bg-slate-950 py-1.5 border-b border-gray-150 dark:border-slate-855 text-[10px] sm:text-xs font-bold text-gray-500 dark:text-slate-400 select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>{formatLiveDateTime()}</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-[10px] uppercase tracking-wider">
            <span>{language === 'km' ? 'ព័ត៌មានជាតិ និងអន្តរជាតិ' : 'National & International News'}</span>
            <span className="text-gray-350 dark:text-slate-700">•</span>
            <span className="text-blue-600 dark:text-blue-400 animate-pulse font-extrabold">{language === 'km' ? 'ផ្សាយផ្ទាល់' : 'Live Update'}</span>
          </div>
        </div>
      </div>
      
      {/* Header Banner Ad Placement */}
      {headerBanners.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-900 py-3 flex justify-center items-center">
          {headerBanners.map((b) => (
            <a key={b.id} href={b.targetUrl} target="_blank" rel="noopener noreferrer" className="block max-w-4xl w-full px-4">
              <img 
                src={b.imageUrl} 
                alt="Advertisement" 
                className="w-full h-auto rounded-xl shadow-sm object-cover max-h-16 md:max-h-20" 
              />
            </a>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <a href="/" className="flex-shrink-0 flex items-center cursor-pointer select-none">
            <span className="text-3xl font-extrabold text-blue-600 tracking-tight">ANR</span>
            <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight ml-1">NEWS</span>
          </a>

          {/* Desktop Navigation (large screen threshold to avoid overlap) */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {topLevelMenus.map((menu) => {
              const children = getChildren(menu.id);
              const hasChildren = children.length > 0;
              const name = language === 'en' ? menu.title_en : menu.title_km;

              if (hasChildren) {
                return (
                  <div key={menu.id} className="relative group flex items-center h-full">
                    <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors duration-200 flex items-center space-x-1 py-3 cursor-pointer">
                      <span>{name}</span>
                      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {/* Hover Dropdown Wrapper with a top padding hover bridge */}
                    <div className="absolute top-full left-0 w-48 pt-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl py-2">
                        {children.map((child) => (
                          <a
                            key={child.id}
                            href={child.url}
                            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-slate-205 hover:bg-gray-55 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                          >
                            {language === 'en' ? child.title_en : child.title_km}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a 
                  key={menu.id} 
                  href={menu.url} 
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors duration-200"
                >
                  {name}
                </a>
              );
            })}
          </nav>

          {/* Search, Action Buttons, & Theme/Lang Toggles */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-5">
            {/* Search Box */}
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 xl:w-60 transition-all duration-300 focus:bg-white dark:focus:bg-slate-700 border border-transparent focus:border-gray-200 dark:focus:border-slate-600 text-sm"
              />
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Language Sliding Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-0.5 border border-gray-200 dark:border-slate-700 transition-colors">
              <button 
                onClick={() => setLanguage('km')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${language === 'km' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                ខ្មែរ
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l.707-.707M17.657 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
              )}
            </button>

            {/* Authentication Action Button */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <a 
                  href="/admin" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg text-sm"
                >
                  {t('dashboard')}
                </a>
                <button 
                  onClick={logout}
                  className="text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-semibold transition-colors cursor-pointer"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <a 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg text-center text-sm"
              >
                {t('signIn')}
              </a>
            )}
          </div>

          {/* Mobile Burger Toggle (Visible below lg: screen width) */}
          <div className="lg:hidden flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-1 cursor-pointer"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Slide-in Mobile Drawer Backed Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Drawer mobile navigation menu */}
      <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-55 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-out border-l border-gray-100 dark:border-slate-800 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Drawer Header Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
            <a href="/" className="flex items-center cursor-pointer select-none">
              <span className="text-2xl font-extrabold text-blue-600 tracking-tight">ANR</span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight ml-1">NEWS</span>
            </a>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-550 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Drawer Navigation Links with nested children */}
          <nav className="space-y-1">
            {topLevelMenus.map((menu) => {
              const children = getChildren(menu.id);
              const hasChildren = children.length > 0;
              const name = language === 'en' ? menu.title_en : menu.title_km;

              if (hasChildren) {
                return (
                  <div key={menu.id} className="space-y-1">
                    <span className="block px-3 py-1.5 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                      {name}
                    </span>
                    <div className="pl-4 border-l border-gray-150 dark:border-slate-800 space-y-1">
                      {children.map((child) => (
                        <a 
                          key={child.id} 
                          href={child.url} 
                          className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-355 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {language === 'en' ? child.title_en : child.title_km}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <a 
                  key={menu.id} 
                  href={menu.url} 
                  className="block px-3 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-slate-205 hover:bg-gray-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {name}
                </a>
              );
            })}
          </nav>
          
          {/* Mobile Search Widget */}
          <div className="relative pt-2">
            <input 
              type="text" 
              placeholder={t('searchMobile')} 
              className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent text-sm"
            />
          </div>
        </div>

        {/* Drawer Footer controls */}
        <div className="space-y-6 border-t border-gray-100 dark:border-slate-800 pt-6">
          {/* Language selection inside drawer */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{language === 'km' ? 'ភាសា' : 'Language'}</span>
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-0.5 border border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => setLanguage('km')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'km' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                ខ្មែរ
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Theme selection toggle inside drawer */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{language === 'km' ? 'រចនាប័ទ្ម' : 'Theme Mode'}</span>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300 cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  <span>Light</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l.707-.707M17.657 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Auth Action button inside drawer */}
          {isLoggedIn ? (
            <div className="space-y-2">
              <a 
                href="/admin" 
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl font-medium transition-colors shadow-md text-sm"
              >
                {t('dashboard')}
              </a>
              <button 
                onClick={logout}
                className="w-full text-center text-red-500 font-semibold py-2 transition-colors text-sm cursor-pointer"
              >
                {t('signOut')}
              </button>
            </div>
          ) : (
            <a 
              href="/login" 
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl font-medium transition-colors shadow-md text-sm"
            >
              {t('signIn')}
            </a>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
