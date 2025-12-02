import React from 'react';
import { DORSAL_COLOR, VENTRAL_COLOR } from '../../constants';

interface StreamMeterProps {
  label: string;
  value: number; // 0-100
  color: string;
}

const StreamMeter: React.FC<StreamMeterProps> = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="w-16 text-right text-gray-400">{label}</span>
      <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-gray-500 w-8">{Math.round(value)}%</span>
    </div>
  );
};

export default StreamMeter;