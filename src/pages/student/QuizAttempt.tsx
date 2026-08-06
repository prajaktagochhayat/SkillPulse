import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Question, Quiz } from '../../types';
import { Clock, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, FileCheck } from 'lucide-react';

interface QuizAttemptProps {
  quizId: string;
  onFinishAttempt: (attemptId: string) => void;
  onCancel: () => void;
}

export const QuizAttemptComponent: React.FC<QuizAttemptProps> = ({ quizId, onFinishAttempt, onCancel }) => {
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
  }, [quizId]);

  const startAttempt = async () => {
    if (!user) return;
    try {
      const quizData = await api.getQuizById(quizId);
      setQuiz(quizData);

      const res = await api.startQuizAttempt(quizId, user.id);
      setQuestions(res.questions);

      const durationSec = (quizData?.duration || 20) * 60;
      setTimeLeftSeconds(durationSec);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const handleAutoSubmit = () => {
    submitAttempt();
  };

  const handleSelectOption = (questionId: string, optionId: string, isMultiple: boolean) => {
    setUserAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIds || [];
      let updated: string[];

      if (isMultiple) {
        updated = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      } else {
        updated = [optionId];
      }

      return {
        ...prev,
        [questionId]: { ...prev[questionId], selectedOptionIds: updated },
      };
    });
  };

  const submitAttempt = async () => {
    if (!user || !quiz) return;
    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(userAnswers).map(([qId, val]) => ({
        questionId: qId,
        selectedOptionIds: val.selectedOptionIds,
        textAnswer: val.textAnswer,
      }));

      const elapsed = quiz.duration * 60 - timeLeftSeconds;
      const attempt = await api.submitQuizAttempt(quiz.id, user.id, formattedAnswers, Math.max(1, elapsed));
      onFinishAttempt(attempt.id);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (errorMsg) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Attempt Blocked</h2>
        <p className="text-xs text-rose-500 font-bold">{errorMsg}</p>
        <button onClick={onCancel} className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black">
          Back to Learning Tracks
        </button>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-400 animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Preparing Assessment Questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const currentSelection = userAnswers[currentQ?.id]?.selectedOptionIds || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header Bar with Back Navigation */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-purple-300/30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit? Unsubmitted progress will be lost.')) {
                onCancel();
              }
            }}
            className="p-2 rounded-xl badge-purple hover:bg-purple-200 transition flex items-center space-x-1 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4 text-purple-900" />
            <span>Back to Subject</span>
          </button>

          <div>
            <h1 className="text-base font-black text-slate-900 dark:text-slate-100 line-clamp-1">{quiz.title}</h1>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
              Question {currentIdx + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center space-x-2 badge-yellow px-4 py-2 rounded-xl text-xs font-black">
          <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="badge-purple px-2.5 py-0.5 rounded-lg font-black">
              {currentQ.difficulty || 'Intermediate'}
            </span>
            <span className="font-black text-slate-800 dark:text-slate-200">{currentQ.marks || 1} Mark(s)</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{currentQ.questionText}</h2>
        </div>

        {/* Options Grid */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = currentSelection.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id, currentQ.type === 'multiple')}
                className={`p-4 rounded-2xl border text-xs font-bold cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'badge-yellow shadow-md border-amber-400'
                    : 'glass-card-sub text-slate-900 dark:text-slate-100 hover:border-amber-400'
                }`}
              >
                <span>{opt.optionText}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-700" />}
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-4 border-t border-purple-300/20 flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 disabled:opacity-40 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              className="btn-yellow-pastel px-6 py-2 rounded-xl text-xs font-black flex items-center space-x-1"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitAttempt}
              disabled={isSubmitting}
              className="btn-sage-pastel px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
