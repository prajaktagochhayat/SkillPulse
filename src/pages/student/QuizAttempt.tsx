import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Question, Quiz } from '../../types';
import { Clock, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, FileCheck } from 'lucide-react';

interface QuizAttemptProps {
  quizId: string;
  chapterId?: string;
  onFinishAttempt: (attemptId: string) => void;
  onCancel: () => void;
}

export const QuizAttemptComponent: React.FC<QuizAttemptProps> = ({ quizId, chapterId, onFinishAttempt, onCancel }) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // User selections
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { selectedOptionIds: string[]; textAnswer?: string }>
  >({});

  // Countdown timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    startAttempt();
  }, [quizId, chapterId]);

  const startAttempt = async () => {
    if (!user) return;
    try {
      const quizData = await api.getQuizById(quizId);
      setQuiz(quizData);

      const res = await api.startQuizAttempt(quizId, chapterId);
      setQuestions(res.questions);
      if (quizData) {
        setTimeLeftSeconds(quizData.duration * 60);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to start attempt session.');
    }
  };

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmitAttempt();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionIds: [optionId],
      },
    }));
  };

  const handleSubmitAttempt = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(userAnswers).map(([qId, ans]) => ({
        questionId: qId,
        selectedOptionIds: ans.selectedOptionIds,
        textAnswer: ans.textAnswer,
      }));

      const elapsed = quiz ? quiz.duration * 60 - timeLeftSeconds : 300;
      const attempt = await api.submitQuizAttempt(quizId, user.id, formattedAnswers, Math.max(10, elapsed), chapterId);

      onFinishAttempt(attempt.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit quiz attempt.');
      setIsSubmitting(false);
    }
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-800 dark:text-slate-200">
        <p>Initializing Chapter Quiz Session...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const formattedMinutes = Math.floor(timeLeftSeconds / 60);
  const formattedSeconds = timeLeftSeconds % 60;
  const isLastQ = currentIdx === questions.length - 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Header Bar */}
      <div className="glass-card rounded-3xl p-6 border border-purple-300/30 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">{quiz.title}</span>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 profile-name-text mt-1">
            Question {currentIdx + 1} of {questions.length}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 badge-yellow px-4 py-2 rounded-2xl text-xs font-black">
            <Clock className="w-4 h-4 text-amber-900" />
            <span>
              {String(formattedMinutes).padStart(2, '0')}:{String(formattedSeconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-black"
          >
            Cancel Attempt
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-black">
          {errorMsg}
        </div>
      )}

      {/* Main Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-purple-300/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-300/20 pb-4">
          <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">
            {currentQ.difficulty || 'Intermediate'} • {currentQ.marks || 1} Mark
          </span>
          <span className="text-xs font-black text-purple-900 dark:text-purple-300">
            Progress: {Math.round(((currentIdx + 1) / questions.length) * 100)}%
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 profile-name-text">
          {currentQ.questionText}
        </h3>

        {/* Options Selection Grid */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = userAnswers[currentQ.id]?.selectedOptionIds.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between font-bold text-xs ${
                  isSelected
                    ? 'btn-yellow-pastel text-purple-950 shadow-md border-amber-400 font-black'
                    : 'glass-card-sub text-slate-900 dark:text-slate-100 border-purple-300/30 hover:bg-purple-500/10'
                }`}
              >
                <span className="profile-name-text">{opt.optionText}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-950 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-purple-300/20">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-2xl badge-purple disabled:opacity-30 text-xs font-black flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4 text-purple-900" />
            <span>Previous</span>
          </button>

          {isLastQ ? (
            <button
              onClick={handleSubmitAttempt}
              disabled={isSubmitting}
              className="btn-yellow-pastel px-6 py-3 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg"
            >
              <FileCheck className="w-4 h-4 text-amber-900" />
              <span>{isSubmitting ? 'Submitting Score...' : 'Submit Assessment'}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="btn-yellow-pastel px-6 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4 text-amber-900" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
