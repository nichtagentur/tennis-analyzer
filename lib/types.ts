export interface StrokeCount {
  strokeType: string;
  count: number;
  spinBreakdown: {
    flat: number;
    topspin: number;
    slice: number;
    sidespin: number;
  };
}

export interface AnalysisResult {
  playerDescription: string;
  totalStrokes: number;
  strokes: StrokeCount[];
  summary: string;
  geminiFileName: string;
  geminiFileUri: string;
  geminiFileMimeType: string;
}

export interface TechniqueSection {
  observed: string;
  feedback: string;
}

export interface TechniqueAnalysis {
  strokeType: string;
  grip: TechniqueSection;
  footwork: TechniqueSection;
  contactPoint: TechniqueSection;
  swingPath: TechniqueSection;
  followThrough: TechniqueSection;
  bodyRotation: TechniqueSection;
  strengths: string[];
  improvements: string[];
  overallRating: string;
}

export type AppState = 'IDLE' | 'UPLOADING' | 'ANALYZING' | 'RESULTS' | 'TECHNIQUE';

export type PlayerSide = 'near' | 'far';
