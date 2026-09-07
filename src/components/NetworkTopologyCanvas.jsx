import React, { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Server, Database } from 'lucide-react';

if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

export default function NetworkTopologyCanvas({ activeRound = 14, isTraining = false, partitionStats = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showRawDataShield, setShowRawDataShield] = useState(false);

  const hospitals = [
    {
      id: 'h1',
      name: 'City Medical Center A',
      type: 'Urban Tertiary Center',
      location: 'Chicago, USA',
      dataVolume: '14,200 records',
      qualityScore: 98.4,
      hardware: 'GPU Cluster (NVIDIA A100)',
      bandwidth: '1.2 Gbps (Fiber)',
      noiseScale: 'ε = 0.52',
      status: 'Synchronized',
      xPct: 20,
      yPct: 25,
      xPx: 200,
      yPx: 125,
      color: '#00f2fe'
    },
    {
      id: 'h2',
      name: 'Valley District Clinic',
      type: 'Rural Low-Resource Facility',
      location: 'Appalachia, USA',
      dataVolume: '2,850 records',
      qualityScore: 94.1,
      hardware: 'Local Edge Server (CPU)',
      bandwidth: '5.2 Mbps (Low / Resumable)',
      noiseScale: 'ε = 0.58',
      status: 'Syncing Weights',
      xPct: 80,
      yPct: 25,
      xPx: 800,
      yPx: 125,
      color: '#fbbf24'
    },
    {
      id: 'h3',
      name: 'Metro Academic Health B',
      type: 'Regional Teaching Hospital',
      location: 'London, UK',
      dataVolume: '18,900 records',
      qualityScore: 99.1,
      hardware: 'GPU Cluster (NVIDIA H100)',
      bandwidth: '2.5 Gbps (Direct)',
      noiseScale: 'ε = 0.49',
      status: 'Synchronized',
      xPct: 18,
      yPct: 75,
      xPx: 180,
      yPx: 375,
      color: '#c084fc'
    },
    {
      id: 'h4',
      name: 'St. Jude Community Hospital',
      type: 'Small Community Facility',
      location: 'Kerala, India',
      dataVolume: '4,100 records',
      qualityScore: 92.8,
      hardware: 'Workstation (NVIDIA RTX 3080)',
      bandwidth: '15 Mbps (Async Sync)',
      noiseScale: 'ε = 0.55',
      status: 'Local Epoch Complete',
      xPct: 82,
      yPct: 75,
      xPx: 820,
      yPx: 375,
      color: '#34d399'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl glass-panel border border-white/10 p-6 overflow-hidden">
      
      {/* Topology Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 z-10 relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-lg font-bold text-white font-heading">
              Federated Hospital Network Topology
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-400/30">
              Live Topology Visualizer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visualization of model weight updates (ΔW) aggregated at central hub while raw patient data remains in local hospital vaults.
          </p>
        </div>

        {/* Shield Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawDataShield(!showRawDataShield)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 flex items-center gap-2 ${
              showRawDataShield
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{showRawDataShield ? 'Raw Data Egress Test: BLOCKED' : 'Privacy Shield: ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Topology Area */}
      <div className="relative w-full h-[420px] rounded-xl bg-slate-950/80 border border-white/5 overflow-hidden flex items-center justify-center">
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9d4edd" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection Lines from Center (500, 250) to Each Node */}
          {hospitals.map((h) => (
            <g key={`link-${h.id}`}>
              <line
                x1="500"
                y1="250"
                x2={h.xPx}
                y2={h.yPx}
                stroke="url(#cyanLine)"
                strokeWidth="2"
                strokeDasharray="6,6"
                className="opacity-70"
              />
              
              {/* Particle Animation showing encrypted weights flowing outward */}
              <circle r="5" fill="#00f2fe" filter="url(#glow)">
                <animateMotion
                  path={`M 500 250 L ${h.xPx} ${h.yPx}`}
                  dur={isTraining ? '1.5s' : '3s'}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Particle Animation showing encrypted weights flowing inward */}
              <circle r="4" fill="#c084fc" filter="url(#glow)">
                <animateMotion
                  path={`M ${h.xPx} ${h.yPx} L 500 250`}
                  dur={isTraining ? '1.8s' : '3.5s'}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>

        {/* Central Coordinator Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-50 blur-md group-hover:opacity-100 transition duration-500 animate-pulse-slow" />
            
            <div className="relative w-24 h-24 rounded-full bg-slate-950 border-2 border-cyan-400 p-2 flex flex-col items-center justify-center text-center shadow-2xl">
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white font-heading mt-1">Federo Hub</span>
              <span className="text-[9px] text-cyan-300 font-mono">Coordinator</span>
            </div>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-[10px] text-purple-300 font-mono whitespace-nowrap shadow-lg">
              FedAvg Aggregator (Round {activeRound})
            </div>
          </div>
        </div>

        {/* 4 Radial Hospital Nodes */}
        {hospitals.map((h) => {
          const isSelected = selectedNode?.id === h.id;
          return (
            <div
              key={h.id}
              onClick={() => setSelectedNode(isSelected ? null : h)}
              style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-all duration-300"
            >
              <div className="relative flex flex-col items-center">
                
                {/* Data Shield Ring if toggled */}
                {showRawDataShield && (
                  <div className="absolute -inset-4 rounded-2xl border-2 border-rose-500/80 bg-rose-500/10 backdrop-blur-xs flex items-center justify-center animate-pulse">
                    <span className="text-[9px] font-mono text-rose-300 font-bold px-1 py-0.5 rounded bg-slate-950/90 border border-rose-500">
                      RAW DATA VAULT LOCKED
                    </span>
                  </div>
                )}

                {/* Node Box */}
                <div
                  className={`relative p-3.5 rounded-xl glass-panel border transition-all duration-300 flex items-center gap-3 shadow-xl ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900/90 scale-105 shadow-cyan-500/30'
                      : 'border-white/10 hover:border-cyan-400/50 hover:scale-105'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                    <Server className="w-5 h-5" style={{ color: h.color }} />
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white font-heading">{h.name}</span>
                    <span className="text-[10px] text-slate-400">{h.type}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {h.dataVolume}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Local DP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-slate-950/90 border border-white/10 text-[9px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Updates ΔW Only</span>
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-400/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-heading">{selectedNode.name}</h4>
              <p className="text-xs text-slate-400">{selectedNode.location} • {selectedNode.hardware}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full md:w-auto">
            <div className="p-2 rounded bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-mono">Contributed Volume</span>
              <span className="font-bold text-cyan-300 font-mono">{selectedNode.dataVolume}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-mono">Data Quality Score</span>
              <span className="font-bold text-emerald-400 font-mono">{selectedNode.qualityScore}%</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-mono">DP Noise Budget</span>
              <span className="font-bold text-purple-300 font-mono">{selectedNode.noiseScale}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-mono">Network Connectivity</span>
              <span className="font-bold text-amber-300 font-mono">{selectedNode.bandwidth}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Encrypted Model Weights (ΔW)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span>Global Aggregated Weights (W_global)</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Raw Patient Records: Never Transmitted</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Encryption: Homomorphic / DP Noise ε = 0.55
        </span>
      </div>

    </div>
  );
}
