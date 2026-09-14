import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { LeaderboardPeriod } from '../types';

// Mock data until backend is connected
const MOCK_LEADERBOARD = [
  { rank: 1, username: 'speedtyper', score: 12450, maxWpm: 95, accuracy: 98.2, playedAt: '2026-09-14' },
  { rank: 2, username: 'codemaster', score: 10230, maxWpm: 88, accuracy: 96.5, playedAt: '2026-09-14' },
  { rank: 3, username: 'devninja', score: 9870, maxWpm: 82, accuracy: 97.1, playedAt: '2026-09-13' },
  { rank: 4, username: 'keywarrior', score: 8540, maxWpm: 78, accuracy: 94.3, playedAt: '2026-09-13' },
  { rank: 5, username: 'typist42', score: 7890, maxWpm: 75, accuracy: 95.8, playedAt: '2026-09-12' },
  { rank: 6, username: 'hackerman', score: 7230, maxWpm: 71, accuracy: 93.2, playedAt: '2026-09-12' },
  { rank: 7, username: 'swiftkeys', score: 6540, maxWpm: 68, accuracy: 91.7, playedAt: '2026-09-11' },
  { rank: 8, username: 'bytecoder', score: 5980, maxWpm: 65, accuracy: 92.4, playedAt: '2026-09-11' },
  { rank: 9, username: 'pixeldev', score: 5320, maxWpm: 62, accuracy: 90.8, playedAt: '2026-09-10' },
  { rank: 10, username: 'stackflow', score: 4890, maxWpm: 59, accuracy: 89.5, playedAt: '2026-09-10' },
];

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');

  return (
    <div className="w-full h-full overflow-y-auto dot-pattern">
      {/* Ambient glow */}
      <div className="fixed top-[-100px] left-[-80px] w-[350px] h-[350px] rounded-full bg-accent/6 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 py-12 animate-slide-up">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-accent">Global Rankings</span>
            </div>
            <h1 className="text-4xl font-black text-text-primary">Leaderboard</h1>
          </div>

          {/* Period tabs */}
          <div className="flex glass rounded-full p-1">
            {(['day', 'week', 'all'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-accent text-accent-text'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {p === 'day' ? 'Today' : p === 'week' ? 'Week' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[60px_1fr_100px_80px_80px] gap-4 px-6 py-3 border-b border-border">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">#</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">Player</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted text-right">Score</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted text-right">WPM</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted text-right">Acc%</span>
          </div>

          {/* Rows */}
          {MOCK_LEADERBOARD.map((entry, i) => (
            <div
              key={entry.rank}
              className={`grid grid-cols-[60px_1fr_100px_80px_80px] gap-4 px-6 py-4 items-center
                         border-b border-border/50 hover:bg-accent-dim/30 transition-colors
                         ${i < 3 ? 'bg-accent-dim/10' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Rank */}
              <div className="flex items-center">
                {entry.rank <= 3 ? (
                  <span className="text-lg">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="text-text-secondary font-mono font-bold text-sm">
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Username */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center text-accent font-bold text-sm uppercase">
                  {entry.username[0]}
                </div>
                <span className={`font-semibold ${i < 3 ? 'text-accent' : 'text-text-primary'}`}>
                  {entry.username}
                </span>
              </div>

              {/* Score */}
              <span className="text-right font-mono font-bold text-text-primary">
                {entry.score.toLocaleString()}
              </span>

              {/* WPM */}
              <span className="text-right font-mono text-text-secondary">
                {entry.maxWpm}
              </span>

              {/* Accuracy */}
              <span className="text-right font-mono text-text-secondary">
                {entry.accuracy}%
              </span>
            </div>
          ))}
        </div>

        {/* Your rank (placeholder) */}
        <div className="mt-6 glass rounded-2xl p-4 border-border-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-text-muted font-mono">—</span>
              <span className="text-text-secondary text-sm">
                Sign in to see your rank
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 bg-accent text-accent-text text-sm font-semibold rounded-full
                         hover:bg-accent-hover transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
