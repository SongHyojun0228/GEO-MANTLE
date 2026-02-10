import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function RecentArchive({ archive }) {
  const { lang, t } = useLanguage();

  if (!archive || archive.length === 0) {
    return null;
  }

  const dateLocale = lang === 'ko' ? 'ko-KR' : 'en-US';

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">{t('recentArchive')}</h2>
      <div className="space-y-2">
        {archive.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-200">
                {lang === 'en' ? (entry.englishName || entry.country) : entry.country}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(entry.date).toLocaleDateString(dateLocale, {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">{entry.guessCount}{t('guessUnit')}</span>
              <span className="text-xl">
                {entry.isSuccess ? '✅' : '❌'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentArchive;
