'use client';

import { StrokeCount } from '@/lib/types';

interface StrokeCardProps {
  stroke: StrokeCount;
  onClick: () => void;
  loading?: boolean;
}

const strokeIcons: Record<string, string> = {
  'Forehand groundstroke': 'FH',
  'Backhand groundstroke': 'BH',
  'Forehand volley': 'FV',
  'Backhand volley': 'BV',
  'Serve': 'SV',
  'Return of serve': 'RT',
  'Overhead/smash': 'SM',
  'Drop shot': 'DS',
  'Lob': 'LB',
};

export default function StrokeCard({ stroke, onClick, loading }: StrokeCardProps) {
  const abbrev = strokeIcons[stroke.strokeType] || stroke.strokeType.slice(0, 2).toUpperCase();

  const spinEntries = Object.entries(stroke.spinBreakdown).filter(([, count]) => count > 0);

  const spinColors: Record<string, string> = {
    flat: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    topspin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    slice: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    sidespin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="group relative p-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-left transition-all hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20 disabled:opacity-50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold text-sm">
          {abbrev}
        </div>
        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {stroke.count}
        </div>
      </div>

      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        {stroke.strokeType}
      </h4>

      {spinEntries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {spinEntries.map(([spin, count]) => (
            <span
              key={spin}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${spinColors[spin] || 'bg-zinc-100 text-zinc-600'}`}
            >
              {spin} {count}
            </span>
          ))}
        </div>
      )}

      <div className="absolute bottom-2 right-3 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Click for technique analysis
      </div>
    </button>
  );
}
