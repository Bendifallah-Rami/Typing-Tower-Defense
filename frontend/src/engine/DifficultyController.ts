// ═══════════════════════════════════════════════════════════
// DifficultyController — Adaptive difficulty based on WPM
// ═══════════════════════════════════════════════════════════

import { DifficultyParams } from '../types';

/** Sliding window size in seconds */
const WINDOW_SIZE = 8;

/** Smoothing factor for exponential moving average (0-1, lower = smoother) */
const SMOOTHING = 0.15;

interface KeystrokeRecord {
  time: number;
  correct: boolean;
}

/** Default difficulty params for a beginner (~30 WPM) */
const BASE_DIFFICULTY: DifficultyParams = {
  spawnInterval: 2500,
  wordMinLength: 3,
  wordMaxLength: 6,
  enemySpeed: 35,
  maxSimultaneousWords: 5,
  programmingWordChance: 0.1,
};

export class DifficultyController {
  private keystrokes: KeystrokeRecord[] = [];
  private smoothedWpm = 0;
  private currentParams: DifficultyParams = { ...BASE_DIFFICULTY };
  private waveMultiplier = 1;

  /**
   * Record a keystroke event
   */
  recordKeystroke(correct: boolean): void {
    this.keystrokes.push({
      time: performance.now(),
      correct,
    });
  }

  /**
   * Calculate current WPM from sliding window
   * Uses only the last WINDOW_SIZE seconds of keystrokes
   */
  calculateWpm(): number {
    const now = performance.now();
    const windowStart = now - WINDOW_SIZE * 1000;

    // Prune old keystrokes
    this.keystrokes = this.keystrokes.filter((k) => k.time >= windowStart);

    if (this.keystrokes.length < 2) return this.smoothedWpm;

    // Count correct characters in the window
    const correctChars = this.keystrokes.filter((k) => k.correct).length;

    // Time span of the window (or actual time span if shorter)
    const timeSpan = (now - this.keystrokes[0].time) / 1000; // seconds
    if (timeSpan < 1) return this.smoothedWpm;

    // WPM = (chars / 5) / (time in minutes)
    const rawWpm = (correctChars / 5) / (timeSpan / 60);

    // Exponential moving average for smoothing
    if (this.smoothedWpm === 0) {
      this.smoothedWpm = rawWpm;
    } else {
      this.smoothedWpm = this.smoothedWpm + SMOOTHING * (rawWpm - this.smoothedWpm);
    }

    return Math.round(this.smoothedWpm);
  }

  /**
   * Get current accuracy from sliding window
   */
  getAccuracy(): number {
    if (this.keystrokes.length === 0) return 100;
    const correct = this.keystrokes.filter((k) => k.correct).length;
    return Math.round((correct / this.keystrokes.length) * 100);
  }

  /**
   * Set wave multiplier (increases difficulty with wave progression)
   */
  setWaveMultiplier(wave: number): void {
    // Gentle escalation: each wave adds ~8% difficulty
    this.waveMultiplier = 1 + (wave - 1) * 0.08;
  }

  /**
   * Update difficulty parameters based on current WPM
   */
  update(): DifficultyParams {
    const wpm = this.calculateWpm();

    // Map WPM ranges to difficulty parameters
    // The mapping is designed so:
    //  - 0-20 WPM   = very easy (beginner)
    //  - 20-40 WPM  = easy
    //  - 40-60 WPM  = medium
    //  - 60-80 WPM  = hard
    //  - 80-100 WPM = very hard
    //  - 100+ WPM   = extreme

    const t = Math.min(wpm / 100, 1); // normalized 0-1

    this.currentParams = {
      // Spawn interval decreases as WPM increases (more words!)
      // Ensure the floor isn't insanely fast (limit to 1200ms)
      spawnInterval: Math.max(
        1200,
        lerp(3000, 1200, t) / this.waveMultiplier
      ),

      // Word length increases with WPM
      wordMinLength: Math.floor(lerp(3, 5, t)),
      wordMaxLength: Math.floor(lerp(6, 10, t)),

      // Enemy speed increases with WPM
      enemySpeed: lerp(30, 65, t) * this.waveMultiplier,

      // More simultaneous words as player improves, tightly capped
      maxSimultaneousWords: Math.floor(lerp(3, 6, t) * this.waveMultiplier),

      // More programming words at higher WPM
      programmingWordChance: lerp(0.1, 0.4, t),
    };

    return this.currentParams;
  }

  /**
   * Get current difficulty params without recalculating
   */
  getParams(): DifficultyParams {
    return this.currentParams;
  }

  /**
   * Get the smoothed WPM
   */
  getWpm(): number {
    return Math.round(this.smoothedWpm);
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.keystrokes = [];
    this.smoothedWpm = 0;
    this.currentParams = { ...BASE_DIFFICULTY };
    this.waveMultiplier = 1;
  }
}

/** Linear interpolation */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
