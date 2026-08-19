import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingHeroPage } from './pages/LandingHeroPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { QuizDiscovery } from './pages/student/QuizDiscovery';
import { QuizDetails } from './pages/student/QuizDetails';
import { QuizAttemptComponent } from './pages/student/QuizAttempt';
import { QuizResultPage } from './pages/student/QuizResultPage';
import { SavedQuizzes } from './pages/student/SavedQuizzes';
import { AttemptHistory } from './pages/student/AttemptHistory';
import { LeaderboardPage } from './pages/student/LeaderboardPage';
import { TechGamesPage } from './pages/student/TechGamesPage';
import { ProfileSettingsPage } from './pages/student/ProfileSettingsPage';
import { CertificateScannerPage } from './pages/student/CertificateScannerPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { QuizManagement } from './pages/admin/QuizManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { QuestionManagement } from './pages/admin/QuestionManagement';
import { AdminAttempts } from './pages/admin/AdminAttempts';
import { AuthModal } from './components/auth/AuthModal';

import type { QuizAttempt as QuizAttemptType } from './types';

const MainAppContent: React.FC = () => {
  const { user, role } = useAuth();
  const [currentView, setCurrentView] = useState<string>('discovery');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [lastCompletedAttempt, setLastCompletedAttempt] = useState<QuizAttemptType | null>(null);
  const [showAuthModalModal, setShowAuthModalModal] = useState(false);

  const handleNavigate = (view: string, id?: string) => {
    if (id) {
      if (view === 'quiz-details') setSelectedQuizId(id);
      if (view === 'quiz-attempt') setActiveAttemptId(id);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAttempt = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentView('quiz-attempt');
  };

  const handleAttemptCompleted = (attempt: QuizAttemptType) => {
    setLastCompletedAttempt(attempt);
    setCurrentView('quiz-result');
  };

  const renderView = () => {
    if (!user) {
      return <LandingHeroPage onOpenAuth={() => setShowAuthModalModal(true)} />;
    }

    switch (currentView) {
      case 'discovery':
        return <QuizDiscovery onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />;
      case 'quiz-details':
        return selectedQuizId ? (
          <QuizDetails
            quizId={selectedQuizId}
            onBack={() => handleNavigate('discovery')}
            onStartQuiz={() => handleStartAttempt(selectedQuizId)}
          />
        ) : (
          <QuizDiscovery onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />
        );
      case 'quiz-attempt':
        return selectedQuizId ? (
          <QuizAttemptComponent
            quizId={selectedQuizId}
            onCancel={() => handleNavigate('quiz-details', selectedQuizId)}
            onFinishAttempt={() => handleNavigate('attempt-history')}
          />
        ) : (
          <QuizDiscovery onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />
        );
      case 'quiz-result':
        return lastCompletedAttempt ? (
          <QuizResultPage
            attempt={lastCompletedAttempt}
            onRetake={() => handleStartAttempt(lastCompletedAttempt.quizId)}
            onBackToDashboard={() => handleNavigate('discovery')}
          />
        ) : (
          <QuizDiscovery onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />
        );
      case 'games-arcade':
        return <TechGamesPage onNavigate={handleNavigate} />;
      case 'saved-quizzes':
        return <SavedQuizzes onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />;
      case 'attempt-history':
        return <AttemptHistory onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'cert-scanner':
        return <CertificateScannerPage />;
      case 'profile-settings':
        return <ProfileSettingsPage onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'user-management':
        return <UserManagement />;
      case 'quiz-management':
        return <QuizManagement />;
      case 'category-management':
        return <CategoryManagement />;
      case 'question-management':
        return <QuestionManagement />;
      default:
        return role === 'ADMIN' ? <AdminDashboard /> : <QuizDiscovery onSelectQuiz={(id) => handleNavigate('quiz-details', id)} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar currentView={currentView} onNavigate={handleNavigate} onOpenAuth={() => setShowAuthModalModal(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user && <Sidebar currentView={currentView} onNavigate={handleNavigate} />}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{renderView()}</main>
      </div>

      {showAuthModalModal && <AuthModal onClose={() => setShowAuthModalModal(false)} />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
