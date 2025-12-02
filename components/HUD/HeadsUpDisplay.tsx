import React from 'react';
import StreamMeter from './StreamMeter';
import { useNeuro } from '../../contexts/NeuroContext';
import { DORSAL_COLOR, VENTRAL_COLOR } from '../../constants';

const HeadsUpDisplay: React.FC = () => {
  const { systemState } = useNeuro();

  return (
    <header className="absolute top-0 left-0 right-0 h-14 bg-[#141923]/90 backdrop-blur-sm border-b border-white/5 z-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold tracking-widest">
          <span style={{ color: DORSAL_COLOR }}>NEURO</span>
          <span className="text-gray-500">-</span>
          <span style={{ color: VENTRAL_COLOR }}>LINGUISTIC</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-400">
          PROSTHETIC V1.0
        </div>
      </div>

      <div className="flex items-center gap-8">
        <StreamMeter label="DORSAL" value={systemState.dorsalScore} color={DORSAL_COLOR} />
        <StreamMeter label="VENTRAL" value={systemState.ventralScore} color={VENTRAL_COLOR} />
      </div>

      <div className="flex items-center gap-4">
        {systemState.isThinking && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            THINKING
          </div>
        )}
        <div className={`px-3 py-1 rounded text-xs font-bold ${systemState.isLiveActive ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-500'}`}>
          {systemState.isLiveActive ? 'LIVE ACTIVE' : 'LIVE READY'}
        </div>
      </div>
    </header>
  );
};

export default HeadsUpDisplay;