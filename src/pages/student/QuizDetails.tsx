import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Quiz, Chapter } from '../../types';
import { ArrowLeft, Clock, Award, CheckCircle2, Play, BookOpen, ChevronDown, ChevronUp, Code, Sparkles } from 'lucide-react';

interface QuizDetailsProps {
  quizId: string;
  onBack: () => void;
  onStartQuiz: (quizId: string, chapterId?: string) => void;
}

export const QuizDetails: React.FC<QuizDetailsProps> = ({ quizId, onBack, onStartQuiz }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedOverviewId, setExpandedOverviewId] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    const data = await api.getQuizById(quizId);
    if (data) {
      setQuiz(data);
      const chs = await api.getChaptersByQuizId(quizId);
      setChapters(chs.length > 0 ? chs : (data.chapters || []));
    }
  };

  const toggleOverview = (chId: string) => {
    setExpandedOverviewId((prev) => (prev === chId ? null : chId));
  };

  if (!quiz) {
    return (
      <div className="p-8 text-center text-slate-800 dark:text-slate-200">
        <p>Loading subject details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2.5 rounded-2xl badge-purple text-xs font-black flex items-center space-x-2 shadow"
      >
        <ArrowLeft className="w-4 h-4 text-purple-900" />
        <span>Back to Learning Tracks Catalog</span>
      </button>

      {/* Hero Subject Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 border border-purple-300/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">{quiz.categoryName}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 profile-name-text">
              {quiz.title}
            </h1>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold max-w-xl">{quiz.description}</p>
          </div>

          <button
            onClick={() => onStartQuiz(quiz.id)}
            className="btn-yellow-pastel px-6 py-3.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-xl shrink-0"
          >
            <Play className="w-4 h-4 text-amber-900 fill-amber-900" />
            <span>Full Track Assessment</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-purple-300/20 text-xs font-bold">
          <div className="p-3 glass-card-sub rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Total Chapters</span>
            <span className="font-black text-purple-950 dark:text-purple-100">{chapters.length} Chapters</span>
          </div>
          <div className="p-3 glass-card-sub rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Questions per Chapter</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">12-15 Chapter Quizzes</span>
          </div>
          <div className="p-3 glass-card-sub rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Pass Score</span>
            <span className="font-black text-amber-500">{quiz.passingScore}% Pass</span>
          </div>
          <div className="p-3 glass-card-sub rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Difficulty</span>
            <span className="font-black text-purple-600 dark:text-purple-300">{quiz.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Chapters Hierarchy Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 profile-name-text">
          Subject Chapters & Chapter Assessment Quizzes ({chapters.length} Chapters)
        </h2>

        <div className="space-y-4">
          {chapters.map((ch, idx) => {
            const isOverviewOpen = expandedOverviewId === ch.id;
            return (
              <div
                key={ch.id}
                className="glass-card rounded-3xl overflow-hidden border border-purple-300/30 shadow-lg transition"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="badge-purple px-2.5 py-0.5 rounded text-[10px] font-black">CHAPTER {idx + 1}</span>
                      <span className="badge-yellow px-2 py-0.5 rounded text-[10px] font-black">12-15 QUESTIONS</span>
                    </div>
                    <h3 className="font-black text-base text-slate-900 dark:text-slate-100 profile-name-text">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{ch.description}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => toggleOverview(ch.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition ${
                        isOverviewOpen ? 'bg-purple-600 text-white shadow' : 'badge-purple hover:bg-purple-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Overview Tab</span>
                      {isOverviewOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onStartQuiz(quiz.id, ch.id)}
                      className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-800 fill-current" />
                      <span>Chapter Quiz Tab</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Overview Tab Content */}
                {isOverviewOpen && (
                  <div className="p-5 space-y-4 bg-purple-950/5 border-t border-purple-300/30 animate-fadeIn">
                    <div className="p-4 rounded-xl glass-card-sub space-y-2">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Chapter Overview Notes</span>
                      </h4>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed whitespace-pre-line">
                        {ch.summaryNotes}
                      </p>
                    </div>

                    {ch.keyConcepts && ch.keyConcepts.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                          Key Takeaways & Core Concepts
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ch.keyConcepts.map((kc, kIdx) => (
                            <div key={kIdx} className="p-2.5 rounded-xl badge-sage text-xs flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{kc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ch.codeExample && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1">
                          <Code className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                          <span>Code Example Snippet</span>
                        </h4>
                        <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
                          <code>{ch.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
