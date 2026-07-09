import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { isLoggedIn, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('requiredNameComment')); // Reusing required error, or we can use inline
      return;
    }

    const success = login(username.trim(), password);
    if (success) {
      navigate('/admin');
    } else {
      setError(t('loginError') || 'Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-lg transition-colors duration-300">
          
          <div className="text-center mb-8">
            <span className="text-3xl font-extrabold text-blue-600 tracking-tight">ANR</span>
            <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight ml-1">NEWS</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mt-4">
              {t('signInTitle') || 'Admin Dashboard Login'}
            </h2>
            <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">
              Default: admin / admin123
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-755 dark:text-red-400 p-3 text-sm rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                {t('username') || 'Username'}
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                {t('password') || 'Password'}
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
            >
              {t('loginBtn') || 'Log In'}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
