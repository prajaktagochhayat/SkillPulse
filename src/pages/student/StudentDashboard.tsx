import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { QuizAttempt, StudentStats, Quiz } from '../../types';
import { Award, BookOpen, Trophy, ArrowRight, Clock, Target, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface StudentDashboardProps {
  onSelectQuiz: (quizId: string) => void;
  onViewResult: (attemptId: string) => void;
  onNavigateToDiscovery: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectQuiz,
  onViewResult,
  onNavigateToDiscovery,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    const s = await api.getStudentStats(user.id);
    setStats(s);

    const attempts = await api.getAttemptsByUserId(user.id);
    setRecentAttempts(attempts.slice(0, 5));

    const quizzes = await api.getQuizzes('STUDENT');
    setRecommendedQuizzes(quizzes.slice(0, 4));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="badge-yellow px-3 py-1 rounded-full text-xs font-black">
              Level {stats?.xpPoints ? Math.floor(stats.xpPoints / 500) : 3} Scholar
            </span>
            <span className="badge-sage px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-700 fill-current" />
              <span>{stats?.streakDays || 6} Day Streak!</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.name}!
          </h1>

          <p className="text-sm text-purple-100 font-bold">
            Track your assessment metrics, review completed quizzes, and explore new learning tracks.
          </p>

          <div className="pt-2">
            <button
              onClick={onNavigateToDiscovery}
              className="btn-yellow-pastel px-5 py-2.5 rounded-xl text-xs font-black inline-flex items-center space-x-2 shadow-lg"
            >
              <span>Explore Learning Tracks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Quizzes Attempted
            </span>
            <div className="p-2.5 rounded-xl badge-purple">
              <BookOpen className="w-4 h-4 text-purple-800" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{stats?.quizzesAttempted || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Average Score
            </span>
            <div className="p-2.5 rounded-xl badge-sage">
              <Target className="w-4 h-4 text-emerald-800" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.averageScore || 0}%</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Highest Score
            </span>
            <div className="p-2.5 rounded-xl badge-yellow">
              <Trophy className="w-4 h-4 text-amber-800" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-yellow-400">{stats?.highestScore || 0}%</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Pass / Fail Ratio
            </span>
            <div className="p-2.5 rounded-xl badge-sage">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            </div>
          </div>
          <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">
            <span className="text-emerald-600 dark:text-emerald-400">{stats?.quizzesPassed || 0} Passed</span> /{' '}
            <span className="text-rose-500">{stats?.quizzesFailed || 0} Failed</span>
          </p>
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Attempts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              <span>Recent Attempt History</span>
            </h2>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">You haven't attempted any quizzes yet.</p>
              <button onClick={onNavigateToDiscovery} className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black">
                Explore Subjects Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  onClick={() => onViewResult(attempt.id)}
                  className="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">{attempt.quizTitle}</h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Completed on {new Date(attempt.completedAt).toLocaleDateString()} • {Math.round(attempt.timeTakenSeconds / 60)}m taken
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-black text-base text-slate-900 dark:text-slate-100">{attempt.percentage}%</span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${attempt.status === 'PASSED' ? 'badge-sage' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'}`}>
                      {attempt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recommended Modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Recommended Subjects</span>
          </h2>

          <div className="space-y-3">
            {recommendedQuizzes.map((q) => (
              <div
                key={q.id}
                onClick={() => onSelectQuiz(q.id)}
                className="glass-card p-4 rounded-2xl hover:border-amber-400 cursor-pointer transition space-y-2 border border-purple-300/30"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-purple px-2 py-0.5 rounded text-[10px] font-black">{q.categoryName}</span>
                  <span className="text-xs font-black text-amber-600 dark:text-yellow-400">{q.duration}m</span>
                </div>
                <h4 className="font-black text-slate-900 dark:text-slate-100 text-xs line-clamp-1">{q.title}</h4>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-1 border-t border-purple-300/20">
                  <span>Pass: {q.passingScore}%</span>
                  <span className="text-amber-600 dark:text-yellow-400 flex items-center">
                    Start Quiz <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
