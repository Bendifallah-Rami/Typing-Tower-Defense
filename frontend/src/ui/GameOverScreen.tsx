import { useNavigate } from 'react-router-dom';
import type { SessionStats } from '../types';
import './GameOverScreen.css';

interface GameOverScreenProps {
  stats: SessionStats | null;
}

const CHART_W = 640;
const CHART_H = 180;
const PAD_T = 14;
const PAD_B = 10;

export default function GameOverScreen({ stats }: GameOverScreenProps) {
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="go-root dashed-grid">
        <div className="go-empty">
          <p className="go-empty-text">This run has no recorded data.</p>
          <button onClick={() => navigate('/')} className="go-btn go-btn-primary">
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  const history = stats.wpmHistory;
  const avgWpm = history.length
    ? Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length)
    : 0;
  const maxWpm = history.length ? Math.max(...history.map((h) => h.wpm)) : 0;
  const accuracy = stats.totalCharsTyped
    ? Math.round((stats.correctChars / stats.totalCharsTyped) * 100)
    : 0;
  // Consistency: how close your average sat to your peak. Low means bursty.
  const consistency = maxWpm ? Math.round((avgWpm / maxWpm) * 100) : 0;

  const duration = Math.round(stats.elapsedTime);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeLabel = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const verdict =
    accuracy < 90
      ? 'Accuracy is the bottleneck here. Ease off the pace and the score follows.'
      : consistency < 65
        ? 'Strong peak, uneven middle. A steady rhythm scores higher than bursts.'
        : 'Held together well. Next run, push the ceiling.';

  const topErrors = Object.entries(stats.errorMap)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 7);
  const worstCount = topErrors.length ? (topErrors[0][1] as number) : 1;

  /* ---- WPM curve geometry ---- */
  const peak = Math.max(maxWpm, 1);
  const usable = CHART_H - PAD_T - PAD_B;
  const pointAt = (i: number, wpm: number) => {
    const x = history.length > 1 ? (i / (history.length - 1)) * CHART_W : CHART_W / 2;
    const y = CHART_H - PAD_B - (wpm / peak) * usable;
    return [x, y] as const;
  };
  const coords = history.map((h, i) => pointAt(i, h.wpm));
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const areaPath =
    coords.length > 1
      ? `${linePath} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z`
      : '';
  const peakIndex = history.findIndex((h) => h.wpm === maxWpm);
  const peakPoint = peakIndex >= 0 ? coords[peakIndex] : null;
  const avgY = CHART_H - PAD_B - (avgWpm / peak) * usable;

  const rows: Array<[string, string | number]> = [
    ['Peak speed', `${maxWpm} wpm`],
    ['Average speed', `${avgWpm} wpm`],
    ['Consistency', `${consistency}%`],
    ['Accuracy', `${accuracy}%`],
    ['Words destroyed', stats.wordsDestroyed],
    ['Best combo', `${stats.maxCombo}`],
    ['Keystrokes', `${stats.correctChars} / ${stats.totalCharsTyped}`],
  ];

  return (
    <div className="go-root dashed-grid">
      <div className="go-inner">
        {/* ---- Headline ---- */}
        <header className="go-head">
          <div className="go-head-main">
            <p className="go-eyebrow">Run ended after {timeLabel}</p>
            <div className="go-score">
              <span className="go-score-num">{stats.score.toLocaleString()}</span>
              <span className="go-score-unit">points</span>
            </div>
          </div>
          <p className="go-verdict">{verdict}</p>
        </header>

        {/* ---- Body ---- */}
        <div className="go-body">
          <section className="go-panel go-figures">
            <dl className="go-rows">
              {rows.map(([label, value]) => (
                <div className="go-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="go-panel go-chart-panel">
            <div className="go-panel-head">
              <h2 className="go-panel-title">Speed through the run</h2>
              <span className="go-panel-note">peak {maxWpm}</span>
            </div>

            {history.length > 1 ? (
              <div className="go-chart">
                <svg
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  preserveAspectRatio="none"
                  className="go-chart-svg"
                  role="img"
                  aria-label={`Words per minute over the run, peaking at ${maxWpm}`}
                >
                  <path d={areaPath} className="go-area" />
                  <line
                    x1="0"
                    x2={CHART_W}
                    y1={avgY}
                    y2={avgY}
                    className="go-avg-line"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={linePath}
                    className="go-line"
                    vectorEffect="non-scaling-stroke"
                    fill="none"
                  />
                  {peakPoint && (
                    <circle
                      cx={peakPoint[0]}
                      cy={peakPoint[1]}
                      r="3"
                      className="go-peak-dot"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>
                <span className="go-avg-tag" style={{ top: `${(avgY / CHART_H) * 100}%` }}>
                  avg {avgWpm}
                </span>
              </div>
            ) : (
              <p className="go-chart-empty">Not enough samples to plot a curve.</p>
            )}

            <div className="go-chart-axis">
              <span>0s</span>
              <span>{duration}s</span>
            </div>
          </section>
        </div>

        {/* ---- Footer ---- */}
        <footer className="go-foot">
          <div className="go-keys">
            {topErrors.length > 0 ? (
              <>
                <span className="go-keys-label">Missed most</span>
                <ul className="go-keys-list">
                  {topErrors.map(([char, count]) => (
                    <li className="go-key" key={char}>
                      <span className="go-key-char">{char === ' ' ? 'space' : char}</span>
                      <span className="go-key-count">{count as number}</span>
                      <span
                        className="go-key-meter"
                        style={{ transform: `scaleX(${(count as number) / worstCount})` }}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <span className="go-keys-label">No repeated mistakes this run.</span>
            )}
          </div>

          <div className="go-actions">
            <button onClick={() => navigate('/')} className="go-btn go-btn-ghost">
              Menu
            </button>
            <button onClick={() => navigate('/play')} className="go-btn go-btn-primary">
              Play again
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}