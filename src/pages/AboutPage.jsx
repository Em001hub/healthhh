import React from 'react';
import { 
  Users, Heart, ShieldCheck, Cpu, Database, Award, 
  Sparkles, ExternalLink, Globe2, AlertCircle, FileCode
} from 'lucide-react';

export default function AboutPage() {
  const teamPlaceholders = [
    {
      role: 'ML & Federated Learning Lead',
      placeholder: '[Hackathon Team Member A]',
      bio: 'Focuses on PyTorch model architectures, FedAvg aggregation algorithms, and model compression for edge hardware.',
      badge: 'Federated ML Specialist',
      gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30'
    },
    {
      role: 'Interoperability & Data Eng. Lead',
      placeholder: '[Hackathon Team Member B]',
      bio: 'Architect of the FHIR R4 normalization engine, LOINC/SNOMED CT mapping pipelines, and EHR schema transformers.',
      badge: 'FHIR Standards Architect',
      gradient: 'from-purple-500/20 to-indigo-500/20 border-purple-400/30'
    },
    {
      role: 'Privacy & Security Lead',
      placeholder: '[Hackathon Team Member C]',
      bio: 'Implements differential privacy noise injection, Laplace noise calibration, and zero-knowledge cryptographic audit streams.',
      badge: 'Privacy-by-Design Engineer',
      gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/30'
    },
    {
      role: 'Research & Documentation Lead',
      placeholder: '[Hackathon Team Member D]',
      bio: 'Leads clinical use-case validation for Diabetic Retinopathy & Sepsis, impact metrics modeling, and hackathon presentation.',
      badge: 'Clinical Research Lead',
      gradient: 'from-amber-500/20 to-rose-500/20 border-amber-400/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header & Mission */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
          Project Mission & Team
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Democratizing Healthcare AI Without Borders
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Federo Health was founded on a simple premise: no hospital should be excluded from life-saving diagnostic AI 
          simply because of its location, size, or IT infrastructure budget.
        </p>
      </div>

      {/* Problem-to-Solution Extended Narrative */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-2xl font-bold text-white font-heading">
          The Story Behind Federo Health
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-cyan-400 font-heading">The Interoperability & Privacy Wall</h3>
            <p>
              Healthcare data is locked inside thousands of distinct EHR silos across the globe. Privacy regulations like HIPAA, 
              GDPR, and India’s DPDP Act strictly prohibit sending raw patient records to external cloud servers.
            </p>
            <p>
              Even where legal, centralizing medical data creates multi-million dollar honeypots vulnerable to cyberattacks, 
              with healthcare data breaches costing an average of $7.42 million.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-purple-400 font-heading">The Rural AI Exclusion Gap</h3>
            <p>
              Because current AI models are trained exclusively on data from affluent urban medical centers, they frequently fail to generalize 
              to rural or underrepresented populations.
            </p>
            <p>
              Federo Health bridges this structural divide. By bringing model training directly to the hospital edge and aggregating weight updates 
              via differential privacy, every facility contributes to and benefits from shared medical intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Team Member Cards (Hackathon Placeholders) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-widest">
            Project Contributors
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Hackathon Team Roles
          </h2>
          <p className="text-xs text-slate-400">
            Team member names kept as customizable placeholders for submission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamPlaceholders.map((member, idx) => (
            <div key={idx} className={`glass-card p-6 rounded-2xl border ${member.gradient} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 text-[10px] font-mono border border-white/10">
                  {member.badge}
                </span>

                <div className="pt-1">
                  <h3 className="text-sm font-bold text-white font-heading">{member.role}</h3>
                  <span className="text-xs font-mono text-cyan-300 font-semibold block mt-0.5">
                    {member.placeholder}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" /> Hackathon Role Assigned
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack References Showcase */}
      <div className="p-8 rounded-2xl glass-panel border border-white/10 text-center space-y-4">
        <h3 className="text-lg font-bold text-white font-heading">
          Referenced Technology Frameworks & Standards
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-400/30 text-cyan-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> HL7 FHIR R4 Standard
          </span>
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-purple-400/30 text-purple-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Flower FL Framework
          </span>
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-indigo-400/30 text-indigo-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" /> PyTorch 2.0 Core
          </span>
          <span className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-400/30 text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Differential Privacy ($\varepsilon=0.55$)
          </span>
        </div>
      </div>

    </div>
  );
}
