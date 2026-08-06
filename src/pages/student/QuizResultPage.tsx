import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { QuizAttempt, Question } from '../../types';
import { Trophy, CheckCircle2, XCircle, ArrowLeft, Download, RefreshCw, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateModal } from '../../components/student/CertificateModal';

interface QuizResultPageProps {
  attemptId: string;
  onBackToDashboard: () => void;
}

export const QuizResultPage: React.FC<QuizResultPageProps> = ({ attemptId, onBackToDashboard }) => {
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    const data = await api.getAttemptById(attemptId);
    if (data) {
      setAttempt(data);
      const qList = await api.getQuestionsByQuizId(data.quizId);
      setQuestions(qList);

      if (data.status === 'PASSED') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  if (!attempt) {
    return (
      <div className="p-12 text-center text-slate-800 dark:text-slate-200">
        <p>Loading result report...</p>
      </div>
    );
  }

  const isPassed = attempt.status === 'PASSED';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header Controls with Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-amber-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Tracks</span>
        </button>

        {isPassed && (
          <button
            onClick={() => setShowCertificate(true)}
            className="btn-sage-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-2 shadow"
          >
            <Award className="w-4 h-4 text-emerald-800" />
            <span>Download Certificate PDF</span>
          </button>
        )}
      </div>

      {/* Result Hero Card */}
      <div className="glass-card p-8 rounded-3xl text-center space-y-4 relative overflow-hidden">
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
            isPassed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
          }`}
        >
          {isPassed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <div className="space-y-1">
          <span className={`px-3 py-1 rounded-full text-xs font-black ${isPassed ? 'badge-sage' : 'bg-rose-500/20 text-rose-500'}`}>
            {isPassed ? 'PASSED ASSESSENT' : 'FAILED - NEEDS REVISION'}
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{attempt.quizTitle}</h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Official Verification ID: <span className="font-mono text-purple-600 dark:text-purple-300">{attempt.certificateId}</span>
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-4 text-center">
          <div className="p-3 rounded-2xl glass-card-sub">
            <span className="text-[10px] text-slate-500 uppercase font-black">Score</span>
            <p className="text-2xl font-black text-amber-600 dark:text-yellow-400">{attempt.score} / {attempt.totalMarks}</p>
          </div>
          <div className="p-3 rounded-2xl glass-card-sub">
            <span className="text-[10px] text-slate-500 uppercase font-black">Percentage</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-300">{attempt.percentage}%</p>
          </div>
          <div className="p-3 rounded-2xl glass-card-sub">
            <span className="text-[10px] text-slate-500 uppercase font-black">Correct</span>
            <p className="text-2xl font-black text-emerald-600">{attempt.correctAnswersCount}</p>
          </div>
          <div className="p-3 rounded-2xl glass-card-sub">
            <span className="text-[10px] text-slate-500 uppercase font-black">Incorrect</span>
            <p className="text-2xl font-black text-rose-500">{attempt.incorrectAnswersCount}</p>
          </div>
        </div>
      </div>

      {/* Answer Breakdown List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Question Answer Analysis</h2>
        <div className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const question = questions.find((q) => q.id === ans.questionId);
            return (
              <div key={idx} className="glass-card p-5 rounded-2xl space-y-2 border border-purple-300/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 dark:text-slate-100">Question {idx + 1}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg font-black ${ans.isCorrect ? 'badge-sage' : 'bg-rose-500/20 text-rose-500'}`}>
                    {ans.isCorrect ? `+${ans.scoreObtained} Marks` : `${ans.scoreObtained} Marks`}
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-slate-100">{question?.questionText || 'Question'}</p>
                {question?.explanation && (
                  <div className="p-3 rounded-xl glass-card-sub text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-amber-600 font-black block">Explanation:</span>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showCertificate && <CertificateModal attempt={attempt} onClose={() => setShowCertificate(false)} />}
    </div>
  );
};
