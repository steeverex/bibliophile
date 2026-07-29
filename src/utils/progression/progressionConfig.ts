// ── Progression Configuration ────────────────────────────────────────────────
//
// Single source of truth for all reader progression tuning.
// Weights, thresholds, title ranges, and CSS token names are all defined here.
// Nothing in UI components or calculation logic should hardcode these values.
//
// Progression configuration is kept together so scoring and titles share one source.
// regardless of future additions (prestige ranks, seasonal events, etc.).

// ── Activity weights ─────────────────────────────────────────────────────────

export interface ArchiveWeights {
  /** Archive points awarded per page read (derived from percentage × book.page). */
  pageRead: number;
  /**
   * Archive points awarded per chapter completed.
   * Currently a no-op: the app does not yet persist per-chapter completion events.
   * Tracked here so it becomes a one-line activation once the data is available.
   */
  chapterCompleted: number;
  /** Archive points awarded when a book is marked finished. */
  bookFinished: number;
  /** Archive points awarded per highlight created. */
  highlightCreated: number;
  /** Archive points awarded per note created. */
  noteCreated: number;
}

export const ARCHIVE_WEIGHTS: ArchiveWeights = {
  pageRead: 1,
  chapterCompleted: 0, // not yet activated — see comment above
  bookFinished: 500,
  highlightCreated: 10,
  noteCreated: 25,
};

// ── Finished-book threshold ───────────────────────────────────────────────────
//
// A book is considered "finished" when its saved reading position percentage
// exceeds this value. Stored here (not inline in loading logic) so the
// definition of "finished" can be tuned independently of everything else.
//
// 0.99 rather than 0.95: a reader who quits five pages before the end of a
// 100-page book has not finished it. 99% is the cleanest approximation when
// the app cannot reliably detect the final page.

export const BOOK_FINISHED_THRESHOLD = 0.99;

// ── Ascension level thresholds ────────────────────────────────────────────────
//
// LEVEL_THRESHOLDS[i] is the total Archive required to *reach* level (i + 1).
// Index 0 → level 1 requires 0 Archive (starting point).
// 35 entries = levels I through XXXV.

export const LEVEL_THRESHOLDS: readonly number[] = [
       0,     // I
    1_000,    // II
    2_500,    // III
    5_000,    // IV
    9_000,    // V
   14_000,    // VI
   20_000,    // VII
   28_000,    // VIII
   38_000,    // IX
   50_000,    // X
   65_000,    // XI
   83_000,    // XII
  104_000,    // XIII
  128_000,    // XIV
  156_000,    // XV
  188_000,    // XVI
  225_000,    // XVII
  267_000,    // XVIII
  315_000,    // XIX
  370_000,    // XX
  432_000,    // XXI
  502_000,    // XXII
  581_000,    // XXIII
  670_000,    // XXIV
  770_000,    // XXV
  882_000,    // XXVI
1_007_000,    // XXVII
1_146_000,    // XXVIII
1_300_000,    // XXIX
1_470_000,    // XXX
1_658_000,    // XXXI
1_865_000,    // XXXII
2_092_000,    // XXXIII
2_340_000,    // XXXIV
2_610_000,    // XXXV
] as const;

export const MAX_LEVEL = LEVEL_THRESHOLDS.length; // 35

// ── Title definitions ─────────────────────────────────────────────────────────

export interface TitleRange {
  minLevel: number;
  maxLevel: number;
  title: string;
}

export const TITLE_RANGES: readonly TitleRange[] = [
  { minLevel:  1, maxLevel:  4, title: "Reader"          },
  { minLevel:  5, maxLevel:  9, title: "Seeker"          },
  { minLevel: 10, maxLevel: 14, title: "Wanderer"        },
  { minLevel: 15, maxLevel: 19, title: "Awakened"        },
  { minLevel: 20, maxLevel: 24, title: "Celestial"       },
  { minLevel: 25, maxLevel: 29, title: "Empyrean"        },
  { minLevel: 30, maxLevel: 34, title: "Singularity"     },
  { minLevel: 35, maxLevel: 35, title: "The Last Reader" },
] as const;

// ── Title CSS token names ─────────────────────────────────────────────────────
//
// Maps each title to a CSS custom property name (without the `--` prefix).
// CSS owns the actual color values via :root in stats.css.
// TypeScript only knows the token name, not the color — presentation stays
// entirely in the stylesheet.

export const TITLE_CSS_TOKENS: Readonly<Record<string, string>> = {
  "Reader":          "title-reader",
  "Seeker":          "title-seeker",
  "Wanderer":        "title-wanderer",
  "Awakened":        "title-awakened",
  "Celestial":       "title-celestial",
  "Empyrean":        "title-empyrean",
  "Singularity":     "title-singularity",
  "The Last Reader": "title-last-reader",
} as const;
