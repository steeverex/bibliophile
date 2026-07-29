import { ARCHIVE_WEIGHTS, ArchiveWeights } from "./progressionConfig";

export interface RawActivity {
  pagesRead: number;
  booksFinished: number;
  highlightsCreated: number;
  notesCreated: number;
  /**
   * Chapters completed. Currently always 0 — the app does not yet persist
   * per-chapter completion events. The weight exists in ARCHIVE_WEIGHTS
   * (set to 0) so activating this is a one-line change once the data exists.
   */
  chaptersCompleted: number;
}

/**
 * Computes total Archive points from raw reading activity.
 * Pure function — no I/O, no side effects, no UI knowledge.
 *
 * @param activity  Raw counts derived from the data layer.
 * @param weights   Defaults to ARCHIVE_WEIGHTS from progressionConfig.
 *                  Pass a custom object only in tests.
 */
export function computeTotalArchive(
  activity: RawActivity,
  weights: ArchiveWeights = ARCHIVE_WEIGHTS
): number {
  return (
    activity.pagesRead        * weights.pageRead        +
    activity.chaptersCompleted * weights.chapterCompleted +
    activity.booksFinished     * weights.bookFinished     +
    activity.highlightsCreated * weights.highlightCreated +
    activity.notesCreated      * weights.noteCreated
  );
}
