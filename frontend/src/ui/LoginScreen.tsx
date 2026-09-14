import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import './LoginScreen.css';

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

  return (
    <div className="login-container dashed-grid">
      <div className="login-bg-glow" />

      {/* Form card */}
      <div className="login-content animate-scale-in">

        <button
          onClick={() => navigate('/')}
          className="login-back-btn group"
        >
          <ChevronLeft />
          <span className="login-back-text">Back</span>
        </button>

        <div className="login-card glass-elevated">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              Welcome Back
            </h1>
            <p className="login-subtitle">Sign in to save your scores</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label className="login-label">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="your@email.com"
              />
            </div>

            <div className="login-field-group">
              <label className="login-label">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-btn-submit"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="login-footer">
            No account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="login-link"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
