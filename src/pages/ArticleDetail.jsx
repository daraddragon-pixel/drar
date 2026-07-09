import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import CommentBox from '../components/ui/CommentBox';
import Breadcrumb from '../components/ui/Breadcrumb';
import ArticleContent from '../components/ui/ArticleContent';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategorySlug } from '../utils/getCategorySlug';
import { useSettings } from '../context/SettingsContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { articles, incrementViews } = useNews();
  const { adsSettings } = useSettings();

  useEffect(() => {
    if (id) {
      incrementViews(parseInt(id));
    }
  }, [id]);

  const rawArticle = articles.find(news => news.id === parseInt(id));

  if (!rawArticle) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">
              {t('articleNotFound')}
            </h2>
            <Link 
              to="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm shadow-md"
            >
              {t('backToHome')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === 'en' && rawArticle.title_en ? rawArticle.title_en : rawArticle.title;
  const category = language === 'en' && rawArticle.category_en ? rawArticle.category_en : rawArticle.category;

  const breadcrumbItems = [
    { name: t('home'), path: '/' },
    { name: category, path: `/category/${getCategorySlug(rawArticle.category)}` },
    { name: title }
  ];

  const postEndBanners = adsSettings.enabled
    ? adsSettings.banners.filter((b) => b.placement === 'post_end')
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Reusable Breadcrumb Component */}
        <Breadcrumb items={breadcrumbItems} />

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (Left) */}
          <div className="lg:col-span-8">
            {/* Reusable ArticleContent Component */}
            <ArticleContent article={rawArticle} />

            {/* End of Post Banner Ad Placement */}
            {postEndBanners.length > 0 && (
              <div className="my-8 flex justify-center">
                {postEndBanners.map((b) => (
                  <a key={b.id} href={b.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <img 
                      src={b.imageUrl} 
                      alt="Post Advertisement" 
                      className="w-full h-auto rounded-2xl shadow-sm object-cover max-h-36 md:max-h-40" 
                    />
                  </a>
                ))}
              </div>
            )}

            {/* Comment Section Box */}
            <CommentBox articleId={rawArticle.id} />
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
