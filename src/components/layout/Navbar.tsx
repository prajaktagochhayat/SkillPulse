import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Sun, Moon, LogOut, Flame, Sparkles, Zap, ArrowLeft, Settings, User } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, role, logout, theme, toggleTheme } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const canGoBack = currentView !== 'discovery' && currentView !== 'admin-dashboard' && currentView !== 'hero';

  const handleBackNavigation = () => {
    if (currentView === 'quiz-details' || currentView === 'quiz-attempt' || currentView === 'quiz-result') {
      onNavigate('discovery');
    } else {
      onNavigate(role === 'ADMIN' ? 'admin-dashboard' : 'discovery');
    }
  };

  const handleTriggerAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setShowAuthModal(true);
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
              onClick={() => onNavigate(user ? (role === 'ADMIN' ? 'admin-dashboard' : 'discovery') : 'hero')}
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
                <p className="text-[10px] text-purple-900 dark:text-purple-300 font-bold hidden sm:block">
                  Engineering Assessment Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle (Default Light Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl glass-card-sub hover:bg-purple-500/20 text-purple-950 dark:text-purple-200 transition flex items-center space-x-2 text-xs font-black"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-700" />
                  <span className="hidden md:inline">Dark Mode</span>
                </>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Profile Badge Link to Settings */}
                <button
                  onClick={() => onNavigate('profile-settings')}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl glass-card-sub hover:bg-purple-500/20 transition border border-purple-300/30"
                  title="Click for Profile Settings & Avatar Gallery"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-amber-400 object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-purple-950 dark:text-purple-100 leading-tight profile-name-text">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-purple-900 dark:text-purple-300 leading-tight profile-email-text">{user.email}</p>
                  </div>
                  <Settings className="w-3.5 h-3.5 text-purple-800 dark:text-purple-300 ml-1" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleTriggerAuth}
                className="btn-yellow-pastel px-5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg hover:scale-105 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-900" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
