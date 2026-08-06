import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Quiz, Category } from '../../types';
import { Search, Clock, Award, ArrowRight, Bookmark, BookmarkCheck, Star, Layers, Sparkles } from 'lucide-react';

interface QuizDiscoveryProps {
  onSelectQuiz: (quizId: string) => void;
  onStartQuiz: (quizId: string) => void;
}

export const QuizDiscovery: React.FC<QuizDiscoveryProps> = ({ onSelectQuiz }) => {
  const { user, toggleBookmark } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const qList = await api.getQuizzes('STUDENT');
    const cList = await api.getCategories();
    setQuizzes(qList);
    setCategories(cList);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || q.categoryId === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const isBookmarked = (quizId: string) => {
    return user?.savedQuizIds ? user.savedQuizIds.includes(quizId) : false;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Engineering Learning Tracks & Skill Modules
        </h1>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Select a subject to explore its chapters, study overviews, and chapter quizzes.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-purple-700 dark:text-purple-300 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search subjects, Python, Java, SQL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 glass-card-sub rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full font-bold"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2.5 glass-card-sub rounded-2xl text-xs font-black text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="ALL">All Engineering Subjects</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const bookmarked = isBookmarked(quiz.id);

          return (
            <div
              key={quiz.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between hover:border-amber-400/60 transition group hover:shadow-xl"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden bg-purple-950">
                  <img
                    src={quiz.thumbnailUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 badge-purple px-2.5 py-0.5 rounded-lg text-xs font-black">
                    {quiz.categoryName}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(quiz.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-purple-950/80 text-yellow-400 border border-yellow-400/40 hover:bg-purple-900 transition"
                    title={bookmarked ? 'Remove Bookmark' : 'Save Quiz'}
                  >
                    {bookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-purple-900 dark:text-purple-200">{quiz.difficulty}</span>
                    <span className="flex items-center text-amber-700 dark:text-yellow-400 font-black">
                      <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-500" />
                      {quiz.averageRating || '4.9'}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-lg group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2">{quiz.description}</p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-black text-slate-800 dark:text-slate-200 pt-2 border-t border-purple-300/20">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{quiz.duration} Mins</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 glass-card-sub flex items-center justify-between border-t border-purple-300/20">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
                  <span>{quiz.chapters ? quiz.chapters.length : 4} Chapters</span>
                </span>
                <button
                  onClick={() => onSelectQuiz(quiz.id)}
                  className="btn-yellow-pastel px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow"
                >
                  <span>Explore Subject Chapters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
