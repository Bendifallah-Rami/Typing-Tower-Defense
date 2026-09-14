import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardPeriod } from '../types';

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'speedtyper', score: 12450, maxWpm: 95, accuracy: 98.2 },
  { rank: 2, username: 'codemaster', score: 10230, maxWpm: 88, accuracy: 96.5 },
  { rank: 3, username: 'devninja', score: 9870, maxWpm: 82, accuracy: 97.1 },
  { rank: 4, username: 'keywarrior', score: 8540, maxWpm: 78, accuracy: 94.3 },
  { rank: 5, username: 'typist42', score: 7890, maxWpm: 75, accuracy: 95.8 },
  { rank: 6, username: 'hackerman', score: 7230, maxWpm: 71, accuracy: 93.2 },
  { rank: 7, username: 'swiftkeys', score: 6540, maxWpm: 68, accuracy: 91.7 },
  { rank: 8, username: 'bytecoder', score: 5980, maxWpm: 65, accuracy: 92.4 },
  { rank: 9, username: 'pixeldev', score: 5320, maxWpm: 62, accuracy: 90.8 },
  { rank: 10, username: 'stackflow', score: 4890, maxWpm: 59, accuracy: 89.5 },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
  return <span className="text-text-muted font-mono text-sm font-medium">{rank}</span>;
}

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');

  return (
    <div className="w-full h-full overflow-y-auto dashed-grid">
      {/* Ambient glow */}
      <div className="fixed top-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Centered container — 700px max for a table-style page */}
      <div className="w-full max-w-[700px] mx-auto px-6 py-10 animate-slide-up">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors mb-10 cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-accent">
                Global Rankings
              </span>
            </div>
            <h1
              className="text-4xl font-extrabold text-text-primary"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Leaderboard
            </h1>
          </div>

          {/* Period tabs */}
          <div className="flex glass rounded-full p-1 gap-0.5">
            {(['day', 'week', 'all'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-accent text-accent-text'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[48px_1fr_96px_64px_72px] gap-3 px-5 py-3 border-b border-border">
            {['#', 'Player', 'Score', 'WPM', 'Acc'].map((h) => (
              <span
                key={h}
                className={`text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted ${
                  h !== '#' && h !== 'Player' ? 'text-right' : ''
                }`}
              >
                {h}
              </span>
            ))}
          </div>

          {MOCK_LEADERBOARD.map((entry, i) => (
            <div
              key={entry.rank}
              className={`grid grid-cols-[48px_1fr_96px_64px_72px] gap-3 px-5 py-3.5 items-center
                         border-b border-border/30 last:border-0
                         hover:bg-white/[0.02] transition-colors
                         ${i < 3 ? 'bg-accent/[0.04]' : ''}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-6">
                <RankBadge rank={entry.rank} />
              </div>

              {/* Player */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 shrink-0 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase">
                  {entry.username[0]}
                </div>
                <span
                  className={`font-semibold text-sm truncate ${
                    i < 3 ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  {entry.username}
                </span>
              </div>

              {/* Stats */}
              <span className="text-right font-mono font-bold text-sm text-text-primary">
                {entry.score.toLocaleString()}
              </span>
              <span className="text-right font-mono text-sm text-text-secondary">
                {entry.maxWpm}
              </span>
              <span className="text-right font-mono text-sm text-text-secondary">
                {entry.accuracy}%
              </span>
            </div>
          ))}
        </div>

        {/* Your rank footer */}
        <div className="mt-4 glass rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-text-secondary text-sm">Sign in to see your rank</span>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-1.5 bg-accent text-accent-text text-xs font-bold rounded-full
                       hover:bg-accent-hover transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
