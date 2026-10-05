'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { QuizSubmission, SkillLevel, UserGoal } from '@/types/growth';
import { trackEvent } from '@/lib/analytics/tracker';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2, Brain } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [quizData, setQuizData] = useState<QuizSubmission>({
    skill_level: 'Beginner',
    interest: 'AI Chatbot',
    daily_time: '30–60 minutes',
    goal: 'Internship',
    technologies: ['JavaScript', 'React'],
  });

  useEffect(() => {
    trackEvent('quiz_started');
  }, []);

  const totalSteps = 5;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit quiz & fetch AI recommendation
      setLoading(true);
      trackEvent('quiz_completed', null, {
        skill_level: quizData.skill_level,
        interest: quizData.interest,
        goal: quizData.goal,
      });

      // Save quiz to session
      sessionStorage.setItem('ai_growth_quiz_answers', JSON.stringify(quizData));

      try {
        const res = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        });

        const recData = await res.json();
        sessionStorage.setItem('ai_growth_recommendation', JSON.stringify(recData));
        router.push('/recommendation');
      } catch (err) {
        console.error('Quiz recommendation fetch error:', err);
        router.push('/recommendation');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleTech = (tech: string) => {
    setQuizData((prev) => {
      const exists = prev.technologies.includes(tech);
      const updated = exists
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech];
      return { ...prev, technologies: updated };
    });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Top Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="font-mono text-slate-400">{Math.round(progressPercent)}% Completed</span>
            </div>
            <ProgressBar progress={progressPercent} showPercent={false} />
          </div>

          <GlassCard glow className="p-6 sm:p-10 min-h-[420px] flex flex-col justify-between relative">
            <AnimatePresence mode="wait">
              {/* QUESTION 1 */}
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="cyan" className="mb-2">Technical Baseline</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">What is your current technical level?</h2>
                    <p className="text-sm text-slate-400 mt-1">We will tailor code complexity and scaffolding to match.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { level: 'Beginner', desc: 'New to coding or building basic scripts (HTML/JS/Python basics).' },
                      { level: 'Intermediate', desc: 'Comfortable with web frameworks (React, Next.js, Node.js, Python).' },
                      { level: 'Advanced', desc: 'Experienced developer building full-stack apps or ML pipelines.' },
                    ].map((opt) => (
                      <button
                        key={opt.level}
                        onClick={() => setQuizData({ ...quizData, skill_level: opt.level as SkillLevel })}
                        className={`p-4 rounded-xl text-left border transition-all flex items-start justify-between ${
                          quizData.skill_level === opt.level
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-base">{opt.level}</div>
                          <div className="text-xs text-slate-400 mt-1">{opt.desc}</div>
                        </div>
                        {quizData.skill_level === opt.level && (
                          <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUESTION 2 */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="purple" className="mb-2">Project Interest</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">What would you like to build?</h2>
                    <p className="text-sm text-slate-400 mt-1">Select the domain that excites you most for your portfolio.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'AI Chatbot',
                      'AI Website',
                      'AI Automation',
                      'Computer Vision',
                      'Machine Learning Project',
                    ].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => setQuizData({ ...quizData, interest })}
                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                          quizData.interest === interest
                            ? 'bg-purple-950/60 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-sm">{interest}</span>
                        {quizData.interest === interest && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUESTION 3 */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="emerald" className="mb-2">Time Commitment</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">How much time can you spend per day?</h2>
                    <p className="text-sm text-slate-400 mt-1">Our 7-day schedule adjusts task depth to your schedule.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      'Less than 30 minutes',
                      '30–60 minutes',
                      '1–2 hours',
                      '2+ hours',
                    ].map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuizData({ ...quizData, daily_time: t })}
                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                          quizData.daily_time === t
                            ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-sm">{t}</span>
                        {quizData.daily_time === t && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUESTION 4 */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="amber" className="mb-2">Primary Goal</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">What is your main goal?</h2>
                    <p className="text-sm text-slate-400 mt-1">We frame project deliverables around your career objective.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { goal: 'Internship', desc: 'Building resume proof for summer software roles' },
                      { goal: 'Job', desc: 'Preparing full-stack demo for entry-level hiring' },
                      { goal: 'Portfolio', desc: 'Creating a polished Github & live web project' },
                      { goal: 'Learning', desc: 'Mastering hands-on AI & LLM development' },
                      { goal: 'Hackathon', desc: 'Prepping rapid prototype skills for hackathons' },
                    ].map((item) => (
                      <button
                        key={item.goal}
                        onClick={() => setQuizData({ ...quizData, goal: item.goal as UserGoal })}
                        className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          quizData.goal === item.goal
                            ? 'bg-amber-950/60 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm">{item.goal}</span>
                          {quizData.goal === item.goal && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                        <span className="text-xs text-slate-400 mt-1">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUESTION 5 */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="cyan" className="mb-2">Tech Stack Familiarity</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Which technologies have you used?</h2>
                    <p className="text-sm text-slate-400 mt-1">Select all tools you have worked with (select multiple).</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      'Python',
                      'JavaScript',
                      'React',
                      'Next.js',
                      'Node.js',
                      'HTML/CSS',
                      'PyTorch',
                      'OpenAI API',
                      'SQL',
                    ].map((tech) => {
                      const selected = quizData.technologies.includes(tech);
                      return (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`p-3 rounded-xl text-center border font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                            selected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {tech}
                          {selected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="pt-8 flex items-center justify-between border-t border-slate-800/80 mt-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="text-slate-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>

              <Button
                variant="glow"
                onClick={handleNext}
                loading={loading}
                className="text-slate-950 font-bold"
              >
                {loading ? (
                  <span>Generating AI Recommendation...</span>
                ) : currentStep === totalSteps - 1 ? (
                  <span>Complete Quiz &amp; View Result</span>
                ) : (
                  <span className="flex items-center gap-1">Next Question <ArrowRight className="w-4 h-4 ml-1" /></span>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
