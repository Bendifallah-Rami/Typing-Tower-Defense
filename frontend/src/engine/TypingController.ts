// ═══════════════════════════════════════════════════════════
// TypingController — Global keyboard input handling
// ═══════════════════════════════════════════════════════════

import { WordEntity, GameEvent } from '../types';
import { WordEntityPool } from './WordEntity';
import { DifficultyController } from './DifficultyController';

export class TypingController {
  private wordPool: WordEntityPool;
  private difficulty: DifficultyController;
  private currentTarget: WordEntity | null = null;
  private eventListeners: ((event: GameEvent) => void)[] = [];
  private boundKeyHandler: ((e: KeyboardEvent) => void) | null = null;

  /** Running combo count */
  private combo = 0;
  private maxCombo = 0;
  private totalChars = 0;
  private correctChars = 0;
  private incorrectChars = 0;
  private errorMap: Record<string, number> = {};
  private wordsDestroyed = 0;

  constructor(wordPool: WordEntityPool, difficulty: DifficultyController) {
    this.wordPool = wordPool;
    this.difficulty = difficulty;
  }

  /**
   * Start listening for keyboard input
   */
  attach(): void {
    this.boundKeyHandler = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  /**
   * Stop listening for keyboard input
   */
  detach(): void {
    if (this.boundKeyHandler) {
      window.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }
  }

  /**
   * Subscribe to typing events
   */
  on(listener: (event: GameEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    };
  }

  private emit(event: GameEvent): void {
    for (const listener of this.eventListeners) {
      listener(event);
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Ignore modifier keys, function keys, etc.
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length !== 1) return; // Only single characters

    // Prevent default to stop browser shortcuts
    e.preventDefault();

    const key = e.key;
    this.totalChars++;

    // Try to find or continue a target
    if (this.currentTarget && this.currentTarget.active) {
      // Continue typing the current target
      this.processKeystroke(key);
    } else {
      // Find a new target
      this.currentTarget = this.wordPool.findTarget(key, null);

      if (this.currentTarget) {
        this.currentTarget.isTargeted = true;
        this.emit({ type: 'WORD_TARGETED', wordId: this.currentTarget.id });
        this.processKeystroke(key);
      } else {
        // No valid target found — mistype
        this.registerMiss(key);
      }
    }
  }

  private processKeystroke(key: string): void {
    if (!this.currentTarget) return;

    const expectedChar = this.currentTarget.text[this.currentTarget.charIndex];

    if (key.toLowerCase() === expectedChar.toLowerCase()) {
      // Correct character!
      this.correctChars++;
      this.currentTarget.charIndex++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      this.difficulty.recordKeystroke(true);

      this.emit({
        type: 'CHAR_TYPED',
        wordId: this.currentTarget.id,
        charIndex: this.currentTarget.charIndex,
        correct: true,
      });

      // Check if word is complete
      if (this.currentTarget.charIndex >= this.currentTarget.text.length) {
        this.destroyWord(this.currentTarget);
      }
    } else {
      // Incorrect character — penalty mode: block advancement
      this.registerMiss(key);

      this.emit({
        type: 'CHAR_TYPED',
        wordId: this.currentTarget.id,
        charIndex: this.currentTarget.charIndex,
        correct: false,
      });
    }
  }

  private registerMiss(key: string): void {
    this.incorrectChars++;
    this.difficulty.recordKeystroke(false);

    // Track error frequency per character
    this.errorMap[key] = (this.errorMap[key] || 0) + 1;

    // Break combo
    if (this.combo > 0) {
      this.combo = 0;
      this.emit({ type: 'COMBO_BREAK' });
    }
  }

  private destroyWord(word: WordEntity): void {
    this.wordsDestroyed++;

    // Calculate score for this word
    const wpm = this.difficulty.getWpm();
    const lengthBonus = word.text.length * 10;
    const wpmBonus = Math.floor(wpm * 0.5);
    const comboBonus = Math.floor(this.combo * 5);
    const categoryBonus = word.category === 'programming' ? 20 : 0;
    const score = lengthBonus + wpmBonus + comboBonus + categoryBonus;

    this.emit({
      type: 'WORD_DESTROYED',
      wordId: word.id,
      score,
    });

    // Release the entity
    word.isTargeted = false;
    this.wordPool.release(word);
    this.currentTarget = null;
  }

  /**
   * Force-release the current target (e.g., word reached base)
   */
  releaseTarget(wordId: number): void {
    if (this.currentTarget && this.currentTarget.id === wordId) {
      this.currentTarget = null;
    }
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      combo: this.combo,
      maxCombo: this.maxCombo,
      totalChars: this.totalChars,
      correctChars: this.correctChars,
      incorrectChars: this.incorrectChars,
      wordsDestroyed: this.wordsDestroyed,
      errorMap: { ...this.errorMap },
      accuracy:
        this.totalChars > 0
          ? Math.round((this.correctChars / this.totalChars) * 100)
          : 100,
    };
  }

  /**
   * Get current target
   */
  getCurrentTarget(): WordEntity | null {
    return this.currentTarget;
  }

  /**
   * Reset all typing state
   */
  reset(): void {
    this.currentTarget = null;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalChars = 0;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.errorMap = {};
    this.wordsDestroyed = 0;
  }
}
