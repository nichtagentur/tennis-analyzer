import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file type
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska'];
        const ext = pathname.split('.').pop()?.toLowerCase();
        const extToMime: Record<string, string> = {
          mp4: 'video/mp4',
          mov: 'video/quicktime',
          webm: 'video/webm',
          avi: 'video/x-msvideo',
          mkv: 'video/x-matroska',
        };

        if (ext && extToMime[ext] && !allowedTypes.includes(extToMime[ext])) {
          throw new Error('Invalid file type. Please upload a video file (MP4, MOV, WebM, AVI, MKV).');
        }

        return {
          allowedContentTypes: allowedTypes,
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
          tokenPayload: JSON.stringify({ uploadedAt: Date.now() }),
        };
      },
      onUploadCompleted: async () => {
        // Could log upload completion here
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
