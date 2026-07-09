import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { getCategorySlug } from '../../utils/getCategorySlug';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

const ArticleContent = ({ article }) => {
  const { language, t } = useLanguage();
  const { adsSettings } = useSettings();

  if (!article) return null;

  const title = language === 'en' && article.title_en ? article.title_en : article.title;
  const description = language === 'en' && article.description_en ? article.description_en : article.description;
  const content = language === 'en' && article.content_en ? article.content_en : article.content;
  const category = language === 'en' && article.category_en ? article.category_en : article.category;

  const formattedViews = article.views.toLocaleString(language === 'en' ? 'en-US' : 'km-KH');

  // Split content into paragraphs
  const paragraphs = content.split('\n').filter((p) => p.trim());

  // Filter inside post banners
  const insideBanners = adsSettings.enabled
    ? adsSettings.banners.filter((b) => b.placement === 'inside_post')
    : [];

  return (
    <>
      {/* Article Header */}
      <header className="mb-8">
        <Link 
          to={`/category/${getCategorySlug(article.category)}`} 
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm transition-colors cursor-pointer"
        >
          {category}
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight mb-6">
          {title}
        </h1>
        <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm space-x-6 border-b border-gray-200 dark:border-slate-800 pb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{formatDate(article.createdAt, language)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1.5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{formattedViews} {t('viewsUnit')}</span>
          </div>
        </div>
      </header>

      {/* Feature Image */}
      <div className="rounded-2xl overflow-hidden mb-10 shadow-lg relative group">
        <img src={article.image} alt={title} className="w-full h-auto object-cover aspect-video" />
      </div>

      {/* Article Content Text */}
      <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-gray-800 dark:text-slate-200 leading-relaxed font-serif transition-colors duration-300">
        <p className="text-xl font-medium text-gray-600 dark:text-slate-350 mb-8 leading-relaxed border-l-4 border-blue-600 dark:border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950/20 py-3 rounded-r-lg">
          {description}
        </p>
        
        <div className="text-lg space-y-5">
          {paragraphs.map((p, index) => (
            <React.Fragment key={index}>
              <p>{p}</p>
              
              {/* Inject Ads after 2nd paragraph (index === 1), or after 1st if it is single-paragraph */}
              {((index === 1) || (paragraphs.length === 1 && index === 0)) && adsSettings.enabled && (insideBanners.length > 0 || adsSettings.adsenseCode) && (
                <div className="my-8 py-4 flex flex-col items-center justify-center border-y border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl p-4 transition-colors">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3.5 font-bold select-none">
                    Sponsored Advertisement
                  </span>
                  
                  {insideBanners.length > 0 ? (
                    insideBanners.map((b) => (
                      <a key={b.id} href={b.targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full max-w-2xl">
                        <img 
                          src={b.imageUrl} 
                          alt="Inside Article Ad" 
                          className="w-full h-auto rounded-xl shadow-sm object-cover max-h-32 md:max-h-36 hover:opacity-95 transition-opacity" 
                        />
                      </a>
                    ))
                  ) : (
                    <div className="w-full text-center" dangerouslySetInnerHTML={{ __html: adsSettings.adsenseCode }} />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </article>
    </>
  );
};

export default ArticleContent;
