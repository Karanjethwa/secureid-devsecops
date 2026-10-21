import React, { useState } from 'react';
import { UserPlus, ArrowRight, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AlertNotice } from '../components/AlertNotice';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      setIsLoading(false);
      return;
    }

    try {
      const msg = await register(formData);
      setStatusMessage({ type: 'success', text: msg });
      setFormData({ name: '', email: '', username: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden flex items-center justify-center px-5 py-14">
      <div className="hero-glow !left-1/2 !top-0 opacity-60" />
      <div className="cyber-grid opacity-30" />

      <div className="relative w-full max-w-md z-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <UserPlus size={26} />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Create Digital Identity</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Register your verifiable credential. Academic demo only — do not enter real government identity details.
          </p>
        </div>

        <div className="panel p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="student@demo.local"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="e.g. jdoe_dev"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input-field !pr-10"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input-field"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            {statusMessage && (
              <AlertNotice type={statusMessage.type} message={statusMessage.text} />
            )}

            <button
              type="submit"
              className="button-primary w-full justify-center !py-3 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Hashing & Securing...' : 'Create Secure Identity'}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-white/6 bg-white/[0.02] p-3 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Passwords are salted and cryptographically hashed with bcrypt (cost factor 10).</span>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already registered?{' '}
            <button className="text-cyan-300 hover:text-cyan-200 font-semibold" onClick={() => onNavigate('/login')}>
              Log in to portal
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};
