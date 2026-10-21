import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const norm = String(status || '').toLowerCase();

  if (norm.includes('active') || norm.includes('verified') || norm.includes('successful') || norm.includes('low') || norm.includes('safe')) {
    return (
      <span className={`status-chip ${className}`}>
        <span className="size-1.5 rounded-full bg-emerald-400" />
        {status}
      </span>
    );
  }

  if (norm.includes('pending') || norm.includes('medium') || norm.includes('warning') || norm.includes('review')) {
    return (
      <span className={`status-chip status-chip-warn ${className}`}>
        <span className="size-1.5 rounded-full bg-amber-400" />
        {status}
      </span>
    );
  }

  if (norm.includes('suspended') || norm.includes('failed') || norm.includes('high') || norm.includes('critical') || norm.includes('unverified')) {
    return (
      <span className={`status-chip status-chip-danger ${className}`}>
        <span className="size-1.5 rounded-full bg-rose-400" />
        {status}
      </span>
    );
  }

  return (
    <span className={`role-chip ${className}`}>
      {status}
    </span>
  );
};
