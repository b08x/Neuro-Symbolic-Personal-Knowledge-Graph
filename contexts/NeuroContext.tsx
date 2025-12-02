
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  VisualNode, 
  SourceArtifact, 
  KnowledgeEdge, 
  SystemState, 
  NodeType,
  StreamType
} from '../types';
import { INITIAL_SYSTEM_STATE } from '../constants';
import { getRandomPosition } from '../utils/spatialMath';
import { extractGraphFromText, generateThinkingResponse, transcribeAudio, analyzeVideo } from '../services/gemini';

interface NeuroContextType {
  // Visual Layer
  nodes: VisualNode[];
  edges: KnowledgeEdge[];
  
  // Data Layer
  sources: SourceArtifact[];
  
  // State
  systemState: SystemState;
  selectedNodeId: string | null;
  
  // Actions
  addSourceText: (content: string) => Promise<void>;
  updateNodePosition: (id: string, x: number, y: number) => void;
  selectNode: (id: string | null) => void;
  processMedia: (file: File, type: 'audio' | 'video') => Promise<void>;
  setSystemState: React.Dispatch<React.SetStateAction<SystemState>>;
  addNode: (label: string, type: NodeType) => void;
}

const NeuroContext = createContext<NeuroContextType | undefined>(undefined);

export const NeuroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. The Immutable Source of Truth (Chat History / Files)
  const [sources, setSources] = useState<SourceArtifact[]>([]);
  
  // 2. The Knowledge Graph (Entities & Relations)
  // In a real app, this would be fetched from Neo4j/VectorDB based on viewport
  const [nodes, setNodes] = useState<VisualNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  
  const [systemState, setSystemState] = useState<SystemState>(INITIAL_SYSTEM_STATE);
  const [selectedNodeId, selectNode] = useState<string | null>(null);

  // Helper to merge new entities into existing graph
  const mergeGraphData = useCallback((sourceId: string, extraction: any) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      
      extraction.entities.forEach((entity: any) => {
        // Simple deduplication by name for MVP
        const existingIndex = newNodes.findIndex(n => n.label.toLowerCase() === entity.name.toLowerCase());
        
        if (existingIndex >= 0) {
          // Update existing node
          if (!newNodes[existingIndex].sourceIds.includes(sourceId)) {
            newNodes[existingIndex].sourceIds.push(sourceId);
          }
          // Reinforce stream dominance
          newNodes[existingIndex].streamDominance = entity.stream;
        } else {
          // Create new node
          const pos = getRandomPosition(centerX, centerY, 300);
          newNodes.push({
            id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            label: entity.name,
            type: entity.type,
            streamDominance: entity.stream,
            description: entity.description,
            sourceIds: [sourceId],
            confidence: 1.0,
            x: pos.x,
            y: pos.y,
            isSelected: false,
            isExpanded: false
          });
        }
      });
      return newNodes;
    });

    setEdges(prevEdges => {
      const newEdges = [...prevEdges];
      // Note: In a real implementation we would look up IDs for 'from' and 'to'
      // properly. Here we just assume names are unique for the visual demo.
      return newEdges; 
    });
  }, []);

  const addSourceText = useCallback(async (content: string) => {
    // 1. Create Source Artifact
    const sourceId = `src_${Date.now()}`;
    const newSource: SourceArtifact = {
      id: sourceId,
      type: 'text',
      mimeType: 'text/plain',
      content,
      timestamp: Date.now()
    };
    
    setSources(prev => [...prev, newSource]);
    setSystemState(prev => ({ ...prev, processingQueue: prev.processingQueue + 1 }));

    // 2. Extract Graph Data (The "Thinking" part)
    const extraction = await extractGraphFromText(content);
    
    // 3. Update System State (Dual Stream Balance)
    setSystemState(prev => ({
      ...prev,
      dorsalScore: Math.min(100, Math.max(0, prev.dorsalScore + (extraction.analysis.rigidity > 50 ? 5 : -2))),
      ventralScore: Math.min(100, Math.max(0, prev.ventralScore + (extraction.analysis.chaos > 50 ? 5 : -2))),
      processingQueue: prev.processingQueue - 1
    }));

    // 4. Merge into Graph
    mergeGraphData(sourceId, extraction);

    // 5. If complex, trigger deeper thinking
    if (extraction.analysis.rigidity > 80 || content.length > 100) {
        setSystemState(prev => ({ ...prev, isThinking: true }));
        // In a real system, this would generate a new SourceArtifact of type 'system_thought'
        await generateThinkingResponse(content); 
        setSystemState(prev => ({ ...prev, isThinking: false }));
    }

  }, [mergeGraphData]);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const processMedia = useCallback(async (file: File, type: 'audio' | 'video') => {
    setSystemState(prev => ({ ...prev, processingQueue: prev.processingQueue + 1 }));
    const reader = new FileReader();
    reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        let textContent = "";
        if (type === 'audio') {
            textContent = await transcribeAudio(base64, file.type);
        } else {
            textContent = await analyzeVideo(base64, file.type, "Extract key concepts and emotional tone.");
        }

        // Treat media analysis as text source for graph extraction
        if (textContent) {
            await addSourceText(`[${type.toUpperCase()} ANALYSIS]: ${textContent}`);
        }
        
        setSystemState(prev => ({ ...prev, processingQueue: prev.processingQueue - 1 }));
    };
    reader.readAsDataURL(file);
  }, [addSourceText]);

  const addNode = useCallback((label: string, type: NodeType) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const pos = getRandomPosition(centerX, centerY, 300);
      const newNode: VisualNode = {
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: label,
        type: type,
        streamDominance: StreamType.VENTRAL, // Default to ventral for raw stream input
        sourceIds: [],
        confidence: 1.0,
        x: pos.x,
        y: pos.y,
        isSelected: false,
        isExpanded: false
      };
      setNodes(prev => [...prev, newNode]);
  }, []);

  return (
    <NeuroContext.Provider value={{ 
      nodes, 
      edges,
      sources,
      systemState, 
      selectedNodeId,
      addSourceText, // Replaces processUserInput
      updateNodePosition,
      selectNode,
      processMedia, 
      setSystemState,
      addNode
    }}>
      {children}
    </NeuroContext.Provider>
  );
};

export const useNeuro = () => {
  const context = useContext(NeuroContext);
  if (!context) throw new Error("useNeuro must be used within a NeuroProvider");
  return context;
};
