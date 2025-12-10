import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface ThinkingLogProps {
  text: string;
}

const ThinkingLog: React.FC<ThinkingLogProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const speed = 15; // ms per char

    const typeWriter = () => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    if (text) {
      typeWriter();
    }
  }, [text]);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 h-full flex flex-col font-mono text-sm relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-xs">
        <Terminal size={14} className="text-cyan-400" />
        AI_Reasoning_Log.log
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-cyan-100/90 whitespace-pre-wrap leading-relaxed">
          {displayedText}
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
        </p>
      </div>
    </div>
  );
};

export default ThinkingLog;
