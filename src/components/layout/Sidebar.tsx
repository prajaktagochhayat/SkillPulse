import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  History,
  Trophy,
  Users,
  FolderTree,
  HelpCircle,
  BarChart2,
  Gamepad2,
  Bookmark,
  ShieldCheck,
  Award,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const studentLinks = [
    { id: 'discovery', label: 'Learning Tracks', icon: BookOpen },
    { id: 'games-arcade', label: 'Interactive Games Arcade', icon: Gamepad2 },
    { id: 'saved-quizzes', label: 'My Bookmarks', icon: Bookmark },
    { id: 'attempt-history', label: 'My Attempt History', icon: History },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: Trophy },
    { id: 'cert-scanner', label: 'Verify Certificate', icon: ShieldCheck },
    { id: 'profile-settings', label: 'Profile Settings', icon: Settings },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: BarChart2 },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'quiz-management', label: 'Quiz Management', icon: BookOpen },
    { id: 'category-management', label: 'Category Management', icon: FolderTree },
    { id: 'question-management', label: 'Question Bank & Import', icon: HelpCircle },
    { id: 'attempt-history', label: 'Attempt Results', icon: History },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const links = role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 glass-card border-r border-purple-300/30 min-h-[calc(100vh-4rem)] p-4 space-y-6 shrink-0 hidden md:block">
      <div className="space-y-1">
        <span className="text-[10px] font-black text-purple-950 dark:text-purple-300 uppercase tracking-widest px-3 block">
          {role === 'ADMIN' ? 'ADMIN PORTAL' : 'STUDENT PORTAL'}
        </span>
        <nav className="space-y-1 pt-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  isActive
                    ? 'btn-yellow-pastel text-purple-950 shadow-md font-black'
                    : 'text-purple-950 dark:text-purple-100 hover:bg-purple-500/15'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-950 font-black' : 'text-purple-800 dark:text-purple-300'}`} />
                <span className="truncate profile-name-text">{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="pt-4 border-t border-purple-300/20 space-y-2">
          <div className="glass-card-sub p-3 rounded-2xl flex items-center space-x-3">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-amber-400 object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-black text-purple-950 dark:text-purple-100 truncate profile-name-text">
                {user.name}
              </p>
              <p className="text-[10px] text-purple-900 dark:text-purple-300 truncate profile-email-text">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
