import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardPeriod, LeaderboardEntry } from '../types';
import * as apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import './LeaderboardScreen.css';



function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="leaderboard-rank-icon gold" />;
  if (rank === 2) return <Medal className="leaderboard-rank-icon silver" />;
  if (rank === 3) return <Award className="leaderboard-rank-icon bronze" />;
  return <span className="leaderboard-rank-text">{rank}</span>;
}

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchBoard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await apiClient.getLeaderboard(period, 'score', 50);
        if (active) setEntries(data);
      } catch (err) {
        if (active) setError('Failed to load leaderboard data.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchBoard();
    return () => { active = false; };
  }, [period]);

  return (
    <div className="leaderboard-container dashed-grid">
      {/* Ambient glow */}
      <div className="leaderboard-bg-glow" />

      {/* Centered container */}
      <div className="leaderboard-content animate-slide-up">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="leaderboard-back-btn group"
        >
          <ChevronLeft />
          <span className="leaderboard-back-text">Back</span>
        </button>

        {/* Header */}
        <div className="leaderboard-header-row">
          <div>
            <div className="leaderboard-subtitle">
              <Trophy />
              <span className="leaderboard-subtitle-text">
                Global Rankings
              </span>
            </div>
            <h1 className="leaderboard-title">
              Leaderboard
            </h1>
          </div>

          {/* Period tabs */}
          <div className="leaderboard-tabs glass">
            {(['day', 'week', 'all'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`leaderboard-tab-btn ${period === p ? 'is-active' : ''}`}
              >
                {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="leaderboard-table-card glass">
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              LOADING DATA...
            </div>
          )}
          
          {error && !isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              No scores recorded yet. Be the first!
            </div>
          )}

          {!isLoading && !error && entries.length > 0 && (
            <>
              <div className="leaderboard-table-cols">
            {['#', 'Player', 'Score', 'WPM', 'Acc'].map((h) => (
              <span
                key={h}
                className={`leaderboard-table-col-header ${
                  h !== '#' && h !== 'Player' ? 'align-right' : ''
                }`}
              >
                {h}
              </span>
            ))}
          </div>

          {entries.map((entry, i) => (
            <div
              key={`${entry.rank}-${entry.username}`}
              className={`leaderboard-table-row ${i < 3 ? 'top-3' : ''}`}
            >
              {/* Rank */}
              <div className="leaderboard-rank-col">
                <RankBadge rank={entry.rank} />
              </div>

              {/* Player */}
              <div className="leaderboard-player-col">
                <div className="leaderboard-player-avatar">
                  {entry.username[0]}
                </div>
                <span
                  className={`leaderboard-player-name ${
                    i < 3 ? 'is-top' : ''
                  }`}
                >
                  {entry.username}
                </span>
              </div>

              {/* Stats */}
              <span className="leaderboard-score-col">
                {entry.score.toLocaleString()}
              </span>
              <span className="leaderboard-stat-col">
                {entry.maxWpm}
              </span>
              <span className="leaderboard-stat-col">
                {entry.accuracy.toFixed(1)}%
              </span>
            </div>
          ))}
            </>
          )}
        </div>

        {/* Your rank footer */}
        {!user && (
          <div className="leaderboard-footer glass">
            <span className="leaderboard-footer-text">Sign in to save your scores and rank</span>
            <button
              onClick={() => navigate('/login')}
              className="leaderboard-btn-signin"
            >
              Sign In
            </button>
          </div>
        )}
        
        {user && (
          <div className="leaderboard-footer glass" style={{ justifyContent: 'center' }}>
            <span className="leaderboard-footer-text" style={{ color: 'var(--color-accent)' }}>Logged in as {user.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}
