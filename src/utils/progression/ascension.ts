import { LEVEL_THRESHOLDS, MAX_LEVEL } from "./progressionConfig";

export interface AscensionResult {
  /** Current level, 1-indexed (1 = level I, 35 = level XXXV). */
  level: number;
  /** Archive required to reach the current level. */
  currentThreshold: number;
  /**
   * Archive required to reach the next level.
   * Equal to currentThreshold when already at MAX_LEVEL (no further progress).
   */
  nextThreshold: number;
  /**
   * Progress fraction within the current level, in [0, 1].
   * 1.0 when at MAX_LEVEL.
   */
  progressFraction: number;
}

/**
 * Maps a total Archive value to the current Ascension level and
 * progress within that level. Pure function — no side effects.
 */
export function ascensionFromArchive(totalArchive: number): AscensionResult {
  const archive = Math.max(0, totalArchive);

  // Find the highest level whose threshold the reader has met or exceeded
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (archive >= LEVEL_THRESHOLDS[i]) {
      level = i + 1; // thresholds are 0-indexed; levels are 1-indexed
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1];

  if (level >= MAX_LEVEL) {
    return {
      level: MAX_LEVEL,
      currentThreshold,
      nextThreshold: currentThreshold,
      progressFraction: 1,
    };
  }

  const nextThreshold = LEVEL_THRESHOLDS[level];
  const span = nextThreshold - currentThreshold;
  const progressFraction =
    span > 0 ? (archive - currentThreshold) / span : 0;

  return {
    level,
    currentThreshold,
    nextThreshold,
    progressFraction: Math.min(1, Math.max(0, progressFraction)),
  };
}

/**
 * Converts a 1-indexed level number to its Roman numeral string.
 * Supports 1–35 (the full Ascension range).
 */
export function toRomanNumeral(n: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let remaining = Math.max(1, Math.min(n, 35));
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}
