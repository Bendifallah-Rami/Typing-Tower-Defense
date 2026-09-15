import { Pause } from 'lucide-react';
import './PauseMenu.css';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export default function PauseMenu({ onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <div className="pause-menu-overlay animate-fade-in">
      <div className="pause-menu-card glass-elevated animate-scale-in">
        {/* Header */}
        <div className="pause-menu-header">
          <div className="pause-menu-icon" style={{ display: 'flex', justifyContent: 'center' }}>
            <Pause size={32} />
          </div>
          <h2 className="pause-menu-title">Paused</h2>
          <p className="pause-menu-subtitle">Take a breather</p>
        </div>

        {/* Buttons */}
        <div className="pause-menu-actions">
          <button
            onClick={onResume}
            className="pause-menu-btn-resume"
          >
            Resume
          </button>
          <button
            onClick={onRestart}
            className="pause-menu-btn-restart glass"
          >
            Restart
          </button>
          <button
            onClick={onQuit}
            className="pause-menu-btn-quit"
          >
            Quit to Menu
          </button>
        </div>

        {/* Shortcut hint */}
        <div className="pause-menu-hint">
          Press <kbd className="pause-menu-kbd glass">Esc</kbd> to resume
        </div>
      </div>
    </div>
  );
}
