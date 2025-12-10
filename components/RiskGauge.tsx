import React, { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number;
  severity: 'Low' | 'Medium' | 'High';
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, severity }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score up
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedScore(Math.floor(start + (score - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  let color = 'text-emerald-500';
  if (score > 30) color = 'text-amber-500';
  if (score > 70) color = 'text-red-500';
  if (score > 90) color = 'text-red-600 animate-pulse';

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-300 ease-out ${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-100">
          <span className="text-4xl font-mono font-bold tracking-tighter">{animatedScore}%</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Integrity Risk</span>
        </div>
      </div>
      
      <div className={`mt-4 px-4 py-1 rounded-full border ${
        severity === 'High' ? 'border-red-500/50 bg-red-900/20 text-red-200' :
        severity === 'Medium' ? 'border-amber-500/50 bg-amber-900/20 text-amber-200' :
        'border-emerald-500/50 bg-emerald-900/20 text-emerald-200'
      } font-mono text-sm uppercase tracking-widest`}>
        SEVERITY: {severity}
      </div>
    </div>
  );
};

export default RiskGauge;
