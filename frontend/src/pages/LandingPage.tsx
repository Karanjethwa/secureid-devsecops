import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  History,
  Lock,
  ArrowRight,
  UserPlus,
  KeyRound,
  Check,
  Shield,
  Server,
  Database,
  Cpu,
  Workflow,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <main className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="hero-glow" />
      <div className="cyber-grid" />

      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="max-w-2xl z-10">
          <div className="eyebrow mb-6">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            College DevSecOps Microproject Prototype
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-cyan-400/90">
            Secure Digital Identity Management System (SDIMS)
          </p>

          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Your Identity.{' '}
            <span className="block text-cyan-300">Protected by design.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            A functional, resilient digital identity management platform demonstrating secure password hashing, protected HTTP-only sessions, real-time login monitoring, least-privilege RBAC, and automated DevSecOps pipelines.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button className="button-primary" onClick={() => onNavigate('/register')}>
              <UserPlus size={18} />
              <span>Get started</span>
              <ArrowRight size={17} />
            </button>

            <button className="button-secondary" onClick={() => onNavigate('/login')}>
              <KeyRound size={18} />
              <span>Login to portal</span>
            </button>

            <button className="button-secondary" onClick={() => onNavigate('/pipeline')}>
              <Workflow size={18} />
              <span>Explore DevSecOps</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            {['Bcrypt password hashing', 'HTTP-only cookie sessions', 'Least-privilege RBAC', 'Automated SAST & Trivy'].map((f) => (
              <span key={f} className="flex items-center gap-2">
                <Check size={16} className="text-emerald-400" />
                <span>{f}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Security Monitor Floating Mockup */}
        <div className="relative mx-auto w-full max-w-lg z-10">
          <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/5 blur-2xl pointer-events-none" />
          <div className="panel overflow-hidden border border-white/12 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400/80" />
                <span className="size-2.5 rounded-full bg-amber-300/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                Security Monitor
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-5">
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-slate-400">Active Architecture</p>
                  <p className="mt-1 text-xl font-semibold text-white">Full-Stack Controls Online</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">Authentication layer</span>
                  <span className="font-mono text-xs text-emerald-300 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Express + JWT Active
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">Password storage</span>
                  <span className="font-mono text-xs text-cyan-300">bcrypt (10 rounds)</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">Access policy</span>
                  <span className="font-mono text-xs text-slate-200">Server RBAC (Admin / User)</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.025] px-4 py-3">
                  <span className="text-sm text-slate-400">Database security</span>
                  <span className="font-mono text-xs text-slate-200">Parameterized SQLite Bindings</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3.5">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-300">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Secure Demonstration Environment Connected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="border-t border-white/8 bg-[#07111f] relative z-10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="section-label">Core capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              One identity security workspace
            </h2>
            <p className="mt-3 text-slate-400">
              Connected demonstration modules designed for transparent faculty review and laboratory evaluation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: <UserCheck size={22} />,
                title: 'Digital Identity',
                desc: 'Review formatted digital identity tokens (SDI-XXXXXX), metadata, and permitted profile updates.',
                path: '/profile',
              },
              {
                icon: <History size={22} />,
                title: 'Login Monitoring',
                desc: 'Audit real-time authentication events, client IPs, browser fingerprints, and risk indicators.',
                path: '/activity',
              },
              {
                icon: <ShieldCheck size={22} />,
                title: 'Security Center',
                desc: 'Inspect active controls, test suspicious-login triggers, and monitor failed login thresholds.',
                path: '/security',
              },
              {
                icon: <Lock size={22} />,
                title: 'Access Management',
                desc: 'Demonstrate server-enforced role-based access control, account suspensions, and audit logs.',
                path: '/admin-login',
              },
            ].map((card) => (
              <button
                key={card.title}
                className="panel group p-6 text-left transition hover:-translate-y-1 hover:border-cyan-400/30 flex flex-col justify-between"
                onClick={() => onNavigate(card.path)}
              >
                <div>
                  <span className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300 group-hover:bg-cyan-300/20 transition">
                    {card.icon}
                  </span>
                  <span className="mt-5 block font-semibold text-white group-hover:text-cyan-300 transition">
                    {card.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-400">
                    {card.desc}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 gap-1 opacity-80 group-hover:opacity-100">
                  <span>Explore module</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Layer System Architecture Diagram */}
      <section className="border-y border-white/8 bg-[#091523] relative z-10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="section-label">System architecture</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Security at every layer
            </h2>
            <p className="mt-3 text-slate-400">
              A clear, auditable multi-tier architecture built for classroom explanation and production cloud portability.
            </p>
          </div>

          <div className="grid items-center gap-3 sm:grid-cols-5">
            {[
              { icon: <UserCheck size={20} />, label: 'User Client', layer: 'Layer 01', desc: 'Secure Browser' },
              { icon: <Cpu size={20} />, label: 'Frontend UI', layer: 'Layer 02', desc: 'React 18 + Vite' },
              { icon: <Server size={20} />, label: 'Backend API', layer: 'Layer 03', desc: 'Node.js Express' },
              { icon: <Shield size={20} />, label: 'Auth & RBAC', layer: 'Layer 04', desc: 'Bcrypt + JWT Cookie' },
              { icon: <Database size={20} />, label: 'Database', layer: 'Layer 05', desc: 'SQLite / PostgreSQL' },
            ].map((step, idx) => (
              <div key={step.label} className="contents">
                <div className="relative flex min-h-36 flex-col items-center justify-center rounded-xl border border-white/8 bg-[#0b1929] p-5 text-center transition hover:border-cyan-400/20">
                  <span className="mb-2.5 text-cyan-300">{step.icon}</span>
                  <span className="text-sm font-semibold text-slate-100">{step.label}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{step.desc}</span>
                  <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-cyan-400/80">
                    {step.layer}
                  </span>
                  {idx < 4 && (
                    <ChevronRight
                      className="absolute -right-[18px] z-20 hidden text-cyan-400/50 sm:block"
                      size={18}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG 9 Alignment & College Attribution */}
      <section className="bg-[#07111f] relative z-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-8">
          <div className="grid size-36 place-items-center rounded-3xl border border-cyan-300/30 bg-cyan-300/[0.08] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)] mx-auto lg:mx-0">
            <span className="text-center font-mono text-3xl font-bold leading-tight">
              SDG
              <br />
              <span className="text-4xl text-white">09</span>
            </span>
          </div>

          <div>
            <p className="section-label">Sustainable development goal</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Aligned with UN SDG 9 — Industry, Innovation & Infrastructure
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              This DevSecOps microproject explores resilient digital public infrastructure by engineering secure identity management, least-privilege role boundaries, automated vulnerability scanning via Trivy & SonarQube, and immutable container deployment.
            </p>
            <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-cyan-300 font-bold">Course:</span> DevSecOps Lab · Shah & Anchor Kutchhi Engineering College
              </div>
              <div>
                <span className="text-cyan-300 font-bold">Academic Year:</span> 2026–2027
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
