import React, { useState } from 'react';
import {
  Globe, ShieldCheck, Building2, Server, CheckCircle2, Lock,
  Share2, Award, Search, Filter, Layers, Database, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NetworkDirectoryPage({ onSelectHospitalForTransfer }) {
  const { hospitals, currentHospital } = useAuth();
  const [tierFilter, setTierFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = hospitals.filter(h => {
    if (tierFilter !== 'all' && h.tier !== tierFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchLoc = (h.region || '').toLowerCase().includes(q) || (h.country || '').toLowerCase().includes(q);
      const matchLic = (h.licenseNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchLic) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-7 h-7 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white font-heading">
                Verified Institutional Network Directory
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explore verified healthcare nodes across the Federo Health federation. All members maintain registered ECDSA cryptographic identities and adhere to HL7 FHIR R4 interoperability protocols.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{hospitals.length} Verified Institutions Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/5 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospitals by name, country, license number..."
            className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Urban Tertiary', 'Regional Academic', 'Rural Low-Resource', 'Community Hospital'].map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                tierFilter === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Tiers' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map(h => {
          const isCurrent = h.id === currentHospital?.id;

          return (
            <div
              key={h.id}
              className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-950/90 border-cyan-400/50 shadow-cyan-500/5'
                  : 'bg-slate-950/70 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-heading">{h.name}</h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          Current Node
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {h.region}, {h.country} · License: <span className="font-mono text-cyan-300">{h.licenseNumber}</span>
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" /> Verified & Active
                  </span>
                </div>

                {/* Tier and Key details */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Institutional Tier:</span>
                    <span className="font-semibold text-white">{h.tier}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Public Key Fingerprint:</span>
                    <span className="font-mono text-purple-300 font-bold">{h.pubKeyFingerprint}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Verified Quality Rating:</span>
                    <span className="font-mono text-emerald-400 font-bold">{h.qualityScore}% (High Quality)</span>
                  </div>
                </div>

                {/* Shared Disease Models Badges */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Active Disease Model Contributions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 text-[10px] font-medium">
                      Sepsis Early Predictor v2.1
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-400/20 text-[10px] font-medium">
                      Diabetic Retinopathy Grade v1.4
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 text-[10px] font-medium">
                      Cardiology ECG Risk v1.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Admin Contact: <strong className="text-slate-200">{h.adminEmail}</strong>
                </span>

                {!isCurrent && onSelectHospitalForTransfer && (
                  <button
                    onClick={() => onSelectHospitalForTransfer(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-semibold transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Transfer Model
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
