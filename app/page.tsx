'use client';

import { useState } from 'react';
import { AppState, PlayerSide, AnalysisResult, TechniqueAnalysis } from '@/lib/types';
import VideoUpload from './components/VideoUpload';
import LoadingState from './components/LoadingState';
import AnalysisDashboard from './components/AnalysisDashboard';
import TechniqueDetail from './components/TechniqueDetail';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [techniqueResult, setTechniqueResult] = useState<TechniqueAnalysis | null>(null);
  const [playerSide, setPlayerSide] = useState<PlayerSide>('near');
  const [loadingStroke, setLoadingStroke] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadStart = () => {
    setAppState('UPLOADING');
    setError(null);
  };

  const handleUploadComplete = async (blobUrl: string, side: PlayerSide) => {
    setPlayerSide(side);
    setAppState('ANALYZING');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobUrl, playerSide: side }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setAppState('RESULTS');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAppState('IDLE');
    }
  };

  const handleStrokeClick = async (strokeType: string) => {
    if (!analysisResult) return;
    setLoadingStroke(strokeType);

    try {
      const response = await fetch('/api/technique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiFileUri: analysisResult.geminiFileUri,
          strokeType,
          playerSide,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Technique analysis failed');
      }

      const result: TechniqueAnalysis = await response.json();
      setTechniqueResult(result);
      setAppState('TECHNIQUE');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Technique analysis failed');
    } finally {
      setLoadingStroke(null);
    }
  };

  const handleReset = () => {
    setAppState('IDLE');
    setAnalysisResult(null);
    setTechniqueResult(null);
    setError(null);
    setLoadingStroke(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Tennis Analyzer</h1>
            <p className="text-sm text-zinc-500">AI-powered stroke analysis for coaches</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {appState === 'IDLE' && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Analyze Tennis Technique
              </h2>
              <p className="text-lg text-zinc-500 max-w-xl mx-auto">
                Upload a match or training video and get AI-powered stroke counting
                and detailed technique feedback for your players.
              </p>
            </div>
            <VideoUpload
              onUploadComplete={handleUploadComplete}
              onUploadStart={handleUploadStart}
            />
          </div>
        )}

        {appState === 'UPLOADING' && <LoadingState stage="uploading" />}
        {appState === 'ANALYZING' && <LoadingState stage="analyzing" />}

        {appState === 'RESULTS' && analysisResult && (
          <AnalysisDashboard
            result={analysisResult}
            onStrokeClick={handleStrokeClick}
            loadingStroke={loadingStroke}
            onReset={handleReset}
          />
        )}

        {appState === 'TECHNIQUE' && techniqueResult && (
          <TechniqueDetail
            analysis={techniqueResult}
            onClose={() => setAppState('RESULTS')}
          />
        )}
      </main>
    </div>
  );
}
