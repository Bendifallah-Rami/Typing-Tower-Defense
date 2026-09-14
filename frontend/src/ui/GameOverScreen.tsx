import { useNavigate } from 'react-router-dom';
import type { SessionStats } from '../types';

interface GameOverScreenProps {
  stats: SessionStats | null;
}

export default function GameOverScreen({ stats }: GameOverScreenProps) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="w-full h-full flex items-center justify-center dot-pattern">
        <div className="text-center">
          <p className="text-text-secondary mb-4">No game data available</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-accent text-accent-text font-bold rounded-full
                       hover:bg-accent-hover transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const avgWpm =
    stats.wpmHistory.length > 0
      ? Math.round(stats.wpmHistory.reduce((sum, h) => sum + h.wpm, 0) / stats.wpmHistory.length)
      : 0;

  const maxWpm =
    stats.wpmHistory.length > 0
      ? Math.max(...stats.wpmHistory.map((h) => h.wpm))
      : 0;

  const accuracy =
    stats.totalCharsTyped > 0
      ? Math.round((stats.correctChars / stats.totalCharsTyped) * 100)
      : 0;

  const duration = Math.round(stats.elapsedTime);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  // Top error characters
  const topErrors = Object.entries(stats.errorMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="w-full h-full overflow-y-auto dot-pattern">
      {/* Ambient glow */}
      <div className="fixed top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 py-12 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-semibold tracking-wider uppercase text-danger mb-4">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            Game Over
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary mb-2">
            <span className="text-accent">{stats.score.toLocaleString()}</span> pts
          </h1>
          <p className="text-text-secondary">
            You survived {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Max WPM', value: maxWpm, icon: '⚡', accent: true },
            { label: 'Avg WPM', value: avgWpm, icon: '📊', accent: false },
            { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', accent: false },
            { label: 'Words', value: stats.wordsDestroyed, icon: '💥', accent: false },
            { label: 'Max Combo', value: `x${stats.maxCombo}`, icon: '🔥', accent: true },
            { label: 'Correct', value: stats.correctChars, icon: '✅', accent: false },
            { label: 'Errors', value: stats.incorrectChars, icon: '❌', accent: false },
            { label: 'Total Keys', value: stats.totalCharsTyped, icon: '⌨️', accent: false },
          ].map((stat) => (
            <div key={stat.label} className={`glass rounded-2xl p-4 ${stat.accent ? 'glow-accent border-border-accent' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{stat.icon}</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">
                  {stat.label}
                </span>
              </div>
              <div className={`text-2xl font-bold font-mono ${stat.accent ? 'text-accent' : 'text-text-primary'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* WPM Over Time Chart (Simple CSS chart) */}
        {stats.wpmHistory.length > 1 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-muted mb-4">
              WPM Over Time
            </h3>
            <div className="flex items-end gap-1 h-32">
              {stats.wpmHistory.map((point, i) => {
                const maxVal = Math.max(...stats.wpmHistory.map((h) => h.wpm), 1);
                const heightPercent = (point.wpm / maxVal) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-accent/60 hover:bg-accent transition-colors relative group min-w-[4px]"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100
                                    transition-opacity glass rounded-lg px-2 py-1 text-xs font-mono text-text-primary whitespace-nowrap pointer-events-none">
                      {point.wpm} WPM
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-text-muted font-mono">
              <span>0s</span>
              <span>{Math.round(stats.elapsedTime)}s</span>
            </div>
          </div>
        )}

        {/* Error Heatmap */}
        {topErrors.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-muted mb-4">
              Most Missed Keys
            </h3>
            <div className="flex flex-wrap gap-2">
              {topErrors.map(([char, count]) => {
                const maxCount = topErrors[0][1] as number;
                const intensity = (count as number) / (maxCount as number);
                return (
                  <div
                    key={char}
                    className="flex flex-col items-center gap-1 glass rounded-xl px-4 py-3"
                    style={{
                      borderColor: `rgba(255, 71, 87, ${0.2 + intensity * 0.5})`,
                      backgroundColor: `rgba(255, 71, 87, ${intensity * 0.1})`,
                    }}
                  >
                    <span className="text-xl font-mono font-bold text-text-primary">
                      {char === ' ' ? '⎵' : char}
                    </span>
                    <span className="text-xs text-danger font-mono">{count as number}x</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/play')}
            className="px-10 py-3.5 bg-accent text-accent-text font-bold rounded-full text-base
                       hover:bg-accent-hover transition-all duration-300 hover:scale-105
                       shadow-[0_0_30px_rgba(194,247,81,0.3)] cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="glass px-8 py-3 rounded-full font-medium text-text-primary
                       hover:border-border-accent hover:text-accent transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
