import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';
import NewsGrid from '../components/ui/NewsGrid';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const categoryMap = {
  sports: { raw: 'កីឡា', key: 'sports' },
  tech: { raw: 'បច្ចេកវិទ្យា', key: 'tech' },
  economy: { raw: 'សេដ្ឋកិច្ច', key: 'economy' },
  social: { raw: 'សង្គម', key: 'social' },
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { language, t } = useLanguage();
  const { articles } = useNews();
  const { menuItems } = useSettings();
  const [isLoading, setIsLoading] = useState(true);

  const activeCategory = categoryMap[categoryName] || null;

  // Locate the matching menu settings configured in the Smart Menu Builder
  const matchingMenu = menuItems.find((m) => m.url === `/category/${categoryName}`);

  // Filter news articles based on matching raw category name
  let filteredNews = activeCategory
    ? articles.filter((article) => article.category === activeCategory.raw)
    : [];

  // Respect dynamic query logic settings (Order By & Item Limit)
  if (matchingMenu && activeCategory) {
    const orderBy = matchingMenu.orderBy || 'newest';
    const limit = matchingMenu.itemLimit || 10;

    // Apply sorting
    if (orderBy === 'views') {
      filteredNews = [...filteredNews].sort((a, b) => b.views - a.views);
    } else if (orderBy === 'alphabetical') {
      filteredNews = [...filteredNews].sort((a, b) => {
        const titleA = language === 'en' && a.title_en ? a.title_en : a.title;
        const titleB = language === 'en' && b.title_en ? b.title_en : b.title;
        return titleA.localeCompare(titleB);
      });
    } else { // default to newest
      filteredNews = [...filteredNews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply limit
    filteredNews = filteredNews.slice(0, limit);
  }

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms simulated fetch delay

    return () => clearTimeout(timer);
  }, [categoryName]);

  // Update page tab title
  useEffect(() => {
    if (activeCategory) {
      const categoryTitle = t(activeCategory.key);
      document.title = `${categoryTitle}${t('categoryTitleSuffix')} - ANR NEWS`;
    } else {
      document.title = `ANR NEWS`;
    }
  }, [activeCategory, language]);

  if (!activeCategory) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-200 mb-4">
              {t('categoryEmpty')}
            </h1>
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {t('backToHome')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryNameDisplay = t(activeCategory.key);
  const articleCountText = t('articlesCount').replace(
    '{count}',
    language === 'en' ? filteredNews.length : filteredNews.length.toLocaleString('km-KH')
  );

  const breadcrumbItems = [
    { name: t('home'), path: '/' },
    { name: categoryNameDisplay },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Component */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Category Header */}
        <div className="mb-10 pb-6 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 dark:border-blue-500 pl-4 transition-colors">
            {categoryNameDisplay}
          </h1>
          <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">
            {articleCountText}
          </span>
        </div>

        {/* Reusable NewsGrid Component */}
        <NewsGrid 
          articles={filteredNews} 
          isLoading={isLoading} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
