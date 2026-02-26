import { GoogleGenAI, FileState } from '@google/genai';

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Map content types to what Gemini accepts
function normalizeVideoMimeType(contentType: string, url: string): string {
  const mimeMap: Record<string, string> = {
    'video/quicktime': 'video/mov',
    'video/x-msvideo': 'video/avi',
    'video/x-matroska': 'video/mkv',
    'application/octet-stream': 'video/mp4', // fallback
  };

  if (mimeMap[contentType]) return mimeMap[contentType];
  if (contentType.startsWith('video/')) return contentType;

  // Guess from URL extension
  const ext = url.split('.').pop()?.toLowerCase()?.split('?')[0];
  const extMap: Record<string, string> = {
    mp4: 'video/mp4',
    mov: 'video/mov',
    webm: 'video/webm',
    avi: 'video/avi',
    mkv: 'video/mkv',
  };
  return extMap[ext || ''] || 'video/mp4';
}

export async function uploadVideoToGemini(blobUrl: string): Promise<{ name: string; uri: string; mimeType: string }> {
  // Download video from Vercel Blob
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error(`Failed to download video from Blob: ${response.status}`);

  const rawContentType = response.headers.get('content-type') || 'application/octet-stream';
  const mimeType = normalizeVideoMimeType(rawContentType, blobUrl);

  const buffer = Buffer.from(await response.arrayBuffer());

  // Upload to Gemini File API
  const ai = getAI();
  const file = await ai.files.upload({
    file: new Blob([buffer], { type: mimeType }),
    config: { mimeType },
  });

  if (!file.name || !file.uri) {
    throw new Error('Gemini file upload failed - no name/uri returned');
  }

  // Poll until file is ACTIVE
  let currentFile = file;
  while (currentFile.state === FileState.PROCESSING) {
    await sleep(2000);
    currentFile = await ai.files.get({ name: file.name });
  }

  if (currentFile.state === FileState.FAILED) {
    throw new Error('Gemini video processing failed');
  }

  return { name: file.name, uri: file.uri, mimeType };
}

export async function analyzeStrokes(fileUri: string, mimeType: string, prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { fileData: { fileUri, mimeType } },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  });

  return response.text || '{}';
}

export async function analyzeTechnique(fileUri: string, mimeType: string, prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [
      {
        role: 'user',
        parts: [
          { fileData: { fileUri, mimeType } },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  return response.text || '{}';
}

export async function deleteGeminiFile(name: string): Promise<void> {
  try {
    await getAI().files.delete({ name });
  } catch {
    // File may have already expired, ignore errors
  }
}
