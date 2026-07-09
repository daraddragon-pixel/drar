import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { useLanguage } from '../../context/LanguageContext';
import { getCategorySlug } from '../../utils/getCategorySlug';

const NewsCard = ({ news }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const title = language === 'en' && news.title_en ? news.title_en : news.title;
  const description = language === 'en' && news.description_en ? news.description_en : news.description;
  const category = language === 'en' && news.category_en ? news.category_en : news.category;

  const formattedViews = news.views.toLocaleString(language === 'en' ? 'en-US' : 'km-KH');

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const slug = getCategorySlug(news.category);
    if (slug) {
      navigate(`/category/${slug}`);
    }
  };

  return (
    <Link 
      to={`/article/${news.id}`} 
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-black/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 dark:border-slate-800 flex flex-col h-full cursor-pointer block"
    >
      
      {/* Image Container with Overlay */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={news.image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={handleCategoryClick}
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            {category}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-slate-400 text-sm mb-5 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Footer Meta Data */}
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-slate-400 mt-auto pt-4 border-t border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{formatDate(news.createdAt, language)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <span>{formattedViews} {t('viewsUnit')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
