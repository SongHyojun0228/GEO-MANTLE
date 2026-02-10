const translations = {
  ko: {
    // Header
    howToPlay: '게임 방법',

    // Input
    inputPlaceholder: '국가 이름을 입력하세요...',
    searching: '검색 중...',
    guessButton: '추측하기',

    // Errors
    enterCountryName: '국가 이름을 입력해주세요.',
    countryNotFound: '입력하신 국가를 찾을 수 없습니다. 다른 국가를 시도해주세요.',
    geocodingError: '위치 검색 중 오류가 발생했습니다. 다시 시도해주세요.',

    // Guess list
    myGuesses: '내 추측',
    timesUnit: '회',
    noGuessesYet: '아직 추측이 없습니다. 첫 번째 국가를 입력해보세요!',
    hintBasicDirection: '💡 힌트: 기본적으로 <strong>방향</strong>만 표시됩니다. 광고를 시청하면 <strong>거리와 유사도(%)</strong>를 볼 수 있어요!',

    // Success modal
    correct: '🎉 정답입니다! 🎉',
    congratulations: '축하합니다!',
    youGuessed: '을(를) 맞혔습니다!',
    copyResults: '결과 복사하기',
    copied: '복사 완료!',
    copyFailed: '복사 실패!',
    closeModal: '모달 닫기',

    // Results clipboard
    todaysAnswer: '오늘의 정답',
    myGuessResult: '나의 추측',
    successIn: '번만에 성공!',

    // Instructions modal
    instructionsTitle: '어떻게 플레이하나요?',
    instruction1: '매일 새로운 국가가 오늘의 정답으로 선정됩니다. 당신의 목표는 이 정답 국가를 추측하는 것입니다.',
    instruction2: '입력창에 국가 이름을 입력하고 "추측하기" 버튼을 누르면, 시스템은 당신이 입력한 국가와 정답 국가 사이의 **거리(km)**와 **방향(화살표)**을 계산하여 리스트로 보여줍니다.',
    instruction3: '정답에 가까워질수록 리스트의 항목 색깔이 붉게 변하며 유사도를 %로 표시합니다.',
    instruction4: '추측 기록은 매일 자정(00시)에 초기화됩니다. 그 전까지는 페이지를 새로고침해도 기록이 유지됩니다.',
    instruction5: '"북한"과 "조선민주주의인민공화국"처럼 여러 이름으로 불리는 국가들은 모두 같은 국가로 인식됩니다.',
    closeButton: '닫기',
    closeDescription: '설명 닫기',

    // Map
    answer: '정답',

    // GameStats
    myStats: '📊 나의 통계',
    totalPlays: '총 플레이',
    successfulGames: '성공한 게임',
    averageGuesses: '평균 추측 횟수',
    currentStreak: '연속 성공',
    bestStreakLabel: '최고 연속 기록',
    streakUnit: '회',

    // HintSystem
    hintSystem: '🎁 힌트 시스템',
    adsWatched: '광고 시청 횟수',
    watchAdContinent: '🌍 광고 보고 대륙 힌트 받기',
    watchAdDistance: '📏 광고 보고 거리 정보 받기',
    allHintsUnlocked: '✅ 모든 힌트 해금 완료!',
    noHintsYet: '광고를 시청하고 힌트를 받아보세요!',
    supportDev: '💡 광고 시청으로 게임 개발을 지원해주세요!',
    continentHintUnlocked: '🎉 대륙 힌트가 해금되었습니다!',
    distanceHintUnlocked: '🎉 거리 정보 힌트가 해금되었습니다! 이제 모든 추측에서 거리와 유사도(%)를 볼 수 있습니다.',
    adLoadFailed: '광고를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',

    // Hints (hints.js)
    continentHintMsg: (continent) => `🌍 대륙 힌트: 정답 국가는 <strong>${continent}</strong>에 위치해 있습니다!`,
    distanceHintNoGuess: '📏 거리 정보 힌트: 아직 추측이 없습니다. 먼저 국가를 추측해보세요!',
    distanceHintMsg: (name, distance, similarity) =>
      `📏 거리 정보 힌트: 이제 모든 추측에서 <strong>거리와 유사도(%)</strong>를 볼 수 있습니다! 가장 가까운 추측은 <strong>${name}</strong> (${distance}km, ${similarity}%)입니다.`,

    // YesterdayAnswer
    yesterdayAnswer: '📅 어제의 정답',
    myGuessCount: '나의 추측 횟수',
    guessCountUnit: '번',

    // RecentArchive
    recentArchive: '📜 최근 7일 기록',
    guessUnit: '회',

    // Continent names
    continentAsia: '아시아',
    continentEurope: '유럽',
    continentAfrica: '아프리카',
    continentNorthAmerica: '북아메리카',
    continentSouthAmerica: '남아메리카',
    continentOceania: '오세아니아',
    continentUnknown: '알 수 없음',
  },

  en: {
    // Header
    howToPlay: 'How to play?',

    // Input
    inputPlaceholder: 'Enter a country name...',
    searching: 'Searching...',
    guessButton: 'Guess',

    // Errors
    enterCountryName: 'Please enter a country name.',
    countryNotFound: 'Country not found. Please try another country.',
    geocodingError: 'An error occurred while searching. Please try again.',

    // Guess list
    myGuesses: 'My Guesses',
    timesUnit: '',
    noGuessesYet: 'No guesses yet. Try entering your first country!',
    hintBasicDirection: '💡 Hint: By default, only the <strong>direction</strong> is shown. Watch an ad to unlock <strong>distance and similarity (%)</strong>!',

    // Success modal
    correct: '🎉 Correct! 🎉',
    congratulations: 'Congratulations!',
    youGuessed: ' was the answer!',
    copyResults: 'Copy Results',
    copied: 'Copied!',
    copyFailed: 'Copy Failed!',
    closeModal: 'Close modal',

    // Results clipboard
    todaysAnswer: "Today's Answer",
    myGuessResult: 'My Guesses',
    successIn: ' guesses to solve!',

    // Instructions modal
    instructionsTitle: 'How to Play?',
    instruction1: 'Every day, a new country is selected as the answer. Your goal is to guess this country.',
    instruction2: 'Enter a country name and click "Guess". The system will calculate the **distance (km)** and **direction (arrow)** between your guess and the answer country.',
    instruction3: 'The closer your guess, the higher the similarity percentage and the redder the color.',
    instruction4: 'Your guesses reset every day at midnight. Until then, your progress is saved even if you refresh the page.',
    instruction5: 'Countries with multiple names (e.g., "North Korea" and "DPRK") are recognized as the same country.',
    closeButton: 'Close',
    closeDescription: 'Close instructions',

    // Map
    answer: 'Answer',

    // GameStats
    myStats: '📊 My Stats',
    totalPlays: 'Total Plays',
    successfulGames: 'Wins',
    averageGuesses: 'Avg. Guesses',
    currentStreak: 'Current Streak',
    bestStreakLabel: 'Best Streak',
    streakUnit: '',

    // HintSystem
    hintSystem: '🎁 Hint System',
    adsWatched: 'Ads Watched',
    watchAdContinent: '🌍 Watch ad for continent hint',
    watchAdDistance: '📏 Watch ad for distance info',
    allHintsUnlocked: '✅ All hints unlocked!',
    noHintsYet: 'Watch an ad to unlock hints!',
    supportDev: '💡 Support game development by watching ads!',
    continentHintUnlocked: '🎉 Continent hint unlocked!',
    distanceHintUnlocked: '🎉 Distance hint unlocked! You can now see distance and similarity (%) for all guesses.',
    adLoadFailed: 'Failed to load ad. Please try again later.',

    // Hints (hints.js)
    continentHintMsg: (continent) => `🌍 Continent Hint: The answer country is in <strong>${continent}</strong>!`,
    distanceHintNoGuess: '📏 Distance Hint: No guesses yet. Try guessing a country first!',
    distanceHintMsg: (name, distance, similarity) =>
      `📏 Distance Hint: You can now see <strong>distance and similarity (%)</strong> for all guesses! Closest guess: <strong>${name}</strong> (${distance}km, ${similarity}%)`,

    // YesterdayAnswer
    yesterdayAnswer: "📅 Yesterday's Answer",
    myGuessCount: 'My guess count',
    guessCountUnit: '',

    // RecentArchive
    recentArchive: '📜 Last 7 Days',
    guessUnit: '',

    // Continent names
    continentAsia: 'Asia',
    continentEurope: 'Europe',
    continentAfrica: 'Africa',
    continentNorthAmerica: 'North America',
    continentSouthAmerica: 'South America',
    continentOceania: 'Oceania',
    continentUnknown: 'Unknown',
  },
};

export default translations;
