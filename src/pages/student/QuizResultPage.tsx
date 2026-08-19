import React, { useEffect, useState } from 'react';
import type { QuizAttempt } from '../../types';
import { Trophy, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateModal } from '../../components/student/CertificateModal';

interface QuizResultPageProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const QuizResultPage: React.FC<QuizResultPageProps> = ({ attempt, onRetake, onBackToDashboard }) => {
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (attempt.status === 'PASSED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [attempt]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Result Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-300/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl badge-purple mx-auto flex items-center justify-center shadow-lg">
            {attempt.status === 'PASSED' ? (
              <Trophy className="w-9 h-9 text-amber-500" />
            ) : (
              <XCircle className="w-9 h-9 text-rose-500" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {attempt.status === 'PASSED' ? 'Congratulations! You Passed!' : 'Assessment Incomplete'}
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {attempt.quizTitle} Assessment Submission Breakdown
          </p>
        </div>

        {/* Score Summary Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 glass-card-sub rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-950 dark:text-purple-300">Final Score</span>
            <p className="text-2xl font-black text-purple-950 dark:text-purple-100 profile-name-text">
              {attempt.percentage}%
            </p>
          </div>

          <div className="p-4 glass-card-sub rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-950 dark:text-purple-300">Marks Obtained</span>
            <p className="text-2xl font-black text-purple-950 dark:text-purple-100 profile-name-text">
              {attempt.score}/{attempt.totalMarks}
            </p>
          </div>

          <div className="p-4 glass-card-sub rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-950 dark:text-purple-300">Correct Answers</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {attempt.correctAnswersCount}
            </p>
          </div>

          <div className="p-4 glass-card-sub rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-950 dark:text-purple-300">Time Spent</span>
            <p className="text-2xl font-black text-amber-500">
              {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
            </p>
          </div>
        </div>

        {/* Certificate Button */}
        {attempt.status === 'PASSED' && (
          <div className="pt-4 border-t border-purple-300/20">
            <button
              onClick={() => setShowCertificate(true)}
              className="btn-yellow-pastel px-6 py-3 rounded-2xl text-xs font-black inline-flex items-center space-x-2 shadow-lg hover:scale-105 transition transform"
            >
              <Award className="w-5 h-5 text-amber-900" />
              <span>Claim & Print Official Award Certificate</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onBackToDashboard}
            className="px-6 py-2.5 rounded-2xl glass-card-sub text-xs font-black text-slate-800 dark:text-slate-200 inline-flex items-center space-x-2 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Learning Tracks</span>
          </button>
          <button
            onClick={onRetake}
            className="px-6 py-2.5 rounded-2xl badge-purple text-xs font-black text-purple-950 dark:text-purple-100 inline-flex items-center space-x-2 hover:bg-purple-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {showCertificate && (
        <CertificateModal attempt={attempt} onClose={() => setShowCertificate(false)} />
      )}
    </div>
  );
};
