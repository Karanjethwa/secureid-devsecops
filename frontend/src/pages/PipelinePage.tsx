import React, { useState } from 'react';
import {
  Workflow,
  GitBranch,
  PackageCheck,
  CheckCircle2,
  FileCode,
  Shield,
  Box,
  Cloud,
  Activity,
  Terminal,
  Check,
  AlertTriangle
} from 'lucide-react';

export const PipelinePage: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 1,
      title: 'Source Checkout',
      category: 'Version Control',
      icon: <GitBranch size={20} />,
      tool: 'GitHub & Git SCM',
      command: 'git checkout tags/v1.0.0 || git checkout ${GIT_COMMIT}',
      gate: 'Commit GPG signature validation & branch protection rules',
      description: 'Pulls verified, review-approved source code from GitHub master/release branch with immutable SHA tag.',
      artifacts: 'Git working directory snapshot, commit metadata',
    },
    {
      id: 2,
      title: 'Dependency Audit',
      category: 'SCA (Software Composition)',
      icon: <PackageCheck size={20} />,
      tool: 'npm audit & package-lock.json',
      command: 'npm ci && npm audit --audit-level=high',
      gate: 'Zero critical or high supply-chain CVE vulnerabilities allowed',
      description: 'Ensures reproducible installs using strict lockfiles and audits third-party npm packages against known CVE advisories.',
      artifacts: 'npm-audit-report.json',
    },
    {
      id: 3,
      title: 'Unit & Security Tests',
      category: 'Automated Testing',
      icon: <CheckCircle2 size={20} />,
      tool: 'Vitest & Supertest',
      command: 'npm test -- --coverage',
      gate: '100% pass on authentication, password hashing, and RBAC guard tests',
      description: 'Executes automated unit and integration tests verifying session cookies, bcrypt hashing, rate limiting, and access control.',
      artifacts: 'coverage/lcov.info, test-results.xml',
    },
    {
      id: 4,
      title: 'SonarQube SAST',
      category: 'Static Analysis',
      icon: <FileCode size={20} />,
      tool: 'SonarQube & SonarScanner',
      command: 'sonar-scanner -Dsonar.host.url=${SONAR_HOST} -Dsonar.login=${SONAR_TOKEN}',
      gate: 'Quality Gate: 0 Vulnerabilities, 0 Security Hotspots, Maintainability A',
      description: 'Scans source code for security vulnerabilities (OWASP Top 10), SQL injection vectors, secrets leaks, and code smells.',
      artifacts: 'reports/sonarqube-scan-report.md, SonarQube dashboard metrics',
    },
    {
      id: 5,
      title: 'Multi-Stage Docker Build',
      category: 'Containerization',
      icon: <Box size={20} />,
      tool: 'Docker Engine',
      command: 'docker build --no-cache -t secureid:${GIT_COMMIT} .',
      gate: 'Non-root user execution, minimal node:20-alpine base image',
      description: 'Builds production bundle using multi-stage compilation to completely exclude build-time devDependencies and compilers from production.',
      artifacts: 'secureid:${GIT_COMMIT} Docker image layer',
    },
    {
      id: 6,
      title: 'Trivy Image Scan',
      category: 'Container Security',
      icon: <Shield size={20} />,
      tool: 'Aqua Security Trivy',
      command: 'trivy image --severity CRITICAL,HIGH --exit-code 1 secureid:${GIT_COMMIT}',
      gate: 'Zero unmitigated Critical OS and runtime package vulnerabilities',
      description: 'Performs static binary and OS layer vulnerability analysis on the packaged container image before publication.',
      artifacts: 'reports/trivy-image-report.json, reports/trivy-image-report.md',
    },
    {
      id: 7,
      title: 'Image Registry Push',
      category: 'Artifact Management',
      icon: <Cloud size={20} />,
      tool: 'Amazon ECR',
      command: 'docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/secureid:${GIT_COMMIT}',
      gate: 'IAM least-privilege token authentication & image immutability',
      description: 'Stores signed, approved production container image with immutable Git commit SHA tag in Amazon Elastic Container Registry.',
      artifacts: 'Amazon ECR Image Digest',
    },
    {
      id: 8,
      title: 'Cloud Deployment',
      category: 'CD / Infrastructure',
      icon: <Workflow size={20} />,
      tool: 'AWS EC2 & Terraform',
      command: 'docker run -d -p 3000:5000 --env-file .env.prod --name secureid-prod ...',
      gate: 'Zero-downtime rolling restart, VPC security group restricted ports',
      description: 'Deploys updated container to AWS Ubuntu instance provisioned via Terraform, binding only necessary ports behind HTTPS proxy.',
      artifacts: 'Terraform state, running EC2 container instance',
    },
    {
      id: 9,
      title: 'Health & Smoke Verification',
      category: 'Continuous Monitoring',
      icon: <Activity size={20} />,
      tool: 'Curl & Smoke Check Script',
      command: 'curl -fsS http://localhost:5000/api/health || exit 1',
      gate: 'HTTP 200 OK with status="UP" and active security controls listed',
      description: 'Validates that the newly deployed container is alive, database is responding, and security headers are active.',
      artifacts: 'Automated post-deployment verification log',
    },
  ];

  const current = stages[activeStage];

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="section-label">DevSecOps Delivery Blueprint</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Automated CI/CD Pipeline
        </h1>
        <p className="mt-2 text-slate-400">
          Complete Jenkins Declarative Pipeline featuring automated SAST, container vulnerability scanning, and immutable image delivery.
        </p>
      </div>

      {/* Horizontal Pipeline Steps Stepper */}
      <div className="panel p-4 mb-8 overflow-x-auto">
        <div className="flex items-center min-w-[850px] justify-between gap-2">
          {stages.map((stg, index) => (
            <button
              key={stg.id}
              className={`flex-1 flex flex-col items-center p-3 rounded-xl border text-center transition ${
                activeStage === index
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'border-white/6 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
              onClick={() => setActiveStage(index)}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-black/40 mb-2">
                {stg.icon}
              </span>
              <span className="font-mono text-[10px] text-slate-500 uppercase">Stage 0{stg.id}</span>
              <span className="text-xs font-bold mt-0.5 truncate max-w-[90px]">{stg.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                {current.icon}
              </span>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">
                  Stage 0{current.id} · {current.category}
                </span>
                <h2 className="text-2xl font-bold text-white">{current.title}</h2>
              </div>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300">
              {current.tool}
            </span>
          </div>

          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">
              Stage Objective & Workflow
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{current.description}</p>
          </div>

          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">
              Pipeline Execution Command
            </h3>
            <div className="rounded-xl border border-white/8 bg-black/50 p-4 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <code>{current.command}</code>
              <Terminal size={16} className="text-slate-500 shrink-0 ml-3" />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase font-mono mb-1">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Automated Quality Gate Condition
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.gate}</p>
          </div>
        </div>

        {/* Pipeline Governance Context */}
        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
              Stage Artifacts & Evidence
            </h3>
            <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 font-mono text-xs text-slate-300">
              {current.artifacts}
            </div>
          </div>

          <div className="panel p-6 border-cyan-400/20 bg-cyan-400/[0.02]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <Shield size={16} className="text-cyan-300" />
              DevSecOps Lab Alignment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every stage incorporates "Shift-Left" security principles: security testing occurs early at build-time rather than retroactively in production. If SonarQube flags critical hotspots or Trivy detects critical CVEs, the Jenkins pipeline halts the release immediately.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
