import translations from '../i18n/translations';

// 5단계 힌트 정의
// 1: 분류(class) — 광고 1회
// 2: 서식지(habitat) — 광고 2회
// 3: 식성(diet) — 광고 3회
// 4: 대륙(continent) — 광고 4회
// 5: 크기(size) — 광고 5회

export const ANIMAL_HINT_LEVELS = [
  { id: 'class', adsRequired: 1 },
  { id: 'habitat', adsRequired: 2 },
  { id: 'diet', adsRequired: 3 },
  { id: 'continent', adsRequired: 4 },
  { id: 'size', adsRequired: 5 },
];

export function getUnlockedAnimalHintIds(adsWatchedCount) {
  return ANIMAL_HINT_LEVELS
    .filter((h) => adsWatchedCount >= h.adsRequired)
    .map((h) => h.id);
}

export function animalAdsNeededForNextHint(adsWatchedCount) {
  const next = ANIMAL_HINT_LEVELS.find((h) => adsWatchedCount < h.adsRequired);
  if (!next) return { needed: 0, hintId: null };
  return { needed: next.adsRequired - adsWatchedCount, hintId: next.id };
}

export function generateAnimalHints(answer, unlockedIds, lang = 'ko') {
  const t = translations[lang];
  const hints = [];

  if (unlockedIds.includes('class')) {
    hints.push({
      id: 'class',
      message: t.animalHintClass(answer.class),
    });
  }

  if (unlockedIds.includes('habitat')) {
    hints.push({
      id: 'habitat',
      message: t.animalHintHabitat(answer.habitat),
    });
  }

  if (unlockedIds.includes('diet')) {
    hints.push({
      id: 'diet',
      message: t.animalHintDiet(answer.diet),
    });
  }

  if (unlockedIds.includes('continent')) {
    hints.push({
      id: 'continent',
      message: t.animalHintContinent(answer.continent.join(', ')),
    });
  }

  if (unlockedIds.includes('size')) {
    hints.push({
      id: 'size',
      message: t.animalHintSize(answer.size),
    });
  }

  return hints;
}
