import React from 'react';

export const SkeletonPulse = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-800 rounded ${className}`} />
  );
};

export const SkeletonNewsCard = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Image Skeleton */}
      <div className="animate-pulse bg-gray-200 dark:bg-slate-800 aspect-[16/9] w-full" />
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-5 w-5/6 rounded" />
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-5 w-2/3 rounded" />
        </div>
        
        {/* Description */}
        <div className="space-y-2 flex-grow mt-2">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-3 w-full rounded" />
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-3 w-full rounded" />
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-3 w-4/5 rounded" />
        </div>
        
        {/* Meta Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800/80 mt-4">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-3 w-1/4 rounded" />
          <div className="animate-pulse bg-gray-200 dark:bg-slate-850 h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonArticleDetail = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-10 px-4">
      {/* Breadcrumbs */}
      <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-1/3 rounded" />
      
      {/* Category Pill & Title */}
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-6 w-20 rounded-full" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-10 w-full rounded" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-10 w-3/4 rounded" />
      </div>
      
      {/* Meta */}
      <div className="flex space-x-6 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-28 rounded" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-24 rounded" />
      </div>
      
      {/* Image */}
      <div className="animate-pulse bg-gray-200 dark:bg-slate-800 aspect-[16/9] w-full rounded-2xl" />
      
      {/* Prose */}
      <div className="space-y-4 pt-4">
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-full rounded" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-full rounded" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-5/6 rounded" />
        <div className="animate-pulse bg-gray-200 dark:bg-slate-800 h-4 w-4/5 rounded" />
      </div>
    </div>
  );
};
