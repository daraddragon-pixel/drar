import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatDate';
import { useSettings } from '../../context/SettingsContext';

const Sidebar = () => {
  const { articles } = useNews();
  const { language, t } = useLanguage();
  const { adsSettings } = useSettings();

  // Sort articles by views to find the popular ones
  const popularArticles = articles
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const categories = [
    { key: 'sports', name: t('sports'), path: '/category/sports', rawName: 'កីឡា' },
    { key: 'tech', name: t('tech'), path: '/category/tech', rawName: 'បច្គេកវិទ្យា' }, // Fixed mapping matching raw data categories
    { key: 'economy', name: t('economy'), path: '/category/economy', rawName: 'សេដ្ឋកិច្ច' },
    { key: 'social', name: t('social'), path: '/category/social', rawName: 'សង្គម' },
  ];

  // Helper to count articles in each category
  const getCategoryCount = (rawCategory) => {
    return articles.filter((article) => article.category === rawCategory).length;
  };

  const sidebarBanners = adsSettings.enabled
    ? adsSettings.banners.filter((b) => b.placement === 'sidebar')
    : [];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
      
      {/* Popular News Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 dark:border-blue-500 pl-3 mb-6">
          {t('popularNews')}
        </h3>
        <div className="space-y-6">
          {popularArticles.map((article) => {
            const title = language === 'en' && article.title_en ? article.title_en : article.title;
            const category = language === 'en' && article.category_en ? article.category_en : article.category;
            const formattedViews = article.views.toLocaleString(language === 'en' ? 'en-US' : 'km-KH');

            return (
              <Link 
                key={article.id} 
                to={`/article/${article.id}`} 
                className="flex items-start space-x-3 group cursor-pointer block"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={article.image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {category}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                    {title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400 dark:text-slate-550 mt-1">
                    <span>{formattedViews} {t('viewsUnit')}</span>
                    <span>•</span>
                    <span>{formatDate(article.createdAt, language)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 dark:border-blue-500 pl-3 mb-6">
          {t('categories')}
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.rawName);
            const countFormatted = language === 'en' ? count : count.toLocaleString('km-KH');

            return (
              <Link 
                key={cat.key} 
                to={cat.path} 
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-850 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-medium"
              >
                <span>{cat.name}</span>
                <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-450 text-xs px-2.5 py-1 rounded-full font-bold">
                  {countFormatted}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Ad Placement */}
      {sidebarBanners.length > 0 && (
        <div className="space-y-4">
          {sidebarBanners.map((b) => (
            <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex justify-center transition-colors duration-300">
              <a href={b.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <img 
                  src={b.imageUrl} 
                  alt="Sidebar Advertisement" 
                  className="w-full h-auto rounded-xl object-cover hover:opacity-95 transition-opacity" 
                />
              </a>
            </div>
          ))}
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
