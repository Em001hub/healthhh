import React from 'react';
import {
  X, Bell, CheckCircle2, AlertTriangle, Info, ShieldCheck,
  Share2, ArrowRight, Trash2, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationsModal({ isOpen, onClose, onNavigate }) {
  const { notifications } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Platform Notifications ({notifications.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 max-h-[80vh] overflow-y-auto space-y-3 text-xs">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isSuccess = n.type === 'success';
              const isWarning = n.type === 'warning';

              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all space-y-1.5 ${
                    isSuccess
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isWarning
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-950 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold font-heading text-white">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-300 pl-6">
                    {n.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Real-Time Audit & Event Dispatcher</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
