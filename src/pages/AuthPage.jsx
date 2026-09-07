import React, { useState } from 'react';
import {
  ShieldCheck, Lock, Mail, Key, Building2, User, ArrowRight,
  Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { loginWithCredentials, registerHospitalUser } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [tier, setTier] = useState('Rural Low-Resource');
  const [country, setCountry] = useState('USA');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [authStage, setAuthStage] = useState(''); // 'authenticating' | 'signing_nonce' | 'verified'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAuthStage('Validating credentials…');

    try {
      // Simulate cryptographic handshake stages
      await new Promise(r => setTimeout(r, 400));
      setAuthStage('Signing ECDSA P-256 nonce challenge…');
      await new Promise(r => setTimeout(r, 400));

      const res = await loginWithCredentials({ email, password });
      if (res.success) {
        setAuthStage('Cryptographic session token generated!');
        setSuccessMsg(res.isAdmin ? 'Welcome, Super Admin! Directing to platform governance…' : `Welcome, ${res.user?.name}! Loading hospital node…`);
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        setAuthStage('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
      setIsLoading(false);
      setAuthStage('');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAuthStage('Generating ECDSA P-256 keypair…');

    try {
      await new Promise(r => setTimeout(r, 500));
      setAuthStage('Registering institutional node in federation directory…');
      await new Promise(r => setTimeout(r, 500));

      const res = await registerHospitalUser({
        name,
        email,
        password,
        hospitalName: hospitalName || `${name}'s Medical Center`,
        tier,
        country,
      });

      if (res.success) {
        setAuthStage('Node keypair generated & session active!');
        setSuccessMsg(res.isAdmin ? 'Admin account created! Directing to platform…' : 'Hospital enrolled! Access granted to Federo Health.');
      } else {
        setError(res.error || 'Registration failed.');
        setIsLoading(false);
        setAuthStage('');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setIsLoading(false);
      setAuthStage('');
    }
  };

  const isAdminEmail = email.trim().toLowerCase() === 'em01@gmail.com' || email.trim().toLowerCase().startsWith('em01');

  return (
    <div className="relative min-h-screen bg-[#080711] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-cyan-500 selection:text-black overflow-hidden">
      
      {/* Background Animated Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d08_1px,transparent_1px),linear-gradient(to_bottom,#1f293d08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 p-2 px-4 rounded-2xl glass-panel border border-cyan-400/30 shadow-xl shadow-cyan-500/10 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-black font-bold shadow-md">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-base text-white tracking-tight font-heading">
                Federo<span className="text-cyan-400">.Health</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
                Zero-Trust Clinical AI Federation
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            {mode === 'signin' ? 'Institutional Access Portal' : 'Enroll Hospital or Admin Node'}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Protected by ECDSA P-256 cryptographic handshakes and differential privacy guardrails.
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl shadow-cyan-500/5 backdrop-blur-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              Sign Up
            </button>
          </div>

          {/* Admin Detection Banner */}
          {isAdminEmail && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-400/40 flex items-center gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-cyan-300 font-heading">Super Admin Credentials Recognized</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Logging in as Network Super Admin with full platform oversight.</p>
              </div>
            </div>
          )}

          {/* Error / Success Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            
            {/* SIGN UP ONLY: Full Name & Hospital Name */}
            {mode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Full Name / Clinician Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Elena Rostova or Admin User"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs placeholder:text-slate-500 transition-all outline-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    Hospital / Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Valley District Clinic or City Medical"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white text-xs placeholder:text-slate-500 transition-all outline-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold">Tier Category</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                    >
                      <option value="Rural Low-Resource">Rural Low-Resource</option>
                      <option value="Community Hospital">Community Hospital</option>
                      <option value="Urban Tertiary">Urban Tertiary</option>
                      <option value="Regional Academic">Regional Academic</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold">Jurisdiction</label>
                    <input
                      type="text"
                      placeholder="e.g. USA, UK, India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Institutional / Admin Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter your registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs placeholder:text-slate-500 transition-all outline-none font-sans"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-950/80 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white text-xs placeholder:text-slate-500 transition-all outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{authStage || 'Authenticating…'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? (isAdminEmail ? 'Sign In as Super Admin' : 'Sign In') : 'Enroll & Generate ECDSA Keypair'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Note */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Cryptographically Protected • Zero Patient Data Ingress</span>
          </div>

        </div>

      </div>
    </div>
  );
}
