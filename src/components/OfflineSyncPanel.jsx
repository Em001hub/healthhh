import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, CheckCircle2, AlertTriangle, Upload, Info } from 'lucide-react';
import { SyncStatus, getQueue, clearSynced, clearAll, flushQueue } from '../utils/syncQueue';

const STATUS_STYLES = {
  [SyncStatus.QUEUED]:  'bg-amber-500/10 text-amber-300 border-amber-400/30',
  [SyncStatus.SYNCING]: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
  [SyncStatus.SYNCED]:  'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  [SyncStatus.FAILED]:  'bg-rose-500/10 text-rose-300 border-rose-400/30',
};

const STATUS_ICONS = {
  [SyncStatus.QUEUED]:  Clock,
  [SyncStatus.SYNCING]: RefreshCw,
  [SyncStatus.SYNCED]:  CheckCircle2,
  [SyncStatus.FAILED]:  AlertTriangle,
};

/**
 * OfflineSyncPanel
 * ================
 * Demonstrates low-bandwidth resilience by simulating an offline queue.
 * When "Simulate Low Bandwidth Mode" is ON, upload/train requests are
 * queued instead of fired immediately.
 *
 * Props:
 *   isLowBandwidth     {boolean}   — current low-bandwidth mode state
 *   onToggle           {Function}  — toggle callback
 *   onFlushItem        {Function}  — async (item) => any — processes one queued item
 */
export default function OfflineSyncPanel({ isLowBandwidth, onToggle, onFlushItem }) {
  const [queue, setQueue] = useState(getQueue());
  const [isFlushing, setIsFlushing] = useState(false);

  // Refresh queue display whenever it might change
  useEffect(() => {
    const id = setInterval(() => setQueue(getQueue()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleFlush = async () => {
    if (isFlushing || !onFlushItem) return;
    setIsFlushing(true);
    try {
      await flushQueue(onFlushItem, (updated) => setQueue([...updated]));
    } finally {
      setIsFlushing(false);
      setQueue(getQueue());
    }
  };

  const pending = queue.filter(i => i.status === SyncStatus.QUEUED).length;
  const syncing = queue.filter(i => i.status === SyncStatus.SYNCING).length;
  const synced  = queue.filter(i => i.status === SyncStatus.SYNCED).length;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      isLowBandwidth
        ? 'bg-amber-950/20 border-amber-400/30'
        : 'bg-slate-950/60 border-white/10'
    }`}>
      {/* Header Row */}
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-2">
          {isLowBandwidth
            ? <WifiOff className="w-4 h-4 text-amber-400" />
            : <Wifi className="w-4 h-4 text-slate-400" />
          }
          <div>
            <p className={`text-xs font-bold font-heading ${isLowBandwidth ? 'text-amber-300' : 'text-slate-300'}`}>
              Simulate Low Bandwidth Mode
            </p>
            <p className="text-[10px] text-slate-500">
              {isLowBandwidth
                ? `${pending} upload${pending !== 1 ? 's' : ''} queued — awaiting reconnect`
                : 'Uploads fire immediately (normal mode)'
              }
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`relative w-11 h-6 rounded-full transition-colors border ${
            isLowBandwidth
              ? 'bg-amber-500/30 border-amber-400/50'
              : 'bg-slate-800 border-white/10'
          }`}
          title={isLowBandwidth ? 'Disable Low Bandwidth Simulation' : 'Enable Low Bandwidth Simulation'}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
            isLowBandwidth ? 'translate-x-5 bg-amber-400' : 'translate-x-0 bg-slate-500'
          }`} />
        </button>
      </div>

      {/* Queue contents — only when low-bandwidth is active or has items */}
      {(isLowBandwidth || queue.length > 0) && (
        <div className="border-t border-white/5 p-4 space-y-3">
          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/60 border border-white/5">
            <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              This demo simulates offline resilience for low-connectivity facilities —
              production deployment would use a Service Worker and Background Sync API.
            </p>
          </div>

          {/* Queue Items */}
          {queue.length === 0 ? (
            <p className="text-[10px] text-slate-500 text-center py-2">
              No items queued yet. Upload a dataset while in Low Bandwidth Mode.
            </p>
          ) : (
            <div className="space-y-2">
              {queue.map(item => {
                const Icon = STATUS_ICONS[item.status] || Clock;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${STATUS_STYLES[item.status]}`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.status === SyncStatus.SYNCING ? 'animate-spin' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.label || item.type}</p>
                      <p className="text-[10px] opacity-70 truncate">{item.enqueuedAt ? new Date(item.enqueuedAt).toLocaleTimeString() : ''}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono border ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {pending > 0 && (
              <button
                onClick={handleFlush}
                disabled={isFlushing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 text-white font-bold text-xs transition-opacity shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
                Simulate Reconnect ({pending} item{pending !== 1 ? 's' : ''})
              </button>
            )}
            {synced > 0 && (
              <button
                onClick={() => { clearSynced(); setQueue(getQueue()); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-white/10 transition-colors"
              >
                Clear Synced
              </button>
            )}
            {queue.length > 0 && pending === 0 && synced === 0 && (
              <button
                onClick={() => { clearAll(); setQueue([]); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-white/10 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
