import { TITLE_RANGES } from "./progressionConfig";

/**
 * Maps a 1-indexed Ascension level to its title string.
 * Pure function — returns "Reader" as the safe fallback for any
 * out-of-range input.
 */
export function titleFromLevel(level: number): string {
  for (const range of TITLE_RANGES) {
    if (level >= range.minLevel && level <= range.maxLevel) {
      return range.title;
    }
  }
  return "Reader";
}
