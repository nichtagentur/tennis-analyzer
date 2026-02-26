'use client';

import { TechniqueAnalysis, TechniqueSection } from '@/lib/types';

interface TechniqueDetailProps {
  analysis: TechniqueAnalysis;
  onClose: () => void;
}

function Section({ title, data }: { title: string; data: TechniqueSection }) {
  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-2">
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h4>
      <div className="space-y-1.5">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Observed</span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{data.observed}</p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-500">Coaching Feedback</span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{data.feedback}</p>
        </div>
      </div>
    </div>
  );
}

export default function TechniqueDetail({ analysis, onClose }: TechniqueDetailProps) {
  const sections: { title: string; key: keyof TechniqueAnalysis }[] = [
    { title: 'Grip', key: 'grip' },
    { title: 'Footwork', key: 'footwork' },
    { title: 'Contact Point', key: 'contactPoint' },
    { title: 'Swing Path', key: 'swingPath' },
    { title: 'Follow-Through', key: 'followThrough' },
    { title: 'Body Rotation', key: 'bodyRotation' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to results
          </button>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {analysis.strokeType} -- Technique Analysis
          </h2>
        </div>
      </div>

      {/* Overall rating */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-6">
        <p className="text-emerald-800 dark:text-emerald-300 font-medium">{analysis.overallRating}</p>
      </div>

      {/* Technique sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sections.map(({ title, key }) => (
          <Section key={key} title={title} data={analysis[key] as TechniqueSection} />
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Strengths</h4>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <span className="shrink-0 mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">Areas for Improvement</h4>
          <ul className="space-y-2">
            {analysis.improvements.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-700 dark:text-amber-400">
                <span className="shrink-0 mt-0.5">-</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
