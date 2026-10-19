/**
 * LocalStorage utilities for GameZone persistent states:
 * - Best scores per game
 * - Favorites
 * - Recently played games
 */

export interface GameScoreRecord {
  score: number;
  secondary?: string; // e.g. "98% Acc" or "5 turns"
  achievedAt: number;
}

const STORAGE_KEYS = {
  BEST_SCORES: 'gamezone_best_scores',
  FAVORITES: 'gamezone_favorites',
  RECENTLY_PLAYED: 'gamezone_recently_played',
};

// Best Scores
export function getBestScore(gameId: string): GameScoreRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BEST_SCORES);
    if (!raw) return null;
    const scores = JSON.parse(raw);
    return scores[gameId] || null;
  } catch {
    return null;
  }
}

export function saveBestScore(gameId: string, score: number, secondary?: string, lowerIsBetter = false): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BEST_SCORES);
    const scores = raw ? JSON.parse(raw) : {};
    const existing = scores[gameId] as GameScoreRecord | undefined;

    let isNewBest = false;
    if (!existing) {
      isNewBest = true;
    } else if (lowerIsBetter) {
      isNewBest = score < existing.score;
    } else {
      isNewBest = score > existing.score;
    }

    if (isNewBest) {
      scores[gameId] = {
        score,
        secondary,
        achievedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEYS.BEST_SCORES, JSON.stringify(scores));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Favorites
export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(gameId: string): boolean {
  try {
    const favs = getFavorites();
    const idx = favs.indexOf(gameId);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push(gameId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('gamezone:favorites-changed', { detail: favs }));
    return isFav;
  } catch {
    return false;
  }
}

export function isFavorite(gameId: string): boolean {
  return getFavorites().includes(gameId);
}

// Recently Played
export interface RecentGame {
  gameId: string;
  playedAt: number;
}

export function getRecentlyPlayed(): RecentGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordPlayed(gameId: string): void {
  try {
    const recents = getRecentlyPlayed().filter((r) => r.gameId !== gameId);
    recents.unshift({ gameId, playedAt: Date.now() });
    const trimmed = recents.slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('gamezone:recent-changed', { detail: trimmed }));
  } catch {
    // storage fallback
  }
}
