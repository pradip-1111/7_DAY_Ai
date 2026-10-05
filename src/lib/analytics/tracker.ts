import { EventName, AnalyticsEvent } from '@/types/growth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { saveLocalEvent } from '@/lib/storage/mock-db';

const SESSION_KEY = 'ai_growth_session_id';
const VARIANT_KEY = 'ai_growth_cta_variant';

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getAssignedVariant(): string {
  if (typeof window === 'undefined') return 'A';
  let variant = localStorage.getItem(VARIANT_KEY);
  if (!variant) {
    // 50/50 randomized split assignment
    variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(VARIANT_KEY, variant);
  }
  return variant;
}

export async function trackEvent(
  eventName: EventName,
  userId?: string | null,
  metadata?: Record<string, any>
): Promise<void> {
  const sessionId = getSessionId();
  const variant = getAssignedVariant();

  const eventPayload: AnalyticsEvent = {
    event_name: eventName,
    user_id: userId || null,
    session_id: sessionId,
    variant: variant,
    metadata: metadata || {},
    created_at: new Date().toISOString(),
  };

  // Log locally to guarantee fast UI & fallback metrics work seamlessly
  saveLocalEvent(eventPayload);

  // If Supabase is configured, also persist to Supabase events table
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('events').insert([
        {
          user_id: userId || null,
          session_id: sessionId,
          event_name: eventName,
          variant: variant,
          metadata: metadata || {},
        },
      ]);
    } catch (err) {
      console.warn('Supabase event tracking error:', err);
    }
  }

  // Also trigger API route endpoint to trigger webhooks/PostHog integration if needed
  try {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch(() => {});
  } catch (e) {
    // Ignore fetch errors in background
  }
}
