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
    toggleWorldMaps: '세계지도 보기',

    // Success modal
    correct: '🎉 정답입니다! 🎉',
    congratulations: '축하합니다!',
    youGuessed: '을(를) 맞혔습니다!',
    copyResults: '결과 복사하기',
    copied: '복사 완료!',
    copyFailed: '복사 실패!',
    closeModal: '모달 닫기',
    guessCountResult: '번만에 정답!',

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

    // Privacy Policy
    privacyPolicy: '개인정보처리방침',
    privacyIntro: 'Geo-Mantle(이하 "서비스")는 이용자의 개인정보를 중요하게 생각하며, 아래와 같이 개인정보처리방침을 안내합니다.',
    privacySection1Title: '1. 수집하는 개인정보',
    privacySection1Content: '본 서비스는 별도의 회원가입 없이 이용 가능하며, 서버에 개인정보를 저장하지 않습니다. 게임 진행 데이터(추측 기록, 통계, 언어 설정 등)는 사용자의 브라우저 localStorage에만 저장되며, 외부로 전송되지 않습니다.',
    privacySection2Title: '2. 광고 서비스',
    privacySection2Content: '본 서비스는 Google AdSense 및 Adinplay를 통해 광고를 제공할 수 있습니다. 이 과정에서 광고 제공업체가 쿠키를 사용하여 사용자의 관심사 기반 광고를 표시할 수 있습니다. 자세한 내용은 Google 개인정보처리방침(https://policies.google.com/privacy)을 참고하세요.',
    privacySection3Title: '3. 분석 서비스',
    privacySection3Content: '본 서비스는 Vercel Analytics를 사용하여 익명화된 방문 통계를 수집합니다. 이는 서비스 개선 목적으로만 사용되며, 개인을 식별할 수 있는 정보는 수집하지 않습니다.',
    privacySection4Title: '4. 쿠키 사용',
    privacySection4Content: '본 서비스는 자체적으로 쿠키를 사용하지 않습니다. 다만, 광고 및 분석 서비스 제공업체가 쿠키를 사용할 수 있습니다.',
    privacySection5Title: '5. 문의',
    privacySection5Content: '개인정보 관련 문의사항은 GitHub 저장소의 Issues를 통해 연락해주세요.',
    privacyLastUpdated: '최종 수정일: 2025년 6월',

    // Continent names
    continentAsia: '아시아',
    continentEurope: '유럽',
    continentAfrica: '아프리카',
    continentNorthAmerica: '북아메리카',
    continentSouthAmerica: '남아메리카',
    continentOceania: '오세아니아',
    continentUnknown: '알 수 없음',

    // NumMantle
    numInputPlaceholder: '1~9999 사이의 숫자를 입력하세요...',
    numEnterNumber: '숫자를 입력해주세요.',
    numRangeError: '1에서 9999 사이의 숫자를 입력해주세요.',
    numNoGuessesYet: '아직 추측이 없습니다. 첫 번째 숫자를 입력해보세요!',
    numYouGuessed: '이(가) 정답이었습니다!',
    numTodaysAnswer: '오늘의 정답',
    numWatchAdHint: '광고 보고 힌트 받기',

    // NumMantle Instructions
    numInstructionsTitle: 'NumMantle 게임 방법',
    numInstruction1: '매일 1~9999 사이의 새로운 숫자가 정답으로 선정됩니다. 목표는 이 숫자를 맞히는 것입니다.',
    numInstruction2: '숫자를 입력하면 정답과의 **유사도(%)**가 표시됩니다. 유사도는 입력한 숫자와 정답의 차이를 기반으로 계산됩니다. 예를 들어 정답이 5000일 때 4900을 입력하면 약 99.0%, 1을 입력하면 약 50.0%가 됩니다. 유사도가 높을수록 정답에 가깝다는 뜻입니다.',
    numInstruction3: '이 게임은 higher/lower(높다/낮다) 힌트를 제공하지 않습니다. 오직 유사도(%)만으로 정답을 추론해야 합니다.',
    numInstruction4: '광고를 시청하면 짝수/홀수, 자릿수, 소수 여부, 나눗셈 속성, 범위 등 총 5단계의 힌트를 해금할 수 있습니다.',
    numInstruction5: '추측 기록은 매일 자정에 초기화됩니다.',

    // NumMantle Hints
    numHintEven: '짝수입니다.',
    numHintOdd: '홀수입니다.',
    numHintDigits: (d) => `${d}자리 수입니다.`,
    numHintIsPrime: '소수입니다.',
    numHintNotPrime: '소수가 아닙니다.',
    numHintDivisible: (divs) => `${divs}(으)로 나누어집니다.`,
    numHintNotDivisible: '3, 5, 7 어느 것으로도 나누어지지 않습니다.',
    numHintRange: (start, end) => `${start} ~ ${end} 범위에 있습니다.`,

    // AnimalMantle
    animalInputPlaceholder: '동물 이름을 입력하세요...',
    animalEnterName: '동물 이름을 입력해주세요.',
    animalNotFound: '입력하신 동물을 찾을 수 없습니다. 다른 동물을 시도해주세요.',
    animalNoGuessesYet: '아직 추측이 없습니다. 첫 번째 동물을 입력해보세요!',
    animalYouGuessed: '이(가) 정답이었습니다!',
    animalTodaysAnswer: '오늘의 정답',
    animalWatchAdHint: '광고 보고 힌트 받기',

    // AnimalMantle Instructions
    animalInstructionsTitle: 'AnimalMantle 게임 방법',
    animalInstruction1: '매일 새로운 동물이 정답으로 선정됩니다. 목표는 이 동물을 맞히는 것입니다.',
    animalInstruction2: '동물 이름을 입력하면 정답 동물과의 **속성 유사도(%)**가 표시됩니다. 유사도는 분류, 식성, 다리 수, 서식지, 크기, 대륙, 활동시간 등 7가지 속성을 비교하여 계산됩니다.',
    animalInstruction3: '유사도가 높을수록 정답 동물과 비슷한 속성을 가진 동물이라는 뜻입니다.',
    animalInstruction4: '광고를 시청하면 분류, 서식지, 식성, 대륙, 크기 등 총 5단계의 힌트를 해금할 수 있습니다.',
    animalInstruction5: '추측 기록은 매일 자정에 초기화됩니다.',

    // AnimalMantle Hints
    animalHintClass: (cls) => `🐾 분류 힌트: 정답 동물은 ${cls}입니다.`,
    animalHintHabitat: (hab) => `🏠 서식지 힌트: 정답 동물은 ${hab}에 삽니다.`,
    animalHintDiet: (diet) => `🍽️ 식성 힌트: 정답 동물은 ${diet}입니다.`,
    animalHintContinent: (cont) => `🌍 대륙 힌트: 정답 동물은 ${cont}에 서식합니다.`,
    animalHintSize: (size) => `📏 크기 힌트: 정답 동물은 ${size}입니다.`,

    // FranchiseMantle
    franchiseInputPlaceholder: '프랜차이즈 이름을 입력하세요...',
    franchiseEnterName: '프랜차이즈 이름을 입력해주세요.',
    franchiseNotFound: '입력하신 프랜차이즈를 찾을 수 없습니다. 다른 프랜차이즈를 시도해주세요.',
    franchiseNoGuessesYet: '아직 추측이 없습니다. 첫 번째 프랜차이즈를 입력해보세요!',
    franchiseYouGuessed: '이(가) 정답이었습니다!',
    franchiseTodaysAnswer: '오늘의 정답',
    franchiseWatchAdHint: '광고 보고 힌트 받기',

    // FranchiseMantle Instructions
    franchiseInstructionsTitle: 'FranchiseMantle 게임 방법',
    franchiseInstruction1: '매일 새로운 한국 프랜차이즈가 정답으로 선정됩니다. 목표는 이 프랜차이즈를 맞히는 것입니다.',
    franchiseInstruction2: '프랜차이즈 이름을 입력하면 정답과의 **속성 유사도(%)**가 표시됩니다. 유사도는 업종(80점), 규모(10점), 가격대(10점) 3가지 속성을 비교하여 계산됩니다.',
    franchiseInstruction3: '각 추측에서 업종/규모/가격대가 정답과 일치하면 초록색, 불일치하면 회색으로 표시됩니다.',
    franchiseInstruction4: '광고를 시청하면 업종, 가격대, 규모 등 총 3단계의 힌트를 해금할 수 있습니다.',
    franchiseInstruction5: '추측 기록은 매일 자정에 초기화됩니다.',

    // FranchiseMantle Hints
    franchiseHintCategory: (cat) => `🏪 업종 힌트: 정답 프랜차이즈의 업종은 ${cat}입니다.`,
    franchiseHintPrice: (price) => `💰 가격대 힌트: 정답 프랜차이즈의 가격대는 ${price}가입니다.`,
    franchiseHintSize: (size) => `📏 규모 힌트: 정답 프랜차이즈의 규모는 ${size}입니다.`,

    // Unlimited Mode
    unlimitedModeContinue: '무한 모드로 계속 플레이',
    unlimitedModeNext: '다음 문제',
    unlimitedModeLabel: '연습',
    unlimitedModeActive: '무한 모드 진행 중',
    unlimitedBackToDaily: '오늘의 문제로 돌아가기',
    unlimitedPractice: '연습',
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
    toggleWorldMaps: 'World Maps',

    // Success modal
    correct: '🎉 Correct! 🎉',
    congratulations: 'Congratulations!',
    youGuessed: ' was the answer!',
    copyResults: 'Copy Results',
    copied: 'Copied!',
    copyFailed: 'Copy Failed!',
    closeModal: 'Close modal',
    guessCountResult: ' guesses to solve!',

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

    // Privacy Policy
    privacyPolicy: 'Privacy Policy',
    privacyIntro: 'Geo-Mantle ("the Service") values your privacy. This policy explains how we handle your information.',
    privacySection1Title: '1. Information We Collect',
    privacySection1Content: 'This service does not require registration and does not store any personal data on our servers. Game data (guess history, statistics, language preferences, etc.) is stored only in your browser\'s localStorage and is never transmitted externally.',
    privacySection2Title: '2. Advertising',
    privacySection2Content: 'This service may display ads through Google AdSense and Adinplay. These advertising partners may use cookies to show interest-based ads. For more details, see Google\'s Privacy Policy (https://policies.google.com/privacy).',
    privacySection3Title: '3. Analytics',
    privacySection3Content: 'This service uses Vercel Analytics to collect anonymized visit statistics for service improvement purposes only. No personally identifiable information is collected.',
    privacySection4Title: '4. Cookies',
    privacySection4Content: 'This service does not use cookies directly. However, advertising and analytics providers may use cookies.',
    privacySection5Title: '5. Contact',
    privacySection5Content: 'For privacy-related inquiries, please contact us through the GitHub repository Issues page.',
    privacyLastUpdated: 'Last updated: June 2025',

    // Continent names
    continentAsia: 'Asia',
    continentEurope: 'Europe',
    continentAfrica: 'Africa',
    continentNorthAmerica: 'North America',
    continentSouthAmerica: 'South America',
    continentOceania: 'Oceania',
    continentUnknown: 'Unknown',

    // NumMantle
    numInputPlaceholder: 'Enter a number between 1 and 9999...',
    numEnterNumber: 'Please enter a number.',
    numRangeError: 'Please enter a number between 1 and 9999.',
    numNoGuessesYet: 'No guesses yet. Try entering your first number!',
    numYouGuessed: ' was the answer!',
    numTodaysAnswer: "Today's Answer",
    numWatchAdHint: 'Watch ad for hint',

    // NumMantle Instructions
    numInstructionsTitle: 'How to Play NumMantle',
    numInstruction1: 'Every day, a new number between 1 and 9999 is selected as the answer. Your goal is to guess this number.',
    numInstruction2: 'When you enter a number, the **similarity (%)** to the answer is shown. Similarity is calculated based on the difference between your guess and the answer. For example, if the answer is 5000, guessing 4900 gives ~99.0%, while guessing 1 gives ~50.0%. Higher similarity means you are closer to the answer.',
    numInstruction3: 'This game does NOT tell you higher/lower. You must deduce the answer using only the similarity percentage.',
    numInstruction4: 'Watch ads to unlock up to 5 hint levels: even/odd, number of digits, prime status, divisibility, and range.',
    numInstruction5: 'Your guesses reset every day at midnight.',

    // NumMantle Hints
    numHintEven: 'The number is even.',
    numHintOdd: 'The number is odd.',
    numHintDigits: (d) => `The number has ${d} digit(s).`,
    numHintIsPrime: 'The number is prime.',
    numHintNotPrime: 'The number is not prime.',
    numHintDivisible: (divs) => `Divisible by ${divs}.`,
    numHintNotDivisible: 'Not divisible by 3, 5, or 7.',
    numHintRange: (start, end) => `The number is in the range ${start} ~ ${end}.`,

    // AnimalMantle
    animalInputPlaceholder: 'Enter an animal name...',
    animalEnterName: 'Please enter an animal name.',
    animalNotFound: 'Animal not found. Please try another animal.',
    animalNoGuessesYet: 'No guesses yet. Try entering your first animal!',
    animalYouGuessed: ' was the answer!',
    animalTodaysAnswer: "Today's Answer",
    animalWatchAdHint: 'Watch ad for hint',

    // AnimalMantle Instructions
    animalInstructionsTitle: 'How to Play AnimalMantle',
    animalInstruction1: 'Every day, a new animal is selected as the answer. Your goal is to guess this animal.',
    animalInstruction2: 'When you enter an animal name, the **attribute similarity (%)** to the answer is shown. Similarity is calculated by comparing 7 attributes: class, diet, legs, habitat, size, continent, and activity.',
    animalInstruction3: 'Higher similarity means the guessed animal shares more attributes with the answer.',
    animalInstruction4: 'Watch ads to unlock up to 5 hint levels: class, habitat, diet, continent, and size.',
    animalInstruction5: 'Your guesses reset every day at midnight.',

    // AnimalMantle Hints
    animalHintClass: (cls) => `🐾 Class: The answer is a ${cls}.`,
    animalHintHabitat: (hab) => `🏠 Habitat: The answer lives in ${hab}.`,
    animalHintDiet: (diet) => `🍽️ Diet: The answer is ${diet}.`,
    animalHintContinent: (cont) => `🌍 Continent: The answer lives in ${cont}.`,
    animalHintSize: (size) => `📏 Size: The answer is ${size}.`,

    // FranchiseMantle
    franchiseInputPlaceholder: 'Enter a franchise name...',
    franchiseEnterName: 'Please enter a franchise name.',
    franchiseNotFound: 'Franchise not found. Please try another franchise.',
    franchiseNoGuessesYet: 'No guesses yet. Try entering your first franchise!',
    franchiseYouGuessed: ' was the answer!',
    franchiseTodaysAnswer: "Today's Answer",
    franchiseWatchAdHint: 'Watch ad for hint',

    // FranchiseMantle Instructions
    franchiseInstructionsTitle: 'How to Play FranchiseMantle',
    franchiseInstruction1: 'Every day, a new Korean franchise is selected as the answer. Your goal is to guess this franchise.',
    franchiseInstruction2: 'When you enter a franchise name, the **attribute similarity (%)** to the answer is shown. Similarity is calculated by comparing 3 attributes: category (80pts), size (10pts), and price range (10pts).',
    franchiseInstruction3: 'For each guess, matching attributes are shown in green and non-matching ones in gray.',
    franchiseInstruction4: 'Watch ads to unlock up to 3 hint levels: category, price range, and size.',
    franchiseInstruction5: 'Your guesses reset every day at midnight.',

    // FranchiseMantle Hints
    franchiseHintCategory: (cat) => `🏪 Category: The answer's category is ${cat}.`,
    franchiseHintPrice: (price) => `💰 Price: The answer's price range is ${price}.`,
    franchiseHintSize: (size) => `📏 Size: The answer's size is ${size}.`,

    // Unlimited Mode
    unlimitedModeContinue: 'Continue with Unlimited Mode',
    unlimitedModeNext: 'Next Puzzle',
    unlimitedModeLabel: 'Practice',
    unlimitedModeActive: 'Unlimited Mode',
    unlimitedBackToDaily: 'Back to Daily Puzzle',
    unlimitedPractice: 'Practice',
  },
};

export default translations;
