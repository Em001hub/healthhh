import React, { useState } from 'react';
import {
  Terminal, ShieldCheck, CheckCircle2, AlertTriangle, Search, Filter,
  RefreshCw, Lock, Hash, Clock, Building2, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuditLogView() {
  const { auditLog, verifyChain, currentHospital, isSuperAdminMode } = useAuth();
  
  const [filterHospital, setFilterHospital] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(async () => {
      const res = await verifyChain();
      setVerificationResult(res);
      setIsVerifying(false);
    }, 600);
  };

  const filteredLogs = auditLog.filter(entry => {
    if (filterHospital !== 'all' && entry.hospitalId !== filterHospital && entry.hospitalId !== 'NETWORK') return false;
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAction = entry.action.toLowerCase().includes(q);
      const matchUser = (entry.userName || '').toLowerCase().includes(q);
      const matchDetails = JSON.stringify(entry.details || {}).toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Chain Verifier */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Immutable Hash-Chained Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every platform event is cryptographically linked to the preceding block via SHA-256 hashing. Tampering with any historical record invalidates downstream chain signatures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-black font-bold text-xs transition-opacity shadow-lg shadow-emerald-500/20"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                Verifying {auditLog.length} Blocks...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify Full Chain Integrity
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Result Alert Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs font-mono ${
          verificationResult.valid
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {verificationResult.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="font-bold font-sans text-white text-sm">
                {verificationResult.valid
                  ? 'Cryptographic Chain Integrity Verified (100% Authentic)'
                  : 'Chain Tampering Detected!'}
              </p>
              <p className="mt-0.5 text-xs text-slate-300 font-sans">
                {verificationResult.valid
                  ? `All ${verificationResult.checkedCount} historical blocks recalculated from Genesis Hash. Zero hash link collisions or mutated payload signatures.`
                  : verificationResult.reason}
              </p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-slate-900 text-slate-400 border border-white/5">
            Genesis → Head
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/5 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by action, user, or metadata..."
            className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterHospital}
            onChange={e => setFilterHospital(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Hospitals</option>
            <option value="h1">City Medical Center A (h1)</option>
            <option value="h2">Valley District Clinic (h2)</option>
            <option value="h3">Metro Academic Health B (h3)</option>
            <option value="h4">St. Jude Community Hosp (h4)</option>
            <option value="NETWORK">Network Genesis / Core</option>
          </select>

          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All Action Types</option>
            <option value="HOSPITAL_REGISTRATION_APPROVED">Registration Approved</option>
            <option value="USER_LOGIN_CHALLENGE_VERIFIED">Login Challenge Verified</option>
            <option value="DATASET_CLEANED_AND_INGESTED">Dataset Cleaned & Ingested</option>
            <option value="LOCAL_MODEL_TRAINED_AND_SIGNED">Model Trained & Signed</option>
            <option value="PEER_MODEL_TRANSFER_EXPORTED">Peer Model Exported</option>
            <option value="PEER_MODEL_SIGNATURE_VERIFIED">Signature Verified</option>
            <option value="PEER_MODEL_TRANSFER_ACCEPTED">Model Accepted</option>
            <option value="SESSION_REVOKED">Session Revoked</option>
          </select>
        </div>
      </div>

      {/* Hash Chained Table */}
      <div className="rounded-3xl bg-slate-950/90 border border-white/10 overflow-hidden shadow-xl text-xs font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-slate-400 text-[11px]">
                <th className="py-3 px-4">Index & Timestamp</th>
                <th className="py-3 px-4">Entity & Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Chained SHA-256 Hash Link</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.slice().reverse().map((entry, idx) => {
                const isExpanded = expandedRow === entry.id;
                const realIndex = filteredLogs.length - 1 - idx;

                return (
                  <React.Fragment key={entry.id || idx}>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[10px] font-bold border border-cyan-400/20">
                            #{realIndex}
                          </span>
                          <span className="text-slate-300 text-[11px]">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-sans font-semibold text-white text-[11px] flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {entry.hospitalId}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {entry.userName} ({entry.userId})
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          entry.action.includes('APPROVED') || entry.action.includes('VERIFIED') || entry.action.includes('ACCEPTED')
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : entry.action.includes('EXPORTED') || entry.action.includes('TRAINED')
                            ? 'bg-purple-500/10 text-purple-300 border-purple-400/30'
                            : entry.action.includes('REVOKED') || entry.action.includes('REJECTED')
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
                        }`}>
                          {entry.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[10px]">
                        <div className="text-cyan-300 font-bold flex items-center gap-1">
                          <Hash className="w-3 h-3 text-cyan-400" />
                          {entry.hash.slice(0, 16)}...
                        </div>
                        <span className="text-slate-500 text-[9px] block mt-0.5">
                          prev: {entry.prevHash.slice(0, 12)}...
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable JSON details */}
                    {isExpanded && (
                      <tr className="bg-slate-900/60">
                        <td colSpan={5} className="p-4 px-6 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/5 pb-1">
                            <span>Canonical Event Metadata & Cryptographic Payload:</span>
                            <span>Full Hash: <strong className="text-cyan-300 font-mono">{entry.hash}</strong></span>
                          </div>
                          <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-cyan-200 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
