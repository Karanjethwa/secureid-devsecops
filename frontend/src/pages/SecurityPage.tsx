import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Play,
  LogOut,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { AlertNotice } from '../components/AlertNotice';
import { securityApi } from '../services/api';
import { SecurityAlert } from '../types';

interface SecurityPageProps {
  onNavigate: (path: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadSecurityData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        securityApi.getStats(),
        securityApi.getAlerts(),
      ]);
      setStats(statsRes.stats);
      setAlerts(alertsRes.alerts || []);
    } catch (err) {
      console.error('Failed to load security center data:', err);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setNotification(null);
    try {
      const res = await securityApi.simulateSuspicious();
      setNotification({ type: 'success', message: res.message });
      await loadSecurityData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Simulation failed' });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label">Defense in depth</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Security Center
          </h1>
          <p className="mt-2 text-slate-400">
            Real-time threat detection, implemented technical controls, and interactive anomaly simulation.
          </p>
        </div>

        <button className="button-danger self-start sm:self-auto" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Secure Logout</span>
        </button>
      </div>

      {notification && (
        <div className="mb-6">
          <AlertNotice
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Simulation Callout Banner */}
      <div className="mb-8 panel p-6 border-cyan-400/25 bg-cyan-400/[0.04]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">
              <Play size={16} className="text-cyan-400" />
              <span>DevSecOps Threat Emulation Tool</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Demonstrate live system alerting by triggering a simulated high-velocity brute-force attack from an untrusted anomalous IP. This generates a categorized security alert and logs a failed attempt.
            </p>
          </div>

          <button
            className="button-primary whitespace-nowrap self-start md:self-auto"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play size={16} />
                Simulate Suspicious Attack
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Implemented Controls List */}
        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-base font-bold text-white mb-1">
              Active Technical Safeguards
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Controls verified and running on this deployment
            </p>

            <div className="space-y-3">
              {[
                { name: 'Password Storage', tech: 'bcrypt (Cost Factor 10)', desc: 'Salted one-way hash prevents plaintext database exposure.' },
                { name: 'Session Management', tech: 'HTTP-only SameSite Cookie', desc: 'Prevents client-side script token theft (XSS mitigation).' },
                { name: 'Rate Limiting', tech: 'Express Rate Limit', desc: 'Throttles consecutive authentication requests to 10/15min.' },
                { name: 'Role Enforcement', tech: 'Server-Side RBAC Guard', desc: 'Strict separation between standard user and admin routes.' },
                { name: 'SQL Injection Defense', tech: 'Parameterized Query Bindings', desc: 'All queries use strictly parameterized inputs via SQLite bindings.' },
                { name: 'HTTP Security Headers', tech: 'Helmet Middleware', desc: 'CSP, X-Content-Type-Options, HSTS, and Frameguard enabled.' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-start justify-between rounded-lg border border-white/6 bg-white/[0.02] p-4 gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span className="text-sm font-semibold text-white">{c.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6 leading-relaxed">{c.desc}</p>
                  </div>
                  <span className="font-mono text-[11px] text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-md shrink-0">
                    {c.tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="panel p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
              Account Security Best Practices
            </h3>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>• Avoid using predictable passwords or repeating passwords across services.</p>
              <p>• Log out promptly on shared laboratory computers to destroy active session cookies.</p>
              <p>• Inspect login activity logs routinely for unexpected IP locations.</p>
            </div>
          </div>
        </div>

        {/* Security Alerts Feed */}
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Security Alerts</h3>
                <p className="text-xs text-slate-400">Flagged anomalies and threshold breaches</p>
              </div>
              <button
                className="button-secondary !py-1 !px-2.5 text-xs"
                onClick={loadSecurityData}
                title="Refresh alerts"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <CheckCircle2 size={28} className="mx-auto text-emerald-400/60 mb-2" />
                No security alerts recorded. System operating normally.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-4 text-xs transition ${
                      alert.description.includes('[SIMULATED')
                        ? 'border-cyan-400/30 bg-cyan-400/5'
                        : 'border-amber-400/30 bg-amber-400/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <AlertTriangle
                          size={14}
                          className={alert.description.includes('[SIMULATED') ? 'text-cyan-400' : 'text-amber-400'}
                        />
                        {alert.alert_type}
                      </span>
                      <StatusBadge status={alert.severity} />
                    </div>

                    <p className="text-slate-300 leading-5 mt-1">{alert.description}</p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
                      <span>Source IP: {alert.source_ip}</span>
                      <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
