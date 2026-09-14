import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl bg-bg-input border border-border
    text-text-primary placeholder-text-muted outline-none
    focus:border-border-accent focus:ring-2 focus:ring-accent/10
    transition-all font-mono text-sm`;

  return (
    <div className="w-full h-full flex items-center justify-center dashed-grid">
      <div className="fixed top-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      {/* Form card — 400px is the sweet spot for login forms */}
      <div className="w-full max-w-[420px] mx-6 animate-scale-in">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors mb-7 cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="glass-elevated rounded-2xl p-8">
          {/* Header */}
          <div className="mb-7">
            <h1
              className="text-2xl font-bold text-text-primary mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-text-secondary text-sm">Sign in to save your scores</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-text-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-danger-dim border border-danger/20 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-accent-text font-bold rounded-xl text-sm
                         hover:bg-accent-hover transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-1"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            No account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-accent hover:text-accent-hover transition-colors cursor-pointer font-semibold"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
