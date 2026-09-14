import { Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import MainMenu from './ui/MainMenu';
import Test from './ui/test'
import GameScreen from './ui/GameScreen';
import GameOverScreen from './ui/GameOverScreen';
import LeaderboardScreen from './ui/LeaderboardScreen';
import LoginScreen from './ui/LoginScreen';
import RegisterScreen from './ui/RegisterScreen';
import DashboardScreen from './ui/DashboardScreen';
import type { SessionStats } from './types';
import './App.css';

export default function App() {
  const [lastStats, setLastStats] = useState<SessionStats | null>(null);

  const handleGameOver = useCallback((stats: SessionStats) => {
    setLastStats(stats);
  }, []);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<GameScreen onGameOver={handleGameOver} />} />
        <Route path="/game-over" element={<GameOverScreen stats={lastStats} />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </div>
  );
}
