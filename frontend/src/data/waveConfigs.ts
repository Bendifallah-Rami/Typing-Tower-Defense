// ═══════════════════════════════════════════════════════════
// Wave Configs — 15 predefined waves of escalating difficulty
// ═══════════════════════════════════════════════════════════

import { WaveConfig, SpawnPattern, WordCategory } from '../types';

export const WAVE_CONFIGS: WaveConfig[] = [
  // ─── Early game (Waves 1-5): Warmup ──────────────────────
  {
    id: 1,
    name: 'First Contact',
    wordPool: [WordCategory.COMMON],
    spawnPattern: SpawnPattern.DRIP,
    totalWords: 10, // increased from 8
    baseSpawnInterval: 2800, // decreased from 3000
    speedMultiplier: 0.75, // increased from 0.7
    wordLengthRange: [3, 4],
    isBoss: false,
    duration: 0,
  },
  {
    id: 2,
    name: 'Getting Warmer',
    wordPool: [WordCategory.COMMON],
    spawnPattern: SpawnPattern.DRIP,
    totalWords: 12,
    baseSpawnInterval: 2400, // decreased from 2500
    speedMultiplier: 0.8, // increased from 0.75
    wordLengthRange: [3, 5],
    isBoss: false,
    duration: 0,
  },
  {
    id: 3,
    name: 'Steady Stream',
    wordPool: [WordCategory.COMMON],
    spawnPattern: SpawnPattern.DRIP,
    totalWords: 16,
    baseSpawnInterval: 2200,
    speedMultiplier: 0.85,
    wordLengthRange: [3, 6],
    isBoss: false,
    duration: 0,
  },
  {
    id: 4,
    name: 'Code Incoming',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.PING_PONG, // introduce ping-pong early
    totalWords: 18,
    baseSpawnInterval: 2000,
    speedMultiplier: 0.9,
    wordLengthRange: [4, 6],
    isBoss: false,
    duration: 0,
  },
  {
    id: 5,
    name: 'First Surge',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.SURROUND, // smoother than burst, keeps you looking around
    totalWords: 20,
    baseSpawnInterval: 2200, // keep base interval high to compensate for surround
    speedMultiplier: 0.95, 
    wordLengthRange: [4, 7],
    isBoss: false,
    duration: 0,
  },

  // ─── Mid game (Waves 6-10): Challenge ────────────────────
  {
    id: 6,
    name: 'Crossfire',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.PING_PONG,
    totalWords: 22,
    baseSpawnInterval: 1900,
    speedMultiplier: 1.0, 
    wordLengthRange: [4, 7],
    isBoss: false,
    duration: 0,
  },
  {
    id: 7,
    name: 'Surrounded',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.SURROUND,
    totalWords: 24,
    baseSpawnInterval: 1800,
    speedMultiplier: 1.05,
    wordLengthRange: [5, 8],
    isBoss: false,
    duration: 0,
  },
  {
    id: 8,
    name: 'Debug Mode',
    wordPool: [WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.DRIP, // slow it down but with harder words
    totalWords: 25,
    baseSpawnInterval: 1600,
    speedMultiplier: 1.1,
    wordLengthRange: [5, 9],
    isBoss: false,
    duration: 0,
  },
  {
    id: 9,
    name: 'Rapid Fire',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.BURST, // First introduction of Burst
    totalWords: 28,
    baseSpawnInterval: 1800,
    speedMultiplier: 1.15,
    wordLengthRange: [5, 8],
    isBoss: false,
    duration: 0,
  },
  {
    id: 10,
    name: '>>> BOSS: MERGE CONFLICT',
    wordPool: [WordCategory.BOSS],
    spawnPattern: SpawnPattern.SURROUND,
    totalWords: 8,
    baseSpawnInterval: 3500,
    speedMultiplier: 0.8,
    wordLengthRange: [10, 20],
    isBoss: true,
    duration: 0,
  },

  // ─── Late game (Waves 11-15): Endurance ──────────────────
  {
    id: 11,
    name: 'Full Stack',
    wordPool: [WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.SURROUND,
    totalWords: 30,
    baseSpawnInterval: 1500,
    speedMultiplier: 1.2,
    wordLengthRange: [5, 10],
    isBoss: false,
    duration: 0,
  },
  {
    id: 12,
    name: 'Storm Surge',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.BURST,
    totalWords: 32,
    baseSpawnInterval: 1600,
    speedMultiplier: 1.25,
    wordLengthRange: [6, 10],
    isBoss: false,
    duration: 0,
  },
  {
    id: 13,
    name: 'Production Deploy',
    wordPool: [WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.PING_PONG,
    totalWords: 35,
    baseSpawnInterval: 1300,
    speedMultiplier: 1.3,
    wordLengthRange: [6, 12],
    isBoss: false,
    duration: 0,
  },
  {
    id: 14,
    name: 'Infinite Loop',
    wordPool: [WordCategory.COMMON, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.SURROUND,
    totalWords: 40,
    baseSpawnInterval: 1200,
    speedMultiplier: 1.35,
    wordLengthRange: [5, 10],
    isBoss: false,
    duration: 0,
  },
  {
    id: 15,
    name: '>>> FINAL BOSS: SYSTEM OVERRIDE',
    wordPool: [WordCategory.BOSS, WordCategory.PROGRAMMING],
    spawnPattern: SpawnPattern.SURROUND,
    totalWords: 12,
    baseSpawnInterval: 2500,
    speedMultiplier: 1.0,
    wordLengthRange: [8, 20],
    isBoss: true,
    duration: 0,
  },
];
