import { useNavigate } from 'react-router-dom';
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

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect to backend
      // const response = await api.login({ email, password });
      // localStorage.setItem('token', response.accessToken);

      // For now, simulate
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center dot-pattern">
      {/* Ambient glow */}
      <div className="fixed top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md mx-4 animate-scale-in">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>

        <div className="glass-elevated rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary text-sm">Sign in to save your scores</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border
                           text-text-primary placeholder-text-muted outline-none
                           focus:border-border-accent focus:ring-1 focus:ring-accent/30
                           transition-all font-mono text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border
                           text-text-primary placeholder-text-muted outline-none
                           focus:border-border-accent focus:ring-1 focus:ring-accent/30
                           transition-all font-mono text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-danger-dim border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent text-accent-text font-bold rounded-xl
                         hover:bg-accent-hover transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-accent hover:text-accent-hover transition-colors cursor-pointer font-semibold"
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
