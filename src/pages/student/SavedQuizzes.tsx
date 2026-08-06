import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Quiz } from '../../types';
import { Bookmark, Clock, Award, ArrowRight, BookmarkCheck } from 'lucide-react';

interface SavedQuizzesProps {
  onSelectQuiz: (quizId: string) => void;
}

export const SavedQuizzes: React.FC<SavedQuizzesProps> = ({ onSelectQuiz }) => {
  const { user, toggleBookmark } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    loadSaved();
  }, [user]);

  const loadSaved = async () => {
    if (!user) return;
    const all = await api.getQuizzes('STUDENT');
    const savedIds = user.savedQuizIds || [];
    setQuizzes(all.filter((q) => savedIds.includes(q.id)));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 light:text-purple-950 flex items-center space-x-2">
          <Bookmark className="w-6 h-6 text-yellow-400" />
          <span>My Bookmarked Quizzes</span>
        </h1>
        <p className="text-sm text-purple-300 light:text-purple-700">Quizzes you have saved to complete or retake later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="glass-card rounded-2xl border border-purple-800/30 overflow-hidden flex flex-col justify-between hover:border-yellow-400/50 transition group"
          >
            <div>
              <div className="relative h-40 overflow-hidden bg-slate-800">
                <img
                  src={quiz.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'}
                  alt={quiz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={() => toggleBookmark(quiz.id)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-purple-950/80 text-yellow-400 border border-yellow-400/50"
                  title="Remove Bookmark"
                >
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-purple-500/20 text-yellow-300 border border-purple-400">
                  {quiz.categoryName}
                </span>
                <h3 className="font-bold text-slate-100 light:text-purple-950 text-base line-clamp-1">{quiz.title}</h3>
                <p className="text-xs text-purple-300 light:text-purple-700 line-clamp-2">{quiz.description}</p>
              </div>
            </div>

            <div className="p-4 bg-purple-950/60 light:bg-purple-100 border-t border-purple-800/30 flex items-center justify-between">
              <span className="text-xs text-purple-300 light:text-purple-800 font-semibold">{quiz.duration} Mins</span>
              <button
                onClick={() => onSelectQuiz(quiz.id)}
                className="btn-yellow px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5"
              >
                <span>Start Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full glass-card p-12 text-center rounded-2xl border border-purple-800/30">
            <Bookmark className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="font-bold text-slate-200 light:text-purple-950">No saved quizzes yet.</p>
            <p className="text-xs text-purple-300 light:text-purple-700 mt-1">Bookmark quizzes in the Discovery catalog to access them quickly here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
