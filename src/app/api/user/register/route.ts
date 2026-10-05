import { NextResponse } from 'next/server';
import { UserProfile, RecommendationResult } from '@/types/growth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, recommendation } = body as {
      profile: Omit<UserProfile, 'id' | 'created_at'>;
      recommendation: RecommendationResult;
    };

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullProfile: UserProfile = {
      ...profile,
      id: userId,
      created_at: new Date().toISOString(),
    };

    // Store in Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('profiles').insert([
        {
          id: userId,
          name: fullProfile.name,
          email: fullProfile.email,
          college: fullProfile.college,
          graduation_year: fullProfile.graduation_year,
          skill_level: fullProfile.skill_level,
          goal: fullProfile.goal,
          segment: fullProfile.segment,
          technologies: fullProfile.technologies,
          experiment_variant: fullProfile.experiment_variant,
        },
      ]);

      await supabase.from('recommendations').insert([
        {
          user_id: userId,
          segment: recommendation.segment,
          project: recommendation.recommended_project,
          difficulty: recommendation.difficulty,
          estimated_days: recommendation.estimated_days,
          reason: recommendation.reason,
          learning_path: recommendation.learning_path,
        },
      ]);

      await supabase.from('events').insert([
        {
          user_id: userId,
          event_name: 'registration_completed',
          variant: fullProfile.experiment_variant,
          metadata: {
            segment: fullProfile.segment,
            college: fullProfile.college,
            goal: fullProfile.goal,
          },
        },
      ]);
    }

    // Trigger n8n Automation webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl && n8nWebhookUrl.startsWith('http')) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'user_registered',
          user: fullProfile,
          recommendation,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.warn('n8n webhook dispatch warning:', err));
    }

    return NextResponse.json({
      success: true,
      user: fullProfile,
      recommendation,
    });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
