import React from 'react';
import { TrendingUp, Award, ArrowUpRight } from 'lucide-react';

/**
 * FederationImpactCard
 * ====================
 * Prominently displays the Local vs. Federated accuracy comparison.
 * This is the single number that proves the platform's value proposition.
 *
 * Props:
 *   localAccuracy     {number}  — local-only accuracy (0–100)
 *   federatedAccuracy {number}  — after-federation accuracy (0–100)
 *   hospitalName      {string}
 *   compact           {boolean} — smaller layout for dashboard KPI row
 */
export default function FederationImpactCard({
  localAccuracy,
  federatedAccuracy,
  hospitalName = 'This facility',
  compact = false,
}) {
  const delta = (federatedAccuracy ?? 0) - (localAccuracy ?? 0);
  const deltaRounded = Math.round(delta * 10) / 10;
  const hasData = localAccuracy != null && federatedAccuracy != null;

  if (!hasData) {
    return (
      <div className={`p-4 rounded-2xl bg-slate-950/60 border border-white/10 ${compact ? '' : 'space-y-2'}`}>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold font-heading">Federation Impact</span>
        </div>
        <p className="text-xs text-slate-500">Train a model to see the Local vs. Federated accuracy comparison.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-cyan-950/40 border border-emerald-400/40 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 pointer-events-none" />
        <span className="text-xs text-slate-400 font-mono">Federation Impact</span>
        <div className="flex items-end gap-2 mt-1">
          <div className="text-3xl font-bold font-heading text-emerald-300">
            +{deltaRounded}pp
          </div>
          <ArrowUpRight className="w-5 h-5 text-emerald-400 mb-1" />
        </div>
        <span className="text-[10px] text-emerald-200 font-mono block mt-0.5">
          {Math.round(localAccuracy)}% → {Math.round(federatedAccuracy)}% via Federation
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/40 border border-emerald-400/40 relative overflow-hidden space-y-4">
      {/* Glow orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-bold text-white font-heading text-sm">Federation Impact</h4>
          <p className="text-[10px] text-slate-400">Local-only vs. after joining the federated network</p>
        </div>
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Local accuracy */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Local Only</p>
          <p className="text-2xl font-bold text-slate-200 font-heading mt-1">{Math.round(localAccuracy)}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Trained alone</p>
        </div>

        {/* Delta — hero stat */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-900/30 border border-emerald-400/50 text-center flex flex-col items-center justify-center relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-300 bg-emerald-950 border border-emerald-400/30 px-2 py-0.5 rounded-full whitespace-nowrap">
            IMPROVEMENT
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <p className="text-3xl font-bold text-emerald-300 font-heading">+{deltaRounded}pp</p>
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">from collaboration</p>
        </div>

        {/* Federated accuracy */}
        <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-400/40 text-center">
          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide">Federated</p>
          <p className="text-2xl font-bold text-cyan-300 font-heading mt-1">{Math.round(federatedAccuracy)}%</p>
          <p className="text-[10px] text-cyan-500 mt-0.5">After joining network</p>
        </div>
      </div>

      {/* Quote-style callout */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
        <span className="text-emerald-400 font-semibold">{hospitalName}</span>
        {', trained alone: '}
        <span className="text-white font-bold">{Math.round(localAccuracy)}% accuracy</span>
        {'. After joining the federated network: '}
        <span className="text-cyan-300 font-bold">{Math.round(federatedAccuracy)}% accuracy</span>
        {' — '}
        <span className="text-emerald-300 font-bold">+{deltaRounded} percentage points from collaboration.</span>
      </div>
    </div>
  );
}
