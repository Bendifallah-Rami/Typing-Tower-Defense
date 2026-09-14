import type { GameEngineState } from '../types';
import { Volume2, VolumeX, Pause } from 'lucide-react';
import './GameHUD.css';

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
    <div className="game-hud-container">
      {/* Top Bar */}
      <div className="game-hud-top-bar">
        {/* Left: Wave & Score */}
        <div className="game-hud-left-group">
          {/* Wave indicator */}
          <div className="game-hud-wave-indicator glass">
            <span className="game-hud-label-accent">Wave</span>
            <span className="game-hud-value">
              {currentWave}
              <span className="game-hud-value-sub">/{totalWaves}</span>
            </span>
          </div>

          {/* Score */}
          <div className="game-hud-score-card glass">
            <div className="game-hud-label-muted">Score</div>
            <div className="game-hud-score-value">
              {stats.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Center: HP Bar */}
        <div className="game-hud-hp-group">
          <div className="game-hud-label-muted">
            Base HP
          </div>
          <div className="game-hud-hp-bar-container">
            <div
              className={`game-hud-hp-bar-fill ${
                hpPercent > 50
                  ? 'bg-accent'
                  : hpPercent > 25
                    ? 'bg-warning'
                    : 'bg-danger'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="game-hud-hp-text">
            {base.hp}/{base.maxHp}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="game-hud-controls">
          <button
            onClick={onToggleSound}
            className="game-hud-btn glass"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="game-hud-btn-icon-primary" /> : <VolumeX className="game-hud-btn-icon-muted" />}
          </button>
          <button
            onClick={onPause}
            className="game-hud-btn glass"
            title="Pause (Esc)"
          >
            <Pause className="game-hud-btn-icon-primary" />
          </button>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="game-hud-bottom-bar">
        {/* WPM */}
        <div className="game-hud-stats-card glass">
          <div className="game-hud-stats-group">
            <div className="game-hud-label-muted">WPM</div>
            <div className="game-hud-wpm-value">
              {currentWpm}
            </div>
          </div>
          <div className="game-hud-divider" />
          <div className="game-hud-stats-group">
            <div className="game-hud-label-muted">Accuracy</div>
            <div className="game-hud-acc-value">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Combo */}
        {stats.combo > 1 && (
          <div className="game-hud-combo-card glass animate-scale-in glow-accent">
            <div className="game-hud-label-accent">Combo</div>
            <div className="game-hud-wpm-value">
              x{stats.combo}
            </div>
          </div>
        )}

        {/* Words destroyed */}
        <div className="game-hud-destroyed-card glass">
          <div className="game-hud-label-muted">Destroyed</div>
          <div className="game-hud-acc-value">
            {stats.wordsDestroyed}
          </div>
        </div>
      </div>
    </div>
  );
}
