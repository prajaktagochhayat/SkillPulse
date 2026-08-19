import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api } from '../services/api';
import { initializeDatabase } from '../services/db';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  toggleBookmark: (quizId: string) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isLoading, setIsLoading] = useState(true);

  const applyTheme = (nextTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    root.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  };

  useEffect(() => {
    initializeDatabase();
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    const savedTheme = (localStorage.getItem('quizhub_theme_v4') as 'dark' | 'light') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('quizhub_theme_v4', nextTheme);
    applyTheme(nextTheme);
  };

  const login = async (email: string, password?: string) => {
    const loggedUser = await api.login(email, password);
    setUser(loggedUser);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const registered = await api.register(name, email, password, role);
    setUser(registered);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const toggleBookmark = async (quizId: string) => {
    if (!user) return;
    const updatedBookmarks = await api.toggleBookmarkQuiz(user.id, quizId);
    setUser((prev) => (prev ? { ...prev, savedQuizIds: updatedBookmarks } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'STUDENT',
        login,
        register,
        logout,
        toggleBookmark,
        theme,
        toggleTheme,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
