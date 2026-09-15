import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Star } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hero demo config                                                    */
/* ------------------------------------------------------------------ */

const SLOTS = 5;

const WORD_POOL = [
  'async', 'buffer', 'kernel', 'render', 'vector', 'socket',
  'commit', 'deploy', 'cursor', 'thread', 'stack', 'lambda',
  'parse', 'mutate', 'signal', 'yield', 'cache', 'daemon',
];

type Entity = {
  active: boolean;
  text: string;
  typed: number;
  x: number;
  speed: number;
  isStart: boolean;
  spans: HTMLSpanElement[];
};

/* ------------------------------------------------------------------ */

export default function MainMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bufferRef = useRef<HTMLSpanElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);

  // All live demo state lives in refs — the hero never re-renders React.
  const entities = useRef<Entity[]>([]);
  const lockedRef = useRef<number>(-1);
  const destroyedRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const spawnCountRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const widthRef = useRef<number>(0);
  const laneHRef = useRef<number>(32);
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    entities.current = Array.from({ length: SLOTS }, () => ({
      active: false,
      text: '',
      typed: 0,
      x: 0,
      speed: 0,
      isStart: false,
      spans: [],
    }));

    /* ---------- sizing ---------- */

    const measure = () => {
      widthRef.current = field.clientWidth;
      laneHRef.current = window.innerWidth < 640 ? 28 : 32;
      field.style.height = `${SLOTS * laneHRef.current}px`;
      for (let i = 0; i < SLOTS; i++) {
        const el = slotRefs.current[i];
        if (el) el.style.top = `${i * laneHRef.current}px`;
      }
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(field);

    /* ---------- spawning ---------- */

    const pickWord = () => {
      spawnCountRef.current += 1;
      // Every fifth word is the launch word, so finding it feels earned.
      if (spawnCountRef.current % 5 === 0) return 'start';
      return WORD_POOL[(Math.random() * WORD_POOL.length) | 0];
    };

    const spawn = (i: number) => {
      const e = entities.current[i];
      const el = slotRefs.current[i];
      if (!e || !el || e.active) return;

      const text = pickWord();
      e.text = text;
      e.typed = 0;
      e.isStart = text === 'start';
      e.x = widthRef.current;
      e.speed = reduced ? 0 : 20 + Math.random() * 18;
      e.active = true;

      const chars = text.split('').map((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        return s;
      });
      el.replaceChildren(...chars);
      e.spans = chars;

      el.classList.remove('is-dead', 'is-err');
      el.classList.toggle('is-launch', e.isStart);
      el.style.opacity = '1';
      el.style.transform = `translate3d(${e.x}px,0,0)`;
    };

    // Reduced motion: lay the words out once and leave them still.
    if (reduced) {
      for (let i = 0; i < SLOTS; i++) {
        spawn(i);
        const e = entities.current[i];
        const el = slotRefs.current[i];
        if (!e || !el) continue;
        e.x = widthRef.current * (0.12 + i * 0.13);
        el.style.transform = `translate3d(${e.x}px,0,0)`;
      }
    }

    /* ---------- loop ---------- */

    let last = performance.now();

    const pulseBase = () => {
      const b = baseRef.current;
      if (!b) return;
      b.classList.remove('is-hit');
      void b.offsetWidth;
      b.classList.add('is-hit');
    };

    const retire = (i: number, destroyed: boolean) => {
      const e = entities.current[i];
      const el = slotRefs.current[i];
      e.active = false;
      e.typed = 0;
      if (lockedRef.current === i) lockedRef.current = -1;
      if (!el) return;
      if (destroyed) el.classList.add('is-dead');
      else el.style.opacity = '0';
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!reduced) {
        spawnTimerRef.current -= dt;
        if (spawnTimerRef.current <= 0) {
          const free = entities.current.findIndex((e) => !e.active);
          if (free !== -1) spawn(free);
          spawnTimerRef.current = 1.2 + Math.random() * 0.9;
        }

        for (let i = 0; i < SLOTS; i++) {
          const e = entities.current[i];
          if (!e.active) continue;
          e.x -= e.speed * dt;

          const el = slotRefs.current[i];
          if (el) el.style.transform = `translate3d(${e.x}px,0,0)`;

          if (e.x <= 0) {
            retire(i, false);
            pulseBase();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    /* ---------- typing ---------- */

    const setBuffer = () => {
      const b = bufferRef.current;
      if (!b) return;
      const i = lockedRef.current;
      b.textContent =
        i === -1 ? '' : entities.current[i].text.slice(0, entities.current[i].typed);
    };

    const setCounter = (n: number) => {
      destroyedRef.current = n;
      if (counterRef.current) counterRef.current.textContent = String(n);
    };

    const flashError = (i: number) => {
      const el = slotRefs.current[i];
      const e = entities.current[i];
      e.spans.forEach((s) => s.classList.remove('hit'));
      e.typed = 0;
      if (!el) return;
      el.classList.remove('is-err');
      void el.offsetWidth;
      el.classList.add('is-err');
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

      const tag = (ev.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (ev.key === 'Enter') {
        ev.preventDefault();
        navigateRef.current('/play');
        return;
      }

      if (ev.key === 'Escape') {
        const i = lockedRef.current;
        if (i !== -1) flashError(i);
        lockedRef.current = -1;
        setBuffer();
        return;
      }

      if (ev.key === 'Backspace') {
        const i = lockedRef.current;
        if (i !== -1) {
          const e = entities.current[i];
          if (e.typed > 0) {
            e.typed -= 1;
            e.spans[e.typed].classList.remove('hit');
          }
          if (e.typed === 0) lockedRef.current = -1;
          setBuffer();
        }
        return;
      }

      if (ev.key.length !== 1) return; // Tab and arrows stay with the browser
      const key = ev.key.toLowerCase();
      if (key < 'a' || key > 'z') return;

      let target = lockedRef.current;

      if (target === -1) {
        // Nothing locked: take the word closest to the base starting with this key.
        let bestX = Infinity;
        for (let i = 0; i < SLOTS; i++) {
          const e = entities.current[i];
          if (!e.active || e.typed !== 0) continue;
          if (e.text[0] !== key) continue;
          if (e.x < bestX) {
            bestX = e.x;
            target = i;
          }
        }
        if (target === -1) return;
        lockedRef.current = target;
      }

      const e = entities.current[target];
      if (e.text[e.typed] !== key) {
        flashError(target);
        lockedRef.current = -1;
        setBuffer();
        return;
      }

      e.spans[e.typed].classList.add('hit');
      e.typed += 1;
      setBuffer();

      if (e.typed === e.text.length) {
        const launch = e.isStart;
        retire(target, true);
        setCounter(destroyedRef.current + 1);
        setBuffer();
        if (launch) window.setTimeout(() => navigateRef.current('/play'), 160);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="dashed-grid ttd-container">
      <style>{`
        /* ----- Plain CSS Layout & UI ----- */
        .ttd-container {
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          width: 100%;
          overflow-x: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          color: white;
        }

        .ttd-header {
          margin: 0 auto;
          width: 100%;
          max-width: 1280px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ttd-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ttd-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(194,247,81,0.2);
          background: rgba(194,247,81,0.1);
          box-shadow: 0 0 15px rgba(194,247,81,0.1);
        }
        .ttd-logo-text {
          font-family: var(--font-display, sans-serif);
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 0.05em;
          color: white;
        }
        .ttd-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-weight: 500;
        }
        .ttd-btn-ghost {
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .ttd-btn-ghost:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .ttd-btn-outline {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ttd-btn-outline:hover {
          background: rgba(255,255,255,0.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .ttd-main {
          margin: 0 auto;
          display: flex;
          width: 100%;
          max-width: 1280px;
          flex: 1;
          align-items: center;
          padding: 48px 32px;
        }
        .ttd-grid {
          display: grid;
          width: 100%;
          gap: 64px;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .ttd-grid {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
          }
        }

        .ttd-left {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .ttd-title {
          font-family: var(--font-display, sans-serif);
          font-size: clamp(48px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
        }
        .ttd-desc {
          font-size: 18px;
          line-height: 1.6;
          color: #aaa;
          max-width: 500px;
          margin: 0;
        }
        .ttd-actions {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: flex-start;
          margin-top: 8px;
        }
        @media (min-width: 640px) {
          .ttd-actions {
            flex-direction: row;
            align-items: center;
          }
        }

        .ttd-btn-play {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #C2F751;
          color: #080810;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(194,247,81,0.25);
          transition: all 0.3s ease;
        }
        .ttd-btn-play:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 35px rgba(194,247,81,0.4);
        }
        .ttd-enter {
          background: rgba(0,0,0,0.15);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: bold;
          transition: background 0.2s ease;
        }
        .ttd-btn-play:hover .ttd-enter {
          background: rgba(0,0,0,0.25);
        }

        .ttd-secondary-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ttd-btn-sec {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ttd-btn-sec:hover {
          background: rgba(255,255,255,0.1);
        }

        .ttd-right {
          position: relative;
          background: rgba(15,17,35,0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .ttd-blob-1 {
          position: absolute;
          top: -80px;
          right: -80px;
          width: 256px;
          height: 256px;
          border-radius: 50%;
          background: rgba(194,247,81,0.1);
          filter: blur(80px);
          pointer-events: none;
        }
        .ttd-blob-2 {
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 256px;
          height: 256px;
          border-radius: 50%;
          background: rgba(97,218,251,0.1);
          filter: blur(80px);
          pointer-events: none;
        }

        .ttd-panel-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
        }
        .ttd-panel-desc {
          font-size: 14px;
          color: #999;
          margin: 0;
        }
        .ttd-score-box {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .ttd-score-num {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }
        .ttd-score-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
        }

        .ttd-panel-main {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: stretch;
          gap: 20px;
        }
        .ttd-base-line {
          position: relative;
          width: 3px;
          flex-shrink: 0;
          border-radius: 4px;
          background: rgba(194,247,81,0.8);
          box-shadow: 0 0 10px rgba(194,247,81,0.4);
        }
        .ttd-field-wrap {
          min-width: 0;
          flex: 1;
          padding: 4px 0;
        }

        .ttd-panel-footer {
          position: relative;
          z-index: 10;
          display: flex;
          min-height: 28px;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .ttd-buffer {
          font-family: var(--font-mono, monospace);
          font-size: 17px;
          font-weight: 500;
          color: #C2F751;
        }
        .ttd-hint {
          font-size: 12px;
          color: #666;
        }
        .ttd-hint span {
          color: rgba(194,247,81,0.8);
        }

        .ttd-footer {
          margin: 0 auto;
          display: flex;
          width: 100%;
          max-width: 1280px;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          font-size: 14px;
          color: #666;
        }
        .ttd-footer span span {
          color: #999;
        }

        /* ----- Demo Canvas CSS ----- */
        .ttd-field { position: relative; width: 100%; overflow: hidden; }
        .ttd-word {
          position: absolute;
          left: 0;
          white-space: nowrap;
          font-family: var(--font-mono, monospace);
          font-size: 16px;
          letter-spacing: 0.02em;
          will-change: transform;
          opacity: 0;
        }
        @media (max-width: 639px) { .ttd-word { font-size: 14px; } }
        .ttd-word span { color: rgba(255,255,255,0.32); transition: color 90ms linear; }
        .ttd-word span.hit { color: #C2F751; }
        .ttd-word.is-launch span { color: rgba(194,247,81,0.5); }
        .ttd-word.is-launch span.hit { color: #C2F751; }
        .ttd-word.is-dead { animation: ttd-burst 200ms ease-out forwards; }
        .ttd-word.is-err { animation: ttd-shake 170ms ease-in-out; }
        @keyframes ttd-burst {
          from { opacity: 1; }
          to   { opacity: 0; filter: blur(3px); }
        }
        @keyframes ttd-shake {
          0%,100% { margin-left: 0; }
          25% { margin-left: -4px; }
          75% { margin-left: 4px; }
        }
        .ttd-base.is-hit::after {
          content: '';
          position: absolute;
          inset: -2px -4px;
          border-radius: 4px;
          background: #C2F751;
          animation: ttd-flash 320ms ease-out forwards;
        }
        @keyframes ttd-flash { from { opacity: 0.55; } to { opacity: 0; } }
        .ttd-caret {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: #C2F751;
          vertical-align: -0.14em;
          animation: ttd-blink 1.05s steps(1) infinite;
        }
        @keyframes ttd-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .ttd-word.is-dead, .ttd-word.is-err, .ttd-caret, .ttd-base.is-hit::after { animation: none; }
        }
      `}</style>

      {/* ---------- Header ---------- */}
      <header className="ttd-header">
        <div className="ttd-header-left">
          <div className="ttd-logo-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#C2F751" fillRule="evenodd" clipRule="evenodd" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22H22V18H18V8H20V2H16V6H14V2H10V6H8V2H4V8H6V18H2V22ZM9 10H15V12H13V16H11V12H9V10Z" />
            </svg>
          </div>
          <span className="ttd-logo-text">TTD</span>
        </div>

        <nav className="ttd-header-right">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa' }}>
                <UserIcon size={16} />
                <span style={{ color: 'white', fontWeight: 600 }}>{user.username}</span>
              </div>
              <button onClick={logout} className="ttd-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="ttd-btn-ghost">
                Sign in
              </button>
              <button onClick={() => navigate('/register')} className="ttd-btn-outline">
                Create account
              </button>
            </>
          )}
        </nav>
      </header>

      {/* ---------- Main ---------- */}
      <main className="ttd-main">
        <div className="ttd-grid">
          
          {/* Left: title, copy, actions */}
          <div className="ttd-left">
            <h1 className="ttd-title">
              Typing <br /> Tower Defense
            </h1>

            <p className="ttd-desc">
              Fifteen waves of words advance on your base. Clear them fast enough and the
              game speeds up to match you, so the pressure tracks your real words per
              minute. Later waves swap English for code keywords.
            </p>

            <div className="ttd-actions">
              <button onClick={() => navigate('/play')} className="ttd-btn-play">
                <span>Start game</span>
                <span className="ttd-enter">Enter ↵</span>
              </button>

              <div className="ttd-secondary-actions">
                <button onClick={() => navigate('/leaderboard')} className="ttd-btn-sec">
                  Leaderboard
                </button>
                <button onClick={() => navigate('/dashboard')} className="ttd-btn-sec">
                  Your stats
                </button>
              </div>
            </div>
          </div>

          {/* Right: playable field */}
          <section className="ttd-right">
            <div className="ttd-blob-1" />
            <div className="ttd-blob-2" />
            
            <div className="ttd-panel-header">
              <p className="ttd-panel-desc">
                Type a word to destroy it before it reaches the line.
              </p>
              <div className="ttd-score-box">
                <span ref={counterRef} className="ttd-score-num">0</span>
                <span className="ttd-score-label">destroyed</span>
              </div>
            </div>

            <div className="ttd-panel-main">
              <div ref={baseRef} className="ttd-base-line" aria-hidden="true" />
              <div className="ttd-field-wrap">
                <div ref={fieldRef} className="ttd-field" aria-hidden="true">
                  {Array.from({ length: SLOTS }).map((_, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        slotRefs.current[i] = el;
                      }}
                      className="ttd-word"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="ttd-panel-footer">
              <span className="ttd-buffer">
                <span ref={bufferRef} />
                <span className="ttd-caret" />
              </span>
              <span className="ttd-hint">
                Complete <span>start</span> to launch
              </span>
            </div>
          </section>

        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="ttd-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span>
            Built by <span>Rami Bendifallah</span>
          </span>
          <a 
            href="https://github.com/Bendifallah-Rami/Typing-Tower-Defense" 
            target="_blank" 
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#999', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C2F751'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
          >
            <Star size={14} /> If you enjoy the game, please consider giving it a star on GitHub!
          </a>
        </div>
        <span>React, Canvas, TypeScript</span>
      </footer>
    </div>
  );
}
