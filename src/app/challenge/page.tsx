'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, BookOpen, Clock, Code2, Rocket, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ChallengeDetailsPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
          </Link>
          <Badge variant="cyan">7-Day Curriculum</Badge>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-white">7-Day AI Builder Challenge Curriculum</h1>
          <p className="text-slate-400 text-sm">
            Complete curriculum specification with architecture guidelines, task deliverables, and recommended tools.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              day: 1,
              title: 'Project Setup & Architecture',
              desc: 'Initialize Next.js 15 App Router codebase, configure TypeScript strict mode, install Tailwind CSS, and set up environment variable credentials.',
              time: '45 mins',
              output: 'Configured GitHub Repository & Clean Scaffold',
            },
            {
              day: 2,
              title: 'Build the Input Interface',
              desc: 'Design responsive UI components for receiving user inputs with real-time field validation.',
              time: '60 mins',
              output: 'Interactive Input Form Component',
            },
            {
              day: 3,
              title: 'Connect AI API Route',
              desc: 'Implement server-side API endpoints (`/api/ai/...`) connecting to OpenAI models with custom prompt schemas.',
              time: '60 mins',
              output: 'Tested Serverless AI Endpoint',
            },
            {
              day: 4,
              title: 'Implement Core AI Processing',
              desc: 'Parse model output payloads into structured JSON, handle edge cases, timeouts, and streaming responses.',
              time: '75 mins',
              output: 'Validated AI Data Transformation Layer',
            },
            {
              day: 5,
              title: 'Polish UI & User Experience',
              desc: 'Add micro-animations, glassmorphism card styling, responsive layouts, and loading skeleton fallbacks.',
              time: '60 mins',
              output: 'Production-grade UI/UX Design System',
            },
            {
              day: 6,
              title: 'Testing & Edge-Case Handling',
              desc: 'Test rate limits, invalid user inputs, fallback recommendations, and write unit tests for core logic.',
              time: '45 mins',
              output: 'Comprehensive Test Suite & Fallback Layer',
            },
            {
              day: 7,
              title: 'Portfolio Presentation & Deploy',
              desc: 'Deploy the application to Vercel, record a 60-second video demo walkthrough, and share it on social media.',
              time: '60 mins',
              output: 'Live Public Deployment URL & Portfolio Video',
            },
          ].map((item) => (
            <GlassCard key={item.day} className="p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-cyan-800">
                    D{item.day}
                  </div>
                  <h3 className="font-bold text-lg text-white">{item.title}</h3>
                </div>
                <Badge variant="slate" className="font-mono">
                  <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" /> {item.time}
                </Badge>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>

              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deliverable: {item.output}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
