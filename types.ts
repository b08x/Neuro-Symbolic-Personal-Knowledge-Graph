
export enum NodeType {
  // Source Nodes (The raw data)
  SOURCE_TEXT = 'SOURCE_TEXT',
  SOURCE_MEDIA = 'SOURCE_MEDIA',
  
  // Knowledge Nodes (Extracted Entities)
  CONCEPT = 'CONCEPT',
  PERSON = 'PERSON',
  EVENT = 'EVENT',
  PROCESS = 'PROCESS',

  // Live Interaction Nodes
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

export enum StreamType {
  DORSAL = 'DORSAL', // Structure, Action, Logic
  VENTRAL = 'VENTRAL', // Meaning, Perception, Empathy
}

// 1. The Raw Data Layer (Corresponds to Document Store)
export interface SourceArtifact {
  id: string;
  type: 'text' | 'audio' | 'video' | 'file';
  mimeType: string;
  content: string; // The raw text or transcription
  summary?: string;
  timestamp: number;
  metadata?: {
    filename?: string;
    duration?: number;
    author?: string;
  };
}

// 2. The Semantic Graph Layer (Corresponds to Graph DB)
export interface KnowledgeNode {
  id: string;
  label: string;
  type: NodeType;
  streamDominance: StreamType;
  sourceIds: string[]; // Link back to SourceArtifacts (Traceability)
  description?: string;
  confidence: number;
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string; // e.g. "DEFINES", "CORRELATES_WITH"
  weight: number;
}

// 3. The Visual Presentation Layer (Corresponds to UI State)
export interface VisualNode extends KnowledgeNode {
  x: number;
  y: number;
  isSelected: boolean;
  isExpanded: boolean;
}

export interface SystemState {
  dorsalScore: number;
  ventralScore: number;
  cognitiveLoad: 'LOW' | 'OPTIMAL' | 'HIGH' | 'OVERLOAD';
  isLiveActive: boolean;
  isThinking: boolean;
  processingQueue: number; // Number of items currently being embedded/extracted
}

export interface ExtractionResult {
  entities: Array<{
    name: string;
    type: NodeType;
    description: string;
    stream: StreamType;
  }>;
  relations: Array<{
    from: string;
    to: string;
    type: string;
  }>;
  analysis: {
    rigidity: number;
    chaos: number;
  }
}