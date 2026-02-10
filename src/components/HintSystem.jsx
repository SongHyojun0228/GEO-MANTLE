import React from 'react';
import { generateContinentHint, generateDistanceHint, adsNeededForNextHint } from '../utils/hints';
import { useLanguage } from '../i18n/LanguageContext';

function HintSystem({
  answerCountry,
  guesses,
  adsWatchedCount,
  unlockedHints,
  onWatchAd,
}) {
  const { lang, t } = useLanguage();

  const continentHint = unlockedHints.continent ? generateContinentHint(answerCountry, lang) : null;
  const distanceHint = unlockedHints.distance ? generateDistanceHint(guesses, lang) : null;
  const nextHint = adsNeededForNextHint(adsWatchedCount, unlockedHints);

  return (
    <div className="w-full max-w-md bg-gradient-to-r from-teal-900 to-cyan-900 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-teal-200 mb-4">{t('hintSystem')}</h2>

      {/* Progress */}
      <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">{t('adsWatched')}:</span>
          <span className="font-bold text-teal-300">{adsWatchedCount} / 2</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-teal-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(adsWatchedCount / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Watch Ad Button */}
      {!unlockedHints.distance && (
        <button
          onClick={onWatchAd}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all mb-4 shadow-lg"
        >
          {nextHint.hintType === 'continent' && t('watchAdContinent')}
          {nextHint.hintType === 'distance' && t('watchAdDistance')}
          {!nextHint.hintType && t('allHintsUnlocked')}
        </button>
      )}

      {/* Unlocked Hints */}
      <div className="space-y-3">
        {continentHint && (
          <div className="bg-green-900 bg-opacity-50 border-2 border-green-500 p-4 rounded-md">
            <div
              className="text-gray-100"
              dangerouslySetInnerHTML={{ __html: continentHint.message }}
            />
          </div>
        )}

        {distanceHint && (
          <div className="bg-blue-900 bg-opacity-50 border-2 border-blue-500 p-4 rounded-md">
            <div
              className="text-gray-100"
              dangerouslySetInnerHTML={{ __html: distanceHint.message }}
            />
          </div>
        )}

        {!unlockedHints.continent && !unlockedHints.distance && (
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

export default HintSystem;
