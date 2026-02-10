import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

function NavBar({ onShowInstructions }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="w-full max-w-md flex flex-col gap-3 mb-8">
      {/* Game tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-800 rounded-lg overflow-hidden">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 font-semibold text-sm transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            Geo-Mantle
          </NavLink>
          <NavLink
            to="/num"
            className={({ isActive }) =>
              `px-4 py-2 font-semibold text-sm transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            NumMantle
          </NavLink>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {/* Language Toggle */}
          <div className="flex bg-gray-700 rounded-md overflow-hidden text-sm">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-2 font-medium transition-colors ${
                lang === 'ko'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              KR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-2 font-medium transition-colors ${
                lang === 'en'
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              ENG
            </button>
          </div>
          <button
            onClick={onShowInstructions}
            className="px-3 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
          >
            {t('howToPlay')}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
