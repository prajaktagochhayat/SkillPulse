import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Quiz, Chapter } from '../../types';
import { ArrowLeft, Clock, Award, CheckCircle2, Play, BookOpen, ChevronDown, ChevronUp, Code, Sparkles } from 'lucide-react';

interface QuizDetailsProps {
  quizId: string;
  onBack: () => void;
  onStartQuiz: (quizId: string) => void;
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
        className="flex items-center space-x-2 text-xs font-black text-slate-800 dark:text-slate-200 hover:text-amber-500 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Tracks</span>
      </button>

      {/* Subject Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="badge-purple px-3 py-1 rounded-full text-xs font-extrabold">
              {quiz.categoryName}
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{quiz.title}</h1>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{quiz.description}</p>
          </div>

          <button
            onClick={() => onStartQuiz(quiz.id)}
            className="btn-yellow-pastel px-6 py-3 rounded-2xl text-xs font-black shrink-0 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Play className="w-4 h-4 text-amber-800 fill-current" />
            <span>Start Full Subject Assessment</span>
          </button>
        </div>

        {/* Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl glass-card-sub text-xs font-black border border-purple-300/30">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase">Difficulty</span>
            <p className="text-purple-900 dark:text-purple-200">{quiz.difficulty}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase">Time Limit</span>
            <p className="text-amber-600 dark:text-yellow-400">{quiz.duration} Mins</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase">Passing Score</span>
            <p className="text-emerald-600 dark:text-emerald-400">{quiz.passingScore}%</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase">Total Chapters</span>
            <p className="text-slate-900 dark:text-slate-100">{chapters.length} Chapters</p>
          </div>
        </div>
      </div>

      {/* Chapters Breakdown Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Subject Chapters & Study Overviews
          </h2>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Select Overview to study notes or Quiz to test knowledge
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl text-center text-xs font-bold text-slate-700 dark:text-slate-300">
            Chapter details coming soon for this subject module.
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((ch, idx) => {
              const isOverviewOpen = expandedOverviewId === ch.id;

              return (
                <div key={ch.id || idx} className="glass-card rounded-2xl overflow-hidden transition border border-purple-300/30">
                  {/* Chapter Header Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 glass-card-sub">
                    <div className="space-y-1">
                      <span className="badge-purple px-2.5 py-0.5 rounded-lg text-[10px] font-black">
                        Chapter {ch.chapterNumber || idx + 1}
                      </span>
                      <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">{ch.title}</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{ch.description}</p>
                    </div>

                    {/* Action Tabs: Overview Tab & Quiz Tab */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => toggleOverview(ch.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition ${
                          isOverviewOpen
                            ? 'bg-purple-600 text-white shadow'
                            : 'badge-purple hover:bg-purple-200'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Overview Tab</span>
                        {isOverviewOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onStartQuiz(quiz.id)}
                        className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-800 fill-current" />
                        <span>Quiz Tab</span>
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
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
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
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
                            <Code className="w-4 h-4 text-purple-600" />
                            <span>Syntax Example</span>
                          </h4>
                          <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-purple-800/40">
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
        )}
      </div>
    </div>
  );
};
