// Game epoch: Feb 3, 2026 = Day 1
const GAME_START = new Date(2026, 1, 3);

export function getGameDayNumber(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(GAME_START.getFullYear(), GAME_START.getMonth(), GAME_START.getDate());
  return Math.floor((d - s) / (1000 * 60 * 60 * 24)) + 1;
}

export function similarityToEmoji(similarity) {
  const sim = parseFloat(similarity);
  if (sim >= 100) return '🟩';
  if (sim >= 90) return '🟥';
  if (sim >= 70) return '🟧';
  if (sim >= 50) return '🟨';
  return '⬛';
}
