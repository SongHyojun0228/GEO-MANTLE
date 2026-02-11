import translations from '../i18n/translations';

// 3단계 힌트 정의
// 1: 업종(category) — 광고 1회
// 2: 가격대(priceRange) — 광고 2회
// 3: 규모(size) — 광고 3회

export const FRANCHISE_HINT_LEVELS = [
  { id: 'category', adsRequired: 1 },
  { id: 'priceRange', adsRequired: 2 },
  { id: 'size', adsRequired: 3 },
];

export function getUnlockedFranchiseHintIds(adsWatchedCount) {
  return FRANCHISE_HINT_LEVELS
    .filter((h) => adsWatchedCount >= h.adsRequired)
    .map((h) => h.id);
}

export function franchiseAdsNeededForNextHint(adsWatchedCount) {
  const next = FRANCHISE_HINT_LEVELS.find((h) => adsWatchedCount < h.adsRequired);
  if (!next) return { needed: 0, hintId: null };
  return { needed: next.adsRequired - adsWatchedCount, hintId: next.id };
}

export function generateFranchiseHints(answer, unlockedIds, lang = 'ko') {
  const t = translations[lang];
  const hints = [];

  if (unlockedIds.includes('category')) {
    hints.push({
      id: 'category',
      message: t.franchiseHintCategory(answer.category),
    });
  }

  if (unlockedIds.includes('priceRange')) {
    hints.push({
      id: 'priceRange',
      message: t.franchiseHintPrice(answer.priceRange),
    });
  }

  if (unlockedIds.includes('size')) {
    hints.push({
      id: 'size',
      message: t.franchiseHintSize(answer.size),
    });
  }

  return hints;
}
