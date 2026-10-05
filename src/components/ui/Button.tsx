'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs hover:shadow-sm active:scale-[0.98]',
    glow:
      'bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 active:scale-[0.98]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs',
    accent:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </motion.button>
  );
};
