import { NextRequest, NextResponse } from 'next/server';
import { analyzeTechnique } from '@/lib/gemini';
import { techniqueAnalysisPrompt } from '@/lib/prompts';
import { PlayerSide, TechniqueAnalysis } from '@/lib/types';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { geminiFileUri, strokeType, playerSide } = (await request.json()) as {
      geminiFileUri: string;
      strokeType: string;
      playerSide: PlayerSide;
    };

    if (!geminiFileUri || !strokeType || !playerSide) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = techniqueAnalysisPrompt(strokeType, playerSide);
    const rawResult = await analyzeTechnique(geminiFileUri, prompt);

    const parsed: TechniqueAnalysis = JSON.parse(rawResult);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Technique analysis error:', error);
    const message = error instanceof Error ? error.message : 'Technique analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
