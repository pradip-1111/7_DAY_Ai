import { AnalyticsEvent, UserProfile, RecommendationResult, GrowthMetricsSummary, EventName, SegmentName } from '@/types/growth';

// In-memory + localStorage store for full offline & demo capability
const STORAGE_KEY_EVENTS = 'ai_growth_events';
const STORAGE_KEY_PROFILES = 'ai_growth_profiles';
const STORAGE_KEY_REC = 'ai_growth_recommendation';
const STORAGE_KEY_PROGRESS = 'ai_growth_progress';

export interface LocalChallengeProgress {
  userId: string;
  dayNumber: number;
  completed: boolean;
  completedAt: string | null;
}

export function generateSeedData(): { events: AnalyticsEvent[]; profiles: UserProfile[] } {
  const events: AnalyticsEvent[] = [];
  const profiles: UserProfile[] = [];

  const segments: SegmentName[] = [
    'Beginner AI Career Builder',
    'Intermediate App Builder',
    'Advanced ML Engineer',
    'Career Seeker',
    'Portfolio Builder',
    'Hackathon Builder',
  ];

  const variants = ['A', 'B'];

  // Seed baseline metrics matching requirement:
  // 1000 visitors, 600 quiz starts, 420 quiz completions, 210 registrations, 170 challenge starts, 60 completions
  
  const now = Date.now();
  const dayMs = 86400000;

  // 1. Visitors (1000)
  for (let i = 0; i < 1000; i++) {
    const timeOffset = Math.floor(Math.random() * 14 * dayMs); // spread over last 14 days
    const created_at = new Date(now - timeOffset).toISOString();
    const sessionId = `session_${i + 1}`;
    const variant = i % 2 === 0 ? 'A' : 'B';

    events.push({
      id: `evt_pv_${i}`,
      session_id: sessionId,
      event_name: 'page_view',
      variant,
      metadata: { source: i % 3 === 0 ? 'linkedin' : i % 2 === 0 ? 'twitter' : 'direct' },
      created_at,
    });

    events.push({
      id: `evt_exp_${i}`,
      session_id: sessionId,
      event_name: 'experiment_exposure',
      variant,
      metadata: { experiment: 'cta_messaging_v1', variant },
      created_at,
    });

    // 600 Quiz Starts
    if (i < 600) {
      events.push({
        id: `evt_qs_${i}`,
        session_id: sessionId,
        event_name: 'quiz_started',
        variant,
        created_at: new Date(now - timeOffset + 30000).toISOString(),
      });
    }

    // 420 Quiz Completions
    if (i < 420) {
      const segment = segments[i % segments.length];
      events.push({
        id: `evt_qc_${i}`,
        session_id: sessionId,
        event_name: 'quiz_completed',
        variant,
        metadata: { segment, skill_level: i % 2 === 0 ? 'Beginner' : 'Intermediate' },
        created_at: new Date(now - timeOffset + 120000).toISOString(),
      });

      events.push({
        id: `evt_rv_${i}`,
        session_id: sessionId,
        event_name: 'recommendation_viewed',
        variant,
        metadata: { project: 'AI Resume Assistant' },
        created_at: new Date(now - timeOffset + 130000).toISOString(),
      });
    }

    // 210 Registrations (CTA Variant B has slightly higher conversion in seed for demonstration!)
    // Variant B get 118 registrations vs Variant A 92 registrations
    const shouldRegister = (variant === 'B' && i < 236) || (variant === 'A' && i < 184);
    if (i < 210 && shouldRegister) {
      const userId = `usr_${i + 1}`;
      const segment = segments[i % segments.length];

      const profile: UserProfile = {
        id: userId,
        name: `Student Builder ${i + 1}`,
        email: `student${i + 1}@university.edu`,
        college: i % 2 === 0 ? 'Stanford University' : 'MIT',
        graduation_year: 2026,
        skill_level: i % 3 === 0 ? 'Advanced' : i % 2 === 0 ? 'Intermediate' : 'Beginner',
        goal: 'Internship',
        segment,
        technologies: ['React', 'Python', 'OpenAI'],
        experiment_variant: variant,
        created_at: new Date(now - timeOffset + 180000).toISOString(),
      };
      profiles.push(profile);

      events.push({
        id: `evt_rs_${i}`,
        user_id: userId,
        session_id: sessionId,
        event_name: 'registration_started',
        variant,
        created_at: new Date(now - timeOffset + 150000).toISOString(),
      });

      events.push({
        id: `evt_rc_${i}`,
        user_id: userId,
        session_id: sessionId,
        event_name: 'registration_completed',
        variant,
        created_at: new Date(now - timeOffset + 180000).toISOString(),
      });
    }
  }

  // 170 Challenge Starts
  for (let i = 0; i < Math.min(170, profiles.length); i++) {
    const user = profiles[i];
    events.push({
      id: `evt_cs_${i}`,
      user_id: user.id,
      event_name: 'challenge_started',
      variant: user.experiment_variant,
      created_at: new Date(new Date(user.created_at).getTime() + 600000).toISOString(),
    });

    // 60 Challenge Completions (completed day 7)
    const daysToComplete = i < 60 ? 7 : (i % 5) + 1;
    for (let day = 1; day <= daysToComplete; day++) {
      events.push({
        id: `evt_dc_${user.id}_${day}`,
        user_id: user.id,
        event_name: 'day_completed',
        variant: user.experiment_variant,
        metadata: { day_number: day },
        created_at: new Date(new Date(user.created_at).getTime() + day * dayMs).toISOString(),
      });
    }

    if (daysToComplete === 7) {
      events.push({
        id: `evt_cc_${i}`,
        user_id: user.id,
        event_name: 'challenge_completed',
        variant: user.experiment_variant,
        created_at: new Date(new Date(user.created_at).getTime() + 7 * dayMs).toISOString(),
      });
    }
  }

  return { events, profiles };
}

export function getLocalEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return generateSeedData().events;
  const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (!stored) {
    const seed = generateSeedData();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(seed.events));
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(seed.profiles));
    return seed.events;
  }
  return JSON.parse(stored);
}

export function saveLocalEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  const events = getLocalEvents();
  events.push({
    ...event,
    id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: event.created_at || new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
}

export function getLocalProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return generateSeedData().profiles;
  const stored = localStorage.getItem(STORAGE_KEY_PROFILES);
  if (!stored) {
    const seed = generateSeedData();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(seed.events));
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(seed.profiles));
    return seed.profiles;
  }
  return JSON.parse(stored);
}

export function saveLocalProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  const profiles = getLocalProfiles();
  const existingIdx = profiles.findIndex((p) => p.id === profile.id || p.email === profile.email);
  if (existingIdx >= 0) {
    profiles[existingIdx] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
}

export function resetDemoSeed(): void {
  if (typeof window === 'undefined') return;
  const seed = generateSeedData();
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(seed.events));
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(seed.profiles));
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_REC);
}
