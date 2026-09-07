import React, { useState } from 'react';
import { 
  Database, Cpu, Layers, Zap, ShieldCheck, ChevronDown, ChevronUp, 
  HelpCircle, ArrowRight, Lock, CheckCircle2, Server
} from 'lucide-react';
import FHIRNormalizer from '../components/FHIRNormalizer';

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const layers = [
    {
      title: 'Layer 1: Interoperability & FHIR Normalization',
      desc: 'Hospitals use vastly different EHR systems (Epic, Cerner, custom SQL, paper CSVs). Federo Health automatically translates raw hospital schema into standardized FHIR R4 JSON schemas (LOINC & SNOMED CT) before training begins.',
      icon: Database,
      accent: 'border-cyan-400/40 text-cyan-400'
    },
    {
      title: 'Layer 2: Federated Learning Core (Local Training)',
      desc: 'A central coordinator sends a base model (e.g. ResNet-50 for vision, Transformer for EHR). Each hospital node trains the model strictly on its local patient records on-site.',
      icon: Cpu,
      accent: 'border-purple-400/40 text-purple-400'
    },
    {
      title: 'Layer 3: Secure Aggregation (FedAvg / FedProx)',
      desc: 'Instead of raw patient data, hospitals send back only encrypted model weight updates ($\Delta W$). The coordinator aggregates these updates into a global model using FedAvg.',
      icon: Layers,
      accent: 'border-blue-400/40 text-blue-400'
    },
    {
      title: 'Layer 4: Low-Resource & Low-Bandwidth Optimization',
      desc: 'Designed for rural hospitals with modest edge hardware and 3G/4G connectivity. Knowledge distillation compresses models while asynchronous, resumable sync handles network dropouts.',
      icon: Zap,
      accent: 'border-amber-400/40 text-amber-400'
    },
    {
      title: 'Layer 5: Privacy & Governance Trust Layer',
      desc: 'Differential privacy noise injection ($\varepsilon = 0.55$) guarantees zero re-identification. Transparency dashboards let hospitals inspect exact model contribution shares.',
      icon: ShieldCheck,
      accent: 'border-emerald-400/40 text-emerald-400'
    }
  ];

  const faqs = [
    {
      q: 'Is patient data ever shared or transmitted outside the hospital?',
      a: 'Never. Under no circumstances does raw patient data (EHR text, lab results, CT scans, retina images) leave the hospital’s local firewall. Local training runs inside isolated Docker edge nodes, and only encrypted model weight gradients (ΔW) are sent to the coordinator.'
    },
    {
      q: 'What if a rural hospital has low bandwidth or unstable internet?',
      a: 'Federo Health features an asynchronous, resumable sync engine. If connection drops during weight upload, updates are queued locally and automatically resumed once connection restores. Model weights are also compressed via quantization to require minimal data transfer (< 5 MB per round).'
    },
    {
      q: 'How is this different from a traditional centralized AI model?',
      a: 'Traditional AI requires uploading millions of patient records to a single cloud server — creating legal, HIPAA/GDPR, and breach risks. Federo Health brings the code to the data rather than bringing data to the code, enabling collaborative learning with zero centralization.'
    },
    {
      q: 'What happens to small/rural hospitals with very little patient data?',
      a: 'Small hospitals benefit disproportionately! Even if a rural clinic only has 200 patient cases, participating in the federated network gives them access to a global model trained on 50,000+ patient cases across the entire network.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
          Technical Architecture Breakdown
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          How Federo Health Works
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          A step-by-step breakdown of our 5-layer privacy-preserving federated architecture designed for global health equity.
        </p>
      </div>

      {/* 5 Architecture Layers */}
      <div className="space-y-6">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={idx} className={`glass-panel p-6 sm:p-8 rounded-2xl border ${layer.accent} space-y-3 relative overflow-hidden group`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">{layer.title}</h3>
                  <span className="text-xs font-mono text-slate-400">Layer {idx + 1} Specification</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light pl-16">
                {layer.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Embedded Live FHIR Normalizer Component */}
      <section className="pt-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white font-heading">
            Try the Live FHIR Interoperability Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            See how non-standard rural clinic CSV records translate instantly into standardized FHIR R4 JSON payloads.
          </p>
        </div>
        <FHIRNormalizer />
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Clear Answers for Healthcare Leaders & Judges
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm font-bold text-white font-heading">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed font-light border-t border-white/5 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
