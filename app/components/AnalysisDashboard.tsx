'use client';

import { AnalysisResult } from '@/lib/types';
import StrokeCard from './StrokeCard';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onStrokeClick: (strokeType: string) => void;
  loadingStroke: string | null;
  onReset: () => void;
}

export default function AnalysisDashboard({ result, onStrokeClick, loadingStroke, onReset }: AnalysisDashboardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Analysis Complete</h2>
          <p className="text-zinc-500 mt-1">{result.playerDescription}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
        >
          Analyze another video
        </button>
      </div>

      {/* Total strokes badge */}
      <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-3">
        <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{result.totalStrokes}</span>
        <span className="text-sm text-emerald-600 dark:text-emerald-500">total strokes detected</span>
      </div>

      {/* Stroke cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.strokes.map((stroke) => (
          <StrokeCard
            key={stroke.strokeType}
            stroke={stroke}
            onClick={() => onStrokeClick(stroke.strokeType)}
            loading={loadingStroke === stroke.strokeType}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Match Summary</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{result.summary}</p>
      </div>

      <p className="text-center text-sm text-zinc-400">
        Click any stroke card above for detailed technique analysis
      </p>
    </div>
  );
}
