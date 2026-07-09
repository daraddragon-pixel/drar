import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/formatDate';
import { translateKmToEn } from '../utils/translateText';

const categoryOptions = [
  { value: 'កីឡា', labelKey: 'sports' },
  { value: 'បច្ចេកវិទ្យា', labelKey: 'tech' },
  { value: 'សេដ្ឋកិច្ច', labelKey: 'economy' },
  { value: 'សង្គម', labelKey: 'social' },
];

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useAuth();
  const { articles, addArticle, deleteArticle } = useNews();
  const { language, t } = useLanguage();
  const { 
    menuItems, addMenuItem, deleteMenuItem, updateMenuItem, reorderMenuItems,
    adsSettings, updateAdsSettings,
    siteSettings, updateSiteSettings
  } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'create' | 'manage' | 'ads' | 'menus' | 'settings'

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // General Notification States
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Post Form States
  const [category, setCategory] = useState('កីឡា');
  const [image, setImage] = useState('');
  const [titleKh, setTitleKh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descKh, setDescKh] = useState('');
  const [descEn, setDescEn] = useState('');
  const [contentKh, setContentKh] = useState('');
  const [contentEn, setContentEn] = useState('');

  // Image Upload Local State
  const [isUploading, setIsUploading] = useState(false);

  // Auto-translate states for Post
  const [isAutoTranslate, setIsAutoTranslate] = useState(true);
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);

  // Search state for manage posts
  const [searchQuery, setSearchQuery] = useState('');

  // --- Ads Form States ---
  const [adsEnabled, setAdsEnabled] = useState(adsSettings.enabled);
  const [adsenseCode, setAdsenseCode] = useState(adsSettings.adsenseCode);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerTargetUrl, setBannerTargetUrl] = useState('');
  const [bannerPlacement, setBannerPlacement] = useState('sidebar');

  // --- Menu Form States ---
  const [editingMenuItemId, setEditingMenuItemId] = useState(null);
  const [menuTitleKhInput, setMenuTitleKhInput] = useState('');
  const [menuTitleEnInput, setMenuTitleEnInput] = useState('');
  const [menuUrlInput, setMenuUrlInput] = useState('/');
  const [menuOrderInput, setMenuOrderInput] = useState(1);
  
  // Smart menu additions
  const [menuLinkType, setMenuLinkType] = useState('category'); // 'category' | 'custom'
  const [menuSelectedCategory, setMenuSelectedCategory] = useState('កីឡា');
  const [showMenuAdvanced, setShowMenuAdvanced] = useState(false);
  const [menuOrderBy, setMenuOrderBy] = useState('newest');
  const [menuItemLimit, setMenuItemLimit] = useState(10);
  const [menuParentId, setMenuParentId] = useState('');
  const [menuVisible, setMenuVisible] = useState(true);

  // HTML5 Drag and Drop index tracker
  const [draggedIdx, setDraggedIdx] = useState(null);

  // --- Site Config Form States ---
  const [siteTitleKh, setSiteTitleKh] = useState(siteSettings.seoTitleKh);
  const [siteTitleEn, setSiteTitleEn] = useState(siteSettings.seoTitleEn);
  const [siteMetaDescKh, setSiteMetaDescKh] = useState(siteSettings.metaDescKh);
  const [siteMetaDescEn, setSiteMetaDescEn] = useState(siteSettings.metaDescEn);
  const [siteMetaKeywords, setSiteMetaKeywords] = useState(siteSettings.metaKeywords);
  const [siteFavicon, setSiteFavicon] = useState(siteSettings.favicon);
  const [siteDomain, setSiteDomain] = useState(siteSettings.domain);
  const [siteAnalytics, setSiteAnalytics] = useState(siteSettings.analyticsCode);

  // Synchronize state when settings contexts load
  useEffect(() => {
    setAdsEnabled(adsSettings.enabled);
    setAdsenseCode(adsSettings.adsenseCode);
  }, [adsSettings]);

  useEffect(() => {
    setSiteTitleKh(siteSettings.seoTitleKh);
    setSiteTitleEn(siteSettings.seoTitleEn);
    setSiteMetaDescKh(siteSettings.metaDescKh);
    setSiteMetaDescEn(siteSettings.metaDescEn);
    setSiteMetaKeywords(siteSettings.metaKeywords);
    setSiteFavicon(siteSettings.favicon);
    setSiteDomain(siteSettings.domain);
    setSiteAnalytics(siteSettings.analyticsCode);
  }, [siteSettings]);

  // Analytics calculations
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, art) => sum + art.views, 0);
  
  // Find popular category
  const categoryViews = {};
  articles.forEach(art => {
    categoryViews[art.category] = (categoryViews[art.category] || 0) + art.views;
  });
  let popularCategory = '';
  let maxViews = -1;
  Object.keys(categoryViews).forEach(cat => {
    if (categoryViews[cat] > maxViews) {
      maxViews = categoryViews[cat];
      popularCategory = cat;
    }
  });

  const getCategoryTranslation = (rawCat) => {
    if (rawCat === 'កីឡា') return t('sports');
    if (rawCat === 'បច្ចេកវិទ្យា') return t('tech');
    if (rawCat === 'សេដ្ឋកិច្ច') return t('economy');
    if (rawCat === 'សង្គម') return t('social');
    return rawCat;
  };

  const getSlug = (cat) => {
    if (cat === 'កីឡា') return 'sports';
    if (cat === 'បច្ចេកវិទ្យា') return 'tech';
    if (cat === 'សេដ្ឋកិច្ច') return 'economy';
    if (cat === 'សង្គម') return 'social';
    return 'sports';
  };

  // Canvas Image Compression & Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Limit width to 800px to keep base64 storage footprints small
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress JPEG to 70% quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImage(compressedBase64);
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Blur automatic translation triggers
  const handleTitleBlur = async () => {
    if (isAutoTranslate && titleKh.trim() && !titleEn.trim()) {
      setIsTranslatingTitle(true);
      const translated = await translateKmToEn(titleKh);
      if (translated) setTitleEn(translated);
      setIsTranslatingTitle(false);
    }
  };

  const handleDescBlur = async () => {
    if (isAutoTranslate && descKh.trim() && !descEn.trim()) {
      setIsTranslatingDesc(true);
      const translated = await translateKmToEn(descKh);
      if (translated) setDescEn(translated);
      setIsTranslatingDesc(false);
    }
  };

  const handleContentBlur = async () => {
    if (isAutoTranslate && contentKh.trim() && !contentEn.trim()) {
      setIsTranslatingContent(true);
      const translated = await translateKmToEn(contentKh);
      if (translated) setContentEn(translated);
      setIsTranslatingContent(false);
    }
  };

  const forceTranslate = async (field) => {
    if (field === 'title' && titleKh.trim()) {
      setIsTranslatingTitle(true);
      const translated = await translateKmToEn(titleKh);
      if (translated) setTitleEn(translated);
      setIsTranslatingTitle(false);
    } else if (field === 'desc' && descKh.trim()) {
      setIsTranslatingDesc(true);
      const translated = await translateKmToEn(descKh);
      if (translated) setDescEn(translated);
      setIsTranslatingDesc(false);
    } else if (field === 'content' && contentKh.trim()) {
      setIsTranslatingContent(true);
      const translated = await translateKmToEn(contentKh);
      if (translated) setContentEn(translated);
      setIsTranslatingContent(false);
    }
  };

  // Add new post
  const handlePublish = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (
      !titleKh.trim() || 
      !titleEn.trim() || 
      !descKh.trim() || 
      !descEn.trim() || 
      !contentKh.trim() || 
      !contentEn.trim()
    ) {
      setErrorMsg(t('requiredNameComment') || 'Please fill in all required fields!');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000';
    const finalImage = image.trim() || defaultImg;

    const newArticle = {
      id: Date.now(),
      title: titleKh.trim(),
      title_en: titleEn.trim(),
      description: descKh.trim(),
      description_en: descEn.trim(),
      content: contentKh.trim(),
      content_en: contentEn.trim(),
      image: finalImage,
      category,
      category_en: category === 'កីឡា' ? 'Sports' : category === 'បច្ចេកវិទ្យា' ? 'Technology' : category === 'សេដ្ឋកិច្ច' ? 'Economy' : 'Social',
      views: 0,
      createdAt: new Date().toISOString()
    };

    addArticle(newArticle);
    
    // Reset Form
    setTitleKh('');
    setTitleEn('');
    setDescKh('');
    setDescEn('');
    setContentKh('');
    setContentEn('');
    setImage('');
    setSuccessMsg(t('publishSuccess') || 'Article published successfully!');
    
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('overview');
    }, 2000);
  };

  const autofillSample = () => {
    setTitleKh('គម្រោងសាងសង់ពហុកីឡដ្ឋានខ្នាតយក្សថ្មីសម្រាប់អភិវឌ្ឍវិស័យកីឡា');
    setTitleEn('New Giant Stadium Construction Project to Develop Sports Sector');
    setDescKh('គម្រោងវិនិយោគតម្លៃរាប់លានដុល្លារ ក្នុងការសាងសង់កន្លែងហ្វឹកហាត់ទំនើបថ្មី សម្រាប់អភិវឌ្ឍន៍សមត្ថភាពកីឡាករខ្មែរ។');
    setDescEn('Multi-million dollar investment project to build new modern training facilities to develop Cambodian athletes capacity.');
    setContentKh('គម្រោងនេះនឹងចាប់ផ្តើមការសាងសង់នៅចុងឆ្នាំនេះ ដែលមានទីតាំងស្ថិតនៅក្នុងជាយរាជធានីភ្នំពេញ។ គម្រោងនេះរួមបញ្ចូលទាំងអាងហែលទឹកខ្នាតអន្តរជាតិ តារាងបាល់ទាត់ ទីលានរត់ប្រណាំង និងកន្លែងហាត់ប្រាណបច្ចេកវិទ្យាខ្ពស់។ គោលបំណងចម្បងគឺដើម្បីរៀបចំការប្រកួតកម្រិតពិភពលោក និងលើកកម្ពស់គុណភាពកីឡាករកម្ពុជា។');
    setContentEn('The project construction will begin late this year located on the outskirts of Phnom Penh. The facilities include international-size swimming pools, football fields, athletics tracks, and high-tech fitness centers. The main objective is to host world-class matches and improve Cambodian athletes standards.');
    setImage('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop');
    setCategory('កីឡា');
  };

  const handleDelete = (id) => {
    if (window.confirm(t('deleteConfirm') || 'Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  // --- Ads Methods ---
  const handleSaveAds = (e) => {
    e.preventDefault();
    updateAdsSettings({
      ...adsSettings,
      enabled: adsEnabled,
      adsenseCode: adsenseCode
    });
    setSuccessMsg(t('settingsSaved') || 'Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!bannerImageUrl.trim() || !bannerTargetUrl.trim()) {
      setErrorMsg(t('requiredNameComment') || 'Fill all required banner fields!');
      return;
    }
    
    const bannerData = {
      imageUrl: bannerImageUrl.trim(),
      targetUrl: bannerTargetUrl.trim(),
      placement: bannerPlacement
    };

    if (editingBannerId) {
      updateAdsSettings({
        ...adsSettings,
        banners: adsSettings.banners.map(b => b.id === editingBannerId ? { ...b, ...bannerData } : b)
      });
      setEditingBannerId(null);
      setSuccessMsg(t('settingsSaved') || 'Banner ad updated successfully!');
    } else {
      const newBanner = {
        id: Date.now(),
        ...bannerData
      };
      updateAdsSettings({
        ...adsSettings,
        banners: [...adsSettings.banners, newBanner]
      });
      setSuccessMsg(t('publishSuccess') || 'Banner ad added successfully!');
    }

    setBannerImageUrl('');
    setBannerTargetUrl('');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleEditBannerClick = (banner) => {
    setEditingBannerId(banner.id);
    setBannerImageUrl(banner.imageUrl);
    setBannerTargetUrl(banner.targetUrl);
    setBannerPlacement(banner.placement);
  };

  const handleCancelBannerEdit = () => {
    setEditingBannerId(null);
    setBannerImageUrl('');
    setBannerTargetUrl('');
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm(t('deleteConfirm') || 'Delete this banner ad?')) {
      updateAdsSettings({
        ...adsSettings,
        banners: adsSettings.banners.filter(b => b.id !== id)
      });
    }
  };

  // --- Menu Methods ---
  const handleSaveMenu = (e) => {
    e.preventDefault();
    if (!menuTitleKhInput.trim() || !menuTitleEnInput.trim()) {
      setErrorMsg(t('requiredNameComment') || 'Please fill in all menu fields!');
      return;
    }

    const itemData = {
      title_km: menuTitleKhInput.trim(),
      title_en: menuTitleEnInput.trim(),
      url: menuLinkType === 'category' ? `/category/${getSlug(menuSelectedCategory)}` : menuUrlInput.trim(),
      order: parseInt(menuOrderInput) || menuItems.length + 1,
      parentId: menuParentId ? parseInt(menuParentId) : null,
      visible: menuVisible,
      orderBy: menuOrderBy,
      itemLimit: parseInt(menuItemLimit) || 10
    };

    if (editingMenuItemId) {
      updateMenuItem({
        id: editingMenuItemId,
        ...itemData
      });
      setEditingMenuItemId(null);
      setSuccessMsg(t('settingsSaved') || 'Menu updated successfully!');
    } else {
      addMenuItem(itemData);
      setSuccessMsg(t('publishSuccess') || 'Menu added successfully!');
    }

    // Reset inputs
    setMenuTitleKhInput('');
    setMenuTitleEnInput('');
    setMenuUrlInput('/');
    setMenuParentId('');
    setMenuVisible(true);
    setMenuOrderBy('newest');
    setMenuItemLimit(10);
    setMenuOrderInput(menuItems.length + 2);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleEditMenuClick = (item) => {
    setEditingMenuItemId(item.id);
    setMenuTitleKhInput(item.title_km);
    setMenuTitleEnInput(item.title_en);
    setMenuUrlInput(item.url);
    setMenuOrderInput(item.order);

    setMenuParentId(item.parentId ? String(item.parentId) : '');
    setMenuVisible(item.visible !== undefined ? item.visible : true);
    setMenuOrderBy(item.orderBy || 'newest');
    setMenuItemLimit(item.itemLimit || 10);

    // Auto detect link mapping type
    if (item.url.startsWith('/category/')) {
      setMenuLinkType('category');
      const slug = item.url.replace('/category/', '');
      if (slug === 'sports') setMenuSelectedCategory('កីឡា');
      else if (slug === 'tech') setMenuSelectedCategory('បច្ចេកវិទ្យា');
      else if (slug === 'economy') setMenuSelectedCategory('សេដ្ឋកិច្ច');
      else if (slug === 'social') setMenuSelectedCategory('សង្គម');
    } else {
      setMenuLinkType('custom');
    }
  };

  const handleCancelMenuEdit = () => {
    setEditingMenuItemId(null);
    setMenuTitleKhInput('');
    setMenuTitleEnInput('');
    setMenuUrlInput('/');
    setMenuParentId('');
    setMenuVisible(true);
    setMenuOrderBy('newest');
    setMenuItemLimit(10);
    setMenuOrderInput(menuItems.length + 1);
  };

  const handleToggleMenuVisibility = (item) => {
    updateMenuItem({
      ...item,
      visible: !item.visible
    });
  };

  // Drag and Drop Sort Helpers
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;

    const list = [...menuItems];
    const draggedItem = list[draggedIdx];
    list.splice(draggedIdx, 1);
    list.splice(targetIndex, 0, draggedItem);

    reorderMenuItems(list);
    setDraggedIdx(null);
  };

  // --- Site Config Settings Method ---
  const handleSaveSiteConfig = (e) => {
    e.preventDefault();
    updateSiteSettings({
      seoTitleKh: siteTitleKh.trim(),
      seoTitleEn: siteTitleEn.trim(),
      metaDescKh: siteMetaDescKh.trim(),
      metaDescEn: siteMetaDescEn.trim(),
      metaKeywords: siteMetaKeywords.trim(),
      favicon: siteFavicon.trim(),
      domain: siteDomain.trim(),
      analyticsCode: siteAnalytics.trim()
    });
    setSuccessMsg(t('settingsSaved') || 'Site settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const filteredArticles = articles.filter(art => {
    const title = language === 'en' && art.title_en ? art.title_en : art.title;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Tabs Controls */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm transition-colors">
              <div className="pb-4 mb-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-slate-100">{t('dashboard')}</span>
                <button 
                  onClick={logout}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold uppercase flex items-center space-x-1 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  <span>{t('signOut')}</span>
                </button>
              </div>
              
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <span>{t('overview')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('create')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                <span>{t('createPost')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('manage')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'manage' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                <span>{t('managePosts')}</span>
              </button>

              <div className="border-t border-gray-100 dark:border-slate-800 my-2 pt-2"></div>

              {/* Extended Sidebar Options */}
              <button 
                onClick={() => setActiveTab('ads')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'ads' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-55 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                <span>{t('manageAds')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('menus')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'menus' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-55 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>{t('manageMenus')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 cursor-pointer ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-slate-355 hover:bg-gray-55 dark:hover:bg-slate-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{t('siteSettings')}</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300">
              
              {/* Universal Message Prompts */}
              {successMsg && (
                <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 rounded-xl text-sm font-semibold mb-6">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm font-semibold mb-6">
                  {errorMsg}
                </div>
              )}

              {/* Tab 1: OVERVIEW METRICS */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                    {t('overview')}
                  </h2>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        {t('totalArticles')}
                      </span>
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mt-2 block">
                        {language === 'en' ? totalArticles : totalArticles.toLocaleString('km-KH')}
                      </span>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider block">
                        {t('totalViews')}
                      </span>
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mt-2 block">
                        {language === 'en' ? totalViews.toLocaleString('en-US') : totalViews.toLocaleString('km-KH')}
                      </span>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                        {t('popularCategory')}
                      </span>
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-2 block truncate">
                        {getCategoryTranslation(popularCategory) || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Category List Stats */}
                  <div className="mt-8">
                    <h3 className="text-base font-bold text-gray-800 dark:text-slate-205 mb-4">
                      {t('categories') || 'Category Breakdown'}
                    </h3>
                    <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold border-b border-gray-100 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-4">{t('postCategory')}</th>
                            <th className="px-6 py-4 text-center">{t('totalArticles')}</th>
                            <th className="px-6 py-4 text-right">{t('totalViews')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-305">
                          {categoryOptions.map((opt) => {
                            const count = articles.filter(a => a.category === opt.value).length;
                            const views = articles.filter(a => a.category === opt.value).reduce((s, a) => s + a.views, 0);

                            return (
                              <tr key={opt.value} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-semibold">{t(opt.labelKey)}</td>
                                <td className="px-6 py-4 text-center">{language === 'en' ? count : count.toLocaleString('km-KH')}</td>
                                <td className="px-6 py-4 text-right font-medium">{language === 'en' ? views.toLocaleString('en-US') : views.toLocaleString('km-KH')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: CREATE POST FORM */}
              {activeTab === 'create' && (
                <form onSubmit={handlePublish} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 dark:border-slate-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                      {t('createPost')}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Auto translate toggle */}
                      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                        <input 
                          type="checkbox" 
                          id="autoTranslateToggle"
                          checked={isAutoTranslate}
                          onChange={(e) => setIsAutoTranslate(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="autoTranslateToggle" className="text-xs font-bold text-gray-700 dark:text-slate-350 cursor-pointer select-none">
                          {t('autoTranslate')}
                        </label>
                      </div>

                      <button 
                        type="button"
                        onClick={autofillSample}
                        className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-355 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {t('autofill') || 'Autofill Sample'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                        {t('postCategory')}
                      </label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm font-semibold cursor-pointer"
                      >
                        {categoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Image URL input + File Upload option */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                        {t('postImage') || 'Feature Image'}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="text" 
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-grow px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
                        />
                        <div className="relative flex-shrink-0">
                          <input 
                            type="file" 
                            accept="image/*"
                            id="fileUploadInput"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="fileUploadInput"
                            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3.5 rounded-xl cursor-pointer text-center select-none shadow-sm hover:shadow transition-all whitespace-nowrap"
                          >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-slate-800 pt-6">
                    {/* Khmer Fields */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-700 dark:text-slate-355 text-sm">ភាសាខ្មែរ (Khmer)</h3>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postTitleKh') || 'Title (Khmer)'} *
                        </label>
                        <input 
                          type="text" 
                          value={titleKh}
                          onChange={(e) => setTitleKh(e.target.value)}
                          onBlur={handleTitleBlur}
                          placeholder="ចំណងជើង..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postDescKh') || 'Description (Khmer)'} *
                        </label>
                        <textarea 
                          rows="3"
                          value={descKh}
                          onChange={(e) => setDescKh(e.target.value)}
                          onBlur={handleDescBlur}
                          placeholder="សេចក្តីសង្ខេប..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postContentKh') || 'Content (Khmer)'} *
                        </label>
                        <textarea 
                          rows="8"
                          value={contentKh}
                          onChange={(e) => setContentKh(e.target.value)}
                          onBlur={handleContentBlur}
                          placeholder="ខ្លឹមសារពេញ..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* English Fields */}
                    <div className="space-y-4 border-l-0 md:border-l border-gray-100 dark:border-slate-800 md:pl-6">
                      <h3 className="font-bold text-gray-700 dark:text-slate-355 text-sm">ភាសាអង់គ្លេស (English)</h3>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postTitleEn') || 'Title (English)'} *
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={titleEn}
                            onChange={(e) => setTitleEn(e.target.value)}
                            placeholder="Title..."
                            className="w-full px-4 pr-24 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => forceTranslate('title')}
                            disabled={isTranslatingTitle || !titleKh.trim()}
                            className="absolute right-3 top-2.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold disabled:text-gray-400 disabled:dark:text-slate-600 transition-colors cursor-pointer"
                          >
                            {isTranslatingTitle ? t('translating') : t('translateNow')}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postDescEn') || 'Description (English)'} *
                        </label>
                        <div className="relative">
                          <textarea 
                            rows="3"
                            value={descEn}
                            onChange={(e) => setDescEn(e.target.value)}
                            placeholder="Short description..."
                            className="w-full px-4 pr-24 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => forceTranslate('desc')}
                            disabled={isTranslatingDesc || !descKh.trim()}
                            className="absolute right-3 bottom-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold disabled:text-gray-400 disabled:dark:text-slate-600 transition-colors cursor-pointer"
                          >
                            {isTranslatingDesc ? t('translating') : t('translateNow')}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          {t('postContentEn') || 'Content (English)'} *
                        </label>
                        <div className="relative">
                          <textarea 
                            rows="8"
                            value={contentEn}
                            onChange={(e) => setContentEn(e.target.value)}
                            placeholder="Full article content..."
                            className="w-full px-4 pr-24 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => forceTranslate('content')}
                            disabled={isTranslatingContent || !contentKh.trim()}
                            className="absolute right-3 bottom-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold disabled:text-gray-400 disabled:dark:text-slate-600 transition-colors cursor-pointer"
                          >
                            {isTranslatingContent ? t('translating') : t('translateNow')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
                    >
                      {t('publish') || 'Publish Article'}
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 3: MANAGE POSTS LIST */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 dark:border-slate-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                      {t('managePosts')}
                    </h2>
                    
                    {/* Search Field */}
                    <div className="relative w-full sm:w-64">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPost') || 'Search posts...'}
                        className="bg-gray-55 dark:bg-slate-800 text-gray-850 dark:text-slate-200 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-xs border border-transparent"
                      />
                      <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Posts Table */}
                  <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold border-b border-gray-100 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-4">{t('postTitleKh') || 'Title'}</th>
                          <th className="px-6 py-4">{t('postCategory')}</th>
                          <th className="px-6 py-4 text-center">Views</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-350">
                        {filteredArticles.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-400 dark:text-slate-555 italic">
                              {t('categoryEmpty')}
                            </td>
                          </tr>
                        ) : (
                          filteredArticles.map((article) => {
                            const title = language === 'en' && article.title_en ? article.title_en : article.title;
                            const formattedViews = article.views.toLocaleString(language === 'en' ? 'en-US' : 'km-KH');

                            return (
                              <tr key={article.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-semibold max-w-[200px] md:max-w-xs truncate">
                                  <Link to={`/article/${article.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                    {title}
                                  </Link>
                                </td>
                                <td className="px-6 py-4">{getCategoryTranslation(article.category)}</td>
                                <td className="px-6 py-4 text-center font-semibold">{formattedViews}</td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap">{formatDate(article.createdAt, language)}</td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => handleDelete(article.id)}
                                    className="text-red-500 hover:text-red-700 bg-red-55/40 dark:bg-red-955/20 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Article"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: ADS MANAGEMENT */}
              {activeTab === 'ads' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                    {t('manageAds')}
                  </h2>

                  <form onSubmit={handleSaveAds} className="space-y-6">
                    <div className="flex items-center space-x-3 bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700">
                      <input 
                        type="checkbox" 
                        id="adsEnabledToggle"
                        checked={adsEnabled}
                        onChange={(e) => setAdsEnabled(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="adsEnabledToggle" className="text-sm font-bold text-gray-800 dark:text-slate-200 cursor-pointer select-none">
                        {t('adsEnabledLabel')}
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                        {t('adsenseCodeLabel')}
                      </label>
                      <textarea 
                        rows="4"
                        value={adsenseCode}
                        onChange={(e) => setAdsenseCode(e.target.value)}
                        placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"...'
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm font-mono"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md text-sm cursor-pointer"
                    >
                      {t('saveSettings')}
                    </button>
                  </form>

                  {/* Add/Edit Custom Banner Ads form */}
                  <div className="border-t border-gray-150 dark:border-slate-800 pt-8 space-y-6">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                      {editingBannerId ? 'កែប្រែបដាពាណិជ្ជកម្ម (Edit Banner)' : t('customBanners')}
                    </h3>
                    
                    <form onSubmit={handleAddBanner} className="bg-gray-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-150 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                          {t('bannerImage')}
                        </label>
                        <input 
                          type="text" 
                          value={bannerImageUrl}
                          onChange={(e) => setBannerImageUrl(e.target.value)}
                          placeholder="https://example.com/banner.png"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                          {t('destinationUrl')}
                        </label>
                        <input 
                          type="text" 
                          value={bannerTargetUrl}
                          onChange={(e) => setBannerTargetUrl(e.target.value)}
                          placeholder="https://sponsor.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                            {t('placement')}
                          </label>
                          <select 
                            value={bannerPlacement}
                            onChange={(e) => setBannerPlacement(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="header">Header</option>
                            <option value="sidebar">Sidebar</option>
                            <option value="inside_post">Inside Article (បន្ទាត់អត្ថបទ)</option>
                            <option value="post_end">End of Post</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer h-[42px]"
                          >
                            {editingBannerId ? 'Update' : t('addBanner')}
                          </button>
                          {editingBannerId && (
                            <button 
                              type="button"
                              onClick={handleCancelBannerEdit}
                              className="bg-gray-250 hover:bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold px-2 py-2.5 rounded-xl text-xs cursor-pointer h-[42px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </form>

                    {/* Banner list table */}
                    <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden mt-4 bg-white dark:bg-slate-900">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold border-b border-gray-100 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-3">Preview</th>
                            <th className="px-6 py-3">Placement</th>
                            <th className="px-6 py-3">URL</th>
                            <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-355">
                          {adsSettings.banners.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="px-6 py-6 text-center text-gray-400 italic">
                                No custom banners created yet.
                              </td>
                            </tr>
                          ) : (
                            adsSettings.banners.map((b) => (
                              <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-3">
                                  <img src={b.imageUrl} alt="preview" className="h-10 w-24 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-slate-700" />
                                </td>
                                <td className="px-6 py-3 uppercase text-xs font-bold text-gray-605 dark:text-slate-400">{b.placement.replace('_', ' ')}</td>
                                <td className="px-6 py-3 max-w-[200px] truncate text-xs font-mono">{b.targetUrl}</td>
                                <td className="px-6 py-3 text-right flex justify-end space-x-2">
                                  <button 
                                    onClick={() => handleEditBannerClick(b)}
                                    className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 dark:bg-blue-955/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg cursor-pointer"
                                    title="Edit Banner"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteBanner(b.id)}
                                    className="text-red-500 hover:text-red-700 p-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg cursor-pointer"
                                    title="Delete Banner"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: SMART MENU BUILDER */}
              {activeTab === 'menus' && (
                <div className="space-y-8">
                  <div className="border-b border-gray-150 dark:border-slate-800 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                      {editingMenuItemId ? 'កែប្រែមុខសញ្ញាមីនុយ (Edit Menu Item)' : 'Smart Menu Builder'}
                    </h2>
                    <p className="text-xs text-gray-450 dark:text-slate-500 mt-2 font-medium">
                      Configure dynamic link mappings, sort hierarchies visually via drag-and-drop, and tweak query options.
                    </p>
                  </div>

                  {/* Dynamic Add/Edit Menu Form */}
                  <form onSubmit={handleSaveMenu} className="bg-gray-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-150 dark:border-slate-800/60 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                          {t('menuTitleKh')} *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={menuTitleKhInput}
                          onChange={(e) => setMenuTitleKhInput(e.target.value)}
                          placeholder="កីឡា"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                          {t('menuTitleEn')} *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={menuTitleEnInput}
                          onChange={(e) => setMenuTitleEnInput(e.target.value)}
                          placeholder="Sports"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                          Link Mapping Mode
                        </label>
                        <select 
                          value={menuLinkType}
                          onChange={(e) => setMenuLinkType(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="category">Category Mapping (SQL-Ready)</option>
                          <option value="custom">Custom URL Link</option>
                        </select>
                      </div>

                      {menuLinkType === 'category' ? (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            Select Category
                          </label>
                          <select 
                            value={menuSelectedCategory}
                            onChange={(e) => setMenuSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            {categoryOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            Custom URL URL
                          </label>
                          <input 
                            type="text"
                            value={menuUrlInput}
                            onChange={(e) => setMenuUrlInput(e.target.value)}
                            placeholder="/"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Advanced Parameters Options Toggle */}
                    <div className="border-t border-gray-150 dark:border-slate-800/80 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowMenuAdvanced(!showMenuAdvanced)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1.5 focus:outline-none"
                      >
                        <span>{showMenuAdvanced ? 'Hide Advanced Options ▴' : 'Show Advanced Options & Query Logic ▾'}</span>
                      </button>

                      {showMenuAdvanced && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 animate-fadeIn">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                              Parent Menu (For Nesting)
                            </label>
                            <select 
                              value={menuParentId}
                              onChange={(e) => setMenuParentId(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="">None (Top Level)</option>
                              {menuItems.filter(m => !m.parentId && m.id !== editingMenuItemId).map(m => (
                                <option key={m.id} value={m.id}>{language === 'en' ? m.title_en : m.title_km}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                              Query Order By
                            </label>
                            <select 
                              value={menuOrderBy}
                              onChange={(e) => setMenuOrderBy(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="newest">Newest First (ចុះផ្សាយចុងក្រោយ)</option>
                              <option value="views">Most Viewed (ពេញនិយមបំផុត)</option>
                              <option value="alphabetical">Alphabetical (តាមអក្ខរក្រម)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-455 mb-2">
                              Query Item Limit
                            </label>
                            <input 
                              type="number" 
                              min="1"
                              max="100"
                              value={menuItemLimit}
                              onChange={(e) => setMenuItemLimit(e.target.value)}
                              className="w-full px-4 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-gray-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      {editingMenuItemId && (
                        <button 
                          type="button"
                          onClick={handleCancelMenuEdit}
                          className="bg-gray-150 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs cursor-pointer"
                      >
                        {editingMenuItemId ? 'Update Item' : 'Add Menu Item'}
                      </button>
                    </div>
                  </form>

                  {/* Menu structure visual preview */}
                  <div className="bg-gray-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-150 dark:border-slate-800/60 space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      <span>Menu Structure Preview</span>
                    </h3>
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 min-h-[80px] flex flex-wrap gap-4 items-center">
                      {menuItems.filter(m => m.visible !== false && !m.parentId).map(parent => {
                        const children = menuItems.filter(c => c.parentId === parent.id && c.visible !== false);
                        return (
                          <div key={parent.id} className="relative group">
                            <span className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 border border-gray-200 dark:border-slate-700 select-none">
                              <span>{language === 'en' ? parent.title_en : parent.title_km}</span>
                              {children.length > 0 && (
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              )}
                            </span>
                            {children.length > 0 && (
                              <div className="absolute top-full left-0 mt-1 w-40 bg-gray-50 dark:bg-slate-850 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-1.5 z-20 hidden group-hover:block">
                                {children.map(child => (
                                  <span key={child.id} className="block px-3 py-1 text-[11px] font-semibold text-gray-650 dark:text-slate-300">
                                    {language === 'en' ? child.title_en : child.title_km}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Menu List sortable table with HTML5 Drag & Drop */}
                  <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-bold border-b border-gray-100 dark:border-slate-800 select-none">
                        <tr>
                          <th className="px-6 py-4 w-12 text-center">Move</th>
                          <th className="px-6 py-4">Title (KM / EN)</th>
                          <th className="px-6 py-4">Mapped URL</th>
                          <th className="px-6 py-4">Parent Level</th>
                          <th className="px-6 py-4 text-center">Visibility</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-350">
                        {menuItems.map((item, index) => {
                          const isEditing = editingMenuItemId === item.id;
                          const parentName = item.parentId 
                            ? (menuItems.find(m => m.id === item.parentId) 
                              ? (language === 'en' ? menuItems.find(m => m.id === item.parentId).title_en : menuItems.find(m => m.id === item.parentId).title_km)
                              : 'None')
                            : 'Top Level';

                          return (
                            <tr 
                              key={item.id} 
                              draggable
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={(e) => handleDragOver(e, index)}
                              onDrop={(e) => handleDrop(e, index)}
                              className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-grab active:cursor-grabbing ${isEditing ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''}`}
                            >
                              {/* Grab Handle Move Icon */}
                              <td className="px-6 py-4 text-center select-none">
                                <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16"></path>
                                </svg>
                              </td>

                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900 dark:text-slate-100">{item.title_km}</div>
                                <div className="text-xs text-gray-450 dark:text-slate-500 font-medium">{item.title_en}</div>
                              </td>

                              <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                                {item.url}
                              </td>

                              <td className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-slate-400">
                                {parentName}
                              </td>

                              {/* Toggle visibility switch button */}
                              <td className="px-6 py-4 text-center">
                                <button 
                                  type="button"
                                  onClick={() => handleToggleMenuVisibility(item)}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.visible !== false ? 'bg-blue-600' : 'bg-gray-250 dark:bg-slate-700'}`}
                                >
                                  <span 
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${item.visible !== false ? 'translate-x-5' : 'translate-x-0'}`}
                                  />
                                </button>
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button 
                                    onClick={() => handleEditMenuClick(item)}
                                    className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 dark:bg-blue-955/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Item"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                  </button>
                                  <button 
                                    onClick={() => deleteMenuItem(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: SITE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-l-4 border-blue-600 pl-3">
                    {t('siteSettings')}
                  </h2>

                  <form onSubmit={handleSaveSiteConfig} className="space-y-6">
                    
                    {/* SEO Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                        {t('seoSettings') || 'SEO Settings'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('siteTitleKh')}
                          </label>
                          <input 
                            type="text" 
                            value={siteTitleKh}
                            onChange={(e) => setSiteTitleKh(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('siteTitleEn')}
                          </label>
                          <input 
                            type="text" 
                            value={siteTitleEn}
                            onChange={(e) => setSiteTitleEn(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            Meta Description (Khmer)
                          </label>
                          <textarea 
                            rows="2"
                            value={siteMetaDescKh}
                            onChange={(e) => setSiteMetaDescKh(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            Meta Description (English)
                          </label>
                          <textarea 
                            rows="2"
                            value={siteMetaDescEn}
                            onChange={(e) => setSiteMetaDescEn(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('metaKeywords')}
                          </label>
                          <input 
                            type="text" 
                            value={siteMetaKeywords}
                            onChange={(e) => setSiteMetaKeywords(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('faviconUrl')}
                          </label>
                          <input 
                            type="text" 
                            value={siteFavicon}
                            onChange={(e) => setSiteFavicon(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hosting & Analytics configurations */}
                    <div className="space-y-4 border-t border-gray-150 dark:border-slate-800 pt-6">
                      <h3 className="font-bold text-gray-800 dark:text-slate-205 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                        {t('domainName') || 'Deployment Setup'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('domainName')}
                          </label>
                          <input 
                            type="text" 
                            value={siteDomain}
                            onChange={(e) => setSiteDomain(e.target.value)}
                            placeholder="anrnews.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                            {t('analyticsCode')}
                          </label>
                          <input 
                            type="text" 
                            value={siteAnalytics}
                            onChange={(e) => setSiteAnalytics(e.target.value)}
                            placeholder="G-XXXXXX"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
                      >
                        {t('saveSettings')}
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
