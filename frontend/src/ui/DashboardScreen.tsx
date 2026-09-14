import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, BarChart2, Gamepad2, Trophy, Zap,
  Target, Clock, Globe, TrendingUp,
} from 'lucide-react';

const MOCK_STATS = {
  totalGames: 42,
  bestScore: 12450,
  bestWpm: 95,
  avgAccuracy: 94.7,
  totalPlayTime: 7200,
  globalRank: 15,
  recentGames: [
    { id: '1', score: 8540, maxWpm: 78, accuracy: 94.3, wavesReached: 8, duration: 245, playedAt: '2026-09-14' },
    { id: '2', score: 7230, maxWpm: 71, accuracy: 93.2, wavesReached: 7, duration: 198, playedAt: '2026-09-13' },
    { id: '3', score: 9870, maxWpm: 82, accuracy: 97.1, wavesReached: 10, duration: 312, playedAt: '2026-09-13' },
    { id: '4', score: 6540, maxWpm: 68, accuracy: 91.7, wavesReached: 6, duration: 176, playedAt: '2026-09-12' },
    { id: '5', score: 5980, maxWpm: 65, accuracy: 92.4, wavesReached: 6, duration: 165, playedAt: '2026-09-11' },
  ],
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const stats = MOCK_STATS;
  const totalHours = Math.floor(stats.totalPlayTime / 3600);
  const totalMinutes = Math.floor((stats.totalPlayTime % 3600) / 60);

  return (
    <div className="w-full h-full overflow-y-auto dashed-grid">
      <div className="fixed bottom-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Centered container — 860px max is comfortable for a 4-col stat grid */}
      <div className="w-full max-w-[860px] mx-auto px-6 py-10 animate-slide-up">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors mb-10 cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-accent">
              Personal Stats
            </span>
          </div>
          <h1
            className="text-4xl font-extrabold text-text-primary"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Dashboard
          </h1>
        </div>

        {/* Hero stat cards — 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            { value: stats.totalGames, label: 'Games Played', Icon: Gamepad2, accent: false },
            { value: stats.bestScore.toLocaleString(), label: 'Best Score', Icon: Trophy, accent: true },
            { value: `${stats.bestWpm}`, label: 'Peak WPM', Icon: Zap, accent: true },
            { value: `${stats.avgAccuracy}%`, label: 'Avg Accuracy', Icon: Target, accent: false },
          ].map(({ value, label, Icon, accent }) => (
            <div
              key={label}
              className={`glass rounded-xl p-5 flex flex-col gap-3 ${accent ? 'glow-accent' : ''}`}
            >
              <Icon className={`w-4 h-4 ${accent ? 'text-accent' : 'text-text-muted'}`} />
              <div>
                <div
                  className={`text-2xl font-black font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}
                >
                  {value}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary stat cards — 3 columns */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { Icon: Clock, label: 'Play Time', value: `${totalHours}h ${totalMinutes}m` },
            { Icon: Globe, label: 'Global Rank', value: `#${stats.globalRank}`, accent: true },
            {
              Icon: TrendingUp,
              label: 'Avg Score',
              value: Math.round(
                stats.recentGames.reduce((s, g) => s + g.score, 0) / stats.recentGames.length
              ).toLocaleString(),
            },
          ].map(({ Icon, label, value, accent }) => (
            <div key={label} className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted">
                  {label}
                </span>
              </div>
              <div className={`text-xl font-bold font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent games table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-text-muted">
              Recent Games
            </h3>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_72px_72px_60px_68px] gap-3 px-5 py-2.5 border-b border-border/40">
            {['Session', 'WPM', 'Acc', 'Wave', 'Time'].map((h, i) => (
              <span
                key={h}
                className={`text-[10px] font-semibold tracking-[0.1em] uppercase text-text-muted ${i > 0 ? 'text-right' : ''}`}
              >
                {h}
              </span>
            ))}
          </div>

          {stats.recentGames.map((game) => (
            <div
              key={game.id}
              className="grid grid-cols-[1fr_72px_72px_60px_68px] gap-3 px-5 py-3.5 items-center
                         border-b border-border/25 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {game.score.toLocaleString()} pts
                </div>
                <div className="text-xs text-text-muted mt-0.5">{game.playedAt}</div>
              </div>
              <div className="text-right font-mono text-sm text-text-secondary">{game.maxWpm}</div>
              <div className="text-right font-mono text-sm text-text-secondary">{game.accuracy}%</div>
              <div className="text-right font-mono text-sm text-text-secondary">{game.wavesReached}</div>
              <div className="text-right font-mono text-sm text-text-secondary">
                {Math.floor(game.duration / 60)}:{String(game.duration % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/play')}
            className="flex items-center gap-2.5 px-8 py-3 bg-accent text-accent-text font-bold rounded-full
                       hover:bg-accent-hover transition-all duration-300 hover:scale-[1.03]
                       shadow-[0_0_28px_rgba(194,247,81,0.22)] cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
