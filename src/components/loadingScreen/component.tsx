import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import "./loadingScreen.css";

// ─── Message pools ────────────────────────────────────────────────────────────

const GENERIC_MESSAGES = [
  "INITIALIZING ARCHIVE...",
  "LOCATING MANUSCRIPT...",
  "RESTORING PAPER FIBERS...",
  "INDEXING CHAPTERS...",
  "DECODING ANCIENT TEXT...",
  "VERIFYING BINDING...",
  "CALIBRATING PHOSPHOR DISPLAY...",
  "LOADING TYPOGRAPHY ENGINE...",
  "ALIGNING PAGE GEOMETRY...",
  "RESTORING INK PIGMENTS...",
  "READING TABLE OF CONTENTS...",
  "MOUNTING DIGITAL LIBRARY...",
  "RECONSTRUCTING BOOK SPINE...",
  "SCANNING MARGINALIA...",
  "CHECKING PAGE INTEGRITY...",
  "RESTORING AUTHOR NOTES...",
  "SYNCHRONIZING BOOKMARKS...",
  "INITIALIZING READING SPACE...",
  "RENDERING PAGES...",
  "PREPARING CHAPTER...",
  "OPENING ARCHIVE...",
];

const PDF_MESSAGES = [
  "SCANNING DOCUMENT...",
  "INITIALIZING PDF ENGINE...",
  "RENDERING PAGE CACHE...",
  "BUILDING PAGE INDEX...",
  "LOADING VECTOR OBJECTS...",
  "PARSING ANNOTATIONS...",
  "CALIBRATING RENDER PIPELINE...",
  "DECOMPRESSING PAGE STREAMS...",
  "CHECKING DOCUMENT STRUCTURE...",
  "PREPARING VIEWER...",
];

const EPUB_MESSAGES = [
  "PARSING EPUB CONTAINER...",
  "READING PACKAGE DOCUMENT...",
  "LOADING STYLESHEETS...",
  "RENDERING CHAPTERS...",
  "REBUILDING FLOW LAYOUT...",
  "RESOLVING CONTENT PATHS...",
  "PARSING SPINE ITEMS...",
  "APPLYING TYPOGRAPHY RULES...",
  "LOADING EMBEDDED FONTS...",
  "ASSEMBLING READING ORDER...",
];

const SYSTEM_LOGS = [
  "[ OK ] Typography Engine",
  "[ OK ] Chapter Index",
  "[ OK ] Metadata",
  "[ OK ] Page Cache",
  "[ OK ] Book Spine",
  "[ OK ] Font Renderer",
  "[ OK ] Annotation Layer",
  "[ OK ] Reading Engine",
];

const EASTER_EGGS = [
  "The librarians are whispering...",
  "The archive remembers.",
  "Beware the unfinished chapter.",
  "Some books read you back.",
  "Lost in the stacks...",
  "The ink is still drying.",
  "This manuscript has been opened 12,483 times.",
  "Silence is required beyond this point.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Types ────────────────────────────────────────────────────────────────────

type LogLine =
  | { kind: "message"; text: string; displayed: string }
  | { kind: "syslog"; text: string }
  | { kind: "easter"; text: string };

// ─── Component ────────────────────────────────────────────────────────────────

interface LoadingScreenProps {
  isReady: boolean;
  bookName: string;
  bookFormat: string;
  percentage?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isReady,
  bookName,
  bookFormat,
  percentage,
}) => {
  // Determine message pool once on mount based on format
  const messagePool = useMemo<string[]>(() => {
    const fmt = (bookFormat || "").toUpperCase();
    const base =
      fmt === "PDF"
        ? PDF_MESSAGES
        : ["EPUB", "MOBI", "AZW3", "AZW"].includes(fmt)
          ? EPUB_MESSAGES
          : GENERIC_MESSAGES;
    return shuffle([...base, ...shuffle(GENERIC_MESSAGES).slice(0, 5)]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Easter egg: determined once on mount
  const easterEgg = useMemo<string | null>(
    () =>
      Math.random() < 0.05
        ? EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]
        : null,
    []
  );

  // Log lines rendered in the terminal window
  const [lines, setLines] = useState<LogLine[]>([]);
  // The current message line being typed (index into messagePool)
  const msgIndexRef = useRef(0);
  // Typewriter state: how many chars of the current message are shown
  const [typedChars, setTypedChars] = useState(0);
  // Whether we are mid-typewriter on the current line
  const isTypingRef = useRef(false);
  // Whether the easter egg has been appended
  const easterDoneRef = useRef(false);
  // Track syslog budget — emit one every ~3 messages
  const syslogCounterRef = useRef(0);
  const syslogPoolRef = useRef(shuffle([...SYSTEM_LOGS]));

  // Indeterminate bar phase (0–100, loops)
  const [barPhase, setBarPhase] = useState(0);

  const addLine = useCallback((line: LogLine) => {
    setLines((prev) => {
      // Keep at most 12 lines so the terminal doesn't overflow
      const next = [...prev, line];
      return next.length > 12 ? next.slice(next.length - 12) : next;
    });
  }, []);

  // ── Typewriter for the current message ──────────────────────────────────────
  useEffect(() => {
    if (isReady) return;

    const currentIndex = msgIndexRef.current;
    if (currentIndex >= messagePool.length) return;

    const fullText = messagePool[currentIndex];

    if (prefersReducedMotion) {
      // Skip animation: add the full line immediately
      addLine({ kind: "message", text: fullText, displayed: fullText });
      msgIndexRef.current += 1;
      isTypingRef.current = false;
      return;
    }

    // Start typing from char 0
    isTypingRef.current = true;
    setTypedChars(0);

    let charIndex = 0;
    const typeNextChar = () => {
      charIndex += 1;
      setTypedChars(charIndex);
      if (charIndex < fullText.length) {
        // Variable char delay: faster on spaces, normal on others
        const delay = fullText[charIndex] === " " ? 10 : randomBetween(18, 34);
        charTimer = window.setTimeout(typeNextChar, delay);
      } else {
        // Finished typing this line — commit it as fully displayed
        isTypingRef.current = false;
        addLine({ kind: "message", text: fullText, displayed: fullText });
        msgIndexRef.current += 1;
        setTypedChars(0);
      }
    };

    let charTimer = window.setTimeout(typeNextChar, randomBetween(18, 34));
    return () => window.clearTimeout(charTimer);
  }, [lines.length, isReady]); // re-run each time a line is committed // eslint-disable-line react-hooks/exhaustive-deps

  // ── Inter-message delay + syslog injection ───────────────────────────────────
  useEffect(() => {
    if (isReady) return;
    if (isTypingRef.current) return;
    if (msgIndexRef.current >= messagePool.length) return;

    // Possibly emit a syslog before the next message
    syslogCounterRef.current += 1;
    if (
      syslogCounterRef.current >= 3 &&
      syslogPoolRef.current.length > 0 &&
      Math.random() < 0.6
    ) {
      syslogCounterRef.current = 0;
      const logText = syslogPoolRef.current.shift()!;
      const syslogTimer = window.setTimeout(() => {
        addLine({ kind: "syslog", text: logText });
      }, randomBetween(80, 200));
      return () => window.clearTimeout(syslogTimer);
    }

    // Schedule the next message line
    const nextMessageTimer = window.setTimeout(
      () => {
        // This setState triggers the typewriter useEffect by changing lines.length
        // But we only want to start if not already typing — guard is in the
        // typewriter effect itself via msgIndexRef and isTypingRef
      },
      randomBetween(prefersReducedMotion ? 60 : 280, prefersReducedMotion ? 100 : 480)
    );
    return () => window.clearTimeout(nextMessageTimer);
  }, [lines, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Easter egg injection (once, ~halfway through) ────────────────────────────
  useEffect(() => {
    if (!easterEgg || easterDoneRef.current || isReady) return;
    if (msgIndexRef.current < Math.floor(messagePool.length * 0.45)) return;
    easterDoneRef.current = true;
    const t = window.setTimeout(() => {
      addLine({ kind: "easter", text: easterEgg });
    }, randomBetween(400, 800));
    return () => window.clearTimeout(t);
  }, [lines, easterEgg, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Indeterminate bar animation ──────────────────────────────────────────────
  useEffect(() => {
    if (isReady || prefersReducedMotion) return;
    const hasRealProgress = percentage !== undefined && percentage > 0;
    if (hasRealProgress) return;

    const t = window.setInterval(() => {
      setBarPhase((p) => (p + 1.4) % 100);
    }, 30);
    return () => window.clearInterval(t);
  }, [isReady, percentage]);

  // ── Current typing line (in-progress, shown below committed lines) ────────────
  const currentMsg =
    !isReady && !prefersReducedMotion && isTypingRef.current
      ? messagePool[msgIndexRef.current]?.slice(0, typedChars) ?? ""
      : "";

  const hasRealProgress =
    percentage !== undefined && percentage !== null && percentage > 0;
  const barPercent = hasRealProgress
    ? Math.round(percentage! * 100)
    : Math.round(
        50 + 50 * Math.sin((barPhase / 100) * Math.PI * 2)
      );

  return (
    <div
      className={`ls${isReady ? " ls--ready" : ""}`}
      aria-live="polite"
      aria-label="Loading book"
    >
      {/* ── CRT overlay layers (passive, identical approach to VisualEffects) ── */}
      <div className="ls__crt" aria-hidden="true">
        <span className="ls__crt-vignette" />
        <span className="ls__crt-scanlines" />
        <span className="ls__crt-grain" />
        <span className="ls__crt-flicker" />
      </div>

      {/* ── Main terminal window ──────────────────────────────────────────────── */}
      <div className="ls__terminal" aria-hidden="true">
        {/* Header bar */}
        <div className="ls__terminal-header">
          <span className="ls__terminal-dot ls__terminal-dot--red" />
          <span className="ls__terminal-dot ls__terminal-dot--yellow" />
          <span className="ls__terminal-dot ls__terminal-dot--green" />
          <span className="ls__terminal-title">BIBLIOPHILE ARCHIVE v2.4</span>
        </div>

        {/* Log area */}
        <div className="ls__log">
          {lines.map((line, i) => {
            if (line.kind === "syslog") {
              return (
                <div key={i} className="ls__log-line ls__log-line--syslog">
                  {line.text}
                </div>
              );
            }
            if (line.kind === "easter") {
              return (
                <div key={i} className="ls__log-line ls__log-line--easter">
                  ✦ {line.text}
                </div>
              );
            }
            return (
              <div key={i} className="ls__log-line">
                <span className="ls__prompt">&gt;&nbsp;</span>
                {line.displayed}
              </div>
            );
          })}

          {/* Active typing line */}
          {currentMsg && (
            <div className="ls__log-line ls__log-line--active">
              <span className="ls__prompt">&gt;&nbsp;</span>
              {currentMsg}
              <span className="ls__cursor">▮</span>
            </div>
          )}

          {/* Idle cursor when no typing in progress */}
          {!currentMsg && !isReady && (
            <div className="ls__log-line ls__log-line--active">
              <span className="ls__prompt">&gt;&nbsp;</span>
              <span className="ls__cursor">▮</span>
            </div>
          )}
        </div>

        {/* ── Loading bar ──────────────────────────────────────────────────────── */}
        <div className="ls__bar-container">
          <div className="ls__bar-label">
            {hasRealProgress ? (
              <span>{barPercent}%</span>
            ) : (
              <span className="ls__bar-label--indeterminate">LOADING</span>
            )}
          </div>
          <div className="ls__bar-track">
            <div
              className={`ls__bar-fill${!hasRealProgress ? " ls__bar-fill--indeterminate" : ""}`}
              style={
                hasRealProgress
                  ? { width: `${barPercent}%` }
                  : { "--ls-bar-phase": `${barPhase}%` } as React.CSSProperties
              }
            />
          </div>
          <div className="ls__bar-bracket-left">[</div>
          <div className="ls__bar-bracket-right">]</div>
        </div>

        {/* Book title */}
        <div className="ls__book-title">
          {bookName && (
            <>
              <span className="ls__book-label">ARCHIVE&nbsp;</span>
              <span className="ls__book-name">{bookName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
