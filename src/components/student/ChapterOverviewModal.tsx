import React from 'react';
import type { Chapter } from '../../types';
import { BookOpen, CheckCircle2, Code, ArrowRight, X, Sparkles } from 'lucide-react';

interface ChapterOverviewModalProps {
  chapter: Chapter;
  onClose: () => void;
  onStartQuiz: () => void;
}

export const ChapterOverviewModal: React.FC<ChapterOverviewModalProps> = ({
  chapter,
  onClose,
  onStartQuiz,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2">
          <span className="badge-purple px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Chapter Study Guide</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{chapter.title}</h2>
          <p className="text-xs text-purple-950 dark:text-purple-200 font-medium">{chapter.description}</p>
        </div>

        {/* Overview Summary Box */}
        <div className="p-4 rounded-2xl glass-card-sub space-y-2">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Chapter Overview & Summary</span>
          </h3>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{chapter.summaryNotes}</p>
        </div>

        {/* Key Concepts Takeaway List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Key Concepts to Master
          </h3>
          <div className="space-y-2">
            {chapter.keyConcepts.map((concept, idx) => (
              <div key={idx} className="p-3 rounded-xl badge-sage flex items-start space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Example Snippet */}
        {chapter.codeExample && (
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Syntax & Code Example</span>
            </h3>
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-purple-800/40">
              <code>{chapter.codeExample}</code>
            </pre>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-purple-300/20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Close Study Guide
          </button>

          <button
            onClick={() => {
              onClose();
              onStartQuiz();
            }}
            className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg"
          >
            <span>Continue to Chapter Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
