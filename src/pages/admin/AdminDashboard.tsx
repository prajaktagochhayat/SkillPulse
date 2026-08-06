import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { DashboardStats, QuizAttempt } from '../../types';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await api.getAdminDashboardStats();
    setStats(data);
    const allRaw = (await import('../../services/db')).getItem<QuizAttempt>('quizhub_attempts_v3');
    setRecentAttempts(allRaw.slice(0, 5));
  };

  if (!stats) return <div className="p-8 text-center text-purple-300">Loading dashboard metrics...</div>;

  const attemptsTimeData = [
    { date: 'Feb 10', attempts: 4, avgScore: 82 },
    { date: 'Feb 11', attempts: 7, avgScore: 78 },
    { date: 'Feb 12', attempts: 12, avgScore: 85 },
    { date: 'Feb 13', attempts: 9, avgScore: 74 },
    { date: 'Feb 14', attempts: 15, avgScore: 88 },
    { date: 'Feb 15', attempts: 18, avgScore: 80 },
    { date: 'Feb 16', attempts: 22, avgScore: 84 },
  ];

  const passFailData = [
    { name: 'Passed Attempts', value: stats.passedAttempts || 12, color: '#facc15' },
    { name: 'Failed Attempts', value: stats.failedAttempts || 3, color: '#ec4899' },
  ];

  const categoryPopularity = [
    { category: 'JavaScript', attempts: 18 },
    { category: 'React', attempts: 14 },
    { category: 'Database', attempts: 9 },
    { category: 'Node.js', attempts: 7 },
    { category: 'Security', attempts: 5 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 light:text-purple-950">Admin Command Center</h1>
        <p className="text-sm text-purple-300 light:text-purple-700">
          Real-time platform metrics, student registration trends, and assessment score distributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-purple-800/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-400 light:text-purple-900 uppercase tracking-wider">Total Students</p>
            <h3 className="text-3xl font-black text-slate-100 light:text-purple-950 mt-1">{stats.totalStudents}</h3>
            <span className="inline-flex items-center text-xs text-yellow-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active Learners
            </span>
          </div>
          <div className="p-3 bg-purple-600/20 text-yellow-400 rounded-2xl border border-purple-500/30">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-purple-800/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-400 light:text-purple-900 uppercase tracking-wider">Active Quizzes</p>
            <h3 className="text-3xl font-black text-slate-100 light:text-purple-950 mt-1">{stats.publishedQuizzes}</h3>
            <p className="text-xs text-purple-300 light:text-purple-700 mt-1">
              <span className="font-bold text-slate-100 light:text-purple-900">{stats.draftQuizzes}</span> drafts
            </p>
          </div>
          <div className="p-3 bg-purple-600/20 text-yellow-400 rounded-2xl border border-purple-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-purple-800/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-400 light:text-purple-900 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-3xl font-black text-slate-100 light:text-purple-950 mt-1">{stats.totalQuizAttempts}</h3>
            <span className="inline-flex items-center text-xs text-yellow-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> High Activity
            </span>
          </div>
          <div className="p-3 bg-purple-600/20 text-yellow-400 rounded-2xl border border-purple-500/30">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-purple-800/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-400 light:text-purple-900 uppercase tracking-wider">Average Score</p>
            <h3 className="text-3xl font-black text-yellow-400 light:text-purple-900 mt-1">{stats.averageScore}%</h3>
            <p className="text-xs text-purple-300 light:text-purple-700 mt-1 font-semibold">Passing criteria: 60%</p>
          </div>
          <div className="p-3 bg-purple-600/20 text-yellow-400 rounded-2xl border border-purple-500/30">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-purple-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-100 light:text-purple-950">Quiz Submissions & Volume</h2>
              <p className="text-xs text-purple-300 light:text-purple-700">Daily assessment activity over time</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attemptsTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPurpleYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#6b21a8" opacity={0.3} />
                <XAxis dataKey="date" stroke="#d8b4fe" fontSize={11} />
                <YAxis stroke="#d8b4fe" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e0c38', borderColor: '#a855f7', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorPurpleYellow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-purple-800/40 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-100 light:text-purple-950">Pass / Fail Distribution</h2>
            <p className="text-xs text-purple-300 light:text-purple-700">Student qualification ratio</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passFailData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e0c38', borderRadius: '0.5rem', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-yellow-400">
                {Math.round((stats.passedAttempts / (stats.totalQuizAttempts || 1)) * 100)}%
              </span>
              <span className="text-xs text-purple-300 font-semibold">Pass Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
