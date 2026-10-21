import React, { useState, useEffect } from 'react';
import {
  Clock,
  Shield,
  Activity as ActivityIcon,
  CheckCircle2,
  XCircle,
  UserCheck,
  History,
  Lock,
  ArrowRight,
  BrainCircuit,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { activityApi, userApi } from '../services/api';
import { LoginActivity } from '../types';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [recentActivity, setRecentActivity] = useState<LoginActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshUser();
        const actData = await activityApi.getList({ limit: 6 });
        setRecentActivity(actData.activity || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const sdiId = user?.sdiId || `SDI-${String(user?.id || 1).padStart(6, '0')}`;
  const totalLogins = user?.stats?.totalLogins ?? 0;
  const successfulLogins = user?.stats?.successfulLogins ?? 0;
  const failedLogins = user?.stats?.failedLogins ?? 0;

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      {/* Welcome & Live Clock Header */}
      <div className="mb-9">
        <p className="section-label">Secure portal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 text-slate-400">
          Your authenticated identity session is active under least-privilege role policies.
        </p>
      </div>

      {/* Clock Banner */}
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
            <Clock size={18} />
          </span>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              System Time (UTC/Local)
            </p>
            <p className="text-sm font-semibold text-slate-200">
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'full',
                timeStyle: 'medium',
              }).format(currentTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="status-chip">
            <span className="size-1.5 rounded-full bg-emerald-400 pulse-dot" />
            HTTP-Only Cookie Authenticated
          </span>
          <span className="role-chip">{user?.role}</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Fingerprint size={22} />}
          label="Digital Identity Token"
          value={sdiId}
          detail="Cryptographic Identity Reference"
          badge={<StatusBadge status={user?.verification_status || 'Verified (Demo)'} />}
        />

        <StatCard
          icon={<ActivityIcon size={22} />}
          label="Total Login Events"
          value={totalLogins}
          detail="Audited system attempts"
        />

        <StatCard
          icon={<CheckCircle2 size={22} className="text-emerald-400" />}
          label="Successful Logins"
          value={successfulLogins}
          detail="Authorized credentials"
          trend="Healthy"
        />

        <StatCard
          icon={<XCircle size={22} className="text-rose-400" />}
          label="Failed Attempts"
          value={failedLogins}
          detail={failedLogins > 0 ? 'Recorded in security audit' : 'Zero unauthorized attempts'}
          trend={failedLogins > 2 ? 'Review' : undefined}
        />
      </div>

      {/* Quick Shortcuts */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <button
          className="panel p-5 text-left transition hover:border-cyan-400/30 flex items-center justify-between group"
          onClick={() => onNavigate('/profile')}
        >
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <UserCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Digital Identity Profile
              </p>
              <p className="text-xs text-slate-400">View & edit permitted fields</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
        </button>

        <button
          className="panel p-5 text-left transition hover:border-cyan-400/30 flex items-center justify-between group"
          onClick={() => onNavigate('/activity')}
        >
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <History size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Login Activity Log
              </p>
              <p className="text-xs text-slate-400">Inspect authentication timeline</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
        </button>

        <button
          className="panel p-5 text-left transition hover:border-cyan-400/30 flex items-center justify-between group"
          onClick={() => onNavigate('/security')}
        >
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Lock size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Security Center
              </p>
              <p className="text-xs text-slate-400">Threat simulation & alerts</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Recent Activity Table */}
      <section className="mt-8 panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h3 className="text-base font-bold text-white">Recent Authentication History</h3>
            <p className="text-xs text-slate-400 mt-0.5">Most recent login interactions recorded on the server</p>
          </div>
          <button
            className="button-secondary !py-1.5 !px-3 text-xs"
            onClick={() => onNavigate('/activity')}
          >
            View all activity
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/8 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Risk Level</th>
                <th className="px-6 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No recent activity recorded yet.
                  </td>
                </tr>
              ) : (
                recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-medium text-white">
                      <div>{item.action}</div>
                      <div className="text-xs text-slate-500">{item.details}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {item.ip_address}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.risk_level} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
