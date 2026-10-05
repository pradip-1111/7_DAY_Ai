'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = false,
  className,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow overflow-hidden',
        glow && 'border-indigo-200 ring-1 ring-indigo-500/10 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
