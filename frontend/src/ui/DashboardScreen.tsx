import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, BarChart2, Gamepad2, Trophy, Zap,
  Target, Clock, Globe, TrendingUp, LogOut
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as apiClient from '../api/client';
import type { DashboardStats } from '../types';
import './DashboardScreen.css';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="dashboard-container dashed-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
        LOADING DATA...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-container dashed-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}>
        {error || 'An error occurred'}
      </div>
    );
  }

  const totalHours = Math.floor(stats.totalPlayTime / 3600);
  const totalMinutes = Math.floor((stats.totalPlayTime % 3600) / 60);

  return (
    <div className="dashboard-container dashed-grid">
      <div className="dashboard-bg-glow" />

      {/* Centered container */}
      <div className="dashboard-content animate-slide-up">

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/')}
            className="dashboard-back-btn group"
            style={{ margin: 0 }}
          >
            <ChevronLeft />
            <span className="dashboard-back-text">Back</span>
          </button>
          
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="dashboard-back-btn group"
            style={{ margin: 0 }}
          >
            <span className="dashboard-back-text" style={{ marginRight: '8px' }}>Logout</span>
            <LogOut size={16} />
          </button>
        </div>

        {/* Page header */}
        <div className="dashboard-header" style={{ marginTop: '0' }}>
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
            { value: `${stats.avgAccuracy.toFixed(1)}%`, label: 'Avg Accuracy', Icon: Target, accent: false },
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
              value: stats.recentGames.length > 0 ? Math.round(
                stats.recentGames.reduce((s, g) => s + g.score, 0) / stats.recentGames.length
              ).toLocaleString() : '0',
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
                <div className="dashboard-row-date">{new Date(game.playedAt).toLocaleDateString()}</div>
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
