import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MainMenu() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden dot-pattern">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[350px] h-[350px] rounded-full bg-info/8 blur-[100px] pointer-events-none" />

      {/* Floating accent orb (like portfolio) */}
      <div className="absolute top-1/4 right-[15%] w-[120px] h-[120px] rounded-full bg-accent/80 blur-[2px] animate-float pointer-events-none" />

      {/* Content */}
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-text-secondary">
              A Typing Experience
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-text-primary leading-none">
            Typing
          </h1>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            <span className="text-accent">Tower</span>{' '}
            <span className="text-text-primary">Defense</span>
          </h1>

          <p className="text-text-secondary text-lg max-w-md text-center mt-2 leading-relaxed">
            Type words to destroy enemies before they reach your base.
            Difficulty adapts to your speed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={() => navigate('/play')}
            className="group relative px-12 py-4 bg-accent text-accent-text font-bold text-lg rounded-full
                       hover:bg-accent-hover transition-all duration-300 hover:scale-105
                       shadow-[0_0_30px_rgba(194,247,81,0.3)] hover:shadow-[0_0_50px_rgba(194,247,81,0.5)]
                       active:scale-95 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
              </svg>
              Start Game
            </span>
          </button>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate('/leaderboard')}
              className="glass px-6 py-2.5 rounded-full text-sm font-medium text-text-primary
                         hover:border-border-accent hover:text-accent transition-all duration-300
                         cursor-pointer hover:scale-105"
            >
              🏆 Leaderboard
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="glass px-6 py-2.5 rounded-full text-sm font-medium text-text-primary
                         hover:border-border-accent hover:text-accent transition-all duration-300
                         cursor-pointer hover:scale-105"
            >
              📊 Dashboard
            </button>
          </div>
        </div>

        {/* Auth link */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => navigate('/login')}
            className="text-text-secondary text-sm hover:text-accent transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <span className="text-text-muted">•</span>
          <button
            onClick={() => navigate('/register')}
            className="text-text-secondary text-sm hover:text-accent transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* Stats preview pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: '15 Waves', icon: '🌊' },
            { label: 'Adaptive AI', icon: '🧠' },
            { label: 'Code Words', icon: '💻' },
            { label: 'Real-time WPM', icon: '⚡' },
          ].map((item) => (
            <div
              key={item.label}
              className="glass px-4 py-2 rounded-full text-xs font-medium text-text-secondary
                         flex items-center gap-2"
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-6 flex items-center gap-2 text-text-muted text-xs">
        <span>Built with</span>
        <span className="text-accent">♥</span>
        <span>by Rami Bendifallah</span>
        <span className="mx-2">•</span>
        <span>React + Canvas + TypeScript</span>
      </div>
    </div>
  );
}
