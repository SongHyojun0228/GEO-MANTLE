import React, { useState, useEffect } from "react";
import { getDailyNumber, calculateSimilarity } from "../utils/numGame";
import {
  getNumStats,
  updateNumStatsOnGameComplete,
  getNumAverageGuesses,
  getNumAdsWatched,
  incrementNumAdsWatched,
  checkAndResetNumForNewDay,
} from "../utils/storage";
import { showRewardedAd } from "../utils/adinplay";
import { useLanguage } from "../i18n/LanguageContext";
import GameStats from "../components/GameStats";
import NumMantleHintSystem from "../components/NumMantleHintSystem";
import AdSenseAd from "../components/AdSenseAd";

function NumMantlePage() {
  const { lang, t } = useLanguage();

  const today = new Date();
  const currentDateString = today.toDateString();
  const todayAnswer = getDailyNumber(today);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const savedDate = localStorage.getItem("numMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("numMantle_guesses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isCorrect, setIsCorrect] = useState(() => {
    const savedDate = localStorage.getItem("numMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("numMantle_isCorrect");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [uniqueGuessesCount, setUniqueGuessesCount] = useState(() => {
    const savedDate = localStorage.getItem("numMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("numMantle_uniqueGuessesCount");
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });

  const [stats, setStats] = useState(() => getNumStats());
  const [adsWatchedCount, setAdsWatchedCount] = useState(() => getNumAdsWatched());

  useEffect(() => {
    const isNewDay = checkAndResetNumForNewDay(currentDateString);
    if (isNewDay) {
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
      setAdsWatchedCount(0);
    }

    if (new URLSearchParams(window.location.search).has('debug')) {
      console.log("Today's NumMantle answer:", todayAnswer);
    }
  }, [currentDateString, todayAnswer]);

  useEffect(() => {
    localStorage.setItem("numMantle_guesses", JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    localStorage.setItem("numMantle_isCorrect", JSON.stringify(isCorrect));
  }, [isCorrect]);

  useEffect(() => {
    localStorage.setItem("numMantle_uniqueGuessesCount", JSON.stringify(uniqueGuessesCount));
  }, [uniqueGuessesCount]);

  const handleGuess = (e) => {
    e.preventDefault();
    setError("");

    const num = parseInt(guess, 10);
    if (!guess || isNaN(num)) {
      setError(t('numEnterNumber'));
      return;
    }
    if (num < 1 || num > 9999) {
      setError(t('numRangeError'));
      return;
    }

    const similarity = calculateSimilarity(num, todayAnswer);

    const newGuess = {
      number: num,
      similarity: similarity.toFixed(1),
    };

    // Check for duplicate
    const existingIndex = guesses.findIndex((g) => g.number === num);
    if (existingIndex !== -1) {
      const updated = guesses.filter((_, i) => i !== existingIndex);
      setGuesses([newGuess, ...updated]);
    } else {
      setGuesses((prev) => [newGuess, ...prev]);
      setUniqueGuessesCount((prev) => prev + 1);
    }

    if (num === todayAnswer) {
      setIsCorrect(true);
      const finalGuessCount = existingIndex !== -1 ? uniqueGuessesCount : uniqueGuessesCount + 1;
      const updatedStats = updateNumStatsOnGameComplete(finalGuessCount, true, today);
      setStats(updatedStats);

      if (window.gtag) {
        window.gtag('event', 'num_game_completed', {
          answer: todayAnswer,
          guesses: finalGuessCount,
          language: lang,
        });
      }
    }

    setGuess("");
  };

  const getSimilarityColor = (similarity) => {
    const sim = parseFloat(similarity);
    if (sim >= 99) return "text-red-500";
    if (sim >= 95) return "text-orange-400";
    if (sim >= 80) return "text-yellow-300";
    return "text-gray-400";
  };

  const formatResultsForClipboard = () => {
    let result = `NumMantle #\n`;
    result += `${t('numTodaysAnswer')}: ${todayAnswer}\n\n`;
    result += `${t('myGuessResult')}: ${uniqueGuessesCount}${t('successIn')}\n\n`;

    guesses.forEach((item) => {
      const mark = item.number === todayAnswer ? " OK" : "";
      result += `${item.number} - ${item.similarity}%${mark}\n`;
    });
    result += `\n#NumMantle`;
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
        const newCount = incrementNumAdsWatched();
        setAdsWatchedCount(newCount);
      },
      (error) => {
        console.error("Ad load failed:", error);
        alert(t('adLoadFailed'));
      },
    );
  };

  return (
    <>
      {/* Stats */}
      <GameStats stats={stats} averageGuesses={getNumAverageGuesses()} />

      {/* Hint System */}
      <NumMantleHintSystem
        answer={todayAnswer}
        adsWatchedCount={adsWatchedCount}
        onWatchAd={handleWatchAd}
      />

      {/* Input Area */}
      <main className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleGuess} className="flex flex-col space-y-4">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('numInputPlaceholder')}
            min="1"
            max="9999"
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-100"
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
            <p>{t('numNoGuessesYet')}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {guesses.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex justify-between items-center p-3 bg-gray-700 rounded-md border border-gray-600">
                  <span className="text-gray-200 font-medium text-lg">
                    {item.number}
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

      {/* Success Modal */}
      {isCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl text-center relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
              aria-label={t('closeModal')}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              {t('correct')}
            </h2>
            <p className="text-gray-200 mb-2">
              {t('congratulations')}{" "}
              <span className="font-semibold">{todayAnswer}</span>
              {t('numYouGuessed')}
            </p>
            <p className="text-4xl font-bold text-teal-300 mb-6">
              {uniqueGuessesCount}{t('guessCountResult')}
            </p>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors mb-4"
            >
              {copyFeedback || t('copyResults')}
            </button>
            <div className="mt-4">
              <AdSenseAd adSlot="YOUR_AD_SLOT_ID" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NumMantlePage;
