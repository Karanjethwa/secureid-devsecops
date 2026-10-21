import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  UserCheck,
  History,
  Lock,
  Workflow,
  Users,
  LogOut,
  Menu,
  X,
  Cpu,
  FileText,
  CheckCircle2,
  BrainCircuit,
  Boxes
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    onNavigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand Logo */}
        <button
          className="flex items-center gap-3 text-left focus:outline-none"
          onClick={() => handleNav('/')}
        >
          <span className="grid size-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Shield size={22} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">SecureID</span>
            <span className="hidden text-xs text-slate-400 sm:block">Digital Identity System</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {user ? (
            <>
              <button
                className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}
                onClick={() => handleNav('/dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/profile' ? 'active' : ''}`}
                onClick={() => handleNav('/profile')}
              >
                <UserCheck size={16} />
                <span>Identity</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/activity' ? 'active' : ''}`}
                onClick={() => handleNav('/activity')}
              >
                <History size={16} />
                <span>Activity</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/security' ? 'active' : ''}`}
                onClick={() => handleNav('/security')}
              >
                <Lock size={16} />
                <span>Security</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/analyzer' ? 'active' : ''}`}
                onClick={() => handleNav('/analyzer')}
              >
                <BrainCircuit size={16} />
                <span>AI Analyzer</span>
              </button>

              {user.role === 'admin' && (
                <button
                  className={`nav-link ${currentPath === '/admin' || currentPath === '/admin/users' ? 'active' : ''}`}
                  onClick={() => handleNav('/admin')}
                >
                  <Users size={16} className="text-cyan-400" />
                  <span className="text-cyan-300 font-semibold">Admin</span>
                </button>
              )}

              <button
                className={`nav-link ${currentPath === '/pipeline' ? 'active' : ''}`}
                onClick={() => handleNav('/pipeline')}
              >
                <Workflow size={16} />
                <span>Pipeline</span>
              </button>

              <button
                className="button-secondary ml-3 !px-3.5 !py-1.5 text-xs text-rose-300 hover:text-rose-200 hover:border-rose-400/40"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-link ${currentPath === '/pipeline' ? 'active' : ''}`}
                onClick={() => handleNav('/pipeline')}
              >
                <Workflow size={15} />
                <span>DevSecOps</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/architecture' ? 'active' : ''}`}
                onClick={() => handleNav('/architecture')}
              >
                <Boxes size={15} />
                <span>Architecture</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/vulnerability-report' ? 'active' : ''}`}
                onClick={() => handleNav('/vulnerability-report')}
              >
                <FileText size={15} />
                <span>Reports</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/testing' ? 'active' : ''}`}
                onClick={() => handleNav('/testing')}
              >
                <CheckCircle2 size={15} />
                <span>Testing</span>
              </button>

              <button
                className={`nav-link ${currentPath === '/admin-login' ? 'active' : ''}`}
                onClick={() => handleNav('/admin-login')}
              >
                <Lock size={15} className="text-cyan-400" />
                <span>Admin</span>
              </button>

              <button
                className="button-secondary ml-2 !px-4 !py-2 text-xs"
                onClick={() => handleNav('/login')}
              >
                Sign In
              </button>

              <button
                className="button-primary ml-2 !px-4 !py-2 text-xs"
                onClick={() => handleNav('/register')}
              >
                Register
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle Navigation Menu"
          className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-300 md:hidden hover:bg-white/5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#07111f] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/dashboard')}
                >
                  <LayoutDashboard size={17} /> Dashboard
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/profile')}
                >
                  <UserCheck size={17} /> Digital Identity
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/activity')}
                >
                  <History size={17} /> Login Activity
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/security')}
                >
                  <Lock size={17} /> Security Center
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/analyzer')}
                >
                  <BrainCircuit size={17} /> AI Security Analyzer
                </button>

                {user.role === 'admin' && (
                  <>
                    <button
                      className="rounded-lg px-4 py-2.5 text-left text-sm text-cyan-300 hover:bg-white/5 flex items-center gap-2.5 font-semibold"
                      onClick={() => handleNav('/admin')}
                    >
                      <Users size={17} /> Admin Dashboard
                    </button>
                    <button
                      className="rounded-lg px-4 py-2.5 text-left text-sm text-cyan-300 hover:bg-white/5 flex items-center gap-2.5 font-semibold"
                      onClick={() => handleNav('/admin/users')}
                    >
                      <Users size={17} /> User Management
                    </button>
                  </>
                )}

                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/pipeline')}
                >
                  <Workflow size={17} /> DevSecOps Pipeline
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/architecture')}
                >
                  <Boxes size={17} /> Architecture
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/vulnerability-report')}
                >
                  <FileText size={17} /> Vulnerability Report
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/testing')}
                >
                  <CheckCircle2 size={17} /> System Testing
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 mt-2 border-t border-white/5 pt-3"
                  onClick={handleLogout}
                >
                  <LogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/pipeline')}
                >
                  <Workflow size={17} /> DevSecOps Pipeline
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/architecture')}
                >
                  <Boxes size={17} /> System Architecture
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/vulnerability-report')}
                >
                  <FileText size={17} /> Vulnerability Report
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/testing')}
                >
                  <CheckCircle2 size={17} /> System Testing
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-cyan-300 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/admin-login')}
                >
                  <Lock size={17} /> Admin Login
                </button>
                <button
                  className="rounded-lg px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
                  onClick={() => handleNav('/login')}
                >
                  Sign In
                </button>
                <button
                  className="button-primary text-center justify-center mt-2"
                  onClick={() => handleNav('/register')}
                >
                  Create Secure Account
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
