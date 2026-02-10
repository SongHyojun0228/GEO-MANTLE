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

// 오늘의 정답 숫자 (1~9999)
export function getDailyNumber(date = new Date()) {
  const seed = dateToSeed(date);
  const random = seededRandom(seed + 7777); // offset for variety
  return Math.floor(random * 9999) + 1;
}

// 유사도 계산: ((9998 - |guess - answer|) / 9998) * 100
export function calculateSimilarity(guess, answer) {
  const diff = Math.abs(guess - answer);
  const similarity = ((9998 - diff) / 9998) * 100;
  return Math.max(0, similarity);
}

// 소수 판별
export function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// 숫자 속성 (힌트용)
export function getNumberProperties(n) {
  return {
    isEven: n % 2 === 0,
    digits: n.toString().length,
    isPrime: isPrime(n),
    divisibleBy3: n % 3 === 0,
    divisibleBy5: n % 5 === 0,
    divisibleBy7: n % 7 === 0,
    range: Math.floor((n - 1) / 1000) * 1000 + 1, // 1~1000, 1001~2000, etc.
  };
}
