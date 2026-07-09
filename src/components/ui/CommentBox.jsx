import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatDate';

const CommentBox = ({ articleId }) => {
  const { language, t } = useLanguage();
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load comments from localStorage on mount/article change
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${articleId}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        setComments([]);
      }
    } else {
      setComments([]);
    }
    setErrorMsg('');
  }, [articleId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      setErrorMsg(t('requiredNameComment'));
      return;
    }

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${articleId}`, JSON.stringify(updatedComments));

    // Clear input fields
    setName('');
    setCommentText('');
    setErrorMsg('');
  };

  const getInitials = (userName) => {
    if (!userName) return '?';
    return userName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="mt-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300">
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-8 border-l-4 border-blue-600 dark:border-blue-500 pl-3">
        {t('commentsTitle').replace('{count}', language === 'en' ? comments.length : comments.length.toLocaleString('km-KH'))}
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 text-sm rounded">
            {errorMsg}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              {t('yourName')}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterName')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
              {t('yourComment')}
            </label>
            <textarea 
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('writeComment')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
          >
            {t('submitComment')}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-slate-400 py-6 text-sm italic">
            {t('noComments')}
          </p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="flex items-start space-x-4 pb-6 border-b border-gray-100 dark:border-slate-800 last:border-0 last:pb-0"
            >
              {/* Initials Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-inner">
                {getInitials(comment.name)}
              </div>

              {/* Text Area */}
              <div className="flex-grow min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <h4 className="font-bold text-gray-900 dark:text-slate-200 text-sm truncate">
                    {comment.name}
                  </h4>
                  <span className="text-xs text-gray-400 dark:text-slate-500 ml-2 whitespace-nowrap">
                    {formatDate(comment.createdAt, language)}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CommentBox;
