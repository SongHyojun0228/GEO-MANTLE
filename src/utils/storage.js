// localStorage 키 상수
const KEYS = {
  DATE: 'geoMantle_date',
  GUESSES: 'geoMantle_guesses',
  IS_CORRECT: 'geoMantle_isCorrect',
  UNIQUE_GUESSES_COUNT: 'geoMantle_uniqueGuessesCount',
  STATS: 'geoMantle_stats',
  YESTERDAY: 'geoMantle_yesterday',
  ARCHIVE: 'geoMantle_archive',
  ADS_WATCHED: 'geoMantle_adsWatched',
  HINTS_UNLOCKED: 'geoMantle_hintsUnlocked',
};

// NumMantle localStorage 키
const NUM_KEYS = {
  DATE: 'numMantle_date',
  GUESSES: 'numMantle_guesses',
  IS_CORRECT: 'numMantle_isCorrect',
  UNIQUE_GUESSES_COUNT: 'numMantle_uniqueGuessesCount',
  STATS: 'numMantle_stats',
  ADS_WATCHED: 'numMantle_adsWatched',
};

// 기본 통계 구조
const DEFAULT_STATS = {
  totalPlays: 0,
  totalGuesses: 0,
  successfulGames: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
};

// 게임 통계 가져오기
export function getStats() {
  const saved = localStorage.getItem(KEYS.STATS);
  return saved ? JSON.parse(saved) : { ...DEFAULT_STATS };
}

// 게임 통계 저장
export function saveStats(stats) {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

// 게임 완료 시 통계 업데이트
export function updateStatsOnGameComplete(guessCount, isSuccess, currentDate) {
  const stats = getStats();
  const today = new Date(currentDate).toDateString();

  stats.totalPlays += 1;
  stats.totalGuesses += guessCount;

  if (isSuccess) {
    stats.successfulGames += 1;

    // 연속 성공 계산
    if (stats.lastPlayedDate) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastPlayedDate === yesterday.toDateString()) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    // 최고 연속 기록 업데이트
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  saveStats(stats);
  return stats;
}

// 평균 추측 횟수 계산
export function getAverageGuesses() {
  const stats = getStats();
  if (stats.successfulGames === 0) return 0;
  return (stats.totalGuesses / stats.successfulGames).toFixed(1);
}

// 어제의 정답 저장
export function saveYesterdayAnswer(country, guessCount, date) {
  const yesterdayData = {
    country,
    guessCount,
    date: new Date(date).toDateString(),
  };
  localStorage.setItem(KEYS.YESTERDAY, JSON.stringify(yesterdayData));
}

// 어제의 정답 가져오기
export function getYesterdayAnswer() {
  const saved = localStorage.getItem(KEYS.YESTERDAY);
  return saved ? JSON.parse(saved) : null;
}

// 아카이브에 게임 기록 추가
export function addToArchive(country, guessCount, date, isSuccess) {
  const archive = getArchive();
  const newEntry = {
    country: country.name,
    englishName: country.englishName,
    guessCount,
    date: new Date(date).toDateString(),
    isSuccess,
  };

  // 최신 항목을 앞에 추가
  archive.unshift(newEntry);

  // 최근 7일만 유지
  const trimmedArchive = archive.slice(0, 7);
  localStorage.setItem(KEYS.ARCHIVE, JSON.stringify(trimmedArchive));

  return trimmedArchive;
}

// 아카이브 가져오기
export function getArchive() {
  const saved = localStorage.getItem(KEYS.ARCHIVE);
  return saved ? JSON.parse(saved) : [];
}

// 광고 시청 횟수 가져오기
export function getAdsWatched() {
  const saved = localStorage.getItem(KEYS.ADS_WATCHED);
  return saved ? parseInt(saved, 10) : 0;
}

// 광고 시청 횟수 증가
export function incrementAdsWatched() {
  const current = getAdsWatched();
  const newCount = current + 1;
  localStorage.setItem(KEYS.ADS_WATCHED, newCount.toString());
  return newCount;
}

// 광고 시청 횟수 초기화 (새로운 날)
export function resetAdsWatched() {
  localStorage.setItem(KEYS.ADS_WATCHED, '0');
}

// 해금된 힌트 가져오기
export function getUnlockedHints() {
  const saved = localStorage.getItem(KEYS.HINTS_UNLOCKED);
  return saved ? JSON.parse(saved) : {
    continent: false,
    distance: false,
  };
}

// 힌트 해금
export function unlockHint(hintType) {
  const hints = getUnlockedHints();
  hints[hintType] = true;
  localStorage.setItem(KEYS.HINTS_UNLOCKED, JSON.stringify(hints));
  return hints;
}

// 힌트 초기화 (새로운 날)
export function resetHints() {
  localStorage.setItem(KEYS.HINTS_UNLOCKED, JSON.stringify({
    continent: false,
    distance: false,
  }));
}

// 새로운 날 체크 및 초기화
export function checkAndResetForNewDay(currentDateString) {
  const savedDate = localStorage.getItem(KEYS.DATE);

  if (savedDate !== currentDateString) {
    // 어제의 정답 저장 (게임을 완료했다면)
    const savedIsCorrect = localStorage.getItem(KEYS.IS_CORRECT);
    const savedGuesses = localStorage.getItem(KEYS.GUESSES);
    const savedUniqueCount = localStorage.getItem(KEYS.UNIQUE_GUESSES_COUNT);

    if (savedIsCorrect && savedGuesses) {
      const isCorrect = JSON.parse(savedIsCorrect);
      const guesses = JSON.parse(savedGuesses);
      const uniqueCount = savedUniqueCount ? JSON.parse(savedUniqueCount) : 0;

      if (guesses.length > 0) {
        // 이전 날짜로 어제의 정답 저장
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        // 여기서는 정답 국가 정보가 필요한데, 저장된 정보에서 가져올 수 없으므로
        // App.jsx에서 처리하도록 함
      }
    }

    // 새로운 날 설정
    localStorage.setItem(KEYS.DATE, currentDateString);

    // 게임 상태 초기화
    localStorage.removeItem(KEYS.GUESSES);
    localStorage.removeItem(KEYS.IS_CORRECT);
    localStorage.removeItem(KEYS.UNIQUE_GUESSES_COUNT);

    // 힌트 및 광고 시청 초기화
    resetHints();
    resetAdsWatched();

    return true; // 새로운 날
  }

  return false; // 같은 날
}

// ============================================================
// NumMantle storage functions
// ============================================================

const NUM_DEFAULT_STATS = {
  totalPlays: 0,
  totalGuesses: 0,
  successfulGames: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
};

export function getNumStats() {
  const saved = localStorage.getItem(NUM_KEYS.STATS);
  return saved ? JSON.parse(saved) : { ...NUM_DEFAULT_STATS };
}

export function saveNumStats(stats) {
  localStorage.setItem(NUM_KEYS.STATS, JSON.stringify(stats));
}

export function updateNumStatsOnGameComplete(guessCount, isSuccess, currentDate) {
  const stats = getNumStats();
  const today = new Date(currentDate).toDateString();

  stats.totalPlays += 1;
  stats.totalGuesses += guessCount;

  if (isSuccess) {
    stats.successfulGames += 1;

    if (stats.lastPlayedDate) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastPlayedDate === yesterday.toDateString()) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  saveNumStats(stats);
  return stats;
}

export function getNumAverageGuesses() {
  const stats = getNumStats();
  if (stats.successfulGames === 0) return 0;
  return (stats.totalGuesses / stats.successfulGames).toFixed(1);
}

export function getNumAdsWatched() {
  const saved = localStorage.getItem(NUM_KEYS.ADS_WATCHED);
  return saved ? parseInt(saved, 10) : 0;
}

export function incrementNumAdsWatched() {
  const current = getNumAdsWatched();
  const newCount = current + 1;
  localStorage.setItem(NUM_KEYS.ADS_WATCHED, newCount.toString());
  return newCount;
}

export function resetNumAdsWatched() {
  localStorage.setItem(NUM_KEYS.ADS_WATCHED, '0');
}

export function checkAndResetNumForNewDay(currentDateString) {
  const savedDate = localStorage.getItem(NUM_KEYS.DATE);

  if (savedDate !== currentDateString) {
    localStorage.setItem(NUM_KEYS.DATE, currentDateString);
    localStorage.removeItem(NUM_KEYS.GUESSES);
    localStorage.removeItem(NUM_KEYS.IS_CORRECT);
    localStorage.removeItem(NUM_KEYS.UNIQUE_GUESSES_COUNT);
    resetNumAdsWatched();
    return true;
  }

  return false;
}

// ============================================================
// AnimalMantle storage functions
// ============================================================

const ANIMAL_KEYS = {
  DATE: 'animalMantle_date',
  GUESSES: 'animalMantle_guesses',
  IS_CORRECT: 'animalMantle_isCorrect',
  UNIQUE_GUESSES_COUNT: 'animalMantle_uniqueGuessesCount',
  STATS: 'animalMantle_stats',
  ADS_WATCHED: 'animalMantle_adsWatched',
};

const ANIMAL_DEFAULT_STATS = {
  totalPlays: 0,
  totalGuesses: 0,
  successfulGames: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
};

export function getAnimalStats() {
  const saved = localStorage.getItem(ANIMAL_KEYS.STATS);
  return saved ? JSON.parse(saved) : { ...ANIMAL_DEFAULT_STATS };
}

export function saveAnimalStats(stats) {
  localStorage.setItem(ANIMAL_KEYS.STATS, JSON.stringify(stats));
}

export function updateAnimalStatsOnGameComplete(guessCount, isSuccess, currentDate) {
  const stats = getAnimalStats();
  const today = new Date(currentDate).toDateString();

  stats.totalPlays += 1;
  stats.totalGuesses += guessCount;

  if (isSuccess) {
    stats.successfulGames += 1;

    if (stats.lastPlayedDate) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastPlayedDate === yesterday.toDateString()) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  saveAnimalStats(stats);
  return stats;
}

export function getAnimalAverageGuesses() {
  const stats = getAnimalStats();
  if (stats.successfulGames === 0) return 0;
  return (stats.totalGuesses / stats.successfulGames).toFixed(1);
}

export function getAnimalAdsWatched() {
  const saved = localStorage.getItem(ANIMAL_KEYS.ADS_WATCHED);
  return saved ? parseInt(saved, 10) : 0;
}

export function incrementAnimalAdsWatched() {
  const current = getAnimalAdsWatched();
  const newCount = current + 1;
  localStorage.setItem(ANIMAL_KEYS.ADS_WATCHED, newCount.toString());
  return newCount;
}

export function resetAnimalAdsWatched() {
  localStorage.setItem(ANIMAL_KEYS.ADS_WATCHED, '0');
}

export function checkAndResetAnimalForNewDay(currentDateString) {
  const savedDate = localStorage.getItem(ANIMAL_KEYS.DATE);

  if (savedDate !== currentDateString) {
    localStorage.setItem(ANIMAL_KEYS.DATE, currentDateString);
    localStorage.removeItem(ANIMAL_KEYS.GUESSES);
    localStorage.removeItem(ANIMAL_KEYS.IS_CORRECT);
    localStorage.removeItem(ANIMAL_KEYS.UNIQUE_GUESSES_COUNT);
    resetAnimalAdsWatched();
    return true;
  }

  return false;
}

// ============================================================
// FranchiseMantle storage functions
// ============================================================

const FRANCHISE_KEYS = {
  DATE: 'franchiseMantle_date',
  GUESSES: 'franchiseMantle_guesses',
  IS_CORRECT: 'franchiseMantle_isCorrect',
  UNIQUE_GUESSES_COUNT: 'franchiseMantle_uniqueGuessesCount',
  STATS: 'franchiseMantle_stats',
  ADS_WATCHED: 'franchiseMantle_adsWatched',
};

const FRANCHISE_DEFAULT_STATS = {
  totalPlays: 0,
  totalGuesses: 0,
  successfulGames: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: null,
};

export function getFranchiseStats() {
  const saved = localStorage.getItem(FRANCHISE_KEYS.STATS);
  return saved ? JSON.parse(saved) : { ...FRANCHISE_DEFAULT_STATS };
}

export function saveFranchiseStats(stats) {
  localStorage.setItem(FRANCHISE_KEYS.STATS, JSON.stringify(stats));
}

export function updateFranchiseStatsOnGameComplete(guessCount, isSuccess, currentDate) {
  const stats = getFranchiseStats();
  const today = new Date(currentDate).toDateString();

  stats.totalPlays += 1;
  stats.totalGuesses += guessCount;

  if (isSuccess) {
    stats.successfulGames += 1;

    if (stats.lastPlayedDate) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastPlayedDate === yesterday.toDateString()) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  saveFranchiseStats(stats);
  return stats;
}

export function getFranchiseAverageGuesses() {
  const stats = getFranchiseStats();
  if (stats.successfulGames === 0) return 0;
  return (stats.totalGuesses / stats.successfulGames).toFixed(1);
}

export function getFranchiseAdsWatched() {
  const saved = localStorage.getItem(FRANCHISE_KEYS.ADS_WATCHED);
  return saved ? parseInt(saved, 10) : 0;
}

export function incrementFranchiseAdsWatched() {
  const current = getFranchiseAdsWatched();
  const newCount = current + 1;
  localStorage.setItem(FRANCHISE_KEYS.ADS_WATCHED, newCount.toString());
  return newCount;
}

export function resetFranchiseAdsWatched() {
  localStorage.setItem(FRANCHISE_KEYS.ADS_WATCHED, '0');
}

export function checkAndResetFranchiseForNewDay(currentDateString) {
  const savedDate = localStorage.getItem(FRANCHISE_KEYS.DATE);

  if (savedDate !== currentDateString) {
    localStorage.setItem(FRANCHISE_KEYS.DATE, currentDateString);
    localStorage.removeItem(FRANCHISE_KEYS.GUESSES);
    localStorage.removeItem(FRANCHISE_KEYS.IS_CORRECT);
    localStorage.removeItem(FRANCHISE_KEYS.UNIQUE_GUESSES_COUNT);
    resetFranchiseAdsWatched();
    return true;
  }

  return false;
}

export default KEYS;
