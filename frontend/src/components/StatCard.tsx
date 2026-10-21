import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail?: string;
  badge?: React.ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, detail, badge, trend }) => {
  return (
    <div className="panel p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300">
          {icon}
        </span>
        {badge}
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-white">{value}</p>
      {(detail || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          {detail && <span>{detail}</span>}
          {trend && <span className="font-mono text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  );
};
