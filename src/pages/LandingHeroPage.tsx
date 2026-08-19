import React, { useState } from 'react';
import { BookOpen, Gamepad2, ShieldCheck, Trophy, Sparkles, ArrowRight, Zap, CheckCircle2, Lock, Star } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import { api } from '../services/api';
import type { QuizAttempt } from '../types';

interface LandingHeroPageProps {
  onOpenAuth: () => void;
}

export const LandingHeroPage: React.FC<LandingHeroPageProps> = ({ onOpenAuth }) => {
  const [certCode, setCertCode] = useState('');
  const [certResult, setCertResult] = useState<QuizAttempt | null>(null);
  const [verifyErr, setVerifyErr] = useState('');

  const handleVerifyCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;
    setVerifyErr('');
    const res = await api.verifyCertificate(certCode);
    if (res) {
      setCertResult(res);
    } else {
      setVerifyErr('Certificate ID not found. Please verify the credentials.');
      setCertResult(null);
    }
  };

  const featureSubjects = [
    { title: 'Python Programming', desc: 'Core OOP, Decorators, NumPy, Pandas & FastAPI', icon: '🐍' },
    { title: 'C++ Systems', desc: 'OOP, STL Containers, Pointers & Moves', icon: '⚙️' },
    { title: 'Java Core', desc: 'Multithreading, JVM Memory & Spring Boot', icon: '☕' },
    { title: 'SQL & NoSQL', desc: 'JOINs, B-Tree Indexes & MongoDB Pipelines', icon: '🗄️' },
    { title: 'Machine Learning & AI', desc: 'Scikit-Learn, PyTorch & Transformers', icon: '🤖' },
    { title: 'Cyber Security', desc: 'OWASP Top 10, SQLi, XSS & Firewalls', icon: '🛡️' },
  ];

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto py-4">
      {/* Main Hero Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-2 badge-purple px-4 py-1.5 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ENGINEERING & TECHNOLOGY ASSESSMENT PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Master Technical Skills with Interactive Learning Tracks
          </h1>

          <p className="text-sm sm:text-base text-purple-100 font-bold leading-relaxed">
            SkillPulse empowers engineering scholars with 18 comprehensive technical subjects, 144 detailed chapter overviews with code snippets, non-MCQ arcade mini-games, real-time Supabase sync, and verifiable digital certificates.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenAuth}
              className="btn-yellow-pastel px-8 py-3.5 rounded-2xl text-sm font-black inline-flex items-center space-x-2 shadow-xl hover:scale-105 transition transform"
            >
              <span>Get Started / Register Account</span>
              <ArrowRight className="w-4 h-4 text-amber-900" />
            </button>

            <button
              onClick={onOpenAuth}
              className="px-8 py-3.5 rounded-2xl glass-card-sub text-sm font-black text-white inline-flex items-center space-x-2 hover:bg-white/10 transition"
            >
              <Lock className="w-4 h-4 text-purple-300" />
              <span>Sign In to Student or Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-3 border border-purple-300/30">
          <div className="w-12 h-12 rounded-2xl badge-purple flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-900" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-slate-100 text-base profile-name-text">18 Technology Tracks</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            Full curriculum covering Python, C++, Java, React, SQL, AI, Cloud DevOps, and Cyber Security.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 border border-purple-300/30">
          <div className="w-12 h-12 rounded-2xl badge-yellow flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-amber-900" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-slate-100 text-base profile-name-text">Non-MCQ Arcade Games</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            Code Line Unscrambler puzzles and Tech Term Word Finder matrices to earn XP and level up.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 border border-purple-300/30">
          <div className="w-12 h-12 rounded-2xl badge-sage flex items-center justify-center">
            <Trophy className="w-6 h-6 text-emerald-900" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-slate-100 text-base profile-name-text">Global Leaderboard</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            Real-time academic rankings, XP points, and streak tracking for engineering scholars.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-3 border border-purple-300/30">
          <div className="w-12 h-12 rounded-2xl badge-purple flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-purple-900" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-slate-100 text-base profile-name-text">Digital Credentials</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            Verifiable PDF certificates equipped with unique QR ID codes for official validation.
          </p>
        </div>
      </div>

      {/* Universal Certificate Verification Lookup Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-300/30 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl badge-yellow">
            <ShieldCheck className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 profile-name-text">
              Universal Certificate Verification Tool
            </h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Verify the authenticity of any SkillPulse completion certificate code instantly.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyCert} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g. QZ-ATT101-998)"
            value={certCode}
            onChange={(e) => setCertCode(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 font-black focus:outline-none focus:border-amber-400 border border-purple-300/40 uppercase tracking-widest text-center sm:text-left"
          />
          <button type="submit" className="w-full sm:w-auto btn-yellow-pastel px-6 py-3 rounded-2xl text-xs font-black shadow">
            Verify Credential
          </button>
        </form>

        {verifyErr && (
          <p className="text-xs font-black text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
            {verifyErr}
          </p>
        )}

        {certResult && (
          <div className="p-4 rounded-2xl badge-sage border border-emerald-400 text-xs font-black space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-black uppercase text-[10px]">100% VERIFIED AUTHENTIC CERTIFICATE</span>
              <span className="text-emerald-900 font-mono">{certResult.certificateId}</span>
            </div>
            <p className="text-sm font-black text-slate-900">{certResult.quizTitle}</p>
            <p className="text-xs text-slate-800 font-bold">Issued to: <span className="profile-name-text">{certResult.userName}</span> ({certResult.percentage}% Score)</p>
          </div>
        )}
      </div>

      {/* Featured Subject Curriculum Showcase */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 profile-name-text">
            Explore 18 Core Engineering Subject Domains
          </h2>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Click Sign In or Register to access all 144 subject chapters, study notes, and assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureSubjects.map((sub, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl space-y-3 border border-purple-300/30 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-3xl">{sub.icon}</div>
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base profile-name-text">{sub.title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{sub.desc}</p>
              </div>

              <div className="pt-3 border-t border-purple-300/20 flex items-center justify-between">
                <span className="badge-purple px-2.5 py-0.5 rounded text-[10px] font-black">8 CHAPTERS</span>
                <button onClick={onOpenAuth} className="text-xs font-black text-amber-600 dark:text-yellow-400 hover:underline flex items-center space-x-1">
                  <span>Sign In to Study</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
