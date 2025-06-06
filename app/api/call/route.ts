import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (!process.env.ULTRAVOX_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    if (!process.env.AGENT_ID) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing Agent ID' },
        { status: 500 }
      );
    }

    const apiUrl = `https://api.ultravox.ai/api/agents/${process.env.AGENT_ID}/calls`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({
        templateContext: {},
        initialMessages: [],
        metadata: {},
        medium: {
          webRtc: {}
        },
        joinTimeout: "300s",
        maxDuration: "3600s",
        recordingEnabled: false,
        initialOutputMedium: "MESSAGE_MEDIUM_VOICE",
        firstSpeakerSettings: {
          user: {
            fallback: {
              text: "Hello! I'm ready to start our conversation.",
              delay: "1s"
            }
          }
        },
        experimentalSettings: {}
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to create call: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ joinUrl: data.joinUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}