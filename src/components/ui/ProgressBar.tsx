import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  barColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercent = true,
  className,
  barColor = 'from-indigo-600 to-cyan-500',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-mono text-indigo-600">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 p-0.5 border border-slate-200 overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
