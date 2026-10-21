import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertNoticeProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  onClose?: () => void;
}

export const AlertNotice: React.FC<AlertNoticeProps> = ({ type, message, className = '', onClose }) => {
  if (!message) return null;

  const config = {
    success: {
      bg: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
      icon: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
      icon: <XCircle size={18} className="text-rose-400 shrink-0" />,
    },
    warning: {
      bg: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
      icon: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
      icon: <Info size={18} className="text-cyan-400 shrink-0" />,
    },
  }[type];

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1 leading-5">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition -mr-1 -mt-1 p-1"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
