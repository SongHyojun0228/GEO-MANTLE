import React, { useState, useEffect } from "react";
import { getDailyFranchise, findFranchiseByName, calculateFranchiseSimilarity, getRandomFranchise } from "../utils/franchiseGame";
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
import { getGameDayNumber, similarityToEmoji } from "../utils/shareHelper";
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

  // Unlimited mode state (session only, not persisted)
  const [gameMode, setGameMode] = useState('daily');
  const [unlimitedAnswer, setUnlimitedAnswer] = useState(null);
  const [unlimitedRound, setUnlimitedRound] = useState(0);

  const currentAnswer = gameMode === 'unlimited' && unlimitedAnswer ? unlimitedAnswer : todayAnswer;

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

  const isDailyMode = gameMode === 'daily';

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("franchiseMantle_guesses", JSON.stringify(guesses));
  }, [guesses, isDailyMode]);

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("franchiseMantle_isCorrect", JSON.stringify(isCorrect));
  }, [isCorrect, isDailyMode]);

  useEffect(() => {
    if (isDailyMode) localStorage.setItem("franchiseMantle_uniqueGuessesCount", JSON.stringify(uniqueGuessesCount));
  }, [uniqueGuessesCount, isDailyMode]);

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

    const similarity = calculateFranchiseSimilarity(franchise, currentAnswer);

    const newGuess = {
      name: franchise.name,
      englishName: franchise.englishName,
      similarity,
      categoryMatch: franchise.category === currentAnswer.category,
      sizeMatch: franchise.size === currentAnswer.size,
      priceMatch: franchise.priceRange === currentAnswer.priceRange,
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

    if (franchise.name === currentAnswer.name) {
      setIsCorrect(true);
      if (gameMode === 'daily') {
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
    setUnlimitedAnswer(getRandomFranchise());
    setUnlimitedRound((prev) => prev + 1);
    setGuesses([]);
    setIsCorrect(false);
    setUniqueGuessesCount(0);
  };

  const returnToDaily = () => {
    setGameMode('daily');
    setUnlimitedAnswer(null);
    setUnlimitedRound(0);
    const savedDate = localStorage.getItem("franchiseMantle_date");
    if (savedDate === currentDateString) {
      const savedGuesses = localStorage.getItem("franchiseMantle_guesses");
      setGuesses(savedGuesses ? JSON.parse(savedGuesses) : []);
      const savedIsCorrect = localStorage.getItem("franchiseMantle_isCorrect");
      setIsCorrect(savedIsCorrect ? JSON.parse(savedIsCorrect) : false);
      const savedCount = localStorage.getItem("franchiseMantle_uniqueGuessesCount");
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
      let result = `🏪 FranchiseMantle ${t('unlimitedPractice')}\n`;
      result += `🏆 ${uniqueGuessesCount}${t('successIn')}\n\n`;
      result += `${emojiBar}\n\n`;
      result += `https://geo-mantle.vercel.app/franchise`;
      return result;
    }
    const dayNum = getGameDayNumber(today);
    let result = `🏪 FranchiseMantle Day ${dayNum}\n`;
    result += `🏆 ${uniqueGuessesCount}${t('successIn')}\n\n`;
    result += `${emojiBar}\n\n`;
    result += `https://geo-mantle.vercel.app/franchise`;
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

  const answerDisplayName = lang === 'en' ? currentAnswer.englishName : currentAnswer.name;
  const isDebug = new URLSearchParams(window.location.search).has('debug');

  const getMatchBadge = (match, label) => (
    <span className={`text-xs px-1.5 py-0.5 rounded ${match ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-400'}`}>
      {label}
    </span>
  );

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
            DEBUG: {currentAnswer.name} ({currentAnswer.englishName}) | {currentAnswer.category} | {currentAnswer.size} | {currentAnswer.priceRange}가
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
            placeholder={t('franchiseInputPlaceholder')}
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

      {/* Hint System */}
      <FranchiseMantleHintSystem
        answer={currentAnswer}
        adsWatchedCount={adsWatchedCount}
        onWatchAd={handleWatchAd}
      />

      {/* Stats */}
      {stats.totalPlays > 0 && (
        <GameStats stats={stats} averageGuesses={getFranchiseAverageGuesses()} />
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
              {t('franchiseYouGuessed')}
            </p>
            <p className="text-4xl font-bold text-teal-300 mb-6">
              {uniqueGuessesCount}{t('guessCountResult')}
            </p>
            {/* Share Preview Card */}
            <div className="bg-gray-800 rounded-lg p-5 mb-5 text-left font-mono text-sm leading-relaxed border border-gray-600">
              <p className="text-white">🏪 FranchiseMantle {gameMode === 'unlimited' ? t('unlimitedPractice') : `Day ${getGameDayNumber(today)}`}</p>
              <p className="text-white">🏆 {uniqueGuessesCount}{t('successIn')}</p>
              <p className="text-2xl mt-2 tracking-wider">{guesses.map((item) => similarityToEmoji(item.similarity)).reverse().join('')}</p>
              <p className="text-gray-400 mt-2 text-xs">geo-mantle.vercel.app/franchise</p>
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

      {/* SEO Content: article */}
      <article className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg mb-8 text-gray-300 text-sm space-y-4 leading-relaxed mt-8">
        <h2 className="text-xl font-bold text-teal-400 mb-2">FranchiseMantle: 대한민국 프랜차이즈 맞히기</h2>
        <p>
          FranchiseMantle은 대한민국에 실제 존재하는 유명 브랜드 및 체인점들을 주제로 한 <strong>프랜차이즈 퍼즐 기반 웹 게임</strong>입니다. 커피, 치킨, 피자부터 패스트푸드, 편의점 등 다양한 업종에 속하는 브랜드들을 매일 하나씩 맞춰야 합니다. 이 게임을 통해 우리는 우리나라 자영업 및 상권에 어떤 메가 브랜드들이 포진해 있는지 트렌드를 엿볼 수 있습니다.
        </p>
        <p>
          정답 추리의 기본은 <strong>업종, 가격대, 규모</strong>라는 세 가지 필수 데이터입니다. 업종이 정답에 미치는 영향(가중치)이 가장 크기 때문에, 가장 처음에는 '스타벅스(카페/디저트)'나 '교촌치킨(치킨)'처럼 특정 업종을 극명하게 대변하는 대표 브랜드들을 우선적으로 검색하여 색상 피드백을 얻어냅니다. 초록색으로 불이 들어오면 해당 속성이 완전히 일치한다는 의미입니다.
        </p>
        <p>
          이 지식 기반의 데일리 브라우저 게임은 매 라운드가 지나갈수록 참가자에게 은근한 승부욕을 불러일으킵니다. 매일 자정에 갱신되는 수많은 식음료(F&amp;B) 및 리테일 프랜차이즈 후보군 중에서, 오직 직관과 약간의 힌트만으로 정확한 답을 도출하며 여러분의 소비자 인싸 능력을 테스트해보세요.
        </p>
      </article>
    </>
  );
}

export default FranchiseMantlePage;
