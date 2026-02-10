import { animals } from '../data/animals';

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

// 오늘의 정답 동물
export function getDailyAnimal(date = new Date()) {
  const seed = dateToSeed(date);
  const random = seededRandom(seed + 8888);
  const index = Math.floor(random * animals.length);
  return animals[index];
}

// 이름으로 동물 찾기 (한국어/영어/별칭)
export function findAnimalByName(input) {
  const normalized = input.trim().toLowerCase();
  return animals.find(
    (a) =>
      a.name === normalized ||
      a.name.toLowerCase() === normalized ||
      a.englishName.toLowerCase() === normalized ||
      a.aliases.some((alias) => alias.toLowerCase() === normalized)
  );
}

// 속성 기반 유사도 계산 (0~100)
export function calculateAnimalSimilarity(guess, answer) {
  let score = 0;

  // class (25점)
  if (guess.class === answer.class) score += 25;

  // diet (15점)
  if (guess.diet === answer.diet) score += 15;

  // legs (15점)
  if (guess.legs === answer.legs) score += 15;

  // habitat (15점)
  if (guess.habitat === answer.habitat) score += 15;

  // size (10점)
  if (guess.size === answer.size) score += 10;

  // continent (10점) — 하나라도 겹치면 만점
  const guessContinent = new Set(guess.continent);
  const hasOverlap = answer.continent.some((c) => guessContinent.has(c));
  if (hasOverlap) score += 10;

  // active (10점)
  if (guess.active === answer.active) score += 10;

  return score;
}
