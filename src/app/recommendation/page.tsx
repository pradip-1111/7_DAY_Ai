'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RecommendationResult } from '@/types/growth';
import { trackEvent } from '@/lib/analytics/tracker';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Calendar, CheckCircle2, ArrowRight, Brain, ShieldCheck } from 'lucide-react';

export default function RecommendationPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    trackEvent('recommendation_viewed');

    const storedRec = sessionStorage.getItem('ai_growth_recommendation');
    if (storedRec) {
      try {
        setRecommendation(JSON.parse(storedRec));
      } catch {
        // Fallback default recommendation
        setRecommendation({
          segment: 'Beginner AI Career Builder',
          recommended_project: 'AI Resume Assistant',
          difficulty: 'Beginner',
          estimated_days: 7,
          reason: 'This project aligns with your current JavaScript/Python knowledge and your goal of building an internship-ready portfolio.',
          learning_path: [
            'Day 1: Project Setup & AI API Workspace',
            'Day 2: Build the Resume Input Interface',
            'Day 3: Connect OpenAI API Route',
            'Day 4: Implement Dynamic AI Formatting',
            'Day 5: Improve UI & Feedback Animations',
            'Day 6: Testing & Edge-Case Validation',
            'Day 7: Deploy to Vercel & Present Portfolio',
          ],
        });
      }
    } else {
      // Default fallback
      setRecommendation({
        segment: 'Beginner AI Career Builder',
        recommended_project: 'AI Resume Assistant',
        difficulty: 'Beginner',
        estimated_days: 7,
        reason: 'This project aligns with your current knowledge and goal of building a portfolio project.',
        learning_path: [
          'Day 1: Project Setup',
          'Day 2: Build Form Interface',
          'Day 3: Connect AI API',
          'Day 4: Process AI Outputs',
          'Day 5: Polish UI',
          'Day 6: Edge Case Testing',
          'Day 7: Deploy to Production',
        ],
      });
    }
  }, []);

  const handleRegister = () => {
    router.push('/register');
  };

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center">
        <div className="text-center font-mono text-cyan-400">Loading AI Recommendation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        {/* Header Header */}
        <div className="text-center space-y-3">
          <Badge variant="cyan" className="px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Engine Match
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your Personalized AI Challenge
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Calculated based on your skill level, daily time availability, and career objectives.
          </p>
        </div>

        {/* Project Card Highlight */}
        <GlassCard glow className="p-8 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Segment: {recommendation.segment}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {recommendation.recommended_project}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={recommendation.difficulty === 'Beginner' ? 'cyan' : 'purple'}>
                Difficulty: {recommendation.difficulty}
              </Badge>
              <Badge variant="slate" className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {recommendation.estimated_days} Days
              </Badge>
              <Badge variant="emerald" className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> ~1 Hour/Day
              </Badge>
            </div>
          </div>

          {/* Reasoning */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Why This Project For You
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              &quot;{recommendation.reason}&quot;
            </p>
          </div>

          {/* Learning Path Stepper */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> 7-Day Structured Curriculum
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {recommendation.learning_path.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-slate-200 pt-0.5">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              ✓ Free access to scaffolding template &amp; daily reminders
            </div>
            <Button variant="glow" size="lg" onClick={handleRegister} className="w-full sm:w-auto font-extrabold text-slate-950">
              Register for the Challenge <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
