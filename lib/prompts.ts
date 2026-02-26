import { PlayerSide } from './types';

export function strokeCountingPrompt(playerSide: PlayerSide): string {
  const sideDescription = playerSide === 'near'
    ? 'the player on the NEAR side of the court (closer to the camera)'
    : 'the player on the FAR side of the court (further from the camera)';

  return `You are an expert tennis analyst. Analyze this tennis video and focus on ${sideDescription}.

Your task:
1. Briefly describe the player you are analyzing (clothing, position, etc.)
2. Count EVERY stroke the player makes during the video
3. Classify each stroke by type and spin

Stroke types to look for:
- Forehand groundstroke
- Backhand groundstroke
- Forehand volley
- Backhand volley
- Serve
- Return of serve
- Overhead/smash
- Drop shot
- Lob

For each stroke type found, count how many were hit with each spin type:
- flat (minimal spin)
- topspin (forward rotation)
- slice (backspin/underspin)
- sidespin (lateral rotation)

Respond with valid JSON matching this exact structure:
{
  "playerDescription": "Brief description of the player being analyzed",
  "totalStrokes": <number>,
  "strokes": [
    {
      "strokeType": "<stroke type name>",
      "count": <total count for this stroke>,
      "spinBreakdown": {
        "flat": <count>,
        "topspin": <count>,
        "slice": <count>,
        "sidespin": <count>
      }
    }
  ],
  "summary": "2-3 sentence overall summary of the player's game in this video"
}

Only include stroke types that actually appear in the video. Be precise with your counts.`;
}

export function techniqueAnalysisPrompt(strokeType: string, playerSide: PlayerSide): string {
  const sideDescription = playerSide === 'near'
    ? 'the player on the NEAR side of the court (closer to the camera)'
    : 'the player on the FAR side of the court (further from the camera)';

  return `You are an elite tennis coach providing detailed technique analysis. Focus on ${sideDescription}.

Analyze this player's **${strokeType}** technique in detail. For each aspect below, describe what you observe and provide specific coaching feedback.

Respond with valid JSON matching this exact structure:
{
  "strokeType": "${strokeType}",
  "grip": {
    "observed": "What grip style you can identify from the video",
    "feedback": "Specific coaching advice about grip adjustments if needed"
  },
  "footwork": {
    "observed": "Description of the player's foot positioning and movement",
    "feedback": "Specific coaching advice about footwork improvements"
  },
  "contactPoint": {
    "observed": "Where the player makes contact with the ball relative to their body",
    "feedback": "Specific coaching advice about optimal contact point"
  },
  "swingPath": {
    "observed": "Description of the racket path during the stroke",
    "feedback": "Specific coaching advice about swing mechanics"
  },
  "followThrough": {
    "observed": "Description of how the player finishes the stroke",
    "feedback": "Specific coaching advice about follow-through"
  },
  "bodyRotation": {
    "observed": "Description of shoulder/hip rotation and kinetic chain",
    "feedback": "Specific coaching advice about body mechanics"
  },
  "strengths": ["List 2-3 specific strengths observed in this stroke"],
  "improvements": ["List 2-3 specific areas for improvement with actionable advice"],
  "overallRating": "One sentence overall assessment of this stroke's technique level"
}

Be specific and reference what you actually see in the video. Provide actionable coaching advice.`;
}
