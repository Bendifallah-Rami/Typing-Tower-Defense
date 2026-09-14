import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardPeriod } from '../types';
import './LeaderboardScreen.css';

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'speedtyper', score: 12450, maxWpm: 95, accuracy: 98.2 },
  { rank: 2, username: 'codemaster', score: 10230, maxWpm: 88, accuracy: 96.5 },
  { rank: 3, username: 'devninja', score: 9870, maxWpm: 82, accuracy: 97.1 },
  { rank: 4, username: 'keywarrior', score: 8540, maxWpm: 78, accuracy: 94.3 },
  { rank: 5, username: 'typist42', score: 7890, maxWpm: 75, accuracy: 95.8 },
  { rank: 6, username: 'hackerman', score: 7230, maxWpm: 71, accuracy: 93.2 },
  { rank: 7, username: 'swiftkeys', score: 6540, maxWpm: 68, accuracy: 91.7 },
  { rank: 8, username: 'bytecoder', score: 5980, maxWpm: 65, accuracy: 92.4 },
  { rank: 9, username: 'pixeldev', score: 5320, maxWpm: 62, accuracy: 90.8 },
  { rank: 10, username: 'stackflow', score: 4890, maxWpm: 59, accuracy: 89.5 },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="leaderboard-rank-icon gold" />;
  if (rank === 2) return <Medal className="leaderboard-rank-icon silver" />;
  if (rank === 3) return <Award className="leaderboard-rank-icon bronze" />;
  return <span className="leaderboard-rank-text">{rank}</span>;
}

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');

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
          {/* Column headers */}
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

          {MOCK_LEADERBOARD.map((entry, i) => (
            <div
              key={entry.rank}
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
                {entry.accuracy}%
              </span>
            </div>
          ))}
        </div>

        {/* Your rank footer */}
        <div className="leaderboard-footer glass">
          <span className="leaderboard-footer-text">Sign in to see your rank</span>
          <button
            onClick={() => navigate('/login')}
            className="leaderboard-btn-signin"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
