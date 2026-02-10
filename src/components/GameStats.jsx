import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function GameStats({ stats, averageGuesses }) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">{t('myStats')}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-teal-300">{stats.totalPlays}</div>
          <div className="text-sm text-gray-400 mt-1">{t('totalPlays')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-green-400">{stats.successfulGames}</div>
          <div className="text-sm text-gray-400 mt-1">{t('successfulGames')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-yellow-400">{averageGuesses}</div>
          <div className="text-sm text-gray-400 mt-1">{t('averageGuesses')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div className="text-sm text-gray-400 mt-1">{t('currentStreak')}</div>
        </div>
      </div>
      <div className="mt-4 bg-gray-700 p-3 rounded-md text-center">
        <div className="text-gray-300">
          {t('bestStreakLabel')}: <span className="font-bold text-purple-400">{stats.bestStreak}</span>{t('streakUnit')}
        </div>
      </div>
    </div>
  );
}

export default GameStats;
