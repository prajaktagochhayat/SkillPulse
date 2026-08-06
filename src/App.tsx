import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { QuizManagement } from './pages/admin/QuizManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { QuestionManagement } from './pages/admin/QuestionManagement';
import { AdminAttempts } from './pages/admin/AdminAttempts';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { QuizDiscovery } from './pages/student/QuizDiscovery';
import { SavedQuizzes } from './pages/student/SavedQuizzes';
import { QuizDetails } from './pages/student/QuizDetails';
import { QuizAttemptComponent } from './pages/student/QuizAttempt';
import { QuizResultPage } from './pages/student/QuizResultPage';
import { AttemptHistory } from './pages/student/AttemptHistory';
import { LeaderboardPage } from './pages/student/LeaderboardPage';
import { TechGamesPage } from './pages/student/TechGamesPage';
import { ProfileSettingsPage } from './pages/student/ProfileSettingsPage';

import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, BookOpen, Trophy, Zap, Gamepad2 } from 'lucide-react';
import { api } from './services/api';
import type { QuizAttempt } from './types';

const AppContent: React.FC = () => {
  const { role, user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('student-dashboard');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Universal Certificate Verification Lookup State
  const [certLookupId, setCertLookupId] = useState('');
  const [verifiedCert, setVerifiedCert] = useState<QuizAttempt | null>(null);
  const [certLookupMsg, setCertLookupMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        setCurrentTab('admin-dashboard');
      } else {
        setCurrentTab('student-dashboard');
      }
    }
  }, [user]);

  const handleSelectQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentTab('quiz-details');
  };

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentTab('quiz-attempt');
  };

  const handleFinishAttempt = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentTab('quiz-result');
  };

  const handleViewResult = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentTab('quiz-result');
  };

  const handleVerifyCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertLookupMsg('');
    setVerifiedCert(null);

    if (!certLookupId.trim()) return;

    const found = await api.verifyCertificate(certLookupId.trim());
    if (found) {
      setVerifiedCert(found);
    } else {
      setCertLookupMsg('No official certificate record found matching this verification ID.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Initializing SkillPulse Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-300 selection:text-purple-950">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main App Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user ? (
          <>
            {/* Sidebar Navigation */}
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {/* Main Content Viewport */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
              {/* ADMIN VIEWS */}
              {user.role === 'ADMIN' && (
                <>
                  {currentTab === 'admin-dashboard' && <AdminDashboard />}
                  {currentTab === 'admin-users' && <UserManagement />}
                  {currentTab === 'admin-quizzes' && <QuizManagement />}
                  {currentTab === 'admin-categories' && <CategoryManagement />}
                  {currentTab === 'admin-questions' && <QuestionManagement />}
                  {currentTab === 'admin-attempts' && <AdminAttempts />}
                </>
              )}

              {/* STUDENT VIEWS */}
              {user.role === 'STUDENT' && (
                <>
                  {currentTab === 'student-dashboard' && (
                    <StudentDashboard
                      onSelectQuiz={handleSelectQuiz}
                      onViewResult={handleViewResult}
                      onNavigateToDiscovery={() => setCurrentTab('quiz-discovery')}
                    />
                  )}
                  {currentTab === 'quiz-discovery' && (
                    <QuizDiscovery onSelectQuiz={handleSelectQuiz} onStartQuiz={handleStartQuiz} />
                  )}
                  {currentTab === 'tech-games' && <TechGamesPage />}
                  {currentTab === 'saved-quizzes' && <SavedQuizzes onSelectQuiz={handleSelectQuiz} />}
                  {currentTab === 'quiz-details' && activeQuizId && (
                    <QuizDetails
                      quizId={activeQuizId}
                      onBack={() => setCurrentTab('quiz-discovery')}
                      onStartQuiz={handleStartQuiz}
                    />
                  )}
                  {currentTab === 'quiz-attempt' && activeQuizId && (
                    <QuizAttemptComponent
                      quizId={activeQuizId}
                      onFinishAttempt={handleFinishAttempt}
                      onCancel={() => setCurrentTab('quiz-discovery')}
                    />
                  )}
                  {currentTab === 'quiz-result' && activeAttemptId && (
                    <QuizResultPage
                      attemptId={activeAttemptId}
                      onBackToDashboard={() => setCurrentTab('student-dashboard')}
                    />
                  )}
                  {currentTab === 'attempt-history' && <AttemptHistory onViewResult={handleViewResult} />}
                  {currentTab === 'profile-settings' && (
                    <ProfileSettingsPage onBack={() => setCurrentTab('student-dashboard')} />
                  )}
                </>
              )}

              {/* Shared Views */}
              {currentTab === 'leaderboard' && <LeaderboardPage />}
            </main>
          </>
        ) : (
          /* Unauthenticated Landing & Verification Hero */
          <div className="flex-1 p-6 lg:p-12 space-y-12 max-w-5xl mx-auto text-center animate-fadeIn">
            {/* Hero Card Container */}
            <div className="glass-card p-8 sm:p-14 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
              {/* Character Avatars Row */}
              <div className="flex justify-center -space-x-3 mb-2">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix"
                  alt="Student Character"
                  className="w-14 h-14 rounded-full border-4 border-amber-300 shadow-md bg-purple-100"
                />
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prajakta"
                  alt="Student Character"
                  className="w-14 h-14 rounded-full border-4 border-emerald-400 shadow-md bg-purple-100"
                />
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Luna"
                  alt="Student Character"
                  className="w-14 h-14 rounded-full border-4 border-purple-400 shadow-md bg-purple-100"
                />
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <span className="badge-sage px-3.5 py-1 rounded-full text-xs uppercase tracking-wider inline-flex items-center space-x-1.5 font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen Engineering Assessment Platform</span>
                </span>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  Empower Your Engineering & Tech Mastery with <span className="text-amber-600 dark:text-yellow-300">SkillPulse</span>
                </h1>

                <p className="text-base text-slate-800 dark:text-slate-200 max-w-xl mx-auto font-bold leading-relaxed">
                  Explore structured domain chapters, test your coding knowledge with real-time feedback, and earn verified industry credentials.
                </p>
              </div>

              {/* Action Pill Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-yellow-pastel px-8 py-3.5 rounded-2xl text-sm font-black flex items-center space-x-2 shadow-xl"
                >
                  <Zap className="w-4 h-4 text-amber-800" />
                  <span>Sign In or Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-purple-300/20 text-left">
                <div className="p-4 rounded-2xl glass-card-sub flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl badge-yellow shrink-0">
                    <BookOpen className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-xs">Chapter Overviews</h3>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-bold">Concise study notes & code examples before quizzes.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-sub flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl badge-sage shrink-0">
                    <Gamepad2 className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-xs">Interactive Arcade</h3>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-bold">10 distinct coding & system mini-games.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-sub flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl badge-purple shrink-0">
                    <Trophy className="w-5 h-5 text-purple-800" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-xs">Verified Credentials</h3>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 font-bold">Downloadable & universally verifiable certificates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Verification Utility */}
            <div className="glass-card p-6 rounded-3xl space-y-4 max-w-xl mx-auto text-left">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Verify Official Certificate</h3>
              </div>

              <form onSubmit={handleVerifyCertificate} className="flex space-x-2">
                <input
                  type="text"
                  value={certLookupId}
                  onChange={(e) => setCertLookupId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. QZ-ATT101-998)..."
                  className="flex-1 px-4 py-2.5 glass-card-sub rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-400 font-mono font-bold"
                />
                <button type="submit" className="btn-sage-pastel px-5 py-2.5 rounded-xl text-xs font-black shrink-0">
                  Verify Code
                </button>
              </form>

              {verifiedCert && (
                <div className="p-4 rounded-2xl badge-sage text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Official Valid Certificate</span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">
                    Awarded to <strong>{verifiedCert.userName}</strong> for completing{' '}
                    <strong>{verifiedCert.quizTitle}</strong> with <strong>{verifiedCert.percentage}%</strong> score.
                  </p>
                </div>
              )}

              {certLookupMsg && <p className="text-xs text-rose-600 dark:text-rose-300 font-bold">{certLookupMsg}</p>}
            </div>
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
