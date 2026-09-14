import { useNavigate } from 'react-router-dom';
import {
  Zap, BarChart2, Target, Swords,
  Flame, CheckCircle2, XCircle, Keyboard,
} from 'lucide-react';
import type { SessionStats } from '../types';
import './GameOverScreen.css';

interface GameOverScreenProps {
  stats: SessionStats | null;
}

export default function GameOverScreen({ stats }: GameOverScreenProps) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="game-over-empty dashed-grid">
        <div className="game-over-empty-content">
          <p className="game-over-empty-text">No game data available</p>
          <button
            onClick={() => navigate('/')}
            className="game-over-btn-primary"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const avgWpm = stats.wpmHistory.length > 0
    ? Math.round(stats.wpmHistory.reduce((s, h) => s + h.wpm, 0) / stats.wpmHistory.length)
    : 0;
  const maxWpm = stats.wpmHistory.length > 0
    ? Math.max(...stats.wpmHistory.map((h) => h.wpm))
    : 0;
  const accuracy = stats.totalCharsTyped > 0
    ? Math.round((stats.correctChars / stats.totalCharsTyped) * 100)
    : 0;
  const duration = Math.round(stats.elapsedTime);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const topErrors = Object.entries(stats.errorMap)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 8);

  const statCards = [
    { label: 'Max WPM',   value: maxWpm,              Icon: Zap,          accent: true },
    { label: 'Avg WPM',   value: avgWpm,              Icon: BarChart2,     accent: false },
    { label: 'Accuracy',  value: `${accuracy}%`,      Icon: Target,       accent: false },
    { label: 'Words',     value: stats.wordsDestroyed, Icon: Swords,       accent: false },
    { label: 'Max Combo', value: `x${stats.maxCombo}`, Icon: Flame,       accent: true },
    { label: 'Correct',   value: stats.correctChars,  Icon: CheckCircle2, accent: false },
    { label: 'Errors',    value: stats.incorrectChars, Icon: XCircle,      accent: false },
    { label: 'Total Keys', value: stats.totalCharsTyped, Icon: Keyboard,  accent: false },
  ];

  return (
    <div className="game-over-container dashed-grid">
      <div className="game-over-bg-glow" />

      {/* Centered container — 740px for game-over summary */}
      <div className="game-over-content animate-slide-up">

        {/* Score header */}
        <div className="game-over-header">
          <div className="game-over-badge glass">
            <span className="game-over-badge-dot" />
            Game Over
          </div>
          <div className="game-over-score-container">
            <span className="game-over-score-value">{stats.score.toLocaleString()}</span>
            <span className="game-over-score-unit">pts</span>
          </div>
          <p className="game-over-time">
            Survived {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
          </p>
        </div>

        {/* 4×2 stat grid */}
        <div className="game-over-grid">
          {statCards.map(({ label, value, Icon, accent }) => (
            <div
              key={label}
              className={`game-over-stat-card glass ${accent ? 'glow-accent accent-border' : ''}`}
            >
              <div className="game-over-stat-card-header">
                <Icon className={`game-over-stat-icon ${accent ? 'is-accent' : 'is-muted'}`} />
                <span className="game-over-stat-label">
                  {label}
                </span>
              </div>
              <div className={`game-over-stat-value ${accent ? 'is-accent' : 'is-primary'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* WPM chart */}
        {stats.wpmHistory.length > 1 && (
          <div className="game-over-section glass">
            <h3 className="game-over-section-title">
              WPM Over Time
            </h3>
            <div className="game-over-chart-container">
              {stats.wpmHistory.map((point, i) => {
                const max = Math.max(...stats.wpmHistory.map((h) => h.wpm), 1);
                return (
                  <div
                    key={i}
                    className="game-over-chart-bar"
                    style={{ height: `${(point.wpm / max) * 100}%` }}
                  >
                    <div className="game-over-chart-tooltip glass">
                      {point.wpm}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="game-over-chart-labels">
              <span>0s</span>
              <span>{Math.round(stats.elapsedTime)}s</span>
            </div>
          </div>
        )}

        {/* Error heatmap */}
        {topErrors.length > 0 && (
          <div className="game-over-section game-over-section-mb8 glass">
            <h3 className="game-over-section-title">
              Most Missed Keys
            </h3>
            <div className="game-over-heatmap">
              {topErrors.map(([char, count]) => {
                const max = topErrors[0][1] as number;
                const intensity = (count as number) / max;
                return (
                  <div
                    key={char}
                    className="game-over-heatmap-item glass"
                    style={{
                      borderColor: `rgba(255,71,87,${0.2 + intensity * 0.5})`,
                      backgroundColor: `rgba(255,71,87,${intensity * 0.08})`,
                    }}
                  >
                    <span className="game-over-heatmap-char">
                      {char === ' ' ? '⎵' : char}
                    </span>
                    <span className="game-over-heatmap-count">{count as number}×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="game-over-actions">
          <button
            onClick={() => navigate('/play')}
            className="game-over-btn-primary"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="game-over-btn-secondary glass"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
