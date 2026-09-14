// ═══════════════════════════════════════════════════════════
// Typing Tower Defense — Core Types
// ═══════════════════════════════════════════════════════════

// ─── Game States ─────────────────────────────────────────
export enum GamePhase {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

// ─── Word Entity ─────────────────────────────────────────
export interface WordEntity {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  /** Index of the next character to type (0 = untouched) */
  charIndex: number;
  hp: number;
  maxHp: number;
  spawnTime: number;
  isTargeted: boolean;
  /** Angle in radians toward the center base */
  angle: number;
  /** Distance from center */
  distance: number;
  /** Word pool category */
  category: WordCategory;
  /** Whether this entity is active (object pooling) */
  active: boolean;
  /** Visual opacity for fade-in/out */
  opacity: number;
  /** Color accent override (for boss words) */
  color?: string;
}

export enum WordCategory {
  COMMON = 'common',
  PROGRAMMING = 'programming',
  BOSS = 'boss',
}

// ─── Base (Center Target) ────────────────────────────────
export interface BaseState {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  radius: number;
  shieldActive: boolean;
}

// ─── Player Stats (per-session, live) ────────────────────
export interface SessionStats {
  score: number;
  combo: number;
  maxCombo: number;
  totalCharsTyped: number;
  correctChars: number;
  incorrectChars: number;
  wordsDestroyed: number;
  wpmHistory: { time: number; wpm: number }[];
  /** Per-character error counts keyed by character */
  errorMap: Record<string, number>;
  startTime: number;
  elapsedTime: number;
}

// ─── Difficulty ──────────────────────────────────────────
export interface DifficultyParams {
  spawnInterval: number; // ms between spawns
  wordMinLength: number;
  wordMaxLength: number;
  enemySpeed: number; // pixels per second
  maxSimultaneousWords: number;
  programmingWordChance: number; // 0-1
}

// ─── Wave ────────────────────────────────────────────────
export interface WaveConfig {
  id: number;
  name: string;
  wordPool: WordCategory[];
  spawnPattern: SpawnPattern;
  /** Total words in this wave */
  totalWords: number;
  /** Base spawn interval override (ms) */
  baseSpawnInterval: number;
  /** Speed multiplier relative to difficulty */
  speedMultiplier: number;
  /** Word length range override */
  wordLengthRange: [number, number];
  /** Boss wave? */
  isBoss: boolean;
  /** Duration in ms (0 = until all words cleared) */
  duration: number;
}

export enum SpawnPattern {
  /** Steady stream */
  DRIP = 'drip',
  /** Rapid groups */
  BURST = 'burst',
  /** From all directions simultaneously */
  SURROUND = 'surround',
  /** Alternating sides */
  PING_PONG = 'ping_pong',
}

// ─── Particle ────────────────────────────────────────────
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
  active: boolean;
}

// ─── Screen Shake ────────────────────────────────────────
export interface ScreenShake {
  intensity: number;
  duration: number;
  elapsed: number;
  offsetX: number;
  offsetY: number;
}

// ─── Game Engine Events (Observable) ─────────────────────
export type GameEvent =
  | { type: 'WORD_TARGETED'; wordId: number }
  | { type: 'CHAR_TYPED'; wordId: number; charIndex: number; correct: boolean }
  | { type: 'WORD_DESTROYED'; wordId: number; score: number }
  | { type: 'WORD_REACHED_BASE'; wordId: number; damage: number }
  | { type: 'WAVE_START'; waveNumber: number }
  | { type: 'WAVE_COMPLETE'; waveNumber: number }
  | { type: 'COMBO_BREAK' }
  | { type: 'GAME_OVER'; stats: SessionStats }
  | { type: 'SCORE_UPDATE'; score: number }
  | { type: 'BASE_DAMAGE'; hp: number; maxHp: number }
  | { type: 'WPM_UPDATE'; wpm: number }
  | { type: 'DIFFICULTY_CHANGE'; params: DifficultyParams };

export type GameEventListener = (event: GameEvent) => void;

// ─── Game Engine State (read by React HUD) ───────────────
export interface GameEngineState {
  phase: GamePhase;
  base: BaseState;
  stats: SessionStats;
  currentWave: number;
  totalWaves: number;
  currentWpm: number;
  accuracy: number;
  difficulty: DifficultyParams;
  activeWords: number;
}

// ─── API Types ───────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface GameSessionPayload {
  score: number;
  maxWpm: number;
  avgWpm: number;
  accuracy: number;
  wavesReached: number;
  duration: number;
}

export interface GameSessionRecord extends GameSessionPayload {
  id: string;
  userId: string;
  playedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  maxWpm: number;
  accuracy: number;
  playedAt: string;
}

export type LeaderboardPeriod = 'day' | 'week' | 'all';
export type LeaderboardSort = 'score' | 'wpm';

export interface DashboardStats {
  totalGames: number;
  bestScore: number;
  bestWpm: number;
  avgAccuracy: number;
  totalPlayTime: number;
  globalRank: number;
  recentGames: GameSessionRecord[];
  progressionData: { date: string; score: number; wpm: number }[];
}
