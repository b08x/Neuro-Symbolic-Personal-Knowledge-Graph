
import React from 'react';
import { VisualNode, StreamType } from '../../types';
import { DORSAL_COLOR, VENTRAL_COLOR } from '../../constants';

interface NodeItemProps {
  node: VisualNode;
  isSelected: boolean;
  onStartDrag: (e: React.MouseEvent) => void;
  onSelect: () => void;
}

const NodeItem: React.FC<NodeItemProps> = ({ node, isSelected, onStartDrag, onSelect }) => {
  const isDorsal = node.streamDominance === StreamType.DORSAL;
  const baseColor = isDorsal ? DORSAL_COLOR : VENTRAL_COLOR;
  
  const handleMouseDown = (e: React.MouseEvent) => {
    onStartDrag(e);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      className={`absolute p-3 rounded-lg backdrop-blur-md transition-all duration-200 cursor-move border-l-2 group select-none
        ${isSelected ? 'z-50 shadow-[0_0_30px_rgba(0,0,0,0.5)] scale-110' : 'z-10 shadow-lg hover:scale-105 hover:z-20'}
      `}
      style={{
        left: node.x,
        top: node.y,
        borderColor: baseColor,
        backgroundColor: isSelected ? 'rgba(40, 45, 60, 0.95)' : 'rgba(30, 35, 45, 0.85)',
        transform: 'translate(-50%, -50%)',
        boxShadow: isSelected ? `0 0 20px -5px ${baseColor}40` : 'none',
        minWidth: '120px',
        maxWidth: '240px'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-1 gap-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 group-hover:text-white transition-colors">
          {node.type}
        </span>
      </div>
      
      <div className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-200'}`}>
        {node.label}
      </div>
      
      {node.description && isSelected && (
        <div className="mt-2 text-xs text-gray-400 border-t border-gray-700 pt-1">
            {node.description}
        </div>
      )}
    </div>
  );
};

export default NodeItem;
