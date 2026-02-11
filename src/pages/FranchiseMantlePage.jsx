import React, { useState, useEffect } from "react";
import { getDailyFranchise, findFranchiseByName, calculateFranchiseSimilarity } from "../utils/franchiseGame";
import {
  getFranchiseStats,
  updateFranchiseStatsOnGameComplete,
  getFranchiseAverageGuesses,
  getFranchiseAdsWatched,
  incrementFranchiseAdsWatched,
  checkAndResetFranchiseForNewDay,
} from "../utils/storage";
import { showRewardedAd } from "../utils/adinplay";
import { useLanguage } from "../i18n/LanguageContext";
import GameStats from "../components/GameStats";
import FranchiseMantleHintSystem from "../components/FranchiseMantleHintSystem";
import AdSenseAd from "../components/AdSenseAd";

function FranchiseMantlePage() {
  const { lang, t } = useLanguage();

  const today = new Date();
  const currentDateString = today.toDateString();
  const todayAnswer = getDailyFranchise(today);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const savedDate = localStorage.getItem("franchiseMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("franchiseMantle_guesses");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isCorrect, setIsCorrect] = useState(() => {
    const savedDate = localStorage.getItem("franchiseMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("franchiseMantle_isCorrect");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [uniqueGuessesCount, setUniqueGuessesCount] = useState(() => {
    const savedDate = localStorage.getItem("franchiseMantle_date");
    if (savedDate === currentDateString) {
      const saved = localStorage.getItem("franchiseMantle_uniqueGuessesCount");
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });

  const [stats, setStats] = useState(() => getFranchiseStats());
  const [adsWatchedCount, setAdsWatchedCount] = useState(() => getFranchiseAdsWatched());

  useEffect(() => {
    const isNewDay = checkAndResetFranchiseForNewDay(currentDateString);
    if (isNewDay) {
      setGuesses([]);
      setIsCorrect(false);
      setUniqueGuessesCount(0);
      setAdsWatchedCount(0);
    }

    if (new URLSearchParams(window.location.search).has('debug')) {
      console.log("Today's FranchiseMantle answer:", todayAnswer);
    }
  }, [currentDateString, todayAnswer]);

  useEffect(() => {
    localStorage.setItem("franchiseMantle_guesses", JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    localStorage.setItem("franchiseMantle_isCorrect", JSON.stringify(isCorrect));
  }, [isCorrect]);

  useEffect(() => {
    localStorage.setItem("franchiseMantle_uniqueGuessesCount", JSON.stringify(uniqueGuessesCount));
  }, [uniqueGuessesCount]);

  const handleGuess = (e) => {
    e.preventDefault();
    setError("");

    if (!guess.trim()) {
      setError(t('franchiseEnterName'));
      return;
    }

    const franchise = findFranchiseByName(guess);
    if (!franchise) {
      setError(t('franchiseNotFound'));
      return;
    }

    const similarity = calculateFranchiseSimilarity(franchise, todayAnswer);

    const newGuess = {
      name: franchise.name,
      englishName: franchise.englishName,
      similarity,
      categoryMatch: franchise.category === todayAnswer.category,
      sizeMatch: franchise.size === todayAnswer.size,
      priceMatch: franchise.priceRange === todayAnswer.priceRange,
      category: franchise.category,
      size: franchise.size,
      priceRange: franchise.priceRange,
    };

    // Check for duplicate
    const existingIndex = guesses.findIndex((g) => g.name === franchise.name);
    if (existingIndex !== -1) {
      const updated = guesses.filter((_, i) => i !== existingIndex);
      setGuesses([newGuess, ...updated]);
    } else {
      setGuesses((prev) => [newGuess, ...prev]);
      setUniqueGuessesCount((prev) => prev + 1);
    }

    if (franchise.name === todayAnswer.name) {
      setIsCorrect(true);
      const finalGuessCount = existingIndex !== -1 ? uniqueGuessesCount : uniqueGuessesCount + 1;
      const updatedStats = updateFranchiseStatsOnGameComplete(finalGuessCount, true, today);
      setStats(updatedStats);

      if (window.gtag) {
        window.gtag('event', 'franchise_game_completed', {
          answer: todayAnswer.englishName,
          guesses: finalGuessCount,
          language: lang,
        });
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

  const formatResultsForClipboard = () => {
    const answerName = lang === 'en' ? todayAnswer.englishName : todayAnswer.name;
    let result = `FranchiseMantle #\n`;
    result += `${t('franchiseTodaysAnswer')}: ${answerName}\n\n`;
    result += `${t('myGuessResult')}: ${uniqueGuessesCount}${t('successIn')}\n\n`;

    guesses.forEach((item) => {
      const name = lang === 'en' ? item.englishName : item.name;
      const mark = item.name === todayAnswer.name ? " OK" : "";
      result += `${name} - ${item.similarity}%${mark}\n`;
    });
    result += `\n#FranchiseMantle`;
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
        const newCount = incrementFranchiseAdsWatched();
        setAdsWatchedCount(newCount);
      },
      (error) => {
        console.error("Ad load failed:", error);
        alert(t('adLoadFailed'));
      },
    );
  };

  const answerDisplayName = lang === 'en' ? todayAnswer.englishName : todayAnswer.name;

  const getMatchBadge = (match, label) => (
    <span className={`text-xs px-1.5 py-0.5 rounded ${match ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-400'}`}>
      {label}
    </span>
  );

  return (
    <>
      {/* Stats */}
      <GameStats stats={stats} averageGuesses={getFranchiseAverageGuesses()} />

      {/* Hint System */}
      <FranchiseMantleHintSystem
        answer={todayAnswer}
        adsWatchedCount={adsWatchedCount}
        onWatchAd={handleWatchAd}
      />

      {/* Input Area */}
      <main className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={handleGuess} className="flex flex-col space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={t('franchiseInputPlaceholder')}
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
            <p>{t('franchiseNoGuessesYet')}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {guesses.map((item, index) => (
              <React.Fragment key={index}>
                <li className="p-3 bg-gray-700 rounded-md border border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-200 font-medium text-lg">
                      {lang === 'en' ? item.englishName : item.name}
                    </span>
                    <span className={`font-bold text-lg ${getSimilarityColor(item.similarity)}`}>
                      {item.similarity}%
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {getMatchBadge(item.categoryMatch, lang === 'en' ? item.category : item.category)}
                    {getMatchBadge(item.sizeMatch, item.size)}
                    {getMatchBadge(item.priceMatch, lang === 'en' ? (item.priceRange === '저' ? 'Low' : item.priceRange === '중' ? 'Mid' : 'High') : `${item.priceRange}가`)}
                  </div>
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
              {t('franchiseYouGuessed')}
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

export default FranchiseMantlePage;
