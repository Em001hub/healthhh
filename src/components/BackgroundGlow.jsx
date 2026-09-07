import React from 'react';

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top Left Neon Cyan Ambient Blob */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-25 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #00f2fe 0%, #4facfe 100%)' }}
      />
      {/* Top Right Deep Purple Ambient Blob */}
      <div 
        className="absolute -top-20 -right-20 w-[30rem] h-[30rem] rounded-full blur-[160px] opacity-30 animate-pulse-slow"
        style={{ background: 'radial-gradient(circle, #9d4edd 0%, #7b2cbf 100%)', animationDelay: '2s' }}
      />
      {/* Bottom Center Subtle Teal Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[180px] opacity-15"
        style={{ background: 'radial-gradient(circle, #00f2fe 0%, #10b981 100%)' }}
      />
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
    </div>
  );
}
