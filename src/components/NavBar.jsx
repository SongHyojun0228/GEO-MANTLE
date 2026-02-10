import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

function NavBar({ onShowInstructions }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="w-full max-w-md flex flex-col gap-2 mb-8">
      {/* Game tabs */}
      <div className="flex bg-gray-800 rounded-lg overflow-hidden w-full">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex-1 py-2 font-semibold text-sm text-center transition-colors ${
              isActive
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`
          }
        >
          Geo
        </NavLink>
        <NavLink
          to="/num"
          className={({ isActive }) =>
            `flex-1 py-2 font-semibold text-sm text-center transition-colors ${
              isActive
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`
          }
        >
          Num
        </NavLink>
        <NavLink
          to="/animal"
          className={({ isActive }) =>
            `flex-1 py-2 font-semibold text-sm text-center transition-colors ${
              isActive
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`
          }
        >
          Animal
        </NavLink>
      </div>
      {/* Language + Help */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex bg-gray-700 rounded-md overflow-hidden text-sm">
          <button
            onClick={() => setLang('ko')}
            className={`px-3 py-1.5 font-medium transition-colors ${
              lang === 'ko'
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            KR
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 font-medium transition-colors ${
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
          className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
        >
          {t('howToPlay')}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
