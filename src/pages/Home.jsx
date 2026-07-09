import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NewsGrid from '../components/ui/NewsGrid';
import Newsletter from '../components/ui/Newsletter';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const { articles } = useNews();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 dark:border-blue-500 pl-4 transition-colors">
            {t('latestNews')}
          </h1>
          <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors">
            {t('viewAll')}
            <svg className="w-5 h-5 ml-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>

        {/* News Grid Component */}
        <NewsGrid 
          articles={articles} 
          isLoading={isLoading} 
        />
        
        {/* Newsletter Section Component */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
