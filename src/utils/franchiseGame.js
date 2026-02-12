import { franchises } from '../data/franchises';

// 날짜 시드 기반 의사 난수 생성
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 날짜를 숫자 시드로 변환
function dateToSeed(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  return year * 10000 + month * 100 + day;
}

// 오늘의 정답 프랜차이즈
export function getDailyFranchise(date = new Date()) {
  const seed = dateToSeed(date);
  const random = seededRandom(seed + 7777);
  const index = Math.floor(random * franchises.length);
  return franchises[index];
}

export function getRandomFranchise() {
  return franchises[Math.floor(Math.random() * franchises.length)];
}

// 이름으로 프랜차이즈 찾기 (한국어/영어/별칭)
export function findFranchiseByName(input) {
  const normalized = input.trim().toLowerCase();
  return franchises.find(
    (f) =>
      f.name === normalized ||
      f.name.toLowerCase() === normalized ||
      f.englishName.toLowerCase() === normalized ||
      f.aliases.some((alias) => alias.toLowerCase() === normalized)
  );
}

// 속성 기반 유사도 계산 (0~100)
export function calculateFranchiseSimilarity(guess, answer) {
  if (guess.name === answer.name) return 100;

  let score = 0;

  // category (80점)
  if (guess.category === answer.category) score += 80;

  // size (10점)
  if (guess.size === answer.size) score += 10;

  // priceRange (10점)
  if (guess.priceRange === answer.priceRange) score += 10;

  return Math.min(score, 99);
}
