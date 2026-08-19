import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Quiz } from '../../types';
import { Bookmark, Clock, ArrowRight, BookmarkCheck } from 'lucide-react';

interface SavedQuizzesProps {
  onSelectQuiz: (quizId: string) => void;
  onNavigate: (view: string) => void;
}

export const SavedQuizzes: React.FC<SavedQuizzesProps> = ({ onSelectQuiz, onNavigate }) => {
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
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Bookmark className="w-7 h-7 text-amber-500" />
            <span>My Bookmarked Tracks</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Quick access to subject learning tracks saved for revision and practice.
          </p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-purple-300/30">
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any subject track card in Learning Tracks to save it here for fast revision!
          </p>
          <button
            onClick={() => onNavigate('discovery')}
            className="btn-yellow-pastel px-6 py-2.5 rounded-xl text-xs font-black"
          >
            Browse Learning Tracks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="glass-card rounded-3xl p-5 border border-purple-300/30 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-purple px-3 py-1 rounded-xl text-xs font-black">
                    {quiz.categoryName}
                  </span>
                  <button
                    onClick={() => toggleBookmark(quiz.id)}
                    className="p-2 rounded-xl badge-yellow text-amber-900 transition"
                    title="Remove Bookmark"
                  >
                    <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-500" />
                  </button>
                </div>

                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base line-clamp-1 profile-name-text">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2">{quiz.description}</p>
              </div>

              <div className="pt-4 border-t border-purple-300/20 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{quiz.duration} Mins</span>
                </div>

                <button
                  onClick={() => onSelectQuiz(quiz.id)}
                  className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1 shadow"
                >
                  <span>Explore Subject</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
