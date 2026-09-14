import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import GameHUD from './GameHUD';
import PauseMenu from './PauseMenu';
import type { GameEngineState, SessionStats, GamePhase } from '../types';

interface GameScreenProps {
  onGameOver: (stats: SessionStats) => void;
}

export default function GameScreen({ onGameOver }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Initial sizing
    const rect = container.getBoundingClientRect();
    engine.resize(rect.width, rect.height);

    // Subscribe to state changes
    const unsubState = engine.onStateChange((state) => {
      setGameState(state);

      if (state.phase === ('GAME_OVER' as GamePhase)) {
        onGameOver(state.stats);
        // Navigate to game over screen after a brief delay
        setTimeout(() => navigate('/game-over'), 1500);
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        engine.resize(width, height);
      }
    });
    resizeObserver.observe(container);

    // Start the game
    engine.startGame();

    // Cleanup
    return () => {
      unsubState();
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [navigate, onGameOver]);

  // Pause on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPaused) {
      engine.resume();
      setIsPaused(false);
    } else {
      engine.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
    setIsPaused(false);
  }, []);

  const handleRestart = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.destroy();

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const newEngine = new GameEngine(canvas);
    engineRef.current = newEngine;

    const rect = container.getBoundingClientRect();
    newEngine.resize(rect.width, rect.height);

    newEngine.onStateChange((state) => {
      setGameState(state);
      if (state.phase === ('GAME_OVER' as GamePhase)) {
        onGameOver(state.stats);
        setTimeout(() => navigate('/game-over'), 1500);
      }
    });

    newEngine.startGame();
    setIsPaused(false);
  }, [navigate, onGameOver]);

  const handleQuit = useCallback(() => {
    engineRef.current?.destroy();
    navigate('/');
  }, [navigate]);

  const toggleSound = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const enabled = engine.getSoundManager().toggle();
    setSoundEnabled(enabled);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-bg-primary">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* HUD Overlay */}
      {gameState && (
        <GameHUD
          state={gameState}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onPause={togglePause}
        />
      )}

      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}
