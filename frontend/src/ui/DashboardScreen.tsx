import { useNavigate } from 'react-router-dom';

// Mock data until backend is connected
const MOCK_STATS = {
  totalGames: 42,
  bestScore: 12450,
  bestWpm: 95,
  avgAccuracy: 94.7,
  totalPlayTime: 7200, // seconds
  globalRank: 15,
  recentGames: [
    { id: '1', score: 8540, maxWpm: 78, avgWpm: 62, accuracy: 94.3, wavesReached: 8, duration: 245, playedAt: '2026-09-14' },
    { id: '2', score: 7230, maxWpm: 71, avgWpm: 58, accuracy: 93.2, wavesReached: 7, duration: 198, playedAt: '2026-09-13' },
    { id: '3', score: 9870, maxWpm: 82, avgWpm: 67, accuracy: 97.1, wavesReached: 10, duration: 312, playedAt: '2026-09-13' },
    { id: '4', score: 6540, maxWpm: 68, avgWpm: 55, accuracy: 91.7, wavesReached: 6, duration: 176, playedAt: '2026-09-12' },
    { id: '5', score: 5980, maxWpm: 65, avgWpm: 52, accuracy: 92.4, wavesReached: 6, duration: 165, playedAt: '2026-09-11' },
  ],
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const stats = MOCK_STATS;

  const totalHours = Math.floor(stats.totalPlayTime / 3600);
  const totalMinutes = Math.floor((stats.totalPlayTime % 3600) / 60);

  return (
    <div className="w-full h-full overflow-y-auto dot-pattern">
      {/* Ambient glow */}
      <div className="fixed bottom-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-accent/6 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-12 animate-slide-up">
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
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-accent">Personal Stats</span>
          </div>
          <h1 className="text-4xl font-black text-text-primary">Dashboard</h1>
        </div>

        {/* Hero Stats — like portfolio's "STATS PROVES A LOT!" section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: stats.totalGames, label: 'Games Played', icon: '🎮', accent: false },
            { value: stats.bestScore.toLocaleString(), label: 'Best Score', icon: '🏆', accent: true },
            { value: stats.bestWpm, label: 'Peak WPM', icon: '⚡', accent: true },
            { value: `${stats.avgAccuracy}%`, label: 'Avg Accuracy', icon: '🎯', accent: false },
          ].map((stat) => (
            <div key={stat.label} className={`glass rounded-2xl p-5 ${stat.accent ? 'glow-accent' : ''}`}>
              <div className="w-8 h-0.5 bg-accent rounded-full mb-4" />
              <div className={`text-3xl font-black font-mono mb-1 ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wider uppercase text-text-muted mb-3">
              Total Play Time
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">
              {totalHours}h {totalMinutes}m
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wider uppercase text-text-muted mb-3">
              Global Rank
            </div>
            <div className="text-2xl font-bold font-mono text-accent">
              #{stats.globalRank}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wider uppercase text-text-muted mb-3">
              Avg Score
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">
              {Math.round(stats.recentGames.reduce((s, g) => s + g.score, 0) / stats.recentGames.length).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-muted">
              Recent Games
            </h3>
          </div>

          {stats.recentGames.map((game) => (
            <div
              key={game.id}
              className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-4 px-6 py-4 items-center
                         border-b border-border/50 hover:bg-accent-dim/20 transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {game.score.toLocaleString()} pts
                </div>
                <div className="text-xs text-text-muted mt-0.5">{game.playedAt}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">WPM</div>
                <div className="text-sm font-mono text-text-primary">{game.maxWpm}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">Acc</div>
                <div className="text-sm font-mono text-text-primary">{game.accuracy}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">Wave</div>
                <div className="text-sm font-mono text-text-primary">{game.wavesReached}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">Time</div>
                <div className="text-sm font-mono text-text-primary">
                  {Math.floor(game.duration / 60)}:{String(game.duration % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Play button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/play')}
            className="px-10 py-3.5 bg-accent text-accent-text font-bold rounded-full text-base
                       hover:bg-accent-hover transition-all duration-300 hover:scale-105
                       shadow-[0_0_30px_rgba(194,247,81,0.3)] cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
