import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect to backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center dot-pattern overflow-y-auto">
      {/* Ambient glow */}
      <div className="fixed top-[-100px] left-[-80px] w-[350px] h-[350px] rounded-full bg-info/6 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md mx-4 my-8 animate-scale-in">
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary text-sm">Join the leaderboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-muted mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border
                           text-text-primary placeholder-text-muted outline-none
                           focus:border-border-accent focus:ring-1 focus:ring-accent/30
                           transition-all font-mono text-sm"
                placeholder="speedtyper42"
              />
            </div>

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
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-muted mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-accent hover:text-accent-hover transition-colors cursor-pointer font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
