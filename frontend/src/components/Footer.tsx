import React from 'react';
import { Shield, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050d17] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand & Project Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <Shield size={18} />
              </span>
              <span className="font-mono text-sm font-bold tracking-widest text-cyan-300">
                SECUREID
              </span>
            </div>
            <p className="mt-3.5 max-w-md text-sm leading-6 text-slate-400">
              Secure Digital Identity Management System (SDIMS) — an academic DevSecOps CIAP microproject featuring automated vulnerability scanning, least-privilege RBAC, and secure authentication.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                DevSecOps Lab Practicum
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 font-mono text-[11px] font-bold text-cyan-300">
                <Award size={13} />
                SDG 9 Aligned
              </span>
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              Institution
            </h4>
            <p className="mt-3 text-sm text-slate-300 font-medium">
              Shah & Anchor Kutchhi Engineering College
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Department of Information Technology & Cybersecurity
            </p>
            <p className="mt-2 text-xs font-mono text-cyan-400/80">
              Academic Year 2026–2027
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Course: DevSecOps Lab (CIAP Microproject)
            </p>
          </div>

          {/* Security & Integrity Notice */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              Academic Integrity
            </h4>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Fictional demonstration prototype. No real government or commercial identity numbers are stored or processed. Passwords hashed via bcrypt.
            </p>
            <div className="mt-3 text-xs text-slate-500">
              Build: v1.0.0-ciap · SQLite + Node.js + React
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026–2027 SecureID Project Team. All rights reserved for academic demonstration.</p>
          <p className="font-mono text-[11px] text-cyan-400/70">
            Automated CI/CD · SonarQube SAST · Trivy Scanned
          </p>
        </div>
      </div>
    </footer>
  );
};
