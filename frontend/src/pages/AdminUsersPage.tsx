import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  ArrowLeft,
  RefreshCw,
  Mail,
  Calendar,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { AlertNotice } from '../components/AlertNotice';
import { adminApi } from '../services/api';
import { User } from '../types';

interface AdminUsersPageProps {
  onNavigate: (path: string) => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ onNavigate }) => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(data.users || []);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to load users' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const res = await adminApi.updateUserStatus(user.id, nextStatus);
      setNotification({ type: 'success', message: res.message });
      await fetchUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, status: nextStatus });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Status update failed' });
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to permanently remove @${user.username} (${user.name})?`)) {
      return;
    }

    try {
      const res = await adminApi.deleteUser(user.id);
      setNotification({ type: 'success', message: res.message });
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'User deletion failed' });
    }
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition mb-2"
            onClick={() => onNavigate('/admin')}
          >
            <ArrowLeft size={14} /> Back to Admin Overview
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Identity Directory & RBAC
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            Search registered student and administrator identities, audit details, and toggle access states.
          </p>
        </div>

        <button
          className="button-secondary self-start sm:self-auto !py-2 !px-3 text-xs"
          onClick={fetchUsers}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
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

      {/* Filters */}
      <div className="panel p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input-field !pl-10 text-xs"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            className="input-field !py-2 text-xs w-36"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            className="input-field !py-2 text-xs w-36"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/8 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Identity Token</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading directory records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No identity records found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-cyan-300">
                      {u.sdiId || `SDI-${String(u.id).padStart(6, '0')}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-xs font-mono text-slate-400">@{u.username} · {u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="role-chip">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.verification_status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        className="button-secondary !py-1 !px-2 text-xs"
                        onClick={() => setSelectedUser(u)}
                        title="View profile details"
                      >
                        <Eye size={14} />
                      </button>

                      {u.id !== currentAdmin?.id && (
                        <button
                          className={`button-secondary !py-1 !px-2 text-xs ${
                            u.status === 'Active'
                              ? 'text-amber-300 hover:text-amber-200'
                              : 'text-emerald-300 hover:text-emerald-200'
                          }`}
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {u.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      )}

                      {u.id !== currentAdmin?.id && (
                        <button
                          className="button-secondary !py-1 !px-2 text-xs text-rose-300 hover:text-rose-200"
                          onClick={() => handleDeleteUser(u)}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        title="Demonstration Identity Record"
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <p className="font-bold text-white text-base">{selectedUser.name}</p>
                <p className="font-mono text-xs text-cyan-300">
                  {selectedUser.sdiId || `SDI-${String(selectedUser.id).padStart(6, '0')}`}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={selectedUser.status} />
                <span className="role-chip">{selectedUser.role}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase font-mono block">Username</span>
                <span className="text-white font-mono">@{selectedUser.username}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Email</span>
                <span className="text-white">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Department</span>
                <span className="text-white">{selectedUser.department || 'General IT'}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Verification</span>
                <span className="text-emerald-400 font-mono">{selectedUser.verification_status}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Account Created</span>
                <span className="text-slate-300">{new Date(selectedUser.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-mono block">Last Sign-In</span>
                <span className="text-slate-300">
                  {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>

            {selectedUser.bio && (
              <div className="border-t border-white/8 pt-3">
                <span className="text-xs text-slate-500 uppercase font-mono block mb-1">Bio</span>
                <p className="text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  {selectedUser.bio}
                </p>
              </div>
            )}

            <div className="border-t border-white/8 pt-4 flex items-center justify-between">
              {selectedUser.id !== currentAdmin?.id ? (
                <button
                  type="button"
                  className={`button-secondary text-xs ${
                    selectedUser.status === 'Active' ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                  onClick={() => handleToggleStatus(selectedUser)}
                >
                  {selectedUser.status === 'Active' ? 'Suspend Account' : 'Re-activate Account'}
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Current Active Admin</span>
              )}

              <button
                type="button"
                className="button-primary text-xs"
                onClick={() => setSelectedUser(null)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};
