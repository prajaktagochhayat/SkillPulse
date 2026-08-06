import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { LeaderboardEntry } from '../../types';
import { Trophy, Award, Flame, Search, Crown, Sparkles } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const list = await api.getLeaderboard();
    setEntries(list);
  };

  const filteredEntries = entries.filter((e) =>
    e.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topChampion = entries[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            <span>Global Academic Leaderboard & XP</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Rankings based on average percentage, completed quizzes, accuracy, and arcade XP!
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-purple-600 dark:text-purple-300 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400 w-full font-bold"
          />
        </div>
      </div>

      {/* Champion Podium Card */}
      {topChampion && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 text-center space-y-4 bg-gradient-to-tr from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto">
              <Crown className="w-7 h-7 text-amber-400" />
            </div>

            <div className="relative inline-block">
              <img
                src={topChampion.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topChampion.userName}`}
                alt={topChampion.userName}
                className="w-24 h-24 rounded-full border-4 border-amber-400 object-cover mx-auto shadow-2xl bg-purple-900"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 badge-yellow px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                Rank #1 Champion
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">{topChampion.userName}</h2>
              <p className="text-xs text-purple-200 font-bold">{topChampion.totalQuizzesCompleted} Quizzes Passed</p>
            </div>

            <div className="inline-flex items-center space-x-4 bg-purple-950/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-amber-400/40">
              <div className="text-center">
                <span className="text-[10px] text-amber-300 uppercase font-black">Average Score</span>
                <p className="text-xl font-black text-white">{topChampion.averageScore}% Avg</p>
              </div>
              <div className="h-6 w-px bg-amber-400/30"></div>
              <div className="text-center">
                <span className="text-[10px] text-amber-300 uppercase font-black">Arcade XP</span>
                <p className="text-xl font-black text-amber-400">{topChampion.xpPoints || 3200} XP</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-purple-300/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-950/10 dark:bg-purple-950/40 border-b border-purple-300/30 text-purple-950 dark:text-purple-200 uppercase tracking-wider font-black">
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Average Score</th>
                <th className="p-4">Highest Score</th>
                <th className="p-4">Quizzes Passed</th>
                <th className="p-4 text-right">Arcade XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-300/20">
              {filteredEntries.map((entry) => (
                <tr key={entry.userId} className="hover:bg-purple-500/10 transition">
                  <td className="p-4 font-black">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        entry.rank === 1
                          ? 'badge-yellow'
                          : entry.rank === 2
                          ? 'badge-sage'
                          : entry.rank === 3
                          ? 'badge-purple'
                          : 'glass-card-sub text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={entry.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.userName}`}
                        alt={entry.userName}
                        className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover shadow"
                      />
                      <div>
                        <div className="font-black text-slate-900 dark:text-slate-100 text-sm">{entry.userName}</div>
                        <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">{entry.userEmail}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-black text-purple-900 dark:text-purple-200 text-sm">
                    {entry.averageScore}%
                  </td>

                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {entry.highestScore}%
                  </td>

                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                    {entry.totalQuizzesPassed} Passed
                  </td>

                  <td className="p-4 text-right font-black text-amber-600 dark:text-yellow-400 text-sm">
                    ⚡ {entry.xpPoints || 3200} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
