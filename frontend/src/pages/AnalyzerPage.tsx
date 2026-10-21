import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { securityApi } from '../services/api';
import { SecurityAnalysis } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const AnalyzerPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await securityApi.getAnalysis();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Failed to run security analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-emerald-400 stroke-emerald-400';
    if (score < 65) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="section-label">Intelligent Protection</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            AI Security Analyzer
          </h1>
          <p className="mt-2 text-slate-400">
            Explainable behavioral risk scoring based on login timelines, authentication anomalies, and role privilege surfaces.
          </p>
        </div>

        <button
          className="button-secondary self-start sm:self-auto"
          onClick={fetchAnalysis}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>Re-analyze Session</span>
        </button>
      </div>

      {isLoading || !analysis ? (
        <div className="panel p-12 text-center text-slate-400">
          <BrainCircuit size={40} className="mx-auto text-cyan-400 animate-pulse mb-4" />
          <p>Synthesizing identity risk indicators and event telemetry...</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Risk Score Gauge Card */}
          <div className="panel p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-2">
              Composite Identity Risk Score
            </span>

            {/* Circular Gauge Representation */}
            <div className="relative size-44 my-6 grid place-items-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={getScoreColor(analysis.riskScore)}
                  strokeWidth="8"
                  strokeDasharray={`${(analysis.riskScore / 100) * 238.76} 238.76`}
                  strokeLinecap="round"
                  fill="transparent"
                  r="38"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-extrabold text-white">
                  {analysis.riskScore}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  / 100 Max Risk
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Calculated Risk Level:</span>
              <StatusBadge status={analysis.riskLevel} />
            </div>

            <p className="text-xs text-slate-400 max-w-xs leading-relaxed border-t border-white/8 pt-4">
              Analyzed {analysis.eventsAnalyzed} historical login events across the demonstration database.
            </p>
          </div>

          {/* Detailed Findings & Recommendations */}
          <div className="space-y-6">
            {/* Findings List */}
            <div className="panel p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Cpu size={18} className="text-cyan-400" />
                Detected Security Factors
              </h3>

              <div className="space-y-3">
                {analysis.findings.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/6 bg-white/[0.02] p-4 flex items-start gap-3.5"
                  >
                    {f.severity === 'safe' ? (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    ) : f.severity === 'warning' ? (
                      <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations List */}
            <div className="panel p-6">
              <h3 className="text-base font-bold text-white mb-3">
                Actionable Hardening Guidance
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span className="leading-5">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
