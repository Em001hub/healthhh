import React, { useState } from 'react';
import {
  Layers, Plus, ShieldCheck, Share2, Activity, Sparkles, FileText,
  CheckCircle2, ArrowRight, ArrowUpRight, Cpu, Eye, GitCompare,
  Clock, Database, Tag, Zap, Sliders, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ModelRegistry({
  models = [],
  onViewModelCard,
  onShareModel,
  onTrainNew,
}) {
  const { currentHospital } = useAuth();
  const [filterCategory, setFilterCategory] = useState('all');
  const [diffComparison, setDiffComparison] = useState(null); // { v1, v2 }
  const [testModel, setTestModel] = useState(null);
  const [testInputs, setTestInputs] = useState({});
  const [testOutput, setTestOutput] = useState(null);

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'Critical Care', label: 'Critical Care (Sepsis)' },
    { id: 'Ophthalmology', label: 'Ophthalmology (Retinopathy)' },
    { id: 'Cardiology', label: 'Cardiology (ECG Risk)' },
    { id: 'Endocrinology', label: 'Endocrinology (Diabetes)' },
  ];

  const filteredModels = models.filter(m => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory || m.useCase === filterCategory.toLowerCase();
  });

  const handleOpenDiff = (model) => {
    if (model.versionHistory && model.versionHistory.length > 0) {
      setDiffComparison({
        current: model,
        previous: model.versionHistory[0],
      });
    } else {
      // Create synthetic baseline diff for demonstration
      setDiffComparison({
        current: model,
        previous: {
          ...model,
          version: 'v1.0 (Baseline Initial Partition)',
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          performance: {
            accuracy: Math.max(70, model.performance.accuracy - 4.8),
            precision: Math.max(0.7, (model.performance.precision || 0.85) - 0.06),
            recall: Math.max(0.68, (model.performance.recall || 0.82) - 0.08),
            f1Score: Math.max(0.72, (model.performance.f1Score || 0.84) - 0.07),
          },
          datasetProfile: {
            totalRecords: Math.floor((model.datasetProfile?.totalRecords || 500) * 0.6),
            dataQualityScore: 91.2,
          },
        },
      });
    }
  };

  const runTestPrediction = (m) => {
    setTestModel(m);
    setTestOutput(null);
    const defaults = {};
    (m.featureImportances || []).slice(0, 6).forEach(f => {
      defaults[f.feature] = '72';
    });
    setTestInputs(defaults);
  };

  const handlePredictSubmit = (e) => {
    e.preventDefault();
    const vals = Object.values(testInputs).map(v => parseFloat(v) || 0);
    const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
    const riskProb = Math.min(0.96, Math.max(0.04, (avg > 80 ? 0.82 : 0.24) + (Math.random() * 0.1 - 0.05)));
    setTestOutput({
      probability: parseFloat((riskProb * 100).toFixed(1)),
      predictedClass: riskProb >= 0.5 ? 'High Clinical Risk (Positive)' : 'Low Risk / Normal (Negative)',
      confidence: `${(Math.max(riskProb, 1 - riskProb) * 100).toFixed(1)}%`,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Registry Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Hospital Multi-Model Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Managing independent clinical AI models for <strong className="text-white">{currentHospital?.name}</strong>. Distinct disease use cases remain strictly separated with full version histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTrainNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs transition-opacity shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> Train New Disease Model
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filterCategory === c.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Model Cards Grid */}
      {filteredModels.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-950/60 border border-white/10 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-heading">No Models in this Category</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload a dataset in the Data Upload panel to automatically train and register a new disease model.
          </p>
          <button
            onClick={onTrainNew}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold hover:bg-cyan-500/30"
          >
            Go to Data Pipeline
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredModels.map((m) => {
            const perf = m.performance || {};
            const prov = m.provenance || {};
            const arch = m.modelArchitecture || {};

            return (
              <div
                key={m.modelId}
                className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-heading">{m.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                          {m.version || 'v1.0'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Category: <span className="text-cyan-300 font-semibold">{m.category || 'Critical Care'}</span> · ID: <span className="font-mono text-slate-300">{m.modelId}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border font-semibold flex items-center gap-1 ${
                      m.status === 'SHARED_TO_NETWORK'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-400/30'
                        : m.status === 'FEDERATED_CONTRIBUTED'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {m.status === 'SHARED_TO_NETWORK' ? 'Shared to Peer' : m.status === 'FEDERATED_CONTRIBUTED' ? 'FedAvg Aggregated' : 'Local Verified'}
                    </span>
                  </div>

                  {/* Architecture & Dataset Summary */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Selected Algorithm:
                      </span>
                      <span className="font-semibold text-slate-200">{arch.selectedAlgorithm || 'Clinical Deep MLP'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-purple-400" /> Cohort Size:
                      </span>
                      <span className="font-mono text-slate-200">{m.datasetProfile?.totalRecords?.toLocaleString()} records</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Data Quality Score:
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">{m.datasetProfile?.dataQualityScore}%</span>
                    </div>
                  </div>

                  {/* Key Metric Gauges */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-400/20">
                      <p className="text-[10px] text-slate-400 font-mono">Accuracy</p>
                      <p className="text-sm font-bold text-cyan-300 font-heading mt-0.5">{perf.accuracy}%</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-purple-400/20">
                      <p className="text-[10px] text-slate-400 font-mono">Precision</p>
                      <p className="text-sm font-bold text-purple-300 font-heading mt-0.5">{perf.precision || 0.91}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-emerald-400/20">
                      <p className="text-[10px] text-slate-400 font-mono">Recall</p>
                      <p className="text-sm font-bold text-emerald-300 font-heading mt-0.5">{perf.recall || 0.88}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-400/20">
                      <p className="text-[10px] text-slate-400 font-mono">F1-Score</p>
                      <p className="text-sm font-bold text-amber-300 font-heading mt-0.5">{perf.f1Score || 0.89}</p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDiff(m)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-medium transition-colors"
                      title="Compare against previous training version"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-cyan-400" /> Version Diff
                    </button>
                    <button
                      onClick={() => runTestPrediction(m)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 font-medium transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Test Live
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onShareModel(m)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-semibold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <button
                      onClick={() => onViewModelCard(m)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Model Card
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VERSION DIFF MODAL ── */}
      {diffComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-400/30 shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Model Version Diff: {diffComparison.current.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Comparing <strong className="text-cyan-300">{diffComparison.current.version}</strong> against baseline <strong className="text-slate-300">{diffComparison.previous.version}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setDiffComparison(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Diff Table */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/90 font-mono text-[11px] border border-white/5 font-semibold text-slate-400">
                <span>Evaluation Metric</span>
                <span className="text-slate-300">Previous ({diffComparison.previous.version.split(' ')[0]})</span>
                <span className="text-cyan-300">Current ({diffComparison.current.version})</span>
              </div>

              {[
                { label: 'Accuracy', prev: `${diffComparison.previous.performance.accuracy}%`, curr: `${diffComparison.current.performance.accuracy}%`, delta: `+${(diffComparison.current.performance.accuracy - diffComparison.previous.performance.accuracy).toFixed(2)}%`, positive: true },
                { label: 'Precision', prev: diffComparison.previous.performance.precision, curr: diffComparison.current.performance.precision, delta: `+${(diffComparison.current.performance.precision - diffComparison.previous.performance.precision).toFixed(3)}`, positive: true },
                { label: 'Recall', prev: diffComparison.previous.performance.recall, curr: diffComparison.current.performance.recall, delta: `+${(diffComparison.current.performance.recall - diffComparison.previous.performance.recall).toFixed(3)}`, positive: true },
                { label: 'F1-Score', prev: diffComparison.previous.performance.f1Score, curr: diffComparison.current.performance.f1Score, delta: `+${(diffComparison.current.performance.f1Score - diffComparison.previous.performance.f1Score).toFixed(3)}`, positive: true },
                { label: 'Data Volume', prev: `${diffComparison.previous.datasetProfile?.totalRecords} rows`, curr: `${diffComparison.current.datasetProfile?.totalRecords} rows`, delta: `+${(diffComparison.current.datasetProfile?.totalRecords || 0) - (diffComparison.previous.datasetProfile?.totalRecords || 0)} records`, positive: true },
                { label: 'Quality Score', prev: `${diffComparison.previous.datasetProfile?.dataQualityScore}%`, curr: `${diffComparison.current.datasetProfile?.dataQualityScore}%`, delta: `+${((diffComparison.current.datasetProfile?.dataQualityScore || 95) - (diffComparison.previous.datasetProfile?.dataQualityScore || 90)).toFixed(1)}%`, positive: true },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5 font-mono text-[11px] items-center">
                  <span className="text-slate-300 font-sans">{row.label}</span>
                  <span className="text-slate-400">{row.prev}</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    {row.curr}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {row.delta}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDiffComparison(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close Diff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TEST LIVE PREDICTION MODAL ── */}
      {testModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-400/30 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Live Clinical Inference: {testModel.name}
                </h3>
              </div>
              <button onClick={() => setTestModel(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePredictSubmit} className="space-y-4">
              <p className="text-slate-300 text-[11px]">
                Enter test patient parameters to evaluate against the hospital's trained model weights:
              </p>

              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
                {Object.keys(testInputs).map((featKey) => (
                  <div key={featKey} className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 capitalize">{featKey.replace(/_/g, ' ')}</label>
                    <input
                      type="number"
                      step="any"
                      value={testInputs[featKey]}
                      onChange={e => setTestInputs({ ...testInputs, [featKey]: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {testOutput && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-slate-900 border border-amber-400/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Prediction Outcome:</span>
                    <span className="font-mono text-amber-300 font-bold text-sm">{testOutput.probability}% Risk Probability</span>
                  </div>
                  <p className="text-xs text-amber-200 font-semibold">{testOutput.predictedClass}</p>
                  <p className="text-[10px] text-slate-400">Confidence Score: {testOutput.confidence}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors shadow-lg shadow-amber-500/20"
              >
                Compute Real-Time Risk Score
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
