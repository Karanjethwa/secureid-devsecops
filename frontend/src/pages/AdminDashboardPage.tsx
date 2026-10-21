import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UserX,
  Activity,
  AlertTriangle,
  History,
  ArrowRight,
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { adminApi } from '../services/api';
import { AdminStats, AuditLog } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAuditLogs(),
      ]);
      setStats(statsRes.stats);
      setLogs(logsRes.logs || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <div className="panel p-8 border-rose-400/20 bg-rose-400/[0.04]">
          <Lock size={36} className="mx-auto text-rose-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Your current account (@{user?.username}) does not have administrative privileges. Server-side RBAC has restricted this route.
          </p>
          <button className="button-primary mt-6" onClick={() => onNavigate('/dashboard')}>
            Return to User Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label">Administrative workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Admin Governance Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            System-wide identity directory, privilege management, and tamper-resistant administrative audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="button-secondary !py-2 !px-3 text-xs"
            onClick={fetchAdminData}
            title="Refresh statistics"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="button-primary !py-2 !px-4 text-xs"
            onClick={() => onNavigate('/admin/users')}
          >
            <Users size={15} />
            <span>Manage Users</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={22} />}
          label="Registered Identities"
          value={stats?.totalUsers || 0}
          detail={`${stats?.adminCount || 1} admin, ${(stats?.totalUsers || 1) - (stats?.adminCount || 1)} standard`}
        />

        <StatCard
          icon={<ShieldCheck size={22} className="text-emerald-400" />}
          label="Active Accounts"
          value={stats?.activeUsers || 0}
          detail="Enabled identities"
          trend="Good"
        />

        <StatCard
          icon={<UserX size={22} className="text-amber-400" />}
          label="Suspended Accounts"
          value={stats?.suspendedUsers || 0}
          detail="Policy locked / simulated"
          trend={stats?.suspendedUsers ? 'Action needed' : undefined}
        />

        <StatCard
          icon={<Activity size={22} className="text-cyan-400" />}
          label="System Login Attempts"
          value={stats?.totalLogins || 0}
          detail={`${stats?.successfulLogins || 0} success / ${stats?.failedLogins || 0} failed`}
        />
      </div>

      {/* Audit Logs Table */}
      <section className="mt-10 panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-cyan-400" />
              Administrative Audit Log (Immutable Record)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every status toggle, account deletion, or privileged operation is automatically recorded
            </p>
          </div>
          <button
            className="button-secondary !py-1.5 !px-3 text-xs"
            onClick={() => onNavigate('/admin/users')}
          >
            Manage User Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/8 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Admin User</th>
                <th className="px-6 py-3.5">Action Code</th>
                <th className="px-6 py-3.5">Target</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5">IP Address</th>
                <th className="px-6 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No administrative audit actions recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono text-xs text-cyan-300 font-bold">
                      @{log.admin_username}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {log.target_user_id ? `User #${log.target_user_id}` : 'System'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-sm leading-relaxed">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
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
