import React, { useState } from 'react';
import {
  X, ShieldCheck, Lock, Building2, UserCheck, Key, RefreshCw,
  CheckCircle2, AlertCircle, Eye, LogIn, UserPlus, ShieldAlert,
  Server, Globe, ChevronRight, Terminal, Laptop, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const {
    hospitals,
    currentHospital,
    currentUser,
    loginWithSignatureChallenge,
    submitRegistration,
    pendingRegistrations,
    approveRegistration,
    rejectRegistration,
    activeSessions,
    revokeSession,
    switchSuperAdminMode,
    isSuperAdminMode,
  } = useAuth();

  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'admin_queue' | 'sessions'
  
  // Login Form State
  const [selectedHospitalId, setSelectedHospitalId] = useState(currentHospital?.id || 'h2');
  const [selectedRole, setSelectedRole] = useState('hospital_admin');
  const [userName, setUserName] = useState('Dr. Elena Rostova');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [challengeResult, setChallengeResult] = useState(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    hospitalName: '',
    licenseNumber: '',
    tier: 'Rural Low-Resource',
    country: 'USA',
    region: '',
    adminName: '',
    adminEmail: '',
    password: '',
  });
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [isApproving, setIsApproving] = useState({});

  if (!isOpen) return null;

  // Handle Login Challenge
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setChallengeResult(null);

    try {
      const res = await loginWithSignatureChallenge({
        hospitalId: selectedHospitalId,
        role: selectedRole,
        userName: userName || 'Authorized Official',
      });

      if (res.success) {
        setChallengeResult(res.session);
        setTimeout(() => {
          setIsLoggingIn(false);
          onClose();
        }, 1200);
      } else {
        alert(res.error || 'Login failed');
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggingIn(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.hospitalName || !regForm.licenseNumber || !regForm.adminEmail) {
      alert('Please fill all required fields');
      return;
    }
    await submitRegistration(regForm);
    setRegSubmitted(true);
  };

  // Handle Approve
  const handleApprove = async (regId) => {
    setIsApproving(prev => ({ ...prev, [regId]: true }));
    await approveRegistration(regId);
    setIsApproving(prev => ({ ...prev, [regId]: false }));
  };

  const selectedHospData = hospitals.find(h => h.id === selectedHospitalId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-400/30 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Institutional Identity & Strong Authentication
              </h2>
              <p className="text-xs text-slate-400">
                Web Crypto ECDSA P-256 Signature Challenge & National Registry Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 px-6 pt-3 border-b border-white/5 bg-slate-950/40 text-xs">
          {[
            { id: 'login', label: 'Strong Cryptographic Login', icon: LogIn },
            { id: 'register', label: 'Institutional Registration', icon: UserPlus },
            { id: 'admin_queue', label: `Admin Review Queue (${pendingRegistrations.length})`, icon: ShieldCheck, badge: pendingRegistrations.length > 0 },
            { id: 'sessions', label: `Active Sessions (${activeSessions.length})`, icon: Laptop },
          ].map(t => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-slate-800/80 border-t-2 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                {t.badge && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* ── TAB 1: STRONG LOGIN ── */}
          {tab === 'login' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold font-heading">
                  <Key className="w-4 h-4" /> Strong Auth: Password + Private Key Signature Challenge
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Unlike consumer OAuth, institutional authentication generates a server nonce challenge that must be signed with the hospital node's local ECDSA private key.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Hospital */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300">Target Hospital Account</label>
                    <select
                      value={selectedHospitalId}
                      onChange={e => {
                        setSelectedHospitalId(e.target.value);
                        const h = hospitals.find(x => x.id === e.target.value);
                        if (h) setUserName(h.adminEmail.split('@')[0]);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none"
                    >
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.tier})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Role */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300">Authorized Role (RBAC)</label>
                    <select
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 font-medium focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="hospital_admin">Hospital Admin (Full Governance & Users)</option>
                      <option value="clinician_uploader">Data Uploader / Clinician (Uploads & Training)</option>
                      <option value="viewer">Viewer (Read-Only Analytics)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300">Staff Member Name / ID</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g. Dr. Elena Rostova"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300">Password / Token</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Keypair Fingerprint Preview */}
                {selectedHospData && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">Registered Public Key:</span>
                    <span className="text-purple-300">{selectedHospData.pubKeyFingerprint}</span>
                  </div>
                )}

                {/* Challenge Handshake Preview */}
                {challengeResult && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Challenge Nonce Signed & Verified!</span>
                    </div>
                    <p className="text-[10px] text-emerald-200">
                      Signature: {challengeResult.signatureSnippet}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Signing Server Nonce Challenge with ECDSA Key...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      Sign Nonce & Authenticate Identity
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 2: INSTITUTIONAL REGISTRATION ── */}
          {tab === 'register' && (
            <div className="space-y-6">
              {regSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Application Submitted to Super Admin Review Queue
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Your institutional registration for <strong className="text-white">{regForm.hospitalName}</strong> has been logged in the immutable audit trail.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-cyan-300 max-w-md mx-auto">
                    Notice: Switch to the <strong>Admin Review Queue</strong> tab to simulate super admin registry approval and ECDSA keypair issuance.
                  </div>
                  <button
                    onClick={() => { setRegSubmitted(false); setTab('admin_queue'); }}
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors"
                  >
                    Open Review Queue
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                    <p className="text-xs font-bold text-white font-heading">Institutional Verification Process</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <em>In production, this step would verify against national hospital registries (e.g., NABH, CMS, WHO facility codes).</em>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Hospital Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={regForm.hospitalName}
                        onChange={e => setRegForm({ ...regForm, hospitalName: e.target.value })}
                        placeholder="e.g. Oakridge Regional Medical Center"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Registry / License Number *</label>
                      <input
                        type="text"
                        required
                        value={regForm.licenseNumber}
                        onChange={e => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                        placeholder="e.g. CMS-FAC-99401 / NABH-2026"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Hospital Tier</label>
                      <select
                        value={regForm.tier}
                        onChange={e => setRegForm({ ...regForm, tier: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Urban Tertiary">Urban / Tertiary Hospital</option>
                        <option value="District / Secondary">District / Secondary Hospital</option>
                        <option value="Rural Low-Resource">Rural / Community Clinic</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Country</label>
                      <input
                        type="text"
                        value={regForm.country}
                        onChange={e => setRegForm({ ...regForm, country: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Region / State</label>
                      <input
                        type="text"
                        value={regForm.region}
                        onChange={e => setRegForm({ ...regForm, region: e.target.value })}
                        placeholder="e.g. Oregon / Eugene"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Institutional Admin Contact Name</label>
                      <input
                        type="text"
                        value={regForm.adminName}
                        onChange={e => setRegForm({ ...regForm, adminName: e.target.value })}
                        placeholder="e.g. Dr. Marcus Vance"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-300">Official Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={regForm.adminEmail}
                        onChange={e => setRegForm({ ...regForm, adminEmail: e.target.value })}
                        placeholder="e.g. m.vance@oakridge-med.org"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <UserPlus className="w-4 h-4" /> Submit Institutional Registration
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── TAB 3: ADMIN REVIEW QUEUE ── */}
          {tab === 'admin_queue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-500/10 border border-purple-400/20">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2 font-heading">
                    <ShieldAlert className="w-4 h-4 text-purple-400" /> Super Admin Verification Queue
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Review and approve institutional registration applications. Approving generates an ECDSA keypair and registers the public key.
                  </p>
                </div>
                <button
                  onClick={() => switchSuperAdminMode(!isSuperAdminMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                    isSuperAdminMode
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-400/30 hover:bg-purple-500/30'
                  }`}
                >
                  {isSuperAdminMode ? 'Super Admin Mode: Active' : 'Enable Super Admin Mode'}
                </button>
              </div>

              {pendingRegistrations.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-white/5 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-white font-medium">Review queue is clear</p>
                  <p className="text-[11px]">All submitted hospital applications have been verified and issued cryptographic keys.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRegistrations.map((reg) => (
                    <div key={reg.id} className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm font-heading">{reg.hospitalName}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              PENDING VERIFICATION
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            License: <span className="font-mono text-cyan-300">{reg.licenseNumber}</span> · Tier: {reg.tier} · {reg.country} ({reg.region})
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(reg.submittedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-[11px] text-slate-300 flex items-center justify-between">
                        <span>Admin Contact: <strong>{reg.adminName}</strong> ({reg.adminEmail})</span>
                        <span className="text-slate-400 italic">Registry Code: Pending CMS validation</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => rejectRegistration(reg.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(reg.id)}
                          disabled={isApproving[reg.id]}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                        >
                          {isApproving[reg.id] ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Generating ECDSA Keys...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve & Issue Keypair
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: ACTIVE SESSIONS ── */}
          {tab === 'sessions' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1.5">
                <h3 className="font-bold text-white flex items-center gap-2 font-heading">
                  <Laptop className="w-4 h-4 text-cyan-400" /> Active Institutional Sessions ({currentHospital.name})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Hospital administrators can monitor all active cryptographic sessions and immediately revoke compromised access tokens.
                </p>
              </div>

              <div className="space-y-3">
                {activeSessions.map((sess) => (
                  <div key={sess.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs font-sans">{sess.userName}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-400/20">
                          {sess.role}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        IP: {sess.ip} · Device: {sess.device}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Token: {sess.tokenPreview} · Logged in: {new Date(sess.loginTime).toLocaleTimeString()}
                      </p>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        onClick={() => revokeSession(sess.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-sans transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-slate-950/90 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Active Hospital: <strong className="text-white">{currentHospital?.name}</strong> ({currentUser?.role})
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-white/10"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
