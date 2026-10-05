'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { SkillLevel, UserGoal, SegmentName, UserProfile, RecommendationResult } from '@/types/growth';
import { trackEvent, getAssignedVariant } from '@/lib/analytics/tracker';
import { saveLocalProfile } from '@/lib/storage/mock-db';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [variant, setVariant] = useState<string>('A');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    graduation_year: 2026,
    skill_level: 'Beginner' as SkillLevel,
    goal: 'Internship' as UserGoal,
  });

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    const assignedVariant = getAssignedVariant();
    setVariant(assignedVariant);

    trackEvent('registration_started');

    // Load recommendation from session if available
    const storedRec = sessionStorage.getItem('ai_growth_recommendation');
    if (storedRec) {
      try {
        const parsed: RecommendationResult = JSON.parse(storedRec);
        setRecommendation(parsed);
        setFormData((prev) => ({
          ...prev,
          skill_level: parsed.difficulty as SkillLevel,
        }));
      } catch {}
    }
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid university email is required';
    if (!formData.college.trim()) errs.college = 'College/University name is required';
    if (!formData.graduation_year || formData.graduation_year < 2024 || formData.graduation_year > 2030) {
      errs.graduation_year = 'Valid graduation year (2024-2030) required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const recToSave: RecommendationResult = recommendation || {
      segment: 'Beginner AI Career Builder',
      recommended_project: 'AI Resume Assistant',
      difficulty: 'Beginner',
      estimated_days: 7,
      reason: 'Matched based on beginner experience and internship portfolio goal.',
      learning_path: [
        'Day 1: Project Setup',
        'Day 2: Build Form Interface',
        'Day 3: Connect AI API',
        'Day 4: Process AI Outputs',
        'Day 5: Polish UI',
        'Day 6: Edge Case Testing',
        'Day 7: Deploy to Production',
      ],
    };

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const userProfile: UserProfile = {
      id: userId,
      name: formData.name,
      email: formData.email,
      college: formData.college,
      graduation_year: Number(formData.graduation_year),
      skill_level: formData.skill_level,
      goal: formData.goal,
      segment: recToSave.segment,
      technologies: ['React', 'TypeScript', 'OpenAI'],
      experiment_variant: variant,
      created_at: new Date().toISOString(),
    };

    // Save locally
    saveLocalProfile(userProfile);
    sessionStorage.setItem('ai_growth_current_user', JSON.stringify(userProfile));

    // Track event
    trackEvent('registration_completed', userId, {
      segment: userProfile.segment,
      college: userProfile.college,
      goal: userProfile.goal,
    });

    // Post to registration API endpoint (which handles Supabase and n8n webhook)
    try {
      await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          recommendation: recToSave,
        }),
      });
    } catch (err) {
      console.warn('Registration API route warning:', err);
    }

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="purple">Cohort Registration</Badge>
            <h1 className="text-3xl font-extrabold text-white">Join the 7-Day Challenge</h1>
            <p className="text-slate-400 text-sm">
              Lock in your personalized AI project and receive daily scaffolding instructions.
            </p>
          </div>

          <GlassCard glow className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-all"
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> University / Work Email
                </label>
                <input
                  type="email"
                  placeholder="alex@stanford.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-all"
                />
                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
              </div>

              {/* College & Grad Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> College / University
                  </label>
                  <input
                    type="text"
                    placeholder="Stanford University"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm transition-all"
                  />
                  {errors.college && <p className="text-xs text-rose-400 mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Graduation Year
                  </label>
                  <select
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm transition-all"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Goal & Skill Level Display */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Project:</span>
                  <strong className="text-cyan-400">
                    {recommendation?.recommended_project || 'AI Resume Assistant'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Segment:</span>
                  <span className="text-purple-400 font-mono">
                    {recommendation?.segment || 'Beginner AI Career Builder'}
                  </span>
                </div>
              </div>

              <Button variant="glow" size="lg" loading={loading} type="submit" className="w-full text-slate-950 font-extrabold">
                Confirm Registration &amp; Start Challenge <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </form>
            <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free • No Credit Card Required</span>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}


