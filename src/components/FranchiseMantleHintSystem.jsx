import React from 'react';
import { FRANCHISE_HINT_LEVELS, generateFranchiseHints, franchiseAdsNeededForNextHint, getUnlockedFranchiseHintIds } from '../utils/franchiseHints';
import { useLanguage } from '../i18n/LanguageContext';

function FranchiseMantleHintSystem({ answer, adsWatchedCount, onWatchAd }) {
  const { lang, t } = useLanguage();

  const unlockedIds = getUnlockedFranchiseHintIds(adsWatchedCount);
  const hints = generateFranchiseHints(answer, unlockedIds, lang);
  const next = franchiseAdsNeededForNextHint(adsWatchedCount);
  const totalHints = FRANCHISE_HINT_LEVELS.length;

  return (
    <div className="w-full max-w-md bg-gradient-to-r from-teal-900 to-cyan-900 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-teal-200 mb-4">{t('hintSystem')}</h2>

      {/* Progress */}
      <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">{t('adsWatched')}:</span>
          <span className="font-bold text-teal-300">{adsWatchedCount} / {totalHints}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-teal-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((adsWatchedCount / totalHints) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Watch Ad Button */}
      {next.hintId && (
        <button
          onClick={onWatchAd}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all mb-4 shadow-lg"
        >
          {t('franchiseWatchAdHint')} ({unlockedIds.length + 1}/{totalHints})
        </button>
      )}

      {!next.hintId && adsWatchedCount > 0 && (
        <div className="text-center text-green-400 font-semibold mb-4">
          {t('allHintsUnlocked')}
        </div>
      )}

      {/* Unlocked Hints */}
      <div className="space-y-3">
        {hints.map((hint) => (
          <div
            key={hint.id}
            className="bg-green-900 bg-opacity-50 border-2 border-green-500 p-4 rounded-md"
          >
            <div className="text-gray-100">{hint.message}</div>
          </div>
        ))}

        {hints.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            {t('noHintsYet')}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        {t('supportDev')}
      </div>
    </div>
  );
}

export default FranchiseMantleHintSystem;
