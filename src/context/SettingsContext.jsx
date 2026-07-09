import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const defaultMenuItems = [
  { id: 1, title_km: 'ទំព័រដើម', title_en: 'Home', url: '/', order: 1, visible: true, parentId: null, orderBy: 'newest', itemLimit: 10 },
  { id: 2, title_km: 'កីឡា', title_en: 'Sports', url: '/category/sports', order: 2, visible: true, parentId: null, orderBy: 'newest', itemLimit: 10 },
  { id: 3, title_km: 'បច្ចេកវិទ្យា', title_en: 'Technology', url: '/category/tech', order: 3, visible: true, parentId: null, orderBy: 'newest', itemLimit: 10 },
  { id: 4, title_km: 'សេដ្ឋកិច្ច', title_en: 'Economy', url: '/category/economy', order: 4, visible: true, parentId: null, orderBy: 'newest', itemLimit: 10 },
  { id: 5, title_km: 'សង្គម', title_en: 'Social', url: '/category/social', order: 5, visible: true, parentId: null, orderBy: 'newest', itemLimit: 10 },
  { id: 6, title_km: 'បាល់ទាត់', title_en: 'Football', url: '/category/sports/football', order: 1, visible: true, parentId: 2, orderBy: 'newest', itemLimit: 10 },
];

const defaultAdsSettings = {
  enabled: true,
  adsenseCode: '',
  banners: [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000',
      targetUrl: 'https://google.com',
      placement: 'sidebar',
    }
  ]
};

const defaultSiteSettings = {
  seoTitleKh: 'ANR NEWS - ព័ត៌មានជាតិ និងអន្តរជាតិ',
  seoTitleEn: 'ANR NEWS - National & International News',
  metaDescKh: 'អានព័ត៌មានថ្មីៗបំផុតពីប្រទេសកម្ពុជា និងទូទាំងសកលលោក។',
  metaDescEn: 'Read the latest news updates from Cambodia and around the world.',
  metaKeywords: 'news, cambodia, anr news, phnom penh, news website',
  favicon: 'https://cdn-icons-png.flaticon.com/512/21/21601.png',
  domain: 'localhost:3000',
  analyticsCode: 'G-XXXXXXXXXX'
};

export const SettingsProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('anr_news_menus');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.some(item => item.title_en === 'Football' && item.parentId === 2)) {
          parsed.push({ id: 6, title_km: 'បាល់ទាត់', title_en: 'Football', url: '/category/sports/football', order: 1, visible: true, parentId: 2, orderBy: 'newest', itemLimit: 10 });
        }
        return parsed.map((item) => ({
          ...item,
          visible: item.visible !== undefined ? item.visible : true,
          parentId: item.parentId !== undefined ? item.parentId : null,
          orderBy: item.orderBy || 'newest',
          itemLimit: item.itemLimit || 10
        }));
      } catch (e) {
        // Fallback to default
      }
    }
    return defaultMenuItems;
  });

  const [adsSettings, setAdsSettings] = useState(() => {
    const saved = localStorage.getItem('anr_news_ads');
    return saved ? JSON.parse(saved) : defaultAdsSettings;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('anr_news_site');
    return saved ? JSON.parse(saved) : defaultSiteSettings;
  });

  useEffect(() => {
    localStorage.setItem('anr_news_menus', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('anr_news_ads', JSON.stringify(adsSettings));
  }, [adsSettings]);

  useEffect(() => {
    localStorage.setItem('anr_news_site', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const updateAdsSettings = (newSettings) => {
    setAdsSettings(newSettings);
  };

  const addMenuItem = (item) => {
    const itemWithDefaults = {
      parentId: null,
      visible: true,
      orderBy: 'newest',
      itemLimit: 10,
      ...item,
      id: Date.now()
    };
    setMenuItems((prev) => [...prev, itemWithDefaults].sort((a, b) => a.order - b.order));
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)).sort((a, b) => a.order - b.order)
    );
  };

  const reorderMenuItems = (newOrderedList) => {
    setMenuItems(newOrderedList.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const updateSiteSettings = (newSettings) => {
    setSiteSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        menuItems,
        adsSettings,
        siteSettings,
        updateAdsSettings,
        addMenuItem,
        deleteMenuItem,
        updateMenuItem,
        reorderMenuItems,
        updateSiteSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
