'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, BarChart3, Rocket, User, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getAssignedVariant } from '@/lib/analytics/tracker';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [variant, setVariant] = React.useState<string>('A');

  React.useEffect(() => {
    setVariant(getAssignedVariant());
  }, []);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                AI Growth Engine
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                7-Day Challenge
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Learn • Build • Launch</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {!isAdmin ? (
            <>
              <Link
                href="/"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/quiz"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/quiz'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Quiz
              </Link>
              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/dashboard' || pathname === '/challenge'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                My Challenge
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/admin/growth"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  pathname === '/admin/growth'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Growth Funnel
              </Link>
              <Link
                href="/admin/experiments"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  pathname === '/admin/experiments'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Layers className="w-4 h-4" /> A/B Testing
              </Link>
              <Link
                href="/admin/users"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  pathname === '/admin/users'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <User className="w-4 h-4" /> User Segments
              </Link>
            </>
          )}
        </nav>

        {/* Action Controls & Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Active Variant Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600" title="Assigned A/B CTA Experiment Variant">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            CTA Var: <strong className="text-indigo-600">{variant}</strong>
          </div>

          {/* Switch Mode Button */}
          {isAdmin ? (
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5 text-indigo-600" /> Student View
            </Link>
          ) : (
            <Link
              href="/admin/growth"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Growth Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
