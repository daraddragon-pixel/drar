import React from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import { SkeletonNewsCard } from './Skeleton';
import { useLanguage } from '../../context/LanguageContext';

const NewsGrid = ({ articles, isLoading, emptyMessage }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonNewsCard key={idx} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-gray-150 dark:border-slate-800 text-center max-w-xl mx-auto shadow-sm">
        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4-3l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">
          {emptyMessage || t('categoryEmpty')}
        </h2>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {articles.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
};

export default NewsGrid;
