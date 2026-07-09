import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex text-gray-500 dark:text-slate-400 text-sm mb-6 overflow-hidden">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.path && !isLast ? (
              <Link 
                to={item.path} 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ) : (
              <span className={`whitespace-nowrap ${isLast ? 'text-gray-900 dark:text-slate-100 font-medium truncate max-w-[200px] md:max-w-none' : ''}`}>
                {item.name}
              </span>
            )}
            {!isLast && <span className="mx-2 flex-shrink-0">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
