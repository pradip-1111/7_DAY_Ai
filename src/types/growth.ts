// TypeScript Definitions for AI Growth Engine

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type UserGoal = 'Internship' | 'Job' | 'Portfolio' | 'Learning' | 'Hackathon';

export type SegmentName = 
  | 'Beginner AI Career Builder'
  | 'Intermediate App Builder'
  | 'Advanced ML Engineer'
  | 'Career Seeker'
  | 'Portfolio Builder'
  | 'Hackathon Builder'
  | 'AI Explorer';

export interface QuizSubmission {
  skill_level: SkillLevel;
  interest: string;
  daily_time: string;
  goal: UserGoal;
  technologies: string[];
}

export interface RecommendationResult {
  segment: SegmentName;
  recommended_project: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_days: number;
  reason: string;
  learning_path: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  graduation_year: number;
  skill_level: SkillLevel;
  goal: UserGoal;
  segment: SegmentName;
  technologies: string[];
  experiment_variant: string;
  created_at: string;
}

export type EventName = 
  | 'page_view'
  | 'quiz_started'
  | 'quiz_completed'
  | 'recommendation_viewed'
  | 'registration_started'
  | 'registration_completed'
  | 'challenge_started'
  | 'day_completed'
  | 'challenge_completed'
  | 'cta_clicked'
  | 'experiment_exposure';

export interface AnalyticsEvent {
  id?: string;
  user_id?: string | null;
  session_id?: string;
  event_name: EventName;
  variant?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface ChallengeTask {
  id: string;
  day_number: number;
  title: string;
  description: string;
  estimated_minutes: number;
  resources: string[];
  completed?: boolean;
  completed_at?: string | null;
}

export interface ExperimentVariant {
  name: string;
  label: string;
  ctaText: string;
  description: string;
}

export interface ExperimentStats {
  experimentId: string;
  variant: string;
  label: string;
  ctaText: string;
  visitors: number;
  registrations: number;
  conversionRate: number; // percentage
  status: 'Running' | 'Preliminary' | 'Conclusive';
  confidence: number; // e.g. 95%
}

export interface FunnelStepData {
  step: string;
  name: EventName;
  users: number;
  conversionRate: number; // % from previous step
  overallConversion: number; // % from initial visitors
  dropOffRate: number;
  dropOffCount: number;
  isLargestDropOff?: boolean;
}

export interface SegmentPerformance {
  segment: SegmentName;
  users: number;
  registrationRate: number;
  completionRate: number;
}

export interface GrowthMetricsSummary {
  visitors: number;
  quizStarts: number;
  quizCompletions: number;
  quizCompletionRate: number;
  registrations: number;
  registrationConversionRate: number;
  challengeStarts: number;
  challengeCompletions: number;
  challengeCompletionRate: number;
  avgTimeToRegisterMinutes: number;
  funnel: FunnelStepData[];
  largestDropOff: {
    fromStep: string;
    toStep: string;
    usersLost: number;
    dropOffRate: number;
    aiHypothesis: string;
  };
  experimentStats: ExperimentStats[];
  segmentPerformance: SegmentPerformance[];
}

export interface AIInsightsResponse {
  observations: string[];
  hypotheses: string[];
  experiments: Array<{
    title: string;
    description: string;
    expectedImpact: string;
    targetMetric: string;
  }>;
  nextSteps: string[];
}
