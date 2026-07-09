import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockNews } from '../data/mockNews';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('anr_news_articles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to mockNews
      }
    }
    return mockNews;
  });

  // Save to localStorage whenever articles modify
  useEffect(() => {
    localStorage.setItem('anr_news_articles', JSON.stringify(articles));
  }, [articles]);

  // Traffic Simulator effect: Simulates live visitors by incrementing views of random posts every 12s
  useEffect(() => {
    const interval = setInterval(() => {
      setArticles((prev) => {
        if (prev.length === 0) return prev;
        const randomIndex = Math.floor(Math.random() * prev.length);
        const addedViews = Math.floor(Math.random() * 3) + 1; // 1-3 views
        return prev.map((art, idx) => 
          idx === randomIndex ? { ...art, views: art.views + addedViews } : art
        );
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const addArticle = (newArticle) => {
    setArticles((prev) => [newArticle, ...prev]);
  };

  const deleteArticle = (id) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
  };

  const incrementViews = (id) => {
    setArticles((prev) => 
      prev.map((art) => art.id === id ? { ...art, views: art.views + 1 } : art)
    );
  };

  return (
    <NewsContext.Provider value={{ articles, addArticle, deleteArticle, incrementViews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
