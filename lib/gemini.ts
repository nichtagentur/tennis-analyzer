import { GoogleGenAI, FileState } from '@google/genai';

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function uploadVideoToGemini(blobUrl: string): Promise<{ name: string; uri: string }> {
  // Download video from Vercel Blob
  const response = await fetch(blobUrl);
  if (!response.ok) throw new Error(`Failed to download video from Blob: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'video/mp4';

  // Upload to Gemini File API
  const ai = getAI();
  const file = await ai.files.upload({
    file: new Blob([buffer], { type: contentType }),
    config: { mimeType: contentType },
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

  return { name: file.name, uri: file.uri };
}

export async function analyzeStrokes(fileUri: string, prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { fileData: { fileUri, mimeType: 'video/mp4' } },
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

export async function analyzeTechnique(fileUri: string, prompt: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [
      {
        role: 'user',
        parts: [
          { fileData: { fileUri, mimeType: 'video/mp4' } },
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
