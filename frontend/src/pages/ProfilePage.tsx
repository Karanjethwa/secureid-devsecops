import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Calendar,
  Mail,
  User as UserIcon,
  Phone,
  Briefcase,
  FileText,
  Edit3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { AlertNotice } from '../components/AlertNotice';
import { userApi } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || '',
    phone: user?.phone || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      department: user?.department || '',
      phone: user?.phone || '',
    });
    setStatusMessage(null);
    setEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatusMessage(null);

    try {
      await userApi.updateProfile(formData);
      await refreshUser();
      setStatusMessage({ type: 'success', text: 'Digital identity profile updated successfully.' });
      setTimeout(() => setEditModalOpen(false), 1200);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const sdiId = user?.sdiId || `SDI-${String(user?.id || 1).padStart(6, '0')}`;

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label">Identity vault</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Digital Identity Profile
          </h1>
          <p className="mt-2 text-slate-400">
            A protected view of your digital credential. Passwords and secret keys are never exposed in the client layer.
          </p>
        </div>

        <button className="button-secondary self-start sm:self-auto" onClick={handleOpenEdit}>
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Main Profile Panel */}
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/8 gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 font-bold font-mono text-xl">
                {user?.name?.slice(0, 2).toUpperCase() || 'ID'}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="font-mono text-xs text-slate-400">@{user?.username}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={user?.status || 'Active'} />
                  <StatusBadge status={user?.verification_status || 'Verified (Demo)'} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-right">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Credential ID</p>
              <p className="font-mono text-base font-bold text-cyan-300">{sdiId}</p>
            </div>
          </div>

          {/* Identity Fields Grid */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Mail size={14} className="text-cyan-400" />
                Email Address
              </span>
              <p className="mt-1 text-sm font-medium text-slate-200">{user?.email}</p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <UserIcon size={14} className="text-cyan-400" />
                Access Role
              </span>
              <p className="mt-1 text-sm font-medium text-slate-200 capitalize">{user?.role} Access Tier</p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Briefcase size={14} className="text-cyan-400" />
                Department / Field
              </span>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {user?.department || 'Information Technology & Cybersecurity'}
              </p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Phone size={14} className="text-cyan-400" />
                Contact Phone
              </span>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {user?.phone || '+91 98200 00000 (Demo)'}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <FileText size={14} className="text-cyan-400" />
                Identity Statement / Bio
              </span>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                {user?.bio || 'DevSecOps Lab Student Participant exploring identity governance and CI/CD security.'}
              </p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Calendar size={14} className="text-cyan-400" />
                Credential Registration Date
              </span>
              <p className="mt-1 text-xs font-mono text-slate-300">
                {user?.created_at ? new Date(user.created_at).toLocaleString() : '2026-10-20'}
              </p>
            </div>

            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                <Calendar size={14} className="text-cyan-400" />
                Last Authenticated Login
              </span>
              <p className="mt-1 text-xs font-mono text-slate-300">
                {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Active now'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification & Integrity Panel */}
        <div className="space-y-6">
          <div className="panel p-6 border border-cyan-400/20 bg-cyan-400/[0.03]">
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Shield size={18} className="text-cyan-300" />
              Verification Status
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Identity verification in this microproject is designated as <strong className="text-cyan-300 font-mono">Verified (Demo)</strong>.
            </p>

            <div className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/10 p-3.5 text-xs text-amber-300 leading-5">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle size={15} className="shrink-0" />
                Academic Transparency
              </div>
              This prototype does not connect to real sovereign government e-ID databases (such as Aadhaar, DigiLocker, or National ID services). All credentials represent simulated academic test entities.
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Cryptographic Safeguards
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Password hashes stored using bcrypt (Salt Rounds: 10)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Zero client-side storage of plaintext authentication secrets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Session signed with RS256/HS256 in HTTP-only SameSite cookie</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Digital Identity Profile"
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Department / Role Specialization
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Contact Phone (Simulated)
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Bio / Identity Statement
            </label>
            <textarea
              className="input-field min-h-24 resize-none"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
            />
          </div>

          {statusMessage && (
            <AlertNotice type={statusMessage.type} message={statusMessage.text} />
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
};
