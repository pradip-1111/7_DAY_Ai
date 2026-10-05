'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { getLocalEvents } from '@/lib/storage/mock-db';
import { calculateGrowthMetrics } from '@/lib/experiments/ab-testing';
import { GrowthMetricsSummary } from '@/types/growth';
import { Layers, Sparkles, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function AdminExperimentsPage() {
  const [metrics, setMetrics] = useState<GrowthMetricsSummary | null>(null);

  useEffect(() => {
    const events = getLocalEvents();
    setMetrics(calculateGrowthMetrics(events));
  }, []);

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <Badge variant="purple" className="mb-1">Experimentation Framework</Badge>
            <h1 className="text-3xl font-extrabold text-white">A/B Testing Experiments</h1>
          </div>
        </div>

        <GlassCard glow className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Experiment ID: cta_messaging_v1
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Landing Page Primary CTA Messaging</h2>
            </div>
            <Badge variant="emerald" className="flex items-center gap-1">
              <Play className="w-3.5 h-3.5 fill-current" /> Active &amp; Assigning
            </Badge>
          </div>

          <p className="text-sm text-slate-300">
            <strong>Hypothesis:</strong> Action-oriented, portfolio-focused CTA (&quot;Build My AI Project&quot;) produces higher intent and registration conversion than educational CTA (&quot;Start Learning&quot;).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {metrics.experimentStats.map((variant) => (
              <GlassCard key={variant.variant} className="p-6 space-y-4 bg-slate-900/90 border-slate-800">
                <div className="flex items-center justify-between">
                  <Badge variant={variant.variant === 'B' ? 'purple' : 'slate'}>
                    Variant {variant.variant}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    50% Traffic Split
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 uppercase font-mono">Button Text</span>
                  <div className="text-xl font-extrabold text-white">&quot;{variant.ctaText}&quot;</div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center font-mono">
                  <div className="p-2 rounded bg-slate-950">
                    <div className="text-xs text-slate-400">Visitors</div>
                    <div className="font-bold text-slate-200">{variant.visitors}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <div className="text-xs text-slate-400">Registrations</div>
                    <div className="font-bold text-slate-200">{variant.registrations}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <div className="text-xs text-slate-400">Conv. Rate</div>
                    <div className="font-bold text-cyan-400">{variant.conversionRate}%</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs text-purple-200">
            <span>Statistical Significance Confidence: <strong>{metrics.experimentStats[0]?.confidence}%</strong></span>
            <span className="font-mono text-cyan-400 font-bold">Recommended Winner: Variant B (+17.8% Lift)</span>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
