// ═══════════════════════════════════════════════════════════
// SpawnManager — Wave-based word spawning system
// ═══════════════════════════════════════════════════════════

import { WaveConfig, WordCategory, SpawnPattern, DifficultyParams } from '../types';
import { WordEntityPool } from './WordEntity';
import { WORD_POOLS } from '../data/wordPools';
import { WAVE_CONFIGS } from '../data/waveConfigs';

export class SpawnManager {
  private wordPool: WordEntityPool;
  private currentWave = 0;
  private wordsSpawnedInWave = 0;
  private wordsDestroyedInWave = 0;
  private totalWordsInWave = 0;
  private spawnTimer = 0;
  private waveActive = false;
  private wavePauseTimer = 0;
  private betweenWaves = false;

  /** Center of the play area */
  private centerX = 0;
  private centerY = 0;

  /** Spawn radius (distance from center) */
  private spawnRadius = 500;

  private onWaveStart?: (wave: number) => void;
  private onWaveComplete?: (wave: number) => void;

  constructor(wordPool: WordEntityPool) {
    this.wordPool = wordPool;
  }

  /**
   * Set callbacks
   */
  setCallbacks(onWaveStart: (wave: number) => void, onWaveComplete: (wave: number) => void): void {
    this.onWaveStart = onWaveStart;
    this.onWaveComplete = onWaveComplete;
  }

  /**
   * Set spawn area dimensions
   */
  setArea(centerX: number, centerY: number, spawnRadius: number): void {
    this.centerX = centerX;
    this.centerY = centerY;
    this.spawnRadius = spawnRadius;
  }

  /**
   * Start the first wave
   */
  start(): void {
    this.currentWave = 0;
    this.startNextWave();
  }

  /**
   * Start the next wave
   */
  private startNextWave(): void {
    this.currentWave++;
    this.wordsSpawnedInWave = 0;
    this.wordsDestroyedInWave = 0;
    this.spawnTimer = 0;
    this.waveActive = true;
    this.betweenWaves = false;

    const config = this.getWaveConfig();
    this.totalWordsInWave = config.totalWords;

    this.onWaveStart?.(this.currentWave);
  }

  /**
   * Get current wave config (cycles through configs for endless mode)
   */
  private getWaveConfig(): WaveConfig {
    const configs = WAVE_CONFIGS;
    if (this.currentWave <= configs.length) {
      return configs[this.currentWave - 1];
    }
    // Endless mode: repeat last wave with increasing difficulty
    const lastConfig = configs[configs.length - 1];
    const extraWaves = this.currentWave - configs.length;
    return {
      ...lastConfig,
      id: this.currentWave,
      name: `Endless ${extraWaves}`,
      totalWords: lastConfig.totalWords + extraWaves * 3,
      speedMultiplier: lastConfig.speedMultiplier + extraWaves * 0.1,
      baseSpawnInterval: Math.max(400, lastConfig.baseSpawnInterval - extraWaves * 50),
    };
  }

  /**
   * Notify that a word was destroyed
   */
  wordDestroyed(): void {
    this.wordsDestroyedInWave++;

    // Check if wave is complete (all words spawned and destroyed)
    if (
      this.wordsSpawnedInWave >= this.totalWordsInWave &&
      this.wordsDestroyedInWave >= this.totalWordsInWave
    ) {
      this.completeWave();
    }
  }

  /**
   * Notify that a word reached the base (still counts toward wave completion)
   */
  wordReachedBase(): void {
    this.wordsDestroyedInWave++;

    if (
      this.wordsSpawnedInWave >= this.totalWordsInWave &&
      this.wordsDestroyedInWave >= this.totalWordsInWave
    ) {
      this.completeWave();
    }
  }

  private completeWave(): void {
    this.waveActive = false;
    this.betweenWaves = true;
    this.wavePauseTimer = 3000; // 3 second pause between waves
    this.onWaveComplete?.(this.currentWave);
  }

  /**
   * Update spawn logic each frame
   */
  update(dt: number, difficulty: DifficultyParams): void {
    // Between waves pause
    if (this.betweenWaves) {
      this.wavePauseTimer -= dt * 1000;
      if (this.wavePauseTimer <= 0) {
        this.startNextWave();
      }
      return;
    }

    if (!this.waveActive) return;

    // Don't spawn more than wave total
    if (this.wordsSpawnedInWave >= this.totalWordsInWave) return;

    // Don't exceed max simultaneous words
    if (this.wordPool.getActiveCount() >= difficulty.maxSimultaneousWords) return;

    const config = this.getWaveConfig();
    const spawnInterval = Math.max(
      400,
      config.baseSpawnInterval * (difficulty.spawnInterval / 2500)
    );

    this.spawnTimer += dt * 1000;

    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer = 0;

      // How many to spawn based on pattern
      const count = this.getSpawnCount(config.spawnPattern);

      for (let i = 0; i < count; i++) {
        if (this.wordsSpawnedInWave >= this.totalWordsInWave) break;
        this.spawnWord(config, difficulty);
      }
    }
  }

  private getSpawnCount(pattern: SpawnPattern): number {
    switch (pattern) {
      case SpawnPattern.BURST:
        return 3;
      case SpawnPattern.SURROUND:
        return 4;
      case SpawnPattern.PING_PONG:
        return 2;
      case SpawnPattern.DRIP:
      default:
        return 1;
    }
  }

  private spawnWord(config: WaveConfig, difficulty: DifficultyParams): void {
    // Pick category
    const useProgramming = Math.random() < difficulty.programmingWordChance;
    const category =
      config.isBoss
        ? WordCategory.BOSS
        : useProgramming
          ? WordCategory.PROGRAMMING
          : WordCategory.COMMON;

    // Pick a word from the pool
    const word = this.pickWord(
      category,
      config.wordLengthRange[0] || difficulty.wordMinLength,
      config.wordLengthRange[1] || difficulty.wordMaxLength,
    );

    // Pick spawn angle based on pattern
    const angle = this.getSpawnAngle(config.spawnPattern);

    // Calculate speed
    const speed = difficulty.enemySpeed * config.speedMultiplier;

    this.wordPool.spawn(word, angle, this.spawnRadius, speed, category, this.centerX, this.centerY);
    this.wordsSpawnedInWave++;
  }

  private pickWord(category: WordCategory, minLen: number, maxLen: number): string {
    const pool =
      category === WordCategory.PROGRAMMING
        ? WORD_POOLS.programming
        : category === WordCategory.BOSS
          ? WORD_POOLS.boss
          : WORD_POOLS.common;

    // Filter by length
    const filtered = pool.filter((w) => w.length >= minLen && w.length <= maxLen);
    const source = filtered.length > 0 ? filtered : pool;

    return source[Math.floor(Math.random() * source.length)];
  }

  private getSpawnAngle(pattern: SpawnPattern): number {
    switch (pattern) {
      case SpawnPattern.SURROUND: {
        // Evenly distributed
        const quadrant = this.wordsSpawnedInWave % 4;
        return (quadrant * Math.PI) / 2 + (Math.random() - 0.5) * 0.5;
      }
      case SpawnPattern.PING_PONG: {
        // Left or right
        return this.wordsSpawnedInWave % 2 === 0
          ? Math.PI + (Math.random() - 0.5) * 0.8
          : (Math.random() - 0.5) * 0.8;
      }
      default:
        // Random angle
        return Math.random() * Math.PI * 2;
    }
  }

  /**
   * Get current wave number
   */
  getCurrentWave(): number {
    return this.currentWave;
  }

  /**
   * Get total wave count
   */
  getTotalWaves(): number {
    return WAVE_CONFIGS.length;
  }

  /**
   * Check if between waves
   */
  isBetweenWaves(): boolean {
    return this.betweenWaves;
  }

  /**
   * Get wave pause remaining (seconds)
   */
  getWavePauseRemaining(): number {
    return Math.max(0, this.wavePauseTimer / 1000);
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.currentWave = 0;
    this.wordsSpawnedInWave = 0;
    this.wordsDestroyedInWave = 0;
    this.totalWordsInWave = 0;
    this.spawnTimer = 0;
    this.waveActive = false;
    this.betweenWaves = false;
    this.wavePauseTimer = 0;
  }
}
