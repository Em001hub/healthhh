import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, ShieldCheck, Lock, Layers, Activity, Cpu,
  Database, Award, CheckCircle2, TrendingUp, Eye, Server,
  Terminal, Sparkles, FlaskConical, Zap, Upload, Inbox, Globe, Key, UserCheck,
  BarChart2, Users, ArrowUpRight, Info, WifiOff, Wifi
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import NetworkTopologyCanvas from '../components/NetworkTopologyCanvas';
import DataUploadPanel from '../components/DataUploadPanel';
import ModelRegistry from '../components/ModelRegistry';
import ModelCardModal from '../components/ModelCardModal';
import ModelSharingModal from '../components/ModelSharingModal';
import IncomingModelsQueue from '../components/IncomingModelsQueue';
import AuditLogView from '../components/AuditLogView';
import AuthModal from '../components/AuthModal';
import FederationImpactCard from '../components/FederationImpactCard';
import OfflineSyncPanel from '../components/OfflineSyncPanel';
import { RealFederatedEngine, HOSPITAL_NODES } from '../utils/federatedEngine';
import { useAuth } from '../context/AuthContext';
import { federateModels } from '../utils/apiClient';

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-400/30 shadow-xl text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { currentHospital, currentUser, logAuditAction, isSuperAdminMode } = useAuth();

  const [activeTab, setActiveTab] = useState('simulator');
  const [useCase, setUseCase] = useState('sepsis');
  const [isRunning, setIsRunning] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFHIRModal, setShowFHIRModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('h2');
  const [history, setHistory] = useState([]);
  const [partitionStats, setPartitionStats] = useState([]);
  const [lastRecord, setLastRecord] = useState(null);
  const [fhirPreview, setFhirPreview] = useState(null);

  // Low bandwidth mode
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  // Federation impact (from latest federation round)
  const [latestFederationRound, setLatestFederationRound] = useState(null);
  const [isFederating, setIsFederating] = useState(false);

  // Model Management & Modals
  const [selectedModelCard, setSelectedModelCard] = useState(null);
  const [sharingModel, setSharingModel] = useState(null);

  // Multi-Model Registry state
  const [hospitalModels, setHospitalModels] = useState([
    {
      modelId: 'mod-sepsis-9481',
      version: 'v2.1',
      name: 'Valley Sepsis Early Detection Classifier',
      useCase: 'sepsis',
      category: 'Critical Care',
      createdAt: '2026-09-05T14:30:00Z',
      status: 'ACTIVE_LOCAL_VERIFIED',
      trainingMode: 'cloud',
      provenance: {
        hospitalId: 'h2',
        hospitalName: 'Valley District Clinic',
        hospitalTier: 'Rural Low-Resource',
        country: 'USA',
        pubKeyFingerprint: '0x4b1e9c2f33d98a01',
      },
      datasetProfile: {
        totalRecords: 2850,
        dataQualityScore: 94.1,
        duplicatesRemoved: 14,
        outliersHandled: 28,
        fhirMappedColumns: 12,
      },
      modelArchitecture: {
        selectedAlgorithm: 'Clinical Logistic Regression (L2 Regularized)',
        family: 'Generalized Linear Model with L2 Regularization',
        selectionRationale: 'Tabular clinical cohort with 12 physiological biomarkers. Logistic Regression with L2 regularization provides fast convergence and high interpretability on rural cohorts.',
        networkLayers: 'Input(12) → StandardScaler → LogisticRegression(C=1.0, max_iter=200, lbfgs)',
        trainingDuration: '0.84s',
      },
      performance: {
        accuracy: 71.2,
        precision: 0.69,
        recall: 0.74,
        f1Score: 0.715,
        auroc: 0.812,
        confusionMatrix: { tp: 88, fp: 6, tn: 104, fn: 8, total: 206 },
      },
      featureImportances: [
        { feature: 'wbc_count', normalizedScore: 28.4 },
        { feature: 'temp_c', normalizedScore: 22.1 },
        { feature: 'heart_rate', normalizedScore: 18.5 },
        { feature: 'map_mmhg', normalizedScore: 14.2 },
        { feature: 'respiratory_rate', normalizedScore: 9.8 },
        { feature: 'glucose', normalizedScore: 7.0 },
      ],
      weightsHash: '0x8f3c4e1a91a27b3d4f5e6a7b8c9d0e1f',
      signatureInfo: {
        signature: '3045022100e4b8a2c1d9f8e7...88a2',
        signerPublicKeyFingerprint: '0x4b1e9c2f33d98a01',
        algorithm: 'ECDSA_P256_SHA256',
      },
      federationImpact: {
        localAccuracy: 71.2,
        federatedAccuracy: 89.1,
        delta: 17.9,
      },
      aggregationMethod: 'equity_weighted_fedavg',
    },
    {
      modelId: 'mod-retino-3301',
      version: 'v1.4',
      name: 'Valley Diabetic Retinopathy Severity Grader',
      useCase: 'retinopathy',
      category: 'Ophthalmology',
      createdAt: '2026-09-02T10:15:00Z',
      status: 'SHARED_TO_NETWORK',
      trainingMode: 'edge',
      provenance: {
        hospitalId: 'h2',
        hospitalName: 'Valley District Clinic',
        hospitalTier: 'Rural Low-Resource',
        country: 'USA',
        pubKeyFingerprint: '0x4b1e9c2f33d98a01',
      },
      datasetProfile: {
        totalRecords: 1400,
        dataQualityScore: 92.5,
        duplicatesRemoved: 6,
        outliersHandled: 12,
        fhirMappedColumns: 6,
      },
      modelArchitecture: {
        selectedAlgorithm: 'Clinical Deep MLP Classifier',
        family: 'Multi-Layer Neural Network',
        selectionRationale: '6 fundus feature biomarkers with high class balance.',
        networkLayers: 'Input(6) → Dense(16, relu) → Dense(8, relu) → Dense(1, sigmoid)',
        trainingDuration: '0.98s',
      },
      performance: {
        accuracy: 68.4,
        precision: 0.66,
        recall: 0.71,
        f1Score: 0.684,
        auroc: 0.782,
        confusionMatrix: { tp: 52, fp: 6, tn: 78, fn: 7, total: 143 },
      },
      featureImportances: [
        { feature: 'macular_edema', normalizedScore: 34.2 },
        { feature: 'microaneurysm_density', normalizedScore: 28.1 },
        { feature: 'hemorrhage_score', normalizedScore: 19.5 },
        { feature: 'exudate_density', normalizedScore: 18.2 },
      ],
      weightsHash: '0x4b1e9c2f33d98a017b8c9d0e1f2a3b4c',
      signatureInfo: {
        signature: '304502210091a27b3d4f5e6a...7c9a',
        signerPublicKeyFingerprint: '0x4b1e9c2f33d98a01',
        algorithm: 'ECDSA_P256_SHA256',
      },
      federationImpact: {
        localAccuracy: 68.4,
        federatedAccuracy: 85.9,
        delta: 17.5,
      },
      aggregationMethod: 'equity_weighted_fedavg',
    },
  ]);

  const [incomingModels, setIncomingModels] = useState([
    {
      modelId: 'mod-pediatric-sepsis-8812',
      version: 'v1.0',
      name: 'Pediatric ICU Sepsis Alert Model',
      useCase: 'sepsis',
      category: 'Critical Care',
      createdAt: '2026-09-06T19:20:00Z',
      status: 'INCOMING_PENDING_REVIEW',
      trainingMode: 'cloud',
      provenance: {
        hospitalId: 'h1',
        hospitalName: 'City Medical Center A',
        hospitalTier: 'Urban Tertiary',
        country: 'USA',
        pubKeyFingerprint: '0x8f3c4e1a91a27b3d',
      },
      datasetProfile: {
        totalRecords: 5400,
        dataQualityScore: 98.4,
        duplicatesRemoved: 22,
        outliersHandled: 41,
        fhirMappedColumns: 12,
      },
      modelArchitecture: {
        selectedAlgorithm: 'Gradient Boosting Classifier (Clinical Ensemble)',
        family: 'Gradient Boosted Decision Trees',
        selectionRationale: 'Large-scale pediatric ICU cohort, GBM provides optimal non-linear boundary separation.',
        networkLayers: 'Input(12) → StandardScaler → GradientBoostingClassifier(n_estimators=100)',
        trainingDuration: '2.1s',
      },
      performance: {
        accuracy: 96.4,
        precision: 0.95,
        recall: 0.94,
        f1Score: 0.945,
        auroc: 0.982,
        confusionMatrix: { tp: 142, fp: 7, tn: 185, fn: 9, total: 343 },
      },
      featureImportances: [
        { feature: 'heart_rate', normalizedScore: 31.2 },
        { feature: 'temp_c', normalizedScore: 26.5 },
        { feature: 'wbc_count', normalizedScore: 21.0 },
        { feature: 'resp_rate', normalizedScore: 21.3 },
      ],
      weightsHash: '0x7c9a2d8e08e16f4491a27b3d4f5e6a7b',
      signatureInfo: {
        signature: '3045022100c8b9a1d2e3f4a5...99b1',
        signerPublicKeyFingerprint: '0x8f3c4e1a91a27b3d',
        algorithm: 'ECDSA_P256_SHA256',
      },
      federationImpact: { localAccuracy: 91.2, federatedAccuracy: 96.4, delta: 5.2 },
      aggregationMethod: 'equity_weighted_fedavg',
    },
  ]);

  const engineRef = useRef(null);

  // ── Build / Rebuild FL Engine ─────────────────────────────────────────────
  const buildEngine = useCallback((uc) => {
    const eng = new RealFederatedEngine(uc, {});
    for (let i = 0; i < 4; i++) eng.stepRound();
    engineRef.current = eng;
    setHistory([...eng.history]);
    setPartitionStats(eng.getHospitalPartitionStats());
    setLastRecord(eng.history[eng.history.length - 1] || null);
    setIsRunning(false);
  }, []);

  useEffect(() => { buildEngine(useCase); }, [useCase, buildEngine]);

  // ── Simulator Step Interval ───────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const rec = engineRef.current.stepRound();
      setHistory([...engineRef.current.history]);
      setLastRecord(rec);
    }, 1400);
    return () => clearInterval(id);
  }, [isRunning]);

  const stepOnce = () => {
    const rec = engineRef.current.stepRound();
    setHistory([...engineRef.current.history]);
    setLastRecord(rec);
  };

  // ── Run Federation Round (backend) ─────────────────────────────────────────
  const handleRunFederationRound = async () => {
    if (isFederating) return;
    setIsFederating(true);
    try {
      const result = await federateModels(useCase);
      setLatestFederationRound(result);
      // Also update hospital models with the new federated accuracy
      setHospitalModels(prev => prev.map(m => {
        if (m.useCase === useCase && m.federationImpact) {
          return {
            ...m,
            federationImpact: {
              ...m.federationImpact,
              federatedAccuracy: Math.max(m.federationImpact.federatedAccuracy, result.global_accuracy),
              delta: Math.round((Math.max(m.federationImpact.federatedAccuracy, result.global_accuracy) - m.federationImpact.localAccuracy) * 10) / 10,
            },
          };
        }
        return m;
      }));
    } catch (err) {
      // Backend not running — fall back gracefully
      console.warn('Federation API unavailable, using local simulation:', err.message);
      const rec = engineRef.current.stepRound();
      setHistory([...engineRef.current.history]);
      setLastRecord(rec);
    } finally {
      setIsFederating(false);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleModelTrained = (newModel) => {
    setHospitalModels(prev => [newModel, ...prev]);
  };

  const handleModelSharedToPeer = ({ targetHospitalId, transferPackage }) => {
    setIncomingModels(prev => [transferPackage, ...prev]);
    setHospitalModels(prev =>
      prev.map(m => (m.modelId === transferPackage.modelId ? { ...m, status: 'SHARED_TO_NETWORK' } : m))
    );
  };

  const handleAcceptIncomingModel = (acceptedModel) => {
    setIncomingModels(prev => prev.filter(m => m.modelId !== acceptedModel.modelId));
    setHospitalModels(prev => [{ ...acceptedModel, status: 'ACTIVE_LOCAL_VERIFIED' }, ...prev]);
  };

  const handleRejectIncomingModel = (modelId) => {
    setIncomingModels(prev => prev.filter(m => m.modelId !== modelId));
  };

  // Simulate processing a queued item
  const handleFlushQueueItem = async (item) => {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    return { success: true, item: item.type };
  };

  // ── Values ────────────────────────────────────────────────────────────────
  const currentRound = lastRecord?.roundNum ?? 0;
  const currentAccuracy = lastRecord?.accuracy ?? 0;
  const currentLoss = lastRecord?.loss ?? 0;
  const currentAUROC = lastRecord?.auroc ?? 0;
  const totalSamples = lastRecord?.totalSamples ?? (engineRef.current?.dataset?.length ?? 0);

  const dpEpsilon = 0.55;
  const dpDelta = 1e-5;
  const dpClipNorm = 1.0;
  const dpSigma = parseFloat((dpClipNorm * Math.sqrt(2 * Math.log(1.25 / dpDelta)) / dpEpsilon).toFixed(4));

  const selHosp = partitionStats.find(h => h.id === selectedHospital) || partitionStats[0] || {};

  // Best federation impact from all models
  const bestImpact = hospitalModels
    .filter(m => m.federationImpact?.delta > 0)
    .sort((a, b) => (b.federationImpact?.delta ?? 0) - (a.federationImpact?.delta ?? 0))[0];

  const previewFHIR = () => {
    const eng = engineRef.current;
    if (!eng) return;
    const bundle = eng.generateFHIRBundle(eng.dataset[0], useCase);
    setFhirPreview(bundle);
    setShowFHIRModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── TOP BANNER & IDENTITY BAR ──────────────────────────────────────── */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-heading">
                  Federo Health — Clinical AI Federation Platform
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  FastAPI Cloud Backend · TF.js Edge Mode · Equity-Weighted FedAvg · Subgroup Fairness Audit · Offline-First Queue
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Low Bandwidth Toggle (compact) */}
            <button
              onClick={() => setIsLowBandwidth(b => !b)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isLowBandwidth
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={isLowBandwidth ? 'Low Bandwidth Mode ON — uploads are queued' : 'Enable Low Bandwidth Simulation'}
            >
              {isLowBandwidth ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              {isLowBandwidth ? 'Low BW Mode' : 'Simulate Low BW'}
            </button>

            {/* Institutional Identity Status Chip */}
            <div className="flex items-center gap-2 bg-slate-950/90 p-2 px-3.5 rounded-2xl border border-white/10 text-xs">
              <div className={`w-2.5 h-2.5 rounded-full ${isSuperAdminMode ? 'bg-purple-400' : 'bg-cyan-400'} animate-pulse`}></div>
              <div className="flex flex-col">
                <span className="font-bold text-white font-heading">
                  {isSuperAdminMode ? 'Federo Network Governance Authority' : currentHospital?.name}
                </span>
                <span className={`text-[10px] ${isSuperAdminMode ? 'text-purple-300' : 'text-cyan-300'} font-mono`}>
                  Role: {isSuperAdminMode ? 'SUPER ADMIN (FULL GOVERNANCE)' : `${currentUser?.role?.replace('_', ' ').toUpperCase()} · Key: ${currentHospital?.pubKeyFingerprint}`}
                </span>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="ml-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10"
                title="Manage Institutional Identity / Strong Auth"
              >
                <Key className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Offline Sync Panel */}
        <OfflineSyncPanel
          isLowBandwidth={isLowBandwidth}
          onToggle={() => setIsLowBandwidth(b => !b)}
          onFlushItem={handleFlushQueueItem}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1.5 rounded-2xl border border-white/10 text-xs gap-1">
          {[
            { id: 'simulator', label: 'Federated Consensus Simulator', icon: Activity },
            { id: 'upload', label: 'Data Cleaning & Auto-Training', icon: Upload },
            { id: 'registry', label: `Hospital Model Registry (${hospitalModels.length})`, icon: Layers },
            { id: 'incoming', label: `Incoming Models Queue (${incomingModels.length})`, icon: Inbox, badge: incomingModels.length > 0 },
            { id: 'audit', label: 'Immutable Audit Trail', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/40 shadow-sm shadow-cyan-500/10 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB CONTENT ────────────────────────────────────────────────────── */}

      {/* ── TAB 1: FEDERATED SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="space-y-8">

          {/* KPI Row — 5 cards now including Federation Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-400/30">
              <span className="text-xs text-slate-400 font-mono">Consensus Accuracy</span>
              <div className="text-3xl font-bold text-cyan-300 font-heading mt-1">{currentAccuracy}%</div>
              <span className="text-[10px] text-emerald-400 font-mono">FedAvg Round R{currentRound}</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-purple-400/30">
              <span className="text-xs text-slate-400 font-mono">Global Model AUROC</span>
              <div className="text-3xl font-bold text-purple-300 font-heading mt-1">{currentAUROC}</div>
              <span className="text-[10px] text-purple-200 font-mono">Sensitivity & Specificity Index</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-400/30">
              <span className="text-xs text-slate-400 font-mono">DP Noise Multiplier</span>
              <div className="text-3xl font-bold text-emerald-300 font-heading mt-1">ε = {dpEpsilon}</div>
              <span className="text-[10px] text-emerald-200 font-mono">σ = {dpSigma} · δ = 1e-5</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-amber-400/30">
              <span className="text-xs text-slate-400 font-mono">Combined Records</span>
              <div className="text-3xl font-bold text-amber-300 font-heading mt-1">{totalSamples.toLocaleString()}</div>
              <span className="text-[10px] text-amber-200 font-mono">Across 4 Federated Nodes</span>
            </div>

            {/* ── FEDERATION IMPACT (hero KPI) ── */}
            {bestImpact ? (
              <FederationImpactCard
                localAccuracy={bestImpact.federationImpact.localAccuracy}
                federatedAccuracy={bestImpact.federationImpact.federatedAccuracy}
                hospitalName={bestImpact.provenance?.hospitalName || 'This facility'}
                compact={true}
              />
            ) : (
              <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-400/20">
                <span className="text-xs text-slate-400 font-mono">Federation Impact</span>
                <div className="text-lg font-bold text-slate-500 font-heading mt-1">Train a model</div>
                <span className="text-[10px] text-slate-600 font-mono">to see Local vs. Federated delta</span>
              </div>
            )}
          </div>

          {/* Equity-Weighted FedAvg info tooltip */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-950/20 border border-purple-400/20 text-xs">
            <BarChart2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-purple-300 font-semibold">Equity-Weighted Aggregation Active: </span>
              <span className="text-slate-400">
                Federo Health uses equity-weighted aggregation (70% volume-weighted + 30% equal-weighted) rather than naive averaging,
                ensuring smaller and rural hospitals meaningfully influence the shared model rather than being outweighed by larger contributors.
              </span>
            </div>
            <button
              onClick={handleRunFederationRound}
              disabled={isFederating}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-semibold transition-colors whitespace-nowrap"
            >
              {isFederating ? <><Activity className="w-3.5 h-3.5 animate-pulse" /> Running…</> : <><Zap className="w-3.5 h-3.5" /> Run FedAvg Round</>}
            </button>
          </div>

          {/* Federation Round Result */}
          {latestFederationRound && (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-400/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold font-heading">
                  ✓ Federation Round {latestFederationRound.round_number} Complete — {latestFederationRound.aggregation_method}
                </span>
                <span className="text-emerald-300 font-mono">Global accuracy: {latestFederationRound.global_accuracy}%</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(latestFederationRound.hospital_weights || []).map(hw => (
                  <div key={hw.hospital_id} className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-[10px] font-mono">
                    <p className="text-slate-300 font-semibold truncate">{hw.hospital_name}</p>
                    <p className="text-purple-400">Equity weight: <span className="text-white">{(hw.equity_weight * 100).toFixed(1)}%</span></p>
                    <p className="text-slate-500">Volume: {hw.data_volume.toLocaleString()} rec</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulator Action Row & Network Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Live FedAvg Convergence & DP Loss Curve
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-lg ${
                      isRunning
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white shadow-cyan-500/20'
                    }`}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    {isRunning ? 'Pause FL Rounds' : 'Auto-Step FL Rounds'}
                  </button>
                  <button
                    onClick={stepOnce}
                    disabled={isRunning}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold"
                  >
                    +1 Round
                  </button>
                  <button
                    onClick={() => buildEngine(useCase)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10"
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip content={<GlassTooltip />} />
                    <Line type="monotone" dataKey="accuracy" stroke="#00f2fe" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
                    <Line type="monotone" dataKey="loss" stroke="#9d4edd" strokeWidth={2} dot={{ r: 3 }} name="Loss" />
                    <Line type="monotone" dataKey="auroc" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} name="AUROC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Topology Canvas */}
            <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-heading">
                Topology & Gradient Egress
              </h3>
              <NetworkTopologyCanvas
                isRunning={isRunning}
                currentRound={currentRound}
                selectedHospital={selectedHospital}
                onSelectHospital={setSelectedHospital}
              />
            </div>
          </div>

          {/* Hospital Contribution Matrix — now with equity weights */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">
                Hospital Node Contribution & Trust Matrix
              </h3>
              <button
                onClick={previewFHIR}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
              >
                <Database className="w-3.5 h-3.5" /> Inspect FHIR R4 LOINC Bundle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partitionStats.map((h) => {
                // Find equity weight from latest federation round
                const hw = latestFederationRound?.hospital_weights?.find(w => w.hospital_id === h.id);
                const equityWeight = hw ? `${(hw.equity_weight * 100).toFixed(1)}%` : null;

                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHospital(h.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2 ${
                      selectedHospital === h.id
                        ? 'bg-slate-950 border-cyan-400/50 shadow-lg shadow-cyan-500/5'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs font-heading">{h.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }}></span>
                    </div>
                    <p className="text-[10px] text-slate-400">{h.type} · {h.location}</p>

                    <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quality Score:</span>
                        <span className="text-emerald-400 font-bold">{h.qualityScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Volume Weight:</span>
                        <span className="text-purple-300">{h.weightShare}</span>
                      </div>
                      {equityWeight && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Equity Weight:</span>
                          <span className="text-cyan-300 font-bold">{equityWeight}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bandwidth:</span>
                        <span className="text-slate-300">{h.bandwidth}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: DATA CLEANING & AUTO-TRAINING ── */}
      {activeTab === 'upload' && (
        <DataUploadPanel
          useCase={useCase}
          onModelTrainedAndRegistered={handleModelTrained}
          onViewModelCard={setSelectedModelCard}
          isLowBandwidth={isLowBandwidth}
          onEnqueue={() => {/* Queue updated via syncQueue util */}}
        />
      )}

      {/* ── TAB 3: HOSPITAL MULTI-MODEL REGISTRY ── */}
      {activeTab === 'registry' && (
        <ModelRegistry
          models={hospitalModels}
          onViewModelCard={setSelectedModelCard}
          onShareModel={setSharingModel}
          onTrainNew={() => setActiveTab('upload')}
        />
      )}

      {/* ── TAB 4: INCOMING SHARED MODELS QUEUE ── */}
      {activeTab === 'incoming' && (
        <IncomingModelsQueue
          incomingQueue={incomingModels}
          onAcceptModel={handleAcceptIncomingModel}
          onRejectModel={handleRejectIncomingModel}
          onViewModelCard={setSelectedModelCard}
        />
      )}

      {/* ── TAB 5: IMMUTABLE AUDIT TRAIL ── */}
      {activeTab === 'audit' && (
        <AuditLogView />
      )}

      {/* ── MODALS ── */}

      {selectedModelCard && (
        <ModelCardModal
          modelCard={selectedModelCard}
          onClose={() => setSelectedModelCard(null)}
          onShare={(m) => {
            setSelectedModelCard(null);
            setSharingModel(m);
          }}
        />
      )}

      {sharingModel && (
        <ModelSharingModal
          model={sharingModel}
          isOpen={true}
          onClose={() => setSharingModel(null)}
          onModelSharedToPeer={handleModelSharedToPeer}
          onContributeToFederation={(m) => {
            setHospitalModels(prev =>
              prev.map(x => (x.modelId === m.modelId ? { ...x, status: 'FEDERATED_CONTRIBUTED' } : x))
            );
          }}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {showFHIRModal && fhirPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-400/30 p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> HL7 FHIR R4 Bundle Observation Payload
              </span>
              <button onClick={() => setShowFHIRModal(false)} className="text-slate-400 hover:text-white font-sans">
                Close
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-cyan-200 overflow-x-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(fhirPreview, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
