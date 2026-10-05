'use client';

import React from 'react';
import { FunnelStepData } from '@/types/growth';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FunnelChartProps {
  steps: FunnelStepData[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ steps }) => {
  const maxUsers = steps[0]?.users || 1;

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const widthPercent = Math.max(15, (step.users / maxUsers) * 100);

        return (
          <div key={step.name} className="relative group">
            {/* Step Container */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
              
              {/* Title & Step Badge */}
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className="w-7 h-7 rounded-lg bg-white text-slate-700 font-mono font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {step.step}
                    {step.isLargestDropOff && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Largest Drop-off
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {step.users.toLocaleString()} users ({step.overallConversion}% of total)
                  </p>
                </div>
              </div>

              {/* Visual Funnel Bar */}
              <div className="flex-1 mx-0 sm:mx-4">
                <div className="w-full bg-slate-200/70 rounded-lg h-7 p-1 border border-slate-200 relative overflow-hidden flex items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                    className={`h-full rounded-md ${
                      step.isLargestDropOff
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-indigo-600 to-cyan-500'
                    }`}
                  />
                  <span className="absolute right-3 text-xs font-mono font-bold text-slate-700">
                    {step.users.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Conversion & Drop-off Stats */}
              <div className="flex items-center gap-4 text-right min-w-[160px] justify-end">
                {index > 0 ? (
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-indigo-600">
                      {step.conversionRate}% conv.
                    </div>
                    <div className="text-[11px] font-mono text-rose-600 flex items-center justify-end gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -{step.dropOffRate}% drop ({step.dropOffCount})
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-500 font-medium">Top of Funnel</span>
                )}
              </div>
            </div>

            {/* Drop-off Warning Connector */}
            {step.isLargestDropOff && (
              <div className="my-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Primary Bottleneck:</strong> High drop-off rate of <strong>{step.dropOffRate}%</strong> between {steps[index - 1]?.step} and {step.step} ({step.dropOffCount} users lost).
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
