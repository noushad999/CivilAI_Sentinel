import React from 'react';

interface ScanningOverlayProps {
  active: boolean;
}

const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-lg">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      
      {/* Scanning Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan"></div>
      
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>
      
      {/* Processing Text */}
      <div className="absolute bottom-6 right-6 font-mono text-cyan-400 text-xs tracking-widest animate-pulse">
        SCANNING_STRUCTURAL_INTEGRITY...
      </div>
    </div>
  );
};

export default ScanningOverlay;
