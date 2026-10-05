'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { UserProfile } from '@/types/growth';
import { getLocalProfiles } from '@/lib/storage/mock-db';
import { Users, GraduationCap, Calendar, CheckCircle2, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProfiles(getLocalProfiles());
  }, []);

  const filtered = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <Badge variant="cyan" className="mb-1">Cohort Members</Badge>
            <h1 className="text-3xl font-extrabold text-white">Registered Student Builders</h1>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, college, segment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 w-full sm:w-72"
            />
          </div>
        </div>

        <GlassCard className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono">
                <th className="p-4">Student Name</th>
                <th className="p-4">College</th>
                <th className="p-4">Graduation</th>
                <th className="p-4">Assigned Segment</th>
                <th className="p-4">Variant</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 30).map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-semibold text-white">
                    <div>{user.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                  </td>
                  <td className="p-4 text-slate-300">{user.college}</td>
                  <td className="p-4 font-mono text-slate-300">{user.graduation_year}</td>
                  <td className="p-4">
                    <Badge variant={user.segment.includes('Beginner') ? 'cyan' : 'purple'}>
                      {user.segment}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{user.experiment_variant}</td>
                  <td className="p-4 text-slate-400 font-mono">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </main>
    </div>
  );
}
