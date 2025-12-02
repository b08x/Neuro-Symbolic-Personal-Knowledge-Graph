
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GEMINI_MODELS } from "../constants";
import { ExtractionResult, NodeType, StreamType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Graph Extraction
const graphSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Unique name of the concept/entity" },
          type: { type: Type.STRING, enum: [NodeType.CONCEPT, NodeType.PERSON, NodeType.EVENT, NodeType.PROCESS] },
          description: { type: Type.STRING, description: "Brief definition based on context" },
          stream: { type: Type.STRING, enum: [StreamType.DORSAL, StreamType.VENTRAL], description: "Dorsal=Structural/Action, Ventral=Semantic/Emotional" }
        },
        required: ["name", "type", "stream"]
      }
    },
    relations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from: { type: Type.STRING, description: "Name of the source entity" },
          to: { type: Type.STRING, description: "Name of the target entity" },
          type: { type: Type.STRING, description: "The relationship predicate (e.g. CAUSES, IS_A, FEELS)" }
        },
        required: ["from", "to", "type"]
      }
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        rigidity: { type: Type.NUMBER },
        chaos: { type: Type.NUMBER }
      }
    }
  }
};

export const extractGraphFromText = async (text: string): Promise<ExtractionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODELS.FAST,
      contents: `Extract a knowledge graph from this text. Identify key entities (Concepts, People, Events) and their relationships. 
      Also analyze the psychological rigidity/chaos of the input.
      
      Input Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: graphSchema,
      },
    });

    let jsonText = response.text || "{}";
    jsonText = jsonText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(jsonText) as ExtractionResult;
  } catch (error) {
    console.error("Graph extraction failed", error);
    return { 
      entities: [{ name: "Unknown", type: NodeType.CONCEPT, description: text.slice(0, 50), stream: StreamType.VENTRAL }], 
      relations: [],
      analysis: { rigidity: 0, chaos: 0 }
    };
  }
};

export const generateThinkingResponse = async (prompt: string): Promise<{ text: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODELS.THINKING,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });
    return { text: response.text || "Processing..." };
  } catch (error) {
    console.error("Thinking failed", error);
    return { text: "Error in cognitive processing." };
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODELS.FAST,
      contents: {
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          { text: "Transcribe this audio verbatim." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    return "Audio transcription failed.";
  }
};

export const analyzeVideo = async (videoBase64: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODELS.THINKING,
            contents: {
                parts: [
                    { inlineData: { mimeType, data: videoBase64 } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "";
    } catch (error) {
        return "Video analysis failed.";
    }
}
