interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export default function PauseMenu({ onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-elevated rounded-3xl p-8 max-w-sm w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent-dim flex items-center justify-center text-2xl">
            ⏸️
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Paused</h2>
          <p className="text-text-secondary text-sm">Take a breather</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-accent text-accent-text font-bold rounded-xl
                       hover:bg-accent-hover transition-all duration-200 hover:scale-[1.02]
                       active:scale-[0.98] cursor-pointer text-base"
          >
            Resume
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3.5 glass rounded-xl font-semibold text-text-primary
                       hover:border-border-accent hover:text-accent transition-all duration-200
                       cursor-pointer text-base"
          >
            Restart
          </button>
          <button
            onClick={onQuit}
            className="w-full py-3 rounded-xl font-medium text-text-muted
                       hover:text-danger transition-colors cursor-pointer text-sm"
          >
            Quit to Menu
          </button>
        </div>

        {/* Shortcut hint */}
        <div className="mt-6 text-center text-text-muted text-xs">
          Press <kbd className="px-1.5 py-0.5 glass rounded text-text-secondary font-mono text-[10px]">Esc</kbd> to resume
        </div>
      </div>
    </div>
  );
}
