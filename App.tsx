import React, { useState, useRef } from 'react';
import { analyzeStructure } from './services/geminiService';
import { StructuralAnalysis, AnalysisState } from './types';
import RiskGauge from './components/RiskGauge';
import ThinkingLog from './components/ThinkingLog';
import ScanningOverlay from './components/ScanningOverlay';
import { ShieldAlert, ShieldCheck, Upload, AlertTriangle, Cpu, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis({ isAnalyzing: false, result: null, error: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;

    setAnalysis({ isAnalyzing: true, result: null, error: null });

    try {
      const result = await analyzeStructure(image);
      setAnalysis({
        isAnalyzing: false,
        result,
        error: null,
      });
    } catch (err: any) {
      setAnalysis({
        isAnalyzing: false,
        result: null,
        error: err.message || "Failed to analyze structure. Try again.",
      });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-950 border border-cyan-800 rounded flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.3)]">
              <ShieldAlert className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                CIVIL<span className="text-cyan-400">AI</span>_SENTINEL
              </h1>
              <div className="text-[10px] text-slate-500 tracking-[0.2em] uppercase">Structural Forensic Unit // Gemini-3-Pro</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM_ONLINE
             </div>
             <div>V.3.0.1-PREVIEW</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Input & Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative group">
            {/* Holographic Card Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl min-h-[400px] flex flex-col">
              
              {/* Toolbar */}
              <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Source_Feed</span>
                {image && (
                   <button onClick={() => setImage(null)} className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors">
                     Clear_Buffer
                   </button>
                )}
              </div>

              {/* Image Area */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-4">
                {image ? (
                  <div className="relative w-full h-full max-h-[500px] rounded-lg overflow-hidden border border-slate-800">
                    <img 
                      src={image} 
                      alt="Structural Element" 
                      className="w-full h-full object-contain"
                    />
                    <ScanningOverlay active={analysis.isAnalyzing} />
                  </div>
                ) : (
                  <div 
                    onClick={triggerUpload}
                    className="w-full h-64 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group/upload"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 group-hover/upload:scale-110 transition-transform">
                      <Upload className="text-slate-500 group-hover/upload:text-cyan-400 transition-colors" size={28} />
                    </div>
                    <p className="text-slate-400 font-mono text-sm">UPLOAD_STRUCTURAL_IMAGE</p>
                    <p className="text-slate-600 text-xs mt-2">Suppports: JPG, PNG, WEBP</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                <button
                  onClick={handleScan}
                  disabled={!image || analysis.isAnalyzing}
                  className={`w-full py-4 px-6 rounded-lg font-mono font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    !image 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : analysis.isAnalyzing
                        ? 'bg-slate-800 text-cyan-400 cursor-wait border border-cyan-900/50'
                        : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 hover:border-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.2)]'
                  }`}
                >
                  {analysis.isAnalyzing ? (
                    <>
                      <Cpu className="animate-spin" size={18} />
                      PROCESSING_NEURAL_NET...
                    </>
                  ) : (
                    <>
                      <Activity size={18} />
                      INITIATE_FORENSIC_SCAN
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Status Panel */}
          {analysis.error && (
             <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <div>
                   <h3 className="text-red-400 font-mono text-sm font-bold">SYSTEM_ERROR</h3>
                   <p className="text-red-200/70 text-sm mt-1">{analysis.error}</p>
                </div>
             </div>
          )}
        </div>

        {/* Right Column: Analytics Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Row: Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risk Gauge Card */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-1 backdrop-blur-sm">
               <div className="bg-slate-950/50 rounded-lg h-full p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono">RISK_ASSESSMENT_MODULE</div>
                  {analysis.result ? (
                    <RiskGauge score={analysis.result.risk_score} severity={analysis.result.severity} />
                  ) : (
                    <div className="text-slate-600 flex flex-col items-center justify-center h-40">
                       <ShieldCheck className="mb-2 opacity-20" size={48} />
                       <span className="font-mono text-xs">AWAITING_DATA</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Primary Defect Card */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-1 backdrop-blur-sm flex flex-col">
              <div className="bg-slate-950/50 rounded-lg h-full p-6 flex flex-col relative overflow-hidden">
                 <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono">DEFECT_CLASSIFICATION</div>
                 
                 {analysis.result ? (
                   <div className="flex-1 flex flex-col justify-center">
                     <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Identified Anomaly</div>
                     <div className="text-2xl text-white font-bold font-mono border-l-2 border-cyan-500 pl-4 mb-4">
                       {analysis.result.primary_defect}
                     </div>
                     
                     <div className="mt-2 pt-4 border-t border-slate-800">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Recommended Action</div>
                        <p className="text-sm text-cyan-100/80 leading-snug">
                          {analysis.result.recommendation}
                        </p>
                     </div>
                   </div>
                 ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-600 font-mono text-xs">
                       NO_DEFECTS_DETECTED
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Thinking Log */}
          <div className="flex-1 min-h-[300px] relative">
            <div className="absolute -inset-px bg-gradient-to-b from-slate-700 to-transparent rounded-xl opacity-30 pointer-events-none"></div>
            {analysis.result ? (
               <ThinkingLog text={analysis.result.reasoning_chain} />
            ) : (
               <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 h-full flex items-center justify-center">
                  <p className="font-mono text-slate-600 text-sm animate-pulse">Waiting for neural processing stream...</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
