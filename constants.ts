import { StreamType } from "./types";

export const DORSAL_COLOR = '#00f0ff'; // Cyan
export const VENTRAL_COLOR = '#ff9d00'; // Orange
export const BG_COLOR = '#0f1115';
export const PANEL_BG = 'rgba(20, 25, 35, 0.95)';

export const GEMINI_MODELS = {
  FAST: 'gemini-2.5-flash',
  THINKING: 'gemini-3-pro-preview',
  LIVE: 'gemini-2.5-flash-native-audio-preview-09-2025',
};

export const INITIAL_SYSTEM_STATE = {
  dorsalScore: 50,
  ventralScore: 50,
  cognitiveLoad: 'OPTIMAL' as const,
  isLiveActive: false,
  isThinking: false,
  processingQueue: 0,
};

export const SAMPLE_PROMPTS = [
  "I'm feeling overwhelmed by my project list.",
  "Help me structure this email to my boss.",
  "Why do I keep procrastinating on simple tasks?",
  "Analyze this video clip for emotional cues."
];