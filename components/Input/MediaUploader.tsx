import React, { useRef } from 'react';
import { useNeuro } from '../../contexts/NeuroContext';

const MediaUploader: React.FC = () => {
  const { processMedia } = useNeuro();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      processMedia(file, type);
    }
  };

  return (
    <div className="flex gap-2">
      <input 
        type="file" 
        accept="audio/*" 
        className="hidden" 
        ref={audioInputRef} 
        onChange={(e) => handleFile(e, 'audio')}
      />
      <input 
        type="file" 
        accept="video/*" 
        className="hidden" 
        ref={videoInputRef} 
        onChange={(e) => handleFile(e, 'video')}
      />
      
      <button 
        onClick={() => audioInputRef.current?.click()}
        className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
        title="Transcribe Audio"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      
      <button 
        onClick={() => videoInputRef.current?.click()}
        className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
        title="Analyze Video"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};

export default MediaUploader;