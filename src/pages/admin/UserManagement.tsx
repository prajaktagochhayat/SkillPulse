import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { User } from '../../types';
import { Users, Search, UserCheck, UserX, Trash2, Eye } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await api.getUsers();
    setUsers(list);
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await api.updateUserStatus(user.id, nextStatus);
    loadUsers();
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      await api.deleteUser(id);
      loadUsers();
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Users className="w-7 h-7 text-purple-600 dark:text-purple-300" />
            <span>User Management</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Manage registered students, view academic history, and toggle access.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-purple-600 dark:text-purple-300 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400 w-full font-bold"
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-purple-300/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-950/10 dark:bg-purple-950/40 border-b border-purple-300/30 text-purple-950 dark:text-purple-200 uppercase tracking-wider font-black">
                <th className="p-4">Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-300/20">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-purple-500/10 transition bg-white/50 dark:bg-slate-900/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover shadow"
                      />
                      <span className="font-black text-sm text-purple-950 dark:text-purple-100 profile-name-text">
                        {u.name}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-purple-900 dark:text-purple-200 profile-email-text">
                    {u.email}
                  </td>

                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black ${
                        u.status === 'ACTIVE'
                          ? 'badge-sage'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className="p-2 rounded-xl badge-purple hover:bg-purple-200 text-purple-900 transition"
                      title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                    >
                      {u.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
