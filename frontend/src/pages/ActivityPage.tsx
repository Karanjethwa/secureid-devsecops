import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
  ShieldAlert,
  ArrowUpDown,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { activityApi } from '../services/api';
import { LoginActivity } from '../types';

export const ActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [activityList, setActivityList] = useState<LoginActivity[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [selectedItem, setSelectedItem] = useState<LoginActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivity = async () => {
    setIsLoading(true);
    try {
      const data = await activityApi.getList({
        search,
        status: statusFilter,
        page,
        limit: 10,
        all: user?.role === 'admin',
      });
      setActivityList(data.activity || []);
      setPagination({
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.total || 0,
      });
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [search, statusFilter, page]);

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="section-label">Audit trail</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Login Activity Log
        </h1>
        <p className="mt-2 text-slate-400">
          Timestamped record of authentication events, client metadata, and security risk indicators.
        </p>
      </div>

      {/* Security Context Banner */}
      <div className="mb-6 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.03] p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">DevSecOps Integrity Notice:</span> Request IP addresses and user agents are logged at the server boundary using trusted proxy configuration (`X-Forwarded-For`). While useful for anomaly detection and rate-limiting, IP addresses do not conclusively prove a physical person’s identity.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input-field !pl-10 text-xs"
            placeholder="Search by action, IP, or details..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter size={15} />
            <span>Filter Status:</span>
          </div>
          <select
            className="input-field !py-2 text-xs w-36"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Events</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/8 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Account Identifier</th>
                <th className="px-6 py-4">Client IP Address</th>
                <th className="px-6 py-4">Risk Evaluation</th>
                <th className="px-6 py-4">Timestamp (UTC/Local)</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading login records from database...
                  </td>
                </tr>
              ) : activityList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No login events match your criteria.
                  </td>
                </tr>
              ) : (
                activityList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-medium text-white">
                      <div>{item.action}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{item.details}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-cyan-300">
                      @{item.identifier}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {item.ip_address}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.risk_level} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="button-secondary !py-1.5 !px-2.5 text-xs"
                        onClick={() => setSelectedItem(item)}
                        aria-label={`View details for event ${item.id}`}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-white/8 px-6 py-4 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {activityList.length} of {pagination.total} total recorded events
          </div>
          <div className="flex items-center gap-2">
            <button
              className="button-secondary !py-1 !px-3 text-xs"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="font-mono text-slate-300">
              Page {page} of {pagination.totalPages || 1}
            </span>
            <button
              className="button-secondary !py-1 !px-3 text-xs"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        title="Authentication Event Inspection"
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <p className="font-semibold text-white">{selectedItem.action}</p>
                <p className="font-mono text-xs text-slate-400">Event ID: #{selectedItem.id}</p>
              </div>
              <StatusBadge status={selectedItem.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block">Account</span>
                <span className="text-cyan-300">@{selectedItem.identifier}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block">Risk Evaluation</span>
                <span className="text-white">{selectedItem.risk_level} Risk</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block">IP Address</span>
                <span className="text-slate-200">{selectedItem.ip_address}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider block">Recorded At</span>
                <span className="text-slate-200">{new Date(selectedItem.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block mb-1">
                Event Description
              </span>
              <p className="rounded-lg border border-white/6 bg-white/[0.02] p-3 text-xs text-slate-300">
                {selectedItem.details}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-mono tracking-wider block mb-1">
                Client User-Agent Fingerprint
              </span>
              <p className="rounded-lg border border-white/6 bg-black/40 p-3 font-mono text-[11px] text-slate-400 break-all">
                {selectedItem.user_agent}
              </p>
            </div>

            <button
              className="button-primary w-full justify-center mt-3"
              onClick={() => setSelectedItem(null)}
            >
              Close Inspector
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
};
