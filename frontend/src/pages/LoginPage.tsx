import React, { useState } from 'react';
import { Lock, UserCheck, ShieldCheck, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AlertNotice } from '../components/AlertNotice';
import { Modal } from '../components/Modal';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  initialRole?: 'user' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialRole = 'user' }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'user' | 'admin'>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await login({ identifier, password });
      if (role === 'admin' && user.role !== 'admin') {
        throw new Error('These credentials do not have administrator privileges. Please switch to User login.');
      }
      if (role === 'user' && user.role === 'admin') {
        // Admin logged into user tab - allowed, but let's navigate to dashboard
      }
      onNavigate(user.role === 'admin' && role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (accRole: 'user' | 'admin') => {
    setRole(accRole);
    if (accRole === 'admin') {
      setIdentifier('admin_demo');
      setPassword('DemoAdmin123!');
    } else {
      setIdentifier('user_demo');
      setPassword('DemoUser123!');
    }
    setError(null);
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden flex items-center justify-center px-5 py-14">
      <div className="hero-glow !left-1/2 !top-0 opacity-60" />
      <div className="cyber-grid opacity-30" />

      <div className="relative w-full max-w-md z-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Lock size={26} />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {role === 'admin' ? 'Administrator Portal' : 'User Authentication'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {role === 'admin'
              ? 'Authorized administrative oversight and policy management access.'
              : 'Sign in to access your digital identity and security monitoring.'}
          </p>
        </div>

        <div className="panel p-6 sm:p-8">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Select Account Tier
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/8 bg-black/30 p-1.5">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition ${
                  role === 'user'
                    ? 'bg-cyan-300 text-[#08202c] shadow-lg shadow-cyan-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => {
                  setRole('user');
                  setError(null);
                }}
              >
                <UserCheck size={16} /> User
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition ${
                  role === 'admin'
                    ? 'bg-cyan-300 text-[#08202c] shadow-lg shadow-cyan-400/20'
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => {
                  setRole('admin');
                  setError(null);
                }}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                {role === 'admin' ? 'Admin Username or Email' : 'Username or Email'}
              </label>
              <input
                type="text"
                className="input-field"
                placeholder={role === 'admin' ? 'e.g. admin_demo' : 'e.g. user_demo or student@demo.local'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-cyan-300 hover:text-cyan-200 transition"
                  onClick={() => setForgotModalOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field !pr-10"
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password view"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <AlertNotice type="error" message={error} />}

            <button
              type="submit"
              className="button-primary w-full justify-center !py-3 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : `Sign In as ${role === 'admin' ? 'Administrator' : 'User'}`}
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Demo Quick-Fill
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Click to prefill</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-left hover:border-cyan-400/40 hover:bg-cyan-400/10 transition"
                onClick={() => handleQuickFill('user')}
              >
                <p className="text-xs font-bold text-white">Student User</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">user_demo</p>
              </button>

              <button
                type="button"
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-left hover:border-cyan-400/40 hover:bg-cyan-400/10 transition"
                onClick={() => handleQuickFill('admin')}
              >
                <p className="text-xs font-bold text-cyan-300">Administrator</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">admin_demo</p>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Need an account?{' '}
            <button className="text-cyan-300 hover:text-cyan-200 font-semibold" onClick={() => onNavigate('/register')}>
              Register digital identity
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Password Recovery Notice"
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      >
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            In this academic DevSecOps demonstration, automated SMTP email dispatch is disabled for security and sandboxing reasons.
          </p>
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 font-mono text-xs text-slate-300">
            <p className="text-cyan-300 font-bold mb-1">Demo Credentials:</p>
            <p>Admin: admin_demo / DemoAdmin123!</p>
            <p>Student: user_demo / DemoUser123!</p>
          </div>
          <button
            className="button-primary w-full justify-center mt-4"
            onClick={() => setForgotModalOpen(false)}
          >
            Understood
          </button>
        </div>
      </Modal>
    </main>
  );
};
