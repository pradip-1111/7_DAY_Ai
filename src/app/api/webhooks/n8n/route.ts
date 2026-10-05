import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log('[n8n Webhook Received]:', JSON.stringify(payload, null, 2));

    // Handle n8n incoming events: user segment response, follow-up status, daily task reminder trigger
    const { action, userId, dayNumber } = payload;

    return NextResponse.json({
      received: true,
      action: action || 'processed',
      userId: userId || null,
      dayNumber: dayNumber || null,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
