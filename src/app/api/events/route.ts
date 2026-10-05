import { NextResponse } from 'next/server';
import { AnalyticsEvent } from '@/types/growth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const event: AnalyticsEvent = await req.json();

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('events').insert([
        {
          user_id: event.user_id || null,
          session_id: event.session_id || null,
          event_name: event.event_name,
          variant: event.variant || 'A',
          metadata: event.metadata || {},
        },
      ]);
    }

    return NextResponse.json({ success: true, event: event.event_name });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
