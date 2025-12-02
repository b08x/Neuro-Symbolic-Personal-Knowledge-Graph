
import React, { useState } from 'react';
import { useNeuro } from '../../contexts/NeuroContext';
import { SAMPLE_PROMPTS, VENTRAL_COLOR } from '../../constants';
import MediaUploader from './MediaUploader';
import LiveControls from './LiveControls';

const StagingArea: React.FC = () => {
  const { addSourceText, systemState } = useNeuro();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const text = input;
    setInput('');
    await addSourceText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f1115] via-[#0f1115] to-transparent z-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Processing Indicator */}
        {systemState.processingQueue > 0 && (
            <div className="mb-2 text-xs text-cyan-400 font-mono animate-pulse">
                Thinking... ({systemState.processingQueue} items in queue)
            </div>
        )}

        {/* Scaffolding Prompts (Ventral aid) */}
        {!input && !isFocused && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-3 p-1 bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl transition-all duration-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500/50">
          
          <div className="flex flex-col gap-2 p-2">
             <LiveControls />
             <MediaUploader />
          </div>

          <form onSubmit={handleSubmit} className="flex-grow">
            <div className="absolute -top-3 left-4 px-2 bg-[#1a1d24] text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
              <span style={{ color: VENTRAL_COLOR }}>Yes, And...</span> Staging Area
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Dump your thoughts here..."
              className="w-full bg-transparent text-gray-200 placeholder-gray-600 p-4 min-h-[80px] max-h-[200px] resize-none focus:outline-none font-sans"
            />
          </form>

          <button
            onClick={() => handleSubmit()}
            className="mb-2 mr-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            OFFLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default StagingArea;
