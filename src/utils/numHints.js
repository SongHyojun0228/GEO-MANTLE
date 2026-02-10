import { getNumberProperties } from './numGame';
import translations from '../i18n/translations';

// 5단계 힌트 정의
// 1: 짝수/홀수 (광고 1회)
// 2: 자릿수 (광고 2회)
// 3: 소수 여부 (광고 3회)
// 4: 3,5,7로 나눠지는지 (광고 4회)
// 5: 1000 구간 범위 (광고 5회)

export const NUM_HINT_LEVELS = [
  { id: 'evenOdd', adsRequired: 1 },
  { id: 'digits', adsRequired: 2 },
  { id: 'prime', adsRequired: 3 },
  { id: 'divisibility', adsRequired: 4 },
  { id: 'range', adsRequired: 5 },
];

export function getUnlockedNumHintIds(adsWatchedCount) {
  return NUM_HINT_LEVELS
    .filter((h) => adsWatchedCount >= h.adsRequired)
    .map((h) => h.id);
}

export function numAdsNeededForNextHint(adsWatchedCount) {
  const next = NUM_HINT_LEVELS.find((h) => adsWatchedCount < h.adsRequired);
  if (!next) return { needed: 0, hintId: null };
  return { needed: next.adsRequired - adsWatchedCount, hintId: next.id };
}

export function generateNumHints(answer, unlockedIds, lang = 'ko') {
  const t = translations[lang];
  const props = getNumberProperties(answer);
  const hints = [];

  if (unlockedIds.includes('evenOdd')) {
    hints.push({
      id: 'evenOdd',
      message: props.isEven ? t.numHintEven : t.numHintOdd,
    });
  }

  if (unlockedIds.includes('digits')) {
    hints.push({
      id: 'digits',
      message: t.numHintDigits(props.digits),
    });
  }

  if (unlockedIds.includes('prime')) {
    hints.push({
      id: 'prime',
      message: props.isPrime ? t.numHintIsPrime : t.numHintNotPrime,
    });
  }

  if (unlockedIds.includes('divisibility')) {
    const divs = [];
    if (props.divisibleBy3) divs.push('3');
    if (props.divisibleBy5) divs.push('5');
    if (props.divisibleBy7) divs.push('7');
    hints.push({
      id: 'divisibility',
      message: divs.length > 0
        ? t.numHintDivisible(divs.join(', '))
        : t.numHintNotDivisible,
    });
  }

  if (unlockedIds.includes('range')) {
    const rangeStart = props.range;
    const rangeEnd = Math.min(rangeStart + 999, 9999);
    hints.push({
      id: 'range',
      message: t.numHintRange(rangeStart, rangeEnd),
    });
  }

  return hints;
}
