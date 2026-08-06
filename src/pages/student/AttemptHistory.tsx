import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { QuizAttempt } from '../../types';
import { History, Eye, Award } from 'lucide-react';

interface AttemptHistoryProps {
  onViewResult: (attemptId: string) => void;
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({ onViewResult }) => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (user) {
      loadAttempts();
    }
  }, [user]);

  const loadAttempts = async () => {
    if (!user) return;
    const list = await api.getAttemptsByUserId(user.id);
    setAttempts(list);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <History className="w-7 h-7 text-purple-600 dark:text-purple-300" />
          <span>My Quiz Attempt History</span>
        </h1>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Review all your previous assessment submissions and detailed score reports.
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">No Assessment History Found</h3>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            You haven't completed any quizzes yet. Explore learning tracks to get started!
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-purple-300/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-purple-950/10 dark:bg-purple-950/40 border-b border-purple-300/30 text-purple-950 dark:text-purple-200 uppercase tracking-wider font-black">
                  <th className="p-4">Quiz Title</th>
                  <th className="p-4">Completed Date</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Time Spent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-300/20">
                {attempts.map((att) => (
                  <tr
                    key={att.id}
                    onClick={() => onViewResult(att.id)}
                    className="hover:bg-purple-500/10 cursor-pointer transition bg-white/50 dark:bg-slate-900/50"
                  >
                    <td className="p-4 font-black text-sm text-purple-950 dark:text-purple-100 profile-name-text">
                      {att.quizTitle}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {new Date(att.completedAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-black text-amber-600 dark:text-yellow-400 text-sm">
                      {att.percentage}%
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-black ${
                          att.status === 'PASSED' ? 'badge-sage' : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewResult(att.id);
                        }}
                        className="p-2 rounded-xl badge-purple text-purple-900 hover:bg-purple-200 inline-flex items-center space-x-1 font-black"
                        title="View Detailed Report"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
