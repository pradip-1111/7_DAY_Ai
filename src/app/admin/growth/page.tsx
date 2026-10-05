'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { KPICard } from '@/components/ui/KPICard';
import { FunnelChart } from '@/components/ui/FunnelChart';
import { Badge } from '@/components/ui/Badge';
import { Toast } from '@/components/ui/Toast';
import {
  GrowthMetricsSummary,
  AIInsightsResponse,
  AnalyticsEvent,
  ExperimentStats,
} from '@/types/growth';
import { getLocalEvents } from '@/lib/storage/mock-db';
import { calculateGrowthMetrics } from '@/lib/experiments/ab-testing';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import {
  Users,
  Brain,
  Sparkles,
  Layers,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  RefreshCw,
  Zap,
  Filter,
  Lightbulb,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrowthAnalyticsPage() {
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  
  const [metrics, setMetrics] = useState<GrowthMetricsSummary | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [insights, setInsights] = useState<AIInsightsResponse | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadData = async () => {
    let events: AnalyticsEvent[] = [];

    if (dataMode === 'live' && isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data && data.length > 0) {
          events = data as AnalyticsEvent[];
        } else {
          events = getLocalEvents();
        }
      } catch {
        events = getLocalEvents();
      }
    } else {
      events = getLocalEvents();
    }

    // Filter by segment if selected
    if (segmentFilter !== 'all') {
      events = events.filter((e) => e.metadata?.segment === segmentFilter);
    }

    const calculated = calculateGrowthMetrics(events);
    setMetrics(calculated);
  };

  useEffect(() => {
    loadData();
  }, [dataMode, timeFilter, segmentFilter]);

  const handleGenerateInsights = async () => {
    if (!metrics) return;
    setLoadingInsights(true);

    try {
      const res = await fetch('/api/admin/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });

      const data: AIInsightsResponse = await res.json();
      setInsights(data);
      setToastMsg('✨ AI Growth Insights generated successfully!');
    } catch (err) {
      console.error('Insights fetch error:', err);
      setToastMsg('Failed to generate insights. Using cached model.');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center font-mono text-cyan-400">
        Loading Growth Analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <DemoModeBanner mode={dataMode} onToggleMode={setDataMode} onRefresh={loadData} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Page Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" className="px-2.5 py-0.5">Internal Growth Engine</Badge>
              <span className="text-xs text-slate-400 font-mono">Real-Time Funnel Analytics</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Growth Analytics Dashboard</h1>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(['7d', '30d', 'all'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    timeFilter === tf
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'All Time'}
                </button>
              ))}
            </div>

            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="all">All Segments</option>
              <option value="Beginner AI Career Builder">Beginner AI Career Builder</option>
              <option value="Intermediate App Builder">Intermediate App Builder</option>
              <option value="Advanced ML Engineer">Advanced ML Engineer</option>
              <option value="Career Seeker">Career Seeker</option>
              <option value="Portfolio Builder">Portfolio Builder</option>
              <option value="Hackathon Builder">Hackathon Builder</option>
            </select>
          </div>
        </div>

        {/* 1. TOP 8 KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Visitors"
            value={metrics.visitors.toLocaleString()}
            subtext="Landing page views"
            change={12.4}
            icon={Users}
            glow
          />
          <KPICard
            title="Quiz Starts"
            value={metrics.quizStarts.toLocaleString()}
            subtext={`${Math.round((metrics.quizStarts / metrics.visitors) * 100)}% of visitors`}
            change={8.2}
            icon={Brain}
          />
          <KPICard
            title="Quiz Completion Rate"
            value={`${metrics.quizCompletionRate}%`}
            subtext={`${metrics.quizCompletions} completed`}
            change={5.1}
            icon={Target}
          />
          <KPICard
            title="Total Registrations"
            value={metrics.registrations.toLocaleString()}
            subtext="Cohort members enrolled"
            change={16.8}
            icon={CheckCircle2}
            glow
          />
          <KPICard
            title="Reg. Conversion Rate"
            value={`${metrics.registrationConversionRate}%`}
            subtext="Visitor to Registration"
            change={3.4}
            icon={TrendingUp}
          />
          <KPICard
            title="Challenge Starts"
            value={metrics.challengeStarts.toLocaleString()}
            subtext={`${Math.round((metrics.challengeStarts / metrics.registrations) * 100)}% of reg.`}
            change={7.9}
            icon={Zap}
          />
          <KPICard
            title="Challenge Completion"
            value={`${metrics.challengeCompletionRate}%`}
            subtext={`${metrics.challengeCompletions} finished Day 7`}
            change={4.2}
            icon={Sparkles}
          />
          <KPICard
            title="Avg Time to Register"
            value={`${metrics.avgTimeToRegisterMinutes} min`}
            subtext="Quiz to registration speed"
            change={-1.2}
            icon={Clock}
          />
        </div>

        {/* 2. FUNNEL VISUALIZATION & LARGEST DROP-OFF ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" /> Conversion Funnel Visualization
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  End-to-end user journey tracking from visitor arrival to challenge completion
                </p>
              </div>
              <Badge variant="cyan" className="font-mono">8 Sequential Steps</Badge>
            </div>

            <FunnelChart steps={metrics.funnel} />
          </GlassCard>

          {/* DROP-OFF HIGHLIGHT CARD */}
          <GlassCard glow className="p-6 space-y-5 border-amber-500/40 bg-gradient-to-b from-[#130f1c] to-[#070a12]">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Primary Funnel Drop-off</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-2">
              <div className="text-xs text-amber-300 font-mono">
                {metrics.largestDropOff.fromStep} → {metrics.largestDropOff.toStep}
              </div>
              <div className="text-3xl font-extrabold font-mono text-amber-400">
                -{metrics.largestDropOff.dropOffRate}%
              </div>
              <p className="text-xs text-slate-300">
                {metrics.largestDropOff.usersLost.toLocaleString()} users dropped off at this stage.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> AI-Generated Hypothesis
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                &quot;{metrics.largestDropOff.aiHypothesis}&quot;
              </p>
              <span className="text-[10px] text-slate-500 block">
                * Formulated autonomously by AI growth model based on event delta analysis.
              </span>
            </div>
          </GlassCard>
        </div>

        {/* 3. A/B EXPERIMENTS SECTION & USER SEGMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A/B Testing Card */}
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" /> Active A/B Experiment: CTA Messaging
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Testing &quot;Start Learning&quot; (Control) vs &quot;Build My AI Project&quot; (Challenger)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.experimentStats.map((variantStat) => (
                <div
                  key={variantStat.variant}
                  className={`p-5 rounded-xl border transition-all ${
                    variantStat.variant === 'B'
                      ? 'bg-purple-950/30 border-purple-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={variantStat.variant === 'B' ? 'purple' : 'slate'}>
                      Variant {variantStat.variant}
                    </Badge>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {variantStat.status} ({variantStat.confidence}%)
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-base mb-1">&quot;{variantStat.ctaText}&quot;</h4>
                  <p className="text-xs text-slate-400 mb-4">{variantStat.label}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Visitors:</span>
                      <span className="font-mono text-slate-200">{variantStat.visitors.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registrations:</span>
                      <span className="font-mono text-slate-200">{variantStat.registrations.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/60">
                      <span className="font-semibold text-slate-300">Conversion Rate:</span>
                      <strong className="font-mono text-cyan-400 text-sm">
                        {variantStat.conversionRate}%
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Statistical Status: <strong>{metrics.experimentStats[0]?.status}</strong></span>
              <span className="text-purple-400 font-mono font-semibold">
                Variant B Lift: +
                {Math.round(
                  ((metrics.experimentStats[1]?.conversionRate - metrics.experimentStats[0]?.conversionRate) /
                    (metrics.experimentStats[0]?.conversionRate || 1)) *
                    100
                )}
                %
              </span>
            </div>
          </GlassCard>

          {/* User Segment Performance */}
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> User Segment Performance
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registration &amp; completion breakdown by persona
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {metrics.segmentPerformance.map((seg) => (
                <div
                  key={seg.segment}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-200">{seg.segment}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{seg.users} users identified</span>
                  </div>

                  <div className="flex items-center gap-6 text-right font-mono">
                    <div>
                      <div className="text-cyan-400 font-bold">{seg.registrationRate}%</div>
                      <div className="text-[10px] text-slate-500">Reg. Rate</div>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-bold">{seg.completionRate}%</div>
                      <div className="text-[10px] text-slate-500 font-sans">Completion</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 4. AI GROWTH INSIGHTS GENERATOR SECTION */}
        <GlassCard glow className="p-8 space-y-6 bg-gradient-to-b from-[#0b1428] to-[#070a12] border-cyan-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="cyan">Autonomous AI Agent</Badge>
                <span className="text-xs text-slate-400 font-mono">GPT Growth Analyst</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">AI Growth Insights &amp; Recommendations</h3>
            </div>

            <Button
              variant="glow"
              size="md"
              loading={loadingInsights}
              onClick={handleGenerateInsights}
              className="text-slate-950 font-extrabold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Generate Growth Insights
            </Button>
          </div>

          {insights ? (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Observations */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Data-Driven Observations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {insights.observations.map((obs, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hypotheses */}
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Formulated Hypotheses
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {insights.hypotheses.map((hyp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{hyp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Experiments & Next Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Recommended Experiments
                  </h4>
                  <div className="space-y-3 text-xs">
                    {insights.experiments.map((exp, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-100">{exp.title}</div>
                        <p className="text-slate-400">{exp.description}</p>
                        <div className="flex justify-between pt-1 text-[11px]">
                          <span className="text-emerald-400 font-mono">{exp.expectedImpact}</span>
                          <span className="text-slate-500">{exp.targetMetric}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Recommended Growth Actions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {insights.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold font-mono">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Brain className="w-10 h-10 text-cyan-500/40 mx-auto" />
              <p className="text-sm">Click &quot;Generate Growth Insights&quot; to synthesize real-time funnel observations, hypotheses, and next experiments using AI.</p>
            </div>
          )}
        </GlassCard>
      </main>

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </div>
  );
}
