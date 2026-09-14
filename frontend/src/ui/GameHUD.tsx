import type { GameEngineState } from '../types';

interface GameHUDProps {
  state: GameEngineState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
}

export default function GameHUD({ state, soundEnabled, onToggleSound, onPause }: GameHUDProps) {
  const { stats, currentWpm, accuracy, currentWave, totalWaves, base } = state;
  const hpPercent = (base.hp / base.maxHp) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        {/* Left: Wave & Score */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Wave indicator */}
          <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="text-accent text-xs font-semibold tracking-wider uppercase">Wave</span>
            <span className="text-text-primary font-bold text-lg font-mono">
              {currentWave}
              <span className="text-text-muted text-sm">/{totalWaves}</span>
            </span>
          </div>

          {/* Score */}
          <div className="glass rounded-2xl px-4 py-2">
            <div className="text-text-muted text-[10px] font-semibold tracking-wider uppercase">Score</div>
            <div className="text-text-primary font-bold text-xl font-mono leading-none mt-0.5">
              {stats.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Center: HP Bar */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">
            Base HP
          </div>
          <div className="w-48 h-2.5 rounded-full bg-bg-surface-solid overflow-hidden border border-border">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                hpPercent > 50
                  ? 'bg-accent'
                  : hpPercent > 25
                    ? 'bg-warning'
                    : 'bg-danger animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-text-secondary">
            {base.hp}/{base.maxHp}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleSound}
            className="glass rounded-xl w-10 h-10 flex items-center justify-center
                       hover:border-border-accent transition-all cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onPause}
            className="glass rounded-xl w-10 h-10 flex items-center justify-center
                       hover:border-border-accent transition-all cursor-pointer"
            title="Pause (Esc)"
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        {/* WPM */}
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-4">
          <div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">WPM</div>
            <div className="text-3xl font-black font-mono text-accent leading-none mt-0.5">
              {currentWpm}
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">Accuracy</div>
            <div className="text-xl font-bold font-mono text-text-primary leading-none mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Combo */}
        {stats.combo > 1 && (
          <div className="glass rounded-2xl px-5 py-3 animate-scale-in glow-accent">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-accent">Combo</div>
            <div className="text-3xl font-black font-mono text-accent leading-none mt-0.5">
              x{stats.combo}
            </div>
          </div>
        )}

        {/* Words destroyed */}
        <div className="glass rounded-2xl px-5 py-3">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">Destroyed</div>
          <div className="text-xl font-bold font-mono text-text-primary leading-none mt-0.5">
            {stats.wordsDestroyed}
          </div>
        </div>
      </div>
    </div>
  );
}
