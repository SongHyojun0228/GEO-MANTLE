import React, { useState, useEffect } from "react";
import { getDailyAnimal, findAnimalByName, calculateAnimalSimilarity, getRandomAnimal } from "../utils/animalGame";
import {
  getAnimalStats,
  updateAnimalStatsOnGameComplete,
  getAnimalAverageGuesses,
  getAnimalAdsWatched,
  incrementAnimalAdsWatched,
  checkAndResetAnimalForNewDay,
} from "../utils/storage";
import { showRewardedAd } from "../utils/adinplay";
import { useLanguage } from "../i18n/LanguageContext";
import { getGameDayNumber, similarityToEmoji } from "../utils/shareHelper";
import GameStats from "../components/GameStats";
import AnimalMantleHintSystem from "../components/AnimalMantleHintSystem";
import AdSenseAd from "../components/AdSenseAd";

function AnimalMantlePage() {
  const { lang, t } = useLanguage();

  const today = new Date();
  const currentDateString = today.toDateString();
  const todayAnswer = getDailyAnimal(today);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const savedDate = localStorage.getItem("animalMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("animalMantle_guesses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isCorrect, setIsCorrect] = useState(() => {
    const savedDate = localStorage.getItem("animalMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("animalMantle_isCorrect");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [uniqueGuessesCount, setUniqueGuessesCount] = useState(() => {
    const savedDate = localStorage.getItem("animalMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("animalMantle_uniqueGuessesCount");
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });

  const [stats, setStats] = useState(() => getAnimalStats());
  const [adsWatchedCount, setAdsWatchedCount] = useState(() => getAnimalAdsWatched());

  // Unlimited mode state (session only, not persisted)
  const [gameMode, setGameMode] = useState('daily');
  const [unlimitedAnswer, setUnlimitedAnswer] = useState(null);
  const [unlimitedRound, setUnlimitedRound] = useState(0);

  const currentAnswer = gameMode === 'unlimited' && unlimitedAnswer ? unlimitedAnswer : todayAnswer;

  useEffect(() => {
    const isNewDay = checkAndResetAnimalForNewDay(currentDateString);
    if (isNewDay) {
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
      setAdsWatchedCount(0);
    }

    if (new URLSearchParams(window.location.search).has('debug')) {
      console.log("Today's AnimalMantle answer:", todayAnswer);
    }
  }, [currentDateString, todayAnswer]);

  const isDailyMode = gameMode === 'daily';

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("animalMantle_guesses", JSON.stringify(guesses));
  }, [guesses, isDailyMode]);

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("animalMantle_isCorrect", JSON.stringify(isCorrect));
  }, [isCorrect, isDailyMode]);

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("animalMantle_uniqueGuessesCount", JSON.stringify(uniqueGuessesCount));
  }, [uniqueGuessesCount, isDailyMode]);

  const handleGuess = (e) => {
    e.preventDefault();
    setError("");

    if (!guess.trim()) {
      setError(t('animalEnterName'));
      return;
    }

    const animal = findAnimalByName(guess);
    if (!animal) {
      setError(t('animalNotFound'));
      return;
    }

    const similarity = calculateAnimalSimilarity(animal, currentAnswer);
    const displayName = lang === 'en' ? animal.englishName : animal.name;

    const newGuess = {
      name: animal.name,
      englishName: animal.englishName,
      similarity,
    };

    // Check for duplicate
    const existingIndex = guesses.findIndex((g) => g.name === animal.name);
    if (existingIndex !== -1) {
      const updated = guesses.filter((_, i) => i !== existingIndex);
      setGuesses([newGuess, ...updated]);
    } else {
      setGuesses((prev) => [newGuess, ...prev]);
      setUniqueGuessesCount((prev) => prev + 1);
    }

    if (animal.name === currentAnswer.name) {
      setIsCorrect(true);
      if (gameMode === 'daily') {
        const finalGuessCount = existingIndex !== -1 ? uniqueGuessesCount : uniqueGuessesCount + 1;
        const updatedStats = updateAnimalStatsOnGameComplete(finalGuessCount, true, today);
        setStats(updatedStats);

        if (window.gtag) {
          window.gtag('event', 'animal_game_completed', {
            answer: todayAnswer.englishName,
            guesses: finalGuessCount,
            language: lang,
          });
        }
      }
    }

    setGuess("");
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 90) return "text-red-500";
    if (similarity >= 70) return "text-orange-400";
    if (similarity >= 50) return "text-yellow-300";
    return "text-gray-400";
  };

  const startUnlimitedMode = () => {
    setGameMode('unlimited');
    setUnlimitedAnswer(getRandomAnimal());
    setUnlimitedRound((prev) => prev + 1);
    setGuesses([]);
    setIsCorrect(false);
    setUniqueGuessesCount(0);
  };

  const returnToDaily = () => {
    setGameMode('daily');
    setUnlimitedAnswer(null);
    setUnlimitedRound(0);
    const savedDate = localStorage.getItem("animalMantle_date");
    if (savedDate === currentDateString) {
      const savedGuesses = localStorage.getItem("animalMantle_guesses");
      setGuesses(savedGuesses ? JSON.parse(savedGuesses) : []);
      const savedIsCorrect = localStorage.getItem("animalMantle_isCorrect");
      setIsCorrect(savedIsCorrect ? JSON.parse(savedIsCorrect) : false);
      const savedCount = localStorage.getItem("animalMantle_uniqueGuessesCount");
      setUniqueGuessesCount(savedCount ? JSON.parse(savedCount) : 0);
    } else {
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
    }
  };

  const formatResultsForClipboard = () => {
    const emojiBar = guesses.map((item) => similarityToEmoji(item.similarity)).reverse().join('');
    if (gameMode === 'unlimited') {
      let result = `🐾 AnimalMantle ${t('unlimitedPractice')}\n`;
      result += `🏆 ${uniqueGuessesCount}${t('successIn')}\n\n`;
      result += `${emojiBar}\n\n`;
      result += `https://geo-mantle.vercel.app/animal`;
      return result;
    }
    const dayNum = getGameDayNumber(today);
    let result = `🐾 AnimalMantle Day ${dayNum}\n`;
    result += `🏆 ${uniqueGuessesCount}${t('successIn')}\n\n`;
    result += `${emojiBar}\n\n`;
    result += `https://geo-mantle.vercel.app/animal`;
    return result;
  };

  const handleCopyResults = async () => {
    try {
      const results = formatResultsForClipboard();
      await navigator.clipboard.writeText(results);
      setCopyFeedback(t('copied'));
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      console.error("Failed to copy results:", err);
      setCopyFeedback(t('copyFailed'));
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const handleCloseModal = () => {
    setIsCorrect(false);
  };

  const handleWatchAd = () => {
    showRewardedAd(
      () => {
        const newCount = incrementAnimalAdsWatched();
        setAdsWatchedCount(newCount);
      },
      (error) => {
        console.error("Ad load failed:", error);
        alert(t('adLoadFailed'));
      },
    );
  };

  const answerDisplayName = lang === 'en' ? currentAnswer.englishName : currentAnswer.name;
  const isDebug = new URLSearchParams(window.location.search).has('debug');

  return (
    <>
      {/* Unlimited Mode Banner */}
      {gameMode === 'unlimited' && (
        <div className="w-full max-w-md bg-purple-900 border border-purple-500 p-3 rounded-lg mb-4 text-center">
          <span className="text-purple-200 font-semibold">{t('unlimitedModeActive')}</span>
          <button
            onClick={returnToDaily}
            className="ml-3 text-purple-300 underline hover:text-purple-100 text-sm"
          >
            {t('unlimitedBackToDaily')}
          </button>
        </div>
      )}

      {/* Debug */}
      {isDebug && (
        <div className="w-full max-w-md bg-red-900 border border-red-500 p-3 rounded-lg mb-4 text-center">
          <span className="text-red-300 text-sm font-mono">
            DEBUG: {currentAnswer.name} ({currentAnswer.englishName}) | {currentAnswer.class} | {currentAnswer.habitat}
          </span>
        </div>
      )}

      {/* Input Area */}
      <main className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleGuess} className="flex flex-col space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('animalInputPlaceholder')}
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-100"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors"
          >
            {t('guessButton')}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </main>

      {/* Guess List */}
      <section className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          {t('myGuesses')} ({uniqueGuessesCount}{t('timesUnit')})
        </h2>
        {guesses.length === 0 ? (
          <div className="text-gray-400">
            <p>{t('animalNoGuessesYet')}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {guesses.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
                  <span className="text-gray-200 font-medium text-lg">
                    {lang === 'en' ? item.englishName : item.name}
                  </span>
                  <span className={`font-bold text-lg ${getSimilarityColor(item.similarity)}`}>
                    {item.similarity}%
                  </span>
                </li>
                {index === 2 && guesses.length >= 3 && (
                  <li className="my-4">
                    <AdSenseAd
                      adSlot="YOUR_AD_SLOT_ID_2"
                      style={{ minHeight: "100px" }}
                    />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </section>

      {/* Hint System */}
      <AnimalMantleHintSystem
        answer={currentAnswer}
        adsWatchedCount={adsWatchedCount}
        onWatchAd={handleWatchAd}
      />

      {/* Stats */}
      {stats.totalPlays > 0 && (
        <GameStats stats={stats} averageGuesses={getAnimalAverageGuesses()} />
      )}

      {/* Success Modal */}
      {isCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 rounded-lg shadow-xl text-center relative max-h-[90vh] overflow-y-auto p-8">
            <button
              onClick={handleCloseModal}
              className="sticky top-0 float-right text-gray-400 hover:text-gray-200 text-2xl font-bold z-10"
              aria-label={t('closeModal')}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              {t('correct')}
            </h2>
            <p className="text-gray-200 mb-2">
              {t('congratulations')}{" "}
              <span className="font-semibold">{answerDisplayName}</span>
              {t('animalYouGuessed')}
            </p>
            <p className="text-4xl font-bold text-teal-300 mb-6">
              {uniqueGuessesCount}{t('guessCountResult')}
            </p>
            {/* Share Preview Card */}
            <div className="bg-gray-800 rounded-lg p-5 mb-5 text-left font-mono text-sm leading-relaxed border border-gray-600">
              <p className="text-white">🐾 AnimalMantle {gameMode === 'unlimited' ? t('unlimitedPractice') : `Day ${getGameDayNumber(today)}`}</p>
              <p className="text-white">🏆 {uniqueGuessesCount}{t('successIn')}</p>
              <p className="text-2xl mt-2 tracking-wider">{guesses.map((item) => similarityToEmoji(item.similarity)).reverse().join('')}</p>
              <p className="text-gray-400 mt-2 text-xs">geo-mantle.vercel.app/animal</p>
            </div>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors mb-4"
            >
              {copyFeedback || t('copyResults')}
            </button>
            {/* Unlimited Mode Button */}
            {gameMode === 'daily' && (
              <button
                onClick={startUnlimitedMode}
                className="block w-full mt-3 px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                {t('unlimitedModeContinue')}
              </button>
            )}
            {gameMode === 'unlimited' && (
              <button
                onClick={startUnlimitedMode}
                className="block w-full mt-3 px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                {t('unlimitedModeNext')}
              </button>
            )}
            <div className="mt-4">
              <AdSenseAd adSlot="YOUR_AD_SLOT_ID" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnimalMantlePage;
