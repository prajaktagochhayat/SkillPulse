import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { QuizAttempt } from '../../types';
import { FileCheck, Search, Filter, Eye, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';

export const AdminAttempts: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    const raw = (await import('../../services/db')).getItem<QuizAttempt>('quizhub_attempts');
    setAttempts(raw);
  };

  const filtered = attempts.filter((a) => {
    const matchesSearch =
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">All Quiz Attempts & Monitoring</h1>
          <p className="text-sm text-slate-400">Review student submission logs, scores, and evaluation breakdowns.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student or quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PASSED">Passed Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold text-xs border-b border-slate-800">
              <tr>
                <th className="p-4">Attempt ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Quiz Title</th>
                <th className="p-4">Score</th>
                <th className="p-4">Time Taken</th>
                <th className="p-4">Status</th>
                <th className="p-4">Completed Date</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 font-mono text-xs text-slate-400">{att.id.slice(0, 10)}</td>
                  <td className="p-4 font-semibold text-slate-100">{att.userName}</td>
                  <td className="p-4 text-slate-200">{att.quizTitle}</td>
                  <td className="p-4 font-bold text-blue-400">{att.percentage}%</td>
                  <td className="p-4 text-slate-400">
                    {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        att.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(att.completedAt).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedAttempt(att)}
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No quiz attempts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{selectedAttempt.quizTitle}</h2>
                <p className="text-xs text-slate-400">Submitted by {selectedAttempt.userName}</p>
              </div>
              <button onClick={() => setSelectedAttempt(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Score Percentage</span>
                <p className="text-2xl font-extrabold text-blue-400 mt-0.5">{selectedAttempt.percentage}%</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Evaluation Result</span>
                <p
                  className={`text-2xl font-extrabold mt-0.5 ${
                    selectedAttempt.status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedAttempt.status}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span className="font-bold text-emerald-400">{selectedAttempt.correctAnswersCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Incorrect Answers:</span>
                <span className="font-bold text-rose-400">{selectedAttempt.incorrectAnswersCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-bold text-slate-400">{selectedAttempt.unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Time Spent:</span>
                <span className="font-bold text-slate-200">
                  {Math.floor(selectedAttempt.timeTakenSeconds / 60)}m {selectedAttempt.timeTakenSeconds % 60}s
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
