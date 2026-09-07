import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Activity, Layers, Lock, Cpu, Database, Eye, Award, 
  ArrowRight, Users, CheckCircle2, Zap, Server, Globe2, Sparkles, TrendingUp, AlertTriangle
} from 'lucide-react';
import NetworkTopologyCanvas from '../components/NetworkTopologyCanvas';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (email && hospitalName) {
      setSubmitted(true);
    }
  };

  const problemStats = [
    {
      value: '43%',
      label: 'Full Interoperability',
      sub: 'Only 43% of hospitals achieve seamless data exchange across domains',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      value: '27% / 42%',
      label: 'Rural Workforce Gap',
      sub: 'Rural clinics have 27% fewer doctors and 42% fewer nurses than urban centers',
      gradient: 'from-amber-400 to-rose-500'
    },
    {
      value: '$7.42M',
      label: 'Avg Data Breach Cost',
      sub: 'Healthcare data breaches take an average of 279 days to contain',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      value: '23%',
      label: 'Global Workforce for 50%',
      sub: 'Only 23% of health workforce serves over half the world’s rural population',
      gradient: 'from-emerald-400 to-teal-500'
    }
  ];

  const solutionSteps = [
    {
      step: '01',
      title: 'Interoperability Layer',
      desc: 'FHIR-based normalization module ingests each hospital’s raw EHR schema, lab exports, and CSVs into one common standard.',
      icon: Database,
      accent: '#00f2fe'
    },
    {
      step: '02',
      title: 'Federated Learning Core',
      desc: 'Central coordinator distributes base ML model. Hospitals train locally on their own patients and return weight updates only.',
      icon: Cpu,
      accent: '#9d4edd'
    },
    {
      step: '03',
      title: 'Secure Aggregation',
      desc: 'Coordinator merges encrypted weight updates from all hospitals into a smarter global model using FedAvg algorithm.',
      icon: Layers,
      accent: '#3b82f6'
    },
    {
      step: '04',
      title: 'Low-Resource Optimization',
      desc: 'Model compression & distillation keep local training lightweight for modest hardware; resumable sync handles low bandwidth.',
      icon: Zap,
      accent: '#fbbf24'
    },
    {
      step: '05',
      title: 'Privacy & Trust Layer',
      desc: 'Differential privacy noise prevents re-identification; transparency dashboard lets hospitals audit contributions.',
      icon: ShieldCheck,
      accent: '#10b981'
    }
  ];

  const features = [
    {
      title: 'Interoperability-First Design',
      desc: 'FHIR-based normalization layer resolving data heterogeneity before federated training begins.',
      icon: Database
    },
    {
      title: 'Low-Resource Optimization',
      desc: 'Model compression for modest hospital hardware and resumable sync for unstable connections.',
      icon: Zap
    },
    {
      title: 'Privacy-by-Design',
      desc: 'Differential privacy noise injection on model updates preventing membership-inference attacks.',
      icon: Lock
    },
    {
      title: 'Incentive Contribution Model',
      desc: 'Hospitals contributing higher quality/volume data receive proportional access to global model weights.',
      icon: Award
    },
    {
      title: 'Transparency Governance',
      desc: 'Real-time dashboard enabling each node to trace exact weight aggregation into the global model.',
      icon: Eye
    },
    {
      title: 'Disease-Agnostic Architecture',
      desc: 'Generalizes across imaging, tabular EHR, and vitals, demonstrated on Sepsis & Diabetic Retinopathy.',
      icon: Activity
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Floating Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan-400/30 text-cyan-300 text-xs font-mono mb-8 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Hackathon Demo Prototype • Privacy-Preserving Collaborative AI</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading max-w-5xl mx-auto leading-[1.1] mb-6">
          Collaborative AI for Every Hospital, <br className="hidden sm:inline" />
          <span className="text-gradient-hero">Without Sharing a Single Patient Record.</span>
        </h1>

        {/* Elevator Pitch */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Federo Health lets any hospital — rich or rural — train smarter AI diagnostic models together 
          without sharing patient records, closing the global healthcare gap through privacy-first federated learning.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Clinical Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card border-white/20 text-slate-200 hover:text-white font-semibold text-sm hover:border-cyan-400/40 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore 5-Layer Architecture</span>
          </Link>
        </div>

        {/* Visual Showcase: Interactive Topology Diagram Teaser */}
        <div className="w-full max-w-5xl mx-auto">
          <NetworkTopologyCanvas activeRound={14} isTraining={true} />
        </div>

      </section>


      {/* SECTION 2: THE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            The Healthcare Data Paradox
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mt-2">
            Hospitals Have Massive Data, But It Remains Siloed & Fragmented.
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Privacy regulations (HIPAA, GDPR, DPDP) and breach risks make centralizing raw patient data illegal or non-viable. 
            Consequently, small and rural hospitals are structurally excluded from medical AI breakthroughs.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemStats.map((stat, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className={`text-4xl sm:text-5xl font-extrabold font-heading bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
                <h3 className="text-base font-bold text-white mt-3 font-heading">{stat.label}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed font-light">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 3: THE SOLUTION - 5-STEP FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">
            The Solution Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mt-2">
            How Federo Health Works in 5 Unified Layers
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            A disease-agnostic framework tailored for low-resource facilities to train AI locally and sync securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {solutionSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-white/10 relative flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{step.step}</span>
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white font-heading mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Privacy Verified
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* SECTION 4: INNOVATION & FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            Core Technology Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mt-2">
            Built for Equitable AI Access Across Healthcare Systems
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>


      {/* SECTION 5: USE CASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            Demonstrated Clinical Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mt-2">
            Validated Across Imaging & Tabular EHR Modalities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Diabetic Retinopathy */}
          <div className="glass-card p-8 rounded-2xl border border-cyan-400/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
                Image-Based Diagnostic ML
              </span>
              <span className="text-xs text-slate-400 font-mono">PyTorch Vision Core</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-heading mb-3">Diabetic Retinopathy Screening</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              Collaborative training of ResNet-50 models across rural eye clinics and urban eye centers using fundus camera images. 
              Local models process high-res scans on-site while sharing distilled feature weights to improve early blindness detection.
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pt-4 border-t border-white/10">
              <span>Simulated Global Accuracy: 94.2%</span>
              <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
                View Run <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Sepsis Risk Prediction */}
          <div className="glass-card p-8 rounded-2xl border border-purple-400/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono">
                Structured EHR & Vitals
              </span>
              <span className="text-xs text-slate-400 font-mono">Transformer / XGBoost FL</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-heading mb-3">Sepsis Early Detection & Risk</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              Continuous monitoring of ICU vitals (heart rate, temperature, WBC, blood pressure). FHIR normalization standardizes 
              disparate hospital EHR schemas so local models can detect early sepsis signals up to 6 hours before clinical onset.
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-purple-400 pt-4 border-t border-white/10">
              <span>Simulated Global AUROC: 0.915</span>
              <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
                View Run <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 6: IMPACT & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              Global Health Equity Mission
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
              Closing the Global AI Healthcare Gap
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Over half the world’s rural population lacks adequate healthcare access, and only 23% of the global health workforce serves them. 
              By letting any hospital — regardless of size, budget, or location — contribute to and benefit from shared AI diagnostic models 
              without compromising patient privacy, Federo Health meaningfully narrows the global AI access gap.
            </p>
          </div>
        </div>
      </section>


      {/* SECTION 7: MOCK NETWORK SIGNUP CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-8 rounded-2xl border border-cyan-400/30">
          <h3 className="text-2xl font-bold text-white font-heading mb-2">Join the Federo Health Network</h3>
          <p className="text-xs text-slate-400 mb-6">
            Request an edge node initialization bundle for your hospital or research facility.
          </p>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-center gap-2 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Edge node authorization token sent to registration email!</span>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Hospital / Institution Name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 flex-1"
              />
              <input
                type="email"
                required
                placeholder="Admin Email (e.g. admin@health.org)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 flex-1"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold hover:scale-105 transition-transform"
              >
                Join Network
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
