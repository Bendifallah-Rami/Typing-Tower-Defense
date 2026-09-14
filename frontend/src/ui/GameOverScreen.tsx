import { useNavigate } from 'react-router-dom';
import {
  Zap, BarChart2, Target, Swords,
  Flame, CheckCircle2, XCircle, Keyboard,
} from 'lucide-react';
import type { SessionStats } from '../types';

interface GameOverScreenProps {
  stats: SessionStats | null;
}

export default function GameOverScreen({ stats }: GameOverScreenProps) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="w-full h-full flex items-center justify-center dashed-grid">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">No game data available</p>
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
    <div className="w-full h-full overflow-y-auto dashed-grid">
      <div className="fixed top-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      {/* Centered container — 740px for game-over summary */}
      <div className="w-full max-w-[740px] mx-auto px-6 py-10 animate-slide-up">

        {/* Score header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 glass rounded-full
                         text-[10px] font-semibold tracking-[0.15em] uppercase text-danger mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            Game Over
          </div>
          <div
            className="text-6xl font-extrabold text-text-primary"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="text-accent">{stats.score.toLocaleString()}</span>
            <span className="text-xl text-text-secondary font-normal ml-2">pts</span>
          </div>
          <p className="text-text-secondary text-sm mt-2">
            Survived {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
          </p>
        </div>

        {/* 4×2 stat grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {statCards.map(({ label, value, Icon, accent }) => (
            <div
              key={label}
              className={`glass rounded-xl p-4 ${accent ? 'glow-accent border-border-accent' : ''}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className={`w-3.5 h-3.5 ${accent ? 'text-accent' : 'text-text-muted'}`} />
                <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-text-muted">
                  {label}
                </span>
              </div>
              <div className={`text-xl font-bold font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* WPM chart */}
        {stats.wpmHistory.length > 1 && (
          <div className="glass rounded-xl p-5 mb-4">
            <h3 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted mb-4">
              WPM Over Time
            </h3>
            <div className="flex items-end gap-0.5 h-24">
              {stats.wpmHistory.map((point, i) => {
                const max = Math.max(...stats.wpmHistory.map((h) => h.wpm), 1);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-accent/40 hover:bg-accent/70 transition-colors
                               relative group min-w-[3px]"
                    style={{ height: `${(point.wpm / max) * 100}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5
                                    opacity-0 group-hover:opacity-100 transition-opacity
                                    glass rounded-md px-1.5 py-0.5 text-[10px] font-mono
                                    text-text-primary whitespace-nowrap pointer-events-none">
                      {point.wpm}
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

        {/* Error heatmap */}
        {topErrors.length > 0 && (
          <div className="glass rounded-xl p-5 mb-8">
            <h3 className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted mb-4">
              Most Missed Keys
            </h3>
            <div className="flex flex-wrap gap-2">
              {topErrors.map(([char, count]) => {
                const max = topErrors[0][1] as number;
                const intensity = (count as number) / max;
                return (
                  <div
                    key={char}
                    className="flex flex-col items-center gap-1 glass rounded-lg px-3.5 py-2.5"
                    style={{
                      borderColor: `rgba(255,71,87,${0.2 + intensity * 0.5})`,
                      backgroundColor: `rgba(255,71,87,${intensity * 0.08})`,
                    }}
                  >
                    <span className="text-base font-mono font-bold text-text-primary">
                      {char === ' ' ? '⎵' : char}
                    </span>
                    <span className="text-[10px] text-danger font-mono">{count as number}×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/play')}
            className="px-8 py-3 bg-accent text-accent-text font-bold rounded-full text-sm
                       hover:bg-accent-hover transition-all duration-300 hover:scale-[1.03]
                       shadow-[0_0_28px_rgba(194,247,81,0.22)] cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="glass px-7 py-3 rounded-full text-sm font-medium text-text-primary
                       hover:border-border-accent hover:text-accent transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
