'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Brain,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronDown,
  Terminal,
  Trophy,
  Zap,
} from 'lucide-react';
import { trackEvent, getAssignedVariant } from '@/lib/analytics/tracker';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [variant, setVariant] = useState<string>('A');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const assigned = getAssignedVariant();
    setVariant(assigned);

    trackEvent('page_view');
    trackEvent('experiment_exposure', null, {
      experiment: 'cta_messaging_v1',
      variant: assigned,
    });
  }, []);

  const handleCtaClick = () => {
    trackEvent('cta_clicked', null, {
      cta_location: 'hero',
      variant,
    });
    router.push('/quiz');
  };

  const ctaText = variant === 'B' ? 'Build My AI Project' : 'Start Learning';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>7-Day AI Builder Challenge • Student Cohort 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Build Your First AI Project in 7 Days
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal"
            >
              Learn by building. Get a personalized AI project path based on your skills, goals, and available time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Button
                variant="glow"
                size="lg"
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-md"
              >
                {ctaText} <ArrowRight className="w-5 h-5 ml-1" />
              </Button>

              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3.5 text-base">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Metrics */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-600 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1,000+ Students Enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Free &amp; Open Scaffolding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Portfolio-Ready Deliverable</span>
              </div>
            </div>
          </div>

          {/* Clean Code Preview Box */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 max-w-3xl mx-auto"
          >
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 text-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-400">student-challenge / day-01-setup.ts</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-semibold">
                  Day 1 Active
                </span>
              </div>

              <div className="mt-4 font-mono text-xs sm:text-sm text-slate-300 space-y-2 overflow-x-auto leading-relaxed">
                <p className="text-purple-400">
                  import <span className="text-cyan-300">{`{ generateStudentRecommendation }`}</span> from <span className="text-emerald-300">&apos;@ai-growth/core&apos;</span>;
                </p>
                <p className="text-slate-500">// Personalizing 7-day student curriculum</p>
                <p>
                  <span className="text-cyan-400">const</span> studentProfile = &#123;
                </p>
                <p className="pl-4">
                  skillLevel: <span className="text-amber-300">&apos;Intermediate&apos;</span>,
                </p>
                <p className="pl-4">
                  goal: <span className="text-amber-300">&apos;Internship Portfolio&apos;</span>,
                </p>
                <p className="pl-4">
                  dailyTime: <span className="text-amber-300">&apos;1 Hour/Day&apos;</span>,
                </p>
                <p>&#125;;</p>
                <p className="text-emerald-400 pt-2">
                  ✓ Matches &quot;AI Resume &amp; Portfolio Assistant&quot; (7 Days)
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 7-DAY TIMELINE */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="cyan" className="mb-2">The 7-Day Journey</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From Concept to Deployed AI Project
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              7 Days → 7 Focused Daily Tasks → 1 AI Project → Resume &amp; Portfolio Ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { step: '01', day: 'Day 1-2', title: 'Quiz & Setup', desc: 'Take the AI quiz and initialize your repository with pre-configured API scaffolding.' },
              { step: '02', day: 'Day 3-4', title: 'AI Integration', desc: 'Connect OpenAI model API routes, write prompts, and handle dynamic JSON responses.' },
              { step: '03', day: 'Day 5-6', title: 'UI Polish', desc: 'Design clean responsive layouts, test edge cases, and add error handling.' },
              { step: '04', day: 'Day 7', title: 'Vercel Launch', desc: 'Deploy your project live to Vercel and showcase your demo link on your resume.' },
            ].map((item) => (
              <GlassCard key={item.step} className="p-6 bg-white border-slate-200">
                <div className="text-2xl font-mono font-extrabold text-indigo-600 mb-1">{item.step}</div>
                <Badge variant="slate" className="mb-2">{item.day}</Badge>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* BENEFIT HIGHLIGHTS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-7 bg-white">
              <Brain className="w-9 h-9 text-indigo-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Curriculum</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                No generic videos. Our AI personalization quiz evaluates your exact skill baseline and time commitment to tailor the project path.
              </p>
            </GlassCard>

            <GlassCard className="p-7 bg-white">
              <Terminal className="w-9 h-9 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Modern Production Stack</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Build with the exact tech stack top tech companies use: Next.js 15, TypeScript, Tailwind CSS, Supabase, and OpenAI.
              </p>
            </GlassCard>

            <GlassCard className="p-7 bg-white">
              <Trophy className="w-9 h-9 text-emerald-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Internship &amp; Hiring Proof</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Stand out in software engineering interviews with a live deployed project and concrete metrics.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* EXAMPLE PROJECTS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">What Will You Build?</h2>
            <p className="text-slate-600 text-sm mt-1">Matched dynamically during your 60-second quiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'AI Resume Assistant', level: 'Beginner', desc: 'Parses resumes and tailors candidate bullet points for specific job descriptions.' },
              { title: 'Autonomous Agent Workflow', level: 'Intermediate', desc: 'Executes multi-step task automation loops with API function calling.' },
              { title: 'Full-Stack RAG Knowledge Bot', level: 'Advanced', desc: 'Semantic search assistant for querying personal PDF notes and docs.' },
              { title: 'Multimodal AI Creative Studio', level: 'Intermediate', desc: 'Generates marketing images, copy, and social media posts instantly.' },
            ].map((proj) => (
              <GlassCard key={proj.title} className="p-5 flex flex-col justify-between bg-white">
                <div>
                  <Badge variant={proj.level === 'Beginner' ? 'cyan' : proj.level === 'Intermediate' ? 'purple' : 'emerald'} className="mb-2">
                    {proj.level}
                  </Badge>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{proj.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">{proj.desc}</p>
                </div>
                <span className="text-[11px] font-mono text-indigo-600 font-medium">7 Days • Portfolio Ready</span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Is the 7-Day AI Builder Challenge free?', a: 'Yes! The campaign is 100% free for college students and early-career learners.' },
              { q: 'What if I have limited coding experience?', a: 'Our quiz detects your exact background and assigns beginner-friendly projects with pre-built scaffolding.' },
              { q: 'How much time do I need per day?', a: 'You can finish daily tasks in roughly 30 to 60 minutes.' },
              { q: 'Do I need a paid OpenAI account?', a: 'We include a free demo tier so you can test locally without needing your own paid key.' },
            ].map((faq, index) => (
              <div key={index} className="rounded-xl bg-white border border-slate-200 p-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between font-semibold text-left text-slate-900 text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-indigo-600 rounded-3xl p-8 sm:p-10 text-center text-white shadow-xl space-y-4">
            <h2 className="text-3xl font-extrabold">Ready to Build Your AI Project?</h2>
            <p className="text-indigo-100 max-w-xl mx-auto text-sm">
              Take the 60-second quiz to unlock your personalized AI project path and join over 1,000 student builders.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="lg" onClick={handleCtaClick} className="bg-white text-indigo-700 hover:bg-slate-100 border-none font-extrabold px-8">
                {ctaText} <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 AI Growth Engine — 7-Day AI Builder Challenge. Built for Growth Engineering &amp; AI Portfolio Demonstration.</p>
      </footer>
    </div>
  );
}
