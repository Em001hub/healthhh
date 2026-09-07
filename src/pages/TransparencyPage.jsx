import React, { useState } from 'react';
import { 
  Eye, Lock, ShieldCheck, Database, Award, CheckCircle2, 
  FileText, Server, ChevronDown, Activity, Hash, Terminal
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

export default function TransparencyPage() {
  const [selectedHospitalId, setSelectedHospitalId] = useState('h2');

  const hospitals = [
    {
      id: 'h1',
      name: 'City Medical Center A',
      type: 'Urban Tertiary Hospital',
      dataVolume: 14200,
      qualityScore: 98.4,
      influence: '35.4%',
      privacyBudgetUsed: '12.4%',
      status: 'Verified & Active'
    },
    {
      id: 'h2',
      name: 'Valley District Clinic',
      type: 'Rural Low-Resource Facility',
      dataVolume: 2850,
      qualityScore: 94.1,
      influence: '18.2%',
      privacyBudgetUsed: '8.1%',
      status: 'Verified & Active'
    },
    {
      id: 'h3',
      name: 'Metro Academic Health B',
      type: 'Regional Academic Center',
      dataVolume: 18900,
      qualityScore: 99.1,
      influence: '38.1%',
      privacyBudgetUsed: '14.8%',
      status: 'Verified & Active'
    },
    {
      id: 'h4',
      name: 'St. Jude Community Hospital',
      type: 'Community Hospital',
      dataVolume: 4100,
      qualityScore: 92.8,
      influence: '22.5%',
      privacyBudgetUsed: '9.3%',
      status: 'Verified & Active'
    }
  ];

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId);

  // Comparison data for Recharts (Selected Hospital vs Network Avg)
  const comparisonData = [
    { metric: 'Data Volume (K)', Local: (currentHospital.dataVolume / 1000).toFixed(1), NetworkAvg: 10.0 },
    { metric: 'Quality Score %', Local: currentHospital.qualityScore, NetworkAvg: 96.1 },
    { metric: 'Weight Influence %', Local: parseFloat(currentHospital.influence), NetworkAvg: 25.0 },
    { metric: 'DP Budget Used %', Local: parseFloat(currentHospital.privacyBudgetUsed), NetworkAvg: 11.2 },
  ];

  // Cryptographic audit logs
  const auditLogs = [
    {
      round: 'Round 14',
      timestamp: '2026-09-04 21:12:04',
      hash: '0x8f3c...91a2',
      event: 'Differential Noise Injected & Gradient Aggregated',
      status: 'PASSED'
    },
    {
      round: 'Round 13',
      timestamp: '2026-09-04 21:08:40',
      hash: '0x4b1e...33d9',
      event: 'Local Weight Update ΔW Egress Verified',
      status: 'PASSED'
    },
    {
      round: 'Round 12',
      timestamp: '2026-09-04 21:04:15',
      hash: '0x7c9a...08e1',
      event: 'Zero Raw Record Egress Audit Check',
      status: 'VERIFIED'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white font-heading">
              Hospital Governance & Trust Transparency Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empowering hospital administrators with verifiable cryptographic audits and clear visibility into model weight contributions.
          </p>
        </div>

        {/* Hospital Perspective Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-white/10">
          <Server className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs text-slate-400 font-mono">Hospital View:</span>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="bg-transparent text-xs text-cyan-300 font-bold font-heading focus:outline-none cursor-pointer"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                {h.name} ({h.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Hospital Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-5 rounded-2xl border border-cyan-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">Local Data Contributed</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {currentHospital.dataVolume.toLocaleString()} <span className="text-xs text-slate-400 font-normal">records</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-2 block">
            LOINC / SNOMED Standardized
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">Data Quality Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {currentHospital.qualityScore}%
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            High Completeness Index
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">Global Model Influence</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-heading">
            {currentHospital.influence}
          </div>
          <span className="text-[11px] text-purple-300 font-mono mt-2 block">
            Weight Matrix Share ($\Delta W$)
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-400/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-mono">DP Budget ($\varepsilon$) Consumed</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-heading">
            {currentHospital.privacyBudgetUsed}
          </div>
          <span className="text-[11px] text-amber-300 font-mono mt-2 block">
            Safe Privacy Margin
          </span>
        </div>

      </div>

      {/* Main Grid: Comparison Chart + Plain Language Protection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Comparison Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">
              {currentHospital.name} vs. Network Baseline
            </h3>
            <span className="text-xs font-mono text-cyan-400">Relative Metrics</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Local" fill="#00f2fe" radius={[4, 4, 0, 0]} name={`${currentHospital.name}`} />
                <Bar dataKey="NetworkAvg" fill="#9d4edd" radius={[4, 4, 0, 0]} name="Network Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Plain Language Data Protection Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">
            How Your Patient Data Is Protected
          </h3>

          <div className="p-4 rounded-xl glass-card border border-cyan-400/20 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-heading">
              <Server className="w-4 h-4" /> 1. Local-Only Model Execution
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              All ML training runs inside your hospital’s own hardware container. Raw patient records never cross your network firewall.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-purple-400/20 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs font-heading">
              <Lock className="w-4 h-4" /> 2. Differential Privacy Noise Injection
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Calibrated mathematical noise is added to weight updates before transmission, ensuring individual patient records cannot be reverse-engineered.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-emerald-400/20 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-heading">
              <ShieldCheck className="w-4 h-4" /> 3. Zero Raw Payload Transfer
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Only encrypted mathematical weight gradients ($\Delta W$) are shared with the central aggregator — never patient images, EHR text, or personal identifiers.
            </p>
          </div>
        </div>

      </div>

      {/* Cryptographic Audit Log Stream */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Verifiable SHA-256 Model Weight Commitment Audit Stream</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">
            Immutable Audit Trail
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log, index) => (
            <div key={index} className="p-3 rounded-xl bg-slate-950/90 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                  {log.round}
                </span>
                <span className="text-slate-300">{log.event}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-cyan-300">{log.hash}</span>
                <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                <span className="text-emerald-400 font-bold">{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
