import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { User, QuizAttempt, StudentStats } from '../../types';
import { Search, UserCheck, UserX, Trash2, Eye, History, Award, Mail, Calendar, ShieldAlert } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<StudentStats | null>(null);
  const [userHistory, setUserHistory] = useState<QuizAttempt[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await api.getUsers();
    setUsers(list.filter((u) => u.role === 'STUDENT'));
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await api.updateUserStatus(user.id, nextStatus);
    loadUsers();
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student account? This action cannot be undone.')) {
      await api.deleteUser(id);
      loadUsers();
    }
  };

  const handleInspectUser = async (user: User) => {
    setSelectedUser(user);
    const stats = await api.getStudentStats(user.id);
    const history = await api.getAttemptsByUserId(user.id);
    setUserStats(stats);
    setUserHistory(history);
    setShowProfileModal(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-sm text-slate-400">Manage registered students, view academic history, and toggle access.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold text-xs border-b border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-slate-100">{user.name}</div>
                      <div className="text-xs text-slate-400 sm:hidden">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 hidden sm:table-cell">{user.email}</td>
                  <td className="p-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleInspectUser(user)}
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"
                      title="Inspect Student Profile & History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1.5 rounded-lg transition border ${
                        user.status === 'ACTIVE'
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20'
                      }`}
                      title={user.status === 'ACTIVE' ? 'Deactivate Student' : 'Activate Student'}
                    >
                      {user.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No student accounts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Inspection Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{selectedUser.name}</h2>
                  <p className="text-xs text-slate-400 flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5" /> <span>{selectedUser.email}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Performance Stats Cards */}
            {userStats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">Quizzes Attempted</p>
                  <p className="text-xl font-extrabold text-slate-100 mt-1">{userStats.quizzesAttempted}</p>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">Average Score</p>
                  <p className="text-xl font-extrabold text-blue-400 mt-1">{userStats.averageScore}%</p>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs text-slate-400">Highest Score</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">{userStats.highestScore}%</p>
                </div>
              </div>
            )}

            {/* Quiz Attempt History */}
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Quiz Attempt History ({userHistory.length})</span>
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {userHistory.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{att.quizTitle}</div>
                      <div className="text-[11px] text-slate-400">{new Date(att.completedAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-100">{att.percentage}%</div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          att.status === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  </div>
                ))}
                {userHistory.length === 0 && <p className="text-xs text-slate-400 italic">No quiz attempts recorded yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
