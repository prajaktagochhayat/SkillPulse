import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  HelpCircle,
  Trophy,
  History,
  Compass,
  FileCheck,
  ChevronRight,
  Bookmark,
  Gamepad2,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { role, user } = useAuth();

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-quizzes', label: 'Quiz Management', icon: BookOpen },
    { id: 'admin-categories', label: 'Category Management', icon: FolderTree },
    { id: 'admin-questions', label: 'Question Bank & Import', icon: HelpCircle },
    { id: 'admin-attempts', label: 'Attempt Results', icon: FileCheck },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const studentNavItems = [
    { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'quiz-discovery', label: 'Learning Tracks', icon: Compass },
    { id: 'tech-games', label: 'Interactive Games Arcade', icon: Gamepad2 },
    { id: 'saved-quizzes', label: 'My Bookmarks', icon: Bookmark },
    { id: 'attempt-history', label: 'My Attempt History', icon: History },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: Trophy },
    { id: 'profile-settings', label: 'Profile Settings', icon: Settings },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 glass-card p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] transition-colors border-r border-purple-300/20">
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider px-3 mb-2">
            {role === 'ADMIN' ? 'Admin Portal' : 'Student Navigation'}
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all duration-150 ${
                    isActive
                      ? 'badge-purple text-purple-950 dark:text-purple-100 shadow-sm border border-purple-400'
                      : 'nav-link-inactive hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700 dark:text-purple-300' : 'text-purple-600 dark:text-purple-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-purple-700 dark:text-purple-300" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Session Info Card */}
      {user && (
        <div
          onClick={() => setCurrentTab('profile-settings')}
          className="p-3.5 rounded-2xl glass-card-sub text-xs space-y-1 border border-purple-300/30 cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between font-black text-slate-900 dark:text-slate-100">
            <span>Role Session</span>
            <span className="badge-yellow px-2 py-0.5 rounded-md text-[10px]">{user.role}</span>
          </div>
          <p className="text-[11px] profile-name-text line-clamp-1">{user.name}</p>
          <p className="text-[10px] profile-email-text line-clamp-1">{user.email}</p>
        </div>
      )}
    </aside>
  );
};
