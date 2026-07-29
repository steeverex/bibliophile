import React from "react";
import "./profile.css";
import { ConfigService, ReadingTimeUtil } from "../../assets/lib/kookit-extra-browser.min";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ascensionFromArchive } from "../../utils/progression/ascension";
import DatabaseService from "../../utils/storage/databaseService";
import CoverUtil from "../../utils/file/coverUtil";
import { computeTotalArchive } from "../../utils/progression/archiveManager";
import { BOOK_FINISHED_THRESHOLD } from "../../utils/progression/progressionConfig";
import { CountUp, ProgressFill } from "../../components/microInteractions/component";
import { getXpStats, migrateXpStats } from "../../utils/progression/xpStats";
import { rankLookup } from "../../utils/progression/rank";

interface RotatingQuote { text: string; book?: { name: string; author: string }; }
interface NowReading { key: string; name: string; author: string; cover?: string; page?: number; }
interface Marginalia { sparkline: string; observation: string; }
interface IntensityPoint { date: string; minutes: number; }
interface ProfileState { name: string; verse: string; picture: string; quote: RotatingQuote | null; nowReading: NowReading | null; intensity: IntensityPoint[]; }
interface StoredBook extends NowReading { description?: string; }
interface StoredNote { bookKey?: string; text?: string; notes?: string; date?: { year?: number; month?: number; day?: number }; }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const toBook = (value: unknown): StoredBook | null => isRecord(value) && typeof value.key === "string" && typeof value.name === "string" ? {
  key: value.key, name: value.name, author: typeof value.author === "string" ? value.author : "", cover: typeof value.cover === "string" ? value.cover : undefined,
  page: typeof value.page === "number" ? value.page : undefined, description: typeof value.description === "string" ? value.description : undefined,
} : null;
const toNote = (value: unknown): StoredNote | null => isRecord(value) ? {
  bookKey: typeof value.bookKey === "string" ? value.bookKey : undefined, text: typeof value.text === "string" ? value.text : undefined,
  notes: typeof value.notes === "string" ? value.notes : undefined, date: isRecord(value.date) ? value.date : undefined,
} : null;
const progressFor = (key: string): number => {
  const location: unknown = ConfigService.getObjectConfig(key, "recordLocation", null);
  const percentage = isRecord(location) ? Number(location.percentage) : 0;
  return Number.isFinite(percentage) ? Math.max(0, Math.min(1, percentage)) : 0;
};
const ambienceName = (): string => {
  if (ConfigService.getReaderConfig("atmosphereEnabled") !== "yes") return "Silence";
  const path = ConfigService.getReaderConfig("atmosphereFilePath") || "";
  const filename = path.replace(/\\/g, "/").split("/").pop() || "";
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Silence";
};
const profilePictureSrc = (picture: string): string => {
  if (!picture || /^(data:|https?:|file:)/i.test(picture)) return picture;
  return `file:///${encodeURI(picture.replace(/\\/g, "/"))}`;
};

class Profile extends React.Component<RouteComponentProps, ProfileState> {
  // Keep this aligned with Reading Stats: it reads the persisted readingTime history.
  private readingTime = new ReadingTimeUtil(ConfigService, { registerUnloadHandler: () => () => {} });

  state: ProfileState = {
    name: (ConfigService.getReaderConfig("profileDisplayName") || "").trim(),
    verse: (ConfigService.getReaderConfig("profileVerse") || "").trim(),
    picture: ConfigService.getReaderConfig("profilePicturePath") || "",
    quote: null,
    nowReading: null,
    intensity: [],
  };

  async componentDidMount() {
    const [rawBooks, rawNotes] = await Promise.all([DatabaseService.getAllRecords("books").catch(() => []), DatabaseService.getAllRecords("notes").catch(() => [])]);
    const books = (rawBooks as unknown[]).map(toBook).filter((book): book is StoredBook => book !== null);
    const notes = (rawNotes as unknown[]).map(toNote).filter((note): note is StoredNote => note !== null);
    migrateXpStats(books as any);
    this.updateLifetimeMetrics(books, notes);
    // This is the same persisted session ordering used by "open last read book".
    // Unlike a progress scan, it always identifies the book the reader opened last.
    const recentKeys = ConfigService.getAllListConfig("recentBooks");
    const nowReading = recentKeys.map((key) => books.find((book) => book.key === key) || null).find((book): book is StoredBook => book !== null) || null;

    // A Rotating Line is always a passage the reader deliberately highlighted.
    const highlighted = notes.filter((note) => note.notes === "" && !!note.text);
    const selected = highlighted.length ? highlighted[Math.floor(Math.random() * highlighted.length)] : undefined;
    let quote: RotatingQuote | null = null;
    if (selected?.text) {
      const source = selected.bookKey ? books.find((book) => book.key === selected.bookKey) : undefined;
      quote = { text: selected.text, book: source ? { name: source.name, author: source.author } : undefined };
    }

    if (nowReading) nowReading.cover = await CoverUtil.getCover(nowReading as any).catch(() => nowReading.cover || "");
    this.setState({ nowReading, quote, intensity: this.getIntensity(this.readingTime) });
  }

  getIntensity(readingTime: ReadingTimeUtil): IntensityPoint[] {
    const allDates = new Set(readingTime.getAllDates());
    return Array.from({ length: 30 }, (_, offset) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (29 - offset));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const seconds = allDates.has(key) ? readingTime.getDayStats(key).reduce((total, stat) => total + stat.seconds, 0) : 0;
      return { date: key, minutes: Math.round(seconds / 60) };
    });
  }

  renderIntensity() {
    const points = this.state.intensity;
    const max = Math.max(...points.map((point) => point.minutes), 1);
    const coordinates = points.map((point, index) => `${(index / Math.max(points.length - 1, 1)) * 100},${100 - (point.minutes / max) * 88 - 6}`).join(" ");
    return <section className="profile-intensity"><h2>Momentum</h2><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Reading activity over the last 30 days"><polyline points={coordinates} /></svg><div className="profile-intensity-tooltips">{points.map((point) => <span key={point.date} title={`${point.date} • ${point.minutes} minutes read`} />)}</div></section>;
  }

  makeMarginalia(notes: StoredNote[]): Marginalia | null {
    if (!notes.length) return null;
    const byDay = new Map<string, number>();
    notes.forEach((note) => {
      const date = note.date;
      const key = date?.year && date.month && date.day ? `${date.year}-${date.month}-${date.day}` : "undated";
      byDay.set(key, (byDay.get(key) || 0) + 1);
    });
    const values = Array.from(byDay.values()).slice(-7);
    const peak = Math.max(...values, 1);
    const marks = "▁▂▃▄▅▆▇█";
    const sparkline = values.map((value) => marks[Math.min(7, Math.max(0, Math.ceil((value / peak) * 7) - 1))]).join("");
    return { sparkline, observation: `${notes.length} annotation${notes.length === 1 ? "" : "s"} gathered across your reading.` };
  }

  updateLifetimeMetrics(books: StoredBook[], notes: StoredNote[]) {
    let booksFinished = 0;
    let pagesRead = 0;
    books.forEach((book) => {
      const progress = progressFor(book.key);
      if (progress >= BOOK_FINISHED_THRESHOLD) booksFinished++;
      if (book.page && progress > 0) pagesRead += Math.floor(progress * book.page);
    });
    const highlights = notes.filter((note) => note.notes === "").length;
    const writtenNotes = notes.filter((note) => note.notes && note.notes !== "annotation").length;
    const dates = this.readingTime.getAllDates();
    const activeDates = new Set(dates.filter((date) => this.readingTime.getDayStats(date).some((stat) => stat.seconds > 0)));
    let totalSeconds = 0;
    dates.forEach((date) => totalSeconds += this.readingTime.getDayStats(date).reduce((sum, stat) => sum + stat.seconds, 0));
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let run = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (activeDates.has(key)) { run++; longestStreak = Math.max(longestStreak, run); if (i === currentStreak) currentStreak++; }
      else { if (i === currentStreak) currentStreak = -1; run = 0; }
    }
    const archive = computeTotalArchive({ pagesRead, booksFinished, highlightsCreated: highlights, notesCreated: writtenNotes, chaptersCompleted: 0 });
    ConfigService.setReaderConfig("profileArchiveValue", String(archive));
    ConfigService.setReaderConfig("profileBooksFinished", String(booksFinished));
    ConfigService.setReaderConfig("profilePagesRead", String(pagesRead));
    ConfigService.setReaderConfig("profileHoursRead", String(Math.floor(totalSeconds / 3600)));
    ConfigService.setReaderConfig("profileHighlights", String(highlights));
    ConfigService.setReaderConfig("profileCurrentStreak", String(Math.max(0, currentStreak)));
    ConfigService.setReaderConfig("profileLongestStreak", String(longestStreak));
  }

  render() {
    const archive = Number(ConfigService.getReaderConfig("profileArchiveValue") || 0);
    const stats = getXpStats();
    const booksFinished = stats.booksCompleted;
    const pagesRead = stats.totalPagesRead;
    const currentStreak = Number(ConfigService.getReaderConfig("profileCurrentStreak") || 0);
    const ascension = ascensionFromArchive(archive);
    const rankInfo = rankLookup(stats.xp);
    const isEmptyProfile = booksFinished === 0 && pagesRead === 0 && archive === 0;
    const rank = rankInfo.title;
    const heroStats = [["Books Finished", "profileBooksFinished", ""], ["Current Streak", "profileCurrentStreak", " days"]];
    const compactStats = [["Pages Read", "profilePagesRead"], ["Hours Read", "profileHoursRead"], ["Highlights", "profileHighlights"], ["Longest Streak", "profileLongestStreak"]];
    const pictureSrc = profilePictureSrc(this.state.picture);
    return <main className="literary-profile">
      <button className="profile-close" onClick={() => this.props.history.push("/manager/home")}>×</button>
      <header className="literary-profile-header"><div className="profile-ambient" aria-hidden="true"><i /><i /><i /><i /></div><div className="profile-identity"><div><p className="profile-name">{this.state.name || "Steeve Rex"}</p><p className="profile-rank-label">Rank</p><p className="profile-rank">{rank}</p><p className="profile-ascension">ASCENSION {rankInfo.roman}</p><div className="profile-xp"><div className="profile-xp-track"><span style={{ width: `${rankInfo.progressPct}%` }} /></div><p><CountUp value={stats.xp} /> XP{rankInfo.xpToNext ? ` · ${rankInfo.xpToNext.toLocaleString()} XP to next rank` : " · Maximum rank"}</p></div></div>{pictureSrc ? <img className="profile-picture" src={pictureSrc} alt={`${this.state.name || "Reader"} profile`} /> : null}</div></header>
      <div className="profile-columns"><div>
        <section><h2>Verse</h2>{this.state.verse ? <p className="profile-verse">{this.state.verse}</p> : this.state.quote ? <><p className="profile-quote">{this.state.quote.text}</p><p className="profile-attribution">— {this.state.quote.book?.name || "From your library"}<br />{this.state.quote.book?.author || ""}</p></> : <p className="profile-empty-verse">Highlight a passage to make this page your own.</p>}</section>
        <section><h2>Archive Progress</h2>{isEmptyProfile ? <p className="profile-empty-archive">Start your first book to begin tracking progress.</p> : <><div className="profile-progress"><ProgressFill value={Math.round(ascension.progressFraction * 100)} /></div><p className="profile-archive-value"><CountUp value={archive} /> / {(ascension.nextThreshold || ascension.currentThreshold).toLocaleString()}</p></>}</section>
        {isEmptyProfile ? <section className="profile-journey-empty"><h2>Your journey starts here</h2><p>Open a book, turn a page, and your reading story will begin to take shape.</p></section> : <><section className="profile-hero-stats">{heroStats.map(([label, key, suffix]) => { const value = Number(ConfigService.getReaderConfig(key) || 0); return <div key={key}><span>{label}</span><strong className={key === "profileCurrentStreak" && currentStreak > 0 ? "profile-streak-active" : ""}><CountUp value={value} />{suffix}</strong></div>; })}</section><section className="profile-stat-grid">{compactStats.map(([label, key]) => <div key={key}><span>{label}</span><strong><CountUp value={Number(ConfigService.getReaderConfig(key) || 0)} /></strong></div>)}</section></>}
      </div><aside>
        <section><h2>Now Reading</h2>{this.state.nowReading ? <div className="now-reading">{this.state.nowReading.cover ? <img src={this.state.nowReading.cover} alt="" /> : null}<div><p>{this.state.nowReading.name}<br /><span>{this.state.nowReading.author}</span></p><div className="now-reading-progress"><ProgressFill value={Math.round(progressFor(this.state.nowReading.key) * 100)} /></div></div></div> : <p className="profile-empty-verse">Nothing open just now.</p>}</section>
        <section><h2>Reading Ambience</h2><p className="profile-empty-verse">{ambienceName()}</p></section>{this.renderIntensity()}
      </aside></div>
      <footer className="profile-colophon">Bibliophile · Reading since July 2026</footer>
    </main>;
  }
}
export default withRouter(Profile);
