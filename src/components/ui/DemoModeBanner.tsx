'use client';

import React from 'react';
import { RefreshCw, Database, Check } from 'lucide-react';
import { resetDemoSeed } from '@/lib/storage/mock-db';

interface DemoModeBannerProps {
  mode: 'demo' | 'live';
  onToggleMode: (newMode: 'demo' | 'live') => void;
  onRefresh?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  mode,
  onToggleMode,
  onRefresh,
}) => {
  const [resetting, setResetting] = React.useState(false);

  const handleReset = () => {
    setResetting(true);
    resetDemoSeed();
    setTimeout(() => {
      setResetting(false);
      if (onRefresh) onRefresh();
    }, 400);
  };

  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-700">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white text-indigo-700 border border-slate-200 font-medium shadow-2xs">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>Data Source:</span>
          <strong className={mode === 'demo' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
            {mode === 'demo' ? 'Demo Data (Cohort N=1,000)' : 'Live Supabase Data'}
          </strong>
        </div>
        <span className="text-slate-500 hidden sm:inline">
          {mode === 'demo'
            ? 'Simulated student cohort for growth experiment evaluation'
            : 'Real-time production database queries'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Mode Button */}
        <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          <button
            onClick={() => onToggleMode('demo')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
              mode === 'demo'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {mode === 'demo' && <Check className="w-3 h-3 text-amber-600" />} Demo Data
          </button>
          <button
            onClick={() => onToggleMode('live')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
              mode === 'live'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {mode === 'live' && <Check className="w-3 h-3 text-emerald-600" />} Live Data
          </button>
        </div>

        {mode === 'demo' && (
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs font-medium"
            title="Re-seed 1000 visitors, quiz completions, and A/B test data"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin text-indigo-600' : ''}`} />
            Reset Seed
          </button>
        )}
      </div>
    </div>
  );
};
