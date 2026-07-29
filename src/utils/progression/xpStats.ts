import Book from "../../models/Book";
import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import { BOOK_FINISHED_THRESHOLD } from "./progressionConfig";

export interface XpStats { totalPagesRead: number; xp: number; booksCompleted: number; currentStreak: number; }
const KEYS = { pages: "profileTotalPagesRead", xp: "profileXp", books: "profileBooksCompleted", migrated: "profileXpMigratedV1" };
const numberConfig = (key: string) => Math.max(0, Number(ConfigService.getReaderConfig(key) || 0) || 0);
const locationPage = (location: { page?: string; count?: string }) => {
  const page = Number(location.page);
  const count = Number(location.count);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
};

export const getXpStats = (): XpStats => ({ totalPagesRead: numberConfig(KEYS.pages), xp: numberConfig(KEYS.xp), booksCompleted: numberConfig(KEYS.books), currentStreak: numberConfig("profileCurrentStreak") });

const save = (stats: XpStats) => {
  ConfigService.setReaderConfig(KEYS.pages, String(stats.totalPagesRead));
  ConfigService.setReaderConfig(KEYS.xp, String(stats.xp));
  ConfigService.setReaderConfig(KEYS.books, String(stats.booksCompleted));
  // Legacy profile fields remain in sync for the existing UI and integrations.
  ConfigService.setReaderConfig("profilePagesRead", String(stats.totalPagesRead));
  ConfigService.setReaderConfig("profileBooksFinished", String(stats.booksCompleted));
};

export const migrateXpStats = (books: Book[]) => {
  const previouslyMigrated = ConfigService.getReaderConfig(KEYS.migrated) === "yes";
  const existing = getXpStats();
  const hasPersistedProgress = books.some((book) => {
    const location = ConfigService.getObjectConfig(book.key, "recordLocation", {}) as { percentage?: string; page?: string; count?: string };
    return (Number(location.percentage) || 0) > 0;
  });
  console.info("[XP] migration check", { previouslyMigrated, existing, bookCount: books.length, hasPersistedProgress });
  // Self-heal an older/partial migration which marked itself complete before
  // populated book records were available.
  if (previouslyMigrated && (existing.totalPagesRead > 0 || !hasPersistedProgress)) return existing;
  let totalPagesRead = 0;
  let booksCompleted = 0;
  books.forEach((book) => {
    const location = ConfigService.getObjectConfig(book.key, "recordLocation", {}) as { percentage?: string; page?: string; count?: string };
    const progress = Math.max(0, Math.min(1, Number(location.percentage) || 0));
    // Some EPUBs do not expose a total page count. Use the persisted reader
    // position when available, then a conservative one-page minimum so real
    // reading never remains permanently invisible in the profile.
    const positionPages = locationPage(location);
    totalPagesRead += book.page > 0 ? Math.floor(progress * book.page) : Math.max(progress > 0 ? 1 : 0, positionPages);
    if (progress >= BOOK_FINISHED_THRESHOLD) booksCompleted++;
  });
  const stats = { totalPagesRead, xp: totalPagesRead * 10 + booksCompleted * 250, booksCompleted, currentStreak: numberConfig("profileCurrentStreak") };
  save(stats);
  ConfigService.setReaderConfig(KEYS.migrated, "yes");
  console.info("[XP] migration completed", stats);
  return stats;
};

/** Persists a renderer location and awards only newly crossed pages/completion. */
export const recordBookProgress = (book: Book, nextLocation: { percentage?: string; page?: string; count?: string; [key: string]: any }) => {
  const previous = ConfigService.getObjectConfig(book.key, "recordLocation", {}) as { percentage?: string; page?: string; count?: string };
  const previousProgress = Math.max(0, Math.min(1, Number(previous.percentage) || 0));
  const nextProgress = Math.max(0, Math.min(1, Number(nextLocation.percentage) || 0));
  ConfigService.setObjectConfig(book.key, nextLocation, "recordLocation");
  if (nextProgress <= previousProgress) {
    console.debug("[XP] progress not awarded", { key: book.key, page: book.page, previousProgress, nextProgress });
    return;
  }
  const previousPage = locationPage(previous);
  const nextPage = locationPage(nextLocation);
  const pageDelta = book.page > 0
    ? Math.max(0, Math.floor(nextProgress * book.page) - Math.floor(previousProgress * book.page))
    : Math.max(1, nextPage - previousPage);
  const completed = previousProgress < BOOK_FINISHED_THRESHOLD && nextProgress >= BOOK_FINISHED_THRESHOLD ? 1 : 0;
  if (!pageDelta && !completed) return;
  const stats = getXpStats();
  save({ ...stats, totalPagesRead: stats.totalPagesRead + pageDelta, xp: stats.xp + pageDelta * 10 + completed * 250, booksCompleted: stats.booksCompleted + completed });
  console.info("[XP] progress awarded", { key: book.key, page: book.page, pageDelta, completed, previousProgress, nextProgress });
};
