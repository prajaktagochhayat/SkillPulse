import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Sun, Moon, LogOut, Flame, Sparkles, Zap, ArrowLeft, Settings } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, role, logout, theme, toggleTheme } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const canGoBack = currentTab !== 'student-dashboard' && currentTab !== 'admin-dashboard';

  const handleBackNavigation = () => {
    if (currentTab === 'quiz-details' || currentTab === 'quiz-attempt' || currentTab === 'quiz-result') {
      setCurrentTab('quiz-discovery');
    } else {
      setCurrentTab(role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-card px-4 lg:px-8 py-3.5 transition-colors duration-200 border-b border-purple-300/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Universal Back Navigation Arrow */}
          <div className="flex items-center space-x-3">
            {user && canGoBack && (
              <button
                onClick={handleBackNavigation}
                className="p-2 rounded-xl badge-purple hover:bg-purple-200 transition flex items-center space-x-1.5 text-xs font-black"
                title="Go Back to Previous Screen"
              >
                <ArrowLeft className="w-4 h-4 text-purple-900" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setCurrentTab(role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition">
                <Zap className="w-6 h-6 text-purple-950 font-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-xl tracking-tight text-slate-900 dark:text-slate-100">
                    Skill<span className="text-amber-500 dark:text-yellow-300">Pulse</span>
                  </span>
                  {user && (
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                        role === 'ADMIN' ? 'badge-purple' : 'badge-sage'
                      }`}
                    >
                      {role}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:block font-bold">
                  Engineering Assessment Platform
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Study Streak Badge for logged in student */}
            {user && role === 'STUDENT' && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl badge-yellow text-xs font-black">
                <Flame className="w-4 h-4 text-amber-700 fill-current animate-bounce" />
                <span>9 Day Streak!</span>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl badge-purple transition hover:scale-105 flex items-center space-x-1.5"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold hidden md:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-900" />
                  <span className="text-xs font-bold hidden md:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Auth Profile / Settings Clickable Badge */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-purple-300/30 pl-3">
                <button
                  onClick={() => setCurrentTab('profile-settings')}
                  className="flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-purple-500/10 transition group text-left"
                  title="Profile Settings & Avatar Selector"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover shadow group-hover:scale-105 transition"
                  />
                  <div className="hidden md:block">
                    <div className="text-xs profile-name-text line-clamp-1">{user.name}</div>
                    <div className="text-[10px] profile-email-text line-clamp-1">{user.email}</div>
                  </div>
                  <Settings className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300 hidden md:block group-hover:rotate-45 transition duration-200" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 transition"
                  title="Logout Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
