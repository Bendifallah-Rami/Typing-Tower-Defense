import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, BarChart2, Gamepad2, Trophy, Zap,
  Target, Clock, Globe, TrendingUp,
} from 'lucide-react';
import './DashboardScreen.css';

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
    <div className="dashboard-container dashed-grid">
      <div className="dashboard-bg-glow" />

      {/* Centered container */}
      <div className="dashboard-content animate-slide-up">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="dashboard-back-btn group"
        >
          <ChevronLeft />
          <span className="dashboard-back-text">Back</span>
        </button>

        {/* Page header */}
        <div className="dashboard-header">
          <div className="dashboard-subtitle">
            <BarChart2 />
            <span className="dashboard-subtitle-text">
              Personal Stats
            </span>
          </div>
          <h1 className="dashboard-title">
            Dashboard
          </h1>
        </div>

        {/* Hero stat cards — 4 columns */}
        <div className="dashboard-hero-grid">
          {[
            { value: stats.totalGames, label: 'Games Played', Icon: Gamepad2, accent: false },
            { value: stats.bestScore.toLocaleString(), label: 'Best Score', Icon: Trophy, accent: true },
            { value: `${stats.bestWpm}`, label: 'Peak WPM', Icon: Zap, accent: true },
            { value: `${stats.avgAccuracy}%`, label: 'Avg Accuracy', Icon: Target, accent: false },
          ].map(({ value, label, Icon, accent }) => (
            <div
              key={label}
              className={`dashboard-card ${accent ? 'glow-accent' : ''}`}
            >
              <div className="dashboard-card-icon-container">
                <Icon className={`dashboard-card-icon ${accent ? 'is-accent' : 'is-muted'}`} />
              </div>
              <div>
                <div
                  className={`dashboard-card-value ${accent ? 'is-accent' : 'is-primary'}`}
                >
                  {value}
                </div>
                <div className="dashboard-card-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary stat cards — 3 columns */}
        <div className="dashboard-secondary-grid">
          {[
            { Icon: Clock, label: 'Play Time', value: `${totalHours}h ${totalMinutes}m`, accent: false },
            { Icon: Globe, label: 'Global Rank', value: `#${stats.globalRank}`, accent: true },
            {
              Icon: TrendingUp,
              label: 'Avg Score',
              value: Math.round(
                stats.recentGames.reduce((s, g) => s + g.score, 0) / stats.recentGames.length
              ).toLocaleString(),
              accent: false
            },
          ].map(({ Icon, label, value, accent }) => (
            <div key={label} className="dashboard-secondary-card">
              <div className="dashboard-secondary-card-header">
                <Icon className="dashboard-secondary-icon" />
                <span className="dashboard-secondary-label">
                  {label}
                </span>
              </div>
              <div className={`dashboard-secondary-value ${accent ? 'is-accent' : 'is-primary'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent games table */}
        <div className="dashboard-table-container">
          <div className="dashboard-table-header">
            <h3 className="dashboard-table-title">
              Recent Games
            </h3>
          </div>

          {/* Column headers */}
          <div className="dashboard-table-cols">
            {['Session', 'WPM', 'Acc', 'Wave', 'Time'].map((h, i) => (
              <span
                key={h}
                className={`dashboard-table-col-header ${i > 0 ? 'align-right' : ''}`}
              >
                {h}
              </span>
            ))}
          </div>

          {stats.recentGames.map((game) => (
            <div
              key={game.id}
              className="dashboard-table-row"
            >
              <div>
                <div className="dashboard-row-score">
                  {game.score.toLocaleString()} pts
                </div>
                <div className="dashboard-row-date">{game.playedAt}</div>
              </div>
              <div className="dashboard-row-cell">{game.maxWpm}</div>
              <div className="dashboard-row-cell">{game.accuracy}%</div>
              <div className="dashboard-row-cell">{game.wavesReached}</div>
              <div className="dashboard-row-cell">
                {Math.floor(game.duration / 60)}:{String(game.duration % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="dashboard-cta-container">
          <button
            onClick={() => navigate('/play')}
            className="dashboard-btn-play"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
