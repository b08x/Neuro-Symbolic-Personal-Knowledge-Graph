
import React, { useRef, useState } from 'react';
import { useNeuro } from '../../contexts/NeuroContext';
import NodeItem from './NodeItem';
import ConnectionLine from './ConnectionLine';

const SpatialCanvas: React.FC = () => {
  const { nodes, sources, updateNodePosition, selectedNodeId, selectNode } = useNeuro();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Viewport State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Interaction State
  const [isPanning, setIsPanning] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    selectNode(null);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleNodeStartDrag = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    selectNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setLastMousePos({ x: e.clientX, y: e.clientY });

    if (draggingNodeId) {
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        updateNodePosition(draggingNodeId, node.x + dx, node.y + dy);
      }
    } else if (isPanning) {
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  // Find related source for the selected node (Traceability)
  const relatedSource = selectedNode?.sourceIds.length 
    ? sources.find(s => s.id === selectedNode.sourceIds[0]) 
    : null;

  return (
    <div 
      className="flex-grow relative overflow-hidden bg-black cursor-grab active:cursor-grabbing"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-75 ease-linear"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {/* Draw connections here if edges existed in VisualNode connection logic, removed for simplified Graph view for now */}
        
        {nodes.map(node => (
          <NodeItem 
            key={node.id} 
            node={node} 
            isSelected={selectedNodeId === node.id}
            onStartDrag={(e) => handleNodeStartDrag(e, node.id)}
            onSelect={() => selectNode(node.id)}
          />
        ))}
      </div>

      {/* Semantic Detail Panel */}
      {selectedNode && (
        <div className="absolute right-6 top-20 w-80 bg-[#1a1d24]/95 backdrop-blur border border-white/10 rounded-lg p-6 shadow-2xl z-30 animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              {selectedNode.type}
            </h3>
            <button onClick={() => selectNode(null)} className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-lg font-bold text-white mb-2">
            {selectedNode.label}
          </div>
          
          <div className="text-sm text-gray-400 leading-relaxed mb-4">
            {selectedNode.description}
          </div>

          {/* Source Traceability - The "R" in Graph RAG */}
          {relatedSource && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-[10px] text-cyan-400 font-bold mb-1 uppercase">Source Artifact</div>
              <div className="p-2 bg-black/40 rounded text-xs text-gray-300 font-mono max-h-24 overflow-y-auto">
                {relatedSource.content}
              </div>
              <div className="text-[9px] text-gray-600 mt-1">
                ID: {relatedSource.id} | {new Date(relatedSource.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpatialCanvas;
