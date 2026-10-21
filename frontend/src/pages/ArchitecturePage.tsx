import React from 'react';
import {
  Boxes,
  Cpu,
  Server,
  Database,
  Shield,
  Workflow,
  Lock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const tiers = [
    {
      title: 'Tier 1: Client & Presentation Layer',
      icon: <Cpu size={22} />,
      tech: 'React 18 · Vite · TypeScript · Responsive CSS',
      controls: [
        'Component-level Least Privilege UI states (User vs Admin views)',
        'Zero sensitive token storage in localStorage (mitigating XSS extraction)',
        'Input sanitization & masking on sensitive identifier fields',
      ],
      desc: 'Renders the cyberpunk cybersecurity interface, real-time telemetry gauges, and interactive DevSecOps inspection panels.',
    },
    {
      title: 'Tier 2: API Gateway & Security Perimeter',
      icon: <Shield size={22} />,
      tech: 'Node.js Express · Helmet · CORS · Express-Rate-Limit',
      controls: [
        'Strict Content-Security-Policy (CSP) and HSTS enforcement via Helmet',
        'CORS restricted explicitly to authorized client origin',
        'IP-based rate limiting (10 auth attempts/15min) to prevent credential stuffing',
        'Trusted reverse-proxy IP resolution for accurate audit trails',
      ],
      desc: 'Acts as the hardened gateway, sanitizing incoming requests and throttling automated bot probes.',
    },
    {
      title: 'Tier 3: Identity & Business Logic Layer',
      icon: <Server size={22} />,
      tech: 'Express Controllers · Bcryptjs · JsonWebToken',
      controls: [
        'Password hashing via bcrypt with 10 salt rounds',
        'HTTP-only SameSite session cookies preventing JavaScript hijacking',
        'Server-side RBAC middleware guarding administrative routes',
        'Automatic activity logging & threshold-based anomaly detection',
      ],
      desc: 'Executes core digital identity lifecycle operations, authentication verification, and behavioral risk scoring.',
    },
    {
      title: 'Tier 4: Persistence & Data Layer',
      icon: <Database size={22} />,
      tech: 'SQLite (sql.js / WASM) · Configurable PostgreSQL',
      controls: [
        'Strictly parameterized query bindings (eliminates SQL Injection)',
        'Zero native C++ build tool dependencies for portability across student PCs',
        'Immutable administrative audit log table with foreign key constraints',
        'Synchronous file persistence & atomic backup capabilities',
      ],
      desc: 'Maintains user records, hashed credentials, immutable audit logs, and security alert records.',
    },
    {
      title: 'Tier 5: DevSecOps CI/CD & Cloud Infrastructure',
      icon: <Workflow size={22} />,
      tech: 'Jenkins · SonarQube · Trivy · Docker · AWS EC2 · Terraform',
      controls: [
        'Automated Static Application Security Testing (SAST) in Jenkins',
        'Aqua Trivy container image scanning blocking Critical/High CVEs',
        'Multi-stage Docker builds running as non-root user (node)',
        'Declarative Terraform infrastructure provisioning on AWS',
      ],
      desc: 'Ensures automated quality gates, verifiable builds, and reproducible deployment to AWS cloud environments.',
    },
  ];

  const owaspMitigations = [
    { vuln: 'A01:2021 — Broken Access Control', mitigation: 'Server-side RBAC middleware (requireAdmin) enforces role checks on every administrative route regardless of client requests.' },
    { vuln: 'A02:2021 — Cryptographic Failures', mitigation: 'Bcrypt hashing (10 rounds) protects stored credentials. Sensitive JWT tokens are sealed in HTTP-only SameSite cookies.' },
    { vuln: 'A03:2021 — Injection (SQLi / XSS)', mitigation: 'Parameterized SQL queries with bound parameters eliminate SQL injection. Strict CSP and input sanitization neutralize XSS.' },
    { vuln: 'A05:2021 — Security Misconfiguration', mitigation: 'Helmet sets hardened HTTP headers. Non-root user in Dockerfile avoids container escalation.' },
    { vuln: 'A07:2021 — Identification & Auth Failures', mitigation: 'Rate limiting throttles brute force attempts. Generic error messages prevent username enumeration.' },
    { vuln: 'A09:2021 — Security Logging & Monitoring', mitigation: 'Every login attempt and administrative state change is recorded in dedicated audit tables with timestamps and IP.' },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="section-label">System Blueprint</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Application Architecture
        </h1>
        <p className="mt-2 text-slate-400">
          Defense-in-depth architecture model demonstrating separation of concerns, least privilege, and DevSecOps gates.
        </p>
      </div>

      {/* Tier Breakdown */}
      <div className="space-y-6">
        {tiers.map((tier, idx) => (
          <div key={tier.title} className="panel p-6 sm:p-8 transition hover:border-cyan-400/25">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                  {tier.icon}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">{tier.title}</h2>
                  <p className="font-mono text-xs text-cyan-400">{tier.tech}</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-400">
                Layer 0{idx + 1}
              </span>
            </div>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">{tier.desc}</p>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                Active Security Controls:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-300">
                {tier.controls.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* OWASP Top 10 Compliance Matrix */}
      <section className="mt-12 panel p-6 sm:p-8">
        <div className="border-b border-white/8 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock size={20} className="text-cyan-300" />
            OWASP Top 10 Mitigation Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Systematic engineering controls implemented to safeguard digital identities against common web attack vectors.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {owaspMitigations.map((m) => (
            <div key={m.vuln} className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-xs">
              <h3 className="font-bold text-cyan-300 font-mono mb-1.5">{m.vuln}</h3>
              <p className="text-slate-300 leading-relaxed">{m.mitigation}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
