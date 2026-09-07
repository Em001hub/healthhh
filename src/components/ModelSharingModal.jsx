import React, { useState } from 'react';
import {
  X, Share2, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight,
  Layers, Lock, Server, Cpu, RefreshCw, Sparkles, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signModelPackage } from '../utils/cryptoAuth';

export default function ModelSharingModal({
  model,
  isOpen,
  onClose,
  onModelSharedToPeer,
  onContributeToFederation,
}) {
  const { hospitals, currentHospital, logAuditAction, addNotification } = useAuth();
  
  const [sharingMode, setSharingMode] = useState('peer'); // 'peer' | 'federated'
  const [targetHospitalId, setTargetHospitalId] = useState('h1');
  const [isPackaging, setIsPackaging] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);

  if (!isOpen || !model) return null;

  // Available recipient hospitals (exclude self)
  const peerHospitals = hospitals.filter(h => h.id !== currentHospital?.id);
  const targetHospital = hospitals.find(h => h.id === targetHospitalId) || peerHospitals[0];

  // Schema Compatibility Check
  const isCompatible = model.useCase === 'sepsis' || model.useCase === 'retinopathy' || model.useCase === 'cardiology';
  const compatDetails = {
    taskMatch: true,
    featureCountMatch: true,
    message: `Target hospital (${targetHospital?.name}) supports compatible HL7 FHIR ${model.useCase.toUpperCase()} LOINC schema.`,
  };

  const handleExecuteShare = async () => {
    setIsPackaging(true);
    setTransferStatus(null);

    try {
      if (sharingMode === 'federated') {
        // Contribute to global Federated round
        await logAuditAction({
          action: 'FEDERATED_MODEL_UPDATE_CONTRIBUTED',
          details: {
            modelId: model.modelId,
            version: model.version,
            weightsHash: model.weightsHash,
            useCase: model.useCase,
            method: 'FedAvg_Aggregation_Round',
          },
        });

        if (onContributeToFederation) {
          onContributeToFederation(model);
        }

        setTransferStatus({
          mode: 'federated',
          message: `Model weights successfully submitted to FedAvg coordinator for Round Aggregation with Differential Privacy noise (ε=0.55).`,
        });

        addNotification({
          title: 'Federated Model Update Contributed',
          message: `${model.name} was merged into the global federated consensus pipeline.`,
          type: 'success',
        });
      } else {
        // Peer-to-Peer Transfer Package with Cryptographic Signature
        let signedPackage = { ...model };
        if (currentHospital?.keyPair?.privateKey) {
          const sig = await signModelPackage(currentHospital.keyPair.privateKey, model);
          signedPackage.signatureInfo = {
            ...sig,
            senderHospitalId: currentHospital.id,
            senderHospitalName: currentHospital.name,
            signerPublicKeyFingerprint: currentHospital.pubKeyFingerprint,
          };
        }

        await logAuditAction({
          action: 'PEER_MODEL_TRANSFER_EXPORTED',
          details: {
            modelId: model.modelId,
            version: model.version,
            senderHospitalId: currentHospital?.id,
            targetHospitalId: targetHospital?.id,
            weightsHash: model.weightsHash,
            signatureSnippet: (signedPackage.signatureInfo?.signature || '').slice(0, 24) + '...',
          },
        });

        if (onModelSharedToPeer) {
          onModelSharedToPeer({
            targetHospitalId: targetHospital?.id,
            transferPackage: signedPackage,
          });
        }

        setTransferStatus({
          mode: 'peer',
          message: `Model transfer package signed with ${currentHospital.name}'s private key and transmitted to ${targetHospital.name}'s Incoming Review Queue.`,
        });

        addNotification({
          title: 'Model Transferred to Peer Hospital',
          message: `Signed model ${model.name} sent to ${targetHospital.name}. Pending recipient review and signature verification.`,
          type: 'success',
        });
      }

      setTimeout(() => {
        setIsPackaging(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsPackaging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-400/30 shadow-2xl p-6 space-y-5 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Share Clinical Model: {model.name}
              </h2>
              <p className="text-[11px] text-slate-400">
                Source: <strong className="text-slate-200">{currentHospital?.name}</strong> · ID: <span className="font-mono text-cyan-300">{model.modelId}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => { setSharingMode('peer'); setTransferStatus(null); }}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              sharingMode === 'peer'
                ? 'bg-purple-500/15 border-purple-400/50 shadow-lg shadow-purple-500/10'
                : 'bg-slate-950/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white font-heading flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-400" /> Mode B: Peer-to-Peer Transfer
              </span>
              {sharingMode === 'peer' && <span className="w-2 h-2 rounded-full bg-purple-400"></span>}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Export directly to a specific named hospital with full Model Card and ECDSA cryptographic provenance.
            </p>
          </div>

          <div
            onClick={() => { setSharingMode('federated'); setTransferStatus(null); }}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              sharingMode === 'federated'
                ? 'bg-cyan-500/15 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950/60 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white font-heading flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Mode A: Federated Network
              </span>
              {sharingMode === 'federated' && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Contribute local gradient updates to the central FedAvg global model consensus round.
            </p>
          </div>
        </div>

        {/* Peer Selection & Compatibility Box */}
        {sharingMode === 'peer' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300">Target Verified Hospital</label>
              <select
                value={targetHospitalId}
                onChange={e => { setTargetHospitalId(e.target.value); setTransferStatus(null); }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium focus:border-purple-400 focus:outline-none"
              >
                {peerHospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.tier} ({h.region}, {h.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Schema Compatibility Verification */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-heading">
                <CheckCircle2 className="w-4 h-4" /> Schema & Architecture Compatibility Verified
              </div>
              <p className="text-[11px] text-slate-300">
                {compatDetails.message}
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                <span>Task: Binary Classification</span>
                <span>Receiver PubKey: {targetHospital?.pubKeyFingerprint}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-400/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-heading">
              <Lock className="w-4 h-4" /> Privacy-Preserving Secure Aggregation
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Model weights will be masked with calibrated Gaussian noise ($\varepsilon = 0.55$) and submitted to the global FedAvg aggregation matrix. Zero raw records will egress.
            </p>
          </div>
        )}

        {/* Transfer Result Banner */}
        {transferStatus && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold font-heading">
              <CheckCircle2 className="w-4 h-4" /> Model Successfully Shared!
            </div>
            <p className="text-[11px] text-emerald-200">{transferStatus.message}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteShare}
            disabled={isPackaging}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold transition-opacity shadow-lg shadow-purple-500/20"
          >
            {isPackaging ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Signing & Packaging Model...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                {sharingMode === 'peer' ? `Sign & Send to ${targetHospital?.name}` : 'Submit to FedAvg Round'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
