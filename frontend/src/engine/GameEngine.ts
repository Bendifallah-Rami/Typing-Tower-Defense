// ═══════════════════════════════════════════════════════════
// GameEngine — Main orchestrator tying all subsystems together
// ═══════════════════════════════════════════════════════════

import {
  GamePhase, GameEvent, GameEventListener, GameEngineState,
  BaseState, SessionStats, WordCategory,
} from '../types';
import { GameLoop } from './GameLoop';
import { WordEntityPool } from './WordEntity';
import { TypingController } from './TypingController';
import { DifficultyController } from './DifficultyController';
import { SpawnManager } from './SpawnManager';
import { CanvasRenderer } from '../render/CanvasRenderer';
import { SoundManager } from '../audio/SoundManager';

const BASE_HP = 10;
const BASE_RADIUS = 40;

export class GameEngine {
  // Subsystems
  private loop: GameLoop;
  private wordPool: WordEntityPool;
  private typing: TypingController;
  private difficulty: DifficultyController;
  private spawner: SpawnManager;
  private renderer: CanvasRenderer;
  private sound: SoundManager;

  // State
  private phase: GamePhase = GamePhase.MENU;
  private base: BaseState;
  private score = 0;
  private combo = 0;
  private wpmHistory: { time: number; wpm: number }[] = [];
  private startTime = 0;

  // Event system
  private listeners: GameEventListener[] = [];
  private stateListeners: ((state: GameEngineState) => void)[] = [];
  private stateUpdateTimer = 0;
  private readonly STATE_UPDATE_INTERVAL = 100; // ms

  constructor(canvas: HTMLCanvasElement) {
    // Initialize subsystems
    this.renderer = new CanvasRenderer(canvas);
    this.wordPool = new WordEntityPool();
    this.difficulty = new DifficultyController();
    this.typing = new TypingController(this.wordPool, this.difficulty);
    this.spawner = new SpawnManager(this.wordPool);
    this.sound = new SoundManager();

    // Base state
    this.base = {
      x: this.renderer.centerX,
      y: this.renderer.centerY,
      hp: BASE_HP,
      maxHp: BASE_HP,
      radius: BASE_RADIUS,
      shieldActive: false,
    };

    // Game loop
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      (alpha) => this.render(alpha),
    );

    // Wire typing events to engine
    this.typing.on((event) => this.handleTypingEvent(event));

    // Wire spawn manager callbacks
    this.spawner.setCallbacks(
      (wave) => this.onWaveStart(wave),
      (wave) => this.onWaveComplete(wave),
    );
  }

  // ─── Public API ──────────────────────────────────────────

  /**
   * Resize the game canvas
   */
  resize(width: number, height: number): void {
    this.renderer.resize(width, height);
    this.base.x = this.renderer.centerX;
    this.base.y = this.renderer.centerY;
    this.spawner.setArea(
      this.renderer.centerX,
      this.renderer.centerY,
      Math.min(width, height) * 0.45,
    );
  }

  /**
   * Start a new game
   */
  startGame(): void {
    // Init audio on first user gesture
    this.sound.init();
    this.sound.resume();

    // Reset everything
    this.phase = GamePhase.PLAYING;
    this.score = 0;
    this.combo = 0;
    this.wpmHistory = [];
    this.startTime = performance.now();
    this.stateUpdateTimer = 0;

    this.base.hp = BASE_HP;
    this.base.maxHp = BASE_HP;

    this.wordPool.reset();
    this.typing.reset();
    this.difficulty.reset();
    this.spawner.reset();

    // Set spawn area
    this.spawner.setArea(
      this.renderer.centerX,
      this.renderer.centerY,
      Math.min(this.renderer.width, this.renderer.height) * 0.45,
    );

    // Attach keyboard
    this.typing.attach();

    // Start loop and spawner
    this.loop.start();
    this.spawner.start();

    this.notifyStateChange();
  }

  /**
   * Pause the game
   */
  pause(): void {
    if (this.phase !== GamePhase.PLAYING) return;
    this.phase = GamePhase.PAUSED;
    this.loop.pause();
    this.typing.detach();
    this.notifyStateChange();
  }

  /**
   * Resume from pause
   */
  resume(): void {
    if (this.phase !== GamePhase.PAUSED) return;
    this.phase = GamePhase.PLAYING;
    this.sound.resume();
    this.typing.attach();
    this.loop.resume();
    this.notifyStateChange();
  }

  /**
   * Subscribe to game state changes (for React HUD)
   */
  onStateChange(listener: (state: GameEngineState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Subscribe to game events
   */
  onEvent(listener: GameEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current game state snapshot
   */
  getState(): GameEngineState {
    const typingStats = this.typing.getStats();
    const elapsed = (performance.now() - this.startTime) / 1000;

    return {
      phase: this.phase,
      base: { ...this.base },
      stats: {
        score: this.score,
        combo: typingStats.combo,
        maxCombo: typingStats.maxCombo,
        totalCharsTyped: typingStats.totalChars,
        correctChars: typingStats.correctChars,
        incorrectChars: typingStats.incorrectChars,
        wordsDestroyed: typingStats.wordsDestroyed,
        wpmHistory: this.wpmHistory,
        errorMap: typingStats.errorMap,
        startTime: this.startTime,
        elapsedTime: elapsed,
      },
      currentWave: this.spawner.getCurrentWave(),
      totalWaves: this.spawner.getTotalWaves(),
      currentWpm: this.difficulty.getWpm(),
      accuracy: typingStats.accuracy,
      difficulty: this.difficulty.getParams(),
      activeWords: this.wordPool.getActiveCount(),
    };
  }

  /**
   * Get the sound manager (for UI controls)
   */
  getSoundManager(): SoundManager {
    return this.sound;
  }

  /**
   * Cleanup all resources
   */
  destroy(): void {
    this.loop.destroy();
    this.typing.detach();
    this.renderer.destroy();
    this.sound.destroy();
    this.listeners = [];
    this.stateListeners = [];
  }

  // ─── Core Loop ───────────────────────────────────────────

  private update(dt: number): void {
    if (this.phase !== GamePhase.PLAYING) return;

    // Update difficulty
    this.difficulty.update();
    this.difficulty.setWaveMultiplier(this.spawner.getCurrentWave());

    // Update spawner
    this.spawner.update(dt, this.difficulty.getParams());

    // Update word entities — get words that reached the base
    const reachedBase = this.wordPool.update(
      dt,
      this.renderer.centerX,
      this.renderer.centerY,
      this.base.radius,
    );

    // Handle words reaching base
    for (const word of reachedBase) {
      this.onWordReachedBase(word);
    }

    // Countdown display
    if (this.spawner.isBetweenWaves()) {
      const remaining = this.spawner.getWavePauseRemaining();
      this.renderer.setCountdown(`Next wave in ${Math.ceil(remaining)}...`);
    } else {
      this.renderer.setCountdown('');
    }

    // Periodic WPM recording for history
    this.stateUpdateTimer += dt * 1000;
    if (this.stateUpdateTimer >= this.STATE_UPDATE_INTERVAL) {
      this.stateUpdateTimer = 0;

      const wpm = this.difficulty.getWpm();
      const elapsed = (performance.now() - this.startTime) / 1000;

      // Record WPM every 2 seconds
      if (
        this.wpmHistory.length === 0 ||
        elapsed - this.wpmHistory[this.wpmHistory.length - 1].time >= 2
      ) {
        this.wpmHistory.push({ time: elapsed, wpm });
      }

      this.notifyStateChange();
    }
  }

  private render(alpha: number): void {
    const dt = 1 / 60; // approximate dt for particle/animation updates

    this.renderer.render(
      dt,
      this.wordPool.getActive(),
      this.base,
      alpha,
    );
  }

  // ─── Event Handlers ──────────────────────────────────────

  private handleTypingEvent(event: GameEvent): void {
    switch (event.type) {
      case 'CHAR_TYPED':
        if (event.correct) {
          this.sound.play('correct');
        } else {
          this.sound.play('incorrect');
        }
        break;

      case 'WORD_DESTROYED':
        this.score += event.score;
        this.sound.play('destroy');

        // Get the word for particle effects
        const words = this.wordPool.getActive();
        // Word is already released, so spawn particles at last known position
        // We need to capture position before release — handled via event
        this.renderer.spawnDestructionParticles(
          this.renderer.centerX + Math.cos(Math.random() * Math.PI * 2) * 100,
          this.renderer.centerY + Math.sin(Math.random() * Math.PI * 2) * 100,
          WordCategory.COMMON,
        );

        this.spawner.wordDestroyed();
        this.emit({ type: 'SCORE_UPDATE', score: this.score });
        break;

      case 'COMBO_BREAK':
        // Could add visual feedback here
        break;

      case 'WORD_TARGETED':
        this.sound.play('keystroke');
        break;
    }

    // Forward all events to external listeners
    this.emit(event);
  }

  private onWordReachedBase(word: import('../types').WordEntity): void {
    const damage = word.category === WordCategory.BOSS ? 3 : 1;
    this.base.hp = Math.max(0, this.base.hp - damage);

    this.sound.play('damage');
    this.renderer.triggerShake(8, 0.3);
    this.renderer.spawnDamageParticles(this.base.x, this.base.y);

    this.typing.releaseTarget(word.id);
    this.wordPool.release(word);
    this.spawner.wordReachedBase();

    this.emit({ type: 'BASE_DAMAGE', hp: this.base.hp, maxHp: this.base.maxHp });
    this.emit({ type: 'WORD_REACHED_BASE', wordId: word.id, damage });

    // Check game over
    if (this.base.hp <= 0) {
      this.gameOver();
    }
  }

  private onWaveStart(wave: number): void {
    this.renderer.showWaveBanner(`Wave ${wave}`);
    this.sound.play('waveComplete');
    this.emit({ type: 'WAVE_START', waveNumber: wave });
  }

  private onWaveComplete(wave: number): void {
    this.emit({ type: 'WAVE_COMPLETE', waveNumber: wave });
  }

  private gameOver(): void {
    this.phase = GamePhase.GAME_OVER;
    this.loop.stop();
    this.typing.detach();
    this.sound.play('gameOver');

    const state = this.getState();
    this.emit({ type: 'GAME_OVER', stats: state.stats });
    this.notifyStateChange();
  }

  private emit(event: GameEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private notifyStateChange(): void {
    const state = this.getState();
    for (const listener of this.stateListeners) {
      listener(state);
    }
  }
}
