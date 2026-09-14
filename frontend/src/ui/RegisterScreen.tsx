import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
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

  const inputCls = `w-full px-4 py-3 rounded-xl bg-bg-input border border-border
    text-text-primary placeholder-text-muted outline-none
    focus:border-border-accent focus:ring-2 focus:ring-accent/10
    transition-all font-mono text-sm`;

  const fields = [
    { label: 'Username', value: username, setter: setUsername, type: 'text', placeholder: 'speedtyper42' },
    { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
    { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Min. 8 characters' },
    { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '••••••••' },
  ] as const;

  return (
    <div className="w-full h-full flex items-center justify-center dashed-grid overflow-y-auto">
      <div className="fixed top-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full bg-info/4 blur-[110px] pointer-events-none" />

      <div className="w-full max-w-[420px] mx-6 my-8 animate-scale-in">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors mb-7 cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="glass-elevated rounded-2xl p-8">
          <div className="mb-7">
            <h1
              className="text-2xl font-bold text-text-primary mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Create Account
            </h1>
            <p className="text-text-secondary text-sm">Join the global leaderboard</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ label, value, setter, type, placeholder }) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-text-muted mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={inputCls}
                  placeholder={placeholder}
                />
              </div>
            ))}

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
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-accent hover:text-accent-hover transition-colors cursor-pointer font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
