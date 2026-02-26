import { NextRequest, NextResponse } from 'next/server';
import { uploadVideoToGemini, analyzeStrokes } from '@/lib/gemini';
import { strokeCountingPrompt } from '@/lib/prompts';
import { PlayerSide, AnalysisResult } from '@/lib/types';
import { del } from '@vercel/blob';

export const maxDuration = 300; // 5 minutes for video processing

export async function POST(request: NextRequest) {
  try {
    const { blobUrl, playerSide } = (await request.json()) as {
      blobUrl: string;
      playerSide: PlayerSide;
    };

    if (!blobUrl || !playerSide) {
      return NextResponse.json({ error: 'Missing blobUrl or playerSide' }, { status: 400 });
    }

    // Upload video to Gemini File API
    const geminiFile = await uploadVideoToGemini(blobUrl);

    // Delete the Blob file (no longer needed)
    try {
      await del(blobUrl);
    } catch {
      // Non-critical, ignore
    }

    // Run stroke analysis with Gemini Flash
    const prompt = strokeCountingPrompt(playerSide);
    const rawResult = await analyzeStrokes(geminiFile.uri, prompt);

    // Parse the JSON response
    const parsed = JSON.parse(rawResult);

    const result: AnalysisResult = {
      playerDescription: parsed.playerDescription || 'Player analyzed',
      totalStrokes: parsed.totalStrokes || 0,
      strokes: parsed.strokes || [],
      summary: parsed.summary || '',
      geminiFileName: geminiFile.name,
      geminiFileUri: geminiFile.uri,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
