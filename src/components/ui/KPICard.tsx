'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: number;
  icon: React.ElementType;
  glow?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  change,
  icon: Icon,
  glow = false,
}) => {
  return (
    <GlassCard glow={glow} className="flex flex-col justify-between p-5 bg-white border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold font-mono text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {subtext && <span className="text-slate-500 font-normal">{subtext}</span>}
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              change >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change >= 0 ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
