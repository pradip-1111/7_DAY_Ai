'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';
import { UserProfile, ChallengeTask, RecommendationResult } from '@/types/growth';
import { trackEvent } from '@/lib/analytics/tracker';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Trophy,
  Calendar,
  Check,
  Target,
  Flame,
} from 'lucide-react';

const INITIAL_TASKS: ChallengeTask[] = [
  {
    id: 'task_1',
    day_number: 1,
    title: 'Project Setup & Workspace',
    description: 'Set up your GitHub repository, initialize Next.js, and configure your API key environment variables.',
    estimated_minutes: 45,
    resources: ['https://nextjs.org/docs', 'https://platform.openai.com/docs'],
    completed: true,
  },
  {
    id: 'task_2',
    day_number: 2,
    title: 'Build the Form Interface',
    description: 'Design a clean, simple form to accept input data from users with clear validation instructions.',
    estimated_minutes: 60,
    resources: ['https://tailwindcss.com', 'https://lucide.dev'],
    completed: false,
  },
  {
    id: 'task_3',
    day_number: 3,
    title: 'Connect AI API Route',
    description: 'Create a server-side API route to send student inputs to OpenAI and retrieve generated output.',
    estimated_minutes: 60,
    resources: ['https://platform.openai.com/docs/api-reference'],
    completed: false,
  },
  {
    id: 'task_4',
    day_number: 4,
    title: 'Implement Core AI Response Handling',
    description: 'Format raw AI JSON outputs into clean, readable cards for the user.',
    estimated_minutes: 75,
    resources: ['https://sdk.vercel.ai/docs'],
    completed: false,
  },
  {
    id: 'task_5',
    day_number: 5,
    title: 'Polish Layout & Styling',
    description: 'Add smooth transitions, loading indicators, and clean card spacing for a great user experience.',
    estimated_minutes: 60,
    resources: ['https://framer.com/motion'],
    completed: false,
  },
  {
    id: 'task_6',
    day_number: 6,
    title: 'Test Edge Cases & Error Handling',
    description: 'Ensure graceful error messages when inputs are empty or API timeouts occur.',
    estimated_minutes: 45,
    resources: ['https://nextjs.org/docs/app/building-your-application/testing'],
    completed: false,
  },
  {
    id: 'task_7',
    day_number: 7,
    title: 'Deploy Live to Vercel & Share',
    description: 'Deploy your live web application to Vercel and showcase your project link on your resume and LinkedIn.',
    estimated_minutes: 60,
    resources: ['https://vercel.com/docs'],
    completed: false,
  },
];

export default function StudentDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<ChallengeTask[]>(INITIAL_TASKS);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load student profile
    const storedUser = sessionStorage.getItem('ai_growth_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    } else {
      setUser({
        id: 'usr_demo',
        name: 'Alex Chen',
        email: 'alex@stanford.edu',
        college: 'Stanford University',
        graduation_year: 2026,
        skill_level: 'Beginner',
        goal: 'Internship',
        segment: 'Beginner AI Career Builder',
        technologies: ['React', 'JavaScript'],
        experiment_variant: 'B',
        created_at: new Date().toISOString(),
      });
    }

    // Load recommendation
    const storedRec = sessionStorage.getItem('ai_growth_recommendation');
    if (storedRec) {
      try {
        setRecommendation(JSON.parse(storedRec));
      } catch {}
    }

    // Load saved task progress
    const savedProgress = localStorage.getItem('ai_growth_task_progress');
    if (savedProgress) {
      try {
        const parsed: Record<number, boolean> = JSON.parse(savedProgress);
        setTasks((prev) =>
          prev.map((t) => ({
            ...t,
            completed: parsed[t.day_number] !== undefined ? parsed[t.day_number] : t.completed,
          }))
        );
      } catch {}
    } else {
      trackEvent('challenge_started');
    }
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // Active today's task is the first uncompleted task
  const currentTask = tasks.find((t) => !t.completed) || tasks[tasks.length - 1];

  const handleToggleTask = (dayNumber: number) => {
    const updated = tasks.map((t) => {
      if (t.day_number === dayNumber) {
        const nowCompleted = !t.completed;
        if (nowCompleted) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
          });
          trackEvent('day_completed', user?.id, { day_number: dayNumber });
          setToastMsg(`🎉 Great job! Day ${dayNumber} task marked as complete.`);
        }
        return {
          ...t,
          completed: nowCompleted,
          completed_at: nowCompleted ? new Date().toISOString() : null,
        };
      }
      return t;
    });

    setTasks(updated);

    const progressMap: Record<number, boolean> = {};
    updated.forEach((t) => (progressMap[t.day_number] = !!t.completed));
    localStorage.setItem('ai_growth_task_progress', JSON.stringify(progressMap));

    if (updated.every((t) => t.completed)) {
      trackEvent('challenge_completed', user?.id);
      setToastMsg('🏆 Congratulations! You have finished all 7 days of your AI Builder Challenge!');
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }
  };

  const projectTitle = recommendation?.recommended_project || 'AI Resume Assistant';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* 1. WELCOME & SIMPLE SUMMARY BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-semibold border border-cyan-800/60">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Active Student Cohort
              </span>
              <span className="text-xs text-slate-400 font-mono">{user?.college || 'Stanford University'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Builder'}! 👋
            </h1>
            <p className="text-sm text-slate-300">
              You are building: <strong className="text-cyan-400 font-semibold">{projectTitle}</strong>
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 min-w-[220px] text-center space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">7-Day Challenge Progress</div>
            <div className="text-3xl font-extrabold font-mono text-cyan-400">
              Day {completedCount < 7 ? completedCount + 1 : 7} <span className="text-xs font-normal text-slate-400">/ 7 Days</span>
            </div>
            <ProgressBar progress={progressPercent} showPercent className="pt-1" />
          </div>
        </div>

        {/* 2. TODAY'S FOCUSED TASK - Simple & Clear */}
        {currentTask && (
          <GlassCard glow className="p-6 sm:p-8 space-y-6 border-cyan-500/30 bg-[#0c1222]/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg">
                  {currentTask.day_number}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Today&apos;s Target Task
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{currentTask.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{currentTask.estimated_minutes} minutes needed
                </span>
              </div>
            </div>

            {/* Clear Description & Simple Instructions */}
            <div className="space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed font-normal">
                {currentTask.description}
              </p>

              {/* Simple Step-by-Step checklist for today */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What to complete today:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Review the starter guide and instructions below.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Write code in your local project repository.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Click the &quot;Mark as Done ✓&quot; button when finished.</span>
                  </li>
                </ul>
              </div>

              {/* Helpful Resources */}
              {currentTask.resources && currentTask.resources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recommended Reading &amp; Scaffolding Guides:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTask.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 text-xs flex items-center gap-1.5 transition-all font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {res.replace('https://', '')}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Finishing tasks keeps your portfolio on track for completion!
              </span>
              <Button
                variant={currentTask.completed ? 'secondary' : 'glow'}
                size="md"
                onClick={() => handleToggleTask(currentTask.day_number)}
                className={currentTask.completed ? 'text-emerald-400 font-semibold' : 'text-slate-950 font-extrabold px-6'}
              >
                {currentTask.completed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed for Today
                  </span>
                ) : (
                  <span>Mark as Done ✓</span>
                )}
              </Button>
            </div>
          </GlassCard>
        )}

        {/* 3. SIMPLE 7-DAY SCHEDULE CHECKLIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Your 7-Day Roadmap</h3>
              <p className="text-xs text-slate-400">Click any day to check off completed milestones</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {completedCount} of 7 Finished ({progressPercent}%)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.day_number)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-900/40 border-emerald-900/40 text-slate-400'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400 transition-colors" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                        Day {task.day_number}
                      </span>
                      <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    ~{task.estimated_minutes} min
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                      task.completed
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {task.completed ? 'Done ✓' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </div>
  );
}
