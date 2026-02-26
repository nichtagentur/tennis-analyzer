'use client';

interface LoadingStateProps {
  stage: 'uploading' | 'processing' | 'analyzing' | 'technique';
}

const messages = {
  uploading: {
    title: 'Uploading Video',
    subtitle: 'Sending your video to the cloud...',
  },
  processing: {
    title: 'Processing Video',
    subtitle: 'Preparing video for AI analysis...',
  },
  analyzing: {
    title: 'Analyzing Strokes',
    subtitle: 'AI is watching the video and counting every stroke...',
  },
  technique: {
    title: 'Deep Technique Analysis',
    subtitle: 'AI coach is reviewing technique in detail...',
  },
};

export default function LoadingState({ stage }: LoadingStateProps) {
  const { title, subtitle } = messages[stage];

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-200 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
