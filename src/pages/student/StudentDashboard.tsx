import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { QuizAttempt, StudentStats, Quiz } from '../../types';
import { Award, BookOpen, Trophy, ArrowRight, Clock, Flame, CheckCircle2 } from 'lucide-react';

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
    const studentStats = await api.getStudentStats(user.id);
    setStats(studentStats);

    const attempts = await api.getAttemptsByUserId(user.id);
    setRecentAttempts(attempts.slice(0, 4));

    const quizzes = await api.getQuizzes('STUDENT');
    setRecommendedQuizzes(quizzes.slice(0, 3));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="badge-purple px-3 py-1 rounded-full text-xs font-black">
              STUDENT ACADEMIC DASHBOARD
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>

          <p className="text-xs text-purple-100 font-bold max-w-2xl">
            Track your assessment statistics, review attempt history, practice subject chapters, and climb the global academic leaderboard.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToDiscovery}
              className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black inline-flex items-center space-x-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-amber-900" />
              <span>Explore All 18 Learning Tracks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Attempted
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
              Passed
            </span>
            <div className="p-2.5 rounded-xl badge-sage">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.quizzesPassed || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Earned XP
            </span>
            <div className="p-2.5 rounded-xl badge-yellow">
              <Trophy className="w-4 h-4 text-amber-800" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-yellow-400">{stats?.xpPoints || 1400}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Active Streak
            </span>
            <div className="p-2.5 rounded-xl badge-purple">
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-300">{stats?.streakDays || 6} Days</p>
        </div>
      </div>

      {/* Recommended Quizzes */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Award className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          <span>Recommended Learning Tracks</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="glass-card rounded-3xl p-5 border border-purple-300/30 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">
                    {quiz.categoryName}
                  </span>
                  <span className="badge-yellow px-2.5 py-0.5 rounded text-[10px] font-black">
                    ★ {quiz.averageRating || 4.9}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base line-clamp-1 profile-name-text">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2">{quiz.description}</p>
              </div>

              <div className="pt-4 border-t border-purple-300/20 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{quiz.duration} Mins</span>
                </div>

                <button
                  onClick={() => onSelectQuiz(quiz.id)}
                  className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1 shadow"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
