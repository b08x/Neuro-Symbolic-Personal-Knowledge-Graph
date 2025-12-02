import React, { useState, useEffect } from 'react';
import { useNeuro } from '../../contexts/NeuroContext';
import { LiveSession } from '../../services/liveApi';
import { NodeType } from '../../types';

const LiveControls: React.FC = () => {
  const { setSystemState, addNode } = useNeuro();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return () => {
        if (session) session.disconnect();
    };
  }, [session]);

  const toggleLive = async () => {
    if (isActive && session) {
      session.disconnect();
      setSession(null);
      setIsActive(false);
      setSystemState(prev => ({ ...prev, isLiveActive: false }));
    } else {
      const newSession = new LiveSession(
        (text, isUser) => {
            // For demo: creating nodes from live events
            // In a real app we'd handle audio stream and transcription events separately
            addNode(text, isUser ? NodeType.USER : NodeType.SYSTEM);
        },
        (active) => {
            setIsActive(active);
            setSystemState(prev => ({ ...prev, isLiveActive: active }));
        }
      );
      await newSession.connect();
      setSession(newSession);
    }
  };

  return (
    <button
      onClick={toggleLive}
      className={`p-3 rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
      title="Toggle Live Voice Mode"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};

export default LiveControls;