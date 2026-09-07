import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu, Database, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full glass-panel border-t border-white/10 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Elevator Pitch */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white font-heading tracking-tight">
                Federo<span className="text-cyan-400">.Health</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Federo Health lets any hospital — rich or rural — train smarter AI diagnostic models together 
              without sharing patient records, closing the global healthcare gap through privacy-first federated learning.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-mono flex items-center gap-1">
                <Database className="w-3 h-3" /> FHIR R4 Standardized
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-[11px] font-mono flex items-center gap-1">
                <Lock className="w-3 h-3" /> Differential Privacy
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Flower & PyTorch Core
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider font-mono">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Project Overview</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Live Network Dashboard <span className="px-1.5 py-0.5 text-[9px] bg-cyan-400/10 text-cyan-300 rounded">Interactive</span>
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">5-Layer Architecture & FHIR</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  About Project & Team Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal / Hackathon Note */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider font-mono">Hackathon Submission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as a proof-of-concept prototype for healthcare privacy & interoperability hackathons. All hospital node telemetry is simulated.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-300">
              <span className="text-cyan-400 font-semibold block mb-0.5">Privacy First Guarantee</span>
              Zero raw EHR payload transfer across edge node boundaries.
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Federo Health Project. Built for Hackathon Submission.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Empowering rural & urban healthcare with collaborative AI</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
