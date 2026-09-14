import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import './RegisterScreen.css';

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
    if (!username || !email || !password || !confirmPassword) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      navigate('/login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Username', value: username, setter: setUsername, type: 'text', placeholder: 'speedtyper42' },
    { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
    { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Min. 8 characters' },
    { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '••••••••' },
  ] as const;

  return (
    <div className="register-container dashed-grid">
      <div className="register-bg-glow" />

      <div className="register-content animate-scale-in">

        <button
          onClick={() => navigate('/')}
          className="register-back-btn group"
        >
          <ChevronLeft />
          <span className="register-back-text">Back</span>
        </button>

        <div className="register-card glass-elevated">
          <div className="register-header">
            <h1 className="register-title">
              Create Account
            </h1>
            <p className="register-subtitle">Join the global leaderboard</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {fields.map(({ label, value, setter, type, placeholder }) => (
              <div key={label} className="register-field-group">
                <label className="register-label">
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="register-input"
                  placeholder={placeholder}
                />
              </div>
            ))}

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="register-btn-submit"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="register-footer">
            Have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="register-link"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
