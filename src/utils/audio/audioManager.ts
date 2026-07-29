import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";

declare var window: any;

const SUPPORTED_FORMATS = ["mp3", "wav", "flac", "ogg", "m4a"];

interface AtmosphereConfig {
  enabled: boolean;
  path: string;
  volume: number; // 0–1 (normalised)
  loop: boolean;
  fadeIn: number; // seconds
  fadeOut: number; // seconds
}

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private fadeRaf: number | null = null;
  private isMuted: boolean = false;
  private volumeBeforeMute: number = 1;
  // Tracks the play() promise so we can guard against overlapping calls
  private playPromise: Promise<void> | null = null;

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Start playback. Reads all settings from ConfigService at call time.
   * Safe to call multiple times — reuses the existing Audio element,
   * swapping src only when the file changes.
   */
  async play(): Promise<void> {
    const config = this.loadConfig();

    if (!config.enabled) return;
    if (!config.path || !this.fileExists(config.path)) return;

    const ext = config.path.split(".").pop()?.toLowerCase() ?? "";
    if (!SUPPORTED_FORMATS.includes(ext)) return;

    const src = this.toFileUrl(config.path);

    // Create the element once; reuse on subsequent calls
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = "auto";
    }

    // If a previous play() promise is still pending, wait for it to settle
    // before issuing another play() — prevents overlapping promise rejections
    if (this.playPromise) {
      try {
        await this.playPromise;
      } catch {
        // previous play was interrupted; that's fine
      }
    }

    // Cancel any in-flight fade
    this.cancelFade();

    // Only reload src when the file actually changed
    if (this.audio.src !== src) {
      this.audio.src = src;
      this.audio.load();
    }

    this.audio.loop = config.loop;
    this.audio.volume = config.fadeIn > 0 ? 0 : config.volume;

    this.playPromise = this.audio.play();
    try {
      await this.playPromise;
    } catch (err) {
      console.warn("[AudioManager] Playback failed:", err);
      this.playPromise = null;
      return;
    }
    this.playPromise = null;

    if (config.fadeIn > 0) {
      this.fade(0, config.volume, config.fadeIn);
    }
  }

  /** Fade out over the configured duration, then pause (keeps element alive). */
  stop(): void {
    if (!this.audio || this.audio.paused) return;

    const config = this.loadConfig();

    if (config.fadeOut > 0) {
      this.fade(this.audio.volume, 0, config.fadeOut, () => {
        this.audio?.pause();
      });
    } else {
      this.cancelFade();
      this.audio.pause();
    }
  }

  /** Hard stop and discard the Audio element — use when feature is disabled. */
  dispose(): void {
    this.cancelFade();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.playPromise = null;
  }

  mute(): void {
    if (!this.audio || this.isMuted) return;
    this.isMuted = true;
    this.volumeBeforeMute = this.audio.volume;
    this.audio.volume = 0;
  }

  unmute(): void {
    if (!this.audio || !this.isMuted) return;
    this.isMuted = false;
    this.audio.volume = this.volumeBeforeMute;
  }

  toggleMute(): void {
    this.isMuted ? this.unmute() : this.mute();
  }

  isPlaying(): boolean {
    return (
      this.audio !== null &&
      !this.audio.paused &&
      !this.audio.ended &&
      this.audio.readyState > 2
    );
  }

  /** Apply settings that can change without restarting playback. */
  applySettings(): void {
    if (!this.audio) return;

    const config = this.loadConfig();
    this.audio.loop = config.loop;
    this.cancelFade();

    if (this.isMuted) {
      this.volumeBeforeMute = config.volume;
      this.audio.volume = 0;
    } else {
      this.audio.volume = config.volume;
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private loadConfig(): AtmosphereConfig {
    const rawVolume = ConfigService.getReaderConfig("atmosphereVolume");
    const parsedVolume = rawVolume != null ? parseInt(rawVolume, 10) : 70;
    const clampedVolume = Math.max(
      0,
      Math.min(100, isNaN(parsedVolume) ? 70 : parsedVolume)
    );

    return {
      enabled:
        ConfigService.getReaderConfig("atmosphereEnabled") === "yes",
      path: ConfigService.getReaderConfig("atmosphereFilePath") || "",
      volume: clampedVolume / 100,
      loop: ConfigService.getReaderConfig("atmosphereLoop") !== "no",
      fadeIn: parseFloat(
        ConfigService.getReaderConfig("atmosphereFadeIn") || "0"
      ),
      fadeOut: parseFloat(
        ConfigService.getReaderConfig("atmosphereFadeOut") || "0"
      ),
    };
  }


  private fileExists(filePath: string): boolean {
    try {
      const fs = window.require("fs");
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  private toFileUrl(filePath: string): string {
    try {
      const path = window.require("path");
      const { pathToFileURL } = window.require("url");
      return pathToFileURL(path.resolve(filePath)).href;
    } catch {
      // Fallback for non-Electron environments
      const normalized = filePath.replace(/\\/g, "/");
      return normalized.startsWith("file://")
        ? normalized
        : `file:///${normalized}`;
    }
  }

  /**
   * Linear volume ramp over `durationSec` seconds using requestAnimationFrame.
   * Cancels any in-progress fade before starting.
   */
  private fade(
    from: number,
    to: number,
    durationSec: number,
    onComplete?: () => void
  ): void {
    this.cancelFade();

    if (!this.audio) return;

    const startTime = performance.now();
    const durationMs = durationSec * 1000;
    const audio = this.audio;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      audio.volume = from + (to - from) * progress;

      if (progress < 1) {
        this.fadeRaf = requestAnimationFrame(tick);
      } else {
        this.fadeRaf = null;
        onComplete?.();
      }
    };

    this.fadeRaf = requestAnimationFrame(tick);
  }

  private cancelFade(): void {
    if (this.fadeRaf !== null) {
      cancelAnimationFrame(this.fadeRaf);
      this.fadeRaf = null;
    }
  }
}

// Singleton — one instance for the entire renderer process lifetime
const audioManager = new AudioManager();
export default audioManager;
