'use client';

import { useState, useCallback, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { PlayerSide } from '@/lib/types';

interface VideoUploadProps {
  onUploadComplete: (blobUrl: string, playerSide: PlayerSide) => void;
  onUploadStart: () => void;
}

export default function VideoUpload({ onUploadComplete, onUploadStart }: VideoUploadProps) {
  const [playerSide, setPlayerSide] = useState<PlayerSide>('near');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska'];

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
      setError('Please select a video file (MP4, MOV, WebM, AVI, or MKV)');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('File too large. Maximum size is 500MB.');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    onUploadStart();

    try {
      const blob = await upload(selectedFile.name, selectedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      onUploadComplete(blob.url, playerSide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
          ${dragActive
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
            : selectedFile
              ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{selectedFile.name}</p>
            <p className="text-sm text-zinc-500">{formatSize(selectedFile.size)}</p>
            <button
              type="button"
              className="text-sm text-emerald-600 hover:text-emerald-700 underline"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
            >
              Choose a different file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Drop your tennis video here
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                or click to browse -- MP4, MOV, WebM up to 500MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Player side selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Which player should we analyze?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`p-4 rounded-xl border-2 text-left transition-all
              ${playerSide === 'near'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
              }`}
            onClick={() => setPlayerSide('near')}
          >
            <div className="font-medium text-zinc-900 dark:text-zinc-100">Near Side</div>
            <div className="text-sm text-zinc-500 mt-1">Closer to the camera</div>
          </button>
          <button
            type="button"
            className={`p-4 rounded-xl border-2 text-left transition-all
              ${playerSide === 'far'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
              }`}
            onClick={() => setPlayerSide('far')}
          >
            <div className="font-medium text-zinc-900 dark:text-zinc-100">Far Side</div>
            <div className="text-sm text-zinc-500 mt-1">Further from the camera</div>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        disabled={!selectedFile || uploading}
        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed text-lg"
        onClick={handleUpload}
      >
        {uploading ? 'Uploading...' : 'Analyze Video'}
      </button>
    </div>
  );
}
